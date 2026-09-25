async function main(){
 const page=await(await fetch('http://127.0.0.1:9333/json/new?http://127.0.0.1:3000/agents',{method:'PUT'})).json();const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r)
 let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id)}}
 const call=(method,params={})=>new Promise(resolve=>{const n=++id;pending.set(n,resolve);ws.send(JSON.stringify({id:n,method,params}))})
 try{await new Promise(r=>setTimeout(r,1500));for(const width of [1440,390]){
 await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});
 const result=await call('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`(async()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));const b=document.querySelector('.thinking-trigger');b.click();await wait(180);const panel=document.querySelector('.thinking-popover'),input=panel.querySelector('input'),rect=panel.getBoundingClientRect();input.value='100';input.dispatchEvent(new Event('input',{bubbles:true}));await wait(50);const max=panel.classList.contains('full')&&panel.classList.contains('pulse');input.value='0';input.dispatchEvent(new Event('input',{bubbles:true}));await wait(50);const off=panel.querySelector('output').textContent.includes('关闭思考');input.value='50';input.dispatchEvent(new Event('input',{bubbles:true}));panel.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return {width:innerWidth,maxEffect:max,off,visible:rect.left>=0&&rect.right<=innerWidth&&rect.top>=0&&rect.bottom<=innerHeight}})()`});console.log(result.result.value);if(!result.result.value?.maxEffect||!result.result.value?.off||!result.result.value?.visible)throw Error('slider check failed')
 }}finally{ws.close();await fetch('http://127.0.0.1:9333/json/close/'+page.id)}
}
main().catch(e=>{console.error(e);process.exitCode=1})
