export default {
  brand: 'Mysore Cabs',
  city: 'Mysore',
  region: 'Karnataka',
  country: 'India',
  phone: '1234567890',
  countryCode: '91',
  demoMode: true,
  siteUrl: '',
  IMAGE_ASSET_DIR: 'E:/mysore-cabs-assets/assets/images',
  images: {
    "hero-palace": {
      "file": "hero-palace.webp",
      "width": 1672,
      "height": 941,
      "alt": "Generated view of Mysore Palace in warm evening light"
    },
    "crysta": {
      "file": "crysta.webp",
      "width": 1100,
      "height": 562,
      "alt": "White Innova Crysta shown from the front and side"
    },
    "sedan": {
      "file": "sedan.webp",
      "width": 960,
      "height": 489,
      "alt": "White Etios-style sedan shown from the front and side"
    },
    "suv": {
      "file": "suv.webp",
      "width": 960,
      "height": 480,
      "alt": "White Ertiga-style MPV shown from the front and side"
    },
    "innova": {
      "file": "innova.webp",
      "width": 960,
      "height": 491,
      "alt": "White classic Innova shown from the front and side"
    },
    "tempo": {
      "file": "tempo.webp",
      "width": 960,
      "height": 540,
      "alt": "White passenger minibus shown from the front and side"
    },
    "coorg": {
      "file": "coorg.webp",
      "width": 960,
      "height": 540,
      "alt": "Coffee plants and misty forested hills representing Coorg"
    },
    "ooty": {
      "file": "ooty.webp",
      "width": 960,
      "height": 540,
      "alt": "Green tea gardens and mountain scenery representing Ooty"
    },
    "wayanad": {
      "file": "wayanad.webp",
      "width": 960,
      "height": 540,
      "alt": "Calm water and forested hills representing Wayanad"
    },
    "chikmagalur": {
      "file": "chikmagalur.webp",
      "width": 960,
      "height": 540,
      "alt": "Green mountain ridges and coffee-country scenery representing Chikmagalur"
    },
    "bengaluru": {
      "file": "bengaluru.webp",
      "width": 960,
      "height": 540,
      "alt": "Generated view of Vidhana Soudha representing Bengaluru"
    },
    "airport": {
      "file": "airport.webp",
      "width": 960,
      "height": 540,
      "alt": "Representative modern airport exterior with landscaped approach"
    },
    "highway": {
      "file": "highway.webp",
      "width": 960,
      "height": 540,
      "alt": "Representative divided highway through green Karnataka countryside"
    },
    "mysore": {
      "file": "hero-palace.webp",
      "width": 1672,
      "height": 941,
      "alt": "Generated view of Mysore Palace in warm evening light"
    },
    logo: { file: 'logo.webp', width: 540, height: 180, alt: '' }
  },
  reviews: [],
  allowIndexing: false,
  analytics: {
    enabled: false,
    strategy: 'gtm',
    containerId: '',
    events: {
      call_click: 'call_click',
      whatsapp_click: 'whatsapp_click',
      quote_form_start: 'quote_form_start',
      quote_form_validation_error: 'quote_form_validation_error',
      route_select: 'route_select',
      quote_whatsapp_handoff: 'quote_whatsapp_handoff',
    },
  },
  trips: {
    local: 'Local Travel',
    round: 'Round Trip',
    outstation: 'Outstation',
    airport: 'Airport Transfer',
    one: 'One Way',
  },
  services: [
    ['city', 'Local cab service in Mysore', 'Arrange a ride across the city, from a railway-station pickup to your hotel or an address in Mysuru.', 'local'],
    ['road', 'Outstation cabs from Mysore', 'Share your itinerary for a return journey to a nearby city, hill station or weekend destination.', 'outstation'],
    ['plane', 'Airport transfers', 'Choose Bengaluru Airport (BLR) or Mysore Airport (MYQ) and include your terminal or flight timing if known.', 'airport'],
    ['arrow', 'One-way taxi enquiries', 'Request a single-leg ride. The team can check the route and vehicle availability when quoting.', 'one'],
    ['palace', 'Mysore sightseeing', 'Plan stops at Mysore Palace, Chamundi Hills, Mysore Zoo and Brindavan Gardens. Check opening conditions when planning.', 'local'],
    ['group', 'Family and group travel', 'Tell us how many people are travelling and what luggage you’ll bring so the team can suggest a vehicle.', 'outstation'],
  ],
  vehicles: [
    ['sedan', 'Sedan', 'For city rides, airport transfers and trips with a smaller group.'],
    ['suv', 'Ertiga / SUV', 'For family outings where seating and luggage space both matter.'],
    ['innova', 'Innova', 'An option for longer drives and family itineraries with several stops.'],
    ['crysta', 'Innova Crysta', 'Consider this category for outstation family or business travel.'],
    ['tempo', 'Tempo Traveller', 'For travelling together on group tours and outings.'],
  ],
  routes: [
    ['bengaluru', 'Bengaluru', 'One-way city drop-offs for appointments, work or onward travel.', 'one'],
    ['reverse', 'Mysore', 'Arrange a pickup in Bengaluru for a one-way ride to Mysore.', 'one'],
    ['airport', 'Bengaluru Airport', 'Share your flight time and terminal when planning the airport transfer.', 'airport'],
    ['coorg', 'Coorg', 'Discuss coffee estate stops, where you’re staying and your return date.', 'outstation'],
    ['ooty', 'Ooty', 'Plan hill-town stops, time for the Botanical Garden and your return itinerary.', 'outstation'],
    ['wayanad', 'Wayanad', 'Share your stay location and any stops you want to make en route.', 'outstation'],
    ['chikmagalur', 'Chikmagalur', 'Discuss estate visits, viewpoints and the pickup time for your return.', 'outstation'],
  ],
};
