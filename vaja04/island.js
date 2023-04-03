class Organism {
    constructor(orgNewPos, orgConf = null) {
        if (orgConf == null) {
            Object.assign(this, orgNewPos);
        } else {
            this.id = orgConf.id;
            this.type = orgConf.type;
            this.maxVelocity = orgConf.maxVelocity;
            this.size = orgConf.size;
            this.eatingSize = orgConf.size * 0.8;
            this.detectRadius = orgConf.detectRadius;
            this.gender = orgConf.gender;
            this.baseEnergy = orgConf.baseEnergy;
            this.trueEnergy = this.baseEnergy;
            this.hunger = 100;
            this.hydration = 100;
            this.matingInterval = 100;
            this.stage = "r";
            this.homePos = new Vector(orgNewPos.x, orgNewPos.y);
            this.huntPos = orgConf.huntPos;
            this.pos = orgNewPos;
            this.velocity = new Vector(0, 0);
            this.goalPos = null;
            this.path = [];
        }
    }
    setPath(path) {
        this.path = [...path];
    }

    setGoalPos(newGoalPos) {
        this.goalPos = new Vector(newGoalPos.x, newGoalPos.y);
    }
    moveToSpawnPoint() {
        this.goalPos = this.homePos;
    }
    updatePosition(state) {
        if (this.type !== "plant") {
            if (this.goalPos != null) {
                if (this.pos.equals(this.goalPos)) {
                    if (this.stage == "h") {
                        this.hunger = 100;
                    } else if (this.stage == "d") {
                        this.hydration = 100;
                    } else if (this.stage == "m") {
                        this.matingInterval = 100;
                    }

                    if (this.path.length > 0) {
                        this.setGoalPos({ x: this.path[0].x * 17, y: this.path[0].y * 17 });
                        this.path.shift();
                    } else {
                        this.goalPos = null;
                    }
                }
            }
            if (this.goalPos == null) {
                this.makeRandomMove();
            } else {
                this.makeMoveToGoal();
            }

            let newPos = this.pos.add(this.velocity);
            return new Organism({
                ...this,
                pos: newPos
            });
        }
        return this;

    }
    makeMoveToGoal() {
        let maxVel = this.maxVelocity;
        if (this.trueEnergy < 1) {
            maxVel = maxVel / 2;
        }

        let x = (this.goalPos.x - this.pos.x) / maxVel;
        if (x >= 1) {
            x = maxVel;
        } else if (x <= -1) {
            x = -maxVel;
        } else {
            x = this.goalPos.x - this.pos.x;
        }
        let y = (this.goalPos.y - this.pos.y) / maxVel;
        if (y >= 1) {
            y = maxVel;
        } else if (y <= -1) {
            y = -maxVel;
        } else {
            y = this.goalPos.y - this.pos.y;
        }
        this.velocity = new Vector(x, y);
    }
    makeRandomMove() {
        let count = 0;
        let newGoal = {};
        let badMove = true;
        while (badMove && count < 100) {
            count++;
            let theta = Math.random() * 2 * Math.PI;
            let maxVel = this.maxVelocity;
            if (this.trueEnergy < 1) {
                maxVel = maxVel / 2;
            }
            let vel = new Vector(maxVel, maxVel);
            let center = this.pos.add(vel);

            newGoal.x = center.x + 30 * Math.cos(theta);
            newGoal.y = center.y + 30 * Math.sin(theta);
            if (!SIM_MAP.isTileDeepWater(newGoal)) {
                badMove = false;
            }
        }
        this.setGoalPos(newGoal);
    }
    getRating() {
        return this.maxVelocity * 15 + this.size * 10 + this.detectRadius;
    }
    interaction(org2) {
        let d = Math.sqrt(
            Math.pow(this.pos.x - org2.pos.x, 2) + Math.pow(this.pos.y - org2.pos.y, 2)
        );
        let canEatOrg2 = null;
        if (this.stage == "h") {
            canEatOrg2 = this.canEat(org2);
        }

        let rating = null;
        if (this.stage == "m") {
            rating = org2.getRating();
        }

        return {
            d: d,
            canBeEaten: canEatOrg2,
            rating: rating
        };

        //let canBeEaten = org2.canEat(this);
        if (d <= this.orgSize && canEatOrg2) {
            this.eatenFood++;
            return 1;
        } else if (d <= this.detectRadius) {
            if (canEatOrg2) {
                return 2;
            } else if (canBeEaten) {
                return 3;
            }
        } else {
            return 4;
        }
    }
    canEat(org2) {
        if (this.eatingSize >= org2.orgSize) {
            return true;
        } else {
            return false;
        }
    }
}

