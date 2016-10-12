var fs = require( 'fs' );
var natural = require( 'natural' );
var TfIdf = natural.TfIdf;
var stop = require( './../data/stop.json' );

var clusters = [ '0', '1', '2', '3', '4', '5' ];

var clusterData = {};

clusters.forEach( function ( id ) {

	var tfidf = new TfIdf();

	tfidf.addFileSync( './data/txt/cluster-' + id + '.txt' );

	var documents = Object.keys( tfidf.documents[0] ).map( function ( d ) {
		if ( d !== '__key' ) {
			return { word: d, count: tfidf.documents[0][d] };
		}
	} );

	documents.sort( function ( a, b ) { return a.count < b.count ? 1 : -1 } );

	var top = [];
	var count = 0;

	documents.forEach( function ( d ) {
		if ( d && d.word && stop.indexOf( d.word ) === -1 && count < 50 ) {
			count++;
			top.push( d );
		}
	} );

	clusterData[id] = top;
} );

fs.writeFile( './data/json/clusters.json', JSON.stringify( clusterData, null, 2 ), function ( error ) {
	console.log( error ? error : 'file written.' );
} );

