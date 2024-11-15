const timerEl = document.getElementById("timer");
const playPause = document.getElementById("playPause");
const container = document.querySelector(".container");
const optionBtnContainer = document.querySelector(".option-btn-container");
const optionBtns = document.querySelectorAll(".option-btn");

const audio = new Audio("sound.mp3");

// Modal
const configBtn = document.getElementById("config");
const closeBtn = document.getElementById("closeBtn");
const applyBtn = document.getElementById("apply");
const settingsModal = document.querySelector(".settings-modal");
const overlay = document.querySelector(".overlay");

const pomodoroInput = document.getElementById("pomodoroInput");
const shortBreakInput = document.getElementById("shortBreakInput");
const longBreakInput = document.getElementById("longBreakInput");

// Presets

const timersSettings = {
	pomodoro: {
		name: "pomodoro",
		time: 1500,
		classe: "red"
	},
	shortBreak: {
		name: "shortBreak",
		time: 300,
		classe: "green"
	},
	longBreak: {
		name: "longBreak",
		time: 900,
		classe: "blue"
	}
};

let currentTimerInterval,
	currentTimerSetting,
	definedTime,
	timerIsRunning,
	round,
	maxRound;

// Functions

const updateTimerEl = function () {
	const min = String(Math.trunc(definedTime / 60)).padStart(2, 0);
	const sec = String(Math.trunc(definedTime % 60)).padStart(2, 0);
	timerEl.innerHTML = `${min}:${sec}`;
};

const getSettingsStored = function () {
	const timersSettingsStored = JSON.parse(
		localStorage.getItem("timersSettings")
	);

	if (!timersSettingsStored) return;

	timersSettings.pomodoro.time = timersSettingsStored.pomodoro.time;
	timersSettings.shortBreak.time = timersSettingsStored.shortBreak.time;
	timersSettings.longBreak.time = timersSettingsStored.longBreak.time;

	pomodoroInput.value = timersSettings.pomodoro.time / 60;
	shortBreakInput.value = timersSettings.shortBreak.time / 60;
	longBreakInput.value = timersSettings.longBreak.time / 60;
};

const init = function () {
	getSettingsStored();
	currentTimerSetting = timersSettings.pomodoro;
	definedTime = currentTimerSetting.time;
	updateTimerEl();
	timerIsRunning = false;
	round = 0;
	maxRound = 4;
};

init();

const resetTimer = function () {
	clearInterval(currentTimerInterval);
	timerIsRunning = false;
	playPause.innerHTML = "PLAY";
	container.classList.remove("red", "green", "blue");
	optionBtns.forEach((btn) => btn.classList.remove("active-option-btn"));
};

const changeTimerInterface = function (id) {
	currentTimerSetting = timersSettings[id];
	definedTime = timersSettings[id].time;
	document.getElementById(`${id}`).classList.add("active-option-btn");
	container.classList.add(timersSettings[id].classe);
	updateTimerEl();
};

const startTimer = function () {
	const tick = function () {
		definedTime--;
		updateTimerEl();

		if (definedTime === 0) {
			audio.play();

			resetBtn();
			if (currentTimerSetting === timersSettings.pomodoro) {
				round++;
				if (round >= maxRound) {
					maxRound += 4;
					changeTimerInterface("longBreak");
				} else {
					changeTimerInterface("shortBreak");
				}
			} else {
				changeTimerInterface("pomodoro");
			}
		}
	};

	timerIsRunning = true;
	tick();
	const timer = setInterval(tick, 1000);
	return timer;
};

// Event handlers

playPause.addEventListener("click", function () {
	if (!timerIsRunning) {
		currentTimerInterval = startTimer();
		playPause.innerHTML = "PAUSE";
	} else {
		clearInterval(currentTimerInterval);
		timerIsRunning = false;
		playPause.innerHTML = "PLAY";
	}
});
optionBtnContainer.addEventListener("click", function (e) {
	if (e.target.classList.contains("option-btn")) {
		resetTimer();
		e.target.classList.add("active-option-btn");
		changeTimerInterface(e.target.id);
	}
});

// Setting Modal

configBtn.addEventListener("click", function () {
	settingsModal.classList.remove("hidden");
	overlay.classList.remove("hidden");
});

const closeModal = function () {
	settingsModal.classList.add("hidden");
	overlay.classList.add("hidden");
};

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
	if (e.key == "Escape" && !settingsModal.classList.contains("hidden"))
		closeModal();
});

applyBtn.addEventListener("click", function () {
	timersSettings.pomodoro.time = Number(pomodoroInput.value) * 60;
	timersSettings.shortBreak.time = Number(shortBreakInput.value) * 60;
	timersSettings.longBreak.time = Number(longBreakInput.value) * 60;
	localStorage.setItem("timersSettings", JSON.stringify(timersSettings));
	changeTimerInterface(currentTimerSetting.name);
	closeModal();
});
