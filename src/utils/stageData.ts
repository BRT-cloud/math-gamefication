export const STAGES = [
  { id: 1, title: '덧셈 기초', desc: '두 자리 수 덧셈 (받아올림 X)', bg: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1920&q=80', color: 'bg-emerald-400' },
  { id: 2, title: '덧셈과 뺄셈', desc: '두 자리 수 덧셈/뺄셈 (받아올림/내림 O)', bg: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1920&q=80', color: 'bg-emerald-500' },
  { id: 3, title: '세 자리 수 기초', desc: '세 자리 수 덧셈/뺄셈 기초', bg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80', color: 'bg-emerald-600' },
  { id: 4, title: '세 자리 수 심화', desc: '세 자리 수 덧셈/뺄셈 심화', bg: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=1920&q=80', color: 'bg-emerald-700' },
  { id: 5, title: '도형 기초', desc: '도형 꼭짓점/변 개수 및 길이', bg: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1920&q=80', color: 'bg-emerald-800' },
  { id: 101, title: '중간 보스 1', desc: '1~5단계 종합', bg: 'https://images.unsplash.com/photo-1614036417651-1d451f0d3211?auto=format&fit=crop&w=1920&q=80', color: 'bg-red-600', isBoss: true },
  
  { id: 6, title: '구구단', desc: '구구단 전 범위', bg: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1920&q=80', color: 'bg-amber-400' },
  { id: 7, title: '곱셈 기초', desc: '(두 자리 수) × (한 자리 수)', bg: 'https://images.unsplash.com/photo-1503788311183-fa3bf9c4bc32?auto=format&fit=crop&w=1920&q=80', color: 'bg-amber-500' },
  { id: 8, title: '나눗셈 기초', desc: '나눗셈 기초 (몫 한 자리, 나머지 X)', bg: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&w=1920&q=80', color: 'bg-amber-600' },
  { id: 9, title: '시계 읽기', desc: '시계 읽기 및 시간 계산', bg: 'https://images.unsplash.com/photo-1580519542036-ed47c0ce31d7?auto=format&fit=crop&w=1920&q=80', color: 'bg-amber-700' },
  { id: 10, title: '문장제 응용', desc: '세 자리 수 덧셈/뺄셈 문장제 응용', bg: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1920&q=80', color: 'bg-amber-800' },
  { id: 102, title: '중간 보스 2', desc: '6~10단계 종합', bg: 'https://images.unsplash.com/photo-1614036417651-1d451f0d3211?auto=format&fit=crop&w=1920&q=80', color: 'bg-red-600', isBoss: true },
  
  { id: 11, title: '네 자리 수', desc: '네 자리 수 연산 및 크기 비교', bg: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1920&q=80', color: 'bg-indigo-400' },
  { id: 12, title: '곱셈 심화', desc: '(세 자리 수) × (한 자리 수)', bg: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80', color: 'bg-indigo-500' },
  { id: 13, title: '두 자리 곱셈', desc: '(두 자리 수) × (두 자리 수) 기초', bg: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1920&q=80', color: 'bg-indigo-600' },
  { id: 14, title: '나눗셈 심화', desc: '(세 자리 수) ÷ (한 자리 수) (나머지 O)', bg: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=1920&q=80', color: 'bg-indigo-700' },
  { id: 15, title: '화폐 계산', desc: '화폐 사칙연산 (거스름돈 계산)', bg: 'https://images.unsplash.com/photo-1546026423-9d6655c1d466?auto=format&fit=crop&w=1920&q=80', color: 'bg-indigo-800' },
  { id: 103, title: '중간 보스 3', desc: '11~15단계 종합', bg: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1920&q=80', color: 'bg-red-600', isBoss: true },
  
  { id: 16, title: '분수 기초', desc: '분수 크기 비교 및 기초 덧셈/뺄셈', bg: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80', color: 'bg-purple-400' },
  { id: 17, title: '소수 기초', desc: '소수 한 자리 수 덧셈/뺄셈', bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80', color: 'bg-purple-500' },
  { id: 18, title: '혼합계산 1', desc: '기호 2개 혼합계산', bg: 'https://images.unsplash.com/photo-1464802686167-b939a67e06a1?auto=format&fit=crop&w=1920&q=80', color: 'bg-purple-600' },
  { id: 19, title: '혼합계산 2', desc: '기호 3개 혼합계산', bg: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1920&q=80', color: 'bg-purple-700' },
  { id: 20, title: '복합 혼합계산', desc: '괄호가 포함된 복합 혼합계산', bg: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1920&q=80', color: 'bg-purple-800' },
  { id: 104, title: '최종 보스', desc: '1~20단계 전체 종합', bg: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80', color: 'bg-purple-900', isBoss: true },
];
