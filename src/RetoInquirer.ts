import inquirer from 'inquirer';
import FileSync from 'lowdb/adapters/FileSync'

import { promptApp } from './index'
import {Ascendente_Descendente} from './index'
import {Actividad} from './Actividad'
import { Actividades } from './index';
import { Reto } from './Reto';

/*-----------------------------------DATABASE----------------------------------- */

const low = require('lowdb');
const database = low(new FileSync('./src/json/database.json'));

/*-----------------------------------COMANDOS----------------------------------- */

enum Commands_Reto{
    Añadir_reto = "Añadir reto",
    Borrar_reto = "Borrar reto",
    Modificar_reto = "Modificar reto",
    Enseñar_retos = "Enseñar retos",
    Atras = "Atras"
}
enum Reto_enum{
    Nombre = "Nombre",
    Rutas = "Rutas",
    Actividad = "Actividad",
    Usuarios = "Usuarios"
}
enum Reto_Ordenar{
    Nombre = "Nombre",
    Usuarios = "Número de usuarios",
    Total = "Cantidad de kilómetros",
    Atras = "Atras"
}

/*-----------------------------------RETOS----------------------------------- */
export async function promptReto(): Promise<void>{
    console.clear();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands_Reto)
    }).then(async answers => {
        switch (answers["command"]) {
            case Commands_Reto.Atras:
                promptApp();
                break;
            case Commands_Reto.Añadir_reto:
                promptAddReto();
                break;
            case Commands_Reto.Borrar_reto:
                promptRemoveReto();
                break;
            case Commands_Reto.Enseñar_retos:
                promptOrdenarRetos();
                break;
            case Commands_Reto.Modificar_reto:
                modifyReto();
                break;
        }
    })
}

/*-----------------AÑADIR RETO-----------------*/
async function promptAddReto(): Promise<void> {
    console.clear();
    let nombre = ""
    let actividad = Actividad.Bicicleta, total = 0
    let usuarios:string[] = []
    let rutas_todas:string[] = []
    let rutas:string[] = []
    let longitud:string[] = []
    let jsonUsuario = database;

    for (let i in jsonUsuario.toJSON().usuarios){
        usuarios.push(jsonUsuario.toJSON().usuarios[i]._id)
    }

    for (let i in jsonUsuario.toJSON().rutas){
        rutas_todas.push(jsonUsuario.toJSON().rutas[i]._nombre)
        longitud.push(jsonUsuario.toJSON().rutas[i]._longitud)
    }

    const answers = await inquirer.prompt([
    {
        type: "input",
        name: "name",
        message: "Introduce el nombre del reto: "
    },
    {
        type: "checkbox",
        name: "rutas",
        message: "Introduce las rutas del reto: ",
        choices: Object.values(rutas_todas)
    },
    {
        type: 'list',
        name: 'actividad',
        message: 'Escoge el tipo de actividad (Correr o Bicicleta): ',
        choices: Object.values(Actividades)
    },
    {
        type: "checkbox",
        name: "usuarios",
        message: "Introduce los usuarios que están realizando el reto",
        choices: Object.values(usuarios)
    },
    ]).then((answers) => {
            nombre = answers.name;
            rutas = answers.rutas;
            usuarios = answers.usuarios;
            switch (answers["actividad"]) {
                case Actividades.Correr:
                    actividad = Actividad.Correr
                    break;
                case Actividades.Bicicleta:
                    actividad = Actividad.Bicicleta
                    break;
            }
    })

    /* Con esto averigua el total de todas las rutas seleccionadas */
    rutas.forEach((elemento)=>{
        let i = rutas_todas.indexOf(elemento)
        total += Number(longitud[i])
    })

    // Aqui el total deberia tener otra forma ya que se deberia recorrer las rutas y calcularlo
    const new_reto = new Reto(nombre, rutas, actividad, usuarios);
    new_reto.total = total
    const numberString = new_reto.id.replace(/^id-/, '');
    const lastId = parseInt(numberString);
    database.get('ultimoidUnico').find({nombre: "id_unico"}).set("id", lastId).write();
    database.get('retos').push(new_reto).write();
    promptReto();
}

/*-----------------ELIMINAR RETO-----------------*/
async function promptRemoveReto(): Promise<void>{
    console.clear()
    const respuesta = await inquirer.prompt({
        type: 'input',
        name: 'reto',
        message: 'Escribe el nombre del reto que deseas eliminar: ',
    });
    database.get('retos').remove({nombre: respuesta.reto}).write();
    promptReto();
}

