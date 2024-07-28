<template>
<h6 class="typing" ref="typrRef">持续构建和迁移中......</h6>
</template>
<script setup>
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import {ref,onMounted} from 'vue'
gsap.registerPlugin(TextPlugin);
const typrRef=ref(null)
let timePerCharacter =0.2
onMounted(()=>{
    gsap.from(typrRef.value, { text: "", duration: typrRef.value.innerHTML.length * timePerCharacter, ease: "none" });
})
</script>