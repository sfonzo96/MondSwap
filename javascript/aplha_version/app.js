let usdtBalance = 100, btcBalance = 0, ethBalance = 0, adaBalance = 0, dotBalance = 0, originCoin, destinyCoin, swapAmount;

const usdtVal = 1, btcVal = 20000, ethVal = 1050, adaVal = 0.45, dotVal = 6.82;

alert('¡Bienvenido! Se te han asignado 100 USDT de prueba.');

if (confirm('¿Deseas realizar algun intercambio entre monedas?')) {
    do {
        originCoin = prompt(`Este es tu balance: \n USDT: ${usdtBalance} \n BTC: ${btcBalance} \n ETH: ${ethBalance} \n ADA: ${adaBalance} \n DOT: ${dotBalance} \nPor favor, ingresá el ticker de la moneda que quisieras intercambiar.`).toLowerCase();
    } while(!validarTickerYSwap(originCoin));
    console.log('Hasta aca parece viajar');
    
    do {
        destinyCoin = prompt('Por favor, ingresá el ticker de la moneda que quisieras obtener. Solo están disponibles: USDT, BTC, ETH, ADA y DOT.').toLocaleLowerCase();
    } while(!validarTickerDestino(destinyCoin));
    console.log('Hasta aca tambien');
    alert('Intercambio exitoso!');
}

// FUNCIONES

function validarSaldoPositivo(balance) {
    while (balance <= 0){
        alert('No podes seleccionar una moneda sin saldo. Por favor, selecciona otra.');
        originCoin = prompt(`Este es tu balance: \n USDT: ${usdtBalance} \n BTC: ${btcBalance} \n ETH: ${ethBalance} \n ADA: ${adaBalance} \n DOT: ${dotBalance} \nPor favor, ingresá el ticker de la moneda que quisieras intercambiar.`).toLowerCase();
        if (originCoin == 'usdt' || originCoin == 'btc' || originCoin == 'eth' || originCoin == 'ada' || originCoin == 'dot' ) {
            break;
        }
    }
}
/* BUG: la condicion resulta false solo en caso de que en el primer intento de validar el saldo (funcion anterior) se hagan mas de un intento. */
/* ORIGEN DLE BUG: al introducir un ticket cuyo saldo es 0 cae a tal caso del switch y usa el balance respectivo (siempre 0) aunque se vuelva a ingresar un ticker valido. */
/* SOLUCION PENDIENTE: funcion validarSaldoPositivo tiene que reiniciar validarTickerYSwap para poder ingresar a otro case del switch en lugar de solo cortar while cuando se introduce un ticker valido*/

function swapAmountIsNumber() {
    do {
        swapAmount = parseFloat(prompt('Por favor, ingresá la cantidad que deseas intercambiar.'))
        if (isNaN(swapAmount)) {
            alert('El valor ingresado es invalido. Por favor, ingresa un numero');
        }
    } while(isNaN(swapAmount));
}

function validarCambioSaldo(balance) {
    do {
        swapAmountIsNumber();
        if (swapAmount > balance || swapAmount < 0) { 
            alert('Tu saldo es insuficiente o ingresaste un valor negativo.'); 
        }
    } while (swapAmount > balance || swapAmount < 0);
}

function validarTickerYSwap(originCoin) {
    switch (originCoin) {
        case 'usdt':
            validarSaldoPositivo(usdtBalance);
            validarCambioSaldo(usdtBalance);
            return true;

        case 'btc':
            validarSaldoPositivo(btcBalance);
            validarCambioSaldo(btcBalance);
            return true;

        case 'eth':
            validarSaldoPositivo(ethBalance);
            validarCambioSaldo(ethBalance);
            return true;

        case 'ada':
            validarSaldoPositivo(adaBalance);
            validarCambioSaldo(adaBalance);
            return true;

        case 'dot':
            validarSaldoPositivo(dotBalance);
            validarCambioSaldo(dotBalance);
            return true;
        
        default:
            alert('Es necesario que selecciones un ticker valido.');
            return false;
    }
}

function validarTickerDestino(destinyCoin){
    switch (destinyCoin) {
        case 'usdt':
        case 'btc':
        case 'eth':
        case 'ada':
        case 'dot':
            return true;
        default:
            return false;
    }
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

