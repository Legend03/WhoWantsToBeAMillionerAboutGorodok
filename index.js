let arrayQuestions;
let responseData;
let textQuestion;
let textButtonAnswerOptions;
let markTree;
let answerButton;
const maxCountQuestionsInTheGame = 10;
let count = 0;
let sound = new Audio();

//Получение данных из JSON-файла
const requestData = async () => {
  try {
    const response = await fetch(
      "https://api.jsonbin.io/v3/b/6372c37d65b57a31e6b7a7e2",
      {
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": `$2b$10$K8rHnU.Ps4KmWiCofzhTIuVz4rX8qKat.4hmFN3mxfK8dQbXCyiJa`,
          "X-Bin-Meta": false,
        },
      }
    );
    responseData = await response.json();
  } catch (error) {
    console.log(error);
  }
};
requestData();

//Запуск игры по нажатию на кнопку "Играть"
function startGame() {
  let sound = new Audio();
  sound.preload = "metadata";
  sound.src = "./Sounds/startGame.mp3";
  sound.play();
  GoToPlay();
}

//
function GoToPlay() {
  count = 0;
  let body = document.querySelector("body");
  body.innerHTML = `
        <div class="preloader">
            <div class="preloader__row">
                <div class="preloader__item"></div>
                <div class="preloader__item"></div>
            </div>
        </div>`;
  setTimeout(() => {
    body.style = `-webkit-animation-duration: 5s;
                        animation-duration: 5s;
                        -webkit-animation-fill-mode: both;
                        animation-fill-mode: both;
                        -webkit-animation-name: fadeIn;
                        animation-name: fadeIn;`;
    window.onload = function () {
      document.body.classList.add("loaded_hiding");
      window.setTimeout(function () {
        document.body.classList.add("loaded");
        document.body.classList.remove("loaded_hiding");
      }, 500);
    };

    body.innerHTML = `
            <div class="main">

            <div id="bonusIcon">
                <img onclick="fiftyOnFifty(this)">
                <img onclick="adviceSpectators(this)">
                <img onclick="callToFriend(this)">
            </div>
            
            <div id="mainIcon">
                <img>
            </div>

            <div id="markTree">

                <table>
                    <th>
                        Оценка
                    </th>
                    <tr>
                        <td>10</td>
                    </tr>
                    <tr>
                        <td>9</td>
                    </tr>
                    <tr>
                        <td>8</td>
                    </tr>
                    <tr>
                        <td>7</td>
                    </tr>
                    <tr>
                        <td>6</td>
                    </tr>
                    <tr>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>4</td>
                    </tr>
                    <tr>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>1</td>
                    </tr>
                </table>

                <div id="takeMoney">
                    <button onclick="takeMoney()">
                        Забрать
                    </button>
                </div>

            </div>
        </div>
        
        <div id="question">
            
        </div>

        <div class="wrapper">
            <button onclick="giveAnswer(this)"><p>A: <span id="answerOption"></span></p></button>
            <button onclick="giveAnswer(this)"><p>B: <span id="answerOption"></span></p></button>
            <button onclick="giveAnswer(this)"><p>C: <span id="answerOption"></span></p></button>
            <button onclick="giveAnswer(this)"><p>D: <span id="answerOption"></span></p></button>
        </div>

        <div id="adviceSpectators" class="modal">
            
            <div class="modal-content-chart" >           
                    
                <span class="close">&times;</span> 
                <div id="chart">
                    <div>A</div>
                    <div>B</div>
                    <div>C</div>
                    <div>D</div>
                </div>
                
            </div>

        </div>

        <div id="callToFriend" class="modal">
            
            <div class="modal-content" >           
                <p class="answer"></p>
                <span class="close">&times;</span>
            </div>

        </div>
        
        <div id="finishGame" class="modal">
            
            <div class="modal-content">               
                <p class="message"></p>
                <button onclick="GoToPlay()">Заново</button>
                <button onclick="cancel()">Отмена</button>
            </div>

        </div>`;
    let bonusesImg = document.querySelectorAll("#bonusIcon img");
    let logoImg = document.querySelector("#mainIcon img");
    answerButton = document.querySelectorAll(".wrapper button");
    textQuestion = document.querySelector("#question");
    textButtonAnswerOptions = document.querySelectorAll("#answerOption");
    markTree = document.querySelectorAll("td");
    arrayQuestions = GetIndexesQuestions();

    // Вставка картинок на страницу
    logoImg.src = responseData.images.logo;
    for (let i = 0; i < bonusesImg.length; i++) {
      bonusesImg[i].src = responseData.images.bonuses[i];
    }

    //Вставка текста вопроса и вариантов ответа
    textQuestion.textContent = responseData.question.easy[arrayQuestions[0]];
    let temp = 0;
    for (let button of textButtonAnswerOptions) {
      button.textContent = responseData.answerOptions.easy[arrayQuestions[0]][temp];
      temp++;
    }
  }, 3000);
  setTimeout(() => {
    sound.pause();
    sound = new Audio();
    sound.src = "./Sounds/forThinking.mp3";
    sound.play();
  }, 4000);
}

