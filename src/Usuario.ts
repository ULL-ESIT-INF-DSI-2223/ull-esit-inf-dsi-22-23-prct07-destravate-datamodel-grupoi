import { GeneradorIdUnicos } from "./GeneradorIdUnicos";
import {Actividad} from "./Actividad";


export class Usuario{
    /**
     * Atributo para almacenar el id único
     */
    private id:string;
    /**
     * Atributo para almacenar el nombre del usuario
     */
    private nombre:string;
    /**
     * Atributo para almacenar array de actividades que realiza el usuario bicicleta ó correr
     */
    private actividad:Actividad[];
    /**
     * Atributo para almacenar un array de ids de los amigos del usuario
     */
    private amigos: string[];
    /**
     * Atributo para almacenar un array con los grupos de amigos que tiene el usuario
     */
    private grupos: string[]; // GRUPOS CLASE
    /**
     * Atributo para almacenar las estadísticas de desnivel y cantidad de km recorridos en la semana mes y año
     */
    private estadisticas : {
        semana: {
            distancia: number;
            elevacion: number;
        };
        mes: {
            distancia: number;
            elevacion: number;
        };
        ano:{
            distancia: number;
            elevacion: number;
        };
    };

    /**
     * Atributo para almacenar un array con los ids de las rutas favoritas del usuario
     */
    private rutas:string[]; // RUTAS CLASE
    /**
     * Atributo para almacenar un string con los ids de los retos que el usuario está realizando actualmente
     */
    private retos:string[]; // RETOS CLASE
    /**
     * Atributo que almacena el historico de las rutas realizadas, almacenado la fecha y un array con los ids de las rutas realizadas en esa fecha
     */
    private historicoRutas: Map<string, string[]>;

    /**
     * El constructor inicializa el id único del usuario , el nombre pasado y el resto de atributos como vacíos 
     * @param name nombre del usuario que se quiere crear
     */
    constructor(name:string){
        this.nombre = name;
        // Se genera el id único
        let generadorId = GeneradorIdUnicos.getInstance();
        this.id = generadorId.generateUniqueId();

        this.actividad =[];
    
    
    
        this.amigos = [];
        this.grupos = []; // GRUPOS CLASE
        this.estadisticas = {
        semana: {
            distancia: 0,
            elevacion: 0,
        },
        mes: {
            distancia: 0,
            elevacion: 0,
        },
        ano:{
            distancia: 0,
            elevacion: 0,
        },
    };

    this.rutas = []; // RUTAS CLASE
    this.retos = []; // RETOS CLASE
    this.historicoRutas = new Map<string, string[]>();
    }

    // Getters

    /**
     * Getter del nombre del usuario
     * @returns el atributo que almacena el nombre del usuario
     */
    getNombre(){
        return this.nombre;
    }

    /**
     * Getter del id del usuario
     * @returns el atributo que almacena el id del usuario
     */
    getId(){
        return this.id;
    }
    
    /**
     * Getter de las actividades que realiza el  suario
     * @returns el atributo que almacena las actividades del usuario
     */
    getActividad(){
        return this.actividad;
    }
    
    /**
     * Getter de los amigos que tiene el usuario
     * @returns el atributo que almacena los amigos del usuario
     */
    getAmigos(){
        return this.amigos;
    }

    /**
     * Getter de los grupos a los que pertenece lel usuario 
     * @returns el atributo que almacena los grupos del usuario
     */
    getGrupos(){
        return this.grupos;
    }
    /**
     * Getter de las estadísticas del usuario
     * @returns el atributo que almacena las estadísticas del usuario
     */
    getEstadisticas(){
        return this.estadisticas;
    }

    /**
     * Getter de las rutas del usuario
     * @returns el atributo que almacena las rutas del usuario
     */
    getRutas(){
        return this.rutas;
    }

    /**
     * Getter de los retos del usuario
     * @returns el atributo que almacena los retos que está realizando el  usuario
     */
    getRetos(){
        return this.retos;
    }

    /**
     * Getter del histórico del usuario
     * @returns el atributo que almacena las el histórico de rutas que ha realizado el usuario
     */
    getHistorico(){
        return this.historicoRutas;
    }
    
