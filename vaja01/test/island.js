class Organism {
    constructor(orgNewPos) {
        Object.assign(this, orgNewPos);
    }
    updatePosition(state) {
        let rndMove = true;
        if (this.pos.x >= state.display.simCanvas.width - 30 || this.pos.x <= 30) {
            this.velocity = new Vector(this.velocity.x * (-1), this.velocity.y)
            rndMove = false;
        }
        if (this.pos.y >= state.display.simCanvas.height - 30 || this.pos.y <= 30) {
            this.velocity = new Vector(this.velocity.x, this.velocity.y * (-1));
            rndMove = false;
        }
        if (rndMove) {
            let changeVelocity = Math.floor(Math.random() * 4);
            switch (changeVelocity) {
                case 0:
                    this.velocity = new Vector(0, 0);
                    break;
                case 1:
                    this.velocity = new Vector(this.velocity.x * (-1), this.velocity.y);
                    break;
                case 2:
                    this.velocity = new Vector(this.velocity.x, this.velocity.y * (-1));
                    break;
                case 3:
                    this.velocity = new Vector(this.velocity.x * (-1), this.velocity.y * (-1));
                    break;
            }
        }


        return new Organism({
            ...this,
            pos: this.pos.add(this.velocity)
        });
    }
}

class OrganismGroup {
    constructor(type, initialPopSize, rp, sp, k, orgSize, orgColor, spawnPoint, spawnVelocity = new Vector(2, 2)) {
        this.type = type;
        this.rp = rp;
        this.sp = sp;
        this.k = k;
        this.orgSize = orgSize;
        this.orgColor = orgColor;
        this.spawnPoint = spawnPoint;
        this.spawnVelocity = spawnVelocity;
        this.popSize = 0;
        this.population = [];
        this.addOrganisms(initialPopSize);
    }
    addOrganisms(count) {
        for (let i = 0; i < count; i++) {
            this.popSize++;
            const orgStats =
            {
                type: this.type,
                id: this.type + "-" + this.popSize,
                pos: this.spawnPoint,
                velocity: this.spawnVelocity,
                size: this.orgSize,
                color: this.orgColor
            }
            this.population.push(
                new Organism(orgStats)
            );
        }
    }
    removeOrganisms(count) {
        this.population.splice(0, count);
        this.popSize -= count;
    }
    updatePopulation() {
        // let delta_rp = (this.rp - this.sp) * this.popSize;
        // let delta_sp = (this.rp - this.sp - this.k * this.popSize) * this.popSize;
        // this.rp += delta_rp % 1;
        // this.sp += delta_sp % 1;
        // this.rp = Math.max(delta_rp % 1, 0);
        // this.sp = Math.max(delta_sp % 1, 0);
        // console.log("delta_rp: " + delta_rp)
        // console.log("delta_sp: " + delta_sp)
        // console.log("rp: " + this.rp)
        // console.log("sp: " + this.sp)

        let populationChange = 0;
        for (let i = 0; i < this.popSize; i++) {
            if (Math.random() < this.rp) {
                populationChange++;
            }
            let deathChance = Math.random();
            if (deathChance < this.sp || deathChance < (this.k * this.popSize)) {
                populationChange--;
            }
        }
        if (populationChange > 0) {
            this.addOrganisms(populationChange);
        }
        else {
            this.removeOrganisms(Math.abs(populationChange));
        }
    }
    updatePosition(state) {
        this.population = this.population.map(organism => {
            return organism.updatePosition(state);
        });
        return this;
    }
}

class DateTimeTracker {
    constructor(startDate = { year: 0, month: 0, day: 0, hour: 0 }) {
        this.date = startDate;
    }
    addYears(count) {
        this.date["year"] += count;
    }
    addMonths(count) {
        this.date["month"] += count;
    }
    addDays(count) {
        this.date["day"] += count;
    }
    addHours(count) {
        this.date["hour"] += count;
    }
    getCurrentDateTime() {
        return { year: this.year, month: this.month, day: this.day, hour: this.day };
    }
}

const dayNightCycle = new DayNightCycle();
console.log(dayNightCycle.getCurrentDateTime());

class EcoSystem {
    constructor(id, type, date) {
        this.id = id;
        this.type = type;
        this.date = date;
        this.organismGroups = [];
    }
    addOrganismGroup(organismGroup) {
        this.organismGroups.push(organismGroup);
    }
    removeOrganismGroupByType(type) {
        this.organismGroups = this.organismGroups.organismGroups.filter(orgGroup => orgGroup.type != type);
    }

}
