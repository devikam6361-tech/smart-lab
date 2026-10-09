from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import uuid

from database import get_db
from models import Lab

router = APIRouter(prefix="/labs", tags=["Labs"])

class LabCreate(BaseModel):
    labName: str
    labCode: Optional[str] = None
    department: str
    assignedSemester: Optional[str] = None
    assignedSection: Optional[str] = None
    assignedTeacherId: Optional[str] = None

class LabUpdate(BaseModel):
    labName: Optional[str] = None
    labCode: Optional[str] = None
    department: Optional[str] = None
    assignedSemester: Optional[str] = None
    assignedSection: Optional[str] = None
    assignedTeacherId: Optional[str] = None
    status: Optional[str] = None

class AssignLabRequest(BaseModel):
    teacherId: Optional[str] = None
    semester: Optional[str] = None
    section: Optional[str] = None

@router.get("")
def get_labs(
    department: Optional[str] = None,
    semester: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Lab)
    if department and department != "All":
        query = query.filter(Lab.department == department)
    if semester and semester != "All":
        query = query.filter(Lab.assignedSemester == str(semester))
    return query.all()

@router.get("/{lab_id}")
def get_lab(lab_id: str, db: Session = Depends(get_db)):
    lab = db.query(Lab).filter(Lab.id == lab_id).first()
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")
    return lab

@router.post("")
def create_lab(req: LabCreate, db: Session = Depends(get_db)):
    new_lab = Lab(
        id=str(uuid.uuid4()),
        labName=req.labName.strip(),
        labCode=req.labCode or f"LAB-{req.labName[:3].upper()}",
        department=req.department.strip(),
        assignedSemester=str(req.assignedSemester) if req.assignedSemester else None,
        assignedSection=req.assignedSection,
        assignedTeacherId=req.assignedTeacherId,
        status="ACTIVE"
    )
    db.add(new_lab)
    db.commit()
    db.refresh(new_lab)
    return new_lab

@router.put("/{lab_id}")
def update_lab(lab_id: str, req: LabUpdate, db: Session = Depends(get_db)):
    lab = db.query(Lab).filter(Lab.id == lab_id).first()
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")

    if req.labName is not None:
        lab.labName = req.labName
    if req.labCode is not None:
        lab.labCode = req.labCode
    if req.department is not None:
        lab.department = req.department
    if req.assignedSemester is not None:
        lab.assignedSemester = str(req.assignedSemester)
    if req.assignedSection is not None:
        lab.assignedSection = req.assignedSection
    if req.assignedTeacherId is not None:
        lab.assignedTeacherId = req.assignedTeacherId
    if req.status is not None:
        lab.status = req.status

    db.commit()
    db.refresh(lab)
    return lab

@router.delete("/{lab_id}")
def delete_lab(lab_id: str, db: Session = Depends(get_db)):
    lab = db.query(Lab).filter(Lab.id == lab_id).first()
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")

    db.delete(lab)
    db.commit()
    return {"message": "Lab deleted successfully"}

@router.post("/{lab_id}/assign")
def assign_lab(lab_id: str, req: AssignLabRequest, db: Session = Depends(get_db)):
    lab = db.query(Lab).filter(Lab.id == lab_id).first()
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")

    if req.teacherId:
        lab.assignedTeacherId = req.teacherId
    if req.semester:
        lab.assignedSemester = str(req.semester)
    if req.section:
        lab.assignedSection = req.section

    db.commit()
    db.refresh(lab)
    return lab

