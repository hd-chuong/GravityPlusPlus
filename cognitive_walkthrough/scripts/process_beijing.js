const {readFile, writeFile} = require("fs");

readFile('../datasets/beijing.json', (err, data) => {
    const dataset = JSON.parse(data);
    // const general_info = Object.values(dataset).map((record) => ({...record, data: undefined}));
    var beijing_data = dataset.map(record => ({
        year: record.year,
        month: record.month,
        day: record.day,
        hour: record.hour,
        "PM2.5": parseInt(record["PM2.5"]),
        PM10: parseInt(record.PM10),
        SO2: parseInt(record.SO2),
        NO2: parseInt(record.NO2),
        CO: parseInt(record.CO),
        O3: parseInt(record.O3),
        TEMP: parseFloat(record.TEMP),
        PRES: parseFloat(record.PRES),
        DEWP: parseFloat(record.DEWP),
        RAIN: parseFloat(record.RAIN),
        WSPM: parseFloat(record.WSPM),
        wd: record.wd,
        station: record.station,
    }))
    writeFile('../datasets/beijing_change.json', JSON.stringify(beijing_data), (err) => {
        if (err) throw err;
        console.log("covid-by-date finished");
    });

    // writeFile('../datasets/country_stats.json', JSON.stringify(general_info), (err) => {
    //     if (err) throw err;
    //     console.log("country-stats finished");
    // });
})