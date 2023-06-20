import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';
import { url } from '../../config';

const Login = () => {

    const baseUrl = url + "Auth/login";

    const [data, setData] = useState([]);

    const [utilizadorSelecionado, setUtilizadorSelecionado] = useState(
        {
            username: '',
            password: '',
        }
    )

    const handleChange = e => {
        const { name, value } = e.target;
        setUtilizadorSelecionado({
            ...utilizadorSelecionado, [name]: value
        });
        console.log(utilizadorSelecionado);
    }

    const pedidoPost = async () => {
        delete utilizadorSelecionado.id;
        const formData = new FormData();
        formData.append("username", utilizadorSelecionado.username)
        formData.append("password", utilizadorSelecionado.password)
        axios.post(baseUrl, formData, {
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then(response => {
            setData(data.concat(response.data));
            // Armazenar o token no local storage
            localStorage.setItem('token', 'Bearer ' + response.data);
        }).catch(error => {
            console.log(error);
        })
    }
    return (
        <div className="login-container">
            <h2 className="titulo-login">Iniciar Sessão</h2>
            <form className="login-form">
                <label className="lbl">Username:</label>
                <input type="text" className="form-control" name="username" onChange={handleChange} />
                <label className="lbl">Password:</label>
                <input type="password" className="form-control" name="password" onChange={handleChange} />
            </form>
            <div className="login-btn">
                <button className="btn-login" onClick={() => pedidoPost()}>Login</button>
            </div>
        </div>
    );
};

export default Login;