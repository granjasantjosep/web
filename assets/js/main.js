(function ($) {
  var $window = $(window),
    $body = $("body"),
    settings = {
      // Carousels
      carousels: {
        speed: 4,
        fadeIn: true,
        fadeDelay: 250,
      },
    };

  // Breakpoints.
  breakpoints({
    wide: ["1281px", "1680px"],
    normal: ["961px", "1280px"],
    narrow: ["841px", "960px"],
    narrower: ["737px", "840px"],
    mobile: [null, "736px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Dropdowns.
  $("#nav > ul").dropotron({
    mode: "fade",
    speed: 350,
    noOpenerFade: true,
    alignment: "center",
  });

  // Scrolly.
  $(".scrolly").scrolly();

  // Carousels.
  $(".carousel").each(function () {
    var $t = $(this),
      $forward = $('<span class="forward"></span>'),
      $backward = $('<span class="backward"></span>'),
      $reel = $t.children(".reel"),
      $items = $reel.children("article");

    var pos = 0,
      leftLimit,
      rightLimit,
      itemWidth,
      reelWidth,
      timerId;

    // Items.
    if (settings.carousels.fadeIn) {
      $items.addClass("loading");

      $t.scrollex({
        mode: "middle",
        top: "-20vh",
        bottom: "-20vh",
        enter: function () {
          var timerId,
            limit = $items.length - Math.ceil($window.width() / itemWidth);

          timerId = window.setInterval(function () {
            var x = $items.filter(".loading"),
              xf = x.first();

            if (x.length <= limit) {
              window.clearInterval(timerId);
              $items.removeClass("loading");
              return;
            }

            xf.removeClass("loading");
          }, settings.carousels.fadeDelay);
        },
      });
    }

    // Main.
    $t._update = function () {
      pos = 0;
      rightLimit = -1 * reelWidth + $window.width();
      leftLimit = 0;
      $t._updatePos();
    };

    $t._updatePos = function () {
      $reel.css("transform", "translate(" + pos + "px, 0)");
    };

    // Forward.
    $forward
      .appendTo($t)
      .hide()
      .mouseenter(function (e) {
        timerId = window.setInterval(function () {
          pos -= settings.carousels.speed;

          if (pos <= rightLimit) {
            window.clearInterval(timerId);
            pos = rightLimit;
          }

          $t._updatePos();
        }, 10);
      })
      .mouseleave(function (e) {
        window.clearInterval(timerId);
      });

    // Backward.
    $backward
      .appendTo($t)
      .hide()
      .mouseenter(function (e) {
        timerId = window.setInterval(function () {
          pos += settings.carousels.speed;

          if (pos >= leftLimit) {
            window.clearInterval(timerId);
            pos = leftLimit;
          }

          $t._updatePos();
        }, 10);
      })
      .mouseleave(function (e) {
        window.clearInterval(timerId);
      });

    // Init.
    $window.on("load", function () {
      reelWidth = $reel[0].scrollWidth;

      if (browser.mobile) {
        $reel.css("overflow-y", "hidden").css("overflow-x", "scroll").scrollLeft(0);
        $forward.hide();
        $backward.hide();
      } else {
        $reel.css("overflow", "visible").scrollLeft(0);
        $forward.show();
        $backward.show();
      }

      $t._update();

      $window
        .on("resize", function () {
          reelWidth = $reel[0].scrollWidth;
          $t._update();
        })
        .trigger("resize");
    });
  });

  // Menu.
  var $menu = $("#menu"),
    $menuInner;

  $menu.wrapInner('<div class="inner"></div>');
  $menuInner = $menu.children(".inner");
  $menu._locked = false;

  $menu._lock = function () {
    if ($menu._locked) return false;

    $menu._locked = true;

    window.setTimeout(function () {
      $menu._locked = false;
    }, 350);

    return true;
  };

  $menu._show = function () {
    if ($menu._lock()) $body.addClass("is-menu-visible");
  };

  $menu._hide = function () {
    if ($menu._lock()) $body.removeClass("is-menu-visible");
  };

  $menu._toggle = function () {
    if ($menu._lock()) $body.toggleClass("is-menu-visible");
  };

  $menuInner
    .on("click", function (event) {
      event.stopPropagation();
    })
    .on("click", "a", function (event) {
      var href = $(this).attr("href");

      event.preventDefault();
      event.stopPropagation();

      // Hide.
      $menu._hide();

      // Redirect.
      window.setTimeout(function () {
        window.location.href = href;
      }, 250);
    });

  $menu
    .appendTo($body)
    .on("click", function (event) {
      event.stopPropagation();
      event.preventDefault();

      $body.removeClass("is-menu-visible");
    })
    .append('<a class="close" href="#menu">Close</a>');

  $body
    .on("click", 'a[href="#menu"]', function (event) {
      event.stopPropagation();
      event.preventDefault();

      // Toggle.
      $menu._toggle();
    })
    .on("click", function (event) {
      // Hide.
      $menu._hide();
    })
    .on("keydown", function (event) {
      // Hide on escape.
      if (event.keyCode == 27) $menu._hide();
    });
})(jQuery);
