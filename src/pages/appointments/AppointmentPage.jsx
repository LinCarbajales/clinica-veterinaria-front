import React, { useState, useEffect } from "react";
import appointmentsService from "../../services/appointments/AppointmentsService";
import pacientsService from '../../services/pacients/PacientsService';
import { useAuth } from "../../context/AuthContext";
import "./AppointmentPage.css";
import { useNavigate, useLocation } from "react-router-dom";


import SuccessModal from "../../components/successModal/SuccessModal";

const AppointmentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const editAppointment = location.state?.appointment || null;
  const isEditMode = !!editAppointment;

  const [isUrgent, setIsUrgent] = useState(editAppointment ? editAppointment.type : false);
  const [reason, setReason] = useState(editAppointment ? editAppointment.reason : "");
  const [date, setDate] = useState("");
  const [patientId, setPatientId] = useState(editAppointment ? String(editAppointment.patientId) : "");
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialDate = editAppointment ? new Date(editAppointment.appointmentDatetime).getDate() : null;
  const initialTime = editAppointment ? new Date(editAppointment.appointmentDatetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : "";
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(initialTime);

  const times = ["09:00", "09:30", "10:00", "10:35", "11:00", "11:30", "12:00", "12:30", "16:30", "18:00"];


  useEffect(() => {
    const fetchPets = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("No se ha encontrado el ID del usuario. Inicia sesión nuevamente.");
          return;
        }

        const petsData = await pacientsService.getPatientsByUserId(userId);
        setPets(petsData);

        if (petsData.length > 0) {
          setPatientId(petsData[0].id_patient);
        }
      } catch (err) {
        console.error("Error al cargar mascotas del usuario:", err);
        setError("Error al cargar tus mascotas. Inténtalo más tarde.");
      }
    };

    fetchPets();
  
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      setError("Debes iniciar sesión para crear una cita.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError("Por favor, selecciona una fecha y hora.");
      return;
    }

    if (!patientId) {
      setError("Debes seleccionar una mascota.");
      return;
    }

    const day = String(selectedDate).padStart(2, "0");
    const month = "09";
    const year = "2025";
    const appointmentDatetime = `${year}-${month}-${day}T${selectedTime}:00`;

    const appointmentData = {
      appointmentDatetime,
      type: isUrgent,
      reason,
      status: "PENDIENTE",
      patientId: parseInt(patientId, 10),
      userId: parseInt(localStorage.getItem("userId"), 10),
    };

    try {
      if (isEditMode) {
        await appointmentsService.updateAppointment(editAppointment.id_appointment, appointmentData);
      } else {
        await appointmentsService.createAppointment(appointmentData);
      }
      setIsModalOpen(true);
    } catch (error) {
      setError(isEditMode ? "Error al actualizar la cita. Por favor, inténtelo de nuevo." : "Error al crear la cita. Por favor, inténtelo de nuevo.");
      console.error(isEditMode ? "Error al actualizar la cita:" : "Error al crear la cita:", error);
    }
    console.log("Cita a enviar:", appointmentData);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/customer-area"); 
  };

  return (
    <div className="appointments">
  <h1 className="appointments__title">{isEditMode ? "Editar cita" : "Sistema de Gestión de Citas Online"}</h1>

      <div className="appointments__container">
        <div className="appointments__instructions">
          <h2 className="appointments__instructions-title">¿Cómo funciona?</h2>
          <ol className="appointments__instructions-list">
            <li>Rellena los datos del formulario.</li>
            <li>Elige una fecha y hora.</li>
            <li>Confirma tu cita.</li>
          </ol>
        </div>

        <form className="appointments__form" onSubmit={handleSubmit}>
          <div className="appointments__form-row">
            <input
              className="appointments__input"
              type="text"
              placeholder="Motivo (Ej: Vacunación anual)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="appointments__form-row">
            <label>Selecciona tu mascota:</label>
            <select
              className="appointments__input"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              <option value="">-- Selecciona una mascota --</option>
              {pets.map((pet) => (
                <option key={pet.id_patient} value={pet.id_patient}>
                  {pet.name} (ID: {pet.id_patient})
                </option>
              ))}
            </select>
          </div>

          <div className="appointments__form-row">
            <label className="appointments__checkbox-label">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
              />
              ¿Es urgente?
            </label>
          </div>

          <div className="appointments__calendar">
            <h3>Septiembre 2025</h3>
            <div className="appointments__calendar-days">
              {[...Array(30)].map((_, i) => (
                <button
                  key={i + 1}
                  type="button"
                  className={`appointments__day ${
                    selectedDate === i + 1 ? "appointments__day--selected" : ""
                  }`}
                  onClick={() => setSelectedDate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="appointments__times">
            {times.map((time) => (
              <button
                key={time}
                type="button"
                className={`appointments__time ${
                  selectedTime === time ? "appointments__time--selected" : ""
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>

          <button type="submit" className="appointments__submit">
            {isEditMode ? "Actualizar cita" : "Confirmar cita"}
          </button>

          {error && <p className="appointments__error">{error}</p>}
        </form>
      </div>

      {isModalOpen && (
        <SuccessModal
          title={isEditMode ? "✅ Cita actualizada con éxito" : "✅ Cita creada con éxito"}
          message={isEditMode ? "Tu cita ha sido actualizada correctamente." : "Tu cita ha sido registrada correctamente."}
          buttonText="Ir a mi área"
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;