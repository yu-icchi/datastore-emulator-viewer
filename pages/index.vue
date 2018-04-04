<template>
  <div>

    <v-layout row>
      <v-flex xs3>
        <v-btn
          outline
          color="primary"
          @click="onNewEntity"
        >
          <div class="btn_icon">
            <v-icon>add_box</v-icon>
          </div>
          entity create
        </v-btn>
      </v-flex>
      <v-flex xs2>
        <v-btn
          flat
          :disabled="!selected.length"
        >
          <div class="btn_icon">
            <v-icon>delete</v-icon>
          </div>
          delete
        </v-btn>
      </v-flex>
    </v-layout>

    <div class="bar">
      <v-divider></v-divider>
    </div>

    <v-layout row>
      <v-flex xs4>
        <v-select
          label="Kind"
          max-height="600"
          :items="kinds"
          v-model="kind"
          @change="onSelected"
          autocomplete
        />
      </v-flex>
    </v-layout>

    <v-data-table
      :headers="headers"
      :items="list"
      :search="search"
      v-model="selected"
      item-key="0"
      select-all
    >
      <template slot="headerCell" slot-scope="props">
        <template v-if="props.header.type">
          <v-tooltip bottom>
            <span slot="activator">
              {{props.header.text}}
            </span>
            <span>
              {{props.header.type}}
            </span>
          </v-tooltip>
        </template>
        <template v-else>
          <span slot="activator">
            {{props.header.text}}
          </span>
        </template>
      </template>
      <template slot="items" slot-scope="props">
        <tr>
          <td>
            <v-checkbox
              primary
              hide-details
              v-model="props.selected"
            ></v-checkbox>
          </td>
          <td>
            <nuxt-link :to="{path: 'entity/edit', query: {key: props.item[1]}}">
              {{props.item[0]}}
            </nuxt-link>
          </td>
          <template v-for="(index, i) in indexes">
            <td>{{props.item[i+2]}}</td>
          </template>
        </tr>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          no such entity...
        </v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  function showKey (key) {
    if (key.hasOwnProperty('id') && key.id !== null) {
      return `ID=${key.id}`
    }
    if (key.hasOwnProperty('name') && key.name !== null) {
      return `Name=${key.name}`
    }
    return ''
  }

  export default {
    data () {
      return {
        list: [],
        kind: null,
        indexes: [],
        items: [],
        headers: [],
        search: '',
        selected: []
      }
    },
    async asyncData ({app, store, error}) {
      try {
        let data = await app.$axios.$get('/api/datastore/kinds')
        const kinds = data.kinds || []

        let kind = store.state.kind
        if (!kind) {
          kind = kinds[0]
          store.dispatch('setKind', kind)
        }

        data = await app.$axios.$get(`/api/datastore/kinds/${kind}`)
        const headers = [
          {
            text: 'Name / ID',
            value: 'key',
            align: 'left',
            sortable: false
          }
        ]
        const indexes = []
        const list = []
        data.list.forEach((item) => {
          Object.keys(item.data).forEach((idx, i) => {
            if (!indexes.includes(idx)) {
              indexes.push(idx)
              headers.push({
                text: idx,
                type: idx,
                value: idx,
                align: 'left',
                sortable: false
              })
            }
          })
        })
        data.list.forEach((item) => {
          const arr = [
            showKey(item.key),
            item.encodeKey
          ]
          for (let idx of indexes) {
            arr.push(item.data[idx])
          }
          list.push(arr)
        })
        return {
          kind: kind || '',
          kinds: kinds || [],
          list: list || [],
          indexes: indexes,
          headers: headers
        }
      } catch (err) {
        console.log(err)
        return error(err)
      }
    },
    methods: {
      async onSelected (kind) {
        if (typeof kind !== 'string') {
          return
        }
        try {
          this.$store.dispatch('setKind', kind)

          const data = await this.$axios.$get(`/api/datastore/kinds/${kind}`)
          const headers = [
            {
              text: 'Name / ID',
              value: 'key',
              align: 'left',
              sortable: false
            }
          ]
          const indexes = []
          const list = []
          data.list.forEach((item) => {
            Object.keys(item.data).forEach((idx) => {
              if (!indexes.includes(idx)) {
                indexes.push(idx)
                headers.push({
                  text: idx,
                  type: idx,
                  value: idx,
                  align: 'left',
                  sortable: false
                })
              }
            })
          })
          data.list.forEach((item) => {
            const arr = [
              showKey(item.key),
              item.encodeKey
            ]
            for (let idx of indexes) {
              arr.push(item.data[idx])
            }
            list.push(arr)
          })
          this.list = list || []
          this.headers = headers
          this.indexes = indexes
        } catch (err) {
          console.log(err)
        }
      },
      onNewEntity () {
        this.$router.push({path: '/entity/new', query: {kind: this.kind}})
      }
    }
  }
</script>

<style scoped>
  .btn_icon {
    padding-right: 5px;
  }
  .bar {
    padding: 15px 0;
  }
</style>
