/*Unclean*/
var min_entry_widget_display = 3; //default number of lis to show for the Win Flash and PSssst widgets
var max_entry_widget_display = 10; //max number of lis to show for the Win Flash and PSssst widgets when expanded

/*This is the code for the PSssst Widget */
$.ajax({
    url:'/rest/2.0/query?q=FROM%20.psssst__c%20WHERE%20Status__c%20==%20"Published"%20ORDER%20BY%20EditionDate__c%20DESC',
    dataType: 'json',
    type: 'get',
    cache: false,
    success: function(data) {
        var SortDate = [];
        var displayed_item_count = 0;

        $(data.Records).each(function(index, value) {
            SortDate[index] = value.EditionDate__c;
            var EditionDate = new Date(value.EditionDate__c);
            var options = { year: "numeric", month: "long",
            day: "numeric" };
            EditionDate.setDate(EditionDate.getDate() + 1);

            // if ((PSssstEntry_id && value.Id == PSssstEntry_id) || !PSssstEntry_id) {
            if (displayed_item_count < min_entry_widget_display) {
                $("div.topics_block > div > ul.PSssstWidget").append(
                    "<li class=''>"
                        + "<a href='/aspx/PSssst?id=" + value.Id + "'>"
                            + "<h5>"
                            + value.EditionTitle__c
                            + " - "
                            + EditionDate.toLocaleDateString("en-US", options)
                            + " Edition"
                            + "</h5>" 
                        + "</a>"
                    + "</li>"
                );
                displayed_item_count++;
            }
            if (displayed_item_count >= min_entry_widget_display && displayed_item_count < max_entry_widget_display) {
                $("div.topics_block > div > ul.PSssstWidget").append(
                    "<li class='hidden_topic'>"
                        + "<a href='/aspx/PSssst?id=" + value.Id + "'>"
                            + "<h5>"
                            + value.EditionTitle__c
                            + " - "
                            + EditionDate.toLocaleDateString("en-US", options)
                            + " Edition"
                            + "</h5>" 
                        + "</a>"
                    + "</li>"
                );
                displayed_item_count++;
            }
            else if (index>=max_entry_widget_display) {
                return false;
            }
            if (index == (min_entry_widget_display)) {
                $(".psssst").children(".show_hide").removeClass("hidden");
            }
            // if (index >= min_entry_widget_display) {
            //     $("p.show_hide").removeClass("hidden");
            // }
        });
    }
});


/* This is for the Win Flash widget */
$.ajax({
    url:'/aspx/WinFlash/WinFlash',
    dataType: 'json',
    type: 'get',
    cache: false,
    success: function(data) {
        
        var displayed_item_count = 0;
        
        $(data).each(function(index, value) {
            if (value.Status__c == "Published") {
                var closeDate = new Date(value.CloseDate__c);
                var Value = value.Value__c;
    
                    if (displayed_item_count < min_entry_widget_display) {
                        /* Appending the information to the list > h5*/
                        $("div.topics_block > div > ul.WinFlashWidget").append(
                            "<li class=''>"
                            + "<a href='/aspx/WinFlash?id=" + value.Id + "'>"
                                + "<h5>" 
                                    + value.Name 
                                    + ", "
                                    + Value.toLocaleString('USD', {style: 'currency',currency: "USD",})
                                + "</h5>"
                                + "<span class='smallHeader'>"
                                    + value.Opportunity_Owner1_r.Name 
                                    + " | "
                                    + value.Type__c  
                                    + " | "
                                    + closeDate.toLocaleDateString("en-US")
                                + "</span>"
                            + "</a>"
                        + "</li>" 
                        );
                        displayed_item_count++;
                    }
                else if (displayed_item_count >= min_entry_widget_display && displayed_item_count < max_entry_widget_display) {
                    $("div.topics_block > div > ul.WinFlashWidget").append(
                        "<li class='hidden_topic'>"
                        + "<a href='/aspx/WinFlash?id=" + value.Id + "'>"
                            + "<h5>" 
                                + value.Name 
                                + ", "
                                + Value.toLocaleString('USD', {style: 'currency',currency: "USD",})
                            + "</h5>"
                            + "<span class='smallHeader'>"
                                + value.Opportunity_Owner1_r.Name 
                                + " | "
                                + value.Type__c  
                                + " | "
                                + closeDate.toLocaleDateString("en-US")
                            + "</span>"
                        + "</a>"
                    + "</li>" 
                    );
                    displayed_item_count++;
                }
                else if (index>=max_entry_widget_display) {
                    return false;
                }
                if (index == min_entry_widget_display) {
                    $(".winflash").children(".show_hide").removeClass("hidden");
                }
            }
        });
    }
});

