import React, { useState, useEffect, useRef, useCallback } from 'react';

interface MiniGameSnakeProps {
  onClose: () => void;
  playSelect: () => void;
  playClose: () => void;
}

export const MiniGameSnake: React.FC<MiniGameSnakeProps> = ({
  onClose,
  playSelect,
  playClose,
}) => {
  const CANVAS_SIZE = 400;
  const GRID_SIZE = 20;
  const CELL_COUNT = CANVAS_SIZE / GRID_SIZE;
  const SPEED = 100;

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('snake_highscore') || '0');
  });
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeRef = useRef<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const directionRef = useRef<{ x: number; y: number }>({ x: 0, y: -1 });
  const foodRef = useRef<{ x: number; y: number }>({ x: 5, y: 5 });
  const gameLoopRef = useRef<number | null>(null);

  // Generate random food position not on snake
  const generateFood = useCallback(() => {
    let newFood;
    let onSnake = true;
    while (onSnake) {
      newFood = {
        x: Math.floor(Math.random() * CELL_COUNT),
        y: Math.floor(Math.random() * CELL_COUNT),
      };
      // Check if food is on snake
      onSnake = snakeRef.current.some(
        (segment) => segment.x === newFood!.x && segment.y === newFood!.y
      );
    }
    foodRef.current = newFood!;
  }, [CELL_COUNT]);

  // Update and draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1e2025';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid lines faintly for PS5 retro aesthetic
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CELL_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
      ctx.stroke();
    }

    // Draw food (glowing circle / orbital)
    const foodX = foodRef.current.x * GRID_SIZE + GRID_SIZE / 2;
    const foodY = foodRef.current.y * GRID_SIZE + GRID_SIZE / 2;
    
    // Outer glow
    ctx.beginPath();
    const radGrd = ctx.createRadialGradient(foodX, foodY, 2, foodX, foodY, GRID_SIZE / 2);
    radGrd.addColorStop(0, '#f59e0b');
    radGrd.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = radGrd;
    ctx.arc(foodX, foodY, GRID_SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Inner core
    ctx.beginPath();
    ctx.arc(foodX, foodY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Draw snake segments
    snakeRef.current.forEach((segment, index) => {
      const isHead = index === 0;
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;

      ctx.fillStyle = isHead ? '#3b82f6' : '#1d4ed8'; // Royal Blue Head, Darker Blue Body
      
      // Rounded rectangles for snake
      ctx.beginPath();
      const radius = isHead ? 6 : 4;
      ctx.roundRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, radius);
      ctx.fill();

      // Eye highlight for the head
      if (isHead) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        // Place eyes based on direction
        const dir = directionRef.current;
        if (dir.x !== 0) {
          ctx.arc(x + GRID_SIZE / 2 + dir.x * 4, y + 6, 2, 0, 2 * Math.PI);
          ctx.arc(x + GRID_SIZE / 2 + dir.x * 4, y + 14, 2, 0, 2 * Math.PI);
        } else {
          ctx.arc(x + 6, y + GRID_SIZE / 2 + dir.y * 4, 2, 0, 2 * Math.PI);
          ctx.arc(x + 14, y + GRID_SIZE / 2 + dir.y * 4, 2, 0, 2 * Math.PI);
        }
        ctx.fill();
      }
    });
  }, [CANVAS_SIZE, GRID_SIZE, CELL_COUNT]);

  const startGame = () => {
    playSelect();
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    directionRef.current = { x: 0, y: -1 };
    generateFood();
    setScore(0);
    setGameOver(false);
    setIsStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStarted || gameOver) return;
      
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, gameOver]);

  // Game tick loop
  useEffect(() => {
    if (!isStarted || gameOver) return;

    const tick = () => {
      const snake = [...snakeRef.current];
      const head = { ...snake[0] };
      const dir = directionRef.current;

      head.x += dir.x;
      head.y += dir.y;

      // Check collision with walls or self
      if (
        head.x < 0 ||
        head.x >= CELL_COUNT ||
        head.y < 0 ||
        head.y >= CELL_COUNT ||
        snake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        setIsStarted(false);
        playClose();
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snake_highscore', String(score));
        }
        return;
      }

      // Add new head
      snake.unshift(head);

      // Check food collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore((prev) => prev + 1);
        generateFood();
      } else {
        // Remove tail
        snake.pop();
      }

      snakeRef.current = snake;
      draw();
      gameLoopRef.current = window.setTimeout(tick, SPEED);
    };

    gameLoopRef.current = window.setTimeout(tick, SPEED);

    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [isStarted, gameOver, score, highScore, CELL_COUNT, generateFood, draw, playClose]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="game-overlay">
      <div className="game-container ps5-card">
        <div className="game-header">
          <h2>
            <span className="retro-tag">PS RETRO</span> ASTRO'S SLITHER
          </h2>
          <button className="ps5-close-btn" onClick={() => { playClose(); onClose(); }}>
            ✕ Close
          </button>
        </div>

        <div className="game-scoreboard">
          <div className="score-box">
            <span className="label">SCORE</span>
            <span className="value">{score}</span>
          </div>
          <div className="score-box">
            <span className="label">HIGH SCORE</span>
            <span className="value">{highScore}</span>
          </div>
        </div>

        <div className="game-viewport-wrapper">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="game-canvas"
          />
          {!isStarted && (
            <div className="canvas-overlay">
              <div className="overlay-content">
                {gameOver ? (
                  <>
                    <h3 className="game-over-text">GAME OVER</h3>
                    <p className="final-score">Final Score: {score}</p>
                  </>
                ) : (
                  <>
                    <h3>ASTRO'S RETRO SLITHER</h3>
                    <p className="tagline">Can you reach the top of the ledger?</p>
                  </>
                )}
                <button className="ps5-primary-btn active" onClick={startGame}>
                  {gameOver ? 'RETRY MISSION' : 'START GAME'}
                </button>
                <p className="controls-hint">Use Keyboard Arrow Keys to Navigate</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
