import { supabase } from './services/supabase.js'

const app = document.querySelector('#app')
let current = 'inicio'
let session = null
let myRole = null // 'admin' | 'campo' | 'repartidor'
let cuenta = null // datos del cliente logueado por DNI
let staffProfile = null // datos del perfil del trabajador logueado
let adminOpenSection = null // qué sección del acordeón de admin está abierta
let adminDetalleTipo = null // qué tarjeta de resumen se está viendo en detalle

function navStaffFor(role){
  if(role==='admin') return [['clientes','Clientes'],['pedidos','Pedidos'],['repartidor','Repartidor'],['campo','Campo'],['admin','Administración'],['vehiculo','Mi vehículo'],['perfil','Mi perfil']]
  if(role==='campo') return [['campo','Campo'],['perfil','Mi perfil']]
  if(role==='repartidor') return [['repartidor','Repartidor'],['historial','Historial'],['vehiculo','Mi vehículo'],['perfil','Mi perfil']]
  return []
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
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ar&q=${encodeURIComponent(direccion)}`
    const res = await fetch(url, { headers: { 'Accept-Language': 'es' } })
    const data = await res.json()
    if(data && data[0]) return { lat: Number(data[0].lat), lon: Number(data[0].lon) }
  }catch(e){}
  return null
}

function layout(content){
  const nav = session ? (current==='staff-profile-setup' ? [['logout','Salir']] : [['inicio','Inicio'],...navStaffFor(myRole),['logout','Salir']]) : [['inicio','Inicio'],['cuenta','Mi cuenta']]
  app.innerHTML = `<div class="shell"><div class="top"><div class="brand" style="display:flex;align-items:center;gap:8px">NÓMADES <span class="muted" style="font-size:12px">Huevos de libre pastoreo</span></div><div class="nav">${nav.map(([k,l])=>`<button class="btn ${current===k?'primary':'ghost'}" data-nav="${k}">${l}</button>`).join('')}</div></div>${content}${!session?`<div style="text-align:center;margin-top:24px"><a href="#" id="staff_link" class="muted" style="font-size:12px">Acceso del equipo</a></div>`:''}</div>`
  document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=async ()=>{
    if(b.dataset.nav==='logout'){ await supabase.auth.signOut(); session=null; myRole=null; current='inicio'; return render() }
    if(b.dataset.nav==='admin'){ adminData = null; adminOpenSection = null }
    current=b.dataset.nav; render()
  })
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

function inicio(){layout(`<section class="hero">
  <img src="./img/logo.jpg" alt="Granja Nómades - gallinas de huevos pastoriles, libres por naturaleza" style="width:100%;border-radius:12px;margin-bottom:16px;display:block"/>
  <div style="background:#2F4D2A;border-radius:12px;padding:12px 16px;margin-bottom:16px;text-align:center">
    <p style="font-size:14px;font-weight:600;color:#F5EFE0;margin:0">Comprá directo al productor</p>
    <p style="font-size:12px;color:#C9D8B0;margin:4px 0 0">Del nido a tu mesa en 0-2 días, no en 2 semanas de supermercado</p>
  </div>
  <img src="./img/hero_banner.jpg" alt="Granja Nómades - gallinero móvil" style="width:100%;border-radius:12px;margin-bottom:18px;display:block"/>
  <div class="muted"><b>NATURALES • FRESCOS • REALES</b></div>
  <h1>Huevos que nacen al aire libre, no en una jaula</h1>
  <p>Usamos gallineros móviles que se trasladan cada 3 a 4 días para renovar la pastura. Nuestras gallinas tienen acceso diario al aire libre y una alimentación balanceada a base de granos seleccionados — por eso nuestros huevos son distintos.</p>
  <div style="margin-top:18px"><button class="btn primary" onclick="window.location.href='./suscribite.html'">📝 Quiero suscribirme</button> <button class="btn ghost" data-nav="cuenta">👤 Ya soy cliente</button></div>
</section>
<img src="./img/delivery.jpg" alt="Entrega a domicilio Nómades" style="width:100%;border-radius:12px;margin-top:18px;display:block"/>
<section class="grid three" style="margin-top:18px">
  <div class="card"><h3>🌿 Libre pastoreo</h3><p>Acceso diario a pasturas naturales renovadas.</p></div>
  <div class="card"><h3>🚜 Gallinero móvil</h3><p>Rotación periódica: la tierra descansa, la producción es limpia.</p></div>
  <div class="card"><h3>🌾 Alimentación cuidada</h3><p>Granos seleccionados + pastoreo, sin atajos.</p></div>
</section>
<section style="margin-top:18px">
  <h2>Elegí tu plan</h2>
  <div class="grid two" id="planes_home"><p class="muted">Cargando precios…</p></div>
</section>
<section class="card" style="margin-top:18px"><h3>¿Por qué NÓMADES es distinto?</h3><p>La mayoría de los huevos de supermercado vienen de gallinas confinadas todo el día. Acá las gallinas viven al aire libre, se mueven, comen pasto fresco — y eso se nota en el sabor y el color de la yema. Además, cada entrega es trazable: sabés exactamente cuándo se recolectó tu pedido.</p></section>`)
  cargarPreciosHome()
}

async function cargarPreciosHome(){
  const cont = document.querySelector('#planes_home')
  if(!cont) return
  const { data, error } = await supabase.from('plan_prices').select('egg_quantity,price').eq('active', true).order('egg_quantity')
  const planes = (!error && data && data.length) ? data : [{egg_quantity:15,price:7000},{egg_quantity:30,price:12000}]
  cont.innerHTML = planes.map(p => `<div><img src="./img/maple${p.egg_quantity}.jpg" alt="Maple de ${p.egg_quantity} huevos" style="width:100%;border-radius:12px 12px 0 0;display:block"/><div class="card" style="border-radius:0 0 12px 12px;text-align:center"><b>${p.egg_quantity} huevos</b><br>$${Number(p.price).toLocaleString('es-AR')}</div></div>`).join('')
}

const ESTADOS = { pending:'🟡 Pendiente', assigned:'🔵 Asignado', out_for_delivery:'🚚 En reparto', delivered:'🟢 Entregado', incident:'🔴 Incidencia', rescheduled:'🟠 Reprogramado', cancelled:'⚫ Cancelado' }

function cuentaLogin(){
  layout(`<h2>👤 Mi cuenta</h2><div class="card"><p class="muted">Ingresá con tu DNI para ver el estado de tu pedido.</p><div class="field"><label>DNI</label><input id="dni_login" inputmode="numeric" placeholder="Sin puntos" /></div><div id="err_login" class="alert danger" style="display:none"></div><button class="btn primary" id="btn_dni_login">Entrar</button><p class="muted" style="margin-top:14px">¿Todavía no sos cliente? <a href="./suscribite.html">Suscribite acá</a></p></div>`)
  document.querySelector('#btn_dni_login').onclick = async ()=>{
    const dni = document.querySelector('#dni_login').value.trim()
    const box = document.querySelector('#err_login')
    if(!/^\d{7,8}$/.test(dni)){ box.textContent='Ingresá un DNI válido (7 u 8 números, sin puntos).'; box.style.display='block'; return }
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
  const finMes = new Date(hoy.getFullYear(), hoy.getMonth()+1, 0)
  let cursor = fechaInicial
  const fechas = []
  let i = 0
  while(i<40){
    const d = new Date(cursor+'T00:00:00')
    if(d > finMes) break
    if(d >= hoy) fechas.push(cursor)
    cursor = proximaFechaProyectada(cursor, frecuencia)
    i++
  }
  return fechas
}

function cuentaPanel(){
  const c = cuenta.customer
  const next = cuenta.next_order
  const tipoVia = TIPOS_VIA[c.street_type] || 'Calle'
  const hoy = new Date().toISOString().slice(0,10)
  const esHoy = next && next.delivery_date === hoy
  const subActiva = cuenta.subscriptions.find(s=>s.status==='active') || cuenta.subscriptions[0]
  const fechasMes = subActiva && next ? fechasDelMesParaSuscripcion(next.delivery_date, subActiva.frequency) : []
  layout(`<h2>👤 Hola, ${c.first_name}</h2>
  <div id="card_hoy_banner"></div>
  <div class="card"><h3>Tu próximo pedido</h3>${next?`<div class="row"><span>${formatearFecha(next.delivery_date)}</span><span class="badge">${ESTADOS[next.status]||next.status}</span></div><p>${next.quantity_maples||''} maple(s)</p>${next.payment_method?`<div class="alert info">💡 Recordá: el pago es en <b>${METODOS_PAGO_LABEL[next.payment_method]||next.payment_method}</b>.</div>`:''}`:'<p class="muted">No tenés entregas próximas.</p>'}</div>
  ${fechasMes.length?`<div class="card"><h3>📅 Tus entregas este mes</h3>${fechasMes.map((f,i)=>`<div class="row"><span>${formatearFecha(f)}</span>${i===0?'<span class="badge">Confirmada</span>':'<span class="muted" style="font-size:12px">Estimada</span>'}</div>`).join('')}<p class="muted" style="font-size:12px;margin-top:8px">Solo la primera fecha está confirmada como pedido. Las demás son estimadas según tu frecuencia y pueden moverse un poco.</p></div>`:''}
  <div class="card" id="card_subs"><h3>Tus suscripciones</h3>${cuenta.subscriptions.length?cuenta.subscriptions.map(s=>`<div class="row"><span>${s.egg_quantity} huevos · ${FRECUENCIAS[s.frequency]||s.frequency}${s.status==='waitlist'?' · <span class="badge" style="background:#b3841f">🕒 Lista de espera</span>':''}</span><span style="display:flex;flex-direction:column;align-items:flex-end;gap:4px"><span class="badge">${s.payment_status==='paid'?'✅ Pago al día':'🟡 Pago pendiente'}</span><button class="btn ghost" data-cambiar-plan="${s.id}" style="font-size:12px;padding:6px 12px">✏️ Cambiar plan</button></span></div>`).join(''):'<p class="muted">No tenés suscripciones activas.</p>'}</div>
  <div class="card" id="card_pagos"><h3>💳 Historial de pagos</h3><p class="muted">Cargando…</p></div>
  <div class="card" id="card_repartidor"><h3>🚚 Tu repartidor</h3><p class="muted">Cargando…</p></div>
  <div class="card" id="card_datos"><h3>Tus datos</h3><p>🏠 ${tipoVia} ${c.street||''} ${c.street_number||''}</p><p>🏘️ Barrio ${c.neighborhood||'-'}</p><p>📍 ${c.city||'-'}, ${c.province||'-'}, ${c.country||'-'} (CP ${c.postal_code||'-'})</p><p>📍 Zona ${c.zone?c.zone[0].toUpperCase()+c.zone.slice(1):'-'}</p><p>📞 ${c.phone||'-'}</p><p>✉️ ${c.email||'-'}</p><button class="btn ghost" id="btn_editar_datos" style="margin-top:8px">✏️ Editar mis datos</button></div>
  <button class="btn ghost" id="btn_ver_mapa" style="margin-bottom:10px">🗺️ Ver mapa de suscriptores</button>
  <button class="btn ghost" id="btn_logout_cuenta">Cerrar sesión</button>`)
  document.querySelector('#btn_logout_cuenta').onclick = ()=>{ cuenta=null; current='inicio'; render() }
  document.querySelector('#btn_editar_datos').onclick = ()=>editarDatosForm(c)
  document.querySelector('#btn_ver_mapa').onclick = ()=>mapaSuscriptores()
  document.querySelectorAll('[data-cambiar-plan]').forEach(b=>b.onclick = ()=>{
    const sub = cuenta.subscriptions.find(s=>s.id===b.dataset.cambiarPlan)
    if(sub) cambiarPlanForm(sub)
  })
  cargarHistorialPagos(c)
  cargarRepartidor(c, esHoy)
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


async function initAdminMapa(){
  const estado = document.querySelector('#admin_mapa_estado')
  const contenedor = document.querySelector('#admin_mapa_contenedor')
  const sinGeoBox = document.querySelector('#admin_mapa_sin_geo')
  if(!contenedor) return

  try{ await cargarLeaflet() }
  catch(e){ if(estado) estado.textContent = 'No pudimos cargar el mapa. Revisá tu conexión.'; return }

  const { data: clientesRaw } = await supabase.from('customers').select('id,first_name,last_name,phone,neighborhood,street,street_number,zone,latitude,longitude,status').neq('status','baja')
  const clientes = clientesRaw || []
  const conCoords = clientes.filter(c=>c.latitude!=null && c.longitude!=null)
  const sinCoords = clientes.filter(c=>c.latitude==null || c.longitude==null)

  if(estado) estado.textContent = `${conCoords.length} de ${clientes.length} cliente(s) ubicados en el mapa.`

  const centro = conCoords.length ? [conCoords[0].latitude, conCoords[0].longitude] : [-32.9468, -60.6393]
  const map = L.map('admin_mapa_contenedor').setView(centro, conCoords.length ? 12 : 12)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map)

  const grupo = []
  conCoords.forEach(c=>{
    const color = (ZONA_COLORES[c.zone]||{text:'#2F4D2A'}).text
    const marker = L.marker([c.latitude, c.longitude], {
      draggable: true,
      icon: L.divIcon({ className:'', html:`<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 2px rgba(0,0,0,0.5)"></div>`, iconSize:[16,16], iconAnchor:[8,8] })
    }).addTo(map)
    marker.bindPopup(`<b>${c.first_name||''} ${c.last_name||''}</b><br>${c.neighborhood||''} · ${c.street||''} ${c.street_number||''}<br>📞 ${c.phone||'-'}`)
    marker.on('dragend', async ()=>{
      const pos = marker.getLatLng()
      const { data, error } = await supabase.rpc('admin_set_customer_location', { p_customer_id: c.id, p_latitude: pos.lat, p_longitude: pos.lng })
      if(error || !data?.ok){ alert('No se pudo guardar la nueva ubicación.'); return }
      marker.bindPopup(`<b>${c.first_name||''} ${c.last_name||''}</b><br>📍 Ubicación actualizada`).openPopup()
    })
    grupo.push(marker)
  })
  if(grupo.length>1){ map.fitBounds(L.featureGroup(grupo).getBounds().pad(0.2)) }

  if(sinGeoBox){
    sinGeoBox.innerHTML = sinCoords.length ? `<h3 style="font-size:15px">Sin ubicar todavía (${sinCoords.length})</h3>${sinCoords.map(c=>`<div class="row"><span>${c.first_name||''} ${c.last_name||''}<br><small>${c.street||''} ${c.street_number||''}, ${c.neighborhood||''}</small></span><button class="btn ghost" data-geocodificar="${c.id}" style="font-size:12px">📍 Ubicar</button></div>`).join('')}` : ''
    sinGeoBox.querySelectorAll('[data-geocodificar]').forEach(b=>b.onclick=async()=>{
      const cli = sinCoords.find(c=>c.id===b.dataset.geocodificar)
      if(!cli) return
      b.textContent = 'Buscando…'
      const direccion = `${cli.street||''} ${cli.street_number||''}, ${cli.neighborhood||''}, Rosario, Santa Fe, Argentina`
      const geo = await geocodificarDireccion(direccion)
      if(!geo){ b.textContent = 'No encontrado ✏️ arrastrá manualmente'; return }
      const { data, error } = await supabase.rpc('admin_set_customer_location', { p_customer_id: cli.id, p_latitude: geo.lat, p_longitude: geo.lon })
      if(error || !data?.ok){ b.textContent = 'Error'; return }
      initAdminMapa()
    })
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
    const direccion = `${c.street||''} ${c.street_number||''}, ${c.city||'Rosario'}, ${c.province||'Santa Fe'}, Argentina`
    const geo = await geocodificarDireccion(direccion)
    if(geo){
      c.latitude = geo.lat; c.longitude = geo.lon
      await supabase.rpc('customer_set_location', { p_dni: c.dni, p_customer_id: c.id, p_latitude: geo.lat, p_longitude: geo.lon })
    }
  }

  const { data: puntos } = await supabase.rpc('public_subscribers_map')
  const lista = puntos || []
  const estado = document.querySelector('#mapa_estado')
  estado.textContent = `Somos ${lista.length} suscriptor${lista.length===1?'':'es'} de huevos de libre pastoreo en la zona 🐔`

  const centro = (c.latitude && c.longitude) ? [c.latitude, c.longitude] : [-32.9468, -60.6393]
  const map = L.map('mapa_contenedor').setView(centro, c.latitude ? 14 : 12)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map)

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
  const box = document.querySelector('#card_subs')
  box.innerHTML = `<h3>Cambiar plan</h3><p class="muted">Cargando opciones…</p>`
  if(!planesDisponibles.length){
    const { data } = await supabase.from('plan_prices').select('egg_quantity,price').eq('active', true).order('egg_quantity')
    planesDisponibles = data || [{egg_quantity:15,price:7000},{egg_quantity:30,price:12000}]
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
    document.querySelector('#btn_cancelar_cambio').onclick = ()=>cuentaPanel()
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
      alert(data.status==='active' ? '✅ Plan actualizado. Próxima entrega: '+data.next_delivery_date : '🕒 Quedaste en lista de espera para la ampliación de tu plan.')
      cuentaPanel()
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
  const label = zona ? zona[0].toUpperCase()+zona.slice(1) : 'Sin zona'
  return `<span style="background:${c.bg};color:${c.text};font-size:11px;font-weight:700;padding:2px 9px;border-radius:6px;white-space:nowrap">${label}</span>`
}

