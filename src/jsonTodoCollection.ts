import {Geolocalizacion, Ruta} from "./Ruta"
import { TodoCollection } from "./TodoCollection"
import * as lowdb from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
import { Actividad } from "./Actividad"
import { Reto } from "./Reto"
import { Grupo } from "./Grupo"

type schemaType = {
    rutas: Ruta[],
    grupos: Grupo[],
    retos: Reto[]
}

export class jsonTodoCollection extends TodoCollection{
    private database: lowdb.LowdbSync<schemaType>;

    constructor(){
        super()
        const low = require('lowdb');
        this.database = low(new FileSync('./src/json/database.json'))
        this.loadRuta();
        this.loadReto();
        this.loadGrupo();
    }

    loadRuta(){
        if (this.database.has('rutas').value()){
            const dbItem = this.database.get('rutas').value();
            let aux: Ruta;
            dbItem.forEach((element: any, index:number) =>{
                aux = new Ruta(
                    element.nombre as string,
                    element.inicio as Geolocalizacion,
                    element.final as Geolocalizacion,
                    element.longitud as number,
                    element.desnivel as number,
                    element.usuarios as string[],
                    element.actividad as Actividad,
                    element.calificacion as number
                )
                this.itemMapRuta.set(aux.nombre, aux);
            })
        }
    }

    loadReto(){
        if (this.database.has('rutas').value()){
            const dbItem = this.database.get('retos').value();
            let aux: Reto;
            dbItem.forEach((element: any, index:number) =>{
                aux = new Reto(
                    element.nombre as string,
                    element.rutas as string[],
                    element.actividad as Actividad,
                    element.usuarios as string[]
                )
                this.itemMapReto.set(aux.nombre, aux);
            })
        }
    }

    loadGrupo(){
        if (this.database.has('grupos').value()){
            const dbItem = this.database.get('grupos').value();
            let aux: Grupo;
            dbItem.forEach((element: any, index:number) =>{
                aux = new Grupo(
                    element.nombre as string,
                    element.miembrosID as string[]
                )
                this.itemMapGrupo.set(aux.nombre, aux);
            })
        }
    }

}