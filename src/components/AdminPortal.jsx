import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  Shield, Eye, Bell, Lock, Users, Clock, CheckCircle, Building,
  GraduationCap, Briefcase, Home, Factory, Heart, Award, TrendingUp,
  Plus, X, Save, EyeOff, RefreshCw, Monitor, ChevronRight,
  MessageSquare, Layers, Star, Image, Info, UserCheck, Trash2,
  Loader2, AlertCircle, LogOut, Settings, ChevronDown, Globe, Edit2,
  ChevronLeft, ToggleLeft, ToggleRight, UserPlus, Sun, Moon,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;
const SITE_URL  = import.meta.env.VITE_SITE_URL;

/* ─── icon registry ──────────────────────────────────────────── */
const iconOptions = [
  {value:"Users",label:"Users"},{value:"Eye",label:"Eye"},{value:"Bell",label:"Bell"},
  {value:"Lock",label:"Lock"},{value:"TrendingUp",label:"Trending Up"},{value:"Award",label:"Award"},
  {value:"Heart",label:"Heart"},{value:"Shield",label:"Shield"},{value:"CheckCircle",label:"Check Circle"},
  {value:"Clock",label:"Clock"},{value:"Building",label:"Building"},{value:"GraduationCap",label:"Graduation Cap"},
  {value:"Briefcase",label:"Briefcase"},{value:"Home",label:"Home"},{value:"Factory",label:"Factory"},
];
const ICON_MAP = {Users,Eye,Bell,Lock,Clock,CheckCircle,Shield,Award,TrendingUp,Heart,Building,GraduationCap,Briefcase,Home,Factory};
const DynIcon = ({name,size=18})=>{ const C=ICON_MAP[name]||Shield; return <C size={size}/>; };

/* ─── nav config ──────────────────────────────────────────────── */
const navItems = [
  {id:"services",    label:"Services",     icon:Layers,       count:true},
  {id:"testimonials",label:"Testimonials", icon:MessageSquare,count:true},
  {id:"industries",  label:"Industries",   icon:Building,     count:true},
  {id:"whychooseus", label:"Why Choose Us",icon:Star,         count:true},
  {id:"hero",        label:"Hero Banner",  icon:Image,        count:false},
  {id:"about",       label:"About",        icon:Info,         count:false},
  {id:"careers",     label:"Careers",      icon:UserCheck,    count:false},
];

const AV_COLORS   = ["#d4af37","#58a6ff","#3fb950","#f78166","#d2a8ff","#79c0ff"];
const getInitial  = n => (n||"?").charAt(0).toUpperCase();
const roleStyle   = r => ({
  "Super Admin":{bg:"rgba(212,175,55,0.13)",  color:"#d4af37",border:"rgba(212,175,55,0.28)"},
  "Editor":     {bg:"rgba(88,166,255,0.10)",  color:"#58a6ff",border:"rgba(88,166,255,0.24)"},
  "Viewer":     {bg:"rgba(139,148,158,0.09)", color:"#8b949e",border:"rgba(139,148,158,0.20)"},
}[r] || {bg:"rgba(139,148,158,0.09)",color:"#8b949e",border:"rgba(139,148,158,0.20)"});

/* ════════════════════════════════════════════════════════════════
   THEME  — dark (d) and light (l) token sets
════════════════════════════════════════════════════════════════ */
const DARK = {
  bg0:"#010409", bg1:"#0d1117", bg2:"#161b22",
  border:"#21262d", border2:"#30363d",
  text:"#e6edf3", textMid:"#8b949e", textDim:"#484f58",
  inputBg:"#010409",
};
const LIGHT = {
  bg0:"#f6f8fa", bg1:"#ffffff", bg2:"#f0f2f5",
  border:"#d0d7de", border2:"#c8d0da",
  text:"#1f2328", textMid:"#57606a", textDim:"#8c959f",
  inputBg:"#ffffff",
};

