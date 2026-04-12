import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SubjectList() {

  const { department } = useParams();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await axios.get(
        `https://eduerp-y7bk.onrender.com/api/subjects?department=${department}`
      );
      setSubjects(res.data);
    };

    fetchSubjects();
  }, [department]);

  return (
    <div style={{ padding: "20px" }}>

      <h2>{department} Subjects</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject Name</th>
          </tr>
        </thead>

        <tbody>
          {subjects.length > 0 ? (
            subjects.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No Subjects Found</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default SubjectList;