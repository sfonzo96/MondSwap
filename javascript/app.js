let fromCoinList = document.getElementById('fromCoinList');
let toCoinList = document.getElementById('toCoinList');
let form = document.getElementById('form');
let fromAmountInput = document.getElementById('fromAmountInput');
let toAmountInput = document.getElementById('toAmountInput');
let faucetBtn = document.getElementById('faucetBtn');
let resetBtn = document.getElementById('resetBtn');
let stakeBtnList = document.querySelectorAll('.stakeBtn');
let unstakeBtnList = document.querySelectorAll('.unstakeBtn');
let stakedAmountPList = document.querySelectorAll('.stakedAmount');
let recentProfitList = document.querySelectorAll('.recentProfit');
let faucetState = localStorage.getItem('faucetOff');
let plusFeeMultiplier = 1.01, fee = 0.01;
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

let stakedCriptocurrencies = [
    new Currency('USDT', 'Tether USD', 0, 1), 
    new Currency('BTC', 'Bitcoin', 0, 20150), 
    new Currency('ETH', 'Ethereum', 0, 1130), 
    new Currency('ADA', 'Cardano', 0, 0.46), 
    new Currency('DOT', 'Polkadot', 0, 6.90)
];

function showStakedAmount() {
    stakedAmountPList.forEach((paragraph, index) => paragraph.innerText = stakedCriptocurrencies[index].balance.toFixed(2));
}; //Funciona OK

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

function stake(stakeBtnId) {
    criptocurrencies.forEach((criptocurrency, index) => {
        if (stakeBtnId == index) {
            let toStakeAmount = Swal.fire({
                                    title: `How much ${criptocurrency.ticker} would you like to stake? Your currently balance is ${criptocurrency.balance + " " + criptocurrency.ticker}.`,
                                    input: 'text',
                                    inputAttributes: {
                                        autocapitalize: 'off'
                                    },
                                    background: '#051C2C',
                                    color: '#fff',
                                    showCancelButton: true,
                                    confirmButtonText: 'Stake',
                                    confirmButtonColor: '#00BCE1',
                                    cancelButtonText: "Cancel",
                                    cancelButtonColor: '#E93CAC',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        toStakeAmount = parseFloat(result.value);
                                        if (toStakeAmount * plusFeeMultiplier > criptocurrency.balance || toStakeAmount < 0 || isNaN(toStakeAmount)) {
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
                                            let confirmStake = Swal.fire({
                                                                    background: '#051C2C',
                                                                    color: '#fff',
                                                                    title: `Are you sure? You're about to stake ${toStakeAmount + " " + criptocurrency.ticker}. You'll be charged with a fee of ${toStakeAmount * fee}.`,
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
                                                                            text: `You've just staked ${toStakeAmount + " " + criptocurrency.ticker}`,
                                                                            icon: 'success',
                                                                            iconColor: '#00BCE1',
                                                                            background: '#051C2C',
                                                                            color: '#fff',
                                                                            showConfirmButton: false,
                                                                            timerProgressBar: true,
                                                                            position: 'center',
                                                                            timer: 1500
                                                                        })
                                                                    }
                                                                });
                                            if (confirmStake) {
                                                criptocurrency.balance -= toStakeAmount * plusFeeMultiplier;
                                                stakedCriptocurrencies[index].balance += toStakeAmount;
                                                localStorage.setItem('stakedCriptocurrencies', JSON.stringify(stakedCriptocurrencies));
                                                localStorage.setItem('criptocurrencies', JSON.stringify(criptocurrencies));
                                                showStakedAmount();
                                            }
                                        }
                                    }
                                });
        }
    });   
}; //Funciona OK pasé showStakedAmount dentro del ultimo condicional porque si no funcionaba instantaneamente al clickear (cuestion de asinconia?)

function unstake(unstakeBtnId) {
    stakedCriptocurrencies.forEach((criptocurrency, index) => {
        if (unstakeBtnId == index) {
            let offStakeAmount = Swal.fire({
                                    title: `How much ${criptocurrency.ticker} would you like to unstake? Your currently staked balance is ${criptocurrency.balance + " " + criptocurrency.ticker}.`,
                                    input: 'text',
                                    inputAttributes: {
                                    autocapitalize: 'off'
                                    },
                                    background: '#051C2C',
                                    color: '#fff',
                                    showCancelButton: true,
                                    confirmButtonText: 'Unstake',
                                    confirmButtonColor: '#00BCE1',
                                    cancelButtonText: "Cancel",
                                    cancelButtonColor: '#E93CAC',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        offStakeAmount = parseFloat(result.value);
                                        if (offStakeAmount > criptocurrency.balance || offStakeAmount < 0 || isNaN(offStakeAmount) || offStakeAmount * fee > criptocurrencies[index].balance) {
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
                                            let confirmUnstake = Swal.fire({
                                                                    title: `Are you sure? You're about to unstake ${offStakeAmount + " " + criptocurrency.ticker}. You'll be charged with a fee of ${offStakeAmount * fee}.`,
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
                                                                        text: `You've just unstaked ${offStakeAmount + " " + criptocurrency.ticker}`,
                                                                        icon: 'success',
                                                                        iconColor: '#00BCE1',
                                                                        background: '#051C2C',
                                                                        color: '#fff',
                                                                        position: 'center',
                                                                        showConfirmButton: false,
                                                                        timerProgressBar: true,
                                                                        timer: 1500
                                                                    })
                                                                    }
                                                                });
                                            if (confirmUnstake) {
                                                criptocurrency.balance -= offStakeAmount;
                                                criptocurrencies[index].balance += offStakeAmount * (1 - fee);
                                                localStorage.setItem('stakedCriptocurrencies', JSON.stringify(stakedCriptocurrencies));
                                                localStorage.setItem('criptocurrencies', JSON.stringify(criptocurrencies));
                                                showStakedAmount();
                                            }
                                        }
                                    }
                                });
        }
    });
}; //Funciona OK pasé showStakedAmount dentro del ultimo condicional porque si no funcionaba instantaneamente al clickear (cuestion de asinconia?)

