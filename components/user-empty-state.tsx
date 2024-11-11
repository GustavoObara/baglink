"use client";

interface UserEmptyStateProps {
  userName: string;
  isCurrentUser: boolean;
}

export default function UserEmptyState({ userName, isCurrentUser }: UserEmptyStateProps) {
  return (
    <div className="min-h-full text-center mt-3">
      <h3 className="text-xl font-bold mb-4">
        {isCurrentUser
          ? `Olá ${userName}, parece que você ainda não possui produtos em sua BagLink. Comece adicionando uma URL!`
          : `${userName} Não possui itens em sua BagLink!`}
      </h3>
    </div>
  );
}