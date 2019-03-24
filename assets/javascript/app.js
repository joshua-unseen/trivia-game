/*
    Interface flow:
    Display start button ->
    Display question -> run timer -> choice: right, wrong, timeout ->
    -> Display result -> run timer ->
    -> Display next question (back to start until all questions asked) ->
    -> Display summary with option to restart (no reload)

    game needs an array of questions.
    each question needs an array or object of answers:
    "{answer1: false, answer2: true, ...}"  Say, 4 answers per question.

    if click (true)
        show correct
    if click false
        show wrong
    if timeout
        show timeout
  
    cancel timer on click

    Timers: Question timer - 30 sec? interstitial timer - 10 sec?

    Functions: Click handler, Timeout Handler, Show question,
        Show info after, Show final summary, Init/reset

    Dynamic divs: timer div, question, answers (1 - 4)
*/

var triviaGame = {
    smartyPants: [
        {
            question: "Question 1",
            answers: [
                { answerString: "answer 1", val: true },
                { answerString: "answer 2", val: false },
                { answerString: "answer 3", val: false },
                { answerString: "answer 4", val: false },
            ],
        },
        {
            question: "Question 2",
            answers: [
                { answerString: "answer 1", val: true },
                { answerString: "answer 2", val: false },
                { answerString: "answer 3", val: false },
                { answerString: "answer 4", val: false },
            ],
        },
        {
            question: "Question 3",
            answers: [
                { answerString: "answer 1", val: true },
                { answerString: "answer 2", val: false },
                { answerString: "answer 3", val: false },
                { answerString: "answer 4", val: false },
            ],
        },
    ],

    $gameDiv: $("#game-div"),
    $timerDiv: $("<div>", {
        "id": "timer-div",
        "html": "<p>Time left: <span id = \"down-count\"></span></p>"
    }),
    $questionDiv: $("<div>", { "id": "q-div" }),
    $endDiv: $("<div>", {
        "html": "<h1>Game over</h1>"
            + "<p>Right answers: <span id=\"good-a\"></span></p>"
            + "<p>Wrong answers: <span id=\"bad-a\"></span></p>"
            + "<p>No answers: <span id=\"timed-out\"></span></p>",
    }),
    $start: $("#start-button"),
    // $answerElem: $(".answer"),

    anA: "",
    answeredRight: 0,
    answeredWrong: 0,
    brainFroze: 0,
    gameIterator: 0,

    Init() {
        this.anA = "";
        this.answeredRight = 0;
        this.answeredWrong = 0;
        this.brainFroze = 0;
        this.gameIterator = 0;

        this.$start.detach();
        this.$gameDiv.empty();
        this.PlayGame();
    },
    PlayGame() {
        this.$gameDiv.html(this.$timerDiv);
        this.$gameDiv.append(this.$questionDiv);
        // note: Randomize question order
        this.ShowQuestion(this.smartyPants[this.gameIterator]);
    },
    ShowQuestion(item) {
        var countDown = 5;  //30;

        var theQuestion = triviaGame.$questionDiv.html("<p>");
        theQuestion.text(item.question);

        $("#down-count").text(countDown);
        this.gameIterator++;
        // console.log(this.gameIterator);
        // console.log(this.smartyPants.length);

        // note: Randomize answer order
        for (i = 0; i < item.answers.length; i++) {
            var anAnswer = $("<p>");
            anAnswer.attr("id", i);
            anAnswer.addClass("answers");
            anAnswer.text(item.answers[i].answerString);
            if (item.answers[i].val) {
                this.anA = i;
                // console.log(this.anA);
            }
            triviaGame.$questionDiv.append(anAnswer);
        }

        $(".answers").click(function () { triviaGame.HandleClick($(this).attr("id")) });
        this.qTimer = setInterval(TimerDisplay, 1000);

        // if (this.gameIterator < this.smartyPants.length){
        //     setTimeout(() => {
        //         this.ShowQuestion(this.smartyPants[this.gameIterator]);
        //     }, 30000);
        // }

        function TimerDisplay() {
            countDown--;
            $("#down-count").text(countDown);
            if (countDown === 0) {
                clearInterval(triviaGame.qTimer);
                triviaGame.ShowAfter("timeout");
            }
        }
    },
    ShowAfter(reason) {
        var timeout = 3000;
        this.$gameDiv.empty();
        switch (reason) {
            case "timeout":
                this.$gameDiv.text("Out of time!");
                this.brainFroze++;
                break;
            case "wrong":
                this.$gameDiv.text("Wrong!");
                this.answeredWrong++;
                break;
            case "right":
                this.$gameDiv.text("Correct!");
                this.answeredRight++;
                break;
        }
        if (this.gameIterator < this.smartyPants.length) {
            setTimeout(() => {
                this.PlayGame();
            }, timeout);
        }
        else {
            setTimeout(() => {
                this.ShowSummary();
            }, timeout);
        }
    },
    ShowSummary() {
        this.$gameDiv.html(this.$endDiv);
        $("#good-a").text(this.answeredRight);
        $("#bad-a").text(this.answeredWrong);
        $("#timed-out").text(this.brainFroze);
        this.$gameDiv.append(this.$start);
    },
    HandleClick(clickedOn) {
        clearInterval(this.qTimer);
        if (clickedOn == this.anA) {
            this.ShowAfter("right");
        }
        else {
            this.ShowAfter("wrong");
        }
    },
    HandleTimeout() { },

}