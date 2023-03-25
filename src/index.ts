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
    Atras = "Atras"
}
enum Commands_Grupo{
    Añadir_grupo = "Añadir grupo",
    Borrar_grupo = "Borrar grupo",
    Modificar_grupo = "Modificar grupo",
    Enseñar_grupos = "Enseñar grupos",
    Atras = "Atras"
}
enum Commands_Reto{
    Añadir_reto = "Añadir reto",
    Borrar_reto = "Borrar reto",
    Modificar_reto = "Modificar reto",
    Enseñar_retos = "Enseñar retos",
    Atras = "Atras"
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
enum Reto_enum{
    Nombre = "Nombre",
    Rutas = "Rutas",
    Actividad = "Actividad"
}
enum Grupo_enum{
    Nombre = "Nombre",
    Miembros = "Miembros",
    Total = "Total"
}
enum Ruta_Ordenar{
    Nombre = "Nombre",
    Usuarios = "Número de usuarios",
    Longitud = "Longitud",
    Calificacion = "Calificacion",
    Actividad = "Actividad",
    Atras = "Atras"
}
enum Grupo_Ordenar{
    Nombre = "Nombre",
    Total = "Total",
    Miembros = "Miembros",
    Atras = "Atras"
}
enum Reto_Ordenar{
    Nombre = "Nombre",
    Usuarios = "Número de usuarios",
    Total = "Cantidad de kilómetros",
    Atras = "Atras"
}
enum Ascendente_Descendente{
    Ascendente = "Ascendente",
    Descendente = "Descendente"
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
        message: 'Escribe el nombre de la ruta que deseas eliminar: ',
    });
    database.get('rutas').remove({nombre: respuesta.ruta}).write();
    promptRuta();
}

