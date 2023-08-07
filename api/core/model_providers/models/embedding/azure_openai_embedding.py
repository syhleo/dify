import decimal

from langchain.embeddings import OpenAIEmbeddings

from core.model_providers.models.embedding.base import BaseEmbedding
from core.model_providers.providers.base import BaseModelProvider

AZURE_OPENAI_API_VERSION = '2023-07-01-preview'


class AzureOpenAIEmbedding(BaseEmbedding):
    def __init__(self, model_provider: BaseModelProvider, name: str):
        credentials = model_provider.get_model_credentials(
            model_name=name,
            model_type=self.type
        )

        client = OpenAIEmbeddings(
            deployment=name,
            openai_api_type='azure',
            openai_api_version=AZURE_OPENAI_API_VERSION,
            chunk_size=16,
            max_retries=1,
            **credentials
        )

        super().__init__(model_provider, client, name)

    def get_token_price(self, tokens: int):
        tokens_per_1k = (decimal.Decimal(tokens) / 1000).quantize(decimal.Decimal('0.001'),
                                                                  rounding=decimal.ROUND_HALF_UP)

        total_price = tokens_per_1k * decimal.Decimal('0.0001')
        return total_price.quantize(decimal.Decimal('0.0000001'), rounding=decimal.ROUND_HALF_UP)

    def get_currency(self):
        raise 'USD'