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
            // console.log(response)
            // Set the CART ID in state
            set({ cart: response.data.items });
            // console.log("response from fetch cart", response)
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    },
    

    // addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
    addToCart: async (userId, productId, quantity) => {
        try {
            console.log(userId, productId, quantity)
            const response = await axios.post(`https://ecom-project-backend-gwbx.onrender.com/api/cart/add/${userId}/${productId}/${quantity}`);
            // const cartData = response.data.cart.items
            // let priceToAdd = 0;
            // for (let i = 0; i < cartData.length; i++){
            //     if (cartData[i].productId === productId) {
            //         priceToAdd = cartData[i]
            //     }
            // }
            console.log("response from add", response)
            const updatedCart = response.data.cart.items.map(item => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
            }));
            set({ cart: updatedCart });
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
            if (response.status === 204) {
                set((state) => ({
                    cart: state.cart.filter(item => item.id !== cartItemId)
                }));
            } else {
                const decrementedItem = response.data;
                set((state) => ({
                    cart: state.cart.map(item =>
                        item.id === decrementedItem.id ? { ...item, quantity: decrementedItem.quantity } : item
                    )
                }));
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
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
