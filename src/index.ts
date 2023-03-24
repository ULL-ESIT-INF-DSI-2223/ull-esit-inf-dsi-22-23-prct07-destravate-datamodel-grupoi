import inquirer from 'inquirer';

import {Ruta} from "./Ruta"
import { Geolocalizacion } from "./Ruta";
import { Actividad } from "./Actividad";
import FileSync from 'lowdb/adapters/FileSync';
import { jsonTodoCollection } from './jsonTodoCollection';

// Rutas
// Creamos algunas instancias de Geolocalizacion para usar en las rutas
const inicio1: Geolocalizacion = { latitud: 40.4168, longitud: -3.7038 };
const final1: Geolocalizacion = { latitud: 40.4799, longitud: -3.7038 };

const inicio2: Geolocalizacion = { latitud: 41.3851, longitud: 2.1734 };
const final2: Geolocalizacion = { latitud: 41.3984, longitud: 2.1741 };

let todos: Ruta[] = [
    new Ruta('Ruta 1', inicio1, final1, 10, 500, ["1", "2", "3"], Actividad.Correr, 6.7),
    new Ruta('Ruta 2', inicio2, final2, 15, 200, ["1", "2", "3"], Actividad.Bicicleta, 4.5),
    new Ruta('Ruta 3', inicio1, final2, 8, 300, ["1", "2", "3"], Actividad.Correr, 4.2),
    new Ruta('Ruta 4', inicio2, final1, 12, 400, ["1", "2", "3"], Actividad.Bicicleta, 8.9),
    new Ruta('Ruta 5', inicio1, final1, 20, 700, ["1", "2", "3"], Actividad.Correr, 5.4),
    new Ruta('Ruta 6', inicio2, final2, 25, 800, ["1", "2", "3"], Actividad.Bicicleta, 9.5),
    new Ruta('Ruta 7', inicio1, final2, 18, 600, ["1", "2", "3"], Actividad.Correr, 9.8),
    new Ruta('Ruta 8', inicio2, final1, 22, 900, ["1", "2", "3"], Actividad.Bicicleta, 6.5),
    new Ruta('Ruta 9', inicio1, final1, 30, 1000, ["1", "2", "3"], Actividad.Correr, 7.3),
    new Ruta('Ruta 10', inicio2, final2, 35, 1100, ["1", "2", "3"], Actividad.Bicicleta, 3.0)
];

