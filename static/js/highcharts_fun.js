Highcharts.theme = {
    colors: ['#005087','#64dcf0','#ffe664','#b491d7','#87dc64','#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
	credits:{
		enabled: false
	},
	exporting:{
		enabled: false
	}
}
// Apply the theme
Highcharts.setOptions(Highcharts.theme);


//JSON輸出表格
function json_to_table(json_data) {
    t = '<table class="table-bordered table-striped small"><tr class="bg-info text-light">';
	t = '<table class="table table-hover table-responsive table-sm small">';
	t += '<tr class="bg-info text-light">';
    for(var key in json_data[0]){
        t += "<td>" + key + "</td>";
    }
    t += "</tr>";
    for (var i = 0; i < json_data.length; i++) {
        t += "<tr>";
        for(var key in json_data[i]){
            t += ("<td>" + json_data[i][key] + "</td>");
        }
        t += ("</tr>");
    }
    t += ("</table>");
    return t
}
function json_col(json_data,col){
	arr = [];
	for(var i=0;i<json_data.length;i++){
		arr.push(json_data[i][col])
	}
	return arr;
}
function json_row(json,gb,categories){
	series = [];
	for(var i=0;i<json.length;i++){
		data = [];
		for(col_name of categories.values()){
			data.push(json[i][col_name]);
		}
		series.push({name:json[i][gb],data:data});
	}
	return series;
}
//DISTINCT
function distinct(json,field){
	var group_field = field;
	var group = [];
    for(var i=0;i<json.length;i++){
		if(group.indexOf(json[i][group_field])<0){
        	group.push(json[i][group_field]);
        }
    }
    return group;
}


function arr_max(arr){
	max = 0;
	for(var i=0;i<arr.length;i++){
		if(arr[i] > max){
			max = arr[i];
		}
	}
	return max;
}
function arr_sum(arr){
	sum = 0;
	for(var i=0;i<arr.length;i++){
		sum += arr[i];
	}
	return sum;
}

function render_chart(cid,categories,series,options={}){
	Highcharts.chart(cid, {
		chart: {
			type: 'column'
		},
		title: {
			text: cid,
			align: 'left'
		},
		xAxis: {
			categories: categories,
			crosshair: true,
			accessibility: {
				description: 'Countries'
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: '1000 metric tons (MT)'
			},
			stackLabels: {
				enabled: true
			}
		},
		tooltip: {
			valueSuffix: ' (1000 MT)'
		},
		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					enabled: true
				}
			}
		},
		series: series
	});
}

function show_chart(cid,categories,series,options={}){
	document.write('<div class="col-md-12">');
	document.write('<div id="' + cid + '"></div>');
	document.write('</div>');
	Highcharts.chart(cid, {
		chart: {
			type: 'column'
		},
		title: {
			text: 'Corn vs wheat estimated production for 2020',
			align: 'left'
		},
		subtitle: {
			text:
				'Source: <a target="_blank" ' +
				'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>',
			align: 'left'
		},
		xAxis: {
			categories: categories,
			crosshair: true,
			accessibility: {
				description: 'Countries'
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: '1000 metric tons (MT)'
			}
		},
		tooltip: {
			valueSuffix: ' (1000 MT)'
		},
		series: series
	});
}

function show_card(title,result,options={}){
	document.write('<div class="col-md-12"><div class="card shadow m-2">');
	if(result > 0){
		document.write('<div class="card-header bg-danger text-light"><h6>' + title + '</h6></div>');
	}
	else{
		document.write('<div class="card-header bg-success text-light"><h6>' + title + '</h6></div>');
	}
	document.write('<div class="card-body">' + result + '</div>');
	document.write('</div></div>');
}

function show_sparkline(cid,data){
	/*
	document.write('<div class="card">');
		document.write('<div class="card-header p-1"><h2>' + cid + '</h2></div>');
		document.write('<div class="p-2 d-flex">');
		document.write('<h2 class="px-2">' + data[data.length-1] + '</h2>');
		document.write('<div id="' + cid + '"></div>');
		document.write('</div>');
	document.write('</div>');
	
	document.write('<div class="row">');
		document.write('<div class="col-auto mx-2"><h6>現況人力</h6><h2>' + data[data.length-1] + '</h2></div>');
		document.write('<div class="col" id="' + cid + '"></div>');
	document.write('</div>');
	*/
	document.write('<div id="' + cid + '"></div>');
	
	Highcharts.chart(cid, {
		chart: {
            backgroundColor: null,
            borderWidth: 0,
            type: 'area',
            margin: [2, 0, 2, 0],
			height: 80
		},
		title: {
			text: ''
		},
        xAxis: {
			lineWidth :0,//去掉x轴线
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            startOnTick: false,
            endOnTick: false,
            tickPositions: []
        },
        yAxis: {
            endOnTick: false,
            startOnTick: false,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickPositions: [0]
        },
        legend: {
            enabled: false
        },
        tooltip: {
            hideDelay: 0,
            outside: true,
            shared: true
        },
        plotOptions: {
            series: {
                animation: false,
                lineWidth: 4,
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                marker: {
                    radius: 1,
                    states: {
                        hover: {
                            radius: 2
                        }
                    }
                },
                fillOpacity: 0.25
            },
            column: {
                negativeColor: '#910000',
                borderColor: 'silver'
            }
        },
		series: [{type:'column',data:data}]
	});
}
function to_sparkline(cid,data){
	Highcharts.chart(cid, {
		chart: {
            backgroundColor: null,
            borderWidth: 0,
            type: 'area',
            margin: [2, 0, 2, 0],
			height: 80
		},
		title: {
			text: ''
		},
        xAxis: {
			lineWidth :0,//去掉x轴线
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            startOnTick: false,
            endOnTick: false,
            tickPositions: []
        },
        yAxis: {
            endOnTick: false,
            startOnTick: false,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickPositions: [0]
        },
        legend: {
            enabled: false
        },
        tooltip: {
            hideDelay: 0,
            outside: true,
            shared: true
        },
        plotOptions: {
            series: {
                animation: false,
                lineWidth: 3,
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                marker: {
                    radius: 1,
                    states: {
                        hover: {
                            radius: 2
                        }
                    }
                },
                fillOpacity: 0.25
            },
            column: {
                negativeColor: '#910000',
                borderColor: 'silver'
            }
        },
		series: [{type:'area',data:data}]
	});
}