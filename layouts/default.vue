<template>
  <div>
    <v-app id="app">
      <v-navigation-drawer
        fixed
        v-model="drawer"
        app
      >
        <v-list dense>
          <v-list-tile @click="link('/')">
            <v-list-tile-action>
              <v-icon>search</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Entities</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="link('/dashboard')">
            <v-list-tile-action>
              <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Dashboard</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="link('/indexes')">
            <v-list-tile-action>
              <v-icon>queue</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Indexes</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="link('/admin')">
            <v-list-tile-action>
              <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Admin</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

        </v-list>
      </v-navigation-drawer>

      <v-toolbar app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer">

        </v-toolbar-side-icon>
        <v-toolbar-title>Datastore Viewer</v-toolbar-title>
      </v-toolbar>

      <v-content>
        <v-container fluid>
          <nuxt/>
        </v-container>
      </v-content>

      <v-footer app>

      </v-footer>
    </v-app>
  </div>
</template>

<script>
  const menus = [
    {
      title: ''
    }
  ]
  export default {
    data: () => {
      return {
        menuVisible: false,
        drawer: null,
        menus: menus
      }
    },
    methods: {
      link (path) {
        this.$router.push({path})
      }
    }
  }
</script>

<style>

</style>
