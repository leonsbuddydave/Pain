var requestAnimationFrame =
	window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame;

Sheets = angular.module('Sheets', []);

$(function() {
	$(window).trigger("resize");
});