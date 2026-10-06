const StudentProfile = ({ student }) => {

    return(

        <div className="space-y-3">

            <p>

                <strong>USN :</strong>

                {student.usn}

            </p>

            <p>

                <strong>Name :</strong>

                {student.name}

            </p>

            <p>

                <strong>Department :</strong>

                {student.department}

            </p>

            <p>

                <strong>Semester :</strong>

                {student.semester}

            </p>

            <p>

                <strong>Section :</strong>

                {student.section}

            </p>

            <hr/>

            <h3 className="font-bold">

                Assigned Subjects

            </h3>

            {

                student.subjects.map(subject=>(

                    <div key={subject.subjectCode}>

                        {subject.subjectName}

                    </div>

                ))

            }

        </div>

    );

};

export default StudentProfile;