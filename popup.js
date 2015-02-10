// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 **/
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
    '?v=1.0&q=' + encodeURIComponent(searchTerm);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
      typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
      'Unexpected respose from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}


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

/*
  getCurrentTabUrl(function(url) {
    // Put the image URL in Google search.
    renderStatus('Performing Google Image search for ' + url);

    getImageUrl(url, function(imageUrl, width, height) {

      renderStatus('Search term: ' + url + '\n' +
                   'Google image search result: ' + imageUrl);
      var imageResult = document.getElementById('image-result');
      // Explicitly set the width/height to minimize the number of reflows. For
      // a single image, this does not matter, but if you're going to embed
      // multiple external images in your page, then the absence of width/height
      // attributes causes the popup to resize multiple times.
      imageResult.width = width;
      imageResult.height = height;
      imageResult.src = imageUrl;
      imageResult.hidden = false;

    }, function(errorMessage) {
         renderStatus('Cannot display image. ' + errorMessage);
       });
  });
*/
});
