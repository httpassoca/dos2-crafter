// @ts-nocheck — ported verbatim from the original single-file page (LSPK v13 / LSF v3 after LSLib); pinned by golden tests.
// Save reading, editing and repacking. No DOM.
import { I, nm, nameMap, nkey } from './data'

export const STAT={BOOK_Paper_Sheet_A:'Sheet of Paper',CONT_Barrel_Ooze_A:'Ooze Barrel',CON_Drink_Cup_A_Apple:'Apple Juice',CON_Drink_Cup_A_Orange:'Orange Juice',CON_Drink_Cup_A_Lemonade:'Cup of Lemonade',CON_Drink_Cup_A_MilkHoney:'Milk and Honey',CON_Drink_Cup_A_Empty:'Empty Cup',CON_Drink_Cup_A_Milk:'Cup of Milk',CON_Drink_Cup_A_Water:'Cup of Water',CON_Drink_Cup_A_Tea:'Cup of Tea',CON_Drink_Cup_A_Wine:'Glass of Wine',CON_Drink_Mug_A_Empty:'Empty Mug',CON_Drink_Mug_Water_A:'Mug of Water',CON_Drink_Mug_A_Water:'Mug of Water',CON_Drink_Mug_Wine_A:'Mug of Wine',CON_Drink_Mug_A_Wine:'Mug of Wine',CON_Drink_Mug_A_Beer:'Mug of Beer',CON_Drink_Mug_A_Tea:'Mug of Tea',
CON_Food_Bread_Cheese_A:'Cheese Bread',CON_Food_Carrot_A:'Carrot',CON_Food_Dinner_A:'Dinner',CON_Food_Fries_Cold_A:'Cold Fries',CON_Food_Fries_Rivellon_A:'Rivellon Fries',CON_Food_Garlic:'Garlic',CON_Food_Honey_Jar_A:'Jar of Honey',CON_Food_Meat_BirdLeg_A:'Raw Bird Leg',CON_Food_Meat_Giblets_A:'Giblets',CON_Food_Meat_Mutton_A:'Raw Mutton',CON_Food_Meat_Raw_A:'Raw Red Meat',CON_Food_Pie_Apple_A:'Apple Pie',CON_Food_Pizza_A:'Pizza',CON_Food_Potato_A:'Potato',CON_Food_PotatoBoiled_A:'Boiled Potato',CON_Food_Potato_Mash_A:'Mashed Potatoes',CON_Food_Potato_Mash_Cold_A:'Cold Mashed Potatoes',CON_Food_Soup_Pumpkin_A:'Pumpkin Soup',CON_Food_Stew_A:'Meaty Stew',CON_Food_Stew_Dwarven_A:'Dwarven Stew',CON_Food_Stew_Elven_A:'Elven Stew',CON_Food_Tomato_A:'Tomato',CON_Food_TomatoSauce_A:'Tomato Sauce',CON_Food_Pepper_A:'Pepper',CON_Porridge_A:'Porridge',CON_Ingred_Dough_A:'Dough',CON_Ingred_Dough_Pizza_A:'Pizza Dough',
CON_Herb_Augmentor_A:'Augmentor',CON_Herb_Augmentor_Step2_A:'High Quality Augmentor',CON_Herb_Augmentor_Step3_A:'Ultimate Augmentor Herb',CON_Herb_Farhangite_A:'Farhangite',CON_Herb_Mushroom_A:'Penny Bun Mushroom',CON_Herb_Mushroom_B:'Bluegill Mushroom',CON_Herb_Mushroom_C:'Fly Agaric Mushroom',CON_Herb_Mushroom_D:'Earth Tongue Mushroom',CON_Herb_Mushroom_E:'Guepinia Mushroom',CON_Herb_Mushroom_Jellyfish_A:'Jellyroom',CON_Herb_Stardust_A:'Stardust Herb',CON_Herb_Stardust_Step2_A:'Superior Stardust Herb',CON_Herb_Tea_A:'Tea Herbs',CON_Herb_Whisperwood_A:'Whisperwood',CON_Herb_YarrowFlower:'Yarrow Flower',CON_Herb_BlackRose_A:'Blood Rose',
CON_Nature_Mushroom_Amadouvier_A:'Amadouvier',CON_Nature_Mushroom_AmethystDeceiver_A:'Amethyst Deceiver',CON_Nature_Mushroom_Boletus_A:'Boletus',CON_Nature_Mushroom_Calocera_A:'Calocera',CON_Nature_Mushroom_Chanterelle_A:'Chanterelle',CON_Nature_Mushroom_Puffball_A:'Puffball',CON_Nature_Mushroom_TrumpetOfDeath_A:'Trumpet of Death',
CON_Potion_Empty_A:'Empty Potion Bottle',CON_Potion_Invisible_A:'Invisibility Potion',CON_Potion_Invisible_Medium_A:'Medium Invisibility Potion',CON_Potion_NimbleTumble:'Potion of Nimble Tumble',CON_Potion_MagicArmor_Boost_A:'Small Magic Armour Potion',CON_Potion_MagicArmor_Boost_Medium_A:'Medium Magic Armour Potion',CON_Potion_MagicArmor_Boost_Large_A:'Large Magic Armour Potion',CON_Potion_PhysicalArmor_Boost_A:'Physical Armour Potion',CON_Potion_PhysicalArmor_Boost_Medium_A:'Medium Physical Armour Potion',CON_Potion_PhysicalArmor_Boost_Large_A:'Large Physical Armour Potion',CON_Potion_Poison_A:'Small Poison Bottle',CON_Potion_Poison_Medium_A:'Medium Poison Bottle',CON_Potion_Poison_Large_A:'Large Poison Bottle',CON_Potion_Poison_Huge_A:'Huge Poison Vial',CON_Potion_Poison_Giant_A:'Giant Poison Vial',CON_Potion_Air_Res_A:'Small Air Resistance Potion',CON_Potion_Water_Res_A:'Water Resistance Potion',CON_Potion_Earth_Res_A:'Earth Resistance Potion',CON_Potion_Fire_Res_A:'Fire Resistance Potion',
POTION_Minor_Healing_Potion:'Minor Healing Potion',POTION_Medium_Healing_Potion:'Medium Healing Potion',POTION_Large_Healing_Potion:'Healing Potion',POTION_Huge_Healing_Potion:'Huge Healing Potion',POTION_Giant_Healing_Potion:'Giant Healing Potion',
FOOD_Apple:'Apple',FOOD_Bread:'Bread',FOOD_Cheese:'Cheese',FOOD_Pumpkin:'Pumpkin',FOOD_Grapes:'Grapes',FOOD_Lemon:'Lemon',FOOD_Orange:'Orange',FOOD_Eggs:'Eggs',FOOD_FishA:'Herring',FOOD_FishB:'Red Snapper',FOOD_FishC:'Mackerel',FOOD_FishD:'Plaice',FOOD_FishE:'Chub Fish',
GRN_Grenade_ClusterBomb_A:'Cluster Grenade',GRN_Grenade_Flashbang_A:'Razzle Dazzle Grenade',GRN_Grenade_Holy_A:'Holy Hand Grenade',GRN_Grenade_Ice_A:'Frost Grenade',GRN_Grenade_Love_A:'Love Grenade',GRN_Grenade_Molotov_A:'Firestorm Grenade',GRN_Grenade_MustardGas_A:'Chemical Warfare Grenade',GRN_Grenade_OilFlask_A:'Oil Flask',GRN_Grenade_SmokeBomb_A:'Smoke Grenade',GRN_Grenade_Taser_A:'Thunderbolt Grenade',GRN_Grenade_Terror_A:'Terror Grenade',GRN_Grenade_Tremor_A:'Tremor Grenade',GRN_Grenade_WaterBalloon_A:'Water Balloon',GRN_Grenade_Nailbomb_A:'Nailbomb Grenade',GRN_Grenade_PoisonFlask_A:'Poison Flask',GRN_Ingredient_Flask_Empty_A:'Empty Flask',GRN_Ingredient_Holy_Empty:"Sovereign's Orb",GRN_Ingredient_Love_Empty_A:'Empty Perfume Bottle',GRN_Ingredient_Round_Empty_A:'Empty Round Grenade',GRN_Ingredient_Cylinder_Empty_A:'Empty Canister',GRN_Ingredient_Fuse_A:'Fuse',
HAR_Fish_Star:'Starfish',HAR_Shell:'Shell',ITEM_Bowl:'Bowl',ITEM_CookingPot:'Cooking Pot',ITEM_EmptyBottle:'Empty Bottle',ITEM_BottleWithOil:'Bottle Filled with Oil',ITEM_BrokenBottle:'Broken Bottle',ITEM_Log:'Log',ITEM_Nails:'Nails',ITEM_Soap:'Soap',ITEM_Key:'Key',JUNK_FishSkeleton_A:'Fishbone',LAB_MortarPestle_A:'Mortar and Pestle',
LOOT_Antler_A:'Antler',LOOT_Bone_A:'Bone',LOOT_ClawFinger_A:"Zaikk's Talon",LOOT_Claw_A:'Claw',LOOT_Eye_A:'Eye',LOOT_Fang_A:'Fang',LOOT_Feather_A:'Feather',LOOT_Feather_A_Fancy:'Fancy Feather',LOOT_Flour_A:'Flour',LOOT_Foot_Chicken_A:'Chicken Foot',LOOT_Hair_A:'Hair',LOOT_Hide_Animal_A:'Animal Hide',LOOT_Jar_MindMaggot_A:'Jar of Mind Maggots',LOOT_Leg_Anthropod_A:'Arthropod Leg',LOOT_MetalShard_A:'Sharp Piece of Metal',LOOT_Needle_A:'Needle',LOOT_Needle_Thread_A:'Needle and Thread',LOOT_Paw_A_Rabbit_A:"Rabbit's Paw",LOOT_PieceOfRock_A:'Piece of Rock',LOOT_Rope_A:'Rope',LOOT_Rune_Frame_Power:'Rune Frame of Power',LOOT_Rune_Frame_Mystical:'Mystical Rune Frame',LOOT_Scales_Animal_A:'Animal Scales',LOOT_Scraps_Cloth_A:'Cloth Scraps',LOOT_Scraps_Leather_A:'Leather Scraps',LOOT_Scraps_Metal_A:'Metal Scraps',LOOT_Scraps_Wood_A:'Wood Chips',LOOT_Scraps_Plate_A:'Plate Scraps',LOOT_Scraps_Scale_A:'Scale Scraps',LOOT_Sinew_A:'Sinew',LOOT_Skull_Human_A:'Skull',LOOT_Skull_Human_A_Ancient:'Ancient Human Skull',LOOT_Skull_Bird_A:'Bird Skull',LOOT_Slime_A:'Slime',LOOT_Source_Orb:'Source Orb',LOOT_Tail_A_Rat_A:"Rat's Tail",LOOT_Tail_A_Rat_A_Long:'Long Rat Tail',LOOT_Tooth_A:'Tooth',LOOT_Toy_Doll_Wood_A:'Doll',LOOT_Tusk_A:'Tusk',LOOT_Tusk_A_Large:'Large Tusk',LOOT_VoidEggSpike_A:'Voidwoken Spike',LOOT_WoodenStick_A:'Short Stick',LOOT_WoodenBranch_A:'Long Branch',LOOT_Wheat_A:'Wheat',LOOT_Panties_A:'Panties',LOOT_Handkerchief_A:'Handkerchief',LOOT_String_Bow_A:'Bowstring',LOOT_Ingred_CrossbowWithoutString:'Crossbow Without Bowstring',LOOT_Yarn_A:'Yarn',LOOT_Wool_A:'Wool',LOOT_Thread_A:'Thread',
SCROLL_AcidSpores:'Acid Spores Scroll',SCROLL_Fireball:'Fireball Scroll',SCROLL_FlamingDaggers:'Searing Daggers Scroll',SCROLL_Fortify:'Fortify Scroll',SCROLL_Haste:'Haste Scroll',SCROLL_LighningBolt:'Electric Discharge Scroll',SCROLL_Projectile_ChainLightning:'Chain Lightning Scroll',SCROLL_Projectile_Superconductor:'Superconductor Scroll',SCROLL_RegenerateStart:'Restoration Scroll',SCROLL_Resurrect:'Resurrection Scroll',SCROLL_Summon_TotemFromSurface:'Elemental Totem Scroll',SCROLL_Target_BurnMyEyes:'Peace of Mind Scroll',SCROLL_Target_ChickenTouch:'Chicken Claw Scroll',SCROLL_Target_DecayingTouch:'Decaying Touch Scroll',SCROLL_Target_FrostyShell:'Armour of Frost Scroll',SCROLL_Target_RockSpikes:'Impalement Scroll',
TOOL_Figurine_Wood_A:'Wooden Figurine',TOOL_Intestines_A:'Intestines',TOOL_Pouch_Dust_Bone_A:'Bonedust',TOOL_Pouch_Dust_Star_A:'Stardust',TOOL_Pouch_Dust_Pixie_A:'Pixie Dust',TOOL_RepairHammer:'Repair Hammer',TOOL_Hammer:'Hammer',TOOL_Tong_A:'Tongs',TOOL_Trap_DisarmToolkit:'Trap Disarming Kit',
WPN_ArrowHead_A:'Arrowhead',WPN_ArrowHead_Antler_A:'Knockdown Arrowhead',WPN_ArrowHead_Stunning_A:'Shocking Arrowhead',WPN_ArrowHead_Poison_A:'Poison Arrowhead',WPN_ArrowHead_Poison_Cloud_A:'Poison Cloud Arrowhead',WPN_ArrowHead_Cloud_Static_A:'Static Cloud Arrowhead',WPN_ArrowHead_Cloud_Steam_A:'Steam Cloud Arrowhead',WPN_ArrowShaft_A:'Arrow Shaft',WPN_Arrow_A:'Arrow',WPN_Arrow_Cloud_Static_A:'Static Cloud Arrow',WPN_Arrow_Cloud_Steam_A:'Steam Cloud Arrow',WPN_Arrow_Poison_A:'Poison Arrow',WPN_Arrow_Poison_Cloud_A:'Poison Cloud Arrow',WPN_Arrow_Stunning_A:'Shocking Arrow',WPN_Arrow_Antler_A:'Knockdown Arrow',WPN_Arrow_SlowDown_A:'Slowdown Arrow',WPN_ArrowHead_SlowDown_A:'Slowdown Arrowhead',WPN_Crossbow:'Crossbow'};
export const SCHOOL={Air:'Air',Earth:'Earth',Fire:'Fire',Water:'Water',Witchcraft:'Necromancy',Necromancy:'Necromancy',Death:'Necromancy',Summoning:'Summoning',Polymorph:'Polymorph',Warrior:'Warrior',Ranger:'Ranger',Rogue:'Rogue'};
export function statName(s){if(STAT[s])return [STAT[s]];let m;const T=x=>x[0].toUpperCase()+x.slice(1).toLowerCase(),sp=x=>x.replace(/([a-z])([A-Z])/g,'$1 $2');
  if(m=s.match(/^LOOT_Rune_(Flame|Frost|Masterwork|Rock|Thunder|Venom)_(Small|Medium|Large|Giant)$/))return [m[2]+' '+m[1]+' Rune'];
  if(m=s.match(/^LOOT_Essence_(Air|Earth|Fire|Water|Life|Shadow)(?:_(Step2|Step3))?_A$/))return [(m[2]==='Step2'?'High Quality ':m[2]==='Step3'?'Alien ':'')+m[1]+' Essence'];
  if(m=s.match(/^LOOT_Soul_Tormented(?:_(Step2|Step3))?_A$/))return [(m[1]==='Step2'?'High Quality ':m[1]==='Step3'?'Alien ':'')+'Tormented Soul'];
  if(m=s.match(/^BOOK_Skill_(\w+?)_Blank(_Step2)?_A$/))return [(m[2]?'High Tier ':'')+'Blank '+(SCHOOL[m[1]]||m[1])+' Skillbook'];
  if(m=s.match(/^CON_Potion_(Air|Earth|Fire|Water)_Res_(Medium|Large|Huge)_A$/))return [m[2]+' '+m[1]+' Resistance Potion'];
  if(m=s.match(/^POTION_(Minor|Medium|Large)_(Strength|Finesse|Intelligence|Constitution|Wits|Perception)_Potion$/))return [m[1]+' '+(m[2]==='Perception'?'Wits':m[2])+' Potion'];
  if(m=s.match(/^WPN_Arrow(Head)?_(\w+?)_A$/))return [sp(m[2]).replace(/_/g,' ')+' Arrow'+(m[1]?'head':'')];
  if(m=s.match(/^GRN_Grenade_(\w+?)_A$/))return [sp(m[1])+' Grenade'];
  if(m=s.match(/^SKILLBOOK_(\w+?)_(\w+)$/)){const sc=SCHOOL[m[1]];return [sp(m[2]).replace(/_/g,' ')+' Skillbook'].concat(sc?['Any '+sc+' Skillbook']:[])}
  if(m=s.match(/^SCROLL_(?:Target_|Projectile_|Summon_|Shout_|Cone_|Rain_|Teleportation_)?(\w+)$/))return [sp(m[1]).replace(/_/g,' ')+' Scroll'];
  if(/^FOOD_Fish\w+_Voidwoken$/.test(s))return ['Void-Tainted Fish'];
  if(/^WPN_(\w+_)?Dagger/.test(s))return ['Dagger'];if(/^WPN_(\w+_)?Knife/.test(s))return ['Knife'];if(/^WPN_.*(Sword|Axe|Blade)/.test(s))return ['Cutting Tool'];
  if(/Gold/.test(s)&&/^(Neo_|Trader_|LOOT_Gold|Gold)/.test(s))return ['Gold'];
  if(m=s.match(/^(?:LOOT|CON_Food|FOOD|ITEM|TOOL|HAR)_(\w+?)(?:_A)?$/))return [sp(m[1]).replace(/_/g,' ')];
  return []}
