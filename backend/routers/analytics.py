from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
import datetime

from database import get_db
from models import AttendanceRecord, Student, Lab, User

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview(
    date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    target_date = date or datetime.datetime.now().strftime("%Y-%m-%d")

    total_students = db.query(Student).count()
    total_labs = db.query(Lab).count()
    records = db.query(AttendanceRecord).filter(AttendanceRecord.date == target_date).all()

    present_count = sum(1 for r in records if r.status == "Present")
    late_count = sum(1 for r in records if r.status == "Late")
    absent_count = sum(1 for r in records if r.status == "Absent")
    # For students with no record, consider absent
    effective_absent = absent_count + max(0, total_students - len(records))

    effective_present = present_count + late_count
    attendance_rate = round((effective_present / total_students * 100), 1) if total_students > 0 else 0

    # Calculate average lab duration
    durations_minutes = []
    for r in records:
        if r.duration and "m" in r.duration:
            parts = r.duration.split()
            mins = 0
            for p in parts:
                if "h" in p:
                    mins += int(p.replace("h", "")) * 60
                elif "m" in p:
                    mins += int(p.replace("m", ""))
            durations_minutes.append(mins)

    avg_minutes = int(sum(durations_minutes) / len(durations_minutes)) if durations_minutes else 75
    avg_duration_str = f"{avg_minutes // 60}h {avg_minutes % 60}m" if avg_minutes >= 60 else f"{avg_minutes}m"

    return {
        "date": target_date,
        "totalStudents": total_students,
        "totalLabs": total_labs,
        "presentCount": present_count,
        "lateCount": late_count,
        "absentCount": effective_absent,
        "attendanceRate": attendance_rate,
        "averageLabDuration": avg_duration_str,
        "averageDurationMinutes": avg_minutes,
        "totalRecorded": len(records)
    }

@router.get("/duration")
def get_duration_analytics(db: Session = Depends(get_db)):
    records = db.query(AttendanceRecord).filter(AttendanceRecord.duration != None).all()
    
    lab_durations = {}
    dept_durations = {}

    for r in records:
        if not r.duration:
            continue
        parts = r.duration.split()
        mins = 0
        for p in parts:
            if "h" in p:
                mins += int(p.replace("h", "")) * 60
            elif "m" in p:
                mins += int(p.replace("m", ""))

        if mins > 0:
            lab_durations.setdefault(r.lab_name, []).append(mins)
            dept_durations.setdefault(r.department, []).append(mins)

    lab_stats = [
        {
            "lab": lab,
            "avgMinutes": round(sum(vals) / len(vals)),
            "sessionsCount": len(vals)
        }
        for lab, vals in lab_durations.items()
    ]

    dept_stats = [
        {
            "department": dept,
            "avgMinutes": round(sum(vals) / len(vals)),
            "sessionsCount": len(vals)
        }
        for dept, vals in dept_durations.items()
    ]

    return {
        "labDurationStats": lab_stats,
        "departmentDurationStats": dept_stats
    }

@router.get("/student/{usn}")
def get_student_analytics(usn: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.usn == usn).first()
    if not student:
        return {"error": "Student not found"}

    records = db.query(AttendanceRecord).filter(AttendanceRecord.usn == usn).all()
    total = len(records)
    present = sum(1 for r in records if r.status in ["Present", "Late"])
    rate = round((present / total * 100), 1) if total > 0 else 0

    return {
        "usn": student.usn,
        "name": student.name,
        "department": student.department,
        "totalSessions": total,
        "presentSessions": present,
        "attendanceRate": rate,
        "records": [{
            "date": r.date,
            "lab": r.lab_name,
            "status": r.status,
            "entryTime": r.entry_time,
            "exitTime": r.exit_time,
            "duration": r.duration
        } for r in records]
    }

