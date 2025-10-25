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
    const contenido = editor.getValue();
    const scanner = new Scanner(contenido);
    const resultContent= document.getElementById('resultsContent');

   resultContent.innerHTML = `<div class="loading">Analizando</div>`;

    let tokenCount = 1;
    let token = scanner.next_token();

    const tabla = document.createElement('table');
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

   resultContent.innerHTML = '';
   resultContent.appendChild(tabla);
    const tokensBody = document.getElementById('tokensBody');

    while(token && token.type !== 'EOF') {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${tokenCount}</td>
          <td>${token.type}</td>
          <td>${token.type.startsWith('KW_') ? 'palabra clave' :
              token.type.startsWith('TK_') ? 'simbolo' :
              token.type === 'TK_string' ? 'cadena' :
              token.type === 'TK_id' ? 'identificador' : token.type}</td>
          <td>${token.line}</td>
          <td>${token.column}</td>
          <td>${token.lexeme || token.type}</td>

        `;
        tokensBody.appendChild(row);
        tokenCount++;
        token = scanner.next_token();
    }
    
}
function generarReporte() {

}
function mostrarBracket() {

}