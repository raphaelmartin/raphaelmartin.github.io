$(document).ready(function() {
	$('#mail').attr('href', 'mailto:itsraphaelmartin@gmail.com');

	var tl = new TimelineMax();
	tl.from('img', 1, {'top': $(window).innerHeight()+10});
	tl.from('h1', 1, {'opacity': 0});
	tl.from('p', 1, {'opacity': 0});

	TweenMax.allFrom('.social', 1, {'bottom': -100}, .2);
});