/*-----------------ENSEÑAR RETOS-----------------*/
// Enseñar opciones de enseñar retos
// Especificar ascendente o descendente
// 
async function promptOrdenarRetos(): Promise<void>{
    console.clear();
    await inquirer.prompt({
        type: "list",
        name: "command",
        message: "Ordenar por: ",
        choices: Object.values(Reto_Ordenar)
    }).then(async answers => {
        if (answers["command"] === Reto_Ordenar.Atras){
            promptReto();            
        }else if (answers["command"] === Reto_Ordenar.Nombre){
            promptRetoOrdenado(Reto_Ordenar.Nombre);
        }else if (answers["command"] === Reto_Ordenar.Usuarios){
            promptRetoOrdenado(Reto_Ordenar.Usuarios);
        }else if (answers["command"] === Reto_Ordenar.Total){
            promptRetoOrdenado(Reto_Ordenar.Total);
        }
    })
}
async function promptRetoOrdenado(tipo: Reto_Ordenar): Promise<void>{
    console.clear();
    await inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Ascendente_Descendente)
    }).then(async answers => {
        if (answers["command"] === Ascendente_Descendente.Ascendente){
            if (tipo === Reto_Ordenar.Nombre){
                console.log(JSON.stringify(database.get('retos').sortBy('_nombre').value(), null, '\t'));
            }else if (tipo === Reto_Ordenar.Usuarios){
                console.log(JSON.stringify(database.get('retos').sortBy((reto: any) => reto._usuarios.length).value(), null, '\t'));
            }else if (tipo === Reto_Ordenar.Total){
                console.log(JSON.stringify(database.get('retos').sortBy('_total').value(), null, '\t'));
            }else{
                promptReto();
            }
        } else{
            if (tipo === Reto_Ordenar.Nombre){
                console.log(JSON.stringify(database.get('retos').sortBy('_nombre').reverse().value(), null, '\t'));
            }else if (tipo === Reto_Ordenar.Usuarios){
                console.log(JSON.stringify(database.get('retos').sortBy((reto: any) => reto._usuarios.length).reverse().value(), null, '\t'));
            }else if (tipo === Reto_Ordenar.Total){
                console.log(JSON.stringify(database.get('retos').sortBy('_total').reverse().value(), null, '\t'));
            }else{
                promptReto();
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
        promptReto();
    });

}

/*-----------------MODIFICAR RETOS-----------------*/

// Cambia parámetro
async function modifyParamReto(reto: string, enumerado: Reto_enum): Promise<void>{
    console.clear();
    let jsonUsuario = database;
    let rutas_todas:string[] = []
    let rutas:string[] = []
    let longitud:string[] = []
    let total = 0
    let usuarios:string[] = []

    for (let i in jsonUsuario.toJSON().usuarios){
        usuarios.push(jsonUsuario.toJSON().usuarios[i]._id)
    }

    for (let i in jsonUsuario.toJSON().rutas){
        rutas_todas.push(jsonUsuario.toJSON().rutas[i]._nombre)
        longitud.push(jsonUsuario.toJSON().rutas[i]._longitud)
    }
    if (enumerado === Reto_enum.Nombre){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "nombre",
            message: "Introduzca nuevo nombre: "
        })
        database.get('retos').find({nombre: reto}).set("nombre", respuesta.nombre).write()
    }
    else if (enumerado === Reto_enum.Rutas){
        const respuesta = await inquirer.prompt({
            type: "checkbox",
            name: "rutas",
            message: "Seleccione nuevas rutas: ",
            choices: Object.values(rutas_todas)
        }).then((answers) => {
            rutas = answers.rutas
            rutas.forEach((elemento)=>{
                let i = rutas_todas.indexOf(elemento)
                total += Number(longitud[i])
            })
            database.get('retos').find({_nombre: reto}).set("_total", total).write()
            database.get('retos').find({_nombre: reto}).set("_rutas", rutas).write()
        })
    }
    else if (enumerado === Reto_enum.Usuarios){
        const respuesta = await inquirer.prompt({
            type: "checkbox",
            name: "usuarios",
            message: "Selecciona los usuarios que realizan este reto: ",
            choices: Object.values(usuarios)
        }).then((answers) =>{
            usuarios = answers.usuarios
            database.get('retos').find({_nombre: reto}).set("_usuarios", usuarios).write()
        })
    }
    else if (enumerado === Reto_enum.Actividad){
        const respuesta = await inquirer.prompt({
            type: 'list',
            name: 'actividad',
            message: 'Escoge el tipo de actividad (Correr o Bicicleta): ',
            choices: Object.values(Actividades)
        })
        if(respuesta.actividad === "Bicicleta"){
            database.get('retos').find({nombre: reto}).set("_actividad", 2).write()
        }else{
            database.get('retos').find({nombre: reto}).set("_actividad", 1).write()
        }
    }
    promptReto();

}
// Enseña todos los parámetros y escoge que quiere modificar
async function modifyReto(): Promise<void>{
    console.clear();
    const respuesta_reto = await inquirer.prompt({
        type: 'input',
        name: 'reto',
        message: 'Escribe el nombre del reto que deseas modificar: '
    })
    const reto = respuesta_reto.reto
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Reto_enum)
    }).then(answers => {
        switch (answers["command"]) {
            case Reto_enum.Nombre:
                modifyParamReto(reto, Reto_enum.Nombre);
                break; 
            case Reto_enum.Rutas:
                modifyParamReto(reto, Reto_enum.Rutas);
                break;
            case Reto_enum.Actividad:
                modifyParamReto(reto, Reto_enum.Actividad);
                break;
            case Reto_enum.Usuarios:
                modifyParamReto(reto, Reto_enum.Usuarios);
                break;
        }
    })
}
