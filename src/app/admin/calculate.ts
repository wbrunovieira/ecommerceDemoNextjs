import { differenceInDays, isSameMonth, isSameWeek, subDays, subMonths, subWeeks } from "date-fns";
import { Order } from "./interfaces";


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
        const paymentDate = new Date(order.props.paymentDate);
        const orderTotal = order.props.items.reduce(
            (total, item) => total + item.props.price * item.props.quantity,
            0
        );

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

    return { dayTotal, yesterdayTotal, weekTotal, lastWeekTotal, monthTotal, lastMonthTotal };
};

export const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 'Nenhuma venda nesse periodo';
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(2) + '%';
};

