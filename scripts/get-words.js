var fs = require( 'fs' );
var stem = require( 'stem-porter' );

var all = require( './../data/all.json' );

var data = {};

var clusterIds = Object.keys( all );
clusterIds.sort();

var words = {};

clusterIds.forEach( function ( id ) {
	var tweetText = all[id].map( function ( d ) {
		return d[Object.keys( d )[0]];
	} ).reduce( function ( previous, current ) {
		return previous + ' ' + current;
	} );
	words[id] = tweetText.split( ' ' );
	var clean = '';
	words[id].forEach( function ( word, i ) {
		console.log( 'Working on cluster ' + id + ': ' + i + '/' + words[id].length );
		var cleanWord = word.toLowerCase();
		if (
			cleanWord &&
			cleanWord.indexOf( '#' ) === -1 &&
			cleanWord.indexOf( 'http://' ) === -1 &&
			cleanWord.indexOf( 'https://' ) === -1 &&
			cleanWord.indexOf( '@' ) === -1
		) {
			cleanWord = cleanWord.replace(/[^0-9a-z]/gi, '');
			clean += cleanWord + ' ';
		}
	} );
	words[id] = clean;
} );

Object.keys( words ).forEach( function ( index ) {

	fs.writeFile( './data/txt/cluster-' + index + '.txt', words[index], function ( error ) {
		console.log( error ? error : 'Cluster ' + index + ' file written.' );
	} );

} );