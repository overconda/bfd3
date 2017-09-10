/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* =============================================
 Kergrit Start Programe Here
 ================================================ */
var subfolder = '/bfd2';
var production = true;
var gps_options = {enableHighAccuracy: true, timeout: 10000, maximumAge: 0};
var api_ws = "https://singhabeerfinder.com/bfd2/webservice/api.php";
var quiz_time = 10000;
var base_unlock_quiz_answered = false;
var quizProgress = $('.quiz-progress');
var progressBar = $('.progress-bar');
var base_challenge_quiz_answered = false;
var your_score = 0;
var score_to_win = 0;

$(document).ready(function () {
  initRouteURL();
  initLocationProcedure();

  $("#log").change(function () {
    $("#log").scrollTop($("#log")[0].scrollHeight);
  });
  $("#log").remove();

  //signout
  $("ul.mm-nolistview li:last-child a").bind("click",function(){
    removeLocalStorage('sbf_user');
    removeLocalStorage('sbf_onlocation');
    window.location = subfolder + '/index.html';
  });
});

/* =============================================
 URL Routing & Content Functions
 ================================================ */
function initDesktopHeader() {
  var sbf_user = getLocalStorage('sbf_user');
  var pathname = window.location.pathname;
  if (sbf_user !== undefined) {
    $("#account-status img:first-child").attr('src', sbf_user.user_profile_photo);
    $("#account-status .account-name span").text(sbf_user.user_name);
    if ($(".profile-avatar").length > 0) {
      $(".profile-avatar figure img").attr('src', sbf_user.user_profile_photo);
    }
  }

  // for desktop menu active
  $(".nav-menu-desktop ul li").removeClass("menu-active");
  if (pathname === subfolder + '/home.html') {
    $(".nav-menu-desktop ul li:eq(0)").addClass("menu-active");
  } else if (pathname === subfolder + '/news.html' || pathname === subfolder + '/news-single.html') {
    $(".nav-menu-desktop ul li:eq(1)").addClass("menu-active");
  } else if (pathname === subfolder + '/routes.html' || pathname === subfolder + '/routes-detail.html' || pathname === subfolder + '/unlocked.html') {
    $(".nav-menu-desktop ul li:eq(2)").addClass("menu-active");
  } else if (pathname === subfolder + '/reward.html' || pathname === subfolder + '/reward-single.html') {
    $(".nav-menu-desktop ul li:eq(3)").addClass("menu-active");
  } else if (pathname === subfolder + '/profile.html' || pathname === subfolder + '/profile-edit.html') {
    $(".nav-menu-desktop ul li:eq(4)").addClass("menu-active");
  } else if (pathname === subfolder + '/about-beerfinder.html') {
    $(".nav-menu-desktop ul li:eq(5)").addClass("menu-active");
  } else if (pathname === subfolder + '/ranking.html') {
    $(".nav-menu-desktop ul li:eq(6)").addClass("menu-active");
  }
}

function initRouteURL() {
  var sbf_user = getLocalStorage('sbf_user');
  var pathname = window.location.pathname;

  // Authorized Control
  if (sbf_user === undefined && (pathname !== subfolder+"/" && pathname !== subfolder + "/index.html")) {
    window.location = subfolder+'/index.html';
  }
  //===== index.html
  else if (sbf_user !== undefined && (pathname === subfolder + "/" || pathname === subfolder + "/index.html")) {
    window.location = subfolder + '/home.html';
  }
  //===== routes.html
  else if (pathname === subfolder + '/routes.html') {
    renderRoutes();
  }
  //===== routes-detail.html
  else if (pathname === subfolder + '/routes-detail.html') {
    renderRoutesDetail();
  }
  //===== unlocked.html
  else if (pathname === subfolder + '/unlocked.html') {
    renderUnlocked();
  }
  //===== unlocked-quizzes.html
  else if (pathname === subfolder + '/unlocked-quizzes.html') {
    renderUnlockedQuizzes();
  }
  //===== unlocked-quizzes-incorrect.html
  else if (pathname === subfolder + '/unlocked-quizzes-incorrect.html') {
    renderUnlockedQuizzesIncorrect();
  }
  //===== /unlocked-congraturation.html
  else if (pathname == subfolder + "/unlocked-congraturation.html") {
    renderUnlockedCongraturation();
  }
  //===== guardian-quizzes.html
  else if (pathname == subfolder + '/guardian-quizzes.html') {
    renderGuardianQuizzes();
  }
  //===== guardian-quizzes-incorrect.html
  else if (pathname === subfolder + '/guardian-quizzes-incorrect.html') {
    renderGuardianQuizzesIncorrect();
  }
  //===== profile.html
  else if (pathname === subfolder + '/be-guardian.html') {
    renderBeGuardian();
  }
  //===== profile.html
  else if (pathname == subfolder + "/profile.html") {
    renderProfile();
  }
  //===== profile-edit.html
  else if (pathname == subfolder + "/profile-edit.html") {
    renderProfileEdit();
  }
}

/**
 * Render & manipulate routes.html
 * @returns {undefined}
 */
function renderRoutes() {
  $("div.route-btn:eq(0) .button-small a").attr("href", $("div.route-btn:eq(0) .button-small a").attr("href") + "?route_id=1");
  $("div.route-btn:eq(1) .button-small a").attr("href", $("div.route-btn:eq(1) .button-small a").attr("href") + "?route_id=2");
  $("div.route-btn:eq(2) .button-small a").attr("href", $("div.route-btn:eq(2) .button-small a").attr("href") + "?route_id=3");
  $("div.route-btn:eq(3) .button-small a").attr("href", $("div.route-btn:eq(3) .button-small a").attr("href") + "?route_id=4");
  $(".route-item:eq(0) .route-desc h3").html("Singha Headquarter");
  $(".route-item:eq(1) .route-desc h3").html("Nakniwat Road");
  $(".route-item:eq(2) .route-desc h3").html("Chok Chai 4");
}

