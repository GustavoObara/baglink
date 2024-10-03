'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface FinishToggleProps {
  itemId: number;
  userId: string;  // O ID do usuário que criou o item
  initialFinish: boolean;
}

const FinishToggle: React.FC<FinishToggleProps> = ({ itemId, currentUser, linkUser, initialFinish, onToggle }) => {
  const [finish, setFinish] = useState(initialFinish);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleToggleFinish = async () => {
    if (currentUser !== linkUser) {
      console.error("Apenas o proprietário pode alterar este item.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('items')
        .update({ finish: !finish })
        .eq('id', itemId)
        .eq('id_user', currentUser);  

      if (error) {
        throw error;
      }


      setFinish(!finish);
      if (onToggle) onToggle();

    } catch (error) {
      console.error('Erro ao atualizar o estado de finish:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="checkbox"
        checked={finish}
        onChange={handleToggleFinish}
        disabled={loading || currentUser !== linkUser} // Desabilita se o usuário não for o dono
        className="form-checkbox h-5 w-5 text-blue-600"
      />
      {/* {loading && <span>Atualizando...</span>} */}
    </div>
  );
};

export default FinishToggle;
