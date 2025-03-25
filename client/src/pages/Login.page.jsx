import axios from "axios";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { getBaseUrl } from "../helpers/helper";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const formData = {
      email,
      password,
    };

    try {
      const { data } = await axios.post(`${getBaseUrl()}/login`, formData);

      localStorage.setItem("access_token", data.access_token);
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });
    }
  }

  return (
    <>
      <form className="w-50 m-auto mt-5" onSubmit={handleLogin}>
        <h1>Login to your Account</h1>
        <p>Welcome back!</p>

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
          Login
        </button>
        <p className="mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary">
            Create an account
          </Link>
        </p>
      </form>
    </>
  );
}
