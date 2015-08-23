'use strict';

angular.module('ng-sticky', [])
.directive('stickyFloatContainer', function ($window) {
  return {
    link: function(scope, element, attrs) {

      function updatePosition() {
        var offset = $document.scrollTop();
        var diff = Math.abs(offset - prevOffset);
        var direction = offset - prevOffset > 0 ? 'down' : 'up';

        if (direction == 'down') {
          diff = calcOffsetToBottom(diff);
          if (diff) {
            currentTranslateY -= diff;
            $element.css({transform: 'translateY(' + currentTranslateY + 'px)'});
          }
        } else {
          diff= calcOffsetToTop(diff, offset);
          if (diff) {
            currentTranslateY += diff;
            $element.css({transform: 'translateY(' + currentTranslateY + 'px)'});
          }
        }
        prevOffset = offset;


        function calcOffsetToBottom(diff) {
          var borderBottom = $element.height() + initialTop - $window.innerHeight;
          var absTranslate = Math.abs(currentTranslateY);
          if (borderBottom > absTranslate)
            if ( borderBottom > absTranslate + diff) {
              return diff;
            }
            else {
              return borderBottom - absTranslate;
            }
          else {
            return 0;
          }
        }

        // расчитывает оффсет на который мы можем сдвинуть блок вверх, чтобы он не улетел за границу (начало экрана или initialTop)
        function calcOffsetToTop(diff, offset) {
          var borderTop;
          if (offset > initialTop){
            borderTop = -initialTop;
          }
          else {
            borderTop = -offset;
          }
          if (currentTranslateY + diff < borderTop)
            return diff;
          else {
            return (borderTop - currentTranslateY)
          }
        }
      }


      // в данном случае блок будет прилипать к верхней границе экрана
      function updateStickyPosition() {
        var offset  =  $document.scrollTop();
        var calculatedTopOffset = calculateTopOffset(offset);
        $element.css({transform: 'translateY(' + calculatedTopOffset + 'px)'});
        prevOffset = offset;
        function calculateTopOffset(offset) {
          // если высота блока меньше высоты экрана
          if ($element.height() <= $window.innerHeight) {
            if (offset > initialTop) {
              return -initialTop;
            } else {
              return -offset;
            }
          } else {
            // потом придумаю что сюда написать
          }
        }
      }

      function toggleNotStickyClass(enable) {
        if (enable && isNotSticky === false) {
          $element.css({transform: 'translateY(0px)'});
          currentTranslateY = 0;
          $element.addClass(notStickyClass);
          isNotSticky = true;
        }

        if (!enable && isNotSticky === true) {
          $element.removeClass(notStickyClass);
          isNotSticky = false;
          prevOffset = 0;
        }
      }

      function update() {
        var height = $element.height();

        // если высота блока больше вся высоты страницы
        if (height + initialTop + notStickyVariance >= document.body.scrollHeight) {
          toggleNotStickyClass(true);
          return;
        }


        toggleNotStickyClass(false);
        // если высота блока больше чем вьюпорт страницы
        if (height > window.innerHeight) {
          updatePosition();
          return;
        }
        // если высота меньше либо равна вьюпорту страницы
        if (height <= window.innerHeight) {
          updateStickyPosition();
          return;
        }
      }

      //------------------------ WATCHERS -------------------------------------
      if (attrs.enableWatcher === 'true') {
        scope.$watch(function() {
          //ОСТОРОЖНО ХАК! приходится наблюдать через timeout т.к. модель поменять успевает, а вьюха еще нет
          setTimeout(function() {
            var top = $element.parent().offset().top;
            if (top != initialTop) {
              initialTop = top;
              $element.css('top', top);
            }
          })
        })
      }

      scope.$watch(function() {
        return $element.height();
      }, function(newVal, oldVal) {
        // сделать так, чтобы при любом изменении дергался updateHeight вместо точечных правок
        if (oldVal == 0) {
          update();
          return;
        }
        var toBottomLeft = $document.height() - ($document.scrollTop() + $window.innerHeight);
        if ((newVal - oldVal) > 0 && (newVal - oldVal) > toBottomLeft) {
          currentTranslateY = -(newVal + initialTop - $window.innerHeight);
          $element.css({transform: 'translateY(' + currentTranslateY + 'px)'});
        }
      })

      scope.$watch(function() {
        return document.body.scrollHeight;
      }, function() {
        update();
      });


      // --------------------------------- INIT -------------------------------

      window.addEventListener('scroll', update);
      scope.$on('$destroy', function() {
        $window.removeEventListener('scroll', update);
      })

      var notStickyClass = "ScrollFloat-notSticky";
      var isNotSticky = false;
      var notStickyVariance = 100;    // погрешность (допускается чтобы высота скролл контейниера была на 100 больше чем высота блока)
      var prevOffset;
      var initialTop;
      var currentTranslateY = 0;
      var $element = $(element);
      var $document = $(document);



      setTimeout(function() {
       initialTop = parseInt($element.css('top'));
       prevOffset = $document.scrollTop();
       update();
      })

    }
  }
});
