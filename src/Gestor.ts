import inquirer from 'inquirer';
import { Usuario } from './Usuario'
import { Grupo } from './Grupo'
import { Ruta } from './Ruta';
import { Reto } from './Reto';
import { GeneradorIdUnicos } from './GeneradorIdUnicos';
import { EstadisticasEntrenamiento } from './EstadisticasEntrenamiento';
import { promptApp } from './index';
import FileSync from 'lowdb/adapters/FileSync';
import {Ascendente_Descendente} from './index'
import { Actividades } from "./index"

import { promptAddUsuario } from './UsuarioInquirer';

const low = require('lowdb');


class Gestor {
  private _users = new Map<string, Usuario>();
  private _grupos = new Map<string, Grupo>();
  private _rutas = new Map<string, Ruta>();
  private _retor = new Map<string, Reto>();
  private _userLogged: Usuario;

    constructor() {
      this.loadFromJSON();
      this.askUsername()
        .then(async username => {
          this.logIn(username);
        })
        .catch(async error => {
          console.log(error);
        });
    }
  
    async askUsername(): Promise<string> {
      const { username } = await inquirer.prompt({
        type: 'input',
        name: 'username',
        message: 'Ingrese su nombre de usuario:',
      });
      return username;
    }
  
  public async logIn(username: string) {
    const user = this._users.get(username);
    if (user) {
      this._userLogged = user;
      console.error(`El usuario ${username} ha iniciado sesión.`);
      const { accion } = await inquirer.prompt({
        type: 'list',
        name: 'accion',
        message: 'Seleccione una opción',
        choices: ['Ver Usuarios', 'Ver Rutas', 'Ver Grupos', 'Crear Grupo', 'Clear', 'Exit']
      });
      switch(accion) {
        case "Ver Usuarios": {
          this.verUsuarios();
        }
        break;

        case "Ver Rutas": {
          this.verRutas();
        }
        break;

        case "Ver Grupos": {
          this.verGrupos();
        } 
        break;

        case "Crear Grupo": {
          this.crearGrupo();
        }
        break;

        case "Clear": {
          console.clear();
          this.logIn(this._userLogged.nombre);
        }
        break;

        case "Exit": {
          process.exit();
        }
        break;
      }
    } else {
      console.error(`El usuario ${username} no está registrado.`);
      this.askRegister(username);
    }
  }

  async askRegister(username: string): Promise<void> {
    const { accion } = await inquirer.prompt({
      type: 'list',
      name: 'accion',
      message: '¿Quiere registrarse?',
      choices: ['Yes', 'No']
    });
    if (accion === "Yes") { console.clear(); this.register(username);}
    else { 
      console.clear();
      this.askUsername()
      .then(async username => {
        this.logIn(username);
      })
      .catch(async error => {
        console.log(error);
      });
    }
  }

  public register(username: string): void {
    const user = new Usuario(username);
    this._users.set(user.nombre, user);
    console.log(`Se ha registado ${user.nombre} correctamente`);
    this.logIn(username);
  }

  public async verUsuarios(): Promise<void> {
    const usuarios = Array.from(this._users.values());
    if (usuarios.length === 0) {
      console.log('No hay usuarios registrados.');
      return;
    }
    const usuarioNames = usuarios.map((usuario) => usuario.nombre);
    const { usuarioSeleccionado, accion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'usuarioSeleccionado',
        message: 'Seleccione un usuario:',
        choices: usuarioNames,
      },
      {
        type: 'list',
        name: 'accion',
        message: 'Seleccione una acción:',
        choices: ['Ver información', 'Agregar amigo', 'Eliminar amigo'],
      },
    ]);
    const usuario = this._users.get(usuarioSeleccionado);
    if (usuario) {
      console.log(`Información del usuario ${usuario.nombre}:`);
      console.log(`ID: ${usuario.Id}`);
      console.log(`Nombre de usuario: ${usuario.nombre}`);
      if (accion === 'Agregar amigo') {
        this._userLogged.agregarAmigo(usuario.Id);
      } else if (accion == 'Eliminar amigo') {
        this._userLogged.eliminarAmigo(usuario.Id);
      }
    }
    this.logIn(this._userLogged.nombre);
  }


