---
layout: doc
outline: deep
---
## LCP(Largest Contentful Paint)

LCP 会报告视口中可见的最大图片或文本块的呈现时间

对于视频会判断封面时间和第一帧呈现时间中较短的为准

## CLS(Cumulative Layout Shift)
衡量页面整个生命周期中不符合预期的布局偏移

## INP(Interaction to Next Paint)
评估网页对用户互动的总体响应情况。最终 INP 值是观测到的最长互动时间

## TTFB(加载第一个字节所需时间)
用于衡量从请求资源到响应的第一个字节开始到达的时间点之间的时长

## FCP(First Contentful Paint)
衡量从用户首次导航到网页到网页内容的任何部分在屏幕上呈现的时间

## TBT(Total Blocking Time) 
衡量在 First Contentful Paint (FCP) 之后主线程被阻塞的时间足以阻止输入响应的总时间

主线程“阻塞”因为浏览器无法中断正在进行的任务。因此，如果用户在长时间运行的任务过程中与页面交互，浏览器必须等待任务完成后才能响应。

如果任务时间足够长（超过 50 毫秒），用户很可能会注意到延迟，并认为网页运行缓慢或已损坏。

