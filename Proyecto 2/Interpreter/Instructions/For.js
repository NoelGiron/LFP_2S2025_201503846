import Env from "../Generator/Env.js";

export default class For {
    constructor(line, column, initialization, condition, increment, body) {
        this.line = line;
        this.column = column;
        this.initialization = initialization;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
    }

    traducir(env, gen) {
        if (this.initialization) {
            this.initialization.traducir(env, gen);
        }

        let conditionValue = '';
        if (this.condition) {
            const conditionResult = this.condition.traducir(env, gen);
            conditionValue = conditionResult.value;
        }

        gen.addLine(`while ${conditionValue}:`);
        gen.indent();

        const localEnv = new Env(env, "for_loop");
        this.body.forEach(instruction => {
            instruction.traducir(localEnv, gen);
        });

        if (this.increment) {
            this.increment.traducir(localEnv, gen);
        }

        gen.dedent();
    }
}