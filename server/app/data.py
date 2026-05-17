from copy import deepcopy
import re


def build_demo_questions():
    prompts = []
    pairs = [
        ("7 + 5", 12),
        ("9 - 4", 5),
        ("6 + 8", 14),
        ("15 - 7", 8),
        ("3 + 9", 12),
        ("14 - 6", 8),
        ("11 + 4", 15),
        ("13 - 5", 8),
        ("2 + 6", 8),
        ("10 - 3", 7),
        ("8 + 7", 15),
        ("16 - 9", 7),
        ("5 + 4", 9),
        ("12 - 8", 4),
        ("9 + 6", 15),
        ("18 - 7", 11),
        ("4 + 5", 9),
        ("17 - 8", 9),
        ("6 + 6", 12),
        ("20 - 9", 11),
        ("8 + 3", 11),
        ("19 - 6", 13),
        ("7 + 8", 15),
        ("14 - 5", 9),
        ("1 + 9", 10),
        ("13 - 4", 9),
        ("2 + 7", 9),
        ("11 - 2", 9),
        ("5 + 8", 13),
        ("18 - 9", 9),
    ]
    for index, (expression, answer) in enumerate(pairs, start=1):
        prompts.append(
            {
                "id": f"q-{index:02d}",
                "prompt": f"What is {expression}?",
                "options": [answer, answer + 1, max(answer - 1, 0), answer + 2],
                "correctAnswer": answer,
                "marks": 1,
            }
        )
    return prompts


dashboard_summary = {
    "student": {
        "name": "Aarav Mehta",
        "role": "student",
        "stats": {
            "readinessScore": 92,
            "upcomingExams": 4,
            "certificates": 16,
            "rank": 7,
        },
    },
    "teacher": {
        "name": "Dr. Naina Kapoor",
        "role": "teacher",
        "stats": {
            "activeClasses": 18,
            "pendingReview": 146,
            "questionBankSize": 4820,
            "studentSatisfaction": 4.9,
        },
    },
    "admin": {
        "name": "AstraExam Ops",
        "role": "admin",
        "stats": {
            "institutions": 240,
            "activeUsers": 48200,
            "revenueMonth": 38400,
            "securityAlerts": 9,
        },
    },
}

notifications = [
    {"id": "n1", "title": "Quant Sprint 04 results published", "priority": "high"},
    {"id": "n2", "title": "Physics Mock opens in 14 hours", "priority": "medium"},
    {"id": "n3", "title": "Certificate batch export completed", "priority": "low"},
]

question_bank = build_demo_questions()

teacher_uploads = [
    {
        "id": "upload-001",
        "topic": "Mathematics Demo Paper",
        "teacher": "Dr. Naina Kapoor",
        "count": 30,
        "status": "Published",
        "uploadedAt": "2026-05-17 21:10",
    }
]

active_exam = {
    "id": "exam-math-001",
    "title": "Demo Mathematics MCQ Assessment",
    "subject": "Mathematics",
    "code": "MATH-DEMO-30",
    "type": "MCQ",
    "durationMinutes": 20,
    "totalQuestions": 30,
    "totalMarks": 30,
    "instructions": [
        "This is a demo mathematics paper with 30 MCQ questions.",
        "Each question carries 1 mark and there is no negative marking in this demo.",
        "Choose one option for every question and submit to see instant results.",
    ],
    "questions": question_bank,
}

