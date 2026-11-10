/* Simplified single-line diagram of Block 1: geometry only.
   Redrawn for orientation; busbars, breakers, transformers and the GT11 path.
   Segment names match the plot plan where the same connection exists, so one option drives both views.
   Shapes: ["bus",x1,y,x2] ["cb",x,y] ["tr",x,y,"v"|"h"] ["g",x,y,letter] ["box",x,y,w,h,text] ["src",x,y] ["ln",[[x,y],...]]
   Text: [text,x,y,anchor]. */
window.SLD=(function(){
"use strict";

/* Elements. info = key in the shared element data, b = plot plan blocks that stand for the same element. */
const ELS=[
 {id:"l220",info:"l220",b:["l220"],sh:[["src",80,30]],t:[["220 kV line",92,34,"start"]]},
 {id:"sw220",info:"sw220",b:["sw220"],sh:[["bus",40,100,210],["cb",80,70],["cb",170,130]],t:[["220 kV bus section",100,92,"start"]]},
 {id:"at",info:"at",b:["at"],sh:[["tr",240,165,"h"]],t:[["Autotransformer",240,143,"middle"]]},
 {id:"sw500",info:"sw500",b:["sw500"],sh:[["bus",320,100,650],["bus",320,240,650],
   ["cb",350,122],["cb",350,170],["cb",350,218],["cb",480,122],["cb",480,170],["cb",480,218],["cb",610,122],["cb",610,170],["cb",610,218]],
  t:[["500 kV bus 1",320,92,"start"],["500 kV bus 2",320,258,"start"]]},
 {id:"l500",info:"l500",b:["l500"],sh:[["src",505,30]],t:[["500 kV lines",517,34,"start"]]},
 {id:"gsut",info:"gsut",b:["gsut11"],sh:[["tr",635,312,"v"]],t:[["GSUT11",653,316,"start"]]},
 {id:"gcb",info:"gcb",b:["gcb"],sh:[["cb",635,385]],t:[["Generator breaker",647,389,"start"]]},
 {id:"gen",info:"gen",b:["gt11"],sh:[["g",635,426,"G"]],t:[["GT11",655,430,"start"]]},
 {id:"uat",info:"uat",b:["uat11"],sh:[["tr",560,404,"v"],["cb",560,446]],t:[["UAT11",542,408,"end"]]},
 {id:"mv",info:"mv",b:["mv"],sh:[["bus",430,470,700]],t:[["10 kV unit",707,468,"start"],["board, GT11",707,481,"start"]]},
 {id:"lv",info:"lv",b:["lv"],sh:[["cb",560,490],["tr",560,516,"v"],["bus",520,548,620]],t:[["0.4 kV boards",514,552,"end"]]},
 {id:"loads",info:"loads",b:[],sh:[["ln",[[540,548],[540,568]]],["ln",[[570,548],[570,568]]],["ln",[[600,548],[600,568]]]],t:[["Auxiliaries, DC and UPS",570,582,"middle"]]},
 {id:"sfc",info:"sfc",b:[],sh:[["cb",660,488],["box",638,506,44,22,"SFC"]],t:[["Starting",690,515,"start"],["converter",690,527,"start"]]},
 {id:"bkt",info:"bkt",b:["bkt"],sh:[["tr",240,320,"v"]],t:[["Back-up transformer",257,324,"start"]]},
 {id:"bkb",info:"bkb",b:[],sh:[["cb",240,358],["bus",200,380,290],["cb",270,410]],t:[["10 kV back-up boards",297,384,"start"]]},
 {id:"b34",info:"b34",b:[],sh:[["bus",240,440,330]],t:[["Block 1 10 kV boards,",337,438,"start"],["steam cycle",337,451,"start"]]},
 {id:"cmn",info:"cmn",b:["cmn"],sh:[["bus",60,560,250],["bus",280,560,400],["cb",265,560]],t:[["10 kV common board A",60,550,"start"],["B",400,550,"end"]]},
 {id:"ctie",info:"ctie",b:[],sh:[["cb",220,540],["cb",460,495]],t:[["Tie feeder",340,513,"middle"]]},
 {id:"dg",info:"dg",b:["bsdg"],sh:[["cb",100,582],["cb",150,582],["cb",310,582],["cb",360,582],["g",100,614,"G"],["g",150,614,"G"],["g",310,614,"G"],["g",360,614,"G"]],
  t:[["Black start diesel generators, 4 x 2 MW",230,645,"middle"]]}
];

/* Connections that can carry a route, drawn in the direction of power receiving. */
const SEG={
 l220:[[80,40],[80,100]],
 y220:[[80,100],[170,100],[170,165],[222,165]],
 atl:[[258,165],[300,165],[300,146],[350,146]],
 bus500:[[350,146],[350,100],[610,100],[610,194]],
 l500:[[505,40],[505,146],[480,146]],
 dia11:[[480,146],[480,100],[610,100],[610,194]],
 fd11:[[610,194],[635,194],[635,298]],
 ipb:[[635,326],[635,360]],
 uatc:[[635,360],[560,360],[560,390]],
 gen:[[635,412],[635,360]],
 mvc:[[560,418],[560,470]],
 lvc:[[560,470],[560,548]],
 ter:[[240,177],[240,306]],
 bkt:[[240,334],[240,380]],
 bkc:[[240,380],[270,380],[270,440]],
 dg1:[[100,600],[100,560]],
 dg2:[[150,600],[150,560]],
 dg3:[[310,600],[310,560]],
 dg4:[[360,600],[360,560]],
 cmnb:[[360,560],[100,560]],
 ctie:[[220,560],[220,520],[460,520],[460,470]],
 busd:[[460,470],[560,470]],
 sfc:[[560,470],[660,470],[660,506]]
};

/* Connections that never carry a route here: the rest of the three diameters. */
const DECOR=[
 [[350,146],[350,240]],[[480,146],[480,240]],[[610,100],[610,240]],[[350,100],[350,146]],[[480,100],[480,146]]
];
const DOTS=[[350,146],[480,146],[610,194],[635,360],[170,100],[80,100],[220,560],[460,470],[560,470],[660,470],[270,380],[240,380]];

return {ELS:ELS,SEG:SEG,DECOR:DECOR,DOTS:DOTS};
})();
