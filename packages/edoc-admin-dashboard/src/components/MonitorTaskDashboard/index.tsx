import React from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { chunk } from 'lodash-es';

import { Row, Col } from 'antd';
import { Gauge, Line, Pie } from '@ant-design/charts';
import ChartsLabelWrapper from '@/components/ChartsLabelWrapper';

import { getGaugeConfig } from './settings/gauge';
import { getLineConfig } from './settings/line';
import { getPieConfig } from './settings/pie';

import './index.scss';

interface IProps {

}

const ROW_HEIGHT = 200;

function interval(callback: Function, timeout: number) {
  let stopped = false;

  setTimeout(function inner() {
    callback();
    if (stopped) {
      return;
    }
    return setTimeout(inner, timeout);
  }, timeout);

  return {
    clearInterval() {
      stopped = true;
    }
  };
}

function MonitorTaskDashboard(props: IProps) {
  // CPU 负载
  const [CPUOccupancyRatePercent, setCPUOccupancyRatePercent] = React.useState<number>(0);
  // 内存负载
  const [memoryOccupancyRatePercent, setMemoryOccupancyRatePercent] = React.useState<number>(0);
  // 磁盘占用率
  const [distOccupancyRatePercent, setDistOccupancyRatePercent] = React.useState<number>(0);
  // 已完成 / 未完成任务量占比
  const [finishedOrNotTaskProportion, setFinishedOrNotTaskProportion] = React.useState<any[]>([]);

  // 调度任务耗时
  const [schedulingTaskTimeData, setSchedulingTaskTimeData] = React.useState<any[]>([]);
  // 调度任务量
  const [schedulingTaskCountData, setSchedulingTaskCountData] = React.useState<any[]>([]);
  // 已完成调度任务量
  const [finishedSchedulingTaskCount, setFinishedSchedulingTaskCount] = React.useState<any[]>([]);
  // 未完成调度任务量
  const [unfinishedSchedulingTaskCount, setUnfinishedSchedulingTaskCount] = React.useState<any[]>([]);

  const { t } = useTranslation();

  React.useEffect(() => {
    // const cpuInterval = interval(function() {
    //   setCPUOccupancyRatePercent(prev => prev + 0.1 > 1 ? 0.1 : prev + 0.1);
    // }, 780);
    // const memoryInterval = interval(function() {
    //   setMemoryOccupancyRatePercent(prev => prev + 0.1 > 1 ? 0.1 : prev + 0.1);
    // }, 600);

    axios.request({
      url: 'https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json',
      method: 'get'
    }).then(({ data }) => {
      const [a, b, c, d] = chunk(data, Math.floor(data.length / 4));

      setSchedulingTaskTimeData(a);
      setSchedulingTaskCountData(b);
      setFinishedSchedulingTaskCount(c);
      setUnfinishedSchedulingTaskCount(d);
    });

    setFinishedOrNotTaskProportion([{
      type: t('未完成'),
      value: 36,
    }, {
      type: t('已完成'),
      value: 64,
    }]);

    // return function() {
    //   cpuInterval.clearInterval();
    //   memoryInterval.clearInterval();
    // };
  }, []);

  /**
   * CPU 使用率
   */
  const renderCPUOccupancyRate = React.useMemo(() => (
    <ChartsLabelWrapper title={t('CPU 使用率')}>
      <Gauge
        height={ROW_HEIGHT}
        percent={CPUOccupancyRatePercent}
        {...getGaugeConfig()}
      />
    </ChartsLabelWrapper>
  ), [CPUOccupancyRatePercent]);

  /**
   * 内存使用率
   */
  const renderMemoryOccupancyRate = React.useMemo(() => (
    <ChartsLabelWrapper title={t('内存使用率')}>
      <Gauge
        height={ROW_HEIGHT}
        percent={memoryOccupancyRatePercent}
        {...getGaugeConfig()}
      />
    </ChartsLabelWrapper>
  ), [memoryOccupancyRatePercent]);

  /**
   * 磁盘占用率
   */
  const renderDiskOccupancyRate = React.useMemo(() => (
    <ChartsLabelWrapper title={t('磁盘占用率')}>
      <Gauge
        height={ROW_HEIGHT}
        percent={distOccupancyRatePercent}
        {...getGaugeConfig()}
      />
    </ChartsLabelWrapper>
  ), [distOccupancyRatePercent]);

  /**
   * 已完成 / 未完成任务占比
   */
  const renderFinishedOrNotTaskProportion = React.useMemo(() => (
    <ChartsLabelWrapper title={t('完成任务占比')} titleMarginBottom={18}>
      <Pie
        height={ROW_HEIGHT}
        data={finishedOrNotTaskProportion}
        {...getPieConfig()}
      />
    </ChartsLabelWrapper>
  ), [finishedOrNotTaskProportion]);

  /**
   * 调度任务耗时
   */
  const renderSchedulingTaskTime = React.useMemo(() => (
    <ChartsLabelWrapper
      title={t('调度任务耗时')}
      titleMarginBottom={18}
      bordered
    >
      <Line {...getLineConfig()} height={ROW_HEIGHT} data={schedulingTaskTimeData} />
    </ChartsLabelWrapper>
  ), [schedulingTaskTimeData]);

  /**
   * 调度任务量
   */
  const renderSchedulingTaskCount = React.useMemo(() => (
    <ChartsLabelWrapper
      title={t('调度任务量')}
      titleMarginBottom={18}
      bordered
    >
      <Line {...getLineConfig()} height={ROW_HEIGHT} data={schedulingTaskCountData} />
    </ChartsLabelWrapper>
  ), [schedulingTaskCountData]);

  /**
   * 已完成调度任务量
   */
  const renderFinishedSchedulingTaskCount = React.useMemo(() => (
    <ChartsLabelWrapper
      title={t('已完成调度任务量')}
      titleMarginBottom={18}
      bordered
    >
      <Line {...getLineConfig()} height={ROW_HEIGHT} data={finishedSchedulingTaskCount} />
    </ChartsLabelWrapper>
  ), [finishedSchedulingTaskCount]);

  /**
   * 未完成调度任务量
   */
  const renderUnfinishedSchedulingTaskCount = React.useMemo(() => (
    <ChartsLabelWrapper
      title={t('未完成调度任务量')}
      titleMarginBottom={18}
      bordered
    >
      <Line {...getLineConfig()} height={ROW_HEIGHT} data={unfinishedSchedulingTaskCount} />
    </ChartsLabelWrapper>
  ), [unfinishedSchedulingTaskCount]);

  return (
    <div className={'dashboard'}>
      <Row gutter={24} className={'dashboard-rows'}>
        <Col span={6}>
          {renderCPUOccupancyRate}
        </Col>
        <Col span={6}>
          {renderMemoryOccupancyRate}
        </Col>
        <Col span={6}>
          {renderDiskOccupancyRate}
        </Col>
        <Col span={6}>
          {renderFinishedOrNotTaskProportion}
        </Col>
      </Row >
      <Row gutter={32} className={'dashboard-rows'}>
        <Col span={12}>
          {renderSchedulingTaskTime}
        </Col>
        <Col span={12}>
          {renderSchedulingTaskCount}
        </Col>
      </Row>
      <Row gutter={32} className={'dashboard-rows'}>
        <Col span={12}>
          {renderFinishedSchedulingTaskCount}
        </Col>
        <Col span={12}>
          {renderUnfinishedSchedulingTaskCount}
        </Col>
      </Row>
    </div>
  )
}

export default MonitorTaskDashboard;
