import 'mocha';
import {expect} from 'chai';
import {Ruta} from "../src/Ruta";
import {Actividad} from "../src/Actividad"

describe("Ruta: constructor, set y get", () => {
  let usuarios = [1,2,3,6,7]
  let usuarios2 = [8,9,10]

  let loc1 = {latitud: 500, longitud:460}
  let loc2 = {latitud: 305, longitud:780}
  let loc3 = {latitud: 467, longitud:123}
  let loc4 = {latitud: 204, longitud:789}

  let ruta1 = new Ruta("Cabo Verde", loc1, loc2, 10, 6, usuarios, Actividad.Correr, 7)
  let ruta2 = new Ruta("Cabo Rojo", loc3, loc4, 7, 15, [1,2,7], Actividad.Bicicleta, 8.5)
  
  it("constructor: ids únicos", () => {
    expect(ruta1.id == ruta2.id).to.be.equal(false)
  });
  it("constructor: nombre", () => {
    expect(ruta1.nombre).to.be.equal("Cabo Verde")
  });
  it("constructor: inicio", () => {
    expect(ruta1.inicio).to.be.equal(loc1)
  });
  it("constructor: final", () => {
    expect(ruta1.final).to.be.equal(loc2)
  });
  it("constructor: longitud", () => {
    expect(ruta1.longitud).to.be.equal(10)
  });
  it("constructor: desnivel", () => {
    expect(ruta1.desnivel).to.be.equal(6)
  });
  it("constructor: usuarios", () => {
    expect(ruta1.usuarios).to.be.equal(usuarios)
  });
  it("constructor: actividad", () => {
    expect(ruta1.actividad).to.be.equal(Actividad.Correr)
  });
  it("constructor: calificacion", () => {
    expect(ruta1.calificacion).to.be.equal(7)
  });
  it("setter y getter: nombre", () => {
    ruta1.nombre = "Cabo Rojo"
    expect(ruta1.nombre).to.be.equal("Cabo Rojo")
  });
  it("setter y getter: inicio", () => {
    ruta1.inicio = loc3
    expect(ruta1.inicio).to.be.equal(loc3)
  });
  it("setter y getter: final", () => {
    ruta1.final = loc4
    expect(ruta1.final).to.be.equal(loc4)
  });
  it("setter y getter: longitud", () => {
    ruta1.longitud = 4
    expect(ruta1.longitud).to.be.equal(4)
  });
  it("setter y getter: desnivel", () => {
    ruta1.desnivel = 50
    expect(ruta1.desnivel).to.be.equal(50)
  });
  it("setter y getter: usuarios", () => {
    ruta1.usuarios = usuarios2
    expect(ruta1.usuarios).to.be.equal(usuarios2)
  });
  it("setter y getter: actividad", () => {
    ruta1.actividad = Actividad.Bicicleta
    expect(ruta1.actividad).to.be.equal(Actividad.Bicicleta)
  });
  it("setter y getter: calificacion", () => {
    ruta1.calificacion = 10
    expect(ruta1.calificacion).to.be.equal(10)

  });
});
