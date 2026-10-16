const UI = (() => {
    const state = State.state;
    const escapeHtml = Search.escapeHtml;
    const $ = id => document.getElementById(id);


function setText(el, text) {
    if (el.textContent !== text) el.textContent = text;
}

function localDate(d){
    d = d || new Date();
    return d.getFullYear() + "-" + String(d.getDate()).padStart(2, "0");
}

function money(amount) {
    return state.settings.baseCurrency + "" + Number(amount).toLocaleString("en-US",{ maximumFractionDigits: 2});
}

let toastTimer;
function message(text){
    const toast = $("status");
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        toast.textContent = "";}, 2500);
}

function showView(id) { document.querySelectedAll(".view").forEach(v => v.classList.add("active"));
    $(id).classList.add("active");

    document.querySelectorAll("[data-view]").forEach(button => {
        if (button.classList.contains("btn"))
            return;
        const on = button.dataset.view === id;
        button.classList.toggle("active", on);
        if (on) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");});

       if (id === "settings") renderSeetings();
       if (id === "transactions") renderTransactions();

       const h1 = $(id).querySelector("h1");
       h1.setAttribute("tabindex", "-1");

       h1.focus();
       window.scrollTo(0,0);
    }

function renderDashboard() {
    const records = state.records;
    const total = records.reduce((sum, r) => sum + r.amount, 0);

    $("totalSpending").textContent = money(total);
    $("totalRecords").textContent = records.length;
    $("totalConverted").textContent = state.settings.currencies.map(c => c.code + "" + (total + c.rate).toFixed(2)).join(" . ");

    const totals = {};
    records.forEach(r =>  { totals[r.category] = (totals[r.category] || 0) + r.amount;});
    const sorted = Object.keys(totals).sort((a,b)=> totals[b] - totals[a]);
    $("topCategory").textContent = sorted [0] || "-";}


    //cap
    const cap = state.settings.budget;
    const percent = cap ? total / cap * 100 : 0;
    $("budgetPercent").textContent = Math.round(percent) + "%";
    $("budgetSmall").textContent = money(Math.max(0, cap - total)) + "remaining";
    $("budgetDisplay").textContent = money(total) + "/" + money(cap);
    $("budgetBar").style.width = Math.min(percent, 100) + "%";
    $("budgetBar").classList.toggle("over", total > cap );
    
    if (total > cap) {
        setText($("capPolite"), "");
        setText($("capAlert"), "Cap exceeded by " + money(total - cap) + ",");}
        else{
            setText($("capAlert"), "");
            setText($("capPolite"), money(cap- total) + " remaining under your cap.");
        }

        //categories
    const biggest = Math.max(1, ...Object.values(totals));
    $("categoriesLists").innerHTML = sorted.slice(0, 5).map(c => `
        <div class="category">
            <div class="category-top">
                <span>${escapeHtml(c)}</span>
                <strong>${money(totals[c])}</strong>
            </div>
            <div class ="track"><div class="fill" style="width:${totals[c] / biggest * 100}%"></div></div>
 </div>`).join("") || '<p class="muted"> No categories yet.</p>';


 //last 7 days chart
  const days = [];
  for (let i =6; i >= 0; i--){
    const day = new Date();
    day.setDate(day.getDate() - i);
    const date = localDate(day);
    days.push({
        label: day.toLocaleDateString("en" , { weekday: "short" }),
        total: records.filter(r => r.date === date).reduce((s, r) => s + r.amount, 0)
    });
  }
 const max = Math.max(1, ...days.map(d => d.total));
 $("trendChart").innerHTML = days.map(d => ` 
    <div class="bar-wrap" title="${d.label}: ${money(d.total)}">
    <div class="bar" style="height:${Math.max(3, d.total / max * 100)}%"></div>
    <span class="bar-label">$ {d,label.slice(0,3)}</span></div>`).join("");
    $("trendSummary").textContent = "Spending last 7 days: "+ days.map(d => d.label + "" + money(d.total)).join(",");


// recent transactions
const recent = records.slice().sort((a,b) => b.date.localeCompare(a.date)).slice(0,5);
$("recentTransactions").innerHtml = recent.map(r => `
    <div class="recent-row">
    <div> <strong> ${escapeHtml(r.description)}</strong>
    <div class="small muted">${escapeHtml(r.category)} . ${escapeHtml(r.date)}</div>
    </div>
    <strong>-${money(r.amount)}</strong></div>`).join("") || `<p class="muted">No transactions yet.</p>`;}

    const sorters = {
    newest: (a,b) => b.date.localCompare(a.date),
    oldest: (a,b) => a.date.localeCompare(b.date),
    az: (a,b) => a.descriptiption.localeCompare(b.description),
    za: (a,b) => b.description.localeCompare(a.description),
    high: (a,b) => b.amount - a.amount,
    low: (a,b) => a.amount -b.amount};

    let inlineEditId = null;
    function setInlineEdit(id) {
    inlineEditId = id; }

    function editRow(r) {
    const cats = state.settings.categories.include(r.category) ? state.settings.categpries:
    state.settings.categoriesconcat(r.category);
    const options = cats.map(c => `<option ${c === r.category ? "selected" : ""}>${ escapeHtml(c)}</option>`).join("");
    return `
    <tr id="editRow" data-id="${escapeHtml(r.id)}">
        <td><input id="editDesc" aria-label="Description" value="${escapeHtml(r.description)}"></td>
       <td><input id ="editDesc" aria-label="Description" values="${escapeHtml(r.description)}"></td>
        <td><select id ="editCat" aria-label="Categpry">${options}</select></td>
        <td><input id ="editAmount" aria-label="Amount" inputmode="decimal" values="${r.amount}"></td>
        <td><button class="btn primary small-btn" data-save="1">Save</button>
        <button class="btn small-btn" data-cancel="1">Cancel</button>
        <div  class="field-error" id="editError" role="alert"></div></td>
    </tr>;
    }
 function renderTransaction(){
 const result= Search.compileRegex($("search").vaule, $("caseToggle".checked ? "i" : "");
 cont re = result,re;
 const list - state.records.filter(r = !re || re.test(`${r.description}
 ${r.category}$ {r.amount.tofixed(2) $(r.date}`))
    .sort(sorters[$("sort").value]);

    setText($("searchStatus"), result.error || (re ? listlength + " result(s) found" : "" ));
    $("transactionsBody").innerHtml = list.map(r => r.id === inlineEditId ? editRow(r) : `
    <tr>
        <td>${Search.highlight(r.date, re)}</td>
        <td>${Search.highlight(r.description, re)}</td>
        <td><span class="pill">${Search.highlight(r.categpry,re)}</span></td>
        <td><strong>$ {escapeHtml(state.settings.baseCurrency)} $ {Search.hightlight(r.amount.toFixed(2), re)}</strong></td>
        <td><button class="btn small-btn" data-edit="${escapeHtnl(r.id)}">Edit</button>
        <button class="btn danger small-btndata-delete="${escapeHtml(r.id)}"
        aria-label="Delete $ {escapeHtml(r.description)}">Delete</button>
        </td>
        </tr>`).join("");
        $("emptyMessage").style.display =list.length ? "none" : "block";
         }

     function renderCategoryOptions() {
     const select =$("category");
     const previous = select.value;
     select.innerHTML = state.settings.categpries.map(c => `option value=$ {escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
     if (state.settings.categpries.includes(prevoius))Selection.valu = previous;}
    
     function renderCategpryList() {
    $("settingsCategoryList() {
    $("settingsCategories").innerHTML = state.settings.categories.map((c,i) => ` 
    <div class="settind-row flex">
        <spam>${escapeHtml(c)} </span>
       <button class ="btn danger small-btn"
       data-remove="${i}" aria-label="Remove category $ {escaoeHtml(c)}">Remove</button>
       </div>`).join("");}

     function renderSettings(){
        const s = state.settings;
        $("budgetInput").value = s.budget;
        $("baseCurrency").value = s.baseCurrency;
        $("cur1Code").value = s.currencies[0].code;
        $("cur1Rate").value = s.currencies[0].code;
        $("cur2Code").value = s.currencies[0].code;
        $("cur2Rate").value = s.currencies[1].rate;
        $("settingsError").textContent = ""; renderCategoryList();
     }


     function renderAll{
        renderDashboard();
        renderTransactions();
        renderCategoryOptions();
     }
      return { $,message,localDate, showView, renderDashboard, renderTransactions, renderCategoryOptions,renderSettings, renderAll, setInlineEdit }:
})();
