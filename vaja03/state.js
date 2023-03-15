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
        let diet = null;
        let range = null;
        this.organismGroups.forEach(orgGroup => {
            diet = orgGroup.conf.diet;
            this.organismGroups.forEach(orgGroup2 => {
                if (diet == "all" || orgGroup2.conf.type == diet) {
                    orgGroup.population.forEach(org => {
                        orgGroup2.population.forEach(org2 => {
                            if (org.eatenFood < 2 && org.trueEnergy > 0) {
                                range = org.inRangeOfInteraction(org2);
                                if (range == 1) {
                                    orgGroup2.removeById(org2.id);
                                } else if (range == 2) {
                                    org.setGoalPos(org2.pos.add(org2.velocity));
                                }
                            }
                            range = org2.inRangeOfInteraction(org);
                            if (range == 3) {
                                let diff = org.pos.subtract(org2.pos);
                                diff = diff.multiply(-4);
                                let newGoal = org2.pos.add(diff);

                                org2.setGoalPos(newGoal);
                            }
                        });
                    });
                }
            });
        });
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