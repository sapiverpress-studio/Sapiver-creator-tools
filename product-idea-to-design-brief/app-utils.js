const ids = ['ideaText','ideaSource','currentMess','who','whatHelp','whereUsed','whenUse','whyCare','useMode','buyerAction','complexity','repeatNeed','printNeed','phoneNeed','valueSentence','nicheText','audienceText','researchNotes','pastProducts','pastPlatforms','preferredMaking','avoidMaking','existingFiles','timeBudget','styleTone','projectName','mustInclude','mustAvoid','firstBuild'];
const checks = ['valEntertainment','valRelaxing','valProblem','valEducation','valPractical','valGift'];
function v(id){const el=document.getElementById(id); return el?String(el.value||'').trim():''}
function checked(id){const el=document.getElementById(id); return !!(el&&el.checked)}
function escapeHtml(s){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function tags(items,strongFirst){
  items=items.filter(Boolean);
  if(!items.length) return '<span class="tag">Waiting for answers</span>';
  return items.map((x,i)=>`<span class="tag ${strongFirst&&i===0?'strong':''}">${escapeHtml(x)}</span>`).join('');
}
const scoringIds = ['ideaText','ideaSource','currentMess','who','whatHelp','whereUsed','whenUse','whyCare','useMode','buyerAction','complexity','repeatNeed','printNeed','phoneNeed','valueSentence','nicheText','audienceText','researchNotes'];
function allText(){
  return scoringIds.map(id=>v(id)).join(' ').toLowerCase();
}
function preferenceText(){
  return ['pastProducts','pastPlatforms','preferredMaking','avoidMaking','existingFiles','timeBudget'].map(id=>v(id)).join(' ').toLowerCase();
}
function valueTypes(){
  const out=[];
  if(checked('valEntertainment')) out.push('Entertainment/fun');
  if(checked('valRelaxing')) out.push('Relaxing/screen-free');
  if(checked('valProblem')) out.push('Problem-solving');
  if(checked('valEducation')) out.push('Educational');
  if(checked('valPractical')) out.push('Practical/time-saving');
  if(checked('valGift')) out.push('Giftable/attractive');
  return out;
}
function scoreProduct(){
  const text=allText();
  const scores={storybook:0,kdp:0,printable:0,website:0,app:0,pod:0,worksheet:0,game:0,guide:0};
  const evidence={storybook:[],kdp:[],printable:[],website:[],app:[],pod:[],worksheet:[],game:[],guide:[]};
  const platformHints={kdp:0,etsy:0,website:0,pod:0};
  const gates={storybook:false,kdp:false,printable:false,website:false,app:false,pod:false,worksheet:false,game:false,guide:false};

  function add(key,n,why){
    if(scores[key]===undefined) return;
    scores[key]+=n;
    if(why && evidence[key].indexOf(why)===-1) evidence[key].push(why);
  }
  function match(words,src){
    src=src||text;
    return words.some(function(w){return src.includes(w)});
  }
  function gate(key,why){
    gates[key]=true;
    if(why && evidence[key].indexOf(why)===-1) evidence[key].push(why);
  }

  if(match(['kdp','amazon'])) platformHints.kdp+=1;
  if(match(['etsy'])) platformHints.etsy+=1;
  if(match(['website','web page','landing page','online'])) platformHints.website+=1;
  if(match(['pod','print-on-demand','printify','printful'])) platformHints.pod+=1;

  const use=v('useMode'), action=v('buyerAction'), print=v('printNeed'), phone=v('phoneNeed'), complexity=v('complexity'), repeat=v('repeatNeed');

  const storyPhrase=match(['story book','storybook','children’s book','childrens book','children book','picture book','bedtime story','illustrated story','parent and child reading']);
  const storyCombo=match(['story','illustrations','illustrated']) && match(['child','children','parent','reading']);
  if(storyPhrase || storyCombo){
    gate('storybook','Story/illustration/child-reading signals');
    gate('kdp','Book-style reading format');
    add('storybook',18,'Storybook or picture-book wording');
    add('kdp',5,'Could become a published book');
  }

  if(match(['book','paperback','journal','planner book','puzzle book','sudoku book','workbook','manuscript','cover']) || print==='Professional print / book print' || action==='Upload it somewhere'){
    gate('kdp','Book/publishing format signal');
    add('kdp',5,'Book, paperback, manuscript, cover or professional print signal');
  }

  if(match(['printable','pdf','download','worksheet','checklist','planner','template','log','tracker','file pack']) || use==='Printed on paper' || action==='Print it' || action==='Download and keep files' || print==='Home printing'){
    gate('printable','Printable/download file signal');
    add('printable',5,'Printable, PDF, download or file-pack signal');
  }

  if(match(['website','free resource','landing page','lead magnet','html','web page']) || platformHints.website>0){
    gate('website','Website/resource signal');
    add('website',5,'Website, lead magnet, HTML or online resource signal');
  }

  const appGate = phone==='Yes, phone-first' || use==='Used on a phone or screen' || action==='Use it interactively' || complexity==='Interactive tool' || match(['app','mobile','interactive','dashboard','calculator','save progress','local storage','web app','online tool']);
  if(appGate){
    gate('app','Buyer-facing interactive/phone/screen signal');
    add('app',6,'Phone-first, interactive, app, dashboard or calculator signal');
  }

  const productionAutomationOnly = match(['generator','generated','automated','automation','script','workflow']);
  if(productionAutomationOnly && appGate){
    add('app',1,'Automation supports app only because buyer-facing app signals are also present');
  }

  if(match(['poster','wall art','mug','shirt','t-shirt','merch','artwork','print-on-demand','printify','printful']) || use==='Displayed as artwork' || action==='Display it' || print==='POD / merchandise print' || complexity==='Artwork/design set'){
    gate('pod','Artwork/POD product signal');
    add('pod',6,'Artwork, merch, POD, display or provider-template signal');
  }

  if(match(['teacher','classroom','lesson','pupil','student','school','homework','teaching','worksheet','answer sheet'])){
    gate('worksheet','Teaching/classroom/worksheet signal');
    add('worksheet',5,'Teacher, classroom, lesson, worksheet or answer-sheet signal');
  }

  if(match(['game','cards','clues','quiz','play','players','rules','deck','timeline']) || use==='Played as a game' || action==='Play it'){
    gate('game','Game/playable product signal');
    add('game',5,'Game, cards, clues, quiz, rules or play signal');
  }

  if(match(['guide','workbook','course','walkthrough','how to','instructions']) || use==='Read as a guide'){
    gate('guide','Guide/instructional content signal');
    add('guide',4,'Guide, workbook, walkthrough or instructions signal');
  }

  if(use==='Filled in or written on') {gate('printable','Written-on product signal'); add('printable',4,'Filled in or written on'); add('kdp',2,'Could also be a workbook/book');}
  if(use==='Used on a phone or screen') {add('website',3,'Screen use can fit web resource'); add('app',3,'Screen use can fit app/tool');}
  if(use==='Used as a repeatable workflow') {add('printable',2,'Repeatable workflow can fit printable process'); if(appGate) add('app',2,'Repeatable workflow with app signals');}

  if(action==='Read it') {gate('kdp','Buyer action is reading'); add('kdp',3,'Buyer reads it'); add('guide',2,'Reading can also fit guide/workbook');}
  if(action==='Write in it') {gate('printable','Buyer writes in it'); add('printable',4,'Buyer writes in it'); add('kdp',2,'Could also be workbook/book');}

  if(print==='Professional print / book print') add('kdp',5,'Professional/book print requested');
  if(print==='POD / merchandise print') add('pod',6,'POD/merchandise print requested');

  if(phone==='Yes, phone-first') {add('app',5,'Phone-first requirement'); add('website',3,'Phone-first can fit responsive web');}
  if(complexity==='Many files or bundle') add('printable',3,'Many files/bundle signal');
  if(repeat==='Yes, it needs variants or volumes') {add('kdp',3,'Volumes can fit publishing'); add('printable',2,'Variants can fit download packs');}
  if(repeat==='Yes, it needs automation/generation') {add('kdp',2,'Generation can support book production'); add('printable',2,'Generation can support file packs'); if(appGate) add('app',2,'Generation supports app only with app gate');}

  if(checked('valEducation')) {add('worksheet',1,'Educational value'); add('kdp',1,'Educational book potential'); add('guide',1,'Educational guide potential');}
  if(checked('valEntertainment')) {add('game',2,'Entertainment value'); if(gates.storybook) add('storybook',1,'Storybook can entertain');}
  if(checked('valPractical')) add('printable',2,'Practical/time-saving value');
  if(checked('valRelaxing')) {add('kdp',2,'Relaxing/screen-free value'); if(gates.storybook) add('storybook',1,'Story reading can be relaxing');}
  if(checked('valGift')) add('pod',2,'Giftable/attractive value');

  Object.keys(scores).forEach(function(key){
    if(scores[key]>0 && !gates[key] && key!=='kdp' && key!=='guide') scores[key]=Math.max(0,scores[key]-2);
  });

  const ranked=Object.entries(scores).sort(function(a,b){return b[1]-a[1]});
  const top=ranked[0];
  const second=ranked[1] || ['',0];
  const margin=top[1]-second[1];
  const lowEvidenceTie = top[1] <= 4 && second[1] >= 3 && margin <= 1;
  const names={storybook:'Children’s story / picture book',kdp:'KDP paperback book',printable:'Printable PDF or digital download pack',website:'Website free resource / lead magnet',app:'Mobile-first web app / interactive tool',pod:'Print-on-demand artwork/product',worksheet:'Worksheet or classroom resource pack',game:'Game / cards / playable product',guide:'Guide / workbook / process pack'};
  let type=(top[1]<=2 || lowEvidenceTie) ? 'Planning brief / route not clear yet' : (names[top[0]] || 'Planning brief / route not clear yet');
  let alt='';
  let ambiguous=false;
  if(lowEvidenceTie){
    alt='Possible light signals: '+(names[top[0]] || top[0])+' or '+(names[second[0]] || second[0]);
  } else if(second && second[1]>2){
    alt='Also consider: '+(names[second[0]] || second[0]);
    ambiguous = top[1]>=5 && second[1]>=4 && margin<=2;
  }
  return {type:type,scores:scores,evidence:evidence,platformHints:platformHints,gates:gates,ranked:ranked,alt:alt,topKey:top[0],topScore:top[1],secondKey:second[0],secondScore:second[1],margin:margin,ambiguous:ambiguous,lowEvidenceTie:lowEvidenceTie,productionAutomationOnly:productionAutomationOnly && !appGate};
}

function platformHintNote(product){
  const hints=product && product.platformHints ? product.platformHints : {};
  const mentioned=[];
  if(hints.kdp) mentioned.push('KDP');
  if(hints.etsy) mentioned.push('Etsy');
  if(hints.website) mentioned.push('website');
  if(hints.pod) mentioned.push('POD');
  if(!mentioned.length) return '';

  const t=product.type;
  if((t==='KDP paperback book' || t==='Children’s story / picture book') && hints.kdp){
    return 'Platform note: KDP mention supports the publishing route.';
  }
  if(t==='Printable PDF or digital download pack' && hints.etsy){
    return 'Platform note: Etsy mention supports the digital-download route.';
  }
  if(t==='Website free resource / lead magnet' && hints.website){
    return 'Platform note: website/online wording supports the web-resource route.';
  }
  if(t==='Print-on-demand artwork/product' && hints.pod){
    return 'Platform note: POD/print-provider wording supports the print-on-demand route.';
  }
  if((t==='KDP paperback book' || t==='Children’s story / picture book') && hints.etsy){
    return 'Platform note: Etsy was mentioned, but the product still looks like a finished book. Consider Etsy only as a secondary printable/download version.';
  }
  if(t==='Printable PDF or digital download pack' && hints.kdp){
    return 'Platform note: KDP was mentioned, but the product currently looks more like downloadable/printable files. Consider KDP only if it becomes a finished book.';
  }
  return 'Platform note: mentioned platform(s): '+mentioned.join(', ')+'. Treat this as a deployment hint, not the product type.';
}
