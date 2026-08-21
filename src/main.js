import { supabase } from './services/supabase.js'

const app = document.querySelector('#app')
let current = 'inicio'
let session = null
let myRole = null // 'admin' | 'campo' | 'repartidor'
let cuenta = null // datos del cliente logueado por DNI
let staffProfile = null // datos del perfil del trabajador logueado

function navStaffFor(role){
  if(role==='admin') return [['clientes','Clientes'],['pedidos','Pedidos'],['repartidor','Repartidor'],['campo','Campo'],['admin','Administración'],['perfil','Mi perfil']]
  if(role==='campo') return [['campo','Campo'],['perfil','Mi perfil']]
  if(role==='repartidor') return [['repartidor','Repartidor'],['perfil','Mi perfil']]
  return []
}

function logoSVG(size){
  return `<svg width="${size}" height="${size}" viewBox="0 0 140 140" role="img" aria-label="Escudo NÓMADES"><circle cx="70" cy="70" r="66" fill="none" stroke="#2F4D2A" stroke-width="1.5"/><path d="M20 70 Q30 40 55 30 Q40 50 38 70 Q40 90 55 110 Q30 100 20 70 Z" fill="#8FAE6B"/><path d="M120 70 Q110 40 85 30 Q100 50 102 70 Q100 90 85 110 Q110 100 120 70 Z" fill="#8FAE6B"/><ellipse cx="70" cy="72" rx="20" ry="26" fill="#F5EFE0" stroke="#2F4D2A" stroke-width="1.2"/><path d="M62 48 C66 40 74 40 76 48" stroke="#2F4D2A" stroke-width="1.2" fill="none"/><rect x="35" y="98" width="70" height="16" rx="2" fill="#2F4D2A"/><text x="70" y="109" text-anchor="middle" font-size="9" fill="#F5EFE0" font-family="sans-serif" letter-spacing="1">NÓMADES</text></svg>`
}

