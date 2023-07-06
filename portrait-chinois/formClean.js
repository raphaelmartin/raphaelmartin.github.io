formClean = function(){

	//Get all formClean
	allForm = $('.formClean');

	//Get length of each
	allForm.each(function( index ) {
		var current =1;
		var step=1;
		formNombreChamp = $( this ).find('.myView').children('div').length;
		champWidth =$( this ).find('.myView').children('div').width();

		//add progress divs
		$( this )
			.append( '<div class="progress"><span class="progressBar"></span></div><div class="step"><span class="current">'+current+'</span>/<span class="total">'+formNombreChamp+'</span></div>' )
			.css({overflow: 'hidden'});
		$( this ).find('.progressBar').css({width: (current/formNombreChamp)*100+'%'});

		//set form box
		$( this ).find('.myView').children('div').css({'float':'left'});
		$( this ).find('.myView').css({
			height: $( this ).find('.myView').children('div').height() + $( this ).find('.progress').height() + $( this ).find('.step').height()+40,
			width: champWidth*formNombreChamp,
			position:'absolute',
			top:0,
			left:0
		});

		$(this).find('input').each(function(){
			$(this).attr('data-step', step++);
			$(this).on( 'keydown', function( event ) {
				if ( event.which == 9 || event.which ==13) {
					event.preventDefault();
					if ($(this).val()==""){
						$(this).addClass('error');
					}else{
						moveNext();
					}
				}
			});
		});
		$('.btnNext').click(function(){
			moveNext();
		});
		$(':input').focus(function(){
			// var center = $(window).height()/2;
			// var top = $(this).offset().top ;
			// if (top > center){
			// 	$(window).scrollTop(top-center);
			// }
			$('.btnNext').toggleClass('active');

		}).blur(function(){
			$('.btnNext').toggleClass('active');
		});
		moveNext=function(){
			console.log(current);
			console.log(formNombreChamp);
			if(current!=formNombreChamp){
				$(this).children('div:first-child').animate({'left': -(champWidth*current)},500)
				current++;
				//$(this).find("input[data-step='"+current+"']").focus();
				$( this ).find('.progressBar').animate({width: (current/formNombreChamp)*100+'%'},500);
				$( this ).find('.current').html(current);
			}else{
				$( this ).submit();
			}
		}.bind(this);


	});

}