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
            this.hunger = 50;
            this.hydration = 100;
            this.matingInterval = 200;
            this.age = 0;
            this.stage = "r";
            this.homePos = new Vector(orgNewPos.x, orgNewPos.y);
            this.huntPos = orgConf.huntPos;
            this.pos = orgNewPos;
            let rndStarVel = getRandomPointOnCircle(this.size, this.pos);
            this.velocity = new Vector(0, 0);
            this.goalPos = null;
            this.path = [];
        }
    }
    setPath(path) {
        this.path = [...path];
    }

    setGoalPos(newGoalPos) {

        if (this.stage != "h") {
            let loopCount = 0;
            let radius = 1;
            newGoalPos = getRandomPointInsideCircle(radius, newGoalPos);
            while (SIM_MAP.isTileDeepWater(newGoalPos)) {
                newGoalPos = getRandomPointInsideCircle(radius, newGoalPos);
                loopCount++;
                if (loopCount > 1000000) {
                    radius += 1;
                    loopCount = 0;
                    if (radius > 30) {
                        newGoalPos = this.pos;
                    }
                }
            }
        }
        this.goalPos = new Vector(newGoalPos.x, newGoalPos.y);
    }
    moveToSpawnPoint() {
        this.goalPos = this.homePos;
    }
    updatePosition(state) {
        if (this.type !== "plant") {
            if (this.stage == "x") {
                this.velocity = new Vector(0, 0);
            } else {
                if (this.goalPos != null) {
                    if (this.pos.equals(this.goalPos)) {

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
        }
        return this;

    }
    makeMoveToGoal() {
        let maxVel = this.maxVelocity * (1 - SIM_MAP.terrainPenalty(this.pos));

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
        let newGoal = this.pos.add(this.velocity);
        newGoal = getRandomPointOnCircle(30, newGoal);
        this.setGoalPos(newGoal);
    }
    getRating() {
        return this.maxVelocity * 15 + this.size * 10 + this.detectRadius / 100;
    }
    canBeEatenDistance(org2) {
        let canBeEaten = org2.canEat(this);
        if (canBeEaten) {
            return {
                canBeEaten: true,
                d: Math.sqrt(
                    Math.pow(this.pos.x - org2.pos.x, 2) + Math.pow(this.pos.y - org2.pos.y, 2)
                )
            };
        }
        return {
            canBeEaten: false,
            d: -1
        };
    }
    canEatDistance(org2) {
        let canEat = this.canEat(org2);
        if (canEat) {
            return {
                canEat: true,
                d: Math.sqrt(
                    Math.pow(this.pos.x - org2.pos.x, 2) + Math.pow(this.pos.y - org2.pos.y, 2)
                )
            };
        }
        return {
            canEat: false,
            d: -1
        };
    }
    canEat(org2) {
        if (this.eatingSize >= org2.size) {
            return true;
        } else {
            return false;
        }
    }
    canMateRating(org2) {
        let canMate = this.canMate(org2);
        if (canMate) {
            return {
                canMate: true,
                rating: org2.getRating()
            };
        }
        return {
            canMate: false,
            rating: -1
        };
    }
    canMate(org02) {
        if (org02.gender !== this.gender && org02.matingInterval < 40) {
            org02.matingInterval = 0;
            return true;
        } else {
            return false;
        }
    }
    distanceTo(org2) {
        return Math.sqrt(
            Math.pow(this.pos.x - org2.pos.x, 2) + Math.pow(this.pos.y - org2.pos.y, 2)
        );
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
        this.mutationChance = conf.mutationChance;
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
        let spawnPos;
        let huntPos = null;
        let orgConf = {};
        let loopCount = 0;
        for (let i = 0; i < initialPopSize; i++) {
            orgId = this.type + "-" + this.popId;
            maxVelocity = randomNumberRange(this.maxVelocity * 0.65, this.maxVelocity);
            size = randomNumberRange(this.size * 0.65, this.size);
            detectRadius = randomNumberRange(this.detectRadius * 0.65, this.detectRadius);

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
                gender: gender,
                huntPos: huntPos
            }

            this.population.push(new Organism(spawnPos, orgConf));
            this.popId++;
            this.popSize++;
        }
    }
    spawnChild(org01, org02) {

        let avgMaxVel = (org01.maxVelocity + org02.maxVelocity) / 2;
        let avgSize = (org01.size + org02.size) / 2;
        let avgDetRad = (org01.detectRadius + org02.detectRadius) / 2;

        let orgId = this.type + "-" + this.popId;
        let maxVelocity = randomNumberRange(avgMaxVel * 0.9, avgMaxVel + avgMaxVel * 0.2);
        if (Math.random() * 100 < this.mutationChance) {
            maxVelocity = randomNumberRange(maxVelocity * 0.9, maxVelocity + maxVelocity * 0.4);
        }
        let size = randomNumberRange(avgSize * 0.9, avgSize + avgSize * 0.2);
        if (Math.random() * 100 < this.mutationChance) {
            size = randomNumberRange(size * 0.9, size + size * 0.4);
        }
        let detectRadius = randomNumberRange(avgDetRad * 0.9, avgDetRad + avgDetRad * 0.2);
        if (Math.random() * 100 < this.mutationChance) {
            detectRadius = randomNumberRange(detectRadius * 0.9, detectRadius + detectRadius * 0.4);
        }

        let gender = null;
        if (Math.random() > 0.5) {
            gender = "m";
        } else {
            gender = "f"
        }

        let orgConf = {
            id: orgId,
            type: this.type,
            maxVelocity: maxVelocity,
            size: size,
            detectRadius: detectRadius,
            gender: gender,
        }

        let spawnPos = getRandomPointInsideCircle(5, org01.pos)
        let newOrg = new Organism(spawnPos, orgConf);
        console.log(newOrg);
        this.population.push(newOrg);
        this.popId++;
        this.popSize++;
    }
    changeConfiguration(newConf) {
        this.name = newConf.name;
        this.type = newConf.type;
        this.color = newConf.color;
        this.maxVelocity = newConf.maxVelocity;
        this.size = newConf.size;
        this.detectRadius = newConf.detectRadius;
        this.mutationChance = newConf.mutationChance;
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
    removeAll() {
        this.population = [];
        this.popSize = 0;
    }
    addDayToAge() {
        this.population.forEach(org => {
            org.age++;
        });
    }
    updateNeeds() {
        this.population.forEach(org => {
            org.hunger -= (1 + org.size / 100);
            org.hydration -= (1 + org.maxVelocity / 100);
            org.matingInterval -= 1;

            if (org.stage == "r") {
                if (org.hunger < 0) {
                    //org.stage = "h";
                    if (org.hunger < -300) {
                        this.removeById(org.id);
                    }
                }
                if (org.hydration < 0) {
                    //org.stage = "t";
                    if (org.hydration < -300) {
                        this.removeById(org.id);
                    }
                }
                if (org.matingInterval < 0) {
                    //org.stage = "m";
                }
            }
            if (org.id == "bird-1") {
                console.log(org.stage);
                console.log(org.hunger, org.hydration, org.matingInterval);
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