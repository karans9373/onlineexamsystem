from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..config import get_settings
from ..database import get_db
from ..deps import get_current_user
from ..models import User
from ..schemas import ForgotPasswordPayload, LoginPayload, OtpPayload, ProfileImagePayload, RegisterPayload, ResetPasswordPayload
from ..security import create_access_token, generate_otp, hash_password, otp_expiry, verify_password
from ..services import create_notification

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


def user_payload(user: User):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "is_verified": user.is_verified,
        "class_name": user.class_name,
        "school_name": user.school_name,
        "subject_specialization": user.subject_specialization,
        "profile_image_url": user.profile_image_url,
    }


@router.post("/register")
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
        class_name=payload.class_name,
        school_name=payload.school_name,
        subject_specialization=payload.subject_specialization,
        is_verified=True,
    )
    db.add(user)
    create_notification(db, "Welcome onboard", "Your account has been created successfully.", "success", user.id)
    db.commit()
    return {"message": "Registration successful. You can login now.", "user": user_payload(user)}


@router.post("/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email, User.role == payload.role).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email, password, or role")
    token = create_access_token(user.email, {"role": user.role})
    return {"access_token": token, "user": user_payload(user)}


@router.post("/verify-email")
def verify_email(payload: OtpPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or user.otp_code != payload.otp or user.otp_purpose != "verify_email":
        raise HTTPException(status_code=400, detail="Invalid OTP")
    user.is_verified = True
    user.otp_code = None
    user.otp_purpose = None
    user.otp_expires_at = None
    create_notification(db, "Welcome onboard", "Your account has been verified successfully.", "success", user.id)
    db.commit()
    return {"message": "Email verified successfully"}


@router.post("/resend-otp")
def resend_otp(payload: ForgotPasswordPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    otp = generate_otp()
    user.otp_code = otp
    user.otp_purpose = "verify_email"
    user.otp_expires_at = otp_expiry()
    db.commit()
    response = {"message": "OTP sent successfully"}
    if settings.development_expose_otp:
        response["dev_otp"] = otp
    return response


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    otp = generate_otp()
    user.otp_code = otp
    user.otp_purpose = "reset_password"
    user.otp_expires_at = otp_expiry()
    db.commit()
    response = {"message": "Password reset OTP sent"}
    if settings.development_expose_otp:
        response["dev_otp"] = otp
    return response


@router.post("/reset-password")
def reset_password(payload: ResetPasswordPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or user.otp_code != payload.otp or user.otp_purpose != "reset_password":
        raise HTTPException(status_code=400, detail="Invalid OTP")
    user.password_hash = hash_password(payload.new_password)
    user.otp_code = None
    user.otp_purpose = None
    user.otp_expires_at = None
    db.commit()
    return {"message": "Password reset successful"}


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return user_payload(user)


@router.put("/profile-image")
def update_profile_image(payload: ProfileImagePayload, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.profile_image_url = payload.profile_image_url
    db.commit()
    return {"message": "Profile image updated", "profile_image_url": user.profile_image_url}
