export function describeParams(dataSpec, signals)
{
    /*
    * dataSpec: the dataSpec property of a vega spec
    * signals: the signals property of a vega spec
    */
    const signalData = [];
    signals.forEach((signal) => {
        const name = signal;
        dataSpec.forEach((dat) => {
            if (!dat.hasOwnProperty("transform")) return;
            dat.transform.forEach((transform) => {
                if (transform.type !== "filter") return;
                const exp = transform.expr;
                const comparison = exp.split(", ")[1];
                if (comparison.includes(name)) signalData.push({name, description: comparison});
            });
        });
    });
    return signalData;
}