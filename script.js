const button = document.getElementById('button')
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(effect, x, y, color) {
        this.effect = effect;
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
        this.originX = Math.floor(x);
        this.originY = Math.floor(y);
        this.color = color;
        this.size = this.effect.gap;
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.05;
        this.friction = 0.3;
        this.distanceX = 0;
        this.distanceY = 0;
        this.distance = 0;
        this.force = 0;
        this.angle = 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size)
    }

    update() {
        this.distanceX = this.effect.mouse.x - this.x;
        this.distanceY = this.effect.mouse.y - this.y;
        this.distance = this.distanceX * this.distanceX + this.distanceY * this.distanceY;

        this.force = -this.effect.mouse.radius / this.distance;

        if (this.distance < this.effect.mouse.radius) {
            this.angle = Math.atan2(this.distanceY, this.distanceX)
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
        }

        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
    }

    scatter() {
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
        this.ease = 0.01;
    }
}

class Effect {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.particles = [];
        this.image = document.getElementById('image1');
        this.imageWidth = 500;
        this.imageHeight = 325;
        this.centerX = this.width * 0.5;
        this.centerY = this.height * 0.5;
        this.imageX = this.centerX - this.imageWidth * 0.5;
        this.imageY = this.centerY - this.imageHeight * 0.5;
        this.gap = 3;
        this.mouse = {
            radius: 10000,
            x: null,
            y: null
        }

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        })
    }

    init(ctx) {
        ctx.drawImage(this.image, this.imageX, this.imageY, 500, 325);
        const pixels = ctx.getImageData(0, 0, this.width, this.height).data;

        for (let y = 0; y < this.height; y += this.gap) {
            for (let x = 0; x < this.width; x += this.gap) {
                const index = (y * this.width + x) * 4;
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                const color = `rgba(${red}, ${green}, ${blue})`;

                if (alpha > 0) {
                    this.particles.push(new Particle(this, x, y, color));
                }
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    update() {
        this.particles.forEach(particle => particle.update());
    }

    scatter() {
        this.particles.forEach(particle => particle.scatter());
    }
}

const effect = new Effect(canvas.width, canvas.height);
effect.init(ctx);

button.onclick = () => effect.scatter();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    effect.update();
    requestAnimationFrame(animate);
}
animate();
