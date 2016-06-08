'use strict';

/**
 * The root conferenceApp module.
 *
 * @type {conferenceApp|*|{}}
 */
var conferenceApp = conferenceApp || {};

/**
 * @ngdoc module
 * @name conferenceControllers
 *
 * @description
 * Angular module for controllers.
 *
 */
conferenceApp.controllers = angular.module('conferenceControllers', ['ui.bootstrap']);



/**
 * @ngdoc controller
 * @name RootCtrl
 *
 * @description
 * The root controller having a scope of the body element and methods used in the application wide
 * such as user authentications.
 *
 */
conferenceApp.controllers.controller('RootCtrl', function ($scope, $rootScope, $location, oauth2Provider) {


});

conferenceApp.controllers.controller('scoreboardCtrl', function ($location, $rootScope, $scope, $log, oauth2Provider, HTTP_ERRORS) {
    $rootScope.$on("Scoreboard",  function() {
      loaded();
    });

    $scope.init = function () { 
          gapi.client.load('campusConnectApis', 'v1',loaded, 'https://campus-connect-2015.appspot.com/_ah/api');
    };

    function loaded() {
      var maps2 = {};
      
      maps2["1"]="2015";
      maps2["2"]="2014";
      maps2["3"]="2013";
      maps2["4"]="2012";
      maps2["5"]="PGs and Interns";
      maps2["6"]="AHS";
     // console.log("init called");
      gapi.client.campusConnectApis.kmcScoreQuery().
                  execute(function (resp) {
                      $scope.$apply(function() {
                          if (resp.error) {
                              // The request has failed.
                             // alert("error");
                              //console.log("error");
                          } 
                          else {
                              // The request has succeeded.
                            //  alert("success");
                              //console.log(resp);
                              $scope.teams = [];
                              $scope.fields = [];
                            //  //console.log(resp.collegeList.length);
                              for(var j=1;j<=6;j++)
                              {
                                for(var i = 0 ; i < resp.items.length; i++)
                                {
                                    //console.log(resp.items[i]);
                                    //console.log(maps[resp.items[i].batch]);    
                                    if(resp.items[i].batch == j)
                                      $scope.teams.push({"batch":maps2[resp.items[i].batch],"score":resp.items[i].score});
                                }
                              }
                          }
                      });
                  });
  }
    $scope.send = function() {
      var maps = {};
      maps["2015"]="1";
      maps["2014"]="2";
      maps["2013"]="3";
      maps["2012"]="4";
      maps["PGs and Interns"]="5";
      maps["AHS"]="6";
      //  console.log($scope.fields);
        var scores = [];
        for(var i = 0; i < $scope.fields.length ; i++)
        {
          if($scope.fields[i])
            scores.push({"batch":maps[$scope.teams[i].batch] , "score":$scope.fields[i]});
          else
            scores.push({"batch":maps[$scope.teams[i].batch] , "score":$scope.teams[i].scores});
        }
      // console.log(scores);
        gapi.client.campusConnectApis.kmcScoreUpdate({"items":scores}).execute(function(resp) {
                     //  //console.log(resp.result.list.length);
                     if (resp.error) {
                      //console.log("error");
                    } 
                    else
                    {
                    //  console.log("success");
                      $rootScope.$emit("Scoreboard",{});
                    }
            });
    }
});
/**
 * @ngdoc controller
 * @name OAuth2LoginModalCtrl
 *
 * @description
 * The controller for the modal dialog that is shown when an user needs to login to achive some functions.
 *
 */
conferenceApp.controllers.controller('OAuth2LoginModalCtrl',
    function ($scope, $modalInstance, $rootScope, oauth2Provider) {
        $scope.singInViaModal = function () {
            oauth2Provider.signIn(function () {
                gapi.client.oauth2.userinfo.get().execute(function (resp) {
                    $scope.$root.$apply(function () {
                        oauth2Provider.signedIn = true;
                        $scope.$root.alertStatus = 'success';
                        $scope.$root.rootMessages = 'Logged in with ' + resp.email;
                    });

                    $modalInstance.close();
                });
            });
        };
    });

