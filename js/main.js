'use strict';

// 전역 변수 사용 피하기 위해 전체 틀 함수 생성 // 함수 바로 호출
(function(){
    // 변수 선언🟨 collection
    let yOffset = 0; // yOffset // window.pageYOffset 대입
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 섹션들의 스크롤 높이의 합
    let currentScene = 0; // 현재 활성화된 섹션

    // 변수 선언🟨 각 섹션 모두 선언 // 배열
    const sceneInfo = [
        // #scroll-section-0
        {
            type: 'sticky',
            heigthNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0, // 각 섹션 스크롤 높이 // 기기마다 유동적
            objs:{ // 섹션, 섹션 안 콘텐츠 객체 // 각 섹션 + 각 섹션 안 콘텐츠 가져오기
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 > p:nth-of-type(1)'),
                messageB: document.querySelector('#scroll-section-0 > p:nth-of-type(2)'),
                messageC: document.querySelector('#scroll-section-0 > p:nth-of-type(3)'),
                messageD: document.querySelector('#scroll-section-0 > p:nth-of-type(4)')
            },
            values:{ // 섹션 안 콘텐츠 값 객체 // 각 섹션 안 콘텐츠 값 설정
                messageA_opacity: [0, 1] // 첫번째 콘텐츠 투명도
            }
        },
        // #scroll-section-1
        {
            type: 'normal',
            heigthNum: 5,
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#scroll-section-1'),
            }
        },
        // #scroll-section-2
        {
            type: 'sticky',
            heigthNum: 5,
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#scroll-section-2'),
            }
        },
        // #scroll-section-3
        {
            type: 'sticky',
            heigthNum: 5,
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#scroll-section-3'),
            }
        }
    ];

    // 함수 선언🟩 각 섹션 스크롤 높이 세팅
    function setLayout(){
        for(let i = 0; i < sceneInfo.length; i++){
            // 각 섹션 스크롤 높이 = heightNum * 윈도우 창 높이
            sceneInfo[i].scrollHeight = sceneInfo[i].heigthNum * window.innerHeight;
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
        prevScrollHeight = 0; // 0으로 초기화 (누적되지 않게)
        for(let i = 0; i < currentScene; i++){
            // 현재 섹션 스크롤 위치(높이) = 현재 섹션 스크롤 위치 + 이전 섹션 스크롤 높이
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){ // 현재 스크롤 위치가 (이전 섹션들의 스크롤 높이 합 + 현재 섹션 스크롤 높이)보다 크면
            currentScene++; // 현재 활성화된 섹션 다음으로 넘어감
            document.body.setAttribute('id', `show-scene-${currentScene}`); // body에 id(현재 활성화된 씬 연결) 추가
        }
        if(yOffset < prevScrollHeight){ // 현재 스크롤 위치가 이전 섹션들의 스크롤 높이 합보다 작으면
            if(currentScene == 0){ // 현재 활성화 섹션 0이면
                return; // 걍 리턴함 (에러 방지)
            }
            currentScene--; // 현재 활성화된 섹션 이전으로 넘어감
            document.body.setAttribute('id', `show-scene-${currentScene}`); // body에 id(현재 활성화된 씬 연결) 추가
        }

        // 함수 선언🟩 스크롤 시 애니메이션(각 섹션 안 콘텐츠 값) 설정
        function calcValues(value, currentYOffset){

        }
        
        // 함수 선언🟩 스크롤 시 애니메이션 설정
        function playAnimation(){
            // currentYOffset에 따라 values 달라짐
            const obj = sceneInfo[currentScene].obj; // 각 섹션 + 각 섹션 안 콘텐츠 가져오기
            const values = sceneInfo[currentScene].values; // 각 섹션 안 콘텐츠 값 설정
            const currentYOffset = yOffset - prevScrollHeight; // 현재 섹션의 처음에서 얼만큼 스크롤 됐냐 = 현재 스크롤 위치 - 이전 섹션들 스크롤 높이의 합

            switch(currentScene){ // 현재 활성화 섹션이
                case 0: // #scroll-section-0
                    let messageA_opacity_0 = values.messageA_opacity[0]; // opacity 0
                    let messageA_opacity_1 = values.messageA_opacity[1]; // opacity 1
                    console.log(calcValues(values.messageA_opacity, currentYOffset));
                    break;
                case 1: // #scroll-section-1
                        
                    break;
                case 2: // #scroll-section-2
                        
                    break;
                case 3: // #scroll-section-3
                        
                    break;
            }
        }
        playAnimation();
    }
    // {
    //     type: 'sticky',
    //     heigthNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
    //     scrollHeight: 0, // 각 섹션 스크롤 높이 // 기기마다 유동적
    //     objs:{ // 섹션, 섹션 안 콘텐츠 객체 // 각 섹션 + 각 섹션 안 콘텐츠 가져오기
    //         container: document.querySelector('#scroll-section-0'),
    //         messageA: document.querySelector('#scroll-section-0 > p:nth-of-type(1)'),
    //         messageB: document.querySelector('#scroll-section-0 > p:nth-of-type(2)'),
    //         messageC: document.querySelector('#scroll-section-0 > p:nth-of-type(3)'),
    //         messageD: document.querySelector('#scroll-section-0 > p:nth-of-type(4)')
    //     },
    //     values:{ // 섹션 안 콘텐츠 값 객체 // 각 섹션 안 콘텐츠 값 설정
    //         messageA_opacity: [0, 1] // 첫번째 콘텐츠 투명도
    //     }
    // },
    window.addEventListener('scroll',function(){ // 윈도우 창 스크롤하면,
        yOffset = window.pageYOffset; // 현재 스크롤 위치
        scrollLoop(); // 실행
    });
    window.addEventListener('load', setLayout); // 윈도우 창 새로고침하면, setlayout 변함
    window.addEventListener('resize',setLayout); // 윈도우 창 리사이즈하면, setlayout 변함
    
    setLayout();
})();