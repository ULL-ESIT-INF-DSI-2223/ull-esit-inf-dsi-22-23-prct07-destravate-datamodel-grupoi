import {Ruta} from "./Ruta"
import { Geolocalizacion } from "./Ruta";
import { Actividad } from "./Actividad";
import { Reto } from "./Reto";
import { Grupo } from "./Grupo";

type AppItem = {
    rutas: Ruta[],
    grupos: Grupo[],
    retos: Reto[]
}

export class TodoCollection{
    protected itemMapRuta = new Map<string, Ruta>();
    protected itemMapReto = new Map<string, Reto>();
    protected itemMapGrupo = new Map<string, Grupo>();

    constructor() {
        this.itemMapRuta = new Map<string, Ruta>();
        this.itemMapReto = new Map<string, Reto>();
        this.itemMapGrupo = new Map<string, Grupo>();
    }

    addRuta(nombre: string, inicio: Geolocalizacion, final: Geolocalizacion, longitud: number, desnivel: number, usuarios: string[], actividad: Actividad, calificacion: number){
        const ruta = new Ruta(nombre, inicio, final, longitud, desnivel, usuarios, actividad, calificacion);
        this.itemMapRuta.set(nombre, ruta);
    }

    deleteRuta(nombre: string){
        this.itemMapRuta.delete(nombre);
    }

    addGrupo(nombre: string, miembrosID: string[] = []){
        const grupo = new Grupo(nombre, miembrosID);
        this.itemMapGrupo.set(nombre, grupo);
    }

    deleteGrupo(nombre: string){
        this.itemMapGrupo.delete(nombre);
    }

    addReto(nombre: string, rutas: string[], actividad: Actividad, /*usuarios: Usuario*/ usuarios: string[]){
        const reto = new Reto(nombre, rutas, actividad, usuarios);
        this.itemMapReto.set(nombre, reto);
    }

    deleteReto(nombre: string){
        this.itemMapReto.delete(nombre);
    }
}