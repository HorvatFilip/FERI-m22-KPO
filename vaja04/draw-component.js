class DrawComponent {
    constructor(simCanvasConf, infoCanvasConf) {
        this.simCanvas = document.getElementById(simCanvasConf.id);
        this.simCanvas.width = simCanvasConf.width;
        this.simCanvas.height = simCanvasConf.height;
        this.simCtx = this.simCanvas.getContext("2d");

        this.infoCtx = [];
        this.infoPoints = {};
        this.chartLabels = ["Count", "Size", "MaxVelocity", "DetectRadius"];
        this.chartOffset = 20;
    }
    //initMapData(mapData) {
    //    this.mapData = mapData;
    //    //for (let i = 0; i < this.mapData.data.length; i++) {
    //    //    console.log("x:", Math.floor(i / this.mapConf.width));
    //    //    console.log("y:", Math.floor(i % this.mapConf.height));
    //    //    console.log("val:", this.mapData.data[i]);
    //    //}
    //}
    initChartPointVars() {
        this.infoPoints = {};
    }
    drawMap() {
        //this.simCtx.fillStyle = "rgb(50, 60, 70)";
        //this.simCtx.fillRect(0, 0, this.simCanvas.width, this.simCanvas.height);
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
        } else if (organism.gender == "f") {
            //this.simCtx.arc(organism.pos.x, organism.pos.y, organism.size / 2, 0, Math.PI * 2);
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
        this.infoCtx.push(chartCanvas.getContext("2d"));
        this.infoCtx[this.infoCtx.length - 1].fillStyle = "rgb(50, 60, 70)";
        this.infoCtx[this.infoCtx.length - 1].fillRect(0, 0, this.infoCanvasWidth, this.infoCanvasHeight);
        return chartCanvas;
    }
    clearChartCanvas() {
        this.infoCtx.forEach(valCtx => {
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
    updateData(state) {
        this.updateChartPoints(state.organismGroups);
    }
    updateChartPoints(organismGroups) {
        organismGroups.forEach(orgGroup => {
            let values = orgGroup.getChartValues();
            if (this.infoPoints[orgGroup.id] === undefined) {
                this.infoPoints[orgGroup.id] = {
                    orgColor: orgGroup.conf.orgColor,
                    0: [values[0]],
                    1: [values[1]],
                    2: [values[2]],
                    3: [values[3]]
                };
            } else {
                this.infoPoints[orgGroup.id][0].push(values[0]);
                this.infoPoints[orgGroup.id][1].push(values[1] * 20);
                this.infoPoints[orgGroup.id][2].push(values[2] * 20);
                this.infoPoints[orgGroup.id][3].push(values[3]);
                if (this.infoPoints[orgGroup.id][0].length * 24 > this.infoCanvasWidth - this.chartOffset) {
                    this.infoPoints[orgGroup.id][0].shift();
                    this.infoPoints[orgGroup.id][1].shift();
                    this.infoPoints[orgGroup.id][2].shift();
                    this.infoPoints[orgGroup.id][3].shift();
                }
            }
        });
    }
    drawChartAxis() {
        let labelIndx = 0;
        this.infoCtx.forEach(valCtx => {
            valCtx.strokeStyle = "#212529";
            valCtx.beginPath();
            valCtx.moveTo(this.chartOffset, this.infoCanvasHeight - this.chartOffset);
            valCtx.lineTo(this.chartOffset, 0);
            valCtx.moveTo(this.chartOffset, this.infoCanvasHeight - this.chartOffset);
            valCtx.lineTo(this.infoCanvasWidth, this.infoCanvasHeight - this.chartOffset);
            valCtx.stroke();
            valCtx.font = "35px Comic Sans MS";
            valCtx.fillStyle = "#212529";
            valCtx.fillText(this.chartLabels[labelIndx++], this.chartOffset + 20, this.chartOffset + 35)
        });
    }
    drawChart(intervalType) {
        let timeInterval = 0;
        Object.keys(this.infoPoints).forEach(id => {
            if (this.infoPoints[id][0].length < 2) {
                return;
            }
            for (let j = 0; j < 4; j++) {
                this.infoCtx[j].strokeStyle = this.infoPoints[id].orgColor;
                timeInterval = 0;
                this.infoCtx[j].strokeStyle = this.infoPoints[id].orgColor;
                this.infoCtx[j].beginPath();
                for (let i = 0; i < this.infoPoints[id][j].length - 1; i++) {
                    this.infoCtx[j].moveTo(timeInterval + this.chartOffset, this.infoCanvasHeight - this.chartOffset - this.infoPoints[id][j][i]);
                    timeInterval += 24;
                    this.infoCtx[j].lineTo(timeInterval + this.chartOffset, this.infoCanvasHeight - this.chartOffset - this.infoPoints[id][j][i + 1]);
                }
                this.infoCtx[j].stroke();

            }
        });
    }
}