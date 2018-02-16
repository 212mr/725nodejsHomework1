var led = false;
var motor = 0;
var light = false;

var computeAnnual = function( hourlyRate ) {
    return hourlyRate * 40 * 52;
};


require('mahrio').runServer(process.env,__dirname)
    .then( function(server){
        server.route({
            path:'/',
            method:'GET',
            handler:function(req,rep){
                rep('Hello World!');
            }
        });

        //Exercise One: Toggle LED
        server.route({
            path:'/led',
            method:'POST',
            handler:function(req,rep){//req.payload.led
                led =!!req.payload.led;
                // led = !led;
                console.log('LED State:' + led);
                rep({ledState:led});
            }
        });

        //Exercise Two: Toggle Motor Speed
        server.route({
            path:'/motor',
            method:['GET', 'POST'],
            handler:function(req,rep){
                motor = req.payload.motor;
                console.log('MOTOR State:' + motor);
                rep({motorState:motor});
            }
        });

        //Exercise Three: Control Incandescent Light
        server.route({
            path:'/light',
            method:'POST',
            handler:function(req,rep){
                var motion = req.payload.motion;
                var night = req.payload.night;
                if (motion == true && night == true) {
                    console.log('MOTION State:' + motion + ';NIGHT State:' + night);
                    rep("Light On");
                } else {
                    rep("set timeout to turn off in 5 seconds");
                }
            }
        });

        //Exercise Five: Calculator Function to Estimate Yearly Income
        server.route({
            path: '/estimate-annual-income',
            method: 'POST',
            handler: function(request, reply) {
                reply('Estimate annual income is: $' + computeAnnual(request.payload.hourly || 0));
            }
        });

        //M01 Homework: Calculator Function to Estimate Monthly Car Payment
        server.route({
            path: '/car-loan',
            method: 'POST',
            handler: function(req, rep) {
                var loanAmount = req.payload.loanAmount;
                var years = req.payload.years;
                var interestRate = req.payload.interestRate;
                rep('Estimated car loan monthly payment is: $' + (interestRate/1200 *loanAmount) / (1- Math.pow((1+interestRate/1200),(-years*12)))
                );}
        })



    });
//http://127.0.0.1:6085/
