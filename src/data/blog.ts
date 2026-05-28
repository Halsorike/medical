export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  date: string;
  category: string;
  categoryAr: string;
  readTime: string;
  content: string[];
  contentAr: string[];
};

export const posts: BlogPost[] = [
  {
    id: 1,
    slug: "digital-thermometer",
    title: "5 essentials every home medicine cabinet needs",
    titleAr: "٥ أساسيات يحتاجها كل صيدلية منزلية",
    excerpt: "Stay prepared for everyday health needs.",
    excerptAr: "كن مستعداً للاحتياجات الصحية اليومية.",
    date: "Apr 2026",
    category: "Health Tips",
    categoryAr: "نصائح صحية",
    readTime: "3 min read",
    content: [
      "A well-stocked medicine cabinet makes small health issues easier to manage before they become stressful. The goal is not to build a mini hospital at home, but to keep the basics close by so common needs are covered.",
      "Start with reliable temperature checks, pain relief, wound care, and hydration support. These items do more than save time. They help families respond calmly when a fever starts late at night or a scrape needs immediate cleaning.",
      "Storage matters just as much as product choice. Keep medications dry, labeled, and out of reach of children. Review expiration dates every few months so the items you count on are still ready when you need them.",
      "If someone in the household has a chronic condition, add a small section for that routine as well. Extra batteries, device supplies, and refill reminders go a long way in reducing last-minute gaps.",
      "The best cabinet is one that feels simple to navigate. Organize it in a way that another family member could understand in a hurry, and it instantly becomes more useful in real life."
    ],
    contentAr: [
      "الصيدلية المنزلية المجهزة جيداً تجعل المشكلات الصحية البسيطة أسهل في التعامل قبل أن تتفاقم. الهدف ليس بناء مستشفى مصغّر في المنزل، بل الاحتفاظ بالأساسيات في متناول اليد.",
      "ابدأ بمقاييس الحرارة الموثوقة، ومسكنات الألم، ومواد العناية بالجروح، ودعم الترطيب. هذه المواد لا توفر الوقت فحسب، بل تساعد الأسر على الاستجابة بهدوء عند ارتفاع درجة الحرارة ليلاً.",
      "طريقة التخزين مهمة بقدر اختيار المنتج. احتفظ بالأدوية في مكان جاف ومُصنَّف وبعيداً عن متناول الأطفال. راجع تواريخ الصلاحية كل بضعة أشهر.",
      "إذا كان أحد أفراد الأسرة يعاني من حالة مزمنة، أضف قسماً صغيراً لاحتياجاته الروتينية كذلك.",
      "أفضل صيدلية هي تلك التي يسهل التنقل فيها. نظّمها بطريقة يستطيع فيها أي فرد من الأسرة فهمها بسرعة."
    ],
  },
  {
    id: 2,
    slug: "read-blood-pressure-monitor-correctly",
    title: "How to read a blood pressure monitor correctly",
    titleAr: "كيف تقرأ جهاز قياس ضغط الدم بشكل صحيح",
    excerpt: "A quick guide for accurate readings.",
    excerptAr: "دليل سريع للقراءات الدقيقة.",
    date: "Mar 2026",
    category: "Devices",
    categoryAr: "الأجهزة",
    readTime: "5 min read",
    content: [
      "Blood pressure numbers can vary more than people expect, especially when the body is tense, rushed, or recently active. A useful reading starts with the right setup: sit comfortably, rest for a few minutes, and keep the cuff positioned correctly.",
      "One reading rarely tells the whole story. Look for trends across several days at similar times rather than reacting to a single number taken under stress.",
      "Home monitors are helpful because they capture everyday patterns outside the clinic. Keeping a short log of readings, symptoms, and medication timing can make follow-up appointments far more productive.",
      "If readings stay consistently high or feel very different from what your clinician expects, the next step is not guesswork. It is a quick calibration check and a conversation with a professional."
    ],
    contentAr: [
      "أرقام ضغط الدم يمكن أن تتفاوت أكثر مما يتوقع الناس، خاصةً عندما يكون الجسم متوتراً أو متعجلاً. القراءة المفيدة تبدأ بالإعداد الصحيح: اجلس بشكل مريح، وارتح لبضع دقائق.",
      "قراءة واحدة نادراً ما تحكي القصة الكاملة. ابحث عن الأنماط عبر عدة أيام في أوقات مشابهة بدلاً من الاستجابة لرقم واحد.",
      "أجهزة المنزل مفيدة لأنها تلتقط الأنماط اليومية خارج العيادة. الاحتفاظ بسجل قصير للقراءات والأعراض يجعل المواعيد أكثر إنتاجية.",
      "إذا ظلت القراءات مرتفعة باستمرار، فالخطوة التالية هي فحص معايرة سريع ومحادثة مع متخصص."
    ],
  },
  {
    id: 3,
    slug: "vitamins-101-right-supplement",
    title: "Vitamins 101: choosing the right supplement",
    titleAr: "الفيتامينات ١٠١: اختيار المكمل الغذائي المناسب",
    excerpt: "Find what works for your needs.",
    excerptAr: "اعثر على ما يناسب احتياجاتك.",
    date: "Mar 2026",
    category: "Nutrition",
    categoryAr: "التغذية",
    readTime: "4 min read",
    content: [
      "Supplements can be useful, but they work best when they answer a real need rather than a vague sense that more must be better. Age, diet, medication use, and known deficiencies all shape what makes sense for an individual plan.",
      "Quality and consistency matter. Choose products with clear labeling, reasonable dosing, and brands that explain their testing standards.",
      "The most common mistake is stacking multiple products that overlap. That can lead to unnecessary cost and, in some cases, too much of a nutrient that should stay within a certain range.",
      "A clinician or pharmacist can usually narrow the decision quickly. A short, specific recommendation beats a shelf full of hopeful purchases."
    ],
    contentAr: [
      "المكملات الغذائية مفيدة، لكنها تعمل بشكل أفضل عندما تلبي حاجة حقيقية وليس مجرد شعور غامض. العمر والنظام الغذائي واستخدام الأدوية والنقص المعروف يشكّل ما يناسب كل شخص.",
      "الجودة والاتساق مهمان. اختر منتجات ذات تسمية واضحة وجرعة معقولة وعلامات تجارية تشرح معايير الاختبار.",
      "الخطأ الأكثر شيوعاً هو تكديس منتجات متعددة تتداخل. هذا يؤدي إلى تكلفة غير ضرورية وأحياناً جرعة زائدة.",
      "يمكن للطبيب أو الصيدلاني عادةً تضييق الخيار بسرعة. توصية قصيرة ومحددة أفضل من رف مليء بالمشتريات المأمولة."
    ],
  },
  {
    id: 4,
    slug: "understanding-prescription-labels",
    title: "Understanding prescription labels: a patient's guide",
    titleAr: "فهم ملصقات الوصفات الطبية: دليل المريض",
    excerpt: "Decode the information on your medication packaging.",
    excerptAr: "تعرّف على المعلومات الموجودة على عبوة الدواء.",
    date: "Feb 2026",
    category: "Education",
    categoryAr: "التثقيف الصحي",
    readTime: "4 min read",
    content: [
      "Prescription labels pack a lot of information into a small space. Drug name, strength, timing, refill count, and warnings are all there, but not always in the most readable format.",
      "The first job of the label is safety. Take note of timing instructions, whether food matters, and any alert about drowsiness or interactions.",
      "If a label seems vague, ask for clarification early. It is easier to correct confusion at pickup than after several doses have already been taken.",
      "Patients do best when label language is reinforced by a simple routine: what time, how much, and what to do if a dose is missed."
    ],
    contentAr: [
      "تحتوي ملصقات الوصفات الطبية على معلومات كثيرة في مساحة صغيرة، مثل اسم الدواء والجرعة ومواعيد الاستخدام وعدد مرات إعادة الصرف والتحذيرات.",
      "الهدف الأول من الملصق هو السلامة. انتبه إلى تعليمات الوقت، وهل يجب تناول الدواء مع الطعام، وأي تحذير من النعاس أو التداخلات.",
      "إذا بدا الملصق غير واضح، اطلب التوضيح مبكراً. تصحيح الالتباس عند الاستلام أسهل بكثير من اكتشافه بعد عدة جرعات.",
      "يستفيد المرضى أكثر عندما تتحول التعليمات إلى روتين بسيط: متى، وكم، وماذا تفعل إذا نسيت جرعة."
    ],
  },
  {
    id: 5,
    slug: "clinic-vs-urgent-care-vs-er",
    title: "When to visit a clinic vs. urgent care vs. ER",
    titleAr: "متى تزور العيادة أو الرعاية العاجلة أو الطوارئ؟",
    excerpt: "Make the right call for your health situation.",
    excerptAr: "اختر المكان المناسب حسب حالتك الصحية.",
    date: "Feb 2026",
    category: "Advice",
    categoryAr: "إرشادات",
    readTime: "6 min read",
    content: [
      "Choosing where to go for care is easier when you separate convenience from urgency. Routine issues and follow-up care usually belong in a clinic. Time-sensitive but non-life-threatening problems often fit urgent care. Severe symptoms belong in the emergency room.",
      "Shortness of breath, chest pain, severe bleeding, or signs of stroke should skip the debate and go straight to emergency care.",
      "Urgent care fills the middle ground well for infections, minor injuries, or sudden symptoms that cannot wait for a scheduled appointment.",
      "Knowing your options ahead of time makes stressful moments more manageable, and it can prevent delayed care when every hour matters."
    ],
    contentAr: [
      "اختيار مكان الرعاية يصبح أسهل عندما نفرّق بين الراحة والاستعجال. الحالات الروتينية والمتابعة تناسب العيادة، والحالات العاجلة غير المهددة للحياة تناسب الرعاية العاجلة، أما الأعراض الشديدة فتحتاج الطوارئ.",
      "ضيق التنفس، ألم الصدر، النزيف الشديد، أو علامات الجلطة يجب أن تذهب مباشرة إلى الطوارئ دون تأخير.",
      "الرعاية العاجلة مناسبة للالتهابات والإصابات البسيطة أو الأعراض المفاجئة التي لا يمكنها انتظار موعد مجدول.",
      "معرفة الخيارات مسبقاً تجعل اللحظات المقلقة أكثر قابلية للإدارة، وتمنع تأخير الرعاية عندما تكون الساعات مهمة."
    ],
  },
  {
    id: 6,
    slug: "digital-tools-for-chronic-conditions",
    title: "Managing chronic conditions with digital health tools",
    titleAr: "إدارة الحالات المزمنة باستخدام أدوات الصحة الرقمية",
    excerpt: "Apps and devices that make daily management easier.",
    excerptAr: "تطبيقات وأجهزة تجعل المتابعة اليومية أسهل.",
    date: "Jan 2026",
    category: "Technology",
    categoryAr: "التقنية",
    readTime: "5 min read",
    content: [
      "Digital health tools work best when they reduce friction. A good app or device should make routines easier, not create another chore to maintain.",
      "For chronic conditions, the most valuable features are usually reminders, clear trend charts, and easy ways to share data with a care team.",
      "Not every metric needs to be tracked every day. Focus on the numbers that meaningfully guide decisions and support consistency over time.",
      "Technology is most helpful when it supports human care. The device captures the pattern, and the clinician helps translate it into the next step."
    ],
    contentAr: [
      "تعمل أدوات الصحة الرقمية بشكل أفضل عندما تقلل التعقيد. التطبيق أو الجهاز الجيد يجب أن يجعل الروتين أسهل، لا أن يضيف عبئاً جديداً.",
      "في الحالات المزمنة، غالباً ما تكون التذكيرات والرسوم الواضحة للاتجاهات وسهولة مشاركة البيانات مع الفريق الطبي هي الميزات الأكثر قيمة.",
      "ليست كل الأرقام بحاجة إلى متابعة يومية. ركز على المؤشرات التي تساعد فعلاً في اتخاذ القرار وتدعم الاستمرارية.",
      "التقنية مفيدة عندما تدعم الرعاية الإنسانية. الجهاز يلتقط النمط، والطبيب يساعد على تحويله إلى خطوة عملية."
    ],
  },
];

/** Returns locale-resolved fields for display. Does not mutate original. */
export function getPostLocale(post: BlogPost, locale: string) {
  return {
    ...post,
    title: locale === "ar" ? post.titleAr : post.title,
    excerpt: locale === "ar" ? post.excerptAr : post.excerpt,
    category: locale === "ar" ? post.categoryAr : post.category,
    content: locale === "ar" ? post.contentAr : post.content,
  };
}
