export default (obj) => {
    for (const variableKey of Object.keys(obj)) {
        if (obj.hasOwnProperty(variableKey)){
            delete obj[variableKey];
        }
    }
};