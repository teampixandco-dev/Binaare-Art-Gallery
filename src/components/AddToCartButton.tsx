"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

type Props = {
  slug: string;
  className?: string;
  showIcon?: boolean;
};

export default function AddToCartButton({ slug, className, showIcon = false }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={`${className ?? "btn-glass-cart py-2.5 px-6"} ${added ? "btn-glass-added" : ""}`}
      onClick={() => {
        addItem(slug, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2000);
      }}
    >
      {showIcon && !added && <ShoppingBag size={14} className="mr-1.5 inline-block" />}
      {added ? "Added to Cart ✓" : "Add to Cart"}
    </button>
  );
}
