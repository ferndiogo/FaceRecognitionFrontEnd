import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

import Select from 'react-select';
import Cards from './cards';

import moment from 'moment';

import { url } from '../../config';

function Employees() {

    const baseUrl = url + "Employee/";

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

    const [isValidName, setIsValidName] = useState(true);
    const [isBlankName, setIsBlankName] = useState(true);

    const [isValidContact, setIsValidContact] = useState(true);
    const [isBlankContact, setIsBlankContact] = useState(true);

    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isBlankEmail, setIsBlankEmail] = useState(true);

    const [isBlankMorada, setIsBlankMorada] = useState(true);

    const [isBlankPais, setIsBlankPais] = useState(true);

    const [isValidCodPostal, setIsValidCodPostal] = useState(true);
    const [isBlankCodPostal, setIsBlankCodPostal] = useState(true);

    const [isBlankSexo, setIsBlankSexo] = useState(true);

    const [isValidData, setIsValidData] = useState(true);
    const [isBlankData, setIsBlankData] = useState(true);

    const [isValidImage, setIsValidImage] = useState(true);
    const [isBlankImage, setIsBlankImage] = useState(true);

    const selectSexo = useRef();

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

    const handleChangeName = (event) => {
        handleChange(event);
        const value = event.target.value;
        const isBlankInput = value.trim() === '';
        const regex = /^.{0,32}$/; // Regex para limitar o campo em 32 caracteres e não ser vazio
        const isValidInput = regex.test(value);

        setIsValidName(isBlankInput || isValidInput);
        setIsBlankName(isBlankInput);
    };

    const handleChangeContact = (event) => {
        handleChange(event);
        const value = event.target.value;
        const isBlankInput = value.trim() === '';
        // Verificar se o valor do campo de entrada corresponde à expressão regular
        const regex = /^[2798]\d{8}$/; // Regex para validar o número de telefone
        const isValidInput = regex.test(value);

        setIsValidContact(isBlankInput || isValidInput);
        setIsBlankContact(isBlankInput);
    };

    const handleChangeEmail = (event) => {
        handleChange(event);
        const value = event.target.value;
        const isBlankInput = value.trim() === '';
        // Verificar se o valor do campo de e-mail corresponde à expressão regular
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; // Regex para validar e-mail
        const isValidInput = regex.test(value);

        setIsValidEmail(isBlankInput || isValidInput);
        setIsBlankEmail(isBlankInput);
    };

    const handleChangeMorada = (event) => {
        handleChange(event);
        const value = event.target.value;
        const isBlankInput = value.trim() === '';

        setIsBlankMorada(isBlankInput);
    };

    const handleChangePais = (event) => {
        handleChange(event);
        const value = event.target.value;
        const isBlankInput = value.trim() === '';

        setIsBlankPais(isBlankInput);
    };

    const handleChangeCodPostal = (event) => {
        handleChange(event);
        const value = event.target.value;
        const isBlankInput = value.trim() === '';

        // Verificar se o valor do campo de código postal corresponde à expressão regular
        const regex = /^\d{4}-\d{3}$/; // Regex para validar código postal
        const isValidInput = regex.test(value);

        setIsValidCodPostal(isBlankInput || isValidInput);
        setIsBlankCodPostal(isBlankInput);
    };

    const handleChangeData = (event) => {
        handleChange(event);
        const value = event.target.value;
        const isBlankInput = value.trim() === '';

        const dateToCheck = event.target.value;
        const formattedDate = moment(dateToCheck, 'DD/MM/YYYY').format('YYYY/MM/DD');
        const isValidInput = moment(formattedDate).isValid();

        setIsValidData(isBlankInput || isValidInput);
        setIsBlankData(isBlankInput);
    };


    const handleChangeSearch = e => {
        setSearchText(e.target.value);
    }

    const handleChangeSelect = e => {
        const { name, value } = e;
        setEmpregadoSelecionado({
            ...empregadoSelecionado, [name]: value
        });
        console.log(empregadoSelecionado);
        // Verificar se o valor selecionado está vazio
        const isBlankInput = value.trim() === '';
        setIsBlankSexo(isBlankInput);


    }

    const handleImagemChange = (event) => {
        setEmpregadoSelecionado({
            ...empregadoSelecionado, image: event.target.files[0]
        });
        const file = event.target.files[0];
        const isBlankInput = !file;

        if (!isBlankInput) {
            const fileExtension = file.type.split('/').pop();
            const allowedExtensions = ['png', 'jpeg', 'jpg'];

            setIsValidImage(allowedExtensions.includes(fileExtension));
            setIsBlankImage(false);
        } else {
            setIsValidImage(false);
            setIsBlankImage(true);
        }
    };

    const resetBooleans = () => {
        setIsBlankName(true);
        setIsBlankContact(true);
        setIsBlankEmail(true);
        setIsBlankMorada(true);
        setIsBlankPais(true);
        setIsBlankCodPostal(true);
        setIsBlankSexo(true);
        setIsBlankData(true);
        setIsBlankImage(true);
    }

    const resetBooleansEdit = () => {
        setIsBlankName(false);
        setIsBlankContact(false);
        setIsBlankEmail(false);
        setIsBlankMorada(false);
        setIsBlankPais(false);
        setIsBlankCodPostal(false);
        setIsBlankSexo(false);
        setIsBlankData(false);
        setIsBlankImage(false);
    }


    const pedidoGet = useCallback(async () => {
        await axios.get(baseUrl)
          .then(response => {
            setData(response.data);
          })
          .catch(error => {
            console.log(error);
          });
      }, [baseUrl, setData]);

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


    const extrairData = (dateTimeString) => {

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
      }, [updateData, pedidoGet]);

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
                        <label>Nome:</label>{isBlankName && <span className="regularExp"> *</span>}
                        <br />
                        <input type="text" className="form-control" name="name" onChange={handleChangeName} />
                        {!isValidName && <span className="regularExp">O nome não é válido, tem de conter no máximo 32 caracters.</span>}
                        <br />
                        <label>Contacto:</label>{isBlankContact && <span className="regularExp"> *</span>}
                        <br />
                        <input type="text" className="form-control" name="contact" onChange={handleChangeContact} />
                        {!isValidContact && <span className="regularExp">Insira um número de telemóvel válido.</span>}
                        <br />
                        <label>Email:</label>{isBlankEmail && <span className="regularExp"> *</span>}
                        <br />
                        <input type="text" className="form-control" name="email" onChange={handleChangeEmail} />
                        {!isValidEmail && <span className="regularExp">Insira um email válido.</span>}
                        <br />
                        <label>Morada:</label>{isBlankMorada && <span className="regularExp"> *</span>}
                        <br />
                        <input type="text" className="form-control" name="morada" onChange={handleChangeMorada} />
                        <br />
                        <label>País:</label>{isBlankPais && <span className="regularExp"> *</span>}
                        <br />
                        <input type="text" className="form-control" name="pais" onChange={handleChangePais} />
                        <br />
                        <label>Código Postal:</label>{isBlankCodPostal && <span className="regularExp"> *</span>}
                        <br />
                        <input type="text" className="form-control" name="codPostal" onChange={handleChangeCodPostal} />
                        {!isValidCodPostal && <span className="regularExp">Insira um código de postal válido.</span>}
                        <br />
                        <label>Sexo:</label>{isBlankSexo && <span className="regularExp"> *</span>}
                        <br />
                        <Select ref={selectSexo} options={sexoopc} onChange={handleChangeSelect} placeholder="Selecione uma opção" />
                        <br />
                        <label>Data de Nascimento:</label>{isBlankData && <span className="regularExp"> *</span>}
                        <br />
                        <input type="text" className="form-control" name="dataNasc" onChange={handleChangeData} />
                        {!isValidData && <span className="regularExp">Insira uma data válida.</span>}
                        <br />
                        <label>Imagem:</label>{isBlankImage && <span className="regularExp"> *</span>}
                        <br />
                        <input type="file" className="form-control" name="image" accept=".jpg,.png,.jpeg" onChange={handleImagemChange} required />
                        {!isValidImage && <span className="regularExp">Formato inválido.</span>}
                        <br />
                        <span className="regularExp">* Campos de preenchimento obrigatório</span>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {isValidName &&
                        isValidContact &&
                        isValidEmail &&
                        isValidCodPostal &&
                        isValidData &&
                        isValidImage &&
                        !isBlankName &&
                        !isBlankContact &&
                        !isBlankEmail &&
                        !isBlankMorada &&
                        !isBlankPais &&
                        !isBlankCodPostal &&
                        !isBlankSexo &&
                        !isBlankData &&
                        !isBlankImage && (
                            <button className="btnOk" onClick={() => { pedidoPost(); resetBooleans() }}>
                                Adicionar
                            </button>
                        )}
                    <button className="btnDanger" onClick={() => { abrirFecharModalAdicionar(); resetBooleans() }}>
                        Cancelar
                    </button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditar}>
                <ModalHeader>Editar Funcionário</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Nome:</label>
                        <br />
                        <input type="text" className="form-control" name="name" onChange={handleChangeName}
                            value={empregadoSelecionado && empregadoSelecionado.name} />
                        {!isValidName && <span className="regularExp">O nome não é válido, tem de conter no máximo 32 caracters.</span>}
                        {isBlankName && <span className="regularExp">Campo de preenchimento obrigatório.</span>}
                        <br />
                        <label>Contacto:</label>
                        <br />
                        <input type="text" className="form-control" name="contact" onChange={handleChangeContact}
                            value={empregadoSelecionado && empregadoSelecionado.contact} />
                        {!isValidContact && <span className="regularExp">Insira um número de telemóvel válido.</span>}
                        {isBlankContact && <span className="regularExp">Campo de preenchimento obrigatório.</span>}
                        <br />
                        <label>Email:</label>
                        <br />
                        <input type="text" className="form-control" name="email" onChange={handleChangeEmail}
                            value={empregadoSelecionado && empregadoSelecionado.email} />
                        {!isValidEmail && <span className="regularExp">Insira um email válido.</span>}
                        {isBlankEmail && <span className="regularExp">Campo de preenchimento obrigatório.</span>}
                        <br />
                        <label>Morada:</label>
                        <br />
                        <input type="text" className="form-control" name="morada" onChange={handleChangeMorada}
                            value={empregadoSelecionado && empregadoSelecionado.morada} />
                        {isBlankMorada && <span className="regularExp">Campo de preenchimento obrigatório.</span>}
                        <br />
                        <label>País:</label>
                        <br />
                        <input type="text" className="form-control" name="pais" onChange={handleChangePais}
                            value={empregadoSelecionado && empregadoSelecionado.pais} />
                        {isBlankPais && <span className="regularExp">Campo de preenchimento obrigatório.</span>}
                        <br />
                        <label>Código Postal:</label>
                        <br />
                        <input type="text" className="form-control" name="codPostal" onChange={handleChangeCodPostal}
                            value={empregadoSelecionado && empregadoSelecionado.codPostal} />
                        {!isValidCodPostal && <span className="regularExp">Insira um código de postal válido.</span>}
                        {isBlankCodPostal && <span className="regularExp">Campo de preenchimento obrigatório.</span>}
                        <br />
                        <label>Sexo:</label>
                        <br />
                        <Select options={sexoopc} onChange={handleChangeSelect} placeholder={empregadoSelecionado && empregadoSelecionado.sexo === 'M'
                            ? 'Masculino'
                            : empregadoSelecionado && empregadoSelecionado.sexo === 'F'
                                ? 'Feminino'
                                : ''} />
                        {isBlankSexo && <span className="regularExp">Campo de preenchimento obrigatório.</span>}
                        <br />
                        <label>Data de Nascimento:</label>
                        <br />
                        <input type="date" className="form-control" name="dataNasc" onChange={handleChangeData}
                            value={empregadoSelecionado && formatDate(empregadoSelecionado.dataNasc)} />
                        {!isValidData && <span className="regularExp">Insira uma data válida.</span>}
                        {isBlankData && <span className="regularExp">Campo de preenchimento obrigatório.</span>}
                        <br />
                        <label>Imagem:</label>
                        <br />
                        <input type="file" className="form-control" name="image" accept=".jpg,.png,.jpeg" onChange={handleImagemChange} />
                        {!isValidImage && <span className="regularExp">Formato inválido.</span>}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btnOk" onClick={() => { pedidoPut(); resetBooleans() }}>Editar</button>
                    <button className="btnDanger" onClick={() => { abrirFecharModalEditar(); resetBooleans() }}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalApagar}>
                <ModalBody>
                    Confirma a eliminação deste funcionário: {empregadoSelecionado && empregadoSelecionado.name} ?
                </ModalBody>
                <ModalFooter>
                    <button className="btnOk" onClick={() => pedidoDelete()}>Sim</button>
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
                    <button className="btnInfo" onClick={() => { abrirFecharModalEditar(); abrirFecharModalDetalhes(); resetBooleansEdit() }}>Editar</button>
                    <button className="btnDanger" onClick={() => { abrirFecharModalApagar(); abrirFecharModalDetalhes(); }}>Apagar</button>
                    <button className="btnOk" onClick={() => abrirFecharModalDetalhes()}>Cancelar</button>
                </ModalFooter>
            </Modal>

        </div>
    );
}


export default Employees;