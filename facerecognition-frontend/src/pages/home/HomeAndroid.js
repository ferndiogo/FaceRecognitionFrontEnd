import React from 'react';
import './style.css';
import Camera from "./cameraAndroid";

const HomeAndroid = () => {
  return (
    <div className="home-page">
      <h1>Captura de Imagem</h1>
      <br />
      <br />
      <Camera />
    </div>
  );
}

export default HomeAndroid;