function giveAnswer(button) {
  sound.pause();
  sound = new Audio();
  sound.src = "./Sounds/waitAnswer.mp3";
  sound.play();
  for (let but of answerButton) {
    but.disabled = true;
  }
  button.style.animation = "blink 1s linear 2";
  console.log(IsTrueAnswer(button));
  if (IsTrueAnswer(button)) {
    setTimeout(() => {
      sound.pause();
      sound = new Audio();
      sound.src = "./Sounds/trueAnswer.mp3";
      sound.play();
      button.style.animation = "staticGreen 1s linear 1";
      button.style.background = "green";
    }, 2000);
    setTimeout(() => {
      for (let but of answerButton) {
        but.disabled = false;
        but.hidden = false;
        but.style.background = "#2F73B6";
      }
      if (count !== 0)
        markTree[markTree.length - count].style.background = "";
      count++;
      markTree[markTree.length - count].style.background = "green";
      if (count !== maxCountQuestionsInTheGame) nextQuestion();
      else {
        markTree[markTree.length - count].style.animation =
          "staticGreen 1s linear infinite";
        sound.pause();
        sound = new Audio();
        sound.src = "./Sounds/finishGame.mp3";
        sound.play();
        setTimeout(() => {
          finishGame();
        }, 3000);
      }
    }, 5000);
  } else {
    setTimeout(() => {
      sound.pause();
      sound = new Audio();
      sound.src = "./Sounds/falseAnswer.mp3";
      sound.play();
      button.style.animation = "staticRed 1s linear 1";
      button.style.background = "red";
      for (let but of answerButton) {
        if (IsTrueAnswer(but)) {
          but.style.animation = "staticGreen 1s linear 1";
          but.style.background = "green";
        }
      }
      let takeMoney = document.querySelector("#takeMoney button");
      takeMoney.disabled = true;
      if (count !== 0)
        markTree[markTree.length - count].style.animation =
          "staticRed 1s linear infinite";
      setTimeout(() => {
        loseGame();
      }, 3000);
    }, 2000);
  }
}

function IsTrueAnswer(button) {
  if (count < 4){
    if (
      button.textContent.slice(3) ===
      responseData.rightAnswer.easy[arrayQuestions[count]]
    )
      return true;
    else return false;
  }
  else if (count < 6){
    if (
      button.textContent.slice(3) ===
      responseData.rightAnswer.normal[arrayQuestions[count]]
    )
      return true;
    else return false;
  }
  else if (count < 8){
    if (
      button.textContent.slice(3) ===
      responseData.rightAnswer.medium[arrayQuestions[count]]
    )
      return true;
    else return false;
  }
  else if (count < 10){
    if (
      button.textContent.slice(3) ===
      responseData.rightAnswer.hard[arrayQuestions[count]]
    )
      return true;
    else return false;
  }
}

