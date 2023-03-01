class DrawComponent {
    constructor(canvasID, width, height) {
        this.canvas = document.getElementById(canvasID);
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
    }
    drawBoard() {
        console.log("TODO - drawBoard")
    }
    clearDisplay() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
        this.ctx.beginPath();
        this.ctx.arc(organism.pos.x, organism.pos.y, organism.size, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fillStyle = organism.color;
        this.ctx.fill();
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
        if (this.pos.x >= state.display.canvas.width - 30 || this.pos.x <= 30) {
            this.velocity = new Vector(this.velocity.x * (-1), this.velocity.y)
            rndMove = false;
        }
        if (this.pos.y >= state.display.canvas.height - 30 || this.pos.y <= 30) {
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

const drawComponent = new DrawComponent("game-canvas", 1000, 1000);

const ant01_conf = {
    type: 'insect',
    pos: new Vector(20, 20),
    velocity: new Vector(2, 2),
    size: 10,
    color: "black"
}
const ant01 = new Organism(ant01_conf);
let organisms = [ant01];

let organismGourp_Insects = new OrganismGroup("insect", 3, 0.1, 0.1, 0.1, 10, "black", new Vector(100, 100), new Vector(2, 2));
let organismGroups = [organismGourp_Insects];

let state = new State(drawComponent, organismGroups);
runAnimation(time => {
    state = state.update(time);
    drawComponent.sync(state);
})
//drawComponent.drawOrganism(ant01);