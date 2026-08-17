import type { Asset, AssetCategory, AssetStatus, Assignment, MaintenanceRecord, ManagedUser, StockItem, StockTransaction, WorkspaceData } from '../api/types';

const now = new Date('2026-08-17T09:00:00.000Z');
const isoDaysAgo = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();
const dateDaysAgo = (days: number) => isoDaysAgo(days).slice(0,10);
const dateDaysFromNow = (days: number) => new Date(now.getTime() + days * 86400000).toISOString().slice(0,10);

export const SHOWCASE_USERS: ManagedUser[] = [
  { id: 1, username: 'admin', email: 'admin@nexora.io', password: 'Nexora@2026', fullName: 'Cabdiraxmaan Nuur Cali', department: 'Administration', jobTitle: 'System Administrator', role: 'ADMIN', active: true, profileImage: '/profiles/admin.webp', createdAt: isoDaysAgo(310) },
  { id: 2, username: 'assets', email: 'assets@nexora.io', password: 'Assets@2026', fullName: 'Maxamed Cabdullaahi Xasan', department: 'Operations', jobTitle: 'Asset Manager', role: 'ASSET_MANAGER', active: true, profileImage: '/profiles/assets.webp', createdAt: isoDaysAgo(280) },
  { id: 3, username: 'inventory', email: 'inventory@nexora.io', password: 'Stock@2026', fullName: 'Axmed Ibraahim Warsame', department: 'Finance', jobTitle: 'Inventory Officer', role: 'INVENTORY_OFFICER', active: true, profileImage: '/profiles/inventory.webp', createdAt: isoDaysAgo(245) },
  { id: 4, username: 'technician', email: 'technician@nexora.io', password: 'Tech@2026', fullName: 'Hodan Maxamed Nuur', department: 'IT', jobTitle: 'IT Technician', role: 'TECHNICIAN', active: true, profileImage: '/profiles/technician.webp', createdAt: isoDaysAgo(220) },
  { id: 5, username: 'auditor', email: 'auditor@nexora.io', password: 'Audit@2026', fullName: 'Fadumo Axmed Maxamed', department: 'Finance', jobTitle: 'Internal Auditor', role: 'AUDITOR', active: true, profileImage: '/profiles/auditor.webp', createdAt: isoDaysAgo(190) },
];

const assetNames: Record<AssetCategory, string[]> = {
  COMPUTERS: ['Dell OptiPlex 7010','HP EliteDesk 800 G9','Lenovo ThinkCentre M90q','Apple Mac Studio'],
  LAPTOPS: ['Dell Latitude 7440','MacBook Pro 14','HP EliteBook 840 G10','Lenovo ThinkPad X1 Carbon','Microsoft Surface Laptop 6'],
  MONITORS: ['Dell UltraSharp U2723QE','LG UltraFine 27UP850','Samsung ViewFinity S8','HP E27 G5'],
  PRINTERS: ['HP LaserJet Pro 4003dw','Canon imageRUNNER C3326i','Epson EcoTank L6490','Brother MFC-L8900CDW'],
  SERVERS: ['Dell PowerEdge R760','HPE ProLiant DL380 Gen11','Lenovo ThinkSystem SR650 V3'],
  NETWORKING_DEVICES: ['Cisco Catalyst 9300','Ubiquiti Dream Machine Pro','Fortinet FortiGate 100F','Aruba 6100 48G'],
  OFFICE_FURNITURE: ['Ergonomic Executive Chair','Height Adjustable Desk','Meeting Room Table','Mobile Pedestal Cabinet'],
};
const categories = Object.keys(assetNames) as AssetCategory[];
const locations = ['HQ · Floor 2','HQ · Floor 3','HQ · Floor 4','HQ · Server Room','Operations Center','Warehouse A','Branch Office · West','Branch Office · East'];
const departments = ['IT','Finance','Operations','Human Resources','Administration','Engineering','Sales','Customer Success'];
const vendors = ['TechSource Africa','Orbit Systems','Northstar Office','Vertex Networks','Prime Business Supplies','Cloudline Technologies'];

