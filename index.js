const fs = require("fs");

const ler = () => {
  const fileToUse = './teste1.json'

  const usedNumbers = fs.readdirSync('./feitas/').flatMap((files) => {
    let obj = JSON.parse(fs.readFileSync('./feitas/' + files, 'utf-8'))
    return Object.entries(obj).map(value => value[1]);
  });

  return usedNumbers
}

console.log(ler())