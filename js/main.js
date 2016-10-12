var colors = {
	green: {
		dark: d3.rgb( '#3A4445' ),
		medium: d3.rgb( '#A0B1B2' ).darker(),
		light: d3.rgb( '#A0B1B2' ),
		extralight: d3.rgb( '#C9CCCD' )
	},
	blue: {
		dark: d3.rgb( '#5A76A8' ).darker(),
		medium: d3.rgb( '#5A76A8' ),
		light: d3.rgb( '#788AB5' ),
		extralight: d3.rgb( '#B4BBD5' )
	},
	purple: {
		dark: d3.rgb( '#6D658D' ).darker(),
		medium: d3.rgb( '#6D658D' ),
		light: d3.rgb( '#938BAA' ),
		extralight: d3.rgb( '#C0BCCD' )
	},
	red: {
		dark: d3.rgb( '#9F746E' ).darker(),
		medium: d3.rgb( '#9F746E' ),
		light: d3.rgb( '#AE8983' ),
		extralight: d3.rgb( '#D0BBB6' )
	},
	pink: {
		dark: d3.rgb( '#C58B9C' ).darker(),
		medium: d3.rgb( '#C58B9C' ),
		light: d3.rgb( '#D3A5B1' ),
		extralight: d3.rgb( '#DEC1C8' )
	},
	yellow: {
		dark: d3.rgb( '#B1AF76' ).darker(),
		medium: d3.rgb( '#B1AF76' ),
		light: d3.rgb( '#BFBC8C' ),
		extralight: d3.rgb( '#DCD9C0' )
	}
};

var topicMap = {
	"0": "Foreign policy/national security",
	"1": "Trump&rsquo;s taxes",
	"2": "The candidates&rsquo; personalities",
	"3": "Rape",
	"4": "The liberal media",
	"5": "Guns"
};

var colorMap = {
	"0": "green",
	"1": "blue",
	"2": "purple",
	"3": "red",
	"4": "pink",
	"5": "yellow"
};

var clusterFiles = [
	'data/json/clusters-0.json',
	'data/json/clusters-1.json',
	'data/json/clusters-2.json',
	'data/json/clusters-3.json',
	'data/json/clusters-4.json',
	'data/json/clusters-5.json'	
];

Promise.all( clusterFiles.map( function ( clusterFile ) {
	d3.json( clusterFile, function ( response ) {
		return response;
	} );
} ) ).then( function () {

} );

d3.json( 'data/rep.json', function ( repResponse ) {

	d3.json( 'data/json/clusters.json', function ( clustersResponse ) {

		var data = {};
		repResponse.forEach( function ( d ) {
			data[Object.keys( d )[0]] = d[Object.keys( d )[0]];
		});

		var clusterIds = Object.keys( data );
		clusterIds.sort();

		d3.select( '#cluster-dropdown' ).selectAll( 'p.dropdown-item' )
			.data( clusterIds )
			.enter()
			.append( 'p' )
			.classed( 'dropdown-item', true )
			.html( function ( d ) { return topicMap[d]; } )
			.on( 'click', function ( e ) {

				var clusterId = d3.select( this ).datum();

				d3.select( 'svg' ).remove();

				var clusterData = { word: '', children: clustersResponse[clusterId] };

				var size = $( window ).height() - 160

				var svg = d3.select( '#word-cloud-immediate-wrapper' ).append( 'svg' );
				svg.attr( 'width', size )
				svg.attr( 'height', size );

				var pack = d3.pack()
					.padding( 5 )
					.size( [ size, size ] );

				var clusterData = d3.hierarchy( clusterData )
					.sum( function ( d ) { return d.count } )
					.sort( function ( a, b ) { return b.value - a.value } );

				var descendants =  pack( clusterData ).descendants().filter( function ( d ) { return !d.children } );

				var min = d3.min( descendants, function ( d ) { return d.value } );
				var max = d3.max( descendants, function ( d ) { return d.value } );

				var colorScale = d3.scaleLinear()
					.domain( [ min, max ] )
					.range( [ colors[colorMap[clusterId]].extralight, colors[colorMap[clusterId]].dark ] )
					.interpolate( d3.interpolateRgb );

				var fontSizeScale = d3.scaleLinear()
					.domain( [ min, max ] )
					.range( [ 7, 20 ] );

				var node = d3.select( 'svg' ).selectAll( '.node' )
					.data( descendants )
					.enter()
					.append( 'g' )
					.classed( 'node', true )
					.attr( 'transform', function ( d ) {
						return 'translate(' + d.x + ',' + d.y + ')';
					} );

				node.append( 'circle' )
					.attr( 'r', function ( d ) {
						return d.r === size / 2 ? 0 : d.r;
					} )
					.style( 'fill', function ( d ) {
						return colorScale( d.value );
					} );

				node.append( 'text' )
					.text( function ( d ) { return d.data.word } )
					.style( 'font-size', function ( d ) { return fontSizeScale( d.value ) } )
					.attr( 'text-anchor', 'middle' );

				$( '#tweets-wrapper' ).remove();
				d3.select( '#viz-wrapper' ).select( '.col-sm-12' ).append( 'div' ).attr( 'id', 'tweets-wrapper' );

				d3.select( '#current-cluster' ).html( topicMap[clusterId] );

				var tweetIds = data[clusterId].map( function ( d ) {
					return Object.keys( d )[0];
				} );
				Promise.all( tweetIds.map( function ( id, i ) {
					var tweetWrapper = document.createElement( 'div' );
					tweetWrapper.classList.add( 'tweet-wrapper' )
					document.getElementById( 'tweets-wrapper' ).appendChild( tweetWrapper );
					return twttr.widgets.createTweet( id, tweetWrapper, {} );
				} ) ).then( function () {
					$( '#tweets-wrapper' ).masonry( {
						itemSelector: '.tweet-wrapper',
						columnWidth: $( '.tweet-wrapper' ).width()
					} );
				} );
			} );

	} );

} );