student_profiles = {
    "aarav-mehta": {
        "id": "student-001",
        "slug": "aarav-mehta",
        "name": "Aarav Mehta",
        "className": "Class 10 A",
        "rollNumber": "10A-17",
        "email": "aarav.mehta@astraexam.com",
        "phone": "+91 98765 12045",
        "school": "Astra Future Academy",
        "targetExam": "STEM Scholarship Test",
        "attendance": "96%",
        "averageScore": "88.4%",
        "guardian": "Ritika Mehta",
        "city": "Pune",
        "joinedOn": "2026-01-15",
        "strengths": ["Quick arithmetic", "Time management", "Consistent mock participation"],
        "improvements": ["Geometry accuracy", "Word problem interpretation"],
        "stats": {
            "readinessScore": 92,
            "upcomingExams": 3,
            "completedExams": 18,
            "rank": 7,
        },
        "performanceHistory": [
            {"name": "Jan", "score": 74},
            {"name": "Feb", "score": 79},
            {"name": "Mar", "score": 82},
            {"name": "Apr", "score": 86},
            {"name": "May", "score": 91},
        ],
        "subjectPerformance": [
            {"name": "Mathematics", "value": 94},
            {"name": "Science", "value": 88},
            {"name": "English", "value": 84},
            {"name": "Reasoning", "value": 91},
        ],
        "recentResults": [
            {"Exam": "Math Drill 08", "Subject": "Mathematics", "Score": "27/30", "Status": "Published", "Date": "2026-05-16"},
            {"Exam": "Science Sprint", "Subject": "Science", "Score": "22/25", "Status": "Published", "Date": "2026-05-12"},
            {"Exam": "Reasoning Mock", "Subject": "Reasoning", "Score": "44/50", "Status": "Published", "Date": "2026-05-08"},
        ],
        "notifications": [
            "Demo Mathematics MCQ Assessment opens tonight at 8:00 PM.",
            "Your last Mathematics score improved by 6% from the previous attempt.",
            "Certificate verification is ready for Quant Sprint 04.",
        ],
    },
    "siya-arora": {
        "id": "student-002",
        "slug": "siya-arora",
        "name": "Siya Arora",
        "className": "Class 10 A",
        "rollNumber": "10A-08",
        "email": "siya.arora@astraexam.com",
        "phone": "+91 98765 22018",
        "school": "Astra Future Academy",
        "targetExam": "STEM Scholarship Test",
        "attendance": "98%",
        "averageScore": "91.7%",
        "guardian": "Ankit Arora",
        "city": "Delhi",
        "joinedOn": "2026-01-11",
        "strengths": ["Accuracy", "Calculation speed", "Exam discipline"],
        "improvements": ["Long-form science explanations"],
        "stats": {
            "readinessScore": 95,
            "upcomingExams": 3,
            "completedExams": 20,
            "rank": 2,
        },
        "performanceHistory": [
            {"name": "Jan", "score": 79},
            {"name": "Feb", "score": 84},
            {"name": "Mar", "score": 88},
            {"name": "Apr", "score": 91},
            {"name": "May", "score": 96},
        ],
        "subjectPerformance": [
            {"name": "Mathematics", "value": 97},
            {"name": "Science", "value": 90},
            {"name": "English", "value": 86},
            {"name": "Reasoning", "value": 94},
        ],
        "recentResults": [],
        "notifications": [
            "You are currently rank #2 in your batch leaderboard.",
            "Mathematics demo exam is published for your class.",
        ],
    },
}

exams = [
    {
        "id": active_exam["id"],
        "title": active_exam["title"],
        "type": active_exam["type"],
        "durationMinutes": active_exam["durationMinutes"],
        "negativeMarking": False,
        "status": "live",
        "subject": active_exam["subject"],
        "code": active_exam["code"],
    }
]

scheduled_exams = [
    {
        "id": "sched-001",
        "title": active_exam["title"],
        "className": "Class 10 A",
        "subject": "Mathematics",
        "totalMarks": 30,
        "examDate": "2026-05-18",
        "examTime": "20:00",
        "durationMinutes": 20,
        "status": "Published",
        "examCode": active_exam["code"],
        "teacher": "Dr. Naina Kapoor",
    },
    {
        "id": "sched-002",
        "title": "Weekly Science Objective Test",
        "className": "Class 10 A",
        "subject": "Science",
        "totalMarks": 25,
        "examDate": "2026-05-20",
        "examTime": "18:30",
        "durationMinutes": 25,
        "status": "Scheduled",
        "examCode": "SCI-WK-25",
        "teacher": "Rohit Sharma",
    },
]

