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
    updatePosition(state, path) {
        if (this.type !== "plant") {
            let moveScenario = 0;
            if (this.goalPos !== null && this.pos.equals(this.goalPos)) {
                this.goalPos = null;
                moveScenario = 1;
            } else {
                moveScenario = 2;
            }
            moveScenario = this.checkBounds(state, moveScenario);

            if (this.goalPos === null && moveScenario !== 0) {
                this.makeRandomMove();
            } else if (moveScenario == 2) {
                this.makeMoveToGoal();
            }
            if (this.stage == "feeding") {
                this.trueEnergy = this.trueEnergy - this.orgSize - this.maxVelocity - this.detectRadius;
                if (this.trueEnergy < 0) {
                    this.setGoalPos(this.homePos);
                }
            }
            return new Organism({
                ...this,
                pos: this.pos.add(this.velocity)
            });
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
    checkBounds(state, moveScenario) {
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
        if (this.trueEnergy < 1) {
            this.velocity.x = this.velocity.x / 2;
            this.velocity.y = this.velocity.y / 2;
        }
    }
    makeRandomMove() {
        let theta = Math.random() * 2 * Math.PI;
        let vel = new Vector(this.maxVelocity, this.maxVelocity);
        let center = this.pos.add(vel);
        let x = center.x + 50 * Math.cos(theta);
        let y = center.y + 50 * Math.sin(theta);
        this.setGoalPos({ x: x, y: y });

    }
    inRangeOfInteraction(org2) {
        let d = Math.sqrt(
            Math.pow(this.pos.x - org2.pos.x, 2) + Math.pow(this.pos.y - org2.pos.y, 2)
        );
        let canEatOrg2 = this.canEat(org2);
        let canBeEaten = org2.canEat(this);
        if (d <= this.orgSize && canEatOrg2) {
            this.eatenFood++;
            if (this.eatenFood > 1) {
                this.setGoalPos(this.homePos);
            }
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
        /*
        this.id = conf.id;
        this.type = conf.type;
        this.orgColor = conf.orgColor;
        this.orgSize = conf.orgSize;
        this.orgMaxVelocity = conf.orgMaxVelocity;
        this.detectRadius = conf.detectRadius;
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
        this.popId = 0;
        this.addOrganisms(this.conf.initialPopSize);
    }
    changeConfiguration(newConf) {
        this.conf = Object.assign(this.conf, newConf);
        this.population = [];
        this.popSize = 0;
        this.addOrganisms(this.conf.initialPopSize);
    }
    getRandomPointInsideCircle(R, center) {
        let r = R * Math.sqrt(Math.random());
        let theta = Math.random() * 2 * Math.PI;
        let x = center.x + r * Math.cos(theta);
        let y = center.y + r * Math.sin(theta);
        return new Vector(x, y);
    }
    getRandomPointOnCircle(R, center) {
        let theta = Math.random() * 2 * Math.PI;
        let x = center.x + R * Math.cos(theta);
        let y = center.y + R * Math.sin(theta);
        return new Vector(x, y);
    }
    addOrganisms(count) {
        let homePos;
        for (let i = 0; i < count; i++) {
            this.popSize++;
            this.popId++;
            if (this.conf.type == "plant") {
                homePos = this.getRandomPointInsideCircle(this.conf.feedingZoneRadius, this.conf.homePos);
            } else {
                homePos = this.getRandomPointOnCircle(this.conf.feedingZoneRadius, this.conf.feedingPos);
            }

            let rndSize = this.conf.orgSize * 0.7;
            rndSize = Math.random() * (this.conf.orgSize - minSize) + minSize;

            const orgStats =
            {
                id: this.conf.type + "-" + this.popId,
                type: this.conf.type,
                orgColor: this.conf.orgColor,
                orgSize: rndSize,
                maxVelocity: this.conf.orgMaxVelocity,
                stage: "resting",
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
    moveToFeedingZone(resetFood = false) {
        this.population.forEach(org => {
            if (resetFood) {
                org.eatenFood = 0;
                org.trueEnergy = org.baseEnergy;
                org.stage = "feeding";
                let feedingPos = this.getRandomPointInsideCircle(this.conf.feedingZoneRadius, this.conf.feedingPos);
                org.setGoalPos(feedingPos);
            } else if (org.eatenFood < 2) {
                let feedingPos = this.getRandomPointInsideCircle(this.conf.feedingZoneRadius, this.conf.feedingPos);
                org.setGoalPos(feedingPos);
            }
        });
    }
    changeStage(stage) {
        if (this.conf.type != "plant") {
            if (stage == "feeding") {
                this.moveToFeedingZone(true);
            } else if (stage == "resting") {
                this.population.forEach(org => {
                    if (org.eatenFood < 1) {
                        this.removeById(org.id);
                    } else {
                        org.stage = "resting";
                        if (org.eatenFood > 1) {
                            if (this.conf.type == "insect") {
                                this.spawnChild(org, 2);
                            } else {
                                this.spawnChild(org, 1);
                            }
                        }
                        let homePos = this.getRandomPointOnCircle(this.conf.feedingZoneRadius, this.conf.feedingPos);
                        org.setGoalPos(homePos);
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
            homePos = this.getRandomPointOnCircle(this.conf.feedingZoneRadius, this.conf.feedingPos);
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
        return [avgOrgSize / this.popSize, avgMaxVel / this.popSize, avgDetect / this.popSize];
    }
}

class DateTimeTracker {
    constructor(startDate = { year: 0, month: 0, day: 0, hour: 0 }) {
        this.startDate = startDate;
        this.date = startDate;
        this.interval = null;
        this.run = true;
        this.timeSpeed = 40;
    }
    setTimeSpeed(timeSpeed) {
        this.timeSpeed = 70 - timeSpeed * 10;
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (this.run) {
                this.addHours(0.05);
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
                this.addHours(0.05);
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
    addOrganismGroup(orgGroupConf) {
        let typeCount = 0;
        this.organismGroups.forEach(orgGroup => {
            if (orgGroup.conf.type == orgGroupConf.type) {
                typeCount++;
            }
        });
        const orgGroupId = orgGroupConf.type + "-" + typeCount;
        const newOrgGroup = new OrganismGroup(orgGroupId, orgGroupConf);
        newOrgGroup.createOutsidePath();
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

