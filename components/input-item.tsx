'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const UrlInput: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (user && !error) {
        setUserId(user.id);
        setUsername(user.user_metadata.username);
      } else {
        setError('Erro ao obter o ID do usuário.');
      }
    };

    fetchUser();
  }, [supabase]);

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError('Por favor, insira uma URL válida.');
      return;
    }

    if (!userId) {
      setError('Usuário não autenticado.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const { data, error } = await supabase
        .from('items')
        .insert([{ 
          id_user: userId,  
          username,
          url,               
          finish: false     
        }]);

      if (error) {
        throw error;
      }

      setUrl('');
      setSuccess('URL enviada com sucesso!');

      setTimeout(() => {
        window.location.reload(); 
      }, 1000);

    } catch (error) {
      setError('Ocorreu um erro ao enviar a URL.');
      console.error('Erro ao enviar a URL:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-4">
      <div className="flex items-center border border-gray-300 rounded-full shadow-lg">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Digite a URL..."
          className="flex-1 p-2 px-5 outline-none rounded-full"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
      {/* {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>} */}
    </div>
  );
};

export default UrlInput;
