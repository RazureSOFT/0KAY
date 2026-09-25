import fs from 'node:fs/promises'
import path from 'node:path'
import {spawn} from 'node:child_process'
import {randomUUID} from 'node:crypto'
import {existsSync} from 'node:fs'

export const packages={
 '@razuresoft/0kay':{repository:'https://github.com/RazureSOFT/0KAY.git',manifest:'manifest.json'},
 '@razuresoft/0kay-agent':{repository:'https://github.com/RazureSOFT/0KAY-agent.git',manifest:'manifest.json'},
 '@razuresoft/0kay-core':{repository:'https://github.com/RazureSOFT/0KAY.git',manifest:'core/manifest.json'},
 '@razuresoft/0kay-life':{repository:'https://github.com/RazureSOFT/0KAY.git',manifest:'life/manifest.json'},
 '@razuresoft/0kay-mocr':{repository:'https://github.com/RazureSOFT/0KAY.git',manifest:'mocr/manifest.json'},
 '@razuresoft/0kay-mcp':{repository:'https://github.com/RazureSOFT/0KAY.git',manifest:'mcp/manifest.json'},
 '@razuresoft/0kay-webui':{repository:'https://github.com/RazureSOFT/0KAY.git',manifest:'webui/manifest.json'},
}
export function within(root,relative){const value=path.resolve(root,relative);if(value!==root&&!value.startsWith(root+path.sep))throw new Error('Manifest path escapes package');return value}
export function validateManifest(value){
 if(value.schema!==1||typeof value.name!=='string'||!/^@razuresoft\/[a-z0-9-]+$/.test(value.name)||typeof value.version!=='string')throw new Error('Invalid manifest identity/schema')
 for(const command of [...(value.install||[]),...(value.start?[value.start]:[]),...(value.ui?.build||[])])if(!Array.isArray(command)||!command.length||command.some(arg=>typeof arg!=='string'||/[\r\n\0]/.test(arg)))throw new Error('Manifest commands must be argument arrays')
 if(value.ui!=null){
  if(typeof value.ui!=='object'||value.ui===null||Array.isArray(value.ui))throw new Error('Manifest ui must be an object')
  if(value.ui.dir!=null&&(typeof value.ui.dir!=='string'||/[\r\n\0]/.test(value.ui.dir)))throw new Error('Manifest ui.dir must be a path string')
  if(value.ui.plugin!=null&&(!/^[A-Za-z0-9_-]{1,64}$/.test(value.ui.plugin)))throw new Error('Manifest ui.plugin is invalid')
  if(value.ui.dist!=null&&(typeof value.ui.dist!=='string'||/[\r\n\0]/.test(value.ui.dist)))throw new Error('Manifest ui.dist must be a path string')
  if(value.ui.build!=null&&!Array.isArray(value.ui.build))throw new Error('Manifest ui.build must be argv arrays')
 }
 return value
}
/** Copy a built plugin UI bundle into CORE_DATA_DIR/plugin-ui/{name} (atomic replace). */
export async function publishPluginUI(sourceDir,pluginName,dataDir){
 if(!/^[A-Za-z0-9_-]{1,64}$/.test(pluginName))throw new Error('Invalid plugin-ui name')
 const root=path.resolve(dataDir||process.env.CORE_DATA_DIR||'data')
 const dest=path.join(root,'plugin-ui',pluginName)
 const staging=dest+'.install-'+randomUUID()
 await fs.mkdir(path.dirname(dest),{recursive:true})
 await fs.cp(sourceDir,staging,{recursive:true})
 await fs.rm(dest,{recursive:true,force:true})
 await fs.rename(staging,dest)
 return dest
}
export function run(command,cwd,env={}){return new Promise((resolve,reject)=>{
 let [executable,...args]=command
 // npm.cmd needs a shell on Windows; manifest arguments cannot inject shell operators.
 let shell=process.platform==='win32'&&['npm','npx'].includes(executable)
 if(shell){const cli=path.join(path.dirname(process.execPath),'node_modules','npm','bin',`${executable}-cli.js`);if(existsSync(cli)){args=[cli,...args];executable=process.execPath;shell=false}}
 if(shell&&args.some(arg=>/[&|<>^]/.test(arg)))throw new Error('Unsupported shell operator in npm arguments')
 const child=spawn(executable,args,{cwd,env:{...process.env,...env},stdio:'inherit',shell})
 child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(`${executable} exited ${code}`)))
})}
export async function installPackage(name,options,state,stack=[]) {
 if(stack.includes(name))throw new Error(`Dependency cycle: ${[...stack,name].join(' -> ')}`)
 if(state.installed[name]&&!options.reinstall)return state.installed[name]
 const spec=packages[name];if(!spec)throw new Error(`Unknown package ${name}`)
 const destination=path.join(options.home,'packages',name.split('/')[1]);await fs.mkdir(path.dirname(destination),{recursive:true})
 if(await fs.stat(destination).then(()=>true,()=>false))throw new Error(`Destination already exists: ${destination}; existing work is never overwritten`)
 const staging=destination+'.install-'+randomUUID();await fs.mkdir(staging,{recursive:true})
 try {
  if(options.source) await fs.cp(path.resolve(options.source),staging,{recursive:true,filter:source=>!['.git','node_modules','dist','data','__pycache__'].includes(path.basename(source))&&!source.endsWith('.log')&&!source.endsWith('.exe')})
  else {
   let url=spec.repository
   if(options.proxy)url='https://gh-proxy.com/'+url
   await run(['git','clone','--depth','1',url,staging],options.home)
  }
  const manifestPath=within(staging,spec.manifest)
  const manifest=validateManifest(JSON.parse(await fs.readFile(manifestPath,'utf8')))
  if(manifest.name!==name)throw new Error('Package identity does not match requested package')
  for(const repository of manifest.repositories||[]) {
   const target=within(staging,repository.path)
   if(!await fs.stat(path.join(target,'manifest.json')).then(()=>true,()=>false)){
    const spec=packages[repository.package];if(!spec||spec.repository!==repository.url)throw new Error('Unrecognized module repository')
    await run(['git','clone','--depth','1',options.proxy?'https://gh-proxy.com/'+repository.url:repository.url,target],options.home)
   }
  }
  // A child manifest supplies build commands and cwd; repository layout stays intact.
  for(const dependency of manifest.dependencies||[]){
   const siblingSource=options.source&&dependency==='@razuresoft/0kay-mcp'?path.resolve(options.source,'..'):null
   await installPackage(dependency,{...options,source:siblingSource},state,[...stack,name])
  }
  for(const child of manifest.modules||[]) {
   const childPath=within(staging,child)
   const module=validateManifest(JSON.parse(await fs.readFile(childPath,'utf8')))
   for(const command of module.install||[])await run(command,path.dirname(childPath))
  }
  if(name==='@razuresoft/0kay-agent') {
   const mcp=state.installed['@razuresoft/0kay-mcp'];if(!mcp)throw new Error('MCP dependency missing')
   // Agent expects sibling mcp and proto. Keep them within its installed package.
   await fs.cp(mcp.repositoryRoot,staging+'/platform',{recursive:true,filter:source=>!['.git','node_modules','data'].includes(path.basename(source))})
   await fs.mkdir(path.join(staging,'agent'),{recursive:true})
   for(const entry of await fs.readdir(staging)){if(entry==='platform'||entry==='agent')continue;await fs.rename(path.join(staging,entry),path.join(staging,'agent',entry))}
   await fs.rename(path.join(staging,'platform','mcp'),path.join(staging,'mcp'))
   await fs.rename(path.join(staging,'platform','proto'),path.join(staging,'proto'))
   await run(['npm','ci'],path.join(staging,'mcp'));await run(['npm','run','build'],path.join(staging,'mcp'))
  }
const cwd=name==='@razuresoft/0kay-agent'?path.join(staging,'agent'):path.dirname(manifestPath)
   for(const command of manifest.install||[])await run(command,cwd)
   if(manifest.ui){
    const uiRoot=within(staging,manifest.ui.dir||'.')
    for(const command of manifest.ui.build||[])await run(command,uiRoot)
    const dist=path.resolve(uiRoot,manifest.ui.dist||'dist')
    if(!await fs.stat(dist).then(()=>true,()=>false))throw new Error(`Plugin UI dist missing: ${dist}`)
    const pluginName=manifest.ui.plugin||name.split('/')[1]
    await publishPluginUI(dist,pluginName,options.coreData)
   }
   await fs.rename(staging,destination)
   const record={name,version:manifest.version,repository:spec.repository,repositoryRoot:destination,cwd:path.join(destination,path.relative(staging,cwd)),start:manifest.start||null,modules:manifest.modules||[],installed_at:new Date().toISOString()}
  // Editable Python installs embed absolute paths. Rebind after atomic promotion.
  if(name==='@razuresoft/0kay-life')await run(['python','-m','pip','install','-e','.'],record.cwd)
  if(name==='@razuresoft/0kay'&&(manifest.modules||[]).includes('life/manifest.json'))await run(['python','-m','pip','install','-e','.'],path.join(destination,'life'))
  state.installed[name]=record;return record
 }catch(error){await fs.rm(staging,{recursive:true,force:true});throw error}
}
