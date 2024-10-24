import {
    differenceInDays,
    format,
    isSameDay,
    isSameMonth,
    isSameWeek,
    subDays,
    subMonths,
    subWeeks,
} from 'date-fns';
import {
    DaySalesData,
    Order,
    WeekSalesData,
    MonthSalesData,
} from './interfaces';

export const prepareLast7DaysData = (orders: Order[]) => {
    const today = new Date();
    const data: DaySalesData[] = [];

    for (let i = 0; i < 7; i++) {
        const targetDate = subDays(today, i);
        let totalSalesForDay = 0;

        orders.forEach((order) => {
            const paymentDate = new Date(order.paymentDate);
            const orderTotal = order.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            if (isSameDay(paymentDate, targetDate)) {
                totalSalesForDay += orderTotal;
            }
        });

        data.push({
            day: format(targetDate, 'dd/MM'),
            sales: totalSalesForDay,
        });
    }

    return data.reverse(); // Para mostrar os dias de forma crescente (do mais antigo ao mais recente)
};

export const prepareLast7WeeksData = (orders: Order[]) => {
    const today = new Date();

    const data: WeekSalesData[] = [];

    for (let i = 0; i < 7; i++) {
        const startOfWeek = subWeeks(today, i);
        let totalSalesForWeek = 0;

        orders.forEach((order) => {
            const paymentDate = new Date(order.paymentDate);
            const orderTotal = order.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            if (isSameWeek(paymentDate, startOfWeek)) {
                totalSalesForWeek += orderTotal;
            }
        });

        data.push({
            week: `Semana ${i + 1}`,
            sales: totalSalesForWeek,
        });
    }

    return data.reverse();
};

export const prepareLast7MonthsData = (orders: Order[]) => {
    const today = new Date();
    const data: MonthSalesData[] = [];

    for (let i = 0; i < 7; i++) {
        const targetMonth = subMonths(today, i);
        let totalSalesForMonth = 0;

        orders.forEach((order) => {
            const paymentDate = new Date(order.paymentDate);
            const orderTotal = order.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            if (isSameMonth(paymentDate, targetMonth)) {
                totalSalesForMonth += orderTotal;
            }
        });

        data.push({
            month: format(targetMonth, 'MM/yyyy'), // Exibe o mês no formato MM/AAAA
            sales: totalSalesForMonth,
        });
    }

    return data.reverse();
};

export const calculateSales = (orders: Order[]) => {
    const today = new Date();
    let dayTotal = 0;
    let yesterdayTotal = 0;
    let weekTotal = 0;
    let lastWeekTotal = 0;
    let monthTotal = 0;
    let lastMonthTotal = 0;

    const yesterday = subDays(today, 1);
    const lastWeek = subWeeks(today, 1);
    const lastMonth = subMonths(today, 1);

    orders.forEach((order) => {
        const paymentDate = new Date(order.paymentDate);
        const orderTotal = order.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
        console.log('orderTotal', orderTotal);

        if (differenceInDays(today, paymentDate) === 0) {
            dayTotal += orderTotal;
        }

        if (differenceInDays(yesterday, paymentDate) === 0) {
            yesterdayTotal += orderTotal;
        }

        if (isSameWeek(today, paymentDate)) {
            weekTotal += orderTotal;
        }

        if (isSameWeek(lastWeek, paymentDate)) {
            lastWeekTotal += orderTotal;
        }

        if (isSameMonth(today, paymentDate)) {
            monthTotal += orderTotal;
        }

        if (isSameMonth(lastMonth, paymentDate)) {
            lastMonthTotal += orderTotal;
        }
    });

    return {
        dayTotal,
        yesterdayTotal,
        weekTotal,
        lastWeekTotal,
        monthTotal,
        lastMonthTotal,
    };
};

export const calculatePercentageChange = (
    current: number,
    previous: number
) => {
    if (previous === 0) return 'Nenhuma venda nesse periodo';
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(2) + '%';
};
