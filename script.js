const KEY='learnhub-day5';
const L=(t,m,b,s)=>({id:Math.random().toString(36).slice(2,9),title:t,mins:m,body:b,sec:s||'General'});
const C=(id,title,cat,desc,n,ls)=>({id,title,cat,desc,published:true,students:n,lessons:ls.map(x=>L(x[1],x[2],x[3],x[0]))});
const seed={role:'student',enrol:{},courses:[
C('c1','Python','Programming','Start programming with one of the easiest and most popular languages. Learn to store data, make decisions and repeat tasks.',420,[
['Getting started','Installing Python and your first program',8,'Install Python and run your first program.\n\nTask: print a hello message with your name.'],
['Getting started','Variables and user input',9,'Variables store values. input() reads what the user types.\n\nTask: ask for a name and age and print them.'],
['Getting started','Conditions (if, elif, else)',10,'Make your program choose between options.\n\nTask: check whether a number is even or odd.'],
['Going further','Loops',11,'Repeat actions with for and while loops.\n\nTask: print the numbers 1 to 10.'],
['Going further','Lists and dictionaries',12,'Lists hold ordered values; dictionaries look values up by key.\n\nTask: store five marks in a list and print the total.'],
['Going further','Functions',10,'Functions package code so you can reuse it.\n\nTask: write a function that adds two numbers.']]),
C('c2','C Language','Programming','Learn the language behind operating systems and embedded devices. It shows how a computer really works.',310,[
['Basics','Structure of a C program',10,'Every C program starts in main(). Learn headers, statements and semicolons.'],
['Basics','Data types and variables',12,'int, float and char store different kinds of values.'],
['Basics','Operators and input/output',13,'Use printf and scanf and the arithmetic operators.\n\nTask: add and subtract two numbers.'],
['Control and data','Decision making and loops',14,'if, else, for and while let your program decide and repeat.'],
['Control and data','Arrays and strings',14,'Arrays store many values of one type; strings are arrays of characters.'],
['Control and data','Functions',12,'Split a program into reusable functions.']]),
C('c3','Linux Operating System','Systems','Get comfortable with Linux, the system used on most servers and by most developers. Learn the terminal with confidence.',275,[
['Getting started','What is Linux and why developers use it',8,'Linux is a free, open operating system that powers most servers.'],
['Getting started','The terminal and basic commands',10,'Move around with cd and ls, and learn pwd and man.'],
['Working with files','Files and folders (create, copy, move, delete)',11,'Use mkdir, touch, cp, mv and rm.\n\nTask: create a folder with three files, rename one and delete another.'],
['Working with files','Permissions and users',10,'Read, write and execute permissions control who can do what.'],
['Working with files','Installing software and basic troubleshooting',11,'Install packages with a package manager and read error messages.']]),
C('c4','Web Development','Web','Learn how websites are built. Start with HTML for structure and CSS for design, then take a first look at JavaScript.',530,[
['HTML basics','How the web works',8,'Browsers ask servers for pages and show the HTML they receive.'],
['HTML basics','HTML: headings, paragraphs, links and images',10,'The building blocks of every page.'],
['HTML basics','HTML: lists, tables and forms',10,'Show data in lists and tables and collect input with forms.'],
['Styling and interactivity','CSS: colours, fonts and the box model',11,'Every element is a box with content, padding, border and margin.'],
['Styling and interactivity','CSS: Flexbox and Grid layouts',12,'Arrange items in rows, columns and grids.'],
['Styling and interactivity','Introduction to JavaScript',9,'JavaScript makes pages interactive.']]),
C('c5','Communication Skills','Career','Learn to speak, write and listen clearly. Useful for class presentations, interviews and working in a team.',390,[
['Speaking','Why communication matters',7,'Clear communication helps in exams, interviews and teams.'],
['Speaking','Speaking with confidence',9,'Plan your points, slow down and pause.'],
['Speaking','Body language and eye contact',9,'Posture and eye contact change how your message is received.'],
['Writing and listening','Writing a clear email',10,'Short subject, clear request, polite tone.'],
['Writing and listening','Active listening',10,'Listen fully, ask questions and repeat key points back.']])
]};
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!S.courses)S=seed;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=s=>document.querySelector(s);
const get=id=>S.courses.find(c=>c.id===id);
const done=c=>(S.enrol[c.id]||[]).filter(i=>c.lessons.some(l=>l.id===i));
const pct=c=>c.lessons.length?Math.round(done(c).length/c.lessons.length*100):0;
const mins=c=>c.lessons.reduce((a,l)=>a+(+l.mins||0),0);
let V={n:'catalog'},Q={q:'',cat:'All'};
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}

function render(){
  const tabs=[['catalog','Browse'],['learning','My learning']];
  $('#nav').innerHTML=tabs.map(t=>`<button data-a="go" data-v="${t[0]}" class="${V.n===t[0]?'on':''}">${t[1]}</button>`).join('');
  $('#app').innerHTML=({catalog,learning,player})[V.n]();
}