class OrganismGroup {
    constructor(id, conf) {
        this.id = id;
        this.name = conf.name;
        this.type = conf.type;
        this.color = conf.color;
        this.maxVelocity = conf.maxVelocity;
        this.size = conf.size;
        this.detectRadius = conf.detectRadius;
        this.baseEnergy = conf.baseEnergy;
        this.diet = conf.diet;
        this.initialPopSize = conf.initialPopSize;
        this.homePos = conf.homePos;
        this.homeRadius = conf.homeRadius;
        this.huntingPos = conf.huntingPos;
        this.huntingRadius = conf.huntingRadius;
        this.population = [];
        this.popSize = 0;
        this.popId = 0;
        if (this.initialPopSize != 0) {
            this.createInitialPopulation(this.initialPopSize);
        }
    }
    createInitialPopulation(initialPopSize) {
        let orgId;
        let maxVelocity;
        let size;
        let detectRadius;
        let gender;
        let baseEnergy;
        let spawnPos;
        let huntPos = null;
        let orgConf = {};
        let loopCount = 0;
        for (let i = 0; i < initialPopSize; i++) {
            orgId = this.type + "-" + this.popId;
            maxVelocity = randomNumberRange(this.maxVelocity * 0.9, this.maxVelocity);
            size = randomNumberRange(this.size * 0.9, this.size);
            detectRadius = randomNumberRange(this.detectRadius * 0.9, this.detectRadius);
            baseEnergy = randomNumberRange(this.baseEnergy * 0.9, this.baseEnergy);

            loopCount = 0;
            spawnPos = getRandomPointInsideCircle(this.homeRadius, this.homePos);
            while (SIM_MAP.isTileDeepWater(spawnPos) && loopCount < 10000) {
                spawnPos = getRandomPointInsideCircle(this.homeRadius, this.homePos);
                loopCount++;
            }
            if (loopCount == 10000) {
                continue;
            }
            if (this.type != "plant") {
                loopCount = 0;
                huntPos = getRandomPointInsideCircle(this.huntingRadius, this.huntingPos);
                while (SIM_MAP.isTileDeepWater(huntPos) && loopCount < 10000) {
                    huntPos = getRandomPointInsideCircle(this.huntingRadius, this.huntingPos);
                    loopCount++;
                }
                if (loopCount == 10000) {
                    continue;
                }
            }
            if (Math.random() > 0.5) {
                gender = "m";
            } else {
                gender = "f"
            }

            orgConf = {
                id: orgId,
                type: this.type,
                maxVelocity: maxVelocity,
                size: size,
                detectRadius: detectRadius,
                baseEnergy: baseEnergy,
                gender: gender,
                huntPos: huntPos
            }

            this.population.push(new Organism(spawnPos, orgConf));
            this.popId++;
            this.popSize++;
        }
    }
    spawnChild(org01, org02) {

    }
    changeConfiguration(newConf) {
        this.name = newConf.name;
        this.type = newConf.type;
        this.color = newConf.color;
        this.maxVelocity = newConf.maxVelocity;
        this.size = newConf.size;
        this.detectRadius = newConf.detectRadius;
        this.baseEnergy = newConf.baseEnergy;
        this.diet = newConf.diet;
        this.initialPopSize = newConf.initialPopSize;
        this.homePos = newConf.homePos;
        this.huntingPos = newConf.huntingPos;
        this.population = [];
        this.popSize = 0;
        this.popId = 0;
        if (this.initialPopSize != 0) {
            this.createInitialPopulation(this.initialPopSize);
        }
    }
    removeById(id) {
        this.population = this.population.filter(org => org.id != id);
        this.popSize--;
    }
    updateNeeds() {
        this.population.forEach(org => {
            if (org.stage == "h") {
                this.trueEnergy -= this.maxVelocity * 3 + this.size * 2 + this.detectRadius;
                this.hunger -= 0.3;
                this.hydration -= 0.3;
                this.matingInterval -= 0.3;

            } else if (org.stage == "d") {
                this.trueEnergy -= this.maxVelocity * 3 + this.size * 2 + this.detectRadius;
                this.hunger -= 0.2;
                this.hydration -= 0.2;
                this.matingInterval -= 0.2;

            } else if (org.stage == "r") {
                if (this.trueEnergy != this.baseEnergy) {
                    this.trueEnergy += this.baseEnergy * 0.05;
                }
                this.hunger -= 0.1;
                this.hydration -= 0.1;
                this.matingInterval -= 0.1;

            } else if (org.stage == "m") {
                this.trueEnergy -= this.maxVelocity * 3 + this.size * 2 + this.detectRadius;
                this.hunger -= 0.1;
                this.hydration -= 0.1;
                this.matingInterval -= 0.1;
            }
            if (this.trueEnergy < 0) {
                org.stage = "r";
            }
            if (this.hunger < 0) {
                org.stage = "h";
            }
            if (this.hydration < 0) {
                org.stage = "d";
            }
            if (this.matingInterval < 0) {
                org.stage = "m";
            }
        });
    }
    updatePosition(state) {
        this.population = this.population.map(organism => {
            return organism.updatePosition(state, this.outsidePath);
        });
        return this;
    }
    isAlive(org) {
        this.population.forEach(o => {
            if (o.id == org.id) {
                return true;
            }
        });
        return false;
    }
    spawnChild(org, count) {
        let homePos = null;
        let orgSize = org.orgSize + Math.random() * 1.5 - 0.6;
        let maxVelocity = org.maxVelocity + Math.random() * 1.1 - 0.4;
        let detectRadius = org.detectRadius + Math.random() * 2 - 0.8;
        let baseEnergy = org.baseEnergy + Math.random() * 1.5 - 0.5;
        if (orgSize < 0) {
            orgSize = 0.2;
        }
        if (maxVelocity < 0) {
            maxVelocity = 0.2;
        }
        if (detectRadius < 0) {
            detectRadius = 0.2;
        }

        this.popSize += count;

        for (let i = 0; i < count; i++) {
            this.popId++;
            homePos = getRandomPointOnCircle(this.conf.feedingZoneRadius, this.conf.feedingPos);
            const orgStats =
            {
                id: this.conf.type + "-" + this.popId,
                type: this.conf.type,
                orgColor: this.conf.orgColor,
                orgSize: orgSize,
                eatingSize: orgSize * 0.8,
                maxVelocity: maxVelocity,
                detectRadius: detectRadius,
                baseEnergy: baseEnergy,
                trueEnergy: baseEnergy,
                stage: "resting",
                diet: this.conf.diet,
                eatenFood: 0,
                velocity: org.velocity,
                homePos: homePos,
                pos: org.pos,
                goalPos: homePos
            }
            this.population.push(
                new Organism(orgStats)
            );
        }
    }
}