/**
 * Render & manipulate routes_detail.html
 * @returns {undefined}
 */
function renderRoutesDetail() {
  var pair = window.location.search.substring(1).split("=");
  var route_id = pair[1];
  var sbf_user = getLocalStorage('sbf_user');

  // get - sbf_user & bases status
  var params = {'method': 'get_route_base_user', 'route_id': route_id, 'oauth_user_id': sbf_user.oauth_user_id};
  $.post(api_ws, params, function (response) {

    var route = response.route;
    var base = response.base;
    var user_route = response.user_route;
    var user_base = response.user_base;

    // route favorite
    if (user_route !== null) {
      if (user_route.favorite_status == "true") {
        $(".route-fav").removeClass("noFav").addClass("addedFav");
      }
    }

    // route info
    $(".desktop-breadcrumbs li:eq(1) h2").html(route.route_title);
    $("#menu-top h1.page-title").html(route.route_title);

    // reset bases - unlocked
    $("g[class^='base-info-']").removeClass('base-unlocked');
    $("div[id^='base-info-'] .lock-icon img").attr("src", "images/svg/lock.svg");
    $("div[id^='base-info-']").removeClass('base-info-unlocked');

    console.log(route);

    $(".point-row .point-col:eq(0) .num-transition span:gt(0)").remove();
    $(".point-row .point-col:eq(0) .num-transition span:eq(0)").attr("data-number", route.completed_point).html(route.completed_point);

    $(".point-row .point-col:eq(1) .num-transition span:gt(0)").remove();
    $(".point-row .point-col:eq(1) .num-transition span:eq(0)").attr("data-number", route.unlocked_base_point).html(route.unlocked_base_point);

    //$(".point-row .point-col:eq(2) .num-transition span:gt(0)").remove();
    $(".point-row .point-col:eq(2) .num-transition span:eq(0)").attr("data-number", route.extra_point).html(route.extra_point);

    // fixed for singha route
    if (route.ID == 1 || route.ID == 3) {
      index = 1;
      $("g[class^='base-info-']").each(function (item) {
        if (index > 5) {
          $(this).remove();
        }
        index++;
      })
    }

    if (base.length) {
      base.forEach(function (item) {
        var elem = $("#base-info-" + item.base_no + " .route-info .route-info-box");
        $(elem).find("a").attr("href", $(elem).find("a").attr("href") + "?base_id=" + item.ID)
        $(elem).find("h3").html(item.base_title);
        $(elem).find(".route-info-desc").html(item.base_excerpt);
      });
    }

    // re-draw unlocked base
    if (user_base.length) {
      user_base.forEach(function (item) {
        if (item.unlocked_status == 'true') {
          $(".base-info-" + item.base_no).addClass('base-unlocked');
          $("#base-info-" + item.base_no).addClass("base-info-unlocked");
          $("#base-info-" + item.base_no + " .lock-icon img").attr("src", "images/svg/unlocked.svg");
        }
      });
    }
  });
}

/**
 * Render & manipulate unlocked.html
 * @returns {undefined}
 */
function renderUnlocked() {
  var pair = window.location.search.substring(1).split("=");
  var base_id = pair[1];
  var sbf_user = getLocalStorage('sbf_user');
  var onlocation_status = false;
  var sbf_onlocation = getLocalStorage("sbf_onlocation");

  // check this base in sbf_onlocation
  if (sbf_onlocation !== undefined) {
    sbf_onlocation.forEach(function (base, index) {
      if (base_id == base.ID) {
        onlocation_status = true;
      }
    });
  }

  // get - sbf_user & bases status
  var params = {'method': 'get_base_user', 'base_id': base_id, 'oauth_user_id': sbf_user.oauth_user_id};
  $.post(api_ws, params, function (response) {
    var base = response.base;
    var user_base = response.user_base;
    var route = response.route;

    // back-prev
    $(".back-prev a").attr("href", $(".back-prev a").attr("href") + "?route_id=" + base.route_id);

    // base info
    $(".base-header .meta-wrapper").removeClass('unlocked');
    $(".base-header .meta-wrapper .meta-item.meta-status span").html("Locked");
    $(".base-header .meta-wrapper .meta-item.meta-name span").html(route.route_title);

    // set default - no guardian
    //$(".guardian-avatar img").attr("src", subfolder + "/images/no-gaurdian.jpg");
    //$(".guardian-name").html("<span>No the guardian now.</span>" + "You can be the guardian");

    if (base !== null) {
      $(".base-header .base-num").html(base.base_no);
      $(".base-header h1").html(base.base_title);

      // guradian / no guardian info
      if (base.guardian !== null) {
        $(".guardian-avatar img").attr("src", base.guardian.user_profile_photo);
        $(".guardian-name").html("<span>The guardian is</span>" + base.guardian.user_name);
      }

      // locked / unlocked info
      if (user_base !== null) {
        if (user_base.unlocked_status == 'true') {
          $(".base-header .meta-wrapper").addClass('unlocked');
          $(".base-header .meta-wrapper .meta-item.meta-status span").html("Unlocked");
        }
      }

      // button action info
      if (onlocation_status) {
        $(".button-sticky a").attr("href", "unlocked-quizzes.html?base_id=" + base_id);
        $(".button-sticky a").html("Unlock Now");
        if (user_base !== null) {
          if (user_base.unlocked_status == 'true') {
            $(".button-sticky a").html("Challenge Now");
            $(".button-sticky a").attr("href", "guardian-quizzes.html?base_id=" + base_id);
          }
        }
      } else {
        $(".button-sticky a").attr("target", "_blank");
        $(".button-sticky a").attr("href", "https://www.google.co.th/maps/place/" + base.base_latitude + "," + base.base_longitude);
      }
    }
  });
}

