export function createAnalytics(settings, view = window) {
  let allowed = false;
  let loaded = false;
  const categoryKeys = ['cta_location','service_category','trip_type','vehicle_category','route_id','field_ids'];
  return {
    allow() {
      if (!settings) return;
      allowed = true;
      if (loaded) return;
      loaded = true;
      const layer = view.dataLayer ||= [];
      layer.push({'gtm.start':Date.now(),event:'gtm.js'});
      const tag = view.document.createElement('script');
      tag.async = true;
      tag.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(settings.containerId);
      view.document.head.append(tag);
    },
    track(name, parameters) {
      if (!allowed || !Object.hasOwn(settings.events,name)) return;
      const event = {event:settings.events[name]};
      for (const key of categoryKeys) {
        if (Object.hasOwn(parameters,key)) event[key] = parameters[key];
      }
      view.dataLayer.push(event);
    },
  };
}

