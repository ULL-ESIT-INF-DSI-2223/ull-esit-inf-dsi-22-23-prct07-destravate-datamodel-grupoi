import {Geolocalizacion, Ruta} from "./Ruta"
import { TodoCollection } from "./TodoCollection"
import * as lowdb from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
import { Actividad } from "./Actividad"

type schemaType = {
    rutas: Ruta[]
}

export class jsonTodoCollection extends TodoCollection{
    private database: lowdb.LowdbSync<schemaType>;

    constructor(){
        super()
        const low = require('lowdb');
        this.database = low(new FileSync('./src/json/database.json'))
        this.loadRuta();
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
}