/**
 * Render & manipulate unlocked-quizzes.html
 * @returns {undefined}
 */
function renderUnlockedQuizzes() {
  var pair = window.location.search.substring(1).split("=");
  var base_id = pair[1];

  var sbf_user = getLocalStorage('sbf_user');
  var onlocation_status = false;
  var sbf_onlocation = getLocalStorage("sbf_onlocation");

  // check this base in sbf_onlocation
  if (sbf_onlocation !== undefined) {
    sbf_onlocation.forEach(function (base, index) {
      if (base_id == base.ID) {
        onlocation_status = true;
      }
    });
  }

  if (!onlocation_status) {
    window.location = subfolder + '/unlocked.html?base_id=' + base_id;
    return;
  }

  // get - sbf_user & base status
  var params = {'method': 'get_base_user', 'base_id': base_id, 'oauth_user_id': sbf_user.oauth_user_id};
  $.post(api_ws, params, function (response) {
    var base = response.base;
    var user_base = response.user_base;
    var route = response.route;

    if (user_base != null) {
      if (user_base.unlocked_status == 'true') {
        window.location = subfolder + '/unlocked.html?base_id=' + base_id;
        return;
      }

      // answer wrong wait 3 min
      if (user_base.unlock_time < 0) {
        window.location = subfolder + '/unlocked-quizzes-incorrect.html?base_id=' + base_id;
        return;
      }
    }

    if (base !== null) {
      $(".base-header .base-num").html(base.base_no);
      $(".base-header h1").html(base.base_title);
      $(".base-header .meta-item.meta-route span").html(route.route_title);
      $(".unlock-caption span").html("'" + sbf_user.user_name + "'");
    }

    $(".back-prev a").attr("href", subfolder + '/unlocked.html?base_id=' + base_id);
    $(".base-content a").removeAttr("href");

    // Progress Bar UI
    $(".base-content a").off("click").on("click", function () {
      // get - base unlock quiz
      var params = {'method': 'get_base_unlock_quiz', 'oauth_user_id': sbf_user.oauth_user_id};
      $.post(api_ws, params, function (response) {
        var quiz = response.quiz;
        base_unlock_quiz_answered = false;

        $(".quiz-title").html(quiz.question);
        var answer = '';

        if (quiz.answer_1 != null) {
          var mark = '';
          if (quiz.correct_answer == 1 && !production)
            mark = "[CORRECT]";
          answer += '<div class="button button-fullwidth"><a onClick="doAnswerUnlock(' + base_id + ',' + quiz.ID + ',1)">' + quiz.answer_1 + ' ' + mark + '</a></div>';
        }
        if (quiz.answer_2 != null) {
          var mark = '';
          if (quiz.correct_answer == 2 && !production)
            mark = "[CORRECT]";
          answer += '<div class="button button-fullwidth"><a onClick="doAnswerUnlock(' + base_id + ',' + quiz.ID + ',2)">' + quiz.answer_2 + ' ' + mark + '</a></div>';
        }
        if (quiz.answer_3 != null) {
          var mark = '';
          if (quiz.correct_answer == 3 && !production)
            mark = "[CORRECT]";
          answer += '<div class="button button-fullwidth"><a onClick="doAnswerUnlock(' + base_id + ',' + quiz.ID + ',3)">' + quiz.answer_3 + ' ' + mark + '</a></div>';
        }
        if (quiz.answer_4 != null) {
          var mark = '';
          if (quiz.correct_answer == 4 && !production)
            mark = "[CORRECT]";
          answer += '<div class="button button-fullwidth"><a onClick="doAnswerUnlock(' + base_id + ',' + quiz.ID + ',4)">' + quiz.answer_4 + ' ' + mark + '</a></div>';
        }

        // base unlock quiz modal
        $(".quiz-title").parent().find(".button.button-fullwidth").remove();
        $(".quiz-title").parent().append(answer);

        $('.modal').show();
        var quizProgressWidth = quizProgress.width();
        progressBar.animate({
          width: quizProgressWidth
        }, quiz_time, function () {
          if (!base_unlock_quiz_answered) {
            doAnswerUnlock(base_id, quiz.ID, 0);
            //window.location = subfolder + "/unlocked-quizzes-incorrect.html?base_id=" + base_id;
          }
        });
      });
    });
  });
}

/**
 * Render & manipulate unlocked-quizzes-incorrect.html
 * @returns {undefined}
 */
function renderUnlockedQuizzesIncorrect() {
  var pair = window.location.search.substring(1).split("=");
  var base_id = pair[1];

  var sbf_user = getLocalStorage('sbf_user');
  var onlocation_status = false;
  var sbf_onlocation = getLocalStorage("sbf_onlocation");

  // check this base in sbf_onlocation
  if (sbf_onlocation !== undefined) {
    sbf_onlocation.forEach(function (base, index) {
      if (base_id == base.ID) {
        onlocation_status = true;
      }
    });
  }

  if (!onlocation_status) {
    window.location = subfolder + '/unlocked.html?base_id=' + base_id;
    return;
  }

  // get - sbf_user & bases status
  var params = {'method': 'get_base_user', 'base_id': base_id, 'oauth_user_id': sbf_user.oauth_user_id};
  $.post(api_ws, params, function (response) {
    var base = response.base;
    var user_base = response.user_base;
    var route = response.route;

    if (base !== null) {
      $(".base-header .base-num").html(base.base_no);
      $(".base-header h1").html(base.base_title);
      $(".base-header .meta-item.meta-route span").html(route.route_title);
      $(".unlock-caption span").html("'" + sbf_user.user_name + "'");
      $(".notify-quiz-desc span").html($(".notify-quiz-desc span").html() + " : " + Math.abs(user_base.unlock_time) + " Min");
    }
    $(".back-prev a").attr("href", "unlocked.html?base_id=" + base_id);
    $(".button-sticky a").attr("href", "unlocked.html?base_id=" + base_id)
  });
}

