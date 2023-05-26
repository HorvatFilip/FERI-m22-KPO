const getRandomPointInsideCircle = (R, center) => {
    let r = R * Math.sqrt(Math.random());
    let theta = Math.random() * 2 * Math.PI;
    let x = center.x + r * Math.cos(theta);
    let y = center.y + r * Math.sin(theta);
    return new Vector(x, y);
}
const getRandomPointOnCircle = (R, center) => {
    let theta = Math.random() * 2 * Math.PI;
    let x = center.x + R * Math.cos(theta);
    let y = center.y + R * Math.sin(theta);
    return new Vector(x, y);
}
const randomNumberRange = (min, max) => {
    return Math.random() * (max - min) + min;
}
const euclidDistance = (node01, node02) => {
    return Math.sqrt(
        Math.pow(node01.x - node02.x, 2) + Math.pow(node01.y - node02.y, 2)
    );
}
const DEBUG = false;

const downloadFile = (content, filename) => {
    if (DEBUG) {
        const link = document.createElement("a");
        content = JSON.stringify(content);
        const file = new Blob([content], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);
        link.download = filename + ".json";
        link.click();
        URL.revokeObjectURL(link.href);
    }
};
