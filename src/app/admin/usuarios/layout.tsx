import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Usuarios | EmprendyUp Store',
  description: 'Administra y gestiona los usuarios de la plataforma',
};

export default function UsuariosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
