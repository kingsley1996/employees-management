const fs = require('fs');
const path = './data/employees.json';

// Đọc dữ liệu từ file JSON
const rawData = fs.readFileSync(path);
const jsonData = JSON.parse(rawData);

// Hàm tạo tên ngẫu nhiên cho employee
const generateRandomName = () => {
  const names = ["John Doe", "Jane Smith", "Alice Johnson", "Chris Evans", "Emma Watson",
    "Michael Brown", "David Wilson", "Sophia Lee", "Olivia Harris", "Ava Moore",
    "Liam Martin", "Noah Thompson", "Mason White", "Ethan Anderson", "Logan Clark",
    "Lucas Lopez", "James Scott", "Ella Lewis", "Isabella Walker", "Mia Hall"];
  return names[Math.floor(Math.random() * names.length)];
};

// Hàm tạo phần tử mới với dữ liệu ngẫu nhiên
const createNewItem = (id) => {
  return {
    id,
    name: generateRandomName(),
    positions: [
      {
        id: 1,
        positionResourceId: 1,
        displayOrder: 2,
        toolLanguages: [
          {
            id: 1,
            toolLanguageResourceId: 2,
            displayOrder: 4,
            from: 2018,
            to: 2024,
            description: "New description here",
            images: [
              {
                id: 1,
                cdnUrl: "https://picsum.photos/200/300",
                displayOrder: 0
              },
              {
                id: 2,
                cdnUrl: "https://picsum.photos/200/300",
                displayOrder: 1
              }
            ]
          }
        ]
      }
    ]
  };
};

// Thêm phần tử cho đủ 20 phần tử
while (jsonData.data.pageItems.length < 20) {
  const newId = jsonData.data.pageItems.length + 1;
  jsonData.data.pageItems.push(createNewItem(newId));
}

// Cập nhật totalItems và totalPages
jsonData.data.totalItems = jsonData.data.pageItems.length;
jsonData.data.totalPages = Math.ceil(jsonData.data.totalItems / 10);

// Ghi lại dữ liệu vào file JSON
fs.writeFileSync(path, JSON.stringify(jsonData, null, 2));

