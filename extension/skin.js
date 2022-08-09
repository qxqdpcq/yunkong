'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	if(!lib.qhlypkg){
		lib.qhlypkg = [];
	}
	var taici = {
		//原皮台词
		'qxq_dpcq_xiaoyan':{
			/*'lyzlongying':{
				order:1,
				content:'①银枪所至，千夫不敌！<br>②抽身而退，万军难挡！',
			},
			'lyzhunyou':{
				order:2,
				content:'①八方风雨，天涯何归？<br>②滴水不漏，稳若泰山！',
			},
			'lyzcuizhen':{
				order:3,
				content:'①无知小儿，先站稳阵脚再来吧！<br>②是谁给你的勇气，来跟本将军叫阵！',
			},
			'lyzchengyu':{
				order:4,
				content:'①一人一枪一匹马，疆场尽驰骋！<br>②龙升九天，马踏飞燕！',
			},
			'die':{
				content:'北伐大业未定，末将实难心安……',
			}*/
		},
	};
	var qhly_ykcharacter={
		isExt:true,//是否是扩展，一般填true
		filterCharacter:function(name){
			return name.indexOf('qxq_') == 0;//判断此ID的武将是否属于此皮肤包
		},
		characterNameTranslate:function(name){
			//这里根据武将ID返回其中文名字。
			return get.translation(name);
		},
		hideSkin:function(name,skin){
			var earseExt = function(path){
				var foundDot = path.lastIndexOf('.');
				if(foundDot < 0)return path;
				return path.slice(0,foundDot);
			};
			if(!this.skininfo[earseExt(skin)]){
				return true;
			}
		},
		characterTaici:function(name){
			//这里返回武将原皮台词。
			return taici[name];
		},
		originSkinInfo:function(name){
			var info = {
				//'lyz_yjlgt':'技能审核及武将配音：遗计两个桃<br>本配音独家授权“斗破苍穹X阴阳师”，禁止未经作者允许以任何形式转载、编辑、盗取此配音用作任何其他用途。',
			};
			return info[name];
		},
		characterInfo:function(name){
			//这里可以返回角色资料。如不返回则显示get.characterIntro(name)。
		},
		prefix:'extension/云空/', //原皮前缀，标识原皮肤的位置。        
		skin:{
			standard:'extension/云空/',//可切换普通皮肤的前缀
		},
		audioOrigin:'extension/斗破苍穹X阴阳师/audio/',//原技能配音位置
		audio:'extension/斗破苍穹X阴阳师/skin/audio/',//切换皮肤后的技能配音位置
		skininfo:{
			//皮肤台词
			//小乔
			'qxq_yk_xiaoqiao_huanhongzhuang':{
				level:"精品",
				skinName2:'huanhongzhuang',
				translation:"【新春·唤红妆】",
				info:"",
				order:1,//显示顺序，号越小越前面。
				skill:{
					'yktianxiang':{
						order:1,
						content:'',
					},
					'ykzhuyan':{
						order:2,
						content:'',
					},
					'ykpiaoling':{
						order:3,
						content:'',
					},
					'die':{
						content:'',
					}
				}
			},
			'qxq_yk_xiaoqiao_yixianglvren':{
				level:"精品",
				skinName2:'yixianglvren',
				translation:"【异乡旅人】",
				info:"",
				order:2,//显示顺序，号越小越前面。
				skill:{
					'yktianxiang':{
						order:1,
						content:'',
					},
					'ykzhuyan':{
						order:2,
						content:'',
					},
					'ykpiaoling':{
						order:3,
						content:'',
					},
					'die':{
						content:'',
					}
				}
			},
			'qxq_yk_xiaoqiao_chunricaizhuang':{
				level:"精品",
				skinName2:'chunricaizhuang',
				translation:"【春日彩妆】",
				info:"",
				order:3,//显示顺序，号越小越前面。
				skill:{
					'yktianxiang':{
						order:1,
						content:'',
					},
					'ykzhuyan':{
						order:2,
						content:'',
					},
					'ykpiaoling':{
						order:3,
						content:'',
					},
					'die':{
						content:'',
					}
				}
			},
			'qxq_yk_xiaoqiao_jindengyezhu':{
				level:"精品",
				skinName2:'jindengyezhu',
				translation:"【锦灯夜烛】",
				info:"",
				order:4,//显示顺序，号越小越前面。
				skill:{
					'yktianxiang':{
						order:1,
						content:'',
					},
					'ykzhuyan':{
						order:2,
						content:'',
					},
					'ykpiaoling':{
						order:3,
						content:'',
					},
					'die':{
						content:'',
					}
				}
			},
			//魇梦月见
			'qxq_yk_yanmengyuejian_heizhishi':{
				level:"精品",
				skinName2:'heizhishi',
				translation:"【黑执事】",
				info:"",
				order:1,//显示顺序，号越小越前面。
				skill:{
					'yktianxiang':{
						order:1,
						content:'',
					},
					'ykzhuyan':{
						order:2,
						content:'',
					},
					'ykpiaoling':{
						order:3,
						content:'',
					},
					'die':{
						content:'',
					}
				}
			},
			'qxq_yk_yanmengyuejian_zhumengzhe':{
				level:"史诗",
				skinName2:'zhumengzhe',
				translation:"【逐梦者】",
				info:"",
				order:1,//显示顺序，号越小越前面。
				skill:{
					'yktianxiang':{
						order:1,
						content:'',
					},
					'ykzhuyan':{
						order:2,
						content:'',
					},
					'ykpiaoling':{
						order:3,
						content:'',
					},
					'die':{
						content:'',
					}
				}
			},
			//空山泠雪
			'qxq_yk_kongshanlingxue_zhijianren':{
				level:"精品",
				skinName2:'zhijianren',
				translation:"【执剑人】",
				info:"",
				order:1,//显示顺序，号越小越前面。
				skill:{
					'yktianxiang':{
						order:1,
						content:'',
					},
					'ykzhuyan':{
						order:2,
						content:'',
					},
					'ykpiaoling':{
						order:3,
						content:'',
					},
					'die':{
						content:'',
					}
				}
			},
			//茯苓
			'qxq_yk_fuling_churuhongchen':{
				level:"史诗",
				skinName2:'churuhongchen',
				translation:"【初入红尘】",
				info:"",
				order:1,//显示顺序，号越小越前面。
				skill:{
					'yktianyi':{
						order:1,
						content:'',
					},
					'ykwuji':{
						order:2,
						content:'',
					},
					'die':{
						content:'',
					}
				}
			},
			//天
			'qxq_yk_tian_huayanxiaozhu':{
				level:"普通",
				skinName2:'huayanxiaozhu',
				translation:"【花颜晓主·天】",
				info:"",
				order:1,//显示顺序，号越小越前面。
				skill:{
					'fazetianding':{
						order:1,
						content:'',
					},
					'tiandaowuchang':{
						order:2,
						content:'',
					},
					'shengmieshenyu':{
						order:3,
						content:'',
					},
					'die':{
						content:'',
					}
				}
			},
			'qxq_yk_tian_guanghanzhexian':{
				level:"史诗",
				skinName2:'guanghanzhexian',
				translation:"【广寒谪仙·天】",
				info:"",
				order:2,//显示顺序，号越小越前面。
				skill:{
					'fazetianding':{
						order:1,
						content:'',
					},
					'tiandaowuchang':{
						order:2,
						content:'',
					},
					'shengmieshenyu':{
						order:3,
						content:'',
					},
					'die':{
						content:'',
					}
				}
			},
			//命运
			'qxq_yk_mingyun_moouyuezhang':{
				level:"精品",
				skinName2:'moouyuezhang',
				translation:"【魔偶乐章·命运】",
				info:"",
				order:1,//显示顺序，号越小越前面。
				skill:{
					'skillname':{
						order:1,
						content:'',
					},
					'die':{
						content:'',
					}
				}
			},
		}
	};
	for(var i in qhly_ykcharacter.skininfo){
		lib.translate[qhly_ykcharacter.skininfo[i].skinName2]=qhly_ykcharacter.skininfo[i].translation;
	}
	lib.qhlypkg.push(qhly_ykcharacter);
});