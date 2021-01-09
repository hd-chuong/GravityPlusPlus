var promiseTRSANSG = (promiseThatResolvesAfterNSecondsGenerator = function(
n = 0
) {
return new Promise(function(resolve, reject) {
    setTimeout(function() {
    resolve({
        resolvedAfterNSeconds: n
    });
    }, n * 1000);
});
});

var promiseTRJANSG = (promiseThatRejectsAfterNSecondsGenerator = function(
n = 0
) {
return new Promise(function(resolve, reject) {
    setTimeout(function() {
    reject({
        rejectedAfterNSeconds: n
    });
    }, n * 1000);
});
});

async function testAsync() {
    for (var i = 0; i < 5; i++) {
      try {
        result1 = await promiseTRRARNOSG();
        console.log("Result 1 ", result1);
        result2 = await promiseTRRARNOSG();
        console.log("Result 2 ", result2);
      } catch (e) {
        console.log("Error", e);
      } finally {
        console.log("This is done");
      }
    }
  }
  testAsync();
