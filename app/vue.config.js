module.exports = {
    pwa: {
        name: 'Zastępstwa',
        themeColor: '#4150b6',
        manifestOptions: {
            background_color: '#62534d',
            shortcuts: [
                {
                    name: 'Plan lekcji',
                    description: 'Otwórz plan lekcji',
                    url: '/plan-lekcji',
                    icons: [
                        {src: '/img/shortcuts/timetable-48.png', sizes: '48x48',},
                        {src: '/img/shortcuts/timetable-72.png', sizes: '72x72',},
                        {src: '/img/shortcuts/timetable-192.png', sizes: '192x192',},
                    ]
                }
            ]
        }
    }
};
