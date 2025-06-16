import { useDispatch, useSelector } from "react-redux";
import { quinielaService } from "../service/casino/quinielaService";
import type { QuinielaType } from "../types/QuinielaType";
import { quinielaSelector } from "../store/slices/quinielaSlice";

export const useQuiniela = () => {
    const dispatch = useDispatch();
    const quiniela = useSelector(quinielaSelector.quiniela);
    const quinielaList = useSelector(quinielaSelector.quinielas);

    const setQuiniela = (quiniela: QuinielaType) => {
        dispatch({ type: 'quiniela/setQuiniela', payload: quiniela });
    }
    const setQuinielaList = (quinielaList: QuinielaType[]) => {
        dispatch({ type: 'quiniela/setQuinielasList', payload: quinielaList });
    }

    const createQuiniela = async (quiniela: QuinielaType) => {
        try {
            const result = await quinielaService.createQuinielaService(quiniela);
            return result;
        } catch (error) {
            console.error("Error en el servicio de creación de quiniela:", error);
            throw error;
        }
    }

    const getQuinielaList = async () => {
        try {
            const result = await quinielaService.getQuinielaService();
            console.log("result", result.data);
            setQuinielaList(result?.data||[]);
        } catch (error) {
            console.error("Error en el servicio de obtención de quinielas:", error);
            throw error;
        }
    }

    const getQuinielaById = async (id: number) => {
        try {
            const result = await quinielaService.getQuinielaByIdService(id);
            setQuiniela(result.data);
        } catch (error) {
            console.error("Error en el servicio de obtención de quiniela por ID:", error);
            throw error;
        }
    }

    return {
        quiniela,
        quinielaList,
        createQuiniela,
        getQuinielaList,
        getQuinielaById,
    }
}
