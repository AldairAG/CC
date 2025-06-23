import { useDispatch, useSelector } from "react-redux";
import QuinielaService from "../service/casino/quinielaService";
import type { QuinielaType } from "../types/QuinielaType";
import { quinielaSelector } from "../store/slices/quinielaSlice";

export const useQuiniela = () => {
  const dispatch = useDispatch();
  const quinielaList = useSelector(quinielaSelector.quinielas);
  const quinielaActual = useSelector(quinielaSelector.quinielaActual);
  const quinielasFiltradas = useSelector(quinielaSelector.quinielasFiltradas);

  // CRUD
  const crearQuiniela = async (quiniela: Omit<QuinielaType, "idQuiniela">) => {
    console.log("Creando quiniela:", quiniela);
    
    const nueva = await QuinielaService.crearQuiniela(quiniela);
    dispatch({ type: "quiniela/addQuiniela", payload: nueva });
    return nueva;
  };

  const actualizarQuiniela = async (id: number, quiniela: Partial<QuinielaType>) => {
    const actualizada = await QuinielaService.actualizarQuiniela(id, quiniela);
    dispatch({ type: "quiniela/updateQuiniela", payload: actualizada });
    return actualizada;
  };

  const eliminarQuiniela = async (id: number) => {
    await QuinielaService.eliminarQuiniela(id);
    dispatch({ type: "quiniela/removeQuiniela", payload: id });
  };

  const getQuinielaById = async (id: number) => {
    const quiniela = await QuinielaService.getQuinielaById(id);
    dispatch({ type: "quiniela/setQuinielaActual", payload: quiniela });
    return quiniela;
  };

  const getAllQuinielas = async () => {
    const quinielas = await QuinielaService.getAllQuinielas();
    dispatch({ type: "quiniela/setQuinielas", payload: quinielas });
    return quinielas;
  };

  // Filtros desde el backend
  const fetchByEstado = async (estado: string) => {
    const quinielas = await QuinielaService.getQuinielasByEstado(estado);
    dispatch({ type: "quiniela/setQuinielasFiltradas", payload: quinielas });
    return quinielas;
  };

  const fetchByFechas = async (fechaInicio: string, fechaFin: string) => {
    const quinielas = await QuinielaService.getQuinielasByFechas(fechaInicio, fechaFin);
    dispatch({ type: "quiniela/setQuinielasFiltradas", payload: quinielas });
    return quinielas;
  };

  const fetchByPrecioMaximo = async (precio: number) => {
    const quinielas = await QuinielaService.getQuinielasByPrecioMaximo(precio);
    dispatch({ type: "quiniela/setQuinielasFiltradas", payload: quinielas });
    return quinielas;
  };

  // Filtros locales (redux)
  const filterByNombre = (nombre: string) => dispatch({ type: "quiniela/filtrarQuinielasPorNombre", payload: nombre });
  const filterByEstado = (estado: string) => dispatch({ type: "quiniela/filtrarQuinielasPorEstado", payload: estado });
  const filterByTipoPremio = (tipoPremio: string) => dispatch({ type: "quiniela/filtrarQuinielasPorTipoPremio", payload: tipoPremio });
  const filterByMinParticipantes = (min: number) => dispatch({ type: "quiniela/filtrarQuinielasPorParticipantes", payload: min });
  const filterByPremioAcumulado = (min: number, max: number) =>
    dispatch({ type: "quiniela/filtrarQuinielasPorPremioAcumulado", payload: { min, max } });
  const filterByTipoApuesta = (tipo: string) => dispatch({ type: "quiniela/filtrarQuinielasPorTipoApuesta", payload: tipo });

  // Otros
  const limpiarQuinielas = () => dispatch({ type: "quiniela/clearQuinielas" });

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
