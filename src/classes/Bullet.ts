import { Tank } from '@classes/Tank';

export class Bullet {
  x: number;
  y: number;
  angle: number;
  speed: number;
  isActive: boolean;

  constructor(x: number, y: number, angle: number) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 5;
    this.isActive = false;
  }

  move() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  collidesWith(tank: Tank): boolean {
    if (!this.isActive) return false;
    const dx = this.x - tank.x;
    const dy = this.y - tank.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 20;
  }

  activate() {
    this.isActive = true;
  }
}
