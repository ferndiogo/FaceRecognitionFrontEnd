import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';
import { url, encryptionKey } from '../../config';
import CryptoJS from 'crypto-js';

import { Modal, ModalBody, ModalFooter } from 'reactstrap';

const Login = () => {

    const baseUrl = url + "Auth/login";

    const [txtErrorPassword, setTxtErrorPassword] = useState('');
    const [txtErrorUsername, setTxtErrorUsername] = useState('');

    const [modalLoginSucesso, setModalLoginSucesso] = useState(false);

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
    }

    // Função para criptografar uma string
    const encryptString = (plaintext) => {
        const ciphertext = CryptoJS.AES.encrypt(plaintext, encryptionKey).toString();
        return ciphertext;
    };

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
            // Armazenar o token no local storage
            localStorage.setItem('token', encryptString('Bearer ' + response.data));
            setModalLoginSucesso(true);
        }).catch(error => {
            if (error.response.data === "Utilizador não encontrado.") {
                setTxtErrorUsername(error.response.data);
                setTxtErrorPassword('');
            } else {
                setTxtErrorPassword(error.response.data);
                setTxtErrorUsername('');
            }
        })
    }

    return (
        <div>
            <div className="login-container">
                <h2 className="titulo-login">Iniciar Sessão</h2>
                <form className="login-form">
                    <label className="lbl">Username:</label>
                    <input type="text" className="form-control" name="username" onChange={handleChange} />
                    <p className="regularExp">{txtErrorUsername}</p>
                    <label className="lbl">Password:</label>
                    <input type="password" className="form-control" name="password" onChange={handleChange} />
                    <p className="regularExp">{txtErrorPassword}</p>
                </form>
                <div className="login-btn">
                    <button className="btn-login" onClick={() => pedidoPost()}>Login</button>
                </div>
            </div>

            <Modal isOpen={modalLoginSucesso}>
                <ModalBody>Sessão iniciada com sucesso!</ModalBody>
                <ModalFooter>
                    <button className="btnInfo" onClick={() => { window.location.href = '/'; }}>Página Inicial</button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Login;