'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2 } from 'lucide-react';

interface DeleteItemButtonProps {
    id: number,
    currentUser: string, 
    linkUser: string,
}

const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({ id, currentUser, linkUser, }) => {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleDelete = async () => {
        if (currentUser !== linkUser) {
            console.error("Apenas o proprietário pode alterar este item.");
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase
                .from('items')
                .delete()
                .eq('id', id)
                .eq('id_user', currentUser);  

            if (error) {
                throw error;
            }

            setTimeout(() => {
                window.location.reload(); 
            }, 1000);

        } catch (error) {
            console.error('Erro ao atualizar o estado de finish:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={handleDelete}
            className="w-6 h-6 flex items-center border-solid border-2 border-gray-100 dark:border-gray-700 justify-center rounded"
            aria-label="Deletar item"
        >
            <Trash2 size={16}  />
        </div>
    )
}

export default DeleteItemButton;