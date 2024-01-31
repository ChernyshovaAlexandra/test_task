
const initialData = {
    currency: "$",
    values: [30, 276, 420],
    period: "/ Month"
};

const currentState = {
    period: "/ Month",
    values: [30, 276, 420],
    currency: "$"
};

const convertCurrency = (initialCurrency, finalCurrency, initialPeriod, finalPeriod) => {
    const exchangeRates = {
        "$": { "₽": 80, "€": 0.9219, "$": 1 },
        "₽": { "$": 1 / 80, "€": 0.0115, "₽": 1 },
        "€": { "$": 1.0869, "₽": 87, "€": 1 }
    };

    const conversionRate = exchangeRates[initialCurrency][finalCurrency];
    let conversionPeriod = 1;
    let values = [...currentState.values];

    if (initialPeriod === "/ Month" && finalPeriod === "/ Day") {
        conversionPeriod = 30;
        values = values.map(price => price * conversionRate / conversionPeriod);
    } else if (initialPeriod === "/ Day" && finalPeriod === "/ Month") {
        conversionPeriod = 30;
        values = values.map(price => price * conversionRate * conversionPeriod);
    } else {
        values = values.map(price => price * conversionRate * conversionPeriod);
    }

    currentState.currency = finalCurrency;
    currentState.period = finalPeriod;
    currentState.values = values;
    return values;
};

const updateData = (resultValues, period, finalCurrency) => {
    const pricingBlocksValues = document.querySelectorAll(".value");
    const pricingBlocksCurrency = document.querySelectorAll(".currency");
    const pricingBlocksPeriod = document.querySelectorAll(".period");

    pricingBlocksValues.forEach((item, index) => {
        item.innerHTML = resultValues[index].toFixed();
    });
    pricingBlocksCurrency.forEach(item => {
        item.innerHTML = finalCurrency;
    });
    pricingBlocksPeriod.forEach(item => {
        item.innerHTML = period;
    })
}

document.addEventListener("DOMContentLoaded", function () {
    const pricingBlocksCurrency = document.querySelectorAll(".currency");
    const pricingBlocksPeriod = document.querySelectorAll(".period");
    const burger = document.querySelector(".burger");
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    pricingBlocksPeriod.forEach((period) => {
        period.addEventListener("click", () => {
            const currentCurrency = currentState.currency;
            const finalCurrency = currentCurrency;
            const currentPeriod = currentState.period;
            const newPeriod = currentState.period === "/ Month" ? "/ Day" : "/ Month";

            const resultValues = convertCurrency(currentCurrency, finalCurrency, currentPeriod, newPeriod);
            updateData(resultValues, newPeriod, finalCurrency);
        });
    });

    pricingBlocksCurrency.forEach(currency => {
        currency.addEventListener("click", () => {
            const currentCurrency = currentState.currency;
            const finalCurrency = (currentCurrency === "$") ? "₽" : (currentCurrency === "₽") ? "€" : "$";
            const currentPeriod = currentState.period;
            const newPeriod = currentState.period;

            const resultValues = convertCurrency(currentCurrency, finalCurrency, currentPeriod, newPeriod);
            updateData(resultValues, newPeriod, finalCurrency);
        });
    });
    burger.addEventListener("click", () => {
        document.querySelector(".nav-list").classList.toggle("opened");
        burger.classList.toggle("opened");
    });
    if (isMobile) {
        const links = document.querySelectorAll(".nav-item");
        links.forEach(link => {
            link.addEventListener("click", () => {
                document.querySelector(".nav-list").classList.toggle("opened");
                burger.classList.toggle("opened");
            });
        });
    }
});