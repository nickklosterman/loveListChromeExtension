var urlBase = /*"https://vsdpint.lbidts.com", /urlBase =*/ "https://www.victoriassecret.com/pink",
    productObjectArray= new Array(),
    productImageArray = new Array(),
baseImageURI= "//dm.victoriassecret.com/product/760x1013/",
imageFileExtension=".jpg";


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
//print out the product element object
 // productArray.forEach(function(ele,ind,arr){
//    console.log(ele);
//  })
  getImageURLs(); //we really want to run this after productObjectArray is fully populated at the end of parseMenu
};

/*
 * 
 * */
function getImageURLs() {
  productObjectArray.forEach(function(ele,ind,arr){
    //perform XHR on ele.product-path on the response, grab getElementById("vsImage") and parse out 'data-zoom-src' document.getElementById("vsImage").getAttribute("data-zoom-src")
var urlBase2="https://www.victoriassecret.com";
    var encodedURL=(urlBase2+ele['product-path']).replace(/amp;/,''); //I need to escape the ampersand
//console.log(encodedURL);
    XHRGet(encodedURL /*(urlBase+ele['product-path']*/,function(response) {
      var resArray = response.split('\n');
      var productArray = resArray.filter(function(objectEle,idx,arr_) {
/*if (idx == 1736) {
console.log("foo")
}*/
	                   if (objectEle.indexOf('data-zoom-src')!==-1 &&
                               objectEle.indexOf('data-zoom-src=""')==-1 ||
                              objectEle.indexOf('data-main-image')!==-1 || //data-main-image see note below for data-alt-image
                              objectEle.indexOf('data-alt-images')!==-1) { //the data-alt-image is the base filename without extension or path e.g. V412464_CROP1  -> https://dm.victoriassecret.com/product/760x1013/V412464_CROP1.jpg
// $("span[data-alt-image]") is for production
// $("input[data-main-image]") is for test/dev
	                     return true;
	                   } else {
	                     return false;
	                   };
                         });
      productArray.forEach(function(ele_,ind_,arr_){
        var imageURL = ele_.replace(/^.*data-zoom-src="/,'').replace(/^.*data-main-image="/,'' /*urlBase*/).replace(/^.*span  data-alt-image="/,''/*urlBase*/).replace(/".*/,'');
//images that end in _OF_F are off model product images. 
//  also the majority of images *_RC* are also off model product images

/*
//add on file extension if not present.
  if (imageURL.indexOf(imageFileExtension) === -1) {
imageURL+=imageFileExtension;
}
//add on base URI if not present.
if (imageURL.indexOf(baseImageURI) === -1) {
var temp =baseImageURI+imageURL;
imageURL= temp
}
*/

        //assume that if an alt image that it needs the file extension and the baseImageURI
        if (imageURL.indexOf(imageFileExtension) === -1) {
          var temp ="wget -nc https:"+baseImageURI+imageURL+imageFileExtension;
          imageURL=temp;
        } else {
          temp = imageURL.replace(/^/,'wget -nc https:');
          imageURL = temp;
        }
        console.log(imageURL);
        productImageArray.push(imageURL);
      });
    });
  });
writeImageArray();
};

function writeImageArray() {
/*  fs.writeFile(this.imageDataFile,JSON.stringify(this.historicalStockData),function(err,wr,bf) {
        if (err){
            console.log("There was an error while writing to file.");
        } else {
            console.log("Wrote "+wr+" bytes to "+bf);
        }
    });
* /
for (var i=0;i<productImageArray.length;i++){
//I really don't want to console.log as in the debug window it lists the line of code that it came from.
productImageArray[i]
}*/

};

/*
Extract the links for the various collection pages
 */
