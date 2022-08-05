const fromCoinList = document.getElementById('fromCoinList');
const toCoinList = document.getElementById('toCoinList');
const form = document.getElementById('form');
const fromAmountInput = document.getElementById('fromAmountInput');
const toAmountInput = document.getElementById('toAmountInput');
const faucetBtn = document.getElementById('faucetBtn');
const resetBtn = document.getElementById('resetBtn');
const stakeBtnList = document.querySelectorAll('.stakeBtn');
const unstakeBtnList = document.querySelectorAll('.unstakeBtn');
const stakedAmountPList = document.querySelectorAll('.stakedAmount');
const apyList = document.querySelectorAll('.apy');
const faucetState = localStorage.getItem('faucetOff');
const pricesArr = [];
let faucetGives = 500;
let fromSelectedCoin, toSelectedCoin, fromAmount, toAmount, fromPrice, toPrice;
let stakingYieldInterval, msYieldPeriod = 1000 * 5, fee = 0.01;
let plusFeeMultiplier = 1 + fee;
let daysInAYear = 365, hoursInADay = 24, minutesInAnHour = 60;

class Currency {
    constructor(ticker,name,balance,price,APY,initialStake,msStakeDate) {
        this.ticker = ticker;
        this.name = name;
        this.balance = balance;
        this.price = price;
        this.APY = APY;
        this.initialStake = initialStake;
        this.msStakeDate = msStakeDate;
    }
} //Funciona OK

let criptocurrencies = [
    new Currency('USDT', 'Tether USD', 0, undefined), 
    new Currency('WBTC', 'Wrapped Bitcoin', 0, undefined), 
    new Currency('WETH', 'Wrapped Ethereum', 0, undefined), 
    new Currency('GLMR', 'Glimmer', 0, undefined), 
    new Currency('DOT', 'Polkadot', 0, undefined)
] //Funciona OK

let stakedCriptocurrencies = [
    new Currency('USDT', 'Tether USD', 0, undefined, 7.1, 0, 0), 
    new Currency('WBTC', 'Wrapped Bitcoin', 0, undefined, 3.3, 0, 0), 
    new Currency('WETH', 'Wrapped Ethereum', 0, undefined, 5.8, 0, 0), 
    new Currency('GLMR', 'Glimmer', 0, undefined, 4.9, 0, 0), 
    new Currency('DOT', 'Polkadot', 0, undefined, 10.2, 0, 0)
];

function getPrices() {
    const url = 'https://min-api.cryptocompare.com/data/price?fsym=USDT&tsyms=USDT,WBTC,WETH,GLMR,DOT';
    fetch(url)
    .then(response => response.json())
    .then(pricesObj => Object.values(pricesObj))
    .then(pricesArr => logPrices(pricesArr));
}

function logPrices(pricesArr) {
    criptocurrencies.forEach((currency, index) =>
    currency.price = (pricesArr[index]**(-1)).toFixed(8)
    );
    stakedCriptocurrencies.forEach((currency, index) =>
    currency.price = (pricesArr[index]**(-1)).toFixed(8)
    );
};

function showStakedAmount() {
    stakedAmountPList.forEach((paragraph, index) => paragraph.innerText = stakedCriptocurrencies[index].balance.toFixed(4));
}; //Funciona OK

function loadAPYRates() {
    apyList.forEach((apyP, index) => apyP.innerHTML = `${stakedCriptocurrencies[index].APY} %`);
} //Funciona OK

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
};//Funciona OK

function addYieldToBalance() {
    stakedCriptocurrencies.forEach(stakedCurrency => {
        let interestRate = stakedCurrency.APY / daysInAYear / hoursInADay / minutesInAnHour; // Calcula tasa de interés por minuto
        stakedCurrency.balance += stakedCurrency.balance * interestRate;
        showStakedAmount();
    }) 
} //Funciona OK

