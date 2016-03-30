'use strict';

var juke = angular.module('juke', []);

juke.controller('AlbumCtrl', function($scope, $rootScope, $log, $q, StatsFactory, AlbumFactory, PlayerFactory) {
  $scope.playing = function(){
    return PlayerFactory.isPlaying();
  }
  $scope.currentSong = function(){
    return PlayerFactory.getCurrentSong();
  }
  // load our initial data
  AlbumFactory.fetchAll()
  .then(function (res) { return res.data; })
  .then(function (albums) {
    return AlbumFactory.fetchById(albums[0]._id); // temp: get one
  })
  .then(function (res) { return res.data })
  .then(function (album) {
    album.imageUrl = '/api/albums/' + album._id + '.image';
    album.songs.forEach(function (song, i) {
      song.audioUrl = '/api/songs/' + song._id + '.audio';
      song.albumIndex = i;
    });
    $scope.album = album;
    StatsFactory.totalTime($scope.album)
    .then(function(albumDuration){
      $scope.totalTime = albumDuration;
    })
  })
  .catch($log.error); // $log service can be turned on and off; also, pre-bound

  // main toggle
  $scope.toggle = function (song) {
    console.log("PlayerFactory: ", PlayerFactory)
    if (PlayerFactory.isPlaying() && song === PlayerFactory.getCurrentSong()) {
      // $rootScope.$broadcast('pause');
      PlayerFactory.pause();
    } else if (!PlayerFactory.isPlaying() && song !== PlayerFactory.getCurrentSong()){
      PlayerFactory.start(song, $scope.album.songs);
    } else if (PlayerFactory.isPlaying() && song !== PlayerFactory.getCurrentSong()){
        PlayerFactory.start(song, $scope.album.songs);
    } else {
      PlayerFactory.resume();
    }
    //else $rootScope.$broadcast('play', song);
  };

  // incoming events (from Player, toggle, or skip)
  // $scope.$on('pause', pause);
  // $scope.$on('play', play);
  // $scope.$on('next', next);
  // $scope.$on('prev', prev);

  // functionality
  function pause () {
    //$scope.playing = false;
    PlayerFactory.pause();
  }
  // function play (event, song) {
  //   $scope.playing = true;
  //   $scope.currentSong = song;
  // };
  function play (song, songList) {
    PlayerFactory.start(song, songList)
  };

  // // a "true" modulo that wraps negative to the top of the range
  // function mod (num, m) { return ((num % m) + m) % m; };

  // // jump `interval` spots in album (negative to go back, default +1)
  // function skip (interval) {
  //   if (!$scope.currentSong) return;
  //   var index = $scope.currentSong.albumIndex;
  //   index = mod( (index + (interval || 1)), $scope.album.songs.length );
  //   $scope.currentSong = $scope.album.songs[index];
  //   // if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  // };
  // function next () { skip(1); };
  // function prev () { skip(-1); };
    function next () { PlayerFactory.next()};
    function prev () { PlayerFactory.prev() };
});


juke.controller('AlbumsCtrl', function($scope, $rootScope, $log, $q, AlbumFactory) {
  AlbumFactory.fetchAll()
  .then(function (res) { return res.data; })
  .then(function (albums) {
    $scope.albums = albums;
    console.log("$scope.albums: ", $scope.albums);
  });
  $scope.returnUrl = function(album){
    return '/api/albums/' + album._id + '.image';
  }
});

