// بيانات المحادثات التاريخية - من أغسطس إلى نوفمبر 2025

const ALL_CONVERSATIONS = [
    // أغسطس 2025
    {
        id: 'conv_1724668200000',
        employeeName: 'ابراهيم',
        customerNumber: '537301456',
        conversationType: 'استفسار',
        conversationDetails: 'العميل يستفسر عن طرق الدفع المتاحة والتأمين',
        date: '26/08/2025',
        time: '10:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم توضيح كل التفاصيل'
    },
    {
        id: 'conv_1724682600000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537302567',
        conversationType: 'شكوى',
        conversationDetails: 'العميل يشتكي من تأخر في الرد على استفساراته',
        date: '26/08/2025',
        time: '14:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم الاعتذار وتقديم خصم'
    },
    {
        id: 'conv_1724754600000',
        employeeName: 'ابراهيم',
        customerNumber: '537303678',
        conversationType: 'متابعة',
        conversationDetails: 'متابعة حجز العميل والتأكد من رضاه عن العقار',
        date: '27/08/2025',
        time: '11:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'العميل راضٍ'
    },
    {
        id: 'conv_1724768400000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537304789',
        conversationType: 'استفسار',
        conversationDetails: 'استفسار عن سياسة الإلغاء والاسترداد',
        date: '27/08/2025',
        time: '15:20:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم شرح السياسة كاملة'
    },
    {
        id: 'conv_1724841000000',
        employeeName: 'ابراهيم',
        customerNumber: '537305890',
        conversationType: 'طلب خاص',
        conversationDetails: 'العميل يطلب تمديد فترة الحجز',
        date: '28/08/2025',
        time: '12:30:00',
        status: 'pending',
        followUpRequired: true,
        notes: 'تحتاج موافقة المالك'
    },
    {
        id: 'conv_1724854800000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537306901',
        conversationType: 'استفسار',
        conversationDetails: 'استفسار عن العقارات المتاحة في منطقة معينة',
        date: '28/08/2025',
        time: '16:20:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم إرسال قائمة العقارات'
    },
    {
        id: 'conv_1724927400000',
        employeeName: 'ابراهيم',
        customerNumber: '537307012',
        conversationType: 'شكوى',
        conversationDetails: 'العميل يشتكي من نظافة العقار',
        date: '29/08/2025',
        time: '13:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم إرسال فريق التنظيف'
    },
    {
        id: 'conv_1724941200000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537308123',
        conversationType: 'متابعة',
        conversationDetails: 'متابعة شكوى العميل السابقة',
        date: '29/08/2025',
        time: '17:20:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم حل المشكلة'
    },

    // سبتمبر 2025
    {
        id: 'conv_1725186600000',
        employeeName: 'ابراهيم',
        customerNumber: '537309234',
        conversationType: 'استفسار',
        conversationDetails: 'استفسار عن موقف السيارات',
        date: '01/09/2025',
        time: '10:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم التوضيح'
    },
    {
        id: 'conv_1725200400000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537310345',
        conversationType: 'طلب خاص',
        conversationDetails: 'العميل يطلب check-in مبكر',
        date: '01/09/2025',
        time: '14:20:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تمت الموافقة'
    },
    {
        id: 'conv_1725273000000',
        employeeName: 'ابراهيم',
        customerNumber: '537311456',
        conversationType: 'شكوى',
        conversationDetails: 'مشكلة في الواي فاي',
        date: '02/09/2025',
        time: '11:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم إصلاح المشكلة'
    },
    {
        id: 'conv_1725287400000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537312567',
        conversationType: 'استفسار',
        conversationDetails: 'استفسار عن الأنشطة القريبة',
        date: '02/09/2025',
        time: '15:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم إرسال دليل المنطقة'
    },
    {
        id: 'conv_1725359400000',
        employeeName: 'ابراهيم',
        customerNumber: '537313678',
        conversationType: 'متابعة',
        conversationDetails: 'متابعة رضا العميل بعد يومين من الإقامة',
        date: '03/09/2025',
        time: '12:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'العميل راضٍ جداً'
    },
    {
        id: 'conv_1725445800000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537314789',
        conversationType: 'طلب خاص',
        conversationDetails: 'طلب تبديل العقار لعقار أكبر',
        date: '04/09/2025',
        time: '13:30:00',
        status: 'pending',
        followUpRequired: true,
        notes: 'يحتاج البحث عن عقار متاح'
    },
    {
        id: 'conv_1725532200000',
        employeeName: 'ابراهيم',
        customerNumber: '537315890',
        conversationType: 'استفسار',
        conversationDetails: 'استفسار عن إمكانية استضافة حفلة',
        date: '05/09/2025',
        time: '14:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'غير مسموح حسب سياسة المالك'
    },
    {
        id: 'conv_1725618600000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537316901',
        conversationType: 'شكوى',
        conversationDetails: 'ضوضاء من الجيران',
        date: '06/09/2025',
        time: '15:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم التواصل مع المالك'
    },

    // أكتوبر 2025
    {
        id: 'conv_1728035400000',
        employeeName: 'ابراهيم',
        customerNumber: '537317012',
        conversationType: 'استفسار',
        conversationDetails: 'استفسار عن سياسة الحيوانات الأليفة',
        date: '04/10/2025',
        time: '11:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'غير مسموح'
    },
    {
        id: 'conv_1728121800000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537318123',
        conversationType: 'متابعة',
        conversationDetails: 'متابعة حجز سابق والتأكد من جودة الخدمة',
        date: '05/10/2025',
        time: '12:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'العميل سعيد جداً'
    },
    {
        id: 'conv_1728208200000',
        employeeName: 'ابراهيم',
        customerNumber: '537319234',
        conversationType: 'طلب خاص',
        conversationDetails: 'طلب خدمة تنظيف إضافية',
        date: '06/10/2025',
        time: '13:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم الترتيب مع فريق التنظيف'
    },
    {
        id: 'conv_1728294600000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537320345',
        conversationType: 'شكوى',
        conversationDetails: 'مشكلة في التكييف',
        date: '07/10/2025',
        time: '14:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم إرسال فني الصيانة'
    },
    {
        id: 'conv_1728381000000',
        employeeName: 'ابراهيم',
        customerNumber: '537321456',
        conversationType: 'استفسار',
        conversationDetails: 'استفسار عن إمكانية Late Check-out',
        date: '08/10/2025',
        time: '15:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تمت الموافقة برسوم إضافية'
    },

    // نوفمبر 2025
    {
        id: 'conv_1730455800000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537322567',
        conversationType: 'متابعة',
        conversationDetails: 'متابعة مع عميل دائم',
        date: '01/11/2025',
        time: '10:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'عرض خصم ولاء'
    },
    {
        id: 'conv_1730542200000',
        employeeName: 'ابراهيم',
        customerNumber: '537323678',
        conversationType: 'طلب خاص',
        conversationDetails: 'طلب توفير سرير أطفال',
        date: '02/11/2025',
        time: '11:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم توفير السرير'
    },
    {
        id: 'conv_1730628600000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537324789',
        conversationType: 'شكوى',
        conversationDetails: 'تأخر في استلام مفاتيح العقار',
        date: '03/11/2025',
        time: '12:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم الاعتذار وتقديم تعويض'
    },
    {
        id: 'conv_1730715000000',
        employeeName: 'ابراهيم',
        customerNumber: '537325890',
        conversationType: 'استفسار',
        conversationDetails: 'استفسار عن خدمة التوصيل من المطار',
        date: '04/11/2025',
        time: '13:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم إرسال معلومات شركاء التوصيل'
    },
    {
        id: 'conv_1730801400000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537326901',
        conversationType: 'متابعة',
        conversationDetails: 'متابعة شكوى سابقة',
        date: '05/11/2025',
        time: '14:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم حل المشكلة نهائياً'
    },
    {
        id: 'conv_1730887800000',
        employeeName: 'ابراهيم',
        customerNumber: '537327012',
        conversationType: 'طلب خاص',
        conversationDetails: 'طلب توفير مستلزمات إضافية (مناشف - شراشف)',
        date: '06/11/2025',
        time: '15:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم التوصيل في نفس اليوم'
    },
    {
        id: 'conv_1730974200000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537328123',
        conversationType: 'استفسار',
        conversationDetails: 'استفسار عن أماكن سياحية قريبة',
        date: '07/11/2025',
        time: '16:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم إرسال خريطة تفاعلية'
    },
    {
        id: 'conv_1731060600000',
        employeeName: 'ابراهيم',
        customerNumber: '537329234',
        conversationType: 'شكوى',
        conversationDetails: 'مشكلة في قفل الباب الإلكتروني',
        date: '08/11/2025',
        time: '17:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم إصلاح القفل فوراً'
    },
    {
        id: 'conv_1731147000000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537330345',
        conversationType: 'متابعة',
        conversationDetails: 'متابعة رضا العميل بعد انتهاء الإقامة',
        date: '09/11/2025',
        time: '10:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تجربة ممتازة - يرغب في الحجز مرة أخرى'
    },
    {
        id: 'conv_1731233400000',
        employeeName: 'ابراهيم',
        customerNumber: '537331456',
        conversationType: 'طلب خاص',
        conversationDetails: 'طلب فاتورة مفصلة لأغراض العمل',
        date: '10/11/2025',
        time: '11:30:00',
        status: 'completed',
        followUpRequired: false,
        notes: 'تم إرسال الفاتورة عبر البريد الإلكتروني'
    }
];

// تصدير البيانات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ALL_CONVERSATIONS };
}