/**
 * Render & manipulate unlocked-congratulation.html
 * @returns {undefined}
 */
function renderUnlockedCongraturation() {
  var pair = window.location.search.substring(1).split("=");
  var base_id = pair[1];

  var sbf_user = getLocalStorage('sbf_user');
  var onlocation_status = false;
  var sbf_onlocation = getLocalStorage("sbf_onlocation");

  // check this base in sbf_onlocation
  if (sbf_onlocation !== undefined) {
    sbf_onlocation.forEach(function (base, index) {
      if (base_id == base.ID) {
        onlocation_status = true;
      }
    });
  }

  if (!onlocation_status) {
    window.location = subfolder + '/unlocked.html?base_id=' + base_id;
    return;
  }

  // get - sbf_user & bases status
  var params = {'method': 'get_base_user', 'base_id': base_id, 'oauth_user_id': sbf_user.oauth_user_id};
  $.post(api_ws, params, function (response) {
    var base = response.base;
    var user_base = response.user_base;
    var route = response.route;

    if (base !== null) {
      $(".base-header .base-num").html(base.base_no);
      $(".base-header h1").html(base.base_title);
      $(".base-header .meta-item.meta-route span").html(route.route_title);
      $(".unlock-caption span").html("'" + sbf_user.user_name + "'");
    }
    $(".back-prev a").attr("href", "unlocked.html?base_id=" + base_id);
    $(".button-sticky a").attr("href", "unlocked.html?base_id=" + base_id);
  });
}

/**
 * Render & manipulate guardian-quizzes.html
 * @returns {undefined}
 */
function renderGuardianQuizzes() {
  var pair = window.location.search.substring(1).split("=");
  var base_id = pair[1];

  var sbf_user = getLocalStorage('sbf_user');
  var onlocation_status = false;
  var sbf_onlocation = getLocalStorage("sbf_onlocation");

  // check this base in sbf_onlocation
  if (sbf_onlocation !== undefined) {
    sbf_onlocation.forEach(function (base, index) {
      if (base_id == base.ID) {
        onlocation_status = true;
      }
    });
  }

  if (!onlocation_status) {
    window.location = subfolder + '/unlocked.html?base_id=' + base_id;
    return;
  }

  // get - sbf_user & bases status
  var params = {'method': 'get_base_user', 'base_id': base_id, 'oauth_user_id': sbf_user.oauth_user_id};
  $.post(api_ws, params, function (response) {
    var base = response.base;
    var user_base = response.user_base;
    var route = response.route;

    // must check wait time before play (in user_base after reponse)
    if (user_base.challenge_time < 0) {
      window.location = subfolder + '/guardian-quizzes-incorrect.html?base_id=' + base_id;
      return;
    }

    your_quizzes = $(".your-quizzes span");
    amount_num = $(".amount-num span");

    $(".back-prev a").attr("href", "unlocked.html?base_id=" + base_id);
    if (base !== null) {
      $(".base-header .base-num").html(base.base_no);
      $(".base-header h1").html(base.base_title);
      $(".base-header .meta-item.meta-route span").html(route.route_title);
      $(".unlock-caption span").html("'" + sbf_user.user_name + "'");

      score_to_win = base.latest_guardian_score;
      your_quizzes.attr("data-number", your_score).html(your_score);
      amount_num.attr("data-number", score_to_win).html(score_to_win);
    }

    // Progress Bar UI
    $(".button-sticky a").off("click").on("click", function () {
      // get - base challenge quiz
      var params = {'method': 'get_base_challenge_quiz', 'oauth_user_id': sbf_user.oauth_user_id};
      $.post(api_ws, params, function (response) {
        var quiz = response.quiz;
        base_challenge_quiz_answered = false;

        $(".quiz-title").html(quiz.question);
        var answer = '';

        if (quiz.answer_1 != null) {
          var mark = '';
          if (quiz.correct_answer == 1 && !production)
            mark = "[CORRECT]";
          answer += '<div class="button button-fullwidth"><a onClick="doAnswerChallenge(' + base_id + ',' + quiz.ID + ',1)">' + quiz.answer_1 + ' ' + mark + '</a></div>';
        }
        if (quiz.answer_2 != null) {
          var mark = '';
          if (quiz.correct_answer == 2 && !production)
            mark = "[CORRECT]";
          answer += '<div class="button button-fullwidth"><a onClick="doAnswerChallenge(' + base_id + ',' + quiz.ID + ',2)">' + quiz.answer_2 + ' ' + mark + '</a></div>';
        }
        if (quiz.answer_3 != null) {
          var mark = '';
          if (quiz.correct_answer == 3 && !production)
            mark = "[CORRECT]";
          answer += '<div class="button button-fullwidth"><a onClick="doAnswerChallenge(' + base_id + ',' + quiz.ID + ',3)">' + quiz.answer_3 + ' ' + mark + '</a></div>';
        }
        if (quiz.answer_4 != null) {
          var mark = '';
          if (quiz.correct_answer == 4 && !production)
            mark = "[CORRECT]";
          answer += '<div class="button button-fullwidth"><a onClick="doAnswerChallenge(' + base_id + ',' + quiz.ID + ',4)">' + quiz.answer_4 + ' ' + mark + '</a></div>';
        }

        // base unlock quiz modal
        $(".quiz-title").parent().find(".button.button-fullwidth").remove();
        $(".quiz-title").parent().append(answer);

        $('.modal').show();
        var quizProgressWidth = quizProgress.width();
        progressBar.animate({
          width: quizProgressWidth
        }, quiz_time, function () {
          if (!base_challenge_quiz_answered) {
            doAnswerChallenge(base_id, quiz.ID, 0);
          }
        });
      });
    });
  });
}

