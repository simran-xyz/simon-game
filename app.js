const topLeft     = document.querySelector(".simon-top-left");
const topRight    = document.querySelector(".simon-top-right");
const bottomLeft  = document.querySelector(".simon-bottom-left");
const bottomRight = document.querySelector(".simon-bottom-right");
const totalScore  = document.getElementById('score');
const simonCenter = document.getElementById('simonCenter');

document.getElementById("endGame").style.display = "none"

const sideArray = [topLeft, topRight, bottomLeft, bottomRight]

let sequence  = [], 
    seqLength = 0,
    idx       = 0,  
    on        = false, 
    canClick  = false, 
    score     = 0, 
    bestScore = null;


const playAudio = (src) => {
  return new Promise((resolve) => {
    const audio = new Audio(src);
    audio.play();
    audio.onended = resolve;
  });
};


const sideFlash = async (side) => {
  sideArray[side-1].className += ' flash';
  await playAudio(`./audios/simonSound${side}.mp3`)
  return new Promise(resolve => {
    setTimeout(() => {
      sideArray[side-1].className = sideArray[side-1].className.replace(" flash", "");
      resolve();
    }, 100)
  })
}

const start = () => { 
  document.getElementById("startGame").style.display = "none";
  document.getElementById("endGame").style.display = "inline";
  score = 0;
  seqLength = 0;
  simonCenter.innerHTML = "Watch!"
  startFlashing();
}

const getRandomSeq = () => {
  idx = 0;
  sequence = [];

  seqLength++;
  for(let i=0;i<seqLength;i++) {
    sequence.push(Math.floor(Math.random()*4) + 1);
  }
}

const startFlashing = async () => {
  getRandomSeq();
  
  for(let side of sequence) {
    await sideFlash(side);
  }
  canClick = true;
  enableClick();
  simonCenter.innerHTML = "Repeat!"
}

const onSideClick = async (sideIndex) => {
  if(!canClick) {
    return;
  }
  
  await sideFlash(sideIndex)
  if(sideIndex == sequence[idx]) {
    idx++;
    if(idx == sequence.length) {
      score++;
      totalScore.innerHTML = score;
      canClick = false;
      disableClick();
      simonCenter.innerHTML = "Watch!"
      setTimeout(() => {
        startFlashing();
      }, 1000)
    }
  } else {
    alert(`GAME OVER! YOU SCORED ${score} POINTS.`);
    end();
  }
}

const endGame = () => {
  if(confirm('Are you sure you want to end this game?') == true) end();
}

const end = () => {
  document.getElementById("startGame").style.display = "inline";
  document.getElementById("endGame").style.display = "none";
  totalScore.innerHTML = 0;
  simonCenter.innerHTML = "";
  disableClick();
}

const enableClick = () => {
  for(let side of sideArray) {
    side.className += ' active';
  }
  canClick = true;
}

const disableClick = () => {
  for(let side of sideArray) {
    side.className = side.className.replace(' active', '');
  }
  canClick = false;
}