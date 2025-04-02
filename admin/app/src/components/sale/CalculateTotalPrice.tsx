import { useMemo } from "react";

export default function CalculateTotalPrice({ item }: { item: SaleTemps }) {
  const calculateTotalPrice = (item: SaleTemps) => {
    let totalPrice = 0;
    console.log("Item is", item);
    console.log("item . sale temp details is", item.SaleTempDetails);

    item.SaleTempDetails.forEach((detail) => {
      const basePrice = detail.Food?.price ?? 0;
      const foodSizeMoneyAdded = detail.FoodSize?.moneyAdded ?? 0;
      const quantity = item.qty ?? 0;

      const priceForItem = (basePrice + foodSizeMoneyAdded) * quantity;

      console.log("basePrice", basePrice);
      console.log("foodSizeMoneyAdded", foodSizeMoneyAdded);
      console.log("quantity", quantity);
      console.log("priceForItem", priceForItem);
      totalPrice += priceForItem;
      console.log("totalPrice", totalPrice);
    });
    return totalPrice;
  };

  const totalPrice = useMemo(() => calculateTotalPrice(item), [item]);

  return <span>{totalPrice.toFixed(2)}</span>;
}
