// Read-only UI checks in a separate browser tab. Never seed user settings.
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
async function main() {
  const page = await (await fetch('http://127.0.0.1:9333/json/new?http://127.0.0.1:3000/agents', {method:'PUT'})).json()
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve,reject) => {ws.onopen=resolve;ws.onerror=reject})
  let sequence=0
  const pending=new Map()
  const errors=[]
  ws.onmessage=({data})=>{
    const message=JSON.parse(data)
    if(message.method==='Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
    const entry=pending.get(message.id)
    if(entry){clearTimeout(entry.timer);pending.delete(message.id);message.error?entry.reject(message.error):entry.resolve(message.result)}
  }
  const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;const timer=setTimeout(()=>{pending.delete(id);reject(new Error(method+' timed out'))},10000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}))})
  const evaluate=async expression=>(await call('Runtime.evaluate',{expression,returnByValue:true})).result.value
  try {
    await call('Runtime.enable')
    for(const width of [1440,390]){
      await call('Emulation.setDeviceMetricsOverride',{width,height:960,deviceScaleFactor:1,mobile:width<600})
      for(const route of ['/agents','/plugins','/memory','/companion','/usage','/settings','/']) {
        await call('Page.navigate',{url:'http://127.0.0.1:3000'+route});await delay(1100)
        const report=await evaluate(`(()=>{const main=document.querySelector('.app-main');const composer=document.querySelector('.composer');return {path:location.pathname,shell:!!main,mainHeight:main?.clientHeight,overflow:document.documentElement.scrollWidth>innerWidth,primary:getComputedStyle(document.documentElement).getPropertyValue('--md-primary').trim(),composerVisible:!composer||composer.getBoundingClientRect().bottom<=innerHeight,nav:document.querySelectorAll('.nav-item').length}})()`)
        console.log(JSON.stringify({width,...report}))
        if(!report.shell||report.mainHeight<100||report.overflow||!report.composerVisible) throw new Error('layout check failed')
      }
    }
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
    const duration=await evaluate(`getComputedStyle(document.querySelector('button')).transitionDuration`)
    console.log('Reduced motion transition:',duration)
    if(errors.length) throw new Error(errors.join('\n'))
  } finally {ws.close();await fetch('http://127.0.0.1:9333/json/close/'+page.id)}
}
main().catch(error=>{console.error(error);process.exitCode=1})
