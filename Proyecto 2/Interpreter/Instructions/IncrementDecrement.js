export default class IncrementDecrement {
    constructor(line, column, id, operator) {
        this.line = line;
        this.column = column;
        this.id = id;
        this.operator = operator;
    }

    traducir(env, gen) {
        if (this.operator === '++') {
            gen.addLine(`${this.id} += 1`);
        } else if (this.operator === '--') {
            gen.addLine(`${this.id} -= 1`);
        }
    }
}