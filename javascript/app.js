let fromList = document.querySelector('#fromList');
let toList = document.querySelector('#toList');


class Currency {
    constructor(ticker,balance,price) {
        this.ticker = ticker;
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



