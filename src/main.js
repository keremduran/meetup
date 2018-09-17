// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'
import DateFilter from './filters/date'
import 'vuetify/dist/vuetify.min.css'
import AlertCmp from './components/Shared/Alert.vue'

Vue.use(Vuetify, {
  theme: {
    primary: '#1867c0',
    secondary: '#d5f0ff'
  }
})
Vue.filter('datify', DateFilter)
Vue.component('app-alert', AlertCmp)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    firebase.initializeApp({
        apiKey: 'AIzaSyBpwKK5_hX1M03qwZvv3yjSiGtW6dLEdFA',
        authDomain: 'meetup-eb8b8.firebaseapp.com',
        databaseURL: 'https://meetup-eb8b8.firebaseio.com',
        projectId: 'meetup-eb8b8',
        storageBucket: 'meetup-eb8b8.appspot.com'
      }
    )
    this.$store.dispatch('loadMeetups')
  }
})