class DateTimeTracker {
    constructor(startDate = { year: 0, month: 0, day: 0, hour: 0 }) {
        this.startDate = startDate;
        this.date = startDate;
        this.interval = null;
        this.run = true;
        this.timeSpeed = 100;
    }
    setTimeSpeed(timeSpeed) {
        this.timeSpeed = 70 - timeSpeed * 10;
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (this.run) {
                this.addHours(0.2);
            }
        }, this.timeSpeed);
    }
    resetDate() {
        if (this.interval !== null) {
            clearInterval(this.interval);
        }
        this.date = { year: 0, month: 0, day: 0, hour: 0 };
        this.interval = setInterval(() => {
            if (this.run) {
                this.addHours(0.2);
            }
        }, this.timeSpeed);
    }
    toggleTimePassage(run) {
        this.run = run;
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
    addOrganismGroup(orgGroupConf, initialPopSize) {
        let typeCount = 0;
        this.organismGroups.forEach(orgGroup => {
            if (orgGroup.type == orgGroupConf.type) {
                typeCount++;
            }
        });
        const orgGroupId = orgGroupConf.type + "-" + typeCount;
        const newOrgGroup = new OrganismGroup(orgGroupId, orgGroupConf, initialPopSize);
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
    changeTimePassingSpeed(timeSpeed) {
        this.dateTime.setTimeSpeed(timeSpeed);
    }
}