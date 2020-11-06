<template>
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld :title="title" msg="Hello Vue 3.0 + Vite2222" />
    <button @click="changeTitle">click me</button>
</template>

<script>
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default {
    name: 'App',
    data() {
        return {
            a: 1,
            title: '111',
        };
    },
    setup() {
        // const title = ref(new Date().toLocaleTimeString());
        // return { title };
    },
    components: {
        HelloWorld,
    },
    methods: {
        changeTitle() {
            this.title = new Date().toLocaleTimeString();
        },
    },
};
</script>
