// This code reads in the FAQs from the FAQEntry__c entity, which is in the JSON format and
// appends it to two pages, one to only display them (FAQ) and one for management (FAQManagement)

$(document).ready(function(){
    //Function for the search bar at the top of the page
    $("#FAQSearch").keyup(function() {
        // FAQSearch is the text entered into the search bar
        var FAQSearch = $(this).val();
        // The first thing we want to do is close all FAQs
        closeAllFAQ();
        // Loop through each item (li) in the list
        $("ul.FAQlist.noBullet > li").each(function(){
            // If the li (#question and #answer) does not contain the text, slide it up
            if ($(this).find("#question").text().search(new RegExp(FAQSearch, "i")) < 0 &&
            $(this).find("#answer").text().search(new RegExp(FAQSearch, "i")) < 0) {
                $(this).slideUp(250);
            }
            // If the does contain the text, slide it down, doesn't affect items that are already shown
            else {
                $(this).slideDown(250);
            }
        });
    });
    
    // Function to disable the enter key when doing a FAQ search
    $('.noEnterSubmit').keypress(function(e){
        if ( e.which == 13 ) return false;
    });
    
    //Function for showing and hiding the answers (div) when their question is clicked.
    $(document).on("click", "ul.FAQlist.noBullet > li > h3 > #question", function () {
        // When a question is clicked
        if ($(this).hasClass("Closed")){
        // If you click on a closed question, close all FAQs
            closeAllFAQ();
            // Then open the clicked question
            $(this).parent().siblings("div #answer").slideDown(250);
            $(this).removeClass("Closed").addClass("Open");
        }
        else {
            // Otherwise, close all FAQs
            closeAllFAQ();
        }
    });
});

// Function that loops through all of the questions and closes them
function closeAllFAQ() {
    $("ul.FAQlist.noBullet > li > h3 > #question").each( function () {
        $(this).parent().siblings("div #answer").slideUp(250);
        $(this).removeClass("Open").addClass("Closed"); 
    });
}

// Function that displays the header for the FAQs
function displayFAQHeader(practice) {
    $(".OSKB").append(
        "<div class='container-fluid'>" +
            "<div class='row'>" +
                "<div class='col-xs-8'>" +
                    "<h2>" + practice + " FAQ</h2>" +
                "</div>" +
            "</div>" +
            "<div class='row'>" +
                "<div id='FAQfilter'></div>" +
            "</div>" +
        "</div>"
    );
    if (practice == "View All") {
        $("h2:contains('FAQ')").append("s");
    }
}

// Function that displays the header for the Management page, this includes: practice name, input new faq button, and draft and published buttons
function displayFAQManagementHeader(practice) {
    $(".OSKB").append(
        "<div class='container-fluid'>" +
            "<div class='row'>" +
                // FAQ Title
                "<div class='FAQHeader col-xs-12 col-sm-2'>" +
                    "<h2 class='h2HeaderFAQ'>" + practice + " FAQ</h2>" +
                "</div>" +
                "<div class=' col-sm-6'>" +
                    // FAQ Search Bar
                    "<div class='FAQHeader col-xs-12 col-md-6'>" +
                        "<div id='FAQfilter'></div>" +
                    "</div>" +
                    // Input new FAQ button
                    "<div class='FAQHeader col-xs-12 col-md-6'>" +
                        "<a type='button' class='btn btn-default' id='newFAQ'" +
                            "href='/aspx/FAQEditor'> Input New FAQ</a>" +
                    "</div>" +
                "</div>" +
                
                // This displays the published and draft buttons for extra-small screens, like a smartphone
                "<div class='FAQHeader  col-xs-12 col-sm-4'>" +
                    "<div class='row visible-xs xsToggle'>" +
                        "<div class='col-xs-4'>" +
                            "Published" +
                        "</div>" +                
                        "<div class='col-xs-8'>" +
                            "<label class='switch'>" +
                              "<input type='checkbox' checked id ='publishedToggle'>" +
                              "<div class='slider'></div>" +
                            "</label>" +
                        "</div>" +
                    "</div>" +
                    "<div class='row visible-xs xsToggle'>" +
                        "<div class='col-xs-4'>" +
                            "Draft" +
                        "</div>" +
                        "<div class='col-xs-8'>" +
                            "<label class='switch'>" +
                              "<input type='checkbox' id ='draftToggle'>" +
                              "<div class='slider'></div>" +
                            "</label>" +
                        "</div>" +
                    "</div>" +
                    
                    // This displays the published and hidden buttons for screens larger than a smartphone
                    "<div class='col-md-3 hidden-xs'>" +
                        "Published" +
                    "</div>" +                
                    "<div class='col-md-3 hidden-xs'>" +
                        "<label class='switch'>" +
                          "<input type='checkbox' checked id ='publishedToggle'>" +
                          "<div class='slider'></div>" +
                        "</label>" +
                    "</div>" +
                    "<div class='col-md-3 hidden-xs'>" +
                        "Draft" +
                    "</div>" +
                    "<div class='col-md-3 hidden-xs'>" +
                        "<label class='switch'>" +
                          "<input type='checkbox' id ='draftToggle'>" +
                          "<div class='slider'></div>" +
                        "</label>" +
                    "</div>" +
                "</div>" +                            
            "</div>" +
        "</div>"
    );
    if (practice == "View All") {
        $("h2:contains('FAQ')").append("s");
    }
}
// Function to toggle the "draft" FAQs based on the checkbox
$(document).on("click", "#draftToggle", function() {
    (this.checked) ? $("ul .draft").removeClass("hidden") : $("ul .draft").addClass("hidden");
});

