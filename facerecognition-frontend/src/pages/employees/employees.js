import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoUsers from './user.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Employees() {

    const baseUrl = "https://localhost:7136/Employee/";

    const [data, setData] = useState([]);

    const [updateData, setUpdateData] = useState(true);

    const [modalAdicionar, setModalAdicionar] = useState(false);

    const [modalEditar, setModalEditar] = useState(false);

    const [modalApagar, setModalApagar] = useState(false);

    const [empregadoSelecionado, setEmpregadoSelecionado] = useState(
        {
            id: '',
            name: '',
            contact: '',
            email: '',
            morada: '',
            pais: '',
            codPostal: '',
            sexo: '',
            dataNasc: '',
            registries: '',
        }
    )

    const selecionarEmpregado = (empregado, opcao) => {
        setEmpregadoSelecionado(empregado);
        (opcao === "Editar") ?
            abrirFecharModalEditar() : abrirFecharModalApagar();
    }

    const abrirFecharModalAdicionar = () => {
        setModalAdicionar(!modalAdicionar);
    }

    const abrirFecharModalEditar = () => {
        setModalEditar(!modalEditar);
    }

    const abrirFecharModalApagar = () => {
        setModalApagar(!modalApagar);
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setEmpregadoSelecionado({
            ...empregadoSelecionado, [name]: value
        });
        console.log(empregadoSelecionado);
    }

    const pedidoGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const pedidoPost = async () => {
        delete empregadoSelecionado.id;
        await axios.post(baseUrl, empregadoSelecionado)
            .then(response => {
                setData(data.concat(response.data));
                setUpdateData(true);
                abrirFecharModalAdicionar();
            }).catch(error => {
                console.log(error);
            })
    }

    const pedidoPut = async () => {
        await axios.put(baseUrl + empregadoSelecionado.id, empregadoSelecionado)
            .then(response => {
                var dados = response.data;
                var dadosAux = data;
                dadosAux.map(empregado => {
                    if (empregado.id === empregadoSelecionado.id) {
                        empregado.name = dados.name;
                        empregado.contact = dados.contact;
                        empregado.email = dados.email;
                        empregado.morada = dados.morada;
                        empregado.pais = dados.pais;
                        empregado.codPostal = dados.codPostal;
                        empregado.sexo = dados.sexo;
                        empregado.dataNasc = dados.dataNasc;
                    }
                });
                setUpdateData(true);
                abrirFecharModalEditar();
            }).catch(error => {
                console.log(error);
            })
    }

    const pedidoDelete = async () => {
        await axios.delete(baseUrl + empregadoSelecionado.id)
            .then(response => {
                setData(data.filter(empregado => empregado.id !== response.data));
                setUpdateData(true);
                abrirFecharModalApagar();
            }).catch(error => {
                console.log(error);
            })
    }

    function extrairData(dateTimeString) {
        const dateObj = new Date(dateTimeString);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }

    //impedir loop pedidoGet
    useEffect(() => {
        if (updateData) {
            pedidoGet();
            setUpdateData(false);
        }
    }, [updateData])

    return (
        <div className="empregados-container">
            <br />
            <Link className="button" to="/">
                <button type="button" className="btn btn-outline-info btn-sm">Voltar</button>
            </Link>
            <br />
            <br />
            <h3>Adição de Funcionários</h3>
            <img src={logoUsers} alt='Empregados' width="50px" />
            <button className="btn btn-success" onClick={() => abrirFecharModalAdicionar()}><FontAwesomeIcon icon={faPlus} /></button>

            <table className="table table-dark table-striped mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Contacto</th>
                        <th>Email</th>
                        <th>Morada</th>
                        <th>País</th>
                        <th>Código Postal</th>
                        <th>Sexo</th>
                        <th>Data de Nascimento</th>
                        <th>Operação</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(empregado => (
                        <tr key={empregado.id}>
                            <td>{empregado.name}</td>
                            <td>{empregado.contact}</td>
                            <td>{empregado.email}</td>
                            <td>{empregado.morada}</td>
                            <td>{empregado.pais}</td>
                            <td>{empregado.codPostal}</td>
                            <td>{empregado.sexo}</td>
                            <td>{extrairData(empregado.dataNasc)}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => selecionarEmpregado(empregado, "Editar")}><FontAwesomeIcon icon={faEdit} /></button> {"   "}
                                <button className="btn btn-danger" onClick={() => selecionarEmpregado(empregado, "Apagar")}><FontAwesomeIcon icon={faTrash} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={modalAdicionar}>
                <ModalHeader>Adicionar Funcionário</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Nome:</label>
                        <br />
                        <input type="text" className="form-control" name="name" onChange={handleChange} />
                        <br />
                        <label>Contacto:</label>
                        <br />
                        <input type="text" className="form-control" name="contact" onChange={handleChange} />
                        <br />
                        <label>Email:</label>
                        <br />
                        <input type="text" className="form-control" name="email" onChange={handleChange} />
                        <br />
                        <label>Morada:</label>
                        <br />
                        <input type="text" className="form-control" name="morada" onChange={handleChange} />
                        <br />
                        <label>País:</label>
                        <br />
                        <input type="text" className="form-control" name="pais" onChange={handleChange} />
                        <br />
                        <label>Código Postal:</label>
                        <br />
                        <input type="text" className="form-control" name="codPostal" onChange={handleChange} />
                        <br />
                        <label>Sexo:</label>
                        <br />
                        <input type="text" className="form-control" name="sexo" onChange={handleChange} />
                        <br />
                        <label>Data de Nascimento:</label>
                        <br />
                        <input type="date" className="form-control" name="dataNasc" onChange={handleChange} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={() => pedidoPost()}>Adicionar</button>
                    <button className="btn btn-danger" onClick={() => abrirFecharModalAdicionar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditar}>
                <ModalHeader>Editar Funcionário</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Nome:</label>
                        <br />
                        <input type="text" className="form-control" name="name" onChange={handleChange}
                            value={empregadoSelecionado && empregadoSelecionado.name} />
                        <br />
                        <label>Contacto:</label>
                        <br />
                        <input type="text" className="form-control" name="contact" onChange={handleChange}
                            value={empregadoSelecionado && empregadoSelecionado.contact} />
                        <br />
                        <label>Email:</label>
                        <br />
                        <input type="text" className="form-control" name="email" onChange={handleChange}
                            value={empregadoSelecionado && empregadoSelecionado.email} />
                        <br />
                        <label>Morada:</label>
                        <br />
                        <input type="text" className="form-control" name="morada" onChange={handleChange}
                            value={empregadoSelecionado && empregadoSelecionado.morada} />
                        <br />
                        <label>País:</label>
                        <br />
                        <input type="text" className="form-control" name="pais" onChange={handleChange}
                            value={empregadoSelecionado && empregadoSelecionado.pais} />
                        <br />
                        <label>Código Postal:</label>
                        <br />
                        <input type="text" className="form-control" name="codPostal" onChange={handleChange}
                            value={empregadoSelecionado && empregadoSelecionado.codPostal} />
                        <br />
                        <label>Sexo:</label>
                        <br />
                        <input type="text" className="form-control" name="sexo" onChange={handleChange}
                            value={empregadoSelecionado && empregadoSelecionado.sexo} />
                        <br />
                        <label>Data de Nascimento:</label>
                        <br />
                        <input type="date" className="form-control" name="dataNasc" onChange={handleChange}
                            value={empregadoSelecionado && empregadoSelecionado.dataNasc} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={() => pedidoPut()}>Editar</button>
                    <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalApagar}>
                <ModalBody>
                    Confirma a eliminação deste funcionário: {empregadoSelecionado && empregadoSelecionado.name} ?
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-danger" onClick={() => pedidoDelete()}>Sim</button>
                    <button className="btn btn-secondary" onClick={() => abrirFecharModalApagar()}>Não</button>
                </ModalFooter>
            </Modal>



        </div>
    );
}


export default Employees;