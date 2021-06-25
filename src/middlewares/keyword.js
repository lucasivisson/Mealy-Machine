function keyword(phrase) {
  for(let i=(phrase.length-1); i>0; i--) {
    letter = phrase.charAt(i);
    if(letter === "?") {
      phrase = phrase.replace("?", "");
    }
  }

  phrase = phrase.trim();

  words = phrase.split(" ");
  word = words.slice(-1);

  return word;
}

module.exports = keyword;