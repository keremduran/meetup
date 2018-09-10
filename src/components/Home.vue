<template>
    <v-container>
        <v-layout row wrap class="mb-2">
            <v-flex xs12 sm6 class="text-sm-right text-xs-center">
                <v-btn router to="/meetups" class="primary" large>Explore Meetups</v-btn>
            </v-flex>
            <v-flex xs12 sm6 class="text-sm-left text-xs-center">
                <v-btn router to="/meetup/new" class="primary" large>Organize Meetup</v-btn>
            </v-flex>
        </v-layout>
        <v-layout row wrap>           
            <v-carousel style="cursor: pointer">
                <v-carousel-item
                v-for="meetup in meetups"
                :key="meetup.id"
                :src="meetup.imageUrl"
                @click="onLoadMeetup(meetup.id)">
                <v-flex>
                    <v-layout justify-center>
                        <div class="text-xs-center title">
                            {{ meetup.title }}
                        </div>
                    </v-layout>
                </v-flex>
                </v-carousel-item>
            </v-carousel>
        </v-layout>
        <v-layout row wrap class="mt-2">
            <v-flex xs12 class="text-xs-center">
                <p>Join Our Awesome Meetups!</p>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {

    computed: {
        meetups () {
            return this.$store.getters.featuredMeetups
        }
    },
    methods: {
        onLoadMeetup(id) {
            this.$router.push('/meetups/'+id);
        }
    }

}
</script>

<style scoped>
    .title {
        position: absolute;
        bottom: 50px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        font-size: 2em;
        padding: .5em;       
    }
</style>
