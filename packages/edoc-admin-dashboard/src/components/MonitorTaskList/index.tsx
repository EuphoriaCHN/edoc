import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { Table, message, Typography } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import TextPreviewModal from '@/components/TextPreviewModal';

import { ConfigApi } from '@/api';

import { ColumnsType, TablePaginationConfig } from 'antd/lib/table/interface';

import './index.scss';

export enum TaskOrigin {
  oss = 'oss',
  db = 'db'
}

const DEFAULT_PAGE_SIZE = 10;

interface IProps {

}

function MonitorTaskList(props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [dataSource, setDataSource] = React.useState<any[]>([]);
  const [textPreviewModalData, setTextPreviewModalData] = React.useState<string>('');

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);

  const { t } = useTranslation();

  const loadData = React.useCallback(async (currentPage: number) => {
    try {
      setLoading(true);
      const { data, total } = await ConfigApi.getTaskList({
        page: currentPage,
        size: DEFAULT_PAGE_SIZE
      });
      setDataSource(data);
      setTotal(total || 0);
    } catch (err) {
      message.error(err.message || JSON.stringify(err));
      message.error(t('获取任务列表失败'));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData(1);
  }, []);

  const tableColumns = React.useMemo<ColumnsType<any>>(() => [{
    title: t('任务 ID'),
    dataIndex: 'taskId',
    width: 200,
  }, {
    title: t('创建时间'),
    dataIndex: 'createdDate',
    render(dateString: string) {
      return moment(dateString).format('L');
    }
  }, {
    title: t('回调时间'),
    dataIndex: 'callBackDate',
    render(dateString: string) {
      return moment(dateString).format('lll');
    }
  }, {
    title: t('是否回调'),
    dataIndex: 'isCallBacked',
    render(isCallBacked: boolean) {
      return !!isCallBacked ? t('是') : t('否');
    }
  }, {
    title: t('任务来源'),
    dataIndex: 'taskOrigin',
    render(taskOrigin: TaskOrigin) {
      switch (taskOrigin) {
        case TaskOrigin.db:
          return t('数据库');
        case TaskOrigin.oss:
          return t('对象存储');
      }
      return t('未知');
    }
  }, {
    title: t('文案版本'),
    dataIndex: 'docVersion',
    width: 200,
    render(version: string) {
      return (
        <Typography.Paragraph
          onClick={() => setTextPreviewModalData(version)}
          ellipsis={{
            rows: 1,
            tooltip: (
              <Typography.Paragraph
                copyable={{
                  text: version,
                  tooltips: [t('点击复制'), t('已复制')],
                  icon: [<CopyOutlined style={{ color: '#fff', marginLeft: 8 }} />, <CheckOutlined style={{ color: '#b7eb8f', marginLeft: 8 }} />]
                }}
                style={{ color: '#fff' }}
              >
                {version}
              </Typography.Paragraph>
            )
          }}
          className={'monitor-task-table-cols-version'}
        >
          {version}
        </Typography.Paragraph>
      );
    }
  }], []);

  const tablePagination = React.useMemo<TablePaginationConfig>(() => ({
    total,
    pageSize: DEFAULT_PAGE_SIZE,
    current: currentPage,
    onChange(page) {
      setCurrentPage(page);
      loadData(page);
    }
  }), [total, currentPage]);

  return (
    <React.Fragment>
      <Table
        loading={loading}
        columns={tableColumns}
        dataSource={dataSource}
        pagination={tablePagination}
        className={'monitor-task-table'}
      />
      <TextPreviewModal
        visible={!!textPreviewModalData}
        onCancel={() => setTextPreviewModalData('')}
        version={textPreviewModalData}
      />
    </React.Fragment>
  );
}

export default MonitorTaskList;