function stake(stakeBtnId) {
    criptocurrencies.forEach((criptocurrency, index) => {
        if (stakeBtnId == index) {
            Swal.fire({
                title: `How much ${criptocurrency.ticker} would you like to stake? Your currently balance is ${criptocurrency.balance.toFixed(8) + " " + criptocurrency.ticker}.`,
                input: 'text',
                inputAttributes: {autocapitalize: 'off'},
                background: '#051C2C',
                color: '#fff',
                showCancelButton: true,
                confirmButtonText: 'Stake',
                confirmButtonColor: '#00BCE1',
                cancelButtonText: "Cancel",
                cancelButtonColor: '#E93CAC',
            }).then((result) => {
                if (result.isConfirmed) {
                    let addToStake = parseFloat(result.value);
                    if (addToStake * plusFeeMultiplier > criptocurrency.balance || addToStake < 0 || isNaN(addToStake)) {
                        Swal.fire({
                            background: '#051C2C',
                            color: '#fff',
                            icon: 'error',
                            iconColor: '#E93CAC',
                            title: 'Oops...',
                            text: "You can not stake an amount greater than your balance, you've introduced an invalid value or your balance is not enough to pay the fee (1 % of the amount)",
                            showConfirmButton: false,
                            timerProgressBar: true,
                            timer: 1500
                            })
                        return
                    } else {
                        Swal.fire({
                            background: '#051C2C',
                            color: '#fff',
                            title: `Are you sure? You're about to stake ${addToStake + " " + criptocurrency.ticker}. You'll be charged with a fee of ${addToStake * fee + " " + criptocurrency.ticker}.`,
                            text: "In case you want to revert this you'll have to pay a fee.",
                            icon: 'question',
                            iconColor: '#ABB8C3',
                            showCancelButton: true,
                            confirmButtonColor: '#00BCE1',
                            cancelButtonColor: '#E93CAC',
                            confirmButtonText: 'Confirm stake'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Swal.fire({
                                    title: 'Done!',
                                    text: `You've just staked ${addToStake + " " + criptocurrency.ticker}`,
                                    icon: 'success',
                                    iconColor: '#00BCE1',
                                    background: '#051C2C',
                                    color: '#fff',
                                    showConfirmButton: false,
                                    timerProgressBar: true,
                                    position: 'center',
                                    timer: 1500
                                })
                                return true;
                            } else {
                                return false;
                            }
                        }).then(result => {
                            if (result) {
                                clearInterval(stakingYieldInterval);
                                stakedCriptocurrencies[index].initialStake = addToStake + stakedCriptocurrencies[index].balance;
                                criptocurrency.balance -= addToStake * plusFeeMultiplier;
                                stakedCriptocurrencies[index].balance = stakedCriptocurrencies[index].initialStake;
                                stakedCriptocurrencies[index].msStakeDate = new Date().getTime();
                                localStorage.setItem('stakedCriptocurrenciesLS', JSON.stringify(stakedCriptocurrencies));
                                localStorage.setItem('criptocurrenciesLS', JSON.stringify(criptocurrencies));
                                stakingYieldInterval = setInterval(addYieldToBalance, msYieldPeriod);
                                showStakedAmount();
                            }
                        });
                    }
                }
            });
        }
    });   
}; //Funciona OK

function unstake(unstakeBtnId) {
    stakedCriptocurrencies.forEach((stakedCriptocurrency, index) => {
        if (unstakeBtnId == index) {
            let offStake = Swal.fire({
                                title: `How much ${stakedCriptocurrency.ticker} would you like to unstake? Your currently staked balance is ${stakedCriptocurrency.balance + " " + stakedCriptocurrency.ticker}.`,
                                input: 'text',
                                inputAttributes: {autocapitalize: 'off'},
                                background: '#051C2C',
                                color: '#fff',
                                showCancelButton: true,
                                confirmButtonText: 'Unstake',
                                confirmButtonColor: '#00BCE1',
                                cancelButtonText: "Cancel",
                                cancelButtonColor: '#E93CAC',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    offStake = parseFloat(result.value);
                                    if (offStake > stakedCriptocurrency.balance || offStake < 0 || isNaN(offStake) || offStake * fee > criptocurrencies[index].balance) {
                                        Swal.fire({
                                            background: '#051C2C',
                                            color: '#fff',
                                            icon: 'error',
                                            iconColor: '#E93CAC',
                                            title: 'Oops...',
                                            text: "The amount is greater than what you've staked, you've introduced an invalid value or your balance is not enough to pay the fee (1 % of the amount) ",
                                            showConfirmButton: false,
                                            timerProgressBar: true,
                                            timer: 1500
                                        })
                                        return
                                    } else {
                                        Swal.fire({
                                            title: `Are you sure? You're about to unstake ${offStake + " " + stakedCriptocurrency.ticker}. You'll be charged with a fee of ${offStake * fee}.`,
                                            text: "In case you want to revert this you'll have to pay a fee.",
                                            icon: 'question',
                                            iconColor: '#ABB8C3',
                                            background: '#051C2C',
                                            color: '#fff',
                                            showCancelButton: true,
                                            confirmButtonColor: '#00BCE1',
                                            cancelButtonColor: '#E93CAC',
                                            confirmButtonText: 'Confirm unstake'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                            Swal.fire({
                                                title: 'Done!',
                                                text: `You've just unstaked ${offStake + " " + stakedCriptocurrency.ticker}`,
                                                icon: 'success',
                                                iconColor: '#00BCE1',
                                                background: '#051C2C',
                                                color: '#fff',
                                                position: 'center',
                                                showConfirmButton: false,
                                                timerProgressBar: true,
                                                timer: 1500
                                            })
                                            return true;
                                            } else {
                                                return false;
                                            }
                                        }).then(result => {
                                            if (result) {
                                                clearInterval(stakingYieldInterval);
                                                stakedCriptocurrency.balance -= offStake;
                                                criptocurrencies[index].balance += offStake * (1 - fee);
                                                stakedCriptocurrencies[index].initialStake = stakedCriptocurrency.balance;
                                                stakedCriptocurrencies[index].msStakeDate = new Date().getTime();
                                                localStorage.setItem('stakedCriptocurrenciesLS', JSON.stringify(stakedCriptocurrencies));
                                                localStorage.setItem('criptocurrenciesLS', JSON.stringify(criptocurrencies));
                                                stakingYieldInterval = setInterval(addYieldToBalance(index), msYieldPeriod);
                                                showStakedAmount();
                                            }
                                        })
                                    }
                                }
                            });
        }
    });
}; //Funciona OK

