<template>
  <div class="fk-input-container">
    <input
      :id="generateInputId(index)"
      :ref="generateInputId(index)"
      type="text"
      maxlength="1"
      :style="{
        fontSize: fkFontSize,
        borderBottom: fkInputColor(index),
        color: fontColor,
        width: fkWidth,
      }"
      v-model="inputValues[index]"
      @keyup="(event) => handleInputFocus(event, index)"
      @input="returnFullString()"
      contenteditable="true"
      :key="index"
      v-for="(input, index) in length"
    />
  </div>
</template>

<script>
// based on https://github.com/claudiolcastro/vue-fake-input
// it didnt behave exactly how i wanted it so i had to customise it a bit
export default {
  name: 'PokemonInput',
  props: {
    length: {
      type: Number,
      required: true
    },
    fontSize: {
      type: Number,
      default: 22,
      required: false
    },
    inputColor: {
      type: String,
      default: '#42b983',
      required: false
    },
    fontColor: {
      type: String,
      default: '#444444',
      required: false
    }
  },
  data () {
    return {
      inputValues: []
    }
  },
  mounted () {
    this.$refs.fk_1[0].focus()
  },
  computed: {
    fkFontSize () {
      return `${this.fontSize}px`
    },
    fkWidth () {
      const width = this.fontSize + 8
      return `${width}px`
    }
  },
  methods: {
    generateInputId (index) {
      return `fk_${index + 1}`
    },
    fkInputColor (index) {
      const color = this.inputValues[index] ? this.inputColor : '#eeeeee'
      return `3px solid ${color}`
    },
    handleInputFocus (event, index) {
      // only do stuff on alphanumeric or backspace
      const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      if (!allowedKeys.includes(event.key) && event.key !== 'Backspace') {
        return
      }

      // so it doesnt skip to second input when correct answer is entered
      if (this.inputValues[index] === undefined && index === 0) {
        return
      }

      // handle backspace
      if (event.key === 'Backspace') {
        // cant backspace from first field
        if (index === 0) {
          return
        }
        const [previusInput] = this.$refs[`fk_${index}`]
        const [cyrrentInput] = this.$refs[`fk_${index + 1}`]
        this.inputValues[index] = undefined
        this.inputValues[index - 1] = undefined
        cyrrentInput.value = ''
        previusInput.value = ''
        previusInput.focus()
      } else {
        // handle any other input
        this.inputValues[index] = event.key
        // cant enter anymore after final field
        if (index === this.length - 1) {
          return
        }
        const [nextInput] = this.$refs[`fk_${index + 2}`]
        nextInput.focus()
      }
    },
    returnFullString () {
      this.$emit('input', this.inputValues.join(''))
    }
  }
}
</script>

<style lang="scss" scoped>
  .fk-input-container {
    display: inline-block;
    input {
      border: none;
      margin-left: 10px;
      text-align: center;
      &:first-child { margin-left: 0; }
      &:focus { outline: none; }
    }
  }
</style>
