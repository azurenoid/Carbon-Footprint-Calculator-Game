const questions = [
    {
        question: "How often do you eat animal-based products?",
        options: ["Daily", "A few times a week", "Around once a week", "Never"],
        scores: [3, 2, 1, 0] // 0 is the best answer (Never)
    },
    {
        question: "How do you usually travel?",
        options: ["By car alone", "Carpool", "Public transport", "Bike/Walk"],
        scores: [3, 2, 1, 0] // 0 is the best answer (Bike/Walk)
    },
    {
        question: "How much recyclable waste do you recycle?",
        options: ["None", "Some", "Most", "All"],
        scores: [3, 2, 1, 0] // 0 is the best answer (All)
    },
    {
        question: "What type of energy do you use at home?",
        options: ["Non-renewable", "Some renewable", "Mostly renewable", "100% renewable"],
        scores: [3, 2, 1, 0] // 0 is the best answer (100% renewable)
    },
    {
        question: "How often do you buy new clothes?",
        options: ["Weekly/Monthly", "Every 2 months", "Around twice a year", "Once a year or less"],
        scores: [3, 2, 1, 0] // 0 is the best answer (Never)
    },
    {
        question: "How often do you use disposable products?",
        options: ["Daily", "A few times a week", "Rarely", "Never"],
        scores: [3, 2, 1, 0] // 0 is the best answer (Never)
    },
    {
        question: "Do you compost at home?",
        options: ["Yes", "No"],
        scores: [0, 3] // 0 is the best answer (Yes)
    }
];

let currentQuestionIndex = 0;
let totalScore = 0;
const maxPossibleScore = questions.length * 3; // Maximum score (3 points for each question)
let userAnswers = []; // Store user's answers

// Game variables
let gameScore = 0;
let pointsPerSecond = 0;
let upgrades = {
    recyclingCenter: { cost: 10, points: 1, owned: 0 },
    solarPanel: { cost: 20, points: 2, owned: 0 },
    windTurbine: { cost: 50, points: 5, owned: 0 },
    greenBuilding: { cost: 100, points: 10, owned: 0 },
    electricVehicle: { cost: 200, points: 20, owned: 0 },
    waterPurification: { cost: 500, points: 50, owned: 0 }
};

// Function to show the quiz section
function showQuiz() {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    displayQuestion();
}

// Function to show the game section
function showGame() {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("game").style.display = "block";
    gameScore = 0; // Reset score
    pointsPerSecond = 0; // Reset points per second
    document.getElementById("score").innerText = "Your Score: " + gameScore;
    document.getElementById("restartGameButton").style.display = "none";
    setupUpgrades();
    startCollectingPoints();
}

// Function to show the next question
function nextQuestion() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        userAnswers.push(parseInt(selectedOption.value));
        totalScore += questions[currentQuestionIndex].scores[parseInt(selectedOption.value)];
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        displayResults();
    }
}

// Function to display the current question
function displayQuestion() {
    const questionContainer = document.getElementById("questionContainer");
    questionContainer.innerHTML = `
        <p>${questions[currentQuestionIndex].question}</p>
        ${questions[currentQuestionIndex].options.map((option, index) => `
            <input type="radio" id="option${index}" name="option" value="${index}">
            <label for="option${index}">${option}</label><br>
        `).join('')}
    `;

    const nextButton = document.getElementById("nextButton");
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.innerText = "Submit Quiz";
    } else {
        nextButton.innerText = "Next Question";
    }

    nextButton.style.display = "block";
}

