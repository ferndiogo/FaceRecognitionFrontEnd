import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import CryptoJS from 'crypto-js';
import { url, encryptionKey } from '../../config';

function Camera() {
  const baseUrl = url + 'Registry/';

  // Função para descriptografar uma string
  const decryptString = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), encryptionKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  };

  if(localStorage.getItem('token') != null) {
    axios.defaults.headers.common['Authorization'] = decryptString(localStorage.getItem('token'));
  }

  const [capturedImage, setCapturedImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalAdicionado, setModalAdicionado] = useState(false);
  const [modalErro, setModalErro] = useState(false);

  const [txtModalErro, setTxtModalErro] = useState('');

  const [employeeName, setEmployeeName] = useState('');

  const openCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera';
    input.onchange = handleFileInputChange;
    input.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const imageSrc = reader.result;
      setCapturedImage(imageSrc);
      openModal();
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const abrirFecharModalAdicionado = () => {
    setModalAdicionado(!modalAdicionado);
  };

  const enviarImagem = async () => {
    if (capturedImage) {
      const fileExtension = capturedImage.substring(capturedImage.lastIndexOf('.') + 1).toLowerCase();
      const allowedExtensions = ['png', 'jpeg', 'jpg'];

      if (allowedExtensions.includes(fileExtension)) {

        const formData = new FormData();
        formData.append('img', capturedImage);

        try {
          const response = await axios.post(baseUrl, formData);
          setEmployeeName(response.data[0].employee.name);
          closeModal();
          abrirFecharModalAdicionado();
        } catch (error) {
          closeModal();
          setTxtModalErro("Ocorreu um erro ao identificar o rosto!");
          setModalErro(true);
        }
      } else {

        const formData = new FormData();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            formData.append('img', blob, 'captured_image.jpg');

            axios.post(baseUrl, formData)
              .then((response) => {
                setEmployeeName(response.data[0].employee.name);
                closeModal();
                abrirFecharModalAdicionado();
              })
              .catch((error) => {
                closeModal();
                setTxtModalErro("Ocorreu um erro ao identificar o rosto!");
                setModalErro(true);
              });
          }, 'image/jpeg', 0.7); // Defina a qualidade desejada (0.7 neste exemplo)
        };
        img.src = capturedImage;
      }
    } else {
      closeModal();
      setTxtModalErro("Ocorreu um erro ao capturar imagem!");
      setModalErro(true);
    }
  };

  return (
    <div className="camera">
      <div className="d-flex justify-content-center">
        <button className="btn" onClick={openCamera}>
          Capturar Imagem
        </button>
        {capturedImage && (
          <div>
            <Modal isOpen={modalIsOpen}>
              <ModalHeader>Imagem Capturada</ModalHeader>
              <ModalBody>
                <img className="imagem" src={capturedImage} alt="Imagem Capturada" />
              </ModalBody>
              <ModalFooter>
                <button className="btnOk" onClick={enviarImagem}>Enviar</button>
                <button className="btnDanger" onClick={closeModal}>Cancelar</button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={modalAdicionado}>
              <ModalHeader>Registo Adicionado</ModalHeader>
              <ModalBody>
                <span>O registo foi adicionado com sucesso!</span>
                <br />
                <span>Funcionário: <b>{employeeName}</b></span>
              </ModalBody>
              <ModalFooter>
                <button className="btnOk" onClick={abrirFecharModalAdicionado}>
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={modalErro}>
              <ModalHeader>Erro</ModalHeader>
              <ModalBody>
                <span>{txtModalErro}</span>
              </ModalBody>
              <ModalFooter>
                <button className="btnDanger" onClick={() => setModalErro(false)}><FontAwesomeIcon icon={faX} /></button>
              </ModalFooter>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}

export default Camera;
