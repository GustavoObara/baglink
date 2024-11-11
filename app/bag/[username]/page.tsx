import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Item } from '@/interfaces/Item';

import UserItemsHeader from "@/components/user-items-header";
import UserItemsList from "@/components/user-items-list";
import UserEmptyState from "@/components/user-empty-state";
import UserItemsFooter from "@/components/user-items-footer";

export default async function UserItemsPage({ params }: { params: { username: string } }) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const { data, error } = await supabase.from('items').select('*').eq('username', params.username);
  const items: Item[] = data || [];

  if (error) {
    return <p>Erro ao buscar os itens: {error.message}</p>;
  }

  const fetchUserName = async () => {
    const { data, error } = await supabase.from('users_public').select('name').eq('username', params.username).single();
    return error ? null : data.name;
  };

  const fetchIdUser = async () => {
    const { data, error } = await supabase.from('users_public').select('id_user').eq('username', params.username).single();
    return error ? null : data.id_user;
  };

  let idUser = items.length > 0 ? items[0].id_user : await fetchIdUser();
  if (!idUser) return <p>Erro ao determinar o ID do usuário</p>;

  const isCurrentUser = user.id === idUser;
  const userName = isCurrentUser ? user.user_metadata?.name : await fetchUserName();

  return (
    <div className="flex flex-col min-h-screen">
      <UserItemsHeader currentUser={user.id} idUser={idUser} userName={userName} isCurrentUser={isCurrentUser} itemsLength={items.length}/>
      {items.length === 0 ? (
        <UserEmptyState userName={userName} isCurrentUser={isCurrentUser} />
      ) : (
        <UserItemsList items={items} currentUser={user.id} idUser={idUser} username={params.username} />
      )}
      <div className="mt-auto mb-[150px]">
        <UserItemsFooter items={items} isCurrentUser={isCurrentUser}/>
      </div>
    </div>
  );
}
