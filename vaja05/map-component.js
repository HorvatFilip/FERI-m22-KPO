class MapComponent {
    constructor(conf = { width: 100, height: 100, style: NoiseMap.STYLE.REALISTIC, seed: null, mapConf: null }) {
        this.conf = conf;
    }
    setConfig(conf) {
        this.conf = conf;
    }
    generate() {
        if (this.conf.mapConf != null) {
            if (this.conf.seed == null) {
                this.conf.seed = Math.random();
            }
            this.generator = new NoiseMap.MapGenerator(this.conf.seed, this.conf.mapConf);
        } else {
            this.generator = new NoiseMap.MapGenerator();
        }
        this.data = this.generator.createMap(this.conf.width, this.conf.height, { type: 'perlin' });
        this.mapStyle = this.conf.style;
    }
    isTileDeepWater(tile) {
        let x = Math.floor(tile.x / 17);
        let y = Math.floor(tile.y / 17);
        let tileIndx = 100 * y + x;
        if (SIM_MAP.data.data[tileIndx] < 0.5) {
            return true;
        } else {
            return false;
        }
    }
    terrainPenalty(tile) {
        let penalty = 0;
        let x = Math.floor(tile.x / 17);
        let y = Math.floor(tile.y / 17);
        let tileIndx = 100 * y + x;
        if (SIM_MAP.data.data[tileIndx] < 0.5) {
            penalty = 1 - SIM_MAP.data.data[tileIndx];
        } else if (SIM_MAP.data.data[tileIndx] > 0.65) {
            penalty = SIM_MAP.data.data[tileIndx] - 0.4;
        }
        return penalty;
    }
}
let SIM_MAP = null;