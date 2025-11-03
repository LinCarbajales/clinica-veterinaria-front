import React from 'react';
import Hero from '../../components/hero/Hero';
import Button from '../../components/button/Button';
import "./WhoWeAre.css"
import Card from '../../components/card/Card';
import Margarita from "../../assets/imgs/margarita.png"

const WhoWeAre = () => {

  return (
    <>
      <Hero text='¿Quienes somos?' />
      <div className='margarita-container'>
      <Card imagen={Margarita} title='Margarita' text='Margarita Gómez es una DOGTORA reconocida en la asociación veterinaria internacional de Mónaco.'></Card>
      </div>
      

    </>
  )
}

export default WhoWeAre;