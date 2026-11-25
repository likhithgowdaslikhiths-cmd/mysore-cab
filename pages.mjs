const nav = [['home','Home'],['services','Services'],['vehicles','Vehicles'],['packages','Packages'],['pricing','Pricing'],['destinations','Destinations'],['contact','Contact']];
export const escape = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const icons = {
  city: 'f1ad', road: 'f018', plane: 'f072', arrow: 'f061', palace: 'f66f',
  group: 'f0c0', car: 'f1ba', phone: 'f095', chat: 'f232', pin: 'f3c5',
  menu: 'f0c9', previous: 'f053', next: 'f054',
};
export const icon = name => `<span class="site-icon${name === 'chat' ? ' brand' : ''}" aria-hidden="true">&#x${icons[name]};</span>`;
const faq = [
  ['How do I request a cab in Mysore?', 'Use Get Quote to enter your trip details, then review the message before continuing to WhatsApp. You can also use Call or WhatsApp to discuss the trip.'],
  ['Can I enquire about a one-way or round trip?', 'Yes. Select One Way for a single leg or Round Trip for a return journey. Discuss the return itinerary when you send your enquiry.'],
  ['Which airport transfer should I select?', 'Select Airport Transfer and specify Bengaluru Airport (BLR) or Mysore Airport (MYQ) as the pickup or destination. Add the terminal and flight timing when known.'],
  ['What details are needed for an outstation quotation?', 'Share your pickup, destination, departure and return plans, preferred vehicle and any extra stops so the team can quote the itinerary.'],
  ['How should I choose a vehicle for my group?', 'Consider passenger count, luggage and any seating needs. Choose Help me choose to discuss the vehicle category with the team.'],
  ['What should I confirm about tolls and other charges?', 'Ask which tolls, parking, driver allowance and interstate charges are included, and how any extra time, distance or stops are handled.'],
  ['Does opening WhatsApp confirm my booking?', 'Opening WhatsApp prepares your enquiry. Send it in WhatsApp, then wait for the team to confirm the trip details, fare and availability.'],
  ['How do I ask about changing or cancelling a trip?', 'Contact the team with your existing trip details and ask which change or cancellation terms apply to your quotation.'],
];
export function pages(c) {
  const contact = (kind, place, label, style='outline') => `<a class="btn ${style}" data-contact="${kind}" data-place="${place}" href="${kind === 'call' ? c.tel : c.whatsapp}">${icon(kind==='call'?'phone':'chat')}${label ?? (kind==='call'?`Call ${c.phone}`:'WhatsApp')}</a>`;
  const quote = (attrs='', style='yellow', label='Get Quote', prefix='') => `<a class="btn ${style}" data-quote ${attrs} href="${prefix}#quote">${label}${icon('arrow')}</a>`;
  const section = (id, title, info, body, cls='') => `<section id="${id}" class="section ${cls}"><div class="wrap"><div class="section-head"><h2>${title}</h2>${info ? `<p>${info}</p>` : ''}</div>${body}</div></section>`;
  const field = (id, label, input, wide=false) => `<div class="field${wide?' wide':''}"><label for="${id}">${label}</label>${input.replace('<input',`<input id="${id}" name="${id}" aria-describedby="${id}-error"`).replace('<select',`<select id="${id}" name="${id}" aria-describedby="${id}-error"`).replace('<textarea',`<textarea id="${id}" name="${id}" aria-describedby="${id}-error"`)}<span class="error" id="${id}-error"></span></div>`;
  const options = entries => entries.map(([id,label])=>`<option value="${id}">${label}</option>`).join('');

  const image = (id, cls = '') => {
    const item = c.images[id];
    if (!item) return `<div class="image-slot ${cls}" aria-hidden="true"></div>`;
    const responsivePalace = item.file === 'hero-palace.webp'
      ? `srcset="./assets/images/hero-palace-small.webp 640w, ./assets/images/hero-palace.webp 1672w" sizes="${id === 'hero-palace' ? '(max-width: 767px) calc(100vw - 32px), (max-width: 899px) calc(100vw - 72px), (max-width: 1199px) 92vw, 48vw' : '(max-width: 767px) 84vw, (max-width: 1199px) 33vw, 25vw'}"`
      : '';
    const loading = id === 'logo' ? 'decoding="async"' : 'loading="lazy"';
    return `<img class="${cls}" src="./assets/images/${escape(item.file)}" ${responsivePalace} width="${item.width}" height="${item.height}" alt="${escape(item.alt)}" ${loading}>`;
  };
  const slider = (id, label, cards) => `<div class="slider"><div tabindex="0" class="rail" id="${id}" role="region" aria-label="${label}">${cards}</div><div class="slider-actions" hidden><button type="button" aria-controls="${id}" data-slide="-1" aria-label="Previous ${label}">${icon('previous')}</button><button type="button" aria-controls="${id}" data-slide="1" aria-label="Next ${label}">${icon('next')}</button></div></div>`;
  const form = `<form id="quote" class="quote hero-quote" aria-labelledby="quote-title" novalidate>
    <div class="quote-heading"><p class="eyebrow">Request a fare</p><h2 id="quote-title">Where are you headed?</h2><p>Enter your route, travel date and vehicle preference.</p></div>
    <fieldset id="quote-fields" disabled><legend class="sr-only">Trip details</legend><div class="fields">
    ${field('pickup','Pickup location','<input required maxlength="120" placeholder="e.g. Mysore Zoo">')}
    ${field('destination','Drop location','<input required maxlength="120" placeholder="e.g. Coorg">')}
    ${field('trip','Trip type','<select required><option value="">Choose trip</option>'+options(Object.entries(c.trips))+'</select>')}
    ${field('departure','Travel date','<input type="date" required>')}
    ${field('vehicle','Vehicle type','<select required><option value="">Choose vehicle</option>'+options(c.vehicles.map(([id,t])=>[id,id==='sedan'?'Etios/Sedan':t]))+'<option value="help">Help Me Choose</option></select>')}
    <button type="submit" class="btn yellow submit">Request fare</button></div></fieldset>
    <p class="form-note">Fare and availability are confirmed by the team.</p>
    <noscript><p>Enable JavaScript to prepare a trip message.</p></noscript>
  </form>`;
  const places = [
    ['mysore','Mysore','City sightseeing','Plan a Mysore sightseeing cab itinerary around the palace, zoo and Chamundi Hills.','local'],
    ...c.routes.filter(([id])=>id!=='reverse' && id!=='airport').map(([id,title,description,trip])=>[id,title,id==='bengaluru'?'City transfer':'Outstation travel',description,trip]),
  ];
  const selectRoute = (id, trip, pickup, drop) => `data-route="${id}" data-trip="${trip}" data-pickup="${escape(pickup)}" data-destination="${escape(drop)}"`;
  const packages = [...places.filter(([id])=>id!=='bengaluru'),['airport','Bengaluru Airport','Airport transfer','Plan a Bengaluru Airport pickup or drop-off and include your flight timing when known.','airport']];
  const benefits = [['pin','Mysore-based trip planning'],['road','Local and outstation choices'],['car','Vehicle options'],['group','Group enquiries'],['chat','WhatsApp quotations'],['arrow','Confirmation before booking']];
  const vehicleCards = c.vehicles.map(([id,t,d])=>`<article class="card vehicle">${image(id,'vehicle-image')}<div class="vehicle-copy"><span class="badge">Vehicle category</span><h3>${t}</h3><p>${d}</p><strong>Request Fare</strong>${quote(`data-vehicle="${id}"`,'dark','Get Vehicle Quote')}</div></article>`).join('');
  const landing = `<section id="home" class="hero"><div class="wrap hero-grid"><div class="hero-copy">
    <p class="eyebrow">${icon('pin')} Cab service in Mysore</p>
    <h1>Need a cab <span>in Mysore?</span></h1>
    <p class="intro">Local, airport and outstation rides in Mysore. Share your route to request a fare.</p>
    <div class="actions">${quote('','yellow','Request a fare')}${contact('call','hero','Call Now','outline')}</div>
    <ul class="hero-services">${[['city','Local rides'],['plane','Airport transfers'],['road','Outstation trips']].map(([i,t])=>`<li>${icon(i)}${t}</li>`).join('')}</ul>
    </div>${form}</div></section>
    ${section('services','Cab services in Mysore','Choose a taxi service that fits your trip.',`<div class="grid services">${c.services.map(([i,t,d,v])=>`<article class="card service-card"><span class="tile">${icon(i)}</span><h3>${t}</h3><p>${d}</p>${quote(`data-trip="${v}"`,'text')}</article>`).join('')}</div>`,'services-section')}
    ${section('routes','Popular routes','Start with a route and add your travel date.',slider('route-rail','routes',c.routes.filter(([id])=>id!=='airport').map(([id,t,d,v])=>{
      const reverse = id==='reverse';
      const pickup = reverse ? 'Bengaluru' : c.city;
      const heading = id==='bengaluru'?'Mysore to Bengaluru Cab':reverse?'Bengaluru to Mysore Cab':c.city+' to '+t+' Cab';
      return `<article class="card photo-card route-card">${image(reverse || id==='bengaluru'?'highway':id)}<div class="card-copy"><span class="badge">${c.trips[v]}</span><h3>${heading}</h3><p>${d}</p><ul class="details"><li>Pickup in ${pickup}</li><li>Vehicle choice with quote</li></ul><div class="card-action"><strong>Request Fare</strong>${quote(selectRoute(id,v,pickup,t),'yellow','Get Fare')}</div></div></article>`;
    }).join('')),'route-section')}
    <section id="packages" class="section package-section"><div class="wrap"><div class="package-panel"><header class="section-head"><p class="eyebrow package-eyebrow">Explore Mysore and beyond</p><h2>Tour Packages</h2><p>Plan sightseeing, hill station travel or an airport transfer.</p></header><div class="grid packages">${packages.map(([id,t,cat,d,v])=>`<article class="card package-card">${image(id,'package-image')}<span class="badge">${cat}</span><div class="card-copy"><h3>${id==='mysore'?'Mysore Sightseeing':t}</h3><p>${d}</p><div class="package-meta"><span>${c.trips[v]}</span><span>Fare based on your itinerary</span></div><div class="card-action">${quote(selectRoute(id,v,c.city,t),'yellow','Get Package Quote')}</div></div></article>`).join('')}</div></div></div></section>
    ${section('destinations','Destinations','Explore places you can include in your trip from Mysore.',slider('destination-rail','destinations',places.map(([id,t,cat,d,v])=>`<article class="card photo-card destination-card">${image(id)}<div class="card-copy"><span class="badge">${cat}</span><h3>${t}</h3>${quote(selectRoute(id,v,c.city,t),'text','Explore Trip')}</div></article>`).join('')),'destination-section')}
    ${section('vehicles','Vehicles for your trip','Images represent vehicle categories. The team confirms the vehicle arrangement during quotation.',slider('vehicle-rail','vehicles',vehicleCards),'soft fleet-section')}
    <section id="pricing" class="wrap pricing"><div><h2>Get a Fare for Your Mysore Trip</h2><p>Your route, vehicle, trip type and duration shape the quote. Ask about included kilometres or hours, tolls, parking, driver allowance and any other charges.</p>${quote()}</div>
    ${slider('price-rail','vehicle quotes',c.vehicles.map(([id,t])=>`<article class="card price-card">${image(id)}<h3>${t}</h3>${quote(`data-vehicle="${id}"`,'text','Get Quote')}</article>`).join(''))}</section>
    ${section('benefits','Why choose Mysore Cabs?','Plan the ride around your itinerary and group.',`<ul class="benefits">${benefits.map(([i,t])=>`<li>${icon(i)}<span>${t}</span></li>`).join('')}</ul>`,'benefit-section')}
    ${c.reviews.length ? section('reviews','Customer reviews','',`<div class="grid reviews">${c.reviews.map(({name,review})=>`<article class="card"><h3>${escape(name)}</h3><p>${escape(review)}</p></article>`).join('')}</div>`) : ''}
    ${section('faqs','Cab booking FAQs','Questions about planning a ride and requesting a quote.',`<div class="faqs">${faq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`,'faq-section')}`;
  const support = [
    ['privacy.html','Privacy Policy','How trip details, WhatsApp and optional analytics work on this site.',`<h2>Trip details</h2><p>The form prepares a message in your browser. This site does not send your form details to a server or save them for later. If you choose to continue to WhatsApp, the prepared details are included in the handoff. You decide whether to send the message in WhatsApp.</p><h2>WhatsApp and hosting</h2><p>WhatsApp processes information according to its own terms and privacy policy. The hosting provider may keep ordinary request logs. Use the form only for details needed to quote your trip.</p><h2>Analytics preferences</h2><p>${c.tracking ? 'Optional Google Tag Manager measurement requires your permission. It receives limited interaction categories and field identifiers, with trip text excluded. Your choice is stored on this device.' : 'Analytics is disabled in this build.'}</p>`],
    ['terms.html','Terms and Conditions','Enquiry, quotation and trip confirmation terms for Mysore Cabs.',`<h2>Enquiries and confirmation</h2><p>A call, prepared message or WhatsApp enquiry starts a conversation. A booking is in place once the team confirms availability and the agreed itinerary and fare.</p><h2>Quotation details</h2><p>Confirm the vehicle, seating arrangement, route and fare inclusions with the team. Agree on applicable payment, change and cancellation terms before accepting the quotation.</p><h2>Changes to your plans</h2><p>Contact the team with your existing trip details to ask about changes, cancellation and any conditions agreed for that trip.</p>`],
  ];
  const layout = (body, home) => {
    const prefix = home ? '' : './index.html';
    const brand = `<a class="wordmark" href="./" aria-label="${c.brand} home">${c.images.logo ? image('logo','brand-logo') : `<span class="brand-icon">${icon('car')}</span>${c.brand}`}</a>`;
    const headerCall = `<a class="header-call" data-contact="call" data-place="header" href="${c.tel}">${icon('phone')}<span><small>Call Now</small><strong>${escape(c.phone)}</strong></span></a>`;
    return `<a class="skip" href="#main">Skip to content</a>
    <header class="header"><div class="wrap header-inner">${brand}<button class="menu" aria-label="Toggle navigation" type="button" aria-expanded="false" aria-controls="navigation">${icon('menu')}</button><nav aria-label="Main navigation" id="navigation">${nav.map(([id,t])=>`<a href="${prefix}#${id}">${t}</a>`).join('')}</nav><div class="header-actions">${headerCall}${contact('whatsapp','header','WhatsApp','yellow')}</div></div></header>
    <main id="main" tabindex="-1">${body}</main>
    <footer class="footer wrap" ${home?'id="contact"':''}><div class="footer-card"><div class="footer-main"><div class="footer-brand">${brand}<p>Local, airport and outstation taxi enquiries.</p><p>${escape(c.location)}</p></div><div><h2>Contact</h2>${contact('call','footer','Call '+escape(c.phone),'footer-link')}${contact('whatsapp','footer','WhatsApp','footer-link')}</div><div><h2>Services</h2><a href="${prefix}#services">Cab services</a><a href="${prefix}#routes">Popular routes</a><a href="${prefix}#packages">Tour packages</a></div><div><h2>Quick links</h2><a href="${prefix}#vehicles">Vehicles</a><a href="${prefix}#pricing">Pricing</a><a href="${prefix}#faqs">FAQs</a></div><div class="footer-enquiry"><h2>Planning a trip?</h2><p>Share your route and vehicle preference to request a fare.</p>${quote('','outline','Get a Quote',prefix)}</div></div></div><div class="footer-bottom"><span>&copy; ${new Date().getFullYear()} ${c.brand}</span><span>${escape(c.location)}</span><a href="./privacy.html">Privacy Policy</a><a href="./terms.html">Terms and Conditions</a>${c.tracking?'<button id="preferences" type="button">Analytics preferences</button>':''}</div></footer>
    <nav class="mobile-actions" aria-label="Quick contact">${contact('call','mobile','Call Now')}${contact('whatsapp','mobile','WhatsApp','yellow')}</nav>
    <dialog id="contact-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description"><form method="dialog"><button class="close" aria-label="Close dialog" autofocus>×</button></form><h2 id="dialog-title"></h2><p id="dialog-description"></p><div id="message-area" hidden><label for="prepared-message">Prepared trip message</label><textarea id="prepared-message" readonly rows="7"></textarea><div class="actions"><button type="button" id="copy-message" class="btn outline">Copy message</button><a id="open-whatsapp" class="btn yellow" target="_blank" rel="noopener noreferrer" hidden>Open WhatsApp</a></div><p id="copy-status" role="status"></p></div></dialog>
    ${c.tracking?`<aside id="consent" class="consent" aria-labelledby="consent-title" hidden><h2 id="consent-title">Optional analytics</h2><p>Allow measurement of site interactions. Trip details are excluded.</p><div class="actions"><button class="btn outline" data-consent="denied">Reject analytics</button><button class="btn yellow" data-consent="granted">Allow analytics</button></div></aside>`:''}`;
  };
  return [
    ['index.html',`${c.brand} | Mysore Taxi Service, Airport & Outstation Cabs`,`Request a Mysore cab fare for local travel, Mysore airport taxi transfers, sightseeing and outstation cab journeys. Compare vehicle choices and enquire on WhatsApp.`,layout(landing,true)],
    ...support.map(([url,t,d,body])=>[url,`${t} | ${c.brand}`,d,layout(`<article id="contact" class="wrap legal"><a href="./">← Back to ${c.brand}</a><h1>${t}</h1>${body}<h2>Contact</h2><p>${c.brand} · ${c.location}</p><div class="actions">${contact('call','legal')}${contact('whatsapp','legal')}</div></article>`,false)]),
  ];
}
