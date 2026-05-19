import { useState, useEffect, useRef } from "react";

const speak = (text, lang = "en-US") => {
  window.speechSynthesis?.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = 0.75;
  window.speechSynthesis?.speak(u);
};
const norm = s => s.replace(/[.,!?;:'"''""\-—()[\]{}…·]+/g, "").replace(/\s+/g, " ").trim().toLowerCase();

let actx = null;
const initAudio=()=>{if(!actx)try{actx=new(window.AudioContext||window.webkitAudioContext)()}catch{}};
const keySound = () => { try { initAudio();if(!actx)return;const o=actx.createOscillator(),g=actx.createGain(); o.connect(g);g.connect(actx.destination); o.frequency.value=800+Math.random()*400;o.type="sine"; g.gain.value=0.04;g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+0.06); o.start();o.stop(actx.currentTime+0.06); } catch{} };
const okSound = () => { try { initAudio();if(!actx)return;[523,659,784].forEach((f,i)=>{ const o=actx.createOscillator(),g=actx.createGain(); o.connect(g);g.connect(actx.destination); o.frequency.value=f;o.type="sine"; g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+0.15+i*0.1); o.start(actx.currentTime+i*0.1);o.stop(actx.currentTime+0.15+i*0.1); }); } catch{} };

const errSound=()=>{try{initAudio();if(!actx)return;const o=actx.createOscillator(),g=actx.createGain();o.connect(g);g.connect(actx.destination);o.frequency.value=200;o.type="square";g.gain.value=0.04;g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+0.1);o.start();o.stop(actx.currentTime+0.1)}catch{}};

