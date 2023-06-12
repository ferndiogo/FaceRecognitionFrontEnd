import React from 'react';
import './styles.css';

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
            <div className='cards'>
                <div className="card" style={{ width: '500px', height: '180px' }}>
                    <div className="row no-gutters">
                        <div className="col-sm-5">
                            <img className="card-img" src={require("./img/Fernando.jpg")} />
                        </div>
                        <div className="col-sm-7">
                            <div className="card-body">
                                <h5 className="card-title">Fernando Fuzeiro</h5>
                                <p className="card-text">Nº 22111</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ width: '500px', height: '180px' }}>
                    <div className="row no-gutters">
                        <div className="col-sm-5">
                            <img className="card-img" src={require("./img/Vasco.jpg")} />
                        </div>
                        <div className="col-sm-7">
                            <div className="card-body">
                                <h5 className="card-title">Vasco Araújo</h5>
                                <p className="card-text">Nº 23055</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;