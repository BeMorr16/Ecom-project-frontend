/* eslint-disable react/prop-types */
import { useNavigate } from "react-router";
import { useUserCart } from "../../store/user-cart";
import Navbar from "../Navbar";
import { useState } from "react";
import { useEffect } from "react";
import "./Cart.css";

export default function Cart() {
  const { user, cart, loggedIn } = useUserCart();
  const navigate = useNavigate();
  const [cartToMap, setCartToMap] = useState(cart);

  useEffect(() => {
    setCartToMap(cart);
  }, [cart]);

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

  return (
    <>
      <Navbar />

      <div className="cartOuterContainer">
        <div className="cartContainer">
          {cartToMap.map((item) => {
            return (
              <CartComponent key={item.product.id} user={user} item={item} />
            );
          })}
        </div>
        <div className="checkoutContainer">
          <h2>Checkout:</h2>
          <Checkout cart={cartToMap} />
        </div>
      </div>
    </>
  );
}

function Checkout({ cart }) {
  const { getTotalPrice, checkOutCart, fetchCart, user } = useUserCart();
  let arrayOfCartItemId = [];
  for (let prod of cart) {
    arrayOfCartItemId.push(prod.id);
  }
  const totalPrice = getTotalPrice();

  async function handleCheckout() {
    await checkOutCart(arrayOfCartItemId);
    await fetchCart(user.id);
  }
  return (
    <div className="checkoutSummary">
      {cart.map((item) => {
        const itemTotal = item.product.price * item.quantity;
        return (
          <div key={item.product.id} className="checkoutItem">
            <div className="checkoutItemDetails">
              <h4 className="checkoutItemTitle">{item.product.title}</h4>
              <div className="checkoutItemInfo">
                <h3 className="checkoutItemQuantity">Qty: {item.quantity}</h3>
                <h4 className="checkoutItemPrice">
                  ${item.product.price.toFixed(2)}
                </h4>
              </div>
            </div>
            <h4 className="checkoutItemTotal">${itemTotal.toFixed(2)}</h4>
          </div>
        );
      })}
      <h3 className="checkoutTotalPrice">
        Total Price: {totalPrice.toFixed(2)}
      </h3>
      <button className="checkoutButton" onClick={() => handleCheckout()}>
        Checkout
      </button>
    </div>
  );
}

function CartComponent({ user, item }) {
  const [num, setNum] = useState(1);
  const { addToCart, fetchCart, removeFromCart } = useUserCart();

  const handleQuantityChange = (e) => {
    const number = parseInt(e.target.value);
    setNum(number);
  };

  async function addMultiple(userId, itemId, num) {
    await addToCart(userId, itemId, num);
    await fetchCart(user.id);
  }

  async function removeMultiple(id, num) {
    await removeFromCart(id, num);
    await fetchCart(user.id);
  }

  async function deleteItem(id, num) {
    await removeFromCart(id, num);
    await fetchCart(user.id);
  }
  return (
    <>
      <div className="dealWithText" key={item.product.id}>
        <div className="cartCard">
          <div className="cartInfo">
            <h3>{item.product.title}</h3>
            <p>{item.product.category}</p>
            <h5>Price: {item.product.price}</h5>
            <h5>Quantity: {item.quantity}</h5>
          </div>
          <img
            src={item.product.image}
            alt={item.product.title}
            className="cartImage"
          />
          <div className="cartFormContainer">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="cartForm"
            >
              <select
                name="quantity"
                value={num}
                onChange={handleQuantityChange}
                className="cartSelect"
              >
                {/* Generate options from 1 to 10 */}
                {Array.from({ length: 10 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <div className="cartButtons">
                <p>Edit quantity:</p>
                <button
                  onClick={() => {
                    addMultiple(user.id, item.product.id, num);
                  }}
                >
                  Add {num} to cart
                </button>
                <button onClick={() => removeMultiple(item.id, num)}>
                  Remove {num} Item
                </button>
              </div>
            </form>
            <button onClick={() => deleteItem(item.id, 0)} className="cartDeleteButton">Delete item</button>
          </div>
        </div>
        <p className="cartDescription">{item.product.description}</p>
      </div>
    </>
  );
}
