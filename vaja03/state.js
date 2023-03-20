class State {
    constructor(display, organismGroups) {
        this.display = display;
        this.organismGroups = organismGroups;
        this.stage = "resting";
    }
    updateOrganismGroups(updatedOrganismGroups) {
        this.organismGroups = updatedOrganismGroups;
    }
    startFeedingStage() {
        this.stage = "feeding";
        this.organismGroups.forEach(orgGroup => {
            orgGroup.changeStage("feeding");
        });
    }
    startRestingStage() {
        this.stage = "resting";
        this.organismGroups.forEach(orgGroup => {
            orgGroup.changeStage("resting");
        });
    }
    moveAllToFeedingZone() {
        this.organismGroups.forEach(orgGroup => {
            orgGroup.moveToFeedingZone();
        });
    }
    searchForFood() {
        let plants = null;
        let foodLeft = 0;
        let foodIndx = -1;
        let numofMoved = 0;
        let count = 0;
        this.organismGroups.forEach(orgGroup => {
            if (orgGroup.conf.type == "plant") {
                plants = orgGroup;
                foodLeft = orgGroup.population.length * 2;
            }
        });
        this.organismGroups.forEach(orgGroup => {
            if (orgGroup.conf.type != "plant") {
                orgGroup.population.forEach(org => {
                    count = 0;
                    while (org.foodId == null && count < 10000) {
                        count++;
                        foodIndx = Math.floor(Math.random() * plants.population.length);
                        if (plants.population[foodIndx].eatenBy.length < 2) {
                            plants.population[foodIndx].eatenBy.push(org);
                            org.foodId = plants.population[foodIndx].id;
                            org.pos = getRandomPointOnCircle(10, plants.population[foodIndx].pos);
                            numofMoved++;
                            if (plants.population[foodIndx].eatenBy.length == 2) {
                                foodLeft--;
                                if (foodLeft == 0) {
                                    console.log("out of food");
                                    return;
                                }
                            }

                        }

                    }
                });
            }
        });
        console.log("numofMoved: " + numofMoved);
        console.log("foodLeft: " + foodLeft);
    }
    foodDistribution() {
        this.organismGroups.forEach(orgGroup => {
            if (orgGroup.conf.type == "plant") {
                orgGroup.population.forEach(org => {
                    if (org.eatenBy.length == 1) {
                        org.eatenBy[0].eatenFood = 2;
                        orgGroup.removeById(org.id);
                    } else if (org.eatenBy.length == 2) {
                        if (org.eatenBy[0].behavior == "passive" && org.eatenBy[1].behavior == "passive") {
                            org.eatenBy[0].eatenFood = 1;
                            org.eatenBy[1].eatenFood = 1;
                        } else if (org.eatenBy[0].behavior == "passive" && org.eatenBy[1].behavior == "aggressive") {
                            org.eatenBy[0].eatenFood = 0.5;
                            org.eatenBy[1].eatenFood = 1.5;
                        } else if (org.eatenBy[0].behavior == "aggressive" && org.eatenBy[1].behavior == "passive") {
                            org.eatenBy[0].eatenFood = 1.5;
                            org.eatenBy[1].eatenFood = 0.5;
                        } else if (org.eatenBy[0].behavior == "aggressive" && org.eatenBy[1].behavior == "aggressive") {

                        }
                        orgGroup.removeById(org.id);
                    }
                });
            }
        });
    }
    sendHome() {
        this.organismGroups.forEach(orgGroup => {
            if (orgGroup.conf.type != "plant") {
                orgGroup.population.forEach(org => {
                    org.pos = org.homePos;
                });
            }
        });
    }
    reproductionAndDeath() {
        let numofDeaths = 0;
        let numofChildren = 0;
        this.organismGroups.forEach(orgGroup => {
            if (orgGroup.conf.type != "plant") {
                orgGroup.population.forEach(org => {
                    if (org.eatenFood == 0 || (org.eatenFood == 0.5 && Math.random() < 0.5)) {
                        orgGroup.removeById(org.id);
                        numofDeaths++;
                    } else if (org.eatenFood == 2 || (org.eatenFood == 1.5 && Math.random() < 0.5)) {
                        orgGroup.spawnChild(org, 1);
                        numofChildren++;
                        org.eatenFood = 0;
                        org.foodId = null;
                    } else {
                        org.eatenFood = 0;
                        org.foodId = null;
                    }
                });
            }
        });
        console.log("numofChildren: " + numofChildren);
        console.log("numofDeaths: " + numofDeaths);
    }
    update() {
        let organismGroups = this.organismGroups.map(orgGroup => {
            return orgGroup.updatePosition(this);
        });
        return new State(this.display, organismGroups);
    }
    respawnPlants() {
        for (let i = 0; i < this.organismGroups.length; i++) {
            if (this.organismGroups[i].conf.type == "plant") {
                this.organismGroups[i] = this.organismGroups[i].respawn();
                return;
            }
        }
    }
}