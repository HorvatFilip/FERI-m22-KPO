class DrawComponent {
    constructor(simulationCanvasConf) {
        this.simCanvas = document.getElementById(simulationCanvasConf.id);
        this.simCanvas.width = simulationCanvasConf.width;
        this.simCanvas.height = simulationCanvasConf.height;
        this.simCtx = this.simCanvas.getContext("2d");//context variable for simulation canvas 
        this.infoCtxList = [];//list of context variable for info canvas 
        this.infoPoints = {};//data structure for info canvas chart points
        this.chartOffset_gui = 20;
    }
    initChartPointVars() {
        this.infoPoints = {};
    }
    drawMap() {
        SIM_MAP.data.draw(this.simCtx, this.simCanvas.width, this.simCanvas.height, SIM_MAP.conf.style);
    }
    syncSimData(state) {
        this.drawMap();
        this.drawAllOrganisms(state.organismGroups);
    }
    drawAllOrganisms(organismGroups) {
        organismGroups.forEach(orgGroup => {
            orgGroup.population.forEach(org => {
                this.drawOrganism(org, orgGroup.color)
            })
        });
    }
    drawOrganism(organism, color) {
        this.simCtx.beginPath();
        this.simCtx.arc(organism.pos.x, organism.pos.y, organism.size, 0, Math.PI * 2);
        this.simCtx.closePath();
        if (organism.id == "bird-1") {
            color = "red";
        }
        this.simCtx.fillStyle = color;
        this.simCtx.fill();
        this.simCtx.beginPath();
        if (organism.gender == "m") {
            this.simCtx.arc(organism.pos.x, organism.pos.y, organism.size / 3, 0, Math.PI * 2);
        }
        this.simCtx.closePath();
        this.simCtx.fillStyle = "#202020";
        this.simCtx.fill();

    }
    createNewInfoCanvas(conf, val) {
        const chartCanvas = document.createElement("canvas");
        chartCanvas.setAttribute("id", val + "-info-canvas");
        chartCanvas.width = conf.width;
        chartCanvas.height = conf.height;
        this.infoCanvasWidth = conf.width;
        this.infoCanvasHeight = conf.height;
        this.infoCtxList.push(chartCanvas.getContext("2d"));
        this.infoCtxList[this.infoCtxList.length - 1].fillStyle = "rgb(50, 60, 70)";
        this.infoCtxList[this.infoCtxList.length - 1].fillRect(0, 0, this.infoCanvasWidth, this.infoCanvasHeight);
        return chartCanvas;
    }
    clearChartCanvas() {
        this.infoCtxList.forEach(valCtx => {
            valCtx.fillStyle = "rgb(50, 60, 70)";
            valCtx.fillRect(0, 0, this.infoCanvasWidth, this.infoCanvasHeight);
        });
        this.drawChartAxis();
    }
    syncInfoData(state) {
        this.clearChartCanvas();
        this.updateChartPoints(state.organismGroups);
        this.drawChart(state.timePassed);
    }
    updateChartPoints(organismGroups) {
        organismGroups.forEach(orgGroup => {
            let values = orgGroup.getChartValues();
            if (this.infoPoints[orgGroup.id] === undefined) {//if group is not yet in infoPoints
                this.infoPoints[orgGroup.id] = {
                    orgColor: orgGroup.conf.orgColor,
                };
                for(let i=0;i<values.length;i++){
                    this.infoPoints[orgGroup.id].i = [values[i]]
                }
            } else { //if group is in infoPoints
                for(let i=0;i<values.length;i++){
                    this.infoPoints[orgGroup.id].i.push(values[i]);
                }
                if (this.infoPoints[orgGroup.id][0].length * 24 > this.infoCanvasWidth - this.chartOffset_gui) {
                    for(let i=0;i<values.length;i++){
                        this.infoPoints[orgGroup.id].i.shift();
                    }
                }
            }
        });
    }
    drawChartAxis() {
        let labelIndx = 0;
        this.infoCtxList.forEach(valCtx => {
            valCtx.strokeStyle = "#212529";
            valCtx.beginPath();
            valCtx.moveTo(this.chartOffset_gui, this.infoCanvasHeight - this.chartOffset_gui);
            valCtx.lineTo(this.chartOffset_gui, 0);
            valCtx.moveTo(this.chartOffset_gui, this.infoCanvasHeight - this.chartOffset_gui);
            valCtx.lineTo(this.infoCanvasWidth, this.infoCanvasHeight - this.chartOffset_gui);
            valCtx.stroke();
            valCtx.font = "35px Comic Sans MS";
            valCtx.fillStyle = "#212529";
            valCtx.fillText(this.chartLabels[labelIndx++], this.chartOffset_gui + 20, this.chartOffset_gui + 35)
        });
    }
    drawChart() {
        let timeInterval = 0;
        Object.keys(this.infoPoints).forEach(id => {
            if (this.infoPoints[id][0].length < 2) {
                return;
            }
            for (let j = 0; j < infoCtxList.length; j++) {
                this.infoCtxList[j].strokeStyle = this.infoPoints[id].orgColor;
                timeInterval = 0;
                this.infoCtxList[j].strokeStyle = this.infoPoints[id].orgColor;
                this.infoCtxList[j].beginPath();
                for (let i = 0; i < this.infoPoints[id][j].length - 1; i++) {
                    this.infoCtxList[j].moveTo(timeInterval + this.chartOffset_gui, this.infoCanvasHeight - this.chartOffset_gui - this.infoPoints[id][j][i]);
                    timeInterval += 24;
                    this.infoCtxList[j].lineTo(timeInterval + this.chartOffset_gui, this.infoCanvasHeight - this.chartOffset_gui - this.infoPoints[id][j][i + 1]);
                }
                this.infoCtxList[j].stroke();
            }
        });
    }
}