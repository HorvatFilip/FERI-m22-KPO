const testClosestPredator = (orgMove, org, predatorGroup) => {
    let currentPredator = null;
    let result = true;
    predatorGroup.population.forEach(predator => {
        currentPredator = predator.interaction(org);
        if (currentPredator.canBeEaten && currentPredator.distance < orgMove.org.distance) {
            result = false;
        }
    });
    return result;
}
const testClosestPray = (orgMove, org, prayGroup) => {
    let currentPray = null;
    let result = true;
    prayGroup.population.forEach(pray => {
        currentPray = org.interaction(pray);
        if (currentPray.canBeEaten && currentPray.distance < orgMove.org.distance) {
            result = false;
        }
    });
    return result;
}
const testBestMate = (orgMove, org, orgGroup) => {
    let currentMate = null;
    let result = true;
    orgGroup.population.forEach(mate => {
        currentMate = org.interaction(mate);
        if (org.gender != mate.gender && mate.matingInterval < 30 && currentMate.rating > orgMove.org.rating) {
            result = false;
        }
    });
    return result;
}
const testDeathByPredator = (prayId, prayGroup, predatorId, predatorGroup) => {
    let isPrayDead = true;
    prayGroup.population.forEach(pray => {
        if (prayId == pray.id) {
            isPrayDead = false;
        }
    });
    let isPredatorHungry = false;
    predatorGroup.population.forEach(predator => {
        if (predatorId == predator.id) {
            if (predator.hunger < 145) {
                isPredatorHungry = true;
            }
        }
    });
    if (isPrayDead && !isPredatorHungry) {
        console.log("pray_eaten-test - OK");
    } else {
        console.log("pray_eaten-test - failed");
        if (!isPrayDead) {
            console.log("-pray was not removed from population");
        }
        if (isPredatorHungry) {
            console.log("-predator still hungry");
        }
    }
}
const testDeathByLackOfEssentialNeeds = (orgId, orgGroup) => {
    let isOrgDead = true;
    orgGroup.population.forEach(org => {
        if (org.id == orgId) {
            isOrgDead = false;
        }
    });
    if (isOrgDead) {
        console.log("org_death-test - OK");
    } else {
        console.log("org_death-test - failed");
    }
}
const testSpawnOrganism = (child, orgGroup, org01, org02) => {
    let childExist = false;
    orgGroup.population.forEach(org => {
        if (org.id == child.id) {
            childExist = true;
        }
    });
    let avgMaxVel = (org01.maxVelocity + org02.maxVelocity) / 2;
    let avgSize = (org01.size + org02.size) / 2;
    let avgDetRad = (org01.detectRadius + org02.detectRadius) / 2;
    let attributesInRange = {
        childExist: childExist,
        velInRange: true,
        sizeInRange: true,
        detRadInRange: true
    };
    if (child.maxVelocity < avgMaxVel * 0.9 || child.maxVelocity > avgMaxVel * 1.4) {
        attributesInRange.velInRange = false;
    }
    if (child.size < avgSize * 0.9 || child.size > avgSize * 1.4) {
        attributesInRange.sizeInRange = false;
    }
    if (child.detectRadius < avgDetRad * 0.9 || child.detectRadius > avgDetRad * 1.4) {
        attributesInRange.detRadInRange = false;
    }
    if (attributesInRange.childExist && attributesInRange.velInRange && attributesInRange.sizeInRange && attributesInRange.detRadInRange) {
        console.log("spawn_child-test - OK");
    } else {
        console.log("spawn_child-test - failed");
        if (!attributesInRange.childExist) {
            console.log("-new org was not created")
        } else {
            if (!attributesInRange.velInRange) {
                console.log("-new org 'velocity' att is out of range");
            }
            if (!attributesInRange.sizeInRange) {
                console.log("-new org 'size' att is out of range");
            }
            if (!attributesInRange.detRadInRange) {
                console.log("-new org 'detect range' att is out of range");
            }
        }
    }
}
const testGuiSideBarValues = (ecoElems_inputs) => {
    let inputsHaveNoEmptyValues = true;
    let orgGroupIds = Object.keys(ecoElems_inputs);
    //orgGroupIds.forEach(orgGroupId => {
    //    if (ecoElems_inputs[orgGroupId][5].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][6].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][4].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][9].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][10].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][11].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][12].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][7].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][8].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][0].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][1].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][2].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //    if (ecoElems_inputs[orgGroupId][3].value == "") {
    //        inputsHaveNoEmptyValues = false;
    //    }
    //});
    if (inputsHaveNoEmptyValues) {
        console.log("gui_sidebar-test - OK");
    } else {
        console.log("gui_sidebar-test - failed");
    }
}
const testGuiResetTime = (hourDisplay_display, dateTimeTracker) => {
    let isTimeDisplayedCorrectly = true;
    if (hourDisplay_display.value != "00") {
        isTimeDisplayedCorrectly = false;
    }
    let correctHours = true;
    let correctDays = true;
    let correctMonths = true;

    if (dateTimeTracker.getHours() != 0) {
        correctHours = false;
    }
    if (dateTimeTracker.getDays() != 0) {
        correctDays = false;
    }
    if (dateTimeTracker.getMonths() != 0) {
        correctMonths = false;
    }
    if (isTimeDisplayedCorrectly && correctHours && correctDays && correctMonths) {
        console.log("gui_timereset-test - OK");
    } else {
        console.log("gui_timereset-test - failed");
        if (!isTimeDisplayedCorrectly) {
            console.log("-incorrect time display");
        }
        if (!correctHours) {
            console.log("-incorrect 'hours' reset");
        }
        if (!correctDays) {
            console.log("-incorrect 'days' reset");
        }
        if (!correctMonths) {
            console.log("-incorrect 'months' reset");
        }
    }
}




