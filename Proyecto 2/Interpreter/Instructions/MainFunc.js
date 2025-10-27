import Env from "../Generator/Env.js";

export default class MainFunc {
    constructor(line, column, instructions) {
        this.line = line;
        this.column = column;
        this.instructions = instructions;
    }

    traducir(env, gen) {
        const localEnv = new Env(env, "main");
        for(const inst of this.instructions) {
            inst.traducir(localEnv, gen);
        }
    }
}