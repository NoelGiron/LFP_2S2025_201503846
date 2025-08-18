import readline from 'readline';
import fs from 'fs'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const leerCampo = (texto) => {
    return new Promise((resolve) => {
        rl.question(`${texto}`, (llamadas) => {
            resolve(llamadas)
        });
    });
}