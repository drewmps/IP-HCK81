import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getBaseUrl } from "../helpers/helper";

export default function ProfilePage() {
  // useEffect(() => {
  //   async function getNews() {
  //     const response = await axios.get(`${getBaseUrl()}/news/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //       },
  //     });
  //     setNews(response.data);
  //   }
  //   getNews();
  // }, []);
  const navigate = useNavigate();
  async function handleDelete() {
    try {
      await axios.delete(`${getBaseUrl()}/users/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      localStorage.removeItem("access_token");
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });
    }
  }
  return (
    <>
      <div className="w-50 m-auto mt-5">
        <h1 className="mb-3">Profile</h1>

        <div>
          <h5>Name</h5>
          <p>Namanya</p>
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
