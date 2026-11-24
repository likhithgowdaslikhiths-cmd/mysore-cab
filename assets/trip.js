const clock = new Intl.DateTimeFormat('en-GB',{
  timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23',
});
export function indiaNow(now = new Date()) {
  const p = Object.fromEntries(clock.formatToParts(now).map(({type,value})=>[type,value]));
  return {date:p.year+'-'+p.month+'-'+p.day,time:p.hour+':'+p.minute};
}
export function timingErrors({departure}, now = indiaNow()) {
  return departure && departure < now.date ? {departure:'Choose today or a later date in India.'} : {};
}
export function prepareMessage(config, values) {
  const rows = [
    ['Pickup', values.pickup], ['Drop', values.destination], ['Trip type', config.trips[values.trip]],
    ['Travel date', values.departure], ['Vehicle', config.vehicles[values.vehicle] || 'Help Me Choose'],
  ];
  return 'Hello ' + config.brand + ', I would like to request a cab fare.\n\n' +
    rows.map(([label, value]) => label + ': ' + value).join('\n');
}
export const whatsappUrl = (base,message) => base + '?text=' + encodeURIComponent(message);

