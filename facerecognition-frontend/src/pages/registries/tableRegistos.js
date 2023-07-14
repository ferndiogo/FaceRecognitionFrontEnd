import React from 'react';
import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

function TableRegistos({ selecionarRegisto, registos, search, role }) {

    function getTipo(registo) {
        return registo.type === 'E' ? 'Entrada' : 'Saída';
    }

    // Função responsável por extrair os componentes de data e hora de uma string de data e hora e retorná-la em um formato específico.
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

    // Se não houver valor de pesquisa, o código renderiza todos os registros na tabela. 
    // Se houver um valor de pesquisa, o código filtra os registros com base na data.
    if (search == null) {
        return (
            registos.map(registo => (
                <tr key={registo.id}>
                    <td>{extrairDataHora(registo.dateTime)}</td>
                    <td>{getTipo(registo)}</td>
                    {(role === "Admin") && <td>
                        <div className="tableR">
                            <button className="btnOk tableBtn" onClick={() => selecionarRegisto(registo, "Editar")}><FontAwesomeIcon icon={faEdit} /></button>
                            <button className="btnDanger tableBtn" onClick={() => selecionarRegisto(registo, "Apagar")}><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                    </td>}
                </tr>
            ))
        )
    } else {
        return (
            registos.map(registo => {
                const date = new Date(registo.dateTime);
                if (date.toDateString() === search.toDateString()) {
                    return (
                        <tr key={registo.id}>
                            <td>{extrairDataHora(registo.dateTime)}</td>
                            <td>{getTipo(registo)}</td>
                            {(role === "Admin") && <td>
                                <div className="d-inline-flex">
                                    <button className="btnOk" onClick={() => selecionarRegisto(registo, "Editar")}><FontAwesomeIcon icon={faEdit} /></button>
                                    <button className="btnDanger" onClick={() => selecionarRegisto(registo, "Apagar")}><FontAwesomeIcon icon={faTrash} /></button>
                                </div>
                            </td>}
                        </tr>
                    );
                } else {
                    return null;
                }
            })
        )
    }
}

export default TableRegistos;