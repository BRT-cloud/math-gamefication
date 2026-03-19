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
    if (stage === 103) stagesToMix = [1, 2, 3];
    else if (stage === 106) stagesToMix = [4, 5, 6];
    else if (stage === 109) stagesToMix = [7, 8, 9];
    else if (stage === 112) stagesToMix = [10, 11, 12];
    else if (stage === 115) stagesToMix = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

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

    if (stage === 1) {
      hint = "일의 자리부터 차례대로 계산하세요.";
      // Level 1: 2-digit addition/subtraction
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        const a = getRandomInt(10, 89);
        const b = getRandomInt(10, 99 - a);
        question = `${a} + ${b} = ?`;
        answer = (a + b).toString();
      } else {
        const a = getRandomInt(20, 99);
        const b = getRandomInt(10, a - 1);
        question = `${a} - ${b} = ?`;
        answer = (a - b).toString();
      }
    } else if (stage === 2) {
      // Level 2: 3-digit addition/subtraction
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
      hint = "백의 자리, 십의 자리, 일의 자리를 맞추어 계산하세요.";
    } else if (stage === 3) {
      // Level 3: 1-digit multiplication / 1-digit quotient division
      const isMul = Math.random() > 0.5;
      if (isMul) {
        const a = getRandomInt(2, 9);
        const b = getRandomInt(2, 9);
        question = `${a} \\times ${b} = ?`;
        answer = (a * b).toString();
      } else {
        const b = getRandomInt(2, 9);
        const ans = getRandomInt(2, 9);
        const a = b * ans;
        question = `${a} \\div ${b} = ?`;
        answer = ans.toString();
      }
      hint = "구구단을 떠올려보세요.";
    } else if (stage === 4) {
      // Level 4: 4-digit addition/subtraction
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        const a = getRandomInt(1000, 8999);
        const b = getRandomInt(1000, 9999 - a);
        question = `${a} + ${b} = ?`;
        answer = (a + b).toString();
      } else {
        const a = getRandomInt(2000, 9999);
        const b = getRandomInt(1000, a - 1);
        question = `${a} - ${b} = ?`;
        answer = (a - b).toString();
      }
      hint = "각 자리의 숫자를 맞추어 계산하세요.";
    } else if (stage === 5) {
      // Level 5: Polygons (SVG)
      const sides = getRandomInt(3, 5);
      const qType = getRandomInt(0, 2);
      svgType = 'polygon';
      
      if (qType === 0) {
        question = `이 도형의 꼭짓점은 몇 개인가요?`;
        answer = sides.toString();
        svgParams = { sides, label: 'none' };
      } else if (qType === 1) {
        question = `이 도형의 변은 몇 개인가요?`;
        answer = sides.toString();
        svgParams = { sides, label: 'none' };
      } else {
        const length = getRandomInt(3, 12);
        question = `이 정다각형의 한 변의 길이가 ${length}cm일 때, 모든 변의 길이의 합은?`;
        answer = (sides * length).toString();
        answerUnit = 'cm';
        svgParams = { sides, label: `${length}cm` };
      }
      hint = "도형의 모양을 잘 살펴보세요.";
    } else if (stage === 6) {
      // Level 6: 2-digit * 1-digit
      const a = getRandomInt(10, 99);
      const b = getRandomInt(2, 9);
      question = `${a} \\times ${b} = ?`;
      answer = (a * b).toString();
      hint = "일의 자리부터 곱하고 올림에 주의하세요.";
    } else if (stage === 7) {
      // Level 7: 3-digit / 1-digit
      const b = getRandomInt(2, 9);
      const minAns = Math.ceil(100 / b);
      const maxAns = Math.floor(999 / b);
      const ans = getRandomInt(minAns, maxAns);
      const a = b * ans;
      question = `${a} \\div ${b} = ?`;
      answer = ans.toString();
      hint = "나누는 수의 배수를 생각해보세요.";
    } else if (stage === 8) {
      // Level 8: Analog Clock (SVG)
      const hour = getRandomInt(1, 12);
      const minute = getRandomInt(0, 11) * 5; // 0, 5, 10... 55
      const addMinutes = getRandomInt(1, 5) * 10; // 10, 20, 30, 40, 50
      
      svgType = 'clock';
      svgParams = { hour, minute };
      
      let newMin = minute + addMinutes;
      let newHour = hour;
      if (newMin >= 60) {
        newMin -= 60;
        newHour += 1;
        if (newHour > 12) newHour -= 12;
      }
      
      question = `현재 시각에서 ${addMinutes}분 뒤는 몇 시 몇 분인가요? (시와 분을 붙여서 쓰세요. 예: 2시 5분 -> 205)`;
      answer = `${newHour}${newMin.toString().padStart(2, '0')}`;
      hint = "1시간은 60분입니다.";
    } else if (stage === 9) {
      // Level 9: Money calculation
      const price = getRandomInt(1, 9) * 500; // 500 to 4500
      const paid = getRandomInt(1, 2) * 5000; // 5000 or 10000
      if (paid <= price) {
        question = `${price}원짜리 물건을 사고 ${paid + 5000}원을 냈습니다. 거스름돈은?`;
        answer = (paid + 5000 - price).toString();
      } else {
        question = `${price}원짜리 물건을 사고 ${paid}원을 냈습니다. 거스름돈은?`;
        answer = (paid - price).toString();
      }
      answerUnit = '원';
      hint = "거스름돈 = 낸 돈 - 물건값";
    } else if (stage === 10) {
      // Level 10: 3-digit / 2-digit
      const b = getRandomInt(11, 50);
      const minAns = Math.ceil(100 / b);
      const maxAns = Math.floor(999 / b);
      const ans = getRandomInt(Math.max(2, minAns), Math.min(99, maxAns));
      const a = b * ans;
      question = `${a} \\div ${b} = ?`;
      answer = ans.toString();
      hint = "나누는 수를 어림하여 몫을 예상해보세요.";
    } else if (stage === 11) {
      // Level 11: Fraction addition/subtraction
      const isAdd = Math.random() > 0.5;
      const den = getRandomInt(3, 9);
      if (isAdd) {
        const num1 = getRandomInt(1, den - 1);
        const num2 = getRandomInt(1, den - 1);
        question = `\\frac{${num1}}{${den}} + \\frac{${num2}}{${den}} = ?`;
        const sumNum = num1 + num2;
        if (sumNum % den === 0) {
          answer = (sumNum / den).toString();
        } else {
          const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
          const divisor = gcd(sumNum, den);
          answer = `${sumNum / divisor}/${den / divisor}`;
        }
      } else {
        const num1 = getRandomInt(2, den * 2);
        const num2 = getRandomInt(1, num1 - 1);
        question = `\\frac{${num1}}{${den}} - \\frac{${num2}}{${den}} = ?`;
        const diffNum = num1 - num2;
        if (diffNum % den === 0) {
          answer = (diffNum / den).toString();
        } else {
          const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
          const divisor = gcd(diffNum, den);
          answer = `${diffNum / divisor}/${den / divisor}`;
        }
      }
      hint = "분모가 같을 때는 분자끼리 계산합니다.";
    } else if (stage === 12) {
      // Level 12: Decimal addition/subtraction (1 decimal place)
      const isAdd = Math.random() > 0.5;
      const a = getRandomInt(1, 99) / 10;
      const b = getRandomInt(1, 99) / 10;
      if (isAdd) {
        question = `${a.toFixed(1)} + ${b.toFixed(1)} = ?`;
        answer = (a + b).toFixed(1).replace(/\.0$/, '');
      } else {
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        question = `${max.toFixed(1)} - ${min.toFixed(1)} = ?`;
        answer = (max - min).toFixed(1).replace(/\.0$/, '');
      }
      hint = "소수점의 위치를 맞추어 계산하세요.";
    } else if (stage === 13) {
      // Level 13: Mixed calc 1 (2 operators)
      // e.g., A + B * C
      const type = getRandomInt(0, 3);
      if (type === 0) {
        // A + B * C
        const a = getRandomInt(10, 50);
        const b = getRandomInt(2, 9);
        const c = getRandomInt(2, 9);
        question = `${a} + ${b} \\times ${c} = ?`;
        answer = (a + b * c).toString();
      } else if (type === 1) {
        // A - B * C
        const b = getRandomInt(2, 9);
        const c = getRandomInt(2, 9);
        const a = getRandomInt(b * c + 1, b * c + 50);
        question = `${a} - ${b} \\times ${c} = ?`;
        answer = (a - b * c).toString();
      } else if (type === 2) {
        // A + B / C
        const c = getRandomInt(2, 9);
        const ans = getRandomInt(2, 9);
        const b = c * ans;
        const a = getRandomInt(10, 50);
        question = `${a} + ${b} \\div ${c} = ?`;
        answer = (a + ans).toString();
      } else {
        // A - B / C
        const c = getRandomInt(2, 9);
        const ans = getRandomInt(2, 9);
        const b = c * ans;
        const a = getRandomInt(ans + 1, ans + 50);
        question = `${a} - ${b} \\div ${c} = ?`;
        answer = (a - ans).toString();
      }
      hint = "곱셈과 나눗셈을 덧셈, 뺄셈보다 먼저 계산하세요.";
    } else if (stage === 14) {
      // Level 14: Mixed calc 2 (3 operators)
      // e.g., A - B / C + D
      const c = getRandomInt(2, 9);
      const divAns = getRandomInt(2, 9);
      const b = c * divAns;
      const a = getRandomInt(divAns + 1, divAns + 30);
      const d = getRandomInt(5, 20);
      question = `${a} - ${b} \\div ${c} + ${d} = ?`;
      answer = (a - divAns + d).toString();
      hint = "곱셈과 나눗셈을 먼저 계산한 후, 앞에서부터 차례대로 계산하세요.";
    } else if (stage === 15) {
      // Level 15: Mixed calc with parentheses
      // e.g., (A + B) * C - D
      const a = getRandomInt(5, 20);
      const b = getRandomInt(5, 20);
      const c = getRandomInt(2, 6);
      const d = getRandomInt(10, 50);
      question = `(${a} + ${b}) \\times ${c} - ${d} = ?`;
      answer = ((a + b) * c - d).toString();
      hint = "괄호 안을 가장 먼저 계산하세요.";
    }

    problems.push({
      id: `stage${stage}-${i}-${Date.now()}`,
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
