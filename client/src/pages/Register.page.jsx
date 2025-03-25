import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { getBaseUrl } from "../helpers/helper";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    const formData = {
      name,
      password,
      email,
    };
    try {
      await axios.post(`${getBaseUrl()}/register`, formData);
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
      <form className="w-50 m-auto mt-5" onSubmit={handleRegister}>
        <h1>Create your account</h1>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Full Name
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
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
        <p className="mt-2">
          You have account?{" "}
          <Link to="/login" className="text-primary">
            Login now
          </Link>
        </p>
      </form>
    </>
  );
}
