from datetime import timedelta
import re
from uuid import uuid4

from flask import Blueprint, Flask, jsonify, request
from flask_jwt_extended import create_access_token

from .data import (
    active_exam,
    assistant_suggestions,
    courses,
    dashboard_summary,
    exams,
    create_student_profile,
    find_student_by_name,
    get_exam_payload,
    get_student_profile,
    leaderboard,
    list_student_profiles,
    notifications,
    question_bank,
    results,
    scheduled_exams,
    teacher_uploads,
)
from .question_importer import extract_text_from_file, parse_questions_from_text

api = Blueprint("api", __name__, url_prefix="/api")


def format_schedule_items(items):
    if not items:
        return "There are no scheduled exams matching that request right now."
    return " | ".join(
        f"{item['title']} for {item['className']} on {item['examDate']} at {item['examTime']} ({item['subject']}, {item['totalMarks']} marks)"
        for item in items[:4]
    )


def assistant_reply(message: str) -> str:
    query = (message or "").strip()
    lowered = query.lower()

    if not query:
        return "Ask me about students, schedules, results, the mathematics demo paper, or even a small arithmetic problem."

    math_match = re.fullmatch(r"\s*(?:what is\s+)?(\d+)\s*([+\-*/])\s*(\d+)\??\s*", lowered)
    if math_match:
        left = int(math_match.group(1))
        operator = math_match.group(2)
        right = int(math_match.group(3))
        if operator == "+":
            answer = left + right
        elif operator == "-":
            answer = left - right
        elif operator == "*":
            answer = left * right
        else:
            answer = "undefined" if right == 0 else round(left / right, 2)
        return f"The answer is {answer}."

    if "question" in lowered and ("how many" in lowered or "count" in lowered):
        return f"The live mathematics paper currently has {len(question_bank)} questions and {active_exam['totalMarks']} total marks."

    if "registered student" in lowered or "students are registered" in lowered or "student list" in lowered:
        names = ", ".join(f"{student['name']} ({student['className']})" for student in list_student_profiles())
        return f"Registered students right now: {names}."

    if "upcoming exam" in lowered or "scheduled exam" in lowered or "schedule" in lowered:
        class_match = re.search(r"class\s+\d+\s*[a-z]?", lowered)
        if class_match:
          target = class_match.group(0).title().replace("  ", " ")
          matches = [item for item in scheduled_exams if item["className"].lower() == target.lower()]
          return format_schedule_items(matches)
        return format_schedule_items(scheduled_exams)

    if "result" in lowered or "score" in lowered or "average" in lowered:
        for student in list_student_profiles():
            if student["name"].lower() in lowered:
                profile = get_student_profile(student["slug"])
                matched_results = [item for item in results if item["studentName"].lower() == profile["name"].lower()]
                if not matched_results:
                    return f"{profile['name']} has no saved exam result yet."
                avg = round(sum(item["percentage"] for item in matched_results) / len(matched_results), 2)
                latest = matched_results[0]
                return (
                    f"{profile['name']} has {len(matched_results)} saved result(s). "
                    f"Latest score: {latest['score']}/{latest['total']} in {latest['examTitle']}. "
                    f"Average percentage: {avg}%."
                )

    if "aarav" in lowered or "siya" in lowered or "student" in lowered:
        for student in list_student_profiles():
            if student["name"].split()[0].lower() in lowered or student["name"].lower() in lowered:
                profile = find_student_by_name(student["name"])
                return (
                    f"{profile['name']} is in {profile['className']}. "
                    f"Current readiness score is {profile['stats']['readinessScore']}, "
                    f"completed exams: {profile['stats']['completedExams']}, "
                    f"and target exam is {profile['targetExam']}."
                )

    if "how to" in lowered or "help" in lowered or "use" in lowered:
        return (
            "Use Students Section to register students, Question Bank to add questions, Exam Schedule to publish exams, "
            "Exam Portal to select a student and attempt the test, and Results to review saved scores."
        )

    if "leaderboard" in lowered:
        top = ", ".join(f"#{item['rank']} {item['name']} ({item['score']}%)" for item in leaderboard[:3])
        return f"Top leaderboard positions right now: {top}."

    if "certificate" in lowered:
        return "Certificates are available after result publication. You can extend the current workflow later to auto-generate certificate PDFs per student."

    return (
        "I can help with schedules, registered students, saved results, question counts, leaderboard summaries, and simple math. "
        "Try asking: 'Show upcoming exams for Class 10 A' or 'What is Aarav Mehta's average score?'"
    )