// --- Sistema visual premium para el panel de administración ---
function pCard(inner, extraStyle){ return `<div style="background:#FFFFFF;border-radius:14px;border:1px solid #E3DCC8;padding:14px 16px;margin-bottom:10px;${extraStyle||''}">${inner}</div>` }
function pPill(text, bg, color){ return `<span style="background:${bg||'#EAF0DC'};color:${color||'#2F4D2A'};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap;display:inline-block">${text}</span>` }
function pAvatar(nombre, size){ const s=size||40; const inicial=(nombre||'?').trim().charAt(0).toUpperCase(); return `<div style="width:${s}px;height:${s}px;border-radius:50%;background:#2F4D2A;color:#F5EFE0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${Math.round(s*0.4)}px;flex-shrink:0">${inicial}</div>` }
function pBar(pct, colorOk, colorWarn, warn){ const p=Math.max(0,Math.min(100,pct)); return `<div style="height:6px;background:#E3DCC8;border-radius:3px;overflow:hidden;margin-top:4px"><div style="height:100%;width:${p}%;background:${warn?(colorWarn||'#E8833A'):(colorOk||'#8FAE6B')};border-radius:3px"></div></div>` }
function pBtn(icon, label, attrs, variant){
  const styles = { primary:'background:#2F4D2A;color:#F5EFE0;border:none', ghost:'background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8', danger:'background:#FFFFFF;color:#B03A2E;border:1px solid #E3DCC8' }
  return `<button ${attrs} style="flex:1;${styles[variant||'ghost']};border-radius:10px;padding:9px 4px;font-size:11px;font-weight:600;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:0">${icon}<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${label}</span></button>`
}
function pBtnRow(buttons){ return `<div style="display:flex;gap:8px;margin-top:10px">${buttons.join('')}</div>` }

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
    const res = await fetch(url)
    const data = await res.json()
    const nombres = [...new Set((data.localidades||[]).map(l=>l.nombre))].sort((a,b)=>a.localeCompare(b,'es'))
    grp.innerHTML = `<label>Localidad</label><select id="ed_city">
      <option value="">Seleccioná tu localidad</option>
      ${nombres.map(n=>`<option value="${n}" ${citySel===n?'selected':''}>${n}</option>`).join('')}
    </select>`
    document.querySelector('#ed_city').onchange = (e)=>{ citySelValue = e.target.value }
  }catch(e){
    grp.innerHTML = `<label>Localidad</label><select id="ed_city"><option value="">No se pudo cargar</option></select>`
  }
}
let citySelValue = ''

