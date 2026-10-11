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
      className={className ?? "btn-primary"}
      onClick={() => {
        addItem(slug, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2000);
      }}
    >
      {showIcon && !added && <ShoppingBag size={14} className="mr-1 inline-block" />}
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
