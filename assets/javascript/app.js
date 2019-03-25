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
        "html": "<p>Time left: <span id = \"down-count\"></span></p>"
    }),
    $questionDiv: $("<div>"),
    $endDiv: $("<div>", {
        "html": "<h3>Game over</h3>"
            + "<p>Right answers: <span id=\"good-a\"></span></p>"
            + "<p>Wrong answers: <span id=\"bad-a\"></span></p>"
            + "<p>No answers: <span id=\"timed-out\"></span></p>",
    }),
    $start: $("#start-button"),

    anA: "",
    answeredRight: 0,
    answeredWrong: 0,
    brainFroze: 0,
    gameIterator: 0,
    qTimer: null,

    Init() {
        this.anA = "";
        this.answeredRight = 0;
        this.answeredWrong = 0;
        this.brainFroze = 0;
        this.gameIterator = 0;

        // Randomize question order
        this.Shuffle(this.smartyPants);

        this.$start.detach();
        this.$gameDiv.empty();
        this.PlayGame();
    },

    PlayGame() {
        this.$gameDiv.html(this.$timerDiv);
        this.$gameDiv.append(this.$questionDiv);

        this.ShowQuestion(this.smartyPants[this.gameIterator]);
    },

    ShowQuestion(item) {
        var countDown = 30;

        var theQuestion = $("<p>");
        theQuestion.text(item.question);
        this.$questionDiv.html(theQuestion);

        $("#down-count").text(countDown);
        this.gameIterator++;
        // console.log(this.gameIterator);
        // console.log(this.smartyPants.length);

        // Randomize answer order
        this.Shuffle(item.answers);

        for (i = 0; i < item.answers.length; i++) {
            var pgrph = $("<p>");
            var anAnswer = $("<a href=\"#\">");
            anAnswer.attr("id", i);
            anAnswer.addClass("answer");
            anAnswer.html(item.answers[i].answerString);
            pgrph.append(anAnswer);
            if (item.answers[i].val) {
                this.anA = i;
                // console.log(this.anA);
            }
            triviaGame.$questionDiv.append(pgrph);
        }

        $(".answer").click(function () { triviaGame.HandleClick($(this).attr("id")) });
        this.qTimer = setInterval(TimerDisplay, 1000);

        function TimerDisplay() {
            countDown--;
            $("#down-count").text(countDown);
            if (countDown === 0) {
                clearInterval(triviaGame.qTimer);
                triviaGame.ShowAfter("timeout");
            }
        }
    },

    // Found this on stack overflow.  Seems to work well.
    Shuffle(theArray) {
        for (i = theArray.length-1; i > 0; i--) {   // i counts down from the end of the array
            var j = Math.floor(Math.random()*(i+1));    // j is a random number between 0 and the current value of i
            var temp = theArray[i];     // store the value at [i] in a temp variable
            theArray[i] = theArray[j];  // put the value at [j] (our random number) into [i]
            theArray[j] = temp;         // put the value in temp (originally at [i]) into [j]
        }
    },

    ShowAfter(reason) {
        var timeout = 3000;
        this.$gameDiv.empty();
        switch (reason) {
            case "timeout":
                this.$gameDiv.html("<h3>Out of time!</h3>");
                this.brainFroze++;
                break;
            case "wrong":
                this.$gameDiv.html("<h3>Wrong!</h3>");
                this.answeredWrong++;
                break;
            case "right":
                this.$gameDiv.html("<h3>Correct!</h3>");
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
        $("#good-a").html(this.answeredRight);
        $("#bad-a").text(this.answeredWrong);
        $("#timed-out").text(this.brainFroze);
        this.$start.text("Go Again!");
        this.$endDiv.append(this.$start);
    },

    HandleClick(clickedOn) {
        clearInterval(this.qTimer);
        if (parseInt(clickedOn) === this.anA) {
            this.ShowAfter("right");
        }
        else {
            this.ShowAfter("wrong");
        }
    },
}