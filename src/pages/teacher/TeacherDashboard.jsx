import DashboardLayout from "../../components/layout/DashboardLayout";

import StatCard from "../../components/common/StatCard";

import { useAuth } from "../../contexts/AuthContext";

import { useTeachers } from "../../contexts/TeacherContext";

const Dashboard = ()=>{

    const {

        currentUser

    }=useAuth();

    const {

        teachers

    }=useTeachers();

    const teacher=

        teachers.find(

            t=>t.email===currentUser.email

        );

    return(

        <DashboardLayout
    title="Attendance"
>

            <div className="grid grid-cols-3 gap-5">

                <StatCard

                    title="Assigned Subjects"

                    value={

                        teacher?.assignedSubjects.length||0

                    }

                />

            </div>

            <div className="mt-8">

                <h2 className="text-2xl font-bold">

                    My Subjects

                </h2>

                {

                    teacher?.assignedSubjects.map(subject=>(

                        <div

                            key={subject.subjectCode}

                            className="border p-3 mt-3"

                        >

                            <h3>

                                {subject.subjectName}

                            </h3>

                            <p>

                                Semester {subject.semester}

                            </p>

                            <p>

                                Section {subject.section}

                            </p>

                        </div>

                    ))

                }

            </div>

        </DashboardLayout>

    );

};

export default Dashboard;