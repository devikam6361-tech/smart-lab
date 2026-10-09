from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from typing import Optional
import csv
import io

from database import get_db
from models import AttendanceRecord, Student

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/attendance")
def get_report_attendance(
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    lab: Optional[str] = None,
    department: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AttendanceRecord)
    if startDate:
        query = query.filter(AttendanceRecord.date >= startDate)
    if endDate:
        query = query.filter(AttendanceRecord.date <= endDate)
    if lab and lab != "All":
        query = query.filter(AttendanceRecord.lab_name == lab)
    if department and department != "All":
        query = query.filter(AttendanceRecord.department == department)

    records = query.all()
    return [{
        "usn": r.usn,
        "name": r.student_name,
        "department": r.department,
        "semester": r.semester,
        "section": r.section,
        "lab": r.lab_name,
        "date": r.date,
        "entryTime": r.entry_time or "-",
        "exitTime": r.exit_time or "-",
        "duration": r.duration or "-",
        "status": r.status,
        "verificationMode": r.verification_mode,
        "confidence": r.confidence
    } for r in records]

@router.get("/export-csv")
def export_csv_report(
    date: Optional[str] = None,
    lab: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AttendanceRecord)
    if date:
        query = query.filter(AttendanceRecord.date == date)
    if lab and lab != "All":
        query = query.filter(AttendanceRecord.lab_name == lab)

    records = query.all()
    output = io.StringIO()
    writer = csv.writer(output)

    # Headers
    writer.writerow([
        "Date", "USN", "Name", "Department", "Semester", "Section",
        "Lab", "Entry Time", "Exit Time", "Duration", "Status", "Verification Mode"
    ])

    for r in records:
        writer.writerow([
            r.date, r.usn, r.student_name, r.department, r.semester, r.section,
            r.lab_name, r.entry_time or "", r.exit_time or "", r.duration or "",
            r.status, r.verification_mode
        ])

    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=SmartLab_Attendance_{date or 'all'}.csv"
    return response

