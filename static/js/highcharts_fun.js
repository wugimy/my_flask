//JSON輸出表格
function json_to_table(json_data) {
	t = '<table class="table table-dark table-striped table-hover table-responsive table-sm">';
	t += '<tr style="background:black">';
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
//JSON輸出有顏色的表格(最後一欄為顏色)
function json_to_color_table(json_data) {
    t = '<table class="table-bordered table-striped small"><tr class="bg-info text-light">';
	t = '<table class="table table-hover table-responsive table-sm small">';
	t += '<tr class="bg-info text-light">';
	keys = Object.keys(json_data[0]);
	last_col = keys.pop();
    for(i in keys){
		key = keys[i];
        t += "<th>" + key + "</th>";
    }
    t += "</tr>";
    for (var i = 0; i < json_data.length; i++) {
        color = json_data[i][last_col];
		t += '<tr style="background:' + color + '">';
        for(j in keys){
			key = keys[j]
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
	var col_len = 12;
	if('col_len' in options){
		col_len = options['col_len'];
	}
	document.write('<div class="col-md-' + col_len + '">');
	document.write('<div class="card bg-dark">');
	document.write('<div class="card-body">');
	document.write('<div id="' + cid + '"></div>');
	document.write('</div>');
	document.write('</div>');
	document.write('</div>');
	Highcharts.chart(cid, {
		chart: {
			backgroundColor: null,
			type: 'column'
		},
		title: {
			text: ''
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
		series: series
	});
}

function show_pie(cid,series,options={}){
	var col_len = 12;
	if('col_len' in options){
		col_len = options['col_len'];
	}
	document.write('<div class="col-md-' + col_len + '">');
	document.write('<div class="card bg-dark">');
	document.write('<div class="card-body">');
	document.write('<div id="' + cid + '"></div>');
	document.write('</div>');
	document.write('</div>');
	document.write('</div>');
	Highcharts.chart(cid, {
		chart: {
			backgroundColor: null
		},
		title: {
			text: ''
		},
		series: series
	});
}

function show_card(title,result,options={}){
	var col_len = 12;
	if('col_len' in options){
		col_len = options['col_len'];
	}
	document.write('<div class="col-md-' + col_len + '">');
	document.write('<div class="card bg-dark text-light shadow m-2">');
	if(title != ''){
		document.write('<div class="card-header text-light m-0 p-2"><h6>' + title + '</h6></div>');
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
function to_sparkline(cid,series){
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
		series: series
	});
}