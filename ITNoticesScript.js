$.ajax({
    url: "/rest/2.0/query?q=FROM%20.ITNotices__c%20%20%20ORDER%20BY%20DisplayOrder__c%20DESC",
    dataType: "json",
    type: "get",
    cache: false,
    success: function(data) {
        $(data.Records).each(function(index, value) {
        var dateNow;
        var dateStart;
        var dateEnd;
        var userOffset;

            if (value.StartTime__c !== null) {
                dateNow = new Date();
                dateStart = new Date(value.StartTime__c);
                userOffset = + dateNow.getTimezoneOffset() * 60000;
                dateStart = (dateStart.getTime() + userOffset);
                dateNow = (dateNow.getTime() + userOffset);
        
                if (value.EndTime__c !== null) {
                    dateEnd = new Date(value.EndTime__c);
                    dateEnd = (dateEnd.getTime() + userOffset);
                    
                    if (dateNow > dateStart && dateNow < dateEnd) {
                        appendHTML();
                    }
                }
                else {
                    if (dateNow > dateStart) {
                        appendHTML();
                    }
                }
            }
            else if (value.EndTime__c !== null) {
                dateNow = new Date();
                dateEnd = new Date(value.EndTime__c);
                userOffset = + dateNow.getTimezoneOffset() * 60000;
                dateEnd = (dateEnd.getTime() + userOffset);
                dateNow = (dateNow.getTime() + userOffset);
                if (dateNow < dateEnd) {
                    appendHTML();
                }
                    
            }
            else if (value.EndTime__c === null && value.StartTime__c === null) {
                    appendHTML();
            }
            if (ITNoticeId == value.Id) {
                $("#OSButton").removeClass("hidden");
                return false; 
                }
            function appendHTML() {
                if ((ITNoticeId && value.Id == ITNoticeId) || !ITNoticeId) {
                    $("div.OSKB > ul.ITNoticelist.noBullet").append(
                        "<li id='" + value.Id + "' class='" + ((ITNoticeId && value.Id == ITNoticeId) ? "Open noPointer" : "Closed") + " " + value.Id + "'>" +
                        // "<li id='" + value.Id + "' class='" + ((ITNoticeId && value.Id == ITNoticeId) ? "Open noPointer" : "Closed") + " " + value.Id + "'>" +
                            "<h3  " + ((ITNoticeId && value.Id == ITNoticeId) ? "class='noPointer'" : "") + ">"
                            + value.Name 
                            + "</h3>" +
                            "<div>" + 
                                "<p>" + value.Description__c + "</p>" +
                                "<p>" + (value.ExternalLink__c ? "<a href='"  + value.ExternalLink__c + "'>" + value.ExternalLinkText__c + "</a></p>": "</p>")  + ""  +
                            "</div>" +
                        "</li>"
                    );
                }
            }
        });
    }
});
$(document).on("click", "ul.ITNoticelist.noBullet > li > h3", function () {
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