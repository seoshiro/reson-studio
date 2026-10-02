export const finishes = ['walnut','oak','ink'] as const;
export const metals = ['copper','silver','graphite'] as const;
export interface Config { shape:'compact'|'tall'; finish:typeof finishes[number]; metal:typeof metals[number]; grille:'open'|'slats'; base:'feet'|'plinth'; width:number; depth:number }
export interface Saved { id:string; name:string; config:Config; image?:string }
export interface Document { version:1; current:Config; designs:Saved[] }
export const defaults:Config = {shape:'compact',finish:'walnut',metal:'copper',grille:'open',base:'feet',width:240,depth:280};
const object = (v:unknown):v is Record<string,unknown> => !!v && typeof v==='object' && !Array.isArray(v);
export function validateConfig(v:unknown):Config {
  if(!object(v)||Object.keys(v).sort().join(',')!=='base,depth,finish,grille,metal,shape,width')throw Error('config');
  if(!['compact','tall'].includes(String(v.shape))||!finishes.includes(v.finish as Config['finish'])||!metals.includes(v.metal as Config['metal'])||!['open','slats'].includes(String(v.grille))||!['feet','plinth'].includes(String(v.base)))throw Error('config');
  if(typeof v.width!=='number'||typeof v.depth!=='number'||!Number.isInteger(v.width)||!Number.isInteger(v.depth)||v.width<210||v.width>300||v.depth<230||v.depth>340||v.width%10||v.depth%10)throw Error('dimensions');
  return {shape:v.shape as Config['shape'],finish:v.finish as Config['finish'],metal:v.metal as Config['metal'],grille:v.grille as Config['grille'],base:v.base as Config['base'],width:v.width,depth:v.depth};
}
export function cleanName(value:unknown):string {
  if(typeof value!=='string'||!value.trim()||value.trim().length>40||[...value].some(c=>c.charCodeAt(0)<32||c.charCodeAt(0)===127))throw Error('name');
  return value.trim();
}
export function parseDocument(text:string):Document {
  if(text.length>30000)throw Error('size');
  const v:unknown=JSON.parse(text);
  if(!object(v)||v.version!==1||!Array.isArray(v.designs)||v.designs.length>6)throw Error('document');
  const names=new Set<string>();
  const designs=v.designs.map((d:unknown,i:number)=>{
    if(!object(d))throw Error('design');
    const name=cleanName(d.name),key=name.toLocaleLowerCase();
    if(names.has(key))throw Error('duplicate');names.add(key);
    return {id:`import-${i}`,name,config:validateConfig(d.config)};
  });
  return {version:1,current:validateConfig(v.current),designs};
}
export function exportDocument(current:Config,designs:Saved[]):string {
  return JSON.stringify({version:1,current,designs:designs.map(({name,config})=>({name,config}))},null,2);
}
export const height = (c:Config)=>c.shape==='compact'?400:580;
export const equal = (a:Config,b:Config)=>JSON.stringify(a)===JSON.stringify(b);
export function explosion(progress:number):number {
  const t=Math.max(0,Math.min(1,progress));
  const x=t<.22?t/.22:t<.73?1:(1-t)/.27;
  return x*x*(3-2*x);
}
