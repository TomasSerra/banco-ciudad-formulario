import React, { useEffect, useState } from 'react'
import './Roulette.scss'

export default function Roulette(props) {
    const colors = ["#FEA700", "#C35AF4", "#F04B1D", "#B3E544", "#10A2ED", "#0DB06D", "#E4D729", "#E93A7B"]
    const rel = window.innerWidth/window.innerHeight;
    const size = props.size[props.size.length-1] === '%' ? ((Number(props.size.replace("%", ""))/100) * (rel>=1 ? window.innerHeight : window.innerWidth)) : (Number(props.size.replace("p", "").replace("x", "")))
    const num = props.elements.length;

    const triangleAngle = 360/num; //Angle in degrees
    const triangleLength = Math.tan(Math.PI/num)*size/2;
    const triangle = (color) =>{
        let styles = {
            borderTop: triangleLength+5 + "px solid transparent",
            borderBottom: triangleLength+5 + "px solid transparent",
            borderRight: size/2 + "px solid "+color
        }
        return styles
    } 
    const centerStyles = {
        'center': {
            width: size*0.2,
            height: size*0.2
        },
        'triangle':{
            borderTop: size*0.06 + 'px solid transparent',
            borderBottom: size*0.06 + 'px solid transparent',
            borderLeft: size*0.12 + 'px solid #005cb2',
            left: size*0.16 + 'px'
        }        
    }

    const [index, setIndex] = useState(-1);
    
    function rotate(){
        const position = Math.random()*(num-0.5)
        const angle = position*(360/num)
        function ended(element){
            element.style.rotate = props.turns*360+angle+'deg'
            props.handleIndex(Math.round(position))
            setTimeout(()=>{
                setIndex(Math.round(position))
            }, props.time*1000)
            
        }
        document.querySelector("#wheel").animate([
            { rotate: 0+'deg' },
            { rotate: props.turns*360+angle+'deg' }
            ], {
            duration: props.time*1000,
            easing: 'ease-out',
            iterations: 1,
            complete: ended(document.querySelector("#wheel"))
            }
        );        
    }
        
    return (
        <>
            <button className='center' style={centerStyles.center} onClick={() =>{rotate()}}>
                <img src={props.logo} alt="" />
                <div className='line' style={centerStyles.triangle}></div>
            </button>
            <div className='shadow' style={{width : (size-20)+"px", height: (size-20)+"px"}}></div>
            <div className='container' style={{width : size, height: size, borderWidth: size*0.06}}></div>
            <div style={{width : size, height: size}} id="wheel" onTouchEnd={rotate}>
                {props.elements.map(element => {
                    const aux = props.elements.indexOf(element, 0)
                    return(
                        <div key={aux} className='roulette' style={{width : size, height: size, transform : "rotate("+(360-triangleAngle*aux)+"deg)"}}>
                            <div className={'triangle ' + (aux===index ? 'selected' : '')} style={triangle(colors[aux])}></div>
                            <h1 style={{right: element.length >= 8 ? '8%' : '13%', fontSize: size*0.065 + 'px'}}>{element}</h1>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
