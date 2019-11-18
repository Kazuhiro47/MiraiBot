const axios = require('axios');
const {parse} = require('node-html-parser');

let findDefinitions = (wordQuery) => new Promise((resolve, reject) => {

  axios.get(`https://www.cnrtl.fr/definition/${wordQuery}`).then(res => {

    const root = parse(res.data);

    let contents = root.querySelectorAll('.tlf_cdefinition').map(definition => {
      return definition.firstChild.rawText;
    });
    resolve(contents);

  }).catch(err => reject(err));
  
});

module.exports = findDefinitions;