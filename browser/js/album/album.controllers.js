'use strict';

var juke = angular.module('juke', []);

juke.controller('AlbumCtrl', function($scope, $rootScope, $log, $q, StatsFactory, AlbumFactory, PlayerFactory) {
  $scope.playing = function(){
    return PlayerFactory.isPlaying();
  }
  $scope.currentSong = function(){
    return PlayerFactory.getCurrentSong();
  }
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
  .catch($log.error); 

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
  };

  function pause () {
    PlayerFactory.pause();
  }

  function play (song, songList) {
    PlayerFactory.start(song, songList)
  };

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
  $rootScope.$on('showAllAlbums', function() {
    $scope.showAll = true;
  });
});

