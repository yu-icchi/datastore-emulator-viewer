<template>
  <div>
    <v-container fluid>
      {{data}}
      <!-- property name -->
      <v-layout row>
        <v-flex xs6>
          <div class="leftField">
            <v-text-field
              label="Name"
              v-model="data.name"
            ></v-text-field>
          </div>
        </v-flex>

        <!-- property type -->
        <v-flex xs6>
          <div class="rightField">
            <v-select
              label="Type"
              max-height="600"
              v-model="data.valueType"
              :items="valueTypes"
              @change="onChangeValueType"
            ></v-select>
          </div>
        </v-flex>
      </v-layout>

      <!-- boolean -->
      <template v-if="isBoolean(data.valueType)">
        <v-layout row>
          <v-flex xs12>
            <v-select
              label="Value"
              :items="[
              {text: 'True', value: true},
              {text: 'False', value: false}
            ]"
              v-model="data.value"
            ></v-select>
          </v-flex>
        </v-layout>
      </template>

      <!-- integer && double -->
      <template v-else-if="isInt(data.valueType) || isDouble(data.valueType)">
        <v-layout row>
          <v-flex xs12>
            <v-text-field
              label="Value"
              type="number"
              v-model="data.value"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </template>

      <!-- datetime -->
      <template v-else-if="isDateTime(data.valueType)">
        <datetime-picker
          v-model="data.value"
        ></datetime-picker>
      </template>

      <!-- null -->
      <template v-else-if="isNull(data.valueType)"></template>

      <!-- key -->
      <template v-else-if="isKey(data.valueType)">
        <v-layout row>
          <v-flex xs12>
            <v-text-field
              label="Value"
              v-model="data.value"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </template>

      <!-- geo-point -->
      <template v-else-if="isGeoPoint(data.valueType)">
        <v-layout row>
          <v-flex xs6>
            <div class="leftField">
              <v-text-field
                label="Latitude"
                type="number"
                v-model="data.value && data.value.latitude"
              ></v-text-field>
            </div>
          </v-flex>
          <v-flex xs6>
            <div class="rightField">
              <v-text-field
                label="Longitude"
                type="number"
                v-model="data.value && data.value.longitude"
              ></v-text-field>
            </div>
          </v-flex>
        </v-layout>
      </template>

      <!-- entity -->
      <template v-else-if="isEntity(data.valueType)">
        <v-text-field
          label="Value"
          :value="showPrettyEntity(data.value)"
          textarea
        ></v-text-field>
      </template>

      <!-- string -->
      <template v-else>
        <v-layout row>
          <v-flex xs12>
            <v-text-field
              label="Value"
              v-model="data.value"
              textarea
            ></v-text-field>
          </v-flex>
        </v-layout>
      </template>

      <v-layout>
        <v-flex xs3>
          <v-checkbox
            label="Indexed"
            v-model="index"
            @change="onChangeIndex"
          ></v-checkbox>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>

<script>
  import DatetimePicker from './DatetimePicker'

  export default {
    components: {DatetimePicker},
    name: 'property-data',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        index: !this.data.excludeFromIndexes,

        valueTypes: [
          {text: 'STRING', value: 'stringValue'},
          {text: 'INT', value: 'integerValue'},
          {text: 'DOUBLE', value: 'doubleValue'},
          {text: 'BOOLEAN', value: 'booleanValue'},
          {text: 'DATE', value: 'timestampValue'},
          {text: 'BLOB', value: 'blobValue'},
          {text: 'ARRAY', value: 'arrayValue'},
          {text: 'GEO POINT', value: 'geoPointValue'},
          {text: 'NULL', value: 'nullValue'},
          {text: 'KEY', value: 'keyValue'},
          {text: 'EMBED_ENTITY', value: 'entityValue'}
        ]
      }
    },
    created () {
      // console.log('created', this.data)
    },
    methods: {
      onChangeValueType (valueType) {
        if (valueType === 'stringValue') {
          this.data.value = ''
        }
        if (valueType === 'integerValue' || valueType === 'doubleValue') {
          this.data.value = 0
        }
        if (valueType === 'booleanValue') {
          this.data.value = false
        }
        if (valueType === 'nullValue') {
          this.data.value = null
        }
        if (valueType === 'keyValue') {
          this.data.value = ''
        }
        if (valueType === 'blobValue') {
          this.data.value = ''
        }
        if (valueType === 'timestampValue') {
          this.data.value = new Date()
        }
        if (valueType === 'arrayValue') {
          const obj = {
            values: [
              {
                stringValue: 'propertyValue'
              }
            ]
          }
          this.data.value = JSON.stringify(obj, null, 2)
        }
        if (valueType === 'entityValue') {
          const obj = {
            properties: {
              defaultProperty: {
                stringValue: 'propertyValue'
              }
            }
          }
          this.data.value = JSON.stringify(obj, null, 2)
        }
        if (valueType === 'blobValue') {
          this.data.value = ''
        }
        if (valueType === 'geoPointValue') {
          this.data.value = {
            latitude: 0,
            longitude: 0
          }
        }
      },
      onChangeIndex (indexed) {
        this.data.excludeFromIndexes = !indexed
      },
      isString (x) {
        return x === 'stringValue'
      },
      isInt (x) {
        return x === 'integerValue'
      },
      isDouble (x) {
        return x === 'doubleValue'
      },
      isBoolean (x) {
        return x === 'booleanValue'
      },
      isDateTime (x) {
        return x === 'timestampValue'
      },
      isNull (x) {
        return x === 'nullValue'
      },
      isKey (x) {
        return x === 'keyValue'
      },
      isGeoPoint (x) {
        return x === 'geoPointValue'
      },
      isEntity (x) {
        return x === 'entityValue'
      },
      showValue (value, type) {
        switch (type) {
          case 'integerValue':
            return parseInt(value, 10)
          case 'doubleValue':
            return parseFloat(value, 10)
          default:
            return value
        }
      },
      showPrettyEntity (value) {
        const properties = {}
        value.data.forEach((item) => {
          properties[item.name] = {
            [item.valueType]: this.showValue(item.value, item.valueType),
            excludeFromIndexes: item.excludeFromIndexes
          }
        })
        return JSON.stringify({properties}, null, 2)
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