Template.senseChart.created = function () {
    var self = this;

    var sensors = [{
        _id: 0,
        name: 'Sensor 1', // Get value from form element
        sensorId: 'sensor1',
        color: 'Blue'
    }, {
        _id: 1,
        name: 'Sensor 2', // Get value from form element
        sensorId: 'sensor2',
        color: 'Black'
    }, {
        _id: 2,
        name: 'Sensor 3', // Get value from form element
        sensorId: 'sensor3',
        color: 'Green'
    }, {
        _id: 3,
        name: 'Sensor 4', // Get value from form element
        sensorId: 'sensor4',
        color: 'Orange'
    }];

    self.seriesSensors = new ReactiveVar(sensors);

    //Filter
    self.filterSerie1 = new ReactiveVar('sensor1');
    self.filterSerie2 = new ReactiveVar('sensor2');
    self.filterSerie3 = new ReactiveVar('sensor3');
    self.filterSerie4 = new ReactiveVar('sensor4');

    self.editSensor = new ReactiveVar({});
};

Template.senseChart.helpers({
    listSensors: function () {
        return Template.instance().seriesSensors.get();
    },
    Sensors: function () {
        return Sensors.find({});
    },
    editSensor: function () {
      return Template.instance().editSensor.get();
    }
});


Template.senseChart.rendered = function () {
    var self = this;
    builtColumn();

    self.autorun(function () {
        updateChart();
    });
};


Template.senseChart.events = {

    'change #reactive': function (event, template) {
        var newValue = $(event.target).val();
        Session.set('reactive', parseInt(newValue));
    },

    'submit #edit-sensor': function (event, template) {
        event.preventDefault();

        var sensor = {
            _id: Template.instance().editSensor.get()._id,
            name: event.target.name.value, // Get value from form element
            color: event.target.color.value,
            sensorId: event.target.sensors.value
        };

        var listSensors = Template.instance().seriesSensors.get();
        listSensors[sensor._id] = sensor;
        Template.instance().seriesSensors.set(listSensors);

        switch(sensor._id){
          case "0":
            Template.instance().filterSerie1.set(sensor.sensorId)
          break;
          case "1":
            Template.instance().filterSerie2.set(sensor.sensorId)
          break;
          case "2":
            Template.instance().filterSerie3.set(sensor.sensorId)
          break;
          case "3":
            Template.instance().filterSerie4.set(sensor.sensorId)
          break;
        };

        editAxis(sensor);
        editSerie(sensor);
        builtColumn();

        event.target.name.value = "";
        event.target.color.value = "";
    },

    'click #edit': function (event, template) {
        var self  = this;
        var sensor = {
          name: self.name,
          color: self.color,
          sensorId: self.sensorId,
          _id: self._id
        }

        console.log(Template.instance().seriesSensors.get()[sensor._id]);
        Template.instance().editSensor.set(sensor);
    }
};

var seriesList = [{
    name: 'Sensor 1',
    type: 'spline',
    data: [],
    yAxis: 1,
    tooltip: {
        valueSuffix: ' mm'
    }
}, {
    name: 'Sensor 2',
    type: 'spline',
    yAxis: 2,
    data: [],
    tooltip: {
        valueSuffix: ' mb'
    }
}, {
    name: 'Sensor 1',
    type: 'spline',
    data: [],
    yAxis: 3,
    tooltip: {
        valueSuffix: ' mm'
    }
}, {
    name: 'Sensor 1',
    type: 'spline',
    data: [],
    tooltip: {
        valueSuffix: ' mm'
    }
}] ;

var listYAxis = [{ // 1 yAxis
    labels: {
        format: '{value}°C',
        style: {
            color: '#0000FF'
        }
    },
    title: {
        text: 'Sensor 1',
        style: {
            color: '#0000FF'
        }
    }
}, { // 2 yAxis
    gridLineWidth: 0,
    title: {
        text: 'Sensor 2',
        style: {
            color: '#0066FF'
        }
    },
    labels: {
        format: '{value} mm',
        style: {
            color: '#0066FF'
        }
    }
}, { // 3 yAxis
    gridLineWidth: 0,
    title: {
        text: 'Sensor 3',
        style: {
            color: '#00CCFF'
        }
    },
    labels: {
        format: '{value} mb',
        style: {
            color: '#00CCFF'
        }
    },
    opposite: true
}, { // 4 yAxis
    gridLineWidth: 0,
    title: {
        text: 'Sensor 4',
        style: {
            color: '#000000'
        }
    },
    labels: {
        format: '{value}°C',
        style: {
            color: '#000000'
        }
    },
    opposite: true
}];

function editAxis(axis){
  listYAxis[axis._id].title.text = axis.name;
};

function editSerie(serie){
  seriesList[serie._id].name = serie.name;
};

function updateChart() {
    if (typeof (chartSensers) !== 'undefined') {
        //Sensor 1
        Metrics.find({
            typeSensor: Template.instance().filterSerie1.get()
        }).observe({
            added: function (metric) {
                if (chartSensers.series.length > 0) {
                    var series = chartSensers.series[0],
                        shift = series.data.length > 20; // shift if the series is 
                    // longer than 20

                    var point = {
                        x: metric.createdAt,
                        y: metric.value
                    };
                    // add the point
                    chartSensers.series[0].addPoint(point, true, shift);
                };

            }
        });

        //sensor 2
        Metrics.find({
            typeSensor: Template.instance().filterSerie2.get()
        }).observe({
            added: function (metric) {
                if (chartSensers.series.length > 0) {
                    var series = chartSensers.series[1],
                        shift = series.data.length > 20; // shift if the series is 
                    // longer than 20

                    var point = {
                        x: metric.createdAt,
                        y: metric.value
                    };
                    // add the point
                    chartSensers.series[1].addPoint(point, true, shift);
                };
            }
        });

        //sensor 3
        Metrics.find({
            typeSensor: Template.instance().filterSerie3.get()
        }).observe({
            added: function (metric) {
                if (chartSensers.series.length > 0) {
                    var series = chartSensers.series[2],
                        shift = series.data.length > 20; // shift if the series is 
                    // longer than 20

                    var point = {
                        x: metric.createdAt,
                        y: metric.value
                    };
                    // add the point
                    chartSensers.series[2].addPoint(point, true, shift);
                };
            }
        });

        //sensor 4
        Metrics.find({
            typeSensor: Template.instance().filterSerie4.get()
        }).observe({
            added: function (metric) {
                if (chartSensers.series.length > 0) {
                    var series = chartSensers.series[3],
                        shift = series.data.length > 20; // shift if the series is 
                    // longer than 20

                    var point = {
                        x: metric.createdAt,
                        y: metric.value
                    };
                    // add the point
                    chartSensers.series[3].addPoint(point, true, shift);
                };
            }
        });
    } else {
        console.log('Por el otro lado')
    }
};


function builtColumn() {
    chartSensers = new Highcharts.Chart({
        chart: {
            zoomType: 'xy',
            renderTo: 'container-column'
        },
        colors: ['#0000FF', '#0066FF', '#00CCFF', '#000000'],
        title: {
            text: 'Live Telemetry Sensors'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: listYAxis,
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>Time:' + Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>Value:' + Highcharts.numberFormat(this.y, 0);
            }
        },
        exporting: {
            enabled: false
        },
        series: seriesList
    });
};