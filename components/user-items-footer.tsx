"use client";
import UrlInput from "@/components/input-item";
import TotalLabel from '@/components/total-label';
import { Item } from '@/interfaces/Item';

interface UserItemsFooterProps {
  items: Item[];
  isCurrentUser: boolean;
}

export default function UserItemsFooter({ items, isCurrentUser }: UserItemsFooterProps) {
  return (
    <div className="flex">
      <div className="w-full md:max-10/12">
        { isCurrentUser ? <UrlInput /> : <div></div> }
      </div>
      <div className="md:w-2/12 flex justify-end items-center">
        <TotalLabel items={items} />
      </div>
    </div>
  );
}