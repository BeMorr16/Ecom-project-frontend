import { useState } from "react";
import { useUserCart } from "../store/user-cart";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import Navbar from "./Navbar";

export default function Account() {
  const [editMode, setEditMode] = useState(false);
  const { user, setUser, cart } = useUserCart();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

console.log(cart)
  const editMutation = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      setEditMode(false);
    },
  });
  async function editProfile(info) {
    const id = user.id;
    const token = user.token || window.localStorage.getItem("token");
    const response = await axios.put(
      `https://ecom-project-backend-gwbx.onrender.com/auth/users/${id}`,
      info,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data) {
      setUser({
        token,
        id,
        firstName,
        lastName,
        email,
        password
      });
    }
    return response;
  }

  function submit(e) {
    e.preventDefault();
    if (passwordConfirm === user.password) {
      const info = {
        firstName: firstName ? firstName : "User",
        lastName: lastName ? lastName : "NoName",
        email: email,
        password: password ? password : passwordConfirm,
      };
      editMutation.mutate(info);
      setPassword("")
      setPasswordConfirm("")
    }
  }


  return (
    <>
      <Navbar />
      <div>
        <div className="AccountTopLevelContainer">
          <h1>Account Information</h1>
          {!editMode && <button onClick={() => setEditMode(true)}>Edit</button>}
        </div>

        {editMode ? (
          <div>
            <form onSubmit={submit}>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password (leave blank to keep current)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="passwordConfirm"
                placeholder="Confirm Previous Password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <button disabled={!email || !passwordConfirm || passwordConfirm.length < 4}>
                {editMutation.isPending ? "Loading" : "Save Changes"}
              </button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </form>
            {editMutation.isError && (
              <div>
                {editMutation.error?.response?.data?.message ||
                  editMutation.error.message}
              </div>
            )}
          </div>
        ) : (
          <>
            <h4>
              {user.firstName} {user.lastName}
            </h4>
            <h6>{user.email}</h6>
          </>
        )}
      </div>
    </>
  );
}
