class State {
    constructor(organismGroups) {
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
    saveSimData(day) {
        let orgSimData = null;
        this.organismGroups.forEach(orgGroup => {
            if (orgGroup.type != "plant") {
                orgSimData = orgGroup.getSimData();
                console.log(orgSimData);
                downloadFile(orgSimData, orgGroup.id + "-" + day);
            }
        });
    }
    /*
    *Update OrganismGroups Interactions
    * updates goalPos of each organism of each group, based on interactions
    * interactions are a process of 2 organisms updating their goalPos depending on their relationship
    * organisms in interactions are referred to as org01 and org02
    * priority queue 1-most important, 5-least important: 
    * 1.) if ogr01 is a potential pray it will run away 
    * 2.) if org01 is walking towards water (stage="d") - continue on path
    * 3.) if org01 is not starving(hunger<-100) and matingInterval<0 try and find mate:
    *  - if mate if found go towards if male or stay if female
    * 4.) if org01 is thirsty it will try to find water tiles around it
    * 5.) if org01 is hungry it will try to find food around it
    */
    updateOrganismGroupsInteractions(isTestIter) {
        let currentOrg = null;
        let closestOrg = null;
        let expectedMove = null;
        let actualMove = null;
        let prayEatenId = null;
        let spawnChild = null;
        let attributesInRange = null;
        let candidates = null;

        let organismGroups = this.organismGroups.map(orgGroup01 => {
            if (orgGroup01.type == "plant") {
                orgGroup01.growPlants();
            } else {
                orgGroup01.updateNeeds();
                this.organismGroups.forEach(orgGroup02 => {
                    orgGroup01.population.forEach(org01 => {

                        currentOrg = null;
                        closestOrg = null;
                        expectedMove = null;
                        actualMove = {
                            move: null,
                            org: null
                        };
                        spawnChild = {
                            org01: null,
                            org02: null,
                            child: null
                        };
                        prayEatenId = null;
                        attributesInRange = null;

                        if (orgGroup02.diet == "all" || orgGroup01.type == orgGroup02.diet) {
                            orgGroup02.population.forEach(org02 => {

                                currentOrg = org02.interaction(org01);
                                if (currentOrg.distance <= org01.detectRadius &&
                                    (closestOrg == null ||
                                        (currentOrg.canBeEaten && currentOrg.distance < closestOrg.distance))) {
                                    closestOrg = {
                                        org: org02,
                                        distance: currentOrg.distance
                                    }
                                    expectedMove = "run";
                                }
                            });
                            if (closestOrg != null) {
                                let diff = closestOrg.org.pos.subtract(org01.pos);
                                diff = diff.multiply(-1);
                                let newGoal = org01.pos.add(diff);
                                newGoal = getRandomPointOnCircle(10, newGoal);
                                org01.setGoalPos(newGoal);
                                org01.stage = "r";
                                actualMove = {
                                    move: "run",
                                    org: closestOrg
                                };
                            }
                        } else {
                            if (org01.hunger < 0 && orgGroup01.diet == orgGroup02.type) {
                                candidates = [];
                                orgGroup02.population.forEach(org02 => {
                                    if (orgGroup01.diet == "plant") {
                                        currentOrg = org01.interaction(org02);
                                        if (currentOrg != null) {
                                            if (currentOrg.distance <= org01.detectRadius) {
                                                candidates.push(org02);
                                                if ((closestOrg == null) || (currentOrg.canBeEaten && currentOrg.growthFaze > closestOrg.growthFaze)) {
                                                    closestOrg = {
                                                        org: org02,
                                                        distance: currentOrg.distance
                                                    };
                                                }
                                                expectedMove = "hunt";
                                            }

                                        }
                                    }
                                    if (orgGroup01.type == "bird") {
                                        if (org02.age < orgGroup02.adultAge) {
                                            currentOrg = org01.interaction(org02);
                                            if (closestOrg == null || (currentOrg.canBeEaten && currentOrg.distance < closestOrg.distance)) {
                                                closestOrg = {
                                                    org: org02,
                                                    distance: currentOrg.distance
                                                };
                                            }
                                            expectedMove = "hunt";
                                        }
                                    } else {
                                        currentOrg = org01.interaction(org02);
                                        if (closestOrg == null || (currentOrg.canBeEaten && currentOrg.distance < closestOrg.distance)) {
                                            closestOrg = {
                                                org: org02,
                                                distance: currentOrg.distance
                                            };
                                        }
                                        expectedMove = "hunt";
                                    }
                                });

                                if (closestOrg != null) {
                                    if (orgGroup01.diet == "plant" && DEBUG) {
                                        console.log(candidates);
                                        console.log(closestOrg.org);
                                    }
                                    if (closestOrg.distance < org01.size) {
                                        if (orgGroup01.diet == "bird") {
                                            if (closestOrg.org.stillInterval <= 0) {
                                                if (closestOrg.org.type != "plant") {
                                                    let deathCert = {
                                                        id: closestOrg.org.id,
                                                        age: closestOrg.org.age,
                                                        cause: "predator",
                                                        predatorId: org01.id
                                                    };
                                                    downloadFile(deathCert, closestOrg.org.id + "-dc");
                                                }
                                                orgGroup02.removeById(closestOrg.org.id);
                                                org01.hunger = 150;
                                                org01.stillInterval = 20;
                                                org01.stage = "c";
                                                prayEatenId = closestOrg.org.id;
                                                testDeathByPredator(prayEatenId, orgGroup02, org01.id, orgGroup02);
                                            }
                                        }
                                        else if (orgGroup01.diet == "turtle" && SIM_MAP.isTileDeepWater(closestOrg.org.pos) <= 0) {
                                            if (closestOrg.org.type != "plant") {
                                                let deathCert = {
                                                    id: closestOrg.org.id,
                                                    age: closestOrg.org.age,
                                                    cause: "predator",
                                                    predatorId: org01.id
                                                };
                                                downloadFile(deathCert, closestOrg.org.id + "-dc");
                                            }
                                            orgGroup02.removeById(closestOrg.org.id);
                                            org01.hunger = 150;
                                            org01.stillInterval = 20;
                                            org01.stage = "c";
                                            prayEatenId = closestOrg.org.id;
                                            testDeathByPredator(prayEatenId, orgGroup02, org01.id, orgGroup02);
                                        } else {
                                            if (org01.type == "bird") {
                                                if (closestOrg.org.type != "plant") {
                                                    let deathCert = {
                                                        id: closestOrg.org.id,
                                                        age: closestOrg.org.age,
                                                        cause: "predator",
                                                        predatorId: org01.id
                                                    };
                                                    downloadFile(deathCert, closestOrg.org.id + "-dc");
                                                }
                                                orgGroup02.removeById(closestOrg.org.id);
                                                org01.hunger = 150;
                                                org01.stillInterval = 20;
                                                org01.stage = "c";
                                                prayEatenId = closestOrg.org.id;
                                                testDeathByPredator(prayEatenId, orgGroup02, org01.id, orgGroup02);
                                            } else {
                                                if (closestOrg.org.type != "plant") {
                                                    let deathCert = {
                                                        id: closestOrg.org.id,
                                                        age: closestOrg.org.age,
                                                        cause: "predator",
                                                        predatorId: org01.id
                                                    };
                                                    downloadFile(deathCert, closestOrg.org.id + "-dc");
                                                }
                                                orgGroup02.removeById(closestOrg.org.id);
                                                org01.hunger = 150;
                                                org01.stillInterval = 20;
                                                org01.stage = "c";
                                                prayEatenId = closestOrg.org.id;
                                                testDeathByPredator(prayEatenId, orgGroup02, org01.id, orgGroup02);
                                            }

                                        }

                                    } else if (closestOrg.distance <= org01.detectRadius) {
                                        org01.setGoalPos(
                                            closestOrg.org.pos.add(closestOrg.org.velocity)
                                        );
                                    }
                                    actualMove = {
                                        move: "hunt",
                                        org: closestOrg
                                    };
                                }
                            }
                            if (org01.hydration < 10 && SIM_MAP.isTileDeepWater(org01.pos)) {
                                org01.hydration = 100;
                                org01.stillInterval = 20;
                                org01.stage = "c";
                            } else if (org01.hydration < 0 && org01.hunger > -200) {
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
                                    org01.stage = "c";
                                    org01.setGoalPos(waterTile);
                                }
                            }
                            if (org01.type == "turtle") {
                                if (org01.matingInterval < 50) {
                                    if (org01.gender == "f") {
                                        if (org01.hunger > -100) {
                                            let mateTile = new Vector(org01.pos.x, org01.pos.y);
                                            if (!SIM_MAP.isTileShallowWaterORBeach(mateTile)) {
                                                mateTile = org01.pos.add(new Vector(org01.detectRadius, 0));
                                                if (!SIM_MAP.isTileShallowWaterORBeach(mateTile)) {
                                                    mateTile = org01.pos.add(new Vector(-org01.detectRadius, 0));
                                                    if (!SIM_MAP.isTileShallowWaterORBeach(mateTile)) {
                                                        mateTile = org01.pos.add(new Vector(0, org01.detectRadius));
                                                        if (!SIM_MAP.isTileShallowWaterORBeach(mateTile)) {
                                                            mateTile = org01.pos.add(new Vector(0, -org01.detectRadius));
                                                            if (!SIM_MAP.isTileShallowWaterORBeach(mateTile)) {
                                                                mateTile = org01.pos.add(new Vector(-org01.detectRadius, org01.detectRadius));
                                                                if (!SIM_MAP.isTileShallowWaterORBeach(mateTile)) {
                                                                    mateTile = org01.pos.add(new Vector(org01.detectRadius, -org01.detectRadius));
                                                                    if (!SIM_MAP.isTileShallowWaterORBeach(mateTile)) {
                                                                        mateTile = org01.pos.add(new Vector(org01.detectRadius, org01.detectRadius));
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            if (SIM_MAP.isTileShallowWaterORBeach(mateTile)) {
                                                org01.stage = "c";
                                                org01.setGoalPos(mateTile);
                                            }
                                        }
                                    } else if (org01.gender = "m") {
                                        orgGroup02.population.forEach(org02 => {
                                            if (org02.gender == "f" && org02.matingInterval < 50) {
                                                currentOrg = org01.interaction(org02);
                                                if (closestOrg == null || (currentOrg.distance < closestOrg.distance)) {
                                                    closestOrg = {
                                                        org: org02,
                                                        distance: currentOrg.distance,
                                                        rating: currentOrg.rating
                                                    };
                                                    expectedMove = "mate";
                                                }
                                            }
                                        });

                                        if (closestOrg != null) {
                                            if (closestOrg.distance < org01.size) {
                                                if (SIM_MAP.isTileShallowWaterORBeach(org01.pos)) {
                                                    org01.matingInterval = 250;
                                                    closestOrg.org.matingInterval = 250;
                                                    org01.stillInterval = 10;
                                                    orgGroup01.spawnChild(org01, closestOrg.org);
                                                    orgGroup01.spawnChild(org01, closestOrg.org);
                                                    orgGroup01.spawnChild(org01, closestOrg.org);
                                                    orgGroup01.spawnChild(org01, closestOrg.org);
                                                    orgGroup01.spawnChild(org01, closestOrg.org);
                                                    //testSpawnOrganism(orgGroup01.population[orgGroup01.popSize - 1], orgGroup01, org01, closestOrg.org);
                                                }
                                            }
                                            else if (closestOrg.distance <= org01.detectRadius) {
                                                if (org01.gender == "m") {
                                                    org01.setGoalPos(
                                                        closestOrg.org.pos
                                                    );
                                                    console.log("setGoal")
                                                }
                                            }
                                            actualMove = {
                                                move: "mate",
                                                org: closestOrg
                                            };
                                        }
                                    }
                                }
                            } else if (org01.hunger > -200 && (org01.matingInterval < 0 && orgGroup01.type == orgGroup02.type)) {
                                orgGroup02.population.forEach(org02 => {

                                    if (org01.gender == "m" && org02.gender == "f" && org02.matingInterval < 50) {
                                        currentOrg = org01.interaction(org02);
                                        if (closestOrg == null || (currentOrg.rating > closestOrg.rating)) {
                                            closestOrg = {
                                                org: org02,
                                                distance: currentOrg.distance,
                                                rating: currentOrg.rating
                                            };
                                            expectedMove = "mate";
                                        }
                                    }
                                });
                                if (closestOrg != null) {
                                    closestOrg.org.stillInterval = 1;
                                    //if ((closestOrg.distance - closestOrg.org.size) < org01.size) {
                                    if (closestOrg.distance < org01.size) {
                                        if (org01.type == "turtle") {
                                            if (SIM_MAP.isTileShallowWaterORBeach(org01.pos)) {
                                                org01.matingInterval = 250;
                                                closestOrg.org.matingInterval = 250;
                                                org01.stillInterval = 10;
                                                orgGroup01.spawnChild(org01, closestOrg.org);
                                                orgGroup01.spawnChild(org01, closestOrg.org);
                                                orgGroup01.spawnChild(org01, closestOrg.org);
                                                orgGroup01.spawnChild(org01, closestOrg.org);
                                                orgGroup01.spawnChild(org01, closestOrg.org);
                                                //testSpawnOrganism(orgGroup01.population[orgGroup01.popSize - 1], orgGroup01, org01, closestOrg.org);
                                            }
                                        } else {
                                            org01.matingInterval = 100;
                                            closestOrg.org.matingInterval = 100;
                                            org01.stillInterval = 10;
                                            orgGroup01.spawnChild(org01, closestOrg.org);
                                            //testSpawnOrganism(orgGroup01.population[orgGroup01.popSize - 1], orgGroup01, org01, closestOrg.org);
                                        }
                                    }
                                    else if (closestOrg.distance <= org01.detectRadius) {
                                        if (org01.gender == "m") {
                                            org01.setGoalPos(
                                                closestOrg.org.pos
                                            );
                                        } else if (org01.gender == "f") {
                                            if (Math.random() > 0.3) {
                                                org01.setGoalPos(
                                                    getRandomPointOnCircle(closestOrg.org.size * 2, closestOrg.org.pos)
                                                );
                                            }
                                        }
                                    }
                                    actualMove = {
                                        move: "mate",
                                        org: closestOrg
                                    };
                                }
                            }


                        }
                        if (isTestIter && 1 == 2) {
                            let testPassed = null;
                            if (expectedMove == "run") {
                                testPassed = testClosestPredator(actualMove, org01, orgGroup02);
                                if (testPassed) {
                                    console.log("run-test - OK");
                                } else {
                                    console.log("run-test - failed");
                                }
                            } else if (expectedMove == "hunt") {
                                testPassed = testClosestPray(actualMove, org01, orgGroup02);
                                if (testPassed) {
                                    console.log("hunt-test - OK");
                                } else {
                                    console.log("hunt-test - failed");
                                }
                            } else if (expectedMove == "mate") {
                                testPassed = testBestMate(actualMove, org01, orgGroup01);
                                if (testPassed) {
                                    console.log("mate-test - OK");
                                } else {
                                    console.log("mate-test - failed");
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