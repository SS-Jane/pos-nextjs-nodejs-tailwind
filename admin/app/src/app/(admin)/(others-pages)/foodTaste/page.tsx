import React from 'react'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import FoodTastesTableList from '@/components/foodTaste/FoodTasteTableList'

export default function page() {
  return (
    <div>
    <PageBreadcrumb pageTitle="Categories of food" />
    <div>
        <FoodTastesTableList/>
    </div>

    
    
  </div>
  )
}
