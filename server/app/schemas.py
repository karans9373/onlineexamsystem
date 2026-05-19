from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class RegisterPayload(BaseModel):
    full_name: str
    email: EmailStr
    password: str = Field(min_length=6)
    role: str
    class_name: str | None = None
    school_name: str | None = None
    subject_specialization: str | None = None


class LoginPayload(BaseModel):
    email: EmailStr
    password: str
    role: str


class OtpPayload(BaseModel):
    email: EmailStr
    otp: str


class ForgotPasswordPayload(BaseModel):
    email: EmailStr


class ResetPasswordPayload(BaseModel):
    email: EmailStr
    otp: str
    new_password: str = Field(min_length=6)


class QuestionInput(BaseModel):
    text_en: str
    text_hi: str | None = None
    image_url: str | None = None
    options: list[dict[str, str]]
    correct_option: str
    explanation: str | None = None
    difficulty: str = "medium"
    topic: str = "General"
    marks: float = 1


class ExamCreatePayload(BaseModel):
    title: str
    description: str = ""
    subject: str
    exam_type: str = "MCQ"
    duration_minutes: int = 60
    negative_marking: float = 0.25
    language_mode: str = "bilingual"
    instructions: list[str] = []
    start_at: datetime | None = None
    end_at: datetime | None = None
    questions: list[QuestionInput]


class ExamAutosavePayload(BaseModel):
    attempt_id: int
    answers: dict[str, str]
    visited: list[int] = []
    marked_for_review: list[int] = []
    time_spent: dict[str, int] = {}
    fullscreen_violations: int = 0
    tab_switches: int = 0
    warnings_count: int = 0


class SubmitExamPayload(ExamAutosavePayload):
    auto_submitted: bool = False


class SuspiciousPayload(BaseModel):
    attempt_id: int
    activity_type: str
    detail: str
    severity: str = "medium"


class AIGeneratePayload(BaseModel):
    prompt: str
    question_count: int = 20
    subject: str = "General"
    language_mode: str = "bilingual"


class ProfileImagePayload(BaseModel):
    profile_image_url: str
