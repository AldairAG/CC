import './App.css'
import { store } from './store/store'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import { ADMIN_ROUTES, USER_ROUTES } from './constants/ROUTERS'
import UserLayoutNew from './layout/UserLayoutNew';
import AdminLayout from './layout/AdminLayout';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './hooks/useTheme';

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-dark-900' : 'bg-gray-50'} h-screen w-full overflow-auto transition-colors duration-300`}>
      <BrowserRouter>
        <Switch>
          <Route path={USER_ROUTES.USER_LAYOUT} component={UserLayoutNew} />
          <Route path={ADMIN_ROUTES.ADMIN_LAYOUT} component={AdminLayout} />
          <Route path={USER_ROUTES.LANDING_PAGE} component={LandingPage} />
        </Switch>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? "dark" : "light"}
        toastClassName={`${theme === 'dark'
            ? 'bg-dark-800 border border-primary-500'
            : 'bg-white border border-gray-200'
          }`}
      />
    </div>
  );
};

function App() {

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
