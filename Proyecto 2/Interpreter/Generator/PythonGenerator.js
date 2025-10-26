// PythonGenerator.js - Nuevo archivo
export default class PythonGenerator {
    constructor() {
        this.code = [];
        this.indentLevel = 0;
        this.imports = new Set();
    }

    addLine(line) {
        const indent = '    '.repeat(this.indentLevel);
        this.code.push(indent + line);
    }

    indent() {
        this.indentLevel++;
    }

    dedent() {
        if (this.indentLevel > 0) {
            this.indentLevel--;
        }
    }

    addImport(module) {
        this.imports.add(module);
    }

    generate() {
        let finalCode = '';
        
        // Agregar imports si existen
        if (this.imports.size > 0) {
            this.imports.forEach(module => {
                finalCode += `import ${module}\n`;
            });
            finalCode += '\n';
        }
        
        // Agregar el código generado
        finalCode += this.code.join('\n');
        return finalCode;
    }

    clear() {
        this.code = [];
        this.indentLevel = 0;
        this.imports.clear();
    }
}