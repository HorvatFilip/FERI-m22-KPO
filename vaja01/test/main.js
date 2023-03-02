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
        this.infoPoints = {};
    }
    drawBoard() {
        console.log("TODO - drawBoard");
    }
    clearSimCanvas() {
        this.simCtx.fillStyle = "rgb(50, 60, 70)";
        this.simCtx.fillRect(0, 0, this.simCanvas.width, this.simCanvas.height);
    }
    clearChartCanvas() {
        this.infoCtx.fillStyle = "rgb(50, 60, 70)";
        this.infoCtx.fillRect(0, 0, this.infoCanvas.width, this.infoCanvas.height);
    }

    sync(state) {
        this.clearSimCanvas();
        this.drawAllOrganisms(state.organismGroups);
        this.updateChartPoints(state.organismGroups);
        if (Math.floor(state.timePassed) % 1 == 0) {
            this.clearChartCanvas();
            this.drawChart();
        }
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
    updateChartPoints(organismGroups) {
        organismGroups.forEach(orgGroup => {
            if (this.infoPoints[orgGroup.type] === undefined) {
                this.infoPoints[orgGroup.type] = [orgGroup.popSize];
            } else {
                this.infoPoints[orgGroup.type].push(orgGroup.popSize);
                if (this.infoPoints[orgGroup.type].length > this.infoCanvas.width) {
                    this.infoPoints[orgGroup.type].shift();
                }
            }
        });
    }
    drawChart() {
        let organismTypes = Object.keys(this.infoPoints);
        organismTypes.forEach(orgType => {
            if (orgType == "insect") {
                this.infoCtx.strokeStyle = "green";
            } else if (orgType == "bird") {
                this.infoCtx.strokeStyle = "blue";
            } else if (orgType == "cat") {
                this.infoCtx.strokeStyle = "black";
            }

            let timeInterval = 0;
            this.infoCtx.beginPath();
            for (let i = 0; i < this.infoPoints[orgType].length - 1; i++) {
                this.infoCtx.moveTo(timeInterval, this.infoCanvas.height - this.infoPoints[orgType][i]);
                timeInterval += 1;
                this.infoCtx.lineTo(timeInterval, this.infoCanvas.height - this.infoPoints[orgType][i + 1]);
            }
            this.infoCtx.stroke();
        });
        return;
        if (this.infoPoints.length != 1) {
            if (this.infoPoints.length > 500) {
                this.infoPoints.shift();
            }

            let timeInterval = 0;

            console.log(this.infoPoints);
            for (let i = 0; i < this.infoPoints.length - 1; i++) {
                for (let j = 0; j < this.infoPoints[i].length; j++) {
                    this.infoCtx.beginPath();

                    let orgType = Object.keys(this.infoPoints[i][j])[0];
                    if (orgType == "insect") {
                        this.infoCtx.strokeStyle = "green";
                    } else if (orgType == "bird") {
                        this.infoCtx.strokeStyle = "blue";
                    } else if (orgType == "cat") {
                        this.infoCtx.strokeStyle = "black";
                    }
                    console.log(this.infoCanvas.height - Object.values(this.infoPoints[i][j])[0]);
                    console.log(this.infoCanvas.height - Object.values(this.infoPoints[i + 1][j])[0]);


                    this.infoCtx.moveTo(timeInterval, this.infoCanvas.height - Object.values(this.infoPoints[i][j])[0]);
                    timeInterval += 1;
                    this.infoCtx.lineTo(timeInterval, this.infoCanvas.height - Object.values(this.infoPoints[i + 1][j])[0]);
                    this.infoCtx.stroke();
                }
            }
        }
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
    updatePosition(state, time) {
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
    removeOrganisms(count) {
        this.population.splice(0, count);
        this.popSize -= count;
    }
    updatePopulation() {
        // let delta_rp = (this.rp - this.sp) * this.popSize;
        // let delta_sp = (this.rp - this.sp - this.k * this.popSize) * this.popSize;
        // this.rp += delta_rp % 1;
        // this.sp += delta_sp % 1;
        // this.rp = Math.max(delta_rp % 1, 0);
        // this.sp = Math.max(delta_sp % 1, 0);
        // console.log("delta_rp: " + delta_rp)
        // console.log("delta_sp: " + delta_sp)
        // console.log("rp: " + this.rp)
        // console.log("sp: " + this.sp)

        let populationChange = 0;
        for (let i = 0; i < this.popSize; i++) {
            if (Math.random() < this.rp) {
                populationChange++;
            }
            let deathChance = Math.random();
            if (deathChance < this.sp || deathChance < (this.k * this.popSize)) {
                populationChange--;
            }
        }
        if (populationChange > 0) {
            this.addOrganisms(populationChange);
        }
        else {
            this.removeOrganisms(Math.abs(populationChange));
        }
    }
    updatePosition(state, time) {
        this.population = this.population.map(organism => {
            return organism.updatePosition(state, time);
        });
        return this;
    }
}


class State {
    constructor(display, organismGroups, timePassed) {
        this.display = display;
        this.organismGroups = organismGroups;
        this.timePassed = timePassed;
    }
    update(time) {
        this.timePassed += 0.1;

        let organismGroups = this.organismGroups.map(orgGroup => {
            if (Math.floor(this.timePassed) % 5 == 0) {
                orgGroup.updatePopulation();
            }
            return orgGroup.updatePosition(this, time);
        });
        return new State(this.display, organismGroups, this.timePassed);
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
    height: 1000
};

const infoCanvasConf = {
    id: "information-canvas",
    width: 500,
    height: 500
};

const drawComponent = new DrawComponent(simCanvasConf, infoCanvasConf);

let spawnVelocity = new Vector(Math.random() * 4, Math.random() * 4);
let spawnPoint = new Vector(Math.random() * 900 + 100, Math.random() * 900 + 100);
let organismGroup_Insects = new OrganismGroup("insect", 10, 0.2, 0.1, 0.0005, 2, "green", spawnPoint, spawnVelocity);

spawnVelocity = new Vector(Math.random() * 4, Math.random() * 4);
spawnPoint = new Vector(Math.random() * 900 + 100, Math.random() * 900 + 100);
let organismGroup_Birds = new OrganismGroup("bird", 8, 0.1, 0.04, 0.0007, 4, "blue", spawnPoint, spawnVelocity);

spawnVelocity = new Vector(Math.random() * 4, Math.random() * 4);
spawnPoint = new Vector(Math.random() * 900 + 100, Math.random() * 900 + 100);
let organismGroup_Cats = new OrganismGroup("cat", 2, 0.05, 0.02, 0.001, 8, "black", spawnPoint, spawnVelocity);

let organismGroups = [organismGroup_Insects, organismGroup_Birds, organismGroup_Cats];

let state = new State(drawComponent, organismGroups, 0);

let run = true;
document.getElementById("toggle-sim-btn").addEventListener("click", () => {
    run = !run;
});

runAnimation(time => {
    if (run) {
        state = state.update(time);
        drawComponent.sync(state);
    }
})
//drawComponent.drawOrganism(ant01);