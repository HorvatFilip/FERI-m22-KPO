class State {
    constructor(display, organismGroups) {
        this.display = display;
        this.organismGroups = organismGroups;
    }
    updateOrganismGroups(updatedOrganismGroups) {
        this.organismGroups = updatedOrganismGroups;
    }
    update() {
        let organismGroups = this.organismGroups.map(orgGroup => {
            //orgGroup.updatePopulation();
            return orgGroup.updatePosition(this);
        });
        return new State(this.display, organismGroups);
    }
}