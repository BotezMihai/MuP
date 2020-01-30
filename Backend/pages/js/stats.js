let token = window.localStorage.getItem('userToken');
if(token===null){
   window.location.replace('/firstpage.html');
}
function logout(){ 
     localStorage.removeItem('userToken');
     window.location.replace('/firstpage.html')
 } 


google.charts.load("visualization", "1", {
    'packages': ['corechart']
});
google.charts.setOnLoadCallback(drawChart);
let token=window.localStorage.getItem('userToken')
function drawChart() {
    fetch("/statistic/me",{
        headers:  {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization':'Bearer '+token
       
    }
    })
    .then(resp=>resp.json())
    .then(rsp=>{
        console.log(rsp)
        let lista=[["Style","Number of seconds"]]
        let durata=0;
        for(i=0;i<rsp.message.length;i++){
            let newlist=[]
            durata=durata+parseInt(rsp.message[i].durata);
            newlist.push(rsp.message[i].tag)
            newlist.push(parseInt(rsp.message[i].durata))
            lista.push(newlist)
            console.log(durata)

        }
        durata=durata/60;
        let span=document.getElementById('minutes');
        span.innerHTML=durata;

        console.log(lista)
        var data = google.visualization.arrayToDataTable(lista);
        
        var width = window.matchMedia("(max-width: 670px)");
            if (width.matches) {
                var options = {
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
            var options = {
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
     var chart = new google.visualization.PieChart(document.getElementById('piechart'));
     chart.draw(data, options);
 

 function debounce(func, time) {
     var time = time || 100; // 100 by default if no param
     var timer;
     return function(event) {
         if (timer) clearTimeout(timer);
         timer = setTimeout(func, time, event);
     };
 }

function resizeContent() {
    drawChart();
}

window.addEventListener("resize", debounce(resizeContent, 150));

})}