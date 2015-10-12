Template.senseChart.created = function () {
    // counter starts at 0
    this.seriesSensors = new ReactiveVar([]);
};

Template.senseChart.helpers({
    listSensors: function () {
      return Template.instance().seriesSensors.get();
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
        if( typeof(chartSensers) !== undefined ){
            Metrics.find({typeSensor: "sensor1"}).observe({
            added : function(metric){ 
                var series = chartSensers.series[0],
                shift = series.data.length > 20; // shift if the series is 
                                                 // longer than 20

                var point = {x: metric.createdAt, y: metric.value};
                // add the point
                chartSensers.series[0].addPoint(point, true, shift);
            }
        });
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

    'submit #add-sensor': function(event, template) {
      event.preventDefault();

      var sensor = {
        name: event.target.name.value, // Get value from form element
        color: event.target.color.value,
        sensorId: event.target.color.value
      };
      
      addSerie(sensor, template);

      event.target.name.value = "";
      event.target.color.value = "";
    }
};


function addSerie (serie, template) {

  var sensor = {
    name: serie.name,
    type: 'spline',
    yAxis: 1,
    data: [],
    tooltip: {
        valueSuffix: ' mm'
    }
  };

  var seriesSensors = template.seriesSensors.get();
  seriesSensors.push(sensor);
  template.seriesSensors.set(seriesSensors);
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
            text: 'Live random data'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}°C',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            title: {
                text: 'Temperature',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            opposite: true

        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Rainfall',
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

        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Sea-Level Pressure',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                format: '{value} mb',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true
        }],
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
            }
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Rainfall',
            type: 'spline',
            yAxis: 1,
            data: [],
            tooltip: {
                valueSuffix: ' mm'
            }

        }, {
            name: 'Sea-Level Pressure',
            type: 'spline',
            yAxis: 2,
            data: [],
            tooltip: {
                valueSuffix: ' mb'
            }

        }, {
            name: 'Temperature',
            type: 'spline',
            data: [],
            tooltip: {
                valueSuffix: ' °C'
            }
        }]
    });
};