/**
 * @ngdoc controller
 * @name DatepickerCtrl
 *
 * @description
 * A controller that holds properties for a datepicker.
 */
conferenceApp.controllers.controller('DatepickerCtrl', function ($scope) {
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];
});


conferenceApp.controllers.controller('GetCollegeCtrl', function ($rootScope, $scope, $log, oauth2Provider, HTTP_ERRORS,getCollegeShared) {
    $rootScope.$on("SignedIn", function(){
          //console.log("because");
           $scope.init();
        });
    $scope.init = function () { 
          gapi.client.load('campusConnectApis', 'v1',loaded, 'https://campus-connect-2015.appspot.com/_ah/api');
          gapi.client.load('clubs', 'v1',loaded, 'https://campus-connect-2015.appspot.com/_ah/api');
    };

    function loaded() {
          //console.log("heer");
          /*if(oauth2Provider.signedIn == false)
          {
              //console.log("Not signed in");
              $scope.signedIn = 0;
          }
          else
          {*/
            $scope.signedIn = 1;
            gapi.client.campusConnectApis.getColleges().
                  execute(function (resp) {
                      $scope.$apply(function() {
                          if (resp.error) {
                              // The request has failed.
                             // alert("error");
                              //console.log("error");
                          } 
                          else {
                              // The request has succeeded.
                            //  alert("success");
                       //       console.log(resp);
                              $scope.colleges = [];
                            //  //console.log(resp.collegeList.length);
                              for(var i = 0 ; i < resp.collegeList.length; i++)
                              {
                                  //console.log(resp.collegeList[i]);
                                  $scope.colleges.push(resp.collegeList[i]);
                              }
                          }
                      });
                  });
        };

    $scope.setCollegeDetails = function(collegeid,collegename) {
        getCollegeShared.setCollegeid(collegeid);
        getCollegeShared.setCollegename(collegename);
    };
});


