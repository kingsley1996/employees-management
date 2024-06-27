import { Employee } from '@/constants/employees';

export const calculateYearExperience = (employee: Employee) => {
  let totalYears = 0;
  const calculatedToolLanguages: { [key: string]: boolean } = {};

  employee?.positions?.forEach((position) => {
    position?.toolLanguages?.forEach((tool) => {
      if (!calculatedToolLanguages[tool.toolLanguageResourceId]) {
        totalYears += tool.to - tool.from;
        calculatedToolLanguages[tool.toolLanguageResourceId] = true;
      }
    });
  });

  return totalYears;
};

export const sortEmployeesByExperience = (employees: Employee[]) => {
    const sortedEmployees = [...employees];
    return sortedEmployees.sort(
      (a, b) => calculateYearExperience(b) - calculateYearExperience(a)
    );
};
