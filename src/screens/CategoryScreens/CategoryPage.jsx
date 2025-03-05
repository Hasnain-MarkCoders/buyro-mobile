



import React, { useCallback, useEffect, useState } from 'react'
import { get } from './../../config/requests'
import { useNavigation } from '@react-navigation/native'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { FlashList, MasonryFlashList } from "@shopify/flash-list";
import { useQuery } from '@tanstack/react-query';
import { Spinner } from './../../../components/ui/spinner/index';
import { useRoute } from '@react-navigation/native'
import { SCREEN_NAAMES } from './../../config/screenNames';
import FastImage from 'react-native-fast-image';
import { COMMON_STYLES } from './../../helper/globals';

const { width: screenWidth } = Dimensions.get("window"); // Get screen width

const CategoryPage = () => {
  const route = useRoute()
  const _id = route.params._id
  const navigation = useNavigation()
  const [mainImageHeight, setMainImageHeight] = useState(200)
  const handleNavigation = (_id) => () => {
    navigation.navigate(SCREEN_NAAMES.PRODUCT_PAGE, { _id })
  }
  const ProductItem = useCallback(({ item, index }) => {
    const [isLoading, setIsLoading] = useState(true)

    return <TouchableOpacity onPress={handleNavigation(item._id)} style={{ ...styles.itemContainer, marginRight: index % 2 ? COMMON_STYLES.LIST_ITEM_ZERO_MARGIN : COMMON_STYLES.LIST_ITEM_MARGIN,}}>
      <FastImage 
      onLoad={()=>{setIsLoading(false)}}
      source={{
        uri: item?.image, priority: FastImage.priority.high,
      }}
        resizeMode={FastImage.resizeMode.cover}
        style={[styles.image, {...(isLoading?{}:COMMON_STYLES.BOX_SHADOW)}]} />
       {isLoading&&<View style={[styles.overlay]}>
        {/* <Text style={{ color: "red" }}>{item?.name?.toUpperCase() + "hello"}</Text> */}
      </View>}
    </TouchableOpacity>
  }
    , []);
  const fetchProductsByCategory = async () => {
    const response = await get('/category/' + _id + "?limit=100")
    return response.data

  }
  const { data, error, isLoading } = useQuery({
    queryKey: ['ProductsBycategories', _id],
    queryFn: fetchProductsByCategory,
    enabled: !!_id,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 4,
  });



  const ListHeader = useCallback(() => {

    const handleImageLoad = (event) => {
      const { width, height } = event.nativeEvent;
      const aspectRatio = width / height;
      const calculatedHeight = screenWidth * aspectRatio; // Maintain aspect ratio
      setMainImageHeight(calculatedHeight);
    }
    return <>
      <Text style={styles.heading}>{data?.name?.toUpperCase()} PRODUCTS</Text>


      <View style={[styles.mainImageWrapper, { height: mainImageHeight }]}>
        <FastImage
          onLoadEnd={(event) => { handleImageLoad(event) }}
          resizeMode={FastImage.resizeMode.cover}

          source={{ uri: data?.image, priority: FastImage.priority.high }}
          style={[styles.mainImage, { height: mainImageHeight }]}
        />
      </View>
    </>
  }, [mainImageHeight, data?.image])
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

    //  <FlashList
    //     data={[1, 2]}
    //     renderItem={({ item }) =>{
    //       return item === 1 ? <ListHeader /> : <MasonryFlashList
    //       // contentContainerStyle={styles.container}
    //       removeClippedSubviews={true}
    //       // ListHeaderComponent={ListHeader} // ✅ Add category header
    //       data={data?.products}
    //       renderItem={({ item }) => <ProductItem item={item} />}
    //       keyExtractor={(item) => item?._id?.toString()}
    //       numColumns={2}
    //       estimatedItemSize={150}
    //     />
    //     }}

    //  />
    <>

      <MasonryFlashList
        contentContainerStyle={styles.container}
        extraData={mainImageHeight}
        removeClippedSubviews={true}
        ListHeaderComponent={ListHeader} // ✅ Add category header
        data={data?.products}
        renderItem={({ item, index }) => <ProductItem item={item} index={index} />}
        keyExtractor={(item) => item?._id?.toString()}
        numColumns={2}
        estimatedItemSize={150}
      />



    </>

  )
}
const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#FFF"
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemContainer: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: COMMON_STYLES.LIST_ITEM_MARGIN,

  },
  mainImageWrapper: { position: "relative", width: "100%", overflow: "hidden", backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 10, marginBottom: 10 },
  mainImage: { width: "100%", height: "100%", borderRadius: 10 },
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
    height: 350,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default CategoryPage
