

function addToLoveList(){
  var xhr= new XMLHttpRequest();
  var productArray=[230316, 228684, 2];
  productArray = [212407, 212606, 226536];

  productArray.forEach(function(element,index,array){
    xhr.open('POST','https://www.victoriassecret.com/lovelist/item/heart',true);
    var postData="productid="+element+"&ctlg=LJ&cqo=false&path=%2F";
    console.log(element+' ' +postData);
    //    $.post("https://www.victoriassecret.com/lovelist/item/heart", "productid="+element+"&ctlg=LJ&cqo=false&path=%2Fvictorias-secret-sport%2Fsports-bras%2Fseamless-reversible-sport-bra-victorias-secret-sport%3FProductID%3D221633%26CatalogueType%3DOLS")});
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhr.setRequestHeader("Content-length", postData.length);
    xhr.onreadystatechange = function() {//Call a function when the state changes.
      if(xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
      }
    }

//do I need a setTimeout call? copy 3 cURL calls to these products, put in a script and see if that works without a pause between calls. Time execution. 
// Is it teh missing variables that screw things up?
    xhr.send(postData);
  })
};

var clearSite={
  "production":"https://www.victoriassecret.com",
  "test":"https://test-005.lbidts.com",
  "dev":"https://dev-005.lbidts.com",
  "pint":"https://vsdpint.lbidts.com"
};

//use a heart with a minus or the red circle with diagonal as a symbol to unheart.
function clearLoveList(cookieObject) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://'+cookieObject.site+'/lovelist/remove/all');
  xhr.send();
}

function getCookie(target) {
  var mysite="dev-005.lbidts.com";
  mysite="www.victoriassecret.com";
  var myObj={"site":mysite,
             "UID":"",
             "X-Mapping-omgbnpna":"",
             "cmTPSet":"",
             "vShip":"",
             "VSSESSION":"",
             "vsPopUnder":""
            };
  paramName=[ "UID", "X-Mapping-omgbnpna", "cmTPSet", "vShip", "VSSESSION","vsPopUnder"];
  chrome.cookies.get({"url":"https://dev-005.lbidts.com","name":"UID"},function(data) {
    var element =  document.getElementById(target);
    console.log(data);
    console.log(data.value);
    element.innerHTML = data.value;
  });

  chrome.cookies.getAll({},function(cookieList){
    var clength = cookieList.length;
    console.log(clength);
    for (var x=0;x<clength;x++)
    {
      if (cookieList[x].domain == mysite) {

        console.log(cookieList[x].name+' / '+cookieList[x].value); //create a key value pair from these two.
        myObj[cookieList[x].name]=cookieList[x].value;
      }
      //        console.log(cookieList[x].name+' / '+cookieList[x].value);
      //        console.log(cookieList[x].domain);
    }
  });
  console.log(myObj);
  return myObj;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log("get cookie");
  var cookieData=getCookie("cookieContent");
  //clearLoveList(cookieData);
  addToLoveList();
  //showPopup();
});

// function showPopup() { //why does this open a billion tabs?
// chrome.tabs.create({'url':'popup.html'});
// };

// document.getElementById("someID").onclick = function () {   };