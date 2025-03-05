import { ActivityIndicator, ScrollView,TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AuthSheet from '../AuthScreens/Auth/Auth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useAuthStore from './../../zustand/authStore';
import { get, post } from './../../config/requests'
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import NotFound from './../../../components/NotFound/NotFound';
import { COMMON_STYLES } from './../../helper/globals';
import { SCREEN_NAAMES } from './../../config/screenNames';
import FastImage from 'react-native-fast-image';
import { useMutation, useQueryClient } from "@tanstack/react-query";


 const fetchOrders = async () => {
  try {
    const response = await get('/orders', {
      params: {
        limit: 100

      }
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
    // const response = await get('/orders', {
    //   params: {
    //     limit: 100 

    //   }
    // })

    // console.log(response.data)
    // return response.data

  }

  import { Trash2 } from "lucide-react-native";

  const OrderItem = ({
    orderId,
    productId,
    productName,
    productImage,
    quantity,
    price,
    paymentStatus,
    deliveryStatus,
    status,
    onDelete=()=>{}
  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
  
    const handleNavigation = (_id) => () => {
      navigation.navigate(SCREEN_NAAMES.HOME, {
        screen: SCREEN_NAAMES.PRODUCT_PAGE,
        params: { _id }
      });
    };
  
    const handleDeleteOrder = () => {
      Alert.alert(
        "Delete Order",
        "Are you sure you want to delete this order?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", onPress:onDelete, style: "destructive" }
        ]
      );
    };
  
    const getStatusStyle = (status) => {
      switch (status) {
        case "pending":
          return { backgroundColor: "#f0ad4e", color: "white" }; // Orange
        case "accepted":
          return { backgroundColor: "#5cb85c", color: "white" }; // Green
        case "shipped":
          return { backgroundColor: "#0275d8", color: "white" }; // Blue
        case "delivered":
          return { backgroundColor: "#5bc0de", color: "white" }; // Light Blue
        case "rejected":
          return { backgroundColor: "#d9534f", color: "white" }; // Red
        default:
          return { backgroundColor: "#ddd", color: "black" }; // Default Gray
      }
    };
  
    return (
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          padding: 10,
          marginVertical: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          ...COMMON_STYLES.BOX_SHADOW,
        }}
      >
        {/* Product Image */}
        <TouchableOpacity onPress={handleNavigation(productId)}>
          <FastImage
            onLoad={() => setIsLoading(false)}
            source={{
              uri: productImage,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: 60,
              height: 60,
              borderRadius: 10,
            }}
          />
          {isLoading && <View style={[styles.overlay]} />}
        </TouchableOpacity>
  
        {/* Product Details */}
        <View style={{ marginLeft: 10, flex: 1 }}>
          {/* Product Name (Navigates on Tap) */}
          <TouchableOpacity onPress={handleNavigation(productId)}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>{productName}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: "gray" }}>Price: ${price}</Text>
          <Text>Quantity: {quantity}</Text>
  
          {/* Status Badges */}
          <View style={{ flexDirection: "row", gap: 5, marginTop: 5 }}>
            <Text
              style={{
                ...getStatusStyle(status),
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 5,
                fontSize: 12,
              }}
            >
              {status.toUpperCase()}
            </Text>
            <Text
              style={{
                ...getStatusStyle(deliveryStatus),
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 5,
                fontSize: 12,
              }}
            >
              {deliveryStatus.toUpperCase()}
            </Text>
            <Text
              style={{
                ...getStatusStyle(paymentStatus),
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 5,
                fontSize: 12,
              }}
            >
              {paymentStatus.toUpperCase()}
            </Text>
          </View>
        </View>
  
        {/* Delete Icon */}
        <TouchableOpacity onPress={handleDeleteOrder} style={{ padding: 5 }}>
          <Trash2 size={20} color="red" />
        </TouchableOpacity>
      </View>
    );
  };



//   const OrderItem = ({
//   orderId,
//   productId,
//   productName,
//   productImage,
//   quantity,
//   price,
//   paymentStatus,
//   deliveryStatus,
//   status,
// }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const navigation = useNavigation();

//   const handleNavigation = (_id) => () => {
//     navigation.navigate(SCREEN_NAAMES.HOME, {
//       screen: SCREEN_NAAMES.PRODUCT_PAGE, // Ensure nested navigation
//       params: { _id: productId }
//     });
//   };

