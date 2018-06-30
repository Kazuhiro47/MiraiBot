const Quizz = require('../learn_japanese/japanese.js').Quizz;

exports.run = (client, message) => {

    const q = new Quizz();

    q.questionUser(message);

};