    // metodos para agregar elmiminar actividades.

    /**
     * Método para añadir una actividad a la lista 
     * @param actividad actividad a añadir a la lista
     */
    agregarActividad(actividad:Actividad){
        this.actividad.push(actividad);
    }

    /**
     * Método para eliminar actividades
     * @param index indice de la actividad que se quiere eliminar.
     */
    eliminarActividad(index:number){
        let sol:Actividad[] = [];
        for(let i = 0; i < this.actividad.length; i++){
            if(i != index){
                sol.push(this.actividad[i]);
            }
        }
        this.actividad = sol;
    }

    // metodos para agregar eliminar grupos
    agregarGrupo(id:string){
        this.grupos.push(id);
    }

    eliminarGrupo(id:string){
        let sol:string[] = [];
        for(let i = 0; i < this.grupos.length; i++){
            if(this.grupos[i] != id){
                sol.push(this.grupos[i]);
            }
        }
        this.grupos = sol;
    }

    // metodos para agregar eliminar rutas
    agregarRutas(id:string){
        this.rutas.push(id);
    }

    eliminarRutas(id:string){
        let sol:string[] = [];
        for(let i = 0; i < this.rutas.length; i++){
            if(this.rutas[i] != id){
                sol.push(this.rutas[i]);
            }
        }
        this.rutas = sol;
    }

    // metodos para agregar eliminar retos
    agregarRetos(id:string){
        this.retos.push(id);
    }

    eliminarRetos(id:string){
        let sol:string[] = [];
        for(let i = 0; i < this.retos.length; i++){
            if(this.retos[i] != id){
                sol.push(this.retos[i]);
            }
        }
        this.retos = sol;
    }

    // metodos para agregar eliminar Amigos
    agregarAmigo(id:string){
        this.amigos.push(id);
    }

    eliminarAmigo(id:string){
        let sol:string[] = [];
        for(let i = 0; i < this.amigos.length; i++){
            if(this.amigos[i] != id){
                sol.push(this.amigos[i]);
            }
        }
        this.amigos = sol;
    }

    // metodos para agregar en el histórico de rutas.
    agregarHistorico(fecha:string, ruta:string){
        let fechaExiste = false;
        this.historicoRutas.forEach((array, elemento) =>{
            if(elemento == fecha){
                array.push(ruta);
                fechaExiste = true
            }
        });
        if(!fechaExiste){
            this.historicoRutas.set(fecha, [ruta]);
        }
    }
 
    // Método de utilidad
    private getWeekNumber(date: Date): number {
        const onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
    }

    // Métodos para actualizar estadísticas de entrenamiento
  actualizarEstadisticas(km: number, desnivel: number): void {
    const hoy = new Date();
    const semana = this.getWeekNumber(hoy);
    const mes = hoy.getMonth() + 1;
    const año = hoy.getFullYear();

    this.estadisticas.semana.distancia += km;
    this.estadisticas.mes.distancia += km;
    this.estadisticas.ano.distancia += km;
    this.estadisticas.semana.elevacion += desnivel;
    this.estadisticas.mes.elevacion += desnivel;
    this.estadisticas.ano.elevacion += desnivel;

    // Si se cambió de semana, se reinicia el contador de km y desnivel de la semana
    if (semana !== this.getWeekNumber(new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000))) {
      this.estadisticas.semana.distancia = 0;
      this.estadisticas.semana.elevacion = 0;
    }
    // Si se cambió de mes, se reinicia el contador de km y desnivel del mes
    if (mes !== new Date(hoy.getTime() - 24 * 60 * 60 * 1000).getMonth() + 1) {
        this.estadisticas.mes.distancia = 0;
        this.estadisticas.mes.elevacion = 0;
      }
      // Si se cambió de año, se reinicia el contador de km y desnivel del año
      if (año !== new Date(hoy.getTime() - 24 * 60 * 60 * 1000).getFullYear()) {
        this.estadisticas.ano.distancia = 0;
        this.estadisticas.ano.elevacion = 0;
      }

    }
    
}





