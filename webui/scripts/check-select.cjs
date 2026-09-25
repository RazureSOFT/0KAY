const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))
async function main(){
 const page=await(await fetch('http://127.0.0.1:9333/json/new?http://127.0.0.1:3000/agents',{method:'PUT'})).json()
 const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(resolve=>ws.onopen=resolve)
 let id=0;const pending=new Map()
 ws.onmessage=event=>{const result=JSON.parse(event.data);const item=pending.get(result.id);if(item){clearTimeout(item.timer);pending.delete(result.id);result.error?item.reject(result.error):item.resolve(result.result)}}
 const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;const timer=setTimeout(()=>reject(new Error(method+' timeout')),10000);pending.set(n,{resolve,reject,timer});ws.send(JSON.stringify({id:n,method,params}))})
 const evaluate=async expression=>(await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value
 try{
  await wait(1800)
  for(const width of [1440,390]){
   await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600})
   await wait(300)
   const report=await evaluate(`(async()=>{
    const trigger=document.querySelector('[role="combobox"][aria-label="思考强度"]');if(!trigger)throw Error('trigger missing');
    const original=trigger.textContent.trim();trigger.focus();trigger.click();await new Promise(r=>setTimeout(r,200));
    const menu=document.querySelector('[role="listbox"]'),rect=menu.getBoundingClientRect();
    trigger.dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true}));trigger.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));await new Promise(r=>setTimeout(r,200));
    const selected=trigger.textContent.includes('最高');trigger.click();await new Promise(r=>setTimeout(r,160));
    const options=[...document.querySelectorAll('[role="option"]')];options.find(e=>e.textContent.trim()===original)?.click();await new Promise(r=>setTimeout(r,160));
    trigger.click();await new Promise(r=>setTimeout(r,160));trigger.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await new Promise(r=>setTimeout(r,180));
    return {nativeSelects:document.querySelectorAll('select').length,comboboxes:document.querySelectorAll('[role="combobox"]').length,inBounds:rect.left>=0&&rect.right<=innerWidth&&rect.top>=0&&rect.bottom<=innerHeight,keyboardSelected:selected,escapeClosed:!document.querySelector('[role="listbox"]'),focusRestored:document.activeElement===trigger};
   })()`)
   console.log(JSON.stringify({width,...report}))
   if(report.nativeSelects||!report.inBounds||!report.keyboardSelected||!report.escapeClosed||!report.focusRestored)throw Error('custom select regression')
  }
 }finally{ws.close();await fetch('http://127.0.0.1:9333/json/close/'+page.id)}
}
main().catch(error=>{console.error(error);process.exitCode=1})