/* Build all style tokens from a theme palette */
function buildTk(th) {
  const b = `1px solid ${th.border}`;
  const b2 = `1px solid ${th.border2}`;
  return {
    shell:    {display:"flex",height:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",background:th.bg0,color:th.text,overflow:"hidden"},
    sidebar:  (w)=>({width:w,flexShrink:0,background:th.bg1,borderRight:b,display:"flex",flexDirection:"column",overflow:"hidden",transition:"width 0.22s cubic-bezier(0.4,0,0.2,1)"}),
    brand:    (col)=>({padding:"18px 14px 14px",borderBottom:b,display:"flex",alignItems:"center",gap:10,overflow:"hidden",justifyContent:col?"center":"flex-start"}),
    brandIco: {width:36,height:36,borderRadius:9,background:"linear-gradient(135deg,#d4af37,#f5d76e)",display:"flex",alignItems:"center",justifyContent:"center",color:"#0d1117",flexShrink:0},
    brandTxt: {fontSize:14,fontWeight:700,color:th.text,letterSpacing:"-0.02em",lineHeight:1.2,whiteSpace:"nowrap"},
    brandSub: {fontSize:10,color:th.textMid,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"},
    navArea:  {flex:1,overflowY:"auto",overflowX:"hidden",padding:"12px 8px 8px"},
    navLbl:   {fontSize:10,fontWeight:700,color:th.textDim,letterSpacing:"0.1em",textTransform:"uppercase",padding:"0 8px 5px",display:"block",whiteSpace:"nowrap"},
    navBtn:   (a,col)=>({display:"flex",alignItems:"center",gap:col?0:9,width:"100%",padding:col?"10px":"8px 10px",justifyContent:col?"center":"flex-start",borderRadius:7,border:"none",cursor:"pointer",background:a?"rgba(212,175,55,0.09)":"transparent",color:a?"#d4af37":th.textMid,fontSize:13,fontWeight:a?600:400,textAlign:"left",marginBottom:2,transition:"all 0.13s",borderLeft:col?"none":(a?"2px solid #d4af37":`2px solid transparent`)}),
    navCount: (a)=>({marginLeft:"auto",fontSize:10,fontWeight:700,background:a?"rgba(212,175,55,0.16)":"rgba(139,148,158,0.09)",color:a?"#d4af37":th.textDim,padding:"1px 7px",borderRadius:20,whiteSpace:"nowrap"}),
    navLbl2:  {fontSize:13,fontWeight:"inherit",whiteSpace:"nowrap",overflow:"hidden"},
    divider:  {height:1,background:th.border,margin:"10px 6px"},
    userArea: {borderTop:b,padding:"12px 10px"},
    main:     {flex:1,display:"flex",flexDirection:"column",overflow:"hidden"},
    topbar:   {height:56,flexShrink:0,background:th.bg1,borderBottom:b,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px",gap:16},
    bc:       {display:"flex",alignItems:"center",gap:6,fontSize:12,color:th.textMid},
    topActs:  {display:"flex",alignItems:"center",gap:8},
    scroller: {flex:1,overflowY:"auto",padding:"26px 28px",background:th.bg0},
    dbBadge:  (ok)=>({display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:20,background:ok?"rgba(35,134,54,0.10)":ok===false?"rgba(248,81,73,0.10)":"rgba(100,110,120,0.09)",border:`1px solid ${ok?"rgba(35,134,54,0.30)":ok===false?"rgba(248,81,73,0.30)":"rgba(100,110,120,0.2)"}`,fontSize:11,fontWeight:500,color:ok?"#3fb950":ok===false?"#f85149":th.textMid,cursor:"default",whiteSpace:"nowrap"}),
    dbDot:    (ok)=>({width:6,height:6,borderRadius:"50%",background:ok?"#3fb950":ok===false?"#f85149":th.textMid,boxShadow:ok?"0 0 7px #3fb950":"none",animation:ok?"pulse 2s infinite":"none",flexShrink:0}),
    btnGold:  {display:"flex",alignItems:"center",gap:7,padding:"8px 15px",borderRadius:8,border:"none",cursor:"pointer",background:"#d4af37",color:"#0d1117",fontSize:12,fontWeight:700,whiteSpace:"nowrap"},
    btnGhost: {display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:8,cursor:"pointer",background:"transparent",color:th.textMid,border:b2,fontSize:12,fontWeight:500,whiteSpace:"nowrap"},
    btnRed:   {display:"flex",alignItems:"center",gap:6,padding:"7px 11px",borderRadius:7,border:"1px solid rgba(248,81,73,0.20)",cursor:"pointer",background:"rgba(248,81,73,0.08)",color:"#f85149",fontSize:12,fontWeight:500},
    btnGreen: {display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:8,cursor:"pointer",background:"rgba(35,134,54,0.10)",color:"#3fb950",border:"1px solid rgba(35,134,54,0.25)",fontSize:12,fontWeight:600,whiteSpace:"nowrap"},
    btnIcon:  {display:"flex",alignItems:"center",justifyContent:"center",padding:"7px",borderRadius:7,border:b2,cursor:"pointer",background:"transparent",color:th.textMid},
    pgHead:   {marginBottom:22},
    pgTitle:  {fontSize:20,fontWeight:700,color:th.text,letterSpacing:"-0.025em",marginBottom:3},
    pgDesc:   {fontSize:13,color:th.textMid},
    statRow:  {display:"flex",gap:12,marginBottom:22,flexWrap:"wrap"},
    statCard: {flex:"1 1 120px",background:th.bg1,border:b,borderRadius:10,padding:"14px 18px"},
    statNum:  {fontSize:24,fontWeight:700,color:th.text,letterSpacing:"-0.03em"},
    statLbl:  {fontSize:11,color:th.textMid,marginTop:2,textTransform:"uppercase",letterSpacing:"0.05em"},
    toolbar:  {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8},
    tblCount: {fontSize:12,color:th.textMid},
    table:    {background:th.bg1,border:b,borderRadius:12,overflow:"hidden",marginBottom:8},
    thead:    (c)=>({display:"grid",gridTemplateColumns:c,gap:12,padding:"9px 18px",background:th.bg2,borderBottom:b}),
    th:       {fontSize:10,fontWeight:700,color:th.textMid,textTransform:"uppercase",letterSpacing:"0.07em"},
    trow:     (c,h)=>({display:"grid",gridTemplateColumns:c,gap:12,padding:"12px 18px",alignItems:"start",borderBottom:b,background:h?"rgba(212,175,55,0.025)":"transparent",transition:"background 0.12s"}),
    inp:      {width:"100%",padding:"8px 11px",background:th.inputBg,border:b2,borderRadius:7,color:th.text,fontSize:13,outline:"none",boxSizing:"border-box"},
    sel:      {width:"100%",padding:"7px 10px",background:th.inputBg,border:b2,borderRadius:7,color:th.text,fontSize:13,outline:"none",cursor:"pointer"},
    ta:       {width:"100%",padding:"8px 11px",background:th.inputBg,border:b2,borderRadius:7,color:th.text,fontSize:13,outline:"none",resize:"vertical",minHeight:72,lineHeight:1.55,boxSizing:"border-box"},
    lbl:      {display:"block",fontSize:12,fontWeight:600,color:th.textMid,marginBottom:5,letterSpacing:"0.02em"},
    formCard: {background:th.bg1,border:b,borderRadius:12,padding:"26px",maxWidth:620},
    formGrp:  {marginBottom:18},
    empty:    {textAlign:"center",padding:"48px 20px",color:th.textDim,fontSize:13},
    overlay:  {position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:16},
    modal:    {background:th.bg1,border:`1px solid ${th.border2}`,borderRadius:14,padding:"28px",width:"100%",maxWidth:460,boxShadow:"0 28px 80px rgba(0,0,0,0.5)",maxHeight:"90vh",overflowY:"auto"},
    pCard:    {background:th.bg1,border:b,borderRadius:12,padding:"18px 20px",display:"flex",alignItems:"center",gap:14,transition:"border-color 0.15s"},
    avatar:   (c)=>({width:42,height:42,borderRadius:"50%",background:c,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:"#0d1117",flexShrink:0}),
    avatarLg: (c)=>({width:56,height:56,borderRadius:"50%",background:c,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:22,color:"#0d1117",flexShrink:0}),
    toast:    (tp)=>({position:"fixed",bottom:24,right:24,zIndex:9999,background:tp==="error"?"#f85149":tp==="success"?"#3fb950":"#d4af37",color:"#0d1117",padding:"10px 18px",borderRadius:10,fontSize:13,fontWeight:700,boxShadow:"0 8px 40px rgba(0,0,0,0.4)",display:"flex",alignItems:"center",gap:8,animation:"slideUp 0.22s ease"}),
    pvBar:    {height:54,background:th.bg1,borderBottom:b,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px",flexShrink:0},
    toggleOn: {display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:20,background:"rgba(35,134,54,0.11)",border:"1px solid rgba(35,134,54,0.28)",color:"#3fb950",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"},
    toggleOff:{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:20,background:"rgba(100,110,120,0.10)",border:`1px solid rgba(100,110,120,0.22)`,color:th.textMid,fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"},
    statusOn: {fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:"rgba(35,134,54,0.11)",color:"#3fb950",border:"1px solid rgba(35,134,54,0.22)"},
    statusOff:{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:"rgba(100,110,120,0.09)",color:th.textDim,border:`1px solid rgba(100,110,120,0.18)`},
    // theme toggle button
    themBtn:  {display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,cursor:"pointer",background:"transparent",border:b2,color:th.textMid,fontSize:12,fontWeight:500,whiteSpace:"nowrap"},
    sideUser: (open,th)=>({display:"flex",alignItems:"center",gap:9,width:"100%",padding:"9px 8px",borderRadius:8,border:"none",background:open?th.bg2:"transparent",cursor:"pointer",transition:"background 0.13s"}),
    dropMenu: {background:th.bg2,border:`1px solid ${th.border2}`,borderRadius:10,overflow:"hidden",boxShadow:"0 -8px 40px rgba(0,0,0,0.25)",zIndex:300},
  };
}

/* ════════════════════════════════════════════════════════════════
   SMALL REUSABLES
════════════════════════════════════════════════════════════════ */
function Toast({msg,type}){
  if(!msg) return null;
  // tk is unavailable here but we only need the toast style — use inline
  const bg = type==="error"?"#f85149":type==="success"?"#3fb950":"#d4af37";
  return <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,background:bg,color:"#0d1117",padding:"10px 18px",borderRadius:10,fontSize:13,fontWeight:700,boxShadow:"0 8px 40px rgba(0,0,0,0.4)",display:"flex",alignItems:"center",gap:8,animation:"slideUp 0.22s ease"}}>{type==="error"?<AlertCircle size={14}/>:<CheckCircle size={14}/>}{msg}</div>;
}

function StatStrip({items,tk}){
  return <div style={tk.statRow}>{items.map((it,i)=><div key={i} style={tk.statCard}><div style={tk.statNum}>{it.value}</div><div style={tk.statLbl}>{it.label}</div></div>)}</div>;
}

function FG({label,children,tk}){ return <div style={tk.formGrp}><label style={tk.lbl}>{label}</label>{children}</div>; }

function ImgPrev({url}){
  if(!url) return null;
  return <img src={url} alt="" onError={e=>{e.target.style.display="none"}} style={{marginTop:9,width:"100%",maxHeight:145,objectFit:"cover",borderRadius:7,border:"1px solid #21262d"}}/>;
}

function Tooltip({text,children}){
  const [s,setS]=useState(false);
  return <div style={{position:"relative",display:"inline-flex"}} onMouseEnter={()=>setS(true)} onMouseLeave={()=>setS(false)}>{children}{s&&<div style={{position:"absolute",left:"calc(100% + 10px)",top:"50%",transform:"translateY(-50%)",background:"#21262d",color:"#e6edf3",fontSize:11,fontWeight:600,padding:"4px 9px",borderRadius:5,whiteSpace:"nowrap",zIndex:50,border:"1px solid #30363d"}}>{text}</div>}</div>;
}

/* ─── Editable table row — LOCAL STATE so typing works smoothly ── */
function EditRow({item, cols, fields, onSave, onDelete, tk}){
  const [local, setLocal] = useState(item);

  // sync if parent reloads data (e.g. after add)
  useEffect(()=>{ setLocal(item); },[item.id]);

  function change(field, val){ setLocal(p=>({...p,[field]:val})); }
  function blur(field){ onSave(local.id, field, local[field]); }
  function blurNum(field){ onSave(local.id, field, parseInt(local[field])||1); }

  const [h,setH]=useState(false);
  return (
    <div style={tk.trow(cols,h)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
      {fields.map(f=>{
        if(f.type==="select") return (
          <select key={f.key} style={tk.sel} value={local[f.key]||""} onChange={e=>{ change(f.key,e.target.value); onSave(local.id,f.key,e.target.value); }}>
            {f.options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        );
        if(f.type==="textarea") return (
          <textarea key={f.key} style={tk.ta} value={local[f.key]||""} onChange={e=>change(f.key,e.target.value)} onBlur={()=>blur(f.key)} placeholder={f.placeholder}/>
        );
        if(f.type==="number") return (
          <input key={f.key} style={tk.inp} type="number" value={local[f.key]||""} onChange={e=>change(f.key,e.target.value)} onBlur={()=>blurNum(f.key)}/>
        );
        return (
          <input key={f.key} style={tk.inp} value={local[f.key]||""} onChange={e=>change(f.key,e.target.value)} onBlur={()=>blur(f.key)} placeholder={f.placeholder}/>
        );
      })}
      <div><button style={tk.btnRed} onClick={()=>onDelete(local.id)}><Trash2 size={12}/></button></div>
    </div>
  );
}

/* ─── Logout modal ───────────────────────────────────────────── */
function LogoutModal({onCancel,onConfirm,tk}){
  return (
    <div style={tk.overlay} onClick={onCancel}>
      <div style={tk.modal} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
          <div style={{width:46,height:46,borderRadius:11,background:"rgba(248,81,73,0.10)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(248,81,73,0.22)"}}>
            <LogOut size={20} style={{color:"#f85149"}}/>
          </div>
          <div><div style={{fontSize:16,fontWeight:700,color:tk.text}}>Sign out of portal?</div><div style={{fontSize:12,color:tk.textMid,marginTop:2}}>You'll be returned to the login screen.</div></div>
        </div>
        <div style={{background:"rgba(248,81,73,0.06)",border:"1px solid rgba(248,81,73,0.15)",borderRadius:8,padding:"11px 14px",marginBottom:22,fontSize:12,color:"#f85149",lineHeight:1.6}}>⚠ Any unsaved changes will be lost.</div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button style={tk.btnGhost} onClick={onCancel}>Cancel</button>
          <button style={{...tk.btnRed,padding:"9px 18px",fontWeight:700,fontSize:13}} onClick={onConfirm}><LogOut size={13}/> Yes, Sign Out</button>
        </div>
      </div>
    </div>
  );
}

/* ─── User Edit modal ────────────────────────────────────────── */
function UserEditModal({user,onClose,onSaved,showToast,tk}){
  const [form,setForm]=useState({name:user.name||"",email:user.email||"",role:user.role||"Viewer",status:user.status||"active",phone:user.phone||"",password:""});
  const [saving,setSaving]=useState(false);
  async function submit(e){
    e.preventDefault();
    try{
      setSaving(true);
      const p={...form}; if(!p.password) delete p.password;
      await axios.put(`${API_BASE}/users/${user.id}`,p);
      showToast("User updated"); onSaved(); onClose();
    }catch(e){ showToast(e.response?.data?.message||"Update failed","error"); }
    finally{ setSaving(false); }
  }
  const idx=parseInt(String(user.id),10)%AV_COLORS.length;
  const rs=roleStyle(form.role);
  return (
    <div style={tk.overlay} onClick={onClose}>
      <div style={tk.modal} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={tk.avatarLg(AV_COLORS[idx])}>{getInitial(form.name)}</div>
            <div><div style={{fontSize:15,fontWeight:700}}>{user.name}</div><div style={{fontSize:12,color:tk.textMid,marginTop:1}}>{user.email}</div></div>
          </div>
          <button style={{...tk.btnIcon,border:"none"}} onClick={onClose}><X size={16}/></button>
        </div>
        <form onSubmit={submit}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <FG label="Full Name" tk={tk}><input style={tk.inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></FG>
            <FG label="Phone" tk={tk}><input style={tk.inp} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+254 7xx…"/></FG>
          </div>
          <FG label="Email" tk={tk}><input style={tk.inp} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></FG>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <FG label="Role" tk={tk}><select style={tk.sel} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option>Super Admin</option><option>Editor</option><option>Viewer</option></select></FG>
            <FG label="Status" tk={tk}><select style={tk.sel} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="active">Active</option><option value="inactive">Inactive</option></select></FG>
          </div>
          <FG label="New Password (blank = keep current)" tk={tk}><input style={tk.inp} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"/></FG>
          {/* live preview */}
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 13px",background:tk.bg2||"rgba(139,148,158,0.06)",borderRadius:8,marginBottom:18,fontSize:12,border:`1px solid ${tk.border||"#21262d"}`}}>
            <span style={{color:tk.textMid}}>Preview:</span>
            <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:rs.bg,color:rs.color,border:`1px solid ${rs.border}`,textTransform:"uppercase",letterSpacing:"0.06em"}}>{form.role}</span>
            <span style={form.status==="active"?tk.statusOn:tk.statusOff}>{form.status}</span>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button type="button" style={tk.btnGhost} onClick={onClose}>Cancel</button>
            <button type="submit" disabled={saving} style={{...tk.btnGold,opacity:saving?0.7:1}}>{saving?<Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/>:<Save size={13}/>}{saving?"Saving…":"Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Invite modal ───────────────────────────────────────────── */
function InviteModal({onClose,onSaved,showToast,tk}){
  const [form,setForm]=useState({name:"",email:"",role:"Viewer",password:""});
  const [saving,setSaving]=useState(false);
  async function submit(e){
    e.preventDefault();
    try{ setSaving(true); await axios.post(`${API_BASE}/users`,form); showToast("User invited"); onSaved(); onClose(); }
    catch(e){ showToast(e.response?.data?.message||"Invite failed","error"); }
    finally{ setSaving(false); }
  }
  return (
    <div style={tk.overlay} onClick={onClose}>
      <div style={tk.modal} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:42,height:42,borderRadius:10,background:"rgba(212,175,55,0.11)",border:"1px solid rgba(212,175,55,0.24)",display:"flex",alignItems:"center",justifyContent:"center"}}><UserPlus size={18} style={{color:"#d4af37"}}/></div>
            <div><div style={{fontSize:15,fontWeight:700}}>Invite Team Member</div><div style={{fontSize:12,color:tk.textMid,marginTop:1}}>They'll receive login credentials.</div></div>
          </div>
          <button style={{...tk.btnIcon,border:"none"}} onClick={onClose}><X size={16}/></button>
        </div>
        <form onSubmit={submit}>
          <FG label="Full Name" tk={tk}><input style={tk.inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></FG>
          <FG label="Email" tk={tk}><input style={tk.inp} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></FG>
          <FG label="Role" tk={tk}><select style={tk.sel} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option>Super Admin</option><option>Editor</option><option>Viewer</option></select></FG>
          <FG label="Initial Password" tk={tk}><input style={tk.inp} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} minLength={8} required/></FG>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
            <button type="button" style={tk.btnGhost} onClick={onClose}>Cancel</button>
            <button type="submit" disabled={saving} style={{...tk.btnGold,opacity:saving?0.7:1}}>{saving?<Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/>:<UserPlus size={13}/>}{saving?"Inviting…":"Send Invite"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Sidebar user dropdown ──────────────────────────────────── */
function SidebarUser({onLogout,collapsed,tk,th}){
  const [open,setOpen]=useState(false);
  const ref=useRef();
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);}; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h);},[]);
  return (
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={()=>setOpen(p=>!p)} style={{display:"flex",alignItems:"center",gap:collapsed?0:9,width:"100%",padding:"9px 8px",borderRadius:8,border:"none",background:open?th.bg2:"transparent",cursor:"pointer",transition:"background 0.13s",justifyContent:collapsed?"center":"flex-start"}}>
        <div style={{...tk.avatar(AV_COLORS[0]),width:30,height:30,fontSize:12}}>A</div>
        {!collapsed&&<><div style={{flex:1,textAlign:"left",minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:th.text,lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Admin User</div><div style={{fontSize:10,color:th.textMid}}>Super Admin</div></div><ChevronDown size={12} style={{color:th.textMid,transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}/></>}
      </button>
      {open&&(
        <div style={{position:"absolute",bottom:"calc(100% + 6px)",left:0,right:0,minWidth:190,...tk.dropMenu}}>
          <div style={{padding:"12px 13px",borderBottom:`1px solid ${th.border}`}}>
            <div style={{fontSize:12,color:th.text,fontWeight:600}}>Admin User</div>
            <div style={{fontSize:11,color:th.textMid,marginTop:2}}>admin@secureguard.co.ke</div>
          </div>
          <div style={{padding:"5px"}}>
            <button style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 9px",borderRadius:6,border:"none",background:"transparent",color:th.textMid,fontSize:12,cursor:"pointer",textAlign:"left"}}><Settings size={13}/> Settings</button>
            <button onClick={()=>{setOpen(false);onLogout();}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 9px",borderRadius:6,border:"none",background:"transparent",color:"#f85149",fontSize:12,cursor:"pointer",fontWeight:600,textAlign:"left"}}><LogOut size={13}/> Sign Out</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Profiles tab — all DB wired ───────────────────────────── */
function ProfilesTab({showToast,tk,th}){
  const [users,setUsers]     = useState([]);
  const [loading,setLoading] = useState(true);
  const [editUser,setEdit]   = useState(null);
  const [inviting,setInvite] = useState(false);
  const [toggling,setToggle] = useState(null);

  const load=useCallback(async()=>{
    try{ setLoading(true); const r=await axios.get(`${API_BASE}/users`); setUsers(r.data); }
    catch{ showToast("Failed to load users","error"); }
    finally{ setLoading(false); }
  },[]);
  useEffect(()=>{load();},[load]);

  async function toggleStatus(u){
    const next=u.status==="active"?"inactive":"active";
    try{ setToggle(u.id); await axios.put(`${API_BASE}/users/${u.id}`,{...u,status:next}); showToast(`User ${next==="active"?"activated":"deactivated"}`); await load(); }
    catch(e){ showToast(e.response?.data?.message||"Failed","error"); }
    finally{ setToggle(null); }
  }
  async function del(u){
    if(!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try{ await axios.delete(`${API_BASE}/users/${u.id}`); showToast("User removed"); await load(); }
    catch(e){ showToast(e.response?.data?.message||"Failed","error"); }
  }

  return (
    <section>
      {editUser&&<UserEditModal user={editUser} onClose={()=>setEdit(null)} onSaved={load} showToast={showToast} tk={tk}/>}
      {inviting&&<InviteModal onClose={()=>setInvite(false)} onSaved={load} showToast={showToast} tk={tk}/>}
      <div style={tk.pgHead}><div style={tk.pgTitle}>User Profiles</div><div style={tk.pgDesc}>Manage portal access, roles, and account status.</div></div>
      <StatStrip tk={tk} items={[{label:"Total",value:loading?"—":users.length},{label:"Active",value:loading?"—":users.filter(u=>u.status==="active").length},{label:"Inactive",value:loading?"—":users.filter(u=>u.status==="inactive").length}]}/>
      <div style={tk.toolbar}>
        <span style={tk.tblCount}>{loading?"Loading…":`${users.length} member${users.length!==1?"s":""}`}</span>
        <button style={tk.btnGold} onClick={()=>setInvite(true)}><UserPlus size={14}/> Invite User</button>
      </div>
      {loading&&<div style={{...tk.empty,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}><Loader2 size={22} style={{color:"#d4af37",animation:"spin 1s linear infinite"}}/><span>Loading users…</span></div>}
      {!loading&&users.length===0&&<div style={tk.empty}>No users found.</div>}
      {!loading&&<div style={{display:"grid",gap:10}}>
        {users.map((u,i)=>{
          const rs=roleStyle(u.role);
          return (
            <div key={u.id} style={{...tk.pCard,opacity:u.status==="inactive"?0.75:1}}>
              <div style={tk.avatar(AV_COLORS[i%AV_COLORS.length])}>{getInitial(u.name)}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:3}}>
                  <span style={{fontSize:14,fontWeight:700,color:th.text}}>{u.name}</span>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,textTransform:"uppercase",letterSpacing:"0.06em",background:rs.bg,color:rs.color,border:`1px solid ${rs.border}`}}>{u.role}</span>
                  <span style={u.status==="active"?tk.statusOn:tk.statusOff}>{u.status}</span>
                </div>
                <div style={{fontSize:12,color:th.textMid}}>{u.email}</div>
                {u.last_login&&<div style={{fontSize:11,color:th.textDim,marginTop:2}}>Last login: {u.last_login}</div>}
              </div>
              <div style={{display:"flex",gap:7,flexShrink:0,alignItems:"center"}}>
                <button onClick={()=>toggleStatus(u)} disabled={toggling===u.id} style={u.status==="active"?tk.toggleOn:tk.toggleOff} title={u.status==="active"?"Deactivate":"Activate"}>
                  {toggling===u.id?<Loader2 size={12} style={{animation:"spin 1s linear infinite"}}/>:u.status==="active"?<ToggleRight size={14}/>:<ToggleLeft size={14}/>}
                  {u.status==="active"?"Active":"Inactive"}
                </button>
                <button style={tk.btnGhost} onClick={()=>setEdit(u)}><Edit2 size={13}/> Edit</button>
                {u.id!==1&&<button style={tk.btnRed} onClick={()=>del(u)}><Trash2 size={13}/></button>}
              </div>
            </div>
          );
        })}
      </div>}
    </section>
  );
}

/* ─── Mini preview ───────────────────────────────────────────── */
function MiniPreview({data}){
  const hero=data.hero||{},about=data.about||{};
  return (
    <div style={{background:"#0a1628",padding:20}}>
      <div style={{background:hero.image_url?`url(${hero.image_url}) center/cover`:"#0B1F3A",padding:"80px 40px",textAlign:"center",color:"white",borderRadius:12,marginBottom:20,minHeight:240,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <h1 style={{fontSize:32,marginBottom:12,maxWidth:800}}>{hero.headline||"Professional Security Solutions You Can Trust"}</h1>
        <p style={{fontSize:16,maxWidth:600,marginBottom:20,opacity:0.9}}>{hero.subtitle||"24/7 protection across Kenya."}</p>
        <div style={{display:"flex",gap:12}}><button style={{padding:"11px 22px",background:"#D4AF37",color:"#0a1628",border:"none",borderRadius:6,fontWeight:600}}>Request a Quote</button><button style={{padding:"11px 22px",background:"transparent",color:"white",border:"2px solid white",borderRadius:6,fontWeight:600}}>Call Now</button></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:36,padding:36,background:"white",borderRadius:12,marginBottom:20}}>
        <img src={about.image_url||"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"} alt="" style={{width:"100%",borderRadius:8,objectFit:"cover",height:260}}/>
        <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <h2 style={{fontSize:24,color:"#0B1F3A",marginBottom:12}}>{about.title||"About SecureGuard"}</h2>
          <p style={{color:"#666",lineHeight:1.6,fontSize:14}}>{about.description||"With over 15 years of experience…"}</p>
        </div>
      </div>
      <div style={{padding:36,background:"white",borderRadius:12}}>
        <h2 style={{fontSize:24,textAlign:"center",color:"#0B1F3A",marginBottom:24}}>Our Services</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {(data.services||[]).slice(0,6).map((s,i)=>(
            <div key={i} style={{padding:16,border:"1px solid #e0e0e0",borderRadius:8,textAlign:"center"}}>
              <div style={{color:"#D4AF37",marginBottom:8,display:"flex",justifyContent:"center"}}><DynIcon name={s.icon} size={22}/></div>
              <h3 style={{fontSize:14,color:"#0B1F3A",marginBottom:6}}>{s.title}</h3>
              <p style={{fontSize:12,color:"#666",lineHeight:1.4}}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PORTAL
════════════════════════════════════════════════════════════════ */
const SIDEBAR_FULL = 238;
const SIDEBAR_MINI = 58;

export default function AdminPortal({onLogout}){
  const [isDark,setDark]         = useState(true);
  const th                        = isDark ? DARK : LIGHT;
  const tk                        = buildTk(th);

  const [tab,setTab]             = useState("services");
  const [previewMode,setPreview] = useState(false);
  const [showLogout,setLogout]   = useState(false);
  const [toast,setToast]         = useState({msg:"",type:"success"});
  const [collapsed,setCollapsed] = useState(false);
  const [data,setData]           = useState({services:[],testimonials:[],industries:[],whyChooseUs:[],hero:{},about:{},careers:{}});
  const [loading,setLoading]     = useState(true);
  const [saving,setSaving]       = useState(false);
  const [db,setDb]               = useState({connected:null,message:""});
  const [heroForm,setHeroForm]   = useState({});
  const [aboutForm,setAboutForm] = useState({});
  const [careForm,setCareForm]   = useState({});

  useEffect(()=>{
    const mq=window.matchMedia("(max-width:900px)");
    const h=e=>setCollapsed(e.matches); h(mq);
    mq.addEventListener("change",h); return()=>mq.removeEventListener("change",h);
  },[]);

  function showToast(msg,type="success"){ setToast({msg,type}); setTimeout(()=>setToast({msg:"",type:"success"}),3200); }

  useEffect(()=>{ loadAll(); checkDb(); const iv=setInterval(checkDb,30000); return()=>clearInterval(iv); },[]);

  async function checkDb(){
    try{ const r=await axios.get(`${API_BASE}/db-status`); setDb({connected:r.data.connected,message:r.data.message}); }
    catch(e){ setDb({connected:false,message:e.response?.data?.message||"Failed"}); }
  }
  async function loadAll(){
    try{ setLoading(true); const r=await axios.get(`${API_BASE}/all-content`); setData(r.data); setHeroForm(r.data.hero||{}); setAboutForm(r.data.about||{}); setCareForm(r.data.careers||{}); }
    catch(e){ console.error(e); } finally{ setLoading(false); }
  }
  async function withSave(fn,ok){
    try{ setSaving(true); await fn(); await loadAll(); showToast(ok); }
    catch(e){ showToast(e.message||"Error","error"); } finally{ setSaving(false); }
  }

  /* persist field to DB — called onBlur from EditRow */
  function persistField(endpoint,id,field,value){
    const row=data[endpoint]?.find(x=>x.id===id); if(!row) return;
    const updated={...row,[field]:value};
    axios.put(`${API_BASE}/${endpoint.replace(/([A-Z])/g,'-$1').toLowerCase()}/${id}`,updated)
      .catch(()=>showToast("Save failed","error"));
  }

  /* add / delete helpers still call loadAll since they change list length */
  async function addItem(endpoint,payload,msg){ await withSave(()=>axios.post(`${API_BASE}/${endpoint}`,payload),msg); }
  async function delItem(endpoint,id,msg){ if(!confirm("Delete this item?")) return; await withSave(()=>axios.delete(`${API_BASE}/${endpoint}/${id}`),msg); }

  const counts={services:data.services.length,testimonials:data.testimonials.length,industries:data.industries.length,whychooseus:data.whyChooseUs.length};
  const ALL_NAV=[...navItems,{id:"profiles",label:"User Profiles",icon:Users}];
  const activeNav=ALL_NAV.find(n=>n.id===tab);
  const sw=collapsed?SIDEBAR_MINI:SIDEBAR_FULL;

  const COL_ICO  = "130px 1fr 2fr 65px 72px";
  const COL_TEST = "1fr 1fr 2fr 65px 72px";

  const svcFields  = [{key:"icon",type:"select",options:iconOptions},{key:"title",type:"text",placeholder:"Title"},{key:"description",type:"textarea",placeholder:"Description"},{key:"display_order",type:"number"}];
  const testFields = [{key:"author",type:"text",placeholder:"Author"},{key:"role",type:"text",placeholder:"Role"},{key:"text",type:"textarea",placeholder:"Testimonial…"},{key:"display_order",type:"number"}];
  const indFields  = [{key:"icon",type:"select",options:iconOptions},{key:"title",type:"text",placeholder:"Title"},{key:"description",type:"textarea",placeholder:"Description"},{key:"display_order",type:"number"}];
  const whyFields  = [{key:"icon",type:"select",options:iconOptions},{key:"title",type:"text",placeholder:"Title"},{key:"description",type:"textarea",placeholder:"Description"},{key:"display_order",type:"number"}];

  if(loading) return (
    <div style={{...tk.shell,alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={tk.brandIco}><Shield size={19}/></div>
      <Loader2 size={20} style={{color:"#d4af37",animation:"spin 1s linear infinite"}}/>
      <span style={{color:th.textMid,fontSize:13}}>Loading portal…</span>
    </div>
  );

  if(previewMode) return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:th.bg0}}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={tk.pvBar}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><Monitor size={14} style={{color:"#d4af37"}}/><span style={{fontWeight:700,fontSize:14,color:th.text}}>Site Preview</span><span style={{fontSize:11,color:th.textMid,background:th.bg2,padding:"2px 8px",borderRadius:20,border:`1px solid ${th.border}`}}>50% scale</span></div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>window.open(SITE_URL,"_blank")} style={tk.btnGreen}><Globe size={13}/> Open Full Site</button>
          <button onClick={()=>setPreview(false)} style={tk.btnRed}><EyeOff size={13}/> Exit Preview</button>
        </div>
      </div>
      <div style={{flex:1,overflow:"auto",background:th.bg0,padding:20}}>
        <div style={{transform:"scale(0.5)",transformOrigin:"top left",width:"200%",background:"#0a1628",borderRadius:14,overflow:"hidden"}}><MiniPreview data={data}/></div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}
        @keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
        *{box-sizing:border-box} body{margin:0}
        input:focus,textarea:focus,select:focus{border-color:#d4af37!important;box-shadow:0 0 0 3px rgba(212,175,55,0.10)!important;outline:none}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:${th.bg1}}
        ::-webkit-scrollbar-thumb{background:${th.border2};border-radius:4px}
        button:hover{filter:brightness(1.08)} button:disabled{cursor:not-allowed;filter:none}
      `}</style>

      <Toast msg={toast.msg} type={toast.type}/>
      {showLogout&&<LogoutModal onCancel={()=>setLogout(false)} onConfirm={()=>{setLogout(false);onLogout?.();}} tk={tk}/>}

      <div style={tk.shell}>

        {/* ══ SIDEBAR ══ */}
        <aside style={tk.sidebar(sw)}>
          <div style={tk.brand(collapsed)}>
            <div style={tk.brandIco}><Shield size={17}/></div>
            {!collapsed&&<div><div style={tk.brandTxt}>SecureGuard</div><div style={tk.brandSub}>CMS Portal</div></div>}
          </div>

          <div style={tk.navArea}>
            {!collapsed&&<span style={tk.navLbl}>Content</span>}
            {collapsed&&<div style={{height:6}}/>}
            {navItems.map(n=>{
              const Icon=n.icon; const a=tab===n.id;
              const btn=(<button key={n.id} style={tk.navBtn(a,collapsed)} onClick={()=>setTab(n.id)}><Icon size={15} style={{opacity:a?1:0.6,flexShrink:0}}/>{!collapsed&&<><span style={tk.navLbl2}>{n.label}</span>{n.count&&<span style={tk.navCount(a)}>{counts[n.id]}</span>}</>}</button>);
              return collapsed?<Tooltip key={n.id} text={n.label}>{btn}</Tooltip>:btn;
            })}

            <div style={tk.divider}/>
            {!collapsed&&<span style={{...tk.navLbl,display:"block",marginTop:4}}>Team</span>}
            {(()=>{ const a=tab==="profiles"; const btn=<button style={tk.navBtn(a,collapsed)} onClick={()=>setTab("profiles")}><Users size={15} style={{opacity:a?1:0.6,flexShrink:0}}/>{!collapsed&&<span style={tk.navLbl2}>User Profiles</span>}</button>; return collapsed?<Tooltip text="User Profiles">{btn}</Tooltip>:btn; })()}

            <div style={tk.divider}/>
            {(()=>{ const btn=<button style={tk.navBtn(false,collapsed)} onClick={()=>setPreview(true)}><Monitor size={15} style={{opacity:0.6,flexShrink:0}}/>{!collapsed&&<span style={tk.navLbl2}>Preview Site</span>}</button>; return collapsed?<Tooltip text="Preview Site">{btn}</Tooltip>:btn; })()}
          </div>

          {/* Collapse toggle */}
          <div style={{padding:"8px 8px 0",borderTop:`1px solid ${th.border}`}}>
            <button onClick={()=>setCollapsed(p=>!p)} style={{...tk.navBtn(false,false),justifyContent:collapsed?"center":"flex-start",borderLeft:"none",padding:"9px 10px"}} title={collapsed?"Expand":"Collapse"}>
              {collapsed?<ChevronRight size={15} style={{opacity:0.5}}/>:<><ChevronLeft size={15} style={{opacity:0.5}}/><span style={{...tk.navLbl2,fontSize:12,color:th.textMid}}>Collapse</span></>}
            </button>
          </div>

          <div style={tk.userArea}>
            <SidebarUser onLogout={()=>setLogout(true)} collapsed={collapsed} tk={tk} th={th}/>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main style={tk.main}>
          <header style={tk.topbar}>
            <div style={tk.bc}><span>CMS</span><ChevronRight size={12}/><span style={{color:th.text,fontWeight:600}}>{activeNav?.label}</span></div>
            <div style={tk.topActs}>
              {/* DB status */}
              <div style={tk.dbBadge(db.connected)} title={db.message}>
                <div style={tk.dbDot(db.connected)}/>
                <span>{db.connected===null?"…":db.connected?"Online":"Offline"}</span>
                <RefreshCw size={10} style={{cursor:"pointer",opacity:0.6}} onClick={checkDb}/>
              </div>
              {/* 🌙 / ☀️ theme toggle */}
              <button style={tk.themBtn} onClick={()=>setDark(p=>!p)} title={isDark?"Switch to light mode":"Switch to dark mode"}>
                {isDark?<Sun size={14}/>:<Moon size={14}/>}
                {isDark?"Light":"Dark"}
              </button>
              <button style={tk.btnGhost} onClick={()=>setPreview(true)}><Monitor size={13}/> Preview</button>
              {/* <button style={tk.btnRed}   onClick={()=>setLogout(true)}><LogOut size={13}/> Sign Out</button> */}
            </div>
          </header>

          <div style={tk.scroller}>

            {/* ── SERVICES ── */}
            {tab==="services"&&(
              <section>
                <div style={tk.pgHead}><div style={tk.pgTitle}>Services</div><div style={tk.pgDesc}>Security services displayed on your homepage.</div></div>
                <StatStrip tk={tk} items={[{label:"Total",value:data.services.length},{label:"Live",value:data.services.length},{label:"Sync",value:"Just now"}]}/>
                <div style={tk.toolbar}><span style={tk.tblCount}>{data.services.length} record{data.services.length!==1?"s":""}</span><button style={tk.btnGold} onClick={()=>addItem("services",{icon:"Users",title:"New Service",description:"Description",display_order:data.services.length+1},"Service added")}><Plus size={14}/> Add Service</button></div>
                <div style={tk.table}>
                  <div style={tk.thead(COL_ICO)}><div style={tk.th}>Icon</div><div style={tk.th}>Title</div><div style={tk.th}>Description</div><div style={tk.th}>Order</div><div style={tk.th}>Action</div></div>
                  {data.services.length===0&&<div style={tk.empty}>No services yet.</div>}
                  {data.services.map(s=><EditRow key={s.id} item={s} cols={COL_ICO} fields={svcFields} onSave={(id,f,v)=>persistField("services",id,f,v)} onDelete={(id)=>delItem("services",id,"Service deleted")} tk={tk}/>)}
                </div>
              </section>
            )}

            {/* ── TESTIMONIALS ── */}
            {tab==="testimonials"&&(
              <section>
                <div style={tk.pgHead}><div style={tk.pgTitle}>Testimonials</div><div style={tk.pgDesc}>Client reviews shown on your homepage.</div></div>
                <StatStrip tk={tk} items={[{label:"Total",value:data.testimonials.length},{label:"Displayed",value:data.testimonials.length}]}/>
                <div style={tk.toolbar}><span style={tk.tblCount}>{data.testimonials.length} record{data.testimonials.length!==1?"s":""}</span><button style={tk.btnGold} onClick={()=>addItem("testimonials",{author:"New Client",role:"Job Title",text:"Testimonial",display_order:data.testimonials.length+1},"Testimonial added")}><Plus size={14}/> Add Testimonial</button></div>
                <div style={tk.table}>
                  <div style={tk.thead(COL_TEST)}><div style={tk.th}>Author</div><div style={tk.th}>Role</div><div style={tk.th}>Testimonial</div><div style={tk.th}>Order</div><div style={tk.th}>Action</div></div>
                  {data.testimonials.length===0&&<div style={tk.empty}>No testimonials yet.</div>}
                  {data.testimonials.map(s=><EditRow key={s.id} item={s} cols={COL_TEST} fields={testFields} onSave={(id,f,v)=>persistField("testimonials",id,f,v)} onDelete={(id)=>delItem("testimonials",id,"Testimonial deleted")} tk={tk}/>)}
                </div>
              </section>
            )}

            {/* ── INDUSTRIES ── */}
            {tab==="industries"&&(
              <section>
                <div style={tk.pgHead}><div style={tk.pgTitle}>Industries</div><div style={tk.pgDesc}>Sectors your company serves.</div></div>
                <div style={tk.toolbar}><span style={tk.tblCount}>{data.industries.length} record{data.industries.length!==1?"s":""}</span><button style={tk.btnGold} onClick={()=>addItem("industries",{icon:"Building",title:"New Industry",description:"Description",display_order:data.industries.length+1},"Industry added")}><Plus size={14}/> Add Industry</button></div>
                <div style={tk.table}>
                  <div style={tk.thead(COL_ICO)}><div style={tk.th}>Icon</div><div style={tk.th}>Title</div><div style={tk.th}>Description</div><div style={tk.th}>Order</div><div style={tk.th}>Action</div></div>
                  {data.industries.length===0&&<div style={tk.empty}>No industries yet.</div>}
                  {data.industries.map(s=><EditRow key={s.id} item={s} cols={COL_ICO} fields={indFields} onSave={(id,f,v)=>persistField("industries",id,f,v)} onDelete={(id)=>delItem("industries",id,"Industry deleted")} tk={tk}/>)}
                </div>
              </section>
            )}

            {/* ── WHY CHOOSE US ── */}
            {tab==="whychooseus"&&(
              <section>
                <div style={tk.pgHead}><div style={tk.pgTitle}>Why Choose Us</div><div style={tk.pgDesc}>Key differentiators and value propositions.</div></div>
                <div style={tk.toolbar}><span style={tk.tblCount}>{data.whyChooseUs.length} record{data.whyChooseUs.length!==1?"s":""}</span><button style={tk.btnGold} onClick={()=>addItem("why-choose-us",{icon:"Shield",title:"New Benefit",description:"Description",display_order:data.whyChooseUs.length+1},"Item added")}><Plus size={14}/> Add Item</button></div>
                <div style={tk.table}>
                  <div style={tk.thead(COL_ICO)}><div style={tk.th}>Icon</div><div style={tk.th}>Title</div><div style={tk.th}>Description</div><div style={tk.th}>Order</div><div style={tk.th}>Action</div></div>
                  {data.whyChooseUs.length===0&&<div style={tk.empty}>No items yet.</div>}
                  {data.whyChooseUs.map(s=><EditRow key={s.id} item={s} cols={COL_ICO} fields={whyFields} onSave={(id,f,v)=>persistField("whyChooseUs",id,f,v)} onDelete={(id)=>delItem("why-choose-us",id,"Item deleted")} tk={tk}/>)}
                </div>
              </section>
            )}

            {/* ── HERO ── */}
            {tab==="hero"&&(
              <section>
                <div style={tk.pgHead}><div style={tk.pgTitle}>Hero Banner</div><div style={tk.pgDesc}>Headline, subtitle and background image.</div></div>
                <form onSubmit={e=>{e.preventDefault();withSave(()=>heroForm.id?axios.put(`${API_BASE}/hero/${heroForm.id}`,heroForm):axios.post(`${API_BASE}/hero`,heroForm),"Hero saved");}}>
                  <div style={tk.formCard}>
                    <FG label="Background Image URL" tk={tk}><input style={tk.inp} value={heroForm.image_url||""} placeholder="https://…/image.jpg" onChange={e=>setHeroForm({...heroForm,image_url:e.target.value})}/><ImgPrev url={heroForm.image_url}/></FG>
                    <FG label="Headline" tk={tk}><input style={tk.inp} value={heroForm.headline||""} placeholder="Professional Security Solutions…" onChange={e=>setHeroForm({...heroForm,headline:e.target.value})}/></FG>
                    <FG label="Subtitle" tk={tk}><textarea style={tk.ta} value={heroForm.subtitle||""} placeholder="24/7 protection services…" onChange={e=>setHeroForm({...heroForm,subtitle:e.target.value})}/></FG>
                    <button type="submit" disabled={saving} style={{...tk.btnGold,opacity:saving?0.7:1}}>{saving?<Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/>:<Save size={13}/>}{saving?"Saving…":"Save Hero"}</button>
                  </div>
                </form>
              </section>
            )}

            {/* ── ABOUT ── */}
            {tab==="about"&&(
              <section>
                <div style={tk.pgHead}><div style={tk.pgTitle}>About Section</div><div style={tk.pgDesc}>Company story and credentials.</div></div>
                <form onSubmit={e=>{e.preventDefault();withSave(()=>axios.put(`${API_BASE}/about`,aboutForm),"About saved");}}>
                  <div style={tk.formCard}>
                    <FG label="Title" tk={tk}><input style={tk.inp} value={aboutForm.title||""} placeholder="About SecureGuard" onChange={e=>setAboutForm({...aboutForm,title:e.target.value})}/></FG>
                    <FG label="Description" tk={tk}><textarea style={{...tk.ta,minHeight:110}} value={aboutForm.description||""} onChange={e=>setAboutForm({...aboutForm,description:e.target.value})}/></FG>
                    <FG label="Image URL" tk={tk}><input style={tk.inp} value={aboutForm.image_url||""} placeholder="https://…" onChange={e=>setAboutForm({...aboutForm,image_url:e.target.value})}/><ImgPrev url={aboutForm.image_url}/></FG>
                    <button type="submit" disabled={saving} style={{...tk.btnGold,opacity:saving?0.7:1}}>{saving?<Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/>:<Save size={13}/>}{saving?"Saving…":"Save About"}</button>
                  </div>
                </form>
              </section>
            )}

            {/* ── CAREERS ── */}
            {tab==="careers"&&(
              <section>
                <div style={tk.pgHead}><div style={tk.pgTitle}>Careers Section</div><div style={tk.pgDesc}>Attract the best talent.</div></div>
                <form onSubmit={e=>{e.preventDefault();withSave(()=>axios.put(`${API_BASE}/careers`,careForm),"Careers saved");}}>
                  <div style={tk.formCard}>
                    <FG label="Title" tk={tk}><input style={tk.inp} value={careForm.title||""} placeholder="Join Our Team" onChange={e=>setCareForm({...careForm,title:e.target.value})}/></FG>
                    <FG label="Description" tk={tk}><textarea style={{...tk.ta,minHeight:110}} value={careForm.description||""} onChange={e=>setCareForm({...careForm,description:e.target.value})}/></FG>
                    <FG label="Image URL" tk={tk}><input style={tk.inp} value={careForm.image_url||""} placeholder="https://…" onChange={e=>setCareForm({...careForm,image_url:e.target.value})}/><ImgPrev url={careForm.image_url}/></FG>
                    <button type="submit" disabled={saving} style={{...tk.btnGold,opacity:saving?0.7:1}}>{saving?<Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/>:<Save size={13}/>}{saving?"Saving…":"Save Careers"}</button>
                  </div>
                </form>
              </section>
            )}

            {/* ── PROFILES ── */}
            {tab==="profiles"&&<ProfilesTab showToast={showToast} tk={tk} th={th}/>}

          </div>
        </main>
      </div>
    </>
  );
}



// import { useState, useEffect, useRef, useCallback } from "react";
// import axios from "axios";
// import {
//   Shield,
//   Eye,
//   Bell,
//   Lock,
//   Users,
//   Clock,
//   CheckCircle,
//   Building,
//   GraduationCap,
//   Briefcase,
//   Home,
//   Factory,
//   Heart,
//   Award,
//   TrendingUp,
//   Plus,
//   X,
//   Save,
//   EyeOff,
//   RefreshCw,
//   Monitor,
//   ChevronRight,
//   MessageSquare,
//   Layers,
//   Star,
//   Image,
//   Info,
//   UserCheck,
//   Trash2,
//   Loader2,
//   AlertCircle,
//   LogOut,
//   Settings,
//   ChevronDown,
//   Globe,
//   Edit2,
//   Menu,
//   ChevronLeft,
//   ToggleLeft,
//   ToggleRight,
//   UserPlus,
//   Key,
// } from "lucide-react";

// const API_BASE = import.meta.env.VITE_API_BASE;
// const SITE_URL = import.meta.env.VITE_SITE_URL;

// /* ─────────────────────────────────────────────────────────────────
//    ICON REGISTRY
// ───────────────────────────────────────────────────────────────── */
// const iconOptions = [
//   { value: "Users", label: "Users" },
//   { value: "Eye", label: "Eye" },
//   { value: "Bell", label: "Bell" },
//   { value: "Lock", label: "Lock" },
//   { value: "TrendingUp", label: "Trending Up" },
//   { value: "Award", label: "Award" },
//   { value: "Heart", label: "Heart" },
//   { value: "Shield", label: "Shield" },
//   { value: "CheckCircle", label: "Check Circle" },
//   { value: "Clock", label: "Clock" },
//   { value: "Building", label: "Building" },
//   { value: "GraduationCap", label: "Graduation Cap" },
//   { value: "Briefcase", label: "Briefcase" },
//   { value: "Home", label: "Home" },
//   { value: "Factory", label: "Factory" },
// ];
// const ICON_MAP = {
//   Users,
//   Eye,
//   Bell,
//   Lock,
//   Clock,
//   CheckCircle,
//   Shield,
//   Award,
//   TrendingUp,
//   Heart,
//   Building,
//   GraduationCap,
//   Briefcase,
//   Home,
//   Factory,
// };
// const DynIcon = ({ name, size = 18 }) => {
//   const C = ICON_MAP[name] || Shield;
//   return <C size={size} />;
// };

// /* ─────────────────────────────────────────────────────────────────
//    NAV CONFIG
// ───────────────────────────────────────────────────────────────── */
// const navItems = [
//   { id: "services", label: "Services", icon: Layers, count: true },
//   {
//     id: "testimonials",
//     label: "Testimonials",
//     icon: MessageSquare,
//     count: true,
//   },
//   { id: "industries", label: "Industries", icon: Building, count: true },
//   { id: "whychooseus", label: "Why Choose Us", icon: Star, count: true },
//   { id: "hero", label: "Hero Banner", icon: Image, count: false },
//   { id: "about", label: "About", icon: Info, count: false },
//   { id: "careers", label: "Careers", icon: UserCheck, count: false },
// ];

// const AV_COLORS = [
//   "#d4af37",
//   "#58a6ff",
//   "#3fb950",
//   "#f78166",
//   "#d2a8ff",
//   "#79c0ff",
// ];
// const getInitial = (name) => (name || "?").charAt(0).toUpperCase();

// /* ─────────────────────────────────────────────────────────────────
//    DESIGN TOKENS
// ───────────────────────────────────────────────────────────────── */
// const tk = {
//   shell: {
//     display: "flex",
//     height: "100vh",
//     fontFamily: "'DM Sans','Segoe UI',sans-serif",
//     background: "#010409",
//     color: "#e6edf3",
//     overflow: "hidden",
//   },
//   /* sidebar */
//   sidebar: (w) => ({
//     width: w,
//     flexShrink: 0,
//     background: "#0d1117",
//     borderRight: "1px solid #21262d",
//     display: "flex",
//     flexDirection: "column",
//     overflow: "hidden",
//     transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
//   }),
//   brand: (col) => ({
//     padding: "18px 14px 14px",
//     borderBottom: "1px solid #21262d",
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     overflow: "hidden",
//     justifyContent: col ? "center" : "flex-start",
//   }),
//   brandIco: {
//     width: 36,
//     height: 36,
//     borderRadius: 9,
//     background: "linear-gradient(135deg,#d4af37,#f5d76e)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#0d1117",
//     flexShrink: 0,
//   },
//   brandTxt: {
//     fontSize: 14,
//     fontWeight: 700,
//     color: "#e6edf3",
//     letterSpacing: "-0.02em",
//     lineHeight: 1.2,
//     whiteSpace: "nowrap",
//   },
//   brandSub: {
//     fontSize: 10,
//     color: "#8b949e",
//     textTransform: "uppercase",
//     letterSpacing: "0.07em",
//     whiteSpace: "nowrap",
//   },
//   navArea: {
//     flex: 1,
//     overflowY: "auto",
//     overflowX: "hidden",
//     padding: "12px 8px 8px",
//   },
//   navLbl: (col) => ({
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#484f58",
//     letterSpacing: "0.1em",
//     textTransform: "uppercase",
//     padding: "0 8px 5px",
//     display: "block",
//     whiteSpace: "nowrap",
//     opacity: col ? 0 : 1,
//     height: col ? 0 : "auto",
//     overflow: "hidden",
//     transition: "opacity 0.15s",
//   }),
//   navBtn: (a, col) => ({
//     display: "flex",
//     alignItems: "center",
//     gap: col ? 0 : 9,
//     width: "100%",
//     padding: col ? "10px" : "8px 10px",
//     justifyContent: col ? "center" : "flex-start",
//     borderRadius: 7,
//     border: "none",
//     cursor: "pointer",
//     background: a ? "rgba(212,175,55,0.09)" : "transparent",
//     color: a ? "#d4af37" : "#8b949e",
//     fontSize: 13,
//     fontWeight: a ? 600 : 400,
//     textAlign: "left",
//     marginBottom: 2,
//     transition: "all 0.13s",
//     borderLeft: col
//       ? "none"
//       : a
//         ? "2px solid #d4af37"
//         : "2px solid transparent",
//     position: "relative",
//   }),
//   navCount: (a) => ({
//     marginLeft: "auto",
//     fontSize: 10,
//     fontWeight: 700,
//     background: a ? "rgba(212,175,55,0.16)" : "rgba(139,148,158,0.09)",
//     color: a ? "#d4af37" : "#6e7681",
//     padding: "1px 7px",
//     borderRadius: 20,
//     whiteSpace: "nowrap",
//   }),
//   navLbl2: {
//     fontSize: 10,
//     fontWeight: 700,
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//   },
//   divider: { height: 1, background: "#21262d", margin: "10px 6px" },
//   userArea: { borderTop: "1px solid #21262d", padding: "12px 10px" },
//   /* topbar */
//   main: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     overflow: "hidden",
//   },
//   topbar: {
//     height: 56,
//     flexShrink: 0,
//     background: "#0d1117",
//     borderBottom: "1px solid #21262d",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 22px",
//     gap: 16,
//   },
//   bc: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 12,
//     color: "#8b949e",
//   },
//   topActs: { display: "flex", alignItems: "center", gap: 8 },
//   scroller: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "26px 28px",
//     background: "#010409",
//   },
//   /* db badge */
//   dbBadge: (ok) => ({
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "5px 12px",
//     borderRadius: 20,
//     background: ok
//       ? "rgba(35,134,54,0.10)"
//       : ok === false
//         ? "rgba(248,81,73,0.10)"
//         : "rgba(100,110,120,0.09)",
//     border: `1px solid ${ok ? "rgba(35,134,54,0.30)" : ok === false ? "rgba(248,81,73,0.30)" : "rgba(100,110,120,0.2)"}`,
//     fontSize: 11,
//     fontWeight: 500,
//     color: ok ? "#3fb950" : ok === false ? "#f85149" : "#8b949e",
//     cursor: "default",
//     whiteSpace: "nowrap",
//   }),
//   dbDot: (ok) => ({
//     width: 6,
//     height: 6,
//     borderRadius: "50%",
//     background: ok ? "#3fb950" : ok === false ? "#f85149" : "#8b949e",
//     boxShadow: ok ? "0 0 7px #3fb950" : "none",
//     animation: ok ? "pulse 2s infinite" : "none",
//     flexShrink: 0,
//   }),
//   /* buttons */
//   btnGold: {
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     padding: "8px 15px",
//     borderRadius: 8,
//     border: "none",
//     cursor: "pointer",
//     background: "#d4af37",
//     color: "#0d1117",
//     fontSize: 12,
//     fontWeight: 700,
//     whiteSpace: "nowrap",
//   },
//   btnGhost: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "7px 13px",
//     borderRadius: 8,
//     cursor: "pointer",
//     background: "transparent",
//     color: "#8b949e",
//     border: "1px solid #30363d",
//     fontSize: 12,
//     fontWeight: 500,
//     whiteSpace: "nowrap",
//   },
//   btnRed: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "7px 11px",
//     borderRadius: 7,
//     border: "1px solid rgba(248,81,73,0.20)",
//     cursor: "pointer",
//     background: "rgba(248,81,73,0.08)",
//     color: "#f85149",
//     fontSize: 12,
//     fontWeight: 500,
//   },
//   btnGreen: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "7px 13px",
//     borderRadius: 8,
//     cursor: "pointer",
//     background: "rgba(35,134,54,0.10)",
//     color: "#3fb950",
//     border: "1px solid rgba(35,134,54,0.25)",
//     fontSize: 12,
//     fontWeight: 600,
//     whiteSpace: "nowrap",
//   },
//   btnBlue: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "7px 13px",
//     borderRadius: 8,
//     cursor: "pointer",
//     background: "rgba(88,166,255,0.10)",
//     color: "#58a6ff",
//     border: "1px solid rgba(88,166,255,0.22)",
//     fontSize: 12,
//     fontWeight: 600,
//     whiteSpace: "nowrap",
//   },
//   btnIcon: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "7px",
//     borderRadius: 7,
//     border: "1px solid #30363d",
//     cursor: "pointer",
//     background: "transparent",
//     color: "#8b949e",
//   },
//   /* page header */
//   pgHead: { marginBottom: 22 },
//   pgTitle: {
//     fontSize: 20,
//     fontWeight: 700,
//     color: "#e6edf3",
//     letterSpacing: "-0.025em",
//     marginBottom: 3,
//   },
//   pgDesc: { fontSize: 13, color: "#8b949e" },
//   /* stat strip */
//   statRow: { display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap" },
//   statCard: {
//     flex: "1 1 120px",
//     background: "#0d1117",
//     border: "1px solid #21262d",
//     borderRadius: 10,
//     padding: "14px 18px",
//   },
//   statNum: {
//     fontSize: 24,
//     fontWeight: 700,
//     color: "#e6edf3",
//     letterSpacing: "-0.03em",
//   },
//   statLbl: {
//     fontSize: 11,
//     color: "#8b949e",
//     marginTop: 2,
//     textTransform: "uppercase",
//     letterSpacing: "0.05em",
//   },
//   /* toolbar */
//   toolbar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   tblCount: { fontSize: 12, color: "#8b949e" },
//   /* table */
//   table: {
//     background: "#0d1117",
//     border: "1px solid #21262d",
//     borderRadius: 12,
//     overflow: "hidden",
//     marginBottom: 8,
//   },
//   thead: (c) => ({
//     display: "grid",
//     gridTemplateColumns: c,
//     gap: 12,
//     padding: "9px 18px",
//     background: "#161b22",
//     borderBottom: "1px solid #21262d",
//   }),
//   th: {
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#8b949e",
//     textTransform: "uppercase",
//     letterSpacing: "0.07em",
//   },
//   trow: (c, h) => ({
//     display: "grid",
//     gridTemplateColumns: c,
//     gap: 12,
//     padding: "12px 18px",
//     alignItems: "start",
//     borderBottom: "1px solid #21262d",
//     background: h ? "rgba(212,175,55,0.018)" : "transparent",
//     transition: "background 0.12s",
//   }),
//   /* inputs */
//   inp: {
//     width: "100%",
//     padding: "8px 11px",
//     background: "#010409",
//     border: "1px solid #30363d",
//     borderRadius: 7,
//     color: "#e6edf3",
//     fontSize: 13,
//     outline: "none",
//     boxSizing: "border-box",
//   },
//   sel: {
//     width: "100%",
//     padding: "7px 10px",
//     background: "#010409",
//     border: "1px solid #30363d",
//     borderRadius: 7,
//     color: "#e6edf3",
//     fontSize: 13,
//     outline: "none",
//     cursor: "pointer",
//   },
//   ta: {
//     width: "100%",
//     padding: "8px 11px",
//     background: "#010409",
//     border: "1px solid #30363d",
//     borderRadius: 7,
//     color: "#e6edf3",
//     fontSize: 13,
//     outline: "none",
//     resize: "vertical",
//     minHeight: 72,
//     lineHeight: 1.55,
//     boxSizing: "border-box",
//   },
//   lbl: {
//     display: "block",
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#8b949e",
//     marginBottom: 5,
//     letterSpacing: "0.02em",
//   },
//   /* form card */
//   formCard: {
//     background: "#0d1117",
//     border: "1px solid #21262d",
//     borderRadius: 12,
//     padding: "26px",
//     maxWidth: 620,
//   },
//   formGrp: { marginBottom: 18 },
//   /* empty */
//   empty: {
//     textAlign: "center",
//     padding: "48px 20px",
//     color: "#484f58",
//     fontSize: 13,
//   },
//   /* modal */
//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.78)",
//     zIndex: 9000,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//   },
//   modal: {
//     background: "#0d1117",
//     border: "1px solid #30363d",
//     borderRadius: 14,
//     padding: "28px",
//     width: "100%",
//     maxWidth: 460,
//     boxShadow: "0 28px 80px rgba(0,0,0,0.65)",
//     maxHeight: "90vh",
//     overflowY: "auto",
//   },
//   /* profile card */
//   pCard: {
//     background: "#0d1117",
//     border: "1px solid #21262d",
//     borderRadius: 12,
//     padding: "18px 20px",
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//     transition: "border-color 0.15s",
//   },
//   avatar: (c) => ({
//     width: 42,
//     height: 42,
//     borderRadius: "50%",
//     background: c,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 700,
//     fontSize: 16,
//     color: "#0d1117",
//     flexShrink: 0,
//   }),
//   avatarLg: (c) => ({
//     width: 56,
//     height: 56,
//     borderRadius: "50%",
//     background: c,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 700,
//     fontSize: 22,
//     color: "#0d1117",
//     flexShrink: 0,
//   }),
//   /* toast */
//   toast: (tp) => ({
//     position: "fixed",
//     bottom: 24,
//     right: 24,
//     zIndex: 9999,
//     background:
//       tp === "error" ? "#f85149" : tp === "success" ? "#3fb950" : "#d4af37",
//     color: "#0d1117",
//     padding: "10px 18px",
//     borderRadius: 10,
//     fontSize: 13,
//     fontWeight: 700,
//     boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     animation: "slideUp 0.22s ease",
//   }),
//   pvBar: {
//     height: 54,
//     background: "#0d1117",
//     borderBottom: "1px solid #21262d",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 22px",
//     flexShrink: 0,
//   },
//   /* toggle */
//   toggleOn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "5px 12px",
//     borderRadius: 20,
//     background: "rgba(35,134,54,0.11)",
//     border: "1px solid rgba(35,134,54,0.28)",
//     color: "#3fb950",
//     fontSize: 11,
//     fontWeight: 700,
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//   },
//   toggleOff: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "5px 12px",
//     borderRadius: 20,
//     background: "rgba(100,110,120,0.10)",
//     border: "1px solid rgba(100,110,120,0.22)",
//     color: "#8b949e",
//     fontSize: 11,
//     fontWeight: 700,
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//   },
//   statusOn: {
//     fontSize: 10,
//     fontWeight: 700,
//     padding: "2px 8px",
//     borderRadius: 20,
//     background: "rgba(35,134,54,0.11)",
//     color: "#3fb950",
//     border: "1px solid rgba(35,134,54,0.22)",
//   },
//   statusOff: {
//     fontSize: 10,
//     fontWeight: 700,
//     padding: "2px 8px",
//     borderRadius: 20,
//     background: "rgba(100,110,120,0.09)",
//     color: "#6e7681",
//     border: "1px solid rgba(100,110,120,0.18)",
//   },
// };

// const roleStyle = (r) =>
//   ({
//     "Super Admin": {
//       bg: "rgba(212,175,55,0.13)",
//       color: "#d4af37",
//       border: "rgba(212,175,55,0.28)",
//     },
//     Editor: {
//       bg: "rgba(88,166,255,0.10)",
//       color: "#58a6ff",
//       border: "rgba(88,166,255,0.24)",
//     },
//     Viewer: {
//       bg: "rgba(139,148,158,0.09)",
//       color: "#8b949e",
//       border: "rgba(139,148,158,0.20)",
//     },
//   })[r] || {
//     bg: "rgba(139,148,158,0.09)",
//     color: "#8b949e",
//     border: "rgba(139,148,158,0.20)",
//   };

// /* ─────────────────────────────────────────────────────────────────
//    TINY COMPONENTS
// ───────────────────────────────────────────────────────────────── */
// function Toast({ msg, type }) {
//   if (!msg) return null;
//   return (
//     <div style={tk.toast(type)}>
//       {type === "error" ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
//       {msg}
//     </div>
//   );
// }

// function StatStrip({ items }) {
//   return (
//     <div style={tk.statRow}>
//       {items.map((it, i) => (
//         <div key={i} style={tk.statCard}>
//           <div style={tk.statNum}>{it.value}</div>
//           <div style={tk.statLbl}>{it.label}</div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function TRow({ cols, onDelete, children }) {
//   const [h, setH] = useState(false);
//   return (
//     <div
//       style={tk.trow(cols, h)}
//       onMouseEnter={() => setH(true)}
//       onMouseLeave={() => setH(false)}
//     >
//       {children}
//       <div>
//         <button style={tk.btnRed} onClick={onDelete}>
//           <Trash2 size={12} />
//         </button>
//       </div>
//     </div>
//   );
// }

// function FG({ label, children }) {
//   return (
//     <div style={tk.formGrp}>
//       <label style={tk.lbl}>{label}</label>
//       {children}
//     </div>
//   );
// }

// function ImgPrev({ url }) {
//   if (!url) return null;
//   return (
//     <img
//       src={url}
//       alt=""
//       style={{
//         marginTop: 9,
//         width: "100%",
//         maxHeight: 145,
//         objectFit: "cover",
//         borderRadius: 7,
//         border: "1px solid #21262d",
//       }}
//     />
//   );
// }

// function Tooltip({ text, children }) {
//   const [show, setShow] = useState(false);
//   return (
//     <div
//       style={{ position: "relative", display: "inline-flex" }}
//       onMouseEnter={() => setShow(true)}
//       onMouseLeave={() => setShow(false)}
//     >
//       {children}
//       {show && (
//         <div
//           style={{
//             position: "absolute",
//             left: "calc(100% + 10px)",
//             top: "50%",
//             transform: "translateY(-50%)",
//             background: "#21262d",
//             color: "#e6edf3",
//             fontSize: 11,
//             fontWeight: 600,
//             padding: "4px 9px",
//             borderRadius: 5,
//             whiteSpace: "nowrap",
//             zIndex: 50,
//             pointerEvents: "none",
//             border: "1px solid #30363d",
//           }}
//         >
//           {text}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────
//    LOGOUT MODAL
// ───────────────────────────────────────────────────────────────── */
// function LogoutModal({ onCancel, onConfirm }) {
//   return (
//     <div style={tk.overlay} onClick={onCancel}>
//       <div style={tk.modal} onClick={(e) => e.stopPropagation()}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 14,
//             marginBottom: 18,
//           }}
//         >
//           <div
//             style={{
//               width: 46,
//               height: 46,
//               borderRadius: 11,
//               background: "rgba(248,81,73,0.10)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               border: "1px solid rgba(248,81,73,0.22)",
//             }}
//           >
//             <LogOut size={20} style={{ color: "#f85149" }} />
//           </div>
//           <div>
//             <div style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3" }}>
//               Sign out of portal?
//             </div>
//             <div style={{ fontSize: 12, color: "#8b949e", marginTop: 2 }}>
//               You'll be returned to the login screen.
//             </div>
//           </div>
//         </div>
//         <div
//           style={{
//             background: "#161b22",
//             border: "1px solid #21262d",
//             borderRadius: 8,
//             padding: "11px 14px",
//             marginBottom: 22,
//             fontSize: 12,
//             color: "#8b949e",
//             lineHeight: 1.6,
//           }}
//         >
//           ⚠ Any unsaved changes will be lost.
//         </div>
//         <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//           <button style={tk.btnGhost} onClick={onCancel}>
//             Cancel
//           </button>
//           <button
//             style={{
//               ...tk.btnRed,
//               padding: "9px 18px",
//               fontWeight: 700,
//               fontSize: 13,
//             }}
//             onClick={onConfirm}
//           >
//             <LogOut size={13} /> Yes, Sign Out
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────
//    USER EDIT MODAL — wired to DB via API
// ───────────────────────────────────────────────────────────────── */
// function UserEditModal({ user, onClose, onSaved, showToast }) {
//   const [form, setForm] = useState({
//     name: user.name || "",
//     email: user.email || "",
//     role: user.role || "Viewer",
//     status: user.status || "active",
//     phone: user.phone || "",
//     password: "",
//   });
//   const [saving, setSaving] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       const payload = { ...form };
//       if (!payload.password) delete payload.password;
//       await axios.put(`${API_BASE}/users/${user.id}`, payload);
//       showToast("User updated successfully");
//       onSaved();
//       onClose();
//     } catch (err) {
//       showToast(
//         err.response?.data?.message || "Failed to update user",
//         "error",
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   const idx = parseInt(user.id, 10) % AV_COLORS.length;
//   const rs = roleStyle(form.role);

//   return (
//     <div style={tk.overlay} onClick={onClose}>
//       <div style={tk.modal} onClick={(e) => e.stopPropagation()}>
//         {/* header */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 22,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
//             <div style={tk.avatarLg(AV_COLORS[idx])}>
//               {getInitial(form.name)}
//             </div>
//             <div>
//               <div style={{ fontSize: 15, fontWeight: 700, color: "#e6edf3" }}>
//                 {user.name}
//               </div>
//               <div style={{ fontSize: 12, color: "#8b949e", marginTop: 1 }}>
//                 {user.email}
//               </div>
//             </div>
//           </div>
//           <button style={{ ...tk.btnIcon, border: "none" }} onClick={onClose}>
//             <X size={16} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: 14,
//               marginBottom: 14,
//             }}
//           >
//             <FG label="Full Name">
//               <input
//                 style={tk.inp}
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 placeholder="Full name"
//                 required
//               />
//             </FG>
//             <FG label="Phone (optional)">
//               <input
//                 style={tk.inp}
//                 value={form.phone}
//                 onChange={(e) => setForm({ ...form, phone: e.target.value })}
//                 placeholder="+254 7xx xxx xxx"
//               />
//             </FG>
//           </div>

//           <FG label="Email Address">
//             <input
//               style={tk.inp}
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               placeholder="user@company.co.ke"
//               required
//             />
//           </FG>

//           <div
//             style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
//           >
//             <FG label="Role">
//               <select
//                 style={tk.sel}
//                 value={form.role}
//                 onChange={(e) => setForm({ ...form, role: e.target.value })}
//               >
//                 <option>Super Admin</option>
//                 <option>Editor</option>
//                 <option>Viewer</option>
//               </select>
//             </FG>
//             <FG label="Account Status">
//               <select
//                 style={tk.sel}
//                 value={form.status}
//                 onChange={(e) => setForm({ ...form, status: e.target.value })}
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </FG>
//           </div>

//           <FG label="New Password (leave blank to keep current)">
//             <input
//               style={tk.inp}
//               type="password"
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               placeholder="••••••••"
//             />
//           </FG>

//           {/* live preview of role badge */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 9,
//               padding: "10px 13px",
//               background: "#161b22",
//               border: "1px solid #21262d",
//               borderRadius: 8,
//               marginBottom: 20,
//               fontSize: 12,
//             }}
//           >
//             <span style={{ color: "#8b949e" }}>Preview:</span>
//             <span
//               style={{
//                 fontSize: 10,
//                 fontWeight: 700,
//                 padding: "2px 9px",
//                 borderRadius: 20,
//                 background: rs.bg,
//                 color: rs.color,
//                 border: `1px solid ${rs.border}`,
//                 textTransform: "uppercase",
//                 letterSpacing: "0.06em",
//               }}
//             >
//               {form.role}
//             </span>
//             <span style={form.status === "active" ? tk.statusOn : tk.statusOff}>
//               {form.status}
//             </span>
//           </div>

//           <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//             <button type="button" style={tk.btnGhost} onClick={onClose}>
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               style={{ ...tk.btnGold, opacity: saving ? 0.7 : 1 }}
//             >
//               {saving ? (
//                 <Loader2
//                   size={13}
//                   style={{ animation: "spin 1s linear infinite" }}
//                 />
//               ) : (
//                 <Save size={13} />
//               )}
//               {saving ? "Saving…" : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────
//    INVITE USER MODAL — POSTs to DB
// ───────────────────────────────────────────────────────────────── */
// function InviteModal({ onClose, onSaved, showToast }) {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     role: "Viewer",
//     password: "",
//   });
//   const [saving, setSaving] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       await axios.post(`${API_BASE}/users`, form);
//       showToast("User invited successfully");
//       onSaved();
//       onClose();
//     } catch (err) {
//       showToast(
//         err.response?.data?.message || "Failed to invite user",
//         "error",
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div style={tk.overlay} onClick={onClose}>
//       <div style={tk.modal} onClick={(e) => e.stopPropagation()}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 22,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div
//               style={{
//                 width: 42,
//                 height: 42,
//                 borderRadius: 10,
//                 background: "rgba(212,175,55,0.11)",
//                 border: "1px solid rgba(212,175,55,0.24)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <UserPlus size={19} style={{ color: "#d4af37" }} />
//             </div>
//             <div>
//               <div style={{ fontSize: 15, fontWeight: 700, color: "#e6edf3" }}>
//                 Invite Team Member
//               </div>
//               <div style={{ fontSize: 12, color: "#8b949e", marginTop: 1 }}>
//                 They'll receive login credentials.
//               </div>
//             </div>
//           </div>
//           <button style={{ ...tk.btnIcon, border: "none" }} onClick={onClose}>
//             <X size={16} />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <FG label="Full Name">
//             <input
//               style={tk.inp}
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               placeholder="Jane Muthoni"
//               required
//             />
//           </FG>
//           <FG label="Email Address">
//             <input
//               style={tk.inp}
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               placeholder="jane@secureguard.co.ke"
//               required
//             />
//           </FG>
//           <FG label="Role">
//             <select
//               style={tk.sel}
//               value={form.role}
//               onChange={(e) => setForm({ ...form, role: e.target.value })}
//             >
//               <option>Super Admin</option>
//               <option>Editor</option>
//               <option>Viewer</option>
//             </select>
//           </FG>
//           <FG label="Initial Password">
//             <input
//               style={tk.inp}
//               type="password"
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               placeholder="Minimum 8 characters"
//               required
//               minLength={8}
//             />
//           </FG>
//           <div
//             style={{
//               display: "flex",
//               gap: 10,
//               justifyContent: "flex-end",
//               marginTop: 4,
//             }}
//           >
//             <button type="button" style={tk.btnGhost} onClick={onClose}>
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               style={{ ...tk.btnGold, opacity: saving ? 0.7 : 1 }}
//             >
//               {saving ? (
//                 <Loader2
//                   size={13}
//                   style={{ animation: "spin 1s linear infinite" }}
//                 />
//               ) : (
//                 <UserPlus size={13} />
//               )}
//               {saving ? "Inviting…" : "Send Invite"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────
//    SIDEBAR USER DROPDOWN
// ───────────────────────────────────────────────────────────────── */
// function SidebarUser({ onLogout, collapsed }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef();
//   useEffect(() => {
//     const h = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);
//   return (
//     <div ref={ref} style={{ position: "relative" }}>
//       <button
//         onClick={() => setOpen((p) => !p)}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: collapsed ? 0 : 9,
//           width: "100%",
//           padding: "9px 8px",
//           borderRadius: 8,
//           border: "none",
//           background: open ? "#161b22" : "transparent",
//           cursor: "pointer",
//           transition: "background 0.13s",
//           justifyContent: collapsed ? "center" : "flex-start",
//         }}
//       >
//         <div
//           style={{
//             ...tk.avatar(AV_COLORS[0]),
//             width: 30,
//             height: 30,
//             fontSize: 12,
//           }}
//         >
//           {" "}
//           A
//         </div>
//         {!collapsed && (
//           <>
//             <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
//               <div
//                 style={{
//                   fontSize: 12,
//                   fontWeight: 600,
//                   color: "#e6edf3",
//                   lineHeight: 1.2,
//                   whiteSpace: "nowrap",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                 }}
//               >
//                 Admin User
//               </div>
//               <div style={{ fontSize: 10, color: "#8b949e" }}>Super Admin</div>
//             </div>
//             <ChevronDown
//               size={12}
//               style={{
//                 color: "#8b949e",
//                 transform: open ? "rotate(180deg)" : "none",
//                 transition: "transform 0.2s",
//                 flexShrink: 0,
//               }}
//             />
//           </>
//         )}
//       </button>
//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             bottom: "calc(100% + 6px)",
//             left: 0,
//             right: 0,
//             minWidth: 190,
//             background: "#161b22",
//             border: "1px solid #30363d",
//             borderRadius: 10,
//             overflow: "hidden",
//             boxShadow: "0 -8px 40px rgba(0,0,0,0.55)",
//             zIndex: 300,
//           }}
//         >
//           <div
//             style={{ padding: "12px 13px", borderBottom: "1px solid #21262d" }}
//           >
//             <div style={{ fontSize: 12, color: "#e6edf3", fontWeight: 600 }}>
//               Admin User
//             </div>
//             <div style={{ fontSize: 11, color: "#8b949e", marginTop: 2 }}>
//               admin@secureguard.co.ke
//             </div>
//           </div>
//           <div style={{ padding: "5px" }}>
//             <button
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 width: "100%",
//                 padding: "7px 9px",
//                 borderRadius: 6,
//                 border: "none",
//                 background: "transparent",
//                 color: "#8b949e",
//                 fontSize: 12,
//                 cursor: "pointer",
//                 textAlign: "left",
//               }}
//             >
//               <Settings size={13} /> Settings
//             </button>
//             <button
//               onClick={() => {
//                 setOpen(false);
//                 onLogout();
//               }}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 width: "100%",
//                 padding: "7px 9px",
//                 borderRadius: 6,
//                 border: "none",
//                 background: "transparent",
//                 color: "#f85149",
//                 fontSize: 12,
//                 cursor: "pointer",
//                 fontWeight: 600,
//                 textAlign: "left",
//               }}
//             >
//               <LogOut size={13} /> Sign Out
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────
//    PROFILES TAB — real DB calls
// ───────────────────────────────────────────────────────────────── */
// function ProfilesTab({ showToast }) {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editUser, setEditUser] = useState(null);
//   const [inviting, setInviting] = useState(false);
//   const [toggling, setToggling] = useState(null); // id being toggled

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const r = await axios.get(`${API_BASE}/users`);
//       setUsers(r.data);
//     } catch (e) {
//       showToast("Failed to load users", "error");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   async function toggleStatus(user) {
//     const newStatus = user.status === "active" ? "inactive" : "active";
//     try {
//       setToggling(user.id);
//       await axios.put(`${API_BASE}/users/${user.id}`, {
//         ...user,
//         status: newStatus,
//       });
//       showToast(`User ${newStatus === "active" ? "activated" : "deactivated"}`);
//       await load();
//     } catch (e) {
//       showToast(
//         e.response?.data?.message || "Failed to update status",
//         "error",
//       );
//     } finally {
//       setToggling(null);
//     }
//   }

//   async function deleteUser(user) {
//     if (!confirm(`Permanently delete ${user.name}? This cannot be undone.`))
//       return;
//     try {
//       await axios.delete(`${API_BASE}/users/${user.id}`);
//       showToast("User removed");
//       await load();
//     } catch (e) {
//       showToast(e.response?.data?.message || "Failed to delete user", "error");
//     }
//   }

//   const active = users.filter((u) => u.status === "active").length;
//   const inactive = users.filter((u) => u.status === "inactive").length;

//   return (
//     <section>
//       {editUser && (
//         <UserEditModal
//           user={editUser}
//           onClose={() => setEditUser(null)}
//           onSaved={load}
//           showToast={showToast}
//         />
//       )}
//       {inviting && (
//         <InviteModal
//           onClose={() => setInviting(false)}
//           onSaved={load}
//           showToast={showToast}
//         />
//       )}

//       <div style={tk.pgHead}>
//         <div style={tk.pgTitle}>User Profiles</div>
//         <div style={tk.pgDesc}>
//           Manage portal access, roles, and account status.
//         </div>
//       </div>

//       <StatStrip
//         items={[
//           { label: "Total Users", value: loading ? "—" : users.length },
//           { label: "Active", value: loading ? "—" : active },
//           { label: "Inactive", value: loading ? "—" : inactive },
//         ]}
//       />

//       <div style={tk.toolbar}>
//         <span style={tk.tblCount}>
//           {loading
//             ? "Loading…"
//             : `${users.length} member${users.length !== 1 ? "s" : ""}`}
//         </span>
//         <button style={tk.btnGold} onClick={() => setInviting(true)}>
//           <UserPlus size={14} /> Invite User
//         </button>
//       </div>

//       {loading && (
//         <div
//           style={{
//             ...tk.empty,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: 12,
//           }}
//         >
//           <Loader2
//             size={22}
//             style={{ color: "#d4af37", animation: "spin 1s linear infinite" }}
//           />
//           <span>Loading users…</span>
//         </div>
//       )}

//       {!loading && users.length === 0 && (
//         <div style={tk.empty}>
//           No users found. Invite your first team member.
//         </div>
//       )}

//       {!loading && (
//         <div style={{ display: "grid", gap: 10 }}>
//           {users.map((u, i) => {
//             const rs = roleStyle(u.role);
//             const isMe = u.id === 1; // protect the primary admin from deletion
//             return (
//               <div
//                 key={u.id}
//                 style={{
//                   ...tk.pCard,
//                   borderColor: u.status === "inactive" ? "#21262d" : "#21262d",
//                   opacity: u.status === "inactive" ? 0.72 : 1,
//                 }}
//               >
//                 <div style={tk.avatar(AV_COLORS[i % AV_COLORS.length])}>
//                   {getInitial(u.name)}
//                 </div>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 7,
//                       flexWrap: "wrap",
//                       marginBottom: 3,
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontSize: 14,
//                         fontWeight: 700,
//                         color: "#e6edf3",
//                       }}
//                     >
//                       {u.name}
//                     </span>
//                     <span
//                       style={{
//                         fontSize: 10,
//                         fontWeight: 700,
//                         padding: "2px 8px",
//                         borderRadius: 20,
//                         textTransform: "uppercase",
//                         letterSpacing: "0.06em",
//                         background: rs.bg,
//                         color: rs.color,
//                         border: `1px solid ${rs.border}`,
//                       }}
//                     >
//                       {u.role}
//                     </span>
//                     <span
//                       style={u.status === "active" ? tk.statusOn : tk.statusOff}
//                     >
//                       {u.status}
//                     </span>
//                   </div>
//                   <div style={{ fontSize: 12, color: "#8b949e" }}>
//                     {u.email}
//                   </div>
//                   {u.last_login && (
//                     <div
//                       style={{ fontSize: 11, color: "#484f58", marginTop: 2 }}
//                     >
//                       Last login: {u.last_login}
//                     </div>
//                   )}
//                 </div>
//                 {/* actions */}
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 7,
//                     flexShrink: 0,
//                     alignItems: "center",
//                   }}
//                 >
//                   {/* activate / deactivate */}
//                   <button
//                     onClick={() => toggleStatus(u)}
//                     disabled={toggling === u.id}
//                     style={u.status === "active" ? tk.toggleOn : tk.toggleOff}
//                     title={u.status === "active" ? "Deactivate" : "Activate"}
//                   >
//                     {toggling === u.id ? (
//                       <Loader2
//                         size={12}
//                         style={{ animation: "spin 1s linear infinite" }}
//                       />
//                     ) : u.status === "active" ? (
//                       <ToggleRight size={14} />
//                     ) : (
//                       <ToggleLeft size={14} />
//                     )}
//                     {u.status === "active" ? "Active" : "Inactive"}
//                   </button>
//                   <button
//                     style={tk.btnGhost}
//                     onClick={() => setEditUser(u)}
//                     title="Edit user"
//                   >
//                     <Edit2 size={13} /> Edit
//                   </button>
//                   {!isMe && (
//                     <button
//                       style={tk.btnRed}
//                       onClick={() => deleteUser(u)}
//                       title="Delete user"
//                     >
//                       <Trash2 size={13} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </section>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────
//    MINI PREVIEW
// ───────────────────────────────────────────────────────────────── */
// function MiniPreview({ data }) {
//   const hero = data.hero || {},
//     about = data.about || {};
//   return (
//     <div style={{ background: "#0a1628", padding: 20 }}>
//       <div
//         style={{
//           background: hero.image_url
//             ? `url(${hero.image_url}) center/cover`
//             : "#0B1F3A",
//           padding: "80px 40px",
//           textAlign: "center",
//           color: "white",
//           borderRadius: 12,
//           marginBottom: 20,
//           minHeight: 260,
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <h1 style={{ fontSize: 34, marginBottom: 14, maxWidth: 800 }}>
//           {hero.headline || "Professional Security Solutions You Can Trust"}
//         </h1>
//         <p
//           style={{
//             fontSize: 17,
//             maxWidth: 600,
//             marginBottom: 22,
//             opacity: 0.9,
//           }}
//         >
//           {hero.subtitle || "24/7 protection services across Kenya."}
//         </p>
//         <div style={{ display: "flex", gap: 12 }}>
//           <button
//             style={{
//               padding: "12px 24px",
//               background: "#D4AF37",
//               color: "#0a1628",
//               border: "none",
//               borderRadius: 6,
//               fontWeight: 600,
//             }}
//           >
//             Request a Quote
//           </button>
//           <button
//             style={{
//               padding: "12px 24px",
//               background: "transparent",
//               color: "white",
//               border: "2px solid white",
//               borderRadius: 6,
//               fontWeight: 600,
//             }}
//           >
//             Call Now
//           </button>
//         </div>
//       </div>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           gap: 40,
//           padding: 40,
//           background: "white",
//           borderRadius: 12,
//           marginBottom: 20,
//         }}
//       >
//         <img
//           src={
//             about.image_url ||
//             "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
//           }
//           alt=""
//           style={{
//             width: "100%",
//             borderRadius: 8,
//             objectFit: "cover",
//             height: 280,
//           }}
//         />
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//           }}
//         >
//           <h2 style={{ fontSize: 26, color: "#0B1F3A", marginBottom: 14 }}>
//             {about.title || "About SecureGuard"}
//           </h2>
//           <p style={{ color: "#666", lineHeight: 1.6 }}>
//             {about.description || "With over 15 years of experience…"}
//           </p>
//         </div>
//       </div>
//       <div
//         style={{
//           padding: 40,
//           background: "white",
//           borderRadius: 12,
//           marginBottom: 20,
//         }}
//       >
//         <h2
//           style={{
//             fontSize: 26,
//             textAlign: "center",
//             color: "#0B1F3A",
//             marginBottom: 28,
//           }}
//         >
//           Our Services
//         </h2>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3,1fr)",
//             gap: 18,
//           }}
//         >
//           {(data.services || []).slice(0, 6).map((s, i) => (
//             <div
//               key={i}
//               style={{
//                 padding: 18,
//                 border: "1px solid #e0e0e0",
//                 borderRadius: 8,
//                 textAlign: "center",
//               }}
//             >
//               <div
//                 style={{
//                   color: "#D4AF37",
//                   marginBottom: 10,
//                   display: "flex",
//                   justifyContent: "center",
//                 }}
//               >
//                 <DynIcon name={s.icon} size={24} />
//               </div>
//               <h3 style={{ fontSize: 15, color: "#0B1F3A", marginBottom: 6 }}>
//                 {s.title}
//               </h3>
//               <p style={{ fontSize: 12, color: "#666", lineHeight: 1.4 }}>
//                 {s.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────
//    MAIN PORTAL
// ───────────────────────────────────────────────────────────────── */
// const SIDEBAR_FULL = 238;
// const SIDEBAR_MINI = 58;

// export default function AdminPortal({ onLogout }) {
//   const [tab, setTab] = useState("services");
//   const [previewMode, setPreview] = useState(false);
//   const [showLogout, setLogout] = useState(false);
//   const [toast, setToast] = useState({ msg: "", type: "success" });
//   const [collapsed, setCollapsed] = useState(false);
//   const [data, setData] = useState({
//     services: [],
//     testimonials: [],
//     industries: [],
//     whyChooseUs: [],
//     hero: {},
//     about: {},
//     careers: {},
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [db, setDb] = useState({ connected: null, message: "" });
//   const [heroForm, setHeroForm] = useState({});
//   const [aboutForm, setAboutForm] = useState({});
//   const [careForm, setCareForm] = useState({});

//   // auto-collapse sidebar on narrow screens
//   useEffect(() => {
//     const mq = window.matchMedia("(max-width: 900px)");
//     const handler = (e) => setCollapsed(e.matches);
//     handler(mq);
//     mq.addEventListener("change", handler);
//     return () => mq.removeEventListener("change", handler);
//   }, []);

//   function showToast(msg, type = "success") {
//     setToast({ msg, type });
//     setTimeout(() => setToast({ msg: "", type: "success" }), 3200);
//   }

//   useEffect(() => {
//     loadAll();
//     checkDb();
//     const iv = setInterval(checkDb, 30000);
//     return () => clearInterval(iv);
//   }, []);

//   async function checkDb() {
//     try {
//       const r = await axios.get(`${API_BASE}/db-status`);
//       setDb({ connected: r.data.connected, message: r.data.message });
//     } catch (e) {
//       setDb({
//         connected: false,
//         message: e.response?.data?.message || "Failed",
//       });
//     }
//   }
//   async function loadAll() {
//     try {
//       setLoading(true);
//       const r = await axios.get(`${API_BASE}/all-content`);
//       setData(r.data);
//       setHeroForm(r.data.hero || {});
//       setAboutForm(r.data.about || {});
//       setCareForm(r.data.careers || {});
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }
//   async function withSave(fn, ok) {
//     try {
//       setSaving(true);
//       await fn();
//       await loadAll();
//       showToast(ok);
//     } catch (e) {
//       showToast(e.message || "Something went wrong", "error");
//     } finally {
//       setSaving(false);
//     }
//   }

//   const C = {
//     svc: {
//       add: () =>
//         withSave(
//           () =>
//             axios.post(`${API_BASE}/services`, {
//               icon: "Users",
//               title: "New Service",
//               description: "Description",
//               display_order: data.services.length + 1,
//             }),
//           "Service added",
//         ),
//       upd: (id, f, v) => {
//         const s = { ...data.services.find((x) => x.id === id), [f]: v };
//         axios.put(`${API_BASE}/services/${id}`, s).then(loadAll);
//       },
//       del: (id) =>
//         confirm("Delete this service?") &&
//         withSave(
//           () => axios.delete(`${API_BASE}/services/${id}`),
//           "Service deleted",
//         ),
//     },
//     test: {
//       add: () =>
//         withSave(
//           () =>
//             axios.post(`${API_BASE}/testimonials`, {
//               author: "New Client",
//               role: "Job Title",
//               text: "Testimonial text",
//               display_order: data.testimonials.length + 1,
//             }),
//           "Testimonial added",
//         ),
//       upd: (id, f, v) => {
//         const s = { ...data.testimonials.find((x) => x.id === id), [f]: v };
//         axios.put(`${API_BASE}/testimonials/${id}`, s).then(loadAll);
//       },
//       del: (id) =>
//         confirm("Delete?") &&
//         withSave(
//           () => axios.delete(`${API_BASE}/testimonials/${id}`),
//           "Testimonial deleted",
//         ),
//     },
//     ind: {
//       add: () =>
//         withSave(
//           () =>
//             axios.post(`${API_BASE}/industries`, {
//               icon: "Building",
//               title: "New Industry",
//               description: "Description",
//               display_order: data.industries.length + 1,
//             }),
//           "Industry added",
//         ),
//       upd: (id, f, v) => {
//         const s = { ...data.industries.find((x) => x.id === id), [f]: v };
//         axios.put(`${API_BASE}/industries/${id}`, s).then(loadAll);
//       },
//       del: (id) =>
//         confirm("Delete?") &&
//         withSave(
//           () => axios.delete(`${API_BASE}/industries/${id}`),
//           "Industry deleted",
//         ),
//     },
//     why: {
//       add: () =>
//         withSave(
//           () =>
//             axios.post(`${API_BASE}/why-choose-us`, {
//               icon: "Shield",
//               title: "New Benefit",
//               description: "Description",
//               display_order: data.whyChooseUs.length + 1,
//             }),
//           "Item added",
//         ),
//       upd: (id, f, v) => {
//         const s = { ...data.whyChooseUs.find((x) => x.id === id), [f]: v };
//         axios.put(`${API_BASE}/why-choose-us/${id}`, s).then(loadAll);
//       },
//       del: (id) =>
//         confirm("Delete?") &&
//         withSave(
//           () => axios.delete(`${API_BASE}/why-choose-us/${id}`),
//           "Item deleted",
//         ),
//     },
//     hero: {
//       save: (e) => {
//         e.preventDefault();
//         withSave(
//           () =>
//             heroForm.id
//               ? axios.put(`${API_BASE}/hero/${heroForm.id}`, heroForm)
//               : axios.post(`${API_BASE}/hero`, heroForm),
//           "Hero saved",
//         );
//       },
//     },
//     about: {
//       save: (e) => {
//         e.preventDefault();
//         withSave(
//           () => axios.put(`${API_BASE}/about`, aboutForm),
//           "About saved",
//         );
//       },
//     },
//     careers: {
//       save: (e) => {
//         e.preventDefault();
//         withSave(
//           () => axios.put(`${API_BASE}/careers`, careForm),
//           "Careers saved",
//         );
//       },
//     },
//   };

//   const counts = {
//     services: data.services.length,
//     testimonials: data.testimonials.length,
//     industries: data.industries.length,
//     whychooseus: data.whyChooseUs.length,
//   };
//   const ALL_NAV = [
//     ...navItems,
//     { id: "profiles", label: "User Profiles", icon: Users },
//   ];
//   const activeNav = ALL_NAV.find((n) => n.id === tab);
//   const COL_ICO = "130px 1fr 2fr 65px 78px";
//   const COL_TEST = "1fr 1fr 2fr 65px 78px";
//   const sw = collapsed ? SIDEBAR_MINI : SIDEBAR_FULL;

//   if (loading)
//     return (
//       <div
//         style={{
//           ...tk.shell,
//           alignItems: "center",
//           justifyContent: "center",
//           flexDirection: "column",
//           gap: 16,
//         }}
//       >
//         <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
//         <div style={tk.brandIco}>
//           <Shield size={19} />
//         </div>
//         <Loader2
//           size={20}
//           style={{ color: "#d4af37", animation: "spin 1s linear infinite" }}
//         />
//         <span style={{ color: "#8b949e", fontSize: 13 }}>Loading portal…</span>
//       </div>
//     );

//   if (previewMode)
//     return (
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           height: "100vh",
//           background: "#010409",
//         }}
//       >
//         <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
//         <div style={tk.pvBar}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <Monitor size={14} style={{ color: "#d4af37" }} />
//             <span style={{ fontWeight: 700, fontSize: 14 }}>Site Preview</span>
//             <span
//               style={{
//                 fontSize: 11,
//                 color: "#8b949e",
//                 background: "#161b22",
//                 padding: "2px 8px",
//                 borderRadius: 20,
//                 border: "1px solid #30363d",
//               }}
//             >
//               50% scale
//             </span>
//           </div>
//           <div style={{ display: "flex", gap: 10 }}>
//             <button
//               onClick={() => window.open(SITE_URL, "_blank")}
//               style={tk.btnGreen}
//             >
//               <Globe size={13} /> Open Full Site
//             </button>
//             <button onClick={() => setPreview(false)} style={tk.btnRed}>
//               <EyeOff size={13} /> Exit Preview
//             </button>
//           </div>
//         </div>
//         <div
//           style={{
//             flex: 1,
//             overflow: "auto",
//             background: "#010409",
//             padding: 20,
//           }}
//         >
//           <div
//             style={{
//               transform: "scale(0.5)",
//               transformOrigin: "top left",
//               width: "200%",
//               background: "#0a1628",
//               borderRadius: 14,
//               overflow: "hidden",
//             }}
//           >
//             <MiniPreview data={data} />
//           </div>
//         </div>
//       </div>
//     );

//   return (
//     <>
//       <style>{`
//         @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
//         @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}
//         @keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
//         *{box-sizing:border-box} body{margin:0;background:#010409}
//         input:focus,textarea:focus,select:focus{border-color:#d4af37!important;box-shadow:0 0 0 3px rgba(212,175,55,0.09)!important;outline:none}
//         ::-webkit-scrollbar{width:5px;height:5px}
//         ::-webkit-scrollbar-track{background:#0d1117}
//         ::-webkit-scrollbar-thumb{background:#30363d;border-radius:4px}
//         button:hover{filter:brightness(1.08)}
//         button:disabled{cursor:not-allowed}
//       `}</style>

//       <Toast msg={toast.msg} type={toast.type} />
//       {showLogout && (
//         <LogoutModal
//           onCancel={() => setLogout(false)}
//           onConfirm={() => {
//             setLogout(false);
//             onLogout?.();
//           }}
//         />
//       )}

//       <div style={tk.shell}>
//         {/* ══ SIDEBAR ══ */}
//         <aside style={tk.sidebar(sw)}>
//           {/* Brand */}
//           <div style={tk.brand(collapsed)}>
//             <div style={tk.brandIco}>
//               <Shield size={17} />
//             </div>
//             {!collapsed && (
//               <div>
//                 <div style={tk.brandTxt}>SecureGuard</div>
//                 <div style={tk.brandSub}>CMS Portal</div>
//               </div>
//             )}
//           </div>

//           {/* Nav */}
//           <div style={tk.navArea}>
//             {/* Content section */}
//             {!collapsed && <span style={tk.navLbl(false)}>Content</span>}
//             {collapsed && <div style={{ height: 6 }} />}
//             {navItems.map((n) => {
//               const Icon = n.icon;
//               const a = tab === n.id;
//               const btn = (
//                 <button
//                   key={n.id}
//                   style={tk.navBtn(a, collapsed)}
//                   onClick={() => setTab(n.id)}
//                 >
//                   <Icon
//                     size={15}
//                     style={{ opacity: a ? 1 : 0.6, flexShrink: 0 }}
//                   />
//                   {!collapsed && (
//                     <>
//                       <span style={tk.navLbl2}>{n.label}</span>
//                       {n.count && (
//                         <span style={tk.navCount(a)}>{counts[n.id]}</span>
//                       )}
//                     </>
//                   )}
//                 </button>
//               );
//               return collapsed ? (
//                 <Tooltip key={n.id} text={n.label}>
//                   {btn}
//                 </Tooltip>
//               ) : (
//                 btn
//               );
//             })}

//             <div style={tk.divider} />

//             {/* Team section */}
//             {!collapsed && (
//               <span
//                 style={{ ...tk.navLbl(false), display: "block", marginTop: 4 }}
//               >
//                 Team
//               </span>
//             )}
//             {(() => {
//               const a = tab === "profiles";
//               const btn = (
//                 <button
//                   style={tk.navBtn(a, collapsed)}
//                   onClick={() => setTab("profiles")}
//                 >
//                   <Users
//                     size={15}
//                     style={{ opacity: a ? 1 : 0.6, flexShrink: 0 }}
//                   />
//                   {!collapsed && (
//                     <>
//                       <span style={tk.navLbl2}>User Profiles</span>
//                     </>
//                   )}
//                 </button>
//               );
//               return collapsed ? (
//                 <Tooltip text="User Profiles">{btn}</Tooltip>
//               ) : (
//                 btn
//               );
//             })()}

//             <div style={tk.divider} />

//             {/* Preview */}
//             {(() => {
//               const btn = (
//                 <button
//                   style={tk.navBtn(false, collapsed)}
//                   onClick={() => setPreview(true)}
//                 >
//                   <Monitor size={15} style={{ opacity: 0.6, flexShrink: 0 }} />
//                   {!collapsed && <span style={tk.navLbl2}>Preview Site</span>}
//                 </button>
//               );
//               return collapsed ? (
//                 <Tooltip text="Preview Site">{btn}</Tooltip>
//               ) : (
//                 btn
//               );
//             })()}
//           </div>

//           {/* Collapse toggle */}
//           <div style={{ padding: "8px 8px 0", borderTop: "1px solid #21262d" }}>
//             <button
//               onClick={() => setCollapsed((p) => !p)}
//               style={{
//                 ...tk.navBtn(false, false),
//                 justifyContent: collapsed ? "center" : "flex-start",
//                 borderLeft: "none",
//                 padding: "9px 10px",
//               }}
//               title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//             >
//               {collapsed ? (
//                 <ChevronRight size={15} style={{ opacity: 0.5 }} />
//               ) : (
//                 <>
//                   <ChevronLeft size={15} style={{ opacity: 0.5 }} />
//                   <span style={{ ...tk.navLbl2, fontSize: 12 }}>Collapse</span>
//                 </>
//               )}
//             </button>
//           </div>

//           {/* User widget */}
//           <div style={tk.userArea}>
//             <SidebarUser
//               onLogout={() => setLogout(true)}
//               collapsed={collapsed}
//             />
//           </div>
//         </aside>

//         {/* ══ MAIN ══ */}
//         <main style={tk.main}>
//           {/* Topbar */}
//           <header style={tk.topbar}>
//             <div style={tk.bc}>
//               <span>CMS</span>
//               <ChevronRight size={12} />
//               <span style={{ color: "#e6edf3", fontWeight: 600 }}>
//                 {activeNav?.label}
//               </span>
//             </div>
//             <div style={tk.topActs}>
//               <div style={tk.dbBadge(db.connected)} title={db.message}>
//                 <div style={tk.dbDot(db.connected)} />
//                 <span style={{ display: "none" }}>
//                   {db.connected === null
//                     ? "Checking…"
//                     : db.connected
//                       ? "DB Online"
//                       : "DB Offline"}
//                 </span>
//                 <span style={{ display: "block" }}>
//                   {db.connected === null
//                     ? "…"
//                     : db.connected
//                       ? "Online"
//                       : "Offline"}
//                 </span>
//                 <RefreshCw
//                   size={10}
//                   style={{ cursor: "pointer", opacity: 0.6 }}
//                   onClick={checkDb}
//                 />
//               </div>
//               <button style={tk.btnGhost} onClick={() => setPreview(true)}>
//                 <Monitor size={13} /> Preview
//               </button>
//               <button style={tk.btnRed} onClick={() => setLogout(true)}>
//                 <LogOut size={13} /> Sign Out
//               </button>
//             </div>
//           </header>

//           {/* Content */}
//           <div style={tk.scroller}>
//             {/* ── SERVICES ── */}
//             {tab === "services" && (
//               <section>
//                 <div style={tk.pgHead}>
//                   <div style={tk.pgTitle}>Services</div>
//                   <div style={tk.pgDesc}>
//                     Security services displayed on your homepage.
//                   </div>
//                 </div>
//                 <StatStrip
//                   items={[
//                     { label: "Total", value: data.services.length },
//                     { label: "Live", value: data.services.length },
//                     { label: "Last Sync", value: "Just now" },
//                   ]}
//                 />
//                 <div style={tk.toolbar}>
//                   <span style={tk.tblCount}>
//                     {data.services.length} record
//                     {data.services.length !== 1 ? "s" : ""}
//                   </span>
//                   <button onClick={C.svc.add} style={tk.btnGold}>
//                     <Plus size={14} /> Add Service
//                   </button>
//                 </div>
//                 <div style={tk.table}>
//                   <div style={tk.thead(COL_ICO)}>
//                     <div style={tk.th}>Icon</div>
//                     <div style={tk.th}>Title</div>
//                     <div style={tk.th}>Description</div>
//                     <div style={tk.th}>Order</div>
//                     <div style={tk.th}>Action</div>
//                   </div>
//                   {data.services.length === 0 && (
//                     <div style={tk.empty}>No services yet.</div>
//                   )}
//                   {data.services.map((s) => (
//                     <TRow
//                       key={s.id}
//                       cols={COL_ICO}
//                       onDelete={() => C.svc.del(s.id)}
//                     >
//                       <select
//                         style={tk.sel}
//                         value={s.icon}
//                         onChange={(e) =>
//                           C.svc.upd(s.id, "icon", e.target.value)
//                         }
//                       >
//                         {iconOptions.map((o) => (
//                           <option key={o.value} value={o.value}>
//                             {o.label}
//                           </option>
//                         ))}
//                       </select>
//                       <input
//                         style={tk.inp}
//                         value={s.title}
//                         onChange={(e) =>
//                           C.svc.upd(s.id, "title", e.target.value)
//                         }
//                       />
//                       <textarea
//                         style={tk.ta}
//                         value={s.description}
//                         onChange={(e) =>
//                           C.svc.upd(s.id, "description", e.target.value)
//                         }
//                       />
//                       <input
//                         style={tk.inp}
//                         type="number"
//                         value={s.display_order}
//                         onChange={(e) =>
//                           C.svc.upd(
//                             s.id,
//                             "display_order",
//                             parseInt(e.target.value),
//                           )
//                         }
//                       />
//                     </TRow>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* ── TESTIMONIALS ── */}
//             {tab === "testimonials" && (
//               <section>
//                 <div style={tk.pgHead}>
//                   <div style={tk.pgTitle}>Testimonials</div>
//                   <div style={tk.pgDesc}>
//                     Client reviews shown on your homepage.
//                   </div>
//                 </div>
//                 <StatStrip
//                   items={[
//                     { label: "Total Reviews", value: data.testimonials.length },
//                     { label: "Displayed", value: data.testimonials.length },
//                   ]}
//                 />
//                 <div style={tk.toolbar}>
//                   <span style={tk.tblCount}>
//                     {data.testimonials.length} record
//                     {data.testimonials.length !== 1 ? "s" : ""}
//                   </span>
//                   <button onClick={C.test.add} style={tk.btnGold}>
//                     <Plus size={14} /> Add Testimonial
//                   </button>
//                 </div>
//                 <div style={tk.table}>
//                   <div style={tk.thead(COL_TEST)}>
//                     <div style={tk.th}>Author</div>
//                     <div style={tk.th}>Role</div>
//                     <div style={tk.th}>Testimonial</div>
//                     <div style={tk.th}>Order</div>
//                     <div style={tk.th}>Action</div>
//                   </div>
//                   {data.testimonials.length === 0 && (
//                     <div style={tk.empty}>No testimonials yet.</div>
//                   )}
//                   {data.testimonials.map((s) => (
//                     <TRow
//                       key={s.id}
//                       cols={COL_TEST}
//                       onDelete={() => C.test.del(s.id)}
//                     >
//                       <input
//                         style={tk.inp}
//                         value={s.author}
//                         onChange={(e) =>
//                           C.test.upd(s.id, "author", e.target.value)
//                         }
//                       />
//                       <input
//                         style={tk.inp}
//                         value={s.role}
//                         onChange={(e) =>
//                           C.test.upd(s.id, "role", e.target.value)
//                         }
//                       />
//                       <textarea
//                         style={tk.ta}
//                         value={s.text}
//                         onChange={(e) =>
//                           C.test.upd(s.id, "text", e.target.value)
//                         }
//                       />
//                       <input
//                         style={tk.inp}
//                         type="number"
//                         value={s.display_order}
//                         onChange={(e) =>
//                           C.test.upd(
//                             s.id,
//                             "display_order",
//                             parseInt(e.target.value),
//                           )
//                         }
//                       />
//                     </TRow>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* ── INDUSTRIES ── */}
//             {tab === "industries" && (
//               <section>
//                 <div style={tk.pgHead}>
//                   <div style={tk.pgTitle}>Industries</div>
//                   <div style={tk.pgDesc}>Sectors your company serves.</div>
//                 </div>
//                 <div style={tk.toolbar}>
//                   <span style={tk.tblCount}>
//                     {data.industries.length} record
//                     {data.industries.length !== 1 ? "s" : ""}
//                   </span>
//                   <button onClick={C.ind.add} style={tk.btnGold}>
//                     <Plus size={14} /> Add Industry
//                   </button>
//                 </div>
//                 <div style={tk.table}>
//                   <div style={tk.thead(COL_ICO)}>
//                     <div style={tk.th}>Icon</div>
//                     <div style={tk.th}>Title</div>
//                     <div style={tk.th}>Description</div>
//                     <div style={tk.th}>Order</div>
//                     <div style={tk.th}>Action</div>
//                   </div>
//                   {data.industries.length === 0 && (
//                     <div style={tk.empty}>No industries yet.</div>
//                   )}
//                   {data.industries.map((s) => (
//                     <TRow
//                       key={s.id}
//                       cols={COL_ICO}
//                       onDelete={() => C.ind.del(s.id)}
//                     >
//                       <select
//                         style={tk.sel}
//                         value={s.icon}
//                         onChange={(e) =>
//                           C.ind.upd(s.id, "icon", e.target.value)
//                         }
//                       >
//                         {iconOptions.map((o) => (
//                           <option key={o.value} value={o.value}>
//                             {o.label}
//                           </option>
//                         ))}
//                       </select>
//                       <input
//                         style={tk.inp}
//                         value={s.title}
//                         onChange={(e) =>
//                           C.ind.upd(s.id, "title", e.target.value)
//                         }
//                       />
//                       <textarea
//                         style={tk.ta}
//                         value={s.description}
//                         onChange={(e) =>
//                           C.ind.upd(s.id, "description", e.target.value)
//                         }
//                       />
//                       <input
//                         style={tk.inp}
//                         type="number"
//                         value={s.display_order}
//                         onChange={(e) =>
//                           C.ind.upd(
//                             s.id,
//                             "display_order",
//                             parseInt(e.target.value),
//                           )
//                         }
//                       />
//                     </TRow>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* ── WHY CHOOSE US ── */}
//             {tab === "whychooseus" && (
//               <section>
//                 <div style={tk.pgHead}>
//                   <div style={tk.pgTitle}>Why Choose Us</div>
//                   <div style={tk.pgDesc}>
//                     Key differentiators and value propositions.
//                   </div>
//                 </div>
//                 <div style={tk.toolbar}>
//                   <span style={tk.tblCount}>
//                     {data.whyChooseUs.length} record
//                     {data.whyChooseUs.length !== 1 ? "s" : ""}
//                   </span>
//                   <button onClick={C.why.add} style={tk.btnGold}>
//                     <Plus size={14} /> Add Item
//                   </button>
//                 </div>
//                 <div style={tk.table}>
//                   <div style={tk.thead(COL_ICO)}>
//                     <div style={tk.th}>Icon</div>
//                     <div style={tk.th}>Title</div>
//                     <div style={tk.th}>Description</div>
//                     <div style={tk.th}>Order</div>
//                     <div style={tk.th}>Action</div>
//                   </div>
//                   {data.whyChooseUs.length === 0 && (
//                     <div style={tk.empty}>No items yet.</div>
//                   )}
//                   {data.whyChooseUs.map((s) => (
//                     <TRow
//                       key={s.id}
//                       cols={COL_ICO}
//                       onDelete={() => C.why.del(s.id)}
//                     >
//                       <select
//                         style={tk.sel}
//                         value={s.icon}
//                         onChange={(e) =>
//                           C.why.upd(s.id, "icon", e.target.value)
//                         }
//                       >
//                         {iconOptions.map((o) => (
//                           <option key={o.value} value={o.value}>
//                             {o.label}
//                           </option>
//                         ))}
//                       </select>
//                       <input
//                         style={tk.inp}
//                         value={s.title}
//                         onChange={(e) =>
//                           C.why.upd(s.id, "title", e.target.value)
//                         }
//                       />
//                       <textarea
//                         style={tk.ta}
//                         value={s.description}
//                         onChange={(e) =>
//                           C.why.upd(s.id, "description", e.target.value)
//                         }
//                       />
//                       <input
//                         style={tk.inp}
//                         type="number"
//                         value={s.display_order}
//                         onChange={(e) =>
//                           C.why.upd(
//                             s.id,
//                             "display_order",
//                             parseInt(e.target.value),
//                           )
//                         }
//                       />
//                     </TRow>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* ── HERO ── */}
//             {tab === "hero" && (
//               <section>
//                 <div style={tk.pgHead}>
//                   <div style={tk.pgTitle}>Hero Banner</div>
//                   <div style={tk.pgDesc}>
//                     Headline, subtitle, and background for the top section.
//                   </div>
//                 </div>
//                 <form onSubmit={C.hero.save}>
//                   <div style={tk.formCard}>
//                     <FG label="Background Image URL">
//                       <input
//                         style={tk.inp}
//                         value={heroForm.image_url || ""}
//                         placeholder="https://…/image.jpg"
//                         onChange={(e) =>
//                           setHeroForm({
//                             ...heroForm,
//                             image_url: e.target.value,
//                           })
//                         }
//                       />
//                       <ImgPrev url={heroForm.image_url} />
//                     </FG>
//                     <FG label="Headline">
//                       <input
//                         style={tk.inp}
//                         value={heroForm.headline || ""}
//                         placeholder="Professional Security Solutions…"
//                         onChange={(e) =>
//                           setHeroForm({ ...heroForm, headline: e.target.value })
//                         }
//                       />
//                     </FG>
//                     <FG label="Subtitle">
//                       <textarea
//                         style={tk.ta}
//                         value={heroForm.subtitle || ""}
//                         placeholder="24/7 protection services…"
//                         onChange={(e) =>
//                           setHeroForm({ ...heroForm, subtitle: e.target.value })
//                         }
//                       />
//                     </FG>
//                     <button
//                       type="submit"
//                       disabled={saving}
//                       style={{ ...tk.btnGold, opacity: saving ? 0.7 : 1 }}
//                     >
//                       {saving ? (
//                         <Loader2
//                           size={13}
//                           style={{ animation: "spin 1s linear infinite" }}
//                         />
//                       ) : (
//                         <Save size={13} />
//                       )}
//                       {saving ? "Saving…" : "Save Hero"}
//                     </button>
//                   </div>
//                 </form>
//               </section>
//             )}

//             {/* ── ABOUT ── */}
//             {tab === "about" && (
//               <section>
//                 <div style={tk.pgHead}>
//                   <div style={tk.pgTitle}>About Section</div>
//                   <div style={tk.pgDesc}>Company story and credentials.</div>
//                 </div>
//                 <form onSubmit={C.about.save}>
//                   <div style={tk.formCard}>
//                     <FG label="Title">
//                       <input
//                         style={tk.inp}
//                         value={aboutForm.title || ""}
//                         placeholder="About SecureGuard"
//                         onChange={(e) =>
//                           setAboutForm({ ...aboutForm, title: e.target.value })
//                         }
//                       />
//                     </FG>
//                     <FG label="Description">
//                       <textarea
//                         style={{ ...tk.ta, minHeight: 110 }}
//                         value={aboutForm.description || ""}
//                         onChange={(e) =>
//                           setAboutForm({
//                             ...aboutForm,
//                             description: e.target.value,
//                           })
//                         }
//                       />
//                     </FG>
//                     <FG label="Image URL">
//                       <input
//                         style={tk.inp}
//                         value={aboutForm.image_url || ""}
//                         placeholder="https://…"
//                         onChange={(e) =>
//                           setAboutForm({
//                             ...aboutForm,
//                             image_url: e.target.value,
//                           })
//                         }
//                       />
//                       <ImgPrev url={aboutForm.image_url} />
//                     </FG>
//                     <button
//                       type="submit"
//                       disabled={saving}
//                       style={{ ...tk.btnGold, opacity: saving ? 0.7 : 1 }}
//                     >
//                       {saving ? (
//                         <Loader2
//                           size={13}
//                           style={{ animation: "spin 1s linear infinite" }}
//                         />
//                       ) : (
//                         <Save size={13} />
//                       )}
//                       {saving ? "Saving…" : "Save About"}
//                     </button>
//                   </div>
//                 </form>
//               </section>
//             )}

//             {/* ── CAREERS ── */}
//             {tab === "careers" && (
//               <section>
//                 <div style={tk.pgHead}>
//                   <div style={tk.pgTitle}>Careers Section</div>
//                   <div style={tk.pgDesc}>Attract the best talent.</div>
//                 </div>
//                 <form onSubmit={C.careers.save}>
//                   <div style={tk.formCard}>
//                     <FG label="Title">
//                       <input
//                         style={tk.inp}
//                         value={careForm.title || ""}
//                         placeholder="Join Our Team"
//                         onChange={(e) =>
//                           setCareForm({ ...careForm, title: e.target.value })
//                         }
//                       />
//                     </FG>
//                     <FG label="Description">
//                       <textarea
//                         style={{ ...tk.ta, minHeight: 110 }}
//                         value={careForm.description || ""}
//                         onChange={(e) =>
//                           setCareForm({
//                             ...careForm,
//                             description: e.target.value,
//                           })
//                         }
//                       />
//                     </FG>
//                     <FG label="Image URL">
//                       <input
//                         style={tk.inp}
//                         value={careForm.image_url || ""}
//                         placeholder="https://…"
//                         onChange={(e) =>
//                           setCareForm({
//                             ...careForm,
//                             image_url: e.target.value,
//                           })
//                         }
//                       />
//                       <ImgPrev url={careForm.image_url} />
//                     </FG>
//                     <button
//                       type="submit"
//                       disabled={saving}
//                       style={{ ...tk.btnGold, opacity: saving ? 0.7 : 1 }}
//                     >
//                       {saving ? (
//                         <Loader2
//                           size={13}
//                           style={{ animation: "spin 1s linear infinite" }}
//                         />
//                       ) : (
//                         <Save size={13} />
//                       )}
//                       {saving ? "Saving…" : "Save Careers"}
//                     </button>
//                   </div>
//                 </form>
//               </section>
//             )}

//             {/* ── PROFILES ── */}
//             {tab === "profiles" && <ProfilesTab showToast={showToast} />}
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }
