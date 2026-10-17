const Store = (() => {
    function load(key, fallback) {
        try{
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
           // corrupted data will not crash the app
        }
    }
    function save(key, data) {
        try { localStorage.setItem(key, JSON.stringify(data));} 
        catch(e) { /* storage full or blocked*/}
    }
    function downloadJSON(data, filename) {
        const blob= new Blob ([JSON.stringify(data, null, 2)], 
    {type: "application/json"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    }
    return { load, save, downloadJSON };
})();