var http = require('https');
var XMLHttpRequest = require("request");
function ProductIds(parameter) {
    this.url = "https://www.victoriassecret.com"; ///fuck you need https for https

    if (parameter &&
	parameter['url']) {
	this.url = parameter['url'];
    }
}
ProductIds.prototype.getVS = function(){
    var xhr = new XMLHttpRequest();
    var interval = 100;
    xhr.open('GET',this.url,false);
    xhr.send(null);

    if (xhr.status === 200) {
//	console.log("200");
//	console.log(xhr.responseText);
	var menu = this.parseMenu(xhr.responseText);
	if (typeof menu === 'Array')  {
	    menu.forEach(function(ele,ind,arr) {
		this.XHRGet(ele,parseProduct);
	    });
	} else {
	    console.log("nope not array; GD Async nature");
	};
    } else {
	console.log('blah');
    }
/*
    options  = {
	hostname:'https://www.victoriassecret.com',
	headers:{
	    'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
	}
    },
    //    http.get('https://encrypted.google.com/', function(res) {
        http.get(options, function(res) {
	console.log("statusCode: ", res.statusCode);
	console.log("headers: ", res.headers);

	res.on('data', function(d) {
	    process.stdout.write(d);
	});

    }).on('error', function(e) {
	console.error(e);
    });

    ///--------------------
    console.log(this.url);
    var options = {
	hostname: this.url
    },
	that =this;

    var req = http.get(options, function(res) {
	console.log('headers:\n' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
	    console.log('body:\n' + chunk);
	    this.parseMenu(chunk)
	});
    });

    req.on('error', function(e) {
	console.log(e);
	console.log('problem with '+that.url+' request: ' + e.message);
    });
    req.end();

  */
};
ProductIds.prototype.XHRGet=function(url,callback){
        var xhr = new XMLHttpRequest();
    xhr.open('GET',url,false);
    xhr.send(null);

    if (xhr.status === 200) {
	callback(xhr.responseText);
    } else {
	console.log('XHRGet failed on '+url);
    }
/*
    var options = {
	hostname: url,
	port: 80,
	method: 'GET'
    };

    var req = http.request(options, function(res) {
	console.log('headers:\n' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
	    console.log('body:\n' + chunk);
	    callback(chunk)
	});
    });

    req.on('error', function(e) {
	console.log('problem with request: ' + e.message);
	
    });
    req.end();
*/
};
/*
parse the collection pages for the product ids
*/
ProductIds.prototype.parseProduct=function(res) {
    var resArray = res.split('\n');
    var productArray = resArray.filter(function(ele) {
	if (ele.indexOf("data-product-id")!==-1){
	    return true;
	} else {
	    return false;
	};
    });
    productArray.forEach(function(ele,ind,arr) {
	//prep the string makign it json-ish by removing unneeded tags, =->:,
       arr[ind]=ele.replace(/^.*data-product-id/,'{product-id').replace(/ data-item-id.*/,'}').replace(/data-/g,'').replace(/love-list-service="heart"/,'').replace(/="/g,':"').replace(/" /g,'", ');
   });
    productArray.forEach(function(ele,ind,arr){
	console.log(ele);
    })

};

/*
Extract the links for the various collection pages
*/
ProductIds.prototype.parseMenu=function(res){
//the response is initially a string so we split it which gives us an array
    var that = this;
    var resArray = res.split('\n');
    var menuArray = resArray.filter(function(ele) {
	
	if (ele.indexOf("TOP NAVIGATION ALL AT ONCE")!==-1){
	    return true;
	} else {
	    return false;
	};
    });

    menuArray.forEach(function(ele,ind,arr) {
	if (ele.indexOf('http://') !== -1 ) {
	    arr[ind]=ele.replace(/^.*href="/,'').replace(/".*/,''); //some have a full http in the url so we don't need to add in the url
	} else {
	    arr[ind]=ele.replace(/^.*href="/,this.url).replace(/".*/,''); //strip out the unnecessary tag data
	}
    });
    menuArray.forEach(function(ele,ind,arr){
	var interval = 100;
	setTimeout(that.XHRGet,interval*ind,ele,that.parseProduct); //hammering the site wo an interval makes the site pissy and it shits the bed
//	XHRGet(ele,parseProduct); //actually this might be ok as long as we don't have a url that breaks the XHR get request
    })
		      
};

module.exports = ProductIds;
