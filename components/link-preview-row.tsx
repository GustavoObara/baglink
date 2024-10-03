'use client';

import { useEffect, useState } from 'react';
import FinishToggle from './finish-toggle';

interface Item {
    id: number;
    url: string;
    finish: boolean;
}

interface PreviewData {
    image: string;
    price: string;
    title: string;
    site: string;
    url: string;
}


const LinkPreviewRow = ({ items, currentUser, linkUser }: { items: Item[]; currentUser: string; linkUser: string}) => {
    const [previewData, setPreviewData] = useState<PreviewData[]>([]);
    const [loading, setLoading] = useState(true);
    const [itemStates, setItemStates] = useState(items.map(item => item.finish));
    // Esse console log é importante no futuro caso algum erro apareça
    // console.log('teste', currentUser, linkUser);

    // Faz a requisição para o backend para obter os dados do link preview
    const fetchPreviewData = async (url: string) => {
    const response = await fetch('http://localhost:5000/link-preview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });
        const data = await response.json();
        return data;
    };

    useEffect(() => {
        const fetchAllPreviews = async () => {
            const previews = await Promise.all(items.map(item => fetchPreviewData(item.url)));
            setPreviewData(previews);
            setLoading(false);
        };

        fetchAllPreviews();
    }, [items]);

    if (loading) { return <div>Carregando...</div>; }

    const handleFinishToggle = (index) => {
        // Inverte o estado do finish
        const updatedFinish = !itemStates[index];
        const newStates = [...itemStates];
        newStates[index] = updatedFinish;

        setItemStates(newStates); // Atualiza o estado
    };

    return (
        <div className="flex flex-col space-y-4 mt-3">
            {previewData.map((preview, index) => (
                <div key={items[index].id} className="flex">
                    <div className="flex items-center mx-3">
                        {/* Componente de Controle de Finish */}
                        <FinishToggle 
                            itemId={items[index].id} 
                            currentUser={currentUser} 
                            linkUser={linkUser} 
                            initialFinish={items[index].finish} 
                            onToggle={() => handleFinishToggle(index)}
                        />
                    </div>

                    <div className={`flex p-4 border border-gray-300 rounded-lg shadow-lg min-w-full ${itemStates[index] ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <div className="flex items-center space-x-4">
                            <img src={preview.image} alt={preview.title} className="max-w-32 object-cover" />
                        </div>
                        <div className="flex-1 ml-4">
                            <h3 className="text-lg font-semibold">{preview.title}</h3>
                            <h2 className="text-xl text-green-600 font-bold">R$ {preview.price}</h2>
                            <h6 className="text-sm text-gray-500">{preview.site}</h6>
                            <a href={preview.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                            {preview.url}
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LinkPreviewRow;