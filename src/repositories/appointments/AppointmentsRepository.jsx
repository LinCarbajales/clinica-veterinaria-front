class AppointmentsRepository {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async create(appointmentData) {
    try {
      const response = await fetch(`${this.baseUrl}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error(`Error al crear la cita (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en AppointmentsRepository.create:', error);
      throw error;
    }
  }

  async getAll() {
    const response = await fetch(`${this.baseUrl}/appointments`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Error al obtener las citas (${response.status})`);
    }
    return await response.json();
  }

  async getMyAppointments() {
    const response = await fetch(`${this.baseUrl}/appointments/my-appointments`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Error al obtener mis citas (${response.status})`);
    }
    return await response.json();
  }

  async getById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/appointments/${id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error al obtener la cita (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en AppointmentsRepository.getById:', error);
      throw error;
    }
  }

  async update(id, appointmentData) {
    try {
      const response = await fetch(`${this.baseUrl}/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar la cita (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en AppointmentsRepository.update:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${this.baseUrl}/appointments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar la cita (${response.status})`);
      }

      console.log(`Cita con ID ${id} eliminada correctamente`);
      return true;
    } catch (error) {
      console.error('Error en AppointmentsRepository.delete:', error);
      throw error;
    }
  }
}

export default AppointmentsRepository;