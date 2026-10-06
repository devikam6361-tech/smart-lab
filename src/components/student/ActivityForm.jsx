import { useState } from "react";

import { useActivities } from "../../context/ActivityContext";


const initialState = {
  type: "PROJECT",
  title: "",
  description: "",
  subject: "",
  marks: "",
  status: "COMPLETED",
};


const ActivityForm = ({
  studentId,
}) => {


  const {
    addActivity,
  } = useActivities();



  const [form, setForm] =
    useState(initialState);



  const handleChange = (e) => {

    setForm((prev)=>({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));

  };



  const submit = (e)=>{

    e.preventDefault();


    addActivity({

      studentId,

      ...form,

      marks:
        form.type === "INTERNAL"
          ? Number(form.marks)
          : null,

    });



    setForm(initialState);

  };



  return (

    <form
      onSubmit={submit}
      className="border p-5 rounded space-y-3"
    >


      <h2 className="text-xl font-bold">
        Add Student Activity
      </h2>



      <select

        name="type"

        value={form.type}

        onChange={handleChange}

        className="border p-2 w-full"

      >

        <option value="PROJECT">
          Project
        </option>

        <option value="INTERNAL">
          Internal Marks
        </option>

        <option value="CERTIFICATE">
          Certificate
        </option>

        <option value="REMARK">
          Remark
        </option>

      </select>




      <input

        name="title"

        value={form.title}

        onChange={handleChange}

        placeholder="Title"

        className="border p-2 w-full"

      />




      <textarea

        name="description"

        value={form.description}

        onChange={handleChange}

        placeholder="Description"

        className="border p-2 w-full"

      />





      {
        form.type === "INTERNAL" && (

          <input

            name="marks"

            type="number"

            value={form.marks}

            onChange={handleChange}

            placeholder="Marks"

            className="border p-2 w-full"

          />

        )
      }




      <input

        name="subject"

        value={form.subject}

        onChange={handleChange}

        placeholder="Subject"

        className="border p-2 w-full"

      />




      <button

        type="submit"

        className="border px-4 py-2"

      >

        Save Activity

      </button>



    </form>

  );

};


export default ActivityForm;