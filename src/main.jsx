import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/Home/Home.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login-Register/Login.jsx'
import Register from './components/Register.jsx'
import Cart from './components/Cart/Cart.jsx'
import Account from './components/Account/Account.jsx'
import ProtectedRoutes from './utils/ProtectedRoutes.jsx'
import SingleProduct from './components/SingleProduct/SingleProduct.jsx'

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/products/:id",
    element: <SingleProduct/>
  },
  {
    path: "/cart",
    element: <Cart />
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/account",
        element: <Account/>
      },
    ]
  },
  {
    path: "*",
    element: <h1>404 Not Found.</h1>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
</QueryClientProvider>
  </React.StrictMode>,
)
