// This is the code for the Win Flash
$.ajax({
    url:'https://opensymmetrytest.magentrixcloud.com/aspx/WinFlash/WinFlash',
    dataType: 'json',
    type: 'get',
    cache: false,
    success: function(data) {
        // We passed in WinFlashEntry_id through URL encoding in our page
        if ((!WinFlashEntry_id)) {
            $("div#WFFilter").removeClass("hidden");
        }
        if (!WinFlashEntry_id) {
            $("div.OSKB>ul.WinFlashlist.noBullet").parent().children(".Descr").append(
                "<p>This is a list of all Win Flash articles.<br/>" +
                "Click on an item below to see Win Flash details.</p>"
            );
        }
        // $(data.Records).each(function(index, value) {
        $(data).each(function(index, value) {
            if (value.Status__c == "Published") {
                var closeDate = new Date(value.CloseDate__c);
                var Value = value.Value__c;
                if ((WinFlashEntry_id && value.Id == WinFlashEntry_id)) {
                    $("#OSButton").removeClass("hidden");
                    $("div.OSKB>ul.WinFlashlist.noBullet").parent().children(".Descr").append(
                        "<p>Click \"View All\" to see all Win Flash items.</p>"
                    );
                }
                /* Appending the information to the list > h3*/
                if ((WinFlashEntry_id && value.Id == WinFlashEntry_id) || !WinFlashEntry_id) {
                    $("div.OSKB>ul.WinFlashlist.noBullet").append(
                        "<li id='" + value.Id + "' class='" + ((WinFlashEntry_id && value.Id == WinFlashEntry_id) ? "Open noPointer" : "Closed") + " " + value.Id + "'>"
                        //Adding noPointer to the li so that the JS doesn't close it, and to the h3 to overwrite the cursor and set it to auto
                        +"<h3  " + ((WinFlashEntry_id && value.Id == WinFlashEntry_id) ? "class='noPointer'" : "") + ">" 
                            + value.Name + ", "
                            + value.Opportunity_Owner1_r.Name + ", "
                            + value.Type__c  
                            + "<br/>Close Date: "+ closeDate.toLocaleDateString("en-US") 
                            + ", Value: " + Value.toLocaleString('USD', {style: 'currency',currency: "USD",})
                        + "</h3>" 
                        
                        /* Appending the information to the list > div*/
                        + "<div>"
                            + (value.SupportTeam__c ? "<h4>Support Team: </h4>" + value.SupportTeam__c : "")
                            // + (value.Product1__c ? "<h4 class='sameLine'>Product: </h4><p class='sameLine'>" + value.Product1__c + "</p><br/>" : "")
                            + (value.Product__c ? "<h4 class='sameLine'>Product: </h4><p class='sameLine'>" + value.Product__c + "</p><br/>" : "")
                            + "<h4 class='sameLine'>Partner: </h4><p class='sameLine'>" + value.Partners__c.replace(/;/g, ", ") + "</p><br/>"
                            + "<h4 class='sameLine'>Solution Focus: </h4><p class='sameLine'>" + value.SolutionFocus__c.replace(/;/g, ", ") +" </p>"
                            + (value.DealSummary__c ? "<h4>Deal Summary: </h4>" + value.DealSummary__c : "")
                            + (value.InterestingMoments__c ? "<h4>Interesting Moments: </h4>" + value.InterestingMoments__c : "")
                            + (value.FuturePotential__c ? "<h4>Future Potential: </h4>" + value.FuturePotential__c : "")
                        + "</div></li>"
                    );
                }
            }
        });
    }
});


$("div#WFFilter").html('<input type="text" class="text-input" id="Search" value="" placeholder="Search for a Question"/>');


/*When we click on a question (h3) */
$(document).on("click", "ul.WinFlashlist.noBullet>li>h3", function () {
	/*For the Widget, we don't want it to slide*/
    if ($(this).parent().hasClass("noPointer")) {
        return false;
	}
	
    /*If you click on one, and another one is open */
	if ($(this).parent().siblings().hasClass("Open")) { /*Not done yet */
        $("li.Open > div").slideUp(250, function() {
            $(this).parent().addClass("Closed").removeClass("Open");
        });
        $(this).parent().addClass("Open"); /*This part runs before line 5, for some reason, maybe because of the callback?*/
        $(this).parent().removeClass("Closed").children("div").slideDown(250);
	}
	
	/*If you click on one, and it is open */
	else if ($(this).parent().hasClass("Open")) {
		$("li.Open > div").slideUp(250, function() {
            $("li.Open").removeClass("Open");
        });
        
		$(this).parent().addClass("Closed");
	}
    
    /*If you click on one, and no other one is open */
    else { 
        $(this).parent().addClass("Open", function() {
            $(this).children("div").slideDown(250);   
            $(this).removeClass("Closed"); /*Maybe find a way to compress this too?*/
        });
			// $(this).parent().removeClass("Closed");
	}
});


$(document).ready(function(){
    $("#Search").keyup(function(){
        
        // Retrieve the input field text
        var Search = $(this).val();

        // Loop through the h3s, closing any open FAQs
        $("li.Closed").each(function(){
            $("li.Open > div").slideUp(250, function() {
                $("li.Open").addClass("Closed").removeClass("Open");
            });
 
            // If the list item does not contain the text phrase, slide up
            // if ($(this).text().search(new RegExp(Search, "i")) < 0) {
            //console.log("this: ",$(this));
            // var text = getText($(this).attr("id"));
            var text = getText(document.getElementById($(this).attr("id")));
            
            //console.log("text",text);
            if (text.search(new RegExp(Search, "i", "m")) < 0) {
            
                $(this).slideUp();
            }
            
            // Show the list item if the search matches, slide down if they're hidden
            else {
                $(this).slideDown();
            }
        });
    });
});


