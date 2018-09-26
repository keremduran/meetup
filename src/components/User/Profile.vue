<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <h2 class="primary--text">
                    Your secret user ID: 
                    <span class="secondary--text">{{user.id}}</span>
                </h2>
            </v-flex>
        </v-layout>
        <v-divider class="my-4"></v-divider>
        <v-layout row wrap>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2 >
                <div class="primary--text text-xs-center">
                    <h2> Created Meetups </h2>
                </div>
                <v-card class="info my-3 secondary" v-for="meetup in meetups" v-if="userIsCreator(meetup)" :key="meetup.id">
                    <v-container fluid>
                        <v-layout row>
                            <v-flex xs5 sm4>
                                <v-img
                                :src="meetup.imageUrl"
                                aspect-ratio="1.3"
                                ></v-img>
                            </v-flex>
                            <v-flex xs7 sm8>
                                <v-card-title primary-title>
                                    <div>
                                        <h2 class="mb-0">{{ meetup.title }}</h2>
                                        <v-icon v-if="userIsRegistered(meetup)" class="mx-2 green--text">how_to_reg</v-icon>
                                        <v-icon v-if="userIsCreator(meetup)" class="mx-2 green--text">gavel</v-icon>                                        
                                        <div>{{ meetup.date | datify }} - {{ meetup.location }}</div>
                                    </div>
                                </v-card-title>
                                <v-card-actions>
                                    <v-btn flat :to="'meetups/' + meetup.id">
                                        <v-icon left light>arrow_forward</v-icon>
                                        View Meetup
                                    </v-btn>
                                </v-card-actions>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
                <v-layout v-if="false" row >
                    <v-flex xs12 class="text-xs-center primary--text">
                        <p class="mt-3 subheading">
                            None here
                        </p>
                        <router-link style='height: 100%; text-decoration: none' to="/meetup/new">
                            <v-btn class="primary">
                                Create One!
                            </v-btn>
                        </router-link>
                    </v-flex>
                </v-layout> 
            </v-flex>
        </v-layout>
        <v-divider class="my-4"></v-divider>
        <v-layout row wrap>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2 >
                <div class="primary--text text-xs-center">
                    <h2> Registered Meetups </h2>
                </div>
                <v-card class="info my-3 secondary" v-for="meetup in meetups" v-if="userIsRegistered(meetup)" :key="meetup.id">
                    <v-container fluid>
                        <v-layout row>
                            <v-flex xs5 sm4>
                                <v-img
                                :src="meetup.imageUrl"
                                aspect-ratio="1.3"
                                ></v-img>
                            </v-flex>
                            <v-flex xs7 sm8>
                                <v-card-title primary-title>
                                    <div>
                                        <h2 class="mb-0">{{ meetup.title }}</h2>
                                        <v-icon v-if="userIsRegistered(meetup)" class="mx-2 green--text">how_to_reg</v-icon>
                                        <v-icon v-if="userIsCreator(meetup)" class="mx-2 green--text">gavel</v-icon>                                        
                                        <div>{{ meetup.date | datify }} - {{ meetup.location }}</div>
                                    </div>
                                </v-card-title>
                                <v-card-actions>
                                    <v-btn flat :to="'meetups/' + meetup.id">
                                        <v-icon left light>arrow_forward</v-icon>
                                        View Meetup
                                    </v-btn>
                                </v-card-actions>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
                <v-layout v-if="false" row >
                    <v-flex xs12 class="text-xs-center primary--text">
                        <p class="mt-3 subheading">
                            If you had any :(
                        </p>
                        <router-link style='height: 100%; text-decoration: none' to="/meetups">
                            <v-btn class="primary">
                                Check 'em out
                            </v-btn>
                        </router-link>
                    </v-flex>
                </v-layout> 
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    computed: {
        user () {
            return this.$store.getters.user
        },
        meetups () {
            return this.$store.getters.loadedMeetups
        },
        userIsAuthenticated () {
            return this.$store.getters.user !== null && this.$store.getters.user !== undefined
        },
        registeredMeetups () {
            return this.$store.getters.user.registeredMeetups
        },
        registeredMeetupExists () {
            if ( this.registeredMeetups === undefined || this.registeredMeetups.length == 0) {
                return false
            }
            return true           
        },
    },
    methods: {
        userIsCreator (meetup) {
            if (!this.userIsAuthenticated){
                return false
            }
            return this.user.id === meetup.creatorId
        },
        userIsRegistered (meetup) {
            return this.registeredMeetups.findIndex(meetupId => {
                return meetupId === meetup.id
            }) >= 0
        },
        log (item) {
            console.log(item);   
        }   
    }
}
</script>

<style scoped>
    .secondary {
        background: #d5f0ff !important;
    }

    h2 {
        display: inline;
    }
</style>


