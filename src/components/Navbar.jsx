import { Link } from "react-router-dom"
import { useUserCart } from "../store/user-cart"

export default function Navbar() {
  const { loggedIn, logout } = useUserCart()
  

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.reload()
    logout();
  }

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8f9fa' }}>
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Link to="/">Home</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/account">Account</Link>
    </div>
      <div>
        {loggedIn ? <Link onClick={handleLogout}>Logout</Link> : <Link to="/login">Login</Link>}
    </div>
  </nav>
  )
}
