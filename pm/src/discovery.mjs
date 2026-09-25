import dgram from 'node:dgram'
import os from 'node:os'
import {randomUUID} from 'node:crypto'
import https from 'node:https'

export async function discover(timeout=1600) {
 const socket=dgram.createSocket('udp4'), nonce=randomUUID(), found=new Map()
 await new Promise((resolve,reject)=>{socket.once('error',reject);socket.bind(0,'0.0.0.0',resolve)})
 socket.setBroadcast(true)
 socket.on('message',(raw,remote)=>{try{const value=JSON.parse(raw);if(value.protocol==='0kay-core-v1'&&value.nonce===nonce&&/^[a-f0-9]{64}$/.test(value.fingerprint)&&Number.isInteger(value.http_port)&&Number.isInteger(value.grpc_port))found.set(value.id,{...value,host:remote.address,last_seen:new Date().toISOString()})}catch{}})
 const targets=new Set(['127.0.0.1','255.255.255.255'])
 for(const entries of Object.values(os.networkInterfaces()))for(const entry of entries||[])if(entry.family==='IPv4'&&!entry.internal){const ip=entry.address.split('.').map(Number),mask=entry.netmask.split('.').map(Number);targets.add(ip.map((v,i)=>v|(~mask[i]&255)).join('.'))}
 const payload=Buffer.from(JSON.stringify({protocol:'0kay-discover-v1',nonce}))
 for(const address of targets) socket.send(payload,50050,address,()=>{})
 await new Promise(resolve=>setTimeout(resolve,timeout));socket.close()
 return [...found.values()].sort((a,b)=>a.id.localeCompare(b.id))
}
export function pinnedRequest(core,path,body,token='') {
 return new Promise((resolve,reject)=>{
  const request=https.request({host:core.host,port:core.http_port,path,method:'POST',rejectUnauthorized:false,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},timeout:10000},response=>{
   let data='';response.on('error',reject);response.on('data',chunk=>{data+=chunk;if(data.length>1048576)response.destroy(new Error('response too large'))});response.on('end',()=>{if(response.statusCode>=400){reject(new Error(`${response.statusCode}: ${data}`));return}try{resolve(JSON.parse(data))}catch(error){reject(error)}})
  })
  request.on('socket',socket=>socket.once('secureConnect',()=>{
   const certificate=socket.getPeerCertificate();const fingerprint=(certificate.fingerprint256||'').replaceAll(':','').toLowerCase()
   if(fingerprint!==core.fingerprint)request.destroy(new Error('Core certificate fingerprint changed'))
  }))
  request.on('error',reject);request.on('timeout',()=>request.destroy(new Error('Core request timed out')));request.end(JSON.stringify(body))
 })
}
