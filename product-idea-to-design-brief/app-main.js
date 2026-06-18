function generateRecommendation(scroll){
  const product=scoreProduct();
  let platform=platformRoute(product);
  const platformNote=platformHintNote(product);
  if(platformNote) platform=platform.concat([platformNote]);
  const files=fileRecommendation(product);
  const specs=specRecommendation(product);
  const tiers=routeOptions(product);
  const supportFit=experienceFit(product);
  const values=valueTypes();
  document.getElementById('productOut').innerHTML=tags([product.type, product.alt, ...values], true);
  document.getElementById('whyOut').innerHTML=renderWhy(product);
  document.getElementById('ambiguityOut').textContent=ambiguityMessage(product);
  document.getElementById('platformOut').innerHTML=tags(platform, true);
  document.getElementById('tiersOut').innerHTML=renderRouteOptions(tiers);
  document.getElementById('supportOut').innerHTML=renderSupportFit(supportFit);
  document.getElementById('filesOut').innerHTML=tags(files);
  document.getElementById('specsOut').innerHTML=tags(specs);
  document.getElementById('stageOut').textContent=deploymentStage(product);
  const conf=confidence(product);
  document.getElementById('confidenceOut').innerHTML=tags([conf.level], true) + '<p class="mini" style="margin-top:8px">' + escapeHtml(conf.reason) + '</p>';
  document.getElementById('preferenceOut').textContent=preferenceFit(product);
  document.getElementById('nextOut').textContent=nextAction(product);
  const completed = ids.filter(id=>v(id)).length + checks.filter(id=>checked(id)).length;
  const total = ids.length + checks.length;
  const pct = Math.round((completed/total)*100);
  document.getElementById('progressbar').style.width=pct+'%';
  document.getElementById('progressText').textContent=pct+'% complete';
  const brief=`SAPIVER PRESS - PRODUCT IDEA TO DESIGN BRIEF v1.12\n\nRAW IDEA:\n${v('ideaText')||'[not filled]'}\n\nSOURCE OF IDEA:\n${v('ideaSource')||'[not filled]'}\n\nWHAT FEELS UNCLEAR:\n${v('currentMess')||'[not filled]'}\n\n5W CHECK\nWho it is for:\n${v('who')||'[not filled]'}\n\nWhat it helps them do:\n${v('whatHelp')||'[not filled]'}\n\nWhere they would use it:\n${v('whereUsed')||'[not filled]'}\n\nWhen they would use it:\n${v('whenUse')||'[not filled]'}\n\nWhy they would care:\n${v('whyCare')||v('valueSentence')||'[not filled]'}\n\nUSE SIGNALS:\nMostly used as: ${v('useMode')||'[not filled]'}\nUser action: ${v('buyerAction')||'[not filled]'}\nComplexity: ${v('complexity')||'[not filled]'}\nRepeat/automation need: ${v('repeatNeed')||'[not filled]'}\nPrint need: ${v('printNeed')||'[not filled]'}\nPhone need: ${v('phoneNeed')||'[not filled]'}\n\nVALUE TYPE:\n${values.join(', ')||'[not filled]'}\n\nNICHE:\n${v('nicheText')||'[not filled]'}\n\nAUDIENCE NOTES:\n${v('audienceText')||'[not filled]'}\n\nRESEARCH NOTES:\n${v('researchNotes')||'[not filled]'}\n\nPREFERENCE AND PRODUCT HISTORY:\nMade before: ${v('pastProducts')||'[not filled]'}\nSold/shared before: ${v('pastPlatforms')||'[not filled]'}\nPreferred making style: ${v('preferredMaking')||'[not filled]'}\nWants to avoid: ${v('avoidMaking')||'[not filled]'}\nExisting files/assets: ${v('existingFiles')||'[not filled]'}\nTime budget: ${v('timeBudget')||'[not filled]'}\nPreference/history fit: ${preferenceFit(product)}\n\nRECOMMENDED PRODUCT TYPE:\n${product.type}${product.alt ? '\n'+product.alt : ''}\n\nRECOMMENDED PLATFORM / DEPLOYMENT ROUTE:\n- ${platform.join('\n- ')}\n\nROUTE OPTIONS:\n${routeOptionsPlain(tiers)}\n\nRECOMMENDED SUPPORT LEVEL:\n${supportPlain(supportFit)}\n\nFILES TO BUILD:\n- ${files.join('\n- ')}\n\nSUGGESTED SIZE / SPECS:\n- ${specs.join('\n- ')}\n\nDEPLOYMENT STAGE:\n${deploymentStage(product)}\n\nFOLDER SETUP:\n${folderSuggestion()}\n\nDESIGN DIRECTION:\nStyle/tone: ${v('styleTone')||'[not filled]'}\nMust include: ${v('mustInclude')||'[not filled]'}\nMust avoid: ${v('mustAvoid')||'[not filled]'}\nFirst test build should prove: ${v('firstBuild')||'[not filled]'}\n\nNEXT ACTION:\n${nextAction(product)}`;
  document.getElementById('briefOut').textContent=brief;
  saveState();
  if(scroll) document.getElementById('result').scrollIntoView({behavior:'smooth', block:'start'});
}
function state(){
  const o={_version:'1.12', _savedAt:new Date().toISOString()};
  ids.forEach(id=>o[id]=v(id));
  checks.forEach(id=>o[id]=checked(id));
  return o;
}
function applyState(o){
  o=o&&o.data?o.data:o||{};
  ids.forEach(id=>{if(o[id]!==undefined&&document.getElementById(id))document.getElementById(id).value=o[id]});
  checks.forEach(id=>{if(o[id]!==undefined&&document.getElementById(id))document.getElementById(id).checked=!!o[id]});
  generateRecommendation(false);
}
function saveState(){localStorage.setItem('sapiver_product_idea_brief_v112_draft', JSON.stringify(state()))}
function loadState(){try{applyState(JSON.parse(localStorage.getItem('sapiver_product_idea_brief_v112_draft')||'{}'));}catch(e){}}
function copyBrief(){navigator.clipboard.writeText(document.getElementById('briefOut').textContent).then(()=>alert('Brief copied.')).catch(()=>alert('Copy failed. Select the brief and copy manually.'))}
function downloadText(){const text=document.getElementById('briefOut').textContent; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'})); a.download='Sapiver_Product_Idea_to_Design_Brief_v1_12.txt'; a.click(); URL.revokeObjectURL(a.href)}
function downloadJSON(){const payload={name:v('projectName')||'Sapiver Product Idea Brief', exportedAt:new Date().toISOString(), data:state()}; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'})); a.download='Sapiver_Product_Idea_to_Design_Brief_v1_12.json'; a.click(); URL.revokeObjectURL(a.href)}

function importJSON(event){
  const file=event.target.files && event.target.files[0];
  if(!file) return;

  const reader=new FileReader();

  reader.onload=function(){
    try{
      const obj=JSON.parse(reader.result);
      applyState(obj.data || obj);
      saveState();
      alert('JSON imported.');
    }catch(e){
      alert('Could not import JSON.');
    }
  };

  reader.readAsText(file);
  event.target.value='';
}

function clearAll(){
  if(!confirm('Clear the planner?')) return;
  ids.forEach(id=>{const el=document.getElementById(id); if(el) el.value=''});
  checks.forEach(id=>{const el=document.getElementById(id); if(el) el.checked=false});
  localStorage.removeItem('sapiver_product_idea_brief_v112_draft');
  generateRecommendation(false);
}
ids.forEach(id=>document.addEventListener('input', e=>{if(e.target&&e.target.id===id) generateRecommendation(false)}));
checks.forEach(id=>document.addEventListener('change', e=>{if(e.target&&e.target.id===id) generateRecommendation(false)}));
loadState(); generateRecommendation(false);
