async function main(){
 const page=await(await fetch('http://127.0.0.1:9333/json/new?http://127.0.0.1:3000/settings?tab=live2d',{method:'PUT'})).json()
 const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(resolve=>ws.onopen=resolve)
 let id=0;const pending=new Map();const errors=[]
 ws.onmessage=event=>{const msg=JSON.parse(event.data);if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params.exceptionDetails);if(pending.has(msg.id)){pending.get(msg.id)(msg.result);pending.delete(msg.id)}}
 const call=(method,params={})=>new Promise(resolve=>{const n=++id;pending.set(n,resolve);ws.send(JSON.stringify({id:n,method,params}))})
 try {
  await call('Runtime.enable');await call('Page.reload');await new Promise(r=>setTimeout(r,10000))
  const result=await call('Runtime.evaluate',{expression:`JSON.stringify({text:document.querySelector('.live2d-stage')?.innerText,canvas:document.querySelectorAll('canvas').length,sdk:!!window.Live2D,errors:[...document.querySelectorAll('.stage-status.warn')].map(e=>e.innerText)})`,returnByValue:true})
  console.log(result.result.value);console.log(JSON.stringify(errors))
  const drag=await call('Runtime.evaluate',{expression:`(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms));
   const buttons=[...document.querySelectorAll('.stage-actions button')].filter(e=>/shizuku|mao_pro/.test(e.textContent));
   const output=[];
   for(const button of buttons.slice(0,2)){
    button.click();await wait(3000);
    const stage=document.querySelector('.stage-viewport');if(!stage)continue;
    const rect=stage.getBoundingClientRect(),x=rect.x+rect.width/2,y=rect.y+rect.height/2;
    stage.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1,pointerType:'mouse',button:0,clientX:x,clientY:y}));
    stage.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:1,pointerType:'mouse',clientX:x+40,clientY:y+30}));
    output.push({model:button.textContent,cursor:stage.style.cursor});
    stage.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:1,pointerType:'mouse',clientX:x+40,clientY:y+30}));
   }return output;
  })()`,returnByValue:true,awaitPromise:true});console.log('Drag after switches:',JSON.stringify(drag.result.value))
 }finally{ws.close();await fetch('http://127.0.0.1:9333/json/close/'+page.id)}
}
main().catch(error=>{console.error(error);process.exitCode=1})
