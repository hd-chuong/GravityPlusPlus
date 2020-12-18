const gs = require("./graphscape");
const MAX_TIME_OUT = 2;

function RecommendSequence(charts, options={"fixFirst": false})
{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(`TIME OUT ${MAX_TIME_OUT / 1000}s.`);
        }, MAX_TIME_OUT);

        try 
        {
            const IDs = charts.map(chart => chart.id);
            const cleanedCharts = charts.map(chart => CleanChart(chart));
            
            console.warn("Start looking for the best path...");
            const solve = gs.sequence(cleanedCharts, options);
            var bestSequence = solve[0].sequence;
            console.log("Found a path");
            // node 0 is null, need removing
            bestSequence = bestSequence.filter(order => order !== 0).map(order => order - 1);
            const orderedIDs = [];
            bestSequence.forEach(order => orderedIDs.push(IDs[order]));
            resolve(orderedIDs);
        }
        catch (e) {
            reject(`${e}. Graphscape can not find a viable path.`);
        }
    });
}

function CleanChart(chart)
{
    const {
        // data,
        transforms,
        mark,
        encoding,
    } = chart;

    // mark has to be string (do an UPPERCASE)
    if (typeof mark !== "string")
    {
        mark = mark.hasOwnProperty("type") ? mark.type : "";
    }


    // encoding has to be x and y
    if (mark === "arc") // likely to be color and theta
    {
        if (encoding.hasOwnProperty("color"))
        {
            encoding.x = encoding.color;
            delete encoding.color;
        }
        if (encoding.hasOwnProperty("theta"))
        {
            encoding.y = encoding.theta;
            delete encoding.theta;
        }
    }

    return {mark, encoding, transforms};
}
module.exports.RecommendSequence = RecommendSequence;