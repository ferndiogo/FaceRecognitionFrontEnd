import React, { useState, useEffect } from 'react';
import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faCheck, faMagnifyingGlass, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

function Registries() {

    const baseUrl = "https://localhost:7136/Registry/";
    const baseUrl1 = "https://localhost:7136/Employee/";

    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);

    const [updateData, setUpdateData] = useState(true);
    const [updateData1, setUpdateData1] = useState(true);

    const [modalAdicionar, setModalAdicionar] = useState(false);

    const [modalEditar, setModalEditar] = useState(false);

    const [modalApagar, setModalApagar] = useState(false);

    const [modalCriado, setModalCriado] = useState(false);

    const [modalEditado, setModalEditado] = useState(false);

    const [modalApagado, setModalApagado] = useState(false);

    const [registoSelecionado, setRegistoSelecionado] = useState(
        {
            id: '',
            dateTime: '',
            type: '',
            employeeId: '',
            employee: '',
        }
    )

    const selecionarRegisto = (registo, opcao) => {
        setRegistoSelecionado(registo);
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

    const abrirFecharModalCriado = () => {
        setModalCriado(!modalCriado);
    }

    const abrirFecharModalEditado = () => {
        setModalEditado(!modalEditado);
    }

    const abrirFecharModalApagado = () => {
        setModalApagado(!modalApagado);
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setRegistoSelecionado({
            ...registoSelecionado, [name]: value
        });
        console.log(registoSelecionado);
    }

    const pedidoGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const pedidoGet1 = async () => {
        await axios.get(baseUrl1)
            .then(response => {
                setData1(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const pedidoPost = async () => {
        delete registoSelecionado.id;
        await axios.post(baseUrl, registoSelecionado)
            .then(response => {
                setData(data.concat(response.data));
                setUpdateData(true);
                abrirFecharModalAdicionar();
                abrirFecharModalCriado();
            }).catch(error => {
                console.log(error);
            })
    }

    const pedidoPut = async () => {
        await axios.put(baseUrl + registoSelecionado.id, registoSelecionado)
            .then(response => {
                var dados = response.data;
                var dadosAux = data;
                dadosAux.map(registo => {
                    if (registo.id === registoSelecionado.id) {
                        registo.datetime = dados.dateTime;
                        registo.type = dados.type;
                        registo.employeeId = dados.employeeId;
                        registo.employee = dados.employeeId;
                    }
                });
                setUpdateData(true);
                abrirFecharModalEditar();
                abrirFecharModalEditado();
            }).catch(error => {
                console.log(error);
            })
    }

    const pedidoDelete = async () => {
        await axios.delete(baseUrl + registoSelecionado.id)
            .then(response => {
                setData(data.filter(registo => registo.id !== response.data));
                setUpdateData(true);
                abrirFecharModalApagar();
                abrirFecharModalApagado();
            }).catch(error => {
                console.log(error);
            })
    }

    function extrairDataHora(dateTimeString) {
        const dateObj = new Date(dateTimeString);
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');

        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }

    function getTipo(registo) {
        return registo.type === 'E' ? 'Entrada' : 'Saída';
    }

    //impedir loop pedidoGet
    useEffect(() => {
        if (updateData) {
            pedidoGet();
            setUpdateData(false);
        }
    }, [updateData])

    //impedir loop pedidoGet
    useEffect(() => {
        if (updateData1) {
            pedidoGet1();
            setUpdateData1(false);
        }
    }, [updateData1])

    return (
        <div className="empregados-container">
            <h2 className="titulo">Funcionários</h2>
            <div className="barra">
                <div className="esquerda">
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: "30px", color: "#ffffff", }} />
                    <h5 className="addfunc">Adicionar Funcionário</h5>
                    <button className="btn" onClick={() => abrirFecharModalAdicionar()}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
                <div className="direita">
                    <input className="pesquisa" type="search" placeholder="Pesquisar" aria-label="Pesquisar" />
                    <button className="btn" type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                </div></div>

            <table className="table table-dark table-striped mt-4">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Data e Hora</th>
                        <th>Entrada/Saída</th>
                        <th>ID Empregado</th>
                        <th>Empregado</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(registo => (
                        <tr key={registo.id}>
                            <td>{registo.id}</td>
                            <td>{extrairDataHora(registo.dateTime)}</td>
                            <td>{getTipo(registo)}</td>
                            <td>{registo.employeeId}</td>
                            <td>{registo.employee.name}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => selecionarRegisto(registo, "Editar")}><FontAwesomeIcon icon={faEdit} /></button> {"   "}
                                <button className="btn btn-danger" onClick={() => selecionarRegisto(registo, "Apagar")}><FontAwesomeIcon icon={faTrash} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={modalAdicionar}>
                <ModalHeader>Adicionar Registo</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Data e Hora:</label>
                        <br />
                        <input type="datetime" className="form-control" name="name" onChange={handleChange} />
                        <br />
                        <label>Entrada/Saída:</label>
                        <br />
                        <input type="text" className="form-control" name="contact" onChange={handleChange} />
                        <br />
                        <label>ID Empregado:</label>
                        <br />
                        <input type="text" className="form-control" name="email" onChange={handleChange} />
                        <br />
                        <label>Empregado:</label>
                        <br />
                        <input type="text" className="form-control" name="morada" onChange={handleChange} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => pedidoPost()}>Adicionar</button>
                    <button className="btn1" onClick={() => abrirFecharModalAdicionar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditar}>
                <ModalHeader>Editar Registo</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Data e Hora:</label>
                        <br />
                        <input type="date" className="form-control" name="dateTime" onChange={handleChange}
                            value={registoSelecionado && registoSelecionado.dateTime} />
                        <br />
                        <label>Entrada/Saída:</label>
                        <br />
                        <input type="text" className="form-control" name="type" onChange={handleChange}
                            value={registoSelecionado && registoSelecionado.type} />
                        <br />
                        <label>ID Empregado:</label>
                        <br />
                        <input type="number" className="form-control" name="employeeId" onChange={handleChange}
                            value={registoSelecionado && registoSelecionado.employeeId} />
                        <br />
                        <label>Empregado:</label>
                        <br />
                        <input type="text" className="form-control" name="employee" onChange={handleChange}
                            value={registoSelecionado && registoSelecionado.employee} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => pedidoPut()}>Editar</button>
                    <button className="btn1" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalApagar}>
                <ModalBody>
                    Confirma a eliminação deste registo: {registoSelecionado && registoSelecionado.id} ?
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => pedidoDelete()}>Sim</button>
                    <button className="btn1" onClick={() => abrirFecharModalApagar()}>Não</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalCriado}>
                <ModalHeader>Registo Adicionado</ModalHeader>
                <ModalBody>
                    <div>Os dados do funcionário que introduziu foram adicionados com sucesso!</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => abrirFecharModalCriado()}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditado}>
                <ModalHeader>Registo Editado</ModalHeader>
                <ModalBody>
                    <div>Os dados do funcionário foram editados com sucesso!</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => abrirFecharModalEditado()}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalApagado}>
                <ModalHeader>Registo Apagado</ModalHeader>
                <ModalBody>
                    <div>O registo selecionado foi apagado com sucesso!</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => abrirFecharModalApagado()}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>



        </div>
    );
}


export default Registries;