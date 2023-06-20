import React from 'react';
import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Cards({ empregados, search, selecionarEmpregado }) {
    if (search === "") {
        return (
            empregados.map(empregado => (
                <Card key={empregado.id} className="mt-4">
                    <Card.Img variant="top" src={empregado.image} className="card-image" />
                    <Card.Body>
                        <Card.Title>{empregado.name}</Card.Title>
                        <Card.Text>
                            {empregado.email}
                            <span className='btnsCenter'>
                                <Link to={`../Registries/${empregado.id}`} style={{ fontSize: '1rem' }} className="btnInfo">
                                    <FontAwesomeIcon icon={faPlus} /> Registos
                                </Link>
                                <button onClick={() => selecionarEmpregado(empregado, "Detalhes")} style={{ fontSize: '1rem' }} className="btn">
                                    <FontAwesomeIcon icon={faPlus} /> Ver mais
                                </button>
                            </span>
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))
        );
    } else {
        const searchLowerCase = search.toLowerCase();
        return (
            empregados.map(empregado => {
                const empregadoNameLowerCase = empregado.name.toLowerCase();
                if (empregadoNameLowerCase.includes(searchLowerCase)) {
                    return (
                        <Card key={empregado.id} className="mt-4">
                            <Card.Img variant="top" src={empregado.image} className="card-image" />
                            <Card.Body>
                                <Card.Title>{empregado.name}</Card.Title>
                                <Card.Text>
                                    {empregado.email}
                                    <div className='btnsCenter'>
                                        <Link to={`../Registries/${empregado.id}`} style={{ fontSize: '1rem' }} className="btnInfo">
                                            <FontAwesomeIcon icon={faPlus} />Registos
                                        </Link>
                                        <button onClick={() => selecionarEmpregado(empregado, "Detalhes")} style={{ fontSize: '1rem' }} className="btn">
                                            <FontAwesomeIcon icon={faPlus} />Ver mais
                                        </button>
                                    </div>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    );
                } else {
                    return null; // Retorne null se o empregado não corresponder à pesquisa
                }
            })
        );
    }
}

export default Cards;