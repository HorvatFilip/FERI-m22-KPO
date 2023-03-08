class Organism {
    constructor(orgNewPos) {
        Object.assign(this, orgNewPos);
    }
    addGoalPos(newGoalPos) {
        this.goalPos = new Vector(newGoalPos.x, newGoalPos.y);
    }
    moveToSpawnPoint() {
        this.goalPos = this.homePos;
    }
    updatePosition(state) {
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
            this.makeRandomMove();
        }
        return new Organism({
            ...this,
            pos: this.pos.add(this.velocity)
        });
    }
    makeMoveToGoal() {
        if (this.pos.x != this.goalPos.x) {

        }
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
    addOrganisms(count) {
        for (let i = 0; i < count; i++) {
            this.popSize++;
            const orgStats =
            {
                id: this.conf.type + "-" + this.popSize,
                type: this.conf.type,
                orgColor: this.conf.orgColor,
                orgSize: this.conf.orgSize,
                maxVelocity: this.conf.orgMaxVelocity,
                viewRange: this.conf.viewRange,
                diet: this.conf.diet,
                velocity: new Vector(0, 0),
                homePos: new Vector(this.conf.homePos.x, this.conf.homePos.y),
                pos: new Vector(this.conf.homePos.x, this.conf.homePos.y),
                goalPos: new Vector(this.conf.homePos.x, this.conf.homePos.y)
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
    updatePopulationCount() {

    }
    updatePosition(state) {
        this.population = this.population.map(organism => {
            return organism.updatePosition(state);
        });
        return this;
    }
}

class DateTimeTracker {
    constructor(startDate = { year: 0, month: 0, day: 0, hour: 0 }) {
        this.date = startDate;
        this.interval = setInterval(() => {
            this.addHours(1);
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
        this.organismGroups = this.organismGroups.organismGroups.filter(orgGroup => orgGroup.id != id);
    }

}

