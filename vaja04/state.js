class State {
    constructor(display, organismGroups) {
        this.display = display;
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
                            orgGroup02.population.forEach(org02 => {

                                currentOrg = org02.interaction(org01);
                                if (currentOrg.d <= org01.detectRadius &&
                                    (closestOrg == null ||
                                        (currentOrg.canBeEaten && currentOrg.d < closestOrg.d))) {
                                    closestOrg = {
                                        org: org02,
                                        d: currentOrg.d
                                    }
                                }
                            });
                            if (closestOrg != null) {
                                let diff = closestOrg.org.pos.subtract(org01.pos);
                                diff = diff.multiply(-1);
                                let newGoal = org01.pos.add(diff);
                                newGoal = getRandomPointOnCircle(10, newGoal);
                                org01.setGoalPos(newGoal);
                                org01.stage = "r";
                            }
                        }
                        if (org01.stage == "d") {
                            if (SIM_MAP.isTileDeepWater(org01.pos)) {
                                org01.hydration = 100;
                                org01.stage = "r";
                            }
                        } else {

                            if (org01.hunger < 0 && orgGroup01.diet == orgGroup02.type) {
                                orgGroup02.population.forEach(org02 => {
                                    currentOrg = org01.interaction(org02);
                                    if (closestOrg == null || (currentOrg.canBeEaten && currentOrg.d < closestOrg.d)) {
                                        closestOrg = {
                                            org: org02,
                                            d: currentOrg.d
                                        };
                                    }
                                });
                                if (closestOrg != null) {
                                    if (closestOrg.d < org01.size) {
                                        orgGroup02.removeById(closestOrg.org.id);
                                        org01.hunger = 100;
                                        org01.stage = "r";

                                    } else if (closestOrg.d <= org01.detectRadius) {
                                        org01.setGoalPos(
                                            closestOrg.org.pos.add(closestOrg.org.velocity)
                                        );
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
                            if (org01.hunger > -200 && (org01.matingInterval < 0 && orgGroup01.type == orgGroup02.type)) {
                                orgGroup02.population.forEach(org02 => {
                                    if (org01.gender != org02.gender && org02.matingInterval < 30) {
                                        org02.matingInterval = 0;
                                        currentOrg = org01.interaction(org02);
                                        if (closestOrg == null || (currentOrg.rating > closestOrg.rating)) {
                                            closestOrg = {
                                                org: org02,
                                                d: currentOrg.d,
                                                rating: currentOrg.rating
                                            };
                                        }
                                    }
                                });
                                if (closestOrg != null) {
                                    if ((closestOrg.d - closestOrg.org.size) < org01.size) {
                                        org01.matingInterval = 100;
                                        closestOrg.org.matingInterval = 100;
                                        if (org01.gender == "f") {
                                            orgGroup01.spawnChild(org01, closestOrg.org);
                                        }
                                    } else if (closestOrg.d <= org01.detectRadius) {
                                        if (org01.gender == "m") {
                                            org01.setGoalPos(
                                                closestOrg.org.pos.add(closestOrg.org.velocity)
                                            );
                                        } else if (org01.gender == "f") {
                                            if (Math.random() > 0.3) {
                                                org01.setGoalPos(
                                                    getRandomPointOnCircle(closestOrg.org.size * 2, closestOrg.org.pos)
                                                );
                                            }
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

        return new State(this.display, organismGroups);
    }
}