'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const UrlInput: React.FC = () => {
  const [url, setUrl] = useState('');  // Estado para armazenar a URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState<string | null>(null);  // Estado para armazenar o ID do usuário

  const supabase = createClient();

  // Obtém o ID do usuário autenticado
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (user && !error) {
        setUserId(user.id);
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

      // Enviar a URL para o Supabase junto com id_user e finish
      const { data, error } = await supabase
        .from('items')
        .insert([{ 
          id_user: userId,   // Adiciona o ID do usuário
          url,               // A URL que foi inserida
          finish: false      // O estado "finish" como false por padrão
        }]);

      if (error) {
        throw error;
      }

      // Limpa o campo de input e exibe uma mensagem de sucesso
      setUrl('');
      setSuccess('URL enviada com sucesso!');

      // Aguardar 2 segundos e recarregar a página
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
    <div className="w-full max-w-lg mx-auto mt-4">
      <div className="flex items-center border border-gray-300 rounded-lg shadow-lg p-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Digite a URL..."
          className="flex-1 p-2 outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default UrlInput;
