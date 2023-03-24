import inquirer from 'inquirer';

import {Ruta} from "./Ruta"
import { Geolocalizacion } from "./Ruta";
import { Actividad } from "./Actividad";
import FileSync from 'lowdb/adapters/FileSync';
import { jsonTodoCollection } from './jsonTodoCollection';

/*-----------------------------------DATABASE----------------------------------- */

const low = require('lowdb');
const database = low(new FileSync('./src/json/database.json'));
const colectionMain = new jsonTodoCollection();

/*-----------------------------------COMANDOS----------------------------------- */
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

/*-----------------------------------RUTAS----------------------------------- */
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
                modifyRuta();
                break;
        }
    })
}

/*-----------------AÑADIR RUTA-----------------*/
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

    const new_ruta = {
        "nombre": nombre,
        "inicio": {
          "latitud": inicio_latitud,
          "longitud": inicio_longitud
        },
        "final": {
          "latitud": final_latitud,
          "longitud": final_longitud
        },
        "longitud": longitud,
        "desnivel": desnivel,
        "usuario": [
          "1"
        ],
        "actividad": actividad,
        "calificacion": calificacion
    }
    database.get('rutas').push(new_ruta).write();
    promptRuta();
}

/*-----------------ELIMINAR RUTA-----------------*/
async function promptRemove(): Promise<void>{
    console.clear()
    const respuesta = await inquirer.prompt({
        type: 'input',
        name: 'ruta',
        message: 'Seleccione la ruta que deseas eliminar:',
    });
    database.get('rutas').remove({nombre: respuesta.ruta}).write();
    promptRuta();
}

/*-----------------ENSEÑAR RUTAS-----------------*/
async function displayRutaList(): Promise<void>{
    console.clear();
    console.log(`Rutas: `);

    console.log(JSON.stringify(database.get('rutas').sortBy('calificacion').reverse().value(), null, '\t'));
    const respuesta = await inquirer.prompt({
        type: 'list',
        name: 'ruta',
        message: 'Presione el botón para salir:',
        choices: ["Quit"]
    });
    promptRuta();
}

/*-----------------MODIFICAR RUTA-----------------*/

// Cambia parámetro
async function modifyParam(ruta: string, enumerado: Ruta_enum): Promise<void>{
    console.clear();

    if (enumerado === Ruta_enum.Nombre){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "nombre",
            message: "Introduzca nuevo nombre: "
        })
        database.get('rutas').find({nombre: ruta}).set("nombre", respuesta.nombre).write()
        colectionMain.loadRuta()
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
        const geo: Geolocalizacion = { latitud: Number(respuesta.latitud), longitud: Number(respuesta.longitud) };
        database.get('rutas').find({nombre: ruta}).set("inicio", geo).write()
        colectionMain.loadRuta()
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
        const geo: Geolocalizacion = { latitud: Number(respuesta.latitud), longitud: Number(respuesta.longitud) };
        database.get('rutas').find({nombre: ruta}).set("final", geo).write()
        colectionMain.loadRuta()
    }
    else if (enumerado === Ruta_enum.Longitud){
        const respuesta = await inquirer.prompt({
            type: "number",
            name: "longitud",
            message: "Introduzca nueva longitud: "
        })
        database.get('rutas').find({nombre: ruta}).set("longitud", parseInt(respuesta.longitud)).write()
        colectionMain.loadRuta()
    }
    else if (enumerado === Ruta_enum.Desnivel){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "desnivel",
            message: "Introduzca nuevo desnivel: "
        })
        database.get('rutas').find({nombre: ruta}).set("desnivel", parseInt(respuesta.desnivel)).write()
        colectionMain.loadRuta()
    }
    else if (enumerado === Ruta_enum.Calificacion){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "calificacion",
            message: "Introduzca nueva calificacion: "
        })
        database.get('rutas').find({nombre: ruta}).set("calificacion", parseInt(respuesta.calificacion)).write()
        colectionMain.loadRuta()
    }
    else if (enumerado === Ruta_enum.Actividad){
        const respuesta = await inquirer.prompt({
            type: 'list',
            name: 'actividad',
            message: 'Escoge el tipo de actividad (Correr o Bicicleta): ',
            choices: Object.values(Actividades)
        })
        if(respuesta.actividad === "Bicicleta"){
            database.get('rutas').find({nombre: ruta}).set("actividad", "Bicicleta").write()
            colectionMain.loadRuta()
        }else{
            database.get('rutas').find({nombre: ruta}).set("actividad", "Correr").write()
            colectionMain.loadRuta()
        }
    }
    promptRuta();

}
// Enseña todos los parámetros y escoge que quiere modificar
async function modifyRuta(): Promise<void>{
    console.clear();
    const respuesta_ruta = await inquirer.prompt({
        type: 'input',
        name: 'ruta',
        message: 'Escribe el nombre de la ruta que deseas modificar: '
    })
    const ruta = respuesta_ruta.ruta
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


/*-----------------------------------APP----------------------------------- */
// App
function promptApp(): void{
    console.clear();
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
