var urlBase = "https://www.victoriassecret.com";

function getVS(){
    // $.ajax({url:"https://www.victoriassecret.com"},function(response){
    // 	console.log(response);
    // });
    
    var xhr = new XMLHttpRequest();
    var interval = 100;
    xhr.open('GET',urlBase,false);
    xhr.send(null);

    if (xhr.status === 200) {
//	console.log("200");
//	console.log(xhr.responseText);
	var menu = parseMenu(xhr.responseText);
	if (typeof menu === 'Array')  {
	    menu.forEach(function(ele,ind,arr) {
		XHRGet(ele,parseProduct);
	    });
	} else {
	    console.log("nope not array; GD Async nature");
	};
    } else {
	console.log('blah');
    }
  
};
function XHRGet(url,callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET',url,false);
    xhr.send(null);

    if (xhr.status === 200) {
	callback(xhr.responseText);
    } else {
	console.log('XHRGet failed on '+url);
    }
    
};
/*
parse the collection pages for the product ids
*/
function parseProduct(res) {
    //console.log("parseProduct:"+res);
    var resArray = res.split('\n');
    var productArray = resArray.filter(function(ele) {
	if (ele.indexOf("data-product-id")!==-1){
	    return true;
	} else {
	    return false;
	};
    });
   productArray.forEach(function(ele,ind,arr) {
       //console.log(ele.replace(/^.*data-product-id/,'{product-id').replace(/ data-item-id.*/,'}').replace(/data-/g,'').replace(/love-list-service="heart"/,'').replace(/="/g,':"').replace(/" /g,'",'));
       arr[ind]=ele.replace(/^.*data-product-id/,'{product-id').replace(/ data-item-id.*/,'}').replace(/data-/g,'').replace(/love-list-service="heart"/,'').replace(/="/g,':"').replace(/" /g,'", ');
   });
    productArray.forEach(function(ele,ind,arr){
	console.log(ele);
    })

};

/*
Extract the links for the various collection pages
*/
function parseMenu(res){
//the response is initially a string so we split it which gives us an array
    var resArray = res.split('\n');
//    console.log(resArray.length);
//    console.log( typeof resArray[0]);
    var menuArray = resArray.filter(function(ele) {
	
	if (ele.indexOf("TOP NAVIGATION ALL AT ONCE")!==-1){
	    return true;
	} else {
	    return false;
	};
    });
//    console.log(menuArray.length);
    menuArray.forEach(function(ele,ind,arr) {
	//	console.log(ele.replace(/^.*href="/,'').replace(/".*/,''));
	if (ele.indexOf('http://') !== -1 ) {
	    arr[ind]=ele.replace(/^.*href="/,'').replace(/".*/,''); //some have a full http in the url
	} else {
	    arr[ind]=ele.replace(/^.*href="/,urlBase).replace(/".*/,''); //strip out the unnecessary tag data
	}
    });
    menuArray.forEach(function(ele,ind,arr){
	//console.log(ele);
	var interval = 100;
	setTimeout(XHRGet,interval*ind,ele,parseProduct); //hammering the site wo an interval makes the site pissy and it shits the bed
//	XHRGet(ele,parseProduct); //actually this might be ok as long as we don't have a url that breaks the XHR get request
    })
		      
};
document.getElementById('vs').onclick = getVS;