function cards(){
  const q=Q.q.trim().toLowerCase();
  const list=S.courses.filter(c=>c.published&&(Q.cat==='All'||c.cat===Q.cat)&&(!q||(c.title+' '+c.desc+' '+c.cat).toLowerCase().includes(q)));
  if(!list.length)return `<div class="empty">No courses match your search.</div>`;
  return `<div class="grid">${list.map(c=>{const en=S.enrol[c.id];return `<div class="card"><span class="tag">${esc(c.cat)}</span><h2>${esc(c.title)}</h2><p>${esc(c.desc)}</p>
  <div class="meta">${c.lessons.length} lessons · ${mins(c)} min · ${(c.students+(en?1:0)).toLocaleString()} students</div>
  <div class="row">${en?`<button class="btn" data-a="open" data-v="${c.id}">Continue</button><span class="meta">${pct(c)}% done</span>`:`<button class="btn" data-a="enrol" data-v="${c.id}">Enrol free</button>`}</div></div>`}).join('')}</div>`;
}

function catalog(){
  const cats=['All',...new Set(S.courses.filter(c=>c.published).map(c=>c.cat))];
  return `<div class="hero"><h1>Learn new skills step by step</h1><p class="sub">Search a course, enrol free and track your progress.</p></div>
  <div class="search"><input id="q" type="search" placeholder="Search courses…" aria-label="Search courses" value="${esc(Q.q)}">
  <select id="cat" aria-label="Category">${cats.map(c=>`<option ${c===Q.cat?'selected':''}>${esc(c)}</option>`).join('')}</select></div>
  <div id="grid">${cards()}</div>`;
}

function learning(){
  const list=S.courses.filter(c=>S.enrol[c.id]);
  return `<h1>My learning</h1><p class="sub">Pick up where you left off.</p>
  ${list.length?`<div class="grid">${list.map(c=>`<div class="card"><h2>${esc(c.title)}</h2><div class="bar"><b style="width:${pct(c)}%"></b></div>
  <div class="meta">${done(c).length} of ${c.lessons.length} lessons complete · ${pct(c)}%</div>
  <div class="row"><button class="btn" data-a="open" data-v="${c.id}">${pct(c)===100?'Review':'Continue'}</button></div></div>`).join('')}</div>`:`<div class="empty">You haven't enrolled in anything yet.<br><br><button class="btn" data-a="go" data-v="catalog">Browse courses</button></div>`}`;
}

function player(){
  const c=get(V.id);if(!c)return catalog();
  const d=done(c),i=Math.min(V.l||0,c.lessons.length-1),ls=c.lessons[i],isDone=d.includes(ls.id);
  return `<button class="btn alt sm" data-a="go" data-v="learning">All my courses</button>
  <h1 style="margin-top:14px">${esc(c.title)}</h1>
  <div class="bar" style="margin:10px 0 22px"><b style="width:${pct(c)}%"></b></div>
  ${pct(c)===100?`<div class="win">Course complete. Every lesson is done.</div>`:''}
  <div class="player"><div class="side">${c.lessons.map((l,k)=>(k===0||l.sec!==c.lessons[k-1].sec?`<div class="sec">${esc(l.sec||'General')}</div>`:'')+`<button class="les ${k===i?'on':''} ${d.includes(l.id)?'done':''}" data-a="lesson" data-v="${k}"><span class="dot">${d.includes(l.id)?'✓':''}</span><span>${esc(l.title)}<br><span class="meta">${l.mins} min</span></span></button>`).join('')}</div>
  <div class="lesson"><div class="meta">Lesson ${i+1} of ${c.lessons.length}</div><h2 style="font-size:1.6rem">${esc(ls.title)}</h2><p>${esc(ls.body)}</p>
  <div class="row" style="margin-top:20px">
   ${i>0?`<button class="btn alt" data-a="lesson" data-v="${i-1}">Previous</button>`:''}
   <button class="btn" data-a="complete" data-v="${i}">${isDone?(i<c.lessons.length-1?'Next lesson':'Done'):(i<c.lessons.length-1?'Mark complete and continue':'Mark complete')}</button>
   ${isDone?`<button class="btn alt" data-a="undo" data-v="${i}">Mark incomplete</button>`:''}</div></div></div>`;
}

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');if(!b)return;
  const a=b.dataset.a,v=b.dataset.v,c=V.id&&get(V.id);
  if(a==='home')V={n:'catalog'};
  else if(a==='go')V={n:v};
  else if(a==='enrol'){S.enrol[v]=[];V={n:'player',id:v,l:0};toast('Enrolled')}
  else if(a==='open'){const k=get(v),dn=done(k);V={n:'player',id:v,l:Math.max(0,k.lessons.findIndex(l=>!dn.includes(l.id)))}}
  else if(a==='lesson')V.l=+v;
  else if(a==='complete'){const i=+v,id=c.lessons[i].id;S.enrol[c.id]=S.enrol[c.id]||[];if(!S.enrol[c.id].includes(id))S.enrol[c.id].push(id);if(i<c.lessons.length-1)V.l=i+1}
  else if(a==='undo'){S.enrol[c.id]=S.enrol[c.id].filter(x=>x!==c.lessons[+v].id)}
  save();render();window.scrollTo(0,0);
});
document.addEventListener('input',e=>{if(e.target.id==='q'){Q.q=e.target.value;$('#grid').innerHTML=cards()}});
document.addEventListener('change',e=>{if(e.target.id==='cat'){Q.cat=e.target.value;$('#grid').innerHTML=cards()}});
render();
