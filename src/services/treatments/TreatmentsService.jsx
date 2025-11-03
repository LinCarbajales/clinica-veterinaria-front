import TreatmentsRepository from "../../repositories/treatments/TreatmentsRepository";

class TreatmentsService {
    constructor() {
        this.repository = new TreatmentsRepository();
    }

    async getTreatmentById(id) {
        try {
            const result = await this.repository.getById(id);
            console.log(`Tratamiento con ID ${id} obtenido con éxito:`, result);
            return result;
        } catch (error) {
            console.error(`Error en TreatmentsService.getTreatmentById(${id}):`, error);
            throw error;
        }
    }

    async getTreatmentsByPatientId(patientId) {
        try {
            const result = await this.repository.getByPatientId(patientId);
            console.log(`Tratamientos para el paciente con ID ${patientId} obtenidos con éxito:`, result);
            return result;
        } catch (error) {
            console.error(`Error en TreatmentsService.getTreatmentsByPatientId(${patientId}):`, error);
            throw error;
        }
    }

    async createTreatment(patientId, treatmentData) {
        try {
            const result = await this.repository.create(patientId, treatmentData);
            console.log('Tratamiento creado con éxito:', result);
            return result;
        } catch (error) {
            console.error('Error en TreatmentsService.createTreatment:', error);
            throw error;
        }
    }
}

const treatmentsService = new TreatmentsService();
export default treatmentsService;
