export class Tank {
  x: number;
  y: number;
  angle: number;
  targetAngle: number;
  speed: number;
  health: number;
  turretAngle: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.targetAngle = 0;
    this.speed = 10;
    this.health = 3;
    this.turretAngle = 0;
  }

  moveForward() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  moveBackward() {
    this.x -= Math.cos(this.angle) * this.speed;
    this.y -= Math.sin(this.angle) * this.speed;
  }

  rotateLeft() {
    this.targetAngle -= 0.1;
  }

  rotateRight() {
    this.targetAngle += 0.1;
  }

  update() {
    const angleDiff = this.targetAngle - this.angle;
    if (Math.abs(angleDiff) > 0.1) {
      this.angle += angleDiff * 0.1;
    } else {
      this.angle = this.targetAngle;
    }

    this.turretAngle = 0;
  }

  checkBounds(canvasWidth: number, canvasHeight: number) {
    const margin = 30;
    if (this.x < margin) {
      this.targetAngle = 0;
    } else if (this.x > canvasWidth - margin) {
      this.targetAngle = Math.PI;
    }

    if (this.y < margin) {
      this.targetAngle = Math.PI / 2;
    } else if (this.y > canvasHeight - margin) {
      this.targetAngle = -Math.PI / 2;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(-20, -15, 40, 30);
    ctx.fillRect(-25, -10, 10, 20);
    ctx.fillRect(15, -10, 10, 20);

    ctx.save();
    ctx.rotate(this.turretAngle);
    ctx.fillStyle = 'green';
    ctx.fillRect(-10, -10, 20, 20);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, -5, 20, 10);
    ctx.restore();
    ctx.restore();
  }

  takeDamage() {
    this.health -= 1;
  }

  isAlive() {
    return this.health > 0;
  }
}
