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
  cliente: { first_name:'', last_name:'', dni:'', phone:'', email:'', street:'', street_number:'', street_type:'calle', neighborhood:'', city:'Rosario', province:'Santa Fe', country:'Argentina', postal_code:'', zone:'', logistics_note:'', referral_code:'' },
  plan: { carrito: {}, frequency: 'weekly', payment_method: 'cash', preferred_weekday: null },
  tieneReferencia: false,
  referencia: { full_name:'', phone:'', dni:'', relationship:'' },
  enviando: false,
  error: '',
  exito: false,
  exitoData: null,
  localidades: [],
  localidadesLoading: false,
  localidadesError: false,
  disponibilidad: null,
  disponibilidadLoading: false,
  alternativas: null
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
  if(!c.city || !c.city.trim()) return 'Elegí o escribí tu localidad.'
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
const DIAS_SEMANA = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' }
]

const PROVINCIAS = [
  'Buenos Aires','Catamarca','Chaco','Chubut','Ciudad Autónoma de Buenos Aires','Córdoba','Corrientes',
  'Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta',
  'San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego, Antártida e Islas del Atlántico Sur','Tucumán'
]

async function cargarLocalidades(provincia){
  state.localidadesLoading = true; state.localidades = []; state.localidadesError = false; render()
  try{
    const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(provincia)}&campos=nombre&max=5000`
    const controller = new AbortController()
    const timeoutId = setTimeout(()=>controller.abort(), 8000)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    const data = await res.json()
    const nombres = [...new Set((data.localidades||[]).map(l=>l.nombre))].sort((a,b)=>a.localeCompare(b,'es'))
    state.localidades = nombres
    if(!nombres.length) state.localidadesError = true
    else {
      // La API devuelve los nombres en MAYÚSCULAS; si ya había una ciudad precargada (ej. "Rosario"), la hacemos coincidir
      const match = nombres.find(n=>n.toLowerCase()===state.cliente.city.toLowerCase())
      if(match) state.cliente.city = match
    }
  }catch(e){
    state.localidades = []
    state.localidadesError = true
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
      <div class="field"><label>Nombre de la calle *</label><input id="f_street" value="${c.street}" placeholder="Ej: Larrea (sin el número)"/></div>
      <div class="field"><label>Altura/número *</label><input id="f_street_number" value="${c.street_number}" placeholder="Ej: 375"/></div>
    </div>
    <div id="aviso_numero_en_calle"></div>
    <div class="grid two">
      <div class="field"><label>Provincia *</label><select id="f_province">
        <option value="">Seleccioná tu provincia</option>
        ${PROVINCIAS.map(p=>`<option value="${p}" ${c.province===p?'selected':''}>${p}</option>`).join('')}
      </select></div>
      <div class="field"><label>Localidad *</label>
      ${state.localidadesError && !state.localidadesLoading ? `
        <input id="f_city_manual" value="${c.city||'Rosario'}" placeholder="Escribí tu localidad"/>
      ` : `
        <select id="f_city" ${!c.province || state.localidadesLoading ? 'disabled':''}>
          <option value="">${state.localidadesLoading?'Cargando localidades…':(c.province?'Seleccioná tu localidad':'Elegí primero la provincia')}</option>
          ${state.localidades.map(l=>`<option value="${l}" ${c.city===l?'selected':''}>${l}</option>`).join('')}
        </select>
      `}
      </div>
      <div class="field"><label>Código postal</label><input id="f_postal_code" value="${c.postal_code}"/></div>
    </div>
    <div class="field"><label>Zona *</label>
      <div class="grid two">${ZONAS.map(z=>`<button type="button" class="btn ${c.zone===z.value?'primary':'ghost'}" data-zone="${z.value}">${z.label}</button>`).join('')}</div>
    </div>
    <div class="field"><label>Observación para la entrega (opcional)</label><textarea id="f_note" rows="2" placeholder="Ej: portón negro, timbre 3B, entregar después de las 18hs">${c.logistics_note}</textarea></div>
    <div class="field"><label>¿Alguien te recomendó NÓMADES? Poné su código (opcional)</label><input id="f_referral" value="${c.referral_code}" placeholder="Ej: GAST042" style="text-transform:uppercase"/></div>
    <div id="err1" class="alert danger" style="display:none"></div>
    <button class="btn primary" id="next1" style="margin-top:10px">Siguiente →</button>
  </div>`
}

