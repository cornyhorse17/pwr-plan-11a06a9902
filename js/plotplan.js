/* Simplified plot plan geometry and the four route options.
   Units are plan units (about 1 unit = 1.1 m). North is up (approximate).
   Positions are relative and simplified; small equipment is drawn larger than scale.
   Text entries: [text, x, y, size, weight, anchor]. */
window.PLOT=(function(){
"use strict";

const VIEWS={route:[-8,340,816,655], site:[-12,-8,980,1000]};

/* Ground: fence, road, reserve area */
const FENCE="30,40 640,40 640,318 920,318 920,598 897,598 897,958 4,896 8,598 30,598";

/* Blocks. r = rectangles [x,y,w,h], c = circles [cx,cy,r], k = kind, t = labels, info = text shown when selected */
const BLOCKS=[
 {id:"res",n:"Reserve area",k:"res",r:[[575,606,318,345]],t:[["Reserve area",735,780,10,400]]},
 {id:"dsl",n:"Diesel oil storage",k:"tank",r:[[222,62,246,82]],c:[[262,103,28],[345,103,28],[428,103,28]],t:[["Diesel oil storage",345,56,9,400]]},
 {id:"rfw",n:"Raw and fire water tanks and pump house",k:"water",c:[[505,85,12],[505,122,12]],r:[[495,150,16,34]],t:[["Raw and fire water",522,107,9,400,"start"]]},
 {id:"pond",n:"Emergency storage pond",k:"water",r:[[678,62,58,212]],t:[["Emergency",707,163,9,400],["pond",707,175,9,400]]},
 {id:"gds",n:"Gas distribution station, outside the site fence",k:"off",r:[[850,8,95,92]],t:[["Gas distribution",897,50,9,400],["station (off site)",897,62,9,400]]},
 {id:"wtp",n:"Water treatment and demineralisation plant",k:"bld",r:[[560,173,55,180]],t:[["Water",587,250,9,600],["treatment",587,262,9,600],["and demin",587,274,9,600]],
  info:"Raw water treatment and the demineralisation chain. Winter firing of GT11 needs auxiliary steam, and the auxiliary boiler needs demineralised water, so this chain has to run from the Block 1 boards. It is outside this plan."},
 {id:"dmt",n:"Demineralised and service water tanks",k:"water",c:[[544,193,9],[544,216,9],[542,246,13],[542,280,13]]},
 {id:"wps",n:"Water pump station",k:"bld",r:[[495,225,16,45]]},
 {id:"dp10",n:"10 kV distribution point",k:"bld",r:[[513,312,17,28]]},
 {id:"wwt",n:"Waste water treatment",k:"bld",r:[[48,203,60,64]],t:[["Waste water",78,232,8.5,400],["treatment",78,243,8.5,400]]},
 {id:"wsh",n:"Workshop and store",k:"bld",r:[[120,303,50,44]],t:[["Workshop",145,328,8.5,400]]},
 {id:"acc2",n:"Air cooled condenser 2",k:"eq",r:[[213,262,70,98]],t:[["Air cooled",248,308,9,400],["condenser 2",248,320,9,400]]},
 {id:"cep",n:"Condensate pump building",k:"bld",r:[[313,262,40,83]],t:[["Condensate",333,301,7,400],["pumps",333,311,7,400]]},
 {id:"acc1",n:"Air cooled condenser 1",k:"eq",r:[[387,262,72,98]],t:[["Air cooled",423,308,9,400],["condenser 1",423,320,9,400]]},
 {id:"mb",n:"Main building",k:"shell",r:[[148,400,344,133]],t:[["Main building",235,425,11,700],["Block 2",235,468,10,400],["GT21, GT22, steam turbine",235,481,7.5,400],["Block 1",356,425,10,700]]},
 {id:"st1",n:"Steam turbine, Block 1",k:"eq",r:[[326,470,56,56]],t:[["Steam",354,496,9,400],["turbine",354,507,9,400]]},
 {id:"hrsg12",n:"Heat recovery steam generator of GT12",k:"eq",r:[[392,406,46,62]],c:[[415,421,7]],t:[["HRSG",415,452,9,400]]},
 {id:"gt12",n:"Gas turbine GT12 and generator",k:"eq",r:[[392,474,46,54]],t:[["GT12",415,505,10,400]]},
 {id:"hrsg11",n:"Heat recovery steam generator of GT11",k:"eq",r:[[444,406,44,62]],c:[[466,421,7]],t:[["HRSG",466,452,9,400]]},
 {id:"gt11",n:"Gas turbine GT11 and generator",k:"eq",r:[[444,474,44,54]],t:[["GT11",466,498,11,700],["generator",466,510,7.5,400]],
  info:"GT11 synchronises at its generator breaker. Export under Option B runs in reverse to 220 kV and needs its own KEGOC approval."},
 {id:"leb2",n:"Electrical building, Block 2",k:"bld",r:[[73,503,75,30]],t:[["Electrical bldg 2",110,521,7.5,400]]},
 {id:"leb1",n:"Electrical building, Block 1",k:"shell",r:[[492,481,80,52]],t:[["Electrical building, Block 1",534,477,8,600]]},
 {id:"mv",n:"Block 1 10 kV boards",k:"eq",r:[[496,486,34,42]],t:[["10 kV",513,511,9,700]],
  info:"Block 1 10 kV boards. Incomers closed after voltage and phase rotation checks. Site tests are in progress; signed records are to be held before energisation."},
 {id:"lv",n:"Block 1 0.4 kV boards",k:"eq",r:[[536,486,32,42]],t:[["0.4 kV",552,511,8.5,700]],
  info:"Block 1 0.4 kV boards, fed from the 10 kV boards through the auxiliary transformers. DC and UPS supplies belong to the same step."},
 {id:"ffc2",n:"Closed cooling water, Block 2",k:"eq",r:[[107,393,18,54],[65,400,17,35]]},
 {id:"cool",n:"Closed cooling water: fin fan cooler and pump building, Block 1",k:"eq",r:[[525,393,18,54],[570,397,17,36]],t:[["Cooling water",557,387,8.5,400]],
  info:"Closed cooling water for Block 1: fin fan cooler and pump building. Supplied from the Block 1 boards."},
 {id:"auxb",n:"Auxiliary boiler",k:"bld",r:[[617,397,23,60]],t:[["Auxiliary",629,468,8.5,600],["boiler",629,478,8.5,600]],
  info:"Auxiliary boiler. Winter firing of GT11 needs auxiliary steam, so the boiler and its water chain run from the Block 1 boards before first firing. It is outside this plan."},
 {id:"fgs",n:"Fuel gas system area",k:"eq",r:[[680,358,55,105]],t:[["Fuel gas",707,407,9.5,600],["system",707,419,9.5,600]],
  info:"Fuel gas treatment for the gas turbines, supplied from the gas distribution station outside the fence."},
 {id:"hws",n:"Hot water building",k:"bld",r:[[598,492,52,18]]},
 {id:"twt",n:"Treated water tank",k:"water",r:[[693,500,67,83]],t:[["Treated",726,540,8.5,400],["water tank",726,551,8.5,400]]},
 {id:"adm",n:"Administration building",k:"bld",r:[[780,395,90,140]],t:[["Administration",825,468,9,400]]},
 {id:"gate",n:"Main entrance",k:"bld",r:[[902,545,18,38]]},
 {id:"otr",n:"Step-up and auxiliary transformers of the other units",k:"eq",
  r:[[173,560,30,26],[232,560,30,26],[273,560,30,26],[336,560,30,26],[398,560,30,26],[180,543,16,12],[239,543,16,12],[405,543,16,12]],
  t:[["GT22",188,576,7,400],["GT21",247,576,7,400],["ST",288,576,7,400],["ST",351,576,7,400],["GT12",413,576,7,400]]},
 {id:"gcb",n:"Generator breaker of GT11",k:"eq",r:[[461,532,10,9]],t:[["GCB",457,540,7,400,"end"]],
  info:"Generator breaker. It stays open while grid power is received, so the generator is not energised. GT11 later synchronises here."},
 {id:"gsut11",n:"Generator step-up transformer GSUT11",k:"eq",r:[[455,560,44,30]],t:[["GSUT11",477,579,9.5,700]],
  info:"GSUT11, 250 MVA. Energised from the 500 kV bus with the generator breaker open. No on-load tap changer, so the bus voltage must be right first."},
 {id:"uat11",n:"Unit auxiliary transformer UAT11",k:"eq",r:[[490,538,30,16]],t:[["UAT11",505,549.5,8,700]],
  info:"UAT11. Energised together with GSUT11 through the busduct. Its tap changer corrects the 10 kV level."},
 {id:"bkt",n:"Back-up transformer",k:"eq",r:[[533,562,30,26]],t:[["Back-up",567,573,7.5,400,"start"],["transformer",567,582,7.5,400,"start"]],
  info:"Design alternative: the autotransformer tertiary feeds a back-up transformer and the 10 kV back-up boards. It needs no 500 kV energisation, but its status on site is not known."},
 {id:"bsdg",n:"Black start diesel generators",k:"eq",r:[[600,538,62,22]],t:[["Black start diesels",631,552,7,400]]},
 {id:"sw220",n:"220 kV switchyard",k:"yard",r:[[12,606,156,292]],t:[["220 kV switchyard",90,628,11.5,700]],
  info:"One line bay, one bus section with voltage transformers, and the autotransformer bay. Protection, interlocking, control and metering proven for these bays."},
 {id:"sw500",n:"500 kV switchyard",k:"yard",r:[[295,606,270,309]],t:[["500 kV switchyard",452,907,11.5,700]],
  info:"Autotransformer diameter and GT11 diameter in service. Under Option B the line bays to the 500 kV grid stay isolated and locked. Busbar protection and breaker failure proven."},
 {id:"ocp",n:"Switchyard control point",k:"bld",r:[[300,610,20,56]],t:[["Control point",293,622,7.5,400,"end"]]},
 {id:"at",n:"Autotransformer bank",k:"eq",r:[[318,772,24,22],[318,798,24,22],[318,824,24,22]],t:[["Autotransformer",232,798,10.5,700],["3 x 167 MVA bank",232,825,8.5,400]],
  info:"Three single-phase units and a spare. Site tests signed, oil results, tap position agreed, cooling and trips proven, fire protection in service, tertiary in a defined state."},
 {id:"atsp",n:"Autotransformer spare unit",k:"spare",r:[[318,856,24,18]]},
 {id:"tert",n:"Autotransformer tertiary equipment",k:"eq",r:[[324,752,12,10]],
  info:"Tertiary winding equipment: reactor, voltage transformer, disconnector, arresters. If the tertiary is not used it needs a defined state with its protection in service."},
 {id:"l220",n:"220 kV line to the grid",k:"line",r:[[63,951,14,14]],t:[["220 kV line to the grid",83,962,9,600,"start"]],
  info:"The line must be physically connected, its remote end protected and its use allowed by KEGOC. Which line is used is not yet confirmed."},
 {id:"l500",n:"500 kV lines to the grid",k:"line",r:[[528,960,14,14],[545,960,14,14]],t:[["500 kV lines to the grid",566,971,9,600,"start"]],
  info:"Baseline source. Not connected today. Under Option B these bays stay isolated until the lines are released."}
];

/* Decorative conductors inside the yards (not part of any route highlight) */
const DECOR=[
 [[28,700],[152,700]],[[28,712],[152,712]],
 [[40,712],[40,880]],[[100,712],[100,880]],[[124,712],[124,880]],
 [[52,700],[52,646]],[[84,700],[84,646]],[[116,700],[116,646]],
 [[385,640],[385,890]],[[505,640],[505,890]],
 [[385,660],[505,660]],[[385,745],[505,745]],[[385,830],[505,830]],
 [[470,745],[470,757],[552,757],[552,960]],
 [[880,100],[880,335],[707,335],[707,358]]
];
const DOTS=[[440,660],[470,660],[470,745],[425,830],[70,712],[140,712],[466,546]];

/* Route segments, drawn in the direction of power receiving. A leading "-" in a step reverses the flow. */
const SEG={
 l220:[[70,951],[70,712]],
 y220:[[70,712],[140,712],[140,809],[318,809]],
 atl:[[342,809],[425,809],[425,830]],
 bus500:[[425,830],[505,830],[505,660],[440,660]],
 fd11:[[440,660],[440,622],[477,622],[477,590]],
 l500:[[535,960],[535,672],[470,672],[470,660]],
 dia11:[[470,660],[440,660]],
 ipb:[[466,560],[466,546]],
 uatc:[[466,546],[490,546]],
 mvc:[[505,538],[505,528]],
 lvc:[[530,507],[536,507]],
 gen:[[466,528],[466,546]],
 ter:[[330,772],[330,602],[548,602],[548,588]],
 bkc:[[548,562],[548,548],[525,548],[525,528]]
};

const AUX={t:"Plant auxiliaries for winter firing",b:["auxb","wtp","dmt","fgs","cool"],s:[],st:"Not assessed here",lead:"",
 need:"The boards supply the auxiliary boiler, the water treatment and demineralisation chain, the fuel gas system and cooling. Winter firing of GT11 needs auxiliary steam. These systems are outside this plan."};
const LINE220={t:"220 kV line from the grid",b:["l220"],s:["l220"],st:"Open with KEGOC",lead:"PGU, KEGOC",
 need:"Which line is used is not yet confirmed. The line must be physically connected, its remote end protected, and KEGOC must allow it to be made live under a staged scheme."};
const YARD220={t:"220 kV switchyard: line bay, bus section, autotransformer bay",b:["sw220"],s:["y220"],st:"Stated complete, records to check",lead:"DE",
 need:"Signed completion and site test records for the bays actually used. Line, busbar and bay protection, interlocking, control and metering proven for these bays. The latest test record seen shows no result for them."};

const MODES={
 a:{label:"Baseline: 500 kV",title:"Option A, baseline: power through the 500 kV switchyard",
  text:"Grid power arrives on the 500 kV lines and reaches the Block 1 boards through GSUT11 and UAT11. The 220 kV side and the autotransformer are not needed. This baseline is not changed by the plan.",
  dates:[["27 Nov","500 kV switchyard live (Employer plan)"],["30 Nov","10 kV and 0.4 kV boards live (Employer plan)"],["22 Dec","GT11 first synchronisation (baseline target)"]],
  cond:["The 500 kV grid connection is not yet in place: line works and remote-end works.","KEGOC acceptance of the 500 kV scheme described in the connection conditions.","Signed test records for the 500 kV path and the Block 1 path."],
  steps:[
   {t:"500 kV lines from the grid",b:["l500"],s:["l500"],st:"Not connected today",lead:"PGU, KEGOC",need:"Line sections connected and released by KEGOC, with the remote ends in service. Status is not established from documents."},
   {t:"500 kV switchyard: line bay, bus, GT11 diameter",b:["sw500","ocp"],s:["dia11"],st:"In progress",lead:"DE",need:"Signed completion and test records. Busbar protection, bay control, breaker failure and synchronism check: relay tests are recorded, signed protocols are to be handed over. A number of field connections were still open in October."},
   {t:"GSUT11 with UAT11, generator breaker open",b:["gsut11","uat11","gcb"],s:["fd11","ipb","uatc"],st:"Stated complete, records to check",lead:"DE",need:"Signed individual test records, tap positions and oil results. Protection panels with trip tests to the 500 kV breakers and the 10 kV incomers."},
   {t:"Block 1 10 kV boards",b:["mv","leb1"],s:["mvc"],st:"In progress",lead:"Integra",need:"Site tests in progress; signed records held before energisation. Incomers closed after voltage and phase rotation checks."},
   {t:"Block 1 0.4 kV boards",b:["lv"],s:["lvc"],st:"In progress",lead:"Integra",need:"Fed from the 10 kV boards through the auxiliary transformers. DC and UPS supplies in service."},
   AUX]},
 b:{label:"220 kV receiving via autotransformer",title:"Option B: power receiving through 220 kV and the autotransformer",
  text:"Grid power flows from a 220 kV line through the 220 kV switchyard and the autotransformer to the 500 kV bus, which has no grid connection of its own, then to GSUT11, UAT11 and the Block 1 boards. This is a plan to receive power, not a statement of readiness.",
  dates:"b",
  cond:["A 220 kV line is physically connected and KEGOC allows it to be made live under a staged scheme.","Signed completion and site test records exist for the 220 kV switchyard, the autotransformer and their protection and control cabinets.","Protection settings for the staged network are calculated and agreed with KEGOC.","Commercial metering is accepted and an import arrangement exists.","None of these conditions is evidenced today. There is no float on the test chain."],
  steps:[
   LINE220,YARD220,
   {t:"Autotransformer energised from 220 kV, 500 kV side open",b:["at","tert"],s:[],st:"Stated complete, records to check",lead:"DE",task:"B20",need:"Site tests signed, oil results, tap position agreed, cooling and trips proven, main and backup protection tested, fire protection in service, tertiary in a defined state. Then a hold period with checks."},
   {t:"500 kV bus energised through the autotransformer diameter",b:["sw500","ocp"],s:["atl","bus500"],st:"In progress",lead:"DE",task:"B21",task2:"B22",need:"Autotransformer diameter and GT11 diameter in service. Line bays to the 500 kV grid isolated, earthed and locked. Busbar protection and breaker failure proven. Bus voltage checked before the next step, then the hold period for the switchyard."},
   {t:"GSUT11 with UAT11, generator breaker open",b:["gsut11","uat11","gcb"],s:["fd11","ipb","uatc"],st:"Stated complete, records to check",lead:"DE",task:"B23",need:"Energised from the 500 kV bus together with the busduct and UAT11. GSUT11 has no on-load tap changer, so the bus voltage must be right first. Hold period assumed at 24 hours."},
   {t:"Block 1 10 kV boards",b:["mv","leb1"],s:["mvc"],st:"In progress",lead:"Integra",task:"B24",need:"Site tests in progress; signed records held before energisation. Incomers closed after voltage and phase rotation checks."},
   {t:"Block 1 0.4 kV boards",b:["lv"],s:["lvc"],st:"In progress",lead:"Integra",task:"B25",need:"Fed from the 10 kV boards through the auxiliary transformers. DC and UPS supplies in service."},
   AUX]},
 r:{label:"GT11 export in reverse to 220 kV",title:"Option B: GT11 export in reverse to 220 kV",
  text:"GT11 output flows through GSUT11 and the 500 kV bus, down through the autotransformer and out on the 220 kV line. The autotransformer bank is rated well above one gas turbine; the governing condition is KEGOC approval of the staged scheme and its protection settings.",
  dates:"r",
  cond:["Power receiving complete and the GT11 start-up chain finished.","KEGOC approval of GT11 export through 220 kV under a staged scheme; review time is not known.","KEGOC mode calculation for export on the 220 kV line.","Protection settings rechecked for the reversed source and agreed.","Emergency control automation in service, or formally waived by KEGOC."],
  steps:[
   {t:"GT11 generator synchronised at the generator breaker",b:["gt11","gcb"],s:["gen"],st:"After power receiving",lead:"DE",need:"The generator breaker is the synchronising point while the 500 kV side has no grid connection. Dead-bus and synchronism check logic tested."},
   {t:"GSUT11",b:["gsut11"],s:["-ipb"],st:"Stated complete, records to check",lead:"DE",need:"Already live from power receiving. Its protection settings are part of the staged-network check."},
   {t:"500 kV bus: GT11 diameter to autotransformer diameter",b:["sw500","ocp"],s:["-fd11","-bus500"],st:"In progress",lead:"DE",need:"Line bays to the 500 kV grid stay isolated until the lines are released. The permitted closing condition for every breaker is stated in the switching programme."},
   {t:"Autotransformer, power flowing from 500 kV to 220 kV",b:["at","tert"],s:["-atl"],st:"Stated complete, records to check",lead:"DE",need:"One gas turbine is well below the bank rating, so thermal loading is not the limit. Directional backup elements see a reversed source; settings recalculated, agreed and verified by secondary injection."},
   {t:"220 kV switchyard",b:["sw220"],s:["-y220"],st:"Open with KEGOC",lead:"DE",need:"Overload relief and generation limitation automation in service, or formally waived by KEGOC, before any export."},
   {t:"220 kV line to the grid",b:["l220"],s:["-l220"],st:"Open with KEGOC",lead:"PGU, KEGOC",need:"KEGOC approval of export under the staged scheme. Limits come from the 220 kV line and from system conditions, not from the autotransformer."}]},
 t:{label:"Autotransformer tertiary and back-up transformer",title:"Design alternative: autotransformer tertiary and back-up transformer",
  text:"The autotransformer tertiary feeds the back-up transformer and the 10 kV boards without energising the 500 kV switchyard, GSUT11 or UAT11. The route is shown in the design; its status on site is not known.",
  dates:[],
  cond:["Shown in the design only. The site status of the tertiary equipment, the cable and the back-up transformer is not known.","It gives no export route: the 500 kV switchyard is still needed before GT11 can synchronise.","A question to the consortium leader, not a planned route. No dates are set."],
  steps:[
   LINE220,YARD220,
   {t:"Autotransformer energised from 220 kV, 500 kV side stays open",b:["at"],s:[],st:"Stated complete, records to check",lead:"DE",need:"Same prerequisites as in Option B: signed site tests, protection tested, fire protection in service."},
   {t:"Tertiary equipment and cable",b:["tert"],s:["ter"],st:"Shown in design only",lead:"DE",need:"Tertiary reactor, voltage transformer, disconnector, arresters and the cable to the back-up transformer, with their protection."},
   {t:"Back-up transformer",b:["bkt"],s:[],st:"Shown in design only",lead:"DE",need:"Individual tests, tap changer, protection and trips. Status on site is not known."},
   {t:"10 kV back-up boards, then Block 1 10 kV boards",b:["mv","leb1"],s:["bkc"],st:"Not known",lead:"DE, Integra",need:"Back-up incomers and the transfer logic to the block boards tested."},
   {t:"Block 1 0.4 kV boards",b:["lv"],s:["lvc"],st:"In progress",lead:"Integra",need:"Fed from the 10 kV boards through the auxiliary transformers."}]}
};

return {VIEWS:VIEWS,FENCE:FENCE,BLOCKS:BLOCKS,DECOR:DECOR,DOTS:DOTS,SEG:SEG,MODES:MODES};
})();
