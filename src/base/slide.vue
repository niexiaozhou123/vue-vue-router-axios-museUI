<template>
  <transition name="slide">
    <slot></slot>
  </transition>
</template>
<script type="text/ecmascript-6"></script>
<style lang="scss" rel="stylesheet/sass" scoped>
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
