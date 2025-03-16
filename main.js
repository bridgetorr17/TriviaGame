/*
CATEGORY NUMBERS FOR API CALLS
    general - 9
    sports - 21
    geography - 22
    history - 23
    politics - 24
    celebrities - 26
    animals - 27
*/
const CATNUMS = [9, 21, 22, 23, 24, 26, 27];
let GAMES = [null, null, null, null, null, null, null]

//event listeners for each category game
document.querySelectorAll('#category li').forEach((category, index) => {
    category.addEventListener('click', () => {
        //create a new game object 
        GAMES[index] = new TriviaGame(CATNUMS[index]);
    });
});

//Each category's respective game is an object
class TriviaGame {
    constructor(category) {
        this.category = category;
        this.difficulty = 'easy';
        this.score = 0;

        this.makeAPICall();
    }

    makeAPICall() {
        let url = `https://opentdb.com/api.php?amount=1&category=${this.category}&difficulty=${this.difficulty}`

        //API call
        fetch(url)
            .then(res => res.json()) // parse response as JSON
            .then(data => {

                //show API data (question and answers)
                this.displayQuestion(data);
                this.displayChoices(data);
            })
            .catch(err => {
                console.log(`error ${err}`)
            });
    }

    displayQuestion(currentQ) {
        let questionInfo = currentQ.results[0];
        console.log(questionInfo);

        //question type
        if (questionInfo.type === 'boolean') document.querySelector('#question-type').innerHTML = 'True or False?';
        else document.querySelector('#question-type').innerHTML = 'Multiple Choice:';

        //question 
        document.querySelector('#question').innerHTML = currentQ.results[0].question;
    }

    displayChoices(currentQ) {

        //get answers
        const correctAnswer = currentQ.results[0].correct_answer;
        const otherChoices = currentQ.results[0].incorrect_answers;

        //combine to one array
        let choices = [correctAnswer, ...otherChoices]
        let choicesDisplay = choices.slice(0, choices.length);

        let randomIndex = 0;

        //display choices to user in a random order
        for (let i = choices.length; i > 0; i--) {

            //get random index of elements left to display
            randomIndex = Math.floor(Math.random() * i);

            //remove that element from array
            let removedChoice = choicesDisplay.splice(randomIndex, 1);
            console.log(`removed ${removedChoice}, remaining choices are ${choicesDisplay}`)

            //create the html element
            let li = document.createElement('li');
            li.textContent = removedChoice;

            document.querySelector('#choices').appendChild(li);

            //listen for user's choice
            this.eventListenerforChoice(li, correctAnswer);
        }
    }

    eventListenerforChoice(li, correctAnswer) {
        li.addEventListener('click', () => {

            //if user picked correct answer...
            if (li.innerHTML === correctAnswer) {
                li.style.backgroundColor = 'rgb(80, 166, 84)';
                this.nextQuestion(true, correctAnswer);
            }

            //otherwise they picked the wrong answer
            else {
                li.style.backgroundColor = 'rgb(201, 60, 60)';
                this.nextQuestion(false, correctAnswer);
            }
        });
    }

    //move forward in the game here
    nextQuestion(result, correctAnswer) {

        //display result to user
        let resultMessage = document.createElement('span');
        if (result) {
            resultMessage.innerHTML = 'That\'s correct!';
        }
        else {
            resultMessage.innerHTML = `Wrong, correct answer was ${correctAnswer}`;
        }

        let next = document.createElement('button');
        next.innerHTML = 'Next Question'
        next.id = 'nextButton'

        document.querySelector('#result').appendChild(resultMessage);
        document.querySelector('#result').appendChild(next);

        //event listener for user to go onto next question
        document.querySelector('#nextButton').addEventListener('click', () => {
            //remove prev answers 
            document.querySelector('#choices').innerHTML = '';
            document.querySelector('#result').innerHTML = '';
            this.makeAPICall();
        });
    }

}
