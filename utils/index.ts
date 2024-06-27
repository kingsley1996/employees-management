import fs from "fs";

export const readJsonFile = (filePath: string) => {
  const jsonData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(jsonData);
};

export const writeJsonFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};