function parseMenu(res){
  //the response is initially a string containing the page data so we split it which gives us an array
  var resArray = res.split('\n');
  //    console.log(resArray.length);
  //    console.log( typeof resArray[0]);
//create array of menu headings/product collections
/**/  var menuArray = resArray.filter(function(ele,idx,arr) {
/*if (idx ==1310 ) {
console.log("foo");
}*/
	            if (ele.indexOf("TOP NAVIGATION ALL AT ONCE")!==-1){

//	            if (ele.indexOf("NAVIGATION")!==-1){
	              return true;
	            } else {
	              return false;
	            };
                  });
/* * /
var menuArray = ['https://www.victoriassecret.com/bras/dream-angels']; //test array ['https://www.victoriassecret.com/bras/dream-angels',['https://www.victoriassecret.com/bras/very-sexy']; 
  menuArray=['https://www.victoriassecret.com/bras/dream-angels','https://www.victoriassecret.com/bras/very-sexy','https://www.victoriassecret.com/panties/thongs-and-v-strings','https://www.victoriassecret.com/panties/bikinis','https://www.victoriassecret.com/panties/cheekies-and-cheekinis'];*/
/*menuArray = ['https://www.victoriassecret.com/bras/shop-all-bras'
,'https://www.victoriassecret.com/bras/push-up'
,'https://www.victoriassecret.com/bras/full-coverage'
,'https://www.victoriassecret.com/bras/demi-cup'
,'https://www.victoriassecret.com/bras/unlined'
,'https://www.victoriassecret.com/bras/strapless-and-multi-way'
,'https://www.victoriassecret.com/bras/sports-bras'
,'https://www.victoriassecret.com/bras/very-sexy'
,'https://www.victoriassecret.com/bras/body-by-victoria-collection'
,'https://www.victoriassecret.com/bras/dream-angels'
,'https://www.victoriassecret.com/bras/t-shirt-bra'
,'https://www.victoriassecret.com/bras/cotton-lingerie'
,'https://www.victoriassecret.com/bras/bombshell'
,'https://www.victoriassecret.com/bras/victorias-secret-pink'
,'https://www.victoriassecret.com/bras/buy-more-and-save-bras'
,'https://www.victoriassecret.com/bras/buy-more-and-save-sports-bras'
,'https://www.victoriassecret.com/bras/pink-wear-everywhere-styles'
,'https://www.victoriassecret.com/bras/body-by-victoria'
,'https://www.victoriassecret.com/bras/very-sexy-collection'
,'https://www.victoriassecret.com/bras/summers-hottest-ten'
,'https://www.victoriassecret.com/bras/boho-vibes'
,'https://www.victoriassecret.com/bras/explore-the-guide'
,'https://www.victoriassecret.com/bras/personal-bra-boutique'
,'https://www.victoriassecret.com/bras/find-your-perfect-fit'
,'https://www.victoriassecret.com/bras/gift-cards'
,'https://www.victoriassecret.com/panties/shop-all-panties'
,'https://www.victoriassecret.com/panties/thongs-and-v-strings'
,'https://www.victoriassecret.com/panties/cheekies-and-cheekinis'
,'https://www.victoriassecret.com/panties/hiphuggers'
,'https://www.victoriassecret.com/panties/bikinis'
,'https://www.victoriassecret.com/panties/briefs'
,'https://www.victoriassecret.com/panties/no-show-and-seamless'
,'https://www.victoriassecret.com/panties/hosiery-and-garters'
,'https://www.victoriassecret.com/panties/5-for-27-styles'
,'https://www.victoriassecret.com/panties/4-for-29-styles'
,'https://www.victoriassecret.com/panties/3-for-33-styles'
,'https://www.victoriassecret.com/panties/body-by-victoria'
,'https://www.victoriassecret.com/panties/summers-hottest-ten'
,'https://www.victoriassecret.com/panties/cotton-panties'
,'https://www.victoriassecret.com/panties/panty-boutique'
,'https://www.victoriassecret.com/panties/lace-styles'
,'https://www.victoriassecret.com/panties/gift-cards'
,'https://www.victoriassecret.com/sleepwear/shop-all-sleep'
,'https://www.victoriassecret.com/sleepwear/pajamas'
,'https://www.victoriassecret.com/sleepwear/sleepshirts-and-nighties'
,'https://www.victoriassecret.com/sleepwear/lingerie'
,'https://www.victoriassecret.com/sleepwear/babydolls-and-slips'
,'https://www.victoriassecret.com/sleepwear/robes-and-slippers'
,'https://www.victoriassecret.com/sleepwear/separates'
,'https://www.victoriassecret.com/sleepwear/mayfair-collection'
,'https://www.victoriassecret.com/sleepwear/satin-indulgences'
,'https://www.victoriassecret.com/sleepwear/bridal-shop'
,'https://www.victoriassecret.com/sleepwear/sale-and-specials'
,'https://www.victoriassecret.com/sleepwear/sleep-steals'
,'https://www.victoriassecret.com/sleepwear/special-sleep-tees-and-more'
,'https://www.victoriassecret.com/sleepwear/new-arrivals'
,'https://www.victoriassecret.com/sleepwear/top-rated'
,'https://www.victoriassecret.com/sleepwear/boho-vibes'
,'https://www.victoriassecret.com/sleepwear/shorts-shop'
,'https://www.victoriassecret.com/sleepwear/gift-cards'
,'https://www.victoriassecret.com/beauty/shop-all-beauty'
,'https://www.victoriassecret.com/beauty/fragrance'
,'https://www.victoriassecret.com/beauty/all-body-care'
,'https://www.victoriassecret.com/beauty/travel-and-accessories'
,'https://www.victoriassecret.com/beauty/gift-sets'
,'https://www.victoriassecret.com/beauty/lip'
,'https://www.victoriassecret.com/beauty/hair-care'
,'https://www.victoriassecret.com/beauty/vs-fantasies-bodycare-specials'
,'https://www.victoriassecret.com/beauty/makeup-specials'
,'https://www.victoriassecret.com/beauty/pink-body-care-specials'
,'https://www.victoriassecret.com/beauty/vs-fantasies-collection'
,'https://www.victoriassecret.com/beauty/dream-angels'
,'https://www.victoriassecret.com/beauty/very-sexy-fragrance'
,'https://www.victoriassecret.com/beauty/victorias-secret-bombshell'
,'https://www.victoriassecret.com/beauty/victorias-secret-pink'
,'https://www.victoriassecret.com/beauty/mist-event-offer'
,'https://www.victoriassecret.com/beauty/top-rated'
,'https://www.victoriassecret.com/beauty/top-five-scents'
,'https://www.victoriassecret.com/beauty/find-your-fragrance'
,'https://www.victoriassecret.com/beauty/gift-cards'
,'https://www.victoriassecret.com/lingerie/shop-all-lingerie'
,'https://www.victoriassecret.com/lingerie/bras-and-panties'
,'https://www.victoriassecret.com/lingerie/teddies'
,'https://www.victoriassecret.com/lingerie/babydolls-and-slips'
,'https://www.victoriassecret.com/lingerie/garters'
,'https://www.victoriassecret.com/lingerie/gowns-and-kimonos'
,'https://www.victoriassecret.com/lingerie/vexy-sexy'
,'https://www.victoriassecret.com/lingerie/dream-angels'
,'https://www.victoriassecret.com/lingerie/bridal-boutique'
,'https://www.victoriassecret.com/lingerie/new-arrivals'
,'https://www.victoriassecret.com/lingerie/boho-vibes'
,'https://www.victoriassecret.com/lingerie/top-rated'
,'https://www.victoriassecret.com/lingerie/little-black-lingerie'
,'https://www.victoriassecret.com/lingerie/summers-hottest'
,'https://www.victoriassecret.com/lingerie/shop-all-bras'
,'https://www.victoriassecret.com/lingerie/shop-all-panties'
,'https://www.victoriassecret.com/lingerie/personal-bra-boutique'
,'https://www.victoriassecret.com/lingerie/gift-cards'
,'https://www.victoriassecret.com/swimwear/shop-by-size'
,'https://www.victoriassecret.com/swimwear/sale-and-specials'
,'https://www.victoriassecret.com/swimwear/clearance'
,'https://www.victoriassecret.com/swimwear/bottoms-sale'
,'https://www.victoriassecret.com/swimwear/tops-sale'
,'https://www.victoriassecret.com/swimwear/bikinis-sale'
,'https://www.victoriassecret.com/swimwear/bikinis'
,'https://www.victoriassecret.com/swimwear/one-pieces-tankinis'
,'https://www.victoriassecret.com/swimwear/cover-ups'
,'https://www.victoriassecret.com/swimwear/push-up'
,'https://www.victoriassecret.com/swimwear/bandeau'
,'https://www.victoriassecret.com/swimwear/halter'
,'https://www.victoriassecret.com/swimwear/all-tops'
,'https://www.victoriassecret.com/swimwear/itsy'
,'https://www.victoriassecret.com/swimwear/cheeky'
,'https://www.victoriassecret.com/swimwear/classic-bottoms'
,'https://www.victoriassecret.com/swimwear/all-bottoms'
,'https://www.victoriassecret.com/swimwear/back-in-stock'
,'https://www.victoriassecret.com/swimwear/bikini-mixer'
,'https://www.victoriassecret.com/swimwear/swim-stylist'
,'https://www.victoriassecret.com/swimwear/gift-cards'
,'https://www.victoriassecret.com/victorias-secret-sport/shop-all'
,'https://www.victoriassecret.com/victorias-secret-sport/sports-bras'
,'https://www.victoriassecret.com/victorias-secret-sport/pants-and-shorts'
,'https://www.victoriassecret.com/victorias-secret-sport/all-tops'
,'https://www.victoriassecret.com/victorias-secret-sport/accessories'
,'https://www.victoriassecret.com/victorias-secret-sport/panties'
,'https://www.victoriassecret.com/victorias-secret-sport/shop-sport-bras-by-size'
,'https://www.victoriassecret.com/victorias-secret-sport/front-close-bras'
,'https://www.victoriassecret.com/victorias-secret-sport/bra-guide'
,'https://www.victoriassecret.com/victorias-secret-sport/personal-bra-boutique'
,'https://www.victoriassecret.com/victorias-secret-sport/find-your-perfect-fit'
,'https://www.victoriassecret.com/victorias-secret-sport/all-sale-and-clearance'
,'https://www.victoriassecret.com/victorias-secret-sport/bras-sale'
,'https://www.victoriassecret.com/victorias-secret-sport/bottoms-sale'
,'https://www.victoriassecret.com/victorias-secret-sport/tops-sale'
,'https://www.victoriassecret.com/victorias-secret-sport/sport-bras-tops-shorts-specials'
,'https://www.victoriassecret.com/victorias-secret-sport/sport-panties-accessories-specials'
,'https://www.victoriassecret.com/victorias-secret-sport/bottom-guide'
,'https://www.victoriassecret.com/victorias-secret-sport/gift-cards'
,'https://www.victoriassecret.com/clothing/shop-all'
,'https://www.victoriassecret.com/clothing/all-tops-c'
,'https://www.victoriassecret.com/clothing/hoodies-tunics'
,'https://www.victoriassecret.com/clothing/sweaters'
,'https://www.victoriassecret.com/clothing/bottoms'
,'https://www.victoriassecret.com/clothing/yoga-and-leggings'
,'https://www.victoriassecret.com/clothing/dresses-c'
,'https://www.victoriassecret.com/clothing/shoes'
,'https://www.victoriassecret.com/clothing/all-handbags-and-accessories-c'
,'https://www.victoriassecret.com/clothing/all-sale-and-specials'
,'https://www.victoriassecret.com/clothing/clearance'
,'https://www.victoriassecret.com/clothing/cover-ups-steals'
,'https://www.victoriassecret.com/clothing/tops-sale'
,'https://www.victoriassecret.com/clothing/bottoms-sale'
,'https://www.victoriassecret.com/clothing/fleece-sale'
,'https://www.victoriassecret.com/clothing/buy-more-and-save-tees'
,'https://www.victoriassecret.com/clothing/yoga-pants-leggings'
,'https://www.victoriassecret.com/clothing/new-arrivals'
,'https://www.victoriassecret.com/clothing/fleece-favorites'
,'https://www.victoriassecret.com/clothing/tee-shop'
,'https://www.victoriassecret.com/clothing/gift-card'
,'https://www.victoriassecret.com/sale/bras'
,'https://www.victoriassecret.com/sale/panties'
,'https://www.victoriassecret.com/sale/sleepwear'
,'https://www.victoriassecret.com/sale/beauty'
,'https://www.victoriassecret.com/sale/swim'
,'https://www.victoriassecret.com/sale/vsx-sport'
,'https://www.victoriassecret.com/sale/clothing'
,'https://www.victoriassecret.com/sale/pink'
,'https://www.victoriassecret.com/sale/bras-special'
,'https://www.victoriassecret.com/sale/pink-wear-everywhere'
,'https://www.victoriassecret.com/sale/panties-special'
,'https://www.victoriassecret.com/sale/vs-fantasies-bodycare-special'
,'https://www.victoriassecret.com/sale/sleep-tees-and-more'
,'https://www.victoriassecret.com/sale/yoga-pants-and-leggings'
,'https://www.victoriassecret.com/sale/clearance-bras'
,'https://www.victoriassecret.com/sale/clearance-panties'
,'https://www.victoriassecret.com/sale/clearance-sleep'
,'https://www.victoriassecret.com/sale/clearance-swim'
,'https://www.victoriassecret.com/sale/clearance-sport'
,'https://www.victoriassecret.com/sale/clearance-clothing'
,'https://www.victoriassecret.com/sale/clearance-shoes-accessories'
,'https://www.victoriassecret.com/sale/clearance-pink'
,'https://www.victoriassecret.com/sale/gift-card']
*/
    menuArray = ['https://www.victoriassecret.com/swimwear/itsy'];
  //    console.log(menuArray.length);
  menuArray.forEach(function(ele,ind,arr) {
    //	console.log(ele.replace(/^.*href="/,'').replace(/".*/,''));
var urlBase2='https://www.victoriassecret.com'; //used for when crawling pink
    //create a fully qualified url
    if (ele.indexOf('http://') !== -1 ) {
      arr[ind]=ele.replace(/^.*href="/,'').replace(/".*/,''); //some have a full http in the url
    } else {
      arr[ind]=ele.replace(/^.*href="/,/*urlBase2*/urlBase2).replace(/".*/,''); //strip out the unnecessary tag data
    }
  });
  menuArray.forEach(function(ele,ind,arr){
//    console.log(ele);
    var interval = 100;
    setTimeout(XHRGet,interval*ind,ele,parseProduct); //hammering the site wo an interval makes the site pissy and it shits the bed

    //	XHRGet(ele,parseProduct); //actually this might be ok as long as we don't have a url that breaks the XHR get request
  })
  
};
document.getElementById('vs').onclick = getVS;
