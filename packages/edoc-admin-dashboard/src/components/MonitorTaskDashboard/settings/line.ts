export const LINE_CONFIG: any = {
  padding: 'auto',
  xField: 'Date',
  yField: 'scales',
  xAxis: {
    type: 'timeCat',
    tickCount: 5,
  },
};

export function getLineConfig() {
  return Object.assign({}, LINE_CONFIG);
}