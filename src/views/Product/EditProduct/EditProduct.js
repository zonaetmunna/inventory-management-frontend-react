import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { CForm, CFormLabel, CButton, CCol, CFormInput, CRow, CFormTextarea } from '@coreui/react'
import Select from 'react-select'
import { useEditProduct, useSingleProductData } from 'src/hooks/useProducts'
import { useGetBrandsData } from 'src/hooks/useBrand'
import { useCategoryData } from 'src/hooks/useCategory'
import { useUnitData } from 'src/hooks/useUnit'
import { useNavigate, useParams } from 'react-router-dom'

const EditProduct = () => {
  const navigate = useNavigate()
  const { productId } = useParams()

  const { isLoading: isProductDataLoading, data: productData } = useSingleProductData(productId)
  const { isLoading: isBrandLoading, data: brandOptions } = useGetBrandsData()
  const { isLoading: isCategoryLoading, data: categoryOptions } = useCategoryData()
  const { isLoading: isUnitLoading, data: unitOptions } = useUnitData()

  const onSuccess = () => {
    toast.success('Product is updated succesfully', {
      duration: 4000,
    })
    setTimeout(() => {
      navigate('/products/product-list')
    }, 1000)
  }
  const onError = () => {
    toast.error('Failed to update product', {
      duration: 4000,
    })
  }

  const { mutate } = useEditProduct(onError, onSuccess)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    values: {
      name: productData?.name,
      sku: productData?.sku,
      category: { label: productData?.category.name, value: productData?.category.id },
      brand: { label: productData?.brand.name, value: productData?.brand.id },
      unit: { label: productData?.unit.name, value: productData?.unit.id },
      description: productData?.description,
      perUnitSellingPrice: productData?.perUnitSellingPrice,
      perUnitMaxPrice: productData?.perUnitMaxPrice,
      buyingQuantity: productData?.buyingQuantity,
    },
  })

  // Save edited data to the database
  const onSubmit = (data) => {
    const newData = {
      productId,
      ...data,
      brand: data.brand.value,
      category: data.category.value,
      unit: data.unit.value,
    }
    mutate(newData)
  }

  if (isBrandLoading && isCategoryLoading && isUnitLoading && isProductDataLoading) {
    return <h2> Loading ... </h2>
  }
  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      {/* Name */}
      <CRow md={{ gutterY: 4 }}>
        <CCol md={4}>
          <CFormLabel htmlFor="name" className="fw-semibold">
            Name
          </CFormLabel>
          <CFormInput
            type="text"
            id="name"
            autoComplete="off"
            {...register('name', { required: true, maxLength: 20 })}
          />
          {errors.name && <span>ame is required</span>}
        </CCol>

        {/* SKU */}
        <CCol md={4}>
          <CFormLabel htmlFor="sku" className="fw-semibold">
            SKU
          </CFormLabel>
          <CFormInput
            type="text"
            id="sku"
            autoComplete="off"
            {...register('sku', { required: true, maxLength: 20 })}
          />
          {errors.sku && <span>SKU is required</span>}
        </CCol>

        {/* Category */}
        <CCol md={4}>
          <CFormLabel htmlFor="category" className="fw-semibold">
            Category
          </CFormLabel>
          <Controller
            control={control}
            name="category"
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                name="category"
                placeholder="Select category"
                options={categoryOptions}
              />
            )}
          />
          {errors.category && <span>category is required</span>}
        </CCol>

        {/* Brand */}
        <CCol md={4} sm={12}>
          <CFormLabel htmlFor="brand" className="fw-semibold">
            Select Brand
          </CFormLabel>
          <Controller
            name="brand"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select {...field} name="brand" placeholder="Select brand" options={brandOptions} />
            )}
          />
          {errors.brand && <span>brand is required.</span>}
        </CCol>

        {/* Unit */}
        <CCol md={4} sm={12}>
          <CFormLabel htmlFor="unit" className="fw-semibold">
            Select Unit
          </CFormLabel>
          <Controller
            name="unit"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select {...field} name="unit" placeholder="Select unit" options={unitOptions} />
            )}
          />
          {errors.unit && <span>unit is required.</span>}
        </CCol>

        {/* description */}
        <CCol md={12}>
          <CFormLabel htmlFor="description" className="fw-semibold">
            Description
          </CFormLabel>
          <CFormTextarea
            id="description"
            {...register('description', { required: false })}
            rows={4}
          ></CFormTextarea>
        </CCol>

        {/* perUnitSellingPrice */}
        <CCol md={4}>
          <CFormLabel htmlFor="perUnitSellingPrice" className="fw-semibold">
            Selling Price (Per Unit)
          </CFormLabel>
          <CFormInput
            type="number"
            id="perUnitSellingPrice"
            name="perUnitSellingPrice"
            min={0}
            {...register('perUnitSellingPrice', {
              required: true,
              valueAsNumber: true,
            })}
          />
        </CCol>

        {/* perUnitMaxPrice */}
        <CCol md={4}>
          <CFormLabel htmlFor="perUnitMaxPrice" className="fw-semibold">
            Maximum Price (Per Unit)
          </CFormLabel>
          <CFormInput
            type="number"
            id="perUnitMaxPrice"
            name="perUnitMaxPrice"
            min={0}
            {...register('perUnitMaxPrice', {
              required: true,
              valueAsNumber: true,
            })}
          />
        </CCol>

        {/* quantity */}
        <CCol md={4}>
          <CFormLabel htmlFor="buyingQuantity" className="fw-semibold">
            Select Quantity
          </CFormLabel>
          <CFormInput
            type="number"
            id="buyingQuantity"
            name="buyingQuantity"
            min={0}
            {...register('buyingQuantity', {
              required: true,
              valueAsNumber: true,
            })}
          />
        </CCol>
      </CRow>

      <CRow className="my-4">
        <CCol>
          <CButton type="submit" color="primary">
            Submit
          </CButton>
        </CCol>
      </CRow>
      <Toaster position="bottom-center" />
    </CForm>
  )
}

export default EditProduct