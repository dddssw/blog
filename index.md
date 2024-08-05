---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "dddssw'blog"
  text: "Keeping search"
  tagline: Powered by Vitepress，Vue，Gsap，Canvas,Integrating Algolia, and so on ...
  image:
    src: images.jfif
    alt: VitePress
---

<types></types>
<swipLine style="z-index:10"></swipLine>

<div style="padding:0 160px" class="wrapper1">
<div class="item" ref="list" :data-index="index" v-for="({text,bgcolor},index) in data" :style="{backgroundColor:bgcolor}" @click="open(index)">{{text}}<span ref="fill" :style="{ border: `2px solid ${bgcolor}` }"class="fill" ></span></div>
<div class="place"></div>
</div>
<scrollBg></scrollBg>
<!-- <div class="container1">
    </div>
<video class="video" muted src="/output.mp4" controls preload></video> -->

<style scoped>
  .wrapper1{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 50px;
  justify-items: center ;
  align-items:  center ;
  position: relative;
  z-index:999;
  opacity:0.8
  }
.item{
  font-size:30px;
  border-radius:8px;
  height:100px;
  width:100px;
  text-align:center;
  line-height:100px;
  position:relative;
}

.place{
  position:absolute;
  left:0;
  top:0
}
.move{
  width:100px;
  height:100px;
  border-radius:50%;
  margin-bottom:20px
}
.fill{
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  border-radius:50%;
}
.container1{
  width:100%;
  height:1000vh
}
.video{
  z-index:-1;
  opacity:0;
  width:100%;
  /* height:100vh; */
   position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%);
     transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
}

</style>
<script setup>
import {gsap} from 'gsap'
import  Flip from "gsap/dist/Flip";
import  ScrollTrigger from "gsap/dist/ScrollTrigger";
import swipLine from './components/swipLine.vue'
import types from './components/types.vue'
import scrollBg from './components/scrollBg.vue'
import {onMounted,ref} from 'vue'

gsap.registerPlugin(Flip);
gsap.registerPlugin(ScrollTrigger) 

const data = ref([
 {text:'HTML', bgcolor:'#ceead6'},
  {text:'CSS', bgcolor:'#d2e3fc'},
  {text:'SCSS', bgcolor:'#FFFACD'},
  {text:'JS', bgcolor:'#ffefc3'},
  {text:'Ts', bgcolor:'#87CEEB'},
  {text:'Vue', bgcolor:'#98FB98'},
  {text:'React', bgcolor:'#FFDAB9'},
  {text:'Node', bgcolor:'#E6E6FA'},
  {text:'工程化', bgcolor:'#DAA520'},
  {text:'git', bgcolor:'#00FFFF'},
  // {text:'browerR', bgcolor:'#FF7F50'},
  // {text:'browerD', bgcolor:'#708090'},
  // {text:'vscode extension', bgcolor:'#FFF0F5'},
])
const list = ref(null)
const fill = ref(null)
const flag = ref(false)
let place
let effect

function open(index){
  if(list.value[index].parentNode!==place ){
  const state = Flip.getState(list.value,{
  props: "borderRadius",
});
place.append(list.value[index])
list.value[index].classList.add('move');
Flip.from(state, {
  duration: 1,
  ease: "back.inOut",
  absolute: true,
});
 }else{
    const state = Flip.getState(list.value,{
  props: "borderRadius",
});

const wrapper1 = document.querySelector('.wrapper1');
const children = wrapper1.children;


for (let i = 0; i < children.length; i++) {
  const child = children[i];
  // 假设每个子元素都有 dataset.index 属性
  const childIndex = child.dataset.index;

  if (index < childIndex) {
    child.before(list.value[index]);
    break; // 插入后跳出循环
  }
}

list.value[index].classList.remove('move');
Flip.from(state, {
  duration: 1,
  ease: "power2.inOut",
  absolute: true,
});
 }
}
 function fadeInImage(img) {
  consoel.log('sss')
    img.style.opacity = '0.8';
  }

onMounted(()=>{
place = document.querySelector('.place')
gsap.from('.item',{
   scrollTrigger: {
    trigger: '.wrapper1',
   },
  opacity:0,
  rotate:360,
  scale: 0.1,
  ease: "power1.inOut",
  duration:1,
  stagger:0.2,
}) 
// 假设你的 list.value 是一个包含需要处理的元素的数组或类数组对象
list.value.forEach((item) => {
  item.addEventListener('mouseenter', function() {
    const fill = item.querySelector('span');
    gsap.set(fill, {
      scale: 1.5,
      opacity: 1,
    });
    const effect = gsap.to(fill, {
      scale: 2,
      repeat: -1,
      opacity: 0.5,
      duration: 2,
      border:1,
      borderRadius:6,
      yoyo: true,
    });
    item._gsapEffect = effect; // 将 effect 存储在元素上，以便后续访问和控制
  });

  item.addEventListener('mouseleave', function() {
    const fill = item.querySelector('span');
    const effect = item._gsapEffect; // 获取存储在元素上的效果
    if (effect) {
      effect.kill(); // 结束动画效果
    }
    gsap.to(fill, {
      scale: 1,
      opacity: 1,
      duration: 2,
       border:2,
borderRadius:50,
    });
  });
});

// const video = document.querySelector('.video')

//  video.addEventListener("loadedmetadata", () => {
//    video.style.opacity = '0.8';
//    gsap.to(
//       '.video',
//       {
      
//          scrollTrigger: {
//       trigger: ".container1",
//       start: "top top",
//       end: "bottom bottom",
//     //  scrub: true,
//       anticipatePin:1,
//   onUpdate: (self) => {
//     window.requestAnimationFrame(()=>{

//       videoGurrentTime('.video', self.progress.toFixed(3), self.direction)
//     })
//   }
//      // markers: true,
//     }
//       }
//     );

//  })

})

function videoGurrentTime(elem, progress) {
  let videoEl = document.querySelector(elem)
  let videoTime = 11; //引入视频的时间，此完整视频全长为6s
  console.log(progress * videoTime)
  videoEl.currentTime = progress * videoTime
}



</script>
