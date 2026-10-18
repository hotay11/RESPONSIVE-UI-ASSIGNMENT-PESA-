# PESA – Student Finance Tracker

PESA is a responsive, accessible and responsive student expense tracker, which is created with plain HTML, CSS and JavaScript (no frameworks). It allows you to record spending, search by regular expressions, monitor how much you've spent up to some personal limit and save everything in your browser.

Student Finance Tracker (Summative – Building Responsive UI) was selected as the theme.

| | |
|---|---|
| Demo video (unlisted) | https://youtu.be/li_cpJpTRMQ |
| Repository | https://github.com/hotay11/RESPONSIVE-UI-ASSIGNMENT-PESA- |
| Author(s) | GitHub hotay11, Email: j.hotay@alustudent.com |

---

Once you have downloaded the files, you will need to use the Live Server to run the program; do not double click.

Avoid double clicking on index.html. This app fetches the data from a starter file called seed.json using the app's fetch function, but fetch is disabled on pages served under file://. When double clicking the file, the seed.json file will not be able to be loaded and the starter records will not display.

Use a local web server:

Recommended: Use a Live Server in VS Code.Recommended: Use Live Server in VS Code.

Open the project folder with VS Code.Open the project folder in VS Code.
3. Install the Live Server extension (Ritwick Dey).
3. Right click on index.html and select Open with Live Server.
4. The app opens at `http://127.0.0.1:5500` and `seed.json` loads correctly.

**Option 2 – Python**

```bash
git clone https://github.com/hotay11/RESPONSIVE-UI-ASSIGNMENT-PESA-.git
cd RESPONSIVE-UI-ASSIGNMENT-PESA-
python3 -m http.server 8000
```

Then open http://localhost:8000.

The version on GitHub Pages is served with https so there is no setup required.

---

## Features

- Dashboard – total spending, number of records, top category, converted totals, spending-cap progress bar, top-5 category breakdown, last-7-days bar chart and the 5 most recent transactions.
Transactions – list all transactions, and search live using regular expressions, case-sensitive, sort, edit and delete on the fly.
Live validation & in-line error messages for Add Expense form.
- **Settings** – Spend Cap, Base currency plus 2 other currencies, with manual rates, edit category list, JSON import/export and reset to starter data.
About: app's purpose and contact information.
- **Persistence**: any change will be automatically saved to `localStorage` and be there even after a reload.
Validates imported files line by line before overwriting your data (JSON import/export)
The local server is required because the seed data is loaded the first time the app is run (or after a reset).

### Defaults

The base currency is Tsh and the two conversion currencies are USD (rate 0.0004) and EUR (rate 0.00035). Rates are typed in (no API).
There are two types of categories: food, books, transport, entertainment, fees, others; all editable.
- Spending cap: 1,500,000 (editable).

---

## Data model

There is an id, a description, an amount, a category and date per record:

```json
{
  "id": "rec_0001",
  "description": "Lunch at cafeteria",
  "amount": 5000,
  "category": "Food",
  "date": "2026-10-08"
}
```

New ids are created by the prefix `rec_`, followed by a zero-padded number and ensuring that no id will be repeated.

localStorage keys: pesa:records and pesa:settings.

### Known limitation: timestamps

Every record should have `createdAt` and `updatedAt` attributes in the data model requested for this assignment. These timestamps are not present in the records in my `seed.json`: The records that I add in the app get `createdAt` and `updatedAt`, and editing any record updates the `updatedAt` value, but the starter records don't have these, and the import check doesn't currently require them. <!-- TODO: if your `seed.json` records have these timestamps, update this section when you're submitting your app -->

---

## Project structure

```
index.html
seed.json
styles/
  main.css
scripts/
  store.js        localStorage load/save and JSON download
  search.js       safe regex compiler, match highlighting, HTML escaping
  state.js        app state, settings, add/update/delete, seed loading
  validators.js   all regex rules and import validation
  UI.js           rendering and DOM updates
  main.js         startup and event wiring
codevibe-reports/     
```

The scripts are all IIFEs exposing one object each (Store, Search, State, Validators, UI). The scripts are loaded in that dependency order from `index.html` and `main.js` is the last script loaded and in charge of the app start.

---

## Regex catalog

Support for "1" | Support for "2" | Support for "3" | Support for "4" |
|---|---|---|---|
| Description (no leading/trailing space) | `/^\S(?:.*\S)?$/` | `Bus pass` | ` Bus pass` |
| Description (no double spaces) | `/\s{2,}/` (rejects a match) | `Bus pass` | `Bus  pass` |
A word that appears in a sentence more than once (or not at all).A word that is repeated in a sentence or not repeated at all. | `/\b(\w+)\s+\1\b/i` (rejects a match) | `Lunch at cafe` | `Lunch at at cafe` |
| Amount | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | `5000`, `12.50` | `012`, `12.505` |
| Date | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | `2026-10-08` | `2026-13-01` |
| Category | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | `Food`, `Fast-food` | `Food2` |
| Currency code | `/^[A-Za-z]{2,5}$/` | `USD`, `Tsh` | `U$` |
| Exchange rate | `/^(0\|[1-9]\d*)(\.\d{1,8})?$/` and greater than 0 | `0.0004` | `0`, `-1` |

