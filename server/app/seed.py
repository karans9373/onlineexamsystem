from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from .models import Exam, Notification, Question, Role, User
from .security import hash_password


def seed_database(db: Session):
    if db.query(User).count():
        return

    admin = User(
        full_name="Astra Super Admin",
        email="admin@astraexam.com",
        password_hash=hash_password("Admin@123"),
        role=Role.ADMIN.value,
        is_verified=True,
        school_name="Astra Central",
    )
    teacher = User(
        full_name="Naina Kapoor",
        email="teacher@astraexam.com",
        password_hash=hash_password("Teacher@123"),
        role=Role.TEACHER.value,
        is_verified=True,
        subject_specialization="Mathematics",
        school_name="Astra Central",
    )
    student = User(
        full_name="Aarav Mehta",
        email="student@astraexam.com",
        password_hash=hash_password("Student@123"),
        role=Role.STUDENT.value,
        is_verified=True,
        class_name="Class 12",
        school_name="Astra Central",
    )
    db.add_all([admin, teacher, student])
    db.flush()

    exam = Exam(
        title="SSC Quantitative Aptitude Grand Mock",
        description="Government CBT style exam with bilingual MCQs and negative marking.",
        subject="Quantitative Aptitude",
        exam_type="MCQ",
        status="published",
        duration_minutes=90,
        total_questions=5,
        total_marks=5,
        negative_marking=0.25,
        language_mode="bilingual",
        instructions=[
            "Read every question carefully before answering.",
            "Each correct answer awards 1 mark and each wrong answer deducts 0.25 marks.",
            "Use Mark for Review if you want to revisit a question.",
            "Do not leave fullscreen during the live exam window.",
        ],
        start_at=datetime.utcnow() - timedelta(hours=1),
        end_at=datetime.utcnow() + timedelta(days=7),
        is_published=True,
        created_by=teacher.id,
    )
    db.add(exam)
    db.flush()

    questions = [
        Question(
            exam_id=exam.id,
            order_index=index,
            text_en=text,
            text_hi=hi,
            options=options,
            correct_option=answer,
            explanation="Teacher-curated explanation for practice improvement.",
            difficulty="medium",
            topic=topic,
            marks=1,
        )
        for index, (text, hi, options, answer, topic) in enumerate(
            [
                (
                    "If 15% of a number is 45, what is the number?",
                    "यदि किसी संख्या का 15% = 45 है, तो संख्या क्या होगी?",
                    [{"key": "A", "label": "250"}, {"key": "B", "label": "300"}, {"key": "C", "label": "325"}, {"key": "D", "label": "350"}],
                    "B",
                    "Percentages",
                ),
                (
                    "A train 180 m long crosses a pole in 12 seconds. Its speed is:",
                    "180 मीटर लंबी ट्रेन 12 सेकंड में खंभा पार करती है। इसकी चाल क्या है?",
                    [{"key": "A", "label": "54 km/h"}, {"key": "B", "label": "48 km/h"}, {"key": "C", "label": "60 km/h"}, {"key": "D", "label": "72 km/h"}],
                    "A",
                    "Time and Distance",
                ),
                (
                    "Find the simple interest on Rs. 6000 at 8% per annum for 2 years.",
                    "6000 रुपये पर 8% वार्षिक दर से 2 वर्ष का साधारण ब्याज ज्ञात कीजिए।",
                    [{"key": "A", "label": "920"}, {"key": "B", "label": "960"}, {"key": "C", "label": "980"}, {"key": "D", "label": "1000"}],
                    "B",
                    "Simple Interest",
                ),
                (
                    "The average of 12, 18, 24 and 30 is:",
                    "12, 18, 24 और 30 का औसत है:",
                    [{"key": "A", "label": "18"}, {"key": "B", "label": "20"}, {"key": "C", "label": "21"}, {"key": "D", "label": "22"}],
                    "C",
                    "Average",
                ),
                (
                    "If x + 1/x = 5, find x^2 + 1/x^2.",
                    "यदि x + 1/x = 5 है, तो x^2 + 1/x^2 ज्ञात कीजिए।",
                    [{"key": "A", "label": "21"}, {"key": "B", "label": "23"}, {"key": "C", "label": "25"}, {"key": "D", "label": "27"}],
                    "B",
                    "Algebra",
                ),
            ],
            start=1,
        )
    ]
    db.add_all(questions)
    db.add_all(
        [
            Notification(user_id=student.id, title="Exam live", message="Your SSC Quant Grand Mock is now visible in the live exams section.", type="info"),
            Notification(user_id=teacher.id, title="Leaderboard sync", message="Live leaderboard websocket is ready for the SSC mock.", type="success"),
            Notification(user_id=admin.id, title="Platform healthy", message="All core services are reporting normal health.", type="success"),
        ]
    )
    db.commit()
