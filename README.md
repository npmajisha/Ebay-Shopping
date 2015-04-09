# eBayShopping

http://searchebay-env.elasticbeanstalk.com

A responsive web application which provides a minimalistic eBay Shopping experience.
The web server [ configuration : 64bit Linux 2014.09 v1.2.0 running PHP5.5] is hosted on
Amazon's AWS Elastic Beanstalk.

The server-side scripting is written in PHP which uses AJAX to make the eBay API call - 
http://developer.eBay.com/DevZone/finding/CallRef/findItemsAdvanced.html.

The PHP script formats the XML returned from the API call into a lightweight JSON object.
The JSON object is parsed and rendered to the user interface using Javascript/jQuery libraries.
Bootstrap framework has been extensively used to add responsiveness to the web application.

The web application provides support to post the search result to Facebook. This is implemented using
the FB.UI feed dialog API.

