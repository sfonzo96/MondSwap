let fromCoinList = document.getElementById('fromCoinList');
let toCoinList = document.getElementById('toCoinList');
let form = document.getElementById('form');
let fromAmountInput = document.getElementById('fromAmount');
let toAmountInput = document.getElementById('toAmount');
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
    new Currency('USDT', 'Tether USD', 100, 1), 
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

document.addEventListener('DOMContentLoaded', ()=>{
    form.addEventListener('submit', submitForm); //Funciona OK
    fromCoinList.addEventListener('change', function () {getValue(fromCoinList)}); //Funciona OK
    toCoinList.addEventListener('change', function () {getValue(toCoinList)}); //Funciona OK
});

function getValue(selectedList) { //Funciona OK // Validar para que no tome como valor el default del elemento select sino el de los options (childs)
    if (selectedList == fromCoinList) {
        fromSelected = selectedList.value;
        console.log(fromSelected); 
    } else if (selectedList == toCoinList) {
        toSelected = selectedList.value;
        console.log(toSelected);
    }
}

function submitForm(e) { //Funciona OK
    e.preventDefault();

    calcularSwap()
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
}

listCurrencies(fromCoinList);
listCurrencies(toCoinList);

// Pendientes:
// Desarrollar faucet y sistemma de balances.
// Desarrollar sistema staking.