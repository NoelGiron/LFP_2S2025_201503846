import fs from 'fs';

const generadorReporte = (nombreArchivo, informacion) => {
    let htmlCode = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte</title>
    </head>
    <body>
        <table border="1">
            <tr>
                <th colspan="2">Cliente</th>
                <th colspan="3">Operador</th>
            </tr>
            <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Id</th>
                <th>Nombre</th>
                <th>Calificación</th>
            </tr>`

    htmlCode += `</table>
        </body>
        </html>`
        
    try{
        const stream = fs.createWriteStream(`./Salidas/${nombreArchivo}.html`, 'utf-8');
        stream.write(htmlCode);
        stream.end();
    }catch (error){
        console.log("Error al escrbir el archivo")
    }
}

export default generadorReporte;