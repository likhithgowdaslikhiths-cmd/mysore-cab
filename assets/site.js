import { createAnalytics } from './analytics.js';
import { indiaNow, timingErrors, prepareMessage, whatsappUrl } from './trip.js';

const config = JSON.parse(document.getElementById('site-config').textContent);
const analytics = createAnalytics(config.analytics);
document.documentElement.classList.add('js');

const consent = document.getElementById('consent');
if (consent) {
  const key = 'mysore-cabs-analytics-v1';
  let choice;
  try { choice = localStorage.getItem(key); } catch {}
  if (choice === 'granted') analytics.allow();
  consent.hidden = choice === 'granted' || choice === 'denied';
  document.getElementById('preferences').addEventListener('click',()=>{
    consent.hidden = false;
    consent.querySelector('button').focus();
  });
  consent.addEventListener('click',event=>{
    const button = event.target.closest('[data-consent]');
    if (!button) return;
    const value = button.dataset.consent;
    try { localStorage.setItem(key,value); } catch {}
    consent.hidden = true;
    if (value === 'granted') analytics.allow();
    if (value === 'denied' && choice === 'granted') location.reload();
    choice = value;
  });
}

const menu = document.querySelector('.menu');
const nav = document.getElementById('navigation');
function toggleMenu(open) {
  menu.setAttribute('aria-expanded',String(open));
  nav.classList.toggle('open',open);
}
menu.addEventListener('click',()=>toggleMenu(menu.getAttribute('aria-expanded')==='false'));
nav.addEventListener('click',event=>{ if (event.target.closest('a')) toggleMenu(false); });
document.addEventListener('keydown',event=>{
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    toggleMenu(false);
    menu.focus();
  }
});

const dialog = document.getElementById('contact-dialog');
const messageArea = document.getElementById('message-area');
const messageBox = document.getElementById('prepared-message');
const handoff = document.getElementById('open-whatsapp');
const status = document.getElementById('copy-status');
let previousFocus;
let handoffData;
function showDialog(title,description,message='',parameters={}) {
  previousFocus = document.activeElement;
  document.getElementById('dialog-title').textContent = title;
  document.getElementById('dialog-description').textContent = description;
  messageBox.value = message;
  messageArea.hidden = !message;
  handoff.hidden = config.demoMode || !message;
  status.textContent = '';
  handoffData = parameters;
  if (!handoff.hidden) handoff.href = whatsappUrl(config.whatsapp,message);
  dialog.showModal();
}
dialog.addEventListener('close',()=>{
  handoff.removeAttribute('href');
  messageBox.value = '';
  previousFocus?.focus({preventScroll:true});
});
handoff.addEventListener('click',()=>analytics.track('quote_whatsapp_handoff',handoffData));
document.getElementById('copy-message').addEventListener('click',async ()=>{
  try {
    await navigator.clipboard.writeText(messageBox.value);
    status.textContent = 'Message copied.';
  } catch {
    messageBox.focus();
    messageBox.select();
    status.textContent = 'The message is selected. Use your device’s copy command.';
  }
});
document.addEventListener('click',event=>{
  const action = event.target.closest('[data-contact]');
  if (!action) return;
  const {contact,place} = action.dataset;
  if (config.demoMode) {
    event.preventDefault();
    showDialog(contact==='call'?'Call preview':'WhatsApp preview',config.phone+' is a placeholder. This preview does not connect to a phone or WhatsApp account.');
    return;
  }
  analytics.track(contact==='call'?'call_click':'whatsapp_click',{cta_location:place});
});

const form = document.getElementById('quote');
if (form) {
  const fieldset = document.getElementById('quote-fields');
  const fields = form.elements;
  const keys = ['pickup','destination','trip','departure','vehicle'];
  fieldset.disabled = false;
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    analytics.track('quote_form_start',{trip_type:fields.trip.value || 'unspecified'});
  };
  function clearError(field) {
    field.removeAttribute('aria-invalid');
    document.getElementById(field.id+'-error').textContent = '';
  }
  function syncDates() {
    fields.departure.min = indiaNow().date;
  }
  syncDates();
  form.addEventListener('input',event=>{
    if (!keys.includes(event.target.id)) return;
    start();
    clearError(event.target);
    syncDates();
  });
  document.addEventListener('click',event=>{
    const link = event.target.closest('[data-quote]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const {trip,vehicle,pickup,destination,route} = link.dataset;
    for (const [key,value] of Object.entries({trip,vehicle,pickup,destination})) {
      if (value) {
        fields[key].value = value;
        clearError(fields[key]);
      }
    }
    syncDates();
    if (route) analytics.track('route_select',{route_id:route,trip_type:trip});
    if (trip || vehicle) start();
    form.scrollIntoView({block:'start'});
    fields.trip.focus({preventScroll:true});
  });
  form.addEventListener('focusin',syncDates);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    start();
    syncDates();
    const values = Object.fromEntries(keys.map(key=>[key,fields[key].value.trim()]));
    const errors = timingErrors(values);
    for (const key of keys) {
      const field = fields[key];
      clearError(field);
      if (field.disabled) continue;
      if (field.required && !values[key]) errors[key] = 'Please complete this field.';
      if (errors[key]) {
        field.setAttribute('aria-invalid','true');
        document.getElementById(key+'-error').textContent = errors[key];
      }
    }
    const invalid = keys.filter(key=>errors[key]);
    if (invalid.length) {
      analytics.track('quote_form_validation_error',{field_ids:invalid.join(',')});
      fields[invalid[0]].focus();
      return;
    }
    showDialog('Review your trip details',config.demoMode ? config.phone+' is a placeholder. You can review and copy this message in preview.' : 'Open WhatsApp to continue, or copy the message if WhatsApp cannot open.',prepareMessage(config,values),{trip_type:values.trip,vehicle_category:values.vehicle || 'help'});
  });
}

document.addEventListener('focusin',event=>{
  if (event.target.matches('input,select,textarea')) document.body.classList.add('editing');
});
document.addEventListener('focusout',()=>{
  requestAnimationFrame(()=>document.body.classList.toggle('editing',document.activeElement.matches('input,select,textarea')));
});
window.visualViewport?.addEventListener('resize',()=>{
  document.body.classList.toggle('keyboard',window.innerHeight-window.visualViewport.height>120);
});


for (const slider of document.querySelectorAll('.slider')) {
  const rail = slider.querySelector('.rail');
  const controls = slider.querySelector('.slider-actions');
  const [previous, next] = controls.querySelectorAll('button');
  const sync = () => {
    previous.disabled = rail.scrollLeft < 2;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
  };
  const move = direction => {
    const first = rail.firstElementChild;
    const step = first.nextElementSibling.offsetLeft - first.offsetLeft;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.scrollBy({left: direction * step, behavior: reduced ? 'instant' : 'smooth'});
  };
  controls.hidden = false;
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  rail.addEventListener('scroll', sync, {passive:true});
  rail.addEventListener('keydown', event => {
    if (event.target !== rail || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  new ResizeObserver(sync).observe(rail);
  sync();
}
function updateCurrentLink() {
  const current = location.hash || '#home';
  for (const link of nav.querySelectorAll('a')) {
    if (link.pathname === location.pathname && link.hash === current || location.pathname === '/' && link.getAttribute('href') === current) {
      link.setAttribute('aria-current','location');
    } else {
      link.removeAttribute('aria-current');
    }
  }
}
window.addEventListener('hashchange', updateCurrentLink);
updateCurrentLink();
