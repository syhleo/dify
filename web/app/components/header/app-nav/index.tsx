import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { flatten } from 'lodash-es'
import Nav from '../nav'
import { fetchAppList } from '@/service/apps'
import NewAppDialog from '@/app/(commonLayout)/apps/NewAppDialog'
import { Container } from '@/app/components/base/icons/src/vender/line/development'
import { Container as ContainerSolid } from '@/app/components/base/icons/src/vender/solid/development'
import type { AppListResponse } from '@/models/app'

const getKey = (pageIndex: number, previousPageData: AppListResponse) => {
  if (!pageIndex || previousPageData.has_more)
    return { url: 'apps', params: { page: pageIndex + 1, limit: 30 } }
  return null
}

const AppNav = () => {
  const { t } = useTranslation()
  const [showNewAppDialog, setShowNewAppDialog] = useState(false)
  const { appId } = useParams()
  const { data: appsData, isLoading, setSize } = useSWRInfinite(appId ? getKey : () => null, fetchAppList, { revalidateFirstPage: false })
  const appItems = flatten(appsData?.map(appData => appData.data))

  const handleLoadmore = useCallback(() => {
    if (isLoading)
      return

    setSize(size => size + 1)
  }, [setSize, isLoading])

  return (
    <>
      <Nav
        icon={<Container className='w-4 h-4' />}
        activeIcon={<ContainerSolid className='w-4 h-4' />}
        text={t('common.menus.apps')}
        activeSegment={['apps', 'app']}
        link='/apps'
        curNav={appItems.find(appItem => appItem.id === appId)}
        navs={appItems.map(item => ({
          id: item.id,
          name: item.name,
          link: `/app/${item.id}/overview`,
          icon: item.icon,
          icon_background: item.icon_background,
        }))}
        createText={t('common.menus.newApp')}
        onCreate={() => setShowNewAppDialog(true)}
        onLoadmore={handleLoadmore}
      />
      <NewAppDialog show={showNewAppDialog} onClose={() => setShowNewAppDialog(false)} />
    </>
  )
}

export default AppNav