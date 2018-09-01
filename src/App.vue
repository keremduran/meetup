<template>
  <v-app>
    <main>
      <v-navigation-drawer fixed v-model="sideNav">
        <v-list>
          <v-list-tile v-for="item in menuItems" :key="item.title">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              {{ item.title }}
            </v-list-tile-content>        
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar dark class="secondary">       
        <v-toolbar-side-icon
          class="hidden-sm-and-up"
          @click.native.stop="sideNav = !sideNav"></v-toolbar-side-icon>   
        <v-toolbar-title>Meetup</v-toolbar-title>             
        <v-spacer></v-spacer>    
        <v-toolbar-items v-for="item in menuItems" :key="item.title"
            class= "hidden-sx-only">   
          <v-btn flat>
            <v-icon dark left>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      sideNav: false,
      menuItems: [
        {icon: 'supervisor_account', title: 'View Meetups'},
        {icon: 'room', title: 'Organize Meetup'},
        {icon: 'person', title: 'Profile'},
        {icon: 'face', title: 'Sign Up'},
        {icon: 'lock_open', title: 'Sign In'},
      ]
    }
  },
  name: 'App'
}
</script>