function editarDatosForm(c){
  let zonaSel = c.zone || ''
  let viaSel = c.street_type || 'calle'
  citySelValue = c.city || ''
  const box = document.querySelector('#card_datos')
  box.innerHTML = `<h3>Editar mis datos</h3>
    <div class="field"><label>Teléfono</label><input id="ed_phone" value="${c.phone||''}"/></div>
    <div class="field"><label>Email</label><input id="ed_email" value="${c.email||''}"/></div>
    <div class="field"><label>Tipo de vía</label><div class="grid three" id="ed_via_group">${TIPOS_VIA_OPCIONES.map(t=>`<button type="button" class="btn ${viaSel===t.value?'primary':'ghost'}" data-via="${t.value}">${t.label}</button>`).join('')}</div></div>
    <div class="field"><label>Nombre de la calle</label><input id="ed_street" value="${c.street||''}"/></div>
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
  document.querySelector('#ed_province').onchange = (e)=>{
    citySelValue = ''
    if(e.target.value) cargarLocalidadesEdit(e.target.value, '')
  }
  if(c.province) cargarLocalidadesEdit(c.province, c.city || '')
  document.querySelector('#btn_cancelar_edit').onclick = ()=>cuentaPanel()
  document.querySelector('#btn_guardar_datos').onclick = async ()=>{
    const errBox = document.querySelector('#err_edit')
    const payload = {
      p_dni: c.dni,
      p_customer_id: c.id,
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
    if(error || !data?.ok){ errBox.textContent='No pudimos guardar los cambios. Probá de nuevo.'; errBox.style.display='block'; return }
    Object.assign(c, { phone: payload.p_phone||c.phone, email: payload.p_email||c.email, street: payload.p_street||c.street, street_number: payload.p_street_number||c.street_number, neighborhood: payload.p_neighborhood||c.neighborhood, zone: payload.p_zone||c.zone, street_type: payload.p_street_type||c.street_type, city: payload.p_city||c.city, province: payload.p_province||c.province, country: payload.p_country||c.country, postal_code: payload.p_postal_code||c.postal_code })
    cuentaPanel()
  }
}

const ROLES_STAFF = [
  { value: 'admin', label: 'Administrador' },
  { value: 'campo', label: 'Personal de campo' },
  { value: 'repartidor', label: 'Repartidor' }
]

function staffLogin(){
  let rolSel = ''
  layout(`<h2>Acceso del equipo</h2><div class="card">
    <div class="field"><label>¿Cuál es tu rol?</label>
      <div class="grid three" id="staff_role_group">${ROLES_STAFF.map(r=>`<button type="button" class="btn ghost" data-role="${r.value}">${r.label}</button>`).join('')}</div>
    </div>
    <div class="field"><label>Código de acceso</label><input id="staff_code" autocomplete="off" placeholder="Ej: A3K9T2XZ" style="text-transform:uppercase"/></div>
    <div id="err_staff" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_staff_login">Ingresar</button>
  </div>`)
  document.querySelectorAll('#staff_role_group [data-role]').forEach(b=> b.onclick = ()=>{
    rolSel = b.dataset.role
    document.querySelectorAll('#staff_role_group [data-role]').forEach(x=> x.className = 'btn ' + (x.dataset.role===rolSel?'primary':'ghost'))
  })
  document.querySelector('#btn_staff_login').onclick = async ()=>{
    const code = document.querySelector('#staff_code').value.trim().toUpperCase()
    const box = document.querySelector('#err_staff')
    if(!rolSel){ box.textContent='Elegí tu rol.'; box.style.display='block'; return }
    if(!code){ box.textContent='Ingresá tu código de acceso.'; box.style.display='block'; return }
    const email = `staff-${code.toLowerCase()}@nomades.internal`
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: code })
    if(error){ box.textContent='Código incorrecto o vencido.'; box.style.display='block'; return }
    const { data: roleRow } = await supabase.from('staff_roles').select('*').eq('user_id', data.user.id).single()
    if(!roleRow){ box.textContent='Este código no tiene un rol asignado.'; box.style.display='block'; await supabase.auth.signOut(); return }
    if(roleRow.role !== rolSel){ box.textContent='Ese código no corresponde al rol seleccionado.'; box.style.display='block'; await supabase.auth.signOut(); return }
    session = data.session
    myRole = roleRow.role
    staffProfile = roleRow
    current = roleRow.profile_completed ? (myRole==='campo' ? 'campo' : myRole==='repartidor' ? 'repartidor' : 'admin') : 'staff-profile-setup'
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
    const res = await fetch(url)
    const data = await res.json()
    const nombres = [...new Set((data.localidades||[]).map(l=>l.nombre))].sort((a,b)=>a.localeCompare(b,'es'))
    grp.innerHTML = `<label>Localidad *</label><select id="sf_city">
      <option value="">Seleccioná tu localidad</option>
      ${nombres.map(n=>`<option value="${n}" ${citySel===n?'selected':''}>${n}</option>`).join('')}
    </select>`
    document.querySelector('#sf_city').onchange = (e)=>{ staffCitySelValue = e.target.value }
  }catch(e){
    grp.innerHTML = `<label>Localidad *</label><select id="sf_city"><option value="">No se pudo cargar</option></select>`
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
  if(!isSetup) document.querySelector('#btn_cancelar_perfil').onclick = ()=>{ current = myRole==='campo'?'campo':myRole==='repartidor'?'repartidor':'admin'; render() }
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
    current = myRole==='campo'?'campo':myRole==='repartidor'?'repartidor':'admin'
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
  const { data: staffRaw } = await supabase.from('staff_roles').select('user_id,full_name').in('role',['repartidor','admin'])
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
    alert('Service guardado ✅')
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
    if(data.alerta_service) alert(`⛽ Carga guardada ✅\n\n⚠️ Atención: faltan ${Math.round(data.faltan_km)} km para el próximo service.`)
    else alert('⛽ Carga guardada ✅')
    render()
  }
}

async function campo(){
  const today = new Date().toISOString().slice(0,10)
  const recientes = await q('production','id,production_date,eggs_count,maples_count,losses_count,notes')
  const { data: productosRaw } = await supabase.from('products').select('id,name,unit_label,current_qty,active').eq('active',true).order('name')
  const productos = productosRaw || []
  layout(`<h2>🥚 Personal de campo</h2>
  <div class="card"><h3>Registrar recolección de hoy</h3>
    <div class="field"><label>Fecha</label><input id="p_date" type="date" value="${today}"/></div>
    <div class="grid two">
      <div class="field"><label>Huevos recolectados</label><input id="p_eggs" type="number" min="0" /></div>
      <div class="field"><label>Roturas/defectuosos</label><input id="p_losses" type="number" min="0" value="0"/></div>
    </div>
    <div class="field"><label>Observaciones</label><textarea id="p_notes" rows="2" placeholder="Ej: cambio de parcela, incidencia sanitaria, etc."></textarea></div>
    <div id="err_campo" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_guardar_produccion">Guardar</button>
  </div>
  <div class="card"><h3>Últimos registros</h3>${recientes.length?recientes.slice(-10).reverse().map(r=>`<div class="row"><span>${r.production_date}</span><span>${r.eggs_count} huevos · ${r.losses_count||0} roturas</span></div>`).join(''):'<p class="muted">Todavía no hay registros.</p>'}</div>
  <div class="card"><h3>🧺 Insumos disponibles</h3>
    ${productos.length? productos.map(p=>`<div class="row"><span><b>${p.current_qty}</b> × ${p.unit_label}<br><small>${p.name}</small></span><span style="display:flex;gap:6px;align-items:center"><input type="number" min="0.01" step="0.5" value="1" id="uso_qty_${p.id}" style="width:60px"/><button class="btn ghost" data-usar="${p.id}">Usar</button></span></div>`).join('') : '<p class="muted">Todavía no hay insumos cargados.</p>'}
  </div>`)
  document.querySelector('#btn_guardar_produccion').onclick = async ()=>{
    const eggs = Number(document.querySelector('#p_eggs').value)
    const losses = Number(document.querySelector('#p_losses').value)||0
    const date = document.querySelector('#p_date').value
    const notes = document.querySelector('#p_notes').value.trim()
    const box = document.querySelector('#err_campo')
    if(!eggs || eggs<=0){ box.textContent='Ingresá la cantidad de huevos recolectados.'; box.style.display='block'; return }
    const maples = Math.round((eggs/30)*10)/10
    const { error } = await supabase.from('production').insert({ production_date:date, eggs_count:eggs, maples_count:maples, losses_count:losses, notes: notes||null })
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    alert('Registro guardado ✅'); render()
  }
  document.querySelectorAll('[data-usar]').forEach(b=>b.onclick=async()=>{
    const id=b.dataset.usar
    const qty=Number(document.querySelector(`#uso_qty_${id}`).value)
    if(!qty||qty<=0){ alert('Ingresá una cantidad válida.'); return }
    const { error } = await supabase.from('stock_movements').insert({ product_id:id, type:'consumo', quantity:qty, created_by: session.user.id })
    if(error){ alert('No se pudo registrar: '+error.message); return }
    alert('Uso registrado ✅'); render()
  })
}

