export const PIE_CONFIG: any = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref: any) {
        const percent = _ref.percent;
        return `${percent * 100}%`
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };

export function getPieConfig() {
    return Object.assign({}, PIE_CONFIG);
}