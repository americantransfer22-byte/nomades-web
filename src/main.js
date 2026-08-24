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
  if(role==='admin') return [['clientes','Clientes'],['pedidos','Pedidos'],['preparador','Preparar pedidos'],['repartidor','Repartidor'],['campo','Campo'],['vendedor','Vender'],['admin','Administración'],['vehiculo','Mi vehículo'],['perfil','Mi perfil']]
  if(role==='campo') return [['campo','Campo'],['perfil','Mi perfil']]
  if(role==='repartidor') return [['repartidor','Repartidor'],['historial','Historial'],['vehiculo','Mi vehículo'],['perfil','Mi perfil']]
  if(role==='preparador') return [['preparador','Preparar pedidos'],['perfil','Mi perfil']]
  if(role==='vendedor') return [['vendedor','Vender'],['mis-suscriptores','Mis suscriptores'],['mis-comisiones','Mis comisiones'],['perfil','Mi perfil']]
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
  const esMayorista = current==='mayorista-login' || current==='mayorista-panel' || current==='mayorista-landing' || current==='mayorista-signup'
  const nav = esMayorista ? [] : session ? (current==='staff-profile-setup' ? [['logout','Salir']] : [...navStaffFor(myRole),['logout','Salir']]) : [['inicio','Inicio'],['cuenta','Mi cuenta']]
  app.innerHTML = `<div class="shell"><div class="top"><div class="brand" style="display:flex;align-items:center;gap:8px">NÓMADES <span class="muted" style="font-size:12px">${esMayorista?'Portal mayoristas':'Huevos de libre pastoreo'}</span></div><div class="nav">${nav.map(([k,l])=>`<button class="btn ${current===k?'primary':'ghost'}" data-nav="${k}">${l}</button>`).join('')}</div></div>${content}${(!session && !esMayorista)?`<div style="text-align:center;margin-top:24px"><a href="#" id="staff_link" class="muted" style="font-size:12px">Acceso del equipo</a></div>`:''}</div>`
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
<section class="card" style="margin-top:18px"><h3>¿Por qué NÓMADES es distinto?</h3><p>La mayoría de los huevos de supermercado vienen de gallinas confinadas todo el día. Acá las gallinas viven al aire libre, se mueven, comen pasto fresco — y eso se nota en el sabor y el color de la yema. Además, cada entrega es trazable: sabés exactamente cuándo se recolectó tu pedido.</p></section>
<section style="margin-top:18px"><h2>Lo que dicen nuestros clientes</h2><div id="resenas_home">${skeletonBloque(2)}</div></section>`)
  cargarPreciosHome()
  cargarResenasHome()
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
    ${productosConfirmados.length?`<details style="margin-top:8px;border-top:1px solid #F0EBDD;padding-top:8px">
      <summary style="cursor:pointer;font-size:12.5px;color:#2F4D2A;font-weight:600;list-style:none">🛒 ${productosConfirmados.length} producto${productosConfirmados.length===1?'':'s'} agregado${productosConfirmados.length===1?'':'s'} · $${totalProductos.toLocaleString('es-AR')} (tocá para ver o editar)</summary>
      <div style="margin-top:8px">
      ${productosConfirmados.map(({mi,p})=>`<div class="row">
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
      </div>
    </details>`:''}
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
  ${cuenta.historial_entregas && cuenta.historial_entregas.length ? `<div class="card"><h3>📦 Historial de entregas</h3>${cuenta.historial_entregas.map(h=>`<div class="row"><span>${formatearFecha(h.delivery_date)}</span><span>${h.egg_quantity||0} huevos</span></div>`).join('')}</div>`:''}
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
      if(error || !data?.ok){ mostrarAlerta('No se pudo guardar la nueva ubicación.'); return }
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
      const coords = geo || { lat: -32.9468, lon: -60.6393 }
      const { data, error } = await supabase.rpc('admin_set_customer_location', { p_customer_id: cli.id, p_latitude: coords.lat, p_longitude: coords.lon })
      if(error || !data?.ok){ b.textContent = 'Error'; return }
      if(!geo) mostrarAlerta(`No pudimos encontrar automáticamente la dirección de ${cli.first_name||'este cliente'}. Puse un punto en el centro de Rosario — arrastralo con el dedo hasta la ubicación correcta.`)
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
function pCard(inner, extraStyle){ return `<div style="background:#FFFFFF;border-radius:14px;border:1px solid #E3DCC8;padding:14px 16px;margin-bottom:10px;${extraStyle||''}">${inner}</div>` }
function pPill(text, bg, color){ return `<span style="background:${bg||'#EAF0DC'};color:${color||'#2F4D2A'};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap;display:inline-block">${text}</span>` }
function pAvatar(nombre, size){ const s=size||40; const inicial=(nombre||'?').trim().charAt(0).toUpperCase(); return `<div style="width:${s}px;height:${s}px;border-radius:50%;background:#2F4D2A;color:#F5EFE0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${Math.round(s*0.4)}px;flex-shrink:0">${inicial}</div>` }
function pBar(pct, colorOk, colorWarn, warn){ const p=Math.max(0,Math.min(100,pct)); return `<div style="height:6px;background:#E3DCC8;border-radius:3px;overflow:hidden;margin-top:4px"><div style="height:100%;width:${p}%;background:${warn?(colorWarn||'#E8833A'):(colorOk||'#8FAE6B')};border-radius:3px"></div></div>` }
function pBtn(icon, label, attrs, variant){
  const styles = { primary:'background:#2F4D2A;color:#F5EFE0;border:none', ghost:'background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8', danger:'background:#FFFFFF;color:#B03A2E;border:1px solid #E3DCC8' }
  return `<button ${attrs} style="flex:1;${styles[variant||'ghost']};border-radius:10px;padding:9px 4px;font-size:11px;font-weight:600;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:0">${icon}<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${label}</span></button>`
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
  const enReparto = orderStatus==='out_for_delivery' || stage==='en_route'
  let rango = 0
  if(stage==='preparing') rango = 1
  if(stage==='prepared') rango = 2
  if(enReparto) rango = 3
  if(stage==='en_route') rango = 4
  if(orderStatus==='delivered') rango = 5
  const etapas = [
    { icono:'🥚', label:'Preparando', activo: rango>=1 },
    { icono:'📦', label:'Preparado', activo: rango>=2 },
    { icono:'🚚', label:'En reparto', activo: rango>=3 },
    { icono:'<span style="display:inline-block;transform:scaleX(-1)" class="nom-moto-camina">🛵</span>', label:'Hacia tu casa', activo: rango>=4 },
    { icono:'🏠', label:'Entregado', activo: rango>=5 }
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

const ROLES_STAFF = [
  { value: 'admin', label: 'Administrador' },
  { value: 'campo', label: 'Personal de campo' },
  { value: 'repartidor', label: 'Repartidor' },
  { value: 'preparador', label: 'Preparador de pedidos' },
  { value: 'vendedor', label: 'Vendedor' }
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
    current = roleRow.profile_completed ? (myRole==='campo' ? 'campo' : myRole==='repartidor' ? 'repartidor' : myRole==='preparador' ? 'preparador' : myRole==='vendedor' ? 'vendedor' : 'admin') : 'staff-profile-setup'
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

async function mayoristaLanding(){
  layout(`<h2>🏭 Vendemos a mayoristas</h2><div class="card">${skeletonBloque(4)}</div>`)
  const [{ data: planesRaw }, { data: catalogoRaw }] = await Promise.all([
    supabase.from('plan_prices').select('egg_quantity,price').eq('active', true).eq('customer_type','mayorista').order('egg_quantity'),
    supabase.rpc('mayorista_catalogo', {})
  ])
  const planes = planesRaw || []
  const catalogo = catalogoRaw || []
  layout(`<h2>🏭 Vendemos a mayoristas</h2>
  <div class="card"><p class="muted">Huevos de libre pastoreo directo de la granja, en volumen y con precio mayorista. Así queda armado tu pedido:</p></div>
  <div class="card"><h3>🥚 Huevo</h3>
    ${planes.length? planes.map(p=>`<div class="row"><span>${p.egg_quantity} huevos</span><b>$${Number(p.price).toLocaleString('es-AR')}</b></div>`).join('') : '<p class="muted">Consultanos por volumen y precio.</p>'}
  </div>
  ${catalogo.length?`<div class="card"><h3>🛒 Otros productos</h3>
    ${catalogo.map(p=>`<div class="row"><span>${p.name}<br><small class="muted">${p.unit_label||'unidad'}</small></span><b>$${Number(p.price).toLocaleString('es-AR')}</b></div>`).join('')}
  </div>`:''}
  <button class="btn primary" id="btn_quiero_ser_mayorista" style="width:100%;margin-top:6px">➕ Quiero ser cliente mayorista</button>
  <button class="btn ghost" id="btn_ya_soy_mayorista" style="width:100%;margin-top:8px">Ya soy cliente — Ingresar con DNI</button>`)
  document.querySelector('#btn_quiero_ser_mayorista').onclick = ()=>{ current='mayorista-signup'; render() }
  document.querySelector('#btn_ya_soy_mayorista').onclick = ()=>{ current='mayorista-login'; render() }
}

const mayoristaAlta = { first_name:'', last_name:'', dni:'', phone:'', email:'', street:'', street_number:'', neighborhood:'', city:'Rosario', province:'Santa Fe', zone:'', carrito:{}, frequency:'weekly', payment_method:'transfer' }
async function mayoristaSignupForm(){
  const c = mayoristaAlta
  const { data: planesRaw } = await supabase.from('plan_prices').select('egg_quantity,price').eq('active', true).eq('customer_type','mayorista').order('egg_quantity')
  const planes = planesRaw || []
  const totalCant = ()=>Object.entries(c.carrito).reduce((s,[q,n])=>s+Number(q)*n,0)
  const totalPrecio = ()=>Object.entries(c.carrito).reduce((s,[q,n])=>{ const pl=planes.find(p=>String(p.egg_quantity)===q); return s+(pl?Number(pl.price):0)*n }, 0)
  let enviando = false
  const dibujar = ()=>{
    layout(`<h2>🏭 Alta de cuenta mayorista</h2>
    <div class="card">
      <div class="grid two">
        <div class="field"><label>Nombre / razón social *</label><input id="ma_first_name" value="${c.first_name}"/></div>
        <div class="field"><label>Apellido *</label><input id="ma_last_name" value="${c.last_name}"/></div>
        <div class="field"><label>DNI/CUIT *</label><input id="ma_dni" inputmode="numeric" value="${c.dni}" placeholder="Sin puntos"/></div>
        <div class="field"><label>Teléfono *</label><input id="ma_phone" inputmode="tel" value="${c.phone}"/></div>
      </div>
      <div class="field"><label>Email</label><input id="ma_email" type="email" value="${c.email}"/></div>
      <div class="grid two">
        <div class="field"><label>Calle</label><input id="ma_street" value="${c.street}"/></div>
        <div class="field"><label>Número</label><input id="ma_street_number" value="${c.street_number}"/></div>
      </div>
      <div class="field"><label>Barrio / referencia</label><input id="ma_neighborhood" value="${c.neighborhood}"/></div>
      <div class="grid two">
        <div class="field"><label>Ciudad</label><input id="ma_city" value="${c.city}"/></div>
        <div class="field"><label>Provincia</label><input id="ma_province" value="${c.province}"/></div>
      </div>
    </div>
    <div class="card"><h3>Tu pedido de huevos</h3>
      ${planes.length? planes.map(pl=>`<div class="row"><span>${pl.egg_quantity} huevos <small class="muted">$${Number(pl.price).toLocaleString('es-AR')}</small></span><span style="display:flex;align-items:center;gap:8px"><button type="button" data-ma-menos="${pl.egg_quantity}" class="btn ghost" style="padding:6px 14px">−</button><b>${c.carrito[pl.egg_quantity]||0}</b><button type="button" data-ma-mas="${pl.egg_quantity}" class="btn ghost" style="padding:6px 14px">+</button></span></div>`).join('') : '<p class="muted">Todavía no hay tamaños mayoristas cargados.</p>'}
      <div class="alert info" style="margin-top:8px"><b>Total: ${totalCant()} huevos</b> · $${totalPrecio().toLocaleString('es-AR')}</div>
      <div class="field" style="margin-top:10px"><label>Frecuencia</label><div class="grid three">${Object.entries(FRECUENCIAS).map(([v,l])=>`<button type="button" data-ma-frecuencia="${v}" class="btn ${c.frequency===v?'primary':'ghost'}">${l}</button>`).join('')}</div></div>
      <div class="field"><label>Forma de pago</label><div class="grid three">
        <button type="button" data-ma-metodo="transfer" class="btn ${c.payment_method==='transfer'?'primary':'ghost'}">Transferencia</button>
        <button type="button" data-ma-metodo="mp" class="btn ${c.payment_method==='mp'?'primary':'ghost'}">Mercado Pago</button>
        <button type="button" data-ma-metodo="cash" class="btn ${c.payment_method==='cash'?'primary':'ghost'}">Efectivo</button>
      </div></div>
    </div>
    <div id="err_alta_mayorista" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_confirmar_alta_mayorista" style="width:100%" ${enviando?'disabled':''}>${enviando?'Enviando…':'Confirmar y crear mi cuenta'}</button>
    <button class="btn ghost" id="btn_volver_landing" style="width:100%;margin-top:8px">← Volver</button>`)
    const ids = ['first_name','last_name','dni','phone','email','street','street_number','neighborhood','city','province']
    ids.forEach(id=>{ const el=document.querySelector('#ma_'+id); if(el) el.oninput=()=>c[id]=el.value })
    document.querySelectorAll('[data-ma-mas]').forEach(b=>b.onclick=()=>{ c.carrito[b.dataset.maMas]=(c.carrito[b.dataset.maMas]||0)+1; dibujar() })
    document.querySelectorAll('[data-ma-menos]').forEach(b=>b.onclick=()=>{ if(c.carrito[b.dataset.maMenos]>0) c.carrito[b.dataset.maMenos]--; dibujar() })
    document.querySelectorAll('[data-ma-frecuencia]').forEach(b=>b.onclick=()=>{ c.frequency=b.dataset.maFrecuencia; dibujar() })
    document.querySelectorAll('[data-ma-metodo]').forEach(b=>b.onclick=()=>{ c.payment_method=b.dataset.maMetodo; dibujar() })
    document.querySelector('#btn_volver_landing').onclick = ()=>{ current='mayorista-landing'; render() }
    document.querySelector('#btn_confirmar_alta_mayorista').onclick = async ()=>{
      const box = document.querySelector('#err_alta_mayorista')
      if(!c.first_name.trim() || !c.last_name.trim()){ box.textContent='Falta el nombre.'; box.style.display='block'; return }
      if(!/^\d{7,8}$/.test(c.dni.trim())){ box.textContent='El DNI/CUIT debe tener 7 u 8 números, sin puntos ni guiones.'; box.style.display='block'; return }
      if(!c.phone.trim()){ box.textContent='Falta el teléfono.'; box.style.display='block'; return }
      if(totalCant()<=0){ box.textContent='Elegí al menos un tamaño de maple.'; box.style.display='block'; return }
      box.style.display='none'
      enviando = true; dibujar()
      const breakdown = Object.entries(c.carrito).filter(([,q])=>q>0).map(([size,qty])=>({size:Number(size),qty}))
      const { data, error } = await supabase.rpc('mayorista_signup', {
        p_customer: { first_name:c.first_name.trim(), last_name:c.last_name.trim(), dni:c.dni.trim(), phone:c.phone.trim(), email:c.email.trim(), street:c.street.trim(), street_number:c.street_number.trim(), neighborhood:c.neighborhood.trim(), city:c.city.trim()||'Rosario', province:c.province.trim()||'Santa Fe', zone:c.zone },
        p_subscription: { frequency:c.frequency, egg_quantity: totalCant(), payment_method:c.payment_method, plan_breakdown: breakdown, price: totalPrecio() }
      })
      enviando = false
      if(error || !data?.ok){ box.textContent = data?.error || 'No pudimos crear tu cuenta. Probá de nuevo.'; box.style.display='block'; dibujar(); return }
      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni.trim() })
      if(fresh?.found) cuenta = fresh
      mostrarAlerta(data.status==='active' ? '✅ Cuenta creada. Próxima entrega: '+data.next_delivery_date : '🕒 Cuenta creada — quedaste en lista de espera para ese volumen, te contactamos apenas se libere lugar.')
      current = 'mayorista-panel'
      render()
    }
  }
  dibujar()
}

function mayoristaLogin(){
  layout(`<h2>🏭 Acceso mayoristas</h2><div class="card">
    <p class="muted">Ingresá con el DNI de tu cuenta mayorista NÓMADES.</p>
    <div class="field"><label>DNI</label><input id="dni_mayorista" inputmode="numeric" placeholder="Sin puntos"/></div>
    <div id="err_mayorista_login" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_dni_mayorista" style="width:100%">Entrar</button>
    <button class="btn ghost" id="btn_volver_landing_login" style="width:100%;margin-top:8px">← Volver</button>
  </div>`)
  document.querySelector('#btn_volver_landing_login').onclick = ()=>{ current='mayorista-landing'; render() }
  document.querySelector('#btn_dni_mayorista').onclick = async ()=>{
    const dni = document.querySelector('#dni_mayorista').value.trim()
    const box = document.querySelector('#err_mayorista_login')
    if(!/^\d{7,8}$/.test(dni)){ box.textContent='Ingresá un DNI válido (7 u 8 números, sin puntos).'; box.style.display='block'; return }
    const { data, error } = await supabase.rpc('customer_login', { p_dni: dni })
    if(error || !data?.found){ box.textContent='No encontramos ese DNI.'; box.style.display='block'; return }
    if(data.customer.customer_type !== 'mayorista'){ box.textContent='Este DNI no está registrado como cuenta mayorista. Si te parece un error, consultá con NÓMADES.'; box.style.display='block'; return }
    cuenta = data
    current = 'mayorista-panel'
    render()
  }
}

let mayoristaCarrito = {}
let mayoristaCarritoProductosNuevo = {}
async function mayoristaPanel(){
  panelVolver = mayoristaPanel
  if(!cuenta){ current='mayorista-login'; render(); return }
  const c = cuenta.customer
  const next = cuenta.next_order
  const hoy = new Date().toISOString().slice(0,10)
  const esHoy = next && next.delivery_date === hoy
  const { data: planesRaw } = await supabase.from('plan_prices').select('egg_quantity,price').eq('active', true).eq('customer_type','mayorista').order('egg_quantity')
  const planes = planesRaw || []
  const { data: catalogoMayorista } = await supabase.rpc('mayorista_catalogo', {})
  const productosMayoristas = catalogoMayorista || []
  const subActiva = cuenta.subscriptions.find(s=>s.status==='active')
  let frecuenciaSel = subActiva?.frequency || 'weekly'
  let metodoSel = subActiva?.payment_method || 'transfer'
  if(subActiva && !Object.keys(mayoristaCarrito).length){
    (subActiva.plan_breakdown||[]).forEach(b=>{ mayoristaCarrito[b.size] = b.qty })
  }
  const totalCant = ()=>Object.entries(mayoristaCarrito).reduce((s,[q,c])=>s+Number(q)*c,0)
  const totalPrecio = ()=>Object.entries(mayoristaCarrito).reduce((s,[q,c])=>{ const pl=planes.find(p=>String(p.egg_quantity)===q); return s+(pl?Number(pl.price):0)*c }, 0)

  const dibujar = ()=>{
    layout(`<h2>🏭 Hola, ${c.first_name}</h2>
    <div id="card_hoy_banner"></div>
    <div class="card" id="card_repartidor"><h3>🚚 Tu repartidor</h3>${skeletonBloque(2)}</div>
    ${next && (next.customer_stage || next.status==='out_for_delivery') ? barraEstadoPedido(next.customer_stage, next.status, next.out_for_delivery_at, next.en_route_at) : ''}
    <div class="card" id="card_subs"><h3>Tu pedido de huevos</h3>
      ${subActiva?`<p class="muted">Próxima entrega: ${subActiva.next_delivery_date?formatearFecha(subActiva.next_delivery_date):'-'}${subActiva.status==='paused'?' · <span class="badge" style="background:#8A8570">⏸️ Pausada</span>':''}${subActiva.status==='paused'&&subActiva.paused_until?` (hasta ${formatearFecha(subActiva.paused_until)})`:''}</p>`:'<p class="muted">Todavía no tenés un pedido activo — armalo abajo.</p>'}
      ${planes.length? planes.map(pl=>`<div class="row"><span>${pl.egg_quantity} huevos <small class="muted">$${Number(pl.price).toLocaleString('es-AR')}</small></span><span style="display:flex;align-items:center;gap:8px"><button type="button" data-may-menos="${pl.egg_quantity}" class="btn ghost" style="padding:6px 14px">−</button><b>${mayoristaCarrito[pl.egg_quantity]||0}</b><button type="button" data-may-mas="${pl.egg_quantity}" class="btn ghost" style="padding:6px 14px">+</button></span></div>`).join('') : '<p class="muted">Todavía no hay tamaños mayoristas cargados — consultá con NÓMADES.</p>'}
      <div class="alert info" style="margin-top:8px"><b>Total: ${totalCant()} huevos</b> · $${totalPrecio().toLocaleString('es-AR')}</div>
      <div class="field" style="margin-top:10px"><label>Frecuencia</label><div class="grid three">${Object.entries(FRECUENCIAS).map(([v,l])=>`<button type="button" data-may-frecuencia="${v}" class="btn ${frecuenciaSel===v?'primary':'ghost'}">${l}</button>`).join('')}</div></div>
      <div class="field"><label>Forma de pago</label><div class="grid three">
        <button type="button" data-may-metodo="cash" class="btn ${metodoSel==='cash'?'primary':'ghost'}">Efectivo</button>
        <button type="button" data-may-metodo="transfer" class="btn ${metodoSel==='transfer'?'primary':'ghost'}">Transferencia</button>
        <button type="button" data-may-metodo="mp" class="btn ${metodoSel==='mp'?'primary':'ghost'}">Mercado Pago</button>
      </div></div>
      <div id="err_mayorista" class="alert danger" style="display:none"></div>
      <button class="btn primary" id="btn_confirmar_mayorista" style="width:100%;margin-top:10px">${subActiva?'Actualizar pedido':'Confirmar pedido'}</button>
      ${subActiva && subActiva.status==='active'?`<button class="btn ghost" data-pausar="${subActiva.id}" style="width:100%;margin-top:8px">⏸️ Pausar pedidos</button>`:''}
      ${subActiva && subActiva.status==='paused'?`<button class="btn primary" data-reanudar="${subActiva.id}" style="width:100%;margin-top:8px">▶️ Reanudar</button>`:''}
    </div>
    ${productosMayoristas.length?`<div class="card"><h3>🛒 Otros productos (precio mayorista)</h3>
      ${productosMayoristas.map(p=>{
        const sinStock = p.stock!==null && p.stock<=0
        const yaElegido = (cuenta.mis_intereses||[]).find(mi=>mi.product_id===p.id)
        const enCarritoNuevo = mayoristaCarritoProductosNuevo[p.id]||0
        return `<div class="row" style="flex-direction:column;align-items:stretch">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span>${p.name}<br><small class="muted">$${Number(p.price).toLocaleString('es-AR')} · ${p.unit_label||'unidad'}</small>${p.stock!==null && !sinStock?`<br><small class="muted">Quedan ${p.stock} unidades</small>`:''}${sinStock?`<br><small style="color:#B03A2E">Sin stock por ahora</small>`:''}</span>
            ${yaElegido?`<span style="display:flex;align-items:center;gap:8px"><button data-ma-ajustar="${yaElegido.id}" data-nueva="${yaElegido.quantity-1}" class="btn ghost" style="padding:6px 12px">−</button><b>${yaElegido.quantity}</b><button data-ma-ajustar="${yaElegido.id}" data-nueva="${yaElegido.quantity+1}" data-stock-max="${p.stock===null?'':p.stock}" class="btn ghost" style="padding:6px 12px">+</button></span>`
            : sinStock?`<span class="badge" style="background:#D3D1C7;color:#5F5E5A">Sin stock</span>`
            : `<span style="display:flex;align-items:center;gap:8px"><button data-ma-prod-menos="${p.id}" class="btn ghost" style="padding:6px 12px">−</button><b>${enCarritoNuevo}</b><button data-ma-prod-mas="${p.id}" data-stock-max="${p.stock===null?'':p.stock}" class="btn ghost" style="padding:6px 12px">+</button></span>`}
          </div>
        </div>`
      }).join('')}
      ${Object.values(mayoristaCarritoProductosNuevo).some(q=>q>0)?`<button class="btn primary" id="btn_confirmar_productos_mayorista" style="width:100%;margin-top:10px">Agregar al pedido</button>`:''}
    </div>`:''}
    ${cuenta.historial_entregas && cuenta.historial_entregas.length ? `<div class="card"><h3>📦 Historial de entregas</h3>${cuenta.historial_entregas.map(h=>`<div class="row"><span>${formatearFecha(h.delivery_date)}</span><span>${h.egg_quantity||0} huevos</span></div>`).join('')}</div>`:''}
    <div class="card" id="card_pagos"><h3>💳 Historial de pagos</h3>${skeletonBloque(3)}</div>
    <div class="card" id="card_datos"><h3>Tus datos</h3><p>🪪 DNI ${c.dni||'-'}</p><p>🏠 ${TIPOS_VIA[c.street_type]||'Calle'} ${c.street||''} ${c.street_number||''}</p><p>🏘️ Barrio ${c.neighborhood||'-'}</p><p>📍 ${c.city||'-'}, ${c.province||'-'}, ${c.country||'-'} (CP ${c.postal_code||'-'})</p><p>📞 ${c.phone||'-'}</p><p>✉️ ${c.email||'-'}</p><button class="btn ghost" id="btn_editar_datos" style="margin-top:8px">✏️ Editar mis datos</button></div>
    <button class="btn ghost" id="btn_logout_mayorista">Cerrar sesión</button>`)
    cargarRepartidor(c, esHoy)
    cargarHistorialPagos(c)
    const btnEditar = document.querySelector('#btn_editar_datos')
    if(btnEditar) btnEditar.onclick = ()=>editarDatosForm(c)
    document.querySelectorAll('[data-pausar]').forEach(b=>b.onclick = async ()=>{
      const fecha = prompt('¿Hasta qué fecha querés pausar? (opcional, formato AAAA-MM-DD). Dejá vacío si no sabés todavía.')
      if(fecha===null) return
      const { data, error } = await supabase.rpc('customer_pause_subscription', { p_dni: c.dni, p_customer_id: c.id, p_subscription_id: b.dataset.pausar, p_resume_date: fecha||null })
      if(error || !data?.ok){ mostrarAlerta('No se pudo pausar: '+(data?.error||error?.message||'')); return }
      mostrarAlerta('⏸️ Pedidos pausados. No te vamos a entregar ni cobrar hasta que los reanudes.')
      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
      if(fresh?.found) cuenta = fresh
      mayoristaPanel()
    })
    document.querySelectorAll('[data-reanudar]').forEach(b=>b.onclick = async ()=>{
      const { data, error } = await supabase.rpc('customer_resume_subscription', { p_dni: c.dni, p_customer_id: c.id, p_subscription_id: b.dataset.reanudar })
      if(error || !data?.ok){ mostrarAlerta('No se pudo reanudar: '+(data?.error||error?.message||'')); return }
      mostrarAlerta(data.next_delivery_date ? `▶️ Reanudado. Próxima entrega: ${formatearFecha(data.next_delivery_date)}` : '▶️ Reanudado.')
      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
      if(fresh?.found) cuenta = fresh
      mayoristaPanel()
    })
    document.querySelectorAll('[data-may-mas]').forEach(b=>b.onclick=()=>{ mayoristaCarrito[b.dataset.mayMas]=(mayoristaCarrito[b.dataset.mayMas]||0)+1; dibujar() })
    document.querySelectorAll('[data-may-menos]').forEach(b=>b.onclick=()=>{ if(mayoristaCarrito[b.dataset.mayMenos]>0) mayoristaCarrito[b.dataset.mayMenos]--; dibujar() })
    document.querySelectorAll('[data-may-frecuencia]').forEach(b=>b.onclick=()=>{ frecuenciaSel=b.dataset.mayFrecuencia; dibujar() })
    document.querySelectorAll('[data-may-metodo]').forEach(b=>b.onclick=()=>{ metodoSel=b.dataset.mayMetodo; dibujar() })
    document.querySelectorAll('[data-ma-prod-mas]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.maProdMas, stockMax=b.dataset.stockMax
      const actual = mayoristaCarritoProductosNuevo[id]||0
      if(stockMax!=='' && actual+1>Number(stockMax)){ mostrarAlerta(`Solo quedan ${stockMax} unidades disponibles.`); return }
      mayoristaCarritoProductosNuevo[id] = actual+1; dibujar()
    })
    document.querySelectorAll('[data-ma-prod-menos]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.maProdMenos
      mayoristaCarritoProductosNuevo[id] = Math.max(0,(mayoristaCarritoProductosNuevo[id]||0)-1); dibujar()
    })
    document.querySelectorAll('[data-ma-ajustar]').forEach(b=>b.onclick=async()=>{
      const nueva = Number(b.dataset.nueva)
      const stockMax = b.dataset.stockMax
      if(stockMax!==undefined && stockMax!=='' && nueva>Number(stockMax)){ mostrarAlerta(`Solo quedan ${stockMax} unidades disponibles.`); return }
      const { data, error } = await supabase.rpc('customer_update_interest_quantity', { p_dni: c.dni, p_customer_id: c.id, p_interest_id: b.dataset.maAjustar, p_new_quantity: nueva })
      if(error || !data?.ok){ mostrarAlerta(data?.error || error?.message || 'No se pudo actualizar.'); return }
      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
      if(fresh?.found) cuenta = fresh
      mayoristaPanel()
    })
    const btnConfirmarProductosMayorista = document.querySelector('#btn_confirmar_productos_mayorista')
    if(btnConfirmarProductosMayorista) btnConfirmarProductosMayorista.onclick = async ()=>{
      const items = Object.entries(mayoristaCarritoProductosNuevo).filter(([,q])=>q>0)
      for(const [productId, cantidad] of items){
        const { data, error } = await supabase.rpc('customer_mark_interest', { p_dni: c.dni, p_customer_id: c.id, p_product_id: productId, p_quantity: cantidad })
        if(error || !data?.ok){ mostrarAlerta('No se pudo sumar uno de los productos: '+(data?.error||error?.message||'')); return }
      }
      mayoristaCarritoProductosNuevo = {}
      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
      if(fresh?.found) cuenta = fresh
      mostrarAlerta('¡Sumado a tu próximo pedido!')
      mayoristaPanel()
    }
    document.querySelector('#btn_logout_mayorista').onclick = ()=>{ mayoristaCarrito={}; mayoristaCarritoProductosNuevo={}; cuenta=null; current='mayorista-login'; render() }
    document.querySelector('#btn_confirmar_mayorista').onclick = async ()=>{
      const errBox = document.querySelector('#err_mayorista')
      const total = totalCant()
      if(total<=0){ errBox.textContent='Elegí al menos un tamaño.'; errBox.style.display='block'; return }
      const breakdown = Object.entries(mayoristaCarrito).filter(([,q])=>q>0).map(([size,qty])=>({size:Number(size),qty}))
      const { data, error } = await supabase.rpc('mayorista_hacer_pedido', { p_dni: c.dni, p_customer_id: c.id, p_egg_quantity: total, p_frequency: frecuenciaSel, p_payment_method: metodoSel, p_plan_breakdown: breakdown, p_price: totalPrecio() })
      if(error || !data?.ok){ errBox.textContent = 'No se pudo confirmar: '+(data?.error||error?.message||''); errBox.style.display='block'; return }
      mostrarAlerta(`¡Listo! Próxima entrega: ${formatearFecha(data.next_delivery_date)}`)
      const { data: fresh } = await supabase.rpc('customer_login', { p_dni: c.dni })
      if(fresh?.found) cuenta = fresh
      current = 'mayorista-panel'; render()
    }
  }
  dibujar()
}

