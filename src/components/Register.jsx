import { useState } from "react"
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { useUserCart } from "../store/user-cart";
import Navbar from "./Navbar";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate('/account')
    }
  })
  const navigate = useNavigate();
  const { setUser, setLoggedIn } = useUserCart();


  async function register(info) {
    try {
      const response = await axios.post("https://ecom-project-backend-gwbx.onrender.com/auth/register", info);
      if (response.data.token) {
        setUser({
          token: response.data.token
        });
        window.localStorage.setItem('token', response.data.token);
        setLoggedIn(true);
      }
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  function submit(e) {
    e.preventDefault();

    const info = {
      firstName: firstName ? firstName : "User",
      lastName: lastName ? lastName : "NoName",
      email: email,
      password: password,
    }
    registerMutation.mutate(info)
  }

  return (
    <>
      <Navbar />
      <h1>Registration</h1>
      <form onSubmit={submit}>
        <input value={firstName} placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
        <input value={lastName} placeholder="Last Name" onChange={(e)=> setLastName(e.target.value)} />
        <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button disabled={!email || !password || password.length < 4}>
          {registerMutation.isPending ? "Loading" : "Register"}
        </button>
      </form>
      {registerMutation.isError && (
        <div>{registerMutation.error?.response?.data?.message || registerMutation.error.message}</div>
      )}
    </>
  )
}
