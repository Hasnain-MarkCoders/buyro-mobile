import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

const ProductPage = () => {
  const route = useRoute()
  const _id  = route?.params._id
  console.log(_id)
  return (
    <View>
      <Text>ProductPage </Text>
      <Text>{_id} </Text>

    </View>
  )
}

export default ProductPage