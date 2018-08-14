<template>
  <mu-button icon @click="back">
    <mu-icon value="keyboard_backspace"></mu-icon>
  </mu-button>
</template>
<script type="text/javascript">
export default {
  methods: {
    back () {
      this.$router.back()
    }
  }
}
</script>
