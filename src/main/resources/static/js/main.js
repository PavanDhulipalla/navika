jQuery.extend({
    highlight: function(node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
            !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
            !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function(options) {
    var settings = {
        className: 'highlight',
        element: 'span'
    };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function() {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function(words, options) {
    var settings = {
        className: 'highlight',
        element: 'span',
        caseSensitive: false,
        wordsOnly: false
    };
    jQuery.extend(settings, options);

    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i) {
        return word != '';
    });
    words = jQuery.map(words, function(word, i) {
        return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) {
        return this;
    };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);

    return this.each(function() {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};


function saveUserClickHistory(element) {
    var time = new Date().getTime();
    var couponId = $(element).attr("data-coupon-id");
    var request = $.ajax({
        url: '/saveUserClickHistory',
        type: "GET",
        data: {
            "time": time,
            "couponId":couponId
        }
    });

    request.done(function(msg) {});

    request.fail(function(jqXHR, textStatus) {
        console.log(jqXHR);
    });
}



function navigateUserTo(url) {
    if (url) {
        window.open(url);
    }
}

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}



function closeCommentsModal(){
	$(this).closest(".search-result").find(".comments-modal").modal('toggle');
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function isValidCouponCode(str) {
    return (/\b[A-Z]+[A-Z0-9]{3,12}\b.*?/g.test(str));
}

function registerEvents() {
	
	$(".couponTitle").each(function(){
		var txt= $(this).text();
		if(txt.length > 250){
			 $(this).text(txt.substring(0,250) + '.....');
			 $(this).attr("title",txt);
		}
	});
	//filter left navitems
	$(".input-filter").keyup(function(){
		var val = $(this).val();
		if(val){
			$(this).closest(".list-group").find(".filter-item-div").each(function(){
				var text = $(this).text();
				if(text.toLowerCase().indexOf(val.toLowerCase()) == -1){
					$(this).hide();
				}else{
					$(this).show();
				}
			});
		}else{
			$(this).closest(".list-group").find(".filter-item-div").each(function(){
				$(this).show();
			});
		}
	});
	//hide comments popup
	$(".comments-popup-close").click(function(){
		$(".comments-modal").modal('toggle');
	});
	
	$(".user-name,.user-comment").focus(function(){
		$(this).removeClass("red-border");
	});
	
	$(".submit-comments").click(function(){
		var userName = $(this).closest(".comments-modal").find(".user-name").val();
		if(!userName){
			$(this).closest(".comments-modal").find(".user-name").addClass("red-border");
			return;
		}else{
			$(this).closest(".comments-modal").find(".user-name").val("");
		}
		var userComment = $(this).closest(".comments-modal").find(".user-comment").val();
		if(!userComment){
			$(this).closest(".comments-modal").find(".user-comment").addClass("red-border");
			return;
		}else{
			$(this).closest(".comments-modal").find(".user-comment").val("");
		}
		var couponId = $(this).closest(".comments-modal").attr("coupon-id");
		
		var request = $.ajax({
	        url: '/saveUserComment',
	        type: "GET",
	        data: {
	            "userName": userName,
	            "userComment": userComment,
	            "couponId": couponId
	        }
	    });
		
		$(".comments-modal").modal('toggle');
	    request.done(function(msg) {
	    	//update count here 
	    	var currentCount = $(".active-comment-icon .user-comments-count").text();
	    	if(currentCount){
	    		currentCount = parseInt(currentCount);
	    		$(".active-comment-icon .user-comments-count").text(++currentCount);
	    	}else{
	    		$(".active-comment-icon .user-comments-count").text('1');
	    	}
	    	 
	    });

	    request.fail(function(jqXHR, textStatus) {
	        console.log(jqXHR);
	    });
		
	});
	
	$(".run-job").click(function(){
		var storeName = $(this).closest(".store-to-run-job").find(".store-name-val").val();
		var proxyStr = $(this).closest(".store-to-run-job").find(".proxy-val").val();
		var count = $(this).closest(".store-to-run-job").find(".store-name-val").attr('count');
		if(!count  || count < 3){
			if(!count){
				count = 0;
			}
			$(this).closest(".store-to-run-job").find(".store-name-val").attr('count',++count);
			console.log('count --->'+count);
			return;
		}
		alert('sucessfully triggered job for store: '+storeName+' using proxy server:'+proxyStr);
		$(this).closest(".store-to-run-job").find(".store-name-val").attr('count',0);
		var request = $.ajax({
	        url: '/runjob',
	        type: "GET",
	        data: {
	            "storeName": storeName,
	            "proxyStr": proxyStr
	        }
	    });
		
	});
	
	$(".delete-job").click(function(){
		var storeName = $(this).closest(".store-to-run-job").find(".store-name-val").val();
		var count = $(this).closest(".store-to-run-job").find(".store-name-val").attr('count');
		if(!count  || count < 3){
			if(!count){
				count = 0;
			}
			$(this).closest(".store-to-run-job").find(".store-name-val").attr('count',++count);
			console.log('count --->'+count);
			return;
		}
		alert('sucessfully deleted job for store: '+storeName);
		$(this).closest(".store-to-run-job").find(".store-name-val").attr('count',0);
		var request = $.ajax({
	        url: '/deleteJob',
	        type: "GET",
	        data: {
	            "storeName": storeName
	        },
	        success: function(){
	        	window.location.reload();
	        }
	    });
		
	});
	
	//show comments
	$(".coupon-comments").click(function(){
		$(".active-comment-icon").removeClass("active-comment-icon");
		$(this).addClass("active-comment-icon");
		var commentsIcon = $(this);
		var couponElement = $(this).closest(".coupon-layout");
		var couponId = $(couponElement).attr("id");
		$(".user-comments-div").empty();
		$(".comments-modal").attr("coupon-id",couponId);
		$(".comments-modal").modal('show');
		$.ajax({ 
				url: "/getUserComments?couponId="+couponId, 
				success: function(result){
				   if(result && result.length > 0){
					   $(".active-comment-icon .user-comments-count").text(result.length);
					   var dynamicHTML = '';
					   $(result).each(function(index,commentItem){
						   console.log(commentItem);
						   var datestr = formatDate(commentItem.commentedDate);
						   dynamicHTML += '<div class="row user-comment-item"><div class="col-sm-1 col-xs-2"><div class="thumbnail"><img class="img-responsive  user-photo" src="/images/avatar_2x.png">';
						   dynamicHTML += '</div></div><div class="col-sm-11 col-xs-10"><div class="panel panel-default"><div class="panel-heading"><strong>'+commentItem.name+' </strong>';
						   dynamicHTML +=  '</div><div class="panel-body">'+ commentItem.comment+'</div></div></div></div>';
					   });
					   $(".user-comments-div").append(dynamicHTML);
				   }
				 }
			});
	});
	
	$(".showOrHide").click(function(){
		var visibleConditionsLength = $(this).closest(".conditions-list").find("li.hide-conditions:visible").length;
		$(this).closest(".conditions-list").find("li.hide-conditions").toggle();
		if(visibleConditionsLength > 0){
			$(this).text("Show More");
		}else{
			$(this).text("View less");
		}
		
	});
	// When the user scrolls down 20px from the top of the document, show the button
	window.onscroll = function() {scrollFunction()};
	//scroll to top ends here
	
    $(".user-action").on('click', function() {
    	console.log('savig user click history');
        saveUserClickHistory($(this));
    });

    $(".view-details").off('click').on('click', function() {
        $('.modal').hide();
        $(this).closest(".search-result").find('.modal.coupon-conditions').modal('show');
    });

    $(".copy-coupon").on('click', function() {
        var couponCode = $(this).attr("data-url");
        var dataLargeText = $(this).attr("data-large-text");
        if (dataLargeText) {
        	fallbackCopyTextToClipboard($(this),dataLargeText);
        }else if(couponCode){
        	fallbackCopyTextToClipboard($(this),couponCode);
        }
    });
    
    //hover images magnification
    $(".coupon-thumbnail").not('.magnified').ezPlus({
    	zoomWindowPosition: 6,
    	borderSize: 0,
        easing: true
    });
    $(".coupon-thumbnail").addClass('magnified');
}

function formatDate(datestr) {
	try{
		 var date = new Date(datestr);
		  var monthNames = [
		    "January", "February", "March",
		    "April", "May", "June", "July",
		    "August", "September", "October",
		    "November", "December"
		  ];

		  var day = date.getDate();
		  var monthIndex = date.getMonth();
		  var year = date.getFullYear();

		  return day + ' ' + monthNames[monthIndex] + ' ' + year;
	}catch(e){
		console.log('error while formatting date');
	}
	 
	}

function fallbackCopyTextToClipboard(element,text) {
	  var textArea = document.createElement("textarea");
	  textArea.value = text;
	  $(element).append(textArea);
	  textArea.focus();
	  textArea.select();

	  try {
	    var successful = document.execCommand('copy');
	    var msg = successful ? 'successful' : 'unsuccessful';
	    var alertDIv = $('<div class="alert alert-success copy-message"><strong>Success!</strong> copied code : '+text+'</div>');
	  } catch (err) {
		  alertDIv = $('<div class="alert alert-error copy-message"><strong>Error!</strong> error while copying code : '+text+'</div>');
	  }
	  $(element).closest(".panel-heading").append(alertDIv);
	    setTimeout(function(){
	    	$(alertDIv).remove();
	    },3000);
	  $(textArea).remove();
	}

function updateCouponCode(couponId,couponCode){
	$.ajax(
		{url: "/updateCouponCode?id="+couponId+"&code="+couponCode, 
		success: function(result){
		  console.log('updateCode');	
		 }
		});
}

function updateCouponCodeAdmin(couponId,couponCode){
	$.ajax(
		{url: "/updateCouponCode?id="+couponId+"&code="+couponCode, 
		success: function(result){
		  console.log('updateCode');
		  document.location.reload()
		 }
		});
}

function updateLargeCouponCodeAdmin(couponId,couponCode,largeCouponCode){
	$.ajax(
		{url: "/updateCouponCode?id="+couponId+"&code="+couponCode+"&largeCouponCode="+largeCouponCode, 
		success: function(result){
		  console.log('updateCode');	
		  document.location.reload()
		 }
		});
}

function hideCoupon(couponId,couponCode){
	$.ajax(
		{url: "/hideCoupon?id="+couponId, 
		success: function(result){
		  console.log('coupon hidden');	
		  document.location.reload()
		 }
		});
}

function reviewUpdateCoupon(couponId,couponCode){
	$.ajax(
		{url: "/reviewCoupon?id="+couponId, 
		success: function(result){
		  console.log('review done');
		  document.location.reload()
		 }
		});
}

function validateCouponCode(){
	$(".coupon-code-span:visible").each(function(){
		var couponCodeText = $(this).text();
		if(couponCodeText){
			var isValidCouponCodeStr = isValidCouponCode(couponCodeText);
			if(!isValidCouponCodeStr){
				$(this).text("");
				var couponId = $(this).closest(".search-result").attr("id");
				//updateCouponCode(couponId,"");
			}
		}
	});
}

function highlighText() {
    $(".conditions-list li,.coupon-header-text").each(function(){
    	var couponCondition = $(this).text();
    	var matchingString;
    	var regex = /\b[A-Z]+[A-Z0-9]{3,12}\b.*?/g;
    	do{
    		matchingString = regex.exec(couponCondition);
    		if(matchingString &&  ($(this).text().toLowerCase().indexOf('code') > -1 || $(this).text().toLowerCase().indexOf('coupon') > -1)){
    		if(!$(this).is(".couponcode")){
    			 $(this).highlight(matchingString);
    		}	
    	  }
       	 }while(matchingString);
    });
   
 }
function setMargin(){
	var left = $(".navbar-brand").width();
	$(".append-margin-left").css({"margin-left":(left+10)});
	$(".navbar-header").css({"margin-left":10});
}
function setLogoLeft(){
	var windowWidth = $(window).width();
	if(windowWidth > 900){
		setMargin();
		setTimeout(function(){
			setMargin();
		},100);
	}
	
}
//ashok
var coupontags = [];
$(document).ready(function() {
	setLogoLeft();
	$(window).resize(function(){
		setLogoLeft();
	});
	setMainContentheight();
	$(".lazy,.content-page,.navbar").css({"opacity":1});
	$('#preloader').fadeOut(function(){$(this).remove();});
	removeBlanckCharacters();
	expnadMobileSearch();
	//validateCouponCode();
    registerEvents();
    highlighText();
    loadDropDownValues();
    registerChipEvents();
    registerAdminEvents();
    registerCheckboxEvent();
    $(".lazy").lazy();
   // loadCarousels();
    loadLazyImages();
    registerSortEvent();
    registerClickEvent();
    //it should be in last always
    registerLazyEvents();
    removeSpecialCharacters();
    registerInfiniteScroll();
    downloadImages();
    registerScrollEvent();
});


function registerScrollEvent(){
	$(window).scroll(function(){
		downloadImages();
	});
}

function downloadImages(){
	$("img").not(".image-rendered").each(function(){
		if($(this).visible() && $(this).attr('data-src')){
			$(this).addClass('image-rendered');
			let element = $(this);
			$.ajax({
		         url: '/getImage?fileName='+$(this).attr('data-src'),
		         type: "GET",
		         success : function(response){
		        	 console.log(response);
		        	 $(element).attr('src',response);
		         },
		         error : function(err){
		        	 console.log('err');
		         }
		     });
		}
	});
}

function getNextpageURL(){
	console.log('searchCoupons'+easyAutoCompleteSelectIndex);
	var searchFiledId = $(".auto-suggetions:visible").attr("id");
	var searchString =  $("#"+searchFiledId).val();
	if(!searchString){
		searchString = $("#searched-value").val();
	}
	
	if(!searchString){
		return;
	}
	
	if(searchString && searchString.indexOf("(") > -1){
		searchString = searchString.substr(0,searchString.indexOf('('));
	}
	if(searchString && searchString.endsWith("....")){
		searchString = searchString.substr(0,searchString.length - 4);
	}
	if (searchString && searchString.length > 0) {
		searchString = searchString.replace("%"," ");
        searchString = encodeURI(searchString,"UTF-8");
        $(".easy-autocomplete-container ul").hide();
        var sortdir = $("#sortDir").val();
        if(!sortdir){
        	sortdir = '';
        }
        
        var onlyCoupons = $("#coupon_chk_box").is(':checked');
        var pageNumber = $("#currentPage").val();
        pageNumber = parseInt(pageNumber);
        pageNumber = pageNumber + 1;
        var searchURL = "/offers/" + searchString+'/'+pageNumber+'?sort='+sortdir+'&onlyCoupons='+onlyCoupons;
        return searchURL;
    }
}

function registerInfiniteScroll(){
	var requestInProgress = false;
	setInterval(function () { 
	  if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
	      //Add something at the end of the page
	  	 console.log('page reached');
	  	 var noOfPages = $("#noOfPages").val();
	  	 var currentPage = $("#currentPage").val();
	  	 
	  	 //convert to integers
	  	 noOfPages = parseInt(noOfPages);
	  	 currentPage = parseInt(currentPage);
	  	 //break condition
	  	 if(!noOfPages ||  !currentPage || currentPage >= noOfPages){
	  		 return;
	  	 }
	  	 
	  	 if(requestInProgress){
	  		 return;
	  	 }
	  	 
	  	$.LoadingOverlay("show");
	  	requestInProgress = true;
	  	 var request = $.ajax({
	         url: getNextpageURL(),
	         type: "GET"
	     });

	     request.done(function(msg) {
	    	 var newPageDoc = $(msg);
	    	 var pageResults = $(newPageDoc).find('.search-result');
	    	 $(pageResults).each(function(){
	    		 $('.couons-right-panel').append($(this));
	    	 });
	    	 
	    	$("#currentPage").val((currentPage + 1).valueOf());
	    	$(".lazy,.content-page,.navbar").css({"opacity":1});
    		$('#preloader').fadeOut(function(){$(this).remove();});
    		removeBlanckCharacters();
    		expnadMobileSearch();
    		//validateCouponCode();
    	    registerEvents();
    	    highlighText();
    	    loadDropDownValues();
    	    registerChipEvents();
    	    registerAdminEvents();
    	    registerCheckboxEvent();
    	    $(".lazy").lazy();
    	    loadLazyImages();
    	    registerSortEvent();
    	    registerClickEvent();
    	    registerLazyEvents();
    	    removeSpecialCharacters();
    	    requestInProgress = false;
    	    $.LoadingOverlay("hide");
	     });
	   }
	},1000);
}

function removeSpecialCharacters(){
	$(".couponTitle,.conditions-list li,.home-page-title").each(function(){
		$(this).text($(this).text().replace(/[?]/g,''));
	});
}

function registerClickEvent(){
	$(".show-coupon-tnc").click(function(){
		$(this).closest(".coupon-main-row").find(".conditions-list").show();
		$(this).hide();
	});
	$('.home-page-title').click(function(){
		var title = $(this).attr("data-attr-title");
		title = title.replace(/[^a-zA-Z0-9]/g,' ');
		if(title && title.length > 50){
			title = title.substring(0,50);
		}
		if(title){
			var searchURL = "/offers/" + title;
		    window.location.href = searchURL ;
		}
	});
}

function registerSortEvent(){
	$(".sort-filed-dropdown li").click(function(){
		console.log($(this).text());
		$("#sortDir").val($(this).attr('data-attr-val'));
		searchCoupons();
	});
}
function loadLazyImages(){
	setInterval(function(){
		 $(".lazy").lazy();
	}, 2000);
}
function setMainContentheight(){
	setTimeout(function(){
		var navbarHeight = $(".navbar").height() + 10;
		$(".container-fluid.bootstrap.snippet").css({"margin-top":navbarHeight});
	},500);

}

function loadCarousels(){
	//store slider
	 $('.owl-carousel.store-slider').owlCarousel({
	        loop:true,
	        margin:10,
	        nav:true,
	        dots: false,
	        autoplay: true,
	        autoplayHoverPause: true,
	        responsiveClass: true,
	        autoplayTimeout:3000,
	        responsive:{
	            0:{
	                items:3
	            },
	            600:{
	                items:4
	            },
	            1000:{
	                items:8
	            }
	        }
	    });
	 
	 //coupon slider
	 $('.owl-carousel.coupons-slider').owlCarousel({
	        loop:true,
	        margin:10,
	        nav:true,
	        dots: false,
	        autoplay: false,
	        autoplayHoverPause: true,
	        responsiveClass: true,
	        autoplayTimeout:9000,
	        responsive:{
	            0:{
	                items:1
	            },
	            600:{
	                items:2
	            },
	            1000:{
	                items:5
	            }
	        }
	    });
	 
	 $(".owl-carousel .thumbnail").click(function(){
		var title = $(this).attr('data-coupon-title') ;
		title = title.replace(/[^a-zA-Z0-9]/g,' ');
		if(title && title.length > 50){
			title = title.substring(0,50);
		}
		if(title){
			var searchURL = "/offers/" + title;
		    window.location.href = searchURL ;
		}
	 });
}
function loadIframe(){
	setTimeout(function(){
		var constructDealIframe = '<div class="embed-responsive embed-responsive-16by9"><iframe  class="embed-responsive-item" width="728" height="90" frameborder="0" scrolling="no"  src="https://widget.cuelinks.com/widgets/27395?pub_id=36252CL32715"></iframe></div>';
		var constructCouponIframe = '<div class="embed-responsive embed-responsive-16by9"><iframe  class="embed-responsive-item" width="728" height="90" frameborder="0" scrolling="no"  src="https://widget.cuelinks.com/widgets/27393?pub_id=36252CL32715"></iframe></div>';
		$(".appendIframe:even").html(constructDealIframe);
		$(".appendIframe:odd").html(constructCouponIframe);
	},4000);
}
function registerLazyEvents(){
	setTimeout(function(){
		(function(d, t) {
		    var s = document.createElement('script');s.type = 'text/javascript';
		    s.async = true;s.src = (document.location.protocol == 'https:' ? 'https://cdn0.cuelinks.com/js/' : 'http://cdn0.cuelinks.com/js/')  + 'cuelinksv1.js';
		    document.getElementsByTagName('body')[0].appendChild(s);
		    var shareThis = document.createElement('script');shareThis.type = 'text/javascript';
		    shareThis.async = true;shareThis.src ='//platform-api.sharethis.com/js/sharethis.js#property=5b6eef6804b9a500117b0d89&product=gdpr-compliance-tool';
		    document.getElementsByTagName('body')[0].appendChild(shareThis);
		    localStorage.setItem("isFilesCached",true); 
		    if(document.createStyleSheet) {
		     document.createStyleSheet('http://example.com/big.css');
		    }else {
		    	  var styles = '@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700");';
		    	  var newSS=document.createElement('link');
		    	  newSS.rel='stylesheet';
		    	  newSS.href='data:text/css,'+escape(styles);
		    	  document.getElementsByTagName("head")[0].appendChild(newSS);
		      }
		    }());
	},200);
}

function removeBlanckCharacters(){
	$(".conditions-list li").not(".couponcode,.condition-info-link").each(function(){
		var text = $(this).text();
		$(this).html("<span>"+text+"</span>");
	});
}


function expnadMobileSearch(){
	$('body').off("click").on("click",function(evt){
		$(".lazy").lazy();
		var currentTarget = evt.target;
		if($(currentTarget).is(".auto-suggetions") || $(currentTarget).is(".mobile-search-close-icon") || $(currentTarget).is(".glyphicon-search")){
			return;
		}else{
			$(".expand-search-bar").removeClass("expand-search-bar");
			$(".mobile-search-close-icon").remove();
		}
	});
	$(".mobile-search").click(function(){
		if($(this).hasClass("expand-search-bar")){
			return;
		}
		$(this).addClass("expand-search-bar");
		$(".mobile-search").after('<span class="fa fa-close mobile-search-close-icon" aria-hidden="true"></span>');
		$(".mobile-search-close-icon").off("click").on("click",function(){
			console.log('mobile close  event')
			$(".auto-suggetions").val("");
		});
	});
}

function registerAdminEvents(){
	$(".update-coupon-code").click(function(){
		var couponId = $(this).attr("coupon-id");
		var couponCode = $(this).closest(".coupon-review-div").find(".couponCode").val();
		var largeCouponCode = $(this).closest(".coupon-review-div").find(".extraCouponText").val();
		if(couponCode && !largeCouponCode){
			couponCode = couponCode.trim();
			if(couponCode &&couponCode.length > 2 ){
				updateCouponCodeAdmin(couponId,couponCode);
			}
		}else if(largeCouponCode && !couponCode){
			couponCode = 'SEEBELOW';
			largeCouponCode = largeCouponCode.trim();
			if(largeCouponCode && largeCouponCode.length > 2){
				updateLargeCouponCodeAdmin(couponId,couponCode,largeCouponCode);
			}
		}else if(largeCouponCode && couponCode){
			largeCouponCode = largeCouponCode.trim();
			if(largeCouponCode && largeCouponCode.length > 2){
				updateLargeCouponCodeAdmin(couponId,couponCode,largeCouponCode);
			}
		}
	});
	
	$(".hide-coupon").click(function(){
		var couponId = $(this).attr("coupon-id");
		hideCoupon(couponId);
	});
	
	$(".review-coupon").click(function(){
		var couponId = $(this).attr("coupon-id");
		reviewUpdateCoupon(couponId);
	});
	
}


function registerChipEvents(){
	$(".removefiltertag").off("click").on("click",function(){
		$(this).closest(".chip").remove();
		$(".couons-left-panel").find(".filter-item-div").find("input").prop("checked",false);
		$("div.chip").each(function(){
			var chipVal = $(this).attr('data-value');
			$(".couons-left-panel").find(".filter-item-div").find("input").each(function(){
				var tagVal = $(this).val();
				if(chipVal.toLowerCase() == tagVal.toLowerCase()){
					$(this).prop("checked",true);
				}
			});
		});
		applyFilters();
	});
}
function registerCheckboxEvent(){
	/*$( "input[type='checkbox']" ).checkboxradio({
	        icon: false
	});*/
	
	$(".ads_Checkbox").change(function(){
		applyFilters();
	});
}

var easyAutoCompleteSelectIndex = -1;
function loadDropDownValues(){
	
	$("div.chip").each(function(){
		var chipVal = $(this).attr('data-value');
		$(".couons-left-panel").find(".filter-item-div").find("input").each(function(){
			var tagVal = $(this).val();
			if(chipVal.toLowerCase() == tagVal.toLowerCase()){
				$(this).prop("checked",true);
			}
		});
	});
	
	var options = {

			  url: function(phrase) {
				  if(phrase && phrase.length >= 1){
					  return "/getAutoSuggetions?searchWord="+phrase;
				  }
			  },
			  list: {	
			    	maxNumberOfElements: 12,
			        match: {
			            //enabled: true
			        },
			        onKeyEnterEvent:function(){
			        	searchCoupons();
			        },
			        onChooseEvent:function(){
			        	searchCoupons();
			        },
			        onSelectItemEvent: function() {
						easyAutoCompleteSelectIndex = $(".auto-suggetions").getSelectedItemIndex();
					}
			      },

			  ajaxSettings: {
			    dataType: "json",
			    method: "GET",
			    data: {
			      dataType: "json"
			    }
			  },
			  requestDelay: 200
			};
	
	$(".auto-suggetions").easyAutocomplete(options);
}

//main-ashok
function searchCoupons(){
	console.log('searchCoupons'+easyAutoCompleteSelectIndex);
	var searchFiledId = $(".auto-suggetions:visible").attr("id");
	var searchString =  $("#"+searchFiledId).val();
	if(!searchString){
		searchString = $("#searched-value").val();
	}
	
	if(!searchString){
		return;
	}
	
	if(searchString && searchString.indexOf("(") > -1){
		searchString = searchString.substr(0,searchString.indexOf('('));
	}
	if(searchString && searchString.endsWith("....")){
		searchString = searchString.substr(0,searchString.length - 4);
	}
	if (searchString && searchString.length > 0) {
		searchString = searchString.replace("%"," ");
        searchString = encodeURI(searchString,"UTF-8");
        $(".easy-autocomplete-container ul").hide();
        var sortdir = $("#sortDir").val();
        if(!sortdir){
        	sortdir = '';
        }
        
        var onlyCoupons = $("#coupon_chk_box").is(':checked');
        
        var searchURL = "/offers/" + searchString+'?sort='+sortdir+'&onlyCoupons='+onlyCoupons;
        window.location.href = searchURL ;
    }
}


function filterStores(){
	var serachString = $("#serachString").val();
	if(serachString){
		$(".parent-div").each(function(){
			var storeName = $(this).attr("data-attr-val");
			if(storeName.toLowerCase().indexOf(serachString.toLowerCase()) > -1){
				$(this).show();
			}else{
				$(this).hide();
			}
		});
		 $('.lazy').lazy();
	}else{
		$(".parent-div").show();
	}
	
}

function applyFilters(){
	var filterTags = '';
	$(".couons-left-panel").find(".filter-item-div").find("input").each(function(){
		var isChecked = $(this).is(":checked");
		if(isChecked){
			filterTags += $(this).val()+"|";
		}
	});
	var searchString = $(".auto-suggetions:visible").val();
	if(!searchString){
		searchString = $("#searched-value").val();
	}
	if (searchString && searchString.length > 0) {
		//store in local storage 
        searchString = encodeURI(searchString);
        var searchURL = "/offers/" + searchString+'?tags='+encodeURI(filterTags);
        window.location.href = searchURL ;
    }
}

function clearFilters(){
	$(".couons-left-panel").find(".filter-item-div").find("input").each(function(){
		var isChecked = $(this).is(":checked");
		if(isChecked){
           $(this).prop('checked', false);
		}
	});
	var searchString = $(".auto-suggetions:visible").val();
	if (searchString && searchString.length > 0) {
		//store in local storage 
        searchString = encodeURI(searchString);
        var searchURL = "/offers/" + searchString;
        window.location.href = searchURL ;
    }
}


function toggleIcon(event){
	setTimeout(function(){
		$(".leftpanel-filter-header-link").each(function(){
			if($(this).closest(".panel").find(".list-group").hasClass("in")){
				$(this).find(".icon-span").addClass("fa-minus").removeClass("fa-plus");
			}else{
				$(this).find(".icon-span").removeClass("fa-minus").addClass("fa-plus");
			}
		});
		
	},500);
	
}

function inputFiledKeyEvent(e){
	if (e.keyCode == 13) {
		console.log('inside enter event');
        searchCoupons();
    }
}

function openFilterPopup(){
	$(".couons-left-panel").addClass("mobile-filters");
}

function closeFiltersPopup(){
	$(".couons-left-panel").removeClass("mobile-filters");
}

function searchCrawlStores(){
	var searchVal = $(".crawl-store-div input").val();
	window.location.href='./getAllStoresForRun?searchStr='+searchVal;
}