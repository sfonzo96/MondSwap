let usdtBalance = 100, 
    btcBalance = 0, 
    ethBalance = 0, 
    adaBalance = 0, 
    dotBalance = 0, 
    originCoin, 
    destinyCoin,
    swapAmount;

alert('¡Bienvenido! Se te han asignado 100 USDT de prueba.');

if (confirm('¿Deseas realizar algun intercambio entre monedas?')) {
    do {
        originCoin = prompt(`Este es tu balance: \n USDT: ${usdtBalance} \n BTC: ${btcBalance} \n ETH: ${ethBalance} \n ADA: ${adaBalance} \n DOT: ${dotBalance} \nPor favor, ingresá el ticker de la moneda que quisieras intercambiar.`).toLowerCase();
    } while(!validarTickerYBalance(originCoin));
   
   /*  do {
        destinyCoin = toLoweCase(prompt('Por favor, ingresá el ticker de la moneda que quisieras obtener. Solo están disponibles: USDT, BTC, ETH, ADA y DOT.'));
    } while */
    alert('Intercambio exitoso!');
    
}

function validarSaldoPositivo(balance) {
    while (balance <= 0){
        alert('No podes seleccionar una moneda sin saldo. Por favor, selecciona otra.');
        originCoin = prompt(`Este es tu balance: \n USDT: ${usdtBalance} \n BTC: ${btcBalance} \n ETH: ${ethBalance} \n ADA: ${adaBalance} \n DOT: ${dotBalance} \nPor favor, ingresá el ticker de la moneda que quisieras intercambiar.`).toLowerCase();
    }
     /*  if (balance <= 0) {
            alert('No podes seleccionar una moneda sin saldo.');
            return false;
        }
    return true;*/
}

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
   /*  if (swap > balance || swap < 0) {
        alert('Tu saldo es insuficiente o ingresaste un valor negativo.');
        return false;
    } 
    return true;*/
}

function validarTickerYBalance(originCoin) {
    switch (originCoin) {
        case 'usdt':
            validarSaldoPositivo(usdtBalance);
            /* if (!validarSaldoPositivo(usdtBalance)) {
                return false;
            } */
            validarCambioSaldo(usdtBalance);
            /* if (!validarCambioSaldo(originAmount,usdtBalance)) {
                return false;
            } */
            return true;

        case 'btc':
            validarSaldoPositivo(btcBalance);
            /* if (!validarSaldoPositivo(btcBalance)) {
                return false;
            } */
            validarCambioSaldo(btcBalance);
            /* if (!validarCambioSaldo(originAmount,btcBalance)) {
                return false;
            } */
            return true;

        case 'eth':
            validarSaldoPositivo(ethBalance);
            /* if (!validarSaldoPositivo(ethBalance)) {
                return false;
            } */
            validarCambioSaldo(ethBalance);
            /* if (!validarCambioSaldo(originAmount,ethBalance)) {
                return false;
            } */
            return true;

        case 'ada':
            validarSaldoPositivo(adaBalance);
            /* if (!validarSaldoPositivo(adaBalance)) {
                return false;
            } */
            validarCambioSaldo(adaBalance);
            /* if (!validarCambioSaldo(originAmount,adaBalance)) {
                return false;
            } */
            return true;

        case 'dot':
            validarSaldoPositivo(dotBalance);
            /* if (!validarSaldoPositivo(dotBalance)) {
                return false;
            } */
            validarCambioSaldo(dotBalance);
            /* if (!validarCambioSaldo(originAmount,dotBalance)) {
                return false;
            } */
            return true;
        
        default:
            alert('Es necesario que selecciones un ticker valido.');
            return false;
    }
}

/* AGREGAR FUNCION PARA CERRAR VENTANA SIMULADOR ANTE APRETAR ESCAPE
    function closeTest() {
   syntax target.onkeydown = functionRef;
} */
