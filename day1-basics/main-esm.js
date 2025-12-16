import toSnakeCase, { capitalize, reverse } from "./string-utils.mjs";

const command = process.argv[2];
const input = process.argv[3];

if (!command || !input) {
    console.error("Please provide a valid command and input string.");
    process.exit(1);
}

try {
    switch (command) {
        case "capitalize":
            console.log(capitalize(input));
            break;
        case "reverse":
            console.log(reverse(input));
            break;
        case "toSnakeCase":
            console.log(toSnakeCase(input));
            break;
        default:
            console.error("Unknown command. Use 'capitalize', 'reverse', or 'toSnakeCase'.");
            process.exit(1);
    }
} catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
}