export type Problem = {
  id: string;
  question: string; // HTML or custom format for rendering
  answer: string;
  svgType?: 'polygon' | 'angle' | 'prism' | 'circle';
  svgParams?: any;
  unitOptions?: string[];
  answerUnit?: string;
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateProblems(stage: number, count: number = 10): Problem[] {
  const problems: Problem[] = [];

  for (let i = 0; i < count; i++) {
    let question = '';
    let answer = '';
    let svgType: Problem['svgType'];
    let svgParams: any;
    let unitOptions: string[] | undefined;
    let answerUnit: string | undefined;

    if (stage === 1) {
      // Stage 1: 3-digit addition/subtraction (Old Stage 1)
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
    } else if (stage === 2) {
      // Stage 2: Polygons (Old Stage 5)
      const sides = getRandomInt(3, 5);
      const isVertex = Math.random() > 0.5;
      question = `이 도형의 ${isVertex ? '꼭짓점' : '변'}은 몇 개인가요?`;
      answer = sides.toString();
      svgType = 'polygon';
      svgParams = { sides };
    } else if (stage === 3) {
      // Stage 3: Large number multiplication/division (Old Stage 2)
      const isMul = Math.random() > 0.5;
      if (isMul) {
        const a = getRandomInt(10, 99);
        const b = getRandomInt(10, 99);
        question = `${a} \\times ${b} = ?`;
        answer = (a * b).toString();
      } else {
        const b = getRandomInt(11, 99);
        const ans = getRandomInt(10, 99);
        const a = b * ans;
        question = `${a} \\div ${b} = ?`;
        answer = ans.toString();
      }
    } else if (stage === 4) {
      // Stage 4: Angles (Old Stage 6)
      const isTriangle = Math.random() > 0.5;
      if (isTriangle) {
        const a1 = getRandomInt(30, 100);
        const a2 = getRandomInt(30, 140 - a1);
        const a3 = 180 - a1 - a2;
        question = `삼각형의 두 각이 ${a1}°, ${a2}°일 때, 나머지 한 각은 몇 도인가요?`;
        answer = a3.toString();
        svgType = 'angle';
        svgParams = { shape: 'triangle', angles: [a1, a2, '?'] };
      } else {
        const a1 = getRandomInt(60, 120);
        const a2 = getRandomInt(60, 120);
        const a3 = getRandomInt(60, 120);
        const a4 = 360 - a1 - a2 - a3;
        question = `사각형의 세 각이 ${a1}°, ${a2}°, ${a3}°일 때, 나머지 한 각은 몇 도인가요?`;
        answer = a4.toString();
        svgType = 'angle';
        svgParams = { shape: 'quad', angles: [a1, a2, a3, '?'] };
      }
    } else if (stage === 5) {
      // Stage 5: Fractions and decimals (Old Stage 3)
      const type = getRandomInt(0, 2);
      if (type === 0) {
        // Decimal addition/subtraction
        const a = getRandomInt(1, 99) / 10; // 0.1 to 9.9
        const b = getRandomInt(1, 99) / 10;
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
          question = `${a.toFixed(1)} + ${b.toFixed(1)} = ?`;
          answer = (a + b).toFixed(1).replace(/\.0$/, '');
        } else {
          const max = Math.max(a, b);
          const min = Math.min(a, b);
          question = `${max.toFixed(1)} - ${min.toFixed(1)} = ?`;
          answer = (max - min).toFixed(1).replace(/\.0$/, '');
        }
      } else if (type === 1) {
        // Fraction addition (same denominator)
        const den = getRandomInt(3, 9);
        const num1 = getRandomInt(1, den - 1);
        const num2 = getRandomInt(1, den - 1);
        question = `\\frac{${num1}}{${den}} + \\frac{${num2}}{${den}} = ?`;
        
        const sumNum = num1 + num2;
        if (sumNum % den === 0) {
          answer = (sumNum / den).toString();
        } else {
          // Simplify fraction
          const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
          const divisor = gcd(sumNum, den);
          answer = `${sumNum / divisor}/${den / divisor}`;
        }
      } else {
        // Fraction subtraction (same denominator)
        const den = getRandomInt(3, 9);
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
    } else if (stage === 6) {
      // Stage 6: Measurement (Old Stage 7)
      const type = getRandomInt(0, 1);
      unitOptions = ['mm', 'cm', 'm', 'km', 'cm²', 'm²'];
      if (type === 0) {
        const m = getRandomInt(1, 9);
        const cm = getRandomInt(10, 99);
        question = `${m}m ${cm}cm는 총 몇 cm인가요?`;
        answer = (m * 100 + cm).toString();
        answerUnit = 'cm';
      } else {
        const w = getRandomInt(2, 9);
        const h = getRandomInt(2, 9);
        question = `가로 ${w}cm, 세로 ${h}cm인 직사각형의 넓이는?`;
        answer = (w * h).toString();
        answerUnit = 'cm²';
        svgType = 'polygon';
        svgParams = { sides: 4, width: w, height: h, label: 'rect' };
      }
    } else if (stage === 7) {
      // Stage 7: Ratio and proportion, complex operations (Old Stage 4)
      const type = getRandomInt(0, 1);
      if (type === 0) {
        // Proportion A : B = C : x
        const a = getRandomInt(2, 9);
        const b = getRandomInt(2, 9);
        const multiplier = getRandomInt(2, 6);
        const c = a * multiplier;
        const x = b * multiplier;
        question = `${a} : ${b} = ${c} : ?`;
        answer = x.toString();
      } else {
        // Complex operation: (A + B) * C
        const a = getRandomInt(10, 50);
        const b = getRandomInt(10, 50);
        const c = getRandomInt(2, 9);
        question = `(${a} + ${b}) \\times ${c} = ?`;
        answer = ((a + b) * c).toString();
      }
    } else if (stage === 8) {
      // Stage 8: Solids and Circles (Old Stage 8)
      const type = getRandomInt(0, 1);
      if (type === 0) {
        const w = getRandomInt(2, 6);
        const d = getRandomInt(2, 6);
        const h = getRandomInt(2, 6);
        question = `가로 ${w}, 세로 ${d}, 높이 ${h}인 직육면체의 부피는?`;
        answer = (w * d * h).toString();
        svgType = 'prism';
        svgParams = { w, d, h };
      } else {
        const r = getRandomInt(2, 10);
        question = `반지름이 ${r}인 원의 넓이는? (원주율: 3.14)`;
        answer = (r * r * 3.14).toString();
        svgType = 'circle';
        svgParams = { r };
      }
    }

    problems.push({
      id: `stage${stage}-${i}-${Date.now()}`,
      question,
      answer,
      svgType,
      svgParams,
      unitOptions,
      answerUnit
    });
  }

  return problems;
}
