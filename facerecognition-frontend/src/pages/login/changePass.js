import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { url, encryptionKey } from '../../config';
import CryptoJS from 'crypto-js';
import { Link } from "react-router-dom";


import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const ChangePass = () => {

    const baseUrl = url + "Auth/changePass";

    const [txtError, setTxtError] = useState('');
    const [updateData, setUpdateData] = useState(true);

    const [modalSucesso, setModalSucesso] = useState(false);
    const [modalLoginInvalido, setModalLoginInvalido] = useState(false)

    const [passSelecionado, setPassSelecionado] = useState('');
    const [dataUsername, setDataUsername] = useState('');
    const [textModalLogin, setTextModalLogin] = useState('');

    const password1 = useRef(null);
    const password2 = useRef(null);

    const handleChange = e => {
        if (password1.current.value === password2.current.value) {
            setTxtError("");
            setPassSelecionado(password1.current.value);
        } else {
            setTxtError("Passwords não coincidem.");
        }
    }

    // Função para descriptografar uma string
    const decryptString = (ciphertext) => {
        const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), encryptionKey);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        return plaintext;
    };

    if (localStorage.getItem('token') != null) {
        axios.defaults.headers.common['Authorization'] = decryptString(localStorage.getItem('token'));
    }

    // Função responsável por enviar a nova password para a API.
    const pedidoPost = async () => {
        const formData = new FormData();
        formData.append("password", passSelecionado)
        axios.post(baseUrl, formData, {
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then(response => {
            setModalSucesso(true);
        }).catch(error => {
            setTxtError(error.response.data);
        })
    }

    // Função para processar erros nas chamadas da API
    const processError = useCallback((error) => {
        if (error.response && (error.response.status === 401)) {
            setModalLoginInvalido(true);
            setTextModalLogin("Tem de iniciar sessão para aceder a esta página!");
        } else if (error.response && (error.response.status === 403)) {
            setModalLoginInvalido(true);
            setTextModalLogin("Para realizar essa ação tem de iniciar sessão com um utilizador com essas permissões.");
        }
    }, []);

    // Função para ir buscar o nome do utilizador
    const pedidoGet = useCallback(async () => {
        await axios.get(url + "Auth/Username")
            .then(response => {
                setDataUsername(response.data);
            }).catch(error => {
                processError(error);
            })
    }, [processError])

    useEffect(() => {
        if (updateData) {
            pedidoGet();
            setUpdateData(false);
        }
    }, [updateData, pedidoGet])

    return (
        <div>
            <div className="login-container">
                <h2 className="titulo-login">Mudar Password</h2>
                <form className="login-form">
                    <label className="lbl">Nome de Utilizador:</label>
                    <input readOnly={true} value={dataUsername} type="text" className="form-control" name="username" />
                    <label className="lbl">Nova Password:</label>
                    <input ref={password1} type="password" className="form-control" name="password1" onChange={handleChange} />
                    <label className="lbl">Confirmar Nova Password:</label>
                    <input ref={password2} type="password" className="form-control" name="password2" onChange={handleChange} />
                    <br />
                    <p className="regularExp">{txtError}</p>
                </form>
                <div className="login-btn">
                    <button className="btn-login" onClick={() => pedidoPost()}>Mudar Password</button>
                </div>
            </div>

            <Modal isOpen={modalSucesso}>
                <ModalBody>Palavra Passe alterada com sucesso!</ModalBody>
                <ModalFooter>
                    <button onClick={() => { localStorage.setItem('token', ''); window.location.reload(false); }} style={{ border: "transparent", backgroundColor: "transparent" }} ><Link to="../login" className="btnDanger">Iniciar Sessão</Link></button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalLoginInvalido}>
                <ModalHeader>Não Autorizado</ModalHeader>
                <ModalBody>{textModalLogin}</ModalBody>
                <ModalFooter>
                    <Link to="../login"><button className="btnDanger">Iniciar Sessão</button></Link>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default ChangePass;