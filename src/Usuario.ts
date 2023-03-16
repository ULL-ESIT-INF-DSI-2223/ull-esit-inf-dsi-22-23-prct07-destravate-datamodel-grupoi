import { GeneradorIdUnicos } from "./GeneradorIdUnicos";
import {Actividad} from "./Actividad";

export class Usuario{
    private id:string;
    private nombre:string;
    private actividad:Actividad[];
    private amigos: string[];
    private grupos: string[]; // GRUPOS CLASE
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

    private rutas:string[]; // RUTAS CLASE
    private retos:string[]; // RETOS CLASE
    private historicoRutas: Map<string, string[]>;

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

    getNombre(){
        return this.nombre;
    }

    getId(){
        return this.id;
    }
    
    getActividad(){
        return this.actividad;
    }
    
    getAmigos(){
        return this.amigos;
    }

    getGrupos(){
        return this.grupos;
    }

    getEstadisticas(){
        return this.estadisticas;
    }
    getRutas(){
        return this.rutas;
    }

    getRetos(){
        return this.retos;
    }

    getHistorico(){
        return this.historicoRutas;
    }
    
    // metodos para agregar elmiminar actividades.
    agregarActividad(actividad:Actividad){
        this.actividad.push(actividad);
    }

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





