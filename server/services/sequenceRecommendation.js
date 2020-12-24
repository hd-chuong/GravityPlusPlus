const gs = require("./graphscape");


async function RecommendSequence(charts, options = {
  "fixFirst": false
}) {
  try {
    const IDs = charts.map(chart => chart.id);
    const cleanedCharts = charts.map(chart => CleanChart(chart));

    console.warn("Start looking for the best path...");
    const solve = gs.sequence(cleanedCharts, options);
    var bestSequence = solve[0].sequence;

    console.log("Found a path");
    //
    // node 0 is null, need removing
    //
    bestSequence = bestSequence.filter(order => order !== 0).map(order => order - 1);
    const orderedIDs = [];
    bestSequence.forEach(order => orderedIDs.push(IDs[order]));
    return orderedIDs;
  } catch (e) {
    console.log(`Errors catched when finding the best path: ${e}`);
    return [];
  }
}

function CleanChart(chart) {
  var {
    // data,
    transforms,
    mark,
    encoding,
  } = chart;

  // mark has to be string (do an UPPERCASE)
  if (typeof mark !== "string") {
    mark = mark.hasOwnProperty("type") ? mark.type : "";
  }

  // encoding has to be x and y
  if (mark === "arc") // likely to be color and theta
  {
    if (encoding.hasOwnProperty("color")) {
      encoding.x = encoding.color;
      delete encoding.color;
    }
    if (encoding.hasOwnProperty("theta")) {
      encoding.y = encoding.theta;
      delete encoding.theta;
    }
  }

  return {
    mark,
    encoding,
    transforms
  };
}

process.on("message", async (message) => {
  const recommended = await RecommendSequence(message.charts);
  process.send({
    result: recommended
  });
})