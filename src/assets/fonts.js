const fonts = [
  {
    name: '굴림',
    cssValue: '굴림'
  },
  {
    name: '한나체',
    cssValue: 'Hanna',
    importUrl: '//fonts.googleapis.com/earlyaccess/hanna.css'
  },
  {
    name: '나눔고딕',
    cssValue: 'Nanum Gothic',
    importUrl: '//fonts.googleapis.com/earlyaccess/nanumgothic.css'
  },
  {
    name: '나눔고딕 코딩',
    cssValue: 'Nanum Gothic Coding',
    importUrl: '//fonts.googleapis.com/earlyaccess/nanumgothiccoding.css'
  },
  {
    name: '나눔손글씨 붓',
    cssValue: 'Nanum Brush Script',
    importUrl: '//fonts.googleapis.com/earlyaccess/nanumbrushscript.css'
  },
  {
    name: '나눔 브러시 스크립트',
    cssValue: 'Nanum Brush Script',
    importUrl: '//fonts.googleapis.com/earlyaccess/nanumbrushscript.css'
  },
  {
    name: '제주 한라산',
    cssValue: 'Jeju Hallasan',
    importUrl: '//fonts.googleapis.com/earlyaccess/jejuhallasan.css'
  },
  {
    name: '제주 고딕',
    cssValue: 'Jeju Gothic',
    importUrl: '//fonts.googleapis.com/earlyaccess/jejugothic.css'
  },
  {
    name: '코펍 바탕체',
    cssValue: 'KoPub Batang',
    importUrl: '//fonts.googleapis.com/earlyaccess/kopubbatang.css'
  }
];
export default fonts;

export function findByCssValue(cssValue) {
  return fonts.find(font => font.cssValue === cssValue);
}
