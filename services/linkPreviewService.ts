export const fetchLinkPreview = async (url: string) => {
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