const P=[
{p:48,l:"Lesson 3",t:"Different Attitudes (도입)",w:[{e:"contest",k:"대회"},{e:"enter",k:"참가하다"},{e:"kidding",k:"농담하다"},{e:"terrible",k:"끔찍한, 못하는"},{e:"dancer",k:"춤추는 사람"}],s:[{e:"The school dance contest is next month",k:"학교 댄스 대회가 다음 달이야"},{e:"Let's enter the dance contest",k:"댄스 대회에 참가하자"},{e:"Are you kidding",k:"농담이야"},{e:"We are all terrible dancers",k:"우리는 모두 춤을 못 춰"}]},
{p:49,l:"Lesson 3",t:"Different Attitudes (부정적)",w:[{e:"mistake",k:"실수"},{e:"hopeless",k:"가망 없는"},{e:"sick",k:"아픈"},{e:"tired",k:"피곤한"},{e:"waste",k:"낭비하다"},{e:"quit",k:"그만두다"}],s:[{e:"We are making too many mistakes",k:"우리는 실수를 너무 많이 하고 있어"},{e:"We are hopeless",k:"우리는 가망이 없어"},{e:"By the way where is Minsu",k:"그런데 민수는 어디 있어"},{e:"He is sick",k:"그는 아파"},{e:"I saw him last night and he was all right",k:"어젯밤에 그를 봤는데 멀쩡했어"},{e:"I am so tired",k:"나는 너무 피곤해"},{e:"We are not getting anywhere",k:"우리는 전혀 나아지지 않고 있어"},{e:"We are just wasting our time",k:"우리는 그냥 시간을 낭비하고 있어"},{e:"Why don't we just quit",k:"그냥 그만두는 게 어때"}]},
{p:50,l:"Lesson 3",t:"Different Attitudes (긍정적)",w:[{e:"practice",k:"연습하다"},{e:"cheer up",k:"힘내"},{e:"worry",k:"걱정하다"},{e:"almost",k:"거의"},{e:"proud",k:"자랑스러운"},{e:"support",k:"응원, 지지"}],s:[{e:"Yuna and her teammates are practicing hard",k:"유나와 팀원들이 열심히 연습하고 있다"},{e:"I made a mistake again",k:"또 실수했어"},{e:"I am sorry",k:"미안해"},{e:"Cheer up you can do it",k:"힘내 너는 할 수 있어"},{e:"Don't worry we all make mistakes",k:"걱정 마 우리 모두 실수해"},{e:"Come on let's do it one more time",k:"자 한 번 더 하자"},{e:"We are almost there",k:"거의 다 됐어"},{e:"The contest is over now",k:"대회가 이제 끝났다"},{e:"Good job we made it",k:"잘했어 우리가 해냈어"},{e:"We finished the dance without a big mistake",k:"큰 실수 없이 춤을 끝냈어"},{e:"I feel great",k:"기분이 최고야"},{e:"We did our best and I am so proud of all of us",k:"우리는 최선을 다했고 나는 우리 모두가 자랑스러워"},{e:"Thank you for your support everyone",k:"모두 응원해 줘서 고마워"}]},
{p:64,l:"Lesson 4",t:"Colorful Villages — Banwol Island",w:[{e:"summer",k:"여름"},{e:"swimming",k:"수영"},{e:"forward",k:"앞으로"},{e:"island",k:"섬"},{e:"purple",k:"보라색"},{e:"explore",k:"탐험하다"}],s:[{e:"What are you going to do this summer",k:"이번 여름에 뭐 할 거야"},{e:"I am going to take swimming lessons",k:"나는 수영 강습을 받을 거야"},{e:"I am looking forward to it",k:"나는 그것을 기대하고 있어"},{e:"The island is purple",k:"그 섬은 보라색이야"},{e:"The bridges and roofs are all purple",k:"다리와 지붕이 모두 보라색이야"},{e:"Visitors can explore it on foot",k:"방문객들은 걸어서 탐험할 수 있어"}]},
{p:65,l:"Lesson 4",t:"Colorful Villages — Ronda",w:[{e:"yesterday",k:"어제"},{e:"building",k:"건물"},{e:"beautiful",k:"아름다운"},{e:"cliff",k:"절벽"},{e:"fantastic",k:"환상적인"},{e:"especially",k:"특히"}],s:[{e:"Yesterday my family and I came to Ronda in Spain",k:"어제 우리 가족과 나는 스페인의 론다에 왔어"},{e:"Most buildings here are white",k:"이곳의 대부분의 건물들은 하얀색이야"},{e:"They are so beautiful against the blue sky",k:"파란 하늘을 배경으로 정말 아름다워"},{e:"Ronda is on cliffs so the views are fantastic",k:"론다는 절벽 위에 있어서 경치가 환상적이야"},{e:"All the food here is great",k:"이곳의 모든 음식이 훌륭해"},{e:"I especially like the churros",k:"나는 특히 추로스를 좋아해"}]},
{p:67,l:"Lesson 4",t:"Colorful Villages — Chefchaouen",w:[{e:"pearl",k:"진주"},{e:"enjoyed",k:"즐겼다"},{e:"narrow",k:"좁은"},{e:"souvenir",k:"기념품"},{e:"mint",k:"민트"},{e:"sunrise",k:"일출"}],s:[{e:"I am in Chefchaouen the Blue Pearl of Morocco",k:"나는 모로코의 푸른 진주 쉐프샤우엔에 있어"},{e:"I enjoyed taking pictures of the blue streets",k:"나는 파란 거리의 사진 찍는 것을 즐겼어"},{e:"I also enjoyed walking through the narrow streets",k:"좁은 거리를 걷는 것도 즐겼어"},{e:"They were full of interesting shops",k:"흥미로운 가게들로 가득했어"},{e:"I bought some souvenirs",k:"기념품을 몇 개 샀어"},{e:"Now I am drinking mint tea at a tea house",k:"지금 나는 찻집에서 민트차를 마시고 있어"},{e:"Tomorrow I am going to get up early",k:"내일 나는 일찍 일어날 거야"},{e:"I am going to enjoy a beautiful sunrise",k:"아름다운 일출을 즐길 거야"}]},
{p:80,l:"Lesson 5",t:"Who Threw a Cake at the Mona Lisa?",w:[{e:"threw",k:"던졌다"},{e:"painting",k:"그림"},{e:"damaged",k:"손상된"},{e:"behind",k:"뒤에"},{e:"clue",k:"단서"},{e:"suspect",k:"용의자"}],s:[{e:"A man threw a cake at the Mona Lisa",k:"한 남자가 모나리자에 케이크를 던졌어"},{e:"The painting was not damaged",k:"그 그림은 손상되지 않았어"},{e:"The Mona Lisa is behind glass",k:"모나리자는 유리 뒤에 있어"},{e:"Think like Sherlock Holmes",k:"셜록 홈즈처럼 생각해 봐"},{e:"Look at the clues carefully",k:"단서를 주의 깊게 살펴봐"},{e:"Who is the suspect",k:"용의자가 누구야"}]},
{p:96,l:"Lesson 6",t:"Join the Zero-Waste Challenge",w:[{e:"produce",k:"만들어 내다"},{e:"trash",k:"쓰레기"},{e:"reusable",k:"재사용 가능한"},{e:"instead",k:"대신에"},{e:"change",k:"변화"},{e:"difference",k:"차이"}],s:[{e:"We produce too much trash every day",k:"우리는 매일 너무 많은 쓰레기를 만들어"},{e:"Join the zero-waste challenge",k:"제로 웨이스트 챌린지에 참여해"},{e:"Use a reusable bottle instead of plastic",k:"플라스틱 대신 재사용 가능한 병을 사용해"},{e:"Bring your own bag when you go shopping",k:"쇼핑할 때 자신의 가방을 가져가"},{e:"Small changes can make a big difference",k:"작은 변화가 큰 차이를 만들 수 있어"},{e:"It is good for the earth and good for us",k:"그것은 지구에도 좋고 우리에게도 좋아"}]},
{p:112,l:"Lesson 7",t:"Let's Make a Movie!",w:[{e:"create",k:"만들다"},{e:"director",k:"감독"},{e:"actor",k:"배우"},{e:"dream",k:"꿈"},{e:"talent",k:"재능"},{e:"future",k:"미래"}],s:[{e:"A lot of people are working hard to create this movie",k:"많은 사람들이 이 영화를 만들기 위해 열심히 일하고 있어"},{e:"The director tells the actors what to do",k:"감독은 배우들에게 무엇을 할지 알려줘"},{e:"Find your dream and follow it",k:"너의 꿈을 찾고 그것을 따라가"},{e:"Everyone has a special talent",k:"모든 사람은 특별한 재능이 있어"},{e:"What do you want to be in the future",k:"너는 미래에 뭐가 되고 싶어"}]},
{p:128,l:"Lesson 8",t:"Goldilocks Learns Her Lesson",w:[{e:"forest",k:"숲"},{e:"porridge",k:"죽"},{e:"hard",k:"딱딱한"},{e:"smart",k:"현명한"},{e:"online",k:"온라인"},{e:"post",k:"게시하다"}],s:[{e:"People didn't give Goldilocks many likes",k:"사람들은 골디락스에게 좋아요를 많이 주지 않았어"},{e:"It was getting dark and it started to rain",k:"어두워지고 있었고 비가 내리기 시작했어"},{e:"She found a small house in the forest",k:"그녀는 숲에서 작은 집을 발견했어"},{e:"This porridge is too hot",k:"이 죽은 너무 뜨거워"},{e:"This bed is too hard",k:"이 침대는 너무 딱딱해"},{e:"Be smart online",k:"온라인에서 현명하게 행동해"},{e:"Think before you post",k:"게시하기 전에 생각해"}]},
{p:16,l:"Lesson 1",t:"Who Is in Your Heart? (1)",w:[{e:"friend",k:"친구"},{e:"best",k:"가장 좋은"},{e:"member",k:"멤버"},{e:"band",k:"밴드"},{e:"guitar",k:"기타"},{e:"drums",k:"드럼"},{e:"laugh",k:"웃다"}],s:[{e:"I am Jihun",k:"나는 지훈이야"},{e:"My best friend is Minsu",k:"나의 가장 친한 친구는 민수야"},{e:"Minsu and I love rock music",k:"민수와 나는 록 음악을 좋아해"},{e:"We are members of the school band",k:"우리는 학교 밴드의 멤버야"},{e:"I play the guitar and Minsu plays the drums",k:"나는 기타를 치고 민수는 드럼을 쳐"},{e:"We have so much fun together",k:"우리는 함께 정말 즐거운 시간을 보내"},{e:"With Minsu I laugh all the time",k:"민수와 함께 있으면 나는 항상 웃어"},{e:"Together we are happy",k:"함께라서 우리는 행복해"}]},
{p:17,l:"Lesson 1",t:"Who Is in Your Heart? (2)",w:[{e:"neighbor",k:"이웃"},{e:"special",k:"특별한"},{e:"nod",k:"끄덕이다"},{e:"smile",k:"미소 짓다"},{e:"bake",k:"굽다"},{e:"kindness",k:"친절"}],s:[{e:"My neighbor Mrs. Schmidt is special to me",k:"이웃인 슈미트 할머니는 나에게 특별해"},{e:"She always nods and smiles at me",k:"그녀는 항상 나에게 고개를 끄덕이고 미소 지어"},{e:"When I am sad she bakes a cake for me",k:"내가 슬플 때 그녀는 나를 위해 케이크를 구워 줘"},{e:"With Mrs. Schmidt I feel the magic of kindness",k:"슈미트 할머니와 함께하면 친절의 마법을 느껴"},{e:"Together we are happy",k:"함께라서 우리는 행복해"}]},
{p:18,l:"Lesson 1",t:"Who Is in Your Heart? (3)",w:[{e:"guide dog",k:"안내견"},{e:"side",k:"곁"},{e:"mostly",k:"대부분"},{e:"mind",k:"신경 쓰다"},{e:"weekend",k:"주말"},{e:"free",k:"자유로운"},{e:"safe",k:"안전한"}],s:[{e:"Hope is my guide dog and my best friend",k:"호프는 나의 안내견이자 가장 친한 친구야"},{e:"She is always by my side",k:"그녀는 항상 내 곁에 있어"},{e:"She mostly sleeps in class",k:"그녀는 수업 시간에 대부분 자"},{e:"But the teachers don't mind",k:"하지만 선생님들은 신경 쓰지 않아"},{e:"On weekends we go to the park and play together",k:"주말에 우리는 공원에 가서 함께 놀아"},{e:"With Hope I feel free and safe",k:"호프와 함께 있으면 자유롭고 안전해"},{e:"Together we are happy",k:"함께라서 우리는 행복해"}]},
{p:32,l:"Lesson 2",t:"Healthy and Yummy Snacks (1)",w:[{e:"caprese",k:"카프레제"},{e:"skewer",k:"꼬치"},{e:"anyone",k:"누구나"},{e:"calorie",k:"칼로리"},{e:"healthy",k:"건강한"},{e:"snack",k:"간식"}],s:[{e:"Hello everyone",k:"안녕하세요 여러분"},{e:"I am making caprese skewers",k:"나는 카프레제 꼬치를 만들고 있어"},{e:"They are from Italy",k:"이것들은 이탈리아에서 온 거야"},{e:"Anyone can make these",k:"누구나 이것을 만들 수 있어"},{e:"They are low in calories",k:"칼로리가 낮아"},{e:"They will become healthy snacks",k:"이것들은 건강한 간식이 될 거야"}]},
{p:33,l:"Lesson 2",t:"Healthy and Yummy Snacks (2)",w:[{e:"unlike",k:"~와 달리"},{e:"tofu",k:"두부"},{e:"fry",k:"튀기다"},{e:"bake",k:"굽다"},{e:"flour",k:"밀가루"},{e:"crispy",k:"바삭한"},{e:"delicious",k:"맛있는"}],s:[{e:"Unlike other chips my tofu chips are healthy",k:"다른 칩과 달리 내 두부 칩은 건강해"},{e:"I don't fry my chips but bake them",k:"나는 칩을 튀기지 않고 구워"},{e:"I don't use any flour",k:"나는 밀가루를 전혀 사용하지 않아"},{e:"They are crispy and delicious",k:"바삭하고 맛있어"},{e:"Try them and you will love them",k:"한번 먹어 봐 좋아하게 될 거야"}]},
{p:34,l:"Lesson 2",t:"Healthy and Yummy Snacks (3)",w:[{e:"acai",k:"아사이"},{e:"bowl",k:"그릇"},{e:"thick",k:"걸쭉한"},{e:"smoothie",k:"스무디"},{e:"nut",k:"견과류"},{e:"superfood",k:"슈퍼푸드"}],s:[{e:"Hello everyone I am Miguel from Brazil",k:"안녕하세요 여러분 나는 브라질에서 온 미겔이야"},{e:"I am making an acai bowl right now",k:"나는 지금 아사이 볼을 만들고 있어"},{e:"It is a thick acai berry smoothie in a bowl",k:"그릇에 담긴 걸쭉한 아사이 베리 스무디야"},{e:"You can add other healthy foods like nuts and bananas",k:"견과류와 바나나 같은 건강한 음식을 추가할 수 있어"},{e:"Acai berries are a superfood",k:"아사이 베리는 슈퍼푸드야"}]},
];

