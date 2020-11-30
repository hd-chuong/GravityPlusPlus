export default function AttributeExtracter(obj)
{
    var ans = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            ans.push(key);
        }
    }
    return ans;
}