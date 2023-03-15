class DrawComponent {
    constructor(simCanvasConf, infoCanvasConf) {
        this.simCanvas = document.getElementById(simCanvasConf.id);
        this.simCanvas.width = simCanvasConf.width;
        this.simCanvas.height = simCanvasConf.height;
        this.simCtx = this.simCanvas.getContext("2d");

        this.infoCtx = [];
        this.infoPoints = {};
        this.chartOffset = 20;
    }
    clearSimCanvas() {
        this.simCtx.fillStyle = "rgb(50, 60, 70)";
        this.simCtx.fillRect(0, 0, this.simCanvas.width, this.simCanvas.height);
    }
    syncSimData(state) {
        this.clearSimCanvas();
        this.drawAllOrganisms(state.organismGroups);
    }
    drawAllOrganisms(organismGroups) {
        organismGroups.forEach(orgGroup => {
            orgGroup.population.forEach(org => {
                this.drawOrganism(org)
            })
        });
    }
    drawOrganism(organism) {
        this.simCtx.beginPath();
        this.simCtx.arc(organism.pos.x, organism.pos.y, organism.orgSize, 0, Math.PI * 2);
        this.simCtx.closePath();
        this.simCtx.fillStyle = organism.orgColor;
        this.simCtx.fill();
    }

    initChartPointVars() {
        this.infoPoints = {};
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
            console.log(values)
            if (this.infoPoints[orgGroup.id] === undefined) {
                this.infoPoints[orgGroup.id] = {
                    orgColor: orgGroup.conf.orgColor,
                    0: [values[0]],
                    1: [values[1]],
                    2: [values[2]]
                };
            } else {
                this.infoPoints[orgGroup.id][0].push(values[0]);
                this.infoPoints[orgGroup.id][1].push(values[1]);
                this.infoPoints[orgGroup.id][2].push(values[2]);
                if (this.infoPoints[orgGroup.id][0].length > this.infoCanvasWidth - this.chartOffset) {
                    this.infoPoints[orgGroup.id][0].shift();
                    this.infoPoints[orgGroup.id][1].shift();
                    this.infoPoints[orgGroup.id][1].shift();
                }
            }
        });
    }
    drawChartAxis() {
        this.infoCtx.forEach(valCtx => {
            valCtx.strokeStyle = "black";
            valCtx.beginPath();
            valCtx.moveTo(this.chartOffset, this.infoCanvasHeight - this.chartOffset);
            valCtx.lineTo(this.chartOffset, 0);
            valCtx.moveTo(this.chartOffset, this.infoCanvasHeight - this.chartOffset);
            valCtx.lineTo(this.infoCanvasWidth, this.infoCanvasHeight - this.chartOffset);
            valCtx.stroke();
        });
    }
    drawChart(intervalType) {
        console.log(this.infoPoints);
        let timeInterval = 0;
        Object.keys(this.infoPoints).forEach(id => {
            if (this.infoPoints[id][0].length < 2) {
                return;
            }
            for (let j = 0; j < 3; j++) {
                this.infoCtx[j].strokeStyle = this.infoPoints[id].orgColor;
                timeInterval = 0;
                this.infoCtx[j].strokeStyle = this.infoPoints[id].orgColor;
                this.infoCtx[j].beginPath();
                for (let i = 0; i < this.infoPoints[id][j].length - 1; i++) {
                    this.infoCtx[j].moveTo(timeInterval + this.chartOffset, this.infoCanvasHeight - this.chartOffset - this.infoPoints[id][j][i] * 2);
                    timeInterval += 24;
                    this.infoCtx[j].lineTo(timeInterval + this.chartOffset, this.infoCanvasHeight - this.chartOffset - this.infoPoints[id][j][i + 1] * 2);
                }
                this.infoCtx[j].stroke();

            }
        });
    }
}