Additional date control: the date which matches the pattern should also be a real date (rebuilds date with new Date(), compares), so 2026-02-30 is rejected.

The form fields are validated as the user types (on input event). Each field displays an inline message, and assigns `aria-invalid`.

### Searching with regex

Any regular expression can be used in the search box.

- The pattern will be compiled within the try/catch. There is no crash when an invalid pattern is entered. Instead it displays an "invalid pattern" status message.
The “Ignore case” checkbox enable or disable the `i` flag.
The description, category, amount (2 decimals) and date are the text that is searched for each record.
The matches are wrapped in `<mark>`. All text is HTML-escaped first, so a record that has `<` or `&` in it cannot inject markup.
Patterns like a* do not loop forever when there is a gap between the pattern and the guard.

Try the following searches:

| Goal | Pattern |
|---|---|
| Coffee or tea | `(coffee\|tea)` |
| Amounts with cents | `\.\d{2}\b` |
| Repeated word | `\b(\w+)\s+\1\b` |
| Entries from October 2026 | `^2026-10` |

---



## Keyboard map

| Key | Action |
|---|---|
Tab / Shift+Tab | Scroll to next link / button / field |
When the page loads, `Tab` to the "Skip to main content" link, and then press `Enter`:
Pressing the Enter or Space key on a navigation button | Switch view (focus is now on the heading of the page that was just loaded)
Press `Enter` within an inline-edit box | Press the "Save the edit" button |
Presses the Cancel Edit (Esc to drop out of edit focus) button.
Click on Add button on the form | Submit the expense |

Focusable elements have outlines on focus `:focus-visible`.

---

## Accessibility notes

<header, <nav (for desktop sidebar and mobile bar, respectively), <main, <section, <footer> – semantic landmarks. One `h1` per view.
The first element that is focusable is a skip-to-content link.
There is a bound `<label>` for each input.
- Status messages: "role=status" (search results, import result, toasts, to stay under your cap). The cap-exceeded message has an alert role it is announced assertively. <!-- TODO: verify capAlert has role=alert before submitting -->
There are forms with errors which show up next to the form field and the field receives the attribute `aria-invalid="true"`.
- The button that is being used is marked as active with the attribute `aria-current="page"`.
Focus updates to the heading of a view when the view updates; screen reader users are thus informed of their location within the view.
The animation and transition settings can be disabled by using the preference `prefers-reduced-motion: reduce`.
- Colors: light text on dark background with green, red and blue accents. <!-- TODO: run a contrast checker on --muted (#8ea0b8) and the accent colors and note the results here -->

---

## Responsive design

Mobile-first layout. Add layout for: base styles for phones (~360px), and `min-width` media queries:

- tablet layout (multi-column cards, form grids): 768px
- desktop layout (sidebar navigation appears, the mobile bottom bar is hidden) – 1024px

Views fade in, and there is a keyframe animation on the buttons, table rows, progress bars and chart.

---

## Cap and currency

The dashboard shows a comparison of all spending vs. your cap. There's a polite message under the cap that indicates how much is left. A message will be displayed over the top with how many points you have surpassed the cap by.
Also the total is displayed in both the two currencies you have specified in Settings.

---

## Import, export and reset

- To download all records as `pesa-data.json`, use Export (top bar or Settings).
Import loads a JSON file and validates each record as follows: it is an object, it contains a unique string `id`, it contains a valid description, it contains a valid amount that conforms to the amount rule, it contains a valid date, and it contains a valid category. The first problem encountered is reported with its record number, and if the file passes then nothing is changed—unless you confirm it to replace it.
Resets records and settings to the starter data (after confirmation).
Incorporates defaults in case of corrupted/missing `localStorage` data without causing crashes.

---



Manual tests I perform prior to release:

1) Skipping Link, navigate all views, Add, Edit (Enter/Esc), Delete.
Repeat step 2, adding an expense whose name includes the same word twice, e.g., `Lunch lunch`.Repeat step 2, with an expense having the repeated word in its name, such as `Lunch lunch`.
3. Use an invalid pattern (like ( and check that the app pops up a message and doesn't crash.
4. Export data, delete the data, re-import and check records.
5. Place the cap under the total and press over-cap.
6. Resize to ~360px, 768px and 1024px.

---

No items are found for AI usage.There are no reports for AI usage in CodeVibe.

The programming of this project was done by myself. I will tell you two things first:


- **The CodeVibe report.** I'm worried my CodeVibe report might be off since I think it has picked up some non-activity time, and that's why the AI-authorship is higher than it actually is.  The code is in the form of a step-by-step development process, as evidenced by my git history and commit dates, and I am willing to describe any file in a viva.

---
