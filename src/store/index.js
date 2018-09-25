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
        registerUserForMeetup (state, payload) {
            const id = payload.id
            if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0 ){
                return
            }
            state.user.registeredMeetups.push(id)
            state.user.fbKeys[id] = payload.fbKey
        },
        unregisterUserFromMeetup (state, payload) {
            const registeredMeetups = state.user.registeredMeetups
            registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
            Reflect.deleteProperty(state.user.fbKeys, payload)
        },
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
        updateMeetup (state, payload) {
            const meetup = state.loadedMeetups.find(meetup => {
                return meetup.id === payload.id
            })
            console.log(meetup)
            if (payload.title) {
                meetup.title = payload.title
            }
            if (payload.description) {
                meetup.description = payload.description
            }
            if (payload.date) {
                meetup.date = payload.date
            }
            if (payload.location) {
                meetup.location = payload.location
            }
        },
        clearError (state) {
            state.error = null
        }
    },
    actions: {
        registerUserForMeetup ({commit, getters}, payload) {
            commit('setLoading', true)
            const user = getters.user
            firebase.database().ref('/users/' + user.id).child('/registrations/')
                .push(payload)
                .then(data => {
                    commit('setLoading', false)
                    commit('registerUserForMeetup', {id: payload, fbKey: data.key})
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        unregisterUserFromMeetup ({commit, getters}, payload) {
            commit('setLoading', true)
            const user = getters.user
            if (!user.fbKeys) {
                return
            }
            const fbKey = user.fbKeys[payload]
            firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
                .remove()
                .then(() => {
                    commit('setLoading', false)
                    commit('unregisterUserFromMeetup', payload)
                })
                .catch(
                    (error) => {
                        console.log(error)
                        commit('setLoading', false)
                    }
                )               
        },
        loadMeetups ({commit}) {
            commit('setLoading', true)
            firebase.database().ref('meetups').once('value')
                .then((data) => {
                    const meetups = []
                    // .val() excludes the unnecessary metadata
                    const meetupsFB = data.val()
                    for(let key in meetupsFB) {
                        meetups.push({
                            id: key,
                            title: meetupsFB[key].title,
                            description: meetupsFB[key].description,
                            imageUrl: meetupsFB[key].imageUrl,
                            date: meetupsFB[key].date,
                            location: meetupsFB[key].location,
                            creatorId: meetupsFB[key].creatorId
                        })
                    }   
                    commit('setLoadedMeetups', meetups)                                     
                    commit('setLoading', false)
                })
                .catch(
                    (error) => {
                        console.log(error); 
                        commit('setLoading', false)
                    }
                )
        },
        createMeetup  ({commit, getters}, payload) {
            const meetup = {
                title: payload.title,
                location: payload.location,
                description: payload.description,
                date: payload.date.toISOString(),
                creatorId: getters.user.id
            }
            let imageUrl
            let key
            firebase.database().ref('meetups').push(meetup)
                .then((data) => {
                    key = data.key
                    return key
                })
                .then(key => {
                    const fileName = payload.image.name
                    const ext = fileName.slice(fileName.lastIndexOf('.'))
                    return firebase.storage().ref('meetups/' + key + ext).put(payload.image)
                })
                .then(fileData => {
                    fileData.ref.getDownloadURL()
                    .then(url => {
                        imageUrl = url
                        console.log('File available at', url)
                        return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})                        
                    })                   
                })
                .then(() => {  
                    console.log(imageUrl)
                                           
                    commit('createMeetup', {
                        ...meetup,
                        imageUrl: imageUrl,
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
                            registeredMeetups: [],
                            fbKeys: {}
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
                            registeredMeetups: [],
                            fbKeys: {}
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
        autoSignIn ({commit}, payload) {
            commit('setUser', {
                id: payload.uid,
                registeredMeetups: [],
                fbKeys: {}
            })
        },
        fetchUserData ({commit, getters}) {
            commit ('setLoading', true) 
            firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
                .then(data => {
                    const dataPairs = data.val()
                    let registeredMeetups = []
                    let swappedPairs = {}
                    for (let key in dataPairs) {
                        registeredMeetups.push(dataPairs[key])
                        swappedPairs[dataPairs[key]] = key
                    }
                    const updatedUser = {
                        id: getters.user.id,
                        registeredMeetups: registeredMeetups,
                        fbKeys: swappedPairs
                    }
                    commit('setLoading', false)
                    commit('setUser', updatedUser)
                })            
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        logUserOut ({commit}){         
            firebase.auth().signOut()
            commit('setUser', null)
        },       
        updateMeetup ({commit}, payload) {
            commit('setLoading', true)
            const updatedObj = {}
            if (payload.title) {
                updatedObj.title = payload.title
            }
            if (payload.description) {
                updatedObj.description = payload.description
            }
            if (payload.date) {
                updatedObj.date = payload.date
            }
            if (payload.location) {
                updatedObj.location = payload.location
            }   
            if (payload.id) {
                updatedObj.id = payload.id
            }        
            firebase.database().ref('meetups').child(payload.id).update(updatedObj)
                .then(() => {
                    commit('setLoading', false)
                    commit('updateMeetup', updatedObj)
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        clearError ({commit}) {
            commit('clearError')
        },
    },
    getters: {
        loadedMeetups (state){
            return state.loadedMeetups.sort((meetupA, meetupB) => {
                return meetupA.date > meetupB.date 
            })
        },
        featuredMeetups (getters) {
            return getters.loadedMeetups.slice(0,5)
        },
        loadedMeetup (state){
            return (meetupId) => {
                return state.loadedMeetups.find((meetup) => {
                    return meetup.id === meetupId
                })
            }
        },
        user (state) {
            return state.user
        },
        loading (state) {
            return state.loading
        },
        error (state) {
            return state.error
        },
    }
});