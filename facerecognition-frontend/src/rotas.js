import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Employees from "./pages/employees/employees";
import Login from "./pages/login/login";
import Home from "./pages/home";
import Navbar from "./navbar/Navbar";
import Registries from "./pages/registries/registries";
import About from "./pages/about/about";


function Rotas() {
    return (
        <HashRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Employees" element={<Employees />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Registries/:id" element={<Registries />} />
                <Route path="/About" element={<About />} />
            </Routes>
        </HashRouter>
    );
}

export default Rotas;