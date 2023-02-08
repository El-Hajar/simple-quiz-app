"use strict";
//select all required elements
const startButton = document.querySelector(".start-btn");
const infoWrapper = document.querySelector(".info-wrapper");
const exitInfoButton = infoWrapper.querySelector(".exit-btn");
const continueInfoButton = document.querySelector(".continue-btn");

const quizWrapper = document.querySelector(".quiz-wrapper");
const quizTimerSpan = quizWrapper.querySelector(".quiz-timer span");
const quizQueston = quizWrapper.querySelector("article .quiz-queston");
const quizOptions = quizWrapper.querySelector("article .quiz-options");
const questionsCounter = quizWrapper.querySelector(".questions-counter");
const quizContent = quizWrapper.querySelector(".quiz-content");
const nextBtn = quizWrapper.querySelector(".next-btn");

const resultsWapper = document.querySelector(".results-wrapper");
const exitResultsButton = resultsWapper.querySelector(".exit-btn");
const replayButton = resultsWapper.querySelector(".continue-btn");
const evaluation = resultsWapper.querySelector(".eval");

//set options
const url = "quiz.json";
let quizLength = 0;
let currentIndex = 0;
let duration = 5;
let countdownInterval = 0;
let timeLineInterval = 0;
let rightAnswersCounter = 0;

//create iconTick
const iconTickWrapper = document.createElement("span");
const iconTick = document.createElement("li");
iconTickWrapper.appendChild(iconTick);
iconTickWrapper.className = "tick icon";
iconTick.className = "fas fa-check";
//create icon Cross
const iconCrossWrapper = document.createElement("span");
const iconCross = document.createElement("li");
iconCrossWrapper.appendChild(iconCross);
iconCrossWrapper.classList = "cross icon";
iconCross.classList = "fas fa-times";

/*button events*/
startButton.addEventListener("click", (event) => {
  infoWrapper.classList.add("show-box");
});

exitInfoButton.addEventListener("click", () => {
  infoWrapper.classList.remove("show-box");
});

exitResultsButton.addEventListener("click", () => {
  resultsWapper.classList.remove("display-results");
  window.location.reload();
});

fetchData(url);

function fetchData(url) {
  let questions = fetch(url);
  questions
    .then((response) => {
      if (response.status === 200 && response.ok === true)
        return response.json();
      else {
        return response.json().then((obj) => {
          throw obj;
        });
      }
    })
    .then((data) => {
      quizLength = data.length;

      continueInfoButton.addEventListener("click", () => {
        infoWrapper.classList.remove("show-box");
        quizWrapper.classList.add("show-box");
        displayData(data[currentIndex]);
        checkAnswer(data[currentIndex].answer);
        currentIndex++;
      });

      nextBtn.addEventListener("click", () => {
        if (currentIndex < quizLength) {
          //remove previous question content and display current question
          previousToCurrentQst(data[currentIndex]);
        } else {
          showResults();
          quizWrapper.classList.remove("show-box");
        }
      });

      replayButton.addEventListener("click", () => {
        resultsWapper.classList.remove("display-results");
        quizWrapper.classList.add("show-box");
        currentIndex = 0;
        rightAnswersCounter = 0;
        nextBtn.classList.remove("enable-next-btn");
        previousToCurrentQst(data[currentIndex]);
      });
    });
}

function previousToCurrentQst(currenQqst) {
  quizQueston.innerHTML = "";
  quizOptions.innerHTML = "";
  questionsCounter.innerHTML = "";
  clearInterval(countdownInterval);
  clearInterval(timeLineInterval);
  displayData(currenQqst);
  checkAnswer(currenQqst.answer);
  currentIndex++;
}

function displayData(data) {
  if (currentIndex < quizLength) {
    //header
    countdown(duration);
    startTimeLine(0);
    //question
    let quizQuestionText = document.createTextNode(data.question);
    quizQueston.appendChild(quizQuestionText);
    //create options element & insert options data
    for (let i = 0; i < 4; i++) {
      let quizOption = document.createElement("p");
      let quizOptionText = document.createTextNode(data.options[i]);

      quizOption.classList.add("option");
      quizOption.dataset.option = data.options[i];
      quizOption.role = "button";
      quizOption.appendChild(quizOptionText);
      quizOptions.appendChild(quizOption);
    }
    //& footer
    let questionsCounterText = document.createTextNode(
      `Question ${currentIndex + 1} of ${quizLength}`
    );
    questionsCounter.appendChild(questionsCounterText);
  }
}

function countdown(duration) {
  if (currentIndex < quizLength) {
    let munites, seconds;

    countdownInterval = setInterval(() => {
      munites = parseInt(duration / 60);
      seconds = duration % 60;

      munites = munites < 10 ? `0${munites}` : `${munites}`;
      seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

      quizTimerSpan.innerHTML = `${munites}:${seconds}`;
      //decrement duration
      if (--duration < 0) {
        clearInterval(countdownInterval);
        nextBtn.click();
        //enable next question Button
        if (currentIndex == 2) {
          nextBtn.classList.add("enable-next-btn");
        }
      }
    }, 1000);
  } else {
    showResults();
  }
}

function startTimeLine(time) {
  timeLineInterval = setInterval(() => {
    let timeLine = quizWrapper.querySelector(".time-line");
    let width = quizWrapper.scrollWidth;
    if (time++ < width) {
      timeLine.style.width = time + "px";
    }
  }, 10);
}

function checkAnswer(answer) {
  let options = document.querySelectorAll(".option");

  options.forEach((optionElement) => {
    optionElement.addEventListener("click", (e) => {
      clearInterval(countdownInterval);
      clearInterval(timeLineInterval);
      if (answer === optionElement.dataset.option) {
        addTickIconTag(optionElement);
        options.forEach((option) => {
          option.classList.add("disabled");
        });
        rightAnswersCounter++;
      } else {
        addCrossIconTag(optionElement);
        options.forEach((option) => {
          if (answer === option.dataset.option) {
            addTickIconTag(option);
          }
          option.classList.add("disabled");
        });
      }
      //if don't click
      //enable next question Button
      if (currentIndex == 1) {
        nextBtn.classList.add("enable-next-btn");
      }
    });
  });
}

function addTickIconTag(optionElement) {
  optionElement.classList.add("correct");
  optionElement.appendChild(iconTickWrapper);
}

function addCrossIconTag(optionElement) {
  optionElement.classList.add("wrong");
  optionElement.appendChild(iconCrossWrapper);
}

function showResults() {
  resultsWapper.classList.add("display-results");
  if (rightAnswersCounter === quizLength) {
    evaluation.innerHTML = `<span class="perfect">Perfect! </span> you got <strong> ${rightAnswersCounter}</strong> out of <strong>${quizLength}<strong>`;
  } else if (rightAnswersCounter < quizLength / 2) {
    evaluation.innerHTML = `<span class="bad">Bad!</span> you got <strong> ${rightAnswersCounter}</strong> out of <strong>${quizLength}<strong>`;
  } else {
    evaluation.innerHTML = `<span class="good"> Good! </span> you got <strong> ${rightAnswersCounter}</strong> out of <strong>${quizLength}<strong>`;
  }
}
