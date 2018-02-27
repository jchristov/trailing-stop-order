export default {
    checkArgs ( args: string[] ) {
    
        args.forEach( ( arg ) => {
            const supplied = [];
    
            arg.split( '-' ).forEach( ( element ) => {
                supplied.push( element.split( '=' )[ 0 ] );
            });
    
            if ( supplied.length === 1 && supplied[ 0 ] === 'i' ) { return; }
    
            if ( 
                supplied.indexOf( 'p' ) === -1
                || supplied.indexOf( 'b' ) === -1
                || supplied.indexOf( 'l' ) === -1
            ) {
                throw new Error( 'Required params missing. Check "p" (pair), "b" (buyPrice), "l" (loss tolerance)' );
            }
        });

    },

    getArgs ( args: string[] ) {
        // [ 
        //     "e=binance",
        //     "i=30m",
        //     "p=DASHBTC-b=0.068408-i=15m-l=0.2",
        //     "p=LTCBTC-b=0.008408-i=30m-l=0.2"
        // ]

        let params = [];
        let interval: string = null;
        let exchange: string = null;
        let iIndex = args.findIndex( ( element ) => {
            return element.indexOf( 'i=' ) !== -1;
        });
        let eIndex = args.findIndex( ( element ) => {
            return element.indexOf( 'e=' ) !== -1;
        });
    
        if ( iIndex !== -1 ) {
            interval = args.splice( iIndex, 1 )[ 0 ].split( '=' )[ 1 ];
        }

        if ( eIndex !== -1 ) {
            exchange = args.splice( eIndex, 1 )[ 0 ].split( '=' )[ 1 ];
        }
    
        args.forEach( ( arg: string ) => {
            const obj = {
                pair: null,
                buyPrice: null,
                lossTolerance: null
            };
    
            arg.split( '-' ).forEach( ( item ) => {
                item.split( '=' ).forEach( ( a, index, arr ) => {
                    if ( index === 1 ) { return; }
    
                    switch ( a ) {
                        case 'p':
                            obj.pair = arr[ 1 ];
                            break;
                        case 'b':
                            obj.buyPrice = +arr[ 1 ];
                            break;
                        default:
                            obj.lossTolerance = +arr[ 1 ];
                            break;
                    }
                });
            });
    
            params.push( obj );
    
        });
    
        return {
            exchange,
            interval,
            params
        };
    },

    getWrapper ( name: string ) {
        return require( `./wrappers/${name}-wrapper` ).default;
    }
}