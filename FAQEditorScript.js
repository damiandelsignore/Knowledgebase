// This is the JavaScript for the FAQ Editor.
// This code will read in the information from the CKEditor if an id has been passed in.
// Otherwise, it starts with a clean CKEditor.
// This will also save a new FAQ or edit the existing FAQ (using the same passed in id)

var USERGROUPS = "<%:DataBag.UserGroups%>";
var RECORDID = '<%=Request.QueryString["recordID"]%>';

$(document).ready(function(){
    var FAQURL = "/acls/FAQEditor/CategoryInfo";
    var FAQCategory = [];
    // Function to get the categories from the Categories__c field inside the FAQEntry__c entity
    $.getJSON(FAQURL).done(function(FAQData) {
        var categoryList = "<option disabled selected>Select FAQ Type</option>";
        $.each(FAQData,function(key,value) {
            // Loop to test whether or not a category is already pushed in the FAQCategory Array.
            var numFAQs = FAQCategory.length;
            var exists = false;
            for (var j = 0; j < numFAQs; j++) {
                if (FAQCategory[j] == value.CategoryName) {
                    exists = true;
                    break;
                }
            }
            if (exists == false) {
                FAQCategory.push(value.CategoryName);
                categoryList += "<option value=\"" + value.CategoryName + "\">" +  value.CategoryName + "</option>";
            }
        });
        $("select#FAQ_selector").html(categoryList);
        if (RECORDID) {
            ckListener();
        }
        CKEDITOR.replace('CKEditor');
    });
    // Function to set the values of the page when editing
    function ckListener() {
        CKEDITOR.on('instanceReady', function() {
            var OwnerId = "";
            $.ajax({
                url:'/rest/2.0/query?q=FROM%20.FAQEntry__c%20WHERE%20Id%20=%20%22' + RECORDID + '%22',
                dataType: 'json',
                type: 'get',
                cache: false
            })
            .done( function(data) {
                document.getElementById('FAQ_Title').value = data.Records[0].Name;
                CKEDITOR.instances["CKEditor"].setData(data.Records[0].FAQAnswer__c);
                $("select#Status_selector").val(data.Records[0].Status__c);
                OwnerId = data.Records[0].OwnerId;
                $("select#FAQ_selector").val(data.Records[0].Categories__c);
                $('#author').val(data.Records[0].UserName__c);
            })
            .fail( function(error) {
                console.error(error);
            });
        });
    }
    
    
    // Showing the Status field if the user is in the FAQ Publishers Group
    if (USERGROUPS.search("FAQ Publishers") >= 0) {
        $(".status").removeClass("hidden");
    }
    
    // Populating the drop down for Authors
    var userListURL = "/acls/FAQEditor/UserList";
    var userListArray = [];
    $.getJSON(userListURL).done(function(UserData) {
        $.each(UserData,function(key,value) {
           userListArray.push(value.Name + "|" + value.Id); 
        });
        var selectUser = "";
        var userArrayLength = userListArray.length;
        
        // Looking through the userListArray, and writing them to the DOM for the Author dropdown
        for(var i = 0; i < userArrayLength; i++)
        {
            var userName = userListArray[i].split("|")[0]; // get just the part before the "|"
            selectUser += "<option value=\"" +  userName + "\" data-User=\"" + userListArray[i] + "\"></option>";
        }
        $("datalist#User").html(selectUser);
    });
});

$("#Save").click(function() {
    var title = document.getElementById('FAQ_Title').value;
    var body =  CKEDITOR.instances['CKEditor'].getData();
    var status = $("select#Status_selector").val();
    var FAQType = $("select#FAQ_selector").val();
    var id = $('#User').find("[value='"+ $('#author').val() + "']").attr("data-User");
    var authorID = id.split("|")[1];
    var userName = id.split("|")[0];
    authorID.toString();
    var editData = {
        Id : RECORDID,
        FAQAnswer__c : body,
        Categories__c : FAQType,
        Name : title,
        Status__c : status,
        CreatedById : authorID,
        UserName__c : userName
    }
    if (RECORDID) {
        REST2.edit({
            objectType: 'FAQEntry__c',
            data: editData,
            callback: function(context) {
                if (REST2.isSuccess(context)) {
                    var newId = context.Id;
                    alert("Thank you for editing the FAQ!");
                }
            }
        });
    } 
    else {
        REST2.create({
            objectType: 'FAQEntry__c',
            data: {
                FAQAnswer__c : body,
                Categories__c : FAQType,
                Name : title,
                Status__c : status,
                CreatedById : authorID,
                UserName__c : userName
            },
            callback: function(context) {
                if (REST2.isSuccess(context)) {
                    var newId = context.Id;
                    alert("Thank you for submitting a new FAQ!");
                }
            }
        });
    }
        if (USERGROUPS.search("FAQ Publishers") >= 0) { 
            window.location.href = "/aspx/FAQManagement?practice=" + FAQType;
        }
        else {
            window.location.href = "/aspx/FAQ?practice=" + FAQType;
        }
});