export interface Menu{
    codigo: number;
    nombre: string;
    icono?: string;
    enlace?: string;
    submenu?: Submenu[];
}

export interface Submenu{
    nombre: string;
    icono?: string;
    enlace?: string;
}