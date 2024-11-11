"use client";
import LinkPreviewRow from "@/components/link-preview-row";
import { Item } from '@/interfaces/Item';

interface UserItemsListProps {
  items: Item[];
  currentUser: string;
  idUser: string;
  username: string;
}

export default function UserItemsList({ items, currentUser, idUser, username }: UserItemsListProps ) {
  return (
    <div className="flex-1 overflow-y-auto min-w-full max-w-5xl mx-auto max-h-[70vh]">
      <LinkPreviewRow items={items} currentUser={currentUser} linkUser={idUser} username={username} />
    </div>
  );
}