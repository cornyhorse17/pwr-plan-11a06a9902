/* Plan, requirements, risks, comparison and decision data. Plain data, no logic. */
window.APP_DATA=(function(){
"use strict";
const PLAN=
[
{"id":"B01","t":"Decide to prepare Option B as a contingency beside the baseline","area":"Decision","own":"Head office","es":"2026-11-10","dur":3,"pred":[],"basis":"Needed to release resources; baseline unchanged","conf":"Head office"},
{"id":"B02","t":"Collect signed completion and site test records: 220 kV switchyard, autotransformer, their protection and control cabinets","area":"Evidence","own":"DE","es":"2026-11-11","dur":4,"pred":[],"basis":"Stated complete; records not yet seen","conf":"DE"},
{"id":"B03","t":"Confirm which 220 kV line is connected and can be made live, and the status of its remote end","area":"Grid","own":"PGU","es":"2026-11-11","dur":3,"pred":[],"basis":"Not established from documents","conf":"PGU"},
{"id":"B04","t":"Send the staged connection request to KEGOC: 220 kV, autotransformer, 500 kV bus with 500 kV lines isolated, Block 1 auxiliaries","area":"Grid","own":"PGU","es":"2026-11-12","dur":2,"pred":["B01","B03"],"basis":"Connection conditions describe the final scheme only","conf":"PGU"},
{"id":"B05","t":"Calculate protection settings for the staged network: autotransformer, 220 kV line and bus, 500 kV bus and bays, check of GSUT and UAT settings","area":"Protection","own":"DE","es":"2026-11-12","dur":7,"pred":[],"basis":"Settings on file are design values for the final network","conf":"DE"},
{"id":"B06","t":"KEGOC review and agreement of settings and staged scheme","area":"Grid","own":"KEGOC","es":"2026-11-12","dur":7,"pred":["B04","B05"],"basis":"Required by the connection conditions; review time assumed","conf":"KEGOC through PGU","w":"kegoc"},
{"id":"B07","t":"Check that tests use the current revision of the protection drawings","area":"Evidence","own":"Integra","es":"2026-11-11","dur":4,"pred":[],"basis":"Drawing list shows a later revision than the set in use","conf":"DE"},
{"id":"B08","t":"Close individual tests of autotransformer and 220 kV path protection: secondary injection, settings files","area":"Protection","own":"DE","es":"2026-11-12","dur":7,"pred":["B02","B07"],"basis":"Test record of 31 October covers 500 kV panels only","conf":"DE","w":"sat"},
{"id":"B09","t":"Autotransformer pre-energisation checks: oil analysis, bushings, tap changer, cooling, earthing, neutral, tertiary arrangement","area":"Primary equipment","own":"DE","es":"2026-11-12","dur":6,"pred":["B02"],"basis":"Manufacturer site test programme","conf":"DE"},
{"id":"B10","t":"Autotransformer fire protection and explosion prevention system function test","area":"Safety","own":"DE","es":"2026-11-12","dur":7,"pred":["B02"],"basis":"Listed in the commissioning register; status not recorded","conf":"DE"},
{"id":"B11","t":"Functional tests: interlocking, breaker failure, intertrips between 220 kV, autotransformer and 500 kV bays","area":"Protection","own":"DE","es":"2026-11-12","dur":4,"pred":["B08"],"basis":"Power receiving procedure prerequisites","conf":"DE"},
{"id":"B12","t":"Switchyard auxiliary AC and DC supplies in service on a reliable source","area":"Auxiliary supply","own":"DE","es":"2026-11-12","dur":9,"pred":[],"basis":"Power receiving procedure prerequisites","conf":"DE"},
{"id":"B13","t":"Integrated tests: trips to breakers, control system signals, telemetry and voice channel to KEGOC dispatch, fault recorders","area":"SCADA and telecom","own":"DE","es":"2026-11-12","dur":3,"pred":["B11","B12","B06"],"basis":"End-to-end test required before energisation","conf":"DE, PGU, KEGOC"},
{"id":"B14","t":"Commercial metering verified and sealed; import arrangement for the energy taken","area":"Metering","own":"PGU","es":"2026-11-12","dur":14,"pred":["B03"],"basis":"Published review periods can be much longer; status not known","conf":"PGU"},
{"id":"B15","t":"Permit to work and lock-out in force; 500 kV line bays and unused 220 kV bays isolated and locked; authorised persons named","area":"Safety","own":"DE","es":"2026-11-12","dur":12,"pred":[],"basis":"Procedure agreed in principle, signature open","conf":"DE, Integra"},
{"id":"B16","t":"Switching programme for energisation agreed between the operating staff, DE and the KEGOC dispatcher","area":"Grid","own":"PGU","es":"2026-11-12","dur":6,"pred":["B05"],"basis":"Needed for the dispatcher application","conf":"PGU"},
{"id":"B17","t":"Block 1 path tests complete and recorded: GSUT11, UAT11, busduct, generator breaker, protection panels, 10 kV boards","area":"Block 1","own":"Integra","es":"2026-11-11","dur":15,"pred":[],"basis":"Same requirement as the baseline","conf":"DE, Integra"},
{"id":"B18","t":"Evidence-based readiness gate for the power receiving boundary; result is a proposal to the Chief Commissioning Engineer","area":"Decision","own":"Integra","es":"2026-11-12","dur":1,"pred":["B09","B10","B13","B14","B15","B17"],"basis":"Internal rule: no readiness statement without a gate","conf":"Integra"},
{"id":"B19","t":"Dispatcher application for switching","area":"Grid","own":"PGU","es":"2026-11-12","dur":1,"pred":["B06","B16","B18"],"basis":"Lead time assumed","conf":"PGU"},
{"id":"B20","t":"POWER RECEIVING: energise the 220 kV bus section and the autotransformer, 500 kV side open","area":"Energisation","own":"DE","es":"2026-11-12","dur":1,"pred":["B19"],"basis":"Target stated by the Chief Commissioning Engineer","conf":"DE, PGU, KEGOC","ms":1},
{"id":"B21","t":"Autotransformer hold and checks, then energise the 500 kV bus through the autotransformer bay","area":"Energisation","own":"DE","es":"2026-11-12","dur":1,"pred":["B20"],"basis":"Hold period assumed","conf":"DE","post":1},
{"id":"B22","t":"Hold period for the 500 kV switchyard","area":"Energisation","own":"DE","es":"2026-11-12","dur":3,"pred":["B21"],"basis":"Consortium leader's schedule allows 72 hours","conf":"DE","post":1,"w":"soak"},
{"id":"B23","t":"Energise GSUT11 with UAT11, generator breaker open; hold 24 hours","area":"Energisation","own":"DE","es":"2026-11-12","dur":2,"pred":["B22"],"basis":"Hold period assumed","conf":"DE","post":1},
{"id":"B24","t":"Block 1 10 kV boards live","area":"Energisation","own":"Integra","es":"2026-11-12","dur":1,"pred":["B23"],"basis":"Power receiving procedure sequence","conf":"DE, Integra","post":1},
{"id":"B25","t":"Block 1 0.4 kV boards live","area":"Energisation","own":"Integra","es":"2026-11-12","dur":2,"pred":["B24"],"basis":"Power receiving procedure sequence","conf":"Integra","post":1,"lv":1},
{"id":"B26","t":"KEGOC approval of GT11 export through the autotransformer to 220 kV (needed before first synchronisation under Option B)","area":"Grid","own":"KEGOC","es":"2026-11-12","dur":30,"pred":["B04"],"basis":"Review time not known; 30 days is a placeholder","conf":"KEGOC through PGU","post":1}
];
const S1="Individual",S2="Functional",S3="Integrated",S4="Energisation readiness",S5="KEGOC acceptance";
const N="No record on file",U="Stated complete, records to check",K="Open with KEGOC",DS="Shown in design only",NK="Not known",IP="In progress";
const REQ=[
["220 kV switchyard","Incoming line bay: breaker, disconnectors, earthing switches, instrument transformers, arresters","DE",S1,U,"Signed completion and site test records for the bay actually used."],
["220 kV switchyard","Bus section, bus voltage transformers and autotransformer bay","DE",S1,U,"Signed records; insulation and contact resistance results; breaker timing."],
["220 kV switchyard","Line, busbar and bay protection with breaker failure","DE",S1,N,"Secondary injection results and settings files. The latest test record seen lists these cabinets with no result."],
["220 kV switchyard","Disconnector and earthing switch interlocking across the bays in use","DE",S2,N,"Interlock test sheets against the approved logic."],
["Autotransformer","Three single-phase units and spare: oil, bushings, ratio, winding resistance, insulation, frequency response","DE",S1,U,"Manufacturer site test report signed by the parties."],
["Autotransformer","On-load tap changer and its controller; agreed tap position for first energisation","DE",S2,NK,"Tap position that keeps the 500 kV bus within its rating at the actual 220 kV voltage."],
["Autotransformer","Cooling control, oil and winding temperature, gas relay, pressure relief: alarms and trips","DE",S2,N,"Function test sheets; trips proven to both breakers."],
["Autotransformer","Main and backup protection, three cabinets, and tap changer control","DE",S1,N,"Not in the latest test record seen. Secondary injection and settings files needed."],
["Autotransformer","Fire protection (water spray) and explosion prevention system","DE",S2,N,"Function test with the protection commands; fire water available."],
["Autotransformer","Tertiary winding equipment: reactor, voltage transformer, disconnector, arresters; defined state if the tertiary is not used","DE",S1,NK,"Decision on the tertiary arrangement and its protection in service."],
["Autotransformer","Neutral and tank earthing, earthing grid continuity, step and touch voltage","DE",S1,NK,"Earthing test report for the power receiving boundary."],
["500 kV switchyard","Autotransformer diameter and GT11 diameter: breakers, disconnectors, instrument transformers","DE",S1,IP,"Signed records; a number of field connections were still open in October."],
["500 kV switchyard","Busbar protection, bay control, breaker failure, synchronism check","DE",S1,IP,"Relay tests recorded for the 500 kV panels; signed protocols to be handed over."],
["500 kV switchyard","Line bays to the 500 kV grid: isolated, earthed and locked while the lines are not connected","DE",S4,N,"Isolation list and lock-out record."],
["500 kV switchyard","Interlocking and intertrips between 500 kV bays, autotransformer and GSUT11","DE",S2,N,"Test sheets; the generator transformer trip matrix has an open point on breaker failure start."],
["Block 1 path","GSUT11, UAT11, busduct and generator breaker","DE",S1,U,"Signed individual test records; tap positions; oil results."],
["Block 1 path","GSUT, UAT and overall protection panels","DE",S1,NK,"Secondary injection, trip tests to the 500 kV breakers and the 10 kV incomers."],
["Block 1 path","10 kV and 0.4 kV boards, DC and UPS","Integra",S1,IP,"Site tests in progress; signed records to be held before energisation."],
["Control and telecom","Switchyard control system: signals, commands, alarms, event recording for both voltage levels","DE",S3,N,"Point-to-point test against the signal list."],
["Control and telecom","Telemetry, telecontrol and voice channels to KEGOC dispatch; protection signalling channels of the line used","PGU",S3,K,"Channel acceptance with the dispatcher; remote-end works."],
["Control and telecom","Emergency control automation: autotransformer overload relief, 220 kV line overload relief, generation limitation","DE",S3,K,"Needed in service, or formally waived by KEGOC, before any export."],
["Metering","Commercial metering on the path used: meters, instrument transformer circuits, data link, sealing","PGU",S5,K,"Metering acceptance act; import arrangement."],
["Auxiliary supply","Switchyard AC and DC supplies, batteries and chargers for both voltage levels","DE",S1,IP,"500 kV side reported tested; 220 kV side and the supply source to be confirmed."],
["Grid approvals","Staged connection scheme, agreed settings, configuration files, switching programme, dispatcher permission","KEGOC",S5,K,"No agreement on file. Conditions on file describe the final scheme."],
["Safety","Permit to work and lock-out for the whole boundary, authorised persons, operating staff on shift","DE",S4,IP,"Procedure agreed in principle; signed issue and named persons needed."]
].map(a=>({sys:a[0],item:a[1],who:a[2],stage:a[3],st:a[4],gap:a[5]}));
const RISK=[
["Grid approvals","High","KEGOC has not agreed a staged scheme through 220 kV","The connection conditions describe the final scheme with both 500 kV and 220 kV lines. Receiving power, and later exporting, through 220 kV alone is a different operating scheme.","One joint request through the Employer this week, with the staged single-line sketch, settings and switching programme. Ask KEGOC for its review time in writing.","PGU, DE"],
["Protection","High","Settings were calculated for the final network","With the 500 kV bus fed only through the autotransformer the fault level there is a small fraction of the design value, so sensitivity and backup zones must be rechecked. Directional backup elements see a reversed source when GT11 exports.","Staged-network calculation for both directions; agree with KEGOC; load and verify by secondary injection.","DE"],
["Evidence","High","Test status of the 220 kV side and autotransformer is not evidenced","The consortium leader's schedule places these tests in 2027 and the latest test record lists the cabinets without results. Completion has been stated verbally.","Collect signed records within four days. If they do not exist, use the what-if control on the plan to see the date.","DE"],
["Metering","High","Commercial metering and import arrangement","No supply is normally allowed without accepted metering. Published review periods are long if the process has not started.","Employer to confirm the status of the metering approval and the supply contract this week.","PGU"],
["Equipment","Medium","Inrush when the autotransformer and then GSUT11 are energised","A large bank energised from 220 kV, then a generator transformer energised from a weak 500 kV bus, gives a deep voltage dip and can cause false differential trips or sympathetic inrush.","Energise one item at a time with hold periods; confirm harmonic restraint settings; use controlled switching where fitted; record every energisation.","DE"],
["Equipment","Medium","Voltage on the unloaded 500 kV bus","There is no load and no line on the 500 kV side. The bus voltage follows the 220 kV grid voltage and the tap position. GSUT11 has no on-load tap changer.","Set the autotransformer tap before energising; check the 500 kV reading before closing onto GSUT11; correct the 10 kV level with the UAT tap changer.","DE"],
["Equipment","Medium","Open 500 kV line ends","If a line section were connected with its far end open, charging current and voltage rise would have to be studied. With line bays isolated the effect is negligible.","Keep 500 kV line bays isolated, earthed and locked until the lines are released by KEGOC.","DE"],
["Equipment","Low","Autotransformer loading in reverse","One gas turbine is well below the bank rating, so thermal loading is not the limit. Limits come from the 220 kV line and from system conditions.","KEGOC mode calculation for export through 220 kV; overload relief automation in service.","KEGOC"],
["Synchronising","Medium","Synchronising points","While the 500 kV side has no grid connection all switchyard closings are onto a dead bus. GT11 synchronises at its generator breaker. Once 500 kV lines are connected the autotransformer becomes a tie between two grid voltages and closing it needs a synchronism check and dispatcher permission.","State the permitted closing condition for every breaker in the switching programme; test dead-bus and synchronism check logic.","DE"],
["Scope","Medium","220 kV and autotransformer were outside the Early Power scope","Option B brings part of that scope forward: one line bay, bus section, autotransformer and its systems, protection, metering and control for 220 kV.","Agree the limited boundary and who provides the resources before work starts. The earlier scope decision stays in force until changed.","Head office"],
["Schedule","High","No float on the test chain","Agreed settings arrive at the end of the KEGOC review and must still be loaded and verified. Any day lost moves 1 December.","Start the settings work and the evidence check now, in parallel with the decision.","DE, Integra"],
["Safety","Medium","Two live boundaries beside construction","Live 220 kV and 500 kV equipment next to bays still under work.","One permit and lock-out system for the whole boundary; barriers and signs; isolation list signed before the gate.","DE, Integra"]
].map(a=>({topic:a[0],sev:a[1],title:a[2],why:a[3],mit:a[4],who:a[5]}));
const CMP=[
["Power source","500 kV lines to the grid","A 220 kV line, then the autotransformer, then the 500 kV bus"],
["Power receiving date","27 Nov for the switchyard, 30 Nov for 10 and 0.4 kV (Employer plan). The 500 kV grid connection is not yet in place.","1 Dec target for the autotransformer; 10 and 0.4 kV about a week later with hold periods"],
["Schedule risk","Depends on the 500 kV line connection and KEGOC acceptance of the 500 kV scheme","Depends on evidence for 220 kV tests and a new KEGOC agreement; no float"],
["Scope","As planned","Adds one 220 kV line bay, bus section, autotransformer and its protection, control, metering"],
["Equipment readiness","500 kV relay tests recorded; some field connections open","Stated complete; records not yet seen; planned for 2027 in the consortium leader's schedule"],
["Risk to equipment","One transformer energisation from a strong source","Two large energisations in series from a weaker source; needs a stepwise programme"],
["Grid dependency","500 kV line works and remote-end works","One 220 kV line and its remote end; 500 kV lines can stay disconnected"],
["KEGOC interfaces","Final scheme, already described in the connection conditions","Staged scheme to be requested; export in reverse needs its own approval"],
["Cost drivers","As planned","Earlier mobilisation of test crews and specialists; extra settings study; possible retests"],
["Resource load","As planned","Second protection crew on 220 kV and autotransformer in parallel with 500 kV work"],
["Effect on 22 Dec","Baseline","Holds only if temporary power carries the work and KEGOC approves export through 220 kV; otherwise later"]
];
const DEC=[["12 Nov","Prepare Option B as a contingency; baseline unchanged","Head office","Without it no resources are released and 1 December is lost"],
["14 Nov","Test records for 220 kV and autotransformer: complete or not","DE, checked by Integra","Decides whether 1 December is realistic at all"],
["14 Nov","Which 220 kV line, and a staged request sent to KEGOC","PGU","Starts the longest external lead time"],
["18 Nov","Settings for the staged network submitted","DE","Seven days of review remain before the date"],
["25 Nov","KEGOC agreement received","KEGOC","If late, the date moves day for day"],
["29 Nov","Readiness gate result proposed","Integra","Only an evidence-based gate supports a go"],
["Before first synchronisation","Export route for GT11: 500 kV lines or reverse through 220 kV","PGU with KEGOC","Sets the first synchronisation date under Option B"]];
const DEP={"KEGOC":["Acceptance of a staged scheme through 220 kV","Review time for settings and configuration files","Dispatcher names, switching programme, application lead time","Telemetry and voice channel acceptance","Conditions for GT11 export through 220 kV"],
"DE (consortium leader)":["Signed completion and site test records, 220 kV and autotransformer","Settings calculation for the staged network, both directions","Protection, interlock and integrated tests on the path","Stepwise energisation programme","Early release of 2027 resources"],
"PGU (Employer)":["Status of the 220 kV lines and remote ends","Request to KEGOC and all correspondence with it","Commercial metering acceptance and import arrangement","Operating staff authorised for switching","Agreement that 1 December is power receiving, not synchronisation"]};
return {PLAN:PLAN,REQ:REQ,RISK:RISK,CMP:CMP,DEC:DEC,DEP:DEP,STAGES:[S1,S2,S3,S4,S5]};
})();
