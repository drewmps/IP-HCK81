import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getBaseUrl } from "../helpers/helper";

export default function ProfilePage() {
  const [name, setName] = useState("");
  async function getCurrentUser() {
    try {
      const { data } = await axios.get(`${getBaseUrl()}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setName(data.name);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });
    }
  }
  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <>
      <div className="w-50 m-auto mt-5">
        <h1 className="mb-3">Profile</h1>

        <div>
          <h5>Name</h5>
          <p>{name}</p>
        </div>

        <div className="mb-3">
          <Link to="/profile/edit" className="btn btn-primary">
            Edit profile
          </Link>
        </div>
        <Link to="/profile/delete" className="btn btn-danger">
          Delete account
        </Link>
      </div>
    </>
  );
}
