import { useState } from "react";
import { useUserCart } from "../../store/user-cart";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import Navbar from "../Navbar";
import "./Account.css";
import { compare } from 'bcryptjs';


export default function Account() {
  const [editMode, setEditMode] = useState(false);
  const { user, setUser } = useUserCart();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

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
    console.log("response from edit", response)
    if (response.data) {
      setUser({
        token,
        id,
        firstName,
        lastName,
        email,
        password,
      });
    }
    return response;
  }

  function submit(e) {
    e.preventDefault();
    if (compare(passwordConfirm, user.password)) {
      const info = {
        firstName: firstName ? firstName : "User",
        lastName: lastName ? lastName : "NoName",
        email: email,
        password: (password.length > 0) ? password : passwordConfirm,
      };
      editMutation.mutate(info);
      setPassword("");
      setPasswordConfirm("");
    }
  }

  return (
    <>
      <Navbar />
      <div className="accountMainContainer">
        <div className="accountTopLevelContainer">
          <h1 className="accountTitle">Account Information</h1>
          <div className="AccountIcon">
        <img
          className="AccountUserIcon"
          src="https://imgs.search.brave.com/k_br5BUmj-XYGfWIPHJS5RFZU8OruOx8m7j2d5AhxWg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pY29u/LWxpYnJhcnkuY29t/L2ltYWdlcy91c2Vy/LWljb24tanBnL3Vz/ZXItaWNvbi1qcGct/MTMuanBn"
          alt="User Icon"
        />
      </div>
          {!editMode && (
            <button className="editButton" onClick={() => setEditMode(true)}>
              Edit
            </button>
          )}
        </div>

        {editMode ? (
          <div className="editFormContainer">
            <form onSubmit={submit}>
              <input
                className="editInput"
                value={firstName}
                placeholder="New first name (leave blank to keep current)"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="editInput"
                value={lastName}
                placeholder="New last name (leave blank to keep current)"
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                className="editInput"
                type="email"
                value={email}
                placeholder="New email (leave blank to keep current)"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="editInput"
                type="password"
                placeholder="New Password (leave blank to keep current)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="editInput"
                type="passwordConfirm"
                placeholder="Confirm Previous Password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <button
                className="saveChangesButton"
                disabled={
                  !email || !passwordConfirm || passwordConfirm.length < 4
                }
              >
                {editMutation.isPending ? "Loading" : "Save Changes"}
              </button>
              <button
                className="cancelButton"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </form>
            {editMutation.isError && (
              <div className="errorContainer">
                {editMutation.error?.response?.data?.message ||
                  editMutation.error.message}
              </div>
            )}
          </div>
        ) : (
          <>
            <h4 className="userName">
              {user.firstName} {user.lastName}
            </h4>
            <h6 className="userEmail">{user.email}</h6>
          </>
        )}
      </div>
    </>
  );
}