function createAssets(): Asset[] {
  return Array.from({ length: 84 }, (_, i) => {
    const category = categories[i % categories.length];
    const names = assetNames[category];
    const statusCycle: AssetStatus[] = ['AVAILABLE','ASSIGNED','AVAILABLE','ASSIGNED','AVAILABLE','UNDER_MAINTENANCE','AVAILABLE','ASSIGNED','RETIRED'];
    const status = statusCycle[i % statusCycle.length];
    const purchaseCostBase: Record<AssetCategory, number> = { COMPUTERS: 980, LAPTOPS: 1450, MONITORS: 520, PRINTERS: 760, SERVERS: 6900, NETWORKING_DEVICES: 1750, OFFICE_FURNITURE: 430 };
    return {
      id: i + 1,
      assetCode: `NX-${category.slice(0,3)}-${String(1001+i).padStart(4,'0')}`,
      name: names[i % names.length],
      serialNumber: `SN${2026}${String(54000+i*17)}`,
      category,
      purchaseDate: dateDaysAgo(40 + (i * 13) % 920),
      purchaseCost: purchaseCostBase[category] + (i % 7) * 85,
      warrantyExpiry: dateDaysFromNow(40 + (i * 29) % 720),
      location: locations[i % locations.length],
      department: departments[i % departments.length],
      vendor: vendors[i % vendors.length],
      condition: i % 17 === 0 ? 'FAIR' : i % 5 === 0 ? 'GOOD' : 'EXCELLENT',
      status,
      notes: i % 4 === 0 ? 'Quarterly physical verification completed. Asset tag and ownership record confirmed.' : 'Managed under the Nexora corporate asset lifecycle policy.',
      createdAt: isoDaysAgo(340 - (i % 300)),
      updatedAt: isoDaysAgo(i % 28),
      qrCodeData: `NEXORA:ASSET:NX-${category.slice(0,3)}-${String(1001+i).padStart(4,'0')}`,
    };
  });
}

const stockCatalog = [
  ['USB-C Docking Station','ACC-DOC-001','Accessories',189],['Wireless Keyboard','ACC-KBD-002','Accessories',65],['Wireless Mouse','ACC-MOU-003','Accessories',42],['Cat6 Ethernet Cable 3m','NET-CAT-004','Networking',12],['HDMI 2.1 Cable','AV-HDM-005','AV',18],['Laptop Charger 65W','PWR-CHR-006','Power',49],['Laptop Charger 100W','PWR-CHR-007','Power',78],['27\" Monitor Arm','OFF-ARM-008','Office',96],['SSD 1TB NVMe','CMP-SSD-009','Components',92],['DDR5 RAM 16GB','CMP-RAM-010','Components',74],['Toner Cartridge Black','PRN-TON-011','Printing',88],['Color Toner Set','PRN-TON-012','Printing',265],['RJ45 Connector Pack','NET-RJ4-013','Networking',24],['Patch Panel 24 Port','NET-PAT-014','Networking',115],['Surge Protector 8 Way','PWR-SUR-015','Power',39],['UPS 1500VA','PWR-UPS-016','Power',240],['Webcam 1080p','AV-WEB-017','AV',69],['USB-C Headset','AV-HDS-018','AV',58],['Portable SSD 2TB','CMP-SSD-019','Components',175],['Cleaning Kit','OPS-CLN-020','Operations',16],['Barcode Label Roll','OPS-LBL-021','Operations',22],['Thermal Label Ribbon','OPS-RIB-022','Operations',31],['Cable Organizer Kit','OFF-CBL-023','Office',15],['DisplayPort Cable','AV-DSP-024','AV',21],['SFP+ 10G Module','NET-SFP-025','Networking',118],['Wi-Fi 6 Access Point','NET-AP-026','Networking',210],['Smart Power Strip','PWR-SPS-027','Power',54],['Laptop Sleeve 14\"','ACC-SLV-028','Accessories',34],['Security Cable Lock','SEC-LCK-029','Security',29],['RFID Asset Tag Pack','SEC-RFID-030','Security',145],
] as const;

function createStock(): StockItem[] {
  return stockCatalog.map((x, i) => {
    const qty = i % 7 === 0 ? 4 + (i % 3) : 18 + ((i * 11) % 78);
    const min = 8 + (i % 5) * 3;
    return { id: i+1, itemName: x[0], sku: x[1], category: x[2], unitCost: x[3], quantity: qty, minimumStock: min, lowStock: qty <= min, location: i % 2 === 0 ? 'Warehouse A · Bin '+String.fromCharCode(65+(i%6))+(10+i) : 'IT Store · Rack '+(1+i%8), supplier: vendors[i % vendors.length], description: 'Operational inventory item tracked for replenishment and controlled issuance.', createdAt: isoDaysAgo(200-i*3), updatedAt: isoDaysAgo(i%20) };
  });
}

