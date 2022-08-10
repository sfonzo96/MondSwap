import * as m from './main.js';

export const stakingAppDiv = document.getElementById('section__staking-app');
export const daysInAYear = 365, hoursInADay = 24, minutesInAnHour = 60, msYieldPeriod = 1000 * 5, fee = 0.01, plusFeeMultiplier = 1 + fee;
export let stakingYieldInterval;

export function renderStakingApp(stakedCriptocurrencies) {
    stakedCriptocurrencies.forEach(stakedCurrency => {
        const stakingRow = document.createElement('div');
        stakingRow.classList.add('section__staking-row');
        stakingRow.innerHTML =  `<div class="section__staking-col firstOfClass">
                                    <img src="${stakedCurrency.img}" alt="${stakedCurrency.ticker} logo">
                                    <h4>${stakedCurrency.ticker} staking</h4>
                                </div>
                                <div class="section__staking-col">
                                    <h4>Staked ${stakedCurrency.ticker}</h4>
                                    <p class="stakedAmount"></p>
                                </div>
                                <div class="section__staking-col">
                                    <h4>APY</h4>
                                    <p class="apy"></p>
                                </div>
                                <div class="section__staking-col">
                                    <h4>Stake/Unstake</h4>
                                    <div class="stakeBtnContainer">
                                        <button class="stakeBtn">Stake</button>
                                        <button class="unstakeBtn">Unstake</button>
                                    </div>
                                </div>`
        stakingAppDiv.appendChild(stakingRow);
    });
}

export function showStakedAmount() {
    const stakedAmountPList = document.querySelectorAll('.stakedAmount');
    stakedAmountPList.forEach((paragraph, index) => paragraph.innerText = m.stakedCriptocurrencies[index].balance.toFixed(4));
};

export function addStakeUnstakeEvnt() {
    const stakeBtnList = document.querySelectorAll('.stakeBtn');
    stakeBtnList.forEach((stakeBtn, index) => {
        stakeBtn.addEventListener('click', () => {
            stake(index);
        });
    });
    
    const unstakeBtnList = document.querySelectorAll('.unstakeBtn');
    unstakeBtnList.forEach((unstakeBtn, index) => {
        unstakeBtn.addEventListener('click', () => {
            unstake(index);
        });
    });
};

export function loadAPYRates() {
    const apyList = document.querySelectorAll('.apy');
    apyList.forEach((apyP, index) => apyP.innerHTML = `${m.stakedCriptocurrencies[index].APY} %`);
}

function addYieldToBalance() {
    m.stakedCriptocurrencies.forEach(stakedCurrency => {
        let interestRate = stakedCurrency.APY / daysInAYear / hoursInADay / minutesInAnHour; // Calcula tasa de interés por minuto
        stakedCurrency.balance += stakedCurrency.balance * interestRate;
        showStakedAmount();
    }) 
}

function stake(stakeBtnId) {
    m.criptocurrencies.forEach((criptocurrency, index) => {
        if (stakeBtnId == index) {
            Swal.fire({
                title: `How much ${criptocurrency.ticker} would you like to stake? Your currently balance is ${criptocurrency.balance.toFixed(8) + " " + criptocurrency.ticker}.`,
                input: 'text',
                inputAttributes: {autocapitalize: 'off', step: 'any'},
                background: '#051C2C',
                color: '#fff',
                showCancelButton: true,
                confirmButtonText: 'Stake',
                confirmButtonColor: '#00BCE1',
                cancelButtonText: "Cancel",
                cancelButtonColor: '#E93CAC',
                customClass:{ confirmButton: 'swalBtnCustom', cancelButton: 'swalBtnCustom'}
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
                            timer: 3000,
                            customClass:{ confirmButton: 'swalBtnCustom'}
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
                            confirmButtonText: 'Confirm stake',
                            customClass:{ confirmButton: 'swalBtnCustom', cancelButton: 'swalBtnCustom'}
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
                                    timer: 3000
                                })
                                return true;
                            } else {
                                return false;
                            }
                        }).then(result => {
                            if (result) {
                                clearInterval(stakingYieldInterval);
                                m.stakedCriptocurrencies[index].initialStake = addToStake + m.stakedCriptocurrencies[index].balance;
                                criptocurrency.balance -= addToStake * plusFeeMultiplier;
                                m.stakedCriptocurrencies[index].balance = m.stakedCriptocurrencies[index].initialStake;
                                m.stakedCriptocurrencies[index].msStakeDate = new Date().getTime();
                                localStorage.setItem('stakedCriptocurrenciesLS', JSON.stringify(m.stakedCriptocurrencies));
                                localStorage.setItem('criptocurrenciesLS', JSON.stringify(m.criptocurrencies));
                                stakingYieldInterval = setInterval(addYieldToBalance, msYieldPeriod);
                                showStakedAmount();
                            }
                        });
                    }
                }
            });
        }
    });   
};

