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
            this.drawComponent.clearChartCanvas();
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

                headerDisplayColor.style.backgroundColor = orgGroup.conf.orgColor;
                headerText.innerHTML = orgGroup.conf.type;
                headerDisplayPopSize.innerHTML = orgGroup.popSize;

                newEcoElem.setAttribute("id", orgGroup.id + "-eco-elem");
                headerDisplayPopSize.setAttribute("id", orgGroup.id + "-popsize");
                newEcoElem.setAttribute("class", "eco-elem");
                header.setAttribute("class", "eco-elem-header");
                headerDisplayColor.setAttribute("class", "eco-elem-display-color");
                body.setAttribute("class", "eco-elem-body");

                const popSizeInput = document.createElement("input");
                const orgSizeInput = document.createElement("input");
                const behaviorInput = document.createElement("input");
                const popSizeLabel = document.createElement("label");
                const orgSizeLabel = document.createElement("label");
                const behaviorLabel = document.createElement("label");
                this.inputs[orgGroup.id] = [popSizeInput, orgSizeInput, behaviorInput];

                popSizeInput.setAttribute("type", "number");
                orgSizeInput.setAttribute("type", "number");
                behaviorInput.setAttribute("type", "text");

                popSizeInput.setAttribute("placeholder", "Org size");
                orgSizeInput.setAttribute("placeholder", "Pop size");
                behaviorInput.setAttribute("placeholder", "Behavior");

                popSizeLabel.innerHTML = "Pop count";
                orgSizeLabel.innerHTML = "Org size";
                behaviorLabel.innerHTML = "Behavior";

                popSizeInput.value = orgGroup.conf.initialPopSize;
                orgSizeInput.value = orgGroup.conf.orgSize;
                behaviorInput.value = orgGroup.conf.behavior;

                header.addEventListener("click", () => {
                    if (body.style.display == "none" || body.style.display == "") {
                        body.style.display = "flex";

                    } else {
                        body.style.display = "none";
                    }
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
                firstRow.appendChild(popSizeLabel);
                firstRow.appendChild(popSizeInput);
                secondRow.appendChild(orgSizeLabel);
                secondRow.appendChild(orgSizeInput);
                thirdRow.appendChild(behaviorLabel);
                thirdRow.appendChild(behaviorInput);
                body.appendChild(firstRow);
                body.appendChild(secondRow);
                body.appendChild(thirdRow);
                newEcoElem.appendChild(header);
                newEcoElem.appendChild(body);
                this.ecoElems_list.appendChild(newEcoElem);
            }
        });
    }
    addNewOrganismGroupUI() {

    }
    loadScenario01() {
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
                type: "insect",
                orgColor: "#4C9900",
                initialPopSize: 100,
                orgSize: 2,
                orgMaxVelocity: 5,
                behavior: "passive",
                homePos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                spawnRadius: 500
            };
            const orgGroup02Conf = {
                type: "bird",
                orgColor: "#004C99",
                initialPopSize: 50,
                orgSize: 3,
                orgMaxVelocity: 5,
                behavior: "aggressive",
                homePos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                spawnRadius: 500
            };
            const orgGroup03Conf = {
                type: "plant",
                orgColor: "#000000",
                initialPopSize: 100,
                orgSize: 2,
                orgMaxVelocity: 0,
                behavior: "food",
                homePos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                spawnRadius: 500
            };
            const dateTimeTracker = new DateTimeTracker();
            this.ecoSystem = new EcoSystem("eco01", "normal", dateTimeTracker);
            this.ecoSystem.addOrganismGroup(orgGroup01Conf);
            this.ecoSystem.addOrganismGroup(orgGroup02Conf);
            this.ecoSystem.addOrganismGroup(orgGroup03Conf);
            this.ecoSystem.dateTime.resetDate();
            this.run = true;

            this.initCharts(infoCanvasConf);

            if (this.frameRef != null) {
                cancelAnimationFrame(this.frameRef);
            }
            this.startAnimation();
        }

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
                type: "insect",
                orgColor: "#4C9900",
                initialPopSize: 100,
                orgSize: 2,
                orgMaxVelocity: 5,
                behavior: "passive",
                homePos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                spawnRadius: 500
            };
            const orgGroup02Conf = {
                type: "bird",
                orgColor: "#004C99",
                initialPopSize: 50,
                orgSize: 3,
                orgMaxVelocity: 5,
                behavior: "aggressive",
                homePos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                spawnRadius: 500
            };
            const orgGroup03Conf = {
                type: "plant",
                orgColor: "#000000",
                initialPopSize: 100,
                orgSize: 2,
                orgMaxVelocity: 0,
                behavior: "none",
                homePos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                spawnRadius: 500
            };
            const dateTimeTracker = new DateTimeTracker();
            this.ecoSystem = new EcoSystem("eco01", "normal", dateTimeTracker);
            this.ecoSystem.addOrganismGroup(orgGroup01Conf);
            this.ecoSystem.addOrganismGroup(orgGroup02Conf);
            this.ecoSystem.addOrganismGroup(orgGroup03Conf);
        }
        this.ecoSystem.dateTime.resetDate();
        this.run = true;

        let ids = Object.keys(this.inputs);
        ids.forEach(id => {
            let config = {
                initialPopSize: parseInt(this.inputs[id][0].value),
                orgSize: parseInt(this.inputs[id][1].value),
                behavior: this.inputs[id][2].value
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
        ["popSize"].forEach(val => {
            if (this.chartDisplay_list.querySelectorAll("#" + val + "-info-canvas").length === 0) {
                this.chartDisplay_list.appendChild(
                    this.drawComponent.createNewInfoCanvas(conf, val)
                );
            }
        });
        this.drawComponent.drawChartAxis();
        this.drawComponent.initChartPointVars();
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
                let hour = Math.floor(this.ecoSystem.dateTime.getHours());
                if (prevHour !== hour) {
                    prevHour = hour;

                    if (hour == 0 || hour == 8 || hour == 16) {
                        this.state.respawnPlants();
                    } else if (hour == 1 || hour == 9 || hour == 17) {
                        this.state.searchForFood();
                    } else if (hour == 4 || hour == 12 || hour == 20) {
                        this.state.foodDistribution();
                    } else if (hour == 5 || hour == 13 || hour == 21) {
                        this.state.sendHome();
                    } else if (hour == 6 || hour == 14 || hour == 22) {
                        this.state.reproductionAndDeath();
                        this.drawComponent.syncInfoData(this.state);
                    }

                    // else if (hour % 6 == 0) {
                    //    this.state.eatFood();
                    //}
                    //if (hour == 24) {
                    //    
                    //}

                    this.state = this.state.update();
                    this.drawComponent.syncSimData(this.state);
                    this.updateDisplayUI();
                }

            }
        });
    }
}
