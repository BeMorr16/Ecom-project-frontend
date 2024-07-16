import { Outlet, Navigate } from "react-router";
import { useUserCart } from "../store/user-cart";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";



const ProtectedRoutes = () => {
    const { user, setUser, loggedIn, setLoggedIn, fetchCart } = useUserCart()
    const token = user.token || window.localStorage.getItem('token');

    const {isError, isLoading, isSuccess} = useQuery({
        queryKey: ["Auth"],
        queryFn: authorize,
        enabled: !!token,
    })


    async function authorize() {
        try {
            const response = await axios.get("https://ecom-project-backend-gwbx.onrender.com/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const { firstName, lastName, email, id, password} = response.data;
            setUser({
                token,
                id,
                firstName,
                lastName,
                email, 
                password,
            })
            setLoggedIn(true);
            fetchCart(id)
            return response.data;
        } catch (error) {
            setLoggedIn(false);
            throw new Error(error.response?.data?.message || error.message);
          }
    }


    if (isError || !loggedIn) {
     return <Navigate to={"/login"} />
    }
    if (isLoading) {
        return <div>Spinner</div>
    }
    if (loggedIn && isSuccess) {
        return <Outlet />
    }
}

export default ProtectedRoutes