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

//make event listeners for each category
document.querySelectorAll('#category li').forEach((category, index) => {
    category.addEventListener('click', () => {
        if (GAMES[index] === null){
            GAMES[index] = new TriviaGame(CATNUMS[index]);
        }
    });
});

//Each category's respective game is an object
class TriviaGame{
    constructor(category){
        this.category = category;
        this.difficulty = 'easy';
        this.score = 0;

        this.makeAPICall();
    }

    makeAPICall(){
        let url = `https://opentdb.com/api.php?amount=1&category=${this.category}&difficulty=${this.difficulty}`
    
        //API call
        fetch(url)
            .then(res => res.json()) // parse response as JSON
            .then(data => {
                this.displayQuestion(data);
                this.displayAnswers(data);
            })
            .catch(err => {
                console.log(`error ${err}`)
            });
    }

    displayQuestion(currentQ){
        let questionInfo = currentQ.results[0];
        console.log(questionInfo);

        //question type
        if(questionInfo.type === 'boolean') document.querySelector('#question-type').innerHTML = 'True or False?';
        else document.querySelector('#question-type').innerHTML = 'Multiple Choice:';

        //question 
        document.querySelector('#question').innerHTML = currentQ.results[0].question;
    }

    displayAnswers(currentQ){
        //display answers
        let correctAnswer = currentQ.results[0].correct_answer;


        //add event listeners to each answer
            //when clicked, all answer is revealed 
    }


}

