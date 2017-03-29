var video,
    play,
    rewind,
    stop,
    forward,
    currentTime,
    duration,
    volume,
    muted,
    volRocker,
    fullscreen,
    seekBar,
    duration,
    isVideoInFullScreen;

var videoLink = 'video/oceans.mp4';
var videoPoster = 'img/oceanimage.png';
document.addEventListener("DOMContentLoaded", initializePlayer());

function initializePlayer(){

    video = document.getElementById("firstVideo");
    play = document.getElementById("play");
    rewind = document.getElementById("rewind");
    stop = document.getElementById("stopPlay");
    forward = document.getElementById("fastFwd");
    currentTime = document.getElementById("currentTime");
    durationTime = document.getElementById("duration");
    volume=document.getElementsByClassName("volume")[0];
    muted=document.getElementById('muted');
    volRocker=document.getElementById("volRocker");
    fullscreen=document.getElementsByClassName("fullscreen")[0];
    seekBar=document.getElementById("timeBar");
    loader=document.getElementById("loader");
    isVideoInFullScreen = false;

  //Adding eventListeners
    video.addEventListener('click',vidPlay);
    video.addEventListener('dblclick',toggleFull);
    video.addEventListener('loadedmetadata',setDurationTime);
    video.addEventListener('timeupdate',updateCurrentTime);
    video.addEventListener('ended',stopPlay);
    play.addEventListener('click',vidPlay);
    play.addEventListener('rewind',skipPlay(-10));
    play.addEventListener('stop',stopPlay);
    play.addEventListener('forward',skipPlay(-10));
    play.addEventListener('click',vidPlay);
    muted.addEventListener('click',mute);
    volRocker.addEventListener('change',setVol);
    fullscreen.addEventListener('click',toggleFull);
    seekBar.addEventListener('change',dragSeekbar);
    video.addEventListener('canplay', vanishLoader, false);
    video.addEventListener('waiting',bringLoader);
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchMove, false);

    $('#firstVideo').bind("contextmenu",function(){
        return false;
        });

}

// Play and pause function
    function vidPlay() {
      if (video.paused) {
          video.play();
        play.classList.remove("glyphicon-pause") ;
        play.classList.add("glyphicon-pause") ;
       } else {
          video.pause();
          play.classList.add("glyphicon-pause") ;
          play.classList.remove("glyphicon-pause") ;
       }
    }
    // Stop function
    function stopPlay() {
        video.currentTime = 0;
        video.pause();
        if(play.classList.contains("glyphicon-pause")){
          play.classList.remove("glyphicon-pause") ;
        }
        else if (play.classList.contains("glyphicon-pause")){
          play.classList.remove("glyphicon-play") ;
        }
        play.classList.add("glyphicon-play") ;

    }
    // Forward and Rewind function
    function skipPlay(value) {
        video.currentTime += value;
    }

    //get HTML5 video time duration
    function setDurationTime() {
         duration = Math.round(video.duration);
         var minute = Math.floor(duration / 60);
         var second = Math.floor(duration % 60);
         if(second<10){
           second='0'+second;
         }
         durationTime.innerHTML = minute+':'+second;
    }

    //update HTML5 video current play time
    function updateCurrentTime() {
        if(video.currentTime < 0){
          video.currentTime=0;
        }
         var current = Math.round(video.currentTime);
         var minute = Math.floor(current / 60);
         var second = Math.floor(current % 60);
         if(second<10){
           second='0'+second;
         }
         currentTime.innerHTML = minute+':'+second;
        moveSeekBar();
    }

    //update HTML5 video current play time
    function moveSeekBar() {
        var currentPos = video.currentTime; //Get currenttime
        var percentage = 100 * currentPos / duration; //in %
        $('#timeBar').val(percentage);
    }

    //Mute/Unmute control clicked
    function mute() {
      if(!video.muted){
        video.muted = true;
        muted.classList.remove("glyphicon-volume-up") ;
        muted.classList.add("glyphicon-volume-off") ;
        volRocker.style.opacity='0.3'
        volRocker.disabled=true;
      } else {
          video.muted = false;
        muted.classList.add("glyphicon-volume-up") ;
        muted.classList.remove("glyphicon-volume-off") ;
          volRocker.style.opacity='1';
          volRocker.disabled=false;
      }
    }


    function setVol(){
      console.log('chng');
      var setValue = this.value/100;
      video.volume= setValue;

      if(setValue === 0){
        mute();
      }
      else if(setValue > 0){
        video.muted = false;
        if(muted.classList.contains("glyphicon-volume-off")){
          muted.classList.remove("glyphicon-volume-off") ;
        }
        muted.classList.add("glyphicon-volume-up") ;
      }
    }


    function requestFullScreen() {

      var el = document.body;

      // Supports most browsers and their versions.
      var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen
      || el.mozRequestFullScreen || el.msRequestFullScreen;

      if (requestMethod) {

        // Native full screen.
        requestMethod.call(el);

      }

      document.getElementsByClassName('video-wrapper')[0].classList.add('go-full-screen-video-wrapper');
      document.getElementById('firstVideo').classList.add('go-full-screen-video');
      document.getElementsByClassName('control-bar')[0].classList.add('go-full-screen-cotrols');
      document.getElementsByClassName('fullscreen')[0].classList.remove('glyphicon-fullscreen');
      document.getElementsByClassName('fullscreen')[0].classList.add('glyphicon-resize-full');
      isVideoInFullScreen = true;
      // alert("press enter");
    }

	if (document.addEventListener)
{
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}

