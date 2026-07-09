import { Lion } from '../types/lion';

export const initialLions: Lion[] = [
  {
    id: "1",
    name: "박효연",
    part: "Frontend",
    intro: "안녕하세요",
    email: "hyoyeon036@gmail.com",
    phone: "010-0100-0100",
    website: "alsdjglaksjga.com",
    skills: ["HTML", "CSS", "JS"],
    motto: "화이팅~^^",
    oneLiner: "이건 나",
    isMe: true
  },
  {
    id: "2",
    name: "Clara Lavigne",
    part: "Frontend",
    intro: "4주차 미션에서 fetch로 데이터를 불러와 상태를 업데이트하는 연습을 하고 있습니다. 비동기로 받은 데이터를 map으로 변환해 UI에 반영하는 흐름을 이해하려고 합니다.",
    email: "clara.lavigne@example.com",
    phone: "O41 L79-6088",
    website: "https://example.com/whitemeercat833",
    skills: ["JavaScript", "React", "HTML/CSS"],
    motto: "데이터가 바뀌면 UI도 바뀐다!",
    oneLiner: "Frontend · Canada Richmond에서 합류했어요!",
    isMe: false
  }
];