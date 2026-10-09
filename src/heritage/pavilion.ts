import * as THREE from 'three';
import { HeritageBuilder, type Point } from './builder';
import { roof, bracketBand } from './architecture';

// One shared grid holds the columns, beams, brackets and eaves together.
const GRID = 3.5;
const FLOOR = .96;
const TURN = Math.PI / 2;
function face(x:number,y:number,z:number,a:number):Point {
  return [x*Math.cos(a)+z*Math.sin(a),y,z*Math.cos(a)-x*Math.sin(a)];
}
function lantern(b:HeritageBuilder,x:number,z:number,start:number) {
  b.cylinder(.025,.025,.55,[x,5.2,z],'bronze',start,{duration:.045,lift:.3});
  b.sphere([x,4.65,z],[.3,.48,.3],'paper',start+.02,{duration:.04,lift:.4});
  for(const sign of [-1,1])b.cylinder(.23,.23,.07,[x,4.65+sign*.41,z],'bronze',start+.03);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    b.tube([[x+Math.cos(a)*.16,4.25,z+Math.sin(a)*.16],[x+Math.cos(a)*.31,4.65,z+Math.sin(a)*.31],[x+Math.cos(a)*.16,5.05,z+Math.sin(a)*.16]],.012,'wood',start+.025,{},8);
  }
  b.cylinder(.03,.06,.3,[x,4.02,z],'brick',start+.035);
}
function rail(b:HeritageBuilder,a:number,start:number){
  for(const segment of [[-3.45,-1.1],[1.1,3.45]]){
    const [lo,hi]=segment,mid=(lo+hi)/2;
    for(const h of [1.12,1.75])b.box([hi-lo,.12,.16],face(mid,h,3.9,a),'wood',start,{r:[0,a,0],duration:.045,lift:.4});
    for(let x=lo;x<hi+.01;x+=.39){
      b.box([.09,.71,.1],face(x,1.4,3.9,a),'brick',start+.025,{r:[0,a,0],duration:.04,lift:.35});
      b.box([.23,.08,.1],face(x,1.36,3.9,a),'bronze',start+.045,{r:[0,a,0]});
    }
    for(const x of [lo,hi]){
      b.box([.19,.98,.19],face(x,1.45,3.9,a),'wood',start+.015,{duration:.05,lift:.5});
      b.sphere(face(x,1.99,3.9,a),[.12,.12,.12],'bronze',start+.055);
    }
  }
}
function screen(b:HeritageBuilder,a:number,start:number){
  // Slim patterned panels leave the central space and entrance open.
  for(const x of [-2.65,2.65]){
    for(const dx of [-.52,.52])b.box([.1,2.05,.12],face(x+dx,3.5,3.5,a),'wood',start,{r:[0,a,0],duration:.05,lift:.4});
    for(const y of [2.45,4.55])b.box([1.14,.1,.12],face(x,y,3.5,a),'wood',start,{r:[0,a,0]});
    for(let i=0;i<7;i++)for(const direction of [-1,1]){
      const y=2.68+i*.27;
      b.box([.055,.73,.055],face(x,y,3.5,a),'jade',start+.04+i*.003,{r:[0,a,direction*.8],duration:.035,lift:.2});
    }
  }
}
export function buildPavilion(b:HeritageBuilder){
  // Shallow stone stylobate, inlaid floor and a single inviting entrance stair.
  b.cylinder(10.5,10.65,.18,[0,-.22,0],'stone',-1,{lift:0,shade:.93});
  for(let layer=0;layer<3;layer++)b.box([9.7-layer*.32,.28,9.7-layer*.32],[0,.02+layer*.28,0],'stone',.025+layer*.035,{duration:.055,lift:.7,shade:.87+layer*.045});
  b.box([8.9,.12,8.9],[0,.86,0],'stone',.13,{duration:.055,lift:.4});
  for(let x=-4;x<=4;x++)for(let z=-4;z<=4;z++)b.box([.94,.035,.94],[x*.97,.935,z*.97],'stone',.14+(x+4+z+4)*.002,{duration:.03,lift:.25,shade:.94+((x+z)%3)*.017});
  for(let i=0;i<4;i++)b.box([3.1,.19,1.12],[0,.12+i*.19,6.4-i*.62],'stone',.075+i*.02,{duration:.05,lift:.3});
  for(const a of [0,TURN,TURN*2,TURN*3]){
    b.box([8.4,.025,.025],face(0,.968,4.15,a),'bronze',.21,{r:[0,a,0]});
    rail(b,a,.71+a*.004);
  }
  const medallion=new THREE.TorusGeometry(1.65,.028,5,64);medallion.rotateX(Math.PI/2);
  b.add(medallion,'bronze',.2,{p:[0,.972,0],duration:.05,lift:.2});medallion.dispose();
  // Eight load-bearing posts, two per side; open heart of the pavilion.
  for(const [x,z] of [[-GRID,-GRID],[0,-GRID],[GRID,-GRID],[-GRID,0],[GRID,0],[-GRID,GRID],[0,GRID],[GRID,GRID]]){
    // omit centre front post for the entrance
    if(x===0&&z===GRID)continue;
    b.cylinder(.35,.42,.23,[x,1.08,z],'stone',.23,{duration:.05,lift:.4});
    b.cylinder(.2,.25,4.67,[x,FLOOR+2.45,z],'brick',.26,{duration:.095,lift:1.3});
    for(const y of [1.28,5.37])b.cylinder(.27,.27,.11,[x,y,z],'bronze',.36,{duration:.04,lift:.3});
  }
  for(let side=0;side<4;side++){
    const a=side*TURN;
    b.box([7.65,.32,.4],face(0,5.48,GRID,a),'wood',.36,{r:[0,a,0],duration:.055,lift:.7});
    b.box([7.4,.09,.075],face(0,5.45,GRID+.22,a),'bronze',.405,{r:[0,a,0]});
    for(const x of [-3.5,0,3.5])for(const sign of [-1,1])b.tube([face(x,4.78,GRID,a),face(x+sign*.36,5.05,GRID,a),face(x+sign*.75,5.3,GRID,a)],.07,'wood',.38,{duration:.04,lift:.45},8);
    if(side!==0)screen(b,a,.75);
    // Perimeter seats inside the railings.
    if(side!==0){b.box([5.6,.12,.52],face(0,1.52,3.0,a),'wood',.78,{r:[0,a,0]});for(const x of [-2.1,2.1])b.box([.18,.56,.4],face(x,1.2,3,a),'wood',.76,{r:[0,a,0]});}
  }
  // Coffered ceiling, supported before both roof tiers are assembled.
  for(const sign of [-1,1])b.box([2.7,.12,7.25],[sign*2.25,5.64,0],'wood',.4,{duration:.055,lift:.4,shade:.87});
  for(const x of [-2.7,-1.35,0,1.35,2.7])for(const direction of [0,TURN])b.box([.09,.16,6.8],face(x,5.48,0,direction),'jade',.425,{r:[0,direction,0]});
  bracketBand(b,5.88,3.5,.43);
  roof(b,6.2,5.35,3.05,1.12,.48);
  // Central clerestory pierces the lower tier, with a deck supporting upper posts.
  for(const x of [-2.7,2.7])for(const z of [-2.7,2.7])b.cylinder(.16,.21,6.4,[x,4.15,z],'wood',.33,{duration:.075,lift:1});
  // The stairwell is a real opening in the upper floor, with a continuous spiral stair.
  for(const sign of [-1,1])b.box([2.15,.2,6.2],[sign*2.025,7.45,0],'wood',.61,{duration:.055,lift:.45});
  for(const sign of [-1,1])b.box([1.95,.2,2.15],[0,7.45,sign*2.025],'wood',.61,{duration:.055,lift:.45});
  b.cylinder(.16,.2,6.55,[0,4.2,0],'wood',.33,{duration:.075,lift:.8});
  const handrail:Point[]=[];
  for(let i=0;i<36;i++){
    const a=i*Math.PI/12,y=1.05+i*6.45/35;
    b.box([1.25,.09,.28],[Math.cos(a)*.66,y,Math.sin(a)*.66],'wood',.36+i*.006,{r:[0,-a,0],duration:.045,lift:.35});
    b.cylinder(.022,.022,.72,[Math.cos(a)*1.22,y+.37,Math.sin(a)*1.22],'bronze',.4+i*.006,{duration:.035,lift:.25});
    handrail.push([Math.cos(a)*1.22,y+.76,Math.sin(a)*1.22]);
  }
  b.tube(handrail,.035,'wood',.63,{duration:.06,lift:.4},108);
  for(const x of [-2.7,2.7])for(const z of [-2.7,2.7])b.cylinder(.16,.2,2.55,[x,8.85,z],'brick',.635,{duration:.065,lift:.7});
  for(let side=0;side<4;side++){
    const a=side*TURN;
    b.box([5.85,.24,.26],face(0,10.16,2.7,a),'wood',.68,{r:[0,a,0]});
    for(let i=-8;i<=8;i++)b.box([.08,.9,.08],face(i*.33,8.02,2.8,a),'jade',.67+Math.abs(i)*.002,{r:[0,a,0]});
    for(const y of [7.61,8.5])b.box([5.8,.11,.15],face(0,y,2.8,a),'wood',.69,{r:[0,a,0]});
    b.box([5.6,.075,.04],face(0,8.53,2.86,a),'bronze',.705,{r:[0,a,0]});
  }
  bracketBand(b,10.32,2.7,.705);
  roof(b,10.64,4.4,.12,2.3,.75);
  for(let i=0;i<5;i++)b.cylinder(.29-i*.035,.38-i*.043,.12,[0,13.04+i*.16,0],'bronze',.92+i*.007,{duration:.04,lift:.25});
  b.sphere([0,13.84,0],[.22,.28,.22],'bronze',.96,{duration:.035,lift:.3});
  for(const x of [-2.85,2.85])for(const z of [-2.85,2.85])lantern(b,x,z,.86);
}
