<template>
    <h1>{{ msg }}</h1>
    <button @click="count++">count is: {{ count }}</button>
    <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
    <h2>title:{{ title }}</h2>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
export default {
    name: 'HelloWorld',
    props: {
        msg: String,
        title: String,
    },
    data() {
        return {
            count: 0,
        };
    },
    setup() {
        const a = ref(10);

        onMounted(() => {
            a.value++;
        });

        watch(a, (v, oVal) => {
            console.log(a, v, oVal);
        });
        return { a };
    },
};
</script>
