import { expect } from 'chai';
import 'mocha';
import { Grupo } from '../src/Grupo';

describe('Grupo', () => {

  describe('Constructor', () => {
    it('Debe crear un grupo con nombre y miembros', () => {
      const nombre = 'Grupo 1';
      const miembros = ['miembro1', 'miembro2'];
      const grupo = new Grupo(nombre, miembros);
      expect(grupo.nombre).to.equal(nombre);
      expect(grupo.miembrosID).to.eql(miembros);
    });

    it('Debe crear un grupo con un id único', () => {
      const grupo1 = new Grupo('Grupo 1');
      const grupo2 = new Grupo('Grupo 2');
      expect(grupo1.id).to.not.equal(grupo2.id);
    });

    it('Debe ordenar el ranking si se le pasan miembros en el constructor', () => {
      const miembros = ['miembro1', 'miembro2'];
      const grupo = new Grupo('Grupo 1', miembros);
      expect(grupo.ranking).to.eql(miembros);
    });
  });
});