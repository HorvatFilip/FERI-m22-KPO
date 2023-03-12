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
            if (this.ecoElems_list.querySelectorAll("#" + orgGroup.id + "-eco-elem").length === 0) {
                const newEcoElem = document.createElement("div");
                const header = document.createElement("div");
                const headerDisplayColor = document.createElement("div");
                const headerText = document.createElement("span");
                const headerDisplayPopSize = document.createElement("span");
                const body = document.createElement("div");
                const saveBtn = document.createElement("button");


                headerDisplayColor.style.backgroundColor = orgGroup.orgColor;
                headerText.innerHTML = orgGroup.conf.type;
                headerDisplayPopSize.innerHTML = orgGroup.popSize;
                saveBtn.innerHTML = "Save";

                newEcoElem.setAttribute("id", orgGroup.id + "-eco-elem");
                headerDisplayPopSize.setAttribute("id", orgGroup.id + "-popsize");
                newEcoElem.setAttribute("class", "eco-elem");
                header.setAttribute("class", "eco-elem-header");
                headerDisplayColor.setAttribute("class", "eco-elem-display-color");
                body.setAttribute("class", "eco-elem-body");
                saveBtn.setAttribute("class", "btn btn-secondary");

                const popSizeInput = document.createElement("input");
                const spawnInputClick = document.createElement("div");
                const spawnInputIcon = document.createElement("i");
                const homeXInput = document.createElement("input");
                const homeYInput = document.createElement("input");
                const orgMaxVelocityInput = document.createElement("input");
                const orgSizeInput = document.createElement("input");
                const orgDetectInput = document.createElement("input");
                const orgBaseEnergyInput = document.createElement("input");
                const orgMaxVelocityInputLabel = document.createElement("label");
                const orgSizeInputLabel = document.createElement("label");
                const orgDetectInputLabel = document.createElement("label");
                const orgBaseEnergyInputLabel = document.createElement("label");
                this.inputs.push([popSizeInput, homeXInput, homeYInput, orgMaxVelocityInput, orgSizeInput, orgDetectInput, orgBaseEnergyInput]);

                spawnInputIcon.setAttribute("class", "fa-solid fa-house");

                popSizeInput.setAttribute("type", "number");
                homeXInput.setAttribute("type", "number");
                homeYInput.setAttribute("type", "number");
                orgMaxVelocityInput.setAttribute("type", "number");
                orgSizeInput.setAttribute("type", "number");
                orgDetectInput.setAttribute("type", "number");
                orgBaseEnergyInput.setAttribute("type", "number");

                popSizeInput.setAttribute("placeholder", "Pop size");
                homeXInput.setAttribute("placeholder", "X");
                homeYInput.setAttribute("placeholder", "Y");
                orgMaxVelocityInput.setAttribute("placeholder", "MaxVel");
                orgSizeInput.setAttribute("placeholder", "Org size");
                orgDetectInput.setAttribute("placeholder", "Detect");
                orgBaseEnergyInput.setAttribute("placeholder", "Energy");


                orgMaxVelocityInputLabel.innerHTML = "Max velocity";
                orgSizeInputLabel.innerHTML = "Org Size";
                orgDetectInputLabel.innerHTML = "Detect Range";
                orgBaseEnergyInputLabel.innerHTML = "Base Energy";

                popSizeInput.value = orgGroup.conf.initialPopSize;
                homeXInput.value = orgGroup.conf.homePos.x;
                homeYInput.value = orgGroup.conf.homePos.y;
                orgMaxVelocityInput.value = orgGroup.conf.orgMaxVelocity;
                orgSizeInput.value = orgGroup.conf.orgSize;
                orgDetectInput.value = orgGroup.conf.detectRadius;
                orgBaseEnergyInput.value = orgGroup.conf.baseEnergy;

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
                        initialPopSize: popSizeInput.value,
                        orgMaxVelocity: orgMaxVelocityInput.value,
                        orgSize: orgSizeInput.value,
                        detectRadius: orgDetectInput.value,
                        baseEnergy: orgBaseEnergyInput.value,
                        homePos: [parseInt(homeXInput.value), parseInt(homeYInput.value)]
                    };
                    this.ecoSystem.changeOrganismGroupSpecs(orgGroup.type, config);
                });

                const firstRow = document.createElement("div");
                const secondRow = document.createElement("div");
                const thirdRow = document.createElement("div");
                const forthRow = document.createElement("div");
                const fifthRow = document.createElement("div");

                firstRow.setAttribute("class", "eco-elem-row");
                secondRow.setAttribute("class", "eco-elem-row");
                thirdRow.setAttribute("class", "eco-elem-row");
                forthRow.setAttribute("class", "eco-elem-row");
                fifthRow.setAttribute("class", "eco-elem-row");

                header.appendChild(headerDisplayColor);
                header.appendChild(headerText);
                header.appendChild(headerDisplayPopSize);
                spawnInputClick.appendChild(spawnInputIcon);
                firstRow.appendChild(popSizeInput);
                firstRow.appendChild(spawnInputClick);
                firstRow.appendChild(homeXInput);
                firstRow.appendChild(homeYInput);
                secondRow.appendChild(orgMaxVelocityInputLabel);
                secondRow.appendChild(orgMaxVelocityInput);
                thirdRow.appendChild(orgSizeInputLabel);
                thirdRow.appendChild(orgSizeInput);
                forthRow.appendChild(orgDetectInputLabel);
                forthRow.appendChild(orgDetectInput);
                fifthRow.appendChild(orgBaseEnergyInputLabel);
                fifthRow.appendChild(orgBaseEnergyInput);
                body.appendChild(firstRow);
                body.appendChild(secondRow);
                body.appendChild(thirdRow);
                body.appendChild(forthRow);
                body.appendChild(fifthRow);
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

        const orgGroup01Conf = {
            type: "insect",
            orgColor: "#4C9900",
            orgSize: 2,
            orgMaxVelocity: 3,
            detectRadius: 20,
            baseEnergy: 50,
            diet: "plant",
            homePos: {
                x: 300, y: 300
            },
            feedingPos: {
                x: 450, y: 450
            },
            initialPopSize: 50
        };
        const orgGroup02Conf = {
            type: "bird",
            orgColor: "#004C99",
            orgSize: 4,
            orgMaxVelocity: 3.5,
            detectRadius: 40,
            baseEnergy: 50,
            diet: "insect",
            homePos: {
                x: 700, y: 700
            },
            feedingPos: {
                x: 500, y: 500
            },
            initialPopSize: 5
        };

        const dateTimeTracker = new DateTimeTracker();

        let ecoSystem = new EcoSystem("eco01", "normal", dateTimeTracker);
        ecoSystem.addOrganismGroup(orgGroup01Conf);
        ecoSystem.addOrganismGroup(orgGroup02Conf);

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
            ecoSystem.addOrganismGroup(newOrgGroup);
        });

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
        this.state = new State(this.drawComponent, this.ecoSystem.organismGroups);
        let prevHour = this.ecoSystem.dateTime.getHours() - 1;
        let prevDay = this.ecoSystem.dateTime.getDays() - 1;
        let currStage = "resting";
        this.runAnimation(time => {
            if (this.run) {
                if (prevHour !== this.ecoSystem.dateTime.getHours()) {
                    prevHour = this.ecoSystem.dateTime.getHours();
                    this.state.updateOrganismGroups(this.ecoSystem.organismGroups);
                    if (currStage == "feeding") {
                        this.state.searchForFood();
                        //this.state.checkForPredators();
                    }
                    this.state = this.state.update();
                    this.drawComponent.syncSimData(this.state);
                }
                if (prevDay != this.ecoSystem.dateTime.getDays()) {
                    prevDay = this.ecoSystem.dateTime.getDays();
                    if (currStage == "resting") {
                        this.state.startFeedingStage();
                        currStage = "feeding";
                    } else if (currStage == "feeding") {
                        this.state.startRestingStage();
                        currStage = "resting";
                    }
                    //this.updateOrganismPopSizeUI();
                    //this.drawComponent.updateChartPoints(this.state.organismGroups);
                    //this.drawComponent.syncInfoData(this.state);
                }
            }
        });
    }
}
