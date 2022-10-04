'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	/*//防止反复加载
	if(window.ykloadJSON_equip) return ;
	window.ykloadJSON_equip=true;*/
	var yk_equipTranslation={
		godgrade:"<body><samp id='神级'>神级</samp></body><style>#神级{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		'half-godgrade':"<body><samp id='半神级'>半神级</samp></body><style>#半神级{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		tiangrade:'<span style=\"color: #FF0000;\">天级</span>',
		digrade:'<span style=\"color: #FF00FF;\">地级</span>',
		xuangrade:'<span style=\"color: #00FFFF;\">玄级</span>',
		huanggrade:'<span style=\"color: #FFFF00;\">黄级</span>',
		fangrade:'<span style=\"color: #BEBEBE;\">凡级</span>',
		
		'sword0':'细剑',
		'sword1':'长剑',
		'sword2':'大剑',
		'swordx':'短匕',
		spear:'长枪',
		knife:'太刀',
		magic:'法器',
		bow:'弓',
		special:'特殊',
		
		'usual':'通用',
		'yk_soil':'地',
		'yk_wind':'风',
		'yk_water':'水',
		'yk_fire':'火',
		'yk_light':'光',
		'yk_dark':'暗',
		'yk_ice':'冰',
		'yk_stone':'岩',
		'yk_thunder':'雷',
		'yk_wood':'木',
		'yk_soul':'元',
	}
	for(var i in yk_equipTranslation){
		lib.translate[i]=yk_equipTranslation[i];
	}
	if(lib.config.yk_myBag) lib.ykBag=lib.config.yk_myBag;
	else lib.ykBag={};
	lib.ykEquip={
		//七君专武
		'yk_yao':{
			grade:'godgrade',
			type:'equip1',
			ykType:'sword1',
			nature:'yk_light',
			translation:'耀',
			strength:{//强化所需材料
				'god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'half-god_crystal':{
					'8':4,
					'9':8,
				},
				xilongzhizhu:{
					'3':5,
					'4':8,
					'5':10,
					'6':15,
					'7':25,
					'8':35,
					'9':60,
				},
				gold:{
					'0':5,
					'1':15,
					'2':25,
					'3':50,
					'4':75,
					'5':125,
					'6':175,
					'7':350,
					'8':400,
					'9':500,
				},
				silver:{
					'0':10,
					'1':20,
					'2':30,
					'3':50,
					'4':100,
					'5':150,
					'6':250,
					'7':550,
					'8':850,
					'9':1050,
				},
				'yk_coin':{
					'0':500,
					'1':1500,
					'2':2500,
					'3':5000,
					'4':7500,
					'5':12500,
					'6':17500,
					'7':25000,
					'8':35000,
					'9':50000,
				},
				rate:{//强化成功率
					'5':90,
					'6':85,
					'7':75,
					'8':65,
					'9':50,
				},
			},
			fumo:{//附魔所需材料
				'god_crystal':1,
				'half-god_crystal':4,
				'light_crystal':50,
				xilongzhizhu:100,
				'yk_coin':100000,
				rate:80,
			},
			panel:{//面板属性
				Mp:1000,
				Strength:100,
				Defend:1000,
				growUp1:{//等级成长
					Mp:100,
					Strength:10,
					Defend:100,
				},
				growUp2:{//进阶成长
					Mp:200,
					Strength:20,
					Defend:200,
				},
			},
			skill:{
				yk_wjztg:{},
				yk_fgly:{},
				translate:{
					'yk_wjztg':'无尽之天光',
					'yk_fgly':'浮光掠影',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_an':{
			grade:'godgrade',
			type:'equip1',
			ykType:'knife',
			nature:'yk_dark',
			translation:'黯',
			strength:{//强化所需材料
				'god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'half-god_crystal':{
					'8':4,
					'9':8,
				},
				heishezhiya:{
					'3':5,
					'4':8,
					'5':10,
					'6':15,
					'7':25,
					'8':35,
					'9':60,
				},
				gold:{
					'0':5,
					'1':15,
					'2':25,
					'3':50,
					'4':75,
					'5':125,
					'6':175,
					'7':350,
					'8':400,
					'9':500,
				},
				silver:{
					'0':10,
					'1':20,
					'2':30,
					'3':50,
					'4':100,
					'5':150,
					'6':250,
					'7':550,
					'8':850,
					'9':1050,
				},
				'yk_coin':{
					'0':500,
					'1':1500,
					'2':2500,
					'3':5000,
					'4':7500,
					'5':12500,
					'6':17500,
					'7':25000,
					'8':35000,
					'9':50000,
				},
				rate:{//强化成功率
					'5':90,
					'6':85,
					'7':75,
					'8':65,
					'9':50,
				},
			},
			fumo:{//附魔所需材料
				'god_crystal':1,
				'half-god_crystal':4,
				'dark_crystal':50,
				heishezhiya:100,
				'yk_coin':100000,
				rate:80,
			},
			panel:{//面板属性
				Mp:1000,
				Strength:100,
				Defend:1000,
				growUp1:{//等级成长
					Mp:100,
					Strength:10,
					Defend:100,
				},
				growUp2:{//进阶成长
					Mp:200,
					Strength:20,
					Defend:200,
				},
			},
			skill:{
				yk_yyzha:{},
				yk_qhjx:{},
				translate:{
					'yk_yyzha':'永夜之晦暗',
					'yk_qhjx':'漆黑绝响',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_pan':{
			grade:'godgrade',
			type:'equip1',
			ykType:'sword2',
			translation:'磐',
			strength:{//强化所需材料
				'god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'half-god_crystal':{
					'8':4,
					'9':8,
				},
				panlongzhizhua:{
					'3':5,
					'4':8,
					'5':10,
					'6':15,
					'7':25,
					'8':35,
					'9':60,
				},
				gold:{
					'0':5,
					'1':15,
					'2':25,
					'3':50,
					'4':75,
					'5':125,
					'6':175,
					'7':350,
					'8':400,
					'9':500,
				},
				silver:{
					'0':10,
					'1':20,
					'2':30,
					'3':50,
					'4':100,
					'5':150,
					'6':250,
					'7':550,
					'8':850,
					'9':1050,
				},
				'yk_coin':{
					'0':500,
					'1':1500,
					'2':2500,
					'3':5000,
					'4':7500,
					'5':12500,
					'6':17500,
					'7':25000,
					'8':35000,
					'9':50000,
				},
				rate:{//强化成功率
					'5':90,
					'6':85,
					'7':75,
					'8':65,
					'9':50,
				},
			},
			fumo:{//附魔所需材料
				'god_crystal':1,
				'half-god_crystal':4,
				'stone_crystal':50,
				panlongzhizhua:100,
				'yk_coin':100000,
				rate:80,
			},
			nature:'yk_stone',
			panel:{//面板属性
				Mp:1000,
				Strength:100,
				Defend:1000,
				growUp1:{//等级成长
					Mp:100,
					Strength:10,
					Defend:100,
				},
				growUp2:{//进阶成长
					Mp:200,
					Strength:20,
					Defend:200,
				},
			},
			skill:{
				yk_ggzpy:{},
				yk_jbkc:{},
				translate:{
					'yk_ggzpy':'亘古之磐岩',
					'yk_jbkc':'坚不可摧',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_ju':{
			grade:'godgrade',
			type:'equip1',
			ykType:'bow',
			translation:'飓',
			strength:{//强化所需材料
				'god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'half-god_crystal':{
					'8':4,
					'9':8,
				},
				baiyizhiyu:{
					'3':5,
					'4':8,
					'5':10,
					'6':15,
					'7':25,
					'8':35,
					'9':60,
				},
				gold:{
					'0':5,
					'1':15,
					'2':25,
					'3':50,
					'4':75,
					'5':125,
					'6':175,
					'7':350,
					'8':400,
					'9':500,
				},
				silver:{
					'0':10,
					'1':20,
					'2':30,
					'3':50,
					'4':100,
					'5':150,
					'6':250,
					'7':550,
					'8':850,
					'9':1050,
				},
				'yk_coin':{
					'0':500,
					'1':1500,
					'2':2500,
					'3':5000,
					'4':7500,
					'5':12500,
					'6':17500,
					'7':25000,
					'8':35000,
					'9':50000,
				},
				rate:{//强化成功率
					'5':90,
					'6':85,
					'7':75,
					'8':65,
					'9':50,
				},
			},
			fumo:{//附魔所需材料
				'god_crystal':1,
				'half-god_crystal':4,
				'wind_crystal':50,
				baiyizhiyu:100,
				'yk_coin':100000,
				rate:80,
			},
			nature:'yk_wind',
			panel:{//面板属性
				Mp:1000,
				Strength:100,
				Defend:1000,
				growUp1:{//等级成长
					Mp:100,
					Strength:10,
					Defend:100,
				},
				growUp2:{//进阶成长
					Mp:200,
					Strength:20,
					Defend:200,
				},
			},
			skill:{
				yk_lqzqf:{},
				yk_zyzy:{},
				translate:{
					'yk_lqzqf':'灵巧之清风',
					'yk_zyzy':'自由之意',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_su':{
			grade:'godgrade',
			type:'equip1',
			ykType:'sword0',
			translation:'溯',
			strength:{//强化所需材料
				'god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'half-god_crystal':{
					'8':4,
					'9':8,
				},
				xinglongzhilin:{
					'3':5,
					'4':8,
					'5':10,
					'6':15,
					'7':25,
					'8':35,
					'9':60,
				},
				gold:{
					'0':5,
					'1':15,
					'2':25,
					'3':50,
					'4':75,
					'5':125,
					'6':175,
					'7':350,
					'8':400,
					'9':500,
				},
				silver:{
					'0':10,
					'1':20,
					'2':30,
					'3':50,
					'4':100,
					'5':150,
					'6':250,
					'7':550,
					'8':850,
					'9':1050,
				},
				'yk_coin':{
					'0':500,
					'1':1500,
					'2':2500,
					'3':5000,
					'4':7500,
					'5':12500,
					'6':17500,
					'7':25000,
					'8':35000,
					'9':50000,
				},
				rate:{//强化成功率
					'5':90,
					'6':85,
					'7':75,
					'8':65,
					'9':50,
				},
			},
			fumo:{//附魔所需材料
				'god_crystal':1,
				'half-god_crystal':4,
				'water_crystal':50,
				xinglongzhilin:100,
				'yk_coin':100000,
				rate:80,
			},
			nature:'yk_water',
			panel:{//面板属性
				Mp:1000,
				Strength:100,
				Defend:1000,
				growUp1:{//等级成长
					Mp:100,
					Strength:10,
					Defend:100,
				},
				growUp2:{//进阶成长
					Mp:200,
					Strength:20,
					Defend:200,
				},
			},
			skill:{
				yk_cczls:{},
				yk_rjmx:{},
				translate:{
					'yk_cczls':'潺潺之流水',
					'yk_rjmx':'如镜明心',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_liao':{
			grade:'godgrade',
			type:'equip1',
			ykType:'spear',
			nature:'yk_fire',
			translation:'燎',
			strength:{//强化所需材料
				'god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'half-god_crystal':{
					'8':4,
					'9':8,
				},
				ranlinzhijiao:{
					'3':5,
					'4':8,
					'5':10,
					'6':15,
					'7':25,
					'8':35,
					'9':60,
				},
				gold:{
					'0':5,
					'1':15,
					'2':25,
					'3':50,
					'4':75,
					'5':125,
					'6':175,
					'7':350,
					'8':400,
					'9':500,
				},
				silver:{
					'0':10,
					'1':20,
					'2':30,
					'3':50,
					'4':100,
					'5':150,
					'6':250,
					'7':550,
					'8':850,
					'9':1050,
				},
				'yk_coin':{
					'0':500,
					'1':1500,
					'2':2500,
					'3':5000,
					'4':7500,
					'5':12500,
					'6':17500,
					'7':25000,
					'8':35000,
					'9':50000,
				},
				rate:{//强化成功率
					'5':90,
					'6':85,
					'7':75,
					'8':65,
					'9':50,
				},
			},
			fumo:{//附魔所需材料
				'god_crystal':1,
				'half-god_crystal':4,
				'fire_crystal':50,
				ranlinzhijiao:100,
				'yk_coin':100000,
				rate:80,
			},
			panel:{//面板属性
				Mp:1000,
				Strength:100,
				Defend:1000,
				growUp1:{//等级成长
					Mp:100,
					Strength:10,
					Defend:100,
				},
				growUp2:{//进阶成长
					Mp:200,
					Strength:20,
					Defend:200,
				},
			},
			skill:{
				yk_xlzyh:{},
				yk_jjry:{},
				translate:{
					'yk_xlzyh':'绚烂之焰火',
					'yk_jjry':'烬寂燃愿',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_nian':{
			grade:'godgrade',
			type:'equip1',
			ykType:'sword1',
			nature:'yk_soul',
			translation:'念',
			strength:{//强化所需材料
				'god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'half-god_crystal':{
					'8':4,
					'9':8,
				},
				xiaohuzhiyan:{
					'3':5,
					'4':8,
					'5':10,
					'6':15,
					'7':25,
					'8':35,
					'9':60,
				},
				gold:{
					'0':5,
					'1':15,
					'2':25,
					'3':50,
					'4':75,
					'5':125,
					'6':175,
					'7':350,
					'8':400,
					'9':500,
				},
				silver:{
					'0':10,
					'1':20,
					'2':30,
					'3':50,
					'4':100,
					'5':150,
					'6':250,
					'7':550,
					'8':850,
					'9':1050,
				},
				'yk_coin':{
					'0':500,
					'1':1500,
					'2':2500,
					'3':5000,
					'4':7500,
					'5':12500,
					'6':17500,
					'7':25000,
					'8':35000,
					'9':50000,
				},
				rate:{//强化成功率
					'5':90,
					'6':85,
					'7':75,
					'8':65,
					'9':50,
				},
			},
			fumo:{//附魔所需材料
				'god_crystal':1,
				'half-god_crystal':4,
				'soul_crystal':50,
				xiaohuzhiyan:100,
				'yk_coin':100000,
				rate:80,
			},
			panel:{//面板属性
				Mp:800,
				Strength:100,
				Defend:1000,
				Soul:200,
				growUp1:{//等级成长
					Mp:100,
					Strength:10,
					Defend:100,
					Soul:10,
				},
				growUp2:{//进阶成长
					Mp:200,
					Strength:20,
					Defend:200,
					Soul:20,
				},
			},
			skill:{
				yk_xwzzn:{},
				yk_wwww:{},
				translate:{
					'yk_xwzzn':'虚无之执念',
					'yk_wwww':'无妄无我',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		//巫山专武
		'yk_tianjue':{
			grade:'half-godgrade',
			type:'equip1',
			ykType:'sword1',
			nature:'none',
			strength:{//强化所需材料
				'half-god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'tian_crystal':{
					'8':4,
					'9':8,
				},
				xinglongzhilin:{
					'3':1,
					'4':2,
					'5':2,
					'6':3,
					'7':5,
					'8':6,
					'9':8,
				},
				xilongzhizhu:{
					'3':1,
					'4':1,
					'5':2,
					'6':2,
					'7':5,
					'8':5,
					'9':10,
				},
				ranlinzhijiao:{
					'3':1,
					'4':2,
					'5':2,
					'6':3,
					'7':5,
					'8':6,
					'9':8,
				},
				jiuxiaoleishi:{
					'3':1,
					'4':1,
					'5':2,
					'6':2,
					'7':5,
					'8':5,
					'9':10,
				},
				gold:{
					'0':3,
					'1':5,
					'2':7,
					'3':10,
					'4':15,
					'5':35,
					'6':85,
					'7':175,
					'8':375,
					'9':700,
				},
				silver:{
					'0':15,
					'1':25,
					'2':40,
					'3':60,
					'4':80,
					'5':120,
					'6':225,
					'7':350,
					'8':600,
					'9':850,
				},
				'yk_coin':{
					'0':300,
					'1':600,
					'2':1200,
					'3':2500,
					'4':4500,
					'5':7500,
					'6':10500,
					'7':13500,
					'8':18000,
					'9':25000,
				},
				rate:{//强化成功率
					'5':95,
					'6':90,
					'7':85,
					'8':75,
					'9':60,
				},
			},
			fumo:{//附魔所需材料
				'half-god_crystal':1,
				'tian_crystal':4,
				'water_crystal':10,
				'fire_crystal':10,
				'light_crystal':10,
				'thunder_crystal':10,
				xinglongzhilin:20,
				xilongzhizhu:20,
				ranlinzhijiao:20,
				jiuxiaoleishi:20,
				'yk_coin':75000,
				rate:85,
			},
			translation:'天决',
			derivation:'yk_jueyi',
			panel:{//面板属性
				Mp:700,
				Strength:70,
				Defend:700,
				Soul:80,
				growUp1:{//等级成长
					Mp:70,
					Strength:7,
					Defend:70,
					Soul:5,
				},
				growUp2:{//进阶成长
					Mp:140,
					Strength:14,
					Defend:140,
					Soul:10,
				},
			},
			skill:{
				yk_sszsp:{},
				translate:{
					'yk_sszsp':'神圣之审判',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_jueyi':{
			grade:'tiangrade',
			type:'equip1',
			ykType:'sword1',
			nature:'none',
			strength:{//强化所需材料
				'tian_crystal':{//'相应等级':需要材料数,
					'8':2,
					'9':4,
				},
				'di_crystal':{
					'8':8,
					'9':16,
				},
				ranlinzhijiao:{
					'3':2,
					'4':2,
					'5':2,
					'6':3,
					'7':5,
					'8':7,
					'9':10,
				},
				jiuxiaoleishi:{
					'3':1,
					'4':1,
					'5':2,
					'6':4,
					'7':4,
					'8':6,
					'9':10,
				},
				gold:{
					'0':2,
					'1':4,
					'2':6,
					'3':9,
					'4':12,
					'5':25,
					'6':45,
					'7':80,
					'8':125,
					'9':350,
				},
				silver:{
					'0':10,
					'1':20,
					'2':35,
					'3':50,
					'4':75,
					'5':105,
					'6':125,
					'7':175,
					'8':300,
					'9':550,
				},
				'yk_coin':{
					'0':250,
					'1':400,
					'2':800,
					'3':1600,
					'4':2700,
					'5':4600,
					'6':6600,
					'7':9000,
					'8':13000,
					'9':18000,
				},
				rate:{//强化成功率
					'5':95,
					'6':90,
					'7':85,
					'8':80,
					'9':70,
				},
			},
			fumo:{//附魔所需材料
				'tian_crystal':2,
				'di_crystal':8,
				'fire_crystal':8,
				'thunder_crystal':8,
				ranlinzhijiao:15,
				jiuxiaoleishi:15,
				'yk_coin':60000,
				rate:90,
			},
			translation:'决意',
			derivation:'yk_tianjue',
			panel:{//面板属性
				Mp:550,
				Strength:60,
				Defend:550,
				Soul:60,
				growUp1:{//等级成长
					Mp:55,
					Strength:5,
					Defend:55,
					Soul:3,
				},
				growUp2:{//进阶成长
					Mp:110,
					Strength:10,
					Defend:110,
					Soul:6,
				},
			},
			skill:{
				yk_sszjd:{},
				translate:{
					'yk_sszjd':'神圣之决断',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		//三神专武
		//命运
		'yk_mingyuncaijue':{
			grade:'half-godgrade',
			type:'equip1',
			ykType:'knife',
			nature:'yk_dark',
			strength:{//强化所需材料
				'half-god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'tian_crystal':{
					'8':4,
					'9':8,
				},
				heishezhiya:{
					'3':3,
					'4':5,
					'5':7,
					'6':10,
					'7':15,
					'8':25,
					'9':50,
				},
				gold:{
					'0':3,
					'1':5,
					'2':7,
					'3':10,
					'4':15,
					'5':35,
					'6':85,
					'7':175,
					'8':375,
					'9':700,
				},
				silver:{
					'0':15,
					'1':25,
					'2':40,
					'3':60,
					'4':80,
					'5':120,
					'6':225,
					'7':350,
					'8':600,
					'9':850,
				},
				'yk_coin':{
					'0':300,
					'1':600,
					'2':1200,
					'3':2500,
					'4':4500,
					'5':7500,
					'6':10500,
					'7':13500,
					'8':18000,
					'9':25000,
				},
				rate:{//强化成功率
					'5':95,
					'6':90,
					'7':85,
					'8':75,
					'9':60,
				},
			},
			fumo:{//附魔所需材料
				'half-god_crystal':1,
				'tian_crystal':4,
				'dark_crystal':40,
				heishezhiya:80,
				'yk_coin':75000,
				rate:85,
			},
			translation:'命运裁决',
			panel:{//面板属性
				Mp:800,
				Strength:80,
				Defend:800,
				growUp1:{//等级成长
					Mp:80,
					Strength:8,
					Defend:80,
				},
				growUp2:{//进阶成长
					Mp:160,
					Strength:16,
					Defend:160,
				},
			},
			skill:{
				'':{},
				translate:{
					'':'',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		//秩序
		'yk_mingzhaotianzhi':{
			grade:'half-godgrade',
			type:'equip1',
			ykType:'special',
			nature:'yk_light',
			strength:{//强化所需材料
				'half-god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'tian_crystal':{
					'8':4,
					'9':8,
				},
				xilongzhizhu:{
					'3':2,
					'4':4,
					'5':5,
					'6':7,
					'7':10,
					'8':18,
					'9':35,
				},
				jiuxiaoleishi:{
					'3':1,
					'4':1,
					'5':2,
					'6':3,
					'7':5,
					'8':7,
					'9':15,
				},
				gold:{
					'0':3,
					'1':5,
					'2':7,
					'3':10,
					'4':15,
					'5':35,
					'6':85,
					'7':175,
					'8':375,
					'9':700,
				},
				silver:{
					'0':15,
					'1':25,
					'2':40,
					'3':60,
					'4':80,
					'5':120,
					'6':225,
					'7':350,
					'8':600,
					'9':850,
				},
				'yk_coin':{
					'0':300,
					'1':600,
					'2':1200,
					'3':2500,
					'4':4500,
					'5':7500,
					'6':10500,
					'7':13500,
					'8':18000,
					'9':25000,
				},
				rate:{//强化成功率
					'5':95,
					'6':90,
					'7':85,
					'8':75,
					'9':60,
				},
			},
			fumo:{//附魔所需材料
				'half-god_crystal':1,
				'tian_crystal':4,
				'light_crystal':30,
				'thunder_crystal':30,
				xilongzhizhu:60,
				jiuxiaoleishi:20,
				'yk_coin':75000,
				rate:85,
			},
			translation:'明照天秩',
			panel:{//面板属性
				Mp:800,
				Strength:80,
				Defend:800,
				growUp1:{//等级成长
					Mp:80,
					Strength:8,
					Defend:80,
				},
				growUp2:{//进阶成长
					Mp:160,
					Strength:16,
					Defend:160,
				},
			},
			skill:{
				'':{},
				translate:{
					'':'',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		//因果
		'yk_jiuchanzhiyuan':{
			grade:'half-godgrade',
			type:'equip1',
			ykType:'special',
			nature:'none',
			strength:{//强化所需材料
				'half-god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'tian_crystal':{
					'8':4,
					'9':8,
				},
				baiyizhiyu:{
					'3':2,
					'4':4,
					'5':5,
					'6':7,
					'7':10,
					'8':18,
					'9':35,
				},
				xinglongzhilin:{
					'3':1,
					'4':1,
					'5':2,
					'6':3,
					'7':5,
					'8':7,
					'9':15,
				},
				gold:{
					'0':3,
					'1':5,
					'2':7,
					'3':10,
					'4':15,
					'5':35,
					'6':85,
					'7':175,
					'8':375,
					'9':700,
				},
				silver:{
					'0':15,
					'1':25,
					'2':40,
					'3':60,
					'4':80,
					'5':120,
					'6':225,
					'7':350,
					'8':600,
					'9':850,
				},
				'yk_coin':{
					'0':300,
					'1':600,
					'2':1200,
					'3':2500,
					'4':4500,
					'5':7500,
					'6':10500,
					'7':13500,
					'8':18000,
					'9':25000,
				},
				rate:{//强化成功率
					'5':95,
					'6':90,
					'7':85,
					'8':75,
					'9':60,
				},
			},
			fumo:{//附魔所需材料
				'half-god_crystal':1,
				'tian_crystal':4,
				'light_crystal':30,
				'thunder_crystal':30,
				baiyizhiyu:60,
				xinglongzhilin:20,
				'yk_coin':75000,
				rate:85,
			},
			translation:'纠缠之缘',
			panel:{//面板属性
				Mp:800,
				Strength:80,
				Defend:800,
				growUp1:{//等级成长
					Mp:80,
					Strength:8,
					Defend:80,
				},
				growUp2:{//进阶成长
					Mp:160,
					Strength:16,
					Defend:160,
				},
			},
			skill:{
				'':{},
				translate:{
					'':'',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		//魇梦月见
		'yk_yongmengyixin':{
			grade:'half-godgrade',
			type:'equip1',
			ykType:'sword1',
			nature:'yk_soul',
			strength:{//强化所需材料
				'half-god_crystal':{//'相应等级':需要材料数,
					'8':1,
					'9':2,
				},
				'tian_crystal':{
					'8':4,
					'9':8,
				},
				xiaohuzhiyan:{
					'3':3,
					'4':5,
					'5':7,
					'6':10,
					'7':15,
					'8':25,
					'9':50,
				},
				gold:{
					'0':3,
					'1':5,
					'2':7,
					'3':10,
					'4':15,
					'5':35,
					'6':85,
					'7':175,
					'8':375,
					'9':700,
				},
				silver:{
					'0':15,
					'1':25,
					'2':40,
					'3':60,
					'4':80,
					'5':120,
					'6':225,
					'7':350,
					'8':600,
					'9':850,
				},
				'yk_coin':{
					'0':300,
					'1':600,
					'2':1200,
					'3':2500,
					'4':4500,
					'5':7500,
					'6':10500,
					'7':13500,
					'8':18000,
					'9':25000,
				},
				rate:{//强化成功率
					'5':95,
					'6':90,
					'7':85,
					'8':75,
					'9':60,
				},
			},
			fumo:{//附魔所需材料
				'half-god_crystal':1,
				'tian_crystal':4,
				'light_crystal':30,
				'soul_crystal':30,
				xiaohuzhiyan:80,
				'yk_coin':75000,
				rate:85,
			},
			translation:'千秋百念·永梦一心',
			panel:{//面板属性
				Mp:800,
				Strength:80,
				Defend:800,
				growUp1:{//等级成长
					Mp:80,
					Strength:8,
					Defend:80,
				},
				growUp2:{//进阶成长
					Mp:160,
					Strength:16,
					Defend:160,
				},
			},
			skill:{
				'yk_ssym':{},
				translate:{
					'yk_ssym':'死生一梦',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		//天曌
		'yk_tianzhaojian':{
			grade:'tiangrade',
			type:'equip1',
			ykType:'sword1',
			nature:'yk_wind',
			strength:{//强化所需材料
				'tian_crystal':{//'相应等级':需要材料数,
					'8':4,
					'9':8,
				},
				'di_crystal':{
					'8':16,
					'9':32,
				},
				baiyizhiyu:{//'相应等级':需要材料数,
					'3':2,
					'4':3,
					'5':5,
					'6':6,
					'7':8,
					'8':10,
					'9':15,
				},
				xilongzhizhu:{
					'4':1,
					'5':1,
					'6':2,
					'7':2,
					'8':4,
					'9':9,
				},
				xinglongzhilin:{
					'5':1,
					'6':1,
					'7':1,
					'8':1,
					'9':3,
				},
				gold:{
					'0':3,
					'1':5,
					'2':7,
					'3':10,
					'4':15,
					'5':35,
					'6':65,
					'7':145,
					'8':325,
					'9':500,
				},
				silver:{
					'0':10,
					'1':15,
					'2':25,
					'3':30,
					'4':50,
					'5':75,
					'6':125,
					'7':250,
					'8':450,
					'9':750,
				},
				'yk_coin':{
					'0':250,
					'1':400,
					'2':800,
					'3':1600,
					'4':2700,
					'5':4600,
					'6':6600,
					'7':9000,
					'8':13000,
					'9':18000,
				},
				rate:{//强化成功率
					'5':95,
					'6':90,
					'7':85,
					'8':75,
					'9':60,
				},
			},
			fumo:{//附魔所需材料
				'tian_crystal':4,
				'di_crystal':16,
				'wind_crystal':15,
				'light_crystal':5,
				'water_crystal':2,
				baiyizhiyu:60,
				xinglongzhilin:20,
				'yk_coin':60000,
				rate:90,
			},
			translation:'天曌剑',
			panel:{//面板属性
				Mp:600,
				Strength:50,
				Defend:500,
				growUp1:{//等级成长
					Mp:60,
					Strength:5,
					Defend:50,
				},
				growUp2:{//进阶成长
					Mp:120,
					Strength:10,
					Defend:100,
				},
			},
			skill:{
				'yk_mzjt':{},
				translate:{
					'yk_mzjt':'明曌净土',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
	};
	if(lib.config.yk_myBag==undefined) game.saveConfig('yk_myBag',{});
	for(var item in lib.ykEquip){
		var equipInfo='';
		if(lib.config.yk_myBag[item]&&lib.ykEquip[item]!=undefined&&lib.ykEquip[item].skill!=undefined){
			for(var skill in lib.ykEquip[item].skill){
				if(skill=='translate') continue;
				lib.skill[skill]=lib.ykEquip[item].skill[skill];
				lib.translate[skill]=lib.ykEquip[item].skill.translate[skill];
				lib.translate[skill+'_info']=lib.ykEquip[item].skill.translate[skill+'_info'];
				if(get.translation(skill+'_info')) equipInfo+='<li>【<b>'+get.translation(skill)+'</b>】：'+(lib.translate[skill+'_info']&&lib.translate[skill+'_info'].length>0?get.translation(skill+'_info'):'效果未知');
			}
			if(lib.ykEquip[item].skill.translate) for(var trans in lib.ykEquip[item].skill.translate){
				lib.ykEquip[item].skill.translate[trans]=lib.translate[trans];
			}
		}
		lib.translate[item]=(lib.ykEquip[item].translation||'未知装备');
		lib.translate[item+'_info']=lib.ykEquip[item].introduce+(equipInfo.length>0?('<li><b>特技：</b>'+equipInfo):'')+(lib.ykEquip[item].inscription&&lib.ykEquip[item].inscription.length>0?('<br><font color=grey><i>————“'+lib.ykEquip[item].inscription+'”</font></i>'):'');
	}
	lib.ykBook={
		//秘籍
		'yk_dujing':{
			grade:'xuangrade',
			type:'book',
			ykNature:'usual',//usual为通用秘籍
			translation:'《毒经》',
			image:'yk_xuan1.jpg',
			understand:{
				'yk_xuan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_huang_understand':{
					'0':5,
					'1':6,
					'2':7,
					'3':10,
					'4':15,
					'5':20,
					'6':25,
					'7':40,
					'8':60,
					'9':80,
				},
				'yk_coin':{
					'0':1000,
					'1':1000,
					'2':1000,
					'3':1000,
					'4':1000,
					'5':1500,
					'6':1500,
					'7':2000,
					'8':3000,
					'9':3500,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			panel:{//面板属性
				Mp:200,
				Defend:100,
				growUp1:{//等级成长
					Mp:20,
					Defend:10,
				},
				growUp2:{//进阶成长
					Mp:20,
					Defend:10,
				},
			},
			skill:{
				'yk_dujing_shiguzhidu':{
					equipSkill:true,
					trigger:{
						player:"dieAfter",
					},
					forced:true,
					forceDie:true,
					lastDo:true,
					skillAnimation:true,
					animationColor:"gray",
					logTarget:"source",
					filter:function(event,player){
						return event.source;
					},
					content:function(){
						lib.skill.yk_dujing_shiguzhiduadd={
							init:function(player){
								player.ykChange('MaxStrength',-75);
								var rank=lib.ykBag['yk_dujing'].rank2+lib.ykBag['yk_dujing'].rank1;
								if(isNaN(rank)) rank=0;
								if(rank>=20) player.loseMaxHp();
							},
							charlotte:true,
							forced:true,
							trigger:{
								player:"phaseEnd",
							},
							filter:function(event,player){
								return game.players.contains(player);
							},
							content:function(){
								var rank=lib.ykBag['yk_dujing'].rank2+lib.ykBag['yk_dujing'].rank1;
								if(isNaN(rank)) rank=0;
								var num=Math.floor(rank/10);
								if(num>0){
									if(player==game.boss) player.loseHp();
									else player.loseHp(num);
								}
								else player.removeSkill('yk_dujing_shiguzhiduadd');
							},
						}
						lib.translate.yk_dujing_shiguzhiduadd='蚀骨之毒';
						lib.translate.yk_dujing_shiguzhiduadd_info='锁定效果：杀死你的角色每个回合结束时流失((《毒经》强化等级+《毒经》进阶等级)/10)点体力值。（向下取整，对boss每回合最多流失一点），满级满阶时，该角色减少一点体力上限。';
						trigger.source.addSkill('yk_dujing_shiguzhiduadd');
						player.line(trigger.source,'green');
						player.popup('毒经');
					},
				},
				'yk_dujing_yidugongdu':{
					equipSkill:true,
					trigger:{
						player:"dying",
					},
					round:2,
					filter:function(event,player){
						return player.ykCheckConsume('Strength',50);
					},
					content:function(){
						player.ykConsume('Strength',50,true);
						var rank=lib.ykBag['yk_dujing'].rank2+lib.ykBag['yk_dujing'].rank1;
						if(isNaN(rank)) rank=0;
						var rec=1+Math.floor(rank/10);
						player.recover(rec);
						player.yk_dujingrecord=rec;
						lib.skill.yk_dujing_yidugongduLoseHp={
							trigger:{
								player:"phaseBegin",
							},
							forced:true,
							content:function(){
								player.popup('毒经');
								player.loseHp(player.yk_dujingrecord);
								player.yk_dujingrecord=undefined;
								player.removeSkill('yk_dujing_yidugongduLoseHp');
							},
						}
						lib.translate.yk_dujing_yidugongduLoseHp='';
						player.addSkill('yk_dujing_yidugongduLoseHp');
						player.draw(2);
						player.popup('毒经');
					},
				},
				translate:{
					'yk_dujing_shiguzhidu':'蚀骨之毒',
					'yk_dujing_shiguzhidu_info':'锁定效果：游戏开始时你的气力值上限减少70点，杀死你的角色每个回合结束时流失((《毒经》领悟等级+《毒经》进阶等级)/10)点体力值。（向下取整，对boss每回合最多流失一点），满级满阶时，杀死你的角色减少一点体力上限。',
					'yk_dujing_yidugongdu':'以毒攻毒',
					'yk_dujing_yidugongdu_info':'冷却时间为两轮，当你濒死时，你可以消耗50气力值并立即回复 1+(《毒经》领悟等级+《毒经》进阶等级)/10 点体力值和摸两张牌（向下取整），你的下个回合开始时，失去等同于此次回复体力值的体力。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_zhanlujue':{
			grade:'tiangrade',
			type:'book',
			ykNature:'usual',//usual为通用秘籍
			translation:'《湛露诀》',
			image:'yk_tian17.jpg',
			understand:{
				'yk_tian_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_di_understand':{
					'0':5,
					'1':6,
					'2':7,
					'3':10,
					'4':15,
					'5':20,
					'6':25,
					'7':40,
					'8':60,
					'9':80,
				},
				'yk_coin':{
					'0':3000,
					'1':3000,
					'2':3000,
					'3':5000,
					'4':5000,
					'5':5000,
					'6':9000,
					'7':9000,
					'8':15000,
					'9':20000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			panel:{//面板属性
				Mp:500,
				Defend:200,
				growUp1:{//等级成长
					Mp:50,
					Defend:20,
				},
				growUp2:{//进阶成长
					Mp:50,
					Defend:20,
				},
			},
			skill:{
				'yk_zhanlujue_miaozhanshenshu':{
					equipSkill:true,
					init:function(player){
						var num=Math.floor(player.ykGetMaxType('Mp')*0.15);
						if(num>0) player.ykChange('MaxMp',num);
					},
					trigger:{
						player:"phaseBefore",
					},
					forced:true,
					content:function(){
						var rank=lib.ykBag['yk_xinglujue'].rank2+lib.ykBag['yk_xinglujue'].rank1;
						if(isNaN(rank)) rank=0;
						var num=20*rank+5;
						if(num>0) player.ykRecover('Mp',num);
					},
					group:["yk_zhanlujue_miaozhanshenshu_use"],
					subSkill:{
						use:{
							enable:"phaseUse",
							usable:1,
							selectCard:[1,Infinity],
							filterCard:true,
							filter:function(event,player){
								return player.ykCheckConsume('Strength',15)&&player.countCards('he')>0;
							},
							position:'he',
							content:function(){
								player.ykConsume('Strength',15,true);
								var rank=lib.ykBag['yk_xinglujue'].rank2+lib.ykBag['yk_xinglujue'].rank1;
								if(isNaN(rank)) rank=0;
								var num=5+Math.floor(15*rank*cards.length/2);
								if(num>0) player.ykRecover('Mp',num);
							},
							ai:{
								order:6,
								result:{
									player:function(player){
										return (player.ykGetMaxType('Mp')/player.ykGetType('Mp'))<=0.75&&player.countCards('h')>player.hp-1;
									},
								},
							},
						},
					},
				},
				translate:{
					'yk_zhanlujue_miaozhanshenshu':'妙湛神术·湛露',
					'yk_zhanlujue_miaozhanshenshu_info':'装备此秘籍，游戏开始时术法值上限增加15%，每个回合开始时，额外回复 5+20*(《湛露诀》领悟等级+《湛露诀》进阶等级) 术法值，出牌阶段限一次，弃置任意张手牌并消耗15气力值，回复 15*(5+《湛露诀》领悟等级+《湛露诀》进阶等级)/2*弃牌数 的术法值；（所有数值均默认向下取整）',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_xinglujue':{
			grade:'tiangrade',
			type:'book',
			ykNature:'usual',//usual为通用秘籍
			image:'yk_tian18.jpg',
			understand:{
				'yk_tian_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_di_understand':{
					'0':5,
					'1':6,
					'2':7,
					'3':10,
					'4':15,
					'5':20,
					'6':25,
					'7':40,
					'8':60,
					'9':80,
				},
				'yk_coin':{
					'0':3000,
					'1':3000,
					'2':3000,
					'3':5000,
					'4':5000,
					'5':5000,
					'6':9000,
					'7':9000,
					'8':15000,
					'9':20000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《行露诀》',
			panel:{//面板属性
				Mp:500,
				Defend:230,
				growUp1:{//等级成长
					Mp:50,
					Defend:23,
				},
				growUp2:{//进阶成长
					Mp:50,
					Defend:23,
				},
			},
			skill:{
				'yk_xinglujue_miaozhanshenshu':{
					equipSkill:true,
					init:function(player){
						player.yk_xinglujue_miaozhanshenshu=0;
						var num=Math.floor(player.ykGetMaxType('Mp')*0.2);
						if(num>0) player.ykChange('MaxMp',num);
						player.ykChange('MaxStrength',-50);
					},
					trigger:{
						player:"consumeMpAfter",
					},
					filter:function(event,player){
						return event.num>0;
					},
					forced:true,
					content:function(){
						if(isNaN(player.yk_xinglujue_miaozhanshenshu)) player.yk_xinglujue_miaozhanshenshu=0;
						player.yk_xinglujue_miaozhanshenshu+=num;
						if(player.yk_xinglujue_miaozhanshenshu>=100){
							var rank=lib.ykBag['yk_xinglujue'].rank2+lib.ykBag['yk_xinglujue'].rank1;
							if(isNaN(rank)) rank=0;
							player.yk_xinglujue_miaozhanshenshu-=100;
							player.ykRecover('Mp',3*rank);
						}
					},
				},
				translate:{
					'yk_xinglujue_miaozhanshenshu':'妙湛神术·行露',
					'yk_xinglujue_miaozhanshenshu_info':'装备此秘籍，游戏开始时术法值上限增加20%，气力值上限减少50点；每消耗100点术法值，返还3*(《行露诀》领悟等级+《行露诀》进阶等级)点术法值。（所有数值均默认向下取整）',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_shunbu':{
			grade:'huanggrade',
			type:'book',
			ykNature:'usual',//usual为通用秘籍
			image:'yk_huang3.jpg',
			understand:{
				'yk_huang_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_fan_understand':{
					'0':5,
					'1':6,
					'2':7,
					'3':10,
					'4':15,
					'5':20,
					'6':25,
					'7':40,
					'8':60,
					'9':80,
				},
				'yk_coin':{
					'0':1500,
					'1':1500,
					'2':1500,
					'3':1500,
					'4':1500,
					'5':1800,
					'6':1800,
					'7':2200,
					'8':3000,
					'9':4500,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《瞬步》',
			panel:{//面板属性
				Mp:70,
				Defend:90,
				growUp1:{//等级成长
					Mp:7,
					Defend:9,
				},
				growUp2:{//进阶成长
					Mp:14,
					Defend:18,
				},
			},
			skill:{
				'yk_shunbu_yixing':{
					equipSkill:true,
					enable:"phaseUse",
					usable:1,
					filterTarget:function(card,player,target){
						return get.distance(player,target)<=1;
					},
					selectTarget:1,
					filter:function(event,player){
						var rank=lib.ykBag['yk_shunbu'].rank2+lib.ykBag['yk_shunbu'].rank1;
						if(isNaN(rank)) rank=0;
						return player.ykCheckConsume('Strength',150-5*rank);
					},
					forced:true,
					content:function(){
						var rank=lib.ykBag['yk_shunbu'].rank2+lib.ykBag['yk_shunbu'].rank1;
						if(isNaN(rank)) rank=0;
						player.ykConsume('Strength',150-5*rank,true);
						game.broadcastAll(function(player,target){
							game.swapSeat(player,target);
						},player,target);
						if(rank>=20) player.draw();
					},
					ai:{
						order:10,
						result:{
							player:function(player){
								return 1;
							},
						},
					},
				},
				translate:{
					'yk_shunbu_yixing':'移行',
					'yk_shunbu_yixing_info':'装备此秘籍，每个出牌阶段限一次，你可以消耗 150-5*(领悟等级+进阶等级) 气力值，与你距离为一以内的其他角色交换位置。满级满阶时，每次发动均使你摸一张牌。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_jingfengzhixi':{
			grade:'xuangrade',
			type:'book',
			ykNature:'yk_wind',//usual为通用秘籍
			image:'yk_xuan4.jpg',
			understand:{
				'yk_xuan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_huang_understand':{
					'0':5,
					'1':6,
					'2':7,
					'3':10,
					'4':15,
					'5':20,
					'6':25,
					'7':40,
					'8':60,
					'9':80,
				},
				'yk_coin':{
					'0':1000,
					'1':1000,
					'2':1000,
					'3':1000,
					'4':1000,
					'5':1500,
					'6':1500,
					'7':2000,
					'8':3000,
					'9':3500,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《静风止息》',
			panel:{//面板属性
				Mp:130,
				Defend:170,
				growUp1:{//等级成长
					Mp:13,
					Defend:17,
				},
				growUp2:{//进阶成长
					Mp:26,
					Defend:34,
				},
			},
			skill:{
				'yk_jingfengzhixi_jfzx':{
					equipSkill:true,
					enable:"phaseUse",
					usable:3,
					filterTarget:true,
					selectTarget:1,
					filterCard:true,
					selectCard:[1,2],
					filter:function(event,player){
						return player.ykCheckConsume('Strength',35)&&player.countCards('he')>0;
					},
					forced:true,
					position:'he',
					content:function(){
						var rank=lib.ykBag['yk_jingfengzhixi'].rank2+lib.ykBag['yk_jingfengzhixi'].rank1;
						if(isNaN(rank)) rank=0;
						player.ykConsume('Strength',35,true);
						player.draw(cards.length);
						if(Math.random()<0.5) target.yk_addElement('yk_wind');
						if(rank>=20) player.draw();
					},
					ai:{
						order:1,
						result:{
							target:function(player,target){
								return -1;
							},
						},
					},
				},
				translate:{
					'yk_jingfengzhixi_jfzx':'静风止息',
					'yk_jingfengzhixi_jfzx_info':'出牌阶段限三次，消耗35气力值，弃置一至两张牌并选择一个目标，50%概率为其附加风元素，然后你摸等量牌，满级满阶时，每次发动你均再摸一张牌。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_shuijinghuanjie':{
			grade:'huanggrade',
			type:'book',
			ykNature:'yk_water',//usual为通用秘籍
			image:'yk_huang8.jpg',
			understand:{
				'yk_huang_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_fan_understand':{
					'0':5,
					'1':6,
					'2':7,
					'3':10,
					'4':15,
					'5':20,
					'6':25,
					'7':40,
					'8':60,
					'9':80,
				},
				'yk_coin':{
					'0':1500,
					'1':1500,
					'2':1500,
					'3':1500,
					'4':1500,
					'5':1800,
					'6':1800,
					'7':2200,
					'8':3000,
					'9':4500,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《水镜幻界》',
			panel:{//面板属性
				Mp:115,
				Defend:95,
				growUp1:{//等级成长
					Mp:12,
					Defend:10,
				},
				growUp2:{//进阶成长
					Mp:23,
					Defend:21,
				},
			},
			skill:{
				'yk_shuijinghuanjie_shuijing':{
					equipSkill:true,
					enable:"phaseUse",
					usable:1,
					filter:function(event,player){
						return player.ykCheckConsume('Strength',25);
					},
					content:function(){
						var rank=lib.ykBag['yk_jingfengzhixi'].rank2+lib.ykBag['yk_jingfengzhixi'].rank1;
						if(isNaN(rank)) rank=0;
						player.ykConsume('Strength',25,true);
						if(rank>=20) player.changeHujia();
						player.loseHp();
						lib.skill.yk_shuijinghuanjie_shuijingDamage={
							trigger:{
								player:"damageBegin",
							},
							forced:true,
							content:function(){
								trigger.cancel();
								player.recover(2);
								player.draw(2);
								if(trigger.source) trigger.source.yk_addElement('yk_water');
								player.removeSkill('yk_shuijinghuanjie_shuijingDamage');
							},
						}
						lib.translate['yk_shuijinghuanjie_shuijingDamage']='水镜';
						player.addTempSkill('yk_shuijinghuanjie_shuijingDamage',{player:"phaseBefore"});
					},
					ai:{
						order:1,
						result:{
							player:function(player){
								if(player.hasSkill('yk_shuijinghuanjie_shuijingDamage')) return -1;
								if(player.countCards('h')<player.hp) return 1;
								if(player.maxHp-player.hp>1) return 1;
								return 0;
							},
						},
					},
				},
				translate:{
					'yk_shuijinghuanjie_shuijing':'水镜',
					'yk_shuijinghuanjie_shuijing_info':'出牌阶段限用一次，消耗25气力值，减少一点体力值，若如此做，则直到下个回合开始前你受到的第一次伤害视为回复两点体力值并摸两张牌，同时给伤害来源附加水元素，满级满阶时，每次发动此技能，你均获得一点护甲。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_liaoyuanchilie':{
			grade:'digrade',
			type:'book',
			ykNature:'yk_fire',//usual为通用秘籍
			image:'yk_di4.jpg',
			understand:{
				'yk_di_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_xuan_understand':{
					'0':5,
					'1':6,
					'2':7,
					'3':10,
					'4':15,
					'5':20,
					'6':25,
					'7':40,
					'8':60,
					'9':80,
				},
				'yk_coin':{
					'0':2300,
					'1':2300,
					'2':2300,
					'3':4000,
					'4':4000,
					'5':4000,
					'6':7000,
					'7':7000,
					'8':10000,
					'9':15000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《燎原炽烈》',
			panel:{//面板属性
				Mp:195,
				Defend:205,
				growUp1:{//等级成长
					Mp:19,
					Defend:20,
				},
				growUp2:{//进阶成长
					Mp:39,
					Defend:41,
				},
			},
			skill:{
				'yk_liaoyuanchilie_jrzy':{
					enable:"phaseUse",
					usable:1,
					filter:function(event,player){
						if(player.hujia>0) return player.ykCheckConsume('Strength',45);
						if(player.countCards('he')>0) return player.ykCheckConsume('Strength',45);
						return false;
					},
					position:"he",
					content:function(){
						player.ykConsume('Strength',45,true);
						if(player.hujia>0) player.changeHujia(-1);
						else player.chooseToDiscard('he',1,true);
						lib.skill.yk_liaoyuanchilie_jrzyDamage1={
							trigger:{
								source:"damageBefore",
							},
							filter:function(event,player){
								return !event.player.yk_fire;
							},
							forced:true,
							content:function(){
								trigger.player.yk_addElement('yk_fire');
								player.removeSkill('yk_liaoyuanchilie_jrzyDamage1');
							},
						}
						player.addTempSkill('yk_liaoyuanchilie_jrzyDamage1',{player:"phaseBefore"});
					},
					group:['yk_liaoyuanchilie_jrzy_damageFire'],
					subSkill:{
						damageFire:{
							trigger:{
								source:"damageBegin",
							},
							filter:function(event,player){
								var rank=lib.ykBag['yk_liaoyuanchilie_jrzy'].rank2+lib.ykBag['yk_liaoyuanchilie_jrzy'].rank1;
								if(isNaN(rank)) rank=0;
								var num=50-2*rank;
								return event.player.yk_fire&&player.ykCheckConsume('Strength',num);
							},
							forced:true,
							content:function(){
								var rank=lib.ykBag['yk_liaoyuanchilie_jrzy'].rank2+lib.ykBag['yk_liaoyuanchilie_jrzy'].rank1;
								if(isNaN(rank)) rank=0;
								var num=50-2*rank;
								player.ykConsume('Strength',num,true);
								if(!player.hujia) player.changeHujia();
								else player.draw();
							},
						},
					},
					ai:{
						order:10,
						result:{
							player:function(player){
								if(!player.hasSkill('yk_liaoyuanchilie_jrzyDamage1')) return 1;
								return 0;
							},
						},
					},
				},
				translate:{
					'yk_liaoyuanchilie_jrzy':'极热之真意',
					'yk_liaoyuanchilie_jrzy_info':'出牌阶段限一次，消耗45气力值并移除一点护甲，若没有护甲则弃置一张牌，使直到下一回合开始前，下一次造成伤害时给目标附加火元素，你对附加有火元素的目标造成伤害时，自动消耗 50-2*(领悟等级+进阶等级) 气力值，若你没有护甲，则你获得一点护甲，否则你摸一张牌。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_ranhuo':{
			grade:'fangrade',
			type:'book',
			ykNature:'yk_fire',//usual为通用秘籍
			image:'yk_fan8.jpg',
			understand:{
				'yk_fan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_coin':{
					'0':600,
					'1':800,
					'2':1000,
					'3':1200,
					'4':1400,
					'5':1600,
					'6':1800,
					'7':2000,
					'8':2500,
					'9':3000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《染火》',
			panel:{//面板属性
				Mp:45,
				Defend:55,
				growUp1:{//等级成长
					Mp:5,
					Defend:6,
				},
				growUp2:{//进阶成长
					Mp:9,
					Defend:11,
				},
			},
			skill:{
				'yk_ranhuo_nyj':{
					enable:"phaseUse",
					usable:1,
					selectTarget:[1,3],
					filterTarget:true,
					filter:function(event,player){
						return player.ykCheckConsume('Strength',35);
					},
					content:function(){
						player.ykConsume('Strength',90,true);
						lib.skill.yk_ranhuo_nyjDamage={
							trigger:{
								player:"damageAfter",
							},
							silent:true,
							popup:false,
							forced:true,
							content:function(){
								if(player.yk_ranhuo_nyjSource&&Math.random()<0.33){
									player.yk_ranhuo_nyjSource.popup('弄焰诀');
									player.yk_ranhuo_nyjSource.draw();
								}
							},
						}
						for(var target of targets){
							target.yk_addElement('yk_fire');
							target.addTempSkill('yk_ranhuo_nyjDamage',{player:"phaseBegin"});
							target.yk_ranhuo_nyjSource=player;
						}
					},
				},
				translate:{
					'yk_ranhuo_nyj':'弄焰诀',
					'yk_ranhuo_nyj_info':'出牌阶段限一次，消耗35气力值并选择1至3个目标，为其附加火元素并流失等同于目标数的体力值，且直到下一回合开始前，目标每受到伤害，均有33%概率使你摸一张牌。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_huishui':{
			grade:'fangrade',
			type:'book',
			ykNature:'yk_water',//usual为通用秘籍
			image:'yk_fan9.jpg',
			understand:{
				'yk_fan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_coin':{
					'0':600,
					'1':800,
					'2':1000,
					'3':1200,
					'4':1400,
					'5':1600,
					'6':1800,
					'7':2000,
					'8':2500,
					'9':3000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《洄水》',
			panel:{//面板属性
				Mp:55,
				Defend:45,
				growUp1:{//等级成长
					Mp:6,
					Defend:5,
				},
				growUp2:{//进阶成长
					Mp:11,
					Defend:9,
				},
			},
			skill:{
				'yk_huishui_hs':{
					enable:"phaseUse",
					usable:1,
					filter:function(event,player){
						if(!player.ykCheckConsume('Strength',90)) return false;
						return game.hasPlayer((current)=>lib.skill.yk_huishui_hs.filterTarget(null,player,current));
					},
					selectTarget:2,
					complexTarget:true,
					filterTarget:function(card,player,target){
						if(target==player) return false;
						if(!ui.selected.targets.length){
							var hs=target.countCards('h');
							return game.hasPlayer(function(current){
								if(current==player||current==target) return false;
								var cs=current.countCards('h');
								return (hs>0||cs>0)&&Math.abs(hs-cs)==0;
							});
						}
						var current=ui.selected.targets[0],hs=target.countCards('h'),cs=current.countCards('h');
						return (hs>0||cs>0)&&Math.abs(hs-cs)==0;
					},
					multitarget:true,
					multiline:true,
					content:function(){
						player.ykConsume('Strength',90,true);
						targets[0].swapHandcards(targets[1]);
						targets[0].yk_addElement('yk_water');
						targets[1].yk_addElement('yk_water');
					},
					ai:{
						threaten:4.5,
						pretao:true,
						nokeep:true,
						order:1,
						expose:0.2,
						result:{
							target:function(player,target){
								if(!ui.selected.targets.length) return -Math.sqrt(target.countCards('h'));
								var h1=ui.selected.targets[0].getCards('h'),h2=target.getCards('h');
								var delval=get.value(h2,target)-get.value(h1,ui.selected.targets[0]);
								if(delval>=0) return 0;
								return -delval;
							},
						},
					},
				},
				translate:{
					'yk_huishui_hs':'洄水',
					'yk_huishui_hs_info':'出牌阶段限一次，你可以消耗90气力值交换两名手牌数相同的其他角色的手牌，并为他们各附加水元素。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_yinfeng':{
			grade:'fangrade',
			type:'book',
			ykNature:'yk_wind',//usual为通用秘籍
			image:'yk_fan7.jpg',
			understand:{
				'yk_fan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_coin':{
					'0':600,
					'1':800,
					'2':1000,
					'3':1200,
					'4':1400,
					'5':1600,
					'6':1800,
					'7':2000,
					'8':2500,
					'9':3000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《吟风》',
			panel:{//面板属性
				Mp:50,
				Defend:50,
				growUp1:{//等级成长
					Mp:5,
					Defend:5,
				},
				growUp2:{//进阶成长
					Mp:10,
					Defend:10,
				},
			},
			skill:{
				'yk_yinfeng_fy':{
					enable:"phaseUse",
					usable:1,
					filterCard:true,
					selectCard:2,
					filter:function(event,player){
						return player.countCards('he')>=2&&player.ykCheckConsume('Strength',30);
					},
					position:'he',
					content:function(){
						player.ykConsume('Strength',30,true);
						lib.skill.yk_yinfeng_fyDamage={
							trigger:{
								source:"damageBegin",
							},
							forced:true,
							content:function(){
								trigger.player.yk_addElement('yk_wind');
								player.draw();
							},
						}
						player.addTempSkill('yk_yinfeng_fyDamage',{player:"phaseBefore"});
					},
					ai:{
						order:4,
						result:{
							player:function(player){
								if(!player.hasSkill('yk_yinfeng_fyDamage')&&player.countCards('h',{name:"sha"})>0&&player.countCards('h')>player.hp) return 1;
								return 0;
							},
						},
					},
				},
				translate:{
					'yk_yinfeng_fy':'风吟',
					'yk_yinfeng_fy_info':'出牌阶段限一次，消耗30气力值并弃置两张牌，使直到你的下一回合开始前给目标造成伤害时，为其附加风元素并使你摸一张牌。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_hanbingjue':{
			grade:'fangrade',
			type:'book',
			ykNature:'yk_ice',//usual为通用秘籍
			image:'yk_fan6.jpg',
			understand:{
				'yk_fan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_coin':{
					'0':600,
					'1':800,
					'2':1000,
					'3':1200,
					'4':1400,
					'5':1600,
					'6':1800,
					'7':2000,
					'8':2500,
					'9':3000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《寒冰诀》',
			panel:{//面板属性
				Mp:30,
				Defend:70,
				growUp1:{//等级成长
					Mp:3,
					Defend:7,
				},
				growUp2:{//进阶成长
					Mp:6,
					Defend:14,
				},
			},
			skill:{
				'yk_hanbingjue_hb':{
					trigger:{
						source:"damageAfter",
					},
					filter:function(event,player){
						return player.ykCheckConsume('Strength',50);
					},
					content:function(){
						player.ykConsume('Strength',50,true);
						if(Math.random()<0.25) trigger.player.yk_addElement('yk_ice');
					},
				},
				translate:{
					'yk_hanbingjue_hb':'寒冰',
					'yk_hanbingjue_hb_info':'你造成伤害后，可消耗50点气力值，有25%概率使目标附加冰元素。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_shengzhiyi':{
			grade:'fangrade',
			type:'book',
			ykNature:'yk_wood',//usual为通用秘籍
			image:'yk_fan7.jpg',
			understand:{
				'yk_fan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_coin':{
					'0':600,
					'1':800,
					'2':1000,
					'3':1200,
					'4':1400,
					'5':1600,
					'6':1800,
					'7':2000,
					'8':2500,
					'9':3000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《生之意》',
			panel:{//面板属性
				Mp:20,
				Defend:80,
				growUp1:{//等级成长
					Mp:2,
					Defend:8,
				},
				growUp2:{//进阶成长
					Mp:4,
					Defend:16,
				},
			},
			skill:{
				'yk_shengzhiyi_szy':{
					trigger:{
						player:"damageAfter",
					},
					filter:function(event,player){
						return player.ykCheckConsume('Strength',60);
					},
					content:function(){
						player.ykConsume('Strength',60,true);
						if(Math.random()<0.4){
							player.recover();
							if(trigger.source) trigger.source.yk_addElement('yk_ice');
						}
					},
				},
				translate:{
					'yk_shengzhiyi_szy':'生之意',
					'yk_shengzhiyi_szy_info':'你受到伤害后，可消耗60点气力值，有40%概率回复一点体力并给伤害来源附加草元素。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_leiming':{
			grade:'fangrade',
			type:'book',
			ykNature:'yk_thunder',//usual为通用秘籍
			image:'yk_fan4.jpg',
			understand:{
				'yk_fan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_coin':{
					'0':600,
					'1':800,
					'2':1000,
					'3':1200,
					'4':1400,
					'5':1600,
					'6':1800,
					'7':2000,
					'8':2500,
					'9':3000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《雷鸣》',
			panel:{//面板属性
				Mp:60,
				Defend:40,
				growUp1:{//等级成长
					Mp:6,
					Defend:4,
				},
				growUp2:{//进阶成长
					Mp:12,
					Defend:8,
				},
			},
			skill:{
				'yk_leiming_jl':{
					trigger:{
						source:"damageAfter",
					},
					filter:function(event,player){
						return player.ykCheckConsume('Strength',35);
					},
					content:function(){
						player.ykConsume('Strength',35,true);
						if(Math.random()<0.4){
							if(trigger.player.countCards('he')>0) trigger.player.discard(trigger.player.getCards('he').randomGet());
							trigger.player.yk_addElement('yk_thunder');
						}
					},
				},
				translate:{
					'yk_leiming_jl':'惊雷',
					'yk_leiming_jl_info':'你造成伤害后，可消耗35点气力值，有40%概率使目标随机弃置一张牌并为其附加雷元素。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_yanlie':{
			grade:'fangrade',
			type:'book',
			ykNature:'yk_stone',//usual为通用秘籍
			image:'yk_fan2.jpg',
			understand:{
				'yk_fan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_coin':{
					'0':600,
					'1':800,
					'2':1000,
					'3':1200,
					'4':1400,
					'5':1600,
					'6':1800,
					'7':2000,
					'8':2500,
					'9':3000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《岩裂》',
			panel:{//面板属性
				Mp:10,
				Defend:90,
				growUp1:{//等级成长
					Mp:1,
					Defend:9,
				},
				growUp2:{//进阶成长
					Mp:2,
					Defend:18,
				},
			},
			skill:{
				'yk_yanlie_yl':{
					enable:"phaseUse",
					usable:1,
					filterTarget:function(card,player,target){
						return target.hujia>0;
					},
					selectTarget:1,
					filter:function(event,player){
						return player.ykCheckConsume('Strength',50);
					},
					content:function(){
						player.ykConsume('Strength',50,true);
						target.draw(Math.floor(target.hujia/2));
						target.changeHujia(-target.hujia);
						target.yk_addElement('yk_stone');
					},
				},
				translate:{
					'yk_yanlie_yl':'岩裂',
					'yk_yanlie_yl_info':'出牌阶段限一次，消耗50气力值并选择一个目标，其摸一半护甲值的牌并移除所有护甲，然后为其附加岩元素。（向下取整）',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_guangyao':{
			grade:'fangrade',
			type:'book',
			ykNature:'yk_light',//usual为通用秘籍
			image:'yk_fan1.jpg',
			understand:{
				'yk_fan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_coin':{
					'0':600,
					'1':800,
					'2':1000,
					'3':1200,
					'4':1400,
					'5':1600,
					'6':1800,
					'7':2000,
					'8':2500,
					'9':3000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《光耀》',
			panel:{//面板属性
				Mp:70,
				Defend:30,
				growUp1:{//等级成长
					Mp:7,
					Defend:3,
				},
				growUp2:{//进阶成长
					Mp:14,
					Defend:6,
				},
			},
			skill:{
				'yk_guangyao_sg':{
					enable:"phaseUse",
					usable:1,
					filterTarget:true,
					selectTarget:1,
					filter:function(event,player){
						return player.ykCheckConsume('Strength',40);
					},
					content:function(){
						'step 0'
						player.ykConsume('Strength',40,true);
						target.judge(function(card){
							return get.color(card)=='red'?1:0;
						});
						'step 1'
						if(result.bool){
							target.yk_addElement('yk_light');
						}
					},
				},
				translate:{
					'yk_guangyao_sg':'闪光',
					'yk_guangyao_sg_info':'出牌阶段限一次，消耗40气力值并选择一个目标，其进行一次判定，若结果为红色，为其附加光元素。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_ankong':{
			grade:'fangrade',
			type:'book',
			ykNature:'yk_dark',//usual为通用秘籍
			image:'yk_fan12.jpg',
			understand:{
				'yk_fan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_coin':{
					'0':600,
					'1':800,
					'2':1000,
					'3':1200,
					'4':1400,
					'5':1600,
					'6':1800,
					'7':2000,
					'8':2500,
					'9':3000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《暗空》',
			panel:{//面板属性
				Mp:70,
				Defend:30,
				growUp1:{//等级成长
					Mp:7,
					Defend:3,
				},
				growUp2:{//进阶成长
					Mp:14,
					Defend:6,
				},
			},
			skill:{
				'yk_ankong_ak':{
					enable:"phaseUse",
					usable:1,
					filterTarget:true,
					selectTarget:1,
					filter:function(event,player){
						return player.ykCheckConsume('Strength',40);
					},
					content:function(){
						'step 0'
						player.ykConsume('Strength',40,true);
						target.judge(function(card){
							return get.color(card)=='black'?1:0;
						});
						'step 1'
						if(result.bool){
							target.yk_addElement('yk_dark');
						}
					},
				},
				translate:{
					'yk_ankong_ak':'暗空',
					'yk_ankong_ak_info':'出牌阶段限一次，消耗40气力值并选择一个目标，其进行一次判定，若结果为黑色，为其附加暗元素。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
		'yk_zhenmocanshi':{
			grade:'fangrade',
			type:'book',
			ykNature:'usual',//usual为通用秘籍
			image:'yk_fan7.jpg',
			understand:{
				'yk_fan_understand':{//'对应领悟等级':所需数量,
					'0':1,
					'1':2,
					'2':3,
					'3':5,
					'4':10,
					'5':15,
					'6':20,
					'7':30,
					'8':40,
					'9':50,
				},
				'yk_coin':{
					'0':600,
					'1':800,
					'2':1000,
					'3':1200,
					'4':1400,
					'5':1600,
					'6':1800,
					'7':2000,
					'8':2500,
					'9':3000,
				},
			},
			copy:{//进阶所需拓印本
				'6':2,
				'7':2,
				'8':2,
				'9':3,
			},
			translation:'《真魔残式》',
			panel:{//面板属性
				Mp:40,
				Defend:60,
				growUp1:{//等级成长
					Mp:4,
					Defend:6,
				},
				growUp2:{//进阶成长
					Mp:8,
					Defend:12,
				},
			},
			skill:{
				'yk_zhenmocanshi_moxing':{
					equipSkill:true,
					trigger:{
						player:"shaMiss",
					},
					direct:true,
					filter:function(event,player){
						return event.target.isAlive()&&player.ykCheckConsume('Strength',75);
					},
					content:function(){
						player.ykConsume('Strength',75,true);
						player.damage();
						player.draw();
						trigger.untrigger();
						trigger.trigger('shaHit');
						trigger._result.bool=false;
						trigger._result.result=null;
					},
					ai:{
						"directHit_ai":true,
						skillTagFilter:function(player,tag,arg){
							var bool=(get.attitude(player,arg.target)<0&&arg.card.name=='sha'&&player.ykCheckConsume('Strength',75));
							return bool;
						},
					},
				},
				translate:{
					'yk_yk_zhenmocanshi_moxing':'魔形',
					'yk_yk_zhenmocanshi_moxing_info':'你使用杀被闪避时，你消耗75气力值且受到一点伤害并使此杀强制命中，然后你摸一张牌。',
				},
			},
			onEquip:function(player){
			},
			introduce:'',
			inscription:'',
		},
	}
	for(var item in lib.ykBook){
		var equipInfo='';
		if(lib.config.yk_myBag[item]&&lib.ykBook[item]!=undefined&&lib.ykBook[item].skill!=undefined){
			for(var skill in lib.ykBook[item].skill){
				if(skill=='translate') continue;
				lib.skill[skill]=lib.ykBook[item].skill[skill];
				lib.translate[skill]=lib.ykBook[item].skill.translate[skill];
				lib.translate[skill+'_info']=lib.ykBook[item].skill.translate[skill+'_info'];
				if(get.translation(skill+'_info')) equipInfo+='<li>【<b>'+get.translation(skill)+'</b>】：'+(lib.translate[skill+'_info']&&lib.translate[skill+'_info'].length>0?get.translation(skill+'_info'):'效果未知');
			}
			if(lib.ykBook[item].skill.translate) for(var trans in lib.ykBook[item].skill.translate){
				lib.ykBook[item].skill.translate[trans]=lib.translate[trans];
			}
		}
		lib.translate[item]=(lib.ykBook[item].translation||'未知装备');
		lib.translate[item+'_info']=lib.ykBook[item].introduce+(equipInfo.length>0?('<li><b>特技：</b>'+equipInfo):'')+(lib.ykBook[item].inscription&&lib.ykBook[item].inscription.length>0?('<br><font color=grey><i>————“'+lib.ykBook[item].inscription+'”</font></i>'):'');
	}
	//返回装备信息
	window.ykIntroduceEquip=function(name,returnBool,type,parentNode,nodialog){
		if(type!='book'&&type!='Book') var type='Equip';
		else var type='Book';
		if(name){
			if(!lib['yk'+type][name]){alert('未知的'+(type=='Equip'?'装备':'秘籍'));return ;}
			var name2=(type=='Equip'?'装备':'秘籍')+'名：【<b>'+lib['yk'+type][name].translation+'</b>】'+(lib['yk'+type][name].grade==undefined?'':('<br>'+(type=='Equip'?'装备':'秘籍')+'评级：'+(lib.translate[lib['yk'+type][name].grade]==undefined?'未知':get.translation(lib['yk'+type][name].grade))));
			var rank1,rank2;
			if(lib.config.yk_myBag[name]){
				rank1=(lib.config.yk_myBag[name].rank1||0);//领悟强化等级
				rank2=(lib.config.yk_myBag[name].rank2||0);//进阶等级
			}
			name2+='<br>'+(type=='Equip'?('装备类型：【'+get.translation(lib['yk'+type][name].ykType)+'】'):('秘籍属性：【'+get.translation(lib['yk'+type][name].ykNature)+'】'));
			if(rank1!=undefined&&rank2!=undefined) name2+='<br>'+(lib.ykEquip[name]==undefined?'领悟':'强化')+'等级：<font color=orange> + '+rank1+'</font><br>进阶等级：<font color=red> + '+rank2+'</font>';
			var skillList=[];
			if(lib['yk'+type][name].skill!=undefined){
				for(var s in lib['yk'+type][name].skill){
					skillList.push(s);
				}
			}
			var info=(name2||('未知'+(type=='Equip'?'装备':'秘籍')));
			if(lib['yk'+type][name].panel){
				info+='<li>基础属性（<font color=orange>  + '+(lib.ykEquip[name]==undefined?'领悟':'强化')+'提升</font>）（<font color=red> + 进阶提升</font>）：';
				var baseMp=(lib['yk'+type][name].panel.Mp||0);
				var baseStrength=(lib['yk'+type][name].panel.Strength||0);
				var baseDefend=(lib['yk'+type][name].panel.Defend||0);
				var baseSoul=(lib['yk'+type][name].panel.Soul||0);
				if(lib['yk'+type][name].panel&&lib['yk'+type][name].panel.growUp1&&lib['yk'+type][name].panel.growUp1.Mp) var growUp1Mp=lib['yk'+type][name].panel.growUp1.Mp;
				else var growUp1Mp=0;
				if(lib['yk'+type][name].panel&&lib['yk'+type][name].panel.growUp1&&lib['yk'+type][name].panel.growUp1.Strength) var growUp1Strength=lib['yk'+type][name].panel.growUp1.Strength;
				else var growUp1Strength=0;
				if(lib['yk'+type][name].panel&&lib['yk'+type][name].panel.growUp1&&lib['yk'+type][name].panel.growUp1.Defend) var growUp1Defend=lib['yk'+type][name].panel.growUp1.Defend;
				else var growUp1Defend=0;
				if(lib['yk'+type][name].panel&&lib['yk'+type][name].panel.growUp1&&lib['yk'+type][name].panel.growUp1.Soul) var growUp1Soul=lib['yk'+type][name].panel.growUp1.Soul;
				else var growUp1Soul=0;
				if(lib['yk'+type][name].panel&&lib['yk'+type][name].panel.growUp2&&lib['yk'+type][name].panel.growUp2.Mp) var growUp2Mp=lib['yk'+type][name].panel.growUp2.Mp;
				else var growUp2Mp=0;
				if(lib['yk'+type][name].panel&&lib['yk'+type][name].panel.growUp2&&lib['yk'+type][name].panel.growUp2.Strength) var growUp2Strength=lib['yk'+type][name].panel.growUp2.Strength;
				else var growUp2Strength=0;
				if(lib['yk'+type][name].panel&&lib['yk'+type][name].panel.growUp2&&lib['yk'+type][name].panel.growUp2.Defend) var growUp2Defend=lib['yk'+type][name].panel.growUp2.Defend;
				else var growUp2Defend=0;
				if(lib['yk'+type][name].panel&&lib['yk'+type][name].panel.growUp2&&lib['yk'+type][name].panel.growUp2.Soul) var growUp2Soul=lib['yk'+type][name].panel.growUp2.Soul;
				else var growUp2Soul=0;
				var finalMp=baseMp+rank1*growUp1Mp+rank2*growUp2Mp;
				var finalMpText='<br><font color=cyan>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp术法值：'+baseMp+'</font>（<font color=orange> + '+rank1*growUp1Mp+'</font>）（<font color=red> + '+rank2*growUp2Mp+'</font>）';
				var finalStrength=baseStrength+rank1*growUp1Strength+rank2*growUp2Strength;
				var finalStrengthText='<br><font color=yellow>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp气力值：'+baseStrength+'</font>（<font color=orange> + '+rank1*growUp1Strength+'</font>）（<font color=red> + '+rank2*growUp2Strength+'</font>）';
				var finalDefend=baseDefend+rank1*growUp1Defend+rank2*growUp2Defend;
				var finalDefendText='<br><font color=grey>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp真气值：'+baseDefend+'</font>（<font color=orange> + '+rank1*growUp1Defend+'</font>）（<font color=red> + '+rank2*growUp2Defend+'</font>）';
				var finalSoul=baseSoul+rank1*growUp1Soul+rank2*growUp2Soul;
				var finalSoulText='<br><font color=purple>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp元力值：'+baseSoul+'</font>（<font color=orange> + '+rank1*growUp1Soul+'</font>）（<font color=red> + '+rank2*growUp2Soul+'</font>）';
				if(returnBool==true) return [finalMp,finalStrength,finalDefend,finalSoul];
			}
			if(returnBool==true) return [];
			window.ykEquipInfo_dialog=ui.create.dialog('hidden');
			window.ykEquipInfo_dialog.classList.add('popped');
			window.ykEquipInfo_dialog.classList.add('static');
			window.ykEquipInfo_dialog.style.height='50%';
			window.ykEquipInfo_dialog.style.width='50%';
			window.ykEquipInfo_dialog.style.left='25%';
			window.ykEquipInfo_dialog.style.top='25%';
			window.ykEquipInfo_dialog.style.transition='all 0.5s';
			window.ykEquipInfo_dialog.style['text-align']='left';
			window.ykEquipInfo_dialog.style['z-index']=9999;
			window.ykEquipInfo_dialog.style.backgroundColor='black';
			window.ykEquipInfo_dialog.style.opacity=0.8;
			var skillInfo='<li>'+(type=='Equip'?'装备':'秘籍')+'效果：';
			if(skillList.length>0) for(var skill of skillList) if(skill!='translate') skillInfo+='<br>【<b>'+(lib.translate[skill]==undefined?'未知':get.translation(skill))+'</b>】：<br>'+(lib.translate[skill+'_info']==undefined?'未知':get.translation(skill+'_info'))+'<br>';
			var intro,inscr;
			if(lib['yk'+type][name].introduce) intro='<br><small>'+lib['yk'+type][name].introduce+'</small>';
			if(lib['yk'+type][name].inscription) inscr='<br><small><i><font color=grey>————“'+lib['yk'+type][name].inscription+'”</font></i></small>';
			var content='<span style="font-size:20px;font-weight:400;font-family:shousha">'+info+(baseMp==0?'':finalMpText)+(baseStrength==0?'':finalStrengthText)+(baseDefend==0?'':finalDefendText)+(baseSoul==0?'':finalSoulText)+(skillList.length>0?skillInfo:'')+(intro||'')+(inscr||'')+'</span>';
		}
		else{
			window.ykEquipInfo_dialog=ui.create.dialog('hidden');
			window.ykEquipInfo_dialog.classList.add('popped');
			window.ykEquipInfo_dialog.classList.add('static');
			window.ykEquipInfo_dialog.style.height='50%';
			window.ykEquipInfo_dialog.style.width='50%';
			window.ykEquipInfo_dialog.style.left='25%';
			window.ykEquipInfo_dialog.style.top='25%';
			window.ykEquipInfo_dialog.style.transition='all 0.5s';
			window.ykEquipInfo_dialog.style['text-align']='left';
			window.ykEquipInfo_dialog.style['z-index']=9999;
			window.ykEquipInfo_dialog.style.backgroundColor='black';
			window.ykEquipInfo_dialog.style.opacity=0.8;
			var content='error 当前暂无'+(type=='Equip'?'装备':'秘籍')+'或该'+(type=='Equip'?'装备':'秘籍')+'信息错误！';
		}
		window.ykEquipInfo_dialog.innerHTML=content;
		if(returnBool=='info') return content;
		window.ykEquipInfo_dialog.style['overflow-x']='hidden';
		window.ykEquipInfo_dialog.style['overflow-y']='scroll';
		lib.setScroll(window.ykEquipInfo_dialog);
		if(parentNode) parentNode.appendChild(window.ykEquipInfo_dialog);
		else if(!nodialog) document.body.appendChild(window.ykEquipInfo_dialog);
		var clickFK=function(div){
			div.style.transition='opacity 0.5s';
			div.addEventListener(lib.config.touchscreen?'touchstart':'mousedown',function(){
				this.style.transform='scale(0.95)';
			});
			div.addEventListener(lib.config.touchscreen?'touchend':'mouseup',function(){
				this.style.transform='';
			});
			div.onmouseout=function(){
				this.style.transform='';
			};
		};
		var dialogOut=ui.create.div('.menubutton.round','×',function(){
			window.ykEquipInfo_dialog.delete();
			window.ykEquipInfo_dialog=undefined;
		});
		dialogOut.style.top='5px';
		dialogOut.style.left='calc(100% - 55px)';
		dialogOut.style['zIndex']=1000;
		window.ykEquipInfo_dialog.appendChild(dialogOut);
		clickFK(dialogOut);
	}
	
	//打开配置界面
	window.ykEquip = function(){
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		ui.click.configMenu();
		if(window.ykCloseBag2&&window.ykCloseBag2!=null&&typeof window.ykCloseBag2=='function'){window.ykCloseBag2();return ;}
		var dialogx={};
		window.backgroundE=ui.create.div('hidden');
		window.backgroundE.classList.add('popped');
		window.backgroundE.classList.add('static');
		window.backgroundE.style.height='100%';
		window.backgroundE.style.width='100%';
		window.backgroundE.style.left='0px';
		window.backgroundE.style.top='0px';
		window.backgroundE.style.backgroundColor='black';
		window.backgroundE.style.opacity=0.8;
		window.backgroundE.setBackgroundImage('extension/云空/background.gif');
		window.backgroundE.style.backgroundSize="100% 100%";
		window.backgroundE.style['z-index']=499;
		ui.window.appendChild(window.backgroundE);
		dialogx.background=window.backgroundE;
		
		window.bg_new=ui.create.div();
		window.bg_new.style.height='100%';
		window.bg_new.style.width='25%';
		window.bg_new.style.left='5%';
		window.bg_new.style.top='0%';
		window.bg_new.style['box-shadow']='none';
		window.bg_new.style['overflow-y']='scroll';
		window.bg_new.style['background']='none';
		window.bg_new.style['z-index']=99;
		window.backgroundE.appendChild(window.bg_new);
		dialogx.bg_new=window.bg_new;
		
		window.t=ui.create.div();
		window.t.style.height='40px';
		window.t.style.width='100%';
		window.t.style.left='0px';
		window.t.style.top='0px';
		window.t.innerHTML='<span style="color:#FFFFFF;font-size:40px;font-weight:600px;font-family:shousha">人物资料卡</span>';
		window.bg_new.appendChild(window.t);
		
		window.b1=ui.create.div();
		window.b1.style.height='calc(100% - 40px)';
		window.b1.style.width='50%';
		window.b1.style.left='0px';
		window.b1.style.top='calc(0% + 40px)';
		window.b1.style.borderRadius='5px';
		window.b1.style['overflow-y']='scroll';
		window.bg_new.appendChild(window.b1);
		
		var name=[];
		for(var i in lib.character){
			if(lib.character[i][1]=='qxq_yk'&&i.indexOf('qxq_yk')!=-1&&lib.qxq_yk_bossList.indexOf(i)==-1){
				name.push(i);
			}
		}
		for(var i=0;i<name.length;i++){
			game[name[i]]=function(){
				if(_status.yk_onchoosing){alert('当前有未关闭的对话框！');return ;}
				if(window.ykEquipInfo_dialog){
					window.ykEquipInfo_dialog.delete();
					delete window.ykEquipInfo_dialog;
					window.ykEquipInfo_dialog=undefined;
				}
				if(game.yk_characterShow){
					game.yk_characterShow.delete();
					delete game.yk_characterShow;
					game.yk_characterShow=undefined;
				}
				if(game.yk_characterShowInfomation){
					game.yk_characterShowInfomation.delete();
					delete game.yk_characterShowInfomation;
					game.yk_characterShowInfomation=undefined;
				}
				if(game.yk_characterMpShowBg){
					game.yk_characterMpShowBg.delete();
					delete game.yk_characterMpShowBg;
					game.yk_characterMpShowBg=undefined;
				}
				if(game.yk_characterStrengthShowBg){
					game.yk_characterStrengthShowBg.delete();
					delete game.yk_characterStrengthShowBg;
					game.yk_characterStrengthShowBg=undefined;
				}
				if(game.yk_characterDefendShowBg){
					game.yk_characterDefendShowBg.delete();
					delete game.yk_characterDefendShowBg;
					game.yk_characterDefendShowBg=undefined;
				}
				if(game.yk_characterSoulShowBg){
					game.yk_characterSoulShowBg.delete();
					delete game.yk_characterSoulShowBg;
					game.yk_characterSoulShowBg=undefined;
				}
				if(game.yk_characterEquip1){
					game.yk_characterEquip1.delete();
					delete game.yk_characterEquip1;
					game.yk_characterEquip1=undefined;
				}
				if(game.yk_characterEquip2){
					game.yk_characterEquip2.delete();
					delete game.yk_characterEquip2;
					game.yk_characterEquip2=undefined;
				}
				if(game.yk_characterEquip3){
					game.yk_characterEquip3.delete();
					delete game.yk_characterEquip3;
					game.yk_characterEquip3=undefined;
				}
				if(game.yk_characterEquip4){
					game.yk_characterEquip4.delete();
					delete game.yk_characterEquip4;
					game.yk_characterEquip4=undefined;
				}
				if(game.yk_characterBook){
					game.yk_characterBook.delete();
					delete game.yk_characterBook;
					game.yk_characterBook=undefined;
				}
				if(game.yk_characterEquipTitle){
					game.yk_characterEquipTitle.delete();
					delete game.yk_characterEquipTitle;
					game.yk_characterEquipTitle=undefined;
				}
				if(game.yk_characterBookTitle){
					game.yk_characterBookTitle.delete();
					delete game.yk_characterBookTitle;
					game.yk_characterBookTitle=undefined;
				}
				for(var x=0;x<name.length;x++){
					if(this.innerHTML=='<span style="cursor:pointer;color:#FFFFFF;">'+get.translation(name[x])+'</span>'){
						lib.config.thischaractername=name[x];
						game.saveConfig('thischaractername',lib.config.thischaractername);
						window.wareHouseContent.target_name=name[x];
						
						game.yk_characterEquipBg=ui.create.div('');
						game.yk_characterEquipBg.style.height='calc( 100% - 40px )';
						game.yk_characterEquipBg.style.width='70%';
						game.yk_characterEquipBg.style.left='30%';
						game.yk_characterEquipBg.style.top='40px';
						window.backgroundE.appendChild(game.yk_characterEquipBg);
						
						game.yk_characterShow=ui.create.div('.menubutton.round','',function(){
							ui.click.charactercard(lib.config.thischaractername)
						});
						game.yk_characterShow.setBackground(name[x],'character');
						game.yk_characterShow.style.height='300px';
						game.yk_characterShow.style.width='230px';
						game.yk_characterShow.style.left='5%';
						game.yk_characterShow.style.top='5%';
						game.yk_characterShow.style.borderRadius='8px';
						game.yk_characterShow.style.backgroundSize='cover';
						game.yk_characterEquipBg.appendChild(game.yk_characterShow);
						
						//术法值
						var numMp=0;
						if(lib.config.qxq_YK_person&&lib.config.qxq_YK_person.nature&&lib.config.qxq_YK_person.nature.Mp) numMp+=(lib.config.qxq_YK_person.nature.Mp[name[x]]||0);
						var equipList=['equip1','equip2','equip3','equip4','book'];
						for(var item of equipList) if(lib.config[name[x]+'_'+item]!=undefined&&typeof lib.config[name[x]+'_'+item]=='string') numMp+=(window.ykIntroduceEquip(lib.config[name[x]+'_'+item],true,(item=='book'?'Book':'Equip'))[0]||0);
						game.yk_characterMpShowBg=ui.create.div('');
						game.yk_characterMpShowBg.style.cssText ="left:calc( 10% + "+game.yk_characterShow.style.width+" );height:20px;width:calc( 90% - 300px );top:calc(5%);";
						game.yk_characterMpShowBg.style['text-align']='left';
						game.yk_characterMpShowBg.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><font color=cyan>术法值</font>：</span>';
						game.yk_characterEquipBg.appendChild(game.yk_characterMpShowBg);
						game.yk_characterMpShow=ui.create.div('');
						game.yk_characterMpShow.style.borderRadius='8px';
						game.yk_characterMpShow.style.cssText ="left:80px;height:40%;width:0%;top:30%;background:cyan;transition:all 1s;borderRadius:8px;transform:scaleX(-1);animation:ykmp 1.5s linear infinite;";
						setTimeout(function(){
							game.yk_characterMpShow.style.width='calc( 100% - 150px )';
						},100);
						game.yk_characterMpShow.style.opacity=0.7;
						game.yk_characterMpShowBg.appendChild(game.yk_characterMpShow);
						game.yk_characterMpShowContent=ui.create.div('');
						game.yk_characterMpShowContent.style.cssText ="left:calc( 100% - 65px );height:100%;width:70px;top:0%;";
						game.yk_characterMpShowContent.style['text-align']='left';
						game.yk_characterMpShowContent.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><font color=cyan>'+numMp+'</font></span>';
						game.yk_characterMpShowBg.appendChild(game.yk_characterMpShowContent);
						
						//气力值
						var numStrength=0;
						if(lib.config.qxq_YK_person&&lib.config.qxq_YK_person.nature&&lib.config.qxq_YK_person.nature.Strength) numStrength+=(lib.config.qxq_YK_person.nature.Strength[name[x]]||0);
						var equipList=['equip1','equip2','equip3','equip4','book'];
						for(var item of equipList) if(lib.config[name[x]+'_'+item]!=undefined&&typeof lib.config[name[x]+'_'+item]=='string') numStrength+=(window.ykIntroduceEquip(lib.config[name[x]+'_'+item],true,(item=='book'?'Book':'Equip'))[1]||0);
						game.yk_characterStrengthShowBg=ui.create.div('');
						game.yk_characterStrengthShowBg.style.cssText ="left:calc( 10% + "+game.yk_characterShow.style.width+" );height:20px;width:calc( 90% - 300px );top:calc( 5% + 20px );";
						game.yk_characterStrengthShowBg.style['text-align']='left';
						game.yk_characterStrengthShowBg.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><font color=yellow>气力值</font>：</span>';
						game.yk_characterEquipBg.appendChild(game.yk_characterStrengthShowBg);
						game.yk_characterStrengthShow=ui.create.div('');
						game.yk_characterStrengthShow.style.borderRadius='8px';
						game.yk_characterStrengthShow.style.cssText ="left:80px;height:40%;width:0%;top:30%;background:yellow;transition:all 1s;borderRadius:8px;transform:scaleX(-1);animation:ykstrength 1.5s linear infinite;";
						setTimeout(function(){
							game.yk_characterStrengthShow.style.width='calc( 100% - 150px )';
						},100);
						game.yk_characterStrengthShow.style.opacity=0.7;
						game.yk_characterStrengthShowBg.appendChild(game.yk_characterStrengthShow);
						game.yk_characterStrengthShowContent=ui.create.div('');
						game.yk_characterStrengthShowContent.style.cssText ="left:calc( 100% - 65px );height:100%;width:70px;top:0%;";
						game.yk_characterStrengthShowContent.style['text-align']='left';
						game.yk_characterStrengthShowContent.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><font color=yellow>'+numStrength+'</font></span>';
						game.yk_characterStrengthShowBg.appendChild(game.yk_characterStrengthShowContent);
						
						//真气值
						var numDefend=0;
						if(lib.config.qxq_YK_person&&lib.config.qxq_YK_person.nature&&lib.config.qxq_YK_person.nature.Defend) numDefend+=(lib.config.qxq_YK_person.nature.Defend[name[x]]||0);
						var equipList=['equip1','equip2','equip3','equip4','book'];
						for(var item of equipList) if(lib.config[name[x]+'_'+item]!=undefined&&typeof lib.config[name[x]+'_'+item]=='string') numDefend+=(window.ykIntroduceEquip(lib.config[name[x]+'_'+item],true,(item=='book'?'Book':'Equip'))[2]||0);
						game.yk_characterDefendShowBg=ui.create.div('');
						game.yk_characterDefendShowBg.style.cssText ="left:calc( 10% + "+game.yk_characterShow.style.width+" );height:20px;width:calc( 90% - 300px );top:calc( 5% + 40px );";
						game.yk_characterDefendShowBg.style['text-align']='left';
						game.yk_characterDefendShowBg.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><font color=grey>真气值</font>：</span>';
						game.yk_characterEquipBg.appendChild(game.yk_characterDefendShowBg);
						game.yk_characterDefendShow=ui.create.div('');
						game.yk_characterDefendShow.style.borderRadius='8px';
						game.yk_characterDefendShow.style.cssText ="left:80px;height:40%;width:0%;top:30%;background:grey;transition:all 1s;borderRadius:8px;transform:scaleX(-1);animation:ykdefend 1.5s linear infinite;";
						setTimeout(function(){
							game.yk_characterDefendShow.style.width='calc( 100% - 150px )';
						},100);
						game.yk_characterDefendShow.style.opacity=0.7;
						game.yk_characterDefendShowBg.appendChild(game.yk_characterDefendShow);
						game.yk_characterDefendShowContent=ui.create.div('');
						game.yk_characterDefendShowContent.style.cssText ="left:calc( 100% - 65px );height:100%;width:70px;top:0%;";
						game.yk_characterDefendShowContent.style['text-align']='left';
						game.yk_characterDefendShowContent.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><font color=grey>'+numDefend+'</font></span>';
						game.yk_characterDefendShowBg.appendChild(game.yk_characterDefendShowContent);
						
						//元力值
						var numSoul=0;
						if(lib.config.qxq_YK_person&&lib.config.qxq_YK_person.nature&&lib.config.qxq_YK_person.nature.Soul){
						numSoul+=(lib.config.qxq_YK_person.nature.Soul[name[x]]||0);
							var equipList=['equip1','equip2','equip3','equip4','book'];
							for(var item of equipList) if(lib.config[name[x]+'_'+item]!=undefined&&typeof lib.config[name[x]+'_'+item]=='string') numSoul+=(window.ykIntroduceEquip(lib.config[name[x]+'_'+item],true,(item=='book'?'Book':'Equip'))[3]||0);
							game.yk_characterSoulShowBg=ui.create.div('');
							game.yk_characterSoulShowBg.style.cssText ="left:calc( 10% + "+game.yk_characterShow.style.width+" );height:20px;width:calc( 90% - 300px );top:calc( 5% + 60px );";
							game.yk_characterSoulShowBg.style['text-align']='left';
							game.yk_characterSoulShowBg.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><font color=purple>元力值</font>：</span>';
							game.yk_characterEquipBg.appendChild(game.yk_characterSoulShowBg);
							game.yk_characterSoulShow=ui.create.div('');
							game.yk_characterSoulShow.style.borderRadius='8px';
							game.yk_characterSoulShow.style.cssText ="left:80px;height:40%;width:0%;top:30%;background:purple;transition:all 1s;borderRadius:8px;transform:scaleX(-1);animation:yksoul 1.5s linear infinite;";
							setTimeout(function(){
								game.yk_characterSoulShow.style.width='calc( 100% - 150px )';
							},100);
							game.yk_characterSoulShow.style.opacity=0.7;
							game.yk_characterSoulShowBg.appendChild(game.yk_characterSoulShow);
							game.yk_characterSoulShowContent=ui.create.div('');
							game.yk_characterSoulShowContent.style.cssText ="left:calc( 100% - 65px );height:100%;width:70px;top:0%;";
							game.yk_characterSoulShowContent.style['text-align']='left';
							game.yk_characterSoulShowContent.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><font color=purple>'+numSoul+'</font></span>';
							game.yk_characterSoulShowBg.appendChild(game.yk_characterSoulShowContent);
						}
						
						var natureList=window.qxq_YK_personBookType[name[x]];
						var natureshowlist=[];
						for(var nat of natureList) if(nat!='usual') natureshowlist.push('<img style=width:40px src="'+lib.assetURL+'extension/云空/'+nat+'.jpg" >('+get.translation(nat)+')');
						var strnature='';
						for(var strn of natureshowlist) strnature+=strn+'、';
						if(strnature.length>0) strnature=strnature.slice(0,strnature.length-1);
						//角色信息
						game.yk_characterShowInfomation=ui.create.div('');
						game.yk_characterShowInfomation.style.height='calc( '+game.yk_characterShow.style.height+' - 80px )';
						game.yk_characterShowInfomation.style.width='calc( 90% - '+game.yk_characterShow.style.width+' - 5px )';
						game.yk_characterShowInfomation.style.left='calc( 10% + '+game.yk_characterShow.style.width+' )';
						game.yk_characterShowInfomation.style.top='calc( 6% + 80px )';
						game.yk_characterShowInfomation.style.border='1px solid white';
						game.yk_characterShowInfomation.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha">角色名：'+(lib.translate[name[x]]==undefined?'未知':get.translation(name[x]))+'<br>可穿戴武器类型：'+get.translation(window.qxq_YK_personWeaponType[name[x]])+'<br>可装备秘籍属性：通用、'+strnature+'<br>'+(lib.characterIntro[name[x]]||'暂无武将介绍')+'</span>';
						game.yk_characterShowInfomation.style['overflow-x']='hidden';
						game.yk_characterShowInfomation.style['overflow-y']='scroll';
						lib.setScroll(game.yk_characterShowInfomation);
						game.yk_characterEquipBg.appendChild(game.yk_characterShowInfomation);
						
						//装备
						game.yk_characterEquipTitle=ui.create.div('');
						game.yk_characterEquipTitle.style.height='20px';
						game.yk_characterEquipTitle.style.width='340px';
						game.yk_characterEquipTitle.style.left=game.yk_characterShow.style.left;
						game.yk_characterEquipTitle.style.top='calc( '+game.yk_characterShow.style.top+' + '+game.yk_characterShow.style.height+' + 20px )';
						game.yk_characterEquipTitle.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha">装备栏【武器--防具--饰品--其他】</span>';
						game.yk_characterEquipBg.appendChild(game.yk_characterEquipTitle);
						
						var yk_characterEquipShowItemInfo=function(div,infoContent,equipname,equiptype){
							if(!div) return ;
							if(!infoContent) infoContent='';
							div.infoContent=infoContent;
							if(equipname) div.equipname=equipname;
							if(lib.device!=undefined&&!name){alert('error 装备信息错误！请及时向作者反馈！');return ;}
							if(equiptype!='book'&&equiptype!='Book') div.equiptype='Equip';
							else div.equiptype='Book';
							var info=ui.create.div('.menu');
							info.style.transition='left 0s,top 0s,opacity .3s';
							info.style.width='312px';
							info.style['pointer-events']='none';
							if(infoContent.indexOf('error')==-1) info.style['text-align']='left';
							else info.style['text-align']='center';
							info.style.animation='fadeShow .3s';
							info.style['-webkit-animation']='fadeShow .3s';
							info.style['z-index']=9999999;
							div.info=info;
							if(lib.device==undefined){
								div.onmouseover=function(){
									var info=this.info;
									info.innerHTML=(this.infoContent||'暂无信息');
									ui.window.appendChild(info);
									info.hide();
									info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
									info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
									if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
										info.style.left='calc( 100% - 312px )';
										info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
									};
									if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
										info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
									};
									if(info.offsetTop<0){
										info.style.top='0px';
									};
									info.show();
								};
								div.onmousemove=function(){
									var info=this.info;
									info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
									info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
									if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
										info.style.left='calc( 100% - 312px )';
										info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
									};
									if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
										info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
									};
									if(info.offsetTop<0){
										info.style.top='0px';
									};
								};
								div.onmouseout=function(){
									var info=this.info;
									info.hide();
								};
							}
							div.onclick=function(){
								if(_status.yk_onchoosing){alert('当前有未关闭的对话框！');return ;}
								_status.yk_onchoosing=true;
								var blockx=ui.create.div('');
								blockx.style.height='100%';
								blockx.style.width='100%';
								blockx.style.left='0%';
								blockx.style.top='0%';
								blockx.style['z-index']=99999;
								window.backgroundE.appendChild(blockx);
								window.ykIntroduceEquip(this.equipname,'',this.equiptype,null,true);
								var clickAnimation=function(div){
									div.style.transition='opacity 0.5s';
									div.addEventListener(lib.config.touchscreen?'touchstart':'mousedown',function(){
										this.style.transform='scale(0.95)';
									});
									div.addEventListener(lib.config.touchscreen?'touchend':'mouseup',function(){
										this.style.transform='';
									});
									div.onmouseout=function(){
										this.style.transform='';
									};
								};
								var background1=ui.create.dialog('hidden');
								background1.style.height='calc(100%)';
								background1.style.width='calc(100%)';
								background1.style.left='0px';
								background1.style.top='0px';
								background1.style.zIndex="999";
								ui.window.appendChild(background1);
								var box=document.createElement("div");
								var button=document.createElement("div");
								var button1=document.createElement("div");
								var boxName={
									width:"550px",
									height:"400px",
									display:"table",
									background:'rgba(0,0,0,0.4)',
									border:"2px solid black",
									position:"absolute",
									top:"calc(50% - 200px)",
									left:"calc(50% - 275px)",
									zIndex:"999999999",
									textAlign:"left",
									lineHeight:"20px",
									borderRadius:"3px",
									animation:'fadeInDown .3s',
									'-webkit-animation':'fadeInDown .3s',
								};
								for(var k in boxName){
									box.style[k]=boxName[k];
								};
								document.body.appendChild(box);
								var item=this.link;
								var backgroundContent=ui.create.div('');
								backgroundContent.style.height='calc( 100% - 45px )';
								backgroundContent.style.width='calc(100%)';
								backgroundContent.style.left='0px';
								backgroundContent.style.top='0px';
								backgroundContent.style.zIndex="99999";
								backgroundContent.style['text-align']='left';
								backgroundContent.style['box-shadow']='none';
								backgroundContent.style['overflow-x']='hidden';
								backgroundContent.style['overflow-y']='scroll';
								lib.setScroll(backgroundContent);
								backgroundContent.innerHTML=game.getItemInfo(this.link);
								box.appendChild(backgroundContent);
								button.innerHTML='关闭';
								button1.innerHTML='卸下';
								clickAnimation(button);
								clickAnimation(button1);
								var btnName={
									border:"1px solid #ccc",
									width:"70px",
									height:"30px",
									textAlign:"center",
									lineHeight:"30px",
									outline:"none",
									position:"absolute",
									bottom:"10px",
									right:"10px",
									cursor:"pointer",
								};
								for(var j in btnName){
									button.style[j]=btnName[j];
									button1.style[j]=btnName[j];
								};
								button1.style.right='90px';
								box.appendChild(button);
								if((lib.yk_otherItemLibrary[item]||lib.ykEquip[item]||lib.ykBook[item])&&lib.config.yk_myBag[item]&&lib.config[window.wareHouseContent.target_name+'_'+this.type]) box.appendChild(button1);
								button.addEventListener("click",function(){
									blockx.delete();
									background1.delete();
									box.delete();
									_status.yk_onchoosing=false;
								});
								button1.link=this.link;
								button1.link1=this.link1;
								button1.link_name=this.link;
								button1.link_type=this.type;
								button1.addEventListener("click",function(){
									var item=this.link_name;
									var type=this.link_type;
									if(!window.wareHouseContent.target_name){alert('error 未选择角色！');return ;}
									if(!lib.config[window.wareHouseContent.target_name+'_'+type]){alert('error 目标角色无装备！');return ;}
									if(lib.config[window.wareHouseContent.target_name+'_'+type]!=item){alert('error 目标角色装备错误！');return ;}
									var equipname=lib.config[window.wareHouseContent.target_name+'_'+type];
									if(!lib.config.yk_myBag[equipname]) lib.config.yk_myBag[equipname]={};
									lib.config.yk_myBag[equipname].isUsing=false;
									game.saveConfig('yk_myBag',lib.config.yk_myBag);
									lib.config[window.wareHouseContent.target_name+'_'+type]=undefined;
									game.saveConfig(window.wareHouseContent.target_name+'_'+type,lib.config[window.wareHouseContent.target_name+'_'+type]);
									blockx.delete();
									background1.delete();
									box.delete();
									_status.yk_onchoosing=false;
									window.ykEquip();
									setTimeout(function(){window.ykEquip();},500);
								});
							}
						}
						
						
						game.yk_characterEquip1=ui.create.div('.card');
						game.yk_characterEquip1.style.height='90px';
						game.yk_characterEquip1.style.width='75px';
						game.yk_characterEquip1.style.left=game.yk_characterShow.style.left;
						game.yk_characterEquip1.style.top='calc( '+game.yk_characterShow.style.top+' + '+game.yk_characterShow.style.height+' + 40px )';
						game.yk_characterEquip1.style.borderRadius='8px';
						if(lib.config[name[x]+'_equip1']){
							if(lib.ykEquip&&lib.ykEquip[lib.config[name[x]+'_equip1']]&&lib.ykEquip[lib.config[name[x]+'_equip1']].image) window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.ykEquip[lib.config[name[x]+'_equip1']].image,game.yk_characterEquip1,true,"cover");
							else window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.config[name[x]+'_equip1']+'.jpg',game.yk_characterEquip1,true,"cover");
						}
						game.yk_characterEquipBg.appendChild(game.yk_characterEquip1);
						game.yk_characterEquip1.link=lib.config[name[x]+'_equip1'];
						game.yk_characterEquip1.type='equip1';
						yk_characterEquipShowItemInfo(game.yk_characterEquip1,window.ykIntroduceEquip(lib.config[name[x]+'_equip1'],'info','Equip'),lib.config[name[x]+'_equip1'],'Equip');
						
						game.yk_characterEquip2=ui.create.div('.card');
						game.yk_characterEquip2.style.height='90px';
						game.yk_characterEquip2.style.width='75px';
						game.yk_characterEquip2.style.left='calc( '+game.yk_characterEquip1.style.left+' + 10px )';
						game.yk_characterEquip2.style.top=game.yk_characterEquip1.style.top;
						game.yk_characterEquip2.style.borderRadius='8px';
						if(lib.config[name[x]+'_equip2']){
							if(lib.ykEquip&&lib.ykEquip[lib.config[name[x]+'_equip2']]&&lib.ykEquip[lib.config[name[x]+'_equip2']].image) window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.ykEquip[lib.config[name[x]+'_equip2']].image,game.yk_characterEquip2,true,"cover");
							else window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.config[name[x]+'_equip2']+'.jpg',game.yk_characterEquip2,true,"cover");
						}
						game.yk_characterEquipBg.appendChild(game.yk_characterEquip2);
						game.yk_characterEquip2.link=lib.config[name[x]+'_equip2'];
						game.yk_characterEquip2.type='equip2';
						yk_characterEquipShowItemInfo(game.yk_characterEquip2,window.ykIntroduceEquip(lib.config[name[x]+'_equip2'],'info','Equip'),lib.config[name[x]+'_equip2'],'Equip');
						
						game.yk_characterEquip3=ui.create.div('.card');
						game.yk_characterEquip3.style.height='90px';
						game.yk_characterEquip3.style.width='75px';
						game.yk_characterEquip3.style.left='calc( '+game.yk_characterEquip2.style.left+' + 10px )';
						game.yk_characterEquip3.style.top=game.yk_characterEquip1.style.top;
						game.yk_characterEquip3.style.borderRadius='8px';
						if(lib.config[name[x]+'_equip3']){
							if(lib.ykEquip&&lib.ykEquip[lib.config[name[x]+'_equip3']]&&lib.ykEquip[lib.config[name[x]+'_equip3']].image) window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.ykEquip[lib.config[name[x]+'_equip3']].image,game.yk_characterEquip3,true,"cover");
							else window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.config[name[x]+'_equip3']+'.jpg',game.yk_characterEquip3,true,"cover");
						}
						game.yk_characterEquipBg.appendChild(game.yk_characterEquip3);
						game.yk_characterEquip3.link=lib.config[name[x]+'_equip3'];
						game.yk_characterEquip3.type='equip3';
						yk_characterEquipShowItemInfo(game.yk_characterEquip3,window.ykIntroduceEquip(lib.config[name[x]+'_equip3'],'info','Equip'),lib.config[name[x]+'_equip3'],'Equip');
						
						game.yk_characterEquip4=ui.create.div('.card');
						game.yk_characterEquip4.style.height='90px';
						game.yk_characterEquip4.style.width='75px';
						game.yk_characterEquip4.style.left='calc( '+game.yk_characterEquip3.style.left+' + 10px )';
						game.yk_characterEquip4.style.top=game.yk_characterEquip1.style.top;
						game.yk_characterEquip4.style.borderRadius='8px';
						if(lib.config[name[x]+'_equip4']){
							if(lib.ykEquip&&lib.ykEquip[lib.config[name[x]+'_equip4']]&&lib.ykEquip[lib.config[name[x]+'_equip4']].image) window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.ykEquip[lib.config[name[x]+'_equip4']].image,game.yk_characterEquip4,true,"cover");
							else window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.config[name[x]+'_equip4']+'.jpg',game.yk_characterEquip4,true,"cover");
						}
						game.yk_characterEquipBg.appendChild(game.yk_characterEquip4);
						game.yk_characterEquip4.link=lib.config[name[x]+'_equip4'];
						game.yk_characterEquip4.type='equip4';
						yk_characterEquipShowItemInfo(game.yk_characterEquip4,window.ykIntroduceEquip(lib.config[name[x]+'_equip4'],'info','Equip'),lib.config[name[x]+'_equip4'],'Equip');
						
						//秘籍
						game.yk_characterBookTitle=ui.create.div('');
						game.yk_characterBookTitle.style.height=game.yk_characterEquipTitle.style.height;
						game.yk_characterBookTitle.style.width='50px';
						game.yk_characterBookTitle.style.left='calc( 100% - 100px )';
						game.yk_characterBookTitle.style.left='calc( 5% + '+(4*85-10+155)+'px )';
						game.yk_characterBookTitle.style.top=game.yk_characterEquipTitle.style.top;
						game.yk_characterBookTitle.style.borderRadius='8px';
						game.yk_characterBookTitle.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha">秘籍</span>';
						game.yk_characterEquipBg.appendChild(game.yk_characterBookTitle);
						
						game.yk_characterBook=ui.create.div('.card');
						game.yk_characterBook.style.height='90px';
						game.yk_characterBook.style.width='90px';
						game.yk_characterBook.style.left='calc( '+game.yk_characterEquip4.style.left+' + 100px )';
						game.yk_characterBook.style.top=game.yk_characterEquip1.style.top;
						game.yk_characterBook.style.borderRadius='8px';
						if(lib.config[name[x]+'_book']){
							if(lib.ykEquip&&lib.ykBook[lib.config[name[x]+'_book']]&&lib.ykBook[lib.config[name[x]+'_book']].image) window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.ykBook[lib.config[name[x]+'_book']].image,game.yk_characterBook,true,"cover");
							else window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.config[name[x]+'_book']+'.jpg',game.yk_characterBook,true,"cover");
						}
						game.yk_characterEquipBg.appendChild(game.yk_characterBook);
						game.yk_characterBook.link=lib.config[name[x]+'_book'];
						game.yk_characterBook.type='book';
						yk_characterEquipShowItemInfo(game.yk_characterBook,window.ykIntroduceEquip(lib.config[name[x]+'_book'],'info','Book'),lib.config[name[x]+'_book'],'Book');
					}
				}
				for(var j=0;j<b1.childNodes.length;j++){
					window.b1.childNodes[j].style.backgroundColor="";
				};
				this.style.backgroundColor="#E00000";
			};
			var div=ui.create.div('','<span style="cursor:pointer;color:#FFFFFF;">'+get.translation(name[i])+'</span>',game[name[i]]);
			div.style['font-size']='20px';
			//div.style['line-height']='40px';
			div.style['font-family']="'STXinwei','xinwei'";
			div.style['background-image']='linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))';
			div.style['box-shadow']='rgba(0, 0, 0, 0.4) 0 0 0 1px, rgba(0, 0, 0, 0.2) 0 3px 10px';
			div.style['white-space']='nowrap';
			div.style.cursor='pointer';
			div.style.height='5%';
			div.style.width='100%';
			div.style.top='0px';
			div.style.left='0px';
			div.style.borderRadius='8px';
			div.style.position='relative';
			div.style['margin-top']='5px';
			div.style['text-align']='center';
			div.link='all';
			window.b1.appendChild(div);
			window.yk_clickFK(div);
		}
		
		var div=ui.create.div();
		div.style.height='100%';
		div.style.width='100%';
		div.style.left='0px';
		div.style.top='0px';
		var funcx=function(){
			for(var i in dialogx){
				dialogx[i].delete();
				delete dialogx[i];
			};
			window.ykCloseBag2=null;
			lib.houseOpen=false;
			_status.yk_onchoosing=false;
		};
		window.ykCloseBag2=funcx;
		setTimeout(function(){
			div.onclick=function(){
				funcx();
			};
		},750);
		window.backgroundE.appendChild(div);
		var div=ui.create.div('.menubutton.round','×',function(){
			funcx();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['zIndex']=1000;
		window.backgroundE.appendChild(div);
		window.yk_clickFK(div);
		game.closeBag=funcx;
		
		var dialogH={};
		window.wareHouse=ui.create.dialog('hidden');
		window.wareHouse.classList.add('popped');
		window.wareHouse.classList.add('static');
		window.wareHouse.style.cssText ="transition:all 1s;";
		window.wareHouse.style.height='calc(60%)';
		window.wareHouse.style.width='calc(60%)';
		window.wareHouse.style.left='-57%';
		window.wareHouse.style.top='20%';
		window.wareHouse.style.backgroundColor='black';
		window.wareHouse.style['z-index']=9999;
		window.wareHouse.style.backgroundColor='white';
		window.wareHouse.style.opacity=0.85;
		window.wareHouse.setBackgroundImage('extension/云空/background.gif');
		window.wareHouse.style.backgroundSize="100% 100%";
		window.backgroundE.appendChild(window.wareHouse);
		dialogH.background=window.wareHouse;
		window.wareHouseName=ui.create.div('');
		window.wareHouseName.style.height='10%';
		window.wareHouseName.style.width='100%';
		window.wareHouseName.style.left='0%';
		window.wareHouseName.style.top='0%';
		window.wareHouseName.style['z-index']=9999;
		window.wareHouseName.innerHTML='<span style="color:#000000;font-size:25px;font-weight:400;font-family:shousha">背包</span>';
		window.wareHouseName.style['text-align']='center';
		window.wareHouse.appendChild(window.wareHouseName);
		window.wareHouseOpenTitle=function(){
			if(!lib.houseOpen||lib.houseOpen==undefined||lib.houseOpen==false){
				lib.houseOpen=true;
				window.wareHouse.style.left='-57%';
				window.wareHouseTitle=ui.create.div('.menubutton.round','',window.wareHouseOpenTitle);
				window.wareHouseTitle.style.height='8%';
				window.wareHouseTitle.innerHTML='>';
				window.wareHouseTitle.style.width='5%';
				window.wareHouseTitle.style.right='0%';
				window.wareHouseTitle.style.top='47%';
				window.wareHouseTitle.style.borderRadius='0px';
				window.wareHouse.appendChild(window.wareHouseTitle);
				window.yk_clickFK(window.wareHouseTitle);
			}
			else{
				lib.houseOpen=false;
				window.wareHouse.style.left='20%';
				window.wareHouseTitle.innerHTML='<';
			}
		}
		window.wareHouseOpenTitle();
		
		window.yk_wareHouseOptionList=['全部','装备','秘籍','道具'];
		window.yk_wareHousedialog=ui.create.div('.menu');
		window.yk_wareHousedialog.style.zIndex=99999999;
		window.yk_wareHousedialog.style.display='none';
		window.yk_wareHousedialog.style.animation='fadeleftIn1 .4s';
		window.yk_wareHousedialog.style['-webkit-animation']='fadeleftIn1 .4s';
		window.wareHouse.appendChild(window.yk_wareHousedialog);
		window.wareHouseOption=ui.create.div('');
		window.wareHouseOption.style.height='25px';
		window.wareHouseOption.style.width='50px';
		window.wareHouseOption.style.left='calc( 100% - 50px )';
		window.wareHouseOption.style.top='0%';
		window.wareHouseOption.style.borderRadius='8px';
		window.wareHouseOption.style['z-index']=99999;
		if(!window.yk_wareHouseOptionResult) window.yk_wareHouseOptionResult='全部';
		window.wareHouseOption.innerHTML='<span style="color:#000000;font-size:25px;font-weight:400;font-family:shousha">'+window.yk_wareHouseOptionResult+'</span>';
		window.wareHouse.appendChild(window.wareHouseOption);
		window.yk_clickFK(window.wareHouseOption);
		window.wareHouseOption.isShow=true;
		window.wareHouseOption.onclick=function(){
			if(!window.wareHouseOption.isShow){
				window.wareHouseOption.isShow=true;
				window.yk_wareHousedialog.style.display='none';
			}else{
				window.wareHouseOption.isShow=false;
				window.yk_wareHousedialog.innerHTML='';
				window.yk_wareHousedialog.style.left='calc( '+window.wareHouseOption.style.left+' - 20px )';
				window.yk_wareHousedialog.style.top='calc( 10px + '+window.wareHouseOption.style.height+' )';
				window.yk_wareHousedialog.style.width='calc( 20px + '+window.wareHouseOption.style.width+' )';
				window.yk_wareHousedialog.style.height=35*window.yk_wareHouseOptionList.length+'px';
				window.yk_wareHousedialog.style['text-align']='center';
				window.yk_wareHousedialog.style.display='';
				for(var i=0;i<window.yk_wareHouseOptionList.length;i++){
					var div=ui.create.div('.menu',get.translation(window.yk_wareHouseOptionList[i]));
					div.style['font-size']='25px';
					div.style['text-align']='center';
					div.style.borderRadius='5px';
					div.style['font-family']="'STXinwei','xinwei'";
					div.style.cursor='pointer';
					div.style.top='0px';
					div.style.width='calc( 100% - 10px )';
					div.style.margin='5px';
					div.style.position='relative';
					window.yk_wareHousedialog.appendChild(div);
					window.yk_clickFK(div);
					div.name=window.yk_wareHouseOptionList[i];
					div.onclick=function(){
						window.wareHouseOption.innerHTML='<span style="color:#000000;font-size:25px;font-weight:400;font-family:shousha">'+this.name+'</span>';
						window.yk_wareHouseOptionResult=this.name;
						window.wareHouseOption.isShow=true;
						window.yk_wareHousedialog.style.display='none';
						window.ykEquip();
						setTimeout(function(){window.ykEquip();},500);
					};
				};
			};
		}
		var yk_characterEquipShowItemInfo2=function(div,itemname){
			if(!div) return ;
			if(itemname) div.itemname=itemname;
			var info=ui.create.div('.menu');
			info.style.transition='left 0s,top 0s,opacity .3s';
			info.style.width='312px';
			info.style['pointer-events']='none';
			info.style['text-align']='left';
			info.style.animation='fadeShow .3s';
			info.style['-webkit-animation']='fadeShow .3s';
			info.style['z-index']=999999;
			div.info=info;
			if(lib.device==undefined){
				div.onmouseover=function(){
					var info=this.info;
					info.innerHTML=(game.getItemInfo(this.itemname)||'暂无信息');
					ui.window.appendChild(info);
					info.hide();
					info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
					info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
					if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
						info.style.left='calc( 100% - 312px )';
						info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
					};
					if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
						info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
					};
					if(info.offsetTop<0){
						info.style.top='0px';
					};
					info.show();
				};
				div.onmousemove=function(){
					var info=this.info;
					info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
					info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
					if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
						info.style.left='calc( 100% - 312px )';
						info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
					};
					if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
						info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
					};
					if(info.offsetTop<0){
						info.style.top='0px';
					};
				};
				div.onmouseout=function(){
					var info=this.info;
					info.hide();
				};
			}
		}
		window.wareHouseContent=ui.create.div('');
		window.wareHouseContent.style.height='90%';
		window.wareHouseContent.style.width='90%';
		window.wareHouseContent.style.left='5%';
		window.wareHouseContent.style.top='10%';
		window.wareHouseContent.target_name=undefined;
		window.wareHouseContent.style['text-align']='left';
		window.wareHouseContent.style['z-index']=9999999;
		window.wareHouseContent.style['overflow-x']='hidden';
		window.wareHouseContent.style['overflow-y']='scroll';
		lib.setScroll(window.wareHouseContent);
		window.wareHouse.appendChild(window.wareHouseContent);
		var list=[];
		for(var i in lib.config.yk_myBag){
			list.push(i);
		}
		list.sort();
		for(var i of list){
			if((lib.yk_otherItemLibrary[i]||lib.ykEquip[i]||lib.ykBook[i])&&lib.config.yk_myBag[i].isUsing!=true){
				if(window.yk_wareHouseOptionResult=='装备'&&!lib.ykEquip[i]) continue;
				if(window.yk_wareHouseOptionResult=='秘籍'&&!lib.ykBook[i]) continue;
				if(window.yk_wareHouseOptionResult=='道具'&&!lib.yk_otherItemLibrary[i]) continue;
				var divx=ui.create.div('.card','',function(){
					if(_status.yk_onchoosing){alert('当前有未关闭的对话框！');return ;}
					_status.yk_onchoosing=true;
					var block=ui.create.div('');
					block.style.height='100%';
					block.style.width='100%';
					block.style.left='0%';
					block.style.top='0%';
					block.style['z-index']=49999;
					window.backgroundE.appendChild(block);
					var clickAnimation=function(div){
						div.style.transition='opacity 0.5s';
						div.addEventListener(lib.config.touchscreen?'touchstart':'mousedown',function(){
							this.style.transform='scale(0.95)';
						});
						div.addEventListener(lib.config.touchscreen?'touchend':'mouseup',function(){
							this.style.transform='';
						});
						div.onmouseout=function(){
							this.style.transform='';
						};
					};
					var background1=ui.create.dialog('hidden');
					background1.style.height='calc(100%)';
					background1.style.width='calc(100%)';
					background1.style.left='0px';
					background1.style.top='0px';
					background1.style.zIndex="999";
					ui.window.appendChild(background1);
					var box=document.createElement("div");
					var button=document.createElement("div");
					var button1=document.createElement("div");
					var button2=document.createElement("div");
					var boxName={
						width:"550px",
						height:"400px",
						display:"table",
						background:'rgba(0,0,0,0.4)',
						border:"2px solid black",
						position:"absolute",
						top:"calc(50% - 200px)",
						left:"calc(50% - 275px)",
						zIndex:"999999999",
						textAlign:"left",
						lineHeight:"20px",
						borderRadius:"3px",
						animation:'fadeInDown .3s',
						'-webkit-animation':'fadeInDown .3s',
					};
					for(var k in boxName){
						box.style[k]=boxName[k];
					};
					document.body.appendChild(box);
					var item=this.link;
					var backgroundContent=ui.create.div('');
					backgroundContent.style.height='calc( 100% - 45px )';
					backgroundContent.style.width='calc(100%)';
					backgroundContent.style.left='0px';
					backgroundContent.style.top='0px';
					backgroundContent.style.zIndex="99999";
					backgroundContent.style['text-align']='left';
					backgroundContent.style['box-shadow']='none';
					backgroundContent.style['overflow-x']='hidden';
					backgroundContent.style['overflow-y']='scroll';
					lib.setScroll(backgroundContent);
					backgroundContent.innerHTML='<b>'+(window.wareHouseContent.target_name==undefined?'当前未选择使用目标！':'使用目标【'+get.translation(window.wareHouseContent.target_name)+'】')+'</b><br>'+game.getItemInfo(this.link);
					box.appendChild(backgroundContent);
					button.innerHTML='关闭';
					if(lib.ykEquip[this.link]||lib.ykBook[this.link]) button1.innerHTML='装备';
					else button1.innerHTML='使用';
					if(lib.yk_otherItemLibrary[this.link]&&lib.yk_otherItemLibrary[this.link].canSale) button2.innerHTML='<font color=red><b>出售</b></font>';
					else button2.innerHTML='<font color=red><b>丢弃</b></font>';
					clickAnimation(button);
					clickAnimation(button1);
					clickAnimation(button2);
					var btnName={
						border:"1px solid #ccc",
						width:"70px",
						height:"30px",
						textAlign:"center",
						lineHeight:"30px",
						outline:"none",
						position:"absolute",
						bottom:"10px",
						right:"10px",
						cursor:"pointer",
					};
					for(var j in btnName){
						button.style[j]=btnName[j];
						button1.style[j]=btnName[j];
						button2.style[j]=btnName[j];
					};
					button1.style.right='90px';
					button2.style.right='170px';
					box.appendChild(button);
					box.appendChild(button1);
					if(!lib.yk_otherItemLibrary[this.link]||(lib.yk_otherItemLibrary[this.link]&&lib.yk_otherItemLibrary[this.link].destroyable!=false)) box.appendChild(button2);
					button.addEventListener("click",function(){
						block.delete();
						background1.delete();
						box.delete();
						_status.yk_onchoosing=false;
					});
					button1.link=this.link;
					button1.link_name=this.link;
					button1.link_type=this.type;
					button1.addEventListener("click",function(){
						var item=this.link_name;
						var type=this.link_type;
						if(['equip1','book'].indexOf(type)!=-1){//仅仅是武器和秘籍，不包括其他装备
							if(!window.wareHouseContent.target_name){alert('error 未指定使用角色！');return ;}
							if(!window.qxq_YK_personBookType&&!window.qxq_YK_personWeaponType){
								alert('error 信息读取错误！');
								block.delete();
								background1.delete();
								box.delete();
								_status.yk_onchoosing=false;
								window.ykEquip();
								setTimeout(function(){window.ykEquip();},500);
								return ;
							}
							if(confirm((lib.config[window.wareHouseContent.target_name+'_'+type]==undefined?('是否给【'+get.translation(window.wareHouseContent.target_name)+'】穿戴【'+get.translation(item)+'】？'):('【'+get.translation(window.wareHouseContent.target_name)+'】已穿戴装备【'+get.translation(lib.config[window.wareHouseContent.target_name+'_'+type])+'】，是否替换为【'+get.translation(item)+'】？')))){
								if((lib.ykEquip[item]&&window.qxq_YK_personWeaponType[window.wareHouseContent.target_name].indexOf(lib.ykEquip[item].ykType)!=-1)||((lib.ykBook[item]&&window.qxq_YK_personBookType[window.wareHouseContent.target_name].indexOf(lib.ykBook[item].ykNature)!=-1)||lib.ykBook[item].ykNature=='usual')){
									if(window.wareHouseContent.target_name&&type!='item'){
										if(lib.config[window.wareHouseContent.target_name+'_'+type]){
											var old_equip=lib.config[window.wareHouseContent.target_name+'_'+type];
											if(!lib.config.yk_myBag[old_equip]) lib.config.yk_myBag[old_equip]={};
											lib.config.yk_myBag[old_equip].isUsing=false;
										}
										if(!lib.config.yk_myBag[item]) lib.config.yk_myBag[item]={};
										lib.config.yk_myBag[item].isUsing=true;
										game.saveConfig(window.wareHouseContent.target_name+'_'+type,item);
										game.saveConfig('yk_myBag',lib.config.yk_myBag);
									}
								}
								else{
									alert('该角色无法穿戴'+(lib.ykEquip[item]==undefined?'':(get.translation(lib.ykEquip[item].ykType)+'类型的武器'))+(lib.ykBook[item]==undefined?'':(get.translation(lib.ykBook[item].ykNature)+'类型的秘籍'))+'，该角色能穿戴的武器类型有：'+get.translation(window.qxq_YK_personWeaponType[window.wareHouseContent.target_name])+'，该角色能穿戴的秘籍属性有：通用、'+get.translation(window.qxq_YK_personBookType[window.wareHouseContent.target_name])+'！');
								}
								block.delete();
								background1.delete();
								box.delete();
								_status.yk_onchoosing=false;
								window.ykEquip();
								setTimeout(function(){window.ykEquip();},500);
							}
						}
						else{
							if(['equip2','equip3','equip4'].indexOf(type)!=-1&&lib.ykEquip[item]){//防具、饰品、其他装备
								if(!window.wareHouseContent.target_name){alert('error 未指定使用角色！');return ;}
								if(lib.config[window.wareHouseContent.target_name+'_'+type]){
									var old_equip=lib.config[window.wareHouseContent.target_name+'_'+type];
									if(!lib.config.yk_myBag[old_equip]) lib.config.yk_myBag[old_equip]={};
									lib.config.yk_myBag[old_equip].isUsing=false;
								}
								if(!lib.config.yk_myBag[item]) lib.config.yk_myBag[item]={};
								lib.config.yk_myBag[item].isUsing=true;
								game.saveConfig(window.wareHouseContent.target_name+'_'+type,item);
								game.saveConfig('yk_myBag',lib.config.yk_myBag);
							}
							else if(!lib.yk_otherItemLibrary[item]){
								delete lib.config.yk_myBag[item];
								game.saveConfig('yk_myBag',lib.config.yk_myBag);
								alert('使用失败！不合法的道具！已自动将其移除！');
							}
							else{
								game.yk_openUseItem(item);
							}
							block.delete();
							background1.delete();
							box.delete();
							_status.yk_onchoosing=false;
							window.ykEquip();
							setTimeout(function(){window.ykEquip();},500);
						}
					});
					button2.link=this.link;
					button2.link_name=this.link;
					button2.link_type=this.type;
					button2.addEventListener("click",function(){
						var item=this.link_name;
						var type=this.link_type;
						if(lib.yk_otherItemLibrary[item]&&lib.yk_otherItemLibrary[item].canSale){
							if(confirm('确认操作：出售后将不可恢复，是否出售【'+get.translation(item)+'】？')){
								if(!lib.config.yk_myBag[item]){
									alert('error 物品信息错误！');
								}else{
									if(typeof lib.config.yk_myBag[item].num=='number'){
										if(confirm('是否全部出售？')){
											var num=lib.config.yk_myBag[item].num;
											var value=(lib.yk_otherItemLibrary[item].value||0);
											game.yk_loseItem(item,num);
											game.ykChangeCoin(num*value);
										}
										else{
											var value=(lib.yk_otherItemLibrary[item].value||0);
											game.yk_loseItem(item,1);
											game.ykChangeCoin(value);
										}
									}
									delete lib.config.yk_myBag[item];
									game.saveConfig('yk_myBag',lib.config.yk_myBag);
								};
								block.delete();
								background1.delete();
								box.delete();
								_status.yk_onchoosing=false;
								window.ykEquip();
								setTimeout(function(){window.ykEquip();},500);
							}
						}
						else if(confirm('确认操作：丢弃后将不可恢复，是否丢弃【'+get.translation(item)+'】？')){
							if(!lib.config.yk_myBag[item]){
								alert('error 物品信息错误！');
							}else{
								delete lib.config.yk_myBag[item];
								game.saveConfig('yk_myBag',lib.config.yk_myBag);
							};
							block.delete();
							background1.delete();
							box.delete();
							_status.yk_onchoosing=false;
							window.ykEquip();
							setTimeout(function(){window.ykEquip();},500);
						}
					});
					if(lib.ykEquip[this.link]||lib.ykBook[this.link]){
						var button3=document.createElement("div");
						if(lib.ykEquip[this.link]) button3.innerHTML='<b>强化</b>';
						else if(lib.ykBook[this.link]) button3.innerHTML='<b>领悟</b>';
						clickAnimation(button3);
						for(var j in btnName){
							button3.style[j]=btnName[j];
						};
						button3.style.right='250px';
						box.appendChild(button3);
						button3.link=this.link;
						button3.link_name=this.link;
						button3.addEventListener("click",function(){
							var item=this.link_name;
							window.ykupgradeBE(item);
							block.delete();
							background1.delete();
							box.delete();
							_status.yk_onchoosing=false;
							window.ykEquip();
							setTimeout(function(){window.ykEquip();},500);
						});
					}
				});
				if(lib.ykEquip&&lib.ykEquip[i]&&lib.ykEquip[i].image) window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.ykEquip[i].image,divx,true,"100% 100%");
				else if(lib.ykBook&&lib.ykBook[i]&&lib.ykBook[i].image) window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.ykBook[i].image,divx,true,"100% 100%");
				else if(lib.yk_otherItemLibrary&&lib.yk_otherItemLibrary[i]&&lib.yk_otherItemLibrary[i].image) window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.yk_otherItemLibrary[i].image,divx,true,"100% 100%");
				else window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+i+'.jpg',divx,true,"100% 100%");
				divx.style.height='50px';
				divx.style.width='50px';
				divx.style['z-index']=99999999;
				divx.style.borderRadius='8px';
				divx.style.position='relative';
				divx.link=i;
				if(lib.yk_otherItemLibrary[i]) divx.type='item';
				if(lib.ykEquip[i]) divx.type=lib.ykEquip[i].type;
				if(lib.ykBook[i]) divx.type='book';
				yk_characterEquipShowItemInfo2(divx,divx.link);
				window.wareHouseContent.appendChild(divx);
				var grade=null,rank=null;
				if(lib.ykEquip[i]&&lib.ykEquip[i].grade) grade=lib.ykEquip[i].grade;
				else if(lib.ykBook[i]&&lib.ykBook[i].grade) grade=lib.ykBook[i].grade;
				else if(lib.yk_otherItemLibrary[i]&&lib.yk_otherItemLibrary[i].grade) grade=lib.yk_otherItemLibrary[i].grade;
				if(grade=='huanggrade') rank='huang';
				else if(grade=='xuangrade') rank='xuan';
				else if(grade=='digrade') rank='di';
				else if(['tiangrade','half-godgrade','godgrade'].indexOf(grade)!=-1) rank='tian%2B';
				if(rank){
					var othersx={
						react:true,
						frequency:300,
						zIndex:'Before',
					}
					window.showPictAnimation('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykBackground/ykSucai/'+rank+'/',10,'.png',divx,othersx);
				}
			}
		}
	};
	
	if(lib.config.yk_myBag==undefined) game.saveConfig('yk_myBag',{});
	lib.yk_otherItemLibrary={//非装备秘籍道具
		'yk_coin':{
			grade:'fangrade',
			value:1,
			translation:'金铢',
			introduce:'云空大陆上的通用货币，其外表璀璨而呈金色，又为珠状，故名金铢',
			inscription:'',//铭文
			countable:true,//是否可叠加
			destroyable:false,//任务道具此处为fasle，不为false均可丢弃
			subtype:'货币',
			func:function(){
				window.ykOpenMap();
				window.ykEquip();
				setTimeout(window.ykShopListOC,1000);
			},
		},
		'star_dust':{
			grade:'xuangrade',
			value:666,
			translation:'星河神砂',
			introduce:'当夜空中的流星燃尽，其剩下的灰尘散落于大地之上，在夜空中散发迷幻的色彩，将它们收集起来，也许会派上意想不到的用场。（许愿相关道具不会计入存档）',
			inscription:'',//铭文
			subtype:'货币',
			countable:true,//是否可叠加
			destroyable:false,//任务道具此处为fasle，不为false均可丢弃
		},
		'predestined_fate':{
			grade:'godgrade',
			value:66666,
			translation:'命定之石',
			introduce:'古老星辰的核心残尽坠落于大地上，成为极其罕见的珍物，其真正价值难以估量，据说持有它的人，往往能得到神明的眷顾，当你向它许愿时，心中所念所想的那个人，一定会出现在你面前。（许愿相关道具不会计入存档）',
			inscription:'',//铭文
			subtype:'抽卡道具',
			countable:true,//是否可叠加
			destroyable:false,//任务道具此处为fasle，不为false均可丢弃
			func:function(){
				if(typeof window.ykOpenDrawCardPool!='function') alert('模块丢失！');
				else window.ykOpenDrawCardPool();
			},
		},
		'sky_crying':{
			grade:'digrade',
			value:10000,
			translation:'虚空之泪',
			introduce:'自天穹坠下的泪水，世间最纯净之物之一，若是神明流下的，那祂一定在为谁哭泣吧。（许愿相关道具不会计入存档）',
			inscription:'',//铭文
			subtype:'抽卡道具',
			countable:true,//是否可叠加
			destroyable:false,//任务道具此处为fasle，不为false均可丢弃
			func:function(){
				if(typeof window.ykOpenDrawCardPool!='function') alert('模块丢失！');
				else window.ykOpenDrawCardPool();
			},
		},
		'god_crystal':{
			grade:'godgrade',
			value:3368999,
			translation:'神晶',
			introduce:'云空大陆上最为珍贵的晶种之一，几乎只存在于传说之中，即便是皇室贵胄也百世难得一见，是无价之宝，据说这些晶石里流淌有来自于神明的少许能量，因此而拥有部分神性，像仙神那样不惹尘埃，离地半尺。',
			inscription:'盈盈流光，宛若皎月，华光天彩，美妙绝伦。',//铭文
			subtype:'强化材料',
			countable:true,//是否可叠加
			destroyable:true,//任务道具此处为fasle，不为false均可丢弃
			showupRate1:0.0001,//小商店刷新百分率，不填时不会刷新出该类商品
			showupRate2:0.0003,//大商店刷新百分率，不填时不会刷新出该类商品
			showupRate3:0.0005,//拍卖会刷新百分率，不填时不会刷新出该类商品
			showupRate4:0.001,//石坊爆率百分率，不填时不会开出该类商品
		},
		'half-god_crystal':{
			grade:'half-godgrade',
			value:842999,
			translation:'天神半晶',
			introduce:'掺杂有半丝神力的不纯粹的晶石，比起天晶更是旷世难寻，价值也不弱于绝大部分的异种晶石，更是因为神晶的罕见，天神半晶就几乎是唯一的神性能量的来源，但偏偏这种石头可遇而不可求，也注定了它一旦出现，必是天价。',
			inscription:'如灯映昼，光可鉴人，流光溢彩，美不胜收。',
			image:'god_crystal.jpg',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.0537,
			showupRate2:0.0905,
			showupRate3:0.133,
			showupRate4:0.64,
		},
		'tian_crystal':{
			grade:'tiangrade',
			value:246999,
			translation:'天晶',
			introduce:'常人难以想象的晶石，其色璀璨，即便是白天都能看见它柔和的荧光，将其放置于身边，有宁神静心之效，这种晶石格外稀有，仅有少数的贵族子弟方得一见。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.099,
			showupRate2:0.647,
			showupRate3:0.91,
			showupRate4:1.55,
		},
		'di_crystal':{
			grade:'digrade',
			value:96999,
			translation:'地晶',
			introduce:'相比玄晶，其色泽偏紫，在黑暗中能散发淡淡的紫色荧光，一小丁点地晶的能量可相当于数十块玄晶的能量，这种晶石在大陆上十分稀有，通常被用于一些隆重场合的装饰品，并非是由于其应用价值过低，而是其较为过于少见，往往被用于收藏。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:1.75,
			showupRate2:6.05,
			showupRate3:9.17,
			showupRate4:11.13,
		},
		'xuan_crystal':{
			grade:'xuangrade',
			value:24999,
			translation:'玄晶',
			introduce:'相比黄晶，其色泽偏蓝，且更加纯粹，高品质的玄晶已接近完全透明，这种晶石的用途也更加广泛。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:22.05,
			showupRate2:36.05,
			showupRate3:49.17,
			showupRate4:61.13,
		},
		'huang_crystal':{
			grade:'huanggrade',
			value:6999,
			translation:'黄晶',
			introduce:'相比起普通的晶石块，其重偏沉，但相较后者，所含杂质少了许多，是大陆上较为常用的贵重晶石。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:48.24,
			showupRate2:66.34,
			showupRate3:73.13,
			showupRate4:84.13,
		},
		'fan_crystal':{
			grade:'fangrade',
			value:1999,
			translation:'凡晶',
			introduce:'大陆上最普通的晶石，其色斑驳，修士们之间交易物品的硬通货，凡晶之于修士，相当于金银之于凡人。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:88.32,
			showupRate2:95.68,
			showupRate3:99.99,
			showupRate4:99.99,
		},
		'fire_crystal':{
			grade:'tiangrade',
			value:72999,
			translation:'火灵晶',
			introduce:'珍贵的异种晶石，拥有灼热的火元素能量，对于火系武器附魔或有奇效。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		'water_crystal':{
			grade:'tiangrade',
			value:72999,
			translation:'水灵晶',
			introduce:'珍贵的异种晶石，拥有清凉的水元素能量，对于水系武器附魔或有奇效。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		'ice_crystal':{
			grade:'tiangrade',
			value:72999,
			translation:'冰灵晶',
			introduce:'珍贵的异种晶石，拥有寒冷的冰元素能量，对于冰系武器附魔或有奇效。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		'thunder_crystal':{
			grade:'tiangrade',
			value:72999,
			translation:'雷灵晶',
			introduce:'珍贵的异种晶石，拥有狂暴的雷元素能量，对于雷系武器附魔或有奇效。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		'wood_crystal':{
			grade:'tiangrade',
			value:72999,
			translation:'木灵晶',
			introduce:'珍贵的异种晶石，拥有亲和的草元素能量，对于草系武器附魔或有奇效。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		'wind_crystal':{
			grade:'tiangrade',
			value:72999,
			translation:'风灵晶',
			introduce:'珍贵的异种晶石，拥有轻盈的风元素能量，对于风系武器附魔或有奇效。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		'stone_crystal':{
			grade:'tiangrade',
			value:72999,
			translation:'地灵晶',
			introduce:'珍贵的异种晶石，拥有厚重的土元素能量，对于岩系武器附魔或有奇效。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		'light_crystal':{
			grade:'tiangrade',
			value:72999,
			translation:'光灵晶',
			introduce:'珍贵的异种晶石，拥有璀璨的光元素能量，对于光系武器附魔或有奇效。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		'dark_crystal':{
			grade:'tiangrade',
			value:72999,
			translation:'暗灵晶',
			introduce:'珍贵的异种晶石，拥有深邃的暗元素能量，对于暗系武器附魔或有奇效。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		'soul_crystal':{
			grade:'tiangrade',
			value:72999,
			translation:'幻灵晶',
			introduce:'珍贵的异种晶石，可用于某些装备强化，拥有奇异的未知能量，对于元系武器强化或有奇效。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		heishezhiya:{
			grade:'tiangrade',
			value:999,
			translation:'黑蛇之牙',
			introduce:'黑蛇的毒牙，可用于某些装备强化和附魔，据说能吸收触及之物的部分光彩。',
			inscription:'',
			subtype:'强化材料',
			image:'yk_teech.jpg',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		xilongzhizhu:{
			grade:'tiangrade',
			value:999,
			translation:'曦龙之珠',
			introduce:'曦龙腹中的宝珠，可用于某些装备强化和附魔，置于室内可长明彻夜。',
			inscription:'',
			subtype:'强化材料',
			image:'yk_pearl.jpg',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		baiyizhiyu:{
			grade:'tiangrade',
			value:999,
			translation:'白胤之羽',
			introduce:'白胤鸟的羽毛，可用于某些装备强化和附魔，抚摸上去如同清风吹拂，清凉舒适。',
			inscription:'',
			subtype:'强化材料',
			image:'yk_feather.jpg',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		xinglongzhilin:{
			grade:'tiangrade',
			value:999,
			translation:'星龙之鳞',
			introduce:'星龙的鳞片，可用于某些装备强化和附魔，周围总有薄薄的雾气，挥之不去。',
			inscription:'',
			subtype:'强化材料',
			image:'yk_scale.jpg',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		ranlinzhijiao:{
			grade:'tiangrade',
			value:999,
			translation:'燃麟之角',
			introduce:'燃麟的断角，可用于某些装备强化和附魔，光是靠近就感到一阵灼热。',
			inscription:'',
			subtype:'强化材料',
			image:'yk_horns.jpg',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		panlongzhizhua:{
			grade:'tiangrade',
			value:999,
			translation:'磐龙之爪',
			introduce:'无比坚硬的爪子，可用于某些装备强化和附魔，是难得的锻造之材。',
			inscription:'',
			subtype:'强化材料',
			image:'yk_claw.jpg',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		xiaohuzhiyan:{
			grade:'tiangrade',
			value:999,
			translation:'绡狐之眼',
			introduce:'绡狐的第三只眼，可用于某些装备强化和附魔，半透半明，触之如无物，就像是不存在一般，神奇无比，还是好好保管，别把它真的弄丢了吧……',
			image:'yk_eye.jpg',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		jiuxiaoleishi:{
			grade:'tiangrade',
			value:999,
			translation:'九霄雷石',
			introduce:'仅诞生于九天之上的神雷之中，是纯净无比的神雷之力凝结的表现，蕴含有极大的毁灭雷霆之力。',
			image:'yk_purpleStone.jpg',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		bingxinyufu:{
			grade:'tiangrade',
			value:999,
			translation:'冰心玉符',
			introduce:'采集千百只汐兽之血绘成的锦符，其上的冰寒之力让人难以忍受。',
			image:'yk_spell.jpg',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		qiongzhiyulu:{
			grade:'tiangrade',
			value:999,
			translation:'琼汁玉露',
			introduce:'蕴含惊人生命之气的甘露，抿一口便足以消去一天的疲惫，对于伤势亦有极佳的恢复效果，但像是物极必反，这种露水只有在遍布毒瘴的南方沼泽中可见，那里有着不计其数的毒物。',
			image:'yk_tea.jpg',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.109,
			showupRate2:0.947,
			showupRate3:1.91,
			showupRate4:3.03,
		},
		gold:{
			grade:'digrade',
			value:1699,
			translation:'金块',
			introduce:'云空大陆上十分贵重的金属，常用于装备强化。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:0.41,
			showupRate2:1.647,
			showupRate3:2.81,
			showupRate4:4.53,
		},
		silver:{
			grade:'xuangrade',
			value:899,
			translation:'银锭',
			introduce:'云空大陆上比较贵重的金属，常用于装备强化。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:11.52,
			showupRate2:33.75,
			showupRate3:67.95,
			showupRate4:75.63,
		},
		brass:{
			grade:'huanggrade',
			value:499,
			translation:'铜板',
			introduce:'云空大陆上比较常见的金属，常用于装备强化。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:41.52,
			showupRate2:83.75,
			showupRate3:97.95,
			showupRate4:99.99,
		},
		iron:{
			grade:'fangrade',
			value:99,
			translation:'铁石',
			introduce:'云空大陆上十分常见的金属，常用于装备强化。',
			inscription:'',
			subtype:'强化材料',
			countable:true,
			showupRate1:99.99,
			showupRate2:99.99,
			showupRate3:99.99,
			showupRate4:99.99,
		},
		'yk_fan_bookPage':{
			grade:'fangrade',
			value:399,
			translation:'秘籍残页·凡阶',
			introduce:'写有云空大陆上流行的比较常见的部分秘籍信息，可惜不全，使用30张秘籍残页可以合成一本随机凡阶秘籍。',
			inscription:'',
			subtype:'秘籍残页',
			func:function(){
				if(!lib.config.yk_myBag) return ;
				if(!lib.config.yk_myBag['yk_fan_bookPage']) return ;
				var num=lib.config.yk_myBag['yk_fan_bookPage'].num;
				if(typeof num!='number'){alert('error 数量异常！');return ;}
				if(num<30){alert('兑换数量不足！');return ;}
				else{
					game.yk_loseItem('yk_fan_bookPage',30);
					var list=[];
					for(var i in lib.ykBook){
						if(lib.ykBook[i].grade=='fangrade') list.push(i);
					}
					var book=list.randomGet();
					game.yk_gainBook(book);
					alert('兑换成功，获得【'+get.translation(book)+'】x1！');
				}
			},
			countable:true,
			showupRate1:99.99,
			showupRate2:99.99,
			showupRate3:99.99,
			showupRate4:99.99,
		},
		'yk_huang_bookPage':{
			grade:'huanggrade',
			value:699,
			translation:'秘籍残页·黄阶',
			introduce:'写有较为珍贵的部分秘籍信息，可惜不全，使用50张秘籍残页可以合成一本随机黄阶秘籍。',
			inscription:'',
			subtype:'秘籍残页',
			func:function(){
				if(!lib.config.yk_myBag) return ;
				if(!lib.config.yk_myBag['yk_huang_bookPage']) return ;
				var num=lib.config.yk_myBag['yk_huang_bookPage'].num;
				if(typeof num!='number'){alert('error 数量异常！');return ;}
				if(num<50){alert('兑换数量不足！');return ;}
				else{
					game.yk_loseItem('yk_huang_bookPage',50);
					var list=[];
					for(var i in lib.ykBook){
						if(lib.ykBook[i].grade=='huanggrade') list.push(i);
					}
					var book=list.randomGet();
					game.yk_gainBook(book);
					alert('兑换成功，获得【'+get.translation(book)+'】x1！');
				}
			},
			countable:true,
			showupRate1:49.99,
			showupRate2:79.99,
			showupRate3:89.99,
			showupRate4:69.99,
		},
		'yk_xuan_bookPage':{
			grade:'xuangrade',
			value:1299,
			translation:'秘籍残页·玄阶',
			introduce:'写有很珍贵的部分秘籍信息，可惜不全，使用75张秘籍残页可以合成一本随机黄阶秘籍。',
			inscription:'',
			subtype:'秘籍残页',
			func:function(){
				if(!lib.config.yk_myBag) return ;
				if(!lib.config.yk_myBag['yk_xuan_bookPage']) return ;
				var num=lib.config.yk_myBag['yk_xuan_bookPage'].num;
				if(typeof num!='number'){alert('error 数量异常！');return ;}
				if(num<75){alert('兑换数量不足！');return ;}
				else{
					game.yk_loseItem('yk_xuan_bookPage',75);
					var list=[];
					for(var i in lib.ykBook){
						if(lib.ykBook[i].grade=='xuangrade') list.push(i);
					}
					var book=list.randomGet();
					game.yk_gainBook(book);
					alert('兑换成功，获得【'+get.translation(book)+'】x1！');
				}
			},
			countable:true,
			showupRate1:29.99,
			showupRate2:59.99,
			showupRate3:69.99,
			showupRate4:49.99,
		},
		'yk_di_bookPage':{
			grade:'digrade',
			value:2499,
			translation:'秘籍残页·地阶',
			introduce:'写有十分珍贵的部分秘籍信息，可惜不全，使用100张秘籍残页可以合成一本随机低阶秘籍。',
			inscription:'',
			subtype:'秘籍残页',
			func:function(){
				if(!lib.config.yk_myBag) return ;
				if(!lib.config.yk_myBag['yk_di_bookPage']) return ;
				var num=lib.config.yk_myBag['yk_di_bookPage'].num;
				if(typeof num!='number'){alert('error 数量异常！');return ;}
				if(num<100){alert('兑换数量不足！');return ;}
				else{
					game.yk_loseItem('yk_di_bookPage',100);
					var list=[];
					for(var i in lib.ykBook){
						if(lib.ykBook[i].grade=='digrade') list.push(i);
					}
					var book=list.randomGet();
					game.yk_gainBook(book);
					alert('兑换成功，获得【'+get.translation(book)+'】x1！');
				}
			},
			countable:true,
			showupRate1:9.09,
			showupRate2:20.15,
			showupRate3:36.99,
			showupRate4:29.99,
		},
		'yk_tian_bookPage':{
			grade:'tiangrade',
			value:4899,
			translation:'秘籍残页·天阶',
			introduce:'写有及其珍贵的部分秘籍信息，可惜不全，使用150张秘籍残页可以合成一本随机天阶秘籍。',
			inscription:'',
			subtype:'秘籍残页',
			func:function(){
				if(!lib.config.yk_myBag) return ;
				if(!lib.config.yk_myBag['yk_tian_bookPage']) return ;
				var num=lib.config.yk_myBag['yk_tian_bookPage'].num;
				if(typeof num!='number'){alert('error 数量异常！');return ;}
				if(num<150){alert('兑换数量不足！');return ;}
				else{
					game.yk_loseItem('yk_tian_bookPage',150);
					var list=[];
					for(var i in lib.ykBook){
						if(lib.ykBook[i].grade=='tiangrade') list.push(i);
					}
					var book=list.randomGet();
					game.yk_gainBook(book);
					alert('兑换成功，获得【'+get.translation(book)+'】x1！');
				}
			},
			countable:true,
			showupRate1:0.05,
			showupRate2:0.31,
			showupRate3:1.29,
			showupRate4:0.95,
		},
		'yk_fan_rubbing':{
			grade:'fangrade',
			value:12999,
			translation:'拓本·凡阶',
			introduce:'比较常见的拓本，能录下任何一本凡阶秘籍内容的神奇书本，但其本身未曾记载任何信息，能以它作为任意凡阶秘籍进阶时的万能材料。',
			inscription:'',
			subtype:'秘籍拓本',
			countable:true,
			showupRate1:12.03,
			showupRate2:23.55,
			showupRate3:35.12,
			showupRate4:42.33,
		},
		'yk_huang_rubbing':{
			grade:'huanggrade',
			value:36999,
			translation:'拓本·黄阶',
			introduce:'还算较常见的拓本，能录下任何一本黄阶秘籍内容的神奇书本，但其本身未曾记载任何信息，能以它作为任意黄阶秘籍进阶时的万能材料。',
			inscription:'',
			subtype:'秘籍拓本',
			countable:true,
			showupRate1:2.03,
			showupRate2:13.55,
			showupRate3:19.65,
			showupRate4:15.74,
		},
		'yk_xuan_rubbing':{
			grade:'xuangrade',
			value:99999,
			translation:'拓本·玄阶',
			introduce:'少见的拓本，能录下任何一本玄阶秘籍内容的神奇书本，但其本身未曾记载任何信息，能以它作为任意玄阶秘籍进阶时的万能材料。',
			inscription:'',
			subtype:'秘籍拓本',
			countable:true,
			showupRate1:0.23,
			showupRate2:0.55,
			showupRate3:0.95,
			showupRate4:0.74,
		},
		'yk_di_rubbing':{
			grade:'digrade',
			value:24999,
			translation:'拓本·地阶',
			introduce:'十分稀少的拓本，这种纸张是历代君王赏赐给重功之臣的物品之一，能录下任何一本地阶秘籍内容的神奇书本，但其本身未曾记载任何信息，能以它作为任意地阶秘籍进阶时的万能材料。',
			inscription:'',
			subtype:'秘籍拓本',
			countable:true,
			showupRate1:0.013,
			showupRate2:0.045,
			showupRate3:0.075,
			showupRate4:0.058,
		},
		'yk_tian_rubbing':{
			grade:'tiangrade',
			value:72999,
			translation:'拓本·天阶',
			introduce:'几乎只存在于传说之中，能录下任何一本天阶秘籍内容的神奇书本，但其本身未曾记载任何信息，能以它作为任意天阶秘籍进阶时的万能材料。',
			inscription:'',
			subtype:'秘籍拓本',
			countable:true,
			showupRate1:0.0006,
			showupRate2:0.0008,
			showupRate3:0.0016,
			showupRate4:0.0012,
		},
		'yk_fan_understand':{
			grade:'fangrade',
			value:699,
			translation:'真悟手札·凡阶',
			introduce:'写有对凡阶秘籍的部分感悟，能加快对凡阶秘籍的领悟。',
			inscription:'',
			subtype:'秘籍手札',
			countable:true,
			showupRate1:75.54,
			showupRate2:86.77,
			showupRate3:94.86,
			showupRate4:92.13,
		},
		'yk_huang_understand':{
			grade:'huanggrade',
			value:2199,
			translation:'真悟手札·黄阶',
			introduce:'写有对黄阶秘籍的部分感悟，能加快对黄阶秘籍的领悟。',
			inscription:'',
			subtype:'秘籍手札',
			countable:true,
			showupRate1:55.34,
			showupRate2:74.73,
			showupRate3:82.87,
			showupRate4:78.56,
		},
		'yk_xuan_understand':{
			grade:'xuangrade',
			value:4299,
			translation:'真悟手札·玄阶',
			introduce:'写有对玄阶秘籍的部分感悟，能加快对玄阶秘籍的领悟。',
			inscription:'',
			subtype:'秘籍手札',
			countable:true,
			showupRate1:39.63,
			showupRate2:53.24,
			showupRate3:59.97,
			showupRate4:62.49,
		},
		'yk_di_understand':{
			grade:'digrade',
			value:8499,
			translation:'真悟手札·地阶',
			introduce:'写有对地阶秘籍的部分感悟，能加快对地阶秘籍的领悟，因地阶秘籍比较稀有，因而地阶秘籍感悟也十分少见和昂贵。',
			inscription:'',
			subtype:'秘籍手札',
			countable:true,
			showupRate1:24.13,
			showupRate2:32.21,
			showupRate3:35.15,
			showupRate4:30.04,
		},
		'yk_tian_understand':{
			grade:'tiangrade',
			value:25699,
			translation:'真悟手札·天阶',
			introduce:'写有对天阶秘籍的部分感悟，能加快对天阶秘籍的领悟，这种手札一旦出现则必定是天价。虽然皇室贵族可以承受，但天阶秘籍十分罕见，天阶感悟手札更算是奇物，普通金银根本无法衡量其真正价值。',
			inscription:'',
			subtype:'秘籍手札',
			countable:true,
			showupRate1:1.13,
			showupRate2:3.21,
			showupRate3:5.15,
			showupRate4:4.04,
		},
		'yk_tianbox_small':{
			grade:'tiangrade',
			value:12899,
			translation:'神龛·传说',
			introduce:'盛放有十分珍贵物品的精致小箱子，只有身份尊贵的贵族皇室才能见到，据传里面必然能开出一件地阶及以上的物品。',
			inscription:'',
			subtype:'宝箱',
			countable:true,
			showupRate1:6.26,
			showupRate2:12.07,
			showupRate3:14.16,
			showupRate4:13.55,
		},
		'yk_tianbox_large':{
			grade:'tiangrade',
			value:19299,
			translation:'神龛·神话',
			introduce:'盛放有及其珍贵物品的超大华丽箱子，即便是历代帝君都难得一见，据传里面必然能开出一件天阶及以上的物品。',
			inscription:'',
			subtype:'宝箱',
			countable:true,
			showupRate1:0.006,
			showupRate2:0.017,
			showupRate3:0.20,
			showupRate4:0.25,
		},
		'yk_dibox_small':{
			grade:'digrade',
			value:7299,
			translation:'神龛·史诗·小',
			introduce:'盛放有贵重物品的精致小箱子，据传里面必然能开出一件玄阶及以上的物品，有几率开出地阶及以上物品。',
			inscription:'',
			subtype:'宝箱',
			countable:true,
			showupRate1:26.26,
			showupRate2:32.07,
			showupRate3:40.16,
			showupRate4:38.25,
		},
		'yk_dibox_large':{
			grade:'digrade',
			value:9699,
			translation:'神龛·史诗·大',
			introduce:'盛放有贵重物品的华丽大箱子，据传里面必然能开出一件玄阶及以上的物品，有较大几率开出地阶及以上物品。',
			inscription:'',
			subtype:'宝箱',
			countable:true,
			showupRate1:10.26,
			showupRate2:25.07,
			showupRate3:22.16,
			showupRate4:20.25,
		},
		'yk_xuanbox_small':{
			grade:'xuangrade',
			value:4899,
			translation:'神龛·精品·小',
			introduce:'盛放有贵重物品的精致小箱子，据传里面必然能开出一件黄阶及以上的物品，有几率开出玄阶及以上物品。',
			inscription:'',
			subtype:'宝箱',
			countable:true,
			showupRate1:36.66,
			showupRate2:45.67,
			showupRate3:66.66,
			showupRate4:64.42,
		},
		'yk_xuanbox_small':{
			grade:'xuangrade',
			value:5699,
			translation:'神龛·精品·大',
			introduce:'盛放有贵重物品的华丽大箱子，据传里面必然能开出一件黄阶及以上的物品，有较大几率开出玄阶及以上物品。',
			inscription:'',
			subtype:'宝箱',
			countable:true,
			showupRate1:18.18,
			showupRate2:27.27,
			showupRate3:38.22,
			showupRate4:36.12,
		},
		'yk_redbag':{
			grade:'tiangrade',
			value:3299,
			translation:'小红包',
			introduce:'红包到啦，试试手气把！',
			inscription:'',
			subtype:'宝箱',
			countable:true,
			showupRate1:28.18,
			showupRate2:47.27,
			showupRate3:68.72,
			showupRate4:65.86,
		},
	};
	//升级技能upGradeSkill--------------技能格式：skillname_rank---------例：法则天定0级------------fazetianding_0-----用法：game.upGradeSkill('qxq_yk_yanmengyuejian','fazetianding');
	game.upGradeSkill=function(skillname,upnum){
		if(!skillname) return ;
		if(!upnum) upnum=1;
		if(lib.config['yk_'+skillname+'_rank']==undefined) game.saveConfig('yk_'+skillname+'_rank',upnum);
		else{
			var rank=parseInt(lib.config['yk_'+skillname+'_rank']);
			if(rank==5){alert('该技能已达到最大等级！');return ;}
			if(isNaN(rank)) game.saveConfig('yk_'+skillname+'_rank',upnum);
			else game.saveConfig('yk_'+skillname+'_rank',rank+upnum);
		}
		alert('技能【'+get.translation(skillname)+'】升级成功！当前等级为：Lv'+lib.config['yk_'+skillname+'_rank']+'。即将重启以保存。');
		if(game.saydpcq&&game.saydpcq!=undefined&&typeof game.saydpcq=='function'){game.saydpcq('技能【'+get.translation(skillname)+'】升级成功！当前等级为：Lv'+lib.config['yk_'+skillname+'_rank']);}
		if(game.saydpcq&&game.saydpcq!=undefined&&typeof game.saydpcq=='function'){game.saydpcq('即将自动重启以保存！');}
		setTimeout(function(){
			game.reload();
		},3000);
	}
	//奖励：选择技能升级
	game.ykUpGradeSkill=function(){
		var chooseList=ui.create.dialog('hidden');
		chooseList.classList.add('popped');
		chooseList.classList.add('static');
		chooseList.style.cssText='height:50%;width:50%;left:25%;top:25%;transition:all 0.5s;text-align:left;overflow-x:hidden;overflow-y:scroll;z-index:999999999;';
		lib.setScroll(chooseList);
		var info='<b>选择要升级的武将</b><br>';
		chooseList.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>'+info+'</b></span>';
		ui.window.appendChild(chooseList);
		
		var nameList=[];
		var bossList=lib.qxq_yk_bossList;
		for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
			for(var name in lib.character){
				if(lib.config.YKcharacterNameList[i].indexOf(name)!=-1&&bossList.indexOf(name)==-1){
					nameList.push(name);
				}
			}
		}
		for(var i=0;i<nameList.length;i++){
			var width=200;
			var height=250;
			var div=ui.create.div('.menubutton.round','',function(){
				chooseList.hide();
				if(window.yunkong_Character.character==undefined){alert('未知错误！');return ;}
				if(window.yunkong_Character.character[this.name]==undefined){alert('未知错误'+this.name+'！');return ;}
				var skillList=window.yunkong_Character.character[this.name][3];
				if(!skillList){alert('该角色暂无技能！');return ;}
				var selectSkills=function(skillList,character){
					if(!Array.isArray(skillList)) skillList=[skillList];
					if(skillList.indexOf('返回')==-1) skillList.push('返回');
					var chooseSkillList=ui.create.dialog('hidden');
					chooseSkillList.classList.add('popped');
					chooseSkillList.classList.add('static');
					chooseSkillList.style.cssText='height:50%;width:50%;left:25%;top:25%;transition:all 0.5s;text-align:left;overflow-x:hidden;overflow-y:scroll;';
					lib.setScroll(chooseSkillList);
					var info='选择要升级的技能，若要重新选择武将请点击“返回”选项（<b>技能通常上限为5级（Lv5），满级则不会增加！</b>）<br>';
					chooseSkillList.innerHTML='<span style="font-family:shousha"><b>'+info+'</b></span>';
					ui.window.appendChild(chooseSkillList);
					for(var skill of skillList){
						var divx=ui.create.div('','',function(){
							var choose=true;
							if(this.name!='返回'){
								if(!lib.config.yk_myBag) lib.config.yk_myBag={};
								if(!lib.config.yk_myBag[character+'_upGradeSkill_stone']||(lib.config.yk_myBag[character+'_upGradeSkill_stone']&&(lib.config.yk_myBag[character+'_upGradeSkill_stone'].num<=0||typeof lib.config.yk_myBag[character+'_upGradeSkill_stone'].num!='number'))){
									alert('你没有该角色的技能石！（获取：重复获取该角色时自动转化为该角色的技能石）');
								}
								else{
									game.yk_loseItem(character+'_upGradeSkill_stone',1);
									game.upGradeSkill(this.name,1);
								}
							}
							else{choose=false;}
							if(choose==false){
								chooseSkillList.hide();
								setTimeout(function(){chooseList.show();},500);
							}
							else{
								chooseList.delete();
								chooseList=undefined;
								chooseSkillList.delete();
								chooseSkillList=undefined;
							}
						});
						divx.name=skill;
						divx.innerHTML='<b>'+get.translation(skill)+(skill=='返回'?'':'&nbspLv'+(lib.config['yk_'+skill+'_rank']||0))+'</b>';
						divx.style.cssText='height:25px;width:80px;top:20px;left:15px;border-radius:8px;position:relative;text-align:center;';
						chooseSkillList.appendChild(divx);
					}
				}
				selectSkills(skillList,this.name);
			});
			div.style.cssText='height:'+height+'px;width:'+width+'px;top:20px;left:15px;border-radius:8px;position:relative;text-align:center;background-position:center center;';
			div.setBackground(nameList[i],'character');
			div.style.backgroundSize='cover';
			div.name=nameList[i];
			chooseList.appendChild(div);
		}
		var funcOut=function(){
			chooseList.hide();
		};
		var divOut=ui.create.div('.menubutton.round','×',function(){
			funcOut();
		});
		divOut.style.top='5px';
		divOut.style.left='calc(100% - 55px)';
		divOut.style['zIndex']=1000;
		chooseList.appendChild(divOut);
	};
	for(var i in window.yunkong_Character.character){
		var grade,value,translation,introduce,inscription;
		if(!lib.config.qxq_YK_person.rank[i]){
			grade='fangrade';
			value=999;
		}
		else if(lib.config.qxq_YK_person.rank[i].indexOf('超稀-限定')!=-1){
			grade='godgrade';
			value=48999;
		}
		else if(lib.config.qxq_YK_person.rank[i].indexOf('天级')!=-1){
			grade='tiangrade';
			value=24999;
		}
		else if(lib.config.qxq_YK_person.rank[i].indexOf('地级')!=-1){
			grade='digrade';
			value=12999;
		}
		else if(lib.config.qxq_YK_person.rank[i].indexOf('玄级')!=-1){
			grade='xuangrade';
			value=6999;
		}
		else if(lib.config.qxq_YK_person.rank[i].indexOf('黄级')!=-1){
			grade='huanggrade';
			value=2999;
		}
		else{
			grade='fangrade';
			value=999;
		}
		translation='<b>'+window.yunkong_Character.translate[i]+'</b>的技能升级石';
		introduce='蕴含有奇特力量的石头，可将【'+window.yunkong_Character.translate[i]+'】的技能等级提升一级，使用时将打开技能升级界面。';
		inscription='';
		lib.yk_otherItemLibrary[i+'_upGradeSkill_stone']={
			grade:grade,
			value:value,
			translation:translation,
			introduce:introduce,
			inscription:inscription,
			subtype:'强化材料',
			countable:true,//是否可叠加
			destroyable:true,//任务道具此处为fasle，不为false均可丢弃
			func:game.ykUpGradeSkill,
			image:'upGradeSkill_stone.jpg',
		};
	}
	for(var i in lib.yk_otherItemLibrary){
		lib.translate[i]=lib.yk_otherItemLibrary[i].translation;
		lib.translate[i+'_info']=lib.yk_otherItemLibrary.introduce+(lib.yk_otherItemLibrary[i].inscription.length>0?('<br><i><font color=grey>————“'+lib.yk_otherItemLibrary.inscription+'”</font></i>'):'')
	}
	game.yk_gainItem=function(item,num){
		if(!lib.yk_otherItemLibrary[item]){alert('error 错误的物品名！');return ;}
		if(lib.config.yk_myBag==undefined) game.saveConfig('yk_myBag',{});
		if(!lib.config.yk_myBag[item]){lib.config.yk_myBag[item]={};game.saveConfig('yk_myBag',lib.config.yk_myBag);}
		if(typeof num!='number') num=1;
		if(lib.yk_otherItemLibrary[item].countable!=false){
			var baseNum=0;
			if(lib.config.yk_myBag[item]&&typeof lib.config.yk_myBag[item].num=='number') baseNum=lib.config.yk_myBag[item].num;
			baseNum+=num;
			if(baseNum>9999999999999){
				baseNum=9999999999999;
				alert('超过物品持有上限数，已自动将多余部分移除！');
			}
			var itemx={
				name:item,
				type:'item',
				num:(lib.yk_otherItemLibrary[item].countable==true?baseNum:true),
			}
			lib.config.yk_myBag[item]=itemx;
		}
		else{
			var itemx={
				name:item,
				type:'item',
			}
			lib.config.yk_myBag[item]=itemx;
		}
		game.saveConfig('yk_myBag',lib.config.yk_myBag);
	}
	game.yk_gainEquip=function(equipname,rank1,rank2,bool){
		if(!equipname) return ;
		if(!lib.ykEquip[equipname]||(lib.ykEquip[equipname]&&!lib.ykEquip[equipname].type)){alert('error 无效的装备类型！');return ;}
		if(!lib.ykEquip[equipname]){alert('error 错误的装备名！');return ;}
		if(lib.config.yk_myBag==undefined) game.saveConfig('yk_myBag',{});
		if(!lib.config.yk_myBag[equipname]){
			if(lib.ykEquip[equipname].derivation){
				var equipname2=lib.ykEquip[equipname].derivation;
				if(typeof equipname2=='string'&&lib.config.yk_myBag[equipname2]){
					if(!bool){
						alert('您已拥有同类装备：【'+get.translation(equipname2)+'】，无法再获得【'+get.translation(equipname)+'】！');
						return ;
					}
					else{
						game.yk_loseItem(equipname2);
						alert('【'+get.translation(equipname2)+'】已进化为【'+get.translation(equipname)+'】！');
					}
				}
			}
			var equip={
				name:equipname,
				rank1:(rank1||0),//强化
				rank2:(rank2||0),//进阶
				type:lib.ykEquip[equipname].type,
			}
			lib.config.yk_myBag[equipname]=equip;
			game.saveConfig('yk_myBag',lib.config.yk_myBag);
		}
		else if(lib.config.yk_myBag[equipname].rank2<10){
			lib.config.yk_myBag[equipname].rank2++;
			game.saveConfig('yk_myBag',lib.config.yk_myBag);
			alert('无法同时拥有两把【'+get.translation(equipname)+'】，已自动将该同名武器进阶！');
		}
		else if(lib.config.yk_myBag[equipname].rank2>=10){
			alert('无法同时拥有两把【'+get.translation(equipname)+'】，且该同名武器进阶等级已达最大值，无法进阶！');
		}
	}
	game.yk_gainBook=function(bookname,rank1,rank2,bool){
		if(!bookname) return ;
		if(!lib.ykBook[bookname]){alert('error 错误的秘籍名！');return ;}
		if(lib.config.yk_myBag==undefined) game.saveConfig('yk_myBag',{});
		if(!lib.config.yk_myBag[bookname]){
			if(lib.ykBook[bookname].derivation){
				var bookname2=lib.ykBook[bookname].derivation;
				if(typeof bookname2=='string'&&lib.config.yk_myBag[bookname2]){
					if(!bool){
						alert('您已拥有同类装备：【'+get.translation(bookname2)+'】，无法再获得【'+get.translation(bookname)+'】！');
						return ;
					}
					else{
						game.yk_loseItem(bookname2);
						alert('【'+get.translation(bookname2)+'】已进化为【'+get.translation(bookname)+'】！');
					}
				}
			}
			var book={
				name:bookname,
				rank1:(rank1||0),//强化
				rank2:(rank2||0),//进阶
				type:'book',
			}
			lib.config.yk_myBag[bookname]=book;
			game.saveConfig('yk_myBag',lib.config.yk_myBag);
		}
		else if(lib.config.yk_myBag[bookname].rank2<10){
			lib.config.yk_myBag[bookname].rank2++;
			game.saveConfig('yk_myBag',lib.config.yk_myBag);
			alert('无法同时拥有两本【'+get.translation(bookname)+'】，已自动将该同名秘籍进阶！');
		}
		else if(lib.config.yk_myBag[bookname].rank2>=10){
			alert('无法同时拥有两本【'+get.translation(bookname)+'】，且该同名秘籍进阶等级已达最大值，无法进阶！');
		}
	}
	game.yk_loseItem=function(item,num){
		if(lib.config.yk_myBag==undefined) game.saveConfig('yk_myBag',{});
		if(!lib.config.yk_myBag[item]){alert('error 未拥有该物品！');return ;}
		if(lib.yk_otherItemLibrary[item]&&lib.yk_otherItemLibrary[item].countable){
			if(typeof lib.config.yk_myBag[item].num!='number') var baseNum=1;
			else var baseNum=lib.config.yk_myBag[item].num;
			if(typeof num!='number') num=1;
			baseNum-=num;
			if(baseNum<=0||isNaN(baseNum)){
				lib.config.yk_myBag[item]=undefined;
				delete lib.config.yk_myBag[item];
				game.saveConfig('yk_myBag',lib.config.yk_myBag);
			}
			else{
				lib.config.yk_myBag[item].num=baseNum;
				game.saveConfig('yk_myBag',lib.config.yk_myBag);
			}
		}
		else if(lib.yk_otherItemLibrary[item]&&lib.yk_otherItemLibrary[item].countable==false){
			delete lib.config.yk_myBag[item];
			game.saveConfig('yk_myBag',lib.config.yk_myBag);
		}
		else if(lib.ykEquip[item]||lib.ykBook[item]){
			delete lib.config.yk_myBag[item];
			game.saveConfig('yk_myBag',lib.config.yk_myBag);
		}
	}
	game.ykChangeCoin=function(num){
		if(typeof num=='string') num=parseInt(num);
		if(typeof num!='number') return ;
		if(num>0) game.yk_gainItem('yk_coin',Math.round(num));
		else if(num<0) game.yk_loseItem('yk_coin',Math.round(Math.abs(num)));
	}
	game.ykCheckCoin=function(num){
		if(typeof num!='number') return false;
		if(lib.config.yk_myBag.yk_coin&&lib.config.yk_myBag.yk_coin.num&&typeof lib.config.yk_myBag.yk_coin.num=='number') return Math.round(lib.config.yk_myBag.yk_coin.num)>num;
		return false;
	}
	
	game.getItemInfo=function(item,returnType){
		if(lib.yk_otherItemLibrary[item]){
			var info='<span style="font-size:20px;font-weight:400;font-family:shousha">';
			info+='<b>物品名</b>：【<b>'+lib.yk_otherItemLibrary[item].translation+'</b>】';
			if(lib.yk_otherItemLibrary[item].value) info+='<br><b>单件价值</b>：<b>'+lib.yk_otherItemLibrary[item].value+'&nbsp&nbsp铢</b>';
			var num=0;
			if(lib.config.yk_myBag[item]&&lib.config.yk_myBag[item].num==true) num=1;
			if(lib.config.yk_myBag[item]&&typeof lib.config.yk_myBag[item].num=='number') num=lib.config.yk_myBag[item].num;
			info+='<br><b>物品数</b>：<b>'+num+'</b>';
			info+='<br><br>简介：'+lib.yk_otherItemLibrary[item].introduce;
			if(lib.yk_otherItemLibrary[item].inscription.length>0) info+='<br><font color=grey><i>————'+lib.yk_otherItemLibrary[item].inscription+'</i></font>';
			info+='</span>';
			if(returnType) return 'item';
			else return info;
		}
		else if(lib.ykEquip[item]){
			if(returnType) return 'equip';
			else return window.ykIntroduceEquip(item,'info','Equip');
		}
		else if(lib.ykBook[item]){
			if(returnType) return 'book';
			else return window.ykIntroduceEquip(item,'info','Book');
		}
		if(returnType) return null;
		else return '暂无装备秘籍或该装备秘籍暂无介绍！<br><br><br><br><br>';
	}
	game.yk_openUseItem=function(item){//使用非装备型道具
		if(!lib.yk_otherItemLibrary[item]){
			delete lib.config.yk_myBag[item];
			game.saveConfig('yk_myBag',lib.config.yk_myBag);
			alert('error 无效的道具名，已自动为您移除！');
			return ;
		}
		if(typeof lib.yk_otherItemLibrary[item].func=='function'){
			lib.yk_otherItemLibrary[item].func(item);
			if(typeof window.ykCloseBag2=='function'){
				window.ykEquip();
				setTimeout(function(){window.ykEquip();},500);
			}
		}
		else alert('该道具为任务道具或使用功能暂无！');
	}
	lib.element.player.ykCheckEquip=function(){
		var player=this;
		if(player.ykhasOnloadedEquip) return ;
		var equipTypeList=['equip1','equip2','equip3','equip4'];
		for(var item of equipTypeList) if(lib.config[player.name+'_'+item]&&typeof lib.config[player.name+'_'+item]=='string'&&lib.config[player.name+'_'+item].length>0){
			if(lib.ykEquip[lib.config[player.name+'_'+item]]&&lib.ykEquip[lib.config[player.name+'_'+item]].skill){
				for(var s in lib.ykEquip[lib.config[player.name+'_'+item]].skill) if(s!='translate') player.addSkill(s);
			}
			if(lib.ykEquip[lib.config[player.name+'_'+item]]&&typeof lib.ykEquip[lib.config[player.name+'_'+item]].onEquip=='function') lib.ykEquip[lib.config[player.name+'_'+item]].onEquip(player);
		}
		if(lib.config[player.name+'_book']&&typeof lib.config[player.name+'_book']=='string'&&lib.config[player.name+'_book'].length>0){
			if(lib.ykBook[lib.config[player.name+'_book']]&&lib.ykBook[lib.config[player.name+'_book']].skill){
				for(var s in lib.ykBook[lib.config[player.name+'_book']].skill){
					if(s!='translate') player.addSkill(s);
				}
			}
			if(lib.ykBook[lib.config[player.name+'_book']]&&typeof lib.ykBook[lib.config[player.name+'_book']].onEquip=='function') lib.ykBook[lib.config[player.name+'_book']].onEquip(player);
		}
		var equipList=['equip1','equip2','equip3','equip4','book'];
		var addMp=0;
		for(var item of equipList) if(lib.config[player.name+'_'+item]!=undefined&&typeof lib.config[player.name+'_'+item]=='string') addMp+=(window.ykIntroduceEquip(lib.config[player.name+'_'+item],true,(item=='book'?'Book':'Equip'))[0]||0);
		var addStrength=0;
		for(var item of equipList) if(lib.config[player.name+'_'+item]!=undefined&&typeof lib.config[player.name+'_'+item]=='string') addStrength+=(window.ykIntroduceEquip(lib.config[player.name+'_'+item],true,(item=='book'?'Book':'Equip'))[1]||0);
		var addDefend=0;
		for(var item of equipList) if(lib.config[player.name+'_'+item]!=undefined&&typeof lib.config[player.name+'_'+item]=='string') addDefend+=(window.ykIntroduceEquip(lib.config[player.name+'_'+item],true,(item=='book'?'Book':'Equip'))[2]||0);
		var addSoul=0;
		for(var item of equipList) if(lib.config[player.name+'_'+item]!=undefined&&typeof lib.config[player.name+'_'+item]=='string') addSoul+=(window.ykIntroduceEquip(lib.config[player.name+'_'+item],true,(item=='book'?'Book':'Equip'))[3]||0);
		if(addMp>0){player.ykChange('MaxMp',addMp);player.ykRecover('Mp',addMp);}
		if(addStrength>0){player.ykChange('MaxStrength',addStrength);player.ykRecover('Strength',addStrength);}
		if(addDefend>0){player.ykChange('MaxDefend',addDefend);player.ykRecover('Defend',addDefend);}
		if(addSoul>0){player.ykChange('MaxSoul',addSoul);player.ykRecover('Soul',addSoul);}
		player.ykhasOnloadedEquip=true;
	}
	window.ykAbbreviation=function(num){//缩写数字
		if(typeof num!='number'){
			var numx=num;
			if(typeof num=='string') num=parseInt(num);
			if(typeof num!='number'){
				if(typeof numx=='string') num=parseFloat(num);
				if(typeof num!='number') return 'error 数据类型错误！';
				num=numx;
			}
		}
		var s='';
		if(num>1000000000000){
			var n=''+num;
			n=n.length;
			s='*10^'+n;
			while(num>=100){
				num=num/10;
			}
			num=Math.round(num)/10;
		}
		else while(num>10000){
			if(!s.length) s='万';
			else if(s=='万') s='亿';
			else if(s=='亿') s='万亿';
			num=Math.round(num/1000)/10;
		}
		num=Math.round(num*10)/10+s;
		return num;
	}
	window.ykupgradeBE=function(name){
		window.ykUpgradeEquipDiv=ui.create.div('');
		var width=ui.window.offsetWidth;
		var height=ui.window.offsetHeight;
		window.ykUpgradeEquipDiv.style.cssText='height:100%;top:0%;left:0%;width:100%;background-color:black;opacity:0.8;z-index:99999;text-align:center;';
		document.body.appendChild(window.ykUpgradeEquipDiv);
		
		var grade;
		if(lib.ykEquip[name]) grade=lib.ykEquip[name].grade;
		else if(lib.ykBook[name]) grade=lib.ykBook[name].grade;
		var color='white';
		if(grade=='fangrade') color='grey';
		else if(grade=='huanggrade') color='green';
		else if(grade=='xuangrade') color='blue';
		else if(grade=='digrade') color='purple';
		else if(grade=='tiangrade') color='yellow';
		else if(grade=='half-godgrade') color='orange';
		else if(grade=='godgrade') color='red';
		window.ykEquipImg=ui.create.div('');
		window.ykEquipImg.style.cssText='height:180px;width:180px;top:10%;left:10%;border: 3px solid '+color+';';
		if(lib.ykEquip[name]&&lib.ykEquip[name].image) window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.ykEquip[name].image,window.ykEquipImg,true,"100% 100%");
		else if(lib.ykBook[name]&&lib.ykBook[name].image) window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.ykBook[name].image,window.ykEquipImg,true,"100% 100%");
		else window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+name+'.jpg',window.ykEquipImg,true,"100% 100%");
		window.ykUpgradeEquipDiv.appendChild(window.ykEquipImg);
		window.ykEquipImgG=ui.create.div('');
		window.ykEquipImgG.style.cssText='height:50px;width:50px;top:10%;left:10%;';
		window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+((grade=='godgrade'||grade=='half-godgrade')?'tiangrade':grade)+'.jpg',window.ykEquipImgG,true,"100% 100%");
		window.ykEquipImgG.style['text-align']='left';
		window.ykUpgradeEquipDiv.appendChild(window.ykEquipImgG);
		
		window.ykEquipNatureMpBg=ui.create.div('');
		window.ykEquipNatureMpBg.style.cssText='height:10px;width:calc( 80% - 190px );top:calc( 10% + 28px );left:calc( 10% + 190px )';
		window.ykUpgradeEquipDiv.appendChild(window.ykEquipNatureMpBg);
		window.ykEquipNatureMpText=ui.create.div('');
		window.ykEquipNatureMpText.style.cssText='height:100%;width:60px;top:0%;left:0%;';
		window.ykEquipNatureMpText.innerHTML='<span style="font-size:15px;font-weight:400;font-family:shousha"><font color=cyan>术法值</font>：</span>';
		window.ykEquipNatureMpBg.appendChild(window.ykEquipNatureMpText);
		window.ykEquipNatureMp=ui.create.div('');
		window.ykEquipNatureMp.style.cssText='height:100%;width:0%;top:4px;left:70px;background:cyan;transition:all 1s;borderRadius:8px;transform:scaleX(-1);animation:ykmp 1.5s linear infinite;';
		if(window.ykIntroduceEquip(name,true,(lib.ykEquip[name]?'Equip':'Book'))[0]){
			window.ykEquipNatureMpBg.appendChild(window.ykEquipNatureMp);
			setTimeout(function(){
				window.ykEquipNatureMp.style.width='calc( 100% - 180px )';
			},100);
		}
		window.ykEquipNatureMpNum=ui.create.div('');
		window.ykEquipNatureMpNum.style.cssText='height:100%;width:100px;top:0%;left:calc( 100% - 100px );text-align:left;';
		window.ykEquipNatureMpNum.innerHTML='<span style="font-size:15px;font-weight:400;font-family:shousha"><font color=cyan>'+(window.ykIntroduceEquip(name,true,(lib.ykEquip[name]?'Equip':'Book'))[0]||0)+'</font></span>';
		window.ykEquipNatureMpBg.appendChild(window.ykEquipNatureMpNum);
		
		window.ykEquipNatureStrengthBg=ui.create.div('');
		window.ykEquipNatureStrengthBg.style.cssText='height:10px;width:calc( 80% - 190px );top:calc( 10% + 66px );left:calc( 10% + 190px )';
		window.ykUpgradeEquipDiv.appendChild(window.ykEquipNatureStrengthBg);
		window.ykEquipNatureStrengthText=ui.create.div('');
		window.ykEquipNatureStrengthText.style.cssText='height:100%;width:60px;top:0%;left:0%;';
		window.ykEquipNatureStrengthText.innerHTML='<span style="font-size:15px;font-weight:400;font-family:shousha"><font color=yellow>气力值</font>：</span>';
		window.ykEquipNatureStrengthBg.appendChild(window.ykEquipNatureStrengthText);
		window.ykEquipNatureStrength=ui.create.div('');
		window.ykEquipNatureStrength.style.cssText='height:100%;width:0%;top:4px;left:70px;background:yellow;transition:all 1s;borderRadius:8px;transform:scaleX(-1);animation:ykstrength 1.5s linear infinite;';
		if(window.ykIntroduceEquip(name,true,(lib.ykEquip[name]?'Equip':'Book'))[1]){
			window.ykEquipNatureStrengthBg.appendChild(window.ykEquipNatureStrength);
			setTimeout(function(){
				window.ykEquipNatureStrength.style.width='calc( 100% - 180px )';
			},100);
		}
		window.ykEquipNatureStrengthNum=ui.create.div('');
		window.ykEquipNatureStrengthNum.style.cssText='height:100%;width:100px;top:0%;left:calc( 100% - 100px );text-align:left;';
		window.ykEquipNatureStrengthNum.innerHTML='<span style="font-size:15px;font-weight:400;font-family:shousha"><font color=yellow>'+(window.ykIntroduceEquip(name,true,(lib.ykEquip[name]?'Equip':'Book'))[1]||0)+'</font></span>';
		window.ykEquipNatureStrengthBg.appendChild(window.ykEquipNatureStrengthNum);
		
		window.ykEquipNatureDefendBg=ui.create.div('');
		window.ykEquipNatureDefendBg.style.cssText='height:10px;width:calc( 80% - 190px );top:calc( 10% + 104px );left:calc( 10% + 190px )';
		window.ykUpgradeEquipDiv.appendChild(window.ykEquipNatureDefendBg);
		window.ykEquipNatureDefendText=ui.create.div('');
		window.ykEquipNatureDefendText.style.cssText='height:100%;width:60px;top:0%;left:0%;';
		window.ykEquipNatureDefendText.innerHTML='<span style="font-size:15px;font-weight:400;font-family:shousha"><font color=grey>真气值</font>：</span>';
		window.ykEquipNatureDefendBg.appendChild(window.ykEquipNatureDefendText);
		window.ykEquipNatureDefend=ui.create.div('');
		window.ykEquipNatureDefend.style.cssText='height:100%;width:0%;top:4px;left:70px;background:grey;transition:all 1s;borderRadius:8px;transform:scaleX(-1);animation:ykdefend 1.5s linear infinite;';
		if(window.ykIntroduceEquip(name,true,(lib.ykEquip[name]?'Equip':'Book'))[2]){
			window.ykEquipNatureDefendBg.appendChild(window.ykEquipNatureDefend);
			setTimeout(function(){
				window.ykEquipNatureDefend.style.width='calc( 100% - 180px )';
			},100);
		}
		window.ykEquipNatureDefendNum=ui.create.div('');
		window.ykEquipNatureDefendNum.style.cssText='height:100%;width:100px;top:0%;left:calc( 100% - 100px );text-align:left;';
		window.ykEquipNatureDefendNum.innerHTML='<span style="font-size:15px;font-weight:400;font-family:shousha"><font color=grey>'+(window.ykIntroduceEquip(name,true,(lib.ykEquip[name]?'Equip':'Book'))[2]||0)+'</font></span>';
		window.ykEquipNatureDefendBg.appendChild(window.ykEquipNatureDefendNum);
		
		window.ykEquipNatureSoulBg=ui.create.div('');
		window.ykEquipNatureSoulBg.style.cssText='height:10px;width:calc( 80% - 190px );top:calc( 10% + 142px );left:calc( 10% + 190px )';
		window.ykUpgradeEquipDiv.appendChild(window.ykEquipNatureSoulBg);
		window.ykEquipNatureSoulText=ui.create.div('');
		window.ykEquipNatureSoulText.style.cssText='height:100%;width:60px;top:0%;left:0%;';
		window.ykEquipNatureSoulText.innerHTML='<span style="font-size:15px;font-weight:400;font-family:shousha"><font color=purple>元力值</font>：</span>';
		window.ykEquipNatureSoulBg.appendChild(window.ykEquipNatureSoulText);
		window.ykEquipNatureSoul=ui.create.div('');
		window.ykEquipNatureSoul.style.cssText='height:100%;width:0%;top:4px;left:70px;background:purple;transition:all 1s;borderRadius:8px;transform:scaleX(-1);animation:yksoul 1.5s linear infinite;';
		if(window.ykIntroduceEquip(name,true,(lib.ykEquip[name]?'Equip':'Book'))[3]){
			window.ykEquipNatureSoulBg.appendChild(window.ykEquipNatureSoul);
			setTimeout(function(){
				window.ykEquipNatureSoul.style.width='calc( 100% - 180px )';
			},100);
		}
		window.ykEquipNatureSoulNum=ui.create.div('');
		window.ykEquipNatureSoulNum.style.cssText='height:100%;width:100px;top:0%;left:calc( 100% - 100px );text-align:left;';
		window.ykEquipNatureSoulNum.innerHTML='<span style="font-size:15px;font-weight:400;font-family:shousha"><font color=purple>'+(window.ykIntroduceEquip(name,true,(lib.ykEquip[name]?'Equip':'Book'))[3]||0)+'</font></span>';
		window.ykEquipNatureSoulBg.appendChild(window.ykEquipNatureSoulNum);
		
		var getSkill=function(name){
			var list='';
			if(lib.ykEquip[name]&&lib.ykEquip[name].skill){
				for(var skill in lib.ykEquip[name].skill) if(skill!='translate') list+='【'+get.translation(skill)+'】、';
			}
			else if(lib.ykBook[name]&&lib.ykBook[name].skill){
				for(var skill in lib.ykBook[name].skill) if(skill!='translate') list+='【'+get.translation(skill)+'】、';
			}
			if(list.length) return list.slice(0,list.length-1);
			else return '无';
		}
		window.ykEquipScore=ui.create.div('');
		window.ykEquipScore.style.cssText='height:80px;width:80%;top:calc( 10% + 200px );left:10%;';
		window.ykEquipScore.innerHTML='<span style="font-size:18px;font-weight:400;font-family:shousha"><font color=white>【'+get.translation(name)+'】<br>'+get.translation(grade)+'<br>评分：'+0+'<br>附加技能：'+getSkill(name)+'</font></span>';
		window.ykUpgradeEquipDiv.appendChild(window.ykEquipScore);
		
		window.ykEquipStrengthen=ui.create.div('');
		window.ykEquipStrengthen.style.cssText='height:calc( 80% - 300px );width:80%;top:calc( 10% + 280px );left:10%;';
		window.ykUpgradeEquipDiv.appendChild(window.ykEquipStrengthen);
		
		var getContent=function(name){
			var grade;
			if(lib.ykEquip[name]) grade=lib.ykEquip[name].grade;
			else if(lib.ykBook[name]) grade=lib.ykBook[name].grade;
			if(!grade) return ;
			
			var nature;
			if(lib.ykEquip[name]) nature=lib.ykEquip[name].nature;
			else if(lib.ykBook[name]) nature=lib.ykBook[name].nature;
			if(!nature) return ;
		}
		var yk_ShowItemInfo=function(div,itemname){
			if(!div) return ;
			if(itemname) div.itemname=itemname;
			var info=ui.create.div('.menu');
			info.style.transition='left 0s,top 0s,opacity .3s';
			info.style.width='312px';
			info.style['pointer-events']='none';
			info.style['text-align']='left';
			info.style.animation='fadeShow .3s';
			info.style['-webkit-animation']='fadeShow .3s';
			info.style['z-index']=999999;
			div.info=info;
			if(lib.device==undefined){
				div.onmouseover=function(){
					var info=this.info;
					info.innerHTML=(game.getItemInfo(this.itemname)||'暂无信息');
					ui.window.appendChild(info);
					info.hide();
					info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
					info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
					if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
						info.style.left='calc( 100% - 312px )';
						info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
					};
					if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
						info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
					};
					if(info.offsetTop<0){
						info.style.top='0px';
					};
					info.show();
				};
				div.onmousemove=function(){
					var info=this.info;
					info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
					info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
					if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
						info.style.left='calc( 100% - 312px )';
						info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
					};
					if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
						info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
					};
					if(info.offsetTop<0){
						info.style.top='0px';
					};
				};
				div.onmouseout=function(){
					var info=this.info;
					info.hide();
				};
			}
		}
		if(lib.ykEquip[name]){
			window.ykEquipStrengthenContent1=ui.create.div('');
			window.ykEquipStrengthenContent1.style.cssText='height:100%;width:50%;top:0%;left:0%;border: 1px solid white;';
			var rate;
			if(lib.ykEquip[name].strength&&lib.ykEquip[name].strength.rate) rate=lib.ykEquip[name].strength.rate[''+lib.config.yk_myBag[name].rank1];
			window.ykEquipStrengthenContent1.innerHTML='当前强化等级：'+(lib.config.yk_myBag[name].rank1||0)+'&nbsp&nbsp&nbsp&nbsp强化成功率：<font color=orange><b>'+(rate||100)+'%</b></font><br>强化所需材料<br>';
			window.ykEquipStrengthen.appendChild(window.ykEquipStrengthenContent1);
			window.ykEquipStrengthenContent1x=ui.create.div('');
			window.ykEquipStrengthenContent1x.style.cssText='height:calc( 100% - 40px );width:100%;top:40px;left:0%;text-align:center;';
			window.ykEquipStrengthenContent1.appendChild(window.ykEquipStrengthenContent1x);
			window.ykEquipStrengthenContent1x.style['overflow-x']='hidden';
			window.ykEquipStrengthenContent1x.style['overflow-y']='scroll';
			lib.setScroll(window.ykEquipStrengthenContent1x);
			if(lib.ykEquip[name]&&lib.config.yk_myBag[name].rank1<10){
				var bool=true;
				var consume={};
				for(var item in lib.ykEquip[name].strength) if(item!='rate'&&lib.ykEquip[name].strength[item][''+lib.config.yk_myBag[name].rank1]){
					var div=ui.create.div('');
					div.style.cssText='height:125px;width:125px;top:0%;left:0%;position:relative;';
					window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+(lib.yk_otherItemLibrary[item].image||(item+'.jpg')),div,lib.yk_otherItemLibrary[item],"100% 100%");
					yk_ShowItemInfo(div,item);
					window.ykEquipStrengthenContent1x.appendChild(div);
					var divx=ui.create.div('');
					var num=0;
					if(lib.config.yk_myBag[item]&&lib.config.yk_myBag[item].num==true) num=1;
					if(lib.config.yk_myBag[item]&&typeof lib.config.yk_myBag[item].num=='number') num=lib.config.yk_myBag[item].num;
					var num2=lib.ykEquip[name].strength[item][''+lib.config.yk_myBag[name].rank1];
					if(num>=num2) var color='white';
					else{var color='red';bool=false;}
					var numx=num2;
					num2=window.ykAbbreviation(num2);
					num=window.ykAbbreviation(num);
					var str=num+'/'+num2;
					var width=Math.min(str.length*10,125);
					divx.style.cssText='height:15px;width:'+width+'px;top:calc( 100% - 15px );right:0%;text-align:right;';
					divx.innerHTML='<font color='+color+'>'+num+'</font>/'+num2;
					consume[item]=numx;
					divx.style.backgroundColor='black';
					divx.style.opacity=0.45;
					div.appendChild(divx);
				}
				if(bool&&lib.ykEquip[name].strength){
					var button1=ui.create.div('','<font color=black>强化</font>');
					button1.style.cssText='height:20px;width:60px;top:calc( 95% - 20px );left:calc( 30% - 30px );';
					window.ykUpgradeEquipDiv.appendChild(button1);
					button1.style.borderRadius='8px';
					button1.style.backgroundColor='white';
					window.yk_clickFK(button1);
					button1.consume=consume;
					var rate;
					if(lib.ykEquip[name].strength&&lib.ykEquip[name].strength.rate) rate=lib.ykEquip[name].strength.rate[''+lib.config.yk_myBag[name].rank1];
					button1.rate=(rate||100);
					button1.onclick=function(){
						if(lib.config.yk_myBag[name].rank1<10){
							for(var item in this.consume) if(this.consume[item]>0) game.yk_loseItem(item,this.consume[item]);
							var num=0;
							if(typeof lib.config.yk_myBag[name].rank1=='number') num=lib.config.yk_myBag[name].rank1;
							var rate=this.rate;
							if(Math.random()<=rate){num++;var info='强化成功！当前强化等级：'+num;}
							else var info='强化失败！';
							lib.config.yk_myBag[name].rank1=num;
							game.saveConfig('yk_myBag',lib.config.yk_myBag);
							alert(info);
							funcUGE();
						}
						else alert('该装备已达到最大强化等级！');
					}
				}
				else if(!lib.ykEquip[name].strength){
					window.ykEquipStrengthenContent1x.innerHTML='<span style="font-size:25px;font-weight:400;"><b>该装备暂无强化方式，请等待后续更新！</b></span>';
				}
			}
			else if(lib.config.yk_myBag[name].rank1>=10){
				window.ykEquipStrengthenContent1.innerHTML+='<br><span style="font-size:25px;font-weight:400;"><b>该装备已达到最大强化等级！</b></span>';
			}
			
			window.ykEquipStrengthenContent2=ui.create.div('');
			window.ykEquipStrengthenContent2.style.cssText='height:100%;width:50%;top:0%;left:50%;border: 1px solid white;';
			var rate;
			if(lib.ykEquip[name].fumo&&lib.ykEquip[name].fumo.rate) rate=lib.ykEquip[name].fumo.rate;
			if(!lib.config.yk_myBag[name].fumo) window.ykEquipStrengthenContent2.innerHTML='当前未附魔&nbsp&nbsp&nbsp&nbsp附魔成功率：<font color=orange><b>'+(rate||100)+'%</b></font><br>附魔所需材料<br>';
			else if(lib.ykEquip[name].nature=='none') window.ykEquipStrengthenContent2.innerHTML='当前已附魔完成，可对该武器重新附魔一个随机属性，当前附魔属性为【'+get.translation(lib.config.yk_myBag[name].fumo)+'】。';
			else window.ykEquipStrengthenContent2.innerHTML='当前【'+get.translation(lib.config.yk_myBag[name].fumo)+'】属性已附魔完成';
			window.ykEquipStrengthen.appendChild(window.ykEquipStrengthenContent2);
			window.ykEquipStrengthenContent2x=ui.create.div('');
			window.ykEquipStrengthenContent2x.style.cssText='height:calc( 100% - 40px );width:100%;top:40px;left:0%;text-align:center;';
			window.ykEquipStrengthenContent2.appendChild(window.ykEquipStrengthenContent2x);
			window.ykEquipStrengthenContent2x.style['overflow-x']='hidden';
			window.ykEquipStrengthenContent2x.style['overflow-y']='scroll';
			lib.setScroll(window.ykEquipStrengthenContent2x);
			if(lib.ykEquip[name]&&!lib.config.yk_myBag[name].fumo&&lib.ykEquip[name].nature!='none'){
				var bool=true;
				var consume={};
				for(var item in lib.ykEquip[name].fumo) if(item!='rate'){
					var div=ui.create.div('');
					div.style.cssText='height:125px;width:125px;top:0%;left:0%;position:relative;';
					window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+(lib.yk_otherItemLibrary[item].image||(item+'.jpg')),div,lib.yk_otherItemLibrary[item],"100% 100%");
					yk_ShowItemInfo(div,item);
					window.ykEquipStrengthenContent2x.appendChild(div);
					var divx=ui.create.div('');
					var num=0;
					if(lib.config.yk_myBag[item]&&lib.config.yk_myBag[item].num==true) num=1;
					if(lib.config.yk_myBag[item]&&typeof lib.config.yk_myBag[item].num=='number') num=lib.config.yk_myBag[item].num;
					var num2=0;
					if(lib.ykEquip[name].fumo&&lib.ykEquip[name].fumo[item]) num2=lib.ykEquip[name].fumo[item];
					if(num>=num2) var color='white';
					else{var color='red';bool=false;}
					var numx=num2;
					num2=window.ykAbbreviation(num2);
					num=window.ykAbbreviation(num);
					var str=num+'/'+num2;
					var width=Math.min(str.length*10,125);
					divx.style.cssText='height:15px;width:'+width+'px;top:calc( 100% - 15px );right:0%;text-align:right;';
					divx.innerHTML='<font color='+color+'>'+num+'</font>/'+num2;
					consume[item]=numx;
					divx.style.backgroundColor='black';
					divx.style.opacity=0.45;
					div.appendChild(divx);
				}
				if(bool&&lib.ykEquip[name].fumo){
					var button2=ui.create.div('','<font color=black>附魔</font>');
					button2.style.cssText='height:20px;width:60px;top:calc( 95% - 20px );left:calc( 70% - 30px );';
					window.ykUpgradeEquipDiv.appendChild(button2);
					button2.style.borderRadius='8px';
					button2.style.backgroundColor='white';
					window.yk_clickFK(button2);
					button2.consume=consume;
					var rate;
					if(lib.ykEquip[name].fumo&&lib.ykEquip[name].fumo.rate) rate=lib.ykEquip[name].fumo.rate;
					button2.rate=(rate||100);
					button2.onclick=function(){
						if(!lib.config.yk_myBag[name].fumo){
							for(var item in this.consume) if(this.consume[item]>0) game.yk_loseItem(item,this.consume[item]);
							var rate=this.rate;
							if(Math.random()<=rate){
								var info='附魔成功！';
								var nature=[];
								for(var item in this.consume) if(item.indexOf('_crystal')!=-1&&['god','half-god','tian','di','xuan','huang','fan'].indexOf(item.slice(0,item.indexOf('_crystal')))==-1) nature.push('yk_'+item.slice(0,item.indexOf('_crystal')));
								lib.config.yk_myBag[name].fumo=nature.randomGet();
								game.saveConfig('yk_myBag',lib.config.yk_myBag);
							}
							else var info='附魔失败！';
							alert(info);
							funcUGE();
						}
						else alert('该装备已附魔！');
					}
				}
				else if(!lib.ykEquip[name].fumo){
					window.ykEquipStrengthenContent2x.innerHTML='<span style="font-size:25px;font-weight:400;"><b>该装备暂无附魔方式，请等待后续更新！</b></span>';
				}
			}
			else if(lib.config.yk_myBag[name].fumo){
				window.ykEquipStrengthenContent2.innerHTML+='<br><span style="font-size:25px;font-weight:400;"><b>该装备已附魔！</b></span>';
			}
		}
		else if(lib.ykBook[name]){
			window.ykBookUnderstandContent1=ui.create.div('');
			window.ykBookUnderstandContent1.style.cssText='height:100%;width:50%;top:0%;left:0%;border: 1px solid white;';
			var rate;
			if(lib.ykBook[name].understand&&lib.ykBook[name].understand.rate) rate=lib.ykBook[name].understand.rate[''+lib.config.yk_myBag[name].rank1];
			window.ykBookUnderstandContent1.innerHTML='当前领悟等级：'+(lib.config.yk_myBag[name].rank1||0)+'&nbsp&nbsp&nbsp&nbsp领悟成功率：<font color=orange><b>'+(rate||100)+'%</b></font><br>领悟所需材料<br>';
			window.ykEquipStrengthen.appendChild(window.ykBookUnderstandContent1);
			window.ykBookUnderstandContent1x=ui.create.div('');
			window.ykBookUnderstandContent1x.style.cssText='height:calc( 100% - 40px );width:100%;top:40px;left:0%;text-align:center;';
			window.ykBookUnderstandContent1.appendChild(window.ykBookUnderstandContent1x);
			window.ykBookUnderstandContent1x.style['overflow-x']='hidden';
			window.ykBookUnderstandContent1x.style['overflow-y']='scroll';
			lib.setScroll(window.ykBookUnderstandContent1x);
			if(lib.ykBook[name]&&lib.config.yk_myBag[name].rank1<10){
				var bool=true;
				var consume={};
				for(var item in lib.ykBook[name].understand) if(item!='rate'&&lib.ykBook[name].understand[item][''+lib.config.yk_myBag[name].rank1]){
					var div=ui.create.div('');
					div.style.cssText='height:125px;width:125px;top:0%;left:0%;position:relative;';
					window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+(lib.yk_otherItemLibrary[item].image||(item+'.jpg')),div,lib.yk_otherItemLibrary[item],"100% 100%");
					yk_ShowItemInfo(div,item);
					window.ykBookUnderstandContent1x.appendChild(div);
					var divx=ui.create.div('');
					var num=0;
					if(lib.config.yk_myBag[item]&&lib.config.yk_myBag[item].num==true) num=1;
					if(lib.config.yk_myBag[item]&&typeof lib.config.yk_myBag[item].num=='number') num=lib.config.yk_myBag[item].num;
					var num2=lib.ykBook[name].understand[item][''+lib.config.yk_myBag[name].rank1];
					if(num>=num2) var color='white';
					else{var color='red';bool=false;}
					var numx=num2;
					num2=window.ykAbbreviation(num2);
					num=window.ykAbbreviation(num);
					var str=num+'/'+num2;
					var width=Math.min(str.length*10,125);
					divx.style.cssText='height:15px;width:'+width+'px;top:calc( 100% - 15px );right:0%;text-align:right;';
					divx.innerHTML='<font color='+color+'>'+num+'</font>/'+num2;
					consume[item]=numx;
					divx.style.backgroundColor='black';
					divx.style.opacity=0.45;
					div.appendChild(divx);
				}
				if(bool&&lib.ykBook[name].understand){
					var button1=ui.create.div('','<font color=black>领悟</font>');
					button1.style.cssText='height:20px;width:60px;top:calc( 95% - 20px );left:calc( 30% - 30px );';
					window.ykUpgradeBookDiv.appendChild(button1);
					button1.style.borderRadius='8px';
					button1.style.backgroundColor='white';
					window.yk_clickFK(button1);
					button1.consume=consume;
					var rate;
					if(lib.ykBook[name].understand&&lib.ykBook[name].understand.rate) rate=lib.ykBook[name].understand.rate[''+lib.config.yk_myBag[name].rank1];
					button1.rate=(rate||100);
					button1.onclick=function(){
						if(lib.config.yk_myBag[name].rank1<10){
							for(var item in this.consume) if(this.consume[item]>0) game.yk_loseItem(item,this.consume[item]);
							var num=0;
							if(typeof lib.config.yk_myBag[name].rank1=='number') num=lib.config.yk_myBag[name].rank1;
							var rate=this.rate;
							if(Math.random()<=rate){num++;var info='领悟成功！当前领悟等级：'+num;}
							else var info='领悟失败！';
							lib.config.yk_myBag[name].rank1=num;
							game.saveConfig('yk_myBag',lib.config.yk_myBag);
							alert(info);
							funcUGE();
						}
						else alert('该秘籍已达到最大领悟等级！');
					}
				}
				else if(!lib.ykBook[name].understand){
					window.ykBookUnderstandContent1x.innerHTML='<span style="font-size:25px;font-weight:400;"><b>该秘籍暂无领悟方式，请等待后续更新！</b></span>';
				}
			}
			else if(lib.config.yk_myBag[name].rank1>=10){
				window.ykBookUnderstandContent1.innerHTML+='<br><span style="font-size:25px;font-weight:400;"><b>该秘籍已达到最大领悟等级！</b></span>';
			}
			
			window.ykBookUnderstandContent2=ui.create.div('');
			window.ykBookUnderstandContent2.style.cssText='height:100%;width:50%;top:0%;left:50%;border: 1px solid white;';
			window.ykBookUnderstandContent2.innerHTML='当前进阶等级：'+(lib.config.yk_myBag[name].rank2||0)+'<br>进阶所需材料<br>';
			window.ykEquipStrengthen.appendChild(window.ykBookUnderstandContent2);
			window.ykBookUnderstandContent2x=ui.create.div('');
			window.ykBookUnderstandContent2x.style.cssText='height:calc( 100% - 40px );width:100%;top:40px;left:0%;text-align:center;';
			window.ykBookUnderstandContent2.appendChild(window.ykBookUnderstandContent2x);
			window.ykBookUnderstandContent2x.style['overflow-x']='hidden';
			window.ykBookUnderstandContent2x.style['overflow-y']='scroll';
			lib.setScroll(window.ykBookUnderstandContent2x);
			if(lib.ykBook[name]&&lib.config.yk_myBag[name].rank2<10){
				var bool=true;
				var consume={};
				var div=ui.create.div('');
				div.style.cssText='height:125px;width:125px;top:0%;left:0%;position:relative;';
				var grade=lib.ykBook[name].grade;
				var itemx;
				if(grade=='fangrade') itemx='yk_fan_rubbing';
				else if(grade=='huanggrade') itemx='yk_huang_rubbing';
				else if(grade=='xuangrade') itemx='yk_xuan_rubbing';
				else if(grade=='digrade') itemx='yk_di_rubbing';
				else if(['tiangrade','half-godgrade','godgrade'].indexOf(grade)!=-1) itemx='yk_tian_rubbing';
				window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+(lib.yk_otherItemLibrary[itemx].image||(itemx+'.jpg')),div,lib.yk_otherItemLibrary[itemx],"100% 100%");
				yk_ShowItemInfo(div,itemx);
				window.ykBookUnderstandContent2x.appendChild(div);
				var divx=ui.create.div('');
				var num=0;
				if(lib.config.yk_myBag[itemx]&&lib.config.yk_myBag[itemx].num==true) num=1;
				if(lib.config.yk_myBag[itemx]&&typeof lib.config.yk_myBag[itemx].num=='number') num=lib.config.yk_myBag[itemx].num;
				var num2=1;
				if(lib.ykBook[name].copy&&lib.ykBook[name].copy[itemx]&&lib.ykBook[name].copy[itemx][''+lib.config.yk_myBag[name].rank2]) num2=lib.ykBook[name].copy[itemx][''+lib.config.yk_myBag[name].rank2];
				if(num>=num2) var color='white';
				else{var color='red';bool=false;}
				var numx=num2;
				num2=window.ykAbbreviation(num2);
				num=window.ykAbbreviation(num);
				var str=num+'/'+num2;
				var width=Math.min(str.length*10,125);
				divx.style.cssText='height:15px;width:'+width+'px;top:calc( 100% - 15px );right:0%;text-align:right;';
				divx.innerHTML='<font color='+color+'>'+num+'</font>/'+num2;
				consume[itemx]=numx;
				divx.style.backgroundColor='black';
				divx.style.opacity=0.45;
				div.appendChild(divx);
				if(bool&&lib.ykBook[name].copy){
					var button2=ui.create.div('','<font color=black>进阶</font>');
					button2.style.cssText='height:20px;width:60px;top:calc( 95% - 20px );left:calc( 70% - 30px );';
					window.ykUpgradeEquipDiv.appendChild(button2);
					button2.style.borderRadius='8px';
					button2.style.backgroundColor='white';
					window.yk_clickFK(button2);
					button2.consume=consume;
					button2.onclick=function(){
						if(lib.config.yk_myBag[name].rank2<10){
							for(var item in this.consume) if(this.consume[item]>0) game.yk_loseItem(item,this.consume[item]);
							var num=0;
							if(typeof lib.config.yk_myBag[name].rank2=='number') num=lib.config.yk_myBag[name].rank2;
							num++;
							lib.config.yk_myBag[name].rank2=num;
							game.saveConfig('yk_myBag',lib.config.yk_myBag);
							alert('【'+get.translation(name)+'】进阶成功！当前进阶等级：'+num);
							funcUGE();
						}
						else alert('该装备已达到最大进阶等级！');
					}
				}
				else if(!lib.ykBook[name].copy){
					window.ykBookUnderstandContent2x.innerHTML='<span style="font-size:25px;font-weight:400;"><b>该秘籍暂未开放其他进阶方式，请等待后续更新！</b></span>';
				}
			}
			else if(lib.config.yk_myBag[name].rank2>=10){
				window.ykBookUnderstandContent2.innerHTML+='<br><span style="font-size:25px;font-weight:400;"><b>该秘籍已达到最大进阶等级！</b></span>';
			}
		}
		
		var funcUGE=function(){
			window.ykUpgradeEquipDiv.delete();
			delete window.ykUpgradeEquipDiv;
			window.ykUpgradeEquipDiv=undefined;
		}
		var div=ui.create.div('.menubutton.round','×',function(){
			funcUGE();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['z-index']=99999;
		window.ykUpgradeEquipDiv.appendChild(div);
		window.yk_clickFK(div);
	}
	window.itemComeOn=function(scale){
		var ykdateUpdateShopping=function(){
			var date=new Date();
			var day=date.getDate();
			if(lib.config.yk_updateDateS==undefined||lib.config.yk_updateDateS!=day){
				var date=new Date();
				var day=date.getDate();
				lib.config.yk_updateDateS=day;
				game.saveConfig('ykshoppingList_small',[]);
				game.saveConfig('ykshoppingList_middle',[]);
				game.saveConfig('ykshoppingList_large',[]);
				game.saveConfig('ykshoppingList_small_update',false);
				game.saveConfig('ykshoppingList_middle_update',false);
				game.saveConfig('ykshoppingList_large_update',false);
				game.saveConfig('yk_updateDateS',lib.config.yk_updateDateS);
			}
		};
		ykdateUpdateShopping();
		if(lib.config['ykshoppingList_'+scale+'_update']) return lib.config['ykshoppingList_'+scale];
		game.saveConfig('ykshoppingList_'+scale+'_update',true);
		var list_fan=[];
		var list_huang=[];
		var list_xuan=[];
		var list_di=[];
		var list_tian=[];
		var list_halfGod=[];
		var list_god=[];
		var fanRate=0,huangRate=0,xuanRate=0,diRate=0,tianRate=0,halfGodRate=0,godRate=0;
		var r=1;
		if(scale=='middle') r=2;
		if(scale=='large') r=3;
		for(var i in lib.yk_otherItemLibrary){
			if(lib.yk_otherItemLibrary[i].grade=='fangrade'&&lib.yk_otherItemLibrary[i]['showupRate'+r]){list_fan.push(i);fanRate+=lib.yk_otherItemLibrary[i]['showupRate'+r];}
			if(lib.yk_otherItemLibrary[i].grade=='huanggrade'&&lib.yk_otherItemLibrary[i]['showupRate'+r]){list_huang.push(i);huangRate+=lib.yk_otherItemLibrary[i]['showupRate'+r];}
			if(lib.yk_otherItemLibrary[i].grade=='xuangrade'&&lib.yk_otherItemLibrary[i]['showupRate'+r]){list_xuan.push(i);xuanRate+=lib.yk_otherItemLibrary[i]['showupRate'+r];}
			if(lib.yk_otherItemLibrary[i].grade=='digrade'&&lib.yk_otherItemLibrary[i]['showupRate'+r]){list_di.push(i);diRate+=lib.yk_otherItemLibrary[i]['showupRate'+r];}
			if(lib.yk_otherItemLibrary[i].grade=='tiangrade'&&lib.yk_otherItemLibrary[i]['showupRate'+r]){list_tian.push(i);tianRate+=lib.yk_otherItemLibrary[i]['showupRate'+r];}
			if(lib.yk_otherItemLibrary[i].grade=='half-godgrade'&&lib.yk_otherItemLibrary[i]['showupRate'+r]){list_halfGod.push(i);halfGodRate+=lib.yk_otherItemLibrary[i]['showupRate'+r];}
			if(lib.yk_otherItemLibrary[i].grade=='godgrade'&&lib.yk_otherItemLibrary[i]['showupRate'+r]){list_god.push(i);godRate+=lib.yk_otherItemLibrary[i]['showupRate'+r];}
		}
		var rarenum=0;
		var result=[];
		if(scale=='small'){
			var allList=list_fan.concat(list_huang).concat(list_xuan);
			allList.randomSort();
			var sumRate=fanRate+huangRate+xuanRate;
			while(rarenum<2&&result.length<15){
				for(var i of allList) if(Math.random()<lib.yk_otherItemLibrary[i]['showupRate'+r]/sumRate&&lib.yk_otherItemLibrary[i].value!=undefined){if(['xuangrade'].indexOf(lib.yk_otherItemLibrary[i].grade)!=-1){rarenum++;};result.push(i);break;}
			}
			var list2=list_fan.concat(list_huang);
			list2.randomSort();
			while(result.length<15){
				for(var i of list2) if(Math.random()<lib.yk_otherItemLibrary[i]['showupRate'+r]/sumRate){result.push(i);break;}
			}
			game.saveConfig('ykshoppingList_small',result);
		}
		else if(scale=='middle'){
			var allList=list_fan.concat(list_huang).concat(list_xuan).concat(list_di);
			allList.randomSort();
			var sumRate=fanRate+huangRate+xuanRate+diRate;
			while(rarenum<1&&result.length<40){
				for(var i of allList) if(Math.random()<lib.yk_otherItemLibrary[i]['showupRate'+r]/sumRate&&lib.yk_otherItemLibrary[i].value!=undefined){if(['digrade'].indexOf(lib.yk_otherItemLibrary[i].grade)!=-1){rarenum++;};result.push(i);break;}
			}
			var list2=list_fan.concat(list_huang).concat(list_xuan);
			list2.randomSort();
			while(result.length<40){
				for(var i of list2) if(Math.random()<lib.yk_otherItemLibrary[i]['showupRate'+r]/sumRate){result.push(i);break;}
			}
			game.saveConfig('ykshoppingList_middle',result);
		}
		else if(scale=='large'){
			var allList=list_xuan.concat(list_di).concat(list_tian).concat(list_halfGod).concat(list_god);
			allList.randomSort();
			var sumRate=xuanRate+diRate+tianRate+halfGodRate+godRate;
			while(rarenum<4&&result.length<8){
				for(var i of allList) if(Math.random()<lib.yk_otherItemLibrary[i]['showupRate'+r]/sumRate&&lib.yk_otherItemLibrary[i].value!=undefined){if(['godgrade','half-godgrade','tiangrade','digrade'].indexOf(lib.yk_otherItemLibrary[i].grade)!=-1){rarenum++;};result.push(i);break;}
			}
			var list2=list_xuan.concat(list_di);
			list2.randomSort();
			while(result.length<8){
				for(var i of list2) if(Math.random()<lib.yk_otherItemLibrary[i]['showupRate'+r]/sumRate){result.push(i);break;}
			}
			game.saveConfig('ykshoppingList_large',result);
		}
		return lib.config['ykshoppingList_'+scale];
	}
	window.ykOpenShop=function(scale){//商店
		//window.ykOpenMap();
		if(typeof window.ykcloseShop=='function'){window.ykcloseShop();return ;}
		var date=new Date().getDay();
		if(date!=6&&date!=0&&scale=='middle'){alert('这个商店没开门，周末再来看看吧！');return ;}
		if(['small','middle'].indexOf(scale)==-1) scale='small';
		window.ykShop1=ui.create.div();
		window.ykShop1.style.cssText='left:0px;top:0px;width:100%;height:100%;background-color:black;z-index:799;';
		window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/yk'+scale+'Shop.jpg',window.ykShop1,true,"100% 100%");
		document.body.appendChild(window.ykShop1);
		var sex=['male','female'].randomGet();
		var person='yksell'+sex+'_'+scale+'Shop0';
		lib.translate[person]='售货员';
		var content=[{
			pages : 1 ,
			say:['欢迎光临！','看上了什么尽管挑','本店商品应有尽有，欢迎细心挑选！','本店会定期从京城进购一些商品，拜托您经常光顾哦！'].randomGet(),
			avatar:'none',
			background:'https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/yk'+scale+'Shop.jpg',
		}];
		game.personChat(content,person);
		
		window.ykShop1Content=ui.create.div('.menu');
		window.ykShop1Content.style.cssText='left:calc( 50% - 600px );top:calc( 50% - 300px );width:1200px;height:600px;z-index:799;';
		window.ykShop1Content.style['text-align']='left';
		window.ykShop1Content.style['overflow-x']='hidden';
		window.ykShop1Content.style['overflow-y']='scroll';
		lib.setScroll(window.ykShop1Content);
		window.ykShop1.appendChild(window.ykShop1Content);
		
		//随机刷新商品
		var itemList=window.itemComeOn(scale);
		itemList.sort(function (x, y) {
			var a = lib.yk_otherItemLibrary[x].grade;
			var b = lib.yk_otherItemLibrary[y].grade;
			var num={
				'godgrade':7,
				'half-godgrade':6,
				'tiangrade':5,
				'digrade':4,
				'xuangrade':3,
				'huanggrade':2,
				'fangrade':1,
			};
			var c=(num[a]||0.5);
			var d=(num[b]||0.5);
			if(c<d) return 1;
			if(c>d) return -1;
			return 0;
		});
		var yk_characterEquipShowItemInfo2=function(div,itemname){
			if(!div) return ;
			if(itemname) div.itemname=itemname;
			var info=ui.create.div('.menu');
			info.style.transition='left 0s,top 0s,opacity .3s';
			info.style.width='312px';
			info.style['pointer-events']='none';
			info.style['text-align']='left';
			info.style.animation='fadeShow .3s';
			info.style['-webkit-animation']='fadeShow .3s';
			info.style['z-index']=999999;
			div.info=info;
			if(lib.device==undefined){
				div.onmouseover=function(){
					var info=this.info;
					info.innerHTML=(game.getItemInfo(this.itemname)||'暂无信息');
					ui.window.appendChild(info);
					info.hide();
					info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
					info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
					if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
						info.style.left='calc( 100% - 312px )';
						info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
					};
					if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
						info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
					};
					if(info.offsetTop<0){
						info.style.top='0px';
					};
					info.show();
				};
				div.onmousemove=function(){
					var info=this.info;
					info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
					info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
					if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
						info.style.left='calc( 100% - 312px )';
						info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
					};
					if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
						info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
					};
					if(info.offsetTop<0){
						info.style.top='0px';
					};
				};
				div.onmouseout=function(){
					var info=this.info;
					info.hide();
				};
			}
		}
		for(var item of itemList){
			var div=ui.create.div('');
			div.style.cssText='height:140px;width:100px;z-index:99999;position:relative;';
			window.ykShop1Content.appendChild(div);
			var divPrice=ui.create.div('');
			divPrice.style.cssText='height:40px;width:100px;left:0px;top:100px;z-index:99999;position:relative;text-align:center';
			var num={
				'godgrade':3,
				'half-godgrade':2.5,
				'tiangrade':2.1,
				'digrade':1.8,
				'xuangrade':1.6,
				'huanggrade':1.4,
				'fangrade':1.2,
			};
			divPrice.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>价格：'+window.ykAbbreviation(Math.round(lib.yk_otherItemLibrary[item].value*num[lib.yk_otherItemLibrary[item].grade]))+'铢</b></span>';
			div.appendChild(divPrice);
			var divx=ui.create.div('','',function(){
				var scale=this.scale;
				var num={
					'godgrade':3,
					'half-godgrade':2.5,
					'tiangrade':2.1,
					'digrade':1.8,
					'xuangrade':1.6,
					'huanggrade':1.4,
					'fangrade':1.2,
				};
				var price=Math.round(lib.yk_otherItemLibrary[this.name].value*num[lib.yk_otherItemLibrary[this.name].grade]);
				if(game.ykCheckCoin(price)) if(confirm('是否花费'+window.ykAbbreviation(price)+'铢购买一件【'+get.translation(item)+'】？')){
					this.delete();
					lib.config['ykshoppingList_'+scale].remove(this.name);
					game.ykChangeCoin(-price);
					game.saveConfig('ykshoppingList_'+scale,lib.config['ykshoppingList_'+scale]);
					window.ykcloseShop();
					game.yk_gainItem(this.name);
					var sex=['male','female'].randomGet();
					var person='yksell'+sex+'_'+scale+'Shop0';
					lib.translate[person]='售货员';
					var content=[{
						pages : 1 ,
						say:['祝您购物愉快，欢迎下次光临！'].randomGet(),
						avatar:'none',
						background:'https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/yk'+scale+'Shop.jpg',
					}];
					game.personChat(content,person);
				}
				if(!game.ykCheckCoin(price)) alert('没钱啦！老板对你超不屑！');
			});
			divx.style.cssText='height:100px;width:100px;top:0px;left:0px;z-index:999999;border-radius:8px;';
			if(lib.yk_otherItemLibrary&&lib.yk_otherItemLibrary[item]&&lib.yk_otherItemLibrary[item].image) window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+lib.yk_otherItemLibrary[item].image,divx,true,"100% 100%");
			else window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+item+'.jpg',divx,true,"100% 100%");
			divx.name=item;
			divx.scale=scale;
			yk_characterEquipShowItemInfo2(divx,divx.name);
			div.appendChild(divx);
		}
		
		var funcOS1=function(){
			window.ykShop1.delete();
			delete window.ykShop1;
			window.ykShop1=undefined;
			window.ykcloseShop=undefined;
		}
		window.ykcloseShop=funcOS1;
		var div=ui.create.div('.menubutton.round','×',function(){
			funcOS1();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['z-index']=99999;
		window.ykShop1.appendChild(div);
		window.yk_clickFK(div);
	}
	if(!window.playTime) window.playTime={};
	window.ykAuctionSendInfomation=function(content){//播报、对话
		if(window.ykAuctionScreenShow) return ;
		window.ykAuctionScreenShow=ui.create.div('');
		window.ykAuctionScreenShow=ui.create.div('',ui.window);
		window.ykAuctionScreenShow.style.cssText="pointer-events:none;background:rgba(0,0,0,0.5);width:100%;height:27px;font-size:23px;font-family:shousha;z-index:999999999999;";
		window.ykAuctionScreenShow.innerHTML='<marquee direction="left" behavior="scroll" scrollamount=10" loop="1" width="100%" height="50" align="absmiddle" ><font  face="FZLBJW">'+(content||'')+'</font></marquee>';
		ui.window.appendChild(window.ykAuctionScreenShow);
		_status.ykAuction_saying=true;
		var time=Math.max((content.length-152),1)*1000;
		time=Math.max(time*2,time+10000);
		setTimeout(function() {
			window.ykAuctionScreenShow.innerHTML='';
		}, time);
		setTimeout(function() {
			if(window.ykAuctionScreenShow) window.ykAuctionScreenShow.delete();
			if(window.ykAuctionScreenShow) delete window.ykAuctionScreenShow;
			if(window.ykAuctionScreenShow) window.ykAuctionScreenShow=undefined;
			_status.ykAuction_saying=false;
		}, time+5000);
	}
	window.ykAuctionItemDeadline=function(){//结算
		if(window.playTime.days==undefined||window.playTime.months==undefined||window.playTime.years==undefined||window.playTime.hours==undefined||window.playTime.minutes==undefined) return false;
		var final=function(){
			var caculateEvt=function(){//离线结算AI出价
				if(!lib.config.ykAIOfferPriceTimeList) return ;
				for(var time of lib.config.ykAIOfferPriceTimeList){
					var ever=time.hour*3600+time.minute*60+time.second;
					var now=window.playTime.hours*3600+window.playTime.minutes*60+window.playTime.seconds;
					if(ever<now) window.ykAI_pay();
				}
			}
			caculateEvt();
			for(var itemx of lib.config.ykAuctionPriceList){
				if(itemx.isMine&&itemx.itemname){
					if(lib.ykEquip[itemx.itemname]) game.yk_gainEquip(itemx.itemname);
					else if(lib.ykBook[itemx.itemname]) game.yk_gainBook(itemx.itemname);
					else if(lib.yk_otherItemLibrary[itemx.itemname]) game.yk_gainItem(itemx.itemname);
					alert('已获得拍卖物品【'+get.translation(itemx.itemname)+'】！可前往背包进行查看，感谢您的参与！');
				}
			}
			game.saveConfig('ykshoppingList_large',[]);
			game.saveConfig('ykAIOfferPriceTimeList',[]);
			game.saveConfig('ykAuctionOriginPriceList',[]);
			game.saveConfig('ykAuctionPriceList',[]);
		}
		if(lib.config.ykAuctionOriginPriceList){
			var bool=true;
			for(var item of lib.config.ykAuctionOriginPriceList){
				if(window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days==item.date) bool=false;
			}
			if(!bool) return ;
			var hour=window.playTime.hours;
			var minute=window.playTime.minutes;
			var second=window.playTime.seconds;
			if(window.playTime.days==undefined||window.playTime.months==undefined||window.playTime.years==undefined||window.playTime.hours==undefined||window.playTime.minutes==undefined) return false;
			if(window.playTime.weekdays!=0||window.playTime.days>7) final();
			else if(hour>=17||hour<8||hour==12) final();
		}
	}
	window.ykAuctionItemShowTime=function(bool){
		if(window.playTime.days==undefined||window.playTime.months==undefined||window.playTime.years==undefined||window.playTime.hours==undefined||window.playTime.minutes==undefined) return false;
		var hour=window.playTime.hours;
		if(!hour) return '时间错误！';
		var minute=window.playTime.minutes;
		var second=window.playTime.seconds;
		var deadline=24;
		if(hour>17) return '本场拍卖已结束！感谢您的参与！';
		if(hour>12) var deadline=12;//8:00:00-12:00:00,13:00:00-17:00:00
		else var deadline=12;
		var seconds=60-second;
		var minutes=60-minute-(second>0?1:0);
		if(seconds==60){seconds=0;minutes++;}
		var hours=deadline-hour-(minute>0?1:0);
		if(minutes==60){minutes=0;hours++;}
		if(hours==0&&minutes==0&&seconds==0) window.ykAuctionItemDeadline();
		if(bool) return [hours,minutes,seconds];
		else return hours+':'+minutes+':'+seconds;
	}
	window.ykAI_pay=function(){
		if(window.ykCheckAuctionOpen()) window.ykgetAuctionItem();
		else return ;
		var AI_vip_id=['星猫超多猫图','长鸽不如短鸽','废城君超帅','咸鱼很咸不好恰','你看过缘（）空吗','Engex？End！','诗笺爱喝可乐','化梦的大萌','生活不易，啊婊卖艺','魔界的大司马又来入侵啦','呲牙哥最爱笑','阳光大哥哥超暖','繁星咕咕哒','藏海又跑哪去了','刀叔即将发车请系好安全带','Aurora极光yyds！','水乎村长失踪案件侦探员','苏婆yyds！','本程序猿已退休','可宣，我的可宣555','无中在摸鱼','星云就是幸运！','密码是123456789','孙菇不咕','瓦力粉丝一号','鲨鱼！沉到海底去吧！','风花迷雪月，漫天飞流蝶','乔姐带你飞','染柒 = 97'];
		var AI_passby_id=['这瓜保熟不','你是魔鬼吗','生活就要多姿多彩','星空下第一强者','吃遍云空美食','双倍的快乐','我不是狗托','织梦者','逐梦无惧','执剑天下','给你算命不要钱','最爱喝兽奶','叶凡的大奔被爷开走了','卧龙凤雏','好不愧是我','我太难了','我儿王腾有大帝之姿！','牛头人战士','兽人永不为奴'];
		var all_name=AI_vip_id.concat(AI_passby_id);
		var name=all_name.randomGet();
		var offerPrice=function(pos,name,personname,price){
			var infox;
			var list=[];
			for(var info of lib.config.ykAuctionPriceList){
				if(info.pos!=pos) list.push(info);
				else infox=info;
			}
			game.ykChangeCoin(infox.price);
			if(infox.isMine) alert('您参与竞价【'+get.translation(name)+'】的价格已被其他玩家超过，返还全部本次竞价金额'+infox.price+'铢，祝您游戏愉快！');
			infox.isMine=false;
			infox.price=Math.round(price);
			infox.name=personname;
			list.push(infox);
			lib.config.ykAuctionPriceList=list;
			game.saveConfig('ykAuctionPriceList',lib.config.ykAuctionPriceList);
			if(window['ykauction_offerdiv_'+pos]) window['ykauction_offerdiv_'+pos].parent2.isMine=true;
			if(window['divAuctionItemMyPrice'+pos]) window['divAuctionItemMyPrice'+pos].innerHTML='<li>'+personname+'的出价：'+price;
			var grade,color='white';
			if(lib.ykEquip[name]) grade=lib.ykEquip[name].grade;
			else if(lib.ykBook[name]) grade=lib.ykBook[name].grade;
			else if(lib.yk_otherItemLibrary[name]) grade=lib.yk_otherItemLibrary[name].grade;
			if(grade=='fangrade') color='grey';
			else if(grade=='huanggrade') color='green';
			else if(grade=='xuangrade') color='cyan';
			else if(grade=='digrade') color='purple';
			else if(grade=='tiangrade') color='yellow';
			else if(grade=='half-godgrade') color='orange';
			else if(grade=='godgrade') color='red';
			window.ykAuctionSendInfomation('玩家【<font color="#FFA500">'+personname+'</font>】'+(price>50000?'一掷千金，以':'以')+price+'铢的价格参与竞拍'+(['godgrade','half-godgrade'].indexOf(grade)!=-1?'云空大陆上的无上珍宝————':'')+'【<font color='+color+'>'+get.translation(name)+'</font>】'+(price>100000?'，被主持本次拍卖会的拍卖师惊为天人！':'！'));
			window.ykauctionAddRecord('玩家【<font color="#FFA500">'+personname+'</font>】'+(price>50000?'一掷千金，以':'以')+price+'铢的价格参与竞拍'+(['godgrade','half-godgrade'].indexOf(grade)!=-1?'云空大陆上的无上珍宝————':'')+'【<font color='+color+'>'+get.translation(name)+'</font>】',true);
		}
		for(var item of lib.config.ykAuctionPriceList){
			var price=item.price;
			if(price=='无') price=window.yk_aucgetOriginPrice(item.pos);
			var originInfo,precious;
			if(lib.ykEquip[item.itemname]){originInfo=lib.ykEquip[item.itemname];precious=true;}
			else if(lib.ykBook[item.itemname]){originInfo=lib.ykBook[item.itemname];precious=true;}
			else if(lib.yk_otherItemLibrary[item.itemname]){
				precious=true;
				originInfo=lib.yk_otherItemLibrary[item.itemname];
				if(['godgrade','half-godgrade','tiangrade'].indexOf(lib.yk_otherItemLibrary[item.itemname].grade)==-1) precious=false;
			}
			var grade=originInfo.grade;
			var reference,canPay=0;
			if(grade=='fangrade'){canPay=get.rand(0,2);reference=lib.yk_otherItemLibrary['yk_fan_bookPage'].value*30;}
			else if(grade=='huanggrade'){canPay=get.rand(0,3);reference=lib.yk_otherItemLibrary['yk_huang_bookPage'].value*50;}
			else if(grade=='xuangrade'){canPay=get.rand(1,4);reference=lib.yk_otherItemLibrary['yk_xuan_bookPage'].value*75;}
			else if(grade=='digrade'){canPay=get.rand(3,5);reference=lib.yk_otherItemLibrary['yk_di_bookPage'].value*100;}
			else if(grade=='tiangrade'){canPay=get.rand(5,7);reference=lib.yk_otherItemLibrary['yk_tian_bookPage'].value*150;}
			else if(grade=='half-godgrade'){canPay=get.rand(8,10);reference=lib.yk_otherItemLibrary['yk_tian_bookPage'].value*250;}
			else if(grade=='godgrade'){canPay=get.rand(10,13);reference=lib.yk_otherItemLibrary['yk_tian_bookPage'].value*400;}
			if(precious) canPay=Math.round(canPay*(1+get.rand(3,5)/10));
			if(originInfo.value){
				var value=originInfo.value;
			}
			else{
				var value=reference;
			}
			if(originInfo&&price<value*(get.rand(0,canPay)/10+1)) offerPrice(item.pos,item.itemname,name,Math.round(price*1.05));
		}
	}
	window.ykAIOfferPrice_setTime=function(){
		if(window.playTime.days==undefined||window.playTime.months==undefined||window.playTime.years==undefined||window.playTime.hours==undefined||window.playTime.minutes==undefined) return false;
		if(!lib.config.ykAIOfferPriceTimeList||(lib.config.ykAIOfferPriceTimeList&&!lib.config.ykAIOfferPriceTimeList.length)){
			lib.config.ykAIOfferPriceTimeList=[];
			var hour=window.playTime.hours;
			if(!hour) return ;
			var minute=window.playTime.minutes;
			var second=window.playTime.seconds;
			var starts=0,startm=0;
			var starth=8;
			while(starth<17){
				var m=get.rand(15,30);
				var s=get.rand(0,60);
				starts+=s;
				if(starts>=60){m++;starts-=60;}
				startm+=m;
				if(startm>=60){starth++;startm-=60;}
				var t={
					second:starts,
					minute:startm,
					hour:starth,
				}
				if(starth!=12) lib.config.ykAIOfferPriceTimeList.push(t);
			}
			lib.config.ykAIOfferPriceTimeList=lib.config.ykAIOfferPriceTimeList.slice(0,lib.config.ykAIOfferPriceTimeList.length-1);
			game.saveConfig('ykAIOfferPriceTimeList',lib.config.ykAIOfferPriceTimeList);
		}
	}
	window.ykAIOfferPrice=function(){
		window.ykAIOfferPrice_setTime();
		window.ykAI_OfferPriceinterval=setInterval(function(){
			if(window.playTime.days==undefined||window.playTime.months==undefined||window.playTime.years==undefined||window.playTime.hours==undefined||window.playTime.minutes==undefined){return false;clearInterval(AI_interval);}
			if(!lib.config.ykAuctionPriceList||!lib.config.ykAIOfferPriceTimeList){return false;clearInterval(AI_interval);}
			if(!lib.config.ykAuctionPriceList.length||!lib.config.ykAIOfferPriceTimeList.length){return false;clearInterval(AI_interval);}
			var hour=window.playTime.hours;
			var minute=window.playTime.minutes;
			var second=window.playTime.seconds;
			for(var time of lib.config.ykAIOfferPriceTimeList){
				if(hour==time.hour&&minute==time.minute&&second==time.second){window.ykAI_pay();lib.config.ykAIOfferPriceTimeList.remove(time);game.saveConfig('ykAIOfferPriceTimeList',lib.config.ykAIOfferPriceTimeList);}
			}
		},1000);
	}
	if(lib.config.ykshoppingList_large_update&&window.playTime.hours<17&&window.playTime.hours>8&&lib.config.ykAuctionPriceList&&lib.config.ykAuctionPriceList.length) window.ykAIOfferPrice();
	else window.ykAuctionItemDeadline();
	window.ykgetAuctionPriceOwnerInfo=function(tablenum,type){
		if(!lib.config.ykAuctionPriceList) game.saveConfig('ykAuctionPriceList',[]);
		if(!lib.config.ykAuctionPriceList.length) return '无';
		if(!type) type='name';
		for(var info of lib.config.ykAuctionPriceList) if(info.pos==tablenum) return info[type];
		return '无';
	}
	window.ykCheckAuctionOpen=function(){//每个月第一个周日
		if(window.playTime.days==undefined||window.playTime.months==undefined||window.playTime.years==undefined||window.playTime.hours==undefined||window.playTime.minutes==undefined) return false;
		if(window.playTime.weekdays!=0||window.playTime.days>7) return false;
		var day=window.playTime.days;
		var hour=window.playTime.hours;
		if(!hour) return false;
		var minute=window.playTime.minutes;
		var second=window.playTime.seconds;
		if(hour>17||hour<8) return false;
		if(hour==12) return 'delay';
		window.ykAIOfferPrice_setTime();
		return true;
	}
	window.BEComeOn=function(){
		if(lib.config.ykshoppingList_large_update) return ;
		var lx=[];
		for(var e in lib.ykEquip) lx.push(e);
		for(var b in lib.ykBook) lx.push(b);
		return lx;
	}
	window.ykgetAuctionItem=function(){
		if(!lib.config.ykshoppingList_large) game.saveConfig('ykshoppingList_large',[]);
		if(lib.config.ykshoppingList_large.length>8) game.saveConfig('ykshoppingList_large',lib.config.ykshoppingList_large.randomGets(8));
		if(lib.config.ykshoppingList_large_update) return lib.config.ykshoppingList_large;
		else{
			var listbe=window.BEComeOn();
			var listitem=window.itemComeOn('large');
			var result=[];
			var rateList=[{r:0.4,tag:'fangrade',},{r:0.3,tag:'huanggrade',},{r:0.2,tag:'xuangrade',},{r:0.07,tag:'digrade',},{r:0.02,tag:'tiangrade',},{r:0.007,tag:'half-godgrade',},{r:0.003,tag:'godgrade',}];
			var fanbe=[];
			var huangbe=[];
			var xuanbe=[];
			var dibe=[];
			var tianbe=[];
			var halfGodbe=[];
			var godbe=[];
			for(var be of listbe){
				if((lib.ykEquip[be]&&lib.ykEquip[be].grade=='fangrade')||(lib.ykBook[be]&&lib.ykBook[be].grade=='fangrade')) fanbe.push(be);
				if((lib.ykEquip[be]&&lib.ykEquip[be].grade=='huanggrade')||(lib.ykBook[be]&&lib.ykBook[be].grade=='huanggrade')) huangbe.push(be);
				if((lib.ykEquip[be]&&lib.ykEquip[be].grade=='xuangrade')||(lib.ykBook[be]&&lib.ykBook[be].grade=='xuangrade')) xuanbe.push(be);
				if((lib.ykEquip[be]&&lib.ykEquip[be].grade=='digrade')||(lib.ykBook[be]&&lib.ykBook[be].grade=='digrade')) dibe.push(be);
				if((lib.ykEquip[be]&&lib.ykEquip[be].grade=='tiangrade')||(lib.ykBook[be]&&lib.ykBook[be].grade=='tiangrade')) tianbe.push(be);
				if((lib.ykEquip[be]&&lib.ykEquip[be].grade=='half-godgrade')||(lib.ykBook[be]&&lib.ykBook[be].grade=='half-godgrade')) halfGodbe.push(be);
				if((lib.ykEquip[be]&&lib.ykEquip[be].grade=='godgrade')||(lib.ykBook[be]&&lib.ykBook[be].grade=='godgrade')) godbe.push(be);
			}
			var fani=[];
			var huangi=[];
			var xuani=[];
			var dii=[];
			var tiani=[];
			var halfGodi=[];
			var godi=[];
			for(var i of listitem){
				if(!lib.yk_otherItemLibrary[i]||(lib.yk_otherItemLibrary[i]&&!lib.yk_otherItemLibrary[i].value)) continue;
				if(lib.yk_otherItemLibrary[i]&&lib.yk_otherItemLibrary[i].grade=='fangrade') fani.push(i);
				if(lib.yk_otherItemLibrary[i]&&lib.yk_otherItemLibrary[i].grade=='huanggrade') huangi.push(i);
				if(lib.yk_otherItemLibrary[i]&&lib.yk_otherItemLibrary[i].grade=='xuangrade') xuani.push(i);
				if(lib.yk_otherItemLibrary[i]&&lib.yk_otherItemLibrary[i].grade=='digrade') dii.push(i);
				if(lib.yk_otherItemLibrary[i]&&lib.yk_otherItemLibrary[i].grade=='tiangrade') tiani.push(i);
				if(lib.yk_otherItemLibrary[i]&&lib.yk_otherItemLibrary[i].grade=='half-godgrade') halfGodi.push(i);
				if(lib.yk_otherItemLibrary[i]&&lib.yk_otherItemLibrary[i].grade=='godgrade') godi.push(i);
			}
			while(result.length<8){
				if(Math.random()<0.25){
					var x=Math.random();
					var rate=0;
					for(var a=0;a<rateList.length;a++){
						rate+=rateList[a].r;
						if(x<rate){
							var grade=rateList[a].tag;
							var res;
							if(grade=='fangrade') res=fanbe.randomGet();
							else if(grade=='huanggrade') res=huangbe.randomGet();
							else if(grade=='xuangrade') res=xuanbe.randomGet();
							else if(grade=='digrade') res=dibe.randomGet();
							else if(grade=='tiangrade') res=tianbe.randomGet();
							else if(grade=='half-godgrade') res=halfGodbe.randomGet();
							else if(grade=='godgrade') res=godbe.randomGet();
							if(res) result.push(res);
							break;
						}
						a++;
					}
					if(x<rateList.godgrade) result.push(godbe.randomGet());
					else if(x<(rateList.godgrade+rateList['half-godgrade'])) result.push(halfGodbe.randomGet());
				}
				else{
					var x=Math.random();
					var rate=0;
					for(var a=0;a<rateList.length;a++){
						rate+=rateList[a].r;
						if(x<rate){
							var grade=rateList[a].tag;
							var res;
							if(grade=='fangrade') res=fani.randomGet();
							else if(grade=='huanggrade') res=huangi.randomGet();
							else if(grade=='xuangrade') res=xuani.randomGet();
							else if(grade=='digrade') res=dii.randomGet();
							else if(grade=='tiangrade') res=tiani.randomGet();
							else if(grade=='half-godgrade') res=halfGodi.randomGet();
							else if(grade=='godgrade') res=godi.randomGet();
							if(res) result.push(res);
							break;
						}
						a++;
					}
				}
			}
			lib.config.ykshoppingList_large=result;
			if(lib.config.ykshoppingList_large.length>8) lib.config.ykshoppingList_large=lib.config.ykshoppingList_large.randomGets(8);
		}
		if(!lib.config.ykshoppingList_large.length||(lib.config.ykshoppingList_large.length&&typeof lib.config.ykshoppingList_large[0]=='object')) return lib.config.ykshoppingList_large;
		var ps=[];
		for(var item of lib.config.ykshoppingList_large){
			var x;
			if(lib.ykEquip[item]||lib.ykBook[item]){
				var image,grade,price,type='item';
				if(lib.ykEquip[item]){grade=lib.ykEquip[item].grade;type='equip';}
				else if(lib.ykBook[item]){grade=lib.ykBook[item].grade;type='book';}
				if(!grade) continue;
				var scoreList={//标准强度对应评分
					'fangrade':100,
					'huanggrade':200,
					'xuangrade':500,
					'digrade':1000,
					'tiangrade':1500,
					'half-godgrade':2000,
					'godgrade':3000,
				}
				if(lib.ykEquip[item]) var score=(lib.ykEquip[item].score||scoreList[grade]);
				else if(lib.ykBook[item]) var score=(lib.ykBook[item].score||scoreList[grade]);
				if(grade=='fangrade') price=lib.yk_otherItemLibrary['yk_fan_bookPage'].value*30*(Math.round(10+get.rand(0,5))/10);
				else if(grade=='huanggrade') price=lib.yk_otherItemLibrary['yk_huang_bookPage'].value*50*(Math.round(10+get.rand(0,5))/10);
				else if(grade=='xuangrade') price=lib.yk_otherItemLibrary['yk_xuan_bookPage'].value*75*(Math.round(10+get.rand(0,5))/10);
				else if(grade=='digrade') price=lib.yk_otherItemLibrary['yk_di_bookPage'].value*100*(Math.round(10+get.rand(0,5))/10);
				else if(grade=='tiangrade') price=lib.yk_otherItemLibrary['yk_tian_bookPage'].value*150*(Math.round(10+get.rand(0,5))/10);
				else if(grade=='half-godgrade') price=lib.yk_otherItemLibrary['yk_tian_bookPage'].value*250*(Math.round(10+get.rand(0,5))/10);
				else if(grade=='godgrade') price=lib.yk_otherItemLibrary['yk_tian_bookPage'].value*400*(Math.round(10+get.rand(0,5))/10);
				price=price*(score/scoreList[grade]);
				if(lib.ykEquip[item]) price=price*Math.round(10+get.rand(-1,3))/10;
				if(lib.ykEquip[item]) image=(lib.ykEquip[item].image||(item+'.jpg'));
				else if(lib.ykBook[item]) image=(lib.ykBook[item].image||(item+'.jpg'));
				x={
					name:item,
					price:price,
					type:type,
					image:image,
				}
			}
			else{
				if(!lib.yk_otherItemLibrary[item]||(lib.yk_otherItemLibrary[item]&&!lib.yk_otherItemLibrary[item].value)){continue;}
				x={
					name:item,
					price:lib.yk_otherItemLibrary[item].value*(Math.round(10+get.rand(0,5))/10),
					type:'item',
					image:(lib.yk_otherItemLibrary[item].image||(item+'.jpg')),
				}
			}
			if(x) ps.push(x);
		}
		game.saveConfig('ykshoppingList_large_update',true);
		game.saveConfig('ykshoppingList_large',ps);
		if(lib.config.ykshoppingList_large.length>8) lib.config.ykshoppingList_large=lib.config.ykshoppingList_large.randomGets(8);
		game.saveConfig('ykshoppingList_large',lib.config.ykshoppingList_large);
		return lib.config.ykshoppingList_large;
	}
	window.yk_aucgetOriginPrice=function(pos){
		var priceO;
		for(var info of lib.config.ykAuctionOriginPriceList) if(info.pos==pos) priceO=Math.round(info.price);
		return (typeof priceO=='number'?priceO:'无');
	}
	window.ykauctionAddRecord=function(str,buyBool,name){
		if(!lib.config.ykauctionRecord){
			lib.config.ykauctionRecord={};
			if(!lib.config.ykauctionRecord.content) lib.config.ykauctionRecord.content=[];
			game.saveConfig('ykauctionRecord',{});
		}
		if(str=='请输入文字'&&window.ykauction_input){window.ykauction_input.value='';return ;}
		var item={
			name:(name||lib.config.connect_nickname),
			word:str,
			time:window.playTime.hours+':'+window.playTime.minutes+':'+window.playTime.seconds,
			buy:buyBool,
		};
		lib.config.ykauctionRecord.content.push(item);
		game.saveConfig('ykauctionRecord',lib.config.ykauctionRecord);
		window.ykauctionUpdateRecord();
	}
	window.ykauctionUpdateRecord=function(){
		if(!lib.config.ykauctionRecord){
			lib.config.ykauctionRecord={};
			if(!lib.config.ykauctionRecord.content) lib.config.ykauctionRecord.content=[];
			game.saveConfig('ykauctionRecord',{});
		}
		var str='';
		for(var item of lib.config.ykauctionRecord.content){
			if(item.word&&item.word.length){
				if(!item.buy) str+='<br><font color=orange><b>'+(item.name||'undefined')+'</b></font>&nbsp&nbsp&nbsp&nbsp<span style=\"color: #FF00FF;\">'+(item.time||'')+'</span><br><font color=black>'+(item.word||'')+'</font><br>';
				else str+='<br><font color=orange><b>'+(item.name||'undefined')+'</b></font><font color=black>'+(item.word||'')+'</font>&nbsp&nbsp&nbsp&nbsp<span style=\"color: #FF00FF;\">'+(item.time||'')+'</span><br>';
			}
		}
		if(str.length) str=str.slice(4,str.length-4);
		if(window.ykrecordBg&&window.ykrecordBgContent) window.ykrecordBgContent.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha">'+str+'</span>';
	}
	window.ykOpenAuction=function(){//拍卖会（上半场和下半场）
		if(!lib.config.ykshoppingList_large) game.saveConfig('ykshoppingList_large',[]);
		if(typeof window.ykcloseAuction=='function'){window.ykcloseAuction();return ;}
		//if(!window.playTime.days||!window.playTime.months||!window.playTime.years){alert('网络状况不佳或未连接网络');return ;}
		window.auctionArea=ui.create.div();
		window.auctionArea.style.cssText='height:100%;width:100%;left:0%;top:0%;background-color:black;z-index:99999;opacity:0.85;';
		document.body.appendChild(window.auctionArea);
		var title=ui.create.div();
		title.style.cssText='height:30px;width:100%;left:0%;top:0%;background-color:black;z-index:99999;text-align:center;';
		title.innerHTML='<span style="font-size:30px;font-weight:400;font-family:shousha"><b>九州易珍</b></span>';
		window.auctionArea.appendChild(title);
		var yk_characterEquipShowItemInfo2=function(div,itemname){
			if(!div) return ;
			if(itemname) div.itemname=itemname;
			var info=ui.create.div('.menu');
			info.style.transition='left 0s,top 0s,opacity .3s';
			info.style.width='312px';
			info.style['pointer-events']='none';
			info.style['text-align']='left';
			info.style.animation='fadeShow .3s';
			info.style['-webkit-animation']='fadeShow .3s';
			info.style['z-index']=999999;
			div.info=info;
			if(lib.device==undefined){
				div.onmouseover=function(){
					var info=this.info;
					info.innerHTML=(game.getItemInfo(this.itemname)||'暂无信息');
					ui.window.appendChild(info);
					info.hide();
					info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
					info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
					if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
						info.style.left='calc( 100% - 312px )';
						info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
					};
					if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
						info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
					};
					if(info.offsetTop<0){
						info.style.top='0px';
					};
					info.show();
				};
				div.onmousemove=function(){
					var info=this.info;
					info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
					info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
					if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
						info.style.left='calc( 100% - 312px )';
						info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
					};
					if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
						info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
					};
					if(info.offsetTop<0){
						info.style.top='0px';
					};
				};
				div.onmouseout=function(){
					var info=this.info;
					info.hide();
				};
			}
		}
		if(window.ykCheckAuctionOpen()=='deley'){
			if(!window.ykAuctionInterval) window.ykAuctionInterval=setInterval(function() {
				if(window.playTime.days==undefined||window.playTime.months==undefined||window.playTime.years==undefined||window.playTime.hours==undefined||window.playTime.minutes==undefined) return false;
				var hour=window.playTime.hours;
				if(!hour){alert('时间错误！');return ;}
				var minute=window.playTime.minutes;
				var second=window.playTime.seconds;
				var deadline=13;
				var seconds=60-second;
				var minutes=60-minute-(second>0?1:0);
				if(seconds==60){seconds=0;minutes++;}
				var hours=deadline-hour-(minute>0?1:0);
				if(minutes==60){minutes=0;hours++;}
				var div=ui.create.div();
				div.style.cssText='height:40px;width:500px;left:calc( 50% - 250px );top:calc( 50% - 20px );background-color:black;z-index:99999;text-align:center;';
				div.innerHTML='<span style="font-size:35px;font-weight:400;font-family:shousha"><b>距离下一场拍卖会开始剩余</span><br><span style="font-size:40px;font-weight:400;font-family:shousha">'+hours+':'+minutes+':'+seconds+'</b></span>';
				window.auctionArea.appendChild(div);
				if(!hours&&!minutes&&!seconds){
					clearInterval(window.ykAuctionInterval);
					window.ykOpenAuction();
					setTimeout(window.ykOpenAuction,500);
				}
			}, 1000);
		}
		else if(window.ykCheckAuctionOpen()){
			var itemList=window.ykgetAuctionItem();
			var list;
			if((window.playTime.hours>12&&itemList.length<4)||window.playTime.weekdays!=0||window.playTime.days>7){
				var div=ui.create.div();
				div.style.cssText='height:60px;width:500px;left:calc( 50% - 250px );top:calc( 50% - 20px );background-color:black;z-index:99999;text-align:center;';
				div.innerHTML='<span style="font-size:35px;font-weight:400;font-family:shousha"><b>当前未有正在进行的拍品！</b></span><br><small>仅在每个月的第一个周日开放，同时请确保网络连接正常！</small>';
				window.auctionArea.appendChild(div);
			}
			else if(window.playTime.hours<=12){
				list=itemList.slice(0,Math.min(4,itemList.length));
			}
			else{
				list=itemList.slice(4,Math.min(8,itemList.length));
			}
			if(list){
				window.ykAuctionItemShowInfo=function(div,pos,itemname){
					var infoa,grade;
					for(var info of lib.config.ykAuctionPriceList){
						if(info.pos==pos){
							infoa=info;
						}
					}
					div.innerHTML='起拍价：'+window.ykAbbreviation(window.yk_aucgetOriginPrice(pos))+'';
					var color='white';
					if(lib.ykEquip[itemname]) grade=lib.ykEquip[itemname].grade;
					else if(lib.ykBook[itemname]) grade=lib.ykBook[itemname].grade;
					else if(lib.yk_otherItemLibrary[itemname]) grade=lib.yk_otherItemLibrary[itemname].grade;
					if(grade=='fangrade') color='grey';
					else if(grade=='huanggrade') color='green';
					else if(grade=='xuangrade') color='cyan';
					else if(grade=='digrade') color='purple';
					else if(grade=='tiangrade') color='yellow';
					else if(grade=='half-godgrade') color='orange';
					else if(grade=='godgrade') color='red';
					div.innerHTML+='<br>物品名：【<font color='+color+'>'+get.translation(itemname)+'</font>】<br>';
					if(infoa.name=='无'&&!infoa.isMine) div.innerHTML+='当前暂无人出价！';
					else div.innerHTML+='【<b><span style=\"color: '+(infoa.isMine?'#00FF00':'#FFA500')+';\">'+infoa.name+'</span></b>】的出价：<b>'+infoa.price+'</b>';
					div.innerHTML+='<br>本场拍卖剩余时间&nbsp&nbsp'+window.ykAuctionItemShowTime();
				}
				if(!lib.config.ykAuctionPriceList){game.saveConfig('ykAuctionPriceList',[]);}
				if(!lib.config.ykAuctionOriginPriceList){game.saveConfig('ykAuctionOriginPriceList',[]);}
				window.divAuctionItemBg0=ui.create.div();
				window.divAuctionItemBg0.style.cssText='height:calc( 40% - 15px );width:35%;left:10%;top:30px;background-color:black;z-index:999;text-align:center;border: 2px solid white;';
				window.auctionArea.appendChild(window.divAuctionItemBg0);
				
				window.divAuctionItemBg1=ui.create.div();
				window.divAuctionItemBg1.style.cssText='height:calc( 40% - 15px );width:35%;left:55%;top:30px;background-color:black;z-index:999;text-align:center;border: 2px solid white;';
				window.auctionArea.appendChild(window.divAuctionItemBg1);
				window.divAuctionItemMyPrice1=ui.create.div();
				window.divAuctionItemMyPrice1.style.cssText='height:20px;width:100%;left:0%;bottom:40px;background-color:black;z-index:999;text-align:left;';
				window.divAuctionItemBg1.appendChild(window.divAuctionItemMyPrice1);
				
				window.divAuctionItemBg2=ui.create.div();
				window.divAuctionItemBg2.style.cssText='height:calc( 40% - 15px );width:35%;left:10%;top:calc( 55% + 15px );background-color:black;z-index:999;text-align:center;border: 2px solid white;';
				window.auctionArea.appendChild(window.divAuctionItemBg2);
				window.divAuctionItemMyPrice2=ui.create.div();
				window.divAuctionItemMyPrice2.style.cssText='height:20px;width:100%;left:0%;bottom:40px;background-color:black;z-index:999;text-align:left;';
				window.divAuctionItemBg2.appendChild(window.divAuctionItemMyPrice2);
				
				window.divAuctionItemBg3=ui.create.div();
				window.divAuctionItemBg3.style.cssText='height:calc( 40% - 15px );width:35%;left:55%;top:calc( 55% + 15px );background-color:black;z-index:999;text-align:center;border: 2px solid white;';
				window.auctionArea.appendChild(window.divAuctionItemBg3);
				window.divAuctionItemMyPrice3=ui.create.div();
				window.divAuctionItemMyPrice3.style.cssText='height:20px;width:100%;left:0%;bottom:40px;background-color:black;z-index:999;text-align:left;';
				window.divAuctionItemBg3.appendChild(window.divAuctionItemMyPrice3);
				
				for(var n=0;n<list.length;n++){
					var divm=ui.create.div();
					var color,info;
					info=(lib.ykEquip[list[n].name]||lib.ykBook[list[n].name]||lib.yk_otherItemLibrary[list[n].name]);
					if(info.grade=='fangrade') color='grey';
					else if(info.grade=='huanggrade') color='green';
					else if(info.grade=='xuangrade') color='cyan';
					else if(info.grade=='digrade') color='purple';
					else if(info.grade=='tiangrade') color='yellow';
					else if(info.grade=='half-godgrade') color='orange';
					else if(info.grade=='godgrade') color='red';
					divm.style.cssText='height:100px;width:100px;left:calc( 50% - 50px );top:0%;z-index:9999;border: 3px solid '+color+';';
					window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+list[n].image,divm,true,'100% 100%');
					window['divAuctionItemBg'+n].appendChild(divm);
					window['divAuctionItemBg'+n].style.border='2px solid orange';
					yk_characterEquipShowItemInfo2(divm,list[n].name);
					window['divAuctionItemBg'+n].content=list[n].name;
					var ok=ui.create.div('','<font color=black>竞拍</font>',function(){
						var priceO=window.yk_aucgetOriginPrice(this.pos);
						var price=isNaN(window.ykgetAuctionPriceOwnerInfo(this.pos,'price'))?window.yk_aucgetOriginPrice(this.pos):window.ykgetAuctionPriceOwnerInfo(this.pos,'price');
						window.ykblock=ui.create.div();
						window.ykblock.style.cssText='height:100%;width:100%;left:0%;top:0%;border-radius:8px;z-index:999999;';
						window.auctionArea.appendChild(window.ykblock);
						window.ykofferprice_dialog=ui.create.div();
						window.ykofferprice_dialog.style.cssText='height:300px;width:600px;left:calc( 50% - 300px );top:calc( 50% - 150px );background-color:black;border: 3px solid red;border-radius:8px;z-index:9999999;';
						window.auctionArea.appendChild(window.ykofferprice_dialog);
						var cancel=ui.create.div('','<font color=black>取消</font>',function(){
							window.ykblock.delete();
							window.ykofferprice_dialog.delete();
							delete window.ykofferprice_dialog;
							window.ykofferprice_dialog=undefined;
							window.ykblock.delete();
							delete window.ykblock;
							window.ykblock=undefined;
						});
						cancel.style.cssText='height:20px;width:40px;left:calc( 50% - 10px );top:calc( 100% - 40px );text-align:center;background-color:white;border-radius:4px;z-index:9999999;';
						window.ykofferprice_dialog.appendChild(cancel);
						window.yk_clickFK(cancel);
						window.acuPriceUpdate=function(num,pos){
							var isMine=window.ykgetAuctionPriceOwnerInfo(pos,'isMine');
							window.ykauctionPriceIntroduce.innerHTML='起拍价：<b>'+window.yk_aucgetOriginPrice(window.ykauctionPriceIntroduce.pos)+'铢</b><br>当前出价者：'+(window.ykgetAuctionPriceOwnerInfo(pos,'name')=='无'?'无':'【<b><span style=\"color: '+(isMine?'#00FF00':'#FFA500')+';\">'+window.ykgetAuctionPriceOwnerInfo(pos,'name')+'</span></b>】')+'<br>当前出价:'+(window.ykgetAuctionPriceOwnerInfo(pos,'price')=='无'?'无':window.ykgetAuctionPriceOwnerInfo(pos,'price')+'铢')+'</b>'+(num?('<br>当前选择价格：<b>'+num+'铢</b>'):'')+'<li>每次加价，均在当前价格的基础上增加5%的价格';
						}
						var add=ui.create.div('','<font color=black>加价</font>');
						add.onclick=function(){
							var num=Math.round(this.price*1.05);
							window.ykauctionPriceIntroduce.price=num;
							this.price=num;
							window.acuPriceUpdate(num,this.pos);
						};
						add.style.cssText='height:20px;width:40px;left:calc( 25% - 10px );top:calc( 100% - 40px );text-align:center;background-color:white;border-radius:4px;z-index:9999999;';
						add.price=price;
						add.pos=this.pos;
						window.ykofferprice_dialog.appendChild(add);
						window.yk_clickFK(add);
						
						var offer=ui.create.div('','<font color=black>出价</font>',function(){
							var price=this.parent.price;
							if(!game.ykCheckCoin(price)){alert('金铢数量不足，无法参与竞价此物品！');return ;}
							if(confirm('是否花费'+Math.round(price)+'铢出价【'+get.translation(this.name)+'】？（若竞价被超过则全数退还）')){
								game.ykChangeCoin(-price);
								var infox;
								var list=[];
								for(var info of lib.config.ykAuctionPriceList){
									if(info.pos!=this.pos) list.push(info);
									else infox=info;
								}
								infox.isMine=true;
								infox.price=Math.round(price);
								infox.name=lib.config.connect_nickname;
								list.push(infox);
								lib.config.ykAuctionPriceList=list;
								game.saveConfig('ykAuctionPriceList',lib.config.ykAuctionPriceList);
								offer.parent2.isMine=true;
								alert('竞价成功！');
								window['divAuctionItemMyPrice'+this.pos].innerHTML='<li>我的出价：'+price;
								var color='white';
								if(lib.ykEquip[this.name]) grade=lib.ykEquip[this.name].grade;
								else if(lib.ykBook[this.name]) grade=lib.ykBook[this.name].grade;
								else if(lib.yk_otherItemLibrary[this.name]) grade=lib.yk_otherItemLibrary[this.name].grade;
								if(grade=='fangrade') color='grey';
								else if(grade=='huanggrade') color='green';
								else if(grade=='xuangrade') color='cyan';
								else if(grade=='digrade') color='purple';
								else if(grade=='tiangrade') color='yellow';
								else if(grade=='half-godgrade') color='orange';
								else if(grade=='godgrade') color='red';
								window.ykAuctionSendInfomation('玩家<font color="#FFA500">'+lib.config.connect_nickname+'</font>'+(price>50000?'一掷千金，以':'以')+price+'铢的价格参与竞拍'+(['godgrade','half-godgrade'].indexOf(grade)!=-1?'云空大陆上的无上珍宝————':'')+'【<font color='+color+'>'+get.translation(this.name)+'</font>】'+(price>100000?'，被主持本次拍卖会的拍卖师惊为天人！':'！'));
								window.ykauctionAddRecord(''+(price>50000?'一掷千金，以':'以')+price+'铢的价格参与竞拍'+(['godgrade','half-godgrade'].indexOf(grade)!=-1?'云空大陆上的无上珍宝————':'')+'【<font color='+color+'>'+get.translation(this.name)+'</font>】',true);
							}
							window.ykblock.delete();
							window.ykofferprice_dialog.delete();
							delete window.ykofferprice_dialog;
							window.ykofferprice_dialog=undefined;
							window.ykblock.delete();
							delete window.ykblock;
							window.ykblock=undefined;
						});
						offer.style.cssText='height:20px;width:40px;left:calc( 75% - 10px );top:calc( 100% - 40px );text-align:center;background-color:white;border-radius:4px;z-index:9999999;';
						offer.parent=add;
						offer.name=this.name;
						offer.pos=this.pos;
						offer.parent2=this;
						window['ykauction_offerdiv_'+this.pos]=offer;
						if(!window.ykgetAuctionPriceOwnerInfo(this.pos,'isMine')) window.ykofferprice_dialog.appendChild(offer);
						window.yk_clickFK(offer);
						
						var color,info;
						info=(lib.ykEquip[this.name]||lib.ykBook[this.name]||lib.yk_otherItemLibrary[this.name]);
						if(info.grade=='fangrade') color='grey';
						else if(info.grade=='huanggrade') color='green';
						else if(info.grade=='xuangrade') color='cyan';
						else if(info.grade=='digrade') color='purple';
						else if(info.grade=='tiangrade') color='yellow';
						else if(info.grade=='half-godgrade') color='orange';
						else if(info.grade=='godgrade') color='red';
						var img=ui.create.div();
						img.style.cssText='height:75px;width:75px;left:calc( 50% - 37.5px );top:0%;border: 3px solid '+color+';';
						window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+this.image,img,true,'100% 100%');
						window.ykofferprice_dialog.appendChild(img);
						var tag=ui.create.div();
						tag.style.cssText='height:30px;width:30px;top:0%;left:0%;';
						window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+((this.grade=='godgrade'||this.grade=='half-godgrade')?'tiangrade':this.grade)+'.jpg',tag,true,"100% 100%");
						img.appendChild(tag);
						window.ykauctionPriceIntroduce=ui.create.div();
						window.ykauctionPriceIntroduce.style.cssText='height:calc( 100% - 95px );width:100%;top:75px;left:0%;';
						window.ykauctionPriceIntroduce.pos=this.pos;
						window.ykauctionPriceIntroduce.style['overflow-x']='hidden';
						window.ykauctionPriceIntroduce.style['overflow-y']='scroll';
						lib.setScroll(window.ykauctionPriceIntroduce);
						window.ykofferprice_dialog.appendChild(window.ykauctionPriceIntroduce);
						window.acuPriceUpdate(null,this.pos);
						if(window.ykgetAuctionPriceOwnerInfo(this.pos,'name')!=undefined&&window.ykgetAuctionPriceOwnerInfo(this.pos,'name')!='无') add.onclick();
					});
					ok.style.cssText='height:20px;width:40px;left:calc( 50% - 20px );bottom:0%;background-color:white;z-index:9999;text-align:center;border-radius:8px;';
					ok.pos=n;
					ok.name=list[n].name;
					ok.image=list[n].image;
					ok.grade=info.grade;
					var bool=true;
					var boolx=true;
					for(var info of lib.config.ykAuctionOriginPriceList) if(info.pos==n) bool=false;
					for(var info of lib.config.ykAuctionPriceList) if(info.pos==n) boolx=false;
					if(bool){
						var infox={
							itemname:list[n].name,//物品名
							name:'无',//出价者
							pos:n,
							price:list[n].price,
							date:window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days,
						}
						lib.config.ykAuctionOriginPriceList.push(infox);
						game.saveConfig('ykAuctionOriginPriceList',lib.config.ykAuctionOriginPriceList);
					}
					if(boolx){
						var infox={
							itemname:list[n].name,//物品名
							name:'无',//出价者
							pos:n,
							date:window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days,
						}
						lib.config.ykAuctionPriceList.push(infox);
						game.saveConfig('ykAuctionPriceList',lib.config.ykAuctionPriceList);
					}
					window['divAuctionItemBg'+n].appendChild(ok);
					window.yk_clickFK(ok);
					var tag=ui.create.div('');
					tag.style.cssText='height:50px;width:50px;top:0%;left:0%;';
					window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/'+((info.grade=='godgrade'||info.grade=='half-godgrade')?'tiangrade':info.grade)+'.jpg',tag,true,"100% 100%");
					tag.style['text-align']='left';
					divm.appendChild(tag);
					window['divAuctionItemMyPrice'+n]=ui.create.div();
					window['divAuctionItemMyPrice'+n].style.cssText='height:calc( 100% - 130px );width:100%;left:0%;top:105px;background-color:black;z-index:999;text-align:left;';
					window['divAuctionItemMyPrice'+n].item=list[n].name;
					window.ykAuctionItemShowInfo(window['divAuctionItemMyPrice'+n],n,list[n].name);
					window['divAuctionItemMyPrice'+n].style['overflow-x']='hidden';
					window['divAuctionItemMyPrice'+n].style['overflow-y']='scroll';
					lib.setScroll(window['divAuctionItemMyPrice'+n]);
					window['divAuctionItemBg'+n].appendChild(window['divAuctionItemMyPrice'+n]);
					if(!window.ykAuctionInterval) window.ykAuctionInterval=setInterval(function() {
						if(window.divAuctionItemMyPrice0) window.ykAuctionItemShowInfo(window.divAuctionItemMyPrice0,0,window.divAuctionItemMyPrice0.item);
						if(window.divAuctionItemMyPrice1) window.ykAuctionItemShowInfo(window.divAuctionItemMyPrice1,1,window.divAuctionItemMyPrice1.item);
						if(window.divAuctionItemMyPrice2) window.ykAuctionItemShowInfo(window.divAuctionItemMyPrice2,2,window.divAuctionItemMyPrice2.item);
						if(window.divAuctionItemMyPrice3) window.ykAuctionItemShowInfo(window.divAuctionItemMyPrice3,3,window.divAuctionItemMyPrice3.item);
						if(window.playTime.hours==12){
							clearInterval(window.ykAuctionInterval);
							window.ykOpenAuction();
							setTimeout(window.ykOpenAuction,500);
						}
					}, 1000);
				}
			}
		}
		else{
			var div=ui.create.div();
			div.style.cssText='height:60px;width:500px;left:calc( 50% - 250px );top:calc( 50% - 20px );background-color:black;z-index:99999;text-align:center;';
			div.innerHTML='<span style="font-size:35px;font-weight:400;font-family:shousha"><b>当前未有正在进行的拍品！</b></span><br><small>仅在每个月的第一个周日开放，同时请确保网络连接正常！</small>';
			window.auctionArea.appendChild(div);
		}
		//左下角放一个出价和聊天记录
		if(!lib.config.ykauctionRecord){
			lib.config.ykauctionRecord={};
			if(!lib.config.ykauctionRecord.content) lib.config.ykauctionRecord.content=[];
			game.saveConfig('ykauctionRecord',lib.config.ykauctionRecord);
		}
		if(lib.config.ykauctionRecord.days!=window.playTime.days||lib.config.ykauctionRecord.months!=window.playTime.months||lib.config.ykauctionRecord.years!=window.playTime.days){
			lib.config.ykauctionRecord.content=[];//[{name:'',word:'',time:'',},{},{}]
			lib.config.ykauctionRecord.days=window.playTime.days;
			lib.config.ykauctionRecord.months=window.playTime.months;
			lib.config.ykauctionRecord.years=window.playTime.days;
			if(!lib.config.ykauctionRecord) game.saveConfig('ykauctionRecord',lib.config.ykauctionRecord);
		}
		var record=ui.create.dialog('hidden');
		record.style.cssText='height:40px;width:80px;left:calc( 95% - 40px );top:calc( 90% - 20px );background-color:grey;z-index:999999999;';
		window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/auctionRecord.jpg',record,true,'100% 100%');
		record.style['box-shadow']='none';
		record.onclick=function(){
			if(window.ykrecordBg){window.ykrecordBg.delete();delete window.ykrecordBg;window.ykrecordBg=undefined;return ;}
			window.ykrecordBg=ui.create.div('.menu');
			window.ykrecordBg.style.cssText='height:472px;width:300px;left:5%;top:calc( 90% - 460px );opacity:0.9;z-index:99999999;';
			window.auctionArea.appendChild(window.ykrecordBg);
			window.ykrecordBgContent=ui.create.div('');
			window.ykrecordBgContent.style.cssText='height:450px;width:300px;left:0%;top:0%;';
			window.ykauctionUpdateRecord();
			window.ykrecordBgContent.style['overflow-x']='hidden';
			window.ykrecordBgContent.style['overflow-y']='scroll';
			lib.setScroll(window.ykrecordBgContent);
			window.ykrecordBg.appendChild(window.ykrecordBgContent);
			window.ykrecordBg.appendChild(ipt);
			ipt.add(window.ykauction_ipt);
			window.ykrecordBg.appendChild(send);
		}
		window.auctionArea.appendChild(record);
		var ipt=ui.create.dialog('hidden');
		ipt.classList.add('popped');
		ipt.style.cssText='height:22px;width:250px;left:0%;top:calc( 100% - 22px );z-index:99999;';
		window.ykauction_ipt=ui.create.div();
		window.ykauction_ipt.style.height='22px';
		window.ykauction_ipt.style.width='100%';
		window.ykauction_ipt.style.top='0px';
		window.ykauction_ipt.style.left='0px';
		window.ykauction_ipt.style.margin='0px';
		window.ykauction_ipt.style.borderRadius='0px';
		window.ykauction_ipt.style['background-image']='linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4))';
		//window.ykauction_ipt.style['box-shadow']='rgba(0, 0, 0, 0.4) 0 0 0 1px, rgba(0, 0, 0, 0.2) 0 3px 10px';
		if(window.ykauction_input&&window.ykauction_input.value) window.ykauction_input_value=window.ykauction_input.value;
		window.ykauction_ipt.innerHTML='<input type="text" value='+(window.ykauction_input_value||"请输入文字")+' style="color:black;font-family:shousha;width:calc(100% - 10px);text-align:left;"></input>';
		window.ykauction_input=window.ykauction_ipt.querySelector('input');
		window.ykauction_input.style.backgroundColor="white";
		window.ykauction_input.style['box-shadow']='none';
		window.ykauction_input.onclick=function(e){
			e.stopPropagation();
		};
		window.ykauction_input.onfocus=function(){
			if(this.value=='请输入文字') this.value='';
		};
		window.ykauction_input.onkeydown=function(e){
			e.stopPropagation();
			if(e.keyCode==13){
				var value=this.value;
				if(!value) return ;
				if(typeof value!='string') value=''+value;
				window.ykauctionAddRecord(value);
				window.ykauction_input.value='请输入文字';
			};
		};
		var send=ui.create.div('','',function(){
			window.ykauctionAddRecord(window.ykauction_input.value);
			window.ykauction_input.value='请输入文字';
		});
		send.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>发送</b></span>';
		send.style.cssText='height:22px;width:50px;left:250px;top:calc( 100% - 22px );z-index:99999;text-align:center';
		window.yk_clickFK(send);
		
		var funcAUC=function(){
			if(window.ykAuctionInterval){
				clearInterval(window.ykAuctionInterval);
				window.ykAuctionInterval=undefined;
			}
			window.auctionArea.delete();
			delete window.auctionArea;
			window.auctionArea=undefined;
			window.ykcloseAuction=undefined;
		}
		window.ykcloseAuction=funcAUC;
		var div=ui.create.div('.menubutton.round','×',function(){
			funcAUC();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['z-index']=99999;
		window.auctionArea.appendChild(div);
		window.yk_clickFK(div);
	}
});
