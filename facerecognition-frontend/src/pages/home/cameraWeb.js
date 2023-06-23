import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import './style.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import CryptoJS from 'crypto-js';
import { url, encryptionKey } from '../../config';

function Camera() {

  // Função para descriptografar uma string
  const decryptString = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  };

  axios.defaults.headers.common['Authorization'] = decryptString(localStorage.getItem('token'));

  const webcamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalAdicionado, setModalAdicionado] = useState(false);
  const [modalErro, setModalErro] = useState(false);

  const [txtModalErro, setTxtModalErro] = useState('');

  const baseUrl = url + "Registry/";

  const [employeeName, setEmployeeName] = useState('');

  const startCamera = () => {
    if (webcamRef.current) {
      webcamRef.current.video.play();
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    openModal();
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const abrirFecharModalAdicionado = () => {
    setModalAdicionado(!modalAdicionado);
  }

  const enviarImagem = async () => {
    if (capturedImage) {
      const fileExtension = capturedImage.substring(capturedImage.lastIndexOf('.') + 1).toLowerCase();
      const allowedExtensions = ['png', 'jpeg', 'jpg'];

      if (allowedExtensions.includes(fileExtension)) {
        console.log("Imagem capturada:", capturedImage);

        const formData = new FormData();
        formData.append("img", capturedImage);

        try {
          const response = await axios.post(baseUrl, formData);
          setEmployeeName(response.data[0].employee.name);
          closeModal();
          abrirFecharModalAdicionado();
        } catch (error) {
          closeModal();
          setTxtModalErro("Ocorreu um erro ao identificar o rosto!");
          setModalErro(true);
          console.log(error);
        }
      } else {
        console.log("Formato de imagem não suportado. Convertendo para PNG...");

        const convertedImage = await convertToPng(capturedImage);
        console.log("Imagem convertida:", convertedImage);

        const formData = new FormData();
        formData.append("img", convertedImage, "captured_image.png");

        try {
          const response = await axios.post(baseUrl, formData);
          setEmployeeName(response.data[0].employee.name);
          closeModal();
          abrirFecharModalAdicionado();
        } catch (error) {
          closeModal();
          setTxtModalErro("Ocorreu um erro ao identificar o rosto!");
          setModalErro(true);
          console.log(error);
        }
      }
    } else {
      closeModal();
      setTxtModalErro("Ocorreu um erro ao capturar imagem!");
      setModalErro(true);
    }
  };

  const convertToPng = async (imageData) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      };

      img.onerror = () => {
        reject(new Error('Falha ao converter a imagem.'));
      };

      img.src = imageData;
    });
  };



  return (
    <div className='camera'>
      <Webcam
        audio={false}
        ref={webcamRef}
        width={1000}
        height={570}
        onUserMedia={startCamera}
      />
      <div className="d-flex justify-content-center">
        <button className="btn" onClick={captureImage}>Capturar Imagem</button>
        {capturedImage && (
          <div>
            <Modal isOpen={modalIsOpen}>
              <ModalHeader>Imagem Capturada</ModalHeader>
              <ModalBody>
                <img className='imagem' src={capturedImage} alt="Imagem Capturada" />
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
                <button className="btnOk" onClick={() => abrirFecharModalAdicionado()}><FontAwesomeIcon icon={faCheck} /></button>
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