/* ---------- binary save reader (.lsv package and .lsf resource), after LSLib ---------- */
export function lz4Block(src,s,end,dst,d){while(s<end){const tok=src[s++];let ll=tok>>4;if(ll===15){let b;do{b=src[s++];ll+=b}while(b===255)}
    if(d+ll>dst.length||s+ll>end)throw new Error('lz4 overrun');dst.set(src.subarray(s,s+ll),d);s+=ll;d+=ll;if(s>=end)break;
    const off=src[s]|src[s+1]<<8;s+=2;let ml=tok&15;if(ml===15){let b;do{b=src[s++];ml+=b}while(b===255)}ml+=4;
    if(!off||off>d||d+ml>dst.length)throw new Error('lz4 bad match');let m=d-off;if(off>=ml){dst.copyWithin(d,m,m+ml);d+=ml}else while(ml--)dst[d++]=dst[m++]}return d}
export function lz4Frame(src,size){const v=new DataView(src.buffer,src.byteOffset,src.byteLength);if(v.getUint32(0,true)!==0x184D2204)throw new Error('not an lz4 frame');
  const flg=src[4];let p=6;if(flg&8)p+=8;if(flg&1)p+=4;p+=1;const dst=new Uint8Array(size);let d=0;
  for(;;){if(p+4>src.length)break;const bs=v.getUint32(p,true);p+=4;if(!bs)break;const n=bs&0x7fffffff;
    if(bs&0x80000000){dst.set(src.subarray(p,p+n),d);d+=n}else d=lz4Block(src,p,p+n,dst,d);p+=n;if(flg&16)p+=4;if(d>=size)break}
  return d===size?dst:dst.subarray(0,d)}