function getText(domElement) {
  var root = domElement;
  var text = [];

  function traverseTree(root) {
    Array.prototype.forEach.call(root.childNodes, function(child) {
      if (child.nodeType === 3) {
        var str = child.nodeValue.trim();
        if (str.length > 0) {
          text.push(str);
        }
      } else {
        traverseTree(child);
      }
    });
  }
  traverseTree(root);
  return text.join(' ');
}












/*
This is the script for the PSssst */
$.ajax({
    url:'https://opensymmetrytest.magentrixcloud.com/rest/2.0/query?q=FROM%20.psssst__c%20WHERE%20Status__c%20==%20"Published"%20ORDER%20BY%20EditionDate__c%20DESC',
    dataType: 'json',
    type: 'get',
    cache: false,
    success: function(data) {
        // var PSssstEntry_id;
        if ((!PSssstEntry_id)) {
            $("div#PSFilter").removeClass("hidden");
        }
        if (!PSssstEntry_id) {
            $("div.OSKB>ul.PSssstlist.noBullet").parent().children(".Descr").append(
                "<p>This is a list of all PSssst Newsletters.<br/>" +
                "Click on an item below to see newsletter details.</p>"
            );
        }
        var SortDate = [];
        $(data.Records).each(function(index, value) {
            if ((PSssstEntry_id && value.Id == PSssstEntry_id)) {
                $("#OSButtonPS").removeClass("hidden");

            }
        SortDate[index] = value.EditionDate__c;
        var EditionDate = new Date(value.EditionDate__c);
        var options = { year: "numeric", month: "long",
        day: "numeric" };
        EditionDate.setDate(EditionDate.getDate() + 1);
            if ((PSssstEntry_id && value.Id == PSssstEntry_id)) {
                    $("#OSButton").removeClass("hidden");
                    $("div.OSKB>ul.PSssstlist.noBullet").parent().children(".Descr").append(
                        "<p>Click \"View All\" to see all PSssst Newsletters.</p>"
                    );
                }
            if ((PSssstEntry_id && value.Id == PSssstEntry_id)) {
                $("#OSButton").removeClass("hidden");
            }  

                /* Appending the information to the list > h3*/
            if ((PSssstEntry_id && value.Id == PSssstEntry_id) || !PSssstEntry_id) {

            $("div.OSKB>ul.PSssstlist.noBullet").append(
                "<li id='" + value.Id + "' class='" + ((PSssstEntry_id && value.Id == PSssstEntry_id) ? "Open noPointer" : "Closed") + " " + value.Id + "'>"
                    +"<h3  " + ((PSssstEntry_id && value.Id == PSssstEntry_id) ? "class='noPointer'" : "") + ">" 
                    + value.EditionTitle__c
                    + " - "
                    + EditionDate.toLocaleDateString("en-US", options)
                    + " Edition"
                + "</h3>"                

                + "<div><p>"
                    + value.LetterHeading__c
                    + (value.MeetthePSssstTeam__c ? "</p><h4>Meet the PSssst Team</h4>" + value.MeetthePSssstTeam__c : "")
                    + (value.HeardAtOS__c ? "</p><h4>Heard @ OS?</h4>" + value.HeardAtOS__c : "")
                    + (value.ProjectHighlights__c ? "</p><h4>Project Highlights</h4>" + value.ProjectHighlights__c : "")
                    + (value.GuessWho__c ? "</p><h4>Guess Who?</h4>" + value.GuessWho__c : "")
                    + (value.RestauranteFavorite__c ? "</p><h4>Restaurante Favorite</h4>" + value.RestauranteFavorite__c  : "")
                + "</p></div></li>"
                ); 
            }
        });
    }
});

$("div#PSFilter").html('<input type="text" class="text-input" id="Search" value="" placeholder="Search for a Question"/>');

$(document).on("click", "ul.PSssstlist.noBullet>li>h3", function () {
/*When we click on a question (h3) */
    
    /*For the Widget, we don't want it to slide*/
	if ($(this).parent().hasClass("noPointer")) {
        return false;
	}
	
    /*If you click on one, and another one is open */
	if ($(this).parent().siblings().hasClass("Open")) {
        $("li.Open > div").slideUp(250, function() {
            $(this).parent().addClass("Closed").removeClass("Open");
        });
        $(this).parent().addClass("Open"); /*This part runs before line 5, for some reason, maybe because of the callback?*/
        $(this).parent().removeClass("Closed").children("div").slideDown(250);

	}

    /*If you click on one, and it is open */
	else if ($(this).parent().hasClass("Open")) {
		$("li.Open > div").slideUp(250, function() {
            $("li.Open").removeClass("Open");
        });
		$(this).parent().addClass("Closed");
	}
	
	/*If you click on one, and no other one is open */
    else { 
        $(this).parent().addClass("Open", function() {
            $(this).children("div").slideDown(250);   
            $(this).removeClass("Closed"); /*Maybe find a way to compress this too?*/
        });
	}
});
