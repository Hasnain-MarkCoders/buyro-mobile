import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NotFound = ({
    title="Not Found"}) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  )
}

export default NotFound

const styles = StyleSheet.create({})