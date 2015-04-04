//clear appears to be a builtin function so it causes problems.

//need to validate that there are products to love, also must have a site selected

function createCommaDelimitedStringFromArray(array){
    var csv = "",
    arrayLength=array.length;
    array.forEach(function(element,index,array){
	if (index === array.length-1) {
	    csv+=element;
	} else {
	    csv+=element+", ";
	}
    });
    return csv;
}

function clearSiteSelection() {
    var site = document.getElementById("site"),
    siteLength = site.length;
    
    for (var y = 0; y < siteLength; y++)
    {
        site.children[y].selected = false; //clear out any selections prior to load.
    }
}
function loadIPAddressFromLocalStorage(){
    var ipAddr = localStorage["ipAddr"] || "127.0.0.1";
    var ipAddrSelect = document.getElementById("ipAddr");
    ipAddrSelect.value = ipAddr;
}

function loadClearBeforeAdditionFromLocalStorage(){
    var clearBeforeAddition = localStorage["clearBeforeAddition"] || false,
    clearSelect = document.getElementById("clearBeforeAddition");
    
    clearSelect.checked = clearBeforeAddition;
}

function loadSiteFromLocalStorage(){
    var site = document.getElementById("site"),
    siteLength = site.length,
    siteLS = localStorage["site"],
    siteChoices = [] ,
    siteChoiceLength; 
    
    if ( typeof siteLS !== 'undefined') {
	siteChoices = JSON.parse(localStorage["site"]);
    } 
    siteChoiceLength = siteChoices.length;
    
    clearSiteSelection();
    for (var x = 0; x <= siteChoiceLength; x++)
    {
	for (var y = 0; y < siteLength; y++)
	{
	    if (site.children[y].value === siteChoices[x])
	    {
		site.children[y].selected = true;
		break;
	    }
	} 
    }
}
function loadProductIdFromLocalStorage(selector) {
    var selection = document.getElementById(selector),
    LS = localStorage[selector];
    if (typeof LS !== 'undefined') {
	selection.value = createCommaDelimitedStringFromArray(JSON.parse(LS));
    } else {
	selection.value = ""; //empty list but this should generate an error
    }
}

function loadTestProductIdFromLocalStorage(){
    loadProductIdFromLocalStorage("testProductId");
}
function loadProductionProductIdFromLocalStorage(){
    loadProductIdFromLocalStorage("productionProductId");
}

function loadPortFromLocalStorage() {
    var selection = document.getElementById("port");
    selection.value = localStorage["port"];
}

function loadOptions() {
    loadIPAddressFromLocalStorage();

    loadPortFromLocalStorage();
    loadClearBeforeAdditionFromLocalStorage();
    loadSiteFromLocalStorage();
    loadProductionProductIdFromLocalStorage();
    loadTestProductIdFromLocalStorage();
}

function saveOptions() {
    //move all localStorage calls to the end?
    var ipAddrSelect = document.getElementById("ipAddr"),
    ipAddr = ipAddrSelect.value.trim(), 
    portSelect = document.getElementById("port"),
    port = portSelect.value.trim(),
    siteSelect,
    sSLength,
    siteChoices,
    productionProductIdSelect,
    productionProductArray,
    testProductIdSelect,
    testProductArray,
    clearSelect,
    clearBeforeAddition;

    siteSelect = getSiteSelectionFromDOM();

    if (!checkIsIPV4(ipAddr)) {
	ipAddrSelect.style.background = "red"
	document.getElementById("errorBanner").textContent = "Invalid Ip Address";
	return
    } else {
	ipAddrSelect.style.background = "none";
    }
    localStorage["ipAddr"] = ipAddr || "127.0.0.1";

    localStorage["port"] = port || "8080";

    siteSelect = document.getElementById("site");
    sSLength = siteSelect.children.length;
    siteChoices = [];

    for ( var x = 0; x < sSLength; x++)
    {
	if ( siteSelect.children[x].selected === true )
	{
	    siteChoices.push(siteSelect.children[x].value);
	}
    }
    //  var siteChoice = siteSelect.children[siteSelect.selectedIndex].value;
    localStorage["site"] = siteChoices.length > 0 ?
	JSON.stringify(siteChoices) :
	"test";
    
    productionProductIdSelect = document.getElementById("productionProductId");
    productionProductArray = productionProductIdSelect
        .value
        .split(",");
    localStorage["productionProductId"] = productionProductArray.length > 0 ?
	JSON.stringify(productionProductArray):
	"229509";
    
    testProductIdSelect = document.getElementById("testProductId");
    testProductArray = testProductIdSelect
        .value
        .split(",");
    localStorage["testProductId"] = testProductArray.length > 0 ?
	JSON.stringify(testProductArray):
	"112731";

    clearSelect = document.getElementById("clear");
    clearBeforeAddition = clearSelect.value;
    localStorage["clearBeforeAddition"] = clearBeforeAddition || false;


}

function eraseOptions() {
    var localStorageItems = ["ipAddr",
                             "port",
                             "site",
                             "clearBeforeAddition",
                             "testProductId",
                             "productionProductId"];

    localStorageItems.forEach(function(element,index,array) {
	localStorage.removeItem(element);
    });

    location.reload(); //???? what does this do? is this the function that is calling the loadOptions
}

function checkIsIPV4(entry) {
    // this doens't allow for port numbers, assume 8080?
    var blocks = entry.split(".");
    if(blocks.length === 4) {
	return blocks.every(function(block) {
            return !isNaN(block) &&  parseInt(block,10) >=0 && parseInt(block,10) <= 255;
        });
    }
    return false;
}

/*
 
 function autoLoveList() {
    document.getElementById("errorBanner").textContent="auto";
}

function clearLoveList() {
    document.getElementById("errorBanner").textContent="clear";
}
*/

function getSiteSelectionFromDOM() {
    var site = document.getElementById("site"),
    returnArray = [];
    for ( var i=0; i<site.length; i++ ) {
	if ( site[i].selected === true ) {
	    returnArray.push(site[i].value);
	}
    }
    return returnArray;
}


document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('saveOptions').addEventListener('click',saveOptions);
document.getElementById('eraseOptions').addEventListener('click',eraseOptions);
document.getElementById('loadOptions').addEventListener('click',loadOptions);
document.getElementById('autoLoveList').addEventListener('click',autoLoveList);
document.getElementById('clearLoveList').addEventListener('click',clearLoveList);
