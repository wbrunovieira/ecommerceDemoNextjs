"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/context/store";

const ClearCartOnLogout = () => {
  const { data: session } = useSession();
  const clearCart = useCartStore((state: any) => state.clearCart);

  useEffect(() => {
    if (!session) {
      clearCart();
    }
  }, [session, clearCart]);

  return null;
};

export default ClearCartOnLogout;
