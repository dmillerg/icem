import { Usuario } from "./usuario";

export interface Login {
  message: string,
  status: number,
  usuario: Usuario[],
  token: string,
}
