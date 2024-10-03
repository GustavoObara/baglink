import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';

export default async function ItemsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if(user) {
    return redirect("i/" + user.id);
  }

  return (
    <div>
      {!user ? (
        <h1>Você não está autenticado. Por favor, faça login.</h1>
      ) : (
        <h1>Redirecionando...</h1>
      )}
    </div>
  );
}
