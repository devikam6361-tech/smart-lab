from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import datetime
import uuid
import json

from database import get_db
from models import AttendanceRecord, Student, StudentFaceEmbedding, Lab
import ai_face_service

router = APIRouter(prefix="/attendance", tags=["Attendance"])


# ==========================================================
# REQUEST MODELS
# ==========================================================

class MarkAttendanceRequest(BaseModel):
    usn: str
    date: str
    lab_name: str
    status: str  # 'Present', 'Absent', 'Late'


class RecordTimeRequest(BaseModel):
    usn: str
    date: str
    lab_name: str
    time: Optional[str] = None


class CameraFrameRequest(BaseModel):
    image: str
    date: Optional[str] = None
    lab_name: Optional[str] = "DBMS Lab"
    target_usn: Optional[str] = None
    mode: Optional[str] = "entry"


class BatchAttendanceRequest(BaseModel):
    date: str
    lab_name: str
    status: str
    usns: Optional[List[str]] = None


# ==========================================================
# HELPER FUNCTIONS
# ==========================================================

def get_current_time_str():
    return datetime.datetime.now().strftime("%I:%M:%S %p")


def calculate_duration(entry_time_str, exit_time_str):
    if not entry_time_str or not exit_time_str:
        return ""

    try:
        t_fmt = "%I:%M:%S %p"

        try:
            t1 = datetime.datetime.strptime(
                entry_time_str.strip(),
                t_fmt
            )
        except Exception:
            t1 = datetime.datetime.strptime(
                entry_time_str.strip()[:5],
                "%H:%M"
            )

        try:
            t2 = datetime.datetime.strptime(
                exit_time_str.strip(),
                t_fmt
            )
        except Exception:
            t2 = datetime.datetime.strptime(
                exit_time_str.strip()[:5],
                "%H:%M"
            )

        delta = t2 - t1

        total_seconds = int(
            delta.total_seconds()
        )

        if total_seconds < 0:
            total_seconds += 24 * 3600

        hours = total_seconds // 3600

        minutes = (
            total_seconds % 3600
        ) // 60

        if hours == 0:
            return f"{minutes}m"

        return f"{hours}h {minutes}m"

    except Exception:
        return ""


# ==========================================================
# GET ATTENDANCE
# ==========================================================

@router.get("")
def get_attendance(
    date: Optional[str] = None,
    lab: Optional[str] = None,
    department: Optional[str] = None,
    semester: Optional[str] = None,
    section: Optional[str] = None,
    usn: Optional[str] = None,
    db: Session = Depends(get_db)
):

    query = db.query(AttendanceRecord)

    if date:
        query = query.filter(
            AttendanceRecord.date == date
        )

    if lab and lab != "All":
        query = query.filter(
            AttendanceRecord.lab_name == lab
        )

    if department and department != "All":
        query = query.filter(
            AttendanceRecord.department == department
        )

    if semester and semester != "All":
        query = query.filter(
            AttendanceRecord.semester == str(semester)
        )

    if section and section != "All":
        query = query.filter(
            AttendanceRecord.section == section
        )

    if usn:
        query = query.filter(
            AttendanceRecord.usn == usn
        )

    records = query.all()

    return [
        {
            "id": r.id,
            "usn": r.usn,
            "name": r.student_name,
            "department": r.department,
            "semester": r.semester,
            "section": r.section,
            "lab": r.lab_name,
            "date": r.date,
            "entryTime": r.entry_time or "",
            "exitTime": r.exit_time or "",
            "duration": r.duration or "",
            "status": r.status,
            "verificationMode": r.verification_mode,
            "confidence": r.confidence,
            "remarks": r.remarks
        }
        for r in records
    ]


# ==========================================================
# MARK ATTENDANCE
# ==========================================================

