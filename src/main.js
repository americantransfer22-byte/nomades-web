import { supabase } from './services/supabase.js'

// ============ SISTEMA VISUAL NÓMADES ============
const NOM = {
  fondo:'#F7F4EC', superficie:'#FFFFFF', tinta:'#1C2617', tintaSuave:'#8A8A80',
  verde:'#2F4D2A', verdeClaro:'#EAF0DC', verdePastel:'#9FB88A',
  ambar:'#C4761F', ambarClaro:'#FBE9D4', rojo:'#B03A2E',
  borde:'rgba(28,38,23,0.09)', bordeFuerte:'rgba(28,38,23,0.16)'
}

const IC = {
  panel:'<path d="M4 19V10M10 19V5M16 19v-6"/>',
  paquete:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5L12 12l8-4.5M12 12v9"/>',
  telefono:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z"/>',
  personas:'<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0112 0M16 6a3 3 0 010 6M18 20a5 5 0 00-2-4"/>',
  mas:'<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  camion:'<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  moneda:'<circle cx="12" cy="12" r="8"/><path d="M15 9.5A3 3 0 0012 8c-1.7 0-3 .9-3 2s1.3 2 3 2 3 .9 3 2-1.3 2-3 2a3 3 0 01-3-1.5M12 6.5v11"/>',
  planilla:'<path d="M8 4h8a1 1 0 011 1v15a1 1 0 01-1 1H8a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M10 3h4v3h-4zM10 11h5M10 15h5"/>',
  carrito:'<circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/><path d="M3 4h2l2.5 10h10L20 7H6"/>',
  estrella:'<path d="M12 4l2.4 5 5.6.7-4 3.9 1 5.4-5-2.7-5 2.7 1-5.4-4-3.9 5.6-.7z"/>',
  huevo:'<path d="M12 3c3.5 0 6 4.8 6 9a6 6 0 01-12 0c0-4.2 2.5-9 6-9z"/>',
  reloj:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  check:'<path d="M4 12.5l5.5 5.5L20 7"/>',
  cerrar:'<path d="M6 6l12 12M18 6L6 18"/>',
  flechaIzq:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
  camara:'<path d="M3 8h3l2-3h8l2 3h3v12H3z"/><circle cx="12" cy="13" r="4"/>',
  grafico:'<path d="M4 20V10M10 20V4M16 20v-7M22 20V8"/>',
  botella:'<path d="M10 2h4v3.5l2 3V21a1 1 0 01-1 1H9a1 1 0 01-1-1V8.5l2-3z"/><path d="M8 13h8"/>',
  mapa:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  moto:'<circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/><path d="M8 17h8l-4-7H8M14 10h4l2 4"/>',
  canasta:'<path d="M4 9h16l-1.5 10h-13z"/><path d="M8 9l2-5M16 9l-2-5"/>',
  calendario:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  tarjeta:'<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 15h4"/>',
  recibo:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  trofeo:'<path d="M8 4h8v5a4 4 0 01-8 0z"/><path d="M8 6H5v1a3 3 0 003 3M16 6h3v1a3 3 0 01-3 3M10 14h4l.5 6h-5z"/>',
  vendedor:'<circle cx="12" cy="7" r="3"/><path d="M5 21a7 7 0 0114 0"/><path d="M15 12l1.5 3 3-1"/>',
  tienda:'<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0"/><path d="M9 20v-6h6v6"/>',
  aviso:'<path d="M12 3l9 16H3l9-16z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/>',
  idea:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3.5 10.9c.4.3.5.7.5 1.1h6c0-.4.1-.8.5-1.1A6 6 0 0012 3z"/>',
  lupa:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
  engranaje:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  salir:'<path d="M14 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4"/><path d="M9 8l-4 4 4 4M5 12h11"/>',
  flecha:'<path d="M15 6l-6 6 6 6"/>',
  historial:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
  fabrica:'<path d="M3 21V10l6 4V10l6 4V6l6 3v12z"/>',
  campana:'<path d="M6 16V10a6 6 0 1112 0v6l2 2H4z"/><path d="M10 21h4"/>'
}

function ico(nombre, size, color){
  const p = IC[nombre]
  if(!p) return ''
  const s = size || 20
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color||'currentColor'}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;vertical-align:middle">${p}</svg>`
}

// Carto empezó a exigir clave de API y estampaba "API KEY REQUIRED" sobre el mapa.
// Los mapas de OpenStreetMap son libres y no piden nada.
const TILES_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILES_ATRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

// ============ DISTANCIAS ============
// Fórmula del haversine: distancia en línea recta sobre la esfera terrestre.
// NO es la distancia manejando — por calle siempre da más. Se etiqueta como tal.
function distanciaKm(lat1, lon1, lat2, lon2){
  if([lat1,lon1,lat2,lon2].some(v=>v==null||isNaN(Number(v)))) return null
  const R = 6371
  const rad = g => Number(g) * Math.PI / 180
  const dLat = rad(lat2) - rad(lat1)
  const dLon = rad(lon2) - rad(lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
function formatearKm(km){
  if(km == null) return ''
  if(km < 1) return `${Math.round(km*1000)} m`
  return `${km.toFixed(km<10?1:0)} km`
}

const EMOJI_ICONO = {
  '🔍':'lupa','👥':'personas','🗺️':'mapa','🚚':'camion','🏍️':'moto','🧺':'canasta',
  '🥚':'huevo','📅':'calendario','💳':'tarjeta','🧾':'recibo','🏆':'trofeo','⭐':'estrella',
  '🛒':'carrito','📋':'planilla','💼':'moneda','⏰':'campana','📞':'telefono','🧑‍💼':'vendedor',
  '💡':'idea','💰':'moneda','📊':'panel','📦':'paquete','⚙️':'engranaje'
}

const app = document.querySelector('#app')
let current = 'inicio'
let session = null
let myRole = null // rol principal
let myRoles = [] // todos los roles de la persona
let cuenta = null // datos del cliente logueado por DNI
let staffProfile = null // datos del perfil del trabajador logueado
let adminOpenSection = null // qué sección del acordeón de admin está abierta
let adminAreaAbierta = null // qué área del panel está abierta (null = pantalla de áreas)
let adminDetalleTipo = null // qué tarjeta de resumen se está viendo en detalle

const ICONOS_NAV = {
  admin:'panel', pedidos:'paquete', telefonico:'telefono', clientes:'personas', preparador:'canasta',
  repartidor:'camion', campo:'huevo', vendedor:'vendedor', gasto:'moneda', 'alta-comercio':'tienda', 'mayoristas-riesgo':'aviso', deudores:'moneda', fincanales:'grafico', vehiculo:'moto', historial:'historial',
  'mis-suscriptores':'personas', 'mis-comisiones':'moneda', perfil:'engranaje', logout:'salir',
  merma:'campana', vencimientos:'calendario', avisos:'campana', inicio:'huevo'
}

const MENU_POR_ROL = {
  admin: [['admin','Hoy'],['pedidos','Pedidos'],['telefonico','Teléfono'],['clientes','Clientes'],['preparador','Preparar'],['repartidor','Repartidor'],['campo','Campo'],['vendedor','Vender'],['vehiculo','Mi vehículo'],['gasto','Cargar gasto'],['vencimientos','Vencimientos'],['merma','Registrar pérdida'],['avisos','Avisos'],['inicio','Ver la tienda']],
  campo: [['campo','Campo'],['merma','Registrar pérdida'],['inicio','Ver la tienda']],
  repartidor: [['repartidor','Ruta'],['historial','Historial'],['vehiculo','Mi vehículo'],['gasto','Cargar gasto'],['merma','Registrar pérdida'],['inicio','Ver la tienda']],
  preparador: [['preparador','Preparar'],['vencimientos','Vencimientos'],['merma','Registrar pérdida'],['inicio','Ver la tienda']],
  vendedor: [['vendedor','Vender'],['alta-comercio','Comercio'],['mis-suscriptores','Suscriptores'],['mis-comisiones','Comisiones'],['inicio','Ver la tienda']],
  telefonico: [['telefonico','Teléfono'],['inicio','Ver la tienda']]
}

const ORDEN_ROLES = ['admin','telefonico','preparador','repartidor','campo','vendedor']

function rolesActivos(){
  const base = (Array.isArray(myRoles) && myRoles.length) ? myRoles : (myRole ? [myRole] : [])
  return [...base].sort((a,b)=>{
    const ia = ORDEN_ROLES.indexOf(a), ib = ORDEN_ROLES.indexOf(b)
    return (ia<0?99:ia) - (ib<0?99:ib)
  })
}

function tengoRol(rol){ return rolesActivos().includes(rol) }

function navStaffFor(){
  const roles = rolesActivos()
  if(!roles.length) return []
  const items = []
  const vistos = {}
  roles.forEach(r=>{
    (MENU_POR_ROL[r]||[]).forEach(([k,l])=>{ if(!vistos[k]){ vistos[k]=1; items.push([k,l]) } })
  })
  items.push(['perfil','Mi perfil'])
  return items
}

function pantallaInicialSegunRoles(){
  const orden = ['admin','telefonico','preparador','repartidor','campo','vendedor']
  const roles = rolesActivos()
  const primero = orden.find(r=>roles.includes(r))
  return primero === 'admin' ? 'admin' : (primero || 'perfil')
}

function logoSVG(size){
  return `<svg width="${size}" height="${size}" viewBox="0 0 140 140" role="img" aria-label="Escudo NÓMADES"><circle cx="70" cy="70" r="66" fill="none" stroke="#2F4D2A" stroke-width="1.5"/><path d="M20 70 Q30 40 55 30 Q40 50 38 70 Q40 90 55 110 Q30 100 20 70 Z" fill="#8FAE6B"/><path d="M120 70 Q110 40 85 30 Q100 50 102 70 Q100 90 85 110 Q110 100 120 70 Z" fill="#8FAE6B"/><ellipse cx="70" cy="72" rx="20" ry="26" fill="#F5EFE0" stroke="#2F4D2A" stroke-width="1.2"/><path d="M62 48 C66 40 74 40 76 48" stroke="#2F4D2A" stroke-width="1.2" fill="none"/><rect x="35" y="98" width="70" height="16" rx="2" fill="#2F4D2A"/><text x="70" y="109" text-anchor="middle" font-size="9" fill="#F5EFE0" font-family="sans-serif" letter-spacing="1">NÓMADES</text></svg>`
}

let leafletCargando = null
function cargarLeaflet(){
  if(window.L) return Promise.resolve()
  if(leafletCargando) return leafletCargando
  leafletCargando = new Promise((resolve, reject)=>{
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = ()=>resolve()
    script.onerror = ()=>reject(new Error('No se pudo cargar el mapa'))
    document.head.appendChild(script)
  })
  return leafletCargando
}

async function geocodificarDireccion(direccion){
  try{
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&countrycodes=ar&q=${encodeURIComponent(direccion)}`
    const res = await fetch(url, { headers: { 'Accept-Language': 'es' } })
    const data = await res.json()
    if(data && data[0]) return { lat: Number(data[0].lat), lon: Number(data[0].lon), clase: data[0].type||'', detalle: data[0].address||{} }
  }catch(e){}
  return null
}

// Arma la dirección con la localidad y provincia REALES del cliente.
// Antes decía "Rosario" fijo y por eso ningún cliente de Funes, Roldán o Ricardone se encontraba nunca.
function direccionParaBuscar(c){
  const calle = `${c.street||''} ${c.street_number||''}`.trim()
  const localidad = (c.city||'').trim() || 'Rosario'
  const provincia = (c.province||'').trim() || 'Santa Fe'
  return [calle, localidad, provincia, 'Argentina'].filter(Boolean).join(', ')
}

// Decide si el resultado se puede dar por bueno o hay que revisarlo a mano.
// Nominatim devuelve el centro de la ciudad cuando no encuentra la calle: eso NO es una ubicación.
function evaluarGeo(geo, c){
  if(!geo) return { estado:'sin_ubicar', motivo:'No se encontró la dirección' }
  const tipo = geo.clase || ''
  const casa = ['house','building','residential','yes'].includes(tipo)
  const calle = ['road','street','residential_road','tertiary','secondary','primary','unclassified'].includes(tipo)
  if(!geo.detalle?.road && !casa && !calle) return { estado:'dudoso', motivo:'Se ubicó el barrio, no la calle' }
  const localidadCliente = (c.city||'').trim().toLowerCase()
  const localidadGeo = (geo.detalle?.city || geo.detalle?.town || geo.detalle?.village || geo.detalle?.municipality || '').trim().toLowerCase()
  if(localidadCliente && localidadGeo && !localidadGeo.includes(localidadCliente) && !localidadCliente.includes(localidadGeo)){
    return { estado:'dudoso', motivo:`Cayó en ${geo.detalle.city||geo.detalle.town||geo.detalle.village}, no en ${c.city}` }
  }
  if(casa) return { estado:'confirmado', motivo:null }
  return { estado:'dudoso', motivo:'Se ubicó la calle, falta afinar la altura' }
}

// Ubica un cliente recién dado de alta. Nunca frena el alta: si falla, queda pendiente.
async function ubicarClienteNuevo(customerId, datos, dni){
  if(!customerId) return null
  try{
    const geo = await geocodificarDireccion(direccionParaBuscar(datos))
    const veredicto = evaluarGeo(geo, datos)
    if(veredicto.estado === 'sin_ubicar'){
      await supabase.rpc('marcar_geo_fallido', { p_customer_id: customerId, p_motivo: veredicto.motivo })
      return veredicto
    }
    if(dni){
      await supabase.rpc('customer_set_location', { p_dni: dni, p_customer_id: customerId, p_latitude: geo.lat, p_longitude: geo.lon, p_estado: veredicto.estado, p_motivo: veredicto.motivo })
    } else {
      await supabase.rpc('admin_set_customer_location', { p_customer_id: customerId, p_latitude: geo.lat, p_longitude: geo.lon, p_estado: veredicto.estado, p_motivo: veredicto.motivo })
    }
    return veredicto
  }catch(e){ return null }
}

let menuMasAbierto = false

function layout(content){
  const esMayorista = current==='mayorista-login' || current==='mayorista-panel' || current==='mayorista-landing' || current==='mayorista-signup'
  const setupPerfil = current==='staff-profile-setup'
  const items = (esMayorista || setupPerfil) ? [] : session ? navStaffFor() : []

  // Las 4 primeras van a la barra; el resto vive en "Más"
  const principales = items.slice(0, 4)
  const secundarios = items.slice(4)
  const enSecundarios = secundarios.some(([k])=>k===current)

  const barra = (items.length && !esMayorista && !setupPerfil) ? `
    <nav style="position:fixed;left:0;right:0;bottom:0;z-index:900;background:#FFFFFF;border-top:1px solid #E3DCC8;display:flex;padding:6px 4px calc(6px + env(safe-area-inset-bottom));box-shadow:0 -2px 12px rgba(0,0,0,0.06)">
      ${principales.map(([k,l])=>`<button data-nav="${k}" style="flex:1;background:none;border:none;padding:7px 2px 5px;display:flex;flex-direction:column;align-items:center;gap:3px">
        ${ico(ICONOS_NAV[k]||'panel', 21, current===k?NOM.verde:'#A8A89E')}
        <span style="font-size:10px;font-weight:500;color:${current===k?NOM.verde:NOM.tintaSuave};white-space:nowrap">${l}</span>
        <span style="width:16px;height:2px;border-radius:1px;background:${current===k?NOM.verde:'transparent'}"></span>
      </button>`).join('')}
      ${secundarios.length?`<button id="btn_menu_mas" style="flex:1;background:none;border:none;padding:7px 2px 5px;display:flex;flex-direction:column;align-items:center;gap:3px">
        ${ico('mas', 21, (enSecundarios||menuMasAbierto)?NOM.verde:'#A8A89E')}
        <span style="font-size:10px;font-weight:500;color:${(enSecundarios||menuMasAbierto)?NOM.verde:NOM.tintaSuave}">Más</span>
        <span style="width:16px;height:2px;border-radius:1px;background:${(enSecundarios||menuMasAbierto)?NOM.verde:'transparent'}"></span>
      </button>`:''}
    </nav>` : ''

  const hoja = menuMasAbierto ? `
    <div id="menu_mas_fondo" style="position:fixed;inset:0;background:rgba(31,42,27,0.45);z-index:950"></div>
    <div style="position:fixed;left:0;right:0;bottom:0;z-index:960;background:#FFFFFF;border-radius:18px 18px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom));max-height:75vh;overflow-y:auto">
      <div style="width:38px;height:4px;background:#E3DCC8;border-radius:2px;margin:0 auto 14px"></div>
      ${staffProfile?`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">${pAvatar(staffProfile.full_name,38)}<div><div style="font-weight:700;color:#2F4D2A;font-size:14px">${staffProfile.full_name||''}</div><div style="font-size:11px;color:#8A8A80">${rolesActivos().map(r=>({admin:'Administrador',campo:'Campo',repartidor:'Repartidor',preparador:'Preparador',vendedor:'Vendedor',telefonico:'Telefónico'})[r]||r).join(' · ')}</div></div></div>`:''}
      ${secundarios.map(([k,l])=>`<button data-nav="${k}" style="width:100%;background:${current===k?NOM.verdeClaro:NOM.superficie};border:1px solid ${NOM.borde};border-radius:12px;padding:13px 14px;margin-bottom:7px;display:flex;align-items:center;gap:12px;font-size:14px;color:${NOM.tinta};font-weight:500">
        ${ico(ICONOS_NAV[k]||'panel', 19, NOM.verde)}${l}
      </button>`).join('')}
      <button data-nav="logout" style="width:100%;background:${NOM.superficie};border:1px solid rgba(176,58,46,0.22);border-radius:12px;padding:13px 14px;margin-top:6px;display:flex;align-items:center;gap:12px;font-size:14px;color:${NOM.rojo};font-weight:500">
        ${ico('salir', 19, NOM.rojo)}Cerrar sesión
      </button>
    </div>` : ''

  const navPublica = (!session && !esMayorista) ? `<div class="nav">${[['inicio','Inicio'],['cuenta','Mi cuenta']].map(([k,l])=>`<button class="btn ${current===k?'primary':'ghost'}" data-nav="${k}">${l}</button>`).join('')}</div>` : ''
  const volverPanel = (session && current==='inicio') ? `<div style="background:${NOM.verdeClaro};border-radius:12px;padding:11px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px">
      <span style="font-size:13px;color:${NOM.tinta}">Estás viendo la tienda como la ve un cliente</span>
      <button data-nav="${pantallaInicialSegunRoles()}" style="background:${NOM.verde};color:#F7F4EC;border:none;border-radius:9px;padding:8px 14px;font-size:12.5px;font-weight:500;white-space:nowrap">Volver al panel</button>
    </div>` : ''
  const navSetup = setupPerfil ? `<div class="nav"><button class="btn ghost" data-nav="logout">Salir</button></div>` : ''

  app.innerHTML = `<div class="shell" style="padding-bottom:${barra?'86px':'0'}">
    <div class="top"><div class="brand" style="display:flex;align-items:center;gap:8px">NÓMADES <span class="muted" style="font-size:12px">${esMayorista?'Portal mayoristas':'Huevos de libre pastoreo'}</span></div>${navPublica}${navSetup}</div>
    ${volverPanel}
    ${content}
    ${(!session && !esMayorista)?`<div style="text-align:center;margin-top:24px"><a href="#" id="staff_link" class="muted" style="font-size:12px">Acceso del equipo</a></div>`:''}
  </div>${barra}${hoja}`

  document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=async ()=>{
    menuMasAbierto = false
    if(b.dataset.nav==='logout'){ await supabase.auth.signOut(); session=null; myRole=null; myRoles=[]; current='inicio'; return render() }
    if(b.dataset.nav==='admin'){ adminData = null; adminOpenSection = null; adminAreaAbierta = null }
    current=b.dataset.nav; render()
  })
  const btnMas = document.querySelector('#btn_menu_mas')
  if(btnMas) btnMas.onclick = ()=>{ menuMasAbierto = !menuMasAbierto; render() }
  const fondo = document.querySelector('#menu_mas_fondo')
  if(fondo) fondo.onclick = ()=>{ menuMasAbierto = false; render() }
  const staffLink = document.querySelector('#staff_link')
  if(staffLink) staffLink.onclick=(e)=>{ e.preventDefault(); current='staff-login'; render() }
}

async function q(table, select='*'){
  const {data,error}=await supabase.from(table).select(select)
  if(error){console.warn(error);return []}
  return data||[]
}

function personaIlustracion(){
  return `<svg width="100%" viewBox="0 0 340 200" role="img" aria-label="Ilustración de persona sosteniendo un maple de huevos">
  <rect x="0" y="140" width="340" height="60" fill="#EAF0DC"/>
  <rect x="0" y="0" width="340" height="140" fill="#F5EFE0"/>
  <ellipse cx="170" cy="185" rx="55" ry="8" fill="#C9D8B0"/>
  <path d="M170 60 C150 60 140 80 140 100 L145 175 L195 175 L200 100 C200 80 190 60 170 60 Z" fill="#4A6B3A"/>
  <ellipse cx="170" cy="42" rx="20" ry="22" fill="#E8B98C"/>
  <path d="M150 40 C150 25 190 25 190 40 C190 30 150 30 150 40 Z" fill="#2F4D2A"/>
  <rect x="120" y="115" width="100" height="42" rx="4" fill="#D8C39A" stroke="#8A6E3E" stroke-width="1.5"/>
  <circle cx="140" cy="136" r="10" fill="#F5EFE0" stroke="#8A6E3E" stroke-width="1"/>
  <circle cx="165" cy="136" r="10" fill="#F5EFE0" stroke="#8A6E3E" stroke-width="1"/>
  <circle cx="190" cy="136" r="10" fill="#F5EFE0" stroke="#8A6E3E" stroke-width="1"/>
  <circle cx="200" cy="136" r="10" fill="#F5EFE0" stroke="#8A6E3E" stroke-width="1"/>
  <path d="M100 100 C90 90 90 75 105 75 C110 60 130 60 135 75 C150 75 150 95 135 100 Z" fill="#8FAE6B" opacity="0.6"/>
  <path d="M235 90 C225 80 225 65 240 65 C245 50 265 50 270 65 C285 65 285 85 270 90 Z" fill="#8FAE6B" opacity="0.6"/>
</svg>`
}

function inicio(){
  layout(`
<img src="./img/logo.jpg" alt="Granja Nómades — gallinas de huevos pastoriles, libres por naturaleza" style="width:100%;border-radius:14px;margin-bottom:14px;display:block"/>

<div style="background:${NOM.verde};border-radius:12px;padding:13px 16px;margin-bottom:16px;text-align:center">
  <p style="margin:0;font-size:14px;font-weight:500;color:#F5EFE0">Comprá directo al productor</p>
  <p style="margin:5px 0 0;font-size:12px;color:#C9D8B0;line-height:1.45">Del nido a tu mesa en 2 días, no en 2 semanas de supermercado</p>
</div>

<p style="margin:0 0 7px;font-size:11px;letter-spacing:1.4px;color:#8A8570">NATURALES • FRESCOS • REALES</p>
<h1 style="margin:0 0 9px;font-size:23px;font-weight:500;color:${NOM.verde};line-height:1.25">Huevos que nacen al aire libre, no en una jaula</h1>
<p style="margin:0 0 15px;font-size:13.5px;color:#5F5E5A;line-height:1.6">Nuestras gallinas viven en carros que se mudan cada tres días para que siempre pisen pasto nuevo. Acceso diario al aire libre y granos seleccionados — por eso nuestros huevos son distintos.</p>

<div style="display:flex;gap:9px;margin-bottom:18px">
  <button class="btn" onclick="window.location.href='./suscribite.html'" style="flex:1;background:${NOM.verde};color:#F5EFE0;border:none;padding:13px 0;font-size:14px;font-weight:500">Quiero suscribirme</button>
  <button class="btn" data-nav="cuenta" style="flex:0 0 auto;background:#FFFFFF;color:${NOM.verde};border:1px solid #E3DCC8;padding:13px 16px;font-size:14px">Ya soy cliente</button>
</div>

<div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;overflow:hidden;margin-bottom:18px">
  <img src="./img/hero_banner.jpg" alt="El carro con las gallinas en el campo" style="width:100%;display:block"/>
  <div style="padding:15px">
    <p style="margin:0;font-size:18px;font-weight:500;color:${NOM.verde};line-height:1.3">Las gallinas cambian de parcela cada tres días</p>
    <p style="margin:9px 0 0;font-size:13px;color:#5F5E5A;line-height:1.6">Movemos el carro a una parcela nueva para que siempre tengan pasto fresco, insectos y sombra. La tierra que dejan atrás descansa y se recupera antes de volver a usarse. De ahí viene el nombre.</p>
  </div>
</div>

<div class="grid two" style="margin-bottom:18px">
  ${[['plant','Libre pastoreo','Acceso diario a pasturas renovadas'],
     ['camion','Carro móvil','La tierra descansa, la producción es limpia'],
     ['huevo','Alimentación cuidada','Granos seleccionados más pastoreo'],
     ['moto','Te lo llevamos','A tu casa, el día que elijas']].map(([ic,t,d])=>`
    <div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;padding:13px">
      ${ico(ic==='plant'?'huevo':ic,20,NOM.verde)}
      <p style="margin:8px 0 0;font-size:13.5px;font-weight:500;color:${NOM.verde}">${t}</p>
      <p style="margin:3px 0 0;font-size:11.5px;color:#8A8570;line-height:1.4">${d}</p>
    </div>`).join('')}
</div>

<h2 style="margin:0 0 11px;font-size:19px">Elegí tu plan</h2>
<div class="grid two" id="planes_home" style="margin-bottom:18px">${skeletonBloque(2)}</div>

<div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;overflow:hidden;margin-bottom:18px">
  <img src="./img/delivery.jpg" alt="Repartidor de Nómades entregando el pedido" style="width:100%;display:block"/>
  <div style="padding:15px">
    <p style="margin:0;font-size:18px;font-weight:500;color:${NOM.verde};line-height:1.3">Sabés quién va a tocar tu puerta antes de que llegue</p>
    <p style="margin:9px 0 0;font-size:13px;color:#5F5E5A;line-height:1.6">Antes de cada entrega ves el nombre, la foto y el vehículo de tu repartidor asignado. Todo nuestro personal está uniformado e identificado. Si no figura en la app, no somos nosotros.</p>
    <div style="display:flex;gap:9px;margin-top:13px">
      <div style="flex:1;display:flex;gap:8px;align-items:flex-start">${ico('mapa',16,NOM.verde)}<span style="font-size:11.5px;color:#5F5E5A;line-height:1.4">Seguís el pedido en vivo</span></div>
      <div style="flex:1;display:flex;gap:8px;align-items:flex-start">${ico('personas',16,NOM.verde)}<span style="font-size:11.5px;color:#5F5E5A;line-height:1.4">Se valida quién recibe</span></div>
    </div>
  </div>
</div>

<div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;padding:15px;margin-bottom:18px">
  <p style="margin:0 0 6px;font-size:17px;font-weight:500;color:${NOM.verde}">Dos días, con lote y fecha</p>
  <p style="margin:0 0 14px;font-size:13px;color:#5F5E5A;line-height:1.55">Un huevo de supermercado puede tener semanas y venir de una gallina que nunca salió al aire libre. El nuestro llega en dos días y sabés exactamente de qué lote y de qué fecha es.</p>
  <div style="display:flex;gap:8px;margin-bottom:9px">
    <div style="flex:1;background:${NOM.verdeClaro};border-radius:12px;padding:13px 11px">
      <p style="margin:0;font-size:26px;font-weight:500;color:${NOM.verde};line-height:1;font-variant-numeric:tabular-nums">2</p>
      <p style="margin:6px 0 0;font-size:11px;color:#5F5E5A;line-height:1.4">días desde la postura hasta tu casa</p>
    </div>
    <div style="flex:1;background:${NOM.verdeClaro};border-radius:12px;padding:13px 11px">
      <p style="margin:0;font-size:26px;font-weight:500;color:${NOM.verde};line-height:1;font-variant-numeric:tabular-nums">3</p>
      <p style="margin:6px 0 0;font-size:11px;color:#5F5E5A;line-height:1.4">días entre cambios de parcela</p>
    </div>
  </div>
  <div style="background:${NOM.verdeClaro};border-radius:12px;padding:13px">
    <p style="margin:0 0 10px;font-size:11.5px;color:#5F5E5A;line-height:1.5">La gallina come pasto, semillas e insectos, y toma sol. Esos nutrientes pasan directo a la yema.</p>
    <div class="grid two" style="gap:7px">
      ${[['2×','omega 3'],['2×','vitamina E'],['3×','vitamina D'],['½','omega 6/3']].map(([n,l])=>`
        <div style="background:#FFFFFF;border-radius:9px;padding:9px 10px;display:flex;align-items:baseline;gap:7px">
          <span style="font-size:15px;font-weight:500;color:${NOM.verde}">${n}</span>
          <span style="font-size:11.5px;color:#5F5E5A">${l}</span>
        </div>`).join('')}
    </div>
  </div>
  <details style="border-top:1px solid #F0EADB;padding-top:12px;margin-top:13px">
    <summary style="cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:${NOM.verde};font-weight:500">
      <span>Ver la comparación completa</span>${ico('flecha',17,NOM.verde)}
    </summary>
    <div style="padding-top:12px">
      ${[['Sale al aire libre','no','a diario'],['Sabés de dónde vino','no','con lote'],['Espacio para moverse','jaula','pastura'],['Alimentación','balanceado','pasto y granos']].map(([c,a,b])=>`
        <div style="display:flex;padding:9px 0;border-bottom:1px solid #F0EADB;align-items:center">
          <span style="flex:1;font-size:12.5px;color:${NOM.verde}">${c}</span>
          <span style="width:66px;text-align:center;font-size:12px;color:#8A8570">${a}</span>
          <span style="width:76px;text-align:center;font-size:12.5px;color:${NOM.verde};font-weight:500">${b}</span>
        </div>`).join('')}
      <p style="margin:11px 0 0;font-size:11px;color:#8A8570;line-height:1.5">Datos de Penn State University sobre huevos de pastoreo en general, no de una granja en particular.</p>
    </div>
  </details>
</div>

<h2 style="margin:0 0 11px;font-size:19px">Lo que dicen nuestros clientes</h2>
<div id="resenas_home" style="margin-bottom:18px">${skeletonBloque(2)}</div>

<div style="background:${NOM.verdeClaro};border-radius:14px;padding:16px;margin-bottom:18px">
  <p style="margin:0 0 5px;font-size:17px;font-weight:500;color:${NOM.verde}">También te llevamos el almacén</p>
  <p style="margin:0 0 12px;font-size:12.5px;color:#5F5E5A;line-height:1.5">Aceite, fideos, conservas y más. Lo sumás a tu entrega y llega junto con los huevos, sin costo de envío.</p>
  <div id="catalogo_home" style="display:flex;gap:9px;overflow-x:auto;padding-bottom:4px"></div>
</div>

<h2 style="margin:0 0 10px;font-size:19px">Preguntas frecuentes</h2>
<div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;padding:4px 14px;margin-bottom:18px">
  ${[
    ['¿Llegan a mi barrio?','Repartimos en Rosario y alrededores, por zonas. Al suscribirte elegís tu zona y te mostramos los días disponibles antes de confirmar.'],
    ['¿Puedo pausar cuando me voy de viaje?','Sí. Desde tu cuenta pausás la suscripción los días que quieras y la reanudás cuando volvés, sin perder tu lugar.'],
    ['¿Cuánto duran los huevos?','Te llegan con menos de dos días desde la postura, así que tenés semanas por delante. Guardalos en la heladera y sin lavar hasta usarlos.'],
    ['¿Puedo cambiar la cantidad?','Cuando quieras, desde tu cuenta. También podés combinar maples de distintos tamaños en el mismo pedido.'],
    ['¿Tengo que estar en casa?','No. Podés dejar una persona de referencia autorizada para recibir el pedido.']
  ].map(([q,a],i,arr)=>`<details style="${i<arr.length-1?'border-bottom:1px solid #F0EADB;':''}padding:12px 0">
    <summary style="cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:13.5px;color:${NOM.verde}">
      <span>${q}</span>${ico('flecha',16,'#A8A89E')}
    </summary>
    <p style="margin:9px 0 0;font-size:12.5px;color:#8A8570;line-height:1.6">${a}</p>
  </details>`).join('')}
</div>

<div style="background:${NOM.verde};border-radius:16px;padding:19px 17px">
  <p style="margin:0;font-size:18px;font-weight:500;color:#F5EFE0;line-height:1.35">Probá una semana. Si no notás la diferencia, no seguís.</p>
  <button class="btn" onclick="window.location.href='./suscribite.html'" style="width:100%;margin-top:14px;background:#F5EFE0;color:${NOM.verde};border:none;padding:13px 0;font-size:14px;font-weight:500">Empezar mi suscripción</button>
  <button class="btn" id="btn_soy_comercio" style="width:100%;margin-top:9px;background:transparent;color:#C9D8B0;border:none;padding:10px 0;font-size:12.5px">¿Tenés un comercio? Vendemos por mayor</button>
</div>`)

  cargarPreciosHome()
  cargarResenasHome()
  cargarCatalogoHome()

  const btnComercio = document.querySelector('#btn_soy_comercio')
  if(btnComercio) btnComercio.onclick = ()=>{ current='mayorista-landing'; render() }
}

async function cargarCatalogoHome(){
  const cont = document.querySelector('#catalogo_home')
  if(!cont) return
  const { data } = await supabase.from('catalog_products')
    .select('id,name,photo_url,price')
    .eq('active', true).eq('wholesale_only', false)
    .order('created_at', { ascending:false }).limit(8)
  const productos = data || []
  if(!productos.length){ cont.parentElement.style.display = 'none'; return }
  cont.innerHTML = productos.map(p=>`<div style="flex:0 0 auto;width:104px;background:${NOM.superficie};border-radius:12px;padding:9px;text-align:center">
    ${p.photo_url
      ? `<img src="${p.photo_url}" alt="" style="width:100%;height:66px;object-fit:contain;border-radius:8px;display:block"/>`
      : `<div style="height:66px;display:flex;align-items:center;justify-content:center">${ico('carrito',22,NOM.verde)}</div>`}
    <div style="font-size:11px;color:${NOM.tinta};margin-top:7px;line-height:1.3;height:29px;overflow:hidden">${p.name}</div>
  </div>`).join('')
}

async function cargarResenasHome(){
  const cont = document.querySelector('#resenas_home')
  if(!cont) return
  const { data } = await supabase.rpc('public_featured_reviews')
  const resenas = data || []
  if(!resenas.length){ cont.innerHTML = ''; return }
  cont.innerHTML = resenas.map(r=>`<div class="card" style="margin-bottom:10px"><div style="color:#F5B301;font-size:15px">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>${r.comment?`<p style="margin-top:6px">"${r.comment}"</p>`:''}<p class="muted" style="font-size:12px;margin-top:4px">— ${r.first_name||'Cliente'}</p></div>`).join('')
}

async function cargarPreciosHome(){
  const cont = document.querySelector('#planes_home')
  if(!cont) return
  const { data, error } = await supabase.from('plan_prices').select('egg_quantity,price').eq('active', true).eq('customer_type','minorista').order('egg_quantity')
  const planes = (!error && data && data.length) ? data : [{egg_quantity:15,price:7000},{egg_quantity:30,price:12000}]
  cont.innerHTML = planes.map(p => `<div><img src="./img/maple${p.egg_quantity}.jpg" alt="Maple de ${p.egg_quantity} huevos" style="width:100%;border-radius:12px 12px 0 0;display:block"/><div class="card" style="border-radius:0 0 12px 12px;text-align:center"><b>${p.egg_quantity} huevos</b><br>$${Number(p.price).toLocaleString('es-AR')}</div></div>`).join('')
}

const ESTADOS = { pending:'🟡 Pendiente', assigned:'🔵 Asignado', out_for_delivery:'🚚 En reparto', delivered:'🟢 Entregado', incident:'🔴 Incidencia', rescheduled:'🟠 Reprogramado', cancelled:'⚫ Cancelado' }

function cuentaLogin(){
  layout(`<h2>👤 Mi cuenta</h2><div class="card"><p class="muted">Ingresá con tu DNI para ver el estado de tu pedido.</p><div class="field"><label>DNI</label><input id="dni_login" inputmode="numeric" placeholder="Sin puntos" /></div><div id="err_login" class="alert danger" style="display:none"></div><button class="btn primary" id="btn_dni_login">Entrar</button><p class="muted" style="margin-top:14px">¿Todavía no sos cliente? <a href="./suscribite.html">Suscribite acá</a></p></div>`)
  document.querySelector('#btn_dni_login').onclick = async ()=>{
    const dni = document.querySelector('#dni_login').value.trim()
    const box = document.querySelector('#err_login')
    if(!/^(\d{7,8}|\d{11})$/.test(dni)){ box.textContent='Ingresá tu DNI (7 u 8 números) o CUIT (11), sin puntos ni guiones.'; box.style.display='block'; return }
    const { data, error } = await supabase.rpc('customer_login', { p_dni: dni })
    if(error || !data?.found){ box.textContent='No encontramos ese DNI registrado. Si sos nuevo, suscribite primero.'; box.style.display='block'; return }
    cuenta = data; current='cuenta'; render()
  }
}

const FRECUENCIAS = { weekly:'Semanal', biweekly:'Quincenal', monthly:'Mensual' }

const TIPOS_VIA = { calle:'Calle', avenida:'Avenida', pasaje:'Pasaje' }

const METODOS_PAGO_LABEL = { cash:'efectivo', transfer:'transferencia', mp:'Mercado Pago' }

function formatearFecha(fechaStr){
  const d = new Date(fechaStr+'T00:00:00')
  const texto = d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
  return texto.charAt(0).toUpperCase()+texto.slice(1)
}

function fechasDelMesParaSuscripcion(fechaInicial, frecuencia){
  if(!fechaInicial) return []
  const hoy = new Date(); hoy.setHours(0,0,0,0)
  let cursor = fechaInicial
  const fechas = []
  let i = 0
  while(i<6){
    const d = new Date(cursor+'T00:00:00')
    if(d >= hoy) fechas.push(cursor)
    cursor = proximaFechaProyectada(cursor, frecuencia)
    i++
  }
  return fechas
}

let cuentaPollInterval = null
let carritoProductos = {} // product_id -> cantidad, carrito local del cliente antes de confirmar
let categoriaCatalogoSeleccionada = null // null = "Todas"
let catalogoDetallesAbierto = null // null = decide solo según si ya confirmó algo; true/false = lo decidió el cliente tocando

function reproducirSonidoAviso(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    osc.start(); osc.stop(ctx.currentTime + 0.35)
    setTimeout(()=>{
      const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain()
      osc2.connect(gain2); gain2.connect(ctx.destination)
      osc2.type = 'sine'; osc2.frequency.setValueAtTime(1160, ctx.currentTime)
      gain2.gain.setValueAtTime(0.15, ctx.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
      osc2.start(); osc2.stop(ctx.currentTime + 0.35)
    }, 150)
  }catch(e){ /* algunos navegadores bloquean audio sin interacción previa, no pasa nada si falla */ }
}

function iniciarPollingCuenta(){
  if(cuentaPollInterval) clearInterval(cuentaPollInterval)
  const firmaEstado = (data)=>{
    const n = data?.next_order
    return n ? `${n.status}|${n.customer_stage}|${n.out_for_delivery_at}|${n.en_route_at}` : ''
  }
  const idsDisponibles = (data)=> (data?.credits||[]).filter(c=>c.status==='available').map(c=>c.id).sort().join(',')
  let ultimaFirma = firmaEstado(cuenta)
  let ultimosDisponibles = idsDisponibles(cuenta)
  let ultimoEntregadoId = cuenta?.ultimo_entregado?.id || null
  cuentaPollInterval = setInterval(async ()=>{
    if(current!=='cuenta' || !cuenta){ clearInterval(cuentaPollInterval); cuentaPollInterval=null; return }
    const { data } = await supabase.rpc('customer_login', { p_dni: cuenta.customer.dni })
    if(!data?.found) return
    const nuevaFirma = firmaEstado(data)
    const nuevosDisponibles = idsDisponibles(data)
    const huboNuevoCredito = nuevosDisponibles !== ultimosDisponibles && nuevosDisponibles.split(',').filter(Boolean).length > ultimosDisponibles.split(',').filter(Boolean).length
    const nuevoEntregadoId = data?.ultimo_entregado?.id || null
    const huboNuevaEntrega = nuevoEntregadoId && nuevoEntregadoId !== ultimoEntregadoId
    if(nuevaFirma !== ultimaFirma || huboNuevoCredito || huboNuevaEntrega){
      ultimaFirma = nuevaFirma
      ultimosDisponibles = nuevosDisponibles
      ultimoEntregadoId = nuevoEntregadoId
      cuenta = data
      if(huboNuevaEntrega) mostrarConfeti(`¡Tu pedido fue entregado! 🥚\nGracias por elegir NÓMADES, esperamos que disfrutes tus huevos de campo.`)
      else if(huboNuevoCredito) mostrarConfeti('¡Ganaste $1.000 de descuento por recomendar! Se aplica solo en tu próximo pedido.')
      else reproducirSonidoAviso()
      if(current==='cuenta') cuentaPanel()
    }
  }, 5000)
}

function cuentaPanel(){
  panelVolver = cuentaPanel
  const scrollPrevioCuenta = window.scrollY
  const c = cuenta.customer
  const next = cuenta.next_order
  const tipoVia = TIPOS_VIA[c.street_type] || 'Calle'
  const hoy = new Date().toISOString().slice(0,10)
  const esHoy = next && next.delivery_date === hoy
  const subActiva = cuenta.subscriptions.find(s=>s.status==='active') || cuenta.subscriptions[0]
  const fechasMes = subActiva && next ? fechasDelMesParaSuscripcion(next.delivery_date, subActiva.frequency) : []
  const manana = new Date(); manana.setDate(manana.getDate()+1); const mananaStr = manana.toISOString().slice(0,10)
  const bloqueado24hs = !!(next && next.delivery_date <= mananaStr)
  layout(`<h2>👤 Hola, ${c.first_name}</h2>
  <div id="card_hoy_banner"></div>
  <div class="card"><h3>Tu próximo pedido</h3>${next?(()=>{
    const productosConfirmados = (cuenta.mis_intereses||[]).filter(mi=>mi.status==='interested').map(mi=>({ mi, p: (cuenta.catalogo||[]).find(pr=>pr.id===mi.product_id) })).filter(x=>x.p)
    const totalProductos = productosConfirmados.reduce((s,{mi,p})=>s+Number(p.price)*mi.quantity,0)
    const precioSub = Number(subActiva?.price_at_signup||0)
    const totalPedido = precioSub + totalProductos
    const fechaTexto = esHoy && (next.customer_stage||next.status==='out_for_delivery') ? 'Hoy' : formatearFecha(next.delivery_date)
    return `<p class="muted" style="font-size:12.5px;margin-bottom:2px">Se entregará el ${fechaTexto}</p>
    <div class="row"><span>${fechaTexto}</span><span class="badge">${ESTADOS[next.status]||next.status}</span></div>
    <div class="row"><span>${(next.plan_breakdown && Array.isArray(next.plan_breakdown) && next.plan_breakdown.length) ? next.plan_breakdown.map(b=>`${b.qty}×${b.size}`).join(' + ')+' huevos' : `${next.egg_quantity||0} huevos`}</span>${precioSub?`<span>$${precioSub.toLocaleString('es-AR')}</span>`:''}</div>
    ${productosConfirmados.length?`<div style="margin-top:10px;border-radius:12px;overflow:hidden;border:1px solid #E3DCC8">
      <details>
      <summary style="cursor:pointer;list-style:none;background:#2F4D2A;background-image:repeating-linear-gradient(135deg, rgba(245,239,224,0.05) 0px, rgba(245,239,224,0.05) 12px, transparent 12px, transparent 24px);padding:12px 14px;border-bottom:3px solid #E8833A;display:flex;align-items:center;justify-content:space-between;gap:8px">
        <span style="color:#F5EFE0;font-weight:700;font-size:13.5px">🛒 ${productosConfirmados.length} producto${productosConfirmados.length===1?'':'s'} agregado${productosConfirmados.length===1?'':'s'}</span>
        <span style="color:#F5EFE0;font-weight:700;font-size:13.5px">$${totalProductos.toLocaleString('es-AR')}</span>
      </summary>
      <div style="background:#FFFDF7;padding:12px 14px">
      <div style="font-size:11px;color:#8A8570;margin-bottom:8px;text-align:center;letter-spacing:1px">— TU TICKET — (tocá para editar)</div>
      ${productosConfirmados.map(({mi,p})=>`<div class="row" style="border-bottom:1px dashed #E3DCC8">
        <span style="display:flex;align-items:center;gap:8px">
          ${p.photo_url?`<img src="${p.photo_url}" style="width:32px;height:32px;border-radius:6px;object-fit:cover;flex-shrink:0"/>`:`<div style="width:32px;height:32px;border-radius:6px;background:#F5EFE0;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">🛒</div>`}
          <span style="font-size:13px">${p.name}${mi.source==='phone'?'<br><span style="font-size:10px;color:#B85C00;font-weight:600">📞 Cargado por teléfono</span>':''}</span>
        </span>
        <span style="display:flex;align-items:center;gap:6px">
          <button data-ajustar-interes="${mi.id}" data-nueva="${mi.quantity-1}" data-stock-max="${p.stock===null?'':p.stock}" style="width:24px;height:24px;border-radius:6px;background:#F5EFE0;color:#2F4D2A;border:none;font-size:13px;font-weight:700">−</button>
          <b style="min-width:12px;text-align:center;font-size:12px">${mi.quantity}</b>
          <button data-ajustar-interes="${mi.id}" data-nueva="${mi.quantity+1}" data-stock-max="${p.stock===null?'':p.stock}" style="width:24px;height:24px;border-radius:6px;background:#2F4D2A;color:#F5EFE0;border:none;font-size:13px;font-weight:700">+</button>
          <button data-cancelar-interes="${mi.id}" style="width:24px;height:24px;border-radius:6px;background:#FFFFFF;color:#B03A2E;border:1px solid #E3DCC8;font-size:11px">🗑️</button>
        </span></div>`).join('')}
      <div style="display:flex;justify-content:space-between;padding-top:10px;font-weight:700;color:#2F4D2A;font-size:13px"><span>Subtotal productos</span><span>$${totalProductos.toLocaleString('es-AR')}</span></div>
      </div>
      </details>
    </div>`:''}
    <div class="alert info" style="margin-top:8px;text-align:center;font-weight:700">Total a pagar: $${totalPedido.toLocaleString('es-AR')}</div>
    ${next.payment_method?`<div class="alert info" style="margin-top:6px">💡 Recordá: el pago es en <b>${METODOS_PAGO_LABEL[next.payment_method]||next.payment_method}</b>.</div>`:''}
    ${next.payment_method==='mp'?`<div class="alert info" style="margin-top:6px">📄 Tené a mano el comprobante de tu pago — el repartidor te lo va a pedir para confirmar antes de dejarte el pedido.</div>`:''}`
  })():estadoVacio('No tenés entregas próximas todavía.')}</div>
  <div class="card" id="card_repartidor"><h3>🚚 Tu repartidor</h3>${skeletonBloque(2)}</div>
  ${next && (next.customer_stage || next.status==='out_for_delivery') ? barraEstadoPedido(next.customer_stage, next.status, next.out_for_delivery_at, next.en_route_at) : ''}
  ${fechasMes.length?`<div class="card"><h3>📅 Tus próximas entregas</h3>${fechasMes.map((f,i)=>`<div class="row"><span>${formatearFecha(f)}</span>${i===0?'<span class="badge">Confirmada</span>':'<span class="muted" style="font-size:12px">Estimada</span>'}</div>`).join('')}<p class="muted" style="font-size:12px;margin-top:8px">Solo la primera fecha está confirmada como pedido. Las demás son estimadas según tu frecuencia y pueden moverse un poco.</p></div>`:''}
  <div class="card" id="card_subs"><h3>Tus suscripciones</h3>${cuenta.subscriptions.length?cuenta.subscriptions.map(s=>{
    const planLabel = s.plan_breakdown && s.plan_breakdown.length ? s.plan_breakdown.map(b=>`${b.qty}×${b.size}`).join(' + ')+' huevos' : `${s.egg_quantity} huevos`
    const estadoBadge = s.status==='waitlist' ? ' · <span class="badge" style="background:#b3841f">🕒 Lista de espera</span>' : s.status==='paused' ? ' · <span class="badge" style="background:#8A8570">⏸️ Pausada</span>' : ''
    return `<div class="row"><span>${planLabel} · ${FRECUENCIAS[s.frequency]||s.frequency}${estadoBadge}${s.status==='paused'&&s.paused_until?`<br><small class="muted">Hasta el ${formatearFecha(s.paused_until)}</small>`:''}</span><span style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
      ${s.status!=='paused'?`<span class="badge">${s.payment_status==='paid'?'✅ Pago al día':'🟡 Pago pendiente'}</span>`:''}
      ${s.status==='active'?`<button class="btn ghost" data-cambiar-plan="${s.id}" style="font-size:12px;padding:6px 12px">✏️ Cambiar plan</button><button class="btn ghost" data-pausar="${s.id}" style="font-size:12px;padding:6px 12px">⏸️ Pausar</button>`:''}
      ${s.status==='paused'?`<button class="btn primary" data-reanudar="${s.id}" style="font-size:12px;padding:6px 12px">▶️ Reanudar</button>`:''}
    </span></div>`
  }).join(''):estadoVacio('No tenés suscripciones activas todavía.')}</div>
  <div class="card" id="card_pagar"></div>
  <div class="card" id="card_pagos"><h3>💳 Historial de pagos</h3>${skeletonBloque(3)}</div>
  <div class="card"><h3>📣 Recomendá NÓMADES</h3><p class="muted">Compartí tu código — cuando alguien se suscriba con él y reciba y pague su primera entrega, vos te ganás <b>$1.000 de descuento</b> en tu próximo pedido. Cada código sirve una sola vez: apenas se usa, se genera uno nuevo para que compartas.</p>
    ${(()=>{
      const pendiente = (cuenta.referral_history||[]).find(h=>h.status==='pending')
      if(pendiente) return `<div class="alert info" style="text-align:center"><span style="font-size:20px;font-weight:bold;letter-spacing:2px;text-decoration:line-through;opacity:0.6">${pendiente.code}</span><br><small>🔒 En uso — esperando que ${pendiente.referred_first_name||'esa persona'} reciba y pague su primera entrega</small></div>`
      return `<div class="alert info" style="text-align:center;font-size:22px;font-weight:bold;letter-spacing:2px">${c.referral_code||'-'}</div>`
    })()}
    ${cuenta.credits && cuenta.credits.some(cr=>cr.status==='available') ? `<div style="margin-top:10px">${cuenta.credits.filter(cr=>cr.status==='available').map(cr=>`<div class="row"><span>🎁 ${cr.amount_description}</span><span class="badge">Listo para usar</span></div>`).join('')}</div>`:''}
    ${(cuenta.referral_history && cuenta.referral_history.length) ? `<div style="margin-top:12px"><small class="muted" style="font-weight:600">Historial</small>${cuenta.referral_history.map(h=>`<div class="row"><span>${h.code} → ${h.referred_first_name||'alguien'}</span><span class="badge">${h.status==='completed'?'✅ Completado':'⏳ Pendiente'}</span></div>`).join('')}</div>`:''}
    <details style="margin-top:10px"><summary style="cursor:pointer;font-size:13px;color:#2F4D2A;font-weight:600">¿Cómo funciona?</summary><p class="muted" style="font-size:12px;margin-top:6px">1. Le pasás tu código a alguien que todavía no es cliente.<br>2. Esa persona lo pone al suscribirse, y su primera entrega le sale con 50% off.<br>3. Cuando le llega y la paga, vos te ganás $1.000 de descuento en tu próximo pedido, y te llega un código nuevo para volver a compartir.<br>4. Mientras el código esté "en uso", no se puede volver a usar hasta que se complete ese ciclo.</p></details>
  </div>
  ${cuenta.huevos_semana>0?`<div class="nom-cascada card" style="background:#2F4D2A;text-align:center">
    <div style="font-size:26px;margin-bottom:4px">🥚💪</div>
    <div style="color:#F5EFE0;font-size:14px;font-weight:700">¡Esta semana comiste ${cuenta.huevos_semana} huevos de NÓMADES!</div>
    <div style="color:#C9D8B0;font-size:12px;margin-top:4px">Eso son aprox. ${cuenta.huevos_semana*6}g de proteína de calidad para tu cuerpo</div>
  </div>`:''}
  ${cuenta.historial_entregas && cuenta.historial_entregas.length ? `<div class="card"><h3>📦 Historial de entregas</h3>${cuenta.historial_entregas.map(h=>`<div class="row"><span>${formatearFecha(h.delivery_date)}${h.es_telefonico||h.channel==='phone'?`<br>${pPill('📞 Pedido telefónico','#FAEEDA','#854F0B')}${h.taken_by_name?`<small class="muted"> lo cargó ${h.taken_by_name}</small>`:''}`:''}${h.envio_bonificado?`<br><small class="muted">envío bonificado</small>`:(h.envio?`<br><small class="muted">+ $${Number(h.envio).toLocaleString('es-AR')} de envío</small>`:'')}</span><span style="text-align:right">${h.egg_quantity||0} huevos${h.monto?`<br><b>$${Number(h.monto).toLocaleString('es-AR')}</b>`:''}</span></div>`).join('')}</div>`:''}
  <div class="card" id="card_datos"><h3>Tus datos</h3><p>🪪 DNI ${c.dni||'-'}</p><p>🏠 ${tipoVia} ${c.street||''} ${c.street_number||''}</p><p>🏘️ Barrio ${c.neighborhood||'-'}</p><p>📍 ${c.city||'-'}, ${c.province||'-'}, ${c.country||'-'} (CP ${c.postal_code||'-'})</p><p>📍 Zona ${c.zone?c.zone[0].toUpperCase()+c.zone.slice(1):'-'}</p><p>📞 ${c.phone||'-'}</p><p>✉️ ${c.email||'-'}</p><button class="btn ghost" id="btn_editar_datos" style="margin-top:8px">✏️ Editar mis datos</button></div>
  ${cuenta.catalogo && cuenta.catalogo.length ? `<div class="card" style="padding:0;overflow:hidden">
    <div style="background:#2F4D2A;background-image:repeating-linear-gradient(135deg, rgba(245,239,224,0.05) 0px, rgba(245,239,224,0.05) 12px, transparent 12px, transparent 24px);padding:16px 16px 14px;border-bottom:3px solid #E8833A">
      <div style="font-size:18px;font-weight:700;color:#F5EFE0;display:flex;align-items:center;gap:8px">🛒 NÓMADES</div>
      <div style="font-size:12.5px;color:#C9D8B0;margin-top:2px">tu supermercado online</div>
    </div>
    <div style="padding:16px">
    <details style="margin-bottom:10px"><summary style="cursor:pointer;font-size:13px;color:#2F4D2A;font-weight:600">Nuestro proyecto</summary><p class="muted" style="font-size:12.5px;margin-top:6px;line-height:1.5">Queremos ser parte de tu día a día. Nuestra idea es sumar cada vez más productos — comprados directo a fábricas y proveedores — para ofrecerte una alternativa más rentable, sin que tengas que moverte de tu casa. Precios justos, productos bien identificados, y la comodidad de recibirlo todo junto con tus huevos.</p></details>
    ${(()=>{
      const nuevos = cuenta.catalogo.filter(p=>p.created_at && (Date.now() - new Date(p.created_at).getTime()) < 30*24*60*60*1000)
      if(!nuevos.length) return ''
      return `<div style="background:#EAF0DC;border-radius:10px;padding:8px 12px;margin-bottom:10px;font-size:12px;color:#2E5C1E;font-weight:600">🆕 ${nuevos.length} producto${nuevos.length===1?'':'s'} nuevo${nuevos.length===1?'':'s'} este mes</div>`
    })()}
    ${bloqueado24hs?`<div style="background:#FBE4CC;border-radius:10px;padding:12px;margin-bottom:10px;display:flex;gap:8px;align-items:flex-start"><span style="font-size:16px">⏰</span><span style="font-size:12.5px;color:#7A4A0E;line-height:1.5">Tu próxima entrega es en menos de 24 horas — ya no lo sumamos solo desde acá. Elegí igual lo que querés y lo mandás por WhatsApp, nosotros te lo cargamos a mano.</span></div>`:''}
    <p class="muted" style="margin-bottom:10px">Sumalos a tu próxima entrega — se pagan junto con tu pedido, sin recargo extra.</p>
    ${(()=>{
      const items = Object.entries(carritoProductos).filter(([,q])=>q>0).map(([id,q])=>({ p: (cuenta.catalogo||[]).find(pr=>pr.id===id), q })).filter(x=>x.p)
      if(!items.length) return ''
      const totalArriba = items.reduce((s,{p,q})=>s+Number(p.price)*q,0)
      const cantArticulos = items.reduce((s,{q})=>s+q,0)
      return `<div style="background:#2F4D2A;border-radius:10px;padding:10px 12px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center">
        <span style="color:#C9D8B0;font-size:12px">🛒 Llevás ${cantArticulos} producto${cantArticulos===1?'':'s'}</span>
        <span style="color:#F5EFE0;font-size:15px;font-weight:700">$${totalArriba.toLocaleString('es-AR')}</span>
      </div>`
    })()}
    ${(()=>{
      const yaConfirmoAlgo = (cuenta.mis_intereses||[]).some(mi=>mi.status==='interested')
      const abierto = catalogoDetallesAbierto !== null ? catalogoDetallesAbierto : !yaConfirmoAlgo
      return `<details id="detalles_catalogo" ${abierto?'open':''}><summary style="cursor:pointer;font-size:13px;color:#2F4D2A;font-weight:600;margin-bottom:8px">${yaConfirmoAlgo?'➕ Agregar más productos':'🛍️ Ver productos'}</summary>`
    })()}
    ${(()=>{
      const categoriasConProductos = CATEGORIAS_CATALOGO.filter(cat=>cuenta.catalogo.some(p=>p.category===cat))
      if(categoriasConProductos.length<2) return ''
      return `<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:10px">
        <button data-filtro-categoria="" style="white-space:nowrap;background:${categoriaCatalogoSeleccionada===null?'#2F4D2A':'#F5EFE0'};color:${categoriaCatalogoSeleccionada===null?'#F5EFE0':'#2F4D2A'};border:none;border-radius:20px;padding:7px 14px;font-size:12px;font-weight:600">Todas</button>
        ${categoriasConProductos.map(cat=>`<button data-filtro-categoria="${cat}" style="white-space:nowrap;background:${categoriaCatalogoSeleccionada===cat?'#2F4D2A':'#F5EFE0'};color:${categoriaCatalogoSeleccionada===cat?'#F5EFE0':'#2F4D2A'};border:none;border-radius:20px;padding:7px 14px;font-size:12px;font-weight:600">${cat}</button>`).join('')}
      </div>`
    })()}
    ${(()=>{
      const maxInteresados = Math.max(0, ...cuenta.catalogo.map(p=>p.interesados||0))
      const productosFiltrados = categoriaCatalogoSeleccionada ? cuenta.catalogo.filter(p=>p.category===categoriaCatalogoSeleccionada) : cuenta.catalogo
      if(!productosFiltrados.length) return '<p class="muted" style="font-size:13px">No hay productos en esta categoría.</p>'
      return productosFiltrados.map(p=>{
        const yaElegido = (cuenta.mis_intereses||[]).find(mi=>mi.product_id===p.id && mi.status==='interested')
        const yaNotificar = (cuenta.mis_intereses||[]).find(mi=>mi.product_id===p.id && mi.status==='notify')
        const sinStock = p.stock!==null && p.stock<=0
        const esPopular = maxInteresados>1 && p.interesados===maxInteresados
        const enCarrito = carritoProductos[p.id]||0
        return `<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #F0EBDD">
          ${p.photo_url?`<div data-ver-producto="${p.id}" style="width:56px;height:56px;border-radius:10px;background:#F5EFE0;padding:3px;flex-shrink:0;cursor:pointer"><img src="${p.photo_url}" style="width:100%;height:100%;border-radius:8px;object-fit:cover"/></div>`:`<div data-ver-producto="${p.id}" style="width:56px;height:56px;border-radius:10px;background:#F5EFE0;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;cursor:pointer">🛒</div>`}
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <b data-ver-producto="${p.id}" style="color:#2F4D2A;font-size:14px;cursor:pointer">${p.name}</b>
              ${esPopular?`<span class="badge" style="background:#F5B301;color:#5C3E00;font-size:10px">⭐ Más elegido</span>`:''}
            </div>
            ${p.description?`<div data-ver-producto="${p.id}" style="font-size:12px;color:#8A8570;margin-top:2px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${p.description}</div>`:''}
            <div style="font-size:13px;color:#2F4D2A;font-weight:700;margin-top:4px">$${Number(p.price).toLocaleString('es-AR')} · ${p.unit_label||'unidad'}</div>
            ${p.stock!==null && !sinStock?`<div style="font-size:11px;color:#8A8570;margin-top:2px">Quedan ${p.stock} unidades</div>`:''}
            ${yaElegido?`<div style="margin-top:6px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span class="badge">✅ Confirmado</span>
              <button data-ajustar-interes="${yaElegido.id}" data-nueva="${yaElegido.quantity-1}" data-stock-max="${p.stock===null?'':p.stock}" style="width:26px;height:26px;border-radius:7px;background:#F5EFE0;color:#2F4D2A;border:none;font-size:14px;font-weight:700">−</button>
              <b style="min-width:14px;text-align:center">${yaElegido.quantity}</b>
              <button data-ajustar-interes="${yaElegido.id}" data-nueva="${yaElegido.quantity+1}" data-stock-max="${p.stock===null?'':p.stock}" style="width:26px;height:26px;border-radius:7px;background:#2F4D2A;color:#F5EFE0;border:none;font-size:14px;font-weight:700">+</button>
              <button data-cancelar-interes="${yaElegido.id}" style="background:#FFFFFF;color:#B03A2E;border:1px solid #E3DCC8;border-radius:7px;padding:0 8px;height:26px;font-size:12px">🗑️</button>
            </div>`
              :sinStock?(yaNotificar?`<span class="badge" style="margin-top:6px;display:inline-block;background:#D3D1C7;color:#5F5E5A">🔔 Te vamos a avisar</span>`:`<button data-notificar-stock="${p.id}" style="margin-top:6px;background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8;border-radius:8px;padding:6px 14px;font-size:12px;font-weight:600">🔔 Avisame cuando haya</button>`)
              :`<div style="display:flex;align-items:center;gap:10px;margin-top:6px">
                  <button data-carrito-menos="${p.id}" style="width:30px;height:30px;border-radius:8px;background:#F5EFE0;color:#2F4D2A;border:none;font-size:16px;font-weight:700">−</button>
                  <b style="min-width:16px;text-align:center">${enCarrito}</b>
                  <button data-carrito-mas="${p.id}" data-stock-max="${p.stock===null?'':p.stock}" style="width:30px;height:30px;border-radius:8px;background:#2F4D2A;color:#F5EFE0;border:none;font-size:16px;font-weight:700">+</button>
                </div>`
            }
          </div>
        </div>`
      }).join('')
    })()}
    </details>
    </div>
  </div>`:''}
  ${(()=>{
    const items = Object.entries(carritoProductos).filter(([,q])=>q>0).map(([id,q])=>({ p: (cuenta.catalogo||[]).find(pr=>pr.id===id), q })).filter(x=>x.p)
    if(!items.length) return ''
    const total = items.reduce((s,{p,q})=>s+Number(p.price)*q,0)
    return `<div class="card" id="card_resumen_carrito" style="border:2px solid #2F4D2A"><h3>🧾 Resumen de tu pedido</h3>
      ${items.map(({p,q})=>`<div class="row">
        <span style="display:flex;align-items:center;gap:8px">
          ${p.photo_url?`<img src="${p.photo_url}" style="width:36px;height:36px;border-radius:7px;object-fit:cover;flex-shrink:0"/>`:`<div style="width:36px;height:36px;border-radius:7px;background:#F5EFE0;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🛒</div>`}
          <span>${p.name}<br><small class="muted">$${Number(p.price).toLocaleString('es-AR')} c/u</small></span>
        </span>
        <span style="display:flex;align-items:center;gap:8px">
          <button data-carrito-menos="${p.id}" style="width:26px;height:26px;border-radius:7px;background:#F5EFE0;color:#2F4D2A;border:none;font-size:14px;font-weight:700">−</button>
          <b style="min-width:14px;text-align:center">${q}</b>
          <button data-carrito-mas="${p.id}" data-stock-max="${p.stock===null?'':p.stock}" style="width:26px;height:26px;border-radius:7px;background:#2F4D2A;color:#F5EFE0;border:none;font-size:14px;font-weight:700">+</button>
          <button data-carrito-eliminar="${p.id}" style="width:26px;height:26px;border-radius:7px;background:#FFFFFF;color:#B03A2E;border:1px solid #E3DCC8;font-size:13px">🗑️</button>
        </span></div>`).join('')}
      <div class="alert info" style="margin-top:10px;text-align:center;font-size:15px;font-weight:700">Total: $${total.toLocaleString('es-AR')}</div>
      ${bloqueado24hs
        ? `<button id="btn_enviar_whatsapp_pedido" style="width:100%;margin-top:10px;background:#25D366;color:#fff;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">💬 Enviar por WhatsApp</button>`
        : `<button id="btn_confirmar_carrito" style="width:100%;margin-top:10px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">Confirmar productos</button>`}
    </div>`
  })()}
  <button class="btn ghost" id="btn_ver_mapa" style="margin-bottom:10px">🗺️ Ver mapa de suscriptores</button>
  <div class="card"><h3>💡 ¿Te falta algún producto?</h3>
    <p class="muted" style="margin-bottom:10px">Contanos qué te gustaría que tengamos — sacale una foto si querés, y lo vamos evaluando para sumarlo al catálogo.</p>
    <div class="field"><label>¿Qué producto sugerís?</label><textarea id="sugerencia_desc" rows="2" placeholder="Ej: Yerba mate, carne picada, detergente..."></textarea></div>
    <div class="field"><label>Foto (opcional)</label><input type="file" id="sugerencia_foto" accept="image/*"/></div>
    <div id="err_sugerencia" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_enviar_sugerencia" style="width:100%">Enviar sugerencia</button>
  </div>
  <div class="card"><h3>⭐ ¿Qué te pareció NÓMADES?</h3>
    <div class="field"><label>Tu puntaje</label><div id="review_estrellas" style="font-size:30px;display:flex;gap:4px">${[1,2,3,4,5].map(n=>`<button type="button" data-estrella="${n}" style="all:unset;cursor:pointer;line-height:1;color:#D8D3C6">☆</button>`).join('')}</div></div>
    <div class="field"><label>Comentario (opcional)</label><textarea id="review_comment" rows="2" placeholder="Contanos tu experiencia"></textarea></div>
    <div id="err_review" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_enviar_review" style="width:100%">Enviar reseña</button>
  </div>
  <button class="btn ghost" id="btn_logout_cuenta">Cerrar sesión</button>
  ${(()=>{
    const items = Object.entries(carritoProductos).filter(([,q])=>q>0).map(([id,q])=>({ p: (cuenta.catalogo||[]).find(pr=>pr.id===id), q })).filter(x=>x.p)
    if(!items.length) return ''
    const total = items.reduce((s,{p,q})=>s+Number(p.price)*q,0)
    const cant = items.reduce((s,{q})=>s+q,0)
    return `<div id="flotante_carrito" style="position:fixed;left:16px;right:16px;bottom:16px;max-width:400px;margin:0 auto;background:#2F4D2A;border-radius:14px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 4px 16px rgba(0,0,0,0.25);z-index:500;cursor:pointer">
      <span style="color:#C9D8B0;font-size:12px">🛒 ${cant} producto${cant===1?'':'s'}</span>
      <span style="color:#F5EFE0;font-size:16px;font-weight:700">$${total.toLocaleString('es-AR')} →</span>
    </div>`
  })()}`)
  document.querySelector('#btn_logout_cuenta').onclick = ()=>{ if(cuentaPollInterval){clearInterval(cuentaPollInterval);cuentaPollInterval=null} carritoProductos={}; catalogoDetallesAbierto=null; cuenta=null; current='inicio'; render() }
  const flotanteCarrito = document.querySelector('#flotante_carrito')
  if(flotanteCarrito) flotanteCarrito.onclick = ()=>document.querySelector('#card_resumen_carrito')?.scrollIntoView({behavior:'smooth',block:'center'})
  document.querySelectorAll('[data-filtro-categoria]').forEach(b=>b.onclick=()=>{
    categoriaCatalogoSeleccionada = b.dataset.filtroCategoria || null
    cuentaPanel()
  })
  const detallesCatalogo = document.querySelector('#detalles_catalogo')
  if(detallesCatalogo) detallesCatalogo.ontoggle = ()=>{ catalogoDetallesAbierto = detallesCatalogo.open }
  document.querySelectorAll('[data-ver-producto]').forEach(el=>el.onclick=()=>{
    const p = (cuenta.catalogo||[]).find(pr=>pr.id===el.dataset.verProducto)
    if(p) mostrarDetalleProducto(p)
  })
  document.querySelectorAll('[data-carrito-mas]').forEach(b=>b.onclick=()=>{
    const id = b.dataset.carritoMas
    const stockMax = b.dataset.stockMax
    const actual = carritoProductos[id]||0
    if(stockMax!=='' && actual+1>Number(stockMax)){ mostrarAlerta(`Solo quedan ${stockMax} unidades disponibles.`); return }
    carritoProductos[id] = actual+1
    cuentaPanel()
  })
  document.querySelectorAll('[data-carrito-menos]').forEach(b=>b.onclick=()=>{
    const id = b.dataset.carritoMenos
    carritoProductos[id] = Math.max(0, (carritoProductos[id]||0)-1)
    cuentaPanel()
  })
  document.querySelectorAll('[data-carrito-eliminar]').forEach(b=>b.onclick=()=>{
    delete carritoProductos[b.dataset.carritoEliminar]
    cuentaPanel()
  })
  document.querySelectorAll('[data-notificar-stock]').forEach(b=>b.onclick=async()=>{
    const { data, error } = await supabase.rpc('customer_notify_stock', { p_dni: c.dni, p_customer_id: c.id, p_product_id: b.dataset.notificarStock })
    if(error || !data?.ok){ mostrarAlerta('No se pudo registrar: '+(data?.error||error?.message||'')); return }
    const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
    if(fresh?.found) cuenta = fresh
    cuentaPanel()
  })
  const btnConfirmarCarrito = document.querySelector('#btn_confirmar_carrito')
  if(btnConfirmarCarrito) btnConfirmarCarrito.onclick = async ()=>{
    const itemsCarrito = Object.entries(carritoProductos).filter(([,q])=>q>0)
    const itemsConProducto = itemsCarrito.map(([id,q])=>({ p: (cuenta.catalogo||[]).find(pr=>pr.id===id), q })).filter(x=>x.p)
    const totalProductos = itemsConProducto.reduce((s,{p,q})=>s+Number(p.price)*q,0)
    for(const [productId, cantidad] of itemsCarrito){
      const { data, error } = await supabase.rpc('customer_mark_interest', { p_dni: c.dni, p_customer_id: c.id, p_product_id: productId, p_quantity: cantidad })
      if(error || !data?.ok){ mostrarAlerta('No se pudo confirmar uno de los productos: '+(data?.error||error?.message||'')); return }
    }
    carritoProductos = {}
    const subActivaResumen = cuenta.subscriptions.find(s=>s.status==='active')
    const precioSub = Number(subActivaResumen?.price_at_signup||0)
    const totalGeneral = precioSub + totalProductos
    const desglose = subActivaResumen
      ? `Suscripción (${subActivaResumen.egg_quantity} huevos): $${precioSub.toLocaleString('es-AR')}\nProductos agregados: $${totalProductos.toLocaleString('es-AR')}\n\nTotal a pagar: $${totalGeneral.toLocaleString('es-AR')}`
      : `Productos agregados: $${totalProductos.toLocaleString('es-AR')}`
    const fechaEntregaTexto = cuenta.next_order?.delivery_date ? formatearFecha(cuenta.next_order.delivery_date) : null
    mostrarAlerta(`¡Listo! Te llevamos todo junto${fechaEntregaTexto?` el ${fechaEntregaTexto}`:' con tu próxima entrega'}.\n\n${desglose}`)
    const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
    if(fresh?.found) cuenta = fresh
    cuentaPanel()
  }
  const btnEnviarWhatsappPedido = document.querySelector('#btn_enviar_whatsapp_pedido')
  if(btnEnviarWhatsappPedido) btnEnviarWhatsappPedido.onclick = async ()=>{
    const itemsCarrito = Object.entries(carritoProductos).filter(([,q])=>q>0).map(([id,q])=>({ p: (cuenta.catalogo||[]).find(pr=>pr.id===id), q })).filter(x=>x.p)
    if(!itemsCarrito.length){ mostrarAlerta('Elegí al menos un producto primero.'); return }
    const { data: settingsRaw } = await supabase.from('farm_settings').select('value').eq('key','whatsapp_pedidos_urgentes').maybeSingle()
    const numero = (settingsRaw?.value||'').replace(/\D/g,'')
    if(!numero){ mostrarAlerta('Todavía no está configurado el número de WhatsApp. Avisale a NÓMADES.'); return }
    const fechaTexto = cuenta.next_order?.delivery_date ? formatearFecha(cuenta.next_order.delivery_date) : 'tu próxima entrega'
    const lineas = itemsCarrito.map(({p,q})=>`• ${q}× ${p.name}`).join('\n')
    const mensaje = `Hola, quiero sumar esto a mi entrega:\nDNI: ${c.dni} — ${c.first_name} ${c.last_name}\nEntrega: ${fechaTexto}\n\n${lineas}\n\n¿Se puede sumar? Gracias`
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank')
  }
  document.querySelectorAll('[data-cancelar-interes]').forEach(b=>b.onclick=async()=>{
    const confirmado = await mostrarConfirmacion('¿Cancelar este producto? Ya no te lo vamos a llevar.')
    if(!confirmado) return
    const { data, error } = await supabase.rpc('customer_cancel_interest', { p_dni: c.dni, p_customer_id: c.id, p_interest_id: b.dataset.cancelarInteres })
    if(error || !data?.ok){ mostrarAlerta('No se pudo cancelar: '+(data?.error||error?.message||'')); return }
    const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
    if(fresh?.found) cuenta = fresh
    cuentaPanel()
  })
  document.querySelectorAll('[data-ajustar-interes]').forEach(b=>b.onclick=async()=>{
    const nueva = Number(b.dataset.nueva)
    const { data, error } = await supabase.rpc('customer_update_interest_quantity', { p_dni: c.dni, p_customer_id: c.id, p_interest_id: b.dataset.ajustarInteres, p_new_quantity: nueva })
    if(error || !data?.ok){ mostrarAlerta(data?.error || error?.message || 'No se pudo actualizar.'); return }
    const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
    if(fresh?.found) cuenta = fresh
    cuentaPanel()
  })
  document.querySelector('#btn_editar_datos').onclick = ()=>editarDatosForm(c)
  document.querySelector('#btn_ver_mapa').onclick = ()=>mapaSuscriptores()
  let ratingSel = 0
  const pintarEstrellas = ()=>{
    document.querySelectorAll('[data-estrella]').forEach(el=>{
      const activa = Number(el.dataset.estrella) <= ratingSel
      el.textContent = activa ? '★' : '☆'
      el.style.color = activa ? '#F5B301' : '#D8D3C6'
    })
  }
  document.querySelectorAll('[data-estrella]').forEach(el=>el.onclick=()=>{
    ratingSel = Number(el.dataset.estrella)
    pintarEstrellas()
  })
  const btnEnviarSugerencia = document.querySelector('#btn_enviar_sugerencia')
  if(btnEnviarSugerencia) btnEnviarSugerencia.onclick = async ()=>{
    const box = document.querySelector('#err_sugerencia')
    const desc = document.querySelector('#sugerencia_desc').value.trim()
    if(!desc){ box.textContent='Contanos qué producto te gustaría que tengamos.'; box.style.display='block'; return }
    let photo_url = null
    const fotoInput = document.querySelector('#sugerencia_foto')
    const fotoFile = fotoInput?.files?.[0]
    if(fotoFile){
      const path = `sugerencia_${Date.now()}.${(fotoFile.name.split('.').pop()||'jpg')}`
      const { error: upErr } = await supabase.storage.from('suggestion-photos').upload(path, fotoFile)
      if(upErr){ box.textContent='No se pudo subir la foto: '+upErr.message; box.style.display='block'; return }
      const { data: pub } = supabase.storage.from('suggestion-photos').getPublicUrl(path)
      photo_url = pub.publicUrl
    }
    const { data, error } = await supabase.rpc('customer_suggest_product', { p_dni: c.dni, p_customer_id: c.id, p_description: desc, p_photo_url: photo_url })
    if(error || !data?.ok){ box.textContent = 'No se pudo enviar: '+(data?.error||error?.message||''); box.style.display='block'; return }
    box.style.display='none'
    mostrarAlerta('¡Gracias por la idea! La vamos a evaluar para sumarla al catálogo.')
    document.querySelector('#sugerencia_desc').value=''
    if(fotoInput) fotoInput.value=''
  }
  document.querySelector('#btn_enviar_review').onclick = async ()=>{
    const box = document.querySelector('#err_review')
    if(!ratingSel){ box.textContent='Tocá las estrellas para elegir un puntaje.'; box.style.display='block'; return }
    const { data, error } = await supabase.rpc('customer_add_review', { p_dni: c.dni, p_customer_id: c.id, p_order_id: null, p_rating: ratingSel, p_comment: document.querySelector('#review_comment').value.trim() })
    if(error || !data?.ok){ box.textContent = data?.error || 'No se pudo enviar.'; box.style.display='block'; return }
    mostrarAlerta('¡Gracias por tu reseña! 🙌')
    cuentaPanel()
  }
  document.querySelectorAll('[data-cambiar-plan]').forEach(b=>b.onclick = ()=>{
    const sub = cuenta.subscriptions.find(s=>s.id===b.dataset.cambiarPlan)
    if(sub) cambiarPlanForm(sub)
  })
  document.querySelectorAll('[data-pausar]').forEach(b=>b.onclick = async ()=>{
    const fecha = prompt('¿Hasta qué fecha querés pausar? (opcional, formato AAAA-MM-DD). Dejá vacío si no sabés todavía.')
    if(fecha===null) return
    const { data, error } = await supabase.rpc('customer_pause_subscription', { p_dni: c.dni, p_customer_id: c.id, p_subscription_id: b.dataset.pausar, p_resume_date: fecha||null })
    if(error || !data?.ok){ mostrarAlerta('No se pudo pausar: '+(data?.error||error?.message||'')); return }
    mostrarAlerta('⏸️ Suscripción pausada. No te vamos a entregar ni cobrar hasta que la reanudes.')
    const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
    if(fresh?.found) cuenta = fresh
    cuentaPanel()
  })
  document.querySelectorAll('[data-reanudar]').forEach(b=>b.onclick = async ()=>{
    const { data, error } = await supabase.rpc('customer_resume_subscription', { p_dni: c.dni, p_customer_id: c.id, p_subscription_id: b.dataset.reanudar })
    if(error || !data?.ok){ mostrarAlerta('No se pudo reanudar: '+(data?.error||error?.message||'')); return }
    mostrarAlerta(data.next_delivery_date ? `▶️ Suscripción reanudada. Próxima entrega: ${formatearFecha(data.next_delivery_date)}` : '▶️ Suscripción reanudada.')
    const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
    if(fresh?.found) cuenta = fresh
    cuentaPanel()
  })
  cargarHistorialPagos(c)
  cargarOpcionesPago(c)
  cargarRepartidor(c, esHoy)
  if(!cuentaPollInterval) iniciarPollingCuenta()
  requestAnimationFrame(()=>window.scrollTo(0, scrollPrevioCuenta))
}

async function cargarRepartidor(c, esHoy){
  const box = document.querySelector('#card_repartidor')
  const bannerBox = document.querySelector('#card_hoy_banner')
  if(!box) return
  const { data } = await supabase.rpc('customer_get_driver', { p_dni: c.dni, p_customer_id: c.id })
  if(!data?.found){ box.innerHTML = `<h3>🚚 Tu repartidor</h3><p class="muted">Todavía no te asignamos un repartidor fijo. Te contactamos por WhatsApp o teléfono para coordinar tu entrega.</p>`; return }
  const foto = data.photo_url ? `<img src="${data.photo_url}" style="width:56px;height:56px;border-radius:50%;object-fit:cover"/>` : `<div style="width:56px;height:56px;border-radius:50%;background:#EAF0DC;display:flex;align-items:center;justify-content:center;font-size:22px">🚚</div>`
  const telLimpio = (data.phone||'').replace(/\D/g,'')
  const v = data.vehicle
  const vehiculoLinea = v ? `<p style="margin:6px 0 0">${v.type==='moto'?'🏍️':'🚚'} ${v.brand||''} ${v.model||''} · Patente ${v.plate}</p>` : ''
  box.innerHTML = `<h3>🚚 Tu repartidor</h3>
    <div style="display:flex;align-items:center;gap:12px">
      ${foto}
      <div><b>${data.full_name}</b>${data.phone?`<br><span class="muted">📞 ${data.phone}</span>`:''}</div>
    </div>
    ${vehiculoLinea}
    ${v?.photo_url?`<img src="${v.photo_url}" style="width:100%;border-radius:10px;margin-top:8px"/>`:''}
    ${telLimpio?`<a href="https://wa.me/54${telLimpio}" target="_blank" class="btn primary" style="margin-top:10px;display:inline-block;text-decoration:none;text-align:center;width:100%">💬 Escribirle por WhatsApp</a>`:''}`

  if(esHoy && bannerBox){
    bannerBox.innerHTML = `<div class="card" style="background:#2F4D2A;color:#F5EFE0;text-align:center;margin-bottom:14px">
      <h3 style="color:#F5EFE0;margin:0 0 8px">🚚 ¡Hoy te entregamos tu pedido!</h3>
      <div style="display:flex;align-items:center;justify-content:center;gap:10px">${foto}<div style="text-align:left"><b>${data.full_name}</b>${v?`<br><small>${v.type==='moto'?'🏍️':'🚚'} ${v.brand||''} ${v.model||''} · ${v.plate}</small>`:''}</div></div>
      ${v?.photo_url?`<img src="${v.photo_url}" style="width:100%;border-radius:10px;margin-top:10px"/>`:''}
    </div>`
  }
}


let adminMapaInstancia = null

// vista: 'ajustar' encuadra a todos (primera carga), 'mantener' respeta dónde estabas mirando.
// foco: coordenadas a las que centrarse, para revisar un pin recién ubicado.
async function initAdminMapa(opciones){
  const { vista = 'ajustar', foco = null } = opciones || {}
  const estado = document.querySelector('#admin_mapa_estado')
  const contenedor = document.querySelector('#admin_mapa_contenedor')
  const sinGeoBox = document.querySelector('#admin_mapa_sin_geo')
  if(!contenedor) return

  // Guardamos el encuadre actual ANTES de desmontar, o al corregir un pin
  // el mapa se alejaba de golpe y había que volver a buscar la calle a mano.
  const vistaPrevia = adminMapaInstancia
    ? { centro: adminMapaInstancia.getCenter(), zoom: adminMapaInstancia.getZoom() }
    : null

  try{ await cargarLeaflet() }
  catch(e){ if(estado) estado.textContent = 'No pudimos cargar el mapa. Revisá tu conexión.'; return }

  const { data: cfgMapaRaw } = await supabase.from('farm_settings').select('key,value')
    .in('key',['deposito_latitude','deposito_longitude','deposito_street','deposito_street_number','deposito_city','localidades_habituales'])
  const cfgMapa = Object.fromEntries((cfgMapaRaw||[]).map(x=>[x.key,x.value]))
  const depLat = cfgMapa.deposito_latitude ? Number(cfgMapa.deposito_latitude) : null
  const depLon = cfgMapa.deposito_longitude ? Number(cfgMapa.deposito_longitude) : null
  const hayDeposito = depLat != null && depLon != null && !isNaN(depLat) && !isNaN(depLon)
  // Las localidades del circuito habitual se configuran, no van escritas en el código:
  // el día que repartas fijo en San Lorenzo, dejan de ser un caso especial.
  const habituales = (cfgMapa.localidades_habituales||'Rosario').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean)
  const esHabitual = (c)=> habituales.includes((c.city||'').trim().toLowerCase())
  const kmDe = (c)=> hayDeposito ? distanciaKm(depLat, depLon, c.latitude, c.longitude) : null

  const { data: geoData } = await supabase.rpc('admin_clientes_geo')
  const clientes = (geoData?.clientes || []).map(c=>({ ...c, latitude: c.latitude!=null?Number(c.latitude):null, longitude: c.longitude!=null?Number(c.longitude):null }))
  const conteo = geoData?.conteo || {}
  const nombreDe = c => (c.nombre_comercial||'').trim() || `${c.first_name||''} ${c.last_name||''}`.trim() || 'Sin nombre'
  const conCoords = clientes.filter(c=>c.latitude!=null && c.longitude!=null)
  const dudosos = clientes.filter(c=>c.geo_estado==='dudoso')
  const sinCoords = clientes.filter(c=>c.geo_estado==='sin_ubicar')

  if(estado) estado.textContent = `${conteo.confirmados||0} de ${conteo.total||0} confirmados · ${conteo.dudosos||0} dudoso(s) · ${conteo.sin_ubicar||0} sin ubicar`

  const centro = conCoords.length ? [conCoords[0].latitude, conCoords[0].longitude] : [-32.9468, -60.6393]
  // Leaflet se niega a montar dos veces sobre el mismo div: si no lo desmontamos,
  // tira "Map container is already initialized" y se corta el refresco de la lista.
  if(adminMapaInstancia){ try{ adminMapaInstancia.remove() }catch(e){} adminMapaInstancia = null }
  const map = L.map('admin_mapa_contenedor')
  adminMapaInstancia = map
  if(foco) map.setView([foco.lat, foco.lng], 17)
  else if(vista === 'mantener' && vistaPrevia) map.setView(vistaPrevia.centro, vistaPrevia.zoom)
  else map.setView(centro, 12)
  L.tileLayer(TILES_URL, { maxZoom: 19, attribution: TILES_ATRIB }).addTo(map)

  // El pin dice tres cosas a la vez sin mezclarlas:
  //   forma  → dónde está (círculo = circuito habitual, rombo = afuera, cuadrado = comercio)
  //   color  → zona de reparto (solo tiene sentido dentro del circuito)
  //   borde  → si la ubicación está confirmada o no
  const grupo = []
  if(hayDeposito){
    L.marker([depLat, depLon], {
      icon: L.divIcon({ className:'', html:`<div style="width:26px;height:26px;border-radius:6px;background:${NOM.tinta};border:3px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px">🏠</div>`, iconSize:[26,26], iconAnchor:[13,13] })
    }).addTo(map).bindPopup(`<b>Depósito</b><br>${cfgMapa.deposito_street||''} ${cfgMapa.deposito_street_number||''}<br>${cfgMapa.deposito_city||''}`)
  }
  conCoords.forEach(c=>{
    const esDudoso = c.geo_estado === 'dudoso'
    const esComercio = c.customer_type === 'mayorista'
    const afuera = !esHabitual(c)
    const km = kmDe(c)
    const colorZona = (ZONA_COLORES[c.zone]||{text:'#2F4D2A'}).text
    const relleno = esDudoso ? NOM.ambarClaro : (afuera ? '#185FA5' : colorZona)
    const trazo = esDudoso ? `2px dashed ${NOM.ambar}` : '2px solid white'
    let forma = 'border-radius:50%'
    if(esComercio) forma = 'border-radius:4px'
    else if(afuera) forma = 'border-radius:2px;transform:rotate(45deg)'
    const lado = esComercio ? 18 : 16
    const marker = L.marker([c.latitude, c.longitude], {
      draggable: true,
      icon: L.divIcon({ className:'', html:`<div style="width:${lado}px;height:${lado}px;${forma};background:${relleno};border:${trazo};box-shadow:0 0 2px rgba(0,0,0,0.5)"></div>`, iconSize:[lado,lado], iconAnchor:[lado/2,lado/2] })
    }).addTo(map)
    const lineaKm = km!=null ? `<br>📏 <b>${formatearKm(km)}</b> del depósito <small>(en línea recta)</small>` : ''
    const lineaAfuera = afuera ? `<br><span style="color:#185FA5">📍 ${c.city||'Fuera del circuito'} — fuera del reparto habitual</span>` : ''
    const popup = () => `<b>${nombreDe(c)}</b>${esComercio?' <small>(comercio)</small>':''}${esDudoso?`<br><span style="color:${NOM.ambar}">⚠️ ${c.geo_motivo||'Ubicación sin confirmar'}</span>`:''}<br>${c.street||''} ${c.street_number||''}, ${c.neighborhood||''}${lineaAfuera}${lineaKm}<br>📞 ${c.phone||'-'}${esDudoso?'<br><small>Arrastrá el pin al lugar correcto para confirmarlo.</small>':''}`
    marker.bindPopup(popup())
    // Arrastrar el pin a mano es la confirmación: lo puso una persona, no el buscador.
    marker.on('dragend', async ()=>{
      const pos = marker.getLatLng()
      const { data, error } = await supabase.rpc('admin_set_customer_location', { p_customer_id: c.id, p_latitude: pos.lat, p_longitude: pos.lng, p_estado: 'confirmado', p_motivo: null })
      if(error || !data?.ok){ mostrarAlerta('No se pudo guardar la nueva ubicación.'); return }
      if(estado) estado.textContent = `✅ ${nombreDe(c)}: ubicación confirmada`
      await initAdminMapa({ vista:'mantener' })
    })
    grupo.push(marker)
  })
  if(grupo.length>1 && vista === 'ajustar' && !foco){ map.fitBounds(L.featureGroup(grupo).getBounds().pad(0.2)) }

  if(sinGeoBox){
    const apilados = {}
    conCoords.filter(c=>c.geo_estado==='dudoso').forEach(c=>{
      const k = `${Number(c.latitude).toFixed(4)},${Number(c.longitude).toFixed(4)}`
      apilados[k] = (apilados[k]||0) + 1
    })
    const maxApilados = Math.max(0, ...Object.values(apilados))

    const fila = (c, conMotivo) => `<div class="row"><span>${nombreDe(c)}${c.customer_type==='mayorista'?` <span class="badge" style="background:${NOM.ambar}">Comercio</span>`:''}${!esHabitual(c)?` <span class="badge" style="background:#185FA5">Fuera</span>`:''}<br><small>${c.street||''} ${c.street_number||''}, ${c.neighborhood||''}${c.city?' · '+c.city:''}${kmDe(c)!=null?' · 📏 '+formatearKm(kmDe(c)):''}</small>${conMotivo&&c.geo_motivo?`<br><span style="display:inline-block;margin-top:4px;font-size:11px;background:${NOM.ambarClaro};color:#854F0B;padding:2px 8px;border-radius:8px">${c.geo_motivo}</span>`:''}</span><button class="btn ghost" data-geocodificar="${c.id}" style="font-size:12px;white-space:nowrap">📍 Ubicar</button></div>`

    const alertaApilados = maxApilados > 1
      ? `<div class="alert warning" style="margin-bottom:12px"><b>⚠️ ${maxApilados} clientes apilados en el mismo punto</b><br>Cayeron todos en el mismo lugar porque no se encontró la dirección. El repartidor los ve como si estuvieran bien.</div>`
      : ''

    const fueraCircuito = conCoords.filter(c=>!esHabitual(c))
      .map(c=>({ ...c, km: kmDe(c) }))
      .sort((a,b)=>(b.km||0)-(a.km||0))
    const porLocalidad = {}
    fueraCircuito.forEach(c=>{
      const l = (c.city||'Sin localidad').trim()
      porLocalidad[l] ??= { clientes:0, comercios:0, km:c.km }
      if(c.customer_type==='mayorista') porLocalidad[l].comercios++; else porLocalidad[l].clientes++
      if(c.km!=null && (porLocalidad[l].km==null || c.km>porLocalidad[l].km)) porLocalidad[l].km = c.km
    })
    const bloqueFuera = fueraCircuito.length ? `<div style="background:#E6F1FB;border-radius:10px;padding:11px 13px;margin-bottom:12px">
      <div style="font-size:13px;font-weight:500;color:#0C447C;margin-bottom:6px">📍 Fuera del circuito habitual (${fueraCircuito.length})</div>
      ${Object.entries(porLocalidad).sort((a,b)=>(b[1].km||0)-(a[1].km||0)).map(([loc,d])=>{
        const partes = []
        if(d.clientes) partes.push(`${d.clientes} cliente${d.clientes>1?'s':''}`)
        if(d.comercios) partes.push(`${d.comercios} comercio${d.comercios>1?'s':''}`)
        return `<div style="font-size:12px;color:#185FA5">${loc} — ${partes.join(' y ')}${d.km!=null?`, a ${formatearKm(d.km)}`:''}</div>`
      }).join('')}
      ${hayDeposito?`<div style="font-size:11px;color:#378ADD;margin-top:5px">Distancias en línea recta desde el depósito. Por calle siempre es más.</div>`:`<div style="font-size:11px;color:#378ADD;margin-top:5px">Cargá la ubicación del depósito para ver las distancias.</div>`}
    </div>` : ''

    const bloqueMayoristas = (conteo.mayoristas_sin_ubicar||0) > 0
      ? `<div class="alert danger" style="margin-bottom:12px"><b>🏪 ${conteo.mayoristas_sin_ubicar} comercio(s) sin ubicación confirmada</b><br>Un comercio sin ubicar no entra en ninguna ruta de reparto.</div>`
      : ''

    sinGeoBox.innerHTML = `${bloqueFuera}${bloqueMayoristas}${alertaApilados}
      ${dudosos.length ? `<h3 style="font-size:15px">Ubicación dudosa (${dudosos.length})</h3><p class="muted" style="font-size:12px;margin:0 0 6px">Tienen un punto en el mapa, pero lo puso el buscador y nadie lo confirmó.</p>${dudosos.map(c=>fila(c,true)).join('')}` : ''}
      ${sinCoords.length ? `<h3 style="font-size:15px;margin-top:${dudosos.length?'18px':'0'}">Sin ubicar todavía (${sinCoords.length})</h3>${sinCoords.map(c=>fila(c,true)).join('')}
        <button class="btn ghost" id="btn_ubicar_todos" style="width:100%;margin-top:10px">🔄 Ubicar los ${sinCoords.length} automáticamente</button>
        <p class="muted" style="font-size:11px;margin-top:6px">Va de a uno por segundo: el servicio de mapas es gratuito y no deja ir más rápido.</p>` : ''}
      ${!dudosos.length && !sinCoords.length ? `<p class="muted">Todos los clientes tienen su ubicación confirmada 🎉</p>` : ''}`

    const ubicarUno = async (cli, boton) => {
      if(boton) boton.textContent = 'Buscando…'
      const geo = await geocodificarDireccion(direccionParaBuscar(cli))
      const veredicto = evaluarGeo(geo, cli)
      if(veredicto.estado === 'sin_ubicar'){
        await supabase.rpc('marcar_geo_fallido', { p_customer_id: cli.id, p_motivo: veredicto.motivo })
        return veredicto
      }
      await supabase.rpc('admin_set_customer_location', { p_customer_id: cli.id, p_latitude: geo.lat, p_longitude: geo.lon, p_estado: veredicto.estado, p_motivo: veredicto.motivo })
      return { ...veredicto, lat: geo.lat, lon: geo.lon }
    }

    sinGeoBox.querySelectorAll('[data-geocodificar]').forEach(b=>b.onclick=async()=>{
      const cli = clientes.find(c=>c.id===b.dataset.geocodificar)
      if(!cli) return
      const veredicto = await ubicarUno(cli, b)
      if(veredicto.estado === 'sin_ubicar'){
        mostrarAlerta(`No encontramos la dirección de ${nombreDe(cli)} (${veredicto.motivo.toLowerCase()}).\n\nRevisá que la calle y la localidad estén bien escritas, o ubicalo a mano arrastrando su pin cuando aparezca.`)
        await initAdminMapa({ vista:'mantener' })
        return
      }
      await initAdminMapa({ foco: { lat: veredicto.lat, lng: veredicto.lon } })
    })

    const btnTodos = document.querySelector('#btn_ubicar_todos')
    if(btnTodos) btnTodos.onclick = async ()=>{
      btnTodos.disabled = true
      let ok = 0, revisar = 0, fallaron = 0
      for(let i=0; i<sinCoords.length; i++){
        btnTodos.textContent = `Ubicando ${i+1} de ${sinCoords.length}…`
        const v = await ubicarUno(sinCoords[i], null)
        if(v.estado === 'confirmado') ok++
        else if(v.estado === 'dudoso') revisar++
        else fallaron++
        if(i < sinCoords.length-1) await new Promise(r=>setTimeout(r, 1100))
      }
      mostrarAlerta(`Listo.\n\n✅ ${ok} ubicado(s) con precisión\n⚠️ ${revisar} para revisar a mano\n❌ ${fallaron} sin encontrar`)
      await initAdminMapa({ vista:'ajustar' })
    }
  }
}

async function mapaSuscriptores(){
  const c = cuenta.customer
  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><button class="btn ghost" id="btn_volver_cuenta" style="padding:6px 12px">← Volver</button><h2 style="margin:0">🗺️ Suscriptores NÓMADES</h2></div>
  <p class="muted" id="mapa_estado">Cargando mapa…</p>
  <div id="mapa_contenedor" style="height:360px;border-radius:12px;overflow:hidden;background:#eee"></div>`)
  document.querySelector('#btn_volver_cuenta').onclick = ()=>{ current='cuenta'; render() }

  try{
    await cargarLeaflet()
  }catch(e){
    document.querySelector('#mapa_estado').textContent = 'No pudimos cargar el mapa. Revisá tu conexión e intentá de nuevo.'
    return
  }

  // Si el cliente todavía no tiene coordenadas guardadas, las geocodificamos ahora con su dirección
  if(!c.latitude || !c.longitude){
    const geo = await geocodificarDireccion(direccionParaBuscar(c))
    const veredicto = evaluarGeo(geo, c)
    if(veredicto.estado === 'sin_ubicar'){
      await supabase.rpc('marcar_geo_fallido', { p_customer_id: c.id, p_motivo: veredicto.motivo })
    } else {
      c.latitude = geo.lat; c.longitude = geo.lon
      await supabase.rpc('customer_set_location', { p_dni: c.dni, p_customer_id: c.id, p_latitude: geo.lat, p_longitude: geo.lon, p_estado: veredicto.estado, p_motivo: veredicto.motivo })
    }
  }

  const { data: puntos } = await supabase.rpc('public_subscribers_map')
  const lista = puntos || []
  const estado = document.querySelector('#mapa_estado')
  estado.textContent = `Somos ${lista.length} suscriptor${lista.length===1?'':'es'} de huevos de libre pastoreo en la zona 🐔`

  const centro = (c.latitude && c.longitude) ? [c.latitude, c.longitude] : [-32.9468, -60.6393]
  const map = L.map('mapa_contenedor').setView(centro, c.latitude ? 14 : 12)
  L.tileLayer(TILES_URL, { maxZoom: 19, attribution: TILES_ATRIB }).addTo(map)

  lista.forEach(p=>{
    if(p.latitude==null || p.longitude==null) return
    const esVos = c.latitude && c.longitude && Math.abs(p.latitude-c.latitude)<0.0001 && Math.abs(p.longitude-c.longitude)<0.0001
    L.circleMarker([p.latitude, p.longitude], {
      radius: esVos ? 10 : 6,
      color: esVos ? '#E8833A' : '#2F4D2A',
      fillColor: esVos ? '#E8833A' : '#8FAE6B',
      fillOpacity: 0.9,
      weight: 2
    }).addTo(map).bindPopup(esVos ? '📍 Vos' : `${p.first_name||'Suscriptor'} · ${p.neighborhood||''}`)
  })
}


async function cargarOpcionesPago(c){
  const box = document.querySelector('#card_pagar')
  if(!box) return
  const next = cuenta.next_order
  if(!next || next.status === 'delivered'){ box.style.display='none'; return }

  const [{ data: linksRaw }, { data: cfgRaw }] = await Promise.all([
    supabase.rpc('customer_link_pago', { p_dni: c.dni, p_customer_id: c.id }),
    supabase.from('farm_settings').select('key,value').in('key',['wallet_discount_type','wallet_discount_value','transfer_alias','transfer_cbu','transfer_holder_name','mp_alias','mp_wallet_name'])
  ])
  const cfg = Object.fromEntries((cfgRaw||[]).map(x=>[x.key,x.value]))
  const links = linksRaw?.links || []
  const link = links.find(l=>l.order_id === next.id)

  if(link && link.estado === 'pagado'){
    box.innerHTML = `<h3>Pago</h3><div class="alert info">Ya está pago. El repartidor no te va a cobrar nada al entregar.</div>`
    return
  }

  const sub = (cuenta.subscriptions||[]).find(x=>x.status==='active') || {}
  const total = Number(link?.monto || sub.price_at_signup || 0)
  if(total <= 0){ box.style.display='none'; return }

  const tipo = cfg.wallet_discount_type || 'percent'
  const valor = Number(cfg.wallet_discount_value || 0)
  const conDescuento = tipo === 'percent' ? Math.round(total * (1 - valor/100)) : Math.max(0, total - valor)
  const ahorro = total - conDescuento
  const alias = cfg.transfer_alias || cfg.mp_alias || ''
  const cbu = cfg.transfer_cbu || ''

  box.innerHTML = `<h3>¿Cómo querés pagar?</h3>
    <p class="muted" style="margin-bottom:12px">Entrega del ${formatearFecha(next.delivery_date)}</p>

    ${alias || cbu ? `<div style="border:2px solid ${NOM.verde};border-radius:14px;padding:13px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:9px">
        <div><div style="font-size:15px;font-weight:500;color:${NOM.tinta}">Transferencia</div><div style="font-size:12.5px;color:${NOM.tintaSuave}">Desde tu banco o billetera</div></div>
        ${ahorro>0?pPill(tipo==='percent'?`${valor}% off`:`$${valor.toLocaleString('es-AR')} off`):''}
      </div>
      <div style="display:flex;align-items:baseline;gap:9px">
        <span style="font-size:25px;font-weight:500;color:${NOM.verde};font-variant-numeric:tabular-nums">$${conDescuento.toLocaleString('es-AR')}</span>
        ${ahorro>0?`<span style="font-size:14px;color:#A8A89E;text-decoration:line-through;font-variant-numeric:tabular-nums">$${total.toLocaleString('es-AR')}</span>`:''}
      </div>
      ${ahorro>0?`<div style="font-size:12.5px;color:${NOM.verde};margin-top:4px">Te ahorrás $${ahorro.toLocaleString('es-AR')}</div>`:''}
      <div style="background:${NOM.fondo};border-radius:11px;padding:11px 12px;margin-top:11px">
        ${alias?`<div class="row" style="border:0;padding:3px 0"><span style="font-size:12px;color:${NOM.tintaSuave}">Alias</span><span style="font-size:13px;font-weight:500" id="pago_alias">${alias}</span></div>`:''}
        ${cbu?`<div class="row" style="border:0;padding:3px 0"><span style="font-size:12px;color:${NOM.tintaSuave}">CBU</span><span style="font-size:13px;font-weight:500" id="pago_cbu">${cbu}</span></div>`:''}
        ${cfg.transfer_holder_name?`<div class="row" style="border:0;padding:3px 0"><span style="font-size:12px;color:${NOM.tintaSuave}">Titular</span><span style="font-size:13px">${cfg.transfer_holder_name}</span></div>`:''}
      </div>
      <div style="display:flex;gap:8px;margin-top:10px">
        ${alias?`<button class="btn primary" data-copiar-pago="pago_alias" style="flex:1">Copiar alias</button>`:''}
        ${cbu?`<button class="btn ghost" data-copiar-pago="pago_cbu" style="flex:1">Copiar CBU</button>`:''}
      </div>
      <p class="muted" style="font-size:11.5px;margin:9px 0 0">Después de transferir, mandale el comprobante al repartidor.</p>
    </div>`:''}

    <div style="border:1px solid ${NOM.borde};border-radius:14px;padding:13px">
      <div style="font-size:15px;font-weight:500;color:${NOM.tinta}">Tarjeta o cuotas</div>
      <div style="font-size:12.5px;color:${NOM.tintaSuave};margin-bottom:8px">Débito, crédito o dinero en cuenta</div>
      <div style="font-size:21px;font-weight:500;color:${NOM.tinta};font-variant-numeric:tabular-nums">$${total.toLocaleString('es-AR')}</div>
      ${link?.init_point
        ? `<a href="${link.init_point}" target="_blank" class="btn ghost" style="display:block;text-align:center;text-decoration:none;margin-top:11px;padding:12px 0">Pagar con Mercado Pago</a>`
        : `<p class="muted" style="font-size:12px;margin:10px 0 0">Pedile el link de pago al equipo por WhatsApp.</p>`}
    </div>`

  document.querySelectorAll('[data-copiar-pago]').forEach(b=>b.onclick=()=>{
    const el = document.querySelector('#'+b.dataset.copiarPago)
    if(!el) return
    navigator.clipboard?.writeText(el.textContent.trim())
    const t = b.textContent
    b.textContent = 'Copiado'
    setTimeout(()=>{ b.textContent = t }, 1500)
  })
}

async function cargarHistorialPagos(c){
  const box = document.querySelector('#card_pagos')
  const { data } = await supabase.rpc('customer_payment_history', { p_dni: c.dni, p_customer_id: c.id })
  const pagos = data || []
  if(!box) return
  if(!pagos.length){ box.innerHTML = `<h3>💳 Historial de pagos</h3><p class="muted">Todavía no tenés pagos registrados.</p>`; return }
  box.innerHTML = `<h3>💳 Historial de pagos</h3>${pagos.map(p=>{
    const distinto = p.expected_method && p.expected_method !== p.actual_method
    const fecha = new Date(p.date).toLocaleDateString('es-AR',{day:'numeric',month:'short',year:'numeric'})
    return `<div class="row"><span>${fecha}${distinto?` <small class="muted">(pagaste ${METODOS_PAGO_LABEL[p.actual_method]||p.actual_method}, tenías seteado ${METODOS_PAGO_LABEL[p.expected_method]||p.expected_method})</small>`:` <small class="muted">${METODOS_PAGO_LABEL[p.actual_method]||p.actual_method}</small>`}</span><span><b>$${Number(p.amount||0).toLocaleString('es-AR')}</b></span></div>`
  }).join('')}`
}

let planesDisponibles = []
let planesDisponiblesTipo = null
let panelVolver = null

function totalCarrito(carrito){
  return Object.entries(carrito).reduce((sum,[eggQty,qty])=>sum + Number(eggQty)*qty, 0)
}
function precioCarrito(carrito){
  return Object.entries(carrito).reduce((sum,[eggQty,qty])=>{
    const plan = planesDisponibles.find(p=>String(p.egg_quantity)===eggQty)
    return sum + (plan?Number(plan.price):0)*qty
  }, 0)
}
function carritoResumen(carrito){
  return Object.entries(carrito).filter(([,q])=>q>0).map(([eggQty,qty])=>`${qty}×${eggQty}`).join(' + ')
}

async function cambiarPlanForm(sub){
  const volver = panelVolver || cuentaPanel
  const tipoCliente = cuenta?.customer?.customer_type === 'mayorista' ? 'mayorista' : 'minorista'
  const box = document.querySelector('#card_subs')
  box.innerHTML = `<h3>Cambiar plan</h3><p class="muted">Cargando opciones…</p>`
  if(!planesDisponibles.length || planesDisponiblesTipo !== tipoCliente){
    const { data } = await supabase.from('plan_prices').select('egg_quantity,price').eq('active', true).eq('customer_type', tipoCliente).order('egg_quantity')
    planesDisponibles = data || [{egg_quantity:15,price:7000},{egg_quantity:30,price:12000}]
    planesDisponiblesTipo = tipoCliente
  }
  const carrito = {}
  planesDisponibles.forEach(p=>{ carrito[p.egg_quantity] = 0 })
  if(sub.plan_breakdown && Array.isArray(sub.plan_breakdown)){
    sub.plan_breakdown.forEach(it=>{ if(carrito[it.size]!==undefined) carrito[it.size]=it.qty })
  } else if(carrito[sub.egg_quantity]!==undefined){
    carrito[sub.egg_quantity] = 1
  }
  let freqSel = sub.frequency
  let diaSel = null
  let disponibilidad = null
  let alternativas = null
  const DIAS_LOCAL = [[1,'Lunes'],[2,'Martes'],[3,'Miércoles'],[4,'Jueves'],[5,'Viernes']]
  const render2 = ()=>{
    const total = totalCarrito(carrito)
    let dispHtml = ''
    if(disponibilidad!==null){
      if(disponibilidad.available){
        dispHtml = `<div class="alert info">✅ Hay lugar. Próxima entrega: <b>${new Date(disponibilidad.next_date+'T00:00:00').toLocaleDateString('es-AR',{day:'numeric',month:'long'})}</b></div>`
      } else if(diaSel!==null && alternativas && alternativas.length){
        const diaLabel = DIAS_LOCAL.find(([v])=>v===diaSel)?.[1]||''
        dispHtml = `<div class="alert info">🔥 ${diaLabel} no tiene lugar, pero sí estos días:
          <div class="grid two" style="margin-top:10px">${alternativas.map(a=>{
            const l = DIAS_LOCAL.find(([v])=>v===a.weekday)?.[1]||''
            const f = new Date(a.date+'T00:00:00').toLocaleDateString('es-AR',{day:'numeric',month:'short'})
            return `<button type="button" class="btn ghost" data-alt-dia="${a.weekday}">${l} <small>(${f})</small></button>`
          }).join('')}</div></div>`
      } else {
        dispHtml = `<div class="alert info">🔥 No hay lugar libre ahora mismo para esta cantidad — pero tranquilo, tu suscripción actual sigue activa hasta que cambies, y si confirmás quedás en lista de espera para la ampliación.</div>`
      }
    }
    box.innerHTML = `<h3>Cambiar plan</h3>
      <div class="field"><label>Elegí y combiná los tamaños que quieras</label>
        ${planesDisponibles.map(p=>`<div class="row"><span>Maple de ${p.egg_quantity} huevos <small class="muted">$${Number(p.price).toLocaleString('es-AR')} el maple ($${Math.round(p.price/p.egg_quantity).toLocaleString('es-AR')} por huevo)</small></span><span style="display:flex;align-items:center;gap:8px"><button type="button" class="btn ghost" data-carrito-menos="${p.egg_quantity}" style="padding:6px 14px">−</button><b style="min-width:20px;text-align:center;display:inline-block">${carrito[p.egg_quantity]||0}</b><button type="button" class="btn ghost" data-carrito-mas="${p.egg_quantity}" style="padding:6px 14px">+</button></span></div>`).join('')}
      </div>
      <div class="alert info" style="margin-top:8px"><b>Total: ${total} huevos</b> ${carritoResumen(carrito)?`(${carritoResumen(carrito)})`:''} · $${precioCarrito(carrito).toLocaleString('es-AR')}</div>
      <div class="field" style="margin-top:10px"><label>Frecuencia</label>
        <div class="grid three">${Object.entries(FRECUENCIAS).map(([v,l])=>`<button type="button" class="btn ${freqSel===v?'primary':'ghost'}" data-freq="${v}">${l}</button>`).join('')}</div>
      </div>
      <div class="field"><label>¿Día preferido? (opcional)</label>
        <div class="grid three">
          <button type="button" class="btn ${diaSel===null?'primary':'ghost'}" data-dia="">Cualquiera</button>
          ${DIAS_LOCAL.map(([v,l])=>`<button type="button" class="btn ${diaSel===v?'primary':'ghost'}" data-dia="${v}">${l}</button>`).join('')}
        </div>
      </div>
      <div id="disp_cambio">${dispHtml}</div>
      <div id="err_cambio" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_confirmar_cambio">Confirmar cambio</button>
      <button class="btn ghost" id="btn_cancelar_cambio" style="margin-left:8px">Cancelar</button>`
    document.querySelectorAll('[data-carrito-mas]').forEach(b=>b.onclick=async()=>{ carrito[b.dataset.carritoMas]++; disponibilidad=null; render2(); await consultar() })
    document.querySelectorAll('[data-carrito-menos]').forEach(b=>b.onclick=async()=>{ if(carrito[b.dataset.carritoMenos]>0) carrito[b.dataset.carritoMenos]--; disponibilidad=null; render2(); await consultar() })
    document.querySelectorAll('[data-freq]').forEach(b=>b.onclick=async()=>{ freqSel=b.dataset.freq; disponibilidad=null; render2(); await consultar() })
    document.querySelectorAll('[data-dia]').forEach(b=>b.onclick=async()=>{ diaSel=b.dataset.dia?Number(b.dataset.dia):null; disponibilidad=null; render2(); await consultar() })
    document.querySelectorAll('[data-alt-dia]').forEach(b=>b.onclick=async()=>{ diaSel=Number(b.dataset.altDia); disponibilidad=null; render2(); await consultar() })
    document.querySelector('#btn_cancelar_cambio').onclick = ()=>volver()
    document.querySelector('#btn_confirmar_cambio').onclick = async ()=>{
      const errBox = document.querySelector('#err_cambio')
      const total2 = totalCarrito(carrito)
      if(total2<=0){ errBox.textContent='Elegí al menos un maple.'; errBox.style.display='block'; return }
      const breakdown = Object.entries(carrito).filter(([,q])=>q>0).map(([size,qty])=>({size:Number(size),qty}))
      const { data, error } = await supabase.rpc('customer_update_subscription', {
        p_dni: cuenta.customer.dni, p_customer_id: cuenta.customer.id, p_subscription_id: sub.id,
        p_egg_quantity: total2, p_frequency: freqSel, p_preferred_weekday: diaSel,
        p_plan_breakdown: breakdown, p_price: precioCarrito(carrito)
      })
      if(error || !data?.ok){ errBox.textContent='No pudimos hacer el cambio. Probá de nuevo.'; errBox.style.display='block'; return }
      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: cuenta.customer.dni })
      if(fresh?.found) cuenta = fresh
      mostrarAlerta(data.status==='active' ? '✅ Plan actualizado. Próxima entrega: '+data.next_delivery_date : '🕒 Quedaste en lista de espera para la ampliación de tu plan.')
      volver()
    }
  }
  const consultar = async ()=>{
    const total = totalCarrito(carrito)
    if(total<=0){ disponibilidad=null; render2(); return }
    const { data, error } = await supabase.rpc('check_availability', { p_egg_quantity: total, p_frequency: freqSel, p_preferred_weekday: diaSel })
    disponibilidad = (!error && data) ? data : null
    alternativas = null
    if(!disponibilidad?.available && diaSel !== null){
      const { data: alt } = await supabase.rpc('available_days_summary', { p_egg_quantity: total, p_frequency: freqSel })
      alternativas = (alt||[]).filter(a=>a.weekday !== diaSel)
    }
    render2()
  }
  render2()
  await consultar()
}

const ZONAS = [
  { value: 'norte', label: 'Norte' },
  { value: 'sur', label: 'Sur' },
  { value: 'este', label: 'Este' },
  { value: 'oeste', label: 'Oeste' }
]
const ZONA_COLORES = {
  norte: { bg:'#E3EFDA', text:'#2E5C1E' },
  sur:   { bg:'#FBE4CC', text:'#B85C00' },
  oeste: { bg:'#EBDCF5', text:'#6A1B9A' },
  este:  { bg:'#FBF0C7', text:'#8A6D00' }
}
function zonaBadge(zona){
  const c = ZONA_COLORES[zona] || { bg:'#eee', text:'#666' }
  const label = zona ? 'Zona '+zona[0].toUpperCase()+zona.slice(1) : 'Sin zona'
  return `<span style="background:${c.bg};color:${c.text};font-size:11px;font-weight:700;padding:2px 9px;border-radius:6px;white-space:nowrap">${label}</span>`
}

// --- Sistema visual premium para el panel de administración ---
function pCard(inner, extraStyle){ return `<div style="background:${NOM.superficie};border-radius:16px;border:1px solid ${NOM.borde};padding:15px 16px;margin-bottom:10px;${extraStyle||''}">${inner}</div>` }
function pPill(text, bg, color){ return `<span style="background:${bg||NOM.verdeClaro};color:${color||NOM.verde};font-size:11px;font-weight:500;padding:4px 10px;border-radius:7px;white-space:nowrap;display:inline-block;letter-spacing:0.1px">${text}</span>` }
function pAvatar(nombre, size){ const s=size||40; const inicial=(nombre||'?').trim().charAt(0).toUpperCase(); return `<div style="width:${s}px;height:${s}px;border-radius:${Math.round(s*0.32)}px;background:${NOM.verdeClaro};color:${NOM.verde};display:flex;align-items:center;justify-content:center;font-weight:500;font-size:${Math.round(s*0.38)}px;flex-shrink:0">${inicial}</div>` }
function pBar(pct, colorOk, colorWarn, warn){ const p=Math.max(0,Math.min(100,pct)); return `<div style="height:6px;background:#E3DCC8;border-radius:3px;overflow:hidden;margin-top:4px"><div style="height:100%;width:${p}%;background:${warn?(colorWarn||'#E8833A'):(colorOk||'#8FAE6B')};border-radius:3px"></div></div>` }
function pBtn(icon, label, attrs, variant){
  const styles = { primary:`background:${NOM.verde};color:#F7F4EC;border:1px solid ${NOM.verde}`, ghost:`background:${NOM.superficie};color:${NOM.tinta};border:1px solid ${NOM.borde}`, danger:`background:${NOM.superficie};color:${NOM.rojo};border:1px solid rgba(176,58,46,0.22)` }
  return `<button ${attrs} style="flex:1;${styles[variant||'ghost']};border-radius:11px;padding:10px 4px;font-size:11.5px;font-weight:500;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0">${icon}<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${label}</span></button>`
}
function pBtnRow(buttons){ return `<div style="display:flex;gap:8px;margin-top:10px">${buttons.join('')}</div>` }
function attachAvisoNumeroEnCalle(streetElId, numberElId, avisoBoxId){
  const streetEl = document.querySelector('#'+streetElId)
  const avisoBox = document.querySelector('#'+avisoBoxId)
  if(!streetEl || !avisoBox) return
  streetEl.onblur = ()=>{
    const numberEl = document.querySelector('#'+numberElId)
    const match = streetEl.value.trim().match(/^(.*\S)\s+(\d{1,5}(?:\s*bis)?)$/i)
    if(match && numberEl && !numberEl.value.trim()){
      avisoBox.innerHTML = `<div class="alert info" style="margin-bottom:10px">Parece que escribiste el número (<b>${match[2]}</b>) junto con el nombre de la calle. <button type="button" class="btn ghost" id="btn_mover_numero_${streetElId}" style="margin-top:6px;padding:6px 12px;font-size:12px">Pasarlo a "Número"</button></div>`
      const btn = document.querySelector('#btn_mover_numero_'+streetElId)
      if(btn) btn.onclick = ()=>{
        streetEl.value = match[1]
        numberEl.value = match[2]
        avisoBox.innerHTML = ''
      }
    } else {
      avisoBox.innerHTML = ''
    }
  }
}
function mostrarAlerta(mensaje){
  return new Promise((resolve)=>{
    const overlay = document.createElement('div')
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(20,20,18,0.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:nomFadeIn 0.15s ease'
    overlay.innerHTML = `<div style="background:#FFFFFF;border-radius:16px;padding:24px 20px;max-width:340px;width:100%;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.18);animation:nomPop 0.18s ease">
      <div style="width:44px;height:44px;border-radius:50%;background:#EAF0DC;display:flex;align-items:center;justify-content:center;margin:0 auto 14px"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 12.5L9.5 18L20 6" fill="none" stroke="#2F4D2A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="24" stroke-dashoffset="24" style="animation:nomDrawCheck 0.35s ease 0.1s forwards"/></svg></div>
      <div style="font-size:14px;color:#2F4D2A;line-height:1.5;margin-bottom:18px;white-space:pre-line">${mensaje}</div>
      <button id="nom_modal_ok" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">Entendido</button>
    </div>`
    document.body.appendChild(overlay)
    const cerrar = ()=>{ if(overlay.parentNode) document.body.removeChild(overlay); resolve() }
    overlay.querySelector('#nom_modal_ok').onclick = cerrar
    overlay.onclick = (e)=>{ if(e.target===overlay) cerrar() }
  })
}
function mostrarConfirmacion(mensaje){
  return new Promise((resolve)=>{
    const overlay = document.createElement('div')
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(20,20,18,0.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:nomFadeIn 0.15s ease'
    overlay.innerHTML = `<div style="background:#FFFFFF;border-radius:16px;padding:24px 20px;max-width:340px;width:100%;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.18);animation:nomPop 0.18s ease">
      <div style="width:44px;height:44px;border-radius:50%;background:#FBE4CC;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:20px;color:#B85C00">?</div>
      <div style="font-size:14px;color:#2F4D2A;line-height:1.5;margin-bottom:18px;white-space:pre-line">${mensaje}</div>
      <div style="display:flex;gap:8px">
        <button id="nom_modal_cancel" style="flex:1;background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">Cancelar</button>
        <button id="nom_modal_ok" style="flex:1;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">Confirmar</button>
      </div>
    </div>`
    document.body.appendChild(overlay)
    const cerrar = (v)=>{ if(overlay.parentNode) document.body.removeChild(overlay); resolve(v) }
    overlay.querySelector('#nom_modal_cancel').onclick = ()=>cerrar(false)
    overlay.querySelector('#nom_modal_ok').onclick = ()=>cerrar(true)
    overlay.onclick = (e)=>{ if(e.target===overlay) cerrar(false) }
  })
}
function mostrarDetalleProducto(p){
  const yaElegido = (cuenta?.mis_intereses||[]).find(mi=>mi.product_id===p.id && mi.status==='interested')
  const yaNotificar = (cuenta?.mis_intereses||[]).find(mi=>mi.product_id===p.id && mi.status==='notify')
  const sinStock = p.stock!==null && p.stock<=0
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(20,20,18,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:nomFadeIn 0.15s ease'
  const accionHtml = yaElegido
    ? `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span class="badge">✅ Confirmado</span>
        <button id="modal_menos_${p.id}" style="width:30px;height:30px;border-radius:8px;background:#F5EFE0;color:#2F4D2A;border:none;font-size:16px;font-weight:700">−</button>
        <b id="modal_cant_${p.id}" style="min-width:16px;text-align:center">${yaElegido.quantity}</b>
        <button id="modal_mas_${p.id}" style="width:30px;height:30px;border-radius:8px;background:#2F4D2A;color:#F5EFE0;border:none;font-size:16px;font-weight:700">+</button>
        <button id="modal_eliminar_${p.id}" style="width:30px;height:30px;border-radius:8px;background:#FFFFFF;color:#B03A2E;border:1px solid #E3DCC8;font-size:13px">🗑️</button>
      </div>`
    : sinStock
      ? (yaNotificar ? `<span class="badge" style="background:#D3D1C7;color:#5F5E5A">🔔 Te vamos a avisar</span>` : `<button id="modal_notificar_${p.id}" style="background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:600">🔔 Avisame cuando haya</button>`)
      : `<div style="display:flex;align-items:center;gap:10px">
          <button id="modal_menos_${p.id}" style="width:34px;height:34px;border-radius:8px;background:#F5EFE0;color:#2F4D2A;border:none;font-size:18px;font-weight:700">−</button>
          <b id="modal_cant_${p.id}" style="min-width:18px;text-align:center;font-size:16px">${carritoProductos[p.id]||0}</b>
          <button id="modal_mas_${p.id}" style="width:34px;height:34px;border-radius:8px;background:#2F4D2A;color:#F5EFE0;border:none;font-size:18px;font-weight:700">+</button>
        </div>`
  overlay.innerHTML = `<div style="background:#FFFFFF;border-radius:16px;max-width:360px;width:100%;max-height:88vh;overflow:auto;box-shadow:0 8px 24px rgba(0,0,0,0.25);animation:nomPop 0.18s ease">
    ${p.photo_url?`<div style="width:100%;height:240px;background:#F5EFE0;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:center;overflow:hidden"><img src="${p.photo_url}" style="max-width:100%;max-height:100%;object-fit:contain"/></div>`:`<div style="width:100%;height:180px;background:#F5EFE0;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:center;font-size:44px">🛒</div>`}
    <div style="padding:18px 20px 20px">
      <div style="font-size:17px;font-weight:700;color:#2F4D2A;margin-bottom:8px">${p.name}</div>
      ${p.description?`<div style="font-size:13.5px;color:#5F5E5A;line-height:1.5;margin-bottom:14px;white-space:pre-line">${p.description}</div>`:''}
      <div style="font-size:16px;font-weight:700;color:#2F4D2A;margin-bottom:6px">$${Number(p.price).toLocaleString('es-AR')} · ${p.unit_label||'unidad'}</div>
      ${p.stock!==null && !sinStock?`<div style="font-size:12px;color:#8A8570;margin-bottom:14px">Quedan ${p.stock} unidades</div>`:'<div style="margin-bottom:14px"></div>'}
      <div style="margin-bottom:16px">${accionHtml}</div>
      <button id="nom_modal_ok" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">Cerrar</button>
    </div>
  </div>`
  document.body.appendChild(overlay)
  const cerrar = ()=>{ if(overlay.parentNode) document.body.removeChild(overlay) }
  overlay.querySelector('#nom_modal_ok').onclick = cerrar
  overlay.onclick = (e)=>{ if(e.target===overlay) cerrar() }

  if(yaElegido){
    overlay.querySelector(`#modal_menos_${p.id}`).onclick = async ()=>{
      const nueva = yaElegido.quantity-1
      const { data, error } = await supabase.rpc('customer_update_interest_quantity', { p_dni: cuenta.customer.dni, p_customer_id: cuenta.customer.id, p_interest_id: yaElegido.id, p_new_quantity: nueva })
      if(error || !data?.ok){ mostrarAlerta(data?.error||error?.message||'No se pudo actualizar.'); return }
      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: cuenta.customer.dni })
      if(fresh?.found) cuenta = fresh
      cerrar(); cuentaPanel()
    }
    overlay.querySelector(`#modal_mas_${p.id}`).onclick = async ()=>{
      const nueva = yaElegido.quantity+1
      const { data, error } = await supabase.rpc('customer_update_interest_quantity', { p_dni: cuenta.customer.dni, p_customer_id: cuenta.customer.id, p_interest_id: yaElegido.id, p_new_quantity: nueva })
      if(error || !data?.ok){ mostrarAlerta(data?.error||error?.message||'No se pudo actualizar.'); return }
      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: cuenta.customer.dni })
      if(fresh?.found) cuenta = fresh
      cerrar(); cuentaPanel()
    }
    overlay.querySelector(`#modal_eliminar_${p.id}`).onclick = async ()=>{
      const confirmado = await mostrarConfirmacion('¿Cancelar este producto? Ya no te lo vamos a llevar.')
      if(!confirmado) return
      const { data, error } = await supabase.rpc('customer_cancel_interest', { p_dni: cuenta.customer.dni, p_customer_id: cuenta.customer.id, p_interest_id: yaElegido.id })
      if(error || !data?.ok){ mostrarAlerta('No se pudo cancelar: '+(data?.error||error?.message||'')); return }
      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: cuenta.customer.dni })
      if(fresh?.found) cuenta = fresh
      cerrar(); cuentaPanel()
    }
  } else if(sinStock){
    const btnNotificar = overlay.querySelector(`#modal_notificar_${p.id}`)
    if(btnNotificar) btnNotificar.onclick = async ()=>{
      const { data, error } = await supabase.rpc('customer_notify_stock', { p_dni: cuenta.customer.dni, p_customer_id: cuenta.customer.id, p_product_id: p.id })
      if(error || !data?.ok){ mostrarAlerta('No se pudo registrar: '+(data?.error||error?.message||'')); return }
      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: cuenta.customer.dni })
      if(fresh?.found) cuenta = fresh
      cerrar(); cuentaPanel()
    }
  } else {
    overlay.querySelector(`#modal_menos_${p.id}`).onclick = ()=>{
      carritoProductos[p.id] = Math.max(0, (carritoProductos[p.id]||0)-1)
      overlay.querySelector(`#modal_cant_${p.id}`).textContent = carritoProductos[p.id]||0
      cuentaPanel()
    }
    overlay.querySelector(`#modal_mas_${p.id}`).onclick = ()=>{
      const actual = carritoProductos[p.id]||0
      if(p.stock!==null && actual+1>p.stock){ mostrarAlerta(`Solo quedan ${p.stock} unidades disponibles.`); return }
      carritoProductos[p.id] = actual+1
      overlay.querySelector(`#modal_cant_${p.id}`).textContent = carritoProductos[p.id]
      cuentaPanel()
    }
  }
}
function mostrarConfeti(mensaje){
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(20,20,18,0.35);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:nomFadeIn 0.15s ease'
  const colores = ['#2F4D2A','#E8833A','#8FAE6B','#F5B301']
  let piezas = ''
  for(let i=0;i<24;i++){
    const izquierda = Math.random()*100
    const demora = Math.random()*0.4
    const color = colores[i%colores.length]
    piezas += `<div style="position:absolute;top:-10px;left:${izquierda}%;width:8px;height:8px;background:${color};border-radius:2px;animation:nomCaer 1.1s ease-in ${demora}s forwards"></div>`
  }
  overlay.innerHTML = `<div style="position:relative;background:#FFFFFF;border-radius:16px;padding:26px 20px;max-width:340px;width:100%;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.18);overflow:hidden;animation:nomPop 0.18s ease">
    <div style="position:absolute;inset:0;pointer-events:none">${piezas}</div>
    <div style="position:relative">
      <div style="font-size:30px;margin-bottom:8px">🎉</div>
      <div style="font-size:15px;font-weight:700;color:#2F4D2A;line-height:1.4;margin-bottom:18px;white-space:pre-line">${mensaje}</div>
      <button id="nom_modal_ok" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">¡Genial!</button>
    </div>
  </div>`
  document.body.appendChild(overlay)
  const cerrar = ()=>{ if(overlay.parentNode) document.body.removeChild(overlay) }
  overlay.querySelector('#nom_modal_ok').onclick = cerrar
  overlay.onclick = (e)=>{ if(e.target===overlay) cerrar() }
}
function animarContadores(){
  document.querySelectorAll('[data-count-target]').forEach(el=>{
    const final = Number(el.dataset.countTarget)||0
    const esMoneda = el.dataset.countCurrency==='1'
    const duracion = 700
    const inicio = performance.now()
    const paso = (ts)=>{
      const progreso = Math.min(1, (ts-inicio)/duracion)
      const valor = Math.round(final*progreso)
      el.textContent = esMoneda ? '$'+valor.toLocaleString('es-AR') : valor.toLocaleString('es-AR')
      if(progreso<1) requestAnimationFrame(paso)
    }
    requestAnimationFrame(paso)
  })
}
function skeletonBloque(lineas){
  const n = lineas||3
  return `<div style="display:flex;flex-direction:column;gap:8px">${Array.from({length:n}).map((_,i)=>`<div class="nom-skeleton" style="height:14px;width:${i===n-1?'60%':'100%'}"></div>`).join('')}</div>`
}
const ORDEN_ZONAS = ['norte','sur','este','oeste']
const CATEGORIAS_CATALOGO = ['Aceites y vinagres','Conservas','Fideos y pastas','Condimentos y especias','Almacén general','Otros']
function detectarRestriccionHoraria(texto){
  if(!texto) return null
  const patrones = [
    /despu[ée]s\s+de\s+las?\s*\d{1,2}(:\d{2})?\s*(hs?|horas?)?/i,
    /antes\s+de\s+las?\s*\d{1,2}(:\d{2})?\s*(hs?|horas?)?/i,
    /entre\s+las?\s*\d{1,2}(:\d{2})?\s*(hs?|horas?)?\s*y\s*(las?\s*)?\d{1,2}(:\d{2})?\s*(hs?|horas?)?/i,
    /\bsolo\s+(por\s+la\s+)?(ma[ñn]ana|tarde|noche)\b/i
  ]
  for(const p of patrones){
    const m = texto.match(p)
    if(m) return m[0]
  }
  return null
}
function tieneRestriccionHoraria(order){
  if(order.time_restriction_manual===true) return true
  if(order.time_restriction_manual===false) return false
  return !!detectarRestriccionHoraria(order.important_note)
}
function textoRestriccionHoraria(order){
  if(order.time_restriction_manual===true) return order.important_note || 'Restricción marcada a mano'
  return detectarRestriccionHoraria(order.important_note) || order.important_note || ''
}
function estadoVacio(mensaje, icono){
  return `<div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;padding:28px 16px;text-align:center">
    <svg width="60" height="60" viewBox="0 0 72 72" style="margin:0 auto 10px;display:block"><circle cx="36" cy="40" r="22" fill="#EAF0DC"/><ellipse cx="36" cy="38" rx="12" ry="15" fill="#F5EFE0" stroke="#2F4D2A" stroke-width="1.5"/><circle cx="31" cy="34" r="2" fill="#2F4D2A"/><circle cx="41" cy="34" r="2" fill="#2F4D2A"/><path d="M31 43 Q36 47 41 43" stroke="#2F4D2A" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
    <div style="font-size:13px;color:#8A8570">${mensaje}</div>
  </div>`
}
if(!document.querySelector('#nom_anim_styles')){
  const styleTag = document.createElement('style')
  styleTag.id = 'nom_anim_styles'
  styleTag.textContent = `
    @keyframes nomFadeIn{from{opacity:0}to{opacity:1}}
    @keyframes nomPop{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
    @keyframes nomCaer{from{transform:translateY(0) rotate(0deg);opacity:1}to{transform:translateY(220px) rotate(220deg);opacity:0}}
    @keyframes nomPulso{0%{box-shadow:0 0 0 0 rgba(47,77,42,0.45)}70%{box-shadow:0 0 0 10px rgba(47,77,42,0)}100%{box-shadow:0 0 0 0 rgba(47,77,42,0)}}
    @keyframes nomCamina{0%,100%{transform:scaleX(-1) translateX(0)}50%{transform:scaleX(-1) translateX(-3px)}}
    @keyframes nomEntrada{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes nomShimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}
    @keyframes nomDrawCheck{from{stroke-dashoffset:24}to{stroke-dashoffset:0}}
    .acc-body{overflow:hidden;transition:max-height 0.25s ease,padding 0.25s ease}
    .acc-arrow{display:inline-block;transition:transform 0.2s ease}
    button,.btn{transition:transform 0.12s ease}
    button:active,.btn:active{transform:scale(0.96)}
    .shell{animation:nomFadeIn 0.2s ease}
    .nom-cascada{animation:nomEntrada 0.35s ease both}
    .nom-skeleton{background:linear-gradient(90deg,#F1EFE8 0%,#E8E3D5 50%,#F1EFE8 100%);background-size:400px 100%;animation:nomShimmer 1.3s ease-in-out infinite;border-radius:8px}
    .nom-moto-camina{animation:nomCamina 0.6s ease-in-out infinite}
  `
  document.head.appendChild(styleTag)
}
function descargarCSV(nombreArchivo, columnas, filas){
  const escapar = v => `"${String(v==null?'':v).replace(/"/g,'""')}"`
  const encabezado = columnas.map(c=>escapar(c.label)).join(';')
  const cuerpo = filas.map(f=> columnas.map(c=>escapar(typeof c.value==='function'?c.value(f):f[c.value])).join(';')).join('\n')
  const csv = '\uFEFF' + encabezado + '\n' + cuerpo
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = nombreArchivo
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
// El descuento es por transferencia, al banco o a la billetera: las dos le llegan
// instantáneas y sin comisión. La usan la entrega, la ruta y los avisos, así que va global.
function esPagoConDescuento(m){ return m==='transfer' || m==='mp' }

function calcularDescuentoBilletera(precio, tipo, valor){
  const v = Number(valor)||0
  if(!v) return 0
  if(tipo==='fixed') return Math.min(v, precio)
  return Math.round(precio * (v/100))
}
function horaAR(iso){
  if(!iso) return ''
  return new Date(iso).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})
}

function barraEstadoPedido(stage, orderStatus, outForDeliveryAt, enRouteAt){
  const enReparto = orderStatus==='out_for_delivery' || stage==='en_route' || stage==='llegado'
  let rango = 1
  if(stage==='preparing') rango = 2
  if(stage==='prepared') rango = 3
  if(enReparto) rango = 4
  if(stage==='en_route' || stage==='llegado') rango = 5
  if(stage==='llegado') rango = 6
  if(orderStatus==='delivered') rango = 7
  const etapas = [
    { icono:'✓', label:'Confirmado', activo: rango>=1 },
    { icono:'🥚', label:'Preparando', activo: rango>=2 },
    { icono:'📦', label:'Listo', activo: rango>=3 },
    { icono:'🚚', label:'En reparto', activo: rango>=4 },
    { icono:'<span style="display:inline-block;transform:scaleX(-1)" class="nom-moto-camina">🛵</span>', label:'Yendo', activo: rango>=5 },
    { icono:'📍', label:'Llegó', activo: rango>=6 },
    { icono:'🏠', label:'Entregado', activo: rango>=7 }
  ]
  const idxActual = Math.max(0, rango-1)
  return `<div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;padding:14px 12px;margin-bottom:10px">
    <div style="font-size:13px;font-weight:700;color:#2F4D2A;margin-bottom:12px">Estado de tu pedido</div>
    <div style="display:flex;align-items:flex-start">
      ${etapas.map((e,i)=>`<div style="flex:1;text-align:center;position:relative">
        ${i>0?`<div style="position:absolute;top:14px;left:-50%;width:100%;height:2px;background:${e.activo?'#8FAE6B':'#E3DCC8'}"></div>`:''}
        <div style="width:28px;height:28px;border-radius:50%;margin:0 auto 5px;position:relative;z-index:1;background:${e.activo?'#2F4D2A':'#F1EFE8'};display:flex;align-items:center;justify-content:center;font-size:12px${i===idxActual && rango<5?';animation:nomPulso 1.6s ease-out infinite':''}">${e.icono}</div>
        <span style="font-size:9px;color:${e.activo?'#2F4D2A':'#8A8570'}">${e.label}</span>
      </div>`).join('')}
    </div>
    ${stage==='en_route'?`<div style="margin-top:12px;background:#F5EFE0;border-radius:10px;padding:10px 12px;font-size:12px;color:#5F5E5A">💬 Tu repartidor ya está yendo hacia tu casa${enRouteAt?` (desde las ${horaAR(enRouteAt)} hs)`:''}, llega en los próximos minutos.</div>`:''}
    ${stage!=='en_route' && enReparto?`<div style="margin-top:12px;background:#F5EFE0;border-radius:10px;padding:10px 12px;font-size:12px;color:#5F5E5A">💬 Tu repartidor salió a repartir${outForDeliveryAt?` a las ${horaAR(outForDeliveryAt)} hs`:''}, tu entrega está en camino.</div>`:''}
    ${stage==='prepared'?`<div style="margin-top:12px;background:#F5EFE0;border-radius:10px;padding:10px 12px;font-size:12px;color:#5F5E5A">💬 Tu pedido ya está armado, esperando que salga a repartir.</div>`:''}
    ${stage==='preparing' && !enReparto?`<div style="margin-top:12px;background:#F5EFE0;border-radius:10px;padding:10px 12px;font-size:12px;color:#5F5E5A">💬 Estamos preparando tu pedido con huevos recién recolectados.</div>`:''}
  </div>`
}

const TIPOS_VIA_OPCIONES = [
  { value: 'calle', label: 'Calle' },
  { value: 'avenida', label: 'Avenida' },
  { value: 'pasaje', label: 'Pasaje' }
]

const PROVINCIAS = [
  'Buenos Aires','Catamarca','Chaco','Chubut','Ciudad Autónoma de Buenos Aires','Córdoba','Corrientes',
  'Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta',
  'San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego, Antártida e Islas del Atlántico Sur','Tucumán'
]

async function cargarLocalidadesEdit(provincia, citySel){
  const grp = document.querySelector('#ed_city_wrap')
  if(!grp) return
  grp.innerHTML = `<label>Localidad</label><select id="ed_city" disabled><option>Cargando localidades…</option></select>`
  try{
    const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(provincia)}&campos=nombre&max=5000`
    const controller = new AbortController()
    const timeoutId = setTimeout(()=>controller.abort(), 8000)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    const data = await res.json()
    const nombres = [...new Set((data.localidades||[]).map(l=>l.nombre))].sort((a,b)=>a.localeCompare(b,'es'))
    if(!nombres.length) throw new Error('sin resultados')
    grp.innerHTML = `<label>Localidad</label><select id="ed_city">
      <option value="">Seleccioná tu localidad</option>
      ${nombres.map(n=>`<option value="${n}" ${citySel===n?'selected':''}>${n}</option>`).join('')}
    </select>`
    document.querySelector('#ed_city').onchange = (e)=>{ citySelValue = e.target.value }
  }catch(e){
    grp.innerHTML = `<label>Localidad</label><select id="ed_city" disabled><option value="">No se pudo cargar</option></select><button type="button" class="btn ghost" id="btn_reintentar_ed_city" style="margin-top:6px;padding:6px 12px;font-size:12px">🔄 Reintentar</button>`
    const btn = document.querySelector('#btn_reintentar_ed_city')
    if(btn) btn.onclick = ()=>cargarLocalidadesEdit(provincia, citySel)
  }
}
let citySelValue = ''

function editarDatosForm(c){
  const volver = panelVolver || cuentaPanel
  let zonaSel = c.zone || ''
  let viaSel = c.street_type || 'calle'
  citySelValue = c.city || ''
  const box = document.querySelector('#card_datos')
  box.innerHTML = `<h3>Editar mis datos</h3>
    <div class="field"><label>DNI</label><input id="ed_dni" value="${c.dni||''}"/></div>
    <div class="field"><label>Teléfono</label><input id="ed_phone" value="${c.phone||''}"/></div>
    <div class="field"><label>Email</label><input id="ed_email" value="${c.email||''}"/></div>
    <div class="field"><label>Tipo de vía</label><div class="grid three" id="ed_via_group">${TIPOS_VIA_OPCIONES.map(t=>`<button type="button" class="btn ${viaSel===t.value?'primary':'ghost'}" data-via="${t.value}">${t.label}</button>`).join('')}</div></div>
    <div class="field"><label>Nombre de la calle</label><input id="ed_street" value="${c.street||''}" placeholder="Ej: Larrea (sin el número)"/></div>
    <div id="aviso_numero_ed"></div>
    <div class="field"><label>Número</label><input id="ed_street_number" value="${c.street_number||''}"/></div>
    <div class="field"><label>Barrio</label><input id="ed_neighborhood" value="${c.neighborhood||''}"/></div>
    <div class="field"><label>Código postal</label><input id="ed_postal_code" value="${c.postal_code||''}"/></div>
    <div class="field"><label>Provincia</label><select id="ed_province">
      <option value="">Seleccioná tu provincia</option>
      ${PROVINCIAS.map(p=>`<option value="${p}" ${c.province===p?'selected':''}>${p}</option>`).join('')}
    </select></div>
    <div class="field" id="ed_city_wrap"><label>Localidad</label><select id="ed_city" ${!c.province?'disabled':''}>
      <option value="">${c.province?'Elegí la provincia de nuevo para cargar localidades':'Elegí primero la provincia'}</option>
    </select></div>
    <div class="field"><label>Zona</label><div class="grid two" id="ed_zone_group">${ZONAS.map(z=>`<button type="button" class="btn ${zonaSel===z.value?'primary':'ghost'}" data-zone="${z.value}">${z.label}</button>`).join('')}</div></div>
    <div id="err_edit" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_guardar_datos">Guardar cambios</button>
    <button class="btn ghost" id="btn_cancelar_edit" style="margin-left:8px">Cancelar</button>`
  document.querySelectorAll('#ed_zone_group [data-zone]').forEach(b=> b.onclick = ()=>{
    zonaSel = b.dataset.zone
    document.querySelectorAll('#ed_zone_group [data-zone]').forEach(x=> x.className = 'btn ' + (x.dataset.zone===zonaSel?'primary':'ghost'))
  })
  document.querySelectorAll('#ed_via_group [data-via]').forEach(b=> b.onclick = ()=>{
    viaSel = b.dataset.via
    document.querySelectorAll('#ed_via_group [data-via]').forEach(x=> x.className = 'btn ' + (x.dataset.via===viaSel?'primary':'ghost'))
  })
  attachAvisoNumeroEnCalle('ed_street','ed_street_number','aviso_numero_ed')
  document.querySelector('#ed_province').onchange = (e)=>{
    citySelValue = ''
    if(e.target.value) cargarLocalidadesEdit(e.target.value, '')
  }
  if(c.province) cargarLocalidadesEdit(c.province, c.city || '')
  document.querySelector('#btn_cancelar_edit').onclick = ()=>volver()
  document.querySelector('#btn_guardar_datos').onclick = async ()=>{
    const errBox = document.querySelector('#err_edit')
    const nuevoDni = document.querySelector('#ed_dni').value.trim()
    const payload = {
      p_dni: c.dni,
      p_customer_id: c.id,
      p_new_dni: nuevoDni && nuevoDni !== c.dni ? nuevoDni : null,
      p_phone: document.querySelector('#ed_phone').value.trim(),
      p_email: document.querySelector('#ed_email').value.trim(),
      p_street: document.querySelector('#ed_street').value.trim(),
      p_street_number: document.querySelector('#ed_street_number').value.trim(),
      p_neighborhood: document.querySelector('#ed_neighborhood').value.trim(),
      p_zone: zonaSel,
      p_street_type: viaSel,
      p_city: citySelValue || c.city || '',
      p_province: document.querySelector('#ed_province').value,
      p_country: 'Argentina',
      p_postal_code: document.querySelector('#ed_postal_code').value.trim()
    }
    const { data, error } = await supabase.rpc('customer_update', payload)
    if(error || !data?.ok){ errBox.textContent = data?.error || 'No pudimos guardar los cambios. Probá de nuevo.'; errBox.style.display='block'; return }
    Object.assign(c, { dni: payload.p_new_dni||c.dni, phone: payload.p_phone||c.phone, email: payload.p_email||c.email, street: payload.p_street||c.street, street_number: payload.p_street_number||c.street_number, neighborhood: payload.p_neighborhood||c.neighborhood, zone: payload.p_zone||c.zone, street_type: payload.p_street_type||c.street_type, city: payload.p_city||c.city, province: payload.p_province||c.province, country: payload.p_country||c.country, postal_code: payload.p_postal_code||c.postal_code })
    volver()
  }
}

let GRADOS_HUEVO = []
let GRADO_LABEL = {}
let GRADO_PESO = {}
let GRADO_ORDEN = {}

async function cargarClasificaciones(soloActivas = true){
  const { data } = await supabase.rpc('clasificaciones_huevo', { p_solo_activas: soloActivas })
  const lista = Array.isArray(data) ? data : []
  GRADOS_HUEVO = lista.map(g=>({ id:g.id, value:g.codigo, label:g.nombre, peso:g.peso, orden:g.orden, active:g.active }))
  GRADO_LABEL = {}; GRADO_PESO = {}; GRADO_ORDEN = {}
  lista.forEach(g=>{ GRADO_LABEL[g.codigo]=g.nombre; GRADO_PESO[g.codigo]=g.peso||''; GRADO_ORDEN[g.codigo]=g.orden })
  return GRADOS_HUEVO
}

function ordenarPorGrado(planes){
  return [...(planes||[])].sort((a,b)=>{
    const ia = GRADO_ORDEN[a.grade] ?? 99, ib = GRADO_ORDEN[b.grade] ?? 99
    return ia - ib
  })
}

const ROLES_STAFF = [
  { value: 'admin', label: 'Administrador' },
  { value: 'campo', label: 'Personal de campo' },
  { value: 'repartidor', label: 'Repartidor' },
  { value: 'preparador', label: 'Preparador de pedidos' },
  { value: 'telefonico', label: 'Personal telefónico' },
  { value: 'vendedor', label: 'Vendedor' }
]
let staffEditandoRoles = null // user_id de la persona cuyos roles se están editando

function staffLogin(){
  layout(`<h2>Acceso del equipo</h2><div class="card">
    <p class="muted" style="margin-bottom:12px">Con tu código entrás a todas las secciones que tengas habilitadas.</p>
    <div class="field"><label>Código de acceso</label><input id="staff_code" autocomplete="off" placeholder="Ej: A3K9T2XZ" style="text-transform:uppercase"/></div>
    <div id="err_staff" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_staff_login" style="width:100%">Ingresar</button>
  </div>`)
  document.querySelector('#btn_staff_login').onclick = async ()=>{
    const code = document.querySelector('#staff_code').value.trim().toUpperCase()
    const box = document.querySelector('#err_staff')
    if(!code){ box.textContent='Ingresá tu código de acceso.'; box.style.display='block'; return }
    const email = `staff-${code.toLowerCase()}@nomades.internal`
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: code })
    if(error){
      // Un solo mensaje para todo mandaba a buscar el problema al lado equivocado.
      // El 500 del servidor y un código mal escrito no se arreglan igual.
      const st = error.status || 0
      const msg = (error.message||'').toLowerCase()
      if(st >= 500 || msg.includes('unexpected')){
        box.innerHTML = 'Hubo un problema del servidor, no es tu código.<br><small>Probá de nuevo en un minuto. Si sigue, avisale a administración.</small>'
      } else if(msg.includes('rate') || st === 429){
        box.innerHTML = 'Demasiados intentos seguidos.<br><small>Esperá un minuto y volvé a probar.</small>'
      } else if(msg.includes('network') || msg.includes('fetch')){
        box.innerHTML = 'No hay conexión.<br><small>Revisá los datos o el wifi y probá de nuevo.</small>'
      } else {
        box.innerHTML = 'Ese código no existe o fue dado de baja.<br><small>Fijate que esté bien escrito. Si te lo cambiaron, pedí el nuevo a administración.</small>'
      }
      box.style.display='block'
      return
    }
    const { data: roleRow, error: rolError } = await supabase.from('staff_roles').select('*').eq('user_id', data.user.id).single()
    if(rolError || !roleRow){
      box.innerHTML = 'Tu código es válido pero no tiene ningún rol asignado.<br><small>Pedile a administración que te habilite las secciones.</small>'
      box.style.display='block'; await supabase.auth.signOut(); return
    }
    session = data.session
    myRole = roleRow.role
    myRoles = (Array.isArray(roleRow.roles) && roleRow.roles.length) ? roleRow.roles : (roleRow.role ? [roleRow.role] : [])
    staffProfile = roleRow
    current = roleRow.profile_completed ? pantallaInicialSegunRoles() : 'staff-profile-setup'
    render()
  }
}

const PROVINCIAS_STAFF = [
  'Buenos Aires','Catamarca','Chaco','Chubut','Ciudad Autónoma de Buenos Aires','Córdoba','Corrientes',
  'Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta',
  'San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego, Antártida e Islas del Atlántico Sur','Tucumán'
]
let staffCitySelValue = ''

async function cargarLocalidadesStaff(provincia, citySel){
  const grp = document.querySelector('#sf_city_wrap')
  if(!grp) return
  grp.innerHTML = `<label>Localidad *</label><select id="sf_city" disabled><option>Cargando localidades…</option></select>`
  try{
    const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(provincia)}&campos=nombre&max=5000`
    const controller = new AbortController()
    const timeoutId = setTimeout(()=>controller.abort(), 8000)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    const data = await res.json()
    const nombres = [...new Set((data.localidades||[]).map(l=>l.nombre))].sort((a,b)=>a.localeCompare(b,'es'))
    if(!nombres.length) throw new Error('sin resultados')
    grp.innerHTML = `<label>Localidad *</label><select id="sf_city">
      <option value="">Seleccioná tu localidad</option>
      ${nombres.map(n=>`<option value="${n}" ${citySel===n?'selected':''}>${n}</option>`).join('')}
    </select>`
    document.querySelector('#sf_city').onchange = (e)=>{ staffCitySelValue = e.target.value }
  }catch(e){
    grp.innerHTML = `<label>Localidad *</label><select id="sf_city" disabled><option value="">No se pudo cargar</option></select><button type="button" class="btn ghost" id="btn_reintentar_sf_city" style="margin-top:6px;padding:6px 12px;font-size:12px">🔄 Reintentar</button>`
    const btn = document.querySelector('#btn_reintentar_sf_city')
    if(btn) btn.onclick = ()=>cargarLocalidadesStaff(provincia, citySel)
  }
}

function staffProfileForm(isSetup){
  const p = staffProfile || {}
  staffCitySelValue = p.city || ''
  const titulo = isSetup ? '👋 Completá tus datos' : '👤 Mi perfil'
  const intro = isSetup ? '<p class="muted">Antes de empezar, completá tus datos de contacto y subí una foto.</p>' : ''
  layout(`<h2>${titulo}</h2><div class="card">
    ${intro}
    <div style="text-align:center;margin-bottom:14px">
      <img id="sf_photo_preview" src="${p.photo_url||''}" style="width:96px;height:96px;border-radius:50%;object-fit:cover;background:#eee;display:${p.photo_url?'inline-block':'none'}"/>
      <div class="field"><label>Foto de perfil</label><input type="file" id="sf_photo" accept="image/*"/></div>
    </div>
    <div class="field"><label>Nombre completo *</label><input id="sf_full_name" value="${p.full_name||''}"/></div>
    <div class="field"><label>Teléfono *</label><input id="sf_phone" inputmode="tel" value="${p.phone||''}"/></div>
    <div class="field"><label>Teléfono secundario (familiar)</label><input id="sf_secondary_phone" inputmode="tel" value="${p.secondary_phone||''}"/></div>
    <div class="field"><label>Email</label><input id="sf_email" type="email" value="${p.email||''}"/></div>
    <div class="field"><label>Calle</label><input id="sf_street" value="${p.street||''}"/></div>
    <div class="field"><label>Número</label><input id="sf_street_number" value="${p.street_number||''}"/></div>
    <div class="field"><label>Provincia *</label><select id="sf_province">
      <option value="">Seleccioná tu provincia</option>
      ${PROVINCIAS_STAFF.map(pr=>`<option value="${pr}" ${p.province===pr?'selected':''}>${pr}</option>`).join('')}
    </select></div>
    <div class="field" id="sf_city_wrap"><label>Localidad *</label><select id="sf_city" ${!p.province?'disabled':''}>
      <option value="">${p.province?'Elegí la provincia de nuevo para cargar localidades':'Elegí primero la provincia'}</option>
    </select></div>
    <div class="field"><label>Código postal</label><input id="sf_postal_code" value="${p.postal_code||''}"/></div>
    <div id="err_sf" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_guardar_perfil">Guardar</button>
    ${!isSetup?`<button class="btn ghost" id="btn_cancelar_perfil" style="margin-left:8px">Cancelar</button>`:''}
  </div>`)
  if(p.province) cargarLocalidadesStaff(p.province, p.city||'')
  document.querySelector('#sf_province').onchange = (e)=>{
    staffCitySelValue=''
    if(e.target.value) cargarLocalidadesStaff(e.target.value,'')
  }
  let photoFile = null
  document.querySelector('#sf_photo').onchange = (e)=>{
    photoFile = e.target.files[0] || null
    if(photoFile){
      const reader = new FileReader()
      reader.onload = ()=>{ const img=document.querySelector('#sf_photo_preview'); img.src=reader.result; img.style.display='inline-block' }
      reader.readAsDataURL(photoFile)
    }
  }
  if(!isSetup) document.querySelector('#btn_cancelar_perfil').onclick = ()=>{ current = myRole==='campo'?'campo':myRole==='repartidor'?'repartidor':myRole==='preparador'?'preparador':myRole==='vendedor'?'vendedor':'admin'; render() }
  document.querySelector('#btn_guardar_perfil').onclick = async ()=>{
    const errBox = document.querySelector('#err_sf')
    const full_name = document.querySelector('#sf_full_name').value.trim()
    const phone = document.querySelector('#sf_phone').value.trim()
    if(!full_name || !phone || !document.querySelector('#sf_province').value || !staffCitySelValue){
      errBox.textContent = 'Completá al menos nombre, teléfono, provincia y localidad.'; errBox.style.display='block'; return
    }
    let photo_url = p.photo_url || ''
    if(photoFile){
      const path = `${session.user.id}/photo_${Date.now()}.${(photoFile.name.split('.').pop()||'jpg')}`
      const { error: upErr } = await supabase.storage.from('staff-photos').upload(path, photoFile, { upsert:true })
      if(upErr){ errBox.textContent = 'No se pudo subir la foto: '+upErr.message; errBox.style.display='block'; return }
      const { data: pub } = supabase.storage.from('staff-photos').getPublicUrl(path)
      photo_url = pub.publicUrl
    }
    const payload = {
      p_full_name: full_name,
      p_phone: phone,
      p_secondary_phone: document.querySelector('#sf_secondary_phone').value.trim(),
      p_email: document.querySelector('#sf_email').value.trim(),
      p_street: document.querySelector('#sf_street').value.trim(),
      p_street_number: document.querySelector('#sf_street_number').value.trim(),
      p_city: staffCitySelValue,
      p_province: document.querySelector('#sf_province').value,
      p_postal_code: document.querySelector('#sf_postal_code').value.trim(),
      p_photo_url: photo_url
    }
    const { data, error } = await supabase.rpc('staff_update_profile', payload)
    if(error || !data?.ok){ errBox.textContent='No pudimos guardar. Probá de nuevo.'; errBox.style.display='block'; return }
    staffProfile = { ...p, full_name: payload.p_full_name, phone: payload.p_phone, secondary_phone: payload.p_secondary_phone, email: payload.p_email, street: payload.p_street, street_number: payload.p_street_number, city: payload.p_city, province: payload.p_province, postal_code: payload.p_postal_code, photo_url, profile_completed:true }
    current = myRole==='campo'?'campo':myRole==='repartidor'?'repartidor':myRole==='preparador'?'preparador':myRole==='vendedor'?'vendedor':'admin'
    render()
  }
}

async function miVehiculo(){
  const { data: vehiculo } = await supabase.from('vehicles').select('id,type,brand,model,plate,photo_url,current_km,service_interval_km,last_service_km,vtv_expiry,insurance_expiry,mechanic_name,mechanic_phone,mechanic_appointment_phone,mechanic_address,mechanic_hours,mechanic_email,mechanic_tax_id').eq('assigned_to', session.user.id).eq('active', true).maybeSingle()
  if(!vehiculo){
    layout(`<h2>🏍️ Mi vehículo</h2><div class="card"><p class="muted">Todavía no tenés un vehículo asignado. Hablá con administración.</p></div>`)
    return
  }
  const faltan = (vehiculo.last_service_km + vehiculo.service_interval_km) - vehiculo.current_km
  const { data: historialRaw } = await supabase.from('vehicle_fuel_logs').select('id,km,amount,liters,receipt_url,created_at').eq('vehicle_id', vehiculo.id).order('created_at',{ascending:false}).limit(10)
  const historial = historialRaw || []
  const { data: serviceHistRaw } = await supabase.from('vehicle_services').select('id,service_date,km,description,parts_used,cost,payment_method,paid_by,payment_status,responsible_id').eq('vehicle_id', vehiculo.id).order('service_date',{ascending:false}).limit(15)
  const serviceHist = serviceHistRaw || []
  const { data: staffRaw } = await supabase.from('staff_roles').select('user_id,full_name,role,roles').or('role.in.(repartidor,admin),roles.cs.{repartidor}')
  const staffList = staffRaw || []
  const staffMap = Object.fromEntries(staffList.map(s=>[s.user_id,s.full_name]))

  const tieneMecanico = vehiculo.mechanic_name || vehiculo.mechanic_address
  layout(`<h2>${vehiculo.type==='moto'?'🏍️':'🚚'} Mi vehículo</h2>
  <div class="card">
    ${vehiculo.photo_url?`<img src="${vehiculo.photo_url}" style="width:100%;border-radius:12px;margin-bottom:10px"/>`:''}
    <h3>${vehiculo.brand||''} ${vehiculo.model||''}</h3>
    <p>Patente: <b>${vehiculo.plate}</b></p>
    <p>Kilómetros actuales: <b>${Math.round(vehiculo.current_km)} km</b></p>
    <p>${faltan<=500?'⚠️ ':''}Próximo service en: <b>${Math.max(0,Math.round(faltan))} km</b></p>
    ${vehiculo.vtv_expiry?`<p>VTV vence: ${vehiculo.vtv_expiry}</p>`:''}
    ${vehiculo.insurance_expiry?`<p>Seguro vence: ${vehiculo.insurance_expiry}</p>`:''}
  </div>
  <div class="card">
    <h3>🔧 Mecánico de confianza</h3>
    ${tieneMecanico?`
      <p><b>${vehiculo.mechanic_name||'-'}</b></p>
      <p>📞 ${vehiculo.mechanic_phone||'-'}${vehiculo.mechanic_appointment_phone?` · Turnos: ${vehiculo.mechanic_appointment_phone}`:''}</p>
      <p>📍 ${vehiculo.mechanic_address||'-'}</p>
      ${vehiculo.mechanic_hours?`<p>🕒 ${vehiculo.mechanic_hours}</p>`:''}
      ${vehiculo.mechanic_email?`<p>✉️ ${vehiculo.mechanic_email}</p>`:''}
      ${vehiculo.mechanic_tax_id?`<p>CUIT/DNI: ${vehiculo.mechanic_tax_id}</p>`:''}
      ${vehiculo.mechanic_address?`<button class="btn ghost" id="btn_navegar_mecanico" style="width:100%;margin-top:6px">🧭 Navegar hasta el mecánico</button>`:''}
    `:'<p class="muted">Todavía no cargaste los datos del mecánico. Pedile a administración que los cargue.</p>'}
  </div>
  <div class="card">
    <h3>🛠️ Registrar service / mantenimiento</h3>
    <div class="grid two">
      <div class="field"><label>Fecha</label><input id="serv_fecha" type="date" value="${new Date().toISOString().slice(0,10)}"/></div>
      <div class="field"><label>Km actuales</label><input id="serv_km" type="number" value="${Math.round(vehiculo.current_km)}"/></div>
    </div>
    <div class="field"><label>¿Qué se le hizo?</label><textarea id="serv_desc" rows="2" placeholder="Ej: cambio de aceite y filtro"></textarea></div>
    <div class="field"><label>Repuestos / marcas usadas</label><input id="serv_partes" placeholder="Ej: aceite Motul, filtro Fram"/></div>
    <div class="grid two">
      <div class="field"><label>Costo</label><input id="serv_costo" type="number" min="0"/></div>
      <div class="field"><label>Método de pago</label><select id="serv_metodo"><option value="cash">Efectivo</option><option value="transfer">Transferencia</option><option value="mp">Mercado Pago</option></select></div>
    </div>
    <div class="field"><label>¿Quién lo llevó al mecánico?</label><select id="serv_responsable">${staffList.map(s=>`<option value="${s.user_id}" ${s.user_id===session.user.id?'selected':''}>${s.full_name}</option>`).join('')}</select></div>
    <div class="field"><label>¿Quién paga?</label>
      <div class="grid two">
        <button type="button" class="btn ghost" id="btn_paga_yo" data-paid-by="driver">Ya lo pagué yo</button>
        <button type="button" class="btn ghost" id="btn_paga_admin" data-paid-by="admin">Se paga desde administración</button>
      </div>
    </div>
    <div id="err_service" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_guardar_service" style="width:100%">Guardar service</button>
  </div>
  <div class="card"><h3>Historial de service</h3>${serviceHist.length?serviceHist.map(s=>{
    const fecha = new Date(s.service_date+'T00:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'})
    return `<div class="row"><span>${fecha} · ${Math.round(s.km||0)} km<br><small>${s.description||''}</small>${s.parts_used?`<br><small>🔩 ${s.parts_used}</small>`:''}<br><small>Responsable: ${staffMap[s.responsible_id]||'-'}</small></span><span>${s.cost?`$${Number(s.cost).toLocaleString('es-AR')}`:''}<br>${s.paid_by==='admin'?(s.payment_status==='pending'?'<span class="badge" style="background:#b3841f">🕒 Pendiente admin</span>':'<span class="badge">✅ Pagado (admin)</span>'):'<span class="badge">Pagué yo</span>'}</span></div>`
  }).join(''):'<p class="muted">Todavía no hay service registrados.</p>'}</div>
  <div class="card"><h3>Últimas cargas de combustible</h3>${historial.length?historial.map(h=>{
    const fecha = new Date(h.created_at).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'})
    return `<div class="row"><span>${fecha}<br><small>${Math.round(h.km)} km${h.liters?` · ${h.liters} L`:''}</small></span><span>${h.amount?`$${Number(h.amount).toLocaleString('es-AR')}`:''}${h.receipt_url?` <a href="${h.receipt_url}" target="_blank" style="font-size:12px">Ver ticket</a>`:''}</span></div>`
  }).join(''):'<p class="muted">Todavía no cargaste combustible.</p>'}</div>
  <div class="card">
    <h3>⛽ Cargar combustible</h3>
    <div class="field"><label>Kilómetros del odómetro *</label><input id="fuel_km" type="number" min="${vehiculo.current_km}" placeholder="Ej: ${Math.round(vehiculo.current_km)+50}"/></div>
    <div class="grid two">
      <div class="field"><label>Monto pagado</label><input id="fuel_monto" type="number" min="0"/></div>
      <div class="field"><label>Litros (opcional)</label><input id="fuel_litros" type="number" min="0" step="0.1"/></div>
    </div>
    <div class="field"><label>Foto del ticket *</label><input type="file" id="fuel_ticket" accept="image/*"/></div>
    <div id="err_fuel" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_cargar_combustible" style="width:100%">Guardar carga</button>
  </div>`)

  if(vehiculo.mechanic_address){
    document.querySelector('#btn_navegar_mecanico').onclick = ()=>{
      window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(vehiculo.mechanic_address),'_blank')
    }
  }

  let paidBySel = 'driver'
  const pintarPaidBy = ()=>{
    document.querySelector('#btn_paga_yo').className = 'btn '+(paidBySel==='driver'?'primary':'ghost')
    document.querySelector('#btn_paga_admin').className = 'btn '+(paidBySel==='admin'?'primary':'ghost')
  }
  document.querySelector('#btn_paga_yo').onclick = ()=>{ paidBySel='driver'; pintarPaidBy() }
  document.querySelector('#btn_paga_admin').onclick = ()=>{ paidBySel='admin'; pintarPaidBy() }
  pintarPaidBy()

  document.querySelector('#btn_guardar_service').onclick = async ()=>{
    const box = document.querySelector('#err_service')
    const desc = document.querySelector('#serv_desc').value.trim()
    if(!desc){ box.textContent='Contá qué se le hizo al vehículo.'; box.style.display='block'; return }
    const payload = {
      vehicle_id: vehiculo.id,
      service_date: document.querySelector('#serv_fecha').value,
      km: Number(document.querySelector('#serv_km').value) || null,
      description: desc,
      parts_used: document.querySelector('#serv_partes').value.trim() || null,
      cost: Number(document.querySelector('#serv_costo').value) || null,
      payment_method: document.querySelector('#serv_metodo').value,
      paid_by: paidBySel,
      payment_status: paidBySel==='admin' ? 'pending' : 'paid',
      responsible_id: document.querySelector('#serv_responsable').value,
      created_by: session.user.id
    }
    const { error } = await supabase.from('vehicle_services').insert(payload)
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    mostrarAlerta('Service guardado ✅')
    render()
  }

  document.querySelector('#btn_cargar_combustible').onclick = async ()=>{
    const box = document.querySelector('#err_fuel')
    const km = Number(document.querySelector('#fuel_km').value)
    const monto = Number(document.querySelector('#fuel_monto').value) || null
    const litros = Number(document.querySelector('#fuel_litros').value) || null
    const ticketFile = document.querySelector('#fuel_ticket').files[0]
    if(!km || km<=0){ box.textContent='Ingresá los kilómetros del odómetro.'; box.style.display='block'; return }
    if(!ticketFile){ box.textContent='Subí la foto del ticket.'; box.style.display='block'; return }
    const path = `${vehiculo.id}/${Date.now()}_${ticketFile.name}`
    const { error: upErr } = await supabase.storage.from('fuel-receipts').upload(path, ticketFile)
    if(upErr){ box.textContent='No se pudo subir el ticket: '+upErr.message; box.style.display='block'; return }
    const { data: pub } = supabase.storage.from('fuel-receipts').getPublicUrl(path)
    const { data, error } = await supabase.rpc('driver_log_fuel', { p_vehicle_id: vehiculo.id, p_km: km, p_amount: monto, p_liters: litros, p_receipt_url: pub.publicUrl })
    if(error || !data?.ok){ box.textContent = data?.error || 'No se pudo guardar la carga.'; box.style.display='block'; return }
    if(data.alerta_service) mostrarAlerta(`⛽ Carga guardada ✅\n\n⚠️ Atención: faltan ${Math.round(data.faltan_km)} km para el próximo service.`)
    else mostrarAlerta('⛽ Carga guardada ✅')
    render()
  }
}


function mayoristaLogin(){
  layout(`<h2>Entrá a tu cuenta</h2>
  <div class="card">
    <p class="muted" style="margin:0 0 14px">Ingresá con el CUIT o DNI con el que te registraste.</p>
    <div class="field"><label>CUIT o DNI</label><input id="may_login_dni" inputmode="numeric" placeholder="Sin puntos ni guiones"/></div>
    <div id="err_may_login" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_may_entrar" style="width:100%">Entrar</button>
    <button class="btn ghost" id="btn_may_volver_landing" style="width:100%;margin-top:8px">← Volver</button>
    <p class="muted" style="margin-top:14px;font-size:12.5px;text-align:center">¿Todavía no tenés cuenta? <a href="#" id="link_crear_may" style="color:${NOM.verde}">Creala acá</a></p>
  </div>`)

  const entrar = async ()=>{
    const dni = document.querySelector('#may_login_dni').value.trim()
    const box = document.querySelector('#err_may_login')
    if(!/^(\d{7,8}|\d{11})$/.test(dni)){
      box.textContent = 'Ingresá tu CUIT (11 números) o DNI (7 u 8), sin puntos ni guiones.'
      box.style.display='block'; return
    }
    const btn = document.querySelector('#btn_may_entrar')
    btn.disabled = true; btn.textContent = 'Entrando…'
    const { data, error } = await supabase.rpc('customer_login', { p_dni: dni })
    btn.disabled = false; btn.textContent = 'Entrar'
    if(error || !data?.found){
      box.textContent = 'No encontramos ese CUIT o DNI. Si sos nuevo, creá tu cuenta abajo.'
      box.style.display='block'; return
    }
    if(data.customer.customer_type !== 'mayorista'){
      box.textContent = 'Esa cuenta no está registrada como mayorista. Si te parece un error, escribinos.'
      box.style.display='block'; return
    }
    cuenta = data
    mayoristaVista = 'tienda'
    current = 'mayorista-panel'
    render()
  }

  document.querySelector('#btn_may_entrar').onclick = entrar
  document.querySelector('#may_login_dni').onkeydown = (e)=>{ if(e.key==='Enter') entrar() }
  document.querySelector('#btn_may_volver_landing').onclick = ()=>{ current='mayorista-landing'; render() }
  document.querySelector('#link_crear_may').onclick = (e)=>{ e.preventDefault(); current='mayorista-signup'; render() }
}

async function mayoristaLanding(){
  layout(`<h2>Para comercios</h2><div class="card">${skeletonBloque(4)}</div>`)
  const [{ data: planesRaw }, { data: catalogoRaw }] = await Promise.all([
    supabase.from('plan_prices').select('id,egg_quantity,price,grade,unidad').eq('active', true).eq('customer_type','mayorista').order('egg_quantity'),
    supabase.rpc('mayorista_catalogo', {})
  ])
  const planes = ordenarPorGrado(planesRaw)
  const catalogo = catalogoRaw || []
  const iconoCat = (cat)=>{
    const c2 = (cat||'').toLowerCase()
    if(c2.includes('aceite')||c2.includes('vinagre')) return 'botella'
    if(c2.includes('conserva')||c2.includes('lata')) return 'carrito'
    if(c2.includes('fideo')||c2.includes('pasta')) return 'huevo'
    return 'carrito'
  }
  const categorias = {}
  catalogo.forEach(p=>{ const k = p.category || 'Almacén'; categorias[k] ??= 0; categorias[k]++ })
  const nombresCat = Object.keys(categorias).sort()

  layout(`<div style="background:${NOM.verde};border-radius:18px;padding:22px 18px;margin-bottom:12px">
    <div style="color:${NOM.verdePastel};font-size:10.5px;letter-spacing:1.8px;text-transform:uppercase">Para comercios</div>
    <h1 style="color:#F5EFE0;font-size:25px;font-weight:500;line-height:1.2;margin:11px 0 0">Tu proveedor de todos los días</h1>
    <p style="color:#C9D8B0;font-size:13.5px;line-height:1.55;margin:12px 0 0">Empezamos criando gallinas. Hoy además te llevamos aceites, conservas, pastas y todo lo que se vende siempre. Un solo proveedor, un solo pedido, un solo viaje.</p>
    <div style="display:flex;gap:20px;margin-top:18px;padding-top:16px;border-top:1px solid rgba(247,244,236,0.18)">
      <div>
        <div style="font-size:20px;font-weight:500;color:#F5EFE0;font-variant-numeric:tabular-nums">1</div>
        <div style="font-size:10.5px;color:${NOM.verdePastel};line-height:1.35;margin-top:2px">solo pedido<br>para todo</div>
      </div>
      <div>
        <div style="font-size:20px;font-weight:500;color:#F5EFE0">$0</div>
        <div style="font-size:10.5px;color:${NOM.verdePastel};line-height:1.35;margin-top:2px">envío desde<br>$80.000</div>
      </div>
      <div>
        <div style="font-size:20px;font-weight:500;color:#F5EFE0;font-variant-numeric:tabular-nums">30</div>
        <div style="font-size:10.5px;color:${NOM.verdePastel};line-height:1.35;margin-top:2px">días de cuenta<br>corriente</div>
      </div>
    </div>
  </div>

  <h2 style="font-size:18px;margin:0 0 11px">Qué te llevamos</h2>
  <div class="grid two" style="margin-bottom:9px">
    <div style="background:${NOM.superficie};border:1px solid ${NOM.borde};border-radius:14px;overflow:hidden">
      <div style="height:70px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center">${ico('huevo',24,NOM.verde)}</div>
      <div style="padding:11px">
        <div style="font-size:13px;font-weight:500;color:${NOM.tinta}">Huevos</div>
        <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px;line-height:1.35">De nuestra granja, por tamaño</div>
      </div>
    </div>
    ${nombresCat.map(cat=>`<div style="background:${NOM.superficie};border:1px solid ${NOM.borde};border-radius:14px;overflow:hidden">
      <div style="height:70px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center">${ico(iconoCat(cat),24,NOM.verde)}</div>
      <div style="padding:11px">
        <div style="font-size:13px;font-weight:500;color:${NOM.tinta};line-height:1.3">${cat}</div>
        <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px">${categorias[cat]} producto(s)</div>
      </div>
    </div>`).join('')}
    <div style="background:${NOM.superficie};border:1px dashed #C9C4B4;border-radius:14px;overflow:hidden;opacity:0.72">
      <div style="height:70px;background:#F1EFE8;display:flex;align-items:center;justify-content:center">${ico('carrito',24,'#A8A89E')}</div>
      <div style="padding:11px">
        <div style="font-size:13px;font-weight:500;color:${NOM.tintaSuave};line-height:1.3">Carne al vacío</div>
        <div style="font-size:11px;color:#A8A89E;margin-top:2px">Próximamente</div>
      </div>
    </div>
  </div>

  <div style="background:${NOM.superficie};border:1px dashed #C9C4B4;border-radius:14px;padding:13px;margin-bottom:18px;display:flex;gap:11px;align-items:center">
    <div style="width:38px;height:38px;border-radius:11px;background:#F1EFE8;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico('mas',18,'#8A8570')}</div>
    <div>
      <div style="font-size:13px;font-weight:500;color:${NOM.tinta}">Y seguimos sumando</div>
      <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px;line-height:1.4">Limpieza, condimentos y más. Si necesitás algo que no está, pedilo.</div>
    </div>
  </div>

  <h2 style="font-size:18px;margin:0 0 11px">Por qué te conviene</h2>
  <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px">
    ${[['carrito','Un solo pedido, un solo viaje','Dejás de coordinar con cuatro proveedores distintos. Todo junto y en el mismo camión.'],
       ['reloj','Llegamos cuando recibís','Nos decís tu horario y lo respetamos. Nada de golpear a las once cuando abrís a las siete.'],
       ['check','Contás antes de firmar','Revisás desde tu teléfono y das conformidad. Si faltó algo, lo descontamos ahí mismo.'],
       ['camion','Repetís con un toque','La app se acuerda de tu último pedido. Lo cargás, ajustás lo que cambió, y listo.']].map(([ic,t,d])=>`
      <div style="background:${NOM.superficie};border:1px solid ${NOM.borde};border-radius:13px;padding:13px;display:flex;gap:12px;align-items:flex-start">
        <div style="width:36px;height:36px;border-radius:11px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico(ic,17,NOM.verde)}</div>
        <div>
          <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">${t}</div>
          <div style="font-size:12px;color:${NOM.tintaSuave};margin-top:3px;line-height:1.45">${d}</div>
        </div>
      </div>`).join('')}
  </div>

  ${planes.length?`<div class="card"><h3>Nuestros huevos</h3>
    ${planes.map(p=>{
      const etiqueta = p.grade ? (GRADO_LABEL[p.grade]||p.grade) : `${p.egg_quantity} huevos`
      const porHuevo = p.egg_quantity ? Math.round(Number(p.price)/p.egg_quantity) : 0
      return `<div class="row"><span>${etiqueta}<br><small class="muted">maple de ${p.egg_quantity}${porHuevo?` · $${porHuevo.toLocaleString('es-AR')} por huevo`:''}</small></span><b>$${Number(p.price).toLocaleString('es-AR')}</b></div>`
    }).join('')}
  </div>`:`<div style="background:${NOM.verdeClaro};border-radius:16px;padding:16px;margin-bottom:18px">
    <div style="font-size:16px;font-weight:500;color:${NOM.verde};margin-bottom:4px">La lista de precios va por WhatsApp</div>
    <div style="font-size:12.5px;color:#5F5E5A;line-height:1.5">Creá tu cuenta y te la pasamos completa: huevos por tamaño y todo el almacén con precio mayorista.</div>
  </div>`}

  <h2 style="font-size:18px;margin:0 0 11px">Cómo arrancamos</h2>
  <div style="margin-bottom:20px">
    ${['Creás tu cuenta con el CUIT del comercio',
       'Te pasamos precios y armás tu primer pedido',
       'Después del tercer pedido te abrimos cuenta corriente'].map((t,i2,arr)=>`
      <div style="display:flex;gap:12px;padding:${i2===0?'0 0 11px':i2===arr.length-1?'11px 0 0':'11px 0'};${i2<arr.length-1?`border-bottom:1px solid ${NOM.borde}`:''}">
        <span style="flex-shrink:0;width:24px;height:24px;border-radius:8px;background:${NOM.verde};color:#F5EFE0;display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:500">${i2+1}</span>
        <span style="font-size:13px;color:${NOM.tinta}">${t}</span>
      </div>`).join('')}
  </div>

  <div style="background:${NOM.verde};border-radius:16px;padding:18px">
    <p style="margin:0;font-size:16px;font-weight:500;color:#F5EFE0;line-height:1.35">Probá con un pedido chico. Si no te lo sacan de las manos, no seguís.</p>
    <button class="btn" id="btn_quiero_ser_mayorista" style="width:100%;margin-top:14px;background:#F5EFE0;color:${NOM.verde};border:none;padding:13px 0;font-size:14px;font-weight:500">Quiero ser cliente mayorista</button>
    <button class="btn" id="btn_ya_soy_mayorista" style="width:100%;margin-top:8px;background:transparent;color:#F5EFE0;border:1px solid rgba(247,244,236,0.3);padding:12px 0;font-size:13.5px">Ya tengo cuenta</button>
  </div>`)

  document.querySelector('#btn_quiero_ser_mayorista').onclick = ()=>{ current='mayorista-signup'; render() }
  document.querySelector('#btn_ya_soy_mayorista').onclick = ()=>{ current='mayorista-login'; render() }
}

const mayoristaAlta = { first_name:'', last_name:'', dni:'', phone:'', email:'', street:'', street_number:'', neighborhood:'', city:'Rosario', province:'Santa Fe', zone:'', carrito:{}, frequency:'weekly', payment_method:'transfer' }
const CONDICIONES_IVA = [
  { value:'responsable_inscripto', label:'Responsable inscripto' },
  { value:'monotributo', label:'Monotributista' },
  { value:'consumidor_final', label:'Consumidor final' }
]
const CONDICION_IVA_LABEL = {
  responsable_inscripto:'Responsable inscripto',
  monotributo:'Monotributista',
  consumidor_final:'Consumidor final'
}

async function mayoristaSignupForm(){
  const c = mayoristaAlta
  c.condicion_iva = c.condicion_iva || ''
  c.fiscal_igual = c.fiscal_igual !== false
  let enviando = false

  const dibujar = ()=>{
    layout(`<h2>Creá tu cuenta mayorista</h2>
    <p class="muted" style="margin:-6px 0 14px;font-size:12.5px">Un minuto y ya podés comprar con precio mayorista.</p>

    <div class="card">
      <h3>Cómo lo conocen</h3>
      <div class="field"><label>Nombre del comercio *</label><input id="ma_nombre_comercial" value="${c.nombre_comercial||''}" placeholder="Ej: Granja de las Flores"/></div>
      <div class="field"><label>Rubro</label><input id="ma_rubro" value="${c.rubro||''}" placeholder="Ej: almacén, kiosco, supermercado"/></div>
    </div>

    <div class="card">
      <h3>Cómo factura</h3>
      <p class="muted" style="font-size:12.5px;margin:0 0 12px">Los datos que van en el comprobante. Pueden ser distintos al nombre del comercio.</p>
      <div class="grid two">
        <div class="field"><label>Nombre o razón social *</label><input id="ma_first_name" value="${c.first_name||''}"/></div>
        <div class="field"><label>Apellido</label><input id="ma_last_name" value="${c.last_name||''}"/></div>
      </div>
      <div class="field"><label>CUIT o DNI *</label><input id="ma_dni" inputmode="numeric" value="${c.dni||''}" placeholder="Sin puntos ni guiones"/></div>
      <div class="field"><label>Condición ante el IVA *</label>
        <div class="grid three">
          ${CONDICIONES_IVA.map(x=>`<button type="button" class="btn ${c.condicion_iva===x.value?'primary':'ghost'}" data-ma-iva="${x.value}" style="font-size:12px;padding:11px 6px">${x.label}</button>`).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Dónde entregamos</h3>
      <div class="grid two">
        <div class="field"><label>Calle *</label><input id="ma_street" value="${c.street||''}"/></div>
        <div class="field"><label>Número *</label><input id="ma_street_number" value="${c.street_number||''}"/></div>
      </div>
      <div class="field"><label>Barrio o referencia</label><input id="ma_neighborhood" value="${c.neighborhood||''}"/></div>
      <div class="grid two">
        <div class="field"><label>Ciudad</label><input id="ma_city" value="${c.city||'Rosario'}"/></div>
        <div class="field"><label>Provincia</label><input id="ma_province" value="${c.province||'Santa Fe'}"/></div>
      </div>
      <div class="field"><label>Zona *</label>
        <div class="grid two">${ZONAS.map(z=>`<button type="button" class="btn ${c.zone===z.value?'primary':'ghost'}" data-ma-zona="${z.value}">${z.label}</button>`).join('')}</div>
      </div>
      <div class="field"><label>¿Cuándo recibís mercadería?</label><input id="ma_recepcion" value="${c.recepcion_nota||''}" placeholder="Ej: martes y viernes de 8 a 11"/></div>

      <button type="button" data-ma-fiscal-igual style="width:100%;background:${c.fiscal_igual?NOM.verdeClaro:'#FFFFFF'};border:1px solid ${c.fiscal_igual?NOM.verde:NOM.borde};border-radius:11px;padding:12px;display:flex;align-items:center;gap:10px;margin-top:6px;text-align:left">
        ${ico(c.fiscal_igual?'check':'cerrar', 18, c.fiscal_igual?NOM.verde:'#A8A89E')}
        <span style="font-size:12.5px;color:${NOM.tinta}">El domicilio fiscal es el mismo</span>
      </button>

      ${!c.fiscal_igual?`<div style="border-top:1px solid ${NOM.borde};margin-top:14px;padding-top:14px">
        <p style="margin:0 0 10px;font-size:13px;font-weight:500;color:${NOM.tinta}">Domicilio fiscal</p>
        <div class="grid two">
          <div class="field"><label>Calle</label><input id="ma_f_street" value="${c.fiscal_street||''}"/></div>
          <div class="field"><label>Número</label><input id="ma_f_number" value="${c.fiscal_street_number||''}"/></div>
        </div>
        <div class="grid two">
          <div class="field"><label>Ciudad</label><input id="ma_f_city" value="${c.fiscal_city||''}"/></div>
          <div class="field"><label>Provincia</label><input id="ma_f_province" value="${c.fiscal_province||''}"/></div>
        </div>
        <div class="field"><label>Código postal</label><input id="ma_f_cp" value="${c.fiscal_postal_code||''}"/></div>
      </div>`:''}
    </div>

    <div class="card">
      <h3>Con quién hablamos</h3>
      <div class="field"><label>Teléfono del local *</label><input id="ma_tel_local" inputmode="tel" value="${c.telefono_local||''}"/></div>
      <div class="grid two">
        <div class="field"><label>Nombre del dueño o encargado</label><input id="ma_contacto_nombre" value="${c.contacto_nombre||''}"/></div>
        <div class="field"><label>Su teléfono</label><input id="ma_contacto_tel" inputmode="tel" value="${c.contacto_telefono||''}"/></div>
      </div>
      <div class="field"><label>Email para comprobantes</label><input id="ma_email" type="email" value="${c.email||''}"/></div>
    </div>

    <div class="card">
      <div style="background:${NOM.verdeClaro};border-radius:12px;padding:14px">
        <div style="display:flex;gap:10px;align-items:flex-start">
          ${ico('check',19,NOM.verde)}
          <div>
            <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">Después de crear la cuenta</div>
            <div style="font-size:12.5px;color:#5F5E5A;line-height:1.5;margin-top:3px">Entrás a la tienda con precios mayoristas y armás tu pedido: huevos por tamaño, almacén y todo lo que vayamos sumando.</div>
          </div>
        </div>
      </div>
      <div id="err_alta_mayorista" class="alert danger" style="display:none;margin-top:12px"></div>
    </div>

    <button class="btn primary" id="btn_confirmar_alta_mayorista" style="width:100%" ${enviando?'disabled':''}>${enviando?'Creando…':'Crear mi cuenta'}</button>
    <button class="btn ghost" id="btn_volver_landing" style="width:100%;margin-top:8px">← Volver</button>`)

    const guardarCampos = ()=>{
      const g = (id)=>document.querySelector(id)?.value.trim()||''
      c.nombre_comercial = g('#ma_nombre_comercial')
      c.rubro = g('#ma_rubro')
      c.first_name = g('#ma_first_name')
      c.last_name = g('#ma_last_name')
      c.dni = g('#ma_dni')
      c.street = g('#ma_street')
      c.street_number = g('#ma_street_number')
      c.neighborhood = g('#ma_neighborhood')
      c.city = g('#ma_city')
      c.province = g('#ma_province')
      c.recepcion_nota = g('#ma_recepcion')
      c.telefono_local = g('#ma_tel_local')
      c.contacto_nombre = g('#ma_contacto_nombre')
      c.contacto_telefono = g('#ma_contacto_tel')
      c.email = g('#ma_email')
      if(!c.fiscal_igual){
        c.fiscal_street = g('#ma_f_street')
        c.fiscal_street_number = g('#ma_f_number')
        c.fiscal_city = g('#ma_f_city')
        c.fiscal_province = g('#ma_f_province')
        c.fiscal_postal_code = g('#ma_f_cp')
      }
    }

    document.querySelectorAll('[data-ma-iva]').forEach(b=>b.onclick=()=>{ guardarCampos(); c.condicion_iva = b.dataset.maIva; dibujar() })
    document.querySelectorAll('[data-ma-zona]').forEach(b=>b.onclick=()=>{ guardarCampos(); c.zone = b.dataset.maZona; dibujar() })
    const btnFiscal = document.querySelector('[data-ma-fiscal-igual]')
    if(btnFiscal) btnFiscal.onclick = ()=>{ guardarCampos(); c.fiscal_igual = !c.fiscal_igual; dibujar() }
    document.querySelector('#btn_volver_landing').onclick = ()=>{ current='mayorista-landing'; render() }

    document.querySelector('#btn_confirmar_alta_mayorista').onclick = async ()=>{
      guardarCampos()
      const box = document.querySelector('#err_alta_mayorista')
      const fallar = (msg)=>{ box.textContent = msg; box.style.display='block'; box.scrollIntoView({behavior:'smooth',block:'center'}) }

      if(!c.nombre_comercial) return fallar('Poné el nombre del comercio.')
      if(!c.first_name) return fallar('Falta el nombre o razón social para facturar.')
      if(!/^(\d{7,8}|\d{11})$/.test(c.dni)) return fallar('Ingresá el CUIT (11 números) o el DNI (7 u 8), sin puntos ni guiones.')
      if(!c.condicion_iva) return fallar('Elegí la condición ante el IVA.')
      if(!c.street || !c.street_number) return fallar('Falta la dirección donde entregamos.')
      if(!c.zone) return fallar('Elegí tu zona.')
      if(!c.telefono_local) return fallar('Falta el teléfono del local.')

      box.style.display='none'
      enviando = true; dibujar()

      const { data, error } = await supabase.rpc('mayorista_signup', {
        p_customer: {
          first_name: c.first_name, last_name: c.last_name,
          dni: c.dni, phone: c.telefono_local,
          email: c.email, street: c.street, street_number: c.street_number,
          neighborhood: c.neighborhood, city: c.city || 'Rosario',
          province: c.province || 'Santa Fe', zone: c.zone,
          nombre_comercial: c.nombre_comercial, rubro: c.rubro,
          condicion_iva: c.condicion_iva,
          telefono_local: c.telefono_local,
          contacto_nombre: c.contacto_nombre, contacto_telefono: c.contacto_telefono,
          email_comprobantes: c.email,
          recepcion_nota: c.recepcion_nota,
          fiscal_igual_local: c.fiscal_igual,
          fiscal_street: c.fiscal_igual ? null : c.fiscal_street,
          fiscal_street_number: c.fiscal_igual ? null : c.fiscal_street_number,
          fiscal_city: c.fiscal_igual ? null : c.fiscal_city,
          fiscal_province: c.fiscal_igual ? null : c.fiscal_province,
          fiscal_postal_code: c.fiscal_igual ? null : c.fiscal_postal_code
        },
        p_subscription: { frequency:'weekly', egg_quantity: 0, payment_method:'cash', plan_breakdown: [], price: 0 }
      })

      enviando = false
      if(error || !data?.ok){
        dibujar()
        const b2 = document.querySelector('#err_alta_mayorista')
        if(b2){ b2.textContent = data?.error || 'No pudimos crear tu cuenta. Probá de nuevo.'; b2.style.display='block' }
        return
      }

      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
      if(fresh?.found) cuenta = fresh
      if(fresh?.customer?.id) await ubicarClienteNuevo(fresh.customer.id, { street:c.street, street_number:c.street_number, city:c.city||'Rosario', province:c.province||'Santa Fe' }, c.dni)
      mostrarAlerta(`¡Bienvenido${(c.nombre_comercial||'').trim()?', '+c.nombre_comercial.trim():''}! Ya podés armar tu primer pedido.`)
      current = 'mayorista-panel'
      render()
    }
  }
  dibujar()
}

let mayoristaCarrito = {}
let mayoristaCarritoProductosNuevo = {}
let mayoristaFrecuencia = null
let mayoristaVista = 'tienda'
let mayoristaCategoria = null
let mayoristaObservacion = ''
let mayoristaCierre = null


function saludoHora(){
  const h = new Date().getHours()
  if(h < 12) return 'Buen día'
  if(h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}
function nombreComercio(c){
  return (c.nombre_comercial || `${c.first_name||''} ${c.last_name||''}`).trim()
}


async function cargarRepartidorAsignado(){
  const box = document.querySelector('#card_repartidor')
  if(!box) return
  const next = cuenta?.next_order
  if(!next){ box.remove(); return }

  const { data } = await supabase.rpc('repartidor_de_mi_pedido', { p_order_id: next.id })
  if(!data || data.error || !data.nombre){ box.remove(); return }

  box.innerHTML = `<h3>Tu repartidor</h3>
    <div style="display:flex;gap:12px;align-items:center">
      ${data.photo_url
        ? `<img src="${data.photo_url}" alt="" style="width:50px;height:50px;border-radius:16px;object-fit:cover;flex-shrink:0;background:${NOM.verdeClaro}"/>`
        : `<div style="width:50px;height:50px;border-radius:16px;background:${NOM.verde};color:#F5EFE0;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:500;flex-shrink:0">${(data.nombre||'?').charAt(0).toUpperCase()}</div>`}
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:500;color:${NOM.tinta}">${data.nombre} te lleva el pedido</div>
        ${data.vehiculo?`<div style="font-size:12px;color:${NOM.tintaSuave};margin-top:2px">${data.vehiculo}</div>`:''}
      </div>
      ${ico('check',20,NOM.verde)}
    </div>
    <p class="muted" style="font-size:11.5px;margin:10px 0 0">Si golpea la puerta otra persona, no la recibas y avisanos.</p>`
}

async function mayoristaPanel(){
  panelVolver = mayoristaPanel
  if(!cuenta){ current='mayorista-login'; render(); return }
  const c = cuenta.customer
  const next = cuenta.next_order

  const [{ data: planesRaw }, { data: prodRaw }, { data: revisarRaw }, { data: ultimoRaw }, { data: cuentaRaw }] = await Promise.all([
    supabase.from('plan_prices').select('id,egg_quantity,price,grade,unidad').eq('active', true).eq('customer_type','mayorista').order('egg_quantity'),
    supabase.from('catalog_products').select('id,name,photo_url,unit_label,units_per_bulto,price,wholesale_price,category').eq('active', true).order('name'),
    supabase.rpc('pedido_para_revisar', { p_dni: c.dni, p_customer_id: c.id }),
    supabase.rpc('ultimo_pedido_cliente', { p_dni: c.dni, p_customer_id: c.id }),
    supabase.rpc('estado_cuenta_comercio', { p_dni: c.dni, p_customer_id: c.id })
  ])
  const hayQueRevisar = revisarRaw?.hay ? revisarRaw : null
  const estadoCuenta = cuentaRaw?.ok ? cuentaRaw : null

  const planes = ordenarPorGrado(planesRaw)
  const productos = (prodRaw||[]).map(p=>({ ...p, precio: p.wholesale_price || p.price }))
  const ultimo = ultimoRaw?.hay ? ultimoRaw : null
  const subActiva = (cuenta.subscriptions||[]).find(s=>s.status==='active')

  if(subActiva && !Object.keys(mayoristaCarrito).length){
    (subActiva.plan_breakdown||[]).forEach(b=>{ if(b.plan_id) mayoristaCarrito[b.plan_id] = b.qty })
  }

  const categorias = {}
  productos.forEach(p=>{
    const cat = p.category || 'Otros'
    categorias[cat] ??= []
    categorias[cat].push(p)
  })
  const nombresCategorias = Object.keys(categorias).sort()

  const totalMaples = ()=>Object.values(mayoristaCarrito).reduce((s,n)=>s+Number(n||0),0)
  const totalHuevos = ()=>Object.entries(mayoristaCarrito).reduce((s,[id,n])=>{ const pl=planes.find(p=>p.id===id); return s+(pl?Number(pl.egg_quantity):0)*n }, 0)
  const totalHuevosPrecio = ()=>Object.entries(mayoristaCarrito).reduce((s,[id,n])=>{ const pl=planes.find(p=>p.id===id); return s+(pl?Number(pl.price):0)*n }, 0)
  const totalProdPrecio = ()=>Object.entries(mayoristaCarritoProductosNuevo||{}).reduce((s,[id,n])=>{ const p=productos.find(x=>x.id===id); return s+(p?Number(p.precio):0)*n }, 0)
  const totalGeneral = ()=>totalHuevosPrecio()+totalProdPrecio()
  const itemsEnCarrito = ()=>Object.values(mayoristaCarrito).filter(n=>n>0).length + Object.values(mayoristaCarritoProductosNuevo||{}).filter(n=>n>0).length

  const iconoCategoria = (cat)=>{
    const c2 = (cat||'').toLowerCase()
    if(c2.includes('aceite')||c2.includes('vinagre')) return 'botella'
    if(c2.includes('conserva')||c2.includes('lata')) return 'carrito'
    if(c2.includes('fideo')||c2.includes('pasta')) return 'huevo'
    if(c2.includes('limpieza')) return 'carrito'
    if(c2.includes('carne')||c2.includes('vacío')) return 'carrito'
    return 'carrito'
  }

  const barraCarrito = ()=>{
    if(!totalGeneral()) return ''
    return `<div style="position:sticky;bottom:92px;z-index:6;background:${NOM.verde};border-radius:14px;padding:13px 15px;margin-top:12px;display:flex;justify-content:space-between;align-items:center;gap:11px">
      <div style="flex:1;min-width:0">
        <div style="font-size:11px;color:${NOM.verdePastel}">${itemsEnCarrito()} ítem(s)${totalMaples()?` · ${totalMaples()} maple(s)`:''}</div>
        <div style="font-size:21px;font-weight:500;color:#F5EFE0;font-variant-numeric:tabular-nums">$${totalGeneral().toLocaleString('es-AR')}</div>
      </div>
      <button class="btn" id="btn_ver_pedido_may" style="background:#F5EFE0;color:${NOM.verde};border:none;padding:10px 16px;font-size:13px;font-weight:500;flex-shrink:0">Ver pedido</button>
    </div>`
  }

  const filaProducto = (p)=>{
    const n = (mayoristaCarritoProductosNuevo||{})[p.id] || 0
    const bulto = p.units_per_bulto > 1
    return `<div style="background:${NOM.superficie};border:1px solid ${NOM.borde};${n>0?`border-left:3px solid ${NOM.verde};border-radius:0 13px 13px 0`:'border-radius:13px'};padding:11px;margin-bottom:8px;display:flex;gap:11px;align-items:center">
      ${p.photo_url
        ? `<img src="${p.photo_url}" alt="" style="width:46px;height:46px;border-radius:10px;object-fit:cover;flex-shrink:0;background:${NOM.verdeClaro}"/>`
        : `<div style="width:46px;height:46px;border-radius:10px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico('carrito',20,NOM.verde)}</div>`}
      <div style="flex:1;min-width:0">
        <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta};line-height:1.3">${p.name}</div>
        <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">$${Number(p.precio).toLocaleString('es-AR')} · ${p.unit_label||'unidad'}</div>
        ${bulto?`<div style="font-size:11px;color:${NOM.verde};margin-top:2px">bulto de ${p.units_per_bulto} · $${(Number(p.precio)*p.units_per_bulto).toLocaleString('es-AR')}</div>`:''}
      </div>
      <span style="display:flex;align-items:center;gap:7px;flex-shrink:0">
        <button type="button" data-may-pmenos="${p.id}" class="btn ghost" style="padding:7px 12px">−</button>
        <b style="min-width:20px;text-align:center;display:inline-block">${n}</b>
        <button type="button" data-may-pmas="${p.id}" class="btn ghost" style="padding:7px 12px">+</button>
      </span>
    </div>`
  }

  const filaHuevo = (pl)=>{
    const n = mayoristaCarrito[pl.id] || 0
    const etiqueta = pl.grade ? (GRADO_LABEL[pl.grade]||pl.grade) : `${pl.egg_quantity} huevos`
    const porHuevo = pl.egg_quantity ? Math.round(Number(pl.price)/pl.egg_quantity) : 0
    return `<div style="background:${NOM.superficie};border:1px solid ${NOM.borde};${n>0?`border-left:3px solid ${NOM.verde};border-radius:0 13px 13px 0`:'border-radius:13px'};padding:11px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:11px">
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:500;color:${NOM.tinta}">${etiqueta}</div>
        <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">maple de ${pl.egg_quantity} · $${Number(pl.price).toLocaleString('es-AR')}</div>
        ${porHuevo?`<div style="font-size:11px;color:${NOM.verde};margin-top:2px">$${porHuevo.toLocaleString('es-AR')} por huevo</div>`:''}
      </div>
      <span style="display:flex;align-items:center;gap:7px;flex-shrink:0">
        <button type="button" data-may-menos="${pl.id}" class="btn ghost" style="padding:7px 12px">−</button>
        <b style="min-width:20px;text-align:center;display:inline-block">${n}</b>
        <button type="button" data-may-mas="${pl.id}" class="btn ghost" style="padding:7px 12px">+</button>
      </span>
    </div>`
  }

  const dibujar = ()=>{
    if(mayoristaVista === 'categoria' && mayoristaCategoria){
      const esHuevos = mayoristaCategoria === '__huevos__'
      const items = esHuevos ? planes : (categorias[mayoristaCategoria]||[])
      layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <button class="btn ghost" id="btn_volver_tienda" style="padding:6px 12px">←</button>
        <h2 style="margin:0;font-size:19px">${esHuevos?'Huevos':mayoristaCategoria}</h2>
      </div>
      ${esHuevos && !planes.length
        ? `<div style="background:${NOM.verdeClaro};border-radius:12px;padding:14px"><p style="margin:0;font-size:13px;color:#5F5E5A;line-height:1.5">Todavía no publicamos la lista de huevos. Escribinos y te la pasamos al toque.</p></div>`
        : items.map(x=>esHuevos?filaHuevo(x):filaProducto(x)).join('')}
      ${esHuevos&&planes.length?`<div class="alert info" style="font-size:12px">Todos los maples son de 30 huevos.</div>`:''}
      ${barraCarrito()}`)
      engancharTienda()
      return
    }

    if(mayoristaVista === 'historial'){
      const h = estadoCuenta?.historial || []
      layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <button class="btn ghost" id="btn_volver_tienda" style="padding:6px 12px">←</button>
        <h2 style="margin:0;font-size:19px">Mis compras</h2>
      </div>
      ${estadoCuenta?`<div class="card">
        <div class="row" style="border:0;padding:5px 0"><span style="font-size:13px;color:${NOM.tintaSuave}">Saldo pendiente</span><span style="font-size:15px;font-weight:500;color:${Number(estadoCuenta.deuda)>0?NOM.ambar:NOM.tinta};font-variant-numeric:tabular-nums">$${Number(estadoCuenta.deuda||0).toLocaleString('es-AR')}</span></div>
        ${Number(estadoCuenta.a_favor)>0?`<div class="row" style="border:0;padding:5px 0"><span style="font-size:13px;color:${NOM.tintaSuave}">A favor</span><span style="font-size:15px;font-weight:500;color:${NOM.verde};font-variant-numeric:tabular-nums">$${Number(estadoCuenta.a_favor).toLocaleString('es-AR')}</span></div>`:''}
        <p class="muted" style="font-size:11.5px;margin:9px 0 0">${estadoCuenta.cuenta_corriente?`Tenés ${estadoCuenta.dias_plazo} días para pagar cada entrega.`:'Pagás contra entrega.'}</p>
      </div>`:''}
      ${h.length ? h.map(x=>`<div style="background:${NOM.superficie};border:1px solid ${NOM.borde};border-radius:13px;padding:12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
          <div>
            <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">${formatearFecha(x.delivery_date)}</div>
            <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">Pedido N° ${x.order_number||'-'}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:14px;font-weight:500;font-variant-numeric:tabular-nums">$${Number(x.total||0).toLocaleString('es-AR')}</div>
            ${Number(x.saldo)>0
              ? `<div style="font-size:11.5px;color:${NOM.ambar};margin-top:2px">Debe $${Number(x.saldo).toLocaleString('es-AR')}</div>`
              : `<div style="font-size:11.5px;color:${NOM.verde};margin-top:2px">Pagado</div>`}
          </div>
        </div>
      </div>`).join('') : estadoVacio('Acá van a aparecer tus compras cuando arranquemos.')}`)
      document.querySelector('#btn_volver_tienda').onclick = ()=>{ mayoristaVista='tienda'; dibujar() }
      return
    }

    if(mayoristaVista === 'pedido'){
      const cierre = mayoristaCierre
      const lineas = []
      Object.entries(mayoristaCarrito).filter(([,n])=>n>0).forEach(([id,n])=>{
        const pl = planes.find(p=>p.id===id); if(!pl) return
        lineas.push({ tipo:'huevo', id, nombre: pl.grade?(GRADO_LABEL[pl.grade]||pl.grade):`Maple ${pl.egg_quantity}`, sub:`maple de ${pl.egg_quantity}`, cant:n, precio:Number(pl.price)*n })
      })
      Object.entries(mayoristaCarritoProductosNuevo||{}).filter(([,n])=>n>0).forEach(([id,n])=>{
        const p = productos.find(x=>x.id===id); if(!p) return
        lineas.push({ tipo:'prod', id, nombre:p.name, sub:p.unit_label||'unidad', cant:n, precio:Number(p.precio)*n, foto:p.photo_url })
      })

      layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <button class="btn ghost" id="btn_volver_tienda" style="padding:6px 12px">←</button>
        <h2 style="margin:0;font-size:19px">Tu pedido</h2>
      </div>

      ${lineas.length ? lineas.map(l=>`<div style="background:${NOM.superficie};border:1px solid ${NOM.borde};border-radius:13px;padding:11px;margin-bottom:8px;display:flex;gap:11px;align-items:center">
        ${l.foto
          ? `<img src="${l.foto}" alt="" style="width:42px;height:42px;border-radius:9px;object-fit:cover;flex-shrink:0"/>`
          : `<div style="width:42px;height:42px;border-radius:9px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico(l.tipo==='huevo'?'huevo':'carrito',18,NOM.verde)}</div>`}
        <div style="flex:1;min-width:0">
          <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta};line-height:1.3">${l.nombre}</div>
          <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">${l.sub} · $${l.precio.toLocaleString('es-AR')}</div>
        </div>
        <span style="display:flex;align-items:center;gap:7px;flex-shrink:0">
          <button type="button" data-ped-menos="${l.tipo}:${l.id}" class="btn ghost" style="padding:6px 11px">−</button>
          <b style="min-width:20px;text-align:center;display:inline-block">${l.cant}</b>
          <button type="button" data-ped-mas="${l.tipo}:${l.id}" class="btn ghost" style="padding:6px 11px">+</button>
          <button type="button" data-ped-quitar="${l.tipo}:${l.id}" class="btn ghost" style="padding:6px 9px;color:${NOM.rojo}">${ico('cerrar',15,NOM.rojo)}</button>
        </span>
      </div>`).join('') : estadoVacio(`Todavía no cargaste nada${(c.first_name||'').trim()?', '+c.first_name.trim():''}. Arrancá por los huevos.`)}

      ${lineas.length?`<div class="card">
        <div class="row" style="border:0;padding:5px 0"><span style="font-size:13px;color:${NOM.tintaSuave}">Huevos</span><span style="font-size:13px;font-variant-numeric:tabular-nums">$${totalHuevosPrecio().toLocaleString('es-AR')}</span></div>
        <div class="row" style="border:0;padding:5px 0"><span style="font-size:13px;color:${NOM.tintaSuave}">Almacén</span><span style="font-size:13px;font-variant-numeric:tabular-nums">$${totalProdPrecio().toLocaleString('es-AR')}</span></div>
        ${cierre && Number(cierre.envio)>0?`<div class="row" style="border:0;padding:5px 0"><span style="font-size:13px;color:${NOM.tintaSuave}">Envío</span><span style="font-size:13px;font-variant-numeric:tabular-nums">$${Number(cierre.envio).toLocaleString('es-AR')}</span></div>`:''}
        ${cierre && cierre.envio_gratis?`<div class="row" style="border:0;padding:5px 0"><span style="font-size:13px;color:${NOM.verde}">Envío</span><span style="font-size:13px;color:${NOM.verde}">sin cargo</span></div>`:''}
        <div class="row" style="border-top:1px solid ${NOM.borde};padding:9px 0 0;margin-top:5px"><span style="font-size:14px;font-weight:500">Total</span><span style="font-size:21px;font-weight:500;color:${NOM.verde};font-variant-numeric:tabular-nums">$${(totalGeneral() + Number(cierre?.envio||0)).toLocaleString('es-AR')}</span></div>

        ${cierre && Number(cierre.falta_para_gratis)>0?`<div style="background:#FBE9D4;border-radius:11px;padding:11px;margin-top:12px">
          <div style="font-size:12.5px;color:${NOM.ambar};line-height:1.5">Sumá <b>$${Number(cierre.falta_para_gratis).toLocaleString('es-AR')}</b> más y el envío te sale sin cargo.</div>
        </div>`:''}

        <div style="background:${NOM.fondo};border-radius:11px;padding:13px;margin-top:12px">
          <div style="font-size:11px;letter-spacing:1px;color:${NOM.tintaSuave};margin-bottom:10px">CÓMO SIGUE</div>
          <div style="display:flex;gap:10px;align-items:flex-start;padding:6px 0">
            ${ico('camion',16,NOM.verde)}
            <div>
              <div style="font-size:12.5px;color:${NOM.tinta}">Te lo llevamos en la próxima vuelta${cierre?.barrio?` por ${cierre.barrio}`:''}</div>
              <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">Te confirmamos el día apenas lo agendemos</div>
            </div>
          </div>
          ${cierre && (cierre.recepcion_dias || cierre.recepcion_desde)?`<div style="display:flex;gap:10px;align-items:flex-start;padding:6px 0">
            ${ico('reloj',16,NOM.verde)}
            <div>
              <div style="font-size:12.5px;color:${NOM.tinta}">Llegamos en tu horario de recepción</div>
              <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">${cierre.recepcion_dias||''}${cierre.recepcion_desde?`${cierre.recepcion_dias?', de ':'De '}${String(cierre.recepcion_desde).slice(0,5)} a ${String(cierre.recepcion_hasta||'').slice(0,5)}`:''}</div>
            </div>
          </div>`:''}
          <div style="display:flex;gap:10px;align-items:flex-start;padding:6px 0">
            ${ico('moneda',16,NOM.verde)}
            <div>
              <div style="font-size:12.5px;color:${NOM.tinta}">${cierre?.cuenta_corriente?`Tenés ${cierre.dias_plazo} días para pagarlo`:'Pagás al recibir'}</div>
              <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">Efectivo o transferencia</div>
            </div>
          </div>
        </div>

        <details style="border:1px solid ${NOM.borde};border-radius:11px;padding:13px;margin-top:12px">
          <summary style="cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center">
            <span style="display:flex;gap:9px;align-items:center">${ico('check',17,NOM.verde)}<span style="font-size:13px;font-weight:500;color:${NOM.tinta}">Cuando llegue el repartidor</span></span>
            ${ico('flecha',17,NOM.verde)}
          </summary>
          <div style="padding-top:13px">
            ${[['Te avisa desde la app','Vas a ver un aviso acá diciendo que está en tu puerta'],
               ['Contás la mercadería','Se abre la lista de lo que pediste y vas tildando. Sin apuro'],
               ['Si falta algo, lo marcás','Elegís si pagás solo lo que llegó o si te queda a favor']].map(([t,d],i)=>`
              <div style="display:flex;gap:11px;padding:${i===0?'0 0 11px':'11px 0'};border-bottom:1px solid ${NOM.borde}">
                <span style="flex-shrink:0;width:22px;height:22px;border-radius:7px;background:${NOM.verdeClaro};color:${NOM.verde};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500">${i+1}</span>
                <div><div style="font-size:12.5px;color:${NOM.tinta}">${t}</div><div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px;line-height:1.45">${d}</div></div>
              </div>`).join('')}
            <div style="display:flex;gap:11px;padding:11px 0 13px">
              <span style="flex-shrink:0;width:22px;height:22px;border-radius:7px;background:${NOM.verdeClaro};color:${NOM.verde};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500">4</span>
              <div style="flex:1">
                <div style="font-size:12.5px;color:${NOM.tinta}">Firma quien recibe</div>
                <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px;line-height:1.45">No hace falta que estés vos: puede firmar quien esté en el mostrador</div>
                <div style="background:${NOM.fondo};border-radius:9px;padding:11px;margin-top:9px">
                  <div style="display:flex;gap:9px;align-items:flex-start;padding-bottom:8px;border-bottom:1px solid ${NOM.borde}">
                    ${ico('personas',14,NOM.verde)}
                    <div><div style="font-size:11.5px;color:${NOM.tinta};font-weight:500">Sus datos</div><div style="font-size:11px;color:${NOM.tintaSuave}">Nombre y DNI de quien recibe</div></div>
                  </div>
                  <div style="display:flex;gap:9px;align-items:flex-start;padding-top:8px">
                    ${ico('moto',14,NOM.verde)}
                    <div><div style="font-size:11.5px;color:${NOM.tinta};font-weight:500">Los del repartidor</div><div style="font-size:11px;color:${NOM.tintaSuave}">Se los pide y él se los dicta ahí mismo</div></div>
                  </div>
                </div>
              </div>
            </div>
            <div style="background:${NOM.verdeClaro};border-radius:9px;padding:11px">
              <div style="font-size:11.5px;color:#5F5E5A;line-height:1.5">Si no tenés el teléfono a mano, el repartidor te presta el suyo y firmás igual.</div>
            </div>
          </div>
        </details>

        <div class="field" style="margin-top:13px"><label>¿Algo que tengamos que saber?</label><input id="may_observacion" value="${mayoristaObservacion||''}" placeholder="Ej: tocar el timbre de al lado"/></div>

        <div id="err_may_pedido" class="alert danger" style="display:none"></div>
        <button class="btn primary" id="btn_confirmar_may" style="width:100%">Confirmar pedido</button>
      </div>`:''}`)
      engancharPedido()
      return
    }

    // ===== TIENDA =====
    const resumenUltimo = ultimo ? [
      ...(ultimo.plan_breakdown||[]).map(b=>`${b.qty} ${b.grade?(GRADO_LABEL[b.grade]||b.grade).toLowerCase():`maple ${b.size}`}`),
      ...(ultimo.productos||[]).map(p=>`${p.cantidad} ${p.nombre.toLowerCase()}`)
    ].join(' · ') : ''

    layout(`<div style="background:${NOM.verde};border-radius:16px;padding:17px;margin-bottom:12px">
      <div style="font-size:13px;color:${NOM.verdePastel}">${saludoHora()},</div>
      <div style="font-size:22px;font-weight:500;color:#F5EFE0;line-height:1.2;margin-top:4px">${nombreComercio(c)}</div>
      ${next
        ? `<div style="font-size:12.5px;color:#C9D8B0;line-height:1.5;margin-top:9px">Tu próxima entrega es el ${formatearFecha(next.delivery_date).toLowerCase()}. ¿Necesitás algo más?</div>`
        : `<div style="font-size:12.5px;color:#C9D8B0;line-height:1.5;margin-top:9px">¿Arrancamos con tu primer pedido?</div>`}
    </div>

    ${hayQueRevisar?`<div style="background:${NOM.ambar};border-radius:16px;padding:16px;margin-bottom:12px">
      <div style="font-size:12px;color:#FBE9D4">${hayQueRevisar.repartidor_nombre||'El repartidor'} ya está en tu puerta</div>
      <div style="font-size:17px;font-weight:500;color:#FFFFFF;margin-top:4px;line-height:1.25">Revisá tranquilo y después firmamos</div>
      <button class="btn" id="btn_ir_revisar" style="width:100%;margin-top:12px;background:#FFFFFF;color:${NOM.ambar};border:none;padding:12px 0;font-size:14px;font-weight:500">Revisar ahora</button>
    </div>`:''}

    ${next && (next.customer_stage || next.status==='out_for_delivery') ? barraEstadoPedido(next.customer_stage, next.status, next.out_for_delivery_at, next.en_route_at) : ''}
    ${next?`<div class="card" id="card_repartidor"><h3>Tu repartidor</h3>${skeletonBloque(2)}</div>`:''}

    ${estadoCuenta && (Number(estadoCuenta.deuda)>0 || Number(estadoCuenta.a_favor)>0) ? `<div class="card">
      <h3>Tu cuenta</h3>
      <div class="grid two" style="gap:8px">
        ${Number(estadoCuenta.deuda)>0?`<div style="background:#FBE9D4;border-radius:11px;padding:12px">
          <div style="font-size:11px;color:#B8641E">Te quedó pendiente</div>
          <div style="font-size:19px;font-weight:500;color:#B8641E;font-variant-numeric:tabular-nums">$${Number(estadoCuenta.deuda).toLocaleString('es-AR')}</div>
        </div>`:''}
        ${Number(estadoCuenta.a_favor)>0?`<div style="background:${NOM.verdeClaro};border-radius:11px;padding:12px">
          <div style="font-size:11px;color:${NOM.verde}">A favor</div>
          <div style="font-size:19px;font-weight:500;color:${NOM.verde};font-variant-numeric:tabular-nums">$${Number(estadoCuenta.a_favor).toLocaleString('es-AR')}</div>
        </div>`:''}
      </div>
      <button class="btn ghost" id="btn_ver_historial_may" style="width:100%;margin-top:10px">Ver mis compras</button>
    </div>`:''}

    ${ultimo && resumenUltimo ? `<div style="background:${NOM.superficie};border:1px solid ${NOM.borde};border-left:3px solid ${NOM.verde};border-radius:0 14px 14px 0;padding:13px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:11px">
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:500;color:${NOM.tinta}">¿Lo mismo de la vez pasada?</div>
          <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:3px;line-height:1.4">${resumenUltimo}</div>
          ${Number(ultimo.total)>0?`<div style="font-size:11.5px;color:${NOM.verde};margin-top:3px">$${Number(ultimo.total).toLocaleString('es-AR')}</div>`:''}
        </div>
        <button class="btn primary" id="btn_lo_de_siempre" style="padding:9px 14px;font-size:12.5px;flex-shrink:0">Cargar</button>
      </div>
      <p class="muted" style="font-size:11px;margin:8px 0 0">Lo cargamos y después sacás o agregás lo que quieras.</p>
    </div>`:''}

    <h2 style="font-size:17px;margin:0 0 11px">¿Qué necesitás?</h2>
    <div class="grid two" style="margin-bottom:14px">
      <div data-may-cat="__huevos__" style="background:${NOM.superficie};border:1px solid ${NOM.borde};border-radius:14px;overflow:hidden;cursor:pointer">
        <div style="height:74px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center">${ico('huevo',26,NOM.verde)}</div>
        <div style="padding:11px">
          <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">Huevos</div>
          <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px">${planes.length?`${planes.length} tamaño(s)`:'consultá la lista'}</div>
        </div>
      </div>
      ${nombresCategorias.map(cat=>`<div data-may-cat="${cat}" style="background:${NOM.superficie};border:1px solid ${NOM.borde};border-radius:14px;overflow:hidden;cursor:pointer">
        <div style="height:74px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center">${ico(iconoCategoria(cat),26,NOM.verde)}</div>
        <div style="padding:11px">
          <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta};line-height:1.3">${cat}</div>
          <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px">${categorias[cat].length} producto(s)</div>
        </div>
      </div>`).join('')}
    </div>

    ${barraCarrito()}

    ${subActiva?`<div class="card">
      <h3>Tu suscripción</h3>
      <p class="muted" style="font-size:12.5px;margin:0 0 10px">${subActiva.status==='paused'?'Está pausada':'Activa'}${subActiva.next_delivery_date?` · próxima ${formatearFecha(subActiva.next_delivery_date)}`:''}</p>
      ${subActiva.status==='active'?`<button class="btn ghost" data-pausar="${subActiva.id}" style="width:100%">Pausar pedidos</button>`:''}
      ${subActiva.status==='paused'?`<button class="btn primary" data-reanudar="${subActiva.id}" style="width:100%">Reanudar</button>`:''}
    </div>`:''}

    <button class="btn ghost" id="btn_salir_may" style="width:100%;margin-top:8px">Cerrar sesión</button>`)

    document.querySelectorAll('[data-may-cat]').forEach(el=>el.onclick=()=>{
      mayoristaCategoria = el.dataset.mayCat
      mayoristaVista = 'categoria'
      dibujar()
    })
    const btnSiempre = document.querySelector('#btn_lo_de_siempre')
    if(btnSiempre) btnSiempre.onclick = ()=>{
      Object.keys(mayoristaCarrito).forEach(k=>delete mayoristaCarrito[k])
      Object.keys(mayoristaCarritoProductosNuevo).forEach(k=>delete mayoristaCarritoProductosNuevo[k])
      ;(ultimo.plan_breakdown||[]).forEach(b=>{ if(b.plan_id) mayoristaCarrito[b.plan_id] = b.qty })
      ;(ultimo.productos||[]).forEach(p=>{ mayoristaCarritoProductosNuevo[p.product_id] = p.cantidad })
      irAlPedido()
    }
    const btnRevisar = document.querySelector('#btn_ir_revisar')
    if(btnRevisar) btnRevisar.onclick = ()=>revisionConformidad(hayQueRevisar.order_id, c, 'cliente')
    const btnHistorial = document.querySelector('#btn_ver_historial_may')
    if(btnHistorial) btnHistorial.onclick = ()=>{ mayoristaVista='historial'; dibujar() }
    const btnVer = document.querySelector('#btn_ver_pedido_may')
    if(btnVer) btnVer.onclick = ()=>irAlPedido()
    const btnSalir = document.querySelector('#btn_salir_may')
    if(btnSalir) btnSalir.onclick = ()=>{ cuenta=null; mayoristaVista='tienda'; current='inicio'; render() }
    engancharSuscripcion()
    cargarRepartidorAsignado()
  }

  const irAlPedido = async ()=>{
    const { data } = await supabase.rpc('mayorista_datos_cierre', {
      p_dni: c.dni, p_customer_id: c.id, p_subtotal: totalGeneral()
    })
    mayoristaCierre = data?.ok ? data : null
    mayoristaVista = 'pedido'
    dibujar()
  }

  const engancharTienda = ()=>{
    document.querySelector('#btn_volver_tienda').onclick = ()=>{ mayoristaVista='tienda'; mayoristaCategoria=null; dibujar() }
    document.querySelectorAll('[data-may-mas]').forEach(b=>b.onclick=()=>{ const k=b.dataset.mayMas; mayoristaCarrito[k]=(mayoristaCarrito[k]||0)+1; dibujar() })
    document.querySelectorAll('[data-may-menos]').forEach(b=>b.onclick=()=>{ const k=b.dataset.mayMenos; if(mayoristaCarrito[k]>0) mayoristaCarrito[k]--; dibujar() })
    document.querySelectorAll('[data-may-pmas]').forEach(b=>b.onclick=()=>{ const k=b.dataset.mayPmas; mayoristaCarritoProductosNuevo[k]=(mayoristaCarritoProductosNuevo[k]||0)+1; dibujar() })
    document.querySelectorAll('[data-may-pmenos]').forEach(b=>b.onclick=()=>{ const k=b.dataset.mayPmenos; if(mayoristaCarritoProductosNuevo[k]>0) mayoristaCarritoProductosNuevo[k]--; dibujar() })
    const btnVer = document.querySelector('#btn_ver_pedido_may')
    if(btnVer) btnVer.onclick = ()=>irAlPedido()
  }

  const engancharPedido = ()=>{
    document.querySelector('#btn_volver_tienda').onclick = ()=>{ mayoristaVista='tienda'; mayoristaCategoria=null; dibujar() }
    const mover = async (clave, delta)=>{
      const [tipo, id] = clave.split(':')
      const bolsa = tipo==='huevo' ? mayoristaCarrito : mayoristaCarritoProductosNuevo
      bolsa[id] = Math.max(0, (bolsa[id]||0) + delta)
      if(bolsa[id]===0) delete bolsa[id]
      const { data } = await supabase.rpc('mayorista_datos_cierre', {
        p_dni: c.dni, p_customer_id: c.id, p_subtotal: totalGeneral()
      })
      mayoristaCierre = data?.ok ? data : mayoristaCierre
      dibujar()
    }
    document.querySelectorAll('[data-ped-mas]').forEach(b=>b.onclick=()=>mover(b.dataset.pedMas, 1))
    document.querySelectorAll('[data-ped-menos]').forEach(b=>b.onclick=()=>mover(b.dataset.pedMenos, -1))
    document.querySelectorAll('[data-ped-quitar]').forEach(b=>b.onclick=()=>{
      const [tipo, id] = b.dataset.pedQuitar.split(':')
      const bolsa = tipo==='huevo' ? mayoristaCarrito : mayoristaCarritoProductosNuevo
      delete bolsa[id]
      dibujar()
    })
    document.querySelectorAll('[data-may-frec]').forEach(b=>b.onclick=()=>{ mayoristaFrecuencia = b.dataset.mayFrec; dibujar() })

    const inpObs = document.querySelector('#may_observacion')
    if(inpObs) inpObs.oninput = ()=>{ mayoristaObservacion = inpObs.value }

    const btnConf = document.querySelector('#btn_confirmar_may')
    if(btnConf) btnConf.onclick = async ()=>{
      const box = document.querySelector('#err_may_pedido')
      if(!totalGeneral()){ box.textContent='Tu pedido está vacío.'; box.style.display='block'; return }
      btnConf.disabled = true
      btnConf.textContent = 'Enviando…'

      const huevos = Object.entries(mayoristaCarrito).filter(([,q])=>q>0).map(([plan_id,qty])=>({ plan_id, qty }))
      const productos = Object.entries(mayoristaCarritoProductosNuevo||{}).filter(([,q])=>q>0).map(([product_id,quantity])=>({ product_id, quantity }))

      const { data, error } = await supabase.rpc('mayorista_tomar_pedido', {
        p_dni: c.dni, p_customer_id: c.id,
        p_huevos: huevos, p_productos: productos,
        p_observacion: mayoristaObservacion || null
      })

      if(error || !data?.ok){
        btnConf.disabled = false
        btnConf.textContent = 'Confirmar pedido'
        box.textContent = data?.error || 'No pudimos guardar el pedido. Probá de nuevo.'
        box.style.display = 'block'
        return
      }

      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
      if(fresh?.found) cuenta = fresh
      Object.keys(mayoristaCarrito).forEach(k=>delete mayoristaCarrito[k])
      Object.keys(mayoristaCarritoProductosNuevo).forEach(k=>delete mayoristaCarritoProductosNuevo[k])
      mayoristaObservacion = ''
      mayoristaCierre = null
      mostrarAlerta('Listo, ya lo anotamos. Te avisamos el día de la entrega.')
      mayoristaVista = 'tienda'
      render()
    }
  }

  const engancharSuscripcion = ()=>{
    document.querySelectorAll('[data-pausar]').forEach(b=>b.onclick=async()=>{
      const { error } = await supabase.rpc('customer_pause_subscription', { p_dni: c.dni, p_customer_id: c.id, p_subscription_id: b.dataset.pausar, p_until: null })
      if(!error){ const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni }); if(fresh?.found) cuenta = fresh; render() }
    })
    document.querySelectorAll('[data-reanudar]').forEach(b=>b.onclick=async()=>{
      const { error } = await supabase.rpc('customer_resume_subscription', { p_dni: c.dni, p_customer_id: c.id, p_subscription_id: b.dataset.reanudar })
      if(!error){ const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni }); if(fresh?.found) cuenta = fresh; render() }
    })
  }

  dibujar()
}


async function preparador(){
  const { data, error } = await supabase.rpc('preparador_pedidos_pendientes', {})
  const pedidos = data || []
  const hoy = new Date().toISOString().slice(0,10)
  const grupos = {}
  pedidos.forEach(p=>{ grupos[p.delivery_date] ??= []; grupos[p.delivery_date].push(p) })
  const mn = new Date(); mn.setDate(mn.getDate()+1)
  const manana = mn.toISOString().slice(0,10)
  const pm = new Date(); pm.setDate(pm.getDate()+2)
  const pasado = pm.toISOString().slice(0,10)
  // "Hoy" a secas no decía si era el día de armarlo o el de entregarlo.
  const cuandoSeEntrega = f => f===hoy ? 'Se entregan HOY' : f===manana ? 'Se entregan MAÑANA' : f===pasado ? 'Se entregan PASADO MAÑANA' : 'Se entregan el '+formatearFecha(f)
  // El preparador arma maples, no cuenta huevos de a uno.
  const enMaples = p => (p.plan_breakdown && p.plan_breakdown.length)
    ? p.plan_breakdown.map(b=>`${b.qty} maple${b.qty>1?'s':''} de ${b.size}${b.grade?` <span style="color:${NOM.verde}">${GRADO_LABEL[b.grade]||b.grade}</span>`:''}`).join(' + ')
    : `${p.egg_quantity||0} huevos`
  const nombreP = p => (p.nombre_comercial||'').trim() || `${p.last_name||''}, ${p.first_name||''}`

  const fechasOrdenadas = Object.keys(grupos).sort()
  const contenido = fechasOrdenadas.length ? fechasOrdenadas.map(f=>{
    const delDia = grupos[f]
    const huevosDia = delDia.reduce((s,p)=>s+Number(p.egg_quantity||0),0)
    const maplesDia = Math.round((huevosDia/30)*10)/10
    return pCard(`
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding-bottom:10px;border-bottom:1px solid ${NOM.borde};margin-bottom:4px">
        <div>
          <div style="font-size:13.5px;font-weight:600;color:${NOM.verde}">${cuandoSeEntrega(f)}</div>
          <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:1px">${formatearFecha(f)}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:13.5px;font-weight:600;color:${NOM.verde}">${delDia.length} pedido${delDia.length===1?'':'s'}</div>
          <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:1px">${huevosDia} huevos · ${maplesDia} maples</div>
        </div>
      </div>
      ${delDia.map(p=>{
        const restriccion = tieneRestriccionHoraria(p) ? textoRestriccionHoraria(p) : ''
        const ubicacion = [p.neighborhood, p.zone?'zona '+p.zone:''].filter(Boolean).join(' · ')
        return `<div style="display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid ${NOM.borde}">
          <div style="flex:1;min-width:0">
            <div style="font-size:14.5px"><b>${p.last_name||''}</b>${p.last_name?', ':''}${p.nombre_comercial||p.first_name||''}${p.customer_type==='mayorista'?` <span style="font-size:10.5px;background:${NOM.ambarClaro};color:#B8641E;padding:1px 7px;border-radius:999px">Mayorista</span>`:''}</div>
            <div style="font-size:12.5px;color:${NOM.verde};margin-top:2px">${enMaples(p)}</div>
            ${ubicacion?`<div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">${ubicacion}</div>`:''}
            ${(p.extra_eggs&&p.extra_eggs.length)?`<div style="font-size:11px;color:${NOM.verde};margin-top:3px">🥚 Sumados por teléfono: ${p.extra_eggs.map(e=>`${e.qty}×${e.size}`).join(' + ')}</div>`:''}
            ${restriccion?`<div style="font-size:11px;color:#B85C00;margin-top:3px">⏰ ${restriccion}</div>`:''}
            ${p.important_note?`<div style="font-size:11px;color:#B85C00;margin-top:3px">⚠️ ${p.important_note}</div>`:''}
            ${p.needs_review?`<div style="font-size:11px;color:${NOM.rojo};margin-top:3px">🔍 Marcado para revisar antes de armar</div>`:''}
          </div>
          <button data-preparar="${p.id}" style="background:${NOM.verde};color:#F5EFE0;border:none;border-radius:8px;padding:8px 14px;font-size:12.5px;font-weight:600;flex-shrink:0">Preparar</button>
        </div>`
      }).join('')}
    `, 'margin-bottom:10px')
  }).join('') : estadoVacio('No hay pedidos pendientes de preparar por ahora.')
  layout(`<h2>📦 Preparar pedidos</h2><p class="muted" style="margin-top:-8px;margin-bottom:12px">Podés ir armando con hasta 2 días de anticipación.</p>${contenido}`)
  document.querySelectorAll('[data-preparar]').forEach(b=>b.onclick=()=>abrirPreparacion(b.dataset.preparar))
}

async function abrirPreparacion(id){
  const { data: detalle, error } = await supabase.rpc('preparador_pedido_detalle', { p_order_id: id })
  if(error || !detalle || detalle.error) return mostrarAlerta('No se pudo cargar el pedido')
  const o = detalle.order, c = detalle.customer, sub = detalle.subscription||{}, productos = detalle.productos||[]
  const marcados = o.prep_checklist || []
  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><button class="btn ghost" id="btn_volver_preparador" style="padding:6px 12px">← Volver</button><h2 style="margin:0">Preparar pedido</h2></div>
  <div class="card">
    <h3>${c.last_name||''}, ${c.first_name||''}</h3>
    <p class="muted">${c.neighborhood||''} · Entrega: ${formatearFecha(o.delivery_date)}</p>
    ${c.customer_type==='mayorista'?`<div style="margin:8px 0">${pPill('Mayorista','#FBE9D4','#B8641E')}</div>`:''}
    ${o.channel==='phone'?`<div style="margin:8px 0">${pPill('📞 Pedido telefónico','#FAEEDA','#854F0B')}${o.taken_by_name?`<small class="muted"> lo tomó ${o.taken_by_name}</small>`:''}</div>`:''}
    ${(o.extra_eggs&&o.extra_eggs.length)?`<div class="alert info">🥚 Huevos sumados por teléfono: ${o.extra_eggs.map(e=>`${e.qty}×${e.size}`).join(' + ')}</div>`:''}
    ${o.needs_review?`<div class="alert warning">⚠️ Revisar antes de preparar: ${o.review_note||'este pedido quedó marcado para revisión.'}</div>`:''}
    ${o.important_note?`<div class="alert warning">⚠️ ${o.important_note}</div>`:''}
  </div>
  <div class="card">
    <h3>✅ Checklist</h3>
    <p class="muted" style="font-size:11.5px;margin-bottom:8px">Podés salir y volver cuando quieras — lo que ya tildaste queda guardado.</p>
    ${(sub.plan_breakdown && sub.plan_breakdown.length)
      ? sub.plan_breakdown.map((b,i)=>`<label style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F0EBDD">
          <input type="checkbox" class="check-prep" data-item-key="eggs_${i}" ${marcados.includes('eggs_'+i)?'checked':''} style="width:19px;height:19px"/>
          <div style="width:30px;height:30px;border-radius:8px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico('huevo',16,NOM.verde)}</div>
          <span style="flex:1"><b>${b.qty}</b> × ${b.grade?`maple ${b.size} <span style="color:${NOM.verde}">${GRADO_LABEL[b.grade]||b.grade}</span>`:`maple de ${b.size}`}</span>
        </label>`).join('')
      : `<label style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F0EBDD">
          <input type="checkbox" class="check-prep" data-item-key="eggs" ${marcados.includes('eggs')?'checked':''} style="width:19px;height:19px"/>
          <div style="width:30px;height:30px;border-radius:8px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico('huevo',16,NOM.verde)}</div>
          <span style="flex:1">${sub.egg_quantity||'-'} huevos</span>
        </label>`}
    ${productos.map(p=>`<label style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #F0EBDD">
      <input type="checkbox" class="check-prep" data-item-key="${p.id}" ${marcados.includes(p.id)?'checked':''} style="width:18px;height:18px"/>
      ${p.photo_url?`<img src="${p.photo_url}" style="width:28px;height:28px;border-radius:6px;object-fit:cover"/>`:'<span>🛒</span>'}
      <span>${p.quantity}× ${p.name}</span>
    </label>`).join('')}
    ${!productos.length?'<p class="muted" style="font-size:12px;margin-top:6px">Sin productos extra, solo huevos.</p>':''}
    <button class="btn primary" id="btn_finalizar_preparado" style="width:100%;margin-top:14px">📦 Finalizar preparado</button>
  </div>`)
  document.querySelector('#btn_volver_preparador').onclick = ()=>{ current='preparador'; render() }
  const actualizarBtnPrep = ()=>{ document.querySelector('#btn_finalizar_preparado').disabled = ![...document.querySelectorAll('.check-prep')].every(chk=>chk.checked) }
  actualizarBtnPrep()
  document.querySelectorAll('.check-prep').forEach(chk=>chk.onchange=async()=>{
    actualizarBtnPrep()
    await supabase.rpc('preparador_toggle_check', { p_order_id: id, p_item_key: chk.dataset.itemKey, p_checked: chk.checked })
  })
  supabase.rpc('preparador_marcar_preparando', { p_order_id: id })
  document.querySelector('#btn_finalizar_preparado').onclick = async ()=>{
    const { data, error: errFin } = await supabase.rpc('preparador_finalizar', { p_order_id: id })
    if(errFin || !data?.ok){ mostrarAlerta('No se pudo finalizar: '+(errFin?.message||data?.error||'')); return }
    mostrarAlerta('📦 ¡Pedido preparado! Ya está listo para el repartidor.')
    current='preparador'; render()
  }
}

let ventaEstado = null
const CANALES_VENTA = [
  { value: 'puerta_fria', label: 'Puerta fría' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'otro', label: 'Otra red' }
]
async function vendedor(){
  if(!ventaEstado){
    const { data: planesRaw } = await supabase.from('plan_prices').select('egg_quantity,price').eq('active', true).eq('customer_type','minorista').order('egg_quantity')
    ventaEstado = {
      planes: (planesRaw && planesRaw.length) ? planesRaw : [{egg_quantity:15,price:7000},{egg_quantity:30,price:12000}],
      canal: 'puerta_fria',
      first_name:'', last_name:'', dni:'', phone:'', email:'',
      street:'', street_number:'', street_type:'calle', neighborhood:'',
      city:'', province:'', postal_code:'', zone:'',
      carrito: {}, frequency:'weekly', payment_method:'cash', preferred_weekday: null,
      localidades: [], enviando:false
    }
  }
  const e = ventaEstado
  const totalCant = ()=>Object.entries(e.carrito).reduce((s,[q,c])=>s+Number(q)*c,0)
  const totalPrecio = ()=>Object.entries(e.carrito).reduce((s,[q,c])=>{ const pl=e.planes.find(p=>String(p.egg_quantity)===q); return s+(pl?Number(pl.price):0)*c }, 0)

  const dibujar = ()=>{
    layout(`<h2>🧑‍💼 Nueva venta</h2><p class="muted" style="margin-top:-8px;margin-bottom:12px">Registrá una suscripción nueva vos mismo — queda a tu nombre para tu comisión.</p>
    <div class="card">
      <h3>¿Cómo lo captaste?</h3>
      <div class="grid two">${CANALES_VENTA.map(c=>`<button type="button" data-canal="${c.value}" class="btn ${e.canal===c.value?'primary':'ghost'}">${c.label}</button>`).join('')}</div>
    </div>
    <div class="card">
      <h3>Datos del cliente</h3>
      <div class="grid two">
        <div class="field"><label>Nombre</label><input id="v_first_name" value="${e.first_name}"/></div>
        <div class="field"><label>Apellido</label><input id="v_last_name" value="${e.last_name}"/></div>
        <div class="field"><label>DNI</label><input id="v_dni" inputmode="numeric" value="${e.dni}"/></div>
        <div class="field"><label>Teléfono</label><input id="v_phone" inputmode="tel" value="${e.phone}"/></div>
        <div class="field"><label>Email</label><input id="v_email" type="email" value="${e.email}"/></div>
        <div class="field"><label>Barrio</label><input id="v_neighborhood" value="${e.neighborhood}"/></div>
      </div>
      <div class="field"><label>Tipo de vía</label><div class="grid three">${TIPOS_VIA_OPCIONES.map(t=>`<button type="button" data-street-type="${t.value}" class="btn ${e.street_type===t.value?'primary':'ghost'}">${t.label}</button>`).join('')}</div></div>
      <div class="grid two">
        <div class="field"><label>Calle</label><input id="v_street" value="${e.street}"/></div>
        <div class="field"><label>Número</label><input id="v_street_number" value="${e.street_number}"/></div>
      </div>
      <div class="grid two">
        <div class="field"><label>Provincia</label><select id="v_province"><option value="">Elegí</option>${PROVINCIAS.map(p=>`<option value="${p}" ${e.province===p?'selected':''}>${p}</option>`).join('')}</select></div>
        <div class="field" id="v_city_wrap"><label>Localidad</label><select id="v_city" ${!e.province?'disabled':''}><option value="">${e.province?(e.localidades.length?'Elegí':'Cargando…'):'Elegí primero la provincia'}</option>${e.localidades.map(l=>`<option value="${l}" ${e.city===l?'selected':''}>${l}</option>`).join('')}</select></div>
      </div>
      <div class="field"><label>Zona</label><div class="grid two">${ZONAS.map(z=>`<button type="button" data-zone="${z.value}" class="btn ${e.zone===z.value?'primary':'ghost'}">${z.label}</button>`).join('')}</div></div>
    </div>
    <div class="card">
      <h3>Plan</h3>
      ${e.planes.map(pl=>`<div class="row"><span>${pl.egg_quantity} huevos <small class="muted">$${Number(pl.price).toLocaleString('es-AR')}</small></span><span style="display:flex;align-items:center;gap:8px"><button type="button" data-v-menos="${pl.egg_quantity}" class="btn ghost" style="padding:6px 14px">−</button><b>${e.carrito[pl.egg_quantity]||0}</b><button type="button" data-v-mas="${pl.egg_quantity}" class="btn ghost" style="padding:6px 14px">+</button></span></div>`).join('')}
      <div class="alert info" style="margin-top:8px"><b>Total: ${totalCant()} huevos</b> · $${totalPrecio().toLocaleString('es-AR')}</div>
      <div class="field" style="margin-top:10px"><label>Frecuencia</label><div class="grid three">${Object.entries(FRECUENCIAS).map(([v,l])=>`<button type="button" data-frecuencia="${v}" class="btn ${e.frequency===v?'primary':'ghost'}">${l}</button>`).join('')}</div></div>
      <div class="field"><label>Forma de pago</label><div class="grid three">
        <button type="button" data-metodo-venta="cash" class="btn ${e.payment_method==='cash'?'primary':'ghost'}">Efectivo</button>
        <button type="button" data-metodo-venta="transfer" class="btn ${e.payment_method==='transfer'?'primary':'ghost'}">Transferencia</button>
        <button type="button" data-metodo-venta="mp" class="btn ${e.payment_method==='mp'?'primary':'ghost'}">Mercado Pago</button>
      </div></div>
    </div>
    <div id="err_venta" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_confirmar_venta" style="width:100%" ${e.enviando?'disabled':''}>${e.enviando?'Enviando…':'✅ Confirmar suscripción'}</button>`)
    ligar()
  }

  const ligar = ()=>{
    document.querySelectorAll('[data-canal]').forEach(b=>b.onclick=()=>{ e.canal=b.dataset.canal; dibujar() })
    document.querySelectorAll('[data-street-type]').forEach(b=>b.onclick=()=>{ e.street_type=b.dataset.streetType; dibujar() })
    document.querySelectorAll('[data-zone]').forEach(b=>b.onclick=()=>{ e.zone=b.dataset.zone; dibujar() })
    document.querySelectorAll('[data-v-mas]').forEach(b=>b.onclick=()=>{ e.carrito[b.dataset.vMas]=(e.carrito[b.dataset.vMas]||0)+1; dibujar() })
    document.querySelectorAll('[data-v-menos]').forEach(b=>b.onclick=()=>{ if(e.carrito[b.dataset.vMenos]>0) e.carrito[b.dataset.vMenos]--; dibujar() })
    document.querySelectorAll('[data-frecuencia]').forEach(b=>b.onclick=()=>{ e.frequency=b.dataset.frecuencia; dibujar() })
    document.querySelectorAll('[data-metodo-venta]').forEach(b=>b.onclick=()=>{ e.payment_method=b.dataset.metodoVenta; dibujar() })
    const camposTexto = ['first_name','last_name','dni','phone','email','neighborhood','street','street_number']
    camposTexto.forEach(campo=>{
      const el = document.querySelector('#v_'+campo)
      if(el) el.oninput = ()=> e[campo] = el.value
    })
    const provinceEl = document.querySelector('#v_province')
    if(provinceEl) provinceEl.onchange = async ()=>{
      e.province = provinceEl.value; e.city=''; e.localidades=[]
      if(!e.province){ dibujar(); return }
      dibujar()
      try{
        const res = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(e.province)}&campos=nombre&max=5000`)
        const data = await res.json()
        e.localidades = [...new Set((data.localidades||[]).map(l=>l.nombre))].sort((a,b)=>a.localeCompare(b,'es'))
      }catch(err){ e.localidades = [] }
      dibujar()
    }
    const cityEl = document.querySelector('#v_city')
    if(cityEl) cityEl.onchange = ()=> e.city = cityEl.value
    document.querySelector('#btn_confirmar_venta').onclick = async ()=>{
      const errBox = document.querySelector('#err_venta')
      if(!e.first_name.trim() || !e.last_name.trim() || !/^(\d{7,8}|\d{11})$/.test(e.dni.trim())){ errBox.textContent='Completá nombre, apellido y un DNI o CUIT válido.'; errBox.style.display='block'; return }
      if(!e.zone){ errBox.textContent='Elegí una zona.'; errBox.style.display='block'; return }
      const total = totalCant()
      if(total<=0){ errBox.textContent='Elegí al menos un maple.'; errBox.style.display='block'; return }
      e.enviando = true; dibujar()
      const breakdown = Object.entries(e.carrito).filter(([,q])=>q>0).map(([size,qty])=>({size:Number(size),qty}))
      const { data, error } = await supabase.rpc('vendedor_registrar_venta', {
        p_customer: {
          first_name:e.first_name.trim(), last_name:e.last_name.trim(), dni:e.dni.trim(), phone:e.phone.trim(), email:e.email.trim(),
          street:e.street.trim(), street_number:e.street_number.trim(), street_type:e.street_type,
          neighborhood:e.neighborhood.trim(), city:e.city, province:e.province, country:'Argentina', postal_code:e.postal_code.trim(), zone:e.zone
        },
        p_subscription: { frequency:e.frequency, egg_quantity: total, payment_method:e.payment_method, plan_breakdown: breakdown, price: totalPrecio(), preferred_weekday: e.preferred_weekday },
        p_channel: e.canal
      })
      e.enviando = false
      if(error || !data?.ok){ errBox.textContent = 'No se pudo registrar: '+(data?.error||error?.message||''); errBox.style.display='block'; dibujar(); return }
      mostrarConfeti('¡Venta registrada! Cuando el cliente pague su primera entrega, se genera tu comisión.')
      ventaEstado = null
      current = 'vendedor'; render()
    }
  }
  dibujar()
}

async function vendedorMisSuscriptores(){
  const { data } = await supabase.rpc('vendedor_mis_suscriptores', {})
  const lista = data || []
  layout(`<h2>👥 Mis suscriptores</h2>
  ${lista.length? lista.map(c=>{
    const canalLabel = CANALES_VENTA.find(ca=>ca.value===c.acquisition_channel)?.label || c.acquisition_channel || '-'
    return pCard(`
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div><b style="color:#2F4D2A">${c.first_name||''} ${c.last_name||''}</b><br><small class="muted">${canalLabel} · desde ${new Date(c.created_at).toLocaleDateString('es-AR')}</small></div>
        ${pPill(c.sub_status==='active'?'Activa':c.sub_status==='paused'?'Pausada':c.sub_status||'-')}
      </div>
      <div class="row" style="border-top:1px solid #F0EBDD;margin-top:8px;padding-top:8px"><span>${c.egg_quantity||0} huevos</span><span class="badge">${c.payment_status==='paid'?'✅ Pago al día':'🟡 Pendiente'}</span></div>
    `)
  }).join('') : estadoVacio('Todavía no registraste ninguna venta.')}`)
}

async function vendedorMisComisiones(){
  const { data } = await supabase.rpc('vendedor_mis_comisiones', {})
  const lista = data || []
  const pendiente = lista.filter(c=>c.status==='pending').reduce((s,c)=>s+Number(c.amount),0)
  layout(`<h2>💰 Mis comisiones</h2>
  <div class="card stat" style="text-align:center;margin-bottom:12px"><div class="muted">Pendiente de cobro</div><b style="font-size:22px;color:#2F4D2A">$${pendiente.toLocaleString('es-AR')}</b></div>
  ${lista.length? lista.map(c=>`<div class="row"><span>${c.first_name||''} ${c.last_name||''}<br><small class="muted">${new Date(c.created_at).toLocaleDateString('es-AR')}${c.paid_at?` · Pagada el ${new Date(c.paid_at).toLocaleDateString('es-AR')}`:''}</small></span><span><b>$${Number(c.amount).toLocaleString('es-AR')}</b><br>${pPill(c.status==='paid'?'Pagada':'Pendiente')}</span></div>`).join('') : estadoVacio('Todavía no tenés comisiones generadas.')}`)
}

let campoGranjeroSel = ''
let campoYaPagado = false
let campoMetodoPago = 'cash'
let campoOrigenSel = 'propio'
let campoGranjeroVerHistorial = null
let campoRecibiendoEncargo = null
let campoEncargoModo = 'entrega'



// ---- Cabecera común de las pantallas del campo ----
function campoHeader(titulo){
  return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_campo_volver" style="padding:8px 11px">${ico('flechaIzq',16,NOM.verde)}</button>
    <h2 style="margin:0;font-size:19px">${titulo}</h2>
  </div>`
}
function campoEngancharVolver(){
  const b = document.querySelector('#btn_campo_volver')
  if(b) b.onclick = ()=>{ current='campo'; render() }
}

// ---- CARGAR EL DÍA ----
async function campoDia(){
  const { data: res } = await supabase.rpc('campo_resumen', {})
  const L = (res?.lotes||[]).find(l=>l.id===campoLoteSel) || (res?.lotes||[])[0]
  if(!L){ current='campo'; return render() }
  const enProduccion = L.etapa?.codigo === 'produccion'

  let huevos = 0, rotos = 0, muertas = 0, lluvia = null, enviando = false

  const dibujar = ()=>{
    const buenos = Math.max(0, huevos - rotos)
    const post = L.aves > 0 ? Math.round((buenos / L.aves) * 1000)/10 : 0
    const esp = L.postura_esperada
    layout(`${campoHeader('El día de hoy')}
    <div class="card">
      <p class="muted" style="margin:0 0 13px;font-size:12px">${formatearFecha(new Date().toISOString().slice(0,10))} · ${L.nombre} · ${L.aves} aves</p>

      ${enProduccion?`
      ${campoContador('huevos','Huevos recolectados', huevos, 10)}
      ${campoContador('rotos','Rotos o sucios', rotos, 1)}`:`
      <div style="background:${NOM.fondo};border-radius:11px;padding:12px;margin-bottom:9px">
        <p style="margin:0;font-size:12px;color:${NOM.tintaSuave};line-height:1.5">Todavía no ponen. Cuando aparezca el primer huevo, cargalo acá y el sistema pasa el lote a producción.</p>
      </div>
      ${campoContador('huevos','Huevos (si ya empezaron)', huevos, 1)}`}
      ${campoContador('muertas','Gallinas muertas', muertas, 1)}

      <div class="field" style="margin-top:12px"><label>¿Llovió?</label>
        <div class="grid three">
          ${[['nada','No'],['poca','Un poco'],['mucha','Bastante']].map(([v,l])=>
            `<button type="button" class="btn ${lluvia===v?'primary':'ghost'}" data-lluvia="${v}" style="font-size:12.5px">${l}</button>`).join('')}
        </div>
      </div>

      <div class="field"><label>Alguna observación</label><input id="campo_dia_nota" placeholder="Opcional"/></div>

      ${huevos>0?`<div style="background:${NOM.verdeClaro};border-radius:11px;padding:12px;margin-bottom:11px">
        <div style="font-size:12.5px;color:#5F5E5A;line-height:1.55">Quedan <b>${buenos}</b> huevos buenos · postura ${post}%${esp?` · lo esperado para la edad es ${esp}%`:''}</div>
      </div>`:''}

      <div id="err_campo_dia" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_campo_dia" style="width:100%" ${enviando?'disabled':''}>${enviando?'Guardando…':'Guardar el día'}</button>
    </div>`)

    campoEngancharVolver()
    campoEngancharContadores({huevos,rotos,muertas}, (k,v)=>{
      if(k==='huevos') huevos=v; else if(k==='rotos') rotos=v; else muertas=v
      dibujar()
    })
    document.querySelectorAll('[data-lluvia]').forEach(b=>b.onclick=()=>{ lluvia = lluvia===b.dataset.lluvia?null:b.dataset.lluvia; dibujar() })

    document.querySelector('#btn_campo_dia').onclick = async ()=>{
      const box = document.querySelector('#err_campo_dia')
      if(huevos<=0 && muertas<=0){ box.textContent='Cargá al menos los huevos o las muertas.'; box.style.display='block'; return }
      if(rotos > huevos){ box.textContent='Los rotos no pueden ser más que los huevos recolectados.'; box.style.display='block'; return }
      enviando = true; dibujar()
      const { data, error } = await supabase.rpc('campo_cargar_dia', {
        p_lote_id: L.id, p_huevos: huevos, p_rotos: rotos, p_muertas: muertas,
        p_fecha: new Date().toISOString().slice(0,10),
        p_nota: document.querySelector('#campo_dia_nota')?.value.trim() || null
      })
      enviando = false
      if(error || !data?.ok){ dibujar(); const b2=document.querySelector('#err_campo_dia'); if(b2){ b2.textContent = data?.error || 'No se pudo guardar.'; b2.style.display='block' } return }
      if(lluvia){
        await supabase.from('production').update({ lluvia })
          .eq('lote_id', L.id).eq('production_date', new Date().toISOString().slice(0,10))
      }
      const dif = data.diferencia
      mostrarAlerta(`Guardado.\n\n${data.buenos} huevos buenos · postura ${data.postura}%` +
        (data.esperada ? `\nLo esperado era ${data.esperada}%${dif!=null?` (${dif>0?'+':''}${dif})`:''}` : ''))
      current='campo'; render()
    }
  }
  dibujar()
}

function campoContador(id, label, val, paso){
  return `<div style="border:1px solid ${NOM.borde};border-radius:11px;padding:11px 12px;margin-bottom:7px;display:flex;justify-content:space-between;align-items:center;gap:10px">
    <span style="font-size:12.5px;color:${NOM.tinta};flex:1;min-width:0">${label}</span>
    <span style="display:flex;align-items:center;gap:8px;flex-shrink:0">
      <button type="button" data-cmenos="${id}" data-paso="${paso}" style="width:34px;height:34px;border-radius:9px;background:${NOM.fondo};color:${NOM.verde};border:none;font-size:19px;font-weight:600">−</button>
      <input type="number" inputmode="numeric" id="cnt_${id}" value="${val}" style="width:64px;text-align:center;font-size:17px;font-weight:500;padding:6px 2px;border:1px solid ${NOM.borde};border-radius:8px"/>
      <button type="button" data-cmas="${id}" data-paso="${paso}" style="width:34px;height:34px;border-radius:9px;background:${NOM.verde};color:#F5EFE0;border:none;font-size:19px;font-weight:600">+</button>
    </span>
  </div>`
}

function campoEngancharContadores(vals, onChange){
  document.querySelectorAll('[data-cmas]').forEach(b=>b.onclick=()=>{
    const k=b.dataset.cmas, p=Number(b.dataset.paso)||1
    onChange(k, (Number(document.querySelector('#cnt_'+k)?.value)||0) + p)
  })
  document.querySelectorAll('[data-cmenos]').forEach(b=>b.onclick=()=>{
    const k=b.dataset.cmenos, p=Number(b.dataset.paso)||1
    onChange(k, Math.max(0, (Number(document.querySelector('#cnt_'+k)?.value)||0) - p))
  })
  Object.keys(vals).forEach(k=>{
    const el = document.querySelector('#cnt_'+k)
    if(el) el.onchange = ()=> onChange(k, Math.max(0, Number(el.value)||0))
  })
}


// ---- MOVER EL CARRO ----
async function campoCarro(){
  const { data } = await supabase.rpc('campo_parcelas', {})
  const parcelas = data?.parcelas || []
  const { data: rec } = await supabase.rpc('descanso_recomendado', {})
  const actual = parcelas.find(p=>p.ocupada) || null
  const destinos = parcelas.filter(p=>!p.ocupada)

  let destino = null, fotoSal = null, fotoEnt = null, enviando = false
  const recDias = rec?.dias || 21

  const dibujar = ()=>{
    layout(`${campoHeader('Mover el carro')}

    <div style="background:${NOM.verdeClaro};border-radius:12px;padding:12px;margin-bottom:9px">
      <div style="font-size:12.5px;color:#5F5E5A;line-height:1.55">En ${rec?.mes||'este mes'} el pasto crece <b>${rec?.crecimiento||''}</b>. Conviene dar al menos <b>${recDias} días</b> de descanso.${rec?.motivo_ajuste?`<br><span style="font-size:11.5px">Ajustado porque ${rec.motivo_ajuste}.</span>`:''}</div>
    </div>

    ${actual?`<div class="card">
      <h3 style="font-size:14px;margin:0 0 9px">1 · Sacar de ${actual.nombre}</h3>
      <p class="muted" style="margin:0 0 11px;font-size:11.5px">Estuvieron ${actual.dias_ocupada||0} día(s) ahí</p>
      <div id="foto_salida_box">
        ${fotoSal?`<div style="border:2px solid ${NOM.verde};border-radius:11px;padding:11px;display:flex;gap:10px;align-items:center">
          ${ico('check',18,NOM.verde)}<span style="font-size:12px;color:${NOM.tinta}">Foto lista</span>
          <button class="btn ghost" id="btn_borrar_fsal" style="margin-left:auto;padding:5px 10px;font-size:11px">Cambiar</button>
        </div>`:`<label style="display:block;height:88px;background:${NOM.verdeClaro};border:1px dashed ${NOM.verdePastel};border-radius:11px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;cursor:pointer">
          ${ico('camara',22,NOM.verdePastel)}
          <span style="font-size:11.5px;color:${NOM.tintaSuave}">Foto de cómo quedó el pasto</span>
          <input type="file" accept="image/*" capture="environment" id="foto_salida" style="display:none"/>
        </label>`}
      </div>
    </div>`:`<div style="background:${NOM.fondo};border-radius:12px;padding:12px;margin-bottom:9px">
      <div style="font-size:12px;color:${NOM.tintaSuave}">El carro no está en ninguna parcela. Elegí a cuál lo llevás.</div>
    </div>`}

    <div class="card">
      <h3 style="font-size:14px;margin:0 0 11px">${actual?'2 · ':''}¿A cuál la llevás?</h3>
      ${destinos.length ? destinos.map(p=>{
        const sel = destino === p.id
        const desc = p.nunca_usada ? null : Number(p.descanso_dias||0)
        const poco = desc !== null && desc < recDias
        return `<div data-destino="${p.id}" style="border:${sel?`2px solid ${NOM.verde}`:`1px solid ${NOM.borde}`};background:${sel?NOM.fondo:NOM.superficie};border-radius:11px;padding:12px;margin-bottom:7px;cursor:pointer;${poco&&!sel?'opacity:.62':''}">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            <div>
              <div style="font-size:13px;font-weight:${sel?'500':'400'};color:${NOM.tinta}">${p.nombre}</div>
              ${p.superficie?`<div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px">${Number(p.superficie).toLocaleString('es-AR')} m²${p.m2_por_ave?` · ${p.m2_por_ave} m² por ave`:''}</div>`:''}
            </div>
            <div style="text-align:right;flex-shrink:0">
              ${p.nunca_usada
                ? `<span style="font-size:11px;color:${NOM.verde}">sin usar</span>`
                : `<span style="font-size:11.5px;color:${poco?NOM.ambar:NOM.verde}">${desc} días</span>
                   <div style="font-size:10px;color:${poco?NOM.ambar:NOM.tintaSuave};margin-top:1px">${poco?'poco descanso':'de descanso'}</div>`}
            </div>
          </div>
        </div>`
      }).join('') : estadoVacio('No hay otras parcelas cargadas. Pedile a Gastón que las cree.')}

      ${destino?`<div style="margin-top:11px" id="foto_entrada_box">
        ${fotoEnt?`<div style="border:2px solid ${NOM.verde};border-radius:11px;padding:11px;display:flex;gap:10px;align-items:center">
          ${ico('check',18,NOM.verde)}<span style="font-size:12px;color:${NOM.tinta}">Foto lista</span>
          <button class="btn ghost" id="btn_borrar_fent" style="margin-left:auto;padding:5px 10px;font-size:11px">Cambiar</button>
        </div>`:`<label style="display:block;height:88px;background:${NOM.verdeClaro};border:1px dashed ${NOM.verdePastel};border-radius:11px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;cursor:pointer">
          ${ico('camara',22,NOM.verdePastel)}
          <span style="font-size:11.5px;color:${NOM.tintaSuave}">Foto del pasto antes de entrar</span>
          <input type="file" accept="image/*" capture="environment" id="foto_entrada" style="display:none"/>
        </label>`}
      </div>`:''}

      <div id="err_carro" class="alert danger" style="display:none;margin-top:10px"></div>
      ${destino?`<button class="btn primary" id="btn_mover_carro" style="width:100%;margin-top:11px" ${enviando?'disabled':''}>${enviando?'Guardando…':'Confirmar el movimiento'}</button>`:''}
    </div>`)

    campoEngancharVolver()
    document.querySelectorAll('[data-destino]').forEach(el=>el.onclick=()=>{ destino = el.dataset.destino; dibujar() })
    const fs = document.querySelector('#foto_salida')
    if(fs) fs.onchange = (e)=>{ fotoSal = e.target.files[0]||null; dibujar() }
    const fe = document.querySelector('#foto_entrada')
    if(fe) fe.onchange = (e)=>{ fotoEnt = e.target.files[0]||null; dibujar() }
    const bs = document.querySelector('#btn_borrar_fsal')
    if(bs) bs.onclick = ()=>{ fotoSal=null; dibujar() }
    const be = document.querySelector('#btn_borrar_fent')
    if(be) be.onclick = ()=>{ fotoEnt=null; dibujar() }

    const btn = document.querySelector('#btn_mover_carro')
    if(btn) btn.onclick = async ()=>{
      const box = document.querySelector('#err_carro')
      if(!destino){ box.textContent='Elegí a qué parcela lo llevás.'; box.style.display='block'; return }
      enviando = true; dibujar()

      const subir = async (f, tag)=>{
        if(!f) return null
        const path = `parcelas/${Date.now()}_${tag}.${(f.name.split('.').pop()||'jpg')}`
        const { error } = await supabase.storage.from('finance-attachments').upload(path, f)
        if(error) return null
        const { data: pub } = supabase.storage.from('finance-attachments').getPublicUrl(path)
        return pub.publicUrl
      }
      const [uSal, uEnt] = await Promise.all([subir(fotoSal,'sal'), subir(fotoEnt,'ent')])

      const { data: r, error } = await supabase.rpc('campo_mover_carro', {
        p_parcela_destino: destino, p_lote_id: campoLoteSel,
        p_foto_salida: uSal, p_foto_entrada: uEnt, p_nota: null
      })
      enviando = false
      if(error || !r?.ok){ dibujar(); const b2=document.querySelector('#err_carro'); if(b2){ b2.textContent = r?.error || 'No se pudo guardar.'; b2.style.display='block' } return }
      mostrarAlerta(`Carro movido a ${r.hacia}.` +
        (r.desde?`\n\n${r.desde} estuvo ${r.dias_estuvo} días y empieza a descansar hoy.`:'') +
        (r.poco_descanso?`\n\nOjo: ${r.hacia} descansó menos de lo recomendado.`:''))
      current='campo'; render()
    }
  }
  dibujar()
}

// ---- ABRIR UN INSUMO ----
async function campoInsumo(){
  const cat = await campoCargarCatalogos()
  const insumos = (cat.insumos||[]).filter(i=>Number(i.stock) > 0 || i.es_alimento)
  let sel = null, enviando = false

  const dibujar = ()=>{
    layout(`${campoHeader('Abrir un insumo')}
    <div class="card">
      <p class="muted" style="margin:0 0 12px;font-size:12px">Tocá cuando empezás una bolsa, un frasco o una botella nueva. Queda la hora y el sistema calcula cuánto duró la anterior.</p>
      ${insumos.length ? insumos.map(i=>{
        const s = sel === i.id
        return `<div data-insumo="${i.id}" style="border:${s?`2px solid ${NOM.verde}`:`1px solid ${NOM.borde}`};background:${s?NOM.fondo:NOM.superficie};border-radius:11px;padding:12px;margin-bottom:7px;cursor:pointer">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:${s?'500':'400'};color:${NOM.tinta}">${i.nombre}</div>
              <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px">${i.unit_label}${i.contenido?` · ${i.contenido} ${i.unidad}`:''}${i.dosis?` · ${i.dosis} dosis`:''}</div>
            </div>
            <span style="font-size:11.5px;color:${Number(i.stock)>0?NOM.verde:NOM.ambar};flex-shrink:0">${Number(i.stock)||0} en stock</span>
          </div>
        </div>`
      }).join('') : estadoVacio('No hay insumos cargados. Pedile a Gastón que los cargue.')}
      <div id="err_insumo" class="alert danger" style="display:none;margin-top:10px"></div>
      ${sel?`<button class="btn primary" id="btn_abrir_insumo" style="width:100%;margin-top:11px" ${enviando?'disabled':''}>${enviando?'Guardando…':'Abrí este envase'}</button>`:''}
    </div>`)

    campoEngancharVolver()
    document.querySelectorAll('[data-insumo]').forEach(el=>el.onclick=()=>{ sel = el.dataset.insumo; dibujar() })
    const btn = document.querySelector('#btn_abrir_insumo')
    if(btn) btn.onclick = async ()=>{
      enviando = true; dibujar()
      const { data: r, error } = await supabase.rpc('campo_abrir_insumo', {
        p_product_id: sel, p_lote_id: campoLoteSel, p_nota: null
      })
      enviando = false
      if(error || !r?.ok){ dibujar(); const b=document.querySelector('#err_insumo'); if(b){ b.textContent = r?.error||'No se pudo guardar.'; b.style.display='block' } return }
      let msg = 'Anotado.'
      if(r.duro_dias) msg += `\n\nEl anterior duró ${r.duro_dias} día(s).`
      if(r.consumo_por_ave_dia) msg += `\nCada ave consumió ${r.consumo_por_ave_dia} ${r.unidad_consumo} por día.`
      if(r.quedan != null) msg += `\n\nQuedan ${r.quedan} en stock.`
      mostrarAlerta(msg)
      campoCat = null
      current='campo'; render()
    }
  }
  dibujar()
}

// ---- PESO DE LA SEMANA ----
async function campoPeso(){
  let pesoAve = '', pesoHuevo = '', enviando = false
  const dibujar = ()=>{
    layout(`${campoHeader('Peso de la semana')}
    <div class="card">
      <p class="muted" style="margin:0 0 13px;font-size:12px">Pesá 10 gallinas al azar y 10 huevos, y poné el promedio.</p>
      <div class="field"><label>Peso promedio de la gallina (gramos)</label><input id="p_ave" type="number" inputmode="numeric" value="${pesoAve}" placeholder="Ej: 1850"/></div>
      <div class="field"><label>Peso promedio del huevo (gramos)</label><input id="p_huevo" type="number" inputmode="numeric" value="${pesoHuevo}" placeholder="Ej: 64"/></div>
      <div class="field"><label>Observación</label><input id="p_nota" placeholder="Opcional"/></div>
      <div id="err_peso" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_peso" style="width:100%" ${enviando?'disabled':''}>${enviando?'Guardando…':'Guardar'}</button>
    </div>`)
    campoEngancharVolver()
    document.querySelector('#btn_peso').onclick = async ()=>{
      const box = document.querySelector('#err_peso')
      const pa = Number(document.querySelector('#p_ave').value) || null
      const ph = Number(document.querySelector('#p_huevo').value) || null
      if(!pa && !ph){ box.textContent='Poné al menos uno de los dos pesos.'; box.style.display='block'; return }
      pesoAve = pa||''; pesoHuevo = ph||''
      enviando = true; dibujar()
      const { data: r, error } = await supabase.rpc('campo_registrar_peso', {
        p_lote_id: campoLoteSel, p_peso_ave: pa, p_peso_huevo: ph,
        p_aves_pesadas: 10, p_nota: document.querySelector('#p_nota')?.value.trim() || null
      })
      enviando = false
      if(error || !r?.ok){ dibujar(); const b=document.querySelector('#err_peso'); if(b){ b.textContent=r?.error||'No se pudo guardar.'; b.style.display='block' } return }
      let msg = 'Guardado.'
      if(pa && r.peso_esperado) msg += `\n\nA las ${r.semanas} semanas lo esperado son ${r.peso_esperado} g. Estás ${r.diferencia_pct>0?'+':''}${r.diferencia_pct}%.`
      if(ph && r.tamano_huevo) msg += `\n\nCon ${ph} g el huevo clasifica como ${GRADO_LABEL[r.tamano_huevo]||r.tamano_huevo}.`
      mostrarAlerta(msg)
      current='campo'; render()
    }
  }
  dibujar()
}

// ---- SANIDAD ----
async function campoSanidad(){
  const [cat, { data: tar }, { data: det }] = await Promise.all([
    campoCargarCatalogos(),
    supabase.rpc('campo_tareas', { p_lote_id: campoLoteSel }),
    supabase.rpc('campo_lote_detalle', { p_lote_id: campoLoteSel })
  ])
  const pendientes = (tar?.tareas||[]).filter(t=>t.tipo==='sanidad')
  const hechas = det?.sanidad || []
  let form = null, enviando = false

  const dibujar = ()=>{
    layout(`${campoHeader('Sanidad')}

    ${form ? `<div class="card">
      <h3 style="font-size:14px;margin:0 0 11px">Anotar aplicación</h3>
      <div class="field"><label>¿Qué se aplicó? *</label><input id="san_nombre" value="${form.nombre||''}"/></div>
      <div class="field"><label>Producto usado</label>
        <select id="san_producto">
          <option value="">No corresponde</option>
          ${(cat.insumos||[]).filter(i=>i.categoria==='sanidad').map(i=>`<option value="${i.id}" ${form.producto_id===i.id?'selected':''}>${i.nombre}</option>`).join('')}
        </select>
      </div>
      <div class="grid two">
        <div class="field"><label>Cantidad usada</label><input id="san_cant" type="number" inputmode="decimal" placeholder="Ej: 25"/></div>
        <div class="field"><label>Aves tratadas</label><input id="san_aves" type="number" inputmode="numeric" value="${form.aves||''}"/></div>
      </div>
      <div class="field"><label>Observación</label><input id="san_nota"/></div>
      <div id="err_san" class="alert danger" style="display:none"></div>
      ${pBtnRow([
        pBtn('','Guardar','id="btn_san_guardar"','primary'),
        pBtn('','Cancelar','id="btn_san_cancelar"','ghost')
      ])}
    </div>` : `
    ${pendientes.length?`<div class="card">
      <h3 style="font-size:14px;margin:0 0 11px">Lo que viene</h3>
      ${pendientes.map(t=>{
        const d = Number(t.dias)
        return `<div style="background:${d<=2?'#FBE9D4':NOM.fondo};border-radius:11px;padding:12px;margin-bottom:7px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            <div>
              <div style="font-size:13px;font-weight:500;color:${d<=2?NOM.ambar:NOM.tinta}">${t.titulo}</div>
              <div style="font-size:11px;color:#5F5E5A;margin-top:2px">${t.detalle} · ${d<=0?'toca hoy':'en '+d+' día(s)'}</div>
            </div>
            <button class="btn ${d<=2?'primary':'ghost'}" data-aplicar='${JSON.stringify({nombre:t.titulo, plan_id:t.plan_id})}' style="padding:8px 12px;font-size:12px;flex-shrink:0">Anotar</button>
          </div>
        </div>`
      }).join('')}
    </div>`:''}

    <div class="card">
      <h3 style="font-size:14px;margin:0 0 11px">Ya aplicado</h3>
      ${hechas.length ? hechas.map(h=>`<div class="row"><span style="font-size:12.5px">${h.nombre}<br><small class="muted">${formatearFecha(h.fecha)}${h.aves?` · ${h.aves} aves`:''}</small></span></div>`).join('')
        : estadoVacio('Todavía no se aplicó nada a este lote.')}
      <button class="btn ghost" id="btn_san_otro" style="width:100%;margin-top:11px">Anotar otra cosa</button>
    </div>`}`)

    campoEngancharVolver()
    document.querySelectorAll('[data-aplicar]').forEach(b=>b.onclick=()=>{
      try { form = JSON.parse(b.dataset.aplicar) } catch(e){ form = { nombre:'' } }
      dibujar()
    })
    const bo = document.querySelector('#btn_san_otro')
    if(bo) bo.onclick = ()=>{ form = { nombre:'' }; dibujar() }
    const bc = document.querySelector('#btn_san_cancelar')
    if(bc) bc.onclick = ()=>{ form = null; dibujar() }
    const bg = document.querySelector('#btn_san_guardar')
    if(bg) bg.onclick = async ()=>{
      const box = document.querySelector('#err_san')
      const nombre = document.querySelector('#san_nombre').value.trim()
      if(!nombre){ box.textContent='Poné qué se aplicó.'; box.style.display='block'; return }
      enviando = true
      const { data: r, error } = await supabase.rpc('campo_aplicar_sanidad', {
        p_lote_id: campoLoteSel, p_nombre: nombre, p_plan_id: form.plan_id || null,
        p_producto_id: document.querySelector('#san_producto').value || null,
        p_cantidad: Number(document.querySelector('#san_cant').value) || null,
        p_aves: Number(document.querySelector('#san_aves').value) || null,
        p_nota: document.querySelector('#san_nota').value.trim() || null
      })
      enviando = false
      if(error || !r?.ok){ box.textContent = r?.error||'No se pudo guardar.'; box.style.display='block'; return }
      mostrarAlerta(`Anotado. Quedó registrado para ${r.aves} aves.`)
      form = null; campoCat = null
      render()
    }
  }
  dibujar()
}

// ---- ENTRAN O SALEN AVES ----
async function campoAves(){
  const cat = await campoCargarCatalogos()
  const { data: det } = await supabase.rpc('campo_lote_detalle', { p_lote_id: campoLoteSel })
  let tipo = null, enviando = false
  const TIPOS = [
    ['muerte','Muertas','Se murieron','#B8641E'],
    ['descarte','Descarte','Salen del lote','#8A8570'],
    ['venta','Venta','Se vendieron','#5C7A99'],
    ['ingreso','Entran aves','Refuerzo del lote','#2F4D2A']
  ]

  const dibujar = ()=>{
    layout(`${campoHeader('Entran o salen aves')}
    <div class="card">
      <p class="muted" style="margin:0 0 12px;font-size:12px">${det?.lote?.nombre||''} · hoy hay <b>${det?.aves||0}</b> aves</p>
      ${TIPOS.map(([v,l,d,c])=>{
        const s = tipo === v
        return `<div data-tipo-mov="${v}" style="border:${s?`2px solid ${c}`:`1px solid ${NOM.borde}`};background:${s?NOM.fondo:NOM.superficie};border-radius:11px;padding:12px;margin-bottom:7px;cursor:pointer">
          <div style="display:flex;gap:11px;align-items:center">
            <span style="width:30px;height:30px;border-radius:9px;background:${c}1a;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico(v==='ingreso'?'mas':'cerrar',15,c)}</span>
            <div><div style="font-size:13px;font-weight:${s?'500':'400'};color:${NOM.tinta}">${l}</div>
            <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:1px">${d}</div></div>
          </div>
        </div>`
      }).join('')}

      ${tipo?`<div style="margin-top:12px">
        <div class="field"><label>¿Cuántas?</label><input id="mov_cant" type="number" inputmode="numeric" placeholder="0"/></div>
        ${tipo==='muerte'?`<div class="field"><label>¿Sabés por qué?</label>
          <select id="mov_motivo">
            <option value="">No sé</option>
            <option value="enfermedad">Enfermedad</option>
            <option value="predador">Predador</option>
            <option value="calor">Golpe de calor</option>
            <option value="frio">Frío</option>
            <option value="accidente">Accidente</option>
            <option value="otro">Otro</option>
          </select></div>`:''}
        ${tipo==='ingreso'&&(cat.razas||[]).length?`<div class="field"><label>¿De qué raza?</label>
          <select id="mov_raza"><option value="">No especificar</option>
          ${cat.razas.filter(r=>r.activa).map(r=>`<option value="${r.id}">${r.nombre}</option>`).join('')}</select></div>`:''}
        <div class="field"><label>Observación</label><input id="mov_nota"/></div>
        <div id="err_mov" class="alert danger" style="display:none"></div>
        <button class="btn primary" id="btn_mov" style="width:100%" ${enviando?'disabled':''}>${enviando?'Guardando…':'Guardar'}</button>
      </div>`:''}
    </div>`)

    campoEngancharVolver()
    document.querySelectorAll('[data-tipo-mov]').forEach(el=>el.onclick=()=>{ tipo = el.dataset.tipoMov; dibujar() })
    const btn = document.querySelector('#btn_mov')
    if(btn) btn.onclick = async ()=>{
      const box = document.querySelector('#err_mov')
      const cant = Number(document.querySelector('#mov_cant').value)
      if(!cant || cant<=0){ box.textContent='Poné cuántas aves.'; box.style.display='block'; return }
      enviando = true; dibujar()
      const { data: r, error } = await supabase.rpc('campo_movimiento_aves', {
        p_lote_id: campoLoteSel, p_tipo: tipo, p_cantidad: cant,
        p_motivo: document.querySelector('#mov_motivo')?.value || null,
        p_raza_id: document.querySelector('#mov_raza')?.value || null,
        p_nota: document.querySelector('#mov_nota')?.value.trim() || null
      })
      enviando = false
      if(error || !r?.ok){ dibujar(); const b=document.querySelector('#err_mov'); if(b){ b.textContent=r?.error||'No se pudo guardar.'; b.style.display='block' } return }
      mostrarAlerta(`Listo. El lote pasó de ${r.antes} a ${r.ahora} aves.`)
      current='campo'; render()
    }
  }
  dibujar()
}

// ---- GUÍA DE LA ETAPA ----
async function campoGuia(){
  const { data: det } = await supabase.rpc('campo_lote_detalle', { p_lote_id: campoLoteSel })
  const etapa = det?.etapa || {}
  const guia = Array.isArray(etapa.guia) ? etapa.guia : []
  layout(`${campoHeader('Guía de la etapa')}
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:13px">
      <div>
        <div style="font-size:15px;font-weight:500;color:${NOM.tinta}">${etapa.nombre||''}</div>
        <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">${det?.edad?.texto||''}</div>
      </div>
      <span style="background:${NOM.verdeClaro};color:${NOM.verde};font-size:11px;padding:5px 11px;border-radius:8px;white-space:nowrap">semana ${det?.edad?.semanas||0}</span>
    </div>
    ${guia.length ? guia.map((g,i)=>`<div style="display:flex;gap:11px;padding:9px 0${i<guia.length-1?`;border-bottom:1px solid ${NOM.borde}`:''}">
      ${ico('check',15,NOM.verde)}
      <div><div style="font-size:12.5px;color:${NOM.tinta}">${g.t||''}</div>
      <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px;line-height:1.45">${g.d||''}</div></div>
    </div>`).join('') : estadoVacio('Todavía no hay guía cargada para esta etapa.')}
  </div>`)
  campoEngancharVolver()
}

// ---- CÓMO VA EL LOTE ----
async function campoFicha(){
  const { data: det } = await supabase.rpc('campo_lote_detalle', { p_lote_id: campoLoteSel })
  if(!det?.ok){ current='campo'; return render() }
  const prod = (det.produccion||[]).slice(0,14).reverse()
  const pesos = (det.pesos||[]).slice(0,12).reverse()
  const ultima = (det.produccion||[])[0]

  layout(`${campoHeader('Cómo va el lote')}

  <div style="background:${NOM.verde};border-radius:16px;padding:15px;margin-bottom:9px">
    <div style="display:flex;gap:18px;flex-wrap:wrap">
      <div><div style="font-size:21px;font-weight:500;color:#F5EFE0;font-variant-numeric:tabular-nums">${det.aves}</div>
      <div style="font-size:10px;color:${NOM.verdePastel};margin-top:2px">aves vivas</div></div>
      <div><div style="font-size:21px;font-weight:500;color:#F5EFE0">${det.edad?.semanas||0}<span style="font-size:13px">+${det.edad?.resto_dias||0}</span></div>
      <div style="font-size:10px;color:${NOM.verdePastel};margin-top:2px">sem y días</div></div>
      <div><div style="font-size:21px;font-weight:500;color:#F5EFE0;font-variant-numeric:tabular-nums">${det.mortalidad_pct||0}%</div>
      <div style="font-size:10px;color:${NOM.verdePastel};margin-top:2px">mortalidad</div></div>
      ${ultima?.postura!=null?`<div><div style="font-size:21px;font-weight:500;color:#F5EFE0;font-variant-numeric:tabular-nums">${ultima.postura}%</div>
      <div style="font-size:10px;color:${NOM.verdePastel};margin-top:2px">postura</div></div>`:''}
    </div>
  </div>

  ${prod.length>1?`<div class="card">
    <h3 style="font-size:14px;margin:0 0 11px">Postura de los últimos días</h3>
    ${campoGrafico(prod.map(p=>Number(p.postura)||0), det.postura_esperada)}
    <p class="muted" style="margin:9px 0 0;font-size:11.5px">${det.postura_esperada?`La línea clara es lo esperado para la edad (${det.postura_esperada}%)`:'Todavía no hay referencia para esta edad'}</p>
  </div>`:''}

  ${pesos.length?`<div class="card">
    <h3 style="font-size:14px;margin:0 0 11px">Peso de las aves</h3>
    ${campoGrafico(pesos.map(p=>Number(p.peso_ave)||0), null)}
    <p class="muted" style="margin:9px 0 0;font-size:11.5px">Último: ${pesos[pesos.length-1]?.peso_ave||'-'} g</p>
  </div>`:''}

  ${det.razas?.length?`<div class="card">
    <h3 style="font-size:14px;margin:0 0 11px">De qué razas es</h3>
    ${det.razas.map(r=>`<div class="row"><span style="display:flex;gap:9px;align-items:center">
      <span style="width:13px;height:13px;border-radius:50%;background:${r.color};flex-shrink:0"></span>
      <span style="font-size:12.5px">${r.nombre}<br><small class="muted">huevo ${(r.color_huevo||'').toLowerCase()}</small></span></span>
      <b>${r.cantidad}</b></div>`).join('')}
  </div>`:''}

  ${(det.movimientos||[]).length?`<div class="card">
    <h3 style="font-size:14px;margin:0 0 11px">Movimientos de aves</h3>
    ${det.movimientos.slice(0,10).map(m=>`<div class="row"><span style="font-size:12.5px">${
      {muerte:'Muertas',descarte:'Descarte',venta:'Venta',ingreso:'Entraron'}[m.tipo]||m.tipo
    }<br><small class="muted">${formatearFecha(m.fecha)}${m.motivo?' · '+m.motivo:''}</small></span>
    <b style="color:${m.tipo==='ingreso'?NOM.verde:NOM.ambar}">${m.tipo==='ingreso'?'+':'−'}${m.cantidad}</b></div>`).join('')}
  </div>`:''}`)
  campoEngancharVolver()
}

function campoGrafico(valores, referencia){
  if(!valores || valores.length < 2) return ''
  const max = Math.max(...valores, referencia||0, 1) * 1.15
  const pts = valores.map((v,i)=>{
    const x = (i/(valores.length-1))*100
    const y = 100 - (v/max)*100
    return x.toFixed(1)+','+y.toFixed(1)
  }).join(' ')
  const refY = referencia ? (100 - (referencia/max)*100).toFixed(1) : null
  return `<div style="height:90px">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;display:block">
      ${refY!==null?`<line x1="0" y1="${refY}" x2="100" y2="${refY}" stroke="${NOM.verdePastel}" stroke-width="1.4" stroke-dasharray="3 2" vector-effect="non-scaling-stroke"/>`:''}
      <polyline points="${pts}" fill="none" stroke="${NOM.verde}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
    </svg>
  </div>`
}



// ============================================================
//  CUÁNTO TE CUESTA Y CUÁNTO TE DEJA
// ============================================================
let costeoDesde = null
let costeoHasta = null

function costeoPeriodo(){
  const hoy = new Date()
  if(!costeoDesde) costeoDesde = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0,10)
  if(!costeoHasta) costeoHasta = hoy.toISOString().slice(0,10)
  return { desde: costeoDesde, hasta: costeoHasta }
}

async function costoHuevo(){
  const p = costeoPeriodo()
  layout(`<div class="card">${skeletonBloque(4)}</div>`)
  const [{ data: c }, { data: m }] = await Promise.all([
    supabase.rpc('costo_por_huevo', { p_desde: p.desde, p_hasta: p.hasta }),
    supabase.rpc('margen_por_producto', { p_desde: p.desde, p_hasta: p.hasta })
  ])

  const items = (m?.items || []).map(x=>{
    const ingreso = Number(x.ingreso)||0
    const directo = Number(x.costo_directo)||0
    const bruto = ingreso - directo
    const partes = (m?.ventas_total||0) > 0 ? ingreso / m.ventas_total : 0
    const indirecto = ((Number(m?.gastos_reparto)||0) + (Number(m?.gastos_estructura)||0)) * partes
    const neto = bruto - indirecto
    return { ...x, ingreso, directo, bruto, indirecto, neto,
             pct: bruto > 0 ? Math.max(0, Math.min(100, Math.round((neto/bruto)*100))) : 0 }
  }).sort((a,b)=>b.neto - a.neto)

  const totIngreso = items.reduce((s,x)=>s+x.ingreso,0)
  const totBruto = items.reduce((s,x)=>s+x.bruto,0)
  const totNeto = items.reduce((s,x)=>s+x.neto,0)

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_costeo" style="padding:8px 11px">${ico('flechaIzq',16,NOM.verde)}</button>
    <h2 style="margin:0">Cuánto te cuesta</h2>
  </div>

  <div class="card">
    <div class="grid two">
      <div class="field" style="margin:0"><label>Desde</label><input id="cost_desde" type="date" value="${p.desde}"/></div>
      <div class="field" style="margin:0"><label>Hasta</label><input id="cost_hasta" type="date" value="${p.hasta}"/></div>
    </div>
    <button class="btn ghost" id="btn_cost_periodo" style="width:100%;margin-top:10px">Ver este período</button>
  </div>

  ${!c?.hay_datos ? `<div class="card" style="text-align:center;padding:26px 16px">
    ${ico('grafico',30,NOM.verdePastel)}
    <p style="margin:12px 0 0;font-size:14px;font-weight:500;color:${NOM.tinta}">Todavía no hay datos suficientes</p>
    <p style="margin:8px 0 0;font-size:12.5px;color:${NOM.tintaSuave};line-height:1.55">Para calcular el costo del huevo hacen falta dos cosas: producción cargada por Federico y gastos de producción en finanzas.</p>
    <div style="background:${NOM.fondo};border-radius:11px;padding:12px;margin-top:14px;text-align:left">
      <div class="row" style="border:0;padding:4px 0"><span style="font-size:12px;color:${NOM.tintaSuave}">Huevos buenos del período</span><span style="font-size:12.5px">${c?.buenos||0}</span></div>
      <div class="row" style="border:0;padding:4px 0"><span style="font-size:12px;color:${NOM.tintaSuave}">Gastos de producción</span><span style="font-size:12.5px">$${Number(c?.gastos_produccion||0).toLocaleString('es-AR')}</span></div>
    </div>
  </div>`
  : `
  <div style="background:${NOM.verde};border-radius:16px;padding:17px;margin-bottom:9px">
    <div style="font-size:11px;color:${NOM.verdePastel};letter-spacing:1px">PRODUCIR UN HUEVO TE CUESTA</div>
    <div style="font-size:30px;font-weight:500;color:#F5EFE0;font-variant-numeric:tabular-nums;line-height:1;margin-top:6px">$${Number(c.costo_producir).toLocaleString('es-AR')}</div>
    <div style="font-size:12px;color:${NOM.verdePastel};margin-top:8px;line-height:1.5">Solo lo del campo. Te sirve para decidir si conviene producir o comprarle a un granjero.</div>
  </div>

  <div class="card" style="border:2px solid ${NOM.verde}">
    <div style="font-size:11px;color:${NOM.tintaSuave};letter-spacing:1px">PONERLO EN LA PUERTA DEL CLIENTE</div>
    <div style="font-size:30px;font-weight:500;color:${NOM.verde};font-variant-numeric:tabular-nums;line-height:1;margin-top:6px">$${Number(c.costo_completo).toLocaleString('es-AR')}</div>
    <div style="font-size:12px;color:${NOM.tintaSuave};margin-top:8px;line-height:1.5">Todo incluido. Este es el número contra el que hay que mirar tus precios.</div>
  </div>

  <div class="card">
    <h3 style="font-size:14px;margin:0 0 11px">Cómo se llega a ese número</h3>
    <div class="row"><span class="muted" style="font-size:12px">Huevos recolectados</span><span>${Number(c.recolectados).toLocaleString('es-AR')}</span></div>
    <div class="row"><span class="muted" style="font-size:12px">Rotos y mermas</span><span style="color:${NOM.ambar}">−${Number(c.rotos).toLocaleString('es-AR')}</span></div>
    <div class="row"><span style="font-size:12.5px;font-weight:500">Huevos buenos</span><span style="font-weight:500">${Number(c.buenos).toLocaleString('es-AR')}</span></div>
    <div style="height:9px"></div>
    <div class="row"><span class="muted" style="font-size:12px">Gastos de producción</span><span>$${Number(c.gastos_produccion).toLocaleString('es-AR')}</span></div>
    <div class="row"><span class="muted" style="font-size:12px">Gastos de reparto</span><span>$${Number(c.gastos_reparto).toLocaleString('es-AR')}</span></div>
    <div class="row"><span class="muted" style="font-size:12px">Gastos de estructura</span><span>$${Number(c.gastos_estructura).toLocaleString('es-AR')}</span></div>
    ${c.entregas>0?`<div class="row"><span style="font-size:12.5px">Cada entrega cuesta</span><span style="font-weight:500">$${Number(c.costo_por_entrega).toLocaleString('es-AR')}</span></div>`:''}
  </div>

  ${c.comprados>0?`<div class="card">
    <h3 style="font-size:14px;margin:0 0 11px">Huevo comprado a otros</h3>
    <div class="row"><span class="muted" style="font-size:12px">Cantidad</span><span>${Number(c.comprados).toLocaleString('es-AR')}</span></div>
    <div class="row"><span class="muted" style="font-size:12px">Te costó</span><span>$${Number(c.costo_comprados).toLocaleString('es-AR')}</span></div>
    <div class="row"><span style="font-size:12.5px;font-weight:500">Cada huevo</span><span style="font-weight:500">$${Number(c.costo_huevo_comprado).toLocaleString('es-AR')}</span></div>
    ${c.costo_producir && c.costo_huevo_comprado ? `<div style="background:${Number(c.costo_huevo_comprado) < Number(c.costo_producir) ? '#FBE9D4' : NOM.verdeClaro};border-radius:10px;padding:11px;margin-top:10px">
      <div style="font-size:11.5px;color:${Number(c.costo_huevo_comprado) < Number(c.costo_producir) ? NOM.ambar : '#5F5E5A'};line-height:1.5">${
        Number(c.costo_huevo_comprado) < Number(c.costo_producir)
        ? 'Comprar te sale más barato que producir. Conviene revisar el lote.'
        : 'Producir te sale más barato que comprar. Vas bien.'}</div>
    </div>`:''}
  </div>`:''}

  ${items.length?`
  <div style="background:${NOM.verde};border-radius:16px;padding:16px;margin-bottom:9px">
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:10px;border-bottom:1px solid rgba(247,244,236,0.2)">
      <span style="font-size:11px;color:${NOM.verdePastel}">GANANCIA BRUTA</span>
      <span style="font-size:21px;font-weight:500;color:#F5EFE0;font-variant-numeric:tabular-nums">$${Math.round(totBruto).toLocaleString('es-AR')}</span>
    </div>
    <div style="padding:10px 0;border-bottom:1px solid rgba(247,244,236,0.2)">
      <div style="display:flex;justify-content:space-between;padding:2px 0"><span style="font-size:11.5px;color:${NOM.verdePastel}">Reparto</span><span style="font-size:12px;color:#F5EFE0">−$${Number(m.gastos_reparto||0).toLocaleString('es-AR')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:2px 0"><span style="font-size:11.5px;color:${NOM.verdePastel}">Estructura</span><span style="font-size:12px;color:#F5EFE0">−$${Number(m.gastos_estructura||0).toLocaleString('es-AR')}</span></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding-top:10px">
      <span style="font-size:11px;color:${NOM.verdePastel}">TE QUEDÓ</span>
      <span style="font-size:26px;font-weight:500;color:#F5EFE0;font-variant-numeric:tabular-nums">$${Math.round(totNeto).toLocaleString('es-AR')}</span>
    </div>
    ${totIngreso>0?`<div style="background:rgba(247,244,236,0.12);border-radius:10px;padding:11px;margin-top:11px">
      <div style="font-size:11.5px;color:#F5EFE0">De cada $100 que vendés, te quedan <b>$${Math.round((totNeto/totIngreso)*100)}</b>.</div>
    </div>`:''}
  </div>

  <div class="card">
    <h3 style="font-size:14px;margin:0 0 11px">Qué te deja cada producto</h3>
    ${items.map((x,i)=>{
      const col = x.pct >= 40 ? NOM.verde : NOM.ambar
      const claro = x.pct >= 40 ? NOM.verdePastel : '#F0D9BC'
      return `<div style="padding:10px 0${i<items.length-1?`;border-bottom:1px solid ${NOM.borde}`:''}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:500;color:${NOM.tinta}">${x.nombre}</div>
            <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px">${x.unidades} maple(s) · ${x.canal}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:13.5px;font-weight:500;color:${col};font-variant-numeric:tabular-nums">$${Math.round(x.neto).toLocaleString('es-AR')}</div>
            <div style="font-size:10.5px;color:${NOM.tintaSuave};margin-top:1px">de $${Math.round(x.bruto).toLocaleString('es-AR')} bruto</div>
          </div>
        </div>
        <div style="height:6px;background:#F1EFE8;border-radius:3px;margin-top:7px;overflow:hidden;display:flex">
          <span style="width:${x.pct}%;background:${col}"></span>
          <span style="width:${100-x.pct}%;background:${claro}"></span>
        </div>
        ${x.pct < 25 ? `<div style="font-size:11px;color:${NOM.ambar};margin-top:6px">Vendés pero te queda poco: los gastos se llevan casi todo.</div>`:''}
      </div>`
    }).join('')}
    <div style="background:${NOM.fondo};border-radius:10px;padding:11px;margin-top:11px">
      <div style="font-size:11.5px;color:${NOM.tintaSuave};line-height:1.5">La parte oscura de la barra es lo que te queda limpio. La clara es lo que se comen los gastos.</div>
    </div>
  </div>`:''}`}`)

  document.querySelector('#btn_volver_costeo').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
  document.querySelector('#btn_cost_periodo').onclick = ()=>{
    costeoDesde = document.querySelector('#cost_desde').value
    costeoHasta = document.querySelector('#cost_hasta').value
    render()
  }
}

// ============================================================
//  ZONAS DE REPARTO
// ============================================================
const DIAS_REPARTO = [[1,'Lunes'],[2,'Martes'],[3,'Miércoles'],[4,'Jueves'],[5,'Viernes'],[6,'Sábado']]
const COLORES_ZONA = ['#2F4D2A','#B8641E','#5C7A99','#7A5C99','#4A7C59','#A3564A']

async function zonasReparto(){
  const { data } = await supabase.rpc('admin_zonas', {})
  const zonas = data?.zonas || []
  const sinZona = data?.sin_zona || []
  const diaFijo = data?.dia_fijo || false
  let form = null

  const dibujar = ()=>{
    layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <button class="btn ghost" id="btn_volver_zonas" style="padding:8px 11px">${ico('flechaIzq',16,NOM.verde)}</button>
      <h2 style="margin:0">Zonas de reparto</h2>
    </div>

    ${form ? `<div class="card">
      <h3 style="font-size:15px;margin:0 0 12px">${form.id?'Editar zona':'Nueva zona'}</h3>
      <div class="field"><label>Nombre *</label><input id="zn_nombre" value="${form.nombre||''}" placeholder="Ej: Norte"/></div>
      <div class="field"><label>Día de reparto</label>
        <div class="grid three">
          <button type="button" class="btn ${form.dia==null?'primary':'ghost'}" data-zdia="" style="font-size:12px">Sin día</button>
          ${DIAS_REPARTO.map(([v,l])=>`<button type="button" class="btn ${form.dia===v?'primary':'ghost'}" data-zdia="${v}" style="font-size:12px">${l}</button>`).join('')}
        </div>
      </div>
      <div class="field"><label>Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${COLORES_ZONA.map(c=>`<button type="button" data-zcolor="${c}" style="width:38px;height:38px;border-radius:11px;background:${c};border:${form.color===c?'3px solid '+NOM.tinta:'1px solid rgba(0,0,0,.1)'};cursor:pointer"></button>`).join('')}
        </div>
      </div>
      <div class="field"><label>Barrios de esta zona *</label>
        <textarea id="zn_barrios" rows="4" placeholder="Uno por línea:&#10;Alberdi&#10;Belgrano&#10;Arroyito">${(form.barrios||[]).join('\n')}</textarea>
        <p class="muted" style="margin:6px 0 0;font-size:11.5px">Escribí un barrio por línea. No importan las mayúsculas ni los acentos.</p>
      </div>
      <div id="err_zona" class="alert danger" style="display:none"></div>
      ${pBtnRow([pBtn('','Guardar','id="btn_zona_guardar"','primary'), pBtn('','Cancelar','id="btn_zona_cancelar"','ghost')])}
    </div>`
    : `
    ${sinZona.length?`<div style="background:#FBE9D4;border-radius:14px;padding:14px;margin-bottom:9px">
      <div style="display:flex;gap:10px;align-items:flex-start">
        ${ico('aviso',17,NOM.ambar)}
        <div style="flex:1">
          <div style="font-size:12.5px;color:${NOM.ambar};font-weight:500">Barrios sin zona</div>
          <div style="font-size:11.5px;color:#5F5E5A;margin-top:5px;line-height:1.5">${sinZona.map(x=>`${x.barrio} (${x.clientes})`).join(' · ')}</div>
        </div>
      </div>
    </div>`:''}

    ${zonas.length ? zonas.map(z=>`<div class="card" style="border-left:3px solid ${z.color};border-radius:0 16px 16px 0">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px">
        <div>
          <div style="font-size:15px;font-weight:500;color:${NOM.tinta}">${z.nombre}</div>
          <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:3px">${z.clientes} cliente(s)</div>
        </div>
        <span style="background:${z.color}1a;color:${z.color};font-size:11.5px;font-weight:500;padding:5px 12px;border-radius:8px;white-space:nowrap">${z.dia?(DIAS_REPARTO.find(d=>d[0]===z.dia)||[])[1]:'sin día'}</span>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap">
        ${(z.barrios||[]).map(b=>`<span style="background:${NOM.fondo};color:${NOM.tinta};font-size:11.5px;padding:5px 10px;border-radius:8px">${b}</span>`).join('')}
      </div>
      ${pBtnRow([pBtn('','Editar',`data-editar-zona="${z.id}"`,'ghost'), pBtn('','Borrar',`data-borrar-zona="${z.id}"`,'ghost')])}
    </div>`).join('') : estadoVacio('Todavía no creaste zonas.')}

    <button class="btn primary" id="btn_zona_nueva" style="width:100%;margin-bottom:12px">Crear una zona</button>

    <div class="card">
      <h3 style="font-size:14px;margin:0 0 9px">Agendar por día de zona</h3>
      <p class="muted" style="margin:0 0 12px;font-size:12px;line-height:1.55">${diaFijo
        ? 'Está activo: los pedidos toman la fecha del día que le toca a la zona del cliente.'
        : 'Está apagado: la fecha se calcula por capacidad de huevos, como hasta ahora. Conviene activarlo cuando tengas volumen.'}</p>
      <button class="btn ${diaFijo?'ghost':'primary'}" id="btn_dia_fijo" style="width:100%">${diaFijo?'Volver a agendar por capacidad':'Activar el día fijo por zona'}</button>
    </div>`}`)

    document.querySelector('#btn_volver_zonas').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
    const bn = document.querySelector('#btn_zona_nueva')
    if(bn) bn.onclick = ()=>{ form = { color: COLORES_ZONA[zonas.length % COLORES_ZONA.length], barrios:[] }; dibujar() }

    document.querySelectorAll('[data-editar-zona]').forEach(b=>b.onclick=()=>{
      const z = zonas.find(x=>x.id===b.dataset.editarZona)
      form = { id:z.id, nombre:z.nombre, dia:z.dia, color:z.color, barrios:z.barrios||[] }
      dibujar()
    })
    document.querySelectorAll('[data-borrar-zona]').forEach(b=>b.onclick=async()=>{
      const ok = await mostrarConfirmacion('¿Borrar esta zona? Los barrios quedan sin asignar.')
      if(!ok) return
      await supabase.rpc('admin_borrar_zona', { p_id: b.dataset.borrarZona })
      render()
    })
    document.querySelectorAll('[data-zdia]').forEach(b=>b.onclick=()=>{
      form.nombre = document.querySelector('#zn_nombre').value
      form.barrios = document.querySelector('#zn_barrios').value.split('\n').map(x=>x.trim()).filter(Boolean)
      form.dia = b.dataset.zdia ? Number(b.dataset.zdia) : null
      dibujar()
    })
    document.querySelectorAll('[data-zcolor]').forEach(b=>b.onclick=()=>{
      form.nombre = document.querySelector('#zn_nombre').value
      form.barrios = document.querySelector('#zn_barrios').value.split('\n').map(x=>x.trim()).filter(Boolean)
      form.color = b.dataset.zcolor
      dibujar()
    })
    const bc = document.querySelector('#btn_zona_cancelar')
    if(bc) bc.onclick = ()=>{ form = null; dibujar() }
    const bg = document.querySelector('#btn_zona_guardar')
    if(bg) bg.onclick = async ()=>{
      const box = document.querySelector('#err_zona')
      const nombre = document.querySelector('#zn_nombre').value.trim()
      const barrios = document.querySelector('#zn_barrios').value.split('\n').map(x=>x.trim()).filter(Boolean)
      if(!nombre){ box.textContent='Ponele un nombre a la zona.'; box.style.display='block'; return }
      if(!barrios.length){ box.textContent='Poné al menos un barrio.'; box.style.display='block'; return }
      const { data: r, error } = await supabase.rpc('admin_guardar_zona', {
        p_id: form.id || null, p_nombre: nombre, p_dia: form.dia ?? null,
        p_color: form.color, p_canal: 'ambos', p_barrios: barrios
      })
      if(error || !r?.ok){ box.textContent = r?.error || 'No se pudo guardar.'; box.style.display='block'; return }
      form = null
      render()
    }
    const bf = document.querySelector('#btn_dia_fijo')
    if(bf) bf.onclick = async ()=>{
      const { data: r } = await supabase.rpc('admin_toggle_dia_fijo', { p_activo: !diaFijo })
      if(!r?.ok){ mostrarAlerta(r?.error || 'No se pudo cambiar.'); return }
      mostrarAlerta(r.activo ? 'Listo. Los pedidos ahora se agendan por el día de cada zona.' : 'Volvió a agendarse por capacidad.')
      render()
    }
  }
  dibujar()
}

// ---- Clasificar categorías de gasto ----
async function categoriasCosto(){
  const { data } = await supabase.rpc('admin_categorias_costo', {})
  const cats = data?.categorias || []
  const GRUPOS_COSTO = [
    ['produccion','Producción','Lo del campo: alimento, sanidad, empaque'],
    ['reparto','Reparto','Llevar el pedido: nafta, peajes, vehículo'],
    ['estructura','Estructura','Fijos del negocio: contador, impuestos'],
    ['reventa','Reventa','Mercadería que comprás para revender'],
    ['ninguno','No entra','No cuenta para el costo']
  ]

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_cats" style="padding:8px 11px">${ico('flechaIzq',16,NOM.verde)}</button>
    <h2 style="margin:0">Qué es cada gasto</h2>
  </div>
  <div class="card"><p class="muted" style="margin:0;font-size:12.5px;line-height:1.55">Esto define cómo se calcula el costo del huevo y el margen de cada producto. Se hace una vez y después es automático.</p></div>

  ${GRUPOS_COSTO.map(([g,titulo,desc])=>{
    const propias = cats.filter(c=>c.grupo===g)
    return `<div class="card">
      <div style="margin-bottom:11px">
        <div style="font-size:14px;font-weight:500;color:${NOM.tinta}">${titulo}</div>
        <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">${desc}</div>
      </div>
      ${propias.length ? propias.map(c=>`<div class="row">
        <span style="font-size:12.5px">${c.nombre}${c.movimientos?`<br><small class="muted">${c.movimientos} movimiento(s)</small>`:''}</span>
        <select data-cat-grupo="${c.id}" style="width:auto;font-size:12px;padding:6px 8px">
          ${GRUPOS_COSTO.map(([v,l])=>`<option value="${v}" ${c.grupo===v?'selected':''}>${l}</option>`).join('')}
        </select>
      </div>`).join('') : `<p class="muted" style="margin:0;font-size:12px">Ninguna categoría acá.</p>`}
    </div>`
  }).join('')}`)

  document.querySelector('#btn_volver_cats').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
  document.querySelectorAll('[data-cat-grupo]').forEach(sel=>sel.onchange=async()=>{
    const { data: r } = await supabase.rpc('admin_clasificar_categoria', {
      p_id: sel.dataset.catGrupo, p_grupo: sel.value
    })
    if(!r?.ok){ mostrarAlerta(r?.error || 'No se pudo guardar.'); return }
    render()
  })
}

// ============================================================
//  CAMPO — LO QUE CONFIGURA GASTÓN
// ============================================================

async function adminCampo(){
  const secciones = [
    ['lotes','huevo','Lotes','Dar de alta un lote con sus razas'],
    ['parcelas','mapa','Parcelas','Nombre, medidas y descanso mínimo'],
    ['razas','estrella','Razas','Color del huevo y cuánto ponen'],
    ['insumos','canasta','Insumos','Alimento, sanidad y sus proveedores'],
    ['sanitario','planilla','Plan sanitario','Qué vacuna a qué semana'],
    ['descanso','calendario','Descanso por mes','Cuánto descansa el pasto según la época']
  ]
  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_admcampo" style="padding:8px 11px">${ico('flechaIzq',16,NOM.verde)}</button>
    <h2 style="margin:0">El campo</h2>
  </div>
  <div class="card"><p class="muted" style="margin:0;font-size:12.5px;line-height:1.55">Todo lo que Federico usa desde el teléfono se configura acá. Es editable en cualquier momento.</p></div>
  ${secciones.map(x=>`<div class="card" style="margin-bottom:7px;cursor:pointer" data-adm-campo="${x[0]}">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:11px">
      <div style="display:flex;gap:11px;align-items:center;flex:1;min-width:0">
        <span style="width:32px;height:32px;border-radius:10px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico(x[1],16,NOM.verde)}</span>
        <div style="min-width:0"><div style="font-size:13px;font-weight:500;color:${NOM.tinta}">${x[2]}</div>
        <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:1px">${x[3]}</div></div>
      </div>${ico('flecha',15,'#C9C4B4')}
    </div>
  </div>`).join('')}`)

  document.querySelector('#btn_volver_admcampo').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
  document.querySelectorAll('[data-adm-campo]').forEach(b=>b.onclick=()=>{ current='adm-campo-'+b.dataset.admCampo; render() })
}

function admCampoHeader(titulo){
  return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_admcampo_volver" style="padding:8px 11px">${ico('flechaIzq',16,NOM.verde)}</button>
    <h2 style="margin:0;font-size:19px">${titulo}</h2>
  </div>`
}
function admCampoVolver(){
  const b = document.querySelector('#btn_admcampo_volver')
  if(b) b.onclick = ()=>{ current='adm-campo'; render() }
}

// ---- LOTES ----
async function admCampoLotes(){
  const [{ data: res }, cat] = await Promise.all([
    supabase.rpc('campo_resumen', {}),
    campoCargarCatalogos()
  ])
  const lotes = res?.lotes || []
  const razas = (cat.razas||[]).filter(r=>r.activa)
  let form = null

  const dibujar = ()=>{
    layout(`${admCampoHeader('Lotes')}
    ${form ? `<div class="card">
      <h3 style="font-size:15px;margin:0 0 12px">${form.id?'Editar lote':'Nuevo lote'}</h3>
      <div class="field"><label>Nombre *</label><input id="lt_nombre" value="${form.nombre||''}" placeholder="Ej: Lote 1"/></div>
      <div class="grid two">
        <div class="field"><label>Fecha que entraron *</label><input id="lt_fecha" type="date" value="${form.fecha||new Date().toISOString().slice(0,10)}"/></div>
        <div class="field"><label>Edad al entrar (días)</label><input id="lt_edad" type="number" inputmode="numeric" value="${form.edad??1}"/></div>
      </div>
      <p class="muted" style="margin:-4px 0 12px;font-size:11.5px">Si entran como pollitas BB poné 1. Si comprás pollonas de 16 semanas, poné 112.</p>

      <div class="field"><label>¿Cuántas de cada raza? *</label>
        ${razas.map(r=>`<div class="row"><span style="display:flex;gap:9px;align-items:center">
          <span style="width:13px;height:13px;border-radius:50%;background:${r.color_hex};flex-shrink:0"></span>
          <span style="font-size:12.5px">${r.nombre}<br><small class="muted">huevo ${(r.color_huevo||'').toLowerCase()}${r.huevos_por_ano?` · ${r.huevos_por_ano}/año`:''}</small></span></span>
          <input type="number" inputmode="numeric" id="lt_raza_${r.id}" value="${form.razas?.[r.id]||''}" placeholder="0" style="width:78px;text-align:center"/>
        </div>`).join('')}
      </div>
      <div class="field"><label>Notas</label><input id="lt_notas" value="${form.notas||''}"/></div>
      <div id="err_lote" class="alert danger" style="display:none"></div>
      ${pBtnRow([pBtn('','Guardar','id="btn_lote_guardar"','primary'), pBtn('','Cancelar','id="btn_lote_cancelar"','ghost')])}
    </div>`
    : `${lotes.length ? lotes.map(l=>`<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
          <div>
            <div style="font-size:15px;font-weight:500;color:${NOM.tinta}">${l.nombre}</div>
            <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:3px">${l.edad?.texto||''} · ${l.aves} de ${l.aves_iniciales} aves</div>
            <div style="font-size:11.5px;color:${NOM.verde};margin-top:2px">${l.etapa?.nombre||''}${l.postura_esperada?` · esperan ${l.postura_esperada}% de postura`:''}</div>
          </div>
          <span style="background:${NOM.verdeClaro};color:${NOM.verde};font-size:10.5px;padding:4px 9px;border-radius:6px;white-space:nowrap">${l.mortalidad_pct||0}% mort.</span>
        </div>
        ${l.razas?.length?`<div style="display:flex;gap:5px;margin-top:10px;flex-wrap:wrap">
          ${l.razas.map(r=>`<span style="display:flex;align-items:center;gap:5px;background:${NOM.fondo};border-radius:7px;padding:4px 9px">
            <span style="width:9px;height:9px;border-radius:50%;background:${r.color}"></span>
            <span style="font-size:11px;color:${NOM.tinta}">${r.nombre} ${r.cantidad}</span></span>`).join('')}
        </div>`:''}
        <button class="btn ghost" data-editar-lote="${l.id}" style="width:100%;margin-top:11px">Editar</button>
      </div>`).join('') : estadoVacio('Todavía no cargaste ningún lote.')}
      ${razas.length?`<button class="btn primary" id="btn_lote_nuevo" style="width:100%">Dar de alta un lote</button>`
        :`<div class="card"><p class="muted" style="margin:0;font-size:12.5px">Primero cargá al menos una raza.</p></div>`}`}`)

    admCampoVolver()
    const bn = document.querySelector('#btn_lote_nuevo')
    if(bn) bn.onclick = ()=>{ form = { razas:{} }; dibujar() }
    document.querySelectorAll('[data-editar-lote]').forEach(b=>b.onclick=()=>{
      const l = lotes.find(x=>x.id===b.dataset.editarLote)
      const rz = {}
      ;(l.razas||[]).forEach(r=>{ const m = razas.find(x=>x.nombre===r.nombre); if(m) rz[m.id] = r.cantidad })
      form = { id:l.id, nombre:l.nombre, fecha:l.fecha_ingreso, edad:1, razas:rz }
      dibujar()
    })
    const bc = document.querySelector('#btn_lote_cancelar')
    if(bc) bc.onclick = ()=>{ form = null; dibujar() }
    const bg = document.querySelector('#btn_lote_guardar')
    if(bg) bg.onclick = async ()=>{
      const box = document.querySelector('#err_lote')
      const nombre = document.querySelector('#lt_nombre').value.trim()
      const fecha = document.querySelector('#lt_fecha').value
      if(!nombre){ box.textContent='Ponele un nombre al lote.'; box.style.display='block'; return }
      if(!fecha){ box.textContent='Poné la fecha en que entraron.'; box.style.display='block'; return }
      const arr = razas.map(r=>({ raza_id:r.id, cantidad: Number(document.querySelector('#lt_raza_'+r.id).value)||0 })).filter(x=>x.cantidad>0)
      if(!arr.length){ box.textContent='Poné cuántas aves de al menos una raza.'; box.style.display='block'; return }
      const { data, error } = await supabase.rpc('admin_guardar_lote', {
        p_id: form.id || null, p_nombre: nombre, p_fecha_ingreso: fecha,
        p_edad_ingreso_dias: Number(document.querySelector('#lt_edad').value) || 1,
        p_razas: arr, p_notas: document.querySelector('#lt_notas').value.trim() || null
      })
      if(error || !data?.ok){ box.textContent = data?.error || 'No se pudo guardar.'; box.style.display='block'; return }
      mostrarAlerta(`Lote guardado con ${data.aves} aves.`)
      form = null; campoCat = null
      render()
    }
  }
  dibujar()
}

// ---- PARCELAS ----
async function admCampoParcelas(){
  const { data } = await supabase.rpc('campo_parcelas', {})
  const parcelas = data?.parcelas || []
  let form = null

  const dibujar = ()=>{
    const sup = form && Number(form.largo) > 0 && Number(form.ancho) > 0 ? Math.round(form.largo * form.ancho * 10)/10 : null
    layout(`${admCampoHeader('Parcelas')}
    ${form ? `<div class="card">
      <h3 style="font-size:15px;margin:0 0 12px">${form.id?'Editar parcela':'Nueva parcela'}</h3>
      <div class="field"><label>Nombre *</label><input id="pc_nombre" value="${form.nombre||''}" placeholder="Ej: Parcela norte"/></div>
      <div class="grid two">
        <div class="field"><label>Largo (metros)</label><input id="pc_largo" type="number" inputmode="decimal" value="${form.largo||''}"/></div>
        <div class="field"><label>Ancho (metros)</label><input id="pc_ancho" type="number" inputmode="decimal" value="${form.ancho||''}"/></div>
      </div>
      ${sup?`<div style="background:${NOM.verdeClaro};border-radius:11px;padding:12px;margin-bottom:12px">
        <div style="font-size:12.5px;color:#5F5E5A">Son <b>${sup.toLocaleString('es-AR')} m²</b>${data?.aves_totales?` · con ${data.aves_totales} aves te dan ${(sup/data.aves_totales).toFixed(2)} m² por ave` : ''}</div>
        ${data?.aves_totales && (sup/data.aves_totales) < 4 ? `<div style="font-size:11.5px;color:${NOM.ambar};margin-top:6px">En pastoreo se recomiendan al menos 4 m² por ave para que el pasto se sostenga.</div>`:''}
      </div>`:''}
      <div class="field"><label>Días mínimos de descanso</label><input id="pc_descanso" type="number" inputmode="numeric" value="${form.descanso??21}"/></div>
      <div class="field"><label>Tipo de pastura</label><input id="pc_pastura" value="${form.pastura||''}" placeholder="Ej: alfalfa, pasto natural"/></div>
      <div class="field"><label>Notas</label><input id="pc_notas" value="${form.notas||''}" placeholder="Ej: la tranquera se traba"/></div>
      <div id="err_parcela" class="alert danger" style="display:none"></div>
      ${pBtnRow([pBtn('','Guardar','id="btn_parcela_guardar"','primary'), pBtn('','Cancelar','id="btn_parcela_cancelar"','ghost')])}
    </div>`
    : `${data?.superficie_total?`<div class="card">
        <div class="grid two">
          <div><div style="font-size:11px;color:${NOM.tintaSuave}">Superficie total</div>
          <div style="font-size:19px;font-weight:500;font-variant-numeric:tabular-nums">${Number(data.superficie_total).toLocaleString('es-AR')} m²</div></div>
          <div><div style="font-size:11px;color:${NOM.tintaSuave}">Movimientos este mes</div>
          <div style="font-size:19px;font-weight:500;font-variant-numeric:tabular-nums">${data.movimientos_mes||0}</div></div>
        </div>
      </div>`:''}
      ${parcelas.length ? parcelas.map(p=>`<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
          <div>
            <div style="font-size:14px;font-weight:500;color:${NOM.tinta}">${p.nombre}</div>
            <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:3px">${p.largo&&p.ancho?`${p.largo} × ${p.ancho} m · `:''}${p.superficie?Number(p.superficie).toLocaleString('es-AR')+' m²':'sin medidas'}${p.m2_por_ave?` · ${p.m2_por_ave} m²/ave`:''}</div>
            <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px">Descanso mínimo ${p.descanso_minimo} días${p.veces_usada?` · usada ${p.veces_usada} vez(ces)`:''}</div>
          </div>
          <span style="background:${p.ocupada?NOM.verdeClaro:NOM.fondo};color:${p.ocupada?NOM.verde:NOM.tintaSuave};font-size:10.5px;padding:4px 9px;border-radius:6px;white-space:nowrap">${p.ocupada?'con el carro':(p.nunca_usada?'sin usar':p.descanso_dias+' días')}</span>
        </div>
        ${pBtnRow([pBtn('','Editar',`data-editar-parcela="${p.id}"`,'ghost'), pBtn('','Borrar',`data-borrar-parcela="${p.id}"`,'ghost')])}
      </div>`).join('') : estadoVacio('Todavía no cargaste parcelas.')}
      <button class="btn primary" id="btn_parcela_nueva" style="width:100%">Crear una parcela</button>`}`)

    admCampoVolver()
    const bn = document.querySelector('#btn_parcela_nueva')
    if(bn) bn.onclick = ()=>{ form = {}; dibujar() }
    document.querySelectorAll('[data-editar-parcela]').forEach(b=>b.onclick=()=>{
      const p = parcelas.find(x=>x.id===b.dataset.editarParcela)
      form = { id:p.id, nombre:p.nombre, largo:p.largo, ancho:p.ancho, descanso:p.descanso_minimo, pastura:p.pastura }
      dibujar()
    })
    document.querySelectorAll('[data-borrar-parcela]').forEach(b=>b.onclick=async()=>{
      const ok = await mostrarConfirmacion('¿Borrar esta parcela?')
      if(!ok) return
      const { data: r } = await supabase.rpc('admin_borrar_parcela', { p_id: b.dataset.borrarParcela })
      if(r?.mensaje) mostrarAlerta(r.mensaje)
      render()
    })
    const bc = document.querySelector('#btn_parcela_cancelar')
    if(bc) bc.onclick = ()=>{ form = null; dibujar() }
    ;['pc_largo','pc_ancho'].forEach(id=>{
      const el = document.querySelector('#'+id)
      if(el) el.oninput = ()=>{
        form.largo = Number(document.querySelector('#pc_largo').value) || null
        form.ancho = Number(document.querySelector('#pc_ancho').value) || null
        form.nombre = document.querySelector('#pc_nombre').value
        dibujar()
      }
    })
    const bg = document.querySelector('#btn_parcela_guardar')
    if(bg) bg.onclick = async ()=>{
      const box = document.querySelector('#err_parcela')
      const nombre = document.querySelector('#pc_nombre').value.trim()
      if(!nombre){ box.textContent='Ponele un nombre.'; box.style.display='block'; return }
      const { data: r, error } = await supabase.rpc('admin_guardar_parcela', {
        p_id: form.id || null, p_nombre: nombre,
        p_largo: Number(document.querySelector('#pc_largo').value) || null,
        p_ancho: Number(document.querySelector('#pc_ancho').value) || null,
        p_superficie: null,
        p_descanso: Number(document.querySelector('#pc_descanso').value) || 21,
        p_pastura: document.querySelector('#pc_pastura').value.trim() || null,
        p_notas: document.querySelector('#pc_notas').value.trim() || null
      })
      if(error || !r?.ok){ box.textContent = r?.error || 'No se pudo guardar.'; box.style.display='block'; return }
      form = null; campoCat = null
      render()
    }
  }
  dibujar()
}


// ---- RAZAS ----
async function admCampoRazas(){
  const cat = await campoCargarCatalogos()
  const razas = cat.razas || []
  let form = null
  const COLORES = [
    ['Marrón','#B5763F'],['Marrón oscuro','#9C5F33'],['Blanco','#EFEADC'],
    ['Azul verdoso','#8FB3B0'],['Chocolate','#6B4226'],['Crema','#E8D9BC'],['Rosado','#DCBCA8']
  ]

  const dibujar = ()=>{
    layout(`${admCampoHeader('Razas')}
    ${form ? `<div class="card">
      <h3 style="font-size:15px;margin:0 0 12px">${form.id?'Editar raza':'Nueva raza'}</h3>
      <div class="field"><label>Nombre *</label><input id="rz_nombre" value="${form.nombre||''}"/></div>
      <div class="field"><label>Color del huevo</label>
        <div class="grid two">
          ${COLORES.map(([l,h])=>`<button type="button" class="btn ${form.color_hex===h?'primary':'ghost'}" data-color="${h}" data-label="${l}" style="text-align:left;padding:11px 12px">
            <span style="display:flex;gap:9px;align-items:center">
              <span style="width:15px;height:15px;border-radius:50%;background:${h};border:1px solid rgba(0,0,0,.12);flex-shrink:0"></span>
              <span style="font-size:12.5px">${l}</span></span></button>`).join('')}
        </div>
      </div>
      <div class="field"><label>Huevos por año (aproximado)</label><input id="rz_huevos" type="number" inputmode="numeric" value="${form.huevos||''}" placeholder="Ej: 320"/>
        <p class="muted" style="margin:6px 0 0;font-size:11.5px">Sirve para estimar la postura esperada. Lo dice el criadero.</p>
      </div>
      <div id="err_raza" class="alert danger" style="display:none"></div>
      ${pBtnRow([pBtn('','Guardar','id="btn_raza_guardar"','primary'), pBtn('','Cancelar','id="btn_raza_cancelar"','ghost')])}
    </div>`
    : `${razas.length ? razas.map(r=>`<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:11px">
          <div style="display:flex;gap:11px;align-items:center;flex:1;min-width:0">
            <span style="width:26px;height:26px;border-radius:50%;background:${r.color_hex};border:1px solid rgba(0,0,0,.1);flex-shrink:0"></span>
            <div style="min-width:0">
              <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta}${r.activa?'':';opacity:.55'}">${r.nombre}${r.activa?'':' · inactiva'}</div>
              <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px">Huevo ${(r.color_huevo||'').toLowerCase()}${r.huevos_por_ano?` · ${r.huevos_por_ano} al año`:''}</div>
            </div>
          </div>
          <button class="btn ghost" data-editar-raza="${r.id}" style="padding:7px 12px;font-size:12px;flex-shrink:0">Editar</button>
        </div>
      </div>`).join('') : estadoVacio('No hay razas cargadas.')}
      <button class="btn primary" id="btn_raza_nueva" style="width:100%">Agregar una raza</button>`}`)

    admCampoVolver()
    const bn = document.querySelector('#btn_raza_nueva')
    if(bn) bn.onclick = ()=>{ form = { color_hex:'#B5763F', color_huevo:'Marrón' }; dibujar() }
    document.querySelectorAll('[data-editar-raza]').forEach(b=>b.onclick=()=>{
      const r = razas.find(x=>x.id===b.dataset.editarRaza)
      form = { id:r.id, nombre:r.nombre, color_hex:r.color_hex, color_huevo:r.color_huevo, huevos:r.huevos_por_ano }
      dibujar()
    })
    document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{
      form.nombre = document.querySelector('#rz_nombre').value
      form.huevos = document.querySelector('#rz_huevos').value
      form.color_hex = b.dataset.color; form.color_huevo = b.dataset.label
      dibujar()
    })
    const bc = document.querySelector('#btn_raza_cancelar')
    if(bc) bc.onclick = ()=>{ form = null; dibujar() }
    const bg = document.querySelector('#btn_raza_guardar')
    if(bg) bg.onclick = async ()=>{
      const box = document.querySelector('#err_raza')
      const nombre = document.querySelector('#rz_nombre').value.trim()
      if(!nombre){ box.textContent='Ponele un nombre.'; box.style.display='block'; return }
      const { data: r, error } = await supabase.rpc('admin_guardar_raza', {
        p_id: form.id || null, p_nombre: nombre,
        p_color_huevo: form.color_huevo, p_color_hex: form.color_hex,
        p_huevos_ano: Number(document.querySelector('#rz_huevos').value) || null,
        p_curva: null
      })
      if(error || !r?.ok){ box.textContent = r?.error || 'No se pudo guardar.'; box.style.display='block'; return }
      form = null; campoCat = null
      render()
    }
  }
  dibujar()
}

// ---- INSUMOS ----
const UNIDADES = [['kg','Kilos'],['g','Gramos'],['l','Litros'],['ml','Mililitros'],['dosis','Dosis'],['unidad','Unidades']]
const CATEG_INSUMO = [['alimento','Alimento'],['sanidad','Sanidad'],['limpieza','Limpieza'],['otro','Otro']]

async function admCampoInsumos(){
  const [cat, { data: provRaw }] = await Promise.all([
    campoCargarCatalogos(),
    supabase.from('producto_proveedores').select('*').eq('activo', true)
  ])
  const insumos = cat.insumos || []
  const provs = provRaw || []
  let form = null, formProv = null

  const dibujar = ()=>{
    layout(`${admCampoHeader('Insumos del campo')}

    ${form ? `<div class="card">
      <h3 style="font-size:15px;margin:0 0 12px">${form.id?'Editar insumo':'Nuevo insumo'}</h3>
      <div class="field"><label>Nombre *</label><input id="in_nombre" value="${form.nombre||''}" placeholder="Ej: Alimento ponedora"/></div>
      <div class="field"><label>¿Qué es?</label>
        <div class="grid two">${CATEG_INSUMO.map(([v,l])=>`<button type="button" class="btn ${form.categoria===v?'primary':'ghost'}" data-cat-insumo="${v}">${l}</button>`).join('')}</div>
      </div>
      <div class="field"><label>¿Cómo viene? *</label><input id="in_envase" value="${form.unit_label||''}" placeholder="Ej: bolsa, frasco, botella"/></div>
      <div class="field"><label>Unidad de medida *</label>
        <div class="grid three">${UNIDADES.map(([v,l])=>`<button type="button" class="btn ${form.unidad===v?'primary':'ghost'}" data-unidad="${v}" style="font-size:12px">${l}</button>`).join('')}</div>
      </div>
      <div class="grid two">
        <div class="field"><label>Contenido por envase</label><input id="in_contenido" type="number" inputmode="decimal" value="${form.contenido||''}" placeholder="Ej: 40"/></div>
        ${form.categoria==='sanidad'?`<div class="field"><label>Dosis que rinde</label><input id="in_dosis" type="number" inputmode="numeric" value="${form.dosis||''}" placeholder="Ej: 1000"/></div>`:`<div class="field"><label>Proteína (%)</label><input id="in_proteina" type="number" inputmode="decimal" value="${form.proteina||''}" placeholder="Opcional"/></div>`}
      </div>
      ${form.categoria==='alimento'?`<div class="field"><label>¿De qué etapa es?</label>
        <select id="in_etapa"><option value="">Cualquiera</option>
        ${(cat.etapas||[]).map(e=>`<option value="${e.codigo}" ${form.etapa===e.codigo?'selected':''}>${e.nombre}</option>`).join('')}</select>
      </div>`:''}
      <div id="err_insumo_adm" class="alert danger" style="display:none"></div>
      ${pBtnRow([pBtn('','Guardar','id="btn_insumo_guardar"','primary'), pBtn('','Cancelar','id="btn_insumo_cancelar"','ghost')])}
    </div>`
    : formProv ? `<div class="card">
      <h3 style="font-size:15px;margin:0 0 12px">Proveedor de ${formProv.nombre_insumo}</h3>
      <div class="field"><label>Nombre del proveedor *</label><input id="pv_nombre" value="${formProv.nombre||''}"/></div>
      <div class="field"><label>Precio del envase</label><input id="pv_precio" type="number" inputmode="numeric" value="${formProv.precio||''}"/></div>
      <div class="field"><label>¿Cómo llega?</label>
        <div class="grid three">
          ${[['trae','Te lo trae'],['retiro_deposito','Retirás vos'],['retiro_transporte','Por transporte']].map(([v,l])=>
            `<button type="button" class="btn ${formProv.modo===v?'primary':'ghost'}" data-modo="${v}" style="font-size:11.5px">${l}</button>`).join('')}
        </div>
      </div>
      ${formProv.modo && formProv.modo!=='trae'?`
      <div class="field"><label>Dirección de retiro</label><input id="pv_dir" value="${formProv.direccion||''}"/></div>
      <div class="field"><label>Distancia ida y vuelta (km)</label><input id="pv_km" type="number" inputmode="decimal" value="${formProv.km||''}" placeholder="Ej: 36"/>
        <p class="muted" style="margin:6px 0 0;font-size:11.5px">Sacá los kilómetros de Google Maps y multiplicá por dos.</p>
      </div>`:''}
      <div id="err_prov" class="alert danger" style="display:none"></div>
      ${pBtnRow([pBtn('','Guardar','id="btn_prov_guardar"','primary'), pBtn('','Cancelar','id="btn_prov_cancelar"','ghost')])}
    </div>`
    : `${insumos.length ? insumos.map(i=>{
        const ps = provs.filter(p=>p.product_id===i.id)
        return `<div class="card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
            <div style="flex:1;min-width:0">
              <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">${i.nombre}</div>
              <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px">${i.unit_label}${i.contenido?` de ${i.contenido} ${i.unidad}`:''}${i.dosis?` · ${i.dosis} dosis`:''}</div>
              <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px">${(CATEG_INSUMO.find(c=>c[0]===i.categoria)||[])[1]||i.categoria}${i.etapa?` · ${((cat.etapas||[]).find(e=>e.codigo===i.etapa)||{}).nombre||''}`:''}</div>
            </div>
            <span style="background:${Number(i.stock)>0?NOM.verdeClaro:'#FBE9D4'};color:${Number(i.stock)>0?NOM.verde:NOM.ambar};font-size:10.5px;padding:4px 9px;border-radius:6px;white-space:nowrap">${Number(i.stock)||0} en stock</span>
          </div>
          ${ps.length?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid ${NOM.borde}">
            ${ps.map(p=>`<div style="display:flex;justify-content:space-between;padding:4px 0">
              <span style="font-size:11.5px;color:${NOM.tintaSuave}">${p.nombre_proveedor}${p.modo_entrega!=='trae'?` · ${p.km_ida||'?'} km`:' · te lo trae'}</span>
              <span style="font-size:11.5px;color:${NOM.tinta}">${p.precio?'$'+Number(p.precio).toLocaleString('es-AR'):'sin precio'}</span>
            </div>`).join('')}
          </div>`:''}
          ${pBtnRow([
            pBtn('','Editar',`data-editar-insumo="${i.id}"`,'ghost'),
            pBtn('','Proveedor',`data-prov-insumo="${i.id}"`,'ghost')
          ])}
        </div>`
      }).join('') : estadoVacio('Todavía no cargaste insumos.')}
      <button class="btn primary" id="btn_insumo_nuevo" style="width:100%">Agregar un insumo</button>`}`)

    admCampoVolver()
    const bn = document.querySelector('#btn_insumo_nuevo')
    if(bn) bn.onclick = ()=>{ form = { categoria:'alimento', unidad:'kg' }; dibujar() }

    const guardarCampos = ()=>{
      form.nombre = document.querySelector('#in_nombre')?.value || form.nombre
      form.unit_label = document.querySelector('#in_envase')?.value || form.unit_label
      form.contenido = document.querySelector('#in_contenido')?.value || form.contenido
      form.dosis = document.querySelector('#in_dosis')?.value || form.dosis
      form.proteina = document.querySelector('#in_proteina')?.value || form.proteina
    }
    document.querySelectorAll('[data-cat-insumo]').forEach(b=>b.onclick=()=>{ guardarCampos(); form.categoria=b.dataset.catInsumo; dibujar() })
    document.querySelectorAll('[data-unidad]').forEach(b=>b.onclick=()=>{ guardarCampos(); form.unidad=b.dataset.unidad; dibujar() })

    document.querySelectorAll('[data-editar-insumo]').forEach(b=>b.onclick=()=>{
      const i = insumos.find(x=>x.id===b.dataset.editarInsumo)
      form = { id:i.id, nombre:i.nombre, unit_label:i.unit_label, categoria:i.categoria,
               unidad:i.unidad, contenido:i.contenido, dosis:i.dosis, etapa:i.etapa }
      dibujar()
    })
    document.querySelectorAll('[data-prov-insumo]').forEach(b=>b.onclick=()=>{
      const i = insumos.find(x=>x.id===b.dataset.provInsumo)
      formProv = { product_id:i.id, nombre_insumo:i.nombre, modo:'trae' }
      dibujar()
    })
    document.querySelectorAll('[data-modo]').forEach(b=>b.onclick=()=>{
      formProv.nombre = document.querySelector('#pv_nombre')?.value || formProv.nombre
      formProv.precio = document.querySelector('#pv_precio')?.value || formProv.precio
      formProv.modo = b.dataset.modo
      dibujar()
    })

    const bc = document.querySelector('#btn_insumo_cancelar')
    if(bc) bc.onclick = ()=>{ form = null; dibujar() }
    const bpc = document.querySelector('#btn_prov_cancelar')
    if(bpc) bpc.onclick = ()=>{ formProv = null; dibujar() }

    const bg = document.querySelector('#btn_insumo_guardar')
    if(bg) bg.onclick = async ()=>{
      const box = document.querySelector('#err_insumo_adm')
      const nombre = document.querySelector('#in_nombre').value.trim()
      const envase = document.querySelector('#in_envase').value.trim()
      if(!nombre){ box.textContent='Ponele un nombre.'; box.style.display='block'; return }
      if(!envase){ box.textContent='Poné cómo viene: bolsa, frasco, botella.'; box.style.display='block'; return }
      const { data: r, error } = await supabase.rpc('admin_guardar_insumo', {
        p_id: form.id || null, p_nombre: nombre, p_unit_label: envase,
        p_categoria: form.categoria, p_unidad_medida: form.unidad,
        p_contenido: Number(document.querySelector('#in_contenido')?.value) || null,
        p_dosis: Number(document.querySelector('#in_dosis')?.value) || null,
        p_etapa: document.querySelector('#in_etapa')?.value || null,
        p_es_alimento: form.categoria === 'alimento',
        p_proteina: Number(document.querySelector('#in_proteina')?.value) || null
      })
      if(error || !r?.ok){ box.textContent = r?.error || 'No se pudo guardar.'; box.style.display='block'; return }
      form = null; campoCat = null
      render()
    }

    const bpg = document.querySelector('#btn_prov_guardar')
    if(bpg) bpg.onclick = async ()=>{
      const box = document.querySelector('#err_prov')
      const nombre = document.querySelector('#pv_nombre').value.trim()
      if(!nombre){ box.textContent='Poné el nombre del proveedor.'; box.style.display='block'; return }
      const { data: r, error } = await supabase.rpc('admin_guardar_prov_insumo', {
        p_id: null, p_product_id: formProv.product_id, p_nombre: nombre,
        p_supplier_id: null,
        p_precio: Number(document.querySelector('#pv_precio').value) || null,
        p_modo: formProv.modo,
        p_km: Number(document.querySelector('#pv_km')?.value) || null,
        p_direccion: document.querySelector('#pv_dir')?.value.trim() || null
      })
      if(error || !r?.ok){ box.textContent = r?.error || 'No se pudo guardar.'; box.style.display='block'; return }
      formProv = null
      render()
    }
  }
  dibujar()
}

// ---- PLAN SANITARIO ----
async function admCampoSanitario(){
  const cat = await campoCargarCatalogos()
  const plan = cat.plan_sanitario || []
  const sanidad = (cat.insumos||[]).filter(i=>i.categoria==='sanidad')
  let form = null

  const dibujar = ()=>{
    layout(`${admCampoHeader('Plan sanitario')}
    <div class="card"><p class="muted" style="margin:0;font-size:12.5px;line-height:1.55">Cargá lo que te indique el veterinario o el criadero. Federico va a recibir el aviso cuando el lote llegue a esa semana.</p></div>

    ${form ? `<div class="card">
      <h3 style="font-size:15px;margin:0 0 12px">${form.id?'Editar':'Nueva aplicación'}</h3>
      <div class="field"><label>Nombre *</label><input id="ps_nombre" value="${form.nombre||''}" placeholder="Ej: Newcastle"/></div>
      <div class="field"><label>¿A qué semana de vida? *</label><input id="ps_semana" type="number" inputmode="numeric" value="${form.semana??''}" placeholder="Ej: 8"/></div>
      <div class="field"><label>Cómo se aplica</label>
        <div class="grid three">${[['agua','En el agua'],['ocular','Ocular'],['inyectable','Inyectable'],['spray','Spray'],['alimento','En el alimento'],['otra','Otra']].map(([v,l])=>
          `<button type="button" class="btn ${form.via===v?'primary':'ghost'}" data-via="${v}" style="font-size:11.5px">${l}</button>`).join('')}</div>
      </div>
      ${sanidad.length?`<div class="field"><label>Producto que se usa</label>
        <select id="ps_producto"><option value="">Ninguno cargado</option>
        ${sanidad.map(i=>`<option value="${i.id}" ${form.producto_id===i.id?'selected':''}>${i.nombre}</option>`).join('')}</select>
      </div>`:''}
      <div class="field"><label>Notas</label><input id="ps_notas" value="${form.notas||''}"/></div>
      <div id="err_ps" class="alert danger" style="display:none"></div>
      ${pBtnRow([pBtn('','Guardar','id="btn_ps_guardar"','primary'), pBtn('','Cancelar','id="btn_ps_cancelar"','ghost')])}
    </div>`
    : `${plan.length ? plan.map(p=>`<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:11px">
          <div style="flex:1;min-width:0">
            <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">${p.nombre}</div>
            <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:2px">Semana ${p.semana}${p.via?` · ${p.via}`:''}</div>
          </div>
          <button class="btn ghost" data-editar-ps="${p.id}" style="padding:7px 12px;font-size:12px;flex-shrink:0">Editar</button>
        </div>
      </div>`).join('') : estadoVacio('Todavía no cargaste el plan sanitario.')}
      <button class="btn primary" id="btn_ps_nuevo" style="width:100%">Agregar al plan</button>`}`)

    admCampoVolver()
    const bn = document.querySelector('#btn_ps_nuevo')
    if(bn) bn.onclick = ()=>{ form = {}; dibujar() }
    document.querySelectorAll('[data-editar-ps]').forEach(b=>b.onclick=()=>{
      const p = plan.find(x=>x.id===b.dataset.editarPs)
      form = { id:p.id, nombre:p.nombre, semana:p.semana, via:p.via, producto_id:p.producto_id }
      dibujar()
    })
    document.querySelectorAll('[data-via]').forEach(b=>b.onclick=()=>{
      form.nombre = document.querySelector('#ps_nombre').value
      form.semana = document.querySelector('#ps_semana').value
      form.via = b.dataset.via
      dibujar()
    })
    const bc = document.querySelector('#btn_ps_cancelar')
    if(bc) bc.onclick = ()=>{ form = null; dibujar() }
    const bg = document.querySelector('#btn_ps_guardar')
    if(bg) bg.onclick = async ()=>{
      const box = document.querySelector('#err_ps')
      const nombre = document.querySelector('#ps_nombre').value.trim()
      const semana = Number(document.querySelector('#ps_semana').value)
      if(!nombre){ box.textContent='Ponele un nombre.'; box.style.display='block'; return }
      if(!semana && semana !== 0){ box.textContent='Poné a qué semana va.'; box.style.display='block'; return }
      const { data: r, error } = await supabase.rpc('admin_guardar_plan_sanitario', {
        p_id: form.id || null, p_nombre: nombre, p_semana: semana, p_via: form.via || null,
        p_producto_id: document.querySelector('#ps_producto')?.value || null,
        p_dosis: null, p_notas: document.querySelector('#ps_notas').value.trim() || null
      })
      if(error || !r?.ok){ box.textContent = r?.error || 'No se pudo guardar.'; box.style.display='block'; return }
      form = null; campoCat = null
      render()
    }
  }
  dibujar()
}

// ---- DESCANSO POR MES ----
async function admCampoDescanso(){
  const { data: meses } = await supabase.from('descanso_estacional').select('*').order('mes')
  const lista = meses || []
  const { data: rec } = await supabase.rpc('descanso_recomendado', {})

  layout(`${admCampoHeader('Descanso por mes')}
  <div class="card"><p class="muted" style="margin:0;font-size:12.5px;line-height:1.55">Cuántos días conviene que descanse una parcela según la época. Vienen cargados con el clima de Rosario — ajustalos con lo que veas en tu campo.</p></div>

  ${rec?`<div style="background:${NOM.verdeClaro};border-radius:12px;padding:13px;margin-bottom:9px">
    <div style="font-size:12.5px;color:#5F5E5A;line-height:1.55">Ahora, en ${rec.mes}, el sistema recomienda <b>${rec.dias} días</b>.${rec.motivo_ajuste?` Ajustado porque ${rec.motivo_ajuste}.`:''}</div>
  </div>`:''}

  <div class="card">
    ${lista.map(m=>`<div class="row">
      <span style="font-size:12.5px">${m.nombre_mes}<br><small class="muted">crece ${m.crecimiento}</small></span>
      <span style="display:flex;gap:7px;align-items:center">
        <input type="number" inputmode="numeric" id="ds_${m.mes}" value="${m.dias_recomendados}" style="width:64px;text-align:center"/>
        <span style="font-size:11.5px;color:${NOM.tintaSuave}">días</span>
        <button class="btn ghost" data-guardar-mes="${m.mes}" style="padding:6px 10px;font-size:11.5px">Guardar</button>
      </span>
    </div>`).join('')}
  </div>`)

  admCampoVolver()
  document.querySelectorAll('[data-guardar-mes]').forEach(b=>b.onclick=async()=>{
    const mes = Number(b.dataset.guardarMes)
    const dias = Number(document.querySelector('#ds_'+mes).value)
    const { data: r } = await supabase.rpc('admin_guardar_descanso_mes', { p_mes: mes, p_dias: dias, p_nota: null })
    if(!r?.ok){ mostrarAlerta(r?.error || 'No se pudo guardar.'); return }
    b.textContent = 'Listo'
    setTimeout(()=>{ b.textContent = 'Guardar' }, 1400)
  })
}

// ============================================================
//  CAMPO — LO QUE VE FEDERICO
// ============================================================
let campoLoteSel = null
let campoVista = 'inicio'
let campoCat = null

async function campoCargarCatalogos(){
  if(campoCat) return campoCat
  const { data } = await supabase.rpc('campo_catalogos', {})
  campoCat = data?.ok ? data : { razas:[], etapas:[], parcelas:[], insumos:[], plan_sanitario:[] }
  return campoCat
}

async function campo(){
  layout(`<div class="card">${skeletonBloque(4)}</div>`)
  const [{ data: res }, { data: tar }] = await Promise.all([
    supabase.rpc('campo_resumen', {}),
    supabase.rpc('campo_tareas', {})
  ])
  const lotes = res?.lotes || []
  const parcela = res?.parcela_actual || null
  const tareas = (tar?.tareas || []).filter(t => Number(t.dias) <= 30)

  if(!lotes.length){
    layout(`<h2>El campo</h2>
      <div class="card" style="text-align:center;padding:30px 16px">
        ${ico('huevo',34,NOM.verdePastel)}
        <p style="margin:12px 0 0;font-size:15px;font-weight:500;color:${NOM.tinta}">Todavía no hay lotes cargados</p>
        <p style="margin:7px 0 0;font-size:12.5px;color:${NOM.tintaSuave};line-height:1.55">Cuando lleguen las aves, Gastón carga el lote desde Administración y acá vas a ver todo.</p>
      </div>`)
    return
  }

  if(!campoLoteSel || !lotes.some(l=>l.id===campoLoteSel)) campoLoteSel = lotes[0].id
  const L = lotes.find(l=>l.id===campoLoteSel)
  const etapa = L.etapa || {}

  const colorEtapa = { cria:'#C4761F', recria:'#5C7A99', prepostura:'#7A5C99', produccion:NOM.verde }[etapa.codigo] || NOM.verde
  const enProduccion = etapa.codigo === 'produccion'

  layout(`<div style="background:${NOM.verde};border-radius:18px;padding:16px;margin-bottom:9px">
    <div style="font-size:12px;color:${NOM.verdePastel}">${saludoHora()}, ${(staffProfile?.full_name||'').split(' ')[0]||'equipo'}</div>

    ${lotes.length>1?`<div style="display:flex;gap:6px;margin-top:11px;overflow-x:auto;padding-bottom:2px">
      ${lotes.map(l=>`<button class="btn" data-campo-lote="${l.id}" style="flex-shrink:0;padding:7px 13px;font-size:12px;background:${l.id===campoLoteSel?'#F5EFE0':'rgba(247,244,236,0.15)'};color:${l.id===campoLoteSel?NOM.verde:'#F5EFE0'};border:none">${l.nombre}</button>`).join('')}
    </div>`:''}

    <div style="background:rgba(247,244,236,0.12);border-radius:12px;padding:13px;margin-top:11px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div>
          <div style="font-size:15px;font-weight:500;color:#F5EFE0">${L.nombre}</div>
          <div style="font-size:12px;color:${NOM.verdePastel};margin-top:3px">${L.edad?.texto||''} · ${L.aves} aves</div>
        </div>
        <span style="background:rgba(247,244,236,0.2);color:#F5EFE0;font-size:11px;padding:5px 11px;border-radius:8px;white-space:nowrap">${etapa.nombre||''}</span>
      </div>
      ${L.razas?.length?`<div style="display:flex;gap:5px;margin-top:10px;flex-wrap:wrap">
        ${L.razas.map(r=>`<span style="display:flex;align-items:center;gap:5px;background:rgba(247,244,236,0.1);border-radius:7px;padding:4px 8px">
          <span style="width:10px;height:10px;border-radius:50%;background:${r.color};flex-shrink:0"></span>
          <span style="font-size:10.5px;color:#F5EFE0">${r.cantidad}</span></span>`).join('')}
      </div>`:''}
    </div>

    ${parcela?`<div style="background:rgba(247,244,236,0.12);border-radius:12px;padding:11px;margin-top:8px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:12px;color:#F5EFE0">${parcela.parcela}</span>
      <span style="font-size:11px;color:${NOM.verdePastel}">van ${parcela.dias} día(s)</span>
    </div>`:''}
  </div>

  ${tareas.length?`<div style="background:#FBE9D4;border-radius:14px;padding:14px;margin-bottom:9px">
    <div style="font-size:10.5px;letter-spacing:1.1px;color:${NOM.ambar};margin-bottom:10px">TAREAS PENDIENTES</div>
    ${tareas.slice(0,3).map(t=>{
      const d = Number(t.dias)
      const urgente = d <= 2
      return `<div style="display:flex;gap:10px;align-items:flex-start;padding:7px 0${tareas.indexOf(t)<Math.min(tareas.length,3)-1?`;border-bottom:1px solid rgba(184,100,30,0.18)`:''}">
        <div style="background:${urgente?NOM.ambar:'#FFFFFF'};color:${urgente?'#FFFFFF':NOM.ambar};border-radius:8px;padding:5px 8px;text-align:center;min-width:42px;flex-shrink:0">
          <div style="font-size:15px;font-weight:500;line-height:1">${d<=0?'hoy':d}</div>
          ${d>0?`<div style="font-size:9px">día${d===1?'':'s'}</div>`:''}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12.5px;color:${NOM.tinta};font-weight:500">${t.titulo}</div>
          <div style="font-size:11px;color:#5F5E5A;margin-top:2px">${t.detalle||''}</div>
        </div>
      </div>`
    }).join('')}
  </div>`:''}

  ${!L.cargado_hoy?`<div class="card" style="border:2px solid ${NOM.verde};margin-bottom:7px;cursor:pointer" data-campo-ir="dia">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:11px">
      <div style="display:flex;gap:11px;align-items:center">
        <span style="width:34px;height:34px;border-radius:10px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico('huevo',17,NOM.verde)}</span>
        <div>
          <div style="font-size:14px;font-weight:500;color:${NOM.tinta}">Cargar el día</div>
          <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:1px">Todavía no lo hiciste hoy</div>
        </div>
      </div>
      ${ico('flecha',17,NOM.verde)}
    </div>
  </div>`:`<div class="card" style="margin-bottom:7px;cursor:pointer" data-campo-ir="dia">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:11px">
      <div style="display:flex;gap:11px;align-items:center">
        <span style="width:34px;height:34px;border-radius:10px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico('check',17,NOM.verde)}</span>
        <div>
          <div style="font-size:14px;font-weight:500;color:${NOM.tinta}">El día ya está cargado</div>
          <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:1px">Tocá si querés corregirlo</div>
        </div>
      </div>
      ${ico('flecha',17,NOM.verde)}
    </div>
  </div>`}

  ${[['carro','camion','Mover el carro','Cambiar de parcela, con foto'],
     ['insumo','canasta','Abrir un insumo','Bolsa, frasco o botella nueva'],
     ['peso','grafico','Peso de la semana','Gallinas y huevos'],
     ['sanidad','planilla','Sanidad','Vacunas y tratamientos'],
     ['aves','personas','Entran o salen aves','Muertas, descarte o refuerzo'],
     ['guia','planilla','Guía de la etapa','Qué toca en ' + (etapa.nombre||'').toLowerCase()],
     ['ficha','grafico','Cómo va el lote','Postura, peso y mortalidad'],
     ['granjeros','tienda','Huevos de otros productores','Encargos y recepción']]
    .map(m=>`<div class="card" style="margin-bottom:7px;cursor:pointer" data-campo-ir="${m[0]}">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:11px">
        <div style="display:flex;gap:11px;align-items:center;flex:1;min-width:0">
          <span style="width:32px;height:32px;border-radius:10px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico(m[1],16,NOM.verde)}</span>
          <div style="min-width:0">
            <div style="font-size:13px;font-weight:500;color:${NOM.tinta}">${m[2]}</div>
            <div style="font-size:11px;color:${NOM.tintaSuave};margin-top:1px">${m[3]}</div>
          </div>
        </div>
        ${ico('flecha',15,'#C9C4B4')}
      </div>
    </div>`).join('')}`)

  document.querySelectorAll('[data-campo-lote]').forEach(b=>b.onclick=()=>{ campoLoteSel = b.dataset.campoLote; render() })
  document.querySelectorAll('[data-campo-ir]').forEach(b=>b.onclick=()=>{
    const d = b.dataset.campoIr
    if(d==='granjeros'){ current='campo-granjeros'; render(); return }
    current = 'campo-' + d
    render()
  })
}

async function campoGranjeros(){
  const today = new Date().toISOString().slice(0,10)
  const recientes = await q('production','id,production_date,eggs_count,maples_count,losses_count,notes,source,cost,supplier_name,lote')
  const [{ data: productosRaw }, { data: granjerosRaw }, { data: encargosRaw }] = await Promise.all([
    supabase.from('products').select('id,name,unit_label,current_qty,active').eq('active',true).order('name'),
    supabase.rpc('granjeros_disponibles', {}),
    supabase.rpc('encargos_huevos_pendientes', {})
  ])
  const productos = productosRaw || []
  const granjeros = Array.isArray(granjerosRaw) ? granjerosRaw : []
  const encargos = Array.isArray(encargosRaw) ? encargosRaw : []

  if(campoGranjeroVerHistorial){
    const { data: hist } = await supabase.rpc('admin_historial_granjero', { p_supplier_id: campoGranjeroVerHistorial })
    const h = hist || {}
    layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <button class="btn ghost" id="btn_volver_granjero" style="padding:6px 12px">← Volver</button>
      <h2 style="margin:0">${h.supplier?.name||'Productor'}</h2>
    </div>
    <div class="card">
      <div class="grid two">
        <div><div style="font-size:11px;color:${NOM.tintaSuave}">Huevos comprados</div><div style="font-size:20px;font-weight:500;font-variant-numeric:tabular-nums">${Number(h.total_huevos||0).toLocaleString('es-AR')}</div></div>
        <div><div style="font-size:11px;color:${NOM.tintaSuave}">Costo por huevo</div><div style="font-size:20px;font-weight:500;font-variant-numeric:tabular-nums">$${Number(h.costo_promedio||0).toLocaleString('es-AR')}</div></div>
        <div><div style="font-size:11px;color:${NOM.tintaSuave}">Total gastado</div><div style="font-size:20px;font-weight:500;font-variant-numeric:tabular-nums">$${Number(h.total_gastado||0).toLocaleString('es-AR')}</div></div>
        <div><div style="font-size:11px;color:${NOM.tintaSuave}">Le debés</div><div style="font-size:20px;font-weight:500;color:${Number(h.saldo||0)>0?NOM.ambar:NOM.tinta};font-variant-numeric:tabular-nums">$${Number(h.saldo||0).toLocaleString('es-AR')}</div></div>
      </div>
    </div>
    <h3 style="margin:16px 0 8px">Lotes recibidos</h3>
    ${(h.lotes||[]).length ? (h.lotes||[]).map(l=>pCard(`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div>
          <div style="font-weight:500;color:${NOM.tinta}">Lote ${l.lote||'-'}</div>
          <div style="font-size:12px;color:${NOM.tintaSuave}">${formatearFecha(l.fecha)} · ${l.huevos} huevos${l.roturas?` · ${l.roturas} roturas`:''}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:500;font-variant-numeric:tabular-nums">$${Number(l.costo||0).toLocaleString('es-AR')}</div>
          <div style="font-size:11px;color:${NOM.tintaSuave}">$${Number(l.costo_por_huevo||0).toLocaleString('es-AR')} c/u</div>
          ${Number(l.saldo)>0?`<div style="font-size:11px;color:${NOM.ambar};margin-top:2px">impago</div>`:`<div style="font-size:11px;color:${NOM.verde};margin-top:2px">pagado</div>`}
        </div>
      </div>`)).join('') : estadoVacio('Todavía no le compraste huevos a este productor.')}`)
    document.querySelector('#btn_volver_granjero').onclick = ()=>{ campoGranjeroVerHistorial=null; render() }
    return
  }

  let origenSel = campoOrigenSel
  layout(`<h2>🥚 Personal de campo</h2>
  <div class="card"><h3>Registrar recolección de hoy</h3>
    <div class="field"><label>Fecha</label><input id="p_date" type="date" value="${today}"/></div>
    <div class="field"><label>Origen</label><div class="grid two">
      <button type="button" id="btn_origen_propio" class="btn primary">🐔 Propio</button>
      <button type="button" id="btn_origen_comprado" class="btn ghost">🤝 Comprado a otro productor</button>
    </div></div>
    <div class="grid two">
      <div class="field"><label>Huevos recolectados</label><input id="p_eggs" type="number" min="0" /></div>
      <div class="field"><label>Roturas/defectuosos</label><input id="p_losses" type="number" min="0" value="0"/></div>
    </div>
    <div id="campos_comprado" style="display:${origenSel==='comprado'?'block':'none'}">
      <div class="field"><label>¿A qué productor?</label>
        <select id="p_supplier">
          <option value="">Elegí un productor</option>
          ${granjeros.map(g=>`<option value="${g.id}" ${campoGranjeroSel===g.id?'selected':''}>${g.name}${Number(g.saldo)>0?` — le debés $${Number(g.saldo).toLocaleString('es-AR')}`:''}</option>`).join('')}
        </select>
        ${granjeros.length?'':`<p class="muted" style="font-size:12px;margin-top:6px">No hay productores cargados. Pedile a administración que agregue uno en Proveedores con tipo "huevos".</p>`}
      </div>
      <div class="field"><label>Costo total ($)</label><input id="p_cost" type="number" min="0"/></div>
      <label style="display:flex;align-items:center;gap:10px;font-size:14px;margin-bottom:10px"><input type="checkbox" id="p_ya_pagado" ${campoYaPagado?'checked':''} style="width:18px;height:18px"/> Ya se lo pagué</label>
      <div id="metodo_pago_granjero" style="display:${campoYaPagado?'block':'none'}">
        <div class="field"><label>¿Cómo le pagaste?</label>
          <div class="grid three">
            <button type="button" class="btn ${campoMetodoPago==='cash'?'primary':'ghost'}" data-metodo-granjero="cash">Efectivo</button>
            <button type="button" class="btn ${campoMetodoPago==='transfer'?'primary':'ghost'}" data-metodo-granjero="transfer">Transferencia</button>
            <button type="button" class="btn ${campoMetodoPago==='mp'?'primary':'ghost'}" data-metodo-granjero="mp">Billetera</button>
          </div>
        </div>
      </div>
      <p class="muted" style="font-size:12px">Si no marcás que ya pagaste, queda en la cuenta corriente del productor.</p>
    </div>
    <div class="field"><label>Observaciones</label><textarea id="p_notes" rows="2" placeholder="Ej: cambio de parcela, incidencia sanitaria, etc."></textarea></div>
    <div id="err_campo" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_guardar_produccion">Guardar</button>
  </div>
  <div class="card"><h3>Últimos registros</h3>${recientes.length?recientes.slice(-10).reverse().map(r=>`<div class="row"><span>${formatearFecha(r.production_date)}${r.lote?`<br><small class="muted">Lote ${r.lote}</small>`:''}${r.source==='comprado'?`<br>${pPill('Comprado','#FBE9D4','#B8641E')} <small class="muted">${r.supplier_name||''}</small>`:''}</span><span style="text-align:right"><b style="font-variant-numeric:tabular-nums">${r.eggs_count}</b> huevos${r.losses_count?`<br><small class="muted">${r.losses_count} roturas</small>`:''}${r.cost?`<br><small class="muted">$${Number(r.cost).toLocaleString('es-AR')}</small>`:''}</span></div>`).join(''):'<p class="muted">Todavía no hay registros.</p>'}</div>
  ${encargos.length?`<div class="card"><h3>Encargos en camino</h3>
    ${encargos.map(e=>`<div style="border-bottom:1px solid ${NOM.borde};padding:10px 0">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div><div style="font-weight:500">${e.supplier_name||''}</div><div style="font-size:12px;color:${NOM.tintaSuave}">N° ${e.order_number} · ${Number(e.huevos).toLocaleString('es-AR')} huevos · ${e.delivery_type==='retiro'?'lo retiramos':'nos lo traen'}</div></div>
        <div style="text-align:right;font-weight:500;font-variant-numeric:tabular-nums">${Number(e.total)?'$'+Number(e.total).toLocaleString('es-AR'):'a convenir'}</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn ghost" data-pdf-encargo="${e.id}" style="flex:1;font-size:12px">Orden de compra</button>
        ${e.supplier_phone?`<a href="https://wa.me/54${(e.supplier_phone||'').replace(/\D/g,'')}?text=${encodeURIComponent('Hola! Te paso el pedido: '+Number(e.huevos).toLocaleString('es-AR')+' huevos. Gracias!')}" target="_blank" class="btn ghost" style="flex:1;text-align:center;text-decoration:none;padding:10px 0;font-size:12px">WhatsApp</a>`:''}
        <button class="btn primary" data-recibir-encargo="${e.id}" style="flex:1;font-size:12px">Recibir</button>
      </div>
      ${campoRecibiendoEncargo===e.id?`<div style="margin-top:10px;border-top:1px solid ${NOM.borde};padding-top:10px">
        <div class="grid two">
          <div class="field"><label>Huevos que entraron</label><input id="rec_eggs" type="number" min="0" value="${e.huevos}"/></div>
          <div class="field"><label>Roturas</label><input id="rec_losses" type="number" min="0" value="0"/></div>
        </div>
        <div class="field"><label>Costo final ($)</label><input id="rec_cost" type="number" min="0" value="${Number(e.total)||''}"/></div>
        <label style="display:flex;align-items:center;gap:10px;font-size:14px;margin-bottom:10px"><input type="checkbox" id="rec_pagado" style="width:18px;height:18px"/> Ya se lo pagué</label>
        <div class="field"><label>Observaciones</label><input id="rec_notes" placeholder="Opcional"/></div>
        <div id="err_recibir" class="alert danger" style="display:none"></div>
        <button class="btn primary" id="btn_confirmar_recepcion_huevos" style="width:100%">Confirmar recepción</button>
      </div>`:''}
    </div>`).join('')}
  </div>`:''}
  ${granjeros.length?`<div class="card"><h3>Encargar huevos</h3>
    <div class="field"><label>¿A qué productor?</label><select id="enc_supplier"><option value="">Elegí un productor</option>${granjeros.map(g=>`<option value="${g.id}">${g.name}</option>`).join('')}</select></div>
    <div class="grid two">
      <div class="field"><label>Cuántos huevos</label><input id="enc_eggs" type="number" min="1" placeholder="Ej: 600"/></div>
      <div class="field"><label>Precio por huevo</label><input id="enc_precio" type="number" min="0" placeholder="Opcional"/></div>
    </div>
    <div class="field"><label>¿Cómo llega?</label>
      <div class="grid two">
        <button type="button" class="btn ${campoEncargoModo==='entrega'?'primary':'ghost'}" data-encargo-modo="entrega">Nos lo traen</button>
        <button type="button" class="btn ${campoEncargoModo==='retiro'?'primary':'ghost'}" data-encargo-modo="retiro">Lo retiramos</button>
      </div>
    </div>
    <div id="err_encargo" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_encargar_huevos" style="width:100%">Generar encargo</button>
  </div>`:''}
  ${granjeros.length?`<div class="card"><h3>Productores de huevo</h3>
    ${granjeros.map(g=>`<div class="row"><span>${g.name}<br><small class="muted">${g.ultima_compra?'Última compra: '+formatearFecha(g.ultima_compra):'Sin compras todavía'}</small></span><span style="display:flex;align-items:center;gap:8px">${Number(g.saldo)>0?pPill('Debés $'+Number(g.saldo).toLocaleString('es-AR'),'#FBE9D4','#B8641E'):''}<button class="btn ghost" data-ver-granjero="${g.id}" style="padding:6px 12px;font-size:12px">Ver</button></span></div>`).join('')}
  </div>`:''}
  <div class="card"><h3>Insumos disponibles</h3>
    ${productos.length? productos.map(p=>`<div class="row"><span><b>${p.current_qty}</b> × ${p.unit_label}<br><small>${p.name}</small></span><span style="display:flex;gap:6px;align-items:center"><input type="number" min="0.01" step="0.5" value="1" id="uso_qty_${p.id}" style="width:60px"/><button class="btn ghost" data-usar="${p.id}">Usar</button></span></div>`).join('') : '<p class="muted">Todavía no hay insumos cargados.</p>'}
  </div>`)
  document.querySelector('#btn_origen_propio').onclick = ()=>{
    origenSel='propio'; campoOrigenSel='propio'
    document.querySelector('#btn_origen_propio').className='btn primary'
    document.querySelector('#btn_origen_comprado').className='btn ghost'
    document.querySelector('#campos_comprado').style.display='none'
  }
  document.querySelector('#btn_origen_comprado').onclick = ()=>{
    origenSel='comprado'; campoOrigenSel='comprado'
    document.querySelector('#btn_origen_comprado').className='btn primary'
    document.querySelector('#btn_origen_propio').className='btn ghost'
    document.querySelector('#campos_comprado').style.display='block'
  }
  const selGranjero = document.querySelector('#p_supplier')
  if(selGranjero) selGranjero.onchange = ()=>{ campoGranjeroSel = selGranjero.value }
  const chkPagado = document.querySelector('#p_ya_pagado')
  if(chkPagado) chkPagado.onchange = ()=>{
    campoYaPagado = chkPagado.checked
    document.querySelector('#metodo_pago_granjero').style.display = campoYaPagado?'block':'none'
  }
  document.querySelectorAll('[data-metodo-granjero]').forEach(b=>b.onclick=()=>{
    campoMetodoPago = b.dataset.metodoGranjero
    document.querySelectorAll('[data-metodo-granjero]').forEach(x=> x.className = 'btn '+(x.dataset.metodoGranjero===campoMetodoPago?'primary':'ghost'))
  })
  document.querySelectorAll('[data-ver-granjero]').forEach(b=>b.onclick=()=>{ campoGranjeroVerHistorial = b.dataset.verGranjero; render() })
  document.querySelectorAll('[data-encargo-modo]').forEach(b=>b.onclick=()=>{ campoEncargoModo = b.dataset.encargoModo; render() })
  document.querySelectorAll('[data-pdf-encargo]').forEach(b=>b.onclick=()=>{
    const e = encargos.find(x=>x.id===b.dataset.pdfEncargo)
    if(e) documentoPedidoHuevos(e)
  })
  document.querySelectorAll('[data-recibir-encargo]').forEach(b=>b.onclick=()=>{
    campoRecibiendoEncargo = (campoRecibiendoEncargo===b.dataset.recibirEncargo) ? null : b.dataset.recibirEncargo
    render()
  })
  const btnEncargar = document.querySelector('#btn_encargar_huevos')
  if(btnEncargar) btnEncargar.onclick = async ()=>{
    const box = document.querySelector('#err_encargo')
    const supplierId = document.querySelector('#enc_supplier').value
    const eggs = Number(document.querySelector('#enc_eggs').value)
    const precio = Number(document.querySelector('#enc_precio').value) || 0
    if(!supplierId){ box.textContent='Elegí a qué productor le encargás.'; box.style.display='block'; return }
    if(!eggs || eggs<=0){ box.textContent='Ingresá cuántos huevos querés encargar.'; box.style.display='block'; return }
    const { data, error } = await supabase.rpc('admin_encargar_huevos', {
      p_supplier_id: supplierId, p_eggs: eggs, p_precio_unitario: precio, p_delivery_mode: campoEncargoModo
    })
    if(error || !data?.ok){ box.textContent='No se pudo generar: '+(data?.error||error?.message||''); box.style.display='block'; return }
    mostrarAlerta('Encargo N° '+data.order_number+' generado ✅\n\nDesde "Encargos en camino" podés mandarle la orden de compra.')
    render()
  }
  const btnConfirmarRecepcionHuevos = document.querySelector('#btn_confirmar_recepcion_huevos')
  if(btnConfirmarRecepcionHuevos) btnConfirmarRecepcionHuevos.onclick = async ()=>{
    const box = document.querySelector('#err_recibir')
    const eggs = Number(document.querySelector('#rec_eggs').value)
    const losses = Number(document.querySelector('#rec_losses').value)||0
    const cost = Number(document.querySelector('#rec_cost').value)
    const notes = document.querySelector('#rec_notes').value.trim()
    const pagado = document.querySelector('#rec_pagado').checked
    if(!eggs || eggs<=0){ box.textContent='Ingresá cuántos huevos entraron.'; box.style.display='block'; return }
    if(!cost || cost<=0){ box.textContent='Ingresá el costo final.'; box.style.display='block'; return }
    const { data, error } = await supabase.rpc('recibir_encargo_huevos', {
      p_order_id: campoRecibiendoEncargo, p_eggs: eggs, p_losses: losses, p_cost: cost,
      p_notes: notes||null, p_ya_pagado: pagado, p_payment_method: 'cash'
    })
    if(error || !data?.ok){ box.textContent='No se pudo recibir: '+(data?.error||error?.message||''); box.style.display='block'; return }
    campoRecibiendoEncargo = null
    mostrarAlerta(`Recepción registrada ✅\n\nLote ${data.lote}${data.pagado?'':'\n\nQuedó en la cuenta corriente del productor.'}`)
    render()
  }
  document.querySelector('#btn_guardar_produccion').onclick = async ()=>{
    const eggs = Number(document.querySelector('#p_eggs').value)
    const losses = Number(document.querySelector('#p_losses').value)||0
    const date = document.querySelector('#p_date').value
    const notes = document.querySelector('#p_notes').value.trim()
    const box = document.querySelector('#err_campo')
    if(!eggs || eggs<=0){ box.textContent='Ingresá la cantidad de huevos recolectados.'; box.style.display='block'; return }
    const supplierId = origenSel==='comprado' ? (document.querySelector('#p_supplier').value || null) : null
    const cost = origenSel==='comprado' ? (Number(document.querySelector('#p_cost').value)||null) : null
    if(origenSel==='comprado' && !supplierId){ box.textContent='Elegí a qué productor se lo compraste.'; box.style.display='block'; return }
    if(origenSel==='comprado' && !cost){ box.textContent='Ingresá cuánto te costó.'; box.style.display='block'; return }
    const { data, error } = await supabase.rpc('registrar_produccion', {
      p_date:date, p_eggs:eggs, p_losses:losses, p_notes: notes||null, p_source: origenSel,
      p_cost: cost, p_supplier_id: supplierId, p_ya_pagado: origenSel==='comprado' ? campoYaPagado : false,
      p_payment_method: campoMetodoPago
    })
    if(error || !data?.ok){ box.textContent='No se pudo guardar: '+(error?.message||data?.error||''); box.style.display='block'; return }
    campoGranjeroSel=''; campoYaPagado=false; campoOrigenSel='propio'
    mostrarAlerta(`Registro guardado ✅${data.lote?`\n\nLote ${data.lote}`:''}${data.pagado===false && origenSel==='comprado'?'\n\nQuedó en la cuenta corriente del productor.':''}`)
    render()
  }
  document.querySelectorAll('[data-usar]').forEach(b=>b.onclick=async()=>{
    const id=b.dataset.usar
    const qty=Number(document.querySelector(`#uso_qty_${id}`).value)
    if(!qty||qty<=0){ mostrarAlerta('Ingresá una cantidad válida.'); return }
    const { error } = await supabase.from('stock_movements').insert({ product_id:id, type:'consumo', quantity:qty, created_by: session.user.id })
    if(error){ mostrarAlerta('No se pudo registrar: '+error.message); return }
    mostrarAlerta('Uso registrado ✅'); render()
  })
}

let clienteExpandido = null
let clienteDetalleCache = {}

async function clientes(){
  const rows=await q('customers','id,first_name,last_name,phone,neighborhood,zone,city,status,dni')
  layout(`<h2>Clientes</h2>
  <div style="display:flex;gap:8px;margin-bottom:12px">
    <button id="btn_exportar_clientes" class="btn ghost" style="flex:1">📊 Excel</button>
    <button id="btn_padron_clientes" class="btn ghost" style="flex:1">📄 Padrón</button>
  </div>
  ${rows.length? rows.map((c,i)=>{
    const abierto = clienteExpandido===c.id
    const detalle = clienteDetalleCache[c.id]
    return `<div class="nom-cascada" style="animation-delay:${Math.min(i*0.04,0.4)}s;background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;overflow:hidden;margin-bottom:8px">
      <button type="button" data-toggle-cliente="${c.id}" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:12px 14px;cursor:pointer;gap:10px;background:${abierto?'#F5EFE0':'transparent'}">
        ${pAvatar(c.first_name)}
        <div style="flex:1;text-align:left">
          <div style="font-weight:700;color:#2F4D2A">${c.first_name||''} ${c.last_name||''}</div>
          <div style="font-size:12px;color:#8A8570;margin-top:2px">🏘️ ${c.neighborhood||'-'} · Ciudad: ${c.city||'-'}</div>
          <div style="margin-top:4px">${zonaBadge(c.zone)}</div>
        </div>
        <span style="font-size:13px;color:#8A8570">${abierto?'▲':'▼'}</span>
      </button>
      <div style="display:${abierto?'block':'none'};padding:0 14px 14px">
        ${!detalle ? skeletonBloque(4) : `
          <div style="border-top:1px solid #F0EBDD;padding-top:12px">
            <h3 style="font-size:14px;color:#2F4D2A;margin-bottom:8px">✏️ Editar datos</h3>
            <div class="grid two">
              <div class="field"><label>DNI</label><input id="cl_dni_${c.id}" value="${detalle.customer.dni||''}"/></div>
              <div class="field"><label>Teléfono</label><input id="cl_phone_${c.id}" value="${detalle.customer.phone||''}"/></div>
              <div class="field"><label>Email</label><input id="cl_email_${c.id}" value="${detalle.customer.email||''}"/></div>
              <div class="field"><label>Barrio</label><input id="cl_neighborhood_${c.id}" value="${detalle.customer.neighborhood||''}"/></div>
              <div class="field"><label>Calle</label><input id="cl_street_${c.id}" value="${detalle.customer.street||''}"/></div>
              <div class="field"><label>Número</label><input id="cl_street_number_${c.id}" value="${detalle.customer.street_number||''}"/></div>
              <div class="field"><label>Ciudad</label><input id="cl_city_${c.id}" value="${detalle.customer.city||''}"/></div>
              <div class="field"><label>Provincia</label><input id="cl_province_${c.id}" value="${detalle.customer.province||''}"/></div>
              <div class="field"><label>Código postal</label><input id="cl_postal_${c.id}" value="${detalle.customer.postal_code||''}"/></div>
              <div class="field"><label>Zona</label><select id="cl_zone_${c.id}">${ZONAS.map(z=>`<option value="${z.value}" ${detalle.customer.zone===z.value?'selected':''}>${z.label}</option>`).join('')}</select></div>
            </div>
            <div id="aviso_numero_cl_${c.id}"></div>
            <div id="err_cliente_${c.id}" class="alert danger" style="display:none"></div>
            <button data-guardar-cliente="${c.id}" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:10px 0;font-size:13px;font-weight:600;margin-top:4px">💾 Guardar cambios</button>
            <div style="margin-top:12px;padding-top:12px;border-top:1px solid #F0EBDD">
              <label style="font-size:12px;color:#2F4D2A;font-weight:600;display:block;margin-bottom:6px">Tipo de cliente</label>
              <div class="grid two">
                <button type="button" data-tipo-cliente="${c.id}" data-valor="minorista" class="btn ${(detalle.customer.customer_type||'minorista')==='minorista'?'primary':'ghost'}">🛍️ Minorista</button>
                <button type="button" data-tipo-cliente="${c.id}" data-valor="mayorista" class="btn ${detalle.customer.customer_type==='mayorista'?'primary':'ghost'}">🏭 Mayorista</button>
              </div>
              <button type="button" data-condiciones="${c.id}" style="width:100%;margin-top:10px;background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8;border-radius:10px;padding:9px 0;font-size:12.5px">Condiciones comerciales</button>
            </div>
          </div>
          <div style="margin-top:16px"><h3 style="font-size:14px;color:#2F4D2A;margin-bottom:8px">📦 Suscripciones</h3>
            ${detalle.subscriptions.length? detalle.subscriptions.map(s=>{
              const plan = s.plan_breakdown && s.plan_breakdown.length ? s.plan_breakdown.map(b=>`${b.qty}×${b.size}`).join(' + ') : `${s.egg_quantity} huevos`
              return `<div class="row"><span>${plan} · ${FRECUENCIAS[s.frequency]||s.frequency}</span><span class="badge">${s.payment_status==='paid'?'✅ Pago al día':'🟡 Pendiente'}</span></div>`
            }).join('') : '<p class="muted" style="font-size:13px">Sin suscripciones.</p>'}
          </div>
          <div style="margin-top:16px"><h3 style="font-size:14px;color:#2F4D2A;margin-bottom:8px">🧾 Historial de pedidos</h3>
            ${detalle.orders.length? detalle.orders.map(o=>`<div class="row"><span>Pedido #${o.order_number||'-'} · ${formatearFecha(o.delivery_date)}</span><span class="badge">${ESTADOS[o.status]||o.status}</span></div>`).join('') : '<p class="muted" style="font-size:13px">Sin pedidos todavía.</p>'}
          </div>
          <div style="margin-top:16px"><h3 style="font-size:14px;color:#2F4D2A;margin-bottom:8px">💳 Historial de pagos</h3>
            ${detalle.payments.length? detalle.payments.map(p=>`<div class="row"><span>${new Date(p.created_at).toLocaleDateString('es-AR')}</span><span><b>$${Number(p.amount||0).toLocaleString('es-AR')}</b> · ${METODOS_PAGO_LABEL[p.method]||p.method}</span></div>`).join('') : '<p class="muted" style="font-size:13px">Sin pagos todavía.</p>'}
          </div>
          <div style="margin-top:16px"><h3 style="font-size:14px;color:#2F4D2A;margin-bottom:8px">🎁 Créditos por recomendar</h3>
            ${detalle.credits && detalle.credits.length? detalle.credits.map(cr=>{
              const label = cr.status==='pending'?'⏳ Esperando entrega del referido':cr.status==='available'?'🎁 Listo para usar':'✅ Ya usado'
              return `<div class="row"><span>${cr.amount_description}<br><small class="muted">${label} · ${cr.reason||''}</small></span>${cr.status==='available'?`<button data-usar-credito="${cr.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:6px 12px;font-size:11px;font-weight:600">Marcar usado</button>`:''}</span></div>`
            }).join('') : '<p class="muted" style="font-size:13px">Sin créditos todavía.</p>'}
          </div>
          <div style="margin-top:16px"><h3 style="font-size:14px;color:#2F4D2A;margin-bottom:8px">📣 Historial de códigos de referido</h3>
            ${detalle.referral_history && detalle.referral_history.length? detalle.referral_history.map(h=>`<div class="row"><span>${h.code} → ${h.referred_first_name||'alguien'}</span><span class="badge">${h.status==='completed'?'✅ Completado':'⏳ Pendiente'}</span></div>`).join('') : '<p class="muted" style="font-size:13px">Todavía no recomendó a nadie.</p>'}
          </div>
        `}
      </div>
    </div>`
  }).join('') : estadoVacio('Todavía no hay clientes cargados.')}`)
  const btnPadron = document.querySelector('#btn_padron_clientes')
  if(btnPadron) btnPadron.onclick = ()=>{
    const tipo = prompt('¿Qué clientes querés listar?\n\n1. Todos\n2. Solo minoristas\n3. Solo mayoristas\n\nEscribí el número:')
    const filtro = tipo==='2' ? 'minorista' : tipo==='3' ? 'mayorista' : null
    documentoPadronClientes(filtro)
  }

  document.querySelector('#btn_exportar_clientes').onclick = ()=>{
    descargarCSV('clientes_nomades.csv', [
      {label:'Nombre', value:c=>`${c.first_name||''} ${c.last_name||''}`},
      {label:'DNI', value:'dni'}, {label:'Teléfono', value:'phone'},
      {label:'Barrio', value:'neighborhood'}, {label:'Zona', value:'zone'}, {label:'Ciudad', value:'city'},
      {label:'Estado', value:'status'}
    ], rows)
  }
  document.querySelectorAll('[data-toggle-cliente]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.toggleCliente
    if(clienteExpandido===id){ clienteExpandido=null; render(); return }
    clienteExpandido = id
    if(!clienteDetalleCache[id]){
      const { data } = await supabase.rpc('admin_customer_detail', { p_customer_id: id })
      if(data?.found) clienteDetalleCache[id] = data
    }
    render()
  })
  if(clienteExpandido) attachAvisoNumeroEnCalle(`cl_street_${clienteExpandido}`, `cl_street_number_${clienteExpandido}`, `aviso_numero_cl_${clienteExpandido}`)
  document.querySelectorAll('[data-condiciones]').forEach(b=>b.onclick=()=>condicionesComerciales(b.dataset.condiciones))
  document.querySelectorAll('[data-guardar-cliente]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.guardarCliente
    const box = document.querySelector(`#err_cliente_${id}`)
    const payload = {
      dni: document.querySelector(`#cl_dni_${id}`).value.trim(),
      phone: document.querySelector(`#cl_phone_${id}`).value.trim(),
      email: document.querySelector(`#cl_email_${id}`).value.trim(),
      neighborhood: document.querySelector(`#cl_neighborhood_${id}`).value.trim(),
      street: document.querySelector(`#cl_street_${id}`).value.trim(),
      street_number: document.querySelector(`#cl_street_number_${id}`).value.trim(),
      city: document.querySelector(`#cl_city_${id}`).value.trim(),
      province: document.querySelector(`#cl_province_${id}`).value.trim(),
      postal_code: document.querySelector(`#cl_postal_${id}`).value.trim(),
      zone: document.querySelector(`#cl_zone_${id}`).value
    }
    const { error } = await supabase.from('customers').update(payload).eq('id', id)
    if(error){ box.textContent = 'No se pudo guardar: '+error.message; box.style.display='block'; return }
    delete clienteDetalleCache[id]
    mostrarAlerta('✅ Datos del cliente actualizados.')
    render()
  })
  document.querySelectorAll('[data-tipo-cliente]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.tipoCliente
    const { data, error } = await supabase.rpc('admin_set_customer_type', { p_customer_id: id, p_type: b.dataset.valor })
    if(error || !data?.ok){ mostrarAlerta('No se pudo cambiar: '+(error?.message||data?.error||'')); return }
    delete clienteDetalleCache[id]
    mostrarAlerta(`Cliente marcado como ${b.dataset.valor} ✅`)
    render()
  })
  document.querySelectorAll('[data-usar-credito]').forEach(b=>b.onclick=async()=>{
    if(!(await mostrarConfirmacion('¿Marcar este crédito como usado?')))return
    const { error } = await supabase.from('customer_credits').update({ status: 'used' }).eq('id', b.dataset.usarCredito)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    clienteDetalleCache = {}
    render()
  })
}

let pedidoExpandido = null
let pedidoDetalleCache = {}

let avisoRutaFecha = null
let pedidosFechaFiltro = null // null | 'hoy' | 'manana'

async function pedidos(){
  const rows = await q('orders','id,order_number,delivery_date,status,egg_quantity,important_note,time_restriction_manual,assigned_driver,assigned_preparer,assignment_locked,customers(first_name,last_name,neighborhood,street,street_number)')
  const { data: staffRaw } = await supabase.from('staff_roles').select('user_id,full_name,role')
  const staffMap = Object.fromEntries((staffRaw||[]).map(s=>[s.user_id, s.full_name||'(sin nombre)']))
  const preparadoresRoles = Object.fromEntries((staffRaw||[]).map(s=>[s.user_id, s.role]))
  const hoyStr = new Date().toISOString().slice(0,10)
  const mm = new Date(); mm.setDate(mm.getDate()+1)
  const mananaStr = mm.toISOString().slice(0,10)
  const fechaDelFiltro = pedidosFechaFiltro==='hoy' ? hoyStr : pedidosFechaFiltro==='manana' ? mananaStr : null
  const filtrados = fechaDelFiltro ? rows.filter(r=>r.delivery_date===fechaDelFiltro) : rows
  const ordenados = [...filtrados].sort((a,b)=> new Date(b.delivery_date) - new Date(a.delivery_date))
  const cont = f => rows.filter(r=>r.delivery_date===f).length

  layout(`<h2>Pedidos</h2>
  <div style="display:flex;gap:7px;margin-bottom:12px;overflow-x:auto;padding-bottom:2px">
    ${[['manana','Mañana',cont(mananaStr)],['hoy','Hoy',cont(hoyStr)],[null,'Todos',rows.length]].map(([v,l,n])=>{
      const activo = pedidosFechaFiltro === v
      return `<button type="button" data-filtro-fecha="${v===null?'':v}" style="all:unset;cursor:pointer;white-space:nowrap;padding:7px 13px;border-radius:999px;font-size:12.5px;background:${activo?NOM.verde:'#FFFFFF'};color:${activo?'#F7F4EC':NOM.tinta};border:1px solid ${activo?NOM.verde:NOM.borde}">${l} <span style="opacity:0.65">${n}</span></button>`
    }).join('')}
  </div>
  ${fechaDelFiltro && !ordenados.length ? `<div class="alert info">No hay pedidos para ${pedidosFechaFiltro==='manana'?'mañana':'hoy'}.</div>` : ''}
  <button id="btn_exportar_pedidos" class="btn ghost" style="width:100%;margin-bottom:12px">📊 Exportar a Excel (CSV)</button>
  ${ordenados.length? ordenados.map((r,i)=>{
    const c = r.customers||{}
    const rep = r.assigned_driver ? (staffMap[r.assigned_driver]||'(repartidor desconocido)') : 'Sin asignar'
    const abierto = pedidoExpandido===r.id
    const detalle = pedidoDetalleCache[r.id]
    return `<div class="nom-cascada" style="animation-delay:${Math.min(i*0.04,0.4)}s;background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;overflow:hidden;margin-bottom:8px">
      <button type="button" data-toggle-pedido="${r.id}" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:12px 14px;cursor:pointer;gap:10px;background:${abierto?'#F5EFE0':'transparent'}">
        <div style="flex:1;text-align:left">
          <div style="font-size:11px;color:#8A8570">Pedido #${r.order_number||'-'}</div>
          <div style="font-weight:700;color:#2F4D2A">${c.first_name||''} ${c.last_name||''}</div>
          <div style="font-size:12px;color:#8A8570;margin-top:2px">${c.neighborhood||''} · ${c.street||''} ${c.street_number||''} · ${formatearFecha(r.delivery_date)}</div>
          <div style="font-size:12px;color:#8A8570;margin-top:2px">🚚 ${rep}${r.assignment_locked?' 🔒':''} · ${r.egg_quantity||0} huevos</div>
          ${tieneRestriccionHoraria(r)?`<div style="font-size:11px;color:#B85C00;margin-top:2px">⏰ ${textoRestriccionHoraria(r)}</div>`:''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          ${pPill(ESTADOS[r.status]||r.status)}
          <span style="font-size:13px;color:#8A8570">${abierto?'▲':'▼'}</span>
        </div>
      </button>
      <div style="display:${abierto?'block':'none'};padding:0 14px 14px">
        ${!detalle ? skeletonBloque(4) : `
          <div style="border-top:1px solid #F0EBDD;padding-top:12px">
            <h3 style="font-size:14px;color:#2F4D2A;margin-bottom:8px">📋 Línea de tiempo</h3>
            <div class="row"><span>📦 Salió a repartir</span><span>${detalle.out_for_delivery_at?new Date(detalle.out_for_delivery_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'—'}</span></div>
            <div class="row"><span>🛵 Hacia la casa del cliente</span><span>${detalle.en_route_at?new Date(detalle.en_route_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'—'}</span></div>
            <div class="row"><span>🏠 Entregado</span><span>${detalle.delivered_at?new Date(detalle.delivered_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'—'}</span></div>
          </div>
          <div style="margin-top:14px"><h3 style="font-size:14px;color:#2F4D2A;margin-bottom:8px">🚚 Reparto</h3>
            <div class="row"><span>Repartidor</span><span>${detalle.driver_name||'Sin asignar'}</span></div>
            <div class="row"><span>Preparado por</span><span>${detalle.preparer_name?`${detalle.preparer_name}${detalle.prepared_at?` · ${new Date(detalle.prepared_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}`:''}`:'Sin preparar todavía'}</span></div>
            ${detalle.frequency?`<div class="row"><span>Frecuencia</span><span>${FRECUENCIAS[detalle.frequency]||detalle.frequency}</span></div>`:''}
            ${detalle.plan_breakdown && detalle.plan_breakdown.length?`<div class="row"><span>Plan</span><span>${detalle.plan_breakdown.map(b=>`${b.qty}×${b.size}`).join(' + ')}</span></div>`:''}
          </div>
          <div style="margin-top:14px"><h3 style="font-size:14px;color:#2F4D2A;margin-bottom:8px">📦 Preparación</h3>
            <div class="row"><span>Preparador asignado</span><span>${r.assigned_preparer ? (staffMap[r.assigned_preparer]||'(desconocido)') : 'Sin asignar (cualquiera lo puede preparar)'}</span></div>
            <div class="field"><label>Asignar puntualmente a</label>
              <select data-asignar-preparador="${r.id}">
                <option value="">Sin asignar — cualquiera lo prepara</option>
                ${(staffRaw||[]).filter(s=>preparadoresRoles[s.user_id]==='preparador'||preparadoresRoles[s.user_id]==='admin').map(s=>`<option value="${s.user_id}" ${r.assigned_preparer===s.user_id?'selected':''}>${s.full_name||'(sin nombre)'}</option>`).join('')}
              </select>
            </div>
          </div>
          <div style="margin-top:14px"><h3 style="font-size:14px;color:#2F4D2A;margin-bottom:8px">💳 Pago</h3>
            <div class="row"><span>Método esperado</span><span>${METODOS_PAGO_LABEL[detalle.expected_payment_method]||detalle.expected_payment_method||'-'}</span></div>
            ${detalle.payment?`<div class="row"><span>Pagó con</span><span><b>$${Number(detalle.payment.amount||0).toLocaleString('es-AR')}</b> · ${METODOS_PAGO_LABEL[detalle.payment.method]||detalle.payment.method}</span></div>`:'<p class="muted" style="font-size:13px">Todavía no hay pago registrado.</p>'}
          </div>
          ${detalle.incidents && detalle.incidents.length?`<div style="margin-top:14px"><h3 style="font-size:14px;color:#B03A2E;margin-bottom:8px">⚠️ Incidencias</h3>
            ${detalle.incidents.map(i=>`<div class="row"><span>${i.failure_reason||'Incidencia'}</span><span style="font-size:12px;color:#8A8570">${new Date(i.created_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</span></div>`).join('')}
          </div>`:''}
          ${detalle.important_note?`<div class="alert warning" style="margin-top:12px">⚠️ ${detalle.important_note}</div>`:''}
          <div style="margin-top:14px"><h3 style="font-size:14px;color:#2F4D2A;margin-bottom:8px">⏰ Restricción horaria</h3>
            <p class="muted" style="font-size:12px;margin-bottom:8px">${detalle.time_restriction_manual===null||detalle.time_restriction_manual===undefined ? `Detección automática: ${tieneRestriccionHoraria(detalle)?`sí encontró (“${textoRestriccionHoraria(detalle)}”)`:'no encontró ninguna'}.` : detalle.time_restriction_manual ? 'Forzada manualmente como restricción.' : 'Forzada manualmente como sin restricción.'}</p>
            <div style="display:flex;gap:6px">
              <button data-restriccion="${r.id}" data-valor="null" style="flex:1;background:${detalle.time_restriction_manual===null||detalle.time_restriction_manual===undefined?'#2F4D2A':'#FFFFFF'};color:${detalle.time_restriction_manual===null||detalle.time_restriction_manual===undefined?'#F5EFE0':'#2F4D2A'};border:1px solid #E3DCC8;border-radius:8px;padding:7px 0;font-size:11px;font-weight:600">Automático</button>
              <button data-restriccion="${r.id}" data-valor="true" style="flex:1;background:${detalle.time_restriction_manual===true?'#2F4D2A':'#FFFFFF'};color:${detalle.time_restriction_manual===true?'#F5EFE0':'#2F4D2A'};border:1px solid #E3DCC8;border-radius:8px;padding:7px 0;font-size:11px;font-weight:600">Forzar SÍ</button>
              <button data-restriccion="${r.id}" data-valor="false" style="flex:1;background:${detalle.time_restriction_manual===false?'#2F4D2A':'#FFFFFF'};color:${detalle.time_restriction_manual===false?'#F5EFE0':'#2F4D2A'};border:1px solid #E3DCC8;border-radius:8px;padding:7px 0;font-size:11px;font-weight:600">Forzar NO</button>
            </div>
          </div>
        `}
      </div>
    </div>`
  }).join('') : estadoVacio('Todavía no hay pedidos cargados.')}
  <p class="muted" style="margin-top:10px">Para reasignar repartidores, andá a Administración → 🚚 Asignación de repartidores.</p>`)

  document.querySelectorAll('[data-filtro-fecha]').forEach(b=>b.onclick=()=>{
    pedidosFechaFiltro = b.dataset.filtroFecha || null
    pedidoExpandido = null
    render()
  })
  document.querySelector('#btn_exportar_pedidos').onclick = ()=>{
    descargarCSV('pedidos_nomades.csv', [
      {label:'N° Pedido', value:'order_number'}, {label:'Fecha', value:'delivery_date'},
      {label:'Cliente', value:r=>{const c=r.customers||{};return `${c.first_name||''} ${c.last_name||''}`}},
      {label:'Barrio', value:r=>r.customers?.neighborhood||''},
      {label:'Huevos', value:'egg_quantity'}, {label:'Estado', value:r=>ESTADOS[r.status]||r.status},
      {label:'Repartidor', value:r=>r.assigned_driver?(staffMap[r.assigned_driver]||''):'Sin asignar'}
    ], ordenados)
  }
  document.querySelectorAll('[data-toggle-pedido]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.togglePedido
    if(pedidoExpandido===id){ pedidoExpandido=null; render(); return }
    pedidoExpandido = id
    if(!pedidoDetalleCache[id]){
      const { data } = await supabase.rpc('admin_order_detail', { p_order_id: id })
      if(data?.found) pedidoDetalleCache[id] = data
    }
    render()
  })
  document.querySelectorAll('[data-restriccion]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.restriccion
    const valor = b.dataset.valor==='true' ? true : b.dataset.valor==='false' ? false : null
    const { error } = await supabase.from('orders').update({ time_restriction_manual: valor }).eq('id', id)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    delete pedidoDetalleCache[id]
    const { data } = await supabase.rpc('admin_order_detail', { p_order_id: id })
    if(data?.found) pedidoDetalleCache[id] = data
    render()
  })
  document.querySelectorAll('[data-asignar-preparador]').forEach(sel=>sel.onchange=async()=>{
    const id = sel.dataset.asignarPreparador
    const { data, error } = await supabase.rpc('admin_asignar_preparador', { p_order_id: id, p_preparer_id: sel.value || null })
    if(error || !data?.ok){ mostrarAlerta('No se pudo asignar: '+(error?.message||data?.error||'')); return }
    render()
  })
}

let repRutaFecha = null

async function repartidor(){
 try{
  if(!repRutaFecha) repRutaFecha = new Date().toISOString().slice(0,10)
  const fecha = repRutaFecha
  const hoy = new Date().toISOString().slice(0,10)
  const mananaD = new Date(); mananaD.setDate(mananaD.getDate()+1)
  const manana = mananaD.toISOString().slice(0,10)
  const diaSemana = new Date(fecha+'T00:00:00').getDay() // 0=domingo, 6=sábado
  const esFinde = diaSemana===0 || diaSemana===6
  const esPasado = fecha < hoy

  const rows = await q('orders','id,status,delivery_date,important_note,time_restriction_manual,assigned_driver,customer_stage,subscriptions(plan_breakdown,egg_quantity,price_at_signup,payment_method),customers(id,first_name,last_name,phone,neighborhood,street,street_number,zone,city)')
  const rowsDelDia = rows.filter(r=>r.delivery_date===fecha && (myRole==='admin' || r.assigned_driver===session?.user?.id))
  const { data: cfgPagoRaw } = await supabase.from('farm_settings').select('key,value').in('key',['wallet_discount_type','wallet_discount_value','mp_wallet_name'])
  const cfgPago = Object.fromEntries((cfgPagoRaw||[]).map(x=>[x.key,x.value]))
  const planDe = (r)=>{ const sb=r.subscriptions||{}; return (sb.plan_breakdown&&sb.plan_breakdown.length) ? sb.plan_breakdown.map(b=>`${b.qty} maple${b.qty>1?'s':''} de ${b.size}`).join(' + ') : `${sb.egg_quantity||0} huevos` }
  const montoDe = (r)=>{ const sb=r.subscriptions||{}; const base=Number(sb.price_at_signup||0)
    return esPagoConDescuento(sb.payment_method) ? Math.max(0, base - calcularDescuentoBilletera(base, cfgPago.wallet_discount_type, cfgPago.wallet_discount_value)) : base }
  const comoPagaDe = (r)=>{ const m=(r.subscriptions||{}).payment_method
    return m==='transfer' ? 'por transferencia' : m==='mp' ? `por ${cfgPago.mp_wallet_name||'billetera'}` : 'en efectivo' }

  const { data: miVehiculoRaw } = await supabase.from('vehicles').select('type,brand,model,color,plate').eq('assigned_to', session.user.id).eq('active', true).maybeSingle()
  const miVehiculo = miVehiculoRaw || null
  const miNombre = staffProfile?.full_name || 'tu repartidor'

  let tituloChico = fecha===hoy ? 'Entregas de hoy' : fecha===manana ? 'Entregas de mañana' : 'Entregas'
  const subtitulo = formatearFecha(fecha)

  // Una entrega abierta bloquea el resto de la ruta. Sin esto, el repartidor
  // arranca la siguiente y la anterior queda colgada: plata cobrada fuera de la caja
  // o un cliente esperando. Ya pasó, y nadie se enteró hasta cinco días después.
  const { data: abiertasRaw } = await supabase.rpc('entregas_sin_cerrar',
    myRole==='admin' ? {} : { p_driver: session.user.id })
  const abiertas = abiertasRaw || []
  const entregaAbierta = abiertas.find(a=>!myRole || myRole!=='admin' || a.driver_id===session?.user?.id) || abiertas[0] || null
  const hayBloqueo = !!entregaAbierta

  const tiempoAbierta = (min)=>{
    const m = Number(min)||0
    if(m < 60) return `${m} min`
    const h = Math.floor(m/60), d = Math.floor(h/24)
    if(d >= 1) return `${d} día${d>1?'s':''}`
    return `${h} h ${m%60} min`
  }

  const bannerBloqueo = entregaAbierta ? `<div style="background:${NOM.ambarClaro};border-left:3px solid ${NOM.ambar};border-radius:10px;padding:12px 13px;margin-bottom:12px">
    <div style="font-size:13.5px;font-weight:600;color:#854F0B">🚚 Tenés una entrega sin cerrar</div>
    <div style="font-size:12.5px;color:#BA7517;margin-top:3px">${entregaAbierta.nombre} · ${entregaAbierta.direccion||''} · saliste hace ${tiempoAbierta(entregaAbierta.minutos)}</div>
    <div style="font-size:12.5px;color:#BA7517;margin-top:5px">Cerrala antes de seguir: confirmá la entrega o contá qué pasó.</div>
    <button data-abrir-bloqueo="${entregaAbierta.order_id}" style="margin-top:10px;background:${NOM.verde};color:#F7F4EC;border:none;border-radius:9px;padding:9px 15px;font-size:12.5px;font-weight:600">Abrir esa entrega</button>
  </div>` : ''

  const tarjetaCliente = (r)=>{
    const c=r.customers||{}
    const telLimpio=(c.phone||'').replace(/\D/g,'')
    const direccionCompleta = `${c.street||''} ${c.street_number||''}, ${c.neighborhood||''}, ${c.city||''}`
    const estadoLabel = r.customer_stage==='en_route' ? '🛵 En camino (avisado)' : r.customer_stage==='prepared' ? '✅ Preparado, listo para llevar' : r.customer_stage==='preparing' ? '🥚 Preparando' : ''
    return `<div style="margin-bottom:8px">
      <div style="font-weight:700;color:#2F4D2A">${c.street_number||''} · Cliente: ${c.first_name||''} ${c.last_name||''}</div>
      ${telLimpio?`<a href="tel:${telLimpio}" style="font-size:12px;color:#2F4D2A;text-decoration:none;display:inline-flex;align-items:center;gap:4px;margin-top:4px;background:#F5EFE0;border-radius:8px;padding:5px 10px;font-weight:600">📞 Llamar · ${c.phone}</a>`:`<div style="font-size:12px;color:#8A8570;margin-top:2px">Sin teléfono</div>`}
      ${estadoLabel?`<div style="font-size:11px;color:#B85C00;margin-top:2px">${estadoLabel}</div>`:''}
      ${tieneRestriccionHoraria(r)?`<div class="alert warning" style="margin-top:6px">⏰ ${textoRestriccionHoraria(r)}</div>`:''}
      ${r.important_note && !tieneRestriccionHoraria(r)?`<div class="alert warning" style="margin-top:6px">⚠️ ${r.important_note}</div>`:''}
      <div style="display:flex;gap:6px;margin-top:8px">
        ${(hayBloqueo && r.id !== entregaAbierta.order_id)
          ? `<button disabled style="flex:1;background:#D8D4C6;color:#8A8570;border:none;border-radius:10px;padding:9px 0;font-size:11px;font-weight:600">Abrir</button>`
          : `<button data-delivery="${r.id}" style="flex:1;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:9px 0;font-size:11px;font-weight:600">Abrir</button>`}
        <button data-maps="${encodeURIComponent(direccionCompleta)}" style="flex:1;background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8;border-radius:10px;padding:9px 0;font-size:11px;font-weight:600">🧭 Maps</button>
        ${telLimpio?`<button data-avisar="${r.id}" data-tel="${telLimpio}" data-nombre="${c.first_name||''}" data-driver="${r.assigned_driver||session.user.id}" data-plan="${planDe(r)}" data-monto="${montoDe(r)}" data-comopaga="${comoPagaDe(r)}" style="flex:1;background:#25D366;color:#fff;border:none;border-radius:10px;padding:9px 0;font-size:11px;font-weight:600">🛵 Voy</button>`:''}
      </div>
    </div>`
  }

  let contenido = ''
  if(!rowsDelDia.length){
    contenido = pCard(`<p class="muted" style="margin:0">${esFinde?'No hay entregas los fines de semana.':'No tenés entregas para repartir este día.'}</p>`)
  } else if(esPasado){
    const entregados = rowsDelDia.filter(r=>r.status==='delivered').length
    const incidencias = rowsDelDia.filter(r=>r.status==='incident').length
    contenido = pCard(`
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <div style="flex:1;background:#2F4D2A;border-radius:10px;padding:8px;text-align:center"><div style="color:#C9D8B0;font-size:11px">Entregados</div><div style="color:#F5EFE0;font-size:16px;font-weight:700">${entregados}</div></div>
        <div style="flex:1;background:#B03A2E;border-radius:10px;padding:8px;text-align:center"><div style="color:#F7C1C1;font-size:11px">Incidencias</div><div style="color:#FFFFFF;font-size:16px;font-weight:700">${incidencias}</div></div>
      </div>
      ${rowsDelDia.map(r=>{
        const c=r.customers||{}
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #F0EBDD"><span style="font-size:13px;color:#3A3A34">${c.first_name||''} ${c.last_name||''} · ${c.neighborhood||''}</span>${pPill(ESTADOS[r.status]||r.status)}</div>`
      }).join('')}
    `)
  } else {
    const pendientes = rowsDelDia.filter(r=>['pending','assigned','out_for_delivery','rescheduled'].includes(r.status))

    // Cartel de restricciones horarias de hoy
    const conRestriccion = pendientes.filter(tieneRestriccionHoraria)
    const cartelRestricciones = conRestriccion.length ? `<div style="background:#FBE4CC;border-radius:12px;padding:12px 14px;margin-bottom:12px">
      <div style="font-size:12px;font-weight:700;color:#B85C00;margin-bottom:6px">⏰ Restricciones horarias de hoy</div>
      ${conRestriccion.map(r=>{ const c=r.customers||{}; return `<div style="font-size:12px;color:#7A4A0E">• ${c.first_name||''} ${c.last_name||''} (${c.neighborhood||''}) — ${textoRestriccionHoraria(r)}</div>` }).join('')}
    </div>` : ''

    // La parada actual ("Voy" ya tocado) sube arriba de todo
    const actual = pendientes.find(r=>r.customer_stage==='en_route')
    const tarjetaActual = actual ? `<div style="margin-bottom:2px"><span style="font-size:11px;color:#8A8570;font-weight:600">TU PARADA ACTUAL</span></div>${pCard(`
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px"><span style="font-size:11px;color:#8A8570;font-weight:600">📍 BARRIO</span></div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:16px;font-weight:700;color:#2F4D2A">${actual.customers?.neighborhood||'-'}</span>
        <span style="background:#2F4D2A;color:#F5EFE0;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px">🛵 En camino</span>
      </div>
      ${tarjetaCliente(actual)}
    `, 'margin-bottom:14px;border:2px solid #2F4D2A')}` : ''

    // Resto: agrupado por Zona → Barrio (alfabético) → Calle (más pedidos primero)
    const resto = pendientes.filter(r=>r!==actual)
    const grouped={}
    resto.forEach(r=>{
      const c=r.customers||{}; const z=c.zone||'sin_zona'; const b=c.neighborhood||'Sin barrio'; const s=c.street||'Sin calle';
      grouped[z]??={}; grouped[z][b]??={}; grouped[z][b][s]??=[]; grouped[z][b][s].push(r)
    })
    const zonasOrdenadas = Object.keys(grouped).sort((a,b)=>{
      const ia = ORDEN_ZONAS.indexOf(a), ib = ORDEN_ZONAS.indexOf(b)
      return (ia===-1?99:ia) - (ib===-1?99:ib)
    })
    const contenidoResto = zonasOrdenadas.map(z=>{
      const barrios = grouped[z]
      const barriosOrdenados = Object.keys(barrios).sort((a,b)=>a.localeCompare(b,'es'))
      return barriosOrdenados.map(b=>{
        const streets = barrios[b]
        const primerCliente = Object.values(streets)[0]?.[0]?.customers||{}
        return pCard(`
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px"><span style="font-size:11px;color:#8A8570;font-weight:600">📍 BARRIO</span></div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px">
            <span style="font-size:18px;font-weight:700;color:#2F4D2A">${b}</span>
            ${zonaBadge(primerCliente.zone)}
          </div>
          <div style="font-size:12px;color:#8A8570;margin-bottom:10px">Ciudad: ${primerCliente.city||'-'}</div>
          ${Object.entries(streets).sort((a,b)=>b[1].length-a[1].length).map(([s,rs])=>`
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid #F0EBDD">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                <span style="font-weight:600;color:#2F4D2A;font-size:14px">Calle: ${s}</span>
                ${pPill(`${rs.length} entrega(s)`)}
              </div>
              ${rs.map(tarjetaCliente).join('')}
            </div>
          `).join('')}
        `, 'margin-bottom:10px')
      }).join('')
    }).join('')

    contenido = cartelRestricciones + tarjetaActual + contenidoResto
    if(!tarjetaActual && !contenidoResto) contenido = cartelRestricciones + estadoVacio('No hay entregas pendientes para este día (puede que ya estén todas entregadas).')
  }

  layout(`<h2>🚚 ${tituloChico}</h2>
  <p class="muted" style="margin-top:-8px;margin-bottom:12px">${subtitulo}</p>
  ${bannerBloqueo}
  <div class="field"><label>Elegí la fecha a ver</label><input type="date" id="rep_ruta_fecha" value="${fecha}"/></div>
  <div style="display:flex;gap:8px;margin-bottom:12px">
    <button class="btn ghost" id="btn_ver_mapa_repartidor" style="flex:1">🗺️ Ver mapa</button>
    <button id="btn_sali_a_repartir" style="flex:1;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;font-size:13px;font-weight:600">📦 Salí a repartir</button>
  </div>
  <div class="alert warning"><b>⚠️ ATENCIÓN</b><br>Las restricciones horarias y observaciones importantes aparecen destacadas.</div>
  ${contenido}`)

  const btnBloqueo = document.querySelector('[data-abrir-bloqueo]')
  if(btnBloqueo) btnBloqueo.onclick = ()=>openDelivery(btnBloqueo.dataset.abrirBloqueo)
  document.querySelector('#rep_ruta_fecha').onchange = (e)=>{ repRutaFecha = e.target.value; render() }
  document.querySelectorAll('[data-delivery]').forEach(b=>b.onclick=()=>openDelivery(b.dataset.delivery))
  document.querySelectorAll('[data-maps]').forEach(b=>b.onclick=()=>{
    window.open('https://www.google.com/maps/search/?api=1&query='+b.dataset.maps,'_blank')
  })
  document.querySelectorAll('[data-avisar]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.avisar
    if(hayBloqueo && id !== entregaAbierta.order_id){ mostrarAlerta(`Primero cerrá la entrega de ${entregaAbierta.nombre}.`); return }
    const driverId = b.dataset.driver || session.user.id
    // Solo un pedido puede estar "en camino" a la vez para ese repartidor
    await supabase.from('orders').update({ customer_stage: null }).eq('assigned_driver', driverId).eq('customer_stage', 'en_route')
    const { error } = await supabase.from('orders').update({ customer_stage: 'en_route', en_route_at: new Date().toISOString() }).eq('id', id)
    if(error){ mostrarAlerta('No se pudo actualizar el estado: '+error.message); return }
    const datosVehiculo = miVehiculo ? ` en mi ${miVehiculo.type==='moto'?'moto':'camioneta'} ${miVehiculo.brand||''} ${miVehiculo.model||''}${miVehiculo.color?` color ${miVehiculo.color}`:''}, patente ${miVehiculo.plate}` : ''
    // Decirle qué lleva y cuánto cobra le deja preparar la plata antes de abrir la puerta.
    const lineaPedido = b.dataset.plan ? `\n\nTe llevo: ${b.dataset.plan}` : ''
    const lineaMonto = b.dataset.monto ? `\nA pagar: $${Number(b.dataset.monto).toLocaleString('es-AR')} ${b.dataset.comopaga||''}` : ''
    const mensaje = encodeURIComponent(`Hola ${b.dataset.nombre}! Soy ${miNombre}, tu repartidor de NÓMADES 🛵 Ya estoy yendo hacia tu casa${datosVehiculo}. Llego en los próximos minutos.${lineaPedido}${lineaMonto}\n\n¡Nos vemos!`)
    mostrarAlerta('✅ Estado actualizado a "Hacia tu casa". Ahora se abre WhatsApp con el aviso.')
    window.open(`https://wa.me/54${b.dataset.tel}?text=${mensaje}`, '_blank')
    render()
  })
  document.querySelector('#btn_ver_mapa_repartidor').onclick = ()=>{ current='repartidor-mapa'; render() }
  document.querySelector('#btn_sali_a_repartir').onclick = async ()=>{
    if(hayBloqueo){ mostrarAlerta(`Primero cerrá la entrega de ${entregaAbierta.nombre}. Confirmala o registrá qué pasó.`); return }
    const esAdmin = myRole==='admin'
    if(!(await mostrarConfirmacion(`¿Marcar como "En reparto" ${esAdmin?'todos los pedidos pendientes de todos los repartidores':'todos tus pedidos pendientes'} del ${subtitulo}?`)))return
    let query = supabase.from('orders').update({ status: 'out_for_delivery', out_for_delivery_at: new Date().toISOString() }).eq('delivery_date', fecha).in('status',['pending','assigned'])
    if(!esAdmin) query = query.eq('assigned_driver', session.user.id)
    const { data, error } = await query.select('id')
    if(error){ mostrarAlerta('Error: '+error.message); return }
    if(!data || !data.length){ mostrarAlerta(`⚠️ No había pedidos pendientes para marcar en el ${subtitulo}. Revisá que estés parado en la fecha correcta arriba.`); return }
    mostrarAlerta(`✅ Se marcaron ${data.length} pedido(s) como "En reparto". Los clientes de ese día ya lo ven en su cuenta.`)
    render()
  }
 } catch(err) {
  app.innerHTML = `<div class="shell"><div class="alert danger" style="margin-top:20px"><b>⚠️ Error al cargar la ruta</b><br>Mandale esto a Claude:<br><code style="font-size:11px;word-break:break-all">${(err && err.message) || err}</code></div><button class="btn ghost" id="btn_volver_error" style="margin-top:12px">← Volver a Inicio</button></div>`
  const b = document.querySelector('#btn_volver_error')
  if(b) b.onclick = ()=>{ current='inicio'; render() }
  console.error(err)
 }
}

let repMapaFecha = null
let repMostrarProyeccion = false
let statsVehiculoActual = null
let vehiculoEditando = null
let mostrarFormNuevoVehiculo = false
let adminRendicionFecha = '' // fecha elegida en Rendición y conciliación ('' = hoy)
let pagoEditando = null // id del pago cuyo monto se está editando
let mostrarFormDiferencia = false
let cuentaRepartidorAbierta = null // user_id del repartidor cuya cuenta corriente está expandida
let mostrarFormNuevaCategoria = false
let mostrarSeccionCategorias = false
let mostrarSeccionMovimiento = false
let cobrosSubSeccion = null // 'transfer' | 'mp' | null
let comisionTipoSeleccionado = {} // vendedor_id -> 'fixed' | 'percent', mientras no se guarda
let mostrarFormNuevoProducto = false
let productoControlaVenc = false
let mostrarFormNuevoProveedor = false
let proveedorTipoNuevo = 'almacen'
let productoExpandido = null
let productoDetalleCache = {}
let proveedorPedidoSeleccionado = null
let pedidoProveedorCantidades = {} // product_id -> { qty, unitType }
let busquedaProductoPedido = ''
const SALTO_MS = 700
let pedidoProveedorTipoEntrega = 'entrega'
let pedidoProveedorGenerado = null // texto del pedido ya armado
let pedidoProveedorNumero = null // número correlativo del pedido ya generado
let pedidoProveedorItems = null // items estructurados del último pedido generado, para armar el PDF
let pedidoProveedorEditandoId = null // si no es null, "Generar pedido" edita este pedido en vez de crear uno nuevo
let pedidoProveedorRecibiendoId = null // id del pedido que se está checkeando al recibir
let pedidoProveedorRecibido = {} // item_id -> { checked, received_qty }
let pedidoProveedorRecienRecibido = null // { id, total_a_pagar } — para ofrecer pagar justo después de recibir
let pagoProveedorSeleccionado = null // supplier_id elegido en "Pagar pedido"
let pagoPedidoSeleccionado = null // order_id elegido para pagar
let pagoTipo = 'total' // 'total' | 'parcial'
let pagoMontoParcial = ''
let cuentaCorrienteClienteSeleccionado = null // customer_id de mayorista elegido en "Cuenta corriente de mayoristas"
let cuentaCorrienteDetalleCache = {} // customer_id -> pedidos detalle
let cobroPedidoSeleccionado = null // order_id elegido para cobrarle a un mayorista
let cobroTipo = 'total'
let cobroMontoParcial = ''
let historialVehiculoActual = null

async function verHistorialVehiculo(v){
  historialVehiculoActual = v
  current = 'vehiculo-historial'
  render()
}

async function vehiculoHistorial(){
  const v = historialVehiculoActual
  if(!v){ current='admin'; return render() }
  layout(`
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
    <button id="btn_volver_historial" style="background:none;border:none;font-size:20px;color:#2F4D2A;padding:4px">←</button>
    <div>
      <div style="font-size:11px;color:#8A8570;text-transform:uppercase;letter-spacing:0.5px">Historial</div>
      <h2 style="margin:0;color:#2F4D2A">${v.plate}</h2>
    </div>
  </div>
  <button id="btn_imprimir_historial" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:12px;padding:12px 0;font-size:14px;font-weight:600;margin-bottom:16px;display:flex;align-items:center;justify-content:center;gap:8px">🖨️ Imprimir / Guardar como PDF</button>
  <div id="historial_contenido">${skeletonBloque(4)}</div>`)
  document.querySelector('#btn_volver_historial').onclick = ()=>{ current='admin'; adminOpenSection='vehiculos'; render() }
  document.querySelector('#btn_imprimir_historial').onclick = ()=>window.print()

  const [{ data: serviciosRaw },{ data: staffRaw }] = await Promise.all([
    supabase.from('vehicle_services').select('id,service_date,km,description,parts_used,cost,payment_method,paid_by,payment_status,responsible_id').eq('vehicle_id', v.id).order('service_date',{ascending:false}),
    supabase.from('staff_roles').select('user_id,full_name')
  ])
  const servicios = serviciosRaw || []
  const staffMap = Object.fromEntries((staffRaw||[]).map(s=>[s.user_id,s.full_name]))
  const box = document.querySelector('#historial_contenido')
  box.innerHTML = `
    ${pCard(`
      ${v.photo_url?`<div style="margin:-14px -16px 12px"><img src="${v.photo_url}" style="width:100%;height:140px;object-fit:cover;border-radius:14px 14px 0 0"/></div>`:''}
      <div style="font-size:18px;font-weight:700;color:#2F4D2A">${v.brand||''} ${v.model||''}</div>
      <div style="font-size:12px;color:#8A8570;margin-top:2px">${v.type==='moto'?'🏍️ Moto':'🚚 Camioneta'} · Patente ${v.plate}</div>
      <div style="margin-top:10px;background:#F5EFE0;border-radius:10px;padding:8px 12px;display:inline-block">
        <span style="font-size:12px;color:#8A8570">Kilómetros actuales</span><br>
        <span style="font-size:16px;font-weight:700;color:#2F4D2A">${Math.round(v.current_km)} km</span>
      </div>
    `)}
    <h3 style="font-size:15px;color:#2F4D2A;margin:18px 0 8px">Historial de service y mantenimiento</h3>
    ${servicios.length? servicios.map(s=>{
      const fecha = new Date(s.service_date+'T00:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'})
      return pCard(`
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
          <div>
            <div style="font-weight:700;color:#2F4D2A">${fecha}</div>
            <div style="font-size:12px;color:#8A8570;margin-top:2px">${Math.round(s.km||0)} km</div>
            ${s.description?`<div style="font-size:13px;color:#3A3A34;margin-top:6px">${s.description}</div>`:''}
            ${s.parts_used?`<div style="font-size:12px;color:#8A8570;margin-top:3px">🔩 ${s.parts_used}</div>`:''}
            <div style="font-size:12px;color:#8A8570;margin-top:3px">Responsable: ${staffMap[s.responsible_id]||'-'}</div>
          </div>
          <div style="text-align:right;white-space:nowrap">
            ${s.cost?`<div style="font-weight:700;color:#2F4D2A">$${Number(s.cost).toLocaleString('es-AR')}</div>`:''}
            <div style="font-size:11px;color:#8A8570;margin-top:2px">${METODOS_PAGO_LABEL[s.payment_method]||s.payment_method||''}${s.paid_by==='admin'?' · Admin':''}</div>
          </div>
        </div>
      `, 'margin-bottom:8px')
    }).join('') : '<p class="muted">Sin registros todavía.</p>'}`
}

async function verEstadisticasVehiculo(v){
  statsVehiculoActual = v
  current = 'vehiculo-stats'
  render()
}

async function vehiculoStats(){
  const v = statsVehiculoActual
  if(!v){ current='admin'; return render() }
  layout(`
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
    <button id="btn_volver_stats" style="background:none;border:none;font-size:20px;color:#2F4D2A;padding:4px">←</button>
    <div>
      <div style="font-size:11px;color:#8A8570;text-transform:uppercase;letter-spacing:0.5px">Estadísticas</div>
      <h2 style="margin:0;color:#2F4D2A">${v.plate}</h2>
    </div>
  </div>
  <div id="stats_contenido">${pCard('<p class="muted" style="margin:0">Calculando…</p>')}</div>`)
  document.querySelector('#btn_volver_stats').onclick = ()=>{ current='admin'; adminOpenSection='vehiculos'; render() }

  const { data } = await supabase.rpc('vehicle_stats', { p_vehicle_id: v.id })
  const box = document.querySelector('#stats_contenido')
  if(!data || data.cargas < 2){
    box.innerHTML = pCard('<p class="muted" style="margin:0">Todavía no hay suficientes cargas registradas para calcular estadísticas (hacen falta al menos 2).</p>')
    return
  }
  const statMini = (label,value)=>`<div style="flex:1;background:#2F4D2A;border-radius:12px;padding:10px 8px;text-align:center"><div style="color:#C9D8B0;font-size:11px">${label}</div><div style="color:#F5EFE0;font-size:17px;font-weight:700">${value}</div></div>`
  const rowStat = (label,value)=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #F0EBDD"><span style="font-size:13px;color:#5F5E5A">${label}</span><b style="color:#2F4D2A">${value}</b></div>`
  box.innerHTML = `
    <h3 style="font-size:15px;color:#2F4D2A;margin-bottom:8px">Kilómetros recorridos</h3>
    <div style="display:flex;gap:8px">
      ${statMini('Por día', data.km_por_dia ?? '-')}
      ${statMini('Por mes', data.km_por_mes ?? '-')}
      ${statMini('Por año', data.km_por_anio ?? '-')}
    </div>
    <p class="muted" style="font-size:12px;margin-top:8px">Calculado sobre ${data.km_totales} km en ${data.dias_totales} día(s), con ${data.cargas} carga(s) registradas.</p>
    ${pCard(`
      <h3 style="font-size:15px;color:#2F4D2A;margin:0 0 4px">Rendimiento</h3>
      ${rowStat('Kilómetros por litro', `${data.km_por_litro ?? '-'} km/L`)}
      ${rowStat('Costo por kilómetro', data.costo_por_km?`$${Number(data.costo_por_km).toLocaleString('es-AR')}`:'-')}
      ${rowStat('Litros cargados (total)', data.litros_totales ?? '-')}
      ${rowStat('Gasto en combustible (total)', `$${Number(data.gasto_total||0).toLocaleString('es-AR')}`)}
    `, 'margin-top:14px')}
    ${data.por_mes?.length?pCard(`
      <h3 style="font-size:15px;color:#2F4D2A;margin:0 0 4px">Últimos meses</h3>
      ${data.por_mes.map(m=>rowStat(m.mes, `${Math.round(m.km)} km`)).join('')}
    `, 'margin-top:10px'):''}
  `
}


function proximaFechaProyectada(fecha, frecuencia){
  const d = new Date(fecha+'T00:00:00')
  if(frecuencia==='weekly') d.setDate(d.getDate()+7)
  else if(frecuencia==='biweekly') d.setDate(d.getDate()+14)
  else if(frecuencia==='monthly') d.setMonth(d.getMonth()+1)
  else d.setDate(d.getDate()+7)
  // las entregas son de lunes a viernes: si cae sábado o domingo, se corre al lunes
  const dow = d.getDay() // 0=domingo, 6=sábado
  if(dow===0) d.setDate(d.getDate()+1)
  else if(dow===6) d.setDate(d.getDate()+2)
  return d.toISOString().slice(0,10)
}

async function mapaRepartidor(){
  if(!repMapaFecha) repMapaFecha = new Date().toISOString().slice(0,10)
  const fechaLabel = formatearFecha(repMapaFecha)
  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><button class="btn ghost" id="btn_volver_repartidor" style="padding:6px 12px">← Volver</button><h2 style="margin:0">🗺️ Mapa</h2></div>
  <div class="field"><label>Fecha</label><input type="date" id="rep_mapa_fecha" value="${repMapaFecha}"/></div>
  <div class="grid three" style="margin-bottom:10px">
    <button class="btn ghost" id="btn_dia_ant">← Día anterior</button>
    <button class="btn ghost" id="btn_dia_hoy">Hoy</button>
    <button class="btn ghost" id="btn_dia_sig">Día siguiente →</button>
  </div>
  <p class="muted" style="margin-bottom:8px">${fechaLabel}</p>
  <label class="row" style="cursor:pointer"><span>✨ Mostrar proyección de entregas futuras</span><input type="checkbox" id="rep_toggle_proyeccion" ${repMostrarProyeccion?'checked':''}/></label>
  <div id="rep_mapa_estado" class="muted" style="margin:8px 0">Cargando mapa…</div>
  <div id="rep_mapa_contenedor" style="height:380px;border-radius:12px;overflow:hidden;background:#eee"></div>
  <div class="card" style="margin-top:12px">
    <div class="row"><span>🔴 Falta entregar (pedido real)</span></div>
    <div class="row"><span>🟢 Ya entregado (con hora)</span></div>
    ${repMostrarProyeccion?'<div class="row"><span>🟣 Proyectado — todavía no es un pedido confirmado</span></div>':''}
    <div class="row"><span>⚪ Otros clientes (no les tocaba esta fecha)</span></div>
  </div>`)
  document.querySelector('#btn_volver_repartidor').onclick = ()=>{ current='repartidor'; render() }
  document.querySelector('#rep_mapa_fecha').onchange = (e)=>{ repMapaFecha = e.target.value; render() }
  document.querySelector('#btn_dia_ant').onclick = ()=>{ const d=new Date(repMapaFecha+'T00:00:00'); d.setDate(d.getDate()-1); repMapaFecha=d.toISOString().slice(0,10); render() }
  document.querySelector('#btn_dia_hoy').onclick = ()=>{ repMapaFecha = new Date().toISOString().slice(0,10); render() }
  document.querySelector('#btn_dia_sig').onclick = ()=>{ const d=new Date(repMapaFecha+'T00:00:00'); d.setDate(d.getDate()+1); repMapaFecha=d.toISOString().slice(0,10); render() }
  document.querySelector('#rep_toggle_proyeccion').onchange = (e)=>{ repMostrarProyeccion = e.target.checked; render() }

  try{ await cargarLeaflet() }
  catch(e){ document.querySelector('#rep_mapa_estado').textContent = 'No pudimos cargar el mapa. Revisá tu conexión.'; return }

  const fecha = repMapaFecha
  const { data: ordersRaw } = await supabase.from('orders').select('id,status,delivery_date,delivered_at,assigned_driver,customers(id,first_name,last_name,phone,neighborhood,street,street_number,zone,latitude,longitude)')
  const orders = ordersRaw || []
  const misPedidos = orders.filter(o=>o.delivery_date===fecha && (myRole==='admin' || o.assigned_driver===session?.user?.id))
  const idsClientesHoy = new Set(misPedidos.map(o=>o.customers?.id).filter(Boolean))
  const { data: todosClientesRaw } = await supabase.from('customers').select('id,first_name,last_name,phone,neighborhood,street,street_number,zone,latitude,longitude').neq('status','baja')
  const todosClientes = todosClientesRaw || []

  const pendientes = misPedidos.filter(o=>['pending','assigned','out_for_delivery','rescheduled'].includes(o.status) && o.customers?.latitude!=null)
  const entregados = misPedidos.filter(o=>o.status==='delivered' && o.customers?.latitude!=null)

  // Proyección: para suscripciones activas, calculamos si su próxima fecha (extendida según frecuencia) cae en el día elegido
  let proyectados = []
  if(repMostrarProyeccion){
    const { data: subsRaw } = await supabase.from('subscriptions').select('id,customer_id,frequency,next_delivery_date,status').eq('status','active')
    const subs = subsRaw || []
    const clienteMap = Object.fromEntries(todosClientes.map(c=>[c.id,c]))
    let zoneDrivers = {}, neighDrivers = {}, modo = 'zone'
    if(myRole!=='admin'){
      const [{data:zd},{data:nd},{data:fs}] = await Promise.all([
        supabase.from('zone_drivers').select('zone,driver_user_id'),
        supabase.from('neighborhood_drivers').select('neighborhood,driver_user_id'),
        supabase.from('farm_settings').select('value').eq('key','assignment_mode').single()
      ])
      zoneDrivers = Object.fromEntries((zd||[]).map(z=>[z.zone,z.driver_user_id]))
      neighDrivers = Object.fromEntries((nd||[]).map(n=>[n.neighborhood,n.driver_user_id]))
      modo = fs?.value || 'zone'
    }
    const meCorresponde = (c)=>{
      if(myRole==='admin') return true
      if(modo==='neighborhood') return (neighDrivers[c.neighborhood] || zoneDrivers[c.zone]) === session?.user?.id
      return zoneDrivers[c.zone] === session?.user?.id
    }
    subs.forEach(s=>{
      if(!s.next_delivery_date || idsClientesHoy.has(s.customer_id)) return
      let cursor = s.next_delivery_date, i=0
      while(cursor < fecha && i<60){ cursor = proximaFechaProyectada(cursor, s.frequency); i++ }
      if(cursor === fecha && cursor !== s.next_delivery_date){
        const c = clienteMap[s.customer_id]
        if(c && c.latitude!=null && meCorresponde(c)) proyectados.push(c)
      }
    })
  }

  const idsHoyYProyectados = new Set([...idsClientesHoy, ...proyectados.map(c=>c.id)])
  const otrosClientes = todosClientes.filter(c=>!idsHoyYProyectados.has(c.id) && c.latitude!=null && c.longitude!=null)

  const estado = document.querySelector('#rep_mapa_estado')
  estado.textContent = `${pendientes.length} por entregar, ${entregados.length} entregado(s)${repMostrarProyeccion?`, ${proyectados.length} proyectado(s)`:''}.`

  const puntos = [...pendientes, ...entregados].map(o=>o.customers).filter(Boolean)
  const centro = puntos.length ? [puntos[0].latitude, puntos[0].longitude] : [-32.9468, -60.6393]
  const map = L.map('rep_mapa_contenedor').setView(centro, 12)
  L.tileLayer(TILES_URL, { maxZoom: 19, attribution: TILES_ATRIB }).addTo(map)

  const marcador = (c, color, radio, popupExtra, dashArray)=> L.circleMarker([c.latitude, c.longitude], { radius: radio, color, fillColor: color, fillOpacity: dashArray?0.15:0.9, weight: 2, dashArray })
    .bindPopup(`<b>${c.first_name||''} ${c.last_name||''}</b><br>${c.street||''} ${c.street_number||''}<br>📞 ${c.phone||'-'}${popupExtra||''}`)

  const grupo = []
  otrosClientes.forEach(c=>{ marcador(c, '#B4B2A9', 5).addTo(map) })
  pendientes.forEach(o=>{ const m = marcador(o.customers, '#D14A3D', 8).addTo(map); grupo.push(m) })
  entregados.forEach(o=>{
    const hora = o.delivered_at ? new Date(o.delivered_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) : ''
    const m = marcador(o.customers, '#3B6D11', 8, hora?`<br>✅ Entregado ${hora}`:'').addTo(map)
    grupo.push(m)
  })
  proyectados.forEach(c=>{ const m = marcador(c, '#7F77DD', 7, '<br>🟣 Proyectado, todavía no confirmado', '4,4').addTo(map); grupo.push(m) })

  if(grupo.length>1){ map.fitBounds(L.featureGroup(grupo).getBounds().pad(0.25)) }
}


async function historialRepartidor(){
  const { data, error } = await supabase.rpc('repartidor_historial', {})
  const items = data || []
  const porFecha = {}
  items.forEach(it=>{ porFecha[it.date] ??= []; porFecha[it.date].push(it) })
  const fechas = Object.keys(porFecha).sort((a,b)=>b.localeCompare(a))
  const html = fechas.length ? fechas.map(fecha=>{
    const entregas = porFecha[fecha]
    const entregados = entregas.filter(e=>e.type==='delivered').length
    const incidencias = entregas.filter(e=>e.type==='incident').length
    const fechaLabel = formatearFecha(fecha)
    return `<details class="card" style="margin-bottom:10px">
      <summary style="cursor:pointer;font-weight:800;list-style:none">${fechaLabel} — ${entregados} entregado(s)${incidencias?`, ${incidencias} incidencia(s)`:''}</summary>
      <div style="margin-top:12px">
        ${entregas.map(e=>{
          if(e.type==='delivered'){
            const distinto = e.expected_method && e.expected_method !== e.payment_method
            return `<div class="row"><span>🟢 <b>${e.time}</b> · ${e.customer_name}<br><small>${e.address}</small><br><small>${e.description}</small></span><span style="text-align:right"><b>$${Number(e.amount||0).toLocaleString('es-AR')}</b><br><small>${METODOS_PAGO_LABEL[e.payment_method]||e.payment_method}${distinto?` (esperado: ${METODOS_PAGO_LABEL[e.expected_method]||e.expected_method})`:''}</small></span></div>`
          }
          return `<div class="row"><span>🔴 <b>${e.time}</b> · ${e.customer_name}<br><small>${e.address}</small></span><span class="badge" style="background:#a33">⚠️ ${e.failure_reason||'Incidencia'}</span></div>`
        }).join('')}
      </div>
    </details>`
  }).join('') : '<div class="card"><p class="muted">Todavía no tenés entregas registradas.</p></div>'
  layout(`<h2>📋 Historial de entregas</h2>${html}`)
}

// ============ REVISIÓN Y CONFORMIDAD DE LA ENTREGA ============
async function revisionConformidad(orderId, clienteRef, desde){
  const dni = desde === 'repartidor' ? clienteRef.dni : cuenta.customer.dni
  const customerId = desde === 'repartidor' ? clienteRef.id : cuenta.customer.id

  const { data } = await supabase.rpc('pedido_para_revisar', { p_dni: dni, p_customer_id: customerId })
  if(!data?.ok || !data.hay){
    mostrarAlerta('No hay ningún pedido esperando revisión.')
    if(desde === 'repartidor') openDelivery(orderId); else render()
    return
  }

  const items = (data.items||[]).map(it=>({ ...it, recibida: it.cantidad }))
  let resolucion = null
  let enviando = false

  const hayFaltante = ()=>items.some(it=>Number(it.recibida) < Number(it.cantidad))
  const montoFaltante = ()=>items.reduce((s,it)=>{
    const falta = Math.max(0, Number(it.cantidad) - Number(it.recibida))
    return s + falta * Number(it.precio_unitario||0)
  }, 0)

  const dibujar = ()=>{
    const falta = hayFaltante()
    const montoF = montoFaltante()

    layout(`<div style="background:${NOM.verde};border-radius:16px;padding:16px;margin-bottom:13px">
      <div style="font-size:12px;color:${NOM.verdePastel}">${data.repartidor_nombre||'El repartidor'} ya está en tu puerta</div>
      <div style="font-size:18px;font-weight:500;color:#F5EFE0;margin-top:4px;line-height:1.25">Revisá tranquilo y después firmamos</div>
      ${data.order_number?`<div style="font-size:11.5px;color:${NOM.verdePastel};margin-top:6px">Pedido N° ${data.order_number}</div>`:''}
    </div>

    <div class="card">
      <p class="muted" style="margin:0 0 12px;font-size:12.5px">Si algo llegó de menos, tocá la tilde y ajustá la cantidad. Sin problema.</p>
      ${items.map((it,i)=>{
        const completo = Number(it.recibida) >= Number(it.cantidad)
        return `<div style="border-bottom:1px solid ${NOM.borde};padding:11px 0;display:flex;gap:11px;align-items:center">
          <button type="button" data-toggle-item="${i}" style="background:none;border:none;padding:0;flex-shrink:0;cursor:pointer">
            ${ico(completo?'check':'cerrar', 21, completo?NOM.verde:NOM.ambar)}
          </button>
          ${it.photo_url
            ? `<img src="${it.photo_url}" alt="" style="width:38px;height:38px;border-radius:9px;object-fit:cover;flex-shrink:0"/>`
            : `<div style="width:38px;height:38px;border-radius:9px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico(it.tipo==='huevo'?'huevo':'carrito',17,NOM.verde)}</div>`}
          <div style="flex:1;min-width:0">
            <div style="font-size:13.5px;color:${NOM.tinta};line-height:1.3"><b>${it.cantidad}</b> × ${it.nombre}</div>
            ${!completo?`<div style="font-size:11.5px;color:${NOM.ambar};margin-top:2px">Llegaron ${it.recibida}</div>`:''}
          </div>
          ${!completo?`<span style="display:flex;align-items:center;gap:6px;flex-shrink:0">
            <button type="button" data-rec-menos="${i}" class="btn ghost" style="padding:6px 11px">−</button>
            <b style="min-width:18px;text-align:center;display:inline-block">${it.recibida}</b>
            <button type="button" data-rec-mas="${i}" class="btn ghost" style="padding:6px 11px">+</button>
          </span>`:''}
        </div>`
      }).join('')}
    </div>

    ${falta?`<div class="card" style="border:2px solid ${NOM.ambar}">
      <h3 style="color:${NOM.ambar}">Faltaron $${montoF.toLocaleString('es-AR')} de mercadería</h3>
      <p class="muted" style="font-size:12.5px;margin:0 0 12px">Perdón por eso. ¿Cómo preferís que lo arreglemos?</p>
      <button type="button" class="btn ${resolucion==='descuento'?'primary':'ghost'}" data-resol="descuento" style="width:100%;margin-bottom:8px;text-align:left;padding:12px 14px">
        <div style="font-size:13.5px;font-weight:500">Pago solo lo que llegó</div>
        <div style="font-size:11.5px;opacity:0.75;margin-top:2px">Se descuenta del total de este pedido</div>
      </button>
      <button type="button" class="btn ${resolucion==='nota_credito'?'primary':'ghost'}" data-resol="nota_credito" style="width:100%;text-align:left;padding:12px 14px">
        <div style="font-size:13.5px;font-weight:500">Pago todo y me queda a favor</div>
        <div style="font-size:11.5px;opacity:0.75;margin-top:2px">Se descuenta del próximo pedido</div>
      </button>
    </div>`:''}

    <div class="card">
      <h3>Firmá la conformidad</h3>
      <p class="muted" style="font-size:12.5px;margin:0 0 12px">Para cerrar necesitamos tus datos y los de quien te entregó.</p>
      <div class="field"><label>Tu nombre *</label><input id="cf_firmante_nombre" placeholder="Quien recibe"/></div>
      <div class="field"><label>Tu DNI *</label><input id="cf_firmante_dni" inputmode="numeric" placeholder="Sin puntos"/></div>
      <div style="border-top:1px solid ${NOM.borde};margin:14px 0;padding-top:14px">
        <div class="field"><label>Nombre del repartidor *</label><input id="cf_rep_nombre" value="${data.repartidor_nombre||''}"/></div>
        <div class="field"><label>DNI del repartidor *</label><input id="cf_rep_dni" inputmode="numeric" placeholder="Pedíselo"/></div>
      </div>
      <div class="field"><label>Observación (opcional)</label><input id="cf_obs" placeholder="Ej: un maple con dos rotos"/></div>

      <div style="background:${NOM.fondo};border-radius:11px;padding:12px;margin-bottom:12px">
        <div class="row" style="border:0;padding:3px 0"><span style="font-size:12.5px;color:${NOM.tintaSuave}">Total del pedido</span><span style="font-size:13px;font-variant-numeric:tabular-nums">$${Number(data.total||0).toLocaleString('es-AR')}</span></div>
        ${falta&&resolucion==='descuento'?`<div class="row" style="border:0;padding:3px 0"><span style="font-size:12.5px;color:${NOM.ambar}">Descuento por faltante</span><span style="font-size:13px;color:${NOM.ambar};font-variant-numeric:tabular-nums">−$${montoF.toLocaleString('es-AR')}</span></div>`:''}
        <div class="row" style="border-top:1px solid ${NOM.borde};padding:8px 0 0;margin-top:5px"><span style="font-size:13.5px;font-weight:500">A pagar</span><span style="font-size:18px;font-weight:500;color:${NOM.verde};font-variant-numeric:tabular-nums">$${(falta&&resolucion==='descuento'?Number(data.total)-montoF:Number(data.total)).toLocaleString('es-AR')}</span></div>
      </div>

      <div id="err_conf" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_dar_conformidad" style="width:100%" ${enviando?'disabled':''}>${enviando?'Registrando…':'Dar conformidad'}</button>
      ${desde==='repartidor'?`<button class="btn ghost" id="btn_cancelar_conf" style="width:100%;margin-top:8px">Cancelar</button>`:''}
    </div>`)

    document.querySelectorAll('[data-toggle-item]').forEach(b=>b.onclick=()=>{
      const i = Number(b.dataset.toggleItem)
      items[i].recibida = Number(items[i].recibida) >= Number(items[i].cantidad) ? Math.max(0, Number(items[i].cantidad)-1) : Number(items[i].cantidad)
      if(!hayFaltante()) resolucion = null
      dibujar()
    })
    document.querySelectorAll('[data-rec-mas]').forEach(b=>b.onclick=()=>{
      const i = Number(b.dataset.recMas)
      items[i].recibida = Math.min(Number(items[i].cantidad), Number(items[i].recibida)+1)
      if(!hayFaltante()) resolucion = null
      dibujar()
    })
    document.querySelectorAll('[data-rec-menos]').forEach(b=>b.onclick=()=>{
      const i = Number(b.dataset.recMenos)
      items[i].recibida = Math.max(0, Number(items[i].recibida)-1)
      dibujar()
    })
    document.querySelectorAll('[data-resol]').forEach(b=>b.onclick=()=>{ resolucion = b.dataset.resol; dibujar() })

    const btnCancelar = document.querySelector('#btn_cancelar_conf')
    if(btnCancelar) btnCancelar.onclick = ()=>openDelivery(orderId)

    document.querySelector('#btn_dar_conformidad').onclick = async ()=>{
      const box = document.querySelector('#err_conf')
      const fn = document.querySelector('#cf_firmante_nombre').value.trim()
      const fd = document.querySelector('#cf_firmante_dni').value.trim()
      const rn = document.querySelector('#cf_rep_nombre').value.trim()
      const rd = document.querySelector('#cf_rep_dni').value.trim()

      if(!fn || !fd){ box.textContent='Poné tu nombre y DNI.'; box.style.display='block'; return }
      if(!/^\d{7,8}$/.test(fd)){ box.textContent='Tu DNI tiene que tener 7 u 8 números.'; box.style.display='block'; return }
      if(!rn || !rd){ box.textContent='Poné el nombre y DNI del repartidor.'; box.style.display='block'; return }
      if(!/^\d{7,8}$/.test(rd)){ box.textContent='El DNI del repartidor tiene que tener 7 u 8 números.'; box.style.display='block'; return }
      if(hayFaltante() && !resolucion){ box.textContent='Elegí cómo resolvemos el faltante.'; box.style.display='block'; return }

      enviando = true; dibujar()
      const { data: res, error } = await supabase.rpc('dar_conformidad', {
        p_dni: dni, p_customer_id: customerId, p_order_id: data.order_id,
        p_items: items.map(it=>({ clave: it.clave, cantidad: it.cantidad, recibida: it.recibida, precio_unitario: it.precio_unitario, nombre: it.nombre })),
        p_firmante_nombre: fn, p_firmante_dni: fd,
        p_repartidor_nombre: rn, p_repartidor_dni: rd,
        p_desde: desde || 'cliente',
        p_resolucion: resolucion,
        p_observaciones: document.querySelector('#cf_obs').value.trim() || null
      })
      enviando = false

      if(error || !res?.ok){
        dibujar()
        const b2 = document.querySelector('#err_conf')
        if(b2){ b2.textContent = res?.error || 'No se pudo registrar la conformidad.'; b2.style.display='block' }
        return
      }

      if(desde === 'repartidor'){
        cobrarEnEntrega(data.order_id)
      } else {
        mostrarAlerta(res.todo_conforme
          ? 'Gracias, quedó todo en orden.'
          : `Registrado. ${res.resolucion==='nota_credito'?`Te quedan $${Number(res.faltante).toLocaleString('es-AR')} a favor para el próximo pedido.`:`Se descontaron $${Number(res.faltante).toLocaleString('es-AR')} del total.`}`)
        render()
      }
    }
  }
  dibujar()
}

// ============ EL REPARTIDOR REGISTRA LO QUE COBRÓ ============
async function cobrarEnEntrega(orderId){
  const { data } = await supabase.rpc('datos_cobro_entrega', { p_order_id: orderId })
  if(!data || data.error) return mostrarAlerta('No se pudo cargar el cobro')

  let metodo = 'cash'
  let comprobante = null
  const esperado = Number(data.esperado||0)

  const dibujar = ()=>{
    const inp = document.querySelector('#cobro_ent_monto')
    const cobrado = inp ? Number(inp.value)||0 : esperado
    const saldo = Math.max(0, esperado - cobrado)

    layout(`<h2>Cobrar</h2>
    <div class="card">
      <p class="muted" style="margin:0 0 3px">${data.cliente||''}</p>
      ${data.firmante?`<p class="muted" style="font-size:12px;margin:0 0 12px">Firmó ${data.firmante}${data.todo_conforme?'':' · con faltante'}</p>`:''}

      <div style="background:${NOM.verdeClaro};border-radius:12px;padding:13px;margin-bottom:14px">
        <div style="font-size:11.5px;color:#5F5E5A">A cobrar</div>
        <div style="font-size:27px;font-weight:500;color:${NOM.verde};font-variant-numeric:tabular-nums;line-height:1.1">$${esperado.toLocaleString('es-AR')}</div>
        ${Number(data.deuda_previa||0)>0?`<div style="font-size:12px;color:${NOM.ambar};margin-top:5px">Además arrastra $${Number(data.deuda_previa).toLocaleString('es-AR')} de antes</div>`:''}
      </div>

      <div class="field"><label>¿Cuánto te pagó?</label><input id="cobro_ent_monto" type="number" inputmode="numeric" value="${esperado}"/></div>
      <div class="field"><label>¿Con qué?</label>
        <div class="grid two">
          <button type="button" class="btn ${metodo==='cash'?'primary':'ghost'}" data-cobro-met="cash">Efectivo</button>
          <button type="button" class="btn ${metodo==='transfer'?'primary':'ghost'}" data-cobro-met="transfer">Transferencia</button>
        </div>
      </div>
      ${metodo==='transfer'?`<div class="field"><label>Foto del comprobante</label><input type="file" id="cobro_ent_comp" accept="image/*"/></div>`:''}

      <div id="aviso_saldo"></div>
      <div id="err_cobro_ent" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_guardar_cobro_ent" style="width:100%">Guardar y seguir</button>
      <button class="btn ghost" id="btn_sin_cobrar" style="width:100%;margin-top:8px">Se lo dejo en cuenta</button>
    </div>`)

    const inp2 = document.querySelector('#cobro_ent_monto')
    const avisar = ()=>{
      const c = Number(inp2.value)||0
      const s = Math.max(0, esperado - c)
      const box = document.querySelector('#aviso_saldo')
      if(s > 0){
        box.innerHTML = `<div style="background:#FBE9D4;border-radius:11px;padding:12px;margin-bottom:12px">
          <div style="font-size:13px;font-weight:500;color:#B8641E">Le quedan $${s.toLocaleString('es-AR')} para la próxima</div>
          <div style="font-size:12px;color:#5F5E5A;margin-top:3px">Lo va a ver en su cuenta al instante.</div>
        </div>`
      } else if(c > esperado){
        box.innerHTML = `<div style="background:${NOM.verdeClaro};border-radius:11px;padding:12px;margin-bottom:12px">
          <div style="font-size:13px;font-weight:500;color:${NOM.verde}">Le quedan $${(c-esperado).toLocaleString('es-AR')} a favor</div>
        </div>`
      } else box.innerHTML = ''
    }
    inp2.oninput = avisar
    avisar()

    document.querySelectorAll('[data-cobro-met]').forEach(b=>b.onclick=()=>{ metodo=b.dataset.cobroMet; comprobante=null; dibujar() })
    const inpComp = document.querySelector('#cobro_ent_comp')
    if(inpComp) inpComp.onchange = (e)=>{ comprobante = e.target.files[0]||null }

    const guardar = async (monto)=>{
      const btn = document.querySelector('#btn_guardar_cobro_ent')
      btn.disabled = true
      btn.textContent = 'Guardando…'
      let url = null
      if(comprobante){
        const path = `entrega/${orderId}_${Date.now()}.${(comprobante.name.split('.').pop()||'jpg')}`
        const { error: upErr } = await supabase.storage.from('payment-receipts').upload(path, comprobante)
        if(!upErr){ const { data: pub } = supabase.storage.from('payment-receipts').getPublicUrl(path); url = pub.publicUrl }
      }
      const { data: res, error } = await supabase.rpc('cobrar_en_entrega', {
        p_order_id: orderId, p_monto: monto, p_metodo: metodo, p_receipt_url: url
      })
      if(error || !res?.ok){
        btn.disabled = false
        btn.textContent = 'Guardar y seguir'
        const box = document.querySelector('#err_cobro_ent')
        box.textContent = 'No se pudo registrar: '+(res?.error||error?.message||'')
        box.style.display='block'
        return
      }
      mostrarAlerta(Number(res.saldo_pendiente)>0
        ? `Listo, entrega cerrada.\n\nLe quedaron $${Number(res.saldo_pendiente).toLocaleString('es-AR')} pendientes para la próxima.`
        : 'Listo, entrega cerrada y cobrada.')
      current = 'repartidor'
      render()
    }

    document.querySelector('#btn_guardar_cobro_ent').onclick = ()=>{
      const monto = Number(document.querySelector('#cobro_ent_monto').value)||0
      if(monto <= 0){ const box=document.querySelector('#err_cobro_ent'); box.textContent='Poné cuánto te pagó, o usá "Se lo dejo en cuenta".'; box.style.display='block'; return }
      guardar(monto)
    }
    document.querySelector('#btn_sin_cobrar').onclick = async ()=>{
      const ok = await mostrarConfirmacion('¿Se lo dejás en cuenta?\n\nTodo el monto va a quedar como saldo pendiente.')
      if(ok) guardar(0)
    }
  }
  dibujar()
}

async function openDelivery(id){
  const { data: detalle, error: errDet } = await supabase.rpc('delivery_detail', { p_order_id: id })
  if(errDet || !detalle || detalle.error) return mostrarAlerta('No se pudo cargar el pedido')
  const r = detalle.order, c = detalle.customer, sub = detalle.subscription || {}
  const credito = detalle.credit
  const productos = detalle.productos || []
  const { data: settingsRaw } = await supabase.from('farm_settings').select('key,value').in('key',['transfer_cbu','transfer_alias','transfer_bank_name','transfer_holder_name','transfer_holder_doc','mp_alias','mp_wallet_name','mp_cbu','mp_holder_name','mp_holder_doc','wallet_discount_type','wallet_discount_value'])
  const cfg = Object.fromEntries((settingsRaw||[]).map(s=>[s.key,s.value]))
  const montoHuevos = sub.price_at_signup || 0
  const totalProductos = productos.reduce((s,p)=>s+Number(p.price)*p.quantity,0)
  const montoOriginal = montoHuevos + totalProductos
  // El descuento es por transferencia — da igual si va al banco o a la billetera.
  // Las dos le llegan instantáneas y sin comisión. El efectivo paga precio de lista.
  const descuentoBilletera = esPagoConDescuento(sub.payment_method) ? calcularDescuentoBilletera(montoOriginal, cfg.wallet_discount_type, cfg.wallet_discount_value) : 0
  const montoTrasBilletera = montoOriginal - descuentoBilletera
  const montoDefault = credito ? Math.max(0, montoTrasBilletera - credito.discount_amount) : montoTrasBilletera
  const { data: recepcion } = await supabase.rpc('puede_recibir', { p_customer_id: c.id, p_fecha: r.delivery_date })
  const { data: linkPago } = await supabase.from('payment_links').select('id,estado,init_point,monto').eq('order_id', id).in('estado',['pendiente','pagado']).order('created_at',{ascending:false}).limit(1).maybeSingle()
  const yaPago = linkPago && linkPago.estado === 'pagado'
  const hhmm = (t)=> t ? String(t).slice(0,5) : ''
  const DIAS_CORTOS = ['','Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
  layout(`<h2>Detalle de entrega</h2>${r.important_note?`<div class="alert warning"><b>⚠️ OBSERVACIÓN IMPORTANTE</b><br>${r.important_note}</div>`:''}
  ${recepcion && !recepcion.sin_restriccion ? `<div style="background:${recepcion.ok?NOM.verdeClaro:'#FCEBEB'};border-radius:14px;padding:13px;margin-bottom:12px">
    <div style="display:flex;gap:10px;align-items:flex-start">
      ${ico('reloj',19,recepcion.ok?NOM.verde:'#A32D2D')}
      <div style="flex:1">
        <div style="font-size:13.5px;font-weight:500;color:${recepcion.ok?NOM.tinta:'#A32D2D'}">${recepcion.ok?'Horario de recepción':'No recibe hoy'}</div>
        <div style="font-size:12.5px;color:#5F5E5A;margin-top:3px">
          ${recepcion.desde||recepcion.hasta ? `De ${hhmm(recepcion.desde)} a ${hhmm(recepcion.hasta)}` : ''}
          ${recepcion.dias&&recepcion.dias.length ? ` · ${recepcion.dias.map(d=>DIAS_CORTOS[d]).join(', ')}` : ''}
        </div>
        ${recepcion.nota?`<div style="font-size:12px;color:#5F5E5A;margin-top:4px">${recepcion.nota}</div>`:''}
      </div>
    </div>
  </div>`:''}
  ${yaPago?`<div style="background:${NOM.verde};border-radius:14px;padding:14px;margin-bottom:12px;display:flex;align-items:center;gap:11px">
    ${ico('moneda',22,'#F7F4EC')}
    <div><div style="color:#F7F4EC;font-size:15px;font-weight:500">Ya está pago</div><div style="color:${NOM.verdePastel};font-size:12.5px">Pagó $${Number(linkPago.monto).toLocaleString('es-AR')} online. No le cobres nada.</div></div>
  </div>`:''}
  ${descuentoBilletera>0?`<div class="alert info">💳 Paga por billetera virtual — tiene <b>$${descuentoBilletera.toLocaleString('es-AR')} de descuento</b> ya restado. Pedile el comprobante antes de confirmar.</div>`:''}
  ${credito?`<div class="alert info">🎁 Este cliente tiene <b>$${Number(credito.discount_amount).toLocaleString('es-AR')} de descuento</b> por recomendar a alguien. Ya está restado del monto a cobrar.</div>`:''}
  <div class="grid two">
    <div class="card">
      <h3>${c.street||''} ${c.street_number||''}</h3>
      <p>${c.first_name||''} ${c.last_name||''}</p>
      <p>📞 ${c.phone||'-'}</p>
      <p>💰 A cobrar: <b>$${Number(montoDefault).toLocaleString('es-AR')}</b>${(descuentoBilletera>0||credito)?` <span class="muted" style="text-decoration:line-through">$${Number(montoOriginal).toLocaleString('es-AR')}</span>`:''}</p>
      <p>💳 Método configurado: <b>${METODOS_PAGO_LABEL[sub.payment_method]||sub.payment_method||'-'}</b></p>
      ${c.customer_type==='mayorista'?`
        ${r.customer_stage==='llegado'
          ? `<div style="background:${NOM.verdeClaro};border-radius:12px;padding:12px;margin-bottom:9px">
              <div style="font-size:13px;font-weight:500;color:${NOM.tinta}">Avisaste que llegaste</div>
              <div style="font-size:12px;color:#5F5E5A;margin-top:3px">El comercio ya puede revisar el pedido desde su cuenta.</div>
              <button class="btn ghost" id="btn_revisar_con_repartidor" style="width:100%;margin-top:9px">Revisar acá con el encargado</button>
            </div>`
          : `<button class="btn primary" id="btn_llegue" style="width:100%;margin-bottom:9px">Avisar que llegué</button>`}
      `:''}
      <button class="btn ghost" data-remito="${id}" style="width:100%;margin-bottom:8px">Imprimir remito</button>
      <button class="btn ghost" onclick="window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('${(c.street||'')+' '+(c.street_number||'')+' '+(c.neighborhood||'')}'),'_blank')">📍 Google Maps</button>
    </div>
    <div class="card">
      <h3>✅ Checklist — llevá todo esto</h3>
      <label style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #F0EBDD"><input type="checkbox" class="check-entrega" style="width:18px;height:18px"/> <span>🥚 ${FRECUENCIAS[sub.frequency]||sub.frequency||''} · ${sub.egg_quantity||'-'} huevos${sub.plan_breakdown?` (${sub.plan_breakdown.map(b=>`${b.qty}×${b.size}`).join(' + ')})`:''}</span></label>
      ${productos.map(p=>`<label style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #F0EBDD">
        <input type="checkbox" class="check-entrega" style="width:18px;height:18px"/>
        ${p.photo_url?`<img src="${p.photo_url}" style="width:28px;height:28px;border-radius:6px;object-fit:cover"/>`:'<span>🛒</span>'}
        <span>${p.quantity}× ${p.name}</span>
      </label>`).join('')}
      ${!productos.length?'<p class="muted" style="font-size:12px;margin-top:6px">Este pedido es solo de huevos, sin productos extra.</p>':''}
    </div>
  </div>
  <div class="card">
      <h3>Confirmar entrega</h3>
      ${(() => {
        const items = []
        if(sub.plan_breakdown && sub.plan_breakdown.length){
          sub.plan_breakdown.forEach(b=>items.push(`<b>${b.qty}</b> × ${b.grade?`maple ${b.size} ${GRADO_LABEL[b.grade]||b.grade}`:`maple de ${b.size}`}`))
        } else if(sub.egg_quantity){
          items.push(`${sub.egg_quantity} huevos`)
        }
        productos.forEach(p=>items.push(`<b>${p.quantity}</b> × ${p.name}`))
        if(!items.length) return ''
        return `<div style="background:${NOM.fondo};border-radius:12px;padding:12px;margin-bottom:13px">
          <div style="font-size:12px;color:${NOM.tintaSuave};margin-bottom:8px">Qué le entregás</div>
          ${items.map(t=>`<div style="display:flex;gap:9px;align-items:center;padding:5px 0;font-size:13px;color:${NOM.tinta}">${ico('check',15,NOM.verde)}<span>${t}</span></div>`).join('')}
        </div>`
      })()}
      <div class="field"><label>DNI de quien recibe</label><input id="dni" autocomplete="off" /></div>
      <button class="btn primary" id="validate">Validar DNI</button>
      <div id="validation" style="margin-top:12px"></div>
      <div class="field" style="margin-top:12px"><label>Monto cobrado</label><input id="monto_cobrado" type="number" value="${montoDefault}"/></div>
      <div id="aviso_descuento_billetera"></div>
      <div class="field"><label>¿Con qué método pagó?</label>
        <div class="grid three" id="metodo_group">
          <button type="button" class="btn ${sub.payment_method==='cash'?'primary':'ghost'}" data-metodo="cash">Efectivo</button>
          <button type="button" class="btn ${sub.payment_method==='transfer'?'primary':'ghost'}" data-metodo="transfer">Transferencia</button>
          <button type="button" class="btn ${sub.payment_method==='mp'?'primary':'ghost'}" data-metodo="mp">Mercado Pago</button>
        </div>
      </div>
      <div id="datos_transferencia"></div>
      ${!yaPago?`<div style="border-top:1px solid ${NOM.borde};margin-top:12px;padding-top:12px">
        <div style="font-size:13px;color:${NOM.tintaSuave};margin-bottom:8px">¿Prefiere pagar con tarjeta?</div>
        ${linkPago?.init_point
          ? `<div style="display:flex;gap:8px">
              <a href="https://wa.me/54${(c.phone||'').replace(/\D/g,'')}?text=${encodeURIComponent('Hola '+(c.first_name||'')+'! Te paso el link para pagar tu pedido de NÓMADES: '+linkPago.init_point)}" target="_blank" class="btn ghost" style="flex:1;text-align:center;text-decoration:none;padding:11px 0;font-size:12.5px">Mandar por WhatsApp</a>
              <button class="btn ghost" id="btn_copiar_link_pago" style="flex:0 0 auto;padding:11px 14px;font-size:12.5px">Copiar</button>
            </div>
            <div id="link_pago_valor" style="display:none">${linkPago.init_point}</div>`
          : `<button class="btn ghost" id="btn_generar_link_pago" style="width:100%">Generar link de pago</button>`}
        <div id="err_link_pago" class="alert danger" style="display:none;margin-top:8px"></div>
      </div>`:''}
      <div id="err_confirm" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="confirm" style="width:100%;margin-top:12px" disabled>✅ Confirmar entrega</button>
      <button class="btn ghost" id="failed" style="width:100%;margin-top:8px">❌ No pude entregar</button>
  </div>`)
  let receiverId=null
  let dniValidado=false
  let metodoSel = sub.payment_method || 'cash'
  let comprobanteFile = null
  let comprobanteUrl = ''
  const actualizarBotonConfirmar = ()=>{
    const todoChequeado = [...document.querySelectorAll('.check-entrega')].every(chk=>chk.checked)
    document.querySelector('#confirm').disabled = !(dniValidado && todoChequeado)
  }
  document.querySelectorAll('.check-entrega').forEach(chk=>chk.onchange=actualizarBotonConfirmar)

  const renderDatosTransferencia = ()=>{
    const box = document.querySelector('#datos_transferencia')
    if(metodoSel === 'cash'){ box.innerHTML=''; return }
    const campos = metodoSel==='transfer'
      ? [['Banco', cfg.transfer_bank_name],['Alias','txt_alias',cfg.transfer_alias],['CBU','txt_cbu',cfg.transfer_cbu],['Titular', cfg.transfer_holder_name],['DNI/CUIT titular', cfg.transfer_holder_doc]]
      : [['Billetera', cfg.mp_wallet_name],['Alias','txt_alias',cfg.mp_alias],['CBU','txt_cbu',cfg.mp_cbu],['Titular', cfg.mp_holder_name],['DNI/CUIT titular', cfg.mp_holder_doc]]
    box.innerHTML = `<div class="alert info">
      ${campos.map(c=>{
        if(c.length===3){
          const [label, id, val] = c
          return `<p style="margin:0 0 6px">${label}: <b id="${id}">${val||'(no cargado)'}</b> ${val?`<button type="button" class="btn ghost" data-copiar="${id}" style="padding:2px 8px;font-size:11px">Copiar</button>`:''}</p>`
        }
        const [label, val] = c
        return `<p style="margin:0 0 6px">${label}: <b>${val||'(no cargado)'}</b></p>`
      }).join('')}
    </div>
    <div class="field"><label>Foto del comprobante *</label><input type="file" id="comprobante_input" accept="image/*"/></div>`
    const inputFile = document.querySelector('#comprobante_input')
    if(inputFile) inputFile.onchange = (e)=>{ comprobanteFile = e.target.files[0]||null }
    box.querySelectorAll('[data-copiar]').forEach(btn=> btn.onclick = ()=>{
      const texto = document.querySelector('#'+btn.dataset.copiar).textContent
      navigator.clipboard?.writeText(texto)
      btn.textContent = '✅'
      setTimeout(()=>{ btn.textContent='Copiar' }, 1500)
    })
  }
  renderDatosTransferencia()

  // El descuento por billetera es una condición, no un premio de por vida:
  // si el cliente se suscribió con billetera pero termina pagando en efectivo,
  // el monto vuelve al precio completo y el repartidor ve por qué.
  const recalcularMonto = ()=>{
    const campo = document.querySelector('#monto_cobrado')
    const aviso = document.querySelector('#aviso_descuento_billetera')
    if(!campo) return
    const descuentoAhora = esPagoConDescuento(metodoSel) ? calcularDescuentoBilletera(montoOriginal, cfg.wallet_discount_type, cfg.wallet_discount_value) : 0
    const conCredito = credito ? Math.max(0, montoOriginal - descuentoAhora - credito.discount_amount) : (montoOriginal - descuentoAhora)
    campo.value = conCredito
    if(!aviso) return
    if(descuentoAhora > 0){
      const donde = metodoSel==='transfer' ? 'Transfiere al banco' : 'Transfiere a la billetera'
      aviso.innerHTML = `<div class="alert info" style="margin-top:-4px;margin-bottom:10px">🎉 ${donde}: se le descuentan <b>$${Number(descuentoAhora).toLocaleString('es-AR')}</b> sobre $${Number(montoOriginal).toLocaleString('es-AR')}.</div>`
    } else if(metodoSel==='cash' && esPagoConDescuento(sub.payment_method)){
      const perdido = calcularDescuentoBilletera(montoOriginal, cfg.wallet_discount_type, cfg.wallet_discount_value)
      aviso.innerHTML = `<div class="alert warning" style="margin-top:-4px;margin-bottom:10px">⚠️ Se había suscrito por transferencia, pero paga en efectivo: <b>no corresponde el descuento de $${Number(perdido).toLocaleString('es-AR')}</b>. Se cobra el precio de lista, $${Number(montoOriginal).toLocaleString('es-AR')}.</div>`
    } else {
      aviso.innerHTML = ''
    }
  }
  recalcularMonto()

  document.querySelectorAll('#metodo_group [data-metodo]').forEach(b=> b.onclick = ()=>{
    metodoSel = b.dataset.metodo
    document.querySelectorAll('#metodo_group [data-metodo]').forEach(x=> x.className = 'btn '+(x.dataset.metodo===metodoSel?'primary':'ghost'))
    comprobanteFile = null
    renderDatosTransferencia()
    recalcularMonto()
  })

  const btnLlegue = document.querySelector('#btn_llegue')
  if(btnLlegue) btnLlegue.onclick = async ()=>{
    btnLlegue.disabled = true
    btnLlegue.textContent = 'Avisando…'
    const { data, error } = await supabase.rpc('marcar_llegue', { p_order_id: id })
    if(error || !data?.ok){ btnLlegue.disabled=false; btnLlegue.textContent='Avisar que llegué'; mostrarAlerta('No se pudo avisar. Probá de nuevo.'); return }
    openDelivery(id)
  }
  const btnRevisarRep = document.querySelector('#btn_revisar_con_repartidor')
  if(btnRevisarRep) btnRevisarRep.onclick = ()=>revisionConformidad(id, c, 'repartidor')
  const btnRemito = document.querySelector('[data-remito]')
  if(btnRemito) btnRemito.onclick = ()=>documentoRemito(id)
  const btnGenerarLink = document.querySelector('#btn_generar_link_pago')
  if(btnGenerarLink) btnGenerarLink.onclick = async ()=>{
    const box = document.querySelector('#err_link_pago')
    btnGenerarLink.textContent = 'Generando…'
    const { data, error } = await supabase.functions.invoke('mp-crear-link', { body: { order_id: id, site_url: window.location.origin } })
    if(error || !data?.ok){
      btnGenerarLink.textContent = 'Generar link de pago'
      box.textContent = data?.error || error?.message || 'No se pudo generar el link.'
      box.style.display = 'block'
      return
    }
    const tel = (c.phone||'').replace(/\D/g,'')
    const msg = encodeURIComponent('Hola '+(c.first_name||'')+'! Te paso el link para pagar tu pedido de NÓMADES: '+data.init_point)
    if(tel) window.open('https://wa.me/54'+tel+'?text='+msg, '_blank')
    else { navigator.clipboard?.writeText(data.init_point); mostrarAlerta('Link copiado. Este cliente no tiene teléfono cargado.') }
    openDelivery(id)
  }
  const btnCopiarLinkPago = document.querySelector('#btn_copiar_link_pago')
  if(btnCopiarLinkPago) btnCopiarLinkPago.onclick = ()=>{
    const el = document.querySelector('#link_pago_valor')
    if(el) navigator.clipboard?.writeText(el.textContent.trim())
    btnCopiarLinkPago.textContent = 'Copiado'
    setTimeout(()=>{ btnCopiarLinkPago.textContent = 'Copiar' }, 1500)
  }
  document.querySelector('#validate').onclick=async()=>{
    const dni=document.querySelector('#dni').value.trim()
    const {data,error}=await supabase.rpc('validate_delivery_receiver',{p_order_id:id,p_dni:dni})
    const out=document.querySelector('#validation')
    if(error||!data?.valid){out.innerHTML='<div class="alert danger">❌ DNI no autorizado.</div>';return}
    receiverId=data.receiver_id; dniValidado=true; out.innerHTML=`<div class="alert info">✅ Identidad validada: <b>${data.receiver_name}</b></div>`; actualizarBotonConfirmar()
  }
  document.querySelector('#confirm').onclick=async()=>{
    const errBox = document.querySelector('#err_confirm')
    if(metodoSel!=='cash' && !comprobanteFile){ errBox.textContent='Subí la foto del comprobante antes de confirmar.'; errBox.style.display='block'; return }
    const monto = Number(document.querySelector('#monto_cobrado').value) || montoDefault
    if(comprobanteFile){
      const path = `${id}/receipt_${Date.now()}.${(comprobanteFile.name.split('.').pop()||'jpg')}`
      const { error: upErr } = await supabase.storage.from('payment-receipts').upload(path, comprobanteFile)
      if(upErr){ errBox.textContent='No se pudo subir el comprobante: '+upErr.message; errBox.style.display='block'; return }
      const { data: pub } = supabase.storage.from('payment-receipts').getPublicUrl(path)
      comprobanteUrl = pub.publicUrl
    }
    const {data, error}=await supabase.rpc('confirm_delivery',{p_order_id:id,p_receiver_id:receiverId,p_actual_method:metodoSel,p_amount:monto,p_receipt_url:comprobanteUrl||null})
    if(error || !data?.ok){ errBox.textContent='No se pudo confirmar: '+(error?.message||data?.error||''); errBox.style.display='block'; return }
    if(credito) await supabase.rpc('confirm_delivery_use_credit', { p_credit_id: credito.id })
    mostrarAlerta('Entrega confirmada ✅'); current='repartidor'; render()
  }
  document.querySelector('#failed').onclick=async()=>{
    const motivos = ['Ausente','No responde','DNI no autorizado','Dirección incorrecta','Cliente no pudo pagar','Otro']
    const idx = prompt('Motivo:\n'+motivos.map((m,i)=>`${i+1}. ${m}`).join('\n')+'\n\nEscribí el número:')
    const reason = motivos[Number(idx)-1]
    if(!reason)return
    const {error}=await supabase.from('delivery_attempts').insert({order_id:id,status:'failed',failure_reason:reason,driver_id:session.user.id})
    if(error)return mostrarAlerta(error.message)
    await supabase.from('orders').update({status:'incident'}).eq('id',id)
    mostrarAlerta('Incidencia registrada'); current='repartidor'; render()
  }
}

let adminData = null // cache de datos del panel admin, para no re-consultar todo al abrir/cerrar secciones
let adminAsignarFecha = '' // filtro de fecha para "Reasignar pedidos puntuales"
let adminAsignarTipo = 'todos' // 'todos' | 'minorista' | 'mayorista'

async function fetchAdminData(){
  const [
    orders, customers, subs, staff, productos,
    movimientosRes, waitlistRes, settingsRes, zoneDriversRes, neighDriversRes,
    barriosRes, pedidosAsignarRes, pagosRes, planPricesRes, catsRes,
    entriesRes, dashRes, vehiculosRes, alertasRes, driverLedgerRes,
    rankingRes, reviewsRes,
    suppliersRes, catalogRes, recordatoriosRes, rendicionVendedoresRes, sugerenciasRes, rankingSugerenciasRes,
    pedidosProveedorRes, rankingProveedoresRes, cuentaCorrienteMayoristasRes, cuentaProveedoresRes, colgadasRes
  ] = await Promise.all([
    q('orders','id,status,delivery_date,egg_quantity,important_note,time_restriction_manual,assigned_driver,aviso_repartidor_enviado_at'),
    q('customers','id'),
    q('subscriptions','id,payment_status,created_at,customers(first_name,last_name)'),
    q('staff_roles','user_id,role,roles,full_name,created_at'),
    q('products','id,name,unit_label,category,current_qty,active'),
    supabase.from('stock_movements').select('id,product_id,type,quantity,note,created_by,created_at').order('created_at',{ascending:false}).limit(20),
    supabase.from('waitlist').select('id,customer_id,egg_quantity,frequency,position,created_at,customers(first_name,last_name,phone)').order('position'),
    supabase.from('farm_settings').select('key,value').in('key',['default_daily_capacity_maples','transfer_cbu','transfer_alias','transfer_bank_name','transfer_holder_name','transfer_holder_doc','mp_alias','mp_wallet_name','mp_cbu','mp_holder_name','mp_holder_doc','assignment_mode','wallet_discount_type','wallet_discount_value','company_legal_name','company_cuit','company_address','company_phone','company_email','whatsapp_pedidos_urgentes','shipping_cost','free_shipping_min','top_clients_count','empresa_nombre','empresa_direccion','empresa_telefono','empresa_email','empresa_cuit','deposito_street','deposito_street_number','deposito_neighborhood','deposito_city','deposito_province','deposito_latitude','deposito_longitude','localidades_habituales']),
    supabase.from('zone_drivers').select('zone,driver_user_id'),
    supabase.from('neighborhood_drivers').select('neighborhood,driver_user_id'),
    supabase.from('customers').select('neighborhood,zone').not('neighborhood','is',null),
    supabase.from('orders').select('id,delivery_date,status,assigned_driver,assignment_locked,egg_quantity,customer_stage,customers(first_name,last_name,neighborhood,zone,street,street_number,customer_type),subscriptions(frequency,plan_breakdown)').in('status',['pending','assigned','rescheduled']).order('delivery_date'),
    supabase.from('payments').select('id,amount,expected_method,method,reconciled,created_at,customers(first_name,last_name)').order('created_at',{ascending:false}).limit(30),
    supabase.from('plan_prices').select('id,egg_quantity,price,active,customer_type').order('egg_quantity'),
    supabase.from('finance_categories').select('id,name,type,active').order('name'),
    supabase.from('finance_entries').select('id,category_id,type,amount,entry_date,description,attachment_url').order('entry_date',{ascending:false}).limit(30),
    supabase.rpc('finance_dashboard', {}),
    supabase.from('vehicles').select('id,type,brand,model,year,plate,photo_url,current_km,service_interval_km,last_service_km,vtv_expiry,insurance_expiry,assigned_to,active,mechanic_name,mechanic_phone,mechanic_appointment_phone,mechanic_address,mechanic_hours,mechanic_email,mechanic_tax_id').order('created_at'),
    supabase.rpc('admin_vehicle_alerts', {}),
    supabase.from('driver_ledger').select('id,driver_id,entry_date,amount,description,created_at').order('entry_date',{ascending:false}),
    supabase.rpc('admin_customer_ranking', {}),
    supabase.rpc('admin_reviews_list', {}),
    supabase.from('suppliers').select('id,name,contact_phone,contact_email,address,notes,tipo').order('name'),
    supabase.rpc('admin_catalog_products', {}),
    supabase.rpc('admin_recordatorios_3_dias', {}),
    supabase.rpc('admin_rendicion_vendedores', {}),
    supabase.rpc('admin_product_suggestions', {}),
    supabase.rpc('admin_suggestions_ranking', {}),
    supabase.rpc('admin_pedidos_proveedores', {}),
    supabase.rpc('admin_ranking_proveedores', {}),
    supabase.rpc('admin_cuenta_corriente_mayoristas', {}),
    supabase.rpc('admin_cuenta_proveedores', {}),
    supabase.rpc('entregas_sin_cerrar', {})
  ])

  const movimientos = movimientosRes.data || []
  const waitlist = waitlistRes.data || []
  const settingsMap = Object.fromEntries((settingsRes.data||[]).map(s=>[s.key,s.value]))
  const repartidores = staff.filter(s=>s.role==='repartidor')
  const zoneDrivers = Object.fromEntries((zoneDriversRes.data||[]).map(z=>[z.zone,z.driver_user_id]))
  const neighDrivers = neighDriversRes.data || []
  const barriosRaw = barriosRes.data || []
  const barrios = [...new Set(barriosRaw.map(b=>b.neighborhood).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'))
  const barrioZonaMap = {}
  barriosRaw.forEach(b=>{ if(b.neighborhood && b.zone && !barrioZonaMap[b.neighborhood]) barrioZonaMap[b.neighborhood] = b.zone })
  const pedidosAsignar = pedidosAsignarRes.data || []
  const pagos = pagosRes.data || []
  const productMap = Object.fromEntries(productos.map(p=>[p.id, p]))
  const planPrices = planPricesRes.data || []
  const categorias = catsRes.data || []
  const movimientosFinanzas = entriesRes.data || []
  const dash = dashRes.data || {}
  const vehiculos = vehiculosRes.data || []
  const alertas = alertasRes.data || { service:[], vtv:[], seguro:[], carnet:[], pagos_pendientes:[] }
  const driverLedger = driverLedgerRes.data || []
  const ranking = rankingRes.data || []
  const reviews = reviewsRes.data || []
  const suppliers = suppliersRes.data || []
  const catalogo = catalogRes.data || []
  const recordatorios = recordatoriosRes.data || []
  const rendicionVendedores = rendicionVendedoresRes.data || []
  const sugerencias = sugerenciasRes.data || []
  const rankingSugerencias = rankingSugerenciasRes.data || []
  const pedidosProveedor = pedidosProveedorRes.data || []
  const rankingProveedores = rankingProveedoresRes.data || []
  const cuentaCorrienteMayoristas = cuentaCorrienteMayoristasRes.data || []
  const cuentaProveedores = cuentaProveedoresRes.data || []
  const entregasColgadas = colgadasRes.data || []

  return { orders,customers,subs,staff,productos,movimientos,waitlist,settingsMap,repartidores,zoneDrivers,neighDrivers,barrios,barrioZonaMap,pedidosAsignar,pagos,productMap,planPrices,categorias,movimientosFinanzas,dash,vehiculos,alertas,driverLedger,ranking,reviews,suppliers,catalogo,recordatorios,rendicionVendedores,sugerencias,rankingSugerencias,pedidosProveedor,rankingProveedores,cuentaCorrienteMayoristas,cuentaProveedores,entregasColgadas }
}

async function admin(){
  if(!adminData){
    layout(`<h2>Panel de administración</h2><div class="card">${skeletonBloque(5)}</div>`)
    adminData = await fetchAdminData()
  }
  const { orders,customers,subs,staff,productos,movimientos,waitlist,settingsMap,repartidores,zoneDrivers,neighDrivers,barrios,barrioZonaMap,pedidosAsignar,pagos,productMap,planPrices,categorias,movimientosFinanzas,dash,vehiculos,alertas,driverLedger,ranking,reviews,suppliers,catalogo,recordatorios,rendicionVendedores,sugerencias,rankingSugerencias,pedidosProveedor,rankingProveedores,cuentaCorrienteMayoristas,cuentaProveedores,entregasColgadas } = adminData
  const capacidadBase = settingsMap.default_daily_capacity_maples || '300'
  const assignmentMode = settingsMap.assignment_mode || 'zone'
  const staffMap = Object.fromEntries(staff.map(s=>[s.user_id, s.full_name||'(sin nombre)']))
  const margenDefMin = Number(settingsMap.margen_default_minorista || 60)
  const margenDefMay = Number(settingsMap.margen_default_mayorista || 25)
  const CATEGORIAS = [{value:'alimento',label:'Alimento'},{value:'sanidad',label:'Sanidad'},{value:'limpieza',label:'Limpieza'},{value:'otro',label:'Otro'}]
  const CATLABEL = {alimento:'Alimento',sanidad:'Sanidad',limpieza:'Limpieza',otro:'Otro'}
  const categoriaMap = Object.fromEntries(categorias.map(c=>[c.id,c]))
  const TIPO_CAT_LABEL = { fixed:'Fijo', variable:'Variable', income:'Ingreso' }
  const count=s=>orders.filter(x=>x.status===s).length
  const pendientesDePago = subs.filter(s=>s.payment_status==='pending')
  const rolLabel = {admin:'Administrador',campo:'Personal de campo',repartidor:'Repartidor',preparador:'Preparador de pedidos',vendedor:'Vendedor',telefonico:'Personal telefónico'}
  const AS = (id)=> adminOpenSection===id
  const AREAS = [
    // Todos los días
    { g:'dia', id:'operacion', ic:'camion', titulo:'Reparto', desc:'Ruta, capacidad y asignación', secciones:['capacidad','asignacion','recordatorios','mapa'] },
    { g:'dia', id:'stock', ic:'calendario', titulo:'Stock', desc:'Vencimientos y pérdidas', secciones:[], directo:'vencimientos' },
    { g:'dia', id:'proveedores', ic:'planilla', titulo:'Proveedores', desc:'Compras y cuenta corriente', secciones:['pedidos_proveedor','insumos'] },
    { g:'dia', id:'equipo', ic:'personas', titulo:'Equipo', desc:'Personal, vehículos y trazas', secciones:['personal','trazabilidad','vehiculos'] },
    { g:'dia', id:'campo_area', ic:'huevo', titulo:'El campo', desc:'Gallinas, parcelas e insumos', secciones:[], directo:'adm-campo' },
    { g:'dia', id:'zonas_area', ic:'mapa', titulo:'Zonas de reparto', desc:'Barrios y días de cada zona', secciones:[], directo:'zonas' },

    // Minorista
    { g:'min', id:'clientes_area', ic:'estrella', titulo:'Suscriptores', desc:'Ranking, reseñas y sugerencias', secciones:['ranking','resenas','sugerencias'] },
    { g:'min', id:'riesgo', ic:'personas', titulo:'Los que se van', desc:'Dejaron de comprar', secciones:[], directo:'riesgo' },
    { g:'min', id:'comercial', ic:'carrito', titulo:'Precios y catálogo', desc:'Lo que ve el público', secciones:['catalogo','tamanos','vendedores','agregado_manual'] },
    { g:'min', id:'avisos', ic:'campana', titulo:'Avisos', desc:'Cambios de precio y novedades', secciones:[], directo:'avisos' },

    // Mayorista
    { g:'may', id:'cuenta_mayoristas_area', ic:'tienda', titulo:'Comercios', desc:'Fichas y cuenta corriente', secciones:['cuenta_mayoristas'] },
    { g:'may', id:'alta_comercio', ic:'tienda', titulo:'Sumar comercio', desc:'Alta en el momento', secciones:[], directo:'alta-comercio' },
    { g:'may', id:'mayoristas_riesgo', ic:'aviso', titulo:'Se enfrían', desc:'Dejaron de pedir', secciones:[], directo:'mayoristas-riesgo' },
    { g:'may', id:'clasificaciones', ic:'huevo', titulo:'Lista mayorista', desc:'Tamaños y precios', secciones:[], directo:'clasificaciones' },

    // La plata
    { g:'plata', id:'fincanales', ic:'grafico', titulo:'Los dos negocios', desc:'Cuánto deja cada canal', secciones:[], directo:'fincanales' },
    { g:'plata', id:'deudores', ic:'moneda', titulo:'Te deben', desc:'De los dos canales', secciones:[], directo:'deudores' },
    { g:'plata', id:'dinero', ic:'moneda', titulo:'Caja y rendición', desc:'Movimientos y cobros', secciones:['finanzas','rendicion','cobros'] },
    { g:'plata', id:'costo_huevo', ic:'grafico', titulo:'Cuánto te cuesta', desc:'Costo del huevo y margen por producto', secciones:[], directo:'costo-huevo' },
    { g:'plata', id:'categorias_costo', ic:'planilla', titulo:'Qué es cada gasto', desc:'Producción, reparto o estructura', secciones:[], directo:'categorias-costo' },
    { g:'plata', id:'gastos_equipo', ic:'moneda', titulo:'Gastos del equipo', desc:'Lo que cargan en la calle', secciones:[], directo:'gastos-equipo' },
    { g:'plata', id:'cobrados', ic:'aviso', titulo:'Cobrado sin entregar', desc:'Hay que resolverlo', secciones:[], directo:'cobrados' },
    { g:'plata', id:'backup', ic:'planilla', titulo:'Copia de seguridad', desc:'Descargá todos tus datos', secciones:[], directo:'backup' }
  ]
  const GRUPOS = [
    { g:'dia',   titulo:'TODOS LOS DÍAS', color:null },
    { g:'min',   titulo:'MINORISTA',      color:NOM.verde },
    { g:'may',   titulo:'MAYORISTA',      color:NOM.ambar },
    { g:'plata', titulo:'LA PLATA',       color:null }
  ]
  const areaActual = AREAS.find(a=>a.id===adminAreaAbierta)
  const seccionVisible = (id)=> !!(areaActual && areaActual.secciones.includes(id))

  const accHead = (id, icon, titulo, badge)=> !seccionVisible(id) ? '<div style="display:none">' : `<button type="button" class="acc-header" data-acc="${id}" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:14px 16px;cursor:pointer;gap:10px;background:${AS(id)?'#F5EFE0':'transparent'}"><span style="width:34px;height:34px;border-radius:10px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico(EMOJI_ICONO[icon]||'panel',18,NOM.verde)}</span><span style="flex:1;font-weight:500;font-size:14.5px;color:${NOM.tinta}">${titulo}</span>${badge?pPill(badge,'#FBE4CC','#B85C00'):''}<span style="font-size:13px;color:#8A8570">${AS(id)?'▲':'▼'}</span></button><div class="acc-body" style="max-height:${AS(id)?'6000px':'0'};padding:${AS(id)?'4px 16px 16px 16px':'0 16px'}">`
  const statCard = (id,label,value)=> `<div data-stat="${id}" style="cursor:pointer;flex:0 0 auto;min-width:100px;background:${NOM.superficie};border:1px solid ${NOM.borde};border-radius:14px;padding:11px 14px;display:flex;flex-direction:column;gap:3px"><span style="color:${NOM.tintaSuave};font-size:11px;line-height:1.25">${label}</span><span style="color:${NOM.tinta};font-size:21px;font-weight:500;line-height:1.15;font-variant-numeric:tabular-nums">${value}</span></div>`

  const resumenDia = (()=>{
    const hoy = new Date().toISOString().slice(0,10)
    const ordersHoy = orders.filter(o=>o.delivery_date===hoy)
    const entregadosHoy = ordersHoy.filter(o=>o.status==='delivered').length
    const pendientesHoy = ordersHoy.filter(o=>['pending','assigned','out_for_delivery','rescheduled'].includes(o.status)).length
    const huevosHoy = ordersHoy.reduce((s,o)=>s+Number(o.egg_quantity||0),0)
    const ventasHoy = pagos.filter(p=>p.created_at.slice(0,10)===hoy).reduce((s,p)=>s+Number(p.amount||0),0)
    const totalAlertasHoy = (alertas.service?.length||0)+(alertas.vtv?.length||0)+(alertas.seguro?.length||0)+(alertas.carnet?.length||0)+(alertas.pagos_pendientes?.length||0)
    const restriccionesHoy = ordersHoy.filter(o=>['pending','assigned','out_for_delivery','rescheduled'].includes(o.status) && tieneRestriccionHoraria(o)).length
    const fechaLinda = formatearFecha(hoy)
    return `<div style="background:${NOM.verde};border-radius:18px;padding:18px;margin-bottom:12px">
      <div style="color:${NOM.verdePastel};font-size:10.5px;letter-spacing:0.9px;text-transform:uppercase">${fechaLinda}</div>
      <div style="color:#F7F4EC;font-size:34px;font-weight:500;line-height:1.05;margin-top:8px;font-variant-numeric:tabular-nums" data-count-target="${ventasHoy}" data-count-currency="1">$0</div>
      <div style="color:${NOM.verdePastel};font-size:12px;margin-top:5px">vendido hoy</div>
      <div style="display:flex;gap:22px;margin-top:15px;padding-top:13px;border-top:1px solid rgba(247,244,236,0.16)">
        <div><div style="color:#F7F4EC;font-size:17px;font-weight:500;font-variant-numeric:tabular-nums" data-count-target="${entregadosHoy}">0</div><div style="color:${NOM.verdePastel};font-size:10.5px;margin-top:1px">entregadas</div></div>
        <div><div style="color:#F7F4EC;font-size:17px;font-weight:500;font-variant-numeric:tabular-nums" data-count-target="${pendientesHoy}">0</div><div style="color:${NOM.verdePastel};font-size:10.5px;margin-top:1px">pendientes</div></div>
        <div><div style="color:#F7F4EC;font-size:17px;font-weight:500;font-variant-numeric:tabular-nums" data-count-target="${huevosHoy}">0</div><div style="color:${NOM.verdePastel};font-size:10.5px;margin-top:1px">huevos</div></div>
      </div>
      ${totalAlertasHoy>0?`<div style="margin-top:13px;display:flex;align-items:center;gap:8px;background:rgba(247,244,236,0.1);border-radius:11px;padding:10px 12px;color:#F7F4EC;font-size:12px">${ico('moto',17,'#E8A54B')}<span>${totalAlertasHoy} alerta${totalAlertasHoy===1?'':'s'} en vehículos</span></div>`:''}
      ${restriccionesHoy>0?`<div style="margin-top:8px;display:flex;align-items:center;gap:8px;background:rgba(247,244,236,0.1);border-radius:11px;padding:10px 12px;color:#F7F4EC;font-size:12px">${ico('campana',17,'#E8A54B')}<span>${restriccionesHoy} pedido${restriccionesHoy===1?'':'s'} con horario restringido</span></div>`:''}
    </div>`
  })()

  // Mirar mañana antes de que llegue: si falta preparar o hay horarios restringidos,
  // eso se resuelve hoy a la tarde, no mañana a la mañana.
  const resumenManana = (()=>{
    const m = new Date(); m.setDate(m.getDate()+1)
    const manana = m.toISOString().slice(0,10)
    const ordersManana = orders.filter(o=>o.delivery_date===manana && o.status!=='cancelled')
    if(!ordersManana.length) return ''
    const huevos = ordersManana.reduce((s,o)=>s+Number(o.egg_quantity||0),0)
    const maples = Math.round((huevos/30)*10)/10
    const restricciones = ordersManana.filter(o=>tieneRestriccionHoraria(o)).length
    const conNota = ordersManana.filter(o=>o.important_note).length
    const sinAsignar = ordersManana.filter(o=>o.status==='pending').length
    const dia = new Date(manana+'T00:00:00').toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'})
    const avisos = []
    const sinAvisar = ordersManana.filter(o=>o.assigned_driver && !o.aviso_repartidor_enviado_at).length
    if(sinAsignar) avisos.push(`${sinAsignar} sin repartidor`)
    if(sinAvisar) avisos.push(`${sinAvisar} sin avisar`)
    if(restricciones) avisos.push(`${restricciones} con horario`)
    if(conNota) avisos.push(`${conNota} con observación`)
    return `<button id="btn_ver_manana" style="all:unset;cursor:pointer;display:block;width:100%;background:${NOM.crema};border:1px solid ${NOM.borde};border-radius:16px;padding:14px 16px;margin-bottom:12px;box-sizing:border-box">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
        <div style="min-width:0">
          <div style="color:${NOM.tintaSuave};font-size:10.5px;letter-spacing:0.9px;text-transform:uppercase">Mañana · ${dia}</div>
          <div style="color:${NOM.tinta};font-size:19px;font-weight:500;margin-top:5px">${ordersManana.length} entrega${ordersManana.length===1?'':'s'} · ${huevos} huevos <span style="color:${NOM.tintaSuave};font-size:13px">(${maples} maples)</span></div>
          ${avisos.length?`<div style="color:${NOM.ambar};font-size:12px;margin-top:5px">⚠️ ${avisos.join(' · ')}</div>`:`<div style="color:${NOM.tintaSuave};font-size:12px;margin-top:5px">Todo asignado y sin observaciones</div>`}
        </div>
        <div style="flex-shrink:0;color:${NOM.tintaSuave}">${ico('flecha',18,NOM.tintaSuave)}</div>
      </div>
    </button>`
  })()

  // Una entrega que salió y nunca se cerró es plata cobrada fuera de la caja
  // o un cliente esperando. Va arriba de todo, antes que las ventas del día.
  const alertaColgadas = (!areaActual && entregasColgadas.length) ? `<div style="background:#FBE9E7;border:1px solid #F0BDB6;border-radius:16px;padding:13px 15px;margin-bottom:12px">
    <div style="font-size:13.5px;font-weight:600;color:#8C2F22">🔴 ${entregasColgadas.length} entrega${entregasColgadas.length===1?'':'s'} quedó sin cerrar</div>
    ${entregasColgadas.map(e=>`<div style="font-size:12px;color:#B03A2E;margin-top:4px">${e.nombre} · salió el ${formatearFecha(e.delivery_date)}${e.driver_nombre?` con ${e.driver_nombre}`:''} y nunca se confirmó</div>`).join('')}
    <div style="font-size:11.5px;color:#B03A2E;margin-top:6px">Si se entregó, hay plata cobrada que no está en la caja. Si no, el cliente sigue esperando.</div>
    <div style="display:flex;gap:7px;margin-top:11px;flex-wrap:wrap">
      ${entregasColgadas.map(e=>`<button data-resolver-colgada="${e.order_id}" style="background:${NOM.verde};color:#F7F4EC;border:none;border-radius:9px;padding:8px 13px;font-size:12px;font-weight:600">Resolver la de ${(e.nombre||'').split(' ')[0]}</button>`).join('')}
    </div>
  </div>` : ''

  layout(`<h2 style="display:flex;align-items:center;gap:8px">${areaActual?`<button id="btn_volver_areas" style="all:unset;cursor:pointer;padding:0 6px 0 0;display:inline-flex">${ico('flecha',20,NOM.tinta)}</button>${areaActual.titulo}`:'Panel de administración'}</h2>
  ${alertaColgadas}
  ${areaActual?'':resumenDia}
  ${areaActual?'':resumenManana}
  ${areaActual?'':`<div style="overflow-x:auto;display:flex;gap:8px;padding-bottom:4px">
    ${statCard('clientes','Clientes',customers.length)}
    ${statCard('pend_entrega','Pend. entrega',count('pending')+count('assigned')+count('out_for_delivery'))}
    ${statCard('pend_pago','Pend. pago',pendientesDePago.length)}
    ${statCard('entregados','Entregados',count('delivered'))}
    ${statCard('incidencias','Incidencias',count('incident'))}
    ${statCard('reprogramados','Reprogramados',count('rescheduled'))}
  </div>
  <div style="margin-top:16px">
    ${GRUPOS.map(gr=>{
      const items = AREAS.filter(a=>a.g===gr.g)
      if(!items.length) return ''
      const col = gr.color || NOM.verde
      return `<div style="margin-bottom:18px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">
          ${gr.color?`<span style="width:9px;height:9px;border-radius:3px;background:${gr.color}"></span>`:''}
          <span style="font-size:11px;letter-spacing:1.4px;color:${NOM.tintaSuave}">${gr.titulo}</span>
        </div>
        <div style="${gr.color?`border-left:3px solid ${gr.color};padding-left:11px`:''}">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            ${items.map(a=>`<button data-area="${a.id}" style="all:unset;box-sizing:border-box;cursor:pointer;background:${NOM.superficie};border:1px solid ${NOM.borde};border-radius:14px;padding:13px 12px;display:flex;flex-direction:column;gap:7px;min-height:100px">
              ${ico(a.ic,19,col)}
              <span style="font-weight:500;font-size:13px;color:${NOM.tinta};line-height:1.25">${a.titulo}</span>
              <span style="font-size:11px;color:${NOM.tintaSuave};line-height:1.35">${a.desc}</span>
            </button>`).join('')}
          </div>
        </div>
      </div>`
    }).join('')}
  </div>`}
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:14px">
  ${accHead('trazabilidad','🔍','Trazabilidad y datos de la empresa')}
    <p class="muted">Cada cambio que hace cualquier persona queda registrado con su nombre, la fecha y el valor anterior.</p>
    <button id="btn_ir_auditoria" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:13px;font-weight:600;margin-bottom:14px">🔍 Ver quién hizo qué</button>
    <h4 style="font-size:13px;color:#2F4D2A;margin:0 0 6px">🏢 Datos que salen en los documentos</h4>
    <p class="muted" style="font-size:12px">Aparecen en el encabezado de las órdenes de pago, estados de cuenta y reportes.</p>
    <div class="field"><label>Nombre de la empresa</label><input id="emp_nombre" value="${settingsMap.empresa_nombre||'NÓMADES'}"/></div>
    <div class="field"><label>Dirección</label><input id="emp_direccion" value="${settingsMap.empresa_direccion||''}"/></div>
    <div class="field"><label>Teléfono</label><input id="emp_telefono" value="${settingsMap.empresa_telefono||''}"/></div>
    <div class="field"><label>Email</label><input id="emp_email" value="${settingsMap.empresa_email||''}"/></div>
    <div class="field"><label>CUIT</label><input id="emp_cuit" value="${settingsMap.empresa_cuit||''}"/></div>
    <button id="btn_guardar_empresa" class="btn ghost" style="width:100%">💾 Guardar datos de la empresa</button>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('personal','👥','Gestión de personal')}
    <div class="field"><label>Nombre y apellido</label><input id="staff_new_name"/></div>
    <div class="field"><label>Roles — puede tener varios</label>
      <div id="staff_new_roles">${ROLES_STAFF.map(r=>`<label style="display:flex;align-items:center;gap:10px;border:1px solid #E3DCC8;border-radius:10px;padding:9px 12px;margin-bottom:6px;background:#FFFFFF"><input type="checkbox" data-nuevo-rol="${r.value}" style="width:18px;height:18px"/> <span style="font-size:14px">${r.label}</span></label>`).join('')}</div>
    </div>
    <div class="field"><label>Código de acceso (opcional — si lo dejás vacío, se genera uno automático)</label><input id="staff_new_code" placeholder="Ej: 123 (mín. 3 caracteres, letras o números)"/></div>
    <button class="btn primary" id="btn_crear_staff">➕ Generar código de acceso</button>
    <div id="salud_accesos" style="margin-top:10px"></div>
    <div style="border-top:1px solid ${NOM.borde};margin-top:14px;padding-top:14px">
      <div style="font-size:14px;font-weight:500;margin-bottom:3px">🧪 Datos de prueba</div>
      <p class="muted" style="font-size:12px;margin:0 0 10px">Seis clientes inventados con entregas para hoy, para recorrer el circuito sin ensuciar tus números. Los nombres arrancan con "Prueba".</p>
      <div id="estado_prueba"></div>
    </div>
    <div id="codigo_generado" style="margin-top:10px"></div>
    <div style="margin-top:16px">${staff.length?staff.map(s=>{
      const esVos = session && s.user_id === session.user.id
      return pCard(`
        <div style="display:flex;align-items:center;gap:10px">
          ${pAvatar(s.full_name)}
          <div style="flex:1">
            <div style="font-weight:700;color:#2F4D2A">${s.full_name||'(sin nombre)'}</div>
            <div style="display:flex;gap:6px;margin-top:3px;flex-wrap:wrap">${((Array.isArray(s.roles)&&s.roles.length)?s.roles:[s.role]).map(r=>pPill(rolLabel[r]||r)).join('')}${esVos?pPill('Vos','#2F4D2A','#F5EFE0'):''}</div>
          </div>
        </div>
        ${staffEditandoRoles===s.user_id?`
          <div style="margin-top:10px">
            ${ROLES_STAFF.map(r=>{
              const tiene = ((Array.isArray(s.roles)&&s.roles.length)?s.roles:[s.role]).includes(r.value)
              return `<label style="display:flex;align-items:center;gap:10px;border:1px solid #E3DCC8;border-radius:10px;padding:9px 12px;margin-bottom:6px;background:#FFFFFF"><input type="checkbox" data-editar-rol="${r.value}" ${tiene?'checked':''} style="width:18px;height:18px"/> <span style="font-size:14px">${r.label}</span></label>`
            }).join('')}
            ${pBtnRow([pBtn('💾','Guardar roles',`data-guardar-roles="${s.user_id}"`,''), pBtn('✖️','Cancelar',`data-cancelar-roles="1"`,'ghost')])}
          </div>`
        : (esVos
          ? pBtnRow([pBtn('👥','Editar roles',`data-editar-roles="${s.user_id}"`,'ghost')]) + `<p class="muted" style="font-size:12px;margin-top:8px">Para cambiar tu propio código, cerrá sesión y usá "Acceso del equipo" con tu código actual.</p>`
          : pBtnRow([pBtn('👥','Editar roles',`data-editar-roles="${s.user_id}"`,'ghost'), pBtn('🔄','Nuevo código',`data-reset="${s.user_id}"`,'ghost'), pBtn('❌','Revocar',`data-revoke="${s.user_id}"`,'danger')]))}
      `)
    }).join(''):'<p class="muted">Todavía no agregaste personal.</p>'}</div>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('mapa','🗺️','Mapa de clientes')}
    <div id="admin_mapa_estado" class="muted" style="margin-bottom:8px">Cargando mapa…</div>
    <div id="admin_mapa_contenedor" style="height:440px;border-radius:12px;overflow:hidden;background:#eee"></div>
    <div style="font-size:12px;color:${NOM.tintaSuave};margin-top:8px;line-height:1.9">
      <div><b style="color:${NOM.tinta}">Forma:</b> <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${NOM.verde};vertical-align:-1px"></span> en el circuito · <span style="display:inline-block;width:10px;height:10px;background:#185FA5;transform:rotate(45deg);vertical-align:-1px;margin:0 3px"></span> fuera · <span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:${NOM.ambar};vertical-align:-1px"></span> comercio · <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${NOM.ambarClaro};border:2px dashed ${NOM.ambar};vertical-align:-1px"></span> sin confirmar</div>
      <div><b style="color:${NOM.tinta}">Color de zona:</b> 🟢 Norte · 🟠 Sur · 🟣 Oeste · 🟡 Este</div>
      <div>Tocá un punto para ver a qué distancia está del depósito. Si está mal ubicado, mantenelo apretado y arrastralo — se guarda solo.</div>
    </div>
    <div id="admin_mapa_sin_geo" style="margin-top:12px"></div>
    <div style="border-top:1px solid ${NOM.borde};margin-top:14px;padding-top:14px">
      <div style="font-size:14px;font-weight:500;margin-bottom:3px">🏠 Depósito</div>
      <p class="muted" style="font-size:12px;margin:0 0 10px">Desde acá se miden las distancias a cada cliente.</p>
      <div class="grid two">
        <div class="field"><label>Calle</label><input id="dep_street" value="${settingsMap.deposito_street||''}"/></div>
        <div class="field"><label>Número</label><input id="dep_street_number" value="${settingsMap.deposito_street_number||''}"/></div>
      </div>
      <div class="grid two">
        <div class="field"><label>Barrio</label><input id="dep_neighborhood" value="${settingsMap.deposito_neighborhood||''}"/></div>
        <div class="field"><label>Localidad</label><input id="dep_city" value="${settingsMap.deposito_city||''}"/></div>
      </div>
      <div class="field"><label>Localidades del circuito habitual <small class="muted">(separadas por coma)</small></label><input id="dep_habituales" value="${settingsMap.localidades_habituales||'Rosario'}" placeholder="Ej: Rosario, Funes"/></div>
      <p class="muted" style="font-size:11.5px;margin:-4px 0 10px">Los clientes de estas localidades salen como círculo. El resto, como rombo azul.</p>
      <div id="dep_estado" class="muted" style="font-size:12px;margin-bottom:8px">${settingsMap.deposito_latitude?`📍 Ubicado en ${Number(settingsMap.deposito_latitude).toFixed(4)}, ${Number(settingsMap.deposito_longitude).toFixed(4)}`:'⚠️ Sin ubicar — las distancias no se pueden calcular'}</div>
      <button class="btn primary" id="btn_guardar_deposito" style="width:100%">Guardar depósito y ubicarlo</button>
    </div>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('asignacion','🚚','Asignación de repartidores')}
    <p class="muted">Elegí cómo se decide quién reparte cada pedido. Podés combinar el modo automático con reasignaciones manuales puntuales.</p>
    <div class="field"><label>Modo de asignación</label>
      <div class="grid three" id="modo_asig_group">
        <button type="button" class="btn ${assignmentMode==='zone'?'primary':'ghost'}" data-modo="zone">Por zona</button>
        <button type="button" class="btn ${assignmentMode==='neighborhood'?'primary':'ghost'}" data-modo="neighborhood">Por barrio</button>
        <button type="button" class="btn ${assignmentMode==='manual'?'primary':'ghost'}" data-modo="manual">Manual</button>
      </div>
    </div>
    ${!repartidores.length?'<p class="alert warning">Todavía no tenés repartidores cargados en "Gestión de personal" — agregá uno para poder asignarlo.</p>':''}
    <div class="group"><h3 style="font-size:15px">Repartidor por zona</h3>
      ${ZONAS.map(z=>`<div class="row"><span>${z.label}</span><select data-zona-driver="${z.value}"><option value="">— Sin asignar —</option>${repartidores.map(r=>`<option value="${r.user_id}" ${zoneDrivers[z.value]===r.user_id?'selected':''}>${r.full_name||'(sin nombre)'}</option>`).join('')}</select></div>`).join('')}
    </div>
    <div class="group" style="margin-top:12px"><h3 style="font-size:15px">Repartidor por barrio</h3>
      ${barrios.length?barrios.map(b=>{
        const actual = neighDrivers.find(n=>n.neighborhood===b)?.driver_user_id || ''
        return `<div class="row"><span>${b} ${zonaBadge(barrioZonaMap[b])}</span><select data-barrio-driver="${b}"><option value="">— Usa la regla de zona —</option>${repartidores.map(r=>`<option value="${r.user_id}" ${actual===r.user_id?'selected':''}>${r.full_name||'(sin nombre)'}</option>`).join('')}</select></div>`
      }).join(''):'<p class="muted">Todavía no hay barrios cargados (aparecen cuando hay clientes con barrio).</p>'}
    </div>
    <button class="btn ghost" id="btn_recalcular_asignaciones" style="margin-top:12px">🔄 Recalcular asignaciones automáticas ahora</button>
    <div style="margin-top:16px"><h3 style="font-size:15px;color:#2F4D2A">Reasignar pedidos puntuales</h3>
      <div class="field"><label>Filtrar por fecha de entrega</label><input type="date" id="filtro_fecha_asignar" value="${adminAsignarFecha}"/></div>
      ${adminAsignarFecha?`<button class="btn ghost" id="btn_limpiar_fecha_asignar" style="margin-bottom:10px">Ver todas las fechas</button>`:''}
      <div class="field"><label>Filtrar por tipo de cliente</label>
        <div class="grid three" id="filtro_tipo_asignar_group">
          <button type="button" class="btn ${adminAsignarTipo==='todos'?'primary':'ghost'}" data-filtro-tipo-asignar="todos">Todos</button>
          <button type="button" class="btn ${adminAsignarTipo==='minorista'?'primary':'ghost'}" data-filtro-tipo-asignar="minorista">🛍️ Minorista</button>
          <button type="button" class="btn ${adminAsignarTipo==='mayorista'?'primary':'ghost'}" data-filtro-tipo-asignar="mayorista">🏭 Mayorista</button>
        </div>
      </div>
      ${(()=>{
        let pedidosFiltrados = adminAsignarFecha ? pedidosAsignar.filter(p=>p.delivery_date===adminAsignarFecha) : pedidosAsignar
        if(adminAsignarTipo!=='todos') pedidosFiltrados = pedidosFiltrados.filter(p=>(p.customers?.customer_type||'minorista')===adminAsignarTipo)
        if(!pedidosFiltrados.length) return `<p class="muted">No hay pedidos pendientes para ese filtro.</p>`
        return pedidosFiltrados.map(p=>{
        const c=p.customers||{}
        const sub=p.subscriptions||{}
        const asignadoNombre = staffMap[p.assigned_driver] || '(sin asignar)'
        const freqLabel = FRECUENCIAS[sub.frequency]||sub.frequency||'-'
        const esMayorista = c.customer_type==='mayorista'
        const planLabel = sub.plan_breakdown && Array.isArray(sub.plan_breakdown) && sub.plan_breakdown.length
          ? sub.plan_breakdown.map(b=>`${b.qty}×${b.size}`).join(' + ')
          : `${p.egg_quantity||'-'} huevos`
        return pCard(`
          <div style="display:flex;align-items:flex-start;gap:10px">
            ${pAvatar(c.first_name)}
            <div style="flex:1">
              <div style="font-weight:700;color:#2F4D2A">${c.first_name||''} ${c.last_name||''} ${esMayorista?pPill('🏭 Mayorista','#B85C00','#FFFFFF'):''}</div>
              <div style="font-size:12px;color:#8A8570;margin-top:2px">🏘️ ${c.neighborhood||'-'} · 📍 ${c.street||''} ${c.street_number||''}</div>
              <div style="display:flex;gap:6px;align-items:center;margin-top:5px">${zonaBadge(c.zone)}${pPill(freqLabel)}</div>
              <div style="font-size:12px;color:#8A8570;margin-top:5px">🥚 ${planLabel}</div>
              <div style="font-size:12px;color:#8A8570;margin-top:3px">${formatearFecha(p.delivery_date)}</div>
              <div style="font-size:12px;margin-top:3px;color:${p.assignment_locked?'#B85C00':'#2F4D2A'}">${p.assignment_locked?'🔒 Manual':'🔄 Automático'} → <b>${asignadoNombre}</b></div>
              ${p.customer_stage?`<div style="font-size:11px;margin-top:3px;color:#B85C00">${p.customer_stage==='preparing'?'🥚 Marcado como "Preparando"':'🚚 Marcado como "En camino"'}</div>`:''}
            </div>
          </div>
          <select data-pedido-driver="${p.id}" style="width:100%;margin-top:10px"><option value="">— Sin asignar —</option>${repartidores.map(r=>`<option value="${r.user_id}" ${p.assigned_driver===r.user_id?'selected':''}>${r.full_name||'(sin nombre)'}</option>`).join('')}</select>
          ${pBtnRow([
            ...(p.assignment_locked?[pBtn('🔄','Volver a automático',`data-destrabar="${p.id}"`,'ghost')]:[])
          ])}
        `, 'margin-bottom:8px')
        }).join('')
      })()}
      <div style="border-top:1px solid ${NOM.borde};margin-top:14px;padding-top:14px">
        <div style="font-size:14px;font-weight:500;margin-bottom:3px">💬 Avisar la ruta</div>
        <p class="muted" style="font-size:12px;margin:0 0 10px">Cuando termines de asignar, avisales a los clientes quién les lleva el pedido. Reasignar no manda nada: los mensajes salen solo cuando tocás el botón.</p>
        <div id="avisar_ruta_box"><p class="muted" style="font-size:12px">Cargando…</p></div>
      </div>
    </div>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('vehiculos','🏍️','Vehículos y mantenimiento')}
    ${(()=>{
      const totalAlertas = (alertas.service?.length||0)+(alertas.vtv?.length||0)+(alertas.seguro?.length||0)+(alertas.carnet?.length||0)+(alertas.pagos_pendientes?.length||0)
      if(!totalAlertas) return '<div class="alert info">✅ Sin alertas pendientes de mantenimiento, VTV, seguro, carnet ni pagos.</div>'
      let html = '<div class="alert warning"><b>⚠️ Atención</b><br>'
      if(alertas.service?.length) html += alertas.service.map(a=>`Service próximo: patente <b>${a.plate}</b> (faltan ${Math.round(a.faltan_km)} km)<br>`).join('')
      if(alertas.vtv?.length) html += alertas.vtv.map(a=>`VTV vence pronto: patente <b>${a.plate}</b> (${a.vtv_expiry})<br>`).join('')
      if(alertas.seguro?.length) html += alertas.seguro.map(a=>`Seguro vence pronto: patente <b>${a.plate}</b> (${a.insurance_expiry})<br>`).join('')
      if(alertas.carnet?.length) html += alertas.carnet.map(a=>`Carnet vence pronto: <b>${a.full_name}</b> (${a.license_expiry})<br>`).join('')
      html += '</div>'
      if(alertas.pagos_pendientes?.length) html += `<div class="alert warning" style="margin-top:8px"><b>💸 Pagos de service pendientes desde administración</b>${alertas.pagos_pendientes.map(p=>{
        const fecha = new Date(p.service_date+'T00:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'})
        return `<div class="row" style="background:transparent"><span>Patente <b>${p.plate}</b> · ${fecha}<br><small>${p.description||''}</small></span><span style="display:flex;flex-direction:column;align-items:flex-end;gap:4px"><b>$${Number(p.cost||0).toLocaleString('es-AR')}</b><button class="btn ghost" data-pagar-service="${p.id}" style="font-size:11px;padding:4px 10px">✅ Marcar pagado</button></span></div>`
      }).join('')}</div>`
      return html
    })()}
    <div style="margin-top:12px"><h3 style="font-size:15px;color:#2F4D2A">Flota</h3>
      ${vehiculos.length? vehiculos.map(v=>{
        const staffAsig = staff.find(s=>s.user_id===v.assigned_to)
        const proximoService = v.last_service_km + v.service_interval_km
        const faltan = proximoService - v.current_km
        const pctRecorrido = v.service_interval_km>0 ? Math.max(0,Math.min(100,((v.current_km-v.last_service_km)/v.service_interval_km)*100)) : 0
        const alertaService = faltan<=500
        const editando = vehiculoEditando === v.id
        const vtvPronto = v.vtv_expiry && new Date(v.vtv_expiry) <= new Date(Date.now()+30*86400000)
        const seguroPronto = v.insurance_expiry && new Date(v.insurance_expiry) <= new Date(Date.now()+30*86400000)
        return pCard(`
          ${v.photo_url?`<div style="position:relative;margin:-14px -16px 12px"><img src="${v.photo_url}" style="width:100%;height:150px;object-fit:cover;display:block;border-radius:14px 14px 0 0"/><div style="position:absolute;top:10px;left:10px;background:#2F4D2A;color:#F5EFE0;font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px">${v.plate}</div></div>`:`<div style="margin-bottom:8px">${pPill(v.plate)}</div>`}
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px">
            <span style="font-size:17px;font-weight:700;color:#2F4D2A">${v.brand||''} ${v.model||''}</span>
            <span style="font-size:12px;color:#8A8570">${v.type==='moto'?'🏍️ Moto':'🚚 Camioneta'}</span>
          </div>
          <div style="font-size:12px;color:#8A8570;margin-bottom:12px">${staffAsig?`Asignada a ${staffAsig.full_name}`:'Sin asignar'}</div>
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:12px;color:#5F5E5A;margin-bottom:4px">
              <span>${Math.round(v.current_km)} km</span>
              <span style="color:${alertaService?'#B85C00':'#2F4D2A'};font-weight:600">${alertaService?'⚠️ ':''}Próximo service en ${Math.max(0,Math.round(faltan))} km</span>
            </div>
            ${pBar(pctRecorrido, '#8FAE6B', '#E8833A', alertaService)}
          </div>
          <div style="display:flex;gap:8px;margin-bottom:8px">
            <div style="flex:1;background:#F5EFE0;border-radius:10px;padding:8px 10px">
              <div style="font-size:11px;color:#8A8570">VTV</div>
              <div style="font-size:13px;font-weight:600;color:${vtvPronto?'#B85C00':'#2F4D2A'}">${v.vtv_expiry||'-'}${vtvPronto?' ⚠️':''}</div>
            </div>
            <div style="flex:1;background:#F5EFE0;border-radius:10px;padding:8px 10px">
              <div style="font-size:11px;color:#8A8570">Seguro</div>
              <div style="font-size:13px;font-weight:600;color:${seguroPronto?'#B85C00':'#2F4D2A'}">${v.insurance_expiry||'-'}${seguroPronto?' ⚠️':''}</div>
            </div>
          </div>
          <select data-vehiculo-asignar="${v.id}" style="width:100%;margin-bottom:8px"><option value="">— Sin asignar —</option>${staff.filter(s=>s.role==='repartidor'||s.role==='admin').map(s=>`<option value="${s.user_id}" ${v.assigned_to===s.user_id?'selected':''}>${s.full_name||'(sin nombre)'}</option>`).join('')}</select>
          ${pBtnRow([
            pBtn('📊','Estadísticas',`data-ver-stats="${v.id}"`,'primary'),
            pBtn('📄','Historial',`data-ver-historial="${v.id}"`,'ghost'),
            pBtn('✏️',editando?'Cerrar':'Editar',`data-editar-vehiculo="${v.id}"`,'ghost')
          ])}
          ${pBtnRow([
            pBtn('✅','Service',`data-marcar-service="${v.id}"`,'ghost'),
            pBtn('🗑️','Eliminar',`data-eliminar-vehiculo="${v.id}"`,'danger')
          ])}
          ${editando?`<div style="margin-top:12px;border-top:1px solid #E3DCC8;padding-top:12px">
            <div class="grid two">
              <div class="field"><label>Marca</label><input id="ed_veh_marca_${v.id}" value="${v.brand||''}"/></div>
              <div class="field"><label>Modelo</label><input id="ed_veh_modelo_${v.id}" value="${v.model||''}"/></div>
              <div class="field"><label>Color</label><input id="ed_veh_color_${v.id}" value="${v.color||''}"/></div>
              <div class="field"><label>Patente</label><input id="ed_veh_patente_${v.id}" value="${v.plate}"/></div>
              <div class="field"><label>Km actuales</label><input id="ed_veh_km_${v.id}" type="number" value="${v.current_km}"/></div>
              <div class="field"><label>Intervalo de service (km)</label><input id="ed_veh_intervalo_${v.id}" type="number" value="${v.service_interval_km}"/></div>
              <div class="field"><label>Vencimiento VTV</label><input id="ed_veh_vtv_${v.id}" type="date" value="${v.vtv_expiry||''}"/></div>
              <div class="field"><label>Vencimiento seguro</label><input id="ed_veh_seguro_${v.id}" type="date" value="${v.insurance_expiry||''}"/></div>
            </div>
            <div class="field"><label>Cambiar foto (opcional)</label><input type="file" id="ed_veh_foto_${v.id}" accept="image/*"/></div>
            <h3 style="font-size:14px;color:#2F4D2A;margin-top:14px">🔧 Mecánico de confianza</h3>
            <div class="grid two">
              <div class="field"><label>Nombre</label><input id="ed_mec_nombre_${v.id}" value="${v.mechanic_name||''}"/></div>
              <div class="field"><label>Teléfono</label><input id="ed_mec_telefono_${v.id}" value="${v.mechanic_phone||''}"/></div>
              <div class="field"><label>Teléfono para turnos</label><input id="ed_mec_turnos_${v.id}" value="${v.mechanic_appointment_phone||''}"/></div>
              <div class="field"><label>Mail</label><input id="ed_mec_mail_${v.id}" value="${v.mechanic_email||''}"/></div>
              <div class="field"><label>CUIT/DNI</label><input id="ed_mec_cuit_${v.id}" value="${v.mechanic_tax_id||''}"/></div>
              <div class="field"><label>Horarios de atención</label><input id="ed_mec_horario_${v.id}" value="${v.mechanic_hours||''}"/></div>
            </div>
            <div class="field"><label>Dirección</label><input id="ed_mec_direccion_${v.id}" value="${v.mechanic_address||''}"/></div>
            <div id="err_editar_veh_${v.id}" class="alert danger" style="display:none"></div>
            <button class="btn primary" data-guardar-vehiculo="${v.id}" style="width:100%">💾 Guardar cambios</button>
          </div>`:''}
        `)
      }).join('') : '<p class="muted">Todavía no cargaste vehículos.</p>'}
    </div>
    <div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;overflow:hidden;margin-top:16px">
      <button type="button" id="btn_toggle_form_vehiculo" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:12px 14px;cursor:pointer;gap:10px;background:${mostrarFormNuevoVehiculo?'#F5EFE0':'transparent'}">
        <span style="width:32px;height:32px;border-radius:9px;background:#EAF0DC;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">➕</span>
        <span style="flex:1;font-weight:700;font-size:14.5px;color:#2F4D2A">Agregar vehículo</span>
        <span style="font-size:13px;color:#8A8570">${mostrarFormNuevoVehiculo?'▲':'▼'}</span>
      </button>
      <div style="display:${mostrarFormNuevoVehiculo?'block':'none'};padding:10px 14px 14px">
      <div class="grid two">
        <div class="field"><label>Tipo</label><select id="veh_new_tipo"><option value="moto">Moto</option><option value="camioneta">Camioneta</option></select></div>
        <div class="field"><label>Patente</label><input id="veh_new_patente" placeholder="Ej: AB123CD"/></div>
        <div class="field"><label>Marca</label><input id="veh_new_marca" placeholder="Ej: Honda"/></div>
        <div class="field"><label>Modelo</label><input id="veh_new_modelo" placeholder="Ej: Wave 110"/></div>
        <div class="field"><label>Color</label><input id="veh_new_color" placeholder="Ej: Negro"/></div>
      </div>
      <div class="field"><label>Foto del vehículo</label><input type="file" id="veh_new_foto" accept="image/*"/></div>
      <div class="grid two">
        <div class="field"><label>Km actuales</label><input id="veh_new_km" type="number" min="0" value="0"/></div>
        <div class="field"><label>Cada cuántos km es el service</label><input id="veh_new_intervalo" type="number" min="1" value="3000"/></div>
        <div class="field"><label>Vencimiento VTV</label><input id="veh_new_vtv" type="date"/></div>
        <div class="field"><label>Vencimiento seguro</label><input id="veh_new_seguro" type="date"/></div>
      </div>
      <div class="field"><label>Asignar a</label><select id="veh_new_asignado"><option value="">— Sin asignar —</option>${staff.filter(s=>s.role==='repartidor'||s.role==='admin').map(s=>`<option value="${s.user_id}">${s.full_name||'(sin nombre)'}</option>`).join('')}</select></div>
      <div id="err_vehiculo" class="alert danger" style="display:none"></div>
      <button id="btn_crear_vehiculo" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600;margin-top:4px">💾 Guardar vehículo</button>
      </div>
    </div>
    <div style="margin-top:20px"><h3 style="font-size:15px;color:#2F4D2A">Vencimiento de carnet por persona</h3>
      ${staff.filter(s=>s.role==='repartidor'||s.role==='admin').map(s=>pCard(`
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
          <div style="display:flex;align-items:center;gap:10px">${pAvatar(s.full_name,34)}<span style="font-weight:600;color:#2F4D2A">${s.full_name||'(sin nombre)'}</span></div>
          <div style="display:flex;gap:6px;align-items:center">
            <input type="date" id="carnet_${s.user_id}" value="${s.license_expiry||''}" style="width:140px"/>
            <button data-guardar-carnet="${s.user_id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:9px;width:36px;height:36px;flex-shrink:0">💾</button>
          </div>
        </div>
      `, 'margin-bottom:8px')).join('')}
    </div>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('insumos','🧺','Compras e insumos')}
    <div class="grid two">
      <div class="field"><label>Producto</label><input id="prod_new_name" placeholder="Ej: Maíz"/></div>
      <div class="field"><label>Unidad de compra</label><input id="prod_new_unit" placeholder="Ej: saco de 25kg"/></div>
    </div>
    <div class="field"><label>Categoría</label><select id="prod_new_cat">${CATEGORIAS.map(c=>`<option value="${c.value}">${c.label}</option>`).join('')}</select></div>
    <button class="btn primary" id="btn_crear_producto" style="width:100%">➕ Agregar producto</button>
    <div id="err_producto" class="alert danger" style="display:none"></div>
    <div style="margin-top:16px">
      ${productos.length? productos.map(p=>pCard(`
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
          <div>
            <div style="font-weight:700;color:#2F4D2A">${p.name}${!p.active?' <span style="color:#8A8570;font-weight:400;font-size:12px">(inactivo)</span>':''}</div>
            <div style="display:flex;gap:6px;align-items:center;margin-top:4px">${pPill(CATLABEL[p.category]||p.category)}<span style="font-size:12px;color:#8A8570">${p.current_qty} × ${p.unit_label}</span></div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <input type="number" min="0" step="1" placeholder="Cantidad" id="compra_qty_${p.id}" style="flex:1"/>
          <button data-comprar="${p.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:0 16px;font-size:13px;font-weight:600;white-space:nowrap">+ Compra</button>
        </div>
      `, 'margin-bottom:8px')).join('') : '<p class="muted">Todavía no cargaste productos.</p>'}
    </div>
    <div style="margin-top:20px"><h3 style="font-size:15px;color:#2F4D2A">Últimos movimientos</h3>
      ${movimientos.length? movimientos.map(m=>{
        const prod = productMap[m.product_id]
        const quien = m.created_by ? (staffMap[m.created_by]||'Equipo') : 'Admin'
        const tipoLabel = m.type==='compra'?'🟢 Compra':m.type==='consumo'?'🔴 Consumo':'🔵 Ajuste'
        const fecha = new Date(m.created_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
        return pCard(`
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            <div>
              <div style="font-weight:600;color:#2F4D2A">${tipoLabel} · ${prod?prod.name:'(producto eliminado)'}</div>
              <div style="font-size:12px;color:#8A8570;margin-top:2px">${quien} · ${fecha}${m.note?' · '+m.note:''}</div>
            </div>
            <b style="color:#2F4D2A;white-space:nowrap">${m.quantity} ${prod?prod.unit_label:''}</b>
          </div>
        `, 'margin-bottom:8px')
      }).join('') : '<p class="muted">Sin movimientos todavía.</p>'}
    </div>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('tamanos','🥚','Tamaños de maple')}
    <p class="muted">Estos son los tamaños que el cliente puede combinar en su plan. Agregá, editá el precio o desactivá los que no quieras ofrecer, sin tocar código.</p>
    ${planPrices.length? planPrices.map(pp=>pCard(`
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
        <div>
          <div style="font-weight:700;color:#2F4D2A">${pp.customer_type==='mayorista' && pp.grade ? `${GRADO_LABEL[pp.grade]||pp.grade} · ${pp.egg_quantity} huevos` : `${pp.egg_quantity} huevos`} ${pp.customer_type==='mayorista'?'<span class="badge" style="background:#B85C00">🏭 Mayorista</span>':''}</div>
          ${!pp.active?pPill('Inactivo','#F3E2D8','#B85C00'):''}
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <input type="number" min="0" step="1" value="${pp.price}" id="pp_price_${pp.id}" style="width:90px"/>
          <button data-pp-save="${pp.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;width:38px;height:38px">💾</button>
        </div>
      </div>
      <button data-pp-toggle="${pp.id}" data-pp-active="${pp.active}" style="width:100%;margin-top:8px;background:#FFFFFF;color:${pp.active?'#B85C00':'#2F4D2A'};border:1px solid #E3DCC8;border-radius:10px;padding:8px 0;font-size:12px;font-weight:600">${pp.active?'Desactivar':'Activar'}</button>
    `, 'margin-bottom:8px')).join('') : '<p class="muted">Todavía no cargaste tamaños.</p>'}
    <div class="grid two" style="margin-top:10px">
      <div class="field"><label>Nuevo tamaño (huevos)</label><input id="pp_new_qty" type="number" min="1" placeholder="Ej: 12"/></div>
      <div class="field"><label>Precio</label><input id="pp_new_price" type="number" min="0" placeholder="Ej: 5000"/></div>
    </div>
    <div class="field"><label>Para qué tipo de cliente</label>
      <div class="grid two">
        <button type="button" id="btn_pp_tipo_minorista" class="btn primary">🛍️ Minorista</button>
        <button type="button" id="btn_pp_tipo_mayorista" class="btn ghost">🏭 Mayorista</button>
      </div>
    </div>
    <div class="field" id="pp_grade_wrap" style="display:none"><label>Tamaño del huevo</label>
      <div class="grid two">
        ${GRADOS_HUEVO.map(g=>`<button type="button" class="btn ghost" data-pp-grade="${g.value}" style="text-align:left;padding:11px 12px"><span style="font-size:13px;font-weight:500">${g.label}</span>${g.peso?`<br><span style="font-size:10.5px;opacity:0.7">${g.peso}</span>`:''}</button>`).join('')}
      </div>
      <p class="muted" style="font-size:11.5px;margin:6px 0 0">Los tamaños se editan desde Comercial → Tamaños de huevo.</p>
    </div>
    <div class="field" id="pp_unidad_wrap" style="display:none"><label>Cómo se vende</label>
      <div class="grid three">
        ${[['maple','Maple'],['caja','Caja'],['cajon','Cajón']].map(([v,l])=>`<button type="button" class="btn ${v==='maple'?'primary':'ghost'}" data-pp-unidad="${v}">${l}</button>`).join('')}
      </div>
    </div>
    <button class="btn primary" id="btn_agregar_tamano">➕ Agregar tamaño</button>
    <div id="err_tamano" class="alert danger" style="display:none;margin-top:8px"></div>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('capacidad','📅','Capacidad y lista de espera')}
    <div class="field"><label>Capacidad base diaria (en huevos), por si todavía no hay producción cargada para estimar</label><input id="cap_base" type="number" min="0" value="${capacidadBase}"/></div>
    <button class="btn ghost" id="btn_guardar_capacidad" style="width:100%">Guardar capacidad base</button>
    <div id="err_capacidad" class="alert danger" style="display:none;margin-top:8px"></div>
    <div style="margin-top:20px"><h3 style="font-size:15px;color:#2F4D2A">Lista de espera (${waitlist.length})</h3>
      ${waitlist.length? waitlist.map((w,i)=>{
        const c = w.customers||{}
        const freqLabel = FRECUENCIAS[w.frequency]||w.frequency
        return pCard(`
          <div style="display:flex;align-items:center;gap:10px">
            ${pAvatar(c.first_name)}
            <div style="flex:1">
              <div style="font-weight:700;color:#2F4D2A">#${i+1} ${c.first_name||''} ${c.last_name||''}</div>
              <div style="font-size:12px;color:#8A8570;margin-top:2px">${w.egg_quantity} huevos · ${freqLabel} · 📞 ${c.phone||'-'}</div>
            </div>
          </div>
          <button data-promover="${w.id}" style="width:100%;margin-top:10px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:9px 0;font-size:13px;font-weight:600">✅ Activar</button>
        `, 'margin-bottom:8px')
      }).join('') : '<p class="muted">Nadie en lista de espera por ahora 🎉</p>'}
    </div>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('cobros','💳','Datos para cobros digitales')}
    <p class="muted">Esto se le muestra al repartidor cuando un cliente paga digital, para que pueda copiarlo y compartirlo. Editalo cuando quieras (cambio de banco, de cuenta, etc.).</p>
    <div style="background:#F5EFE0;border-radius:12px;overflow:hidden;margin-top:8px">
      <button type="button" data-sub-acc="transfer" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:11px 12px;cursor:pointer;gap:8px">
        <span style="font-size:15px">🏦</span>
        <span style="flex:1;font-weight:700;font-size:13.5px;color:#2F4D2A">Transferencia bancaria</span>
        <span style="font-size:12px;color:#8A8570">${cobrosSubSeccion==='transfer'?'▲':'▼'}</span>
      </button>
      <div style="display:${cobrosSubSeccion==='transfer'?'block':'none'};padding:4px 12px 12px">
        <div class="field"><label>Nombre del banco</label><input id="cfg_bank_name" value="${settingsMap.transfer_bank_name||''}"/></div>
        <div class="field"><label>Alias</label><input id="cfg_alias" value="${settingsMap.transfer_alias||''}"/></div>
        <div class="field"><label>CBU</label><input id="cfg_cbu" value="${settingsMap.transfer_cbu||''}"/></div>
        <div class="field"><label>Nombre del titular</label><input id="cfg_holder_name" value="${settingsMap.transfer_holder_name||''}"/></div>
        <div class="field"><label>DNI/CUIT del titular</label><input id="cfg_holder_doc" value="${settingsMap.transfer_holder_doc||''}"/></div>
      </div>
    </div>
    <div style="background:#F5EFE0;border-radius:12px;overflow:hidden;margin-top:8px">
      <button type="button" data-sub-acc="mp" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:11px 12px;cursor:pointer;gap:8px">
        <span style="font-size:15px">📱</span>
        <span style="flex:1;font-weight:700;font-size:13.5px;color:#2F4D2A">Billetera virtual</span>
        <span style="font-size:12px;color:#8A8570">${cobrosSubSeccion==='mp'?'▲':'▼'}</span>
      </button>
      <div style="display:${cobrosSubSeccion==='mp'?'block':'none'};padding:4px 12px 12px">
        <div class="field"><label>Nombre de la billetera</label><input id="cfg_mp_name" value="${settingsMap.mp_wallet_name||''}" placeholder="Ej: Mercado Pago"/></div>
        <div class="field"><label>Alias</label><input id="cfg_mp" value="${settingsMap.mp_alias||''}"/></div>
        <div class="field"><label>CBU</label><input id="cfg_mp_cbu" value="${settingsMap.mp_cbu||''}"/></div>
        <div class="field"><label>Nombre del titular</label><input id="cfg_mp_holder_name" value="${settingsMap.mp_holder_name||''}"/></div>
        <div class="field"><label>DNI/CUIT del titular</label><input id="cfg_mp_holder_doc" value="${settingsMap.mp_holder_doc||''}"/></div>
      </div>
    </div>
    <button id="btn_guardar_pago_config" style="width:100%;margin-top:14px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">💾 Guardar datos de cobro</button>
    <div style="background:#F5EFE0;border-radius:12px;overflow:hidden;margin-top:14px">
      <button type="button" data-sub-acc="descuento" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:11px 12px;cursor:pointer;gap:8px">
        <span style="font-size:15px">🎉</span>
        <span style="flex:1;font-weight:700;font-size:13.5px;color:#2F4D2A">Descuento por billetera virtual</span>
        <span style="font-size:12px;color:#8A8570">${cobrosSubSeccion==='descuento'?'▲':'▼'}</span>
      </button>
      <div style="display:${cobrosSubSeccion==='descuento'?'block':'none'};padding:4px 12px 12px">
        <p class="muted" style="font-size:12px">Se resta sola del precio cuando el cliente elige pagar por billetera virtual — así reducimos el efectivo que anda circulando con los repartidores.</p>
        <div class="field"><label>Tipo de descuento</label>
          <div class="grid two">
            <button type="button" id="btn_desc_percent" class="btn ${(settingsMap.wallet_discount_type||'percent')==='percent'?'primary':'ghost'}">Porcentaje</button>
            <button type="button" id="btn_desc_fixed" class="btn ${settingsMap.wallet_discount_type==='fixed'?'primary':'ghost'}">Monto fijo</button>
          </div>
        </div>
        <div class="field"><label id="lbl_desc_valor">Valor (%)</label><input id="cfg_wallet_discount_value" type="number" min="0" step="0.1" value="${settingsMap.wallet_discount_value||'0'}"/></div>
        <button id="btn_guardar_descuento" style="width:100%;margin-top:6px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:10px 0;font-size:13px;font-weight:600">💾 Guardar descuento</button>
      </div>
    </div>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('rendicion','🧾','Rendición y conciliación')}
    <div class="field"><label>Elegí la fecha a ver</label><input type="date" id="rend_fecha" value="${adminRendicionFecha || new Date().toISOString().slice(0,10)}"/></div>
    ${(()=>{
      const fecha = adminRendicionFecha || new Date().toISOString().slice(0,10)
      const pagosDia = pagos.filter(p=>p.created_at.slice(0,10)===fecha)
      const totalPorMetodo = m => pagosDia.filter(p=>p.method===m).reduce((s,p)=>s+Number(p.amount||0),0)
      const totalRendido = totalPorMetodo('cash')+totalPorMetodo('transfer')+totalPorMetodo('mp')
      return `<div class="grid two">
        <div style="background:#2F4D2A;border-radius:12px;padding:10px 8px;text-align:center"><div style="color:#C9D8B0;font-size:11px">Efectivo</div><div style="color:#F5EFE0;font-size:15px;font-weight:700">$${totalPorMetodo('cash').toLocaleString('es-AR')}</div></div>
        <div style="background:#2F4D2A;border-radius:12px;padding:10px 8px;text-align:center"><div style="color:#C9D8B0;font-size:11px">Transferencia</div><div style="color:#F5EFE0;font-size:15px;font-weight:700">$${totalPorMetodo('transfer').toLocaleString('es-AR')}</div></div>
        <div style="background:#2F4D2A;border-radius:12px;padding:10px 8px;text-align:center"><div style="color:#C9D8B0;font-size:11px">Mercado Pago</div><div style="color:#F5EFE0;font-size:15px;font-weight:700">$${totalPorMetodo('mp').toLocaleString('es-AR')}</div></div>
        <div style="background:#E8833A;border-radius:12px;padding:10px 8px;text-align:center"><div style="color:#FCE4D0;font-size:11px">Total rendido</div><div style="color:#FFFFFF;font-size:15px;font-weight:700">$${totalRendido.toLocaleString('es-AR')}</div></div>
      </div>
      <div style="margin-top:16px">
        ${pagosDia.length? pagosDia.map(p=>{
          const c=p.customers||{}
          const distinto = p.expected_method && p.expected_method !== p.method
          const hora = new Date(p.created_at).toLocaleString('es-AR',{hour:'2-digit',minute:'2-digit'})
          const editando = pagoEditando===p.id
          return pCard(`
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
              <div>
                <div style="font-weight:600;color:#2F4D2A">${c.first_name||''} ${c.last_name||''}</div>
                <div style="margin-top:3px">${pPill(METODOS_PAGO_LABEL[p.method]||p.method)}</div>
                ${distinto?`<div style="font-size:11px;color:#B85C00;margin-top:3px">esperado: ${METODOS_PAGO_LABEL[p.expected_method]||p.expected_method}</div>`:''}
                <div style="font-size:12px;color:#8A8570;margin-top:3px">${hora} · $${Number(p.amount||0).toLocaleString('es-AR')}</div>
              </div>
              <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#2F4D2A;white-space:nowrap"><input type="checkbox" data-conciliar="${p.id}" ${p.reconciled?'checked':''}/> Conciliado</label>
            </div>
            ${editando?`<div style="display:flex;gap:8px;margin-top:10px"><input type="number" id="pago_monto_${p.id}" value="${p.amount}" style="flex:1"/><button data-guardar-pago="${p.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:9px;padding:0 14px;font-size:12px;font-weight:600">Guardar</button></div>`:''}
            ${pBtnRow([pBtn('✏️',editando?'Cerrar':'Editar',`data-editar-pago="${p.id}"`,'ghost'), pBtn('🗑️','Eliminar',`data-eliminar-pago="${p.id}"`,'danger')])}
          `, 'margin-bottom:8px')
        }).join('') : '<p class="muted">No hay pagos registrados para esta fecha.</p>'}
      </div>`
    })()}

    <div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;overflow:hidden;margin-top:20px">
      <button type="button" id="btn_toggle_form_diferencia" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:12px 14px;cursor:pointer;gap:10px;background:${mostrarFormDiferencia?'#F5EFE0':'transparent'}">
        <span style="width:32px;height:32px;border-radius:9px;background:#F3E2D8;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">⚠️</span>
        <span style="flex:1;font-weight:700;font-size:14.5px;color:#2F4D2A">Registrar diferencia de caja</span>
        <span style="font-size:13px;color:#8A8570">${mostrarFormDiferencia?'▲':'▼'}</span>
      </button>
      <div style="display:${mostrarFormDiferencia?'block':'none'};padding:10px 14px 14px">
        <p class="muted" style="font-size:12px">Usalo si a un repartidor no le cerró la rendición. Un monto negativo queda anotado como saldo que debe; uno positivo como saldo a favor o un pago que hizo.</p>
        <div class="field"><label>Repartidor</label><select id="dif_repartidor">${repartidores.map(r=>`<option value="${r.user_id}">${r.full_name||'(sin nombre)'}</option>`).join('')}</select></div>
        <div class="grid two">
          <div class="field"><label>Fecha de la incidencia</label><input id="dif_fecha" type="date" value="${adminRendicionFecha || new Date().toISOString().slice(0,10)}"/></div>
          <div class="field"><label>Monto (negativo = debe)</label><input id="dif_monto" type="number"/></div>
        </div>
        <div class="field"><label>Motivo</label><input id="dif_motivo" placeholder="Ej: faltaron $2.000 en la rendición del lunes"/></div>
        <div id="err_diferencia" class="alert danger" style="display:none"></div>
        <button id="btn_guardar_diferencia" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">💾 Guardar</button>
      </div>
    </div>

    <div style="margin-top:16px"><h3 style="font-size:15px;color:#2F4D2A">Cuentas de repartidores</h3>
      ${repartidores.length? repartidores.map(r=>{
        const entradas = driverLedger.filter(l=>l.driver_id===r.user_id)
        const saldo = entradas.reduce((s,l)=>s+Number(l.amount||0),0)
        const abierta = cuentaRepartidorAbierta===r.user_id
        return `<div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;overflow:hidden;margin-bottom:8px">
          <button type="button" data-toggle-cuenta="${r.user_id}" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:12px 14px;cursor:pointer;gap:10px">
            ${pAvatar(r.full_name,34)}
            <span style="flex:1;font-weight:600;color:#2F4D2A">${r.full_name||'(sin nombre)'}</span>
            <span style="font-weight:700;color:${saldo<0?'#B03A2E':'#2F4D2A'}">${saldo<0?'-':''}$${Math.abs(saldo).toLocaleString('es-AR')}</span>
          </button>
          <div style="display:${abierta?'block':'none'};padding:0 14px 14px">
            ${entradas.length? entradas.map(l=>{
              const fecha = new Date(l.entry_date+'T00:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'})
              return `<div class="row" style="background:transparent"><span>${fecha}<br><small>${l.description||''}</small></span><span style="display:flex;align-items:center;gap:8px"><b style="color:${l.amount<0?'#B03A2E':'#2F4D2A'}">${l.amount<0?'-':'+'}$${Math.abs(l.amount).toLocaleString('es-AR')}</b><button data-eliminar-ledger="${l.id}" style="background:#FFFFFF;color:#B03A2E;border:1px solid #E3DCC8;border-radius:8px;padding:5px 9px;font-size:11px">🗑️</button></span></div>`
            }).join('') : '<p class="muted" style="font-size:12px">Sin movimientos.</p>'}
          </div>
        </div>`
      }).join('') : '<p class="muted">Todavía no hay repartidores.</p>'}
    </div>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('ranking','🏆','Ranking de clientes')}
    <p class="muted">Tus 20 clientes que más gastaron, en orden. Te sirve para identificar a los más fieles.</p>
    ${ranking.length? ranking.map((r,i)=>pCard(`
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:28px;text-align:center;font-weight:700;color:${i<3?'#E8833A':'#8A8570'};font-size:${i<3?'16px':'14px'}">${i+1}${i===0?'🥇':i===1?'🥈':i===2?'🥉':''}</div>
        ${pAvatar(r.first_name,36)}
        <div style="flex:1">
          <div style="font-weight:700;color:#2F4D2A">${r.first_name||''} ${r.last_name||''}</div>
          <div style="font-size:12px;color:#8A8570">${r.neighborhood||'-'} · ${r.entregas} entrega(s)</div>
        </div>
        <div style="font-weight:700;color:#2F4D2A;white-space:nowrap">$${Number(r.total_gastado).toLocaleString('es-AR')}</div>
      </div>
    `, 'margin-bottom:8px')).join('') : '<p class="muted">Todavía no hay suficientes entregas para armar un ranking.</p>'}
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('resenas','⭐','Reseñas de clientes')}
    <p class="muted">Marcá "Destacar" para que aparezca en la portada del sitio, como prueba social.</p>
    ${reviews.length? reviews.map((r,i)=>pCard(`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div>
          <div style="font-weight:700;color:#F5B301">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
          <div style="font-size:12px;color:#8A8570;margin-top:2px">${r.first_name||''} ${r.last_name||''}</div>
          ${r.comment?`<div style="font-size:13px;color:#3A3A34;margin-top:6px">"${r.comment}"</div>`:''}
        </div>
      </div>
      <button data-destacar-review="${r.id}" data-featured="${r.featured}" style="width:100%;margin-top:10px;background:${r.featured?'#2F4D2A':'#FFFFFF'};color:${r.featured?'#F5EFE0':'#2F4D2A'};border:1px solid #E3DCC8;border-radius:10px;padding:8px 0;font-size:12px;font-weight:600">${r.featured?'✅ Destacada en portada':'☆ Destacar en portada'}</button>
    `, `margin-bottom:8px;animation:nomEntrada 0.35s ease both;animation-delay:${Math.min(i*0.04,0.4)}s`)).join('') : '<p class="muted">Todavía no hay reseñas de clientes.</p>'}
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('catalogo','🛒','Catálogo de productos')}
    <p class="muted">Otros productos que vendés además de los huevos (aceite, vinagre, condimentos, etc.) — los clientes los ven en su cuenta y los suman a su entrega.</p>
    <div style="background:#F5EFE0;border-radius:12px;overflow:hidden;margin-bottom:12px">
      <button type="button" id="btn_toggle_form_proveedor" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:11px 12px;cursor:pointer;gap:8px">
        <span style="font-size:15px">🏢</span>
        <span style="flex:1;font-weight:700;font-size:13.5px;color:#2F4D2A">Empresas proveedoras (${suppliers.length})</span>
        <span style="font-size:12px;color:#8A8570">${mostrarFormNuevoProveedor?'▲':'▼'}</span>
      </button>
      <div style="display:${mostrarFormNuevoProveedor?'block':'none'};padding:4px 12px 12px">
        ${suppliers.map(s=>`<div class="row"><span>${s.name}${s.tipo&&s.tipo!=='almacen'?' '+pPill(s.tipo==='huevos'?'Huevos':'Huevos y almacén','#FBE9D4','#B8641E'):''}<br><small class="muted">${s.contact_phone||''} ${s.contact_email||''}</small></span></div>`).join('')}
        <div class="field" style="margin-top:8px"><label>Nombre de la empresa o productor</label><input id="prov_new_name"/></div>
        <div class="field"><label>¿Qué le comprás?</label>
          <div class="grid three">
            <button type="button" class="btn ${proveedorTipoNuevo==='almacen'?'primary':'ghost'}" data-prov-tipo="almacen">Almacén</button>
            <button type="button" class="btn ${proveedorTipoNuevo==='huevos'?'primary':'ghost'}" data-prov-tipo="huevos">Huevos</button>
            <button type="button" class="btn ${proveedorTipoNuevo==='ambos'?'primary':'ghost'}" data-prov-tipo="ambos">Los dos</button>
          </div>
        </div>
        <div class="grid two">
          <div class="field"><label>Teléfono (WhatsApp)</label><input id="prov_new_phone" placeholder="Ej: 3411234567"/></div>
          <div class="field"><label>Email</label><input id="prov_new_email"/></div>
        </div>
        <div class="field"><label>Dirección</label><input id="prov_new_address"/></div>
        <button id="btn_crear_proveedor" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:10px 0;font-size:13px;font-weight:600">💾 Agregar empresa</button>
      </div>
    </div>
    <div style="background:#F5EFE0;border-radius:12px;overflow:hidden;margin-bottom:12px">
      <button type="button" id="btn_toggle_form_producto" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:11px 12px;cursor:pointer;gap:8px">
        <span style="font-size:15px">➕</span>
        <span style="flex:1;font-weight:700;font-size:13.5px;color:#2F4D2A">Agregar producto</span>
        <span style="font-size:12px;color:#8A8570">${mostrarFormNuevoProducto?'▲':'▼'}</span>
      </button>
      <div style="display:${mostrarFormNuevoProducto?'block':'none'};padding:4px 12px 12px">
        <div class="field"><label>Empresa proveedora</label><select id="catprod_new_supplier"><option value="">Sin especificar</option>${suppliers.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
        <div class="field"><label>Nombre del producto</label><input id="catprod_new_name" placeholder="Ej: Aceite de girasol 900ml"/></div>
        <div class="field"><label>Descripción</label><textarea id="catprod_new_desc" rows="2" placeholder="Ej: Ideal para todo tipo de cocción"></textarea></div>
        <div class="grid two">
          <div class="field"><label>Precio de costo</label><input id="catprod_new_costo" type="number" min="0" placeholder="Lo que te cuesta"/></div>
          <div class="field"><label>Unidad</label><input id="catprod_new_unit" placeholder="Ej: botella, paquete"/></div>
        </div>
        <div style="background:${NOM.verdeClaro};border-radius:12px;padding:12px;margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">Minorista</span>
            <label style="display:flex;align-items:center;gap:7px;font-size:12px"><input type="checkbox" id="catprod_vis_min" checked style="width:17px;height:17px"/> Se vende</label>
          </div>
          <div class="grid two">
            <div class="field" style="margin:0"><label style="font-size:11.5px">Margen %</label><input id="catprod_margen_min" type="number" min="0" value="${margenDefMin}"/></div>
            <div class="field" style="margin:0"><label style="font-size:11.5px">Precio de venta</label><input id="catprod_new_price" type="number" min="0"/></div>
          </div>
          <p id="ganancia_min" class="muted" style="font-size:12px;margin:7px 0 0"></p>
        </div>
        <div style="background:${NOM.verdeClaro};border-radius:12px;padding:12px;margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">Mayorista</span>
            <label style="display:flex;align-items:center;gap:7px;font-size:12px"><input type="checkbox" id="catprod_vis_may" checked style="width:17px;height:17px"/> Se vende</label>
          </div>
          <div class="grid two">
            <div class="field" style="margin:0"><label style="font-size:11.5px">Margen %</label><input id="catprod_margen_may" type="number" min="0" value="${margenDefMay}"/></div>
            <div class="field" style="margin:0"><label style="font-size:11.5px">Precio de venta</label><input id="catprod_price_may" type="number" min="0"/></div>
          </div>
          <p id="ganancia_may" class="muted" style="font-size:12px;margin:7px 0 0"></p>
        </div>
        <div class="field"><label>Categoría</label><select id="catprod_new_cat">${CATEGORIAS_CATALOGO.map(cat=>`<option value="${cat}">${cat}</option>`).join('')}</select></div>
        <div class="field"><label>Stock disponible (opcional — dejalo vacío si no querés controlarlo)</label><input id="catprod_new_stock" type="number" min="0" placeholder="Ej: 20"/></div>
        <label style="display:flex;align-items:center;gap:10px;font-size:14px;margin-bottom:10px"><input type="checkbox" id="catprod_new_venc" ${productoControlaVenc?'checked':''} style="width:18px;height:18px"/> Este producto vence</label>
        <div id="campo_vida_util" style="display:${productoControlaVenc?'block':'none'}">
          <div class="field"><label>¿Cuántos días dura desde que lo recibimos?</label><input id="catprod_new_vida" type="number" min="1" placeholder="Ej: 540 para un aceite, 21 para huevos"/>
          <p class="muted" style="font-size:12px;margin-top:6px">El sistema calcula el vencimiento solo. Al recibir la mercadería vas a poder corregir la fecha si el envase dice otra cosa.</p></div>
        </div>
        <div class="field"><label>Foto del producto</label><input type="file" id="prod_new_foto" accept="image/*"/></div>
        <button id="btn_crear_producto_catalogo" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:10px 0;font-size:13px;font-weight:600">💾 Guardar producto</button>
      </div>
    </div>
    ${catalogo.length? catalogo.map(p=>{
      const abierto = productoExpandido===p.id
      const detalle = productoDetalleCache[p.id]
      return `<div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;overflow:hidden;margin-bottom:8px">
        <button type="button" data-toggle-producto="${p.id}" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:12px;cursor:pointer;gap:10px;background:${abierto?'#F5EFE0':'transparent'}">
          ${p.photo_url?`<div style="width:40px;height:40px;border-radius:8px;background:#F5EFE0;padding:2px;flex-shrink:0"><img src="${p.photo_url}" style="width:100%;height:100%;border-radius:6px;object-fit:cover"/></div>`:`<div style="width:40px;height:40px;border-radius:8px;background:#EAF0DC;display:flex;align-items:center;justify-content:center">🛒</div>`}
          <div style="flex:1;text-align:left">
            <div style="font-weight:700;color:#2F4D2A">${p.name}${!p.active?' <span class="muted">(inactivo)</span>':''}</div>
            <div style="font-size:12px;color:#8A8570">$${Number(p.price).toLocaleString('es-AR')} · ${p.supplier_name||'sin empresa'} · ${p.interesados} interesado(s)${p.stock!==null?` · <span style="color:${p.stock>0?'#2F4D2A':'#B03A2E'}">${p.stock} en stock</span>`:''}</div>
          </div>
          <span style="font-size:12px;color:#8A8570">${abierto?'▲':'▼'}</span>
        </button>
        <div style="display:${abierto?'block':'none'};padding:0 12px 12px">
          ${!detalle ? '<p class="muted">Cargando…</p>' : `
            <div style="border-top:1px solid #F0EBDD;padding-top:10px">
              <h4 style="font-size:13px;color:#2F4D2A;margin-bottom:6px">Foto</h4>
              <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
                <img id="preview_foto_${p.id}" src="${p.photo_url||''}" style="width:52px;height:52px;border-radius:8px;object-fit:cover;background:#F5EFE0;display:${p.photo_url?'block':'none'}"/>
                <div style="flex:1"><input type="file" id="foto_producto_${p.id}" accept="image/*"/></div>
              </div>
              <button data-subir-foto="${p.id}" style="width:100%;margin-bottom:12px;background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8;border-radius:10px;padding:8px 0;font-size:12px;font-weight:600">📷 Guardar foto</button>
              <h4 style="font-size:13px;color:#2F4D2A;margin-bottom:6px">Subir precio</h4>
              <div style="display:flex;gap:6px;margin-bottom:8px">
                <input id="ajuste_valor_${p.id}" type="number" placeholder="Ej: 5" style="flex:1"/>
                <button data-ajustar-precio="${p.id}" data-tipo="percent" style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:8px;padding:0 10px;font-size:12px;font-weight:600;color:#2F4D2A">%</button>
                <button data-ajustar-precio="${p.id}" data-tipo="fixed" style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:8px;padding:0 10px;font-size:12px;font-weight:600;color:#2F4D2A">$ fijo</button>
              </div>
              <p class="muted" style="font-size:11px;margin-bottom:10px">Precio actual: $${Number(p.price).toLocaleString('es-AR')}</p>
              <h4 style="font-size:13px;color:#2F4D2A;margin-bottom:6px">🏭 Precio mayorista (opcional)</h4>
              <div style="display:flex;gap:6px;margin-bottom:6px">
                <input id="mayorista_valor_${p.id}" type="number" min="0" value="${p.wholesale_price||''}" placeholder="Vacío = no se ofrece a mayoristas" style="flex:1"/>
                <button data-guardar-mayorista="${p.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:0 14px;font-size:12px;font-weight:600">Guardar</button>
              </div>
              <button data-toggle-wholesale-only="${p.id}" data-wholesale-only="${p.wholesale_only}" style="width:100%;background:${p.wholesale_only?'#2F4D2A':'#FFFFFF'};color:${p.wholesale_only?'#F5EFE0':'#2F4D2A'};border:1px solid #E3DCC8;border-radius:10px;padding:8px 0;font-size:12px;font-weight:600;margin-bottom:10px">${p.wholesale_only?'🏭 Solo mayoristas (tocá para mostrar también a clientes de casa)':'Mostrar también a clientes de casa (tocá para dejarlo solo mayorista)'}</button>
              <h4 style="font-size:13px;color:#2F4D2A;margin-bottom:6px">Stock</h4>
              <div style="display:flex;gap:6px;margin-bottom:10px">
                <input id="stock_valor_${p.id}" type="number" min="0" value="${p.stock===null?'':p.stock}" placeholder="Vacío = sin control" style="flex:1"/>
                <button data-guardar-stock="${p.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:0 14px;font-size:12px;font-weight:600">Guardar</button>
              </div>
              <h4 style="font-size:13px;color:#2F4D2A;margin-bottom:6px">Categoría</h4>
              <div style="display:flex;gap:6px;margin-bottom:10px">
                <select id="cat_valor_${p.id}" style="flex:1">${CATEGORIAS_CATALOGO.map(cat=>`<option value="${cat}" ${p.category===cat?'selected':''}>${cat}</option>`).join('')}</select>
                <button data-guardar-categoria="${p.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:0 14px;font-size:12px;font-weight:600">Guardar</button>
              </div>
              <button data-toggle-activo="${p.id}" data-activo="${p.active}" style="width:100%;background:${p.active?'#FFFFFF':'#2F4D2A'};color:${p.active?'#B85C00':'#F5EFE0'};border:1px solid #E3DCC8;border-radius:10px;padding:8px 0;font-size:12px;font-weight:600;margin-bottom:10px">${p.active?'Desactivar (dejar de ofrecer)':'Activar de nuevo'}</button>
              <h4 style="font-size:13px;color:#2F4D2A;margin-bottom:6px">¿Quién lo pidió?</h4>
              ${detalle.length? detalle.map(d=>`<div class="row"><span>${d.first_name||''} ${d.last_name||''} · ${d.quantity} un.${d.source==='phone'?' <span style="color:#B85C00;font-size:11px">📞 Teléfono</span>':''}</span><span class="muted" style="font-size:11px">${new Date(d.created_at).toLocaleDateString('es-AR')}</span></div>`).join('') : '<p class="muted" style="font-size:12px">Todavía nadie lo pidió.</p>'}
            </div>
          `}
        </div>
      </div>`
    }).join('') : '<p class="muted">Todavía no cargaste productos.</p>'}
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('pedidos_proveedor','📋','Pedidos y cuenta con proveedores', pedidosProveedor.filter(o=>o.status==='generado').length?String(pedidosProveedor.filter(o=>o.status==='generado').length):null)}
    ${(()=>{
      const pedidoRecibiendo = pedidoProveedorRecibiendoId ? pedidosProveedor.find(o=>o.id===pedidoProveedorRecibiendoId) : null

      if(pedidoProveedorGenerado){
        return `<div style="text-align:center;padding:4px 0 8px">
          <div style="font-size:26px">📋</div>
          <h3 style="font-size:14px;color:#2F4D2A;margin:4px 0 2px">Pedido N° ${pedidoProveedorNumero||''} listo</h3>
        </div>
        <div style="background:#FFFDF7;border:1px solid #E3DCC8;border-radius:12px;padding:16px;white-space:pre-line;font-size:13px;line-height:1.9;color:#2F4D2A">${pedidoProveedorGenerado}</div>
        <div style="display:flex;gap:8px;margin-top:10px">
          ${(()=>{ const prov = suppliers.find(s=>s.id===proveedorPedidoSeleccionado); return prov?.contact_phone?`<button id="btn_enviar_whatsapp_proveedor" style="flex:1;background:#25D366;color:#fff;border:none;border-radius:10px;padding:10px 0;font-size:12px;font-weight:600">💬 WhatsApp</button>`:'' })()}
          <button id="btn_imprimir_pedido_proveedor" style="flex:1;background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8;border-radius:10px;padding:10px 0;font-size:12px;font-weight:600">🖨️ Guardar como PDF</button>
        </div>
        <button id="btn_pedido_listo_volver" style="width:100%;margin-top:12px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:13px;font-weight:600">✅ Listo, volver a la lista</button>
        <p class="muted" style="font-size:11.5px;text-align:center;margin-top:8px">Este pedido va a quedar guardado en "📥 Pendientes de recibir" — cuando te llegue, entrás ahí y hacés el checklist.</p>
        `
      }

      if(pedidoProveedorRecienRecibido){
        const r = pedidoProveedorRecienRecibido
        return `<div style="text-align:center;padding:6px 0 10px">
          <div style="font-size:28px">✅</div>
          <h3 style="font-size:14px;color:#2F4D2A;margin:4px 0 2px">Recepción registrada</h3>
          <p class="muted" style="font-size:12.5px">Pedido N° ${r.order_number} · A pagar: $${Number(r.total_a_pagar).toLocaleString('es-AR')}</p>
        </div>
        <p class="muted" style="font-size:12.5px;text-align:center;margin-bottom:8px">¿Lo pagás ahora?</p>
        <button id="btn_pagar_ahora_total" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:10px 0;font-size:13px;font-weight:600">💰 Pagar todo ahora ($${Number(r.total_a_pagar).toLocaleString('es-AR')})</button>
        <button id="btn_pagar_ahora_parcial" style="width:100%;margin-top:8px;background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8;border-radius:10px;padding:10px 0;font-size:13px;font-weight:600">🔸 Pagar una parte</button>
        <div id="pagar_ahora_parcial_box" style="display:none;margin-top:8px">
          <div class="field"><label>¿Cuánto pagás ahora?</label><input id="pagar_ahora_monto" type="number" min="0" max="${r.total_a_pagar}" placeholder="Ej: ${Math.round(r.total_a_pagar/2)}"/></div>
          <button id="btn_confirmar_pago_parcial_ahora" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:10px 0;font-size:13px;font-weight:600">Guardar pago</button>
        </div>
        <button id="btn_pagar_ahora_no" style="width:100%;margin-top:10px;background:none;border:none;color:#8A8570;font-size:12.5px">Ahora no, lo pago después</button>
        `
      }

      if(pedidoRecibiendo){
        const items = pedidoRecibiendo.items || []
        let totalPedido = 0, totalRecibido = 0
        items.forEach(it=>{
          const r = pedidoProveedorRecibido[it.id] || { checked:false, received_qty: it.qty }
          totalPedido += Number(it.price)*Number(it.qty)
          totalRecibido += Number(it.price)*Number(r.received_qty)
        })
        const diferencia = totalPedido - totalRecibido
        return `<button id="btn_volver_lista_pedidos" style="background:none;border:none;color:#2F4D2A;font-size:12.5px;font-weight:600;margin-bottom:10px;padding:0">← Volver a la lista</button>
        <h3 style="font-size:14px;color:#2F4D2A">Recepción — Pedido N° ${pedidoRecibiendo.order_number} (${pedidoRecibiendo.supplier_name||''})</h3>
        <p class="muted" style="font-size:12px">Tildá lo que vas revisando y corroborando. Si algo faltó o vino de menos, ajustá la cantidad real.</p>
        ${items.map(it=>{
          const r = pedidoProveedorRecibido[it.id] || { checked:false, received_qty: it.qty }
          return `<div class="row" style="align-items:flex-start;flex-direction:column;gap:6px">
            <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
              <label style="display:flex;align-items:center;gap:8px;font-size:13px"><input type="checkbox" data-recep-check="${it.id}" ${r.checked?'checked':''}/> ${it.name} <small class="muted">(pedidos: ${it.qty} ${it.unitLabel||it.unitType} · $${Number(it.price).toLocaleString('es-AR')} c/u)</small></label>
              <b style="font-size:12.5px">$${(Number(it.price)*Number(r.received_qty)).toLocaleString('es-AR')}</b>
            </div>
            ${!r.checked?`<div style="display:flex;align-items:center;gap:8px;padding-left:24px"><span class="muted" style="font-size:12px">Cantidad realmente recibida:</span><input type="number" min="0" data-recep-qty="${it.id}" value="${r.received_qty}" style="width:60px"/></div>`:''}
            ${(()=>{
              const prod = catalogo.find(p=>p.id===it.product_id || p.name===it.name)
              if(!prod || !prod.controla_vencimiento) return ''
              const sugerida = prod.vida_util_dias ? new Date(Date.now()+prod.vida_util_dias*86400000).toISOString().slice(0,10) : ''
              const valor = r.vencimiento !== undefined ? r.vencimiento : sugerida
              return `<div style="padding-left:24px;width:100%">
                <label style="font-size:12px;color:${NOM.tintaSuave};display:block;margin-bottom:4px">Vencimiento que dice el envase</label>
                <input type="date" data-recep-venc="${it.id}" value="${valor}" style="width:100%"/>
                <p class="muted" style="font-size:11px;margin:4px 0 0">${prod.vida_util_dias?`Según lo aprendido dura ${prod.vida_util_dias} días. Corregilo si el envase dice otra cosa.`:'Primera vez que recibís este producto — cargá la fecha y el sistema la va a recordar.'}</p>
              </div>`
            })()}
          </div>`
        }).join('')}
        <div style="margin-top:12px;background:#F5EFE0;border-radius:10px;padding:10px 12px;font-size:13px">
          <div class="row" style="border:0;padding:2px 0"><span>Total pedido</span><b>$${totalPedido.toLocaleString('es-AR')}</b></div>
          <div class="row" style="border:0;padding:2px 0"><span>Total realmente recibido</span><b>$${totalRecibido.toLocaleString('es-AR')}</b></div>
          ${diferencia>0?`<div class="row" style="border:0;padding:2px 0;color:#B03A2E"><span>Diferencia (faltante)</span><b>$${diferencia.toLocaleString('es-AR')}</b></div>`:''}
        </div>
        ${diferencia>0?`
          <p class="muted" style="font-size:12px;margin-top:10px">Faltó mercadería. ¿Cómo lo resolvés con esta empresa?</p>
          <button id="btn_recep_nota_credito" style="width:100%;margin-top:6px;background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8;border-radius:10px;padding:10px 0;font-size:12.5px;font-weight:600">🧾 Nota de crédito — pago los $${totalPedido.toLocaleString('es-AR')} completos, me deben $${diferencia.toLocaleString('es-AR')} para el próximo pedido</button>
          <button id="btn_recep_descuento" style="width:100%;margin-top:8px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:10px 0;font-size:12.5px;font-weight:600">💸 Pago solo lo recibido — $${totalRecibido.toLocaleString('es-AR')}</button>
        `:`
          <button id="btn_recep_completo" style="width:100%;margin-top:12px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">✅ Confirmar recepción completa</button>
        `}
        `
      }

      return `
    <p class="muted">Armá tu pedido de compra a una empresa, revisá lo que te llega, y llevá la cuenta de lo que le pagaste a cada una.</p>
    <details style="margin-bottom:14px;border:1px solid #E3DCC8;border-radius:10px;padding:0">
      <summary style="cursor:pointer;padding:10px 12px;font-size:12.5px;font-weight:700;color:#2F4D2A">🏢 Datos de mi empresa (aparecen en el PDF del pedido)</summary>
      <div style="padding:0 12px 12px">
        <div class="field"><label>Razón social</label><input id="cfg_company_name" value="${settingsMap.company_legal_name||'NÓMADES'}"/></div>
        <div class="grid two">
          <div class="field"><label>CUIT</label><input id="cfg_company_cuit" value="${settingsMap.company_cuit||''}"/></div>
          <div class="field"><label>Teléfono</label><input id="cfg_company_phone" value="${settingsMap.company_phone||''}"/></div>
        </div>
        <div class="field"><label>Dirección</label><input id="cfg_company_address" value="${settingsMap.company_address||''}"/></div>
        <div class="field"><label>Email</label><input id="cfg_company_email" value="${settingsMap.company_email||''}"/></div>
        <button id="btn_guardar_datos_empresa" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:9px 0;font-size:12.5px;font-weight:600">Guardar datos de mi empresa</button>
      </div>
    </details>
    ${rankingProveedores.length?`<details style="margin-bottom:14px"><summary style="cursor:pointer;font-size:13px;font-weight:700;color:#2F4D2A">🏆 Ranking — a quién le compro más</summary>
      ${rankingProveedores.map((r,i)=>`<div class="row"><span>${i+1}. ${r.supplier_name}<br><small class="muted">${r.cantidad_pedidos} pedido(s)</small></span><b>$${Number(r.total_pagado).toLocaleString('es-AR')}</b></div>`).join('')}
    </details>`:''}
    ${pedidosProveedor.length?`<details style="margin-bottom:14px">
      <summary style="cursor:pointer;font-size:13px;font-weight:700;color:#2F4D2A">📜 Historial completo de pedidos</summary>
      ${pedidosProveedor.map(o=>{
        const saldo = Number(o.total_a_pagar) - Number(o.total_pagado)
        let estadoPago
        if(o.status!=='recibido') estadoPago = `<span class="badge" style="background:#8A8570">🕓 Sin recibir</span>`
        else if(saldo<=0) estadoPago = `<span class="badge">✅ Pagado</span>`
        else if(Number(o.total_pagado)>0) estadoPago = `<span class="badge" style="background:#B85C00">🟡 Parcial: $${Number(o.total_pagado).toLocaleString('es-AR')} de $${Number(o.total_a_pagar).toLocaleString('es-AR')}</span>`
        else estadoPago = `<span class="badge" style="background:#B03A2E">🔴 Sin pagar</span>`
        return `<div class="row" style="flex-direction:column;align-items:stretch;gap:4px">
          <div style="display:flex;justify-content:space-between"><span><b>N° ${o.order_number}</b> · ${o.supplier_name||''}</span><b>$${Number(o.total_a_pagar).toLocaleString('es-AR')}</b></div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <small class="muted">Pedido: ${new Date(o.created_at).toLocaleDateString('es-AR')}${o.received_at?` · Recibido: ${new Date(o.received_at).toLocaleDateString('es-AR')}`:''}</small>
            ${estadoPago}
          </div>
        </div>`
      }).join('')}
    </details>`:''}
    ${pedidosProveedor.filter(o=>o.status==='generado').length?`<div style="margin-bottom:14px">
      <h4 style="font-size:13px;color:#2F4D2A;margin-bottom:6px">📥 Pendientes de recibir</h4>
      ${pedidosProveedor.filter(o=>o.status==='generado').map(o=>`<div class="row"><span>N° ${o.order_number} · ${o.supplier_name||''}<br><small class="muted">${(o.items||[]).length} producto(s) · $${Number(o.total_pedido).toLocaleString('es-AR')}</small></span><span style="display:flex;gap:6px"><button data-editar-pedido="${o.id}" class="btn ghost" style="padding:6px 10px;font-size:11px">✏️ Editar</button><button data-recibir-pedido="${o.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:6px 10px;font-size:11px;font-weight:600">✅ Recibir</button></span></div>`).join('')}
    </div>`:''}
    <details style="margin-bottom:14px;border:1px solid #E3DCC8;border-radius:10px;padding:0">
      <summary style="cursor:pointer;padding:10px 12px;font-size:12.5px;font-weight:700;color:#2F4D2A">💰 Cuenta corriente con proveedores</summary>
      <div style="padding:0 12px 12px">
        ${cuentaProveedores.length ? cuentaProveedores.map(cp=>{
          const abierto = pagoProveedorSeleccionado === cp.supplier_id
          const dias = cp.dias_mas_viejo
          const alerta = dias !== null && dias !== undefined && dias >= 30
          return `<div style="border:1px solid ${alerta?'#E8833A':'#E3DCC8'};border-radius:10px;padding:10px 12px;margin-bottom:8px;background:#FFFFFF">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div style="flex:1">
                <div style="font-weight:700;color:#2F4D2A;font-size:14px">${cp.supplier_name||''}</div>
                <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap">
                  ${dias!==null&&dias!==undefined?pPill(`${dias} día(s) el más viejo`, alerta?'#FAEEDA':'#EAF0DC', alerta?'#854F0B':'#2F4D2A'):''}
                  ${Number(cp.saldo_a_favor)>0?pPill(`A favor $${Number(cp.saldo_a_favor).toLocaleString('es-AR')}`,'#EAF0DC','#2F4D2A'):''}
                </div>
              </div>
              <div style="text-align:right">
                <div style="color:#5F5E5A;font-size:11px">Le debés</div>
                <div style="color:#2F4D2A;font-size:16px;font-weight:700">$${Number(cp.deuda).toLocaleString('es-AR')}</div>
              </div>
            </div>
            <div style="margin-top:8px">
              ${(cp.pedidos||[]).map(pd=>`<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-top:1px solid #F0EADB">
                <span style="color:#5F5E5A">N° ${pd.order_number} · ${pd.dias} día(s)</span>
                <span style="color:#2F4D2A;font-weight:600">$${Number(pd.saldo).toLocaleString('es-AR')}</span>
              </div>`).join('')}
            </div>
            <button data-abrir-pago="${cp.supplier_id}" style="width:100%;margin-top:10px;background:${abierto?'#F5EFE0':'#2F4D2A'};color:${abierto?'#2F4D2A':'#F5EFE0'};border:none;border-radius:9px;padding:9px 0;font-size:12.5px;font-weight:600">${abierto?'Cerrar':'💵 Registrar un pago'}</button>
            ${abierto?(()=>{
              const monto = Number(pagoMontoParcial)||0
              let restante = monto
              const previa = (cp.pedidos||[]).map(pd=>{
                const aplica = Math.min(restante, Number(pd.saldo))
                restante -= aplica
                return { pd, aplica }
              }).filter(x=>x.aplica>0)
              return `<div style="margin-top:10px;border-top:1px solid #E3DCC8;padding-top:10px">
                <div class="field"><label>¿Cuánto le pagás?</label><input id="pago_prov_monto" type="number" min="0" value="${pagoMontoParcial}" placeholder="Ej: 1000000"/></div>
                <div class="field"><label>¿Cómo le pagaste?</label>
                  <div class="grid three">
                    <button type="button" class="btn ${pagoTipo==='transfer'?'primary':'ghost'}" data-pago-metodo="transfer">Transferencia</button>
                    <button type="button" class="btn ${pagoTipo==='cash'?'primary':'ghost'}" data-pago-metodo="cash">Efectivo</button>
                    <button type="button" class="btn ${pagoTipo==='mp'?'primary':'ghost'}" data-pago-metodo="mp">Billetera</button>
                  </div>
                </div>
                <div class="field"><label>Comprobante (opcional)</label><input type="file" id="pago_prov_comprobante" accept="image/*,application/pdf"/></div>
                ${Number(cp.saldo_a_favor)>0?`<label style="display:flex;align-items:center;gap:10px;font-size:13px;margin-bottom:8px"><input type="checkbox" id="pago_prov_credito" style="width:18px;height:18px"/> Usar el saldo a favor de $${Number(cp.saldo_a_favor).toLocaleString('es-AR')}</label>`:''}
                ${monto>0?`<div class="alert info" style="font-size:12px">
                  <b>Se va a imputar así:</b><br>
                  ${previa.map(x=>`N° ${x.pd.order_number}: $${x.aplica.toLocaleString('es-AR')}${x.aplica>=Number(x.pd.saldo)?' (queda saldado)':''}`).join('<br>')}
                  ${restante>0?`<br>Sobran $${restante.toLocaleString('es-AR')} — quedan a favor`:''}
                </div>`:''}
                <div id="err_pago_prov" class="alert danger" style="display:none"></div>
                <button id="btn_guardar_pago_proveedor" style="width:100%;margin-top:8px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:10px 0;font-size:13px;font-weight:600">💾 Guardar pago</button>
              </div>`
            })():''}
          </div>`
        }).join('') : '<p class="muted" style="font-size:12.5px">No le debés nada a ninguna empresa. 🎉</p>'}
        <div style="display:flex;gap:8px;margin-top:10px">
          <button id="btn_ir_historial_pagos" class="btn ghost" style="flex:1;font-size:12px">🧾 Historial de pagos</button>
          <button id="btn_estado_cuenta_prov" class="btn ghost" style="flex:1;font-size:12px">📄 Estado de cuenta</button>
        </div>
      </div>
    </details>
    <div class="field"><label>¿A qué empresa le querés pedir?</label>
      <select id="sel_proveedor_pedido">
        <option value="">Elegí una empresa</option>
        ${suppliers.map(s=>`<option value="${s.id}" ${proveedorPedidoSeleccionado===s.id?'selected':''}>${s.name}</option>`).join('')}
      </select>
    </div>
    ${proveedorPedidoSeleccionado ? (()=>{
      const prov = suppliers.find(s=>s.id===proveedorPedidoSeleccionado)
      const productosProv = catalogo.filter(p=>p.supplier_id===proveedorPedidoSeleccionado)
      if(!productosProv.length) return '<p class="muted">Esta empresa todavía no tiene productos cargados en el catálogo.</p>'
      let totalArmando = 0
      productosProv.forEach(p=>{ const c = pedidoProveedorCantidades[p.id]; if(c) totalArmando += Number(p.price)*Number(c.qty||0) })
      return `
      ${pedidoProveedorEditandoId?`<div class="alert info" style="margin-bottom:10px">✏️ Estás editando el pedido N° ${pedidoProveedorNumero}</div>`:''}
      <div class="field"><input id="buscar_prod_pedido" placeholder="Buscar producto" value="${busquedaProductoPedido}"/></div>
      ${productosProv.filter(p=>!busquedaProductoPedido || (p.name||'').toLowerCase().includes(busquedaProductoPedido.toLowerCase())).map((p,idx)=>{
        const c = pedidoProveedorCantidades[p.id] || { qty:0, unitType:'unidad' }
        const subtotal = Number(p.price)*Number(c.qty||0)
        const cargado = Number(c.qty||0) > 0
        return `<div id="fila_prod_${p.id}" style="background:${NOM.superficie};border:1px solid ${NOM.borde};${cargado?`border-left:3px solid ${NOM.verde};border-radius:0 14px 14px 0`:'border-radius:14px'};padding:11px 12px;margin-bottom:8px;display:flex;gap:11px;align-items:center;${cargado?'':'opacity:0.78'}">
          ${p.photo_url
            ? `<img src="${p.photo_url}" alt="" style="width:46px;height:46px;border-radius:10px;object-fit:cover;flex-shrink:0;background:${NOM.verdeClaro}"/>`
            : `<div style="width:46px;height:46px;border-radius:10px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico('carrito',20,NOM.verde)}</div>`}
          <div style="flex:1;min-width:0">
            <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta};line-height:1.3">${p.name}</div>
            <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:3px">$${Number(p.price).toLocaleString('es-AR')} · ${p.unit_label||'unidad'}${p.units_per_bulto>1?` · bulto ${p.units_per_bulto}`:''}</div>
            ${subtotal>0?`<div style="font-size:11.5px;color:${NOM.verde};font-weight:500;margin-top:3px;font-variant-numeric:tabular-nums">Subtotal $${subtotal.toLocaleString('es-AR')}</div>`:''}
            <div class="salto-barra" data-barra="${p.id}" style="height:3px;background:${NOM.verdeClaro};border-radius:2px;margin-top:5px;overflow:hidden;opacity:0"><div class="salto-fill" style="height:100%;width:100%;background:${NOM.verde};border-radius:2px;transform-origin:right"></div></div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0">
            <input data-cant-pedido="${p.id}" data-orden="${idx}" type="number" inputmode="numeric" enterkeyhint="next" min="0" value="${c.qty||''}" placeholder="0" style="width:90px;text-align:center;padding:10px 0;font-size:16px;font-weight:500"/>
            <select data-unidad-pedido="${p.id}" style="width:90px;font-size:12px;padding:6px 8px">
              <option value="unidad" ${c.unitType==='unidad'?'selected':''}>Unidad</option>
              <option value="bulto" ${c.unitType==='bulto'?'selected':''}>Bulto</option>
              <option value="pallet" ${c.unitType==='pallet'?'selected':''}>Pallet</option>
            </select>
          </div>
        </div>`
      }).join('')}
      <div style="position:sticky;bottom:92px;z-index:5;background:${NOM.verde};border-radius:14px;padding:13px 15px;margin-top:12px;display:flex;justify-content:space-between;align-items:baseline">
        <div>
          <div style="font-size:11px;color:${NOM.verdePastel}">${Object.values(pedidoProveedorCantidades).filter(x=>Number(x?.qty||0)>0).length} producto(s) cargado(s)</div>
          <div style="font-size:23px;font-weight:500;color:#F7F4EC;font-variant-numeric:tabular-nums">$${totalArmando.toLocaleString('es-AR')}</div>
        </div>
      </div>
      <div class="field" style="margin-top:14px"><label>¿Entrega o retiro?</label>
        <div class="grid two">
          <button type="button" id="btn_tipo_entrega" class="btn ${pedidoProveedorTipoEntrega==='entrega'?'primary':'ghost'}">Que me entreguen</button>
          <button type="button" id="btn_tipo_retiro" class="btn ${pedidoProveedorTipoEntrega==='retiro'?'primary':'ghost'}">Lo paso a retirar</button>
        </div>
      </div>
      <button id="btn_generar_pedido_proveedor" style="width:100%;margin-top:14px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">${pedidoProveedorEditandoId?'💾 Guardar cambios':'📋 Generar pedido'}</button>
      ${pedidoProveedorEditandoId?`<button id="btn_cancelar_edicion_pedido" style="width:100%;margin-top:8px;background:#FFFFFF;color:#8A8570;border:1px solid #E3DCC8;border-radius:10px;padding:9px 0;font-size:12.5px">Cancelar edición</button>`:''}
      `
    })() : ''}
    `
    })()}
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('cuenta_mayoristas','💼','Cuenta corriente de mayoristas', cuentaCorrienteMayoristas.filter(c=>c.saldo>0.5).length?String(cuentaCorrienteMayoristas.filter(c=>c.saldo>0.5).length):null)}
    <p class="muted">Lo que cada comercio mayorista te debe por sus entregas ya realizadas — para cuando cobrás al entregar, en cuotas, o le das crédito.</p>
    ${!cuentaCorrienteMayoristas.length?'<p class="muted" style="font-size:12.5px">Todavía no hay entregas facturadas a mayoristas.</p>':`
    ${cuentaCorrienteMayoristas.map(c=>`<div class="row" style="cursor:pointer" data-ver-cuenta-mayorista="${c.customer_id}">
      <span>${c.name}<br><small class="muted">Facturado: $${Number(c.total_facturado).toLocaleString('es-AR')} · Cobrado: $${Number(c.total_cobrado).toLocaleString('es-AR')}</small></span>
      <b style="color:${c.saldo>0.5?'#B03A2E':'#2F4D2A'}">${c.saldo>0.5?'Debe $'+Number(c.saldo).toLocaleString('es-AR'):'✅ Al día'}</b>
    </div>`).join('')}
    ${cuentaCorrienteClienteSeleccionado ? (()=>{
      const cliente = cuentaCorrienteMayoristas.find(c=>c.customer_id===cuentaCorrienteClienteSeleccionado)
      const detalle = cuentaCorrienteDetalleCache[cuentaCorrienteClienteSeleccionado]
      return `<div style="margin-top:12px;border-top:1px solid #F0EBDD;padding-top:12px">
        <h4 style="font-size:13px;color:#2F4D2A;margin-bottom:8px">📜 Entregas de ${cliente?.name||''}</h4>
        ${!detalle?'<p class="muted" style="font-size:12px">Cargando…</p>':
          detalle.map(o=>{
            const saldo = Number(o.monto_adeudado) - Number(o.monto_cobrado)
            return `<div class="row" style="flex-direction:column;align-items:stretch;gap:4px">
              <div style="display:flex;justify-content:space-between"><span>${new Date(o.delivery_date+'T00:00:00').toLocaleDateString('es-AR')}</span><b>$${Number(o.monto_adeudado).toLocaleString('es-AR')}</b></div>
              <div style="display:flex;justify-content:space-between;align-items:center">
                ${saldo>0.5?`<button data-cobrar-pedido="${o.order_id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:6px 10px;font-size:11px;font-weight:600">💰 Cobrar (saldo $${saldo.toLocaleString('es-AR')})</button>`:`<span class="badge">✅ Pagado</span>`}
              </div>
              ${cobroPedidoSeleccionado===o.order_id ? `
                <div class="grid two" style="margin-top:6px">
                  <button type="button" id="btn_cobro_tipo_total" class="btn ${cobroTipo==='total'?'primary':'ghost'}">Total ($${saldo.toLocaleString('es-AR')})</button>
                  <button type="button" id="btn_cobro_tipo_parcial" class="btn ${cobroTipo==='parcial'?'primary':'ghost'}">Parcial</button>
                </div>
                ${cobroTipo==='parcial'?`<div class="field" style="margin-top:6px"><label>Monto cobrado</label><input id="input_cobro_parcial" type="number" min="0" max="${saldo}" value="${cobroMontoParcial}"/></div>`:''}
                <button id="btn_guardar_cobro_mayorista" style="width:100%;margin-top:6px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:8px 0;font-size:12px;font-weight:600">Guardar cobro</button>
              `:''}
            </div>`
          }).join('')
        }
      </div>`
    })() : ''}
    `}
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('recordatorios','⏰','Recordatorios de sugerencias (3 días)', recordatorios.length?String(recordatorios.length):null)}
    <p class="muted">Clientes que reciben su pedido en 3 días — tocá "Avisar" para mandarles un mensaje sugiriéndoles sumar productos del catálogo a esa entrega. Por ahora lo hacés vos a mano; en cuanto tengas Resend y WhatsApp Business conectados, esto se manda solo.</p>
    ${recordatorios.length? recordatorios.map(r=>{
      const telLimpio=(r.phone||'').replace(/\D/g,'')
      const fechaLinda = formatearFecha(r.delivery_date)
      const productosSugeridos = catalogo.filter(p=>p.active).slice(0,3).map(p=>p.name).join(', ')
      const mensaje = encodeURIComponent(`¡Hola ${r.first_name}! 👋 Te escribimos de NÓMADES para contarte que en 3 días, el ${fechaLinda}, te llevamos tu pedido de huevos de campo. Aprovechamos para contarte que también tenemos${productosSugeridos?` ${productosSugeridos}`:' otros productos'} — si querés sumar algo a tu entrega, avisanos y te lo llevamos junto con tus huevos. ¡Gracias por elegirnos! 🥚`)
      return `<div class="row"><span>${r.first_name||''} ${r.last_name||''}<br><small class="muted">Entrega: ${fechaLinda}</small></span>${telLimpio?`<a href="https://wa.me/54${telLimpio}?text=${mensaje}" target="_blank" style="background:#25D366;color:#fff;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;text-decoration:none">💬 Avisar</a>`:''}</span></div>`
    }).join('') : '<p class="muted">No hay entregas programadas para dentro de 3 días.</p>'}
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('agregado_manual','📞','Sumar a un pedido en curso')}
    <p class="muted" style="margin-bottom:12px">Cuando un cliente llama para agregar algo a último momento. Se usa la misma pantalla que para tomar un pedido nuevo.</p>
    <div class="field"><label>Número de WhatsApp donde te llegan estos pedidos</label>
      <div style="display:flex;gap:6px">
        <input id="whatsapp_urgentes_valor" value="${settingsMap.whatsapp_pedidos_urgentes||''}" placeholder="Ej: 3411234567" style="flex:1"/>
        <button id="btn_guardar_whatsapp_urgentes" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:0 16px;font-size:12px;font-weight:600">Guardar</button>
      </div>
    </div>
    <button class="btn primary" id="btn_ir_telefono" style="width:100%">Tomar un pedido por teléfono</button>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('vendedores','🧑‍💼','Vendedores y comisiones')}
    <p class="muted">Configurá la comisión de cada vendedor (por venta o porcentaje), y marcá los pagos mensuales.</p>
    ${rendicionVendedores.length? rendicionVendedores.map(v=>{
      const tipoActual = comisionTipoSeleccionado[v.vendedor_id] || v.commission_type || 'fixed'
      return `<div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:12px;padding:12px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <b style="color:#2F4D2A">${v.full_name||'(sin nombre)'}</b>
        <span class="muted" style="font-size:12px">${v.ventas_totales} venta${v.ventas_totales===1?'':'s'}</span>
      </div>
      <div class="field"><label>Tipo de comisión</label>
        <div class="grid two">
          <button type="button" data-tipo-comision="${v.vendedor_id}" data-valor-tipo="fixed" class="btn ${tipoActual==='fixed'?'primary':'ghost'}">Monto fijo</button>
          <button type="button" data-tipo-comision="${v.vendedor_id}" data-valor-tipo="percent" class="btn ${tipoActual==='percent'?'primary':'ghost'}">Porcentaje</button>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:8px">
        <input id="comision_valor_${v.vendedor_id}" type="number" min="0" value="${v.commission_value||''}" placeholder="${tipoActual==='percent'?'Ej: 10 (%)':'Ej: 1000 ($)'}" style="flex:1"/>
        <button data-guardar-comision="${v.vendedor_id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:0 14px;font-size:12px;font-weight:600">Guardar</button>
      </div>
      <div class="row" style="border-top:1px solid #F0EBDD;padding-top:8px"><span>Pendiente de pago</span><span><b>$${Number(v.pendiente).toLocaleString('es-AR')}</b></span></div>
      ${v.pendiente>0?`<button data-pagar-comisiones="${v.vendedor_id}" style="width:100%;margin-top:8px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:9px 0;font-size:12px;font-weight:600">💾 Marcar como pagado</button>`:''}
    </div>`
    }).join('') : '<p class="muted">Todavía no diste de alta ningún vendedor.</p>'}
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('sugerencias','💡','Sugerencias de productos', sugerencias.filter(s=>s.status==='new').length?String(sugerencias.filter(s=>s.status==='new').length):null)}
    <p class="muted">Lo que los clientes piden que sumemos. Ponele un rubro a cada una (ej: "carne", "lácteos", "limpieza") para armar el ranking de abajo — mismo rubro escrito igual, se agrupa solo.</p>
    ${rankingSugerencias.length? `<div style="background:#EAF0DC;border-radius:10px;padding:10px 12px;margin-bottom:12px">
      <div style="font-size:12px;font-weight:700;color:#2E5C1E;margin-bottom:6px">📊 Ranking de rubros pedidos</div>
      ${rankingSugerencias.map(r=>`<div class="row" style="padding:4px 0"><span style="font-size:12.5px;color:#2E5C1E">${r.categoria}</span><span class="badge">${r.cantidad}</span></div>`).join('')}
    </div>` : ''}
    ${sugerencias.length? sugerencias.map(s=>`<div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:12px;padding:12px;margin-bottom:8px">
      <div style="display:flex;gap:10px">
        ${s.photo_url?`<img src="${s.photo_url}" style="width:52px;height:52px;border-radius:8px;object-fit:cover;flex-shrink:0"/>`:`<div style="width:52px;height:52px;border-radius:8px;background:#F5EFE0;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">💡</div>`}
        <div style="flex:1">
          <p style="margin:0;font-size:13.5px;color:#2F4D2A">${s.description}</p>
          <small class="muted">${s.first_name||''} ${s.last_name||''} · ${new Date(s.created_at).toLocaleDateString('es-AR')}</small>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-top:8px">
        <input id="rubro_${s.id}" value="${s.admin_category||''}" placeholder="Rubro (ej: carne)" style="flex:1"/>
        <button data-guardar-rubro="${s.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:0 14px;font-size:12px;font-weight:600">Guardar</button>
      </div>
    </div>`).join('') : '<p class="muted">Todavía no hay sugerencias de clientes.</p>'}
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('finanzas','💰','Finanzas')}
    <div style="background:#2F4D2A;border-radius:14px;padding:12px;margin-bottom:10px">
      <div style="color:#C9D8B0;font-size:11px;font-weight:700;letter-spacing:0.5px;margin-bottom:8px">RESULTADO — lo que pasó de verdad</div>
      <div class="grid two">
        <div style="background:rgba(255,255,255,0.08);border-radius:10px;padding:9px 11px"><div style="color:#C9D8B0;font-size:11px">Ventas (30 días)</div><div style="color:#F5EFE0;font-size:17px;font-weight:700">$${Number(dash.ventas||0).toLocaleString('es-AR')}</div></div>
        <div style="background:rgba(255,255,255,0.08);border-radius:10px;padding:9px 11px"><div style="color:#C9D8B0;font-size:11px">Gastos (30 días)</div><div style="color:#F5EFE0;font-size:17px;font-weight:700">$${Number(dash.gastos||0).toLocaleString('es-AR')}</div></div>
        <div style="background:rgba(255,255,255,0.08);border-radius:10px;padding:9px 11px"><div style="color:#C9D8B0;font-size:11px">Pérdidas (30 días)</div><div style="color:#F5EFE0;font-size:17px;font-weight:700">$${Number(dash.perdidas||0).toLocaleString('es-AR')}</div></div>
        <div style="background:rgba(255,255,255,0.08);border-radius:10px;padding:9px 11px"><div style="color:#C9D8B0;font-size:11px">Ganancia (30 días)</div><div style="color:${Number(dash.beneficio_neto||0)>=0?'#F5EFE0':'#F0997B'};font-size:17px;font-weight:700">$${Number(dash.beneficio_neto||0).toLocaleString('es-AR')}</div></div>
      </div>
      <div style="color:#C9D8B0;font-size:10.5px;margin-top:8px">La mercadería se cuenta como gasto el día que la recibís, no el día que la pagás.</div>
    </div>

    <div style="background:#EAF0DC;border-radius:14px;padding:12px;margin-bottom:10px">
      <div style="color:#2F4D2A;font-size:11px;font-weight:700;letter-spacing:0.5px;margin-bottom:8px">CAJA — la plata que se movió</div>
      <div class="grid two">
        <div style="background:#FFFFFF;border-radius:10px;padding:9px 11px"><div style="color:#5F5E5A;font-size:11px">Cobraste</div><div style="color:#2F4D2A;font-size:16px;font-weight:700">$${Number(dash.cobrado||0).toLocaleString('es-AR')}</div></div>
        <div style="background:#FFFFFF;border-radius:10px;padding:9px 11px"><div style="color:#5F5E5A;font-size:11px">Pagaste</div><div style="color:#2F4D2A;font-size:16px;font-weight:700">$${(Number(dash.pagado_proveedores||0)+Number(dash.pagado_otros||0)).toLocaleString('es-AR')}</div></div>
      </div>
      <div style="background:#FFFFFF;border-radius:10px;padding:9px 11px;margin-top:8px"><div style="color:#5F5E5A;font-size:11px">Caja acumulada</div><div style="color:${Number(dash.caja||0)>=0?'#2F4D2A':'#B03A2E'};font-size:18px;font-weight:700">$${Number(dash.caja||0).toLocaleString('es-AR')}</div></div>
    </div>

    <div class="grid two" style="margin-bottom:10px">
      <div style="background:#FFFFFF;border:1px solid #E3DCC8;border-radius:12px;padding:10px 12px"><div style="color:#5F5E5A;font-size:11px">💚 Me deben</div><div style="color:#2F4D2A;font-size:16px;font-weight:700">$${Number(dash.me_deben||0).toLocaleString('es-AR')}</div></div>
      <div style="background:#FFFFFF;border:1px solid ${Number(dash.debo||0)>0?'#E8833A':'#E3DCC8'};border-radius:12px;padding:10px 12px"><div style="color:#5F5E5A;font-size:11px">🧾 Debo</div><div style="color:#2F4D2A;font-size:16px;font-weight:700">$${Number(dash.debo||0).toLocaleString('es-AR')}</div>${Number(dash.saldo_a_favor_proveedores||0)>0?`<div style="color:#5F5E5A;font-size:10.5px;margin-top:2px">A favor: $${Number(dash.saldo_a_favor_proveedores).toLocaleString('es-AR')}</div>`:''}</div>
    </div>

    <details style="border:1px solid #E3DCC8;border-radius:12px;margin-bottom:10px">
      <summary style="cursor:pointer;padding:9px 12px;font-size:12.5px;font-weight:700;color:#2F4D2A">📊 De dónde vienen las ventas</summary>
      <div style="padding:0 12px 12px">
        <div style="font-size:11px;color:#5F5E5A;font-weight:700;margin:8px 0 4px">POR LÍNEA</div>
        <div class="row"><span>🥚 Huevos propios</span><span><b>$${Number(dash.ventas_huevos||0).toLocaleString('es-AR')}</b></span></div>
        <div class="row"><span>🛒 Almacén de reventa</span><span><b>$${Number(dash.ventas_almacen||0).toLocaleString('es-AR')}</b></span></div>
        <div class="row"><span>🚚 Envíos cobrados</span><span><b>$${Number(dash.ventas_envio||0).toLocaleString('es-AR')}</b></span></div>
        <div style="font-size:11px;color:#5F5E5A;font-weight:700;margin:12px 0 4px">POR CANAL</div>
        <div class="row"><span>🛍️ Minoristas</span><span><b>$${Number(dash.ventas_minorista||0).toLocaleString('es-AR')}</b></span></div>
        <div class="row"><span>🏭 Mayoristas</span><span><b>$${Number(dash.ventas_mayorista||0).toLocaleString('es-AR')}</b></span></div>
        <div class="row"><span>📞 Telefónicos</span><span><b>$${Number(dash.ventas_telefonico||0).toLocaleString('es-AR')}</b></span></div>
      </div>
    </details>

    <div style="margin-top:20px;background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;overflow:hidden">
      <button type="button" id="btn_toggle_seccion_categorias" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:12px 14px;cursor:pointer;gap:10px;background:${mostrarSeccionCategorias?'#F5EFE0':'transparent'}">
        <span style="width:32px;height:32px;border-radius:9px;background:#EAF0DC;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">🏷️</span>
        <span style="flex:1;font-weight:700;font-size:14.5px;color:#2F4D2A">Categorías</span>
        <span style="font-size:13px;color:#8A8570">${mostrarSeccionCategorias?'▲':'▼'}</span>
      </button>
      <div style="display:${mostrarSeccionCategorias?'block':'none'};padding:10px 14px 14px">
      <div style="background:#F5EFE0;border-radius:14px;overflow:hidden;margin-bottom:12px">
        <button type="button" id="btn_toggle_form_categoria" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:12px 14px;cursor:pointer;gap:10px;background:${mostrarFormNuevaCategoria?'#EAF0DC':'transparent'}">
          <span style="width:32px;height:32px;border-radius:9px;background:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">➕</span>
          <span style="flex:1;font-weight:700;font-size:14.5px;color:#2F4D2A">Agregar categoría</span>
          <span style="font-size:13px;color:#8A8570">${mostrarFormNuevaCategoria?'▲':'▼'}</span>
        </button>
        <div style="display:${mostrarFormNuevaCategoria?'block':'none'};padding:10px 14px 14px">
          <div class="grid two">
            <div class="field"><label>Nombre</label><input id="cat_new_name" placeholder="Ej: Combustible"/></div>
            <div class="field"><label>Tipo</label><select id="cat_new_type"><option value="fixed">Gasto fijo</option><option value="variable">Gasto variable</option><option value="income">Ingreso</option></select></div>
          </div>
          <button id="btn_crear_categoria" style="width:100%;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">💾 Guardar categoría</button>
        </div>
      </div>
      <div>${categorias.length? categorias.map(c=>pCard(`
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
          <div>
            <div style="font-weight:600;color:#2F4D2A">${c.name}${!c.active?' <span style="color:#8A8570;font-weight:400">(inactiva)</span>':''}</div>
            <div style="margin-top:3px">${pPill(TIPO_CAT_LABEL[c.type]||c.type)}</div>
          </div>
          <button data-cat-toggle="${c.id}" data-cat-active="${c.active}" style="background:${c.active?'#FFFFFF':'#2F4D2A'};color:${c.active?'#B85C00':'#F5EFE0'};border:1px solid ${c.active?'#E3DCC8':'#2F4D2A'};border-radius:10px;padding:7px 14px;font-size:12px;font-weight:600;white-space:nowrap">${c.active?'Desactivar':'Activar'}</button>
        </div>
      `, 'margin-bottom:8px')).join('') : '<p class="muted">Todavía no hay categorías.</p>'}</div>
      </div>
    </div>

    <div style="margin-top:20px;background:#FFFFFF;border:1px solid #E3DCC8;border-radius:14px;overflow:hidden">
      <button type="button" id="btn_toggle_seccion_movimiento" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:12px 14px;cursor:pointer;gap:10px;background:${mostrarSeccionMovimiento?'#F5EFE0':'transparent'}">
        <span style="width:32px;height:32px;border-radius:9px;background:#EAF0DC;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">📝</span>
        <span style="flex:1;font-weight:700;font-size:14.5px;color:#2F4D2A">Registrar movimiento</span>
        <span style="font-size:13px;color:#8A8570">${mostrarSeccionMovimiento?'▲':'▼'}</span>
      </button>
      <div style="display:${mostrarSeccionMovimiento?'block':'none'};padding:10px 14px 14px">
      <div class="field"><label>Tipo</label>
        <div style="display:flex;gap:8px;background:#F5EFE0;border-radius:12px;padding:4px">
          <button type="button" id="btn_tipo_expense" data-fin-tipo="expense" style="flex:1;border:none;background:transparent;border-radius:9px;padding:9px 0;font-size:13px;font-weight:600;color:#2F4D2A">Gasto</button>
          <button type="button" id="btn_tipo_income" data-fin-tipo="income" style="flex:1;border:none;background:transparent;border-radius:9px;padding:9px 0;font-size:13px;font-weight:600;color:#2F4D2A">Ingreso</button>
        </div>
      </div>
      <div class="field"><label>Categoría</label><select id="fin_categoria"><option value="">Elegí el tipo primero</option></select></div>
      <div class="field"><label>¿De qué negocio es?</label>
        <div class="grid three">
          <button type="button" class="btn primary" data-fin-canal="compartido">Compartido</button>
          <button type="button" class="btn ghost" data-fin-canal="minorista">Minorista</button>
          <button type="button" class="btn ghost" data-fin-canal="mayorista">Mayorista</button>
        </div>
        <p class="muted" style="font-size:11.5px;margin:6px 0 0">Compartido se reparte entre los dos según cuánto vendió cada uno.</p>
      </div>
      <div class="grid two">
        <div class="field"><label>Monto</label><input id="fin_amount" type="number" min="0"/></div>
        <div class="field"><label>Fecha</label><input id="fin_date" type="date" value="${new Date().toISOString().slice(0,10)}"/></div>
      </div>
      <div class="field"><label>Descripción</label><input id="fin_desc" placeholder="Ej: nafta de la semana"/></div>
      <div class="field"><label>Comprobante (opcional)</label><input type="file" id="fin_receipt" accept="image/*,application/pdf"/></div>
      <div id="err_finanzas" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_guardar_movimiento" style="width:100%">Guardar movimiento</button>
      </div>
    </div>

    <div style="margin-top:20px"><h3 style="font-size:15px;color:#2F4D2A">Últimos movimientos</h3>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button id="btn_exportar_finanzas_csv" class="btn ghost" style="flex:1">📊 Excel</button>
        <button id="btn_reporte_ventas_pdf" class="btn ghost" style="flex:1">📄 Reporte</button>
      </div>
      ${movimientosFinanzas.length? movimientosFinanzas.map(m=>{
        const cat = categoriaMap[m.category_id]
        const fecha = new Date(m.entry_date+'T00:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'})
        return pCard(`
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            <div>
              <div style="font-weight:600;color:#2F4D2A">${m.type==='expense'?'🔴':'🟢'} ${cat?cat.name:'(sin categoría)'}</div>
              <div style="font-size:12px;color:#8A8570;margin-top:2px">${fecha}${m.description?' · '+m.description:''}</div>
              ${m.attachment_url?`<a href="${m.attachment_url}" target="_blank" style="font-size:12px">Ver comprobante</a>`:''}
            </div>
            <b style="color:#2F4D2A;white-space:nowrap">$${Number(m.amount||0).toLocaleString('es-AR')}</b>
          </div>
        `, 'margin-bottom:8px')
      }).join('') : '<p class="muted">Todavía no hay movimientos cargados.</p>'}
    </div>
  </div></div>`)

  document.querySelectorAll('[data-acc]').forEach(b=>b.onclick=()=>{
    const abriendo = adminOpenSection!==b.dataset.acc
    const body = b.nextElementSibling
    const arrow = b.querySelector('span:last-child')
    if(body && body.classList.contains('acc-body')){
      if(abriendo){
        body.style.padding = '4px 16px 16px 16px'
        body.style.maxHeight = '6000px'
        if(arrow) arrow.textContent = '▲'
        b.style.background = '#F5EFE0'
      } else {
        body.style.maxHeight = '0'
        body.style.padding = '0 16px'
        if(arrow) arrow.textContent = '▼'
        b.style.background = 'transparent'
      }
    }
    adminOpenSection = abriendo ? b.dataset.acc : null
    setTimeout(render, 260)
  })
  document.querySelectorAll('[data-stat]').forEach(b=>b.onclick=()=>{
    adminDetalleTipo = b.dataset.stat
    current = 'admin-detalle'
    render()
  })
  const filtroFecha = document.querySelector('#filtro_fecha_asignar')
  if(filtroFecha) filtroFecha.onchange = (e)=>{ adminAsignarFecha = e.target.value; render() }
  const btnLimpiarFecha = document.querySelector('#btn_limpiar_fecha_asignar')
  if(btnLimpiarFecha) btnLimpiarFecha.onclick = ()=>{ adminAsignarFecha = ''; render() }
  document.querySelectorAll('[data-filtro-tipo-asignar]').forEach(b=>b.onclick=()=>{ adminAsignarTipo = b.dataset.filtroTipoAsignar; render() })
  if(AS('mapa')) initAdminMapa()
  document.querySelectorAll('[data-vehiculo-asignar]').forEach(sel=>sel.onchange=async()=>{
    const { error } = await supabase.from('vehicles').update({ assigned_to: sel.value || null }).eq('id', sel.dataset.vehiculoAsignar)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-marcar-service]').forEach(b=>b.onclick=async()=>{
    if(!(await mostrarConfirmacion('¿Marcar el service como realizado hoy? Se reinicia el contador de kilómetros.')))return
    const { data, error } = await supabase.rpc('admin_marcar_service', { p_vehicle_id: b.dataset.marcarService })
    if(error || !data?.ok){ mostrarAlerta('No se pudo actualizar.'); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-pagar-service]').forEach(b=>b.onclick=async()=>{
    const { data, error } = await supabase.rpc('admin_marcar_service_pagado', { p_service_id: b.dataset.pagarService })
    if(error || !data?.ok){ mostrarAlerta('No se pudo actualizar.'); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-ver-stats]').forEach(b=>b.onclick=()=>{
    const v = vehiculos.find(x=>x.id===b.dataset.verStats)
    verEstadisticasVehiculo(v)
  })
  document.querySelectorAll('[data-ver-historial]').forEach(b=>b.onclick=()=>{
    const v = vehiculos.find(x=>x.id===b.dataset.verHistorial)
    verHistorialVehiculo(v)
  })
  document.querySelectorAll('[data-editar-vehiculo]').forEach(b=>b.onclick=()=>{
    vehiculoEditando = vehiculoEditando===b.dataset.editarVehiculo ? null : b.dataset.editarVehiculo
    render()
  })
  document.querySelectorAll('[data-eliminar-vehiculo]').forEach(b=>b.onclick=async()=>{
    if(!(await mostrarConfirmacion('¿Eliminar este vehículo? También se borra su historial de cargas de combustible. Esta acción no se puede deshacer.')))return
    const { error } = await supabase.from('vehicles').delete().eq('id', b.dataset.eliminarVehiculo)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-guardar-vehiculo]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.guardarVehiculo
    const box = document.querySelector(`#err_editar_veh_${id}`)
    const patente = document.querySelector(`#ed_veh_patente_${id}`).value.trim()
    if(!patente){ box.textContent='La patente no puede quedar vacía.'; box.style.display='block'; return }
    let photo_url = undefined
    const fotoFile = document.querySelector(`#ed_veh_foto_${id}`).files[0]
    if(fotoFile){
      const path = `${Date.now()}_${fotoFile.name}`
      const { error: upErr } = await supabase.storage.from('vehicle-photos').upload(path, fotoFile)
      if(upErr){ box.textContent='No se pudo subir la foto: '+upErr.message; box.style.display='block'; return }
      const { data: pub } = supabase.storage.from('vehicle-photos').getPublicUrl(path)
      photo_url = pub.publicUrl
    }
    const payload = {
      brand: document.querySelector(`#ed_veh_marca_${id}`).value.trim() || null,
      model: document.querySelector(`#ed_veh_modelo_${id}`).value.trim() || null,
      color: document.querySelector(`#ed_veh_color_${id}`).value.trim() || null,
      plate: patente,
      current_km: Number(document.querySelector(`#ed_veh_km_${id}`).value) || 0,
      service_interval_km: Number(document.querySelector(`#ed_veh_intervalo_${id}`).value) || 3000,
      vtv_expiry: document.querySelector(`#ed_veh_vtv_${id}`).value || null,
      insurance_expiry: document.querySelector(`#ed_veh_seguro_${id}`).value || null,
      mechanic_name: document.querySelector(`#ed_mec_nombre_${id}`).value.trim() || null,
      mechanic_phone: document.querySelector(`#ed_mec_telefono_${id}`).value.trim() || null,
      mechanic_appointment_phone: document.querySelector(`#ed_mec_turnos_${id}`).value.trim() || null,
      mechanic_email: document.querySelector(`#ed_mec_mail_${id}`).value.trim() || null,
      mechanic_tax_id: document.querySelector(`#ed_mec_cuit_${id}`).value.trim() || null,
      mechanic_hours: document.querySelector(`#ed_mec_horario_${id}`).value.trim() || null,
      mechanic_address: document.querySelector(`#ed_mec_direccion_${id}`).value.trim() || null
    }
    if(photo_url !== undefined) payload.photo_url = photo_url
    const { error } = await supabase.from('vehicles').update(payload).eq('id', id)
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    vehiculoEditando = null
    adminData = null; render()
  })
  document.querySelector('#btn_crear_vehiculo').onclick = async ()=>{
    const box = document.querySelector('#err_vehiculo')
    const patente = document.querySelector('#veh_new_patente').value.trim()
    if(!patente){ box.textContent='Ingresá la patente.'; box.style.display='block'; return }
    let photo_url = null
    const fotoInput = document.querySelector('#veh_new_foto')
    const fotoFile = fotoInput.files[0]
    if(fotoFile){
      const path = `${Date.now()}_${fotoFile.name}`
      const { error: upErr } = await supabase.storage.from('vehicle-photos').upload(path, fotoFile)
      if(upErr){ box.textContent='No se pudo subir la foto: '+upErr.message; box.style.display='block'; return }
      const { data: pub } = supabase.storage.from('vehicle-photos').getPublicUrl(path)
      photo_url = pub.publicUrl
    }
    const payload = {
      type: document.querySelector('#veh_new_tipo').value,
      plate: patente,
      brand: document.querySelector('#veh_new_marca').value.trim() || null,
      model: document.querySelector('#veh_new_modelo').value.trim() || null,
      color: document.querySelector('#veh_new_color').value.trim() || null,
      photo_url,
      current_km: Number(document.querySelector('#veh_new_km').value) || 0,
      last_service_km: Number(document.querySelector('#veh_new_km').value) || 0,
      service_interval_km: Number(document.querySelector('#veh_new_intervalo').value) || 3000,
      vtv_expiry: document.querySelector('#veh_new_vtv').value || null,
      insurance_expiry: document.querySelector('#veh_new_seguro').value || null,
      assigned_to: document.querySelector('#veh_new_asignado').value || null
    }
    const { error } = await supabase.from('vehicles').insert(payload)
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    mostrarFormNuevoVehiculo = false
    adminData = null; render()
  }
  const btnToggleFormVeh = document.querySelector('#btn_toggle_form_vehiculo')
  if(btnToggleFormVeh) btnToggleFormVeh.onclick = ()=>{ mostrarFormNuevoVehiculo = !mostrarFormNuevoVehiculo; render() }
  document.querySelectorAll('[data-sub-acc]').forEach(b=>b.onclick=()=>{
    cobrosSubSeccion = cobrosSubSeccion===b.dataset.subAcc ? null : b.dataset.subAcc
    render()
  })
  document.querySelectorAll('[data-guardar-carnet]').forEach(b=>b.onclick=async()=>{
    const val = document.querySelector(`#carnet_${b.dataset.guardarCarnet}`).value
    const { error } = await supabase.from('staff_roles').update({ license_expiry: val || null }).eq('user_id', b.dataset.guardarCarnet)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; mostrarAlerta('Guardado ✅')
  })
  // Control de salud de los accesos: detecta usuarios que el servidor de autenticación
  // no puede leer. Si pasa, el login falla con un error que parece "código incorrecto".
  ;(async ()=>{
    const caja = document.querySelector('#salud_accesos')
    if(!caja) return
    const { data: salud } = await supabase.rpc('revisar_salud_auth')
    if(!salud) return
    const problemas = []
    if(salud.rotos > 0) problemas.push(`${salud.rotos} acceso(s) no van a poder entrar (${(salud.emails_rotos||[]).map(e=>String(e).replace('staff-','').replace('@nomades.internal','').toUpperCase()).join(', ')})`)
    if(salud.sin_identidad > 0) problemas.push(`${salud.sin_identidad} sin identidad registrada`)
    if(salud.sin_rol > 0) problemas.push(`${salud.sin_rol} sin ningún rol asignado`)
    caja.innerHTML = problemas.length
      ? `<div class="alert danger" style="font-size:12.5px"><b>⚠️ Revisá estos accesos</b><br>${problemas.join('<br>')}<br><small>Generales de nuevo con "Nuevo código" para arreglarlos.</small></div>`
      : `<div style="font-size:12px;color:${NOM.tintaSuave}">✅ Los ${salud.total} accesos están sanos</div>`
  })()

  ;(async ()=>{
    const caja = document.querySelector('#estado_prueba')
    if(!caja) return
    const pintar = async ()=>{
      const { count } = await supabase.from('customers').select('id', { count:'exact', head:true }).eq('es_prueba', true)
      const hay = (count||0) > 0
      caja.innerHTML = hay
        ? `<div class="alert warning" style="font-size:12.5px"><b>Hay ${count} clientes de prueba cargados</b><br>Sus pedidos aparecen en la ruta y en las estadísticas. Borralos cuando termines.</div>
           <button class="btn ghost" id="btn_borrar_prueba" style="width:100%">🗑️ Borrar los datos de prueba</button>`
        : `<button class="btn ghost" id="btn_cargar_prueba" style="width:100%">➕ Cargar 6 clientes de prueba</button>`
      const bc = document.querySelector('#btn_cargar_prueba')
      if(bc) bc.onclick = async ()=>{
        bc.disabled = true; bc.textContent = 'Cargando…'
        const { data, error } = await supabase.rpc('cargar_datos_prueba')
        if(error || !data?.ok){ mostrarAlerta('No se pudo cargar: '+(data?.error||error?.message||'')); await pintar(); return }
        mostrarAlerta(`Listos ${data.clientes} clientes de prueba, con entregas para hoy.\n\nEntrá a Repartidor para ver la ruta.`)
        adminData = null; render()
      }
      const bb = document.querySelector('#btn_borrar_prueba')
      if(bb) bb.onclick = async ()=>{
        if(!confirm('¿Borrar todos los clientes de prueba, con sus pedidos y cobros? Tus clientes reales no se tocan.')) return
        bb.disabled = true; bb.textContent = 'Borrando…'
        const { data, error } = await supabase.rpc('borrar_datos_prueba')
        if(error || !data?.ok){ mostrarAlerta('No se pudo borrar: '+(data?.error||error?.message||'')); await pintar(); return }
        mostrarAlerta(`Borrados ${data.borrados||0} clientes de prueba con todo lo que colgaba de ellos.`)
        adminData = null; render()
      }
    }
    await pintar()
  })()

  document.querySelector('#btn_crear_staff').onclick = async ()=>{
    const full_name = document.querySelector('#staff_new_name').value.trim()
    const rolesElegidos = Array.from(document.querySelectorAll('[data-nuevo-rol]')).filter(x=>x.checked).map(x=>x.dataset.nuevoRol)
    const custom_code = document.querySelector('#staff_new_code').value.trim()
    const box = document.querySelector('#codigo_generado')
    if(!rolesElegidos.length){ box.innerHTML = '<div class="alert danger">Marcá al menos un rol.</div>'; return }
    const role = rolesElegidos.includes('admin') ? 'admin' : rolesElegidos[0]
    box.innerHTML = '<p class="muted">Generando…</p>'
    const { data, error } = await supabase.functions.invoke('manage-staff', { body: { action:'create', full_name, role, custom_code } })
    if(error){ box.innerHTML = `<div class="alert danger">No se pudo generar: ${error.message}</div>`; return }
    if(data?.user_id && rolesElegidos.length > 1){
      await supabase.rpc('admin_set_staff_roles', { p_user_id: data.user_id, p_roles: rolesElegidos })
    }
    box.innerHTML = `<div class="alert info"><b>✅ Código generado para ${full_name||'este usuario'}:</b><br><span style="font-size:20px;font-weight:bold;letter-spacing:2px">${data.code}</span><br><small>Copialo ahora — no se vuelve a mostrar. Pasáselo a la persona para que entre por "Acceso del equipo".</small></div>`
    adminData = null; render()
  }
  document.querySelectorAll('[data-area]').forEach(b=>b.onclick=()=>{
    const area = AREAS.find(a=>a.id===b.dataset.area)
    if(area && area.directo){ current = area.directo; render(); return }
    adminAreaAbierta = b.dataset.area; adminOpenSection = null; window.scrollTo(0,0); render()
  })
  document.querySelectorAll('[data-resolver-colgada]').forEach(b=>b.onclick=()=>openDelivery(b.dataset.resolverColgada))

  // ── Avisar la ruta ────────────────────────────────────────
  ;(async ()=>{
    const caja = document.querySelector('#avisar_ruta_box')
    if(!caja) return
    const pintarAvisos = async ()=>{
      const { data } = await supabase.rpc('admin_ruta_para_avisar', { p_fecha: avisoRutaFecha })
      if(!data?.ok){ caja.innerHTML = '<p class="muted" style="font-size:12px">No se pudo cargar la ruta.</p>'; return }
      const cfgAv = data.cfg || {}
      const lista = data.entregas || []
      const sinAvisar = lista.filter(e=>e.driver_id && !e.aviso_enviado_at)
      const cambiados = lista.filter(e=>e.cambio_despues_del_aviso)
      const sinDriver = lista.filter(e=>!e.driver_id)

      const planTexto = e => (e.plan_breakdown && e.plan_breakdown.length)
        ? e.plan_breakdown.map(b=>`${b.qty} maple${b.qty>1?'s':''} de ${b.size}`).join(' + ')
        : `${e.egg_quantity||0} huevos`
      const montoFinal = e => {
        const base = Number(e.precio||0)
        return esPagoConDescuento(e.payment_method)
          ? Math.max(0, base - calcularDescuentoBilletera(base, cfgAv.wallet_discount_type, cfgAv.wallet_discount_value))
          : base
      }
      const comoPaga = e => e.payment_method==='transfer' ? 'por transferencia' : e.payment_method==='mp' ? `por ${cfgAv.mp_wallet_name||'billetera'}` : 'en efectivo'
      // El alias va en el mensaje: es un recordatorio, no información nueva.
      const datosPago = e => {
        if(e.payment_method==='transfer') return cfgAv.transfer_alias || cfgAv.transfer_cbu
          ? `\n\nPara transferir:\n${cfgAv.transfer_bank_name?cfgAv.transfer_bank_name+'\n':''}Alias: ${cfgAv.transfer_alias||'-'}\nCBU: ${cfgAv.transfer_cbu||'-'}${cfgAv.transfer_holder_name?`\nTitular: ${cfgAv.transfer_holder_name}`:''}` : ''
        if(e.payment_method==='mp') return cfgAv.mp_alias || cfgAv.mp_cbu
          ? `\n\nPara transferir a ${cfgAv.mp_wallet_name||'la billetera'}:\nAlias: ${cfgAv.mp_alias||'-'}\nCBU: ${cfgAv.mp_cbu||'-'}${cfgAv.mp_holder_name?`\nTitular: ${cfgAv.mp_holder_name}`:''}` : ''
        return ''
      }
      const mensajeDe = e => `Hola ${e.first_name||e.nombre}! 👋 Te escribimos de NÓMADES.\n\nEl ${formatearFecha(data.fecha)} te llevamos tu pedido: ${planTexto(e)}.\n\nTu repartidor va a ser ${e.driver_nombre||'nuestro repartidor'} 🛵 Podés ver su foto, la del vehículo y la patente en tu cuenta: granjanomades.ar\n\nA pagar: $${montoFinal(e).toLocaleString('es-AR')} ${comoPaga(e)}.${datosPago(e)}\n\n¡Gracias por elegirnos!`
      const mensajeCambio = e => `Hola ${e.first_name||e.nombre}! Cambio de último momento: el ${formatearFecha(data.fecha)} te lleva el pedido ${e.driver_nombre||'otro repartidor'} en vez de ${e.aviso_driver_nombre||'quien te dijimos'}. ¡Perdón por el cambio!`

      caja.innerHTML = `
        <div class="field"><label>Fecha de la ruta</label><input type="date" id="aviso_ruta_fecha" value="${data.fecha}"/></div>
        ${cambiados.length ? cambiados.map(e=>`<div style="background:${NOM.ambarClaro};border:1px solid #EBCFA0;border-radius:11px;padding:11px 13px;margin-bottom:9px">
          <div style="font-size:12.5px;font-weight:600;color:#854F0B">⚠️ Cambiaste un repartidor ya avisado</div>
          <div style="font-size:12px;color:#BA7517;margin-top:3px">A ${e.first_name||e.nombre} le dijimos que iba <b>${e.aviso_driver_nombre||'(sin nombre)'}</b>. Ahora figura <b>${e.driver_nombre||'sin asignar'}</b>.</div>
          <div style="display:flex;gap:7px;margin-top:9px;flex-wrap:wrap">
            <a href="https://wa.me/54${(e.phone||'').replace(/\D/g,'')}?text=${encodeURIComponent(mensajeCambio(e))}" target="_blank" data-aviso-enviado="${e.order_id}" style="background:${NOM.verde};color:#F7F4EC;border-radius:9px;padding:8px 13px;font-size:12px;font-weight:600;text-decoration:none">Mandar la corrección</a>
            <button data-aviso-ignorar="${e.order_id}" style="background:#FFFFFF;border:1px solid ${NOM.borde};border-radius:9px;padding:8px 13px;font-size:12px">Dejarlo así</button>
          </div>
        </div>`).join('') : ''}
        ${lista.length ? lista.map(e=>{
          const estado = !e.driver_id ? `<span style="font-size:11px;color:${NOM.rojo}">Sin repartidor</span>`
            : e.aviso_enviado_at ? `<span style="font-size:11px;background:#E7F3DC;color:#3A6B1E;padding:3px 9px;border-radius:999px">✓ Avisado</span>`
            : `<span style="font-size:11px;background:#FFFFFF;border:1px solid ${NOM.borde};color:${NOM.tintaSuave};padding:3px 9px;border-radius:999px">Sin avisar</span>`
          return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid ${NOM.borde};${!e.driver_id?'opacity:0.55':''}">
            <div style="flex:1;min-width:0">
              <div style="font-size:13.5px">${e.nombre}</div>
              <div style="font-size:11.5px;color:${e.driver_id?NOM.tintaSuave:NOM.rojo};margin-top:1px">${e.driver_id?`${e.driver_nombre||'(sin nombre)'} · ${planTexto(e)} · $${montoFinal(e).toLocaleString('es-AR')} ${comoPaga(e)}`:'Sin repartidor asignado'}</div>
            </div>
            <div style="flex-shrink:0">${estado}</div>
          </div>`
        }).join('') : '<p class="muted" style="font-size:12px">No hay entregas para esa fecha.</p>'}
        ${sinAvisar.length ? `<div id="avisar_uno_a_uno" style="margin-top:11px">
          <a href="https://wa.me/54${(sinAvisar[0].phone||'').replace(/\D/g,'')}?text=${encodeURIComponent(mensajeDe(sinAvisar[0]))}" target="_blank" data-aviso-enviado="${sinAvisar[0].order_id}" style="display:block;text-align:center;background:${NOM.verde};color:#F7F4EC;border-radius:11px;padding:11px 0;font-size:13px;font-weight:600;text-decoration:none">Avisar a ${sinAvisar[0].first_name||sinAvisar[0].nombre}${sinAvisar.length>1?` (falta${sinAvisar.length>1?'n':''} ${sinAvisar.length})`:''}</a>
          <p class="muted" style="font-size:11px;margin:7px 0 0;text-align:center">Abre WhatsApp con el mensaje escrito. Al volver, aparece el siguiente.</p>
        </div>` : `<p class="muted" style="font-size:12px;margin-top:10px">${sinDriver.length?`Faltan asignar ${sinDriver.length} pedido(s) antes de poder avisar.`:'Todos avisados 🎉'}</p>`}`

      const inputFecha = document.querySelector('#aviso_ruta_fecha')
      if(inputFecha) inputFecha.onchange = async (ev)=>{ avisoRutaFecha = ev.target.value; await pintarAvisos() }
      caja.querySelectorAll('[data-aviso-enviado]').forEach(a=>a.onclick=async()=>{
        await supabase.rpc('marcar_aviso_repartidor', { p_order_id: a.dataset.avisoEnviado })
        setTimeout(pintarAvisos, 800)
      })
      caja.querySelectorAll('[data-aviso-ignorar]').forEach(b=>b.onclick=async()=>{
        await supabase.rpc('marcar_aviso_repartidor', { p_order_id: b.dataset.avisoIgnorar })
        await pintarAvisos()
      })
    }
    await pintarAvisos()
  })()
  const btnManana = document.querySelector('#btn_ver_manana')
  if(btnManana) btnManana.onclick = ()=>{ pedidosFechaFiltro = 'manana'; current='pedidos'; render() }
  const btnVolverAreas = document.querySelector('#btn_volver_areas')
  if(btnVolverAreas) btnVolverAreas.onclick = ()=>{ adminAreaAbierta = null; adminOpenSection = null; window.scrollTo(0,0); render() }
  const btnIrAuditoria = document.querySelector('#btn_ir_auditoria')
  if(btnIrAuditoria) btnIrAuditoria.onclick = ()=>{ current='auditoria'; render() }
  const btnGuardarEmpresa = document.querySelector('#btn_guardar_empresa')
  if(btnGuardarEmpresa) btnGuardarEmpresa.onclick = async ()=>{
    const valores = {
      empresa_nombre: document.querySelector('#emp_nombre').value.trim(),
      empresa_direccion: document.querySelector('#emp_direccion').value.trim(),
      empresa_telefono: document.querySelector('#emp_telefono').value.trim(),
      empresa_email: document.querySelector('#emp_email').value.trim(),
      empresa_cuit: document.querySelector('#emp_cuit').value.trim()
    }
    for(const [key, value] of Object.entries(valores)){
      await supabase.from('farm_settings').upsert({ key, value })
    }
    adminData = null
    mostrarAlerta('✅ Datos guardados. Van a aparecer en los documentos.')
  }
  document.querySelectorAll('[data-editar-roles]').forEach(b=>b.onclick=()=>{ staffEditandoRoles = b.dataset.editarRoles; render() })
  document.querySelectorAll('[data-cancelar-roles]').forEach(b=>b.onclick=()=>{ staffEditandoRoles = null; render() })
  document.querySelectorAll('[data-guardar-roles]').forEach(b=>b.onclick=async()=>{
    const roles = Array.from(document.querySelectorAll('[data-editar-rol]')).filter(x=>x.checked).map(x=>x.dataset.editarRol)
    if(!roles.length){ mostrarAlerta('Marcá al menos un rol.'); return }
    const { data, error } = await supabase.rpc('admin_set_staff_roles', { p_user_id: b.dataset.guardarRoles, p_roles: roles })
    if(error || !data?.ok){ mostrarAlerta('No se pudo guardar: '+(data?.error||error?.message||'')); return }
    staffEditandoRoles = null; adminData = null; mostrarAlerta('Roles actualizados ✅'); render()
  })
  document.querySelectorAll('[data-revoke]').forEach(b=>b.onclick=async()=>{
    if(!(await mostrarConfirmacion('¿Revocar el acceso de esta persona? No va a poder entrar más con su código actual.')))return
    const { error } = await supabase.functions.invoke('manage-staff', { body: { action:'revoke', user_id:b.dataset.revoke } })
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-reset]').forEach(b=>b.onclick=async()=>{
    const custom_code = prompt('Escribí el nuevo código para esta persona (o dejalo vacío para generar uno automático):') || ''
    const { data, error } = await supabase.functions.invoke('manage-staff', { body: { action:'reset', user_id:b.dataset.reset, custom_code } })
    if(error){ mostrarAlerta('Error: '+error.message); return }
    mostrarAlerta('Nuevo código: '+data.code+'\n\nCopialo ahora, no se vuelve a mostrar.')
  })
  document.querySelectorAll('#modo_asig_group [data-modo]').forEach(b=>b.onclick=async()=>{
    const { data, error } = await supabase.rpc('admin_set_assignment_mode', { p_mode: b.dataset.modo })
    if(error || !data?.ok){ mostrarAlerta('No se pudo cambiar el modo: '+(error?.message||data?.error||'')); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-zona-driver]').forEach(sel=>sel.onchange=async()=>{
    const zona = sel.dataset.zonaDriver
    const driver = sel.value || null
    const { error } = await supabase.from('zone_drivers').update({ driver_user_id: driver, updated_at: new Date().toISOString() }).eq('zone', zona)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null
  })
  document.querySelectorAll('[data-barrio-driver]').forEach(sel=>sel.onchange=async()=>{
    const barrio = sel.dataset.barrioDriver
    const driver = sel.value || null
    if(driver){
      const { error } = await supabase.from('neighborhood_drivers').upsert({ neighborhood: barrio, driver_user_id: driver, updated_at: new Date().toISOString() })
      if(error){ mostrarAlerta('Error: '+error.message); return }
    } else {
      const { error } = await supabase.from('neighborhood_drivers').delete().eq('neighborhood', barrio)
      if(error){ mostrarAlerta('Error: '+error.message); return }
    }
    adminData = null
  })
  document.querySelector('#btn_recalcular_asignaciones').onclick = async ()=>{
    const { data, error } = await supabase.rpc('recalc_all_order_drivers', {})
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null
    mostrarAlerta(`✅ Se recalcularon ${data} pedido(s).`); render()
  }
  document.querySelectorAll('[data-pedido-driver]').forEach(sel=>sel.onchange=async()=>{
    const { data, error } = await supabase.rpc('admin_assign_driver', { p_order_id: sel.dataset.pedidoDriver, p_driver_user_id: sel.value || null })
    if(error || !data?.ok){ mostrarAlerta('No se pudo asignar: '+(error?.message||data?.error||'')); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-destrabar]').forEach(b=>b.onclick=async()=>{
    const { data, error } = await supabase.rpc('admin_unlock_driver', { p_order_id: b.dataset.destrabar })
    if(error || !data?.ok){ mostrarAlerta('No se pudo destrabar: '+(error?.message||data?.error||'')); return }
    adminData = null; render()
  })
  document.querySelector('#btn_crear_producto').onclick = async ()=>{
    const name = document.querySelector('#prod_new_name').value.trim()
    const unit_label = document.querySelector('#prod_new_unit').value.trim()
    const category = document.querySelector('#prod_new_cat').value
    const box = document.querySelector('#err_producto')
    if(!name || !unit_label){ box.textContent='Completá nombre y unidad de compra.'; box.style.display='block'; return }
    const { error } = await supabase.from('products').insert({ name, unit_label, category })
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    adminData = null; render()
  }
  document.querySelectorAll('[data-comprar]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.comprar
    const qtyInput = document.querySelector(`#compra_qty_${id}`)
    const qty = Number(qtyInput.value)
    if(!qty || qty<=0){ mostrarAlerta('Ingresá una cantidad válida.'); return }
    const { error } = await supabase.from('stock_movements').insert({ product_id:id, type:'compra', quantity:qty, created_by: session?.user?.id || null })
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelector('#btn_guardar_capacidad').onclick = async ()=>{
    const val = document.querySelector('#cap_base').value.trim()
    const box = document.querySelector('#err_capacidad')
    if(!val || Number(val)<=0){ box.textContent='Ingresá un número válido.'; box.style.display='block'; return }
    const { error } = await supabase.from('farm_settings').update({ value: val }).eq('key','default_daily_capacity_maples')
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    adminData = null; render()
  }
  document.querySelectorAll('[data-promover]').forEach(b=>b.onclick=async()=>{
    if(!(await mostrarConfirmacion('¿Activar a esta persona? Va a pasar de la lista de espera a suscripción activa, con 50% de descuento en su primera entrega.')))return
    const { data, error } = await supabase.rpc('promote_waitlist_entry', { p_waitlist_id: b.dataset.promover })
    if(error || !data?.ok){ mostrarAlerta('No se pudo activar: '+(data?.error||error?.message||'')); return }
    adminData = null
    mostrarAlerta('Activado ✅ Próxima entrega: '+data.next_delivery_date)
    render()
  })
  document.querySelectorAll('[data-pp-save]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.ppSave
    const price = Number(document.querySelector(`#pp_price_${id}`).value)
    if(!price || price<=0){ mostrarAlerta('Ingresá un precio válido.'); return }
    const { error } = await supabase.from('plan_prices').update({ price }).eq('id', id)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-pp-toggle]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.ppToggle
    const activeNow = b.dataset.ppActive === 'true'
    const { error } = await supabase.from('plan_prices').update({ active: !activeNow }).eq('id', id)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  let ppTipoSel = 'minorista'
  const btnPpMinorista = document.querySelector('#btn_pp_tipo_minorista')
  const btnPpMayorista = document.querySelector('#btn_pp_tipo_mayorista')
  if(btnPpMinorista) btnPpMinorista.onclick = ()=>{ ppTipoSel='minorista'; btnPpMinorista.className='btn primary'; btnPpMayorista.className='btn ghost' }
  let ppGradeSel = ''
  let ppUnidadSel = 'maple'
  const mostrarCamposMayorista = (mostrar)=>{
    const g = document.querySelector('#pp_grade_wrap')
    const u = document.querySelector('#pp_unidad_wrap')
    if(g) g.style.display = mostrar ? 'block' : 'none'
    if(u) u.style.display = mostrar ? 'block' : 'none'
  }
  if(btnPpMayorista) btnPpMayorista.onclick = ()=>{ ppTipoSel='mayorista'; btnPpMayorista.className='btn primary'; btnPpMinorista.className='btn ghost'; mostrarCamposMayorista(true) }
  if(btnPpMinorista) btnPpMinorista.onclick = ()=>{ ppTipoSel='minorista'; btnPpMinorista.className='btn primary'; btnPpMayorista.className='btn ghost'; mostrarCamposMayorista(false) }
  document.querySelectorAll('[data-pp-grade]').forEach(b=>b.onclick=()=>{
    ppGradeSel = b.dataset.ppGrade
    document.querySelectorAll('[data-pp-grade]').forEach(x=> x.className = 'btn '+(x.dataset.ppGrade===ppGradeSel?'primary':'ghost'))
  })
  document.querySelectorAll('[data-pp-unidad]').forEach(b=>b.onclick=()=>{
    ppUnidadSel = b.dataset.ppUnidad
    document.querySelectorAll('[data-pp-unidad]').forEach(x=> x.className = 'btn '+(x.dataset.ppUnidad===ppUnidadSel?'primary':'ghost'))
  })
  document.querySelector('#btn_agregar_tamano').onclick = async ()=>{
    const qty = Number(document.querySelector('#pp_new_qty').value)
    const price = Number(document.querySelector('#pp_new_price').value)
    const box = document.querySelector('#err_tamano')
    if(!qty || qty<=0 || !price || price<=0){ box.textContent='Completá cantidad de huevos y precio, ambos mayores a 0.'; box.style.display='block'; return }
    if(ppTipoSel==='mayorista' && !ppGradeSel){ box.textContent='Elegí el tamaño del huevo.'; box.style.display='block'; return }
    const { error } = await supabase.from('plan_prices').insert({
      egg_quantity: qty, price, active: true, customer_type: ppTipoSel,
      grade: ppTipoSel==='mayorista' ? ppGradeSel : null,
      unidad: ppTipoSel==='mayorista' ? ppUnidadSel : null
    })
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    adminData = null; render()
  }
  const btnDeposito = document.querySelector('#btn_guardar_deposito')
  if(btnDeposito) btnDeposito.onclick = async ()=>{
    const est = document.querySelector('#dep_estado')
    const datos = {
      deposito_street: document.querySelector('#dep_street').value.trim(),
      deposito_street_number: document.querySelector('#dep_street_number').value.trim(),
      deposito_neighborhood: document.querySelector('#dep_neighborhood').value.trim(),
      deposito_city: document.querySelector('#dep_city').value.trim() || 'Rosario',
      localidades_habituales: document.querySelector('#dep_habituales').value.trim() || 'Rosario'
    }
    if(!datos.deposito_street || !datos.deposito_street_number){
      if(est){ est.textContent = '⚠️ Completá calle y número.'; est.style.color = NOM.rojo }
      return
    }
    btnDeposito.disabled = true; btnDeposito.textContent = 'Buscando la dirección…'
    const geo = await geocodificarDireccion(direccionParaBuscar({ street:datos.deposito_street, street_number:datos.deposito_street_number, city:datos.deposito_city, province:'Santa Fe' }))
    const veredicto = evaluarGeo(geo, { city: datos.deposito_city })
    if(geo){
      datos.deposito_latitude = String(geo.lat)
      datos.deposito_longitude = String(geo.lon)
    }
    for(const [key, value] of Object.entries(datos)){
      const { error } = await supabase.from('farm_settings').update({ value }).eq('key', key)
      if(error) await supabase.from('farm_settings').insert({ key, value })
    }
    btnDeposito.disabled = false; btnDeposito.textContent = 'Guardar depósito y ubicarlo'
    if(!geo){
      mostrarAlerta('Guardamos los datos, pero no encontramos esa dirección en el mapa. Revisá que la calle y la localidad estén bien escritas — sin la ubicación no se pueden calcular las distancias.')
    } else if(veredicto.estado !== 'confirmado'){
      mostrarAlerta(`Depósito guardado y ubicado, pero con poca precisión (${veredicto.motivo.toLowerCase()}). Las distancias van a ser aproximadas.`)
    } else {
      mostrarAlerta('Depósito guardado y ubicado ✅ Ya se calculan las distancias a cada cliente.')
    }
    adminData = null
    render()
  }
  document.querySelector('#btn_guardar_pago_config').onclick = async ()=>{
    const valores = {
      transfer_bank_name: document.querySelector('#cfg_bank_name').value.trim(),
      transfer_alias: document.querySelector('#cfg_alias').value.trim(),
      transfer_cbu: document.querySelector('#cfg_cbu').value.trim(),
      transfer_holder_name: document.querySelector('#cfg_holder_name').value.trim(),
      transfer_holder_doc: document.querySelector('#cfg_holder_doc').value.trim(),
      mp_wallet_name: document.querySelector('#cfg_mp_name').value.trim(),
      mp_alias: document.querySelector('#cfg_mp').value.trim(),
      mp_cbu: document.querySelector('#cfg_mp_cbu').value.trim(),
      mp_holder_name: document.querySelector('#cfg_mp_holder_name').value.trim(),
      mp_holder_doc: document.querySelector('#cfg_mp_holder_doc').value.trim()
    }
    for(const [key, value] of Object.entries(valores)){
      await supabase.from('farm_settings').update({ value }).eq('key', key)
    }
    adminData = null
    mostrarAlerta('Datos de cobro guardados ✅')
  }
  let walletDiscTipoSel = settingsMap.wallet_discount_type || 'percent'
  const pintarDescTipo = ()=>{
    const bp = document.querySelector('#btn_desc_percent'), bf = document.querySelector('#btn_desc_fixed'), lbl = document.querySelector('#lbl_desc_valor')
    if(bp) bp.className = 'btn '+(walletDiscTipoSel==='percent'?'primary':'ghost')
    if(bf) bf.className = 'btn '+(walletDiscTipoSel==='fixed'?'primary':'ghost')
    if(lbl) lbl.textContent = walletDiscTipoSel==='percent' ? 'Valor (%)' : 'Valor ($)'
  }
  const btnDescPercent = document.querySelector('#btn_desc_percent')
  if(btnDescPercent) btnDescPercent.onclick = ()=>{ walletDiscTipoSel='percent'; pintarDescTipo() }
  const btnDescFixed = document.querySelector('#btn_desc_fixed')
  if(btnDescFixed) btnDescFixed.onclick = ()=>{ walletDiscTipoSel='fixed'; pintarDescTipo() }
  pintarDescTipo()
  const btnGuardarDescuento = document.querySelector('#btn_guardar_descuento')
  if(btnGuardarDescuento) btnGuardarDescuento.onclick = async ()=>{
    const valor = document.querySelector('#cfg_wallet_discount_value').value
    await supabase.from('farm_settings').update({ value: walletDiscTipoSel }).eq('key','wallet_discount_type')
    await supabase.from('farm_settings').update({ value: valor }).eq('key','wallet_discount_value')
    adminData = null
    mostrarAlerta('Descuento guardado ✅')
    render()
  }
  const btnToggleFormProveedor = document.querySelector('#btn_toggle_form_proveedor')
  if(btnToggleFormProveedor) btnToggleFormProveedor.onclick = ()=>{ mostrarFormNuevoProveedor = !mostrarFormNuevoProveedor; render() }
  document.querySelectorAll('[data-prov-tipo]').forEach(b=>b.onclick=()=>{
    proveedorTipoNuevo = b.dataset.provTipo
    document.querySelectorAll('[data-prov-tipo]').forEach(x=> x.className = 'btn '+(x.dataset.provTipo===proveedorTipoNuevo?'primary':'ghost'))
  })
  const btnCrearProveedor = document.querySelector('#btn_crear_proveedor')
  if(btnCrearProveedor) btnCrearProveedor.onclick = async ()=>{
    const name = document.querySelector('#prov_new_name').value.trim()
    if(!name){ mostrarAlerta('Ponele un nombre a la empresa.'); return }
    const { error } = await supabase.from('suppliers').insert({
      name,
      contact_phone: document.querySelector('#prov_new_phone').value.trim(),
      contact_email: document.querySelector('#prov_new_email').value.trim(),
      address: document.querySelector('#prov_new_address').value.trim(),
      tipo: proveedorTipoNuevo
    })
    if(error){ mostrarAlerta('Error: '+error.message); return }
    mostrarFormNuevoProveedor = false; proveedorTipoNuevo = 'almacen'
    adminData = null; render()
  }
  const btnToggleFormProducto = document.querySelector('#btn_toggle_form_producto')
  if(btnToggleFormProducto) btnToggleFormProducto.onclick = ()=>{ mostrarFormNuevoProducto = !mostrarFormNuevoProducto; render() }
  const inCosto = document.querySelector('#catprod_new_costo')
  const inMargenMin = document.querySelector('#catprod_margen_min')
  const inPrecioMin = document.querySelector('#catprod_new_price')
  const inMargenMay = document.querySelector('#catprod_margen_may')
  const inPrecioMay = document.querySelector('#catprod_price_may')
  if(inCosto){
    const pintar = ()=>{
      const costo = Number(inCosto.value)||0
      const pMin = Number(inPrecioMin.value)||0
      const pMay = Number(inPrecioMay.value)||0
      const gMin = document.querySelector('#ganancia_min')
      const gMay = document.querySelector('#ganancia_may')
      if(gMin) gMin.textContent = (costo>0 && pMin>0) ? `Ganás $${(pMin-costo).toLocaleString('es-AR')} por unidad` : 'Cargá el costo para ver la ganancia'
      if(gMay) gMay.textContent = (costo>0 && pMay>0) ? `Ganás $${(pMay-costo).toLocaleString('es-AR')} por unidad` : ''
    }
    const desdeMargen = (inMargen, inPrecio)=>{
      const costo = Number(inCosto.value)||0
      const m = Number(inMargen.value)||0
      if(costo>0) inPrecio.value = Math.round(costo*(1+m/100))
      pintar()
    }
    const desdePrecio = (inPrecio, inMargen)=>{
      const costo = Number(inCosto.value)||0
      const p = Number(inPrecio.value)||0
      if(costo>0 && p>0) inMargen.value = Math.round((p-costo)/costo*1000)/10
      pintar()
    }
    inCosto.oninput = ()=>{ desdeMargen(inMargenMin, inPrecioMin); desdeMargen(inMargenMay, inPrecioMay) }
    inMargenMin.oninput = ()=> desdeMargen(inMargenMin, inPrecioMin)
    inPrecioMin.oninput = ()=> desdePrecio(inPrecioMin, inMargenMin)
    inMargenMay.oninput = ()=> desdeMargen(inMargenMay, inPrecioMay)
    inPrecioMay.oninput = ()=> desdePrecio(inPrecioMay, inMargenMay)
    pintar()
  }
  const chkVenc = document.querySelector('#catprod_new_venc')
  if(chkVenc) chkVenc.onchange = ()=>{
    productoControlaVenc = chkVenc.checked
    document.querySelector('#campo_vida_util').style.display = productoControlaVenc?'block':'none'
  }
  const btnCrearProductoCatalogo = document.querySelector('#btn_crear_producto_catalogo')
  if(btnCrearProductoCatalogo) btnCrearProductoCatalogo.onclick = async ()=>{
    const name = document.querySelector('#catprod_new_name').value.trim()
    const price = Number(document.querySelector('#catprod_new_price').value)
    if(!name || !price){ mostrarAlerta('Completá al menos el nombre y el precio.'); return }
    let photo_url = null
    const fotoInput = document.querySelector('#prod_new_foto')
    const fotoFile = fotoInput?.files?.[0]
    if(fotoFile){
      const path = `catalogo_${Date.now()}.${(fotoFile.name.split('.').pop()||'jpg')}`
      const { error: upErr } = await supabase.storage.from('product-photos').upload(path, fotoFile)
      if(upErr){ mostrarAlerta('No se pudo subir la foto: '+upErr.message); return }
      const { data: pub } = supabase.storage.from('product-photos').getPublicUrl(path)
      photo_url = pub.publicUrl
    }
    const stockVal = document.querySelector('#catprod_new_stock').value.trim()
    const { error } = await supabase.from('catalog_products').insert({
      supplier_id: document.querySelector('#catprod_new_supplier').value || null,
      controla_vencimiento: productoControlaVenc,
      costo: Number(document.querySelector('#catprod_new_costo').value) || null,
      margen_minorista: Number(document.querySelector('#catprod_margen_min').value) || null,
      margen_mayorista: Number(document.querySelector('#catprod_margen_may').value) || null,
      wholesale_price: Number(document.querySelector('#catprod_price_may').value) || null,
      visible_minorista: document.querySelector('#catprod_vis_min').checked,
      visible_mayorista: document.querySelector('#catprod_vis_may').checked,
      vida_util_dias: (productoControlaVenc && document.querySelector('#catprod_new_vida')?.value) ? Number(document.querySelector('#catprod_new_vida').value) : null,
      name, price,
      description: document.querySelector('#catprod_new_desc').value.trim(),
      unit_label: document.querySelector('#catprod_new_unit').value.trim() || 'unidad',
      category: document.querySelector('#catprod_new_cat').value,
      stock: stockVal===''?null:Number(stockVal),
      photo_url
    })
    if(error){ mostrarAlerta('Error: '+error.message); return }
    mostrarFormNuevoProducto = false
    adminData = null; render()
  }
  document.querySelectorAll('[data-toggle-producto]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.toggleProducto
    if(productoExpandido===id){ productoExpandido=null; render(); return }
    productoExpandido = id
    if(!productoDetalleCache[id]){
      const { data } = await supabase.rpc('admin_product_interest_detail', { p_product_id: id })
      productoDetalleCache[id] = data || []
    }
    render()
  })
  document.querySelectorAll('[data-ajustar-precio]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.ajustarPrecio
    const tipo = b.dataset.tipo
    const valor = Number(document.querySelector(`#ajuste_valor_${id}`).value)
    if(!valor){ mostrarAlerta('Ingresá un valor para ajustar.'); return }
    const producto = catalogo.find(p=>p.id===id)
    if(!producto) return
    const nuevoPrecio = tipo==='percent' ? Math.round(producto.price * (1+valor/100)) : producto.price + valor
    const { error } = await supabase.from('catalog_products').update({ price: nuevoPrecio }).eq('id', id)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    await supabase.from('catalog_price_history').insert({ product_id: id, old_price: producto.price, new_price: nuevoPrecio })
    delete productoDetalleCache[id]
    adminData = null
    mostrarAlerta(`Precio actualizado: $${producto.price.toLocaleString('es-AR')} → $${nuevoPrecio.toLocaleString('es-AR')}`)
    render()
  })
  document.querySelectorAll('[data-guardar-stock]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.guardarStock
    const valor = document.querySelector(`#stock_valor_${id}`).value.trim()
    const { error } = await supabase.from('catalog_products').update({ stock: valor===''?null:Number(valor) }).eq('id', id)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null
    mostrarAlerta('Stock actualizado ✅')
    render()
  })
  document.querySelectorAll('[data-guardar-mayorista]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.guardarMayorista
    const valor = document.querySelector(`#mayorista_valor_${id}`).value.trim()
    const { error } = await supabase.from('catalog_products').update({ wholesale_price: valor===''?null:Number(valor) }).eq('id', id)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null
    mostrarAlerta('Precio mayorista guardado ✅')
    render()
  })
  document.querySelectorAll('[data-toggle-wholesale-only]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.toggleWholesaleOnly
    const actual = b.dataset.wholesaleOnly === 'true'
    const { error } = await supabase.from('catalog_products').update({ wholesale_only: !actual }).eq('id', id)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null
    mostrarAlerta(!actual ? '🏭 Ahora solo lo ven los mayoristas' : '✅ Ahora también lo ven los clientes de casa')
    render()
  })
  document.querySelectorAll('[data-guardar-categoria]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.guardarCategoria
    const valor = document.querySelector(`#cat_valor_${id}`).value
    const { error } = await supabase.from('catalog_products').update({ category: valor }).eq('id', id)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null
    mostrarAlerta('Categoría actualizada ✅')
    render()
  })
  document.querySelectorAll('[data-tipo-comision]').forEach(b=>b.onclick=()=>{
    comisionTipoSeleccionado[b.dataset.tipoComision] = b.dataset.valorTipo
    render()
  })
  document.querySelectorAll('[data-guardar-comision]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.guardarComision
    const tipo = comisionTipoSeleccionado[id] || (rendicionVendedores.find(v=>v.vendedor_id===id)?.commission_type) || 'fixed'
    const valor = Number(document.querySelector(`#comision_valor_${id}`).value)
    if(!valor || valor<=0){ mostrarAlerta('Ingresá un valor válido.'); return }
    const { data, error } = await supabase.rpc('admin_set_comision_vendedor', { p_vendedor_id: id, p_tipo: tipo, p_valor: valor })
    if(error || !data?.ok){ mostrarAlerta('No se pudo guardar: '+(error?.message||data?.error||'')); return }
    adminData = null
    mostrarAlerta('Comisión guardada ✅')
    render()
  })
  document.querySelectorAll('[data-pagar-comisiones]').forEach(b=>b.onclick=async()=>{
    const confirmado = await mostrarConfirmacion('¿Marcar todas las comisiones pendientes de este vendedor como pagadas? Esto queda registrado con la fecha de hoy.')
    if(!confirmado) return
    const { data, error } = await supabase.rpc('admin_marcar_comisiones_pagadas', { p_vendedor_id: b.dataset.pagarComisiones })
    if(error || !data?.ok){ mostrarAlerta('No se pudo registrar: '+(error?.message||data?.error||'')); return }
    adminData = null
    mostrarAlerta('Pago registrado ✅')
    render()
  })
  document.querySelectorAll('[data-guardar-rubro]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.guardarRubro
    const valor = document.querySelector(`#rubro_${id}`).value
    const { data, error } = await supabase.rpc('admin_categorize_suggestion', { p_suggestion_id: id, p_category: valor })
    if(error || !data?.ok){ mostrarAlerta('No se pudo guardar: '+(error?.message||data?.error||'')); return }
    adminData = null
    mostrarAlerta('Rubro guardado ✅')
    render()
  })
  const btnGuardarWhatsappUrgentes = document.querySelector('#btn_guardar_whatsapp_urgentes')
  if(btnGuardarWhatsappUrgentes) btnGuardarWhatsappUrgentes.onclick = async ()=>{
    const valor = document.querySelector('#whatsapp_urgentes_valor').value.trim().replace(/\D/g,'')
    const { error } = await supabase.from('farm_settings').upsert({ key:'whatsapp_pedidos_urgentes', value: valor })
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null
    mostrarAlerta('Número guardado ✅')
    render()
  }
  const btnIrTelefono = document.querySelector('#btn_ir_telefono')
  if(btnIrTelefono) btnIrTelefono.onclick = ()=>{ current='telefonico'; adminAreaAbierta=null; render() }
  document.querySelectorAll('[data-toggle-activo]').forEach(b=>b.onclick=async()=>{
    const activoAhora = b.dataset.activo === 'true'
    const { error } = await supabase.from('catalog_products').update({ active: !activoAhora }).eq('id', b.dataset.toggleActivo)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelectorAll('[id^="foto_producto_"]').forEach(inp=>inp.onchange=(e)=>{
    const id = inp.id.replace('foto_producto_','')
    const file = e.target.files?.[0]
    const preview = document.querySelector(`#preview_foto_${id}`)
    if(file && preview){
      const reader = new FileReader()
      reader.onload = ()=>{ preview.src = reader.result; preview.style.display='block' }
      reader.readAsDataURL(file)
    }
  })
  document.querySelectorAll('[data-subir-foto]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.subirFoto
    const fotoInput = document.querySelector(`#foto_producto_${id}`)
    const fotoFile = fotoInput?.files?.[0]
    if(!fotoFile){ mostrarAlerta('Elegí una foto primero.'); return }
    const path = `catalogo_${id}_${Date.now()}.${(fotoFile.name.split('.').pop()||'jpg')}`
    const { error: upErr } = await supabase.storage.from('product-photos').upload(path, fotoFile)
    if(upErr){ mostrarAlerta('No se pudo subir la foto: '+upErr.message); return }
    const { data: pub } = supabase.storage.from('product-photos').getPublicUrl(path)
    const { error } = await supabase.from('catalog_products').update({ photo_url: pub.publicUrl }).eq('id', id)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    delete productoDetalleCache[id]
    adminData = null
    mostrarAlerta('📷 Foto guardada')
    render()
  })
  const selProveedorPedido = document.querySelector('#sel_proveedor_pedido')
  if(selProveedorPedido) selProveedorPedido.onchange = (e)=>{
    proveedorPedidoSeleccionado = e.target.value || null
    pedidoProveedorCantidades = {}
    pedidoProveedorGenerado = null
    pedidoProveedorNumero = null
    pedidoProveedorItems = null
    render()
  }
  const inputsCant = Array.from(document.querySelectorAll('[data-cant-pedido]'))
  const timersCant = {}
  inputsCant.forEach((inp, i)=>{
    const id = inp.dataset.cantPedido
    const barra = document.querySelector(`[data-barra="${id}"]`)
    const relleno = barra ? barra.querySelector('.salto-fill') : null

    const centrar = (el)=>{
      if(!el) return
      const fila = el.closest('div[id^="fila_prod_"]') || el
      fila.scrollIntoView({ behavior:'smooth', block:'center' })
    }
    const saltar = ()=>{
      if(barra) barra.style.opacity = '0'
      const sig = inputsCant[i+1]
      if(sig){ sig.focus(); sig.select && sig.select(); setTimeout(()=>centrar(sig), 60) }
      else inp.blur()
    }

    inp.onfocus = ()=> setTimeout(()=>centrar(inp), 250)
    inp.onblur = ()=>{
      clearTimeout(timersCant[id])
      if(barra){ barra.style.opacity='0'; if(relleno){ relleno.style.transition='none'; relleno.style.transform='scaleX(1)' } }
    }
    inp.onkeydown = (e)=>{ if(e.key === 'Enter'){ e.preventDefault(); clearTimeout(timersCant[id]); saltar() } }

    inp.oninput = ()=>{
      pedidoProveedorCantidades[id] = pedidoProveedorCantidades[id] || { qty:0, unitType:'unidad' }
      pedidoProveedorCantidades[id].qty = Number(inp.value)||0
      clearTimeout(timersCant[id])
      if(!inp.value){ if(barra) barra.style.opacity='0'; return }
      if(barra && relleno){
        barra.style.opacity = '1'
        relleno.style.transition = 'none'
        relleno.style.transform = 'scaleX(1)'
        void relleno.offsetWidth
        relleno.style.transition = `transform ${SALTO_MS}ms linear`
        relleno.style.transform = 'scaleX(0)'
      }
      timersCant[id] = setTimeout(saltar, SALTO_MS)
    }
  })
  const inputBuscarProd = document.querySelector('#buscar_prod_pedido')
  if(inputBuscarProd){
    inputBuscarProd.oninput = ()=>{
      clearTimeout(window.__tBuscarProd)
      window.__tBuscarProd = setTimeout(()=>{ busquedaProductoPedido = inputBuscarProd.value; render() }, 400)
    }
  }
  document.querySelectorAll('[data-unidad-pedido]').forEach(sel=>sel.onchange=()=>{
    const id = sel.dataset.unidadPedido
    pedidoProveedorCantidades[id] = pedidoProveedorCantidades[id] || { qty:0, unitType:'unidad' }
    pedidoProveedorCantidades[id].unitType = sel.value
  })
  const btnTipoEntrega = document.querySelector('#btn_tipo_entrega')
  if(btnTipoEntrega) btnTipoEntrega.onclick = ()=>{ pedidoProveedorTipoEntrega='entrega'; render() }
  const btnTipoRetiro = document.querySelector('#btn_tipo_retiro')
  if(btnTipoRetiro) btnTipoRetiro.onclick = ()=>{ pedidoProveedorTipoEntrega='retiro'; render() }
  const btnGenerarPedidoProveedor = document.querySelector('#btn_generar_pedido_proveedor')
  if(btnGenerarPedidoProveedor) btnGenerarPedidoProveedor.onclick = async ()=>{
    const prov = suppliers.find(s=>s.id===proveedorPedidoSeleccionado)
    const items = catalogo.filter(p=>p.supplier_id===proveedorPedidoSeleccionado)
      .map(p=>({ p, c: pedidoProveedorCantidades[p.id] }))
      .filter(x=>x.c && x.c.qty>0)
    if(!items.length){ mostrarAlerta('Poné alguna cantidad primero.'); return }
    const lineas = items.map(({p,c})=>`• ${c.qty} ${c.unitType==='unidad'?p.unit_label||'unidad':c.unitType}${c.qty>1?(c.unitType==='unidad'?'es':'s'):''} de ${p.name} — $${(Number(p.price)*Number(c.qty)).toLocaleString('es-AR')}`).join('\n')
    const totalPedidoTexto = items.reduce((s,{p,c})=>s+Number(p.price)*Number(c.qty),0)
    pedidoProveedorGenerado = `PEDIDO — NÓMADES (Huevos de libre pastoreo)\nPara: ${prov?.name||''}\n\n${lineas}\n\nTOTAL: $${totalPedidoTexto.toLocaleString('es-AR')}\n\n${pedidoProveedorTipoEntrega==='entrega' ? 'Modalidad: nos lo entregan a nuestra dirección.' : 'Modalidad: lo pasamos a retirar nosotros.'}\n\nGracias, saludos — NÓMADES`
    pedidoProveedorItems = items.map(({p,c})=>({ id:p.id, name:p.name, qty:c.qty, unitType:c.unitType, unitLabel:p.unit_label||'unidad', price:p.price }))
    if(pedidoProveedorEditandoId){
      const { data, error } = await supabase.rpc('admin_actualizar_pedido_proveedor', { p_order_id: pedidoProveedorEditandoId, p_items: pedidoProveedorItems, p_delivery_mode: pedidoProveedorTipoEntrega })
      if(error || !data?.ok){ mostrarAlerta(data?.error || error?.message || 'No se pudo guardar el cambio.'); return }
      mostrarAlerta('✅ Pedido actualizado')
      adminData = null
    } else {
      const { data, error } = await supabase.rpc('admin_crear_pedido_proveedor', { p_supplier_id: proveedorPedidoSeleccionado, p_items: pedidoProveedorItems, p_delivery_mode: pedidoProveedorTipoEntrega })
      pedidoProveedorNumero = (!error && data?.ok) ? data.order_number : null
      adminData = null
    }
    render()
  }
  const btnCancelarEdicionPedido = document.querySelector('#btn_cancelar_edicion_pedido')
  if(btnCancelarEdicionPedido) btnCancelarEdicionPedido.onclick = ()=>{
    pedidoProveedorEditandoId = null; proveedorPedidoSeleccionado = null; pedidoProveedorCantidades = {}; pedidoProveedorGenerado = null; pedidoProveedorNumero = null
    render()
  }
  const btnPedidoListoVolver = document.querySelector('#btn_pedido_listo_volver')
  if(btnPedidoListoVolver) btnPedidoListoVolver.onclick = ()=>{
    pedidoProveedorGenerado = null; pedidoProveedorNumero = null; pedidoProveedorItems = null
    pedidoProveedorEditandoId = null; proveedorPedidoSeleccionado = null; pedidoProveedorCantidades = {}
    adminData = null
    render()
  }
  document.querySelectorAll('[data-editar-pedido]').forEach(b=>b.onclick=()=>{
    const orden = pedidosProveedor.find(o=>o.id===b.dataset.editarPedido)
    if(!orden) return
    pedidoProveedorEditandoId = orden.id
    pedidoProveedorNumero = orden.order_number
    proveedorPedidoSeleccionado = orden.supplier_id
    pedidoProveedorTipoEntrega = orden.delivery_type || 'entrega'
    pedidoProveedorCantidades = {}
    ;(orden.items||[]).forEach(it=>{ pedidoProveedorCantidades[it.id] = { qty: it.qty, unitType: it.unitType||'unidad' } })
    pedidoProveedorGenerado = null
    render()
  })
  document.querySelectorAll('[data-recibir-pedido]').forEach(b=>b.onclick=()=>{
    const orden = pedidosProveedor.find(o=>o.id===b.dataset.recibirPedido)
    if(!orden) return
    pedidoProveedorRecibiendoId = orden.id
    pedidoProveedorRecibido = {}
    ;(orden.items||[]).forEach(it=>{ pedidoProveedorRecibido[it.id] = { checked:false, received_qty: it.qty } })
    render()
  })
  const btnVolverListaPedidos = document.querySelector('#btn_volver_lista_pedidos')
  if(btnVolverListaPedidos) btnVolverListaPedidos.onclick = ()=>{ pedidoProveedorRecibiendoId = null; pedidoProveedorRecibido = {}; render() }
  document.querySelectorAll('[data-recep-check]').forEach(chk=>chk.onchange=()=>{
    const id = chk.dataset.recepCheck
    const orden = pedidosProveedor.find(o=>o.id===pedidoProveedorRecibiendoId)
    const item = orden?.items?.find(it=>it.id===id)
    pedidoProveedorRecibido[id] = { checked: chk.checked, received_qty: chk.checked ? (item?.qty||0) : 0 }
    render()
  })
  document.querySelectorAll('[data-recep-qty]').forEach(inp=>inp.oninput=()=>{
    const id = inp.dataset.recepQty
    pedidoProveedorRecibido[id] = { checked:false, received_qty: Number(inp.value)||0 }
  })
  document.querySelectorAll('[data-recep-venc]').forEach(inp=>inp.onchange=()=>{
    const id = inp.dataset.recepVenc
    const actual = pedidoProveedorRecibido[id] || { checked:false, received_qty:0 }
    pedidoProveedorRecibido[id] = { ...actual, vencimiento: inp.value }
  })
  const confirmarRecepcion = async (resolutionType)=>{
    const orden = pedidosProveedor.find(o=>o.id===pedidoProveedorRecibiendoId)
    if(!orden) return
    const receivedItems = (orden.items||[]).map(it=>{
      const r = pedidoProveedorRecibido[it.id] || { checked:false, received_qty: it.qty }
      const prod = catalogo.find(p=>p.id===it.product_id || p.name===it.name)
      const sugerida = (prod && prod.controla_vencimiento && prod.vida_util_dias) ? new Date(Date.now()+prod.vida_util_dias*86400000).toISOString().slice(0,10) : ''
      return {
        id: it.id, name: it.name, price: it.price, received_qty: r.received_qty,
        product_id: it.product_id || prod?.id || null,
        vencimiento: (prod && prod.controla_vencimiento) ? (r.vencimiento !== undefined ? r.vencimiento : sugerida) : ''
      }
    })
    const { data, error } = await supabase.rpc('admin_recibir_pedido_proveedor', { p_order_id: orden.id, p_received_items: receivedItems, p_resolution_type: resolutionType })
    if(error || !data?.ok){ mostrarAlerta(data?.error || error?.message || 'No se pudo registrar la recepción.'); return }
    pedidoProveedorRecibiendoId = null; pedidoProveedorRecibido = {}
    const { data: cambios } = await supabase.rpc('aplicar_costos_recepcion', { p_order_id: orden.id, p_items: receivedItems })
    if(cambios?.ok && (cambios.cambios||[]).length){
      const detalle = cambios.cambios.map(c=>`${c.producto}: $${Number(c.precio_anterior||0).toLocaleString('es-AR')} → $${Number(c.precio_nuevo).toLocaleString('es-AR')}`).join('\n')
      if(await mostrarConfirmacion(`Se actualizaron precios para mantener tu margen:\n\n${detalle}\n\n¿Preparo los avisos para los clientes?`)){
        for(const c of cambios.cambios){
          const prod = catalogo.find(p=>p.name===c.producto)
          if(prod) await supabase.rpc('encolar_aviso_precios', { p_product_id: prod.id, p_solo_interesados: true })
        }
        mostrarAlerta('Avisos preparados. Están en Comercial → Avisos a clientes, listos para enviar.')
      }
    }
    if((data.lotes||[]).length){
      const detalle = data.lotes.map(l=>`${l.producto}: lote ${l.lote}${l.vencimiento?` — vence ${new Date(l.vencimiento+'T00:00:00').toLocaleDateString('es-AR')}`:''}${l.aprendido?` (aprendí que dura ${l.dias} días)`:''}`).join('\n')
      mostrarAlerta('Lotes creados\n\n'+detalle)
    }
    pedidoProveedorRecienRecibido = { id: orden.id, order_number: orden.order_number, total_a_pagar: data.total_a_pagar, supplier_id: orden.supplier_id }
    adminData = null
    render()
  }
  const btnRecepCompleto = document.querySelector('#btn_recep_completo')
  if(btnRecepCompleto) btnRecepCompleto.onclick = ()=>confirmarRecepcion(null)
  const btnRecepNotaCredito = document.querySelector('#btn_recep_nota_credito')
  if(btnRecepNotaCredito) btnRecepNotaCredito.onclick = ()=>confirmarRecepcion('nota_credito')
  const btnRecepDescuento = document.querySelector('#btn_recep_descuento')
  if(btnRecepDescuento) btnRecepDescuento.onclick = ()=>confirmarRecepcion('descuento')
  const btnPagarAhoraTotal = document.querySelector('#btn_pagar_ahora_total')
  if(btnPagarAhoraTotal) btnPagarAhoraTotal.onclick = async ()=>{
    const r = pedidoProveedorRecienRecibido
    const { data, error } = await supabase.rpc('admin_pagar_proveedor', { p_supplier_id: r.supplier_id, p_amount: r.total_a_pagar, p_payment_method: 'transfer', p_receipt_url: null, p_imputaciones: [{ order_id: r.id, amount: r.total_a_pagar }], p_usar_credito: false })
    if(error || !data?.ok){ mostrarAlerta(data?.error || error?.message || 'No se pudo registrar el pago.'); return }
    mostrarAlerta('✅ Pago registrado')
    pedidoProveedorRecienRecibido = null
    adminData = null
    render()
  }
  const btnPagarAhoraParcial = document.querySelector('#btn_pagar_ahora_parcial')
  if(btnPagarAhoraParcial) btnPagarAhoraParcial.onclick = ()=>{
    document.querySelector('#pagar_ahora_parcial_box').style.display = 'block'
    btnPagarAhoraParcial.style.display = 'none'
  }
  const btnConfirmarPagoParcialAhora = document.querySelector('#btn_confirmar_pago_parcial_ahora')
  if(btnConfirmarPagoParcialAhora) btnConfirmarPagoParcialAhora.onclick = async ()=>{
    const r = pedidoProveedorRecienRecibido
    const monto = Number(document.querySelector('#pagar_ahora_monto').value)
    if(!monto || monto<=0){ mostrarAlerta('Ingresá un monto válido.'); return }
    const { data, error } = await supabase.rpc('admin_pagar_proveedor', { p_supplier_id: r.supplier_id, p_amount: monto, p_payment_method: 'transfer', p_receipt_url: null, p_imputaciones: [{ order_id: r.id, amount: monto }], p_usar_credito: false })
    if(error || !data?.ok){ mostrarAlerta(data?.error || error?.message || 'No se pudo registrar el pago.'); return }
    mostrarAlerta('✅ Pago parcial registrado')
    pedidoProveedorRecienRecibido = null
    adminData = null
    render()
  }
  const btnPagarAhoraNo = document.querySelector('#btn_pagar_ahora_no')
  if(btnPagarAhoraNo) btnPagarAhoraNo.onclick = ()=>{ pedidoProveedorRecienRecibido = null; render() }
  const btnIrHistPagos = document.querySelector('#btn_ir_historial_pagos')
  if(btnIrHistPagos) btnIrHistPagos.onclick = ()=>{ current='historial-pagos'; render() }
  const btnEstadoCuentaProv = document.querySelector('#btn_estado_cuenta_prov')
  if(btnEstadoCuentaProv) btnEstadoCuentaProv.onclick = async ()=>{
    if(!suppliers.length){ mostrarAlerta('Todavía no cargaste ninguna empresa proveedora.'); return }
    if(suppliers.length === 1){ documentoEstadoCuenta(suppliers[0].id); return }
    const nombres = suppliers.map((sp,i)=>`${i+1}. ${sp.name}`).join('\n')
    const idx = prompt('¿De qué empresa querés el estado de cuenta?\n\n'+nombres+'\n\nEscribí el número:')
    const elegido = suppliers[Number(idx)-1]
    if(elegido) documentoEstadoCuenta(elegido.id)
  }
  document.querySelectorAll('[data-abrir-pago]').forEach(b=>b.onclick=()=>{
    const id = b.dataset.abrirPago
    pagoProveedorSeleccionado = (pagoProveedorSeleccionado===id) ? null : id
    pagoMontoParcial = ''; pagoTipo = 'transfer'
    render()
  })
  const inputPagoProvMonto = document.querySelector('#pago_prov_monto')
  if(inputPagoProvMonto){
    inputPagoProvMonto.onchange = ()=>{ pagoMontoParcial = inputPagoProvMonto.value; render() }
    inputPagoProvMonto.onblur = ()=>{ if(pagoMontoParcial !== inputPagoProvMonto.value){ pagoMontoParcial = inputPagoProvMonto.value; render() } }
  }
  document.querySelectorAll('[data-pago-metodo]').forEach(b=>b.onclick=()=>{ pagoTipo = b.dataset.pagoMetodo; render() })
  const btnGuardarPagoProveedor = document.querySelector('#btn_guardar_pago_proveedor')
  if(btnGuardarPagoProveedor) btnGuardarPagoProveedor.onclick = async ()=>{
    const box = document.querySelector('#err_pago_prov')
    const monto = Number(document.querySelector('#pago_prov_monto').value)
    if(!monto || monto<=0){ box.textContent='Ingresá cuánto le pagaste.'; box.style.display='block'; return }
    if(!['transfer','cash','mp'].includes(pagoTipo)){ box.textContent='Elegí cómo le pagaste.'; box.style.display='block'; return }
    const usarCredito = !!document.querySelector('#pago_prov_credito')?.checked
    let receiptUrl = null
    const fileInput = document.querySelector('#pago_prov_comprobante')
    const file = fileInput && fileInput.files[0]
    if(file){
      const path = `proveedor_${Date.now()}_${file.name}`
      const { error: upErr } = await supabase.storage.from('finance-attachments').upload(path, file)
      if(upErr){ box.textContent='No se pudo subir el comprobante: '+upErr.message; box.style.display='block'; return }
      const { data: pub } = supabase.storage.from('finance-attachments').getPublicUrl(path)
      receiptUrl = pub.publicUrl
    }
    const { data, error } = await supabase.rpc('admin_pagar_proveedor', {
      p_supplier_id: pagoProveedorSeleccionado,
      p_amount: monto,
      p_payment_method: pagoTipo,
      p_receipt_url: receiptUrl,
      p_imputaciones: null,
      p_usar_credito: usarCredito
    })
    if(error || !data?.ok){ box.textContent = data?.error || error?.message || 'No se pudo registrar el pago.'; box.style.display='block'; return }
    const detalle = (data.imputado||[]).map(x=>`N° ${x.order_number}: $${Number(x.aplicado).toLocaleString('es-AR')}`).join('\n')
    mostrarAlerta('✅ Pago de $'+monto.toLocaleString('es-AR')+' registrado\n\n'+detalle+(Number(data.sobrante_a_favor)>0?`\n\nQuedaron $${Number(data.sobrante_a_favor).toLocaleString('es-AR')} a favor.`:''))
    pagoProveedorSeleccionado = null; pagoMontoParcial=''; pagoTipo='transfer'
    adminData = null
    render()
  }
  document.querySelectorAll('[data-ver-cuenta-mayorista]').forEach(row=>row.onclick=async()=>{
    const id = row.dataset.verCuentaMayorista
    cuentaCorrienteClienteSeleccionado = cuentaCorrienteClienteSeleccionado===id ? null : id
    cobroPedidoSeleccionado = null
    if(cuentaCorrienteClienteSeleccionado && !cuentaCorrienteDetalleCache[id]){
      const { data } = await supabase.rpc('admin_pedidos_mayorista_detalle', { p_customer_id: id })
      cuentaCorrienteDetalleCache[id] = data || []
    }
    render()
  })
  document.querySelectorAll('[data-cobrar-pedido]').forEach(b=>b.onclick=(e)=>{
    e.stopPropagation()
    cobroPedidoSeleccionado = cobroPedidoSeleccionado===b.dataset.cobrarPedido ? null : b.dataset.cobrarPedido
    cobroTipo = 'total'; cobroMontoParcial = ''
    render()
  })
  const btnCobroTipoTotal = document.querySelector('#btn_cobro_tipo_total')
  if(btnCobroTipoTotal) btnCobroTipoTotal.onclick = (e)=>{ e.stopPropagation(); cobroTipo='total'; render() }
  const btnCobroTipoParcial = document.querySelector('#btn_cobro_tipo_parcial')
  if(btnCobroTipoParcial) btnCobroTipoParcial.onclick = (e)=>{ e.stopPropagation(); cobroTipo='parcial'; render() }
  const btnGuardarCobroMayorista = document.querySelector('#btn_guardar_cobro_mayorista')
  if(btnGuardarCobroMayorista) btnGuardarCobroMayorista.onclick = async (e)=>{
    e.stopPropagation()
    const detalle = cuentaCorrienteDetalleCache[cuentaCorrienteClienteSeleccionado] || []
    const orden = detalle.find(o=>o.order_id===cobroPedidoSeleccionado)
    if(!orden) return
    const saldo = Number(orden.monto_adeudado) - Number(orden.monto_cobrado)
    let monto = saldo
    if(cobroTipo==='parcial'){
      monto = Number(document.querySelector('#input_cobro_parcial').value)
      if(!monto || monto<=0){ mostrarAlerta('Ingresá un monto válido.'); return }
      if(monto>saldo){ mostrarAlerta('Ese monto es mayor al saldo pendiente ($'+saldo.toLocaleString('es-AR')+').'); return }
    }
    const { data, error } = await supabase.rpc('admin_registrar_cobro_mayorista', { p_order_id: orden.order_id, p_amount: monto })
    if(error || !data?.ok){ mostrarAlerta(data?.error || error?.message || 'No se pudo registrar el cobro.'); return }
    mostrarAlerta('✅ Cobro de $'+monto.toLocaleString('es-AR')+' registrado')
    cobroPedidoSeleccionado = null
    delete cuentaCorrienteDetalleCache[cuentaCorrienteClienteSeleccionado]
    adminData = null
    render()
  }
  const btnEnviarWhatsappProveedor = document.querySelector('#btn_enviar_whatsapp_proveedor')
  if(btnEnviarWhatsappProveedor) btnEnviarWhatsappProveedor.onclick = ()=>{
    const prov = suppliers.find(s=>s.id===proveedorPedidoSeleccionado)
    const telLimpio = (prov?.contact_phone||'').replace(/\D/g,'')
    const textoWa = pedidoProveedorNumero ? `Pedido N° ${pedidoProveedorNumero}\n\n${pedidoProveedorGenerado}` : pedidoProveedorGenerado
    window.open(`https://wa.me/54${telLimpio}?text=${encodeURIComponent(textoWa)}`, '_blank')
  }
  const btnImprimirPedidoProveedor = document.querySelector('#btn_imprimir_pedido_proveedor')
  if(btnImprimirPedidoProveedor) btnImprimirPedidoProveedor.onclick = ()=>{
    const prov = suppliers.find(s=>s.id===proveedorPedidoSeleccionado)
    const fecha = new Date().toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'})
    const filasItems = (pedidoProveedorItems||[]).map(it=>`<tr><td style="padding:8px;border-bottom:1px solid #E3DCC8">${it.name}</td><td style="padding:8px;border-bottom:1px solid #E3DCC8;text-align:center">${it.qty} ${it.unitType==='unidad'?it.unitLabel:it.unitType}</td><td style="padding:8px;border-bottom:1px solid #E3DCC8;text-align:right">$${Number(it.price).toLocaleString('es-AR')}</td><td style="padding:8px;border-bottom:1px solid #E3DCC8;text-align:right">$${(Number(it.price)*Number(it.qty)).toLocaleString('es-AR')}</td></tr>`).join('')
    const totalPdf = (pedidoProveedorItems||[]).reduce((s,it)=>s+Number(it.price)*Number(it.qty),0)
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pedido ${pedidoProveedorNumero||''}</title>
    <style>
      body{font-family:Arial,Helvetica,sans-serif;color:#2F2F2A;padding:30px;max-width:700px;margin:0 auto}
      h1{font-size:20px;color:#2F4D2A;margin:0}
      .sub{color:#8A8570;font-size:12px;margin-top:2px}
      .box{border:1px solid #E3DCC8;border-radius:8px;padding:14px;margin-top:18px}
      .cols{display:flex;gap:16px;margin-top:18px}
      .col{flex:1;border:1px solid #E3DCC8;border-radius:8px;padding:14px}
      .col h3{margin:0 0 8px;font-size:13px;color:#2F4D2A}
      .col p{margin:2px 0;font-size:12.5px}
      table{width:100%;border-collapse:collapse;margin-top:18px;font-size:13px}
      th{background:#2F4D2A;color:#F5EFE0;padding:8px;text-align:left;font-size:12px}
      .footer{margin-top:24px;font-size:12px;color:#8A8570}
    </style></head><body>
      <h1>Orden de compra${pedidoProveedorNumero?' N° '+pedidoProveedorNumero:''}</h1>
      <div class="sub">Fecha: ${fecha}</div>
      <div class="cols">
        <div class="col"><h3>De</h3>
          <p><b>${settingsMap.company_legal_name||'NÓMADES'}</b></p>
          ${settingsMap.company_cuit?`<p>CUIT: ${settingsMap.company_cuit}</p>`:''}
          ${settingsMap.company_address?`<p>${settingsMap.company_address}</p>`:''}
          ${settingsMap.company_phone?`<p>Tel: ${settingsMap.company_phone}</p>`:''}
          ${settingsMap.company_email?`<p>${settingsMap.company_email}</p>`:''}
        </div>
        <div class="col"><h3>Para</h3>
          <p><b>${prov?.name||''}</b></p>
          ${prov?.address?`<p>${prov.address}</p>`:''}
          ${prov?.contact_phone?`<p>Tel: ${prov.contact_phone}</p>`:''}
          ${prov?.contact_email?`<p>${prov.contact_email}</p>`:''}
        </div>
      </div>
      <table><thead><tr><th>Producto</th><th style="text-align:center">Cantidad</th><th style="text-align:right">Precio unit.</th><th style="text-align:right">Subtotal</th></tr></thead><tbody>${filasItems}</tbody><tfoot><tr><td colspan="3" style="padding:8px;text-align:right;font-weight:bold">TOTAL</td><td style="padding:8px;text-align:right;font-weight:bold">$${totalPdf.toLocaleString('es-AR')}</td></tr></tfoot></table>
      <div class="box" style="margin-top:14px"><b>Modalidad:</b> ${pedidoProveedorTipoEntrega==='entrega'?'Nos lo entregan en nuestra dirección.':'Lo pasamos a retirar nosotros.'}</div>
      <div class="footer">Gracias, saludos — ${settingsMap.company_legal_name||'NÓMADES'}</div>
    </body></html>`
    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
    w.onload = ()=>w.print()
    setTimeout(()=>w.print(), 300)
  }
  const btnGuardarDatosEmpresa = document.querySelector('#btn_guardar_datos_empresa')
  if(btnGuardarDatosEmpresa) btnGuardarDatosEmpresa.onclick = async ()=>{
    const valores = {
      company_legal_name: document.querySelector('#cfg_company_name').value.trim() || 'NÓMADES',
      company_cuit: document.querySelector('#cfg_company_cuit').value.trim(),
      company_address: document.querySelector('#cfg_company_address').value.trim(),
      company_phone: document.querySelector('#cfg_company_phone').value.trim(),
      company_email: document.querySelector('#cfg_company_email').value.trim()
    }
    for(const [key, value] of Object.entries(valores)){
      await supabase.from('farm_settings').update({ value }).eq('key', key)
    }
    mostrarAlerta('Datos de la empresa guardados ✅')
    adminData = null
  }
  document.querySelectorAll('[data-conciliar]').forEach(chk=>chk.onchange=async()=>{
    const { error } = await supabase.from('payments').update({ reconciled: chk.checked }).eq('id', chk.dataset.conciliar)
    if(error){ mostrarAlerta('Error: '+error.message); chk.checked=!chk.checked; return }
    adminData = null
  })
  const rendFechaInput = document.querySelector('#rend_fecha')
  if(rendFechaInput) rendFechaInput.onchange = (e)=>{ adminRendicionFecha = e.target.value; render() }
  document.querySelectorAll('[data-editar-pago]').forEach(b=>b.onclick=()=>{
    pagoEditando = pagoEditando===b.dataset.editarPago ? null : b.dataset.editarPago
    render()
  })
  document.querySelectorAll('[data-guardar-pago]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.guardarPago
    const val = Number(document.querySelector(`#pago_monto_${id}`).value)
    if(!val || val<=0){ mostrarAlerta('Ingresá un monto válido.'); return }
    const { error } = await supabase.from('payments').update({ amount: val }).eq('id', id)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    pagoEditando = null
    adminData = null; render()
  })
  document.querySelectorAll('[data-eliminar-pago]').forEach(b=>b.onclick=async()=>{
    if(!(await mostrarConfirmacion('¿Eliminar este pago? No se puede deshacer.')))return
    const { error } = await supabase.from('payments').delete().eq('id', b.dataset.eliminarPago)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  const btnToggleDif = document.querySelector('#btn_toggle_form_diferencia')
  if(btnToggleDif) btnToggleDif.onclick = ()=>{ mostrarFormDiferencia = !mostrarFormDiferencia; render() }
  const btnGuardarDif = document.querySelector('#btn_guardar_diferencia')
  if(btnGuardarDif) btnGuardarDif.onclick = async ()=>{
    const box = document.querySelector('#err_diferencia')
    const monto = Number(document.querySelector('#dif_monto').value)
    if(!monto){ box.textContent='Ingresá un monto distinto de 0.'; box.style.display='block'; return }
    const payload = {
      driver_id: document.querySelector('#dif_repartidor').value,
      entry_date: document.querySelector('#dif_fecha').value,
      amount: monto,
      description: document.querySelector('#dif_motivo').value.trim() || null,
      created_by: session.user.id
    }
    const { error } = await supabase.from('driver_ledger').insert(payload)
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    mostrarFormDiferencia = false
    adminData = null; render()
  }
  document.querySelectorAll('[data-toggle-cuenta]').forEach(b=>b.onclick=()=>{
    cuentaRepartidorAbierta = cuentaRepartidorAbierta===b.dataset.toggleCuenta ? null : b.dataset.toggleCuenta
    render()
  })
  document.querySelectorAll('[data-eliminar-ledger]').forEach(b=>b.onclick=async()=>{
    if(!(await mostrarConfirmacion('¿Eliminar este movimiento de la cuenta corriente?')))return
    const { error } = await supabase.from('driver_ledger').delete().eq('id', b.dataset.eliminarLedger)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-destacar-review]').forEach(b=>b.onclick=async()=>{
    const featuredNow = b.dataset.featured === 'true'
    const { error } = await supabase.from('reviews').update({ featured: !featuredNow }).eq('id', b.dataset.destacarReview)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  const btnToggleFormCat = document.querySelector('#btn_toggle_form_categoria')
  if(btnToggleFormCat) btnToggleFormCat.onclick = ()=>{ mostrarFormNuevaCategoria = !mostrarFormNuevaCategoria; render() }
  const btnToggleSeccionCat = document.querySelector('#btn_toggle_seccion_categorias')
  if(btnToggleSeccionCat) btnToggleSeccionCat.onclick = ()=>{ mostrarSeccionCategorias = !mostrarSeccionCategorias; render() }
  const btnToggleSeccionMov = document.querySelector('#btn_toggle_seccion_movimiento')
  if(btnToggleSeccionMov) btnToggleSeccionMov.onclick = ()=>{ mostrarSeccionMovimiento = !mostrarSeccionMovimiento; render() }
  const btnCrearCategoria = document.querySelector('#btn_crear_categoria')
  if(btnCrearCategoria) btnCrearCategoria.onclick = async ()=>{
    const name = document.querySelector('#cat_new_name').value.trim()
    const type = document.querySelector('#cat_new_type').value
    if(!name){ mostrarAlerta('Ponele un nombre a la categoría.'); return }
    const { error } = await supabase.from('finance_categories').insert({ name, type, active: true })
    if(error){ mostrarAlerta('Error: '+error.message); return }
    mostrarFormNuevaCategoria = false
    adminData = null; render()
  }
  document.querySelectorAll('[data-cat-toggle]').forEach(b=>b.onclick=async()=>{
    const activeNow = b.dataset.catActive === 'true'
    const { error } = await supabase.from('finance_categories').update({ active: !activeNow }).eq('id', b.dataset.catToggle)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  let finTipoSel = 'expense'
  const actualizarCategoriasFinanzas = ()=>{
    const sel = document.querySelector('#fin_categoria')
    if(!sel) return
    const tiposPermitidos = finTipoSel==='expense' ? ['fixed','variable'] : ['income']
    const opciones = categorias.filter(c=>c.active && tiposPermitidos.includes(c.type))
    sel.innerHTML = opciones.length ? opciones.map(c=>`<option value="${c.id}">${c.name}</option>`).join('') : '<option value="">No hay categorías de este tipo — creá una arriba</option>'
  }
  const pintarTipoFin = ()=>{
    document.querySelectorAll('[data-fin-tipo]').forEach(x=>{
      const on = x.dataset.finTipo===finTipoSel
      x.style.background = on ? '#2F4D2A' : 'transparent'
      x.style.color = on ? '#F5EFE0' : '#2F4D2A'
    })
  }
  document.querySelectorAll('[data-fin-tipo]').forEach(b=>b.onclick=()=>{
    finTipoSel = b.dataset.finTipo
    pintarTipoFin()
    actualizarCategoriasFinanzas()
  })
  pintarTipoFin()
  actualizarCategoriasFinanzas()
  let finCanalSel = 'compartido'
  document.querySelectorAll('[data-fin-canal]').forEach(b=>b.onclick=()=>{
    finCanalSel = b.dataset.finCanal
    document.querySelectorAll('[data-fin-canal]').forEach(x=> x.className = 'btn '+(x.dataset.finCanal===finCanalSel?'primary':'ghost'))
  })
  let comprobanteFinanzas = null
  const finReceipt = document.querySelector('#fin_receipt')
  if(finReceipt) finReceipt.onchange = (e)=>{ comprobanteFinanzas = e.target.files[0]||null }
  const btnGuardarMovimiento = document.querySelector('#btn_guardar_movimiento')
  if(btnGuardarMovimiento) btnGuardarMovimiento.onclick = async ()=>{
    const box = document.querySelector('#err_finanzas')
    const category_id = document.querySelector('#fin_categoria').value
    const amount = Number(document.querySelector('#fin_amount').value)
    const entry_date = document.querySelector('#fin_date').value
    const description = document.querySelector('#fin_desc').value.trim()
    if(!category_id){ box.textContent='Elegí una categoría (o creá una nueva arriba primero).'; box.style.display='block'; return }
    if(!amount || amount<=0){ box.textContent='Ingresá un monto válido.'; box.style.display='block'; return }
    let attachment_url = null
    if(comprobanteFinanzas){
      const path = `${Date.now()}_${comprobanteFinanzas.name}`
      const { error: upErr } = await supabase.storage.from('finance-attachments').upload(path, comprobanteFinanzas)
      if(upErr){ box.textContent='No se pudo subir el comprobante: '+upErr.message; box.style.display='block'; return }
      const { data: pub } = supabase.storage.from('finance-attachments').getPublicUrl(path)
      attachment_url = pub.publicUrl
    }
    const { error } = await supabase.from('finance_entries').insert({ category_id, type: finTipoSel, amount, entry_date, description: description||null, attachment_url, canal: finCanalSel, created_by: session?.user?.id||null })
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    adminData = null; render()
  }
  const btnExportarFinCsv = document.querySelector('#btn_exportar_finanzas_csv')
  if(btnExportarFinCsv) btnExportarFinCsv.onclick = ()=>{
    descargarCSV('finanzas_nomades.csv', [
      {label:'Fecha', value:'entry_date'}, {label:'Tipo', value:m=>m.type==='expense'?'Gasto':'Ingreso'},
      {label:'Categoría', value:m=>categoriaMap[m.category_id]?.name||''},
      {label:'Descripción', value:'description'}, {label:'Monto', value:'amount'}
    ], movimientosFinanzas)
  }
  const btnReporteVentasPdf = document.querySelector('#btn_reporte_ventas_pdf')
  if(btnReporteVentasPdf) btnReporteVentasPdf.onclick = ()=>{
    const desde = prompt('¿Desde qué fecha? (formato AAAA-MM-DD, vacío = últimos 30 días)') || ''
    if(desde && !/^\d{4}-\d{2}-\d{2}$/.test(desde)){ mostrarAlerta('Fecha inválida. Usá el formato 2026-08-01.'); return }
    const hasta = desde ? (prompt('¿Hasta qué fecha? (vacío = hoy)') || '') : ''
    if(hasta && !/^\d{4}-\d{2}-\d{2}$/.test(hasta)){ mostrarAlerta('Fecha inválida. Usá el formato 2026-08-31.'); return }
    documentoReporteVentas(desde||null, hasta||null)
  }
  animarContadores()
}

// ============ PEDIDO TELEFÓNICO ============
let telState = null

function telReset(){
  telState = {
    quienAtiende: null,      // { user_id, full_name }
    staffLista: [],
    dni: '',
    cliente: null,           // respuesta de telefono_buscar_cliente
    altaForm: null,          // datos del alta rápida cuando el DNI no existe
    catalogo: [],
    planes: [],
    carritoProductos: {},    // product_id -> cantidad
    preciosManuales: {},     // product_id -> precio escrito a mano
    carritoHuevos: {},       // egg_quantity -> cantidad
    ultimoPedido: null,      // lo que pidió la vez pasada
    tipoCliente: 'minorista',
    entregaElegida: null,    // order_id de una entrega ya programada
    fechaNueva: '',          // fecha elegida para un pedido suelto
    fechasZona: [],
    urgente: false,
    bonificarEnvio: false,
    motivoBonificacion: '',
    preparador: '',
    categoria: null,
    resultado: null,
    cargando: false
  }
}

function telTotalProductos(){
  return Object.entries(telState.carritoProductos).reduce((sum,[id,q])=>{
    if(!q) return sum
    const p = telState.catalogo.find(x=>x.id===id)
    if(!p) return sum
    const manual = Number(telState.preciosManuales[id])
    return sum + (manual > 0 ? manual : Number(p.price)) * q
  }, 0)
}

function telTotalHuevos(){
  return Object.entries(telState.carritoHuevos).reduce((sum,[id,q])=>{
    if(!q) return sum
    const pl = telState.planes.find(x=>String(x.id)===String(id))
    return sum + (pl ? Number(pl.price) : 0) * q
  }, 0)
}

function telCantidadHuevos(){
  return Object.entries(telState.carritoHuevos).reduce((sum,[id,q])=>{
    const pl = telState.planes.find(x=>String(x.id)===String(id))
    return sum + (pl ? Number(pl.egg_quantity) : 0) * (q||0)
  }, 0)
}

function telEsEntregaProgramada(){
  if(!telState.entregaElegida) return false
  const e = (telState.cliente?.entregas_programadas||[]).find(x=>x.id===telState.entregaElegida)
  return !!(e && e.channel !== 'phone')
}

function telCalcularEnvio(){
  const subtotal = telTotalProductos() + telTotalHuevos()
  const minimo = Number(telConfig.free_shipping_min || 80000)
  const costo = Number(telConfig.shipping_cost || 6000)
  if(telState.urgente) return { costo, motivo: 'Entrega urgente fuera de la ruta' }
  if(telEsEntregaProgramada()) return { costo: 0, motivo: 'Se suma a una entrega ya programada' }
  if(subtotal >= minimo) return { costo: 0, motivo: 'Superó el mínimo de envío gratis' }
  return { costo, motivo: 'No llega al mínimo', falta: minimo - subtotal }
}

let telConfig = { shipping_cost: 6000, free_shipping_min: 80000 }

async function telefonico(){
  if(!telState) telReset()

  if(!telState.staffLista.length){
    const [{ data: staffRaw }, { data: cfgRaw }] = await Promise.all([
      supabase.rpc('staff_telefonicos', {}),
      supabase.from('farm_settings').select('key,value').in('key',['shipping_cost','free_shipping_min'])
    ])
    telState.staffLista = staffRaw || []
    const cfg = Object.fromEntries((cfgRaw||[]).map(x=>[x.key,x.value]))
    telConfig = { shipping_cost: Number(cfg.shipping_cost||6000), free_shipping_min: Number(cfg.free_shipping_min||80000) }
  }

  // --- Paso 0: quién atiende ---
  if(!telState.quienAtiende){
    layout(`<h2>📞 Pedido telefónico</h2>
      <div class="card">
        <h3>¿Quién está atendiendo?</h3>
        <p class="muted" style="margin-bottom:12px">Queda registrado en el pedido. Solo aparecen las personas habilitadas como personal telefónico.</p>
        ${telState.staffLista.length
          ? telState.staffLista.map(s=>`<button class="btn ghost" data-quien="${s.user_id}" data-nombre="${(s.full_name||'').replace(/"/g,'&quot;')}" style="width:100%;text-align:left;margin-bottom:8px;display:flex;align-items:center;gap:10px">${pAvatar(s.full_name,32)}<span>${s.full_name||'(sin nombre)'}</span></button>`).join('')
          : '<div class="alert warning">Todavía no hay nadie habilitado como personal telefónico. Andá a Administración → Gestión de personal y marcá el rol.</div>'}
      </div>`)
    document.querySelectorAll('[data-quien]').forEach(b=>b.onclick=()=>{
      telState.quienAtiende = { user_id: b.dataset.quien, full_name: b.dataset.nombre }
      render()
    })
    return
  }

  // --- Resultado final ---
  if(telState.resultado){
    const r = telState.resultado
    layout(`<h2>📞 Pedido telefónico</h2>
      <div class="card">
        <h3>✅ Pedido cargado</h3>
        <div class="row"><span>Entrega</span><span><b>${formatearFecha(r.delivery_date)}</b></span></div>
        ${r.huevos?`<div class="row"><span>Huevos</span><span>${r.huevos} · $${Number(r.monto_huevos).toLocaleString('es-AR')}</span></div>`:''}
        ${r.monto_productos?`<div class="row"><span>Productos</span><span>$${Number(r.monto_productos).toLocaleString('es-AR')}</span></div>`:''}
        <div class="row"><span>Envío</span><span>${r.envio_bonificado?`<s>$${Number(r.envio_calculado).toLocaleString('es-AR')}</s> bonificado`:`$${Number(r.envio).toLocaleString('es-AR')}`}</span></div>
        <div class="row"><span><b>Total</b></span><span><b>$${Number(r.total).toLocaleString('es-AR')}</b></span></div>
        <p class="muted" style="margin-top:10px">Tomado por ${telState.quienAtiende.full_name}. ${r.motivo_envio||''}</p>
        ${(r.avisos||[]).length?`<div class="alert warning" style="margin-top:10px">⚠️ ${r.avisos.join('<br>')}</div>`:''}
      </div>
      <button class="btn primary" id="tel_otro" style="width:100%">📞 Cargar otro pedido</button>`)
    document.querySelector('#tel_otro').onclick = ()=>{ const q = telState.quienAtiende, l = telState.staffLista; telReset(); telState.quienAtiende=q; telState.staffLista=l; render() }
    return
  }

  // --- Paso 1: buscar cliente ---
  if(!telState.cliente){
    layout(`<h2>📞 Pedido telefónico</h2>
      <div class="card" style="padding:10px 14px;display:flex;align-items:center;gap:10px">
        ${pAvatar(telState.quienAtiende.full_name,32)}
        <span style="flex:1;font-size:13px">Atiende <b>${telState.quienAtiende.full_name}</b></span>
        <button class="btn ghost" id="tel_cambiar_quien" style="font-size:12px;padding:6px 10px">Cambiar</button>
      </div>
      <div class="card">
        <h3>Buscar cliente</h3>
        <div class="field"><label>DNI</label><input id="tel_dni" inputmode="numeric" placeholder="Sin puntos" value="${telState.dni}"/></div>
        <div id="tel_err_dni" class="alert danger" style="display:none"></div>
        <button class="btn primary" id="tel_buscar" style="width:100%">Buscar</button>
      </div>
      ${telState.altaForm ? telAltaFormHtml() : ''}`)
    document.querySelector('#tel_cambiar_quien').onclick = ()=>{ telState.quienAtiende=null; render() }
    document.querySelector('#tel_buscar').onclick = async ()=>{
      const dni = document.querySelector('#tel_dni').value.trim()
      const box = document.querySelector('#tel_err_dni')
      if(!/^(\d{7,8}|\d{11})$/.test(dni)){ box.textContent='Ingresá DNI (7 u 8 números) o CUIT (11), sin puntos.'; box.style.display='block'; return }
      telState.dni = dni
      const { data, error } = await supabase.rpc('telefono_buscar_cliente', { p_dni: dni })
      if(error || !data?.ok){ box.textContent='No se pudo buscar: '+(data?.error||error?.message||''); box.style.display='block'; return }
      if(!data.found){
        telState.altaForm = { first_name:'', last_name:'', phone:'', street:'', street_number:'', neighborhood:'', zone:'', city:'Rosario', province:'Santa Fe' }
        render(); return
      }
      telState.cliente = data
      const { data: ult } = await supabase.rpc('ultimo_pedido_cliente', { p_dni: dni, p_customer_id: data.customer.id })
      telState.ultimoPedido = ult?.hay ? ult : null
      await telCargarCatalogo()
      render()
    }
    if(telState.altaForm) telBindAlta()
    return
  }

  // --- Paso 2: armar el pedido ---
  const c = telState.cliente.customer
  const rank = telState.cliente.ranking || {}
  const entregas = telState.cliente.entregas_programadas || []
  const envio = telCalcularEnvio()
  const subtotal = telTotalProductos() + telTotalHuevos()
  const total = subtotal + (telState.bonificarEnvio ? 0 : envio.costo)
  const categorias = CATEGORIAS_CATALOGO.filter(cat=>telState.catalogo.some(p=>p.category===cat))
  const productosFiltrados = telState.categoria ? telState.catalogo.filter(p=>p.category===telState.categoria) : telState.catalogo

  layout(`<h2>📞 Pedido telefónico</h2>
    <div class="card" style="padding:10px 14px;display:flex;align-items:center;gap:10px">
      ${pAvatar(telState.quienAtiende.full_name,32)}
      <span style="flex:1;font-size:13px">Atiende <b>${telState.quienAtiende.full_name}</b></span>
      <button class="btn ghost" id="tel_reiniciar" style="font-size:12px;padding:6px 10px">Otro cliente</button>
    </div>

    <div class="card">
      <div style="display:flex;align-items:center;gap:10px">
        ${pAvatar(c.first_name,40)}
        <div style="flex:1">
          <div style="font-weight:700;color:#2F4D2A">${c.first_name||''} ${c.last_name||''}</div>
          <div class="muted" style="font-size:12px">📞 ${c.phone||'-'} · ${c.street||''} ${c.street_number||''} · ${c.neighborhood||'-'}</div>
        </div>
      </div>
      ${telState.ultimoPedido ? `<div style="background:${NOM.superficie};border:1px solid ${NOM.borde};border-left:3px solid ${NOM.verde};border-radius:0 12px 12px 0;padding:12px;margin-top:11px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:11px">
          <div style="flex:1;min-width:0">
            <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">Lo de siempre</div>
            <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:3px;line-height:1.4">${[
              ...((telState.ultimoPedido.plan_breakdown)||[]).map(b=>`${b.qty} ${b.grade?(GRADO_LABEL[b.grade]||b.grade).toLowerCase():`maple de ${b.size}`}`),
              ...((telState.ultimoPedido.productos)||[]).map(p=>`${p.cantidad} ${p.nombre.toLowerCase()}`)
            ].join(' · ')}</div>
          </div>
          <button class="btn primary" id="tel_lo_de_siempre" style="padding:9px 14px;font-size:12.5px;flex-shrink:0">Cargar</button>
        </div>
      </div>`:''}

      <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">
        ${rank.found?pPill(`Puesto ${rank.puesto} de ${rank.total_clientes}`, rank.es_top?'#EAF0DC':'#F5EFE0', '#2F4D2A'):''}
        ${rank.found?pPill(`$${Number(rank.total_gastado||0).toLocaleString('es-AR')} gastados`):''}
        ${rank.es_top?pPill('⭐ Cliente top','#2F4D2A','#F5EFE0'):''}
      </div>
    </div>

    <div class="card">
      <h3>¿A qué entrega va?</h3>
      ${entregas.length?entregas.map(e=>`
        <button class="btn ${telState.entregaElegida===e.id?'primary':'ghost'}" data-tel-entrega="${e.id}" style="width:100%;text-align:left;margin-bottom:8px">
          ${formatearFecha(e.delivery_date)}${e.cierra_pronto?' ⏰ cierra pronto':''}${e.channel==='phone'?' · telefónico':''}
        </button>`).join('')
      :'<p class="muted">Este cliente no tiene entregas programadas.</p>'}
      <button class="btn ${telState.entregaElegida===null&&telState.fechaNueva?'primary':'ghost'}" id="tel_nueva_fecha" style="width:100%;text-align:left">📅 Entrega nueva${telState.fechaNueva?': '+formatearFecha(telState.fechaNueva):''}</button>
      ${telState.entregaElegida===null?`
        <div style="margin-top:10px">
          ${telState.fechasZona.length?`<p class="muted" style="font-size:12px;margin-bottom:6px">Días en que el reparto ya pasa por su zona:</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">${telState.fechasZona.map(f=>`<button class="btn ${telState.fechaNueva===f?'primary':'ghost'}" data-tel-fecha="${f}" style="font-size:12px;padding:6px 10px">${new Date(f+'T00:00:00').toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short'})}</button>`).join('')}</div>`:''}
          <div class="field"><label>O elegí otra fecha</label><input type="date" id="tel_fecha_manual" value="${telState.fechaNueva||''}"/></div>
          <label style="display:flex;align-items:center;gap:10px;font-size:14px"><input type="checkbox" id="tel_urgente" ${telState.urgente?'checked':''} style="width:18px;height:18px"/> Es urgente, fuera de la ruta</label>
        </div>`:''}
    </div>

    <div class="card">
      <h3>🥚 Huevos</h3>
      ${telState.planes.map(pl=>{
        const cargado = (telState.carritoHuevos[pl.id]||0) > 0
        const porHuevo = pl.egg_quantity ? Math.round(Number(pl.price)/pl.egg_quantity) : 0
        return `<div style="background:${NOM.superficie};border:1px solid ${NOM.borde};${cargado?`border-left:3px solid ${NOM.verde};border-radius:0 12px 12px 0`:'border-radius:12px'};padding:11px;margin-bottom:7px;display:flex;justify-content:space-between;align-items:center;gap:11px">
          <div style="flex:1;min-width:0">
            <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">${pl.nombre || `Maple de ${pl.egg_quantity} huevos`}</div>
            <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">${pl.peso?`${pl.peso} · `:''}maple de ${pl.egg_quantity} · $${Number(pl.price).toLocaleString('es-AR')}</div>
            ${porHuevo?`<div style="font-size:11px;color:${NOM.verde};margin-top:2px">$${porHuevo.toLocaleString('es-AR')} por huevo</div>`:''}
          </div>
          <span style="display:flex;align-items:center;gap:7px;flex-shrink:0">
            <button data-tel-huevo-menos="${pl.id}" style="width:30px;height:30px;border-radius:8px;background:${NOM.fondo};color:${NOM.verde};border:none;font-size:16px;font-weight:600">−</button>
            <b style="min-width:18px;text-align:center">${telState.carritoHuevos[pl.id]||0}</b>
            <button data-tel-huevo-mas="${pl.id}" style="width:30px;height:30px;border-radius:8px;background:${NOM.verde};color:#F5EFE0;border:none;font-size:16px;font-weight:600">+</button>
          </span>
        </div>`
      }).join('')}
    </div>

    <div class="card">
      <h3>🛒 Productos</h3>
      ${categorias.length?`<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:8px">
        <button class="btn ${telState.categoria===null?'primary':'ghost'}" data-tel-cat="" style="font-size:12px;padding:6px 12px;white-space:nowrap">Todas</button>
        ${categorias.map(cat=>`<button class="btn ${telState.categoria===cat?'primary':'ghost'}" data-tel-cat="${cat}" style="font-size:12px;padding:6px 12px;white-space:nowrap">${cat}</button>`).join('')}
      </div>`:''}
      ${productosFiltrados.length?productosFiltrados.map(p=>{
        const q = telState.carritoProductos[p.id]||0
        const sinStock = p.stock!==null && p.stock!==undefined && p.stock<=0
        return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #F0EADB">
          ${p.photo_url?`<img src="${p.photo_url}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0"/>`:`<div style="width:40px;height:40px;border-radius:8px;background:#F5EFE0;display:flex;align-items:center;justify-content:center">🛒</div>`}
          <div style="flex:1;min-width:0">
            <div style="font-size:14px;color:#2F4D2A">${p.name}</div>
            <div class="muted" style="font-size:12px">$${Number(p.price).toLocaleString('es-AR')} · ${p.unit_label||''}${sinStock?' · sin stock':(p.stock!==null&&p.stock!==undefined?` · quedan ${p.stock}`:'')}</div>
          </div>
          <span style="display:flex;align-items:center;gap:6px">
            <button data-tel-menos="${p.id}" style="width:28px;height:28px;border-radius:7px;background:#F5EFE0;color:#2F4D2A;border:none;font-size:15px;font-weight:700">−</button>
            <b style="min-width:14px;text-align:center">${q}</b>
            <button data-tel-mas="${p.id}" data-stock="${p.stock===null||p.stock===undefined?'':p.stock}" style="width:28px;height:28px;border-radius:7px;background:${sinStock?'#C9C4B4':'#2F4D2A'};color:#F5EFE0;border:none;font-size:15px;font-weight:700">+</button>
          </span>
        </div>
        ${q>0?`<div class="field" style="margin:6px 0 10px"><label style="font-size:12px">Precio pactado por teléfono (opcional)</label><input type="number" data-tel-precio="${p.id}" value="${telState.preciosManuales[p.id]||''}" placeholder="Dejalo vacío para usar $${Number(p.price).toLocaleString('es-AR')}"/></div>`:''}`
      }).join(''):'<p class="muted">No hay productos en el catálogo.</p>'}
    </div>

    <div class="card">
      <h3>Resumen</h3>
      ${telCantidadHuevos()?`<div class="row"><span>Huevos (${telCantidadHuevos()})</span><span>$${telTotalHuevos().toLocaleString('es-AR')}</span></div>`:''}
      ${telTotalProductos()?`<div class="row"><span>Productos</span><span>$${telTotalProductos().toLocaleString('es-AR')}</span></div>`:''}
      <div class="row"><span>Envío<br><small class="muted">${envio.motivo}</small></span><span>${telState.bonificarEnvio?`<s>$${envio.costo.toLocaleString('es-AR')}</s> $0`:`$${envio.costo.toLocaleString('es-AR')}`}</span></div>
      ${envio.falta?`<div class="alert warning" style="margin-top:6px">Le faltan $${envio.falta.toLocaleString('es-AR')} para el envío gratis</div>`:''}
      <div class="row"><span><b>Total</b></span><span><b>$${total.toLocaleString('es-AR')}</b></span></div>
      ${envio.costo>0?`
        <label style="display:flex;align-items:center;gap:10px;font-size:14px;margin-top:10px"><input type="checkbox" id="tel_bonificar" ${telState.bonificarEnvio?'checked':''} style="width:18px;height:18px"/> Bonificar el envío</label>
        ${telState.bonificarEnvio?`<div class="field" style="margin-top:8px"><label>Motivo</label><input id="tel_motivo" value="${telState.motivoBonificacion}" placeholder="${rank.es_top?'Cliente top '+rank.corte_top:'Ej: cliente frecuente'}"/></div>`:''}
      `:''}
      <div class="field" style="margin-top:10px"><label>Asignar preparador (opcional)</label>
        <select id="tel_preparador"><option value="">Elegir después</option>${(telState.preparadores||[]).map(p=>`<option value="${p.user_id}" ${telState.preparador===p.user_id?'selected':''}>${p.full_name||'(sin nombre)'}</option>`).join('')}</select>
      </div>
      <div id="tel_err" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="tel_confirmar" style="width:100%;margin-top:10px" ${telState.cargando?'disabled':''}>${telState.cargando?'Guardando…':'✅ Confirmar y enviar a preparación'}</button>
    </div>`)

  const btnTelSiempre = document.querySelector('#tel_lo_de_siempre')
  if(btnTelSiempre) btnTelSiempre.onclick = ()=>{
    const u = telState.ultimoPedido
    if(!u) return
    telState.carritoProductos = {}
    telState.carritoHuevos = telState.carritoHuevos || {}
    ;(u.productos||[]).forEach(p=>{ telState.carritoProductos[p.product_id] = p.cantidad })
    ;(u.plan_breakdown||[]).forEach(b=>{
      const clave = b.plan_id || (telState.planes.find(x=>Number(x.egg_quantity)===Number(b.size))||{}).id
      if(clave) telState.carritoHuevos[clave] = (telState.carritoHuevos[clave]||0) + b.qty
    })
    mostrarAlerta('Cargamos lo mismo del pedido anterior. Revisá y ajustá lo que haga falta.')
    render()
  }
  document.querySelector('#tel_reiniciar').onclick = ()=>{ const q=telState.quienAtiende, l=telState.staffLista; telReset(); telState.quienAtiende=q; telState.staffLista=l; render() }
  document.querySelectorAll('[data-tel-entrega]').forEach(b=>b.onclick=()=>{ telState.entregaElegida=b.dataset.telEntrega; telState.fechaNueva=''; telState.urgente=false; render() })
  document.querySelector('#tel_nueva_fecha').onclick = async ()=>{
    telState.entregaElegida = null
    if(!telState.fechasZona.length){
      const { data } = await supabase.rpc('telefono_fechas_zona', { p_customer_id: c.id })
      telState.fechasZona = data?.fechas || []
    }
    render()
  }
  document.querySelectorAll('[data-tel-fecha]').forEach(b=>b.onclick=()=>{ telState.fechaNueva=b.dataset.telFecha; render() })
  const fechaManual = document.querySelector('#tel_fecha_manual')
  if(fechaManual) fechaManual.onchange = ()=>{ telState.fechaNueva = fechaManual.value; render() }
  const urgenteChk = document.querySelector('#tel_urgente')
  if(urgenteChk) urgenteChk.onchange = ()=>{ telState.urgente = urgenteChk.checked; render() }
  document.querySelectorAll('[data-tel-huevo-mas]').forEach(b=>b.onclick=()=>{ const k=b.dataset.telHuevoMas; telState.carritoHuevos[k]=(telState.carritoHuevos[k]||0)+1; render() })
  document.querySelectorAll('[data-tel-huevo-menos]').forEach(b=>b.onclick=()=>{ const k=b.dataset.telHuevoMenos; if(telState.carritoHuevos[k]>0) telState.carritoHuevos[k]--; render() })
  document.querySelectorAll('[data-tel-cat]').forEach(b=>b.onclick=()=>{ telState.categoria = b.dataset.telCat || null; render() })
  document.querySelectorAll('[data-tel-mas]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.telMas
    const max = b.dataset.stock===''?null:Number(b.dataset.stock)
    const actual = telState.carritoProductos[id]||0
    if(max!==null && actual>=max){ mostrarAlerta('No queda más stock de este producto.'); return }
    telState.carritoProductos[id]=actual+1; render()
  })
  document.querySelectorAll('[data-tel-menos]').forEach(b=>b.onclick=()=>{ const id=b.dataset.telMenos; if(telState.carritoProductos[id]>0) telState.carritoProductos[id]--; render() })
  document.querySelectorAll('[data-tel-precio]').forEach(el=>el.onchange=()=>{ telState.preciosManuales[el.dataset.telPrecio] = el.value })
  const bonif = document.querySelector('#tel_bonificar')
  if(bonif) bonif.onchange = ()=>{ telState.bonificarEnvio = bonif.checked; render() }
  const motivo = document.querySelector('#tel_motivo')
  if(motivo) motivo.oninput = ()=>{ telState.motivoBonificacion = motivo.value }
  const prep = document.querySelector('#tel_preparador')
  if(prep) prep.onchange = ()=>{ telState.preparador = prep.value }

  document.querySelector('#tel_confirmar').onclick = async ()=>{
    const box = document.querySelector('#tel_err')
    box.style.display='none'
    if(telCantidadHuevos()<=0 && telTotalProductos()<=0){ box.textContent='El pedido está vacío.'; box.style.display='block'; return }
    if(!telState.entregaElegida && !telState.fechaNueva){ box.textContent='Elegí a qué entrega va el pedido.'; box.style.display='block'; return }
    if(telState.bonificarEnvio && !telState.motivoBonificacion.trim()){ box.textContent='Escribí el motivo de la bonificación.'; box.style.display='block'; return }

    const eggs = Object.entries(telState.carritoHuevos).filter(([,q])=>q>0).map(([planId,qty])=>{
      const pl = telState.planes.find(x=>String(x.id)===String(planId)) || {}
      return { size: Number(pl.egg_quantity||0), qty, grade: pl.grade || null, plan_id: planId }
    })
    const items = Object.entries(telState.carritoProductos).filter(([,q])=>q>0).map(([product_id,qty])=>({
      product_id, qty, price_override: telState.preciosManuales[product_id] || ''
    }))

    telState.cargando = true; render()
    const { data, error } = await supabase.rpc('telefono_tomar_pedido', {
      p_customer_id: c.id,
      p_target_order_id: telState.entregaElegida,
      p_delivery_date: telState.entregaElegida ? null : telState.fechaNueva,
      p_eggs: eggs,
      p_items: items,
      p_taken_by_staff: telState.quienAtiende.user_id,
      p_taken_by_name: telState.quienAtiende.full_name,
      p_urgent: telState.urgente,
      p_waive_shipping: telState.bonificarEnvio,
      p_waive_reason: telState.motivoBonificacion,
      p_assigned_preparer: telState.preparador || null
    })
    telState.cargando = false
    if(error || !data?.ok){
      render()
      const box2 = document.querySelector('#tel_err')
      if(box2){ box2.textContent = 'No se pudo cargar: '+(data?.error||error?.message||''); box2.style.display='block' }
      return
    }
    telState.resultado = data
    render()
  }
}

async function telCargarCatalogo(){
  const idCliente = telState.cliente?.customer?.id || null
  const [{ data: cat }, { data: preps }] = await Promise.all([
    supabase.rpc('telefono_catalogo', { p_customer_id: idCliente }),
    supabase.from('staff_roles').select('user_id,full_name,role,roles').or('role.eq.preparador,roles.cs.{preparador}')
  ])
  telState.catalogo = cat?.catalogo || []
  telState.planes = cat?.planes || []
  telState.tipoCliente = cat?.tipo_cliente || 'minorista'
  telState.preparadores = preps || []
}

function telAltaFormHtml(){
  const a = telState.altaForm
  return `<div class="card">
    <h3>Cliente nuevo</h3>
    <p class="muted" style="margin-bottom:10px">Ese DNI no está registrado. Cargá los datos y seguimos con el pedido.</p>
    <div class="grid two">
      <div class="field"><label>Nombre *</label><input id="ta_first_name" value="${a.first_name}"/></div>
      <div class="field"><label>Apellido</label><input id="ta_last_name" value="${a.last_name}"/></div>
    </div>
    <div class="field"><label>Teléfono *</label><input id="ta_phone" inputmode="tel" value="${a.phone}"/></div>
    <div class="grid two">
      <div class="field"><label>Calle *</label><input id="ta_street" value="${a.street}"/></div>
      <div class="field"><label>Número *</label><input id="ta_street_number" value="${a.street_number}"/></div>
    </div>
    <div class="field"><label>Barrio *</label><input id="ta_neighborhood" value="${a.neighborhood}"/></div>
    <div class="field"><label>Zona *</label>
      <div class="grid two">${ZONAS.map(z=>`<button type="button" class="btn ${a.zone===z.value?'primary':'ghost'}" data-ta-zone="${z.value}">${z.label}</button>`).join('')}</div>
    </div>
    <div class="grid two">
      <div class="field"><label>Localidad</label><input id="ta_city" value="${a.city}"/></div>
      <div class="field"><label>Provincia</label><input id="ta_province" value="${a.province}"/></div>
    </div>
    <div id="ta_err" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="ta_guardar" style="width:100%">Registrar y seguir</button>
  </div>`
}

function telBindAlta(){
  const map = { ta_first_name:'first_name', ta_last_name:'last_name', ta_phone:'phone', ta_street:'street', ta_street_number:'street_number', ta_neighborhood:'neighborhood', ta_city:'city', ta_province:'province' }
  Object.entries(map).forEach(([id,key])=>{
    const el = document.querySelector('#'+id)
    if(el) el.oninput = ()=> telState.altaForm[key] = el.value
  })
  document.querySelectorAll('[data-ta-zone]').forEach(b=>b.onclick=()=>{ telState.altaForm.zone = b.dataset.taZone; render() })
  document.querySelector('#ta_guardar').onclick = async ()=>{
    const a = telState.altaForm
    const box = document.querySelector('#ta_err')
    if(!a.first_name.trim() || !a.phone.trim() || !a.street.trim() || !a.street_number.trim() || !a.neighborhood.trim() || !a.zone){
      box.textContent='Completá nombre, teléfono, dirección, barrio y zona.'; box.style.display='block'; return
    }
    const { data, error } = await supabase.rpc('telefono_registrar_cliente', { p_customer: { ...a, dni: telState.dni } })
    if(error || !data?.ok){ box.textContent='No se pudo registrar: '+(data?.error||error?.message||''); box.style.display='block'; return }
    if(data.customer_id && !data.ya_existia){
      const v = await ubicarClienteNuevo(data.customer_id, a, null)
      if(v && v.estado !== 'confirmado') mostrarAlerta(`Cliente registrado. Ojo: no pudimos ubicar bien la dirección (${v.motivo.toLowerCase()}). Quedó pendiente en el mapa del panel.`)
    }
    const { data: buscado } = await supabase.rpc('telefono_buscar_cliente', { p_dni: telState.dni })
    if(buscado?.found){ telState.cliente = buscado; telState.altaForm = null; await telCargarCatalogo() }
    render()
  }
}

// ============ MOTOR DE DOCUMENTOS IMPRIMIBLES ============
// Abre una ventana limpia con membrete, numeración y solo el contenido del documento.
// El usuario elige "Guardar como PDF" desde el diálogo de impresión del celular.

async function datosEmpresa(){
  const { data } = await supabase.from('farm_settings').select('key,value')
    .in('key',['empresa_nombre','empresa_direccion','empresa_telefono','empresa_email','empresa_cuit'])
  const cfg = Object.fromEntries((data||[]).map(x=>[x.key,x.value]))
  return {
    nombre: cfg.empresa_nombre || 'NÓMADES',
    direccion: cfg.empresa_direccion || '',
    telefono: cfg.empresa_telefono || '',
    email: cfg.empresa_email || '',
    cuit: cfg.empresa_cuit || ''
  }
}

async function numeroDocumento(tipo){
  const { data } = await supabase.rpc('siguiente_numero_documento', { p_doc_type: tipo })
  return data || 0
}

function moneda(n){ return '$' + Number(n||0).toLocaleString('es-AR') }

function fechaCorta(f){
  if(!f) return '-'
  const d = new Date(String(f).length<=10 ? f+'T00:00:00' : f)
  return d.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'})
}

function abrirDocumento({ titulo, numero, empresa, subtitulo, cuerpo, pie }){
  const hoy = new Date().toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'})
  const hora = new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${titulo}${numero?' N° '+numero:''} — ${empresa.nombre}</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1F2A1B;background:#FFF;font-size:13px;line-height:1.55}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #2F4D2A;padding-bottom:14px;margin-bottom:18px;gap:16px}
  .marca{font-size:22px;font-weight:800;color:#2F4D2A;letter-spacing:1px}
  .sub{font-size:11px;color:#5F5E5A;margin-top:2px}
  .doc{text-align:right}
  .doc .t{font-size:15px;font-weight:800;color:#2F4D2A;text-transform:uppercase;letter-spacing:0.5px}
  .doc .n{font-size:12px;color:#5F5E5A;margin-top:3px}
  h2{font-size:13px;color:#2F4D2A;margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #E3DCC8;padding-bottom:4px}
  table{width:100%;border-collapse:collapse;margin-bottom:10px}
  th{background:#EAF0DC;color:#2F4D2A;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;padding:7px 8px;text-align:left;border-bottom:1px solid #C9D8B0}
  td{padding:6px 8px;border-bottom:1px solid #F0EADB;font-size:12px}
  .num{text-align:right;white-space:nowrap}
  .tot{background:#2F4D2A;color:#F5EFE0;font-weight:700}
  .tot td{border:none;padding:9px 8px;font-size:13px}
  .box{background:#F7F5EE;border:1px solid #E3DCC8;border-radius:6px;padding:10px 12px;margin-bottom:12px}
  .grid{display:flex;gap:12px;flex-wrap:wrap}
  .grid>div{flex:1;min-width:150px}
  .lbl{font-size:10.5px;color:#5F5E5A;text-transform:uppercase;letter-spacing:0.3px}
  .val{font-size:13px;font-weight:700;color:#2F4D2A}
  .pie{margin-top:24px;border-top:1px solid #E3DCC8;padding-top:10px;font-size:10.5px;color:#5F5E5A}
  .firma{margin-top:34px;display:flex;gap:40px}
  .firma div{flex:1;border-top:1px solid #8A8A80;padding-top:5px;font-size:10.5px;color:#5F5E5A;text-align:center}
  .btns{position:sticky;bottom:0;background:#FFF;padding:14px 0 0;display:flex;gap:8px;border-top:1px solid #E3DCC8;margin-top:20px}
  .btns button{flex:1;padding:12px;font-size:14px;font-weight:600;border:none;border-radius:8px;background:#2F4D2A;color:#F5EFE0}
  .btns button.sec{background:#F5EFE0;color:#2F4D2A;border:1px solid #C9D8B0}
  @media print{.btns{display:none}body{padding:0}}
</style></head><body>
<div class="hdr">
  <div>
    <div class="marca">${empresa.nombre}</div>
    <div class="sub">Huevos de libre pastoreo</div>
    ${empresa.direccion?`<div class="sub">${empresa.direccion}</div>`:''}
    ${empresa.telefono?`<div class="sub">Tel: ${empresa.telefono}</div>`:''}
    ${empresa.email?`<div class="sub">${empresa.email}</div>`:''}
    ${empresa.cuit?`<div class="sub">CUIT: ${empresa.cuit}</div>`:''}
  </div>
  <div class="doc">
    <div class="t">${titulo}</div>
    ${numero?`<div class="n">N° ${String(numero).padStart(6,'0')}</div>`:''}
    <div class="n">${hoy} · ${hora}</div>
  </div>
</div>
${subtitulo||''}
${cuerpo}
<div class="pie">${pie||''}</div>
<div class="btns">
  <button onclick="window.print()">🖨️ Guardar como PDF</button>
  <button class="sec" onclick="window.close()">Cerrar</button>
</div>
</body></html>`

  const w = window.open('', '_blank')
  if(!w){ mostrarAlerta('El navegador bloqueó la ventana. Permitile abrir ventanas emergentes a esta página e intentá de nuevo.'); return }
  w.document.write(html)
  w.document.close()
}

// ---------- Orden de pago a proveedor ----------

async function documentoRemito(orderId){
  const { data } = await supabase.rpc('datos_remito', { p_order_id: orderId })
  if(!data || data.error) return mostrarAlerta('No se pudo armar el remito')
  const numero = await numeroDocumento('remito')
  const c = data.cliente || {}
  const items = data.items || []

  const cuerpo = `
    <div style="display:flex;justify-content:space-between;gap:20px;margin-bottom:18px">
      <div style="flex:1">
        <div style="font-size:10px;letter-spacing:1px;color:#8A8570;margin-bottom:4px">DESTINATARIO</div>
        <div style="font-size:14px;font-weight:600">${c.nombre||''}</div>
        <div style="font-size:12px;color:#5F5E5A;margin-top:3px">${c.direccion||''}</div>
        <div style="font-size:12px;color:#5F5E5A">${c.localidad||''}</div>
        ${c.dni?`<div style="font-size:12px;color:#5F5E5A">DNI/CUIT ${c.dni}</div>`:''}
        ${c.telefono?`<div style="font-size:12px;color:#5F5E5A">Tel ${c.telefono}</div>`:''}
      </div>
      <div style="text-align:right">
        <div style="font-size:10px;letter-spacing:1px;color:#8A8570;margin-bottom:4px">ENTREGA</div>
        <div style="font-size:13px">${data.delivery_date ? new Date(data.delivery_date+'T00:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'}) : ''}</div>
        ${data.order_number?`<div style="font-size:12px;color:#5F5E5A;margin-top:3px">Pedido N° ${data.order_number}</div>`:''}
        ${c.cuenta_corriente?`<div style="font-size:12px;color:#5F5E5A;margin-top:3px">Cuenta corriente${c.dias_plazo?` · ${c.dias_plazo} días`:''}</div>`:''}
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <thead>
        <tr style="border-bottom:1.5px solid #2F4D2A">
          <th style="text-align:left;padding:8px 0;font-size:11px;letter-spacing:0.5px;color:#2F4D2A">DESCRIPCIÓN</th>
          <th style="text-align:right;padding:8px 0;font-size:11px;letter-spacing:0.5px;color:#2F4D2A;width:70px">CANT.</th>
          <th style="text-align:left;padding:8px 0 8px 10px;font-size:11px;letter-spacing:0.5px;color:#2F4D2A;width:80px">UNIDAD</th>
        </tr>
      </thead>
      <tbody>
        ${items.length ? items.map(it=>`<tr style="border-bottom:1px solid #E8E2D3">
          <td style="padding:9px 0;font-size:12.5px">${it.descripcion||''}</td>
          <td style="padding:9px 0;font-size:12.5px;text-align:right;font-weight:600">${it.cantidad||0}</td>
          <td style="padding:9px 0 9px 10px;font-size:12.5px;color:#5F5E5A">${it.unidad||''}</td>
        </tr>`).join('') : '<tr><td colspan="3" style="padding:12px 0;font-size:12px;color:#8A8570">Sin ítems.</td></tr>'}
      </tbody>
    </table>

    ${Number(data.total)>0?`<div style="text-align:right;margin-bottom:20px">
      ${Number(data.envio)>0?`<div style="font-size:12px;color:#5F5E5A;margin-bottom:3px">Envío: $${Number(data.envio).toLocaleString('es-AR')}</div>`:''}
      <div style="font-size:15px;font-weight:600;color:#2F4D2A">Total: $${Number(data.total).toLocaleString('es-AR')}</div>
    </div>`:''}

    <div style="border:1px solid #E8E2D3;border-radius:8px;padding:14px;margin-top:26px">
      <div style="font-size:11px;color:#8A8570;margin-bottom:26px">Recibí conforme la mercadería detallada</div>
      <div style="display:flex;gap:24px">
        <div style="flex:1;border-top:1px solid #8A8570;padding-top:6px;font-size:10.5px;color:#8A8570">Firma</div>
        <div style="flex:1;border-top:1px solid #8A8570;padding-top:6px;font-size:10.5px;color:#8A8570">Aclaración</div>
        <div style="width:110px;border-top:1px solid #8A8570;padding-top:6px;font-size:10.5px;color:#8A8570">DNI</div>
      </div>
    </div>`

  abrirDocumento({
    titulo: 'REMITO',
    numero,
    cuerpo,
    pie: 'Este remito no es factura. Documento no válido como comprobante fiscal.'
  })
}

async function documentoOrdenPago(pago){
  const empresa = await datosEmpresa()
  const numero = await numeroDocumento('orden_pago')
  const metodos = { transfer:'Transferencia bancaria', cash:'Efectivo', mp:'Billetera virtual' }
  const cuerpo = `
    <div class="box"><div class="grid">
      <div><div class="lbl">Proveedor</div><div class="val">${pago.supplier_name||'-'}</div></div>
      <div><div class="lbl">Fecha de pago</div><div class="val">${fechaCorta(pago.paid_at)}</div></div>
      <div><div class="lbl">Forma de pago</div><div class="val">${metodos[pago.payment_method]||pago.payment_method||'-'}</div></div>
    </div></div>
    <h2>Comprobantes cancelados</h2>
    <table>
      <tr><th>Pedido</th><th class="num">Importe imputado</th></tr>
      ${(pago.imputaciones||[]).map(i=>`<tr><td>N° ${i.order_number||'-'}</td><td class="num">${moneda(i.amount)}</td></tr>`).join('')}
      <tr class="tot"><td>TOTAL PAGADO</td><td class="num">${moneda(pago.total)}</td></tr>
    </table>
    <div class="firma"><div>Firma y aclaración — ${empresa.nombre}</div><div>Recibí conforme — ${pago.supplier_name||'Proveedor'}</div></div>`
  abrirDocumento({
    titulo: 'Orden de pago', numero, empresa, cuerpo,
    pie: `Registrado por ${pago.registrado_por||'-'}. Documento generado automáticamente por el sistema de gestión de ${empresa.nombre}.`
  })
}

// ---------- Estado de cuenta de proveedor ----------
async function documentoEstadoCuenta(supplierId){
  const { data, error } = await supabase.rpc('admin_estado_cuenta_proveedor', { p_supplier_id: supplierId })
  if(error || !data || data.error){ mostrarAlerta('No se pudo generar: '+(data?.error||error?.message||'')); return }
  const empresa = await datosEmpresa()
  const numero = await numeroDocumento('estado_cuenta')
  let acumulado = 0
  const filas = (data.movimientos||[]).map(m=>{
    acumulado += Number(m.debe||0) - Number(m.haber||0)
    return `<tr>
      <td>${fechaCorta(m.fecha)}</td><td>${m.detalle||''}</td>
      <td class="num">${Number(m.debe)>0?moneda(m.debe):''}</td>
      <td class="num">${Number(m.haber)>0?moneda(m.haber):''}</td>
      <td class="num">${moneda(acumulado)}</td>
    </tr>`
  }).join('')
  const cuerpo = `
    <div class="box"><div class="grid">
      <div><div class="lbl">Proveedor</div><div class="val">${data.supplier?.name||'-'}</div></div>
      ${data.supplier?.contact_phone?`<div><div class="lbl">Teléfono</div><div class="val">${data.supplier.contact_phone}</div></div>`:''}
    </div></div>
    <h2>Movimientos</h2>
    <table>
      <tr><th>Fecha</th><th>Detalle</th><th class="num">Debe</th><th class="num">Haber</th><th class="num">Saldo</th></tr>
      ${filas || '<tr><td colspan="5">Sin movimientos registrados.</td></tr>'}
      <tr class="tot"><td colspan="4">SALDO ADEUDADO</td><td class="num">${moneda(data.saldo)}</td></tr>
    </table>
    ${Number(data.saldo_a_favor)>0?`<div class="box">Saldo a favor pendiente de aplicar: <b>${moneda(data.saldo_a_favor)}</b></div>`:''}
    <div class="grid" style="margin-top:14px">
      <div class="box"><div class="lbl">Total comprado</div><div class="val">${moneda(data.total_comprado)}</div></div>
      <div class="box"><div class="lbl">Total pagado</div><div class="val">${moneda(data.total_pagado)}</div></div>
    </div>`
  abrirDocumento({ titulo: 'Estado de cuenta', numero, empresa, cuerpo,
    pie: 'Ante cualquier diferencia, comunicate con nosotros antes de la fecha de vencimiento.' })
}

// ---------- Reporte de ventas ----------
async function documentoReporteVentas(desde, hasta){
  const { data, error } = await supabase.rpc('finance_dashboard', { p_from: desde || null, p_to: hasta || null })
  if(error || !data || data.error){ mostrarAlerta('No se pudo generar: '+(data?.error||error?.message||'')); return }
  const empresa = await datosEmpresa()
  const numero = await numeroDocumento('reporte_ventas')
  const pct = (parte)=> Number(data.ventas)>0 ? Math.round(Number(parte)/Number(data.ventas)*100)+'%' : '-'
  const cuerpo = `
    <div class="box"><div class="grid">
      <div><div class="lbl">Período</div><div class="val">${fechaCorta(data.desde)} al ${fechaCorta(data.hasta)}</div></div>
    </div></div>
    <h2>Resultado del período</h2>
    <table>
      <tr><th>Concepto</th><th class="num">Importe</th></tr>
      <tr><td>Ventas</td><td class="num">${moneda(data.ventas)}</td></tr>
      <tr><td>Gastos</td><td class="num">${moneda(data.gastos)}</td></tr>
      <tr><td>Pérdidas</td><td class="num">${moneda(data.perdidas)}</td></tr>
      <tr class="tot"><td>GANANCIA</td><td class="num">${moneda(data.beneficio_neto)}</td></tr>
    </table>
    <h2>Ventas por canal</h2>
    <table>
      <tr><th>Canal</th><th class="num">Importe</th><th class="num">Part.</th></tr>
      <tr><td>Minoristas</td><td class="num">${moneda(data.ventas_minorista)}</td><td class="num">${pct(data.ventas_minorista)}</td></tr>
      <tr><td>Mayoristas</td><td class="num">${moneda(data.ventas_mayorista)}</td><td class="num">${pct(data.ventas_mayorista)}</td></tr>
      <tr><td>Pedidos telefónicos</td><td class="num">${moneda(data.ventas_telefonico)}</td><td class="num">${pct(data.ventas_telefonico)}</td></tr>
    </table>
    <h2>Ventas por línea</h2>
    <table>
      <tr><th>Línea</th><th class="num">Importe</th><th class="num">Part.</th></tr>
      <tr><td>Huevos propios</td><td class="num">${moneda(data.ventas_huevos)}</td><td class="num">${pct(data.ventas_huevos)}</td></tr>
      <tr><td>Almacén de reventa</td><td class="num">${moneda(data.ventas_almacen)}</td><td class="num">${pct(data.ventas_almacen)}</td></tr>
      <tr><td>Envíos cobrados</td><td class="num">${moneda(data.ventas_envio)}</td><td class="num">${pct(data.ventas_envio)}</td></tr>
    </table>
    <h2>Situación financiera</h2>
    <table>
      <tr><th>Concepto</th><th class="num">Importe</th></tr>
      <tr><td>Cobrado en el período</td><td class="num">${moneda(data.cobrado)}</td></tr>
      <tr><td>Pagado en el período</td><td class="num">${moneda(Number(data.pagado_proveedores||0)+Number(data.pagado_otros||0))}</td></tr>
      <tr><td>Caja acumulada</td><td class="num">${moneda(data.caja)}</td></tr>
      <tr><td>Nos deben</td><td class="num">${moneda(data.me_deben)}</td></tr>
      <tr><td>Debemos a proveedores</td><td class="num">${moneda(data.debo)}</td></tr>
    </table>`
  abrirDocumento({ titulo: 'Reporte de ventas', numero, empresa, cuerpo,
    pie: 'El resultado se calcula por devengado: la mercadería se imputa al gasto el día que ingresa, no el día que se paga.' })
}

// ---------- Padrón de clientes ----------
async function documentoPadronClientes(filtroTipo){
  const { data, error } = await supabase.rpc('admin_padron_clientes', {})
  if(error || !data || data.error){ mostrarAlerta('No se pudo generar: '+(data?.error||error?.message||'')); return }
  const lista = filtroTipo ? data.filter(c=>c.tipo===filtroTipo) : data
  const empresa = await datosEmpresa()
  const numero = await numeroDocumento('padron_clientes')
  const totalComprado = lista.reduce((s,c)=>s+Number(c.total_comprado||0),0)
  const cuerpo = `
    <div class="box"><div class="grid">
      <div><div class="lbl">Clientes listados</div><div class="val">${lista.length}</div></div>
      <div><div class="lbl">Tipo</div><div class="val">${filtroTipo==='mayorista'?'Mayoristas':filtroTipo==='minorista'?'Minoristas':'Todos'}</div></div>
      <div><div class="lbl">Facturado histórico</div><div class="val">${moneda(totalComprado)}</div></div>
    </div></div>
    <table>
      <tr><th>Cliente</th><th>Contacto</th><th>Dirección</th><th>Plan</th><th class="num">Entregas</th><th class="num">Comprado</th></tr>
      ${lista.map(c=>`<tr>
        <td><b>${c.apellido||''}, ${c.nombre||''}</b><br><span style="color:#5F5E5A;font-size:11px">DNI ${c.dni||'-'} · ${c.tipo}</span></td>
        <td>${c.telefono||'-'}<br><span style="color:#5F5E5A;font-size:11px">${c.email||''}</span></td>
        <td>${c.direccion||'-'}<br><span style="color:#5F5E5A;font-size:11px">${c.barrio||''} ${c.zona?'· '+c.zona:''}</span></td>
        <td>${c.plan||'—'}</td>
        <td class="num">${c.entregas||0}</td>
        <td class="num">${moneda(c.total_comprado)}</td>
      </tr>`).join('') || '<tr><td colspan="6">Sin clientes.</td></tr>'}
    </table>`
  abrirDocumento({ titulo: 'Padrón de clientes', numero, empresa, cuerpo,
    pie: 'Documento de uso interno. Contiene datos personales: no compartir fuera de la empresa.' })
}


// ---------- Orden de compra al productor de huevos ----------
async function documentoPedidoHuevos(pedido){
  const empresa = await datosEmpresa()
  const numero = await numeroDocumento('orden_compra')
  const huevos = Number(pedido.huevos||0)
  const total = Number(pedido.total||0)
  const cuerpo = `
    <div class="box"><div class="grid">
      <div><div class="lbl">Productor</div><div class="val">${pedido.supplier_name||'-'}</div></div>
      <div><div class="lbl">Modalidad</div><div class="val">${pedido.delivery_type==='retiro'?'Lo pasamos a retirar':'Nos lo entregan'}</div></div>
    </div></div>
    <h2>Detalle del pedido</h2>
    <table>
      <tr><th>Concepto</th><th class="num">Cantidad</th><th class="num">Precio unitario</th><th class="num">Importe</th></tr>
      <tr><td>Huevos</td><td class="num">${huevos.toLocaleString('es-AR')}</td><td class="num">${total&&huevos?moneda(Math.round(total/huevos*100)/100):'a convenir'}</td><td class="num">${total?moneda(total):'a convenir'}</td></tr>
      <tr class="tot"><td colspan="3">TOTAL</td><td class="num">${total?moneda(total):'a convenir'}</td></tr>
    </table>
    <div class="box">Al recibir la mercadería se controla cantidad y estado. Cualquier diferencia se ajusta antes de emitir el pago.</div>
    <div class="firma"><div>Solicita — ${empresa.nombre}</div><div>Conforme — ${pedido.supplier_name||'Productor'}</div></div>`
  abrirDocumento({ titulo:'Orden de compra', numero, empresa, cuerpo,
    pie:`Pedido interno N° ${pedido.order_number||'-'}. Ante dudas, comunicate con ${empresa.telefono||'nosotros'}.` })
}





// ============ COPIA DE SEGURIDAD ============
async function copiaSeguridad(){
  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_backup" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">Copia de seguridad</h2>
  </div>
  <div class="card">
    <p class="muted" style="margin-bottom:12px">Descargá una copia de todos tus datos. Guardala en tu correo o en la nube. Si algún día se borra algo por error, se puede recuperar desde acá.</p>
    <p class="muted" style="font-size:12px;margin-bottom:14px">Conviene hacerlo una vez por semana, o antes de cualquier cambio grande.</p>
    <div id="estado_backup"></div>
    <button class="btn primary" id="btn_generar_backup" style="width:100%">Generar copia de seguridad</button>
  </div>`)

  document.querySelector('#btn_volver_backup').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
  document.querySelector('#btn_generar_backup').onclick = async ()=>{
    const btn = document.querySelector('#btn_generar_backup')
    const est = document.querySelector('#estado_backup')
    btn.disabled = true
    btn.textContent = 'Generando…'

    const tablas = ['customers','subscriptions','orders','payments','customer_product_interest',
      'catalog_products','inventory_lots','suppliers','supplier_orders','supplier_order_payments',
      'supplier_credits','production','finance_entries','finance_categories','plan_prices',
      'staff_roles','farm_settings','mermas','price_changes','reviews','customer_credits','payment_links']

    const copia = { generado_el: new Date().toISOString(), version: 1, datos: {} }
    let fallaron = []

    for(const t of tablas){
      est.innerHTML = `<p class="muted" style="font-size:12px;margin-bottom:10px">Leyendo ${t}…</p>`
      const { data, error } = await supabase.from(t).select('*')
      if(error){ fallaron.push(t); continue }
      copia.datos[t] = data || []
    }

    const total = Object.values(copia.datos).reduce((s,arr)=>s+arr.length,0)
    const blob = new Blob([JSON.stringify(copia, null, 2)], { type:'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const hoy = new Date().toISOString().slice(0,10)
    a.href = url
    a.download = `nomades-copia-${hoy}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(()=>URL.revokeObjectURL(url), 2000)

    btn.disabled = false
    btn.textContent = 'Generar copia de seguridad'
    est.innerHTML = `<div class="alert info" style="margin-bottom:12px">
      Copia lista: <b>${total.toLocaleString('es-AR')} registros</b> de ${Object.keys(copia.datos).length} tablas.
      ${fallaron.length?`<br><small>No se pudieron leer: ${fallaron.join(', ')}</small>`:''}
      <br><small>Se descargó como nomades-copia-${hoy}.json. Mandátela por correo para tenerla fuera del teléfono.</small>
    </div>`
  }
}



async function condicionesComerciales(customerId){
  const { data: c } = await supabase.from('customers')
    .select('id,first_name,last_name,customer_type,cuenta_corriente,dias_plazo,limite_credito,recepcion_desde,recepcion_hasta,recepcion_dias,recepcion_nota,compra_minima')
    .eq('id', customerId).single()
  if(!c) return mostrarAlerta('No se pudo cargar el cliente')

  let cc = !!c.cuenta_corriente
  let dias = new Set(c.recepcion_dias || [])
  const DIAS = [[2,'Lun'],[3,'Mar'],[4,'Mié'],[5,'Jue'],[6,'Vie'],[7,'Sáb'],[1,'Dom']]

  const dibujar = ()=>{
    layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <button class="btn ghost" id="btn_volver_cond" style="padding:6px 12px">← Volver</button>
      <h2 style="margin:0">Condiciones</h2>
    </div>
    <div class="card">
      <p class="muted" style="margin:0 0 12px">${c.first_name||''} ${c.last_name||''}</p>

      <div class="field"><label>¿Le vendés a cuenta corriente?</label>
        <div class="grid two">
          <button type="button" class="btn ${!cc?'primary':'ghost'}" data-cc="0">Paga al recibir</button>
          <button type="button" class="btn ${cc?'primary':'ghost'}" data-cc="1">A plazo</button>
        </div>
      </div>

      ${cc?`<div class="grid two">
        <div class="field"><label>Días de plazo</label><input id="cond_dias" type="number" inputmode="numeric" min="0" value="${c.dias_plazo||30}"/></div>
        <div class="field"><label>Límite de crédito</label><input id="cond_limite" type="number" inputmode="numeric" placeholder="Sin límite" value="${c.limite_credito||''}"/></div>
      </div>
      <div class="alert info" style="font-size:12px">Con límite, el sistema te avisa cuando un cliente lo supera.</div>`:''}

      <div class="field" style="margin-top:14px"><label>¿Qué días recibe mercadería?</label>
        <div class="grid three">
          ${DIAS.map(([v,l])=>`<button type="button" class="btn ${dias.has(v)?'primary':'ghost'}" data-dia-rec="${v}">${l}</button>`).join('')}
        </div>
        <p class="muted" style="font-size:11.5px;margin:6px 0 0">Si no marcás ninguno, recibe cualquier día.</p>
      </div>

      <div class="grid two">
        <div class="field"><label>Desde</label><input id="cond_desde" type="time" value="${c.recepcion_desde?String(c.recepcion_desde).slice(0,5):''}"/></div>
        <div class="field"><label>Hasta</label><input id="cond_hasta" type="time" value="${c.recepcion_hasta?String(c.recepcion_hasta).slice(0,5):''}"/></div>
      </div>

      <div class="field"><label>Nota para el repartidor</label><input id="cond_nota" placeholder="Ej: entrar por el portón de atrás" value="${c.recepcion_nota||''}"/></div>
      <div class="field"><label>Compra mínima</label><input id="cond_minima" type="number" inputmode="numeric" placeholder="Sin mínimo" value="${c.compra_minima||''}"/></div>

      <div id="err_cond" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_guardar_cond" style="width:100%">Guardar condiciones</button>
    </div>`)

    document.querySelector('#btn_volver_cond').onclick = ()=>{ current='clientes'; render() }
    document.querySelectorAll('[data-cc]').forEach(b=>b.onclick=()=>{ cc = b.dataset.cc==='1'; dibujar() })
    document.querySelectorAll('[data-dia-rec]').forEach(b=>b.onclick=()=>{
      const v = Number(b.dataset.diaRec)
      if(dias.has(v)) dias.delete(v); else dias.add(v)
      dibujar()
    })
    document.querySelector('#btn_guardar_cond').onclick = async ()=>{
      const box = document.querySelector('#err_cond')
      const desde = document.querySelector('#cond_desde').value
      const hasta = document.querySelector('#cond_hasta').value
      const limite = document.querySelector('#cond_limite')
      const { data, error } = await supabase.rpc('admin_guardar_condiciones', {
        p_customer_id: customerId,
        p_cuenta_corriente: cc,
        p_dias_plazo: cc ? Number(document.querySelector('#cond_dias').value)||0 : 0,
        p_limite_credito: limite && limite.value ? Number(limite.value) : null,
        p_recepcion_desde: desde || null,
        p_recepcion_hasta: hasta || null,
        p_recepcion_dias: dias.size ? Array.from(dias) : null,
        p_recepcion_nota: document.querySelector('#cond_nota').value.trim() || null,
        p_compra_minima: document.querySelector('#cond_minima').value ? Number(document.querySelector('#cond_minima').value) : null
      })
      if(error || !data?.ok){ box.textContent='No se pudo guardar: '+(data?.error||error?.message||''); box.style.display='block'; return }
      mostrarAlerta('Condiciones guardadas.')
      current='clientes'; render()
    }
  }
  dibujar()
}





// ============ GASTOS QUE CARGÓ EL EQUIPO ============
async function gastosEquipo(){
  const [{ data: gRaw }, { data: rRaw }] = await Promise.all([
    supabase.rpc('admin_gastos_equipo', {}),
    supabase.rpc('admin_reintegros_pendientes', {})
  ])
  const g = gRaw || {}
  const r = rRaw || {}
  const gastos = g.gastos || []
  const personas = r.personas || []

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_gastos_eq" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">Gastos del equipo</h2>
  </div>

  <div class="grid two" style="margin-bottom:12px">
    <div class="card" style="margin:0">
      <div style="font-size:11px;color:${NOM.tintaSuave}">Cargaron este mes</div>
      <div style="font-size:22px;font-weight:500;font-variant-numeric:tabular-nums">$${Number(g.total||0).toLocaleString('es-AR')}</div>
    </div>
    <div class="card" style="margin:0">
      <div style="font-size:11px;color:${NOM.tintaSuave}">Les debés</div>
      <div style="font-size:22px;font-weight:500;color:${Number(r.total||0)>0?NOM.ambar:NOM.tinta};font-variant-numeric:tabular-nums">$${Number(r.total||0).toLocaleString('es-AR')}</div>
    </div>
  </div>

  ${personas.length?`<div class="card">
    <h3>Pendiente de reintegro</h3>
    ${personas.map(p=>`<div style="border-bottom:1px solid ${NOM.borde};padding:11px 0">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div>
          <div style="font-size:14px;font-weight:500;color:${NOM.tinta}">${p.nombre}</div>
          <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">${p.cantidad} gasto(s) · el más viejo del ${formatearFecha(p.mas_viejo)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:16px;font-weight:500;color:${NOM.ambar};font-variant-numeric:tabular-nums">$${Number(p.total).toLocaleString('es-AR')}</div>
        </div>
      </div>
      <button class="btn ghost" data-reintegrar="${p.staff_id}" data-nombre="${p.nombre}" data-monto="${p.total}" style="width:100%;margin-top:9px">Ya se lo devolví</button>
    </div>`).join('')}
  </div>`:''}

  <div class="card">
    <h3>Últimos gastos cargados</h3>
    ${gastos.length ? gastos.map(x=>`<div style="border-bottom:1px solid ${NOM.borde};padding:11px 0">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div style="flex:1;min-width:0">
          <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">${x.categoria||'Sin categoría'}</div>
          <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">${x.quien} · ${formatearFecha(x.fecha)}</div>
          ${x.descripcion?`<div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">${x.descripcion}</div>`:''}
          <div style="margin-top:5px;display:flex;gap:6px;align-items:center;flex-wrap:wrap">
            ${x.pagado_por==='personal'
              ? (x.reintegrado ? pPill('Ya reintegrado','#EAF0DC','#2F4D2A') : pPill('Le debés','#FBE9D4','#B8641E'))
              : pPill('Caja de la empresa','#F1EFE8','#5F5E5A')}
            ${x.comprobante?`<a href="${x.comprobante}" target="_blank" style="font-size:11.5px;color:${NOM.verde}">Ver ticket</a>`:''}
          </div>
        </div>
        <div style="font-size:15px;font-weight:500;font-variant-numeric:tabular-nums">$${Number(x.monto).toLocaleString('es-AR')}</div>
      </div>
    </div>`).join('') : estadoVacio('Todavía no cargaron gastos.')}
  </div>`)

  document.querySelector('#btn_volver_gastos_eq').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
  document.querySelectorAll('[data-reintegrar]').forEach(b=>b.onclick=async()=>{
    const ok = await mostrarConfirmacion(`¿Ya le devolviste $${Number(b.dataset.monto).toLocaleString('es-AR')} a ${b.dataset.nombre}?`)
    if(!ok) return
    const { data, error } = await supabase.rpc('admin_marcar_reintegrado', { p_staff_id: b.dataset.reintegrar, p_gasto_id: null })
    if(error || !data?.ok){ mostrarAlerta('No se pudo registrar.'); return }
    mostrarAlerta(`Listo. Se marcaron ${data.cantidad} gasto(s) por $${Number(data.monto).toLocaleString('es-AR')}.`)
    render()
  })
}

// ============ EL EQUIPO CARGA UN GASTO ============
async function cargarGasto(){
  const { data: catsRaw } = await supabase.from('finance_categories')
    .select('id,name,type').eq('active', true).in('type',['variable','fixed']).order('name')
  const categorias = catsRaw || []

  let catSel = ''
  let pagadoPor = 'empresa'
  let comprobante = null
  let enviando = false

  const dibujar = ()=>{
    layout(`<h2>Cargar un gasto</h2>
    <div class="card">
      <p class="muted" style="margin:0 0 14px;font-size:12.5px">Peaje, lavado, un arreglo. Todo lo que gastes trabajando.</p>

      <div class="field"><label>¿Para qué fue? *</label>
        <div class="grid two">
          ${categorias.map(c=>`<button type="button" class="btn ${catSel===c.name?'primary':'ghost'}" data-gasto-cat="${c.name}" style="font-size:12.5px;padding:11px 8px">${c.name}</button>`).join('')}
        </div>
        <input id="gasto_cat_otra" placeholder="O escribilo acá si no está en la lista" style="margin-top:8px" value="${catSel && !categorias.some(c=>c.name===catSel) ? catSel : ''}"/>
      </div>

      <div class="field"><label>¿Cuánto gastaste? *</label><input id="gasto_monto" type="number" inputmode="numeric" placeholder="0"/></div>

      <div class="field"><label>¿Quién puso la plata? *</label>
        <button type="button" class="btn ${pagadoPor==='empresa'?'primary':'ghost'}" data-gasto-quien="empresa" style="width:100%;text-align:left;padding:12px 14px;margin-bottom:8px">
          <div style="font-size:13.5px;font-weight:500">La empresa</div>
          <div style="font-size:11.5px;opacity:0.75;margin-top:2px">Caja chica o tarjeta del negocio</div>
        </button>
        <button type="button" class="btn ${pagadoPor==='personal'?'primary':'ghost'}" data-gasto-quien="personal" style="width:100%;text-align:left;padding:12px 14px">
          <div style="font-size:13.5px;font-weight:500">La puse yo</div>
          <div style="font-size:11.5px;opacity:0.75;margin-top:2px">Te lo tienen que reintegrar</div>
        </button>
      </div>

      <div class="field"><label>Detalle (opcional)</label><input id="gasto_desc" placeholder="Ej: peaje de la autopista"/></div>
      <div class="field"><label>Foto del ticket</label><input type="file" id="gasto_comprobante" accept="image/*"/></div>

      ${pagadoPor==='personal'?`<div style="background:#FBE9D4;border-radius:11px;padding:12px;margin-bottom:12px">
        <div style="font-size:12.5px;color:${NOM.ambar};line-height:1.5">Va a quedar anotado que te deben esta plata hasta que te la devuelvan.</div>
      </div>`:''}

      <div id="err_gasto" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_guardar_gasto" style="width:100%" ${enviando?'disabled':''}>${enviando?'Guardando…':'Guardar gasto'}</button>
    </div>`)

    document.querySelectorAll('[data-gasto-cat]').forEach(b=>b.onclick=()=>{
      catSel = b.dataset.gastoCat
      const otra = document.querySelector('#gasto_cat_otra')
      if(otra) otra.value = ''
      dibujar()
    })
    document.querySelectorAll('[data-gasto-quien]').forEach(b=>b.onclick=()=>{ pagadoPor = b.dataset.gastoQuien; dibujar() })
    const inpComp = document.querySelector('#gasto_comprobante')
    if(inpComp) inpComp.onchange = (e)=>{ comprobante = e.target.files[0]||null }

    document.querySelector('#btn_guardar_gasto').onclick = async ()=>{
      const box = document.querySelector('#err_gasto')
      const otra = document.querySelector('#gasto_cat_otra').value.trim()
      const categoria = otra || catSel
      const monto = Number(document.querySelector('#gasto_monto').value)

      if(!categoria){ box.textContent='Elegí o escribí para qué fue el gasto.'; box.style.display='block'; return }
      if(!monto || monto<=0){ box.textContent='Poné cuánto gastaste.'; box.style.display='block'; return }

      enviando = true; dibujar()
      let url = null
      if(comprobante){
        const path = `gastos/${Date.now()}.${(comprobante.name.split('.').pop()||'jpg')}`
        const { error: upErr } = await supabase.storage.from('finance-attachments').upload(path, comprobante)
        if(!upErr){ const { data: pub } = supabase.storage.from('finance-attachments').getPublicUrl(path); url = pub.publicUrl }
      }

      const { data, error } = await supabase.rpc('registrar_gasto_equipo', {
        p_categoria: categoria, p_monto: monto,
        p_descripcion: document.querySelector('#gasto_desc').value.trim() || null,
        p_pagado_por: pagadoPor, p_comprobante_url: url, p_canal: 'compartido'
      })

      enviando = false
      if(error || !data?.ok){
        dibujar()
        const b2 = document.querySelector('#err_gasto')
        if(b2){ b2.textContent = data?.error || 'No se pudo guardar. Probá de nuevo.'; b2.style.display='block' }
        return
      }

      mostrarAlerta(data.hay_que_reintegrar
        ? `Gasto guardado.\n\nQuedó anotado que te deben $${monto.toLocaleString('es-AR')}.`
        : 'Gasto guardado.')
      current = myRole==='repartidor' ? 'repartidor' : 'admin'
      render()
    }
  }
  dibujar()
}

// ============ COMERCIOS QUE DEJARON DE PEDIR ============
async function mayoristasEnRiesgo(){
  const { data } = await supabase.rpc('admin_mayoristas_en_riesgo', {})
  const d = data || {}
  const lista = d.comercios || []

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_mayr" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">Comercios que se enfrían</h2>
  </div>

  <div class="card" style="margin-bottom:12px">
    <div style="font-size:11px;color:${NOM.tintaSuave}">Facturación mensual en juego</div>
    <div style="font-size:26px;font-weight:500;color:${Number(d.plata_en_juego||0)>0?NOM.ambar:NOM.tinta};font-variant-numeric:tabular-nums">$${Number(d.plata_en_juego||0).toLocaleString('es-AR')}</div>
    <p class="muted" style="font-size:12px;margin:6px 0 0">Es lo que dejás de facturar por mes si no recuperás a estos comercios.</p>
  </div>

  ${lista.length ? lista.map(x=>{
    const perdido = x.nivel==='perdido'
    const tel = (x.telefono||'').replace(/\D/g,'')
    const msg = encodeURIComponent(`Hola! Te escribimos de NÓMADES. Hace ${x.dias} días que no pasamos por el local y queríamos saber si necesitás reponer. Decinos cuánto y te lo llevamos en la próxima vuelta.`)
    return pCard(`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div style="flex:1;min-width:0">
          <div style="font-weight:500">${x.nombre||''}</div>
          <div style="font-size:12px;color:${NOM.tintaSuave}">${x.barrio||'-'} · ${x.entregas} entrega(s)</div>
          <div style="font-size:12px;color:${perdido?NOM.rojo:NOM.ambar};margin-top:3px">Hace ${x.dias} días que no pide</div>
          ${Number(x.debe||0)>0?`<div style="font-size:12px;color:${NOM.rojo};margin-top:3px">Además te debe $${Number(x.debe).toLocaleString('es-AR')}</div>`:''}
        </div>
        <div style="text-align:right">
          <div style="font-size:11px;color:${NOM.tintaSuave}">valía por mes</div>
          <div style="font-weight:500;font-variant-numeric:tabular-nums">$${Number(x.valor_mensual||0).toLocaleString('es-AR')}</div>
          <div style="margin-top:5px">${pPill(perdido?'Perdido':'Se enfría', perdido?'#FCEBEB':'#FBE9D4', perdido?'#A32D2D':'#B8641E')}</div>
        </div>
      </div>
      ${tel?`<a href="https://wa.me/54${tel}?text=${msg}" target="_blank" class="btn ghost" style="display:block;text-align:center;text-decoration:none;margin-top:10px;padding:11px 0;font-size:12.5px">Escribirle</a>`:''}
    `, perdido?'border-color:rgba(176,58,46,0.25)':'')
  }).join('') : estadoVacio('Todos los comercios están comprando con normalidad.')}`)

  document.querySelector('#btn_volver_mayr').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
}

// ============ ALTA DE COMERCIO EN LA CALLE ============
async function altaComercio(){
  const { data: planesRaw } = await supabase.from('plan_prices')
    .select('id,egg_quantity,price,grade,unidad').eq('active', true).eq('customer_type','mayorista').order('egg_quantity')
  const planes = ordenarPorGrado(planesRaw)
  const { data: prodRaw } = await supabase.from('catalog_products')
    .select('id,name,photo_url,unit_label,price,wholesale_price').eq('active', true).order('name')
  const productos = (prodRaw||[]).map(p=>({ ...p, precio: p.wholesale_price || p.price }))

  const f = { first_name:'', dni:'', phone:'', street:'', street_number:'', neighborhood:'', zone:'', recepcion_nota:'', cuenta_corriente:false, dias_plazo:0, nota:'', condicion_iva:'' }
  const carrito = {}
  const carritoProd = {}
  let paso = 1
  let enviando = false

  const totalHuevos = ()=>Object.entries(carrito).reduce((s,[id,n])=>{ const pl=planes.find(p=>p.id===id); return s+(pl?Number(pl.egg_quantity):0)*n }, 0)
  const totalPrecio = ()=>Object.entries(carrito).reduce((s,[id,n])=>{ const pl=planes.find(p=>p.id===id); return s+(pl?Number(pl.price):0)*n }, 0)
  const totalProd = ()=>Object.entries(carritoProd).reduce((s,[id,n])=>{ const p=productos.find(x=>x.id===id); return s+(p?Number(p.precio):0)*n }, 0)

  const dibujar = ()=>{
    layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <button class="btn ghost" id="btn_volver_alta" style="padding:6px 12px">← Volver</button>
      <h2 style="margin:0">Nuevo comercio</h2>
    </div>

    ${paso===1?`<div class="card">
      <p class="muted" style="margin:0 0 12px">Datos del comercio</p>
      <div class="field"><label>Nombre del comercio *</label><input id="ac_nombre" value="${f.first_name}" placeholder="Ej: Almacén Don Pedro"/></div>
      <div class="field"><label>DNI o CUIT *</label><input id="ac_dni" inputmode="numeric" value="${f.dni}" placeholder="Sin puntos ni guiones"/></div>
      <div class="field"><label>Teléfono *</label><input id="ac_phone" inputmode="tel" value="${f.phone}"/></div>
      <div class="field"><label>Condición ante el IVA</label>
        <div class="grid three">
          ${CONDICIONES_IVA.map(x=>`<button type="button" class="btn ${f.condicion_iva===x.value?'primary':'ghost'}" data-ac-iva="${x.value}" style="font-size:11.5px;padding:11px 5px">${x.label}</button>`).join('')}
        </div>
      </div>
      <div class="grid two">
        <div class="field"><label>Calle</label><input id="ac_street" value="${f.street}"/></div>
        <div class="field"><label>Número</label><input id="ac_num" value="${f.street_number}"/></div>
      </div>
      <div class="field"><label>Barrio</label><input id="ac_barrio" value="${f.neighborhood}"/></div>
      <div class="field"><label>Zona *</label>
        <div class="grid two">${ZONAS.map(z=>`<button type="button" class="btn ${f.zone===z.value?'primary':'ghost'}" data-ac-zona="${z.value}">${z.label}</button>`).join('')}</div>
      </div>
      <div class="field"><label>¿Cuándo recibe?</label><input id="ac_recepcion" value="${f.recepcion_nota}" placeholder="Ej: martes y viernes de 8 a 11"/></div>
      <div class="field"><label>¿Le vendés a plazo?</label>
        <div class="grid two">
          <button type="button" class="btn ${!f.cuenta_corriente?'primary':'ghost'}" data-ac-cc="0">Paga al recibir</button>
          <button type="button" class="btn ${f.cuenta_corriente?'primary':'ghost'}" data-ac-cc="1">A plazo</button>
        </div>
      </div>
      ${f.cuenta_corriente?`<div class="field"><label>Días de plazo</label><input id="ac_dias" type="number" inputmode="numeric" value="${f.dias_plazo||30}"/></div>`:''}
      <div class="field"><label>Nota de la visita</label><input id="ac_nota" value="${f.nota}" placeholder="Ej: quiere probar con poco al principio"/></div>
      <div id="err_ac" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_ac_siguiente" style="width:100%">Siguiente</button>
    </div>`:`
    <div class="card">
      <h3>Primer pedido</h3>
      <p class="muted" style="font-size:12.5px;margin:0 0 10px">Si todavía no quiere pedir, dejalo en cero y lo damos de alta igual.</p>
      ${planes.length?planes.map(pl=>{
        const cargado = (carrito[pl.id]||0) > 0
        return `<div style="background:${NOM.superficie};border:1px solid ${NOM.borde};${cargado?`border-left:3px solid ${NOM.verde};border-radius:0 14px 14px 0`:'border-radius:14px'};padding:11px 12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:11px">
          <div style="flex:1;min-width:0">
            <div style="font-size:13.5px;font-weight:500;color:${NOM.tinta}">${pl.grade?(GRADO_LABEL[pl.grade]||pl.grade):`${pl.egg_quantity} huevos`}</div>
            <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">${GRADO_PESO[pl.grade]?GRADO_PESO[pl.grade]+' · ':''}maple de ${pl.egg_quantity} · $${Number(pl.price).toLocaleString('es-AR')}</div>
          </div>
          <span style="display:flex;align-items:center;gap:8px;flex-shrink:0">
            <button type="button" data-ac-menos="${pl.id}" class="btn ghost" style="padding:7px 13px">−</button>
            <b style="min-width:22px;text-align:center;display:inline-block">${carrito[pl.id]||0}</b>
            <button type="button" data-ac-mas="${pl.id}" class="btn ghost" style="padding:7px 13px">+</button>
          </span>
        </div>`
      }).join(''):'<p class="muted">No hay tamaños mayoristas cargados.</p>'}
    </div>

    ${productos.length?`<div class="card"><h3>Almacén</h3>
      ${productos.map(p=>{
        const cargado = (carritoProd[p.id]||0) > 0
        return `<div style="background:${NOM.superficie};border:1px solid ${NOM.borde};${cargado?`border-left:3px solid ${NOM.verde};border-radius:0 14px 14px 0`:'border-radius:14px'};padding:11px 12px;margin-bottom:8px;display:flex;gap:11px;align-items:center">
          ${p.photo_url?`<img src="${p.photo_url}" alt="" style="width:42px;height:42px;border-radius:9px;object-fit:cover;flex-shrink:0"/>`:`<div style="width:42px;height:42px;border-radius:9px;background:${NOM.verdeClaro};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico('carrito',18,NOM.verde)}</div>`}
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:500;color:${NOM.tinta};line-height:1.3">${p.name}</div>
            <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:2px">$${Number(p.precio).toLocaleString('es-AR')} · ${p.unit_label||'unidad'}</div>
          </div>
          <span style="display:flex;align-items:center;gap:8px;flex-shrink:0">
            <button type="button" data-ac-pmenos="${p.id}" class="btn ghost" style="padding:7px 12px">−</button>
            <b style="min-width:22px;text-align:center;display:inline-block">${carritoProd[p.id]||0}</b>
            <button type="button" data-ac-pmas="${p.id}" class="btn ghost" style="padding:7px 12px">+</button>
          </span>
        </div>`
      }).join('')}
    </div>`:''}

    <div class="card">
      <div class="alert info" style="margin-top:0"><b>${totalHuevos()} huevos</b> · $${(totalPrecio()+totalProd()).toLocaleString('es-AR')}</div>
      <div class="field" style="margin-top:10px"><label>Cada cuánto</label>
        <div class="grid three">${Object.entries(FRECUENCIAS).map(([v,l])=>`<button type="button" class="btn ${f.frequency===v||(!f.frequency&&v==='weekly')?'primary':'ghost'}" data-ac-frec="${v}">${l}</button>`).join('')}</div>
      </div>
      <div id="err_ac2" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_ac_guardar" style="width:100%" ${enviando?'disabled':''}>${enviando?'Guardando…':'Dar de alta'}</button>
      <button class="btn ghost" id="btn_ac_atras" style="width:100%;margin-top:8px">← Atrás</button>
    </div>`}`)

    document.querySelector('#btn_volver_alta').onclick = ()=>{ current = myRole==='vendedor'?'vendedor':'admin'; adminAreaAbierta=null; render() }

    if(paso===1){
      const g = (id)=>document.querySelector(id)?.value.trim()||''
      document.querySelectorAll('[data-ac-iva]').forEach(b=>b.onclick=()=>{
        f.first_name=g('#ac_nombre'); f.dni=g('#ac_dni'); f.phone=g('#ac_phone')
        f.street=g('#ac_street'); f.street_number=g('#ac_num'); f.neighborhood=g('#ac_barrio')
        f.recepcion_nota=g('#ac_recepcion'); f.nota=g('#ac_nota')
        f.condicion_iva = b.dataset.acIva; dibujar()
      })
      document.querySelectorAll('[data-ac-zona]').forEach(b=>b.onclick=()=>{
        f.first_name=g('#ac_nombre'); f.dni=g('#ac_dni'); f.phone=g('#ac_phone')
        f.street=g('#ac_street'); f.street_number=g('#ac_num'); f.neighborhood=g('#ac_barrio')
        f.recepcion_nota=g('#ac_recepcion'); f.nota=g('#ac_nota')
        f.zone=b.dataset.acZona; dibujar()
      })
      document.querySelectorAll('[data-ac-cc]').forEach(b=>b.onclick=()=>{
        f.first_name=g('#ac_nombre'); f.dni=g('#ac_dni'); f.phone=g('#ac_phone')
        f.street=g('#ac_street'); f.street_number=g('#ac_num'); f.neighborhood=g('#ac_barrio')
        f.recepcion_nota=g('#ac_recepcion'); f.nota=g('#ac_nota')
        f.cuenta_corriente = b.dataset.acCc==='1'; dibujar()
      })
      document.querySelector('#btn_ac_siguiente').onclick = ()=>{
        const box = document.querySelector('#err_ac')
        f.first_name=g('#ac_nombre'); f.dni=g('#ac_dni'); f.phone=g('#ac_phone')
        f.street=g('#ac_street'); f.street_number=g('#ac_num'); f.neighborhood=g('#ac_barrio')
        f.recepcion_nota=g('#ac_recepcion'); f.nota=g('#ac_nota')
        const dias = document.querySelector('#ac_dias')
        if(dias) f.dias_plazo = Number(dias.value)||0
        if(!f.first_name){ box.textContent='Ponele el nombre al comercio.'; box.style.display='block'; return }
        if(!/^(\d{7,8}|\d{11})$/.test(f.dni)){ box.textContent='Ingresá DNI (7 u 8 números) o CUIT (11), sin puntos.'; box.style.display='block'; return }
        if(!f.phone){ box.textContent='Falta el teléfono.'; box.style.display='block'; return }
        if(!f.zone){ box.textContent='Elegí la zona.'; box.style.display='block'; return }
        paso = 2; dibujar()
      }
    } else {
      document.querySelectorAll('[data-ac-mas]').forEach(b=>b.onclick=()=>{ const k=b.dataset.acMas; carrito[k]=(carrito[k]||0)+1; dibujar() })
      document.querySelectorAll('[data-ac-menos]').forEach(b=>b.onclick=()=>{ const k=b.dataset.acMenos; if(carrito[k]>0) carrito[k]--; dibujar() })
      document.querySelectorAll('[data-ac-pmas]').forEach(b=>b.onclick=()=>{ const k=b.dataset.acPmas; carritoProd[k]=(carritoProd[k]||0)+1; dibujar() })
      document.querySelectorAll('[data-ac-pmenos]').forEach(b=>b.onclick=()=>{ const k=b.dataset.acPmenos; if(carritoProd[k]>0) carritoProd[k]--; dibujar() })
      document.querySelectorAll('[data-ac-frec]').forEach(b=>b.onclick=()=>{ f.frequency=b.dataset.acFrec; dibujar() })
      document.querySelector('#btn_ac_atras').onclick = ()=>{ paso=1; dibujar() }
      document.querySelector('#btn_ac_guardar').onclick = async ()=>{
        const box = document.querySelector('#err_ac2')
        enviando = true; dibujar()
        const breakdown = Object.entries(carrito).filter(([,q])=>q>0).map(([pid,qty])=>{
          const pl = planes.find(p=>p.id===pid) || {}
          return { size: Number(pl.egg_quantity||30), qty, grade: pl.grade||null, plan_id: pid }
        })
        const prodPayload = Object.entries(carritoProd).filter(([,q])=>q>0).map(([product_id,quantity])=>({ product_id, quantity }))
        const { data, error } = await supabase.rpc('vendedor_alta_comercio', {
          p_customer: { ...f, cuenta_corriente: f.cuenta_corriente, dias_plazo: f.dias_plazo, condicion_iva: f.condicion_iva || null },
          p_subscription: { frequency: f.frequency||'weekly', egg_quantity: totalHuevos(), payment_method: f.cuenta_corriente?'transfer':'cash', plan_breakdown: breakdown, price: totalPrecio() },
          p_productos: prodPayload,
          p_nota: f.nota || null
        })
        enviando = false
        if(error || !data?.ok){
          const b2 = document.querySelector('#err_ac2')
          dibujar()
          const b3 = document.querySelector('#err_ac2')
          if(b3){ b3.textContent = data?.error || error?.message || 'No se pudo dar de alta.'; b3.style.display='block' }
          return
        }
        const vGeo = data.customer_id ? await ubicarClienteNuevo(data.customer_id, f, null) : null
        const avisoGeo = (vGeo && vGeo.estado !== 'confirmado')
          ? `\n\n⚠️ No pudimos ubicar el local en el mapa (${vGeo.motivo.toLowerCase()}). Sin ubicación no entra en la ruta de reparto — avisale a administración.`
          : ''
        mostrarAlerta((data.status==='active'
          ? `Comercio dado de alta.\n\nPrimera entrega: ${formatearFecha(data.next_delivery_date)}`
          : data.status==='waitlist'
            ? 'Comercio dado de alta. Quedó en lista de espera por capacidad.'
            : 'Comercio dado de alta, sin pedido todavía.') + avisoGeo)
        current = myRole==='vendedor'?'vendedor':'clientes'
        render()
      }
    }
  }
  dibujar()
}

// ============ FINANZAS POR CANAL ============
async function finanzasCanales(){
  const hoy = new Date()
  const desde = finCanalDesde || new Date(hoy.getTime() - 29*86400000).toISOString().slice(0,10)
  const hasta = finCanalHasta || hoy.toISOString().slice(0,10)
  const { data } = await supabase.rpc('finance_comparar_canales', { p_from: desde, p_to: hasta })
  const d = data || {}
  const mi = d.minorista || {}
  const ma = d.mayorista || {}

  const bloque = (t, x, color)=>{
    const resultado = Number(x.resultado||0)
    return `<div style="background:${NOM.superficie};border:1px solid ${NOM.borde};border-top:3px solid ${color};border-radius:14px;padding:15px;margin-bottom:11px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px">
        <span style="font-size:16px;font-weight:500;color:${NOM.tinta}">${t}</span>
        <span style="font-size:11.5px;color:${NOM.tintaSuave}">${x.participacion||0}% del total</span>
      </div>

      <div style="font-size:11px;color:${NOM.tintaSuave}">Vendiste</div>
      <div style="font-size:26px;font-weight:500;color:${NOM.tinta};font-variant-numeric:tabular-nums;line-height:1.1">$${Number(x.ventas||0).toLocaleString('es-AR')}</div>
      <div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:4px">
        Huevos $${Number(x.ventas_huevos||0).toLocaleString('es-AR')} · Almacén $${Number(x.ventas_almacen||0).toLocaleString('es-AR')}${Number(x.ventas_envio||0)>0?` · Envío $${Number(x.ventas_envio).toLocaleString('es-AR')}`:''}
      </div>

      <div style="border-top:1px solid ${NOM.borde};margin-top:12px;padding-top:11px">
        <div class="row" style="border:0;padding:4px 0"><span style="font-size:12.5px;color:${NOM.tintaSuave}">Gastos propios</span><span style="font-size:13px;font-variant-numeric:tabular-nums">$${Number(x.gastos_propios||0).toLocaleString('es-AR')}</span></div>
        <div class="row" style="border:0;padding:4px 0"><span style="font-size:12.5px;color:${NOM.tintaSuave}">Parte de los compartidos</span><span style="font-size:13px;font-variant-numeric:tabular-nums">$${Number(x.gastos_compartidos_asignados||0).toLocaleString('es-AR')}</span></div>
        <div class="row" style="border:0;padding:4px 0"><span style="font-size:12.5px;color:${NOM.tintaSuave}">Pérdidas</span><span style="font-size:13px;font-variant-numeric:tabular-nums">$${Number(x.perdidas_asignadas||0).toLocaleString('es-AR')}</span></div>
      </div>

      <div style="background:${resultado>=0?NOM.verdeClaro:'#FCEBEB'};border-radius:11px;padding:12px;margin-top:11px">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <span style="font-size:12.5px;color:${resultado>=0?NOM.tinta:'#A32D2D'};font-weight:500">Te quedó</span>
          <span style="font-size:20px;font-weight:500;color:${resultado>=0?NOM.verde:'#A32D2D'};font-variant-numeric:tabular-nums">$${resultado.toLocaleString('es-AR')}</span>
        </div>
      </div>

      <div class="grid three" style="margin-top:11px;gap:7px">
        <div style="background:${NOM.fondo};border-radius:10px;padding:9px;text-align:center">
          <div style="font-size:15px;font-weight:500;font-variant-numeric:tabular-nums">${x.clientes||0}</div>
          <div style="font-size:10.5px;color:${NOM.tintaSuave}">clientes</div>
        </div>
        <div style="background:${NOM.fondo};border-radius:10px;padding:9px;text-align:center">
          <div style="font-size:15px;font-weight:500;font-variant-numeric:tabular-nums">${x.pedidos||0}</div>
          <div style="font-size:10.5px;color:${NOM.tintaSuave}">pedidos</div>
        </div>
        <div style="background:${NOM.fondo};border-radius:10px;padding:9px;text-align:center">
          <div style="font-size:15px;font-weight:500;font-variant-numeric:tabular-nums">$${Math.round(Number(x.ticket_promedio||0)/1000)}k</div>
          <div style="font-size:10.5px;color:${NOM.tintaSuave}">ticket</div>
        </div>
      </div>

      ${Number(x.me_deben||0)>0?`<div style="margin-top:10px;font-size:12px;color:${NOM.ambar}">Te deben $${Number(x.me_deben).toLocaleString('es-AR')}</div>`:''}
    </div>`
  }

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_fincanal" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">Los dos negocios</h2>
  </div>

  <div class="card" style="padding:12px">
    <div class="grid two">
      <div class="field" style="margin:0"><label style="font-size:11px">Desde</label><input id="fin_c_desde" type="date" value="${desde}"/></div>
      <div class="field" style="margin:0"><label style="font-size:11px">Hasta</label><input id="fin_c_hasta" type="date" value="${hasta}"/></div>
    </div>
    <button class="btn ghost" id="btn_fin_c_aplicar" style="width:100%;margin-top:8px">Ver ese período</button>
  </div>

  ${bloque('Minorista', mi, NOM.verde)}
  ${bloque('Mayorista', ma, NOM.ambar)}

  <div class="card">
    <h3>Cómo se reparten los compartidos</h3>
    <p class="muted" style="font-size:12.5px;line-height:1.55;margin:0">Los gastos que marcaste como compartidos — el almacén, el stock, la nafta — se reparten entre los dos canales según cuánto vendió cada uno. Si el mayorista hizo el ${ma.participacion||0}% de las ventas, se lleva el ${ma.participacion||0}% de esos gastos.</p>
    <p class="muted" style="font-size:12.5px;line-height:1.55;margin:9px 0 0">Cuando cargues un gasto, elegí a qué canal pertenece. Si es solo del mayorista — por ejemplo una furgoneta para reparto grande — marcalo así y no se reparte.</p>
  </div>`)

  document.querySelector('#btn_volver_fincanal').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
  document.querySelector('#btn_fin_c_aplicar').onclick = ()=>{
    finCanalDesde = document.querySelector('#fin_c_desde').value
    finCanalHasta = document.querySelector('#fin_c_hasta').value
    render()
  }
}
let finCanalDesde = null
let finCanalHasta = null

// ============ QUIÉNES TE DEBEN ============
async function deudores(){
  const { data } = await supabase.rpc('admin_deudores', {})
  const d = data || {}
  const lista = d.deudores || []

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_deudores" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">Te deben</h2>
  </div>

  <div class="grid two" style="margin-bottom:12px">
    <div class="card" style="margin:0"><div style="font-size:11px;color:${NOM.tintaSuave}">Total a cobrar</div><div style="font-size:22px;font-weight:500;font-variant-numeric:tabular-nums">$${Number(d.total||0).toLocaleString('es-AR')}</div></div>
    <div class="card" style="margin:0"><div style="font-size:11px;color:${NOM.tintaSuave}">Ya vencido</div><div style="font-size:22px;font-weight:500;color:${Number(d.vencido||0)>0?NOM.rojo:NOM.tinta};font-variant-numeric:tabular-nums">$${Number(d.vencido||0).toLocaleString('es-AR')}</div></div>
  </div>

  ${lista.length ? lista.map(x=>{
    const vencido = Number(x.vencido||0) > 0
    const tel = (x.telefono||'').replace(/\D/g,'')
    return pCard(`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div style="flex:1;min-width:0">
          <div style="font-weight:500">${x.nombre||''}</div>
          <div style="font-size:12px;color:${NOM.tintaSuave}">${x.tipo==='mayorista'?'Mayorista':'Minorista'}${x.dias_plazo?` · ${x.dias_plazo} días de plazo`:' · contra entrega'}</div>
          ${x.dias_antiguedad>0?`<div style="font-size:12px;color:${vencido?NOM.rojo:NOM.tintaSuave};margin-top:3px">Lo más viejo tiene ${x.dias_antiguedad} días</div>`:''}
        </div>
        <div style="text-align:right">
          <div style="font-weight:500;font-variant-numeric:tabular-nums">$${Number(x.deuda||0).toLocaleString('es-AR')}</div>
          ${vencido?`<div style="margin-top:5px">${pPill('$'+Number(x.vencido).toLocaleString('es-AR')+' vencido','#FCEBEB','#A32D2D')}</div>`:''}
        </div>
      </div>
      ${pBtnRow([
        pBtn('','Ver cuenta',`data-ver-cuenta="${x.id}"`,'primary'),
        pBtn('','Registrar cobro',`data-cobrar="${x.id}"`,'ghost'),
        tel?pBtn('','WhatsApp',`data-wpp-deuda="${tel}" data-nombre="${(x.nombre||'').split(' ')[0]}" data-monto="${x.deuda}"`,'ghost'):''
      ].filter(Boolean))}
    `, vencido?'border-color:rgba(176,58,46,0.25)':'')
  }).join('') : estadoVacio('Nadie te debe nada. Todo cobrado.')}`)

  document.querySelector('#btn_volver_deudores').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
  document.querySelectorAll('[data-ver-cuenta]').forEach(b=>b.onclick=()=>cuentaCorrienteCliente(b.dataset.verCuenta))
  document.querySelectorAll('[data-cobrar]').forEach(b=>b.onclick=()=>formularioCobro(b.dataset.cobrar))
  document.querySelectorAll('[data-wpp-deuda]').forEach(b=>b.onclick=()=>{
    const msg = encodeURIComponent(`Hola ${b.dataset.nombre}! Te escribimos de NÓMADES. Tenés un saldo pendiente de $${Number(b.dataset.monto).toLocaleString('es-AR')}. Cuando puedas, avisanos cómo coordinamos el pago. ¡Gracias!`)
    window.open('https://wa.me/54'+b.dataset.wppDeuda+'?text='+msg, '_blank')
  })
}

async function cuentaCorrienteCliente(customerId){
  const { data } = await supabase.rpc('cuenta_corriente_cliente', { p_customer_id: customerId })
  if(!data || data.error) return mostrarAlerta('No se pudo cargar la cuenta')
  const c = data.cliente || {}
  const pedidos = data.pedidos || []

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_cc" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">${c.nombre||''}</h2>
  </div>

  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
      <div>
        <div style="font-size:11px;color:${NOM.tintaSuave}">Debe</div>
        <div style="font-size:26px;font-weight:500;font-variant-numeric:tabular-nums">$${Number(data.deuda_total||0).toLocaleString('es-AR')}</div>
        ${Number(data.deuda_vencida||0)>0?`<div style="font-size:12.5px;color:${NOM.rojo};margin-top:3px">$${Number(data.deuda_vencida).toLocaleString('es-AR')} ya vencido</div>`:''}
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;color:${NOM.tintaSuave}">Condiciones</div>
        <div style="font-size:13px;margin-top:3px">${c.cuenta_corriente?`${c.dias_plazo||0} días`:'Contra entrega'}</div>
        ${data.disponible!==null&&data.disponible!==undefined?`<div style="font-size:12px;color:${NOM.tintaSuave};margin-top:3px">Disponible $${Number(data.disponible).toLocaleString('es-AR')}</div>`:''}
      </div>
    </div>
    <button class="btn primary" id="btn_cobrar_cc" style="width:100%;margin-top:12px">Registrar cobro</button>
  </div>

  <div class="card"><h3>Pendientes de cobro</h3>
    ${pedidos.length ? pedidos.map(p=>`<div class="row">
      <span>Pedido N° ${p.order_number||'-'}<br><small class="muted">Entregado ${formatearFecha(p.delivery_date)}${p.vence?` · vence ${formatearFecha(p.vence)}`:''}</small></span>
      <span style="text-align:right">
        <b style="font-variant-numeric:tabular-nums">$${Number(p.saldo||0).toLocaleString('es-AR')}</b>
        ${p.vencido?`<br>${pPill(p.dias_vencido+' días','#FCEBEB','#A32D2D')}`:''}
      </span>
    </div>`).join('') : '<p class="muted">Sin saldos pendientes.</p>'}
  </div>

  <div class="card"><h3>Últimos pagos</h3>
    ${(data.ultimos_pagos||[]).length ? data.ultimos_pagos.map(p=>`<div class="row">
      <span>${new Date(p.fecha).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'})}<br><small class="muted">${METODOS_PAGO_LABEL[p.metodo]||p.metodo||''}</small></span>
      <b style="font-variant-numeric:tabular-nums">$${Number(p.monto||0).toLocaleString('es-AR')}</b>
    </div>`).join('') : '<p class="muted">Todavía no registró pagos.</p>'}
  </div>`)

  document.querySelector('#btn_volver_cc').onclick = ()=>{ current='deudores'; render() }
  document.querySelector('#btn_cobrar_cc').onclick = ()=>formularioCobro(customerId)
}

async function formularioCobro(customerId){
  const { data } = await supabase.rpc('cuenta_corriente_cliente', { p_customer_id: customerId })
  if(!data || data.error) return mostrarAlerta('No se pudo cargar la cuenta')
  const c = data.cliente || {}
  let metodoSel = 'transfer'
  let comprobante = null

  const dibujar = ()=>{
    layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <button class="btn ghost" id="btn_volver_cobro" style="padding:6px 12px">← Volver</button>
      <h2 style="margin:0">Registrar cobro</h2>
    </div>
    <div class="card">
      <p class="muted" style="margin:0 0 4px">${c.nombre||''}</p>
      <div style="font-size:13px;color:${NOM.tintaSuave}">Debe</div>
      <div style="font-size:24px;font-weight:500;font-variant-numeric:tabular-nums;margin-bottom:12px">$${Number(data.deuda_total||0).toLocaleString('es-AR')}</div>

      <div class="field"><label>Cuánto pagó</label><input id="cobro_monto" type="number" inputmode="numeric" placeholder="0" value="${Number(data.deuda_total||0)}"/></div>
      <div class="field"><label>Con qué pagó</label>
        <div class="grid three">
          ${[['cash','Efectivo'],['transfer','Transferencia'],['mp','Mercado Pago']].map(([v,l])=>`<button type="button" class="btn ${metodoSel===v?'primary':'ghost'}" data-cobro-metodo="${v}">${l}</button>`).join('')}
        </div>
      </div>
      ${metodoSel!=='cash'?`<div class="field"><label>Comprobante (opcional)</label><input type="file" id="cobro_comprobante" accept="image/*"/></div>`:''}
      <div class="field"><label>Nota (opcional)</label><input id="cobro_nota" placeholder="Ej: pagó en el local"/></div>
      <div class="alert info" style="font-size:12px">Se va a imputar del pedido más viejo al más nuevo. Si sobra, queda a favor.</div>
      <div id="err_cobro" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_confirmar_cobro" style="width:100%">Confirmar cobro</button>
    </div>`)

    document.querySelector('#btn_volver_cobro').onclick = ()=>cuentaCorrienteCliente(customerId)
    document.querySelectorAll('[data-cobro-metodo]').forEach(b=>b.onclick=()=>{ metodoSel=b.dataset.cobroMetodo; comprobante=null; dibujar() })
    const inpComp = document.querySelector('#cobro_comprobante')
    if(inpComp) inpComp.onchange = (e)=>{ comprobante = e.target.files[0]||null }

    document.querySelector('#btn_confirmar_cobro').onclick = async ()=>{
      const box = document.querySelector('#err_cobro')
      const monto = Number(document.querySelector('#cobro_monto').value)
      if(!monto || monto<=0){ box.textContent='Ingresá cuánto pagó.'; box.style.display='block'; return }
      let url = null
      if(comprobante){
        const path = `cobros/${customerId}_${Date.now()}.${(comprobante.name.split('.').pop()||'jpg')}`
        const { error: upErr } = await supabase.storage.from('payment-receipts').upload(path, comprobante)
        if(!upErr){ const { data: pub } = supabase.storage.from('payment-receipts').getPublicUrl(path); url = pub.publicUrl }
      }
      const { data: res, error } = await supabase.rpc('cobrar_cliente', {
        p_customer_id: customerId, p_amount: monto, p_method: metodoSel,
        p_receipt_url: url, p_nota: document.querySelector('#cobro_nota').value.trim() || null
      })
      if(error || !res?.ok){ box.textContent='No se pudo registrar: '+(res?.error||error?.message||''); box.style.display='block'; return }
      const cant = (res.aplicados||[]).length
      mostrarAlerta(`Cobro registrado.\n\nSe aplicó a ${cant} pedido(s).${Number(res.a_favor)>0?`\nQuedaron $${Number(res.a_favor).toLocaleString('es-AR')} a favor.`:''}`)
      cuentaCorrienteCliente(customerId)
    }
  }
  dibujar()
}


// ============ CLASIFICACIONES DE HUEVO ============
async function clasificacionesHuevo(){
  const { data } = await supabase.rpc('clasificaciones_huevo', { p_solo_activas: false })
  const lista = Array.isArray(data) ? data : []
  const { data: usoRaw } = await supabase.from('plan_prices').select('grade,active,customer_type')
  const uso = {}
  ;(usoRaw||[]).forEach(p=>{ if(p.grade){ uso[p.grade] = (uso[p.grade]||0) + 1 } })

  let editando = null

  const dibujar = ()=>{
    layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <button class="btn ghost" id="btn_volver_clas" style="padding:6px 12px">← Volver</button>
      <h2 style="margin:0">Tamaños de huevo</h2>
    </div>

    <div class="card">
      <p class="muted" style="margin:0;font-size:12.5px;line-height:1.5">Son las clasificaciones que usás para vender por mayor. Podés cambiar el nombre, el peso, el orden en que aparecen, o agregar una nueva.</p>
    </div>

    ${lista.map(g=>{
      const enUso = uso[g.codigo] || 0
      const editandoEste = editando === g.id
      if(editandoEste){
        return pCard(`
          <div class="field"><label>Nombre</label><input id="ed_nombre_${g.id}" value="${g.nombre}"/></div>
          <div class="field"><label>Peso por huevo</label><input id="ed_peso_${g.id}" value="${g.peso||''}" placeholder="Ej: 63 a 69 g"/></div>
          <div class="field"><label>Orden</label><input id="ed_orden_${g.id}" type="number" inputmode="numeric" value="${g.orden}"/></div>
          ${pBtnRow([
            pBtn('','Guardar',`data-clas-guardar="${g.id}"`,'primary'),
            pBtn('','Cancelar','data-clas-cancelar','ghost')
          ])}
        `, `border-color:${NOM.verde}`)
      }
      return pCard(`
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
          <div style="flex:1;min-width:0">
            <div style="font-weight:500;${!g.active?'opacity:0.55':''}">${g.nombre}${!g.active?' · inactivo':''}</div>
            <div style="font-size:12px;color:${NOM.tintaSuave};margin-top:2px">${g.peso||'sin peso definido'}</div>
            ${enUso?`<div style="font-size:11.5px;color:${NOM.verde};margin-top:3px">${enUso} precio(s) cargado(s)</div>`:`<div style="font-size:11.5px;color:${NOM.tintaSuave};margin-top:3px">Sin precios todavía</div>`}
          </div>
          <span style="font-size:11px;color:${NOM.tintaSuave};flex-shrink:0">orden ${g.orden}</span>
        </div>
        ${pBtnRow([
          pBtn('','Editar',`data-clas-editar="${g.id}"`,'ghost'),
          pBtn('', g.active?'Desactivar':'Activar', `data-clas-toggle="${g.id}"`,'ghost'),
          enUso===0 ? pBtn('','Borrar',`data-clas-borrar="${g.id}"`,'ghost') : ''
        ].filter(Boolean))}
      `, !g.active?'opacity:0.72':'')
    }).join('')}

    <div class="card">
      <h3>Agregar un tamaño</h3>
      <div class="field"><label>Nombre *</label><input id="nueva_clas_nombre" placeholder="Ej: N° 4"/></div>
      <div class="field"><label>Peso por huevo</label><input id="nueva_clas_peso" placeholder="Ej: 40 a 44 g"/></div>
      <div id="err_clas" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_nueva_clas" style="width:100%">Agregar</button>
    </div>`)

    document.querySelector('#btn_volver_clas').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }

    document.querySelectorAll('[data-clas-editar]').forEach(b=>b.onclick=()=>{ editando = b.dataset.clasEditar; dibujar() })
    const btnCancelar = document.querySelector('[data-clas-cancelar]')
    if(btnCancelar) btnCancelar.onclick = ()=>{ editando = null; dibujar() }

    document.querySelectorAll('[data-clas-guardar]').forEach(b=>b.onclick=async()=>{
      const id = b.dataset.clasGuardar
      const nombre = document.querySelector('#ed_nombre_'+id).value.trim()
      const peso = document.querySelector('#ed_peso_'+id).value.trim()
      const orden = Number(document.querySelector('#ed_orden_'+id).value) || 99
      if(!nombre){ mostrarAlerta('Ponele un nombre.'); return }
      const { data: res, error } = await supabase.rpc('admin_guardar_clasificacion', {
        p_id: id, p_codigo: null, p_nombre: nombre, p_peso: peso || null, p_orden: orden
      })
      if(error || !res?.ok){ mostrarAlerta('No se pudo guardar: '+(res?.error||error?.message||'')); return }
      await cargarClasificaciones()
      editando = null
      render()
    })

    document.querySelectorAll('[data-clas-toggle]').forEach(b=>b.onclick=async()=>{
      const { data: res, error } = await supabase.rpc('admin_toggle_clasificacion', { p_id: b.dataset.clasToggle })
      if(error || !res?.ok){ mostrarAlerta('No se pudo cambiar.'); return }
      if(!res.activa && res.tamanos_activos > 0){
        mostrarAlerta(`Desactivada.\n\nOjo: hay ${res.tamanos_activos} precio(s) activo(s) con este tamaño. Los comercios van a seguir viéndolos hasta que los desactives.`)
      }
      await cargarClasificaciones()
      render()
    })

    document.querySelectorAll('[data-clas-borrar]').forEach(b=>b.onclick=async()=>{
      const ok = await mostrarConfirmacion('¿Borrar esta clasificación?\n\nSolo se puede si no tiene precios cargados.')
      if(!ok) return
      const { data: res, error } = await supabase.rpc('admin_borrar_clasificacion', { p_id: b.dataset.clasBorrar })
      if(error || !res?.ok){ mostrarAlerta(res?.error || 'No se pudo borrar.'); return }
      await cargarClasificaciones()
      render()
    })

    document.querySelector('#btn_nueva_clas').onclick = async ()=>{
      const box = document.querySelector('#err_clas')
      const nombre = document.querySelector('#nueva_clas_nombre').value.trim()
      const peso = document.querySelector('#nueva_clas_peso').value.trim()
      if(!nombre){ box.textContent='Ponele un nombre al tamaño.'; box.style.display='block'; return }
      const { data: res, error } = await supabase.rpc('admin_guardar_clasificacion', {
        p_id: null, p_codigo: null, p_nombre: nombre, p_peso: peso || null, p_orden: null
      })
      if(error || !res?.ok){ box.textContent = res?.error || 'No se pudo agregar.'; box.style.display='block'; return }
      await cargarClasificaciones()
      render()
    }
  }
  dibujar()
}

// ============ CLIENTES QUE SE ESTÁN YENDO ============
async function clientesEnRiesgo(){
  const { data } = await supabase.rpc('admin_clientes_en_riesgo', {})
  const d = data || {}
  const lista = d.clientes || []

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_riesgo" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">Clientes que se van</h2>
  </div>

  <div class="grid two" style="margin-bottom:12px">
    <div class="card" style="margin:0"><div style="font-size:11px;color:${NOM.tintaSuave}">En riesgo</div><div style="font-size:22px;font-weight:500;color:${NOM.ambar};font-variant-numeric:tabular-nums">${d.en_riesgo||0}</div></div>
    <div class="card" style="margin:0"><div style="font-size:11px;color:${NOM.tintaSuave}">Ya perdidos</div><div style="font-size:22px;font-weight:500;color:${NOM.rojo};font-variant-numeric:tabular-nums">${d.perdidos||0}</div></div>
    <div class="card" style="margin:0"><div style="font-size:11px;color:${NOM.tintaSuave}">Se te escapan por mes</div><div style="font-size:22px;font-weight:500;font-variant-numeric:tabular-nums">$${Number(d.plata_en_riesgo||0).toLocaleString('es-AR')}</div></div>
    <div class="card" style="margin:0"><div style="font-size:11px;color:${NOM.tintaSuave}">Vale cada cliente</div><div style="font-size:22px;font-weight:500;font-variant-numeric:tabular-nums">$${Number(d.valor_promedio_cliente||0).toLocaleString('es-AR')}</div></div>
  </div>

  ${lista.length ? lista.map(c=>{
    const tel = (c.telefono||'').replace(/\D/g,'')
    const perdido = c.nivel === 'perdido'
    const msg = encodeURIComponent(`¡Hola ${(c.nombre||'').split(' ')[0]}! Te escribimos de NÓMADES. Hace un tiempo que no te llevamos huevos y queríamos saber si está todo bien. Si querés retomar, decinos y te reservamos lugar en la próxima entrega. ¡Gracias!`)
    return pCard(`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div style="flex:1;min-width:0">
          <div style="font-weight:500">${c.nombre||''}</div>
          <div style="font-size:12px;color:${NOM.tintaSuave}">${c.barrio||'-'} · ${c.entregas} entrega(s)</div>
          <div style="font-size:12px;color:${perdido?NOM.rojo:NOM.ambar};margin-top:3px">Hace ${c.dias_sin_comprar} días que no compra</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:500;font-variant-numeric:tabular-nums">$${Number(c.gastado||0).toLocaleString('es-AR')}</div>
          <div style="font-size:11px;color:${NOM.tintaSuave}">gastó en total</div>
          <div style="margin-top:5px">${pPill(perdido?'Perdido':'En riesgo', perdido?'#FCEBEB':'#FBE9D4', perdido?'#A32D2D':'#B8641E')}</div>
        </div>
      </div>
      ${tel?`<a href="https://wa.me/54${tel}?text=${msg}" target="_blank" class="btn ghost" style="display:block;text-align:center;text-decoration:none;margin-top:10px;padding:11px 0;font-size:12.5px">Escribirle por WhatsApp</a>`:''}
    `, perdido?`border-color:rgba(176,58,46,0.25)`:'')
  }).join('') : estadoVacio('No hay clientes en riesgo. Todos están comprando con normalidad.')}`)

  document.querySelector('#btn_volver_riesgo').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
}

// ============ COBRADOS SIN ENTREGAR ============
async function cobradosSinEntregar(){
  const { data } = await supabase.rpc('admin_cobrados_sin_entregar', {})
  const lista = Array.isArray(data) ? data : []

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_cobrados" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">Cobrados sin entregar</h2>
  </div>
  <div class="card">
    <p class="muted" style="margin:0">Pedidos que el cliente pagó online pero que se cancelaron o tuvieron una incidencia. Hay que resolver qué pasa con esa plata.</p>
  </div>
  ${lista.length ? lista.map(x=>pCard(`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
      <div style="flex:1">
        <div style="font-weight:500">${x.cliente||''}</div>
        <div style="font-size:12px;color:${NOM.tintaSuave}">Pedido N° ${x.order_number||'-'} · ${formatearFecha(x.delivery_date)}</div>
        <div style="font-size:12px;color:${NOM.tintaSuave};margin-top:2px">${x.status==='cancelled'?'Cancelado':'Con incidencia'}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:500;font-variant-numeric:tabular-nums">$${Number(x.monto||0).toLocaleString('es-AR')}</div>
      </div>
    </div>
    ${pBtnRow([
      pBtn('','Dejar a favor',`data-resolver-saldo="${x.order_id}"`,'primary'),
      pBtn('','Devolver',`data-resolver-devolucion="${x.order_id}"`,'ghost')
    ])}
  `)).join('') : estadoVacio('No hay pedidos cobrados sin entregar. Todo en orden.')}`)

  document.querySelector('#btn_volver_cobrados').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }

  const resolver = async (orderId, tipo)=>{
    const nota = prompt(tipo==='saldo'
      ? '¿Por qué queda a favor? (opcional)'
      : '¿Por qué se devuelve? (opcional)') || null
    const { data, error } = await supabase.rpc('resolver_pago_sin_entrega', {
      p_order_id: orderId, p_resolucion: tipo, p_nota: nota
    })
    if(error || !data?.ok){ mostrarAlerta('No se pudo resolver: '+(data?.error||error?.message||'')); return }
    mostrarAlerta(tipo==='saldo'
      ? `Quedaron $${Number(data.monto).toLocaleString('es-AR')} a favor del cliente para su próxima entrega.`
      : `Registrado.\n\n${data.aviso||''}`)
    render()
  }
  document.querySelectorAll('[data-resolver-saldo]').forEach(b=>b.onclick=()=>resolver(b.dataset.resolverSaldo,'saldo'))
  document.querySelectorAll('[data-resolver-devolucion]').forEach(b=>b.onclick=()=>resolver(b.dataset.resolverDevolucion,'devolucion'))
}

// ============ AVISOS A CLIENTES ============
let avisosEstado = 'pendiente'

async function avisosClientes(){
  const { data } = await supabase.rpc('admin_cola_avisos', { p_estado: avisosEstado })
  const avisos = Array.isArray(data) ? data : []

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_avisos" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">Avisos a clientes</h2>
  </div>
  <div class="card">
    <p class="muted" style="margin-bottom:10px">Cuando cambia un precio, el sistema prepara el mensaje para cada cliente. Tocás enviar y se abre WhatsApp con el texto escrito.</p>
    <div class="grid two">
      <button class="btn ${avisosEstado==='pendiente'?'primary':'ghost'}" data-avisos-estado="pendiente">Pendientes</button>
      <button class="btn ${avisosEstado==='enviado'?'primary':'ghost'}" data-avisos-estado="enviado">Enviados</button>
    </div>
  </div>
  ${avisos.length ? avisos.map(a=>{
    const tel = (a.telefono||'').replace(/\D/g,'')
    return pCard(`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div style="flex:1">
          <div style="font-weight:500">${a.cliente||''}</div>
          <div style="font-size:12px;color:${NOM.tintaSuave}">${a.canal==='whatsapp'?(a.telefono||'sin teléfono'):(a.email||'sin email')}</div>
        </div>
        ${a.estado==='enviado'?pPill('Enviado'):pPill('Pendiente','#FBE9D4','#B8641E')}
      </div>
      <div style="background:${NOM.fondo};border-radius:11px;padding:11px 12px;margin-top:10px;font-size:13px;line-height:1.5">${a.mensaje}</div>
      ${a.estado==='pendiente'?`<div style="display:flex;gap:8px;margin-top:10px">
        ${tel?`<a href="https://wa.me/54${tel}?text=${encodeURIComponent(a.mensaje)}" target="_blank" data-enviar-aviso="${a.id}" style="flex:1;text-align:center;background:#25D366;color:#fff;border-radius:11px;padding:11px 0;font-size:13px;font-weight:500;text-decoration:none">Enviar por WhatsApp</a>`:''}
        ${a.email?`<a href="mailto:${a.email}?subject=${encodeURIComponent(a.asunto||'')}&body=${encodeURIComponent(a.mensaje)}" data-enviar-aviso="${a.id}" style="flex:1;text-align:center;background:${NOM.superficie};border:1px solid ${NOM.borde};color:${NOM.tinta};border-radius:11px;padding:11px 0;font-size:13px;font-weight:500;text-decoration:none">Email</a>`:''}
        <button class="btn ghost" data-marcar-aviso="${a.id}" style="flex:0 0 auto;padding:11px 14px;font-size:12px">Listo</button>
      </div>`:''}
    `)
  }).join('') : estadoVacio(avisosEstado==='pendiente'?'No hay avisos pendientes.':'Todavía no enviaste ningún aviso.')}`)

  document.querySelector('#btn_volver_avisos').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
  document.querySelectorAll('[data-avisos-estado]').forEach(b=>b.onclick=()=>{ avisosEstado = b.dataset.avisosEstado; render() })
  document.querySelectorAll('[data-enviar-aviso]').forEach(a=>a.onclick=async()=>{
    await supabase.rpc('marcar_aviso_enviado', { p_id: a.dataset.enviarAviso })
    setTimeout(()=>render(), 800)
  })
  document.querySelectorAll('[data-marcar-aviso]').forEach(b=>b.onclick=async()=>{
    await supabase.rpc('marcar_aviso_enviado', { p_id: b.dataset.marcarAviso })
    render()
  })
}

// ============ MERMAS Y VENCIMIENTOS ============
const MOTIVOS_MERMA = [
  { value:'rotura', label:'Rotura' },
  { value:'vencido', label:'Vencido' },
  { value:'mal_estado', label:'Mal estado' },
  { value:'robo', label:'Faltante o robo' },
  { value:'error', label:'Error de carga' }
]
const LUGARES_MERMA = [
  { value:'campo', label:'Campo' },
  { value:'deposito', label:'Depósito' },
  { value:'preparacion', label:'Preparación' },
  { value:'reparto', label:'Reparto' }
]
const LUGAR_LABEL = { campo:'Campo', deposito:'Depósito', preparacion:'Preparación', reparto:'Reparto' }
const MOTIVO_LABEL = { rotura:'Rotura', vencido:'Vencido', mal_estado:'Mal estado', robo:'Faltante o robo', error:'Error de carga' }

let mermaProducto = ''
let mermaLote = ''
let mermaMotivo = ''
let mermaLugar = 'deposito'
let mermaCantidad = ''
let mermaDescripcion = ''
let mermaFoto = null
let mermaLotes = []

async function registrarMermaPantalla(){
  const [{ data: catRaw }, { data: resumenRaw }] = await Promise.all([
    supabase.from('catalog_products').select('id,name,controla_vencimiento,stock').eq('active', true).order('name'),
    tengoRol('admin') ? supabase.rpc('admin_resumen_mermas', {}) : Promise.resolve({ data:null })
  ])
  const catalogo = catRaw || []
  const resumen = resumenRaw || null

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_merma" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">Registrar una pérdida</h2>
  </div>

  <div class="card">
    <p class="muted" style="margin-bottom:12px">Se rompió, se venció o falta algo. Registralo — sirve para saber dónde se está perdiendo plata, no para buscar culpables.</p>

    <div class="field"><label>¿Qué producto?</label>
      <select id="merma_producto">
        <option value="">Elegí un producto</option>
        ${catalogo.map(p=>`<option value="${p.id}" ${mermaProducto===p.id?'selected':''}>${p.name}</option>`).join('')}
      </select>
    </div>

    ${mermaLotes.length?`<div class="field"><label>¿De qué lote?</label>
      <select id="merma_lote">
        ${mermaLotes.map(l=>`<option value="${l.id}" ${mermaLote===l.id?'selected':''}>Lote ${l.lote} — ${l.cantidad_disponible} disponibles${l.vencimiento?` · vence ${fechaCorta(l.vencimiento)}`:''}</option>`).join('')}
      </select>
    </div>`:''}

    <div class="field"><label>¿Cuántas unidades?</label><input id="merma_cantidad" type="number" min="0" step="1" value="${mermaCantidad}"/></div>

    <div class="field"><label>¿Qué pasó?</label>
      <div class="grid two">
        ${MOTIVOS_MERMA.map(m=>`<button type="button" class="btn ${mermaMotivo===m.value?'primary':'ghost'}" data-merma-motivo="${m.value}">${m.label}</button>`).join('')}
      </div>
    </div>

    <div class="field"><label>¿Dónde pasó?</label>
      <div class="grid two">
        ${LUGARES_MERMA.map(l=>`<button type="button" class="btn ${mermaLugar===l.value?'primary':'ghost'}" data-merma-lugar="${l.value}">${l.label}</button>`).join('')}
      </div>
    </div>

    <div class="field"><label>Contanos qué pasó (opcional)</label><textarea id="merma_desc" rows="2" placeholder="Ej: se cayó la caja al bajarla de la camioneta">${mermaDescripcion}</textarea></div>
    <div class="field"><label>Foto (opcional)</label><input type="file" id="merma_foto" accept="image/*"/></div>

    <div id="err_merma" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_guardar_merma" style="width:100%">Registrar la pérdida</button>
  </div>

  ${resumen && !resumen.error ? `
  <h3 style="margin:18px 0 8px">Últimos 30 días</h3>
  <div class="card">
    <div style="font-size:11px;color:${NOM.tintaSuave}">Se perdió</div>
    <div style="font-size:26px;font-weight:500;font-variant-numeric:tabular-nums;color:${NOM.tinta}">$${Number(resumen.total||0).toLocaleString('es-AR')}</div>
    ${(resumen.por_motivo||[]).length?`<div style="margin-top:12px">
      ${(resumen.por_motivo||[]).map(m=>`<div class="row"><span>${MOTIVO_LABEL[m.motivo]||m.motivo}</span><span style="font-variant-numeric:tabular-nums">$${Number(m.costo||0).toLocaleString('es-AR')}</span></div>`).join('')}
    </div>`:''}
    ${(resumen.por_lugar||[]).length?`<div style="margin-top:12px"><div style="font-size:11px;color:${NOM.tintaSuave};margin-bottom:4px">DÓNDE</div>
      ${(resumen.por_lugar||[]).map(m=>`<div class="row"><span>${LUGAR_LABEL[m.lugar]||m.lugar}</span><span style="font-variant-numeric:tabular-nums">$${Number(m.costo||0).toLocaleString('es-AR')}</span></div>`).join('')}
    </div>`:''}
  </div>
  ${(resumen.lista||[]).length?(resumen.lista||[]).slice(0,15).map(m=>pCard(`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
      <div style="flex:1">
        <div style="font-weight:500">${m.cantidad} × ${m.producto}</div>
        <div style="font-size:12px;color:${NOM.tintaSuave}">${fechaCorta(m.fecha)} · ${MOTIVO_LABEL[m.motivo]||m.motivo} · ${LUGAR_LABEL[m.lugar]||m.lugar}</div>
        <div style="font-size:12px;color:${NOM.tintaSuave};margin-top:2px">Registró: ${m.quien||'-'}</div>
        ${m.descripcion?`<div style="font-size:12px;margin-top:4px">${m.descripcion}</div>`:''}
      </div>
      <div style="text-align:right">
        <div style="font-weight:500;font-variant-numeric:tabular-nums">$${Number(m.costo||0).toLocaleString('es-AR')}</div>
        ${m.foto_url?`<a href="${m.foto_url}" target="_blank" style="font-size:11px">Ver foto</a>`:''}
      </div>
    </div>`)).join(''):''}
  ` : ''}`)

  document.querySelector('#btn_volver_merma').onclick = ()=>{ current = pantallaInicialSegunRoles(); render() }

  const selProd = document.querySelector('#merma_producto')
  selProd.onchange = async ()=>{
    mermaProducto = selProd.value
    mermaLote = ''
    mermaLotes = []
    if(mermaProducto){
      const prod = catalogo.find(p=>p.id===mermaProducto)
      if(prod && prod.controla_vencimiento){
        const { data } = await supabase.from('inventory_lots')
          .select('id,lote,vencimiento,cantidad_disponible')
          .eq('product_id', mermaProducto).gt('cantidad_disponible', 0)
          .order('vencimiento', { nullsFirst:false })
        mermaLotes = data || []
        if(mermaLotes.length) mermaLote = mermaLotes[0].id
      }
    }
    render()
  }
  const selLote = document.querySelector('#merma_lote')
  if(selLote) selLote.onchange = ()=>{ mermaLote = selLote.value }
  document.querySelector('#merma_cantidad').oninput = (e)=>{ mermaCantidad = e.target.value }
  document.querySelector('#merma_desc').oninput = (e)=>{ mermaDescripcion = e.target.value }
  document.querySelector('#merma_foto').onchange = (e)=>{ mermaFoto = e.target.files[0] || null }
  document.querySelectorAll('[data-merma-motivo]').forEach(b=>b.onclick=()=>{ mermaMotivo = b.dataset.mermaMotivo; render() })
  document.querySelectorAll('[data-merma-lugar]').forEach(b=>b.onclick=()=>{ mermaLugar = b.dataset.mermaLugar; render() })

  document.querySelector('#btn_guardar_merma').onclick = async ()=>{
    const box = document.querySelector('#err_merma')
    const cantidad = Number(document.querySelector('#merma_cantidad').value)
    if(!mermaProducto){ box.textContent='Elegí qué producto se perdió.'; box.style.display='block'; return }
    if(!cantidad || cantidad<=0){ box.textContent='Ingresá cuántas unidades.'; box.style.display='block'; return }
    if(!mermaMotivo){ box.textContent='Elegí qué pasó.'; box.style.display='block'; return }

    let fotoUrl = null
    if(mermaFoto){
      const path = `merma_${Date.now()}_${mermaFoto.name}`
      const { error: upErr } = await supabase.storage.from('finance-attachments').upload(path, mermaFoto)
      if(upErr){ box.textContent='No se pudo subir la foto: '+upErr.message; box.style.display='block'; return }
      const { data: pub } = supabase.storage.from('finance-attachments').getPublicUrl(path)
      fotoUrl = pub.publicUrl
    }

    const { data, error } = await supabase.rpc('registrar_merma', {
      p_product_id: mermaProducto,
      p_lot_id: mermaLote || null,
      p_cantidad: cantidad,
      p_motivo: mermaMotivo,
      p_lugar: mermaLugar,
      p_descripcion: document.querySelector('#merma_desc').value.trim() || null,
      p_foto_url: fotoUrl
    })
    if(error || !data?.ok){ box.textContent='No se pudo registrar: '+(data?.error||error?.message||''); box.style.display='block'; return }
    mermaProducto=''; mermaLote=''; mermaLotes=[]; mermaMotivo=''; mermaCantidad=''; mermaDescripcion=''; mermaFoto=null
    mostrarAlerta(`Pérdida registrada${Number(data.costo)>0?`\n\nSe descontó $${Number(data.costo).toLocaleString('es-AR')} del resultado.`:''}`)
    render()
  }
}

async function controlVencimientos(){
  const { data } = await supabase.rpc('admin_control_vencimientos', {})
  const d = data || {}
  const porVencer = d.por_vencer || []
  const vencidos = d.vencidos || []

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_venc" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">Vencimientos</h2>
  </div>

  <div class="grid two" style="margin-bottom:12px">
    <div class="card" style="margin:0"><div style="font-size:11px;color:${NOM.tintaSuave}">Por vencer</div><div style="font-size:22px;font-weight:500;font-variant-numeric:tabular-nums">$${Number(d.valor_por_vencer||0).toLocaleString('es-AR')}</div></div>
    <div class="card" style="margin:0"><div style="font-size:11px;color:${NOM.tintaSuave}">Ya vencido</div><div style="font-size:22px;font-weight:500;color:${Number(d.valor_vencido||0)>0?NOM.rojo:NOM.tinta};font-variant-numeric:tabular-nums">$${Number(d.valor_vencido||0).toLocaleString('es-AR')}</div></div>
  </div>

  ${vencidos.length?`<h3 style="margin:16px 0 8px;color:${NOM.rojo}">Vencidos — sacar del stock</h3>
    ${vencidos.map(l=>pCard(`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div><div style="font-weight:500">${l.producto}</div><div style="font-size:12px;color:${NOM.tintaSuave}">Lote ${l.lote} · venció hace ${l.dias} día(s)</div></div>
        <div style="text-align:right"><div style="font-weight:500;font-variant-numeric:tabular-nums">${l.disponible}</div><div style="font-size:11px;color:${NOM.tintaSuave}">$${Number(l.valor||0).toLocaleString('es-AR')}</div></div>
      </div>
      <button class="btn ghost" data-dar-baja="${l.id}" data-cant="${l.disponible}" style="width:100%;margin-top:10px">Dar de baja</button>
    `, `border-color:rgba(176,58,46,0.3)`)).join('')}`:''}

  ${porVencer.length?`<h3 style="margin:16px 0 8px">Por vencer</h3>
    ${porVencer.map(l=>pCard(`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div><div style="font-weight:500">${l.producto}</div><div style="font-size:12px;color:${NOM.tintaSuave}">Lote ${l.lote} · vence ${fechaCorta(l.vencimiento)}</div></div>
        <div style="text-align:right">
          ${pPill(`${l.dias} día(s)`, l.nivel==='rojo'?'#FBE9D4':NOM.verdeClaro, l.nivel==='rojo'?'#B8641E':NOM.verde)}
          <div style="font-size:12px;color:${NOM.tintaSuave};margin-top:4px">${l.disponible} unidades</div>
        </div>
      </div>`)).join('')}`:''}

  ${(!porVencer.length && !vencidos.length)?estadoVacio('No hay nada por vencer. Todo el stock está en fecha.'):''}`)

  document.querySelector('#btn_volver_venc').onclick = ()=>{ current='admin'; adminAreaAbierta=null; render() }
  document.querySelectorAll('[data-dar-baja]').forEach(b=>b.onclick=async()=>{
    if(!(await mostrarConfirmacion('¿Dar de baja todo este lote? Se va a registrar como pérdida por vencimiento.'))) return
    const { data, error } = await supabase.rpc('registrar_merma', {
      p_product_id: null, p_lot_id: b.dataset.darBaja, p_cantidad: Number(b.dataset.cant),
      p_motivo: 'vencido', p_lugar: 'deposito', p_descripcion: 'Baja automática por vencimiento', p_foto_url: null
    })
    if(error || !data?.ok){ mostrarAlerta('No se pudo dar de baja: '+(data?.error||error?.message||'')); return }
    mostrarAlerta('Lote dado de baja')
    render()
  })
}

// ============ PANTALLA: HISTORIAL DE PAGOS A PROVEEDORES ============
let histPagosFiltroProveedor = ''
let histPagosDesde = ''
let histPagosHasta = ''

async function historialPagosProveedores(){
  const [{ data: pagosRaw }, { data: suppliersRaw }] = await Promise.all([
    supabase.rpc('admin_historial_pagos_proveedores', {
      p_supplier_id: histPagosFiltroProveedor || null,
      p_from: histPagosDesde || null,
      p_to: histPagosHasta || null
    }),
    supabase.from('suppliers').select('id,name').order('name')
  ])
  const pagos = pagosRaw || []
  const suppliers = suppliersRaw || []
  const totalPeriodo = pagos.reduce((s,p)=>s+Number(p.total||0),0)
  const metodos = { transfer:'Transferencia', cash:'Efectivo', mp:'Billetera' }

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_hist_pagos" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">🧾 Historial de pagos</h2>
  </div>
  <div class="card">
    <div class="field"><label>Empresa</label><select id="hist_proveedor">
      <option value="">Todas</option>
      ${suppliers.map(s=>`<option value="${s.id}" ${histPagosFiltroProveedor===s.id?'selected':''}>${s.name}</option>`).join('')}
    </select></div>
    <div class="grid two">
      <div class="field"><label>Desde</label><input type="date" id="hist_desde" value="${histPagosDesde}"/></div>
      <div class="field"><label>Hasta</label><input type="date" id="hist_hasta" value="${histPagosHasta}"/></div>
    </div>
    <div class="alert info" style="margin:0"><b>${pagos.length} pago(s) · ${moneda(totalPeriodo)}</b></div>
  </div>
  ${pagos.length ? pagos.map(p=>pCard(`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
      <div style="flex:1">
        <div style="font-weight:700;color:#2F4D2A">${p.supplier_name||'-'}</div>
        <div class="muted" style="font-size:12px">${fechaCorta(p.paid_at)} · ${metodos[p.payment_method]||p.payment_method||'-'}</div>
        <div class="muted" style="font-size:11px;margin-top:2px">Registró: ${p.registrado_por||'-'}</div>
      </div>
      <div style="text-align:right">
        <div style="color:#2F4D2A;font-size:17px;font-weight:700">${moneda(p.total)}</div>
      </div>
    </div>
    <div style="margin-top:8px">
      ${(p.imputaciones||[]).map(i=>`<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-top:1px solid #F0EADB"><span style="color:#5F5E5A">Pedido N° ${i.order_number||'-'}</span><span style="color:#2F4D2A;font-weight:600">${moneda(i.amount)}</span></div>`).join('')}
    </div>
    ${pBtnRow([
      pBtn('📄','Orden de pago',`data-orden-pago="${p.batch_id}"`,''),
      ...(p.receipt_url?[`<a href="${p.receipt_url}" target="_blank" class="btn ghost" style="flex:1;text-align:center;text-decoration:none;padding:9px 0;font-size:12px">📎 Comprobante</a>`]:[])
    ])}
  `)).join('') : estadoVacio('Todavía no registraste pagos a proveedores.')}`)

  document.querySelector('#btn_volver_hist_pagos').onclick = ()=>{ current='admin'; render() }
  document.querySelector('#hist_proveedor').onchange = (e)=>{ histPagosFiltroProveedor = e.target.value; render() }
  document.querySelector('#hist_desde').onchange = (e)=>{ histPagosDesde = e.target.value; render() }
  document.querySelector('#hist_hasta').onchange = (e)=>{ histPagosHasta = e.target.value; render() }
  document.querySelectorAll('[data-orden-pago]').forEach(b=>b.onclick=()=>{
    const pago = pagos.find(p=>String(p.batch_id)===b.dataset.ordenPago)
    if(pago) documentoOrdenPago(pago)
  })
}

// ============ PANTALLA: AUDITORÍA ============
let audFiltroActor = ''
let audFiltroEntidad = ''
let audDesde = ''
let audHasta = ''

const ENTIDAD_LABEL = {
  plan_prices:'Precios de planes', catalog_products:'Catálogo', farm_settings:'Configuración',
  staff_roles:'Personal', payments:'Cobros', finance_entries:'Movimientos de finanzas',
  supplier_order_payments:'Pagos a proveedores', supplier_orders:'Pedidos a proveedores',
  customers:'Clientes', supplier_credits:'Notas de crédito', order:'Pedidos', supplier:'Proveedores'
}
const ACCION_LABEL = {
  insert:'creó', update:'modificó', delete:'eliminó',
  confirm_delivery:'confirmó una entrega', pago_proveedor:'pagó a un proveedor',
  pedido_telefonico:'cargó un pedido telefónico'
}

async function auditoria(){
  const [{ data: logsRaw }, { data: actoresRaw }] = await Promise.all([
    supabase.rpc('admin_auditoria', {
      p_from: audDesde || null, p_to: audHasta || null,
      p_actor: audFiltroActor || null, p_entity: audFiltroEntidad || null, p_limit: 150
    }),
    supabase.rpc('admin_auditoria_actores', {})
  ])
  const logs = logsRaw || []
  const actores = actoresRaw || []
  const entidades = [...new Set(logs.map(l=>l.entity_type))].sort()

  const describir = (l)=>{
    const accion = ACCION_LABEL[l.action] || l.action
    const entidad = ENTIDAD_LABEL[l.entity_type] || l.entity_type
    if(l.action==='update' && l.new_value){
      const campos = Object.entries(l.new_value).map(([campo,v])=>{
        const antes = v && typeof v==='object' ? v.antes : ''
        const despues = v && typeof v==='object' ? v.despues : ''
        return `<div style="font-size:11.5px;color:#5F5E5A;padding:2px 0">${campo}: <s>${antes===null?'vacío':antes}</s> → <b style="color:#2F4D2A">${despues===null?'vacío':despues}</b></div>`
      }).join('')
      return `<div style="font-size:13px;color:#2F4D2A">${accion} ${entidad}</div>${campos}`
    }
    return `<div style="font-size:13px;color:#2F4D2A">${accion} ${l.action==='insert'||l.action==='delete'?entidad:''}</div>`
  }

  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button class="btn ghost" id="btn_volver_auditoria" style="padding:6px 12px">← Volver</button>
    <h2 style="margin:0">🔍 Quién hizo qué</h2>
  </div>
  <div class="card">
    <p class="muted" style="margin-bottom:10px">Cada cambio queda registrado con la persona que lo hizo, la fecha y el valor anterior.</p>
    <div class="field"><label>Persona</label><select id="aud_actor">
      <option value="">Todas</option>
      ${actores.filter(a=>a.user_id).map(a=>`<option value="${a.user_id}" ${audFiltroActor===a.user_id?'selected':''}>${a.full_name} (${a.acciones})</option>`).join('')}
    </select></div>
    <div class="field"><label>Qué se tocó</label><select id="aud_entidad">
      <option value="">Todo</option>
      ${entidades.map(e=>`<option value="${e}" ${audFiltroEntidad===e?'selected':''}>${ENTIDAD_LABEL[e]||e}</option>`).join('')}
    </select></div>
    <div class="grid two">
      <div class="field"><label>Desde</label><input type="date" id="aud_desde" value="${audDesde}"/></div>
      <div class="field"><label>Hasta</label><input type="date" id="aud_hasta" value="${audHasta}"/></div>
    </div>
  </div>
  ${logs.length ? logs.map(l=>pCard(`
    <div style="display:flex;gap:10px;align-items:flex-start">
      ${pAvatar(l.actor,32)}
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;color:#2F4D2A;font-size:13px">${l.actor||'-'}</div>
        <div class="muted" style="font-size:11px;margin-bottom:4px">${new Date(l.created_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
        ${describir(l)}
      </div>
    </div>
  `, 'margin-bottom:8px')).join('') : estadoVacio('No hay movimientos registrados con esos filtros.')}`)

  document.querySelector('#btn_volver_auditoria').onclick = ()=>{ current='admin'; render() }
  document.querySelector('#aud_actor').onchange = (e)=>{ audFiltroActor = e.target.value; render() }
  document.querySelector('#aud_entidad').onchange = (e)=>{ audFiltroEntidad = e.target.value; render() }
  document.querySelector('#aud_desde').onchange = (e)=>{ audDesde = e.target.value; render() }
  document.querySelector('#aud_hasta').onchange = (e)=>{ audHasta = e.target.value; render() }
}

const ADMIN_DETALLE_TITULOS = {
  clientes: 'Clientes',
  pend_entrega: 'Pedidos pendientes de entrega',
  pend_pago: 'Suscripciones pendientes de pago',
  entregados: 'Entregados',
  incidencias: 'Incidencias',
  reprogramados: 'Reprogramados'
}

async function adminDetalle(){
  const tipo = adminDetalleTipo
  let rows = []
  let renderRow = ()=>''

  if(tipo==='clientes'){
    const { data } = await supabase.from('customers').select('id,first_name,last_name,neighborhood,zone,phone,subscriptions(egg_quantity,frequency,payment_status,status)').order('first_name')
    rows = data || []
    renderRow = c=>{
      const sub = (c.subscriptions||[]).find(s=>s.status==='active') || (c.subscriptions||[])[0]
      const plan = sub? `${sub.egg_quantity} huevos · ${FRECUENCIAS[sub.frequency]||sub.frequency}` : 'Sin plan activo'
      const pago = sub? (sub.payment_status==='paid'?'✅ Al día':'🟡 Pendiente') : ''
      return `<div class="row"><span><b>${c.first_name||''} ${c.last_name||''}</b><br><small>${c.neighborhood||'-'} ${zonaBadge(c.zone)} · ${plan}</small><br><small>📞 ${c.phone||'-'}</small></span><span class="badge">${pago}</span></div>`
    }
  } else if(tipo==='pend_entrega'){
    const { data } = await supabase.from('orders').select('id,delivery_date,status,quantity_maples,customers(first_name,last_name,neighborhood)').in('status',['pending','assigned','out_for_delivery']).order('delivery_date')
    rows = data || []
    renderRow = r=>{ const c=r.customers||{}; return `<div class="row"><span><b>${c.first_name||''} ${c.last_name||''}</b><br><small>${c.neighborhood||'-'} · ${formatearFecha(r.delivery_date)}</small></span><span class="badge">${ESTADOS[r.status]||r.status}</span></div>` }
  } else if(tipo==='pend_pago'){
    const { data } = await supabase.from('subscriptions').select('id,egg_quantity,frequency,created_at,customers(first_name,last_name,neighborhood,phone)').eq('payment_status','pending').order('created_at')
    rows = data || []
    renderRow = s=>{ const c=s.customers||{}; return `<div class="row"><span><b>${c.first_name||''} ${c.last_name||''}</b><br><small>${c.neighborhood||'-'} · ${s.egg_quantity} huevos · ${FRECUENCIAS[s.frequency]||s.frequency}</small><br><small>📞 ${c.phone||'-'}</small></span><span class="badge">🟡 Pendiente</span></div>` }
  } else if(tipo==='entregados'){
    const { data } = await supabase.from('orders').select('id,delivery_date,delivered_at,customers(first_name,last_name,neighborhood)').eq('status','delivered').order('delivered_at',{ascending:false}).limit(50)
    rows = data || []
    renderRow = r=>{ const c=r.customers||{}; return `<div class="row"><span><b>${c.first_name||''} ${c.last_name||''}</b><br><small>${c.neighborhood||'-'} · ${formatearFecha(r.delivery_date)}</small></span><span class="badge">🟢 Entregado</span></div>` }
  } else if(tipo==='incidencias'){
    const { data } = await supabase.from('orders').select('id,delivery_date,customers(first_name,last_name,neighborhood,phone)').eq('status','incident').order('delivery_date',{ascending:false})
    rows = data || []
    renderRow = r=>{ const c=r.customers||{}; return `<div class="row"><span><b>${c.first_name||''} ${c.last_name||''}</b><br><small>${c.neighborhood||'-'} · ${formatearFecha(r.delivery_date)}</small><br><small>📞 ${c.phone||'-'}</small></span><span class="badge">🔴 Incidencia</span></div>` }
  } else if(tipo==='reprogramados'){
    const { data } = await supabase.from('orders').select('id,delivery_date,customers(first_name,last_name,neighborhood)').eq('status','rescheduled').order('delivery_date')
    rows = data || []
    renderRow = r=>{ const c=r.customers||{}; return `<div class="row"><span><b>${c.first_name||''} ${c.last_name||''}</b><br><small>${c.neighborhood||'-'} · ${formatearFecha(r.delivery_date)}</small></span><span class="badge">🟠 Reprogramado</span></div>` }
  }

  const titulo = ADMIN_DETALLE_TITULOS[tipo] || 'Detalle'
  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><button class="btn ghost" id="btn_volver_admin" style="padding:6px 12px">← Volver</button><h2 style="margin:0;font-size:17px" id="detalle_titulo">${titulo} (${rows.length})</h2></div>
  <div class="field"><input id="admin_buscar" placeholder="Buscar por nombre o barrio"/></div>
  <div class="card" id="detalle_lista">${rows.length? rows.map(renderRow).join('') : '<p class="muted">No hay resultados.</p>'}</div>`)

  document.querySelector('#btn_volver_admin').onclick = ()=>{ current='admin'; render() }
  document.querySelector('#admin_buscar').oninput = (e)=>{
    const term = e.target.value.toLowerCase().trim()
    const filtradas = term? rows.filter(r=>JSON.stringify(r).toLowerCase().includes(term)) : rows
    document.querySelector('#detalle_titulo').textContent = `${titulo} (${filtradas.length})`
    document.querySelector('#detalle_lista').innerHTML = filtradas.length? filtradas.map(renderRow).join('') : '<p class="muted">No hay resultados.</p>'
  }
}

let lastPushedCurrent = null
let navegandoPorHistorial = false

let ultimaPantallaParaScroll = null
async function render(){
  if(!navegandoPorHistorial && current !== lastPushedCurrent){
    if(lastPushedCurrent===null) history.replaceState({ current }, '', '')
    else history.pushState({ current }, '', '')
    lastPushedCurrent = current
  }
  navegandoPorHistorial = false
  if(current==='inicio' && session && myRole){ current = myRole==='campo' ? 'campo' : myRole==='repartidor' ? 'repartidor' : myRole==='preparador' ? 'preparador' : myRole==='vendedor' ? 'vendedor' : 'admin' }
  const mismaPantalla = current === ultimaPantallaParaScroll
  const scrollPrevio = mismaPantalla ? window.scrollY : 0
  ultimaPantallaParaScroll = current
  if(current==='inicio') await inicio();
  else if(current==='cuenta') await (cuenta? cuentaPanel() : cuentaLogin());
  else if(current==='staff-login') await staffLogin();
  else if(current==='staff-profile-setup') await staffProfileForm(true);
  else if(current==='perfil') await staffProfileForm(false);
  else if(current==='clientes') await clientes();
  else if(current==='pedidos') await pedidos();
  else if(current==='repartidor') await repartidor();
  else if(current==='repartidor-mapa') await mapaRepartidor();
  else if(current==='historial') await historialRepartidor();
  else if(current==='campo') await campo();
  else if(current==='campo-granjeros') await campoGranjeros();
  else if(current==='campo-dia') await campoDia();
  else if(current==='campo-carro') await campoCarro();
  else if(current==='campo-insumo') await campoInsumo();
  else if(current==='campo-peso') await campoPeso();
  else if(current==='campo-sanidad') await campoSanidad();
  else if(current==='campo-aves') await campoAves();
  else if(current==='campo-guia') await campoGuia();
  else if(current==='campo-ficha') await campoFicha();
  else if(current==='adm-campo') await adminCampo();
  else if(current==='adm-campo-lotes') await admCampoLotes();
  else if(current==='adm-campo-parcelas') await admCampoParcelas();
  else if(current==='adm-campo-razas') await admCampoRazas();
  else if(current==='adm-campo-insumos') await admCampoInsumos();
  else if(current==='adm-campo-sanitario') await admCampoSanitario();
  else if(current==='adm-campo-descanso') await admCampoDescanso();
  else if(current==='costo-huevo') await costoHuevo();
  else if(current==='zonas') await zonasReparto();
  else if(current==='categorias-costo') await categoriasCosto();
  else if(current==='preparador') await preparador();
  else if(current==='vendedor') await vendedor();
  else if(current==='mayorista-login') mayoristaLogin();
  else if(current==='mayorista-landing') await mayoristaLanding();
  else if(current==='mayorista-signup') mayoristaSignupForm();
  else if(current==='mayorista-panel') await mayoristaPanel();
  else if(current==='mis-suscriptores') await vendedorMisSuscriptores();
  else if(current==='mis-comisiones') await vendedorMisComisiones();
  else if(current==='vehiculo') await miVehiculo();
  else if(current==='vehiculo-stats') await vehiculoStats();
  else if(current==='vehiculo-historial') await vehiculoHistorial();
  else if(current==='telefonico') await telefonico();
  else if(current==='historial-pagos') await historialPagosProveedores();
  else if(current==='merma') await registrarMermaPantalla();
  else if(current==='vencimientos') await controlVencimientos();
  else if(current==='avisos') await avisosClientes();
  else if(current==='cobrados') await cobradosSinEntregar();
  else if(current==='riesgo') await clientesEnRiesgo();
  else if(current==='clasificaciones') await clasificacionesHuevo();
  else if(current==='deudores') await deudores();
  else if(current==='fincanales') await finanzasCanales();
  else if(current==='mayoristas-riesgo') await mayoristasEnRiesgo();
  else if(current==='gasto') await cargarGasto();
  else if(current==='gastos-equipo') await gastosEquipo();
  else if(current==='alta-comercio') await altaComercio();
  else if(current==='backup') await copiaSeguridad();
  else if(current==='auditoria') await auditoria();
  else if(current==='admin-detalle') await adminDetalle();
  else await admin()
  if(mismaPantalla) requestAnimationFrame(()=>window.scrollTo(0, scrollPrevio))
}

window.addEventListener('popstate', (e)=>{
  current = e.state?.current || 'inicio'
  lastPushedCurrent = current
  navegandoPorHistorial = true
  render()
})

function inyectarEstilos(){
  if(document.querySelector('#nom_estilos')) return
  const st = document.createElement('style')
  st.id = 'nom_estilos'
  st.textContent = `
    body{background:${NOM.fondo}}
    h1,h2,h3,h4{font-weight:500;color:${NOM.tinta};letter-spacing:-0.2px}
    h2{font-size:20px}
    h3{font-size:15px}
    .card{background:${NOM.superficie};border:1px solid ${NOM.borde};border-radius:16px}
    .row{border-bottom:1px solid ${NOM.borde}}
    .badge{font-weight:500;border-radius:7px}
    b,strong{font-weight:500}
    input,select,textarea{border-radius:11px;border:1px solid ${NOM.borde};font-size:15px}
    input:focus,select:focus,textarea:focus{outline:none;border-color:${NOM.verde};box-shadow:0 0 0 3px rgba(47,77,42,0.09)}
    .btn{border-radius:11px;font-weight:500}
    [data-count-target]{font-variant-numeric:tabular-nums}
  `
  document.head.appendChild(st)
}

async function init(){
  inyectarEstilos()
  await cargarClasificaciones()
  document.addEventListener('focusin', (e)=>{
    if(e.target.tagName==='INPUT' && e.target.type==='number') e.target.select()
  })
  const { data } = await supabase.auth.getSession()
  session = data.session
  if(session){
    const { data: roleRow } = await supabase.from('staff_roles').select('*').eq('user_id', session.user.id).single()
    myRole = roleRow?.role || null
    myRoles = (roleRow && Array.isArray(roleRow.roles) && roleRow.roles.length) ? roleRow.roles : (myRole ? [myRole] : [])
    staffProfile = roleRow || null
    if(!myRole){ session=null; myRoles=[] }
    else if(!roleRow.profile_completed){ current = 'staff-profile-setup' }
    else { current = pantallaInicialSegunRoles() }
  } else if(new URLSearchParams(window.location.search).get('mayorista') || /\/mayoristas?\/?$/.test(window.location.pathname)){
    current = 'mayorista-landing'
  }
  render()
}
init()
