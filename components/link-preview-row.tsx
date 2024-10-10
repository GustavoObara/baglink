'use client';

import { useEffect, useState } from 'react';
import FinishToggle from './finish-toggle';
import DeleteItemButton from './delete-button';
import CopyItemButton from './copy-button';
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface Item {
    id: number;
    id_user: string;
    url: string;
    created_at: string;
    finish: boolean;
    username: string;
}

interface PreviewData {
    image: string;
    price: string;
    title: string;
    site: string;
    url: string;
}


const LinkPreviewRow = ({ items, username, currentUser, linkUser }: { items: Item[]; currentUser: string; linkUser: string; username: string;}) => {
    const [previewData, setPreviewData] = useState<PreviewData[]>([]);
    const [loading, setLoading] = useState(true);
    const [itemStates, setItemStates] = useState(items.map(item => item.finish));

    // Função responsável por buscar os dados de preview do backend
    const fetchPreviewData = async (url: string) => {
        try {
            const response = await fetch('http://localhost:5000/link-preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });
                const data = await response.json();
                return data;
        } catch (error) {
            console.error(`Failed to fetch preview for ${url}`, error);
            return { image: '', price: '', title: 'Erro ao carregar', site: '', url: '' };
        }
    };

    useEffect(() => {
        const fetchAllPreviews = async () => {
            const previews = await Promise.all(items.map(item => fetchPreviewData(item.url)));
            setPreviewData(previews);
            setLoading(false);
        };
        fetchAllPreviews();
    }, [items]);

    if (loading) { 
        return (
            <div className="flex flex-col space-y-4 mt-3 mx-3">
                {items.map((_, index) => (
                    <div key={index} className="flex">
                        <div className="flex items-center mx-3">
                            <Skeleton className="h-6 w-6 rounded" /> {/* Placeholder for the FinishToggle */}
                        </div>

                        <div className="flex p-4 border border-gray-300 w-full rounded-lg shadow-lg">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="w-32 h-32 rounded-lg" /> {/* Placeholder for the image */}
                            </div>

                            <div className="flex-1 ml-4 space-y-2">
                                <Skeleton className="h-5 w-[200px]" /> {/* Placeholder for the title */}
                                <Skeleton className="h-6 w-[125px]" /> {/* Placeholder for the price */}
                                <Skeleton className="h-3 w-[150px]" /> {/* Placeholder for the site */}
                                <Skeleton className="h-4 w-[700px]" /> {/* Placeholder for the URL */}
                            </div>

                            <div className="flex items-start mx-3">
                                <Skeleton className="h-6 w-6 rounded" /> {/* Placeholder for the DeleteItemButton */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const handleFinishToggle = (index: any) => {
        const updatedFinish = !itemStates[index];
        const newStates = [...itemStates];
        newStates[index] = updatedFinish;
        setItemStates(newStates);
    };

    return (
        <div className="flex flex-col space-y-4 mt-3 mx-3">
            {previewData.map((preview, index) => (
                <div key={items[index].id} className="flex">
                    <div className="flex items-center mx-3">
                        {currentUser === linkUser && (
                            <FinishToggle 
                                id={items[index].id} 
                                currentUser={currentUser} 
                                linkUser={linkUser} 
                                initialFinish={items[index].finish} 
                                onToggle={() => handleFinishToggle(index)}
                            />
                        )}
                    </div>

                    <div className={`flex p-4 border border-gray-300 rounded-lg shadow-lg w-full ${itemStates[index] ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <div className="flex items-center space-x-4">
                            <img src={preview.image} className="max-w-32 object-cover" />
                        </div>
                        <div className="flex-1 ml-4">
                            <h3 className="text-lg font-semibold">{preview.title}</h3>
                            <h2 className="text-xl text-green-600 font-bold">
                                {isNaN(Number(preview.price.replace(',', '.')))
                                    ? preview.price
                                    : `R$ ${Number(preview.price.replace(',', '.')).toFixed(2).replace('.', ',')}`}
                            </h2>
                            <h6 className="text-sm text-gray-500">{preview.site}</h6>
                            <a href={preview.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                                {preview.url}
                            </a>
                        </div>
                        <div className="flex items-start mx-3">
                            {currentUser === linkUser && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <DeleteItemButton 
                                                id={items[index].id}
                                                currentUser={currentUser} 
                                                linkUser={linkUser}                                               
                                            >
                                            </DeleteItemButton>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                        <p>Deletar produto</p>
                                        {/* TODO Alert Dialog para confirmação da exclusão */}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            {currentUser !== linkUser && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <CopyItemButton 
                                                url={preview.url}
                                                currentUserId={currentUser} 
                                                username={username}
                                            >
                                            </CopyItemButton>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                        <p>Copiar produto para sua Baglink</p>
                                        {/* TODO realizar um mini aviso ao copiar um item */}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LinkPreviewRow;