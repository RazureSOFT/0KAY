import test from 'node:test';
import assert from 'node:assert/strict';
import { McpManager } from './index.js';
test('HTTP MCP accepts empty notification and retains session identity',async()=>{
 const original=globalThis.fetch;const calls:string[]=[];
 globalThis.fetch=async (_url,options)=>{
  const body=JSON.parse(String(options?.body));calls.push(body.method);
  if(body.method!=='initialize') assert.equal(new Headers(options?.headers).get('mcp-session-id'),'session-one');
  if(body.method==='notifications/initialized')return new Response(null,{status:202});
  return new Response(JSON.stringify({jsonrpc:'2.0',id:body.id,result:body.method==='tools/list'?{tools:[]}:{protocolVersion:'2024-11-05'}}),{headers:{'mcp-session-id':'session-one'}});
 };
 try {const manager=new McpManager();manager.configure([{id:'test',transport:'http',url:'http://mock'}]);assert.deepEqual(await manager.refresh(),[]);assert.deepEqual(calls,['initialize','notifications/initialized','tools/list']);await manager.close()}
 finally {globalThis.fetch=original}
});
