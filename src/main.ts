import "./style.scss";
import quizQuestions, { IQuestion } from "./questions.mts";

// Variables for quiz and timer
const timerElement = document.getElementById("timer") as HTMLElement;
let timerInterval: number;
let elapsedTime: number = 0;
let isTimerRunning: boolean = false;

// Start quiz button
const startQuizBtn = document.getElementById("startQuizBtn") as HTMLButtonElement;
const endQuizBtn = document.getElementById("endQuizBtn") as HTMLButtonElement;
const playAgainBtn = document.getElementById("playAgainBtn") as HTMLButtonElement;

startQuizBtn.addEventListener("click", startQuiz);
endQuizBtn.addEventListener("click", endQuiz);
playAgainBtn.addEventListener("click", playAgain);


const welcomeSection = document.getElementById("welcome") as HTMLElement;
const questionsSection = document.getElementById("questions") as HTMLElement;
const scoreboardSection = document.getElementById("scoreboard") as HTMLElement;
const nextQuestionBtn = document.getElementById("nextQuestionBtn") as HTMLElement;

// Hide welcome page and show the quiz page
function startQuiz() { 

  startTimer();

  welcomeSection.classList.add("hidden");
  questionsSection.classList.remove("hidden");
  
  selectedQuestions = selectRandomQuestions();
    currentQuestionIndex = 0;

    displayQuestion();

   nextQuestionBtn!.addEventListener("click", handleNextQuestion);
}

// Variabel for questions
let correctAnswers: number = 0;
let totalTime: number = 0;
let currentQuestionIndex = 0;
let selectedQuestions: IQuestion[] = [];
const usedQuestions: Set<IQuestion> = new Set();

// Function for randomize questions
function selectRandomQuestions(): IQuestion[] {
    const availableQuestions = quizQuestions.filter((q) => !usedQuestions.has(q));
  
    // If the user played two times the quiz starts over
    if (availableQuestions.length < 10) {
      usedQuestions.clear(); 
      availableQuestions.push(...quizQuestions);
    }
  
    const shuffled = availableQuestions.sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, 10);
  
    questions.forEach((q) => usedQuestions.add(q)); 
    return questions;
}

const questionTitle = document.getElementById("questionTitle")!;
const questionElement = document.getElementById("question")!;

// Function for display a question
function displayQuestion(): void {
  if (currentQuestionIndex >= selectedQuestions.length) {
    nextQuestionBtn!.setAttribute("disabled", "true");
    return;
  }
  
  const question = selectedQuestions[currentQuestionIndex];
  questionTitle.textContent = `Fråga nr ${currentQuestionIndex + 1}`;
  questionElement.textContent = `${question.question}`;

  if (currentQuestionIndex <= 8) {
    // Show "Next question"-btn
    nextQuestionBtn.hidden = false;
  } else {
    // Hide "Next question"-btn and show "End game"-btn 
    nextQuestionBtn.hidden = true;
    endQuizBtn.hidden = false;
  }

  // Show the answer for the question as well
  displayQuizAnswers();
}

// Function for next question
function handleNextQuestion(): void {
  currentQuestionIndex++;
  displayQuestion();
  displayQuizAnswers();
}

// Start over the quiz
function handlePlayAgain(): void {
    nextQuestionBtn!.removeAttribute("disabled");
    startQuiz();
}
  
// When the page is loaded
function init() {
    const startQuizButton = document.getElementById("startQuiz");
    const playAgainButton = document.getElementById("playAgain");
  
    // If the buttons exist, add event listener
    if (startQuizButton) {
      startQuizButton.addEventListener("click", startQuiz);
    }
  
    if (playAgainButton) {
      playAgainButton.addEventListener("click", handlePlayAgain);
    }
};

let points: number = 0;

