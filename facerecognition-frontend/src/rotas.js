import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Employees from "./pages/employees/employees";
import Login from "./pages/login/login";
import Home from "./pages/home";
import Navbar from "./navbar/Navbar";
import About from "./pages/about/about";

function Rotas() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                
                <Route path="/" element={<Home />} />
                <Route path="/Employees" element={<Employees />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/About" element={<About />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;