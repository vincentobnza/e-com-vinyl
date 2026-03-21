


type Album = {
    id: string;
    title: string;
    artist: string;
    price: number;
    stock: number;
    image: string;
    description: string;
    tracks: number | string[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}


export type { Album };