# DeStravaTe
###### Equipo I
El link al GitHub Page es el siguiente: https://ull-esit-inf-dsi-2223.github.io/ull-esit-inf-dsi-22-23-prct07-destravate-datamodel-grupoi/

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct07-destravate-datamodel-grupoi/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct07-destravate-datamodel-grupoi?branch=main)


## Introducción
En esta práctica declararemos una serie de clases. También se realizará la documentación de estas clases mediante typedoc, así como los test de las mismas con mocha y chai. Se ejecutarán los test mediante las github actions, así como el cubrimiento del código y la calidad del código. La interfaz para interactuar con el código se realizará mediante inquirer.js y la persistencia de las clases declaradas mediante Lowdb.

## Descripción de las clases del sistema

### GeneradorIdUnicos
Esta clase la creamos por la necesidad de generar id’s únicos, ya que las claes de Rutas, Usuarios, Grupos y Retos tienen un atributo para almacenar su id. Esta clase utiliza el patrón singleton, para que solo se pueda instanciar una vez. El funcionamiento de esta clase es que básicamente tiene un contador y un generador. Cada vez que se genera un id, este contador incrementa. Al utilizar persistencia, tuvimos el problema que cada vez que se ejecutaba el programa empezaba el contador de 0 y se repetían los ids de los objetos guardados mediante lowdb, la solución fue guardar mediante lowdb el último id generado, y cuando se ejecuta el programa instancia la clase y lo inicializa a el último id generado, así sigue generando a partir de este.

### EstadisticasEntrenamiento
Esta clase sirve para almacenar las estadísticas de km y desnivel semanalmente, mensualmente y anualmente. Tiene los guetters a estas estadísticas, así como un método actualizar estadísticas que va almacenando los km y el desnivel acumulándolos hasta que se pasa de semana y los resetea, lo mismo con las del año y las del mes.

### Rutas
En esta clase se definen los siguientes atributos:
```
    private _id: string;
  private _nombre: string;
    private _inicio: Geolocalizacion;
    private _final: Geolocalizacion;
    private _longitud: number;
    private _desnivel: number;
    private _usuarios: string[];
    private _actividad: Actividad;
    private _calificacion: number;

```
En el constructor se inicializan, el id con un id único generado gracias a la clase GeneradorIdUnicos, el nombre con un string, el inicio y final con la geolocalización que implementa la siguiente interface:

```
export interface Geolocalizacion{
    latitud: number;
    longitud: number;
}

```

La longitud en km y el desnivel en metros. El atributo _usuarios contiene un array con los id de los usuarios que han realizado la ruta. Actividad es si se hace la ruta a  bicicleta  o corriendo. Y por último la clasificación es la media de las clasificaciones que han puesto los usuarios a esa ruta. La clase tiene los getter y setters de todos estos atributos.

### Usuario
Tiene los siguientes atributos:
```
  private _id:string;
    private _nombre:string;
    private _actividad:Actividad;
    private _amigos: string[];
    private _grupos: string[]; 
    private _estadisticas : EstadisticasEntrenamiento;

    private _rutas:string[]; 
    private _retos:string[]; 
    private _historicoRutas: Map<string, string[]>;

```
En el constructor se inicializa el nombre con el pasado, así como el id único, también se inicializa a vacío el resto de atributos y array vacíos.
Actividad es la actividad que realiza el usuario, ya se explicó en la clase anterior. Amigos es un array de ids de los usuarios que son amigos del usuario. Lo mismo con grupos pero los ids son de los grupos. Estadísticas utiliza la clase  EstadisticasEntrenamiento descrita anteriormente para ir actualizando las estadísticas del usuario. Rutas es un array con los ids de las rutas que el usuario. Retos es un array también de ids de los retos que tiene activo el usuario actualmente. Historico de rutas es un map de string que contiene la fecha y un array con los ids de las rutas que realizó el usuario en esa fecha. 
La clase tiene getters de los atributos así como métodos para añadir amigos, grupos, actualizar estadísticas, añadir rutas retos y añadir rutas al histórico.

