import "./style.scss";
import quizQuestions, { IQuestion } from "./questions.mts";

// Variables for quiz and timer
let timerElement: any = document.getElementById("timer");
let timerInterval: any;
let elapsedTime: number = 0;
let isTimerRunning: boolean = false;

// Start quiz button
const startQuizBtn: any = document.getElementById("startQuizBtn");
const endQuizBtn: any = document.getElementById("endQuizBtn");
const playAgainBtn: any = document.getElementById("playAgainBtn");

startQuizBtn.addEventListener("click", startQuiz);
endQuizBtn.addEventListener("click", endQuiz);
playAgainBtn.addEventListener("click", playAgain);


const welcomeSection: any = document.getElementById("welcome");
const questionsSection: any = document.getElementById("questions");
const scoreboardSection: any = document.getElementById("scoreboard");

// Hide welcome page and show the quiz page
function startQuiz() { 

  startTimer();

  welcomeSection.classList.add("hidden");
  questionsSection.classList.remove("hidden");
  
  selectedQuestions = selectRandomQuestions();
    currentQuestionIndex = 0;

    displayQuestion();

    document.getElementById("nextQuestionBtn")!.addEventListener("click", handleNextQuestion);
}

// Variabel for questions
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

const nextQuestionButton = document.getElementById("nextQuestion")!;
const questionTitle = document.getElementById("questionTitle")!;
const questionElement = document.getElementById("question")!;

// Function for display a question
function displayQuestion(): void {
  if (currentQuestionIndex >= selectedQuestions.length) {
    document.getElementById("nextQuestionBtn")!.setAttribute("disabled", "true");
    return;
  }
  
  const question = selectedQuestions[currentQuestionIndex];
  questionTitle.textContent = `Fråga nr ${currentQuestionIndex + 1}`;
  questionElement.innerHTML = `
    ${question.question}
  `;

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
    document.getElementById("nextQuestionBtn")!.removeAttribute("disabled");
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

const answersContainer = document.getElementById("answers") as HTMLElement;
const nextQuestionBtn = document.getElementById("nextQuestionBtn") as HTMLElement;

// Show the answers for the quiz questions
function displayQuizAnswers() {
  answersContainer.innerHTML = "";

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  currentQuestion.answers.forEach((answer, index) => {
    answersContainer.innerHTML += `
      <label>
        <input type="radio" name="quizAnswer" value="${answer}" id="answer${index}">
        <span>${answer}</span>
      </label>
    `;
  })
 
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

        if (answerValue === correctAnswer) {
          button.parentElement!.style.color = "green";
        } else {
          button.parentElement!.style.color = "red";
        }
      });

      // Show "Nästa fråga"-btn
      nextQuestionBtn.hidden = false;
      
    });
  });
}

let points: number = 0;

// Function to update the points
function updatePoints(): void {
  // Get the radio buttons shown on the page
  const radioBtns: NodeListOf<HTMLInputElement> = document.querySelectorAll("input[type='radio']");
  
  // Add an event listener for each radio button and link it to the function "checkAnswers"
  radioBtns.forEach((radioBtn) => {
    radioBtn.addEventListener("click", () => checkAnswer(radioBtn));
  });

  // Get the "play again" button and reset points on click if it exists
  const playAgainBtn: HTMLButtonElement | null = document.getElementById("playAgain") as HTMLButtonElement | null;
  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", resetPoints);
  }
}

// Function to check if the selected radio button is the correct answer
function checkAnswer(selectedRadioBtn: HTMLInputElement): void {
  if (selectedRadioBtn.id === "correctAnswer") {
    points++;
  }
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

  console.log("Quiz slut!");
}

// Start over the quiz
function playAgain() {
  resetTimer();
  currentQuestionIndex = 0;

// Show welcome page and hide scoreboard
scoreboardSection.classList.add("hidden");
welcomeSection.classList.remove("hidden");
}

init();

console.log(updatePoints());

