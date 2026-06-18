function experienceFit(product){
  const rawPast=v('pastProducts')+' '+v('pastPlatforms');
  const preferred=v('preferredMaking');
  const avoid=v('avoidMaking');
  const existing=v('existingFiles');
  const time=v('timeBudget');
  const repeat=v('repeatNeed');
  const t=product.type;
  const noSales=historyNoSales(rawPast);
  const blankish=historyBlankish(rawPast);
  const madeSignal=!blankish && hasHistoryPhrase(rawPast,['made','created','built','designed','published','uploaded','listed','drafted','launched','tried']);
  const platformExperience=hasWholeWord(rawPast,['etsy','kdp','amazon','website','shop','store','printify','printful','redbubble','canva']);
  const directSalesSignal=hasHistoryPhrase(rawPast,['sold products','sold books','sold printables','made sales','had sales','received orders','got orders','active shop','etsy shop','kdp account','amazon kdp']);
  const soldBefore=!noSales && directSalesSignal;
  const triedButNoSales=noSales && platformExperience;
  const hasAssets=existing && existing!=='Only the idea' && existing!=='Not sure yet';
  let experience='Beginner';
  if(soldBefore) experience='Seller / repeat creator';
  else if(madeSignal || hasAssets || triedButNoSales || (platformExperience && !blankish)) experience='Early builder';
  let support='Starter';
  if(product.type==='Planning brief / route not clear yet') support='Not enough information yet';
  else if(soldBefore && (repeat==='Yes, it needs variants or volumes' || repeat==='Yes, it needs automation/generation' || hasAssets)) support='Production system';
  else if(soldBefore || hasAssets) support='Template pack';
  else if(madeSignal || triedButNoSales || (platformExperience && !blankish)) support='Guided build';
  else support='Starter';
  if(time==='Under 1 hour') support='Mini starter';
  if(time==='A few hours' && support==='Production system') support='Template pack';
  const material=materialSuggestion(product,support);
  const why=[];
  why.push('Experience profile: '+experience+'.');
  why.push('Support level: '+support+'.');
  if(noSales) why.push('Sales history note: no sales detected, so this was not treated as seller/repeat-creator experience.');
  if(hasAssets) why.push('They already have: '+existing+'.');
  if(preferred && preferred!=='Not sure yet') why.push('Preferred making style: '+preferred+'.');
  if(time) why.push('Time budget: '+time+'.');
  const cautions=[];
  if(avoid==='Technical website/app setup' && t==='Mobile-first web app / interactive tool') cautions.push('Do not recommend a full web-app build yet. Start with a simple static prototype or printable version.');
  if(avoid==='Print formatting' && (t==='KDP paperback book' || t==='Children’s story / picture book')) cautions.push('Do not push full print formatting too early. Start with a sample PDF/spread before final KDP files.');
  if(avoid==='Customer file support' && t==='Printable PDF or digital download pack') cautions.push('Keep the file pack simple and include clear start-here instructions.');
  if(avoid==='Physical fulfilment' && t==='Print-on-demand artwork/product') cautions.push('POD reduces fulfilment, but product-support checks are still needed.');
  if(avoid==='Large projects') cautions.push('Recommend a small MVP/sample before a full route pack.');
  return {experience:experience,support:support,material:material,why:why,cautions:cautions,history:{noSales:noSales,blankish:blankish,soldBefore:soldBefore,triedButNoSales:triedButNoSales,platformExperience:platformExperience}};
}
function materialSuggestion(product,support){
  const t=product.type;
  if(support==='Not enough information yet') return 'No paid material recommendation yet — collect more 5W detail first.';
  if(t==='Children’s story / picture book') return support+' material: Storybook Planning + Page Layout Pack.';
  if(t==='KDP paperback book') return support+' material: KDP Book Starter Route Pack.';
  if(t==='Printable PDF or digital download pack') return support+' material: Printable Product Builder Pack.';
  if(t==='Website free resource / lead magnet') return support+' material: Lead Magnet HTML Page Pack.';
  if(t==='Mobile-first web app / interactive tool') return support+' material: Simple HTML Tool Starter Pack.';
  if(t==='Print-on-demand artwork/product') return support+' material: POD Product Setup Pack.';
  if(t==='Worksheet or classroom resource pack') return support+' material: Worksheet Seller Starter Pack.';
  if(t==='Game / cards / playable product') return support+' material: Printable Game/Card Pack Builder.';
  if(t==='Guide / workbook / process pack') return support+' material: Guide + Workbook Builder Pack.';
  return support+' material: Product Route Starter Pack.';
}
function renderSupportFit(fit){
  if(!fit) return '<span class="tag">Waiting for preference/history answers.</span>';
  const cautionHtml=fit.cautions.length ? '<p class="mini" style="margin-top:8px"><strong>Not recommended yet / caution:</strong> '+escapeHtml(fit.cautions.join(' '))+'</p>' : '';
  return '<div class="tiercard"><strong>'+escapeHtml(fit.support)+'</strong><span class="tiermeta">'+escapeHtml(fit.experience)+'</span>'+escapeHtml(fit.material)+'</div>'+tags(fit.why,false)+cautionHtml;
}
function supportPlain(fit){
  if(!fit) return '[not generated]';
  let out='Experience profile: '+fit.experience+'\nSupport level: '+fit.support+'\nSuggested material: '+fit.material+'\nWhy:\n- '+fit.why.join('\n- ');
  if(fit.cautions.length) out+='\nNot recommended yet / caution:\n- '+fit.cautions.join('\n- ');
  return out;
}
function confidence(product){
  const essentials=[v('ideaText'),v('who'),v('whatHelp'),v('whereUsed'),v('whenUse'),v('whyCare')];
  const filled=essentials.filter(Boolean).length;
  let level='Low', reason='The idea needs more who, what, where, when and why detail.';
  if(product.lowEvidenceTie) return {level:'Low / unclear', reason:'Several routes are lightly suggested, but none has enough evidence. Add more detail before choosing a product route.'};
  if(product.type==='Planning brief / route not clear yet' || filled<3) return {level:'Low', reason:'Not enough core 5W evidence to recommend a route yet.'};
  if(product.ambiguous) return {level:'Ambiguous', reason:'Two routes are close. The tool should surface the trade-off instead of pretending this is settled.'};
  if(filled>=5 && product.topScore>=8 && product.margin>=4) {level='High'; reason='The top route has both enough evidence and a clear margin over the next option.';}
  else if(filled>=4 && product.topScore>=6 && product.margin>=2) {level='Medium'; reason='The likely route is visible, but the margin is not wide enough for full confidence.';}
  else if(filled>=3) {level='Medium-low'; reason='The idea is forming, but the recommendation should be treated as a first guess.';}
  return {level, reason};
}
function folderSuggestion(){
  const name=v('projectName')||'Product_Name';
  return `${name}/\n  01_Idea\n  02_5W_Answers\n  03_Research\n  04_Recommendation\n  05_Test_Build\n  06_Final_Files\n  07_Listing_or_Deployment_Text\n  08_Upload_Notes\n  09_Launch_Record`;
}
