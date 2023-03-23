class MapComponent {
    constructor(conf = { width: 100, height: 100, style: NoiseMap.STYLE.REALISTIC }) {
        this.conf = conf;
        this.generate();
    }
    generate() {
        let generator = new NoiseMap.MapGenerator();
        this.data = generator.createMap(this.conf.width, this.conf.height, { type: 'perlin' });
        this.mapStyle = this.conf.style;
    }
    isTileDeepWater(tile) {
        let x = Math.floor(tile.x / 17);
        let y = Math.floor(tile.y / 17);
        let indx = 100 * y + x;
        if (SIM_MAP.data.data[indx] < 0.5) {
            return true;
        } else {
            return false;
        }
    }
}

const SIM_MAP = new MapComponent();
