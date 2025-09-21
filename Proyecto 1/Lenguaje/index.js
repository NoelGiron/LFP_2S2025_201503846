let editor;

// Inicializar CodeMirror
document.addEventListener("DOMContentLoaded", function () {
    editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
        mode: "application/json",
        theme: "material",
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: false,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        scrollbarStyle: "native",
        value: `TORNEO {
  nombre: "Mega Copa Universitaria",
  equipos: 4,
  sede: "El Salvador"
}

EQUIPOS {
  equipo: "Leones Dorados" [
    jugador: "Daniel Pérez" [posicion: "DELANTERO", numero: 9, edad: 23],
    jugador: "Roberto López" [posicion: "MEDIOCAMPO", numero: 8, edad: 22],
    jugador: "Santiago Ramírez" [posicion: "DEFENSA", numero: 4, edad: 25],
    jugador: "Manuel Torres" [posicion: "PORTERO", numero: 1, edad: 29]
  ],
  equipo: "Tiburones Azules" [
    jugador: "Cristian Morales" [posicion: "DELANTERO", numero: 11, edad: 26],
    jugador: "Alejandro Ruiz" [posicion: "DEFENSA", numero: 3, edad: 28]
  ],
  equipo: "Águilas Negras" [
    jugador: "Javier Gómez" [posicion: "DELANTERO", numero: 7, edad: 24],
    jugador: "Felipe Díaz" [posicion: "PORTERO", numero: 12, edad: 27]
  ],
  equipo: "Pumas Blancos" [
    jugador: "Oscar Hernández" [posicion: "DELANTERO", numero: 10, edad: 20],
    jugador: "Luis Ramírez" [posicion: "MEDIOCAMPO", numero: 6, edad: 22]
  ]
}

ELIMINACION {
  cuartos: [
    partido: "Leones Dorados" vs "Tiburones Azules" [
      resultado: "2-2",
      goleadores: [
        goleador: "Cristian Morales" [minuto: 12],
        goleador: "Daniel Pérez" [minuto: 30],
        goleador: "Alejandro Ruiz" [minuto: 60],
        goleador: "Roberto López" [minuto: 78]
      ]
    ],
    partido: "Águilas Negras" vs "Pumas Blancos" [
      resultado: "3-1",
      goleadores: [
        goleador: "Javier Gómez" [minuto: 15],
        goleador: "Oscar Hernández" [minuto: 43],
        goleador: "Felipe Díaz" [minuto: 55],
        goleador: "Javier Gómez" [minuto: 88]
      ]
    ]
  ],
  semifinal: [
    partido: "Leones Dorados" vs "Águilas Negras" [resultado: "Pendiente"]
  ]
}`
    });

    setTimeout(() => {
        editor.refresh();
    }, 100);
});

function cargarArchivo(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];

        const reader = new FileReader();

        reader.onload = function(e) {
            editor.setOption('value', e.target.result);
        };

        reader.onerror = function() {
            alert("Error al leer el archivo");
        };

        reader.readAsText(file);
    }
}

function analizarTorneo() {
    const scanner = new Scanner(editor.getValue());
    const contenido = document.getElementById('contendio');

    contenido.innerHTML = '';

    const tabla = document.createElement('tabla');
    tabla.className = 'tabla-token';
    tabla.innerHTML = `
      <thead>
        <tr>
          <th>#</th>
          <th>Token</th>
          <th>Tipo</th>
          <th>Linea</th>
          <th>Columna</th>
          <th>Lexema</th>
        </tr>
      </thead>
      <tbody id="tokensBody"></tbody>
    `;
    contenido.appendChild(tabla);
    const tokensBody = document.getElementById('tokensBody');

    let tokenCount = 1;
    let token = scanner.next_token();
    while(token.type !== 'EOF') {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${tokenCount}</td>
          <td>${token.type}</td>
          <td>${token.type.startsWith('KW_') ? 'palabra clave' :
              token.type.startsWith('TK_') ? 'simbolo' :
              token.type === 'TK_string' ? 'cadena' :
              token.type === 'TK_id' ? 'identificador' : token.type}</td>
          <td>${token.line}</td>
          <td>${token.colum}</td>
          <td>${token.lexeme || token.type}}</td>

        `;
        tokensBody.appendChild(row);
        tokenCount++;
        token = scanner.next_token();
    }
    const summary = document.createElement('div');
    summary.className = 'analisis-summary';
    summary.innerHTML = `
      <h3>Resumen del analisis</h3>
      <p>Total de tokens encontrados: ${tokenCount -1}</p>
      <p>Analisis completado exitosamente</p>
    `;
    resultContent.appendChild(summary);
}
function generarReporte() {

}
function mostrarBracket() {

}