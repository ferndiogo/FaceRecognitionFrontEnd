import React from 'react';
import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

function TableAccount({ selecionarUser, users, search }) {

    function extrairDataHora(dateTimeString) {
        const dateObj = new Date(dateTimeString);
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');

        if (year < 1900) {
            return null;
        }

        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }

    if (search === '') {
        return (
            users.map(user => (
                <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{extrairDataHora(user.tokenCreated)}</td>
                    <td>{user.role}</td>
                    <td>
                        <div className="tableR">
                            <button className="btnOk tableBtn" onClick={() => selecionarUser(user, "Editar")}><FontAwesomeIcon icon={faEdit} /></button>
                            <button className="btnDanger tableBtn" onClick={() => selecionarUser(user, "Apagar")}><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                    </td>
                </tr>
            ))
        )
    } else {
        const searchLowerCase = search.toLowerCase();
        return (
            users.map(user => {
                const username = user.username.toLowerCase();
                if (username.includes(searchLowerCase)) {

                    return (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{extrairDataHora(user.tokenCreated)}</td>
                            <td>{user.role}</td>
                            <td>
                                <div className="tableR">
                                    <button className="btnOk tableBtn" onClick={() => selecionarUser(user, "Editar")}><FontAwesomeIcon icon={faEdit} /></button>
                                    <button className="btnDanger tableBtn" onClick={() => selecionarUser(user, "Apagar")}><FontAwesomeIcon icon={faTrash} /></button>
                                </div>
                            </td>
                        </tr>
                    );
                } else {
                    return null;
                }
            })
        )
    }
}

export default TableAccount;