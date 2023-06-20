import React from 'react';
import './style.css';
import { Capacitor } from '@capacitor/core';
import HomeWeb from './HomeWeb';
import HomeAndroid from './HomeAndroid';
import HomePhone from './HomePhone';


const Home = () => {

  const platform = Capacitor.getPlatform();

  const isMobileDevice = () => {
    const mediaQuery = window.matchMedia('(max-width: 500px)');
    return mediaQuery.matches;
  };

  return (
    //Se for Web no computador = HomeWeb
    //Se for Web dispositivos moveis = HomePhone
    //Se for Android = HomeAndroid
    <div className="app">
      {platform === 'web' && isMobileDevice() ? <HomePhone /> : (platform === 'web' ? <HomeWeb /> : <HomeAndroid />)}
    </div>
  );
}

export default Home;