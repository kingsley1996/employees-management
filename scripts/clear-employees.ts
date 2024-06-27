const fs = require('fs');
const path = './data/employees.json';

const clearAllItems = () => {
  const emptyData = { data: { totalItems: 0, totalPages: 1, pageItems: [] } };
  fs.writeFileSync(path, JSON.stringify(emptyData, null, 2));
  console.log('Cleared all items from employees.json');
};

clearAllItems();