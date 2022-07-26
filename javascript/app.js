let fromCoinList = document.getElementById('fromCoinList');
let toCoinList = document.getElementById('toCoinList');
let form = document.getElementById('form');
let fromAmountInput = document.getElementById('fromAmountInput');
let toAmountInput = document.getElementById('toAmountInput');
let faucetBtn = document.getElementById('faucetBtn');
let resetBtn = document.getElementById('resetBtn');
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
    new Currency('USDT', 'Tether USD', 0, 1), 
    new Currency('BTC', 'Bitcoin', 0, 20150), 
    new Currency('ETH', 'Ethereum', 0, 1130), 
    new Currency('ADA', 'Cardano', 0, 0.46), 
    new Currency('DOT', 'Polkadot', 0, 6.90)
] //Funciona OK

function faucetAdd() {
    criptocurrencies[0].balance += 100;
    faucetBtn.classList.add('faucetOff');
    faucetBtn.removeEventListener('click', faucetAdd);
    localStorage.setItem('criptocurrencies', JSON.stringify(criptocurrencies));
    const faucetTimeout = setTimeout(() => {faucetBtn.classList.remove("faucetOff"); faucetBtn.addEventListener('click', faucetAdd) }, 12 * 3600 * 1000);
    alert("You got 100 USDT added to your balance. You'll be able to get another 100 USDT every 12 hours.");
} //Funciona OK


function resetFaucet() {
    localStorage.clear();
    faucetBtn.classList.remove('faucetOff');
    faucetBtn.addEventListener('click',faucetAdd);
    clearTimeout(1);
    criptocurrencies.forEach (currency => {
        currency.balance = 0;
    })
} //Funciona OK

function listCurrencies (element) {
    criptocurrencies.forEach (currency => {
        let optnElem = document.createElement('option')
        optnElem.value = currency.ticker;
        optnElem.textContent = currency.name;
        optnElem.setAttribute('price', currency.price);
        element.appendChild(optnElem);
    })
} //Funciona OK

function getCoin(selectedList) {
    if (selectedList == fromCoinList) {
        fromSelected = selectedList.value;
        console.log(fromSelected); 
    } else if (selectedList == toCoinList) {
        toSelected = selectedList.value;
        console.log(toSelected);
    }
} //Funciona OK // Validar para que no tome como valor el default del elemento select sino el de los options (childs)

function addSwapCalcEvnt() {
    fromAmountInput.removeAttribute('readonly')
    fromAmountInput.addEventListener('input', calcularSwap);
    fromCoinList.addEventListener('change', calcularSwap)
    toCoinList.addEventListener('change', calcularSwap)
} //Funciona OK

function executeSwap(e) {
    e.preventDefault();

    if (confirm(`You are swapping ${fromAmount} ${fromSelected} for ${toAmount} ${toSelected}. Are you sure about it?`)) {
        for (const currency of criptocurrencies) {
            if (fromSelected == currency.ticker) {
                if (currency.balance < fromAmount || fromAmount < 0) {
                    alert("You can not swap more than you have! Or you've introduced a negative value"); 
                    return; 
                } else {
                    currency.balance -= fromAmount;
                }
            }
        }

        for (const currency of criptocurrencies) { 
            if (toSelected == currency.ticker) {
                currency.balance += toAmount;
            }
        }

        localStorage.setItem('criptocurrencies', JSON.stringify(criptocurrencies));

        alert('The swap was successful!');
        document.getElementById("form").reset();
    }
} //Funciona OK

function calcularSwap() { 
    fromAmount = fromAmountInput.value;
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
} //Funcion OK

function onLoadGetStoragedBalances() {
    if (!JSON.parse(localStorage.getItem('criptocurrencies'))) {
        return
    } else {
        criptocurrencies = JSON.parse(localStorage.getItem('criptocurrencies'));
    }
} //Funciona OK

document.addEventListener('DOMContentLoaded', ()=> {
    onLoadGetStoragedBalances();
    listCurrencies(fromCoinList);
    listCurrencies(toCoinList);
    form.addEventListener('submit', executeSwap); //Funciona OK
    fromCoinList.addEventListener('change', () => {getCoin(fromCoinList)}); //Funciona OK
    toCoinList.addEventListener('change', () => {getCoin(toCoinList); addSwapCalcEvnt()}); //Funciona OK
    faucetBtn.addEventListener('click', faucetAdd);
    resetBtn.addEventListener('click', resetFaucet)
});

// Pendientes:
// Modal dando aviso de 12hs de espera y de +100 usdt (por ahora hecho con alert)
// Ademas deshabilitar boton (listo) y mostrar temporizador en descuento en lugar del "Start now!".
// Desarrollar sistema staking. Staking: restar balance a saldo de objeto elegido y creacion array de objetos (stakedCryptocurrencies) con balances delegados.
// Luego, en funcion del tiempo transcurrido ir sumando en de acuerdo a un apy ficticio. Y al unstakear sumar total a objeto en array criptocurrencies.
// Orden de codigo?
