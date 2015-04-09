<?php



//Function to check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}


function parse_xml($xml){
    


if($xml->paginationOutput->totalEntries == 0){
    $json_output["ack"] = "No results found"; 
}
else{
    $json_output["ack"] = (string)$xml->ack;
    $json_output["resultCount"] = (string)$xml->paginationOutput->totalEntries;
    $json_output["pageNumber"] = (string)$xml->paginationOutput->pageNumber;
    $json_output["itemCount"] = (string)$xml->paginationOutput->entriesPerPage;
}

$count=0;
foreach($xml->searchResult->item as $item){
    
    //basic info
    $basic_info["title"]= (string)$item->title;
    $basic_info["viewItemURL"]=(string)$item->viewItemURL;
    $basic_info["galleryURL"]=(string)$item->galleryURL;
    if(isset($item->pictureURLSuperSize)){
        $basic_info["pictureURLSuperSize"]=(string)$item->pictureURLSuperSize;
    } else {
        $basic_info["pictureURLSuperSize"]=(string)$item->galleryURL;
    }
    
    $basic_info["convertedCurrentPrice"]=(string)$item->sellingStatus->convertedCurrentPrice;
    $basic_info["shippingServiceCost"]=(string)$item->shippingInfo->shippingServiceCost;
    if(isset($item->condition->conditionDisplayName)){
        $basic_info["conditionDisplayName"]=(string) $item->condition->conditionDisplayName;
    } else {
        $basic_info["conditionDisplayName"]="N/A";
    }
    
    if(isset($item->listingInfo->listingType)){
        $basic_info["listingType"]=(string) $item->listingInfo->listingType;
    }
    else {
        $basic_info["listingType"]= "N/A";
    }
    
    if(isset($item->location)){
        $basic_info["location"]=(string)$item->location;
    }
    else {
        $basic_info["location"]= "N/A";
    }
    
    if(isset($item->primaryCategory->categoryName)){
        $basic_info["categoryName"]=(string)$item->primaryCategory->categoryName;
    }
    else {
        $basic_info["categoryName"] = "N/A";
    }
    
    if(isset($item->topRatedListing)){
        $basic_info["topRatedListing"]=(string)$item->topRatedListing;
    }
    else {
        $basic_info["topRatedListing"]= "N/A";
    }
    
    
    //seller info
    if(isset($item->sellerInfo->sellerUserName)){
        $seller_info["sellerUserName"]=(string)$item->sellerInfo->sellerUserName;
    }
    else {
        $seller_info["sellerUserName"]= "N/A";
    }
    
    
    if(isset($item->sellerInfo->feedbackScore)){
        $seller_info["feedbackScore"]=(string)$item->sellerInfo->feedbackScore;
    }
    else {
        $seller_info["feedbackScore"]= "N/A";
    }
    
    if(isset($item->sellerInfo->positiveFeedbackPercent)){
        $seller_info["positiveFeedbackPercent"]=(string)$item->sellerInfo->positiveFeedbackPercent;
    }
    else {
        $seller_info["positiveFeedbackPercent"]= "N/A";
    }
    
    if(isset($item->sellerInfo->feedbackRatingStar)){
        $seller_info["feedbackRatingStar"]=(string)$item->sellerInfo->feedbackRatingStar;
    }
    else {
        $seller_info["feedbackRatingStar"]="N/A";
    }
    
    if(isset($item->sellerInfo->topRatedSeller)){
        $seller_info["topRatedSeller"]=(string)$item->sellerInfo->topRatedSeller;
    }
    else {
        $seller_info["topRatedSeller"]="N/A";
    }
    
    if(isset($item->storeInfo->storeName)){
          $seller_info["sellerStoreName"]=(string)$item->storeInfo->storeName;
    }
    else {
          $seller_info["sellerStoreName"]="N/A";
    }
    
    if(isset($item->storeInfo->storeName)){
        $seller_info["sellerStoreURL"]=(string)$item->storeInfo->storeURL;
    }
    else {
        $seller_info["sellerStoreURL"]="N/A";
    }
    
    
    //shipping info
    if(isset($item->shippingInfo->shippingType)){
        $shipping_info["shippingType"]=(string)$item->shippingInfo->shippingType;
    }
    else {
        $shipping_info["shippingType"]="N/A";
    }
    
    
    if(isset($item->shippingInfo->expeditedShipping)){
        $shipping_info["expeditedShipping"]=(string)$item->shippingInfo->expeditedShipping;
    }
    else {
        $shipping_info["expeditedShipping"] = "N/A";
    }
    
    if(isset($item->shippingInfo->oneDayShippingAvailable)){
        $shipping_info["oneDayShippingAvailable"]=(string)$item->shippingInfo->oneDayShippingAvailable;
    }
    else {
         $shipping_info["oneDayShippingAvailable"]="N/A";
    }
    
    if(isset($item->returnsAccepted)){
        $shipping_info["returnsAccepted"]=(string)$item->returnsAccepted;
    }
    else {
        $shipping_info["returnsAccepted"]="N/A";
    }
    
    if(isset($item->shippingInfo->handlingTime)){
        $shipping_info["handlingTime"]=(string)$item->shippingInfo->handlingTime;
    }
    else {
        $shipping_info["handlingTime"]= "N/A";
    }
    

$l = 0;    
foreach($item->shippingInfo->shipToLocations as $location){
    if($l == 0){
        $locations = $location;
    }
    else{
    $locations .= ",".$location;
    }
    $l++;
}
    
    if ($locations == ''){
        $shipping_info["shipToLocations"]="N/A";
    } else {
        $shipping_info["shipToLocations"]=(string)$locations;
    }
    
$json_output["item".$count]["basicInfo"] = $basic_info ;
$json_output["item".$count]["sellerInfo"]= $seller_info;
$json_output["item".$count]["shippingInfo"]= $shipping_info;


$count++;
}
return $json_output;
}

