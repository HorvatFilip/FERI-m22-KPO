class Organism {
    constructor(orgNewPos, orgConf = null) {
        if (orgConf == null) {
            Object.assign(this, orgNewPos);
        } else {
            this.id = orgConf.id;
            this.type = orgConf.type;
            this.terrainPreference = orgConf.terrainPreference;
            this.size = orgConf.size;
            this.age = orgConf.age;
            this.stage = "r";
            if (this.type != "plant") {
                this.maxVelocity = orgConf.maxVelocity;
                this.eatingSize = orgConf.size * 0.8;
                this.detectRadius = orgConf.detectRadius;
                this.gender = orgConf.gender;
                this.hunger = randomIntRange(100, 200);
                this.hydration = randomIntRange(100 * 0.65, 100);
                this.matingInterval = orgConf.matingInterval;
                this.stillInterval = 0;
                if (this.type == "bird") {
                    this.energy = randomNumberRange(200 * 0.65, 200);
                }
            } else {
                this.growthFaze = orgConf.growthFaze;
                this.nutrients = orgConf.nutrients;
                this.growthSpeed = orgConf.growthSpeed;
                this.seedRadius = orgConf.seedRadius;
                this.numofSeeds = orgConf.numofSeeds;
            }
            this.velocity = new Vector(0, 0);
            this.goalPos = null;
            this.homePos = new Vector(orgNewPos.x, orgNewPos.y);
            this.pos = orgNewPos;
        }
    }
    setGoalPos(newGoalPos) {
        if (this.stage != "h") {
            let loopCount = 0;
            let radius = 1;
            newGoalPos = getRandomPointInsideCircle(radius, newGoalPos);
            if (this.type != "bird" || this.energy < 50) {



                if (this.terrainPreference == "water") {
                    while (!SIM_MAP.isTileDeepWater(newGoalPos)) {
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
                } else {
                    // simple alg for finding non water tiles, with increasing radius of search
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
            }

        }
        this.goalPos = new Vector(newGoalPos.x, newGoalPos.y);
    }
    moveToSpawnPoint() {
        this.goalPos = this.homePos;
    }
    updatePosition() {
        if (this.type !== "plant" && this.stillInterval <= 0) {
            if (this.goalPos != null) {
                if (this.pos.equals(this.goalPos)) {
                    this.goalPos = null;
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
        if (this.type != "bird") {
            if (this.terrainPreference == "water") {
                maxVel *= (1 - SIM_MAP.terrainPenaltyMarine(this.pos) * 2);
            } else {
                maxVel *= (1 - SIM_MAP.terrainPenaltyLand(this.pos));
            }
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
        let newGoal = this.pos.add(this.velocity);
        if (this.type == "bird") {
            newGoal = getRandomPointOnCircle(100, newGoal);
        } else {
            newGoal = getRandomPointOnCircle(10, newGoal);
        }
        this.setGoalPos(newGoal);
    }
    getRating() {
        return this.maxVelocity * 15 + this.size * 10 + this.detectRadius;
    }
    interaction(org2) {
        let distance = Math.sqrt(
            Math.pow(this.pos.x - org2.pos.x, 2) + Math.pow(this.pos.y - org2.pos.y, 2)
        );
        let canEatOrg2 = null;
        canEatOrg2 = this.canEat(org2);


        let rating = null;
        if (this.stage == "m") {
            rating = org2.getRating();
        }
        let growthFaze = 0;
        if (org2.type == "plant") {
            growthFaze = org2.growthFaze;
        }

        return {
            distance: distance,
            canBeEaten: canEatOrg2,
            rating: rating,
            growthFaze: growthFaze
        };
    }
    canEat(org2) {
        if (this.eatingSize >= org2.size) {

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
        this.terrainPreference = conf.terrainPreference;
        this.color = conf.color;
        this.adultColor = conf.adultColor;
        this.adultAge = conf.adultAge;
        this.size = conf.size;
        this.mutationChance = conf.mutationChance;
        this.initialPopSize = conf.initialPopSize;
        if (this.type != "plant") {
            this.maxVelocity = conf.maxVelocity;
            this.detectRadius = conf.detectRadius;
            this.diet = conf.diet;

        } else {
            this.nutrients = conf.nutrients;
            this.growthSpeed = conf.growthSpeed;
            this.seedRadius = conf.seedRadius;
            this.numofSeeds = conf.numofSeeds;
        }
        this.homePos = conf.homePos;
        this.homeRadius = conf.homeRadius;
        this.population = [];
        this.popSize = 0;
        this.popId = 0;
        if (this.initialPopSize != 0) {
            this.createInitialPopulation(this.initialPopSize);
        }
    }
    /*
    *Creates initial population
    * organism traits values in range: 65% - 100%
    * gender m - 50%, f - 50% 
    */
    createInitialPopulation(initialPopSize) {
        let orgId;
        let maxVelocity;
        let size;
        let age;
        let detectRadius;
        let gender;
        let matingInterval;
        let nutrients;
        let growthSpeed;
        let seedRadius;
        let numofSeeds;
        let spawnPos;
        let orgConf = {};
        let loopCount = 0;
        for (let i = 0; i < initialPopSize; i++) {
            orgId = this.type + "-" + this.popId;

            age = randomIntRange(0, 2);
            if (Math.random() > 0.7) {
                age += 5;
            }
            size = randomNumberRange(this.size * 0.65, this.size);
            loopCount = 0;
            spawnPos = getRandomPointInsideCircle(this.homeRadius, this.homePos);
            if (this.terrainPreference == "land") {
                while (SIM_MAP.isTileDeepWater(spawnPos) && loopCount < 10000) {
                    spawnPos = getRandomPointInsideCircle(this.homeRadius, this.homePos);
                    loopCount++;
                }
            } else {
                while (!SIM_MAP.isTileDeeperWater(spawnPos) && loopCount < 10000) {
                    spawnPos = getRandomPointInsideCircle(this.homeRadius, this.homePos);
                    loopCount++;
                }
            }
            if (loopCount == 10000) {
                continue;
            }

            if (this.type != "plant") {
                maxVelocity = randomNumberRange(this.maxVelocity * 0.65, this.maxVelocity);
                detectRadius = randomNumberRange(this.detectRadius * 0.65, this.detectRadius);
                matingInterval = randomIntRange(0, 100);
                if (Math.random() > 0.5) {
                    gender = "m";
                } else {
                    gender = "f"
                }
                orgConf = {
                    id: orgId,
                    type: this.type,
                    terrainPreference: this.terrainPreference,
                    maxVelocity: maxVelocity,
                    size: size,
                    detectRadius: detectRadius,
                    gender: gender,
                    age: age,
                    matingInterval: matingInterval
                }
            } else {
                nutrients = randomNumberRange(this.nutrients * 0.65, this.nutrients);
                growthSpeed = randomNumberRange(this.growthSpeed * 0.65, this.growthSpeed);
                seedRadius = randomNumberRange(this.seedRadius * 0.65, this.seedRadius);
                numofSeeds = randomNumberRange(this.numofSeeds * 0.65, this.numofSeeds);

                orgConf = {
                    id: orgId,
                    type: this.type,
                    terrainPreference: this.terrainPreference,
                    size: size,
                    nutrients: nutrients,
                    growthFaze: randomNumberRange(0, 100),
                    growthSpeed: growthSpeed,
                    seedRadius: seedRadius,
                    numofSeeds: Math.round(numofSeeds),
                    age: age
                }
            }

            this.population.push(new Organism(spawnPos, orgConf));
            this.popId++;
            this.popSize++;
        }
    }

    /*
    *Spawns child from 2 organisms
    * organism traits values in range: 90% of average(parents) - 120%/140%(mutation) of average(parents)
    * gender m - 50%, f - 50% 
    */
    spawnChild(org01, org02) {

        let avgMaxVel = (org01.maxVelocity + org02.maxVelocity) / 2;
        let avgSize = (org01.size + org02.size) / 2;
        let avgDetRad = (org01.detectRadius + org02.detectRadius) / 2;

        let orgId = this.type + "-" + this.popId;
        let maxVelocity = randomNumberRange(avgMaxVel * 0.9, avgMaxVel * 1.2);
        if (Math.random() * 100 < this.mutationChance) {
            maxVelocity = randomNumberRange(maxVelocity * 0.9, maxVelocity * 1.4);
        }
        let size = randomNumberRange(avgSize * 0.9, avgSize * 1.2);
        if (Math.random() * 100 < this.mutationChance) {
            size = randomNumberRange(size * 0.9, size * 1.4);
        }
        let detectRadius = randomNumberRange(avgDetRad * 0.9, avgDetRad * 1.2);
        if (Math.random() * 100 < this.mutationChance) {
            detectRadius = randomNumberRange(detectRadius * 0.9, detectRadius * 1.4);
        }

        let gender = null;
        if (Math.random() > 0.5) {
            gender = "m";
        } else {
            gender = "f"
        }
        let matingInterval = randomNumberRange(0, 100);;
        if (this.type == "turtle") {
            matingInterval = 250;
        }

        let orgConf = {
            id: orgId,
            type: this.type,
            terrainPreference: this.terrainPreference,
            maxVelocity: maxVelocity,
            size: size,
            detectRadius: detectRadius,
            gender: gender,
            age: 0,
            matingInterval: matingInterval
        }

        let spawnPos = getRandomPointInsideCircle(5, org01.pos)
        let newOrg = new Organism(spawnPos, orgConf);

        let birthCert = {
            id: orgId,
            type: this.type,
            terrainPreference: this.terrainPreference,
            birthPos: spawnPos,
            maxVelocity: maxVelocity,
            size: size,
            detectRadius: detectRadius,
            gender: gender,
            parentsIds: [
                org01.id, org02.id
            ]
        };
        downloadFile(birthCert, orgId + "-bc");

        console.log(newOrg);
        this.population.push(newOrg);
        this.popId++;
        this.popSize++;
    }
    changeConfiguration(newConf) {
        this.name = newConf.name;
        this.type = newConf.type;
        this.color = newConf.color;
        this.size = newConf.size;
        this.mutationChance = newConf.mutationChance;
        this.initialPopSize = newConf.initialPopSize;
        if (this.type != "plant") {
            this.maxVelocity = newConf.maxVelocity;
            this.detectRadius = newConf.detectRadius;
            this.diet = newConf.diet;

        } else {
            this.nutrients = newConf.nutrients;
            this.growthSpeed = newConf.growthSpeed;
            this.seedRadius = newConf.seedRadius;
            this.numofSeeds = newConf.numofSeeds;
        }
        this.homePos = newConf.homePos;
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
    /*
    *Updates needs of organisms
    * hunger level decrease proportional to size
    * hydration level decrease proportional to maxVelocity
    * matingInterval level decrease by 1 
    *
    */
    updateNeeds() {
        this.population.forEach(org => {
            if (this.type == "bird") {
                if (org.energy <= 0 && org.stage != "t") {
                    if (SIM_MAP.isTileDeepWater(org.pos)) {
                        let deathCert = {
                            id: org.id,
                            age: org.age,
                            cause: "drowned"
                        };
                        downloadFile(deathCert, org.id + "-dc");
                        this.removeById(org.id);
                    } else {
                        org.stillInterval = 20;
                        console.log("resting");
                    }
                } else {
                    org.energy -= (1 + org.size / 100);
                }
            }

            if (org.stillInterval >= 0) {
                if (org.type == "bird" && org.energy < 100) {
                    org.energy += 10;
                }
                org.stillInterval--;
            } else {
                org.hunger -= (1 + org.size / 100);
                if (org.type == "turtle") {
                    if (!SIM_MAP.isTileDeepWater(org.pos)) {
                        org.hydration -= (2 + org.maxVelocity / 100);
                    }
                } else {
                    org.hydration -= (1 + org.maxVelocity / 100);
                }
            }
            org.matingInterval -= 1;
            org.stage = "c";

            if (org.hunger < 0) {
                if (org.stage != "d") {
                    org.stage = "h";
                }
                if (org.hunger < -500) {
                    let deathCert = {
                        id: org.id,
                        age: org.age,
                        cause: "hunger"
                    };
                    downloadFile(deathCert, org.id + "-dc");
                    this.removeById(org.id);
                    testDeathByLackOfEssentialNeeds(org.id, this);
                }
            }
            if (org.hydration < 0) {
                if (org.stage != "d") {
                    org.stage = "t";
                }
                if (org.hydration < -300) {
                    let deathCert = {
                        id: org.id,
                        age: org.age,
                        cause: "dehydration"
                    };
                    downloadFile(deathCert, org.id + "-dc");
                    this.removeById(org.id);
                    testDeathByLackOfEssentialNeeds(org.id, this);
                }
            }
            if (org.matingInterval < 0) {
                org.stage = "m";
            }
            //DEBUG - red organism needs logs
            if (org.id == "bird-1" && DEBUG == true) {
                console.log(org.stage);
                console.log(org.hunger, org.hydration, org.matingInterval, org.energy);
            }
        });
    }
    growPlants() {
        this.population.forEach(org => {
            if (org.growthFaze < 100) {
                org.growthFaze += org.growthSpeed;

                let spreadSeeds = false;
                if (Math.floor(org.growthFaze) == 100) {
                    org.growthFaze = 101;
                    spreadSeeds = true;
                } else if (Math.floor(org.growthFaze) == 75 && Math.random() < 0.75) {
                    org.growthFaze = 76;
                    spreadSeeds = true;
                } else if (Math.floor(org.growthFaze) == 50 && Math.random() < 0.50) {
                    org.growthFaze = 51;
                    spreadSeeds = true;
                } else if (Math.floor(org.growthFaze) == 25 && Math.random() < 0.25) {
                    org.growthFaze = 26;
                    spreadSeeds = true;
                }

                if (spreadSeeds) {
                    let nutrients;
                    let growthSpeed;
                    let seedRadius;
                    let numofSeeds;
                    let orgConf;
                    let orgId;
                    let spawnPos;
                    let newOrg;

                    for (let i = 0; i < org.numofSeeds; i++) {
                        orgId = this.type + "-" + this.popId
                        nutrients = randomNumberRange(this.nutrients * 0.9, this.nutrients * 1.2);
                        if (Math.random() * 100 < this.mutationChance) {
                            nutrients = randomNumberRange(this.nutrients * 0.9, this.nutrients * 1.4);
                        }
                        //growthSpeed = randomNumberRange(this.growthSpeed * 0.9, this.growthSpeed * 1.2);
                        //if (Math.random() * 100 < this.mutationChance) {
                        //    growthSpeed = randomNumberRange(this.growthSpeed * 0.9, this.growthSpeed * 1.4);
                        //}
                        seedRadius = randomNumberRange(this.seedRadius * 0.9, this.seedRadius * 1.2);
                        if (Math.random() * 100 < this.mutationChance) {
                            seedRadius = randomNumberRange(this.seedRadius * 0.9, this.seedRadius * 1.4);
                        }
                        numofSeeds = randomNumberRange(this.numofSeeds * 0.9, this.numofSeeds * 1.2);
                        if (Math.random() * 100 < this.mutationChance) {
                            numofSeeds = randomNumberRange(this.numofSeeds * 0.9, this.numofSeeds * 1.4);
                        }
                        numofSeeds = this.numofSeeds;
                        growthSpeed = this.growthSpeed;
                        orgConf = {
                            id: orgId,
                            type: this.type,
                            terrainPreference: this.terrainPreference,
                            size: this.size,
                            nutrients: nutrients,
                            growthFaze: 0,
                            growthSpeed: growthSpeed,
                            seedRadius: seedRadius,
                            numofSeeds: Math.round(numofSeeds),
                            age: 0
                        }

                        spawnPos = getRandomPointInsideCircle(org.seedRadius, org.pos)
                        newOrg = new Organism(spawnPos, orgConf);
                        this.population.push(newOrg);
                        this.popId++;
                        this.popSize++;
                    }
                }
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
    getSimData() {
        let simData = {
            id: this.id,
            popSize: this.popSize,
            avgSize: 0,
            avgMaxVel: 0,
            avgDetectR: 0,
            avgAge: 0
        };
        this.population.forEach(org => {
            simData.avgSize += org.size;
            simData.avgMaxVel += org.maxVelocity;
            simData.avgDetectR += org.detectRadius;
            simData.avgAge += org.age;
        });
        simData.avgSize /= this.population.length;
        simData.avgMaxVel /= this.population.length;
        simData.avgDetectR /= this.population.length;
        simData.avgAge /= this.population.length;

        return simData
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