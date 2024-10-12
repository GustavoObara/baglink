'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchLinkPreview } from '@/services/linkPreviewService';
import { Item } from '@/interfaces/Item';
import { PreviewDataPrice } from '@/interfaces/PreviewDataPrice';

interface TotalLabelProps {
  items: Item[];
}

export default function TotalLabel({ items }: TotalLabelProps) {
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const calculateTotalPrice = useCallback(async () => {
    if (items.length === 0) return;

    let total = 0;
    const previews = await Promise.all(items.map(item => fetchLinkPreview(item.url)));

    previews.forEach((preview: PreviewDataPrice) => {
      const price = parseFloat(preview.price.replace(/\./g, '').replace(',', '.'));
      if (!isNaN(price)) {
        total += price;
      }
    });

    setTotalPrice(total);
  }, [items]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  return (
    <div>
      <label className='text-lg font-semibold'>Total: R$ {totalPrice.toFixed(2).replace('.', ',')}</label>
    </div>
  );
}
