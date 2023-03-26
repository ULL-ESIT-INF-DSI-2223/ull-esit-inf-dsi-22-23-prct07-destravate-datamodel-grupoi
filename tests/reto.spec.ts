import 'mocha';
import {expect} from 'chai';
import {Reto} from "../src/Reto";
import {Ruta} from "../src/Ruta";
import {Actividad} from "../src/Actividad"

describe("Reto: constructor, set y get", () => {
  let usuarios = ["id-1" ,"id-2" ,"id-3", "id-6", "id-7"]
  let usuarios2 = ["id-8", "id-9", "id-10"]

  let loc1 = {latitud: 500, longitud:460}
  let loc2 = {latitud: 305, longitud:780}
  let loc3 = {latitud: 467, longitud:123}
  let loc4 = {latitud: 204, longitud:789}

  let ruta1 = new Ruta("Cabo Verde", loc1, loc2, 10, 6, usuarios, Actividad.Correr, 7)
  let ruta2 = new Ruta("Cabo Rojo", loc3, loc4, 7, 15, ["id-1", "id-2", "id-7"], Actividad.Bicicleta, 8.5)

  let rutas = [ruta1.nombre, ruta2.nombre]
  let rutas2 = [ruta2.nombre]

  let reto1 = new Reto("Reto 1", rutas, Actividad.Correr, usuarios)
  let reto2 = new Reto("Reto 2", rutas2, Actividad.Bicicleta, usuarios2)

  reto1.total = (ruta1.longitud + ruta2.longitud)
  reto2.total = ruta2.longitud

  it("constructor: ids únicos", () => {
    expect(reto1.id == reto2.id).to.be.equal(false)
  });
  it("constructor: nombre", () => {
    expect(reto1.nombre).to.be.equal("Reto 1")
  });
  it("constructor: rutas", () => {
    expect(reto1.rutas).to.be.equal(rutas)
  });
  it("constructor: actividad", () => {
    expect(reto1.actividad).to.be.equal(Actividad.Correr)
  });
  it("constructor: total", () => {
    expect(reto1.total).to.be.equal(17)
  });
  it("constructor: usuarios", () => {
    expect(reto1.usuarios).to.be.equal(usuarios)
  });
  it("setter y getter: nombre", () => {
    reto1.nombre = "Reto 2"
    expect(reto1.nombre).to.be.equal("Reto 2")
  });
  it("setter y getter: rutas", () => {
    reto1.rutas = rutas2
    expect(reto1.rutas).to.be.equal(rutas2)
  });
  it("setter y getter: actividad", () => {
    reto1.actividad = Actividad.Bicicleta
    expect(reto1.actividad).to.be.equal(Actividad.Bicicleta)
  });
  it("setter y getter: usuarios", () => {
    reto1.usuarios = usuarios2
    expect(reto1.usuarios).to.be.equal(usuarios2)
  });  
});
