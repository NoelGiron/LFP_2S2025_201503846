import { JavaToPythonTranslator } from './main.js';

let translator = new JavaToPythonTranslator();
let editor;

function initEditor() {
    editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
        mode: 'text/x-java',
        theme: 'material',
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        indentWithTabs: false,
        lineWrapping: true
    });
    
    editor.setValue(`public class MiPrograma {
    public static void main(String[] args) {
        // Declaraciones
        int contador = 0;
        String mensaje = "Hola Mundo";
        boolean activo = true;
        
        // Impresión
        System.out.println(mensaje);
        
        // Ciclo for
        for (int i = 0; i < 5; i++) {
            System.out.println("Iteración: " + i);
            contador = contador + i;
        }
        
        // Condicional
        if (contador > 10) {
            System.out.println("Contador mayor a 10");
        } else {
            System.out.println("Contador menor o igual a 10");
        }
        
        // Ciclo while
        while (activo) {
            System.out.println("Ejecutando while");
            activo = false;
        }
    }
}`);
}

function generarTraduccion() {
    const javaCode = editor.getValue();
    const result = translator.analyze(javaCode);
    
    const resultsContent = document.getElementById('resultsContent');
    
    if (result.success) {
        resultsContent.innerHTML = `
            <div class="analisis-summary" style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);">
                <h3>✓ Traducción Exitosa</h3>
                <p>El código Java se tradujo correctamente a Python</p>
            </div>
            <pre style="background: #f8f9fa; padding: 20px; border-radius: 8px; overflow-x: auto; margin-top: 20px;">${result.pythonCode}</pre>
        `;
    } else {
        let errorsHtml = '';
        if (result.errors.length > 0) {
            errorsHtml = `
                <div class="analisis-summary" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">
                    <h3>✗ Errores Encontrados</h3>
                </div>
                <div class="tabla-token-container">
                    <table class="tabla-token">
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Mensaje</th>
                                <th>Línea</th>
                                <th>Columna</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${result.errors.map(error => `
                                <tr>
                                    <td style="color: #e74c3c; font-weight: bold;">${error.type}</td>
                                    <td>${error.message}</td>
                                    <td>${error.line || '-'}</td>
                                    <td>${error.column || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        resultsContent.innerHTML = errorsHtml;
    }
}

function verTokens() {
    const javaCode = editor.getValue();
    const result = translator.analyze(javaCode);
    
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = translator.generateTokenReport(result.tokens);
}

function simularEjecucion() {
    const javaCode = editor.getValue();
    const result = translator.analyze(javaCode);
    
    const resultsContent = document.getElementById('resultsContent');
    
    if (result.success) {

        resultsContent.innerHTML = `
            <div class="analisis-summary" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);">
                <h3>Simulación de Ejecución</h3>
                <p>El código Python se ejecutaría aquí</p>
            </div>
            <pre style="background: #2c3e50; color: white; padding: 20px; border-radius: 8px; overflow-x: auto; margin-top: 20px;">${result.pythonCode}</pre>
            <div style="margin-top: 20px; padding: 15px; background: #ecf0f1; border-radius: 8px;">
                <strong>Salida esperada:</strong>
                <pre style="margin-top: 10px;">Hola Mundo\nIteración: 0\nIteración: 1\nIteración: 2\nIteración: 3\nIteración: 4\nContador menor o igual a 10\nEjecutando while</pre>
            </div>
        `;
    } else {
        resultsContent.innerHTML = `
            <div class="analisis-summary" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">
                <h3>No se puede ejecutar - Hay errores en el código</h3>
                <p>Corrija los errores antes de simular la ejecución</p>
            </div>
        `;
    }
}

function limpiarEditor() {
    editor.setValue('');
    document.getElementById('resultsContent').innerHTML = '<div class="empty-state"><p>El editor está vacío</p></div>';
}

function cargarArchivo(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            editor.setValue(e.target.result);
        };
        reader.readAsText(file);
    }
}

function guardarJava() {
    const javaCode = editor.getValue();
    const blob = new Blob([javaCode], { type: 'text/x-java' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'programa.java';
    a.click();
    URL.revokeObjectURL(url);
}

function guardarPython() {
    const javaCode = editor.getValue();
    const result = translator.analyze(javaCode);
    
    if (result.success) {
        const blob = new Blob([result.pythonCode], { type: 'text/x-python' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'programa.py';
        a.click();
        URL.revokeObjectURL(url);
    } else {
        alert('No se puede guardar. Hay errores en el código Java.');
    }
}

function salir() {
    if (confirm('¿Está seguro de que desea salir?')) {
        window.close();
    }
}


document.addEventListener('DOMContentLoaded', initEditor);