import { ProviderEnum } from '../declarations'
import type { ProviderConfig } from '../declarations'
import { IflytekSpark, IflytekSparkText, IflytekSparkTextCn } from '@/app/components/base/icons/src/public/llm'

const config: ProviderConfig = {
  item: {
    key: ProviderEnum.spark,
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
    key: ProviderEnum.spark,
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
    validateKeys: [
      'app_id',
      'api_key',
      'api_secret',
    ],
    fields: [
      {
        type: 'text',
        key: 'app_id',
        required: true,
        label: {
          'en': 'API ID',
          'zh-Hans': 'API ID',
        },
        placeholder: {
          'en': 'Enter your API ID here',
          'zh-Hans': '在此输入您的 API ID',
        },
      },
      {
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
      },
      {
        type: 'text',
        key: 'api_secret',
        required: true,
        label: {
          'en': 'API Secret',
          'zh-Hans': 'API Secret',
        },
        placeholder: {
          'en': 'Enter your API Secret here',
          'zh-Hans': '在此输入您的 API Secret',
        },
      },
    ],
  },
}

export default config