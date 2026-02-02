const canvas = document.getElementById('tronCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let lines = [];
const maxLines = 12; // POQUITAS LÍNEAS PARA MÁS ELEGANCIA

function init() {
    resize();
    for (let i = 0; i < maxLines; i++) {
        lines.push(new TronLine());
    }
    animate();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);

class TronLine {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speed = 2.5; // Velocidad constante y fluida
        this.color = Math.random() > 0.5 ? '#ff003c' : '#00d2ff';
        this.points = [{x: this.x, y: this.y}];
        this.maxPoints = 80; // Estela larga pero limpia
        this.direction = Math.floor(Math.random() * 4); 
        this.timer = 0;
        this.turnInterval = Math.random() * 40 + 20;
    }

    update() {
        this.timer++;

        if (this.direction === 0) this.x += this.speed;
        if (this.direction === 1) this.x -= this.speed;
        if (this.direction === 2) this.y -= this.speed;
        if (this.direction === 3) this.y += this.speed;

        if (this.timer > this.turnInterval) {
            this.timer = 0;
            const oldDir = this.direction;
            if (oldDir < 2) {
                this.direction = Math.random() > 0.5 ? 2 : 3;
            } else {
                this.direction = Math.random() > 0.5 ? 0 : 1;
            }
        }

        this.points.push({x: this.x, y: this.y});
        if (this.points.length > this.maxPoints) this.points.shift();

        if (this.x < -200 || this.x > width + 200 || this.y < -200 || this.y > height + 200) {
            this.reset();
        }
    }

    draw() {
        if (this.points.length < 2) return;

        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = this.color;
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

function animate() {
    // Fondo negro puro con desvanecimiento lento
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    lines.forEach(line => {
        line.update();
        line.draw();
    });

    requestAnimationFrame(animate);
}

init();