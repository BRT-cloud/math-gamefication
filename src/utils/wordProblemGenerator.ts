import { Problem } from './mathGenerator';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateWordProblem(stage: number): Problem {
  let question = '';
  let answer = '';
  let hint = '';

  const names = ['철수', '영희', '민수', '지민', '동현', '수진'];
  const name1 = names[getRandomInt(0, names.length - 1)];
  let name2 = names[getRandomInt(0, names.length - 1)];
  while (name1 === name2) {
    name2 = names[getRandomInt(0, names.length - 1)];
  }

  switch (stage) {
    case 1: {
      const a = getRandomInt(10, 89);
      const b = getRandomInt(10, 89);
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        question = `${name1}는 사탕을 ${a}개 가지고 있습니다. ${name2}가 ${b}개를 더 주었습니다. ${name1}가 가진 사탕은 모두 몇 개일까요?`;
        answer = (a + b).toString();
        hint = `${a} + ${b} 를 계산해보세요.`;
      } else {
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        question = `${name1}는 구슬을 ${max}개 가지고 있었습니다. 그 중 ${min}개를 친구에게 주었습니다. 남은 구슬은 몇 개일까요?`;
        answer = (max - min).toString();
        hint = `${max} - ${min} 을 계산해보세요.`;
      }
      break;
    }
    case 2: {
      const a = getRandomInt(100, 899);
      const b = getRandomInt(100, 899);
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        question = `우리 학교 도서관에는 동화책이 ${a}권, 위인전이 ${b}권 있습니다. 두 종류의 책은 모두 합쳐서 몇 권일까요?`;
        answer = (a + b).toString();
        hint = `${a} + ${b} 를 계산해보세요.`;
      } else {
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        question = `과수원에서 사과를 ${max}개 수확했습니다. 그 중 ${min}개를 시장에 팔았습니다. 남은 사과는 몇 개일까요?`;
        answer = (max - min).toString();
        hint = `${max} - ${min} 을 계산해보세요.`;
      }
      break;
    }
    case 3: {
      const isMul = Math.random() > 0.5;
      if (isMul) {
        const a = getRandomInt(2, 9);
        const b = getRandomInt(2, 9);
        question = `한 상자에 딸기가 ${a}개씩 들어있습니다. ${b}상자에 들어있는 딸기는 모두 몇 개일까요?`;
        answer = (a * b).toString();
        hint = `${a} \\times ${b} 를 계산해보세요.`;
      } else {
        const b = getRandomInt(2, 9);
        const ans = getRandomInt(2, 9);
        const a = b * ans;
        question = `쿠키 ${a}개를 ${b}명의 친구가 똑같이 나누어 먹으려고 합니다. 한 명당 몇 개씩 먹을 수 있을까요?`;
        answer = ans.toString();
        hint = `${a} \\div ${b} 를 계산해보세요.`;
      }
      break;
    }
    case 4: {
      const a = getRandomInt(1000, 8999);
      const b = getRandomInt(1000, 8999);
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        question = `놀이공원에 어제는 ${a}명, 오늘은 ${b}명이 방문했습니다. 이틀 동안 방문한 사람은 모두 몇 명일까요?`;
        answer = (a + b).toString();
        hint = `${a} + ${b} 를 계산해보세요.`;
      } else {
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        question = `어떤 전자기기의 원래 가격은 ${max}원인데, 오늘만 ${min}원 할인해서 팝니다. 할인된 가격은 얼마일까요?`;
        answer = (max - min).toString();
        hint = `${max} - ${min} 을 계산해보세요.`;
      }
      break;
    }
    case 5: {
      const shapes = [
        { name: '정삼각형', sides: 3 },
        { name: '정사각형', sides: 4 },
        { name: '정오각형', sides: 5 }
      ];
      const shape = shapes[getRandomInt(0, 2)];
      const length = getRandomInt(3, 15);
      question = `한 변의 길이가 ${length}cm인 ${shape.name} 모양의 텃밭이 있습니다. 이 텃밭의 둘레의 길이는 몇 cm일까요?`;
      answer = (shape.sides * length).toString();
      hint = `${shape.name}은 변이 ${shape.sides}개 있습니다. ${length} \\times ${shape.sides} 를 계산해보세요.`;
      break;
    }
    case 6: {
      const a = getRandomInt(11, 99);
      const b = getRandomInt(2, 9);
      question = `한 버스에 최대 ${a}명이 탈 수 있습니다. 버스 ${b}대에는 최대 몇 명이 탈 수 있을까요?`;
      answer = (a * b).toString();
      hint = `${a} \\times ${b} 를 계산해보세요.`;
      break;
    }
    case 7: {
      const b = getRandomInt(2, 9);
      const minAns = Math.ceil(100 / b);
      const maxAns = Math.floor(999 / b);
      const ans = getRandomInt(minAns, maxAns);
      const a = b * ans;
      question = `색종이 ${a}장을 ${b}학급에 똑같이 나누어 주려고 합니다. 한 학급당 몇 장씩 받을 수 있을까요?`;
      answer = ans.toString();
      hint = `${a} \\div ${b} 를 계산해보세요.`;
      break;
    }
    case 8: {
      const startHour = getRandomInt(1, 11);
      const startMin = getRandomInt(0, 5) * 10;
      const addMin = getRandomInt(1, 5) * 10;
      let endMin = startMin + addMin;
      let endHour = startHour;
      if (endMin >= 60) {
        endMin -= 60;
        endHour += 1;
      }
      if (endHour > 12) endHour -= 12;
      const startMinStr = startMin === 0 ? '00' : startMin.toString();
      const endMinStr = endMin === 0 ? '00' : endMin.toString();
      question = `지금은 ${startHour}시 ${startMinStr}분입니다. ${addMin}분 뒤에는 몇 시 몇 분이 될까요? (예: 2시 5분 -> 205)`;
      answer = `${endHour}${endMinStr.padStart(2, '0')}`;
      hint = `${startMin}분 + ${addMin}분 = ${startMin + addMin}분입니다. 60분이 넘으면 1시간이 올라갑니다.`;
      break;
    }
    case 9: {
      const a = getRandomInt(1, 9) * 1000;
      const b = getRandomInt(1, 9) * 500;
      const c = getRandomInt(1, 5) * 100;
      question = `${name1}는 ${a}원짜리 장난감과 ${b}원짜리 과자, ${c}원짜리 아이스크림을 샀습니다. 모두 얼마를 내야 할까요?`;
      answer = (a + b + c).toString();
      hint = `${a} + ${b} + ${c} 를 계산해보세요.`;
      break;
    }
    case 10: {
      const b = getRandomInt(11, 50);
      const minAns = Math.ceil(100 / b);
      const maxAns = Math.floor(999 / b);
      const ans = getRandomInt(Math.max(2, minAns), Math.min(99, maxAns));
      const a = b * ans;
      question = `강당에 의자 ${a}개가 있습니다. 한 줄에 ${b}개씩 놓으려면 모두 몇 줄이 될까요?`;
      answer = ans.toString();
      hint = `${a} \\div ${b} 를 계산해보세요.`;
      break;
    }
    case 11: {
      const isAdd = Math.random() > 0.5;
      const denom = getRandomInt(4, 10);
      if (isAdd) {
        const num1 = getRandomInt(1, denom - 2);
        const num2 = getRandomInt(1, denom - 1 - num1);
        question = `피자 한 판을 ${denom}조각으로 나누었습니다. ${name1}가 ${num1}조각, ${name2}가 ${num2}조각을 먹었습니다. 두 사람이 먹은 피자는 전체의 몇 분의 몇일까요? (예: 3/8)`;
        answer = `${num1 + num2}/${denom}`;
        hint = `분모가 같으므로 분자끼리 더합니다. ${num1} + ${num2}`;
      } else {
        const num1 = getRandomInt(2, denom - 1);
        const num2 = getRandomInt(1, num1 - 1);
        question = `주스가 병의 ${num1}/${denom} 만큼 있었습니다. 그 중 ${num2}/${denom} 만큼을 마셨습니다. 남은 주스는 전체의 몇 분의 몇일까요? (예: 1/5)`;
        answer = `${num1 - num2}/${denom}`;
        hint = `분모가 같으므로 분자끼리 뺍니다. ${num1} - ${num2}`;
      }
      break;
    }
    case 12: {
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        const a = getRandomInt(1, 9) + getRandomInt(1, 9) / 10;
        const b = getRandomInt(1, 9) + getRandomInt(1, 9) / 10;
        question = `길이가 ${a.toFixed(1)}m인 끈과 ${b.toFixed(1)}m인 끈을 겹치지 않게 이어 붙였습니다. 전체 끈의 길이는 몇 m일까요?`;
        answer = (a + b).toFixed(1).replace(/\.0$/, '');
        hint = `${a.toFixed(1)} + ${b.toFixed(1)} 를 계산해보세요.`;
      } else {
        const a = getRandomInt(5, 9) + getRandomInt(1, 9) / 10;
        const b = getRandomInt(1, 4) + getRandomInt(1, 9) / 10;
        question = `무게가 ${a.toFixed(1)}kg인 수박에서 ${b.toFixed(1)}kg을 잘라 먹었습니다. 남은 수박의 무게는 몇 kg일까요?`;
        answer = (a - b).toFixed(1).replace(/\.0$/, '');
        hint = `${a.toFixed(1)} - ${b.toFixed(1)} 를 계산해보세요.`;
      }
      break;
    }
    case 13: {
      const a = getRandomInt(10, 50);
      const b = getRandomInt(2, 9);
      const c = getRandomInt(2, 9);
      question = `${name1}는 ${a}원을 가지고 있었습니다. ${b}원짜리 연필을 ${c}자루 샀습니다. 남은 돈은 얼마일까요?`;
      answer = (a - b * c).toString();
      hint = `연필의 총 가격을 먼저 구한 뒤, 가진 돈에서 뺍니다. ${a} - (${b} \\times ${c})`;
      break;
    }
    case 14: {
      const a = getRandomInt(10, 30);
      const b = getRandomInt(2, 5);
      const c = getRandomInt(10, 30);
      const d = getRandomInt(2, 5);
      question = `${a}원짜리 지우개 ${b}개와 ${c}원짜리 공책 ${d}권을 샀습니다. 모두 얼마를 내야 할까요?`;
      answer = (a * b + c * d).toString();
      hint = `지우개 가격과 공책 가격을 각각 구한 뒤 더합니다. (${a} \\times ${b}) + (${c} \\times ${d})`;
      break;
    }
    case 15: {
      const a = getRandomInt(50, 100);
      const b = getRandomInt(10, 30);
      const c = getRandomInt(5, 15);
      const d = getRandomInt(2, 5);
      question = `상자에 구슬이 ${a}개 있었습니다. ${name1}가 ${b}개를 넣고, ${name2}가 ${c}개를 더 넣었습니다. 이 구슬들을 ${d}명에게 똑같이 나누어주면 한 명당 몇 개씩 받을까요?`;
      answer = Math.floor((a + b + c) / d).toString();
      hint = `전체 구슬의 개수를 먼저 구한 뒤 인원수로 나눕니다. (${a} + ${b} + ${c}) \\div ${d}`;
      break;
    }
    default:
      question = `테스트 문제입니다. 1 + 1 = ?`;
      answer = '2';
      hint = '1 + 1';
  }

  return {
    id: Date.now().toString() + Math.random().toString(),
    question,
    answer,
    isWordProblem: true,
    hint
  };
}
