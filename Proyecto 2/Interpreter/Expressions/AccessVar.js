export default class AccessVar {
    constructor(line, column, id) {
        this.line = line;
        this.column = column;
        this.id = id;
    }

    traducir(env, _) {
        const varType = env.getVar(this.id);
        if (!varType) {
            return { 
                value: this.id, 
                type: {value: 'int', pythonType: 'int', defaultValue: '0', ord: 0} 
            };
        }
        return { value: this.id, type: varType };
    }
}