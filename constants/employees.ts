export interface Position {
    id: number;
    positionResourceId: number;
    displayOrder?: number;
    toolLanguages: ToolLanguage[];
}

export interface ToolLanguage {
    id: number;
    toolLanguageResourceId: number;
    displayOrder: number;
    from: number;
    to: number;
    description?: string;
    images?: Image[];
}

export interface Image {
    id: number;
    data?: any;
    cdnUrl?: string;
    displayOrder: number;
}