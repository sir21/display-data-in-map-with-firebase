export interface Wish {
    id: string;
    name: string;
    city: string;
    userWish: string;
    image: ImageFile;
    created: number;
}

export interface ImageFile {
    url: string;
    name: string;
}

export interface Location {
    name: string;
    x: number;
    y: number;
    x3: number;
    y3: number;
    district?: string;
}

export interface Place {
    loc: Location;
    wishes: string[];
}

export interface DisplayPlace {
    name: string;
    x: string;
    y: string;
    wishes: string[];
    tooltip: string;
    height: string;
}