function disponibilidadHtml(){
  if(state.disponibilidadLoading) return `<div class="alert info">Consultando disponibilidad…</div>`
  if(!state.disponibilidad) return ''
  if(state.disponibilidad.available){
    const fecha = new Date(state.disponibilidad.next_date+'T00:00:00').toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'})
    return `<div class="alert info">✅ ¡Hay lugar! Tu primera entrega sería el <b>${fecha}</b>.</div>`
  }
  if(state.plan.preferred_weekday !== null && state.alternativas && state.alternativas.length){
    const diaElegidoLabel = DIAS_SEMANA.find(d=>d.value===state.plan.preferred_weekday)?.label || ''
    return `<div class="alert info">
      🔥 <b>${diaElegidoLabel} está muy pedido</b>, no queda lugar. Pero sí hay lugar estos otros días — elegí uno y arrancamos ahí:
      <div class="grid two" style="margin-top:10px">
        ${state.alternativas.map(a=>{
          const label = DIAS_SEMANA.find(d=>d.value===a.weekday)?.label || ''
          const fechaCorta = new Date(a.date+'T00:00:00').toLocaleDateString('es-AR',{day:'numeric',month:'short'})
          return `<button type="button" class="btn ghost" data-alt-dia="${a.weekday}">${label} <small>(${fechaCorta})</small></button>`
        }).join('')}
      </div>
      <p class="muted" style="margin-top:8px;margin-bottom:0">O si preferís, quedate en lista de espera para ${diaElegidoLabel.toLowerCase()} con 50% off en tu primera entrega.</p>
    </div>`
  }
  if(state.plan.preferred_weekday !== null && state.alternativas && state.alternativas.length===0){
    return `<div class="alert info">🔥 <b>¡Estamos a tope!</b> No hay lugar en ningún día por ahora para esa cantidad. Anotate en la lista de espera y asegurate tu lugar con <b>50% de descuento en tu primera entrega</b> apenas se libere un cupo.</div>`
  }
  return `<div class="alert info">🔥 <b>¡Somos muy pedidos esta semana!</b> Ya no quedan lugares para este plan, pero podés anotarte ahora mismo en la lista de espera y asegurarte tu lugar en orden de llegada. Como agradecimiento por tu paciencia, tu <b>primera entrega tiene 50% de descuento</b> apenas se libere un cupo. ¡No te quedes afuera, completá el formulario!</div>`
}

async function consultarDisponibilidad(){
  const total = totalCarrito()
  if(total<=0 || !state.plan.frequency) return
  state.disponibilidadLoading = true
  state.alternativas = null
  const box = document.querySelector('#disponibilidad_box')
  if(box) box.innerHTML = disponibilidadHtml()
  const { data, error } = await supabase.rpc('check_availability', { p_egg_quantity: total, p_frequency: state.plan.frequency, p_preferred_weekday: state.plan.preferred_weekday })
  state.disponibilidadLoading = false
  state.disponibilidad = (!error && data) ? data : null
  if(!state.disponibilidad?.available && state.plan.preferred_weekday !== null){
    const { data: alt } = await supabase.rpc('available_days_summary', { p_egg_quantity: total, p_frequency: state.plan.frequency })
    state.alternativas = (alt || []).filter(a=>a.weekday !== state.plan.preferred_weekday)
  }
  const box2 = document.querySelector('#disponibilidad_box')
  if(box2) box2.innerHTML = disponibilidadHtml()
  document.querySelectorAll('[data-alt-dia]').forEach(b=> b.onclick = ()=>{ state.plan.preferred_weekday = Number(b.dataset.altDia); state.disponibilidad=null; render(); consultarDisponibilidad() })
}

