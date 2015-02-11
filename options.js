//clear appears to be a builtin function so it causes problems.

function loadOptions() {
  var ipAddr = localStorage["ipAddr"] || "127.0.0.1";
  // if (typeof ipAddr === 'undefined')
  // {
  // ipAddr = 127.0.0.1;
  // }

  var ipAddrSelect = document.getElementById("ipAddr");
  ipAddrSelect.value = ipAddr;

  var clearBeforeAddition = localStorage["clearBeforeAddition"] || false;
  var clearSelect = document.getElementById("clear");
  //clearSelect.value = true || clearBeforeAddition;
  clearSelect.checked = clearBeforeAddition;
  
  // var select = document.getElementById("color");
  // for (var i = 0; i < select.children.length; i++) {
  //   var child = select.children[i];
  //   if (child.value == favColor) {
  //     child.selected = "true";
  //     break;
  //     }
  //   }

}

function saveOptions() {
//move all localStorage calls to the end?
  var ipAddrSelect = document.getElementById("ipAddr");
  var ipAddr = ipAddrSelect.value;
  if (!checkIsIPV4(ipAddr)) {
    ipAddrSelect.style.background = "red"
    return
  } else {
    ipAddrSelect.style.background = "none";
  }
  localStorage["ipAddr"] = ipAddr || "127.0.0.1";

  var siteSelect = document.getElementById("site");
  var siteChoice = siteSelect.children[siteSelect.selectedIndex].value;
  localStorage["site"] = siteChoice;
  

  var clearSelect = document.getElementById("clear");
  var clearBeforeAddition = clearSelect.value;
  localStorage["clearBeforeAddition"] = clearBeforeAddition || false;
}

function eraseOptions() {
  localStorage.removeItem("ipAddr");
  localStorage.removeItem("site");
  localStorage.removeItem("clearBeforeAddition");
  location.reload();
}

function checkIsIPV4(entry) {
  var blocks = entry.split(".");
  if(blocks.length === 4) {
    return blocks.every(function(block) {
      return !isNaN(block) &&  parseInt(block,10) >=0 && parseInt(block,10) <= 255;
    });
  }
  return false;
}


document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('saveOptions').addEventListener('click',saveOptions);
document.getElementById('eraseOptions').addEventListener('click',eraseOptions);
document.getElementById('loadOptions').addEventListener('click',loadOptions);