conferenceApp.controllers.controller('CollegeCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS,getCollegeShared,$timeout,$location) {
    $scope.init = function () { 
          gapi.client.load('campusConnectApis', 'v1',loaded, 'https://campus-connect-2015.appspot.com/_ah/api');
          gapi.client.load('clubs', 'v1',loaded, 'https://campus-connect-2015.appspot.com/_ah/api');
    };

    function loaded() {
           var col_id = getCollegeShared.getCollegeid();
           var col_name = getCollegeShared.getCollegename();
           $timeout(function() {
            $scope.collegeName = col_name;
           //console.log($scope.collegeName);
           });
         //  console.log(col_id);
           gapi.client.campusConnectApis.clubCount({'collegeId':col_id}).execute(function(resp) {
                     //  //console.log(resp.result.list.length);
                     $scope.$apply(function() {
                     //console.log("success");
                       //console.log(resp);
                        $scope.no_of_groups = resp.count;
                      });
            });
           var now_date = getDate();
          // console.log(now_date);
           gapi.client.campusConnectApis.eventCount({'collegeId':col_id,'date':now_date}).execute(function(resp){
              //console.log(resp);
              var flag;
              flag = resp.count;              
              $timeout(function() {
                $scope.no_of_events = flag;
            });
            });
            /*gapi.client.clubs.collegeFeed({'collegeId':col_id,'date':now_date}).execute(function(resp){
                $scope.$apply(function() {
              //console.log('Calendar Success');
              console.log(resp);
              var flag;
              if (!resp.items || resp.items.length === undefined)
              {
               flag = 0;
              }
              else
              {
                 flag = resp.items.length;
              }
                $scope.no_of_events = flag;
             });
            });*/
           function getDate()
           {
             var today = new Date();
             var dd = today.getDate();
             if(dd<10)
                dd='0'+dd;
             var mm = today.getMonth()+1; //January is 0!
             if(mm<10)
                mm='0'+mm;
             var yyyy = today.getFullYear();
           today = yyyy+'-'+mm+'-'+dd;
           //final_date = '"'+today+'"';
           //console.log(today);
           return today;
           }
        };
        $scope.go = function (hash) {
        var path = $location.path();
        //console.log(path);
        $location.path(path+hash);
        }
});
conferenceApp.controllers.controller('CalendarCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS,getCollegeShared,getGroupShared,$timeout,$location) {
    $scope.init = function () {
           
           var col_name = getCollegeShared.getCollegename();
           $timeout(function() {
            $scope.collegeName = col_name;
            $scope.myDate = new Date();
            //console.log($scope.collegeName);
           });
            var d = new Date();
            var month = new Array();
            month[0] = "Jan";
            month[1] = "Feb";
            month[2] = "Mar";
            month[3] = "Apr";
            month[4] = "May";
            month[5] = "Jun";
            month[6] = "Jul";
            month[7] = "Aug";
            month[8] = "Sep";
            month[9] = "Oct";
            month[10] = "Nov";
            month[11] = "Dec";
        };
            $scope.gettodayevents = function() {
                //console.log($scope.myDate.toLocaleDateString());
                //console.log(typeof($scope.myDate));
                
                var today=$scope.myDate.toLocaleDateString();
                var datearr = today.split('/');
                today = datearr[2]+'-';
                if(datearr[0]<10)
                    today+='0'+datearr[0];
                else
                    today+=datearr[0];
                today+='-';
                if(datearr[1]<10)
                    today+='0'+datearr[1];
                else
                    today+=datearr[1];
              var col_id = getCollegeShared.getCollegeid();
              //console.log(today);
              //console.log(col_id);
              gapi.client.clubs.getEvents({'collegeId':col_id,'date':today}).execute(function(resp) {
                  var result="";    
                $scope.$apply(function() {
                $scope.events = [];
                 if(resp.result.items==undefined)
                 {
                  //console.log('Entering 1');
                 }
                 else
                 {
                  //console.log('Entering 2');
                    //console.log(resp.result.items[0]);
                 for(var i in resp.result.items)
                 {
                      var resu = resp.result.items[i].start_time;
                      var res = resu.split(":",2);
                      var suffix_;
                      var hours_ = (parseInt(res[0]))%24;
                      var mins_ = (parseInt(res[1]))%60;
                      if(mins_<10)
                      {
                        mins_ = '0'+mins_;
                      }
                      if(hours_>11)
                      {
                        suffix_ = "PM";

                      }
                      else
                      {
                        suffix_ = "AM";
                      }
                      hours_ = hours_%12;
                      if(hours_==0)
                      {
                        hours_=12;
                      }
                      var start_final = hours_+':'+mins_+' '+suffix_;
                      //console.log(start_final);
                      var resu1 = resp.result.items[i].end_time;
                      var res1 = resu1.split(":",2);
                      hours_ = (parseInt(res1[0]))%24;
                      mins_ = (parseInt(res1[1]))%60;
                      if(mins_<10)
                      {
                        mins_ = '0'+mins_;
                      }
                      if(hours_>11)
                      {
                        suffix_ = "PM";

                      }
                      else
                      {
                        suffix_ = "AM";
                      }
                      hours_ = hours_%12;
                      if(hours_==0)
                      {
                        hours_=12;
                      }
                      var end_final = hours_+':'+mins_+' '+suffix_;
                      //console.log(end_final);
                      var coll_id = resp.result.items[i].collegeId.split(/[ )]+/)[1];
                      var club_id = resp.result.items[i].club_id.split(/[ )]+/)[1];
                      var eve_id = resp.result.items[i].eventId;

                      getGroupShared.setGroupid(club_id);
                      getGroupShared.setGroupname(resp.result.items[i].club_name);
                      //console.log("Hello");

                      var club_img = resp.result.items[i].clubphotoUrl;
                      $scope.events.push({'eve_id':eve_id,'club_img':club_img, 'title':resp.result.items[i].title, 'club_name':resp.result.items[i].club_name, 'start_final':start_final, 'end_final': end_final,'venue':resp.result.items[i].venue});
                    }
                }
                
                });

                  });
            };
        $scope.go = function (hash) {
            var path = $location.path();
            $location.path(path+hash);
            //console.log($location.path());
    }
});