/* This is for the IT Notices widget */
// I don't think this is working quite right...
// I'm going to work on it on Monday (15th) when I get back from my trip
// Feel free to comment it out for now if you like.
$.ajax({
    url:'/rest/2.0/query?q=FROM%20.ITNotices__c%20%20%20ORDER%20BY%20DisplayOrder__c%20DESC',
    dataType: 'json',
    type: 'get',
    cache: false,
    success: function(data) {
        var dateNow;
        var dateStart;
        var dateEnd;
        var displayed_item_count = 0;
        
        
        $(data.Records).each(function(index, value) {

            // If there's a start time, create the date for start and now
            if (value.StartTime__c !== null) {
                dateNow = new Date();
                dateStart = new Date(value.StartTime__c);
                
                // If there's a start, AND an end time, add the end time to the vars
                if (value.EndTime__c !== null) {
                    dateEnd = new Date(value.EndTime__c);
                    // If the start has passed, and the end hasn't been reached, append
                    if (dateNow > dateStart && dateNow < dateEnd) {
                        appendHTML();
                    }
                }
                // If there is only a start, and no end...
                else {
                    // And it's valid, append it
                    if (dateNow > dateStart) {
                        appendHTML();
                    }
                }
                    // Setting the Start and Current time to GMT (+5 from Central Daylight Time)
                    // Need to implement these once the appending logic is figured out
                    // dateStart.setHours(dateStart.getHours()+5);
                    // dateEnd.setHours(dateEnd.getHours()+5);
                    // dateNow.setHours(dateNow.getHours()+5);
            }
            // If there's only an end time, and no start time...
            else if (value.EndTime__c !== null) {
                dateNow = new Date();
                dateEnd = new Date(value.EndTime__c);
                // And it's valid, append it
                if (dateNow < dateEnd) {
                    appendHTML();
                }
                    
            }
            // If there's no start and end time
            else if (value.EndTime__c === null && value.StartTime__c === null) {
                    appendHTML();
                    $("#OSButton").removeClass("hidden");
                        // return false; 
                
            }
            function appendHTML() {
                if (displayed_item_count < min_entry_widget_display) {
                    $("div.topics_block > div > ul.ITNoticesWidget").append(
                        "<li class=''>" +
                            "<a href='/aspx/ITNotice?id=" + value.Id + "'>" +
                                "<h5>" + value.Name + "Function</h5>" +
                            "</a>" +
                        "</li>"
                    );
                    displayed_item_count++;
                 }
                // displayed_item_count++;
                else if (displayed_item_count >= min_entry_widget_display && displayed_item_count < max_entry_widget_display) {
                    $("div.topics_block>div>ul.ITNoticesWidget").append(
                        "<li class='hidden_topic'>"
                            + "<a href='/aspx/ITNotice?id=" + value.Id + "'>"
                                + "<h5>" + value.Name + "</h5>"
                            + "</a>"
                        + "</li>"  
                    );
                    displayed_item_count++;
                }
                else if (index >= max_entry_widget_display) {
                    return false;
                }

            }
            if (index == min_entry_widget_display) {
                $(".itnotices").children(".show_hide").removeClass("hidden");
            }
        });
    }
});


function isEven(n) {
   return n % 2 == 0;
}

function isOdd(n) {
   return Math.abs(n % 2) == 1;
}

// This is for the OSResourceLinks widget
$.ajax({
   // url:'https://opensymmetrytest.magentrixcloud.com/rest/2.0/query?q=FROM%20.winflash__c%20WHERE%20Name%20!=%20null',
    url:'/rest/2.0/query?q=FROM%20.OSResourceLinks__c%20WHERE%20Name%20!=%20null%20ORDER%20BY%20Name%20ASC',
    dataType: 'json',
    type: 'get',
    cache: false,
    success: function(data) {

        $(data.Records).each(function(index, value) {
            if (isEven(index)) {
                $("div.topics_block > ul.OSResourceLinks1").append(
                    "<li>"
                    + "<a target='_blank' " + (value.tooltip__c ? "data-toggle='tooltip'" : "") + " title='" + value.tooltip__c + "' href='" + value.OSLinks__c + "'>"
                        + "<h5>"
                        + value.OSText__c
                        + "</h5>"
                    + "</a>"
                    + "</li>"
                );
            } else {
                $("div.topics_block > ul.OSResourceLinks2").append(
                    "<li>"
                    + "<a target='_blank' " + (value.tooltip__c ? "data-toggle='tooltip'" : "") + " title='" + value.tooltip__c + "' href='" + value.OSLinks__c + "'>"
                        + "<h5>"
                        + value.OSText__c
                        + "</h5>"
                    + "</a>"
                    + "</li>"
                );
            }
        });
    }
});


