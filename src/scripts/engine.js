const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-img"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player1 : 'player-cards',
    player1BOX: document.querySelector('#player-cards'),
    computer: 'computer-cards',
    computerBOX: document.querySelector('#computer-cards')

},
  actions: {
    button: document.getElementById("next-duel"),
  },
};


const pathImages = './src/assets/icons/'
const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type:"Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2]
    },
    {
        id:1,
        name: "Dark Margician",
        type:"Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0]
    },
    {
        id:2,
        name: "Exodia",
        type:"Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1]
    }
];

async function getRandoCardId() {
  const randomIndex = Math.floor(Math.random() *cardData.length);
  return cardData[randomIndex].id;
}
async function creatCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement('img');
  cardImage.setAttribute('height', '100px');
  cardImage.setAttribute('src', './src/assets/icons/card-back.png');
  cardImage.setAttribute('data-id', IdCard);
  cardImage.classList.add('card');

  if (fieldSide === state.playerSides.player1){

    cardImage.addEventListener('mouseover', ()=> {
    drawSelectCard(IdCard);
  })

    cardImage.addEventListener('click', () =>{
      setCardsField(cardImage.getAttribute('data-id'));
    })

    
  }
  
  
  return cardImage;
}


async function setCardsField(CardId) {

  await removeAllCardsImages();

  let computerCardId = await getRandoCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  
  state.fieldCards.player.src =cardData[CardId].img;
  state.fieldCards.computer.src =cardData[computerCardId].img;

  let duelResults = await checkDuelResults(CardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);

}
async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text) {
  state.actions.button.innerText = text.toUpperCase()
;
  state.actions.button.style.display = "block";
  
}
async function checkDuelResults(playerCardId, computerCardId) { 
  let duelResults = 'Empate';
  let playerCard = cardData[playerCardId];

  if(playerCard.winOf.includes(computerCardId)){
    duelResults = "win";
    state.score.playerScore++;
  }  
  if (playerCard.loseOf.includes(computerCardId)){
    duelResults = "lose";
    state.score.computerScore++;
  }
  await playAudio(duelResults);

  return duelResults;
}
async function removeAllCardsImages() {
  let { computerBOX, player1BOX } = state.playerSides
  let imgElements = computerBOX.querySelectorAll('img');
  imgElements.forEach((img) => img.remove());

  
  imgElements = player1BOX.querySelectorAll('img');
  imgElements.forEach((img) => img.remove());
  
}



async function drawSelectCard(index){
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attibute : " + cardData[index].type;
}

async function  drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandoCardId();
        const cardImage = await creatCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
        
    }
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  try{
    audio.play();
  }catch{
    
  }
  
}

function init() {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);


    
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = 'none';

  state.fieldCards.player.style.display = 'none'
  state.fieldCards.computer.style.display = 'none'

  init();

}

init();