function faucetAdd() {
    criptocurrencies[0].balance += 100;
    faucetBtn.classList.add('faucetOff');
    localStorage.setItem('faucetOff', true);
    faucetBtn.removeEventListener('click', faucetAdd);
    localStorage.setItem('criptocurrencies', JSON.stringify(criptocurrencies));
    const faucetTimeout = setTimeout(() => {faucetBtn.classList.remove("faucetOff"); faucetBtn.addEventListener('click', faucetAdd); localStorage.setItem('faucetOff', false)}, 12 * 3600 * 1000 );
    Swal.fire({
        icon: 'success',
        iconColor: '#00BCE1',
        title:`You got 100 USDT added to your balance. You'll be able to get another 100 USDT every 12 hours.`,
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
    selectedList == fromCoinList? fromSelected = selectedList.value : selectedList == toCoinList? toSelected = selectedList.value : null;
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
        title: `You are swapping ${fromAmount} ${fromSelected} for ${toAmount} ${toSelected}. Are you sure about it?`,
        text: "In case you want to revert this you'll have to pay another fee.",
        icon: 'question',
        iconColor: '#ABB8C3',
        background: '#051C2C',
        color: '#fff',
        confirmButtonColor: '#00BCE1',
        cancelButtonColor: '#E93CAC',
        confirmButtonText: 'Confirm swap'
    }).then((result) => {
        if (result.isConfirmed) {
            for (const currency of criptocurrencies) {
                if (fromSelected == currency.ticker) {
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
                if (toSelected == currency.ticker) {
                    currency.balance += toAmount;
                }
            }
    
            localStorage.setItem('criptocurrencies', JSON.stringify(criptocurrencies));
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
    fromAmount = fromAmountInput.value;
    criptocurrencies.forEach (currency => {
        fromSelected == currency.ticker? fromPrice = currency.price: null;
    })
    
    criptocurrencies.forEach (currency => {
        toSelected == currency.ticker? toPrice = currency.price: null;
    })
    toAmount = fromAmount * fromPrice / toPrice;
    toAmountInput.value = toAmount;
}; //Funcion OK

function onLoadGetStoragedBalances() {
    if (!JSON.parse(localStorage.getItem('criptocurrencies')) && !JSON.parse(localStorage.getItem('stakedCriptocurrencies'))) {
        return
    } else if (JSON.parse(localStorage.getItem('criptocurrencies')) && !JSON.parse(localStorage.getItem('stakedCriptocurrencies'))) {
        criptocurrencies = JSON.parse(localStorage.getItem('criptocurrencies'));
    } else {
        criptocurrencies = JSON.parse(localStorage.getItem('criptocurrencies'));
        stakedCriptocurrencies = JSON.parse(localStorage.getItem('stakedCriptocurrencies'));
    }
}; //Funciona OK

document.addEventListener('DOMContentLoaded', ()=> {
    faucetState ? faucetBtn.classList.add('faucetOff') : null;
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
}); //Funciona OK

// Pendientes:
// Luego del swap, quedan almacenadas las monedas seleccionadas y habilitado el input. Arreglar.
// Verificar tambien si cada vez que se ejecuta addSwapCalcEvent() (ante el cambio en toCoinList) se agrega evento que ejecuta calcularSwap.
// En este caso se sumarian muchos eventos similares, no afectan funcionamiento pero quizas si recursos.
// Ademas deshabilitar boton (listo) y mostrar temporizador en descuento en lugar del "Start now!". Get new date cuando se clickea faucet, al cargar DOM verificar si pasaron 12 hs, si no bloquear hasta que almacenada - new date = 12h.
// Validar getCoin para que no tome como valor solo el de los options (childs). 
// Sistema de staking funcionando (solo resta y suma balances, muestra balance stakeado). Luego, en funcion del tiempo transcurrido ir sumando en de acuerdo a un apy ficticio (setInterval).
// Orden de codigo?
