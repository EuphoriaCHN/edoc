import I18n from 'i18next';

export const STATUS_CODE = {
  SUCCESS: 1000,
  COMMON_ERROR: 1001,
  NOT_LOGIN: 1002,
  PERMISSION_DENIED: 1003,
};

export const HTTP_STATUS_CODE = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  ERROR: 500,
};

// 错误状态码
export enum ERR_CODE {
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  DATA_ERROR = 'DATA_ERROR',
  INCOMPLETE_DELETE = 'INCOMPLETE_DELETE',
  TRANSACTIONAL_ERROR = 'TRANSACTIONAL_ERROR',
  NO_THIS_DATA = 'NO_THIS_DATA',
  DATA_EXIST = 'DATA_EXIST',
  VERIFICATION_EXPIRED = 'VERIFICATION_EXPIRED',
  VERIFICATION_NOT_MATCHED = 'VERIFICATION_NOT_MATCHED',
  PASSWORD_NOT_MATCHED = 'PASSWORD_NOT_MATCHED',
  LOGIN_EXPIRED = 'LOGIN_EXPIRED',
  IDENTITY_MATCH_FAIL = 'IDENTITY_MATCH_FAIL',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

/**
 * 目标 Topic
 */
export const TargetTopic: any = {
  CENTER_PROD_HZ: {
    label: I18n.t('中心正式机房 - HZ'),
    children: {
      QUEUE_EnhanceTimer: {
        label: I18n.t('持久化 Topic')
      },
      QUEUE_EnhanceTimer_delay: {
        label: I18n.t('延时持久化 Topic')
      },
      QUEUE_EnhanceTimer_without_delay: {
        label: I18n.t('非延时持久化 Topic')
      }
    }
  },
  CENTER_TEST_HZ: {
    label: I18n.t('中心预发机房 - HZ'),
    children: {
      QUEUE_EnhanceTimer_pre: {
        label: I18n.t('持久化 Topic'),
        disabled: true
      }
    }
  }
};

export const TargetTopicLabel: any = Object.assign({}, ...Object.values(TargetTopic).map((item: any) => item.children));

/**
 * 文本来源
 */
export const TextResource: any = {
  db: {
    label: I18n.t('数据库'),
    disabled: true
  },
  oss: {
    label: I18n.t('对象存储')
  }
};

/**
 * 操作类型
 */
export const OperationType: any = {
  deploy: {
    label: I18n.t('发布文案'),
  },
  update: {
    label: I18n.t('更新文案')
  }
};

/**
 * 回调时间
 */
export const CallbackTime: any = {
  singledCallback: {
    label: I18n.t('单次回调'),
    children: {
      zero_o_clock: {
        label: I18n.t('凌晨 0 点')
      },
      twelve_o_clock: {
        label: I18n.t('中午 12 点'),
        disabled: true
      }
    }
  },
  cyclicalCallback: {
    label: I18n.t('周期回调'),
    children: {
      each_half_day: {
        label: I18n.t('每半天'),
        disabled: true
      },
      each_three_days: {
        label: I18n.t('每三天'),
        disabled: true
      },
      each_week: {
        label: I18n.t('每周'),
        disabled: true
      }
    }
  }
};

export const CallbackTimeLabel: any = Object.assign({}, ...Object.values(CallbackTime).map((item: any) => item.children));

export const LANGS = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en-US': 'English',
  'ja-JP': '日本語',
  'ko-KR': '한국어'
};
