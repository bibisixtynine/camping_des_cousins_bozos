class Creature {
    constructor(ds, audio, x, y, radius) {
        this.ds = ds;
        this.audio = audio;
        this.radius = radius || (20 + Math.random() * 40);
        this.x = x || Math.random() * ds.width;
        this.y = y || Math.random() * ds.height;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = 0;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.darkColor = `hsl(${Math.random() * 360}, 70%, 30%)`;
        this.eyeRadius = this.radius * 0.25;
        this.pupilRadius = this.radius * 0.1;
        this.blinkTimer = Math.random() * 100;
        this.isBlinking = false;
        this.jumpTimer = Math.random() * 100;
    }

    update() {
        this.vy += Config.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;

        if (this.x + this.radius > this.ds.width || this.x - this.radius < 0) this.vx *= -1;

        const groundY = this.ds.height * Config.groundYPercent;
        if (this.y + this.radius > groundY) {
            this.y = groundY - this.radius;
            this.vy *= -0.7;
            if (Math.abs(this.vy) < 1) this.vy = 0;
        }

        this.jumpTimer--;
        if (this.jumpTimer <= 0) {
            this.vy = -Math.random() * 10 - 5;
            this.jumpTimer = 60 + Math.random() * 120;
            this.audio.playSound(200 + Math.random() * 300, 'triangle', 0.2, 0.05);
        }

        this.blinkTimer--;
        if (this.blinkTimer <= 0) {
            this.isBlinking = true;
            if (this.blinkTimer < -10) {
                this.isBlinking = false;
                this.blinkTimer = 100 + Math.random() * 200;
            }
        }
    }

    draw(t) {
        const ctx = this.ds.ctx;
        const angleToMouse = Math.atan2(this.ds.mouseY - this.y, this.ds.mouseX - this.x);
        const sway = Math.sin(t * 3 + this.x) * 0.2;
        
        this.drawLimb(this.x - this.radius * 0.4, this.y + this.radius * 0.8, this.radius, Math.PI/2 + sway, true);
        this.drawLimb(this.x + this.radius * 0.4, this.y + this.radius * 0.8, this.radius, Math.PI/2 - sway, true);
        this.drawLimb(this.x - this.radius, this.y, this.radius, Math.PI + angleToMouse + sway, false);
        this.drawLimb(this.x + this.radius, this.y, this.radius, -angleToMouse - sway, false);
        
        this.drawHair(t);
        const grad = ctx.createRadialGradient(this.x - this.radius*0.3, this.y - this.radius*0.3, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, this.darkColor);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        this.drawEye(this.x - this.radius * 0.3, this.y - this.radius * 0.1);
        this.drawEye(this.x + this.radius * 0.3, this.y - this.radius * 0.1);
    }

    drawLimb(startX, startY, length, angle, isLeg) {
        const ctx = this.ds.ctx;
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;
        ctx.beginPath();
        ctx.lineWidth = this.radius * 0.2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.darkColor;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(endX, endY, isLeg ? this.radius * 0.15 : this.radius * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    drawHair(t) {
        const ctx = this.ds.ctx;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let i = -this.radius * 0.6; i <= this.radius * 0.6; i += 10) {
            const startX = this.x + i;
            const startY = this.y - this.radius * 0.8;
            const endX = startX + Math.sin(t + i) * 15;
            const endY = startY - this.radius * 0.5;
            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(startX + 5, startY - 20, endX, endY);
        }
        ctx.stroke();
    }

    drawEye(centerX, centerY) {
        const ctx = this.ds.ctx;
        const dx = this.ds.mouseX - centerX;
        const dy = this.ds.mouseY - centerY;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(this.eyeRadius * 0.4, Math.hypot(dx, dy) / 50);
        const pupilX = centerX + Math.cos(angle) * dist;
        const pupilY = centerY + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.eyeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        if (this.isBlinking) {
            ctx.fillStyle = 'black';
            ctx.fillRect(centerX - this.eyeRadius, centerY - 2, this.eyeRadius * 2, 4);
        } else {
            ctx.beginPath();
            ctx.arc(pupilX, pupilY, this.pupilRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
        }
    }
}

class Cloud {
    constructor(ds) {
        this.ds = ds;
        this.reset();
        this.x = Math.random() * ds.width;
    }
    reset() {
        this.x = -200;
        this.y = Math.random() * (this.ds.height * 0.4);
        this.speed = 0.2 + Math.random() * 0.5;
        this.scale = 0.5 + Math.random() * 1;
    }
    update() {
        this.x += this.speed;
        if (this.x > this.ds.width + 100) this.reset();
    }
    draw() {
        const ctx = this.ds.ctx;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30 * this.scale, 0, Math.PI * 2);
        ctx.arc(this.x + 25 * this.scale, this.y - 10 * this.scale, 35 * this.scale, 0, Math.PI * 2);
        ctx.arc(this.x + 50 * this.scale, this.y, 30 * this.scale, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Bird {
    constructor(ds, audio) {
        this.ds = ds;
        this.audio = audio;
        this.reset();
        this.x = Math.random() * ds.width;
    }
    reset() {
        this.x = -50;
        this.y = Math.random() * (this.ds.height * 0.5);
        this.speed = 2 + Math.random() * 3;
        this.wingAngle = 0;
    }
    update() {
        this.x += this.speed;
        this.y += Math.sin(this.x * 0.01) * 1;
        this.wingAngle += 0.2;
        if (this.x > this.ds.width + 50) {
            this.reset();
            this.audio.playBird();
        }
    }
    draw() {
        const ctx = this.ds.ctx;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        const wingY = Math.sin(this.wingAngle) * 5;
        ctx.beginPath();
        ctx.moveTo(this.x - 5, this.y + wingY);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x + 5, this.y + wingY);
        ctx.stroke();
    }
}

class Plane {
    constructor(ds) {
        this.ds = ds;
        this.reset();
        this.x = Math.random() * ds.width;
    }
    reset() {
        this.x = -100;
        this.y = Math.random() * (this.ds.height * 0.5);
        this.speed = 4 + Math.random() * 4;
        this.angle = 0;
        this.spin = 0;
    }
    update() {
        this.x += this.speed;
        this.angle += 0.02;
        this.spin += 0.1;
        if (Math.sin(this.angle * 5) > 0.8) this.y += Math.sin(this.spin) * 5;
        if (this.x > this.ds.width + 100) this.reset();
    }
    draw() {
        const ctx = this.ds.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.sin(this.angle * 2) * 0.5);
        ctx.fillStyle = "silver";
        ctx.fillRect(-10, -2, 20, 4);
        ctx.fillStyle = "red";
        ctx.fillRect(-2, -8, 4, 16);
        ctx.restore();
    }
}

class UFO {
    constructor(ds) {
        this.ds = ds;
        this.x = -100;
        this.y = this.ds.height * 0.2;
        this.speed = 3;
        this.active = false;
        this.bombTimer = 0;
    }
    update(bombs) {
        if (!this.active) {
            if (Math.random() < 0.002) this.active = true;
            return;
        }
        this.x += this.speed;
        this.y = this.ds.height * 0.2 + Math.sin(this.x * 0.02) * 50;
        this.bombTimer++;
        if (this.bombTimer > 100) {
            bombs.push(new Bomb(this.ds, this.x, this.y));
            this.bombTimer = 0;
        }
        if (this.x > this.ds.width + 100) this.active = false;
    }
    draw() {
        const ctx = this.ds.ctx;
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = "#C0C0C0";
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(0, -5, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = (Math.floor(Date.now()/200)%2) ? "red" : "yellow";
        ctx.beginPath();
        ctx.arc(-20, 0, 3, 0, Math.PI * 2);
        ctx.arc(20, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Bomb {
    constructor(ds, x, y) {
        this.ds = ds;
        this.x = x;
        this.y = y;
        this.vy = 2;
        this.radius = 8;
        this.exploded = false;
    }
    update(explosions, creatures, trees) {
        this.vy += 0.1;
        this.y += this.vy;
        if (this.y > this.ds.height * Config.groundYPercent) {
            this.explode(explosions, creatures, trees);
        }
    }
    explode(explosions, creatures, trees) {
        this.exploded = true;
        // Le son est géré par l'App via l'AudioManager
        explosions.push(new MushroomCloud(this.ds, this.x, this.y));
        const force = 50;
        creatures.forEach(c => {
            const dx = c.x - this.x;
            const dy = c.y - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 400) {
                const push = (400 - dist) / 10;
                c.vx += (dx / dist) * push;
                c.vy -= (dy / dist) * push;
            }
        });
        trees.forEach(t => {
            const dx = t.x - this.x;
            const dist = Math.abs(dx);
            if (dist < 600) t.lean = (dx / dist) * 0.8;
        });
    }
    draw() {
        const ctx = this.ds.ctx;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class MushroomCloud {
    constructor(ds, x, y) {
        this.ds = ds;
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 80 + Math.random() * 50;
        this.life = 1.0;
    }
    update() {
        this.radius += 5;
        this.life -= 0.02;
    }
    draw() {
        const ctx = this.ds.ctx;
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = `rgb(255, ${100 + this.radius}, 0)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.radius * 0.5, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(this.x - this.radius * 0.2, this.y - this.radius * 0.5, this.radius * 0.4, this.radius * 0.5);
        ctx.restore();
    }
}