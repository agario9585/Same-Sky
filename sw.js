// Same Sky — service worker: receives push events and shows the notification.
self.addEventListener('push', function(event){
  var data = {};
  try{ data = event.data ? event.data.json() : {}; }catch(e){ /* ignore */ }
  var title = data.title || 'Same Sky';
  var options = {
    body: data.body || '',
    tag: data.tag || 'same-sky',
    data: { url: data.url || './' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(function(clientList){
      for(var i=0;i<clientList.length;i++){
        if('focus' in clientList[i]) return clientList[i].focus();
      }
      if(clients.openWindow) return clients.openWindow(url);
    })
  );
});