// Function to display the quiz results
function displayResults() {
    const quizResult = document.getElementById("quizResult");
    const tipsContainer = document.getElementById("tipsContainer");
    const socialSharing = document.getElementById("socialSharing");

    const percentage = 100 - (totalScore / maxPossibleScore) * 100;

    let resultMessage = "";
    if (totalScore >= 16) {
        resultMessage = "Your carbon footprint is high. Consider making some changes!";
    } else if (totalScore >= 11) {
        resultMessage = "You're doing okay, but there's room for improvement.";
    } else if (totalScore >= 6) {
        resultMessage = "Great job! Your carbon footprint is low!";
    } else {
        resultMessage = "Fantastic! Your carbon footprint is very low!";
    }

    tipsContainer.innerHTML = "<h3>Summary:</h3>";
    tipsContainer.innerHTML += `<p>${resultMessage}</p>`;
    tipsContainer.innerHTML += `<p>Your ecological footprint score is: ${percentage.toFixed(2)}%</p>`;

    let tips = [];
    questions.forEach((question, questionIndex) => {
        const selectedAnswer = userAnswers[questionIndex];
        if (question.scores[selectedAnswer] !== 0) {
            switch (questionIndex) {
                case 0:
                    tips.push("Consider reducing animal-based products in your diet.");
                    break;
                case 1:
                    tips.push("Try using public transport or biking more.");
                    break;
                case 2:
                    tips.push("Recycle more of your waste.");
                    break;
                case 3:
                    tips.push("Switch to renewable energy sources if possible.");
                    break;
                case 4:
                    tips.push("Avoid fast fashion; buy less and choose quality.");
                    break;
                case 5:
                    tips.push("Use reusable products instead of disposables.");
                    break;
                case 6:
                    tips.push("Start composting at home to reduce waste.");
                    break;
            }
        }
    });

    tipsContainer.innerHTML += "<h3>Tips to Improve:</h3>";
    tips.forEach(tip => {
        tipsContainer.innerHTML += `<p>${tip}</p>`;
    });

    quizResult.style.display = "block";
    tipsContainer.style.display = "block";
    socialSharing.style.display = "block";
    document.getElementById("restartButton").style.display = "block";
}

// Function to restart the quiz
function restartQuiz() {
    totalScore = 0;
    currentQuestionIndex = 0;
    userAnswers = []; // Reset the user's answers
    document.getElementById("quizResult").style.display = "none";
    document.getElementById("tipsContainer").style.display = "none";
    document.getElementById("socialSharing").style.display = "none"; // Hide social sharing
    document.getElementById("restartButton").style.display = "none";
    displayQuestion();
}

// Function to collect carbon points in the game
function collectPoints() {
    gameScore++;
    document.getElementById("score").innerText = "Your Score: " + gameScore;
}

// Function to start collecting points automatically
function startCollectingPoints() {
    setInterval(() => {
        gameScore += pointsPerSecond;
        document.getElementById("score").innerText = "Your Score: " + gameScore;
    }, 1000); // Collect points every second
}

// Function to setup upgrades
function setupUpgrades() {
    const upgradeList = document.getElementById("upgradeList");
    upgradeList.innerHTML = ""; // Clear previous upgrades

    Object.keys(upgrades).forEach((key) => {
        const upgrade = upgrades[key];
        const upgradeDiv = document.createElement("div");
        upgradeDiv.innerHTML = `
            <p>${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} (Cost: ${upgrade.cost} points): 
            Owned: <span id="${key}Count">0</span>
            <button onclick="buyUpgrade('${key}')">Buy</button></p>
        `;
        upgradeList.appendChild(upgradeDiv);
    });
}

// Function to buy upgrades
function buyUpgrade(upgradeKey) {
    const upgrade = upgrades[upgradeKey];
    if (gameScore >= upgrade.cost) {
        gameScore -= upgrade.cost; // Deduct the cost from the score
        upgrade.owned += 1; // Increase the number of owned upgrades
        pointsPerSecond += upgrade.points; // Increase points per second
        document.getElementById(upgradeKey + "Count").innerText = upgrade.owned; // Update owned count
        document.getElementById("score").innerText = "Your Score: " + gameScore; // Update displayed score
    } else {
        alert("Not enough points to buy this upgrade!");
    }
}

// Function to restart the game
function restartGame() {
    gameScore = 0; // Reset score
    pointsPerSecond = 0; // Reset points per second
    Object.keys(upgrades).forEach(key => {
        upgrades[key].owned = 0; // Reset all upgrades
    });
    setupUpgrades(); // Refresh upgrade display
    document.getElementById("score").innerText = "Your Score: " + gameScore;
    document.getElementById("restartGameButton").style.display = "none"; // Hide restart button
    document.getElementById("gameInstructions").innerText = "Collect as many carbon points as you can by clicking the button below!";
}
