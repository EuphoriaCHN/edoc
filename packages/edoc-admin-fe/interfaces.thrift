struct BaseResp {
    1: boolean success;
    2: object data;
    3: optioanl i64 total;
    4: optioanl string errorCode;
    5: optioanl string errorMsg;
    6: optioanl boolean needRetry;
}

struct CreateProjectRequest {
    1: string projectName;
    2: optional string projectDesc;
}

struct SearchProjectRequest {
    1: i64 page;
    2: i64 size;
    3: string projectName; # empty === null
}

struct SearchProjectResponseData {
    1: i64 id;
    2: string projectName;
    3: optional string projectDesc; # empty === null
}

struct DeleteProjectById {
    1: i64 id;
}

# //////////////////////////////////////////////////////

struct CreatePageRequest {
    1: string pageName;
    2: optional string pageDesc;
    3: i64 ownerProjectId;
}

struct SearchPageRequest {
    1: i64 page;
    2: i64 size;
    3: string pageName; # empty === null
    4: i64 ownerProjectId;
}

struct GetProjectDetailRequest {
    1: i64 projectId;
}

struct GetProjectDetailResponseData {
    1: string AK;
}

struct SearchPageResponseData {
    1: i64 id;
    2: string pageName;
    3: optional string pageDesc; # empty === null
    4: optional i64 ownerProjectId;
}

struct DeletePageById {
    1: i64 id;
}

# //////////////////////////////////////////////////////

struct CreateDocRequest {
    1: i64 ownerProjectId;
    2: i64 ownerPageId;
    3: i64 fatherId; # 顶层 ID = PageID
    4: string documentTitle;
    5: boolean isDir;
}

struct SearchDocRequest {
    1: i64 fatherId;
}

struct DocListItem {
    1: string documentTitle;
    2: boolean isDir;
}

struct SearchDocResponseData {
    1: list<DocListItem> data;
}

struct DeleteDocumentById {
    1: i64 id;
}

# //////////////////////////////////////////////////////

struct GetDocumentLatestContentRequest {
    1: i64 documentId;
}

struct GetDocumentLatestContentResponseData {
    1: string content;
}

struct SaveDocumentRequest {
    1: i64 documentId;
    2: string content;
}

struct DeployedDocumentRequest {
    1: i64 documentId;
}

# //////////////////////////////////////////////////////
# //////////////////////////////////////////////////////

struct GetProjectIdByAKRequest {
    1: string AK;
}

struct GetProjectIdByAKResponseData {
    1: i64 projectid;
}
