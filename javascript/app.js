let fromCoinList = document.getElementById('fromCoinList');
let toCoinList = document.getElementById('toCoinList');
let form = document.getElementById('form');
let fromAmountInput = document.getElementById('fromAmountInput');
let toAmountInput = document.getElementById('toAmountInput');
let fromSelected, toSelected, fromAmount, toAmount, fromPrice, toPrice;

class Currency {
    constructor(ticker,name,balance,price) {
        this.ticker = ticker;
        this.name = name;
        this.balance = balance;
        this.price = price;
    }
} //Funciona OK

let criptocurrencies = [
    new Currency('USDT', 'Tether USD', 1000, 1), 
    new Currency('BTC', 'Bitcoin', 0, 20150), 
    new Currency('ETH', 'Ethereum', 0, 1130), 
    new Currency('ADA', 'Cardano', 0, 0.46), 
    new Currency('DOT', 'Polkadot', 0, 6.90)
] //Funciona OK

function listCurrencies (element) {
    criptocurrencies.forEach (currency => {
        let optnElem = document.createElement('option')
        optnElem.value = currency.ticker;
        optnElem.textContent = currency.name;
        optnElem.setAttribute('price', currency.price);
        element.appendChild(optnElem);
    })
} //Funciona OK

function getValue(selectedList) { //Funciona OK // Validar para que no tome como valor el default del elemento select sino el de los options (childs)
    if (selectedList == fromCoinList) {
        fromSelected = selectedList.value;
        console.log(fromSelected); 
    } else if (selectedList == toCoinList) {
        toSelected = selectedList.value;
        console.log(toSelected);
        
    }
}

function addSwapCalcEvnt() {
    fromAmountInput.removeAttribute('readonly')
    fromAmountInput.addEventListener('input', calcularSwap);
    fromCoinList.addEventListener('change', calcularSwap)
    toCoinList.addEventListener('change', calcularSwap)
}

function executeSwap(e) { //Funciona OK
    e.preventDefault();

    if (confirm(`You are swapping ${fromAmount} ${fromSelected} for ${toAmount} ${toSelected}. Are you sure about it?`)) {
        for (const currency of criptocurrencies) {
            if (fromSelected == currency.ticker) {
                if (currency.balance < fromAmount || fromAmount < 0) {
                    alert("You can not swap more than you have! Or you've introduced a negative value"); 
                    return; 
                } else {
                    currency.balance -= fromAmount;
                    console.log(currency.balance);
                }
            }
        }

        for (const currency of criptocurrencies) { 
            if (toSelected == currency.ticker) {
                console.log(`${toAmount}`);
                currency.balance += toAmount;
                console.log(currency.balance);
            }
        }
    }
}

function calcularSwap() { //Funcion OK
    fromAmount = fromAmountInput.value; //Funciona OK
    console.log(fromAmount);
    criptocurrencies.forEach (currency => {
        if (fromSelected == currency.ticker) {
          fromPrice = currency.price;  
        }
    })
    
    criptocurrencies.forEach (currency => {
        if (toSelected == currency.ticker) {
          toPrice = currency.price;  
        }
    })
    toAmount = fromAmount * fromPrice / toPrice;
    toAmountInput.value = toAmount;
    console.log(toAmount);
}

listCurrencies(fromCoinList);
listCurrencies(toCoinList);

document.addEventListener('DOMContentLoaded', ()=> {
    form.addEventListener('submit', executeSwap); //Funciona OK
    fromCoinList.addEventListener('change', () => {getValue(fromCoinList)}); //Funciona OK
    toCoinList.addEventListener('change', () => {getValue(toCoinList); addSwapCalcEvnt()}); //Funciona OK
});

// Pendientes:
// Desarrollar faucet (timeout y 100 usdt c/24hs)
// Habilitar calculo de from a to y de to a from (actualmente solo es de from a to).
// Desarrollar sistema staking.
// Ver alternativa array.find para forEach y for...of
// Organizar codigo!
