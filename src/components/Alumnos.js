import React, { Component } from "react";
import Global from "../Global";
import axios from "axios";
import jsPDF from "jspdf";

export default class Alumnos extends Component {
    state = {
        alumnos: [],
        status: false,
        seleccionados: []
    }

    selectAlumno = React.createRef();

    loadAlumnos = () => {
        var request = "api/alumnos/filtrarcurso/" + 2023;
        var url = Global.apiSorteo + request;

        axios.get(url).then((response) => {
            this.setState({
                alumnos: response.data,
                status: true,
            })
        })
    }

    seleccionar = () => {
        var aux = [];
        for (var i of this.selectAlumno.current.options) {
            if (i.selected === true) {
                var nom = i.value + ", ";
                aux.push(nom);
            }
        }
        this.setState({
            seleccionados: aux
        })
    }

    generarPDF = () => {
        const doc = new jsPDF();
        //doc.text(this.state.seleccionados);
        this.state.seleccionados.forEach((alumn, index) => {
            doc.text(`${index + 1}. ${alumn}`, 10, 10 + index * 10);
        })
        doc.save('sorteo.pdf');
    }

    componentDidMount = () => {
        this.loadAlumnos();
    }
    render() {
        return (
            <div>
                <h2>
                    {
                        this.state.seleccionados
                    }
                </h2>
                {
                    this.state.status === true &&
                    (
                        <select multiple ref={this.selectAlumno} onChange={this.seleccionar}>
                            {this.state.alumnos.map((alumno, index) => {
                                return (
                                    <option key={index} value={alumno.nombre}>{alumno.nombre}</option>
                                )
                            })}
                        </select>
                    )
                }
                <div>
                    <button onClick={this.generarPDF}>Generar PDF</button>
                </div>

            </div>
        )
    }
}