conferenceApp.controllers.controller('GroupsCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS,getCollegeShared,getGroupShared,$timeout,$location) {
    $scope.init = function () {
           var col_id = getCollegeShared.getCollegeid();
           var col_name = getCollegeShared.getCollegename();
           $timeout(function() {
            $scope.collegeName = col_name;
           //console.log($scope.collegeName);
           });
           //console.log(col_id);
           //console.time("haha");
           gapi.client.campusConnectApis.getClubList({'collegeId':col_id}).execute(function(resp) {
            $scope.$apply(function() {
                        if (resp.error) {
                            // The request has failed.
                           // alert("error");
                            //console.log("error");
                        } 
                        else {
                            //console.log("success");
                            //console.log(resp.result.list.length);
                            $scope.groups = [];
                            //console.log(resp.result.list[1]);

                           for(var i = 0 ; i < resp.result.list.length; i++)
                            {
                                    $scope.groups.push(resp.result.list[i]);
                            }
                            //console.timeEnd("haha");
                        }
                    });
                });
        }
    $scope.go = function (hash) {
        var path = $location.path();
        $location.path(path+hash);
        //console.log($location.path());
    }
    $scope.setGroupDetails = function(groupid,groupname) {
        getGroupShared.setGroupid(groupid);
        getGroupShared.setGroupname(groupname);
    };
});

conferenceApp.controllers.controller('GroupNameCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS,$routeParams,getGroupShared,getCollegeShared,$timeout,$location) {
    $scope.init = function () {
           var col_id = getCollegeShared.getCollegeid();
           var col_name = getCollegeShared.getCollegename();
           var club_name = getGroupShared.getGroupname();
           var club_id = getGroupShared.getGroupid();
           $timeout(function() {
            $scope.collegeName = col_name;
            //console.log("hahahaha "+$scope.collegeName);
            $scope.clubName = club_name;
            //console.log("hahahaha "+$scope.clubName);
           });
           //console.log(col_id);
           gapi.client.clubs.getClub({'club_id':club_id}).execute(function(resp1) {
            $scope.$apply(function() {
                  $scope.img_src = resp1.photoUrl;       
             });
            });
           //console.time("hahaha");
           gapi.client.clubs.collegeFeed({'collegeId':col_id,'clubId':club_id}).execute(function(resp) {
             $scope.$apply(function() {
                //console.timeEnd("hahaha");
                $scope.types = [];
                $scope.events = [];
                var type;
                //console.log(resp.items);
                for(var i in resp.items) {
                    var type_of_list;
                    if(typeof(resp.items[i].start_date) !=='undefined')
                      {
                        type_of_list=1; //Event Post
                      }
                      else
                      {
                        type_of_list=0; //News Post
                      }
                      var type_of;
                      var temp;
                      var another_type;
                      ////console.log(resp.result.items[i].hasOwnProperty(start_date));
                      if(typeof(resp.items[i].start_date) !=='undefined')
                      {
                        var yr = resp.result.items[i].start_date.split('-')[0];
                        var mn = resp.result.items[i].start_date.split('-')[1];
                        var da = resp.result.items[i].start_date.split('-')[2];
                        type_of = 'Start Date : '+da+'-'+mn+'-'+yr;
                        yr = resp.result.items[i].start_time.split(':')[0];
                        mn = resp.result.items[i].start_time.split(':')[1];
                        da = resp.result.items[i].start_time.split(':')[2];
                        var ampm = ''
                        if(yr>=0&&yr<=11)
                        {
                          ampm = 'AM'
                          if(yr==0)
                          {
                            yr=12
                          }
                        }
                        else
                        {
                          ampm = 'PM'
                          if(yr>12)
                          {
                            yr = yr-12;
                          }
                        }
                        another_type = 'Start Time : '+yr+':'+mn+' '+ampm;
                      }
                      else
                      {
                        type_of = 'News Post';
                        var rsp_str = '"'+resp.result.items[i].timestamp+'"';
                        //console.log(rsp_str);
                        var splitStr = resp.result.items[i].timestamp;
                        splitStr = splitStr.split(/[- :]/);
                        //console.log(splitStr);
                        var finall = splitStr[0]+'-'+splitStr[1]+'-'+splitStr[2];
                        //temp = splitStr;
                        another_type = 'Posted on '+finall;
                      }
                      $scope.events.push(resp.items[i]);
                      $scope.types.push({'type_of':type_of, 'type_of_list':type_of_list, 'another_type':another_type});
                      //console.log(resp.items[i]);
               }
              });
            });
        }
    $scope.go = function (hash) {
        var path = $location.path();
        $location.path(path+hash);
        //console.log($location.path());
    }
});

