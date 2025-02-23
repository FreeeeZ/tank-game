export class Explosion {
  x: number;
  y: number;
  frame: number;
  maxFrames: number;
  frameDuration: number;
  lastFrameTime: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.maxFrames = 7; // Количество кадров в анимации
    this.frameDuration = 100; // Длительность одного кадра в мс
    this.lastFrameTime = Date.now();
  }

  update() {
    const now = Date.now();
    if (now - this.lastFrameTime > this.frameDuration) {
      this.frame += 1;
      this.lastFrameTime = now;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.frame >= this.maxFrames) return;

    const size = 30 + this.frame * 10; // Увеличиваем размер взрыва
    ctx.fillStyle = `rgba(255, ${100 - this.frame * 20}, 0, ${1 - this.frame / this.maxFrames})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  isFinished(): boolean {
    return this.frame >= this.maxFrames;
  }
}
