import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import FoodsTableList from '@/components/food/FoodsTableList'
import React from 'react'

export default function page() {
  return (
    <div>
        <PageBreadcrumb pageTitle='Food'/>
        <div>
            <FoodsTableList />
        </div>
    </div>
  )
}
