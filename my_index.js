
//Clear form fields

function clearForm(){
            
    var input_texts = document.getElementsByTagName('input');
    for(var i = 0;i < input_texts.length;i++){
        if (input_texts[i].type == "text"){
            input_texts[i].value = "";
        } 
                
        if (input_texts[i].type == "checkbox"){
            input_texts[i].checked = false;
        }
    }
           
    $('#sort_by')[0].selectedIndex = 0;
    $('#results_per_page')[0].selectedIndex = 0;
    
    $("#result_section").empty();
    $("#pagination_bar").addClass("hide");
            
            
};


function get_page(page_number){

    var form_data = basic_form();
    form_data["page_number"] = page_number; 
    submitToPHP(form_data);
    return false;
}

function basic_form(){
    var form_data = {
      "keywords"                        : $("#key_words").val(),
      "results_per_page"                : $("#results_per_page").val(),
      "sort_by"                         : $("#sort_by").val()
    
    };
    
    if($("#low_price_range").val()!=''){
    
        form_data["low_price_range"] = parseFloat($("#low_price_range").val());
    };
    
    if($("#high_price_range").val()!=''){
    
        form_data["high_price_range"] = parseFloat($("#high_price_range").val());
    };
    
    
    var condition = [];
    $('#condition input[type="checkbox"]').each(function(){
        
        if($(this).is(":checked")){
            condition.push($(this).val());
        }
    
    });
    form_data["condition"] = condition;
    
    
    var buying_format = [];
    
    $('#buying_format input[type="checkbox"]').each(function(){
        
        if($(this).is(":checked")){
            buying_format.push($(this).val());
        }
    
    });
    form_data["buying_format"] = buying_format;
    
    var return_accepted;
    
    $('#return_accepted input[type="checkbox"]').each(function(){
        
        if($(this).is(":checked")){
            return_accepted = $(this).val();
        }
    
    });
    form_data["return_accepted"] = return_accepted;
    
    var shipping = [];
    
    $('#shipping input[type="checkbox"]').each(function(){
        
        if($(this).is(":checked")){
            shipping.push($(this).val());
        }
    
    });
    form_data["shipping"] = shipping;   
    
    
    if($("#max_handling_time").val()!=''){
    
        form_data["max_handling_time"] = parseInt($("#max_handling_time").val());
    };
    
    return form_data;

};


//Convert form data to json and GET data from PHP server
function submitToPHP(form_data){   
    

    $.ajax({
			url: "my_index.php",
            data: form_data,
			type: "GET",			
			dataType: "json",
            
            success: function(output){
                format_display(output);
            },
            
            error: function(output){
                $("#result_section").text("Error! Please Try Again!");
            }
		});
        
        return false;
    
};


