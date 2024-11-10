let dino = document.getElementById('dino');
let obstacle = document.getElementById('obstacle');
let jumpBtn = document.getElementById('jumpBtn');
let startBtn = document.getElementById('startBtn');
let restartBtn = document.getElementById('restartBtn');
let scoreDisplay = document.getElementById('score');
let isJumping = false;
let isGameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Sons pré-carregados
const jumpSound = new Audio('sounds/jump.mp3');
jumpSound.volume = 0.5;

const collisionSound = new Audio('sounds/collission.mp3');
collisionSound.volume = 0.7;

// Música de fundo
const backgroundMusic = new Audio('sounds/background.mp3');
backgroundMusic.volume = 0.4;
backgroundMusic.loop = true;

function playSound(type) {
  if (type === 'jump') {
    jumpSound.currentTime = 0;
    jumpSound.play();
  } else if (type === 'collision') {
    collisionSound.currentTime = 0;
    collisionSound.play();
  }
}

function startGame() {
  document.getElementById('gameTitle').style.display = 'none';
  score = 0;
  isGameOver = false;
  startBtn.style.display = 'none';
  jumpBtn.style.display = 'inline-block';
  restartBtn.style.display = 'none';
  obstacle.style.animation = 'moveObstacle 2s linear infinite';
  scoreDisplay.textContent = `Score: ${score} | Recorde: ${highScore}`;
  // Ajusta a duração da animação do obstáculo com base na duração do pulo
  const duracaoPulo = 0.5; // Ajuste este valor para corresponder à sua animação de pulo
  const velocidadeObstaculo = 1.5 - duracaoPulo; // Ajuste este valor para a dificuldade desejada

  obstacle.style.animation = `moveObstacle ${velocidadeObstaculo}s linear infinite`;
  
   // Inicia a música de fundo
   backgroundMusic.currentTime = 0; // Reinicia a música do começo
   backgroundMusic.play();
 
   // Inicia a verificação de colisão
   requestAnimationFrame(checkCollision);
 
}


function jump() {
  if (!isJumping) {
    isJumping = true;
    dino.classList.add('jump');
    playSound('jump');

    // Verifica se o pulo foi bem-sucedido após a animação de pulo
    setTimeout(() => {
      dino.classList.remove('jump');
      isJumping = false;

      // Só conta o pulo como "bem-sucedido" se não houver colisão
      if (!isGameOver) {
        score++;
        scoreDisplay.textContent = `Score: ${score} | Recorde: ${highScore}`;
      }
    }, 500); // Duração do pulo
  }
}

function checkCollision() {
  if (isGameOver) return;

  const dinoRect = dino.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    dinoRect.right > obstacleRect.left &&
    dinoRect.left < obstacleRect.right &&
    dinoRect.bottom > obstacleRect.top
  ) {
    endGame();
    return;
  }

  requestAnimationFrame(checkCollision);
}

function endGame() {
  isGameOver = true;

  playSound('collision');

  obstacle.style.animation = 'none';
  jumpBtn.style.display = 'none';
  restartBtn.style.display = 'inline-block';

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
}

// Adiciona evento de tecla para pular (Espaço)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isGameOver) {
    jump();
  }
});

// Eventos dos botões de controle
jumpBtn.addEventListener('click', jump);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);


// Verificação constante de colisão a cada 10ms
setInterval(checkCollision, 10);
