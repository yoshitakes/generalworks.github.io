
module.exports = function (url, method, params, callback) {
  let obj;

  try {
    obj = new XMLHttpRequest();
  } catch (e1) {
    try {
      obj = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e2) {
      try {
        obj = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e3) {
        alert("Your browser does not support Ajax.");
        return false;
      }
    }
  }
  obj.onreadystatechange = function () {
    if (obj.readyState === 4) {
      callback(obj);
    }
  };
  obj.open(method, url, true);
  obj.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  obj.send(params);

  return obj;
};
