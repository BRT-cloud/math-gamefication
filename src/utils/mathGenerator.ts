export type Problem = {
  id: string;
  question: string; // HTML or custom format for rendering
  answer: string;
  svgType?: 'polygon' | 'angle' | 'prism' | 'circle' | 'clock';
  svgParams?: any;
  unitOptions?: string[];
  answerUnit?: string;
  isWordProblem?: boolean;
  hint?: string;
};

import { generateWordProblem } from './wordProblemGenerator';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateProblems(stage: number, count: number = 10): Problem[] {
  const problems: Problem[] = [];

  if (stage > 100) {
    // Mid-Boss or Final Boss
    let stagesToMix: number[] = [];
    if (stage === 101) stagesToMix = [1, 2, 3, 4, 5];
    else if (stage === 102) stagesToMix = [6, 7, 8, 9, 10];
    else if (stage === 103) stagesToMix = [11, 12, 13, 14, 15];
    else if (stage === 104) stagesToMix = Array.from({length: 20}, (_, i) => i + 1);

    for (let i = 0; i < count; i++) {
      const randomStage = stagesToMix[Math.floor(Math.random() * stagesToMix.length)];
      problems.push(generateWordProblem(randomStage));
    }
    return problems;
  }

  for (let i = 0; i < count; i++) {
    if (i === count - 1) {
      problems.push(generateWordProblem(stage));
      continue;
    }

    let question = '';
    let answer = '';
    let svgType: Problem['svgType'];
    let svgParams: any;
    let unitOptions: string[] | undefined;
    let answerUnit: string | undefined;
    let hint: string | undefined;

    switch (stage) {
      case 1: {
        // L1: 두 자리 수 덧셈 (받아올림 X)
        const a1 = getRandomInt(1, 8);
        const a2 = getRandomInt(1, 8);
        const b1 = getRandomInt(1, 9 - a1);
        const b2 = getRandomInt(1, 9 - a2);
        const a = a1 * 10 + a2;
        const b = b1 * 10 + b2;
        question = `${a} + ${b} = ?`;
        answer = (a + b).toString();
        hint = "일의 자리는 일의 자리끼리, 십의 자리는 십의 자리끼리 더하세요.";
        break;
      }
      case 2: {
        // L2: 두 자리 수 덧셈/뺄셈 (받아올림/내림 O)
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
          const a1 = getRandomInt(1, 8);
          const a2 = getRandomInt(2, 9);
          const b1 = getRandomInt(1, 8 - a1);
          const b2 = getRandomInt(10 - a2, 9);
          const a = a1 * 10 + a2;
          const b = b1 * 10 + b2;
          question = `${a} + ${b} = ?`;
          answer = (a + b).toString();
        } else {
          const a1 = getRandomInt(2, 9);
          const a2 = getRandomInt(1, 8);
          const b1 = getRandomInt(1, a1 - 1);
          const b2 = getRandomInt(a2 + 1, 9);
          const a = a1 * 10 + a2;
          const b = b1 * 10 + b2;
          question = `${a} - ${b} = ?`;
          answer = (a - b).toString();
        }
        hint = "받아올림이나 받아내림에 주의하세요.";
        break;
      }
      case 3: {
        // L3: 세 자리 수 덧셈/뺄셈 기초 (받아올림/내림 X)
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
          const a1 = getRandomInt(1, 8);
          const a2 = getRandomInt(1, 8);
          const a3 = getRandomInt(1, 8);
          const b1 = getRandomInt(1, 9 - a1);
          const b2 = getRandomInt(1, 9 - a2);
          const b3 = getRandomInt(1, 9 - a3);
          const a = a1 * 100 + a2 * 10 + a3;
          const b = b1 * 100 + b2 * 10 + b3;
          question = `${a} + ${b} = ?`;
          answer = (a + b).toString();
        } else {
          const a1 = getRandomInt(2, 9);
          const a2 = getRandomInt(2, 9);
          const a3 = getRandomInt(2, 9);
          const b1 = getRandomInt(1, a1 - 1);
          const b2 = getRandomInt(1, a2 - 1);
          const b3 = getRandomInt(1, a3 - 1);
          const a = a1 * 100 + a2 * 10 + a3;
          const b = b1 * 100 + b2 * 10 + b3;
          question = `${a} - ${b} = ?`;
          answer = (a - b).toString();
        }
        hint = "각 자리 숫자를 맞추어 계산하세요.";
        break;
      }
      case 4: {
        // L4: 세 자리 수 덧셈/뺄셈 심화 (받아올림/내림 O)
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
          const a = getRandomInt(100, 899);
          const b = getRandomInt(100, 999 - a);
          question = `${a} + ${b} = ?`;
          answer = (a + b).toString();
        } else {
          const a = getRandomInt(200, 999);
          const b = getRandomInt(100, a - 1);
          question = `${a} - ${b} = ?`;
          answer = (a - b).toString();
        }
        hint = "받아올림과 받아내림을 잊지 마세요.";
        break;
      }
      case 5: {
        // L5: 도형(삼각형, 사각형, 오각형) 꼭짓점/변 개수 및 길이
        const shapes = [
          { name: '삼각형', count: 3 },
          { name: '사각형', count: 4 },
          { name: '오각형', count: 5 }
        ];
        const shape = shapes[getRandomInt(0, 2)];
        const type = getRandomInt(0, 2);
        if (type === 0) {
          question = `${shape.name}의 꼭짓점은 몇 개인가요?`;
          answer = shape.count.toString();
        } else if (type === 1) {
          question = `${shape.name}의 변은 몇 개인가요?`;
          answer = shape.count.toString();
        } else {
          const length = getRandomInt(3, 15);
          question = `한 변의 길이가 ${length}cm인 정${shape.name}의 모든 변의 길이의 합은 몇 cm인가요?`;
          answer = (shape.count * length).toString();
        }
        hint = "도형의 이름에 힌트가 있습니다.";
        break;
      }
      case 6: {
        // L6: 구구단 전 범위
        const a = getRandomInt(2, 9);
        const b = getRandomInt(2, 9);
        question = `${a} \\times ${b} = ?`;
        answer = (a * b).toString();
        hint = "구구단을 외워보세요.";
        break;
      }
      case 7: {
        // L7: (두 자리 수) × (한 자리 수)
        const a = getRandomInt(10, 99);
        const b = getRandomInt(2, 9);
        question = `${a} \\times ${b} = ?`;
        answer = (a * b).toString();
        hint = "일의 자리부터 차례대로 곱하세요.";
        break;
      }
      case 8: {
        // L8: 나눗셈 기초 (몫 한 자리, 나머지 X)
        const b = getRandomInt(2, 9);
        const ans = getRandomInt(2, 9);
        const a = b * ans;
        question = `${a} \\div ${b} = ?`;
        answer = ans.toString();
        hint = "구구단을 거꾸로 생각해보세요.";
        break;
      }
      case 9: {
        // L9: 시계 읽기 및 시간 계산 (30분 전/후 등)
        const hour = getRandomInt(1, 12);
        const minute = getRandomInt(0, 11) * 5; // 0, 5, 10...
        const isAfter = Math.random() > 0.5;
        const diff = 30;
        
        let newMin = isAfter ? minute + diff : minute - diff;
        let newHour = hour;
        if (newMin >= 60) {
          newMin -= 60;
          newHour += 1;
        } else if (newMin < 0) {
          newMin += 60;
          newHour -= 1;
        }
        if (newHour > 12) newHour -= 12;
        if (newHour <= 0) newHour += 12;

        const timeStr = `${hour}시 ${minute === 0 ? '정각' : minute + '분'}`;
        question = `${timeStr}에서 ${diff}분 ${isAfter ? '후' : '전'}은 몇 시 몇 분일까요? (예: 2시 30분 -> 230)`;
        answer = `${newHour}${newMin === 0 ? '00' : newMin}`;
        hint = "시간을 숫자로 붙여서 적어주세요.";
        break;
      }
      case 10: {
        // L10: 세 자리 수 덧셈/뺄셈 문장제 응용 (일반 문제로 대체, 마지막 문제는 wordProblemGenerator에서)
        const a = getRandomInt(100, 999);
        const b = getRandomInt(100, 999);
        question = `${a} + ${b} - 100 = ?`;
        answer = (a + b - 100).toString();
        hint = "차례대로 계산하세요.";
        break;
      }
      case 11: {
        // L11: 네 자리 수 연산 및 크기 비교
        const type = getRandomInt(0, 1);
        if (type === 0) {
          const a = getRandomInt(1000, 8999);
          const b = getRandomInt(1000, 9999 - a);
          question = `${a} + ${b} = ?`;
          answer = (a + b).toString();
        } else {
          const a = getRandomInt(1000, 9999);
          const b = getRandomInt(1000, 9999);
          const max = Math.max(a, b);
          question = `${a}와 ${b} 중 더 큰 수는 무엇인가요?`;
          answer = max.toString();
        }
        hint = "각 자리 숫자를 잘 확인하세요.";
        break;
      }
      case 12: {
        // L12: (세 자리 수) × (한 자리 수)
        const a = getRandomInt(100, 999);
        const b = getRandomInt(2, 9);
        question = `${a} \\times ${b} = ?`;
        answer = (a * b).toString();
        hint = "일의 자리부터 차례대로 곱하세요.";
        break;
      }
      case 13: {
        // L13: (두 자리 수) × (두 자리 수) 기초
        const a = getRandomInt(10, 99);
        const b = getRandomInt(10, 99);
        question = `${a} \\times ${b} = ?`;
        answer = (a * b).toString();
        hint = "세로셈으로 계산해보세요.";
        break;
      }
      case 14: {
        // L14: (세 자리 수) ÷ (한 자리 수) (나머지 O)
        const b = getRandomInt(2, 9);
        const ans = getRandomInt(10, 110);
        const rem = getRandomInt(1, b - 1);
        const a = b * ans + rem;
        question = `${a} \\div ${b} 의 나머지는 얼마인가요?`;
        answer = rem.toString();
        hint = "나머지를 구하는 문제입니다.";
        break;
      }
      case 15: {
        // L15: 화폐 사칙연산 (거스름돈 계산)
        const price = getRandomInt(1, 9) * 100 + getRandomInt(1, 9) * 10;
        const pay = 1000;
        question = `${price}원짜리 물건을 사고 ${pay}원을 냈습니다. 거스름돈은 얼마일까요?`;
        answer = (pay - price).toString();
        hint = "낸 돈에서 물건값을 빼세요.";
        break;
      }
      case 16: {
        // L16: 분수 크기 비교 및 기초 덧셈/뺄셈
        const type = getRandomInt(0, 1);
        const den = getRandomInt(3, 9);
        if (type === 0) {
          const num1 = getRandomInt(1, den - 1);
          const num2 = getRandomInt(1, den - num1);
          question = `\\frac{${num1}}{${den}} + \\frac{${num2}}{${den}} = \\frac{?}{${den}}`;
          answer = (num1 + num2).toString();
          hint = "분모가 같을 때는 분자끼리 더합니다.";
        } else {
          const num1 = getRandomInt(2, den - 1);
          const num2 = getRandomInt(1, num1 - 1);
          question = `\\frac{${num1}}{${den}} - \\frac{${num2}}{${den}} = \\frac{?}{${den}}`;
          answer = (num1 - num2).toString();
          hint = "분모가 같을 때는 분자끼리 뺍니다.";
        }
        break;
      }
      case 17: {
        // L17: 소수 한 자리 수 덧셈/뺄셈
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
          const a = getRandomInt(1, 99) / 10;
          const b = getRandomInt(1, 99) / 10;
          question = `${a.toFixed(1)} + ${b.toFixed(1)} = ?`;
          answer = (a + b).toFixed(1);
        } else {
          const a = getRandomInt(20, 99) / 10;
          const b = getRandomInt(1, a * 10 - 1) / 10;
          question = `${a.toFixed(1)} - ${b.toFixed(1)} = ?`;
          answer = (a - b).toFixed(1);
        }
        hint = "소수점 위치를 맞추어 계산하세요.";
        break;
      }
      case 18: {
        // L18: 혼합계산 1 (기호 2개)
        const a = getRandomInt(2, 9);
        const b = getRandomInt(2, 9);
        const c = getRandomInt(10, 50);
        question = `${c} + ${a} \\times ${b} = ?`;
        answer = (c + a * b).toString();
        hint = "곱셈을 먼저 계산하세요.";
        break;
      }
      case 19: {
        // L19: 혼합계산 2 (기호 3개)
        const a = getRandomInt(2, 9);
        const b = getRandomInt(2, 9);
        const c = getRandomInt(10, 50);
        const d = getRandomInt(5, 20);
        question = `${c} - ${d} + ${a} \\times ${b} = ?`;
        answer = (c - d + a * b).toString();
        hint = "곱셈을 먼저 하고, 덧셈 뺄셈은 앞에서부터 차례대로 계산하세요.";
        break;
      }
      case 20: {
        // L20: 괄호가 포함된 복합 혼합계산
        const a = getRandomInt(2, 9);
        const b = getRandomInt(2, 9);
        const c = getRandomInt(2, 9);
        question = `${a} \\times (${b} + ${c}) = ?`;
        answer = (a * (b + c)).toString();
        hint = "괄호 안을 가장 먼저 계산하세요.";
        break;
      }
      default:
        question = '1 + 1 = ?';
        answer = '2';
    }

    problems.push({
      id: `p_${stage}_${Date.now()}_${i}`,
      question,
      answer,
      svgType,
      svgParams,
      unitOptions,
      answerUnit,
      hint
    });
  }

  return problems;
}
