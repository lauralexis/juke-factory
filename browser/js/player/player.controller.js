'use strict';

juke.controller('PlayerCtrl', function ($scope, $rootScope, PlayerFactory) {
  $scope.playing = function(){
    return PlayerFactory.isPlaying();
  }
  $scope.currentSong = function(){
    return PlayerFactory.getCurrentSong();
  }
  // initialize audio player (note this kind of DOM stuff is odd for Angular)
  // var audio = document.createElement('audio');
  // audio.addEventListener('ended', function () {
  //   $scope.next();
  //   // $scope.$apply(); // triggers $rootScope.$digest, which hits other scopes
  //   $scope.$evalAsync(); // likely best, schedules digest if none happening
  // });
  // audio.addEventListener('timeupdate', function () {
  //   $scope.progress = 100 * audio.currentTime / audio.duration;
  //   // $scope.$digest(); // re-computes current template only (this scope)
  //   $scope.$evalAsync(); // likely best, schedules digest if none happening
  // });
  $scope.progress = function() {
    return PlayerFactory.getProgress();
  } 
  // state
  // $scope.currentSong;
  // $scope.playing = false;

  // // main toggle
  // $scope.toggle = function (song) {
  //   if ($scope.playing) $rootScope.$broadcast('pause');
  //   else $rootScope.$broadcast('play', song);
  // };
  // main toggle
  $scope.toggle = function (song) {
    console.log("song: ", song)
    if (PlayerFactory.isPlaying() && song === PlayerFactory.getCurrentSong()) {
      // $rootScope.$broadcast('pause');
      PlayerFactory.pause();
    } else if (!PlayerFactory.isPlaying() && song !== PlayerFactory.getCurrentSong()){
      PlayerFactory.start(song, songList);
    } else if (PlayerFactory.isPlaying() && song !== PlayerFactory.getCurrentSong()){
        PlayerFactory.start(song, songList);
    } else {
      PlayerFactory.resume();
    }
    //else $rootScope.$broadcast('play', song);
  };

  // incoming events (from Album or toggle)
  // $scope.$on('pause', pause);
  // $scope.$on('play', play);

  // functionality
  // function pause () {
  //   audio.pause();
  //   $scope.playing = false;
  // }
  // function play (event, song){
  //   // stop existing audio (e.g. other song) in any case
  //   pause();
  //   $scope.playing = true;
  //   // resume current song
  //   if (song === $scope.currentSong) return audio.play();
  //   // enable loading new song
  //   $scope.currentSong = song;
  //   audio.src = song.audioUrl;
  //   audio.load();
  //   audio.play();
  // }

  // outgoing events (to Album… or potentially other characters)
  // $scope.next = function () { pause(); $rootScope.$broadcast('next'); };
  // $scope.prev = function () { pause(); $rootScope.$broadcast('prev'); };
   $scope.next = function next () { PlayerFactory.next()};
   $scope.prev = function prev () { PlayerFactory.prev() };

});




juke.controller('SideBarCtrl', function ($scope, $rootScope, PlayerFactory) {
  $scope.viewAlbums = function() {
    $rootScope.$broadcast('showAllAlbums');
  }

});

