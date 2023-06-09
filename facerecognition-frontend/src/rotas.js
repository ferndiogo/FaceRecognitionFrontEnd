import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Employees from "./pages/employees/employees";
import Login from "./pages/login/login";
import Home from "./pages/home";
import Navbar from "./navbar/Navbar";
import Registries from "./pages/registries/registries";

function Rotas() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                
                <Route path="/" element={<Home />} />
                <Route path="/Employees" element={<Employees />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Registries" element={<Registries />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;