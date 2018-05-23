
// http://johnny-five.io/examples/lcd/
// http://johnny-five.io/examples/servo/
// https://mahr.io/tutorial/read-button-using-johnny-five-and-arduino
// https://github.com/rwaldron/johnny-five/wiki/Servo


//**** stepper is on
// Digital 10 < -- > IN1
// Digital 11 < -- > IN3
// Digital 12 < -- > IN2
// Digital 13 < -- > IN4
// ** LCD: 7 6 5 4 3 2
// ** button: pin 9 works
// ** water TEMP old: A0 works with out resistance OLD
//** water Temp DS18B20: pin 8 need resistance, is working DS18B20
//** servo pin: 12


var five = require("johnny-five"),
    board,
    //temp,
    //current,
    // thermometer,
    //stepper,
    button,
    servo,
    lcd;



var directionCw = true;


board = new five.Board();

board.on("ready", function() {

    //temp = new five.Pin("A0");


    lcd = new five.LCD({
        pins: [7,6,5,4,3,2],
        backlight: 6,
        rows: 2,
        cols: 20
    });

    button = new five.Button({
        pin: 9,
        isPullup: true
        //with out resistance on board
    });



    var servo = new five.Servo({
        //id: "MyServo",     // User defined id
        pin: 12,           // Which pin is it attached to?
        //type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
        type: "continuous", //* for CW
        //range: [0,180],    // Default: 0-180
        //fps: 100,          // Used to calculate rate of movement between positions
        // invert: false,     // Invert all specified positions
         //startAt: 0,       // Immediately move to a degree
        // center: true,      // overrides startAt if true and moves the servo to the center of the range
    });

    setInterval(function () {

        //servo.move( 180 );
        //servo.sweep();
        // * Stop driving after 3 seconds
        // * http://johnny-five.io/examples/servo-drive/
        // this.wait(3000, function() {
        //     servo.stop();
        // });

        if( directionCw ) {
            servo.cw(2);
            console.log("servo CW");
        } else {
            servo.ccw(2);
            console.log("servo CCW");
        }
        directionCw = !directionCw;


        // servo.move( 0 );
        // console.log("servo 0");

    }, 5000);

    // *5000 for every 5 seconds
    // *1000 * 3600 * 24 for every24 hours



    var count = 0;
    button.on("press", function() {
        //calcTemp();
        count++;
        console.log('btn pressed ' + count.toString());


        var pin = 8;
        board.firmata = board.io;
        board.firmata.sendOneWireConfig(pin, true);
        board.firmata.sendOneWireSearch(pin, function(error, devices) {
            if(error) {
                console.error(error);
                return;
            }

            // * only interested in the first device
            var device = devices[0];

            var readTemperature = function() {
                // led.on();

                // *start transmission
                board.firmata.sendOneWireReset(pin);

                // *a 1-wire select is done by ConfigurableFirmata
                board.firmata.sendOneWireWrite(pin, device, 0x44);

                // *the delay gives the sensor time to do the calculation
                board.firmata.sendOneWireDelay(pin, 1000);

                // *start transmission
                board.firmata.sendOneWireReset(pin);

                // *tell the sensor we want the result and read it from the scratchpad
                board.firmata.sendOneWireWriteAndRead(pin, device, 0xBE, 9, function(error, data) {
                    if(error) {
                        //console.error(error);
                        return;
                    }
                    var raw = (data[1] << 8) | data[0];
                    var celsius = raw / 16.0;
                    var fahrenheit = celsius * 1.8 + 32.0;

                    console.info('celsius', celsius);
                    console.info('fahrenheit', fahrenheit);
                    // updateLed(celsius, led)
                    // led.off();

                    //*show on LCD
                    lcd.cursor(1, 0).print( `Water :${fahrenheit} ` );
                    //console.log("LCD water temp");
                });
            };
            // *read the temperature now
            readTemperature();
            // *and every 1 second
            //setInterval(readTemperature, 5000);


        });

    });

    this.repl.inject({
        lcd: lcd,
        //stepper: stepper,
        button: button,
        servo: servo
    });

});

