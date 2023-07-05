"use strict";

(function(){
	AOS.init({
		disable : 'mobile',
	})
})()

const categoriesContainer = document.querySelector(".categories"),
	levelElementsContainer = document.querySelector(".levels"),
	loaderContainer = document.querySelector(".loader-container"),
	mainContainer = document.querySelector(".main"),
	resultContainer = document.querySelector(".result-container"),
	backButton = document.querySelector(".back-btn"),
	themeCheckBox = document.querySelector("#theme-input");
let answeredQuestion = 0,
	selectedCategoryId,
	selectedLevel,
	currectQuestionNumber = 1,
	allQuestions,
	countDownTimer,
	currentQuestion;
function handleBackButton() {
	(categoriesContainer.style.display =
		"flex"), (levelElementsContainer.style.display = "none");
}
function handleCategorySelect() {
	(selectedCategoryId = this.firstElementChild.dataset.id) &&
		(
			(categoriesContainer.style.display = "none"),
			(levelElementsContainer.style.display = "flex"),
			levelElementsContainer.querySelectorAll(".level").forEach(a => {
				a.addEventListener("click", handleLevelSelect);
			})
		);
}
function handleLevelSelect() {
	(selectedLevel = this.firstElementChild.textContent), selectedCategoryId &&
		selectedLevel &&
		fetchQuestions();
}
async function fetchQuestions() {
	setPreloaderDisplay("flex");
	let b = `https://opentdb.com/api.php?amount=5&category=${selectedCategoryId}&difficulty=${selectedLevel.toLowerCase()}&type=multiple`,
		a = await fetch(b),
		{ results: c } = await a.json();
	200 === a.status &&
		(setPreloaderDisplay("none"), (allQuestions = c), startQuiz());
}
function startQuiz() {
	if (6 === currectQuestionNumber) {
		showResults();
		return;
	}
	let a = document.querySelector(".ques-title"),
		b = document.querySelector(".step");
	(currentQuestion =
		allQuestions[currectQuestionNumber - 1]), (loaderContainer.style.transform =
		"translateX(3000px)"), (mainContainer.style.transform =
		"translateY(-97vh)"), (a.innerHTML =
		currentQuestion.question), (b.textContent = currectQuestionNumber), setOptions();
}
function setOptions() {
	let a = document.querySelectorAll(".opt"),
		b = Math.floor(4 * Math.random()),
		c = 0;
	(a[b].innerHTML = currentQuestion.correct_answer), a.forEach((a, d) => {
		(a.className = "opt"), d !== b &&
			(a.innerHTML =
				currentQuestion.incorrect_answers[c++]), a.addEventListener(
			"click",
			handleQuestionAnswer
		);
	}), startCountDown();
}
function startCountDown() {
	let a = document.querySelector(".countdown-slider"),
		b = 0;
	countDownTimer = setInterval(() => {
		(a.style.width = `${2 * b / 100}%`), 5e3 === b &&
			(showCorrectAnswers(), clearInterval(countDownTimer)), (b += 200);
	}, 200);
}
function showCorrectAnswers() {
	let a = document.createElement("span"),
		b = document.querySelectorAll(".opt");
	a.innerHTML = currentQuestion.correct_answer;
	let c = Array.from(b).find(b => b.innerHTML === a.innerHTML);
	c.classList.add("correct"), nextQuestion();
}
function nextQuestion() {
	clearEvents(), currectQuestionNumber++, setTimeout(startQuiz, 1300);
}
function clearEvents() {
	let a = document.querySelectorAll(".opt");
	a.forEach(a => {
		a.removeEventListener("click", handleQuestionAnswer);
	});
}
function handleQuestionAnswer() {
	clearInterval(countDownTimer);
	let a = document.createElement("span"),
		b = document.querySelectorAll(".opt");
	a.innerHTML = currentQuestion.correct_answer;
	let c = Array.from(b).find(b => b.innerHTML === a.innerHTML);
	this.innerHTML === a.innerHTML
		? (this.classList.add("correct"), answeredQuestion++)
		: (
				this.classList.add("incorrect"),
				c.classList.add("correct")
			), nextQuestion();
}
function setPreloaderDisplay(a) {
	let b = document.querySelector(".preloader-container");
	b.style.display = a;
}
function showResults() {
	let a = document.querySelector(".truthy"),
		b = document.querySelector(".tryagain");
	(a.textContent = answeredQuestion), (mainContainer.style.transform =
		""), (resultContainer.style.transform =
		"translateY(calc(-190vh))"), b.addEventListener("click", restartQuiz);
}
function restartQuiz() {
	(answeredQuestion = 0), (currectQuestionNumber = 1), (resultContainer.style.transform =
		""), (loaderContainer.style.transform =
		""), (categoriesContainer.style.display =
		"flex"), (levelElementsContainer.style.display = "none");
}
function handleUserTheme() {
	this.checked
		? (
				(document.body.className = "dark"),
				localStorage.setItem("theme", "dark")
			)
		: (
				(document.body.className = "light"),
				localStorage.setItem("theme", "light")
			);
}
function loadUserTheme() {
	let a = localStorage.getItem("theme") || "light";
	"dark" === a && (themeCheckBox.checked = !0), document.body.classList.add(a);
}
backButton.addEventListener(
	"click",
	handleBackButton
), categoriesContainer.querySelectorAll(".category").forEach(a => {
	a.addEventListener("click", handleCategorySelect);
}), themeCheckBox.addEventListener(
	"change",
	handleUserTheme
), (window.onload = loadUserTheme);
