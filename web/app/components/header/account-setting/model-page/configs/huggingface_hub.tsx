import { ModelEnum } from '../declarations'
import type { FormValue, ModelConfig } from '../declarations'
import { Huggingface, HuggingfaceText } from '@/app/components/base/icons/src/public/llm'

const config: ModelConfig = {
  key: ModelEnum.huggingface_hub,
  item: {
    key: ModelEnum.huggingface_hub,
    titleIcon: {
      'en': <HuggingfaceText className='h-6' />,
      'zh-Hans': <HuggingfaceText className='h-6' />,
    },
    hit: {
      'en': '🐑 Llama 2 Supported',
      'zh-Hans': '🐑 Llama 2 支持',
    },
  },
  modal: {
    key: ModelEnum.huggingface_hub,
    title: {
      'en': 'Hugging Face Hub',
      'zh-Hans': 'Hugging Face Hub',
    },
    icon: <Huggingface className='h-6' />,
    link: {
      href: 'https://docs.dify.ai',
      label: {
        'en': 'Get your API key from Hugging Face Hub',
        'zh-Hans': '从 Hugging Face Hub 获取 API Key',
      },
    },
    defaultValue: {
      model_type: 'text-generation',
      huggingfacehub_api_type: 'hosted_inference_api',
    },
    fields: [
      {
        visible: () => true,
        type: 'radio',
        key: 'huggingfacehub_api_type',
        required: true,
        label: {
          'en': 'Endpoint Type',
          'zh-Hans': '端点类型',
        },
        options: [
          {
            key: 'hosted_inference_api',
            label: {
              'en': 'Hosted Inference API',
              'zh-Hans': '托管推理 API',
            },
          },
          {
            key: 'inference_endpoints',
            label: {
              'en': 'Inference Endpoints',
              'zh-Hans': '自部署推理端点',
            },
          },
        ],
      },
      {
        visible: () => true,
        type: 'text',
        key: 'huggingfacehub_api_token',
        required: true,
        obfuscated: true,
        label: {
          'en': 'API Token',
          'zh-Hans': 'API Token',
        },
        placeholder: {
          'en': 'Enter your Hugging Face Hub API Token here',
          'zh-Hans': '在此输入您的 Hugging Face Hub API Token',
        },
      },
      {
        visible: () => true,
        type: 'text',
        key: 'model_name',
        required: true,
        label: {
          'en': 'Model Name',
          'zh-Hans': '模型名称',
        },
        placeholder: {
          'en': 'Enter your Model Name here',
          'zh-Hans': '在此输入您的模型名称',
        },
      },
      {
        visible: (value?: FormValue) => value?.huggingfacehub_api_type === 'inference_endpoints',
        type: 'text',
        key: 'huggingfacehub_endpoint_url',
        label: {
          'en': 'Endpoint URL',
          'zh-Hans': '端点 URL',
        },
        placeholder: {
          'en': 'Enter your Endpoint URL here',
          'zh-Hans': '在此输入您的端点 URL',
        },
      },
    ],
  },
}

export default config