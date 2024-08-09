import { useRoutes } from 'react-router-dom';

// PROJECT IMPORT
import LoginRoutes from './LoginRoutes';
import AdminCenter from './AdminCenter';
import PurchaseOrders from './PurchaseOrders';
import CompanyHome from './CompanyHome';
import Dashboard from './Dashboard';
import Shipment from './Shipments';
import Report from './Reports';
import nonPoShipments from './NonPoShipments';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
	return useRoutes([LoginRoutes, CompanyHome, AdminCenter, Dashboard, PurchaseOrders, Shipment, Report, nonPoShipments]);
}
