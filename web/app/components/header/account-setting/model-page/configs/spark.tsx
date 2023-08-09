import { ModelEnum } from '../declarations'
import type { ModelConfig } from '../declarations'
import { validateModelProviderFn } from '../utils'
import { IflytekSpark, IflytekSparkText, IflytekSparkTextCn } from '@/app/components/base/icons/src/public/llm'

const config: ModelConfig = {
  key: ModelEnum.spark,
  item: {
    key: ModelEnum.spark,
    titleIcon: {
      'en': <IflytekSparkText className='h-6' />,
      'zh-Hans': <IflytekSparkTextCn className='h-6' />,
    },
    vender: {
      'en': 'Earn 3 million tokens for free',
      'zh-Hans': '免费获取 300 万个 token',
    },
  },
  modal: {
    key: ModelEnum.spark,
    title: {
      'en': 'iFLYTEK SPARK',
      'zh-Hans': '讯飞星火',
    },
    icon: <IflytekSpark className='w-6 h-6' />,
    link: {
      href: 'https://docs.dify.ai',
      label: {
        'en': 'Get your API key from AliCloud',
        'zh-Hans': '从阿里云获取 API Key',
      },
    },
    fields: [
      {
        visible: () => true,
        type: 'text',
        key: 'app_id',
        required: true,
        label: {
          'en': 'API Key',
          'zh-Hans': 'API Key',
        },
        placeholder: {
          'en': 'Enter your API key here',
          'zh-Hans': '在此输入您的 API Key',
        },
        validate: {
          before: (v) => {
            if (v?.app_id)
              return true
          },
          run: (v) => {
            return validateModelProviderFn(ModelEnum.spark, {
              config: v,
            })
          },
        },
      },
      {
        visible: () => true,
        type: 'text',
        key: 'api_key',
        required: true,
        label: {
          'en': 'API Key',
          'zh-Hans': 'API Key',
        },
        placeholder: {
          'en': 'Enter your API key here',
          'zh-Hans': '在此输入您的 API Key',
        },
        validate: {
          before: (v) => {
            if (v?.api_key)
              return true
          },
          run: (v) => {
            return validateModelProviderFn(ModelEnum.spark, {
              config: v,
            })
          },
        },
      },
      {
        visible: () => true,
        type: 'text',
        key: 'api_secret',
        required: true,
        label: {
          'en': 'API Key',
          'zh-Hans': 'API Key',
        },
        placeholder: {
          'en': 'Enter your API key here',
          'zh-Hans': '在此输入您的 API Key',
        },
        validate: {
          before: (v) => {
            if (v?.api_secret)
              return true
          },
          run: (v) => {
            return validateModelProviderFn(ModelEnum.spark, {
              config: v,
            })
          },
        },
      },
    ],
  },
}

export default config