function nextQuestion() {
  sound.pause();
  sound = new Audio();
  sound.src = "./Sounds/forThinking.mp3";
  sound.play();

  if (count < 4){
    textQuestion.textContent = responseData.question.easy[arrayQuestions[count]];
    let temp = 0;
    for (let button of textButtonAnswerOptions) {
      button.textContent = responseData.answerOptions.easy[arrayQuestions[count]][temp];
      temp++;
    }
  }
  else if (count < 6){
    textQuestion.textContent = responseData.question.normal[arrayQuestions[count]];
    let temp = 0;
    for (let button of textButtonAnswerOptions) {
      button.textContent = responseData.answerOptions.normal[arrayQuestions[count]][temp];
      temp++;
    }
  }
  else if (count < 8){
    textQuestion.textContent = responseData.question.medium[arrayQuestions[count]];
    let temp = 0;
    for (let button of textButtonAnswerOptions) {
      button.textContent = responseData.answerOptions.medium[arrayQuestions[count]][temp];
      temp++;
    }
  }
  else if (count < 10){
    textQuestion.textContent = responseData.question.hard[arrayQuestions[count]];
    let temp = 0;
    for (let button of textButtonAnswerOptions) {
      button.textContent = responseData.answerOptions.hard[arrayQuestions[count]][temp];
      temp++;
    }
  }
  
}

function GetIndexesQuestions() {
  let arrayOfIndexes = [];
  let easyQuestion = responseData.question.easy;
  let normalQuestion = responseData.question.normal;
  let mediumQuestion = responseData.question.medium;
  let hardQuestion = responseData.question.hard;
  let temp = new Set();

  while(temp.size < 4){
    temp.add(Math.floor(Math.random() * easyQuestion.length));
  }
  temp.forEach(element => {
    arrayOfIndexes.push(element);    
  });
  temp.clear();

  while(temp.size < 2){
    temp.add(Math.floor(Math.random() * normalQuestion.length));
  }
  temp.forEach(element => {
    arrayOfIndexes.push(element);    
  });
  temp.clear();

  while(temp.size < 2){
    temp.add(Math.floor(Math.random() * mediumQuestion.length));
  }
  temp.forEach(element => {
    arrayOfIndexes.push(element);    
  });
  temp.clear();

  while(temp.size < 2){
    temp.add(Math.floor(Math.random() * hardQuestion.length));
  }
  temp.forEach(element => {
    arrayOfIndexes.push(element);    
  });
  temp.clear();

  console.log(arrayOfIndexes);
  return arrayOfIndexes;
}

function fiftyOnFifty(bonus) {
  let IndexNotTrueButton = [];
  for (let i = 0; i < answerButton.length; i++) {
    if (!IsTrueAnswer(answerButton[i])) {
      IndexNotTrueButton.push(i);
    }
  }
  shuffle(IndexNotTrueButton);
  answerButton[IndexNotTrueButton[0]].hidden = true;
  answerButton[IndexNotTrueButton[1]].hidden = true;
  bonus.onclick = "";
  bonus.style.opacity = ".5";
}

function adviceSpectators(bonus) {
  let columns = document.querySelectorAll("#chart div");
  let modal = document.getElementById("adviceSpectators");
  let span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  };
  modal.style.display = "block";

  let IndexTrueButton;
  for (let i = 0; i < answerButton.length; i++) {
    if (IsTrueAnswer(answerButton[i])) {
      IndexTrueButton = i;
      break;
    }
  }

  if (IndexTrueButton === 0) {
    if (!answerButton[0].hidden) columns[0].style.height = "80%";
    else {
      columns[0].style.height = "0%";
      columns[0].textContent = "";
    }
    if (!answerButton[1].hidden) columns[1].style.height = "20%";
    else {
      columns[1].style.height = "0%";
      columns[1].textContent = "";
    }
    if (!answerButton[2].hidden) columns[2].style.height = "60%";
    else {
      columns[2].style.height = "0%";
      columns[2].textContent = "";
    }
    if (!answerButton[3].hidden) columns[3].style.height = "40%";
    else {
      columns[3].style.height = "0%";
      columns[3].textContent = "";
    }
  } else if (IndexTrueButton === 1) {
    if (!answerButton[0].hidden) columns[0].style.height = "20%";
    else {
      columns[0].style.height = "0%";
      columns[0].textContent = "";
    }
    if (!answerButton[1].hidden) columns[1].style.height = "80%";
    else {
      columns[1].style.height = "0%";
      columns[1].textContent = "";
    }
    if (!answerButton[2].hidden) columns[2].style.height = "60%";
    else {
      columns[2].style.height = "0%";
      columns[2].textContent = "";
    }
    if (!answerButton[3].hidden) columns[3].style.height = "40%";
    else {
      columns[3].style.height = "0%";
      columns[3].textContent = "";
    }
  } else if (IndexTrueButton === 2) {
    if (!answerButton[0].hidden) columns[0].style.height = "60%";
    else {
      columns[0].style.height = "0%";
      columns[0].textContent = "";
    }
    if (!answerButton[1].hidden) columns[1].style.height = "40%";
    else {
      columns[1].style.height = "0%";
      columns[1].textContent = "";
    }
    if (!answerButton[2].hidden) columns[2].style.height = "80%";
    else {
      columns[2].style.height = "0%";
      columns[2].textContent = "";
    }
    if (!answerButton[3].hidden) columns[3].style.height = "20%";
    else {
      columns[3].style.height = "0%";
      columns[3].textContent = "";
    }
  } else if (IndexTrueButton === 3) {
    if (!answerButton[0].hidden) columns[0].style.height = "20%";
    else {
      columns[0].style.height = "0%";
      columns[0].textContent = "";
    }
    if (!answerButton[1].hidden) columns[1].style.height = "60%";
    else {
      columns[1].style.height = "0%";
      columns[1].textContent = "";
    }
    if (!answerButton[2].hidden) columns[2].style.height = "20%";
    else {
      columns[2].style.height = "0%";
      columns[2].textContent = "";
    }
    if (!answerButton[3].hidden) columns[3].style.height = "80%";
    else {
      columns[3].style.height = "0%";
      columns[3].textContent = "";
    }
  }

  bonus.onclick = "";
  bonus.style.opacity = ".5";
}

