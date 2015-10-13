Template.senseChart.created = function () {
    // counter starts at 0
    var sensors = [{
      name: 'Sensor 1', // Get value from form element
      sensorId: 'sensor1'
    }, {
      name: 'Sensor 2', // Get value from form element
      sensorId: 'sensor2'
    }]
    this.seriesSensors = new ReactiveVar(sensors);
};

Template.senseChart.helpers({
    listSensors: function () {
        return Template.instance().seriesSensors.get();
    },
    Sensors: function () {
        return Sensors.find({});
    }
});


/*
 * Call the function to built the chart when the template is rendered
 */
Template.senseChart.rendered = function () {
    builtColumn();
    /*
     * add point when new metric is added
     */
    this.autorun(function () {
        if (typeof (chartSensers) !== 'undefined') {

            Metrics.find({
                typeSensor: "sensor1"
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

            Metrics.find({
                typeSensor: "sensor2"
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
        } else {
          console.log('Por el otro lado')
        }
    });
};

/*
 * Template events
 */
Template.senseChart.events = {

    'change #reactive': function (event, template) {
        var newValue = $(event.target).val();
        Session.set('reactive', parseInt(newValue));
    },

        'submit #add-sensor': function (event, template) {
        event.preventDefault();

        var sensor = {
            name: event.target.name.value, // Get value from form element
            color: event.target.color.value,
            sensorId: event.target.color.value
        };

        addSerie(sensor, template);

        event.target.name.value = "";
        event.target.color.value = "";
    },

        'click #getChart': function (event, template) {
        builtColumn();
    }
};

var seriesList = [{
            name: 'Sensor 1',
            type: 'spline',
            data: [],
            tooltip: {
                valueSuffix: ' mm'
            }

        }, {
            name: 'Sensor 2',
            type: 'spline',
            data: [],
            tooltip: {
                valueSuffix: ' mb'
            }

        }],
    listYAxis = [{ // Primary yAxis
            labels: {
                format: '{value}°C',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            title: {
                text: 'Sensor 1',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            }

        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Sensor 2',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} mm',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true

        }];

function addSerie(serie, template) {

    var sensor = {
        name: serie.name,
        //type: 'spline',
        data: [],
        tooltip: {
            valueSuffix: ' mm'
        }
    };

    var seriesSensors = template.seriesSensors.get();

    listYAxis = [];
    seriesList = [];

    //Solo 4 series
    if (seriesSensors.length <= 3) {

        seriesSensors.push(sensor);
        template.seriesSensors.set(seriesSensors);

        if (listYAxis.length) {

        };
        //sensor.yAxis = seriesSensors.length;
        seriesList.push(sensor); // List series Chart
        addYAxis(sensor, false); // yAxis serie Chart
        builtColumn();
    };
};

function addYAxis(serie, flag) {
    var yAxis = {};

    if (listYAxis.length % 2 === 0) {
        yAxis = {
            gridLineWidth: 0,
            title: {
                text: serie.name,
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} mm',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
        }
    } else {
        yAxis = {
            gridLineWidth: 0,
            title: {
                text: serie.name,
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} mm',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }
    };

    listYAxis.push(yAxis);
};

/*
 * Function to draw the column chart
 */
function builtColumn() {
    chartSensers = new Highcharts.Chart({
        chart: {
            zoomType: 'xy',
            renderTo: 'container-column'
        },
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