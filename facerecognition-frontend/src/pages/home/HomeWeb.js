import React from 'react';
import './style.css';
import Camera from "../home/cameraWeb";

const HomeWeb = () => {
  return (
    <div className="home-page">
      <h1>Captura de Imagem</h1>
      <Camera />
    </div>
  );
}

export default HomeWeb;