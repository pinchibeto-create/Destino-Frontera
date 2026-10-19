import {createHash,createHmac,randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
import {getStore} from '@netlify/blobs';

const COOKIE='df_session';
const USER='Homero G';
const HOURS=8;
const value=(k)=>globalThis.Netlify?.env?.get(k)||process.env[k]||'';
const auth=()=>getStore({name:'df-auth',consistency:'strong'});
export const catalogStore=()=>getStore({name:'df-catalog',consistency:'strong'});
export const photoStore=()=>getStore({name:'df-media',consistency:'strong'});
export const respond=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
export const fail=(error,status=400)=>respond({error},status);
const equal=(a,b)=>{const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&timingSafeEqual(x,y)};
const fingerprint=(hash)=>createHash('sha256').update(hash).digest('hex').slice(0,24);
const hashPassword=(password)=>{const salt=randomBytes(16).toString('hex');return `scrypt:${salt}:${scryptSync(password,Buffer.from(salt,'hex'),64).toString('hex')}`};
const compare=(password,hash)=>{const [type,salt,h]=String(hash).split(':');if(type!=='scrypt'||!/^[a-f0-9]{32}$/.test(salt||'')||!/^[a-f0-9]{128}$/.test(h||''))return false;return equal(scryptSync(password,Buffer.from(salt,'hex'),64).toString('hex'),h)};
export async function credential(){const changed=await auth().get('credential',{type:'json'});return changed?.hash?{hash:changed.hash,change:false}:{hash:value('DF_ADMIN_HASH'),change:true}}
const secret=()=>value('DF_SESSION_SECRET');
const mac=(x)=>createHmac('sha256',secret()).update(x).digest('hex');
export const clearCookie=`${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
export function makeCookie(hash){if(secret().length<32)throw Error('Sesiones sin configurar');const end=Math.floor(Date.now()/1000)+3600*HOURS,plain=`v1.${end}.${fingerprint(hash)}`;return `${COOKIE}=${plain}.${mac(plain)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${3600*HOURS}`}
export async function getSession(request){if(secret().length<32)return null;const cookie=(request.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);if(!cookie)return null;const parts=cookie.split('.');if(parts.length!==4||parts[0]!=='v1'||!/^[0-9]{10}$/.test(parts[1])||!/^[a-f0-9]{24}$/.test(parts[2])||!/^[a-f0-9]{64}$/.test(parts[3]))return null;const exp=Number(parts[1]);if(exp<Date.now()/1000||exp>Date.now()/1000+HOURS*3600+120)return null;if(!equal(parts[3],mac(parts.slice(0,3).join('.'))))return null;const cred=await credential();return equal(parts[2],fingerprint(cred.hash))?{user:USER,change:cred.change}:null}
export const correctLogin=async(username,password)=>username===USER&&typeof password==='string'&&password.length<=120&&compare(password,(await credential()).hash);
export const validPassword=p=>typeof p==='string'&&p.length>=12&&p.length<=120&&p.trim()===p&&p.toLowerCase()!==USER.toLowerCase();
export async function updatePassword(password){const hash=hashPassword(password);await auth().setJSON('credential',{hash,changedAt:new Date().toISOString()});return hash}
export const sameOrigin=request=>request.headers.get('origin')===new URL(request.url).origin;
export const validateURL=u=>typeof u==='string'&&(/^\/images\/destino-frontera\/[a-z0-9_./-]+\.(?:png|jpg|jpeg|webp)$/i.test(u)||/^\/api\/media\/[0-9a-f-]{36}$/.test(u));
const clean=(value,n=100)=>typeof value==='string'?value.trim().slice(0,n):'';
export function validItem(row,type){const id=clean(row?.id,75),title=clean(row?.title,110);if(!/^[a-z0-9-]{3,75}$/.test(id)||!title)throw Error('Falta el nombre o identificador');const images=Array.isArray(row?.images)?row.images.filter(validateURL).slice(0,24):[];if(!images.length)throw Error('Agrega una fotografía a cada publicación');const basic={id,title,description:clean(row.description,700),images,published:row.published!==false};return type==='destination'?{...basic,region:clean(row.region,120),category:['lagos','cascadas','selva','cultura','otros'].includes(row.category)?row.category:'otros'}:{...basic,subtitle:clean(row.subtitle,110)} }
export const starter={destinations:[
{id:'montebello',title:'Cinco Lagos y Montebello',region:'REGIÓN LAGOS DE MONTEBELLO',category:'lagos',images:['/images/destino-frontera/01_paisajes_destinos/02_montebello.webp'],description:'',published:true},
{id:'las-nubes',title:'Las Nubes',region:'SELVA Y RÍOS',category:'cascadas',images:['/images/destino-frontera/01_paisajes_destinos/04_las_nubes.webp'],description:'',published:true},
{id:'miramar',title:'Laguna Miramar',region:'NATURALEZA PROFUNDA',category:'selva',images:['/images/destino-frontera/01_paisajes_destinos/05_laguna_miramar.webp'],description:'',published:true},
{id:'lachua',title:'Laguna Lachuá',region:'AGUA Y BIODIVERSIDAD',category:'lagos',images:['/images/destino-frontera/01_paisajes_destinos/06_lachua.webp'],description:'',published:true}],experiences:[
{id:'artesania',title:'Manos que cuentan historias',subtitle:'TRADICIONES VIVAS',description:'Acércate a los oficios, técnicas y creaciones que mantienen viva la identidad de cada comunidad.',images:['/images/destino-frontera/02_experiencias/01_alfareria_ollas_amatenango.webp'],published:true},
{id:'cafe',title:'Del campo a la experiencia',subtitle:'SABORES CON ORIGEN',description:'Explora el valor de los ingredientes, los cultivos y las historias detrás de lo que llega a nuestra mesa.',images:['/images/destino-frontera/02_experiencias/03_cafe_secado_chiapas.webp'],published:true},
{id:'senderismo',title:'Caminos para desconectar',subtitle:'AVENTURA CON CALMA',description:'Senderos, paisajes y momentos para escuchar lo que la naturaleza tiene que decir.',images:['/images/destino-frontera/02_experiencias/07_grupo_senderismo_palenque.webp'],published:true}],heroImage:'/images/destino-frontera/01_paisajes_destinos/01_hero_montebello.webp'};
export async function readCatalog(){return await catalogStore().get('catalog',{type:'json'})||structuredClone(starter)}
