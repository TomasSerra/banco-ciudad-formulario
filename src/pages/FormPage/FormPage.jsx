import React, { useState, useEffect } from 'react'
import './FormPage.scss'
import logoBlanco from "../../img/logos/logoBlanco.png"
import uploadIcon from "../../img/logos/cloud.png"
import { getDatabase, ref, child, push, update } from "firebase/database";


export default function FormPage(props) {

  //Declaración de los valores del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cel, setCel] = useState("");
  const [dni, setDni] = useState("");
  const [prov, setProv] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [newsCaja, setNewscaja] = useState(false);
  const [newsTarjeta, setNewstarjeta] = useState(false);
  const [newsPrestamo, setNewsprestamo] = useState(false);
  const [newsOtro, setNewsotro] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [uploadText, setUploadText] = useState("");
  const [color, setColor] = useState({});
  const [pend, setPend] = useState(0);
  const [pass, setPass] = useState("");
  const [open, setOpen] = useState(false);

  let warningRed = "rgb(119, 9, 9)"
  let successGreen = "rgba(167, 242, 162)"
  const password = "Bancociudad2023"
  
  //Lista de provincias 
  const provincias = ['Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Cordoba', 'Corrientes', 'Entre Rios', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquen', 'Rio Negro', 'Salta', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego']

  const db = getDatabase();

  function validEmail(email) {
    return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email) ? true : false
  }

  function submit(){
    if(name === "" || prov === "" || localidad === "" || email === "" || dni === "" || cel === ""){
      setError(true)
      setErrorText("Por favor completá todos los datos")
    }
    else if(!validEmail(email)){
      setError(true)
      setErrorText("El email ingresado no es válido")
    }
    else{
      const obj = {
        "Nombre": name,
        "DNI": dni,
        "Celular": cel,
        "Email" : email,
        "Provincia" : prov,
        "Localidad" : localidad,
        "Ganador" : "No",
        "Informacion" : {
          "Caja de ahorro": newsCaja ? "Si" : "No",
          "Tarjeta de credito": newsTarjeta ? "Si" : "No",
          "Prestamos personales": newsPrestamo ? "Si" : "No",
          "Otro": newsOtro ? "Si" : "No"
        }
      }
      const prevData = localStorage.getItem("data") ? localStorage.getItem("data"):""
      localStorage.setItem("data", prevData+"$"+JSON.stringify(obj))
      setSuccess(true)
      deleteData()
    }
  }
  
  let timerId = ""
  function timeout(){
    return new Promise(resolve => {
      timerId = setTimeout(() => {
        setUploadText("Ocurrio un error, intentá de nuevo")
        setColor({color : warningRed})
      }, 5000)
    })
  }

  function deleteData(){
    setName("")
    setCel("")
    setDni("")
    setEmail("")
    setLocalidad("")
    setNewscaja(false)
    setNewsotro(false)
    setNewsprestamo(false)
    setNewstarjeta(false)
    setProv("")
  }

  function pushFb(postData, currentDate){
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const newPostKey = push(child(ref(db, day+"-"+month+"-"+year), 'posts')).key;
    const updates = {};
    updates[day+"-"+month+"-"+year +"/"+newPostKey] = postData;
    update(ref(db), updates).then(()=>{
      localStorage.clear();
      setUploadText("¡Datos subidos con exito!")
      setColor({color : successGreen})
      setPend(0)
      clearTimeout(timerId)
    })
  }

  async function fbButton(){
    if(pass === password){
        if(localStorage.getItem("data") != null){ //Comprueba datos vacios
          if(navigator.onLine){
            const data = localStorage.getItem("data").split("$").slice(1);
            var currentDate = new Date();
            data.forEach(obj=>{
              pushFb(JSON.parse(obj), currentDate);
            })
            setUploadText("Subiendo datos...")
            setColor({color: "white"})
            await timeout()
          }
          else{
            setUploadText("No estas conectado a una red WiFi")
            setColor({color: warningRed})
          }
        }
        else{
          setUploadText("No hay datos para subir")
          setColor({color: warningRed})
        }  
    }
    else{
      setUploadText("Contraseña incorrecta")
      setColor({color: warningRed})
    }
  }

  let timeoutId;
  let clics = 0;

  function secretButton(){
    clics += 1;
    timeoutId = setTimeout(()=>{
      clics = 0
    }, 1000);
    if(clics >= 2){
      clics = 0
      clearTimeout(timeoutId);
      closeOpenUpload();
    }
  }

  function closeOpenUpload(){
    setUploadText("");
    setPass("");
    open ? setOpen(false) : setOpen(true);
    const data = localStorage.getItem("data") ? localStorage.getItem("data").split("$").slice(1) : "" ;
    setPend(data.length);
  }

  function sorteo(){
    if(pass === password){
      props.handleSection(1);
    }
    else{
      setUploadText("Contraseña incorrecta")
      setColor({color: warningRed})
    }
  }
  
  return (
    <div className='form-page'>
      <center>
        {error &&
        <div id='error'>
          <div className='box'>
            <h3 id="errorText">{errorText}</h3>
            <button onClick={()=>{setError(false)}}>CERRAR</button>
          </div>
        </div>
        }
        {success &&
        <div id='success'>
          <div className='box'>
            <h3 id="successText">Datos cargados con exito<br/>¡Muchas gracias!</h3>
            <button onClick={()=>{setSuccess(false)}}>CERRAR</button>
          </div>
        </div>
        }
        {open &&
        <div id='subir'>
          <div className='box'>
            <center>
              <button onClick={closeOpenUpload} className="close">Salir</button>
              <label htmlFor='password'>Contraseña</label>
              <input type="text" id="password" name="password" autoComplete="off" value={pass} onChange={(e)=>{setPass(e.target.value)}}/>
              <h2 id="dataNum">Hay {pend} datos a subir</h2>
              <button onClick={fbButton} className="upload">SUBIR DATOS</button>
              <button onClick={sorteo} className="upload">IR A SORTEAR</button>
              <h1 id="textUpload" style={color}>{uploadText}</h1>
            </center>
          </div>
        </div>
        } 
        <button onClick={closeOpenUpload} className="hidenButton"><img src={uploadIcon}/></button>

        <div>
          <img className="logo" src={logoBlanco} alt="logo blanco" />
        </div>
        <div className='table-container'>
          <div className='col'>
            <div className="cont">
              <label htmlFor='name'>Nombre y apellido</label>
              <input type="text" id="name" name="name" value={name} autoComplete="off" onChange={(e)=>{setName(e.target.value)}} />
            </div>
            <div className='cont'>
              <label>DNI</label>
              <input type="number" id="dni" value={dni} autoComplete="off" onChange={(e)=>{setDni(e.target.value)}} />
            </div>
            <div className="cont">
              <label htmlFor='provincia'>Provincia</label>
              <select id="provincia" name="provincia" value={prov} onChange={(e)=>{setProv(e.target.value)}}>
                <option value="" disabled selected>Selecciona una provincia</option>
                {
                  provincias.map((provincia) => {
                    return <option key={provincias.indexOf(provincia)} value={provincia}>{provincia}</option>
                  })
                }
              </select>
            </div>
          </div>
          
          <div className='col'>
            <div className='cont'>
              <label>Email</label>
              <input type="email" id="email" value={email} autoComplete="off" onChange={(e)=>{setEmail(e.target.value)}} />
            </div>
            <div className='cont'>
              <label>Celular</label>
              <input type="number" id="cel" value={cel} autoComplete="off" onChange={(e)=>{setCel(e.target.value)}} />
            </div>
            <div className='cont'>
              <label>Localidad</label>
              <input type="text" name="localidad" id="localidad" value={localidad} autoComplete="off" onChange={(e)=>{setLocalidad(e.target.value)}}/>
            </div>
          </div>
        </div>
        <div className="newsletter">
          <h2>¿Deseas recibir información de algún producto?</h2>
          <div className="options-container">
            <div className='option'>
              <h4>Caja de ahorros</h4>
              <input type="checkbox" value={newsCaja} checked={newsCaja} onChange={(e)=>{setNewscaja(e.target.checked)}}/>
            </div>
            <div className='option'>
              <h4>Tarjeta de crédito</h4>
              <input type="checkbox" value={newsTarjeta} checked={newsTarjeta} onChange={(e)=>{setNewstarjeta(e.target.checked)}}/>
            </div>
            <div className='option'>
              <h4>Préstamos personales</h4>
              <input type="checkbox" value={newsPrestamo} checked={newsPrestamo} onChange={(e)=>{setNewsprestamo(e.target.checked)}}/>
            </div>
            <div className='option'>
              <h4>Otro</h4>
              <input type="checkbox" value={newsOtro}  checked={newsOtro} onChange={(e)=>{setNewsotro(e.target.checked)}}/>
            </div>
          </div>
        </div>
        <div className='sendButton'>
          <button onClick={submit} className="enviar">ENVIAR</button>
        </div>
      </center>
    </div>
  )
}

/*             <div className="cont">
              <div className='newsletter'>
              <h2>¿Deseas recibir newsletters?</h2>
              <input type="checkbox" id="newsletter" value={news} onChange={(e)=>{setNews(e.target.checked)}}></input>
              </div>
            </div>*/
