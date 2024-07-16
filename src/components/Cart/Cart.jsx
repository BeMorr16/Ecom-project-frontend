/* eslint-disable react/prop-types */
import { useNavigate } from "react-router";
import { useUserCart } from "../../store/user-cart";
import Navbar from "../Navbar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


// async function getPrices(cart) {
//   try {
//     const priceData = [];
//     for (let item of cart) {
//       const response = await axios.get(`https://ecom-project-backend-gwbx.onrender.com/api/products/${item.productId}`)
//       // console.log(response)
//       // const priceResponse = response.data.price
//       priceData.push({ ...item.product })
//     }
//     return priceData
//   } catch (error) {
//    throw new Error("error getting prices", error)
//   }
// }

export default function Cart( ) {
    const { user, cart, loggedIn, removeFromCart, addToCart } = useUserCart();
  const navigate = useNavigate();
  const [num, setNum] = useState(1);
  console.log("cart in CART:", cart);
  const cartToMap = cart
  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ['priceData', cart],
  //   keepPreviousData: true,
  //   queryFn: () => getPrices(cart)
  // })
// console.log(data)
  if (!loggedIn) {
    return (
      <div>
        <Navbar />
        <h1>Login to add items to your cart</h1>
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </button>
      </div>
    );
  }
  if (cartToMap.length <= 0 || !cartToMap) {
    return (
      <div>
        <Navbar />
        <h1>No Items in Cart</h1>
        <button onClick={() => navigate("/")}>Add Items</button>
      </div>
    );
  }
  

  const handleQuantityChange = (e) => {
    const number = parseInt(e.target.value)
    setNum(number);
  };

  return (
    <>
     <Navbar />
      <div>
        <div className="cartContainer">
          {cartToMap.map((item) => {
            return (
              <div key={item.product.id}>
                <h2>{item.product.title}</h2>
                <h4>{item.product.price}</h4>
                <h4>{item.product.category}</h4>
                <p>{item.product.description}</p>
                <p>{item.quantity}</p>
                <img src={item.product.image} alt={item.product.title} />

                {/* <button onClick={() => removeFromCart(item.id)}>
                  Remove Item
                </button> */}
                <form onSubmit={(e) => {e.preventDefault()}}>
        <select name="quantity" value={num} onChange={handleQuantityChange}>
          {/* Generate options from 1 to 10 */}
          {Array.from({ length: 10 }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            addToCart(user.id, item.product.id, num);
          }}
        >
          Add {num} to cart
        </button>
                </form>
                <button>Delete from Cart</button> {/* Add functionality */}
              </div>
            );
          })}
        </div>
            <div className="checkoutContainer">
              <h5>Items:</h5>
              <Checkout cart={cartToMap} />
            </div>
      </div>
    </>
  );
}

function Checkout({ cart }) {
  const { getTotalPrice } = useUserCart();
  const totalPrice = getTotalPrice();
  return (
    <div>
      {cart.map((item) => {
        return (
          <div key={item.product.id}>
            <h4>{item.product.title}</h4>
            <h4>{item.product.price.toFixed(2)}</h4>
          </div>
        );
      })}
      <h3>Total Price: {totalPrice.toFixed(2)}</h3>
      <button>Checkout</button>
    </div>
  );
}
