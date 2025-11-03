import React, { useState, useEffect } from "react";
import Button from "../../../components/button/Button";
import Hero from "../../../components/hero/Hero";
import Square from "../../../components/square/Square";
import InfoCard from "../../../components/infoCard/InfoCard";
import PageSubTitle from "../../../components/pageSubTitle/PageSubTitle";
import pacientsService from "../../../services/pacients/PacientsService";
import Modal from "../../../components/modal/Modal";
import appointmentsService from "../../../services/appointments/AppointmentsService";
import treatmentsService from "../../../services/treatments/TreatmentsService";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./AppointmentDetails.css"
import SuccessModal from "../../../components/successModal/SuccessModal";


export const AppointmentDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {

        const appointmentData = await appointmentsService.getAppointmentById(id);
        setAppointment(appointmentData);


        if (appointmentData?.patientId) {
          const patientData = await pacientsService.getPatientById(appointmentData.patientId);
          setPaciente(patientData);
          const treatmentsData = await treatmentsService.getTreatmentsByPatientId(appointmentData.patientId);
          setTreatments(treatmentsData);
        } else {
          throw new Error("La cita no contiene un patientId válido.");
        }
      } catch (err) {
        console.error("Error cargando los datos:", err);
        setError("Error al cargar los detalles de la cita, del paciente o de los tratamientos.");
      }
    };

    fetchData();
  }, [id]);

  const handleFinalizeAppointment = async () => {
  try {
    // Evitamos doble click si ya está atendida
    if (appointment.status === "ATENDIDA") return;

    // Creamos un objeto actualizado
    const updatedAppointment = { ...appointment, status: "ATENDIDA" };

    // Llamamos al backend
    await appointmentsService.updateAppointment(id, updatedAppointment);

    // Actualizamos el estado local
    setAppointment(updatedAppointment);

    // ✅ Abrimos el modal sólo después del éxito
    setIsSuccessModalOpen(true);
  } catch (error) {
    console.error("Error finalizando la cita:", error);
    setError("Error al finalizar la cita.");
  }
};

  if (error) return <p>{error}</p>;
  if (!appointment || !paciente) return <p>Cargando datos...</p>;

  const patientFields = [
    { label: "Nº de identificación", key: "identificationNumber" },
    { label: "Nombre", key: "name" },
    { label: "Edad", key: "age" },
    { label: "Familia", key: "family" },
    { label: "Raza", key: "breed" },
    { label: "Sexo", key: "sex" },
  ];

  const treatmentFields = [
    { label: "Nombre", key: "name" },
    { label: "Descripción", key: "description" },
    { label: "Fecha", key: "treatmentDate" },
  ];

  return (
    <>
      <Hero text="Datos de cita" />

      <Square>
        <PageSubTitle text="Datos del paciente" />
        <InfoCard data={paciente} fields={patientFields} />

        <PageSubTitle text="Resumen de tratamientos" />
        {treatments.length > 0 ? (
          treatments.map((treatment) => (
            <InfoCard key={treatment.id} data={treatment} fields={treatmentFields} />
          ))
        ) : (
                <p className="no-treatments">No hay tratamientos para este paciente.</p>
        )}
      </Square>

      <div className="button-container">
        <Button
          text="Añadir Tratamiento"
          type="primary"
          onClick={() => setIsModalOpen(true)}
        />
        <Button
          text="Finalizar Cita"
          type="primary"
          onClick={handleFinalizeAppointment}
          disabled={appointment.status === "ATENDIDA"}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async () => {
          const treatmentName = document.querySelector('.modal-input').value;
          const treatmentDescription = document.querySelector('.modal-textarea').value;
          if (treatmentName && treatmentDescription) {
            try {
              await treatmentsService.createTreatment(appointment.patientId, {
                name: treatmentName,
                description: treatmentDescription,
                treatmentDate: new Date().toISOString(),
              });
              const treatmentsData = await treatmentsService.getTreatmentsByPatientId(appointment.patientId);
              setTreatments(treatmentsData);
            } catch (error) {
              console.error("Error creating treatment:", error);
              setError("Error al crear el tratamiento.");
            }
          }
        }}
      />

   {isSuccessModalOpen && (
  <SuccessModal
    isOpen={true}
    onClose={() => {
      setIsSuccessModalOpen(false);
      navigate('/listaCitas');
    }}
    message="✅Cita finalizada con éxito"
    buttonText="Cerrar"
  />
)}
    </>
  );
};

export default AppointmentDetails;