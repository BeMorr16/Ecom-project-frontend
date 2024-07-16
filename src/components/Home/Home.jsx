import { useQuery } from "@tanstack/react-query";
import "../App.css";
import "./Home.css"
import axios from "axios";
import Navbar from "../Navbar";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserCart } from "../../store/user-cart";

async function getProducts(selectedCategory) {
  try {
    let response;
    if (selectedCategory && selectedCategory !== "all") {
      response = await axios.get(
        `https://ecom-project-backend-gwbx.onrender.com/api/products/category/${selectedCategory}`
      );
    } else {
      response = await axios.get(
        "https://ecom-project-backend-gwbx.onrender.com/api/products"
      );
    }
    const data = response.data || [];
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", selectedCategory],
    keepPreviousData: true,
    queryFn: () => getProducts(selectedCategory),
  });
  const navigate = useNavigate();
  const { user, cart, loggedIn, addToCart, fetchCart } = useUserCart();
  const [notification, setNotification] = useState(false);
console.log(cart)
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div>Spinner</div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div>Error: {error.message}</div>
      </>
    );
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  async function addButton(itemId) {
    await addToCart(user.id, itemId, 1);
    await fetchCart(user.id)
    setNotification(true);

    // Hide the notification after 3 seconds
    setTimeout(() => {
      setNotification(false);
    }, 3000);
  }
  console.log(user.id);
  return (
    <>
    
      <Navbar className="home-navbar" />
      <h1 className="home-title">Search our Store</h1>
      <div className="home-form-container">
        <form>
          <label htmlFor="categories" className="home-form-label">
            Select a category:
          </label>
          <select
            name="categories"
            onChange={handleCategoryChange}
            value={selectedCategory}
            className="home-form-select"
          >
            <option value="all">All</option>
            <option value="jewelery">Jewelry</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's clothing</option>
            <option value="electronics">Electronics</option>
          </select>
        </form>
      </div>
      <div className="home-item-container">
        {data?.map((item) => {
          return (
            <div key={item.id} className="home-item">
              <div
                onClick={() => {
                  navigate(`/products/${item.id}`);
                }}
                className="home-item-content"
              >
                <h3 className="home-item-title">{item.title}</h3>
                <img
                  src={item.image}
                  alt={item.title}
                  className="home-item-image"
                />
              </div>
              {loggedIn && (
                <button
                  onClick={() => {
                    addButton(item.id)
                  }}
                  className="home-add-button"
                >
                  Add 1 to cart
                </button>
              )}
              {notification && (
        <div className="notification">
          Added to cart
        </div>
      )}

            </div>
          );
        })}
      </div>
    </>
  );
}

export default Home;