function layout(content){
  const nav = session ? (current==='staff-profile-setup' ? [['logout','Salir']] : [['inicio','Inicio'],...navStaffFor(myRole),['logout','Salir']]) : [['inicio','Inicio'],['cuenta','Mi cuenta']]
  app.innerHTML = `<div class="shell"><div class="top"><div class="brand" style="display:flex;align-items:center;gap:8px">NÓMADES <span class="muted" style="font-size:12px">Huevos de libre pastoreo</span></div><div class="nav">${nav.map(([k,l])=>`<button class="btn ${current===k?'primary':'ghost'}" data-nav="${k}">${l}</button>`).join('')}</div></div>${content}${!session?`<div style="text-align:center;margin-top:24px"><a href="#" id="staff_link" class="muted" style="font-size:12px">Acceso del equipo</a></div>`:''}</div>`
  document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=async ()=>{
    if(b.dataset.nav==='logout'){ await supabase.auth.signOut(); session=null; myRole=null; current='inicio'; return render() }
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

function cuentaPanel(){
  const c = cuenta.customer
  const next = cuenta.next_order
  const tipoVia = TIPOS_VIA[c.street_type] || 'Calle'
  layout(`<h2>👤 Hola, ${c.first_name}</h2>
  <div class="card"><h3>Tu próximo pedido</h3>${next?`<div class="row"><span>${next.delivery_date}</span><span class="badge">${ESTADOS[next.status]||next.status}</span></div><p>${next.quantity_maples||''} maple(s)</p>`:'<p class="muted">No tenés entregas próximas.</p>'}</div>
  <div class="card"><h3>Tus suscripciones</h3>${cuenta.subscriptions.length?cuenta.subscriptions.map(s=>`<div class="row"><span>${s.egg_quantity} huevos · ${FRECUENCIAS[s.frequency]||s.frequency}</span><span class="badge">${s.payment_status==='paid'?'✅ Pago al día':'🟡 Pago pendiente'}</span></div>`).join(''):'<p class="muted">No tenés suscripciones activas.</p>'}</div>
  <div class="card" id="card_datos"><h3>Tus datos</h3><p>🏠 ${tipoVia} ${c.street||''} ${c.street_number||''}</p><p>🏘️ Barrio ${c.neighborhood||'-'}</p><p>📍 ${c.city||'-'}, ${c.province||'-'}, ${c.country||'-'} (CP ${c.postal_code||'-'})</p><p>📍 Zona ${c.zone?c.zone[0].toUpperCase()+c.zone.slice(1):'-'}</p><p>📞 ${c.phone||'-'}</p><p>✉️ ${c.email||'-'}</p><button class="btn ghost" id="btn_editar_datos" style="margin-top:8px">✏️ Editar mis datos</button></div>
  <button class="btn ghost" id="btn_logout_cuenta">Cerrar sesión</button>`)
  document.querySelector('#btn_logout_cuenta').onclick = ()=>{ cuenta=null; current='inicio'; render() }
  document.querySelector('#btn_editar_datos').onclick = ()=>editarDatosForm(c)
}

const ZONAS = [
  { value: 'norte', label: 'Norte' },
  { value: 'sur', label: 'Sur' },
  { value: 'este', label: 'Este' },
  { value: 'oeste', label: 'Oeste' }
]
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
  const rows=await q('orders','id,delivery_date,status,quantity_maples,customers(first_name,last_name,neighborhood,street,street_number)')
  layout(`<h2>Pedidos</h2><div class="card">${rows.length?rows.map(r=>{const c=r.customers||{};return `<div class="row"><span><b>${c.first_name||''} ${c.last_name||''}</b><br><small>${c.neighborhood||''} · ${c.street||''} ${c.street_number||''}</small></span><span>${r.quantity_maples||0} maple(s) · <span class="badge">${ESTADOS[r.status]||r.status}</span></span></div>`}).join(''):'<p class="muted">No hay pedidos cargados.</p>'}</div>`)
}

async function repartidor(){
  const rows=await q('orders','id,status,delivery_date,time_window_start,time_window_end,important_note,customers(id,first_name,last_name,phone,neighborhood,street,street_number)')
  const grouped={}
  rows.filter(r=>['pending','assigned','out_for_delivery','rescheduled'].includes(r.status)).forEach(r=>{
    const c=r.customers||{}; const b=c.neighborhood||'Sin barrio'; const s=c.street||'Sin calle';
    grouped[b]??={}; grouped[b][s]??=[]; grouped[b][s].push(r)
  })
  const html=Object.entries(grouped).map(([b,streets])=>`<div class="card group"><h3>📍 ${b}</h3>${Object.entries(streets).sort((a,b)=>b[1].length-a[1].length).map(([s,rs])=>`<div class="group"><div class="row"><b>${s}</b><span class="badge">${rs.length} entrega(s)</span></div>${rs.map(r=>{const c=r.customers||{};return `<div class="row"><span><b>${c.street_number||''}</b> · ${c.first_name||''} ${c.last_name||''}<br><small>${c.phone||''}</small>${r.important_note?`<div class="alert warning">⚠️ ${r.important_note}</div>`:''}</span><button class="btn primary" data-delivery="${r.id}">Abrir</button></div>`}).join('')}</div>`).join('')}</div>`).join('')
  layout(`<h2>🚚 Ruta del día</h2><div class="alert warning"><b>⚠️ ATENCIÓN HOY</b><br>Las restricciones horarias y observaciones importantes aparecen destacadas.</div>${html||'<div class="card"><p class="muted">No hay entregas pendientes.</p></div>'}`)
  document.querySelectorAll('[data-delivery]').forEach(b=>b.onclick=()=>openDelivery(b.dataset.delivery))
}

async function openDelivery(id){
  const {data:r,error}=await supabase.from('orders').select('id,status,important_note,customers(id,first_name,last_name,phone,street,street_number,neighborhood)').eq('id',id).single()
  if(error||!r)return alert('No se pudo cargar el pedido')
  const c=r.customers||{}
  layout(`<h2>Detalle de entrega</h2>${r.important_note?`<div class="alert warning"><b>⚠️ OBSERVACIÓN IMPORTANTE</b><br>${r.important_note}</div>`:''}<div class="grid two"><div class="card"><h3>${c.street||''} ${c.street_number||''}</h3><p>${c.first_name||''} ${c.last_name||''}</p><p>📞 ${c.phone||'-'}</p><button class="btn ghost" onclick="window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('${(c.street||'')+' '+(c.street_number||'')+' '+(c.neighborhood||'')}'),'_blank')">📍 Google Maps</button></div><div class="card"><h3>Confirmar entrega</h3><div class="field"><label>DNI de quien recibe</label><input id="dni" autocomplete="off" /></div><button class="btn primary" id="validate">Validar DNI</button><div id="validation" style="margin-top:12px"></div><button class="btn primary" id="confirm" style="width:100%;margin-top:12px" disabled>✅ Confirmar entrega</button><button class="btn ghost" id="failed" style="width:100%;margin-top:8px">❌ No pude entregar</button></div></div>`)
  let receiverId=null
  document.querySelector('#validate').onclick=async()=>{
    const dni=document.querySelector('#dni').value.trim()
    const {data,error}=await supabase.rpc('validate_delivery_receiver',{p_order_id:id,p_dni:dni})
    const out=document.querySelector('#validation')
    if(error||!data?.valid){out.innerHTML='<div class="alert danger">❌ DNI no autorizado.</div>';return}
    receiverId=data.receiver_id; out.innerHTML=`<div class="alert info">✅ Identidad validada: <b>${data.receiver_name}</b></div>`; document.querySelector('#confirm').disabled=false
  }
  document.querySelector('#confirm').onclick=async()=>{
    const {error}=await supabase.rpc('confirm_delivery',{p_order_id:id,p_receiver_id:receiverId})
    if(error)return alert(error.message)
    alert('Entrega confirmada'); current='repartidor'; render()
  }
  document.querySelector('#failed').onclick=async()=>{
    const reason=prompt('Motivo: ausente / no responde / DNI no autorizado / dirección incorrecta / otro')
    if(!reason)return
    const {error}=await supabase.from('delivery_attempts').insert({order_id:id,status:'failed',failure_reason:reason})
    if(error)return alert(error.message)
    await supabase.from('orders').update({status:'incident'}).eq('id',id)
    alert('Incidencia registrada'); current='repartidor'; render()
  }
}

async function admin(){
  const [orders,customers,subs,staff]=await Promise.all([q('orders','id,status'),q('customers','id'),q('subscriptions','id,payment_status,created_at,customers(first_name,last_name)'),q('staff_roles','user_id,role,full_name,created_at')])
  const productos = await q('products','id,name,unit_label,category,current_qty,active')
  const { data: movimientosRaw } = await supabase.from('stock_movements').select('id,product_id,type,quantity,note,created_by,created_at').order('created_at',{ascending:false}).limit(20)
  const movimientos = movimientosRaw || []
  const staffMap = Object.fromEntries(staff.map(s=>[s.user_id, s.full_name||'(sin nombre)']))
  const productMap = Object.fromEntries(productos.map(p=>[p.id, p]))
  const CATEGORIAS = [{value:'alimento',label:'Alimento'},{value:'sanidad',label:'Sanidad'},{value:'limpieza',label:'Limpieza'},{value:'otro',label:'Otro'}]
  const CATLABEL = {alimento:'Alimento',sanidad:'Sanidad',limpieza:'Limpieza',otro:'Otro'}
  const count=s=>orders.filter(x=>x.status===s).length
  const pendientesDePago = subs.filter(s=>s.payment_status==='pending')
  const rolLabel = {admin:'Administrador',campo:'Personal de campo',repartidor:'Repartidor'}
  layout(`<h2>Panel de administración</h2><div class="grid stats"><div class="card stat">Clientes<b>${customers.length}</b></div><div class="card stat">Pendientes<b>${count('pending')+count('assigned')+count('out_for_delivery')}</b></div><div class="card stat">Entregados<b>${count('delivered')}</b></div><div class="card stat">Incidencias<b>${count('incident')}</b></div><div class="card stat">Reprogramados<b>${count('rescheduled')}</b></div></div>
  <div class="card"><h3>🆕 Suscripciones nuevas (pago pendiente)</h3>${pendientesDePago.length?pendientesDePago.map(s=>{const c=s.customers||{};return `<div class="row"><span>${c.first_name||''} ${c.last_name||''}</span><span class="badge">🟡 Pendiente</span></div>`}).join(''):'<p class="muted">No hay suscripciones pendientes de confirmar pago.</p>'}</div>
  <div class="card"><h3>👥 Gestión de personal</h3>
    <div class="grid two">
      <div class="field"><label>Nombre</label><input id="staff_new_name"/></div>
      <div class="field"><label>Rol</label><select id="staff_new_role"><option value="campo">Personal de campo</option><option value="repartidor">Repartidor</option><option value="admin">Administrador</option></select></div>
    </div>
    <div class="field"><label>Código de acceso (opcional — si lo dejás vacío, se genera uno automático)</label><input id="staff_new_code" placeholder="Ej: 123 (mín. 3 caracteres, letras o números)"/></div>
    <button class="btn primary" id="btn_crear_staff">➕ Generar código de acceso</button>
    <div id="codigo_generado" style="margin-top:10px"></div>
    <div style="margin-top:16px">${staff.length?staff.map(s=>{
      const esVos = session && s.user_id === session.user.id
      return `<div class="row"><span>${s.full_name||'(sin nombre)'} <span class="badge">${rolLabel[s.role]||s.role}</span>${esVos?' <span class="badge" style="background:var(--accent)">Vos</span>':''}</span><span>${esVos?'<span class="muted" style="font-size:12px">Para cambiar tu propio código, cerrá sesión y usá "Acceso del equipo" con tu código actual</span>':`<button class="btn ghost" data-reset="${s.user_id}">🔄 Nuevo código</button> <button class="btn ghost" data-revoke="${s.user_id}">❌ Revocar</button>`}</span></div>`
    }).join(''):'<p class="muted">Todavía no agregaste personal.</p>'}</div>
  </div>
  <div class="card"><h3>🧺 Compras e insumos</h3>
    <div class="grid two">
      <div class="field"><label>Producto</label><input id="prod_new_name" placeholder="Ej: Maíz"/></div>
      <div class="field"><label>Unidad de compra</label><input id="prod_new_unit" placeholder="Ej: saco de 25kg"/></div>
    </div>
    <div class="field"><label>Categoría</label><select id="prod_new_cat">${CATEGORIAS.map(c=>`<option value="${c.value}">${c.label}</option>`).join('')}</select></div>
    <button class="btn primary" id="btn_crear_producto">➕ Agregar producto</button>
    <div id="err_producto" class="alert danger" style="display:none"></div>
    <div style="margin-top:16px">
      ${productos.length? productos.map(p=>`<div class="row"><span><b>${p.name}</b> <span class="badge">${CATLABEL[p.category]||p.category}</span><br><small>${p.current_qty} × ${p.unit_label}${!p.active?' · inactivo':''}</small></span><span style="display:flex;gap:6px;align-items:center"><input type="number" min="0" step="1" placeholder="Cant." id="compra_qty_${p.id}" style="width:70px"/><button class="btn ghost" data-comprar="${p.id}">+ Compra</button></span></div>`).join('') : '<p class="muted">Todavía no cargaste productos.</p>'}
    </div>
    <div style="margin-top:16px"><h3 style="font-size:15px">Últimos movimientos</h3>
      ${movimientos.length? movimientos.map(m=>{
        const prod = productMap[m.product_id]
        const quien = m.created_by ? (staffMap[m.created_by]||'Equipo') : 'Admin'
        const tipoLabel = m.type==='compra'?'🟢 Compra':m.type==='consumo'?'🔴 Consumo':'🔵 Ajuste'
        const fecha = new Date(m.created_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
        return `<div class="row"><span>${tipoLabel} · ${prod?prod.name:'(producto eliminado)'}<br><small>${quien} · ${fecha}${m.note?' · '+m.note:''}</small></span><span>${m.quantity} ${prod?prod.unit_label:''}</span></div>`
      }).join('') : '<p class="muted">Sin movimientos todavía.</p>'}
    </div>
  </div>`)

  document.querySelector('#btn_crear_staff').onclick = async ()=>{
    const full_name = document.querySelector('#staff_new_name').value.trim()
    const role = document.querySelector('#staff_new_role').value
    const custom_code = document.querySelector('#staff_new_code').value.trim()
    const box = document.querySelector('#codigo_generado')
    box.innerHTML = '<p class="muted">Generando…</p>'
    const { data, error } = await supabase.functions.invoke('manage-staff', { body: { action:'create', full_name, role, custom_code } })
    if(error){ box.innerHTML = `<div class="alert danger">No se pudo generar: ${error.message}</div>`; return }
    box.innerHTML = `<div class="alert info"><b>✅ Código generado para ${full_name||'este usuario'}:</b><br><span style="font-size:20px;font-weight:bold;letter-spacing:2px">${data.code}</span><br><small>Copialo ahora — no se vuelve a mostrar. Pasáselo a la persona para que entre por "Acceso del equipo".</small></div>`
    render()
  }
  document.querySelectorAll('[data-revoke]').forEach(b=>b.onclick=async()=>{
    if(!confirm('¿Revocar el acceso de esta persona? No va a poder entrar más con su código actual.'))return
    const { error } = await supabase.functions.invoke('manage-staff', { body: { action:'revoke', user_id:b.dataset.revoke } })
    if(error){ alert('Error: '+error.message); return }
    render()
  })
  document.querySelectorAll('[data-reset]').forEach(b=>b.onclick=async()=>{
    const custom_code = prompt('Escribí el nuevo código para esta persona (o dejalo vacío para generar uno automático):') || ''
    const { data, error } = await supabase.functions.invoke('manage-staff', { body: { action:'reset', user_id:b.dataset.reset, custom_code } })
    if(error){ alert('Error: '+error.message); return }
    alert('Nuevo código: '+data.code+'\n\nCopialo ahora, no se vuelve a mostrar.')
  })
  document.querySelector('#btn_crear_producto').onclick = async ()=>{
    const name = document.querySelector('#prod_new_name').value.trim()
    const unit_label = document.querySelector('#prod_new_unit').value.trim()
    const category = document.querySelector('#prod_new_cat').value
    const box = document.querySelector('#err_producto')
    if(!name || !unit_label){ box.textContent='Completá nombre y unidad de compra.'; box.style.display='block'; return }
    const { error } = await supabase.from('products').insert({ name, unit_label, category })
    if(error){ box.textContent='No se pudo guardar: '+error.message; box.style.display='block'; return }
    render()
  }
  document.querySelectorAll('[data-comprar]').forEach(b=>b.onclick=async()=>{
    const id = b.dataset.comprar
    const qtyInput = document.querySelector(`#compra_qty_${id}`)
    const qty = Number(qtyInput.value)
    if(!qty || qty<=0){ alert('Ingresá una cantidad válida.'); return }
    const { error } = await supabase.from('stock_movements').insert({ product_id:id, type:'compra', quantity:qty, created_by: session?.user?.id || null })
    if(error){ alert('Error: '+error.message); return }
    render()
  })
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
  if(current==='campo')return campo();
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
