export const convertContacts = async csvFile => {
  const csv = require('csvtojson');
  let numbers = [];
  return csv({
    noheader: true,
    output: 'csv',
  })
    .fromString(csvFile)
    .then(csvRow => {
      // => [["1","2","3"], ["4","5","6"], ["7","8","9"]]
      for (let i in csvRow) {
        numbers.push(csvRow[i][1]);
      }
      // console.log(numbers);
      return numbers;
    });
};
