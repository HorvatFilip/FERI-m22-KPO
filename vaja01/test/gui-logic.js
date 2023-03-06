class GuiLogic {
    constructor() {
        this.toggleSim_btn = document.getElementById("start-stop-control");
        this.resetSim_btn = document.getElementById("reset-control");
        this.openEcoElems_btn = document.getElementById("open-eco-elements-menu");
        this.closeEcoElems_btn = document.getElementById("close-eco-elements-menu");
        this.ecoElems_menu = document.getElementById("eco-elements-menu");
        this.ecoElems_list = document.getElementById("eco-elements-groups-list");
        this.ecoElemsAdd_btn = document.getElementById("eco-elements-groups-add");
    }
    addEventListeners() {
        this.openEcoElems_btn.addEventListener("click", () => {
            if (this.ecoElems_menu.style.width == "0px" || this.ecoElems_menu.style.width == "") {
                this.refreshOrganismGroupList();
                this.ecoElems_menu.style.width = "375px";
            } else {
                this.ecoElems_menu.style.width = "0px";
            }

        });
        this.closeEcoElems_btn.addEventListener("click", () => {
            this.ecoElems_menu.style.width = "0px";
        });
        this.ecoElemsAdd_btn.addEventListener("click", () => {
            this.addNewOrganismGroupUI();
        });
        this.toggleSim_btn.addEventListener("click", () => {
            this.run = !this.run;
        });
        this.resetSim_btn.addEventListener("click", () => {
            this.loadScenario01();
        });

    }
    addEcoSystemToGui(ecoSystem) {
        this.ecoSystem = ecoSystem;
    }
    refreshOrganismGroupList() {
        this.ecoSystem.organismGroups.forEach(orgGroup => {
            if (this.ecoElems_list.querySelectorAll("#" + orgGroup.type + "-eco-elem").length === 0) {
                const newEcoElem = document.createElement("div");
                const header = document.createElement("div");
                const headerDisplayColor = document.createElement("div");
                const headerText = document.createElement("span");
                const headerDisplayPopSize = document.createElement("span");
                const body = document.createElement("div");
                const saveBtn = document.createElement("button");


                headerDisplayColor.style.backgroundColor = orgGroup.orgColor;
                headerText.innerHTML = orgGroup.type;
                headerDisplayPopSize.innerHTML = orgGroup.popSize;
                saveBtn.innerHTML = "Save";

                newEcoElem.setAttribute("id", orgGroup.type + "-eco-elem");
                headerDisplayPopSize.setAttribute("id", orgGroup.type + "-popsize");
                newEcoElem.setAttribute("class", "eco-elem");
                header.setAttribute("class", "eco-elem-header");
                headerDisplayColor.setAttribute("class", "eco-elem-display-color");
                body.setAttribute("class", "eco-elem-body");
                saveBtn.setAttribute("class", "btn btn-secondary");

                const typeInput = document.createElement("input");
                const orgSizeInput = document.createElement("input");
                const colorInput = document.createElement("input");
                const rpInput = document.createElement("input");
                const spInput = document.createElement("input");
                const kInput = document.createElement("input");
                const spawnXInput = document.createElement("input");
                const spawnYInput = document.createElement("input");
                const spawnInputClick = document.createElement("div");

                typeInput.setAttribute("type", "text");
                orgSizeInput.setAttribute("type", "number");
                colorInput.setAttribute("type", "color");
                rpInput.setAttribute("type", "number");
                spInput.setAttribute("type", "number");
                kInput.setAttribute("type", "number");
                spawnXInput.setAttribute("type", "number");
                spawnYInput.setAttribute("type", "number");

                typeInput.setAttribute("placeholder", "Type");
                orgSizeInput.setAttribute("placeholder", "Size");
                rpInput.setAttribute("placeholder", "R");
                spInput.setAttribute("placeholder", "S");
                kInput.setAttribute("placeholder", "K");
                spawnXInput.setAttribute("placeholder", "X");
                spawnYInput.setAttribute("placeholder", "Y");

                header.addEventListener("click", () => {
                    if (body.style.display == "none" || body.style.display == "") {
                        body.style.display = "flex";
                        typeInput.value = orgGroup.type;
                        colorInput.value = orgGroup.orgColor;
                        orgSizeInput.value = orgGroup.orgSize;
                        rpInput.value = orgGroup.rp;
                        spInput.value = orgGroup.sp;
                        kInput.value = orgGroup.k;
                        spawnXInput.value = orgGroup.spawnPoint.x;
                        spawnYInput.value = orgGroup.spawnPoint.y;
                    } else {
                        body.style.display = "none";
                    }
                });

                saveBtn.addEventListener("click", () => {
                    headerDisplayColor.style.backgroundColor = colorInput.value;
                    const config = {
                        type: typeInput.value,
                        orgColor: colorInput.value,
                        orgSize: orgSizeInput.value,
                        rp: rpInput.value,
                        sp: spInput.value,
                        k: kInput.value,
                        spawnPoint: [parseInt(spawnXInput.value), parseInt(spawnYInput.value)]
                    };
                    this.ecoSystem.changeOrganismGroupSpecs(orgGroup.type, config);
                });

                const firstRow = document.createElement("div");
                const secondRow = document.createElement("div");
                const thirdRow = document.createElement("div");

                firstRow.setAttribute("class", "eco-elem-row");
                secondRow.setAttribute("class", "eco-elem-row");
                thirdRow.setAttribute("class", "eco-elem-row");

                header.appendChild(headerDisplayColor);
                header.appendChild(headerText);
                header.appendChild(headerDisplayPopSize);
                firstRow.appendChild(typeInput);
                firstRow.appendChild(orgSizeInput);
                firstRow.appendChild(colorInput);
                secondRow.appendChild(rpInput);
                secondRow.appendChild(spInput);
                secondRow.appendChild(kInput);
                thirdRow.appendChild(spawnXInput);
                thirdRow.appendChild(spawnYInput);
                body.appendChild(firstRow);
                body.appendChild(secondRow);
                body.appendChild(thirdRow);
                body.appendChild(saveBtn);
                newEcoElem.appendChild(header);
                newEcoElem.appendChild(body);
                this.ecoElems_list.appendChild(newEcoElem);
            }
        });
    }
    addNewOrganismGroupUI() {

    }
    loadScenario01() {
        const simCanvasConf = {
            id: "simulation-canvas",
            width: 1000,
            height: 1000
        };
        const infoCanvasConf = {
            id: "information-canvas",
            width: 500,
            height: 500
        };
        this.drawComponent = new DrawComponent(simCanvasConf, infoCanvasConf);
        this.run = true;

        let spawnVelocity = new Vector(Math.random() * 4, Math.random() * 4);
        let spawnPoint = new Vector(Math.random() * 900 + 100, Math.random() * 900 + 100);
        let organismGroup_Insects = new OrganismGroup("insect", 10, 0.2, 0.1, 0.0005, 2, "#4C9900", spawnPoint, spawnVelocity);

        spawnVelocity = new Vector(Math.random() * 4, Math.random() * 4);
        spawnPoint = new Vector(Math.random() * 800 + 100, Math.random() * 800 + 100);
        let organismGroup_Birds = new OrganismGroup("bird", 8, 0.1, 0.04, 0.0007, 4, "#004C99", spawnPoint, spawnVelocity);

        spawnVelocity = new Vector(Math.random() * 4, Math.random() * 4);
        spawnPoint = new Vector(Math.random() * 900 + 100, Math.random() * 900 + 100);
        let organismGroup_Cats = new OrganismGroup("cat", 2, 0.05, 0.02, 0.001, 8, "#000000", spawnPoint, spawnVelocity);

        let organismGroups = [organismGroup_Insects, organismGroup_Birds, organismGroup_Cats];

        const dateTimeTracker = new DateTimeTracker();

        let ecoSystem = new EcoSystem("eco01", "normal", dateTimeTracker);
        ecoSystem.addOrganismGroup(organismGroup_Insects);
        ecoSystem.addOrganismGroup(organismGroup_Birds);
        ecoSystem.addOrganismGroup(organismGroup_Cats);

        this.addEcoSystemToGui(ecoSystem);
        this.startAnimation();
    }
    updateOrganismPopSizeUI() {
        this.ecoSystem.organismGroups.forEach(orgGroup => {
            const ecoElem = document.getElementById(orgGroup.type + "-popsize");
            if (ecoElem !== null) {
                ecoElem.innerHTML = orgGroup.popSize;
            }
        });
    }
    runAnimation(animation) {
        let lastTime = null;
        const frame = (time) => {
            if (lastTime != null) {
                const timeStep = Math.min(100, time - lastTime) / 1000;

                if (animation(timeStep) === false) {
                    return;
                }
            }
            lastTime = time;
            requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }
    startAnimation() {
        this.state = new State(this.drawComponent, this.ecoSystem.organismGroups, 0);
        this.runAnimation(time => {
            if (this.run) {
                this.state.updateOrganismGroups(this.ecoSystem.organismGroups);
                this.state = this.state.update();
                this.updateOrganismPopSizeUI();
                this.drawComponent.sync(this.state);
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
