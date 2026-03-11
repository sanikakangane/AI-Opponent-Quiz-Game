/* ================= VARIABLES ================= */
let selectedMode = "";
let currentQuestion = 0;
let timer;
let timeLeft = 15;
let playerScore = 0;
let aiScore = 0;
let answered = false;

/* ================= ELEMENTS ================= */
const cards = document.querySelectorAll(".mode-card");
const lockBox = document.getElementById("lockBox");
const startBtn = document.getElementById("startQuiz");

const quizSection = document.querySelector("#quizsection");
const submitBtn = document.getElementById("submit");
const timerDisplay = document.getElementById("timer");
const popup = document.getElementById("popupMessage");

const resultPopup = document.getElementById("resultPopup");
const userScoreText = document.getElementById("userScore");
const devScoreText = document.getElementById("devScore");
const goHomeBtn = document.getElementById("goHome");
const viewLeaderboardBtn = document.getElementById("viewLeaderboard");

const questionEl = document.getElementById("question");
const option1 = document.getElementById("option_1");
const option2 = document.getElementById("option_2");
const option3 = document.getElementById("option_3");
const option4 = document.getElementById("option_4");
const answers = document.querySelectorAll("input[name='answer']");

const leaderboardList = document.getElementById("leaderboardList");

/* ================= QUESTIONS ================= */
const quizData = [
    {
        question: "What does HTML stand for?",
        a: "Hyper Text Markup Language",
        b: "High Text Machine Language",
        c: "Hyper Tool Multi Language",
        d: "Hyperlink Mark Language",
        correct: "a"
    },
    {
        question: "Which language styles web pages?",
        a: "HTML",
        b: "CSS",
        c: "Python",
        d: "Java",
        correct: "b"
    },
    {
        question: "Which company created JavaScript?",
        a: "Google",
        b: "Apple",
        c: "Netscape",
        d: "Microsoft",
        correct: "c"
    },
    {
        question: "Which tag runs JavaScript in HTML?",
        a: "<javascript>",
        b: "<script>",
        c: "<code>",
        d: "<js>",
        correct: "b"
    },
    {
        question: "Which is NOT a programming language?",
        a: "Python",
        b: "Java",
        c: "HTML",
        d: "C++",
        correct: "c"
    }
];

/* ================= NAVIGATION ================= */
const navLinks = document.querySelectorAll(".navbar a");
const homeBtn = navLinks[0];
const playBtn = navLinks[1];
const leaderboardBtn = navLinks[2];
const forumBtn = navLinks[3];

function setActive(button) {
    navLinks.forEach(link => link.classList.remove("active"));
    button.classList.add("active");
}

window.onload = () => {
    setActive(homeBtn);
    // Load forum initial posts
    initialPosts.forEach(post => addForumPost(post.name, post.message));
};

/* ================= NAVIGATION EVENTS ================= */
homeBtn.onclick = e => {
    e.preventDefault();
    document.querySelector("#homesection").scrollIntoView({ behavior: "smooth" });
    setActive(homeBtn);
};

playBtn.onclick = e => {
    e.preventDefault();
    resetQuiz();
    document.querySelector("#quizsection").scrollIntoView({ behavior: "smooth" });
    setActive(playBtn);
    loadQuestion();
};

leaderboardBtn.onclick = e => {
    e.preventDefault();
    document.querySelector("#leaderboard").scrollIntoView({ behavior: "smooth" });
    setActive(leaderboardBtn);
};

forumBtn.onclick = e => {
    e.preventDefault();
    document.querySelector("#forum").scrollIntoView({ behavior: "smooth" });
    setActive(forumBtn);
};

/* ================= MODE SELECTION ================= */
cards.forEach(card => {
    card.onclick = e => {
        e.stopPropagation();
        cards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedMode = card.id;

        if (selectedMode === "premiumMode" || selectedMode === "tournamentMode") {
            lockBox.style.display = "block";
            startBtn.innerText = "Upgrade Required 🔒";
            startBtn.disabled = true;
        } else {
            lockBox.style.display = "none";
            startBtn.innerText = "Start Quiz";
            startBtn.disabled = false;
        }
    };
});

/* ================= START / RESET QUIZ ================= */
startBtn.onclick = () => {
    if (selectedMode === "") {
        alert("Please select a mode first ⚡");
        return;
    }
    resetQuiz();
    quizSection.scrollIntoView({ behavior: "smooth" });
    setActive(playBtn);
    loadQuestion();
};

