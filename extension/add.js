'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	//防止反复加载
	if(window.ykloadJSON_add) return ;
	window.ykloadJSON_add=true;
	var dpcqyys_getGroupnature=get.groupnature;
	get.groupnature=function(group,method){
		var nature=dpcqyys_getGroupnature(group,method);
		if(method!='raw') nature=nature.slice(0,nature.length-2);
		if(group=='qxq_dpcq') nature='qxq_dpcq';
		if(group=='qxq_yys') nature='qxq_yys';
		if(group=='qxq_yk') nature='qxq_yk';
		if(method=='raw') return nature;
		return nature+'mm';
	};
	var style2=document.createElement('style');
	style2.innerHTML="";
	style2.innerHTML+="div[data-nature='qxq_dpcqmm'],";
	style2.innerHTML+="span[data-nature='qxq_dpcqmm'] {-webkit-animation: rainBowText 4s linear infinite;animation: rainBowText 4s linear infinite;}";
	style2.innerHTML+="div[data-nature='qxq_yysmm'],";
	style2.innerHTML+="span[data-nature='qxq_yysmm'] {-webkit-animation: rainBowText 4s linear infinite;animation: rainBowText 4s linear infinite;}";
	style2.innerHTML+="div[data-nature='qxq_ykmm'],";
	style2.innerHTML+="span[data-nature='qxq_ykmm'] {-webkit-animation: rainBowText 4s linear infinite;animation: rainBowText 4s linear infinite;}";
	document.head.appendChild(style2);
	var style=document.createElement('style');
	style.innerHTML+='@keyframes rainBowText {'+
	'0% {text-shadow: black 0 0 1px,rgb(255, 0, 0) 0 0 2px,rgb(255, 0, 0) 0 0 5px,rgb(255, 0, 0) 0 0 10px,rgb(255, 0, 0) 0 0 10px;}'+
	'14.3% {text-shadow: black 0 0 1px,rgb(255, 165, 0) 0 0 2px,rgb(255, 165, 0) 0 0 5px,rgb(255, 165, 0) 0 0 10px,rgb(255, 165, 0) 0 0 10px;}'+
	'28.6% {text-shadow: black 0 0 1px,rgb(255, 255, 0) 0 0 2px,rgb(255, 255, 0) 0 0 5px,rgb(255, 255, 0) 0 0 10px,rgb(255, 255, 0) 0 0 10px;}'+
	'42.9% {text-shadow: black 0 0 1px,rgb(0, 255, 0) 0 0 2px,rgb(0, 255, 0) 0 0 5px,rgb(0, 255, 0) 0 0 10px,rgb(0, 255, 0) 0 0 10px;}'+
	'57.2% {text-shadow: black 0 0 1px,rgb(0, 0, 255) 0 0 2px,rgb(0, 0, 255) 0 0 5px,rgb(0, 0, 255) 0 0 10px,rgb(0, 0, 255) 0 0 10px;}'+
	'71.5% {text-shadow: black 0 0 1px,rgb(6，82，121) 0 0 2px,rgb(6，82，121) 0 0 5px,rgb(6，82，121) 0 0 10px,rgb(6，82，121) 0 0 10px;}'+
	'85.8% {text-shadow: black 0 0 1px,rgb(128, 0, 128) 0 0 2px,rgb(128, 0, 128) 0 0 5px,rgb(128, 0, 128) 0 0 10px,rgb(128, 0, 128) 0 0 10px;}'+
	'100% {text-shadow: black 0 0 1px,rgb(255, 0, 0) 0 0 2px,rgb(255, 0, 0) 0 0 5px,rgb(255, 0, 0) 0 0 10px,rgb(255, 0, 0) 0 0 10px;}'+
	'}';
	document.head.appendChild(style);
});