import React from "react";
import {Routes, Route} from "react-router-dom";
import "./App.css";
import Login from "../components/Login";
import Navbar from "../components/Navbar";
import TransactionList from "../components/TransactionList";
import CategoryList from "../components/CategoryList";
import PaymentMethodList from "../components/PaymentMethodList";
import {useAuth, AuthProvider} from "../contexts/AuthContext";
import Layout from "./Layout";

function AppContent() {
    const {auth} = useAuth();

    if (!auth) {
        return <Login/>;
    }

    return (
        <div className="app-container">
            {/*<Navbar/>*/}
            <div>
                <Routes>
                    <Route element={<Layout/>}>
                        <Route path="/" element={<TransactionList/>}/>
                        <Route path="/categories" element={<CategoryList/>}/>
                        <Route path="/payment-methods" element={<PaymentMethodList/>}/>
                    </Route>
                </Routes>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent/>
        </AuthProvider>
    );
}
