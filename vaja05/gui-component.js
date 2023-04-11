class GuiComponent {
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
        this.chartDisplay_list = document.getElementById("chart-display-list");
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
        this.ecoElems_inputs = {};
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
            this.hourDisplay_display.value = "00";
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
                const mutationChanceInput = document.createElement("input");

                this.ecoElems_inputs[orgGroup.id] = [homeXInput, homeYInput, huntingXInput, huntingYInput, colorInput, nameInput, typeInput, dietInput, popSizeInput, maxVelocityInput, sizeInput, detectRadiusInput, mutationChanceInput];

                const nameLabel = document.createElement("label");
                const typeLabel = document.createElement("label");
                const dietLabel = document.createElement("label");
                const popSizeLabel = document.createElement("label");
                const maxVelocityLabel = document.createElement("label");
                const sizeLabel = document.createElement("label");
                const detectRadiusLabel = document.createElement("label");
                const mutationChanceLabel = document.createElement("label");

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
                mutationChanceInput.setAttribute("class", "form-control");

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
                mutationChanceInput.setAttribute("type", "number");

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
                mutationChanceInput.setAttribute("placeholder", "mutation chance");

                nameLabel.innerHTML = "Name";
                typeLabel.innerHTML = "Type";
                dietLabel.innerHTML = "Diet";
                popSizeLabel.innerHTML = "Pop size";
                maxVelocityLabel.innerHTML = "Max velocity";
                sizeLabel.innerHTML = "Size";
                detectRadiusLabel.innerHTML = "Detect radius";
                mutationChanceLabel.innerHTML = "Mutation(%)";

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
                mutationChanceInput.value = orgGroup.mutationChance;

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
                forthRow.appendChild(mutationChanceInput);
                forthRow.appendChild(mutationChanceLabel);
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
    loadDefaultScenario() {
        const infoCanvasConf = {
            width: 500,
            height: 500
        };
        const simCanvasConf = {
            id: "simulation-canvas",
            width: 1700,
            height: 1700
        };
        this.mapDefaultConf = {
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
        this.drawComponent = new DrawComponent(simCanvasConf, infoCanvasConf);

        SIM_MAP = new MapComponent();
        SIM_MAP.setConfig(this.mapDefaultConf);
        SIM_MAP.generate();
        this.mapConf_inputs.seed.value = this.mapDefaultConf.seed;
        this.mapConf_inputs.amp.value = this.mapDefaultConf.mapConf.amplitude;
        this.mapConf_inputs.freq.value = this.mapDefaultConf.mapConf.frequency;
        this.mapConf_inputs.ampCoef.value = this.mapDefaultConf.mapConf.amplitudeCoef;
        this.mapConf_inputs.freqCoef.value = this.mapDefaultConf.mapConf.frequencyCoef;
        this.defaultOrgGroupConfigs = [];

        this.defaultOrgGroupConfigs.push({
            name: "plant01",
            type: "plant",
            color: "#994C00",
            maxVelocity: 0,
            size: 3,
            detectRadius: 1,
            mutationChance: 10,
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
        });
        this.defaultOrgGroupConfigs.push({
            name: "insect01",
            type: "insect",
            color: "#00994C",
            maxVelocity: 3,
            size: 6,
            detectRadius: 100,
            mutationChance: 10,
            diet: "plant",
            initialPopSize: 25,
            homePos: {
                x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
            },
            homeRadius: 40,
            huntingPos: {
                x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
            },
            huntingRadius: 40
        });
        this.defaultOrgGroupConfigs.push({
            name: "bird01",
            type: "bird",
            color: "#004C99",
            maxVelocity: 5,
            size: 9,
            detectRadius: 150,
            mutationChance: 10,
            diet: "insect",
            initialPopSize: 3,
            homePos: {
                x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
            },
            homeRadius: 40,
            huntingPos: {
                x: simCanvasConf.width / 2, y: simCanvasConf.height / 2
            },
            huntingRadius: 40
        });

        const dateTimeTracker = new DateTimeTracker();
        this.ecoSystem = new EcoSystem("eco01", "normal", dateTimeTracker);
        this.defaultOrgGroupConfigs.forEach(defOrgGroupConf => {
            this.ecoSystem.addOrganismGroup(defOrgGroupConf);

        });
        this.run = false;
        this.ecoSystem.dateTime.resetDate();
        if (this.mapConf_inputs.seed.value == "") {
            this.mapConf_inputs.seed.value = SIM_MAP.generator._seed;
        }

        this.startAnimation();

    }
    loadSimScenarioFromUI() {
        let mapSeed = null;
        if (this.mapConf_inputs.seed.value != "") {
            mapSeed = parseInt(this.mapConf_inputs.seed.value);
        }

        let newMapConf = {
            seed: mapSeed,
            mapConf: {
                amplitude: parseFloat(this.mapConf_inputs.amp.value),
                frequency: parseFloat(this.mapConf_inputs.freq.value),
                amplitudeCoef: parseFloat(this.mapConf_inputs.ampCoef.value),
                frequencyCoef: parseFloat(this.mapConf_inputs.freqCoef.value),
            }
        }
        newMapConf = Object.assign(this.mapDefaultConf, newMapConf);
        SIM_MAP.setConfig(newMapConf);
        SIM_MAP.generate();

        let orgGroupIds = Object.keys(this.ecoElems_inputs);
        orgGroupIds.forEach(orgGroupId => {
            let orgGroupConf = {
                name: this.ecoElems_inputs[orgGroupId][5].value,
                type: this.ecoElems_inputs[orgGroupId][6].value,
                color: this.ecoElems_inputs[orgGroupId][4].value,
                maxVelocity: parseInt(this.ecoElems_inputs[orgGroupId][9].value),
                size: parseInt(this.ecoElems_inputs[orgGroupId][10].value),
                detectRadius: parseInt(this.ecoElems_inputs[orgGroupId][11].value),
                mutationChance: parseInt(this.ecoElems_inputs[orgGroupId][12].value),
                diet: this.ecoElems_inputs[orgGroupId][7].value,
                initialPopSize: parseInt(this.ecoElems_inputs[orgGroupId][8].value),
                homePos: {
                    x: parseInt(this.ecoElems_inputs[orgGroupId][0].value),
                    y: parseInt(this.ecoElems_inputs[orgGroupId][1].value)
                },
                huntingPos: {
                    x: parseInt(this.ecoElems_inputs[orgGroupId][2].value),
                    y: parseInt(this.ecoElems_inputs[orgGroupId][3].value)
                }
            };
            this.ecoSystem.changeOrganismGroupConfiguration(orgGroupId, orgGroupConf);
        });

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
        this.state = new State(this.ecoSystem.organismGroups);
        let hour = this.ecoSystem.dateTime.getHours() - 1;
        let day = this.ecoSystem.dateTime.getDays() - 1;
        let prevHour = hour;
        let prevDay = day;
        this.drawComponent.drawMap();

        console.log(SIM_MAP);

        this.runAnimation(time => {
            if (this.run) {
                hour = Math.floor(this.ecoSystem.dateTime.getHours());
                if (prevHour !== hour) {
                    prevHour = hour;

                    this.state = this.state.updateOrganismGroupsInteractions();
                    this.drawComponent.syncSimData(this.state);
                    this.updateDisplayUI();
                    day = Math.floor(this.ecoSystem.dateTime.getDays());
                    if (prevDay !== day) {
                        prevDay = day;
                        this.state.updateAge();
                        if (day % 4 == 0) {
                            this.state.respawnPlants();
                        }
                    }
                }
            }
        });
    }
}
