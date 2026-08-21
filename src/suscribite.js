import { supabase } from './services/supabase.js'

const app = document.querySelector('#app')
const FRECUENCIAS = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' }
]
const METODOS_PAGO = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'mp', label: 'Mercado Pago' }
]

const state = {
  step: 1,
  planes: [],
  cliente: { first_name:'', last_name:'', dni:'', phone:'', email:'', street:'', street_number:'', street_type:'calle', neighborhood:'', city:'', province:'', country:'Argentina', zone:'', logistics_note:'' },
  plan: { eggs: null, frequency: 'weekly', payment_method: 'cash' },
  tieneReferencia: false,
  referencia: { full_name:'', phone:'', dni:'', relationship:'' },
  enviando: false,
  error: '',
  exito: false,
  localidades: [],
  localidadesLoading: false
}

function header(){
  return `<div class="shell"><img src="./img/logo.jpg" alt="Granja Nómades" style="width:100%;border-radius:12px;margin-bottom:12px;display:block"/><div class="top"><div class="brand" style="font-size:14px">Suscribite a huevos de libre pastoreo</div></div>`
}

function pasos(){
  const nombres = ['Tus datos','Elegí tu plan','Persona de referencia','Confirmar']
  return `<div class="row" style="border:0;padding:0 0 18px 0">${nombres.map((n,i)=>`<span class="badge" style="${state.step===i+1?'background:#173f22;color:#fff':''}">${i+1}. ${n}</span>`).join(' ')}</div>`
}

function validarPaso1(){
  const c = state.cliente
  if(!c.first_name.trim()) return 'Falta el nombre.'
  if(!c.last_name.trim()) return 'Falta el apellido.'
  if(!/^\d{7,8}$/.test(c.dni.trim())) return 'El DNI debe tener 7 u 8 números, sin puntos.'
  if(!c.phone.trim()) return 'Falta el teléfono.'
  if(c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) return 'El email no parece válido.'
  if(!c.street.trim()) return 'Falta el nombre de la calle.'
  if(!c.street_number.trim()) return 'Falta la altura/número.'
  if(!c.neighborhood.trim()) return 'Falta el barrio.'
  if(!c.province) return 'Elegí tu provincia.'
  if(!c.city) return 'Elegí tu localidad.'
  if(!c.zone) return 'Elegí tu zona (Norte, Sur, Este u Oeste).'
  return ''
}

function validarPaso3(){
  if(!state.tieneReferencia) return ''
  const r = state.referencia
  if(!r.full_name.trim()) return 'Falta el nombre de la persona de referencia.'
  if(!/^\d{7,8}$/.test(r.dni.trim())) return 'El DNI de la persona de referencia debe tener 7 u 8 números.'
  if(!r.phone.trim()) return 'Falta el teléfono de la persona de referencia.'
  return ''
}

const ZONAS = [
  { value: 'norte', label: 'Norte' },
  { value: 'sur', label: 'Sur' },
  { value: 'este', label: 'Este' },
  { value: 'oeste', label: 'Oeste' }
]
const TIPOS_VIA = [
  { value: 'calle', label: 'Calle' },
  { value: 'avenida', label: 'Avenida' },
  { value: 'pasaje', label: 'Pasaje' }
]

const PROVINCIAS = [
  'Buenos Aires','Catamarca','Chaco','Chubut','Ciudad Autónoma de Buenos Aires','Córdoba','Corrientes',
  'Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta',
  'San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego, Antártida e Islas del Atlántico Sur','Tucumán'
]

