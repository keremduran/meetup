import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedMeetups: [
            {
                title: 'Tea and Biscuits with Developers',
                id: 'sdljfhslner',
                imageUrl: 'https://www.publicdomainpictures.net/pictures/210000/velka/new-york-skyline-1489166203L1o.jpg',
                date: new Date(),
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla nostrum facere delectus aspernatur numquam natus sit recusandae enim, culpa est.',
                location: 'New York'
            },
            {
                title: 'Cat Meetup Paris',
                id: 'asgdf23dssd',
                imageUrl: 'https://handluggageonly.co.uk/wp-content/uploads/2015/10/Paris-Restaurants-with-cool-views-5-1160x725.jpg',
                date: new Date(),
                description: 'Assumenda rerum ratione quam maxime? Neque dolor provident earum nisi rerum. Eos, suscipit quas ratione neque temporibus soluta ut odio quis asperiores nesciunt. Officiis blanditiis iure aspernatur placeat repudiandae vero.',
                location: 'Somewhere over the rainbow'
                
            }
        ],
        user: null
    },
    mutations: {
        createMeetup (state, payload){
            state.loadedMeetups.push(payload)
        },
        setUser (state, payload){
            state.user = payload
        }
    },
    actions: {
        createMeetup  ({commit}, payload) {
            const meetup = {
                title: payload.title,
                id: 'eft342343',
                location: payload.location,
                imageUrl: payload.imageUrl,
                description: payload.description,
                date: payload.date,
            }
            // Firebase access point
            commit('createMeetup', meetup)
        },
        signUserUp ({commit}, payload) {
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(
                    user => {
                        const newUser = {
                            id: user.user.uid,
                            registeredMeetups: []
                        } 
                        console.log(newUser)
                                              
                        commit('setUser', newUser)
                    }
                )
                .catch(
                    error => {
                        console.log(error)
                    }
                )
        },
        signUserIn ({commit}, payload) {
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(
                    user => {
                        const newUser = {
                            id: user.user.uid,
                            registeredMeetups: []
                        }                     
                        commit('setUser', newUser)
                    }                    
                )
                .catch(
                    error => {
                        console.log(error)
                    }
                )
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
            return (meetupId) => {
                return state.loadedMeetups.find((meetup) => {
                    return meetup.id === meetupId
                })
            }
        },
        user (state) {
            return state.user;
        }
    }
});