import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getBaseUrl } from "../helpers/helper";

export default function EditProfilePage() {
  const [name, setName] = useState("");

  const navigate = useNavigate();

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

  async function handleEdit(e) {
    e.preventDefault();
    const formData = {
      name,
    };
    try {
      await axios.patch(`${getBaseUrl()}/users/edit`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      navigate("/profile");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });
    }
  }
  return (
    <>
      <form className="w-50 m-auto mt-5" onSubmit={handleEdit}>
        <h1>Edit Profile</h1>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
}