conferenceApp.controllers.controller('NewsCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS,$routeParams,getGroupShared,getCollegeShared,$timeout,$location) {
    $scope.init = function () {
          gapi.client.load('campusConnectApis', 'v1',loaded, 'https://campus-connect-2015.appspot.com/_ah/api');
        };
      function loaded()
      {
           /*var col_id = getCollegeShared.getCollegeid();
           var col_name = getCollegeShared.getCollegename();
           var club_name = getGroupShared.getGroupname();
           var club_id = getGroupShared.getGroupid();*/
           var col_name = $routeParams.abbr;
           var club_name = $routeParams.groupabbr;
           var post_id = $routeParams.eventid;
           
           gapi.client.campusConnectApis.getPosts({'postId':post_id, 'pid':'4518670936047616'}).execute(function(resp) {
            $scope.$apply(function() {
                var club_img;
             //   console.log(resp);
                 for(var i in resp.items)
                 {
                    if(resp.items[i].photoUrl!=='None')
                    {
                      //console.log("Here there");
                      $scope.img_src = resp.items[i].photoUrl;
                      //console.log(resp.items[i].photoUrl);
                      //console.log("Done");
                    }
                    else
                    {
                      $scope.img_src = 'img/event.jpg';
                    }

                    $scope.collegeName = "";
                    $scope.clubName = resp.items[i].clubName;
                    $scope.clubimg = resp.items[i].clubphotoUrl;     
                    $scope.title_post = resp.items[i].title;
                    $scope.desc = resp.items[i].description;
                }
             });              
            });
        } 
        $scope.go = function (hash) {
            var path = $location.path();
            $location.path(path+hash);
            //console.log($location.path());
        }
});