/**
 * Render & manipulate guardian-quizzes-incorrect.html
 * @returns {undefined}
 */
function renderGuardianQuizzesIncorrect() {
  var pair = window.location.search.substring(1).split("=");
  var base_id = pair[1];

  var sbf_user = getLocalStorage('sbf_user');
  var onlocation_status = false;
  var sbf_onlocation = getLocalStorage("sbf_onlocation");

  // check this base in sbf_onlocation
  if (sbf_onlocation !== undefined) {
    sbf_onlocation.forEach(function (base, index) {
      if (base_id == base.ID) {
        onlocation_status = true;
      }
    });
  }

  if (!onlocation_status) {
    window.location = subfolder + '/unlocked.html?base_id=' + base_id;
    return;
  }

  // get - sbf_user & bases status
  var params = {'method': 'get_base_user', 'base_id': base_id, 'oauth_user_id': sbf_user.oauth_user_id};
  $.post(api_ws, params, function (response) {
    var base = response.base;
    var user_base = response.user_base;
    var route = response.route;

    if (base !== null) {
      $(".base-header .base-num").html(base.base_no);
      $(".base-header h1").html(base.base_title);
      $(".base-header .meta-item.meta-route span").html(route.route_title);
      $(".unlock-caption span").html("'" + sbf_user.user_name + "'");
      $(".notify-quiz-desc span").html($(".notify-quiz-desc span").html() + " : " + Math.abs(user_base.challenge_time) + " Min");
    }
    $(".back-prev a").attr("href", "unlocked.html?base_id=" + base_id);
    $(".button-sticky a").attr("href", "unlocked.html?base_id=" + base_id);
  });
}

/**
 * Render & manipulate be-guardian.html
 * @returns {undefined}
 */
function renderBeGuardian() {
  var pair = window.location.search.substring(1).split("=");
  var base_id = pair[1];

  var sbf_user = getLocalStorage('sbf_user');
  var onlocation_status = false;
  var sbf_onlocation = getLocalStorage("sbf_onlocation");

  // check this base in sbf_onlocation
  if (sbf_onlocation !== undefined) {
    sbf_onlocation.forEach(function (base, index) {
      if (base_id == base.ID) {
        onlocation_status = true;
      }
    });
  }

  if (!onlocation_status) {
    window.location = subfolder + '/unlocked.html?base_id=' + base_id;
    return;
  }

  // get - sbf_user & bases status
  var params = {'method': 'get_base_user', 'base_id': base_id, 'oauth_user_id': sbf_user.oauth_user_id};
  $.post(api_ws, params, function (response) {
    var base = response.base;
    var user_base = response.user_base;
    var route = response.route;

    if (base !== null) {
      $(".base-header .base-num").html(base.base_no);
      $(".base-header h1").html(base.base_title);
      $(".base-header .meta-item.meta-route span").html(route.route_title);
      $(".unlock-caption span").html("'" + sbf_user.user_name + "'");

      $(".guardian-avatar img").attr("src", sbf_user.user_profile_photo);
      $(".guardian-name").html('<span>The guardian is</span>' + sbf_user.user_name);

      $(".num-transition span:eq(1)").remove();
      $(".num-transition span:eq(0)").attr("data-number", user_base.guardian_score).html(user_base.guardian_score);
    }

    $(".back-prev a").attr("href", "unlocked.html?base_id=" + base_id);
    $(".button-sticky a").attr("href", "unlocked.html?base_id=" + base_id);
    $(".base-content .button:last-child a").attr("href", "unlocked.html?base_id=" + base_id);
  });
}

/**
 * Render & manipulate profile.html
 * @returns {undefined}
 */
function renderProfile() {
  var sbf_user = getLocalStorage('sbf_user');
  $(".profile-avatar figure img").attr('src', sbf_user.user_profile_photo);
  $(".profile-name").html(sbf_user.user_name);
}

/**
 * Render & manipulate profile-edit.html
 * @returns {undefined}
 */
function renderProfileEdit() {
  var sbf_user = getLocalStorage('sbf_user');
  $(".profile-avatar figure img").attr('src', sbf_user.user_profile_photo);
  $(".profile-name").html(sbf_user.user_name);
}

/* =============================================
 Geolocation Functions
 ================================================ */
/**
 * Main Controller of GeoLocation
 * @returns {undefined}
 */
function initLocationProcedure() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      doLog("[getCurrentPosition] " + position.coords.latitude + ", " + position.coords.longitude);
      doTrackGPS(position);
      watchCurrentPosition();
    }, function (error) {
      doLog("The current position could not be found! " + error.message);
    }, gps_options);
  } else {
    doLog("Your phone does not support the Geolocation API\n");
  }
}

/**
 * Preparation data for calculate user on location
 * @param {type} position
 * @returns {undefined}
 */
