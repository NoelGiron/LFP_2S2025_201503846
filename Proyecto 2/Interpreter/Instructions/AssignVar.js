export default class AssignVar {
    constructor(line, column, id, expression) {
        this.line = line;
        this.column = column;
        this.id = id;
        this.expression = expression;
    }

    traducir(env, gen) {
        const value = this.expression.traducir(env, gen);
        
        let pythonValue = value.value;
        if (value.type && value.type.value === 'boolean') {
            pythonValue = pythonValue === 'true' ? 'True' : 'False';
        }
        
        gen.addLine(`${this.id} = ${pythonValue}`);
    }
}