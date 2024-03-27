Highcharts.theme = {
    colors: ['#005087','#64dcf0','#ffe664','#b491d7','#87dc64','#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
	credits:{
		enabled: false
	},
	legend:{ enabled:true },
    title: {
        text: ''
    },

    xAxis: {
        title: {
            text: ''
        },
        labels: {
            format: ''
        }	
    },
    yAxis: [
		{
        title: {
            text: ''
        }
		},{
        title: {
            text: ''
        }
		,opposite: true
		}
	],
    plotOptions: {
        line: {
			lineWidth: 4,
            dataLabels: {
                enabled: true,
				style: {
                fontSize: '16px',
                fontFamily: 'Verdana, sans-serif'
				}
            },
            enableMouseTracking: false
        },
		column: {
            dataLabels: {
                enabled: true,
				inside: true,
				verticalAlign: 'middle',
				style: {
                fontSize: '16px',
                fontFamily: 'Verdana, sans-serif'
				}
            }
		},
		bar: {
            dataLabels: {
                enabled: true,
				style: {
                fontSize: '16px',
                fontFamily: 'Verdana, sans-serif'
				}
            }
		}
    }
}
// Apply the theme
Highcharts.setOptions(Highcharts.theme);


//JSON輸出表格
function json_to_table(json_data) {
    t = '<table class="table-bordered table-striped small"><tr class="bg-info text-light">';
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
function json_to_heatmap(json){
	categories = Object.keys(json[0]);
	firstElement = categories.shift();
	max = 0;
	for(var i=0;i<json.length;i++){
		for(j in categories){
			if(json[i][categories[j]] > max){
				max = json[i][categories[j]];
			}
		}
	}
	t = '<table class="table-bordered text-center w-100">';
	t += '<tr class="bg-info text-light">';
	for(key in json[0]){
		t += '<th>' + key + '</th>';
	}
	t += '</tr>';
	for(var i=0;i<json.length;i++){
		t += '<tr>';
		t += '<td>' + json[i][firstElement] + '</td>';
		for(j in categories){
			key = categories[j];
			r = json[i][key]/max;
			color = 'black';
			if(r > 0.6){
				color = 'white';
			}
			t += '<td style="background: rgba(76, 175, 80, ' + r + ');color:' + color + '">' + json[i][key] + '</td>';
		}
		t += '</tr>';
	}
	t += '</table>';
	return t;
}
function show_card_header(title,result){
	if(result > 0){
		document.write('<div class="card-header bg-danger text-light"><h6>' + title + '</h6></div>');
	}
	else{
		document.write('<div class="card-header bg-success text-light"><h6>' + title + '</h6></div>');
	}
}
function show_card(title,result){
	document.write('<div class="col-md-6"><div class="card shadow m-2">');
	if(result > 0){
		document.write('<div class="card-header bg-danger text-light"><h6>' + title + '</h6></div>');
	}
	else{
		document.write('<div class="card-header bg-success text-light"><h6>' + title + '</h6></div>');
	}
	document.write('<div class="card-body">' + result + '</div>');
	document.write('</div></div>');
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
function json_xy(json_data,x,y){
	xy = [];
	for(var i=0;i<json_data.length;i++){
		xy.push([json_data[i][x],json_data[i][y]])
	}
	return xy;
}
function num_float(num,f){
	return Math.round(num*(10**f))/(10**f)
}
function num_format(num,unit,f){
	str = '';
	op = unit.substr(0,1);
	if(op=='+'){
		if(num > 0){
			str += '+';
		}
		else{
			str += '-';
		}
		num = Math.abs(num);
		unit = unit.substr(1,1);
	}
	if(unit=='K'){
		num = num / 1000;
	}
	else if(unit=='萬'){
		num = num / 10000;
	}
	else if(unit=='億'){
		num = num / 100000000;
	}
	else if(unit=='M'){
		num = num / 1000000;
	}
	else if(unit=='%'){
		num = num * 100;
	}
	if(unit=='$'){
		str += '$';
		unit = '';
	}
	str += Math.round(num*(10**f))/(10**f);
	str += unit;
	return str;
}

function show_chart(cid,categories,series,options){
	if('col_len' in options){
		document.write('<div class="col-md-' + options['col_len'] + '">');
	}
	else{
		document.write('<div>');
	}
	document.write('<div class="card shadow">');
	if('color' in options){
		document.write('<div class="card-header" style="background:' + options['color'] + ';">');
	}
	else{
		document.write('<div class="card-header">');
	}
	document.write('<h5>' + cid + '</h5></div>');
	document.write('<div id="' + cid + '"></div>');
	document.write('</div>');
	
	document.write('</div>');
	
	
	yAxis = [];
	if('y_max' in options){
		yAxis.push({title:{text:''},max:options['y_max']});
	}
	else{
		yAxis.push({title:{text:''}});
	}
	if('y_max' in options){
		yAxis.push({title:{text:''},min:options['y_min'],opposite: true});
	}
	else{
		yAxis.push({title:{text:''},opposite: true});
	}
	
	Highcharts.chart(cid, {
		xAxis:{
			categories: categories
		},
		yAxis:yAxis,
		series: series
	});
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

function show_chart_in_col(cid,categories,series,color,col_len){
	document.write('<div class="col-md-' + col_len + '">');
	document.write('<div class="card shadow">');
	document.write('<div class="card-header" style="background:' + color + '"><h5 class="m-0">' + cid + '</h5></div>');
	document.write('<div id="' + cid + '"></div>');
	document.write('</div>');
	document.write('</div>');
	
	Highcharts.chart(cid, {
		chart: {
			type: 'line'
		},
		xAxis:{
			categories: categories
		},
		yAxis:[
		{title:{text:''}},
		{title:{text:''},opposite: true}
		],
		series: series
	});
}
function to_acc(arr){
	new_arr = [];
	for(var i=0;i<arr.length;i++){
		new_arr.push(arr[i]);
	}
	for(var i=1;i<arr.length;i++){
		new_arr[i] += new_arr[i-1];
	}
	return new_arr;
}
function to_left(arr,len){
	for(var i=0;i<arr.length;i++){
		arr[i] = arr[i].substr(0,len);
	}
	return arr;
}