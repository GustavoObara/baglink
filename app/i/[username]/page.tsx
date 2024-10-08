import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LinkPreviewRow from "@/components/link-preview-row";
import UrlInput from "@/components/input-item";

interface Item {
  id: number;
  id_user: string;
  url: string;
  created_at: string;
  finish: boolean;
  username: string;
}

export default async function UserItemsPage({ params }: { params: { username: string } }) {
  const supabase = createClient();

  // Obtém o usuário autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redireciona para a página de login se o usuário não estiver autenticado
  if (!user) {
    return redirect("/sign-in");
  }

  // Busca os itens do usuário no banco de dados
  const { data, error } = await supabase.from('items').select('*').eq('username', params.username);
  
  const items: Item[] = data || [];

  if (error) {
    return <p>Erro ao buscar os itens: {error.message}</p>;
  }

  const currentUser = user.id;
  
  const fetchUserName = async () => {
    const { data, error } = await supabase.from('users_public').select('name').eq('username', params.username).single();

    if (error) {
        console.error('Erro ao buscar nome do usuário:', error);
        return null;
    }

    return data.name;
  };

  // Função para buscar o ID do usuário
  const fetchIdUser = async () => {
    const { data, error } = await supabase.from('users_public').select('id_user').eq('username', params.username).single();

    if (error) {
      console.error('error ao buscar id do usuário', error);
      return null;
    }

    console.log(data.id_user);
    return data.id_user;
  };

  // Determina o ID do usuário, buscando no banco se os itens não foram encontrados
  let idUser;

  if (!items || items.length === 0) {
    idUser = await fetchIdUser();  
  } else {
    idUser = items[0].id_user;
  }

  // Verifica se o usuário atual é o dono da página
  if (currentUser !== idUser) {
    const userName = await fetchUserName();
    // Se a Url estiver com um usuário inválido exibe ao usuário
    if (userName === null) {
      return (
        <div className="min-h-full text-center">
          <h3 className="text-2xl font-bold mb-4">Usuário não encontrado em nosso banco de dados! Insirá uma Url válida.</h3>
        </div>
      );
    }
    // Se o usuário for válido e não possuir items em sua Bag
    if (items.length === 0) {
      return (
        <div className="min-h-full text-center">
          <h3 className="text-2xl font-bold mb-4">{userName} Não possuí itens em sua BagLink!</h3>
        </div>
      );
    }
    // Exibição dos produtos de um usuário !== do currentUser
    return (
      <div className="min-h-full flex flex-col overflow-x-hidden">
        <h3 className="text-2xl font-bold mb-4 ">
          Aqui estão os produtos de {userName}
        </h3>
        
        {/* Container com overflow-y-auto para a lista de links */}
        <div className="overflow-y-auto min-w-full max-w-5xl mx-auto max-h-[60vh] mb-3">
          <LinkPreviewRow items={items} currentUser={currentUser} linkUser={idUser} />
        </div>
      </div>
    );    
  }

  // Caso o usuário seja o dono da página e não possua itens
  if (items.length === 0) {
    return (
      <div className="min-h-full flex flex-col min-h-screen">
        <h3 className="text-2xl font-bold mb-4 flex-1">
          Olá {user.user_metadata?.name.charAt(0).toUpperCase() + user.user_metadata?.name.slice(1)}, parece que você ainda não possui produtos em sua BagLink. Comece adicionando uma URL!
        </h3>
        {/* UrlInput fixo no fundo */}
        <div className="flex items-center justify-center w-full mb-[150px]">
          <div className="mx-auto w-full max-w-5xl">
            <UrlInput />
          </div>
        </div>
      </div>
    );
  }

  // Renderiza a lista de produtos do currentUser
  return (
    <div className="flex flex-col min-h-screen">
      {/* Título no topo */}
      <h3 className="text-2xl font-bold mb-4 w-full max-w-5xl mx-auto">
        {user.user_metadata?.name.charAt(0).toUpperCase() + user.user_metadata?.name.slice(1)} aqui estão seus produtos!
      </h3>
      
      {/* Container flexível com rolagem na lista */}
      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto max-h-[70vh]">
        <LinkPreviewRow items={items} currentUser={currentUser} linkUser={idUser} />
      </div>
  
      {/* UrlInput no final da página */}
      <div className="mt-auto w-full">
        <div className="mx-auto w-full max-w-5xl mb-[150px]">
          <UrlInput />
        </div>
      </div>
    </div>
  );
}