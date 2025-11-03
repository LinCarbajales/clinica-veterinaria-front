import React, { useState } from "react";
import logo from "../../assets/logos/MargaritaLogo.png";
import "./Header.css";
import LoginModal from "../login_modal/LoginModal";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const handleAreaClick = () => {
    if (user?.roles[0] === "ROLE_ADMIN") {
      navigate("/home-admin");
    } else {
      navigate("/customer-area");
    }
  };


  const areaText =
    user?.roles?.includes("ROLE_ADMIN") ? "Zona Admin" : "Área personal";

  return (
    <>
      <header className="header">
        <div className="header__logo">
          <Link to="/">
            <img
              src={logo}
              alt="Logo Margarita"
              className="header__logo-image"
            />
          </Link>
        </div>

        <nav className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}>
          <ul className="header__list">
            <li className="header__item">
              <Link to="/" className="header__link">
                Inicio
              </Link>
            </li>
            <li className="header__item">
              <Link to="/quienes-somos" className="header__link">
                Quiénes Somos
              </Link>
            </li>
            <li className="header__item">
              <Link to="/servicios" className="header__link">
                Servicios
              </Link>
            </li>
            <li className="header__item">
              <Link to="/contacto" className="header__link">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header__login">
          {isAuthenticated ? (
            <div className="header__user-menu">
              <span className="header__user-greeting">
                Hola, <strong>{user?.name || "Usuario"}</strong>
              </span>
              <div className="header__user-options">
                <button
                  onClick={handleAreaClick}
                  className="header__user-link header__user-link--button"
                >
                  {areaText}
                </button>
                <span>|</span>
                <button
                  onClick={logout}
                  className="header__user-link header__user-link--logout"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="header__auth-options">
              <button onClick={openLoginModal} className="header__auth-link">
                Iniciar sesión
              </button>
              <span className="header__auth-separator">|</span>
              <Link to="/register" className="header__auth-link">
                Registrarse
              </Link>
            </div>
          )}
        </div>

        <button
          className="header__toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </header>

      {!isAuthenticated && (
        <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      )}
    </>
  );
};

export default Header;