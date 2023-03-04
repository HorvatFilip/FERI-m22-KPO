class GuiLogic {
    constructor() {
        this.toggleSim_btn = document.getElementById("toggle-sim-btn");
        this.openAddElems_btn = document.getElementById("open-add-elements");
        this.closeAddElems_btn = document.getElementById("close-add-elements");
        this.addElems_menu = document.getElementById("add-elements-menu");
    }

    addEventListeners() {
        this.toggleSim_btn.addEventListener("click", () => {
            run = !run;
        });

        this.openAddElems_btn.addEventListener("click", () => {
            this.refreshOrganismGroupList();
            this.addElems_menu.style.width = "fit-content";
        });
        this.closeAddElems_btn.addEventListener("click", () => {
            this.addElems_menu.style.width = "0";
        });
    }

    refreshOrganismGroupList(organismGroups) {
        organismGroups.forEach(orgGroup => {

        });

    }

    // this.type = type;
    // this.rp = rp;
    // this.sp = sp;
    // this.k = k;
    // this.orgSize = orgSize;
    // this.orgColor = orgColor;
    // this.spawnPoint = spawnPoint;
    // this.spawnVelocity = spawnVelocity;
    // this.popSize = 0;
    // this.population = [];
}
