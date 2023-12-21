const flagImage = document.getElementById('flag-image');
const answersContainer = document.getElementById('answers');
const scoreContainer = document.getElementById('score');
const questionNoText = document.getElementById("question-no");
const quizHeading = document.getElementById("quiz-heading");
const prompt = document.getElementById("prompt");
   
const apiUrl = 'https://restcountries.com/v2/all';
let countries = [];
let score = 0;
let currentQuestionIndex = 0;

// Fetch data from the specified API URL, assign it to the 'countries' variable, and start the quiz.
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    countries = data;
    startQuiz();
  })
  .catch(error => console.error('Error fetching data:', error));

  /*  Function to start the quiz by fetching country data from an API, shuffling the questions,
      initializing the current question index, and resetting the score to zero. */
  function startQuiz() {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        countries = shuffleArray(data);
        currentQuestionIndex = 0;
        score = 0;
  
        // Reset the flag image container to be visible
        const flagImage = document.getElementById('flag-image');
        flagImage.style.display = '';
  
        showQuestion();
  
        // Reset the prompt to its normal message
        
        prompt.innerHTML = "Choose which country belongs to this flag"; 
        quizHeading.innerHTML = "Flag Master Quiz";
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  
/**
 * Function to display a quiz question.
 * - Retrieves the current question object from the 'countries' array.
 * - Retrieves the HTML element for displaying the question number.
 * - Calculates the current question number (adding 1 because array indices start from 0).
 * - Updates the inner HTML of the question number element.
 * - Updates the score
 */

function showQuestion() {
  const currentQuestion = countries[currentQuestionIndex]; 
  const questionNoText = document.getElementById("question-no"); 
  let questionNo = currentQuestionIndex + 1; 
  questionNoText.innerHTML = `Question ${questionNo} of 5`;

  updateScore(); 

  // Display the image for current flag 
  flagImage.innerHTML = `<img src="${currentQuestion.flags.svg}" alt="Flag">`;

  // function to create an array of answers for question
  const answers = shuffleArray([
    currentQuestion.name,
    getRandomCountryName(),
    getRandomCountryName(),
    getRandomCountryName()
  ]);

  answersContainer.innerHTML = '';
  // Creating the answer buttons and applying styles
  answers.forEach(answer => {
    const button = document.createElement('button');
    button.className = 'answer-btn';
    button.textContent = answer; 
    button.addEventListener('click', () => checkAnswer(answer));
    answersContainer.appendChild(button);
  });
}


// Function that checks the user's answers 
function checkAnswer(selectedAnswer) {
  const correctAnswer = countries[currentQuestionIndex].name;
  const buttons = answersContainer.querySelectorAll('.answer-btn');

// Disable all the buttons after user selects answer
  buttons.forEach(button => {
    button.disabled = true; 
    // Check each button
    if (button.textContent === correctAnswer) { 
      // Mark the button with the correct answer
      button.classList.add('correct');
    } else if (button.textContent === selectedAnswer) { 
      // Mark the button with the incorrect answer 
      button.classList.add('incorrect');
    }
  });

  if (selectedAnswer === correctAnswer) {
    score++;
  }

  updateScore();
  //// Set a delay of 1500 milliseconds (1.5 seconds) before transitioning to the next question
  setTimeout(nextQuestion, 1500);
}

// Function to increment the current question and show the next question or end the quiz 
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < countries.length && currentQuestionIndex < 5) {
    showQuestion();
  } else {
    endQuiz();
  }
}

// End the quiz when the user selects the last answer

function endQuiz() {
  
  
  flagImage.style.display = "none";
  
  // Clearing Score and Question Number container 
  scoreContainer.textContent = '';
  questionNoText.textContent = '';
  const prompt = document.getElementById("prompt");
  const quizHeading = document.getElementById("quiz-heading"); 
  
  // Update content to show user's score and quiz completion message. 
  prompt.innerHTML = `You Scored ${score} out of 5!`; 
  quizHeading.innerHTML = " Quiz Completed! "
  // Clear the answer container as the quiz is complete 
  answersContainer.innerHTML = ''; 

  // Creating the Play Again button
  const playAgainButton = document.createElement('button');
  playAgainButton.className = 'answer-btn'; 
  playAgainButton.textContent = 'Play Again';
  
  //Creating the click event for the play button and calling the startQuiz function 
  playAgainButton.addEventListener('click', startQuiz);
  answersContainer.appendChild(playAgainButton); 
  
}

// Function to update the score
function updateScore() {
  scoreContainer.textContent = `Score: ${score}`;
}

// Function to shuffle the answers which contain the country names
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Function to generate a random country name 
function getRandomCountryName() {
  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex].name;
}
