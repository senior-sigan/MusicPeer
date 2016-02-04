(function($) {
  'use strict';
  $(document).ready(function() {
    var sound = null;
    var playing = false;

    function play(url, roomID) {
      if (sound) sound.stop();
      playing = false;
      sound = new Howl({
        urls: [url],
        loop: false,
        autoplay: false,
        onend: function() {
          console.log('Finished', url);
          playNext(roomID);
        }
      });
      sound.play();
      playing = true;
    }

    function playNext(roomID) {
      $.ajax({
        method: 'POST',
        url: '/room/'+roomID+'/next',
        success: function(data) {
          console.log(data);
          play(data.url, roomID);
        }
      });
    }

    $('#play').on('click', function() {
      var $this = $(this);
      var roomID = $this.data('room');
      if (sound) {
        if (playing) {
          playing = false;
          sound.pause();
        } else {
          playing = true;
          sound.play();
        }
        return;
      }
      $.ajax({
        method: 'GET',
        url: '/room/'+roomID+'/current',
        success: function(data) {
          console.log(data);
          play(data.url, roomID);
        }
      });
    });

    $('#next').on('click', function() {
      var $this = $(this);
      var roomID = $this.data('room');
      playNext(roomID);
    });
  });
})(jQuery);