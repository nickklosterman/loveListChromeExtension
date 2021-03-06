
function addToLoveList(){
    var site = ["www.victoriassecret.com", "10.7.19.134","10.7.35.134","localhost:8080", "test-005.lbidts.com", "dev-005.lbidts.com"];
    //site = ["test-005.lbidts.com"];
    //site = ["localhost:8080"];
    site.forEach(function(element,index,arrary) {
	addToLoveList2(element);
    });
}

//instead of using these switch statements I could just create objects that have the properties that I need.
function getProductArray(site) {
    var productArray;
    switch (site)
    {
    case "www.victoriassecret.com":
	productArray= [212407, 226536,221475,221349,90647,221819,221444,221440,225919,221370,227153,226284,226286,221777,221781,229071,228154,225585];
	break;
    case "10.7.19.134":
    case "10.7.35.134":
    case "test-005.lbidts.com":
    case "dev-005.lbidts.com":
	//    productArray =  [230316, 228684,145949 ];
	productArray =  [230316, 228684,145949,153955, 74839,151825,150577 ];
	break;
    default: //assume localhost
	productArray =  [230316, 228684,145949,153955, 74839,151825,150577 ];
	break;
    }
    return productArray;
};

function getCatalogCode(site) {
    var code;
    switch (site)
    {
    case "www.victoriassecret.com":
	code = "LL";//LJ";
	break;
    case "10.7.19.134":
    case "10.7.35.134":
    case "test-005.lbidts.com":
    case "dev-005.lbidts.com":
	code = "VF";
	break;
    default: //assume localhost
	code = "VF";
	break;
    }
    return code;
};



function addToLoveList2(site){
    var xhr = new XMLHttpRequest();
    var productArray = getProductArray(site);
    var catalogCode = getCatalogCode(site);
  var interval = 100;
    productArray.forEach(function(element,index,array){
	setTimeout(function(element){
	    //xhr.open('POST','https://www.victoriassecret.com/lovelist/item/heart',true);
	    //xhr.open('POST','https://'+site+'dev-005.lbidts.com/lovelist/item/heart',true);
	    xhr.open('POST','https://'+site+'/lovelist/item/heart',true);
	    var postData="productid="+element+"&ctlg="+catalogCode+"&cqo=false&path=";

	    console.log(element+' ' +postData);
	    // ????? wtf I thought it needed the UID and other info to be passed? or is this being handled automagically since we are on the VS site?	    
	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xhr.onreadystatechange = function() { //Call a function when the state changes.
		if(xhr.readyState == 4 && xhr.status == 200) {
		    console.log(xhr.responseText);
		    var xhrRT = JSON.parse(xhr.responseText);
		    document.getElementById('count').textContent = xhrRT.count;
		    document.getElementById('unavailableCount').textContent = xhrRT.unavailableCount;
		} else {
		    console.log(xhr)
		}
	    };
	    xhr.send(postData);
	},interval*index,element); 
    });
    //may want to turn this off if the user isn't on the loveliste page they probably don't want the page reloaded for them?
    setTimeout(function() { chrome.tabs.reload();},interval*productArray.length); //reload the tab when all  posts are done.
    //chrome.tabs.create({'url':'https://www.victoriassecret.com/lovelist/view'}); this works but in a way breaks the debugger
    /*,
      function( tab) {
      console.log(tab)
      }
      };
    */
};

var clearSite={
    "production":"https://www.victoriassecret.com",
    "test":"https://test-005.lbidts.com",
    "dev":"https://dev-005.lbidts.com",
    "pint":"https://vsdpint.lbidts.com"
};

var clearSiteArray = [
    "www.victoriassecret.com",
    "test-005.lbidts.com",
    "dev-005.lbidts.com",
    "vsdpint.lbidts.com"

];

//use a heart with a minus or the red circle with diagonal as a symbol to unheart.
function clearLoveList(cookieObject) {
    clearSiteArray.forEach( function(ele,ind,arr) {
	//cookieObject.site=ele;//"www.victoriassecret.com";
	var xhr = new XMLHttpRequest();
	//xhr.open('GET', 'https://'+cookieObject.site+'/lovelist/remove/all');
	xhr.open('GET', 'https://'+ele+'/lovelist/remove/all');
	//  xhr.open('GET', 'https://www.victoriassecret.com/lovelist/remove/all');
	xhr.onreadystatechange = function() {
	    if(xhr.readyState == 4 && xhr.status == 200) {
		console.log(xhr.responseText);
		var xhrRT = JSON.parse(xhr.responseText);
		document.getElementById('count').textContent = xhrRT.count;
		document.getElementById('unavailableCount').textContent = xhrRT.unavailableCount;
	    } else {
		console.log(xhr)
	    }
	};
	xhr.send();
    });
    chrome.tabs.reload();
};

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
    paramName=[ 
	"UID", 
	"X-Mapping-omgbnpna", 
	"cmTPSet", 
	"vShip", 
	"VSSESSION",
	"vsPopUnder"];

    chrome.cookies.get( {"url":mysite,"name":"UID"} ,function(data) {
	var element =  document.getElementById(target);
	console.log(data);
	if (typeof data !== 'undefined' && data !== null ) {
	    console.log(data.value);
	    element.textContent = data.value;
	} 
	
    });

    chrome.cookies.getAll( {} , function(cookieList) {
	var clength = cookieList.length;
	console.log(clength);
	for (var x=0; x < clength; x++)
	{
	    if (cookieList[x].domain == mysite) {
		console.log(cookieList[x].name+' / '
			    +cookieList[x].value); //create a key value pair from these two.
		myObj[cookieList[x].name] = cookieList[x].value;
	    }
	    //        console.log(cookieList[x].name+' / '+cookieList[x].value);
	    //        console.log(cookieList[x].domain);
	}
    });
    console.log(myObj);
    return myObj;
};

document.addEventListener('DOMContentLoaded', function() {
    console.log("get cookie");
    var cookieData=getCookie("cookieContent");
    //clearLoveList(cookieData);
    //addToLoveList();
    //showPopup();
});

//two equivalent methods to bind
document.getElementById('autoLoveList').onclick = addToLoveList; //addEventListener('click',addToLoveList);
document.getElementById('clearLoveList').addEventListener('click',clearLoveList);

// function showPopup() { //why does this open a billion tabs? I think bc it is executed once per tab that we already have open
// chrome.tabs.create({'url':'popup.html'});
// };

