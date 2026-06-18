function platformRoute(product){
  const map={
    'Children’s story / picture book':['Primary route: children’s story / picture book','Start with a short illustrated sample before final publishing.'],
    'KDP paperback book':['Primary route: Amazon KDP paperback','Use when the idea is best as a printed book, workbook, puzzle book, journal or professional paperback.'],
    'Printable PDF or digital download pack':['Primary route: website download or Etsy digital download','Use when the customer needs printable files, checklists, planners, templates or a ZIP pack.'],
    'Website free resource / lead magnet':['Primary route: own website / static page','Use when the idea should attract traffic, explain a process or point people to a next step.'],
    'Mobile-first web app / interactive tool':['Primary route: static web app first','Use when the idea needs interaction, saving, sorting, calculating or phone-first use.'],
    'Print-on-demand artwork/product':['Primary route: POD or print partner upload','Use when the idea belongs on prints, merch, cards, posters or physical products.'],
    'Worksheet or classroom resource pack':['Primary route: printable PDF pack','Use when teachers, parents or learners need pages to print, use and mark.'],
    'Game / cards / playable product':['Primary route: printable game pack or web game','Use when value comes from rules, replay, sets, clues, cards or challenge.'],
    'Guide / workbook / process pack':['Primary route: PDF guide, workbook or download pack','Use when value is explanation, sequence and repeatable steps.']
  };
  return map[product.type]||['Route not clear yet','Gather more 5W detail before choosing a platform.'];
}
function fileRecommendation(product){
  const t=product.type;
  if(t==='Children’s story / picture book') return ['Story/manuscript draft','Page-by-page storyboard','Illustration brief or image plan','Sample spread PDF','Full interior PDF after testing','Full-spread cover PDF'];
  if(t==='KDP paperback book') return ['Interior PDF','Full-spread cover PDF','Title/metadata notes','Proof/check log','Preview images'];
  if(t==='Printable PDF or digital download pack') return ['Printable PDF','Customer ZIP if multiple files','Start-here/readme file','Preview PNG/JPG images','Listing or landing-page text'];
  if(t==='Website free resource / lead magnet') return ['Mobile-friendly HTML page','Optional downloadable PDF','CTA/link section','Preview/social image','Update log'];
  if(t==='Mobile-first web app / interactive tool') return ['Responsive HTML/CSS/JS','Local JSON export/import if needed','README/use notes','Test data','Static deployment folder'];
  if(t==='Print-on-demand artwork/product') return ['High-resolution PNG/PDF','Transparent PNG if needed','Mockup images','Provider template notes','Source/licence notes'];
  if(t==='Worksheet or classroom resource pack') return ['A4 PDF','US Letter PDF if useful','Answer sheet/key if needed','Teacher/parent notes','Preview images'];
  if(t==='Game / cards / playable product') return ['Rules PDF','Cards/clues/assets','Printable PDF or HTML version','Answer/key file','Play-test log'];
  if(t==='Guide / workbook / process pack') return ['Guide/workbook PDF','Checklist or worksheet pages','Start-here page','Preview images','Support/FAQ note'];
  return ['One rough sample','Audience notes','Route decision log','Do not build final files yet'];
}
function specRecommendation(product){
  const t=product.type, text=allText();
  if(t==='Children’s story / picture book') return ['Start with a short sample: 4–8 pages or 2–4 spreads','Possible trim: 8.5 x 8.5 in or 8.5 x 11 in','Use large readable text and safe margins','Plan illustration space before final artwork'];
  if(t==='KDP paperback book'){
    if(text.includes('children')||text.includes('music')||text.includes('visual')||text.includes('square')) return ['Possible trim: 8.5 x 8.5 in','Good for visual, children, music or square activity layouts','Build print-ready PDF after a sample page works'];
    if(text.includes('guide')||text.includes('text')) return ['Possible trim: 6 x 9 in','Good for compact text-heavy guides','Interior PDF + full-spread cover PDF'];
    return ['Possible trim: 8.5 x 11 in','Good for puzzle, workbook, activity and large-print pages','Interior PDF + full-spread cover PDF'];
  }
  if(t==='Printable PDF or digital download pack'||t==='Worksheet or classroom resource pack'||t==='Guide / workbook / process pack') return ['Suggested sizes: A4 and US Letter','Use printer-safe margins','PDF should be the main customer file'];
  if(t==='Website free resource / lead magnet'||t==='Mobile-first web app / interactive tool') return ['Mobile-first responsive layout','Use short sections and large tap targets','Test on phone before desktop polishing'];
  if(t==='Print-on-demand artwork/product') return ['Use the exact provider template','Usually 300 DPI artwork','Check safe area, crop and mockup before upload'];
  if(t==='Game / cards / playable product') return ['Start with a small playable test','Choose printable PDF or responsive HTML after play-test','Do not finalise artwork until rules work'];
  return ['Choose size after product route is clear','Build one sample only','Test before full production'];
}
function deploymentStage(product){
  const filled=[v('ideaText'),v('who'),v('whatHelp'),v('whereUsed'),v('whenUse'),v('whyCare')].filter(Boolean).length;
  if(product.type==='Planning brief / route not clear yet'||filled<3) return 'Stage: idea capture. Complete the 5W answers before building anything.';
  if(filled<5) return 'Stage: route forming. Build a rough sample only after the missing 5W answers are filled.';
  if(product.topScore<6) return 'Stage: sample needed. Build one small test file and check whether the suggested route still fits.';
  return 'Stage: prototype/sample build. Create one small version in the recommended format, test the export, then move to final files and upload/deploy.';
}
function nextAction(product){
  const t=product.type;
  if(t==='Children’s story / picture book') return 'Write a short story sample, map 4–8 pages, and test one illustrated spread before building the full book.';
  if(t==='KDP paperback book') return 'Create one sample interior page and one cover test before building a full paperback.';
  if(t==='Printable PDF or digital download pack') return 'Create one printable PDF, test it on phone and desktop, then package it only if the test works.';
  if(t==='Website free resource / lead magnet') return 'Draft the mobile page sections first, then add the download or CTA.';
  if(t==='Mobile-first web app / interactive tool') return 'Build one phone-friendly screen with one useful action before adding extra features.';
  if(t==='Print-on-demand artwork/product') return 'Download the provider template and place one design safely before making variants.';
  if(t==='Worksheet or classroom resource pack') return 'Build one worksheet and print it before making the full pack.';
  if(t==='Game / cards / playable product') return 'Write the rules and test a tiny playable version before final artwork.';
  if(t==='Guide / workbook / process pack') return 'Create a one-page structure and one sample page before writing the full guide.';
  return 'Fill in the missing 5W answers, then generate the recommendation again.';
}
function preferenceFit(product){
  const pref=v('preferredMaking'), avoid=v('avoidMaking'), existing=v('existingFiles'), time=v('timeBudget');
  const notes=[];
  if(pref) notes.push('Preference signal: '+pref+'.');
  if(existing&&existing!=='Only the idea') notes.push('Starting asset: '+existing+'.');
  if(time) notes.push('Time fit: '+time+'.');
  if(avoid){
    let warning='';
    if(avoid==='Technical website/app setup'&&product.type==='Mobile-first web app / interactive tool') warning='Caution: the idea points toward an app/tool, but the user wants to avoid technical setup. Start with a very simple static prototype or consider a printable version.';
    else if(avoid==='Print formatting'&&(product.type==='KDP paperback book'||product.type==='Children’s story / picture book')) warning='Caution: the idea points toward a book, but the user wants to avoid print formatting. Start with a PDF/download version before KDP.';
    else if(avoid==='Customer file support'&&product.type==='Printable PDF or digital download pack') warning='Caution: digital downloads may create file-support questions. Keep the ZIP simple and include clear instructions.';
    else if(avoid==='Physical fulfilment'&&product.type==='Print-on-demand artwork/product') warning='Caution: POD avoids most fulfilment, but physical product support may still happen. Check provider workflow first.';
    else if(avoid==='Large projects') warning='Caution: keep this as a one-page/sample MVP before expanding.';
    notes.push(warning||('Avoidance signal: '+avoid+'.'));
  }
  return notes.join(' ')||'No preference/history answers yet. Recommendation is based on idea and 5W signals only.';
}
function routeOptions(product){
  const t=product.type;
  let freeRoute={title:'Option A — Free/manual route',cost:'Low/free',effort:'Higher effort',text:'Use free or already-available tools. Build one small sample yourself and only expand once the format proves useful.'};
  let paidRoute={title:'Option B — Paid-assisted route',cost:'Medium',effort:'Lower effort',text:'Use paid templates, design tools, formatting tools, checklists or guided starter files to reduce mistakes and speed up production.'};
  let outsourceRoute={title:'Option C — Outsourced/managed route',cost:'Higher',effort:'Lowest effort',text:'Pay a specialist to handle some or all build, formatting, design, setup or deployment.'};
  let firstMove='Recommended first move: build the free/manual sample first.';
  if(t==='Children’s story / picture book') firstMove='Recommended first move: write the story and test one illustrated spread.';
  else if(t==='KDP paperback book') firstMove='Recommended first move: make one sample interior page and one cover test manually before paying for help.';
  else if(t==='Mobile-first web app / interactive tool') firstMove='Recommended first move: prove the app with one phone-friendly screen before paying for no-code tools or development.';
  else if(t==='Game / cards / playable product') firstMove='Recommended first move: play-test a tiny rough version before paying for artwork or print-ready files.';
  else if(t==='Planning brief / route not clear yet') {freeRoute.text='Keep this free/manual for now. Do not buy tools until the product type and platform route are clearer.';paidRoute.text='Wait before spending money. Paid tools only make sense after the recommendation is clearer.';outsourceRoute.text='Do not outsource yet. Clarify the idea and 5W first.';firstMove='Recommended first move: complete the missing 5W answers before choosing any paid route.';}
  return {freeRoute:freeRoute,paidRoute:paidRoute,outsourceRoute:outsourceRoute,firstMove:firstMove};
}
function renderRouteOptions(options){
  if(!options) return '<span class="tag">Waiting for recommendation</span>';
  const cards=[options.freeRoute,options.paidRoute,options.outsourceRoute].map(function(item){return '<div class="tiercard"><strong>'+escapeHtml(item.title)+'</strong><span class="tiermeta">Cost: '+escapeHtml(item.cost)+' · Effort: '+escapeHtml(item.effort)+'</span>'+escapeHtml(item.text)+'</div>';}).join('');
  return cards+'<p class="mini" style="margin-top:10px"><strong>'+escapeHtml(options.firstMove)+'</strong></p>';
}
function routeOptionsPlain(options){
  if(!options) return '[not generated]';
  return options.freeRoute.title+'\nCost: '+options.freeRoute.cost+' | Effort: '+options.freeRoute.effort+'\n'+options.freeRoute.text+'\n\n'+options.paidRoute.title+'\nCost: '+options.paidRoute.cost+' | Effort: '+options.paidRoute.effort+'\n'+options.paidRoute.text+'\n\n'+options.outsourceRoute.title+'\nCost: '+options.outsourceRoute.cost+' | Effort: '+options.outsourceRoute.effort+'\n'+options.outsourceRoute.text+'\n\n'+options.firstMove;
}
function renderWhy(product){
  if(!product) return '<span class="tag">Not enough evidence yet</span>';
  if(product.lowEvidenceTie) return tags(['Low evidence tie','Top score: '+product.topScore,'Next score: '+product.secondScore,'Margin: '+product.margin], true);
  if(product.type==='Planning brief / route not clear yet') return '<span class="tag">Not enough evidence yet</span>';
  const topEvidence=(product.evidence&&product.evidence[product.topKey])?product.evidence[product.topKey]:[];
  const scoreLine='Score: '+product.topScore+' · Next route score: '+product.secondScore+' · Margin: '+product.margin;
  return tags([scoreLine].concat(topEvidence.slice(0,5)), true);
}
function whyPlain(product){
  if(!product||product.type==='Planning brief / route not clear yet') return 'Not enough evidence yet.';
  const topEvidence=(product.evidence&&product.evidence[product.topKey])?product.evidence[product.topKey]:[];
  return ['Score: '+product.topScore,'Next route score: '+product.secondScore,'Margin: '+product.margin].concat(topEvidence.slice(0,5)).join('\n- ');
}
function ambiguityMessage(product){
  if(!product) return 'Waiting for answers.';
  if(product.lowEvidenceTie) return 'Low evidence / unclear route. Several routes are lightly suggested, but none has enough evidence. Add more detail about how the buyer will use the result.';
  if(product.productionAutomationOnly) return 'Production note: automation/generator wording was detected, but it was not treated as a web-app signal because the buyer-facing product does not clearly require interactivity.';
  if(!product.ambiguous) return 'No major ambiguity detected. The top route has enough separation from the next option.';
  return 'Ambiguous route: '+product.topKey+' vs '+product.secondKey+'. Clarify whether the buyer mainly reads, prints, plays, uploads, displays or uses this interactively.';
}
function cleanHistoryText(s){return String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9\/\s-]/g,' ').replace(/\s+/g,' ').trim();}
function hasHistoryPhrase(text,phrases){text=' '+cleanHistoryText(text)+' ';return phrases.some(function(p){p=cleanHistoryText(p);return p&&text.indexOf(' '+p+' ')!==-1;});}
function hasWholeWord(text,words){text=cleanHistoryText(text);return words.some(function(w){const safe=String(w).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp('(^|\\s)'+safe+'(\\s|$)').test(text);});}
function historyBlankish(text){text=cleanHistoryText(text);if(!text)return true;return ['na','n/a','none','nothing','no','nowhere','not yet','no history','no experience','nothing yet','never made anything'].indexOf(text)!==-1;}
function historyNoSales(text){return hasHistoryPhrase(text,['sold nothing','no sales','no sale','never sold','not sold','have not sold','havent sold','haven t sold','did not sell','didnt sell','didn t sell','sold zero','zero sales','no orders','no buyers','nothing sold','tried etsy but sold nothing','listed but sold nothing']);}
