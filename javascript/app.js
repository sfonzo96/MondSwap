let fromCoinList = document.querySelector('#fromCoinList');
let toCoinList = document.querySelector('#toCoinList');

class Currency {
    constructor(ticker,name,balance,price) {
        this.ticker = ticker;
        this.name = name;
        this.balance = balance;
        this.price = price;
    }
}

let criptocurrencies = [
    new Currency('USDT',100, 1), 
    new Currency('BTC',0, 20150), 
    new Currency('ETH',0, 1130), 
    new Currency('ADA',0, 0.46), 
    new Currency('DOT',0, 6.90)
]

listCurrencies(fromCoinList);
listCurrencies(toCoinList);


function listCurrencies (element) {
    criptocurrencies.forEach (currencies => {
        let optnElem = document.createElement('option')
        optnElem.textContent = currencies.ticker;
        element.appendChild(optnElem);
    })
}

/* 
FUNCION PARA CONVERTIR Y REDEFINIR BALANCES

Posible forma de calculo para conversiion: usar if (originCoin == 'usdt' && destinyCoin == 'btc') {swapOk(usdtVal,btcVal,swapAmount)} else if {} repetir para todas las posibilidades...


function swapOk(originVal, destinyVal, swapAmount) {
    Muy a lo bruto, tengo que hacer este calculo. Pensar como vincular los valores y los balances en funcion de lo que se ingresa al promp para no repetir tanto codigo.
    balanceDestino = balanceDestino + swapAmount * valorOrigen / valorDestino;
    balanceOrigen = balanceOrigen - swapAmount;
} 
 */

