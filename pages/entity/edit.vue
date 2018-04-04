<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs2>
        <span class="body-2">namespace:</span>
      </v-flex>
      <v-flex xs2>
        <span class="body-1">
          {{!namespace ? '[default]' : namespace}}
        </span>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs2>
        <span class="body-2">kind:</span>
      </v-flex>
      <v-flex xs2>
        <span class="body-1">
          {{kind}}
        </span>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs2>
        <span class="body-2">key:</span>
      </v-flex>
      <v-flex>
        <span class="body-1">
          {{key}}
        </span>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-subheader>Properties</v-subheader>
      <v-flex xs12>
        <v-expansion-panel>

          <template v-for="(property, idx) in properties">

            <v-expansion-panel-content
              @input="onOpen(idx)"
            >
              <div slot="header">
                <template v-if="openMap[idx]">
                  <span class="body-2">Property Edit</span>
                </template>
                <template v-else>
                  <span class="body-2">{{showHeader(property)}}</span>
                </template>
                <template v-if="openMap[idx]">
                  <v-icon
                    class="right"
                    @click="onDelete(idx)"
                  >delete</v-icon>
                </template>
                <template v-else>
                  <v-icon
                    class="right"
                  >edit</v-icon>
                </template>
                <template v-if="!openMap[idx]">
                  <span class="right body-1">
                    {{property.excludeFromIndexes ? '' : 'indexed'}}
                  </span>
                </template>
              </div>

              <v-card>
                <v-card-text>
                  <property-data
                    :data="property"
                  ></property-data>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

          </template>

        </v-expansion-panel>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12>
        <v-btn
          block
          outline
          color="indigo"
          @click="onAdd"
        >add</v-btn>
      </v-flex>
    </v-layout>

    <v-btn
      depressed
      color="primary"
      @click="onSave"
    >save</v-btn>
  </v-container>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component'
  import 'flatpickr/dist/flatpickr.css'
  import DatetimePicker from '../../components/DatetimePicker'
  import PropertyData from '../../components/PropertyData'

  function showKey (key) {
    let pk = ''
    if (key.parent) {
      pk = showKey(key.parent)
    }

    let type = ''
    let value = ''
    if (key.hasOwnProperty('id') && key.id !== null) {
      type = 'id'
      value = key.id
    }
    if (key.hasOwnProperty('name') && key.name !== null) {
      type = 'name'
      value = key.name
    }
    let k = ''
    if (pk) {
      k += `${pk} > `
    }
    k += `${key.kind} ${type}:${value}`
    return k
  }

  export default {
    name: 'entity',
    components: {
      PropertyData,
      DatetimePicker,
      flatPickr
    },
    data () {
      return {
        // key
        key: null,
        name: null,
        namespace: null,
        // data
        properties: [],

        openMap: {},

        items: [
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
          {text: 'TEXT', value: 'textValue'}
        ]
      }
    },
    async asyncData ({app, query, error}) {
      try {
        const key = query.key
        if (!key) {
          return {}
        }

        const data = await app.$axios.$get(`/api/datastore/entities?key=${key}`)
        const entity = data.entities[0]
        return {
          key: showKey(entity.key),
          kind: entity.key.kind,
          namespace: entity.key.namespace,
          properties: entity.data
        }
      } catch (err) {
        console.log(err)
        error(err)
      }
    },
    methods: {
      onAdd () {
        this.properties.push({
          name: '',
          valueType: 'stringValue',
          value: '',
          excludeFromIndexes: true
        })
      },
      onDelete (idx) {
        this.properties.splice(idx, 1)
        if (this.properties.length > idx) {
          this.$set(this.openMap, idx, !(this.openMap[idx + 1]))
        } else {
          this.$set(this.openMap, idx, false)
        }
      },
      onSave () {
        console.log(JSON.stringify(this.properties, null, 2))
      },
      onOpen (idx) {
        this.$set(this.openMap, idx, !(this.openMap[idx]))
      },
      onChangeValueType (idx) {
        const data = this.properties[idx]
        if (data.valueType === 'booleanValue') {
          data.value = false
        }
      },
      showHeader (property) {
        switch (property.valueType) {
          case 'geoPointValue':
            return `${property.name}: ${JSON.stringify(property.value)}`
          case 'entityValue':
            return `${property.name}: ${this.showEntity(property.value)}`
          case 'arrayValue':
            return `${property.name}: ${this.showArray(property.value)}`
          case 'booleanValue':
          case 'integerValue':
          case 'doubleValue':
          case 'stringValue':
          case 'nullValue':
          case 'timestampValue':
            return `${property.name}: ${property.value}`
          default:
            return 'Property Edit'
        }
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
      showEntity (value) {
        const obj = {}
        for (let i in value.data) {
          const item = value.data[i]
          obj[item.name] = this.showValue(item.value, item.valueType)
        }
        return JSON.stringify(obj)
      },
      showArray (value) {
        const arr = []
        for (let i in value) {
          const item = value[i]
          arr.push(this.showValue(item.stringValue, 'stringValue'))
        }
        return JSON.stringify(arr)
      },
      isBoolean (x) {
        return x === 'booleanValue'
      },
      isInt (x) {
        return x === 'integerValue'
      },
      isDouble (x) {
        return x === 'doubleValue'
      },
      isGeoPoint (x) {
        return x === 'geoPointValue'
      },
      isNull (x) {
        return x === 'nullValue'
      },
      isDate (x) {
        return x === 'timestampValue'
      }
    }
  }
</script>

<style scoped>
  .right {
    padding-right: 10px;
  }
  .leftField {
    margin-right: 10px;
  }
  .rightField {
    margin-left: 10px;
  }
</style>