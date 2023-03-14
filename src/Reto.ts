import { Actividad } from "./Actividad";
import { Ruta } from "./Ruta";
import { Usuario } from "./Usuario";


/**
 * Clase para los retos
 * @class
 */
export class Reto{
    private static _counter = 0;
    private _id: number;
    private _nombre: string;
    private _rutas: Ruta[];
    private _actividad: Actividad;
    private _total: number;
    private _usuarios: Usuario[];

    /**
     * Constructor de Reto
     * @param nombre Nombre del reto
     * @param rutas Rutas que forman parte del reto
     * @param actividad Tipo de actividad del reto: bicicleta o correr
     * @param usuarios Usuarios que están realizando el reto
     */
    constructor(nombre: string, rutas: Ruta[], actividad: Actividad, usuarios: Usuario) {
        this._id = Reto._counter;
        Reto._counter += 1;
        this._nombre = nombre;
        this._rutas = rutas;
        this._actividad = actividad;
        this._rutas.forEach( element =>
            this._total += element.longitud
        );
        this._usuarios = usuarios;
    }

    /****************************Getters y Setters*******************************/
    /**
     * Getter del atributo privado _id
     * @return this.id
     */
    get id(): number {
        return this._id;
    }
    /**
     * Setter del atributo privado _id
     * @param value Nuevo valor para el atributo _id
     */
    set id(value: number) {
        this._id = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _nombre
     * @return this._nombre
     */
    get nombre(): string {
        return this._nombre;
    }
    /**
     * Setter del atributo privado _nombre
     * @param value Nuevo valor para el atributo _nombre
     */
    set nombre(value: string) {
        this._nombre = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _rutas
     * @return this._rutas
     */
    get rutas(): Ruta[] {
        return this._rutas;
    }
    /**
     * Setter del atributo privado _rutas
     * @param value Nuevo valor para el atributo _rutas
     */
    set rutas(value: Ruta[]) {
        this._rutas = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _actividad
     * @return this._actividad
     */
    get actividad(): Actividad {
        return this._actividad;
    }
    /**
     * Setter del atributo privado _actividad
     * @param value Nuevo valor para el atributo _actividad
     */
    set actividad(value: Actividad) {
        this._actividad = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _total
     * @return this._total
     */
    get total(): number {
        return this._total;
    }
    /**
     * Setter del atributo privado _total
     * @param value Nuevo valor para el atributo _total
     */
    set total(value: number) {
        this._total = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _usuarios
     * @return this._usuarios
     */
    get usuarios(): Usuario[] {
        return this._usuarios;
    }
    /**
     * Setter del atributo privado _usuarios
     * @param value Nuevo valor para el atributo _usuarios
     */
    set usuarios(value: Usuario[]) {
        this._usuarios = value;
    }
}