const C={bg:"#0a0e1a",card:"#111827",cardL:"#1a2235",ok:"#4ade80",no:"#f87171",txt:"#e2e8f0",dim:"#94a3b8",mute:"#64748b",bdr:"rgba(255,255,255,0.06)",en:"#60a5fa",enBg:"rgba(96,165,250,0.08)",gold:"#fbbf24",goldBg:"rgba(251,191,36,0.1)",combo:"#c084fc",kr:"#6ee7b7",ghost:"rgba(255,255,255,0.15)"};
const F="'Pretendard Variable','Noto Sans KR',system-ui,sans-serif";

const reportDone=async(d)=>{
  try{
    const t=new Date().toISOString().split("T")[0];
    // localStorage 저장
    const h=JSON.parse(localStorage.getItem("stella_history")||"[]");
    h.push({date:t,...d});localStorage.setItem("stella_history",JSON.stringify(h));
    const tp=JSON.parse(localStorage.getItem("stella_today_"+t)||"[]");
    tp.push(d.page);localStorage.setItem("stella_today_"+t,JSON.stringify(tp));
    // 마지막 완료 페이지 인덱스 저장
    const pi=P.findIndex(p=>p.p===d.page);
    if(pi>=0)localStorage.setItem("stella_lastIdx",String(pi));
    // 서버 API 보고
    fetch("/api/report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:t,...d})}).catch(()=>{});
  }catch{}
};

export default function App(){
  const[phase,setPhase]=useState(0);
  const[pi,setPi]=useState(0);
  const[idx,setIdx]=useState(0);
  const[step,setStep]=useState(0);
  const[fb,setFb]=useState(null);
  const[coin,setCoin]=useState(()=>{try{return parseInt(localStorage.getItem("stella_coin"))||0}catch{return 0}});
  const[tot,setTot]=useState(()=>{try{return parseInt(localStorage.getItem("stella_total"))||0}catch{return 0}});
  const[combo,setCombo]=useState(0);
  const[mxCombo,setMxCombo]=useState(0);
  const[score,setScore]=useState(0);
  const[errors,setErrors]=useState([]);
  const[search,setSearch]=useState("");
  const[coinAnim,setCoinAnim]=useState(null);
  const[todayDone,setTodayDone]=useState(()=>{try{const t=new Date().toISOString().split("T")[0];return JSON.parse(localStorage.getItem("stella_today_"+t)||"[]")}catch{return[]}});
  const[giftModal,setGiftModal]=useState(null); // null | "confirm" | "success" | "fail"
  const ref=useRef(null);
  const prevLen=useRef(0);
  const guideRef=useRef(null);
  const compRef=useRef(false);

  // 첫 터치로 AudioContext 초기화
  useEffect(()=>{const h=()=>{initAudio();document.removeEventListener("touchstart",h);document.removeEventListener("click",h)};document.addEventListener("touchstart",h);document.addEventListener("click",h);return()=>{document.removeEventListener("touchstart",h);document.removeEventListener("click",h)}},[]);

  useEffect(()=>{try{localStorage.setItem("stella_coin",String(coin))}catch{}},[coin]);
  useEffect(()=>{try{localStorage.setItem("stella_total",String(tot))}catch{}},[tot]);

  const pg=P[pi];const lines=pg?.s||[];const cur=lines[idx]||{e:"",k:""};
  const target=step===0?cur.e:cur.k;

  useEffect(()=>{ref.current?.focus()},[phase,idx,step,fb]);
  // 4초마다 문장 읽어주기 — 영어step은 영어, 한글step은 한글
  useEffect(()=>{
    if(phase!==1)return;
    const txt=step===0?cur.e:cur.k;
    const lang=step===0?"en-US":"ko-KR";
    if(!txt)return;
    speak(txt,lang);
    const iv=setInterval(()=>speak(txt,lang),4000);
    return()=>clearInterval(iv);
  },[phase,idx,step]);

  // 네이티브 input 이벤트 — span ref 캐시로 DOM 검색 비용 0
  const spansRef=useRef([]);
  const cursRef=useRef([]);
  const typedSpansRef=useRef([]);

  useEffect(()=>{
    const inp=ref.current;if(!inp||phase!==1)return;
    const g=guideRef.current;
    if(g){
      spansRef.current=[...g.querySelectorAll("[data-gi]")];
      cursRef.current=[...g.querySelectorAll("[data-cur]")];
      typedSpansRef.current=[...g.querySelectorAll("[data-ti]")];
    }

    const handler=()=>{
      const v=inp.value;
      const newLen=v.length;
      const isKr=step===1;

      // 타건음: 한글일 때는 완성된 글자만 비교, 영어는 즉시 비교
      if(newLen>prevLen.current){
        if(!isKr){
          // 영어: 즉시 비교
          const lastIdx=newLen-1;
          const spans=spansRef.current;
          if(lastIdx<spans.length){
            const ch=(spans[lastIdx].getAttribute("data-ch")||"").toLowerCase();
            const tc=[...v][lastIdx]?.toLowerCase();
            if(tc===ch)keySound();else errSound();
          }else keySound();
        }else{
          // 한글: 새 글자가 추가됐으면(이전 글자 완성) 이전 글자 비교
          const tArr=[...v];
          if(tArr.length>=2){
            const prevIdx=tArr.length-2;
            const spans=spansRef.current;
            if(prevIdx<spans.length){
              const ch=spans[prevIdx].getAttribute("data-ch")||"";
              if(tArr[prevIdx]===ch)keySound();else errSound();
            }else keySound();
          }else keySound();
        }
      }
      prevLen.current=newLen;
      const spans=spansRef.current;const curs=cursRef.current;const tspans=typedSpansRef.current;
      const tArr=[...v];const enC=step===0?"#60a5fa":"#6ee7b7";
      const lastCharIdx=isKr?tArr.length-1:-1; // 한글: 마지막 글자는 조합중 → 진행중 색
      for(let i=0;i<spans.length;i++){
        const sp=spans[i];const ts=tspans[i];const ch=sp.getAttribute("data-ch")||"";
        const tc=tArr[i];
        if(tc!=null){
          if(isKr&&i===lastCharIdx){
            // 한글 조합 중인 마지막 글자 → 연한 진행중 색 (완성 아님)
            sp.style.color="rgba(255,255,255,0.35)";sp.style.fontWeight="700";
            if(ts){ts.textContent=tc;ts.style.color=enC+"90"}
          }else{
            const match=tc.toLowerCase()===ch.toLowerCase();
            sp.style.color=match?enC:"rgba(255,255,255,0.08)";
            sp.style.fontWeight="700";
            if(ts){ts.textContent=match?"":tc;ts.style.color=match?"transparent":"#fb923c"}
          }
        } else {
          sp.style.color="rgba(255,255,255,0.15)";sp.style.fontWeight="400";
          if(ts){ts.textContent="";ts.style.color="transparent"}
        }
      }
      for(let i=0;i<curs.length;i++)curs[i].style.display=i===v.length?"inline":"none";
    };
    inp.addEventListener("input",handler);
    return()=>inp.removeEventListener("input",handler);
  },[phase,step,idx,target]);

  const reset=()=>{setIdx(0);setStep(0);setFb(null);setCombo(0);setMxCombo(0);setScore(0);setErrors([]);prevLen.current=0;if(ref.current)ref.current.value=""};
  const addCoin=(a)=>{setCoin(c=>c+a);setCoinAnim(a);setTimeout(()=>setCoinAnim(null),800)};

  const submit=()=>{
    if(compRef.current)return;
    // 항상 input DOM에서 직접 읽기 — 한글 조합 완성 보장
    const t=(ref.current?.value||"").trim();if(!t)return;
    const normT=norm(t);const normG=norm(target);
    // 1차: 완전 일치
    if(normT===normG){
      okSound();setScore(s=>s+1);setTot(x=>x+1);setCombo(c=>{const n=c+1;if(n>mxCombo)setMxCombo(n);return n});const b=combo>=4?50:0;addCoin(100+b);setFb({ok:true,msg:combo>=4?`${combo+1} 콤보! +${100+b}🪙`:`+100🪙`});
      setTimeout(()=>{setFb(null);prevLen.current=0;if(ref.current)ref.current.value="";
        if(step===0){setStep(1)}else{setStep(0);
          if(idx+1<lines.length)setIdx(idx+1);
          else{const fs=score+1;const tl=lines.length*2;if(fs===tl)addCoin(50);reportDone({page:pg.p,lesson:pg.l,title:pg.t,score:fs,total:tl,maxCombo:mxCombo});setTodayDone(d=>[...d,pg.p]);setPhase(2)}}
      },900);
      return;
    }
    // 2차: 90% 글자 비교
    const tC=[...normT];const gC=[...normG];let m=0;const len=Math.min(tC.length,gC.length);
    for(let i=0;i<len;i++)if(tC[i]===gC[i])m++;
    const acc=gC.length>0?m/gC.length:0;
    if(acc>=0.9){
      okSound();setScore(s=>s+1);setTot(x=>x+1);setCombo(c=>{const n=c+1;if(n>mxCombo)setMxCombo(n);return n});const b=combo>=4?50:0;addCoin(100+b);setFb({ok:true,msg:`${Math.round(acc*100)}% 통과! +${100+b}🪙`});
      setTimeout(()=>{setFb(null);prevLen.current=0;if(ref.current)ref.current.value="";
        if(step===0){setStep(1)}else{setStep(0);
          if(idx+1<lines.length)setIdx(idx+1);
          else{const fs=score+1;const tl=lines.length*2;if(fs===tl)addCoin(50);reportDone({page:pg.p,lesson:pg.l,title:pg.t,score:fs,total:tl,maxCombo:mxCombo});setTodayDone(d=>[...d,pg.p]);setPhase(2)}}
      },900);
    } else {
      setCombo(0);setFb({ok:false,msg:`${Math.round(acc*100)}% — 다시 치세요`});
      setTimeout(()=>{setFb(null);prevLen.current=0;if(ref.current)ref.current.value=""},1200);
    }
  };

  const fps=search.trim()?P.filter(p=>String(p.p).includes(search.trim())||p.t.toLowerCase().includes(search.trim().toLowerCase())||p.l.toLowerCase().includes(search.trim().toLowerCase())):P;
  const box={maxWidth:720,margin:"0 auto",minHeight:"100dvh",display:"flex",flexDirection:"column",fontFamily:F,background:C.bg,color:C.txt};

  const lv=(()=>{if(tot>=500)return{n:"영어 마스터",e:"👑",nx:null};if(tot>=300)return{n:"영어 박사",e:"🎓",nx:500};if(tot>=150)return{n:"번개 타자",e:"⚡",nx:300};if(tot>=80)return{n:"타자 고수",e:"🔥",nx:150};if(tot>=30)return{n:"열심 학생",e:"📚",nx:80};if(tot>=10)return{n:"타자 견습생",e:"✏️",nx:30};return{n:"초보 타자",e:"🐣",nx:10}})();

  // ═══ 목록 ═══
  if(phase===0)return(
    <div style={box}>
      <style>{`@keyframes fadeUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}`}</style>
      <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.bdr}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontSize:12,letterSpacing:3,color:C.mute}}>STELLA ENGLISH</div><div style={{fontSize:22,fontWeight:800}}>영어 따라치기</div></div>
          <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:16}}>🪙</span><span style={{fontSize:18,fontWeight:800,color:C.gold}}>{coin.toLocaleString()}</span></div>
        </div>
        <div style={{background:C.card,borderRadius:14,padding:"14px 18px",marginBottom:12,border:`1px solid ${C.bdr}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:24}}>{lv.e}</span>
              <div><div style={{fontSize:15,fontWeight:700}}>스텔라</div><div style={{fontSize:12,color:C.en,fontWeight:600}}>{lv.n}</div></div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:C.dim}}>오늘 목표</div>
              <div style={{fontSize:18,fontWeight:800,color:todayDone.length>=1?C.ok:C.mute}}>{todayDone.length>=1?"✅ 달성!":`${todayDone.length}/1`}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:16,fontSize:12,color:C.dim}}>
            <div>✅ 총 <span style={{color:C.ok,fontWeight:700}}>{tot}</span>문장</div>
            {lv.nx&&<div>다음 레벨 <span style={{color:C.en,fontWeight:700}}>{lv.nx-tot}</span>문장</div>}
          </div>
          {lv.nx&&<div style={{marginTop:6,height:4,borderRadius:2,background:"rgba(255,255,255,0.06)"}}><div style={{height:"100%",borderRadius:2,background:C.en,width:`${Math.min(100,(tot/lv.nx)*100)}%`}}/></div>}
        </div>

        {/* 🎁 선물 교환 카드 */}
        <div style={{background:C.card,borderRadius:14,padding:"14px 18px",marginBottom:12,border:`1px solid ${C.bdr}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:C.gold}}>🎁 선물 교환</div>
              {coin>=20000?(
                <div style={{fontSize:13,color:C.ok,fontWeight:600,marginTop:4}}>20,000점 달성! 선물 교환 가능!</div>
              ):(
                <div style={{fontSize:13,color:C.dim,marginTop:4}}>
                  <span style={{color:C.gold,fontWeight:700}}>{(20000-coin).toLocaleString()}</span>점 더 모으면 선물! 힘내 💪
                </div>
              )}
              <div style={{marginTop:6,height:6,borderRadius:3,background:"rgba(255,255,255,0.06)"}}>
                <div style={{height:"100%",borderRadius:3,background:C.gold,width:`${Math.min(100,(coin/20000)*100)}%`,transition:"width 0.3s"}}/>
              </div>
              <div style={{fontSize:11,color:C.mute,marginTop:4}}>{coin.toLocaleString()} / 20,000</div>
            </div>
            <button onClick={()=>{
              if(coin>=20000)setGiftModal("confirm");
              else setGiftModal("fail");
            }} style={{marginLeft:14,background:coin>=20000?C.gold:"rgba(255,255,255,0.06)",border:"none",borderRadius:10,padding:"10px 16px",fontSize:13,fontWeight:700,color:coin>=20000?"#0a0e1a":C.mute,cursor:"pointer",whiteSpace:"nowrap"}}>
              🎁 교환
            </button>
          </div>
        </div>

        {/* 선물 교환 모달 */}
        {giftModal&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setGiftModal(null)}>
          <div style={{background:C.card,borderRadius:20,padding:"32px 28px",maxWidth:360,width:"90%",textAlign:"center",border:`1px solid ${C.bdr}`}} onClick={e=>e.stopPropagation()}>
            {giftModal==="confirm"&&<>
              <div style={{fontSize:48,marginBottom:12}}>🎁</div>
              <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>선물 교환 요청</div>
              <div style={{fontSize:14,color:C.dim,marginBottom:20}}>20,000점을 사용하여 선물을 요청할까요?</div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setGiftModal(null)} style={{flex:1,background:"transparent",border:`1px solid ${C.dim}`,borderRadius:10,padding:"12px",fontSize:14,color:C.dim,cursor:"pointer",fontFamily:F}}>취소</button>
                <button onClick={()=>{
                  setCoin(c=>c-20000);
                  fetch("/api/report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:new Date().toISOString().split("T")[0],page:0,lesson:"GIFT",title:"선물 교환 요청",score:20000,total:20000,maxCombo:0})}).catch(()=>{});
                  setGiftModal("success");
                }} style={{flex:1,background:C.gold,border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:700,color:"#0a0e1a",cursor:"pointer",fontFamily:F}}>요청하기</button>
              </div>
            </>}
            {giftModal==="success"&&<>
              <div style={{fontSize:48,marginBottom:12}}>🎉</div>
              <div style={{fontSize:18,fontWeight:700,color:C.ok,marginBottom:8}}>선물 요청 완료!</div>
              <div style={{fontSize:14,color:C.dim,marginBottom:20}}>아빠한테 알림이 갔어요! 기다려 주세요 🥰</div>
              <button onClick={()=>setGiftModal(null)} style={{background:C.ok,border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,color:"#0a0e1a",cursor:"pointer",fontFamily:F}}>확인</button>
            </>}
            {giftModal==="fail"&&<>
              <div style={{fontSize:48,marginBottom:12}}>😅</div>
              <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>아직이야!</div>
              <div style={{fontSize:14,color:C.dim,marginBottom:8}}>20,000점이 필요해요</div>
              <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:20}}>지금 {coin.toLocaleString()}점 · <span style={{color:C.no}}>{(20000-coin).toLocaleString()}점 부족</span></div>
              <div style={{fontSize:14,color:C.dim,marginBottom:20}}>조금만 더 힘내! 할 수 있어 💪</div>
              <button onClick={()=>setGiftModal(null)} style={{background:C.en,border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,color:"#0a0e1a",cursor:"pointer",fontFamily:F}}>알겠어!</button>
            </>}
          </div>
        </div>}

        {/* 오늘의 수업 카드 */}
        {(()=>{
          const lastIdx=parseInt(localStorage.getItem("stella_lastIdx")||"-1");
          const nextIdx=todayDone.length>0?(lastIdx+1<P.length?lastIdx+1:0):(lastIdx>=0?lastIdx+1:0);
          const nextPg=P[Math.min(nextIdx,P.length-1)];
          const isDone=todayDone.length>=1;
          return(
            <div style={{background:isDone?"rgba(74,222,128,0.08)":"rgba(96,165,250,0.1)",borderRadius:14,padding:"16px 18px",marginBottom:12,border:`1px solid ${isDone?"rgba(74,222,128,0.2)":"rgba(96,165,250,0.2)"}`,cursor:isDone?"default":"pointer"}}
              onClick={()=>{if(!isDone){setPi(Math.min(nextIdx,P.length-1));reset();setPhase(1)}}}>
              {isDone?(
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:20}}>🎉</div>
                  <div style={{fontSize:16,fontWeight:700,color:C.ok}}>오늘의 과제 완료!</div>
                  <div style={{fontSize:13,color:C.dim,marginTop:4}}>잘했어 스텔라! 내일 또 만나자</div>
                </div>
              ):(
                <div>
                  <div style={{fontSize:12,color:C.en,fontWeight:600,marginBottom:6}}>📚 오늘의 수업</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:17,fontWeight:700,color:C.txt}}>p.{nextPg.p} · {nextPg.t}</div>
                      <div style={{fontSize:13,color:C.dim,marginTop:2}}>{nextPg.l} · {nextPg.s.length}문장</div>
                    </div>
                    <div style={{background:C.en,borderRadius:10,padding:"8px 18px",fontSize:14,fontWeight:700,color:"#0a0e1a"}}>시작 →</div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 페이지 번호 검색 (예: 50)" style={{width:"100%",boxSizing:"border-box",background:C.cardL,border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 14px",fontSize:14,fontFamily:F,color:C.txt,outline:"none"}}/>
      </div>
      <div style={{flex:1,padding:"12px 20px",overflowY:"auto"}}>
        {fps.map(p=>{const ri=P.indexOf(p);const done=todayDone.includes(p.p);return(
          <button key={p.p+p.t} onClick={()=>{setPi(ri);reset();setPhase(1)}} style={{background:done?"rgba(74,222,128,0.06)":C.card,border:`1px solid ${done?"rgba(74,222,128,0.2)":C.bdr}`,borderRadius:14,padding:"14px 18px",cursor:"pointer",textAlign:"left",width:"100%",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{background:C.enBg,border:`1px solid ${C.en}33`,borderRadius:6,padding:"2px 8px",fontSize:12,color:C.en,fontWeight:700}}>p.{p.p}</div>
                <div style={{fontSize:11,color:C.mute}}>{p.l}</div>
              </div>
              <div style={{fontSize:11,color:done?C.ok:C.dim}}>{done?"✅":`${p.s.length}문장`}</div>
            </div>
            <div style={{fontSize:14,fontWeight:600,color:C.txt,marginTop:6}}>{p.t}</div>
          </button>
        )})}
      </div>
    </div>
  );

  // ═══ 진행 — 투명 글자 가이드 ═══
  if(phase===1)return(
    <div style={box}>
      <style>{`@keyframes fadeUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      <div style={{padding:"12px 20px",borderBottom:`1px solid ${C.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <button onClick={()=>{setPhase(0);reset()}} style={{background:"none",border:"none",color:C.dim,fontSize:13,cursor:"pointer",fontFamily:F}}>← 목록</button>
        <div style={{fontSize:12,color:step===0?C.en:C.kr,fontWeight:600}}>p.{pg.p} · {step===0?"🇺🇸 영어":"🇰🇷 한글"}</div>
        <div style={{fontSize:12,color:C.dim}}>{idx+1}/{lines.length}</div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 20px",background:"rgba(251,191,36,0.04)",borderBottom:`1px solid ${C.bdr}`}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <span style={{fontSize:14}}>🪙</span><span style={{fontSize:14,fontWeight:700,color:C.gold}}>{coin.toLocaleString()}</span>
          {coinAnim&&<span style={{fontSize:12,color:C.ok,fontWeight:700,animation:"fadeUp 0.8s ease-out forwards"}}>+{coinAnim}</span>}
        </div>
        {combo>0&&<div style={{fontSize:12,color:C.combo,fontWeight:700}}>🔥 {combo}{combo>=5?"!!":combo>=3?"!":""}</div>}
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",padding:20,justifyContent:"center"}}>
        <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:16}}>
          {Array.from({length:lines.length},(_,i)=><div key={i} style={{width:i===idx?18:6,height:6,borderRadius:3,background:i<=idx?C.en:"rgba(255,255,255,0.08)",opacity:i<idx?0.4:1}}/>)}
        </div>

        {/* 단어장 */}
        {pg.w&&pg.w.length>0&&<div style={{background:"rgba(96,165,250,0.06)",borderRadius:12,padding:"10px 16px",marginBottom:10,border:"1px solid rgba(96,165,250,0.12)"}}>
          <div style={{fontSize:13,color:C.en,fontWeight:600,marginBottom:8}}>📖 단어장</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"6px 16px"}}>
            {pg.w.map((wd,i)=><div key={i} style={{fontSize:14,color:C.dim}}><span style={{color:C.en,fontWeight:600}}>{wd.e}</span> {wd.k}</div>)}
          </div>
        </div>}

        {/* 문장 카드 */}
        <div style={{background:C.card,borderRadius:16,padding:"20px 24px",marginBottom:12,border:`1px solid ${C.bdr}`}}>
          <div style={{fontSize:22,fontWeight:700,lineHeight:1.7,color:C.en}}>{cur.e}</div>
          <div style={{fontSize:18,color:C.kr,lineHeight:1.5,marginTop:6}}>{cur.k}</div>
          <button onClick={()=>speak(cur.e,"en-US")} style={{background:C.enBg,border:`1px solid ${C.en}33`,borderRadius:8,padding:"6px 16px",cursor:"pointer",marginTop:10,fontSize:13,color:C.en,fontFamily:F}}>🔊 한번 더 듣기</button>
        </div>

        <div style={{fontSize:14,color:step===0?C.en:C.kr,fontWeight:600,marginBottom:8,textAlign:"center"}}>{step===0?"🇺🇸 영어를 따라 치세요":"🇰🇷 한글 해석을 따라 치세요"}</div>

        {/* 투명 글자 가이드 — DOM 직접 조작 */}
        <div style={{background:C.cardL,borderRadius:12,padding:"16px 18px",border:`1.5px solid ${fb?(fb.ok?C.ok:C.no):"rgba(255,255,255,0.1)"}`,minHeight:56,position:"relative",cursor:"text"}} onClick={()=>ref.current?.focus()}>
          <div ref={guideRef} style={{fontSize:24,lineHeight:1.8,wordBreak:"break-all",minHeight:36,position:"relative"}}>
            {[...target].map((ch,i)=>
              <span key={i} style={{position:"relative",display:"inline"}}>
                <span data-cur="1" style={{borderLeft:`2px solid ${step===0?C.en:C.kr}`,animation:"blink 1s infinite",display:i===0&&!fb?"inline":"none"}}/>
                {/* 가이드 글자 (항상 보임) */}
                <span data-gi="1" data-ch={ch} style={{color:C.ghost,fontWeight:400}}>{ch}</span>
                {/* 입력 글자 (위에 덮어쓰기) */}
                <span data-ti="1" style={{position:"absolute",left:0,top:0,color:"transparent",fontWeight:700}}></span>
              </span>
            )}
          </div>
          <input ref={ref} defaultValue=""
            onCompositionStart={()=>{compRef.current=true}} onCompositionEnd={()=>{compRef.current=false}}
            onKeyDown={e=>{if(e.key==="Enter"&&!compRef.current)submit()}}
            style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",opacity:0,fontSize:24,fontFamily:F}} autoComplete="off" spellCheck={false} autoCapitalize="off"/>
        </div>

        {fb&&<div style={{marginTop:12,padding:"12px 16px",borderRadius:10,textAlign:"center",background:fb.ok?"rgba(74,222,128,0.1)":"rgba(248,113,113,0.08)",color:fb.ok?C.ok:C.no,fontSize:16,fontWeight:600}}>{fb.ok?"✓ ":"정답: "}{fb.msg}</div>}
        {!fb&&<button onClick={submit} style={{background:C.enBg,border:`1.5px solid ${C.en}`,borderRadius:10,color:C.en,padding:"13px",fontSize:16,fontFamily:F,cursor:"pointer",fontWeight:600,width:"100%",marginTop:14}}>확인 (Enter)</button>}
      </div>
    </div>
  );

  // ═══ 결과 ═══
  if(phase===2){const tl=lines.length*2;const pct=Math.round((score/tl)*100);return(
    <div style={box}>
      <style>{`@keyframes fadeUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}`}</style>
      <div style={{flex:1,display:"flex",flexDirection:"column",padding:"32px 24px",justifyContent:"center"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:48}}>{pct>=80?"🎉":pct>=50?"👍":"💪"}</div>
          <div style={{fontSize:30,fontWeight:800,color:C.en}}>{pct}점</div>
          <div style={{fontSize:14,color:C.dim,marginTop:4}}>p.{pg.p} · {pg.t}</div>
          <div style={{fontSize:12,color:C.ok,marginTop:8}}>📋 학습 기록 저장됨</div>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          {[{l:"정답",v:`${score}/${tl}`,c:C.ok},{l:"최대콤보",v:`${mxCombo}🔥`,c:C.combo}].map(s=>
            <div key={s.l} style={{flex:1,background:C.card,borderRadius:12,padding:"12px",textAlign:"center",border:`1px solid ${C.bdr}`}}>
              <div style={{fontSize:11,color:C.mute,marginBottom:4}}>{s.l}</div>
              <div style={{fontSize:18,fontWeight:700,color:s.c}}>{s.v}</div>
            </div>
          )}
        </div>
        {pct===100&&<div style={{textAlign:"center",padding:"10px",background:C.goldBg,borderRadius:10,marginBottom:14,fontSize:14,color:C.gold,fontWeight:600}}>🏆 만점 보너스 +50🪙</div>}
        <div style={{textAlign:"center",marginBottom:18}}><span style={{fontSize:18}}>🪙</span><span style={{fontSize:22,fontWeight:800,color:C.gold,marginLeft:6}}>{coin.toLocaleString()}</span></div>
        {todayDone.length>=1&&<div style={{textAlign:"center",padding:"20px",background:"rgba(74,222,128,0.12)",borderRadius:14,marginBottom:14,border:"1px solid rgba(74,222,128,0.3)"}}>
          <div style={{fontSize:36,marginBottom:6}}>🎉</div>
          <div style={{fontSize:18,fontWeight:800,color:C.ok}}>오늘의 과제 완료!</div>
          <div style={{fontSize:13,color:C.dim,marginTop:4}}>오늘 {todayDone.length}페이지 완료 · 내일 또 만나요</div>
        </div>}
        {errors.length>0&&<div style={{marginBottom:16,maxHeight:180,overflowY:"auto"}}>
          <div style={{fontSize:12,color:C.no,fontWeight:600,marginBottom:6}}>틀린 것 다시 보기</div>
          {errors.map((e,i)=><div key={i} style={{background:C.card,borderRadius:10,padding:"10px 14px",marginBottom:5,border:`1px solid ${C.bdr}`}}>
            <div style={{fontSize:13,color:C.en}}>{e.en}</div><div style={{fontSize:12,color:C.kr}}>✓ {e.kr}</div><div style={{fontSize:12,color:C.no}}>✗ {e.typed}</div>
          </div>)}
        </div>}
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>{reset();setPhase(1)}} style={{flex:1,background:"transparent",border:`1.5px solid ${C.en}`,borderRadius:10,color:C.en,padding:"11px",fontSize:14,fontFamily:F,cursor:"pointer",fontWeight:600}}>다시 하기</button>
          <button onClick={()=>{setPhase(0);reset()}} style={{flex:1,background:"transparent",border:`1.5px solid ${C.dim}`,borderRadius:10,color:C.dim,padding:"11px",fontSize:14,fontFamily:F,cursor:"pointer",fontWeight:600}}>다른 페이지</button>
        </div>
      </div>
    </div>
  );}
  return null;
}
