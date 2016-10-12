var natural = require( 'natural' ),
	TfIdf = natural.TfIdf,
	tfidf = new TfIdf();

tfidf.addFileSync( './data/txt/cluster-1.txt' );

var documents = Object.keys( tfidf.documents[0] ).map( function ( d ) {
	if ( d !== '__key' ) {
		return { word: d, count: tfidf.documents[0][d] };
	}
} );

documents.sort( function ( a, b ) { return a.count < b.count ? 1 : -1 } );

console.log( documents.slice( 0, 100 ) );
// console.log( tfidf.documents.sort( function ( a, b ) { return a}) );