export async function inflate(u8){const ds=new DecompressionStream('deflate'),w=ds.writable.getWriter();w.write(u8);w.close();return new Uint8Array(await new Response(ds.readable).arrayBuffer())}
export async function unpack(u8,size,flags,chunked){const m=flags&15;if(m===0)return u8;if(m===1)return inflate(u8);
  if(m===2){if(chunked)return lz4Frame(u8,size);const o=new Uint8Array(size);if(lz4Block(u8,0,u8.length,o,0)!==size)throw new Error('lz4 size mismatch');return o}
  throw new Error('unsupported compression '+m)}
export async function lsvFile(u8,want){const v=new DataView(u8.buffer,u8.byteOffset,u8.byteLength),N=u8.length,SIG=0x4B50534C,td=new TextDecoder();let ver,flags=0,files=[],dataOff=0;
  const entries=(buf,n,sz)=>{const e=new DataView(buf.buffer,buf.byteOffset,buf.byteLength);for(let i=0;i<n;i++){const o=i*sz;let z=0;while(z<256&&buf[o+z])z++;
      files.push({name:td.decode(buf.subarray(o,o+z)),off:e.getUint32(o+256,true),disk:e.getUint32(o+260,true),size:e.getUint32(o+264,true),part:e.getUint32(o+268,true),flags:sz>272?e.getUint32(o+272,true):(e.getUint32(o+264,true)?1:0)})}};
  if(N>8&&v.getUint32(N-4,true)===SIG){const h=N-v.getInt32(N-8,true);ver=v.getUint32(h,true);const lo=v.getUint32(h+4,true),ls=v.getUint32(h+8,true);flags=u8[h+14];
    const n=v.getInt32(lo,true),raw=new Uint8Array(n*280);if(lz4Block(u8,lo+4,lo+ls,raw,0)!==raw.length)throw new Error('bad file list');entries(raw,n,280)}
  else if(v.getUint32(0,true)===SIG){ver=v.getUint32(4,true);if(ver!==10)throw new Error('package version '+ver+' is not a Divinity: Original Sin 2 save');
    dataOff=v.getUint32(8,true);flags=u8[18];const n=v.getUint32(20,true);entries(u8.subarray(24,24+n*280),n,280);files.forEach(f=>{if(!f.part)f.off+=dataOff})}
  else{ver=v.getUint32(0,true);if(ver!==7&&ver!==9)throw new Error('this is not a save package');dataOff=v.getUint32(4,true);const n=v.getUint32(17,true);entries(u8.subarray(21,21+n*272),n,272);files.forEach(f=>{if(!f.part)f.off+=dataOff})}
  const f=files.find(x=>x.name.toLowerCase().replace(/\\/g,'/').split('/').pop()===want);if(!f)throw new Error('no '+want+' inside this save (found: '+files.map(x=>x.name).slice(0,8).join(', ')+')');
  if(flags&4&&files.length){let first=Infinity,last=0,tot=0,pos=0;for(const x of files){first=Math.min(first,x.off);last=Math.max(last,x.off+x.disk);if(x===f)pos=tot;tot+=x.size}
    const all=lz4Frame(u8.subarray(first-7,last),tot);return all.subarray(pos,pos+f.size)}
  const raw=u8.subarray(f.off,f.off+f.disk);return (f.flags&15)?unpack(raw,f.size,f.flags,false):raw}
