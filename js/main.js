'use strict';

// 전역 변수 사용 피하기 위해 전체 틀 함수 생성 // 함수 바로 호출
(() => {
    //! 변수 선언> collection
    //* scrollLoop()
    let yOffset = 0; // yOffset // window.pageYOffset 대입
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 섹션들의 스크롤 높이의 합
    let currentScene = 0; // 현재 활성화된 섹션
    let enterNewScene = false; // 새로운 섹션에 들어간 순간 true
    //* loop()
    //? canvas raf
    let acc = 0.1; // 가속도
    let delayedYOffset = 0; // 증가되기 전 위치
    let rafId; // requestAnimationFrame() id
    let rafState; // requestAnimationFrame() 상태

    //! 변수 선언> 각 섹션 모두 선언 // 배열
    const sceneInfo = [
        //* #scroll-section-0
        {
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0, // 각 섹션 스크롤 높이 // 기기마다 유동적
            objs:{ //* 섹션, 섹션 안 컨텐츠 객체 // 각 섹션 + 각 섹션 안 컨텐츠 가져오기
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 > p:nth-of-type(1)'),
                messageB: document.querySelector('#scroll-section-0 > p:nth-of-type(2)'),
                messageC: document.querySelector('#scroll-section-0 > p:nth-of-type(3)'),
                messageD: document.querySelector('#scroll-section-0 > p:nth-of-type(4)'),
                canvas: document.querySelector('#scroll-section-0 .sticky-elem-canvas canvas'), // canvas
                context: document.querySelector('#scroll-section-0 .sticky-elem-canvas canvas').getContext('2d'), // canvas 내용(이미지)
                videoImages: [] // canvas 이미지 (담아둘) 배열
            },
            values:{ //* 섹션 안 컨텐츠 값 객체 // 각 섹션 안 컨텐츠 값 설정
                //? canvas
                videoImageCount: 300, // 이미지 갯수
                imgSequence: [0,299], // 이미지 순서
                canvas_opacity: [1, 0, { start: 0.9, end: 1 }], // canvas opacity

                //? 컨텐츠 들어올 때 (나타날 때)
                //? opacity
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], // 초기값, 최종값, 시작 timing, 끝 timing // 구간 10~20%
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                //? translateY
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }], // 구간 10~20%
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                //? 컨텐츠 나갈 때 (사라질 때)
                //? opacity
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }], // 구간 25~30%
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                //? translateY
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }], // 구간 25~30%
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
            }
        },

        //* #scroll-section-1
        {
            type: 'normal',
            heightNum: 1.5, // normal에서는 필요 X
            scrollHeight: 0,
            objs: { // 섹션, 섹션 안 컨텐츠 객체 // 각 섹션 + 각 섹션 안 컨텐츠 가져오기
                container: document.querySelector('#scroll-section-1'),
                content: document.querySelector('#scroll-section-1 > p')
            }
        },

        //* #scroll-section-2
        {
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: { // 섹션, 섹션 안 컨텐츠 객체 // 각 섹션 + 각 섹션 안 컨텐츠 가져오기
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 > p:nth-of-type(1)'),
                messageB: document.querySelector('#scroll-section-2 > p:nth-of-type(2)'),
                messageC: document.querySelector('#scroll-section-2 > p:nth-of-type(3)'),
                pinB: document.querySelector('#scroll-section-2 > p:nth-of-type(2) span'),
                pinC: document.querySelector('#scroll-section-2 > p:nth-of-type(3) span'),
                canvas: document.querySelector('#scroll-section-2 .sticky-elem-canvas canvas'), // canvas
                context: document.querySelector('#scroll-section-2 .sticky-elem-canvas canvas').getContext('2d'), // canvas 내용(이미지)
                videoImages: [] // canvas 이미지 (담아둘) 배열
            },
            values: { // 섹션 안 컨텐츠 값 객체 // 각 섹션 안 컨텐츠 값 설정
                //? canvas
                videoImageCount: 960, // 이미지 갯수
                imgSequence: [0,959], // 이미지 순서
                canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }], // canvas opacity in
                canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }], // canvas opacity out

                //? 컨텐츠 들어올 때 (나타날 때)
                //? opacity
                messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
                messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
                messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
                //? translateY
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
                messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
                //? 컨텐츠 나갈 때 (사라질 때)
                //? opacity
                messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
                messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
                messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                //? translateY
                messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
                messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
                messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],

                //? span
                pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
                pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
            }
        },

        //* #scroll-section-3
        {
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: { // 섹션, 섹션 안 컨텐츠 객체 // 각 섹션 + 각 섹션 안 컨텐츠 가져오기
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('#scroll-section-3 > p:nth-of-type(2)'),
                canvas: document.querySelector('#scroll-section-3 > canvas'), // canvas
                context: document.querySelector('#scroll-section-3 > canvas').getContext('2d'), // canvas 내용(이미지)
                imagesPath: [ // 이미지 경로
                    '../images/blend-image-1.jpg',
					'../images/blend-image-2.jpg'
                ],
                images: [] // canvas 이미지 (담아둘) 배열
            },
            values: { // 섹션 안 컨텐츠 값 객체 // 각 섹션 안 컨텐츠 값 설정
                //? ⬜
                rect1X: [0, 0, { start: 0, end: 0 }], // 왼쪽 흰 박스
                rect2X: [0, 0, { start: 0, end: 0 }], // 오른쪽 흰 박스
                blendHeight: [0, 0, { start: 0, end: 0 }], // images[1] 블렌드 높이
                canvas_scale: [0, 0, { start: 0, end: 0 }], // images[1] 블렌드 후 scale
                canvasCaption_opacity: [0, 1, { start: 0, end: 0}], // p:nth-of-type(2) opacity
                canvasCaption_translateY: [20, 0, { start: 0, end: 0}], // p:nth-of-type(2) translateY
                rectStartY: 0, // 흰박스 시작 y 위치
            }
        }
    ];

    //! 함수 선언> Bottom Navbar sticky
    function checkMenu(){
        const navbar = document.querySelector('nav:last-of-type'); // navbar

        if(yOffset > 44){ // 현재 스크롤 크기가 44(Top navbar 높이)보다 크면
            navbar.classList.add('sticky-nav'); // navbar에 'sticky-nav' class 추가
        }else{ // 그 외면
            navbar.classList.remove('sticky-nav'); // navbar에 'sticky-nav' class 삭제
        }

        // const navbar = document.querySelector('nav'); // navbar
        // const navbarHeignt = navbar.getBoundingClientRect().height; // navbar height

        // document.addEventListener('scroll', () => { // document scroll 하면
        //     if(window.scrollY > navbarHeignt){ // scroll이 navbar height 보다 크면
        //         navbar.classList.add('scrolled'); // navbar에 'scrolled' Class 추가
        //     }else{ // 그 외면
        //         navbar.classList.remove('scrolled'); // navbar에 'scrolled' Class 삭제
        //     }
        // });
    }

    //! 함수 선언> canvas 이미지 세팅 // 스크롤 위치에 따라 보이는 이미지 바뀜
    function setCanvasImages(){
        //* #scroll-section-0
        let imgElem;
        for(let i = 0; i < sceneInfo[0].values.videoImageCount; i++){ // 이미지 갯수만큼 반복
            imgElem = document.createElement('img'); // 이미지 요소 추가
            imgElem.src =`../video/001/IMG_${6726+i}.JPG`; // 이미지 주소
            sceneInfo[0].objs.videoImages.push(imgElem); // canvas 이미지 배열에 이미지 push
        }

        //* #scroll-section-2
        let imgElem2;
        for(let i = 0; i < sceneInfo[2].values.videoImageCount; i++){ // 이미지 갯수만큼 반복
            imgElem2 = document.createElement('img'); // 이미지 요소 추가
            imgElem2.src =`../video/002/IMG_${7027+i}.JPG`; // 이미지 주소
            sceneInfo[2].objs.videoImages.push(imgElem2); // canvas 이미지 배열에 이미지 push
        }

        //* #scroll-section-3
        let imgElem3;
		for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) { // 이미지 갯수만큼 반복
			imgElem3 = document.createElement('img'); // 이미지 요소 추가
			imgElem3.src = sceneInfo[3].objs.imagesPath[i]; // 이미지 주소
			sceneInfo[3].objs.images.push(imgElem3); // canvas 이미지 배열에 이미지 push
		}
    }

    //! 함수 선언> 각 섹션 스크롤 높이 세팅
    function setLayout(){
        for(let i = 0; i < sceneInfo.length; i++){
            // 각 섹션 스크롤 높이 = heightNum * 윈도우 창 높이
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            // 각 섹션에 스크롤 높이 세팅
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        /*
        for(let i = 0; i < sceneInfo.length; i++){
            if(sceneInfo[i].type === 'sticky'){
                // 각 섹션 스크롤 높이 = heightNum * 윈도우 창 높이
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            }else if(sceneInfo[i].type === 'normal'){
                // 각 섹션 스크롤 높이 = 섹션 본래 높이
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.of;
            }
            // 각 섹션에 스크롤 높이 세팅
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        */
        
        //? 새로고침해도 현재 섹션 id 유지
        let totalScrollHeight = 0; // 총 스크롤 위치(높이)
        for(let i = 0; i< sceneInfo.length; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight; // 총 스크롤 위치(높이) = 총 스크롤 위치 + 이전 섹션 스크롤 높이
            if(totalScrollHeight >= yOffset){ // 총 스크롤 위치가 현재 스크롤 위치보다 크거나 같으면
                currentScene = i; // 현재 섹션 = i
                break; // 반복문 빠져나감
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`); // body에 id(현재 활성화된 씬 연결) 추가

        //? canvas
        // 섹션 높이에 맞춰 캔버스 높이 조절
        const heightRatio = window.innerHeight / 1080; // canvas 높이 비율 = 윈도우 창 크기 / 원래 캔버스 높이
		sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`; // canvas에 translate3d, scale css 적용
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`; // canvas에 translate3d, scale css 적용
    }

    //! 함수 선언> 스크롤 시 애니메이션(각 섹션 안 컨텐츠 값) 애니메이션 계산
    function calcValues(values, currentYOffset){
        let rv; // return value
        const scrollHeight = sceneInfo[currentScene].scrollHeight; // 현재 색션 스크롤 높이
        const scrollRatio = currentYOffset / scrollHeight; // 현재 섹션에서 스크롤된 범위의 비율 = 현재 섹션의 처음에서 얼만큼 스크롤 됐냐 / 현재 섹션 스크롤 높이
        
        if(values.length===3){ // start, end 값이 있는 경우 => 컨텐츠
            const partScrollStart = values[2].start * scrollHeight; // 각 컨텐츠 실제 시작점 = 가상 시작점 * 현재 섹션 스크롤 높이 
            const partScrollEnd = values[2].end * scrollHeight; // 각 컨텐츠 실제 끝점 = 가상 끝점 * 현재 섹션 스크롤 높이 
            const partScrollHeight = partScrollEnd - partScrollStart; // 각 컨텐츠 시작~끝 높이
            
            if((currentYOffset >= partScrollStart) && (currentYOffset <=partScrollEnd)){ // 현재 섹션 내 스크롤 위치가 컨텐츠 시작점과 종료점 사이면
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1]-values[0]) + values[0]; // return 값 =
            }else if(currentYOffset < partScrollStart){ // 컨텐츠 시작점 전이면
                rv = values[0]; // return 값 = 시작점으로 맞춰줌
            }else if(currentYOffset > partScrollEnd){ // 컨텐츠 끝점 후면
                rv= values[1]; // return 값 = 끝점으로 맞춰줌
            }
        }else{ // start, end 값이 없는 경우 => 섹션
            rv = (scrollRatio * (values[1]-values[0]) + values[0]); // return 값 = 비율 * (values 처음 값 - values 끝 값) + values 처음 값
        }

        return rv;
    }

    //! ⭐ 함수 선언> 스크롤 시 애니메이션 설정
    function playAnimation(){
        // currentYOffset에 따라 values 달라짐
        const objs = sceneInfo[currentScene].objs; // 각 섹션 + 각 섹션 안 컨텐츠 가져오기
        const values = sceneInfo[currentScene].values; // 각 섹션 안 컨텐츠 값 설정
        const currentYOffset = yOffset - prevScrollHeight; // 현재 섹션의 처음에서 얼만큼 스크롤 됐냐 = 현재 스크롤 위치 - 이전 섹션들 스크롤 높이의 합
        const scrollHeight = sceneInfo[currentScene].scrollHeight; // 현재 색션 스크롤 높이
        const scrollRatio = currentYOffset / scrollHeight; // 현재 섹션에서 스크롤된 범위의 비율 = 현재 섹션의 처음에서 얼만큼 스크롤 됐냐 / 현재 섹션 스크롤 높이
        
        switch(currentScene){ // 현재 활성화 섹션이
            //* #scroll-section-0
            case 0:
                // canvas
                //let sequence = Math.round(calcValues(values.imgSequence, currentYOffset)); // 현재 스크롤 위치에 따라 이미지 순서 적용 // 소수 -> 정수 반올림
                //objs.context.drawImage(objs.videoImages[sequence], 0, 0); // canvas 이미지 (이미지 배열 안에 들어 있는 이미지로) 그림
                // todo. canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset); // canvas에 opacity css 애니메이션 계산-적용 ↔ 현재 섹션 내 스크롤 높이
                
                //? opacity, translateY
                if(scrollRatio <= 0.22){ // 현재 섹션 내 스크롤 범위 비율이 컨텐츠 시작점 사이면
                    // in
                    // todo. messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                    // todo. messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset); // A 컨텐츠에 opacity in css 애니메이션 계산-적용 ↔ 현재 섹션 내 스크롤 높이
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`; // A 컨텐츠에 translateY in css 애니메이션 계산-적용 ↔ 현재 섹션 내 스크롤 높이
                }else{ // 현재 섹션 내 스크롤 범위 비율이 컨텐츠 끝점 사이면
                    // out
                    // todo. messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                    // todo. messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset); // A 컨텐츠에 opacity out css 애니메이션 계산-적용 ↔ 현재 섹션 내 스크롤 높이
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`; // A 컨텐츠에 translateY out css 애니메이션 계산-적용 ↔ 현재 섹션 내 스크롤 높이
                }
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }

                break;
            
            //* #scroll-section-1
            //case 1: // normal에서는 필요 X
            
            //* #scroll-section-2
            case 2:
                //* canvas
                //let sequence2 = Math.round(calcValues(values.imgSequence, currentYOffset)); // 현재 스크롤 위치에 따라 이미지 순서 적용 // 소수 -> 정수 반올림
                //objs.context.drawImage(objs.videoImages[sequence2], 0, 0); // canvas 이미지 (이미지 배열 안에 들어 있는 이미지로) 그림
                
                //? 캔버스 opacity
                if(scrollRatio <= 0.5){ // 현재 섹션 내 스크롤 범위 비율이 컨텐츠 시작점과 끝점 사이면
                    // in
                    // todo. canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset); // canvas에 opacity in css 애니메이션 계산-적용 ↔ 현재 섹션 내 스크롤 높이
                }else{
                    // out
                    // todo. canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }], // canvas opacity out
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset); // canvas에 opacity out css 애니메이션 계산-적용 ↔ 현재 섹션 내 스크롤 높이
                }

                // *p
                //? p opacity, transform
                if (scrollRatio <= 0.32) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                // * span
                //? span opacity, transform
                // todo. pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
                if (scrollRatio <= 0.67) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }
                // todo. pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
                if (scrollRatio <= 0.93) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }

                //? #scroll-section-3 미리 그려줌 (걍 가만히 올라오는 상태(애니메이션 X))
                if(scrollRatio > 0.9){ // #scroll-section-2 끝날 때쯤
                    const objs = sceneInfo[3].objs; // objs 객체 다시 선언
                    const values = sceneInfo[3].values; // valus 객체 다시 선언

                    // 가로-세로 모두 꽉 차게 하기 위해 세팅(애니메이션 계산 필요)
                    const widthRatio = window.innerWidth / objs.canvas.width; // 캔버스 너비 비율 = 윈도우 창 너비 / 캔버스 너비
                    const heightRatio = window.innerHeight / objs.canvas.height; // 캔버스 높이 비율 = 윈도우 창 높이 / 캔버스 높이
                    let canvasScaleRatio; // 캔버스 확대 비율

                    if (widthRatio <= heightRatio) { // 높이 비율이 너비 비율보다 크거나 같으면
                        canvasScaleRatio = heightRatio; // 캔버스 확대 비율 = 높이 비율
                    } else { // 그 외면 (너비 비율이 높이 비율보다 크면)
                        canvasScaleRatio = widthRatio; // 캔버스 확대 비율 = 너비비율
                    }

                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`; // canvas에 scale css 적용 // 💖
                    objs.context.drawImage(objs.images[0], 0, 0); // 첫 번째 canvas 이미지 그림
                    objs.context.fillStyle = 'white';

                    // ⬜
                    // 캔버스 내 innerWidth와 innerHeight (양옆 흰 박스를 위해 캔버스 크기 재애니메이션 계산)
                    const recalculatedInnerWidth = window.innerWidth / canvasScaleRatio; // 캔버스 너비 = 윈도우(스크롤 너비 제외) 창 너비 / 캔버스 확대 비율 // 💖
                    const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio; // 캔버스 높이 = 윈도우 창 높이 / 캔버스 확대 비율
                    
                    // 흰박스 위치 및 크기 애니메이션 계산
                    const whiteRectWidth = recalculatedInnerWidth * 0.15; // 양옆 흰박스 너비(크기) = 재너비 비율의 15%
                    values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2; // 왼쪽 흰박스 시작 timing
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth; // 왼쪽 흰박스 최종위치 (밀려날 때)
                    values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth; // 오른쪽 흰박스 시작 timing
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth; // 오른쪽 흰박스 최종위치 (밀려날 때)
                    
                    // 흰박스 위치 및 크기 세팅(그리기)
                    //objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height); // 왼쪽 // x, y, width, height
                    //objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height); // 오른쪽 // x, y, width, height
                    objs.context.fillRect( // 왼쪽 흰박스
                        parseInt(values.rect1X[0]), // x // 시작점
                        0, // y
                        parseInt(whiteRectWidth), // width
                        objs.canvas.height // height
                    );
                    objs.context.fillRect( // 오른쪽 흰박스
                        parseInt(values.rect2X[0]), // x // 시작점
                        0, // y
                        parseInt(whiteRectWidth), // width
                        objs.canvas.height // height
                    );
                }

                break;
            
            //* #scroll-section-3
            case 3:
                let step = 0 ; // 캔버스가 브라우저 상단에 닿았나 안 닿았나 구분
                // 가로-세로 모두 꽉 차게 하기 위해 세팅(애니메이션 계산 필요)
                const widthRatio = window.innerWidth / objs.canvas.width; // 캔버스 너비 비율 = 윈도우 창 너비 / 캔버스 너비
                const heightRatio = window.innerHeight / objs.canvas.height; // 캔버스 높이 비율 = 윈도우 창 높이 / 캔버스 높이
                let canvasScaleRatio; // 캔버스 확대 비율

                //* image[0]
                //? 캔버스 scale
                if (widthRatio <= heightRatio) { // 높이 비율이 너비 비율보다 크거나 같으면
                    canvasScaleRatio = heightRatio; // 캔버스 확대 비율 = 높이 비율
                } else { // 그 외면 (너비 비율이 높이 비율보다 크면)
                    canvasScaleRatio = widthRatio; // 캔버스 확대 비율 = 너비비율
                }

                objs.canvas.style.transform = `scale(${canvasScaleRatio})`; // canvas에 scale css 적용 // 💖
                objs.context.drawImage(objs.images[0], 0, 0); // 첫 번째 canvas 이미지 그림
                objs.context.fillStyle = 'white';

                //? ⬜
                // 캔버스 내 innerWidth와 innerHeight (양옆 흰 박스를 위해 캔버스 크기 재애니메이션 계산)
                const recalculatedInnerWidth = window.innerWidth / canvasScaleRatio; // 캔버스 너비 = 윈도우(스크롤 너비 제외) 창 너비 / 캔버스 확대 비율 // 💖
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio; // 캔버스 높이 = 윈도우 창 높이 / 캔버스 확대 비율

                // todo rect1X: [0, 0, { start: 0, end: 0 }], // 왼쪽 흰 박스
                // todo rect2X: [0, 0, { start: 0, end: 0 }], // 오른쪽 흰 박스
                //? 맨 처음 흰박스 y 위치 (맨 처음만 실행됨)
                if (!values.rectStartY) { // rectStartY가 값이 없으면 (0이면)
                    // values.rectStartY = objs.canvas.getBoundingClientRect().top; // 흰박스 시작 y 위치 = 캔버스 top 위치
                    // 흰박스 시작 y 위치 = 원래 캔버스 top 위치 + ((원래 캔버스 높이 - 재애니메이션 계산 캔버스 높이)/2)
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight; // 왼쪽 흰박스 (애니메이션) 시작 timing = (윈도우 창 높이/2) / 현재 섹션 높이
                    values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight; // 오른쪽 흰박스 (애니메이션) 시작 timing = (윈도우 창 높이/2) / 현재 섹션 높이
                    values.rect1X[2].end = values.rectStartY / scrollHeight; // 왼쪽 흰박스 (애니메이션) 최종위치 = 흰박스 시작 y 위치 / 현재 섹션 높이
                    values.rect2X[2].end = values.rectStartY / scrollHeight; // 오른쪽 흰박스 (애니메이션) 최종위치 = 흰박스 시작 y 위치 / 현재 섹션 높이
                }
                
                //? 흰박스 위치 및 크기 애니메이션 계산
                const whiteRectWidth = recalculatedInnerWidth * 0.15; // 양옆 흰박스 너비(크기) = 재너비 비율의 15%
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2; // 왼쪽 흰박스 시작 timing
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth; // 왼쪽 흰박스 최종위치 (밀려날 때)
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth; // 오른쪽 흰박스 시작 timing
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth; // 오른쪽 흰박스 최종위치 (밀려날 때)
                
                //? 흰박스 위치 및 크기 세팅(그리기)
                //objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height); // 왼쪽 // x, y, width, height
                //objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height); // 오른쪽 // x, y, width, height
                objs.context.fillRect( // 왼쪽 흰박스
                    parseInt(calcValues(values.rect1X, currentYOffset)), // x 애니메이션 계산 // 왼쪽 흰박스 ↔ 현재 섹션 내 스크롤 높이
                    0, // y
                    parseInt(whiteRectWidth), // width
                    objs.canvas.height // height
                );
                objs.context.fillRect( // 오른쪽 흰박스
                    parseInt(calcValues(values.rect2X, currentYOffset)), // x 애니메이션 계산 // 오른쪽 흰박스 ↔ 현재 섹션 내 스크롤 높이
                    0, // y
                    parseInt(whiteRectWidth), // width
                    objs.canvas.height // height
                );

                //* image[1]
                if(scrollRatio < values.rect1X[2].end){ // 캔버스가 브라우저 상단에 닿지 않았다면 // 현재 섹션 내 스크롤 크기가 흰박스 끝 timing보다 크면
                    step = 1;
                    objs.canvas.classList.remove('sticky-canvas'); // 캔버스에 'sticky-canvas' class 삭제
                }else{ // 그 외면 (캔버스가 브라우저 상단에 닿았으면)
                    step = 2;
                    
                    //? image[1] 블렌드
                    // todo. blendHeight: [0, 0, { start: 0, end: 0 }],
                    values.blendHeight[0] = 0; // 블렌드 초기값
                    values.blendHeight[1] = objs.canvas.height; // 블렌드 끝 값 // 캔버스 높이
                    values.blendHeight[2].start = values.rect1X[2].end; // 이미지2 블렌드 시작 timing = 흰박스(이미지1) 끝 timing
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.2; // 이미지2 블렌드 최종위치 = 이미지2 시작 timing + 스크롤 0.2(20%) // 시작 timing + 스크롤 20% 동안 블렌드됨
                    const blendHeight = calcValues(values.blendHeight, currentYOffset); // 이미지 블렌드 height 애니메이션 계산 ↔ 현재 섹션 내 스크롤 높이

                    objs.context.drawImage(objs.images[1], // 이미지 그림
                        // 원래 이미지에서 어느 부분 그릴거냐 // x, y, width, height
                        0, (objs.canvas.height - blendHeight), objs.canvas.width, blendHeight,
                        // 실제 캔버스에 그리는 이미지(캔버스=이미지이기 때문에 위와 동일) // x, y, width, height
                        0, (objs.canvas.height - blendHeight), objs.canvas.width, blendHeight 
                    );

                    objs.canvas.classList.add('sticky-canvas'); // 캔버스 fixed // 캔버스에 'sticky-canvas' class 추가 
                    objs.canvas.style.top = `${-(objs.canvas.height - (objs.canvas.height * canvasScaleRatio)) / 2}px` // canvas에 top css 적용 // -{(원래 캔버스 높이 - 재애니메이션 계산 캔버스 높이)/2}px

                    //* 블렌드 끝

                    //? images[1] 블렌드 후 scale
                    // todo. canvas_scale: [0, 0, { start: 0, end: 0 }],
                    if(scrollRatio > values.blendHeight[2].end){ // 블렌드가 끝나면 // 현재 섹션 내 스크롤 크기가 블렌드 끝 timing보다 크면
                        values.canvas_scale[0] =  canvasScaleRatio; // 초기값 = 이전에 계산된 캔버스 scale
                        values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width); // 최종값(계산될 scale) = window(스크롤 너비 제외) 창 너비 / (1.5 * 캔버스 너비)
                        values.canvas_scale[2].start = values.blendHeight[2].end; // 시작 timing = 블렌드 끝날 때
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2; // 끝 timing = 시작 timing + 스크롤 0.2(20%) // 시작 timing + 스크롤 20% 동안 스케일 조정함

                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`; // canvas에 scale css 적용 // scale 애니메이션 계산 ↔ 현재 섹션 내 스크롤 높이
                        objs.canvas.style.marginTop = 0;  // canvas에 margin-top css 적용 // (아래 코드에서) 위로 올라갈 때 다시 margin-top 없어줌 (안하면 margin-top 때문에 안보여서)
                    }

                    //* 스케일 끝

                    //? scale 후 p:nth-of-type(2) opasity, translateY
                    // 스케일이 끝나면 // 현재 섹션 내 스크롤 크기가 scale 끝 timing보다 크고
                    // scale 끝 timong이 0보다 크면(끝 timing이 0일 때(아직 scale 동작 X) 동작 방지))
                    if((scrollRatio > values.canvas_scale[2].end) && (values.canvas_scale[2].end > 0)){
                        objs.canvas.classList.remove('sticky-canvas'); // 캔버스에 'sticky-canvas' class 삭제
                        objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;  // canvas에 margin-top css 적용 // 스크롤 20% 동안 블렌드됨 + 스크롤 20% 동안 스케일 조정함 = 40% (스크롤 0.4)
                        
                        //? opacity
                        // todo. canvasCaption_opacity: [0, 1, { start: 0, end: 0}],
                        values.canvasCaption_opacity[2].start = values.canvas_scale[2].end; // p opcity 시작 timing = 캔버스 scale 끝 timing 
                        values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1; // p opacity 끝 timing = p opacticy 시작 타이밍 + 스크롤 0.1(10%)
                        objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset); // p에 opacity css 적용 // opctity 애니메이션 계산 ↔ 현재 섹션 내 스크롤 높이
                        //? translateY
                        // todo. canvasCaption_translateY: [20, 0, { start: 0, end: 0}],
                        values.canvasCaption_translateY[2].start = values.canvas_scale[2].end; // p translateY 시작 timing = 캔버스 scale 끝 timing 
                        values.canvasCaption_translateY[2].end = values.canvasCaption_translateY[2].start + 0.1; // p translateY 끝 timing = p translateY 시작 타이밍 + 스크롤 0.1(10%)
                        objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`; // p에 translateY css 적용 // translateY 애니메이션 계산 ↔ 현재 섹션 내 스크롤 높이
                    }
                }

                break;
        }
    }

    //! 함수 선언> 현재 들어온(화면에 있는) 섹션만 활성화하기
    function scrollLoop(){
        enterNewScene = false; // 새로운 섹션에 들어간 순간 true
        prevScrollHeight = 0; // 0으로 초기화 (누적되지 않게)
        for(let i = 0; i < currentScene; i++) {
            // 현재 섹션 스크롤 위치(높이) = 현재 섹션 스크롤 위치 + 이전 섹션 스크롤 높이
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        
        if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			document.body.classList.remove('scroll-effect-end');
		}

		if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			if (currentScene === sceneInfo.length - 1) {
				document.body.classList.add('scroll-effect-end');
			}
			if (currentScene < sceneInfo.length - 1) {
				currentScene++;
			}
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

        if(delayedYOffset < prevScrollHeight) { // 현재 스크롤 위치가 이전 섹션들의 스크롤 높이 합보다 작으면
            enterNewScene = true;
            if(currentScene === 0){ // 현재 활성화 섹션 0이면
                return; // 걍 리턴함 (에러 방지)
            }
            currentScene--; // 현재 활성화된 섹션 이전으로 넘어감
            document.body.setAttribute('id', `show-scene-${currentScene}`); // body에 id(현재 활성화된 씬 연결) 추가
        }
        if(enterNewScene){ // 새로운 섹션에 들어간 순간이면
            return; // 함수 잠깐 종료 (섹션에 들어간 순간에 잠깐 오류떠서 작성하는거임)
        }

        playAnimation(); // 애니메이션 세팅() 실행
    }

    //! 함수 선언> canvas requestAnimationFrame
    function loop(){
        // 증가되기 전 위치 = 증가되기 전 위치 + ((현재 스크롤 크기(목표값) - 증가되기 전 위치) * 가속도(0.1))
        delayedYOffset = delayedYOffset + ((yOffset - delayedYOffset) * acc);

        if(!enterNewScene){ // 새로운 섹션에 들어간 순간이 아니면
            if(currentScene === 0 || currentScene === 2){ // #scroll-section-1 or 3이면
                const objs = sceneInfo[currentScene].objs; // 각 섹션 + 각 섹션 안 컨텐츠 가져오기
                const values = sceneInfo[currentScene].values; // 각 섹션 안 컨텐츠 값 설정
                const currentYOffset = delayedYOffset - prevScrollHeight; // 현재 섹션의 처음에서 얼만큼 스크롤 됐냐 = 현재 스크롤 위치 - 이전 섹션들 스크롤 높이의 합
                let sequence = Math.round(calcValues(values.imgSequence, currentYOffset)); // 현재 스크롤 위치에 따라 이미지 순서 적용 // 소수 -> 정수 반올림
                if (objs.videoImages[sequence]) { // sequence가 있으면
					objs.context.drawImage(objs.videoImages[sequence], 0, 0); // canvas 이미지 (이미지 배열 안에 들어 있는 이미지로) 그림
				}
            }
        }

        rafId = requestAnimationFrame(loop); // loop() 반복 실행 (아주 빠르게)
        //console.log(loop);

        // 현재 스크롤 크기(목표값) - 증가되기 전 위치가 1보다 작으면 // 목표값에 도달하면
        // 아래, 위로 스크롤 모두 다 고려해야 하므로 절댓값으로
        if(Math.abs((yOffset - delayedYOffset) < 1)){
            cancelAnimationFrame(rafId); // requestAnimationFrame 종료
            rafState = false; // requestAnimationFrame 상태 = false
        }
    }

    //! 이벤트 리스너

    //* load
    window.addEventListener('load', function(){ // 윈도우 창 새로고침 (완료)하면,
        setLayout(); // 중간에 새로고침 시, 콘텐츠 양에 따라 높이 계산에 오차가 발생하는 경우를 방지하기 위해 before-load 클래스 제거 전에도 확실하게 높이를 세팅하도록 한번 더 실행
        document.body.classList.remove('before-loading'); // body에 'before-loading' class 삭제
        setLayout(); // 각 세션 스크롤 높이 세팅() 실행 // setlayout 변함
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0); // 첫 번째 섹션 canvas 이미지 (이미지 배열 안에 들어 있는 이미지로) 그림

        //? 스크롤 자동 증가
        let tempYOffset = yOffset; // 반복할 현재 스크롤 크기
        let tempScrollCount = 0; // 스크롤 반복 횟수
        
        if(yOffset > 0){ // 현재 스크롤 크기가 0보다 크면 // 스크롤 아예 안 했으면 동작 X
            let siId = setInterval(function(){ // 0.02초마다 반복
                window.scrollTo(0, tempYOffset); // 스크롤 증가
                tempYOffset += 5; // 5px씩
    
                if(tempScrollCount > 20){ // 반복 횟수 20보다 크면
                    clearInterval(siId); // 반복 종료
                }
                tempScrollCount++; // 반복 횟수 1씩 증가
            }, 20);
        }

        //* scroll
        window.addEventListener('scroll',function(){ // 윈도우 창 스크롤하면,
            yOffset = window.pageYOffset; // 현재 스크롤 위치
            scrollLoop(); // 현재 섹션 활성화하기() 실행
            checkMenu(); // Bottom Navbar sticky() 실행
    
            //? canvas raf
            if(!rafState){ //. !false = 참이면
                rafId = requestAnimationFrame(loop); // 반복 다시 실행
                rafState = true; // requestAnimationFrame 상태 = true
            }
        });

        //* resize
        window.addEventListener('resize', function(){ // 각 세션 스크롤 높이 세팅() 실행 // 윈도우 창 리사이즈하면, setlayout 변함
            if(window.innerWidth > 900){ // 윈도우 창 너비가 600보다 크면 (모바일 아닐 때)
                window.location.reload(); // relode
                //setLayout(); // 각 섹션 스크롤 높이() 세팅
                //sceneInfo[3].values.rectStartY = 0; // 흰박스 시작 y 위치 초기화
            }
        });
        window.addEventListener('orientationchange', function(){ // 화면 회전 (mobile)
            scrollTo(0, 0);
            setTimeout(function(){
                window.location.reload(); // relode
            }, 500);
        });

        document.querySelector('.loading').addEventListener('transitionend', function(e){ // loading transition이 끝나면
            document.body.removeChild(e.currentTarget); // loading 아예 없애줌
        });
    });

    setCanvasImages(); // canvas 이미지 세팅() 실행
})();