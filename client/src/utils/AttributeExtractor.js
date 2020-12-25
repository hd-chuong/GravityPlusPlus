export default function AttributeExtractor(obj) {
  var ans = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      ans.push(key);
    }
  }
  return ans;
}

export function FieldExtractorFromEncoding(encoding) {
  var fields = [];
  for (let channel in encoding) {
    const value = encoding[`${channel}`];

    if (value.hasOwnProperty('field')) {
      fields.push(value.field);
    }
  }
  return fields.sort();
}
