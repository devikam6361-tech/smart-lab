import json
import datetime
from database import engine, Base, SessionLocal
from models import User, Student, Lab, AttendanceRecord

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Users if empty
        if db.query(User).count() == 0:
            default_users = [
                User(
                    id="user-hod-01",
                    name="Head of Department",
                    email="hod@gmail.com",
                    password="123456",
                    role="hod",
                    department="Computer Science"
                ),
                User(
                    id="user-teacher-01",
                    name="Prof. Sharma",
                    email="teacher@gmail.com",
                    password="123456",
                    role="teacher",
                    department="Computer Science"
                ),
                User(
                    id="user-clerk-01",
                    name="Lab Clerk Admin",
                    email="clerk@gmail.com",
                    password="123456",
                    role="clerk",
                    department="MCA"
                )
            ]
            db.add_all(default_users)
            db.commit()
            print("[Seed] Created default users (HOD, Teacher, Clerk).")

        # 2. Seed Labs if empty
        if db.query(Lab).count() == 0:
            default_labs = [
                Lab(
                    id="lab-01",
                    labName="DBMS Lab",
                    labCode="MCA201",
                    department="MCA",
                    assignedSemester="2",
                    assignedSection="A",
                    status="ACTIVE"
                ),
                Lab(
                    id="lab-02",
                    labName="Java Lab",
                    labCode="MCA202",
                    department="MCA",
                    assignedSemester="2",
                    assignedSection="A",
                    status="ACTIVE"
                ),
                Lab(
                    id="lab-03",
                    labName="DSA Lab",
                    labCode="CS301",
                    department="Computer Science",
                    assignedSemester="3",
                    assignedSection="A",
                    status="ACTIVE"
                ),
                Lab(
                    id="lab-04",
                    labName="Python Lab",
                    labCode="CS501",
                    department="Computer Science",
                    assignedSemester="5",
                    assignedSection="A",
                    status="ACTIVE"
                ),
                Lab(
                    id="lab-05",
                    labName="AI Lab",
                    labCode="AI601",
                    department="Computer Science",
                    assignedSemester="6",
                    assignedSection="A",
                    status="ACTIVE"
                )
            ]
            db.add_all(default_labs)
            db.commit()
            print("[Seed] Created default labs.")

        # 3. Seed Students if empty
        if db.query(Student).count() == 0:
            default_students = [
                Student(
                    id="std-01",
                    usn="1BM25MCA001",
                    name="Devika",
                    department="MCA",
                    semester="2",
                    section="A",
                    rollNumber="MCA-01",
                    assigned_labs=json.dumps(["lab-01", "lab-02"]),
                    face_enrolled=True
                ),
                Student(
                    id="std-02",
                    usn="1BM25MCA002",
                    name="Yashodha",
                    department="MCA",
                    semester="2",
                    section="A",
                    rollNumber="MCA-02",
                    assigned_labs=json.dumps(["lab-01"]),
                    face_enrolled=True
                ),
                Student(
                    id="std-03",
                    usn="1BM25MCA003",
                    name="Student 3",
                    department="MCA",
                    semester="2",
                    section="A",
                    rollNumber="MCA-03",
                    assigned_labs=json.dumps(["lab-01"]),
                    face_enrolled=False
                ),
                Student(
                    id="std-04",
                    usn="1RV23CS001",
                    name="Rahul",
                    department="Computer Science",
                    semester="5",
                    section="A",
                    rollNumber="CS-01",
                    assigned_labs=json.dumps(["lab-04"]),
                    face_enrolled=True
                )
            ]
            db.add_all(default_students)
            db.commit()
            print("[Seed] Created default students.")

        # 4. Seed sample attendance records for today if none exist
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        if db.query(AttendanceRecord).filter(AttendanceRecord.date == today).count() == 0:
            sample_records = [
                AttendanceRecord(
                    id="rec-01",
                    student_id="std-01",
                    usn="1BM25MCA001",
                    student_name="Devika",
                    department="MCA",
                    semester="2",
                    section="A",
                    lab_name="DBMS Lab",
                    date=today,
                    entry_time="09:05:12 AM",
                    exit_time="11:15:30 AM",
                    duration="2h 10m",
                    status="Present",
                    verification_mode="AI_CAMERA",
                    confidence=0.985,
                    remarks="Automatic camera verification"
                ),
                AttendanceRecord(
                    id="rec-02",
                    student_id="std-02",
                    usn="1BM25MCA002",
                    student_name="Yashodha",
                    department="MCA",
                    semester="2",
                    section="A",
                    lab_name="DBMS Lab",
                    date=today,
                    entry_time="09:18:40 AM",
                    exit_time="11:15:20 AM",
                    duration="1h 56m",
                    status="Present",
                    verification_mode="AI_CAMERA",
                    confidence=0.978,
                    remarks="Automatic camera verification"
                ),
                AttendanceRecord(
                    id="rec-03",
                    student_id="std-03",
                    usn="1BM25MCA003",
                    student_name="Student 3",
                    department="MCA",
                    semester="2",
                    section="A",
                    lab_name="DBMS Lab",
                    date=today,
                    entry_time="",
                    exit_time="",
                    duration="",
                    status="Absent",
                    verification_mode="MANUAL"
                ),
            ]
            db.add_all(sample_records)
            db.commit()
            print("[Seed] Created sample attendance records for today.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

