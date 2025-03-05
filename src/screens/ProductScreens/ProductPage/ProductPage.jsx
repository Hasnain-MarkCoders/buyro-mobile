import React, {  useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { get, post } from "./../../../config/requests";
import ImageView from "react-native-image-viewing";
import { Fullscreen } from 'lucide-react-native';
import {  confirmPaymentSheetPayment, initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { Toast } from "toastify-react-native";
import AuthSheet from "../../AuthScreens/Auth/Auth";
import useAuthStore from "./../../../zustand/authStore";
const ProductImageComponent = ({
  item,
  index,
  currentIndex,
  handleSelectedImage = () => { }
}) => {
  
  const [isLoading, setIsLoading] = useState(true)
  return (<>
    <TouchableOpacity style={{

    }} onPress={() => handleSelectedImage(item, index)}>
      <FastImage
        onLoad={() => { setIsLoading(false) }}
        source={{ uri: item, priority: FastImage.priority.high }} style={[styles.thumbnail, index === currentIndex && styles.selectedThumbnail]} resizeMode={FastImage.resizeMode.cover} />
      {isLoading && <View style={styles.overlayThumbnail}>
      </View>}
    </TouchableOpacity>

  </>)
}
const fetchProduct = async (_id, cb) => {
  const response = await get(`/product/${_id}`);
  if (response.data) {
    cb(response.data.images[0], 0)
  }
  return response.data;
};

const ProductPage = () => {
  // const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => !!state.user);

  const route = useRoute();
  const authSheetRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [visible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleSelectedImage = (uri, index) => {
    setSelectedImage(uri)
    setCurrentIndex(index)
  }
  const closeImageView = () => {
    setIsVisible(false);
  };
  const _id = route?.params?._id;

  const { data: product, error, isLoading } = useQuery({
    queryKey: ["product", _id],
    queryFn: () => fetchProduct(_id, handleSelectedImage),
    enabled: !!_id,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 4,
  });
  const showToasts = () => {
    Toast.success("Payment done");
  };

  const confirmPayment = async (paymentOption, paymentIntentId) => {
    const {error} = await confirmPaymentSheetPayment();
    if (error) {
    } else {
      console.log("paymentIntentId============>", paymentIntentId)
      showToasts()

     await createOrder(paymentIntentId)
    }
  };
  const handlePayment = async (paymentIntentId) => {
    try {
      const {error, paymentOption} = await presentPaymentSheet();
      if (error) {
      } else {
        console.log('Payment successful', paymentOption);
        confirmPayment(paymentOption, paymentIntentId)
      }
    } catch (e) {
    }
  };
  const getpaymentIndent = async () => {
    try{
      if (!isLoggedIn){
        return authSheetRef.current.openSheet()
      }
      setIsPaymentLoading(true)
      const res =await post('/create-payment-indent', 
        { 
          productId: _id,
          quantity: 1
         }
      )
  
      if(res?.data?.clientSecret){
        await initPaymentSheet({
          paymentIntentClientSecret: res.data.clientSecret,
          customFlow: true,
          merchantDisplayName: 'Buyro',
        });
       await handlePayment(res?.data?.paymentIntentId)
      }
    }catch(error){
      console.log(error)
      setIsPaymentLoading(false)

    }

   
    return res.data
  }
 

  const createOrder = async (paymentIntentId) => {
    try{
      
      const res =await post('/create-order', 
        { 
          productId: _id,
          quantity: 1,
          paymentIntentId
         }
      )
  
      if(res?.data){
        console.log("order ===========", JSON.stringify(res?.data, null , 6))
      }
    }catch(error){
      console.log(error)
    }finally{
      setIsPaymentLoading(false)

    }

   
    return res.data
  }
 

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Failed to load product.</Text>;
  }
 

  return (
    <>
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={styles.container}>
      {product && (
        <View style={{ flex: 1, paddingBottom: 200 }}>
          <TouchableOpacity
            onPress={() => {
              setIsVisible(true);
            }}
          >
            <View style={[styles.mainImageWrapper, { height: 500 }]}>
              <FastImage
                resizeMode={FastImage.resizeMode.cover}

                source={{ uri: selectedImage || product.images[0], priority: FastImage.priority.high }}
                style={[styles.mainImage, { height: 500 }]}
              />
              <View style={{
                position: "absolute",
                bottom: 10,
                right: 10,
              }}>
                <TouchableOpacity onPress={() => {
                  handleSelectedImage(selectedImage, currentIndex)
                  setIsVisible(true)
                }}>

                  <Fullscreen size={40} color={"black"} fill={"transparent"} />
                </TouchableOpacity>

              </View>
            </View>
          </TouchableOpacity>
          <FlashList
            horizontal
            data={product.images}
            extraData={currentIndex}
            renderItem={({ item, index }) => (
              <ProductImageComponent item={item} index={index} currentIndex={currentIndex} handleSelectedImage={handleSelectedImage} />
            )}
            keyExtractor={(item, index) => index.toString()}
            estimatedItemSize={60}
            showsHorizontalScrollIndicator={false}
          />
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>Rs. {product.price}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <TouchableOpacity  style={styles.button} onPress={getpaymentIndent}>
            <Text style={styles.buttonText}>{isPaymentLoading? "Processing...":"Check out"}</Text>
          </TouchableOpacity>
        </View>
      )}
      <ImageView
      swipeToCloseEnabled={false}
        imageIndex={currentIndex}
        images={product.images.map(uri => ({ uri: uri }))}
        visible={visible}
        onRequestClose={closeImageView}
      />
    </ScrollView>
         <AuthSheet ref={authSheetRef} /> 
    </>

  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: "100%",
    borderRadius: 5,
    height: "100%"
  },
  overlayThumbnail: {
    top: 5,
    right: 5,
    position: "absolute",
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 60,
    borderRadius: 5,
    height: 60
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", textAlign: "center", marginTop: 20, fontSize: 16 },
  mainImageWrapper: { position: "relative", width: "100%", overflow: "hidden", backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 10 },
  mainImage: { width: "100%", height: "100%", borderRadius: 10 },
  viewImageButton: { position: "absolute", bottom: 10, right: 10, fill: "white" },
  thumbnail: { width: 60, height: 60, margin: 5, marginLeft: 0, borderRadius: 5 },
  selectedThumbnail: { borderWidth: 3, borderColor: "black" },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 10 },
  price: { fontSize: 18, color: "green" },
  description: { marginVertical: 10, fontSize: 16 },
  button: { backgroundColor: "#000", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default ProductPage;
