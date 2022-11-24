const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(effect) {
        this.effect = effect;
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
        this.size = 5;
        this.vx = Math.random() * 3 - 2;
        this.vy = Math.random() * 3 - 2;
    }

    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.size, this.size)
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
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
    }

    init(ctx) {
        // for (let i = 0; i < 100; i++) {
        //     this.particles.push(new Particle(this));
        // }
        ctx.drawImage(this.image, this.imageX, this.imageY, 500, 325);
        const pixels = ctx.getImageData(0, 0, this.width, this.height);
        console.log(pixels);
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    update() {
        this.particles.forEach(particle => particle.update());
    }
}

const effect = new Effect(canvas.width, canvas.height);
effect.init(ctx);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    effect.update();
    requestAnimationFrame(animate);
}

// animate();
