function SetQueryBuilder(varName, params)
{
  /*
  * return "n.k1 = v1, n.k2 = v2" 
  */
  const keys = Object.keys(params);
  const query = keys.reduce((prev, newKey, index) => prev.concat(`${index === 0 ? " " : ", "}${varName}.${newKey} = '${JSON.stringify(params[newKey])}'`), "")
  console.log("query: ", query);
  return query;
}

module.exports = {
    SetQueryBuilder
}