async function preparador(){
  const { data, error } = await supabase.rpc('preparador_pedidos_pendientes', {})
  const pedidos = data || []
  const hoy = new Date().toISOString().slice(0,10)
  const grupos = {}
  pedidos.forEach(p=>{ grupos[p.delivery_date] ??= []; grupos[p.delivery_date].push(p) })
  const fechasOrdenadas = Object.keys(grupos).sort()
  const contenido = fechasOrdenadas.length ? fechasOrdenadas.map(f=>{
    const titulo = f===hoy ? 'Hoy' : formatearFecha(f)
    return pCard(`
      <div style="font-size:13px;font-weight:700;color:#2F4D2A;margin-bottom:8px">${titulo}</div>
      ${grupos[f].map(p=>`<div class="row"><span><b>${p.last_name||''}</b>, ${p.first_name||''}<br><small class="muted">${(p.plan_breakdown&&p.plan_breakdown.length)?p.plan_breakdown.map(b=>`${b.qty}×${b.size}`).join(' + ')+' huevos':`${p.egg_quantity||0} huevos`}</small></span><button data-preparar="${p.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:8px 14px;font-size:12px;font-weight:600">Preparar</button></div>`).join('')}
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
    ${o.important_note?`<div class="alert warning">⚠️ ${o.important_note}</div>`:''}
  </div>
  <div class="card">
    <h3>✅ Checklist</h3>
    <p class="muted" style="font-size:11.5px;margin-bottom:8px">Podés salir y volver cuando quieras — lo que ya tildaste queda guardado.</p>
    <label style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #F0EBDD"><input type="checkbox" class="check-prep" data-item-key="eggs" ${marcados.includes('eggs')?'checked':''} style="width:18px;height:18px"/> <span>🥚 ${FRECUENCIAS[sub.frequency]||sub.frequency||''} · ${sub.egg_quantity||'-'} huevos${sub.plan_breakdown?` (${sub.plan_breakdown.map(b=>`${b.qty}×${b.size}`).join(' + ')})`:''}</span></label>
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
      if(!e.first_name.trim() || !e.last_name.trim() || !/^\d{7,8}$/.test(e.dni.trim())){ errBox.textContent='Completá nombre, apellido y un DNI válido.'; errBox.style.display='block'; return }
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

async function campo(){
  const today = new Date().toISOString().slice(0,10)
  const recientes = await q('production','id,production_date,eggs_count,maples_count,losses_count,notes,source,cost,supplier_name')
  const { data: productosRaw } = await supabase.from('products').select('id,name,unit_label,current_qty,active').eq('active',true).order('name')
  const productos = productosRaw || []
  let origenSel = 'propio'
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
    <div id="campos_comprado" style="display:none">
      <div class="grid two">
        <div class="field"><label>¿A quién se lo compraste?</label><input id="p_supplier" placeholder="Ej: Granja Los Aromos"/></div>
        <div class="field"><label>Costo total ($)</label><input id="p_cost" type="number" min="0"/></div>
      </div>
      <p class="muted" style="font-size:12px;margin-top:-8px">Esto genera un gasto automático en Finanzas — no hace falta que lo cargues dos veces.</p>
    </div>
    <div class="field"><label>Observaciones</label><textarea id="p_notes" rows="2" placeholder="Ej: cambio de parcela, incidencia sanitaria, etc."></textarea></div>
    <div id="err_campo" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="btn_guardar_produccion">Guardar</button>
  </div>
  <div class="card"><h3>Últimos registros</h3>${recientes.length?recientes.slice(-10).reverse().map(r=>`<div class="row"><span>${r.production_date} ${r.source==='comprado'?' <span class="badge" style="background:#B85C00">🤝 Comprado</span>':''}${r.supplier_name?`<br><small class="muted">${r.supplier_name}</small>`:''}</span><span>${r.eggs_count} huevos · ${r.losses_count||0} roturas${r.cost?`<br><small class="muted">$${Number(r.cost).toLocaleString('es-AR')}</small>`:''}</span></div>`).join(''):'<p class="muted">Todavía no hay registros.</p>'}</div>
  <div class="card"><h3>🧺 Insumos disponibles</h3>
    ${productos.length? productos.map(p=>`<div class="row"><span><b>${p.current_qty}</b> × ${p.unit_label}<br><small>${p.name}</small></span><span style="display:flex;gap:6px;align-items:center"><input type="number" min="0.01" step="0.5" value="1" id="uso_qty_${p.id}" style="width:60px"/><button class="btn ghost" data-usar="${p.id}">Usar</button></span></div>`).join('') : '<p class="muted">Todavía no hay insumos cargados.</p>'}
  </div>`)
  document.querySelector('#btn_origen_propio').onclick = ()=>{
    origenSel='propio'
    document.querySelector('#btn_origen_propio').className='btn primary'
    document.querySelector('#btn_origen_comprado').className='btn ghost'
    document.querySelector('#campos_comprado').style.display='none'
  }
  document.querySelector('#btn_origen_comprado').onclick = ()=>{
    origenSel='comprado'
    document.querySelector('#btn_origen_comprado').className='btn primary'
    document.querySelector('#btn_origen_propio').className='btn ghost'
    document.querySelector('#campos_comprado').style.display='block'
  }
  document.querySelector('#btn_guardar_produccion').onclick = async ()=>{
    const eggs = Number(document.querySelector('#p_eggs').value)
    const losses = Number(document.querySelector('#p_losses').value)||0
    const date = document.querySelector('#p_date').value
    const notes = document.querySelector('#p_notes').value.trim()
    const box = document.querySelector('#err_campo')
    if(!eggs || eggs<=0){ box.textContent='Ingresá la cantidad de huevos recolectados.'; box.style.display='block'; return }
    const supplierName = origenSel==='comprado' ? document.querySelector('#p_supplier').value.trim() : null
    const cost = origenSel==='comprado' ? (Number(document.querySelector('#p_cost').value)||null) : null
    const { data, error } = await supabase.rpc('registrar_produccion', { p_date:date, p_eggs:eggs, p_losses:losses, p_notes: notes||null, p_source: origenSel, p_cost: cost, p_supplier_name: supplierName||null })
    if(error || !data?.ok){ box.textContent='No se pudo guardar: '+(error?.message||data?.error||''); box.style.display='block'; return }
    mostrarAlerta('Registro guardado ✅'); render()
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
  <button id="btn_exportar_clientes" class="btn ghost" style="width:100%;margin-bottom:12px">📊 Exportar a Excel (CSV)</button>
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

async function pedidos(){
  const rows = await q('orders','id,order_number,delivery_date,status,egg_quantity,important_note,time_restriction_manual,assigned_driver,assigned_preparer,assignment_locked,customers(first_name,last_name,neighborhood,street,street_number)')
  const { data: staffRaw } = await supabase.from('staff_roles').select('user_id,full_name,role')
  const staffMap = Object.fromEntries((staffRaw||[]).map(s=>[s.user_id, s.full_name||'(sin nombre)']))
  const preparadoresRoles = Object.fromEntries((staffRaw||[]).map(s=>[s.user_id, s.role]))
  const ordenados = [...rows].sort((a,b)=> new Date(b.delivery_date) - new Date(a.delivery_date))

  layout(`<h2>Pedidos</h2>
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

  const rows = await q('orders','id,status,delivery_date,important_note,time_restriction_manual,assigned_driver,customer_stage,customers(id,first_name,last_name,phone,neighborhood,street,street_number,zone,city)')
  const rowsDelDia = rows.filter(r=>r.delivery_date===fecha && (myRole==='admin' || r.assigned_driver===session?.user?.id))

  const { data: miVehiculoRaw } = await supabase.from('vehicles').select('type,brand,model,color,plate').eq('assigned_to', session.user.id).eq('active', true).maybeSingle()
  const miVehiculo = miVehiculoRaw || null
  const miNombre = staffProfile?.full_name || 'tu repartidor'

  let tituloChico = fecha===hoy ? 'Entregas de hoy' : fecha===manana ? 'Entregas de mañana' : 'Entregas'
  const subtitulo = formatearFecha(fecha)

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
        <button data-delivery="${r.id}" style="flex:1;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:9px 0;font-size:11px;font-weight:600">Abrir</button>
        <button data-maps="${encodeURIComponent(direccionCompleta)}" style="flex:1;background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8;border-radius:10px;padding:9px 0;font-size:11px;font-weight:600">🧭 Maps</button>
        ${telLimpio?`<button data-avisar="${r.id}" data-tel="${telLimpio}" data-nombre="${c.first_name||''}" data-driver="${r.assigned_driver||session.user.id}" style="flex:1;background:#25D366;color:#fff;border:none;border-radius:10px;padding:9px 0;font-size:11px;font-weight:600">🛵 Voy</button>`:''}
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
  <div class="field"><label>Elegí la fecha a ver</label><input type="date" id="rep_ruta_fecha" value="${fecha}"/></div>
  <div style="display:flex;gap:8px;margin-bottom:12px">
    <button class="btn ghost" id="btn_ver_mapa_repartidor" style="flex:1">🗺️ Ver mapa</button>
    <button id="btn_sali_a_repartir" style="flex:1;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;font-size:13px;font-weight:600">📦 Salí a repartir</button>
  </div>
  <div class="alert warning"><b>⚠️ ATENCIÓN</b><br>Las restricciones horarias y observaciones importantes aparecen destacadas.</div>
  ${contenido}`)

  document.querySelector('#rep_ruta_fecha').onchange = (e)=>{ repRutaFecha = e.target.value; render() }
  document.querySelectorAll('[data-delivery]').forEach(b=>b.onclick=()=>openDelivery(b.dataset.delivery))
  document.querySelectorAll('[data-maps]').forEach(b=>b.onclick=()=>{
    window.open('https://www.google.com/maps/search/?api=1&query='+b.dataset.maps,'_blank')
  })
  document.querySelectorAll('[data-avisar]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.avisar
    const driverId = b.dataset.driver || session.user.id
    // Solo un pedido puede estar "en camino" a la vez para ese repartidor
    await supabase.from('orders').update({ customer_stage: null }).eq('assigned_driver', driverId).eq('customer_stage', 'en_route')
    const { error } = await supabase.from('orders').update({ customer_stage: 'en_route', en_route_at: new Date().toISOString() }).eq('id', id)
    if(error){ mostrarAlerta('No se pudo actualizar el estado: '+error.message); return }
    const datosVehiculo = miVehiculo ? ` en mi ${miVehiculo.type==='moto'?'moto':'camioneta'} ${miVehiculo.brand||''} ${miVehiculo.model||''}${miVehiculo.color?` color ${miVehiculo.color}`:''}, patente ${miVehiculo.plate}` : ''
    const mensaje = encodeURIComponent(`Hola ${b.dataset.nombre}! Soy ${miNombre}, tu repartidor de NÓMADES 🛵 Ya estoy yendo hacia tu casa${datosVehiculo}. Tu pedido llega en los próximos minutos.`)
    mostrarAlerta('✅ Estado actualizado a "Hacia tu casa". Ahora se abre WhatsApp con el aviso.')
    window.open(`https://wa.me/54${b.dataset.tel}?text=${mensaje}`, '_blank')
    render()
  })
  document.querySelector('#btn_ver_mapa_repartidor').onclick = ()=>mapaRepartidor()
  document.querySelector('#btn_sali_a_repartir').onclick = async ()=>{
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
let mostrarFormNuevoProveedor = false
let productoExpandido = null
let productoDetalleCache = {}
let proveedorPedidoSeleccionado = null
let pedidoProveedorCantidades = {} // product_id -> { qty, unitType }
let pedidoProveedorTipoEntrega = 'entrega'
let pedidoProveedorGenerado = null // texto del pedido ya armado
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
  if(errDet || !detalle || detalle.error) return mostrarAlerta('No se pudo cargar el pedido')
  const r = detalle.order, c = detalle.customer, sub = detalle.subscription || {}
  const credito = detalle.credit
  const productos = detalle.productos || []
  const { data: settingsRaw } = await supabase.from('farm_settings').select('key,value').in('key',['transfer_cbu','transfer_alias','transfer_bank_name','transfer_holder_name','transfer_holder_doc','mp_alias','mp_wallet_name','mp_cbu','mp_holder_name','mp_holder_doc','wallet_discount_type','wallet_discount_value'])
  const cfg = Object.fromEntries((settingsRaw||[]).map(s=>[s.key,s.value]))
  const montoHuevos = sub.price_at_signup || 0
  const totalProductos = productos.reduce((s,p)=>s+Number(p.price)*p.quantity,0)
  const montoOriginal = montoHuevos + totalProductos
  const descuentoBilletera = sub.payment_method==='mp' ? calcularDescuentoBilletera(montoOriginal, cfg.wallet_discount_type, cfg.wallet_discount_value) : 0
  const montoTrasBilletera = montoOriginal - descuentoBilletera
  const montoDefault = credito ? Math.max(0, montoTrasBilletera - credito.discount_amount) : montoTrasBilletera
  layout(`<h2>Detalle de entrega</h2>${r.important_note?`<div class="alert warning"><b>⚠️ OBSERVACIÓN IMPORTANTE</b><br>${r.important_note}</div>`:''}
  ${descuentoBilletera>0?`<div class="alert info">💳 Paga por billetera virtual — tiene <b>$${descuentoBilletera.toLocaleString('es-AR')} de descuento</b> ya restado. Pedile el comprobante antes de confirmar.</div>`:''}
  ${credito?`<div class="alert info">🎁 Este cliente tiene <b>$${Number(credito.discount_amount).toLocaleString('es-AR')} de descuento</b> por recomendar a alguien. Ya está restado del monto a cobrar.</div>`:''}
  <div class="grid two">
    <div class="card">
      <h3>${c.street||''} ${c.street_number||''}</h3>
      <p>${c.first_name||''} ${c.last_name||''}</p>
      <p>📞 ${c.phone||'-'}</p>
      <p>💰 A cobrar: <b>$${Number(montoDefault).toLocaleString('es-AR')}</b>${(descuentoBilletera>0||credito)?` <span class="muted" style="text-decoration:line-through">$${Number(montoOriginal).toLocaleString('es-AR')}</span>`:''}</p>
      <p>💳 Método configurado: <b>${METODOS_PAGO_LABEL[sub.payment_method]||sub.payment_method||'-'}</b></p>
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
    suppliersRes, catalogRes, recordatoriosRes, rendicionVendedoresRes, sugerenciasRes, rankingSugerenciasRes
  ] = await Promise.all([
    q('orders','id,status,delivery_date,egg_quantity,important_note,time_restriction_manual'),
    q('customers','id'),
    q('subscriptions','id,payment_status,created_at,customers(first_name,last_name)'),
    q('staff_roles','user_id,role,full_name,created_at'),
    q('products','id,name,unit_label,category,current_qty,active'),
    supabase.from('stock_movements').select('id,product_id,type,quantity,note,created_by,created_at').order('created_at',{ascending:false}).limit(20),
    supabase.from('waitlist').select('id,customer_id,egg_quantity,frequency,position,created_at,customers(first_name,last_name,phone)').order('position'),
    supabase.from('farm_settings').select('key,value').in('key',['default_daily_capacity_maples','transfer_cbu','transfer_alias','transfer_bank_name','transfer_holder_name','transfer_holder_doc','mp_alias','mp_wallet_name','mp_cbu','mp_holder_name','mp_holder_doc','assignment_mode','wallet_discount_type','wallet_discount_value']),
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
    supabase.from('suppliers').select('id,name,contact_phone,contact_email,address,notes').order('name'),
    supabase.rpc('admin_catalog_products', {}),
    supabase.rpc('admin_recordatorios_3_dias', {}),
    supabase.rpc('admin_rendicion_vendedores', {}),
    supabase.rpc('admin_product_suggestions', {}),
    supabase.rpc('admin_suggestions_ranking', {})
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

  return { orders,customers,subs,staff,productos,movimientos,waitlist,settingsMap,repartidores,zoneDrivers,neighDrivers,barrios,barrioZonaMap,pedidosAsignar,pagos,productMap,planPrices,categorias,movimientosFinanzas,dash,vehiculos,alertas,driverLedger,ranking,reviews,suppliers,catalogo,recordatorios,rendicionVendedores,sugerencias,rankingSugerencias }
}

async function admin(){
  if(!adminData){
    layout(`<h2>Panel de administración</h2><div class="card">${skeletonBloque(5)}</div>`)
    adminData = await fetchAdminData()
  }
  const { orders,customers,subs,staff,productos,movimientos,waitlist,settingsMap,repartidores,zoneDrivers,neighDrivers,barrios,barrioZonaMap,pedidosAsignar,pagos,productMap,planPrices,categorias,movimientosFinanzas,dash,vehiculos,alertas,driverLedger,ranking,reviews,suppliers,catalogo,recordatorios,rendicionVendedores,sugerencias,rankingSugerencias } = adminData
  const capacidadBase = settingsMap.default_daily_capacity_maples || '300'
  const assignmentMode = settingsMap.assignment_mode || 'zone'
  const staffMap = Object.fromEntries(staff.map(s=>[s.user_id, s.full_name||'(sin nombre)']))
  const CATEGORIAS = [{value:'alimento',label:'Alimento'},{value:'sanidad',label:'Sanidad'},{value:'limpieza',label:'Limpieza'},{value:'otro',label:'Otro'}]
  const CATLABEL = {alimento:'Alimento',sanidad:'Sanidad',limpieza:'Limpieza',otro:'Otro'}
  const categoriaMap = Object.fromEntries(categorias.map(c=>[c.id,c]))
  const TIPO_CAT_LABEL = { fixed:'Fijo', variable:'Variable', income:'Ingreso' }
  const count=s=>orders.filter(x=>x.status===s).length
  const pendientesDePago = subs.filter(s=>s.payment_status==='pending')
  const rolLabel = {admin:'Administrador',campo:'Personal de campo',repartidor:'Repartidor',preparador:'Preparador de pedidos',vendedor:'Vendedor'}
  const AS = (id)=> adminOpenSection===id
  const accHead = (id, icon, titulo, badge)=> `<button type="button" class="acc-header" data-acc="${id}" style="all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;padding:14px 16px;cursor:pointer;gap:10px;background:${AS(id)?'#F5EFE0':'transparent'}"><span style="width:32px;height:32px;border-radius:9px;background:#EAF0DC;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">${icon}</span><span style="flex:1;font-weight:700;font-size:14.5px;color:#2F4D2A">${titulo}</span>${badge?pPill(badge,'#FBE4CC','#B85C00'):''}<span style="font-size:13px;color:#8A8570">${AS(id)?'▲':'▼'}</span></button><div class="acc-body" style="max-height:${AS(id)?'6000px':'0'};padding:${AS(id)?'4px 16px 16px 16px':'0 16px'}">`
  const statCard = (id,label,value)=> `<div data-stat="${id}" style="cursor:pointer;flex:0 0 auto;min-width:96px;background:#2F4D2A;border-radius:14px;padding:10px 14px;display:flex;flex-direction:column;gap:2px"><span style="color:#C9D8B0;font-size:11px;line-height:1.25">${label}</span><span style="color:#F5EFE0;font-size:20px;font-weight:700;line-height:1.15">${value}</span></div>`

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
    return `<div style="background:#2F4D2A;border-radius:16px;padding:16px;margin-bottom:12px">
      <div style="color:#C9D8B0;font-size:12px;margin-bottom:2px">Resumen de hoy</div>
      <div style="color:#F5EFE0;font-size:15px;font-weight:700;margin-bottom:12px">${fechaLinda}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:rgba(255,255,255,0.08);border-radius:10px;padding:9px 10px"><div style="color:#C9D8B0;font-size:11px">Entregadas hoy</div><div style="color:#F5EFE0;font-size:17px;font-weight:700" data-count-target="${entregadosHoy}">0</div></div>
        <div style="background:rgba(255,255,255,0.08);border-radius:10px;padding:9px 10px"><div style="color:#C9D8B0;font-size:11px">Faltan repartir</div><div style="color:#F5EFE0;font-size:17px;font-weight:700" data-count-target="${pendientesHoy}">0</div></div>
        <div style="background:rgba(255,255,255,0.08);border-radius:10px;padding:9px 10px"><div style="color:#C9D8B0;font-size:11px">Huevos de hoy</div><div style="color:#F5EFE0;font-size:17px;font-weight:700" data-count-target="${huevosHoy}">0</div></div>
        <div style="background:rgba(255,255,255,0.08);border-radius:10px;padding:9px 10px"><div style="color:#C9D8B0;font-size:11px">Vendido hoy</div><div style="color:#F5EFE0;font-size:17px;font-weight:700" data-count-target="${ventasHoy}" data-count-currency="1">$0</div></div>
      </div>
      ${totalAlertasHoy>0?`<div style="margin-top:10px;background:#E8833A;border-radius:10px;padding:8px 12px;color:#FFFFFF;font-size:12px;font-weight:600">⚠️ Tenés ${totalAlertasHoy} alerta${totalAlertasHoy===1?'':'s'} pendiente${totalAlertasHoy===1?'':'s'} en Vehículos y mantenimiento</div>`:''}
      ${restriccionesHoy>0?`<div style="margin-top:10px;background:#B85C00;border-radius:10px;padding:8px 12px;color:#FFFFFF;font-size:12px;font-weight:600">⏰ Tenés ${restriccionesHoy} pedido${restriccionesHoy===1?'':'s'} con restricción horaria hoy</div>`:''}
    </div>`
  })()

  layout(`<h2>Panel de administración</h2>
  ${resumenDia}
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
      <div class="field"><label>Rol</label><select id="staff_new_role"><option value="campo">Personal de campo</option><option value="repartidor">Repartidor</option><option value="preparador">Preparador de pedidos</option><option value="vendedor">Vendedor</option><option value="admin">Administrador</option></select></div>
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
            p.customer_stage==='preparing' ? pBtn('✖️','Quitar "Preparando"',`data-quitar-preparando="${p.id}"`,'ghost') : pBtn('🥚','Marcar "Preparando"',`data-marcar-preparando="${p.id}"`,'ghost'),
            ...(p.assignment_locked?[pBtn('🔄','Volver a automático',`data-destrabar="${p.id}"`,'ghost')]:[])
          ])}
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
          <div style="font-weight:700;color:#2F4D2A">${pp.egg_quantity} huevos ${pp.customer_type==='mayorista'?'<span class="badge" style="background:#B85C00">🏭 Mayorista</span>':''}</div>
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
        ${suppliers.map(s=>`<div class="row"><span>${s.name}<br><small class="muted">${s.contact_phone||''} ${s.contact_email||''}</small></span></div>`).join('')}
        <div class="field" style="margin-top:8px"><label>Nombre de la empresa</label><input id="prov_new_name"/></div>
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
          <div class="field"><label>Precio</label><input id="catprod_new_price" type="number" min="0"/></div>
          <div class="field"><label>Unidad</label><input id="catprod_new_unit" placeholder="Ej: botella, paquete"/></div>
        </div>
        <div class="field"><label>Categoría</label><select id="catprod_new_cat">${CATEGORIAS_CATALOGO.map(cat=>`<option value="${cat}">${cat}</option>`).join('')}</select></div>
        <div class="field"><label>Stock disponible (opcional — dejalo vacío si no querés controlarlo)</label><input id="catprod_new_stock" type="number" min="0" placeholder="Ej: 20"/></div>
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
              <div style="display:flex;gap:6px;margin-bottom:10px">
                <input id="mayorista_valor_${p.id}" type="number" min="0" value="${p.wholesale_price||''}" placeholder="Vacío = no se ofrece a mayoristas" style="flex:1"/>
                <button data-guardar-mayorista="${p.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:0 14px;font-size:12px;font-weight:600">Guardar</button>
              </div>
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
  ${accHead('pedidos_proveedor','📋','Pedidos a proveedores')}
    <p class="muted">Armá tu pedido de compra a una empresa y mandalo por WhatsApp, o guardalo como PDF para el mail.</p>
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
      return `
      ${productosProv.map(p=>{
        const c = pedidoProveedorCantidades[p.id] || { qty:0, unitType:'unidad' }
        return `<div class="row"><span>${p.name}<br><small class="muted">$${Number(p.price).toLocaleString('es-AR')} · ${p.unit_label||'unidad'}${p.units_per_bulto>1?` (bulto = ${p.units_per_bulto})`:''}</small></span>
          <span style="display:flex;gap:4px;align-items:center">
            <input data-cant-pedido="${p.id}" type="number" min="0" value="${c.qty}" style="width:50px"/>
            <select data-unidad-pedido="${p.id}" style="width:80px">
              <option value="unidad" ${c.unitType==='unidad'?'selected':''}>Unidad</option>
              <option value="bulto" ${c.unitType==='bulto'?'selected':''}>Bulto</option>
              <option value="pallet" ${c.unitType==='pallet'?'selected':''}>Pallet</option>
            </select>
          </span></div>`
      }).join('')}
      <div class="field" style="margin-top:10px"><label>¿Entrega o retiro?</label>
        <div class="grid two">
          <button type="button" id="btn_tipo_entrega" class="btn ${pedidoProveedorTipoEntrega==='entrega'?'primary':'ghost'}">Que me entreguen</button>
          <button type="button" id="btn_tipo_retiro" class="btn ${pedidoProveedorTipoEntrega==='retiro'?'primary':'ghost'}">Lo paso a retirar</button>
        </div>
      </div>
      <button id="btn_generar_pedido_proveedor" style="width:100%;margin-top:10px;background:#2F4D2A;color:#F5EFE0;border:none;border-radius:10px;padding:11px 0;font-size:14px;font-weight:600">📋 Generar pedido</button>
      ${pedidoProveedorGenerado ? `
        <div class="alert info" style="margin-top:12px;white-space:pre-line;font-size:12px">${pedidoProveedorGenerado}</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          ${prov?.contact_phone?`<button id="btn_enviar_whatsapp_proveedor" style="flex:1;background:#25D366;color:#fff;border:none;border-radius:10px;padding:10px 0;font-size:12px;font-weight:600">💬 WhatsApp</button>`:''}
          <button id="btn_imprimir_pedido_proveedor" style="flex:1;background:#FFFFFF;color:#2F4D2A;border:1px solid #E3DCC8;border-radius:10px;padding:10px 0;font-size:12px;font-weight:600">🖨️ Guardar como PDF</button>
        </div>
      ` : ''}
      `
    })() : ''}
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
  ${accHead('agregado_manual','📞','Agregar producto por teléfono')}
    <p class="muted">Para cuando un cliente llama y quiere sumar algo a último momento (a menos de 24hs, el sistema ya no lo deja hacer solo).</p>
    <div class="field"><label>Número de WhatsApp donde te llegan estos pedidos</label>
      <div style="display:flex;gap:6px">
        <input id="whatsapp_urgentes_valor" value="${settingsMap.whatsapp_pedidos_urgentes||''}" placeholder="Ej: 3411234567" style="flex:1"/>
        <button id="btn_guardar_whatsapp_urgentes" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:0 16px;font-size:12px;font-weight:600">Guardar</button>
      </div>
    </div>
    <div class="field"><label>DNI del cliente</label>
      <div style="display:flex;gap:6px">
        <input id="buscar_dni_manual" inputmode="numeric" placeholder="Sin puntos" style="flex:1"/>
        <button id="btn_buscar_dni_manual" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:0 16px;font-size:12px;font-weight:600">Buscar</button>
      </div>
    </div>
    <div id="resultado_dni_manual"></div>
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
    <div class="grid two">
      <div style="background:#2F4D2A;border-radius:12px;padding:10px 12px"><div style="color:#C9D8B0;font-size:11px">Ventas (30 días)</div><div style="color:#F5EFE0;font-size:17px;font-weight:700">$${Number(dash.ventas||0).toLocaleString('es-AR')}</div></div>
      <div style="background:#2F4D2A;border-radius:12px;padding:10px 12px"><div style="color:#C9D8B0;font-size:11px">Gastos (30 días)</div><div style="color:#F5EFE0;font-size:17px;font-weight:700">$${Number(dash.gastos||0).toLocaleString('es-AR')}</div></div>
      <div style="background:#2F4D2A;border-radius:12px;padding:10px 12px"><div style="color:#C9D8B0;font-size:11px">Pérdidas (30 días)</div><div style="color:#F5EFE0;font-size:17px;font-weight:700">$${Number(dash.perdidas||0).toLocaleString('es-AR')}</div></div>
      <div style="background:#2F4D2A;border-radius:12px;padding:10px 12px"><div style="color:#C9D8B0;font-size:11px">Beneficio neto (30 días)</div><div style="color:${Number(dash.beneficio_neto||0)>=0?'#F5EFE0':'#F0997B'};font-size:17px;font-weight:700">$${Number(dash.beneficio_neto||0).toLocaleString('es-AR')}</div></div>
    </div>
    <div class="grid two" style="margin-top:8px">
      <div style="background:#EAF0DC;border-radius:12px;padding:10px 12px"><div style="color:#5F5E5A;font-size:11px">🛍️ Minoristas (30 días)</div><div style="color:#2F4D2A;font-size:16px;font-weight:700">$${Number(dash.ventas_minorista||0).toLocaleString('es-AR')}</div></div>
      <div style="background:#EAF0DC;border-radius:12px;padding:10px 12px"><div style="color:#5F5E5A;font-size:11px">🏭 Mayoristas (30 días)</div><div style="color:#2F4D2A;font-size:16px;font-weight:700">$${Number(dash.ventas_mayorista||0).toLocaleString('es-AR')}</div></div>
    </div>
    <div class="alert info" style="margin-top:10px"><b>Caja total acumulada: $${Number(dash.caja||0).toLocaleString('es-AR')}</b></div>

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
        <button id="btn_exportar_finanzas_pdf" class="btn ghost" style="flex:1">🖨️ PDF</button>
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
  document.querySelectorAll('[data-marcar-preparando]').forEach(b=>b.onclick=async()=>{
    const { error } = await supabase.from('orders').update({ customer_stage: 'preparing' }).eq('id', b.dataset.marcarPreparando)
    if(error){ mostrarAlerta('Error: '+error.message); return }
    adminData = null; render()
  })
  document.querySelectorAll('[data-quitar-preparando]').forEach(b=>b.onclick=async()=>{
    const { error } = await supabase.from('orders').update({ customer_stage: null }).eq('id', b.dataset.quitarPreparando)
    if(error){ mostrarAlerta('Error: '+error.message); return }
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
  if(btnPpMayorista) btnPpMayorista.onclick = ()=>{ ppTipoSel='mayorista'; btnPpMayorista.className='btn primary'; btnPpMinorista.className='btn ghost' }
  document.querySelector('#btn_agregar_tamano').onclick = async ()=>{
    const qty = Number(document.querySelector('#pp_new_qty').value)
    const price = Number(document.querySelector('#pp_new_price').value)
    const box = document.querySelector('#err_tamano')
    if(!qty || qty<=0 || !price || price<=0){ box.textContent='Completá cantidad de huevos y precio, ambos mayores a 0.'; box.style.display='block'; return }
    const { error } = await supabase.from('plan_prices').insert({ egg_quantity: qty, price, active: true, customer_type: ppTipoSel })
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
  const btnCrearProveedor = document.querySelector('#btn_crear_proveedor')
  if(btnCrearProveedor) btnCrearProveedor.onclick = async ()=>{
    const name = document.querySelector('#prov_new_name').value.trim()
    if(!name){ mostrarAlerta('Ponele un nombre a la empresa.'); return }
    const { error } = await supabase.from('suppliers').insert({
      name,
      contact_phone: document.querySelector('#prov_new_phone').value.trim(),
      contact_email: document.querySelector('#prov_new_email').value.trim(),
      address: document.querySelector('#prov_new_address').value.trim()
    })
    if(error){ mostrarAlerta('Error: '+error.message); return }
    mostrarFormNuevoProveedor = false
    adminData = null; render()
  }
  const btnToggleFormProducto = document.querySelector('#btn_toggle_form_producto')
  if(btnToggleFormProducto) btnToggleFormProducto.onclick = ()=>{ mostrarFormNuevoProducto = !mostrarFormNuevoProducto; render() }
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
  const btnBuscarDniManual = document.querySelector('#btn_buscar_dni_manual')
  if(btnBuscarDniManual) btnBuscarDniManual.onclick = async ()=>{
    const dni = document.querySelector('#buscar_dni_manual').value.trim()
    const resultBox = document.querySelector('#resultado_dni_manual')
    if(!/^\d{7,8}$/.test(dni)){ resultBox.innerHTML = '<div class="alert danger">Ingresá un DNI válido (7 u 8 números).</div>'; return }
    const { data, error } = await supabase.rpc('admin_buscar_cliente_por_dni', { p_dni: dni })
    if(error || !data?.found){ resultBox.innerHTML = '<div class="alert danger">No se encontró ningún cliente con ese DNI.</div>'; return }
    resultBox.innerHTML = `<div class="alert info" style="margin-top:10px">
      <b>${data.first_name||''} ${data.last_name||''}</b>
      <div class="field" style="margin-top:8px"><label>Producto</label><select id="manual_producto">${catalogo.filter(p=>p.active).map(p=>`<option value="${p.id}">${p.name} — $${Number(p.price).toLocaleString('es-AR')}</option>`).join('')}</select></div>
      <div style="display:flex;gap:6px;margin-top:6px">
        <input id="manual_cantidad" type="number" min="1" value="1" style="flex:1"/>
        <button id="btn_agregar_manual" data-customer-id="${data.id}" style="background:#2F4D2A;color:#F5EFE0;border:none;border-radius:8px;padding:0 16px;font-size:12px;font-weight:600">➕ Agregar</button>
      </div>
    </div>`
    document.querySelector('#btn_agregar_manual').onclick = async ()=>{
      const customerId = document.querySelector('#btn_agregar_manual').dataset.customerId
      const productId = document.querySelector('#manual_producto').value
      const cantidad = Number(document.querySelector('#manual_cantidad').value)||1
      const { data: res, error: errAdd } = await supabase.rpc('admin_agregar_producto_manual', { p_customer_id: customerId, p_product_id: productId, p_quantity: cantidad })
      if(errAdd || !res?.ok){ mostrarAlerta('No se pudo agregar: '+(errAdd?.message||res?.error||'')); return }
      adminData = null
      mostrarAlerta('Producto agregado ✅')
      resultBox.innerHTML = ''
      document.querySelector('#buscar_dni_manual').value = ''
    }
  }
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
    render()
  }
  document.querySelectorAll('[data-cant-pedido]').forEach(inp=>inp.oninput=()=>{
    const id = inp.dataset.cantPedido
    pedidoProveedorCantidades[id] = pedidoProveedorCantidades[id] || { qty:0, unitType:'unidad' }
    pedidoProveedorCantidades[id].qty = Number(inp.value)||0
  })
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
  if(btnGenerarPedidoProveedor) btnGenerarPedidoProveedor.onclick = ()=>{
    const prov = suppliers.find(s=>s.id===proveedorPedidoSeleccionado)
    const items = catalogo.filter(p=>p.supplier_id===proveedorPedidoSeleccionado)
      .map(p=>({ p, c: pedidoProveedorCantidades[p.id] }))
      .filter(x=>x.c && x.c.qty>0)
    if(!items.length){ mostrarAlerta('Poné alguna cantidad primero.'); return }
    const lineas = items.map(({p,c})=>`• ${c.qty} ${c.unitType==='unidad'?p.unit_label||'unidad':c.unitType}${c.qty>1?(c.unitType==='unidad'?'es':'s'):''} de ${p.name}`).join('\n')
    const direccion = settingsMap.transfer_holder_name ? '' : ''
    pedidoProveedorGenerado = `PEDIDO — NÓMADES (Huevos de libre pastoreo)\nPara: ${prov?.name||''}\n\n${lineas}\n\n${pedidoProveedorTipoEntrega==='entrega' ? 'Modalidad: nos lo entregan a nuestra dirección.' : 'Modalidad: lo pasamos a retirar nosotros.'}\n\nGracias, saludos — NÓMADES`
    render()
  }
  const btnEnviarWhatsappProveedor = document.querySelector('#btn_enviar_whatsapp_proveedor')
  if(btnEnviarWhatsappProveedor) btnEnviarWhatsappProveedor.onclick = ()=>{
    const prov = suppliers.find(s=>s.id===proveedorPedidoSeleccionado)
    const telLimpio = (prov?.contact_phone||'').replace(/\D/g,'')
    window.open(`https://wa.me/54${telLimpio}?text=${encodeURIComponent(pedidoProveedorGenerado)}`, '_blank')
  }
  const btnImprimirPedidoProveedor = document.querySelector('#btn_imprimir_pedido_proveedor')
  if(btnImprimirPedidoProveedor) btnImprimirPedidoProveedor.onclick = ()=>window.print()
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
    const { error } = await supabase.from('finance_entries').insert({ category_id, type: finTipoSel, amount, entry_date, description: description||null, attachment_url, created_by: session?.user?.id||null })
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
  const btnExportarFinPdf = document.querySelector('#btn_exportar_finanzas_pdf')
  if(btnExportarFinPdf) btnExportarFinPdf.onclick = ()=>window.print()
  animarContadores()
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

async function init(){
  const { data } = await supabase.auth.getSession()
  session = data.session
  if(session){
    const { data: roleRow } = await supabase.from('staff_roles').select('*').eq('user_id', session.user.id).single()
    myRole = roleRow?.role || null
    staffProfile = roleRow || null
    if(!myRole){ session=null }
    else if(!roleRow.profile_completed){ current = 'staff-profile-setup' }
    else { current = myRole==='campo' ? 'campo' : myRole==='repartidor' ? 'repartidor' : myRole==='preparador' ? 'preparador' : myRole==='vendedor' ? 'vendedor' : 'admin' }
  } else if(new URLSearchParams(window.location.search).get('mayorista')){
    current = 'mayorista-landing'
  }
  render()
}
init()
