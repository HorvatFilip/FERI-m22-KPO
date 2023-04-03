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
                org.stage = "h";
            })
        });
    }
    setAllGroupsToMateStage() {
        this.organismGroups.forEach(orgGroup => {
            orgGroup.population.forEach(org => {
                org.stage = "m";
            })
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
                                if (org02.stage == "h") {
                                    currentOrg = org02.interaction(org01);
                                    if (closestOrg == null || (currentOrg.canBeEaten && currentOrg.d < closestOrg.d)) {
                                        closestOrg = {
                                            org: org02,
                                            d: currentOrg.d
                                        }
                                    }
                                }
                            });
                            if (closestOrg != null) {
                                if (closestOrg.d <= org01.detectRadius) {
                                    let diff = closestOrg.org.pos.subtract(org01.pos);
                                    diff = diff.multiply(-4);
                                    let newGoal = org01.pos.add(diff);
                                    org01.setGoalPos(newGoal);
                                }
                            }
                        } else {
                            if (org01.stage == "h" && orgGroup01.diet == orgGroup02.type) {
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
                                        org01.hunger = 100;
                                        orgGroup02.removeById(closestOrg.id);
                                    } else if (closestOrg.d <= org01.detectRadius) {
                                        org01.setGoalPos(
                                            org01.pos.add(closestOrg.org.velocity)
                                        );
                                    }
                                }

                            } else if (org01.stage == "m" && orgGroup01.type == orgGroup02.type) {
                                orgGroup02.population.forEach(org02 => {
                                    if (org01.gender != org02.gender) {
                                        currentOrg = org01.interaction(org02);
                                        if (closestOrg == null || (currentOrg.rating > closestOrg.rating && currentOrg.d < closestOrg.d)) {
                                            closestOrg = {
                                                org: org02,
                                                d: currentOrg.d,
                                                rating: currentOrg.rating
                                            };
                                        }
                                    }
                                });
                                if (closestOrg != null) {
                                    if (closestOrg.d < org01.size) {
                                        org01.matingInterval = 100;
                                        closestOrg.org.matingInterval = 100;
                                        orgGroup01.spawnChild(org01, closestOrg.org);
                                    } else if (closestOrg.d <= org01.detectRadius) {
                                        org01.setGoalPos(
                                            org01.pos.add(closestOrg.org.velocity)
                                        );
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