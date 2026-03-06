import Chart from 'react-google-charts'

export default ({title, subtitle, width='500px', height='300px', chartType='BarChart', loader=<div>Loading chart</div>, data, isStacked, dataRh=null}) => {
    // data = [
    //   ['Incidents', 'Sophomores', 'Juniors', 'Seniors'],
    //   ['Monday', 10000, 400, 200],
    //   ['Tuesday', 1170, 460, 250],
    //   ['Wednesday', 660, 1120, 300],
    //   ['Thursday', 1030, 540, 350],
    //   ['Friday', 1170, 460, 250],
    // ];

    return (
        <Chart
            width={width}
            height={height}
            chartType={chartType}
            loader={loader}
            data={data}
            options={{
                isStacked,
                chart: {
                    title,
                    subtitle,
                },
            }} />
    )
}
