import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Employees from "./pages/employees/employees";
import Index from "./pages/index";
import Navbar from "./navbar/Navbar"
import Login from "./pages/login/login";

function Rotas() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/Employees" element={<Employees />} />
                <Route path="/Login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;