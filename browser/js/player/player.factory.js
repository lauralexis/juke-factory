'use strict';

juke.factory('PlayerFactory', function(){
  // non-UI logic in here
 return {
	  start: function(song){
	  	$http.get('song.audioUrl')
	  	.then(function(response){
	  		return response.data;
	  	})
	  }	
 	}
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
  //   return $q(function (resolve, reject) {
  //     var sum = 0;
  //     var n = 0;
  //     function resolveOrRecur () {
  //       if (n >= album.songs.length) resolve(sum);
  //       else audio.src = album.songs[n++].audioUrl;
  //     }
  //   //   audio.addEventListener('loadedmetadata', function () {
  //   //     sum += audio.duration;
  //   //     resolveOrRecur();
  //   //   });
  //   //   resolveOrRecur();
  //   // });
  // };  