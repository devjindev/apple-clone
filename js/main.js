'use strict';

// 전역 변수 사용 피하기 위해 전체 틀 함수 생성 // 함수 바로 호출
(function(){
    // 변수 선언🟨 collection
    let yOffset = 0; // yOffset // window.pageYOffset 대입
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 섹션들의 스크롤 높이의 합
    let currentScene = 0; // 현재 활성화된 섹션
    let enterNewScene = false; // 새로운 섹션에 들어간 순간 true

    // 변수 선언🟨 각 섹션 모두 선언 // 배열
    const sceneInfo = [
        // #scroll-section-0
        {
            type: 'sticky',
            heigthNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0, // 각 섹션 스크롤 높이 // 기기마다 유동적
            objs:{ // 섹션, 섹션 안 컨텐츠 객체 // 각 섹션 + 각 섹션 안 컨텐츠 가져오기
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 > p:nth-of-type(1)'),
                messageB: document.querySelector('#scroll-section-0 > p:nth-of-type(2)'),
                messageC: document.querySelector('#scroll-section-0 > p:nth-of-type(3)'),
                messageD: document.querySelector('#scroll-section-0 > p:nth-of-type(4)')
            },
            values:{ // 섹션 안 컨텐츠 값 객체 // 각 섹션 안 컨텐츠 값 설정
                // 컨텐츠 들어올 때 (나타날 때)
                // 투명도
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], // 구간 10~20%
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                // y값
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }], // 구간 10~20%
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                
                // 컨텐츠 나갈 때 (사라질 때)
                // 투명도
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }], // 구간 25~30%
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                // y값
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }], // 구간 25~30%
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
            }
        },

        // #scroll-section-1
        {
            type: 'normal',
            //heigthNum: 5, // normal에서는 필요 X
            scrollHeight: 0,
            objs: { // 섹션, 섹션 안 컨텐츠 객체 // 각 섹션 + 각 섹션 안 컨텐츠 가져오기
                container: document.querySelector('#scroll-section-1'),
                content: document.querySelector('#scroll-section-1 > p')
            }
        },

        // #scroll-section-2
        {
            type: 'sticky',
            heigthNum: 5,
            scrollHeight: 0,
            objs: { // 섹션, 섹션 안 컨텐츠 객체 // 각 섹션 + 각 섹션 안 컨텐츠 가져오기
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 > p:nth-of-type(1)'),
                messageB: document.querySelector('#scroll-section-2 > p:nth-of-type(2)'),
                messageC: document.querySelector('#scroll-section-2 > p:nth-of-type(3)'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin')
            },
            values: { // 섹션 안 컨텐츠 값 객체 // 각 섹션 안 컨텐츠 값 설정
                // 컨텐츠 들어올 때 (나타날 때)
                // 투명도
                messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
                messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
                messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
                // y값
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
                messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],

                // 컨텐츠 나갈 때 (사라질 때)
                // 투명도
                messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
                messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
                messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                // y값
                messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
                messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
                messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],

                // span
                pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
                pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
            }
        },

        // #scroll-section-3
        {
            type: 'sticky',
            heigthNum: 5,
            scrollHeight: 0,
            objs: { // 섹션, 섹션 안 컨텐츠 객체 // 각 섹션 + 각 섹션 안 컨텐츠 가져오기
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption')
            },
            values: { // 섹션 안 컨텐츠 값 객체 // 각 섹션 안 컨텐츠 값 설정
    
            }
        }
    ];

    // 함수 선언🟩 각 섹션 스크롤 높이 세팅
    function setLayout(){
        for(let i = 0; i < sceneInfo.length; i++){
            if(sceneInfo[i].type === 'sticky'){
                // 각 섹션 스크롤 높이 = heightNum * 윈도우 창 높이
                sceneInfo[i].scrollHeight = sceneInfo[i].heigthNum * window.innerHeight;
            }else if(sceneInfo[i].type === 'normal'){
                // 각 섹션 스크롤 높이 = 섹션 본래 높이
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeigth;
            }
            // 각 섹션에 스크롤 높이 세팅
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        // 새로고침해도 현재 섹션 id 유지
        let totalScrollHeight = 0; // 총 스크롤 위치(높이)
        for(let i = 0; i< sceneInfo.length; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight; // 총 스크롤 위치(높이) = 총 스크롤 위치 + 이전 섹션 스크롤 높이
            if(totalScrollHeight >= yOffset){ // 총 스크롤 위치가 현재 스크롤 위치보다 크거나 같으면
                currentScene = i; // 현재 섹션 = i
                break; // 반복문 빠져나감
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`); // body에 id(현재 활성화된 씬 연결) 추가
    }
    
    // 함수 선언🟩 현재 들어온(화면에 있는) 섹션만 활성화하기
    function scrollLoop(){
        enterNewScene = false; // 새로운 섹션에 들어간 순간 true
        prevScrollHeight = 0; // 0으로 초기화 (누적되지 않게)
        for(let i = 0; i < currentScene; i++){
            // 현재 섹션 스크롤 위치(높이) = 현재 섹션 스크롤 위치 + 이전 섹션 스크롤 높이
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){ // 현재 스크롤 위치가 (이전 섹션들의 스크롤 높이 합 + 현재 섹션 스크롤 높이)보다 크면
            enterNewScene = true;
            currentScene++; // 현재 활성화된 섹션 다음으로 넘어감
            document.body.setAttribute('id', `show-scene-${currentScene}`); // body에 id(현재 활성화된 씬 연결) 추가
        }
        if(yOffset < prevScrollHeight){ // 현재 스크롤 위치가 이전 섹션들의 스크롤 높이 합보다 작으면
            enterNewScene = true;
            if(currentScene == 0){ // 현재 활성화 섹션 0이면
                return; // 걍 리턴함 (에러 방지)
            }
            currentScene--; // 현재 활성화된 섹션 이전으로 넘어감
            document.body.setAttribute('id', `show-scene-${currentScene}`); // body에 id(현재 활성화된 씬 연결) 추가
        }
        if(enterNewScene == true){ // 새로운 섹션에 들어간 순간이면
            return; // 함수 잠깐 종료 (섹션에 들어간 순간에 잠깐 오류떠서 작성하는거임)
        }


        // 함수 선언🟩 스크롤 시 애니메이션(각 섹션 안 컨텐츠 값) 계산
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

        // 함수 선언🟩 스크롤 시 애니메이션 설정
        function playAnimation(){
            // currentYOffset에 따라 values 달라짐
            const objs = sceneInfo[currentScene].objs; // 각 섹션 + 각 섹션 안 컨텐츠 가져오기
            const values = sceneInfo[currentScene].values; // 각 섹션 안 컨텐츠 값 설정
            const currentYOffset = yOffset - prevScrollHeight; // 현재 섹션의 처음에서 얼만큼 스크롤 됐냐 = 현재 스크롤 위치 - 이전 섹션들 스크롤 높이의 합
            const scrollHeight = sceneInfo[currentScene].scrollHeight; // 현재 색션 스크롤 높이
            const scrollRatio = currentYOffset / scrollHeight; // 현재 섹션에서 스크롤된 범위의 비율 = 현재 섹션의 처음에서 얼만큼 스크롤 됐냐 / 현재 섹션 스크롤 높이
            
            switch(currentScene){ // 현재 활성화 섹션이
                case 0: // #scroll-section-0
                    if(scrollRatio <= 0.22){ // 현재 섹션 내 스크롤 범위 비율이 컨텐츠 시작점 사이면
                        objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset); // A 컨텐츠에 opacity in css 적용
                        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`; // A 컨텐츠에 translateY in css 적용
                    }else{ // 현재 섹션 내 스크롤 범위 비율이 컨텐츠 끝점 사이면
                        objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset); // A 컨텐츠에 opacity out css 적용
                        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`; // A 컨텐츠에 translateY out css 적용
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
                
                //case 1: // #scroll-section-1 // normal에서는 필요 X
                
                case 2: // #scroll-section-2
                    if (scrollRatio <= 0.32) {
                        // in
                        objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                    } else {
                        // out
                        objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                    }
        
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

                    break;
                
                case 3: // #scroll-section-3
                        
                    break;
            }
        }
        playAnimation();
    }

    window.addEventListener('scroll',function(){ // 윈도우 창 스크롤하면,
        yOffset = window.pageYOffset; // 현재 스크롤 위치
        scrollLoop(); // 실행
    });
    window.addEventListener('load', setLayout); // 윈도우 창 새로고침하면, setlayout 변함
    window.addEventListener('resize',setLayout); // 윈도우 창 리사이즈하면, setlayout 변함
    
    setLayout();
})();