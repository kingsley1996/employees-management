const { v4: uuid4 } = require('uuid');
const fs = require('fs');
const path = './data/employees.json';

// Đọc dữ liệu từ file JSON
const rawData = fs.readFileSync(path);
const jsonData = JSON.parse(rawData);

const keywords = [
  "Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Henry", "Ivy", "Jack",
  "Kate", "Liam", "Mary", "Nathan", "Olivia", "Peter", "Queenie", "Robert", "Sophia", "Thomas",
  "Ursula", "Victor", "Wendy", "Xavier", "Yvonne", "Zachary"
];

const getRandomKeyword = () => {
  const randomIndex = Math.floor(Math.random() * keywords.length);
  return keywords[randomIndex];
};

const generateRandomName = () => {
  const firstName = getRandomKeyword();
  const lastName = getRandomKeyword();
  return `${firstName} ${lastName}`;
};

const imageUrls = [
  'https://res.cloudinary.com/dwhaokd0c/image/upload/fl_preserve_transparency/v1719499702/ruby-lang-ar21_mxz4mb.jpg?_s=public-apps',
  'https://res.cloudinary.com/dwhaokd0c/image/upload/fl_preserve_transparency/v1719499713/csharp2_ispdfu.jpg?_s=public-apps',
  'https://res.cloudinary.com/dwhaokd0c/image/upload/fl_preserve_transparency/v1719499684/meta-image_q2mr7f.jpg?_s=public-apps',
  'https://res.cloudinary.com/dwhaokd0c/image/upload/fl_preserve_transparency/v1719499652/1_moJeTvW97yShLB7URRj5Kg_obf418.jpg?_s=public-apps',
  'https://res.cloudinary.com/dwhaokd0c/image/upload/fl_preserve_transparency/v1719499632/bootstrap-vite_basn1d.jpg?_s=public-apps'
]

const positionResources = [
  {
    positionResourceId: "5b2cbdad-fac2-4c74-b3a9-37348d451840",
    name: "Frontend",
    toolLanguageResources: [
      { toolLanguageResourceId: "1c04e335-e4dc-495e-9871-9ee24f1cfec9", name: "Javascript" },
      { toolLanguageResourceId: "d793b434-f6dc-4790-8d68-72873dc9dcf8", name: "ReactJS" },
      { toolLanguageResourceId: "bebe9d2e-5c62-4cf3-b58f-76e8faa78080", name: "VueJS" },
      { toolLanguageResourceId: "b5b5f343-a9cc-460a-80b7-7e23754502d3", name: "AngularJS" },
      { toolLanguageResourceId: "d2170776-730e-4876-a761-5ca9f141a93b", name: "Jquery" }
    ]
  },
  {
    positionResourceId: "b8511f87-2e7b-467a-b912-bc4e08890040",
    name: "Backend",
    toolLanguageResources: [
      { toolLanguageResourceId: "17488072-8674-4a04-8638-d0f6421e9373", name: "PHP" },
      { toolLanguageResourceId: "93ef8fc4-a555-45ea-b12f-0ed5936fa6a3", name: "Python" },
      { toolLanguageResourceId: "88ffe7e1-ce3c-4531-b358-4aa6a5ee2759", name: "Ruby" },
      { toolLanguageResourceId: "f7a4f2b1-a31e-415b-80c1-ffbdc5301481", name: "Java" },
      { toolLanguageResourceId: "4d7663c9-08a9-49c0-b21e-c33f07d9155a", name: "Nodejs" },
      { toolLanguageResourceId: "2c03167a-0cf4-4cd9-a729-82f0dcd25c40", name: "C" },
      { toolLanguageResourceId: "c31469f2-d110-4f2f-a0ab-8a9cc483e9e6", name: "C++" },
      { toolLanguageResourceId: "9228af52-c835-4a5b-b799-3b83fae94d30", name: ".NET" }
    ]
  },
  {
    positionResourceId: "2754b3a6-bc57-4207-b880-a9b267b84122",
    name: "Designer",
    toolLanguageResources: [
      { toolLanguageResourceId: "c980667d-1164-424a-94e2-952ece2cf390", name: "Adobe XD" },
      { toolLanguageResourceId: "2b61a656-b0f6-4cc9-ae72-3f977010dd10", name: "Figma" },
      { toolLanguageResourceId: "a084429a-f61f-4c72-a604-b1cb5a7c4a48", name: "Illustrator" },
      { toolLanguageResourceId: "8dc80b6d-7e72-498f-b6e6-1e0e92df7abc", name: "InvisionStudio" },
      { toolLanguageResourceId: "0efa1675-aa38-4ed5-808c-a245f277dc9c", name: "Photoshop" },
      { toolLanguageResourceId: "b00c3380-a3fb-461d-a1d6-083a9bc3cb15", name: "Sketch" }
    ]
  }
];

// Function to generate a random number in a specified range
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomItems = (array, numItems) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
};

const getRandomUrl = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

// Function to generate random employees
const generateRandomEmployees = () => {
  const employees = [];
  const numEmployees = 20;

  for (let i = 0; i < numEmployees; i++) {
    const employeePositions = [];
    const numPositions = getRandomInt(1, 2); // Generate 1 to 2 positions for each employee

    for (let j = 0; j < numPositions; j++) {
      const randomPositionIndex = getRandomInt(0, positionResources.length - 1);
      const position = positionResources[randomPositionIndex];

      // Select random tool languages for the position
      const numLanguages = getRandomInt(1, 2); // Generate 1 to 2 languages for each position
      const selectedTools = getRandomItems(position.toolLanguageResources, numLanguages);

      const toolLanguages = selectedTools.map(tool => ({
        id: uuid4(),
        toolLanguageResourceId: tool.toolLanguageResourceId,
        from: getRandomInt(2014, 2020).toString(),
        to: getRandomInt(2021, 2024).toString(),
        description: `Description for ${tool.name}`,
        images: [
          { id: uuid4(), cdnUrl: getRandomUrl(imageUrls) }
        ]
      }));

      const positionData = {
        id: uuid4(),
        positionResourceId: position.positionResourceId,
        toolLanguages: toolLanguages
      };

      employeePositions.push(positionData);
    }

    const employee = {
      id: uuid4(),
      name: generateRandomName(),
      positions: employeePositions
    };

    employees.push(employee);
  }

  return employees;
};

// Generate new employees
const newEmployees = generateRandomEmployees();

console.log('newEmployees: ', newEmployees);

// Thêm phần tử cho đủ 20 phần tử
while (jsonData.data.pageItems.length < 40 && newEmployees.length > 0) {
  jsonData.data.pageItems.push(newEmployees.shift()); // Add employees one by one until pageItems reaches 20
}


// Cập nhật totalItems và totalPages
jsonData.data.totalItems = jsonData.data.pageItems.length;
jsonData.data.totalPages = Math.ceil(jsonData.data.totalItems / 10);

// Ghi lại dữ liệu vào file JSON
fs.writeFileSync(path, JSON.stringify(jsonData, null, 2));