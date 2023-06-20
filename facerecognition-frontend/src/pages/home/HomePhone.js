import React from 'react';
import './style.css';
import Camera from "./cameraAndroid";

const HomePhone = () => {
  return (
    <div className="home-page">
      <h1>Captura de Imagem phone</h1>
      <br />
      <br />
      <Camera />
    </div>
  );
}

export default HomePhone;