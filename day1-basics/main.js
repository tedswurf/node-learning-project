const math = require('./math-utils');
const { DivideByZeroError } = require('./Exceptions');

action = process.argv[2];
numerator = process.argv[3];
denominator = process.argv[4];

if (!action ||!numerator || !denominator) {
    console.log('Please provide the action, numerator and denominator as command line arguments.');
    process.exit(1);
}

try {
    console.log(`${numerator} ${action} ${denominator} = ${math[action](Number(numerator), Number(denominator))}`);
}
catch (error) {
    if (error instanceof DivideByZeroError) {
        console.error("Error: Division by zero is not allowed. Please refine your input.");
        process.exit(1);
    }
    else {
        console.error("An unexpected error occurred:", error.message);
        process.exit(1);
    }
}
