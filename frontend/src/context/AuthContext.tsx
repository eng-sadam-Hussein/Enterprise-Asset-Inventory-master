import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../api/types';
import { createSeedWorkspace } from '../data/seed';
import { can } from '../utils/permissions';

interface AuthContextValue { user:User|null; token:string|null; isAuthenticated:boolean; isAdmin:boolean; isLoading:boolean; login:(username:string,password:string)=>Promise<void>; logout:()=>void; }
const USER_KEY='nexora_auth_user_v5'; const TOKEN_KEY='nexora_auth_token_v5'; const WORKSPACE_KEY='nexora_assetops_workspace_v5';
function loadUser(){try{const raw=localStorage.getItem(USER_KEY); return raw?JSON.parse(raw) as User:null;}catch{return null;}}
function loadWorkspace(){try{const raw=localStorage.getItem(WORKSPACE_KEY); if(raw)return JSON.parse(raw);}catch{} const seeded=createSeedWorkspace(); localStorage.setItem(WORKSPACE_KEY,JSON.stringify(seeded)); return seeded;}
const C=createContext<AuthContextValue|undefined>(undefined);
export function AuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(()=>loadUser()); const [token,setToken]=useState<string|null>(()=>localStorage.getItem(TOKEN_KEY)); const [isLoading,setLoading]=useState(false);
 const login=async(username:string,password:string)=>{setLoading(true); try{await new Promise(r=>setTimeout(r,420)); const workspace=loadWorkspace(); const found=workspace.users.find((u:any)=>u.active!==false&&u.username.toLowerCase()===username.trim().toLowerCase()&&u.password===password); if(!found)throw new Error('Invalid username or password'); const next:User={id:found.id,username:found.username,email:found.email,fullName:found.fullName,role:found.role,department:found.department,profileImage:found.profileImage}; const t=`nx-local-${found.id}-${Date.now()}`; localStorage.setItem(USER_KEY,JSON.stringify(next)); localStorage.setItem(TOKEN_KEY,t); setUser(next); setToken(t);}finally{setLoading(false);}};
 const logout=()=>{localStorage.removeItem(USER_KEY);localStorage.removeItem(TOKEN_KEY);setUser(null);setToken(null);};
 return <C.Provider value={{user,token,isAuthenticated:Boolean(user&&token),isAdmin:can(user?.role,'users.manage'),isLoading,login,logout}}>{children}</C.Provider>;
}
export function useAuth(){const c=useContext(C); if(!c)throw new Error('useAuth must be used inside AuthProvider'); return c;}
