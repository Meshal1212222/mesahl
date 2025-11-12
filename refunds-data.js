// بيانات الاستردادات التاريخية - من أغسطس إلى نوفمبر 2025

const ALL_REFUNDS = [
    // أغسطس 2025
    {
        id: 'refund_1724675400000',
        employeeName: 'انوار العمار',
        customerNumber: '537101234',
        bookingNumber: '98050',
        amount: '450 ريال',
        reason: 'العقار غير مطابق للوصف',
        requestDate: '26/08/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '26/08/2025',
        notes: 'تم الاسترداد كاملاً'
    },
    {
        id: 'refund_1724761800000',
        employeeName: 'يزيد',
        customerNumber: '537202345',
        bookingNumber: '98135',
        amount: '600 ريال',
        reason: 'إلغاء الحجز قبل 48 ساعة',
        requestDate: '27/08/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '27/08/2025',
        notes: 'تم الاسترداد بعد خصم رسوم الإلغاء'
    },
    {
        id: 'refund_1724848200000',
        employeeName: 'الهنوف',
        customerNumber: '537303456',
        bookingNumber: '98165',
        amount: '320 ريال',
        reason: 'مشاكل في النظافة',
        requestDate: '28/08/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '28/08/2025',
        notes: 'استرداد جزئي'
    },
    {
        id: 'refund_1724934600000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '537404567',
        bookingNumber: '98210',
        amount: '500 ريال',
        reason: 'عدم توفر العقار',
        requestDate: '29/08/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '29/08/2025',
        notes: 'تم الاسترداد كاملاً'
    },
    {
        id: 'refund_1725021000000',
        employeeName: 'رجاء احمد',
        customerNumber: '537505678',
        bookingNumber: '98256',
        amount: '280 ريال',
        reason: 'مشاكل في التأمين',
        requestDate: '30/08/2025',
        status: 'pending',
        approvedBy: null,
        approvalDate: null,
        notes: null
    },

    // سبتمبر 2025
    {
        id: 'refund_1725193800000',
        employeeName: 'ابراهيم',
        customerNumber: '537606789',
        bookingNumber: '98315',
        amount: '750 ريال',
        reason: 'صيانة العقار غير مكتملة',
        requestDate: '01/09/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '02/09/2025',
        notes: 'تم الاسترداد كاملاً'
    },
    {
        id: 'refund_1725280200000',
        employeeName: 'انوار العمار',
        customerNumber: '537707890',
        bookingNumber: '98345',
        amount: '380 ريال',
        reason: 'عدم الرد من المالك',
        requestDate: '02/09/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '03/09/2025',
        notes: 'استرداد جزئي'
    },
    {
        id: 'refund_1725366600000',
        employeeName: 'يزيد',
        customerNumber: '537808901',
        bookingNumber: '98378',
        amount: '520 ريال',
        reason: 'إلغاء العميل للحجز',
        requestDate: '03/09/2025',
        status: 'rejected',
        approvedBy: 'عبد العزيز',
        approvalDate: '04/09/2025',
        notes: 'تجاوز مدة الإلغاء المسموحة'
    },
    {
        id: 'refund_1725453000000',
        employeeName: 'الهنوف',
        customerNumber: '537909012',
        bookingNumber: '98412',
        amount: '640 ريال',
        reason: 'مشاكل في الكهرباء والماء',
        requestDate: '04/09/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '05/09/2025',
        notes: 'تم الاسترداد كاملاً'
    },
    {
        id: 'refund_1725539400000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '538010123',
        bookingNumber: '98456',
        amount: '410 ريال',
        reason: 'العقار غير نظيف',
        requestDate: '05/09/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '06/09/2025',
        notes: 'استرداد جزئي'
    },
    {
        id: 'refund_1725625800000',
        employeeName: 'رجاء احمد',
        customerNumber: '538111234',
        bookingNumber: '98489',
        amount: '350 ريال',
        reason: 'تأخر في التسليم',
        requestDate: '06/09/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '07/09/2025',
        notes: 'تم الاسترداد كاملاً'
    },

    // أكتوبر 2025
    {
        id: 'refund_1728042600000',
        employeeName: 'ابراهيم',
        customerNumber: '538212345',
        bookingNumber: '98712',
        amount: '580 ريال',
        reason: 'مشاكل في الأثاث',
        requestDate: '04/10/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '05/10/2025',
        notes: 'استرداد جزئي'
    },
    {
        id: 'refund_1728129000000',
        employeeName: 'انوار العمار',
        customerNumber: '538313456',
        bookingNumber: '98756',
        amount: '720 ريال',
        reason: 'عدم توفر موقف سيارة',
        requestDate: '05/10/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '06/10/2025',
        notes: 'تم الاسترداد كاملاً'
    },
    {
        id: 'refund_1728215400000',
        employeeName: 'يزيد',
        customerNumber: '538414567',
        bookingNumber: '98801',
        amount: '460 ريال',
        reason: 'إلغاء العميل',
        requestDate: '06/10/2025',
        status: 'pending',
        approvedBy: null,
        approvalDate: null,
        notes: null
    },
    {
        id: 'refund_1728301800000',
        employeeName: 'الهنوف',
        customerNumber: '538515678',
        bookingNumber: '98834',
        amount: '390 ريال',
        reason: 'مشاكل في التكييف',
        requestDate: '07/10/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '08/10/2025',
        notes: 'استرداد جزئي'
    },

    // نوفمبر 2025
    {
        id: 'refund_1730463000000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '538616789',
        bookingNumber: '99012',
        amount: '670 ريال',
        reason: 'العقار بعيد عن الموقع المحدد',
        requestDate: '01/11/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '02/11/2025',
        notes: 'تم الاسترداد كاملاً'
    },
    {
        id: 'refund_1730549400000',
        employeeName: 'رجاء احمد',
        customerNumber: '538717890',
        bookingNumber: '99056',
        amount: '510 ريال',
        reason: 'مشاكل في الإنترنت',
        requestDate: '02/11/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '03/11/2025',
        notes: 'استرداد جزئي'
    },
    {
        id: 'refund_1730635800000',
        employeeName: 'ابراهيم',
        customerNumber: '538818901',
        bookingNumber: '99101',
        amount: '430 ريال',
        reason: 'إلغاء قبل 72 ساعة',
        requestDate: '03/11/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '04/11/2025',
        notes: 'تم الاسترداد بعد خصم رسوم'
    },
    {
        id: 'refund_1730722200000',
        employeeName: 'انوار العمار',
        customerNumber: '538919012',
        bookingNumber: '99134',
        amount: '560 ريال',
        reason: 'عدم مطابقة الصور',
        requestDate: '04/11/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '05/11/2025',
        notes: 'تم الاسترداد كاملاً'
    },
    {
        id: 'refund_1730808600000',
        employeeName: 'يزيد',
        customerNumber: '539020123',
        bookingNumber: '99178',
        amount: '620 ريال',
        reason: 'مشاكل في الأمان',
        requestDate: '05/11/2025',
        status: 'pending',
        approvedBy: null,
        approvalDate: null,
        notes: null
    },
    {
        id: 'refund_1730895000000',
        employeeName: 'الهنوف',
        customerNumber: '539121234',
        bookingNumber: '99212',
        amount: '340 ريال',
        reason: 'مشاكل في السباكة',
        requestDate: '06/11/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '07/11/2025',
        notes: 'استرداد جزئي'
    },
    {
        id: 'refund_1730981400000',
        employeeName: 'مصطفى اوجعا',
        customerNumber: '539222345',
        bookingNumber: '99256',
        amount: '490 ريال',
        reason: 'تأخر في الرد على الشكاوى',
        requestDate: '07/11/2025',
        status: 'approved',
        approvedBy: 'عبد العزيز',
        approvalDate: '08/11/2025',
        notes: 'تم الاسترداد كاملاً'
    }
];

// تصدير البيانات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ALL_REFUNDS };
}