function resetQuiz() {
    currentQuestion = 0;
    playerScore = 0;
    aiScore = 0;
    answered = false;
    clearInterval(timer);
    answers.forEach(a => a.checked = false);
    timerDisplay.innerText = "⏱ Time: 15";
    cards.forEach(card => card.classList.remove("selected"));
    selectedMode = "";
    startBtn.innerText = "Start Quiz";
    startBtn.disabled = false;
    lockBox.style.display = "none";
}

/* ================= LOAD QUESTION ================= */
function loadQuestion() {
    answered = false;
    clearInterval(timer);
    answers.forEach(a => a.checked = false);

    let q = quizData[currentQuestion];
    questionEl.innerText = q.question;
    option1.innerText = q.a;
    option2.innerText = q.b;
    option3.innerText = q.c;
    option4.innerText = q.d;

    startTimer();
}

/* ================= TIMER ================= */
function startTimer() {
    timeLeft = 15;
    timerDisplay.innerText = "⏱️ Time: " + timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = "⏱️ Time: " + timeLeft;

        if (timeLeft === 5 && !answered) aiAnswer();
        if (timeLeft <= 0) clearInterval(timer);
    }, 1000);
}

/* ================= AI ANSWER ================= */
function aiAnswer() {
    if (answered) return;
    answered = true;
    clearInterval(timer);
    aiScore++;
    showPopup("😈 Dev answered first! You Lose!", "lose");
}

/* ================= SUBMIT ANSWER ================= */
submitBtn.onclick = () => {
    if (answered) return;

    let selected;
    answers.forEach(a => { if (a.checked) selected = a.id; });

    if (!selected) {
        alert("Select an option!");
        return;
    }

    answered = true;
    clearInterval(timer);

    let correct = quizData[currentQuestion].correct;
    if (selected === correct) {
        playerScore++;
        showPopup("👍 Well Tried!", "win");
    } else {
        aiScore++;
        showPopup("😈 Dev Wins! You Lose!", "lose");
    }
};

/* ================= POPUP ================= */
function showPopup(message, type) {
    popup.innerText = message;
    popup.style.display = "block";
    popup.classList.remove("popup-win", "popup-lose");

    if (type === "win") popup.classList.add("popup-win");
    else popup.classList.add("popup-lose");

    setTimeout(() => {
        popup.style.display = "none";
        nextQuestion();
    }, 2000);
}

/* ================= NEXT QUESTION ================= */
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) loadQuestion();
    else showResult();
}

/* ================= RESULT POPUP ================= */
function showResult() {
    userScoreText.innerText = playerScore;
    devScoreText.innerText = aiScore;
    resultPopup.style.display = "flex";
}

/* ================= GO HOME ================= */
goHomeBtn.onclick = () => {
    resultPopup.style.display = "none";
    resetQuiz();
    document.querySelector("#homesection").scrollIntoView({ behavior: "smooth" });
    setActive(homeBtn);
};

/* ================= LEADERBOARD ================= */
let leaderboardData = [
    { name: "User", score: 0 },
    { name: "Dev", score: 0 }
];

viewLeaderboardBtn.onclick = () => {
    resultPopup.style.display = "none";
    updateLeaderboard();
    document.querySelector("#leaderboard").scrollIntoView({ behavior: "smooth" });
    setActive(leaderboardBtn);
};

function updateLeaderboard() {
    leaderboardData[0].score = playerScore;
    leaderboardData[1].score = aiScore;

    leaderboardData.sort((a, b) => b.score - a.score);

    leaderboardList.innerHTML = "";
    leaderboardData.forEach(entry => {
        let li = document.createElement("li");
        li.innerText = `${entry.name} - ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

/* ================= FORUM ================= */
const postBtn = document.getElementById("postMessage");
const forumInput = document.getElementById("forumMessage");
const forumList = document.getElementById("forumPosts");

// Random preloaded posts
const initialPosts = [
    { name: "Player1", message: "Wow! AI is too strong! 😱" },
    { name: "DevFan", message: "I finally beat the Dev in Free mode! 💪" }
];

function addForumPost(name, message) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${name}:</strong> ${message}`;

    if (name.toLowerCase().includes("dev") || name.toLowerCase().includes("player")) 
        li.style.background = "rgba(255, 47, 179, 0.6)";
    else 
        li.style.background = "rgba(0, 255, 136, 0.6)";

    forumList.prepend(li);
}

postBtn.onclick = () => {
    const message = forumInput.value.trim();
    if (message === "") return alert("Please type a message!");

    addForumPost("You", message);
    forumInput.value = "";
    forumList.scrollTop = 0;
};