function format_display(json_output){
    
    
    $("#result_section").empty();
    if(json_output.ack == "Success" ){
        
    $result_head = document.createElement("H3");
    $result_head.setAttribute("id","result_head");
    $("#result_section").append($result_head);
        
    $total_items = parseInt(json_output.resultCount);
    if($total_items < 5){
        $total_pages = 1;
    }
    else{
        $total_pages = Math.ceil($total_items/json_output.itemCount);
    }
    
    $start_index = (parseInt(json_output.pageNumber)-1) * parseInt(json_output.itemCount) + 1;
    if(json_output.pageNumber < $total_pages){
    $end_index = (parseInt(json_output.pageNumber)-1) * parseInt(json_output.itemCount) + parseInt(json_output.itemCount);
    }
        
    else{
    
        $end_index = json_output.resultCount;
    }
        
    $("#result_head").text($start_index+"-"+$end_index+" items out of "+ json_output.resultCount);
    
    $result_list = document.createElement("UL");
    $result_list.setAttribute("id","result_list");
    $("#result_section").append($result_list);
    $("#result_list").addClass("media-list col-md-12  col-sm-12  col-xs-12");
    
    $pattern = /item/;
    
    
    for($key in json_output){
        if ($pattern.test($key) && $key!='itemCount'){
            
                     
            $item = json_output[$key];            
            $node = document.createElement("LI");  // Create a <li> node and add to the list
            $node.setAttribute("id",$key);
            $("#result_list").append($node);
            $("#".concat($key)).addClass("media");
            
            $div = document.createElement("DIV");
            $div.setAttribute("id","div-".concat($key));
            $("#".concat($key)).append($div);
            $("#div-".concat($key)).addClass("row");
            
            $media_div = document.createElement("DIV"); //create media left div
            $media_div.setAttribute("id","media-left-".concat($key));
            $("#div-".concat($key)).append($media_div);
            $("#media-left-".concat($key)).addClass("media-img col-sm-2 col-md-2 col-xs-3");
            
            
            
           
            $image = document.createElement("IMG");
            $image.setAttribute("src",$item["basicInfo"]["galleryURL"]);
            $image.setAttribute("id","media-left-img".concat($key));
            $("#media-left-".concat($key)).append($image);
            $("#media-left-img".concat($key)).addClass("media-left-img img-responsive");
            
                      
            $media_body = document.createElement("DIV"); //create media left div
            $media_body.setAttribute("id","media-body-".concat($key));
            $("#div-".concat($key)).append($media_body);
            $("#media-body-".concat($key)).addClass("media-body col-sm-10 col-xs-9 col-md-10");
            
             //add item url
            $item_a = document.createElement("A");  
            $item_a.setAttribute("id","media-a-".concat($key));
            $item_a.setAttribute("href",$item["basicInfo"]["viewItemURL"]);
            $("#media-body-".concat($key)).append($item_a);
            
            $item_head = document.createElement("H4");
            $item_head.setAttribute("id","media-a-h-".concat($key));
            $("#media-a-".concat($key)).append($item_head);
            $("#media-a-h-".concat($key)).text($item["basicInfo"]["title"]);
            $("#media-a-h-".concat($key)).addClass("media-heading col-sm-10 col-md-10 col-xs-11");
           
            
            $item_details = document.createElement("DIV");
            $item_details.setAttribute("id","details-item-".concat($key));
            $("#media-body-".concat($key)).append($item_details);
            $("#details-item-".concat($key)).addClass("details-item col-md-11 col-sm-11 col-xs-11 ");
            $price = "Price:$".concat($item["basicInfo"]["convertedCurrentPrice"]);
            if($item["basicInfo"]["shippingServiceCost"]=='' || parseFloat($item["basicInfo"]["shippingServiceCost"]) == 0.0){
            $shipping = "(FREE Shipping)";            
            }
            else{
            $shipping = "(+$".concat($item["basicInfo"]["shippingServiceCost"]," for shipping)");
            };
            
            $location = "<SPAN class='italics'>".concat("  &nbsp;&nbsp;Location:",$item["basicInfo"]["location"],"</SPAN>");
            
            if($item["basicInfo"]["topRatedListing"] == "true"){
            $top_rated = "<SPAN><IMG class='toprated' src='images/itemTopRated.jpg'></IMG><SPAN>";
            }
            else{
            $top_rated = "";
            };
            
            
                        
            $("#details-item-".concat($key)).append("<SPAN  class='price_bold'".concat("id='price-detail-",$key,"'>",$price,"</SPAN><SPAN id='shipping-detail-",$key,"'>",$shipping,"</SPAN>",$location));
            $("#details-item-".concat($key)).append("<SPAN>".concat($top_rated,"</SPAN>"));
            
            $span = document.createElement("SPAN");
            $("#details-item-".concat($key)).append($span);
            
            $view_details = document.createElement("A");  
            $view_details.setAttribute("id","view-details-".concat($key));
            $view_details.setAttribute("href","#more-details-".concat($key));
            $view_details.setAttribute("data-toggle","collapse");
            $span.appendChild($view_details);
            $("#view-details-".concat($key)).addClass("view_details");
            $("#view-details-".concat($key)).text("View Details");
            //$("#view-details-".concat($key)).css("margin-left","10px");
            
        
            $fb_button = document.createElement("BUTTON");
            $fb_button.setAttribute("id","fb-".concat($key));
            $span.appendChild($fb_button);
            $("#fb-".concat($key)).addClass("fb_button");
            $("#fb-".concat($key)).append("<IMG class='fb_img' src='images/fb.png'></IMG>");

            
            $more_details = document.createElement("DIV");
            $more_details.setAttribute("id","more-details-".concat($key));
            $span.appendChild($more_details);
            $("#more-details-".concat($key)).addClass("collapse");
            
            $tabpanel = document.createElement("DIV");
            $tabpanel.setAttribute("id","tabs-".concat($key));
            $tabpanel.setAttribute("role","tabpanel");
            $("#more-details-".concat($key)).append($tabpanel);
            $("#tabs-".concat($key)).addClass("tabpanel col-md-12 col-sm-12 col-xs-12");
            
            
            $navtabs = document.createElement("UL");
            $navtabs.setAttribute("id","tablist-".concat($key));
            $navtabs.setAttribute("role","tablist");
            $("#tabs-".concat($key)).append($navtabs);
            $("#tablist-".concat($key)).addClass("nav nav-tabs col-md-10 col-sm-12 col-xs-12");
            
            
            //basic info
            $basic_tab = document.createElement("LI");
            $basic_tab.setAttribute("id","basic-tab-".concat($key));

            $basic_tab.setAttribute("role","presentation");
            $("#tablist-".concat($key)).append($basic_tab);
            $("#basic-tab-".concat($key)).addClass("active col-sm-3 col-xs-6 col-md-2");
  
            
            $basic_link =  document.createElement("A");
            $basic_link.setAttribute("href","#basicpane-".concat($key));
            $basic_link.setAttribute("aria-controls","basicpane-".concat($key));
            $basic_link.setAttribute("role","tab");
            $basic_link.setAttribute("data-toggle","tab");
            $("#basic-tab-".concat($key)).append($basic_link);
            $basic_link.innerHTML = "Basic Info";
            
            //seller info
            $seller_tab = document.createElement("LI");
            $seller_tab.setAttribute("id","seller-tab-".concat($key));
            $seller_tab.setAttribute("role","presentation");
            $("#tablist-".concat($key)).append($seller_tab);
            $("#seller-tab-".concat($key)).addClass("col-sm-3 col-xs-6 col-md-2");
  
            
            $seller_link =  document.createElement("A");
            $seller_link.setAttribute("href","#sellerpane-".concat($key));
            $seller_link.setAttribute("aria-controls","sellerpane-".concat($key));
            $seller_link.setAttribute("role","tab");
            $seller_link.setAttribute("data-toggle","tab");
            $("#seller-tab-".concat($key)).append($seller_link);
            $seller_link.innerHTML = "Seller Info";
            
            //shipping info
            $shipping_tab = document.createElement("LI");
            $shipping_tab.setAttribute("id","shipping-tab-".concat($key));
            $shipping_tab.setAttribute("role","presentation");
            $("#tablist-".concat($key)).append($shipping_tab);
            $("#shipping-tab-".concat($key)).addClass("col-sm-4 col-xs-6 col-md-3");
  
            
            $shipping_link =  document.createElement("A");
            $shipping_link.setAttribute("href","#shippane-".concat($key));
            $shipping_link.setAttribute("aria-controls","shippane-".concat($key));
            $shipping_link.setAttribute("role","tab");
            $shipping_link.setAttribute("data-toggle","tab");
            $("#shipping-tab-".concat($key)).append($shipping_link);
            $shipping_link.innerHTML = "Shipping Info";
            
            
            
            
            
            
            <!-- Tab Panes -->
            
            $tabpane = document.createElement("DIV");
            $tabpane.setAttribute("id","tabpane-".concat($key));
            $tabpane.setAttribute("role","tab-content");
            $("#tabs-".concat($key)).append($tabpane);
            $("#tabpane-".concat($key)).addClass("tab-content");
            
            
            //Basic Pane
            $basicpane = document.createElement("DIV");
            $basicpane.setAttribute("id","basicpane-".concat($key));
            $basicpane.setAttribute("role","tabpanel");
            $("#tabpane-".concat($key)).append($basicpane);
            $("#basicpane-".concat($key)).addClass("active tab-pane ");
            
                       
            $basic_table = document.createElement("DIV");
            $basic_table.setAttribute("id","basic-table-".concat($key));
            $("#basicpane-".concat($key)).append($basic_table);
            $("#basic-table-".concat($key)).addClass("row");
            
           
            $("#basic-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-3 col-xs-12 col-md-3'>Category Name</div><div  class='col-sm-8 col-xs-12 col-md-7'>".concat($item["basicInfo"]["categoryName"],              
                "</div></div>"));
            
                 
            $("#basic-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-3 col-xs-12 col-md-3'>Condition</div><div class='col-sm-8 col-xs-12 col-md-7'>".concat($item["basicInfo"]["conditionDisplayName"],            
                "</div></div>"));
            
            if($item["basicInfo"]["listingType"] == "FixedPrice" || $item["basicInfo"]["listingType"] == "StoreInventory"){
                $bf = "Buy It Now";
            }
            else if($item["basicInfo"]["listingType"] == "Classified"){
                $bf = "Classified Ad";
            }
            else{
                $bf = $item["basicInfo"]["listingType"];
            }
            
            /*$("#basic-table-".concat($key)).append(
                "<tr><td class='price_bold col-sm-5 col-xs-5 col-md-5'>Buying Format</td><td class='col-sm-8 col-xs-7 col-md-7'>".concat($bf,              
                "</td><tr>"));
                */
            $("#basic-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-3 col-xs-12 col-md-3'>Buying Format</div><div class='col-sm-8 col-xs-12 col-md-7'>".concat($bf,              
                "</div></div>"));
                        
            //Seller Pane
            $sellerpane = document.createElement("DIV");
            $sellerpane.setAttribute("id","sellerpane-".concat($key));
            $sellerpane.setAttribute("role","tabpanel");
            $("#tabpane-".concat($key)).append($sellerpane);
            $("#sellerpane-".concat($key)).addClass("tab-pane");
            
            
            //seller info
            $seller_table = document.createElement("DIV");
            $seller_table.setAttribute("id","seller-table-".concat($key));
            $("#sellerpane-".concat($key)).append($seller_table);
              $("#seller-table-".concat($key)).addClass("row");
            
            //User name
            $("#seller-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>User name</div><div class='col-sm-8 col-xs-12 col-md-7'>".concat($item["sellerInfo"]["sellerUserName"],              
                "</div></div>"));
            
            //Feedback Score
            $("#seller-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>Feedback score</div><div class='col-sm-8 col-xs-12 col-md-7'>".concat($item["sellerInfo"]["feedbackScore"],            
                "</div></div>"));
            
            //Positive Feedback            
            $("#seller-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>Positive feedback</div><div class='col-sm-8 col-xs-7 col-md-7'>".concat($item["sellerInfo"]["positiveFeedbackPercent"],"%",              
                "</div></div>"));
            
            //Feedback rating          
            $("#seller-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>Feedback rating</div><div class='col-sm-8 col-xs-7 col-md-7'>".concat($item["sellerInfo"]["feedbackRatingStar"],              
                "</div></div>"));
            
            //Top rated       
            if($item["sellerInfo"]["topRatedSeller"] == "true"){
                $top_rated = "<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>";            
            }
            else{
                $top_rated = "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>" ;
            
            }
            $("#seller-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>Top rated</div><div class='col-sm-8 col-xs-12 col-md-7'>".concat($top_rated,              
                "</div></div>"));
            
            //Store        
            if($item["sellerInfo"]["sellerStoreURL"] == "N/A"){
                $store = "N/A";
            } else {
                $store = "<a href='".concat($item["sellerInfo"]["sellerStoreURL"],"'>",$item["sellerInfo"]["sellerStoreName"],"</a>");
            }
            $("#seller-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>Store</div><div class='col-sm-8 col-xs-7 col-md-7'>".concat($store,              
                "</div></div>"));
            
            //Shipping Pane
            $shippane = document.createElement("DIV");
            $shippane.setAttribute("id","shippane-".concat($key));
            $shippane.setAttribute("role","tabpanel");
            $("#tabpane-".concat($key)).append($shippane);
            $("#shippane-".concat($key)).addClass("tab-pane");
            
        
            
            //ship info
            $ship_table = document.createElement("DIV");
            $ship_table.setAttribute("id","ship-table-".concat($key));
            $("#shippane-".concat($key)).append($ship_table);
            $("#ship-table-".concat($key)).addClass("row");
            
            //Shipping type
            
             
         
            $shiptype = $item["shippingInfo"]["shippingType"].replace(/([a-z])([A-Z])/g,"$1 $2");
            $("#ship-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>Shipping type</div><div class='col-sm-8 col-xs-12 col-md-7'>".concat($shiptype,              
                "</div></div>"));
            
            //Handling time
            if($item["shippingInfo"]["handlingtime"] == "N/A"){
                $("#ship-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>Handling time</div><div class='col-sm-8 col-xs-7 col-md-7'>".concat($item["shippingInfo"]["handlingTime"],"</div></div>"));
                
            } else {
            $("#ship-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>Handling time</div><div class='col-sm-8 col-xs-7 col-md-7'>".concat($item["shippingInfo"]["handlingTime"]," day(s)",            
                "</div></div>"));
            }
            
            //Shipping locations           
            $("#ship-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>Shipping locations</div><div class='col-sm-8 col-xs-12 col-md-7'>".concat($item["shippingInfo"]["shipToLocations"],              
                "</div></div>"));
            
            //Expedited Shipping 
            if($item["shippingInfo"]["expeditedShipping"] == "true"){
                $expShip = "<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>";            
            }
            else{
                $expShip = "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>" ;            
            }
            
            $("#ship-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>Expedited shipping</div><div class='col-sm-8 col-xs-7 col-md-7'>".concat($expShip,              
                "</div></div>"));
            
            //One day shipping      
            if($item["shippingInfo"]["oneDayShippingAvailable"] == "true"){
                $oneDay = "<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>";            
            }
            else{
                $oneDay = "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>" ;
            
            }
            $("#ship-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>One day shipping</div><div class='col-sm-8 col-xs-7 col-md-7'>".concat($oneDay,              
                "</div></div>"));
            
            //Returns accepted     
            if($item["shippingInfo"]["returnsAccepted"] == "true"){
                $return = "<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>";            
            }
            else{
                $return = "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>" ;
            
            }
            
             $("#ship-table-".concat($key)).append(
                "<div><div class='price_bold col-sm-4 col-xs-12 col-md-3'>Returns accepted</div><div class='col-sm-8 col-xs-7 col-md-7'>".concat($return,              
                "</div></div>"));
            
                                                      
            
        }
    
    }; 
        
         $('.media-left-img').click(function(event){
                $parent = $(event.target).closest('li');
                $item_key = $parent.attr('id');
                var src = json_output[$item_key]["basicInfo"]["pictureURLSuperSize"] ;
                var title = json_output[$item_key]["basicInfo"]["title"];
                var img = '<img src="' + src + '" class="img-responsive img-center"/>';
                $("#imgModal").modal();
                $('#imgModal').on('shown.bs.modal', function(){
                    $("#imgModal .modal-body").html(img);
                    $("#imgModal .modal-title").html(title);
                });
                $('#imgModal').on('hidden.bs.modal', function(){
                    $('#imgModal .modal-body').html('');
                });
           });  
        
        
        $('.fb_button').click(function(event){
            
            $parent = $(event.target).closest('li');           
            $item_key = $parent.attr('id');
            $description = (document.getElementById('price-detail-'.concat($item_key)).innerHTML).concat(document.getElementById('shipping-detail-'.concat($item_key)).innerHTML);
            FB.login(function(response) { 
                
                if (response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ');
                    
                    
                    FB.getLoginStatus(function(response){
            
                if(response.status === 'connected'){
                
                    FB.ui({
                        method: 'feed',
                        name : json_output[$item_key]["basicInfo"]["title"],
                        link: json_output[$item_key]["basicInfo"]["viewItemURL"],
                        picture: json_output[$item_key]["basicInfo"]["galleryURL"],
                        caption: 'Search Information from eBay.com',
                        description : $description.concat("&nbsp;&nbsp;Location:",json_output[$item_key]["basicInfo"]["location"])
                    }, function(response){
                        if (response && !response.error_code) {
                            alert('Posted Successfully');
                        } else {
                            alert('Not Posted');
                        }
                    
                    });
                }
            
            });
                } 
                else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            });
            
        
        
        });
        
        $("#pagination_bar").removeClass("hide");
        $("#pagination").empty();
        $li_item = document.createElement("LI");
        $li_item.setAttribute("id","page_prev");
        $("#pagination").append($li_item);
        
        $a_item = document.createElement("A");
        $a_item.setAttribute("id","a_prev");
        $a_item.setAttribute("href","#");
        $("#page_prev").append($a_item);
        $("#a_prev").text("<<");
        
        $current_page = parseInt(json_output.pageNumber);
        if($current_page%5 == 0){
            $start = $current_page-5;
        }
        else{
            $start = $current_page - ($current_page%5);
        }
        
        for($i=1;$i<=5;$i++){
            if($start + $i <= $total_pages){
           
            $li_item = document.createElement("LI");
            $li_item.setAttribute("id","page_item".concat($i));
            $("#pagination").append($li_item);
            $("#page_item".concat($i)).addClass("page_item");
            
            $a_item = document.createElement("A");
            $a_item.setAttribute("id","a_".concat($i));
            $a_item.setAttribute("href","#");
            $("#page_item".concat($i)).append($a_item);
            $("#a_".concat($i)).text($start + $i);
             }
                 
        }
        
        $li_item = document.createElement("LI");
        $li_item.setAttribute("id","page_next");
        $("#pagination").append($li_item);
        $a_item = document.createElement("A");
        $a_item.setAttribute("id","a_next");
        $a_item.setAttribute("href","#");
        $("#page_next").append($a_item);
        $("#a_next").text(">>");
        
        
            
        if($current_page == 1){
            $("#page_prev").addClass("disabled");
            $("#a_prev").removeAttr("href");
        }
        
        if($current_page == $total_pages){
            $("#page_next").addClass("disabled");
            $("#a_next").removeAttr("href");
        }
        
        if($current_page%5==0){
            $("#page_item5").addClass("active");
        }
        else{
            $("#page_item".concat($current_page%5)).addClass("active");
        }
              
        $("#page_next").click(function(){
            
            get_page($current_page+1);
            return false;
        });
        
        $("#page_prev").click(function(){
            
            if($current_page == 1){
                return false;
            }
            
            get_page($current_page-1);
            return false;
        });
        
        $(".page_item").click(function(event){
            
            
            get_page(parseInt(event.target.innerHTML));
            return false;
        });
        
               
    }
    else{
        $result_head = document.createElement("H3");
        $result_head.setAttribute("id","no_result");
        $("#result_section").append($result_head);
        $("#no_result").text("No Results Found");
        $("#no_result").addClass("col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-offset-2 col-xs-8");
        $("#pagination_bar").addClass("hide");
    
    }


};
      
