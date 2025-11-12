// بيانات المبيعات التاريخية الكاملة - من أغسطس إلى نوفمبر 2025

const ALL_SALES = [
    // أغسطس 2025
    {
        id: 'sale_1724664600000',
        employeeName: 'يزيد',
        customerNumber: '537401567',
        bookingNumber: '98040',
        action: 'تم التواصل',
        status: 'مكتمل',
        notes: 'تم الحجز بنجاح',
        date: '26/08/2025',
        time: '09:30:00'
    },
    {
        id: 'sale_1724678400000',
        employeeName: 'انوار العمار',
        customerNumber: '537402678',
        bookingNumber: '98065',
        action: 'تم الحجز',
        status: 'مكتمل',
        notes: 'عميل جديد - تجربة أولى',
        date: '26/08/2025',
        time: '13:20:00'
    },
    {
        id: 'sale_1724751000000',
        employeeName: 'يزيد',
        customerNumber: '537403789',
        bookingNumber: '',
        action: 'لا يرد',
        status: 'قيد المتابعة',
        notes: 'محاولة الاتصال مرتين',
        date: '27/08/2025',
        time: '10:30:00'
    },
    {
        id: 'sale_1724764800000',
        employeeName: 'الهنوف',
        customerNumber: '537404890',
        bookingNumber: '98142',
        action: 'تم التواصل',
        status: 'مكتمل',
        notes: 'عميل دائم',
        date: '27/08/2025',
        time: '14:20:00'
    },
    {
        id: 'sale_1724837400000',
        employeeName: 'انوار العمار',
        customerNumber: '537405901',
        bookingNumber: '98178',
        action: 'تم الحجز',
        status: 'مكتمل',
        notes: 'حجز لمدة أسبوعين',
        date: '28/08/2025',
        time: '11:30:00'
    },
    {
        id: 'sale_1724851200000',
        employeeName: 'يزيد',
        customerNumber: '537406012',
        bookingNumber: '',
        action: 'رقم خاطئ',
        status: 'ملغي',
        notes: 'رقم غير صحيح',
        date: '28/08/2025',
        time: '15:20:00'
    },
    {
        id: 'sale_1724923800000',
        employeeName: 'الهنوف',
        customerNumber: '537407123',
        bookingNumber: '98223',
        action: 'متابعة لاحقة',
        status: 'قيد المتابعة',
        notes: 'العميل يفكر - معاودة الاتصال غداً',
        date: '29/08/2025',
        time: '12:30:00'
    },
    {
        id: 'sale_1725010200000',
        employeeName: 'انوار العمار',
        customerNumber: '537408234',
        bookingNumber: '98267',
        action: 'تم الحجز',
        status: 'مكتمل',
        notes: 'تم عرض كود خصم 10%',
        date: '30/08/2025',
        time: '13:30:00'
    },

    // سبتمبر 2025
    {
        id: 'sale_1725183000000',
        employeeName: 'يزيد',
        customerNumber: '537409345',
        bookingNumber: '98322',
        action: 'تم التواصل',
        status: 'مكتمل',
        notes: 'عميل راضٍ عن الخدمة السابقة',
        date: '01/09/2025',
        time: '09:30:00'
    },
    {
        id: 'sale_1725196800000',
        employeeName: 'الهنوف',
        customerNumber: '537410456',
        bookingNumber: '',
        action: 'لا يرد',
        status: 'قيد المتابعة',
        notes: 'محاولة الاتصال مرة واحدة',
        date: '01/09/2025',
        time: '13:20:00'
    },
    {
        id: 'sale_1725269400000',
        employeeName: 'انوار العمار',
        customerNumber: '537411567',
        bookingNumber: '98389',
        action: 'تم الحجز',
        status: 'مكتمل',
        notes: 'حجز عاجل',
        date: '02/09/2025',
        time: '10:30:00'
    },
    {
        id: 'sale_1725283200000',
        employeeName: 'يزيد',
        customerNumber: '537412678',
        bookingNumber: '98423',
        action: 'تم التواصل',
        status: 'مكتمل',
        notes: 'تم توفير عقار بديل',
        date: '02/09/2025',
        time: '14:20:00'
    },
    {
        id: 'sale_1725355800000',
        employeeName: 'الهنوف',
        customerNumber: '537413789',
        bookingNumber: '',
        action: 'متابعة لاحقة',
        status: 'قيد المتابعة',
        notes: 'يبحث عن عقار أكبر',
        date: '03/09/2025',
        time: '11:30:00'
    },
    {
        id: 'sale_1725442200000',
        employeeName: 'انوار العمار',
        customerNumber: '537414890',
        bookingNumber: '98467',
        action: 'تم الحجز',
        status: 'مكتمل',
        notes: 'عميل جديد من التسويق',
        date: '04/09/2025',
        time: '12:30:00'
    },
    {
        id: 'sale_1725528600000',
        employeeName: 'يزيد',
        customerNumber: '537415901',
        bookingNumber: '98501',
        action: 'تم التواصل',
        status: 'مكتمل',
        notes: 'استفسار عن الأسعار والخصومات',
        date: '05/09/2025',
        time: '13:30:00'
    },

    // أكتوبر 2025
    {
        id: 'sale_1728031800000',
        employeeName: 'الهنوف',
        customerNumber: '537416012',
        bookingNumber: '98723',
        action: 'تم الحجز',
        status: 'مكتمل',
        notes: 'حجز لعائلة كبيرة',
        date: '04/10/2025',
        time: '10:30:00'
    },
    {
        id: 'sale_1728118200000',
        employeeName: 'انوار العمار',
        customerNumber: '537417123',
        bookingNumber: '',
        action: 'لا يرد',
        status: 'قيد المتابعة',
        notes: 'محاولة الاتصال ثلاث مرات',
        date: '05/10/2025',
        time: '11:30:00'
    },
    {
        id: 'sale_1728204600000',
        employeeName: 'يزيد',
        customerNumber: '537418234',
        bookingNumber: '98812',
        action: 'تم التواصل',
        status: 'مكتمل',
        notes: 'تم ارسال سكربت المبيعات',
        date: '06/10/2025',
        time: '12:30:00'
    },
    {
        id: 'sale_1728291000000',
        employeeName: 'الهنوف',
        customerNumber: '537419345',
        bookingNumber: '98845',
        action: 'تم الحجز',
        status: 'مكتمل',
        notes: 'عميل VIP',
        date: '07/10/2025',
        time: '13:30:00'
    },
    {
        id: 'sale_1728377400000',
        employeeName: 'انوار العمار',
        customerNumber: '537420456',
        bookingNumber: '',
        action: 'رقم خاطئ',
        status: 'ملغي',
        notes: 'رقم غير موجود',
        date: '08/10/2025',
        time: '14:30:00'
    },

    // نوفمبر 2025
    {
        id: 'sale_1730452200000',
        employeeName: 'يزيد',
        customerNumber: '537421567',
        bookingNumber: '99023',
        action: 'تم الحجز',
        status: 'مكتمل',
        notes: 'حجز سريع',
        date: '01/11/2025',
        time: '09:30:00'
    },
    {
        id: 'sale_1730538600000',
        employeeName: 'الهنوف',
        customerNumber: '537422678',
        bookingNumber: '99067',
        action: 'تم التواصل',
        status: 'مكتمل',
        notes: 'عميل يبحث عن عقار فاخر',
        date: '02/11/2025',
        time: '10:30:00'
    },
    {
        id: 'sale_1730625000000',
        employeeName: 'انوار العمار',
        customerNumber: '537423789',
        bookingNumber: '',
        action: 'متابعة لاحقة',
        status: 'قيد المتابعة',
        notes: 'يقارن الأسعار',
        date: '03/11/2025',
        time: '11:30:00'
    },
    {
        id: 'sale_1730711400000',
        employeeName: 'يزيد',
        customerNumber: '537424890',
        bookingNumber: '99145',
        action: 'تم الحجز',
        status: 'مكتمل',
        notes: 'تم عرض كود خصم 15%',
        date: '04/11/2025',
        time: '12:30:00'
    },
    {
        id: 'sale_1730797800000',
        employeeName: 'الهنوف',
        customerNumber: '537425901',
        bookingNumber: '99189',
        action: 'تم التواصل',
        status: 'مكتمل',
        notes: 'استفسار عن التأمين',
        date: '05/11/2025',
        time: '13:30:00'
    },
    {
        id: 'sale_1730884200000',
        employeeName: 'انوار العمار',
        customerNumber: '537426012',
        bookingNumber: '',
        action: 'لا يرد',
        status: 'قيد المتابعة',
        notes: 'محاولة واحدة',
        date: '06/11/2025',
        time: '14:30:00'
    },
    {
        id: 'sale_1730970600000',
        employeeName: 'يزيد',
        customerNumber: '537427123',
        bookingNumber: '99267',
        action: 'تم الحجز',
        status: 'مكتمل',
        notes: 'حجز لمدة شهر كامل',
        date: '07/11/2025',
        time: '15:30:00'
    },
    {
        id: 'sale_1731057000000',
        employeeName: 'الهنوف',
        customerNumber: '537428234',
        bookingNumber: '99301',
        action: 'تم التواصل',
        status: 'مكتمل',
        notes: 'عميل راضٍ جداً',
        date: '08/11/2025',
        time: '16:30:00'
    },
    {
        id: 'sale_1731143400000',
        employeeName: 'انوار العمار',
        customerNumber: '537429345',
        bookingNumber: '99345',
        action: 'تم الحجز',
        status: 'مكتمل',
        notes: 'حجز عاجل لنفس اليوم',
        date: '09/11/2025',
        time: '09:30:00'
    },
    {
        id: 'sale_1731229800000',
        employeeName: 'يزيد',
        customerNumber: '537430456',
        bookingNumber: '99389',
        action: 'تم التواصل',
        status: 'مكتمل',
        notes: 'عميل دائم - الحجز السادس',
        date: '10/11/2025',
        time: '10:30:00'
    }
];

// تصدير البيانات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ALL_SALES };
}
