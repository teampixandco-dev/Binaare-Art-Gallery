"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  slug: string;
  className?: string;
};

export default function AddToCartButton({ slug, className }: Props) {
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
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
