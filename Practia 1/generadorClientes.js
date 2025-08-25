import fs from 'fs';

const generadorClientes = (nombreArchivo, informacion) => {
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
            </tr>
            <tr>
                <th>Id</th>
                <th>Nombre</th>
            </tr>`

    informacion.forEach(registro => {
        htmlCode += `<tr>
            <td>${registro.id_cliente}</td>
            <td>${registro.nombre_cliente}</td>
        </tr>
        `
    })

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

export default generadorClientes;