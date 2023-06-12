import React from 'react';
import './styles.css';
import fernandoImage from './img/Fernando.jpg';
import vascoImage from './img/Vasco.jpg';
import { Card } from 'react-bootstrap';

function About() {
    return (
        <div className='content'>
            <h1>Sobre Nós</h1>
            <br />
            <p className='pContent'>O Rekognition é uma aplicação web que permite a gestão de ponto dos funcionários de uma empresa, utilizando os serviços da AWS para fazer o
                reconhecimento facial e assim criar o registo de ponto do funcionário, esta aplicação também permite armazenar alguns dados básicos sobre os funcionários.
            </p>
            <p className='pContent'>
                Esta aplicação foi desenvolvida no âmbito da unidade curricular de projeto final e foi desenvolvida pelos alunos:
            </p>

            <div className="d-flex flex-wrap">
                <Card className="mt-4 d-flex flex-row cardbody">
                    <Card.Img variant="top" src={fernandoImage} className="card-image" />
                    <Card.Body className="d-flex flex-column">
                        <Card.Title>Fernando Fuzeiro</Card.Title>
                        <Card.Text>Nº 22111</Card.Text>
                    </Card.Body>
                </Card>

                <Card className="mt-4 d-flex flex-row">
                    <Card.Img variant="top" src={vascoImage} className="card-image" />
                    <Card.Body className="d-flex flex-column cardbody">
                        <Card.Title>Vasco Araujo</Card.Title>
                        <Card.Text>Nº 23055</Card.Text>
                    </Card.Body>
                </Card>
                <br /><br /><br />
            </div>

        </div>
    );
}

export default About;