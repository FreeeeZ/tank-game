import { useEffect, useRef, useState } from 'react';
import { Tank } from '@classes/Tank';
import { Bullet } from '@classes/Bullet';
import { Explosion } from '@classes/Explosion';
import { Obstacle } from '@classes/Obstacle';

export const useGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerTank, setPlayerTank] = useState(new Tank(100, 100));
  const [botTank, setBotTank] = useState(new Tank(400, 400));
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [botDirectionChangeTime, setBotDirectionChangeTime] = useState(
    Date.now() + 2000
  );

  botTank.speed = 1;

  // Генерация препятствий
  const generateObstacles = () => {
    const newObstacles: Obstacle[] = [];
    const obstacleCount = 10; // Количество препятствий
    const minSize = 40; // Минимальный размер препятствия
    const maxSize = 80; // Максимальный размер препятствия

    for (let i = 0; i < obstacleCount; i++) {
      const width = minSize + Math.random() * (maxSize - minSize);
      const height = minSize + Math.random() * (maxSize - minSize);
      const x = Math.random() * (800 - width); // 800 — ширина canvas
      const y = Math.random() * (600 - height); // 600 — высота canvas
      newObstacles.push(new Obstacle(x, y, width, height));
    }

    setObstacles(newObstacles);
  };

  useEffect(() => {
    generateObstacles(); // Генерация препятствий при загрузке
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          playerTank.moveForward();
          break;
        case 'ArrowDown':
          playerTank.moveBackward();
          break;
        case 'ArrowLeft':
          playerTank.rotateLeft();
          break;
        case 'ArrowRight':
          playerTank.rotateRight();
          break;
        case ' ':
          // Позиция вылета пули из дула
          const barrelLength = 20; // Длина дула
          const bulletX =
            playerTank.x + Math.cos(playerTank.angle) * barrelLength;
          const bulletY =
            playerTank.y + Math.sin(playerTank.angle) * barrelLength;

          const newBullet = new Bullet(bulletX, bulletY, playerTank.angle);
          setBullets((prev) => [...prev, newBullet]);

          setTimeout(() => {
            newBullet.activate();
          }, 100);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const drawBorder = () => {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    };

    const gameLoop = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Отрисовка границы
      drawBorder();

      // Отрисовка препятствий
      obstacles.forEach((obstacle) => {
        obstacle.draw(ctx);
      });

      // Отрисовка и обновление игрока
      if (playerTank.isAlive()) {
        playerTank.update();
        playerTank.draw(ctx);

        // Проверка коллизий игрока с препятствиями
        obstacles.forEach((obstacle) => {
          if (obstacle.collidesWithTank(playerTank)) {
            // Откат танка назад при столкновении
            playerTank.x -= Math.cos(playerTank.angle) * playerTank.speed;
            playerTank.y -= Math.sin(playerTank.angle) * playerTank.speed;
          }
        });
      }

      // Отрисовка и обновление бота
      if (botTank.isAlive()) {
        botTank.update();
        botTank.moveForward(); // Бот всегда движется вперед
        botTank.checkBounds(canvas.width, canvas.height);
        botTank.draw(ctx);

        // Проверка коллизий бота с препятствиями
        obstacles.forEach((obstacle) => {
          if (obstacle.collidesWithTank(botTank)) {
            // Откат бота назад при столкновении
            botTank.x -= Math.cos(botTank.angle) * botTank.speed;
            botTank.y -= Math.sin(botTank.angle) * botTank.speed;
          }
        });

        // Логика бота
        const now = Date.now();
        if (now > botDirectionChangeTime) {
          // Случайный поворот
          if (Math.random() < 0.5) {
            botTank.rotateLeft();
          } else {
            botTank.rotateRight();
          }
          setBotDirectionChangeTime(now + 2000 + Math.random() * 3000);
        }

        // Стрельба бота
        if (Math.random() < 0.01) {
          // Позиция вылета пули из дула бота
          const barrelLength = 20; // Длина дула
          const bulletX = botTank.x + Math.cos(botTank.angle) * barrelLength;
          const bulletY = botTank.y + Math.sin(botTank.angle) * barrelLength;

          const newBullet = new Bullet(bulletX, bulletY, botTank.angle);
          setBullets((prev) => [...prev, newBullet]);

          setTimeout(() => {
            newBullet.activate();
          }, 100);
        }
      }

      // Обработка пуль
      bullets.forEach((bullet, index) => {
        bullet.move();
        bullet.draw(ctx);

        // Проверка коллизий пуль с препятствиями
        let bulletHitObstacle = false;
        obstacles.forEach((obstacle) => {
          if (obstacle.collidesWithBullet(bullet)) {
            bulletHitObstacle = true;
          }
        });

        if (bulletHitObstacle) {
          setBullets((prev) => prev.filter((_, i) => i !== index));
        }

        // Проверка коллизий с игроком
        if (bullet.collidesWith(playerTank)) {
          playerTank.takeDamage();
          setBullets((prev) => prev.filter((_, i) => i !== index));

          if (!playerTank.isAlive()) {
            setExplosions((prev) => [
              ...prev,
              new Explosion(playerTank.x, playerTank.y),
            ]);
          }
        }

        // Проверка коллизий с ботом
        if (bullet.collidesWith(botTank)) {
          botTank.takeDamage();
          setBullets((prev) => prev.filter((_, i) => i !== index));

          if (!botTank.isAlive()) {
            setExplosions((prev) => [
              ...prev,
              new Explosion(botTank.x, botTank.y),
            ]);
          }
        }

        // Удаление пуль за пределами экрана
        if (
          bullet.x < 0 ||
          bullet.x > canvas.width ||
          bullet.y < 0 ||
          bullet.y > canvas.height
        ) {
          setBullets((prev) => prev.filter((_, i) => i !== index));
        }
      });

      // Отрисовка и обновление взрывов
      explosions.forEach((explosion, index) => {
        explosion.update();
        explosion.draw(ctx);

        // Удаление завершенных взрывов
        if (explosion.isFinished()) {
          setExplosions((prev) => prev.filter((_, i) => i !== index));
        }
      });

      // Удаление уничтоженных танков
      if (!playerTank.isAlive()) {
        alert('Вы проиграли!');
        clearInterval(gameLoop);
        setPlayerTank(new Tank(100, 100));
      }

      if (!botTank.isAlive()) {
        alert('Вы выиграли!');
        clearInterval(gameLoop);
        setBotTank(new Tank(400, 400));
      }
    }, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    playerTank,
    botTank,
    bullets,
    explosions,
    obstacles,
    botDirectionChangeTime,
  ]);

  return {
    canvasRef,
  };
};
