// PROJECT IMPORT
import companyHome from './companyHome';
import dashboard from './dashboard';
import maintenance from './maintenance';
import adminCenter from './adminCenter';
import purchaseOrder from './purchaseOrder';
import shipment from './shipment';
import report from './report';
import documentation from './documentation';
import NonPoShipment from './nonPoShipment';

const menuItems = {
	items: [dashboard, purchaseOrder, shipment, NonPoShipment, report, adminCenter, documentation],
};

export default menuItems;
