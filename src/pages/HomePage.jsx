import React from "react";

import "./HomePage.css";
import Pets from "../assets/imgs/banner.png"; 
import  AtencionPersonalizada from "../assets/imgs/atencionFix.png"; 
import HospitalizacionIcon from "../assets/imgs/hospitalizacionFix.png";
import InstalacionesIcon from "../assets/imgs/instalacionesFix.png";
import AmbienteIcon from "../assets/imgs/ambienteFix.png";
import EquipoIcon from "../assets/imgs/equipoFix.png";
import TijerasIcon from "../assets/imgs/peluqueriaFix.png";
import Button from "../components/button/Button.jsx"


const Main = () => {
  return (
    <main className="main">
      {/* Sección Hero */}
      <section className="main__hero">
        <div className="main__hero-text">
          <h1>Cuidando la salud <br /> de tu mascota</h1>
        </div>
        <div className="main__hero-image">
          <img src={Pets} alt="Patas de mascota" />
        </div>
      </section>

     <section className="main__why">
  <h2 className="main__why-title">¿Por qué elegirnos?</h2>
  <div className="main__why-columns"> {/* Contenedor de las dos columnas */}
    <div className="main__why-column"> {/* Primera columna */}
      <div className="main__why-card">
        <img src={AtencionPersonalizada} alt="icono perro con lámpara protectora en el cuello" />
        <div className="main__why-card-content">
          <h3 className="main__why-heading">Atención personalizada</h3>
          <p className="main__why-text">Cada mascota tiene su propio tratamiento</p>
        </div>
      </div>
      <div className="main__why-card">
        <img src={HospitalizacionIcon} alt="icono cama hospital" />
        <div className="main__why-card-content">
          <h3 className="main__why-heading">Hospitalización</h3>
          <p className="main__why-text">Contamos con una sala específica para la hospitalización</p>
        </div>
      </div>
      <div className="main__why-card">
        <img src={InstalacionesIcon} alt="icono edificio hospital" />
        <div className="main__why-card-content">
          <h3 className="main__why-heading">Instalaciones modernas</h3>
          <p className="main__why-text">Contamos con las mejores instalaciones para el cuidado de los animales</p>
        </div>
      </div>
    </div>
    <div className="main__why-column"> {/* Segunda columna */}
      <div className="main__why-card">
        <img src={AmbienteIcon} alt="icono corazón" />
        <div className="main__why-card-content">
          <h3 className="main__why-heading">Ambiente agradable</h3>
          <p className="main__why-text">Para que los animales se sientan cómodos</p>
        </div>
      </div>
      <div className="main__why-card">
        <img src={EquipoIcon} alt="icono profesional medicina" />
        <div className="main__why-card-content">
          <h3 className="main__why-heading">Equipo de confianza</h3>
          <p className="main__why-text">Nuestro equipo está formado por los mejores profesionales</p>
        </div>
      </div>
      <div className="main__why-card">
        <img src={TijerasIcon} alt="icono tijera" />
        <div className="main__why-card-content">
          <h3 className="main__why-heading">Peluquería</h3>
          <p className="main__why-text">También contamos con una zona de peluquería</p>
        </div>
      </div>
    </div>
  </div>
</section>
    </main>
  );
};

export default Main;
