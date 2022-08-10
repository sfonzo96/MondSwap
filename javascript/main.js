import * as f from './faucet.js';
import * as sw from './swap.js';
import * as st from './staking.js';

export const pricesArr = [];

export class Currency {
    constructor(ticker,name,balance,price,APY,initialStake,msStakeDate,img) {
        this.ticker = ticker;
        this.name = name;
        this.balance = balance;
        this.price = price;
        this.APY = APY;
        this.initialStake = initialStake;
        this.msStakeDate = msStakeDate;
        this.img = img;
    }
};

export let criptocurrencies = [
    new Currency('USDT', 'Tether USD', 0, undefined), 
    new Currency('WBTC', 'Wrapped Bitcoin', 0, undefined), 
    new Currency('WETH', 'Wrapped Ethereum', 0, undefined), 
    new Currency('GLMR', 'Glimmer', 0, undefined), 
    new Currency('DOT', 'Polkadot', 0, undefined)
];

export let stakedCriptocurrencies = [
    new Currency('USDT', 'Tether USD', 0, undefined, 7.1, 0, 0, "./assets/cryptoisologues/USDT-logo.svg"), 
    new Currency('WBTC', 'Wrapped Bitcoin', 0, undefined, 3.3, 0, 0, "./assets/cryptoisologues/WBTC-logo.svg"), 
    new Currency('WETH', 'Wrapped Ethereum', 0, undefined, 5.8, 0, 0, "./assets/cryptoisologues/WETH-logo.svg"), 
    new Currency('GLMR', 'Glimmer', 0, undefined, 4.9, 0, 0, "./assets/cryptoisologues/GLMR-logo.svg"), 
    new Currency('DOT', 'Polkadot', 0, undefined, 10.2, 0, 0, "./assets/cryptoisologues/DOT-logo.svg")
];

function getPrices() {
    const url = 'https://min-api.cryptocompare.com/data/price?fsym=USDT&tsyms=USDT,WBTC,WETH,GLMR,DOT';
    fetch(url)
    .then(response => response.json())
    .then(pricesObj => Object.values(pricesObj))
    .then(pricesArr => logPrices(pricesArr));
};

function logPrices(pricesArr) {
    criptocurrencies.forEach((currency, index) => currency.price = Number((pricesArr[index]**(-1)).toFixed(8)));
    localStorage.setItem('criptocurrenciesLS', JSON.stringify(criptocurrencies));
    stakedCriptocurrencies.forEach((currency, index) => currency.price = Number((pricesArr[index]**(-1)).toFixed(8)));
    localStorage.setItem('stakedCriptocurrenciesLS', JSON.stringify(stakedCriptocurrencies));
};

function listCurrencies (element) {
    criptocurrencies.forEach (currency => {
        let optnElem = document.createElement('option')
        optnElem.value = currency.ticker;
        optnElem.textContent = currency.name;
        optnElem.setAttribute('price', currency.price);
        element.appendChild(optnElem);
    })
};

function getStoragedBalances() {
    if (!JSON.parse(localStorage.getItem('criptocurrenciesLS')) && !JSON.parse(localStorage.getItem('stakedCriptocurrenciesLS'))) {
        return
    } else if (JSON.parse(localStorage.getItem('criptocurrenciesLS')) && !JSON.parse(localStorage.getItem('stakedCriptocurrenciesLS'))) {
        criptocurrencies = JSON.parse(localStorage.getItem('criptocurrenciesLS'));
    } else {
        criptocurrencies = JSON.parse(localStorage.getItem('criptocurrenciesLS'));
        stakedCriptocurrencies = JSON.parse(localStorage.getItem('stakedCriptocurrenciesLS'));
        st.resumeStake();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    f.faucetState ? f.faucetBtn.classList.add('faucetOff') : null;
    st.renderStakingApp(stakedCriptocurrencies);
    setInterval(() => getPrices(),1000 * 10);
    getStoragedBalances();
    listCurrencies(sw.fromCoinList);
    listCurrencies(sw.toCoinList);
    st.loadAPYRates();
    st.showStakedAmount();
    st.addStakeUnstakeEvnt();
    sw.fromCoinList.addEventListener('change', sw.toCoinList.addEventListener('change', () => {sw.toInputChanges()})); // Funciona OK
    f.faucetBtn.addEventListener('click', f.faucetAdd);
    f.resetBtn.addEventListener('click', f.resetFaucet);
});

