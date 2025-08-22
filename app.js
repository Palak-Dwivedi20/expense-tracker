const form = document.getElementById("tx-form");
let ul = document.querySelector("#tx-list");


let transactions = [];


function renderTransactions() {
    ul.innerHTML = ""; 
    let income = 0;
    let expense = 0;

    const filteredTransactions = getFilteredTransactions();

    filteredTransactions.forEach(tx => {
        if (tx.amount > 0) income += tx.amount;
        else expense += Math.abs(tx.amount);

        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${tx.title}</strong> — ${tx.category} — ${tx.date}
            <span>${tx.amount >= 0 ? '+' : '-'}₹${Math.abs(tx.amount)}</span>
            <button data-id="${tx.id}">Delete</button>
        `;
        ul.appendChild(li);
    });

    document.getElementById("balance").textContent = `₹${income - expense}`;
    document.getElementById("income").textContent = `₹${income}`;
    document.getElementById("expense").textContent = `₹${expense}`;
}


ul.addEventListener("click", function(e){
    if(e.target.tagName === "BUTTON"){ 
        const id = e.target.getAttribute("data-id"); 
        transactions = transactions.filter(tx => tx.id !== id);
        renderTransactions();
    }
});


form.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value || new Date().toISOString().slice(0,10);
    let type = [...document.querySelectorAll('input[name="type"]')].find(r=>r.checked).value;

    
    if (category === "salary") type = "income";

    const finalAmount = type === "income" ? Math.abs(amount) : -Math.abs(amount);
    
    const newTransaction = {
        id: "tx_" + Date.now(),
        title,
        amount: finalAmount,
        category,
        date
    };

    transactions.unshift(newTransaction);
    renderTransactions();

    e.target.reset();
});


const typeFilter = document.getElementById("typeFilter");
const catFilter = document.getElementById("catFilter");

function getFilteredTransactions() {
    let filtered = [...transactions];

    if (typeFilter.value !== "all") {
        filtered = typeFilter.value === "income"
            ? filtered.filter(tx => tx.amount > 0)
            : filtered.filter(tx => tx.amount < 0);
    }

    if (catFilter.value !== "all") {
        filtered = filtered.filter(tx => tx.category === catFilter.value);
    }

    return filtered;
}

typeFilter.addEventListener("change", renderTransactions);
catFilter.addEventListener("change", renderTransactions);


renderTransactions();

