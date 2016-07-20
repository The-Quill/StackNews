function high(...args){
    console.log(...args)
}
function medium(...args){
    switch(process.env.NODE_ENV){
        case 'production':
            break;
        default:
            console.log(...args);
            break;
    }
}
function low(...args){
    switch(process.env.NODE_ENV){
        case 'debug':
            console.log(...args);
            break;
    }
}
export default {
    high: high,
    medium: medium,
    low: low
}