function totalCarrito(){
  return Object.entries(state.plan.carrito).reduce((sum,[eggQty,qty])=>sum + Number(eggQty)*qty, 0)
}
function precioCarrito(){
  return Object.entries(state.plan.carrito).reduce((sum,[eggQty,qty])=>{
    const plan = state.planes.find(p=>String(p.egg_quantity)===eggQty)
    return sum + (plan?Number(plan.price):0)*qty
  }, 0)
}
function carritoResumen(){
  return Object.entries(state.plan.carrito).filter(([,q])=>q>0).map(([eggQty,qty])=>`${qty}×${eggQty}`).join(' + ')
}

function paso2(){
  const p = state.plan
  const total = totalCarrito()
  return `
  <div class="card">
    <h2>2. Elegí tu plan</h2>
    <div class="field"><label>Elegí y combiná los tamaños que quieras (podés mezclar varios)</label>
      ${state.planes.map(pl=>`<div class="row"><span>Maple de ${pl.egg_quantity} huevos <small class="muted">$${Number(pl.price).toLocaleString('es-AR')} el maple ($${Math.round(pl.price/pl.egg_quantity).toLocaleString('es-AR')} por huevo)</small></span><span style="display:flex;align-items:center;gap:8px"><button type="button" class="btn ghost" data-carrito-menos="${pl.egg_quantity}" style="padding:6px 14px">−</button><b style="min-width:20px;text-align:center;display:inline-block">${p.carrito[pl.egg_quantity]||0}</b><button type="button" class="btn ghost" data-carrito-mas="${pl.egg_quantity}" style="padding:6px 14px">+</button></span></div>`).join('')}
    </div>
    <div class="alert info"><b>Total: ${total} huevos</b> ${carritoResumen()?`(${carritoResumen()})`:''} · $${precioCarrito().toLocaleString('es-AR')}</div>
    <div class="field" style="margin-top:10px"><label>Frecuencia de entrega</label>
      <div class="grid three">${FRECUENCIAS.map(fr=>`<button class="btn ${p.frequency===fr.value?'primary':'ghost'}" data-freq="${fr.value}">${fr.label}</button>`).join('')}</div>
    </div>
    <div class="field"><label>¿Cómo preferís pagar?</label>
      <div class="grid three">${METODOS_PAGO.map(m=>`<button class="btn ${p.payment_method===m.value?'primary':'ghost'}" data-pay="${m.value}">${m.label}</button>`).join('')}</div>
    </div>
    <div class="field"><label>¿Preferís algún día en particular para tu entrega? (opcional)</label>
      <div class="grid three">
        <button type="button" class="btn ${p.preferred_weekday===null?'primary':'ghost'}" data-dia="">Cualquiera (más rápido)</button>
        ${DIAS_SEMANA.map(d=>`<button type="button" class="btn ${p.preferred_weekday===d.value?'primary':'ghost'}" data-dia="${d.value}">${d.label}</button>`).join('')}
      </div>
    </div>
    <div id="disponibilidad_box">${disponibilidadHtml()}</div>
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
  const total = totalCarrito()
  const tipoViaLabel = TIPOS_VIA.find(t=>t.value===c.street_type)?.label || 'Calle'
  return `
  <div class="card">
    <h2>4. Confirmar suscripción</h2>
    <div class="row"><span>Cliente</span><span><b>${c.first_name} ${c.last_name}</b></span></div>
    <div class="row"><span>Dirección</span><span>${tipoViaLabel} ${c.street} ${c.street_number}</span></div>
    <div class="row"><span>Barrio</span><span>${c.neighborhood} (Zona ${c.zone?c.zone[0].toUpperCase()+c.zone.slice(1):'-'})</span></div>
    <div class="row"><span>Localidad</span><span>${c.city}, ${c.province}, Argentina</span></div>
    <div class="row"><span>Plan</span><span><b>${total} huevos</b> (${carritoResumen()}) · ${freqLabel}</span></div>
    <div class="row"><span>Precio</span><span><b>$${precioCarrito().toLocaleString('es-AR')}</b></span></div>
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
  const d = state.exitoData
  const total = totalCarrito()
  if(d && d.status === 'waitlist'){
    return `<div class="card"><h2>🔥 ¡Anotado en la lista!</h2><p>Sos muy pedido — por ahora no queda lugar para tu plan de <b>${total} huevos</b> (${FRECUENCIAS.find(f=>f.value===state.plan.frequency)?.label.toLowerCase()}), pero ya quedaste anotado en <b>lista de espera</b>, en orden de llegada.</p><p>Apenas se libere un cupo te contactamos, y tu <b>primera entrega va con 50% de descuento</b> como agradecimiento por tu paciencia.</p></div>`
  }
  const fecha = d?.next_delivery_date ? new Date(d.next_delivery_date+'T00:00:00').toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'}) : ''
  return `<div class="card"><h2>✅ ¡Listo!</h2><p>Registramos tu suscripción a <b>${total} huevos</b> (${carritoResumen()}) con entrega <b>${FRECUENCIAS.find(f=>f.value===state.plan.frequency)?.label.toLowerCase()}</b>.</p>${fecha?`<p>Tu primera entrega sería el <b>${fecha}</b>.</p>`:''}${d?.referral_applied?`<div class="alert info">🎁 ¡Usaste un código de recomendación! Tu primera entrega tiene <b>50% de descuento</b>.</div>`:''}${d?.referral_bloqueado?`<div class="alert info">Ese código de recomendación no está disponible en este momento, pero tu suscripción quedó registrada igual.</div>`:''}<p class="muted">Nos vamos a contactar por WhatsApp o email para coordinar el pago y confirmar la primera entrega.</p></div>
  <div class="card"><h3>📣 Recomendá NÓMADES</h3><p>Compartí tu código con amigos y familiares — cuando alguien se suscriba con él y reciba y pague su primera entrega, vos te ganás <b>$1.000 de descuento</b> en tu próximo pedido.</p><div class="alert info" style="text-align:center;font-size:22px;font-weight:bold;letter-spacing:2px">${d?.referral_code||''}</div></div>`
}

