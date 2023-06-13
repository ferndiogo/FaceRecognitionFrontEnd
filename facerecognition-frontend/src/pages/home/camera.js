import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import './style.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';


function Camera() {
  const webcamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [modalAdicionado, setModalAdicionado] = useState(false);

  const baseUrl = "https://localhost:7136/Registry/";

  const [data, setData] = useState([]);

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
          setData(data.concat(response.data));
        } catch (error) {
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
          setData(data.concat(response.data));
          closeModal();
          abrirFecharModalAdicionado()
        } catch (error) {
          console.log(error);
        }
      }
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
        width={640}
        height={480}
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
                <button className="btn" onClick={enviarImagem}>Enviar</button>
                <button className="btn1" onClick={closeModal}>Cancelar</button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={modalAdicionado}>
                <ModalHeader>Registo Adicionado</ModalHeader>
                <ModalBody>
                    <div>O registo foi adicionado com sucesso!</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn" onClick={() => abrirFecharModalAdicionado()}><FontAwesomeIcon icon={faCheck} /></button>
                </ModalFooter>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}

export default Camera;
