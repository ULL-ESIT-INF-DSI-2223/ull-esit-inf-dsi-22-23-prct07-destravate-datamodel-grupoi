import inquirer from 'inquirer';

import {Usuario} from "./Usuario"
import { promptApp } from './index';
import { Actividad } from "./Actividad";
import FileSync from 'lowdb/adapters/FileSync';
import { jsonTodoCollection } from './jsonTodoCollection';

const low = require('lowdb');
const database = low(new FileSync('./src/json/database.json'));

enum CommandsUsuario {
    Añadir_usuario = "Añadir usuario",
    Borrar_usuario = "Borrar usuario",
    Modificar_usuario = "Modificar usuario",
    Enseñar_usuario = "Enseñar usuario",
    Quit = "Quit"
}
enum Usuario_enum{
    Nombre = "Nombre",
    Actividad = "Actividad",
    Amigo = "Amigo",
    Grupo = "Grupo",
    Rutas = "Rutas"
}
enum Actividades{
    Correr = "Correr",
    Bicicleta = "Bicicleta"
}

export async function promptUsuario(): Promise<void>{
    console.clear();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(CommandsUsuario)
    }).then(async answers => {
        switch (answers["command"]) {
            case CommandsUsuario.Quit:
                promptApp();
                break;
            case CommandsUsuario.Añadir_usuario:
                promptAddUsuario();
                break;
            case CommandsUsuario.Borrar_usuario:
                promptRemoveUsuario();
                break;
            case CommandsUsuario.Enseñar_usuario:
                //displayRutaList();
                break;
            case CommandsUsuario.Modificar_usuario:
                //modifyRuta();
                break;
        }
    })
}


/*-----------------AÑADIR Usuario-----------------*/
async function promptAddUsuario(): Promise<void> {
    console.clear();
    let nombre = ""
    let actividad = Actividad.Bicicleta
    
    // Sacar el id de los usuarios para que escoja sus amigos 
    let amigos:string[] = [];
    let jsonUsuario = database;
    
    for(let i in jsonUsuario.toJSON().usuarios){
        amigos.push(jsonUsuario.toJSON().usuarios[i]._id);
    }
    
    // Sacar el id de los grupos para que escoja sus amigos 
    let grupos:string[] = [];
    let jsonGrupo = database;

    for(let i in jsonGrupo.toJSON().grupos){
        grupos.push(jsonGrupo.toJSON().grupos[i].id);
    }
    
    // Sacar las rutas para que las elija el usuario
    let rutas:string[] = [];
    let jsonRuta = database;
    
    for(let i in jsonRuta.toJSON().rutas){
        rutas.push(jsonRuta.toJSON().rutas[i].nombre);
    }

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Introduce el nombre del Usuario: "
    },
    {
        type: 'list',
        name: 'actividad',
        message: 'Escoge el tipo de actividad (Correr o Bicicleta): ',
        choices: Object.values(Actividades)
    },
    {
        type: 'checkbox',
        name: 'amigo',
        message: 'Escoge cuales son tus amigos: ',
        choices: Object.values(amigos)
    },
    {
        type: 'checkbox',
        name: 'grupo',
        message: 'Escoge cuales son tus grupos: ',
        choices: Object.values(grupos)
    },
    {
        type: 'checkbox',
        name: 'rutas',
        message: 'Escoge cuales son tus rutas: ',
        choices: Object.values(rutas)
    },
    ]).then((answers) => {
            nombre = answers.name;
            amigos = answers.amigo;
            grupos = answers.grupo;
            rutas = answers.rutas;
            actividad = answers.actividad;
            switch (answers["actividad"]) {
                case Actividades.Correr:
                    actividad = Actividad.Correr
                    break;
                case Actividades.Bicicleta:
                    actividad = Actividad.Bicicleta
                    break;
            }
    })
    let new_usuario = new Usuario(nombre);
    new_usuario.agregarActividad(actividad);
    amigos.forEach((amigo) => {
        new_usuario.agregarAmigo(amigo);
    });
    grupos.forEach((grupo) => {
        new_usuario.agregarGrupo(grupo);
    });  
    rutas.forEach((ruta) => {
        new_usuario.agregarRutas(ruta);
    });

    const numberString = new_usuario.Id.replace(/^id-/, '');
    const lastId = parseInt(numberString);
    database.get('ultimoidUnico').find({nombre: "id_unico"}).set("id", lastId).write();
    database.get('usuarios').push(new_usuario).write();

    promptUsuario();
}

