// script.js
// Handles "page" switching and prepares for later question logic

document.addEventListener("DOMContentLoaded", () => {
    // Grab the important sections
    const landingSection = document.getElementById("landing");
    const trainerSection = document.getElementById("trainer");

    // Buttons / clickable items
    const startBtn = document.getElementById("start-session");
    const homeLink = document.getElementById("home-link");

    // This will later hold our questions (we'll expand this)
    const questions = [
        {
            topic: "Reading · Inference - test change",
            text: "The author includes the detail about the neighbor mainly to show what?",
        },
        {
            topic: "Writing · Transitions",
            text: "Choose a transition that best connects two contrasting ideas in a paragraph.",
        },
        {
            topic: "Math · Linear equations",
            text: "A line passes through (2, 5) and (6, 17). How do you find its slope?",
        },
    ];

    // Elements inside the trainer page
    const questionText = document.getElementById("card-question-text");
    const topicChip = document.getElementById("topic-chip");
    const questionCounter = document.getElementById("question-counter");
    const answerInput = document.getElementById("card-answer-input");
    const nextBtn = document.getElementById("next-question");

    let currentIndex = 0;

    // Switch from landing → trainer
    startBtn.addEventListener("click", () => {
        landingSection.classList.add("hidden");
        trainerSection.classList.remove("hidden");

        // Load first question
        currentIndex = 0;
        loadQuestion();
    });

    // Click logo → go back to home
    homeLink.addEventListener("click", () => {
        trainerSection.classList.add("hidden");
        landingSection.classList.remove("hidden");
    });

    // Load a question onto the card
    function loadQuestion() {
        const q = questions[currentIndex];
        questionText.textContent = q.text;
        topicChip.textContent = `Topic: ${q.topic}`;
        questionCounter.textContent = `Question ${currentIndex + 1} / ${questions.length}`;
        answerInput.value = "";
    }

    // Go to next question
    nextBtn.addEventListener("click", () => {
        if (currentIndex < questions.length - 1) {
            currentIndex++;
            loadQuestion();
        } else {
            // session finished state
            questionText.textContent =
                "Great work! We'll soon generate an adaptive follow-up based on your responses.";
            topicChip.textContent = "Session complete";
            questionCounter.textContent = "";
            answerInput.disabled = true;
            nextBtn.disabled = true;
            nextBtn.textContent = "Done";
        }
    });
});