const low = require('lowdb');
const database = low(new FileSync('./src/json/database.json'));
const colectionMain = new jsonTodoCollection();
enum Options{
    Rutas = "Rutas",
    Usuarios = "Usuarios",
    Grupos = "Grupos",
    Retos = "Retos"
}
enum Commands {
    Añadir_ruta = "Añadir ruta",
    Borrar_ruta = "Borrar ruta",
    Modificar_ruta = "Modificar ruta",
    Enseñar_rutas = "Enseñar rutas",
    Quit = "Quit"
}
enum Actividades{
    Correr = "Correr",
    Bicicleta = "Bicicleta"
}
enum Ruta_enum{
    Nombre = "Nombre",
    Inicio = "Inicio",
    Final = "Final",
    Longitud = "Longitud",
    Desnivel = "Desnivel",
    Actividad = "Actividad",
    Calificacion = "Calificacion"
}
// Add ruta
async function promptAdd(): Promise<void> {
    console.clear();
    let nombre = ""
    let inicio_latitud = 0, inicio_longitud = 0, final_latitud = 0, final_longitud = 0, longitud = 0, desnivel = 0, calificacion = 0, actividad = Actividad.Bicicleta
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Introduce el nombre de la ruta: "
    },
    {
        type: 'number',
        name: 'inicio_latitud',
        message: 'Introduce la latitud para el inicio: ',
    },
    {
        type: 'number',
        name: 'inicio_longitud',
        message: 'Introduce la longitud para el inicio: ',
    },
    {
        type: 'number',
        name: 'final_latitud',
        message: 'Introduce la latitud para el final: ',
    },
    {
        type: 'number',
        name: 'final_longitud',
        message: 'Introduce la longitud para el final: ',
    },
    {
        type: 'number',
        name: 'longitud',
        message: 'Introduce la longitud de la ruta: ',
    },
    {
        type: 'number',
        name: 'desnivel',
        message: 'Introduce el desnivel de la ruta: ',
    },
    {
        type: 'number',
        name: 'calificacion',
        message: 'Introduce la calificacion de la ruta: ',
    },
    {
        type: 'list',
        name: 'actividad',
        message: 'Escoge el tipo de actividad (Correr o Bicicleta): ',
        choices: Object.values(Actividades)
    },
    ]).then((answers) => {
            nombre = answers.name;
            inicio_latitud = answers.inicio_latitud;
            inicio_longitud = answers.inicio_longitud;
            final_latitud = answers.final_latitud;
            final_longitud = answers.final_longitud;
            longitud = answers.longitud;
            desnivel = answers.desnivel;
            actividad = answers.actividad;
            calificacion = answers.calificacion;
            switch (answers["actividad"]) {
                case Actividades.Correr:
                    actividad = Actividad.Correr
                    break;
                case Actividades.Bicicleta:
                    actividad = Actividad.Bicicleta
                    break;
            }
    })

    const inicio_var: Geolocalizacion = { latitud: inicio_latitud, longitud: inicio_longitud };
    const final_var: Geolocalizacion = { latitud: final_latitud, longitud: final_longitud };
    colectionMain.addRuta(nombre, inicio_var, final_var, longitud, desnivel, ["1"], actividad, calificacion)
    //let new_ruta = new Ruta(nombre, inicio_var, final_var, longitud, desnivel, ["1"], actividad, calificacion)
    //todos.push(new_ruta);
    promptRuta();
}
// Remove ruta
async function promptRemove(): Promise<void>{
    console.clear()
    const respuesta = await inquirer.prompt({
        type: 'list',
        name: 'ruta',
        message: 'Seleccione la ruta que deseas eliminar:',
        choices: todos.map((clase) => ({
            name: `${clase.nombre}`,
            value: clase,
        }))
    });
    const index = todos.indexOf(respuesta.ruta); // obtiene el índice del elemento a eliminar
    if (index !== -1) {
        todos.splice(index, 1); // elimina el elemento del array original
    }
    promptRuta();
}
// Show ruta
async function displayRutaList(): Promise<void>{
    console.clear();
    console.log(`Rutas: `);
    todos.forEach(item => console.log(item.toString()));
    const respuesta = await inquirer.prompt({
        type: 'list',
        name: 'ruta',
        message: 'Presione el botón para salir:',
        choices: ["Quit"]
    });
    promptRuta();
}
// Modificar ruta
// Selecciona ruta y la devuelve
async function selectRuta(): Promise<Ruta>{
    console.clear()
    const respuesta = await inquirer.prompt({
        type: 'list',
        name: 'ruta',
        message: 'Seleccione la ruta que deseas modificar:',
        choices: todos.map((clase) => ({
            name: `${clase.nombre}`,
            value: clase,
        }))
    });
    return respuesta.ruta;
}
// Cambia parámetro
async function modifyParam(ruta: Ruta, enumerado: Ruta_enum): Promise<void>{
    console.clear();
    let index = todos.indexOf(ruta)       
    if (enumerado === Ruta_enum.Nombre){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "nombre",
            message: "Introduzca nuevo nombre: "
        })
        todos[index].nombre = respuesta.nombre;
    }
    else if (enumerado === Ruta_enum.Inicio){
        const respuesta = await inquirer.prompt([{
            type: "number",
            name: "latitud",
            message: "Introduce la nueva latitud del inicio: "
        },
        {
            type: "number",
            name: "longitud",
            message: "Introduce la nueva longitud del inicio: "
        }])
        const geo: Geolocalizacion = { latitud: respuesta.latitud, longitud: respuesta.longitud };
        todos[index].inicio = geo;
    }
    else if (enumerado === Ruta_enum.Final){
        const respuesta = await inquirer.prompt([{
            type: "number",
            name: "latitud",
            message: "Introduce la nueva latitud del final: "
        },
        {
            type: "number",
            name: "longitud",
            message: "Introduce la nueva longitud del final: "
        }])
        const geo: Geolocalizacion = { latitud: respuesta.latitud, longitud: respuesta.longitud };
        todos[index].final = geo;
    }
    else if (enumerado === Ruta_enum.Longitud){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "longitud",
            message: "Introduzca nueva longitud: "
        })
        todos[index].longitud = respuesta.longitud;
    }
    else if (enumerado === Ruta_enum.Desnivel){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "desnivel",
            message: "Introduzca nuevo desnivel: "
        })
        todos[index].desnivel = respuesta.desnivel;
    }
    else if (enumerado === Ruta_enum.Calificacion){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "calificacion",
            message: "Introduzca nueva calificacion: "
        })
        todos[index].calificacion = respuesta.calificacion;
    }
    else if (enumerado === Ruta_enum.Actividad){
        const respuesta = await inquirer.prompt({
            type: 'list',
            name: 'actividad',
            message: 'Escoge el tipo de actividad (Correr o Bicicleta): ',
            choices: Object.values(Actividades)
        })
        if(respuesta.actividad === "Bicicleta"){
            todos[index].actividad = Actividad.Bicicleta;
        }else{
            todos[index].actividad = Actividad.Correr;
        }
    }
    promptRuta();

}
// Enseña todos los parámetros y escoge que quiere modificar
async function modifyRuta(ruta: Ruta): Promise<void>{
    console.clear();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Ruta_enum)
    }).then(answers => {
        switch (answers["command"]) {
            case Ruta_enum.Nombre:
                modifyParam(ruta, Ruta_enum.Nombre);
                break; 
            case Ruta_enum.Inicio:
                modifyParam(ruta, Ruta_enum.Inicio);
                break;
            case Ruta_enum.Final:
                modifyParam(ruta, Ruta_enum.Final);
                break;
            case Ruta_enum.Longitud:
                modifyParam(ruta, Ruta_enum.Longitud);
                break;
            case Ruta_enum.Desnivel:
                modifyParam(ruta, Ruta_enum.Desnivel);
                break;
            case Ruta_enum.Actividad:
                modifyParam(ruta, Ruta_enum.Actividad);
                break;
            case Ruta_enum.Calificacion:
                modifyParam(ruta, Ruta_enum.Calificacion);
                break;
        }
    })
}
// Ruta
async function promptRuta(): Promise<void>{
    console.clear();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands)
    }).then(async answers => {
        switch (answers["command"]) {
            case Commands.Quit:
                promptApp();
                break;
            case Commands.Añadir_ruta:
                promptAdd();
                break;
            case Commands.Borrar_ruta:
                promptRemove();
                break;
            case Commands.Enseñar_rutas:
                displayRutaList();
                break;
            case Commands.Modificar_ruta:
                let ruta = selectRuta();
                modifyRuta(await ruta);
                break;
        }
    })
}
// App
function promptApp(): void{
    console.clear();
    console.log(JSON.stringify(database.get('rutas').find({nombre: "Ruta 1"}).value()));
    console.log(JSON.stringify(database.get('rutas').find({nombre: "Ruta 2"}).value()));

    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Options)
    }).then(answers => {
        switch (answers["command"]) {
            case Options.Rutas:
                promptRuta();
                break;
        }
    })
}
promptApp();
