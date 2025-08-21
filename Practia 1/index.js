import readline from 'readline';
import fs from 'fs'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const leerCampo = (texto) => {
    return new Promise((resolve) => {
        rl.question(`${texto}`, (llamadas) => {
            resolve(llamadas)
        });
    });
}

function menuPrincipal(){
    console.log("1) Cargar registro de llamadas")
    console.log("2) Exportar historial de llamadas")
    console.log("3) Exportar listado de operadoes")
    console.log("4) Exportar listado de clientes")
    console.log("5) Exportar rendimiento de operadores")
    console.log("6) Mostrar porcentaje de clasificación de llamadas")
    console.log("7) Mostrar cantidad de llamadas por calificación")
    console.log("8) Salir")
}

const main = async () => {
    menuPrincipal();
    rl.question("Seleccione una opcion: ", ejecutarOpcion)
}

const ejecutarOpcion = async (opcion) => {
    switch(opcion){
        case '1':
            let archivo = await leerCampo("Ingrese el nombre del archivo: ");
            console.log(`Cargando registro desde el arichivo: ${archivo}`)

            try{
                const contenido = fs.readFileSync(`./Entradas/${archivo}`, `utf-8`);
                console.log("contendio del archivo: ");
                console.log(contenido);
                main();

            //     let lineas = contenido.split(/\r?\n/);
            //     lineas = lineas.slice(1);

            //     for(let i = 0; i<lineas.length; i++){
            //         lineas[i] = lineas[i].split(/,/);
            //         lineas[i][2] = lineas[i][2].split(/;/);
            //         //ineas[i][2] = lineas[i][2].filter(e => e === 'x').length;
            //     }
            //     console.log(lineas);
            //     main();
            }catch (error){
                console.log("Error al leer el archivo");
                main();
            }
    }
}

main();