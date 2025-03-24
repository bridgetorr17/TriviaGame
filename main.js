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

        //categories that change per question
        this.currentQuestion = null;
        this.currentCorrectAnswer = null;

        this.makeAPICall();
    }

    makeAPICall() {
        let url = `https://opentdb.com/api.php?amount=1&category=${this.category}&difficulty=${this.difficulty}`

        //API call
        fetch(url)
            .then(res => res.json()) // parse response as JSON
            .then(data => {

                //clear question and answers from previous API call
                this.clear();

                //store current question as object property
                this.currentQuestion = data;

                //show API data (question and answers)
                this.displayQuestion();
                this.displayChoices();
                this.showTimer();
            })
            .catch(err => {
                console.log(`error ${err}`)
            });
    }

    displayQuestion() {
        let questionInfo = this.currentQuestion.results[0];

        //question type
        if (questionInfo.type === 'boolean') document.querySelector('#question-type').innerHTML = 'True or False?';
        else document.querySelector('#question-type').innerHTML = 'Multiple Choice:';

        //question 
        document.querySelector('#question').innerHTML = this.currentQuestion.results[0].question;
    }

    displayChoices() {

        //get answers
        const correctAnswer = this.currentQuestion.results[0].correct_answer;
        const otherChoices = this.currentQuestion.results[0].incorrect_answers;

        this.currentCorrectAnswer = correctAnswer;

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
            this.eventListenerforChoice(li);
        }
    }

    eventListenerforChoice(li) {
        li.addEventListener('click', () => {

            //if user picked correct answer...
            if (li.innerHTML === this.currentCorrectAnswer) {
                li.style.backgroundColor = 'rgb(80, 166, 84)';
                this.nextQuestion(true);
            }

            //otherwise they picked the wrong answer
            else {
                li.style.backgroundColor = 'rgb(201, 60, 60)';
                this.nextQuestion(false);
            }
        });
    }

    //move forward in the game here
    nextQuestion(result) {

        //display result to user
        let resultMessage = document.createElement('span');
        if (result) {
            resultMessage.innerHTML = 'That\'s correct!';
        }
        else {
            resultMessage.innerHTML = `Wrong, correct answer was ${this.currentCorrectAnswer}`;
        }

        let next = document.createElement('button');
        next.innerHTML = 'Next Question'
        next.id = 'nextButton'

        document.querySelector('#result').appendChild(resultMessage);
        document.querySelector('#result').appendChild(next);

        //event listener for user to go onto next question
        document.querySelector('#nextButton').addEventListener('click', () => {
            this.makeAPICall();
        });
    }

    clear(){
        console.log(`clearing`);
        //remove prev answers 
        document.querySelector('#choices').innerHTML = '';
        document.querySelector('#result').innerHTML = '';
    }

    showTimer(){
        //show timer text
        document.querySelector('.timerSuggestion').hidden = false;

        let timer = 6;
        let intervalId = setInterval(() => {
            timer--;
            document.querySelector('.countdown').innerHTML = timer;

            if(timer <= 0) clearInterval(intervalId);
        }, 1000);
    }

}
