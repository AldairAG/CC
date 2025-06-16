import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { QuinielaType } from "../../types/QuinielaType";

interface QuinielaState {
    quiniela: QuinielaType | null;
    quinielas: QuinielaType[];
    quinielasFiltradas?: QuinielaType[];
}

interface DateRangeFilter {
    startDate: string;
    endDate: string;
}

interface PriceRangeFilter {
    min: number;
    max: number;
}

const initialState: QuinielaState = {
    quiniela: null,
    quinielas: [],
    quinielasFiltradas: []
};

const quinielaSlice = createSlice({
    name: "quiniela",
    initialState,
    reducers: {
        setQuiniela: (state, action) => {
            state.quiniela = action.payload;
        },
        setQuinielas: (state, action) => {
            state.quinielas = action.payload;
        },
        setQuinielasFiltradas: (state, action) => {
            state.quinielasFiltradas = action.payload;
        },
        clearQuiniela: (state) => {
            state.quiniela = null;
        },
        filtrarQuinielasPorNombre: (state, action: PayloadAction<string>) => {
            const criterio = action.payload.toLowerCase();
            if (criterio === '') {
                state.quinielasFiltradas = state.quinielas;
            } else {
                state.quinielasFiltradas = state.quinielas.filter(
                    quiniela => quiniela.nombreQuiniela.toLowerCase().includes(criterio)
                );
            }
        },
        filtrarQuinielasPorFecha: (state, action: PayloadAction<DateRangeFilter>) => {
            const { startDate, endDate } = action.payload;
            state.quinielasFiltradas = state.quinielas.filter(quiniela => {
                const fechaInicio = new Date(quiniela.fechaInicio);
                return fechaInicio >= new Date(startDate) && 
                       fechaInicio <= new Date(endDate);
            });
        },
        filtrarQuinielasPorPrecio: (state, action: PayloadAction<PriceRangeFilter>) => {
            const { min, max } = action.payload;
            state.quinielasFiltradas = state.quinielas.filter(quiniela => 
                quiniela.precioParticipacion >= min && 
                quiniela.precioParticipacion <= max
            );
        },
        filtrarQuinielasPorEstado: (state, action: PayloadAction<string>) => {
            const estado = action.payload.toLowerCase();
            if (estado === '') {
                state.quinielasFiltradas = state.quinielas;
            } else {
                state.quinielasFiltradas = state.quinielas.filter(
                    quiniela => quiniela.estado.toLowerCase() === estado
                );
            }
        },
        filtrarQuinielasPorTipoPremio: (state, action: PayloadAction<string>) => {
            const tipoPremio = action.payload.toLowerCase();
            if (tipoPremio === '') {
                state.quinielasFiltradas = state.quinielas;
            } else {
                state.quinielasFiltradas = state.quinielas.filter(
                    quiniela => quiniela.tipoPremio.toLowerCase() === tipoPremio
                );
            }
        },
        filtrarQuinielasPorParticipantes: (state, action: PayloadAction<number>) => {
            const minParticipantes = action.payload;
            state.quinielasFiltradas = state.quinielas.filter(
                quiniela => quiniela.numeroParticipantes >= minParticipantes
            );
        },
        filtrarQuinielasPorPremioAcumulado: (state, action: PayloadAction<PriceRangeFilter>) => {
            const { min, max } = action.payload;
            state.quinielasFiltradas = state.quinielas.filter(
                quiniela => quiniela.premioAcumulado >= min && 
                           quiniela.premioAcumulado <= max
            );
        },
        filtrarQuinielasPorTipoApuesta: (state, action: PayloadAction<string>) => {
            const tipoApuesta = action.payload.toLowerCase();
            if (tipoApuesta === '') {
                state.quinielasFiltradas = state.quinielas;
            } else {
                state.quinielasFiltradas = state.quinielas.filter(
                    quiniela => quiniela.tiposApuestas.some(
                        tipo => tipo.toLowerCase().includes(tipoApuesta)
                    )
                );
            }
        },
        aplicarFiltrosMultiples: (state, action: PayloadAction<{
            nombre?: string;
            fechas?: DateRangeFilter;
            precio?: PriceRangeFilter;
            estado?: string;
            tipoPremio?: string;
            minParticipantes?: number;
            premioAcumulado?: PriceRangeFilter;
            tipoApuesta?: string;
        }>) => {
            let quinielasFiltradas = [...state.quinielas];
            const filtros = action.payload;

            if (filtros.nombre) {
                quinielasFiltradas = quinielasFiltradas.filter(
                    quiniela => quiniela.nombreQuiniela.toLowerCase().includes(filtros.nombre!.toLowerCase())
                );
            }

            if (filtros.fechas) {
                quinielasFiltradas = quinielasFiltradas.filter(quiniela => {
                    const fechaInicio = new Date(quiniela.fechaInicio);
                    return fechaInicio >= new Date(filtros.fechas!.startDate) && 
                           fechaInicio <= new Date(filtros.fechas!.endDate);
                });
            }

            if (filtros.precio) {
                quinielasFiltradas = quinielasFiltradas.filter(
                    quiniela => quiniela.precioParticipacion >= filtros.precio!.min && 
                               quiniela.precioParticipacion <= filtros.precio!.max
                );
            }

            if (filtros.estado) {
                quinielasFiltradas = quinielasFiltradas.filter(
                    quiniela => quiniela.estado.toLowerCase() === filtros.estado!.toLowerCase()
                );
            }

            state.quinielasFiltradas = quinielasFiltradas;
        },
        limpiarFiltros: (state) => {
            state.quinielasFiltradas = state.quinielas;
        }
    }
});

export const {
    setQuiniela,
    setQuinielas,
    setQuinielasFiltradas,
    clearQuiniela,
    filtrarQuinielasPorNombre,
    filtrarQuinielasPorFecha,
    filtrarQuinielasPorPrecio,
    filtrarQuinielasPorEstado,
    filtrarQuinielasPorTipoPremio,
    filtrarQuinielasPorParticipantes,
    filtrarQuinielasPorPremioAcumulado,
    filtrarQuinielasPorTipoApuesta,
    aplicarFiltrosMultiples,
    limpiarFiltros
} = quinielaSlice.actions;

export const quinielaSelector = {
    quiniela: (state: { quiniela: QuinielaState }) => state.quiniela.quiniela,
    quinielas: (state: { quiniela: QuinielaState }) => state.quiniela.quinielas,
    quinielasFiltradas: (state: { quiniela: QuinielaState }) => state.quiniela.quinielasFiltradas
};

export default quinielaSlice.reducer;