async function startApp() {
    const state = State.state;
    const V = Validators;
    const { $, message, localDate, showView, renderTransactions, renderCategoryOptions, renderCategoryList, renderSettings, renderAll, setInlineEdit } = UI;

    // load the stater recpords from seed.json
    if (state.records === null || state.records.length === 0) {
        const seed = await State.loadSeed();
        state.records = seed;
        if( seed.length) State.persist();
    }
   renderAll();
   renderSettings();
   $("date").value = localDate();

   document.addEventListener("click" ,event => { 
    const button =
    event.target.closest("[data-view]");
    if (button) showView(button.dataset.view);});

  //form with live regex validation
  const fields = [
    ["description", V.validateDescription],
    ["amount", V.validateAmount],
    ["category", V.validateCategory],
    ["date", V.validateDate]
  ];

   function checkField(id, validators) {
    const msg = validators($(id).value);
    $(id + "Error").textContent = msg;
    $(id).setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
   }

fields.forEach(([id, fn]) => $ (id).addEventListener("input", () => checkField(id, fn)));

function resetForm(){
    $("expenseForm").reset();
    fields.forEach(([id])=> {
        $(id + "Error").textContent = "";
        $(id).removeAttribute("aria-invalid");});
        $("date").value = localDate();
        renderCategoryOptions();
    }

$("expenseForm").addEventListener("submit", event => {
    event.preventDefault();
    const allOk = fields.map(([id, fn ]) => checkField(id, fn)).every(Boolean);
    if (!allOk) {
        message("Please fix the errors in the form.");
        return;
    }
State.addRecord({
    description: $("description").value,
    amount: Number($("amount").value),
    category: $("category").value,
    date: $("date").value
});
resetForm();
renderAll();
showView("dashboard");
message("Expense added.");
});

$("cancel").addEventListener("click", () => {
    resetForm();
    showView("dashboard");
});

//search and sort
function refreshList() {
    setInlineEdit(null);
    renderTransactions();
}

$("search").addEventListener("input" , refreshList);
$("caseToggle").addEventListener("change", refreshList);
$("sort").addEventListener("change", refreshList);


//inline editing and deleting
function focusEditButton(id) {
    const btn = Array.from(document.querySelectorAll("[data-edit]")).find(b => b.dataset.edit === id);
    if (btn) btn.focus();
}

function cancelEdit() {
    const id = $("editRow").dataset.id;
    setInlineEdit(null);
    renderTransactions();
    focusEditButton(id);
}

function saveEdits() {
    const id = $("editRow").dataset.id;
    const data = {
        description: $("editDesc").value,
        amount : $("editAmount").value,
        category : $("editCat").value,
        date : $("editDate").value
    };
    const error = V.validateRecord(data); if (error) {
        $("editError").textContent = error;
        return;
    }
    State.updateRecord(id, Object.assign({}, data,{amount: Number(data.amount)}));
    setInlineEdit(null);
    renderAll();
    focusEditButton(id);
    message("Expense updated.");

}


$("transactionsBody").addEventListener("click", event => {
    const edit = event.target.closest("[data-edit]");
    const del = event.target.closest("[data-delete]");
if(edit) {
    setInlineEdit(edit.dataset.edit);
    renderTransactions();
    $("editDesc").focus();
}
if (event.target.closest("[data-cancel]"))cancelEdit();
if (event.target.closest("[data-save]"))saveEdits();

if(del){
    const rec = state .records.find(r => r.id === del.dataset.delete);
    if (rec && confirm('delete "' + rec.description + '"? This cannot be undone.')
)
{ State.deleteRecord(rec.id);renderAll();
    message("Expense deleted.");}
}

});

// Enter saves, escape cancels inside the edit
$("transactionsBody").addEventListener("keydown", event => {
    if (!event.target.closest("#editRow")) return;
    if (event.key === "Escape") cancelEdit();
    if (event.key === "Enter" && event.target.tagName === "INPUT") saveEdits();

});


//cap and currencies
$("saveSettings").addEventListener("click", () => {
    const cap = $("budgetInput").value.trim();
    const base = $("baseCurrency").value.trim();
    const c1 = $("cur1Code").value.trim(), r1 = $("cur1Rate").value.trim();
    const c2 = $("cur2Code").value.trim(), r2 = $("cur2Rate").value.trim();

    const error = V.validateCap(cap) || V.validateCurrencyCode(base) || V.validateCurrencyCode(c1) || V.validateCurrencyCode(c2) || V.validateRate(r1) || V.validateRate(r2);
     $("settingsError").textContent = error;
     if (error) return;

     state.settings.budget = Number(cap);
     state.settings.baseCurrency = base;
     state.settings.currencies = [{code: c1.toUpperCase(), rate: Number(r1)}, {code: c2.toUpperCase(), rate: Number(r2)}
     ];
     State.persist();
     renderAll();
     message("Settings saved.");
});

//settings: categories
$("addCategory").addEventListener("click", () => {
    const name = $("newCategory").value;
    const msg = V.validateCategory(name);
 const exists = state.settings.categories.some(c => c.toLowerCase() ===name.toLowerCase());
$("newCategoryError").textContent = msg || (exists ? "That categpry already exists." : "");
if (msg || exists) return;


state.settings.categories.push(name);
$("newCategory").value = "";
State.persist();
renderCategoryList();
renderCategoryOptions();
message("Category added.");
});


$("settingsCategories").addEventListener("click" , event => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    if (state.settings.categories.length < 2) {
        message("Keep at least one categpry.");
        return;
    }
    
    const index = Number(button.dataset.remove);
    const name = state.settings.categories[index];
    if (confirm('remove category "' + name + '"? aeaxisting expenses keep this category.'))
    { state.settings.categories.splice(index, 1);
        State.persist();
        renderCategoryList();
        renderCategoryOptions();
        message("Category removed.");

    }});

// import/ export /reset
function exportData() {
    Store.downloadJSON(state.records, "pesa-data.json");
    message("data exported.");
}

$("exportBtn").addEventListener("click", exportData);
$("exportTop").addEventListener("click", exportData);
$("importFile").addEventListener("change" , async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
        const data = JSON.parse(await file.text());
        const error = V.validateImport(data);
        if (error) throw new Error(error);
        if (confirm("Replace your current records with"+ data.length + "imported records?")) {
            state.records = data;
            State.persist();
            renderAll();
            $("importMessage").textContent = "Imported " + data.length + "records.";}
            else{
                $("importMessage").textContent = "import cancelled.";

        }
    } catch (err) {
        $("importMessage").textContent = "Import failed: " + err.message; }
        event.target.value = "";

    });

    $("resetBtn").addEventListener("click", async () => {
        if (!confirm("Reset PESA to its starter data? This replaces, you records and settings."))
            return;
        state.records = await State.loadSeed();
        State.resetDefaults();
        State.persist();
        renderAll();
        renderSettings();
        message("Data reset.");
    });
}

//only start the app on the real page (test.html loads this fie=les to, but has no form)
if(document.getElementById("expenseForm")){startApp();}













