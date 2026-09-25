#!/usr/bin/env node
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import readline from 'node:readline/promises'
import {discover,pinnedRequest} from '../src/discovery.mjs'
import {installPackage,run,validateManifest,within} from '../src/installer.mjs'

const args=process.argv.slice(2)
if(args[0]?.startsWith('install@'))args.splice(0,1,'install',args[0].slice(7))
const home=process.env.OKAY_PM_HOME||path.join(os.homedir(),'.0kay')
await fs.mkdir(home,{recursive:true,mode:0o700})
const statePath=path.join(home,'state.json')
let state={cores:{},installed:{},pairings:{}}
try{state={...state,...JSON.parse(await fs.readFile(statePath,'utf8'))}}catch(error){if(error.code!=='ENOENT')throw error}
const save=async()=>{await fs.writeFile(statePath+'.tmp',JSON.stringify(state,null,2),{mode:0o600});await fs.rename(statePath+'.tmp',statePath)}
const ask=async question=>{if(!process.stdin.isTTY)throw new Error('Interactive terminal required for pairing');const rl=readline.createInterface({input:process.stdin,output:process.stdout});try{return(await rl.question(question)).trim()}finally{rl.close()}}
const flag=name=>{const index=args.indexOf(name);return index<0?null:args[index+1]}
async function scan(){const cores=await discover();for(const core of cores){const old=state.cores[core.id];if(old&&old.fingerprint!==core.fingerprint)core.identity_changed=true;state.cores[core.id]=core}await save();return cores}
async function pair(cores){
 if(!cores.length){console.log('No LAN Core discovered. Start Core with CORE_LAN_ENABLED=1; UDP 50050 and TLS 8443/5443 must be reachable.');return null}
 cores.forEach((core,index)=>console.log(`${index+1}. ${core.name} ${core.host} [${core.id}] fingerprint ${core.fingerprint}${core.identity_changed?' CHANGED':''}`))
 const selected=flag('--core')?cores.find(core=>core.id===flag('--core')):cores[Number(await ask('Choose Core number (Enter skips pairing): '))-1]
 if(!selected)return null
 if(selected.identity_changed)throw new Error('Core identity changed; investigate before pairing')
 if(state.pairings[selected.id])return {...selected,...state.pairings[selected.id]}
 if((await ask(`Pair with ${selected.name} (${selected.host})? [y/N] `)).toLowerCase()!=='y')return null
 const request=await pinnedRequest(selected,'/api/pairing/request',{name:os.hostname()})
 console.log(`Pairing code: ${request.code}. On the Core computer open Settings → Devices and approve this same code. Waiting up to five minutes.`)
 const deadline=Date.now()+300000
 while(Date.now()<deadline){await new Promise(resolve=>setTimeout(resolve,1500));const result=await pinnedRequest(selected,'/api/pairing/status',{id:request.id,secret:request.secret});if(result.approved){
  const cert=path.join(home,`core-${selected.id}.crt`);await fs.writeFile(cert,result.certificate,{mode:0o600})
  state.pairings[selected.id]={token:result.token,certificate:cert,server_name:result.server_name};await save();return {...selected,...state.pairings[selected.id]}
 }}throw new Error('Pairing timed out')
}
async function configure(record,core){
 const env={}
 if(core){const interfaces=Object.values(os.networkInterfaces()).flat().filter(value=>value&&value.family==='IPv4'&&!value.internal);const address=flag('--advertise')||interfaces.find(value=>value.address.split('.').slice(0,3).join('.')===core.host.split('.').slice(0,3).join('.'))?.address
  if(!address)throw new Error('Cannot determine callback address; pass --advertise <LAN-IP>')
  Object.assign(env,{CORE_ADDRESS:`${core.host}:${core.grpc_port}`,CORE_HTTP_ADDR:`https://${core.host}:${core.http_port}`,CORE_PAIR_TOKEN:core.token,CORE_TLS_CA:core.certificate,CORE_TLS_NAME:core.server_name,NODE_EXTRA_CA_CERTS:core.certificate,AGENT_ADDRESS:`${address}:50054`,AGENT_BIND_HOST:'0.0.0.0',MOCR_ADDRESS:`${core.host}:${core.grpc_port}`})
 }
 if(record.name==='@razuresoft/0kay'||record.name==='@razuresoft/0kay-core')env.CORE_LAN_ENABLED='1'
 await fs.writeFile(path.join(record.repositoryRoot,'runtime-env.json'),JSON.stringify(env,null,2),{mode:0o600})
}
try{
 switch(args[0]){
 case 'discover':console.log(JSON.stringify(await scan(),null,2));break
 case 'cores':console.log(JSON.stringify(state.cores,null,2));break
 case 'install':{
  const cores=await scan(); // Mandatory discovery before every install, even offline/local.
  const name=args[1];if(!name)throw new Error('Usage: 0kay-pm install @razuresoft/0kay-agent')
  const core=args.includes('--no-pair')?null:await pair(cores)
  console.log(`Installing ${name}. Package manifests run build/install commands from the selected repository.`)
  const record=await installPackage(name,{home,source:flag('--source'),proxy:args.includes('--proxy')},state)
  await configure(record,core);await save();console.log(`Installed ${record.name}.${record.start||record.modules.length?` Start: 0kay-pm start ${record.name}`:' Library package; no standalone process.'}`);break
 }
 case 'start':{
  const record=state.installed[args[1]];if(!record)throw new Error('Package not installed')
  const env=JSON.parse(await fs.readFile(path.join(record.repositoryRoot,'runtime-env.json'),'utf8'))
  if(record.modules.length){await Promise.all(record.modules.map(async relative=>{const manifestPath=within(record.repositoryRoot,relative);const manifest=validateManifest(JSON.parse(await fs.readFile(manifestPath,'utf8')));if(manifest.start)await run(manifest.start,path.dirname(manifestPath),env)}))}
  else if(record.start)await run(record.start,record.cwd,env);else throw new Error('Package has no start command')
  break
 }
 default:console.log('0kay-pm install <package> [--proxy] [--source <checkout>] [--no-pair]\n0kay-pm discover\n0kay-pm cores\n0kay-pm start <package>')
 }
}catch(error){console.error(error.message);process.exitCode=1}
