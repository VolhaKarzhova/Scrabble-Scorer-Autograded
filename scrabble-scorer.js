// This assignment is inspired by a problem on Exercism (https://exercism.org/tracks/javascript/exercises/etl) that demonstrates Extract-Transform-Load using Scrabble's scoring system. 

const input = require("readline-sync");

const oldPointStructure = {
   1: ['A', 'E', 'I', 'O', 'U', 'L', 'N', 'R', 'S', 'T'],
   2: ['D', 'G'],
   3: ['B', 'C', 'M', 'P'],
   4: ['F', 'H', 'V', 'W', 'Y'],
   5: ['K'],
   8: ['J', 'X'],
   10: ['Q', 'Z']
};

function oldScrabbleScorer(word) {
   word = word.toUpperCase;
   let letterPoints = "";

   for (let i = 0; i < word.length; i++) {

      for (const pointValue in oldPointStructure) {

         if (oldPointStructure[pointValue].includes(word[i])) {
            letterPoints += `Points for '${word[i]}': ${pointValue}\n`
         }

      }
   }
   return letterPoints;
}

// your job is to finish writing these functions and variables that we've named //
// don't change the names or your program won't work as expected. //

function initialPrompt() {
   const greeting = "Let's play some scrabble! \nEnter a word to score: "
   wordToScore = input.question(greeting);
   while (!isValidWordToScore(wordToScore)) {
      wordToScore = input.question("Your input is invalid. Try again! \n\n".concat(greeting));
   }
   return wordToScore;
};

function transform(oldPointStructure) {
   let newStructure = {};
   for (const score in oldPointStructure) {
      for (const letter of oldPointStructure[score]) {
         newStructure[letter.toLowerCase()] = Number(score);
      }
   }
   //newStructure[' '] = 0; // moved this line out of the function as it fails the unit test
   return newStructure;
};

let newPointStructure = transform(oldPointStructure);
newPointStructure[' '] = 0; //Bonus task: initially added this code inside transform function, but it started failing unit test. Moved the code here

let simpleScorer = word => {
   word = word.toLowerCase();
   let points = 0;
   for (let index = 0; index < word.length; index++) {
      if (word[index] !== ' ') {
         points += 1;
      }
   }
   return points;
}

let vowelBonusScorer = word => {
   let points = simpleScorer(word);
   word = word.toLowerCase();
   const vowels = ["a", "o", "u", "e", "i"]
   for (let index = 0; index < word.length; index++) {
      if (vowels.includes(word[index])) {
         points += 2;
      }
   }
   return points;
};

let scrabbleScorer = (word) => {
   word = word.toLowerCase();
   let points = 0;
   for (let index = 0; index < word.length; index++) {
      points += newPointStructure[word[index]];
   }
   return points;
}

function isValidWordToScore(word) {
   let letters = "";
   word = word.toLowerCase;
   for (let index = 0; index < word.length; index++) {
      if (word[index] in newPointStructure) {
         letters += word[index];
      }
   }
   return word.length === letters.length;
}

const scoringAlgorithms = [
   { name: "Simple Score", description: "Each letter is worth 1 point.", scorerFunction: simpleScorer },
   { name: "Bonus Vowels", description: "Vowels are 3 pts, consonants are 1 pt.", scorerFunction: vowelBonusScorer },
   { name: "Scrabble", description: "The traditional scoring algorithm.", scorerFunction: scrabbleScorer }
];

function scorerPrompt() {
   let prompt = getPropmtForScoring();
   let selectedAlgorithm = input.question(prompt);
   while (scoringAlgorithms[selectedAlgorithm] === undefined) {
      prompt = "Oops! There is no such an algorithm. Try again!\n".concat(getPropmtForScoring());
      selectedAlgorithm = input.question(prompt);
   }
   return scoringAlgorithms[selectedAlgorithm];
}

function getPropmtForScoring() {
   let prompt = "Which scoring algorithm would you like to use?\n";
   for (let index = 0; index < scoringAlgorithms.length; index++) {
      prompt += (`${index} - ${scoringAlgorithms[index]["name"]}: ${scoringAlgorithms[index]["description"]}\n`);
   }
   prompt += ("Enter 0, 1, or 2: ");
   return prompt;
}

function runProgram() {
   const wordToScore = initialPrompt();
   const scorer = scorerPrompt();
   console.log("You selected scorer: " + scorer.name);
   console.log(`Score for "${wordToScore}" is: ${scorer.scorerFunction(wordToScore)}`);
}

// Don't write any code below this line //
// And don't change these or your program will not run as expected //
module.exports = {
   initialPrompt: initialPrompt,
   transform: transform,
   oldPointStructure: oldPointStructure,
   simpleScorer: simpleScorer,
   vowelBonusScorer: vowelBonusScorer,
   scrabbleScorer: scrabbleScorer,
   scoringAlgorithms: scoringAlgorithms,
   newPointStructure: newPointStructure,
   runProgram: runProgram,
   scorerPrompt: scorerPrompt
};
