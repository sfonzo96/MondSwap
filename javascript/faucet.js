import * as m from './main.js';
import * as st from './staking.js';

export const faucetBtn = document.getElementById('faucetBtn');
export const resetBtn = document.getElementById('resetBtn');
export const faucetState = localStorage.getItem('faucetOff');
const faucetGives = 500;

export function faucetAdd() {
    m.criptocurrencies[0].balance += faucetGives;
    faucetBtn.classList.add('faucetOff');
    localStorage.setItem('faucetOff', true);
    faucetBtn.removeEventListener('click', faucetAdd);
    localStorage.setItem('criptocurrenciesLS', JSON.stringify(m.criptocurrencies));
    const faucetTimeout = setTimeout(() => {faucetBtn.classList.remove("faucetOff"); faucetBtn.addEventListener('click', faucetAdd); localStorage.setItem('faucetOff', false)}, 12 * 3600 * 1000 );
    Swal.fire({
        icon: 'success',
        iconColor: '#00BCE1',
        title:`You got ${faucetGives} USDT added to your balance. You'll be able to get another ${faucetGives} USDT every 12 hours.`,
        background: '#051C2C',
        color: '#fff',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000
    });
};

export function resetFaucet() {
    localStorage.clear();
    faucetBtn.classList.remove('faucetOff');
    faucetBtn.addEventListener('click', faucetAdd);
    clearTimeout(1);
    m.criptocurrencies.forEach (currency => {
        currency.balance = 0;
    })
    m.stakedCriptocurrencies.forEach (currency => {
        currency.balance = 0;
        currency.initialStake = 0;
        currency.msStakeDate = 0;
    })
    st.showStakedAmount();
};