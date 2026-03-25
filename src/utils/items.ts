export type ItemType = 'head' | 'torso' | 'legs' | 'rightHand';

export interface ShopItem {
  id: string;
  name: string;
  type: ItemType;
  price: number;
  desc: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // Head
  { id: 'cap_red', name: '빨간 캡모자', type: 'head', price: 100, desc: '스포티한 빨간색 캡모자입니다.' },
  { id: 'glasses_nerd', name: '뿔테 안경', type: 'head', price: 150, desc: '똑똑해 보이는 뿔테 안경입니다.' },
  { id: 'hat_wizard', name: '마법사 모자', type: 'head', price: 300, desc: '신비로운 마력이 깃든 뾰족한 모자입니다.' },
  { id: 'helmet_knight', name: '기사 투구', type: 'head', price: 400, desc: '단단한 철로 만들어진 기사의 투구입니다.' },
  { id: 'headband_ninja', name: '닌자 머리띠', type: 'head', price: 250, desc: '바람처럼 빠른 닌자의 붉은 머리띠입니다.' },
  { id: 'crown_gold', name: '황금 왕관', type: 'head', price: 1000, desc: '왕의 상징인 황금 왕관입니다.' },
  { id: 'mask_cyberpunk', name: '사이버 마스크', type: 'head', price: 600, desc: '미래지향적인 네온 마스크입니다.' },
  { id: 'halo_angel', name: '천사의 헤일로', type: 'head', price: 800, desc: '성스러운 빛이 나는 헤일로입니다.' },
  
  // Torso
  { id: 'shirt_blue', name: '파란색 티셔츠', type: 'torso', price: 200, desc: '시원한 파란색 반팔 티셔츠입니다.' },
  { id: 'suit_black', name: '검은색 정장', type: 'torso', price: 350, desc: '깔끔하고 멋진 검은색 정장 상의입니다.' },
  { id: 'robe_wizard', name: '마법사 로브', type: 'torso', price: 400, desc: '별무늬가 수놓아진 신비한 로브입니다.' },
  { id: 'armor_iron', name: '기사단 철갑옷', type: 'torso', price: 500, desc: '단단한 철로 만든 기사단 갑옷입니다.' },
  { id: 'jacket_leather', name: '가죽 자켓', type: 'torso', price: 450, desc: '거친 매력의 검은색 가죽 자켓입니다.' },
  { id: 'armor_golden', name: '황금 갑옷', type: 'torso', price: 1200, desc: '눈부시게 빛나는 전설의 황금 갑옷입니다.' },
  
  // Legs
  { id: 'pants_black', name: '검은색 바지', type: 'legs', price: 150, desc: '깔끔한 검은색 바지입니다.' },
  { id: 'pants_white', name: '하얀색 바지', type: 'legs', price: 150, desc: '어디에나 잘 어울리는 하얀색 바지입니다.' },
  { id: 'shoes_red', name: '빨간 스니커즈', type: 'legs', price: 200, desc: '눈에 띄는 빨간색 스니커즈입니다.' },
  { id: 'boots_knight', name: '기사 부츠', type: 'legs', price: 300, desc: '무거운 철로 만들어진 튼튼한 부츠입니다.' },
  { id: 'pants_camo', name: '카모플라쥬 바지', type: 'legs', price: 250, desc: '야전에서 유용한 위장 무늬 바지입니다.' },
  { id: 'skirt_pleated', name: '주름 치마', type: 'legs', price: 200, desc: '발랄한 느낌의 체크무늬 주름 치마입니다.' },
  
  // RightHand
  { id: 'sword_wooden', name: '초보자의 목검', type: 'rightHand', price: 150, desc: '가볍고 다루기 쉬운 나무 검입니다.' },
  { id: 'shield_basic', name: '나무 방패', type: 'rightHand', price: 200, desc: '기본적인 방어력을 제공하는 나무 방패입니다.' },
  { id: 'sword_iron', name: '기사의 철검', type: 'rightHand', price: 400, desc: '날카롭게 벼려진 기사의 철검입니다.' },
  { id: 'book_magic', name: '마법서', type: 'rightHand', price: 450, desc: '고대 마법이 적혀있는 신비한 책입니다.' },
  { id: 'wand_magic', name: '마법 지팡이', type: 'rightHand', price: 600, desc: '신비한 마력이 깃든 지팡이입니다.' },
  { id: 'axe_battle', name: '전투 도끼', type: 'rightHand', price: 550, desc: '파괴적인 위력을 자랑하는 양날 도끼입니다.' },
  { id: 'staff_crystal', name: '크리스탈 스태프', type: 'rightHand', price: 800, desc: '거대한 크리스탈이 박힌 대마법사의 지팡이입니다.' },
];