//Function to "show more" or "show less" for the Win Flash widget, PSssst widget, and the 3 topics widgets
$(document).on("click", ".show_hide", function() {
    
    //Default value is "Show More"
    if ($(this).html() == "Show More") {
        $($(this).siblings().children(".hidden_topic")).slideDown(400, function() {
            $(this).removeClass("hidden_topic").addClass("visible");
        });
        //Since it's expanded, change the "Show More" to "Show Less"
        $(this).html("Show Less");
    }
    
    //Opposite action if it is "Show Less"
    else if ($(this).html() == "Show Less") {
        $($(this).siblings().children(".visible")).slideUp(400, function() {
            $(this).removeClass("visible").addClass("hidden_topic");
        });
        $(this).html("Show More");
    }
});


function populateTopicsList(URLJSON, target_element) {
    //var URLJSON = '/acls/NotificationPage/Url';
    var UserName = '/acls/Notification/UserEntity';
    var OS = 'https://opensymmetrytest.magentrixcloud.com/forumpost/thread/';
    var End = '?retUrl=%2FForum%2Findex';
    // var post_count = 0; not needed because key1 + 1 is the same thing.
    // var hidden_topics_exist = false;
    $.getJSON(URLJSON).done(function(Data) {
        $.getJSON(UserName).done(function(usr) {
            $.each(Data,function(key1,forumitem1) {
                $.each(usr,function(key,useritem) {
                    if (forumitem1.CreatedById == useritem.UserId) {
                        // keep track of number of topics displayed
                        // post_count++;
                        
                        var currentDate = new Date();
                        var ForumDate = new Date(forumitem1.ForumDate);
                        var delta = Math.abs(currentDate - ForumDate  ) / 1000;
                        var days = Math.floor(delta / 86400);
                        var hours = Math.floor(delta / 3600) % 24;
                        var minutes = Math.floor(delta / 60) % 60;
                        var seconds = delta % 60;
                        
                        // container for time stamp item
                        var time_stamp = "";
                        
                        // alter output based on length of time
                        if (days > 30) {
                            var year = ForumDate.getFullYear(); 
                            var objDate = new Date(ForumDate),
                            locale = "en-us",
                            month = objDate.toLocaleString(locale, { month: "long" });
                            time_stamp = month + " " + year;
                        } else if (days <= 30 && days >=1) {
                            //time_stamp = month + " " + year;
                            time_stamp = days + " day" + (days == 1 ? "" : "s") + " ago";
                        } else if (days < 1 && hours >= 1) {
                            time_stamp = hours + " hour" + (hours == 1 ? "" : "s") + " ago";
                        } else if (days <1 && hours < 1 && minutes >= 1) {
                            time_stamp = minutes + " minute" + (minutes == 1 ? "" : "s") + " ago";
                        } else if (days < 1 && hours < 1 && minutes < 1 && seconds >= 0) {
                            time_stamp = seconds + " second" + (seconds == 1 ? "" : "s") + " ago";
                        }
                        
                        // url for linking to topic
                        var topic_url = OS + forumitem1.Id + End;
                        
                        // container for topic list item
                        var topic_row = "";
                        
                        // build identifying content of item
                        topic_row = "<h5>" + forumitem1.Name  + "</h5>";
                        topic_row += "<img class=\"user-profile-img\" src=\"/userprofile/img/" + useritem.UserId + "\"/>";
                        topic_row += "<span class=\"user-name\">" + useritem.Name + "</span>";
                        
                        // build reply count
                        topic_row += "<span class=\"reply-count\">" + forumitem1.Reply + "</span>";
                        
                        // build time stamp item
                        topic_row += "<span class=\"reply-time\">" + time_stamp + "</span>";
                        
                        var hider = "";
                        // hide topics beyond 3 count and add "Show More" for that topic
                        if (key1 >= min_entry_widget_display) {
                            hider = " class=\"hidden_topic\"";
                                if (target_element == "hot_topics") {
                                    $("ul#hot_topics").siblings(".show_hide").removeClass("hidden");
                                }
                                else if (target_element == "my_topics") {
                                    $("ul#my_topics").siblings(".show_hide").removeClass("hidden");
                                }
                                else if (target_element == "new_topics") {
                                    $("ul#new_topics").siblings(".show_hide").removeClass("hidden");
                                }
                        }
                        
                        // stop appending the page after the max one has been reached
                        if (key1 >= max_entry_widget_display) {
                            return false;
                        }
                        
                        // wrap contents into list item and link
                        topic_row = "<li" + hider + "><a href=\"" + topic_url + "\">" + topic_row + "</a></li>";
                        
                        // add item to topics list
                        $("ul#" + target_element).append(topic_row);
                    }
                });
            });
        });
    });
}