function doTrackGPS(position) {
  doLog("doTrackGPS");
  var sbf_user = getLocalStorage('sbf_user');

  // 1. get current & latest user location
  var sbf_current_gps = {'latitude': position.coords.latitude, 'longitude': position.coords.longitude};
  var sbf_latest_gps = getLocalStorage('sbf_latest_gps');
  if (getLocalStorage('sbf_latest_gps') === undefined) {
    sbf_latest_gps = sbf_current_gps;
    setLocalStorage('sbf_latest_gps', sbf_current_gps);
  }

  // 2. check distance between current & latest over distance_check
  var distance_check = 10.000; //10km.
  var distance_in_km = haversineGreatCircleDistance(sbf_current_gps.latitude, sbf_current_gps.longitude, sbf_latest_gps.latitude, sbf_latest_gps.longitude, 6371);
  if (distance_in_km > distance_check) {
    setLocalStorage('sbf_latest_gps', sbf_current_gps);
    removeLocalStorage("sbf_nearby_bases");
    doLog("[DEL] [" + distance_in_km + " km] sbf_nearby_bases");
  }

  // 3. check has exist nearby routes / bases in localStorage
  if (getLocalStorage('sbf_nearby_bases') === undefined) {
    var params = {"method": "get_nearby_route_base", "sbf_current_gps": sbf_current_gps};
    $.post(api_ws, params, function (response) {
      doLog("[INS] sbf_nearby_bases");
      setLocalStorage('sbf_nearby_bases', response.nearby_base);
      calculateOnLocation(sbf_current_gps);
    });
  } else {
    calculateOnLocation(sbf_current_gps);
  }
}

/**
 * Calculate user on location
 * @param {type} sbf_current_gps
 * @returns {undefined}
 */
function calculateOnLocation(sbf_current_gps) {
  doLog("calculateOnLocation");
  var d = new Date();
  doLog(d.getTime() + " ===================================");

  var sbf_nearby_bases = getLocalStorage('sbf_nearby_bases');
  var sbf_onlocation = [];

  var distance_check = 0.100; //100m
  //var distance_check = 0.050; //50m
  var sbf_latest_nearby_base = getLocalStorage("sbf_latest_nearby_base");

  if (sbf_nearby_bases != null) {
    sbf_nearby_bases.forEach(function (base, index) {
      var distance_in_km = haversineGreatCircleDistance(sbf_current_gps.latitude, sbf_current_gps.longitude, base.base_latitude, base.base_longitude, 6371);
      if (distance_in_km <= distance_check) {
        sbf_onlocation.push(base);
      }
      doLog('You Far ::: [' + base.ID + '] [' + distance_in_km.toFixed(4) + ' KM] ' + base.base_title);
    });

    var exist_sbf_onlocation = getLocalStorage("sbf_onlocation");
    var same_onlocation = false;
    if (JSON.stringify(exist_sbf_onlocation) === JSON.stringify(sbf_onlocation)) {
      $('body').addClass('localStorage');
      console.log("add body.localStorage");
      same_onlocation = true;
    } else {
      $('body').removeClass('localStorage');
      $(".onlocation-section").remove(); //simply remove modal
      console.log("rm body.localStorage");
    }

//    console.log(JSON.stringify(exist_sbf_onlocation));
//    console.log(JSON.stringify(sbf_onlocation));
//    console.log(same_onlocation);

    setLocalStorage("sbf_onlocation", sbf_onlocation);
    // on location n base found
    if (sbf_onlocation.length > 1) {
      doOnlocationNBase();
      sbf_onlocation.forEach(function (base, index) {
        doLog('Hay! You Near ::: [' + base.ID + '] ' + base.base_title);
      });
      // on location 1 base found
    } else if (sbf_onlocation.length == 1) {
      doOnlocation1Base();
      base = sbf_onlocation[0];
      doLog('Hay! You Near ::: [' + base.ID + '] ' + base.base_title);
    } else {
      outLocation();
      removeLocalStorage("sbf_onlocation");
    }
  } else {
    outLocation();
    removeLocalStorage("sbf_onlocation");
  }
}

/**
 * User on location with only 1 base
 * @returns {undefined}
 */
function doOnlocation1Base() {
  var sbf_user = getLocalStorage('sbf_user');
  var sbf_onlocation = getLocalStorage('sbf_onlocation');
  var base = sbf_onlocation[0];

  if (sbf_user !== undefined) {
    var params = {'method': 'get_base_user', 'base_id': base.ID, 'oauth_user_id': sbf_user.oauth_user_id};
    $.post(api_ws, params, function (response) {

      var base = response.base;
      var route = response.route;
      var user_base = response.user_base;

      if (user_base === null) {
        onLocation(false, 'doUnlockBase', response);
      } else {
        if (user_base.unlocked_status == 'false') {
          onLocation(false, 'doUnlockBase', response);
        } else if (user_base.unlocked_status == 'true') {
          onLocation(true, 'doChallengeBase', response);
        }
      }
    });
  }
}

/**
 * User on location with multiple base
 * @returns {undefined}
 */
function doOnlocationNBase() {
  var sbf_user = getLocalStorage('sbf_user');
  var sbf_onlocation = getLocalStorage('sbf_onlocation');
  onLocation('multiple', 'doChooseNBase', sbf_onlocation);
}

/**
 * User on location with multiple base will be choose base first
 * @returns {undefined}
 */
