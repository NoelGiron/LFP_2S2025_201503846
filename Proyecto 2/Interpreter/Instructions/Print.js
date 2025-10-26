// Print.js - Actualizado para Python
export default class Print {
    constructor(line, column, expression) {
        this.line = line;
        this.column = column;
        this.expression = expression;
    }

    traducir(env, gen) {
        const value = this.expression.traducir(env, gen);
        
        // En Python, print convierte automáticamente a string
        // Pero para concatenación segura, usamos f-strings o conversión explícita
        gen.addLine(`print(${value.value})`);
    }
}