import { expect } from 'chai';
import 'mocha';
import { Usuario } from '../src/Usuario';
import { Actividad } from '../src/Actividad';
import { EstadisticasEntrenamiento } from '../src/EstadisticasEntrenamiento';

let Juan = new Usuario("Juan");
let Antonio = new Usuario("Antonio");

describe('Clase Usuario', () => {

    describe('Instancia', () => {
      it('Se debe poder instannciar una instancia de esta clase', () => {
        expect(Juan).to.instanceOf(Usuario);
      });
      it('Se debe poder instannciar una instancia de esta clase', () => {
        expect(Antonio).to.instanceOf(Usuario);
      });
    });

    describe('Getters de id y nombre', () => {
        it('El getter del nombre de Juan', () => {
          expect(Juan.nombre).to.equal("Juan");
        });
        it('Getter del nombre de Antonio', () => {
          expect(Antonio.nombre).to.equal("Antonio");
        });
        it('Getter del nombre de id de Juan', () => {
            expect(Juan.Id).to.equal("id-6");
        });
        it('Getter del nombre de id de Antonio', () => {
            expect(Antonio.Id).to.equal("id-7");
        });
      });

    describe('Getters y modificadores de Actividades', () => {
        it('Getter la actividad que realiza Antonio', () => {
            Antonio.agregarActividad(Actividad.Correr);
            expect(Antonio.Actividad).to.equal(Actividad.Correr);
        });
        it('Getter la actividad que realiza Juan', () => {
            Juan.agregarActividad(Actividad.Bicicleta);
            expect(Juan.Actividad).to.equal(Actividad.Bicicleta);
        });
    });

    describe('Getters y modificadores de Amigos', () => {
        it('Getter del amigo que se añade a Antonio, se le añade el id de Juan', () => {
            Antonio.agregarAmigo("id-6");
            expect(Antonio.amigos).to.eql(["id-6"]);
        });
        it('Si se añade un amigo que ya se habia añadido antes no lo añade', () => {
            Antonio.agregarAmigo("id-6");
            expect(Antonio.amigos).to.eql(["id-6"]);
        });
        it('Getter del amigo que se añade a Juan, se le añade el id de Antonio', () => {
            Juan.agregarAmigo("id-7");
            expect(Juan.amigos).to.eql(["id-7"]);
        });
        it('Getter de los amigos de Antonio cuando se elimina juan', () => {
            Antonio.eliminarAmigo("id-6");
            expect(Antonio.amigos).to.eql([]);
        });
        it('Getter de los amigos de Juan cuando se elimina Antoio', () => {
            Juan.eliminarAmigo("id-7");
            expect(Juan.amigos).to.eql([]);
        });

        
    });

    describe('Getters y modificadores de Grupos', () => {
        it('Getter del Grupo que se añade a Antonio, se le añade el id id-6', () => {
            Antonio.agregarGrupo("id-6");
            expect(Antonio.grupos).to.eql(["id-6"]);
        });
        it('Si se añade un grupo que ya estaba añadido no se añade', () => {
            Antonio.agregarGrupo("id-6");
            expect(Antonio.grupos).to.eql(["id-6"]);
        });
        it('Getter del grupo que se añade a Juan, se le añade el id id-7', () => {
            Juan.agregarGrupo("id-7");
            expect(Juan.grupos).to.eql(["id-7"]);
        });
        it('Getter de los grupos de Antonio cuando se elimina el que tiene id-6', () => {
            Antonio.eliminarGrupo("id-6");
            expect(Antonio.grupos).to.eql([]);
        });
        it('Getter de los amigos de Juan cuando se elimina el que tiene id-7', () => {
            Juan.eliminarGrupo("id-7");
            expect(Juan.grupos).to.eql([]);
        });

        
    });

    describe('Getters y modificadores de Rutas', () => {
        it('Getter de la Ruta que se añade a Antonio, se le añade el id id-6', () => {
            Antonio.agregarRutas("id-6");
            expect(Antonio.Rutas).to.eql(["id-6"]);
        });
        it('Si se añade una ruta que ya estaba no se añade', () => {
            Antonio.agregarRutas("id-6");
            expect(Antonio.Rutas).to.eql(["id-6"]);
        });
        it('Getter de la ruta que se añade a Juan, se le añade el id id-7', () => {
            Juan.agregarRutas("id-7");
            expect(Juan.Rutas).to.eql(["id-7"]);
        });
        it('Getter de las Rutas de Antonio cuando se elimina el que tiene id-6', () => {
            Antonio.eliminarRutas("id-6");
            expect(Antonio.Rutas).to.eql([]);
        });
        it('Getter de las Rutas de Juan cuando se elimina el que tiene id-7', () => {
            Juan.eliminarRutas("id-7");
            expect(Juan.Rutas).to.eql([]);
        });

        
    });

    describe('Getters y modificadores de Retos', () => {
        it('Getter del Reto que se añade a Antonio, se le añade el id id-6', () => {
            Antonio.agregar_retos("id-6");
            expect(Antonio.retos).to.eql(["id-6"]);
        });
        it('Si se añade un reto que ya estaba añadido no se añade', () => {
            Antonio.agregar_retos("id-6");
            expect(Antonio.retos).to.eql(["id-6"]);
        });
        it('Getter de los Retos que se añade a Juan, se le añade el id id-7', () => {
            Juan.agregar_retos("id-7");
            expect(Juan.retos).to.eql(["id-7"]);
        });
        it('Getter de los Retos de Antonio cuando se elimina el que tiene id-6', () => {
            Antonio.eliminar_retos("id-6");
            expect(Antonio.retos).to.eql([]);
        });
        it('Getter de los Retos de Juan cuando se elimina el que tiene id-7', () => {
            Juan.eliminar_retos("id-7");
            expect(Juan.retos).to.eql([]);
        });

        
    });
    
    describe('Getters y modificadores del Historico de rutas realizadas', () => {
        it('Getter del Historico que se añade a Antonio, se le añade el id id-6 en el día 24/03, getter del dia', () => {
            Antonio.agregarHistorico("24/03", "id-6");
            expect(Antonio.Historico.get("24/03")).to.eql(["id-6"]);
        });
        it('Getter del Historico que se añade a Antonio, se le añade el id id-7 en el día 24/03, getter de ese dia', () => {
            Antonio.agregarHistorico("24/03", "id-7");
            expect(Antonio.Historico.get("24/03")).to.eql(["id-6", "id-7"]);
        });
        it('Getter del Historico que se añade a Antonio, se le añade el id id-8 en el día 25/03, getter de ese dia', () => {
            Antonio.agregarHistorico("25/03", "id-8");
            expect(Antonio.Historico.get("25/03")).to.eql(["id-8"]);
        });
    });

    describe('Estadísticas del usuario', () => {
        Antonio.actualizar_estadisticas(10, 200);
        it('Sis se actualizan las estadísticas de antonio añadiendo 10 km y 200 metros de desnicvel tinen que aparecer en las estadisticas anuales', () => {
            expect(Antonio.EstadisticasAno.km).to.eql(10);
            expect(Antonio.EstadisticasAno.desnivel).to.eql(200);
        });
        it('Sis se actualizan las estadísticas de antonio añadiendo 10 km y 200 metros de desnicvel tinen que aparecer en las estadisticas mensuales', () => {
            expect(Antonio.EstadisticasMes.km).to.eql(10);
            expect(Antonio.EstadisticasMes.desnivel).to.eql(200);
        });
        it('Sis se actualizan las estadísticas de antonio añadiendo 10 km y 200 metros de desnicvel tinen que aparecer en las estadisticas semanal', () => {
            expect(Antonio.EstadisticasSemana.km).to.eql(10);
            expect(Antonio.EstadisticasSemana.desnivel).to.eql(200);
        });
        it('El getter de las estadisticas tiene que dar lo mismo que arriba', () => {
            expect(Antonio.estadisticas.obtenerEstadisticasAnio().km).to.eql(10);
        });
    });
});
