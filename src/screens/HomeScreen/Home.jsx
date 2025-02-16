import React, { useCallback } from 'react'
import { get } from './../../config/requests'
import {  useNavigation } from '@react-navigation/native'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MasonryFlashList } from "@shopify/flash-list";
import { useQuery } from '@tanstack/react-query';
import { Spinner } from './../../../components/ui/spinner/index';
import { SCREEN_NAAMES } from './../../config/screenNames';
const Home = () => {
  const navigation = useNavigation()
  const handleNavigation =(_id)=> ()=>{
    navigation.navigate(SCREEN_NAAMES.CATEGORY_PAGE,{_id})
  }
  const CategoryItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={handleNavigation(item._id)} style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.text}>{item.name.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  ),[]);
  const fetchCategories = async() => {
  const response = await get('/categories')
  return response.data
  
  }
  const { data, error, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  if (isLoading) return <View style={{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff',
    
  }}>
<Spinner size={"large"} />
  </View>;
  if (error) return <Text>Error loading categories</Text>;
  return (
    <View style={styles.container}>
    <Text style={styles.heading}>OUR PRODUCTS</Text>
    {
      data.data.length?
      <MasonryFlashList
      data={data.data}
      renderItem={({ item }) => <CategoryItem item={item} />}
      keyExtractor={(item) => item._id.toString()}
      numColumns={2}
      estimatedItemSize={150}
    /> 
      :"No data"
    }
  </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemContainer: {
    position: 'relative',
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home