const GAUGE_CONFIG = {
    range: {
        ticks: [0, 1],
        color: ['l(0) 0:#30BF78 0.5:#FAAD14 1:#F4664A'],
    },
    indicator: {
        pointer: { style: { stroke: '#D0D0D0' } },
        pin: { style: { stroke: '#D0D0D0' } },
    },
    axis: {
        label: {
            formatter(value: string) {
                return Math.floor(Number(value) * 100) + '%';
            }
        }
    },
    statistic: {
        title: {
            formatter(_ref: any) {
                return ((_ref?.percent || 0) * 100).toFixed(2) + ' %';
            },
        },
    }
};

export function getGaugeConfig() {
    return Object.assign({}, GAUGE_CONFIG);
}