function faucetAdd() {
    criptocurrencies[0].balance += faucetGives;
    faucetBtn.classList.add('faucetOff');
    localStorage.setItem('faucetOff', true);
    faucetBtn.removeEventListener('click', faucetAdd);
    localStorage.setItem('criptocurrenciesLS', JSON.stringify(criptocurrencies));
    const faucetTimeout = setTimeout(() => {faucetBtn.classList.remove("faucetOff"); faucetBtn.addEventListener('click', faucetAdd); localStorage.setItem('faucetOff', false)}, 12 * 3600 * 1000 );
    Swal.fire({
        icon: 'success',
        iconColor: '#00BCE1',
        title:`You got ${faucetGives} USDT added to your balance. You'll be able to get another ${faucetGives} USDT every 12 hours.`,
        background: '#051C2C',
        color: '#fff',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500
    });
}; //Funciona OK

function resetFaucet() {
    localStorage.clear();
    faucetBtn.classList.remove('faucetOff');
    faucetBtn.addEventListener('click', faucetAdd);
    clearTimeout(1);
    criptocurrencies.forEach (currency => {
        currency.balance = 0;
    })
    stakedCriptocurrencies.forEach (currency => {
        currency.balance = 0;
        currency.initialStake = 0;
        currency.msStakeDate = 0;
    })
    showStakedAmount();
}; //Funciona OK

function listCurrencies (element) {
    criptocurrencies.forEach (currency => {
        let optnElem = document.createElement('option')
        optnElem.value = currency.ticker;
        optnElem.textContent = currency.name;
        optnElem.setAttribute('price', currency.price);
        element.appendChild(optnElem);
    })
}; //Funciona OK

function getCoin(selectedList) {
    selectedList == fromCoinList? fromSelectedCoin = selectedList.value : selectedList == toCoinList? toSelectedCoin = selectedList.value : null;
}; //Funciona OK // Validar para que no tome como valor el default del elemento select sino el de los options (childs).

function addSwapCalcEvnt() {
    fromAmountInput.removeAttribute('readonly')
    fromAmountInput.addEventListener('input', calcularSwap);
    fromCoinList.addEventListener('change', calcularSwap);
    toCoinList.addEventListener('change', calcularSwap);
}; //Funciona OK

