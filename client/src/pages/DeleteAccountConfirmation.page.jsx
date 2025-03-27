import axios from "axios";
import { Link, useNavigate } from "react-router";
import { getBaseUrl } from "../helpers/helper";

export default function DeleteAccountConfirmationPage() {
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
        <h1 className="mb-3">Are you sure you want to delete your account?</h1>

        <div className="mb-3 d-flex gap-2">
          <Link to="/profile" className="btn btn-primary">
            No
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Yes
          </button>
        </div>
      </div>
    </>
  );
}
