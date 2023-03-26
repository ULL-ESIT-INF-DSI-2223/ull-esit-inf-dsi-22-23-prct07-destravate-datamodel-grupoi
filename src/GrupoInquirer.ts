import inquirer from 'inquirer';
import FileSync from 'lowdb/adapters/FileSync'

import { promptApp } from './index'
import {Ascendente_Descendente} from './index'
import {Grupo} from './Grupo'

/*-----------------------------------DATABASE----------------------------------- */

const low = require('lowdb');
const database = low(new FileSync('./src/json/database.json'));

/*-----------------------------------COMANDOS----------------------------------- */

enum Commands_Grupo{
    Añadir_grupo = "Añadir grupo",
    Borrar_grupo = "Borrar grupo",
    Modificar_grupo = "Modificar grupo",
    Enseñar_grupos = "Enseñar grupos",
    Atras = "Atras"
}
enum Grupo_enum{
    Nombre = "Nombre",
    Miembros = "Miembros"
}
enum Grupo_Ordenar{
    Nombre = "Nombre",
    Total = "Total",
    Miembros = "Miembros",
    Atras = "Atras"
}

/*-----------------------------------GRUPOS----------------------------------- */
export async function promptGrupo(): Promise<void>{
    console.clear();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands_Grupo)
    }).then(async answers => {
        switch (answers["command"]) {
            case Commands_Grupo.Atras:
                promptApp();
                break;
            case Commands_Grupo.Añadir_grupo:
                promptAddGrupo();
                break;
            case Commands_Grupo.Borrar_grupo:
                promptRemoveGrupo();
                break;
            case Commands_Grupo.Enseñar_grupos:
                promptOrdenarGrupos();
                break;
            case Commands_Grupo.Modificar_grupo:
                modifyGrupo();
                break;
        }
    })
}

/*-----------------AÑADIR GRUPO-----------------*/
async function promptAddGrupo(): Promise<void> {
    console.clear();
    let nombre = ""

    // Sacar el id de los usuarios para que escoja sus amigos 
    let usuarios:string[] = [];
    let jsonUsuario = database;
    
    for(let i in jsonUsuario.toJSON().usuarios){
        usuarios.push(jsonUsuario.toJSON().usuarios[i]._id);
    }

    const answers = await inquirer.prompt([
    {
        type: "input",
        name: "name",
        message: "Introduce el nombre del grupo: "
    },
    {
        type: "checkbox",
        name: "usuarios",
        message: "Escoge los miembros del grupo: ",
        choices: Object.values(usuarios)
    },
    ]).then((answers) => {
            nombre = answers.name;
            usuarios = answers.usuarios;
    })

    const new_grupo = new Grupo(nombre, usuarios)

    const numberString = new_grupo.id.replace(/^id-/, '');
    const lastId = parseInt(numberString);
    database.get('ultimoidUnico').find({nombre: "id_unico"}).set("id", lastId).write();
    database.get('grupos').push(new_grupo).write();
    promptGrupo();
}

/*-----------------ELIMINAR GRUPO-----------------*/
async function promptRemoveGrupo(): Promise<void>{
    console.clear()
    const respuesta = await inquirer.prompt({
        type: 'input',
        name: 'grupo',
        message: 'Escribe el nombre del grupo que deseas eliminar: ',
    });
    database.get('grupos').remove({_nombre: respuesta.grupo}).write();
    promptGrupo();
}

/*-----------------ENSEÑAR GRUPOS-----------------*/
// Enseñar opciones de enseñar grupos
// Especificar ascendente o descendente
// 
async function promptOrdenarGrupos(): Promise<void>{
    console.clear();
    await inquirer.prompt({
        type: "list",
        name: "command",
        message: "Ordenar por: ",
        choices: Object.values(Grupo_Ordenar)
    }).then(async answers => {
        if (answers["command"] === Grupo_Ordenar.Atras){
            promptGrupo();            
        }else if (answers["command"] === Grupo_Ordenar.Nombre){
            promptGrupoOrdenado(Grupo_Ordenar.Nombre);
        }else if (answers["command"] === Grupo_Ordenar.Miembros){
            promptGrupoOrdenado(Grupo_Ordenar.Miembros);
        }else if (answers["command"] === Grupo_Ordenar.Total){
            promptGrupoOrdenado(Grupo_Ordenar.Total);
        }
    })
}
async function promptGrupoOrdenado(tipo: Grupo_Ordenar): Promise<void>{
    console.clear();
    await inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Ascendente_Descendente)
    }).then(async answers => {
        if (answers["command"] === Ascendente_Descendente.Ascendente){
            if (tipo === Grupo_Ordenar.Nombre){
                console.log(JSON.stringify(database.get('grupos').sortBy('nombre').value(), null, '\t'));
            }else if (tipo === Grupo_Ordenar.Miembros){
                console.log("Funcion no implementada")
                console.log(JSON.stringify(database.get('grupos').sortBy((reto: any) => reto._miembrosID.length).value(), null, '\t'));
            }else if (tipo === Grupo_Ordenar.Total){
                console.log(JSON.stringify(database.get('grupos').sortBy('_estadisticas').value(), null, '\t'));
            }else{
                promptGrupo();
            }
        } else{
            if (tipo === Grupo_Ordenar.Nombre){
                console.log(JSON.stringify(database.get('grupos').sortBy('nombre').reverse().value(), null, '\t'));
            }else if (tipo === Grupo_Ordenar.Miembros){
                console.log("Funcion no implementada")
                console.log(JSON.stringify(database.get('grupos').sortBy((reto: any) => reto._miembrosID.length).reverse().value(), null, '\t'));
            }else if (tipo === Grupo_Ordenar.Total){
                console.log(JSON.stringify(database.get('grupos').sortBy('_estadisticas').reverse().value(), null, '\t'));
            }else{
                promptGrupo();
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
        promptGrupo();
    });

}

/*-----------------MODIFICAR GRUPO-----------------*/

// Cambia parámetro
async function modifyParamGrupo(grupo: string, enumerado: Grupo_enum): Promise<void>{
    console.clear();
    let usuarios:string[] = []
    let jsonUsuario = database;

    for (let i in jsonUsuario.toJSON().usuarios){
        usuarios.push(jsonUsuario.toJSON().usuarios[i]._id)
    }
    if (enumerado === Grupo_enum.Nombre){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "nombre",
            message: "Introduzca nuevo nombre: "
        })
        database.get('grupos').find({_nombre: grupo}).set("_nombre", respuesta.nombre).write()
    }
    else if (enumerado === Grupo_enum.Miembros){
        const respuesta = await inquirer.prompt({
            type: "checkbox",
            name: "usuarios",
            message: "Selecciona los usuarios que realizan este reto: ",
            choices: Object.values(usuarios)
        }).then((answers) =>{
            usuarios = answers.usuarios
            database.get('grupos').find({_nombre: grupo}).set("_miembrosID", usuarios).write()
        })
    }
    promptGrupo();

}
// Enseña todos los parámetros y escoge que quiere modificar
async function modifyGrupo(): Promise<void>{
    console.clear();
    const respuesta_grupo = await inquirer.prompt({
        type: 'input',
        name: 'grupo',
        message: 'Escribe el nombre del grupo que deseas modificar: '
    })
    const grupo = respuesta_grupo.grupo
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Grupo_enum)
    }).then(answers => {
        switch (answers["command"]) {
            case Grupo_enum.Nombre:
                modifyParamGrupo(grupo, Grupo_enum.Nombre);
                break; 
            case Grupo_enum.Miembros:
                modifyParamGrupo(grupo, Grupo_enum.Miembros);
                break;
        }
    })
}