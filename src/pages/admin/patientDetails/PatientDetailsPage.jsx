import React, { useEffect, useState } from "react";
import SuccessModal from "../../../components/successModal/SuccessModal";
import DecisionModal from "../../../components/decisionModal/DecisionModal";
import { useParams, Link } from "react-router-dom";
import Hero from "../../../components/hero/Hero";
import Button from "../../../components/button/Button";
import Square from "../../../components/square/Square";
import PageSubTitle from "../../../components/pageSubTitle/PageSubTitle";
import InfoCard from "../../../components/infoCard/InfoCard";
import pacientsService from "../../../services/pacients/PacientsService";
import userService from "../../../services/user/UserService";
import treatmentsService from "../../../services/treatments/TreatmentsService";
import { useNavigate } from "react-router-dom";
import "./PatientDetailsPage.css";


export const PatientDetails = () => {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [error, setError] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const navigate = useNavigate();

  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.roles && user.roles.includes("ROLE_USER")) {
      navigate("/customer-area");
    }
  }, [navigate]);

  const handleDelete = async () => {
    try {
      await pacientsService.deletePatient(id);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      alert("Ocurrió un error al eliminar el paciente.");
    }
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientData = await pacientsService.getPatientById(id);
        setPaciente(patientData);

        if (patientData && patientData.user_id) {
          const tutorData = await userService.getUserById(patientData.user_id);
          setTutor(tutorData);
          console.log("Tutor del paciente:", tutorData);
        }

        // Cargar tratamientos del paciente
        if (patientData && patientData.id_patient) {
          const treatmentsData = await treatmentsService.getTreatmentsByPatientId(patientData.id_patient);
          setTreatments(treatmentsData);
        }
      } catch (err) {
        setError("Error al cargar los detalles del paciente.");
        console.error("Error cargando detalles del paciente:", err);
      }
    };

    fetchPatientDetails();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!paciente) {
    return <p>Cargando paciente...</p>;
  }
  
  const patientFields = [
    { label: "Nº de identificación", key: "id_patient" },
    { label: "Nombre", key: "name" },
    { label: "Edad", key: "age" },
    { label: "Especie", key: "family" },
    { label: "Raza", key: "breed" },
    { label: "Sexo", key: "sex" },
  ];

  const tutorFields = [
    { label: "Nombre", key: "name" },
    { label: "Apellido", key: "surname" },
    { label: "Teléfono", key: "phone" },
    { label: "DNI", key: "dni" },
    { label: "Correo electrónico", key: "email" },
  ];

  const handleModalClose = () => {
    setIsSuccessModalOpen(false);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.roles?.[0] === "ROLE_ADMIN") {
      navigate("/listaPacientes");
    } else {
      navigate("/customer-area");
    }
  };

  const treatmentFields = [
    { label: "Nombre", key: "name" },
    { label: "Descripción", key: "description" },
    { label: "Fecha", key: "treatmentDate" },
  ];

  return (
    <>
      <Hero text="Detalles del Paciente" />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0 2rem 0' }}>
        <Link to="/crear-paciente" state={{ patient: paciente }}>
          <Button text="Editar" />
        </Link>
        <Button text="Eliminar" type="danger" onClick={() => setIsDecisionModalOpen(true)} />
      </div>
      <DecisionModal
        question="¿Seguro que deseas eliminar este paciente? Esta acción no se puede deshacer."
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        onSave={handleDelete}
      />
      <Square>
        {isSuccessModalOpen && (
            <SuccessModal
              title={"Paciente eliminado"}
              message="Haz click para volver a la página de gestión"
              buttonText="Cerrar"
              onClose={handleModalClose}
            />
        )}
        <PageSubTitle text="Datos del paciente" />
        <InfoCard data={paciente} fields={patientFields} />
        {tutor && (
          <>
            <PageSubTitle text="Datos del dueño" />
            <InfoCard data={tutor} fields={tutorFields} />
          </>
        )}
        <PageSubTitle text="Historia clínica" />
        {treatments.length > 0 ? (
          treatments.map((treatment) => (
            <InfoCard key={treatment.id} data={treatment} fields={treatmentFields} />
          ))
        ) : (
          <p className="no-treatments">No hay tratamientos para este paciente.</p>
        )}
      </Square>
    </>
  );
};

export default PatientDetails;
