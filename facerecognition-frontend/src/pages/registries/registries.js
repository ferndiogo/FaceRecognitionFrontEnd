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

function Registries() {
  
    const baseUrl = url + "Registry/";
    const baseUrlEmp = url + "Employee/";
    const baseUrlUser = url + "Auth/";
  
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

    const idEmp = useParams().id;

    const hora = useRef();
    const date = useRef();

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

    const [modalLoginInvalido, setModalLoginInvalido] = useState(false)

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
        (opcao === "Editar") ?
            abrirFecharModalEditar() : abrirFecharModalApagar();
    }

    const abrirFecharModalAdicionar = () => {
        setModalAdicionar(!modalAdicionar);
        setRegistoSelecionado({
            ...registoSelecionado,
            'employeeId': dataEmp.id
        });
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
        setSearchText(new Date(e.target.value));
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
        setRegistoSelecionado({
            ...registoSelecionado,
            'dateTime': date.current.value + ' ' + hora.current.value + ':00'
        });
        const value = event.target.value;
        const isBlankInput = value.trim() === '';

        const formattedDate = moment(value, 'DD-MM-YYYY').format('YYYY/MM/DD');
        const isValidInput = moment(formattedDate).isValid();

        setIsValidData(isBlankInput || isValidInput);
        setIsBlankData(isBlankInput);
    };

    const handleChangeHora = (event) => {
        setRegistoSelecionado({
            ...registoSelecionado,
            'dateTime': date.current.value + ' ' + hora.current.value + ':00'
        });
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
            }).catch(error => {
                processError(error);
            })
    }, [idEmp, processError])


    const pedidoGet = useCallback(async () => {
        await axios.get(baseUrl + "employee/" + idEmp)
            .then(response => {
                setData(response.data);
                setDataEmp(response.data[0].employee);
            }).catch(error => {
                processError(error);
            })
    }, [idEmp, processError])

    const pedidoPost = async () => {
        delete registoSelecionado.id;
        const formData = new FormData();
        formData.append("dateTime", registoSelecionado.dateTime)
        formData.append("type", registoSelecionado.type)
        formData.append("employeeId", registoSelecionado.employeeId)
        formData.append("employee", registoSelecionado.employeeId)
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

            <div className="card" style={{ width: '500px', maxHeight: '200px' }}>
                <div className="row no-gutters">
                    <div className="col-sm-5">
                        <img className="card-img" alt="" src={dataEmp.image} />
                    </div>
                    <div className="col-sm-7">
                        <div className="card-body">
                            <h5 className="card-title">{dataEmp.name}</h5>
                            <p className="card-text">{dataEmp.email}<br />{dataEmp.contact}</p>
                        </div>
                    </div>
                </div>
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
                        <th>Entrada/Saída</th>
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
                        <label>Data:</label>{isBlankData && <span className="regularExp"> *</span>}
                        <br />
                        <input ref={date} type="text" className="form-control" name="date" onChange={handleChangeData} />
                        {!isValidData && <span className="regularExp">Insira uma data válida.</span>}
                        <br />
                        <label>Hora:</label>{isBlankHora && <span className="regularExp"> *</span>}
                        <br />
                        <input ref={hora} type="text" className="form-control" name="time" onChange={handleChangeHora} />
                        {!isValidHora && <span className="regularExp">Insira uma Hora válida.</span>}
                        <br />
                        <label>Entrada/Saída:</label>{isBlankEntraSai && <span className="regularExp"> *</span>}
                        <br />
                        <Select
                            options={entrasaida}
                            onChange={handleChangeSelect}
                            placeholder="Selecione uma opção"
                        />
                        <br />
                        <label>ID Empregado:</label>
                        <br />
                        <input readOnly={true} value={dataEmp.id} type="text" className="form-control" name="employeeId" onChange={handleChange} />
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
                        <input type="dateTime" className="form-control" name="dateTime" onChange={handleChange}
                            value={registoSelecionado && registoSelecionado.dateTime} />
                        <br />
                        <label>Entrada/Saída:</label>
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
                    <button className="btnDanger" onClick={() => { window.location.href = '/login'; }}>Iniciar Sessão</button>
                </ModalFooter>
            </Modal>

        </div>
    );
}


export default Registries;