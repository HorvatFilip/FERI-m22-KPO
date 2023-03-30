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
        this.toggleMapConfDisplay_btn = document.getElementById("open-map-config-display");
        this.closeMapConfDisplay_btn = document.getElementById("close-map-config-display");
        this.mapConfDisplay = document.getElementById("map-config-display");
        this.mapConfDisplay_menu = document.getElementById("map-config-display-menu");
        this.mapConf_inputs = {
            seed: document.getElementById("map-seed-input"),
            amp: document.getElementById("map-amp-input"),
            freq: document.getElementById("map-freq-input"),
            ampCoef: document.getElementById("map-amp-coef-input"),
            freqCoef: document.getElementById("map-freq-coef-input"),
        }
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
        this.toggleMapConfDisplay_btn.addEventListener("click", () => {
            if (this.mapConfDisplay.style.width == "0px" || this.mapConfDisplay.style.width == "") {
                this.mapConfDisplay.style.width = "375px";
            } else {
                this.mapConfDisplay.style.width = "0px";
            }
        });
        this.closeChartDisplay_btn.addEventListener("click", () => {
            this.chartDisplay_menu.style.width = "0px";
        });
        this.closeChartDisplay_btn.addEventListener("click", () => {
            this.chartDisplay_menu.style.width = "0px";
        });
        this.closeMapConfDisplay_btn.addEventListener("click", () => {
            this.mapConfDisplay.style.width = "0px";
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

                headerDisplayColor.style.backgroundColor = orgGroup.color;
                headerText.innerHTML = orgGroup.type;
                headerDisplayPopSize.innerHTML = orgGroup.popSize;
                saveBtn.innerHTML = "Save";

                newEcoElem.setAttribute("id", orgGroup.id + "-eco-elem");
                headerDisplayPopSize.setAttribute("id", orgGroup.id + "-popsize");
                newEcoElem.setAttribute("class", "eco-elem");
                header.setAttribute("class", "eco-elem-header");
                headerDisplayColor.setAttribute("class", "eco-elem-display-color");
                body.setAttribute("class", "eco-elem-body");
                saveBtn.setAttribute("class", "btn btn-secondary");

                const homeInputClick = document.createElement("div");
                const homeInputIcon = document.createElement("i");
                const homeXInput = document.createElement("input");
                const homeYInput = document.createElement("input");
                const huntingInputClick = document.createElement("div");
                const huntingInputIcon = document.createElement("i");
                const huntingXInput = document.createElement("input");
                const huntingYInput = document.createElement("input");
                const colorInput = document.createElement("input");
                const nameInput = document.createElement("input");
                const typeInput = document.createElement("input");
                const dietInput = document.createElement("input");
                const popSizeInput = document.createElement("input");
                const maxVelocityInput = document.createElement("input");
                const sizeInput = document.createElement("input");
                const detectRadiusInput = document.createElement("input");
                const energyBaseInput = document.createElement("input");

                this.inputs[orgGroup.id] = [homeXInput, homeYInput, huntingXInput, huntingYInput, colorInput, nameInput, typeInput, dietInput, popSizeInput, maxVelocityInput, sizeInput, detectRadiusInput, energyBaseInput];

                const nameLabel = document.createElement("label");
                const typeLabel = document.createElement("label");
                const dietLabel = document.createElement("label");
                const popSizeLabel = document.createElement("label");
                const maxVelocityLabel = document.createElement("label");
                const sizeLabel = document.createElement("label");
                const detectRadiusLabel = document.createElement("label");
                const energyBaseLabel = document.createElement("label");

                homeInputClick.setAttribute("class", "btn btn-outline-secondary");
                homeInputIcon.setAttribute("class", "fa-solid fa-house");
                huntingInputClick.setAttribute("class", "btn btn-outline-secondary");
                huntingInputIcon.setAttribute("class", "fa-solid fa-carrot");
                nameInput.setAttribute("class", "form-control");
                typeInput.setAttribute("class", "form-control");
                dietInput.setAttribute("class", "form-control");
                popSizeInput.setAttribute("class", "form-control");
                maxVelocityInput.setAttribute("class", "form-control");
                sizeInput.setAttribute("class", "form-control");
                detectRadiusInput.setAttribute("class", "form-control");
                energyBaseInput.setAttribute("class", "form-control");

                homeXInput.setAttribute("type", "number");
                homeYInput.setAttribute("type", "number");
                huntingXInput.setAttribute("type", "number");
                huntingYInput.setAttribute("type", "number");
                colorInput.setAttribute("type", "color");
                nameInput.setAttribute("type", "text");
                typeInput.setAttribute("type", "text");
                dietInput.setAttribute("type", "text");
                popSizeInput.setAttribute("type", "number");
                maxVelocityInput.setAttribute("type", "number");
                sizeInput.setAttribute("type", "number");
                detectRadiusInput.setAttribute("type", "number");
                energyBaseInput.setAttribute("type", "number");

                homeXInput.setAttribute("placeholder", "X");
                homeYInput.setAttribute("placeholder", "Y");
                huntingXInput.setAttribute("placeholder", "X");
                huntingYInput.setAttribute("placeholder", "Y");
                nameInput.setAttribute("placeholder", "name");
                typeInput.setAttribute("placeholder", "type");
                dietInput.setAttribute("placeholder", "diet");
                popSizeInput.setAttribute("placeholder", "pop size");
                maxVelocityInput.setAttribute("placeholder", "max velocity");
                sizeInput.setAttribute("placeholder", "size");
                detectRadiusInput.setAttribute("placeholder", "detect radius");
                energyBaseInput.setAttribute("placeholder", "base energy");

                nameLabel.innerHTML = "Name";
                typeLabel.innerHTML = "Type";
                dietLabel.innerHTML = "Diet";
                popSizeLabel.innerHTML = "Pop size";
                maxVelocityLabel.innerHTML = "Max velocity";
                sizeLabel.innerHTML = "Size";
                detectRadiusLabel.innerHTML = "Detect radius";
                energyBaseLabel.innerHTML = "Base energy";

                homeXInput.value = orgGroup.homePos.x;
                homeYInput.value = orgGroup.homePos.y;
                huntingXInput.value = orgGroup.huntingPos.x;
                huntingYInput.value = orgGroup.huntingPos.y;
                colorInput.value = orgGroup.color;
                nameInput.value = orgGroup.name;
                typeInput.value = orgGroup.type;
                dietInput.value = orgGroup.diet;
                popSizeInput.value = orgGroup.initialPopSize;
                maxVelocityInput.value = orgGroup.maxVelocity;
                sizeInput.value = orgGroup.size;
                detectRadiusInput.value = orgGroup.detectRadius;
                energyBaseInput.value = orgGroup.energyBase;

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
                huntingInputClick.addEventListener("click", () => {
                    this.simCanvas_canvas.addEventListener("click", (e) => {
                        const rect = this.simCanvas_canvas.getBoundingClientRect()
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        huntingXInput.value = x;
                        huntingYInput.value = y;

                    }, { once: true });
                });

                saveBtn.addEventListener("click", () => {
                    let config = {
                    };
                });

                const columns = document.createElement("div");
                const firstColumn = document.createElement("div");
                const secondColumn = document.createElement("div");

                columns.setAttribute("class", "eco-elem-column-container");
                firstColumn.setAttribute("class", "eco-elem-column");
                secondColumn.setAttribute("class", "eco-elem-column");

                let firstRow = document.createElement("div");
                let secondRow = document.createElement("div");
                let thirdRow = document.createElement("div");
                let forthRow = document.createElement("div");

                firstRow.setAttribute("class", "eco-elem-row");
                secondRow.setAttribute("class", "form-floating eco-elem-row");
                thirdRow.setAttribute("class", "form-floating eco-elem-row");
                forthRow.setAttribute("class", "form-floating eco-elem-row");

                firstRow.appendChild(homeInputClick);
                firstRow.appendChild(homeXInput);
                firstRow.appendChild(homeYInput);
                firstRow.appendChild(huntingInputClick);
                firstRow.appendChild(huntingXInput);
                firstRow.appendChild(huntingYInput);
                firstRow.appendChild(colorInput);
                body.appendChild(firstRow);

                firstRow = document.createElement("div");
                firstRow.setAttribute("class", "form-floating eco-elem-row");
                firstRow.appendChild(nameInput);
                firstRow.appendChild(nameLabel);
                secondRow.appendChild(dietInput);
                secondRow.appendChild(dietLabel);
                thirdRow.appendChild(maxVelocityInput);
                thirdRow.appendChild(maxVelocityLabel);
                forthRow.appendChild(detectRadiusInput);
                forthRow.appendChild(detectRadiusLabel);
                firstColumn.appendChild(firstRow);
                firstColumn.appendChild(secondRow);
                firstColumn.appendChild(thirdRow);
                firstColumn.appendChild(forthRow);
                columns.appendChild(firstColumn);

                firstRow = document.createElement("div");
                secondRow = document.createElement("div");
                thirdRow = document.createElement("div");
                forthRow = document.createElement("div");

                firstRow.setAttribute("class", "form-floating eco-elem-row");
                secondRow.setAttribute("class", "form-floating eco-elem-row");
                thirdRow.setAttribute("class", "form-floating eco-elem-row");
                forthRow.setAttribute("class", "form-floating eco-elem-row");

                firstRow.appendChild(typeInput);
                firstRow.appendChild(typeLabel);
                secondRow.appendChild(popSizeInput);
                secondRow.appendChild(popSizeLabel);
                thirdRow.appendChild(sizeInput);
                thirdRow.appendChild(sizeLabel);
                forthRow.appendChild(energyBaseInput);
                forthRow.appendChild(energyBaseLabel);
                secondColumn.appendChild(firstRow);
                secondColumn.appendChild(secondRow);
                secondColumn.appendChild(thirdRow);
                secondColumn.appendChild(forthRow);
                columns.appendChild(secondColumn);
                body.appendChild(columns);

                header.appendChild(headerDisplayColor);
                header.appendChild(headerText);
                header.appendChild(headerDisplayPopSize);
                homeInputClick.appendChild(homeInputIcon);
                huntingInputClick.appendChild(huntingInputIcon);
                newEcoElem.appendChild(header);
                newEcoElem.appendChild(body);
                this.ecoElems_list.appendChild(newEcoElem);
            }
        });
    }
    addNewOrganismGroupUI() {

    }
    loadSimScenarioFromUI() {
        const infoCanvasConf = {
            width: 500,
            height: 500
        };
        const simCanvasConf = {
            id: "simulation-canvas",
            width: 1700,
            height: 1700
        };
        const mapDefaultConf = {
            width: 100,
            height: 100,
            style: NoiseMap.STYLE.REALISTIC,
            seed: 100001,
            mapConf: {
                amplitude: 1,
                frequency: 0.5,
                amplitudeCoef: 0.5,
                frequencyCoef: 0.5,
            }
        };

        if (this.drawComponent === null) {
            this.drawComponent = new DrawComponent(simCanvasConf, infoCanvasConf);
        }
        if (this.ecoSystem === null) {
            SIM_MAP = new MapComponent();
            SIM_MAP.setConfig(mapDefaultConf);
            SIM_MAP.generate();
            this.mapConf_inputs.seed.value = mapDefaultConf.seed;
            this.mapConf_inputs.amp.value = mapDefaultConf.mapConf.amplitude;
            this.mapConf_inputs.freq.value = mapDefaultConf.mapConf.frequency;
            this.mapConf_inputs.ampCoef.value = mapDefaultConf.mapConf.amplitudeCoef;
            this.mapConf_inputs.freqCoef.value = mapDefaultConf.mapConf.frequencyCoef;

            const orgGroup01Conf = {
                name: "insect01",
                type: "insect",
                color: "#4C9900",
                maxVelocity: 3,
                size: 3,
                detectRadius: 40,
                energyBase: 5000,
                diet: "plants",
                initialPopSize: 3,
                homePos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                homeRadius: 40,
                huntingPos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                huntingRadius: 500
            };
            const orgGroup02Conf = {
                name: "plant01",
                type: "plant",
                color: "#000000",
                maxVelocity: 0,
                size: 3,
                detectRadius: 1,
                energyBase: 100000,
                diet: "none",
                initialPopSize: 100,
                homePos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                homeRadius: 1000,
                huntingPos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                huntingRadius: 500
            };
            const orgGroup03Conf = {
                name: "bird01",
                type: "bird",
                color: "#004C99",
                maxVelocity: 3.5,
                size: 6,
                detectRadius: 40,
                energyBase: 1000,
                diet: "insect",
                initialPopSize: 1,
                homePos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                homeRadius: 40,
                huntingPos: {
                    x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
                },
                huntingRadius: 500
            };

            const dateTimeTracker = new DateTimeTracker();
            this.ecoSystem = new EcoSystem("eco01", "normal", dateTimeTracker);
            this.ecoSystem.addOrganismGroup(orgGroup01Conf);
            this.ecoSystem.addOrganismGroup(orgGroup02Conf);
            this.ecoSystem.addOrganismGroup(orgGroup03Conf);

        } else {
            let seed = null;
            if (this.mapConf_inputs.seed.value != "") {
                seed = parseInt(this.mapConf_inputs.seed.value);
            }

            let newMapConf = {
                seed: seed,
                mapConf: {
                    amplitude: parseFloat(this.mapConf_inputs.amp.value),
                    frequency: parseFloat(this.mapConf_inputs.freq.value),
                    amplitudeCoef: parseFloat(this.mapConf_inputs.ampCoef.value),
                    frequencyCoef: parseFloat(this.mapConf_inputs.freqCoef.value),
                }
            }
            newMapConf = Object.assign(mapDefaultConf, newMapConf);
            SIM_MAP.setConfig(newMapConf);
            SIM_MAP.generate();

            let ids = Object.keys(this.inputs);
            ids.forEach(id => {
                let config = {
                    name: this.inputs[id][5].value,
                    type: this.inputs[id][6].value,
                    color: this.inputs[id][4].value,
                    maxVelocity: parseInt(this.inputs[id][9].value),
                    size: parseInt(this.inputs[id][10].value),
                    detectRadius: parseInt(this.inputs[id][11].value),
                    energyBase: parseInt(this.inputs[id][12].value),
                    diet: this.inputs[id][7].value,
                    initialPopSize: parseInt(this.inputs[id][8].value),
                    homePos: {
                        x: parseInt(this.inputs[id][0].value),
                        y: parseInt(this.inputs[id][1].value)
                    },
                    huntingPos: {
                        x: parseInt(this.inputs[id][2].value),
                        y: parseInt(this.inputs[id][3].value)
                    }
                };
                this.ecoSystem.changeOrganismGroupConfiguration(id, config);
            });
        }
        this.run = false;
        this.ecoSystem.dateTime.resetDate();
        if (this.mapConf_inputs.seed.value == "") {
            this.mapConf_inputs.seed.value = SIM_MAP.generator._seed;
        }

        if (this.frameRef != null) {
            cancelAnimationFrame(this.frameRef);
        }
        this.startAnimation();
    }
    initCharts(conf) {
        ["popSize", "orgSize", "maxVelocity", "detectRadius"].forEach(val => {
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
        this.drawComponent.drawMap();

        console.log(SIM_MAP);

        this.runAnimation(time => {
            if (this.run) {
                let hour = Math.floor(this.ecoSystem.dateTime.getHours());
                if (prevHour !== hour) {
                    prevHour = hour;
                    this.state = this.state.update();
                    this.drawComponent.syncSimData(this.state);
                    this.updateDisplayUI();

                    if (hour == 9) {
                        this.state.moveAllToHomeZone();
                    }
                    else if (hour == 20) {
                        this.state.moveAllToHomeZone();
                    }
                }

            }
        });
    }
}
