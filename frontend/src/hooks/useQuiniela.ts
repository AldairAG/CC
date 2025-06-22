import { useDispatch, useSelector } from "react-redux";
import QuinielaService from "../service/casino/quinielaService";
import type { QuinielaType } from "../types/QuinielaType";
import {
  quinielaSelector,
  setQuinielas,
  setQuinielaActual,
  setQuinielasFiltradas,
  addQuiniela,
  updateQuiniela,
  removeQuiniela,
  filtrarQuinielasPorNombre,
  filtrarQuinielasPorEstado,
  filtrarQuinielasPorTipoPremio,
  filtrarQuinielasPorParticipantes,
  filtrarQuinielasPorPremioAcumulado,
  filtrarQuinielasPorTipoApuesta,
  clearQuinielas
} from "../store/slices/quinielaSlice";

export const useQuiniela = () => {
  const dispatch = useDispatch();
  const quinielaList = useSelector(quinielaSelector.quinielas);
  const quinielaActual = useSelector(quinielaSelector.quinielaActual);
  const quinielasFiltradas = useSelector(quinielaSelector.quinielasFiltradas);

  // CRUD
  const crearQuiniela = async (quiniela: Omit<QuinielaType, "idQuiniela">) => {
    const nueva = await QuinielaService.crearQuiniela(quiniela);
    dispatch(addQuiniela(nueva));
    return nueva;
  };

  const actualizarQuiniela = async (id: number, quiniela: Partial<QuinielaType>) => {
    const actualizada = await QuinielaService.actualizarQuiniela(id, quiniela);
    dispatch(updateQuiniela(actualizada));
    return actualizada;
  };

  const eliminarQuiniela = async (id: number) => {
    await QuinielaService.eliminarQuiniela(id);
    dispatch(removeQuiniela(id));
  };

  const getQuinielaById = async (id: number) => {
    const quiniela = await QuinielaService.getQuinielaById(id);
    dispatch(setQuinielaActual(quiniela));
    return quiniela;
  };

  const getAllQuinielas = async () => {
    const quinielas = await QuinielaService.getAllQuinielas();
    dispatch(setQuinielas(quinielas));
    return quinielas;
  };

  // Filtros desde el backend
  const fetchByEstado = async (estado: string) => {
    const quinielas = await QuinielaService.getQuinielasByEstado(estado);
    dispatch(setQuinielasFiltradas(quinielas));
    return quinielas;
  };

  const fetchByFechas = async (fechaInicio: string, fechaFin: string) => {
    const quinielas = await QuinielaService.getQuinielasByFechas(fechaInicio, fechaFin);
    dispatch(setQuinielasFiltradas(quinielas));
    return quinielas;
  };

  const fetchByPrecioMaximo = async (precio: number) => {
    const quinielas = await QuinielaService.getQuinielasByPrecioMaximo(precio);
    dispatch(setQuinielasFiltradas(quinielas));
    return quinielas;
  };

  // Filtros locales (redux)
  const filterByNombre = (nombre: string) => dispatch(filtrarQuinielasPorNombre(nombre));
  const filterByEstado = (estado: string) => dispatch(filtrarQuinielasPorEstado(estado));
  const filterByTipoPremio = (tipoPremio: string) => dispatch(filtrarQuinielasPorTipoPremio(tipoPremio));
  const filterByMinParticipantes = (min: number) => dispatch(filtrarQuinielasPorParticipantes(min));
  const filterByPremioAcumulado = (min: number, max: number) =>
    dispatch(filtrarQuinielasPorPremioAcumulado({ min, max }));
  const filterByTipoApuesta = (tipo: string) => dispatch(filtrarQuinielasPorTipoApuesta(tipo));

  // Otros
  const limpiarQuinielas = () => dispatch(clearQuinielas());

  return {
    quinielaList,
    quinielaActual,
    quinielasFiltradas,
    crearQuiniela,
    actualizarQuiniela,
    eliminarQuiniela,
    getQuinielaById,
    getAllQuinielas,
    fetchByEstado,
    fetchByFechas,
    fetchByPrecioMaximo,
    filterByNombre,
    filterByEstado,
    filterByTipoPremio,
    filterByMinParticipantes,
    filterByPremioAcumulado,
    filterByTipoApuesta,
    limpiarQuinielas
  };
};
