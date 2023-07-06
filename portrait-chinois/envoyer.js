    //your return key link
    var ret = document.getElementById("returnkey")

    //handling key presses
    document.addEventListener( 'keydown', function(ev){ if (ev.keyCode || ev.which == 13) {
              //trigger a click event on the link if enter pressed
                ret.click(); } }, false );

    //handle the click event on the link
    ret.addEventListener( 'click', handler, false);


 function handler(ev) {
  ev.stopPropagation();
    ev.preventDefault();
   //call next question function
   //self._nextQuestion();

   alert(" you clicked me ");

}