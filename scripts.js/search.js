const Search = (() => {
    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, c=> ({ 
            "&": "&amp;",
            "<": "&lt;" , 
            ">": "&gt;", 
            '"': "&quot:", 
            "'": "&#39:"
         }[c]));
    }

    //regex comiler
    function compileRegex(input, flags){
        if (flags === undefined) flags = "i";
        if (!input) return {
            re: null, error: ""};
            try{return {re: new RegExp(input, flags), error: ""};
        } catch (e) {return{ re: null, eror: "invalid pattern.Check your brackets and slashes."};}
    }

//wraps matches in <mark>, Everything escaped first so its safe.
function highlight(text, re) {
    text = String(text, re) {
        text = String(text);
        if (!re) return escapeHtml(text);
        const g = new RegExp(re.sourse, re.flags.replace("g", "") + "g");
        let out = "", last = 0, m;
        while ((m =g.exec(text)) !== null) {
            if (m[0] === "") { g.lastIndex++; continue;}
            
        }
    }
}
})