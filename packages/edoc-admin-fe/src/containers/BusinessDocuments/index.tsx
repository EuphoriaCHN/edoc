import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { breadcrumbItemRender } from '@/common/utils';

import { useSelector, useDispatch } from 'react-redux';
import { Store } from '@/store';
import { setProject, setPageLibrary } from '@/store/ProjectStore';
import { nanoid } from '@reduxjs/toolkit';

import { ProjectAPI, PageLibraryAPI, DocumentAPI } from '@/api';

import { Spin, message, Tree, Typography, Breadcrumb, Button, Table, Dropdown, Menu, Modal } from 'antd';
import { PlusOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons';

import CreateDocumentModal from '@/components/CreateDocumentModal';
import DocumentImage from '@/common/images/Document';
import FolderImage from '@/common/images/Folder';

import { MenuInfo } from 'rc-menu/lib/interface';
import { DataNode } from 'rc-tree/lib/interface';
import { GetComponentProps } from 'rc-table/lib/interface';
import { ColumnType } from 'antd/lib/table/interface';

import './index.scss';

interface IProps {

}

function BusinessDocuments(props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [selectedTreeNode, setSelectedTreeNode] = React.useState<any>({});
  const [pathStack, setPathStack] = React.useState<any[]>([]);
  const [tableData, setTableData] = React.useState<any[]>([]);

  const [createDocumentModalVisible, setCreateDocumentModalVisible] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const projectState = useSelector<Store, Store['project']>(state => state.project);
  const { siteID, pageLibraryID } = useParams<{ siteID: string; pageLibraryID: string }>();
  const _dispatch = useDispatch();
  const _location = useLocation();
  const _history = useHistory();

  const {
    data: sitePageLibraries,
    start: loadPageLibrary,
    loading: pageLibraryLoading
  } = PageLibraryAPI.usePageLibraryList({ manual: true });

  const {
    data: documentsList,
    start: loadDocumentList,
    loading: documentsListLoading
  } = DocumentAPI.useDocumentList({ manual: true });

  /**
   * 页面库树节点数据
   */
  const librariesTreeData = React.useMemo(() => {
    const libraries = sitePageLibraries?.list || [];

    if (!libraries.length) {
      return null;
    }

    return libraries.map((item: any): DataNode => ({
      title: item.name,
      key: item.ID,
    }));
  }, [sitePageLibraries]);

  /**
   * 删除一个 Document
   */
  const handleDeleteDocument = React.useCallback(async (record: any) => {
    // todo:: 删除 Document
  }, []);

  const handleOnClickDeleteDocument = React.useCallback((menuInfo: MenuInfo, record: any) => {
    const { domEvent } = menuInfo;

    domEvent.stopPropagation();
    domEvent.preventDefault();

    Modal.confirm({
      title: t('确认删除？'),
      content: t('删除数据无法恢复'),
      okText: t('删除'),
      cancelText: t('取消'),
      okButtonProps: { danger: true },
      onOk: () => handleDeleteDocument(record)
    });
  }, []);

  /**
   * 文档表格 Columns 定义
   */
  const tableColumns = React.useMemo<Array<ColumnType<any>>>(() => [{
    dataIndex: 'isDir',
    className: 'document-table-icon',
    render: (isDir: number) => isDir ? <FolderImage /> : <DocumentImage />,
    width: 52
  }, {
    className: 'document-table-title',
    render: (_, { title }) =>
      <React.Fragment>
        <Typography.Title level={5}>{title}</Typography.Title>
      </React.Fragment>
  }, {
    render: (_, record) => (
      <Dropdown
        overlay={(
          <Menu>
            <Menu.Item 
              onClick={info => handleOnClickDeleteDocument(info, record)} 
              icon={<DeleteOutlined />} 
              danger
            >
              {t('删除')}
            </Menu.Item>
          </Menu>
        )}
      >
        <a className={'ant-dropdown-link'} onClick={e => e.stopPropagation()}>
          {t('更多')} <DownOutlined />
        </a>
      </Dropdown>
    ),
    width: 100
  }], []);

  /**
   * Table onRow 定义
   */
  const tableOnRow = React.useCallback<GetComponentProps<any>>(record => ({
    onClick: event => {
      if (!record.isDir) {
        // 跳转到编辑页面
        _history.push(`/siteDetail/${siteID}/${pageLibraryID}/${record.ID}`);
        return;
      }
      // 点击了文件夹，需要进入
      setPathStack(prev => prev.concat([record]));
      setTableData(record.children);
    }
  }), [siteID, pageLibraryID]);

  /**
   * 加载必须数据
   */
  const loadData = React.useCallback(async () => {
    setLoading(true);

    try {
      if (!projectState.project?.id) {
        const projectData = await ProjectAPI.getProjectByID({ id: siteID });
        _dispatch(setProject({
          id: nanoid(),
          project: projectData
        }));
      }
      if (!projectState.pageLibrary?.ID) {
        const pageLibraryData = await PageLibraryAPI.getPageLibraryByID({ pageLibraryID });
        _dispatch(setPageLibrary({
          id: nanoid(),
          pageLibrary: pageLibraryData
        }));
      }
    } catch (err) {
      setIsError(true);
      message.error(typeof err === 'string' ? err : err.message || JSON.stringify(err));
      message.error(t('加载站点与页面库信息失败'));
    } finally {
      setLoading(false);
    }
  }, [projectState]);

  /**
   * 当 Tree 节点被选中
   */
  const onTreeSelect = React.useCallback((_: number[], { selectedNodes }) => {
    if (!selectedNodes.length) {
      return;
    }
    setSelectedTreeNode(selectedNodes[0]);
  }, []);

  React.useEffect(() => {
    setIsError(false);
    if (!siteID || !pageLibraryID) {
      message.error(t('错误路由参数'));
      setIsError(true);
      return;
    }
    loadData();
    loadPageLibrary({ siteID, type: 'all' });
  }, []);

  /**
   * 树节点数据发生变化，默认设置第一个
   */
  React.useEffect(() => {
    if (Array.isArray(librariesTreeData) && !!librariesTreeData.length) {
      setSelectedTreeNode(librariesTreeData[0]);
    }
  }, [librariesTreeData]);

  /**
   * 被选中的树节点发生变化（切换页面库），需要拉取当前页面库下的所有数据
   */
  React.useEffect(() => {
    if (!Object.keys(selectedTreeNode).length) {
      return;
    }
    setPathStack([selectedTreeNode]);

    loadDocumentList({
      pageLibraryID: selectedTreeNode.key,
    });
  }, [selectedTreeNode]);

  /**
   * 当前页面库文档结构发生变化（切换页面库导致），需要重刷 table 数据
   */
  React.useEffect(() => {
    if (!Array.isArray(documentsList) || !documentsList.length) {
      setTableData([]);
    } else {
      setTableData(documentsList);
    }
  }, [documentsList]);

  /**
   * 渲染页面库树节点
   */
  const renderPageLibrary = React.useMemo(() => (
    <div className={'business-libraries'}>
      <Typography.Title level={5}>{t('页面库')}</Typography.Title>
      <Tree
        className={'business-libraries-tree'}
        treeData={librariesTreeData}
        titleRender={node =>
          <div className={'business-libraries-tree-node'}>
            <Typography.Paragraph className={'business-libraries-tree-node-title'} ellipsis={{ rows: 1 }}>
              {node.title}
            </Typography.Paragraph>
          </div>
        }
        onSelect={onTreeSelect}
        selectedKeys={[selectedTreeNode.key]}
        // draggable
        blockNode
      />
    </div>
  ), [librariesTreeData, selectedTreeNode]);

  /**
   * 渲染页面库文章
   */
  const renderDocumentsContent = React.useMemo(() => (
    <div className={'business-documents-list'}>
      <header>
        <Breadcrumb className={'business-documents-list-breadcrumb'} itemRender={breadcrumbItemRender}>
          {pathStack.map((item, index) =>
            <Breadcrumb.Item
              key={index}
              onClick={() => {
                // 如果 index === 0，则展示页面库全部数据
                if (index === 0) {
                  setPathStack(prev => [prev[0]]);
                  setTableData(documentsList);
                }
                // 反之，展示 pathStack 对应的数据
                // todo:: index 只可能 === 0，目前 renderer 不支持二级目录
              }}
            >
              {item.title}
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
        <div>
          <Button
            type={'primary'}
            icon={<PlusOutlined />}
            onClick={setCreateDocumentModalVisible.bind(this, true)}
          >
            {t('新建页面')}
          </Button>
        </div>
      </header>
      <Table
        className={'document-table'}
        columns={tableColumns}
        dataSource={tableData}
        showHeader={false}
        pagination={false}
        rowKey={'ID'}
        expandable={{
          childrenColumnName: 'fuck', // antd 默认把 record 的 children 当成展开项
        }}
        rowClassName={'document-table-row'}
        onRow={tableOnRow}
      />
    </div>
  ), [selectedTreeNode, tableData, pathStack, tableOnRow]);

  /**
   * 渲染头部
   */
  const renderHeader = React.useMemo(() => (
    <header className={'business-documents-header'}>
      <Breadcrumb itemRender={breadcrumbItemRender}>
        <Breadcrumb.Item href={'/'}>{t('首页')}</Breadcrumb.Item>
        <Breadcrumb.Item href={`/siteDetail/${projectState.project?.ID || 0}`}>
          {projectState.project?.name || t('加载中...')}
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {projectState.pageLibrary?.name || t('加载中...')}
        </Breadcrumb.Item>
      </Breadcrumb>
    </header>
  ), [projectState]);

  /**
   * 渲染主要结构
   */
  const renderContent = React.useMemo(() => {
    if (isError) {
      return null;
    }
    return (
      <div className={'business-documents-content'}>
        {renderPageLibrary}
        {renderDocumentsContent}
      </div>
    );
  }, [isError, renderPageLibrary, renderDocumentsContent]);

  return (
    <React.Fragment>
      <div className={'content-container business-documents'}>
        <Spin spinning={loading || pageLibraryLoading}>
          {renderHeader}
          {renderContent}
        </Spin>
      </div>
      <CreateDocumentModal 
        visible={createDocumentModalVisible} 
        onCancel={setCreateDocumentModalVisible.bind(this, false)}
      />
    </React.Fragment>
  );
}

export default BusinessDocuments;
