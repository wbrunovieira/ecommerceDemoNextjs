"use client";

import { BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const SearchBox = () => {
  const [query, setQuery] = useState("");

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim().toLowerCase();

    if (trimmedQuery) {
      router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
      setQuery("");
    }
  };

  return (
    <div className="flex justify-center items-center relative w-full">
    <PlaceholdersAndVanishInput
            placeholders={["Pesquisar...", "Buscar produtos...", "O que você procura?"]}
            onChange={handleInputChange}
            onSubmit={handleSearch}
          />
    </div>
  );
};

export default SearchBox;
