import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useQuiniela } from '../../hooks/useQuiniela';
import { TipoQuiniela, TipoDistribucion, EstadoQuiniela } from '../../types/QuinielaType';
import type { QuinielaResumenType } from '../../types/QuinielaType';
import QuinielaCard from './QuinielaCard';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AdvancedSearchFormValues {
    busqueda: string;
    tipoQuiniela: string;
    tipoDistribucion: string;
    estado: string;
    costoMin: string;
    costoMax: string;
    poolMin: string;
    poolMax: string;
    fechaInicioDesde: string;
    fechaInicioHasta: string;
    fechaCierreDesde: string;
    fechaCierreHasta: string;
    soloPublicas: boolean;
    soloActivas: boolean;
    conEspaciosDisponibles: boolean;
    ordenarPor: 'fechaCreacion' | 'fechaInicio' | 'fechaCierre' | 'poolActual' | 'participantes' | 'nombre';
    ordenDireccion: 'asc' | 'desc';
}

// Schema de validación
const validationSchema = Yup.object({
    busqueda: Yup.string().max(100, 'Máximo 100 caracteres'),
    costoMin: Yup.number().min(0, 'No puede ser negativo'),
    costoMax: Yup.number().min(0, 'No puede ser negativo').when('costoMin', (costoMin, schema) => {
        return Array.isArray(costoMin) && costoMin[0] ? schema.min(costoMin[0], 'Debe ser mayor al mínimo') : schema;
    }),
    poolMin: Yup.number().min(0, 'No puede ser negativo'),
    poolMax: Yup.number().min(0, 'No puede ser negativo').when('poolMin', (poolMin, schema) => {
        return Array.isArray(poolMin) && poolMin[0] ? schema.min(poolMin[0], 'Debe ser mayor al mínimo') : schema;
    }),
    fechaInicioDesde: Yup.date(),
    fechaInicioHasta: Yup.date().when('fechaInicioDesde', (fechaInicioDesde, schema) => {
        return fechaInicioDesde ? schema.min(fechaInicioDesde, 'Debe ser posterior a la fecha desde') : schema;
    }),
    fechaCierreDesde: Yup.date(),
    fechaCierreHasta: Yup.date().when('fechaCierreDesde', (fechaCierreDesde, schema) => {
        return fechaCierreDesde ? schema.min(fechaCierreDesde, 'Debe ser posterior a la fecha desde') : schema;
    })
});

