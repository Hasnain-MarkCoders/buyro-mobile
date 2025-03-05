import { useEffect, useState } from 'react'
import React, { useCallback } from 'react'
import { get } from './../../config/requests'
import { useNavigation } from '@react-navigation/native'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { FlashList, MasonryFlashList } from "@shopify/flash-list";
import { useQueries, useQuery } from '@tanstack/react-query';
import { Spinner } from './../../../components/ui/spinner/index';

import { SCREEN_NAAMES } from './../../config/screenNames';
import FastImage from 'react-native-fast-image';
import NotFound from './../../../components/NotFound/NotFound';
import { COMMON_STYLES } from './../../helper/globals';
const Home = () => {
  const navigation = useNavigation()
  const handleNavigation = (_id,screenName) => () => {
    navigation.navigate(screenName, { _id })
  }
  const CategoryItem = useCallback(({ item,  width, index }) => {
    const [isLoading, setIsLoading] = useState(true)
    return (<TouchableOpacity onPress={handleNavigation(item._id, SCREEN_NAAMES.CATEGORY_PAGE)} style={[styles.itemContainer, {width, marginRight:index%2?COMMON_STYLES.LIST_ITEM_ZERO_MARGIN:COMMON_STYLES.LIST_ITEM_MARGIN, marginBottom:COMMON_STYLES.LIST_ITEM_MARGIN}]}>
      <FastImage
        onLoad={() => {
          setIsLoading(false)
        }}
        source={{
          uri: item.image, priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image} />
      <View style={[styles.overlay, {
        backgroundColor: isLoading ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'
      }
      ]}

      >
      </View>
    </TouchableOpacity>)
  }, []);



  const ProductItem = useCallback(({ item, index, width=200, height=COMMON_STYLES.PRODUCT_HEIGHT }) => (
    <TouchableOpacity onPress={handleNavigation(item._id, SCREEN_NAAMES.PRODUCT_PAGE)} style={{...styles.productItemContainer, marginRight:index%2?COMMON_STYLES.LIST_ITEM_ZERO_MARGIN:COMMON_STYLES.LIST_ITEM_MARGIN, width, height}}>
      <FastImage source={{
        uri: item?.image, priority: FastImage.priority.high,
      }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.productItemImage} />
      <View style={styles.overlay}>
        {/* <Text style={styles.text}>{item?.name?.toUpperCase()}</Text>
        <Text style={styles.text}>{item?.image?.toUpperCase()}</Text> */}


      </View>
    </TouchableOpacity>
  ), []);

  const fetchCategories = async () => {
    const response = await get('/categories')
    return response.data

  }

  const fetchIsNewProducts = async () => {
    const response = await get('/products', {
      params: {
        limit: 100 ,
        isNew: true,
        hasDiscount: false

      }
    })
    return response.data

  }

  const fetchIsOnSaleProducts = async () => {
    const response = await get('/products', {
      params: {
        limit: 100,
        isOnSale: true
      }
    })
    return response.data

  }
  const fetchIsPopularProducts = async () => {
    const response = await get('/products', {
      params: {
        limit: 100,
        isPopular: true
      }
    })
    return response.data

  }
  const fetchHasDiscountProducts = async () => {
    const response = await get('/products', {
      params: {
        limit: 100,
        isNew: false,
        hasDiscount: true
      }
    })
    return response.data

  }
  const { data, error, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });


  const results = useQueries({
    queries: [
      { queryKey: ['categories'], queryFn: fetchCategories },
      { queryKey: ['isNew'], queryFn: fetchIsNewProducts },
      { queryKey: ['onSale'], queryFn:fetchIsOnSaleProducts },
      { queryKey: ['popular'], queryFn: fetchIsPopularProducts },
      { queryKey: ['discounted'], queryFn: fetchHasDiscountProducts },
    ],
  });
  // const [categories,isNew, onSale, popular, discounted] = results;
  // const {data:isNewProducts}=isNew
  // const isNewData  = isNewProducts?.products
  const [categories, isNew, onSale, popular, discounted] = results || [];

  const isNewProducts = isNew?.data?.products || [];
  const onSaleProducts = onSale?.data?.products || [];
  const popularProducts = popular?.data?.products || [];
  const discountedProducts = discounted?.data?.products || [];
  

// useEffect(()=>{
//   if(isNew.data){
//     console.log(JSON.stringify(Array.isArray(isNew.data), null, 5))

//   }
// },[isNew])

  if (isLoading || isNew?.isLoading) return <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',

  }}>
    <Spinner size={"large"} />
  </View>;
  if (error) return <Text>Error loading categories</Text>;
  return (
    <ScrollView>
   
    <View style={styles.container}>
      <Text style={styles.heading}>BUYRO</Text>
      <FlashList
            estimatedItemSize={150}
            showsVerticalScrollIndicator={false}

      
      data={[1, 2,3,4,5]}
      renderItem={({index})=>{
        if(index===0){
          return  <MasonryFlashList
          ListEmptyComponent={<NotFound title="No categories found" />}
          ListHeaderComponent={<Text style={styles.sectionHeading}>CATEGORIES</Text>}
          data={data?.data}
          renderItem={({ item , index}) => <CategoryItem index={index} item={item} />}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={150}
        />
        }
        if(index===1 ){
          return    <View>
           <Text style={styles.sectionHeading}>RECENTLY ADDED PRODUCTS</Text>
            <FlashList
              ListEmptyComponent={<NotFound title="No products found" />}
              data={isNewProducts}
              
              renderItem={({ item }) => <ProductItem item={item} height={COMMON_STYLES.PRODUCT_HEIGHT} width={200}/>}
              keyExtractor={(item) => item._id.toString()}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              horizontal={true}
              estimatedItemSize={150}
              
            />
          </View>
        }

        if(index===2 ){


          return   <View>
           <Text style={styles.sectionHeading}>PRODUCTS ON SALE</Text>
           <FlashList
            ListEmptyComponent={<NotFound title="No products found" />}
            data={onSaleProducts}
            renderItem={({ item }) => <ProductItem item={item} height={COMMON_STYLES.PRODUCT_HEIGHT} width={200}/>}
            keyExtractor={(item) => item._id.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            estimatedItemSize={150}
            
          />
          </View>
        }
        if(index===3 ){
          return <View>
          <Text style={styles.sectionHeading}>RECENTLY POPULAR PRODUCTS</Text>
            <FlashList
            ListEmptyComponent={<NotFound title="No products found" />}
            data={popularProducts}
            renderItem={({ item }) => <ProductItem item={item} height={COMMON_STYLES.PRODUCT_HEIGHT} width={200}/>}

            keyExtractor={(item) => item._id.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            estimatedItemSize={150}
            
          />
          </View>
        }
        if(index===4 ){
          return  <View>
          <Text style={styles.sectionHeading}>PRODUCTS ON DISCOUNT</Text>
            <FlashList
            ListEmptyComponent={<NotFound title="No products found" />}
            data={discountedProducts}
            renderItem={({ item }) => <ProductItem item={item} height={COMMON_STYLES.PRODUCT_HEIGHT} width={200}/>}
            keyExtractor={(item) => item._id.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            estimatedItemSize={150}
            
          />
          </View>
        }
    

      }}
      />
     
    </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  sectionHeading:{
    fontSize:20,
    fontWeight:"bold",
    color:"black",
    marginBottom:COMMON_STYLES.SECTION_HEADING_MARGIN_BOTTOM,
    marginTop:COMMON_STYLES.SECTION_HEADING_MARGIN_TOP
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  itemContainer: {
    position: 'relative',
    borderRadius: COMMON_STYLES.BORDER_RADIUS,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: COMMON_STYLES.BORDER_RADIUS,
  },
  productItemContainer: {
    position: 'relative',
    borderRadius: COMMON_STYLES.BORDER_RADIUS,
    overflow: 'hidden',
    marginBottom:COMMON_STYLES.LIST_ITEM_MARGIN,
    ...COMMON_STYLES.BOX_SHADOW,
  height: COMMON_STYLES.PRODUCT_HEIGHT,

    
  },
  productItemImage:{
  width: '100%',
  height: COMMON_STYLES.PRODUCT_HEIGHT,
  borderRadius: COMMON_STYLES.BORDER_RADIUS,
},
  overlay: {
    ...StyleSheet.absoluteFillObject,
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