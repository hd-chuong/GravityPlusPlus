const {readFile, writeFile} = require("fs");

readFile('../datasets/covid.json', (err, data) => {
    const dataset = JSON.parse(data);
    // const general_info = Object.values(dataset).map((record) => ({...record, data: undefined}));

    var covid_data = Object.values(dataset).map(record => ({country: record.location, data: record.data}));
    

    covid_data.forEach(rec => rec.data.forEach(data => data.country = rec.country));
    covid_data = covid_data.reduce((prev, curValue) => prev.concat(curValue.data), []);
    
    covid_data = covid_data.map(({date, total_cases, new_cases, country}) => ({date, total_cases, new_cases, country}));

    writeFile('../datasets/covid_by_day.json', JSON.stringify(covid_data), (err) => {
        if (err) throw err;
        console.log("covid-by-date finished");
    });

    // writeFile('../datasets/country_stats.json', JSON.stringify(general_info), (err) => {
    //     if (err) throw err;
    //     console.log("country-stats finished");
    // });
})