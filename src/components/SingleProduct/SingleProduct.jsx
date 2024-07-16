// import React from 'react'

import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { useParams } from "react-router";
import Navbar from "../Navbar";
import { useUserCart } from "../../store/user-cart";
import { useState } from "react";



async function getProduct(id) {
    try {
        const response = await axios.get(`https://ecom-project-backend-gwbx.onrender.com/api/products/${id}`);
        const data = response.data || []
        return data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
}
export default function SingleProduct() {
    const { id } = useParams();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProduct(id),
    })
    const { user, addToCart } = useUserCart();
    const [num, setNum] = useState(1);
    if (isLoading) {
        <Navbar/>
      return <div>Spinner</div>
      }
      if (isError) {
        return <div>Error: {error.message}</div>
      }
    
      const handleQuantityChange = (e) => {
        setNum(parseInt(e.target.value));
      };
    
  return (
      <div>
          <Navbar/>
          <h1>{data.title}</h1>
          <img src={data.image} alt={data.title} />
          <form>
        <select name="quantity" value={num} onChange={handleQuantityChange}>
          {/* Generate options from 1 to 10 */}
          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            addToCart(user.id, data.id, num);
          }}
        >
          Add {num} to cart
        </button>
      </form>
    </div>
  )
}