function doChooseNBase(sbf_onlocation) {
  /*
   $('.on-location-name,.on-location-meta').remove();
   var close_btn = $('.on-location-group .button:last-child').clone();
   $('.on-location-group .button').remove();
   sbf_onlocation.forEach(function (base, index) {
   var elem = '<div class="button"><a onclick="doUnlockOrChallengeBase(' + base.ID + ')">' + base.base_title + '</a></div>';
   $('.on-location-group').prepend(elem);
   });
   $('.on-location-group').append(close_btn);
   */

  var sbf_user = getLocalStorage('sbf_user');
  //var btn_close = $(".loc-btn-group .button.btn-close").clone();
  $(".on-location-box h1").html("Hey " + sbf_user.user_name + "!<br>You are on locations");
  $(".loc-btn-group .button.btn-lock,.loc-btn-group .button.btn-unlock").remove();

  var lock = '<div class="button btn-lock animated fadeInLeft"><a href="#">Stamford Bridge</a></div>';
  var unlock = '<div class="button btn-unlock animated fadeInRight"><a href="#">Old Trafford</a></div>';

  var base_ids = [];
  sbf_onlocation.forEach(function (base, index) {
    base_ids.push(base.ID);
  });

  var params = {'method': 'get_nbase_user', 'base_ids': base_ids, 'oauth_user_id': sbf_user.oauth_user_id};
  $.post(api_ws, params, function (response) {
    sbf_onlocation.forEach(function (base, index) {
      var elem = '<div class="button btn-lock animated fadeInLeft"><a href="unlocked-quizzes.html?base_id='+base.ID+'">'+base.base_title+'</a></div>';
      if (response[base.ID] == "unlock") {
        elem = '<div class="button btn-unlock animated fadeInRight"><a href="guardian-quizzes.html?base_id='+base.ID+'">'+base.base_title+'</a></div>';
      }
      $(".loc-btn-group").prepend(elem);
    });
    //$(".loc-btn-group").append(btn_close);
  });
}

function doUnlockOrChallengeBase(base_id) {
  var sbf_user = getLocalStorage('sbf_user');
  var onlocation_status = false;
  var sbf_onlocation = getLocalStorage("sbf_onlocation");

  // check this base in sbf_onlocation
  if (sbf_onlocation !== undefined) {
    sbf_onlocation.forEach(function (base, index) {
      if (base_id == base.ID) {
        onlocation_status = true;
      }
    });
  }

  if (!onlocation_status) {
    window.location = subfolder + '/unlocked.html?base_id=' + base_id;
    return;
  }

  var params = {'method': 'get_base_user', 'base_id': base_id, 'oauth_user_id': sbf_user.oauth_user_id};
  $.post(api_ws, params, function (response) {

    var base = response.base;
    var route = response.route;
    var user_base = response.user_base;

    if (user_base === null) {
      window.location = subfolder + '/unlocked-quizzes.html?base_id=' + base.ID;
    } else {
      if (user_base.unlocked_status == 'false') {
        window.location = subfolder + '/unlocked-quizzes.html?base_id=' + base.ID;
      } else if (user_base.unlocked_status == 'true') {
        window.location = subfolder + '/guardian-quizzes.html?base_id=' + base.ID;
      }
    }
  });
}

/**
 * User on location and will be unlocked base first
 * @param {type} data
 * @returns {undefined}
 */
function doUnlockBase(data) {
  var route = data.route;
  var base = data.base;
  $(".on-location-name").html(base.base_title);
  $(".on-location-meta").html(route.route_title);
  var elem = $(".on-location-group .button:eq(0) a");
  $(elem).attr("href", "unlocked.html?base_id=" + base.ID);
}

/**
 * Try to unlocked base with quiz game
 * @param {type} base_id
 * @param {type} quiz_id
 * @param {type} answer
 * @returns {undefined}
 */
function doAnswerUnlock(base_id, quiz_id, answer) {
  var sbf_user = getLocalStorage('sbf_user');
  var sbf_onlocation = getLocalStorage("sbf_onlocation");
  var base = null;

  // check this base in sbf_onlocation
  if (sbf_onlocation !== undefined) {
    sbf_onlocation.forEach(function (_base, index) {
      if (base_id == _base.ID) {

        base = _base;
      }
    });
  }

  progressBar.stop().clearQueue().removeAttr('style');
  base_unlock_quiz_answered = true;  // for break progress bar ui

  var params = {"method": "check_base_unlock_quiz",
    "route_id": base.route_id,
    "base_id": base.ID,
    "base_no": base.base_no,
    "oauth_user_id": sbf_user.oauth_user_id,
    "quiz_id": quiz_id,
    "answer": answer};
  $.post(api_ws, params, function (response) {
    if (response.correct == 'true') {
      window.location = subfolder + "/unlocked-congraturation.html?base_id=" + base.ID;
    } else {
      window.location = subfolder + "/unlocked-quizzes-incorrect.html?base_id=" + base.ID;
    }
  });
}

/**
 * User on location unlocked base try to be guardian
 * @param {type} data
 * @returns {undefined}
 */
function doChallengeBase(data) {
  var sbf_user = getLocalStorage('sbf_user');
  var route = data.route;
  var base = data.base;
  var user_base = data.user_base;

  if (base.guardian !== null) {
    $(".onlocation-avatar img.img-fit").attr("src", base.guardian.user_profile_photo);
    $(".onlocation-chal-name").html(base.guardian.user_name);
    $(".onlocation-chal-base").html(base.base_title + '<span>is seizing by</span>');
    $(".onlocation-pts-wrap .onlocation-pts-col:eq(0)").html(base.latest_guardian_score + '<span>Points</span>');
  } else {
    $(".onlocation-chal-base").html(base.base_title + '<span>NO THE GUARDIAN NOW.</span>');
  }

  $(".on-location-name").html(base.base_title);
  $(".on-location-meta").html(route.route_title);
  var elem = $(".on-location-group .button:eq(1) a");
  $(elem).attr("href", "unlocked.html?base_id=" + base.ID);
  $(".on-location-group .button a:eq(0)").attr("href", "guardian-quizzes.html?base_id=" + base.ID);
}

/**
 * Try to be guardian base with quiz game
 * @param {type} base_id
 * @param {type} quiz_id
 * @param {type} answer
 * @returns {undefined}
 */
