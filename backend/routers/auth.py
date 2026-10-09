from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import uuid
import secrets

from database import get_db
from models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str
    department: Optional[str] = None

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: Optional[str] = None

    class Config:
        from_attributes = True

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    email_clean = req.email.strip().lower()
    user = db.query(User).filter(
        User.email.ilike(email_clean),
        User.password == req.password.strip(),
        User.role == req.role.strip().lower()
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials for the selected role"
        )

    token = secrets.token_hex(32)

    return {
        "success": True,
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department
        }
    }

@router.get("/users", response_model=List[UserOut])
def get_users(role: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role.lower())
    return query.all()

@router.post("/register", response_model=UserOut)
def register_user(req: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email.ilike(req.email.strip())).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    new_user = User(
        id=str(uuid.uuid4()),
        name=req.name,
        email=req.email.strip().lower(),
        password=req.password,
        role=req.role.strip().lower(),
        department=req.department
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
