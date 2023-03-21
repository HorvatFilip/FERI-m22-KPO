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
        if (organism.type == "plant") {
            this.simCtx.beginPath();
            this.simCtx.arc(organism.homePos[0].x, organism.homePos[0].y, organism.orgSize, 0, Math.PI * 2);
            this.simCtx.closePath();
            this.simCtx.fillStyle = organism.orgColor;
            this.simCtx.fill();

            this.simCtx.beginPath();
            this.simCtx.arc(organism.homePos[1].x, organism.homePos[1].y, organism.orgSize, 0, Math.PI * 2);
            this.simCtx.closePath();
            this.simCtx.fillStyle = organism.orgColor;
            this.simCtx.fill();
        } else {
            this.simCtx.beginPath();
            this.simCtx.arc(organism.pos.x, organism.pos.y, organism.orgSize, 0, Math.PI * 2);
            this.simCtx.closePath();
            this.simCtx.fillStyle = organism.orgColor;
            this.simCtx.fill();
        }
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
            if (this.infoPoints[orgGroup.id] === undefined) {
                console.log(orgGroup.conf.orgColor);
                this.infoPoints[orgGroup.id] = {
                    orgColor: orgGroup.conf.orgColor,
                    popSize: [orgGroup.popSize]
                };
            } else {
                this.infoPoints[orgGroup.id]["popSize"].push(orgGroup.popSize);
                if (this.infoPoints[orgGroup.id]["popSize"].length > this.infoCanvasWidth - this.chartOffset) {
                    this.infoPoints[orgGroup.id]["popSize"].shift();
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
        console.log(this.infoPoints);
        Object.keys(this.infoPoints).forEach(id => {
            this.infoCtx[0].strokeStyle = this.infoPoints[id]["orgColor"];
            let timeInterval = 0;
            this.infoCtx[0].beginPath();
            for (let i = 0; i < this.infoPoints[id]["popSize"].length - 1; i++) {
                this.infoCtx[0].moveTo(timeInterval + this.chartOffset, this.infoCanvasHeight - this.chartOffset - this.infoPoints[id]["popSize"][i]);
                timeInterval += 24;
                this.infoCtx[0].lineTo(timeInterval + this.chartOffset, this.infoCanvasHeight - this.chartOffset - this.infoPoints[id]["popSize"][i + 1]);
                if (timeInterval + this.chartOffset > this.infoCanvasWidth - this.chartOffset) {
                    this.infoPoints[id]["popSize"].shift();
                }
            }
            this.infoCtx[0].stroke();
        });
    }
}