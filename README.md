ng-sticly-float-container
==============
a simple directive which makes element stick to the top when scrolling down and if it's height bigger when window height when it is scrolls to bottom when scrolling down and vice versa
# Demo

http://js-padavan.github.io/ng-sticky-float-container/


# How To Use
- include ng-sticky-float-container.js file
- add dependency to your module, example:
```
angular.module('myApp', ['ng-sticky'])
```
- position your container with {position: fixed } **!!! it is important to use fixed positioning !!!**
- add ng-sticky-float-continer directive to your element
```
<style>
    .container {
        position: fixed;
        top: 100px;
        left: 200px;
    }
</style>
 <div class="container" ng-sticky-float-container></div>
