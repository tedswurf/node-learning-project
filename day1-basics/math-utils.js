const { DivideByZeroError } = require('./Exceptions');

function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new DivideByZeroError("Division by zero is not allowed.");
    }

    return a / b;
}

module.exports = {
    add,
    multiply,
    divide
}