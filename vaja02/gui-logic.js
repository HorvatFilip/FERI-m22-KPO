class GuiLogic {
    constructor() {
        this.toggleSim_btn = document.getElementById("start-stop-control");
        this.resetSim_btn = document.getElementById("reset-control");
        this.openEcoElems_btn = document.getElementById("open-eco-elements-menu");
        this.closeEcoElems_btn = document.getElementById("close-eco-elements-menu");
        this.ecoElems_menu = document.getElementById("eco-elements-menu");
        this.ecoElems_list = document.getElementById("eco-elements-groups-list");
        this.ecoElemsAdd_btn = document.getElementById("eco-elements-groups-add");
        this.toggleChartDisplay_btn = document.getElementById("open-chart-display");
        this.closeChartDisplay_btn = document.getElementById("close-chart-display");
        this.chartDisplay_menu = document.getElementById("chart-display");
        this.chartDisplayList = document.getElementById("chart-display-list");
        this.inputs = [];
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
            //this.loadScenario01();
            this.loadSimScenarioFromUI();
        });
        this.toggleChartDisplay_btn.addEventListener("click", () => {
            if (this.chartDisplay_menu.style.width == "0px" || this.chartDisplay_menu.style.width == "") {
                //this.refreshOrganismGroupList();
                this.chartDisplay_menu.style.width = "500px";
            } else {
                this.chartDisplay_menu.style.width = "0px";
            }

        });
        this.closeChartDisplay_btn.addEventListener("click", () => {
            this.chartDisplay_menu.style.width = "0px";
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
                const colorInput = document.createElement("input");
                const orgSizeInput = document.createElement("input");
                const popSizeInput = document.createElement("input");
                const rpInput = document.createElement("input");
                const spInput = document.createElement("input");
                const kInput = document.createElement("input");
                const spawnXInput = document.createElement("input");
                const spawnYInput = document.createElement("input");
                const spawnInputClick = document.createElement("div");
                this.inputs.push([typeInput, colorInput, orgSizeInput, popSizeInput, rpInput, spInput, kInput, spawnXInput, spawnYInput]);

                typeInput.setAttribute("type", "text");
                colorInput.setAttribute("type", "color");
                popSizeInput.setAttribute("type", "number");
                orgSizeInput.setAttribute("type", "number");
                rpInput.setAttribute("type", "number");
                spInput.setAttribute("type", "number");

                kInput.setAttribute("type", "number");
                spawnXInput.setAttribute("type", "number");
                spawnYInput.setAttribute("type", "number");

                typeInput.setAttribute("placeholder", "Type");
                popSizeInput.setAttribute("placeholder", "Pop Size")
                orgSizeInput.setAttribute("placeholder", "Org Size");
                rpInput.setAttribute("placeholder", "R");
                spInput.setAttribute("placeholder", "S");
                kInput.setAttribute("placeholder", "K");
                spawnXInput.setAttribute("placeholder", "X");
                spawnYInput.setAttribute("placeholder", "Y");

                typeInput.value = orgGroup.type;
                colorInput.value = orgGroup.orgColor;
                popSizeInput.value = orgGroup.initialPopSize;
                orgSizeInput.value = orgGroup.orgSize;
                rpInput.value = orgGroup.rp;
                spInput.value = orgGroup.sp;
                kInput.value = orgGroup.k;
                spawnXInput.value = orgGroup.spawnPoint.x;
                spawnYInput.value = orgGroup.spawnPoint.y;

                header.addEventListener("click", () => {
                    if (body.style.display == "none" || body.style.display == "") {
                        body.style.display = "flex";

                    } else {
                        body.style.display = "none";
                    }
                });

                saveBtn.addEventListener("click", () => {
                    headerDisplayColor.style.backgroundColor = colorInput.value;
                    const config = {
                        type: typeInput.value,
                        orgColor: colorInput.value,
                        popSize: popSizeInput.value,
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
                const forthRow = document.createElement("div");

                firstRow.setAttribute("class", "eco-elem-row");
                secondRow.setAttribute("class", "eco-elem-row");
                thirdRow.setAttribute("class", "eco-elem-row");
                forthRow.setAttribute("class", "eco-elem-row");

                header.appendChild(headerDisplayColor);
                header.appendChild(headerText);
                header.appendChild(headerDisplayPopSize);
                firstRow.appendChild(colorInput);
                secondRow.appendChild(typeInput);
                secondRow.appendChild(orgSizeInput);
                secondRow.appendChild(popSizeInput);
                thirdRow.appendChild(rpInput);
                thirdRow.appendChild(spInput);
                thirdRow.appendChild(kInput);
                forthRow.appendChild(spawnXInput);
                forthRow.appendChild(spawnYInput);
                body.appendChild(firstRow);
                body.appendChild(secondRow);
                body.appendChild(thirdRow);
                body.appendChild(forthRow);
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

        let rndVel = Math.random() * 20;
        let spawnVelocity = new Vector(rndVel, rndVel);
        let spawnPoint = new Vector(Math.random() * 800 + 100, Math.random() * 800 + 100);
        let organismGroup_Insects = new OrganismGroup("insect", 10, 0.2, 0.1, 0.0005, 2, "#4C9900", spawnPoint, spawnVelocity);

        spawnVelocity = new Vector(Math.random() * 4, Math.random() * 4);
        spawnPoint = new Vector(Math.random() * 800 + 100, Math.random() * 800 + 100);
        let organismGroup_Birds = new OrganismGroup("bird", 8, 0.1, 0.04, 0.0007, 4, "#004C99", spawnPoint, spawnVelocity);

        spawnVelocity = new Vector(Math.random() * 4, Math.random() * 4);
        spawnPoint = new Vector(Math.random() * 800 + 100, Math.random() * 800 + 100);
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
    loadSimScenarioFromUI() {
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

        let dateTimeTracker = new DateTimeTracker();
        let ecoSystem = new EcoSystem("eco01", "normal", dateTimeTracker);
        let defaultOrgs = [];
        this.ecoSystem.organismGroups.forEach(orgGroup => {
            defaultOrgs.push(orgGroup.type);
        });

        this.inputs.forEach(inputGroup => {
            let indx = defaultOrgs.indexOf(inputGroup[0].value);
            defaultOrgs.splice(indx, 1);
            let rndVelocity = Math.random() * 20;
            let spawnVelocity = new Vector(rndVelocity, rndVelocity);
            let spawnPoint = new Vector(parseInt(inputGroup[7].value), parseInt(inputGroup[8].value));
            console.log(inputGroup[3].value);

            let newOrgGroup = new OrganismGroup(inputGroup[0].value, inputGroup[3].value, inputGroup[4].value, inputGroup[5].value, inputGroup[6].value, inputGroup[2].value, inputGroup[1].value, spawnPoint, spawnVelocity);
            console.log(newOrgGroup);
            ecoSystem.addOrganismGroup(newOrgGroup);
        });
        console.log(defaultOrgs);


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
        let prevHour = 0;
        let prevDay = 0;
        this.runAnimation(time => {
            if (this.run) {
                if (prevHour !== this.ecoSystem.dateTime.getHours()) {
                    prevHour = this.ecoSystem.dateTime.getHours();
                    this.state.updateOrganismGroups(this.ecoSystem.organismGroups);
                    this.state = this.state.update();

                    this.drawComponent.syncSimData(this.state);
                }
                if (prevDay != this.ecoSystem.dateTime.getDays()) {
                    prevDay = this.ecoSystem.dateTime.getDays();
                    this.updateOrganismPopSizeUI();
                    this.drawComponent.updateChartPoints(this.state.organismGroups);
                    this.drawComponent.syncInfoData(this.state);
                }
            }
        });
    }
}
