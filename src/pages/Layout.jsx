import React from 'react';
import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
    return (
        <>
            <Header/>
            <main className="main">
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
};

export default Layout;