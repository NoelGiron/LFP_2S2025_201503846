import { errors } from "../Utils/Errors.js";
import Scanner from "./Scanner.js";
import Type from "../Interpreter/Utils/Type.js";
// Expresiones
import AccesVar from "../Interpreter/Expressions/AccessVar.js";
import Arithmetic from "../Interpreter/Expressions/Arithmetic.js";
import Primitive from "../Interpreter/Expressions/Primitive.js";
import Relational from "../Interpreter/Expressions/Relational.js";
// Instrucciones
import Block from "../Interpreter/Instructions/Block.js";
import InitVar from "../Interpreter/Instructions/InitVar.js";
import MainFunc from "../Interpreter/Instructions/MainFunc.js";
import Print from "../Interpreter/Instructions/Print.js";

export default class Parser {
    /**
     * @type {Scanner}
     */
    #sc

    /** @type {Token|null} Token actual en proceso */
    #current_token

    /**
     * @param {Scanner} sc - Instancia de Scanner que proporciona los tokens.
     */
    constructor(sc) {
        this.#sc = sc;
    }

    parse() {
        return this.#START();
    }

    #START() {
        // <START> ::= 'public' 'class' ID '{' 'public' 'static' 'void' 'main' '(' 'String' '[' ']' ID ')' '{' <SENTENCIAS> '}' '}'
        this.#consume('KW_public');
        this.#consume('KW_class');
        this.#consume('TK_id');
        this.#consume('TK_lbrc');
        
        this.#consume('KW_public');
        this.#consume('KW_static');
        this.#consume('KW_void');
        this.#consume('KW_main');
        this.#consume('TK_lpar');
        this.#consume('KW_String');
        this.#consume('TK_lbrack');
        this.#consume('TK_rbrack');
        this.#consume('TK_id');
        this.#consume('TK_rpar');
        this.#consume('TK_lbrc');

        let instructions = this.#SENTENCIAS();

        this.#consume('TK_rbrc'); // Cierre del main
        this.#consume('TK_rbrc'); // Cierre de la clase