function createAssignments(assets: Asset[]): Assignment[] {
  const employees = ['Sarah Ibrahim','James Mwangi','Fatima Noor','Brian Otieno','Asha Mohamed','David Kimani','Maryan Abdi','Kevin Njoroge','Sofia Ahmed','Peter Kamau','Samira Yusuf','Chris Wanjala','Lilian Wambui','Ahmed Hassan','Nadia Omar'];
  const assigned = assets.filter(a => a.status === 'ASSIGNED').slice(0,22);
  const active: Assignment[] = assigned.map((a,i)=>({ id:i+1, assetId:a.id, assetCode:a.assetCode, assetName:a.name, employeeName:employees[i%employees.length], employeeId:`EMP-${String(240+i).padStart(4,'0')}`, department: departments[i%departments.length], assignmentDate: dateDaysAgo(18+(i*9)%180), expectedReturnDate: dateDaysFromNow(30+(i*7)%140), status:'ACTIVE', notes:'Issued against approved equipment request. Employee acknowledged custody.', assignedBy:'assets', createdAt:isoDaysAgo(18+(i*9)%180) }));
  const history: Assignment[] = Array.from({length:18},(_,i)=>({ id:active.length+i+1, assetId:assets[(i*3)%assets.length].id, assetCode:assets[(i*3)%assets.length].assetCode, assetName:assets[(i*3)%assets.length].name, employeeName:employees[(i+5)%employees.length], employeeId:`EMP-${String(180+i).padStart(4,'0')}`, department: departments[(i+3)%departments.length], assignmentDate:dateDaysAgo(300-i*8), returnDate:dateDaysAgo(210-i*7), status:'RETURNED', notes:'Returned, inspected and cleared for reallocation.', assignedBy:'assets', createdAt:isoDaysAgo(300-i*8) }));
  return [...active,...history];
}

function createMaintenance(assets: Asset[]): MaintenanceRecord[] {
  const titles = ['Preventive maintenance','Battery health service','Display replacement','Printer roller service','Firmware and security update','Network module diagnostics','Cooling system service','Power supply replacement'];
  const techs = ['Michael Chen','TechSource Field Team','Vertex Networks Support','Orbit Systems Service Desk'];
  return Array.from({length:26},(_,i)=>{
    const a = assets[(i*5+2)%assets.length];
    const statuses: MaintenanceRecord['status'][] = ['SCHEDULED','IN_PROGRESS','COMPLETED','COMPLETED','COMPLETED','CANCELLED'];
    const status = statuses[i%statuses.length];
    return { id:i+1, assetId:a.id, assetCode:a.assetCode, assetName:a.name, title:titles[i%titles.length], description:'Service ticket created from asset lifecycle review. Work includes inspection, diagnostics, parts verification and post-service validation.', scheduleDate: status==='COMPLETED' ? dateDaysAgo(10+i*5) : dateDaysFromNow(3+i%20), technician:techs[i%techs.length], vendor:vendors[(i+2)%vendors.length], cost: 45 + (i%8)*55, status, completedDate: status==='COMPLETED'?dateDaysAgo(7+i*5):undefined, createdBy:i%2===0?'technician':'assets', createdAt:isoDaysAgo(80-i), updatedAt:isoDaysAgo(i%12) };
  });
}

function createTransactions(stock: StockItem[]): StockTransaction[] {
  return Array.from({length:60},(_,i)=>{ const item=stock[i%stock.length]; const type=i%3===0?'OUT':'IN'; return { id:i+1, stockItemId:item.id, itemName:item.itemName, sku:item.sku, type, quantity:1+(i%12), reason:type==='IN'?'Purchase order receipt / replenishment':'Department issue / approved request', performedBy:i%2===0?'inventory':'admin', createdAt:isoDaysAgo(i*2) }; });
}

export function createSeedWorkspace(): WorkspaceData {
  const assets=createAssets(); const stock=createStock(); const assignments=createAssignments(assets); const maintenance=createMaintenance(assets); const stockTransactions=createTransactions(stock);
  const activities = Array.from({length:42},(_,i)=>({ id:i+1, action:['CREATE','UPDATE','ASSIGN','STOCK_IN','MAINTENANCE'][i%5], entityType:['Asset','Stock','Assignment','Maintenance'][i%4], entityId:1+(i*7)%84, description:['Asset record verified and lifecycle data updated','Inventory quantity reconciled after warehouse count','Equipment assigned to approved employee request','Maintenance status updated after technician review','New procurement item registered in inventory'][i%5], username:['admin','assets','inventory','technician'][i%4], createdAt:isoDaysAgo(i%21) }));
  return { assets, stock, stockTransactions, assignments, maintenance, users:SHOWCASE_USERS.map(u=>({...u})), activities, metadata:{version:5, seededAt:now.toISOString(), company:'Nexora Technologies'} };
}