function executeSwap(e) {
    e.preventDefault();
    
    Swal.fire({
        title: `You are swapping ${fromAmount.toFixed(8)} ${fromSelectedCoin} for ${toAmount.toFixed(8)} ${toSelectedCoin}. Are you sure about it?`,
        text: "In case you want to revert this you'll have to pay another fee.",
        icon: 'question',
        iconColor: '#ABB8C3',
        background: '#051C2C',
        color: '#fff',
        confirmButtonColor: '#00BCE1',
        cancelButtonColor: '#E93CAC',
        confirmButtonText: 'Confirm swap',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            for (const currency of criptocurrencies) {
                if (fromSelectedCoin == currency.ticker) {
                    if (currency.balance < fromAmount * plusFeeMultiplier|| fromAmount < 0) {
                        Swal.fire({
                            icon: 'error',
                            iconColor: '#E93CAC',
                            title: 'Oops...',
                            text: "You can not swap more than you have, you've introduced an invalid value or your left balance is not enough to pay the fees (1 % of the amount)",
                            background: '#051C2C',
                            color: '#fff',
                            showConfirmButton: false,
                            timerProgressBar: true,
                            timer: 1500
                        })
                          document.getElementById("form").reset();
                        return; 
                    } else {
                        currency.balance -= fromAmount * plusFeeMultiplier;
                    }
                }
            }
    
            for (const currency of criptocurrencies) { 
                if (toSelectedCoin == currency.ticker) {
                    currency.balance += toAmount;
                }
            }
    
            localStorage.setItem('criptocurrenciesLS', JSON.stringify(criptocurrencies));
            Swal.fire({
                position: 'center',
                icon: 'success',
                iconColor: '#00BCE1',
                title: 'The swap was successful!',
                background: '#051C2C',
                color: '#fff',
                showConfirmButton: false,
                timer: 1500
            });
        }
    })
    document.getElementById("form").reset();
}; //Funciona OK

function calcularSwap() {
    fromAmount = parseFloat(fromAmountInput.value);
    criptocurrencies.forEach (currency => {
        fromSelectedCoin == currency.ticker? fromPrice = currency.price: null;
    })
    
    criptocurrencies.forEach (currency => {
        toSelectedCoin == currency.ticker? toPrice = currency.price: null;
    })
    toAmount = fromAmount * fromPrice / toPrice;
    toAmountInput.value = toAmount.toFixed(8);
}; //Funciona OK

function restartStake() {
    stakedCriptocurrencies.forEach(stakedCurrency => {
        if (stakedCurrency.msStakeDate !== 0) {
            let n = Math.floor((new Date().getTime() - stakedCurrency.msStakeDate) / msYieldPeriod); // Redondeo hacia abajo para evitar carga de saldo al actualizar constantemente.
            let interestRate = stakedCurrency.APY / daysInAYear / hoursInADay / minutesInAnHour;
            stakedCurrency.balance = stakedCurrency.initialStake * Math.pow(1 + interestRate, n);
            stakingYieldInterval = setInterval(addYieldToBalance, msYieldPeriod);
        }  
    })
} // Funciona OK

function getStoragedBalances() {
    if (!JSON.parse(localStorage.getItem('criptocurrenciesLS')) && !JSON.parse(localStorage.getItem('stakedCriptocurrenciesLS'))) {
        return
    } else if (JSON.parse(localStorage.getItem('criptocurrenciesLS')) && !JSON.parse(localStorage.getItem('stakedCriptocurrenciesLS'))) {
        criptocurrencies = JSON.parse(localStorage.getItem('criptocurrenciesLS'));
    } else {
        criptocurrencies = JSON.parse(localStorage.getItem('criptocurrenciesLS'));
        stakedCriptocurrencies = JSON.parse(localStorage.getItem('stakedCriptocurrenciesLS'));
        restartStake();
    }
}; // Funciona OK

document.addEventListener('DOMContentLoaded', () => {
    faucetState ? faucetBtn.classList.add('faucetOff') : null;
    setInterval(() => getPrices(),1000 * 10);
    getStoragedBalances();
    listCurrencies(fromCoinList);
    listCurrencies(toCoinList);
    loadAPYRates();
    showStakedAmount();
    addStakeUnstakeEvnt();
    form.addEventListener('submit', executeSwap); // Funciona OK
    fromCoinList.addEventListener('change', () => {getCoin(fromCoinList)}); // Funciona OK
    toCoinList.addEventListener('change', () => {getCoin(toCoinList); addSwapCalcEvnt()}); // Funciona OK
    faucetBtn.addEventListener('click', faucetAdd); // Funciona OK
    resetBtn.addEventListener('click', resetFaucet) // Funciona OK
}); //Funciona OK

// Pendientes:
// Luego del swap, quedan almacenadas las monedas seleccionadas y habilitado el input. Arreglar (posibilidad de hacerlo com Promise).
// Ademas de deshabilitar boton (listo), mostrar temporizador en descuento en lugar del "Start now!".
// Validar getCoin para que no tome como valor solo el de los options (childs). 
// Orden de codigo: implementar type modules.
