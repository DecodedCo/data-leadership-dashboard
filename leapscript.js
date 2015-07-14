// Create a Leap controller so we can emit gesture events
var controller = new Leap.Controller( { enableGestures: true } );

// Emit gesture events before emitting frame events
controller.addStep( function( frame ) {
  ;

// Begin injected loop protection init
var __DECODED_TIMER_1c = Date.now();
var __DECODED_ITERATIONS_1c = 0;
// End injected loop protection init

for ( var g = 0; g < frame.gestures.length; g++ ) {
    var gesture = frame.gestures[g];
    controller.emit( gesture.type, gesture, frame );;

// Begin injected loop protection
++__DECODED_ITERATIONS_1c;
if ((__DECODED_ITERATIONS_1c > 50) && (Date.now() - __DECODED_TIMER_1c > 100)) {
  if (confirm("Uh oh! Looks like you've got an infinite loop on line 6. Do you want to stop it?")) {
    break;
  } else {
    __DECODED_TIMER_1c = Date.now();
    __DECODED_ITERATIONS_1c = 0;
  }
};
// End injected loop protection

  }
  return frame; // Return frame data unmodified
});

// Swipe gesture event listener
controller.on( 'swipe', function( swipe, frame ) {
  if (swipe.state == 'start' || swipe.state == 'stop') {
    var dir = swipe.direction;
    var dirStr = dir[0] > 0.8 ? 'right' : dir[0] < -0.8 ? 'left'
               : dir[1] > 0.8 ? 'up'    : dir[1] < -0.8 ? 'down'
               : dir[2] > 0.8 ? 'backward' : 'forward';
    console.log(dirStr);
    if(dirStr=="right"){
      //$('#dashboard').hide();
      $("body").css("background", "yellow");
    } else {
      //$('#dashboard').show();
      $("body").css("background", "red");
    }
  }
});

// Start listening for frames
controller.connect();