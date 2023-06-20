import React, { useState, useRef } from 'react';
import axios from 'axios';
import './styles.css';
import { url } from '../../config';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

const NewAccount = () => {

    const baseUrl = url+"Auth/register";

    const [txtErrorPassword, setTxtErrorPassword] = useState('');
    const [txtErrorUsername, setTxtErrorUsername] = useState('');

    const [modalSucesso, setModalSucesso] = useState(false);

    const [utilizadorSelecionado, setUtilizadorSelecionado] = useState(
        {
            username: '',
            password: '',
        }
    )

    const pass1 = useRef(null);
    const pass2 = useRef(null);
    const username = useRef(null);

    const handleChangeUsername = e => {
        const { name, value } = e.target;
        setUtilizadorSelecionado({
            ...utilizadorSelecionado, [name]: value
        });
        console.log(utilizadorSelecionado);
    }

    const handleChangePassword = e => {
        if (pass1.current.value === pass2.current.value) {
            setTxtErrorPassword("");
            const { name, value } = e.target;
            setUtilizadorSelecionado({
                ...utilizadorSelecionado, [name]: value
            });
            console.log(utilizadorSelecionado);
        }else{
            setTxtErrorPassword("Passwords não coincidem.");
        }

    }

    const pedidoPost = async () => {
        const formData = new FormData();
        formData.append("username", utilizadorSelecionado.username)
        formData.append("password", utilizadorSelecionado.password)
        axios.post(baseUrl, formData, {
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then(response => {
            setModalSucesso(true);
        }).catch(error => {
            setTxtErrorUsername(error.response.data);
            console.log(error);
        })
    }

    const resetForm = () =>{
        setModalSucesso(false);
        pass1.current.value = '';
        pass2.current.value = '';
        username.current.value = '';
        setTxtErrorPassword('');
        setTxtErrorUsername('');
        window.location.href = '/Accounts';
    }

    return (
        <div>
            <div className="login-container">
                <h2 className="titulo-login">Registar novo utilizador</h2>
                <form className="login-form">
                    <label className="lbl">Username:</label>
                    <input ref={username} type="text" className="form-control" name="username" onChange={handleChangeUsername} />
                    <p className="regularExp">{txtErrorUsername}</p>

                    <label className="lbl">Password:</label>
                    <input ref={pass1} type="password" className="form-control" name="password" onChange={handleChangePassword} />

                    <label className="lbl">Confirmar Password:</label>
                    <input ref={pass2} type="password" className="form-control" name="password" onChange={handleChangePassword} />
                    <p className="regularExp">{txtErrorPassword}</p>
                </form>
                <div className="login-btn">
                    <button className="btn-login" onClick={() => pedidoPost()}>Registar</button>
                </div>
            </div>

            <Modal isOpen={modalSucesso}>
                <ModalBody>Nova conta criada com sucesso!</ModalBody>
                <ModalFooter>
                    <button className="btnOk" onClick={() => {resetForm(); }}>Ok</button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default NewAccount;