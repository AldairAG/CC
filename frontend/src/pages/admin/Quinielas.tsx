import { PlusIcon } from "@heroicons/react/24/outline";
import { Card } from "../../components/cards/Card";
import { Link } from "react-router-dom";
import { ADMIN_ROUTES } from "../../constants/ROUTERS";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../../components/menu/DropdownMenu";
import { useEffect, useState } from "react";
import type { QuinielaType } from "../../types/QuinielaType";

const Quinielas = () => {
    const [quinielas, setQuinielas] = useState<QuinielaType[]>([]);
    const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed'>('active');

    // Aquí deberías hacer la petición para obtener las quinielas
    useEffect(() => {
        // Ejemplo de datos de prueba
        const mockQuinielas: QuinielaType[] = [
            {
                idQuiniela: 1,
                nombreQuiniela: "Liga MX 2025",
                premioAcumulado: 5000,
                numeroParticipantes: 25,
                fechaInicio: "2025-07-01",
                fechaFin: "2025-12-15",
                precioParticipacion: 200,
                estado: "active",
                strDescripcion: "Quiniela del torneo Apertura Liga MX",
                urlBanner: "/images/banner1.jpg",
                allowDoubleBets: true,
                allowTripleBets: false,
                tipoPremio: "monetario",
                tiposApuestas: ["1x2", "resultado exacto"],
                eventos: ["match1", "match2"]
            },
            {
                idQuiniela: 2,
                nombreQuiniela: "Champions League 2025",
                premioAcumulado: 10000,
                numeroParticipantes: 50,
                fechaInicio: "2025-09-15",
                fechaFin: "2026-05-30",
                precioParticipacion: 300,
                estado: "upcoming",
                strDescripcion: "Quiniela de la Champions League 2025-2026",
                urlBanner: "/images/banner2.jpg",
                allowDoubleBets: true,
                allowTripleBets: true,
                tipoPremio: "monetario",
                tiposApuestas: ["1x2"],
                eventos: ["match1", "match2"]
            }
        ];
        
        setQuinielas(mockQuinielas);
    }, []);

    const filteredQuinielas = quinielas.filter(quiniela => {
        if (activeTab === 'active') return quiniela.estado === 'active';
        if (activeTab === 'upcoming') return quiniela.estado === 'upcoming';
        return quiniela.estado === 'completed';
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    return (
        <main className="w-full h-full max-w-[1600px] p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="">
                    <h1 className="text-2xl font-bold">Quinielas</h1>
                    <p className="text-muted-foreground">Aquí puedes gestionar las quinielas.</p>
                </div>

                <Link to={ADMIN_ROUTES.ADMIN_CREATE_QUINIELA}
                    className="flex bg-blue-500 text-white rounded-md px-4 py-2 items-center gap-2 hover:bg-blue-500 transition duration-200 ease-in-out">
                    <PlusIcon className="h-6 w-6 text-gray-50" />
                    <span>Nueva Quiniela</span>
                </Link>
            </div>

            <Card className="flex text-center p-1 mb-4">
                <h2 
                    onClick={() => setActiveTab('active')}
                    className={`text-base font-bold text-gray-500 rounded-sm w-full py-1 px-2 cursor-pointer ${activeTab === 'active' ? 'bg-gray-100' : ''}`}>
                    Quinielas Activas
                </h2>
                <h2 
                    onClick={() => setActiveTab('upcoming')}
                    className={`text-base font-bold text-gray-500 rounded-sm w-full py-1 px-2 cursor-pointer ${activeTab === 'upcoming' ? 'bg-gray-100' : ''}`}>
                    Quinielas Próximas
                </h2>
                <h2 
                    onClick={() => setActiveTab('completed')}
                    className={`text-base font-bold text-gray-500 rounded-sm w-full py-1 px-2 cursor-pointer ${activeTab === 'completed' ? 'bg-gray-100' : ''}`}>
                    Quinielas Completadas
                </h2>
            </Card>

            <Card className="p-0">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-3 px-4 text-left">Nombre</th>
                            <th className="py-3 px-4 text-left">Estado</th>
                            <th className="py-3 px-4 text-left">Participantes</th>
                            <th className="py-3 px-4 text-left">Pozo Total</th>
                            <th className="py-3 px-4 text-left">Fechas</th>
                            <th className="py-3 px-4 text-right">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredQuinielas.map((quiniela) => (
                            <tr key={quiniela.idQuiniela} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                                <td className="px-4 py-3 ">
                                    <span className="font-medium">{quiniela.nombreQuiniela}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span>
                                        {quiniela.estado === "active"
                                            ? "Activa"
                                            : quiniela.estado === "upcoming"
                                                ? "Próxima"
                                                : "Completada"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{quiniela.numeroParticipantes}</td>
                                <td className="px-4 py-3">{formatCurrency(quiniela.premioAcumulado)}</td>
                                <td className="px-4 py-3">
                                    <span className="text-sm">
                                        {quiniela.fechaInicio} - {quiniela.fechaFin}
                                    </span>
                                </td>
                                <td className="text-right px-4">
                                    <DropdownMenu>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem variant="titulo">Acciones</DropdownMenuItem>
                                            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                            <DropdownMenuItem>Ver participantes</DropdownMenuItem>
                                            {quiniela.estado !== "completed" && (
                                                <>
                                                    <DropdownMenuItem>Editar quiniela</DropdownMenuItem>
                                                    {quiniela.estado === "active" && (
                                                        <DropdownMenuItem className="text-amber-600">Finalizar quiniela</DropdownMenuItem>
                                                    )}
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                        {filteredQuinielas.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                    No hay quinielas {activeTab === 'active' ? 'activas' : activeTab === 'upcoming' ? 'próximas' : 'completadas'} disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>
        </main>
    );
}

export default Quinielas;