function unstake(unstakeBtnId) {
    m.stakedCriptocurrencies.forEach((stakedCriptocurrency, index) => {
        if (unstakeBtnId == index) {
            let offStake = Swal.fire({
                                title: `How much ${stakedCriptocurrency.ticker} would you like to unstake? Your currently staked balance is ${stakedCriptocurrency.balance + " " + stakedCriptocurrency.ticker}.`,
                                input: 'text',
                                inputAttributes: {autocapitalize: 'off', step:"any"},
                                background: '#051C2C',
                                color: '#fff',
                                showCancelButton: true,
                                confirmButtonText: 'Unstake',
                                confirmButtonColor: '#00BCE1',
                                cancelButtonText: "Cancel",
                                cancelButtonColor: '#E93CAC',
                                customClass:{ confirmButton: 'swalBtnCustom', cancelButton: 'swalBtnCustom'}
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    offStake = parseFloat(result.value);
                                    if (offStake > stakedCriptocurrency.balance || offStake < 0 || isNaN(offStake) || offStake * fee > m.criptocurrencies[index].balance) {
                                        Swal.fire({
                                            background: '#051C2C',
                                            color: '#fff',
                                            icon: 'error',
                                            iconColor: '#E93CAC',
                                            title: 'Oops...',
                                            text: "The amount is greater than what you've staked, you've introduced an invalid value or your balance is not enough to pay the fee (1 % of the amount) ",
                                            showConfirmButton: false,
                                            timerProgressBar: true,
                                            timer: 3000
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
                                                timer: 3000
                                            })
                                            return true;
                                            } else {
                                                return false;
                                            }
                                        }).then(result => {
                                            if (result) {
                                                clearInterval(stakingYieldInterval);
                                                stakedCriptocurrency.balance -= offStake;
                                                m.criptocurrencies[index].balance += offStake * (1 - fee);
                                                m.stakedCriptocurrencies[index].initialStake = stakedCriptocurrency.balance;
                                                m.stakedCriptocurrencies[index].msStakeDate = new Date().getTime();
                                                localStorage.setItem('stakedCriptocurrenciesLS', JSON.stringify(m.stakedCriptocurrencies));
                                                localStorage.setItem('criptocurrenciesLS', JSON.stringify(m.criptocurrencies));
                                                stakingYieldInterval = setInterval(addYieldToBalance, msYieldPeriod);
                                                showStakedAmount();
                                            }
                                        })
                                    }
                                }
                            });
        }
    });
};

export function resumeStake() {
    m.stakedCriptocurrencies.forEach(stakedCurrency => {
        if (stakedCurrency.msStakeDate !== 0) {
            let n = Math.floor((new Date().getTime() - stakedCurrency.msStakeDate) / msYieldPeriod); // Redondeo hacia abajo para evitar carga de saldo al actualizar constantemente.
            let interestRate = stakedCurrency.APY / daysInAYear / hoursInADay / minutesInAnHour;
            stakedCurrency.balance = stakedCurrency.initialStake * Math.pow(1 + interestRate, n);
            stakingYieldInterval = setInterval(addYieldToBalance, msYieldPeriod);
        }  
    })
};



