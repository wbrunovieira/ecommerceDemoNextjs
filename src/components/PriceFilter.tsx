"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelectionStore } from "@/context/store";

const PriceFilter = ({ isHome }: { isHome: boolean }) => {
  const [valorMin, setValorMin] = useState(0);
  const [valorMax, setValorMax] = useState(1000);
  const router = useRouter();

  const selectedMinPrice = useSelectionStore((state) => state.selectedMinPrice);
  const selectedMaxPrice = useSelectionStore((state) => state.selectedMaxPrice);
  const setSelectedMinPrice = useSelectionStore(
    (state) => state.setSelectedMinPrice
  );
  const setSelectedMaxPrice = useSelectionStore(
    (state) => state.setSelectedMaxPrice
  );

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoMin = Math.min(Number(e.target.value), valorMax - 1);

    setValorMin(novoMin);
    setSelectedMinPrice(novoMin);

    if (selectedMaxPrice === null || novoMin >= selectedMaxPrice) {
      const novoMax = 1000;
      setValorMax(novoMax);
      setSelectedMaxPrice(novoMax);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoMax = Math.max(Number(e.target.value), valorMin + 1);

    setValorMax(novoMax);
    setSelectedMaxPrice(novoMax);

    if (selectedMinPrice === null || novoMax <= selectedMinPrice) {
      const novoMin = 1;
      setValorMin(novoMin < 0 ? 0 : novoMin);
      setSelectedMinPrice(novoMin < 0 ? 0 : novoMin);
    }
  };

  const handleFilterSubmit = () => {
    const queryParams = `?minPrice=${valorMin}&maxPrice=${valorMax}`;

    if (isHome) {
      router.push(`/filtered${queryParams}`);
    }
  };
  console.log("selectedMinPrice", selectedMinPrice);
  console.log("selectedMaxPrice", selectedMaxPrice);

  return (
    <div className="flex flex-col w-48 border border-light p-4 mt-2 rounded bg-primaryLight">
      <h2 className="text-primaryDark text-base tracking-wider rounded mb-2">
        Preço
      </h2>
      <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
      <div className="relative ">
        <div className="mb-4">
          <label
            htmlFor="min"
            className="block text-xs font-medium text-gray-700"
          >
            Mínimo
          </label>
          <input
            id="min"
            type="range"
            min="0"
            max="1000"
            value={valorMin}
            onChange={(e) => handleMinChange(e)}
            className="slider-min"
          />
          <div className="text-xs text-center">{valorMin}</div>
        </div>

        <div>
          <label
            htmlFor="max"
            className="block text-xs font-medium text-gray-700"
          >
            Máximo
          </label>
          <input
            id="max"
            type="range"
            min="0"
            max="1000"
            value={valorMax}
            onChange={(e) => handleMaxChange(e)}
            className="slider-max"
          />

          <div className="text-xs text-center">{valorMax}</div>
        </div>
      </div>

      {isHome && (
        <button
          onClick={handleFilterSubmit}
          className="bg-primary text-white py-2 px-4 mt-4 rounded hover:bg-primaryDark hover:text-primaryLight transition duration-300 ease-in-out"
        >
          Filtrar
        </button>
      )}
    </div>
  );
};

export default PriceFilter;
