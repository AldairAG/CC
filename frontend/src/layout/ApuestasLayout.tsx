import { Route, Switch } from "react-router-dom";
import { USER_ROUTES } from "../constants/ROUTERS";
import ApuestaDetailsPage from "../pages/user/apuestas/ApuestaDetailsPage";
import ApuestasPorDeportePage from "../pages/user/apuestas/ApuestasPorDeportePage";
import ApuestasDeportivasPage from "../pages/user/apuestas/ApuestasDeportivasPage";

const ApuestasLayout = () => {

    return (
        <main className="min-h-screen bg-casino-gradient">
            
            <div className="flex min-h-screen bg-casino-gradient">
                
                {/* Contenido principal */}
                <div className="flex-1 flex justify-center px-4 lg:px-0 pt-4 lg:pt-0">
                    <div className="w-full max-w-6xl">
                        <Switch>
                            {/* Rutas específicas de apuestas */}
                            <Route path={USER_ROUTES.APUESTAS_DETAIL} component={ApuestaDetailsPage} />
                            <Route path={USER_ROUTES.APUESTAS_POR_DEPORTE} component={ApuestasPorDeportePage} />
                            <Route path={USER_ROUTES.APUESTAS_DEPORTIVAS} component={ApuestasDeportivasPage} />
                        </Switch>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ApuestasLayout;
