# MondSwap 
MondSwap es un simulador de exchange descentralizado, basado en los conocidos Uniswap y PancakeSwap. Estilos inspirados en el proyecto Moonbeam.
Es proyecto se desarrollo en el marco del curso de JavaScript de CODERHOUSE.
MondSwap es un mero simulador, no está conectado a ninguna blockchain y por tanto los 'activos' que se manejan son totalmente ficticios y por lo tanto no reclamables.

## Objetivo  del proyecto
Crear una aplicación web empleando JavaScript. Requisitos para ello eran también ser un sitio one-page y construir un simulador completamente funcional.

## Funcionalidades:
- Faucet: luego de clickear el botón "Start now!" se agragan 500 USDT al balance, se inhabilita el botón y vuelve a estar disponible luego de pasadas 12 horas o al clickear el botón "Reset".
- Swap o intercambio: es posible realizar intercambio de criptomonedas, con precios actualizados cada 10 segundos (obtenidos desde la API de cryptocompare: https://min-api.cryptocompare.com/). Tras cada intercambio se descuenta el 1% de la cantidad intercambiada desde el saldo de la moneda de origen, por tanto es necesario tener al menos el 1% de la camtidad a intercambiar disponible para pagar por ello (la app te lo impide si no se puede pagar).
- Staking: el staking es una especie de plazo fijo flexible convencional, permite delegar criptomonedas para obtener un rendimiento cada cierto período de tiempo. De la misma manera que el swap, para depositar y retirar criptomonedas de la aplicación de staking es necesario pagar el 1% de la cantidad a depositar o retirar en dicha criptomoneda. Por tanto es necesario contar con saldo cada vez que se deposite y guardar saldo para retirar luego.

## Tecnologías aplicadas:
- HTML (Hyper Text Markup Language)
- CSS (Cascading Style Sheets)
- SASS (Syntactically Awsome Style Sheets)
- JavaScript
- SweetAlert V2 (librería de alertas para JavaScript, https://sweetalert2.github.io/)
- Servicio de hosting gratuito: Netlify (el sitio puede visualizarse en  https://mondswap.netlify.app)



