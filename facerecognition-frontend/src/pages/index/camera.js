import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import './style.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function Camera() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const startCamera = () => {
    if (webcamRef.current) {
      // Iniciar a câmera
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

  return (
    <div className='camera'>
      <Webcam
        audio={false}
        ref={webcamRef}
        width={640} // Largura da área de visualização da câmera
        height={480} // Altura da área de visualização da câmera
        onUserMedia={startCamera} // Chamar a função quando a câmera estiver pronta
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
                    <button className="btn" onClick={() => closeModal()}>Enviar</button>
                    <button className="btn1" onClick={() => closeModal()}>Cancelar</button>
                </ModalFooter>
            </Modal>

          </div>
        )} </div>
    </div>

  );
}

export default Camera;
