<template>
    <v-container>
        <v-layout row class="mb-2">
            <v-flex xs12 sm6 offset-sm3>
                <h2 class="secondary--text">Create a New Meetup</h2>
            </v-flex>
        </v-layout>
        <v-form @submit.prevent="onCreateMeetup">
            <v-layout row>     
                <v-flex xs12 sm6 offset-sm3>
                        <v-text-field
                            v-model="title"
                            :counter="40"
                            label="Title"
                            required
                        >
                        </v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                        <v-text-field
                            v-model="location"
                            label="Location"
                            required
                        >
                        </v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                        <v-text-field
                            v-model="imageUrl"
                            label="Image URL"
                            required
                        >
                        </v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                    <v-img
                    :src="imageUrl"
                    ></v-img>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                        <v-text-field
                            v-model="description"                       
                            :counter="100"
                            label="Description"
                            multi-line
                            :rows="4"
                            required
                        >
                        </v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex class="my-2" xs12 sm6 offset-sm3>
                    <h2 class="text--secondary text-xs-center">Choose a Date & Time</h2>
                </v-flex>
            </v-layout>
            <v-layout row> <!-- To center the date pickers -->
                <v-flex xs12 sm6 offset-sm3>
                    <v-layout row>
                        <v-flex class="mb-1" xs12 sm6>
                            <v-date-picker v-model="date"></v-date-picker>
                            <p class="text-xs-center">{{ date }}</p>                   
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex class="mb-1" xs12 sm6>
                            <v-time-picker v-model="time" format="24hr"></v-time-picker>
                            <p class="text-xs-center">{{ time }}</p>
                        </v-flex>
                    </v-layout>
                </v-flex>           
            </v-layout>
            <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                    <v-btn :disabled="!formIsValid"      
                    type="submit"
                    class="primary">
                        Create Meetup
                    </v-btn>
                    <v-btn class="primary">
                        Clear
                    </v-btn>                
                    <p>{{parsedDateTime}}</p>
                </v-flex>
            </v-layout>
        </v-form>
    </v-container>
</template>

<script>
export default {
    data () {
        return {
            title: '',
            location: '',
            imageUrl: '',
            description: '',             
            date: null,              
            time: new Date(),          
        }
    },
    computed: {
        formIsValid () { 
            return this.title !== '' &&
                this.location !== '' &&
                this.imageUrl !== '' &&
                this.description !== ''
        },
        parsedDateTime () {       
            let date

            if (!this.date) {
                date = new Date()
            } else {
                date = new Date(this.date)
                date.setDate(date.getUTCDate())                
            }

            if(typeof this.time === 'string'){
                let hours = this.time.match(/^(\d+)/)[1]
                let minutes = this.time.match(/:(\d+)/)[1]
                date.setHours(hours)
                date.setMinutes(minutes)
            } else {
                date.setHours(this.time.getHours())                
                date.setMinutes(this.time.getMinutes())
            }
            
            console.log(date);
            return date;
        },
    },


    methods: {
        clear(){
            this.$refs.form.reset();
        },
        onCreateMeetup () {
            if(!this.formIsValid){
                return
            }
            const meetupData = {
                title: this.title,
                location: this.location,
                imageUrl: this.imageUrl,
                description: this.description,
                date: this.parsedDateTime
            }
            this.$store.dispatch('createMeetup', meetupData)            
            this.$router.push('/meetups')
        }
    }
}
</script>
