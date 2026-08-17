import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PermissionRoute from './components/layout/PermissionRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import StockPage from './pages/StockPage';
import AssignmentsPage from './pages/AssignmentsPage';
import MaintenancePage from './pages/MaintenancePage';
import ScanPage from './pages/ScanPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
const P=({permission,children}:{permission:any;children:React.ReactNode})=><PermissionRoute permission={permission}>{children}</PermissionRoute>;
export default function App(){return <AuthProvider><WorkspaceProvider><BrowserRouter><Toaster position="top-right" toastOptions={{duration:3200,style:{borderRadius:'14px',border:'1px solid #e2e8f0',padding:'12px 14px',boxShadow:'0 18px 50px rgba(15,23,42,.12)'}}}/><Routes><Route path="/login" element={<LoginPage/>}/><Route path="/" element={<ProtectedRoute><Layout/></ProtectedRoute>}><Route index element={<Navigate to="/dashboard" replace/>}/><Route path="dashboard" element={<DashboardPage/>}/><Route path="assets" element={<P permission="assets.read"><AssetsPage/></P>}/><Route path="stock" element={<P permission="stock.read"><StockPage/></P>}/><Route path="assignments" element={<P permission="assignments.read"><AssignmentsPage/></P>}/><Route path="maintenance" element={<P permission="maintenance.read"><MaintenancePage/></P>}/><Route path="scan" element={<P permission="assets.read"><ScanPage/></P>}/><Route path="reports" element={<P permission="reports.read"><ReportsPage/></P>}/><Route path="users" element={<P permission="users.manage"><UsersPage/></P>}/><Route path="settings" element={<P permission="users.manage"><SettingsPage/></P>}/></Route><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes></BrowserRouter></WorkspaceProvider></AuthProvider>}
