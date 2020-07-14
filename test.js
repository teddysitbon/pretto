const INPUT = [
  ['key1', 1, 2, 3, 4],
  ['key2', 4, 5, 6, 7]
];

function transform (input) {
    const objet = {};
    input.map((array) => {
        const [newKey] = array;
        array.shift();
        objet[`${newKey}`] = array;
        return null;
    });
    return objet;
}

const OUTPUT = transform(INPUT);
console.log(OUTPUT);