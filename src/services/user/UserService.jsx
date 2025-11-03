import UserRepository from '../../repositories/user/UserRepository';

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getUsers() {
        try {
            const result = await this.userRepository.getAll();
            console.log('Usuarios obtenidos con éxito:', result);
            return result;
        } catch (error) {
            console.error('Error en UserService.getUsers:', error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const result = await this.userRepository.getById(id);
            console.log(`Usuario con ID ${id} obtenido con éxito:`, result);
            return result;
        } catch (error) {
            console.error(`Error en UserService.getUserById(${id}):`, error);
            throw error;
        }
    }

        async updateUser(id, userData) {
            try {
                const result = await this.userRepository.update(id, userData);
                console.log(`Usuario con ID ${id} actualizado con éxito:`, result);
                return result;
            } catch (error) {
                console.error(`Error en UserService.updateUser(${id}):`, error);
                throw error;
            }
        }
}

const userService = new UserService();

export default userService;
