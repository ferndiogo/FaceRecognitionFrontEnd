import React, { useState, useEffect } from 'react';
import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Card, ListGroup } from 'react-bootstrap';


function Employees() {

    const baseUrl = "https://localhost:7136/Employee/";

    const [data, setData] = useState([]);

    const [updateData, setUpdateData] = useState(true);

    const [modalAdicionar, setModalAdicionar] = useState(false);

    const [modalEditar, setModalEditar] = useState(false);

    const [modalApagar, setModalApagar] = useState(false);

    const [modalCriado, setModalCriado] = useState(false);

    const [modalEditado, setModalEditado] = useState(false);

    const [modalApagado, setModalApagado] = useState(false);

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
            image: '',
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
                abrirFecharModalCriado();
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
                        empregado.image = dados.image;
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
        await axios.delete(baseUrl + empregadoSelecionado.id)
            .then(response => {
                setData(data.filter(empregado => empregado.id !== response.data));
                setUpdateData(true);
                abrirFecharModalApagar();
                abrirFecharModalApagado();
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
            <div className="cartoes">
                {data.map(empregado => (
                    <Card key={empregado.id} className="mt-4">
                        <Card.Img variant="top" src={empregado.image} className="card-image" />
                        <Card.Body>
                            <Card.Title>{empregado.name}</Card.Title>
                            <Card.Text>
                                {empregado.email}
                                <button style={{ fontSize: '100px !important' }} className="btn3"><FontAwesomeIcon icon={faPlus} /> Ver mais</button>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}

            </div>

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
                    <button className="btn" onClick={() => pedidoPost()}>Adicionar</button>
                    <button className="btn1" onClick={() => abrirFecharModalAdicionar()}>Cancelar</button>
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
                    <button className="btn" onClick={() => pedidoPut()}>Editar</button>
                    <button className="btn1" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalApagar}>
                <ModalBody>
                    Confirma a eliminação deste funcionário: {empregadoSelecionado && empregadoSelecionado.name} ?
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => pedidoDelete()}>Sim</button>
                    <button className="btn1" onClick={() => abrirFecharModalApagar()}>Não</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalCriado}>
                <ModalHeader>Funcionário Adicionado</ModalHeader>
                <ModalBody>
                    <div>Os dados do funcionário que introduziu foram adicionados com sucesso!</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => abrirFecharModalCriado()}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditado}>
                <ModalHeader>Funcionário Editado</ModalHeader>
                <ModalBody>
                    <div>Os dados do funcionário foram editados com sucesso!</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => abrirFecharModalEditado()}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalApagado}>
                <ModalHeader>Funcionário Apagado</ModalHeader>
                <ModalBody>
                    <div>O funcionário selecionado foi apagado com sucesso!</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => abrirFecharModalApagado()}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>



        </div>
    );
}


export default Employees;