        return new MainFunc(1, 1, instructions);
    }

    #SENTENCIAS() {
        let instructions = [];
        
        while(this.#match(
            'KW_int', 'KW_double', 'KW_char', 'KW_String', 'KW_boolean',
            'TK_id', 'KW_if', 'KW_for', 'KW_while', 'KW_System',
            'TK_comment', 'TK_single_comment'
        )) {
            if(!this.#match('TK_comment', 'TK_single_comment')) {
                let ins = this.#SENTENCIA();
                instructions.push(ins);
            } else {
                let comm = this.#consume('TK_comment', 'TK_single_comment');
                instructions.push(comm);
            }
        }
        
        return instructions;
    }

    #SENTENCIA() {
        if(this.#match('KW_int', 'KW_double', 'KW_char', 'KW_String', 'KW_boolean')) {
            return this.#DECLARACION();
        }
        if(this.#match('TK_id')) {
            return this.#ASIGNACION();
        }
        if(this.#match('KW_if')) {
            return this.#IF();
        }
        if(this.#match('KW_for')) {
            return this.#FOR();
        }
        if(this.#match('KW_while')) {
            return this.#WHILE();
        }
        if(this.#match('KW_System')) {
            return this.#PRINT();
        }
        return null;
    }

    #DECLARACION() {
        let t = this.#TIPO();
        let id = this.#consume('TK_id');
        let v = null;

        if(this.#match('TK_assign')) {
            this.#consume('TK_assign');
            v = this.#EXP();
        }

        let inits = [{ id: id.lexeme, type: t, value: v }];

        while(this.#match('TK_comma')) {
            this.#consume('TK_comma');
            id = this.#consume('TK_id');
            v = null;
            if(this.#match('TK_assign')) {
                this.#consume('TK_assign');
                v = this.#EXP();
            }
            inits.push({ id: id.lexeme, type: t, value: v });
        }

        this.#consume('TK_semicolon');
        return new InitVar(id.line, id.column, inits);
    }

    #ASIGNACION() {
        let id = this.#consume('TK_id');
        this.#consume('TK_assign');
        let exp = this.#EXP();
        this.#consume('TK_semicolon');
        
        return {
            line: id.line,
            column: id.column,
            traducir: (env, gen) => {
                let value = exp.traducir(env, gen);
                gen.addLine(`${id.lexeme} = ${value.value}`);
            }
        };
    }

    #IF() {
        this.#consume('KW_if');
        this.#consume('TK_lpar');
        let cond = this.#EXP();
        this.#consume('TK_rpar');
        this.#consume('TK_lbrc');
        let thenBlock = this.#SENTENCIAS();
        this.#consume('TK_rbrc');
        
        let elseBlock = null;
        if(this.#match('KW_else')) {
            this.#consume('KW_else');
            this.#consume('TK_lbrc');
            elseBlock = this.#SENTENCIAS();
            this.#consume('TK_rbrc');
        }
        
        return {
            line: cond.line,
            column: cond.column,
            traducir: (env, gen) => {
                let condition = cond.traducir(env, gen);
                gen.addLine(`if ${condition.value}:`);
                gen.indent();
                thenBlock.forEach(inst => inst.traducir(env, gen));
                gen.dedent();
                
                if(elseBlock) {
                    gen.addLine(`else:`);
                    gen.indent();
                    elseBlock.forEach(inst => inst.traducir(env, gen));
                    gen.dedent();
                }
            }
        };
    }

    #FOR() {
        this.#consume('KW_for');
        this.#consume('TK_lpar');
        let init = this.#DECLARACION();
        let cond = this.#EXP();
        this.#consume('TK_semicolon');
        let update = this.#consume('TK_id');
        let updateOp = this.#consume('TK_inc', 'TK_dec');
        this.#consume('TK_rpar');
        this.#consume('TK_lbrc');
        let body = this.#SENTENCIAS();
        this.#consume('TK_rbrc');
        
        return {
            line: init.line,
            column: init.column,
            traducir: (env, gen) => {
                // Traducir for a while
                init.traducir(env, gen);
                let condition = cond.traducir(env, gen);
                gen.addLine(`while ${condition.value}:`);
                gen.indent();
                body.forEach(inst => inst.traducir(env, gen));
                // Agregar actualización
                gen.addLine(`${update.lexeme} ${updateOp.type === 'TK_inc' ? '+' : '-'}= 1`);
                gen.dedent();
            }
        };
    }

    #WHILE() {
        this.#consume('KW_while');
        this.#consume('TK_lpar');
        let cond = this.#EXP();
        this.#consume('TK_rpar');
        this.#consume('TK_lbrc');
        let body = this.#SENTENCIAS();
        this.#consume('TK_rbrc');
        
        return {
            line: cond.line,
            column: cond.column,
            traducir: (env, gen) => {
                let condition = cond.traducir(env, gen);
                gen.addLine(`while ${condition.value}:`);
                gen.indent();
                body.forEach(inst => inst.traducir(env, gen));
                gen.dedent();
            }
        };
    }

    #PRINT() {
        this.#consume('KW_System');
        this.#consume('TK_dot');
        this.#consume('KW_out');
        this.#consume('TK_dot');
        this.#consume('KW_println');
        this.#consume('TK_lpar');
        let exp = this.#EXP();
        this.#consume('TK_rpar');
        this.#consume('TK_semicolon');
        
        return new Print(exp.line, exp.column, exp);
    }

    #TIPO() {
        let t = this.#consume('KW_int', 'KW_double', 'KW_char', 'KW_String', 'KW_boolean');
        if(t.type === 'KW_int') return Type.INT;
        if(t.type === 'KW_double') return Type.DOUBLE;
        if(t.type === 'KW_char') return Type.CHAR;
        if(t.type === 'KW_String') return Type.STRING;
        if(t.type === 'KW_boolean') return Type.BOOLEAN;
    }

    #EXP() {
        // <EXP> ::= <EXP2> (('==' | '!=' | '<=' | '>=' | '<' | '>') <EXP2>)*
        let e1 = this.#EXP2();

        while(this.#match('TK_equal', 'TK_notequal', 'TK_grtequal', 'TK_lsequal', 'TK_greater', 'TK_less')) {
            let s = this.#consume('TK_equal', 'TK_notequal', 'TK_grtequal', 'TK_lsequal', 'TK_greater', 'TK_less');
            let e2 = this.#EXP2();
            e1 = new Relational(e1.line, e1.column, e1, s.lexeme, e2);
        }

        return e1;
    }

    #EXP2() {
        // <EXP2> ::= <EXP1> (('+' | '-') <EXP1>)*
        let e1 = this.#EXP1();

        while(this.#match('TK_add', 'TK_sub')) {
            let s = this.#consume('TK_add', 'TK_sub');
            let e2 = this.#EXP1();
            e1 = new Arithmetic(e1.line, e1.column, e1, s.lexeme, e2);
        }

        return e1;
    }

    #EXP1() {
        // <EXP1> ::= <PRIMITIVE> (('*' | '/') <PRIMITIVE>)*
        let e1 = this.#PRIMITIVE();

        while(this.#match('TK_mul', 'TK_div')) {
            let s = this.#consume('TK_mul', 'TK_div');
            let e2 = this.#PRIMITIVE();
            e1 = new Arithmetic(e1.line, e1.column, e1, s.lexeme, e2);
        }

        return e1;
    }

    #PRIMITIVE() {
        /*
        <PRIMITIVE> ::=
            TK_id    |
            TK_int   |
            TK_float |
            TK_str   |
            TK_char  |
            'true'   |
            'false'  |
            '(' <EXP> ')'
        */

        if(this.#match('TK_id', 'TK_int', 'TK_float', 'TK_str', 'TK_char', 'KW_true', 'KW_false')) {
            let p = this.#consume('TK_id', 'TK_int', 'TK_float', 'TK_str', 'TK_char', 'KW_true', 'KW_false');
            if(p) {
                if(p.type === 'TK_id') {
                    return new AccesVar(p.line, p.column, p.lexeme);
                }
                if(p.type === 'TK_int') {
                    return new Primitive(p.line, p.column, p.lexeme, Type.INT);
                }
                if(p.type === 'TK_float') {
                    return new Primitive(p.line, p.column, p.lexeme, Type.FLOAT);
                }
                if(p.type === 'TK_str') {
                    return new Primitive(p.line, p.column, p.lexeme, Type.STRING);
                }
                if(p.type === 'TK_char') {
                    return new Primitive(p.line, p.column, p.lexeme, Type.CHAR);
                }
                if(p.type === 'KW_true' || p.type === 'KW_false') {
                    return new Primitive(p.line, p.column, p.lexeme, Type.BOOLEAN);
                }
            }
        }
        if(this.#match('TK_lpar')) {
            let p = this.#consume('TK_lpar');
            let v = this.#EXP();
            this.#consume('TK_rpar');

            return {
                line: p.line,
                column: p.column,
                traducir: (env, gen) => {
                    let value = v.traducir(env, gen);
                    return {value: `(${value.value})`, type: value.type};
                }
            };
        }
    }

    /**
     * @description Consume un token si coincide con el tipo esperado, registra error en caso contrario.
     *
     * @param {...string} types - Tipos de token esperado.
     * @returns {Token|null} Token consumido o null si no coincide.
     */
    #consume(...types) {
        if(this.#match(...types)) {
            return this.#sc.next_token();
        }
        errors.push({ type: 'Syntax', message: `No se esperaba «${this.#current_token.lexeme}»`, line: this.#current_token.line, column: this.#current_token.column });
        return null;
    }

    /**
     * @description Verifica si el siguiente token coincide con alguno de los tipos especificados (lookahead).
     *
     * @param {...string} types - Lista de tipos de token esperados.
     * @returns {boolean} `true` si coincide alguno, `false` en caso contrario.
     */
    #match(...types) {
        this.#current_token = this.#sc.look_ahead();
        return types.includes(this.#current_token.type);
    }
}