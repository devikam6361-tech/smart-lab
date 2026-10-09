from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import json
import uuid
import os

from database import get_db
from models import Student, StudentFaceEmbedding
import ai_face_service

router = APIRouter(prefix="/students", tags=["Students"])

class StudentCreate(BaseModel):
    usn: str
    name: str
    department: str
    semester: str
    section: str
    rollNumber: Optional[str] = None
    assigned_labs: Optional[List[str]] = []

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[str] = None
    section: Optional[str] = None
    rollNumber: Optional[str] = None
    assigned_labs: Optional[List[str]] = None

class AssignLabsRequest(BaseModel):
    assigned_labs: List[str]

@router.get("")
def get_students(
    department: Optional[str] = None,
    semester: Optional[str] = None,
    section: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Student)
    if department and department != "All":
        query = query.filter(Student.department == department)
    if semester and semester != "All":
        query = query.filter(Student.semester == str(semester))
    if section and section != "All":
        query = query.filter(Student.section == section)

    students = query.all()
    result = []
    for s in students:
        if search:
            q = search.lower()
            if q not in s.name.lower() and q not in s.usn.lower():
                continue

        labs = []
        try:
            labs = json.loads(s.assigned_labs) if s.assigned_labs else []
        except:
            labs = []

        result.append({
            "id": s.id,
            "usn": s.usn,
            "name": s.name,
            "department": s.department,
            "semester": s.semester,
            "section": s.section,
            "rollNumber": s.rollNumber,
            "assignedLabs": labs,
            "faceEnrolled": s.face_enrolled
        })
    return result

@router.get("/{student_id}")
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter((Student.id == student_id) | (Student.usn == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    labs = []
    try:
        labs = json.loads(student.assigned_labs) if student.assigned_labs else []
    except:
        labs = []

    return {
        "id": student.id,
        "usn": student.usn,
        "name": student.name,
        "department": student.department,
        "semester": student.semester,
        "section": student.section,
        "rollNumber": student.rollNumber,
        "assignedLabs": labs,
        "faceEnrolled": student.face_enrolled
    }

@router.post("")
def create_student(req: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.usn == req.usn.strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student with this USN already exists")

    new_student = Student(
        id=str(uuid.uuid4()),
        usn=req.usn.strip(),
        name=req.name.strip(),
        department=req.department.strip(),
        semester=str(req.semester).strip(),
        section=req.section.strip(),
        rollNumber=req.rollNumber or req.usn,
        assigned_labs=json.dumps(req.assigned_labs or [])
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "id": new_student.id,
        "usn": new_student.usn,
        "name": new_student.name,
        "department": new_student.department,
        "semester": new_student.semester,
        "section": new_student.section,
        "rollNumber": new_student.rollNumber,
        "assignedLabs": req.assigned_labs or [],
        "faceEnrolled": False
    }

@router.put("/{student_id}")
def update_student(student_id: str, req: StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter((Student.id == student_id) | (Student.usn == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if req.name is not None:
        student.name = req.name
    if req.department is not None:
        student.department = req.department
    if req.semester is not None:
        student.semester = str(req.semester)
    if req.section is not None:
        student.section = req.section
    if req.rollNumber is not None:
        student.rollNumber = req.rollNumber
    if req.assigned_labs is not None:
        student.assigned_labs = json.dumps(req.assigned_labs)

    db.commit()
    db.refresh(student)

    labs = []
    try:
        labs = json.loads(student.assigned_labs) if student.assigned_labs else []
    except:
        labs = []

    return {
        "id": student.id,
        "usn": student.usn,
        "name": student.name,
        "department": student.department,
        "semester": student.semester,
        "section": student.section,
        "rollNumber": student.rollNumber,
        "assignedLabs": labs,
        "faceEnrolled": student.face_enrolled
    }

@router.delete("/{student_id}")
def delete_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter((Student.id == student_id) | (Student.usn == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}

@router.post("/{student_id}/assign-labs")
def assign_labs(student_id: str, req: AssignLabsRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter((Student.id == student_id) | (Student.usn == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.assigned_labs = json.dumps(req.assigned_labs)
    db.commit()
    return {"message": "Labs assigned successfully", "assignedLabs": req.assigned_labs}

@router.post("/{student_id}/enroll-face")
async def enroll_face(
    student_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter((Student.id == student_id) | (Student.usn == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    content = await file.read()
    img = ai_face_service.decode_image(content)
    faces = ai_face_service.detect_faces(img)
    if not faces:
        raise HTTPException(status_code=400, detail="No face detected in the uploaded photo")

    x, y, w, h = faces[0]
    face_crop = img[max(0, y):min(img.shape[0], y + h), max(0, x):min(img.shape[1], x + w)]
    signature = ai_face_service.extract_face_signature(face_crop)

    # Save embedding
    db.query(StudentFaceEmbedding).filter(StudentFaceEmbedding.student_id == student.id).delete()
    embedding_record = StudentFaceEmbedding(
        student_id=student.id,
        embedding=json.dumps(signature)
    )
    db.add(embedding_record)
    student.face_enrolled = True
    db.commit()

    return {
        "message": f"Face enrolled successfully for {student.name}",
        "student_id": student.id,
        "faceEnrolled": True
    }

