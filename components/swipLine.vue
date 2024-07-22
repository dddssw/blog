<template>
    <div class="string" ref="stringRef">
        <svg style="width: 100%;height: 300;">
            <path :d="generatePath()" stroke="black" fill="transparent" />
        </svg>
    </div>
</template>
<script setup lang="ts">
import { onMounted,ref} from "vue";
import gsap from 'gsap'
const width = ref(0)
const stringRef = ref(null)
onMounted(()=>{
    const mainRef = document.querySelector('.main');
    const rect = mainRef.getBoundingClientRect();
     width.value = rect.width;

     stringRef.value.addEventListener('mousemove', onMouseMove)
     stringRef.value.addEventListener('mouseleave', onMouseLeave)
})
function generatePath() {
    return `M 10 100 Q ${width.value/2} 100 ${width.value} 100`;
}
function onMouseMove(e){
    const path = `M 10 100 Q ${width.value / 2} ${e.layerY} ${width.value} 100`
    gsap.to('svg path',{
        attr:{d:path},
        duration:0.2,
        ease:"power3.out"
    })
}
function onMouseLeave(e){
    const path = `M 10 100 Q ${width.value / 2} 100 ${width.value} 100`
    gsap.to('svg path',{
        attr:{d:path},
        duration:1.5,
        ease: "elastic.out(1,0.2)"
    })
}
</script>
<style>

</style>