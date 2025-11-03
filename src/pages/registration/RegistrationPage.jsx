import React, { useState, useEffect } from 'react';
import Hero from '../../components/hero/Hero';
import { useForm } from 'react-hook-form';
import userService from '../../services/user/UserService';
import registerService from '../../services/register/RegisterService';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../components/successModal/SuccessModal';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [userId, setUserId] = useState(null);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      if (isEditMode && userId) {
        const result = await userService.updateUser(userId, data);
        if (result) {
          setSuccessMessage("✅ Usuario actualizado con éxito");
          setIsSuccessModalOpen(true);
        }
      } else {
        const result = await registerService.registerUser(data);
        if (result.success && result.status === 201) {
          setSuccessMessage("✅ Registro realizado con éxito");
          setIsSuccessModalOpen(true);
        }
      }
    } catch (error) {
      console.error('Error en el registro/edición:', error);
      setSubmitError(error.message || 'Error al procesar el registro/edición');
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
 
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setIsEditMode(true);
      setUserId(storedUserId);
  
      const fetchUser = async () => {
        try {
          const userData = await userService.getUserById(storedUserId);

          setValue('name', userData.name || '');
          setValue('firstSurname', userData.firstSurname || '');
          setValue('secondSurname', userData.secondSurname || '');
          setValue('dni', userData.dni || '');
          setValue('phoneNumber', userData.phoneNumber || '');
          setValue('email', userData.email || '');
        
        } catch (error) {
          console.error('Error cargando datos de usuario:', error);
        }
      };
      fetchUser();
    }
  }, [setValue]);


  const watchPassword = watch("password");

  return (
    <div className="registration-page">
      {/* Hero Section */}
      <Hero text="Formulario de registro"></Hero>

      {/* Form Section */}
      <div className="registration-page__container">
        <form className="registration-form" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Error general del submit */}
          {submitError && (
            <div className="registration-form__error registration-form__error--general">
              {submitError}
            </div>
          )}

          {/* Datos personales */}
          <section className="registration-form__section">
            <h2 className="registration-form__section-title">
              Datos personales
            </h2>
            
            <div className="registration-form__row">
              <div className="registration-form__field">
                <label className="registration-form__label">
                  Nombre <span className="registration-form__required">*</span>
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  {...register('name', { required: 'El nombre es obligatorio' })}
                  className={`registration-form__input ${
                    errors.name ? 'registration-form__input--error' : ''
                  }`}
                />
                {errors.name && (
                  <p className="registration-form__error">{errors.name.message}</p>
                )}
              </div>
              
              <div className="registration-form__field">
                <label className="registration-form__label">
                  Primer apellido <span className="registration-form__required">*</span>
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  {...register('firstSurname', { required: 'El primer apellido es obligatorio' })}
                  className={`registration-form__input ${
                    errors.firstSurname ? 'registration-form__input--error' : ''
                  }`}
                />
                {errors.firstSurname && (
                  <p className="registration-form__error">{errors.firstSurname.message}</p>
                )}
              </div>
              <div className="registration-form__field">
                <label className="registration-form__label">
                  Segundo apellido
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  {...register('secondSurname')}
                  className={`registration-form__input ${
                    errors.secondSurname ? 'registration-form__input--error' : ''
                  }`}
                />
                {errors.secondSurname && (
                  <p className="registration-form__error">{errors.secondSurname.message}</p>
                )}
              </div>
              <div className="registration-form__field">
                <label className="registration-form__label">
                  DNI <span className="registration-form__required">*</span>
                </label>
                <input
                    type="text"
                    disabled={isLoading}
                    {...register('dni', { 
                        required: 'El DNI es obligatorio',
                        pattern: {
                            value: /^[0-9]{8}[A-Za-z]$/, 
                            message: 'El DNI debe tener 8 números y una letra'
                        }
                    })}
                    className={`registration-form__input ${errors.dni ? 'registration-form__input--error' : ''}`}
                />
                {errors.dni && (
                  <p className="registration-form__error">{errors.dni.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section className="registration-form__section">
            <h2 className="registration-form__section-title">
              Contacto
            </h2>
            
            <div className="registration-form__row">
              <div className="registration-form__field">
                <label className="registration-form__label">
                  Teléfono <span className="registration-form__required">*</span>
                </label>
                <input
                  type="tel"
                  disabled={isLoading}
                  {...register('phoneNumber', {
                    required: 'El número de teléfono es obligatorio',
                    pattern: {
                      value: /^\d{9}$/,
                      message: 'El teléfono debe tener 9 dígitos'
                    }
                  })}
                  className={`registration-form__input ${
                    errors.phoneNumber ? 'registration-form__input--error' : ''
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="registration-form__error">{errors.phoneNumber.message}</p>
                )}
              </div>
              
              <div className="registration-form__field">
                <label className="registration-form__label">
                  Email <span className="registration-form__required">*</span>
                </label>
                <input
                  type="email"
                  disabled={isLoading}
                  {...register('email', { 
                    required: 'El email es obligatorio',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Email no válido'
                    }
                  })}
                  className={`registration-form__input ${
                    errors.email ? 'registration-form__input--error' : ''
                  }`}
                />
                {errors.email && (
                  <p className="registration-form__error">{errors.email.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Inicio de sesión */}
          <section className="registration-form__section">
            <h2 className="registration-form__section-title">
              Inicio de sesión
            </h2>
            
            <div className="registration-form__row">
              <div className="registration-form__field">
                <label className="registration-form__label">
                  Contraseña <span className="registration-form__required">*</span>
                </label>
                <input
                  type="password"
                  disabled={isLoading}
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: {
                      value: 8,
                      message: 'Mínimo 8 caracteres'
                    },
                    validate: {
                      hasUpperCase: (value) => /[A-Z]/.test(value) || 'Falta mayúscula',
                      hasLowerCase: (value) => /[a-z]/.test(value) || 'Falta minúscula', 
                      hasNumber: (value) => /\d/.test(value) || 'Falta número',
                      hasSymbol: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Falta símbolo'
                    }
                  })}
                  className={`registration-form__input ${
                    errors.password ? 'registration-form__input--error' : ''
                  }`}
                />
                {errors.password && (
                  <p className="registration-form__error">
                    {errors.password.message}
                  </p>
                )}
              </div>
              
              <div className="registration-form__field">
                <label className="registration-form__label">
                  Repite tu contraseña <span className="registration-form__required">*</span>
                </label>
                <input
                  type="password"
                  disabled={isLoading}
                  {...register('repeatPassword', {
                    required: 'Repetir contraseña es obligatorio',
                    validate: value => value === watchPassword || 'Las contraseñas no coinciden'
                  })}
                  className={`registration-form__input ${
                    errors.repeatPassword ? 'registration-form__input--error' : ''
                  }`}
                />
                {errors.repeatPassword && (
                  <p className="registration-form__error">{errors.repeatPassword.message}</p>
                )}
              </div>
            </div>
          </section>
          {isSuccessModalOpen && (
            <SuccessModal
              title={isEditMode ? "✅ Usuario actualizado con éxito" : "✅ Registro realizado con éxito"}
              message={isEditMode ? "Tus datos han sido actualizados correctamente." : "Tu registro ha sido realizado correctamente."}
              buttonText={isEditMode ? "Ir a mi área" : "Ir a inicio"}
              onClose={() => {
                setIsSuccessModalOpen(false);
                navigate(isEditMode ? "/customer-area" : "/");
              }}
            />
          )}

          {/* Submit Button */}
          <div className="registration-form__submit">
            <button
              type="submit"
              disabled={isLoading}
              className={`registration-form__button ${isLoading ? 'registration-form__button--loading' : ''}`}
            >
              {isLoading
                ? (isEditMode ? 'Actualizando...' : 'Registrando...')
                : (isEditMode ? 'Actualizar usuario' : 'Registrarse')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;