



import React, { useCallback, useEffect } from 'react'
import { get } from './../../config/requests'
import { useNavigation } from '@react-navigation/native'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MasonryFlashList, FlashList } from "@shopify/flash-list";
import { useQuery } from '@tanstack/react-query';
import { Spinner } from './../../../components/ui/spinner/index';
import { useRoute } from '@react-navigation/native'
import { SCREEN_NAAMES } from './../../config/screenNames';


const CategoryPage = () => {
  const route = useRoute()
  const _id = route.params._id
  const navigation = useNavigation()
  const handleNavigation = (_id) => () => {
    navigation.navigate(SCREEN_NAAMES.PRODUCT_PAGE, { _id })
  }
  const CategoryItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={handleNavigation(item._id)} style={styles.itemContainer}>
      <Image source={{ uri: item?.image }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.text}>{item?.name?.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  ), []);
  const fetchProductsByCategory = async () => {
    const response = await get('/category/' + _id + "?limit=100")
    return response.data

  }
  const { data, error, isLoading } = useQuery({
    queryKey: ['ProductsBycategories', _id],
    queryFn: fetchProductsByCategory,
  });
  useEffect(() => {
    // console.log(JSON.stringify(data?.products?.find(item=>item.name.toLowerCase()=="gulzaar (charcoal)"), null,5))
  }, [data])


  const ListHeader = () => {
    return <>
      <Text style={styles.heading}>{data?.name?.toUpperCase()} PRODUCTS</Text>
      <Image   
      // resizeMode="cover"
        //  resizeMethod="resize"
        //   resizeMode="contain"
 source={{ uri: data?.image }}
  style={{ 
    width: '100%', 
    height: undefined,
    aspectRatio:1.0, 
    objectFit: "cover", // Ensure image covers fully
    objectPosition: "top" ,
    borderRadius: 10,
    
     marginBottom: 10 }} />
    </>
  }
  if (isLoading) return <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',

  }}>
    <Spinner size={"large"} />
  </View>;
  if (error) return <Text>Error loading Products </Text>;
  return (
              <MasonryFlashList
              contentContainerStyle={styles.container}
              removeClippedSubviews={true}
              ListHeaderComponent={ListHeader} // ✅ Add category header

                data={data?.products}
                renderItem={({ item }) => <CategoryItem item={item} />}
                keyExtractor={(item) => item?._id?.toString()}
                numColumns={2}
                estimatedItemSize={150}
              />
  )
}
const styles = StyleSheet.create({
  container: {
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
    height: 350,
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
export default CategoryPage
