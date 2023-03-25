import {Ruta} from "./Ruta"
import { Geolocalizacion } from "./Ruta";
import { Actividad } from "./Actividad";
import { Reto } from "./Reto";
type AppItem = {

    rutas: Ruta[],
    retos: Reto[]
}

export class TodoCollection{
    protected itemMapRuta = new Map<string, Ruta>();
    protected itemMapReto = new Map<string, Reto>();

    constructor() {
        this.itemMapRuta = new Map<string, Ruta>();
        this.itemMapReto = new Map<string, Reto>();
    }

    addRuta(nombre: string, inicio: Geolocalizacion, final: Geolocalizacion, longitud: number, desnivel: number, usuarios: string[], actividad: Actividad, calificacion: number){
        const ruta = new Ruta(nombre, inicio, final, longitud, desnivel, usuarios, actividad, calificacion);
        this.itemMapRuta.set(nombre, ruta);
    }

    deleteRuta(nombre: string){
        this.itemMapRuta.delete(nombre);
    }

    addReto(nombre: string, rutas: Ruta[], actividad: Actividad, /*usuarios: Usuario*/ usuarios: string[]){
        const reto = new Reto(nombre, rutas, actividad, usuarios);
        this.itemMapReto.set(nombre, reto);
    }

    deleteReto(nombre: string){
        this.itemMapReto.delete(nombre);
    }
}