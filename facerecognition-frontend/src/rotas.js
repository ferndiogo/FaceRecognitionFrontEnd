import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Employees from "./pages/employees/employees";
import Home from "./pages/home";
import Navbar from "./navbar/Navbar";

function Rotas() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                
                <Route path="/" element={<Home />} />
                <Route path="/Employees" element={<Employees />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;