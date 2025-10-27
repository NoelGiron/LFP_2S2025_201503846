import Env from "../Generator/Env.js";

export default class If {
    constructor(line, column, condition, thenBlock, elseBlock) {
        this.line = line;
        this.column = column;
        this.condition = condition;
        this.thenBlock = thenBlock;
        this.elseBlock = elseBlock;
    }

    traducir(env, gen) {
        const conditionResult = this.condition.traducir(env, gen);
        
        // Convertir operadores
        let pythonCondition = conditionResult.value;
        pythonCondition = pythonCondition.replace(/&&/g, 'and').replace(/\|\|/g, 'or');
        
        gen.addLine(`if ${pythonCondition}:`);
        gen.indent();
        
        // then
        const thenEnv = new Env(env, "if_then");
        this.thenBlock.forEach(instruction => {
            instruction.traducir(thenEnv, gen);
        });
        
        gen.dedent();
        
        // else si existe
        if (this.elseBlock && this.elseBlock.length > 0) {
            gen.addLine(`else:`);
            gen.indent();
            
            const elseEnv = new Env(env, "if_else");
            this.elseBlock.forEach(instruction => {
                instruction.traducir(elseEnv, gen);
            });
            
            gen.dedent();
        }
    }
}