/*-----------------ENSEÑAR RUTAS-----------------*/
// Enseñar opciones de enseñar rutas
// Especificar ascendente o descendente
// 
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
                console.log(JSON.stringify(database.get('rutas').sortBy('nombre').value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Longitud){
                console.log(JSON.stringify(database.get('rutas').sortBy('longitud').value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Actividad){
                console.log(JSON.stringify(database.get('rutas').sortBy('actividad').value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Calificacion){
                console.log(JSON.stringify(database.get('rutas').sortBy('calificacion').value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Usuarios){
                console.log(JSON.stringify(database.get('rutas').sortBy((ruta: any) => ruta.usuario.length).value(), null, '\t'));
            }else{
                promptRuta();
            }
        } else{
            if (tipo === Ruta_Ordenar.Nombre){
                console.log(JSON.stringify(database.get('rutas').sortBy('nombre').reverse().value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Longitud){
                console.log(JSON.stringify(database.get('rutas').sortBy('longitud').reverse().value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Actividad){
                console.log(JSON.stringify(database.get('rutas').sortBy('actividad').reverse().value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Calificacion){
                console.log(JSON.stringify(database.get('rutas').sortBy('calificacion').reverse().value(), null, '\t'));
            }else if (tipo === Ruta_Ordenar.Usuarios){
                console.log(JSON.stringify(database.get('rutas').sortBy((ruta: any) => ruta.usuario.length).reverse().value(), null, '\t'));
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

/*-----------------------------------RETOS----------------------------------- */
async function promptReto(): Promise<void>{
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
    let rutas: Ruta[]
    let actividad = Actividad.Bicicleta, total = 0, suarios = ["1"]
    const answers = await inquirer.prompt([
    {
        type: "input",
        name: "name",
        message: "Introduce el nombre del reto: "
    },
    {
        type: "input",
        name: "rutas",
        message: "Introduce el nombre"
    },
    {
        type: 'list',
        name: 'actividad',
        message: 'Escoge el tipo de actividad (Correr o Bicicleta): ',
        choices: Object.values(Actividades)
    },
    ]).then((answers) => {
            nombre = answers.name;
            rutas = answers.rutas;
            switch (answers["actividad"]) {
                case Actividades.Correr:
                    actividad = Actividad.Correr
                    break;
                case Actividades.Bicicleta:
                    actividad = Actividad.Bicicleta
                    break;
            }
    })

    // Aqui el total deberia tener otra forma ya que se deberia recorrer las rutas y calcularlo
    const new_reto = {
        "nombre": nombre,
        "rutas": [

        ],
        "actividad": actividad,
        "total": total,
        "usuarios": [
            "1"
        ]
    }
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
                console.log(JSON.stringify(database.get('retos').sortBy('nombre').value(), null, '\t'));
            }else if (tipo === Reto_Ordenar.Usuarios){
                console.log(JSON.stringify(database.get('retos').sortBy((reto: any) => reto.usuario.length).value(), null, '\t'));
            }else if (tipo === Reto_Ordenar.Total){
                console.log(JSON.stringify(database.get('retos').sortBy('total').value(), null, '\t'));
            }else{
                promptReto();
            }
        } else{
            if (tipo === Reto_Ordenar.Nombre){
                console.log(JSON.stringify(database.get('retos').sortBy('nombre').reverse().value(), null, '\t'));
            }else if (tipo === Reto_Ordenar.Usuarios){
                console.log(JSON.stringify(database.get('retos').sortBy((reto: any) => reto.usuario.length).reverse().value(), null, '\t'));
            }else if (tipo === Reto_Ordenar.Total){
                console.log(JSON.stringify(database.get('retos').sortBy('total').reverse().value(), null, '\t'));
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

/*-----------------MODIFICAR RUTA-----------------*/

// Cambia parámetro
async function modifyParamReto(reto: string, enumerado: Reto_enum): Promise<void>{
    console.clear();

    if (enumerado === Reto_enum.Nombre){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "nombre",
            message: "Introduzca nuevo nombre: "
        })
        database.get('retos').find({nombre: reto}).set("nombre", respuesta.nombre).write()
        colectionMain.loadReto()
    }
    else if (enumerado === Reto_enum.Rutas){
        const respuesta = await inquirer.prompt({
            type: "number",
            name: "rutas",
            message: "Introduzca nuevas rutas: "
        })
        // ESTO NO ESTÁ BIEN
        database.get('retos').find({nombre: reto}).set("rutas", parseInt(respuesta.rutas)).write()
        colectionMain.loadReto()
    }
    else if (enumerado === Reto_enum.Actividad){
        const respuesta = await inquirer.prompt({
            type: 'list',
            name: 'actividad',
            message: 'Escoge el tipo de actividad (Correr o Bicicleta): ',
            choices: Object.values(Actividades)
        })
        if(respuesta.actividad === "Bicicleta"){
            database.get('retos').find({nombre: reto}).set("actividad", "Bicicleta").write()
            colectionMain.loadReto()
        }else{
            database.get('retos').find({nombre: reto}).set("actividad", "Correr").write()
            colectionMain.loadReto()
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
        }
    })
}

/*-----------------------------------GRUPOS----------------------------------- */
async function promptGrupo(): Promise<void>{
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
    const answers = await inquirer.prompt([
    {
        type: "input",
        name: "name",
        message: "Introduce el nombre del grupo: "
    },
    ]).then((answers) => {
            nombre = answers.name;
    })

    // Aqui el total deberia tener otra forma ya que se deberia recorrer las rutas y calcularlo
    const new_grupo = {
        "nombre": nombre,
        "miembrosID": [
            "1"
        ]
    }
    database.get('grupos').push(new_grupo).write();
    promptGrupo();
}

/*-----------------ELIMINAR RETO-----------------*/
async function promptRemoveGrupo(): Promise<void>{
    console.clear()
    const respuesta = await inquirer.prompt({
        type: 'input',
        name: 'grupo',
        message: 'Escribe el nombre del grupo que deseas eliminar: ',
    });
    database.get('grupos').remove({nombre: respuesta.grupo}).write();
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
                //console.log(JSON.stringify(database.get('grupos').sortBy((reto: any) => reto.usuario.length).value(), null, '\t'));
            }else if (tipo === Grupo_Ordenar.Total){
                console.log("Funcion no implementada")
                //console.log(JSON.stringify(database.get('grupos').sortBy('total').value(), null, '\t'));
            }else{
                promptGrupo();
            }
        } else{
            if (tipo === Grupo_Ordenar.Nombre){
                console.log(JSON.stringify(database.get('grupos').sortBy('nombre').reverse().value(), null, '\t'));
            }else if (tipo === Grupo_Ordenar.Miembros){
                console.log("Funcion no implementada")
                //console.log(JSON.stringify(database.get('grupos').sortBy((reto: any) => reto.usuario.length).reverse().value(), null, '\t'));
            }else if (tipo === Grupo_Ordenar.Total){
                console.log("Funcion no implementada")
                //console.log(JSON.stringify(database.get('grupos').sortBy('total').reverse().value(), null, '\t'));
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

/*-----------------MODIFICAR RUTA-----------------*/

// Cambia parámetro
async function modifyParamGrupo(grupo: string, enumerado: Grupo_enum): Promise<void>{
    console.clear();

    if (enumerado === Grupo_enum.Nombre){
        const respuesta = await inquirer.prompt({
            type: "input",
            name: "nombre",
            message: "Introduzca nuevo nombre: "
        })
        database.get('grupos').find({nombre: grupo}).set("nombre", respuesta.nombre).write()
        colectionMain.loadReto()
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
            case Grupo_enum.Total:
                modifyParamGrupo(grupo, Grupo_enum.Total);
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
            case Options.Retos:
                promptReto();
                break;
            case Options.Grupos:
                promptGrupo();
                break;
        }
    })
}

promptApp();
