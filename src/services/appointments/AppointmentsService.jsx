import AppointmentsRepository from '../../repositories/appointments/AppointmentsRepository';

class AppointmentsService {
  constructor() {
    this.appointmentsRepository = new AppointmentsRepository();
  }

  async createAppointment(appointmentData) {
    try {
      const result = await this.appointmentsRepository.create(appointmentData);
      console.log('Cita creada con éxito:', result);
      return result;
    } catch (error) {
      console.error('Error en AppointmentsService.createAppointment:', error);
      throw error;
    }
  }

  async getAppointments() {
    try {
      const result = await this.appointmentsRepository.getAll();
      console.log('Citas obtenidas con éxito:', result);
      return result;
    } catch (error) {
      console.error('Error en AppointmentsService.getAppointments:', error);
      throw error;
    }
  }

  async getMyAppointments() {
    try {
      const result = await this.appointmentsRepository.getMyAppointments();
      console.log('Mis citas obtenidas con éxito:', result);
      return result;
    } catch (error) {
      console.error('Error en AppointmentsService.getMyAppointments:', error);
      throw error;
    }
  }

  async getAppointmentById(id) {
    try {
      if (!id) {
        throw new Error('El ID de la cita es obligatorio');
      }

      const result = await this.appointmentsRepository.getById(id);
      console.log(`Cita con ID ${id} obtenida con éxito:`, result);
      return result;
    } catch (error) {
      console.error(`Error en AppointmentsService.getAppointmentById(${id}):`, error);
      throw error;
    }
  }

  async updateAppointment(id, appointmentData) {
    try {
      const result = await this.appointmentsRepository.update(id, appointmentData);
      console.log('Cita actualizada con éxito:', result);
      return result;
    } catch (error) {
      console.error('Error en AppointmentsService.updateAppointment:', error);
      throw error;
    }
  }


  async deleteAppointment(id) {
    try {
      const result = await this.appointmentsRepository.delete(id);
      console.log(`Cita con ID ${id} eliminada con éxito`);
      return result;
    } catch (error) {
      console.error('Error en AppointmentsService.deleteAppointment:', error);
      throw error;
    }
  }
}

const appointmentsService = new AppointmentsService();

export default appointmentsService;