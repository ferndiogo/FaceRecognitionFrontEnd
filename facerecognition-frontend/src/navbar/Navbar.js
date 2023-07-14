import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import * as Icons from "react-icons/fa";
import "./Navbar.css";
import "./Button.css";
import { navItems } from "./NavItems.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
//import { faHouse, faPeopleGroup, faCircleInfo, faRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { url, encryptionKey } from '../config';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import CryptoJS from 'crypto-js';


function Navbar() {

  const baseUrlUser = url + "Auth/";

  // Função para descriptografar uma string
  const decryptString = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), encryptionKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  };

  if(localStorage.getItem('token') != null) {
    axios.defaults.headers.common['Authorization'] = decryptString(localStorage.getItem('token'));
  }
  
  const [mobile, setMobile] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  const [modalTerminarSessao, setModalTerminarSessao] = useState(false);

  const [dataRole, setDataRole] = useState('');
  const [updateDataRole, setUpdateDataRole] = useState(true);

  const [txtSessao, setTxtSessao] = useState('Iniciar Sessão');

  const pedidoGetUserRole = useCallback(async () => {
    try {
      const response = await axios.get(baseUrlUser + "Roles");
      setDataRole(response.data);
      setTxtSessao('Terminar Sessão');
    } catch (error) {
      setTxtSessao('Iniciar Sessão');
      setDataRole('');
    }
  }, [baseUrlUser, setDataRole]);

  const terminarSessão = useCallback(async () => {
    localStorage.setItem('token', '');
  }, [])

  useEffect(() => {
    if (window.innerWidth < 1350) {
      setMobile(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1350) {
        setMobile(true);
      } else {
        setMobile(false);
        setSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (updateDataRole) {
      pedidoGetUserRole();
      setUpdateDataRole(false);
    }
  }, [updateDataRole, pedidoGetUserRole])

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">
          <FontAwesomeIcon icon={faExpand} />
          <div className="top">Rekognition</div>
        </div>
        {!mobile && (
          <ul className="nav-items">
            {navItems.map((item) => {
              if (item.role === '' || item.role === dataRole || dataRole === 'Admin') {
                return (
                  <li key={item.id} className={item.nName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              } else {
                return null;
              }
            })}
            {(txtSessao === 'Iniciar Sessão') ? (
              <li className="nav-item">
                <Link to="./Login">
                  <FontAwesomeIcon icon={faRightToBracket} style={{ color: "#ffffff", }} />
                  <span>{txtSessao}</span>
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <button onClick={() => setModalTerminarSessao(true)} style={{ backgroundColor: "transparent", padding: 0, border: 0 }}>
                  <Link to='/'>
                    <FontAwesomeIcon icon={faRightToBracket} style={{ color: "#ffffff", }} />
                    <span>{txtSessao}</span>
                  </Link>
                </button>
              </li>
            )}
          </ul>
        )}
        {!mobile}

        {mobile && (
          <div className="sidebar-toggle">
            {sidebar ? (
              <Icons.FaTimes
                className="sidebar-toggle-logo"
                onClick={() => setSidebar(!sidebar)}
              />
            ) : (
              <Icons.FaBars
                className="sidebar-toggle-logo"
                onClick={() => setSidebar(!sidebar)}
              />
            )}
          </div>
        )}
      </nav>

      <div className={sidebar ? "sidebar active" : "sidebar"}>
        <ul className="sidebar-items">
          {navItems.map((item) => {
            if (item.role === '' || item.role === dataRole || dataRole === 'Admin') {
              return (
                <li
                  key={item.id}
                  className={item.sName}
                  onClick={() => setSidebar(false)}
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            } else {
              return null;
            }
          })}
          {(txtSessao === 'Iniciar Sessão') ? (
              <li className="sidebar-item">
                <Link to="./Login">
                  <FontAwesomeIcon icon={faRightToBracket} style={{ color: "#ffffff", }} />
                  <span>{txtSessao}</span>
                </Link>
              </li>
            ) : (
              <li className="sidebar-item">
                <button onClick={() => setModalTerminarSessao(true)} style={{ backgroundColor: "transparent", padding: 0, border: 0 }}>
                  <Link to='/'>
                    <FontAwesomeIcon icon={faRightToBracket} style={{ color: "#ffffff", }} />
                    <span>{txtSessao}</span>
                  </Link>
                </button>
              </li>
            )}
        </ul>
      </div>

      <Modal isOpen={modalTerminarSessao}>
        <ModalHeader>Terminar Sessão</ModalHeader>
        <ModalBody>Tem a certeza que deseja terminar sessão?</ModalBody>
        <ModalFooter>
          <Link to="/"><button className="btnOk" onClick={() => { terminarSessão(); window.location.reload(); }}>Sim</button></Link>
          <button className="btnDanger" onClick={() => setModalTerminarSessao(false)}>Não</button>
        </ModalFooter>
      </Modal>

    </div >
  );
}

export default Navbar;
