export const getPeriodsCount = () => getPeriods().length;

export const getPeriods = () => [
    ['8:00', '8:45'],
    ['8:55', '9:40'],
    ['9:50', '10:35'],
    ['10:45', '11:30'],
    ['11:50', '12:35'],
    ['12:50', '13:35'],
    ['13:45', '14:30'],
    ['14:35', '15:20'],
];

export const getWeekDays = () => [
    'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'
];

export const delay = (millis) => Promise.resolve(resolve => setTimeout(resolve, millis))
