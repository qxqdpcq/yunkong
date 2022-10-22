'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	//---------------------------------云空武将评级----------------------------//
	var A_Array=[],S_Array=[],SS_Array=[],SSS_Array=[];
	for(var character in lib.config.qxq_YK_person.rank){
		if(lib.config.qxq_YK_person.rank[character].indexOf('天级')!=-1||lib.config.qxq_YK_person.rank[character].indexOf('超稀-限定')!=-1) SSS_Array.push(character);
		else if(lib.config.qxq_YK_person.rank[character].indexOf('地级')!=-1) SS_Array.push(character);
		else if(lib.config.qxq_YK_person.rank[character].indexOf('玄级')!=-1) S_Array.push(character);
		else A_Array.push(character);
	}
	//黄级、凡级
	lib.rank.rarity.junk.addArray(A_Array);
	//玄级
	lib.rank.rarity.rare.addArray(S_Array);
	//地级
	lib.rank.rarity.epic.addArray(SS_Array);
	//天级、超稀
	lib.rank.rarity.legend.addArray(SSS_Array);
});
