from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
import datetime
import uuid
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, index=True, nullable=False)  # 'hod', 'teacher', 'clerk'
    department = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    usn = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)
    department = Column(String, index=True, nullable=False)
    semester = Column(String, index=True, nullable=False)
    section = Column(String, index=True, nullable=False)
    rollNumber = Column(String, nullable=True)
    assigned_labs = Column(Text, default="[]")  # JSON list of lab IDs or names
    face_enrolled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    embeddings = relationship("StudentFaceEmbedding", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("AttendanceRecord", back_populates="student", cascade="all, delete-orphan")

class StudentFaceEmbedding(Base):
    __tablename__ = "student_face_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    embedding = Column(Text, nullable=False)  # JSON serialized feature vector / histogram
    image_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="embeddings")

class Lab(Base):
    __tablename__ = "labs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    labName = Column(String, index=True, nullable=False)
    labCode = Column(String, nullable=True)
    department = Column(String, index=True, nullable=False)
    assignedSemester = Column(String, nullable=True)
    assignedSection = Column(String, nullable=True)
    assignedTeacherId = Column(String, nullable=True)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)

class Clerk(Base):
    __tablename__ = "clerks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=True)

class LabSession(Base):
    __tablename__ = "lab_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    lab_id = Column(String, nullable=True)
    lab_name = Column(String, nullable=False)
    teacher_id = Column(String, nullable=True)
    teacher_name = Column(String, nullable=True)
    department = Column(String, nullable=False)
    semester = Column(String, nullable=False)
    section = Column(String, nullable=False)
    date = Column(String, nullable=False)  # YYYY-MM-DD
    startTime = Column(String, nullable=False)
    endTime = Column(String, nullable=True)
    status = Column(String, default="ACTIVE")  # 'ACTIVE', 'COMPLETED'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, nullable=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=True)
    usn = Column(String, index=True, nullable=False)
    student_name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    semester = Column(String, nullable=False)
    section = Column(String, nullable=False)
    lab_name = Column(String, index=True, nullable=False)
    date = Column(String, index=True, nullable=False)  # YYYY-MM-DD
    entry_time = Column(String, nullable=True)
    exit_time = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    status = Column(String, default="Absent")  # 'Present', 'Absent', 'Late'
    verification_mode = Column(String, default="MANUAL")  # 'AI_CAMERA', 'MANUAL', 'QR'
    confidence = Column(Float, nullable=True)
    remarks = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="attendance_records")

