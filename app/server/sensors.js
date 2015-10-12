// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
    if (Sensors.find().count() === 0) {
        var data = [{
            name: "Sensor 1",
            typeSensor: "sensor1"
        }, {
            name: "Sensor 2",
            typeSensor: "sensor2"
        }/*, {
            name: "Sensor 3",
            typeSensor: "sensor3"
        }, {
            name: "Sensor 4",
            typeSensor: "sensor4"
        }, {
            name: "Sensor 5",
            typeSensor: "sensor5"
        }, {
            name: "Sensor 6",
            typeSensor: "sensor6"
        }, {
            name: "Sensor 7",
            typeSensor: "sensor7"
        }, {
            name: "Sensor 8",
            typeSensor: "sensor8"
        }, {
            name: "Sensor 9",
            typeSensor: "sensor9"
        }, {
            name: "Sensor 10",
            typeSensor: "sensor10"
        }, {
            name: "Sensor 11",
            typeSensor: "sensor11"
        }, {
            name: "Sensor 12",
            typeSensor: "sensor12"
        }, {
            name: "Sensor 13",
            typeSensor: "sensor13"
        }, {
            name: "Sensor 14",
            typeSensor: "sensor14"
        }, {
            name: "Sensor 15",
            typeSensor: "sensor15"
        }, {
            name: "Sensor 16",
            typeSensor: "sensor16"
        }, {
            name: "Sensor 17",
            typeSensor: "sensor17"
        }, {
            name: "Sensor 18",
            typeSensor: "sensor18"
        }, {
            name: "Sensor 19",
            typeSensor: "sensor19"
        }, {
            name: "Sensor 20",
            typeSensor: "sensor20"
        }, {
            name: "Sensor 21",
            typeSensor: "sensor21"
        }, {
            name: "Sensor 22",
            typeSensor: "sensor22"
        }, {
            name: "Sensor 23",
            typeSensor: "sensor23"
        }, {
            name: "Sensor 24",
            typeSensor: "sensor24"
        }, {
            name: "Sensor 25",
            typeSensor: "sensor25"
        }, {
            name: "Sensor 26",
            typeSensor: "sensor26"
        }, {
            name: "Sensor 27",
            typeSensor: "sensor27"
        }, {
            name: "Sensor 28",
            typeSensor: "sensor28"
        }, {
            name: "Sensor 29",
            typeSensor: "sensor29"
        }, {
            name: "Sensor 30",
            typeSensor: "sensor30"
        }*/];

        function getRandomValue() {
            return Math.floor(Math.random() * 10) * 5;
        };

        var timestamp = (new Date()).getTime();        

        _.each(data, function(list) {
          var sensor_id = Sensors.insert({
              name: list.name,
              typeSensor: list.typeSensor
          });

          _.each(list, function() {
            var cont = 1;
            Meteor.setInterval(function () {
              Metrics.insert({
                  sensorId: sensor_id,
                  value: getRandomValue(),
                  typeSensor: list.typeSensor,
                  createdAt: new Date(timestamp)
              });
              timestamp += 1; // ensure unique timestamp.
              console.log(list.typeSensor, cont);
              cont += 1; 
            }, 1000); 
          });
        });

    }
});