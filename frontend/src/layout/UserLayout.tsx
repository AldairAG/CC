import { Route, Switch, useHistory } from "react-router-dom";
import { USER_ROUTES } from "../constants/ROUTERS";
import EventoDetails from "../pages/user/EventoDetails";
import QuinielaList from "../pages/user/QuinielaList";
import QuinielaArmar from "../pages/user/QuinielaArmar";
import Dashboard from "../pages/user/Dashboard";
//import Carrito from "../pages/UserPages/Carrito";
//import DepositarForm from "../components/forms/DepositarForm";
//import CreateWallet from "../components/forms/CreateWallet";
//import UserProfile from '../pages/UserPages/UserProfile';

const UserLayout = () => {
    const navigate=useHistory();

    const handleNavigate = (ruta: string) => {
        navigate.push(ruta);
    };

    return (
        <main>
            <header className="w-full flex flex-col bg-gray-100 shadow-md">
                <div className="h-25 flex px-4 items-center justify-between">
                    <h1 className="text-5xl text-red-600">CasiNova</h1>
                    <div className='flex gap-4 '>
                       {/*  <BotonCarrito />
                        <Avatar /> */}
                    </div>
                </div>
                <div className="flex bg-gray-300 items-center justify-center">
                    {/* <span className="px-6 py-3 font-semibold py border-b-2 border-red-600">Deportes</span> */}
                    <span onClick={()=>handleNavigate(USER_ROUTES.HOME) } className="px-6 py-3 font-semibold py">Casino</span>
                    <span onClick={()=>handleNavigate(USER_ROUTES.QUINIELAS_LIST) } className="px-6 py-3 font-semibold py ">Quinielas</span>
                </div>

            </header>

            <div className="flex justify-center">
                <Switch>
                    {/* <Route path={USER_ROUTES.USER_PROFILE} component={UserProfile} />
                    <Route path={USER_ROUTES.QUINIELAS_LIST} component={Quinielas} />*/}
                    <Route path={USER_ROUTES.QUINIELA} component={QuinielaArmar} /> 
                    <Route path={USER_ROUTES.HOME} component={Dashboard} /> 
                    <Route path={USER_ROUTES.QUINIELAS_LIST} component={QuinielaList} />
                </Switch>
            </div>
        </main>
    )
}
export default UserLayout;