conferenceApp.controllers.controller('EventsCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS,$routeParams,getGroupShared,getCollegeShared,$timeout,$location) {
    $scope.init = function () {
       gapi.client.load('campusConnectApis', 'v1',loaded, 'https://campus-connect-2015.appspot.com/_ah/api');
        };
        function loaded()
        {
           /*var col_id = getCollegeShared.getCollegeid();
           var col_name = getCollegeShared.getCollegename();
           var club_name = getGroupShared.getGroupname();
           var club_id = getGroupShared.getGroupid();*/
           var col_name = $routeParams.abbr;
           var club_name = $routeParams.groupabbr;
           var post_id = $routeParams.eventid;
           
           gapi.client.campusConnectApis.getEvents({'postId':post_id, 'pid':'4518670936047616'}).execute(function(resp) {
            $scope.$apply(function() {
                var club_img;
               // console.log(resp);
                 for(var i in resp.items)
                 {
                    if(resp.items[i].photoUrl!=='None')
                    {
                      //console.log("Here there");
                      $scope.img_src = resp.items[i].photoUrl;
                      //console.log(resp.items[i].photoUrl);
                      //console.log("Done");
                    }
                    else
                    {
                      $scope.img_src = 'img/event.jpg';
                    }

                    $scope.collegeName = "";
                    $scope.clubName = resp.items[i].clubName;
                    $scope.clubimg = resp.items[i].clubphotoUrl; 
                    $scope.title_post = resp.items[i].title;
                    $scope.desc = resp.items[i].description;
                    var date1 = new Date(resp.result.items[i].startDate);
                    var test_flag = date1.getDate();
                    //console.log("Done for now");
                    var day1 = whatdayisit(date1.getDay());
                    var flag;
                    var today1 = date1.getDate();
                    switch (today1){
                      case 2:
                      flag = 'nd';
                      break;
                      case 3:
                      flag = 'rd';
                      break;
                      default:
                      flag = 'th';
                      break;
                    }
                    var month = new Array();
                    month[0] = "January";
                    month[1] = "February";
                    month[2] = "March";
                    month[3] = "April";
                    month[4] = "May";
                    month[5] = "June";
                    month[6] = "July";
                    month[7] = "August";
                    month[8] = "September";
                    month[9] = "October";
                    month[10] = "November";
                    month[11] = "December";
                    var n = month[date1.getMonth()];
                    var final_date = day1+', '+today1+flag+' '+n;
                    var resu = resp.result.items[i].startTime;
                  var res = resu.split(":",2);
                  var suffix_;
                  var hours_ = (parseInt(res[0]))%24;
                  var cal_hr = hours_;
                  var mins_ = (parseInt(res[1]))%60;
                  
                  if(mins_<10)
                  {
                    mins_ = '0'+mins_;
                  }
                  var cal_mn = mins_;
                  if(hours_>11)
                  {
                    suffix_ = "PM";

                  }
                  else
                  {
                    suffix_ = "AM";
                  }
                  hours_ = hours_%12;
                  if(hours_==0)
                  {
                    hours_=12;
                  }

                  var start_final = hours_+':'+mins_+' '+suffix_;
                  var resu1 = resp.result.items[i].endTime;
                  var res1 = resu1.split(":",2);
                  hours_ = (parseInt(res1[0]))%24;
                  var cal_hr_1 = hours_;
                  mins_ = (parseInt(res1[1]))%60;

                  if(mins_<10)
                  {
                    mins_ = '0'+mins_;
                  }
                  var cal_mn_1 = mins_;
                  if(hours_>11)
                  {
                    suffix_ = "PM";

                  }
                  else
                  {
                    suffix_ = "AM";
                  }
                  hours_ = hours_%12;
                  if(hours_==0)
                  {
                    hours_=12;
                  }
                  var end_final = hours_+':'+mins_+' '+suffix_;
                  $scope.startendtime = ''+start_final + ' - ' + end_final;
                  $scope.startenddate = ''+ final_date;
                  $scope.venue = resp.items[i].venue; 

                  var title_ = resp.result.items[i].title.split(" ");
                    var final_title="";
                    for(var u in title_)
                    {
                        final_title = final_title+title_[u]+"+";
                    }
                    
                    var desc_ = resp.result.items[i].description.split(" ");
                    var final_desc = "";
                    for(var j in desc_)
                    {
                      final_desc = final_desc+desc_[j]+"+";
                    }
                    var loc_ = resp.result.items[i].venue.split(" ");
                    var final_loc = "";
                    for(var k in loc_)
                    {
                      final_loc = final_loc + loc_[k]+"+";
                    }
                    var test_var = String(date1.getMonth());
                    //console.log(test_var);
                    var cal_mon = parseInt(test_var)+1;
                    if(cal_mon<10)
                    {
                      cal_mon = "0"+cal_mon;
                    }
                    //console.log(day1);
                    //console.log("Done");
                    if(parseInt(cal_hr)<10)
                    {
                      cal_hr = '0'+cal_hr;
                    }
                    if(parseInt(cal_hr_1)<10)
                    {
                      cal_hr_1 = '0'+cal_hr_1;
                    }
                    var start_time_cal = "2015"+cal_mon+test_flag+"T"+cal_hr+cal_mn+"00";
                    var end_time_cal = "2015"+cal_mon+test_flag+"T"+cal_hr_1+cal_mn_1+"00";
                    //console.log("Calendar check");
                    $scope.insertlink = "https://www.google.com/calendar/render?action=TEMPLATE&text="+final_title+"&dates="+start_time_cal+"/"+end_time_cal+"&details="+final_desc+"&location="+final_loc+"&sf=true&output=xml";

                }
             });              
            });
        function whatdayisit(temp1)
        {
          switch(temp1)
          {
            case 0:
            return 'Sunday';
            case 1:
            return 'Monday';
            case 2:
            return 'Tuesday';
            case 3:
            return 'Wednesday';
            case 4:
            return 'Thursday';
            case 5:
            return 'Friday';
            case 6:
            return 'Saturday';
          }
        }
        } 
        $scope.go = function (hash) {
            var path = $location.path();
            $location.path(path+hash);
            //console.log($location.path());
        }
});