### Grupo
Tiene los siguientes atributos::
```
 private _id: string;
  private _nombre: string;
  private _miembrosID: string[];

  private _estadisticas: EstadisticasEntrenamiento;

  private _ranking: string[];
  private _rutasFav: string[];
  private _historicoRutas: Map<string, string[]>;

```
El id que se genera como en las otras clases, el nombre que se pasa al constructor, así como la lista de miembros del grupo que es un array de ids. Estadísticas, utiliza la clase EstadisticasEntrenamiento, ranking tiene un array de ids con los usuarios con más km realizados o con mayor desnivel depende de lo que se escoja. Rutas fav tiene un array de ids de las rutas favoritas de los miembros del grupo. Histórico de rutas es un map de string que contiene la fecha y un array con los ids de las rutas que realizó el usuario en esa fecha. 
La clase tiene getters y setters de los atributos así como métodos para añadir miembros al grupo que comprueba primero si ya esta añadido y si no es así lo añade. También para eliminar usuarios. Así como métodos para ordenar ranking por desnivel o por km acumulados.

### Reto
Tiene los siguientes atributos:
```
  private _id: string;
    private _nombre: string;
    private _rutas: Ruta[];
    private _actividad: Actividad;
    private _total: number;
    private _usuarios: string[];

```

El id se genera con la clase generadora, el nombre se inicializa  en el constructor isa como las rutas que forman parte del reto, la actividad y los usuarios que están realizando el reto.
Tiene los getters correspondientes y setters. El total se inicializa en el constructor accediendo a la longitud de cada ruta y sumándolo.

## Funcionamiento de Inquirer.js y lowdb.
En la carpeta json dentro de src se guardará la declaración de las rutas, los usuarios, los grupos y los retos. Y para manejarlo se hará uso de inquirer y lowdb. Como el funcionamiento es prácticamente el mismo para las cuatro clases, se explicará el de rutas y el resto es prácticamente lo mismo, pero cambiando el nombre y los atributos que cambian en las diferentes clases.
El programa principal está en el index.ts, la parte de cada clase está en ficheros apartes, con el nombre de la clase, seguido de Inquirer.ts.
En el index se encuentra el promptApp que es el programa principal, que básicamente,  saca el id único del database.json y inicializa la clase GeneradorIdUnicos con el numero de este id, como explicamos más arriba, después pide que se escoja la Rutas, Usuarios, Grupos o Retos. Cuando accedemos a Rutas, llama a promptRuta que está en el fichero RutaInquirer.ts.
Esta función hace un switch de los distintos tipos de cosas que se pueden hacer sobre las Rutas:

- Atrás: llama al programa principal otra vez (promptApp())

- Añadir_Ruta: llama a promptAdd() que mediante inquirer.prompt, pide la información de la ruta, mediante imput o list. La parte más complicada fue la parte de escoger cuales son los usuarios que han realizado la ruta, lo que se hace es poner un tipo checkbox de los usuarios ya declarados que se sacan del database.json donde están declarados y se enseñan los id para que se puedan escoger cuales han realizado la ruta. Después de esto se inicializa un objeto del tipo Ruta con la información recogida y se sube a la base de datos así como el id de la ruta para saber que es el último id que se ha creado.

- Borrar_ruta: llama al promptRemove() que pide el nombre de la ruta a eliminar, y lo elimina con la siguiente linea:
```
database.get('rutas').remove({_nombre: respuesta.ruta}).write(); 
```

- Enseñar Rutas promptOrdenarRutas() que pide si quiere ordenar por nombre, longitud, actividad, calificación, Usuarios y dependiendo de la elección llama al promptRutaOrdenada(tipo) pasándole el tipo por el que se quiere ordenar, después en esta función pide si quiere orden ascendente o descendiente y básicamente se hace un console.log de la siguiente línea para ordenarlas por el nombre de forma ascendente
```
console.log(JSON.stringify(database.get('rutas').sortBy('_nombre').value(), null, '\t'));
```
si se quiere descendiente simplemente ponemos reverse
```
console.log(JSON.stringify(database.get('rutas').sortBy('_nombre').reverse().value(), null, '\t'));
```

- Modificar ruta modifyRuta que pide el nombre de la ruta a modificar y enseña los atributos que se pueden modificar para que se escoja uno y se llama a modifyParam con el nombre de la ruta y el atributo a modificar. En esta función dependiendo del parámetro escogido se pide el nuevo valor a cambiar y mediante la siguiente línea se modifica en este ejemplo se modifica el desnivel:
```
database.get('rutas').find({_nombre: ruta}).set("_longitud", respuesta.longitud).write()
```