def append_questions_to_bank(parsed_questions, subject="Mathematics", class_name="Class 10 A", created_by="Imported Document"):
    created = []
    for parsed in parsed_questions:
        entry = {
            "id": f"q-{len(question_bank) + 1:02d}",
            "prompt": parsed["prompt"],
            "options": parsed["options"],
            "correctAnswer": parsed["correctAnswer"],
            "marks": int(parsed.get("marks", 1)),
            "subject": subject,
            "className": class_name,
            "difficulty": parsed.get("difficulty", "Imported"),
            "createdBy": created_by,
        }
        question_bank.append(entry)
        created.append(entry)
    active_exam["questions"] = question_bank
    active_exam["totalQuestions"] = len(question_bank)
    active_exam["totalMarks"] = len(question_bank)
    return created


@api.get("/health")
def health_check():
    return jsonify({"status": "ok", "product": "AstraExam Cloud"})


@api.get("/assistant/suggestions")
def get_assistant_suggestions():
    return jsonify(assistant_suggestions)


@api.post("/assistant/chat")
def chat_with_assistant():
    payload = request.get_json(silent=True) or {}
    message = payload.get("message", "")
    return jsonify({"reply": assistant_reply(message)})


@api.post("/auth/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = payload.get("email", "demo@astraexam.com")
    role = payload.get("role", "student")

    token = create_access_token(
        identity={"email": email, "role": role},
        expires_delta=timedelta(hours=8),
        additional_claims={"provider": "email"},
    )
    return jsonify({"accessToken": token, "user": dashboard_summary.get(role, dashboard_summary["student"])})


@api.post("/auth/google")
def google_login():
    token = create_access_token(
        identity={"email": "google.user@astraexam.com", "role": "student"},
        expires_delta=timedelta(hours=8),
        additional_claims={"provider": "google"},
    )
    return jsonify({"accessToken": token, "message": "Google OAuth flow placeholder ready for integration."})


@api.get("/dashboard/<role>")
def get_dashboard(role: str):
    return jsonify(dashboard_summary.get(role, dashboard_summary["student"]))


@api.get("/notifications")
def get_notifications():
    return jsonify(notifications)


@api.get("/exams")
def get_exams():
    return jsonify(exams)


@api.get("/exams/demo-paper")
def get_demo_paper():
    return jsonify(get_exam_payload())


@api.get("/questions")
def get_questions():
    return jsonify(question_bank)


@api.post("/questions")
def create_question_bank_entry():
    payload = request.get_json(silent=True) or {}
    prompt = payload.get("prompt", "").strip()
    options = payload.get("options", [])
    subject = payload.get("subject", "Mathematics")
    class_name = payload.get("className", "Class 10 A")
    correct_answer = payload.get("correctAnswer")

    if not prompt or len(options) != 4 or correct_answer in (None, ""):
        return jsonify({"message": "Question prompt, four options, and correct answer are required."}), 400

    entry = {
        "id": f"q-{len(question_bank) + 1:02d}",
        "prompt": prompt,
        "options": options,
        "correctAnswer": correct_answer,
        "marks": int(payload.get("marks", 1)),
        "subject": subject,
        "className": class_name,
        "difficulty": payload.get("difficulty", "Easy"),
        "createdBy": payload.get("createdBy", "Dr. Naina Kapoor"),
    }
    question_bank.append(entry)
    active_exam["questions"] = question_bank
    active_exam["totalQuestions"] = len(question_bank)
    active_exam["totalMarks"] = len(question_bank)
    return jsonify(entry), 201


@api.get("/teacher/uploads")
def get_teacher_uploads():
    return jsonify(teacher_uploads)


@api.post("/teacher/questions")
def create_teacher_question():
    payload = request.get_json(silent=True) or {}
    prompt = payload.get("prompt", "").strip()
    options = payload.get("options", [])
    correct_answer = payload.get("correctAnswer")
    teacher = payload.get("teacher", "Dr. Naina Kapoor")

    if not prompt or len(options) != 4 or correct_answer in (None, ""):
        return jsonify({"message": "Prompt, four options, and a correct answer are required."}), 400

    next_id = f"q-{len(question_bank) + 1:02d}"
    question = {
        "id": next_id,
        "prompt": prompt,
        "options": options,
        "correctAnswer": correct_answer,
        "marks": 1,
    }
    question_bank.append(question)
    active_exam["questions"] = question_bank
    active_exam["totalQuestions"] = len(question_bank)
    active_exam["totalMarks"] = len(question_bank)
    exams[0]["title"] = active_exam["title"]

    teacher_uploads.insert(
        0,
        {
            "id": f"upload-{uuid4().hex[:6]}",
            "topic": payload.get("topic", "Custom Upload"),
            "teacher": teacher,
            "count": 1,
            "status": "Published",
            "uploadedAt": payload.get("uploadedAt", "Live now"),
        },
    )
    return jsonify(question), 201


@api.post("/teacher/import-question-file")
def import_teacher_question_file():
    uploaded_file = request.files.get("file")
    teacher = request.form.get("teacher", "Dr. Naina Kapoor")
    topic = request.form.get("topic", "Imported Question Paper")
    subject = request.form.get("subject", "Mathematics")
    class_name = request.form.get("className", "Class 10 A")

    if uploaded_file is None or not uploaded_file.filename:
        return jsonify({"message": "Please attach a PDF, DOCX, DOC, or TXT file."}), 400

    try:
        extracted_text = extract_text_from_file(uploaded_file)
        parsed_questions = parse_questions_from_text(extracted_text)
    except ValueError as error:
        return jsonify({"message": str(error)}), 400
    except Exception:
        return jsonify({"message": "The file could not be processed. Please use a cleaner PDF or DOCX format."}), 400

    if not parsed_questions:
        return jsonify({"message": "No usable questions were found in the file. Include MCQs or arithmetic-style question lines."}), 400

    created = append_questions_to_bank(parsed_questions, subject=subject, class_name=class_name, created_by=teacher)
    teacher_uploads.insert(
        0,
        {
            "id": f"upload-{uuid4().hex[:6]}",
            "topic": topic,
            "teacher": teacher,
            "count": len(created),
            "status": "Imported",
            "uploadedAt": "Live now",
        },
    )
    return jsonify(
        {
            "message": f"{len(created)} questions imported successfully.",
            "count": len(created),
            "questions": created[:5],
        }
    ), 201


@api.get("/results")
def get_results():
    ordered = sorted(results, key=lambda item: item["percentage"], reverse=True)
    return jsonify(ordered)


@api.post("/results")
def submit_result():
    payload = request.get_json(silent=True) or {}
    student_name = payload.get("studentName", "Guest Student").strip() or "Guest Student"
    answers = payload.get("answers", {})

    correct = 0
    answer_review = []
    for question in question_bank:
        selected = answers.get(question["id"])
        is_correct = selected == question["correctAnswer"]
        if is_correct:
            correct += 1
        answer_review.append(
            {
                "questionId": question["id"],
                "prompt": question["prompt"],
                "selectedAnswer": selected,
                "correctAnswer": question["correctAnswer"],
                "isCorrect": is_correct,
            }
        )

    total = len(question_bank)
    percentage = round((correct / total) * 100, 2) if total else 0
    result = {
        "resultId": f"result-{uuid4().hex[:8]}",
        "studentName": student_name,
        "examId": active_exam["id"],
        "examTitle": active_exam["title"],
        "score": correct,
        "total": total,
        "percentage": percentage,
        "submittedAt": payload.get("submittedAt", "Just now"),
        "correctAnswers": correct,
        "wrongAnswers": total - correct,
        "answerReview": answer_review,
    }
    results.insert(0, result)
    return jsonify(result), 201


@api.get("/schedule")
def get_schedule():
    ordered = sorted(scheduled_exams, key=lambda item: (item["examDate"], item["examTime"]))
    return jsonify(ordered)


@api.post("/schedule")
def create_schedule():
    payload = request.get_json(silent=True) or {}
    required_fields = ["title", "className", "subject", "totalMarks", "examDate", "examTime"]
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    schedule = {
        "id": f"sched-{uuid4().hex[:6]}",
        "title": payload["title"],
        "className": payload["className"],
        "subject": payload["subject"],
        "totalMarks": int(payload["totalMarks"]),
        "examDate": payload["examDate"],
        "examTime": payload["examTime"],
        "durationMinutes": int(payload.get("durationMinutes", 30)),
        "status": payload.get("status", "Published"),
        "examCode": payload.get("examCode", f"EX-{uuid4().hex[:4].upper()}"),
        "teacher": payload.get("teacher", "Dr. Naina Kapoor"),
    }
    scheduled_exams.insert(0, schedule)
    exams.insert(
        0,
        {
            "id": schedule["id"],
            "title": schedule["title"],
            "type": "MCQ",
            "durationMinutes": schedule["durationMinutes"],
            "negativeMarking": False,
            "status": schedule["status"].lower(),
            "subject": schedule["subject"],
            "code": schedule["examCode"],
        },
    )
    return jsonify(schedule), 201


@api.get("/students")
def get_students():
    return jsonify(list_student_profiles())


@api.post("/students")
def create_student():
    payload = request.get_json(silent=True) or {}
    name = payload.get("name", "").strip()
    class_name = payload.get("className", "").strip()

    if not name or not class_name:
        return jsonify({"message": "Student name and class are required."}), 400

    profile, created = create_student_profile(name, class_name)
    return jsonify(profile), 201 if created else 200


@api.get("/students/<slug>")
def get_student(slug: str):
    profile = get_student_profile(slug)
    student_results = [item for item in results if item["studentName"].lower() == profile["name"].lower()]
    class_schedule = [item for item in scheduled_exams if item["className"] == profile["className"]]

    completed_exams = len(student_results)
    average_percentage = round(sum(item["percentage"] for item in student_results) / completed_exams, 2) if completed_exams else 0
    recent_results = [
        {
            "Exam": item["examTitle"],
            "Subject": "Mathematics",
            "Score": f"{item['score']}/{item['total']}",
            "Status": "Published",
            "Date": item["submittedAt"],
        }
        for item in student_results[:5]
    ]

    profile["stats"]["upcomingExams"] = len(class_schedule)
    profile["stats"]["completedExams"] = completed_exams
    profile["stats"]["readinessScore"] = round(average_percentage) if completed_exams else profile["stats"]["readinessScore"]
    profile["averageScore"] = f"{average_percentage}%" if completed_exams else profile["averageScore"]
    profile["recentResults"] = recent_results or profile["recentResults"]
    if completed_exams:
        profile["notifications"] = [
            f"{profile['name']} has {completed_exams} saved exam record(s) in the portal.",
            f"Latest average score is {profile['averageScore']}.",
            f"{len(class_schedule)} scheduled exam(s) are available for {profile['className']}.",
        ]

    return jsonify(profile)


@api.get("/leaderboard")
def get_leaderboard():
    return jsonify(leaderboard)


@api.get("/courses")
def get_courses():
    return jsonify(courses)


def register_routes(app: Flask) -> None:
    app.register_blueprint(api)
