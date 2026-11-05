// Quiet original ticks, synthesized locally. No licensed music or remote audio service.
export function createStoryAudio(design,{preview=false}={}){
 const AC=globalThis.AudioContext||globalThis.webkitAudioContext;
 if(!design.sound||!AC)return null;
 const context=new AC(),destination=context.createMediaStreamDestination();
 const master=context.createGain();master.gain.value=1;master.connect(destination);if(preview)master.connect(context.destination);
 context.resume().catch(()=>{});
 return {stream:destination.stream,start(){for(const time of design.sound.times){const oscillator=context.createOscillator(),gain=context.createGain();oscillator.type='sine';oscillator.frequency.value=760;const at=context.currentTime+time+.04;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(design.sound.volume,at+.004);gain.gain.exponentialRampToValueAtTime(.00001,at+.06);oscillator.connect(gain);gain.connect(master);oscillator.start(at);oscillator.stop(at+.07);}},stop(){destination.stream.getTracks().forEach(t=>t.stop());context.close().catch(()=>{});}};
}
