import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import pacientsService from "../../../services/pacients/PacientsService";
import userService from "../../../services/user/UserService";
import { useAuth } from "../../../context/AuthContext";
import "./PatientCreationPage.css";
import SuccessModal from "../../../components/successModal/SuccessModal";


const PatientCreationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.patient) {
      const patient = location.state.patient;
      setIsEditMode(true);
      setValue("identificationNumber", patient.identificationNumber);
      setValue("name", patient.name);
      setValue("image", patient.image);
      setValue("age", patient.age);
      setValue("family", patient.family);
      setValue("breed", patient.breed);
      setValue("sex", patient.sex);
      setValue("tutor", patient.user_id);
    }
  }, [location, setValue]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.roles[0] === "ROLE_ADMIN") {
        try {
          const data = await userService.getUsers();
          setUsers(data);
        } catch (error) {
          console.error("Error cargando usuarios:", error);
        } finally {
          setIsLoadingUsers(false);
        }
      } else {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError("");

    try {
      if (user?.roles[0] !== "ROLE_ADMIN") {
        const userId = localStorage.getItem("userId");
        if (userId) {
          data.tutor = parseInt(userId, 10);
        } else {
          throw new Error("No se pudo determinar el tutor. Inicie sesión.");
        }
      } else {
        data.tutor = parseInt(data.tutor, 10);
      }

      if (isEditMode) {
        await pacientsService.updatePatient(location.state.patient.id_patient, data);
        setSuccessMessage("✅ ¡Paciente actualizado con éxito!"); 
      } else {
        await pacientsService.createPatient(data);
        setSuccessMessage("✅ ¡Paciente creado con éxito!"); 
      }

      setIsSuccessModalOpen(true);

    } catch (error) {
      console.error(`Error en la ${isEditMode ? 'actualización' : 'creación'} del paciente:`, error);
      setSubmitError(error.message || `Error al procesar la ${isEditMode ? 'actualización' : 'creación'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsSuccessModalOpen(false);
    if (user?.roles[0] === "ROLE_ADMIN") {
      navigate("/home-admin");
    } else {
      navigate("/customer-area");
    }
  };

  return (
    <div className="patient-creation-page">
      <div className="patient-creation-page__hero">
        <div className="patient-creation-page__hero-container">
          <h1 className="patient-creation-page__title">
            {isEditMode ? "Formulario de Edición de Paciente" : "Formulario de Creación de Paciente"}
          </h1>
        </div>
      </div>

      <div className="patient-creation-page__container">
        <form className="patient-creation-form" onSubmit={handleSubmit(onSubmit)}>
          {submitError && (
            <div className="patient-creation-form__error patient-creation-form__error--general">
              {submitError}
            </div>
          )}

          <section className="patient-creation-form__section">
            <h2 className="patient-creation-form__section-title">
              Datos del Paciente
            </h2>

            <div className="patient-creation-form__row">
              {/* Número de Identificación */}
              <div className="patient-creation-form__field">
                <label className="patient-creation-form__label">
                  Número de Identificación <span className="patient-creation-form__required">*</span>
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  {...register("identificationNumber", { required: "El número de identificación es obligatorio" })}
                  className={`patient-creation-form__input ${errors.identificationNumber ? "patient-creation-form__input--error" : ""}`}
                />
                {errors.identificationNumber && (
                  <p className="patient-creation-form__error">{errors.identificationNumber.message}</p>
                )}
              </div>

              {/* Nombre */}
              <div className="patient-creation-form__field">
                <label className="patient-creation-form__label">
                  Nombre <span className="patient-creation-form__required">*</span>
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  {...register("name", { required: "El nombre es obligatorio" })}
                  className={`patient-creation-form__input ${errors.name ? "patient-creation-form__input--error" : ""}`}
                />
                {errors.name && <p className="patient-creation-form__error">{errors.name.message}</p>}
              </div>

              {/* Imagen */}
              <div className="patient-creation-form__field">
                <label className="patient-creation-form__label">Imagen (URL)</label>
                <input
                  type="text"
                  disabled={isLoading}
                  {...register("image")}
                  className="patient-creation-form__input"
                />
              </div>

              {/* Edad */}
              <div className="patient-creation-form__field">
                <label className="patient-creation-form__label">
                  Edad <span className="patient-creation-form__required">*</span>
                </label>
                <input
                  type="number"
                  disabled={isLoading}
                  {...register("age", { required: "La edad es obligatoria", valueAsNumber: true })}
                  className={`patient-creation-form__input ${errors.age ? "patient-creation-form__input--error" : ""}`}
                />
                {errors.age && <p className="patient-creation-form__error">{errors.age.message}</p>}
              </div>

              {/* Familia */}
              <div className="patient-creation-form__field">
                <label className="patient-creation-form__label">
                  Familia <span className="patient-creation-form__required">*</span>
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  {...register("family", { required: "La familia es obligatoria" })}
                  className={`patient-creation-form__input ${errors.family ? "patient-creation-form__input--error" : ""}`}
                />
                {errors.family && <p className="patient-creation-form__error">{errors.family.message}</p>}
              </div>

              {/* Raza */}
              <div className="patient-creation-form__field">
                <label className="patient-creation-form__label">
                  Raza <span className="patient-creation-form__required">*</span>
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  {...register("breed", { required: "La raza es obligatoria" })}
                  className={`patient-creation-form__input ${errors.breed ? "patient-creation-form__input--error" : ""}`}
                />
                {errors.breed && <p className="patient-creation-form__error">{errors.breed.message}</p>}
              </div>

              {/* Sexo */}
              <div className="patient-creation-form__field">
                <label className="patient-creation-form__label">
                  Sexo <span className="patient-creation-form__required">*</span>
                </label>
                <select
                  disabled={isLoading}
                  {...register("sex", { required: "El sexo es obligatorio" })}
                  className={`patient-creation-form__input ${errors.sex ? "patient-creation-form__input--error" : ""}`}
                >
                  <option value="">Seleccione...</option>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
                {errors.sex && <p className="patient-creation-form__error">{errors.sex.message}</p>}
              </div>

              {/* Tutor dinámico */}
              {user?.roles[0] === "ROLE_ADMIN" ? (
                <div className="patient-creation-form__field">
                  <label className="patient-creation-form__label">
                    Tutor <span className="patient-creation-form__required">*</span>
                  </label>

                  {isLoadingUsers ? (
                    <p>Cargando tutores...</p>
                  ) : (
                    <select
                      disabled={isLoading || isLoadingUsers}
                      {...register("tutor", { required: "El tutor es obligatorio" })}
                      className={`patient-creation-form__input ${errors.tutor ? "patient-creation-form__input--error" : ""}`}
                    >
                      <option value="">Seleccione un tutor...</option>
                      {users.map((u) => (
                        <option key={u.id_user} value={u.id_user}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.tutor && <p className="patient-creation-form__error">{errors.tutor.message}</p>}
                </div>
              ) : (
                <div className="patient-creation-form__field">
                  <label className="patient-creation-form__label">Tutor asignado</label>
                  <input
                    type="text"
                    value={user?.name || "Usuario actual"}
                    disabled
                    className="patient-creation-form__input"
                  />
                </div>
              )}
            </div>
          </section>

          <div className="patient-creation-form__submit">
            <button
              type="submit"
              disabled={isLoading}
              className={`patient-creation-form__button ${isLoading ? "patient-creation-form__button--loading" : ""}`}
            >
              {isLoading ? (isEditMode ? "Actualizando..." : "Creando...") : (isEditMode ? "Actualizar Paciente" : "Crear Paciente")}
            </button>
          </div>
        </form>
      </div>

      {isSuccessModalOpen && (
        <SuccessModal
          title={successMessage}
          message="Haz click para volver a la página de gestión"
          onClose={handleModalClose}
          buttonText="Cerrar"
        />
      )}
    </div>
  );
};

export default PatientCreationPage;
