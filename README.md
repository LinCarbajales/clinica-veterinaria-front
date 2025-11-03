# 🐾 Clínica Veterinaria Margarita - Frontend

Este proyecto corresponde a la parte Frontend del sistema de gestión de pacientes para la Clínica Veterinaria Margarita.
La aplicación web permite a administradores y clientes gestionar pacientes y citas de manera sencilla, ofreciendo además información sobre la clínica, servicios y contacto.

## 📖 Contexto del Proyecto

Margarita está a punto de abrir su clínica veterinaria para gatos y perros, y nos solicita el desarrollo de un sistema completo (Frontend + Backend) que permita:

Gestionar pacientes (listar, añadir, modificar y eliminar).

Gestionar citas (crear, listar, modificar y anular).

Mostrar información de la clínica, servicios disponibles y datos de contacto.

Este repositorio contiene la interfaz web (Frontend) desarrollada en React + Vite.

## ⚙️ Tecnologías utilizadas

React (con Vite)

React Router (navegación entre páginas)

useState / useEffect (gestión de estado y efectos)

CSS

## 🚀 Instalación y uso
Requisitos previos:

Tener instalado Node.js
 (v16 o superior)

npm (incluido en Node.js) o yarn

Pasos para correr el proyecto localmente:
### Clonar el repositorio
git clone <url-del-repo>

### Entrar al directorio
cd clinica-veterinaria-frontend

### Instalar dependencias
npm install

### Iniciar el servidor de desarrollo
npm run dev

Otros comandos útiles
### Crear build para producción
npm run build

### Previsualizar el build
npm run preview

## 📂 Estructura del proyecto
src/
 ├── assets/          # Iconos, imágenes y logos
 ├── components/      # Componentes reutilizables de la UI
 ├── context/         # Context API para estados globales
 ├── pages/           # Páginas principales de la aplicación
 │    ├── admin/          # Área de administración
 │    ├── appointments/   # Gestión de citas
 │    ├── contact/        # Formulario de contacto
 │    ├── customer_area/  # Área de clientes
 │    ├── registration/   # Registro de usuarios/clientes
 │    ├── services/       # Sección de servicios de la clínica
 │   
 ├── repositories/    # Comunicación con el backend
 ├── routes/          # Definición de rutas de la aplicación
 ├── services/        # Funciones auxiliares y llamadas a la API
 ├── App.jsx          # Componente principal
 └── main.jsx         # Punto de entrada

## ✨ Características principales

Página de inicio con información general de la clínica.

Sección de servicios veterinarios.

Gestión de pacientes (solo administradores).

Gestión de citas (clientes y administradores).

Área de clientes para ver y gestionar citas.

Formulario de contacto.

Página "Quiénes somos" con información de la clínica y su equipo.


## 🤝 Contribución

Haz un fork del proyecto.

Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).

Realiza los cambios y haz commit (git commit -m 'Añadida nueva funcionalidad').

Haz push a la rama (git push origin feature/nueva-funcionalidad).

Abre un Pull Request.

## 📄 Licencia

Este proyecto se desarrolla con fines educativos. Puedes adaptarlo libremente.
