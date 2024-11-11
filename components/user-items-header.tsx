"use client";

import CopyUrlButton from '@/components/copy-url-button';

import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface UserItemsHeaderProps {
  currentUser: string;
  idUser: string;
  userName: string;
  isCurrentUser: boolean;
  itemsLength: number;
}

export default function UserItemsHeader({ currentUser, idUser, userName, isCurrentUser, itemsLength }: UserItemsHeaderProps ) {
  return (
    <div className="flex justify-between w-full max-w-5xl mx-auto">
      {
        itemsLength > 0 ? 
        <h3 className="text-2xl font-bold mb-4">
          {isCurrentUser ? `Olá ${userName}, aqui estão seus produtos!` : `Aqui estão os produtos de ${userName}`}
        </h3>
        : <div className="w-full"></div>
      }
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger type="button">
            <CopyUrlButton userId={currentUser} OwnerBagId={idUser} nameUser={userName} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Copiar Url</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
