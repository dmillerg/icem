export interface Pedido {
   id: number;
   user_id: number;
   producto_id: number;
   cantidad: number;
   estado: string;
   fecha: string;
   precio_total: number;
}
