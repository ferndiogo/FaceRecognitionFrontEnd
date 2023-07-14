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

  // Configuração do header do axios com o token de autenticação
  if(localStorage.getItem('token') != null) {
    axios.defaults.headers.common['Authorization'] = decryptString(localStorage.getItem('token'));
  }

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

  // Função esponsável por enviar a imagem capturada para a API.
  const enviarImagem = async () => {
    if (capturedImage) {
      // Obtém a extensão do arquivo da imagem capturada
      const fileExtension = capturedImage.substring(capturedImage.lastIndexOf('.') + 1).toLowerCase();
      const allowedExtensions = ['png', 'jpeg', 'jpg'];

      if (allowedExtensions.includes(fileExtension)) {

        // Se a extensão estiver na lista de extensões permitidas, envia a imagem diretamente
        const formData = new FormData();
        formData.append("img", capturedImage);

        try {
          // Envia a imagem para o servidor usando uma requisição POST
          const response = await axios.post(baseUrl, formData);
          setEmployeeName(response.data[0].employee.name);
          closeModal();
          abrirFecharModalAdicionado();
        } catch (error) {
          // Em caso de erro, fecha o modal e exibe uma mensagem de erro
          closeModal();
          setTxtModalErro("Ocorreu um erro ao identificar o rosto!");
          setModalErro(true);
        }
      } else {
        // Se a extensão não estiver na lista de extensões permitidas, converte a imagem para PNG antes de enviar
        const convertedImage = await convertToPng(capturedImage);

        const formData = new FormData();
        formData.append("img", convertedImage, "captured_image.png");

        try {
          // Envia a imagem convertida para o servidor usando uma requisição POST
          const response = await axios.post(baseUrl, formData);
          setEmployeeName(response.data[0].employee.name);
          closeModal();
          abrirFecharModalAdicionado();
        } catch (error) {
          // Em caso de erro, fecha o modal e exibe uma mensagem de erro
          closeModal();
          setTxtModalErro("Ocorreu um erro ao identificar o rosto!");
          setModalErro(true);
        }
      }
    } else {
      // Se não houver imagem capturada, fecha o modal e exibe uma mensagem de erro
      closeModal();
      setTxtModalErro("Ocorreu um erro ao capturar imagem!");
      setModalErro(true);
    }
  };

  // Função responsável por converter uma imagem para o formato PNG
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