// Show the answers for the quiz questions
function displayQuizAnswers() {
  
  const answersContainer = document.getElementById("answers") as HTMLElement;
  answersContainer.innerHTML = "";

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  currentQuestion.answers.forEach((answer, index) => {
    answersContainer.innerHTML += `
      <label>
        <input type="radio" name="quizAnswer" value="${answer}" id="answer${index}">
        <span>${answer}</span>
      </label>
    `;
  });
 
  const radioButtons = document.querySelectorAll(`input[name="quizAnswer"]`);

  // Add an event for each radioBtn when pressing it
  radioButtons.forEach((radioButton) => {
    radioButton.addEventListener("change", () => {
      const correctAnswer = currentQuestion.correctAnswer;
  
      // Resets the markings on all answers and to the default color
      document.querySelectorAll("label").forEach((label) => {
        label.style.color = "initial";
      });
  
      // Mark which options are correct/incorrect and adds color
      radioButtons.forEach((button) => {
        const answerValue = (button as HTMLInputElement).value;
        const labelForRadioBtn = button.parentElement!;

        if (answerValue === correctAnswer) {
          labelForRadioBtn.style.color = "green";
          (button as HTMLInputElement).id = "correctAnswer";

          const icon = document.createElement("span");
          icon.className = "material-symbols-outlined";
          icon.textContent = "check";
          icon.ariaLabel = "Right answer";
          labelForRadioBtn.appendChild(icon);

          
          if ((button as HTMLInputElement).checked) {
            correctAnswers++;
          }
        } else {
          labelForRadioBtn.style.color = "red";

          const icon = document.createElement("span");
          icon.className = "material-symbols-outlined";
          icon.textContent = "close";
          icon.ariaLabel = "Wrong answer";
          labelForRadioBtn.appendChild(icon);
        }

         // Disable all radio buttons after one is pressed
         (button as HTMLInputElement).disabled = true;
  
        // Check if the selected answer is correct
        if ((button as HTMLInputElement).checked && answerValue === correctAnswer) {
          points++;
        }
      });
      
      if (currentQuestionIndex >= 9) {
        endQuizBtn.removeAttribute("disabled");
      }
    });
  });
}

  // Get the "play again" button and reset points on click if it exist
  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", resetPoints);
  }

// Function to reset the points to 0
function resetPoints(): void {
  points = 0;
} 

// Timer functions
function startTimer() {
  if (isTimerRunning) 
    return; 
  
  timerInterval = setInterval(() => {
    elapsedTime++;
    timerElement.textContent = `Tid: ${elapsedTime}s`; 
  }, 1000);

  isTimerRunning = true;
}

function stopTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
}

function resetTimer() {
  elapsedTime = 0;
  timerElement.textContent = `Tid: 0s`;
}

// End of the quiz and show results
function endQuiz() {
  stopTimer();


  // Show scoreboard and hide quiz page
  questionsSection.classList.add("hidden");
  scoreboardSection.classList.remove("hidden");
  // Uppdatera total tid
  totalTime = elapsedTime;

// Update the scoreboard
  const scoreboardContainer = document.getElementById("scoreboardContainer") as HTMLElement;
  scoreboardContainer.innerHTML = `
    <p>Poäng: ${points}</p>
    <p>Rätta svar: ${correctAnswers} / ${selectedQuestions.length}</p>
    <p>Tid: ${totalTime} sekunder</p>
  `;

}

// Start over the quiz
function playAgain() {
  resetTimer();
  resetPoints();

  currentQuestionIndex = 0;
  correctAnswers = 0; 
  points = 0;

  // Disable and hide "End game"-btn if playing again
  endQuizBtn.setAttribute("disabled", "true");
  endQuizBtn.hidden = true;

  selectedQuestions = selectRandomQuestions();

  displayQuestion();
  displayQuizAnswers();

  totalTime = 0;

  // Show welcome page and hide scoreboard
  scoreboardSection.classList.add("hidden");
  welcomeSection.classList.remove("hidden");
}

init();