$url = "http://svcs.ebay.com/services/search/FindingService/v1?siteid=0&SECURITY-APPNAME=[############################]&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=XML";
//if (is_ajax()) {
  if (isset($_GET["keywords"]) && !empty($_GET["keywords"])) { //Checks if 
      
       $key_words = "&keywords=".urlencode($_GET["keywords"]);
      
      $url .= $key_words;
   
  }

if(isset($_GET["results_per_page"])){    
  $pagination_input = "&paginationInput.entriesPerPage=".$_GET["results_per_page"];
    
    $url .= $pagination_input;
}

if(isset($_GET["page_number"])){
    $url .= "&paginationInput.pageNumber=".$_GET["page_number"];

}
 
    if(isset($_GET["sort_by"])){
    $sort_order = "&sortOrder=".$_GET["sort_by"];  
        
    $url .= $sort_order;
    }
    
    //price item filters
    $i = 0;
    $item_filter = "";
    if(isset($_GET["low_price_range"]) && $_GET["low_price_range"]>0){
        $item_filter .= "&itemFilter(".$i.").name=MinPrice&itemFilter(".$i.").value=".$_GET["low_price_range"]."&itemFilter(".$i.").paramName=Currency&itemFilter(".$i.").paramValue=USD"; 
        $i++;
    }
    
    
    if( isset($_GET["high_price_range"])&& $_GET["high_price_range"]>0){
        $item_filter .= "&itemFilter(".$i.").name=MaxPrice&itemFilter(".$i.").value=".$_GET["high_price_range"]."&itemFilter(".$i.").paramName=Currency&itemFilter(".$i.").paramValue=USD";
        $i++;
    }
    
    
     //Condition filters
    if (!empty($_GET["condition"])){
        $item_filter .= "&itemFilter(".$i.").name=Condition";
        $n = count($_GET["condition"]);
        for($j=0;$j<$n;$j++){
            if ($_GET["condition"][$j] == "condition_new"){
                      $item_filter .= "&itemFilter(".$i.").value(".$j.")=1000";
            }
            if ($_GET["condition"][$j] == "condition_used"){
                      $item_filter .= "&itemFilter(".$i.").value(".$j.")=3000";
            } 
            if ($_GET["condition"][$j] == "condition_verygood"){
                      $item_filter .= "&itemFilter(".$i.").value(".$j.")=4000";
            }
            if ($_GET["condition"][$j] == "condition_good"){
                      $item_filter .= "&itemFilter(".$i.").value(".$j.")=5000";
            }
            if ($_GET["condition"][$j] == "condition_acceptable"){
                      $item_filter .= "&itemFilter(".$i.").value(".$j.")=6000";
            }
        }
        $i++;
    }
    
    
    //Buying formats filters
    if (!empty($_GET["buying_format"])){
        $item_filter .= "&itemFilter(".$i.").name=ListingType";
        $n = count($_GET["buying_format"]);
        for($j=0;$j<$n;$j++){
            $item_filter .= "&itemFilter(".$i.").value(".$j.")=".$_GET["buying_format"][$j];
        }
        $i++;
    }
    
    //Returns Accepted filters
    if(isset($_GET["return_accepted"])){
        $item_filter .= "&itemFilter(".$i.").name=ReturnsAcceptedOnly&itemFilter(".$i.").value=true";
        $i++;
    }
    
    //Expedited Shipping filter
    if(!empty($_GET["shipping"])){
        $n = count($_GET["shipping"]);
        for($j=0;$j<$n;$j++){
            if($_GET["shipping"][$j] == "free"){
            $item_filter .= "&itemFilter(".$i.").name=FreeShippingOnly&itemFilter(".$i.").value=true";
        $i++;
            }
            
            if($_GET["shipping"][$j] == "expedited"){
            $item_filter .= "&itemFilter(".$i.").name=ExpeditedShippingType&itemFilter(".$i.").value=Expedited";
        $i++;
            }
        
        }
        
    }
    
      //Maximum Handling time
    if(isset($_GET["max_handling_time"]) && ($_GET["max_handling_time"]!="")){
        $item_filter .= "&itemFilter(".$i.").name=MaxHandlingTime&itemFilter(".$i.").value=".$_GET["max_handling_time"];
        $i++;
    }

if($item_filter != ''){
    $url .= $item_filter;
}
     
    $o = 1;
    $output_filter = "&outputSelector[".$o."]=SellerInfo";
    $o++;
    $output_filter .= "&outputSelector[".$o."]=PictureURLSuperSize";
    $o++;
     $output_filter .= "&outputSelector[".$o."]=StoreInfo";
    $o++;
    
    if($output_filter != ''){
     $url .= $output_filter;
    }
    $urldata = file_get_contents($url);
    $xml= simplexml_load_string($urldata) or die("Error: Cannot create object");
  
    
 $json_result = parse_xml($xml);
if (is_ajax()){
    echo json_encode($json_result,JSON_PRETTY_PRINT);

}
else{

    echo "<html><body><pre>".json_encode($json_result,JSON_PRETTY_PRINT)."</pre></body></html>";
}
  
//}

?>
