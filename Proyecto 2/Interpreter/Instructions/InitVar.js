// InitVar.js - Actualizado para Python
import Type from "../Utils/Type.js";

export default class InitVar {
    constructor(line, columna, inits) {
        this.line = line;
        this.columna = columna;
        this.inits = inits;
    }

    traducir(env, gen) {
        for(const init of this.inits) {
            let v;
            if(init.value != null) {
                v = init.value.traducir(env, gen);
            } else {
                // Valor por defecto según el tipo
                v = { value: init.type.defaultValue, type: init.type };
            }
            
            // En Python no se declaran tipos, solo asignaciones
            env.saveVar(init.id, init.type);
            
            // Para números, quitar el .0 si es entero
            let pythonValue = v.value;
            if (init.type === Type.INT && pythonValue.includes('.0')) {
                pythonValue = pythonValue.replace('.0', '');
            }
            
            // Convertir booleanos de Java a Python
            if (init.type === Type.BOOLEAN) {
                pythonValue = pythonValue === 'true' ? 'True' : 'False';
            }
            
            gen.addLine(`${init.id} = ${pythonValue}  # Declaracion: ${init.type.value}`);
        }
    }
}