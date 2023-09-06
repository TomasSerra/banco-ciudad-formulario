import React, { useEffect, useState } from 'react'
import './SorteoPage.scss'
import logoBlanco from "../../img/logos/logoBlanco.png"
import randomIcon from "../../img/logos/random.png"
import { getDatabase, ref, child, push, update, onValue } from "firebase/database";

export default function SorteoPage(props) {
    const [name, setName] = useState("");
    const [dni, setDni] = useState("");
    const [mail, setMail] = useState("");
    const [winner, setWinner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [personas, setPersonas] = useState(0);

    const db = getDatabase();
    
    useEffect(()=>{
        genteParticipando()
    },[]);

    function obtenerPersonaAleatoria() {
        const personasRef = ref(db, '/'); 
      
        onValue(personasRef, (snapshot) => {
            setWinner(false)
            const personas = snapshot.val();
            const keys = Object.keys(personas);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            const personaAleatoria = personas[randomKey];
            setLoading(true)
            setTimeout(()=>{
                showData(personaAleatoria["Nombre"], personaAleatoria["DNI"], personaAleatoria["Email"])
            }, 4000)
        });
    }

    function showData(nombre, dni, email){
        setName(nombre)
        setDni(dni)
        setMail(email)
        setWinner(true)
        setLoading(false)
    }

    function genteParticipando(){
        const personasRef = ref(db, '/'); 
      
        onValue(personasRef, (snapshot) => {
            const personas = snapshot.val();
            const keys = Object.keys(personas);
            setPersonas(keys.length)
          });
    }

    function volver(){
        props.handleSection(0);
    }

  return (
    <div className="sorteo-page">
        <img className="logo" src={logoBlanco} />
        <button className='volver' onClick={volver}> Volver </button>
        <h2 className='title'>El ganador es:</h2>
        <div className="winner-container">
            {loading && <h3 className='loading'>Sorteando...</h3>}
            {winner && <h3 className='ganador'>NOMBRE: {name} <br/>DNI: {dni} <br/>EMAIL: {mail}</h3>}
        </div>
        <div className="button-container">
            <button className='boton-sortear' onClick={obtenerPersonaAleatoria} disabled={loading}>Sortear <img className="random-icon" src={randomIcon}/></button>
            <h4 className='personas'>Hay {personas} personas participando del sorteo</h4>
        </div>
    </div>
  )
}
