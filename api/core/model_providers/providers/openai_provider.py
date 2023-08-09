import json
import logging
from json import JSONDecodeError
from typing import Type

from openai.error import AuthenticationError, OpenAIError

import openai

from core.helper import encrypter
from core.model_providers.models.speech2text.openai_whisper import OpenAIWhisper
from core.model_providers.models.base import BaseProviderModel
from core.model_providers.models.embedding.openai_embedding import OpenAIEmbedding
from core.model_providers.models.entity.model_params import ModelKwargsRules, KwargRule, ModelType
from core.model_providers.models.llm.openai_model import OpenAIModel
from core.model_providers.models.moderation.openai_moderation import OpenAIModeration
from core.model_providers.providers.base import BaseModelProvider, CredentialsValidateFailedError
from core.model_providers.providers.hosted import hosted_model_providers
from models.provider import ProviderType


class OpenAIProvider(BaseModelProvider):

    @property
    def provider_name(self):
        """
        Returns the name of a provider.
        """
        return 'openai'

    def _get_fixed_model_list(self, model_type: ModelType) -> list[dict]:
        if model_type == ModelType.TEXT_GENERATION:
            return [
                {
                    'id': 'gpt-3.5-turbo',
                    'name': 'gpt-3.5-turbo',
                },
                {
                    'id': 'gpt-3.5-turbo-16k',
                    'name': 'gpt-3.5-turbo-16k',
                },
                {
                    'id': 'gpt-4',
                    'name': 'gpt-4',
                },
                {
                    'id': 'gpt-4-32k',
                    'name': 'gpt-4-32k',
                },
                {
                    'id': 'text-davinci-003',
                    'name': 'text-davinci-003',
                }
            ]
        elif model_type == ModelType.EMBEDDINGS:
            return [
                {
                    'id': 'text-embedding-ada-002',
                    'name': 'text-embedding-ada-002'
                }
            ]
        elif model_type == ModelType.SPEECH_TO_TEXT:
            return [
                {
                    'id': 'whisper-1',
                    'name': 'whisper-1'
                }
            ]
        elif model_type == ModelType.MODERATION:
            return [
                {
                    'id': 'text-moderation-stable',
                    'name': 'text-moderation-stable'
                }
            ]
        else:
            return []

    def get_model_class(self, model_type: ModelType) -> Type[BaseProviderModel]:
        """
        Returns the model class.

        :param model_type:
        :return:
        """
        if model_type == ModelType.TEXT_GENERATION:
            model_class = OpenAIModel
        elif model_type == ModelType.EMBEDDINGS:
            model_class = OpenAIEmbedding
        elif model_type == ModelType.MODERATION:
            model_class = OpenAIModeration
        elif model_type == ModelType.SPEECH_TO_TEXT:
            model_class = OpenAIWhisper
        else:
            raise NotImplementedError

        return model_class

    def get_model_parameter_rules(self, model_name: str, model_type: ModelType) -> ModelKwargsRules:
        """
        get model parameter rules.

        :param model_name:
        :param model_type:
        :return:
        """
        model_max_tokens = {
            'gpt-4': 8192,
            'gpt-4-32k': 32768,
            'gpt-3.5-turbo': 4096,
            'gpt-3.5-turbo-16k': 16384,
            'text-davinci-003': 4097,
        }

        return ModelKwargsRules(
            temperature=KwargRule(min=0, max=2, default=1),
            top_p=KwargRule(min=0, max=1, default=1),
            presence_penalty=KwargRule(min=-2, max=2, default=0),
            frequency_penalty=KwargRule(min=-2, max=2, default=0),
            max_tokens=KwargRule(min=10, max=model_max_tokens.get(model_name, 4097), default=16),
        )

    @classmethod
    def is_provider_credentials_valid_or_raise(cls, credentials: dict):
        """
        Validates the given credentials.
        """
        if 'openai_api_key' not in credentials:
            raise CredentialsValidateFailedError('OpenAI API key is required')

        try:
            credentials_kwargs = {
                "api_key": credentials['openai_api_key']
            }

            if 'openai_api_base' in credentials:
                credentials_kwargs['api_base'] = credentials['openai_api_base']

            if 'openai_organization' in credentials:
                credentials_kwargs['organization'] = credentials['openai_organization']

            openai.ChatCompletion.create(
                messages=[{"role": "user", "content": 'ping'}],
                model='gpt-3.5-turbo',
                timeout=10,
                request_timeout=(5, 30),
                max_tokens=20,
                **credentials_kwargs
            )
        except (AuthenticationError, OpenAIError) as ex:
            raise CredentialsValidateFailedError(str(ex))
        except Exception as ex:
            logging.exception('OpenAI config validation failed')
            raise ex

    @classmethod
    def encrypt_provider_credentials(cls, tenant_id: str, credentials: dict) -> dict:
        credentials['openai_api_key'] = encrypter.encrypt_token(tenant_id, credentials['openai_api_key'])
        return credentials

    def get_provider_credentials(self, obfuscated: bool = False) -> dict:
        if self.provider.provider_type == ProviderType.CUSTOM.value:
            try:
                credentials = json.loads(self.provider.encrypted_config)
            except JSONDecodeError:
                credentials = {
                    'openai_api_base': None,
                    'openai_api_key': self.provider.encrypted_config,
                    'openai_organization': None
                }

            if credentials['openai_api_key']:
                credentials['openai_api_key'] = encrypter.decrypt_token(
                    self.provider.tenant_id,
                    credentials['openai_api_key']
                )

                if obfuscated:
                    credentials['openai_api_key'] = encrypter.obfuscated_token(credentials['openai_api_key'])

            if 'openai_api_base' not in credentials:
                credentials['openai_api_base'] = None

            if 'openai_organization' not in credentials:
                credentials['openai_organization'] = None

            return credentials
        else:
            return {
                'openai_api_base': hosted_model_providers.openai.api_base,
                'openai_api_key': hosted_model_providers.openai.api_key,
                'openai_organization': hosted_model_providers.openai.api_organization
            }

    def should_deduct_quota(self):
        if hosted_model_providers.openai.quota_limit and hosted_model_providers.openai.quota_limit > 0:
            return True

        return False

    @classmethod
    def is_model_credentials_valid_or_raise(cls, model_name: str, model_type: ModelType, credentials: dict):
        """
        check model credentials valid.

        :param model_name:
        :param model_type:
        :param credentials:
        """
        return

    @classmethod
    def encrypt_model_credentials(cls, tenant_id: str, model_name: str, model_type: ModelType, credentials: dict) -> dict:
        """
        encrypt model credentials for save.

        :param tenant_id:
        :param model_name:
        :param model_type:
        :param credentials:
        :return:
        """
        return {}

    def get_model_credentials(self, model_name: str, model_type: ModelType, obfuscated: bool = False) -> dict:
        """
        get credentials for llm use.

        :param model_name:
        :param model_type:
        :param obfuscated:
        :return:
        """
        return self.get_provider_credentials(obfuscated)