$(document).ready(function(){
          
          
    $("#clear").click(clearForm);
          
        //Check max price greater than min price  
    jQuery.validator.addMethod("check_min",function(value){
    if($("#low_price_range").val()!='' && $("#high_price_range").val()!='' && parseFloat($("#low_price_range").val())>0 &&
parseFloat($("#high_price_range").val())>0){
            return parseFloat($("#low_price_range").val()) <= parseFloat($("#high_price_range").val());
        }
    return true;
    });
          
        jQuery.validator.addMethod("check_digits",function(value){
            if ($("#max_handling_time").val()!=''){
                var reg = /[^0-9]/;
                return !(reg.test($("#max_handling_time").val()));
            
            }
            return true;
        
        });
          
      
        $("#query_parameters").validate({
           
        rules:{    
        key_words : {required:true},
        low_price_range : {number:true, min:0},
        high_price_range: {number:true, min:0,check_min:true},
        max_handling_time: { check_digits:true,min:1}
        },
        messages :{
        key_words : {required : "Please enter a key word"},
        low_price_range : {number:"Price should be a valid number",min:"Minimum price cannot be below 0"},
        high_price_range: {number:"Price should be a valid number",min:"Maximum price cannot be below 0",check_min:"Maximum price cannot be less than the minimum price"},
        max_handling_time:{check_digits:"Max handling time should be a valid digit",min:"Max handling time should be greater than or equal to 1"}
        },           
            
        submitHandler: function() {
    // do other things for a valid form
            var form_data = basic_form();

            submitToPHP(form_data);
        }
            
        
        });  
  
        
      
      });