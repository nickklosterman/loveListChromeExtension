var urlBase = "https://vsdpint.lbidts.com", //"https://www.victoriassecret.com",
    productObjectArray= new Array(),
    productImageArray = new Array();


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
    /*var menu =*/ parseMenu(xhr.responseText);
    /* why is this even being called? I'm calling parseProduct from within parseMenu
       if (typeof menu === 'Array')  {
       menu.forEach(function(ele,ind,arr) {
       XHRGet(ele,parseProduct);
       });
       } else {
       console.log("nope not array; GD Async nature");
       };
     */
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
    //this code transforms a string like this:
    //  <a title="Love It" class="loveItIcon" data-product-id="230059" data-product-catalog="LK" data-product-path="/bras/shop-all-bras/push-up-bra-so-obsessed-by-victorias-secret?ProductID=230059&amp;CatalogueType=OLS" data-love-list-service="heart" data-category-id="SHOP ALL BRAS AA - DDD(BRAS/SHOP-ALL-BRAS)" data-item-id="332186"> <em></em> </a>
    // to an object like this:
    //{product-id: "230059", product-catalog: "LK", product-path: "/bras/shop-all-bras/push-up-bra-so-obsessed-by-victorias-secret?ProductID=230059&amp;CatalogueType=OLS", category-id: "SHOP ALL BRAS AA - DDD(BRAS/SHOP-ALL-BRAS)", product-name: "push-up-bra-so-obsessed-by-victorias-secret"}

    var eleObj = ele.replace(/^.*data-product-id/,'{"product-id').replace(/ data-item-id.*/,'}').replace(/data-/g,'').replace(/love-list-service="heart" /,'').replace(/="/g,'":"').replace(/" /g,'", ').replace(/\r/,'').replace(/, /g,', "');
    eleObj = JSON.parse(eleObj);
    var shortProductName=((eleObj["product-path"]).split('/'));
    eleObj['product-name'] = (shortProductName[shortProductName.length-1]).replace(/\?.*/,'');
    arr[ind]=eleObj;
    productObjectArray.push(eleObj);
  });
  productArray.forEach(function(ele,ind,arr){
    console.log(ele);
  })
  getImageURLs(); //we really want to run this after productObjectArray is fully populated at the end of parseMenu
};

function getImageURLs() {
  productObjectArray.forEach(function(ele,ind,arr){
    //perform XHR on ele.product-path on the response, grab getElementById("vsImage") and parse out 'data-zoom-src' document.getElementById("vsImage").getAttribute("data-zoom-src")
    var encodedURL=(urlBase+ele['product-path']).replace(/amp;/,'');
    XHRGet(encodedURL /*(urlBase+ele['product-path']*/,function(response) {
      var resArray = response.split('\n');
      var productArray = resArray.filter(function(objectEle) {
	                   if (objectEle.indexOf("data-zoom-src")!==-1){
	                     return true;
	                   } else {
	                     return false;
	                   };
                         });
      productArray.forEach(function(ele_,ind_,arr_){
        var imageURL = ele_.replace(/^.*data-zoom-src="/,'').replace(/".*/,'');
        console.log(imageURL);
        productImageArray.push(imageURL);
      });
    });
  });
};

/*
Extract the links for the various collection pages
 */
function parseMenu(res){
  //the response is initially a string containing the page data so we split it which gives us an array
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
