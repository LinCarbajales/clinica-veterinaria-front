import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Hero from "../../../components/hero/Hero";
import Button from "../../../components/button/Button";
import Table from "../../../components/table/Table";
import SearchBar from "../../../components/searchBar/SearchBar";
import './UserListPage.css'
import userService from "../../../services/user/UserService";

export const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 

       useEffect(() => {
        const fetchUsers = async () => {
          const data = await userService.getUsers();
          setUsers(data);
        };
        fetchUsers();
      }, []);

      const columnasUsers = [
        { header: "Id", accessor: "id_user" },
        { header: "Email", accessor: "email" },
        { header: "DNI", accessor: "dni" },
        { header: "Nombre", accessor: "name" },
        { header: "Primer Apellido", accessor: "firstSurname" },
        { header: "Segundo Apellido", accessor: "secondSurname" },
        { header: "Teléfono", accessor: "phoneNumber" },

      ];

    const dataToShow = users;


    const filteredData = dataToShow.filter((p) =>
        Object.values(p).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <>
        <Hero text="Listado de usuarios"></Hero>
        <div className="functional-section">
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SearchBar
            placeholder="Buscar usuario..."
            onSearch={(value) => setSearchTerm(value)}
            />
        </span>
        </div>
        <div className="divider-div">
            <hr className="divider" />
        </div>
        

        <Table columnas={columnasUsers} data={filteredData}></Table>
        </>
    )
}

export default UserListPage