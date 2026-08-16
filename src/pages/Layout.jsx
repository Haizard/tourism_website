import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import OrderPopup from "../components/OrderPopup/OrderPopup";
import ChatBot from "../components/Chat/ChatBot";
import WhatsAppButton from "../components/WhatsApp/WhatsAppButton";
import PageMeta from "../components/UI/PageMeta";

const Layout = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);
  const location = useLocation();

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login");

  return (
    <>
      <PageMeta />
      {!isAdminRoute && <Navbar handleOrderPopup={handleOrderPopup} />}
      <Outlet />
      {!isAdminRoute && (
        <>
          <ChatBot />
          <WhatsAppButton />
          <Footer />
        </>
      )}
      <OrderPopup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
    </>
  );
};

export default Layout;
