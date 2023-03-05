class GuiLogic {
    constructor() {
        this.toggleSim_btn = document.getElementById("toggle-sim-btn");
        this.openEcoElems_btn = document.getElementById("open-eco-elements-menu");
        this.closeEcoElems_btn = document.getElementById("close-eco-elements-menu");
        this.ecoElems_menu = document.getElementById("eco-elements-menu");
        this.ecoElems_list = document.getElementById("eco-elements-groups-list");
    }
    addEventListeners() {
        this.toggleSim_btn.addEventListener("click", () => {
            run = !run;
        });

        this.openEcoElems_btn.addEventListener("click", () => {
            this.refreshOrganismGroupList();
            this.ecoElems_menu.style.width = "fit-content";
        });
        this.closeEcoElems_btn.addEventListener("click", () => {
            this.ecoElems_menu.style.width = "0";
        });
    }
    addEcoSystemToGui(ecoSystem) {
        this.ecoSystem = ecoSystem;
    }
    refreshOrganismGroupList() {
        this.ecoSystem.organismGroups.forEach(orgGroup => {
            if (this.ecoElems_list.querySelectorAll("#"+orgGroup.type).length === 0) {
                const newEcoElem = document.createElement("div");
                const header = document.createAttribute("div");
                const footer = document.createAttribute("div");
                
                newEcoElem.setAttribute("id", orgGroup.type);
                newEcoElem.setAttribute("class", "eco-elem");
                header.setAttribute("class", "eco-elem-header");
                footer.setAttribute("class", "eco-elem-footer");

                header.innerHTML = orgGroup.type;
                
                newEcoElem.appendChild(header);
                newEcoElem.appendChild(footer);
                this.ecoElems_list.appendChild(newEcoElem);
            }
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
