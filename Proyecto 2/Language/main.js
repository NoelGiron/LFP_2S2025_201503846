
import Scanner from './Scanner.js';
import Parser from './Parser.js';
import PythonGenerator from '../Interpreter/Generator/PythonGenerator.js';
import { errors } from '../Utils/Errors.js';

class JavaToPythonTranslator {
    constructor() {
        this.errors = [];
        this.tokens = [];
    }

    analyze(code) {
       
        errors.length = 0;
        this.errors = [];
        this.tokens = [];

        try {
          
            const scanner = new Scanner(code);
            let token;
            do {
                token = scanner.next_token();
                if (token && token.type !== 'EOF') {
                    this.tokens.push(token);
                }
            } while (token && token.type !== 'EOF');

            
            if (errors.length === 0) {
                const parser = new Parser(new Scanner(code));
                const ast = parser.parse();
                
                if (errors.length === 0) {
                    const generator = new PythonGenerator();
                    ast.traducir({}, generator);
                    return {
                        success: true,
                        pythonCode: generator.generate(),
                        tokens: this.tokens,
                        errors: []
                    };
                }
            }

            return {
                success: false,
                pythonCode: '',
                tokens: this.tokens,
                errors: [...errors]
            };

        } catch (error) {
            return {
                success: false,
                pythonCode: '',
                tokens: this.tokens,
                errors: [...errors, { type: 'Runtime', message: error.message }]
            };
        }
    }

    generateTokenReport(tokens) {
        let html = `
            <div class="tabla-token-container">
                <table class="tabla-token">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Token</th>
                            <th>Tipo</th>
                            <th>Línea</th>
                            <th>Columna</th>
                            <th>Lexema</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        tokens.forEach((token, index) => {
            let tokenClass = '';
            if (token.type.startsWith('KW_')) tokenClass = 'token-kw';
            else if (token.type.startsWith('TK_')) tokenClass = 'token-symbol';
            else if (token.type === 'TK_str') tokenClass = 'token-string';
            else if (token.type === 'TK_id') tokenClass = 'token-identifier';

            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td class="${tokenClass}">${token.type}</td>
                    <td>${this.getTokenCategory(token.type)}</td>
                    <td>${token.line}</td>
                    <td>${token.column}</td>
                    <td>${this.escapeHtml(token.lexeme)}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
            <div class="analisis-summary">
                <h3>Resumen del Análisis Léxico</h3>
                <p>Total de tokens reconocidos: ${tokens.length}</p>
            </div>
        `;

        return html;
    }

    getTokenCategory(tokenType) {
        if (tokenType.startsWith('KW_')) return 'PALABRA_RESERVADA';
        if (tokenType.startsWith('TK_')) {
            if (['TK_str', 'TK_char', 'TK_int', 'TK_float', 'TK_boolean'].includes(tokenType)) 
                return 'LITERAL';
            return 'SÍMBOLO';
        }
        return 'IDENTIFICADOR';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}


window.JavaToPythonTranslator = JavaToPythonTranslator;