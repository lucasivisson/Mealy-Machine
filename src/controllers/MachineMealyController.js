const answers = require('../database/answers');
const keyword = require('../middlewares/keyword');

module.exports = {
  async store(request, response) {
    const {subject, predicate, object} = request.body;
    
    if(!(subject && predicate && object)) {
      return response.status(400).json({
        error: 'Para enviar uma pergunta, você deve enviar a pergunta passando os parâmetros sujeito, predicado e objeto na requisição.'
      });
    }

    const QQQQOPC = ["que", "o que", "quem", "qual", "quando", "onde", "por que", "como"];

    const subjectIsQQQQOPC = QQQQOPC.find((word) => word === subject.toLowerCase());

    if(!subjectIsQQQQOPC) {
      return response.status(400).json({
        error: 'Para enviar uma pergunta, você deve enviar o parâmetro subject com algum valor de QQQQOPC'
      });
    }

    const database = answers.answers.filter((word) => {
      if(word.type === subjectIsQQQQOPC) {
        return word;
      }
    });

    let comparation = database.filter((phrase) => {
      let questionObjectKeyword = keyword(object);
      let answerSubjectKeyword = keyword(phrase.subject);
      if(questionObjectKeyword[0].toLowerCase() === answerSubjectKeyword[0].toLowerCase()) {
        return phrase;
      }
      let answerObjectKeyword = keyword(phrase.object);
      if(questionObjectKeyword[0].toLowerCase() === answerObjectKeyword[0].toLowerCase()) {
        return phrase;
      }
    });

    console.log(comparation);

    if(comparation.length > 1 || comparation.length === 0) {
      let comparationPredicate = database.filter((phrase) => {
        let questionPredicateKeyword = keyword(predicate);
        let answerPredicateKeyword = keyword(phrase.predicate);
        if(questionPredicateKeyword[0].toLowerCase() === answerPredicateKeyword[0].toLowerCase()) {
          return phrase;
        }
      });
      if(comparationPredicate.length === 1 || comparation.length === 0) {
        comparation = comparationPredicate;
      }
    }
    if(comparation.length === 0) {
      return response.status(404).json({
        error: "Desculpe, não tenho resposta para sua pergunta. Tente perguntar utilizando outras palavras."
      })
    }

    let result = [];

    for(let i=0; i<comparation.length; i++) {
      let phrase = { response: "" + comparation[i].subject + " " + comparation[i].predicate + " " + comparation[i].object };
      result.push(phrase); 
    }

    return response.status(200).json(result)
  }
}