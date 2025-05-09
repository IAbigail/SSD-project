import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Budget = () => {
  const { t } = useTranslation();

  const [totalBudget, setTotalBudget] = useState(10000); // Initial total wedding budget
  const [categories, setCategories] = useState([
    { name: 'Catering', plannedAmount: 2000, actualAmount: 0 },
    { name: 'Decorations', plannedAmount: 1500, actualAmount: 0 },
    { name: 'Venue', plannedAmount: 3000, actualAmount: 0 },
    { name: 'Entertainment', plannedAmount: 1000, actualAmount: 0 },
    { name: 'Miscellaneous', plannedAmount: 1500, actualAmount: 0 }
  ]);

  // Function to update actual expenses
  const handleExpenseChange = (categoryIndex: number, amount: number) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].actualAmount = amount;
    setCategories(updatedCategories);
  };

  // Function to update the total budget
  const handleTotalBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBudget = parseFloat(e.target.value);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setTotalBudget(newBudget);
    }
  };

  // Calculate total used and remaining
  const totalUsed = categories.reduce((acc, category) => acc + category.actualAmount, 0);
  const remainingBudget = totalBudget - totalUsed;

  return (
    <div className="budget-container">
      <h1>{t('budgetOverview')}</h1>

      {/* Input field for the total budget */}
      <div>
        <label htmlFor="total-budget">{t('totalBudget')}: </label>
        <input
          type="number"
          id="total-budget"
          value={totalBudget}
          onChange={handleTotalBudgetChange}
          min="0"
        />
      </div>

      <p>{t('used')}: ${totalUsed} | {t('remaining')}: ${remainingBudget}</p>

      <h2>{t('categories')}</h2>
      <div className="categories-table-container">
        <table className="categories-table">
          <thead>
            <tr>
              <th>{t('category')}</th>
              <th>{t('planned')}</th>
              <th>{t('actual')}</th>
              <th>{t('remainingAmount')}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td>{category.name}</td>
                <td>${category.plannedAmount}</td>
                <td>
                  <input
                    type="number"
                    value={category.actualAmount}
                    onChange={(e) => handleExpenseChange(index, parseFloat(e.target.value))}
                    min="0"
                  />
                </td>
                <td>${category.plannedAmount - category.actualAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Budget;
