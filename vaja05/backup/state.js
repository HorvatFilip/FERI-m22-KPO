class State {
    constructor(organismGroups, stateConf = null) {
        if (stateConf != null) {
            this.maxDistance = stateConf.maxDistance;
            this.maxRating = stateConf.maxRating;
        }
        this.organismGroups = organismGroups;
    }
    updateOrganismGroups(updatedOrganismGroups) {
        this.organismGroups = updatedOrganismGroups;
    }
    setAllGroupsToHuntStage() {
        this.organismGroups.forEach(orgGroup => {
            orgGroup.population.forEach(org => {
                org.hunger = 0;
            });
        });
    }
    setAllGroupsToMateStage() {
        this.organismGroups.forEach(orgGroup => {
            orgGroup.population.forEach(org => {
                org.matingInterval = 0;
            });
        });
    }
    respawnPlants() {
        this.organismGroups.forEach(orgGroup => {
            if (orgGroup.type == "plant") {
                orgGroup.removeAll();
                orgGroup.createInitialPopulation(orgGroup.initialPopSize);
            }
        });
    }
    updateAge() {
        this.organismGroups.forEach(orgGroup => {
            if (orgGroup.type != "plant") {
                orgGroup.addDayToAge();
            }
        });
    }
    update() {
        let currentOrg = null;
        let closestOrg = null;
        let organismGroups = this.organismGroups.map(orgGroup01 => {
            if (orgGroup01.type != "plant") {
                orgGroup01.updateNeeds();
                this.organismGroups.forEach(orgGroup02 => {
                    orgGroup01.population.forEach(org01 => {
                        currentOrg = null;
                        closestOrg = null;
                        if (orgGroup02.diet == "all" || orgGroup01.type == orgGroup02.diet) {
                            closestOrg = {
                                org: null,
                                d: this.maxDistance
                            };
                            orgGroup02.population.forEach(org02 => {
                                currentOrg = org01.canBeEatenDistance(org02);
                                if (currentOrg.d <= org01.detectRadius &&
                                    (currentOrg.canBeEaten && currentOrg.d < closestOrg.d)) {
                                    closestOrg.org = org02;
                                    closestOrg.d = currentOrg.d;
                                }
                            });
                            if (closestOrg.org != null) {
                                console.log("move");
                                let diff = closestOrg.org.pos.subtract(org01.pos);
                                diff = diff.multiply(-1);
                                let newGoal = org01.pos.add(diff);
                                newGoal = getRandomPointOnCircle(10, newGoal);
                                org01.setGoalPos(newGoal);
                                org01.stage = "r";
                            }
                        } else if (org01.stage == "d") {
                            if (SIM_MAP.isTileDeepWater(org01.pos)) {
                                org01.hydration = 100;
                                org01.stage = "r";
                            }
                        } else {
                            closestOrg = {
                                org: null,
                                d: this.maxDistance
                            };
                            if (org01.hunger < 0 && orgGroup01.diet == orgGroup02.type) {
                                orgGroup02.population.forEach(org02 => {
                                    currentOrg = org01.canEatDistance(org02);
                                    console.log(currentOrg)
                                    if (currentOrg.d <= org01.detectRadius &&
                                        (currentOrg.canEat && currentOrg.d < closestOrg.d)) {
                                        closest.org = org02;
                                        closest.d = currentOrg.d;

                                    }
                                });
                                if (closestOrg.org != null) {
                                    console.log((closestOrg.d - closestOrg.org.size));
                                    console.log(org01.size);
                                    if ((closestOrg.d - closestOrg.org.size) < org01.size) {
                                        console.log("remove");
                                        orgGroup02.removeById(closestOrg.org.id);
                                        org01.hunger = 100;
                                        org01.stage = "r";

                                    } else if (closestOrg.d <= org01.detectRadius) {
                                        org01.setGoalPos(
                                            closestOrg.org.pos.add(closestOrg.org.velocity)
                                        );
                                        console.log("huger");
                                        org01.stage = "h";
                                    }
                                }
                            }
                            if (org01.hydration < 0 && org01.hunger > -200) {

                                let waterTile = new Vector(org01.pos.x, org01.pos.y);
                                if (!SIM_MAP.isTileDeepWater(waterTile)) {
                                    waterTile = org01.pos.add(new Vector(org01.detectRadius, 0));
                                    if (!SIM_MAP.isTileDeepWater(waterTile)) {
                                        waterTile = org01.pos.add(new Vector(-org01.detectRadius, 0));
                                        if (!SIM_MAP.isTileDeepWater(waterTile)) {
                                            waterTile = org01.pos.add(new Vector(0, org01.detectRadius));
                                            if (!SIM_MAP.isTileDeepWater(waterTile)) {
                                                waterTile = org01.pos.add(new Vector(0, -org01.detectRadius));
                                                if (!SIM_MAP.isTileDeepWater(waterTile)) {
                                                    waterTile = org01.pos.add(new Vector(-org01.detectRadius, org01.detectRadius));
                                                    if (!SIM_MAP.isTileDeepWater(waterTile)) {
                                                        waterTile = org01.pos.add(new Vector(org01.detectRadius, -org01.detectRadius));
                                                        if (!SIM_MAP.isTileDeepWater(waterTile)) {
                                                            waterTile = org01.pos.add(new Vector(org01.detectRadius, org01.detectRadius));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (SIM_MAP.isTileDeepWater(waterTile)) {
                                    org01.stage = "d";
                                    org01.setGoalPos(waterTile);
                                }

                            }
                            closestOrg = {
                                org: null,
                                d: this.maxDistance,
                                rating: this.maxRating
                            };
                            if (org01.hunger > -100 && (org01.matingInterval < 0 && orgGroup01.type == orgGroup02.type)) {
                                orgGroup02.population.forEach(org02 => {
                                    currentOrg = org01.canMateRating(org02);
                                    if (org01.distanceTo(org02) <= org01.detectRadius &&
                                        (currentOrg.canMate && currentOrg.rating > closestOrg.rating)) {
                                        closest.org = org02;
                                        closest.d = currentOrg.d;
                                        closest.rating = currentOrg.rating;
                                    }

                                });
                                if (closestOrg.org != null) {
                                    if ((closestOrg.d - closestOrg.org.size) < org01.size) {
                                        org01.matingInterval = 150;
                                        closestOrg.org.matingInterval = 150;
                                        if (org01.gender == "f") {
                                            orgGroup01.spawnChild(org01, closestOrg.org);
                                        }
                                    } else {
                                        if (org01.gender == "m") {
                                            org01.setGoalPos(
                                                closestOrg.org.pos.add(closestOrg.org.velocity)
                                            );
                                            org01.stage = "m";
                                        } else if (org01.gender == "f") {
                                            if (Math.random() > 0.3) {
                                                org01.setGoalPos(
                                                    getRandomPointOnCircle(closestOrg.org.size, closestOrg.org.pos)
                                                );
                                            }
                                            org01.stage = "m";
                                        }
                                    }
                                }
                            }

                        }
                    });
                });
            }
            return orgGroup01.updatePosition(this);
        });

        return new State(organismGroups);
    }
}