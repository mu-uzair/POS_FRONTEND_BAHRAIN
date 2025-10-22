
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory,KitchenSection, GrillSection, DeliveryMetrics } from "./pages";
import Header from "./components/shared/Header";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader";

function Layout() {
    const isLoading = useLoadData();
    const location = useLocation();
    const hideHeaderRoutes = ["/auth"]; // Keep lowercase
    const {isAuth} = useSelector(state => state.user);
    
    if(isLoading) return <FullScreenLoader />

    return (
        <>
            {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}

            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path="/auth" element={isAuth ? <Navigate to = "/"/> :<Auth/>} />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                } /> {/* lowercase orders */}
                <Route path="/tables" element={
                    <ProtectedRoute>
                        <Tables />
                    </ProtectedRoute>
                } />
                <Route path="/menu" element={
                    <ProtectedRoute>
                        <Menu />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
                 /> {/* lowercase menu */}
                
                <Route
                 path="/Inventory" 
                 element={
                    <ProtectedRoute>
                        <Inventory />
                    </ProtectedRoute>
                } 
                />

                <Route
                 path="/kitchensection" 
                 element={
                    <ProtectedRoute>
                        <KitchenSection />
                    </ProtectedRoute>
                } 
                />
                <Route path="*" element={<div>Not Found</div>} />

                <Route
                 path="/grillsection" 
                 element={
                    <ProtectedRoute>
                        <GrillSection />
                    </ProtectedRoute>
                } 
                />
                <Route
                 path="/deliverymetrics" 
                 element={
                    <ProtectedRoute>
                        <DeliveryMetrics />
                    </ProtectedRoute>
                } 
                />
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
        </>
    );
}

function ProtectedRoute({ children }) {
    const { isAuth } = useSelector(state => state.user);
    if (!isAuth) {
        return <Navigate to="/auth" />
    }
    return children;

}


function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default App;