export interface Position {
    id: string;
    positionResourceId: string;
    displayOrder?: number;
    toolLanguages: ToolLanguage[];
}

export interface ToolLanguage {
    id: string;
    toolLanguageResourceId: string;
    displayOrder: number;
    from: number;
    to: number;
    description?: string;
    images?: Image[];
}

export interface Image {
    id: string;
    cdnUrl?: string;
    displayOrder: number;
}

export interface Employee {
    id: string;
    name: string;
    positions: Position[];
}