// CONSTANTS
const SAVINGS_TYPE = {
    PERCENT: 'percent',
    TOTAL: 'total'
};
const CURRENT_FORMAT_COUNTRY = 'fr-FR';
const CURRENT_FORMAT_STYLE = 'currency';
const CURRENT_FORMAT_CURRENCY = 'EUR';
const MINIMUM_DIGITS = 0;
const POURCENT = 100;
const LOCALE = {
    DESCRIPTION: 'Vous économisez [price] par rapport au prix initial',
    TITLE: {
        reductionVoucher: 'Bon de réduction',
        sales: 'Soldes'
    }
};

// HELPERS
function formatMoney (price) {
    const formatter = new Intl.NumberFormat(
        CURRENT_FORMAT_COUNTRY,
        {
            style: CURRENT_FORMAT_STYLE,
            currency: CURRENT_FORMAT_CURRENCY,
            minimumFractionDigits: MINIMUM_DIGITS,
        }
    );
    return formatter.format(price);
}

function getDynamicLocal (locale, savings) {
    return locale.replace(/\[.*\]/gu,
        formatMoney(savings)
    );
}
function getPercentagePrice (price, savings) {
    return (price * savings) / POURCENT;
}
// MAIN
function transform (input) {
    const output = [];
    const availableOperations = input.filter((operation) => typeof operation.price !== 'undefined');
    availableOperations.map((operation) => {
        const { savingsType, price, savings, kind } = operation;
        const object = {};
        object.basePrice = formatMoney(price);
        object.title = LOCALE.TITLE[kind];
        let gain = 0;
        switch (savingsType) {
            case SAVINGS_TYPE.TOTAL:
                gain = savings;
                object.savings = formatMoney(gain);
                break;
            case SAVINGS_TYPE.PERCENT:
            default:
                gain = getPercentagePrice(
                    price,
                    savings
                );
                object.savings = `${savings} %`;
                break;
        }
        object.description = getDynamicLocal(
            LOCALE.DESCRIPTION,
            gain
        );
        object.price = formatMoney(price - gain);
        output.push(object);
        return null;
    });
    return output;
}

const INPUT = [
    {
        price: 3000,
        kind: 'reductionVoucher',
        savings: 300,
        savingsType: 'total',
    },
    {
        price: undefined,
        kind: 'sales',
        savings: 10,
        savingsType: 'percent',
    },
    {
        price: 3000,
        kind: 'sales',
        savings: 15,
        savingsType: 'percent',
    }
];
const OUTPUT = transform(INPUT)
console.log(OUTPUT);