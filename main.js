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
                this.displayChoices(data);
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

    displayChoices(currentQ){
        //display answers
        const correctAnswer = currentQ.results[0].correct_answer;
        const otherChoices = currentQ.results[0].incorrect_answers;
        
        let choices = [correctAnswer, ...otherChoices]
        let choicesDisplay = choices.slice(0,choices.length);
        
        let randomIndex

        //display choices to user in a random order
        for(let i=0; i<choices.length; i++){
            //get random index of elements left to display
            randomIndex = currentQ.type === 'boolean' ? Math.random()*2 : Math.random()*4;
            randomIndex = Math.floor(randomIndex);
            // console.log(`the random index for a ${4-i} length array was ${randomIndex}`);
            // console.log(i);
            
            console.log(choicesDisplay);
            console.log(choicesDisplay[randomIndex]);

            //create the html element
            // let li = document.createElement('li');
            // li.textContent = choicesDisplay[randomIndex];
            // console.log(li.innerHTML);

            // document.querySelector('#choices').appendChild(li);

           

            choicesDisplay.splice(randomIndex, 1);
        }
        
        //add event listeners to each answer
            //when clicked, all answer is revealed 
    }


}