function doAnswerChallenge(base_id, quiz_id, answer) {
  var sbf_user = getLocalStorage('sbf_user');
  var sbf_onlocation = getLocalStorage("sbf_onlocation");
  var base = null;

  // check this base in sbf_onlocation
  if (sbf_onlocation !== undefined) {
    sbf_onlocation.forEach(function (_base, index) {
      if (base_id == _base.ID) {
        base = _base;
      }
    });
  }

  progressBar.stop().clearQueue().removeAttr('style');
  base_challenge_quiz_answered = true;  // for break progress bar ui

  var params = {"method": "check_base_challenge_quiz",
    "route_id": base.route_id,
    "base_id": base.ID,
    "base_no": base.base_no,
    "oauth_user_id": sbf_user.oauth_user_id,
    "quiz_id": quiz_id,
    "answer": answer};
  $.post(api_ws, params, function (response) {
    if (response.correct == 'true') {
      your_score += 1;
      $(".your-quizzes span").removeClass("numSlideIn delay1 delay2 delay3 delay4 delay5").addClass("numSlideOut");
      setTimeout(function () {
        if (your_score >= 9) {
          $(".your-quizzes span").css("left", -5);
        }
        $(".your-quizzes span").removeClass("numSlideOut").addClass("numSlideIn");
        $(".your-quizzes span").attr("data-number", your_score);
      }, 400);
    } else {
      var params = {"method": "set_base_user", "score": your_score, "base_id": base.ID, "oauth_user_id": sbf_user.oauth_user_id};
      $.post(api_ws, params, function (response) {
        if (your_score > score_to_win) {
          window.location = subfolder + "/be-guardian.html?base_id=" + base.ID;
        } else {
          window.location = subfolder + "/guardian-quizzes-incorrect.html?base_id=" + base.ID;
        }
      });
    }
    $(".modal").hide();
  });
}

/**
 * Watching geolocation change
 * @returns {undefined}
 */
function watchCurrentPosition() {
  var positionTimer = navigator.geolocation.watchPosition(function (position) {
    doLog("[watchPosition] " + position.coords.latitude + ", " + position.coords.longitude);
    doTrackGPS(position);
  });
}

/**
 * Calculates the great-circle distance between two points, with
 * the Haversine formula.
 * @param float latitudeFrom Latitude of start point in [deg decimal]
 * @param float longitudeFrom Longitude of start point in [deg decimal]
 * @param float latitudeTo Latitude of target point in [deg decimal]
 * @param float longitudeTo Longitude of target point in [deg decimal]
 * @param float earthRadius Mean earth radius in [m]
 * @return float Distance between points in [m] (same as earthRadius)
 */
function haversineGreatCircleDistance(latitudeFrom, longitudeFrom, latitudeTo, longitudeTo, earthRadius) {
  // convert from degrees to radians
  latFrom = deg2rad(latitudeFrom);
  lonFrom = deg2rad(longitudeFrom);
  latTo = deg2rad(latitudeTo);
  lonTo = deg2rad(longitudeTo);

  latDelta = latTo - latFrom;
  lonDelta = lonTo - lonFrom;

  angle = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latDelta / 2), 2) + Math.cos(latFrom) * Math.cos(latTo) * Math.pow(Math.sin(lonDelta / 2), 2)));
  return angle * earthRadius;
}

/**
 * Calculates the great-circle distance between two points, with
 * the Vincenty formula.
 * @param float latitudeFrom Latitude of start point in [deg decimal]
 * @param float longitudeFrom Longitude of start point in [deg decimal]
 * @param float latitudeTo Latitude of target point in [deg decimal]
 * @param float longitudeTo Longitude of target point in [deg decimal]
 * @param float earthRadius Mean earth radius in [m]
 * @return float Distance between points in [m] (same as earthRadius)
 */
function vincentyGreatCircleDistance(latitudeFrom, longitudeFrom, latitudeTo, longitudeTo, earthRadius) {
  // convert from degrees to radians
  latFrom = deg2rad(latitudeFrom);
  lonFrom = deg2rad(longitudeFrom);
  latTo = deg2rad(latitudeTo);
  lonTo = deg2rad(longitudeTo);

  lonDelta = lonTo - lonFrom;
  a = Math.pow(Math.cos(latTo) * Math.sin(lonDelta), 2) +
          Math.pow(Math.cos(latFrom) * Math.sin(latTo) - Math.sin(latFrom) * Math.cos(latTo) * Math.cos(lonDelta), 2);
  b = Math.sin(latFrom) * Math.sin(latTo) + Math.cos(latFrom) * Math.cos(latTo) * Math.cos(lonDelta);

  angle = Math.atan2(Math.sqrt(a), b);
  return angle * earthRadius;
}

/**
 * Convert degree to radius
 * @param {type} angle
 * @returns {Number}
 */
function deg2rad(angle) {
  return angle * 0.017453292519943295;
}

/* =============================================
 Start - Utility Functions
 ================================================ */

/**
 * Get localStorage with key and return object
 * @param {type} key
 * @returns {undefined|JSON.parse.j|Array|Object}
 */
function getLocalStorage(key) {
  return JSON.parse(window.localStorage.getItem(key)) || undefined;
}

/**
 * Set localStorage with key,value
 * @param {type} key
 * @param {type} value
 * @returns {undefined}
 */
function setLocalStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Remove localStorage with key
 * @param {type} key
 * @returns {undefined}
 */
function removeLocalStorage(key) {
  window.localStorage.removeItem(key);
}

/**
 * Display Log
 * @param {type} msg
 * @returns {undefined}
 */
function doLog(msg) {
  var str = $("#log").html() + msg + "\n";
  $("#log").html(str).change();
  console.log(msg);
}
