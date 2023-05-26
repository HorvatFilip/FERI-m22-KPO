class SimDataHandler {
    constructor() {

    }

    downloadFile(content, filename) {
        const link = document.createElement("a");
        content = JSON.stringify(content);
        const file = new Blob([content], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);
        link.download = filename + ".json";
        link.click();
        URL.revokeObjectURL(link.href);
    };
}