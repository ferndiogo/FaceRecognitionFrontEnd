import React, { useState, useEffect } from 'react';
import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

import Select from 'react-select';
import Cards from './cards';

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

    const [modalDetalhes, setModalDetalhes] = useState(false);

    const [searchText, setSearchText] = useState('');

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

    const sexoopc = [
        { value: 'M', label: 'Masculino', name: 'sexo' },
        { value: 'F', label: 'Feminino', name: 'sexo' }
    ];

    const selecionarEmpregado = (empregado, opcao) => {
        setEmpregadoSelecionado(empregado);
        if (opcao === "Editar") abrirFecharModalEditar();
        else if (opcao === "Apagar") abrirFecharModalApagar();
        else abrirFecharModalDetalhes();
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

    const abrirFecharModalDetalhes = () => {
        setModalDetalhes(!modalDetalhes);
    }

    const atualizar = () => {
        window.location.reload(false);
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setEmpregadoSelecionado({
            ...empregadoSelecionado, [name]: value
        });
        console.log(empregadoSelecionado);
    }

    const handleChangeSearch = e => {
        setSearchText(e.target.value);
    }

    const handleChangeSelect = e => {
        const { name, value } = e;
        setEmpregadoSelecionado({
            ...empregadoSelecionado, [name]: value
        });
        console.log(empregadoSelecionado);
    }

    const handleImagemChange = (e) => {
        setEmpregadoSelecionado({
            ...empregadoSelecionado, image: e.target.files[0]
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
        const formData = new FormData();
        formData.append("name", empregadoSelecionado.name)
        formData.append("contact", empregadoSelecionado.contact)
        formData.append("email", empregadoSelecionado.email)
        formData.append("morada", empregadoSelecionado.morada)
        formData.append("pais", empregadoSelecionado.pais)
        formData.append("codPostal", empregadoSelecionado.codPostal)
        formData.append("sexo", empregadoSelecionado.sexo)
        formData.append("dataNasc", empregadoSelecionado.dataNasc)
        formData.append("image", empregadoSelecionado.image)
        axios.post(baseUrl, formData)
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
        const formData = new FormData();
        formData.append('name', empregadoSelecionado.name);
        formData.append('contact', empregadoSelecionado.contact);
        formData.append('email', empregadoSelecionado.email);
        formData.append('morada', empregadoSelecionado.morada);
        formData.append('pais', empregadoSelecionado.pais);
        formData.append('codPostal', empregadoSelecionado.codPostal);
        formData.append('sexo', empregadoSelecionado.sexo);
        formData.append('dataNasc', empregadoSelecionado.dataNasc);
        formData.append('image', empregadoSelecionado.image);

        await axios.put(baseUrl + empregadoSelecionado.id, formData)
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
                    return empregado;
                });
                setUpdateData(true);
                abrirFecharModalEditar();
                abrirFecharModalEditado();
            })
            .catch(error => {
                console.log(error);
            });
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
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');

        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }

    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
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
                <form className="direita">
                    <input id="search" className="pesquisa" type="search" placeholder="Pesquisar" name="pesquisa" aria-label="Pesquisar" onChange={handleChangeSearch} />
                    <button className="btn" type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                </form>
            </div>
            <div id="cards" className="cartoes">
                <Cards empregados={data} search={searchText} selecionarEmpregado={selecionarEmpregado} />
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
                        <Select options={sexoopc} onChange={handleChangeSelect} placeholder="Selecione uma opção" />
                        <br />
                        <label>Data de Nascimento:</label>
                        <br />
                        <input type="date" className="form-control" name="dataNasc" onChange={handleChange} />
                        <br />
                        <label>Imagem:</label>
                        <br />
                        <input type="file" className="form-control" name="image" accept=".jpg,.png,.jpeg" onChange={handleImagemChange} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btnOk" onClick={() => pedidoPost()}>Adicionar</button>
                    <button className="btnDanger" onClick={() => abrirFecharModalAdicionar()}>Cancelar</button>
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
                        <Select options={sexoopc} onChange={handleChangeSelect} placeholder={empregadoSelecionado && empregadoSelecionado.sexo === 'M'
                            ? 'Masculino'
                            : empregadoSelecionado && empregadoSelecionado.sexo === 'F'
                                ? 'Feminino'
                                : ''} />
                        <br />
                        <label>Data de Nascimento:</label>
                        <br />
                        <input type="date" className="form-control" name="dataNasc" onChange={handleChange}
                            value={empregadoSelecionado && formatDate(empregadoSelecionado.dataNasc)} />
                        <label>Imagem:</label>
                        <br />
                        <input type="file" className="form-control" name="image" accept=".jpg,.png,.jpeg" onChange={handleImagemChange} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btnOk" onClick={() => pedidoPut()}>Editar</button>
                    <button className="btnDanger" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalApagar}>
                <ModalBody>
                    Confirma a eliminação deste funcionário: {empregadoSelecionado && empregadoSelecionado.name} ?
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => pedidoDelete()}>Sim</button>
                    <button className="btnDanger" onClick={() => abrirFecharModalApagar()}>Não</button>
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
                    <button className="btn" onClick={() => { abrirFecharModalEditado(); atualizar() }}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalApagado}>
                <ModalHeader>Funcionário Apagado</ModalHeader>
                <ModalBody>
                    <div>O funcionário selecionado foi apagado com sucesso!</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => { abrirFecharModalApagado(); atualizar() }}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalDetalhes}>
                <ModalHeader>Detalhes do Funcionário</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Nome:</label>
                        <br />
                        <input type="text" className="form-control-plaintext" name="name" onChange={handleChange}
                            readOnly={true} value={empregadoSelecionado && empregadoSelecionado.name} />
                        <br />
                        <label>Contacto:</label>
                        <br />
                        <input type="text" className="form-control-plaintext" name="contact" onChange={handleChange}
                            readOnly={true} value={empregadoSelecionado && empregadoSelecionado.contact} />
                        <br />
                        <label>Email:</label>
                        <br />
                        <input type="text" className="form-control-plaintext" name="email" onChange={handleChange}
                            readOnly={true} value={empregadoSelecionado && empregadoSelecionado.email} />
                        <br />
                        <label>Morada:</label>
                        <br />
                        <input type="text" className="form-control-plaintext" name="morada" onChange={handleChange}
                            readOnly={true} value={empregadoSelecionado && empregadoSelecionado.morada} />
                        <br />
                        <label>País:</label>
                        <br />
                        <input type="text" className="form-control-plaintext" name="pais" onChange={handleChange}
                            readOnly={true} value={empregadoSelecionado && empregadoSelecionado.pais} />
                        <br />
                        <label>Código Postal:</label>
                        <br />
                        <input type="text" className="form-control-plaintext" name="codPostal" onChange={handleChange}
                            readOnly={true} value={empregadoSelecionado && empregadoSelecionado.codPostal} />
                        <br />
                        <label>Sexo:</label>
                        <br />
                        <input type="text" className="form-control-plaintext" name="sexo" onChange={handleChange}
                            readOnly={true} value={empregadoSelecionado && empregadoSelecionado.sexo === 'M'
                                ? 'Masculino'
                                : empregadoSelecionado && empregadoSelecionado.sexo === 'F'
                                    ? 'Feminino'
                                    : ''} />
                        <br />
                        <label>Data de Nascimento:</label>
                        <br />
                        <input type="text" className="form-control-plaintext" name="dataNasc" onChange={handleChange}
                            readOnly={true} value={empregadoSelecionado && extrairData(empregadoSelecionado.dataNasc)} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btnInfo" onClick={() => { abrirFecharModalEditar(); abrirFecharModalDetalhes(); }}>Editar</button>
                    <button className="btnDanger" onClick={() => { abrirFecharModalApagar(); abrirFecharModalDetalhes(); }}>Apagar</button>
                    <button className="btnOk" onClick={() => abrirFecharModalDetalhes()}>Cancelar</button>
                </ModalFooter>
            </Modal>

        </div>
    );
}


export default Employees;