<template>
  <v-layout row>
    <v-flex xs8>
      <div class="leftField">
        <div :class="{
        'input-group': true,
        'input-group--text-field': true,
        'primary--text': true,
        'input-group--focused': isShowPicker
      }">
          <div class="input-group__input">
            <flat-pickr
              v-model="temp"
              :config="config"
              @on-change="onChangeTime"
              @on-open="onOpenPicker"
              @on-close="onClosePicker"
            ></flat-pickr>
          </div>
          <div class="input-group__details"></div>
        </div>
      </div>
    </v-flex>

    <!--<v-flex xs4>-->
      <!--<div class="rightField">-->
        <!--<v-select-->
          <!--label="Timezone"-->
          <!--:items="timezone"-->
        <!--&gt;</v-select>-->
      <!--</div>-->
    <!--</v-flex>-->
  </v-layout>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component'
  import 'flatpickr/dist/flatpickr.css'

  export default {
    name: 'datetime-picker',
    components: { flatPickr },
    props: {
      value: {}
    },
    data () {
      return {
        temp: this.value || null,
        config: {
          enableTime: true,
          enableSeconds: true,
          time_24hr: true,
          dateFormat: 'Z'
        },
        isShowPicker: false,
        timezone: [
          {text: 'Japan', value: 'jst'}
        ]
      }
    },
    methods: {
      onOpenPicker () {
        this.isShowPicker = true
      },
      onClosePicker () {
        this.isShowPicker = false
      },
      onChangeTime (times) {
        const time = times[0].toISOString()
        this.$emit('input', time)
        this.$emit('change', time)
      }
    }
  }
</script>

<style scoped>
  .leftField {
    margin-right: 10px;
  }
  .rightField {
    margin-left: 10px;
  }
</style>