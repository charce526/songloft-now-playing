function onInit(){songloft.log.info('songloft-now-playing 1.0.18 initialized');}
function onDeinit(){}
function onHTTPRequest(){return {status:404,headers:{'Content-Type':'application/json'},body:'{"error":"not found"}'};}
globalThis.onInit=onInit; globalThis.onDeinit=onDeinit; globalThis.onHTTPRequest=onHTTPRequest;
