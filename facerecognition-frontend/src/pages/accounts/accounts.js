import React, { useState, useEffect, useCallback } from 'react';
import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';

import TableAccount from './tableAccount';
import CryptoJS from 'crypto-js';
import { url, encryptionKey } from '../../config';

const Accounts = () => {

    const baseUrl = url + 'Auth';

    // Função para descriptografar uma string
    const decryptString = (ciphertext) => {
        const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        return plaintext;
    };

    if (localStorage.getItem('token') != null) {
        axios.defaults.headers.common['Authorization'] = decryptString(localStorage.getItem('token'));
    }

    const [data, setData] = useState([]);

    const [modalEditar, setModalEditar] = useState(false);
    const [modalApagar, setModalApagar] = useState(false);
    const [modalEditado, setModalEditado] = useState(false);
    const [modalApagado, setModalApagado] = useState(false);
    const [modalLoginInvalido, setModalLoginInvalido] = useState(false)

    const [updateData, setUpdateData] = useState(true);

    const [searchText, setSearchText] = useState('');
    const [textModalLogin, setTextModalLogin] = useState('');

    const [userSelecionado, setUserSelecionado] = useState({
        id: '',
        username: '',
        tokenCreated: '',
        role: ''
    })

    const roles = [
        { value: 'Admin', label: 'Admin', name: 'role' },
        { value: 'User', label: 'User', name: 'role' }
    ];

    const selecionarUser = (user, opcao) => {
        setUserSelecionado(user);
        (opcao === "Editar") ?
            setModalEditar(true) : setModalApagar(true);
    }

    const handleChangeSearch = e => {
        setSearchText(e.target.value);
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setUserSelecionado({
            ...userSelecionado, [name]: value
        });
        console.log(userSelecionado);
    }

    const handleChangeSelect = e => {
        const { name, value } = e;
        setUserSelecionado({
            ...userSelecionado, [name]: value
        });
        console.log(userSelecionado);
    }

    const processError = useCallback((error) => {
        if (error.response && (error.response.status === 401)) {
            setModalLoginInvalido(true);
            setTextModalLogin("Tem de iniciar sessão para aceder a esta página");
        } else if (error.response && (error.response.status === 403)) {
            setModalLoginInvalido(true);
            setTextModalLogin("Para realizar essa ação têm de iniciar sessão com um utilizador com essas permissôes");
        }
        console.log(error);
    }, []);

    const pedidoGet = useCallback(async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                processError(error);
            })
    }, [processError, baseUrl])

    const pedidoPut = async () => {
        const formData = new FormData();
        console.log(userSelecionado)
        formData.append('username', userSelecionado.username);
        formData.append('role', userSelecionado.role);
        formData.append('id', userSelecionado.id);
        await axios.put(baseUrl + '/edit/' + userSelecionado.id, formData)
            .then(response => {
                setUpdateData(true);
                setModalEditar(false);
                setModalEditado(true);
            }).catch(error => {
                processError(error);
            })
    }

    const pedidoDelete = async () => {
        await axios.delete(baseUrl + '/delete/' + userSelecionado.id)
            .then(response => {
                setUpdateData(true);
                setModalApagar(false);
                setModalApagado(true);
            }).catch(error => {
                processError(error);
            })
    }

    useEffect(() => {
        if (updateData) {
            pedidoGet();
            setUpdateData(false);
        }
    }, [updateData, pedidoGet])

    return (
        <div className="empregados-container">
            <h2 className="titulo">Utilizadores</h2>
            <div className="barra">
                <div className="esquerda">
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: "30px", color: "#ffffff", }} />
                    <h5 className="addfunc">Adicionar Utilizador</h5>
                    <Link to='/NewAccount'>
                        <button className="btn">
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </Link>
                </div>
                <div className="direita">
                    <input className="pesquisa" type="text" placeholder="Pesquisar" name="pesquisa" aria-label="Pesquisar" onChange={handleChangeSearch} />
                    <button className="btn" type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                </div>
            </div>
            <table className="table table-dark table-striped mt-4">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Último token criado</th>
                        <th>Role</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <TableAccount selecionarUser={selecionarUser} users={data} search={searchText} />
                </tbody>
            </table>

            <Modal isOpen={modalLoginInvalido}>
                <ModalHeader>Não Autorizado</ModalHeader>
                <ModalBody>{textModalLogin}</ModalBody>
                <ModalFooter>
                    <Link to="login"><button className="btnDanger">Iniciar Sessão</button></Link>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditar}>
                <ModalHeader>Editar Registo</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Username:</label>
                        <br />
                        <input readOnly={true} type="text" className="form-control" name="username" onChange={handleChange}
                            value={userSelecionado && userSelecionado.username} />
                        <br />
                        <label>Role:</label>
                        <br />
                        <Select
                            options={roles}
                            onChange={handleChangeSelect}
                            placeholder="Selecione uma opção"
                            defaultValue={userSelecionado.role === 'Admin' ? roles[0] : roles[1]}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btnOk" onClick={() => pedidoPut()}>Editar</button>
                    <button className="btnDanger" onClick={() => setModalEditar(false)}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalApagar}>
                <ModalBody>
                    Confirma a eliminação deste utilizador com username:<b>{userSelecionado.username}</b> ?
                </ModalBody>
                <ModalFooter>
                    <button className="btnOk" onClick={() => pedidoDelete()}>Sim</button>
                    <button className="btnDanger" onClick={() => setModalApagar(false)}>Não</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditado}>
                <ModalHeader>Registo Editado</ModalHeader>
                <ModalBody>
                    <div>O registo foi modificado com sucesso!</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btnOk" onClick={() => setModalEditado(false)}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalApagado}>
                <ModalHeader>Registo Apagado</ModalHeader>
                <ModalBody>
                    <div>O registo selecionado foi apagado com sucesso!</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btnOk" onClick={() => setModalApagado(false)}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default Accounts;