import { GeneradorIdUnicos } from "./GeneradorIdUnicos";
import {Actividad} from "./Actividad";
import { EstadisticasEntrenamiento } from "./EstadisticasEntrenamiento";

/**
 * Clase para Usuarios
 */
export class Usuario{
    
    private _id:string;
    private _nombre:string;
    private _actividad:Actividad[];
    private _amigos: string[];
    private _grupos: string[]; // _grupos CLASE
    private _estadisticas : EstadisticasEntrenamiento;

    private _rutas:string[]; // RUTAS CLASE
    private _retos:string[]; // _retos CLASE
    private _historicoRutas: Map<string, string[]>;

    /**
     * El constructor inicializa el id único del usuario , el _nombre pasado y el resto de atributos como vacíos 
     * @param name _nombre del usuario que se quiere crear
     */
    constructor(name:string){
        this._nombre = name;
        // Se genera el id único
        let generadorId = GeneradorIdUnicos.getInstance();
        this._id = generadorId.generateUniqueId();

        this._actividad =[];
    
    
    
        this._amigos = [];
        this._grupos = []; // _grupos CLASE
        this._estadisticas = new EstadisticasEntrenamiento();

    this._rutas = []; // RUTAS CLASE
    this._retos = []; // _retos CLASE
    this._historicoRutas = new Map<string, string[]>();
    }

    // Getters

    /**
     * Getter del _nombre del usuario
     * @returns el atributo que almacena el _nombre del usuario
     */
    get nombre(){
        return this._nombre;
    }

    /**
     * Getter del id del usuario
     * @returns el atributo que almacena el id del usuario
     */
    get Id(){
        return this._id;
    }
    
    /**
     * Getter de las actividades que realiza el  suario
     * @returns el atributo que almacena las actividades del usuario
     */
    get Actividad(){
        return this._actividad;
    }
    
    /**
     * Getter de los _amigos que tiene el usuario
     * @returns el atributo que almacena los _amigos del usuario
     */
    get amigos(){
        return this._amigos;
    }

    /**
     * Getter de los _grupos a los que pertenece lel usuario 
     * @returns el atributo que almacena los _grupos del usuario
     */
    get grupos(){
        return this._grupos;
    }
    /**
     * Getter de las estadísticas del usuario
     * @returns el atributo que almacena las estadísticas del usuario
     */
    get estadisticas(){
        return this._estadisticas;
    }

    /**
     * Getter de las rutas del usuario
     * @returns el atributo que almacena las rutas del usuario
     */
    get Rutas(){
        return this._rutas;
    }

    /**
     * Getter de los _retos del usuario
     * @returns el atributo que almacena los _retos que está realizando el  usuario
     */
    get retos(){
        return this._retos;
    }

    /**
     * Getter del histórico del usuario
     * @returns el atributo que almacena las el histórico de rutas que ha realizado el usuario
     */
    get Historico(){
        return this._historicoRutas;
    }
    
    // metodos para agregar elmiminar actividades.

    /**
     * Método para añadir una actividad a la lista 
     * @param actividad actividad a añadir a la lista
     */
    agregarActividad(actividad:Actividad){
        this._actividad.push(actividad);
    }

    /**
     * Método para eliminar actividades
     * @param index indice de la actividad que se quiere eliminar.
     */
    eliminarActividad(index:number){
        let sol:Actividad[] = [];
        for(let i = 0; i < this._actividad.length; i++){
            if(i != index){
                sol.push(this._actividad[i]);
            }
        }
        this._actividad = sol;
    }

    // metodos para agregar eliminar _grupos

    /**
     * Método para añadir un grupo a la lista, comprobando si ya está metido
     * @param id id del grupo a añadir
     */
    agregarGrupo(id:string){
        if(!this._grupos.includes(id)){
            this._grupos.push(id);
        }
    }

    /**
     * Método para eliminar grupo
     * @param id id del grupo que se quiere eliminar
     */
    eliminarGrupo(id:string){
        this._grupos = this._grupos.filter((grupo) => grupo != id);
    }

    // metodos para agregar eliminar rutas

    /**
     * Agrega una ruta a la lista de rutas
     * @param id id de la ruta a añadir
     */
    agregarRutas(id:string){
        if(!this._rutas.includes(id)){
            this._rutas.push(id);
        }
    }

    /**
     * Método pra eliminar la ruta pasada
     * @param id id de la ruta a eliminar
     */
    eliminarRutas(id:string){
        this._rutas = this._rutas.filter((ruta) => ruta != id);
        
    }

    // metodos para agregar eliminar _retos

    /**
     * Método para agregar retos
     * @param id id del reto a agregar
     */
    agregar_retos(id:string){
        if(!this._retos.includes(id)){
            this._retos.push(id);
        }
    }

    /**
     * Método para elminiar reto
     * @param id id del reto a eliminar
     */
    eliminar_retos(id:string){
        this._retos = this._retos.filter((reto) => reto != id);
    }

    // metodos para agregar eliminar _amigos

    /**
     * Método para agregar amigos
     * @param id id del amigo a agregar
     */
    agregarAmigo(id:string){
        if(!this._amigos.includes(id)){
            this._amigos.push(id);
        }
    }

    /**
     * Método para eliminar amigos
     * @param id id del amigo a eliminar
     */
    eliminarAmigo(id:string){
        this._amigos = this._amigos.filter((amigo) => amigo != id);
    }

    // metodos para agregar en el histórico de rutas.

    /**
     * Método para añadir ruta al historico
     * @param fecha fecha en la que se realizó la ruta
     * @param ruta ruta realizada
     */
    agregarHistorico(fecha:string, ruta:string){
        let fechaExiste = false;
        this._historicoRutas.forEach((array, elemento) =>{
            if(elemento == fecha){
                array.push(ruta);
                fechaExiste = true
            }
        });
        if(!fechaExiste){
            this._historicoRutas.set(fecha, [ruta]);
        }
    }
 

    // Métodos para actualizar estadísticas de entrenamiento

    /**
     * Actualizador de estadisticas pasandole los km y el desnivel realizado
     * @param km km realizados
     * @param desnivel desnivel realizado
     */
    actualizar_estadisticas(km: number, desnivel: number): void {
        this._estadisticas.actualizarEstadisticas(km, desnivel);
    }

    // Getters de las estadísticas

    /**
     * getter de las estadisticas de la semana
     */
    get EstadisticasSemana(){
        return this._estadisticas.obtenerEstadisticasSemana();
    }

    /**
     * getter de las estadisticas del mes
     */
    get EstadisticasMes(){
        return this._estadisticas.obtenerEstadisticasMes();
    }

    /**
     * getter de las estadisticas del año
     */
    get EstadisticasAno(){
        return this._estadisticas.obtenerEstadisticasAnio();
    }
    
}





