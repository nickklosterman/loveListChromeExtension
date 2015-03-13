* Create input field for productIds, attempt to split on space or comma and parse into an array. or leave as is? parse so its in a known state.
* Option to crawl and auto pull in items - crawling and output done
* Clean up dead code
* Select which site to run the auto-lover on; How to select? dropdown? radio button? multipe checkboxes?
* checkbox to enable clear out the lovelist before adding
* create productID scraper ; can't use wget to get pages but use `grep "a href=" file.html | sed 's/^.*cover-ups\///;s/&amp.*//;s/\?ProductID=/ /' | uniq | sed 's/^/{"name":"/;s/ /","productID":"/;s/$/"},/'` will get you the productIDs from a page in a format ready for dumping into an array. ***you need to change `cover-ups` to whatever for the page you snagged.
* add input of id or switch for textbox to allow input of this array data for processing.
* only enable the plugin on the VS sites.
* open the https://www.victoriassecret.com/lovelist/view page in a new window to show them what's been added. 