import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { height, type Config } from './config.ts';
type Part={object:T.Object3D;origin:T.Vector3;offset:T.Vector3};
export const tones={walnut:'#62412c',oak:'#bea073',ink:'#282d29'};
const metalColors={copper:'#cc9169',silver:'#c2c8c5',graphite:'#444c48'};
function wood(finish:Config['finish']) {
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=512;
  const ctx=canvas.getContext('2d')!;ctx.fillStyle=tones[finish];ctx.fillRect(0,0,256,512);
  for(let x=0;x<256;x++){
    const wave=Math.sin(x*.28)*.45+Math.sin(x*.77)*.25+Math.sin(x*1.71)*.12;
    ctx.strokeStyle=wave>0?`rgba(255,224,171,${Math.abs(wave)*.18})`:`rgba(16,7,2,${Math.abs(wave)*.25})`;
    ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,0);
    for(let y=0;y<=512;y+=16)ctx.lineTo(x+Math.sin(y*.008+x*.055)*2.1,y);ctx.stroke();
  }
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.anisotropy=4;
  return new T.MeshStandardMaterial({map,roughness:finish==='ink'?.75:.48,metalness:0});
}
function ring(outer:number,inner:number,depth:number,material:T.Material){
  const s=new T.Shape();s.absarc(0,0,outer,0,Math.PI*2,false);const hole=new T.Path();hole.absarc(0,0,inner,0,Math.PI*2,true);s.holes.push(hole);
  return new T.Mesh(new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.009,bevelThickness:.009,curveSegments:48}),material);
}
function cylinder(radius:number,depth:number,material:T.Material){const mesh=new T.Mesh(new T.CylinderGeometry(radius,radius,depth,48),material);mesh.rotation.x=Math.PI/2;return mesh;}
export class Speaker {
  group=new T.Group();parts:Part[]=[];grille=new T.Group();
  constructor(public config:Config){this.build();}
  private part(object:T.Object3D,position:T.Vector3,offset:T.Vector3){object.position.copy(position);this.group.add(object);this.parts.push({object,origin:position.clone(),offset});return object;}
  build(){
    const c=this.config,w=c.width/100,h=height(c)/100,d=c.depth/100,z=d/2;
    const timber=wood(c.finish),dark=new T.MeshStandardMaterial({color:'#090d09',roughness:.68}),trim=new T.MeshStandardMaterial({color:metalColors[c.metal],metalness:.78,roughness:.27});
    const rubber=new T.MeshStandardMaterial({color:'#090b08',roughness:.9}),paper=new T.MeshStandardMaterial({color:'#252922',roughness:.82}),steel=new T.MeshStandardMaterial({color:'#747a71',metalness:.8,roughness:.34});
    const panel=(a:number,b:number,e:number,mat:T.Material)=>new T.Mesh(new RoundedBoxGeometry(a,b,e,3,.045),mat);
    this.part(panel(.16,h,d,timber),new T.Vector3(-w/2+.08,0,0),new T.Vector3(-.5,0,0));
    this.part(panel(.16,h,d,timber),new T.Vector3(w/2-.08,0,0),new T.Vector3(.5,0,0));
    this.part(panel(w-.18,.16,d,timber),new T.Vector3(0,h/2-.08,0),new T.Vector3(0,.45,0));
    this.part(panel(w-.18,.16,d,timber),new T.Vector3(0,-h/2+.08,0),new T.Vector3(0,-.25,0));
    const back=new T.Group();back.add(panel(w-.15,h-.18,.16,timber));
    const terminal=panel(.7,.55,.035,dark);terminal.position.set(0,-h*.25,-.1);back.add(terminal);
    for(const x of [-.2,.2]){const post=cylinder(.065,.1,trim);post.position.set(x,-h*.25,-.16);back.add(post);const dot=cylinder(.027,.11,new T.MeshStandardMaterial({color:x<0?'#9a4736':'#131713'}));dot.position.copy(post.position);back.add(dot);}
    this.part(back,new T.Vector3(0,0,-z+.08),new T.Vector3(0,0,-.75));
    const radius=w*.315,wy=c.shape==='compact'?-.48:-.98,ty=c.shape==='compact'?1.05:1.86;
    const baffleShape=new T.Shape();const r=.1;const x=w/2-.03,y=h/2-.03;
    baffleShape.moveTo(-x+r,-y);baffleShape.lineTo(x-r,-y);baffleShape.quadraticCurveTo(x,-y,x,-y+r);baffleShape.lineTo(x,y-r);baffleShape.quadraticCurveTo(x,y,x-r,y);baffleShape.lineTo(-x+r,y);baffleShape.quadraticCurveTo(-x,y,-x,y-r);baffleShape.lineTo(-x,-y+r);baffleShape.quadraticCurveTo(-x,-y,-x+r,-y);
    for(const [cy,cr] of [[wy,radius*.9],[ty,.31],[-h/2+.36,.14]]){const hole=new T.Path();hole.absarc(0,cy,cr,0,Math.PI*2,true);baffleShape.holes.push(hole);}
    const baffle=new T.Mesh(new T.ExtrudeGeometry(baffleShape,{depth:.12,bevelEnabled:true,bevelSize:.015,bevelThickness:.015,bevelSegments:2,curveSegments:48}),new T.MeshStandardMaterial({color:c.finish==='ink'?'#121612':'#141912',roughness:.57}));
    this.part(baffle,new T.Vector3(0,0,z-.1),new T.Vector3(0,0,.8));
    const port=new T.Group();port.add(ring(.17,.125,.025,trim));const sleeve=cylinder(.127,.38,dark);sleeve.position.z=-.17;port.add(sleeve);
    this.part(port,new T.Vector3(0,-h/2+.36,z+.045),new T.Vector3(0,0,.8));
    const driver=(cy:number,rad:number,tweeter=false)=>{
      const rim=new T.Group();rim.add(ring(rad,rad*.87,.045,trim));
      for(let i=0;i<6;i++){const a=i*Math.PI/3;const screw=cylinder(.026,.025,steel);screw.position.set(Math.cos(a)*rad*.95,Math.sin(a)*rad*.95,.062);rim.add(screw);const slot=panel(.031,.008,.007,dark);slot.position.copy(screw.position);slot.position.z+=.019;slot.rotation.z=a;rim.add(slot);}
      this.part(rim,new T.Vector3(0,cy,z+.02),new T.Vector3(0,0,1.7));
      const cone=new T.Group();const surround=new T.Mesh(new T.TorusGeometry(rad*.81,rad*.065,12,64),rubber);surround.position.z=.018;cone.add(surround);
      if(tweeter){const dome=new T.Mesh(new T.SphereGeometry(rad*.45,32,16,0,Math.PI*2,0,Math.PI/2),paper);dome.rotation.x=Math.PI/2;dome.position.z=-.015;cone.add(dome);cone.add(ring(rad*.72,rad*.42,.025,dark));}
      else{
        const points=[[.16,-.18],[.22,-.19],[.38,-.14],[.58,-.06],[.75,0]].map(([a,b])=>new T.Vector2(a*rad,b*rad));
        const skin=new T.Mesh(new T.LatheGeometry(points,64),paper);skin.rotation.x=Math.PI/2;skin.material.side=T.DoubleSide;cone.add(skin);
        const cap=new T.Mesh(new T.SphereGeometry(rad*.21,32,16,0,Math.PI*2,0,Math.PI/2),dark);cap.rotation.x=Math.PI/2;cap.position.z=-rad*.15;cone.add(cap);
        for(const factor of [.35,.47,.60,.71]){const ridge=new T.Mesh(new T.TorusGeometry(rad*factor,.004,4,64),paper);ridge.position.z=-rad*.21+rad*factor*.28;cone.add(ridge);}
      }
      this.part(cone,new T.Vector3(0,cy,z+.04),new T.Vector3(0,0,2.2));
      const basket=new T.Group();const bRing=ring(rad*.79,rad*.71,.035,steel);basket.add(bRing);const lower=ring(rad*.32,rad*.25,.05,steel);lower.position.z=-.45;basket.add(lower);
      for(let i=0;i<6;i++){const a=i*Math.PI/3;const from=new T.Vector3(Math.cos(a)*rad*.73,Math.sin(a)*rad*.73,-.02),to=new T.Vector3(Math.cos(a)*rad*.29,Math.sin(a)*rad*.29,-.45);const bar=new T.Mesh(new T.CylinderGeometry(.025,.035,from.distanceTo(to),8),steel);bar.position.copy(from).add(to).multiplyScalar(.5);bar.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),to.clone().sub(from).normalize());basket.add(bar);}
      this.part(basket,new T.Vector3(0,cy,z-.05),new T.Vector3(0,0,1.2));
      const magnet=new T.Group();const ferrite=cylinder(rad*.32,.24,dark);magnet.add(ferrite);for(const dz of [-.13,.13]){const plate=cylinder(rad*.33,.025,steel);plate.position.z=dz;magnet.add(plate);}
      this.part(magnet,new T.Vector3(0,cy,z-.6),new T.Vector3(0,0,.7));
    };
    driver(wy,radius);driver(ty,.38,true);
    const brace=new T.Group();for(const cy of [h*.2,-h*.27]){const a=panel(w-.34,.1,.14,timber);a.position.set(0,cy,-d*.17);brace.add(a);for(const sx of [-w*.31,w*.31]){const b=panel(.1,.1,d-.4,timber);b.position.set(sx,cy,0);brace.add(b);}}
    this.part(brace,new T.Vector3(),new T.Vector3(0,0,-.15));
    for(const sx of [-1,1])for(const sz of [-1,1]){
      const foot=cylinder(.13,.16,dark);foot.rotation.x=0;foot.position.set(sx*(w/2-.25),-h/2-.08,sz*(d/2-.25));if(c.base==='feet')this.group.add(foot);else foot.geometry.dispose();
    }
    if(c.base==='plinth'){const plinth=panel(w+.22,.15,d+.12,dark);plinth.position.y=-h/2-.12;this.group.add(plinth);const accent=panel(w+.13,.028,d+.04,trim);accent.position.y=-h/2-.19;this.group.add(accent);}
    const badge=panel(.30,.06,.02,trim);badge.position.set(w*.30,-h/2+.14,z+.055);this.group.add(badge);
    const slats=Math.floor(w/.10);for(let i=0;i<slats;i++){const slat=panel(.045,h-.18,.065,timber);slat.position.set(-w/2+.1+i*(w-.2)/(slats-1),0,0);this.grille.add(slat);}
    this.grille.visible=c.grille==='slats';this.part(this.grille,new T.Vector3(0,0,z+.15),new T.Vector3(.3,0,3.05));
  }
  setExplosion(amount:number){for(const p of this.parts)p.object.position.copy(p.origin).addScaledVector(p.offset,amount);}
  dispose(){const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();this.group.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});for(const g of geometries)g.dispose();for(const m of materials){if(m instanceof T.MeshStandardMaterial)m.map?.dispose();m.dispose();}}
}
export class Viewer {
  renderer:T.WebGLRenderer|null=null;scene=new T.Scene();camera=new T.PerspectiveCamera(34,1,.1,100);speaker:Speaker|null=null;root=new T.Group();
  yaw=-.40;pitch=.055;targetYaw=-.40;targetPitch=.055;amount=0;active=true;motion=true;frame=0;renders=0;last=0;width=0;height=0;observer:ResizeObserver;visibility:IntersectionObserver;environment:T.Texture|null=null;
  constructor(public host:HTMLElement,public config:Config,public anatomy=false){
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);
    this.visibility=new IntersectionObserver(entries=>{this.active=entries[0].isIntersecting;if(this.active)this.invalidate();},{rootMargin:'80px'});this.visibility.observe(host);
    try{
      if(new URLSearchParams(location.search).has('fallback'))throw Error('fallback requested');
      this.renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.setClearColor(0,0);this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.95;
      const pmrem=new T.PMREMGenerator(this.renderer),room=new RoomEnvironment();const target=pmrem.fromScene(room,.04);this.environment=target.texture;this.scene.environment=this.environment;room.dispose();pmrem.dispose();
      const key=new T.DirectionalLight('#ffe5cb',4.0);key.position.set(3,5,6);this.scene.add(key);const fill=new T.DirectionalLight('#d2e6ef',2);fill.position.set(-4,2,2);this.scene.add(fill);const rim=new T.DirectionalLight('#d39c68',3);rim.position.set(2,3,-4);this.scene.add(rim);this.scene.add(new T.AmbientLight('#ffffff',.4));this.scene.add(this.root);
      this.renderer.domElement.setAttribute('aria-hidden','true');host.append(this.renderer.domElement);host.classList.add('webgl');this.setConfig(config);this.resize();
      this.renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();this.fail();});
    }catch{this.fail();}
  }
  fail(){cancelAnimationFrame(this.frame);this.frame=0;this.renderer?.domElement.remove();this.renderer?.dispose();this.renderer=null;this.host.classList.remove('webgl');this.host.classList.add('fallback');}
  setConfig(config:Config){this.config={...config};if(!this.renderer)return;this.speaker?.dispose();if(this.speaker)this.root.remove(this.speaker.group);this.speaker=new Speaker(config);this.root.add(this.speaker.group);this.speaker.setExplosion(this.amount);this.invalidate();}
  resize(){const r=this.host.getBoundingClientRect();this.width=r.width;this.height=r.height;if(!this.renderer||!r.width||!r.height)return;this.renderer.setSize(r.width,r.height);this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix();this.invalidate();}
  setAmount(amount:number){this.amount=amount;this.speaker?.setExplosion(amount);this.invalidate();}
  setView(yaw:number,pitch=.055){this.targetYaw=yaw;this.targetPitch=Math.max(-.2,Math.min(.3,pitch));this.invalidate();}
  invalidate(){if(this.renderer&&this.active&&!this.frame)this.frame=requestAnimationFrame(t=>this.render(t));}
  render(now:number,force=false){
    this.frame=0;if(!this.renderer||(!this.active&&!force))return;
    const dt=Math.min(.05,(now-this.last)/1000||.016);this.last=now;const lerp=this.motion?1-Math.exp(-dt*13):1;
    this.yaw+=(this.targetYaw-this.yaw)*lerp;this.pitch+=(this.targetPitch-this.pitch)*lerp;
    this.root.rotation.set(this.pitch,this.yaw,0);
    const bound=new T.Box3().setFromObject(this.root),size=bound.getSize(new T.Vector3()),center=bound.getCenter(new T.Vector3());this.root.position.sub(center);
    const v=T.MathUtils.degToRad(this.camera.fov/2),distance=Math.max(size.y/2/Math.tan(v),size.x/2/(Math.tan(v)*this.camera.aspect))+size.z/2;
    this.camera.position.set(0,0,distance*1.18);this.camera.lookAt(0,0,0);this.renderer.render(this.scene,this.camera);this.renders++;
    if(Math.abs(this.yaw-this.targetYaw)>.0001||Math.abs(this.pitch-this.targetPitch)>.0001)this.invalidate();
  }
  capture(config:Config){if(!this.renderer)return undefined;const current={...this.config},yaw=this.targetYaw,pitch=this.targetPitch,amount=this.amount;this.setConfig(config);this.yaw=this.targetYaw=-.4;this.pitch=this.targetPitch=.055;this.setAmount(0);this.render(performance.now(),true);const canvas=document.createElement('canvas');canvas.width=360;canvas.height=300;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#1c201c';ctx.fillRect(0,0,360,300);const source=this.renderer.domElement;const factor=Math.min(360/source.width,300/source.height);ctx.drawImage(source,(360-source.width*factor)/2,(300-source.height*factor)/2,source.width*factor,source.height*factor);const image=canvas.toDataURL('image/webp',.76);this.setConfig(current);this.setAmount(amount);this.setView(yaw,pitch);return image;}
  bounds(){if(!this.speaker||!this.renderer)return null;const box=new T.Box3().setFromObject(this.root),points=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new T.Vector3(x,y,z).project(this.camera);points.push({x:(p.x+1)*this.width/2,y:(1-p.y)*this.height/2});}return {left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))};}
  diagnostics(){return {webgl:!!this.renderer,renders:this.renders,calls:this.renderer?.info.render.calls,triangles:this.renderer?.info.render.triangles,bounds:this.bounds(),width:this.width,height:this.height,amount:this.amount};}
  dispose(){cancelAnimationFrame(this.frame);this.observer.disconnect();this.visibility.disconnect();this.speaker?.dispose();this.environment?.dispose();this.renderer?.dispose();}
}
