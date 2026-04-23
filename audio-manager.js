class AudioManager {
    constructor(dataStore) {
        this.ds = dataStore;
    }

    init() {
        this.ds.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.ds.isAudioStarted = true;
        this.startAmbientMusic();
    }

    playSound(freq, type = 'sine', duration = 0.1, vol = 0.1) {
        // SÉCURITÉ : On sort immédiatement si le contexte audio n'est pas encore créé
        if (!this.ds.audioCtx) return;
        
        const osc = this.ds.audioCtx.createOscillator();
        const gain = this.ds.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ds.audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, this.ds.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ds.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ds.audioCtx.destination);
        osc.start();
        osc.stop(this.ds.audioCtx.currentTime + duration);
    }

    playBoom() {
        if (!this.ds.audioCtx) return;
        this.playSound(60, 'square', 1.5, 0.3);
        this.playSound(40, 'sine', 1.0, 0.5);
        for(let i=0; i<10; i++) this.playSound(Math.random()*100 + 20, 'sawtooth', 0.2, 0.05);
    }

    playBird() {
        // SÉCURITÉ : On vérifie l'existence du contexte avant d'accéder à currentTime
        if (!this.ds.audioCtx) return;
        
        const now = this.ds.audioCtx.currentTime;
        const osc = this.ds.audioCtx.createOscillator();
        const gain = this.ds.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800 + Math.random() * 500, now);
        osc.frequency.exponentialRampToValueAtTime(2500 + Math.random() * 500, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ds.audioCtx.destination);
        osc.start();
        osc.stop(now + 0.15);
    }

    startAmbientMusic() {
        const tempo = 110;
        const noteDuration = 60 / tempo / 2;
        const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 466.45, 523.25]; 
        let step = 0;
        setInterval(() => {
            if (!this.ds.audioCtx) return;
            if (step % 4 === 0) this.playSound(scale[0] / 2, 'square', 0.2, 0.06);
            if (Math.random() > 0.6) {
                const note = scale[Math.floor(Math.random() * scale.length)];
                this.playSound(note, 'triangle', 0.3, 0.04);
            }
            step++;
        }, noteDuration * 1000);
    }
}