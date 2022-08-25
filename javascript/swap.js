import * as m from './main.js';
import * as st from './staking.js';

export const fromCoinList = document.getElementById('fromCoinList');
export const toCoinList = document.getElementById('toCoinList');
const swap = document.getElementById('swap');
const fromAmountInput = document.getElementById('fromAmountInput');
const toAmountInput = document.getElementById('toAmountInput');
const swapBtn = document.querySelector('.swapBtn');
let fromSelectedCoin, toSelectedCoin, fromAmount, toAmount, fromPrice, toPrice, swapCanHappen;

function getCoin(selectedList) {
    if (selectedList == fromCoinList) {
        if (selectedList.value != 'Pick your owned coin') {
            fromSelectedCoin = selectedList.value;
            return true;
        }
    } else if (selectedList.value != 'Pick the coin you want') {
        toSelectedCoin = selectedList.value;
        return true;
    } else return;
};

function addSwapCalcEvnt() {
    fromAmountInput.removeAttribute('readonly')
    fromAmountInput.addEventListener('input', calcularSwap);
    fromCoinList.addEventListener('change', calcularSwap);
    toCoinList.addEventListener('change', calcularSwap);
};

function executeSwap(e) {
    e.preventDefault();
    if (swapCanHappen) {
        Swal.fire({
            title: `You are swapping ${fromAmount.toFixed(8)} ${fromSelectedCoin} for ${toAmount.toFixed(8)} ${toSelectedCoin}. Are you sure about it?`,
            text: "Beware that you'll have to pay a fee representing 1% of the transaction.",
            icon: 'question',
            iconColor: '#ABB8C3',
            background: '#051C2C',
            color: '#fff',
            confirmButtonColor: '#00BCE1',
            cancelButtonColor: '#E93CAC',
            confirmButtonText: 'Confirm swap',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            customClass:{confirmButton: 'swalBtnCustom', cancelButton: 'swalBtnCustom'}
        }).then((result) => {
            if (result.isConfirmed) {
                for (const currency of m.criptocurrencies) {
                    if (fromSelectedCoin == currency.ticker) {
                        if (currency.balance < fromAmount * st.plusFeeMultiplier|| fromAmount < 0) {
                            Swal.fire({
                                icon: 'error',
                                iconColor: '#E93CAC',
                                title: 'Oops...',
                                text: "You can not swap more than you have, you've introduced an invalid value or your left balance is not enough to pay the fees (1 % of the amount)",
                                background: '#051C2C',
                                color: '#fff',
                                showConfirmButton: false,
                                timerProgressBar: true,
                                timer: 3000
                            })
                            return; 
                        } else {
                            currency.balance -= fromAmount * st.plusFeeMultiplier;
                            document.getElementById("swap").reset();
                        }
                    }
                }
        
                for (const currency of m.criptocurrencies) { 
                    if (toSelectedCoin == currency.ticker) {
                        currency.balance += toAmount;
                    }
                }
        
                localStorage.setItem('criptocurrenciesLS', JSON.stringify(m.criptocurrencies));
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    iconColor: '#00BCE1',
                    title: 'The swap was successful!',
                    background: '#051C2C',
                    color: '#fff',
                    showConfirmButton: false,
                    timer: 3000
                });

                swap.removeEventListener('submit', executeSwap);
                swapBtn.classList.add('swapOff');
                fromAmountInput.setAttribute('readonly','');
                toCoinList.removeEventListener('change', () => {toInputChanges()});
                fromSelectedCoin = undefined;
                toSelectedCoin = undefined;
                fromAmount = undefined;
                toAmount = undefined;
                fromPrice = undefined;
                toPrice = undefined;
            }
        })
    } else {
        Swal.fire({
            background: '#051C2C',
            color: '#fff',
            icon: 'error',
            iconColor: '#E93CAC',
            title: 'Oops...',
            text: "Something is not right. Maybe you didn't fill all fields?",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000
        })
    }  
};

function calcularSwap() {
    let issue = false;
    getCoin(fromCoinList)? null : issue = true;
    getCoin(toCoinList)? null : issue? null: issue = true;

    if (!issue && !isNaN(parseFloat(fromAmountInput.value))) {
        
            fromAmount = parseFloat(fromAmountInput.value);
            m.criptocurrencies.forEach (currency => {
                fromSelectedCoin == currency.ticker? fromPrice = currency.price: null;
            })
            
            m.criptocurrencies.forEach (currency => {
                toSelectedCoin == currency.ticker? toPrice = currency.price: null;
            })
            toAmount = fromAmount * fromPrice / toPrice;
            toAmountInput.value = toAmount.toFixed(8);
            swapCanHappen = true;
    } else swapCanHappen = false; 
};

export function toInputChanges() {
    addSwapCalcEvnt();
    swapBtn.classList.remove('swapOff');
    swap.addEventListener('submit', executeSwap);
};