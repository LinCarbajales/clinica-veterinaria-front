import React, { useState, useEffect } from 'react';
import './CustomerArea.css';
// import { useAuth } from '../../context/AuthContext';
import pacientsService from '../../services/pacients/PacientsService';
import appointmentsService from '../../services/appointments/AppointmentsService';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../../components/hero/Hero';
import Button from '../../components/button/Button';
import SuccessModal from '../../components/successModal/SuccessModal';
import DecisionModal from '../../components/decisionModal/DecisionModal';



const CustomerArea = () => {
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); 
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetsAndAppointments = async () => {
      setError(null);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No se encontró el userId en localStorage");
          setError("Error: usuario no autenticado");
          return;
        }
        const userPets = await pacientsService.getPatientsByUserId(userId);
        setPets(userPets);
        const myAppointments = await appointmentsService.getMyAppointments(userId);
        setAppointments(myAppointments);
        // Siempre obtener datos actualizados del backend
        const userServiceModule = await import('../../services/user/UserService');
        const updatedUser = await userServiceModule.default.getUserById(userId);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserDetails(updatedUser);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        setError("No se pudieron cargar tus datos. Inténtalo nuevamente.");
      }
    };
    fetchPetsAndAppointments();
    // Escuchar cambios en la url para recargar datos tras edición
    const handleFocus = () => {
      fetchPetsAndAppointments();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // ✅ Eliminar cita
  const handleDeleteAppointment = async () => {
    if (!selectedAppointmentId) return;

    try {
      await appointmentsService.deleteAppointment(selectedAppointmentId);

      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id_appointment !== selectedAppointmentId)
      );

      setIsConfirmModalOpen(false);
      setSuccessMessage("✅ Cita anulada con éxito");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
      setError("❌ No se pudo anular la cita.");
      setIsConfirmModalOpen(false);
    }
  };

  const handleOpenConfirmModal = (id) => {
    setSelectedAppointmentId(id);
    setIsConfirmModalOpen(true);
  };

  const handleModalClose = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      <Hero text="Área personal" />
      <div className="customer-area">
        <div className="customer-content">
          {/* Columna izquierda: usuario y mascotas */}
          <div>
            <div className="user-details-section">
              <h2 className="user-details-title">Datos del usuario</h2>
              <div style={{ marginBottom: '1rem' }}>
                <Link to="/register">
                  <Button text="Editar mis datos" type="primary" />
                </Link>
              </div>
              {userDetails ? (
                <ul className="user-details-list">
                  {[
                    { label: "Email", key: "email" },
                    { label: "DNI", key: "dni" },
                    { label: "Nombre", key: "name" },
                    { label: "Primer Apellido", key: "firstSurname" },
                    { label: "Segundo Apellido", key: "secondSurname" },
                    { label: "Teléfono", key: "phoneNumber" },
                  ].map(field => (
                    <li key={field.key} className="user-details-item">
                      <span className="user-details-label">{field.label}:</span>
                      <span className="user-details-value">{userDetails[field.key]}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="user-details-empty">No se encontraron datos del usuario.</p>
              )}
            </div>
            <section className="pets-section">
              <div className="section-header">
                <h2>Mis mascotas</h2>
              </div>
              {pets.length === 0 ? (
                <div className="empty-state">
                  <p>No tienes mascotas registradas</p>
                  <Link to="/crear-paciente" className="btn-primary">
                    Añadir nueva mascota
                  </Link>
                </div>
              ) : (
                <div className="pets-grid">
                  {pets.map((pet) => (
                    <div key={pet.id_patient} className="pet-card">
                      <h3 className="pet-name">{pet.name}</h3>
                      <img src={pet.image} alt="Mascota" className="pet-image" />
                      <div className="btn-container">
                        <Link
                          to={`/detallePaciente/${pet.id_patient}`}
                          className="btn-secondary"
                        >
                          Ver ficha
                        </Link>
                      </div>
                    </div>
                  ))}
                  <Link to="/crear-paciente" className="add-pet-card">
                    + Añadir mascota
                  </Link>
                </div>
              )}
            </section>
          </div>
          {/* Columna derecha: citas */}
          <div>
            <section className="appointments-section">
              <div className="section-header">
                <h2>Mis citas</h2>
              </div>
              {error ? (
                <div className="error-message">{error}</div>
              ) : appointments.length === 0 ? (
                <div className="empty-state">
                  <p>No tienes citas programadas</p>
                  <Link to="/citas" className="btn-primary">
                    Pedir nueva cita
                  </Link>
                </div>
              ) : (
                <div className="appointments-content">
                  {appointments.map((appointment) => (
                    <div
                      className="appointment-card"
                      key={appointment.id_appointment}
                    >
                      <p>
                        <strong>Mascota:</strong> {appointment.patientName}
                      </p>
                      <p>
                        <strong>Fecha:</strong>{" "}
                        {new Date(
                          appointment.appointmentDatetime
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Hora:</strong>{" "}
                        {new Date(
                          appointment.appointmentDatetime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          text="Anular"
                          type="secondary"
                          onClick={() =>
                            handleOpenConfirmModal(appointment.id_appointment)
                          }
                        />
                        <Button
                          text="Editar"
                          type="primary"
                          onClick={() =>
                            navigate('/citas', { state: { appointment } })
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <Link to="/citas" className="btn-primary">
                    Pedir nueva cita
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/*  Modal de confirmación */}
      <DecisionModal
        question="¿Seguro que deseas anular esta cita?"
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onSave={handleDeleteAppointment}
      />

      {/*  Modal de éxito */}
      {isSuccessModalOpen && (
        <SuccessModal
          title={successMessage}
          message="Tu cita ha sido anulada correctamente."
          onClose={handleModalClose}
          buttonText="Cerrar"
        />
      )}
    </>
  );
};

export default CustomerArea;