import { expect } from 'chai';
import 'mocha';
import { GeneradorIdUnicos } from '../src/GeneradorIdUnicos';

let generador = GeneradorIdUnicos.getInstance();

describe('Gnerador de Id Unico', () => {

    describe('Instancia', () => {
      it('Se debe poder instannciar un objeto de id, que será la única instancia de esta clase', () => {
        expect(generador).to.instanceOf(GeneradorIdUnicos);
      });
      it('Si se vuelve a instanciar sigue siendo una instancia y será la misma', () => {
        let generador2 = GeneradorIdUnicos.getInstance();
        expect(generador2).to.instanceOf(GeneradorIdUnicos);
      });
    });
    describe('Generar Id', () => {
        it('Si se genera un id  se generará el id-8 ya que en pruebas anteriores se instanciaron ids', () => {
          expect(generador.generateUniqueId()).to.equal("id-8");
        });
        it('El situinete id que se genera será el id-9 ', () => {
            expect(generador.generateUniqueId()).to.equal("id-9");
        });
        it('El situinete id que se genera será el id-10', () => {
            expect(generador.generateUniqueId()).to.equal("id-10");
        });
      });
});
