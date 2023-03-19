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
        let plant;
        let foodLeft = 0;
        let foodIndx = -1;
        this.organismGroups.forEach(orgGroup => {
            console.log(orgGroup.conf.type)
            if (orgGroup.conf.type == "plant") {
                plants = orgGroup;
                foodLeft = orgGroup.population.length;
            }
        });
        let count = 0;
        this.organismGroups.forEach(orgGroup =>{
            if (orgGroup.conf.type != "plant") {
                orgGroup.population.forEach(org => {
                    count = 0;
                    while (org.foodId == null && count < foodLeft){
                        count++;
                        foodIndx = Math.floor(Math.random() * plants.population.length);
                        if (plants.population[foodIndx].eatenBy.length < 2){
                            plants.population[foodIndx].eatenBy.push(org.id);
                            org.foodId = plants.population[foodIndx].id;
                            org.setGoalPos(
                                orgGroup.getRandomPointOnCircle(10, plants.population[foodIndx].pos)
                            );
                            foodLeft--;
                            if(foodLeft == 0){
                                return;
                            }
                        }
                    }
                });
            }
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