class Ghost {
  static speed = 2;
  constructor({ position, velocity, color = "red", speed = 2 }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.color = color;
    this.prevCollisions = [];
    this.speed = speed;
    this.scared = false;
    this.radians = 0.95;
    this.openRate = 0.5;
    this.rotation = 0;
  }
  draw() {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);
    context.translate(-this.position.x, -this.position.y);
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    );
    context.lineTo(this.position.x, this.position.y);
    context.fillStyle = this.scared ? " blue" : this.color;
    context.fill();
    context.closePath();
    context.restore();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.radians < 0 || this.radians > 0.95) this.openRate = -this.openRate;
    this.radians += this.openRate;
  }
}
