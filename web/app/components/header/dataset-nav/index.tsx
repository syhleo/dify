import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useRouter } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { flatten } from 'lodash-es'
import Nav from '../nav'
import { fetchDatasets } from '@/service/datasets'
import { Database01 } from '@/app/components/base/icons/src/vender/line/development'
import { Database02 } from '@/app/components/base/icons/src/vender/solid/development'
import type { DataSetListResponse } from '@/models/datasets'

const getKey = (pageIndex: number, previousPageData: DataSetListResponse) => {
  if (!pageIndex || previousPageData.has_more)
    return { url: 'datasets', params: { page: pageIndex + 1, limit: 30 } }
  return null
}

const DatasetNav = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { datasetId } = useParams()
  const { data: datasetsData, isLoading, setSize } = useSWRInfinite(datasetId ? getKey : () => null, fetchDatasets, { revalidateFirstPage: false })
  const datasetItems = flatten(datasetsData?.map(datasetData => datasetData.data))

  const handleLoadmore = useCallback(() => {
    if (isLoading)
      return

    setSize(size => size + 1)
  }, [setSize, isLoading])

  return (
    <Nav
      icon={<Database01 className='w-4 h-4' />}
      activeIcon={<Database02 className='w-4 h-4' />}
      text={t('common.menus.datasets')}
      activeSegment='datasets'
      link='/datasets'
      curNav={datasetItems.find(datasetItem => datasetItem.id === datasetId)}
      navs={datasetItems.map(dataset => ({
        id: dataset.id,
        name: dataset.name,
        link: `/datasets/${dataset.id}/documents`,
        icon: dataset.icon,
        icon_background: dataset.icon_background,
      }))}
      createText={t('common.menus.newDataset')}
      onCreate={() => router.push('/datasets/create')}
      onLoadmore={handleLoadmore}
    />
  )
}

export default DatasetNav