//  Function to toggle the "published" FAQs based on the checkbox
$(document).on("click", "#publishedToggle", function() {
    (this.checked) ? $("ul .published").removeClass("hidden") : $("ul .published").addClass("hidden");
});

// Function to display the FAQs without any of the editing features
function displayFAQ(practice) {
    var FAQURL = "";
    $("div#FAQfilter").html('<input type="text" class="text-input noEnterSubmit" id="FAQSearch" value="" placeholder="Search for a Question"/>');
    if (practice == "View All") {
        FAQURL = '/rest/2.0/query?q=FROM%20.FAQEntry__c%20WHERE%20Status__c%20=%20%22Published%22%20ORDER%20BY%20Name%20ASC';
    }
    else {
        FAQURL = '/rest/2.0/query?q=FROM%20.FAQEntry__c%20WHERE%20Categories__c%20=%20%22' + 
                  practice + '%22%20AND%20Status__c%20=%20%22Published%22%20ORDER%20BY%20Name%20ASC';
    }
        $.ajax({
            url: FAQURL,
            dataType: 'json',
            type: 'get',
            cache: false,
            success: function(data) {
                
                if (!(data.Records[0])) {
                    $("div.OSKB > ul.FAQlist.noBullet").append("<h5>There currently are no articles in this section...</h5>");
                }
                $(data.Records).each(function(index, value) {
                    if (value.Status__c == "Draft") {
                        return 0;
                    }
                    $("div.OSKB > ul.FAQlist.noBullet").append( 
                        "<li>" +
                            "<h3>" +
                                "<span id='question' class='Closed'>" +
                                    value.Name +
                                "</span>" +
                            "</h3>" +
                            "<div id='answer'>" + value.FAQAnswer__c + "</div>" +
                        "</li>"
                    );
                });
            }
        });
}

// Function to display the FAQs with edit and delete features
function displayFAQManagement(practice) {
    var FAQURL = "";
    $("div#FAQfilter").html('<input type="text" class="FAQManagSearch text-input noEnterSubmit" id="FAQSearch" value="" placeholder="Search for a Question"/>');
    if (practice == "View All") {
        FAQURL = '/rest/2.0/query?q=FROM%20.FAQEntry__c%20ORDER%20BY%20Name%20ASC';
    }
    else {
        FAQURL = '/rest/2.0/query?q=FROM%20.FAQEntry__c%20WHERE%20Categories__c%20=%20%22' + practice + '%22%20ORDER%20BY%20Name%20ASC';
    }
    $.ajax({
        url: FAQURL,
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(data) {
            
            if (!(data.Records[0])) {
                $("div.OSKB > ul.FAQlist.noBullet").append("<h5>There currently are no articles in this section...</h5>");
            }
            
            $(data.Records).each(function(index, value) {
                var createdOn = new Date(value.CreatedOn);
                var modifiedOn = new Date(value.ModifiedOn);
                var options = { year: "numeric", month: "long", day: "numeric" };
                var postSelectorContent = "" +
                    "<h3>" +
                        "<div class='dropdown closed'>" +
                            "<button type='button' class='btn dropdown-toggle btn-sm' data-toggle='dropdown'>" +
                                "<span class='caret'></span>" +
                                "</button>&nbsp;" +
                            "<div class='dropdown-menu'>" +
                                "<a class='btn btn-default btn-sm' id ='" + value.Id + "'" +
                                    "href= '/aspx/FAQEditor?recordID=" + value.Id + "' role='button'>Edit FAQ" +
                                "</a><br/>" +
                                "<button class='btn btn-default btn-sm' value ='" + value.Id + "' id='Delete' va type='button'>Delete FAQ</button>" +
                            "</div>" +
                        "</div>" +
                        "<span id='question' class='Closed'>" + value.Name + "<br/></span>" +
                            "<h4 class='smallHeader'>" +
                                "Author: " + value.UserName__c + " | " +
                                "Date Created: " + createdOn.toLocaleDateString("en-US", options) + " | " +
                                "Last Modified: " + modifiedOn.toLocaleDateString("en-US", options) + " | " +
                                "Status: " + value.Status__c +
                            "</h4>" +
                    "</h3>" +
                    "<div id='answer'>" + value.FAQAnswer__c + "</div>" +
                "</li>";
                
                if (value.Status__c == "Draft") {
                    $("div.OSKB > ul.FAQlist.noBullet").append("<li class='hidden draft'>" + postSelectorContent);
                }
                else {
                    $("div.OSKB > ul.FAQlist.noBullet").append("<li class='published'>" + postSelectorContent);
                }
            });
        }
    });
}

// Function to delete a FAQ. The button is called, and the id is passed in as "value"
$(document).on("click", "#Delete", function() {
    var deleteID = this.value;
    if (confirm("Are you sure you want to delete this FAQ?")) {
        REST2.remove({
            id: deleteID,
            callback: function() {
                if (REST2.isSuccess()) {
                    location.reload(function() {
                        alert("FAQ has been deleted");    
                    });
                }
                else {
                    alert("There was a problem deleting the FAQ!");
                }
            }
        });
    }
});