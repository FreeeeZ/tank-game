import { Tank } from '@classes/Tank';
import { Bullet } from '@classes/Bullet';

export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'brown'; // Цвет препятствия
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  collidesWithTank(tank: Tank): boolean {
    return (
      tank.x < this.x + this.width &&
      tank.x + 30 > this.x && // 30 — ширина танка
      tank.y < this.y + this.height &&
      tank.y + 30 > this.y // 30 — высота танка
    );
  }

  collidesWithBullet(bullet: Bullet): boolean {
    return (
      bullet.x > this.x &&
      bullet.x < this.x + this.width &&
      bullet.y > this.y &&
      bullet.y < this.y + this.height
    );
  }
}
