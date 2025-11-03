import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import './LoginModal.css';
import { Link } from 'react-router-dom';



const LoginModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      await login(data.email, data.password);
      reset();
      onClose();
    } catch (error) {
      console.error('Error en el login:', error);
      setSubmitError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal__overlay" onClick={handleOverlayClick}>
      <div className="login-modal">
        <button
          className="login-modal__close"
          onClick={onClose}
          type="button"
          aria-label="Cerrar modal"
        >
          ×
        </button>

        <div className="login-modal__header">
          <div className="login-modal__logo">
          </div>
        </div>

        <h2 className="login-modal__title">Iniciar sesión</h2>

        <form className="login-modal__form" onSubmit={handleSubmit(onSubmit)}>
          {submitError && (
            <div className="login-modal__error login-modal__error--general">
              {submitError}
            </div>
          )}

          <div className="login-modal__field">
            <label className="login-modal__label">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tunombre@gmail.com"
              disabled={isLoading}
              {...register('email', {
                required: 'El email es obligatorio',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Email no válido',
                },
              })}
              className={`login-modal__input ${
                errors.email ? 'login-modal__input--error' : ''
              }`}
            />
            {errors.email && (
              <p className="login-modal__error">{errors.email.message}</p>
            )}
          </div>

          <div className="login-modal__field">
            <label className="login-modal__label">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="**********"
              disabled={isLoading}
              {...register('password', {
                required: 'La contraseña es obligatoria',
              })}
              className={`login-modal__input ${
                errors.password ? 'login-modal__input--error' : ''
              }`}
            />
            {errors.password && (
              <p className="login-modal__error">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`login-modal__button ${
              isLoading ? 'login-modal__button--loading' : ''
            }`}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <div className="login-modal__footer">
            <span className="login-modal__footer-text">¿No tienes una cuenta?</span>
            <Link to="/register" className="login-modal__footer-link" onClick={onClose}>
              Crea una cuenta nueva
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;