function callToFriend(bonus) {
  let modal = document.getElementById("callToFriend");
  let span = document.getElementsByClassName("close")[1];
  let answer = document.querySelector(".answer");
  span.onclick = function () {
    modal.style.display = "none";
  };
  modal.style.display = "block";

  let IndexTrueButton;
  let IndexFalseButton;
  for (let i = 0; i < answerButton.length; i++) {
    if (IsTrueAnswer(answerButton[i])) {
      IndexTrueButton = i;
    }
    else{
      IndexFalseButton = i;
    }
  }

  if(Math.floor(Math.random() * 5) < 1){
    answer.textContent =
    "Друг думает, что ответ: " +
    answerButton[IndexFalseButton].textContent.slice(0, 1);
    bonus.onclick = "";
    bonus.style.opacity = ".5";
  }
  else{
    answer.textContent =
    "Друг думает, что ответ: " +
    answerButton[IndexTrueButton].textContent.slice(0, 1);
    bonus.onclick = "";
    bonus.style.opacity = ".5";
  }
  
}

function takeMoney() {
  if (count !== 0) {
    finishGame();
  } else alert("Вы ещё не ответили ни на один вопрос!");
}

function finishGame(){
  if(count !== maxCountQuestionsInTheGame) {
    sound.pause();
    sound = new Audio();
    sound.src = "./Sounds/finishGame.mp3";
    sound.play();
  }

  for (let but of answerButton) {
    but.disabled = true;
  }
  let bonusButton = document.querySelectorAll("#bonusIcon img");
  for (let but of bonusButton) {
    but.onclick = "";
  }
  
  let modal = document.getElementById("finishGame");
  let text = document.querySelector(".message");
  modal.style.display = "block";
  
  if(count === maxCountQuestionsInTheGame)
    text.textContent = "Поздравляем! Вы прошли тест на отлично!!!\nХотите сыграть ещё?";
  else{
    text.textContent = "Поздравяем, вы заработали " + count + " балл(ов)!\nХотите сыграть ещё?";
  }
}

function loseGame(){
  for (let but of answerButton) {
    but.disabled = true;
  }
  let bonusButton = document.querySelectorAll("#bonusIcon img");
  for (let but of bonusButton) {
    but.onclick = "";
  }

  let modal = document.getElementById("finishGame");
  let text = document.querySelector(".message");
  let buttons = document.querySelectorAll(".modal-content button");  
  buttons[0].textContent = "Да"
  buttons[1].textContent = "Нет"
  modal.style.display = "block";
  
  text.textContent = "Вы проиграли, игра окончена...\nХотите сыграть ещё?)";
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function cancel(){
  let modal = document.getElementById("finishGame");
  modal.style.display = 'none';
}