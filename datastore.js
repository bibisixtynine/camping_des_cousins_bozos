class DataStore {
    constructor() {
        this.ctx = null;
        this.audioCtx = null;
        this.width = 0;
        this.height = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isAudioStarted = false;
    }

    updateDimensions(w, h) {
        this.width = w;
        this.height = h;
    }
}