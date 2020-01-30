google.charts.load("current", {
    'packages': ['corechart']
});
google.charts.setOnLoadCallback(drawChart1);

function drawChart1() {
    var data1 = google.visualization.arrayToDataTable([
        ['Style', 'Number of songs'],
        ['Rock', 8],
        ['Rap', 3],
        ['Hip-Hop', 4],
        ['Manele', 3],
        ['Trap', 1]
    ]);
    var width = window.matchMedia("(max-width: 670px)");
    if (width.matches) {
        var options1 = {
            'backgroundColor': 'rgb(32, 32, 32)',
            'pieSliceBorderColor': 'rgb(32, 32, 32)',
            'titlePosition': 'none',
            'width': 500,
            'height': 400,
            'pieSliceTextStyle': {
                color: 'black',
                fontSize: 18
            },
            'tooltip': {
                text: 'percentage',
                textStyle: {
                    color: 'black',
                    fontSize: 15
                }
            },
            'legend': {
                position: 'none'
            },
            'chartArea': {
                left: 100,
                top: 6,
                width: "80px",
                height: "100px"
            }
        };
    } else {
        var options1 = {
            'backgroundColor': 'rgb(32, 32, 32)',
            'pieSliceBorderColor': 'rgb(32, 32, 32)',
            'titlePosition': 'none',
            'width': 700,
            'height': 400,
            'pieSliceTextStyle': {
                color: 'black',
                fontSize: 18
            },
            'tooltip': {
                text: 'percentage',
                textStyle: {
                    color: 'black',
                    fontSize: 15
                }
            },
            'legend': {
                alignment: 'center',
                textStyle: {
                    color: '#16b553',
                    fontSize: 15
                }
            },
            'chartArea': {
                left: 200,
                top: 6,
                width: "100%",
                height: "100px"
            }
        };
    }
    var chart1 = new google.visualization.PieChart(document.getElementById('piechart1'));
    chart1.draw(data1, options1);
}