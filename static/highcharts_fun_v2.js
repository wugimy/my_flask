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