/*-----------------ELIMINAR USUARIO-----------------*/
async function promptRemoveUsuario(): Promise<void>{
    console.clear()
    const respuesta = await inquirer.prompt({
        type: 'input',
        name: 'usuario',
        message: 'Escribe el nombre del grupo que deseas eliminar: :',
    });
    database.get('usuarios').remove({_nombre: respuesta.usuario}).write();
    promptUsuario();
}

/*-----------------ENSEÑAR USUARIOS-----------------*/
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
    promptUsuario();
}

/*-----------------MODIFICAR RUTA-----------------*/

// Cambia parámetro
async function modifyParamUsuario(usuario: string, enumerado: Usuario_enum): Promise<void>{
    console.clear();
    // Sacar el id de los usuarios para que escoja sus amigos 
    let amigos:string[] = [];
    let jsonUsuario = database;
            
    for(let i in jsonUsuario.toJSON().usuarios){
        amigos.push(jsonUsuario.toJSON().usuarios[i]._id);
    }

    // Sacar el id de los grupos para que escoja sus amigos 
    let grupos:string[] = [];
    let jsonGrupo = database;

    for(let i in jsonGrupo.toJSON().grupos){
        grupos.push(jsonGrupo.toJSON().grupos[i].id);
    }
    
    // Sacar las rutas para que las elija el usuario
    let rutas:string[] = [];
    let jsonRuta = database;
    
    for(let i in jsonRuta.toJSON().rutas){
        rutas.push(jsonRuta.toJSON().rutas[i].nombre);
    }

    if (enumerado === Usuario_enum.Nombre){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "nombre",
            message: "Introduzca nuevo nombre: "
        })
        database.get('usuarios').find({nombre: usuario}).set("nombre", respuesta.nombre).write()
    }
    else if (enumerado === Usuario_enum.Actividad){
        const respuesta = await inquirer.prompt({
            type: 'list',
            name: 'actividad',
            message: 'Escoge el tipo de actividad (Correr o Bicicleta): ',
            choices: Object.values(Actividades)
        })
        if(respuesta.actividad === "Bicicleta"){
            database.get('usuarios').find({nombre: usuario}).set("actividad", "Bicicleta").write()
        }else{
            database.get('usuarios').find({nombre: usuario}).set("actividad", "Correr").write()
        }
    }
    else if (enumerado === Usuario_enum.Amigo){
        const respuesta = await inquirer.prompt({
            type: "checkbox",
            name: "amigos",
            message: "Seleccione sus amigos: ",
            choices: Object.values(amigos)
        })

        database.get('usuarios').find({nombre: usuario}).set("amigos", respuesta.amigos).write()
    }
    else if (enumerado === Usuario_enum.Grupo){
        const respuesta = await inquirer.prompt({
            type: "checkbox",
            name: "grupos",
            message: "Seleccione sus grupos: ",
            choices: Object.values(grupos)
        })

        database.get('usuarios').find({nombre: usuario}).set("grupos", respuesta.grupos).write()
    }
    else if (enumerado === Usuario_enum.Rutas){
        const respuesta = await inquirer.prompt({
            type: "checkbox",
            name: "rutas",
            message: "Seleccione sus rutas: ",
            choices: Object.values(rutas)
        })

        database.get('usuarios').find({nombre: usuario}).set("amigos", respuesta.rutas).write()
    }

    
    promptUsuario();

}
// Enseña todos los parámetros y escoge que quiere modificar
async function modifyUsuario(): Promise<void>{
    console.clear();
    const respuesta_usuario = await inquirer.prompt({
        type: 'input',
        name: 'usuario',
        message: 'Escribe el nombre del usuario que deseas modificar: '
    })
    const usuario = respuesta_usuario.usuario
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Usuario_enum)
    }).then(answers => {
        switch (answers["command"]) {
            case Usuario_enum.Nombre:
                modifyParamUsuario(usuario, Usuario_enum.Nombre);
                break; 
            case Usuario_enum.Amigo:
                modifyParamUsuario(usuario, Usuario_enum.Amigo);
                break;
            case Usuario_enum.Rutas:
                modifyParamUsuario(usuario, Usuario_enum.Rutas);
                break;
            case Usuario_enum.Grupo:
                modifyParamUsuario(usuario, Usuario_enum.Grupo);
                break;
            case Usuario_enum.Actividad:
                modifyParamUsuario(usuario, Usuario_enum.Actividad);
                break;
        }
    })
}