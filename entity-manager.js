class EntityManager {
    constructor(ds, audio) {
        this.ds = ds;
        this.audio = audio;
        this.creatures = [];
        this.clouds = [];
        this.birds = [];
        this.planes = [];
        this.bombs = [];
        this.explosions = [];
        this.trees = [];
        this.ufo = new UFO(ds);
        this.init();
    }

    init() {
        for (let i = 0; i < Config.creatureCount; i++) this.creatures.push(new Creature(this.ds, this.audio));
        for (let i = 0; i < Config.cloudCount; i++) this.clouds.push(new Cloud(this.ds));
        for (let i = 0; i < Config.birdCount; i++) this.birds.push(new Bird(this.ds, this.audio));
        for (let i = 0; i < Config.planeCount; i++) this.planes.push(new Plane(this.ds));
        
        for (let i = 0; i < this.ds.width; i += 80) {
            this.trees.push({ x: i + 40, h: 60 + Math.sin(i) * 20, lean: 0 });
        }
    }

    update(t) {
        this.clouds.forEach(c => c.update());
        this.birds.forEach(b => b.update());
        this.planes.forEach(p => p.update());
        
        this.ufo.update(this.bombs);

        for (let i = this.bombs.length - 1; i >= 0; i--) {
            const b = this.bombs[i];
            b.update(this.explosions, this.creatures, this.trees);
            
            this.creatures.forEach((c, idx) => {
                if (Math.hypot(c.x - b.x, c.y - b.y) < c.radius + b.radius) {
                    for(let j=0; j<3; j++) {
                        this.creatures.push(new Creature(this.ds, this.audio, c.x, c.y, c.radius * 0.5));
                    }
                    this.creatures.splice(idx, 1);
                    b.explode(this.explosions, this.creatures, this.trees);
                    this.audio.playBoom();
                }
            });

            if (b.exploded) this.bombs.splice(i, 1);
        }

        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const e = this.explosions[i];
            e.update();
            if (e.life <= 0) this.explosions.splice(i, 1);
        }

        this.creatures.forEach(c => c.update());
    }

    draw(t) {
        this.clouds.forEach(c => c.draw());
        this.birds.forEach(b => b.draw());
        this.planes.forEach(p => p.draw());
        this.ufo.draw();
        this.bombs.forEach(b => b.draw());
        this.explosions.forEach(e => e.draw());
        this.creatures.forEach(c => c.draw(t));
    }

    jumpAll() {
        this.creatures.forEach(c => { c.vy = -Math.random() * 15 - 10; });
        this.audio.playSound(440, 'sine', 0.1, 0.05);
    }
}