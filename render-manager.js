class RenderManager {
    constructor(dataStore) {
        this.ds = dataStore;
        this.canvas = document.getElementById('gameCanvas');
    }

    init() {
        this.ds.ctx = this.canvas.getContext('2d');
        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    resize() {
        this.ds.width = window.innerWidth;
        this.ds.height = window.innerHeight;
        this.canvas.width = this.ds.width;
        this.canvas.height = this.ds.height;
    }

    clear() {
        this.ds.ctx.clearRect(0, 0, this.ds.width, this.ds.height);
    }

    drawBackground(trees) {
        const ctx = this.ds.ctx;
        ctx.fillStyle = Config.colors.sky;
        ctx.fillRect(0, 0, this.ds.width, this.ds.height);

        ctx.fillStyle = Config.colors.sun;
        ctx.beginPath();
        ctx.arc(this.ds.width * 0.85, this.ds.height * 0.15, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = Config.colors.ground;
        ctx.fillRect(0, this.ds.height * Config.groundYPercent, this.ds.width, this.ds.height * (1 - Config.groundYPercent));

        trees.forEach(t => {
            ctx.save();
            ctx.translate(t.x, this.ds.height * Config.groundYPercent);
            ctx.rotate(t.lean);
            ctx.fillStyle = Config.colors.trunk;
            ctx.fillRect(-5, -20, 10, 20);
            ctx.fillStyle = Config.colors.leaves;
            ctx.beginPath();
            ctx.moveTo(-20, -20);
            ctx.lineTo(0, -20 - t.h);
            ctx.lineTo(20, -20);
            ctx.fill();
            ctx.restore();
            t.lean *= 0.98;
        });
    }
}