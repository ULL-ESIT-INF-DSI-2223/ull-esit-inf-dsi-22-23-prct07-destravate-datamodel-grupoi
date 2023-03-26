import inquirer from 'inquirer';
import FileSync from 'lowdb/adapters/FileSync'

import { promptApp } from './index'
import {Ascendente_Descendente} from './index'
import {Actividad} from './Actividad'
import { Actividades } from './index';
import { Ruta, Geolocalizacion } from './Ruta';

/*-----------------------------------DATABASE----------------------------------- */

const low = require('lowdb');
const database = low(new FileSync('./src/json/database.json'));

/*-----------------------------------COMANDOS----------------------------------- */

enum Commands {
    Añadir_ruta = "Añadir ruta",
    Borrar_ruta = "Borrar ruta",
    Modificar_ruta = "Modificar ruta",
    Enseñar_rutas = "Enseñar rutas",
    Atras = "Atras"
}
enum Ruta_enum{
    Nombre = "Nombre",
    Inicio = "Inicio",
    Final = "Final",
    Longitud = "Longitud",
    Desnivel = "Desnivel",
    Usuarios = "Usuarios",
    Actividad = "Actividad",
    Calificacion = "Calificacion"
}
enum Ruta_Ordenar{
    Nombre = "Nombre",
    Usuarios = "Número de usuarios",
    Longitud = "Longitud",
    Calificacion = "Calificacion",
    Actividad = "Actividad",
    Atras = "Atras"
}

