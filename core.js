const str=(v,max)=>typeof v==='string'&&v.length<=max;
const unique=arr=>new Set(arr).size===arr.length;
const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
export function validateNotebook(n){
 if(!n||n.schemaVersion!==1||!Array.isArray(n.profiles)||n.profiles.length>5||!unique(n.profiles.map(p=>p?.id)))return false;
 if(n.activeProfileId!==null&&!n.profiles.some(p=>p.id===n.activeProfileId))return false;
 return n.profiles.every(p=>p&&str(p.id,80)&&p.id.length>0&&str(p.gameTitle,60)&&p.gameTitle.trim().length>0&&str(p.label,40)&&Array.isArray(p.entries)&&p.entries.length>0&&p.entries.length<=100&&unique(p.entries.map(e=>e?.id))&&p.entries.every(e=>e&&str(e.id,80)&&e.id.length>0&&str(e.playedAt,10)&&validDate(e.playedAt)&&str(e.lastAction,4000)&&str(e.memo,4000)&&str(e.updatedAt,40)&&!Number.isNaN(Date.parse(e.updatedAt))&&Array.isArray(e.nextTasks)&&e.nextTasks.length<=20&&unique(e.nextTasks.map(t=>t?.id))&&e.nextTasks.every(t=>t&&str(t.id,80)&&str(t.text,200)&&typeof t.done==='boolean')));
}
export function parseBackup(text){if(typeof text!=='string'||new TextEncoder().encode(text).length>1024*1024)throw new Error('백업은 1MB 이하 JSON이어야 합니다.');let n;try{n=JSON.parse(text);}catch{throw new Error('JSON 파일을 읽을 수 없습니다.');}if(!validateNotebook(n))throw new Error('지원하지 않는 버전이거나 기록 형식·개수·길이가 올바르지 않습니다.');return n;}
export function createEntry(id,date=new Date()){const day=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;return{id,playedAt:day,lastAction:'',nextTasks:[],memo:'',updatedAt:date.toISOString()};}
export function emptyNotebook(){return{schemaVersion:1,profiles:[],activeProfileId:null};}
