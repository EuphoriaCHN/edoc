import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { breadcrumbItemRender } from '@/common/utils';

import { useSelector, useDispatch } from 'react-redux';
import { Store } from '@/store';
import { setProject, setPageLibrary } from '@/store/ProjectStore';
import { setHelmet } from '@/store/GlobalStore';
import { nanoid } from '@reduxjs/toolkit';

import { ProjectAPI, PageLibraryAPI, DocumentAPI } from '@/api';

import { Spin, message, Tree, Typography, Breadcrumb, Button, Table, Dropdown, Menu, Modal, Badge, Tooltip } from 'antd';
import { PlusOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons';

import CreateDocumentModal from '@/components/CreateDocumentModal';
import DocumentImage from '@/common/images/Document';
import FolderImage from '@/common/images/Folder';

import { MenuInfo } from 'rc-menu/lib/interface';
import { DataNode } from 'rc-tree/lib/interface';
import { GetComponentProps } from 'rc-table/lib/interface';
import { ColumnType } from 'antd/lib/table/interface';

import './index.scss';

const DEFAULT_OWNER_DIR_ID = 0;

enum DOCUMENT_STATUS_ENUM {
  deployed = 'deployed',
  onlySave = 'only_save'
}

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
  } = PageLibraryAPI.useAllPageLibraryBySiteID({ manual: true });

  /**
   * ????????????????????????
   */
  const librariesTreeData = React.useMemo(() => {
    const libraries = sitePageLibraries?.data || [];

    if (!libraries.length) {
      return null;
    }

    return libraries.map((item: any): DataNode => ({
      title: item.pageName,
      key: item.id,
    }));
  }, [sitePageLibraries]);

  /**
   * ??????????????????
   */
  const loadDocumentData = React.useCallback(async (params: any) => {
    setLoading(true);
    try {
      const { data } = await DocumentAPI.getDocumentList(Object.assign({ ownerDirId: DEFAULT_OWNER_DIR_ID }, params));
      if (!data || !Array.isArray(data) || !data.length) {
        setTableData([]);
      } else {
        setTableData(data);
      }
    } catch (err) {
      message.error(err.message || JSON.stringify(err));
      message.error(t('??????????????????'));
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ???????????? Document
   */
  const handleDeleteDocument = React.useCallback(async (record: any) => {
    const { ownerDirId, ownerPageId } = record;
    return DocumentAPI.deleteDocument({ id: record.id }).then(res => {
      message.success(!!record.isDir ? t('??????????????????') : t('???????????????'));
      loadDocumentData({ ownerDirId, ownerPageId });
    }, err => {
      message.error(err.message || JSON.stringify(err));
      message.error(!!record.isDir ? t('?????????????????????') : t('??????????????????'));
    });
  }, []);

  /**
   * ?????? Document
   */
  const handleOnClickDeleteDocument = React.useCallback((menuInfo: MenuInfo, record: any) => {
    const { domEvent } = menuInfo;

    domEvent.stopPropagation();
    domEvent.preventDefault();

    Modal.confirm({
      title: t('???????????????'),
      content: t('????????????????????????'),
      okText: t('??????'),
      cancelText: t('??????'),
      okButtonProps: { danger: true },
      onOk: () => handleDeleteDocument(record)
    });
  }, []);

  /**
   * ???????????? Columns ??????
   */
  const tableColumns = React.useMemo<Array<ColumnType<any>>>(() => [{
    dataIndex: 'isDir',
    className: 'document-table-icon',
    render: (isDir: number) => isDir ? <FolderImage /> : <DocumentImage />,
    width: 52
  }, {
    render: (_, { documentName, documentStatusEnum, isDir }) => {
      const deployed = documentStatusEnum === DOCUMENT_STATUS_ENUM.deployed;

      return (
        <div className={'document-table-title'}>
          {isDir ? null : (
            <Tooltip title={deployed ? t('?????????') : t('?????????')}>
              <Badge status={deployed ? 'processing' : 'default'} dot />
            </Tooltip>
          )}
          <Typography.Title level={5}>{documentName}</Typography.Title>
        </div>
      );
    }
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
              {t('??????')}
            </Menu.Item>
          </Menu>
        )}
      >
        <a className={'ant-dropdown-link'} onClick={e => e.stopPropagation()}>
          {t('??????')} <DownOutlined />
        </a>
      </Dropdown>
    ),
    width: 100
  }], []);

  /**
   * Table onRow ??????
   */
  const tableOnRow = React.useCallback<GetComponentProps<any>>(record => ({
    onClick: event => {
      if (!record.isDir) {
        // ?????????????????????
        _history.push(`/siteDetail/${siteID}/${pageLibraryID}/${record.id}`);
        return;
      }
      setPathStack(prev => prev.concat([record]));

      // ?????????????????????????????????
      // ????????????
      loadDocumentData({ ownerDirId: record.id });
    }
  }), [siteID, pageLibraryID]);

  /**
   * ??????????????????
   */
  const loadData = React.useCallback(async () => {
    setLoading(true);

    try {
      if (!projectState.project?.id) {
        const projectData = await ProjectAPI.getProjectByID({ id: siteID });
        _dispatch(setProject({
          id: nanoid(),
          project: projectData?.data
        }));
      }
      if (!projectState.pageLibrary?.id) {
        const pageLibraryData = await PageLibraryAPI.getPageLibraryByID({ id: pageLibraryID });
        _dispatch(setPageLibrary({
          id: nanoid(),
          pageLibrary: pageLibraryData?.data
        }));
      }
    } catch (err) {
      setIsError(true);
      message.error(typeof err === 'string' ? err : err.message || JSON.stringify(err));
      message.error(t('????????????????????????????????????'));
    } finally {
      setLoading(false);
    }
  }, [projectState]);

  /**
   * ??? Tree ???????????????
   */
  const onTreeSelect = React.useCallback((_: number[], { selectedNodes }) => {
    if (!selectedNodes.length) {
      return;
    }
    setSelectedTreeNode(selectedNodes[0]);
  }, []);

  const initData = React.useCallback(async () => {
    if (isNaN(parseInt(siteID)) || isNaN(parseInt(pageLibraryID))) {
      _history.push('/notFound');
      return;
    }

    try {
      await loadData();
      const value = await loadPageLibrary({ ownerProjectId: siteID });

      // ???????????????????????????????????????????????????
      if (value?.data && Array.isArray(value.data) && !!value.data.length) {
        for (const item of value.data) {
          if (item.id == pageLibraryID) {
            setSelectedTreeNode({ title: item.pageName, key: item.id });
            break;
          }
        }
      }
    } catch (err) {
      setIsError(true);
    }
  }, []);

  /**
   * ????????????
   */
  const handleCreateDocument = React.useCallback(async (params: any) => {
    const ownerDirId = pathStack.length > 1 ? pathStack[pathStack.length - 1].id : DEFAULT_OWNER_DIR_ID;
    const ownerPageId = pathStack[0].key;

    const requestData = Object.assign({
      ownerProjectId: parseInt(siteID),
      ownerPageId: parseInt(ownerPageId),
      ownerDirId,
    }, params);

    await DocumentAPI.createDocument(requestData);

    loadDocumentData({
      ownerPageId: requestData.ownerPageId,
      ownerDirId: requestData.ownerDirId
    });
  }, [pathStack]);

  React.useEffect(() => {
    _dispatch(setHelmet({
      id: nanoid(),
      helmet: t('???????????????')
    }));
    initData();
  }, []);

  /**
   * ??????????????????????????????????????????????????????????????????????????????????????????????????????
   */
  React.useEffect(() => {
    if (!Object.keys(selectedTreeNode).length) {
      return;
    }
    setPathStack([selectedTreeNode]);

    loadDocumentData({
      ownerPageId: selectedTreeNode.key,
    });
  }, [selectedTreeNode]);

  /**
   * ????????????????????????
   */
  const renderPageLibrary = React.useMemo(() => (
    <div className={'business-libraries'}>
      <Typography.Title level={5}>{t('?????????')}</Typography.Title>
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
   * ?????????????????????
   */
  const renderDocumentsContent = React.useMemo(() => (
    <div className={'business-documents-list'}>
      <header>
        <Breadcrumb className={'business-documents-list-breadcrumb'} itemRender={breadcrumbItemRender}>
          {pathStack.map((item, index) => (
            <Breadcrumb.Item
              key={index}
              onClick={() => {
                if (index === 0) {
                  setPathStack(prev => [prev[0]]);
                  loadDocumentData({ ownerPageId: item.key });
                }
              }}
            >
              {item.title || item.documentName}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <div>
          <Button
            type={'primary'}
            icon={<PlusOutlined />}
            onClick={setCreateDocumentModalVisible.bind(this, true)}
          >
            {t('????????????')}
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
          childrenColumnName: 'fuck', // antd ????????? record ??? children ???????????????
        }}
        rowClassName={'document-table-row'}
        onRow={tableOnRow}
      // loading={documentsListLoading}
      />
    </div>
  ), [selectedTreeNode, tableData, pathStack, tableOnRow]);

  /**
   * ????????????
   */
  const renderHeader = React.useMemo(() => (
    <header className={'business-documents-header'}>
      <Breadcrumb
        routes={[{
          path: '/',
          breadcrumbName: t('??????'),
        }, {
          path: `/siteDetail/${projectState.project?.id || 0}`,
          breadcrumbName: projectState.project?.projectName || t('?????????...'),
        }, {
          path: `/siteDetail/${projectState.project?.id || 0}`,
          breadcrumbName: selectedTreeNode.title || t('?????????...'),
        }]}
        itemRender={breadcrumbItemRender}
      />
    </header>
  ), [projectState, selectedTreeNode]);

  /**
   * ??????????????????
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
        onOk={handleCreateDocument}
        disabledCreateDir={pathStack.length > 1}
      />
    </React.Fragment>
  );
}

export default BusinessDocuments;
