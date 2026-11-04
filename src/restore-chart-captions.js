// Recover the chart copy, including answer options. Never reset the chart or removed branding.
export function restoreChartCaptions(story,original,{useOriginalText=false}={}){
 const result=structuredClone(story);
 if(result.scene!=='sperm-survival-3'||original.scene!==result.scene)return result;
 const captions=original.elements.filter(e=>e.type==='text'&&![2,3].includes(e.id));
 const restored=captions.map(template=>{
  const previous=result.elements.find(e=>e.id===template.id&&e.type==='text');
  return {...structuredClone(template),text:!useOriginalText&&previous?.text.trim()?previous.text:template.text,opacity:1,animation:'none',delay:0};
 });
 const ids=new Set(restored.map(e=>e.id));
 result.elements=[...result.elements.filter(e=>!ids.has(e.id)),...restored];
 return result;
}

// Explicitly remove only the day-column overlays from this chart story.
export function removeChartHighlights(story){
 const result=structuredClone(story);
 if(result.scene==='sperm-survival-3')result.elements=result.elements.filter(e=>!(e.type==='rect'&&[5,6].includes(e.id)&&e.label==='הדגשת יום'));
 return result;
}
