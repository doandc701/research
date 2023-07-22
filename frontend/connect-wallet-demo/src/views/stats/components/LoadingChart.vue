<template>
  <div class="spinner">
    <span class="ball-1" />
    <span class="ball-2" />
    <span class="ball-3" />
    <span class="ball-4" />
    <span class="ball-5" />
    <span class="ball-6" />
    <span class="ball-7" />
    <span class="ball-8" />
  </div>
</template>
<style lang="scss" scoped>
// loading
$colors: #2196f3, #03a9f4, #00bcd4, #009688, #4caf50, #8bc34a, #cddc39, #ffeb3b;

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  height: 40px;
  width: 40px;
  transform: translate(-50%, -50%);
}

[class^="ball-"] {
  position: absolute;
  display: block;
  left: 30px;
  width: 5px;
  height: 5px;
  border-radius: 6px;
  transition: all 0.5s;
  animation: circleRotate 4s both infinite;
  transform-origin: 0 250% 0;
}

@keyframes circleRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1440deg);
  }
}

@for $i from 1 through 8 {
  .ball-#{$i} {
    z-index: -#{$i};
    background-color: nth($colors, $i);
    animation-timing-function: cubic-bezier(0.5, 0.3 * $i, 0.9, 0.9);
  }
}
</style>
