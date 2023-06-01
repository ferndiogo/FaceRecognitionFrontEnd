import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Employees from "./pages/employees/employees";

function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Employees/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;