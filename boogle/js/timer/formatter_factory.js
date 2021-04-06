
/**
 * Utility function to add a leading zero to a number < 10
 * @param {int} value 
 */
function leadingZero(value) {
    if(value < 10) {
        return `0${value}`;
    }
    return value;
}

/**
 * Numeric timer format.
 * 
 * @param {Timer} timer 
 */
function numericalFormatter(timer) {
    let minute = leadingZero(Math.floor(timer.interval / 60));
    let seconds = leadingZero(timer.interval % 60);
    return `${minute}:${seconds}`;
};

/**
 * T-minus timer count format 
 * @param {Timer} timer 
 */
function lexicalFormatter(timer) {
    let minute = leadingZero(Math.floor(timer.interval / 60));
    let seconds = leadingZero(timer.interval % 60);
    return `T-minus ${minute} minutes and ${seconds} seconds`;
};

function lexicalCompactFormatter(timer) {
    let minute = leadingZero(Math.floor(timer.interval / 60));
    let seconds = leadingZero(timer.interval % 60);
    return `T-minus ${minute}:${seconds}`;
}

const formatters = {
    numerical: numericalFormatter,
    lexical: lexicalFormatter,
    lexical_compact : lexicalCompactFormatter
};

export {
    formatters,
    numericalFormatter,
    lexicalFormatter,
    lexicalCompactFormatter
};