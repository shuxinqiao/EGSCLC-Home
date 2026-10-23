// Chinese Union Version / King James Version.
export const verses = [
  {ref:['诗篇 23:1','詩篇 23:1','Psalm 23:1 · KJV'],text:['耶和华是我的牧者，我必不致缺乏。','耶和華是我的牧者，我必不致缺乏。','The LORD is my shepherd; I shall not want.']},
  {ref:['哥林多前书 16:14','哥林多前書 16:14','1 Corinthians 16:14 · KJV'],text:['凡你们所做的都要凭爱心而做。','凡你們所做的都要憑愛心而做。','Let all your things be done with charity.']},
  {ref:['诗篇 119:105','詩篇 119:105','Psalm 119:105 · KJV'],text:['你的话是我脚前的灯，是我路上的光。','你的話是我腳前的燈，是我路上的光。','Thy word is a lamp unto my feet, and a light unto my path.']},
  {ref:['腓立比书 4:4','腓立比書 4:4','Philippians 4:4 · KJV'],text:['你们要靠主常常喜乐。我再说，你们要喜乐。','你們要靠主常常喜樂。我再說，你們要喜樂。','Rejoice in the Lord alway: and again I say, Rejoice.']},
  {ref:['诗篇 46:1','詩篇 46:1','Psalm 46:1 · KJV'],text:['神是我们的避难所，是我们的力量，是我们在患难中随时的帮助。','神是我們的避難所，是我們的力量，是我們在患難中隨時的幫助。','God is our refuge and strength, a very present help in trouble.']},
  {ref:['约翰一书 4:19','約翰一書 4:19','1 John 4:19 · KJV'],text:['我们爱，因为神先爱我们。','我們愛，因為神先愛我們。','We love him, because he first loved us.']},
  {ref:['诗篇 118:24','詩篇 118:24','Psalm 118:24 · KJV'],text:['这是耶和华所定的日子，我们在其中要高兴欢喜！','這是耶和華所定的日子，我們在其中要高興歡喜！','This is the day which the LORD hath made; we will rejoice and be glad in it.']},
  {ref:['箴言 3:5','箴言 3:5','Proverbs 3:5 · KJV'],text:['你要专心仰赖耶和华，不可倚靠自己的聪明。','你要專心仰賴耶和華，不可倚靠自己的聰明。','Trust in the LORD with all thine heart; and lean not unto thine own understanding.']},
  {ref:['马太福音 5:9','馬太福音 5:9','Matthew 5:9 · KJV'],text:['使人和睦的人有福了！因为他们必称为神的儿子。','使人和睦的人有福了！因為他們必稱為神的兒子。','Blessed are the peacemakers: for they shall be called the children of God.']},
  {ref:['马太福音 11:28','馬太福音 11:28','Matthew 11:28 · KJV'],text:['凡劳苦担重担的人，可以到我这里来，我就使你们得安息。','凡勞苦擔重擔的人，可以到我這裡來，我就使你們得安息。','Come unto me, all ye that labour and are heavy laden, and I will give you rest.']},
  {ref:['哥林多前书 13:13','哥林多前書 13:13','1 Corinthians 13:13 · KJV'],text:['如今常存的有信，有望，有爱这三样，其中最大的是爱。','如今常存的有信，有望，有愛這三樣，其中最大的是愛。','And now abideth faith, hope, charity, these three; but the greatest of these is charity.']},
  {ref:['帖撒罗尼迦前书 5:16–18','帖撒羅尼迦前書 5:16–18','1 Thessalonians 5:16–18 · KJV'],text:['要常常喜乐，不住地祷告，凡事谢恩；因为这是神在基督耶稣里向你们所定的旨意。','要常常喜樂，不住地禱告，凡事謝恩；因為這是神在基督耶穌裡向你們所定的旨意。','Rejoice evermore. Pray without ceasing. In every thing give thanks: for this is the will of God in Christ Jesus concerning you.']},
  {ref:['诗篇 34:8','詩篇 34:8','Psalm 34:8 · KJV'],text:['你们要尝尝主恩的滋味，便知道他是美善；投靠他的人有福了！','你們要嘗嘗主恩的滋味，便知道他是美善；投靠他的人有福了！','O taste and see that the LORD is good: blessed is the man that trusteth in him.']},
  {ref:['彼得前书 5:7','彼得前書 5:7','1 Peter 5:7 · KJV'],text:['你们要将一切的忧虑卸给神，因为他顾念你们。','你們要將一切的憂慮卸給神，因為他顧念你們。','Casting all your care upon him; for he careth for you.']},
  {ref:['以赛亚书 40:31','以賽亞書 40:31','Isaiah 40:31 · KJV'],text:['但那等候耶和华的必重新得力。他们必如鹰展翅上腾；他们奔跑却不困倦，行走却不疲乏。','但那等候耶和華的必重新得力。他們必如鷹展翅上騰；他們奔跑卻不困倦，行走卻不疲乏。','But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.']},
];
export function chooseVerse(previous, random = Math.random) {
  const candidates = verses.map((_,i)=>i).filter(i=>i!==previous);
  return candidates[Math.floor(random()*candidates.length)];
}
