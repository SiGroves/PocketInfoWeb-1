var app = angular.module("myApp", ['ngProgress']);

app.controller("IssuesController", function($scope, $http, ngProgressFactory) {
	$scope.wipNumber='';
	$scope.selectedTool='';

	$scope.chosenList=[];
	$scope.userDetails=[];
	$scope.currentUser=[];
	$scope.toolList=[];
	$scope.issueList=[];
	$scope.newsList=[];
	$scope.productList=[];
	$scope.statList=[];
	$scope.wipList=[];
	$scope.ltpList=[];
	$scope.campaignList=[];

	$scope.chosenItem=[];
	$scope.chosenLTP=[];
	
	$scope.userLoggedIn=false;
	$scope.storageItem ='tiwApp.user'; 
	$scope.storageItemIssues ='tiwApp.issues'; 
	$scope.storageItemTools ='tiwApp.tools'; 
	$scope.storageItemNews ='tiwApp.news'; 
	$scope.storageItemProducts ='tiwApp.products'; 
	$scope.storageItemStats ='tiwApp.stats'; 
	$scope.storageItemWips ='tiwApp.wips'; 
	$scope.storageItemLtp ='tiwApp.ltp'; 
	$scope.storageItemLtp ='tiwApp.campaigns'; 

	$scope.loadingMessage=window.location.hostname;
	$scope.whileLoading=false;
	$scope.eMailAddress='';
	$scope.showBadUserName=false;
	$scope.progressbar = ngProgressFactory.createInstance();
	$scope.serverLocation = window.location.hostname;

	$scope.propertyName = 'issueType';
  	$scope.reverse = true;
	
	var serverId='https://toolsinfoweb.co.uk/';
	var mandatoryListServerId='https://toolsinfoweb.co.uk/mandatoryList/';	
	if (window.location.hostname.indexOf('host')>0 || window.location.hostname.indexOf('2.168')>0){
		serverId='http://'+ window.location.hostname +'/toolsInfoweb/';
		mandatoryListServerId='http://'+ window.location.hostname +'/mandatoryList/';
	}
	$scope.serverId=serverId;

	storedUser=JSON.parse(localStorage.getItem($scope.storageItem));
	$scope.currentUser=storedUser;
	//console.log($scope.currentUser);
	if ($scope.currentUser){
		//console.log('we have a stored user');
		$scope.userLoggedIn=true;
		$scope.loadingMessage = 'PLEASE WAIT - LOADING TOOLS LIST <img height="24px" src="../content/images/icons/working.gif"/>';
		$scope.whileLoading=false;

		$scope.issueList=JSON.parse(localStorage.getItem($scope.storageItemIssues));
		$scope.toolList=JSON.parse(localStorage.getItem($scope.storageItemTools));
		$scope.newsList=JSON.parse(localStorage.getItem($scope.storageItemNews));
		$scope.productList=JSON.parse(localStorage.getItem($scope.storageItemProducts));
		$scope.statList = JSON.parse(localStorage.getItem($scope.storageItemStats));
		$scope.wipList = JSON.parse(localStorage.getItem($scope.storageItemWips));
		$scope.ltpList = JSON.parse(localStorage.getItem($scope.storageItemLtp));
		$scope.campaignList = JSON.parse(localStorage.getItem($scope.storageItemCampaigns));
		//console.log('after retrieve',JSON.stringify($scope.wipList));
		//console.log($scope.currentUser);
	} else {
		$scope.currentUser=[];
		$scope.whileLoading=false;
	}


	$scope.validateEmail = function(eMailAddress,pin){
		$scope.loadingMessage = 'PLEASE WAIT - LOADING ';
		$scope.whileLoading=false;
		var url=serverId+'?controller=api&action=checkUserId&eMail='+eMailAddress+'&pin='+pin;
		//console.log(url);
		$scope.progressbar = ngProgressFactory.createInstance();
     	$scope.progressbar.start();
     	$scope.userLoggedIn=false;
	
		$http.get(url)
			.then(function(response) { 	  
				//console.log(response);
			  $scope.userDetails=response.data;		
			  $scope.currentUser.userId=$scope.userDetails[0].userId;
			  $scope.currentUser.userName=$scope.userDetails[0].userName;
			  $scope.currentUser.dealerId=$scope.userDetails[0].dealerId;
			  $scope.currentUser.dealerName=$scope.userDetails[0].dealerName;
			  $scope.currentUser.brand=$scope.userDetails[0].brand;
			  $scope.currentUser.role=$scope.userDetails[0].role;
			  $scope.currentUser.intId=$scope.userDetails[0].intId;

			  //console.log($scope.currentUser);
			  if ($scope.userDetails[0].userName!='Not Valid Username/Password/PIN'){
				$scope.userLoggedIn=true;
				localStorage.setItem($scope.storageItem, JSON.stringify($scope.userDetails[0]));
				//console.log('eMail validated');
				$scope.progressbar.complete();
				$scope.showBadUserName=false;

				$scope.refreshIssueList();
				$scope.refreshToolsList();
				$scope.refreshNewsList();
				$scope.refreshProductList();
				$scope.refreshStatList();
				$scope.refreshLtpList();
				$scope.refreshCampaignList();

				$scope.userLoggedIn=true;
				
			  } else {
				$scope.showBadUserName=true;
				$scope.progressbar.complete();
			  }
		});	
	}

	$scope.resetAll=function(){
		//console.log('reset everything');
		//console.log('before',$scope.currentUser);
		if($scope.issueList){$scope.issueList.length=0};
		if($scope.toolList){$scope.toolList.length=0};
		if($scope.newsList){$scope.newsList.length=0};
		if($scope.productList){$scope.productList.length=0};
		if($scope.statList){$scope.statList.length=0};
		if($scope.wipList){$scope.wipList.length=0};
		if($scope.ltpList){$scope.ltpList.length=0};
		if($scope.campaignList){$scope.campaignList.length=0};
		localStorage.removeItem($scope.storageItemIssues);
		localStorage.removeItem($scope.storageItemTools);
		localStorage.removeItem($scope.storageItemNews);
		localStorage.removeItem($scope.storageItemProducts);
		localStorage.removeItem($scope.storageItemStats);
		localStorage.removeItem($scope.storageItemWips);
		localStorage.removeItem($scope.storageItemLtp);
		localStorage.removeItem($scope.storageItemCampaigns);
		$scope.currentUser.length=0;
		localStorage.removeItem($scope.storageItem);
		//console.log('after',$scope.currentUser);
		$scope.userLoggedIn=false;
	}


	$scope.refreshIssueList = function(){
		//$scope.progressbar = ngProgressFactory.createInstance();
		//console.log('refreshIssueList');
			 
		$scope.whileLoading=false;
		
		var theUrl=serverId+'?controller=api&action=listAllIssues';
	  	//console.log(toolUrl);
	  	$scope.progressbar.start();
	  	$http({method: 'get', url: theUrl}).
	        then(function(response) {
	        	if($scope.issueList){$scope.issueList.length=0};
//	        		console.log(response.data);
		          $scope.issueList = response.data; 	
			  	  $scope.loadingMessage='';
			  	  localStorage.setItem($scope.storageItemIssues, JSON.stringify($scope.issueList));
			  	  $scope.whileLoading=true;
			  	  $scope.progressbar.complete();

			  	  //console.log('Issue List loaded');
	        }, function(response) {
	          console.error('Response error', status, data);
	          $scope.progressbar.complete();
	      });
	}

	$scope.sortBy = function(propertyName) {
	    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
	    $scope.propertyName = propertyName;
	  };


	$scope.refreshNewsList = function(){
		//console.log('refreshNewsList');
	  	$scope.progressbar.start();
		$scope.whileLoading=false;
		
		var theUrl=serverId+'?controller=api&action=listLatestNews';
	  	$http({method: 'get', url: theUrl}).
	        then(function(response) {
	        	if($scope.newsList){
					$scope.newsList.length=0;
					localStorage.removeItem($scope.storageItemNews);
				};
	              $scope.newsList = response.data; 	
			  	  $scope.loadingMessage='';
			  	  localStorage.setItem($scope.storageItemNews, JSON.stringify($scope.newsList));
			  	  $scope.whileLoading=true;
			  	  $scope.progressbar.complete();
			  	 // console.log('News List loaded');
	        }, function(response) {
	          console.error('Response error', status, data);
	          $scope.progressbar.complete();
	      });
	}

	$scope.refreshProductList = function(){
		//console.log('refreshProductList');
	  	$scope.progressbar.start();
		$scope.whileLoading=false;
		
		var theUrl=serverId+'?controller=api&action=listLatestProducts';
		//console.log(theUrl);
	  	$http({method: 'get', url: theUrl}).
	        then(function(response) {
	        	if($scope.productList){
					$scope.productList.length=0;
					localStorage.removeItem($scope.storageItemProducts);
				};
	        		//console.log(response.data);
	              $scope.productList = response.data; 	
			  	  $scope.loadingMessage='';
			  	  localStorage.setItem($scope.storageItemProducts, JSON.stringify($scope.productList));
			  	  $scope.whileLoading=true;
			  	  $scope.progressbar.complete();
			  	  //console.log('Product List loaded');
			  	  //console.log($scope.productList);
	        }, function(response) {
	          console.error('Response error', status, data);
	          $scope.progressbar.complete();
	      });
	}

	$scope.cleanDisplay = function(txt){
		if (txt){
			txt=txt.replace("\u0150"," - ");
			txt=txt.replace("\u0174","");
			txt=txt.replace("\u0147","'");
			txt=txt.replace("\u0148","'");
			txt=txt.replace("\u0146","'");
		}
		

		return txt;
	}

	$scope.setChosenItem = function(thisItem){
		//console.log(thisItem);
		$scope.chosenItem=thisItem;
	}
	$scope.setChosenLtp = function(thisItem){
		//console.log(thisItem);
		$scope.chosenLtp=thisItem;
	}
	$scope.yesOrNo = function(YorN){
		var checkSet = YorN='Y'?'check':'delete';
		retValue="<span class='ui-btn ui-shadow ui-corner-all ui-icon-"+ checkSet +" ui-btn-icon-notext'></span>";
		return retValue;
	}


	$scope.refreshStatList = function(){
		//console.log('refreshStatList');
	  	$scope.progressbar.start();
		$scope.whileLoading=false;
		
		var thisDealer=$scope.currentUser.dealerId
		var theUrl=serverId+'?controller=api&action=getMyKeyStats&dealerNumber='+thisDealer;
		//console.log(theUrl);
	  	$http({method: 'get', url: theUrl}).
	        then(function(response) {
	        	if($scope.statList){
					$scope.statList.length=0;
					localStorage.removeItem($scope.storageItemStats);
				};
	        		//console.log(response.data);
	              $scope.statList = response.data; 	
			  	  $scope.loadingMessage='';
			  	  localStorage.setItem($scope.storageItemStats, JSON.stringify($scope.statList));
			  	  $scope.whileLoading=true;
			  	  $scope.progressbar.complete();
			  	  //console.log('Stat List loaded');
			  	  //console.log($scope.statList);
			  	  $scope.refreshWipList();
	        }, function(response) {
	          console.error('Response error', status, data);
	          $scope.progressbar.complete();
	      });
	}


	$scope.refreshCampaignList = function(){
		//console.log('refreshStatList');
	  	$scope.progressbar.start();
		$scope.whileLoading=false;
		
		var thisDealer=$scope.currentUser.dealerId
		var theUrl=serverId+'?controller=api&action=listServiceMeasures';
		//console.log(theUrl);
	  	$http({method: 'get', url: theUrl}).
	        then(function(response) {
	        	console.log(response);
	        	if($scope.campaignList){
					$scope.campaignList.length=0;
					localStorage.removeItem($scope.storageItemCampaigns);
				};
	        		//console.log(response.data);
	              $scope.campaignList = response.data; 	
			  	  $scope.loadingMessage='';
			  	  localStorage.setItem($scope.storageItemCampaigns, JSON.stringify($scope.campaignList));
			  	  $scope.whileLoading=true;
			  	  $scope.progressbar.complete();
			  	  //console.log('Stat List loaded');
			  	  //console.log($scope.statList);
			  	  
	        }, function(response) {
	          console.error('Response error', status, data);
	          $scope.progressbar.complete();
	      });
	}

	$scope.handleActionSteps = function(actionSteps){
		var retValue;
		retValue="";
		if (actionSteps.length>0) {
			if(actionSteps.substring(0, 1)=='Y'){retValue+='Confirm Completed, '};
			if(actionSteps.substring(1, 2)=='Y'){retValue+='Pop Up Actions, '};
			if(actionSteps.substring(3, 4)=='Y'){retValue+='Spares Orderered, '};
			if(actionSteps.substring(4, 5)=='Y'){retValue+='Parts Returned, '};
			if(actionSteps.substring(5, 6)=='Y'){retValue+='Serial Number Required, '};
			if(actionSteps.substring(6, 7)=='Y'){retValue+='Purchase Date Requested, '};
			if(actionSteps.substring(7, 8)=='Y'){retValue+='Invoice Date Requested, '};
			//retValue=retValue & iif(mid(actionSteps,1,1)="Y","Confirm<br/>","")
		    //  retValue=retValue & iif(mid(actionSteps,2,1)="Y","Pop Up<br/>","")
		     // retValue=retValue & iif(mid(actionSteps,3,1)="Y","Spares Ordered<br/>","")
		      //retValue=retValue & iif(mid(actionSteps,4,1)="Y","Return<br/>","")
		      //retValue=retValue & iif(mid(actionSteps,5,1)="Y","Serial Number<br/>","")
		      //retValue=retValue & iif(mid(actionSteps,6,1)="Y","Purchase Date<br/>","")
		      //retValue=retValue & iif(mid(actionSteps,7,1)="Y","Invoice Date<br/>","")
		}      
      
    	return retValue.substring(0,retValue.length-2);
	}


	$scope.refreshToolsList = function(){
		//console.log('refreshToollist');	 
		$scope.progressbar.start();
	  	$scope.whileLoading=false;
		
		/*var mandatoryListServerId='https://toolsinfoweb.co.uk/mandatoryList/';
		if (window.location.hostname.indexOf('host')>0 || window.location.hostname.indexOf('2.168')>0){
			mandatoryListServerId='http://'+ window.location.hostname +'/mandatoryList/';
		};*/
		var toolUrl=mandatoryListServerId+'?controller=api&action=listAllTools&dealerId=' + $scope.currentUser.dealerId;
		//console.log(toolUrl);
	  	$http({method: 'get', url: toolUrl}).
	        then(function(response) {
	        	if ($scope.toolList){
						$scope.toolList.length=0;
						localStorage.removeItem($scope.storageItemTools);
					}
		          $scope.toolList = response.data; 	
			  	  $scope.loadingMessage='';
			  	  localStorage.setItem($scope.storageItemTools, JSON.stringify($scope.toolList));
			  	  $scope.whileLoading=true;
			  	  $scope.progressbar.complete();

			  	  //console.log('Tools List loaded');
	        }, function(response) {
	          console.error('Response error', status, data);
	          $scope.progressbar.complete();
	      });
	}

	if ($scope.currentUser){
		//console.log($scope.currentUser.dealerId, typeof $scope.currentUser.dealerId);
		if (typeof $scope.currentUser.dealerId!='undefined'){
		//	console.log('going to refresh stats');
			$scope.refreshStatList();
		//	console.log('after refresh stats');
		}
	}


	$scope.refreshLtpList = function(){
		$scope.progressbar.start();
	  	$scope.whileLoading=false;
		
		
		var toolUrl=serverId+'?controller=api&action=listLtpItems';
		$http({method: 'get', url: toolUrl}).
	        then(function(response) {
	        	//console.log(response);
	        	if ($scope.ltpList){
						$scope.ltpList.length=0;
						localStorage.removeItem($scope.storageItemLtp);
					}
		          $scope.ltpList = response.data; 	
			  	  $scope.loadingMessage='';
			  	  localStorage.setItem($scope.storageItemLtp, JSON.stringify($scope.ltpList));
			  	  $scope.whileLoading=true;
			  	  $scope.progressbar.complete();

			  	  //console.log('LTP List loaded');
			  	  //console.log($scope.ltpList);
	        }, function(response) {
	          console.error('Response error', status, data);
	          $scope.progressbar.complete();
	      });
	}



	$scope.refreshWipList = function(){
		//console.log('refreshWipList');
	  	$scope.progressbar.start();
		$scope.whileLoading=false;
		/*var mandatoryListServerId='https://toolsinfoweb.co.uk/mandatoryList/';
		if (window.location.hostname.indexOf('host')>0 || window.location.hostname.indexOf('2.168')>0){
			mandatoryListServerId='http://'+ window.location.hostname +'/mandatoryList/';
		};
		*/
		
		var thisUserId=$scope.currentUser.intId;
		var thisDealerId=$scope.currentUser.dealerId;

		var theUrl=mandatoryListServerId+'?controller=api&action=getWIPsForUserIntId&intId='+thisUserId+'&dealerId='+thisDealerId;
		//console.log(theUrl);
		
	  	$http({method: 'get', url: theUrl}).
	        then(function(response) {
	        	if($scope.wipList){
					$scope.wipList.length=0;
					localStorage.setItem($scope.storageItemWips, JSON.stringify($scope.wipList));
					localStorage.removeItem($scope.storageItemWips);
				};
	        	  //console.log(response.data);
	              $scope.wipList = response.data; 	
	              if ($scope.wipList[0].id==0){
	              	$scope.wipList.length=0;
	              }
			  	  $scope.loadingMessage='';
			  	  localStorage.setItem($scope.storageItemWips, JSON.stringify($scope.wipList));
			  	  $scope.whileLoading=true;
			  	  $scope.progressbar.complete();
			  	  //console.log('Stat List loaded');
			  	  //console.log($scope.wipList);
	        }, function(response) {
	          console.error('Response error', status, data);
	          $scope.progressbar.complete();
	      }); 
	      $scope.progressbar.complete();
	}



	
	$scope.removeWIP = function(wip){
		//console.log('removeWIP', wip);
		$scope.wipList.splice($scope.wipList.indexOf(wip), 1);
		//localStorage.setItem($scope.storageItemWips, JSON.stringify($scope.wipList)); 
		$scope.deleteThisWipFromServer(wip);	
	}

	


	$scope.storeThisWip = function (){
		//var newWip=[];
		//console.log($scope.wipNumber);
		//console.log($scope.chosenList);
		//console.log($scope.toolList);
		//alert('this option is not yet active');
		//console.log ("wipList before",typeof $scope.wipList,$scope.wipList);
		var tNow=new Date();
		
		var thisWip={"wipNumber":$scope.wipNumber,
					  "createdBy":$scope.currentUser.userName,
					  "createdDate":tNow,
					  "userIntId": $scope.currentUser.intId,
					  "tools":$scope.chosenList};
		//console.log("thisWip",typeof thisWip, thisWip);
		//console.log('call',$scope.safeToAddWIP($scope.wipList,$scope.wipNumber));
		if ($scope.safeToAddWIP($scope.wipList,$scope.wipNumber)==true){
			if ($scope.wipList){
				$scope.wipList.push(thisWip);
			} else {
				$scope.wipList=[];
				$scope.wipList.push(thisWip);
			}
		}
		
		localStorage.setItem($scope.storageItemWips, JSON.stringify($scope.wipList));

		$scope.postThisWipToServer(thisWip);
		//
		//console.log("wipList after",$scope.wipList);
		//console.log(JSON.stringify($scope.wipList));
		$scope.clearThisWip();
	}

	$scope.safeToAddWIP = function(listOfWips,thisWIP){
		var retValue=true;
		//console.log('in function',_.findIndex(listOfWips,{wipNumber:thisWIP}));
		//console.log('seek',$scope.wipNumber);
		//console.log('thisWip',thisWIP);
		//console.log('in',listOfWips);
		var x=_.findIndex(listOfWips,{wipNumber:thisWIP});
		//console.log(x);
		if (x>=0){retValue=false};
		return retValue;
	}	

	$scope.postThisWipToServer = function(thisWip){
		//console.log('postToServer',thisWip);
		//console.log("[" + JSON.stringify(thisWip) +"]");
		wipToSend="[" + JSON.stringify(thisWip) +"]";

		/*var mandatoryListServerId='https://toolsinfoweb.co.uk/mandatoryList/';
		if (window.location.hostname.indexOf('host')>0 || window.location.hostname.indexOf('2.168')>0){
			mandatoryListServerId='http://'+ window.location.hostname +'/mandatoryList/';
		};*/
		var toolUrl=mandatoryListServerId+'?controller=api&action=acceptWIPpostJSON';
		//console.log(toolUrl);
	  	$http({method: 'post', 
	  		   url: toolUrl,
	  		   data: wipToSend}).
	        then(function(response) {
	        		console.log(response.data);
		          //$scope.toolList = response.data; 	
			  	  //$scope.loadingMessage='';
			  	  //localStorage.setItem($scope.storageItemTools, JSON.stringify($scope.toolList));
			  	  $scope.whileLoading=true;
			  	  $scope.progressbar.complete();

			  	  //console.log('Tools List loaded');
	        }, function(response) {
	          console.error('Response error', status, data);
	          $scope.progressbar.complete();
	      });
	};


	$scope.deleteThisWipFromServer = function(thisWip){
		//console.log('postToServer',thisWip);
		//console.log("[" + JSON.stringify(thisWip) +"]");
		wipToSend="[" + JSON.stringify(thisWip) +"]";
		
		/*var mandatoryListServerId='https://toolsinfoweb.co.uk/mandatoryList/';
		if (window.location.hostname.indexOf('host')>0 || window.location.hostname.indexOf('2.168')>0){
			mandatoryListServerId='http://'+ window.location.hostname +'/mandatoryList/';
		};*/
		var toolUrl=mandatoryListServerId+'?controller=api&action=appDeleteWIP&dealerId='+$scope.currentUser.dealerId;
		//console.log(toolUrl);
		var sendData={id:thisWip.id, wipNumber:thisWip.wipNumber, contact_id:thisWip.userIntId};
		var sendData="id=" + thisWip.id + "&wipNumber=" + thisWip.wipNumber + "&contact_id=" +thisWip.userIntId+""
		//console.log(sendData);
	  	$http({method: 'post', 
	  		   url: toolUrl,
	  		   data: sendData,
	  		   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	  		  }).
	        then(function(response) {
	        	console.log(response.data);
		          //$scope.toolList = response.data; 	
			  	  //$scope.loadingMessage='';
			  	  //localStorage.setItem($scope.storageItemTools, JSON.stringify($scope.toolList));
			  	  $scope.whileLoading=true;
			  	  $scope.progressbar.complete();

			  	  //console.log('Tools List loaded');
	        }, function(response) {
	          console.error('Response error', status, data);
	          $scope.progressbar.complete();
	      });
	};



	$scope.cname = function(string) {
		$scope.hidethis = false;
		var output = [];
		angular.forEach($scope.countryList, function(country) {
			if (country.toLowerCase().indexOf(string.toLowerCase()) >= 0) {
				output.push(country);
			}
		});
		$scope.filterCountry = output;
	};
	
	$scope.fillInputBox = function(string) {
		$scope.country = string;
		$scope.hidethis = true;
	};
	
	$scope.tname = function(string) {
		if (string){
			$scope.hideToolMatch = false;
			var output = [];
			//console.log('seeking',string);
			//console.log('in',$scope.toolList);
			//angular.forEach($scope.toolList, function(tool) {
				angular.forEach(_.sortBy($scope.toolList, 'partNumber'), function(tool) {
				//console.log(tool.toolDescription);
				
				if (tool.partDescription.toLowerCase().indexOf(string.toLowerCase()) >= 0 
					|| tool.toolNumber.toLowerCase().indexOf(string.toLowerCase()) >= 0
					|| tool.partNumber.toLowerCase().indexOf(string.toLowerCase()) >= 0) {
					output.push(tool);
					//console.log('Match',tool)
				}
			});
			$scope.filterTool = output;
		}
	};
	$scope.fillSelInputBox = function(obj) {
		$scope.tool = obj.partNumber + ' (' +obj.toolNumber + ') ' + obj.partDescription;

		$scope.chosenList.push(obj);
		$scope.chosenList=$scope.chosenList.unique();
		
		$scope.selectedTool=$scope.tool;
		$scope.tool='';
		$scope.hideToolMatch = true;
	};
	
	$scope.removeTool = function(thisTool){
		$scope.chosenList.splice($scope.chosenList.indexOf(thisTool), 1); 
	}
	
	$scope.clearThisWip=function(){
		$scope.chosenList=[];	
		$scope.wipNumber='';
	}
	
	$scope.stripForImage=function(toolNumber){
		return toolNumber.replace(/[^a-z0-9+]+/gi, '');
	}
	$scope.imageName = function(toolType,partNumber,toolNumber){
		var retValue='';
		
		if (toolType.toLowerCase()=='tool'){
			retValue=$scope.stripForImage(partNumber);
		} else {
			retValue=$scope.stripForImage(toolNumber);
		}
		//console.log(toolType,toolType.toLowerCase(), partNumber, toolNumber, retValue);
		//console.log(retValue);
		return retValue;
	}

	$scope.contentLink = function (linkTo){
		var retValue = linkTo;
		if (linkTo){
			if (linkTo.indexOf('http')>=0){
				retValue=linkTo;
			} else {
				retValue=serverId + linkTo;
			}
			//console.log(linkTo,retValue);	
		}
		
		return retValue;
	}

	$scope.handleDate = function(thisDate){
		return moment(thisDate,'YYYY-MM-DD').format('DD MMMM YYYY');
	}
	
});


app.directive('animateOnChange', function($timeout) {
  return function(scope, element, attr) {
    scope.$watch(attr.animateOnChange, function(nv,ov) {
    	//console.log('animate on change triggered');
      if (nv!=ov) {
        element.addClass('changed');
        $timeout(function() {
          element.removeClass('changed');
        }, 2000); // Could be enhanced to take duration as a parameter
      }
    });
  };
});

app.filter('html',function($sce){
    return function(input){
        return $sce.trustAsHtml(input);
    }
})

Array.prototype.unique = function() {
    return this.reduce(function(accum, current) {
        if (accum.indexOf(current) < 0) {
            accum.push(current);
        }
        return accum;
    }, []);
}