# Apple Interactive Websites
![](https://img.shields.io/badge/-HTML5-F1662B)
![](https://img.shields.io/badge/-CSS3-2FA9DC)
![](https://img.shields.io/badge/-JavaScript-E3A127)  

`애플 인터렉티브 웹사이트 클론입니다.`  

## ✨ Preview
![preview](https://user-images.githubusercontent.com/74370531/109702308-65bcf700-7bd7-11eb-812b-bdd949b3e52f.gif)  

## 🔎 Description of function in file
* 📄 main.js
  * sceneInfo : 섹션 선언 (배열)
  * checkMenu() : Navbar
  * setCanvasImages() : canvas 이미지 세팅 (스크롤 위치에 따라 보이는 이미지 바뀐다.)
```js
for(let i = 0; i < sceneInfo[0].values.videoImageCount; i++){ // 이미지 갯수만큼 반복
  imgElem = document.createElement('img'); // 이미지 요소 추가
  imgElem.src =`../video/001/IMG_${6726+i}.JPG`; // 이미지 주소
  sceneInfo[0].objs.videoImages.push(imgElem); // canvas 이미지 배열에 이미지 push
}
```
  * setLayout() : 섹션 스크롤 높이 세팅
```js
for(let i = 0; i < sceneInfo.length; i++){
  // 각 섹션 스크롤 높이 = heightNum * 윈도우 창 높이
  sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
  // 각 섹션에 스크롤 높이 세팅
  sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
}
```
  * calcValues() : (스크롤 위치에 따른) 애니메이션 계산(식)
  * playAnimation() : 섹션 별 애니메이션 설정
```js
objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset); // A 컨텐츠에 opacity in css 애니메이션 계산-적용 ↔ 현재 섹션 내 스크롤 높이
objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`; // A 컨텐츠에 translateY in css 애니메이션 계산-적용 ↔ 현재 섹션 내 스크롤 높이
```
  * scrollLoop() : 현재 들어온(화면에 있는) 섹션만 활성화
```js
if(delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){ // 현재 스크롤 위치가 (이전 섹션들의 스크롤 높이 합 + 현재 섹션 스크롤 높이)보다 크면
  enterNewScene = true;
  currentScene++; // 현재 활성화된 섹션 다음으로 넘어감
  document.body.setAttribute('id', `show-scene-${currentScene}`); // body에 id(현재 활성화된 씬 연결) 추가
}
if(delayedYOffset < prevScrollHeight) { // 현재 스크롤 위치가 이전 섹션들의 스크롤 높이 합보다 작으면
  enterNewScene = true;
  if(currentScene === 0){ // 현재 활성화 섹션 0이면
    return; // 걍 리턴함 (에러 방지)
  }
  currentScene--; // 현재 활성화된 섹션 이전으로 넘어감
  document.body.setAttribute('id', `show-scene-${currentScene}`); // body에 id(현재 활성화된 씬 연결) 추가
}
```
  * loop() : canvas requestAnimationFrame

## 👤 Author
**Yujin Hong**
* Email : hongyujin0216@gmail.com
* Github : [@devjindev](https://github.com/devjindev)
* Blog : [진개발연구소](https://devjindev.tistory.com/)  

## 📝 License
[MIT](https://github.com/devjindev/apple-interactive-site/blob/master/License) © Yujin Hong  

.  

.  

.  

##### 본 프로젝트는 <인프런 - '애플 웹사이트 인터렉션 클론!'> 을 참고하여 제작하였습니다.
