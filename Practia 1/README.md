# Simuldor de CallCenter
Desarrollar un programa que procese entradas de texto para simular registros de
llamadas en un CallCenter utilizando Programación Orientada a Objetos y estructuras de
datos.

# Descripión
Se solicita a los estudiantes construir un programa que sea capaz de analizar archivos de
entrada que contiene registros de llamadas de un CallCenter en el que se encuentran
datos del operador, cliente y calificación.

![image_Alt](/Imagenes/Screenshot%202025-08-18%20231719.png)

el archivo tiene la siguiente estructura:

* id_operador: Identificador único y numérico del operador.

* nombre_operador: Cadena de texto con el nombre del operador

* estrellas: Es la cantidad de estrellas con las que fue calificada la atención por
parte del cliente.

* * Cada estrella será contabilizada de izquierda a derecha en la columna
correspondiente. La calificación tendrá como máximo 5 estrellas.

* * Cada estrella será representada por una “x”.

* * Se incluirán ceros hasta completar las 5 posiciones correspondientes.

* id_cliente: Identificador único y numérico del cliente.

* nombre_cliente: Cadena de texto con el nombre del cliente.

Las llamadas se clasificarán dependiendo de la cantidad de estrellas con que fue
calificada.

* Buena: 4 – 5 Estrellas

* Media: 2 – 3 Estrellas.

* Mala: 0 – 1 Estrellas.

# Reportes
Se debe de generar ciertos reportes para poder ver historial de llamadas, estadísticas de
rendimiento de los operadores, calificación más repetida, calificación menos repetida,
etc.
Se deberán implementar los reportes del 1 al 4 en formato html. Queda a
discreción del estudiante generar todos los reportes en archivos individuales o en el
mismo.


## Historial de llamadas:
Deberá generar una tabla con los datos del operador,
cliente y la calificación de la llamada.

## Lista de operadores:
Deberá generar una tabla con los datos del operador (id
y nombre).

## Listado de clientes:
Deberá generar una tabla con los datos del operador (id y
nombre).

## Rendimiento de cada operador:
Deberá generar una tabla con los datos del
operador (id, nombre y porcentaje de atención).

* el porcentaje  se clacula como 

$\frac{cantidadde\:\:llamadas\:\:atendidas\:\:por\:\:el\:\:operador}{cantidad\:\:de\:\:llamadas\:\:recibidas\:\:globalmente}$ x 100

## Porcentaje de Clasificación de Llamadas:
Deberá mostrar en consola el
porcentaje de llamadas buenas, medias y malas.

## Cantidad de Llamadas por Calificación:
Deberá mostrar en consola la cantidad
de llamadas de 1, 2, 3, 4 y 5 estrellas.

# Menú
Se debe implementar un menú principal que contenga al menos las siguientes opciones:

* Cargar registros de llamadas
* Exportar historial de llamadas
* Exportar listado de operadores
* Exportar listado de clientes
* Exportar rendimiento de operadores
* Mostrar porcentaje de clasificaciónes de llamadas
* Mostrar cantidad de llamadas por calificación 
* Salir