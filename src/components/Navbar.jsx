import { Link } from "react-router-dom"
import { useUserCart } from "../store/user-cart"
import { ShoppingCart } from "phosphor-react"
import "./Navbar.css"
export default function Navbar() {
  const { loggedIn, logout } = useUserCart()
  

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.reload()
    logout();
  }

  return (
    <nav className="navbar">
      <div style={{ display: "flex", gap: "1rem" }} className="link-container">
        <Link className="link" to="/">
          Home
        </Link>

        <Link className="link" to="/account">
          Account
        </Link>
        {loggedIn ? (
          <Link className="log" onClick={handleLogout}>
            Logout
          </Link>
        ) : (
          <Link className="log" to="/login">
            Login
          </Link>
        )}
        <Link className="link" to="/cart">
          <ShoppingCart className="shopping"/>
        </Link>
      </div>
    </nav>
  );
}
