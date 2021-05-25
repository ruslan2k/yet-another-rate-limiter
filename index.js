const funcsFIFO = []
let myInterval

function init (milliseconds) {
  myInterval = setInterval(function () {
    if (funcsFIFO.length <= 0) {
      return;
    }
    const { func, argsArr, cb } = funcsFIFO.shift()
    const retVal = func.apply(null, argsArr)
    cb(null, retVal)
  }, milliseconds)
}

function wrap (origFunc) {
  return function () {
    return pushInToFIFO(origFunc, [].slice.call(arguments))
  }
}

function pushInToFIFO (origFunc, argsArr) {
  return new Promise(function (resolve, reject) {
    funcsFIFO.push({ func: origFunc, argsArr, cb: function (err, data) {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    }})
  })
}

module.exports = {
  init,
  wrap,
}
