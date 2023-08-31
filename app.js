const topLeft     = document.querySelector(".simon-top-left");
const topRight    = document.querySelector(".simon-top-right");
const bottomLeft  = document.querySelector(".simon-bottom-left");
const bottomRight = document.querySelector(".simon-bottom-right");
const totalScore  = document.getElementById('score');
const simonCenter = document.getElementById('simonCenter');
const level       = document.getElementById('level')

const sideArray = [topLeft, topRight, bottomLeft, bottomRight];

let sequence  = [], 
    seqLength = 0,
    idx       = 0,
    canClick  = false,
    gameOn    = false;

document.getElementById("endGame").style.display = "none";

const reset = () => {
  seqLength = 0;
  totalScore.innerHTML = 0;
  level.innerHTML = 1;
  simonCenter.innerHTML = "";
}

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
  reset();
  document.getElementById("startGame").style.display = "none";
  document.getElementById("endGame").style.display = "inline";
  simonCenter.innerHTML = "Watch!"
  gameOn = true;

  setTimeout(() => {
    startFlashing();
  }, 1000)
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
  if(!gameOn) return;

  getRandomSeq();
  for(let side of sequence) {
    await sideFlash(side);
  }

  enableClick();
  simonCenter.innerHTML = "Repeat!"
}

const onSideClick = async (sideIndex) => {
  if(!canClick) {
    return;
  }
  
  await sideFlash(sideIndex);
  if(sideIndex == sequence[idx]) {
    idx++;
    if(idx == sequence.length) {
      totalScore.innerHTML = parseInt(totalScore.innerHTML) + 1;
      level.innerHTML = parseInt(level.innerHTML) + 1;
      disableClick();
      simonCenter.innerHTML = "Watch!"

      setTimeout(() => {
        startFlashing();
      }, 1000)
    }
  } else {
    alert(`GAME OVER! YOU SCORED ${totalScore.innerHTML} POINTS.`);
    end();
  }
}

const endGame = () => {
  if(confirm('Are you sure you want to end this game?') == true) end();
}

const end = () => {
  gameOn = false;
  document.getElementById("startGame").style.display = "inline";
  document.getElementById("endGame").style.display = "none";
  reset();
  disableClick();
  level.innerHTML = '--';
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