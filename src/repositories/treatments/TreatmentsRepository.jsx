class TreatmentsRepository {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    }

    async getById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/treatments/${id}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error al obtener el tratamiento (${response.status})`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en TreatmentsRepository.getById:', error);
            throw error;
        }
    }

    async getByPatientId(patientId) {
        try {
            const response = await fetch(`${this.baseUrl}/treatments/patient/${patientId}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error al obtener los tratamientos del paciente (${response.status})`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en TreatmentsRepository.getByPatientId:', error);
            throw error;
        }
    }

    async create(patientId, treatmentData) {
        try {
            const response = await fetch(`${this.baseUrl}/treatments/patient/${patientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(treatmentData),
            });

            if (!response.ok) {
                throw new Error(`Error al crear el tratamiento (${response.status})`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en TreatmentsRepository.create:', error);
            throw error;
        }
    }
}

export default TreatmentsRepository;