const AdvancedQuinielaSearch: React.FC = () => {
    const {
        searchQuinielas,
        getQuinielasPorTipo,
        navigateToCreateQuiniela
    } = useQuiniela();

    const [searchResults, setSearchResults] = useState<QuinielaResumenType[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const initialValues: AdvancedSearchFormValues = {
        busqueda: '',
        tipoQuiniela: '',
        tipoDistribucion: '',
        estado: '',
        costoMin: '',
        costoMax: '',
        poolMin: '',
        poolMax: '',
        fechaInicioDesde: '',
        fechaInicioHasta: '',
        fechaCierreDesde: '',
        fechaCierreHasta: '',
        soloPublicas: true,
        soloActivas: false,
        conEspaciosDisponibles: false,
        ordenarPor: 'fechaCreacion',
        ordenDireccion: 'desc'
    };

    const handleSearch = async (values: AdvancedSearchFormValues) => {
        setIsSearching(true);
        setHasSearched(true);
        
        try {
            let results: QuinielaResumenType[] = [];

            // Realizar búsqueda básica por texto si hay términos de búsqueda
            if (values.busqueda.trim()) {
                const searchResponse = await searchQuinielas(values.busqueda.trim());
                results = searchResponse?.content || [];
            } 
            // O buscar por tipo si está especificado
            else if (values.tipoQuiniela) {
                const typeResponse = await getQuinielasPorTipo(values.tipoQuiniela);
                results = typeResponse?.content || [];
            }
            // Si no hay criterios específicos, usar una búsqueda general
            else {
                const generalResponse = await searchQuinielas('');
                results = generalResponse?.content || [];
            }

            // Aplicar filtros del lado del cliente
            const filteredResults = applyClientFilters(results, values);

            // Ordenar resultados
            const sortedResults = sortResults(filteredResults, values.ordenarPor, values.ordenDireccion);

            setSearchResults(sortedResults);
        } catch (error) {
            console.error('Error en búsqueda avanzada:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const applyClientFilters = (results: QuinielaResumenType[], filters: AdvancedSearchFormValues): QuinielaResumenType[] => {
        return results.filter(quiniela => {
            // Filtro por tipo de distribución
            if (filters.tipoDistribucion && quiniela.tipoDistribucion !== filters.tipoDistribucion) {
                return false;
            }

            // Filtro por estado
            if (filters.estado && quiniela.estado !== filters.estado) {
                return false;
            }

            // Filtro por costo
            if (filters.costoMin && quiniela.costoParticipacion < parseFloat(filters.costoMin)) {
                return false;
            }
            if (filters.costoMax && quiniela.costoParticipacion > parseFloat(filters.costoMax)) {
                return false;
            }

            // Filtro por pool
            if (filters.poolMin && quiniela.poolActual < parseFloat(filters.poolMin)) {
                return false;
            }
            if (filters.poolMax && quiniela.poolActual > parseFloat(filters.poolMax)) {
                return false;
            }

            // Filtro por fechas de inicio
            if (filters.fechaInicioDesde) {
                const fechaInicio = new Date(quiniela.fechaInicio);
                const fechaDesde = new Date(filters.fechaInicioDesde);
                if (fechaInicio < fechaDesde) {
                    return false;
                }
            }
            if (filters.fechaInicioHasta) {
                const fechaInicio = new Date(quiniela.fechaInicio);
                const fechaHasta = new Date(filters.fechaInicioHasta);
                if (fechaInicio > fechaHasta) {
                    return false;
                }
            }

            // Filtro por fechas de cierre
            if (filters.fechaCierreDesde) {
                const fechaCierre = new Date(quiniela.fechaCierre);
                const fechaDesde = new Date(filters.fechaCierreDesde);
                if (fechaCierre < fechaDesde) {
                    return false;
                }
            }
            if (filters.fechaCierreHasta) {
                const fechaCierre = new Date(quiniela.fechaCierre);
                const fechaHasta = new Date(filters.fechaCierreHasta);
                if (fechaCierre > fechaHasta) {
                    return false;
                }
            }

            // Filtro solo públicas
            if (filters.soloPublicas && !quiniela.esPublica) {
                return false;
            }

            // Filtro solo activas
            if (filters.soloActivas && quiniela.estado !== EstadoQuiniela.ACTIVA) {
                return false;
            }

            // Filtro con espacios disponibles
            if (filters.conEspaciosDisponibles && quiniela.participantesActuales >= quiniela.maxParticipantes) {
                return false;
            }

            return true;
        });
    };

    const sortResults = (results: QuinielaResumenType[], sortBy: string, direction: string): QuinielaResumenType[] => {
        return [...results].sort((a, b) => {
            let valueA: string | number | Date;
            let valueB: string | number | Date;

            switch (sortBy) {
                case 'fechaCreacion':
                    valueA = new Date(a.fechaInicio);
                    valueB = new Date(b.fechaInicio);
                    break;
                case 'fechaInicio':
                    valueA = new Date(a.fechaInicio);
                    valueB = new Date(b.fechaInicio);
                    break;
                case 'fechaCierre':
                    valueA = new Date(a.fechaCierre);
                    valueB = new Date(b.fechaCierre);
                    break;
                case 'poolActual':
                    valueA = a.poolActual;
                    valueB = b.poolActual;
                    break;
                case 'participantes':
                    valueA = a.participantesActuales;
                    valueB = b.participantesActuales;
                    break;
                case 'nombre':
                    valueA = a.nombre.toLowerCase();
                    valueB = b.nombre.toLowerCase();
                    break;
                default:
                    valueA = a.nombre.toLowerCase();
                    valueB = b.nombre.toLowerCase();
            }

            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const clearSearch = () => {
        setSearchResults([]);
        setHasSearched(false);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Búsqueda Avanzada de Quinielas
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Encuentra exactamente la quiniela que buscas
                            </p>
                        </div>
                        <button
                            onClick={navigateToCreateQuiniela}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Crear Nueva Quiniela
                        </button>
                    </div>
                </div>

                {/* Formulario de búsqueda */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSearch}
                >
                    {({ resetForm }) => (
                        <Form className="p-6">
                            {/* Búsqueda básica */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Buscar por nombre o descripción
                                    </label>
                                    <Field
                                        name="busqueda"
                                        type="text"
                                        placeholder="Ingresa términos de búsqueda..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    <ErrorMessage name="busqueda" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        disabled={isSearching}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {isSearching && <LoadingSpinner />}
                                        <span className={isSearching ? 'ml-2' : ''}>
                                            {isSearching ? 'Buscando...' : 'Buscar'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Toggle para filtros avanzados */}
                            <div className="mb-6">
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    <svg
                                        className={`w-4 h-4 mr-2 transform transition-transform ${showFilters ? 'rotate-90' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    Filtros Avanzados
                                </button>
                            </div>

                            {/* Filtros avanzados */}
                            {showFilters && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 bg-gray-50 dark:bg-gray-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Tipo de Quiniela */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tipo de Quiniela
                                            </label>
                                            <Field
                                                as="select"
                                                name="tipoQuiniela"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            >
                                                <option value="">Todos los tipos</option>
                                                {Object.entries(TipoQuiniela).map(([key, value]) => (
                                                    <option key={key} value={value}>{value}</option>
                                                ))}
                                            </Field>
                                        </div>

                                        {/* Tipo de Distribución */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Distribución de Premios
                                            </label>
                                            <Field
                                                as="select"
                                                name="tipoDistribucion"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            >
                                                <option value="">Todas las distribuciones</option>
                                                {Object.entries(TipoDistribucion).map(([key, value]) => (
                                                    <option key={key} value={value}>{value}</option>
                                                ))}
                                            </Field>
                                        </div>

                                        {/* Estado */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Estado
                                            </label>
                                            <Field
                                                as="select"
                                                name="estado"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            >
                                                <option value="">Todos los estados</option>
                                                {Object.entries(EstadoQuiniela).map(([key, value]) => (
                                                    <option key={key} value={value}>{value}</option>
                                                ))}
                                            </Field>
                                        </div>

                                        {/* Rango de costo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Costo Mínimo
                                            </label>
                                            <Field
                                                name="costoMin"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                            <ErrorMessage name="costoMin" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Costo Máximo
                                            </label>
                                            <Field
                                                name="costoMax"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="1000.00"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                            <ErrorMessage name="costoMax" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        {/* Ordenar por */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Ordenar por
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Field
                                                    as="select"
                                                    name="ordenarPor"
                                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                >
                                                    <option value="fechaCreacion">Fecha Creación</option>
                                                    <option value="fechaInicio">Fecha Inicio</option>
                                                    <option value="fechaCierre">Fecha Cierre</option>
                                                    <option value="poolActual">Pool Acumulado</option>
                                                    <option value="participantes">Participantes</option>
                                                    <option value="nombre">Nombre</option>
                                                </Field>
                                                <Field
                                                    as="select"
                                                    name="ordenDireccion"
                                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                >
                                                    <option value="desc">Descendente</option>
                                                    <option value="asc">Ascendente</option>
                                                </Field>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkboxes */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div className="flex items-center">
                                            <Field
                                                name="soloPublicas"
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                Solo quinielas públicas
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <Field
                                                name="soloActivas"
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                Solo quinielas activas
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <Field
                                                name="conEspaciosDisponibles"
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                Con espacios disponibles
                                            </label>
                                        </div>
                                    </div>

                                    {/* Botones de filtros */}
                                    <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetForm();
                                                clearSearch();
                                            }}
                                            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Limpiar Filtros
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSearching}
                                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            Aplicar Filtros
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>

                {/* Resultados */}
                {hasSearched && (
                    <div className="px-6 pb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Resultados de Búsqueda
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {searchResults.length} quiniela{searchResults.length !== 1 ? 's' : ''} encontrada{searchResults.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {searchResults.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="mx-auto h-12 w-12 text-gray-400">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                    No se encontraron quinielas
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Intenta ajustar los criterios de búsqueda.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {searchResults.map((quiniela) => (                                <QuinielaCard
                                    key={quiniela.id}
                                    quiniela={quiniela}
                                />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvancedQuinielaSearch;
