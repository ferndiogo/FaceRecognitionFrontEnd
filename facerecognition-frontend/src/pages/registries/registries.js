import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { useParams } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';

import TableRegistos from './tableRegistos';
import moment from 'moment';

import { url } from '../../config';
import { Link } from "react-router-dom";
import { Card } from 'react-bootstrap';

function Registries() {

    const baseUrl = url + "Registry/";
    const baseUrlEmp = url + "Employee/";
    const baseUrlUser = url + "Auth/";

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

    const idEmp = useParams().id;

    const hora = useRef();
    const horaEdit = useRef();
    const date = useRef();
    const dateEdit = useRef();

    const [data, setData] = useState([]);
    const [dataEmp, setDataEmp] = useState({});
    const [dataRole, setDataRole] = useState('');

    const [updateData, setUpdateData] = useState(true);
    const [updateDataEmp, setUpdateDataEmp] = useState(true);
    const [updateDataRole, setUpdateDataRole] = useState(true);

    const [modalAdicionar, setModalAdicionar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalApagar, setModalApagar] = useState(false);
    const [modalCriado, setModalCriado] = useState(false);
    const [modalEditado, setModalEditado] = useState(false);
    const [modalApagado, setModalApagado] = useState(false);
    const [modalLoginInvalido, setModalLoginInvalido] = useState(false);

    const [searchText, setSearchText] = useState(null);
    const [textModalLogin, setTextModalLogin] = useState('');

    const [isValidData, setIsValidData] = useState(true);
    const [isBlankData, setIsBlankData] = useState(true);
    const [isValidHora, setIsValidHora] = useState(true);
    const [isBlankHora, setIsBlankHora] = useState(true);
    const [isBlankEntraSai, setIsBlankEntraSai] = useState(true);

    const [registoSelecionado, setRegistoSelecionado] = useState(
        {
            id: '',
            dateTime: '',
            type: '',
            employeeId: '',
        }
    )

    const entrasaida = [
        { value: 'E', label: 'Entrada', name: 'type' },
        { value: 'S', label: 'Saída', name: 'type' }
    ];

    const selecionarRegisto = (registo, opcao) => {
        setRegistoSelecionado(registo);
        if (opcao === "Editar") {
            abrirFecharModalEditar();
        }
        else {
            abrirFecharModalApagar();
        }

    }

    const abrirFecharModalAdicionar = () => {
        resetBooleansAdd();
        setModalAdicionar(!modalAdicionar);
        setRegistoSelecionado({
            ...registoSelecionado,
            'employeeId': dataEmp.id
        });
    }

    const abrirFecharModalEditar = () => {
        resetBooleansEdit();
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

    const abrirFecharModalLoginInvalido = useCallback(() => {
        setModalLoginInvalido(!modalLoginInvalido);
    }, [setModalLoginInvalido, modalLoginInvalido]);

    const handleChange = e => {
        const { name, value } = e.target;
        setRegistoSelecionado({
            ...registoSelecionado, [name]: value
        });
        console.log(registoSelecionado);
    }

    const handleChangeSearch = e => {
        if (e.target.value !== "") {
            setSearchText(new Date(e.target.value));
        }else{
            setSearchText(null);
        }
    }

    const handleChangeSelect = e => {
        const { name, value } = e;
        setRegistoSelecionado({
            ...registoSelecionado, [name]: value
        });
        console.log(registoSelecionado);

        const isBlankInput = value.trim() === '';
        setIsBlankEntraSai(isBlankInput);
    }

    const handleChangeData = (event) => {
        if (modalAdicionar) {
            setRegistoSelecionado({
                ...registoSelecionado,
                'dateTime': date.current.value + ' ' + hora.current.value + ':00'
            });
        } else {
            setRegistoSelecionado({
                ...registoSelecionado,
                'dateTime': dateEdit.current.value + ' ' + horaEdit.current.value + ':00'
            });
        }
        const value = event.target.value;
        const isBlankInput = value.trim() === '';

        const formattedDate = moment(value, 'DD-MM-YYYY').format('YYYY/MM/DD');
        const isValidInput = moment(formattedDate).isValid();

        setIsValidData(isBlankInput || isValidInput);
        setIsBlankData(isBlankInput);
    };

    const handleChangeHora = (event) => {
        if (modalAdicionar) {
            setRegistoSelecionado({
                ...registoSelecionado,
                'dateTime': date.current.value + ' ' + hora.current.value + ':00'
            });
        } else {
            setRegistoSelecionado({
                ...registoSelecionado,
                'dateTime': dateEdit.current.value + ' ' + horaEdit.current.value + ':00'
            });
        }
        const value = event.target.value;
        const isBlankInput = value.trim() === '';

        const formattedDate = moment(value, 'HH:mm').format('HH:mm');
        const isValidInput = moment(formattedDate, 'HH:mm').isValid();

        setIsValidHora(isBlankInput || isValidInput);
        setIsBlankHora(isBlankInput);
    };

    const processError = useCallback((error) => {
        if (error.response && (error.response.status === 401)) {
            abrirFecharModalLoginInvalido();
            setTextModalLogin("Tem de iniciar sessão para aceder a esta página");
        } else if (error.response && (error.response.status === 403)) {
            abrirFecharModalLoginInvalido();
            setTextModalLogin("Para realizar essa ação têm de iniciar sessão com um utilizador com essas permissôes");
        }
        console.log(error);
    }, [abrirFecharModalLoginInvalido]);

    const pedidoGetUserRole = useCallback(async () => {
        try {
            const response = await axios.get(baseUrlUser + "Roles");
            setDataRole(response.data);
        } catch (error) {
            processError(error);
        }
    }, [baseUrlUser, setDataRole, processError]);

    const pedidoGetEmp = useCallback(async () => {
        await axios.get(baseUrlEmp + idEmp)
            .then(response => {
                setDataEmp(response.data);
                //console.log(response.data);
            }).catch(error => {
                processError(error);
            })
    }, [idEmp, processError, baseUrlEmp])


    const pedidoGet = useCallback(async () => {
        await axios.get(baseUrl + "employee/" + idEmp)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                processError(error);
            })
    }, [idEmp, processError, baseUrl])

    const pedidoPost = async () => {
        delete registoSelecionado.id;
        const formData = new FormData();
        formData.append("dateTime", registoSelecionado.dateTime);
        formData.append("type", registoSelecionado.type);
        formData.append("employeeId", registoSelecionado.employeeId);
        axios.post(baseUrl + 'manual', formData)
            .then(response => {
                setData(data.concat(response.data));
                setUpdateData(true);
                abrirFecharModalAdicionar();
                abrirFecharModalCriado();
            }).catch(error => {
                processError(error);
            })
    }

    const pedidoPut = async () => {
        const formData = new FormData();
        formData.append('id', registoSelecionado.id)
        formData.append("dateTime", registoSelecionado.dateTime);
        formData.append("type", registoSelecionado.type);
        formData.append("employeeId", registoSelecionado.employeeId);
        await axios.put(baseUrl + registoSelecionado.id, formData)
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
                    return registo;
                });
                setUpdateData(true);
                abrirFecharModalEditar();
                abrirFecharModalEditado();
            }).catch(error => {
                processError(error);
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
                processError(error);
            })
    }

    const extrairDataHora = (dateTimeString) => {
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

    const resetBooleansAdd = () => {
        setIsValidData(true);
        setIsBlankData(true);
        setIsValidHora(true);
        setIsBlankHora(true);
        setIsBlankEntraSai(true);
    }

    const resetBooleansEdit = () => {
        setIsValidData(true);
        setIsBlankData(false);
        setIsValidHora(true);
        setIsBlankHora(false);
        setIsBlankEntraSai(false);
    }

    const dataHora = (str) => {
        const aux = new Date(registoSelecionado.dateTime);
        const dia = aux.getDate();
        const mes = aux.getMonth() + 1;
        const ano = aux.getFullYear();
        const horas = aux.getHours();
        const minutos = aux.getMinutes();
        const dataAux = dia + '/' + mes + '/' + ano;
        const horaAux = horas + ':' + minutos;

        if (str === 'data') {
            return dataAux
        } else {
            return horaAux
        }
    }


    //impedir loop pedidoGet
    useEffect(() => {
        if (updateData) {
            pedidoGet();
            setUpdateData(false);
        }
    }, [updateData, pedidoGet])

    useEffect(() => {
        if (updateDataRole) {
            pedidoGetUserRole();
            setUpdateDataRole(false);
        }
    }, [updateDataRole, pedidoGetUserRole])

    useEffect(() => {
        if (updateDataEmp) {
            pedidoGetEmp();
            setUpdateDataEmp(false);
        }
    }, [updateDataEmp, pedidoGetEmp])

    return (
        <div className="empregados-container">
            <h2 className="titulo">Registos de Ponto</h2>
            <h4 className="subtitulo">Funcionário</h4>

            <div className="d-flex flex-wrap">
                <Card className="mt-4 d-flex flex-row cardAllRegistry">
                    <Card.Img variant="top" src={dataEmp.image} className="card-imageRegistry" />
                    <Card.Body className="d-flex flex-column bodyCard">
                        <Card.Title className='titleCard'>{dataEmp.name}</Card.Title>
                        <Card.Text className='textCard'>{dataEmp.email}<br />{dataEmp.contact}</Card.Text>
                    </Card.Body>
                </Card>
            </div>

            <div className="barra">

                {(dataRole === "Admin") && <div className="esquerda">
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: "30px", color: "#ffffff", }} />
                    <h5 className="addfunc">Adicionar Registo</h5>
                    <button className="btn" onClick={() => abrirFecharModalAdicionar()}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>}

                <div className="direita">
                    <input className="pesquisa" type="date" placeholder="Pesquisar" name="pesquisa" aria-label="Pesquisar" onChange={handleChangeSearch} />
                    <button className="btn" type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                </div>

            </div>
            <table className="table table-dark table-striped mt-4">
                <thead>
                    <tr>
                        <th>Data e Hora</th>
                        <th>Entrada Ou Saída</th>
                        {(dataRole === "Admin") && <th>Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    <TableRegistos selecionarRegisto={selecionarRegisto} registos={data} search={searchText} role={dataRole} />
                </tbody>
            </table>
            <Modal isOpen={modalAdicionar}>
                <ModalHeader>Adicionar Registo</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Data:</label>
                        {isBlankData && <span className="regularExp"> *</span>}
                        <br />
                        <input ref={date} type="text" className="form-control" name="date" onChange={handleChangeData} />
                        {!isValidData && <span className="regularExp">Insira uma data válida. Exemplo: 12/3/2023</span>}
                        <br />
                        <label>Hora:</label>
                        {isBlankHora && <span className="regularExp"> *</span>}
                        <br />
                        <input ref={hora} type="text" className="form-control" name="time" onChange={handleChangeHora} />
                        {!isValidHora && <span className="regularExp">Insira uma Hora válida. Exemplo: 12:34</span>}
                        <br />
                        <label>Entrada/Saída:</label>
                        {isBlankEntraSai && <span className="regularExp"> *</span>}
                        <br />
                        <Select
                            options={entrasaida}
                            onChange={handleChangeSelect}
                            placeholder="Selecione uma opção"
                        />
                        <br />
                        <label>Nome do Empregado:</label>
                        <br />
                        <input readOnly={true} value={dataEmp.name} type="text" className="form-control" name="employeeId" onChange={handleChange} />
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
                        <label>Data:</label>
                        {isBlankData && <span className="regularExp"> *</span>}
                        <br />
                        <input ref={dateEdit} type="text" className="form-control" name="date" onChange={handleChangeData} defaultValue={dataHora('data')} />
                        {!isValidData && <span className="regularExp">Insira uma data válida. Exemplo: 12/3/2023</span>}
                        <br />
                        <label>Hora:</label>
                        {isBlankHora && <span className="regularExp"> *</span>}
                        <br />
                        <input ref={horaEdit} type="text" className="form-control" name="time" onChange={handleChangeHora} defaultValue={dataHora('hora')} />
                        {!isValidHora && <span className="regularExp">Insira uma Hora válida. Exemplo: 12:34</span>}
                        <br />
                        <label>Entrada/Saída:</label>
                        {isBlankEntraSai && <span className="regularExp"> *</span>}
                        <br />
                        <Select
                            options={entrasaida}
                            onChange={handleChangeSelect}
                            placeholder="Selecione uma opção"
                            defaultValue={registoSelecionado.type === 'E' ? entrasaida[0] : entrasaida[1]}
                        />
                        <br />
                        <label>ID Empregado:</label>
                        <br />
                        <input readOnly={true} value={dataEmp.id} type="text" className="form-control" name="employeeId" onChange={handleChange} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => pedidoPut()}>Editar</button>
                    <button className="btn1" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalApagar}>
                <ModalBody>
                    Confirma a eliminação deste registo de <b>{dataEmp.name}</b> com data e hora: <b>{extrairDataHora(registoSelecionado.dateTime)}</b> ?
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => pedidoDelete()}>Sim</button>
                    <button className="btn1" onClick={() => abrirFecharModalApagar()}>Não</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalCriado}>
                <ModalHeader>Registo Adicionado</ModalHeader>
                <ModalBody>
                    <div>O novo registo foi adicionado com sucesso!</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => abrirFecharModalCriado()}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditado}>
                <ModalHeader>Registo Editado</ModalHeader>
                <ModalBody>
                    <div>O registo foi modificado com sucesso!</div>
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

            <Modal isOpen={modalLoginInvalido}>
                <ModalHeader>Não Autorizado</ModalHeader>
                <ModalBody>{textModalLogin}</ModalBody>
                <ModalFooter>
                <Link to="login"><button className="btnDanger">Iniciar Sessão</button></Link>
                </ModalFooter>
            </Modal>

        </div>
    );
}


export default Registries;