import { useQuery } from "@tanstack/react-query";
import "./App.css";
import axios from "axios";
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserCart } from "../store/user-cart";

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
  const { user, cart, loggedIn, addToCart } = useUserCart();
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
  console.log(user.id);
  return (
    <>
      <Navbar />
      <h1>Products</h1>
      <div>
        <form>
          <label htmlFor="categories">Select a category:</label>
          <select
            name="categories"
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            <option value="all">All</option>
            <option value="jewelery">Jewlery</option>
            <option value="men&#39;s clothing">Men&#39;s Clothing</option>
            <option value="women&#39;s clothing">Women&#39;s clothing</option>
            <option value="electronics">Electronics</option>
          </select>
        </form>
      </div>
      <div>
        {data?.map((item) => {
          return (
            <div key={item.id}>
              <div
                onClick={() => {
                  navigate(`/products/${item.id}`);
                }}
              >
                <h3>{item.title}</h3>
                <img src={item.image} alt={item.title} />
              </div>
              {loggedIn && (
                <button
                  onClick={() => {
                    addToCart(user.id, item.id, 1);
                  }}
                >
                  Add 1 to cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Home;
