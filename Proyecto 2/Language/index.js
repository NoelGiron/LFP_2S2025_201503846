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


// MENU de archivo
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

function limpiarEditor() {
    
}

function guardarJava() {

}

function guardarPython() {

}

function salir(){

}

//MENU del traductor

function generarTraduccion(){

}

function verTokens(){

}

function simularEjecucion(){

}


