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
            objs:{ // 각 섹션 객체 생성 // 각 섹션 가져오기
                container: document.querySelector('#scroll-section-0')
            }
        },
        // #scroll-section-1
        {
            type: 'normal',
            heigthNum: 5,
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#scroll-section-1')
            }
        },
        // #scroll-section-2
        {
            type: 'sticky',
            heigthNum: 5,
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#scroll-section-2')
            }
        },
        // #scroll-section-3
        {
            type: 'sticky',
            heigthNum: 5,
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#scroll-section-3')
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
        window.addEventListener('resize',setLayout); // 윈도우 창 리사이즈하면, setlayout 변함

        // 함수 선언🟩 현재 들어온(화면에 있는) 섹션만 활성화하기
        function scrollLoop(){
            prevScrollHeight = 0; // 0으로 초기화 (누적되지 않게)
            for(let i = 0; i < currentScene; i++){
                // 현재 섹션 스크롤 위치(높이) = 현재 섹션 스크롤 위치 + 이전 섹션 스크롤 높이
                prevScrollHeight += sceneInfo[i].scrollHeight;
            }
            if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){ // 현재 스크롤 위치가 (이전 섹션들의 스크롤 높이 합 + 현재 섹션 스크롤 높이)보다 크면
                currentScene++; // 현재 활성화된 섹션 다음으로 넘어감
            }
            if(yOffset < prevScrollHeight){ // 현재 스크롤 위치가 이전 섹션들의 스크롤 높이 합보다 작으면
                if(currentScene == 0){ // 현재 활성화 섹션 0이면
                    return; // 걍 리턴함 (에러 방지)
                }
                currentScene--; // 현재 활성화된 섹션 이전으로 넘어감
            }
            console.log(currentScene);
        }
        window.addEventListener('scroll',function(){ // 윈도우 창 스크롤하면,
            yOffset = window.pageYOffset; // 현재 스크롤 위치
            scrollLoop(); // 실행
        });
    }
    setLayout();
})();