export async function lsfRead(u8){const v=new DataView(u8.buffer,u8.byteOffset,u8.byteLength),td=new TextDecoder();if(v.getUint32(0,true)!==0x464F534C)throw new Error('not an LSF file');
  const ver=v.getUint32(4,true);if(ver<1||ver>7)throw new Error('LSF version '+ver+' is not supported');let p=ver>=5?16:12;const u=()=>{const x=v.getUint32(p,true);p+=4;return x};
  const sU=u(),sD=u();let kU=0,kD=0;if(ver>=6){kU=u();kD=u()}const nU=u(),nD=u(),aU=u(),aD=u(),vU=u(),vD=u(),cf=u8[p];p+=4;const fmt=u();
  const sect=async(disk,size,chunkOk)=>{if(!disk&&!size)return new Uint8Array(0);if(!disk){const r=u8.subarray(p,p+size);p+=size;return r}
    const n=(cf&15)?disk:size,r=u8.subarray(p,p+n);p+=n;return unpack(r,size,cf,ver>=2&&chunkOk)};
  const sb=await sect(sD,sU,false),nb=await sect(nD,nU,true),ab=await sect(aD,aU,true),vb=await sect(vD,vU,true);
  const names=[],sv=new DataView(sb.buffer,sb.byteOffset,sb.byteLength);let q=4;for(let h=sv.getUint32(0,true);h--;){const l=[];names.push(l);let c=sv.getUint16(q,true);q+=2;while(c--){const n=sv.getUint16(q,true);q+=2;l.push(td.decode(sb.subarray(q,q+n)));q+=n}}
  const nm=x=>names[x>>>16][x&0xffff],adj=ver>=3&&fmt===1,nv=new DataView(nb.buffer,nb.byteOffset,nb.byteLength),nsz=adj?16:12,NN=nb.length/nsz|0;
  const nName=new Array(NN),nPar=new Int32Array(NN),nAttr=new Int32Array(NN);for(let i=0;i<NN;i++){const o=i*nsz;nName[i]=nm(nv.getUint32(o,true));nPar[i]=nv.getInt32(o+(adj?4:8),true);nAttr[i]=nv.getInt32(o+(adj?12:4),true)}
  const av=new DataView(ab.buffer,ab.byteOffset,ab.byteLength),asz=adj?16:12,AN=ab.length/asz|0,aName=new Array(AN),aType=new Uint8Array(AN),aLen=new Uint32Array(AN),aOff=new Uint32Array(AN),aNext=new Int32Array(AN).fill(-1);
  if(adj)for(let i=0;i<AN;i++){const o=i*16,tl=av.getUint32(o+4,true);aName[i]=nm(av.getUint32(o,true));aType[i]=tl&63;aLen[i]=tl>>>6;aNext[i]=av.getInt32(o+8,true);aOff[i]=av.getUint32(o+12,true)}
  else{const prev=[];let off=0;for(let i=0;i<AN;i++){const o=i*12,tl=av.getUint32(o+4,true),node=av.getInt32(o+8,true)+1;aName[i]=nm(av.getUint32(o,true));aType[i]=tl&63;aLen[i]=tl>>>6;aOff[i]=off;off+=aLen[i];
      if(prev[node]!==undefined&&prev[node]!==-1)aNext[prev[node]]=i;while(prev.length<node)prev.push(-1);prev[node]=i}}
  const vv=new DataView(vb.buffer,vb.byteOffset,vb.byteLength);
  const val=i=>{const t=aType[i],o=aOff[i],n=aLen[i];if(t===19)return vb[o]?'True':'False';if(t===4)return String(vv.getInt32(o,true));if(t===5||t===3)return String(vv.getUint32(o,true));if(t===1)return String(vb[o]);if(t===2)return String(vv.getInt16(o,true));if(t===27)return String(vv.getUint16(o,true));
    if(t===24||t===26||t===32)return String(n>=8?vv.getBigUint64(o,true):vv.getUint32(o,true));if((t>=20&&t<=23)||t===29||t===30){let e=o+Math.max(n-1,0);while(e>o&&!vb[e-1])e--;return td.decode(vb.subarray(o,e))}return null};
  const attrs=(i,want)=>{const r={};for(let a=nAttr[i];a!==-1&&a<AN;a=aNext[a])if(!want||want.has(aName[a]))r[aName[a]]=val(a);return r};
  return {NN,nName,nPar,attrs}}
export function lsfInventory(t){const {NN,nName,nPar,attrs}=t,root=new Int32Array(NN),own=new Int32Array(NN).fill(-1),chars=[],cIdx={},items=[],WC=new Set(['IsPlayer','InParty','OwnerCharacter','Inventory']),WI=new Set(['Stats','Amount','Parent','Inventory']);
  for(let i=0;i<NN;i++){const p=nPar[i];root[i]=p<0?i:root[p];const reg=nName[root[i]];
    if(reg==='Characters'){if(nName[i]==='Character'){own[i]=chars.length;chars.push({})}else if(p>=0)own[i]=own[p];const c=own[i]>=0?chars[own[i]]:null;
      if(c){if(nName[i]==='PlayerData')c.pd=1;const a=attrs(i,WC);for(const k in a)if(!(k in c))c[k]=a[k]}}
    else if(reg==='Items'&&nName[i]==='Item')items.push(attrs(i,WI))}
  return {chars,items}}
export async function saveInventory(u8,name){const lsf=/\.lsf$/i.test(name)?u8:await lsvFile(u8,'globals.lsf');return lsfInventory(await lsfRead(lsf))}

export function xmlInventory(t){const attr=(c,k)=>{const m=c.match(new RegExp('<attribute id="'+k+'" type="\\d+" value="([^"]*)"'));return m?m[1]:undefined},
  reg=n=>{const a=t.indexOf('<region id="'+n+'">');if(a<0)return '';const b=t.indexOf('</region>',a);return t.slice(a,b)},cr=reg('Characters'),ir=reg('Items');
  if(!cr||!ir)throw new Error('this file has no Characters or Items section');
  const chars=cr.split('<node id="Character">').slice(1).map(c=>({pd:c.indexOf('id="PlayerData"')>=0?1:0,IsPlayer:attr(c,'IsPlayer'),InParty:attr(c,'InParty'),OwnerCharacter:attr(c,'OwnerCharacter'),Inventory:attr(c,'Inventory')}));
  const items=ir.split('<node id="Item">').slice(1).map(c=>{const e=c.indexOf('<children>'),hd=e<0?c:c.slice(0,e);return {Stats:attr(hd,'Stats'),Amount:attr(hd,'Amount'),Parent:attr(hd,'Parent'),Inventory:attr(hd,'Inventory')}});
  return {chars,items}}
export function importSave(d){const map=nameMap(),invs=d.chars.filter(c=>c.pd&&c.IsPlayer==='True'&&c.InParty==='True'&&!c.OwnerCharacter&&c.Inventory).map(c=>c.Inventory);
  if(!invs.length)return {msg:'No party members were found in this save.'};
  const by={};for(const it of d.items){if(!it.Parent)continue;(by[it.Parent]=by[it.Parent]||[]).push({s:it.Stats||'',n:+(it.Amount||1),v:it.Inventory})}
  const tot={};let stacks=0;const seen=new Set(),walk=v=>{if(seen.has(v))return;seen.add(v);for(const it of by[v]||[]){stacks++;if(it.s)tot[it.s]=(tot[it.s]||0)+it.n;if(it.v)walk(it.v)}};invs.forEach(walk);
  const stock={},skip=[];for(const s in tot){let k=null;for(const n of statName(s)){const nk=nkey(n);k=map[nk]||map['any'+nk]||map[nk.replace(/s$/,'')];if(k)break}if(k)stock[k]=(stock[k]||0)+tot[s];else skip.push(s)}
  return {stock,skip,msg:`Read ${invs.length} party member${invs.length===1?'':'s'} and ${stacks} item stacks. ${Object.keys(stock).length} kinds of item match the guide and are now your inventory. ${skip.length} other kinds were skipped (gear, quest items and things no recipe uses). Hand tools are now counted only if you carry them.`}}