public async verRutas(): Promise<void> {
    const rutas = Array.from(this._rutas.values());
    if (rutas.length === 0) {
      console.log('No hay rutas registradas.');
      return;
    }
    const rutasNames = rutas.map((ruta) => ruta.nombre);
    const { usuarioSeleccionado: rutaSeleccionada, accion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'usuarioSeleccionado',
        message: 'Seleccione un usuario:',
        choices: rutasNames,
      },
      {
        type: 'list',
        name: 'accion',
        message: 'Seleccione una acción:',
        choices: ['Ver información'],
      },
    ]);
    const ruta = this._rutas.get(rutaSeleccionada);
    if (ruta) {
      console.log(`Información de la ruta ${ruta.nombre}:`);
      console.log(`ID: ${ruta.id}`);
      console.log(`Nombre de ruta: ${ruta.nombre}`);
      console.log(`Inicio: Latitud (${ruta.inicio.latitud}), Longitud(${ruta.inicio.longitud})`);
      console.log(`Final: Latitud (${ruta.final.latitud}), Longitud(${ruta.final.longitud})`);
      console.log(`Longitud: ${ruta.longitud}`);
      console.log(`Desnivel: ${ruta.desnivel}`);
      console.log(`Calificación: ${ruta.calificacion}`);
    }
    this.logIn(this._userLogged.nombre);
  }

  public async verGrupos(): Promise<void> {
    const grupos = Array.from(this._grupos.values());
    if (grupos.length === 0) {
      console.log('No hay grupos registrados.');
      return;
    }
    const grupoNames = grupos.map((grupo) => grupo.nombre);
    const { grupoSeleccionado, accion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'grupoSeleccionado',
        message: 'Seleccione un grupo:',
        choices: grupoNames,
      },
      {
        type: 'list',
        name: 'accion',
        message: 'Seleccione una acción:',
        choices: ['Ver información', 'Unirse al grupo', 'Borrar el grupo'],
      },
    ]);
    const grupo = this._grupos.get(grupoSeleccionado);
    if (grupo) {
      console.log(`Información del grupo ${grupo.nombre}:`);
      console.log(`ID: ${grupo.id}`);
      console.log(`Nombre de grupo: ${grupo.nombre}`);
      console.log(`Número de miembros: ${grupo.miembrosID.length}`);
      if (accion === 'Unirse al grupo') {
        grupo.agregarMiembro(this._userLogged.Id);
        console.log(`Se ha unido al grupo ${grupo.nombre}.`);
      } else if (accion === 'Borrar el grupo') {
        if (grupo.propietarioID === this._userLogged.Id) { 
          this._grupos.delete(grupoSeleccionado);
          console.log(`Se ha borrado el grupo ${grupo.nombre}.`);
        } else {
          console.error(`No puede borrar el grupo ${grupo.nombre} porque no es el propietario.`);
        }
      }
    }
    this.logIn(this._userLogged.nombre);
  }

  public async crearGrupo(): Promise<void> {
    const { nombre, descripcion } = await inquirer.prompt([
      {
        type: 'input',
        name: 'nombre',
        message: 'Introduzca el nombre del grupo:',
      },
    ]);
    const grupo = new Grupo(nombre, [this._userLogged.Id]);
    grupo.propietarioID = this._userLogged.Id;
    this._grupos.set(grupo.id, grupo);
    console.log(`El grupo ${nombre} ha sido creado con éxito.`);
    this.logIn(this._userLogged.nombre);
  }
  
  public actualizarJSON(): void { return } // TODO
  
  public loadFromJSON(): void {
    const database = low(new FileSync('./src/json/database.json'));
    console.clear();
    
    let jsonUsuario = database.toJSON();

    for (let i in jsonUsuario.usuarios){
      let user = new Usuario(jsonUsuario.usuarios[i]._nombre);
      user.Id = jsonUsuario.usuarios[i]._id; 
      user.actividad = jsonUsuario.usuarios[i]._actividad; 
      user.amigos = jsonUsuario.usuarios[i]._amigos;
      user.estadisticas = jsonUsuario.usuarios[i]._estadisticas;  
      user.rutas = jsonUsuario.usuarios[i]._rutas; 
      user.retos = jsonUsuario.usuarios[i]._retos;
      user.historicoRutas = jsonUsuario.usuarios[i]._historicoRutas;
      this._users.set(user.nombre, user);
    }

    let jsonGrupo = database.toJSON().grupos;
    for (let i in jsonGrupo) {
      let group = new Grupo(jsonGrupo[i]._nombre, jsonGrupo[i]._miembrosID) //undefined
      group.id = jsonGrupo[i]._id;
      group.estadisticas = jsonGrupo[i]._estadisticas;
      group.historicoRutas = jsonGrupo[i]._historicoRutas;
      group.ranking = jsonGrupo[i]._ranking;
      group.rutasFav = jsonGrupo[i]._rutasFav;
      this._grupos.set(group.nombre, group);
    }

    let jsonRuta = database.toJSON().rutas;
    for (let i in jsonRuta) {
      let ruta = new Ruta(jsonRuta[i]._nombre, jsonRuta[i]._inicio, jsonRuta[i]._final, jsonRuta[i]._longitud, jsonRuta[i]._desnivel, jsonRuta[i]._usuarios, jsonRuta[i]._actividad, jsonRuta[i]._calificacion)
      this._rutas.set(ruta.nombre, ruta);
    }  
  }
}  

const gest = new Gestor;