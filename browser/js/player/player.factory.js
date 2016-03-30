'use strict';

juke.factory('PlayerFactory', function($http){
  // non-UI logic in here
    var mod = function (num, m) { 
      return ((num % m) + m) % m; 
    }
    var skip = function(interval) {
      if (!currentSong) return;
      var index = currentSong.albumIndex;
      index = mod( (index + (interval || 1)), currentAlbum.length );
      playerObj.start(currentAlbum[index]);
    }
    var playerObj = {};
    var currentAlbum = null;
    var currentSong = null;
    var playing = false;
    var audio = document.createElement('audio');
    //audio.on('update', function(event) {
      //progress = audio.currentTime / audio.Duration;
    //})
    //var progress = 0;
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
    playerObj.previous = function(){
      audio.pause();
      skip(-1);
    },
    playerObj.getProgress = function(){
      if(!currentSong) {
        return 0;
      }
      return  audio.currentTime / audio.duration;
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
 