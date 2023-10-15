import React, { useState, useEffect } from 'react';
import './App.scss';

import FormPage from './pages/FormPage/FormPage';

import {initializeApp} from "firebase/app"
import SorteoPage from './pages/SorteoPage/SorteoPage';

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyAjaKM6iwRtR2xGkfOx_DUzhzAphvkcbyY",
    authDomain: "nacionseguros-3662a.firebaseapp.com",
    databaseURL: "https://nacionseguros-3662a-default-rtdb.firebaseio.com/",
    projectId: "nacionseguros-3662a",
    storageBucket: "nacionseguros-3662a.appspot.com",
    messagingSenderId: "961455310490",
    appId: "1:961455310490:web:1ceb339eac5a2b9bffc123"
  };

  useEffect(() => {

    function bloquearClicDerecho(event) {
      event.preventDefault();
    }

    document.addEventListener('contextmenu', bloquearClicDerecho);

    return () => {
      document.removeEventListener('contextmenu', bloquearClicDerecho);
    };
  }, []);

  const app = initializeApp(firebaseConfig)

  const [section, setSection] = useState(0);

  const handleSection = (page) => {
    setSection(page);
  }

  return (
    <div className="App">      
      {section === 0 && <FormPage app={app} handleSection={handleSection} />}
      {section === 1 && <SorteoPage handleSection={handleSection}/>}
    </div>
  );
}

export default App;
