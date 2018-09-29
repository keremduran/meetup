<template>
    <v-app>
        <v-navigation-drawer absolute temporary v-model="sideNav">
            <v-list>
                <v-list-tile
                    v-for="item in menuItems"
                    :key="item.title"
                    :to="item.link">
                    <v-list-tile-action>
                        <v-icon>
                            {{ item.icon }}
                        </v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        {{ item.title }}
                    </v-list-tile-content>    
                </v-list-tile>
                <v-list-tile v-if="userSignedIn" @click="onLogout">
                    <v-list-tile-action>
                        <v-icon>
                            exit_to_app
                        </v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        Logout
                    </v-list-tile-content>    
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar dark class="primary">             
            <v-toolbar-side-icon
                class="hidden-sm-and-up"
                @click.stop="sideNav = !sideNav">
            </v-toolbar-side-icon>     
            <v-toolbar-title class="px-1 mx-1">
                <router-link 
                    :to="{name: 'Home'}"
                    tag="span" style="curl"
                    :style="{cursor: 'pointer'}">
                    <i class="hidden-sm-and-down">BamBamMeetup</i>
                    <i class="hidden-md-and-up"><b>BBM</b></i>
                </router-link>
            </v-toolbar-title>                         
            <v-spacer></v-spacer>        
            <v-toolbar-items class= "hidden-xs-only">     
                <v-btn
                    flat
                    v-for="item in menuItems"
                    :key="item.title"
                    :to="item.link"
                    class="text-capitalize">
                    <v-icon dark left>{{ item.icon }}</v-icon>
					<span class="hidden-sm-and-down">{{ item.title }}</span>
					<span class="hidden-md-and-up">{{ item.titleSM }}</span>
                </v-btn>
                <v-btn 
                    flat
                    v-if="userSignedIn"
                    :to="{name: 'Signin'}"
                    @click="onLogout"
                    class="text-capitalize">
                    <v-icon dark left >exit_to_app</v-icon>	
                    Logout
                </v-btn>                
            </v-toolbar-items>
        </v-toolbar>
        <main>
            <router-view></router-view>
        </main>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            sideNav: false
        };
    },
    name: "App",
    computed: {
        menuItems() {
            let menuItems = [
                { 
                    icon: "face", 
					title: "Sign Up",
					titleSM: "Sign Up",
                    link: {name: 'Signup'} 
                },
                { 
                    icon: "lock_open", 
					title: "Sign In",
					titleSM: "Sign In", 
                    link: {name: 'Signin'} 
                }
            ];
            if (this.userSignedIn) {
                menuItems = [
                    {
                        icon: "supervisor_account",
						title: "Explore Meetups",
						titleSM: "Explore",
                        link: {name: 'Meetups'}
                    },
                    {
                        icon: "room",
						title: "Organize Meetup",
						titleSM: "Organize",
                        link: {name: 'CreateMeetup'}
                    },
                    {
                        icon: "person",
						title: "Profile",
						titleSM: "Profile",
                        link: {name: 'Profile'}
                    },
                ];
            }
            return menuItems;
        },
        userSignedIn() {
            return (
                this.$store.getters.user !== null &&
                this.$store.getters.user !== undefined
            );
        }
    },
    methods: {
        onLogout() {
            this.$store.dispatch("logUserOut");
        }
    }
};
</script>

