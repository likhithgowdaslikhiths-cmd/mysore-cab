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
  const contact = (kind, place, label, style='outline') => `<a class="btn ${style}" data-contact="${kind}" data-place="${place}" href="${c.demoMode ? '#contact' : kind === 'call' ? c.tel : c.whatsapp}">${icon(kind==='call'?'phone':'chat')}${label ?? (kind==='call'?`Call ${c.phone}`:'WhatsApp')}</a>`;
  const quote = (attrs='', style='yellow', label='Get Quote', prefix='') => `<a class="btn ${style}" data-quote ${attrs} href="${prefix}#quote">${label}${icon('arrow')}</a>`;
  const section = (id, title, info, body, cls='') => `<section id="${id}" class="section ${cls}"><div class="wrap"><div class="section-head"><h2>${title}</h2>${info ? `<p>${info}</p>` : ''}</div>${body}</div></section>`;
  const field = (id, label, input, wide=false) => `<div class="field${wide?' wide':''}"><label for="${id}">${label}</label>${input.replace('<input',`<input id="${id}" name="${id}" aria-describedby="${id}-error"`).replace('<select',`<select id="${id}" name="${id}" aria-describedby="${id}-error"`).replace('<textarea',`<textarea id="${id}" name="${id}" aria-describedby="${id}-error"`)}<span class="error" id="${id}-error"></span></div>`;
  const options = entries => entries.map(([id,label])=>`<option value="${id}">${label}</option>`).join('');

  const image = (id, cls = '') => {
    const item = c.images[id];
    return item
      ? `<img class="${cls}" src="./assets/images/${escape(item.file)}" width="${item.width}" height="${item.height}" alt="${escape(item.alt)}" ${id.startsWith('hero') ? 'fetchpriority="high"' : id === 'logo' ? 'decoding="async"' : 'loading="lazy"'}>`
      : `<div class="image-slot ${cls}" aria-hidden="true"></div>`;
  };
  const slider = (id, label, cards) => `<div class="slider"><div tabindex="0" class="rail" id="${id}" role="region" aria-label="${label}">${cards}</div><div class="slider-actions" hidden><button type="button" aria-controls="${id}" data-slide="-1" aria-label="Previous ${label}">${icon('previous')}</button><button type="button" aria-controls="${id}" data-slide="1" aria-label="Next ${label}">${icon('next')}</button></div></div>`;
  const form = `<form id="quote" class="wrap quote" aria-labelledby="quote-title" novalidate>
    <h2 id="quote-title">Get a Cab Quote in Mysore</h2><p>Enter your pickup, destination, travel date and vehicle preference to prepare your WhatsApp enquiry.</p>
    <fieldset id="quote-fields" disabled><legend class="sr-only">Trip details</legend><div class="fields">
    ${field('pickup','Pickup location','<input required maxlength="120" placeholder="e.g. Mysore Zoo">')}
    ${field('destination','Drop location','<input required maxlength="120" placeholder="e.g. Coorg">')}
    ${field('trip','Trip type','<select required><option value="">Choose trip</option>'+options(Object.entries(c.trips))+'</select>')}
    ${field('departure','Travel date','<input type="date" required>')}
    ${field('vehicle','Vehicle type','<select required><option value="">Choose vehicle</option>'+options(c.vehicles.map(([id,t])=>[id,id==='sedan'?'Etios/Sedan':t]))+'<option value="help">Help Me Choose</option></select>')}
    <button type="submit" class="btn yellow submit">Get Fare on WhatsApp</button></div></fieldset>
    <p class="form-note">Fare and availability are confirmed by the team.</p>
    <noscript><p>Enable JavaScript to prepare a trip message.</p></noscript>
  </form>`;
  const places = [
    ['mysore','Mysore','City sightseeing','Plan a city itinerary around the palace, zoo and Chamundi Hills.','local'],
    ...c.routes.filter(([id])=>id!=='reverse' && id!=='airport').map(([id,title,description,trip])=>[id,title,id==='bengaluru'?'City transfer':'Outstation travel',description,trip]),
  ];
  const selectRoute = (id, trip, pickup, drop) => `data-route="${id}" data-trip="${trip}" data-pickup="${escape(pickup)}" data-destination="${escape(drop)}"`;
  const packages = [...places.filter(([id])=>id!=='bengaluru'),['airport','Bengaluru Airport','Airport transfer','Arrange a pickup or drop-off at Bengaluru Airport.','airport']];
  const benefits = [['pin','Mysore-based trip planning'],['road','Local and outstation choices'],['car','Vehicle options'],['group','Group enquiries'],['chat','WhatsApp quotations'],['arrow','Confirmation before booking']];
  const vehicleCards = c.vehicles.map(([id,t,d])=>`<article class="card vehicle">${image(id)}<div><span class="badge">Vehicle category</span><h3>${t}</h3><p>${d}</p><strong>Request Fare</strong>${quote(`data-vehicle="${id}"`,'dark','Get Vehicle Quote')}</div></article>`).join('');
  const landing = `<section id="home" class="hero"><div class="wrap hero-grid"><div class="hero-copy">
    <p class="eyebrow">${icon('pin')} Cab booking in Mysore</p>
    <h1>${c.brand} for Local, Airport &amp; Outstation Travel</h1>
    <p class="intro">Plan city rides, airport transfers, sightseeing and outstation journeys from Mysore. Choose your trip and vehicle preference, then request a fare on WhatsApp.</p>
    <div class="actions">${quote('','yellow','Get a Cab Quote')}${contact('call','hero')}</div>
    <ul class="hero-services">${[['city','Local Travel'],['plane','Airport Transfers'],['road','Outstation Trips']].map(([i,t])=>`<li>${icon(i)}${t}</li>`).join('')}</ul>
    </div><figure class="hero-visual">${image('hero-palace','hero-back')}<figcaption class="hero-photo-label">${icon('pin')} <span>Mysore Palace<br><small>Mysore, Karnataka</small></span></figcaption></figure></div></section>
    ${form}
    ${section('services','Cab services in Mysore','Choose a taxi service that fits your trip.',`<div class="grid services">${c.services.map(([i,t,d,v])=>`<article class="card"><span class="tile">${icon(i)}</span><h3>${t}</h3><p>${d}</p>${quote(`data-trip="${v}"`,'text')}</article>`).join('')}</div>`)}
    ${section('routes','Popular routes','Start with a route and add your travel date.',slider('route-rail','routes',c.routes.filter(([id])=>id!=='airport').map(([id,t,d,v])=>{
      const reverse = id==='reverse';
      const pickup = reverse ? 'Bengaluru' : c.city;
      const heading = id==='bengaluru'?'Mysore to Bangalore':reverse?'Bangalore to Mysore':c.city+' to '+t;
      return `<article class="card photo-card">${image(reverse || id==='bengaluru'?'highway':id)}<div class="card-copy"><span class="badge">${c.trips[v]}</span><h3>${heading}</h3><p>${d}</p><ul class="details"><li>Pickup in ${pickup}</li><li>Vehicle choice with quote</li></ul><div class="card-action"><strong>Request Fare</strong>${quote(selectRoute(id,v,pickup,t),'yellow','Get Fare')}</div></div></article>`;
    }).join('')))}
    ${section('packages','Tour packages','Plan sightseeing, hill station travel or an airport transfer.',`<div class="grid packages">${packages.map(([id,t,cat,d,v])=>`<article class="card photo-card">${image(id)}<div class="card-copy"><span class="badge">${cat}</span><h3>${id==='mysore'?'Mysore Sightseeing':t}</h3><p>${d}</p><p>Discuss vehicle options for your travellers.</p><div class="card-action">${quote(selectRoute(id,v,c.city,t),'outline','Get Package Quote')}</div></div></article>`).join('')}</div>`,'package-section')}
    ${section('destinations','Destinations','Explore places you can include in your trip from Mysore.',slider('destination-rail','destinations',places.map(([id,t,cat,d,v])=>`<article class="card photo-card">${image(id)}<div class="card-copy"><span class="badge">${cat}</span><h3>${t}</h3>${quote(selectRoute(id,v,c.city,t),'text','Explore Trip')}</div></article>`).join('')))}
    ${section('vehicles','Vehicles for your trip','Images represent vehicle categories. The team confirms the vehicle arrangement during quotation.',slider('vehicle-rail','vehicles',vehicleCards),'soft')}
    <section id="pricing" class="wrap pricing"><div><h2>Get a Fare for Your Mysore Trip</h2><p>Your route, vehicle, trip type and duration shape the quote. Ask about included kilometres or hours, tolls, parking, driver allowance and any other charges.</p>${quote()}</div>
    ${slider('price-rail','vehicle quotes',c.vehicles.map(([id,t])=>`<article class="card price-card">${image(id)}<h3>${t}</h3>${quote(`data-vehicle="${id}"`,'text','Get Quote')}</article>`).join(''))}</section>
    ${section('benefits','Why choose Mysore Cabs?','Plan the ride around your itinerary and group.',`<ul class="benefits">${benefits.map(([i,t])=>`<li>${icon(i)}${t}</li>`).join('')}</ul>`)}
    ${c.reviews.length ? section('reviews','Customer reviews','',`<div class="grid reviews">${c.reviews.map(({name,review})=>`<article class="card"><h3>${escape(name)}</h3><p>${escape(review)}</p></article>`).join('')}</div>`) : ''}
    ${section('faqs','Cab booking FAQs','Questions about planning a ride and requesting a quote.',`<div class="faqs">${faq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`)}`;
  const support = [
    ['privacy.html','Privacy Policy','How trip details, WhatsApp and optional analytics work on this site.',`<h2>Trip details</h2><p>The form prepares a message in your browser. This site does not send your form details to a server or save them for later. If you choose to continue to WhatsApp, the prepared details are included in the handoff. You decide whether to send the message in WhatsApp.</p><h2>WhatsApp and hosting</h2><p>WhatsApp processes information according to its own terms and privacy policy. The hosting provider may keep ordinary request logs. Use the form only for details needed to quote your trip.</p><h2>Analytics preferences</h2><p>${c.tracking ? 'Optional Google Tag Manager measurement requires your permission. It receives limited interaction categories and field identifiers, with trip text excluded. Your choice is stored on this device.' : 'Analytics is disabled in this build.'}</p>`],
    ['terms.html','Terms and Conditions','Enquiry, quotation and trip confirmation terms for Mysore Cabs.',`<h2>Enquiries and confirmation</h2><p>A call, prepared message or WhatsApp enquiry starts a conversation. A booking is in place once the team confirms availability and the agreed itinerary and fare.</p><h2>Quotation details</h2><p>Confirm the vehicle, seating arrangement, route and fare inclusions with the team. Agree on applicable payment, change and cancellation terms before accepting the quotation.</p><h2>Changes to your plans</h2><p>Contact the team with your existing trip details to ask about changes, cancellation and any conditions agreed for that trip.</p>`],
  ];
  const layout = (body, home) => {
    const prefix = home ? '' : './index.html';
    const brand = `<a class="wordmark" href="./" aria-label="${c.brand} home">${c.images.logo ? image('logo','brand-logo') : `<span class="brand-icon">${icon('car')}</span>${c.brand}`}</a>`;
    return `<a class="skip" href="#main">Skip to content</a>
    <header class="header"><div class="wrap header-inner">${brand}<button class="menu" aria-label="Toggle navigation" type="button" aria-expanded="false" aria-controls="navigation">${icon('menu')}</button><nav aria-label="Main navigation" id="navigation">${nav.map(([id,t])=>`<a href="${prefix}#${id}">${t}</a>`).join('')}</nav><div class="header-actions">${contact('call','header','Call Now · '+c.phone)}${contact('whatsapp','header',undefined,'yellow')}</div></div></header>
    <main id="main" tabindex="-1">${body}</main>
    <footer class="footer wrap" ${home?'id="contact"':''}><div class="footer-main"><div>${brand}<p>Local, airport and outstation taxi enquiries.</p><p>${c.location}</p></div><div><h2>Services</h2><a href="${prefix}#services">Cab services</a><a href="${prefix}#routes">Popular routes</a><a href="${prefix}#packages">Tour packages</a></div><div><h2>Plan your trip</h2><a href="${prefix}#vehicles">Vehicles</a><a href="${prefix}#pricing">Pricing</a><a href="${prefix}#faqs">FAQs</a></div><div class="footer-enquiry"><h2>Request a fare</h2><div class="actions">${contact('call','footer-enquiry')}${contact('whatsapp','footer-enquiry')}</div></div></div><div class="footer-links"><span>&copy; ${c.brand}</span>${contact('call','footer',c.phone,'text')}<a href="./privacy.html">Privacy Policy</a><a href="./terms.html">Terms and Conditions</a>${c.tracking?'<button id="preferences" type="button">Analytics preferences</button>':''}</div></footer>
    <nav class="mobile-actions" aria-label="Quick contact">${contact('call','mobile','Call')}${contact('whatsapp','mobile')}${quote('','yellow','Get Quote',prefix)}</nav>
    <dialog id="contact-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description"><form method="dialog"><button class="close" aria-label="Close dialog" autofocus>×</button></form><h2 id="dialog-title"></h2><p id="dialog-description"></p><div id="message-area" hidden><label for="prepared-message">Prepared trip message</label><textarea id="prepared-message" readonly rows="7"></textarea><div class="actions"><button type="button" id="copy-message" class="btn outline">Copy message</button><a id="open-whatsapp" class="btn yellow" target="_blank" rel="noopener noreferrer" hidden>Open WhatsApp</a></div><p id="copy-status" role="status"></p></div></dialog>
    ${c.tracking?`<aside id="consent" class="consent" aria-labelledby="consent-title" hidden><h2 id="consent-title">Optional analytics</h2><p>Allow measurement of site interactions. Trip details are excluded.</p><div class="actions"><button class="btn outline" data-consent="denied">Reject analytics</button><button class="btn yellow" data-consent="granted">Allow analytics</button></div></aside>`:''}`;
  };
  return [
    ['index.html',`${c.brand} | Local, Airport & Outstation Taxi Service`,`Request a cab fare with ${c.brand} for local travel, airport transfers, sightseeing and outstation trips. Compare vehicle options and enquire on WhatsApp.`,layout(landing,true)],
    ...support.map(([url,t,d,body])=>[url,`${t} | ${c.brand}`,d,layout(`<article id="contact" class="wrap legal"><a href="./">← Back to ${c.brand}</a><h1>${t}</h1>${body}<h2>Contact</h2><p>${c.brand} · ${c.location}</p><div class="actions">${contact('call','legal')}${contact('whatsapp','legal')}</div></article>`,false)]),
  ];
}
