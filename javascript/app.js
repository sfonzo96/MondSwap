let fromCoinList = document.getElementById('fromCoinList');
let toCoinList = document.getElementById('toCoinList');
let form = document.getElementById('form');
let fromAmount = document.getElementById('fromAmount');
let toAmount = document.getElementById('toAmount');
let fromSelected, toSelected;

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
    new Currency('BTC','Bitcoin', 0, 20150), 
    new Currency('ETH','Ethereum', 0, 1130), 
    new Currency('ADA','Cardano', 0, 0.46), 
    new Currency('DOT','Polkador', 0, 6.90)
] //Funciona OK

function listCurrencies (element) {
    criptocurrencies.forEach (currencies => {
        let optnElem = document.createElement('option')
        optnElem.value = currencies.ticker;
        optnElem.textContent = currencies.name;
        element.appendChild(optnElem);
    })
} //Funciona OK

document.addEventListener('DOMContentLoaded', ()=>{
    form.addEventListener('submit', submitForm);
    fromCoinList.addEventListener('change', function () {getValue(fromCoinList)}); //Funciona OK
    toCoinList.addEventListener('change', function () {getValue(toCoinList)}); //Funciona OK
});

function getValue(selectedList) { //Funciona OK
    if (selectedList == fromCoinList) {
        fromSelected = selectedList.value;
        console.log(fromSelected); 
    } else if (selectedList == toCoinList) {
        toSelected = selectedList.value;
        console.log(toSelected);
    }
}

function submitForm(e) {
    e.preventDefault();

    calcularSwap() //Crear funcion, ver abajo. 
}

function calcularSwap() {
    
}

/* 
FUNCION calcularSwap PARA CONVERTIR Y REDEFINIR BALANCES

Ver como en funcion de los strings obtenidos en fromSelected y toSelected (ver funcion getText),
tomando las cantidades ingresadas en los inputs toAmount y fromAmount  + los precios (tomados de la array criptocurrencies {Ver validez en agregar atributo precio a cada opt de la lista para facilitad})

Posible forma de calculo para conversiion: usar if (originCoin == 'usdt' && destinyCoin == 'btc') {swapOk(usdtVal,btcVal,swapAmount)} else if {} repetir para todas las posibilidades...

function swapOk(originVal, destinyVal, swapAmount) {
    Muy a lo bruto, tengo que hacer este calculo. Pensar como vincular los valores y los balances en funcion de lo que se ingresa al promp para no repetir tanto codigo.
    balanceDestino = balanceDestino + swapAmount * valorOrigen / valorDestino;
    balanceOrigen = balanceOrigen - swapAmount;
} 
*/

listCurrencies(fromCoinList);
listCurrencies(toCoinList);