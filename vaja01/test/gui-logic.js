class GuiLogic {
    constructor() {
        this.toggleSim_btn = document.getElementById("toggle-sim-btn");
        this.openEcoElems_btn = document.getElementById("open-eco-elements-menu");
        this.closeEcoElems_btn = document.getElementById("close-eco-elements-menu");
        this.ecoElems_menu = document.getElementById("eco-elements-menu");
        this.ecoElems_list = document.getElementById("eco-elements-groups-list");
        this.ecoElemsAdd_btn = document.getElementById("eco-elements-groups-add");
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
    }
    addEventListeners() {
        //this.toggleSim_btn.addEventListener("click", () => {
        //    run = !run;
        //});
        this.openEcoElems_btn.addEventListener("click", () => {
            this.refreshOrganismGroupList();
            this.ecoElems_menu.style.width = "375px";
        });
        this.closeEcoElems_btn.addEventListener("click", () => {
            this.ecoElems_menu.style.width = "0px";
        });
        this.ecoElemsAdd_btn.addEventListener("click", () => {
            this.addNewOrganismGroupUI();
        });

    }
    addEcoSystemToGui(ecoSystem) {
        this.ecoSystem = ecoSystem;
    }
    refreshOrganismGroupList() {
        this.ecoSystem.organismGroups.forEach(orgGroup => {
            if (this.ecoElems_list.querySelectorAll("#" + orgGroup.type).length === 0) {
                const newEcoElem = document.createElement("div");
                const header = document.createElement("div");
                const headerDisplayColor = document.createElement("div");
                const headerText = document.createElement("span");
                const body = document.createElement("div");
                const saveBtn = document.createElement("button");


                headerDisplayColor.style.backgroundColor = orgGroup.orgColor;
                headerText.innerHTML = orgGroup.type;
                saveBtn.innerHTML = "Save";

                newEcoElem.setAttribute("id", orgGroup.type);
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
