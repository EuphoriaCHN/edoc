import * as React from 'react';
import TuiEditor from 'tui-editor';
import $ from 'jquery';
import prettier from 'prettier/standalone';
import prettierMarkdown from 'prettier/parser-markdown'
import prettierHTML from 'prettier/parser-html';
import prettierJS from 'prettier/parser-babel';

// Style
import 'tui-editor/dist/tui-editor.css';
import 'codemirror/lib/codemirror.css';
// CM extra
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/yaml/yaml';
import Viewer from './components/Viewer';
import AddJSXComponentModal from './components/AddJSXComponentModal';
// import EditorThemeSelect from './components/EditorThemeSelect';
// import UploadMediaModal from './components/UploadMediaModal';
// import MoreOperationModal from './components/MoreOperationModal';
import { dataUrlReader } from './constants/utils';
import './index.scss';
// Portal Wrapper
if (!document.getElementById('edoc-portal')) {
    document.body.append($('<div id="edoc-portal"></div>').get(0));
}
export interface IEdocEditorProps {
    initialValue?: string; // 初始化值
    height: string; // ⾼度，必填
    /**
    * tui previewer 的 DOM 结构离谱⾄极，这⾥需要指定宽度，最好是百分⽐
    *
    * 最佳实践：'calc(50vw - 1px)'
    */
    previewWidth: string;
    /**
    * 编辑器准备就绪，这是拿到 editor 实例的唯⼀⼀次机会
    */
    onReady?: (editor: tuiEditor.Editor) => void;
    /**
    * 当转换图⽚时（⽐如粘贴图⽚）
    * placeholder 会作为最后展示在 ()[Here] 中的值
    */
    addImageBlobHook?: (blob: File, callback: (placeholder: string, alterName?: string) => void) => void;
    /**
    * 当上传视频时，编辑器不会做默认处理，需要接管上传逻辑
    * 返回视频 CDN URL
    */
    onUploadVideo?: (file: File, name: string) => Promise<string>;
    /**
    * 透传给 Upload 组件，当传了这个的时候，不⽤传 onUploadVideo
    */
    uploadVideoAction?: string;
    // 通过这两个 Hook 可以知道上传结果，当传⼊ onUploadVideo 时失效
    // onSuccess 会卡在这个 Promise，如果它返回了 rejected，则代表上传失败
    onUploadVideoSuccess?: (responseBody: any, file: File, fileList: any[]) => Promise<string>;
    onUploadVideoError?: () => void;
    /**
    * 当改变 Editor Theme 值时的 callback，业务可以存到 Cookie 中做⽤户偏好保存
    */
    onChangeEditorTheme?: (themeClsName: string) => void;
    /**
    * Editor Theme ClassName
    */
    editorThemeClsName?: string;
}
function EdocEditor(props: IEdocEditorProps) {
    const [addJSXComponentModalVisible, setAddJSXComponentModalVisible] =
        React.useState<boolean>(false);
    const [uploadMediaModalVisible, setUploadMediaModalVisible] = React.useState<string>('');
    // const [moreOptionModalVisible, setMoreOptionModalVisible] = React.useState(false);
    // 整个 Editor
    const editorElementRef = React.createRef<HTMLDivElement>();
    // 预览 box
    const viewerElementRef = React.createRef<HTMLDivElement>();
    // 编辑 box 的 scrollbar
    const wrapperScrollBarElementRef = React.createRef<HTMLDivElement>();
    // Editor Instance
    const editorInstanceRef = React.createRef<tuiEditor.Editor>();
    // 滚动同步锁
    const isSyncingEditorScroll = React.useRef<boolean>(false);
    const isSyncingPreviewScroll = React.useRef<boolean>(false);
    /**
    * 计算滚动同步，神 nm 的算法
    */
    const calculateSyncScroll = React.useCallback((scrollPreview?: boolean) => {
        if (!viewerElementRef.current || !wrapperScrollBarElementRef.current) {
            return;
        }
        const [a, b] = scrollPreview ? [viewerElementRef.current, wrapperScrollBarElementRef.current] :
            [wrapperScrollBarElementRef.current, viewerElementRef.current];
        const targetTop = a.scrollTop * (b.scrollHeight - a.clientHeight) / (a.scrollHeight - a.clientHeight);
        if (!scrollPreview) {
            viewerElementRef.current.scrollTop = targetTop;
        } else {
            !!editorInstanceRef.current && editorInstanceRef.current.getCodeMirror().scrollTo(0, targetTop);
        }
    }, []);
    /**
    * 选择前端组件 & 插⼊
    */
    const insertJSXComponent = React.useCallback((content: string) => {
        !!editorInstanceRef.current && editorInstanceRef.current.insertText(content);
        setAddJSXComponentModalVisible(false);
    }, []);
    /**
    * 设置 Editor 的值
    */
    const setEditorValue = React.useCallback((content: string) => {
        const editor = editorInstanceRef.current as any;
        const cursor = editor.mdEditor.cm.getCursor();
        const scrollInfo = editor.mdEditor.cm.getScrollInfo();
        editor.setValue(content);
        editor.scrollTop(scrollInfo.top || 1);
        editor.mdEditor.cm.focus();
        editor.mdEditor.cm.setCursor(cursor);
    }, []);
    React.useEffect(() => {
        if (!editorElementRef.current) {
            //  Toast.error('初始化编辑器错误');
            return;
        }
        const editor = new TuiEditor({
            el: editorElementRef.current,
            height: props.height || '500px',
            language: 'zh_CN',
            initialEditType: 'markdown',
            previewStyle: 'vertical',
            hideModeSwitch: true,
            // useCommandShortcut: false,
            useDefaultHTMLSanitizer: false,
            usageStatistics: false,
            initialValue: props.initialValue || '',
        }) as any;
        // 初始化 Viewer
        Viewer.bundleViewer(editor);
        // 初始化各种 Ref
        const wrapper = editor.getCodeMirror().display.wrapper;
        (viewerElementRef as any).current = editor.preview.$el.get(0);
        (wrapperScrollBarElementRef as any).current = wrapper.querySelector('.CodeMirror-vscrollbar');
        (editorInstanceRef as any).current = editor;
        // 初始化 preview width
        !!viewerElementRef.current && (viewerElementRef.current.style.width = props.previewWidth || '50vw');
        // 默认 Darcula 主题
        wrapper.classList.replace('cm-s-default', props.editorThemeClsName || `cm-s-darcula`);
        // Toolbar
        editor.getUI().getToolbar().removeItem(15, true);
        // editor.getUI().getToolbar().insertItem(15, new TuiEditor.Button({
        // $el: $('<button class="tui-image tui-toolbar-icons"></button>'),
        // tooltip: '插⼊图⽚',
        // event: 'onClickUploadImageButton',
        // className: ''
        // }));
        // editor.getUI().getToolbar().insertItem(15, new TuiEditor.Button({
        //     $el: $('<button class="edoc-toolbar-button button-video tui-toolbar-icons"></button>'),
        //     tooltip: '插⼊视频',
        //     event: 'onClickUploadVideoButton',
        //     className: ''
        // }));
        editor.getUI().getToolbar().addDivider();
        editor.getUI().getToolbar().addButton(new TuiEditor.Button({
            $el: $('<button class="edoc-toolbar-button button-jsx-component tui-toolbar-icons"></button>'),
            tooltip: '插⼊前端组件（Ctrl + M）',
            event: 'onClickInsertJSXComponent',
            className: ''
        }));
        const openingEditorThemeSelectButton = $('<button id="edocEditTheme" class="edoc-toolbar-button buttontheme tui-toolbar-icons"></button>');
        editor.getUI().getToolbar().addButton(new TuiEditor.Button({
            $el: openingEditorThemeSelectButton,
            tooltip: '编辑器样式',
            event: 'openingEditorThemeSelect',
            className: ''
        }));
        editor.getUI().getToolbar().addButton(new TuiEditor.Button({
            $el: $('<button class="edoc-toolbar-button button-prettier tui-toolbar-icons"></button>'),
            tooltip: '格式化',
            event: 'prettier',
            className: ''
        }));
        // Listener
        // editor.eventManager.addEventType('onClickUploadImageButton');
        // editor.eventManager.listen('onClickUploadImageButton', function () {
        // setUploadMediaModalVisible('image');
        // });
        editor.eventManager.addEventType('onClickUploadVideoButton');
        editor.eventManager.listen('onClickUploadVideoButton', function () {
            setUploadMediaModalVisible('video');
        });
        editor.eventManager.addEventType('onClickInsertJSXComponent');
        editor.eventManager.listen('onClickInsertJSXComponent', function () {
            setAddJSXComponentModalVisible(true);
        });
        // editor.eventManager.addEventType('openingEditorThemeSelect');
        // editor.eventManager.listen('openingEditorThemeSelect', function () {
        //     EditorThemeSelect.open(openingEditorThemeSelectButton, props.onChangeEditorTheme);
        // });
        editor.eventManager.addEventType('prettier');
        editor.eventManager.listen('prettier', function () {
            try {
                const content = editor.getValue();
                const prettierRes = prettier.format(content, {
                    parser: 'mdx',
                    plugins: [prettierMarkdown, prettierHTML, prettierJS]
                });
                setEditorValue(prettierRes);
                //  Toast.success('格式化成功');
            } catch (err) {
                //  Toast.error(err.message || JSON.stringify(err));
                //  Toast.error('格式化失败');
            }
        });
        // 清除默认的图⽚添加 hook
        editor.eventManager.events.set('addImageBlobHook', []);
        // 清除默认的 paste 事件
        editor.eventManager.events.set('paste', []);
        /**
        * 处理⽂件上传，⽀持粘贴本地图⽚上传
        */
        editor.eventManager.listen('paste', function (event: { data: ClipboardEvent, resource: 'markdown' }) {
            const cbData = event.data.clipboardData;
            if (!cbData) {
                return;
            }
            const blobItems = cbData.items;
            const fileList: File[] = [];
            if (!!blobItems.length) {
                for (let i = 0; i < blobItems.length; i++) {
                    const blobItem = blobItems[i];
                    if (blobItem.type.indexOf('image') !== -1 && blobItem.kind === 'file') {
                        const fileData = blobItem.getAsFile();
                        !!fileData && fileList.push(fileData);
                    }
                }
            }
            if (!fileList.length) {
                return;
            }
            if (typeof props.addImageBlobHook !== 'function') {
                dataUrlReader(fileList[0], result => {
                    if (typeof result !== 'string') {
                        //  Toast.error('解析图⽚失败');
                    } else {
                        editor.eventManager.emit('command', 'AddImage', {
                            imageUrl: result,
                            altText: 'image'
                        });
                    }
                });
            } else {
                props.addImageBlobHook(fileList[0], function (placeHolder, alterName) {
                    editor.eventManager.emit('command', 'AddImage', {
                        imageUrl: placeHolder,
                        altText: typeof alterName === 'string' ? alterName : 'image'
                    });
                });
            }
        });
        // Commands
        editor.commandManager.addCommand(TuiEditor.CommandManager.command('markdown', {
            name: 'AddJSXComponent',
            keyMap: ['CTRL+M', 'META+M'],
            exec: () => setAddJSXComponentModalVisible(true)
        }));
        // 滚动同步
        function onWrapperScrollBarScrolling(event: Event) {
            if (!isSyncingEditorScroll.current) {
                isSyncingPreviewScroll.current = true;
                calculateSyncScroll();
            }
            isSyncingEditorScroll.current = false;
        }
        function onViewerScrollBarScrolling(event: Event) {
            if (!isSyncingPreviewScroll.current) {
                isSyncingEditorScroll.current = true;
                calculateSyncScroll(true);
            }
            isSyncingPreviewScroll.current = false;
        }
        !!wrapperScrollBarElementRef.current && wrapperScrollBarElementRef.current.addEventListener('scroll',
            onWrapperScrollBarScrolling);
        !!viewerElementRef.current && viewerElementRef.current.addEventListener('scroll',
            onViewerScrollBarScrolling);
        typeof props.onReady === 'function' && props.onReady(editor);
        return () => {
            !!wrapperScrollBarElementRef.current && wrapperScrollBarElementRef.current.removeEventListener('scroll',
                onWrapperScrollBarScrolling);
            !!viewerElementRef.current && viewerElementRef.current.removeEventListener('scroll',
                onViewerScrollBarScrolling);
            // EditorThemeSelect.off();
        };
    }, []);
    const handleUploadVideo = React.useCallback(async (file: File, name: string) => {
        if (typeof props.onUploadVideo !== 'function') {
            return Promise.reject('Editor Can Not Upload Video Without Handler');
        } else {
            const url = await props.onUploadVideo(file, name);
            (editorInstanceRef.current as TuiEditor).insertText(`<BytedReactXgplayer config={{ url: $
{JSON.stringify(url)}}} />`);
            return Promise.resolve();
        }
    }, [props.onUploadVideo]);
    const onUploadVideoSuccess = React.useCallback(async (res: any, a: any, b: any) => {
        try {
            if (typeof props.onUploadVideoSuccess === 'function') {
                const url = await props.onUploadVideoSuccess(res, a, b);
                (editorInstanceRef.current as TuiEditor).insertText(`<BytedReactXgplayer config={{ url: $
{JSON.stringify(url)}}} />`);
                return Promise.resolve();
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }, [props.onUploadVideoSuccess]);
    return (
        <React.Fragment>
            <div ref={editorElementRef} />
            <AddJSXComponentModal
                visible={addJSXComponentModalVisible}
                onCancel={() => setAddJSXComponentModalVisible(false)}
                onOk={insertJSXComponent}
            />
            {/* <UploadMediaModal
 visible={uploadMediaModalVisible}
 onCancel={() => setUploadMediaModalVisible('')}
 onUploadVideo={handleUploadVideo}
 action={props.uploadVideoAction}
 onError={props.onUploadVideoError}
 onSuccess={onUploadVideoSuccess}
 /> */}
            {/* <MoreOperationModal
 visible={moreOptionModalVisible}
 onCancel={setMoreOptionModalVisible.bind(this, false)}
 /> */}
        </React.Fragment>
    );
}
export default EdocEditor;