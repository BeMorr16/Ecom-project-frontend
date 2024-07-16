import { create } from "zustand";
import axios from "axios";

export const useUserCart = create((set, get) => ({
    user: {},
    cart: [],
    loggedIn: false,

    setUser: (user) => set({ user }),


    fetchCart: async (userId) => {
        try {
            const response = await axios.get(`https://ecom-project-backend-gwbx.onrender.com/api/cart/${userId}`);
            set({ cart: response.data.items });
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    },
    

    // addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
    addToCart: async (userId, productId, quantity) => {
        try {
            const response = await axios.post(`https://ecom-project-backend-gwbx.onrender.com/api/cart/add/${userId}/${productId}/${quantity}`);
            return response;
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    },


    // removeFromCart: (itemKey) => set((state) => ({
    //     cart: state.cart.filter(item => item.id !== itemKey)
    // })),
    removeFromCart: async (cartItemId, quantity) => {
        try {
            const response = await axios.delete(`https://ecom-project-backend-gwbx.onrender.com/api/cart/delete/${cartItemId}/${quantity}`);
            return response
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    },
    checkOutCart: async (arrayOfCartItemId) => {
        try {
            for (let cartItemId of arrayOfCartItemId) {
                const response = await axios.delete(`https://ecom-project-backend-gwbx.onrender.com/api/cart/delete/${cartItemId}/0`);
                return response
            }
        } catch (error) {
            console.log("Error checking out", error)
        }
    },

    getTotalPrice: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    },
    setLoggedIn: (status) => set({ loggedIn: status }),
    logout: () => set({ 
        user: { },
        cart: [],
        loggedIn: false 
    })
    }));
