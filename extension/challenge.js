'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	lib.help['云空·挑战']='双方各选择至多5名角色入场，通过变换位置，使用技能和普通攻击击败敌方获得胜利（目前该模式仍在制作中，敬请期待！）';
	var httpRequest = new XMLHttpRequest();
	httpRequest.open("GET","https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/challengeContent.js",true);
	httpRequest.send(null);
	httpRequest.onreadystatechange=function(){
		if (httpRequest.readyState==4&&httpRequest.status==200){
			eval(httpRequest.responseText);
		}
	};
	game.addMode('ykChallenge',{
		start:function(){
			var httpRequest = new XMLHttpRequest();
			httpRequest.open("GET","https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/challengeContent.js",true);
			httpRequest.send(null);
			httpRequest.onreadystatechange=function(){
				if (httpRequest.readyState==4&&httpRequest.status==200){
					eval(httpRequest.responseText);
				}
			};
		},
	},{
		translate:'云空·挑战',
		extension:'云空',
		config:{
		},
	});
});
