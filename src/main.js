import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard: ["#DF6F29", "#C69347"],
        nubank: ["#8641ba", "#ae6ce0"],
        elo: ["#DFB729", "#843B3B"],
        americanExpress: ["#41BA80", "#6CE09A"],
        dinersClub: ["#5D76B7", "#6578BC"],
        default: ["black", "gray"]
    }

    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])
    ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
    mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 000000 0000",
            regex: /^3[47][0-9]{14}$/,
            cardType: "americanExpress",
        },
        {
            mask: "0000 000000 0000",     
            regex: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            cardType: "dinersClub",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^4[0-9]{12}(?:[0-9]{3})?$/,
            cardType: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardType: "mastercard"
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^8[6-9]\d{0,2}/,
            cardType: "elo"
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^7[1-5]\d{0,2}/,
            cardType: "nubank"
        },
        {
            mask: "0000 0000 0000 0000",
            cardType: "default"
        }
    ],
    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "")
        const foundMask = dynamicMasked.compiledMasks.find(function (item) {
            return number.match(item.regex)
        })
        return foundMask
    }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

globalThis.setCardType = setCardType //para poder executar o comando no console do navegador

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", (event) => {
    event.preventDefault();
    alert("Cartão Adicionado")
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")
    ccHolder.innerText = cardHolder.value.length === 0 ? "JONAS ALVES" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value);
})

function updateSecurityCode(code) {
    const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
    updateCardNumber(cardNumberMasked.value);
    updateCardType();
})

function updateCardType(type) {
    const cardType = cardNumberMasked.masked.currentMask.cardType
    setCardType(cardType)
}

function updateCardNumber(code) {
    const ccCardNumber = document.querySelector(".cc-number")
    ccCardNumber.innerText = code.length === 0 ? "0000 0000 0000 0000" : code
}

expirationDateMasked.on("accept", () => {
    updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
    const ccExpiration = document.querySelector(".cc-extra .value")
    ccExpiration.innerText = date.length === 0 ? "01/32" : date
}

