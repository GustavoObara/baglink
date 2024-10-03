import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LinkPreviewRow from "@/components/link-preview-row";
import UrlInput from "@/components/input-item";

export default async function UserItemsPage({ params }: { params: { id_user: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: items, error } = await supabase.from('items').select('*').eq('id_user', params.id_user);

  if (error) {
    return <p>Erro ao buscar os itens: {error.message}</p>;
  }

  const currentUser = user.id;
  const linkUser = params.id_user;

  const fetchUserName = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id_user', linkUser) 
        .single();

    if (error) {
        console.error('Erro ao buscar nome do usuário:', error);
        return null;
    }

    return data.name;
  };

  if (currentUser !== linkUser) {
    const userName = fetchUserName(linkUser);

    if (items.length === 0) {
      return (
        <div className="min-h-screen">
          <h3 className="text-2xl font-bold mb-4">{userName} Não possuí itens em sua BagLink!</h3>
      </div>
      );
    }

    return (
      <div className="min-h-screen">
          <h3 className="text-2xl font-bold mb-4">Aqui estão os produtos de {userName}</h3>
          <LinkPreviewRow items={items} currentUser={currentUser} linkUser={linkUser} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <h3 className="text-2xl font-bold mb-4">Olá {user.user_metadata?.name.charAt(0).toUpperCase() + user.user_metadata?.name.slice(1)} Parece que você ainda não possuí Produtos em Sua BagLink começe adicionando uma url!</h3>
      <UrlInput/>
    </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h3 className="text-2xl font-bold mb-4">{user.user_metadata?.name.charAt(0).toUpperCase() + user.user_metadata?.name.slice(1)} aqui estão seus produtos!</h3>
      <LinkPreviewRow items={items} currentUser={currentUser} linkUser={linkUser}/>
      <UrlInput/>
    </div>
  );
}