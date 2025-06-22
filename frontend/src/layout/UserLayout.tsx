import { Route, Switch } from "react-router-dom";
import { USER_ROUTES } from "../constants/ROUTERS";
import EventoDetails from "../pages/user/EventoDetails";
//import Quinielas from "../pages/UserPages/Quinielas";
//import QuienielaArmar from "../pages/UserPages/QuinielaArmar";
//import Carrito from "../pages/UserPages/Carrito";
//import DepositarForm from "../components/forms/DepositarForm";
//import CreateWallet from "../components/forms/CreateWallet";
//import UserProfile from '../pages/UserPages/UserProfile';

const UserLayout = () => {
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
                    <span className="px-6 py-3 font-semibold py">Casino</span>
                    <span className="px-6 py-3 font-semibold py ">Quinielas</span>
                </div>

            </header>

            <div className="flex justify-center">
                <Switch>
                    {/* <Route path={USER_ROUTES.USER_PROFILE} component={UserProfile} />
                    <Route path={USER_ROUTES.QUINIELAS_LIST} component={Quinielas} />
                    <Route path={USER_ROUTES.QUINIELA} component={QuienielaArmar} /> */}
                    <Route path={USER_ROUTES.HOME} component={EventoDetails} />
                </Switch>
            </div>
        </main>
    )
}
export default UserLayout;