class App {
    constructor() {
        this.ds = new DataStore();
        this.config = Config;
        this.audio = new AudioManager(this.ds);
        this.render = new RenderManager(this.ds);
        this.entities = null; // Initialisé après render.init()
    }

    init() {
        this.render.init();
        this.entities = new EntityManager(this.ds, this.audio);
        
        this.setupEvents();
        this.loop();
    }

    setupEvents() {
        window.addEventListener('mousemove', (e) => {
            this.ds.mouseX = e.clientX;
            this.ds.mouseY = e.clientY;
        });

        window.addEventListener('mousedown', () => {
            if (this.ds.isAudioStarted) {
                this.entities.jumpAll();
            }
        });

        document.getElementById('start-button').addEventListener('click', (e) => {
            e.stopPropagation();
            this.audio.init();
            document.getElementById('overlay').style.opacity = '0';
            setTimeout(() => { document.getElementById('overlay').style.display = 'none'; }, 500);
        });
    }

    loop(t) {
        t /= 1000;
        this.render.clear();
        this.render.drawBackground(this.entities.trees);
        
        this.entities.update(t);
        this.entities.draw(t);
        
        requestAnimationFrame((time) => this.loop(time));
    }
}

// Lancement de l'application
const game = new App();
game.init();