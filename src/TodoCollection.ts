import {Ruta} from "./Ruta"
import { Geolocalizacion } from "./Ruta";
import { Actividad } from "./Actividad";
type AppItem = {

    rutas: Ruta[]
}

export class TodoCollection{
    protected itemMapRuta = new Map<string, Ruta>();

    constructor() {
        this.itemMapRuta = new Map<string, Ruta>();
    }

    addRuta(nombre: string, inicio: Geolocalizacion, final: Geolocalizacion, longitud: number, desnivel: number, usuarios: string[], actividad: Actividad, calificacion: number){
        const ruta = new Ruta(nombre, inicio, final, longitud, desnivel, usuarios, actividad, calificacion);
        this.itemMapRuta.set(nombre, ruta);
    }

    deleteRuta(nombre: string){
        this.itemMapRuta.delete(nombre);
    }
}