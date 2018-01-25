function request( url ) {

    return new Promise( function ( resolve, reject ) {

        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function(e) {

            if (xhr.readyState === 4) {

                if (xhr.status === 200) {
                   resolve( xhr.response );
                } else {
                    reject(xhr.status);
                }
            }
        };

        xhr.ontimeout = function () {
            reject('timeout');
        };

        xhr.open( 'get', url, true );

        xhr.send();
    });
}

function getTrade () {

    return new Promise( function ( resolve, reject ) {

        setTimeout( function () {

            resolve({

                price: '1265.99'

            });

        }, 200);

    });
}

async function listHistoricalData () {

    const historicalData = await request( './BTC-historical-data.json' );

    return JSON.parse( historicalData );
}

function ticker () {

    let idx = 0;
    const data = listHistoricalData();

    return {

        get () {

            var tick = data[ idx ];

            idx++;

            return tick;

        }

    };
} 

async function priceChecker ( stopAtPercentage ) {

    let lastPrice;
    let trade = await getTrade();

    return {

        /**
         * @param { { date: number, open: number, close: number, high: number, low: number, marketCap: number, volume: number } } candle
         */

        shouldSell ( candle ) {
            let sell = false;

            if ( lastPrice === undefined || candle.close > trade.price ) { 
                return false; 
            }
            
            if ( candle.close <= lastPrice ) {
                var diff = 100 - ( lastPrice * 100 ) / lastPrice;
                
                if ( diff >= stopAtPercentage ) {
                    sell = true;
                }
            }

            lastPrice = candle.close;

            return sell;
        }
    };
}

function run () {
    const data = listHistoricalData();
    const tk = ticker();
    const pc = priceChecker( 5 );
    
    var timer = setTimeout( function () {
        let closePrice = tk.get();

        if ( !(!!closePrice) ) { return; }

        if ( pc.shouldSell( closePrice ) ) {
            // @TODO Implement sell
        }
    }, 1000 );
}
