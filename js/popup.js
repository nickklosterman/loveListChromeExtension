
function addToLoveList(){
    var site = ["www.victoriassecret.com", "10.7.19.134","10.7.35.134","localhost:8080", "test-005.lbidts.com", "dev-005.lbidts.com"];
    //site = ["test-005.lbidts.com"];
    //site = ["localhost:8080"];
  if (getClearListBeforeAdding()===true) {
    clearLoveList();
  }
  var tempSiteSelection = getSiteSelectionFromDOM();

  if (tempSiteSelection.length > 0 && Array.isArray(tempSiteSelection))
  {
    site = tempSiteSelection;
  }

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
	code = "LL";//LJ"; LM is current as of 2015/03/19
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
    var interval = 150;
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
  var tempCSA = getSiteSelectionFromDOM();

if (tempCSA.length > 0 && Array.isArray(tempCSA))
  {
    clearSiteArray = tempCSA;
  }
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

function getClearListBeforeAdding() {
 //var rValue = document.getElementById('clearBeforeAddition').value === "on" ? true : false;
//var bob = document.getElementById('clearBeforeAddition');
return document.getElementById('clearBeforeAddition').checked;
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

function ajaxSuccess(){
    
    var errorFlag = false
    ele={id:"bob"};
    if (this.responseText.indexOf("Service Unavailable")>0){
	console.log(ele.id+" is unavailable.");
	errorFlag = true;
    }
    if (this.responseText.indexOf("HTTP ERROR 500")>0){
	console.log(ele.id+" is borked.");
	errorFlag = true;
    }
    if (!errorFlag) {
	console.log(ele.id+" is kicking ass.");
    }
};

function checkSiteStatus() {

    //add in a spinner for updates ; the id is used ot match the id in the DOM it matches the id and the glyph id
    var siteArray = [{id:"dev",url:"https://dev-005.lbidts.com"},
		     {id:"test",url:"https://test-005.lbidts.com"},
		     {id:"pint",url:"https://vsdpint.lbidts.com"},
		     {id:"proofing",url:"https://proofing.lbidts.com"}
		    ],
	interval=25; //use an interval and space out the xhr so we don't hammer the site.
    siteArray.forEach(function(ele,ind,arr){
	setTimeout(function(ele) {
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET',ele.url,true);
	    //xhr.onload = ajaxSuccess;
	    xhr.onreadystatechange = function() {
		var errorFlag = false,
		    status="unknown";
		// state 4 = the request is complete; the other states are less useful
		if (xhr.readyState == 4) {
		    //		    console.log(ele.id+': response.body'+xhr.responseText);

		    //check response code instead.
		    if ( xhr.status !== 200) {
			switch (xhr.status) {
			case 500:
			    console.log(ele.id+" is borked.");
			    message=ele.id+" is b0rked.";
			    status="down";
			    errorFlag = true;

			    break;
			case 403:
			    console.log(ele.id+" is returning an access denied message.");
			    message=ele.id+" is returning an access denied message.";
			status="unavailable";
			    break;

			}
			//The Service Unavailable serves up a 500, so we'll overwrite when its 500 but gives the Service Unavailable message instead of the pure http error 500 message with the stack trace
			if (xhr.responseText.indexOf("<h2>Service Unavailable</h2>")>0){
			    console.log(ele.id+" is unavailable.");
			    message=ele.id+" is unavailable (build in progress).";
			    status="unavailable";
			    errorFlag = true;
			}

		    } else {

			//check that the global.js, wrapper.css, home.css is loading as a proxy for a check on checking that not just the html page but also the libraries are also being loaded.
			
			var searchTerm = "global.js",
			    globalLocation = xhr.responseText.indexOf(searchTerm),
			    xhr2 = new XMLHttpRequest(),
			    url_,url,
			    re = /<script src=\".*script\/base\/global.js\"><\/script>/;

			startpos=xhr.responseText.search(re);
			if (startpos > 0) {
			    //global.js = 9 chars long
			    url_ = xhr.responseText.substr(startpos, globalLocation+searchTerm.length-startpos);
			    //			    url.replace("<script src=","https:");//
			    //url.replace("script","https:");
			     url = url_.replace(/<script src="/,"https:");
			    //url.replace(/script/,"https:",i);
			    xhr2.open('GET',url,true);
			    xhr2.onreadystatechange = function() {
				if (xhr2.readyState == 4 ) {
				    if (xhr2.status === 200) { //use switch statement instead?
					document.getElementById(iconEle).className="circ up";
				    } else if (xhr2.status === 400) {
					document.getElementById(iconEle).className="circ partiallyUp";
				    }
				}
			    };
			}

		    
			xhr2.send();
			
			status="up";
			console.log(ele.id+" is kicking ass.");
			message=ele.id+" is kicking ass.";
		    }
		    //		    document.getElementById(ele.id).textContent= message;
		    var iconEle = ele.id+"-glyph";

		    //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
		    //		    document.getElementById(iconEle).classList.add(status);
		    document.getElementById(iconEle).className="circ "+status;
			
		}

	    };
	    xhr.send();
	},interval*ind,ele)
    });

    
}

document.getElementById('status').onclick = checkSiteStatus;

//http://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery
document.addEventListener("DOMContentLoaded", function(event) {
//check status on startup
    checkSiteStatus();
    //make links clickable http://stackoverflow.com/questions/8915845/chrome-extension-open-a-link-from-popup-html-in-a-new-tab
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
	(function () {
	    var ln = links[i];
	    var location = ln.href;
	    ln.onclick = function () {
		chrome.tabs.create({active: true, url: location});
	    };
	})();
    }
});


// function showPopup() { //why does this open a billion tabs? I think bc it is executed once per tab that we already have open
// chrome.tabs.create({'url':'popup.html'});
// };

//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
//if wanted to make it standalone icon use https://developer.chrome.com/extensions/browserAction#event-onClicked browser action instead of pageaction
//http://stackoverflow.com/questions/2227062/how-do-i-move-a-git-branch-out-into-its-own-repository move branch to own repo
