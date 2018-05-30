const translate = require('translate');

translate('Hello world', 'es').then(text => {
    console.log(text);  // Hola mundo
});