const State = (() => {
    function freshDefaults(){
        return {
            budget: 1500000,
            baseCurrency: "Tsh",
            currencies: [{ code: "USD", rate: 0.0004},{code:"EUR", rate: 0.00035}],
            categories: ["food", "books", "Transport","Entertainment", "Fees", "others"]
        };
    }

    function readSettings() {
        const saved = Store.load("pesa:settings", {});
        const ok = saved && typeof saved === "object" && !Array.isArray(saved);
        const d= freshDefaults();
        const s = Object.assign(freshDefaults(), ok? saved : {});
        if (!Array.isArray(s.currencies) || s.currencies.length<2) s.currencies = d.currencies;
        if (!Array.isArray(s.categories) || s.categories.length == 0) s.categories = d.categories;
        if (typeof s.budget !== "number") s.budget =d.budget;
        if (typeof s.baseCurrency !== "string") s.baseCurrency = d.baseCurrency;
        return s; 
    }

    function readRecords() {
        const saved = Store.load("pesa:records", null);
            if (!Array.isArray(saved)) return null;
            return saved.filter(r => r && typeof r.id === "string" && typeof r.description === "string" && typeof r.amount === "number" && typeof r.date === "string" && typeof r.category === "string");
    }
   const state = { records: readRecords(), settings: readSettings()};

function persist() { Store.save("pesa:records", state.records);
                    Store.save("pesa:settings", state.settings);}


async function loadSeed() {
    try {
        const res = await fetch("seed.json");
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    }catch (e) {return []; }
}

function nextId() {
     const nums = state.records.map(r => Number(String(r.id).replace ("rec_", "")) || 0);
     let n =Math.max(0, ...nums) + 1;
     while (state.records.some(r => r.id === "rec_" + String(n).padStart(4, "0"))) n++;
     return "rec_" + String(n).padStart(4, "0");
}

function addRecord(data) {
    const now = new Date().toISOString();
    state.records.push(object.assign({ id: nextId() }, data,{  CreatedAt: now, updatedAt: now }));
persist();
} 

function updateRecord(id,data) {
    const rec = state.records.find(r => r.id === id);
    if (!rec) return;
    Object.assign(rec, data, { updatedAt: new Date().toISOString()});
    persist();
}
function deleteRecord(id) {
    state.records = state.records.filter(r => r.id !== id);
    persist();
}
function resetDefaults() {
    state.settings = freshDefaults();}
return {
        state, persist, loadSeed, addRecord, updateRecord, deleteRecord, resetDefaults
    };
}
)();