//   return (
//     <View
//       style={{
//         ...COMMON_STYLES.BOX_SHADOW,
//         backgroundColor: "white",
//         width: "100%",
//         marginVertical: 5,
//         borderRadius: 10,
//         padding: 10,
//         flexDirection: "row",
        
//       }}
//     >
//       {/* Product Image */}
//       <TouchableOpacity onPress={handleNavigation(productId)}>
//         <FastImage
//           onLoad={() => setIsLoading(false)}
//           source={{
//             uri: productImage,
//             priority: FastImage.priority.high,
//           }}
//           resizeMode={FastImage.resizeMode.cover}
//           style={{
//             width: 60,
//             height: 60,
//             borderRadius: 10,
//             marginTop:5
//           }}
//         />
//         {isLoading && <View style={[styles.overlay]} />}
//       </TouchableOpacity>

//       {/* Product Details */}
//       <View style={{ marginLeft: 10, flex: 1 }}>
//         {/* Product Name (Navigates on Tap) */}
//         <TouchableOpacity onPress={handleNavigation(productId)}>
//           <Text style={{ fontWeight: "bold", fontSize: 16 }}>{productName}</Text>
//         </TouchableOpacity>

//         {/* Order Details */}
//         <Text>Quantity: {quantity}</Text>
//         <Text>Status: {status}</Text>
//         <Text>Delivery: {deliveryStatus}</Text>
//         <Text>Payment: {paymentStatus}</Text>
//       </View>
//     </View>
//   );
// };


const OrderPage = () => {
  const queryClient = useQueryClient();
  const authSheetRef = useRef(null);
  const isLoggedIn = useAuthStore(state=>state.user?true:false)
  const { data, error, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn:  fetchOrders,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 4,
  });


  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      await post("/delete-order", {
        orderId
      }); // Assuming your backend supports DELETE request
    },
    onMutate: async (orderId) => {
      // Optimistic UI update: Remove order from cache before API response
      await queryClient.cancelQueries(["orders"]);
  
      const previousOrders = queryClient.getQueryData(["orders"]);
      queryClient.setQueryData(["orders"], (oldData) => ({
        ...oldData,
        orders: oldData?.orders?.filter((order) => order._id !== orderId),
      }));
  
      return { previousOrders };
    },
    onError: (err, orderId, context) => {
      // Rollback if API call fails
      queryClient.setQueryData(["orders"], context.previousOrders);
    },
    onSettled: () => {
      // Refetch to ensure fresh data
      queryClient.invalidateQueries(["orders"]);
    },
  });





    const handleOpenSheet = useCallback(()=>{
      if(!isLoggedIn){
        setTimeout(()=>{
          authSheetRef?.current?.openSheet();
  
        },0)
      }
    },[isLoggedIn])
  useFocusEffect(
    handleOpenSheet
  );
  
    useEffect(() => {
      handleOpenSheet()
    }, [isLoggedIn]);


   

    if (!isLoggedIn ) {
      return (
        <View style={styles.container}>
          {/* <Text style={styles.title}>orders page ha without auth</Text> */}

          <AuthSheet ref={authSheetRef} />
        </View>
      );
    }
      if (isLoading) {
        return <ActivityIndicator size="large" style={styles.loader} />;
      }
    
      if (error) {
        return <Text style={styles.errorText}>Failed to load orders.</Text>;
      }
  return (
  <View style={{ flex: 1, padding: 10, backgroundColor: "white" }}>
    <FlashList
      estimatedItemSize={150}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item._id.toString()}
      ListEmptyComponent={<NotFound title="No orders found" />}
      ListHeaderComponent={<Text style={styles.heading}>Orders</Text>}
      data={data?.orders}
      renderItem={({ item, index }) => (
        <OrderItem
        orderId={item._id}
        productId={item.products[0].productId} // Assuming only one product per order
        productName={item.products[0].name}
        productImage={item.products[0].image}
        quantity={item.products[0].quantity}
        price={item.totalPrice}
        paymentStatus={item.paymentStatus}
        deliveryStatus={item.deliveryStatus}
        status={item.status}
        onDelete={() => deleteOrderMutation.mutate(item._id)} // Pass delete function

      />

      )}
    />
  </View>
  )
}

export default OrderPage

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", textAlign: "center", marginTop: 20, fontSize: 16 },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

});