import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedMeetups: [],
        user: null,
        loading: false,
        error: null
    },
    mutations: {
        setLoadedMeetups (state, payload) {
            state.loadedMeetups = payload
        },
        createMeetup (state, payload) {
            state.loadedMeetups.push(payload)
        },
        setUser (state, payload) {
            state.user = payload
        },
        setLoading (state, payload) {
            state.loading = payload
        },
        setError (state, payload) {
            state.error = payload
        },
        clearError (state) {
            state.error = null
        }
    },
    actions: {
        loadMeetups ({commit}) {
            commit('setLoading', true)
            
            firebase.database().ref('meetups').once('value')
                .then((data) => {
                    const meetups = []
                    //Meetup IDs assigned as names by Firebase
                    //And this block fetches those names and assigns as ID
                    //And .val() excludes the unnecessary metadata
                    const meetupsFB = data.val()
                    for(let key in meetupsFB) {
                        meetups.push({
                            id: key,
                            title: meetupsFB[key].title,
                            description: meetupsFB[key].description,
                            imageUrl: meetupsFB[key].imageUrl,
                            date: meetupsFB[key].date
                        })
                    }   
                    commit('setLoadedMeetups', meetups)                                     
                    commit('setLoading', false)
                })
                .catch(
                    (error) => {
                        console.log(error); 
                        commit('setLoading', true)
                    }
                )
        },
        createMeetup  ({commit}, payload) {
            const meetup = {
                title: payload.title,
                location: payload.location,
                imageUrl: payload.imageUrl,
                description: payload.description,
                date: payload.date.toISOString()
            }
            firebase.database().ref('meetups').push(meetup)
                .then((data) => {
                    const key = data.key

                    commit('createMeetup', {
                        ...meetup,
                        id: key
                    })
                })
                .catch((error) => {
                    console.log(error)               
                })
            // Firebase access point
        },
        signUserUp ({commit}, payload) {
            commit('clearError')
            commit('setLoading', true)
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(
                    user => {                      
                        commit('setLoading', false)
                        const newUser = {
                            id: user.user.uid,
                            registeredMeetups: []
                        };                   
                        commit('setUser', newUser)
                    }
                ).catch(
                    error => {
                        commit('setLoading', false)
                        commit('setError', error)
                    }
                )
        },
        signUserIn ({commit}, payload) {
            commit('clearError')
            commit('setLoading', true)
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(
                    user => {                 
                        commit('setLoading', false)
                        const newUser = {
                            id: user.user.uid,
                            registeredMeetups: []
                        }                     
                        commit('setUser', newUser)    
                    }                    
                )
                .catch(
                    error => {
                        commit('setLoading', false)
                        commit('setError', error)
                    }
                )
        },
        clearError ({commit}) {
            commit('clearError')
        }
    },
    getters: {
        loadedMeetups (state){
            return state.loadedMeetups.sort((meetupA, meetupB) => {
                return meetupA.date > meetupB.date 
            })
        },
        featuredMeetups (getters) {
            return getters.loadedMeetups.slice(0,5);
        },
        loadedMeetup (state){
            return (key) => {
                return state.loadedMeetups.find((meetup) => {
                    return meetup.id === key
                })
            }
        },
        user (state) {
            return state.user
        },
        loading (state) {
            return state.loading
        },
        error(state) {
            return state.error
        }
    }
});