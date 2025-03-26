import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getBaseUrl } from "../helpers/helper";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

      callback: async (response) => {
        console.log("Encoded JWT ID token: " + response.credential);
        const { data } = await axios.post(getBaseUrl() + `/auth/google`, {
          googleToken: response.credential,
        });
        localStorage.setItem("access_token", data.access_token);

        // navigate to the home page or do magic stuff
        navigate("/");
      },
    });

    google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
      theme: "outline",
      size: "large",
    });
    // Display the One Tap dialog; comment out to remove the dialog
    google.accounts.id.prompt();
  }, []);

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
        <button type="submit" className="btn btn-primary mb-3">
          Login
        </button>
        <div id="buttonDiv"></div>

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