async function clientes(){
  const rows=await q('customers','id,first_name,last_name,phone,neighborhood,status')
  layout(`<h2>Clientes</h2><div class="card"><div class="row"><b>Cliente</b><b>Barrio / Estado</b></div>${rows.length?rows.map(r=>`<div class="row"><span>${r.first_name||''} ${r.last_name||''}<br><small>${r.phone||''}</small></span><span>${r.neighborhood||'-'} · <span class="badge">${r.status||'activo'}</span></span></div>`).join(''):'<p class="muted">Sin datos todavía.</p>'}</div>`)
}

async function pedidos(){
  const rows=await q('orders','id,delivery_date,status,quantity_maples,assigned_driver,assignment_locked,customers(first_name,last_name,neighborhood,street,street_number)')
  const { data: staffRaw } = await supabase.from('staff_roles').select('user_id,full_name').eq('role','repartidor')
  const staffMap = Object.fromEntries((staffRaw||[]).map(s=>[s.user_id, s.full_name||'(sin nombre)']))
  layout(`<h2>Pedidos</h2><div class="card">${rows.length?rows.map(r=>{const c=r.customers||{};const rep=r.assigned_driver?(staffMap[r.assigned_driver]||'(repartidor desconocido)'):'Sin asignar';return `<div class="row"><span><b>${c.first_name||''} ${c.last_name||''}</b><br><small>${c.neighborhood||''} · ${c.street||''} ${c.street_number||''}</small><br><small>🚚 ${rep}${r.assignment_locked?' 🔒':''}</small></span><span>${r.quantity_maples||0} maple(s) · <span class="badge">${ESTADOS[r.status]||r.status}</span></span></div>`}).join(''):'<p class="muted">No hay pedidos cargados.</p>'}</div><p class="muted" style="margin-top:10px">Para reasignar repartidores, andá a Administración → 🚚 Asignación de repartidores.</p>`)
}

async function repartidor(){
  const rows=await q('orders','id,status,delivery_date,time_window_start,time_window_end,important_note,assigned_driver,customers(id,first_name,last_name,phone,neighborhood,street,street_number)')
  const grouped={}
  rows.filter(r=>['pending','assigned','out_for_delivery','rescheduled'].includes(r.status) && (myRole==='admin' || r.assigned_driver===session?.user?.id)).forEach(r=>{
    const c=r.customers||{}; const b=c.neighborhood||'Sin barrio'; const s=c.street||'Sin calle';
    grouped[b]??={}; grouped[b][s]??=[]; grouped[b][s].push(r)
  })
  const html=Object.entries(grouped).map(([b,streets])=>`<div class="card group"><h3>📍 ${b}</h3>${Object.entries(streets).sort((a,b)=>b[1].length-a[1].length).map(([s,rs])=>`<div class="group"><div class="row"><b>${s}</b><span class="badge">${rs.length} entrega(s)</span></div>${rs.map(r=>{const c=r.customers||{};return `<div class="row"><span><b>${c.street_number||''}</b> · ${c.first_name||''} ${c.last_name||''}<br><small>${c.phone||''}</small>${r.important_note?`<div class="alert warning">⚠️ ${r.important_note}</div>`:''}</span><button class="btn primary" data-delivery="${r.id}">Abrir</button></div>`}).join('')}</div>`).join('')}</div>`).join('')
  layout(`<h2>🚚 Ruta del día</h2><button class="btn ghost" id="btn_ver_mapa_repartidor" style="margin-bottom:12px">🗺️ Ver mapa de hoy</button><div class="alert warning"><b>⚠️ ATENCIÓN HOY</b><br>Las restricciones horarias y observaciones importantes aparecen destacadas.</div>${html||'<div class="card"><p class="muted">No hay entregas pendientes.</p></div>'}`)
  document.querySelectorAll('[data-delivery]').forEach(b=>b.onclick=()=>openDelivery(b.dataset.delivery))
  document.querySelector('#btn_ver_mapa_repartidor').onclick = ()=>mapaRepartidor()
}

let repMapaFecha = null
let repMostrarProyeccion = false
let statsVehiculoActual = null
let vehiculoEditando = null
let historialVehiculoActual = null

async function verHistorialVehiculo(v){
  historialVehiculoActual = v
  current = 'vehiculo-historial'
  render()
}

async function vehiculoHistorial(){
  const v = historialVehiculoActual
  if(!v){ current='admin'; return render() }
  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><button class="btn ghost" id="btn_volver_historial" style="padding:6px 12px">← Volver</button><h2 style="margin:0">📄 Historial de ${v.plate}</h2></div>
  <button class="btn primary" id="btn_imprimir_historial" style="width:100%;margin-bottom:14px">🖨️ Imprimir / Guardar como PDF</button>
  <div id="historial_contenido"><p class="muted">Cargando…</p></div>`)
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
    <div class="card">
      <h3>${v.brand||''} ${v.model||''} — ${v.plate}</h3>
      <p>Kilómetros actuales: ${Math.round(v.current_km)} km</p>
    </div>
    <div class="card"><h3>Historial de service y mantenimiento</h3>
      ${servicios.length? servicios.map(s=>{
        const fecha = new Date(s.service_date+'T00:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'})
        return `<div class="row"><span><b>${fecha}</b> · ${Math.round(s.km||0)} km<br><small>${s.description||''}</small>${s.parts_used?`<br><small>🔩 ${s.parts_used}</small>`:''}<br><small>Responsable: ${staffMap[s.responsible_id]||'-'}</small></span><span>${s.cost?`$${Number(s.cost).toLocaleString('es-AR')}`:''}<br><small>${METODOS_PAGO_LABEL[s.payment_method]||s.payment_method||''}${s.paid_by==='admin'?' · Administración':''}</small></span></div>`
      }).join('') : '<p class="muted">Sin registros todavía.</p>'}
    </div>`
}

async function verEstadisticasVehiculo(v){
  statsVehiculoActual = v
  current = 'vehiculo-stats'
  render()
}

