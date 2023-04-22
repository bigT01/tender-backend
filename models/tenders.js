const tenders = [
    {
        id: 100001,
        name: 'Tender 1',
        deadline: '2023-05-31',
        price: 1500000,
        repeatCondition: 'Первая',
        priority: ['ТПХ', 'ОИ'],
        methodBuy: 'Тендер',
        conditionPayment: 'Предоплата'
    },
    {
        id: 100002,
        name: 'Tender 2',
        deadline: '2023-06-30',
        price: 2200000,
        repeat: 'Повторная',
        repeatCondition: ['ТПФ', 'ПКО'],
        methodBuy: 'Конкурс',
        conditionPayment: 'Окончательный'
    }
];

export default tenders
