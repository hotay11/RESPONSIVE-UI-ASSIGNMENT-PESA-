const Validators = (() => {
    const rules = {
        description: /^\S(?:.*\S)?$/,
        amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
        date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
        duplicateWord: /\b(\w+)\s+\1\b/i,
        doubleSpace: /\s{2,}/,
        currencyCode: /^[A-Za-z]{2,5}$/,
        rate: /^(0|[1-9]\d*)(\. \d{1,8})?$/
};

// Each validator returns "" when OK or an error message.
function validateDescription(v) {
    if(!rules.description.test(v)) return "Required. No leading or trailing spaces.";
    if(rules.doubleSpace.test(v)) return "Use single spaces between words";
    if (rules.duplicateWord.test(v)) return "A word is repeated (like 'the the'). Pleazse check it.";
    return "";
}
function validateAmount(v) {
    return rules.amount.test(v) ? "" : "Numbers only, up to 2 decimals (e.g 5000 0r 12.50).";
    }
function validateDate(v) {
    if (!rules.date.test(v)) return "use the format YYYY-MM-DD.";
    const d = new Date(v);
 if (isNaN(d) || d.toISOString().slice(0, 10) !== v) return " That date does not exist.";
 return "";
}
function validateCategory(v) {
    return rules.category.test(v) ? "" : "letters, spaces and hyphens only.";
}
function validateCap(v) {
    return rules.amount.test(v) ? "": "Cap must be a number (up to 2 decimal places).";
}
function validateCurrencyCode(v) {
    return rules.currencyCode.test(v) ? "" : "currency codes are 2 to 5 letters.";
}
 function validateRate(v) {
    return rules.rate.test(v) && Number(v) > 0 ? "" : "Rates must be numbers above 0.";
 }
 function validateRecord(r) {
    return validateDescription(r.description) || validateAmount(String(r.amount)) || validateCategory(r.category) || validateDate(r.date);
 }
 function validateImport(list) {
    if (!Array.isArray(list)) return "File must contain a list of records.";
    const ids = new Set();
    for (let i = 0; i < list.length; i++) {
        const r = list[i];
        const n = "Record" + (i + 1) + ": ";
        if (!r || typeof r !== "object") return n + "not an object.";
        if (typeof r.id !== "string" || !r.id || ids.has(r.id)) return n + "missing or duplicate id.";
        ids.add(r.id);
        if (typeof r.description !== "string" || !rules.description.test(r.description)) return n + "bad description.";
        if (typeof r.amount !== "number" || !rules.amount.test(String(r.amount))) return n + "bad amount.";
        if (typeof r.date !== "string" || validateDate(r.date)) return n + "bad date";
        if (typeof r.category !== "string" || ! rules.category.test(r.category)) return n + "bad category.";
    }
    return "";
 }
 return { rules, validateDescription, validateAmount, validateDate, validateCategory, validateCap, validateCurrencyCode, validateRate, validateRecord, validateImport };}
)();