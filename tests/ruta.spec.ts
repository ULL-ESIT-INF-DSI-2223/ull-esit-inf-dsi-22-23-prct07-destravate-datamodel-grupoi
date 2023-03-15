import 'mocha';
import {expect} from 'chai';
import {Ruta} from "../src/Ruta";
import { Geolocalizacion } from '../src/Ruta';
import {Actividad} from "../src/Actividad"

describe("constructor, set y get de Ruta", () => {
  it("constructor", () => {
    let usuarios = [1,2,3,6,7]
    let loc1 = {latitud: 500, longitud:460}
    let loc2 = {latitud: 305, longitud:780}
    let loc3 = {latitud: 467, longitud:123}
    let loc4 = {latitud: 204, longitud:789}

    let ruta1 = new Ruta("Cabo Verde", loc1, loc2, 10, 6, usuarios, Actividad.Correr, 7)
    let ruta2 = new Ruta("Cabo Rojo", loc3, loc4, 7, 15, [1,2,7], Actividad.Bicicleta, 8.5)
    expect(ruta1.id == ruta2.id).to.be.equal(false)
    expect(ruta1.nombre).to.be.equal("Cabo Verde")
    expect(ruta1.inicio).to.be.equal(loc1)
    expect(ruta1.final).to.be.equal(loc2)
    expect(ruta1.longitud).to.be.equal(10)
    expect(ruta1.desnivel).to.be.equal(6)
    expect(ruta1.usuarios).to.be.equal(usuarios)
    expect(ruta1.actividad).to.be.equal(Actividad.Correr)
    expect(ruta1.calificacion).to.be.equal(7)
  });

  it("setters y getters", () => {
    let loc1 = {latitud: 500, longitud:460}
    let loc2 = {latitud: 305, longitud:780}
    let loc3 = {latitud: 467, longitud:123}
    let loc4 = {latitud: 204, longitud:789}
    let usuarios = [1,2,3,6,7]
    let usuarios2 = [8,9,10]
    let ruta1 = new Ruta("Cabo Verde", loc1, loc2, 10, 6, usuarios, Actividad.Correr, 7)
    ruta1.nombre = "Cabo Rojo"
    ruta1.inicio = loc3
    ruta1.final = loc4
    ruta1.longitud = 4
    ruta1.desnivel = 50
    ruta1.usuarios = usuarios2
    ruta1.actividad = Actividad.Bicicleta
    ruta1.calificacion = 10
    expect(ruta1.nombre).to.be.equal("Cabo Rojo")
    expect(ruta1.inicio).to.be.equal(loc3)
    expect(ruta1.final).to.be.equal(loc4)
    expect(ruta1.longitud).to.be.equal(4)
    expect(ruta1.desnivel).to.be.equal(50)
    expect(ruta1.usuarios).to.be.equal(usuarios2)
    expect(ruta1.actividad).to.be.equal(Actividad.Bicicleta)
    expect(ruta1.calificacion).to.be.equal(10)
  });
});
