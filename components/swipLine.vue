<template>
    <div class="string" ref="stringRef">
        <svg style="height: 300;" class="lineSvg">
            <path :d="generatePath()" stroke="black" fill="transparent" />
        </svg>
    </div>
</template>
<script setup lang="ts">
import { onMounted,ref} from "vue";
import {gsap} from 'gsap'
const width = ref(0)
const stringRef = ref<HTMLDivElement|null>(null)
onMounted(()=>{
    if (!stringRef.value) return
    const innerWidth = (window.innerWidth-128) * 0.7
    console.log(innerWidth)
    document.querySelector('.lineSvg')!.setAttribute('width', innerWidth+'px')  
    width.value = innerWidth

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