function render(){
  if(state.exito){ app.innerHTML = header() + exito() + '</div>'; return }
  const pasoHtml = state.step===1?paso1() : state.step===2?paso2() : state.step===3?paso3() : paso4()
  app.innerHTML = header() + pasos() + pasoHtml + '</div>'
  bind()
}

function bind(){
  if(state.step===1){
    const ids = ['first_name','last_name','dni','phone','email','neighborhood','street','street_number','postal_code']
    ids.forEach(id=>{
      const el = document.querySelector('#f_'+id)
      if(el) el.oninput = ()=> state.cliente[id] = el.value
    })
    const streetEl = document.querySelector('#f_street')
    if(streetEl) streetEl.onblur = ()=>{
      const avisoBox = document.querySelector('#aviso_numero_en_calle')
      if(!avisoBox) return
      const match = streetEl.value.trim().match(/^(.*\S)\s+(\d{1,5}(?:\s*bis)?)$/i)
      if(match && !state.cliente.street_number.trim()){
        avisoBox.innerHTML = `<div class="alert info" style="margin-bottom:10px">Parece que escribiste el número (<b>${match[2]}</b>) junto con el nombre de la calle. <button type="button" class="btn ghost" id="btn_mover_numero" style="margin-top:6px;padding:6px 12px;font-size:12px">Pasarlo a "Altura/número"</button></div>`
        document.querySelector('#btn_mover_numero').onclick = ()=>{
          state.cliente.street = match[1]
          state.cliente.street_number = match[2]
          render()
        }
      } else {
        avisoBox.innerHTML = ''
      }
    }
    const noteEl = document.querySelector('#f_note')
    if(noteEl) noteEl.oninput = ()=> state.cliente.logistics_note = noteEl.value
    const referralEl = document.querySelector('#f_referral')
    if(referralEl) referralEl.oninput = ()=> state.cliente.referral_code = referralEl.value.trim().toUpperCase()
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
    const cityManualEl = document.querySelector('#f_city_manual')
    if(cityManualEl) cityManualEl.oninput = ()=> state.cliente.city = cityManualEl.value
    document.querySelector('#next1').onclick = ()=>{
      const err = validarPaso1()
      const box = document.querySelector('#err1')
      if(err){ box.textContent = err; box.style.display='block'; return }
      state.step = 2; render()
    }
  }
  if(state.step===2){
    if(!state.disponibilidad && !state.disponibilidadLoading && totalCarrito()>0) consultarDisponibilidad()
    document.querySelectorAll('[data-carrito-mas]').forEach(b=> b.onclick = ()=>{ const k=b.dataset.carritoMas; state.plan.carrito[k]=(state.plan.carrito[k]||0)+1; state.disponibilidad=null; render(); consultarDisponibilidad() })
    document.querySelectorAll('[data-carrito-menos]').forEach(b=> b.onclick = ()=>{ const k=b.dataset.carritoMenos; if(state.plan.carrito[k]>0) state.plan.carrito[k]--; state.disponibilidad=null; render(); consultarDisponibilidad() })
    document.querySelectorAll('[data-freq]').forEach(b=> b.onclick = ()=>{ state.plan.frequency = b.dataset.freq; render() })
    document.querySelectorAll('[data-pay]').forEach(b=> b.onclick = ()=>{ state.plan.payment_method = b.dataset.pay; render() })
    document.querySelectorAll('[data-dia]').forEach(b=> b.onclick = ()=>{ state.plan.preferred_weekday = b.dataset.dia ? Number(b.dataset.dia) : null; state.disponibilidad=null; render(); consultarDisponibilidad() })
    document.querySelector('#back2').onclick = ()=>{ state.step=1; render() }
    document.querySelector('#next2').onclick = ()=>{
      const box = document.querySelector('#err2')
      if(totalCarrito()<=0){ box.textContent='Elegí al menos un maple.'; box.style.display='block'; return }
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
      neighborhood: c.neighborhood.trim(), city: (c.city||'').trim(),
      province: c.province, country: 'Argentina', postal_code: c.postal_code.trim() || '',
      zone: c.zone || '',
      logistics_note: c.logistics_note.trim() || '',
      referral_code: (c.referral_code||'').trim().toUpperCase() || ''
    }
    let receiverPayload = null
    if(state.tieneReferencia){
      const r = state.referencia
      receiverPayload = { full_name: r.full_name.trim(), dni: r.dni.trim(), phone: r.phone.trim() || '', relationship: r.relationship.trim() || '' }
    }
    const total = totalCarrito()
    const breakdown = Object.entries(state.plan.carrito).filter(([,q])=>q>0).map(([size,qty])=>({size:Number(size),qty}))
    const subscriptionPayload = { frequency: state.plan.frequency, egg_quantity: total, payment_method: state.plan.payment_method, preferred_weekday: state.plan.preferred_weekday, plan_breakdown: breakdown, price: precioCarrito() }

    const { data, error } = await supabase.rpc('public_signup', {
      p_customer: customerPayload, p_receiver: receiverPayload, p_subscription: subscriptionPayload
    })
    if(error) throw error

    state.exitoData = data
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
  render()
  if(state.cliente.province) cargarLocalidades(state.cliente.province)
}
init()
