class State {
    constructor(display, organismGroups) {
        this.display = display;
        this.organismGroups = organismGroups;
    }
    updateOrganismGroups(updatedOrganismGroups) {
        this.organismGroups = updatedOrganismGroups;
    }
    startFeedingStage() {
        this.organismGroups.forEach(orgGroup => {
            orgGroup.changeStage("feeding");
        });
    }
    startRestingStage() {
        this.organismGroups.forEach(orgGroup => {
            orgGroup.changeStage("resting");
        });
    }
    searchForFood() {
        let diet = null;
        let range = null;
        this.organismGroups.forEach(orgGroup => {
            diet = orgGroup.conf.diet;
            this.organismGroups.forEach(orgGroup2 => {
                if (orgGroup2.conf.type == diet) {
                    orgGroup.population.forEach(org => {
                        orgGroup2.population.forEach(org2 => {
                            range = org.inRangeOfInteraction(org2);
                            if (range == 1) {
                                orgGroup2.removeById(org2.id);
                            } else if (range == 2) {
                                org.setGoalPos(org2.pos);
                            }
                            range = org2.inRangeOfInteraction(org);
                            if (range == 2) {
                                let buffer = new Vector(org.velocity.x, org.velocity.y);
                                if (buffer.x < 0) {
                                    buffer.x -= Math.random() * 2;
                                } else {
                                    buffer.x += Math.random() * 2;
                                }
                                if (buffer.y < 0) {
                                    buffer.y -= Math.random() * 2;
                                } else {
                                    buffer.y += Math.random() * 2;
                                }

                                console.log(buffer);
                                let newGoal = org2.pos.add(buffer);

                                //let rnd = new Vector(Math.random() * 3, Math.random() * 3)
                                //newGoal = newGoal.add(rnd);
                                // rnd = new Vector(2, 2)
                                //newGoal = newGoal.addScalar(2);
                                org2.setGoalPos(newGoal);
                            }
                        });
                    });
                }
            });
        });
    }
    checkForPredators() {
        let type = null;
        let tmpVec = null;
        this.organismGroups.forEach(orgGroup => {
            type = orgGroup.conf.type;
            this.organismGroups.forEach(orgGroup2 => {
                if (orgGroup2.conf.diet == type) {
                    orgGroup.population.forEach(org => {
                        orgGroup2.population.forEach(org2 => {
                            if (org.inDetectRange(org2)) {
                                org.setGoalPos(org2.velocity);
                            }
                        });
                    });
                }
            });
        });
    }
    update() {
        let organismGroups = this.organismGroups.map(orgGroup => {
            //orgGroup.updatePopulation();
            return orgGroup.updatePosition(this);
        });
        return new State(this.display, organismGroups);
    }
}