@router.post("/mark")
def mark_attendance(
    req: MarkAttendanceRequest,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.usn == req.usn
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    record = db.query(
        AttendanceRecord
    ).filter(
        AttendanceRecord.usn == req.usn,
        AttendanceRecord.date == req.date,
        AttendanceRecord.lab_name == req.lab_name
    ).first()

    now_time = get_current_time_str()

    if not record:

        record = AttendanceRecord(
            id=str(uuid.uuid4()),
            student_id=student.id,
            usn=student.usn,
            student_name=student.name,
            department=student.department,
            semester=student.semester,
            section=student.section,
            lab_name=req.lab_name,
            date=req.date,
            status=req.status,
            entry_time=(
                now_time
                if req.status in ["Present", "Late"]
                else ""
            ),
            exit_time="",
            duration="",
            verification_mode="MANUAL"
        )

        db.add(record)

    else:

        record.status = req.status

        if (
            req.status in ["Present", "Late"]
            and not record.entry_time
        ):
            record.entry_time = now_time

        elif req.status == "Absent":

            record.entry_time = ""
            record.exit_time = ""
            record.duration = ""

    db.commit()
    db.refresh(record)

    return {
        "success": True,
        "record": {
            "usn": record.usn,
            "name": record.student_name,
            "status": record.status,
            "entryTime": record.entry_time,
            "exitTime": record.exit_time,
            "duration": record.duration
        }
    }


# ==========================================================
# MANUAL ENTRY
# ==========================================================

@router.post("/entry")
def record_entry(
    req: RecordTimeRequest,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.usn == req.usn
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    entry_time = (
        req.time
        or get_current_time_str()
    )

    record = db.query(
        AttendanceRecord
    ).filter(
        AttendanceRecord.usn == req.usn,
        AttendanceRecord.date == req.date,
        AttendanceRecord.lab_name == req.lab_name
    ).first()

    if not record:

        record = AttendanceRecord(
            id=str(uuid.uuid4()),
            student_id=student.id,
            usn=student.usn,
            student_name=student.name,
            department=student.department,
            semester=student.semester,
            section=student.section,
            lab_name=req.lab_name,
            date=req.date,
            status="Present",
            entry_time=entry_time,
            exit_time="",
            duration="",
            verification_mode="MANUAL"
        )

        db.add(record)

    else:

        record.entry_time = entry_time
        record.exit_time = ""
        record.duration = ""

        if record.status == "Absent":
            record.status = "Present"

    db.commit()
    db.refresh(record)

    return {
        "success": True,
        "entryTime": record.entry_time,
        "status": record.status
    }


# ==========================================================
# MANUAL EXIT
# ==========================================================

@router.post("/exit")
def record_exit(
    req: RecordTimeRequest,
    db: Session = Depends(get_db)
):

    record = db.query(
        AttendanceRecord
    ).filter(
        AttendanceRecord.usn == req.usn,
        AttendanceRecord.date == req.date,
        AttendanceRecord.lab_name == req.lab_name
    ).first()

    if not record or not record.entry_time:

        raise HTTPException(
            status_code=400,
            detail="Cannot record exit without recorded entry time"
        )

    exit_time = (
        req.time
        or get_current_time_str()
    )

    duration = calculate_duration(
        record.entry_time,
        exit_time
    )

    record.exit_time = exit_time
    record.duration = duration

    db.commit()
    db.refresh(record)

    return {
        "success": True,
        "exitTime": record.exit_time,
        "duration": record.duration
    }


# ==========================================================
# CAMERA RECOGNITION
#
# FIRST SCAN  = ENTRY
# NEXT SCAN   = EXIT
# ==========================================================

@router.post("/camera-recognize")
def camera_recognize(
    req: CameraFrameRequest,
    db: Session = Depends(get_db)
):

    # ------------------------------------------------------
    # Get students
    # ------------------------------------------------------

    students = db.query(Student).all()

    students_data = []

    for s in students:

        emb_record = db.query(
            StudentFaceEmbedding
        ).filter(
            StudentFaceEmbedding.student_id == s.id
        ).first()

        emb_list = None

        if emb_record:

            try:
                emb_list = json.loads(
                    emb_record.embedding
                )
            except Exception:
                emb_list = None

        students_data.append({
            "id": s.id,
            "usn": s.usn,
            "name": s.name,
            "department": s.department,
            "semester": s.semester,
            "section": s.section,
            "embedding": emb_list,
            "lab": req.lab_name or "DBMS Lab"
        })

    # ------------------------------------------------------
    # Run AI recognition
    # ------------------------------------------------------

    result = ai_face_service.process_camera_frame(
        image_data=req.image,
        students_list=students_data,
        target_usn=req.target_usn
    )

    if not result.get("success"):
        return result

    if not result.get("matched"):
        return result

    # ------------------------------------------------------
    # Basic information
    # ------------------------------------------------------

    today_date = (
        req.date
        or datetime.datetime.now().strftime("%Y-%m-%d")
    )

    current_time = get_current_time_str()

    matched_usn = result["usn"]

    lab_name = req.lab_name or "DBMS Lab"

    # ------------------------------------------------------
    # Find today's attendance record
    # ------------------------------------------------------

    record = db.query(
        AttendanceRecord
    ).filter(
        AttendanceRecord.usn == matched_usn,
        AttendanceRecord.date == today_date,
        AttendanceRecord.lab_name == lab_name
    ).first()

    # ======================================================
    # FIRST RECOGNITION
    # ENTRY
    # ======================================================

    if not record:

        record = AttendanceRecord(
            id=str(uuid.uuid4()),

            student_id=result["student_id"],

            usn=matched_usn,

            student_name=result["name"],

            department=result["department"],

            semester=result["semester"],

            section=result["section"],

            lab_name=lab_name,

            date=today_date,

            status="Present",

            entry_time=current_time,

            exit_time="",

            duration="",

            verification_mode="AI_CAMERA",

            confidence=result["confidence"],

            remarks="Entry recorded by SmartLab AI Camera"
        )

        db.add(record)

        db.commit()

        db.refresh(record)

        result["attendance_updated"] = True

        result["attendance_action"] = "ENTRY"

        result["status"] = "Present"

        result["entry_time"] = record.entry_time

        result["exit_time"] = ""

        result["duration"] = ""

        result["message"] = (
            f"ENTRY recorded for "
            f"{record.student_name} "
            f"at {record.entry_time}"
        )

        return result

    # ======================================================
    # NEXT RECOGNITION
    # EXIT
    # ======================================================

    if record.entry_time and not record.exit_time:

        record.exit_time = current_time

        record.duration = calculate_duration(
            record.entry_time,
            record.exit_time
        )

        record.status = "Present"

        record.verification_mode = "AI_CAMERA"

        record.confidence = result["confidence"]

        record.remarks = (
            "Exit recorded by SmartLab AI Camera"
        )

        db.commit()

        db.refresh(record)

        result["attendance_updated"] = True

        result["attendance_action"] = "EXIT"

        result["status"] = "Present"

        result["entry_time"] = record.entry_time

        result["exit_time"] = record.exit_time

        result["duration"] = record.duration

        result["message"] = (
            f"EXIT recorded for "
            f"{record.student_name} "
            f"at {record.exit_time}. "
            f"Duration: {record.duration}"
        )

        return result

    # ======================================================
    # ENTRY + EXIT ALREADY COMPLETED
    # ======================================================

    result["attendance_updated"] = False

    result["attendance_action"] = "COMPLETED"

    result["status"] = record.status

    result["entry_time"] = record.entry_time

    result["exit_time"] = record.exit_time

    result["duration"] = record.duration

    result["message"] = (
        f"Attendance already completed for "
        f"{record.student_name}. "
        f"Entry: {record.entry_time}, "
        f"Exit: {record.exit_time}, "
        f"Duration: {record.duration}"
    )

    return result


# ==========================================================
# BATCH ATTENDANCE
# ==========================================================

@router.post("/batch")
def batch_attendance(
    req: BatchAttendanceRequest,
    db: Session = Depends(get_db)
):

    query = db.query(Student)

    if req.usns:
        query = query.filter(
            Student.usn.in_(req.usns)
        )

    students = query.all()

    now_time = get_current_time_str()

    for s in students:

        record = db.query(
            AttendanceRecord
        ).filter(
            AttendanceRecord.usn == s.usn,
            AttendanceRecord.date == req.date,
            AttendanceRecord.lab_name == req.lab_name
        ).first()

        if not record:

            record = AttendanceRecord(
                id=str(uuid.uuid4()),
                student_id=s.id,
                usn=s.usn,
                student_name=s.name,
                department=s.department,
                semester=s.semester,
                section=s.section,
                lab_name=req.lab_name,
                date=req.date,
                status=req.status,
                entry_time=(
                    now_time
                    if req.status == "Present"
                    else ""
                ),
                exit_time="",
                duration="",
                verification_mode="MANUAL"
            )

            db.add(record)

        else:

            record.status = req.status

            if (
                req.status == "Present"
                and not record.entry_time
            ):
                record.entry_time = now_time

            elif req.status == "Absent":

                record.entry_time = ""
                record.exit_time = ""
                record.duration = ""

    db.commit()

    return {
        "success": True,
        "message": (
            f"Updated {len(students)} "
            f"students to {req.status}"
        )
    }


# ==========================================================
# RESET ATTENDANCE
# ==========================================================

@router.post("/reset")
def reset_attendance(
    req: BatchAttendanceRequest,
    db: Session = Depends(get_db)
):

    query = db.query(
        AttendanceRecord
    ).filter(
        AttendanceRecord.date == req.date,
        AttendanceRecord.lab_name == req.lab_name
    )

    if req.usns:

        query = query.filter(
            AttendanceRecord.usn.in_(req.usns)
        )

    count = query.delete(
        synchronize_session=False
    )

    db.commit()

    return {
        "success": True,
        "message": (
            f"Reset {count} records "
            f"for {req.date}"
        )
    }