export const CRCT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
export function crc32(u8){let c=0xFFFFFFFF;for(let i=0;i<u8.length;i++)c=CRCT[(c^u8[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}
export function xxh32(u8,seed=0){const P1=2654435761,P2=2246822519,P3=3266489917,P4=668265263,P5=374761393,M=Math.imul,rl=(x,r)=>(x<<r)|(x>>>(32-r));let i=0,n=u8.length,h;const rd=p=>u8[p]|u8[p+1]<<8|u8[p+2]<<16|u8[p+3]<<24;
  if(n>=16){let v1=(seed+P1+P2)|0,v2=(seed+P2)|0,v3=seed|0,v4=(seed-P1)|0;for(;i<=n-16;i+=16){v1=M(rl((v1+M(rd(i),P2))|0,13),P1);v2=M(rl((v2+M(rd(i+4),P2))|0,13),P1);v3=M(rl((v3+M(rd(i+8),P2))|0,13),P1);v4=M(rl((v4+M(rd(i+12),P2))|0,13),P1)}h=(rl(v1,1)+rl(v2,7)+rl(v3,12)+rl(v4,18))|0}else h=(seed+P5)|0;
  h=(h+n)|0;for(;i<=n-4;i+=4)h=M(rl((h+M(rd(i),P3))|0,17),P4);for(;i<n;i++)h=M(rl((h+M(u8[i],P5))|0,11),P1);h^=h>>>15;h=M(h,P2);h^=h>>>13;h=M(h,P3);h^=h>>>16;return h>>>0}
export function md5(chunks){const K=new Uint32Array(64),S=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21];for(let i=0;i<64;i++)K[i]=Math.floor(Math.abs(Math.sin(i+1))*4294967296);
  let len=0;for(const c of chunks)len+=c.length;const tot=((len+8)>>>6<<6)+64,b=new Uint8Array(tot);let o=0;for(const c of chunks){b.set(c,o);o+=c.length}b[len]=0x80;const bl=len*8;const dv=new DataView(b.buffer);dv.setUint32(tot-8,bl>>>0,true);dv.setUint32(tot-4,Math.floor(bl/4294967296),true);
  let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476;const Mw=new Uint32Array(16);
  for(let p=0;p<tot;p+=64){for(let j=0;j<16;j++)Mw[j]=dv.getUint32(p+j*4,true);let A=a0,B=b0,C=c0,D=d0;
    for(let i=0;i<64;i++){let F,g;if(i<16){F=(B&C)|(~B&D);g=i}else if(i<32){F=(D&B)|(~D&C);g=(5*i+1)&15}else if(i<48){F=B^C^D;g=(3*i+5)&15}else{F=C^(B|~D);g=(7*i)&15}
      F=(F+A+K[i]+Mw[g])|0;A=D;D=C;C=B;const s=S[(i>>4)*4+(i&3)];B=(B+((F<<s)|(F>>>(32-s))))|0}a0=(a0+A)|0;b0=(b0+B)|0;c0=(c0+C)|0;d0=(d0+D)|0}
  const r=new Uint8Array(16),rv=new DataView(r.buffer);rv.setUint32(0,a0,true);rv.setUint32(4,b0,true);rv.setUint32(8,c0,true);rv.setUint32(12,d0,true);return r}
export function lz4Compress(src){const n=src.length,out=new Uint8Array(n+(n/255|0)+16);let o=0,anchor=0,i=0;const HB=16,ht=new Int32Array(1<<HB).fill(-1),limit=n-12,mflimit=n-5;
  const h4=p=>(Math.imul(src[p]|src[p+1]<<8|src[p+2]<<16|src[p+3]<<24,2654435761)>>>(32-HB));
  const lit=(l)=>{if(l>=15){let r=l-15;while(r>=255){out[o++]=255;r-=255}out[o++]=r}};
  while(i<limit){const hv=h4(i),ref=ht[hv];ht[hv]=i;
    if(ref>=0&&i-ref<65536&&src[ref]===src[i]&&src[ref+1]===src[i+1]&&src[ref+2]===src[i+2]&&src[ref+3]===src[i+3]){
      let ml=4;while(i+ml<mflimit&&src[ref+ml]===src[i+ml])ml++;const ll=i-anchor,tk=o++;out[tk]=(Math.min(ll,15)<<4)|Math.min(ml-4,15);lit(ll);out.set(src.subarray(anchor,i),o);o+=ll;
      const off=i-ref;out[o++]=off&255;out[o++]=off>>8;if(ml-4>=15){let r=ml-4-15;while(r>=255){out[o++]=255;r-=255}out[o++]=r}i+=ml;anchor=i;if(i-2>=0&&i-2<limit)ht[h4(i-2)]=i-2}else i++}
  const ll=n-anchor;out[o++]=Math.min(ll,15)<<4;lit(ll);out.set(src.subarray(anchor),o);o+=ll;return out.slice(0,o)}
export function lz4FrameCompress(src){const parts=[],hd=new Uint8Array([4,0x22,0x4D,0x18,0x40,0x40,0]);hd[6]=(xxh32(hd.subarray(4,6))>>>8)&255;parts.push(hd);
  for(let p=0;p<src.length;p+=65536){const blk=src.subarray(p,Math.min(p+65536,src.length)),c=lz4Compress(blk),raw=c.length>=blk.length,b=raw?blk:c,sz=new Uint8Array(4);new DataView(sz.buffer).setUint32(0,(b.length|(raw?0x80000000:0))>>>0,true);parts.push(sz,b)}
  parts.push(new Uint8Array(4));return cat(parts)}
export function cat(parts){let n=0;for(const p of parts)n+=p.length;const r=new Uint8Array(n);let o=0;for(const p of parts){r.set(p,o);o+=p.length}return r}
/* LSF tree model: keeps every value as its original bytes, so unchanged data is written back byte for byte */
export async function lsfModel(u8){const v=new DataView(u8.buffer,u8.byteOffset,u8.byteLength);if(v.getUint32(0,true)!==0x464F534C)throw new Error('not an LSF file');const ver=v.getUint32(4,true);if(ver<2||ver>4)throw new Error('LSF version '+ver+' cannot be written');
  const eng=v.getUint32(8,true);let p=12;const u=()=>{const x=v.getUint32(p,true);p+=4;return x};const sU=u(),sD=u(),nU=u(),nD=u(),aU=u(),aD=u(),vU=u(),vD=u(),cf=u8[p];p+=4;const fmt=u();if(fmt===1)throw new Error('this save uses a node layout the writer does not support');
  const sect=async(disk,size,ch)=>{if(!disk&&!size)return new Uint8Array(0);if(!disk){const r=u8.subarray(p,p+size);p+=size;return r}const n=(cf&15)?disk:size,r=u8.subarray(p,p+n);p+=n;return unpack(r,size,cf,ch)};
  const sb=await sect(sD,sU,false),nb=await sect(nD,nU,true),ab=await sect(aD,aU,true),vb=await sect(vD,vU,true);
  const names=[],sv=new DataView(sb.buffer,sb.byteOffset,sb.byteLength),td=new TextDecoder();let q=4;for(let h=sv.getUint32(0,true);h--;){const l=[];names.push(l);let c=sv.getUint16(q,true);q+=2;while(c--){const n=sv.getUint16(q,true);q+=2;l.push(td.decode(sb.subarray(q,q+n)));q+=n}}
  const nv=new DataView(nb.buffer,nb.byteOffset,nb.byteLength),NN=nb.length/12|0,nodes=new Array(NN),roots=[];
  for(let i=0;i<NN;i++){const o=i*12,nr=nv.getUint32(o,true),par=nv.getInt32(o+8,true);const nd={nr,name:names[nr>>>16][nr&0xffff],attrs:[],kids:[],parent:par>=0?nodes[par]:null};nodes[i]=nd;if(nd.parent)nd.parent.kids.push(nd);else roots.push(nd)}
  const av=new DataView(ab.buffer,ab.byteOffset,ab.byteLength),attrs=[];let off=0;for(let i=0;i<ab.length/12;i++){const o=i*12,nr=av.getUint32(o,true),tl=av.getUint32(o+4,true),ni=av.getInt32(o+8,true),len=tl>>>6;
    const at={nr,name:names[nr>>>16][nr&0xffff],type:tl&63,b:vb.subarray(off,off+len),node:nodes[ni]};nodes[ni].attrs.push(at);attrs.push(at);off+=len}
  const ref={};names.forEach((l,b)=>l.forEach((s,i)=>{ref[s]=(b<<16|i)>>>0}));
  return {ver,eng,cf,fmt,sb,roots,nodes,attrs,ref,names}}
export function nameRef(m,s){let r=m.ref[s];if(r!=null)return r;const b=m.names.findIndex(l=>l.length<0xffff);m.names[b].push(s);r=m.ref[s]=((b<<16)|(m.names[b].length-1))>>>0;m.namesDirty=true;return r}
export function namesBytes(m){if(!m.namesDirty)return m.sb;const enc=new TextEncoder(),parts=[];const h=new Uint8Array(4);new DataView(h.buffer).setUint32(0,m.names.length,true);parts.push(h);
  for(const l of m.names){const c=new Uint8Array(2);new DataView(c.buffer).setUint16(0,l.length,true);parts.push(c);for(const x of l){const b=enc.encode(x),n=new Uint8Array(2);new DataView(n.buffer).setUint16(0,b.length,true);parts.push(n,b)}}return cat(parts)}
export function lsfWrite(m){/* nodes in tree order; attributes keep their original global order (the game does not sort them), new ones go last */
  const N=[],A=[],V=[];let ni=0;const idx=new Map(),first=new Map();
  const walk=nd=>{if(nd.dead)return;idx.set(nd,ni++);N.push(nd);for(const k of nd.kids)walk(k)};for(const r of m.roots)walk(r);
  for(const a of m.attrs){if(a.dead||!idx.has(a.node))continue;const me=idx.get(a.node);if(!first.has(me))first.set(me,A.length);A.push([a.nr,(a.type|(a.b.length<<6))>>>0,me]);V.push(a.b)}
  N.forEach((nd,i)=>{N[i]=[nd.nr,first.has(i)?first.get(i):-1,nd.parent?idx.get(nd.parent):-1]});
  const nb=new Uint8Array(N.length*12),nv=new DataView(nb.buffer);N.forEach(([a,b,c],i)=>{nv.setUint32(i*12,a,true);nv.setInt32(i*12+4,b,true);nv.setInt32(i*12+8,c,true)});
  const ab=new Uint8Array(A.length*12),av=new DataView(ab.buffer);A.forEach(([a,b,c],i)=>{av.setUint32(i*12,a,true);av.setUint32(i*12+4,b,true);av.setInt32(i*12+8,c,true)});
  const vb=cat(V),lz=(m.cf&15)===2,secs=[[namesBytes(m),false],[nb,true],[ab,true],[vb,true]].map(([b,ch])=>[b,!lz?b:ch&&m.ver>=2?lz4FrameCompress(b):lz4Compress(b)]);
  const hd=new Uint8Array(48),hv=new DataView(hd.buffer);hv.setUint32(0,0x464F534C,true);hv.setUint32(4,m.ver,true);hv.setUint32(8,m.eng,true);
  secs.forEach(([raw,c],i)=>{hv.setUint32(12+i*8,raw.length,true);hv.setUint32(16+i*8,lz?c.length:0,true)});hd[44]=lz?m.cf:0;hv.setUint32(48-4,0,true);hd[44]=lz?m.cf:0;
  const meta=new Uint8Array(52);meta.set(hd.subarray(0,44));meta[44]=lz?m.cf:0;new DataView(meta.buffer).setUint32(48,m.fmt,true);
  return {bytes:cat([meta,...secs.map(s=>s[1])]),raw:{nodes:nb,attrs:ab,values:vb}}}
/* LSPK v13 package as the game writes it: files in their original order, untouched files copied byte for byte,
   changed files zlib-compressed (flag 0x21), 0x40 padding with 0xAD, CRC32 per file, MD5 over sorted uncompressed files plus one per byte */
export async function deflate(u8){const cs=new CompressionStream('deflate'),w=cs.writable.getWriter();w.write(u8);w.close();return new Uint8Array(await new Response(cs.readable).arrayBuffer())}
export async function lsvWrite(files,pkgFlags=0,priority=0){const parts=[],ents=[],enc=new TextEncoder();let pos=0;
  for(const f of files){let c,flags,size;if(f.comp&&!f.changed){c=f.comp;flags=f.flags;size=f.size}else{c=await deflate(f.data);flags=0x21;size=f.data.length}
    parts.push(c);ents.push({name:f.name,off:pos,disk:c.length,size,flags,crc:crc32(c)});pos+=c.length;const pad=(64-pos%64)%64;if(pad){parts.push(new Uint8Array(pad).fill(0xAD));pos+=pad}}
  const fl=new Uint8Array(ents.length*280),fv=new DataView(fl.buffer);ents.forEach((e,i)=>{const o=i*280;fl.set(enc.encode(e.name).subarray(0,255),o);fv.setUint32(o+256,e.off,true);fv.setUint32(o+260,e.disk,true);fv.setUint32(o+264,e.size,true);fv.setUint32(o+268,0,true);fv.setUint32(o+272,e.flags,true);fv.setUint32(o+276,e.crc,true)});
  const cfl=lz4Compress(fl),listOff=pos,cnt=new Uint8Array(4);new DataView(cnt.buffer).setUint32(0,ents.length,true);parts.push(cnt,cfl);pos+=4+cfl.length;
  const sorted=[...files].sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0),hash=md5(sorted.map(f=>f.data));for(let i=0;i<16;i++)hash[i]=(hash[i]+1)&255;
  const h=new Uint8Array(40),hv=new DataView(h.buffer);hv.setUint32(0,13,true);hv.setUint32(4,listOff,true);hv.setUint32(8,4+cfl.length,true);hv.setUint16(12,1,true);h[14]=pkgFlags&~4;h[15]=priority;h.set(hash,16);hv.setUint32(32,40,true);hv.setUint32(36,0x4B50534C,true);
  parts.push(h);return cat(parts)}
export async function lsvFiles(u8){/* every file in a package, decompressed */const v=new DataView(u8.buffer,u8.byteOffset,u8.byteLength),N=u8.length,td=new TextDecoder();if(!(N>8&&v.getUint32(N-4,true)===0x4B50534C))throw new Error('only Definitive Edition saves (package v13) can be written');
  const h=N-v.getInt32(N-8,true),ver=v.getUint32(h,true);if(ver!==13)throw new Error('package version '+ver+' cannot be written');const lo=v.getUint32(h+4,true),ls=v.getUint32(h+8,true),flags=u8[h+14],n=v.getInt32(lo,true),raw=new Uint8Array(n*280);lz4Block(u8,lo+4,lo+ls,raw,0);
  const fs=[],e=new DataView(raw.buffer);for(let i=0;i<n;i++){const o=i*280;let z=0;while(z<256&&raw[o+z])z++;fs.push({name:td.decode(raw.subarray(o,o+z)),off:e.getUint32(o+256,true),disk:e.getUint32(o+260,true),size:e.getUint32(o+264,true),flags:e.getUint32(o+272,true)})}
  if(flags&4){let first=Infinity,last=0,tot=0;for(const x of fs){first=Math.min(first,x.off);last=Math.max(last,x.off+x.disk);tot+=x.size}const all=lz4Frame(u8.subarray(first-7,last),tot);let p=0;for(const x of fs){x.data=all.slice(p,p+x.size);p+=x.size}}
  else for(const x of fs){const r=u8.subarray(x.off,x.off+x.disk);x.comp=r.slice();x.data=(x.flags&15)?await unpack(r,x.size,x.flags,false):x.comp}
  fs.pkgFlags=flags;fs.priority=u8[h+15];return fs}

/* ---------- applying inventory changes to a save tree ---------- */
export const u64r=b=>new DataView(b.buffer,b.byteOffset,8).getBigUint64(0,true),u64b=x=>{const b=new Uint8Array(8);new DataView(b.buffer).setBigUint64(0,BigInt(x),true);return b};
export const i32b=x=>{const b=new Uint8Array(4);new DataView(b.buffer).setInt32(0,x,true);return b},u16b=x=>{const b=new Uint8Array(2);new DataView(b.buffer).setUint16(0,x,true);return b};
export const getA=(nd,n)=>nd.attrs.find(a=>a.name===n&&!a.dead),strA=a=>{if(!a)return '';let e=a.b.length;while(e>0&&!a.b[e-1])e--;return new TextDecoder().decode(a.b.subarray(0,e))};
export function kid(nd,n){return nd.kids.find(k=>k.name===n&&!k.dead)}
export function saveIndex(m){const R=Object.fromEntries(m.roots.map(r=>[r.name,r]));if(!R.Items||!R.Inventories||!R.InventoryViews||!R.EntityWorld||!R.Characters)throw new Error('this save is missing a section the writer needs');
  const IF=kid(R.Items,'ItemFactory'),crs=kid(IF,'Creators').kids.filter(k=>!k.dead),its=kid(IF,'Items').kids.filter(k=>!k.dead);if(crs.length!==its.length)throw new Error('item list and item creators do not line up');
  const items=its.map((nd,i)=>{const c=crs[i];const ot=getA(nd,'OriginalTemplate');if(!Buffer_eq(getA(c,'TemplateID').b,(ot||getA(nd,'CurrentTemplate')).b))throw new Error('item list and item creators do not line up');const am=getA(nd,'Amount'),pa=getA(nd,'Parent'),iv=getA(nd,'Inventory'),sl=getA(nd,'Slot');
    return {nd,cr:c,h:u64r(getA(c,'Handle').b),stats:strA(getA(nd,'Stats')),amount:am?new DataView(am.b.buffer,am.b.byteOffset,4).getInt32(0,true):1,parent:pa&&pa.b.length===8?u64r(pa.b):null,inv:iv&&iv.b.length===8?u64r(iv.b):null,slot:sl?new DataView(sl.b.buffer,sl.b.byteOffset,2).getUint16(0,true):0}});
  const refs=new Map();for(const a of m.attrs){if(a.dead||a.type!==24||a.b.length!==8)continue;const k=u64r(a.b);if(k===0n)continue;let l=refs.get(k);if(!l)refs.set(k,l=[]);l.push(a)}
  const party=[];const walkC=nd=>{if(nd.name==='Character'){const c={nd,pd:0};const sub=x=>{if(x.name==='PlayerData')c.pd=1;for(const a of x.attrs)if(!(a.name in c))c[a.name]=a;for(const k of x.kids)if(k.name!=='Character')sub(k)};sub(nd);
      if(c.pd&&c.IsPlayer&&c.IsPlayer.b[0]===1&&c.InParty&&c.InParty.b[0]===1&&!c.OwnerCharacter&&c.Inventory)party.push({nd,inv:u64r(c.Inventory.b)});return}for(const k of nd.kids)walkC(k)};walkC(R.Characters);
  const byParent=new Map();for(const it of items){if(it.parent==null)continue;let l=byParent.get(it.parent);if(!l)byParent.set(it.parent,l=[]);l.push(it)}
  const inParty=new Set(),seen=new Set(),walk=v=>{if(seen.has(v))return;seen.add(v);for(const it of byParent.get(v)||[]){inParty.add(it);if(it.inv!=null)walk(it.inv)}};party.forEach(p=>walk(p.inv));
  const invCr=kid(kid(R.Inventories,'InventoryFactory'),'Creators').kids.filter(k=>!k.dead),invNd=kid(kid(R.Inventories,'InventoryFactory'),'Inventories').kids.filter(k=>!k.dead);
  const invNode=new Map();invCr.forEach((c,i)=>invNode.set(u64r(getA(c,'Handle').b),invNd[i]));
  return {m,R,IF,items,refs,party,byParent,inParty,invNode}}
/* item templates from a level file: Creator/Item pairs that are not containers */
export function levelTemplates(m){const R=Object.fromEntries(m.roots.map(r=>[r.name,r])),IF=R.Items&&kid(R.Items,'ItemFactory');if(!IF)return [];const crs=kid(IF,'Creators'),its=kid(IF,'Items');if(!crs||!its||crs.kids.length!==its.kids.length)return [];
  const out=[];its.kids.forEach((nd,i)=>{if(getA(nd,'Inventory'))return;const st=strA(getA(nd,'Stats'));if(st)out.push({nd,cr:crs.kids[i],stats:st})});return out}
export function Buffer_eq(a,b){if(a.length!==b.length)return false;for(let i=0;i<a.length;i++)if(a[i]!==b[i])return false;return true}
export function cloneNode(m,src,parent){const nd={nr:nameRef(m,src.name),name:src.name,attrs:[],kids:[],parent};for(const a of src.attrs){if(a.dead)continue;const c={nr:nameRef(m,a.name),name:a.name,type:a.type,b:a.b.slice(),node:nd};nd.attrs.push(c);m.attrs.push(c)}for(const k of src.kids)if(!k.dead)nd.kids.push(cloneNode(m,k,nd));return nd}
export function setA(m,nd,name,type,b,like){let a=getA(nd,name);if(a){a.b=b;if(like)a.type=like.type;return}a={nr:nameRef(m,name),name,type:like?like.type:type,b,node:nd};nd.attrs.push(a);m.attrs.push(a)}
export const SAFE_REF={Creator:'Handle',Component:'Handle',TimeItemAddedToInventory:'MapKey',Items:'Object',Indices:'MapKey'};
export function deleteItem(X,it){const rs=X.refs.get(it.h)||[];for(const a of rs){if(SAFE_REF[a.node.name]!==a.name)return 'it is referenced by '+a.node.name+'.'+a.name}if(it.inv!=null)return 'it is a container';
  for(const a of rs){const n=a.node;if(n.name==='Items')a.b=u64b(0);else if(n.name==='Component'){n.parent.dead=true}else n.dead=true}
  it.nd.dead=true;it.cr.dead=true;it.gone=true;X.inParty.delete(it);return null}
export function setAmount(X,it,n){it.amount=n;setA(X.m,it.nd,'Amount',4,i32b(n))}
export function cloneItem(X,tpl,owner,amount){const m=X.m,inv=owner.inv,sibs=(X.byParent.get(inv)||[]).filter(s=>!s.gone&&s.slot>=15);if(!sibs.length)return [null,'the character has no other items to copy the layout from'];
  const pre=s=>s.split('_').slice(0,2).join('_'),p1=s=>s.split('_')[0],sib=sibs.find(s=>pre(s.stats)===pre(tpl.stats))||sibs.find(s=>p1(s.stats)===p1(tpl.stats))||sibs[0];
  let idx=0;for(const it of X.items)idx=Math.max(idx,Number(it.h&0xFFFFFFFFn));const h=(0x800001n<<32n)|BigInt(idx+1);if(X.refs.has(h))return [null,'could not find a free item id'];
  const CRS=kid(X.IF,'Creators'),ITS=kid(X.IF,'Items');const cr=cloneNode(m,tpl.cr,CRS);setA(m,cr,'Handle',24,u64b(h));const uu=getA(cr,'UUID');if(uu){const r=(window.crypto||crypto).getRandomValues(new Uint8Array(16));r[6]=(r[6]&15)|64;r[8]=(r[8]&63)|128;uu.b=r}CRS.kids.push(cr);
  const nd=cloneNode(m,tpl.nd,ITS);ITS.kids.push(nd);
  for(const n of ['Parent']){setA(m,nd,n,24,u64b(inv))}let slot=15;for(const s of X.byParent.get(inv)||[])if(!s.gone)slot=Math.max(slot,s.slot+1);setA(m,nd,'Slot',3,u16b(slot));
  for(const n of ['owner','OriginalOwnerCharacter','Flags','Translate','Level','Global']){const a=getA(sib.nd,n);if(a)setA(m,nd,n,a.type,a.b.slice(),a);else{const b=getA(nd,n);if(b)b.dead=true}}
  for(const n of ['UnsoldGenerated','TreasureGenerated','Inventory'])(getA(nd,n)||{}).dead=true;setA(m,nd,'Amount',4,i32b(amount));
  const ent=(X.refs.get(sib.h)||[]).find(a=>a.node.name==='Component');if(ent){const e=cloneNode(m,ent.node.parent,ent.node.parent.parent);setA(m,kid(e,'Component'),'Handle',24,u64b(h));ent.node.parent.parent.kids.push(e)}
  const ivn=X.invNode.get(inv);if(ivn){const t=(X.refs.get(sib.h)||[]).find(a=>a.node.name==='TimeItemAddedToInventory'&&a.node.parent===ivn)||(X.refs.get(sib.h)||[]).find(a=>a.node.name==='TimeItemAddedToInventory');
    if(t){const c=cloneNode(m,t.node,ivn);setA(m,c,'MapKey',24,u64b(h));ivn.kids.push(c)}}
  let views=0;for(const a of X.refs.get(sib.h)||[]){if(a.node.name!=='Indices'||a.dead||a.node.dead)continue;const V=a.node.parent,cells=V.kids.filter(k=>k.name==='Items'&&!k.dead);
    let pos=cells.findIndex(c=>u64r(getA(c,'Object').b)===0n);if(pos<0){const c=cloneNode(m,cells[cells.length-1],V);setA(m,c,'Object',24,u64b(h));const last=V.kids.lastIndexOf(cells[cells.length-1]);V.kids.splice(last+1,0,c);pos=cells.length}else getA(cells[pos],'Object').b=u64b(h);
    const ic=cloneNode(m,a.node,V);setA(m,ic,'MapKey',24,u64b(h));const mv=getA(ic,'MapValue');mv.b=mv.b.length===8?u64b(pos):i32b(pos);V.kids.splice(V.kids.indexOf(a.node)+1,0,ic);views++}
  const it={nd,cr,h,stats:tpl.stats,amount,parent:inv,inv:null,slot};X.items.push(it);X.inParty.add(it);(X.byParent.get(inv)||X.byParent.set(inv,[]).get(inv)).push(it);X.refs.set(h,[]);return [it,null,views]}
/* want: {guideKey: count}; keyOf(stats) -> guideKey|null. Returns what was done and what could not be done. */
export function saveApply(X,want,keyOf,extra=[]){const done=[],warn=[],have={},stacks={};for(const it of X.inParty){const k=keyOf(it.stats);if(!k)continue;have[k]=(have[k]||0)+it.amount;(stacks[k]=stacks[k]||[]).push(it)}
  const main=X.party.map(p=>({p,n:(X.byParent.get(p.inv)||[]).length})).sort((a,b)=>b.n-a.n)[0];if(!main)throw new Error('no party members found');
  for(const k of new Set([...Object.keys(have),...Object.keys(want)])){const d=(want[k]||0)-(have[k]||0);if(!d)continue;
    if(d<0){let need=-d;const ss=(stacks[k]||[]).filter(s=>s.slot>=15||true).sort((a,b)=>a.amount-b.amount);
      for(const s of ss){if(!need)break;if(s.amount>need){setAmount(X,s,s.amount-need);done.push(['less',k,need,s.stats]);need=0;break}
        const why=deleteItem(X,s);if(why){if(s.amount>1){const t=s.amount-1;setAmount(X,s,1);done.push(['less',k,t,s.stats]);need-=t}warn.push([k,'kept 1 '+s.stats+' because '+why]);continue}done.push(['less',k,s.amount,s.stats]);need-=s.amount}
      if(need)warn.push([k,'could not remove '+need])}
    else{const ss=(stacks[k]||[]).filter(s=>!s.gone).sort((a,b)=>b.amount-a.amount);if(ss.length){setAmount(X,ss[0],ss[0].amount+d);done.push(['more',k,d,ss[0].stats]);continue}
      const tpl=X.items.find(it=>!it.gone&&it.inv==null&&keyOf(it.stats)===k)||extra.find(it=>keyOf(it.stats)===k);if(!tpl){warn.push([k,'no copy of this item anywhere in the save to create it from']);continue}
      const [it,why,views]=cloneItem(X,tpl,main.p,d);if(!it){warn.push([k,why]);continue}done.push(['new',k,d,tpl.stats,views])}}
  return {done,warn}}
export function zipStore(name,data){const enc=new TextEncoder().encode(name),crc=crc32(data),lh=new Uint8Array(30+enc.length),lv=new DataView(lh.buffer);
  lv.setUint32(0,0x04034b50,true);lv.setUint16(4,20,true);lv.setUint16(8,0,true);lv.setUint32(14,crc,true);lv.setUint32(18,data.length,true);lv.setUint32(22,data.length,true);lv.setUint16(26,enc.length,true);lh.set(enc,30);
  const ch=new Uint8Array(46+enc.length),cv=new DataView(ch.buffer);cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,enc.length,true);cv.setUint32(42,0,true);ch.set(enc,46);
  const end=new Uint8Array(22),ev=new DataView(end.buffer);ev.setUint32(0,0x06054b50,true);ev.setUint16(8,1,true);ev.setUint16(10,1,true);ev.setUint32(12,ch.length,true);ev.setUint32(16,lh.length+data.length,true);return cat([lh,data,ch,end])}
const SKEYS = {}
/** save stats id → item key (cached) */
export function statKey(s){if(s in SKEYS)return SKEYS[s];const map=nameMap();let k=null;for(const n of statName(s)){const nk=nkey(n);k=map[nk]||map['any'+nk]||map[nk.replace(/s$/,'')];if(k)break}return SKEYS[s]=k||null}
/** item keys that have a copy in the save's level files (trader and world loot) */
export async function levelCreatable(u8){const files=await lsvFiles(u8),add=new Set();for(const f of files){if(!/^levelcache\/.*\.lsf$/i.test(f.name))continue;const inv=lsfInventory(await lsfRead(f.data));for(const it of inv.items){const k=it.Stats&&statKey(it.Stats);if(k)add.add(k)}}return [...add]}
