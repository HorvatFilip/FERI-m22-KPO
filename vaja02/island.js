class Organism {
    constructor(orgNewPos) {
        Object.assign(this, orgNewPos);
    }
    setGoalPos(newGoalPos) {
        this.goalPos = new Vector(newGoalPos.x, newGoalPos.y);
    }
    moveToSpawnPoint() {
        this.goalPos = this.homePos;
    }
    updatePosition(state) {
        let moveScenario = 0;
        if (this.goalPos !== null && this.pos.equals(this.goalPos)) {
            this.goalPos = null;
            moveScenario = 1;
        } else {
            moveScenario = 2;
        }

        if (this.pos.x >= state.display.simCanvas.width - 30 || this.pos.x <= 30) {
            this.velocity = new Vector(this.velocity.x * (-1), this.velocity.y)
            moveScenario = 0;
        }
        if (this.pos.y >= state.display.simCanvas.height - 30 || this.pos.y <= 30) {
            this.velocity = new Vector(this.velocity.x, this.velocity.y * (-1));
            moveScenario = 0;
        }
        if (this.goalPos === null) {
            this.makeRandomMove();
        } else if (moveScenario == 2) {
            this.makeMoveToGoal();
        }
        return new Organism({
            ...this,
            pos: this.pos.add(this.velocity)
        });
    }
    makeMoveToGoal() {
        let x = (this.goalPos.x - this.pos.x) / this.maxVelocity;
        if (x >= 1) {
            x = this.maxVelocity;
        } else if (x <= -1) {
            x = -this.maxVelocity;
        } else {
            x = this.goalPos.x - this.pos.x;
        }
        let y = (this.goalPos.y - this.pos.y) / this.maxVelocity;
        if (y >= 1) {
            y = this.maxVelocity;
        } else if (y <= -1) {
            y = -this.maxVelocity;
        } else {
            y = this.goalPos.y - this.pos.y;
        }
        this.velocity = new Vector(x, y);
    }
    makeRandomMove() {
        let changeVelocity = Math.floor(Math.random() * 9);
        switch (changeVelocity) {
            case 0:
                this.velocity = new Vector(0, 0);
                break;
            case 1:
                this.velocity = new Vector(Math.random() * 3, 0);
                break;
            case 2:
                this.velocity = new Vector(0, Math.random() * 3);
                break;
            case 3:
                this.velocity = new Vector(Math.random() * -3, 0);
                break;
            case 4:
                this.velocity = new Vector(0, Math.random() * -3);
                break;
            case 5:
                this.velocity = new Vector(Math.random() * 3, Math.random() * 3);
                break;
            case 6:
                this.velocity = new Vector(Math.random() * -3, Math.random() * 3);
                break;
            case 7:
                this.velocity = new Vector(Math.random() * 3, Math.random() * -3);
                break;
            case 8:
                this.velocity = new Vector(Math.random() * -3, Math.random() * -3);
                break;
        }
    }
    inRangeOfInteraction(org2) {
        let d = Math.sqrt(
            Math.pow(this.pos.x - org2.pos.x, 2) + Math.pow(this.pos.y - org2.pos.y, 2)
        );
        if (d <= this.orgSize) {
            return 1;
        } else if (d <= this.detectRadius) {
            return 2;
        } else {
            return 3;
        }
    }
}

