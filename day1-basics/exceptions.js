class DivideByZeroError extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = 'DivideByZeroError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DivideByZeroError);
        }
    }
}

module.exports = {
    DivideByZeroError
}