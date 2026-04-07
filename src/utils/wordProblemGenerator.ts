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
      const a = getRandomInt(10, 89);
      const b = getRandomInt(10, 89);
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        question = `우리 반 학생은 남학생이 ${a}명, 여학생이 ${b}명입니다. 우리 반 학생은 모두 몇 명일까요?`;
        answer = (a + b).toString();
        hint = `${a} + ${b} 를 계산해보세요.`;
      } else {
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        question = `색종이가 ${max}장 있었습니다. 미술 시간에 ${min}장을 사용했습니다. 남은 색종이는 몇 장일까요?`;
        answer = (max - min).toString();
        hint = `${max} - ${min} 을 계산해보세요.`;
      }
      break;
    }
    case 3: {
      const a = getRandomInt(100, 899);
      const b = getRandomInt(100, 899);
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        question = `도서관에 동화책이 ${a}권, 위인전이 ${b}권 있습니다. 두 종류의 책은 모두 합쳐서 몇 권일까요?`;
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
    case 4: {
      const a = getRandomInt(100, 899);
      const b = getRandomInt(100, 899);
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        question = `어제는 우유를 ${a}mL 마셨고, 오늘은 ${b}mL 마셨습니다. 이틀 동안 마신 우유는 모두 몇 mL일까요?`;
        answer = (a + b).toString();
        hint = `${a} + ${b} 를 계산해보세요.`;
      } else {
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        question = `농장에서 닭을 ${max}마리 기르고 있습니다. 그 중 ${min}마리를 팔았습니다. 남은 닭은 몇 마리일까요?`;
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
      const a = getRandomInt(2, 9);
      const b = getRandomInt(2, 9);
      question = `한 상자에 딸기가 ${a}개씩 들어있습니다. ${b}상자에 들어있는 딸기는 모두 몇 개일까요?`;
      answer = (a * b).toString();
      hint = `${a} \\times ${b} 를 계산해보세요.`;
      break;
    }
    case 7: {
      const a = getRandomInt(10, 99);
      const b = getRandomInt(2, 9);
      question = `한 반에 학생이 ${a}명씩 있습니다. ${b}개 반의 학생은 모두 몇 명일까요?`;
      answer = (a * b).toString();
      hint = `${a} \\times ${b} 를 계산해보세요.`;
      break;
    }
    case 8: {
      const b = getRandomInt(2, 9);
      const ans = getRandomInt(2, 9);
      const a = b * ans;
      question = `쿠키 ${a}개를 ${b}명의 친구가 똑같이 나누어 먹으려고 합니다. 한 명당 몇 개씩 먹을 수 있을까요?`;
      answer = ans.toString();
      hint = `${a} \\div ${b} 를 계산해보세요.`;
      break;
    }
    case 9: {
      const hour = getRandomInt(1, 11);
      const minute = getRandomInt(0, 5) * 10;
      const diff = 30;
      let newMin = minute + diff;
      let newHour = hour;
      if (newMin >= 60) {
        newMin -= 60;
        newHour += 1;
      }
      question = `지금은 ${hour}시 ${minute === 0 ? '정각' : minute + '분'}입니다. ${diff}분 후는 몇 시 몇 분일까요? (예: 2시 30분 -> 230)`;
      answer = `${newHour}${newMin === 0 ? '00' : newMin}`;
      hint = "시간을 숫자로 붙여서 적어주세요.";
      break;
    }
    case 10: {
      const a = getRandomInt(100, 999);
      const b = getRandomInt(100, 999);
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        question = `강당에 의자가 ${a}개 있습니다. 창고에서 ${b}개를 더 가져왔습니다. 의자는 모두 몇 개일까요?`;
        answer = (a + b).toString();
        hint = `${a} + ${b} 를 계산해보세요.`;
      } else {
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        question = `주차장에 차가 ${max}대 있었습니다. 그 중 ${min}대가 빠져나갔습니다. 남은 차는 몇 대일까요?`;
        answer = (max - min).toString();
        hint = `${max} - ${min} 을 계산해보세요.`;
      }
      break;
    }
    case 11: {
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
    case 12: {
      const a = getRandomInt(100, 999);
      const b = getRandomInt(2, 9);
      question = `한 상자에 구슬이 ${a}개씩 들어있습니다. ${b}상자에 들어있는 구슬은 모두 몇 개일까요?`;
      answer = (a * b).toString();
      hint = `${a} \\times ${b} 를 계산해보세요.`;
      break;
    }
    case 13: {
      const a = getRandomInt(10, 99);
      const b = getRandomInt(10, 99);
      question = `한 상자에 과자가 ${a}봉지씩 들어있습니다. ${b}상자에 들어있는 과자는 모두 몇 봉지일까요?`;
      answer = (a * b).toString();
      hint = `${a} \\times ${b} 를 계산해보세요.`;
      break;
    }
    case 14: {
      const b = getRandomInt(2, 9);
      const ans = getRandomInt(10, 110);
      const rem = getRandomInt(1, b - 1);
      const a = b * ans + rem;
      question = `색종이 ${a}장을 ${b}명에게 똑같이 나누어 주려고 합니다. 나누어 주고 남는 색종이는 몇 장일까요?`;
      answer = rem.toString();
      hint = `${a} \\div ${b} 의 나머지를 구해보세요.`;
      break;
    }
    case 15: {
      const price = getRandomInt(1, 9) * 100 + getRandomInt(1, 9) * 10;
      const pay = 1000;
      question = `슈퍼에서 ${price}원짜리 아이스크림을 사고 ${pay}원을 냈습니다. 거스름돈으로 얼마를 받아야 할까요?`;
      answer = (pay - price).toString();
      hint = `${pay} - ${price} 를 계산해보세요.`;
      break;
    }
    case 16: {
      const den = getRandomInt(3, 9);
      const num1 = getRandomInt(1, den - 1);
      const num2 = getRandomInt(1, den - num1);
      question = `피자 한 판을 ${den}조각으로 나누었습니다. ${name1}가 ${num1}조각을 먹고, ${name2}가 ${num2}조각을 먹었습니다. 두 사람이 먹은 피자는 전체의 몇 분의 몇일까요? (분자만 적으세요)`;
      answer = (num1 + num2).toString();
      hint = "분모가 같으므로 분자끼리 더하면 됩니다.";
      break;
    }
    case 17: {
      const a = getRandomInt(1, 99) / 10;
      const b = getRandomInt(1, 99) / 10;
      question = `물통에 물이 ${a.toFixed(1)}L 있었습니다. 여기에 ${b.toFixed(1)}L를 더 부었습니다. 물통에 있는 물은 모두 몇 L일까요?`;
      answer = (a + b).toFixed(1);
      hint = `${a.toFixed(1)} + ${b.toFixed(1)} 를 계산해보세요.`;
      break;
    }
    case 18: {
      const a = getRandomInt(2, 9);
      const b = getRandomInt(2, 9);
      const c = getRandomInt(10, 50);
      question = `${name1}는 사탕을 ${c}개 가지고 있고, ${name2}는 사탕을 ${a}개씩 ${b}봉지 가지고 있습니다. 두 사람이 가진 사탕은 모두 몇 개일까요?`;
      answer = (c + a * b).toString();
      hint = `${c} + ${a} \\times ${b} 를 계산해보세요.`;
      break;
    }
    case 19: {
      const a = getRandomInt(2, 9);
      const b = getRandomInt(2, 9);
      const c = getRandomInt(10, 50);
      const d = getRandomInt(5, 20);
      question = `구슬이 ${c}개 있었습니다. 그 중 ${d}개를 잃어버렸습니다. 그 후 친구에게 구슬을 ${a}개씩 ${b}묶음 받았습니다. 지금 있는 구슬은 모두 몇 개일까요?`;
      answer = (c - d + a * b).toString();
      hint = `${c} - ${d} + ${a} \\times ${b} 를 계산해보세요.`;
      break;
    }
    case 20: {
      const a = getRandomInt(2, 9);
      const b = getRandomInt(2, 9);
      const c = getRandomInt(2, 9);
      question = `한 상자에 사과가 ${b}개, 배가 ${c}개 들어있습니다. 이런 상자가 ${a}개 있다면, 과일은 모두 몇 개일까요?`;
      answer = (a * (b + c)).toString();
      hint = `${a} \\times (${b} + ${c}) 를 계산해보세요.`;
      break;
    }
    default:
      question = `${name1}는 사과를 1개, ${name2}는 사과를 1개 가지고 있습니다. 모두 합치면 몇 개일까요?`;
      answer = '2';
      hint = '1 + 1 을 계산해보세요.';
  }

  return {
    id: `wp_${stage}_${Date.now()}_${getRandomInt(0, 1000)}`,
    question,
    answer,
    isWordProblem: true,
    hint
  };
}
