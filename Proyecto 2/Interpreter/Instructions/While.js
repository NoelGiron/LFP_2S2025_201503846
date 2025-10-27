import Env from "../Generator/Env.js";

export default class While {
    constructor(line, column, condition, body) {
        this.line = line;
        this.column = column;
        this.condition = condition;
        this.body = body;
    }

    traducir(env, gen) {
        const conditionResult = this.condition.traducir(env, gen);
        
        let pythonCondition = conditionResult.value;
        pythonCondition = pythonCondition.replace(/&&/g, 'and').replace(/\|\|/g, 'or');
        
        gen.addLine(`while ${pythonCondition}:`);
        gen.indent();
        
        // Traducir bucle
        const localEnv = new Env(env, "while_loop");
        this.body.forEach(instruction => {
            instruction.traducir(localEnv, gen);
        });
        
        gen.dedent();
    }
}