/*-----------------------------------RUTAS----------------------------------- */
export async function promptRuta(): Promise<void>{
    console.clear();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands)
    }).then(async answers => {
        switch (answers["command"]) {
            case Commands.Atras:
                promptApp();
                break;
            case Commands.Añadir_ruta:
                promptAdd();
                break;
            case Commands.Borrar_ruta:
                promptRemove();
                break;
            case Commands.Enseñar_rutas:
                promptOrdenarRutas();
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
    // Sacar el id de los usuarios para que escoja sus usuarios 
    let amigos:string[] = [];
    let jsonUsuario = database;
    
    for(let i in jsonUsuario.toJSON().usuarios){
        amigos.push(jsonUsuario.toJSON().usuarios[i]._id);
    }

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
        type: 'checkbox',
        name: 'amigo',
        message: 'Escoge que usuarios han relizado la ruta: ',
        choices: Object.values(amigos)
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
            amigos = answers.amigo;
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

    const new_ruta = new Ruta(nombre, inicio_var, final_var, longitud, desnivel, amigos, actividad, calificacion);
    
    const numberString = new_ruta.id.replace(/^id-/, '');
    const lastId = parseInt(numberString);
    database.get('ultimoidUnico').find({nombre: "id_unico"}).set("id", lastId).write();
    database.get('rutas').push(new_ruta).write();
    promptRuta();
}

/*-----------------ELIMINAR RUTA-----------------*/
async function promptRemove(): Promise<void>{
    console.clear()
    const respuesta = await inquirer.prompt({
        type: 'input',
        name: 'ruta',
        message: 'Escribe el nombre de la ruta que deseas eliminar: ',
    });
    database.get('rutas').remove({_nombre: respuesta.ruta}).write();
    promptRuta();
}

/*-----------------ENSEÑAR RUTAS-----------------*/
// Enseñar opciones de enseñar rutas
// Especificar ascendente o descendente

async function promptOrdenarRutas(): Promise<void>{
    console.clear();
    await inquirer.prompt({
        type: "list",
        name: "command",
        message: "Ordenar por: ",
        choices: Object.values(Ruta_Ordenar)
    }).then(async answers => {
        if (answers["command"] === Ruta_Ordenar.Atras){
            promptRuta();            
        }else if (answers["command"] === Ruta_Ordenar.Nombre){
            promptRutaOrdenada(Ruta_Ordenar.Nombre);
        }else if (answers["command"] === Ruta_Ordenar.Longitud){
            promptRutaOrdenada(Ruta_Ordenar.Longitud);
        }else if (answers["command"] === Ruta_Ordenar.Actividad){
            promptRutaOrdenada(Ruta_Ordenar.Actividad);
        }else if (answers["command"] === Ruta_Ordenar.Calificacion){
            promptRutaOrdenada(Ruta_Ordenar.Calificacion);
        }else if (answers["command"] === Ruta_Ordenar.Usuarios){
            promptRutaOrdenada(Ruta_Ordenar.Usuarios);
        }
    })
}
async function promptRutaOrdenada(tipo: Ruta_Ordenar): Promise<void>{
    console.clear();
    await inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Ascendente_Descendente)
    }).then(async answers => {
        if (answers["command"] === Ascendente_Descendente.Ascendente){
            if (tipo === Ruta_Ordenar.Nombre){
                console.log(JSON.stringify(database.get('rutas').sortBy('_nombre').value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Longitud){
                console.log(JSON.stringify(database.get('rutas').sortBy(function(obj: Record<string,string>){return Number(obj._longitud)}).value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Actividad){
                console.log(JSON.stringify(database.get('rutas').sortBy('_actividad').value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Calificacion){
                console.log(JSON.stringify(database.get('rutas').sortBy(function(obj: Record<string,string>){return Number(obj._calificacion)}).value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Usuarios){
                console.log(JSON.stringify(database.get('rutas').sortBy((ruta: any) => ruta._usuarios.length).value(), null, '\t'));
            }else{
                promptRuta();
            }
        } else{
            if (tipo === Ruta_Ordenar.Nombre){
                console.log(JSON.stringify(database.get('rutas').sortBy('_nombre').reverse().value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Longitud){
                console.log(JSON.stringify(database.get('rutas').sortBy(function(obj: Record<string,string>){return Number(obj._longitud)}).reverse().value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Actividad){
                console.log(JSON.stringify(database.get('rutas').sortBy('_actividad').reverse().value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Calificacion){
                console.log(JSON.stringify(database.get('rutas').sortBy(function(obj: Record<string,string>){return Number(obj._calificacion)}).reverse().value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Usuarios){
                console.log(JSON.stringify(database.get('rutas').sortBy((ruta: any) => ruta._usuarios.length).reverse().value(), null, '\t'));
            }else{
                promptRuta();
            }
        }
    })
    console.log("\n")
    const respuesta = await inquirer.prompt({
        type: 'list',
        name: 'ruta',
        message: 'Presione el botón para salir:',
        choices: ["Salir"]
    }).then(async answers => {
        console.clear();
        promptRuta();
    });

}

/*-----------------MODIFICAR RUTA-----------------*/

// Cambia parámetro
async function modifyParam(ruta: string, enumerado: Ruta_enum): Promise<void>{
    console.clear();

    // Sacar el id de los usuarios para que modifique los usuarios
    let amigos:string[] = [];
    let jsonUsuario = database;
    
    for(let i in jsonUsuario.toJSON().usuarios){
        amigos.push(jsonUsuario.toJSON().usuarios[i]._id);
    }

    if (enumerado === Ruta_enum.Nombre){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "nombre",
            message: "Introduzca nuevo nombre: "
        })
        database.get('rutas').find({_nombre: ruta}).set("_nombre", respuesta.nombre).write()
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
        database.get('rutas').find({_nombre: ruta}).set("_inicio", geo).write()
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
        database.get('rutas').find({_nombre: ruta}).set("_final", geo).write()
    }
    else if (enumerado === Ruta_enum.Longitud){
        const respuesta = await inquirer.prompt({
            type: "number",
            name: "longitud",
            message: "Introduzca nueva longitud: "
        })
        database.get('rutas').find({_nombre: ruta}).set("_longitud", respuesta.longitud).write()
    }
    else if (enumerado === Ruta_enum.Desnivel){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "desnivel",
            message: "Introduzca nuevo desnivel: "
        })
        database.get('rutas').find({_nombre: ruta}).set("_desnivel", respuesta.desnivel).write()
    }
    else if (enumerado === Ruta_enum.Calificacion){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "calificacion",
            message: "Introduzca nueva calificacion: "
        })
        database.get('rutas').find({_nombre: ruta}).set("_calificacion", respuesta.calificacion).write()
    }
    else if (enumerado === Ruta_enum.Actividad){
        const respuesta = await inquirer.prompt({
            type: 'list',
            name: 'actividad',
            message: 'Escoge el tipo de actividad (Correr o Bicicleta): ',
            choices: Object.values(Actividades)
        })
        if(respuesta.actividad === "Bicicleta"){
            database.get('rutas').find({_nombre: ruta}).set("_actividad", 2).write()
        }else{
            database.get('rutas').find({_nombre: ruta}).set("_actividad", 1).write()
        }
    }
    else if (enumerado === Ruta_enum.Usuarios){
        const respuesta = await inquirer.prompt({
            type: 'checkbox',
            name: 'amigo',
            message: 'Escoge que usuarios han relizado la ruta: ',
            choices: Object.values(amigos)
        })
        database.get('rutas').find({_nombre: ruta}).set("_usuarios", respuesta.amigo).write()
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
            case Ruta_enum.Usuarios:
                modifyParam(ruta, Ruta_enum.Usuarios);
                break;
        }
    })
}