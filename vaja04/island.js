class Organism {
    constructor(orgNewPos, orgConf = null) {
        if (orgConf == null) {
            Object.assign(this, orgNewPos);
        } else {
            this.id = orgConf.id;
            this.type = orgConf.type;
            this.maxVelocity = orgConf.maxVelocity;
            this.size = orgConf.size;
            this.detectRadius = orgConf.detectRadius;
            this.energyBase = orgConf.energyBase;
            this.gender = orgConf.gender;
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
    updateNeeds() {
        if (this.stage == "h") {
            this.trueEnergy -= 10 * this.orgSize - 10 * this.maxVelocity - this.detectRadius;
            this.hunger -= 1;
            this.hydration -= 1;
            this.matingInterval -= 0.5;

        } else if (this.stage == "d" || this.stage == "m") {
            this.trueEnergy = this.trueEnergy - (10 * this.orgSize - 10 * this.maxVelocity - this.detectRadius) / 2;
            this.hunger = this.hunger - 0.5;

        } else if (this.stage == "r") {
            this.hunger = this.hunger - 0.25;
            this.hydration -= 0.25;
            this.matingInterval -= 1;
        }

        if (this.trueEnergy < this.baseEnergy * 0.1) {
            this.stage = "r";
        }
        if (this.hunger < 50) {
            this.stage = "h";
        }
        if (this.hydration < 50) {
            this.stage = "d";
        }
        if (this.matingInterval < 10) {
            this.stage = "m";
        }
    }
    updatePosition(state) {
        if (this.type !== "plant") {
            if (this.pos.equals(this.homePos)) {

                console.log(this.homePos);
            } else if (this.pos.equals(this.huntPos)) {
                console.log("hunt");
            }
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
                console.log("random move")
            } else {
                this.makeMoveToGoal();
                console.log("move to goal")
            }

            let newPos = this.pos.add(this.velocity);
            return new Organism({
                ...this,
                pos: newPos
            });
            this.updateNeeds();
        }
        return this;

    }
    getNormalPoint(p, a, b) {
        let ap = p.subtract(a);
        let ab = b.subtract(a);
        ab = ab.normalize();
        ab = ab.multiply(ap.dotProduct(ab));
        return a.add(ab);
    }
    followPath(path) {
        let predict = this.velocity.get();
        predict = predict.normalize();
        predict = predict.multiply(25);
        let predictLoc = this.pos.add(predict);
        let bestDistance = 10000;
        let newTarget = null;
        for (let i = 0; i < path.length - 1; i++) {
            let a = path[i];
            let b = path[i + 1];
            let normalPoint = this.getNormalPoint(predictLoc, a, b);
            if (normalPoint.x < a.x || normalPoint.x > b.x) {
                normalPoint = b.get();
            }
            let distance = predictLoc.distance(normalPoint);
            if (distance < bestDistance) {
                bestDistance = distance;
                newTarget = normalPoint;
            }
        }
        this.setGoalPos(newTarget);
    }
    checkBounds(state) {
        let moveScenario = 1;
        if (this.pos.x >= state.display.simCanvas.width - 50 || this.pos.x <= 50) {
            this.velocity = new Vector(this.velocity.x * (-1), this.velocity.y)
            this.goalPos = null;
            moveScenario = 0;
        }
        if (this.pos.y >= state.display.simCanvas.height - 50 || this.pos.y <= 50) {
            this.velocity = new Vector(this.velocity.x, this.velocity.y * (-1));
            this.goalPos = null;
            moveScenario = 0;
        }
        return moveScenario;
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
    inRangeOfInteraction(org2) {
        let d = Math.sqrt(
            Math.pow(this.pos.x - org2.pos.x, 2) + Math.pow(this.pos.y - org2.pos.y, 2)
        );
        let canEatOrg2 = this.canEat(org2);
        let canBeEaten = org2.canEat(this);
        if (d <= this.orgSize && canEatOrg2) {
            this.eatenFood++;
            //if (this.eatenFood > 1) {
            //    this.setGoalPos(this.homePos);
            //}
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
        this.energyBase = conf.energyBase;
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
        let energyBase;
        let spawnPos;
        let huntPos = null;
        let orgConf = {};
        let loopCount = 0;
        for (let i = 0; i < initialPopSize; i++) {
            orgId = this.type + "-" + this.popId;
            maxVelocity = randomNumberRange(this.maxVelocity * 0.9, this.maxVelocity);
            size = randomNumberRange(this.size * 0.9, this.size);
            detectRadius = randomNumberRange(this.detectRadius * 0.9, this.detectRadius);
            energyBase = randomNumberRange(this.energyBase * 0.9, this.energyBase);

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
                energyBase: energyBase,
                gender: gender,
                huntPos: huntPos
            }

            this.population.push(new Organism(spawnPos, orgConf));
            this.popId++;
            this.popSize++;
        }
    }
    changeConfiguration(newConf) {
        this.name = newConf.name;
        this.type = newConf.type;
        this.color = newConf.color;
        this.maxVelocity = newConf.maxVelocity;
        this.size = newConf.size;
        this.detectRadius = newConf.detectRadius;
        this.energyBase = newConf.energyBase;
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
    addOrganisms(count) {
        let homePos;
        let vel;
        let rndSize;
        for (let i = 0; i < count; i++) {
            this.popSize++;
            this.popId++;
            if (this.conf.type == "plant") {
                homePos = getRandomPointInsideCircle(this.conf.feedingZoneRadius, this.conf.homePos);
            } else {
                homePos = getRandomPointOnCircle(this.conf.feedingZoneRadius, this.conf.feedingPos);
            }
            vel = new Vector(
                Math.random() * this.conf.orgMaxVelocity * 2 - this.conf.orgMaxVelocity,
                Math.random() * this.conf.orgMaxVelocity * 2 - this.conf.orgMaxVelocity
            )
            rndSize = this.conf.orgSize * 0.7;
            rndSize = Math.random() * (this.conf.orgSize - rndSize) + rndSize;
            const orgStats =
            {
                id: this.conf.type + "-" + this.popId,
                type: this.conf.type,
                orgColor: this.conf.orgColor,
                orgSize: rndSize,
                eatingSize: this.conf.orgSize * 0.8,
                maxVelocity: this.conf.orgMaxVelocity,
                detectRadius: this.conf.detectRadius,
                baseEnergy: this.conf.baseEnergy,
                trueEnergy: this.conf.baseEnergy,
                stage: "resting",
                diet: this.conf.diet,
                eatenFood: 0,
                velocity: vel,
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
        this.popSize--;
    }
    updatePosition(state) {
        this.population = this.population.map(organism => {
            return organism.updatePosition(state, this.outsidePath);
        });
        return this;
    }
    goHunting() {
        this.population.forEach(org => {
            org.goHunting();
        });
    }
    goHunting() {
        this.population.forEach(org => {
            org.goHunting();
        });
    }
    moveToFeedingZone(resetFood = false) {
        this.population.forEach(org => {
            if (resetFood) {
                org.eatenFood = 0;
                org.trueEnergy = org.baseEnergy;
                org.stage = "feeding";
                //let feedingPos = this.getRandomPointInsideCircle(this.conf.feedingZoneRadius, this.conf.feedingPos);
                //org.setGoalPos(feedingPos);
            } else if (org.eatenFood < 2) {
                //let feedingPos = this.getRandomPointInsideCircle(this.conf.feedingZoneRadius, this.conf.feedingPos);
                //org.setGoalPos(feedingPos);
            }
        });
    }
    changeStage(stage) {
        if (this.type != "plant") {
            if (stage == "feeding") {
                this.moveToFeedingZone(true);
            } else if (stage == "resting") {
                this.population.forEach(org => {
                    if (org.eatenFood < 1) {
                        this.removeById(org.id);
                    } else {
                        org.stage = "resting";
                        if (org.eatenFood > 1) {
                            if (this.type == "insect") {
                                this.spawnChild(org, 2);
                            } else {
                                this.spawnChild(org, 1);
                            }
                        }
                        //let homePos = this.getRandomPointOnCircle(this.conf.feedingZoneRadius, this.conf.feedingPos);
                        //org.setGoalPos(homePos);
                    }
                });
            }
        }
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
    respawn() {
        this.population = [];
        this.popSize = 0;
        this.addOrganisms(this.conf.initialPopSize);
        return this;
    }
    getChartValues() {
        let avgOrgSize = 0;
        let avgMaxVel = 0;
        let avgDetect = 0;
        this.population.forEach(org => {
            avgOrgSize += org.orgSize;
            avgMaxVel += org.maxVelocity;
            avgDetect += org.detectRadius;
        });
        return [this.popSize, avgOrgSize / this.popSize, avgMaxVel / this.popSize, avgDetect / this.popSize];
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