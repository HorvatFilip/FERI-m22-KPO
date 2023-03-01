class DrawComponent {
    constructor(simCanvasConf, infoCanvasConf) {
        this.simCanvas = document.getElementById(simCanvasConf.id);
        this.simCanvas.width = simCanvasConf.width;
        this.simCanvas.height = simCanvasConf.height;
        this.simCtx = this.simCanvas.getContext("2d");

        this.infoCanvas = document.getElementById(infoCanvasConf.id);
        this.infoCanvas.width = infoCanvasConf.width;
        this.infoCanvas.height = infoCanvasConf.height;
        this.infoCtx = this.infoCanvas.getContext("2d");
        this.infoPoints = [];
    }
    drawBoard() {
        console.log("TODO - drawBoard");
    }
    clearDisplay() {
        this.simCtx.fillStyle = "rgb(50, 60, 70)";
        this.simCtx.fillRect(0, 0, this.simCanvas.width, this.simCanvas.height);
    }
    sync(state) {
        this.clearDisplay();
        this.drawAllOrganisms(state.organismGroups);
    }
    drawAllOrganisms(organismGroups) {
        organismGroups.forEach(orgGroup => {
            orgGroup.population.forEach(org => {
                this.drawOrganism(org)
            })
        });
    }
    drawOrganism(organism) {
        this.simCtx.beginPath();
        this.simCtx.arc(organism.pos.x, organism.pos.y, organism.size, 0, Math.PI * 2);
        this.simCtx.closePath();
        this.simCtx.fillStyle = organism.color;
        this.simCtx.fill();
    }
    drawChart(organismGroups) {
        let newPopSizeInfo = [];
        organismGroups.forEach(orgGroup => {

            let groupInfo = {}
            groupInfo[orgGroup.type] = orgGroup.popSize;
        });
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vector02) {
        return new Vector(this.x + vector02.x, this.y + vector02.y);
    }
    subtract(vector02) {
        return new Vector(this.x - vector02.x, this.y - vector02.y);
    }
    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    dotProduct(vector02) {
        return this.x * vector02.x + this.y * vector02.y;
    }
    getMagnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    getDirection() {
        return Math.atan2(this.x, this.y);
    }
}

class Organism {
    constructor(orgNewPos) {
        Object.assign(this, orgNewPos);
    }
    update(state, time) {
        let rndMove = true;
        if (this.pos.x >= state.display.simCanvas.width - 30 || this.pos.x <= 30) {
            this.velocity = new Vector(this.velocity.x * (-1), this.velocity.y)
            rndMove = false;
        }
        if (this.pos.y >= state.display.simCanvas.height - 30 || this.pos.y <= 30) {
            this.velocity = new Vector(this.velocity.x, this.velocity.y * (-1));
            rndMove = false;
        }
        if (rndMove) {
            let changeVelocity = Math.floor(Math.random() * 4);
            switch (changeVelocity) {
                case 0:
                    break;
                case 1:
                    this.velocity = new Vector(this.velocity.x * (-1), this.velocity.y);
                case 2:
                    this.velocity = new Vector(this.velocity.x, this.velocity.y * (-1));
                case 3:
                    this.velocity = new Vector(this.velocity.x * (-1), this.velocity.y * (-1));
            }
        }


        return new Organism({
            ...this,
            pos: this.pos.add(this.velocity)
        });
    }
}

class OrganismGroup {
    constructor(type, initialPopSize, rp, sp, k, orgSize, orgColor, spawnPoint, spawnVelocity = new Vector(2, 2)) {
        this.type = type;
        this.rp = rp;
        this.sp = sp;
        this.k = k;
        this.orgSize = orgSize;
        this.orgColor = orgColor;
        this.spawnPoint = spawnPoint;
        this.spawnVelocity = spawnVelocity;
        this.popSize = 0;
        this.population = [];
        this.addOrganisms(initialPopSize);
    }
    addOrganisms(count) {
        for (let i = 0; i < count; i++) {
            this.popSize++;
            const orgStats =
            {
                type: this.type,
                id: this.type + "-" + this.popSize,
                pos: this.spawnPoint,
                velocity: this.spawnVelocity,
                size: this.orgSize,
                color: this.orgColor
            }
            this.population.push(
                new Organism(orgStats)
            );
        }
    }
    updatePopulation(newPopulation) {
        this.population = newPopulation;
        return this;
    }
    update(state, time) {
        this.population = this.population.map(organism => {
            return organism.update(state, time);
        });
        //this.population = [];
        //newPopulation.forEach(newPop => {
        //    this.population.push(newPop)
        //});
        //this.population = newPopulation;
        return this;
    }
}


class State {
    constructor(display, organismGroups) {
        this.display = display;
        this.organismGroups = organismGroups;
    }
    update(time) {
        let organismGroups = this.organismGroups.map(orgGroup => {
            return orgGroup.update(this, time);
        });
        return new State(this.display, organismGroups);
    }
}

const runAnimation = (animation) => {
    let lastTime = null;
    const frame = (time) => {
        if (lastTime != null) {
            const timeStep = Math.min(100, time - lastTime) / 1000;

            if (animation(timeStep) === false) {
                return;
            }
        }
        lastTime = time;
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}


const simCanvasConf = {
    id: "simulation-canvas",
    width: 1000,
    height: 1000,


};

const infoCanvasConf = {
    id: "information-canvas",
    width: 500,
    height: 500,

};

const drawComponent = new DrawComponent(simCanvasConf, infoCanvasConf);

let organismGourp_Insects = new OrganismGroup("insect", 3, 0.1, 0.1, 0.1, 10, "black", new Vector(100, 100), new Vector(2, 2));
let organismGroups = [organismGourp_Insects];

let state = new State(drawComponent, organismGroups);
runAnimation(time => {
    state = state.update(time);
    drawComponent.sync(state);
})
//drawComponent.drawOrganism(ant01);