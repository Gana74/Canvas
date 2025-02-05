// Получаем ссылку на canvas и контекст
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Устанавливаем размеры поля
canvas.width = 400; // Ширина игрового поля
canvas.height = 400; // Высота игрового поля
const gridSize = 20; // Размер одной клетки
const rows = canvas.height / gridSize;
const cols = canvas.width / gridSize;

// Инициализация переменных
let snake = [{ x: 10, y: 10 }]; // Начальная позиция змеи
let direction = { x: 0, y: 0 }; // Направление движения
let food = {
  x: Math.floor(Math.random() * cols),
  y: Math.floor(Math.random() * rows),
}; // Позиция еды
let score = 0; // Счет игрока
let gameSpeed = 200; // Увеличили начальную скорость до 200 миллисекунд
let gameStarted = false; // Флаг для начала игры

// Функция для отрисовки сетки
function drawGrid() {
  ctx.strokeStyle = "#333";
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Функция для отрисовки змеи
function drawSnake() {
  ctx.fillStyle = "#0f0"; // Зеленый цвет для змеи
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

// Функция для отрисовки еды
function drawFood() {
  ctx.fillStyle = "#f00"; // Красный цвет для еды
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Функция для обновления состояния игры
function update() {
  if (!gameStarted) return; // Если игра не началась, ничего не обновляем

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Проверка столкновения с границами или самой собой
  if (
    head.x < 0 ||
    head.x >= cols ||
    head.y < 0 ||
    head.y >= rows ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    alert("Игра окончена! Ваш счет: " + score);
    resetGame();
    return;
  }

  // Добавляем новую голову
  snake.unshift(head);

  // Проверяем, съела ли змея еду
  if (head.x === food.x && head.y === food.y) {
    score++;
    gameSpeed = Math.max(50, gameSpeed - 10); // Увеличиваем скорость при поедании еды
    food = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  } else {
    snake.pop(); // Удаляем хвост, если не съели еду
  }
}

// Функция для отрисовки всего игрового поля
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем поле
  drawGrid();
  drawSnake();
  drawFood();
}

// Функция для управления змеей
function changeDirection(event) {
  const key = event.key;
  if (!gameStarted) {
    // Если игра ещё не началась, запускаем её при первом нажатии клавиши
    gameStarted = true;
  }

  if (key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
}

// Функция для перезапуска игры
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 }; // Сбрасываем направление
  food = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows),
  };
  score = 0;
  gameSpeed = 200; // Возвращаем начальную скорость после рестарта
  gameStarted = false; // Сбрасываем флаг начала игры
}

// Главный игровой цикл
function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, gameSpeed);
}

// Начало игры
document.addEventListener("keydown", changeDirection);
gameLoop();