function exitHandler()
{
    if (!document.webkitIsFullScreen && !document.mozFullScreen && document.msFullscreenElement == null)
    {
         cancelFullScreen(document);
    }
}

    function cancelFullScreen(el) {
          var requestMethod = el.cancelFullScreen||el.webkitCancelFullScreen||el.mozCancelFullScreen||el.exitFullscreen;
          if (requestMethod) { // cancel full screen.
              requestMethod.call(el);
          }

          document.getElementsByClassName('video-wrapper')[0].classList.remove('go-full-screen-video-wrapper');
          document.getElementById('firstVideo').classList.remove('go-full-screen-video');
          document.getElementsByClassName('control-bar')[0].classList.remove('go-full-screen-cotrols');
          document.getElementsByClassName('fullscreen')[0].classList.add('glyphicon-fullscreen');
          document.getElementsByClassName('fullscreen')[0].classList.remove('glyphicon-resize-full');
          isVideoInFullScreen = false;
      }

    function toggleFull() {
            var elem = document.body; // Make the body go full screen.
              var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||  (document.mozFullScreen || document.webkitIsFullScreen);


              if( isInFullScreen) {
                   cancelFullScreen(document);
               } else {
                   requestFullScreen(elem);
               }
                return false;
        }
      // --------cancel full screen-------------
       $(document).keydown(function(e) {
        //  console.log(e.which);
          var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||  (document.mozFullScreen || document.webkitIsFullScreen);
        //  console.log(e);
         if (e.keyCode === 27) {
           console.log("is video in fullscreen"+isVideoInFullScreen);
           cancelFullScreen(document);
         }
    });

$(".video-wrapper").mousemove(function(){
  $(".control-bar").css({"opacity":"1"});

});

function isMobile (window) {
    var nVer = navigator.appVersion;
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);
    window.jscd = {
      mobile: mobile,
  };
    return jscd.mobile;

}

document.addEventListener("visibilitychange", function() {
  //console.log( document.visibilityState);
  if(document.visibilityState=="hidden" && !video.paused){
    //console.log("minimized");
    vidPlay();
  }
});

function dragSeekbar(){
   var recentTime= Math.round(video.currentTime);
   var Time= Math.round(video.duration);
   var percent=$('#timeBar').val();
   var value=(percent*Time)/100;

   if(value<recentTime){
     video.currentTime = value;
   }
}

  window.addEventListener("keydown",function(e){
          if(e.keyCode==32){
            vidPlay();
          }
          if (e.ctrlKey === true && e.keyCode ===37 ) {
           skipPlay(-10);
          }
          if (e.ctrlKey === true && e.keyCode ===39 ) {
             skipPlay(10);
          }

  });

function vanishLoader() {//displays controls when image is loaded
    console.log('Buffering stopped');
    //buttonbar.style.opacity='1';
    loader.style.display='none';
}

function bringLoader() {
  console.log('buffering');
  loader.style.display='block';
}

video.addEventListener('ended',function(){
  video.load();
});
//------------------------------slide to skip --------------------

function handleTouchStart(event) {
    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
};

function handleTouchMove(event) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = event.changedTouches[0].clientX;
    var yUp = event.changedTouches[0].clientY;

    var xDiff = Math.ceil(xDown - xUp);
    var yDiff = Math.ceil(yDown - yUp);

    if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
        skipPlay(-(xDiff / 15));

    } else {
        if (yDiff > 0) {
            //console.log("left up");
        } else {
            //console.log("left down");
        }
    }
    / reset values /
    xDown = null;
    yDown = null;
};
