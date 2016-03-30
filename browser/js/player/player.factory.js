'use strict';

juke.factory('PlayerFactory', function($http, $rootScope){
  // non-UI logic in here
    var mod = function (num, m) { 
      return ((num % m) + m) % m; 
    }
    var skip = function(interval) {
      if (!currentSong) return;
      var index = currentSong.albumIndex;
      console.log("currentAlbum: ", currentAlbum)
      index = mod( (index + (interval || 1)), currentAlbum.length );
      playerObj.start(currentAlbum[index], currentAlbum);
    }
    var playerObj = {};
    var currentAlbum = null;
    var currentSong = null;
    var playing = false;
    var progress = 0;
    var audio = document.createElement('audio');
    audio.playbackRate = 40;
    
    audio.addEventListener('ended', function () {
      playerObj.next();
      $rootScope.$evalAsync(); // likely best, schedules digest if none happening
    });



    audio.addEventListener('timeupdate', function () {
      progress = 100 * audio.currentTime / audio.duration;
      // console.log(progress);
      $rootScope.$digest();
    });
	  playerObj.start = function(song, songList){
      this.pause();
      if (songList != null) {
        currentAlbum = songList;
        currentAlbum.forEach(function(song, index){
          song.albumIndex = index;
        });  
      }
      currentAlbum = songList;
      playing = true;
      currentSong = song;
      audio.src = song.audioUrl;
      audio.load();
      audio.play();
    },
    playerObj.pause = function(){
      audio.pause();
      playing = false;  
    },
    playerObj.resume = function(){
      playing = true;
      return audio.play();
    },
    playerObj.isPlaying = function(){
      return playing;
    },
    playerObj.getCurrentSong = function(){
      return currentSong;
    },
    playerObj.next = function(){
      audio.pause();
      skip(1);
    },
    playerObj.prev = function(){
      audio.pause();
      skip(-1);
    },
    playerObj.getProgress = function(){
      return progress;
      // $rootScope.$digest();
      // return  audio.currentTime / audio.duration;
    }
    return playerObj;
});

juke.factory('StatsFactory', function ($q) {
  var statsObj = {};
  statsObj.totalTime = function (album) {
    var audio = document.createElement('audio');
	  console.log("album", album)
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;
      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }
      audio.addEventListener('loadedmetadata', function () {
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    });
  };
  return statsObj;
});


juke.factory('AlbumFactory', function ($q, $http) {
  var albumObj = {};
  albumObj.fetchAll = function () {
    return $http.get('/api/albums');
  };

  albumObj.fetchById = function (albumId) {
    return $http.get('/api/albums/' + albumId);
  };

  return albumObj;
});  
 