async function vehiculoStats(){
  const v = statsVehiculoActual
  if(!v){ current='admin'; return render() }
  layout(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><button class="btn ghost" id="btn_volver_stats" style="padding:6px 12px">← Volver</button><h2 style="margin:0">📊 ${v.plate}</h2></div>
  <div id="stats_contenido" class="card"><p class="muted">Calculando…</p></div>`)
  document.querySelector('#btn_volver_stats').onclick = ()=>{ current='admin'; adminOpenSection='vehiculos'; render() }

  const { data } = await supabase.rpc('vehicle_stats', { p_vehicle_id: v.id })
  const box = document.querySelector('#stats_contenido')
  if(!data || data.cargas < 2){
    box.innerHTML = `<p class="muted">Todavía no hay suficientes cargas registradas para calcular estadísticas (hacen falta al menos 2).</p>`
    return
  }
  box.innerHTML = `
    <h3>Kilómetros recorridos</h3>
    <div class="grid three">
      <div class="card stat">Por día<b>${data.km_por_dia ?? '-'}</b></div>
      <div class="card stat">Por mes<b>${data.km_por_mes ?? '-'}</b></div>
      <div class="card stat">Por año<b>${data.km_por_anio ?? '-'}</b></div>
    </div>
    <p class="muted" style="margin-top:8px">Calculado sobre ${data.km_totales} km en ${data.dias_totales} día(s), con ${data.cargas} carga(s) registradas.</p>
    <h3 style="margin-top:16px">Rendimiento</h3>
    <div class="row"><span>Kilómetros por litro</span><span><b>${data.km_por_litro ?? '-'} km/L</b></span></div>
    <div class="row"><span>Costo por kilómetro</span><span><b>${data.costo_por_km?`$${Number(data.costo_por_km).toLocaleString('es-AR')}`:'-'}</b></span></div>
    <div class="row"><span>Litros cargados (total)</span><span>${data.litros_totales ?? '-'}</span></div>
    <div class="row"><span>Gasto en combustible (total)</span><span>$${Number(data.gasto_total||0).toLocaleString('es-AR')}</span></div>
    ${data.por_mes?.length?`<h3 style="margin-top:16px">Últimos meses</h3>${data.por_mes.map(m=>`<div class="row"><span>${m.mes}</span><span>${Math.round(m.km)} km</span></div>`).join('')}`:''}
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
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map)

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

async function openDelivery(id){
  const { data: detalle, error: errDet } = await supabase.rpc('delivery_detail', { p_order_id: id })
  if(errDet || !detalle || detalle.error) return alert('No se pudo cargar el pedido')
  const r = detalle.order, c = detalle.customer, sub = detalle.subscription || {}
  const { data: settingsRaw } = await supabase.from('farm_settings').select('key,value').in('key',['transfer_cbu','transfer_alias','transfer_bank_name','transfer_holder_name','transfer_holder_doc','mp_alias','mp_wallet_name','mp_cbu','mp_holder_name','mp_holder_doc'])
  const cfg = Object.fromEntries((settingsRaw||[]).map(s=>[s.key,s.value]))
  const montoDefault = sub.price_at_signup || 0
  layout(`<h2>Detalle de entrega</h2>${r.important_note?`<div class="alert warning"><b>⚠️ OBSERVACIÓN IMPORTANTE</b><br>${r.important_note}</div>`:''}
  <div class="grid two">
    <div class="card">
      <h3>${c.street||''} ${c.street_number||''}</h3>
      <p>${c.first_name||''} ${c.last_name||''}</p>
      <p>📞 ${c.phone||'-'}</p>
      <p>📦 ${FRECUENCIAS[sub.frequency]||sub.frequency||'-'} · ${sub.egg_quantity||'-'} huevos${sub.plan_breakdown?` (${sub.plan_breakdown.map(b=>`${b.qty}×${b.size}`).join(' + ')})`:''}</p>
      <p>💰 A cobrar: <b>$${Number(montoDefault).toLocaleString('es-AR')}</b></p>
      <p>💳 Método configurado: <b>${METODOS_PAGO_LABEL[sub.payment_method]||sub.payment_method||'-'}</b></p>
      <button class="btn ghost" onclick="window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('${(c.street||'')+' '+(c.street_number||'')+' '+(c.neighborhood||'')}'),'_blank')">📍 Google Maps</button>
    </div>
    <div class="card">
      <h3>Confirmar entrega</h3>
      <div class="field"><label>DNI de quien recibe</label><input id="dni" autocomplete="off" /></div>
      <button class="btn primary" id="validate">Validar DNI</button>
      <div id="validation" style="margin-top:12px"></div>
      <div class="field" style="margin-top:12px"><label>Monto cobrado</label><input id="monto_cobrado" type="number" value="${montoDefault}"/></div>
      <div class="field"><label>¿Con qué método pagó?</label>
        <div class="grid three" id="metodo_group">
          <button type="button" class="btn ${sub.payment_method==='cash'?'primary':'ghost'}" data-metodo="cash">Efectivo</button>
          <button type="button" class="btn ${sub.payment_method==='transfer'?'primary':'ghost'}" data-metodo="transfer">Transferencia</button>
          <button type="button" class="btn ${sub.payment_method==='mp'?'primary':'ghost'}" data-metodo="mp">Mercado Pago</button>
        </div>
      </div>
      <div id="datos_transferencia"></div>
      <div id="err_confirm" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="confirm" style="width:100%;margin-top:12px" disabled>✅ Confirmar entrega</button>
      <button class="btn ghost" id="failed" style="width:100%;margin-top:8px">❌ No pude entregar</button>
    </div>
  </div>`)
  let receiverId=null
  let metodoSel = sub.payment_method || 'cash'
  let comprobanteFile = null
  let comprobanteUrl = ''

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
  document.querySelectorAll('#metodo_group [data-metodo]').forEach(b=> b.onclick = ()=>{
    metodoSel = b.dataset.metodo
    document.querySelectorAll('#metodo_group [data-metodo]').forEach(x=> x.className = 'btn '+(x.dataset.metodo===metodoSel?'primary':'ghost'))
    comprobanteFile = null
    renderDatosTransferencia()
  })

  document.querySelector('#validate').onclick=async()=>{
    const dni=document.querySelector('#dni').value.trim()
    const {data,error}=await supabase.rpc('validate_delivery_receiver',{p_order_id:id,p_dni:dni})
    const out=document.querySelector('#validation')
    if(error||!data?.valid){out.innerHTML='<div class="alert danger">❌ DNI no autorizado.</div>';return}
    receiverId=data.receiver_id; out.innerHTML=`<div class="alert info">✅ Identidad validada: <b>${data.receiver_name}</b></div>`; document.querySelector('#confirm').disabled=false
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
    alert('Entrega confirmada ✅'); current='repartidor'; render()
  }
  document.querySelector('#failed').onclick=async()=>{
    const motivos = ['Ausente','No responde','DNI no autorizado','Dirección incorrecta','Cliente no pudo pagar','Otro']
    const idx = prompt('Motivo:\n'+motivos.map((m,i)=>`${i+1}. ${m}`).join('\n')+'\n\nEscribí el número:')
    const reason = motivos[Number(idx)-1]
    if(!reason)return
    const {error}=await supabase.from('delivery_attempts').insert({order_id:id,status:'failed',failure_reason:reason,driver_id:session.user.id})
    if(error)return alert(error.message)
    await supabase.from('orders').update({status:'incident'}).eq('id',id)
    alert('Incidencia registrada'); current='repartidor'; render()
  }
}

let adminData = null // cache de datos del panel admin, para no re-consultar todo al abrir/cerrar secciones
let adminAsignarFecha = '' // filtro de fecha para "Reasignar pedidos puntuales"

async function fetchAdminData(){
  const [orders,customers,subs,staff]=await Promise.all([q('orders','id,status'),q('customers','id'),q('subscriptions','id,payment_status,created_at,customers(first_name,last_name)'),q('staff_roles','user_id,role,full_name,created_at')])
  const productos = await q('products','id,name,unit_label,category,current_qty,active')
  const { data: movimientosRaw } = await supabase.from('stock_movements').select('id,product_id,type,quantity,note,created_by,created_at').order('created_at',{ascending:false}).limit(20)
  const movimientos = movimientosRaw || []
  const { data: waitlistRaw } = await supabase.from('waitlist').select('id,customer_id,egg_quantity,frequency,position,created_at,customers(first_name,last_name,phone)').order('position')
  const waitlist = waitlistRaw || []
  const { data: settingsAllRaw } = await supabase.from('farm_settings').select('key,value').in('key',['default_daily_capacity_maples','transfer_cbu','transfer_alias','transfer_bank_name','transfer_holder_name','transfer_holder_doc','mp_alias','mp_wallet_name','mp_cbu','mp_holder_name','mp_holder_doc','assignment_mode'])
  const settingsMap = Object.fromEntries((settingsAllRaw||[]).map(s=>[s.key,s.value]))
  const repartidores = staff.filter(s=>s.role==='repartidor')
  const { data: zoneDriversRaw } = await supabase.from('zone_drivers').select('zone,driver_user_id')
  const zoneDrivers = Object.fromEntries((zoneDriversRaw||[]).map(z=>[z.zone,z.driver_user_id]))
  const { data: neighDriversRaw } = await supabase.from('neighborhood_drivers').select('neighborhood,driver_user_id')
  const neighDrivers = neighDriversRaw || []
  const { data: barriosRaw } = await supabase.from('customers').select('neighborhood,zone').not('neighborhood','is',null)
  const barrios = [...new Set((barriosRaw||[]).map(b=>b.neighborhood).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'))
  const barrioZonaMap = {}
  ;(barriosRaw||[]).forEach(b=>{ if(b.neighborhood && b.zone && !barrioZonaMap[b.neighborhood]) barrioZonaMap[b.neighborhood] = b.zone })
  const { data: pedidosAsignarRaw } = await supabase.from('orders').select('id,delivery_date,status,assigned_driver,assignment_locked,egg_quantity,customers(first_name,last_name,neighborhood,zone,street,street_number),subscriptions(frequency,plan_breakdown)').in('status',['pending','assigned','rescheduled']).order('delivery_date')
  const pedidosAsignar = pedidosAsignarRaw || []
  const { data: pagosRaw } = await supabase.from('payments').select('id,amount,expected_method,method,reconciled,created_at,customers(first_name,last_name)').order('created_at',{ascending:false}).limit(30)
  const pagos = pagosRaw || []
  const productMap = Object.fromEntries(productos.map(p=>[p.id, p]))
  const { data: planPricesRaw } = await supabase.from('plan_prices').select('id,egg_quantity,price,active').order('egg_quantity')
  const planPrices = planPricesRaw || []
  const { data: catsRaw } = await supabase.from('finance_categories').select('id,name,type,active').order('name')
  const categorias = catsRaw || []
  const { data: entriesRaw } = await supabase.from('finance_entries').select('id,category_id,type,amount,entry_date,description,attachment_url').order('entry_date',{ascending:false}).limit(30)
  const movimientosFinanzas = entriesRaw || []
  const { data: dashboardRaw } = await supabase.rpc('finance_dashboard', {})
  const dash = dashboardRaw || {}
  const { data: vehiculosRaw } = await supabase.from('vehicles').select('id,type,brand,model,year,plate,photo_url,current_km,service_interval_km,last_service_km,vtv_expiry,insurance_expiry,assigned_to,active,mechanic_name,mechanic_phone,mechanic_appointment_phone,mechanic_address,mechanic_hours,mechanic_email,mechanic_tax_id').order('created_at')
  const vehiculos = vehiculosRaw || []
  const { data: alertasVehiculos } = await supabase.rpc('admin_vehicle_alerts', {})
  const alertas = alertasVehiculos || { service:[], vtv:[], seguro:[], carnet:[], pagos_pendientes:[] }
  return { orders,customers,subs,staff,productos,movimientos,waitlist,settingsMap,repartidores,zoneDrivers,neighDrivers,barrios,barrioZonaMap,pedidosAsignar,pagos,productMap,planPrices,categorias,movimientosFinanzas,dash,vehiculos,alertas }
}

async function admin(){
  if(!adminData) adminData = await fetchAdminData()
  const { orders,customers,subs,staff,productos,movimientos,waitlist,settingsMap,repartidores,zoneDrivers,neighDrivers,barrios,barrioZonaMap,pedidosAsignar,pagos,productMap,planPrices,categorias,movimientosFinanzas,dash,vehiculos,alertas } = adminData
  const capacidadBase = settingsMap.default_daily_capacity_maples || '300'
  const assignmentMode = settingsMap.assignment_mode || 'zone'
  const staffMap = Object.fromEntries(staff.map(s=>[s.user_id, s.full_name||'(sin nombre)']))
  const CATEGORIAS = [{value:'alimento',label:'Alimento'},{value:'sanidad',label:'Sanidad'},{value:'limpieza',label:'Limpieza'},{value:'otro',label:'Otro'}]
  const CATLABEL = {alimento:'Alimento',sanidad:'Sanidad',limpieza:'Limpieza',otro:'Otro'}
  const categoriaMap = Object.fromEntries(categorias.map(c=>[c.id,c]))
  const TIPO_CAT_LABEL = { fixed:'Fijo', variable:'Variable', income:'Ingreso' }
  const count=s=>orders.filter(x=>x.status===s).length
  const pendientesDePago = subs.filter(s=>s.payment_status==='pending')
  const rolLabel = {admin:'Administrador',campo:'Personal de campo',repartidor:'Repartidor'}
  const AS = (id)=> adminOpenSection===id
  const accHead = (id, icon, titulo, badge)=> `<button type="button" class="acc-header" data-acc="${id}" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:14px 16px;cursor:pointer;gap:10px;background:${AS(id)?'#F5EFE0':'transparent'}"><span style="width:32px;height:32px;border-radius:9px;background:#EAF0DC;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">${icon}</span><span style="flex:1;font-weight:700;font-size:14.5px;color:#2F4D2A">${titulo}</span>${badge?pPill(badge,'#FBE4CC','#B85C00'):''}<span style="font-size:13px;color:#8A8570">${AS(id)?'▲':'▼'}</span></button><div style="display:${AS(id)?'block':'none'};padding:4px 16px 16px 16px">`
  const statCard = (id,label,value)=> `<div data-stat="${id}" style="cursor:pointer;flex:0 0 auto;min-width:96px;background:#2F4D2A;border-radius:14px;padding:10px 14px;display:flex;flex-direction:column;gap:2px"><span style="color:#C9D8B0;font-size:11px;line-height:1.25">${label}</span><span style="color:#F5EFE0;font-size:20px;font-weight:700;line-height:1.15">${value}</span></div>`
  layout(`<h2>Panel de administración</h2>
  <div style="overflow-x:auto;display:flex;gap:8px;padding-bottom:4px">
    ${statCard('clientes','Clientes',customers.length)}
    ${statCard('pend_entrega','Pend. entrega',count('pending')+count('assigned')+count('out_for_delivery'))}
    ${statCard('pend_pago','Pend. pago',pendientesDePago.length)}
    ${statCard('entregados','Entregados',count('delivered'))}
    ${statCard('incidencias','Incidencias',count('incident'))}
    ${statCard('reprogramados','Reprogramados',count('rescheduled'))}
  </div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:14px">
  ${accHead('personal','👥','Gestión de personal')}
    <div class="grid two">
      <div class="field"><label>Nombre</label><input id="staff_new_name"/></div>
      <div class="field"><label>Rol</label><select id="staff_new_role"><option value="campo">Personal de campo</option><option value="repartidor">Repartidor</option><option value="admin">Administrador</option></select></div>
    </div>
    <div class="field"><label>Código de acceso (opcional — si lo dejás vacío, se genera uno automático)</label><input id="staff_new_code" placeholder="Ej: 123 (mín. 3 caracteres, letras o números)"/></div>
    <button class="btn primary" id="btn_crear_staff">➕ Generar código de acceso</button>
    <div id="codigo_generado" style="margin-top:10px"></div>
    <div style="margin-top:16px">${staff.length?staff.map(s=>{
      const esVos = session && s.user_id === session.user.id
      return pCard(`
        <div style="display:flex;align-items:center;gap:10px">
          ${pAvatar(s.full_name)}
          <div style="flex:1">
            <div style="font-weight:700;color:#2F4D2A">${s.full_name||'(sin nombre)'}</div>
            <div style="display:flex;gap:6px;margin-top:3px">${pPill(rolLabel[s.role]||s.role)}${esVos?pPill('Vos','#2F4D2A','#F5EFE0'):''}</div>
          </div>
        </div>
        ${esVos?`<p class="muted" style="font-size:12px;margin-top:10px">Para cambiar tu propio código, cerrá sesión y usá "Acceso del equipo" con tu código actual.</p>`:pBtnRow([pBtn('🔄','Nuevo código',`data-reset="${s.user_id}"`,'ghost'), pBtn('❌','Revocar',`data-revoke="${s.user_id}"`,'danger')])}
      `)
    }).join(''):'<p class="muted">Todavía no agregaste personal.</p>'}</div>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('mapa','🗺️','Mapa de clientes')}
    <div id="admin_mapa_estado" class="muted" style="margin-bottom:8px">Cargando mapa…</div>
    <div id="admin_mapa_contenedor" style="height:340px;border-radius:12px;overflow:hidden;background:#eee"></div>
    <p class="muted" style="font-size:12px;margin-top:8px">🟢 Norte · 🟠 Sur · 🟣 Oeste · 🟡 Este. Si un punto está mal ubicado, mantenelo apretado y arrastralo a la posición correcta — se guarda solo.</p>
    <div id="admin_mapa_sin_geo" style="margin-top:12px"></div>
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
      ${(()=>{
        const pedidosFiltrados = adminAsignarFecha ? pedidosAsignar.filter(p=>p.delivery_date===adminAsignarFecha) : pedidosAsignar
        if(!pedidosFiltrados.length) return `<p class="muted">${adminAsignarFecha?'No hay pedidos pendientes para esa fecha.':'No hay pedidos pendientes para asignar.'}</p>`
        return pedidosFiltrados.map(p=>{
        const c=p.customers||{}
        const sub=p.subscriptions||{}
        const asignadoNombre = staffMap[p.assigned_driver] || '(sin asignar)'
        const freqLabel = FRECUENCIAS[sub.frequency]||sub.frequency||'-'
        const planLabel = sub.plan_breakdown && Array.isArray(sub.plan_breakdown) && sub.plan_breakdown.length
          ? sub.plan_breakdown.map(b=>`${b.qty}×${b.size}`).join(' + ')
          : `${p.egg_quantity||'-'} huevos`
        return pCard(`
          <div style="display:flex;align-items:flex-start;gap:10px">
            ${pAvatar(c.first_name)}
            <div style="flex:1">
              <div style="font-weight:700;color:#2F4D2A">${c.first_name||''} ${c.last_name||''}</div>
              <div style="font-size:12px;color:#8A8570;margin-top:2px">🏘️ ${c.neighborhood||'-'} · 📍 ${c.street||''} ${c.street_number||''}</div>
              <div style="display:flex;gap:6px;align-items:center;margin-top:5px">${zonaBadge(c.zone)}${pPill(freqLabel)}</div>
              <div style="font-size:12px;color:#8A8570;margin-top:5px">🥚 ${planLabel}</div>
              <div style="font-size:12px;color:#8A8570;margin-top:3px">${formatearFecha(p.delivery_date)}</div>
              <div style="font-size:12px;margin-top:3px;color:${p.assignment_locked?'#B85C00':'#2F4D2A'}">${p.assignment_locked?'🔒 Manual':'🔄 Automático'} → <b>${asignadoNombre}</b></div>
            </div>
          </div>
          <select data-pedido-driver="${p.id}" style="width:100%;margin-top:10px"><option value="">— Sin asignar —</option>${repartidores.map(r=>`<option value="${r.user_id}" ${p.assigned_driver===r.user_id?'selected':''}>${r.full_name||'(sin nombre)'}</option>`).join('')}</select>
          ${p.assignment_locked?pBtnRow([pBtn('🔄','Volver a automático',`data-destrabar="${p.id}"`,'ghost')]):''}
        `, 'margin-bottom:8px')
        }).join('')
      })()}
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
    <div class="group" style="margin-top:16px"><h3 style="font-size:15px">➕ Agregar vehículo</h3>
      <div class="grid two">
        <div class="field"><label>Tipo</label><select id="veh_new_tipo"><option value="moto">Moto</option><option value="camioneta">Camioneta</option></select></div>
        <div class="field"><label>Patente</label><input id="veh_new_patente" placeholder="Ej: AB123CD"/></div>
        <div class="field"><label>Marca</label><input id="veh_new_marca" placeholder="Ej: Honda"/></div>
        <div class="field"><label>Modelo</label><input id="veh_new_modelo" placeholder="Ej: Wave 110"/></div>
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
      <button class="btn primary" id="btn_crear_vehiculo">➕ Agregar vehículo</button>
    </div>
    <div class="group" style="margin-top:16px"><h3 style="font-size:15px">Vencimiento de carnet por persona</h3>
      ${staff.filter(s=>s.role==='repartidor'||s.role==='admin').map(s=>`<div class="row"><span>${s.full_name||'(sin nombre)'}</span><span style="display:flex;gap:6px;align-items:center"><input type="date" id="carnet_${s.user_id}" value="${s.license_expiry||''}" style="width:150px"/><button class="btn ghost" data-guardar-carnet="${s.user_id}" style="font-size:12px">💾</button></span></div>`).join('')}
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
          <div style="font-weight:700;color:#2F4D2A">${pp.egg_quantity} huevos</div>
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
    <div class="group"><h3 style="font-size:15px">🏦 Transferencia bancaria</h3>
      <div class="field"><label>Nombre del banco</label><input id="cfg_bank_name" value="${settingsMap.transfer_bank_name||''}"/></div>
      <div class="field"><label>Alias</label><input id="cfg_alias" value="${settingsMap.transfer_alias||''}"/></div>
      <div class="field"><label>CBU</label><input id="cfg_cbu" value="${settingsMap.transfer_cbu||''}"/></div>
      <div class="field"><label>Nombre del titular</label><input id="cfg_holder_name" value="${settingsMap.transfer_holder_name||''}"/></div>
      <div class="field"><label>DNI/CUIT del titular</label><input id="cfg_holder_doc" value="${settingsMap.transfer_holder_doc||''}"/></div>
    </div>
    <div class="group"><h3 style="font-size:15px">📱 Billetera virtual</h3>
      <div class="field"><label>Nombre de la billetera</label><input id="cfg_mp_name" value="${settingsMap.mp_wallet_name||''}" placeholder="Ej: Mercado Pago"/></div>
      <div class="field"><label>Alias</label><input id="cfg_mp" value="${settingsMap.mp_alias||''}"/></div>
      <div class="field"><label>CBU</label><input id="cfg_mp_cbu" value="${settingsMap.mp_cbu||''}"/></div>
      <div class="field"><label>Nombre del titular</label><input id="cfg_mp_holder_name" value="${settingsMap.mp_holder_name||''}"/></div>
      <div class="field"><label>DNI/CUIT del titular</label><input id="cfg_mp_holder_doc" value="${settingsMap.mp_holder_doc||''}"/></div>
    </div>
    <button class="btn ghost" id="btn_guardar_pago_config">Guardar datos de cobro</button>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('rendicion','🧾','Rendición y conciliación')}
    ${(()=>{
      const hoy = new Date().toISOString().slice(0,10)
      const pagosHoy = pagos.filter(p=>p.created_at.slice(0,10)===hoy)
      const totalPorMetodo = m => pagosHoy.filter(p=>p.method===m).reduce((s,p)=>s+Number(p.amount||0),0)
      return `<div class="grid three">
        <div style="background:#2F4D2A;border-radius:12px;padding:10px 8px;text-align:center"><div style="color:#C9D8B0;font-size:11px">Efectivo hoy</div><div style="color:#F5EFE0;font-size:15px;font-weight:700">$${totalPorMetodo('cash').toLocaleString('es-AR')}</div></div>
        <div style="background:#2F4D2A;border-radius:12px;padding:10px 8px;text-align:center"><div style="color:#C9D8B0;font-size:11px">Transferencia</div><div style="color:#F5EFE0;font-size:15px;font-weight:700">$${totalPorMetodo('transfer').toLocaleString('es-AR')}</div></div>
        <div style="background:#2F4D2A;border-radius:12px;padding:10px 8px;text-align:center"><div style="color:#C9D8B0;font-size:11px">Mercado Pago</div><div style="color:#F5EFE0;font-size:15px;font-weight:700">$${totalPorMetodo('mp').toLocaleString('es-AR')}</div></div>
      </div>`
    })()}
    <div style="margin-top:16px">
      ${pagos.length? pagos.map(p=>{
        const c=p.customers||{}
        const distinto = p.expected_method && p.expected_method !== p.method
        const fecha = new Date(p.created_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
        return pCard(`
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
            <div>
              <div style="font-weight:600;color:#2F4D2A">${c.first_name||''} ${c.last_name||''}</div>
              <div style="margin-top:3px">${pPill(METODOS_PAGO_LABEL[p.method]||p.method)}</div>
              ${distinto?`<div style="font-size:11px;color:#B85C00;margin-top:3px">esperado: ${METODOS_PAGO_LABEL[p.expected_method]||p.expected_method}</div>`:''}
              <div style="font-size:12px;color:#8A8570;margin-top:3px">${fecha} · $${Number(p.amount||0).toLocaleString('es-AR')}</div>
            </div>
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#2F4D2A;white-space:nowrap"><input type="checkbox" data-conciliar="${p.id}" ${p.reconciled?'checked':''}/> Conciliado</label>
          </div>
        `, 'margin-bottom:8px')
      }).join('') : '<p class="muted">Todavía no hay pagos registrados.</p>'}
    </div>
  </div></div>
  <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E3DCC8;overflow:hidden;margin-top:10px">
  ${accHead('finanzas','💰','Finanzas')}
    <div class="grid two">
      <div style="background:#2F4D2A;border-radius:12px;padding:10px 12px"><div style="color:#C9D8B0;font-size:11px">Ventas (30 días)</div><div style="color:#F5EFE0;font-size:17px;font-weight:700">$${Number(dash.ventas||0).toLocaleString('es-AR')}</div></div>
      <div style="background:#2F4D2A;border-radius:12px;padding:10px 12px"><div style="color:#C9D8B0;font-size:11px">Gastos (30 días)</div><div style="color:#F5EFE0;font-size:17px;font-weight:700">$${Number(dash.gastos||0).toLocaleString('es-AR')}</div></div>
      <div style="background:#2F4D2A;border-radius:12px;padding:10px 12px"><div style="color:#C9D8B0;font-size:11px">Pérdidas (30 días)</div><div style="color:#F5EFE0;font-size:17px;font-weight:700">$${Number(dash.perdidas||0).toLocaleString('es-AR')}</div></div>
      <div style="background:#2F4D2A;border-radius:12px;padding:10px 12px"><div style="color:#C9D8B0;font-size:11px">Beneficio neto (30 días)</div><div style="color:${Number(dash.beneficio_neto||0)>=0?'#F5EFE0':'#F0997B'};font-size:17px;font-weight:700">$${Number(dash.beneficio_neto||0).toLocaleString('es-AR')}</div></div>
    </div>
    <div class="alert info" style="margin-top:10px"><b>Caja total acumulada: $${Number(dash.caja||0).toLocaleString('es-AR')}</b></div>

    <div style="margin-top:20px"><h3 style="font-size:15px;color:#2F4D2A">Categorías</h3>
      <div class="grid two">
        <div class="field"><label>Nombre</label><input id="cat_new_name" placeholder="Ej: Combustible"/></div>
        <div class="field"><label>Tipo</label><select id="cat_new_type"><option value="fixed">Gasto fijo</option><option value="variable">Gasto variable</option><option value="income">Ingreso</option></select></div>
      </div>
      <button class="btn ghost" id="btn_crear_categoria">➕ Agregar categoría</button>
      <div style="margin-top:10px">${categorias.length? categorias.map(c=>pCard(`
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
          <div>
            <div style="font-weight:600;color:#2F4D2A">${c.name}${!c.active?' <span style="color:#8A8570;font-weight:400">(inactiva)</span>':''}</div>
            <div style="margin-top:3px">${pPill(TIPO_CAT_LABEL[c.type]||c.type)}</div>
          </div>
          <button data-cat-toggle="${c.id}" data-cat-active="${c.active}" style="background:${c.active?'#FFFFFF':'#2F4D2A'};color:${c.active?'#B85C00':'#F5EFE0'};border:1px solid ${c.active?'#E3DCC8':'#2F4D2A'};border-radius:10px;padding:7px 14px;font-size:12px;font-weight:600;white-space:nowrap">${c.active?'Desactivar':'Activar'}</button>
        </div>
      `, 'margin-bottom:8px')).join('') : '<p class="muted">Todavía no hay categorías.</p>'}</div>
    </div>

    <div style="margin-top:20px"><h3 style="font-size:15px;color:#2F4D2A">Registrar movimiento</h3>
      <div class="field"><label>Tipo</label>
        <div style="display:flex;gap:8px;background:#F5EFE0;border-radius:12px;padding:4px">
          <button type="button" id="btn_tipo_expense" data-fin-tipo="expense" style="flex:1;border:none;background:transparent;border-radius:9px;padding:9px 0;font-size:13px;font-weight:600;color:#2F4D2A">Gasto</button>
          <button type="button" id="btn_tipo_income" data-fin-tipo="income" style="flex:1;border:none;background:transparent;border-radius:9px;padding:9px 0;font-size:13px;font-weight:600;color:#2F4D2A">Ingreso</button>
        </div>
      </div>
      <div class="field"><label>Categoría</label><select id="fin_categoria"><option value="">Elegí el tipo primero</option></select></div>
      <div class="grid two">
        <div class="field"><label>Monto</label><input id="fin_amount" type="number" min="0"/></div>
        <div class="field"><label>Fecha</label><input id="fin_date" type="date" value="${new Date().toISOString().slice(0,10)}"/></div>
      </div>
      <div class="field"><label>Descripción</label><input id="fin_desc" placeholder="Ej: nafta de la semana"/></div>
      <div class="field"><label>Comprobante (opcional)</label><input type="file" id="fin_receipt" accept="image/*,application/pdf"/></div>
      <div id="err_finanzas" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_guardar_movimiento" style="width:100%">Guardar movimiento</button>
    </div>

    <div style="margin-top:20px"><h3 style="font-size:15px;color:#2F4D2A">Últimos movimientos</h3>
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
    adminOpenSection = adminOpenSection===b.dataset.acc ? null : b.dataset.acc
    render()
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
  if(AS('mapa')) initAdminMapa()
  document.querySelectorAll('[data-vehiculo-asignar]').forEach(sel=>sel.onchange=async()=>{
    const { error } = await supabase.from('vehicles').update({ assigned_to: sel.value || null }).eq('id', sel.dataset.vehiculoAsignar)
    if(error){ alert('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-marcar-service]').forEach(b=>b.onclick=async()=>{
    if(!confirm('¿Marcar el service como realizado hoy? Se reinicia el contador de kilómetros.'))return
    const { data, error } = await supabase.rpc('admin_marcar_service', { p_vehicle_id: b.dataset.marcarService })
    if(error || !data?.ok){ alert('No se pudo actualizar.'); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-pagar-service]').forEach(b=>b.onclick=async()=>{
    const { data, error } = await supabase.rpc('admin_marcar_service_pagado', { p_service_id: b.dataset.pagarService })
    if(error || !data?.ok){ alert('No se pudo actualizar.'); return }
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
    if(!confirm('¿Eliminar este vehículo? También se borra su historial de cargas de combustible. Esta acción no se puede deshacer.'))return
    const { error } = await supabase.from('vehicles').delete().eq('id', b.dataset.eliminarVehiculo)
    if(error){ alert('Error: '+error.message); return }
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
    adminData = null; render()
  }
  document.querySelectorAll('[data-guardar-carnet]').forEach(b=>b.onclick=async()=>{
    const val = document.querySelector(`#carnet_${b.dataset.guardarCarnet}`).value
    const { error } = await supabase.from('staff_roles').update({ license_expiry: val || null }).eq('user_id', b.dataset.guardarCarnet)
    if(error){ alert('Error: '+error.message); return }
    adminData = null; alert('Guardado ✅')
  })
  document.querySelector('#btn_crear_staff').onclick = async ()=>{
    const full_name = document.querySelector('#staff_new_name').value.trim()
    const role = document.querySelector('#staff_new_role').value
    const custom_code = document.querySelector('#staff_new_code').value.trim()
    const box = document.querySelector('#codigo_generado')
    box.innerHTML = '<p class="muted">Generando…</p>'
    const { data, error } = await supabase.functions.invoke('manage-staff', { body: { action:'create', full_name, role, custom_code } })
    if(error){ box.innerHTML = `<div class="alert danger">No se pudo generar: ${error.message}</div>`; return }
    box.innerHTML = `<div class="alert info"><b>✅ Código generado para ${full_name||'este usuario'}:</b><br><span style="font-size:20px;font-weight:bold;letter-spacing:2px">${data.code}</span><br><small>Copialo ahora — no se vuelve a mostrar. Pasáselo a la persona para que entre por "Acceso del equipo".</small></div>`
    adminData = null; render()
  }
  document.querySelectorAll('[data-revoke]').forEach(b=>b.onclick=async()=>{
    if(!confirm('¿Revocar el acceso de esta persona? No va a poder entrar más con su código actual.'))return
    const { error } = await supabase.functions.invoke('manage-staff', { body: { action:'revoke', user_id:b.dataset.revoke } })
    if(error){ alert('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-reset]').forEach(b=>b.onclick=async()=>{
    const custom_code = prompt('Escribí el nuevo código para esta persona (o dejalo vacío para generar uno automático):') || ''
    const { data, error } = await supabase.functions.invoke('manage-staff', { body: { action:'reset', user_id:b.dataset.reset, custom_code } })
    if(error){ alert('Error: '+error.message); return }
    alert('Nuevo código: '+data.code+'\n\nCopialo ahora, no se vuelve a mostrar.')
  })
  document.querySelectorAll('#modo_asig_group [data-modo]').forEach(b=>b.onclick=async()=>{
    const { data, error } = await supabase.rpc('admin_set_assignment_mode', { p_mode: b.dataset.modo })
    if(error || !data?.ok){ alert('No se pudo cambiar el modo: '+(error?.message||data?.error||'')); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-zona-driver]').forEach(sel=>sel.onchange=async()=>{
    const zona = sel.dataset.zonaDriver
    const driver = sel.value || null
    const { error } = await supabase.from('zone_drivers').update({ driver_user_id: driver, updated_at: new Date().toISOString() }).eq('zone', zona)
    if(error){ alert('Error: '+error.message); return }
    adminData = null
  })
  document.querySelectorAll('[data-barrio-driver]').forEach(sel=>sel.onchange=async()=>{
    const barrio = sel.dataset.barrioDriver
    const driver = sel.value || null
    if(driver){
      const { error } = await supabase.from('neighborhood_drivers').upsert({ neighborhood: barrio, driver_user_id: driver, updated_at: new Date().toISOString() })
      if(error){ alert('Error: '+error.message); return }
    } else {
      const { error } = await supabase.from('neighborhood_drivers').delete().eq('neighborhood', barrio)
      if(error){ alert('Error: '+error.message); return }
    }
    adminData = null
  })
  document.querySelector('#btn_recalcular_asignaciones').onclick = async ()=>{
    const { data, error } = await supabase.rpc('recalc_all_order_drivers', {})
    if(error){ alert('Error: '+error.message); return }
    adminData = null
    alert(`✅ Se recalcularon ${data} pedido(s).`); render()
  }
  document.querySelectorAll('[data-pedido-driver]').forEach(sel=>sel.onchange=async()=>{
    const { data, error } = await supabase.rpc('admin_assign_driver', { p_order_id: sel.dataset.pedidoDriver, p_driver_user_id: sel.value || null })
    if(error || !data?.ok){ alert('No se pudo asignar: '+(error?.message||data?.error||'')); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-destrabar]').forEach(b=>b.onclick=async()=>{
    const { data, error } = await supabase.rpc('admin_unlock_driver', { p_order_id: b.dataset.destrabar })
    if(error || !data?.ok){ alert('No se pudo destrabar: '+(error?.message||data?.error||'')); return }
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
    if(!qty || qty<=0){ alert('Ingresá una cantidad válida.'); return }
    const { error } = await supabase.from('stock_movements').insert({ product_id:id, type:'compra', quantity:qty, created_by: session?.user?.id || null })
    if(error){ alert('Error: '+error.message); return }
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
    if(!confirm('¿Activar a esta persona? Va a pasar de la lista de espera a suscripción activa, con 50% de descuento en su primera entrega.'))return
    const { data, error } = await supabase.rpc('promote_waitlist_entry', { p_waitlist_id: b.dataset.promover })
    if(error || !data?.ok){ alert('No se pudo activar: '+(data?.error||error?.message||'')); return }
    adminData = null
    alert('Activado ✅ Próxima entrega: '+data.next_delivery_date)
    render()
  })
  document.querySelectorAll('[data-pp-save]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.ppSave
    const price = Number(document.querySelector(`#pp_price_${id}`).value)
    if(!price || price<=0){ alert('Ingresá un precio válido.'); return }
    const { error } = await supabase.from('plan_prices').update({ price }).eq('id', id)
    if(error){ alert('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-pp-toggle]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.ppToggle
    const activeNow = b.dataset.ppActive === 'true'
    const { error } = await supabase.from('plan_prices').update({ active: !activeNow }).eq('id', id)
    if(error){ alert('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelector('#btn_agregar_tamano').onclick = async ()=>{
    const qty = Number(document.querySelector('#pp_new_qty').value)
    const price = Number(document.querySelector('#pp_new_price').value)
    const box = document.querySelector('#err_tamano')
    if(!qty || qty<=0 || !price || price<=0){ box.textContent='Completá cantidad de huevos y precio, ambos mayores a 0.'; box.style.display='block'; return }
    const { error } = await supabase.from('plan_prices').insert({ egg_quantity: qty, price, active: true })
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    adminData = null; render()
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
    alert('Datos de cobro guardados ✅')
  }
  document.querySelectorAll('[data-conciliar]').forEach(chk=>chk.onchange=async()=>{
    const { error } = await supabase.from('payments').update({ reconciled: chk.checked }).eq('id', chk.dataset.conciliar)
    if(error){ alert('Error: '+error.message); chk.checked=!chk.checked; return }
    adminData = null
  })
  document.querySelector('#btn_crear_categoria').onclick = async ()=>{
    const name = document.querySelector('#cat_new_name').value.trim()
    const type = document.querySelector('#cat_new_type').value
    if(!name){ alert('Ponele un nombre a la categoría.'); return }
    const { error } = await supabase.from('finance_categories').insert({ name, type, active: true })
    if(error){ alert('Error: '+error.message); return }
    adminData = null; render()
  }
  document.querySelectorAll('[data-cat-toggle]').forEach(b=>b.onclick=async()=>{
    const activeNow = b.dataset.catActive === 'true'
    const { error } = await supabase.from('finance_categories').update({ active: !activeNow }).eq('id', b.dataset.catToggle)
    if(error){ alert('Error: '+error.message); return }
    adminData = null; render()
  })
  let finTipoSel = 'expense'
  const actualizarCategoriasFinanzas = ()=>{
    const sel = document.querySelector('#fin_categoria')
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
  let comprobanteFinanzas = null
  document.querySelector('#fin_receipt').onchange = (e)=>{ comprobanteFinanzas = e.target.files[0]||null }
  document.querySelector('#btn_guardar_movimiento').onclick = async ()=>{
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
    const { error } = await supabase.from('finance_entries').insert({ category_id, type: finTipoSel, amount, entry_date, description: description||null, attachment_url, created_by: session?.user?.id||null })
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    adminData = null; render()
  }
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

async function render(){
  if(current==='inicio')return inicio();
  if(current==='cuenta')return cuenta? cuentaPanel() : cuentaLogin();
  if(current==='staff-login')return staffLogin();
  if(current==='staff-profile-setup')return staffProfileForm(true);
  if(current==='perfil')return staffProfileForm(false);
  if(current==='clientes')return clientes();
  if(current==='pedidos')return pedidos();
  if(current==='repartidor')return repartidor();
  if(current==='repartidor-mapa')return mapaRepartidor();
  if(current==='historial')return historialRepartidor();
  if(current==='campo')return campo();
  if(current==='vehiculo')return miVehiculo();
  if(current==='vehiculo-stats')return vehiculoStats();
  if(current==='vehiculo-historial')return vehiculoHistorial();
  if(current==='admin-detalle')return adminDetalle();
  return admin()
}

async function init(){
  const { data } = await supabase.auth.getSession()
  session = data.session
  if(session){
    const { data: roleRow } = await supabase.from('staff_roles').select('*').eq('user_id', session.user.id).single()
    myRole = roleRow?.role || null
    staffProfile = roleRow || null
    if(!myRole){ session=null }
    else if(!roleRow.profile_completed){ current = 'staff-profile-setup' }
  }
  render()
}
init()
