class GuiLogic {
    constructor() {
        this.drawComponent = null;
        this.ecoSystem = null;
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
        this.simCanvas_canvas = document.getElementById("simulation-canvas");
        this.hourDisplay_display = document.getElementById("time-display-hours");
        this.chartDisplay_list = document.getElementById("chart-display-list");
        this.timeControlMinus_btn = document.getElementById("time-controller-minus")
        this.timeControlPlus_btn = document.getElementById("time-controller-plus")
        this.timeControl_display = document.getElementById("time-controller-display-progress");
        this.timeControl_display.style.width = "20%";
        this.timeSpeed = 3;
        this.timeControl_display.style.width = this.timeSpeed * 20 + "%";
        this.frameRef = null;
        this.inputs = {};
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
            this.ecoSystem.dateTime.toggleTimePassage(this.run);
        });
        this.resetSim_btn.addEventListener("click", () => {
            this.loadSimScenarioFromUI();
        });
        this.toggleChartDisplay_btn.addEventListener("click", () => {
            if (this.chartDisplay_menu.style.width == "0px" || this.chartDisplay_menu.style.width == "") {
                this.chartDisplay_menu.style.width = "500px";
            } else {
                this.chartDisplay_menu.style.width = "0px";
            }
        });
        this.closeChartDisplay_btn.addEventListener("click", () => {
            this.chartDisplay_menu.style.width = "0px";
        });
        this.timeControlPlus_btn.addEventListener("click", () => {
            if (this.timeSpeed < 5) {
                this.timeSpeed++;
            }
            this.setTimeProgressDisplayWidth();
        });
        this.timeControlMinus_btn.addEventListener("click", () => {
            if (this.timeSpeed > 1) {
                this.timeSpeed--;
            }
            this.setTimeProgressDisplayWidth();
        });
    }
    setTimeProgressDisplayWidth() {
        let progress = this.timeSpeed * 20 + "%";
        this.timeControl_display.style.width = progress;
        this.ecoSystem.changeTimePassingSpeed(this.timeSpeed);
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

                headerDisplayColor.style.backgroundColor = orgGroup.conf.orgColor;
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
                const homeInputClick = document.createElement("div");
                const homeInputIcon = document.createElement("i");
                const homeXInput = document.createElement("input");
                const homeYInput = document.createElement("input");
                const feedingInputClick = document.createElement("div");
                const feedingInputIcon = document.createElement("i");
                const feedingXInput = document.createElement("input");
                const feedingYInput = document.createElement("input");
                const orgMaxVelocityInput = document.createElement("input");
                const orgSizeInput = document.createElement("input");
                const orgDetectInput = document.createElement("input");
                const orgBaseEnergyInput = document.createElement("input");
                const dietInput = document.createElement("input");
                const dietInputLabel = document.createElement("label");
                const popSizeInputLabel = document.createElement("label");
                const orgMaxVelocityInputLabel = document.createElement("label");
                const orgSizeInputLabel = document.createElement("label");
                const orgDetectInputLabel = document.createElement("label");
                const orgBaseEnergyInputLabel = document.createElement("label");
                this.inputs[orgGroup.id] = [popSizeInput, homeXInput, homeYInput, feedingXInput, feedingYInput, orgMaxVelocityInput, orgSizeInput, orgDetectInput, orgBaseEnergyInput, dietInput];

                homeInputClick.setAttribute("class", "btn btn-outline-secondary");
                homeInputIcon.setAttribute("class", "fa-solid fa-house");
                feedingInputClick.setAttribute("class", "btn btn-outline-secondary");
                feedingInputIcon.setAttribute("class", "fa-solid fa-carrot");

                homeXInput.setAttribute("type", "number");
                homeYInput.setAttribute("type", "number");
                feedingXInput.setAttribute("type", "number");
                feedingYInput.setAttribute("type", "number");
                popSizeInput.setAttribute("type", "number");
                orgMaxVelocityInput.setAttribute("type", "number");
                orgSizeInput.setAttribute("type", "number");
                orgDetectInput.setAttribute("type", "number");
                orgBaseEnergyInput.setAttribute("type", "number");

                homeXInput.setAttribute("placeholder", "X");
                homeYInput.setAttribute("placeholder", "Y");
                feedingXInput.setAttribute("placeholder", "X");
                feedingYInput.setAttribute("placeholder", "Y");
                popSizeInput.setAttribute("placeholder", "Pop size");
                orgMaxVelocityInput.setAttribute("placeholder", "MaxVel");
                orgSizeInput.setAttribute("placeholder", "Org size");
                orgDetectInput.setAttribute("placeholder", "Detect");
                orgBaseEnergyInput.setAttribute("placeholder", "Energy");


                popSizeInputLabel.innerHTML = "Pop size";
                orgMaxVelocityInputLabel.innerHTML = "Max velocity";
                orgSizeInputLabel.innerHTML = "Org Size";
                orgDetectInputLabel.innerHTML = "Detect Range";
                orgBaseEnergyInputLabel.innerHTML = "Base Energy";
                dietInputLabel.innerHTML = "Diet";

                homeXInput.value = orgGroup.conf.homePos.x;
                homeYInput.value = orgGroup.conf.homePos.y;
                feedingXInput.value = orgGroup.conf.feedingPos.x;
                feedingYInput.value = orgGroup.conf.feedingPos.y;
                popSizeInput.value = orgGroup.conf.initialPopSize;
                orgMaxVelocityInput.value = orgGroup.conf.orgMaxVelocity;
                orgSizeInput.value = orgGroup.conf.orgSize;
                orgDetectInput.value = orgGroup.conf.detectRadius;
                orgBaseEnergyInput.value = orgGroup.conf.baseEnergy;
                dietInput.value = orgGroup.conf.diet;

                header.addEventListener("click", () => {
                    if (body.style.display == "none" || body.style.display == "") {
                        body.style.display = "flex";

                    } else {
                        body.style.display = "none";
                    }
                });

                homeInputClick.addEventListener("click", () => {
                    this.simCanvas_canvas.addEventListener("click", (e) => {
                        const rect = this.simCanvas_canvas.getBoundingClientRect()
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        homeXInput.value = x;
                        homeYInput.value = y;

                    }, { once: true });
                });
                feedingInputClick.addEventListener("click", () => {
                    this.simCanvas_canvas.addEventListener("click", (e) => {
                        const rect = this.simCanvas_canvas.getBoundingClientRect()
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        feedingXInput.value = x;
                        feedingYInput.value = y;

                    }, { once: true });
                });

                saveBtn.addEventListener("click", () => {
                    let config = {
                        initialPopSize: popSizeInput.value,
                        orgMaxVelocity: orgMaxVelocityInput.value,
                        orgSize: orgSizeInput.value,
                        detectRadius: orgDetectInput.value,
                        baseEnergy: orgBaseEnergyInput.value,
                        feedingPos: [parseInt(feedingXInput.value), parseInt(feedingYInput.value)],
                        homePos: [parseInt(homeXInput.value), parseInt(homeYInput.value)],
                        diet: dietInput.value
                    };
                });

                const firstRow = document.createElement("div");
                const secondRow = document.createElement("div");
                const thirdRow = document.createElement("div");
                const forthRow = document.createElement("div");
                const fifthRow = document.createElement("div");
                const sixthRow = document.createElement("div");
                const seventhRow = document.createElement("div");

                firstRow.setAttribute("class", "eco-elem-row");
                secondRow.setAttribute("class", "eco-elem-row");
                thirdRow.setAttribute("class", "eco-elem-row");
                forthRow.setAttribute("class", "eco-elem-row");
                fifthRow.setAttribute("class", "eco-elem-row");
                sixthRow.setAttribute("class", "eco-elem-row");
                seventhRow.setAttribute("class", "eco-elem-row");

                header.appendChild(headerDisplayColor);
                header.appendChild(headerText);
                header.appendChild(headerDisplayPopSize);
                homeInputClick.appendChild(homeInputIcon);
                feedingInputClick.appendChild(feedingInputIcon);
                firstRow.appendChild(homeInputClick);
                firstRow.appendChild(homeXInput);
                firstRow.appendChild(homeYInput);
                firstRow.appendChild(feedingInputClick);
                firstRow.appendChild(feedingXInput);
                firstRow.appendChild(feedingYInput);
                secondRow.appendChild(popSizeInputLabel);
                secondRow.appendChild(popSizeInput);
                thirdRow.appendChild(orgMaxVelocityInputLabel);
                thirdRow.appendChild(orgMaxVelocityInput);
                forthRow.appendChild(orgSizeInputLabel);
                forthRow.appendChild(orgSizeInput);
                fifthRow.appendChild(orgDetectInputLabel);
                fifthRow.appendChild(orgDetectInput);
                sixthRow.appendChild(orgBaseEnergyInputLabel);
                sixthRow.appendChild(orgBaseEnergyInput);
                seventhRow.appendChild(dietInputLabel);
                seventhRow.appendChild(dietInput);
                body.appendChild(firstRow);
                body.appendChild(secondRow);
                body.appendChild(thirdRow);
                body.appendChild(forthRow);
                body.appendChild(fifthRow);
                body.appendChild(sixthRow);
                body.appendChild(seventhRow);
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
            width: 1500,
            height: 1500
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
        this.ecoSystem.dateTime.resetDate();
        this.startAnimation();
    }
    loadSimScenario02() {
        const simCanvasConf = {
            id: "simulation-canvas",
            width: 1500,
            height: 1500
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
            orgSize: 3,
            orgMaxVelocity: 3,
            detectRadius: 40,
            baseEnergy: 50000,
            diet: "plant",
            homePos: {
                x: 300, y: 300
            },
            feedingPos: {
                x: 500, y: 500
            },
            feedingZoneRadius: 200,
            initialPopSize: 10
        };
        const orgGroup02Conf = {
            type: "bird",
            orgColor: "#004C99",
            orgSize: 6,
            orgMaxVelocity: 3.5,
            detectRadius: 40,
            baseEnergy: 10000,
            diet: "insect",
            homePos: {
                x: 700, y: 700
            },
            feedingPos: {
                x: 500, y: 500
            },
            feedingZoneRadius: 200,
            initialPopSize: 15
        };

        const dateTimeTracker = new DateTimeTracker();

        let ecoSystem = new EcoSystem("eco01", "normal", dateTimeTracker);
        ecoSystem.addOrganismGroup(orgGroup01Conf);
        //ecoSystem.addOrganismGroup(orgGroup02Conf);

        this.addEcoSystemToGui(ecoSystem);
        this.ecoSystem.dateTime.resetDate();

        this.initCharts(infoCanvasConf);
        if (this.frameRef != null) {
            cancelAnimationFrame(this.frameRef);
        }
        this.startAnimation();
    }
    loadSimScenarioFromUI() {
        const infoCanvasConf = {
            width: 500,
            height: 500
        };
        const simCanvasConf = {
            id: "simulation-canvas",
            width: 1500,
            height: 1500
        };
        if (this.drawComponent === null) {
            this.drawComponent = new DrawComponent(simCanvasConf, infoCanvasConf);
        }
        if (this.ecoSystem === null) {
            const orgGroup01Conf = {
                type: "plant",
                orgColor: "#000000",
                orgSize: 2,
                orgMaxVelocity: 0,
                detectRadius: 1,
                baseEnergy: 10000,
                diet: "none",
                homePos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                feedingPos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                feedingZoneRadius: 500,
                initialPopSize: 100
            };
            const orgGroup02Conf = {
                type: "insect",
                orgColor: "#4C9900",
                orgSize: 3,
                orgMaxVelocity: 3,
                detectRadius: 40,
                baseEnergy: 5000,
                diet: "plant",
                homePos: {
                    x: 300, y: 300
                },
                feedingPos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                feedingZoneRadius: 200,
                initialPopSize: 100
            };
            const orgGroup03Conf = {
                type: "bird",
                orgColor: "#004C99",
                orgSize: 6,
                orgMaxVelocity: 3.5,
                detectRadius: 40,
                baseEnergy: 10000,
                diet: "insect",
                homePos: {
                    x: 700, y: 700
                },
                feedingPos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                feedingZoneRadius: 200,
                initialPopSize: 15
            };
            const dateTimeTracker = new DateTimeTracker();
            this.ecoSystem = new EcoSystem("eco01", "normal", dateTimeTracker);
            this.ecoSystem.addOrganismGroup(orgGroup01Conf);
            this.ecoSystem.addOrganismGroup(orgGroup02Conf);
            this.ecoSystem.addOrganismGroup(orgGroup03Conf);

        }
        this.run = true;
        this.ecoSystem.dateTime.resetDate();

        let ids = Object.keys(this.inputs);
        ids.forEach(id => {
            let config = {

                initialPopSize: parseInt(this.inputs[id][0].value),
                orgMaxVelocity: parseInt(this.inputs[id][5].value),
                orgSize: parseInt(this.inputs[id][6].value),
                detectRadius: parseInt(this.inputs[id][7].value),
                baseEnergy: parseInt(this.inputs[id][8].value),
                feedingPos: { x: parseInt(this.inputs[id][3].value), y: parseInt(this.inputs[id][4].value) },
                homePos: { x: parseInt(this.inputs[id][1].value), y: parseInt(this.inputs[id][2].value) },
                diet: this.inputs[id][9].value
            };
            this.ecoSystem.changeOrganismGroupConfiguration(id, config);
        });

        this.initCharts(infoCanvasConf);

        if (this.frameRef != null) {
            cancelAnimationFrame(this.frameRef);
        }
        this.startAnimation();
    }
    initCharts(conf) {
        ["orgSize", "maxVelocity", "detectRadius"].forEach(val => {
            if (this.chartDisplay_list.querySelectorAll("#" + val + "-info-canvas").length === 0) {
                this.chartDisplay_list.appendChild(
                    this.drawComponent.createNewInfoCanvas(conf, val)
                );
            }
        });
        this.drawComponent.drawChartAxis();
    }
    updateDisplayUI() {
        this.updateOrganismPopSizeUI();
        this.updateTimeDisplay();
    }
    updateOrganismPopSizeUI() {
        this.ecoSystem.organismGroups.forEach(orgGroup => {
            const ecoElem = document.getElementById(orgGroup.id + "-popsize");
            if (ecoElem !== null) {
                ecoElem.innerHTML = orgGroup.popSize;
            }
        });
    }
    updateTimeDisplay() {
        this.hourDisplay_display.value = Math.floor(this.ecoSystem.dateTime.getHours());
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
            this.frameRef = requestAnimationFrame(frame);
        };
        this.frameRef = requestAnimationFrame(frame);
    }
    startAnimation() {
        this.state = new State(this.drawComponent, this.ecoSystem.organismGroups);
        let hour = this.ecoSystem.dateTime.getHours() - 1;
        let prevHour = hour;
        let currStage = "resting";
        this.runAnimation(time => {
            if (this.run) {
                let hour = this.ecoSystem.dateTime.getHours();
                if (prevHour !== hour) {
                    prevHour = hour;
                    this.state.updateOrganismGroups(this.ecoSystem.organismGroups);
                    if (currStage == "feeding") {
                        this.state.searchForFood();
                    }
                    this.state = this.state.update();
                    this.drawComponent.syncSimData(this.state);
                    this.updateDisplayUI();

                    if (hour > 4 && hour < 4.05) {
                        this.state.startFeedingStage();
                        currStage = "feeding";
                    }
                    else if (hour > 13 && hour < 13.05) {
                        this.state.moveAllToFeedingZone();
                    }
                    else if (hour > 23 && hour < 23.05) {
                        this.state.respawnPlants();
                        this.state.startRestingStage();
                        this.drawComponent.syncInfoData(this.state);
                    }
                }

            }
        });
    }
}