class OrganismGroup {
    constructor(id, conf) {
        /*
        this.id = conf.id;
        this.type = conf.type;
        this.orgColor = conf.orgColor;
        this.orgSize = conf.orgSize;
        this.orgMaxVelocity = conf.orgMaxVelocity;
        this.orgViewRange = conf.orgViewRange;
        this.diet = conf.diet;
        this.homePos = conf.homePos;
        this.feedingPos = conf.feedingPos;
        this.population = [];
        this.popSize = 0;
        this.initialPopSize = conf.initialPopSize;
        this.addOrganisms(this.initialPopSize);
        */
        this.id = id;
        this.conf = conf;
        this.population = [];
        this.popSize = 0;
        this.addOrganisms(this.conf.initialPopSize);
    }
    changeConfiguration(newConf) {
        this.conf = Object.assign(this.conf, newConf);
        this.population = [];
        this.addOrganisms(this.conf.initialPopSize);
    }
    getRandomPointOnCircle(R, center){
        let r = R * Math.sqrt(Math.random());
        let theta = Math.random() * 2 * Math.PI;
        let x = center.x + r * Math.cos(theta);
        let y = center.y + r * Math.sin(theta);
        return new Vector(x, y);
    }
    addOrganisms(count) {
        for (let i = 0; i < count; i++) {
            this.popSize++;
            let homePos = this.getRandomPointOnCircle(40, this.conf.homePos);
            const orgStats =
            {
                id: this.conf.type + "-" + this.popSize,
                type: this.conf.type,
                orgColor: this.conf.orgColor,
                orgSize: this.conf.orgSize,
                maxVelocity: this.conf.orgMaxVelocity,
                detectRadius: this.conf.detectRadius,
                diet: this.conf.diet,
                velocity: new Vector(0, 0),
                homePos: homePos,
                pos: homePos,
                goalPos: null
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
    removeById(id) {
        this.population = this.population.filter(org => org.id != id);
    }
    updatePopulationCount() {

    }
    updatePosition(state) {
        this.population = this.population.map(organism => {
            return organism.updatePosition(state);
        });
        return this;
    }
    changeStage(stage) {
        if (stage == "feeding") {
            this.population.forEach(org => {
                let feedingPos = this.getRandomPointOnCircle(40, this.conf.feedingPos);
                org.setGoalPos(feedingPos);
            });
        } else if (stage == "resting") {
            this.population.forEach(org => {
                let homePos = this.getRandomPointOnCircle(40, this.conf.homePos);
                org.setGoalPos(homePos);
            });
        }
    }
}

class DateTimeTracker {
    constructor(startDate = { year: 0, month: 0, day: 0, hour: 0 }) {
        this.date = startDate;
        this.interval = setInterval(() => {
            this.addHours(0.1);
        }, 50);
    }
    addYears(count) {
        this.date["year"] += count;
    }
    getYears() {
        return this.date["year"];
    }
    addMonths(count) {
        this.date["month"] += count;
        this.fixOverflow();
    }
    getMonths() {
        return this.date["month"];
    }
    addDays(count) {
        this.date["day"] += count;
        this.fixOverflow();
    }
    getDays() {
        return this.date["day"];
    }
    addHours(count) {
        this.date["hour"] += count;
        this.fixOverflow();
    }
    getHours() {
        return this.date["hour"];
    }
    fixOverflow() {
        if (this.date["hour"] > 24) {
            this.date["day"]++;
            this.date["hour"] = this.date["hour"] - 24;
        }
        if (this.date["day"] > 30) {
            this.date["month"]++;
            this.date["day"] = this.date["day"] - 30;
        }
        if (this.date["month"] > 12) {
            this.date["year"]++;
            this.date["month"] = this.date["month"] - 12;
        }
    }
    getCurrentDateTime() {
        return { year: this.year, month: this.month, day: this.day, hour: this.day };
    }
}

class EcoSystem {
    constructor(id, type, dateTimeTracker) {
        this.id = id;
        this.type = type;
        this.dateTime = dateTimeTracker;
        this.organismGroups = [];
    }
    addOrganismGroup(orgGroupConf) {
        let typeCount = 0;
        this.organismGroups.forEach(orgGroup => {
            if (orgGroup.conf.type == orgGroupConf.type) {
                typeCount++;
            }
        });
        const orgGroupId = orgGroupConf.type + "-" + typeCount;
        const newOrgGroup = new OrganismGroup(orgGroupId, orgGroupConf);
        this.organismGroups.push(newOrgGroup);
    }
    changeOrganismGroupConfiguration(id, newConfig) {
        for (let i = 0; i < this.organismGroups.length; i++) {
            if (this.organismGroups[i].id == id) {
                this.organismGroups[i].changeConfiguration(newConfig);
                break;
            }
        }
    }
    removeOrganismGroupById(id) {
        this.organismGroups = this.organismGroups.filter(orgGroup => orgGroup.id != id);
    }

}

