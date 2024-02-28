import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: 'usuarios',
        icon: 'fa-solid fa-user',
        label:'Registro de Usuarios',
        accept: ['ADMIN']
    },
    {
        routeLink: 'tipo-alimento',
        icon: 'fa-solid fa-t',
        label:'Tipo de Alimento',
        accept: ['ADMIN'] 
    },
    {
        routeLink: 'unidad-productiva',
        icon: 'fa-solid fa-u',
        label:'Unidad Productiva'
    },
    {
        routeLink: 'lote',
        icon: 'fa-solid fa-l',
        label:'Lote',
        
    },
    {
        routeLink: 'proveedor',
        icon: 'fa-solid fa-p',
        label:'Proveedor',
        
    },
    {
        routeLink: 'especies',
        icon: 'fa-solid fa-e',
        label:'Especies' 
    },
    {
        routeLink: 'inventario',
        icon: 'fa-solid fa-i',
        label:'Inventario' 
    }
    
]