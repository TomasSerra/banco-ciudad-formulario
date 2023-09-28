import React, { useEffect, useState } from 'react'
import './SorteoPage.scss'
import logoBlanco from "../../img/logos/logoBlanco.png"
import randomIcon from "../../img/logos/random.png"
import { getDatabase, ref, get, set, onValue, child } from "firebase/database";

export default function SorteoPage(props) {
    const [name, setName] = useState("");
    const [dni, setDni] = useState("");
    const [mail, setMail] = useState("");
    const [winner, setWinner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [personas, setPersonas] = useState(0);
    const [checkWinner, setCheckWinner] = useState(false);
    const [winnerKey, setWinnerKey] = useState("");
    const [success, setSuccess] = useState(false);
    const [checkedWinner, setCheckedWinner] = useState(false);



    const db = getDatabase();
    
    useEffect(()=>{
        genteParticipando()
    },[]);

    function obtenerPersonaAleatoria() {
        const personasRef = ref(db, '/'); 
      
        get(child(personasRef, "/")).then((snapshot) => {
            if(personas != 0){
                setWinner(false)
                setCheckedWinner(false)
                const personasData = snapshot.val();
                const keys = Object.keys(personasData);
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                const personaAleatoria = personasData[randomKey];
                if(personaAleatoria["Ganador"] == "Si"){
                    obtenerPersonaAleatoria()
                }
                else{
                    setLoading(true)
                    setTimeout(()=>{
                        setWinnerKey(randomKey)
                        showData(personaAleatoria["Nombre"], personaAleatoria["DNI"], personaAleatoria["Email"])
                    }, 4000)
                }
            }
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
            var total=0;
            if(personas!=null){
                for(var i=0; i<keys.length; i++){
                    if(personas[keys[i]]["Ganador"] == "No"){
                        total+=1;
                    }
                }
                setPersonas(total);
            }
          });
    }

    function volver(){
        props.handleSection(0);
    }

    function confirmWinner(){
        set(ref(db, winnerKey + "/Ganador"), "Si").then(()=>{
            setCheckWinner(false)
            setSuccess(true)
            setCheckedWinner(true)
            setTimeout(timeOutSuccess, 3000)
        })
    }

    function timeOutSuccess(){
        setSuccess(false)
    }


  return (
    <div className="sorteo-page">
        {checkWinner &&
        <div className='set-winner-warning'>
            <div className='box'>
                <h2>¿Estas seguro que deseas marcar a este cliente como que su premio fue entregado?</h2>
                <div className='button-container'>
                    <button onClick={()=>{confirmWinner()}}>Si</button>
                    <button onClick={()=>{setCheckWinner(false)}}>Cancelar</button>
                </div>
            </div>
        </div>
        }
        {success &&
        <div className='set-success-warning'>
            <div className='box'>
                <h2>¡Cliente marcado como ganador correctamente!</h2>
            </div>
        </div>
        }
        <img className="logo" src={logoBlanco} />
        <button className='volver' onClick={volver}> Volver </button>
        <h2 className='title'>El ganador es:</h2>
        <div className="winner-container">
            {loading && <h3 className='loading'>Sorteando...</h3>}
            {winner && <h3 className='ganador'>NOMBRE: {name} <br/>DNI: {dni} <br/>EMAIL: {mail}</h3>}
        </div>
        {winner &&
        <div className='check-winner'>
            <h4>¿Premio entregado?</h4>
            <input type="checkbox" value={checkWinner} checked={checkedWinner} disabled={checkedWinner} onChange={(e)=>{setCheckWinner(e.target.checked)}}/>
        </div>
        }
        <div className="button-container">
            <button className='boton-sortear' onClick={obtenerPersonaAleatoria} disabled={loading}>Sortear <img className="random-icon" src={randomIcon}/></button>
            <h4 className='personas'>Hay {personas} personas participando del sorteo</h4>
        </div>
    </div>
  )
}
