<template>
  <div>Dashboard</div>
</template>

<script setup>
import { useRecipesAndProductsStore } from '@/features/products-and-recepies/products-and-recipes.store'

const addProductToMeal = useRecipesAndProductsStore()

const newProduct = {
  name: 'Healthy Snack Bar',
  nutrition_details: { calories: 150, carbs: 20, proteins: 5, fats: 8 },
  type: 'Snack',
  is_vegan: true,
  is_under_review: false
}

addProductToMeal.getAllProducts()
addProductToMeal.getUserProducts()
// addProductToMeal.addProductToMeal(newProduct)
</script>
