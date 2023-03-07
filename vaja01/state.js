class State {
    constructor(display, organismGroups) {
        this.display = display;
        this.organismGroups = organismGroups;
        this.timePassed = 0;
    }
    updateOrganismGroups(updatedOrganismGroups) {
        this.organismGroups = updatedOrganismGroups;
    }
    update() {
        this.timePassed += 0.1;

        let organismGroups = this.organismGroups.map(orgGroup => {
            if (Math.floor(this.timePassed) % 5 == 0) {
                orgGroup.updatePopulation();
            }
            return orgGroup.updatePosition(this);
        });
        return new State(this.display, organismGroups, this.timePassed);
    }
}