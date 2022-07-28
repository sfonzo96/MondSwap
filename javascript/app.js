let fromCoinList = document.getElementById('fromCoinList');
let toCoinList = document.getElementById('toCoinList');
let form = document.getElementById('form');
let fromAmountInput = document.getElementById('fromAmountInput');
let toAmountInput = document.getElementById('toAmountInput');
let faucetBtn = document.getElementById('faucetBtn');
let resetBtn = document.getElementById('resetBtn');
let fromSelected, toSelected, fromAmount, toAmount, fromPrice, toPrice;
let stakeBtnList = document.querySelectorAll('.stakeBtn');
let unstakeBtnList = document.querySelectorAll('.unstakeBtn');
let stakedAmountPList = document.querySelectorAll('.stakedAmount');
let recentProfitList = document.querySelectorAll('.recentProfit');

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

let stakedCriptocurrencies = [
    new Currency('USDT', 'Tether USD', 0, 1,'./assets/cryptoisologues/tether-usdt-logo.svg'), 
    new Currency('BTC', 'Bitcoin', 0, 20150, './assets/cryptoisologues/bitcoin-btc-logo.svg'), 
    new Currency('ETH', 'Ethereum', 0, 1130, './assets/cryptoisologues/ethereum-eth-logo.svg'), 
    new Currency('ADA', 'Cardano', 0, 0.46, './assets/cryptoisologues/cardano-ada-logo.svg'), 
    new Currency('DOT', 'Polkadot', 0, 6.90, './assets/cryptoisologues/polkadot-new-dot-logo.svg')
];

function addStakeUnstakeEvnt() {
    stakeBtnList.forEach((stakeBtn, index) => {
        stakeBtn.addEventListener('click', () => {
            stake(index);
        });
    });
    
    unstakeBtnList.forEach((unstakeBtn, index) => {
        unstakeBtn.addEventListener('click', () => {
            unstake(index);
        });
    });
};

function stake(stakeBtnId) {
    criptocurrencies.forEach((criptocurrency, index) => {
        if (stakeBtnId == index) {
            let toStakeAmount = parseFloat(prompt(`How much ${criptocurrency.ticker} would you like to stake? Your currently balance is ${criptocurrency.balance + " " + criptocurrency.ticker}.`));
            /* isNaN(toStakeAmount)? console.log('is nan') : console.log('esta todo ok'); */
            if (toStakeAmount > criptocurrency.balance || toStakeAmount < 0 || isNaN(toStakeAmount)) {
                alert("You can not stake more than you have! Or you've introduced a negative value");
                return
            } else {
                let confirmStake = confirm(`Are you sure? You're about to stake ${toStakeAmount + " " + criptocurrency.ticker}. You'll be charged with a fee of ${toStakeAmount * 0.005}.`)
                if (confirmStake) {
                    criptocurrency.balance -= toStakeAmount * (1 + 0.005);
                    stakedCriptocurrencies[index].balance += toStakeAmount;
                    localStorage.setItem('stakedCriptocurrencies', JSON.stringify(stakedCriptocurrencies));
                    localStorage.setItem('criptocurrencies', JSON.stringify(criptocurrencies));
                }
            }
        }
    });
    showStakedAmount();
};

function unstake(unstakeBtnId) {
    stakedCriptocurrencies.forEach((criptocurrency, index) => {
        if (unstakeBtnId == index) {
            let offStakeAmount = parseFloat(prompt(`How much ${criptocurrency.ticker} would you like to unstake? Your currently staked balance is ${criptocurrency.balance + " " + criptocurrency.ticker}.`));
            console.log(offStakeAmount)
            if (offStakeAmount > criptocurrency.balance || offStakeAmount < 0 || isNaN(offStakeAmount)) {
                alert("You can not unstake more than you have staked! Or you've introduced a negative value");
                return
            } else {
                let confirmUnstake = confirm(`Are you sure? You're about to unstake ${offStakeAmount + " " + criptocurrency.ticker}. You'll be charged with a fee of ${offStakeAmount * 0.005}.`)
                if (confirmUnstake) {
                    criptocurrency.balance -= offStakeAmount;
                    criptocurrencies[index].balance += offStakeAmount * (1 - 0.005);
                    localStorage.setItem('stakedCriptocurrencies', JSON.stringify(stakedCriptocurrencies));
                    localStorage.setItem('criptocurrencies', JSON.stringify(criptocurrencies));
                }
            }
        }
    });
    showStakedAmount();
}

function showStakedAmount() {
    stakedAmountPList.forEach((paragraph, index) => {
            paragraph.innerText = stakedCriptocurrencies[index].balance;
        }
    );
}

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
    faucetBtn.addEventListener('click', faucetAdd);
    clearTimeout(1);
    criptocurrencies.forEach (currency => {
        currency.balance = 0;
    })
    showStakedAmount(); 
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
    fromCoinList.addEventListener('change', calcularSwap);
    toCoinList.addEventListener('change', calcularSwap);
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
    if (!JSON.parse(localStorage.getItem('criptocurrencies')) && !JSON.parse(localStorage.getItem('stakedCriptocurrencies'))) {
        return
    } else if (JSON.parse(localStorage.getItem('criptocurrencies')) && !JSON.parse(localStorage.getItem('stakedCriptocurrencies'))) {
        criptocurrencies = JSON.parse(localStorage.getItem('criptocurrencies'));
    } else {
        criptocurrencies = JSON.parse(localStorage.getItem('criptocurrencies'));
        stakedCriptocurrencies = JSON.parse(localStorage.getItem('stakedCriptocurrencies'));
    }
} //Funciona OK

document.addEventListener('DOMContentLoaded', ()=> {
    onLoadGetStoragedBalances();
    listCurrencies(fromCoinList);
    listCurrencies(toCoinList);
    addStakeUnstakeEvnt();
    showStakedAmount();
    form.addEventListener('submit', executeSwap); //Funciona OK
    fromCoinList.addEventListener('change', () => {getCoin(fromCoinList)}); //Funciona OK
    toCoinList.addEventListener('change', () => {getCoin(toCoinList); addSwapCalcEvnt()}); //Funciona OK
    faucetBtn.addEventListener('click', faucetAdd);
    resetBtn.addEventListener('click', resetFaucet)
});

// Pendientes:
// Modal dando aviso de 12hs de espera y de +100 usdt (por ahora hecho con alert).
// Ademas deshabilitar boton (listo) y mostrar temporizador en descuento en lugar del "Start now!". Get new date cuando se clickea faucet, al cargar DOM verificar si pasaron 12 hs, si no bloquear hasta que almacenada - new date = 12h.
// Sistema de staking funcionando (solo resta y suma balances, muestra balance stakeado). Luego, en funcion del tiempo transcurrido ir sumando en de acuerdo a un apy ficticio (setInterval).
// Orden de codigo?
