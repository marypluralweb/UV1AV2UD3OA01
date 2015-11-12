// https://developers.google.com/youtube/iframe_api_reference

// global variable for the player
var player;

var _online = BasicGame.OfflineAPI.isVideoOnline();

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
  // create the global player from the specific iframe (#video)
  player = new YT.Player('video_on', {
    events: {
      // call this function when player is ready to use
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  
  // bind events
  var playButton = document.getElementById("play-button");
  playButton.addEventListener("click", function() {
    player.playVideo();
  });
  
  var pauseButton = document.getElementById("pause-button");
  pauseButton.addEventListener("click", function() {
    player.pauseVideo();
  });
  
}

function vidplay() {
   var video = document.getElementById("video_off");
   var button = document.getElementById("play");
   video.play();
}

function vidpause() {
   var video = document.getElementById("video_off");
   var button = document.getElementById("pause");
   video.pause();
}

function skipButton() {
  if(_online && player != null) {
    //console.log(player);
    player.stopVideo();
  }

  if(!_online) {
    var video = document.getElementById("video_off");
    if(video!=null) {
      video.pause();
    }
  }
  
  if(isFinalCinematic) {
    window.parent.location.href = URL_MAPA;
  } else {
    window.parent.game.state.states["Game"].hideVideo();
  }
}


function onPlayerStateChange(event) {
  if(event.data === 0) {
    if(isFinalCinematic) {
      window.parent.location.href = URL_MAPA;
    } else {
      window.parent.game.state.states["Game"].hideVideo();
    }
  }
}

if(_online) {
  var _url = URL_YOUTUBE;

  document.getElementById("video_on").src = _url;

  // Inject YouTube API script
  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

} else {
  var _url = URL_VIDEO;

  document.getElementById("video_off").src = _url;

  document.getElementById("video_off").addEventListener("ended", function() {
    if(isFinalCinematic) {
      window.parent.location.href = URL_MAPA;
    } else {
      window.parent.game.state.states["Game"].hideVideo();
    }
  });

}

var _elements = document.getElementsByClassName((_online ? "online" : "offline"));

for(var i = 0; i < _elements.length; i++) {
  _elements[i].style.display = "inline-block";
}






