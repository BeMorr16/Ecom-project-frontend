import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { useUserCart } from "../../store/user-cart";
import Navbar from "../Navbar";
import "./Login-Register.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/account");
    },
  });
  const navigate = useNavigate();
  const { setUser, setLoggedIn } = useUserCart();

  async function login(info) {
    const response = await axios.post(
      "https://ecom-project-backend-gwbx.onrender.com/auth/login",
      info
    );
    if (response.data.token) {
      setUser({
        token: response.data.token,
      });
      window.localStorage.setItem("token", response.data.token);
      setLoggedIn(true);
    }
    return response;
  }

  function submit(e) {
    e.preventDefault();

    const info = {
      email: email,
      password: password,
    };
    loginMutation.mutate(info);
  }

  return (
    <>
      <Navbar />
      <div className="loginContainer">
        <div className="LoginFormContainer">
          <h1 className="Login-Register-h1">Login</h1>
          <form onSubmit={submit}>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="LoginButton" disabled={!email || !password}>
              {loginMutation.isPending ? "Loading" : "Login"}
            </button>
          </form>
          {loginMutation.isError && (
            <div>
              {loginMutation.error?.response?.data?.message ||
                loginMutation.error.message}
            </div>
          )}
                  <div className="loginToRegistrationContainer">
          <h3>If you don&#39;t have an account Register</h3>
          <button className="LoginButton" onClick={() => navigate("/register")}>Here</button>
        </div>
        </div>
        </div>
    </>
  );
}