leaderboard = [
    {"rank": 1, "name": "Siya Arora", "score": 98.4},
    {"rank": 2, "name": "Rohan Iyer", "score": 97.6},
    {"rank": 3, "name": "Aarav Mehta", "score": 96.8},
]

courses = [
    {"id": "course-001", "name": "Aptitude Mastery", "cohort": "2026 Spring", "students": 420},
    {"id": "course-002", "name": "Data Structures Sprint", "cohort": "2026 Summer", "students": 310},
]

results = [
    {
        "resultId": "result-001",
        "studentName": "Aarav Mehta",
        "examId": active_exam["id"],
        "examTitle": active_exam["title"],
        "score": 27,
        "total": 30,
        "percentage": 90.0,
        "submittedAt": "2026-05-17 21:18",
        "correctAnswers": 27,
        "wrongAnswers": 3,
    },
    {
        "resultId": "result-002",
        "studentName": "Siya Arora",
        "examId": active_exam["id"],
        "examTitle": active_exam["title"],
        "score": 29,
        "total": 30,
        "percentage": 96.67,
        "submittedAt": "2026-05-17 21:20",
        "correctAnswers": 29,
        "wrongAnswers": 1,
    },
]

assistant_suggestions = [
    "Show upcoming exams for Class 10 A",
    "How many questions are in the mathematics paper?",
    "Which students are registered right now?",
    "What is Aarav Mehta's average score?",
    "What is 18 + 9?",
]


def get_exam_payload():
    return deepcopy(active_exam)


def get_student_profile(slug: str = "aarav-mehta"):
    return deepcopy(student_profiles.get(slug, student_profiles["aarav-mehta"]))


def list_student_profiles():
    return [
        {
            "id": profile["id"],
            "slug": profile["slug"],
            "name": profile["name"],
            "className": profile["className"],
        }
        for profile in student_profiles.values()
    ]


def slugify_name(name: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return cleaned or f"student-{len(student_profiles) + 1}"


def create_student_profile(name: str, class_name: str):
    slug = slugify_name(name)
    if slug in student_profiles:
        return deepcopy(student_profiles[slug]), False

    sequence = len(student_profiles) + 1
    profile = {
        "id": f"student-{sequence:03d}",
        "slug": slug,
        "name": name,
        "className": class_name,
        "rollNumber": f"{class_name.replace(' ', '').upper()}-{sequence:02d}",
        "email": f"{slug}@astraexam.com",
        "phone": "Not added",
        "school": "Astra Future Academy",
        "targetExam": "Foundation Assessment Track",
        "attendance": "New",
        "averageScore": "No exams yet",
        "guardian": "Not added",
        "city": "Not added",
        "joinedOn": "2026-05-17",
        "strengths": ["Registered in portal"],
        "improvements": ["Complete first exam to unlock insights"],
        "stats": {
            "readinessScore": 0,
            "upcomingExams": 0,
            "completedExams": 0,
            "rank": "-",
        },
        "performanceHistory": [
            {"name": "Jan", "score": 0},
            {"name": "Feb", "score": 0},
            {"name": "Mar", "score": 0},
            {"name": "Apr", "score": 0},
            {"name": "May", "score": 0},
        ],
        "subjectPerformance": [
            {"name": "Mathematics", "value": 0},
            {"name": "Science", "value": 0},
            {"name": "English", "value": 0},
            {"name": "Reasoning", "value": 0},
        ],
        "recentResults": [],
        "notifications": ["Student created successfully. Schedule an exam or attempt a paper to generate analytics."],
    }
    student_profiles[slug] = profile
    return deepcopy(profile), True


def find_student_by_name(name: str):
    lowered = name.strip().lower()
    for profile in student_profiles.values():
        if profile["name"].lower() == lowered:
            return deepcopy(profile)
    return None
