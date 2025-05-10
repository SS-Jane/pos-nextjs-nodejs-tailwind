import { useMemo } from "react";

export default function CalculateTotalPrice({ item }: { item: SaleTemps }) {
  const calculateTotalPrice = (item: SaleTemps) => {
    let totalPrice = 0;

    item.SaleTempDetails.forEach((detail : any) => {
      const basePrice = detail.Food?.price ?? 0;
      const foodSizeMoneyAdded = detail.FoodSize?.moneyAdded ?? 0;
      const quantity = item.qty ?? 0;

      const priceForItem = (basePrice + foodSizeMoneyAdded) * quantity;

      totalPrice += priceForItem;
    });
    return totalPrice;
  };

  const totalPrice = useMemo(() => calculateTotalPrice(item), [item]);

  return <span>{totalPrice.toFixed(2)}</span>;
}
