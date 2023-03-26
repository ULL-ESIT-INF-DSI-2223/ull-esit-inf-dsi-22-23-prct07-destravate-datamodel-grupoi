import inquirer from 'inquirer';
import FileSync from 'lowdb/adapters/FileSync';

import { promptUsuario } from './UsuarioInquirer';
import { GeneradorIdUnicos } from './GeneradorIdUnicos';
import { promptGrupo } from './GrupoInquirer'
import { promptReto } from './RetoInquirer';
import {promptRuta} from './RutaInquirer';

/*-----------------------------------DATABASE----------------------------------- */

const low = require('lowdb');
const database = low(new FileSync('./src/json/database.json'));

/*-----------------------------------COMANDOS----------------------------------- */

enum Options{
    Rutas = "Rutas",
    Usuarios = "Usuarios",
    Grupos = "Grupos",
    Retos = "Retos"
}

export enum Actividades{
    Correr = "Correr",
    Bicicleta = "Bicicleta"
}

export enum Ascendente_Descendente{
    Ascendente = "Ascendente",
    Descendente = "Descendente"
}

/*-----------------------------------APP----------------------------------- */

export function promptApp(): void{
    console.clear();
    let idUnico = database.toJSON().ultimoidUnico[0].id;
    let generadorId = GeneradorIdUnicos.getInstance();
    generadorId.modificarContador(idUnico + 1);
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
            case Options.Usuarios:
                promptUsuario();
                break;
        }
    })
}

promptApp();