async function cargarLocalidades(provincia){
  state.localidadesLoading = true; state.localidades = []; render()
  try{
    const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(provincia)}&campos=nombre&max=5000`
    const res = await fetch(url)
    const data = await res.json()
    const nombres = [...new Set((data.localidades||[]).map(l=>l.nombre))].sort((a,b)=>a.localeCompare(b,'es'))
    state.localidades = nombres
  }catch(e){
    state.localidades = []
  }
  state.localidadesLoading = false; render()
}

function paso1(){
  const c = state.cliente
  return `
  <div class="card">
    <h2>1. Tus datos</h2>
    <div class="grid two">
      <div class="field"><label>Nombre *</label><input id="f_first_name" value="${c.first_name}"/></div>
      <div class="field"><label>Apellido *</label><input id="f_last_name" value="${c.last_name}"/></div>
      <div class="field"><label>DNI *</label><input id="f_dni" inputmode="numeric" placeholder="Sin puntos" value="${c.dni}"/></div>
      <div class="field"><label>Teléfono / WhatsApp *</label><input id="f_phone" inputmode="tel" value="${c.phone}"/></div>
      <div class="field"><label>Email</label><input id="f_email" type="email" value="${c.email}"/></div>
      <div class="field"><label>Barrio *</label><input id="f_neighborhood" value="${c.neighborhood}"/></div>
    </div>
    <div class="field"><label>Tipo de vía *</label>
      <div class="grid three">${TIPOS_VIA.map(t=>`<button type="button" class="btn ${c.street_type===t.value?'primary':'ghost'}" data-street-type="${t.value}">${t.label}</button>`).join('')}</div>
    </div>
    <div class="grid two">
      <div class="field"><label>Nombre de la calle *</label><input id="f_street" value="${c.street}"/></div>
      <div class="field"><label>Altura/número *</label><input id="f_street_number" value="${c.street_number}"/></div>
    </div>
    <div class="grid two">
      <div class="field"><label>Provincia *</label><select id="f_province">
        <option value="">Seleccioná tu provincia</option>
        ${PROVINCIAS.map(p=>`<option value="${p}" ${c.province===p?'selected':''}>${p}</option>`).join('')}
      </select></div>
      <div class="field"><label>Localidad *</label><select id="f_city" ${!c.province || state.localidadesLoading ? 'disabled':''}>
        <option value="">${state.localidadesLoading?'Cargando localidades…':(c.province?'Seleccioná tu localidad':'Elegí primero la provincia')}</option>
        ${state.localidades.map(l=>`<option value="${l}" ${c.city===l?'selected':''}>${l}</option>`).join('')}
      </select></div>
    </div>
    <div class="field"><label>Zona *</label>
      <div class="grid two">${ZONAS.map(z=>`<button type="button" class="btn ${c.zone===z.value?'primary':'ghost'}" data-zone="${z.value}">${z.label}</button>`).join('')}</div>
    </div>
    <div class="field"><label>Observación para la entrega (opcional)</label><textarea id="f_note" rows="2" placeholder="Ej: portón negro, timbre 3B, entregar después de las 18hs">${c.logistics_note}</textarea></div>
    <div id="err1" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="next1" style="margin-top:10px">Siguiente →</button>
  </div>`
}

function paso2(){
  const p = state.plan
  return `
  <div class="card">
    <h2>2. Elegí tu plan</h2>
    <div class="field"><label>Cantidad de huevos</label>
      <div class="grid two">${state.planes.map(pl=>`<button class="btn ${p.eggs===pl.egg_quantity?'primary':'ghost'}" data-eggs="${pl.egg_quantity}">${pl.egg_quantity} huevos<br><small>$${Number(pl.price).toLocaleString('es-AR')}</small></button>`).join('')}</div>
    </div>
    <div class="field"><label>Frecuencia de entrega</label>
      <div class="grid three">${FRECUENCIAS.map(fr=>`<button class="btn ${p.frequency===fr.value?'primary':'ghost'}" data-freq="${fr.value}">${fr.label}</button>`).join('')}</div>
    </div>
    <div class="field"><label>¿Cómo preferís pagar?</label>
      <div class="grid three">${METODOS_PAGO.map(m=>`<button class="btn ${p.payment_method===m.value?'primary':'ghost'}" data-pay="${m.value}">${m.label}</button>`).join('')}</div>
    </div>
    <div id="err2" class="alert danger" style="display:none"></div>
    <div class="row" style="border:0">
      <button class="btn ghost" id="back2">← Atrás</button>
      <button class="btn primary" id="next2">Siguiente →</button>
    </div>
  </div>`
}

function paso3(){
  const r = state.referencia
  return `
  <div class="card">
    <h2>3. Persona de referencia</h2>
    <p class="muted">Si no estás en casa cuando llega el pedido, ¿alguien más lo puede recibir? Es opcional.</p>
    <div class="field"><label><input type="checkbox" id="f_tiene_ref" ${state.tieneReferencia?'checked':''}/> Sí, quiero agregar una persona de referencia</label></div>
    ${state.tieneReferencia?`
    <div class="grid two">
      <div class="field"><label>Nombre completo *</label><input id="r_name" value="${r.full_name}"/></div>
      <div class="field"><label>DNI *</label><input id="r_dni" inputmode="numeric" placeholder="Sin puntos" value="${r.dni}"/></div>
      <div class="field"><label>Teléfono *</label><input id="r_phone" inputmode="tel" value="${r.phone}"/></div>
      <div class="field"><label>Relación (vecino, familiar, etc.)</label><input id="r_relationship" value="${r.relationship}"/></div>
    </div>`:''}
    <div id="err3" class="alert danger" style="display:none"></div>
    <div class="row" style="border:0">
      <button class="btn ghost" id="back3">← Atrás</button>
      <button class="btn primary" id="next3">Siguiente →</button>
    </div>
  </div>`
}

function paso4(){
  const c = state.cliente, p = state.plan, r = state.referencia
  const freqLabel = FRECUENCIAS.find(f=>f.value===p.frequency)?.label || p.frequency
  const payLabel = METODOS_PAGO.find(m=>m.value===p.payment_method)?.label || p.payment_method
  const planInfo = state.planes.find(pl=>pl.egg_quantity===p.eggs)
  const tipoViaLabel = TIPOS_VIA.find(t=>t.value===c.street_type)?.label || 'Calle'
  return `
  <div class="card">
    <h2>4. Confirmar suscripción</h2>
    <div class="row"><span>Cliente</span><span><b>${c.first_name} ${c.last_name}</b></span></div>
    <div class="row"><span>Dirección</span><span>${tipoViaLabel} ${c.street} ${c.street_number}</span></div>
    <div class="row"><span>Barrio</span><span>${c.neighborhood} (Zona ${c.zone?c.zone[0].toUpperCase()+c.zone.slice(1):'-'})</span></div>
    <div class="row"><span>Localidad</span><span>${c.city}, ${c.province}, Argentina</span></div>
    <div class="row"><span>Plan</span><span><b>${p.eggs} huevos</b> · ${freqLabel}</span></div>
    <div class="row"><span>Precio</span><span><b>$${planInfo?Number(planInfo.price).toLocaleString('es-AR'):'-'}</b></span></div>
    <div class="row"><span>Forma de pago</span><span>${payLabel}</span></div>
    <div class="row"><span>Persona de referencia</span><span>${state.tieneReferencia? (r.full_name+' ('+r.relationship+')') : 'No agregada'}</span></div>
    ${state.error?`<div class="alert danger">${state.error}</div>`:''}
    <div class="alert info">Al confirmar, tu solicitud queda registrada. Te contactamos para coordinar el pago y la primera entrega.</div>
    <div class="row" style="border:0">
      <button class="btn ghost" id="back4" ${state.enviando?'disabled':''}>← Atrás</button>
      <button class="btn primary" id="confirmar" ${state.enviando?'disabled':''}>${state.enviando?'Enviando…':'Confirmar suscripción'}</button>
    </div>
  </div>`
}

function exito(){
  return `<div class="card"><h2>✅ ¡Listo!</h2><p>Registramos tu suscripción a <b>${state.plan.eggs} huevos</b> con entrega <b>${FRECUENCIAS.find(f=>f.value===state.plan.frequency)?.label.toLowerCase()}</b>.</p><p class="muted">Nos vamos a contactar por WhatsApp o email para coordinar el pago y confirmar la primera entrega.</p></div>`
}

function render(){
  if(state.exito){ app.innerHTML = header() + exito() + '</div>'; return }
  const pasoHtml = state.step===1?paso1() : state.step===2?paso2() : state.step===3?paso3() : paso4()
  app.innerHTML = header() + pasos() + pasoHtml + '</div>'
  bind()
}

function bind(){
  if(state.step===1){
    const ids = ['first_name','last_name','dni','phone','email','neighborhood','street','street_number']
    ids.forEach(id=>{
      const el = document.querySelector('#f_'+id)
      if(el) el.oninput = ()=> state.cliente[id] = el.value
    })
    const noteEl = document.querySelector('#f_note')
    if(noteEl) noteEl.oninput = ()=> state.cliente.logistics_note = noteEl.value
    document.querySelectorAll('[data-zone]').forEach(b=> b.onclick = ()=>{ state.cliente.zone = b.dataset.zone; render() })
    document.querySelectorAll('[data-street-type]').forEach(b=> b.onclick = ()=>{ state.cliente.street_type = b.dataset.streetType; render() })
    const provinceEl = document.querySelector('#f_province')
    if(provinceEl) provinceEl.onchange = ()=>{
      state.cliente.province = provinceEl.value
      state.cliente.city = ''
      if(provinceEl.value) cargarLocalidades(provinceEl.value)
      else { state.localidades = []; render() }
    }
    const cityEl = document.querySelector('#f_city')
    if(cityEl) cityEl.onchange = ()=> state.cliente.city = cityEl.value
    document.querySelector('#next1').onclick = ()=>{
      const err = validarPaso1()
      const box = document.querySelector('#err1')
      if(err){ box.textContent = err; box.style.display='block'; return }
      state.step = 2; render()
    }
  }
  if(state.step===2){
    document.querySelectorAll('[data-eggs]').forEach(b=> b.onclick = ()=>{ state.plan.eggs = Number(b.dataset.eggs); render() })
    document.querySelectorAll('[data-freq]').forEach(b=> b.onclick = ()=>{ state.plan.frequency = b.dataset.freq; render() })
    document.querySelectorAll('[data-pay]').forEach(b=> b.onclick = ()=>{ state.plan.payment_method = b.dataset.pay; render() })
    document.querySelector('#back2').onclick = ()=>{ state.step=1; render() }
    document.querySelector('#next2').onclick = ()=>{
      const box = document.querySelector('#err2')
      if(!state.plan.eggs){ box.textContent='Elegí una cantidad de huevos.'; box.style.display='block'; return }
      state.step=3; render()
    }
  }
  if(state.step===3){
    document.querySelector('#f_tiene_ref').onchange = (e)=>{ state.tieneReferencia = e.target.checked; render() }
    if(state.tieneReferencia){
      const map = { r_name:'full_name', r_dni:'dni', r_phone:'phone', r_relationship:'relationship' }
      Object.entries(map).forEach(([id,key])=>{
        const el = document.querySelector('#'+id)
        if(el) el.oninput = ()=> state.referencia[key] = el.value
      })
    }
    document.querySelector('#back3').onclick = ()=>{ state.step=2; render() }
    document.querySelector('#next3').onclick = ()=>{
      const err = validarPaso3()
      const box = document.querySelector('#err3')
      if(err){ box.textContent = err; box.style.display='block'; return }
      state.step = 4; render()
    }
  }
  if(state.step===4){
    document.querySelector('#back4').onclick = ()=>{ state.step=3; render() }
    document.querySelector('#confirmar').onclick = enviar
  }
}

async function enviar(){
  state.enviando = true; state.error=''; render()
  try{
    const c = state.cliente
    const customerPayload = {
      first_name: c.first_name.trim(), last_name: c.last_name.trim(), dni: c.dni.trim(),
      phone: c.phone.trim(), email: c.email.trim() || '',
      street: c.street.trim(), street_number: c.street_number.trim(), street_type: c.street_type || 'calle',
      neighborhood: c.neighborhood.trim(), city: c.city,
      province: c.province, country: 'Argentina',
      zone: c.zone || '',
      logistics_note: c.logistics_note.trim() || ''
    }
    let receiverPayload = null
    if(state.tieneReferencia){
      const r = state.referencia
      receiverPayload = { full_name: r.full_name.trim(), dni: r.dni.trim(), phone: r.phone.trim() || '', relationship: r.relationship.trim() || '' }
    }
    const subscriptionPayload = { frequency: state.plan.frequency, egg_quantity: state.plan.eggs, payment_method: state.plan.payment_method }

    const { error } = await supabase.rpc('public_signup', {
      p_customer: customerPayload, p_receiver: receiverPayload, p_subscription: subscriptionPayload
    })
    if(error) throw error

    state.exito = true; state.enviando = false; render()
  }catch(e){
    state.enviando = false
    state.error = 'No pudimos registrar tu suscripción. ' + (e?.message || 'Intentá de nuevo en unos minutos.')
    render()
  }
}

async function init(){
  const { data, error } = await supabase.from('plan_prices').select('egg_quantity,price').eq('active', true).order('egg_quantity')
  state.planes = (!error && data && data.length) ? data : [{egg_quantity:15,price:7000},{egg_quantity:30,price:12000}]
  state.plan.eggs = state.planes[0]?.egg_quantity || null
  render()
}
init()
